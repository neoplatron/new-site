import { supabase } from "../integrations/supabase/client";
import { submitToSheet } from "./sheetFormAPI";
import { guessState } from "../data/indianStates";

export interface PartnerLeadInput {
  fullName: string;
  mobileNumber: string;
  email: string;
  cityState: string;
  territory: string;
  occupation: string;
  priorExperience?: string;
  investmentBudget?: string;
}

// Franchise / distribution enquiries: saved to Supabase (leads dashboard) and the Google Sheet.
// Succeeds if either works.
export async function submitPartnerLead(type: "franchise" | "distribution", d: PartnerLeadInput) {
  const [db, sheet] = await Promise.allSettled([
    supabase
      .from("leads")
      .insert({
        source: "website",
        inquiry_type: type,
        full_name: d.fullName.trim(),
        mobile: d.mobileNumber.replace(/\s+/g, ""),
        email: d.email.trim() || null,
        city: d.cityState.trim() || null,
        state: guessState(d.cityState) || null,
        territory: d.territory.trim() || null,
        occupation: d.occupation || null,
        prior_experience: d.priorExperience?.trim() || null,
        investment_budget: d.investmentBudget?.trim() || null,
      })
      .then(({ error }) => {
        if (error) throw error;
      }),
    submitToSheet(type, { ...d } as Record<string, string>),
  ]);
  if (db.status === "rejected") console.error("Lead DB insert failed:", db.reason);
  if (sheet.status === "rejected") console.error("Sheet submit failed:", sheet.reason);
  if (db.status === "rejected" && sheet.status === "rejected") {
    throw new Error("Could not submit inquiry");
  }
}

export interface InstallationLeadInput {
  fullName: string;
  mobileNumber: string;
  city: string;
  state: string;
  installTarget: string;
  vehicleBrandModel: string;
  engineCapacity: string;
  callbackTime: string;
  question: string;
}

// Saves to Supabase (dashboard) and the Google Sheet (backup). Succeeds if either works.
export async function submitInstallationLead(d: InstallationLeadInput) {
  const [db, sheet] = await Promise.allSettled([
    supabase
      .from("leads")
      .insert({
        source: "website",
        full_name: d.fullName.trim(),
        mobile: d.mobileNumber.replace(/\s+/g, ""),
        city: d.city.trim(),
        state: d.state,
        install_target: d.installTarget,
        vehicle: d.vehicleBrandModel.trim(),
        engine_capacity: d.engineCapacity,
        preferred_callback_time: d.callbackTime,
        question: d.question.trim() || null,
      })
      .then(({ error }) => {
        if (error) throw error;
      }),
    submitToSheet("installation", {
      fullName: d.fullName,
      mobileNumber: d.mobileNumber,
      cityState: `${d.city}, ${d.state}`,
      state: d.state,
      installTarget: d.installTarget,
      vehicleBrandModel: d.vehicleBrandModel,
      engineCapacity: d.engineCapacity,
      callbackTime: d.callbackTime,
      question: d.question,
    }),
  ]);
  if (db.status === "rejected") console.error("Lead DB insert failed:", db.reason);
  if (sheet.status === "rejected") console.error("Sheet submit failed:", sheet.reason);
  if (db.status === "rejected" && sheet.status === "rejected") {
    throw new Error("Could not submit inquiry");
  }
}
