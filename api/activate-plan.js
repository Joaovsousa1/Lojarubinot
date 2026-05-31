const SUPABASE_URL = 'https://fuvoodxfwfwsjleqferp.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dm9vZHhmd2Z3c2psZXFmZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODczMjIsImV4cCI6MjA5NTU2MzMyMn0.O_dhTV7MLoF1j0iG6t01_q15ukf4sWymBGSnJMeSMA4'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel' })

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token ausente' })

  const token = authHeader.slice(7)

  // Verifica o token do usuário
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
  })
  if (!userRes.ok) return res.status(401).json({ error: 'Token inválido' })

  const { id: userId, email: userEmail } = await userRes.json()
  if (!userId) return res.status(401).json({ error: 'Usuário não encontrado' })

  // Upsert do perfil usando service role (bypassa RLS)
  const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ id: userId, email: userEmail ?? '', plan_active: true, plan_expires_at: null }),
  })

  if (!upsertRes.ok) {
    // Tenta sem o campo email caso a coluna não exista
    const upsertRes2 = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: userId, plan_active: true, plan_expires_at: null }),
    })
    if (!upsertRes2.ok) {
      const errText = await upsertRes2.text()
      return res.status(500).json({ error: `DB: ${errText}` })
    }
  }

  return res.status(200).json({ success: true, email: userEmail })
}
