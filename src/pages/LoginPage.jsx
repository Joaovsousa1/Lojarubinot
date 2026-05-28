import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useEffect } from 'react'

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function RubinLogo({ size = 38, showText = true }) {
  const id = 'rl'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="45%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={`${id}b`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}c`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>
          <filter id={`${id}f`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <ellipse cx="22" cy="28" rx="16" ry="10" fill="#7c3aed" opacity="0.4" filter={`url(#${id}f)`} />
        <polygon points="22,2 38,12 38,32 22,42 6,32 6,12" fill={`url(#${id}a)`} />
        <polygon points="22,2 38,12 22,17 6,12" fill={`url(#${id}b)`} />
        <polygon points="22,17 38,12 38,32 22,42 6,32 6,12" fill={`url(#${id}c)`} />
        <line x1="6" y1="12" x2="22" y2="17" stroke="white" strokeWidth="0.5" strokeOpacity="0.25" />
        <line x1="22" y1="17" x2="22" y2="42" stroke="white" strokeWidth="0.5" strokeOpacity="0.18" />
        <line x1="38" y1="12" x2="22" y2="17" stroke="white" strokeWidth="0.4" strokeOpacity="0.2" />
        <text x="13" y="31" fontFamily="'Arial Black','Arial',sans-serif" fontWeight="900" fontSize="20" fill="white" style={{ userSelect: 'none' }}>R</text>
      </svg>
      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 10, color: '#c084fc', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 3 }}>Minha Loja</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textShadow: '0 0 28px #7c3aed99' }}>Rubinot</div>
        </div>
      )}
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div style={{
      backgroundColor: 'rgba(42,32,64,0.7)',
      border: `1px solid ${color}33`,
      borderRadius: 18,
      padding: '28px 24px',
      backdropFilter: 'blur(12px)',
      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '66'; e.currentTarget.style.boxShadow = `0 12px 40px ${color}22` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = color + '33'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: color + '1e',
        border: `1px solid ${color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
        boxShadow: `0 4px 20px ${color}22`,
      }}>{icon}</div>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{title}</div>
      <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{desc}</div>
    </div>
  )
}

// ── Mock dashboard preview ────────────────────────────────────────────────────
function DashPreview() {
  return (
    <div style={{
      backgroundColor: '#1a1025', borderRadius: 18,
      border: '1px solid #3a3050', overflow: 'hidden',
      boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.25), 0 0 80px rgba(124,58,237,0.1)',
      fontSize: 11, color: '#9ca3af',
      transform: 'perspective(1200px) rotateX(4deg) rotateY(-5deg)',
      userSelect: 'none',
    }}>
      <div style={{ backgroundColor: '#2a2035', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #3a3050' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ef4444','#f59e0b','#22c55e'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 8, backgroundColor: '#3a3050', borderRadius: 4, maxWidth: 180 }} />
      </div>
      <div style={{ display: 'flex', minHeight: 300 }}>
        <div style={{ width: 80, backgroundColor: '#160d20', borderRight: '1px solid #3a3050', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <RubinLogo size={20} showText={false} />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['📊','💰','📦','👤','📋','⚙️'].map((ic, i) => (
              <div key={i} style={{
                padding: '6px 8px', borderRadius: 8, display: 'flex', alignItems: 'center',
                backgroundColor: i === 0 ? '#7c3aed33' : 'transparent',
                border: i === 0 ? '1px solid #7c3aed55' : '1px solid transparent',
              }}>
                <span style={{ fontSize: 12 }}>{ic}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: 14 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Dashboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Lucro Mês', val: 'R$ 2.840', color: '#7c3aed' },
              { label: 'Itens', val: '47', color: '#0891b2' },
              { label: 'Contas', val: '12', color: '#16a34a' },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: '#2a2035', borderRadius: 10, padding: '10px', border: '1px solid #3a3050' }}>
                <div style={{ color: '#9ca3af', fontSize: 9, marginBottom: 4 }}>{s.label}</div>
                <div style={{ color: s.color, fontWeight: 800, fontSize: 13 }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: '#2a2035', borderRadius: 10, padding: 10, marginBottom: 10, border: '1px solid #3a3050' }}>
            <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 8 }}>Lucro últimos 6 meses</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
              {[28, 42, 32, 70, 55, 85].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                  background: i === 5 ? 'linear-gradient(180deg,#a855f7,#7c3aed)' : '#3a3050',
                }} />
              ))}
            </div>
          </div>
          <div style={{ backgroundColor: '#2a2035', borderRadius: 10, padding: 10, border: '1px solid #3a3050' }}>
            <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 8 }}>Itens em estoque</div>
            {[
              { name: 'Grand Sanguine Razor', tier: 'T4', color: '#b91c1c' },
              { name: 'Falcon Plate', tier: 'T3', color: '#d97706' },
              { name: 'Soul Reaper', tier: 'T4', color: '#9333ea' },
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: `2px solid ${it.color}`, paddingLeft: 6, marginBottom: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: it.color + '33', border: `1px solid ${it.color}55` }} />
                <span style={{ flex: 1, color: '#d1d5db', fontSize: 10 }}>{it.name}</span>
                <span style={{ fontSize: 9, backgroundColor: it.color + '33', color: it.color, borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>{it.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const switchMode = (m) => {
    setMode(m); setError(''); setSuccess('')
    setEmail(''); setPassword(''); setName(''); setConfirm('')
  }

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message ?? 'E-mail ou senha incorretos.')
  }

  const handleRegister = async (e) => {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    if (password.length < 6)  { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { name: name.trim() } },
    })
    setLoading(false)
    if (signUpError) { setError(signUpError.message ?? 'Erro ao criar conta.'); return }
    setSuccess('Conta criada! Aguarde a ativação pelo administrador.')
  }

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  const INPUT_S = {
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, color: '#fff', outline: 'none',
    padding: '12px 14px', fontSize: 14, width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={{ backgroundColor: '#08040f', minHeight: '100vh', color: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Background blobs ── */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed55 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #4f46e544 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '25%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #9333ea33 0%, transparent 65%)' }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(124,58,237,0.15)',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(8,4,15,0.88)',
        padding: '0 6%',
        display: 'flex', alignItems: 'center', height: 66, gap: 32,
      }}>
        <RubinLogo size={34} showText />
        <div style={{ flex: 1 }} />
        <button onClick={scrollToForm}
          style={{
            padding: '9px 24px', borderRadius: 10,
            backgroundColor: 'transparent', border: '1px solid rgba(124,58,237,0.5)',
            color: '#c084fc', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#7c3aed22'; e.currentTarget.style.borderColor = '#a855f7' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)' }}
        >Entrar</button>
        <button onClick={scrollToForm}
          style={{
            padding: '9px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg,#9333ea,#6d28d9)',
            border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 22px rgba(124,58,237,0.5)',
            transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(124,58,237,0.65)' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 22px rgba(124,58,237,0.5)' }}
        >Começar agora</button>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        paddingTop: 140, paddingBottom: 100,
        paddingLeft: '6%', paddingRight: '6%',
        display: 'grid', gridTemplateColumns: '1fr 440px',
        gap: 72, alignItems: 'center',
        maxWidth: 1260, margin: '0 auto',
      }}>
        {/* Left: headline */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(124,58,237,0.18)', border: '1px solid rgba(167,85,247,0.4)',
            borderRadius: 100, padding: '6px 16px', fontSize: 12.5, color: '#d8b4fe',
            fontWeight: 600, marginBottom: 28, letterSpacing: '0.05em',
          }}>
            ✦ A plataforma completa para seu OT Server
          </div>

          <h1 style={{ margin: 0, lineHeight: 1.06, letterSpacing: '-2px' }}>
            <span style={{ fontSize: 'clamp(42px,5.5vw,68px)', fontWeight: 900, display: 'block', color: '#f1f5f9' }}>
              Gerencie seu
            </span>
            <span style={{ fontSize: 'clamp(42px,5.5vw,68px)', fontWeight: 900, display: 'block', color: '#f1f5f9' }}>
              estoque.
            </span>
            <span style={{
              fontSize: 'clamp(42px,5.5vw,68px)', fontWeight: 900, display: 'block',
              background: 'linear-gradient(90deg,#e879f9,#a855f7,#818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Venda mais.
            </span>
          </h1>

          <p style={{ marginTop: 24, marginBottom: 40, fontSize: 18, color: '#cbd5e1', lineHeight: 1.7, maxWidth: 500 }}>
            Minha Loja Rubinot é o sistema completo para gerenciar itens, coins, contas e calcular lucros do seu servidor OT — tudo em um só lugar.
          </p>

          <button onClick={scrollToForm}
            style={{
              padding: '15px 38px', borderRadius: 12,
              background: 'linear-gradient(135deg,#9333ea,#6d28d9)',
              border: 'none', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(147,51,234,0.5)',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(147,51,234,0.65)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(147,51,234,0.5)' }}
          >
            Começar agora grátis →
          </button>

          {/* Trust badges */}
          <div style={{ marginTop: 44, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'Dados protegidos' },
              { icon: '☁️', text: 'Acesso em qualquer lugar' },
              { icon: '📋', text: 'Relatórios mensais' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                <span style={{ fontSize: 17 }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div ref={formRef} style={{
          backgroundColor: 'rgba(30,20,48,0.92)',
          border: '1px solid rgba(167,85,247,0.3)',
          borderRadius: 22, padding: '36px 32px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <RubinLogo size={48} showText={false} />
            <div style={{ marginTop: 16, fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>
              {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
            </div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 5 }}>
              {mode === 'login' ? 'Acesse o painel de gestão' : 'Junte-se ao Rubinot'}
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', borderRadius: 11, overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            marginBottom: 26,
          }}>
            {[['login','Entrar'],['register','Criar conta']].map(([k, label]) => (
              <button key={k} onClick={() => switchMode(k)}
                style={{
                  flex: 1, padding: '10px 0', fontSize: 13.5, fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === k ? 'linear-gradient(135deg,#9333ea,#6d28d9)' : 'transparent',
                  color: mode === k ? '#fff' : '#64748b',
                  boxShadow: mode === k ? '0 2px 14px rgba(147,51,234,0.45)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
              <div style={{ backgroundColor: 'rgba(20,83,45,0.35)', border: '1px solid rgba(22,163,74,0.45)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#4ade80', marginBottom: 18 }}>
                {success}
              </div>
              <button onClick={() => switchMode('login')}
                style={{ width: '100%', padding: '12px 0', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                Voltar ao login
              </button>
            </div>
          ) : mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, color: '#94a3b8', marginBottom: 7, fontWeight: 600, letterSpacing: '0.03em' }}>E-mail</label>
                <input type="email" required autoComplete="email" value={email}
                  onChange={e => setEmail(e.target.value)} style={INPUT_S}
                  placeholder="seu@email.com"
                  onFocus={e => { e.target.style.borderColor = '#9333ea'; e.target.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.18)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12.5, color: '#94a3b8', marginBottom: 7, fontWeight: 600, letterSpacing: '0.03em' }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} required autoComplete="current-password" value={password}
                    onChange={e => setPassword(e.target.value)} style={{ ...INPUT_S, paddingRight: 46 }}
                    placeholder="••••••••"
                    onFocus={e => { e.target.style.borderColor = '#9333ea'; e.target.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.18)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.5, padding: 0 }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: 'rgba(127,29,29,0.35)', border: '1px solid rgba(220,38,38,0.45)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 14, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg,#9333ea,#6d28d9)',
                  color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 6px 22px rgba(147,51,234,0.45)',
                  marginTop: 6, transition: 'opacity 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                {loading ? 'Entrando...' : '✦  Entrar no sistema'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              {[
                { label: 'Nome', key: 'name', type: 'text', val: name, set: setName, ph: 'Seu nome' },
                { label: 'E-mail', key: 'email', type: 'email', val: email, set: setEmail, ph: 'seu@email.com' },
                { label: 'Senha', key: 'pw', type: 'password', val: password, set: setPassword, ph: '••••••••' },
                { label: 'Confirmar senha', key: 'conf', type: 'password', val: confirm, set: setConfirm, ph: '••••••••' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, color: '#94a3b8', marginBottom: 7, fontWeight: 600, letterSpacing: '0.03em' }}>{f.label}</label>
                  <input type={f.type} required value={f.val}
                    onChange={e => f.set(e.target.value)} style={INPUT_S}
                    placeholder={f.ph}
                    autoComplete={f.type === 'email' ? 'email' : f.type === 'password' ? 'new-password' : 'name'}
                    onFocus={e => { e.target.style.borderColor = '#9333ea'; e.target.style.boxShadow = '0 0 0 3px rgba(147,51,234,0.18)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              ))}

              {error && (
                <div style={{ backgroundColor: 'rgba(127,29,29,0.35)', border: '1px solid rgba(220,38,38,0.45)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 14, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg,#9333ea,#6d28d9)',
                  color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 6px 22px rgba(147,51,234,0.45)',
                  marginTop: 4,
                }}>
                {loading ? 'Criando conta...' : '✦  Criar minha conta'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#475569', marginTop: 14 }}>
                Após criar a conta, aguarde a ativação pelo administrador.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Dashboard preview ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 6% 90px',
        maxWidth: 1260, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#7c3aed', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
            ✦ Prévia do sistema
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,3vw,36px)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
            Tudo que você precisa, em um lugar
          </h2>
          <p style={{ marginTop: 12, color: '#64748b', fontSize: 16, maxWidth: 440, margin: '12px auto 0' }}>
            Interface limpa, rápida e feita para quem vende no OT.
          </p>
        </div>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <DashPreview />
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 6% 110px',
        maxWidth: 1260, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,3vw,36px)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Por que escolher o Rubinot?
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Funcionalidades pensadas especialmente para gestão de servidores OT
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          <FeatureCard icon="💎" title="Gestão de Coins" color="#f59e0b"
            desc="Controle entradas e saídas de RC com cálculo automático de lucro por transação." />
          <FeatureCard icon="📦" title="Estoque de Itens" color="#a855f7"
            desc="Catálogo com sprites dos itens, tiers, sets e preços de compra/venda." />
          <FeatureCard icon="👤" title="Contas de Personagens" color="#22c55e"
            desc="Gerencie chars à venda com nível, vocação, outfits e mounts em um só lugar." />
          <FeatureCard icon="📋" title="Relatório Mensal" color="#0ea5e9"
            desc="Relatório automático completo ao final de cada mês com lucros, vendas e métricas." />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        margin: '0 6% 100px',
        maxWidth: 1260, marginLeft: 'auto', marginRight: 'auto',
        backgroundColor: 'rgba(30,20,48,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 20, padding: '40px 5%',
        backdropFilter: 'blur(12px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 32, textAlign: 'center',
      }}>
        {[
          { value: '100%', label: 'Seus dados protegidos', color: '#a855f7' },
          { value: 'T0–T10', label: 'Suporte a tiers completo', color: '#f59e0b' },
          { value: '18+', label: 'Servidores suportados', color: '#22c55e' },
          { value: '∞', label: 'Relatórios mensais', color: '#0ea5e9' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 38, fontWeight: 900, color: s.color, letterSpacing: '-1px', textShadow: `0 0 30px ${s.color}66` }}>{s.value}</div>
            <div style={{ marginTop: 6, color: '#94a3b8', fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(124,58,237,0.12)',
        padding: '24px 6%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
      }}>
        <RubinLogo size={28} showText />
        <div style={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>
          Desenvolvido por{' '}
          <span style={{ color: '#9333ea', fontWeight: 700 }}>Kiara Store</span>
          {' · '}
          <a href="https://wa.me/553484144427?text=Ol%C3%A1%2C+tenho+uma+sugest%C3%A3o!"
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#a78bfa', textDecoration: 'underline' }}>
            Sugestões? Fale conosco
          </a>
        </div>
        <div style={{ fontSize: 13, color: '#475569' }}>
          Plano mensal via PIX
        </div>
      </footer>

    </div>
  )
}
