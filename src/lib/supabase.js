import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
export const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG ?? 'rubinot-admin-2024'
