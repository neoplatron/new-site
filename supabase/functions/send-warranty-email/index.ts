import { PDFDocument, StandardFonts, rgb, degrees, PDFFont } from "npm:pdf-lib@1.17.1";
import { LOGO_PNG_BASE64 } from "./logo.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WarrantyEmailPayload {
  action?: "send" | "download";
  email: string;
  customerName: string;
  phone?: string | null;
  customerAddress?: string | null;
  city?: string | null;
  state?: string | null;
  pinCode?: string | null;
  verificationUid: string;
  warrantyType: string; // "vehicle" | "generator"
  productType: string;
  vehicleNumber?: string | null;
  fuelType?: string | null;
  kmsDriven?: string | null;
  installationDate: string; // ISO date
  invoiceNumber?: string | null;
  installedBy?: string | null;
  sellerCode?: string | null;
  registrationDate: string; // ISO date
  expiryDate: string; // ISO date
  garageName?: string | null;
}

const NAVY = rgb(0.09, 0.22, 0.44);
const NAVY_LIGHT = rgb(0.92, 0.95, 0.98);
const DARK = rgb(0.13, 0.13, 0.15);
const MUTED = rgb(0.45, 0.47, 0.5);
const LINE = rgb(0.85, 0.86, 0.88);

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}

function truncateToWidth(font: PDFFont, text: string, size: number, maxWidth: number): string {
  if (!text) return "-";
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && font.widthOfTextAtSize(t + "…", size) > maxWidth) {
    t = t.slice(0, -1);
  }
  return t + "…";
}

async function buildWarrantyCardPdf(data: WarrantyEmailPayload): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const PAGE_W = 595;
  const PAGE_H = 842;
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const MARGIN = 30;
  const CONTENT_X = MARGIN + 12;
  const CONTENT_W = PAGE_W - 2 * (MARGIN + 12);

  // ---- Watermark (drawn first, sits behind everything) ----
  for (let i = 0; i < 4; i++) {
    page.drawText("NEOPLATRON", {
      x: 40,
      y: 720 - i * 190,
      size: 60,
      font: boldFont,
      color: rgb(0.9, 0.92, 0.95),
      opacity: 0.5,
      rotate: degrees(35),
    });
  }

  // ---- Outer double border frame ----
  page.drawRectangle({
    x: MARGIN,
    y: MARGIN,
    width: PAGE_W - 2 * MARGIN,
    height: PAGE_H - 2 * MARGIN,
    borderColor: NAVY,
    borderWidth: 1.5,
  });
  // ---- Header: site logo + title on one line ----
  const logoImage = await pdfDoc.embedPng(LOGO_PNG_BASE64);
  const logoDisplayHeight = 36;
  const logoDisplayWidth = (logoImage.width / logoImage.height) * logoDisplayHeight;
  const headerY = PAGE_H - MARGIN - 20 - logoDisplayHeight;

  const title = "CERTIFICATE OF WARRANTY";
  const titleSize = 17;
  const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
  const headerRowWidth = logoDisplayWidth + 16 + titleWidth;
  const headerRowX = (PAGE_W - headerRowWidth) / 2;

  page.drawImage(logoImage, {
    x: headerRowX,
    y: headerY,
    width: logoDisplayWidth,
    height: logoDisplayHeight,
  });
  page.drawText(title, {
    x: headerRowX + logoDisplayWidth + 16,
    y: headerY + (logoDisplayHeight - titleSize) / 2 + 3,
    size: titleSize,
    font: boldFont,
    color: NAVY,
  });

  const bannerY = headerY - 16;
  page.drawLine({
    start: { x: CONTENT_X, y: bannerY },
    end: { x: CONTENT_X + CONTENT_W, y: bannerY },
    thickness: 1,
    color: LINE,
  });

  // ---- Verification UID badge ----
  const badgeY = bannerY - 46;
  const badgeH = 42;
  page.drawRectangle({
    x: CONTENT_X,
    y: badgeY,
    width: CONTENT_W,
    height: badgeH,
    color: NAVY_LIGHT,
    borderColor: NAVY,
    borderWidth: 1,
  });
  page.drawText("VERIFICATION UID", {
    x: CONTENT_X + 14,
    y: badgeY + badgeH - 16,
    size: 8,
    font,
    color: MUTED,
  });
  page.drawText(data.verificationUid, {
    x: CONTENT_X + 14,
    y: badgeY + 8,
    size: 20,
    font: boldFont,
    color: NAVY,
  });

  // ---- Section helpers ----
  let cursorY = badgeY - 30;

  const sectionHeader = (label: string, y: number): number => {
    page.drawText(label, { x: CONTENT_X, y, size: 11, font: boldFont, color: NAVY });
    page.drawLine({
      start: { x: CONTENT_X, y: y - 5 },
      end: { x: CONTENT_X + CONTENT_W, y: y - 5 },
      thickness: 0.75,
      color: LINE,
    });
    return y - 26;
  };

  const fieldGrid = (fields: [string, string][], startY: number, columns = 2): number => {
    const colWidth = CONTENT_W / columns;
    let maxRow = 0;
    fields.forEach(([label, value], idx) => {
      const col = idx % columns;
      const row = Math.floor(idx / columns);
      const x = CONTENT_X + col * colWidth;
      const y = startY - row * 34;
      page.drawText(label.toUpperCase(), { x, y, size: 7.5, font, color: MUTED });
      const val = truncateToWidth(boldFont, value || "-", 11, colWidth - 16);
      page.drawText(val, { x, y: y - 14, size: 11, font: boldFont, color: DARK });
      maxRow = Math.max(maxRow, row);
    });
    return startY - (maxRow + 1) * 34 - 12;
  };

  // ---- Customer details ----
  cursorY = sectionHeader("CUSTOMER DETAILS", cursorY);
  cursorY = fieldGrid(
    [
      ["Customer Name", data.customerName],
      ["Phone", data.phone || "-"],
      ["Email", data.email],
      ["Address", data.customerAddress || "-"],
      ["City", data.city || "-"],
      ["State / PIN Code", `${data.state || "-"} - ${data.pinCode || "-"}`],
    ],
    cursorY
  );

  // ---- Installation & seller details ----
  cursorY = sectionHeader("INSTALLATION & SELLER DETAILS", cursorY);
  cursorY = fieldGrid(
    [
      ["Installation Date", formatDate(data.installationDate)],
      ["Invoice Number", data.invoiceNumber || "-"],
      ["Installed By", data.installedBy || "-"],
      ["Seller Code", data.sellerCode || "-"],
      ["Garage / Seller Name", data.garageName || "-"],
    ],
    cursorY
  );

  // ---- Product details ----
  cursorY = sectionHeader("PRODUCT DETAILS", cursorY);
  const productFields: [string, string][] =
    data.warrantyType === "vehicle"
      ? [
          ["Warranty Type", "Vehicle Installation"],
          ["Vehicle Type", data.productType],
          ["Vehicle Number", data.vehicleNumber || "-"],
          ["Fuel Type", data.fuelType || "-"],
          ["Kms Driven at Installation", data.kmsDriven ? `${data.kmsDriven} km` : "-"],
        ]
      : [
          ["Warranty Type", "Generator Installation"],
          ["Generator Type", data.productType],
        ];
  cursorY = fieldGrid(productFields, cursorY);

  // ---- Warranty validity ----
  cursorY = sectionHeader("WARRANTY VALIDITY", cursorY);
  cursorY = fieldGrid(
    [
      ["Registration Date", formatDate(data.registrationDate)],
      ["Expiry Date", formatDate(data.expiryDate)],
      ["Warranty Period", "1 Year"],
      ["Status", "Active"],
    ],
    cursorY
  );

  // ---- Footer ----
  const footerY = MARGIN + 70;
  page.drawLine({
    start: { x: CONTENT_X, y: footerY + 40 },
    end: { x: CONTENT_X + CONTENT_W, y: footerY + 40 },
    thickness: 0.75,
    color: LINE,
    dashArray: [3, 3],
  });

  // Terms
  const terms =
    "This certificate is proof of Neoplatron warranty registration. Warranty is valid for the period stated above from the date of installation, subject to the Terms & Conditions at neoplatron.in/warranty. Please retain this certificate for future claims.";
  const wrapWidth = CONTENT_W;
  const words = terms.split(" ");
  let line = "";
  let lineY = footerY - 12;
  const termsSize = 7.5;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, termsSize) > wrapWidth) {
      page.drawText(line, { x: CONTENT_X, y: lineY, size: termsSize, font, color: MUTED });
      line = word;
      lineY -= 11;
    } else {
      line = testLine;
    }
  }
  if (line) {
    page.drawText(line, { x: CONTENT_X, y: lineY, size: termsSize, font, color: MUTED });
  }

  return pdfDoc.save();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as WarrantyEmailPayload;

    if (!payload.verificationUid) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdfBytes = await buildWarrantyCardPdf(payload);

    if (payload.action === "download") {
      return new Response(pdfBytes, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="warranty-card-${payload.verificationUid}.pdf"`,
        },
      });
    }

    if (!payload.email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdfBase64 = uint8ArrayToBase64(pdfBytes);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const fromAddress = Deno.env.get("WARRANTY_EMAIL_FROM") || "Neoplatron Warranty <onboarding@resend.dev>";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [payload.email],
        subject: `Your Neoplatron Warranty Card - ${payload.verificationUid}`,
        html: `
          <p>Hi ${payload.customerName},</p>
          <p>Thank you for registering your ${payload.warrantyType === "vehicle" ? "vehicle" : "generator"} installation with Neoplatron.</p>
          <p>Your Verification UID is <strong>${payload.verificationUid}</strong>. Your warranty certificate is attached as a PDF — please keep it safe, you'll need the UID to check your warranty status or file a claim.</p>
          <p>Regards,<br/>Neoplatron Team</p>
        `,
        attachments: [
          {
            filename: `warranty-card-${payload.verificationUid}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      throw new Error(`Resend API error: ${resendResponse.status} ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-warranty-email error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
