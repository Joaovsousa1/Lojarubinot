import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode]           = useState('login') // 'login' | 'register'
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [name, setName]           = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setName('')
    setConfirm('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message ?? 'E-mail ou senha incorretos.')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    })
    if (signUpError) {
      setLoading(false)
      setError(signUpError.message ?? 'Erro ao criar conta.')
      return
    }
    setLoading(false)
    setSuccess('Conta criada com sucesso! Aguarde a ativação pelo administrador para acessar o sistema.')
  }

  const INPUT = {
    backgroundColor: '#1a1025',
    border: '1px solid #3a3050',
    outline: 'none',
    color: '#fff',
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#1a1025' }}>

      <div className="w-full max-w-sm space-y-6">

        <div className="text-center">
          <div className="text-5xl mb-3">💎</div>
          <h1 className="text-2xl font-bold text-white">RubinOT</h1>
          <p className="text-sm mt-1" style={{ color: '#9461f7' }}>Gestão de Estoque</p>
        </div>

        <div className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>

          {/* Tab switcher */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <button
              onClick={() => switchMode('login')}
              className="flex-1 py-2 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'login' ? '#7c3aed' : 'transparent',
                color: mode === 'login' ? '#fff' : '#9ca3af',
              }}>
              Entrar
            </button>
            <button
              onClick={() => switchMode('register')}
              className="flex-1 py-2 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: mode === 'register' ? '#7c3aed' : 'transparent',
                color: mode === 'register' ? '#fff' : '#9ca3af',
              }}>
              Criar conta
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mail</label>
                <input type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Senha</label>
                <input type="password" required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="••••••••" />
              </div>

              {error && (
                <div className="text-xs text-center px-3 py-2 rounded-lg"
                  style={{ backgroundColor: '#7f1d1d33', color: '#f87171', border: '1px solid #dc262644' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
                style={{ backgroundColor: '#7c3aed', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : success ? (
            <div className="space-y-3">
              <div className="text-sm text-center px-3 py-4 rounded-lg"
                style={{ backgroundColor: '#14532d33', color: '#4ade80', border: '1px solid #16a34a44' }}>
                {success}
              </div>
              <button onClick={() => switchMode('login')}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#3a3050' }}>
                Voltar ao login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome</label>
                <input type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">E-mail</label>
                <input type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Senha</label>
                <input type="password" required autoComplete="new-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Confirmar senha</label>
                <input type="password" required autoComplete="new-password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm" style={INPUT}
                  placeholder="••••••••" />
              </div>

              {error && (
                <div className="text-xs text-center px-3 py-2 rounded-lg"
                  style={{ backgroundColor: '#7f1d1d33', color: '#f87171', border: '1px solid #dc262644' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
                style={{ backgroundColor: '#7c3aed', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <p className="text-center text-xs" style={{ color: '#6b7280' }}>
                Após criar a conta, aguarde a ativação pelo administrador.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-600">
          Plano mensal via PIX · Entre em contato para mais informações
        </p>
      </div>
    </div>
  )
}
