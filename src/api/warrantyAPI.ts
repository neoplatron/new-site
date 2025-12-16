// src/api/warrantyAPI.ts
import axios, { type AxiosInstance } from "axios";
import { supabase } from "../integrations/supabase/client";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

// TYPES
export type WarrantyPayload = Record<string, unknown>;

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
}

export async function validateSellerCode(code: string) {
  const { data, error } = await supabase
    .from("sellers")
    .select("id, name, address")
    .eq("seller_code", code)
    .single();

  if (error) return null;
  return data;
}

export async function searchWarranty(query: string) {
  // Search by UID (exact/upper), Phone (exact), or Email (case-insensitive)
  const cleanQuery = query.trim();

  // Using ilike for email to be case-insensitive
  // Also checking phone with "0" prefix for cases where user omits it but DB has it
  const { data, error } = await supabase
    .from("warranty_registrations")
    .select("*")
    .or(`verification_uid.eq.${cleanQuery.toUpperCase()},phone.eq.${cleanQuery},phone.eq.0${cleanQuery},email.ilike.${cleanQuery}`);

  if (error) {
    if (error.code === 'PGRST116') return []; // Not found
    throw error;
  }
  return data || [];
}

export async function submitWarranty(payload: WarrantyPayload) {
  // This is now handled directly in the component via Supabase client
  // keeping for compatibility if needed
  console.log("Submitting warranty payload", payload);
  return payload;
}

export default {
  submitWarranty,
  searchWarranty,
  validateSellerCode,
  api,
};
