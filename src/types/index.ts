import { Database } from './database'

export type Entry = Database['public']['Tables']['entries']['Row']
export type EntryInsert = Database['public']['Tables']['entries']['Insert']
export type EntryUpdate = Database['public']['Tables']['entries']['Update']

export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']

export type UserStreak = Database['public']['Tables']['user_streaks']['Row']
export type UserStreakInsert = Database['public']['Tables']['user_streaks']['Insert']
export type UserStreakUpdate = Database['public']['Tables']['user_streaks']['Update']

export type Reflection = Database['public']['Tables']['reflections']['Row']
export type ReflectionInsert = Database['public']['Tables']['reflections']['Insert']
export type ReflectionUpdate = Database['public']['Tables']['reflections']['Update']

export interface User {
  id: string
  email: string
  created_at: string
}

export * from './database'
