import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  useEffect(() => {
    // Supabase redireciona com #access_token=... na URL
    // O cliente supabase-js lê automaticamente esse hash e seta a sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // sessão de recovery ativa, pode mudar a senha
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    if (password.length < 6)  { setError('Mínimo 6 caracteres.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  const S = {
    page: { minHeight: '100vh', backgroundColor: '#08040f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Segoe UI',sans-serif" },
    card: { backgroundColor: 'rgba(30,20,48,0.95)', border: '1px solid rgba(167,85,247,0.3)', borderRadius: 22, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' },
    title: { color: '#f1f5f9', fontWeight: 800, fontSize: 22, marginBottom: 6, textAlign: 'center' },
    sub: { color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 28 },
    label: { display: 'block', fontSize: 12.5, color: '#94a3b8', marginBottom: 7, fontWeight: 600 },
    input: { backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', outline: 'none', padding: '12px 14px', fontSize: 14, width: '100%' },
    btn: { width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 8 },
    err: { backgroundColor: 'rgba(127,29,29,0.35)', border: '1px solid rgba(220,38,38,0.45)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 14, textAlign: 'center' },
    ok: { backgroundColor: 'rgba(20,83,45,0.35)', border: '1px solid rgba(22,163,74,0.45)', borderRadius: 9, padding: '14px', fontSize: 13, color: '#4ade80', textAlign: 'center' },
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.title}>Nova senha</div>
        <div style={S.sub}>Digite sua nova senha para continuar</div>

        {done ? (
          <div style={S.ok}>✅ Senha atualizada! Redirecionando...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Nova senha</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={S.input} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Confirmar senha</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} style={S.input} placeholder="••••••••" />
            </div>
            {error && <div style={S.err}>{error}</div>}
            <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
