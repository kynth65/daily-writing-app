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
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          word_count?: number
          created_at?: string
          updated_at?: string
          date?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          word_count?: number
          created_at?: string
          updated_at?: string
          date?: string
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
        }
        Insert: {
          user_id: string
          dark_mode?: boolean
          reminder_time?: string | null
          reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          dark_mode?: boolean
          reminder_time?: string | null
          reminder_enabled?: boolean
          created_at?: string
          updated_at?: string
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
