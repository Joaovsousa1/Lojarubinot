const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://fuvoodxfwfwsjleqferp.supabase.co'
const ANON_KEY    = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dm9vZHhmd2Z3c2psZXFmZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODczMjIsImV4cCI6MjA5NTU2MzMyMn0.O_dhTV7MLoF1j0iG6t01_q15ukf4sWymBGSnJMeSMA4'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://minhalojarubinot.vercel.app')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const token = req.headers.authorization?.slice(7)
  if (!token) return res.status(401).json({ error: 'no token' })

  const results = {}

  // 1. Validate token
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
    })
    const u = await r.json()
    results.auth = { status: r.status, userId: u?.id, email: u?.email, error: u?.error_description }
  } catch (e) { results.auth = { error: e.message } }

  const userId = results.auth?.userId
  if (!userId) return res.status(200).json(results)

  // 2. Query each table with user's token
  for (const [table, col] of [['coins','user_id'],['items','user_id'],['accounts','user_id'],['settings','user_id'],['profiles','id']]) {
    try {
      const filter = col === 'id' ? `id=eq.${userId}` : `${col}=eq.${userId}`
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=count`, {
        headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
      })
      const body = await r.text()
      results[table] = { status: r.status, body }
    } catch (e) { results[table] = { error: e.message } }
  }

  return res.status(200).json(results)
}
