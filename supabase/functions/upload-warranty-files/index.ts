import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ROOT_FOLDER_NAME = "Neoplatron Warranty Files";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const MAX_BYTES = 15 * 1024 * 1024;
// Registrations are uploaded to right after they are created, so anything older is rejected.
const UPLOAD_WINDOW_MS = 30 * 60 * 1000;
const ALLOWED_TYPES = /^(image\/(jpeg|png|webp|heic|heif|gif)|application\/pdf)$/;

interface UploadPayload {
  action?: "upload" | "finalize";
  verificationUid: string;
  slot?: string; // "invoice" | "rc" | "front" | ... | "extra1"
  label?: string;
  name?: string;
  type?: string;
  data?: string; // data URL
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const safeName = (s: string) =>
  s.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "file";

const extFor = (type: string, name: string) => {
  const fromName = name.includes(".") ? name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  if (fromName) return fromName;
  return type === "application/pdf" ? "pdf" : (type.split("/")[1] ?? "bin");
};

const getAccessToken = async (): Promise<string> => {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
      refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN") ?? "",
      grant_type: "refresh_token",
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) throw new Error(`Google auth failed: ${body.error_description ?? body.error}`);
  return body.access_token;
};

const driveFetch = async (token: string, url: string, init: RequestInit = {}) => {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  const body = await res.json();
  if (!res.ok) throw new Error(`Drive error: ${body.error?.message ?? res.status}`);
  return body;
};

// Find a folder by name under a parent (created by this app), or create it.
const findOrCreateFolder = async (token: string, name: string, parentId?: string): Promise<string> => {
  const escaped = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  let q = `mimeType='${FOLDER_MIME}' and name='${escaped}' and trashed=false`;
  q += parentId ? ` and '${parentId}' in parents` : ` and 'root' in parents`;
  const found = await driveFetch(token, `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({ q, fields: "files(id)", pageSize: "1" })}`);
  if (found.files?.length) return found.files[0].id;

  const created = await driveFetch(token, "https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER_MIME, ...(parentId ? { parents: [parentId] } : {}) }),
  });
  return created.id;
};

const uploadFile = async (token: string, folderId: string, fileName: string, mimeType: string, bytes: Uint8Array) => {
  const boundary = `b${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
  const enc = new TextEncoder();
  const head = enc.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
  );
  const tail = enc.encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(head.length + bytes.length + tail.length);
  body.set(head, 0);
  body.set(bytes, head.length);
  body.set(tail, head.length + bytes.length);

  return await driveFetch(
    token,
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body },
  );
};

const SHEET_TITLE = "Neoplatron Warranty Registrations";
const SHEET_HEADERS = [
  "Registered At", "Warranty UID", "Customer Name", "Phone", "Email", "Address", "City", "State", "PIN Code",
  "Seller Code", "Garage", "Installed By", "Installation Date", "Invoice Number", "Invoice Date", "Kit Serial Number",
  "Product Type", "Warranty Type", "Vehicle/Generator Type", "Vehicle/Generator Model", "Vehicle Number", "Fuel Type",
  "Kms Driven", "Terms Accepted At", "Warranty Expiry", "Drive Folder",
];

// Find the registrations spreadsheet (created by this app) or create it with a header row.
const getSheetId = async (token: string, rootId: string): Promise<string> => {
  const q = `mimeType='application/vnd.google-apps.spreadsheet' and name='${SHEET_TITLE}' and '${rootId}' in parents and trashed=false`;
  const found = await driveFetch(token, `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({ q, fields: "files(id)", pageSize: "1" })}`);
  if (found.files?.length) return found.files[0].id;

  const created = await driveFetch(token, "https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: SHEET_TITLE, mimeType: "application/vnd.google-apps.spreadsheet", parents: [rootId] }),
  });
  await driveFetch(
    token,
    `https://sheets.googleapis.com/v4/spreadsheets/${created.id}/values/A1:append?valueInputOption=RAW`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: [SHEET_HEADERS] }),
    },
  );
  return created.id;
};

// Append the registration (read from the database, not the client) to the spreadsheet once.
const finalize = async (verificationUid: string) => {
  if (!verificationUid) return json({ error: "Missing fields" }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: r, error } = await supabase
    .from("warranty_registrations")
    .select("*")
    .eq("verification_uid", verificationUid)
    .maybeSingle();
  if (error || !r) return json({ error: "Registration not found" }, 404);
  if (r.sheet_logged_at) return json({ ok: true, alreadyLogged: true });
  if (Date.now() - new Date(r.created_at).getTime() > UPLOAD_WINDOW_MS) {
    return json({ error: "Upload window closed for this registration" }, 403);
  }

  const token = await getAccessToken();
  const rootId = await findOrCreateFolder(token, ROOT_FOLDER_NAME);
  const sheetId = await getSheetId(token, rootId);

  const expiry = new Date(r.installation_date);
  expiry.setFullYear(expiry.getFullYear() + 1);

  const row = [
    r.registration_date, r.verification_uid, r.customer_name, r.phone, r.email, r.customer_address, r.city, r.state,
    r.pin_code, r.seller_code_used, r.garage_name, r.installed_by, r.installation_date, r.invoice_number,
    r.invoice_date, r.kit_serial_number, r.install_product_type, r.warranty_type, r.product_type, r.vehicle_model,
    r.vehicle_number, r.fuel_type, r.kms_driven, r.terms_accepted_at, expiry.toISOString().slice(0, 10),
    r.drive_folder_url,
  ].map((v) => (v === null || v === undefined ? "" : String(v)));

  await driveFetch(
    token,
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: [row] }) },
  );

  await supabase.from("warranty_registrations").update({ sheet_logged_at: new Date().toISOString() }).eq("id", r.id);
  return json({ ok: true, sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}` });
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const payload: UploadPayload = await req.json();
    const { verificationUid, slot, name, type, data } = payload;

    if (payload.action === "finalize") return await finalize(verificationUid);

    if (!verificationUid || !slot || !name || !type || !data) return json({ error: "Missing fields" }, 400);
    if (!ALLOWED_TYPES.test(type)) return json({ error: "Unsupported file type" }, 400);
    if (!/^[a-zA-Z0-9]+$/.test(slot)) return json({ error: "Invalid slot" }, 400);

    const commaAt = data.indexOf(",");
    if (commaAt < 0) return json({ error: "Invalid file data" }, 400);
    const bytes = Uint8Array.from(atob(data.slice(commaAt + 1)), (c) => c.charCodeAt(0));
    if (bytes.length > MAX_BYTES) return json({ error: "File too large (max 15 MB)" }, 413);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: row, error: rowError } = await supabase
      .from("warranty_registrations")
      .select("id, verification_uid, customer_name, created_at, drive_folder_id, drive_folder_url, installation_photos")
      .eq("verification_uid", verificationUid)
      .maybeSingle();

    if (rowError || !row) return json({ error: "Registration not found" }, 404);
    if (Date.now() - new Date(row.created_at).getTime() > UPLOAD_WINDOW_MS) {
      return json({ error: "Upload window closed for this registration" }, 403);
    }

    const token = await getAccessToken();

    let folderId: string = row.drive_folder_id;
    let folderUrl: string = row.drive_folder_url;
    if (!folderId) {
      const rootId = await findOrCreateFolder(token, ROOT_FOLDER_NAME);
      folderId = await findOrCreateFolder(token, `${row.verification_uid} - ${safeName(row.customer_name)}`, rootId);
      folderUrl = `https://drive.google.com/drive/folders/${folderId}`;
    }

    const base = payload.label ? safeName(payload.label) : slot;
    const fileName = `${base}.${extFor(type, name)}`;
    const file = await uploadFile(token, folderId, fileName, type, bytes);
    const url: string = file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`;

    // Swap the stored base64 for the Drive link so the row stays small.
    const update: Record<string, unknown> = { drive_folder_id: folderId, drive_folder_url: folderUrl };
    if (slot === "invoice") update.invoice_data = url;
    else if (slot === "rc") update.vehicle_rc_data = url;
    else {
      const photos = Array.isArray(row.installation_photos) ? row.installation_photos : [];
      update.installation_photos = photos.map((p: Record<string, unknown>) =>
        p.slot === slot ? { slot: p.slot, label: p.label, name: p.name, type: p.type, url } : p,
      );
    }
    const { error: updateError } = await supabase.from("warranty_registrations").update(update).eq("id", row.id);
    if (updateError) throw updateError;

    return json({ url, folderUrl });
  } catch (error) {
    console.error("upload-warranty-files error:", error);
    return json({ error: error instanceof Error ? error.message : "Upload failed" }, 500);
  }
});
