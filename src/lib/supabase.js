import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = (import.meta.env.VITE_SUPABASE_URL      || '').trim() || 'https://fuvoodxfwfwsjleqferp.supabase.co'
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dm9vZHhmd2Z3c2psZXFmZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODczMjIsImV4cCI6MjA5NTU2MzMyMn0.O_dhTV7MLoF1j0iG6t01_q15ukf4sWymBGSnJMeSMA4'

// Wrapper que sanitiza valores de header antes do fetch para evitar
// "Failed to execute 'fetch' on 'Window': Invalid value" causado por
// tokens corrompidos no localStorage com \r\n\0
const safeFetch = (url, options) => {
  if (options?.headers && typeof options.headers === 'object' && !(options.headers instanceof Headers)) {
    const clean = {}
    for (const [k, v] of Object.entries(options.headers)) {
      clean[k] = typeof v === 'string' ? v.replace(/[\r\n\0]/g, '') : v
    }
    options = { ...options, headers: clean }
  }
  return fetch(url, options)
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { fetch: safeFetch },
})

export const ADMIN_SLUG = (import.meta.env.VITE_ADMIN_SLUG || '').trim() || 'rubinot-admin-2024'
