export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string
          user_id: string
          content: string
          word_count: number
          created_at: string
          updated_at: string
          date: string
          sentiment: string | null
          emotion: string | null
          mood_score: number | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          word_count?: number
          created_at?: string
          updated_at?: string
          date?: string
          sentiment?: string | null
          emotion?: string | null
          mood_score?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          word_count?: number
          created_at?: string
          updated_at?: string
          date?: string
          sentiment?: string | null
          emotion?: string | null
          mood_score?: number | null
        }
      }
      user_settings: {
        Row: {
          user_id: string
          dark_mode: boolean
          reminder_time: string | null
          reminder_enabled: boolean
          created_at: string
          updated_at: string
          is_premium: boolean
          subscription_status: string
          subscription_ends_at: string | null
        }
        Insert: {
          user_id: string
          dark_mode?: boolean
          reminder_time?: string | null
          reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
          is_premium?: boolean
          subscription_status?: string
          subscription_ends_at?: string | null
        }
        Update: {
          user_id?: string
          dark_mode?: boolean
          reminder_time?: string | null
          reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
          is_premium?: boolean
          subscription_status?: string
          subscription_ends_at?: string | null
        }
      }
      user_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          total_entries: number
          total_words: number
          last_entry_date: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          total_entries?: number
          total_words?: number
          last_entry_date?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          total_entries?: number
          total_words?: number
          last_entry_date?: string | null
          updated_at?: string
        }
      }
      reflections: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          reflection_type: string
          period_start: string
          period_end: string
          entry_count: number
          themes: Json
          insights: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          reflection_type: string
          period_start: string
          period_end: string
          entry_count?: number
          themes?: Json
          insights?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          reflection_type?: string
          period_start?: string
          period_end?: string
          entry_count?: number
          themes?: Json
          insights?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
}
