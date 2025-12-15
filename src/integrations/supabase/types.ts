export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      warranty_claims: {
        Row: {
          created_at: string
          customer_name: string
          email: string
          id: string
          issue_description: string
          phone: string
          status: string | null
          warranty_id: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email: string
          id?: string
          issue_description: string
          phone: string
          status?: string | null
          warranty_id: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string
          id?: string
          issue_description?: string
          phone?: string
          status?: string | null
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranty_claims_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranty_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      sellers: {
        Row: {
          id: string
          name: string
          seller_code: string
          address: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          seller_code: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          seller_code?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Relationships: []
      }
      warranty_registrations: {
        Row: {
          city: string
          created_at: string
          customer_address: string
          customer_name: string
          email: string
          fuel_type: string | null
          garage_name: string | null
          id: string
          installation_date: string
          installation_photos: Json | null
          installed_by: string
          invoice_data: string | null
          invoice_number: string
          kms_driven: number | null
          phone: string
          pin_code: string
          product_type: string
          registration_date: string
          seller_id: string | null
          seller_code_used: string | null
          state: string
          status: string | null
          updated_at: string
          vehicle_number: string | null
          vehicle_rc_data: string | null
          verification_uid: string
          warranty_type: string
        }
        Insert: {
          city: string
          created_at?: string
          customer_address: string
          customer_name: string
          email: string
          fuel_type?: string | null
          garage_name?: string | null
          id?: string
          installation_date: string
          installation_photos?: Json | null
          installed_by: string
          invoice_data?: string | null
          invoice_number: string
          kms_driven?: number | null
          phone: string
          pin_code: string
          product_type: string
          registration_date?: string
          seller_id?: string | null
          seller_code_used?: string | null
          state: string
          status?: string | null
          updated_at?: string
          vehicle_number?: string | null
          vehicle_rc_data?: string | null
          verification_uid: string
          warranty_type: string
        }
        Update: {
          city?: string
          created_at?: string
          customer_address?: string
          customer_name?: string
          email?: string
          fuel_type?: string | null
          garage_name?: string | null
          id?: string
          installation_date?: string
          installation_photos?: Json | null
          installed_by?: string
          invoice_data?: string | null
          invoice_number?: string
          kms_driven?: number | null
          phone?: string
          pin_code?: string
          product_type?: string
          registration_date?: string
          seller_id?: string | null
          seller_code_used?: string | null
          state?: string
          status?: string | null
          updated_at?: string
          vehicle_number?: string | null
          vehicle_rc_data?: string | null
          verification_uid?: string
          warranty_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranty_registrations_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'master' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'master' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'master' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      admin_whitelist: {
        Row: {
          email: string
          role: 'master' | 'admin'
          created_at: string
          created_by: string | null
        }
        Insert: {
          email: string
          role: 'master' | 'admin'
          created_at?: string
          created_by?: string | null
        }
        Update: {
          email?: string
          role?: 'master' | 'admin'
          created_at?: string
          created_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
