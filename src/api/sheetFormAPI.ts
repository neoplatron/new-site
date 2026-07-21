// src/api/sheetFormAPI.ts
// Submits inquiry forms directly to a Google Apps Script Web App, which appends
// a row to the matching tab of a Google Sheet. No backend/DB involved.

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

export type FormType = "franchise" | "distribution" | "installation";

export async function submitToSheet(
  formType: FormType,
  data: Record<string, string>
) {
  if (!SCRIPT_URL) {
    throw new Error(
      "VITE_GOOGLE_SCRIPT_URL is not set. Add it to .env after deploying the Apps Script Web App."
    );
  }

  // mode: "no-cors" is required for browser -> Apps Script Web App posts;
  // the response is opaque, so we treat a resolved fetch as success.
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ formType, ...data }),
  });
}
