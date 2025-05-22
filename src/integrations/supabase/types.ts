export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cardapio: {
        Row: {
          ativo: boolean | null
          created_at: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          updated_at: string
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          updated_at?: string
          valor: string
        }
        Update: {
          chave?: string
          created_at?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_item_proteins: {
        Row: {
          id: string
          menu_item_id: string
          name: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_proteins_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_salads: {
        Row: {
          id: string
          menu_item_id: string
          name: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_salads_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_sides: {
        Row: {
          id: string
          menu_item_id: string
          name: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_sides_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          available: boolean
          created_at: string
          id: string
          menu_id: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          id?: string
          menu_id: string
          price: number
          type: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          created_at?: string
          id?: string
          menu_id?: string
          price?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          date: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          menu_item_id: string
          notes: string | null
          order_id: string
          price: number
          quantity: number
          selected_proteins: string[] | null
          selected_salads: string[] | null
          selected_sides: string[] | null
        }
        Insert: {
          id?: string
          menu_item_id: string
          notes?: string | null
          order_id: string
          price: number
          quantity?: number
          selected_proteins?: string[] | null
          selected_salads?: string[] | null
          selected_sides?: string[] | null
        }
        Update: {
          id?: string
          menu_item_id?: string
          notes?: string | null
          order_id?: string
          price?: number
          quantity?: number
          selected_proteins?: string[] | null
          selected_salads?: string[] | null
          selected_sides?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address: string
          delivery_fee: number
          id: string
          order_date: string
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address: string
          delivery_fee?: number
          id?: string
          order_date?: string
          payment_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address?: string
          delivery_fee?: number
          id?: string
          order_date?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente: string
          created_at: string
          detalhes: Json
          endereco: string
          forma_pagamento: string
          id: string
          total: number
        }
        Insert: {
          cliente: string
          created_at?: string
          detalhes: Json
          endereco: string
          forma_pagamento: string
          id?: string
          total: number
        }
        Update: {
          cliente?: string
          created_at?: string
          detalhes?: Json
          endereco?: string
          forma_pagamento?: string
          id?: string
          total?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
