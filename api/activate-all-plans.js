const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://fuvoodxfwfwsjleqferp.supabase.co'
const ANON_KEY    = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dm9vZHhmd2Z3c2psZXFmZXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODczMjIsImV4cCI6MjA5NTU2MzMyMn0.O_dhTV7MLoF1j0iG6t01_q15ukf4sWymBGSnJMeSMA4'
const OWNER_EMAIL = 'regeditelite@gmail.com'
const ALLOWED_ORIGIN = 'https://minhalojarubinot.vercel.app'

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  const origin = req.headers.origin
  if (origin === ALLOWED_ORIGIN) { res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); res.setHeader('Vary', 'Origin') }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.slice(7)
  if (!token || token.length < 20) return res.status(401).json({ error: 'Não autorizado' })

  // Verificar token
  let userId, userEmail
  try {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
    })
    if (!r.ok) return res.status(401).json({ error: 'Não autorizado' })
    const u = await r.json()
    userId = u?.id; userEmail = u?.email
  } catch { return res.status(401).json({ error: 'Não autorizado' }) }

  if (!userId) return res.status(401).json({ error: 'Não autorizado' })

  const isOwner = userEmail === OWNER_EMAIL
  if (!isOwner) {
    try {
      const pr = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=is_admin`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
      })
      const rows = await pr.json()
      if (rows?.[0]?.is_admin !== true) return res.status(403).json({ error: 'Acesso negado' })
    } catch { return res.status(500).json({ error: 'Erro interno' }) }
  }

  // Precisa de service role para atualizar TODOS os perfis (bypass RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    // Retorna o SQL para o usuário rodar manualmente no Supabase
    return res.status(200).json({
      success: false,
      needsSQL: true,
      sql: "UPDATE public.profiles SET plan_active = true, plan_expires_at = null;\nUPDATE public.profiles SET is_admin = true WHERE email = 'regeditelite@gmail.com';",
      message: 'Service role key não configurada. Execute o SQL abaixo no Supabase SQL Editor.',
    })
  }

  // Ativar todos os planos via service role
  try {
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?plan_active=eq.false`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ plan_active: true, plan_expires_at: null }),
    })
    if (!updateRes.ok) return res.status(500).json({ error: 'Erro ao ativar planos' })
    const updated = await updateRes.json()
    return res.status(200).json({ success: true, activated: updated?.length ?? 0 })
  } catch { return res.status(500).json({ error: 'Erro interno' }) }
}
