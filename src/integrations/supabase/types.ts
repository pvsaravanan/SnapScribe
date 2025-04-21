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
      badges: {
        Row: {
          created_at: string
          description: string
          icon_url: string
          id: string
          name: string
          unlock_criteria: string
          updated_at: string
          xp_bonus: number
        }
        Insert: {
          created_at?: string
          description: string
          icon_url: string
          id?: string
          name: string
          unlock_criteria: string
          updated_at?: string
          xp_bonus?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string
          id?: string
          name?: string
          unlock_criteria?: string
          updated_at?: string
          xp_bonus?: number
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          expected_output: string
          hint: string | null
          id: string
          language: string
          quest_id: string
          starter_code: string
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          expected_output: string
          hint?: string | null
          id?: string
          language: string
          quest_id: string
          starter_code: string
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          expected_output?: string
          hint?: string | null
          id?: string
          language?: string
          quest_id?: string
          starter_code?: string
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          created_at: string
          description: string
          id: string
          theme_icon: string
          title: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          theme_icon: string
          title: string
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          theme_icon?: string
          title?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: []
      }
      submissions: {
        Row: {
          challenge_id: string
          code_submitted: string
          id: string
          is_passed: boolean
          result: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          code_submitted: string
          id?: string
          is_passed?: boolean
          result?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          code_submitted?: string
          id?: string
          is_passed?: boolean
          result?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_completed_challenges: {
        Row: {
          challenge_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_completed_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_completed_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_completed_quests: {
        Row: {
          completed_at: string
          id: string
          quest_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          quest_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          quest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_completed_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_completed_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          github_id: string | null
          id: string
          level: number
          updated_at: string
          username: string
          xp: number
        }
        Insert: {
          created_at?: string
          email: string
          github_id?: string | null
          id: string
          level?: number
          updated_at?: string
          username: string
          xp?: number
        }
        Update: {
          created_at?: string
          email?: string
          github_id?: string | null
          id?: string
          level?: number
          updated_at?: string
          username?: string
          xp?: number
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
