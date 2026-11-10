// Creates (or resets) an admin/telecaller login with a temporary password.
// Callable only by a signed-in master. No email is sent: the master hands the
// password over, and the user is asked to change it on first login.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // 1. Caller must be a master.
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: { user: caller } } = await admin.auth.getUser(token);
    if (!caller) return json({ error: "Not signed in" }, 401);
    const { data: callerRole } = await admin
      .from("user_roles").select("role").eq("user_id", caller.id).maybeSingle();
    if (callerRole?.role !== "master") return json({ error: "Only the master admin can do this" }, 403);

    // 2. Validate input.
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = String(body.role ?? "");
    const name = String(body.name ?? "").trim() || null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email" }, 400);
    if (password.length < 8) return json({ error: "Password must be at least 8 characters" }, 400);
    if (role !== "admin" && role !== "telecaller") return json({ error: "Invalid role" }, 400);

    const { data: existingWl } = await admin
      .from("admin_whitelist").select("role").eq("email", email).maybeSingle();
    if (existingWl?.role === "master") return json({ error: "A master account cannot be changed here" }, 400);

    // 3. Whitelist first, so the signup trigger assigns the role.
    const { error: wlErr } = await admin
      .from("admin_whitelist")
      .upsert({ email, role, name, created_by: caller.id }, { onConflict: "email" });
    if (wlErr) throw wlErr;

    // 4. Create the login, or reset the password if it already exists.
    const attrs = { password, email_confirm: true, user_metadata: { must_change_password: true } };
    let userId: string | undefined;
    let existing = false;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({ email, ...attrs });
    if (created?.user) {
      userId = created.user.id;
    } else {
      for (let page = 1; !userId && page <= 20; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) throw error;
        userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
        if (data.users.length < 200) break;
      }
      if (!userId) throw createErr ?? new Error("Could not create user");
      existing = true;
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, attrs);
      if (updErr) throw updErr;
    }

    const { error: roleErr } = await admin
      .from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id" });
    if (roleErr) throw roleErr;

    return json({ ok: true, existing });
  } catch (e) {
    console.error("create-staff-user failed:", e);
    return json({ error: e instanceof Error ? e.message : "Failed to create user" }, 500);
  }
});
