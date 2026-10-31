import { PDFDocument, StandardFonts, rgb, degrees, PDFFont, PDFPage } from "npm:pdf-lib@1.17.1";
import { LOGO_PNG_BASE64 } from "./logo.ts";
import {
  WARRANTY_TERMS,
  WARRANTY_TERMS_TITLE,
  WARRANTY_MANUFACTURER,
  WARRANTY_PRODUCT,
} from "../_shared/warrantyTerms.ts";

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
  invoiceDate?: string | null; // ISO date
  kitSerialNumber?: string | null;
  vehicleModel?: string | null;
  installProductType?: string | null;
  termsAcceptedAt?: string | null; // ISO date
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
      ["Invoice Date", formatDate(data.invoiceDate || "")],
      ["Installed By", data.installedBy || "-"],
      ["Seller Code", data.sellerCode || "-"],
      ["Garage / Seller Name", data.garageName || "-"],
    ],
    cursorY,
    3
  );

  // ---- Product details ----
  cursorY = sectionHeader("PRODUCT DETAILS", cursorY);
  const productFields: [string, string][] =
    data.warrantyType === "vehicle"
      ? [
          ["Kit Serial Number", data.kitSerialNumber || "-"],
          ["Product Type", data.installProductType || "-"],
          ["Vehicle Model", data.vehicleModel || "-"],
          ["Vehicle Type", data.productType],
          ["Vehicle Number", data.vehicleNumber || "-"],
          ["Fuel Type", data.fuelType || "-"],
          ["Kms Driven at Installation", data.kmsDriven ? `${data.kmsDriven} km` : "-"],
        ]
      : [
          ["Kit Serial Number", data.kitSerialNumber || "-"],
          ["Product Type", data.installProductType || "-"],
          ["Equipment Model", data.vehicleModel || "-"],
          ["Generator Type", data.productType],
        ];
  cursorY = fieldGrid(productFields, cursorY, 3);

  // ---- Warranty validity ----
  cursorY = sectionHeader("WARRANTY VALIDITY", cursorY);
  cursorY = fieldGrid(
    [
      ["Commencement Date", formatDate(data.installationDate)],
      ["Expiry Date", formatDate(data.expiryDate)],
      ["Warranty Period", "1 Year / 20,000 km*"],
      ["Status", "Active"],
    ],
    cursorY,
    4
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
    "This certificate is proof of Neoplatron warranty registration. *Warranty is valid for one year or 20,000 km from the date of installation, whichever is earlier, subject to the Warranty Terms & Conditions on the following pages. Please retain this certificate for future claims.";
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

  appendTermsPages(pdfDoc, data, font, boldFont);

  // ---- Page 2: Money Back Guarantee notes ----
  const page2 = pdfDoc.addPage([PAGE_W, PAGE_H]);
  page2.drawRectangle({
    x: MARGIN,
    y: MARGIN,
    width: PAGE_W - 2 * MARGIN,
    height: PAGE_H - 2 * MARGIN,
    borderColor: NAVY,
    borderWidth: 1.5,
  });

  const wrapLines = (text: string, f: PDFFont, size: number, maxWidth: number): string[] => {
    const lines: string[] = [];
    let current = "";
    for (const word of text.split(" ")) {
      const test = current ? `${current} ${word}` : word;
      if (f.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  let y2 = PAGE_H - MARGIN - 40;
  page2.drawText("MONEY BACK GUARANTEE - NOTE", { x: CONTENT_X, y: y2, size: 15, font: boldFont, color: NAVY });
  page2.drawLine({
    start: { x: CONTENT_X, y: y2 - 8 },
    end: { x: CONTENT_X + CONTENT_W, y: y2 - 8 },
    thickness: 1,
    color: LINE,
  });
  y2 -= 34;

  const drawBlock = (heading: string, items: string[], numbered: boolean) => {
    page2.drawText(heading, { x: CONTENT_X, y: y2, size: 11, font: boldFont, color: NAVY });
    y2 -= 20;
    items.forEach((item, i) => {
      const prefix = numbered ? `${i + 1}.` : "";
      const textX = CONTENT_X + 18;
      const lines = wrapLines(item, font, 9.5, CONTENT_W - 18);
      if (prefix) page2.drawText(prefix, { x: CONTENT_X, y: y2, size: 9.5, font: boldFont, color: DARK });
      lines.forEach((l) => {
        page2.drawText(l, { x: textX, y: y2, size: 9.5, font, color: DARK });
        y2 -= 13.5;
      });
      y2 -= 5;
    });
    y2 -= 10;
  };

  drawBlock(
    "Mileage Guarantee",
    [
      "Minimum mileage improvement: 30-40% in city and 50% on highway. These are only the minimums covered by the money back guarantee; up to 90% improvement is possible.",
      "Refund is subject to verification, testing and written approval by Neoplatron India Pvt. Ltd. The 5% GST is excluded, and installation, deinstallation, spare-parts and wiring charges (approx. Rs 3,000 in total) are deducted from any approved refund.",
    ],
    true
  );
  drawBlock(
    "Reserve-to-Reserve Mileage Test (Standard SOP)",
    [
      "Fill 5 litres of fuel when the reserve light comes on.",
      "Reset Trip A to zero.",
      "Drive on the 5 litres until the reserve light comes on again and note the distance on Trip A.",
      "Repeat the test 3 times in city driving and 3 times on the highway.",
    ],
    true
  );
  drawBlock(
    "Note",
    [
      "The reserve-to-reserve test is our standard SOP for mileage accuracy.",
      "We only refund after these tests are completed and the vehicle still does not show the minimum mileage improvement.",
      "After the tests, we carry out a system calibration.",
    ],
    true
  );
  page2.drawText("Full terms: neoplatron.in/money-back-policy", {
    x: CONTENT_X,
    y: y2,
    size: 8.5,
    font,
    color: MUTED,
  });

  return pdfDoc.save();
}

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(test, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Pages 2+: the registration details from the T&C document filled in with this
// customer's data, followed by the full Warranty Terms & Conditions.
function appendTermsPages(pdfDoc: PDFDocument, data: WarrantyEmailPayload, font: PDFFont, boldFont: PDFFont) {
  const PAGE_W = 595;
  const PAGE_H = 842;
  const MARGIN = 30;
  const X = MARGIN + 18;
  const W = PAGE_W - 2 * (MARGIN + 18);
  const TOP = PAGE_H - MARGIN - 50;
  const BOTTOM = MARGIN + 36;
  const BODY = 8.5;
  const LEADING = 11.5;

  let page!: PDFPage;
  let y = 0;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({
      x: MARGIN,
      y: MARGIN,
      width: PAGE_W - 2 * MARGIN,
      height: PAGE_H - 2 * MARGIN,
      borderColor: NAVY,
      borderWidth: 1.5,
    });
    page.drawText("NEOPLATRON INDIA PVT. LTD.", { x: X, y: PAGE_H - MARGIN - 26, size: 8, font: boldFont, color: NAVY });
    const ref = `Warranty No. ${data.verificationUid}`;
    page.drawText(ref, {
      x: X + W - font.widthOfTextAtSize(ref, 8),
      y: PAGE_H - MARGIN - 26,
      size: 8,
      font,
      color: MUTED,
    });
    page.drawLine({
      start: { x: X, y: PAGE_H - MARGIN - 34 },
      end: { x: X + W, y: PAGE_H - MARGIN - 34 },
      thickness: 0.75,
      color: LINE,
    });
    const pageNo = `Page ${pdfDoc.getPageCount()}`;
    page.drawText("Neoplatron India Pvt. Ltd. | Warranty Terms & Conditions", { x: X, y: MARGIN + 14, size: 7, font, color: MUTED });
    page.drawText(pageNo, { x: X + W - font.widthOfTextAtSize(pageNo, 7), y: MARGIN + 14, size: 7, font, color: MUTED });
    y = TOP;
  };

  const ensure = (h: number) => {
    if (y - h < BOTTOM) newPage();
  };

  const paragraph = (text: string, opts: { x?: number; size?: number; bold?: boolean; color?: ReturnType<typeof rgb> } = {}) => {
    const px = opts.x ?? X;
    const size = opts.size ?? BODY;
    const f = opts.bold ? boldFont : font;
    for (const ln of wrapText(f, text, size, X + W - px)) {
      ensure(LEADING);
      page.drawText(ln, { x: px, y, size, font: f, color: opts.color ?? DARK });
      y -= LEADING;
    }
  };

  newPage();

  // ---- Title ----
  const title = WARRANTY_TERMS_TITLE.toUpperCase();
  page.drawText(title, { x: X + (W - boldFont.widthOfTextAtSize(title, 13)) / 2, y, size: 13, font: boldFont, color: NAVY });
  y -= 28;

  // ---- Warranty registration details (filled) ----
  page.drawText("WARRANTY REGISTRATION DETAILS", { x: X, y, size: 10, font: boldFont, color: NAVY });
  y -= 8;

  const isVehicle = data.warrantyType === "vehicle";
  const installer = [data.garageName, data.sellerCode ? `(Seller Code ${data.sellerCode})` : "", data.installedBy ? `- Technician: ${data.installedBy}` : ""]
    .filter(Boolean)
    .join(" ");
  const rows: [string, string][] = [
    ["Effective Date", formatDate(data.registrationDate)],
    ["Manufacturer", WARRANTY_MANUFACTURER],
    ["Product", WARRANTY_PRODUCT],
    ["Warranty Number", data.verificationUid],
    ["Customer Name", data.customerName],
    ["Mobile Number", data.phone || "-"],
    [isVehicle ? "Vehicle Model" : "Equipment Model", [data.vehicleModel, data.productType].filter(Boolean).join(" - ") || "-"],
    [isVehicle ? "Vehicle Registration Number" : "Equipment ID", data.vehicleNumber || "-"],
    ["Kit Serial Number", data.kitSerialNumber || "-"],
    ["Invoice Number and Date", `${data.invoiceNumber || "-"}  |  ${formatDate(data.invoiceDate || "")}`],
    ["Installation Date", formatDate(data.installationDate)],
    ["Authorised Dealer/Installer", installer || "-"],
    ["Warranty Commencement Date", formatDate(data.installationDate)],
    ["Warranty Expiry Date", `${formatDate(data.expiryDate)} or 20,000 km, whichever is earlier`],
  ];

  const LABEL_W = 165;
  const ROW_PAD = 5;
  rows.forEach(([label, value], i) => {
    const valueLines = wrapText(boldFont, value || "-", 9, W - LABEL_W - 16);
    const rowH = Math.max(1, valueLines.length) * 12 + ROW_PAD * 2;
    ensure(rowH);
    const top = y;
    if (i % 2 === 0) {
      page.drawRectangle({ x: X, y: top - rowH, width: W, height: rowH, color: NAVY_LIGHT });
    }
    page.drawText(label, { x: X + 8, y: top - ROW_PAD - 9, size: 8.5, font, color: MUTED });
    valueLines.forEach((ln, li) => {
      page.drawText(ln, { x: X + LABEL_W, y: top - ROW_PAD - 9 - li * 12, size: 9, font: boldFont, color: DARK });
    });
    y = top - rowH;
  });
  page.drawRectangle({ x: X, y, width: W, height: TOP - 36 - y, borderColor: LINE, borderWidth: 0.75 });
  y -= 22;

  // ---- Terms & conditions ----
  for (const section of WARRANTY_TERMS) {
    ensure(LEADING * 4);
    y -= 4;
    page.drawText(section.title, { x: X, y, size: 10, font: boldFont, color: NAVY });
    y -= LEADING + 3;

    for (const item of section.items) {
      if (item.subheading) {
        ensure(LEADING * 2);
        paragraph(`${item.n} ${item.text}`, { bold: true });
        continue;
      }
      if (item.n) {
        ensure(LEADING);
        page.drawText(item.n, { x: X, y, size: BODY, font: boldFont, color: DARK });
        paragraph(item.text, { x: X + 34 });
      } else {
        paragraph(item.text, { x: X + 34 });
      }
      for (const b of item.bullets ?? []) {
        const lines = wrapText(font, b, BODY, W - 52);
        lines.forEach((ln, li) => {
          ensure(LEADING);
          if (li === 0) page.drawText("•", { x: X + 40, y, size: BODY, font, color: DARK });
          page.drawText(ln, { x: X + 50, y, size: BODY, font, color: DARK });
          y -= LEADING;
        });
      }
      y -= 3;
    }
  }

  // ---- Acknowledgement line ----
  ensure(LEADING * 4);
  y -= 8;
  page.drawLine({ start: { x: X, y: y + 6 }, end: { x: X + W, y: y + 6 }, thickness: 0.75, color: LINE, dashArray: [3, 3] });
  y -= 6;
  const accepted = data.termsAcceptedAt
    ? `Accepted electronically by ${data.customerName} at the time of warranty registration on ${formatDate(data.termsAcceptedAt)}. `
    : "";
  paragraph(`${accepted}This document is system generated and does not require a signature.`, { size: 7.5, color: MUTED });
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
