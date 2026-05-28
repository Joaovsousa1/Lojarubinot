import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
  ?? 'https://fuvoodxfwfwsjleqferp.supabase.co'

const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dm9vZHhmd2Z3c2psZXFmZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODczMjIsImV4cCI6MjA5NTU2MzMyMn0.O_dhTV7MLoF1j0iG6t01_q15ukf4sWymBGSnJMeSMA4'

export const supabase = createClient(url, key)
export const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG ?? 'rubinot-admin-2024'
