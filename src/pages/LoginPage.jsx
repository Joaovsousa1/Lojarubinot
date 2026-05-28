import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError('E-mail ou senha incorretos.')
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

        {/* Logo */}
        <div className="text-center">
          <div className="text-5xl mb-3">💎</div>
          <h1 className="text-2xl font-bold text-white">RubinOT</h1>
          <p className="text-sm mt-1" style={{ color: '#9461f7' }}>Gestão de Estoque</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>

          <h2 className="text-lg font-semibold text-white text-center">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">E-mail</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={INPUT}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Senha</label>
              <input
                type="password" required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={INPUT}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-xs text-center px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#7f1d1d33', color: '#f87171', border: '1px solid #dc262644' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
              style={{ backgroundColor: '#7c3aed', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600">
          Acesso somente por convite · Entre em contato para assinar
        </p>
      </div>
    </div>
  )
}
