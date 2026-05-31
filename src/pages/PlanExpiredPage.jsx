import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PlanExpiredPage() {
  const { profile, signOut, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)
  const [checked, setChecked] = useState(false)

  const expired = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at).toLocaleDateString('pt-BR')
    : null

  const handleCheck = async () => {
    setChecking(true)
    await refreshProfile()
    setChecking(false)
    setChecked(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#1a1025' }}>
      <div className="w-full max-w-sm text-center space-y-5">
        <div className="text-5xl">🔒</div>
        <div>
          <h1 className="text-xl font-bold text-white">Plano encerrado</h1>
          {expired && (
            <p className="text-sm text-gray-500 mt-1">Venceu em {expired}</p>
          )}
        </div>
        <div className="rounded-xl p-5 text-sm text-gray-400 space-y-2"
          style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
          <p>Para reativar seu acesso, entre em contato via WhatsApp ou Telegram.</p>
          <p className="text-xs text-gray-600">Seus dados ficam salvos por 30 dias após o vencimento.</p>
        </div>
        <button onClick={handleCheck} disabled={checking}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: checking ? '#3a3050' : '#7c3aed',
            color: checking ? '#9ca3af' : '#fff',
            opacity: checking ? 0.7 : 1,
          }}>
          {checking ? 'Verificando...' : checked ? 'Verificar novamente' : 'Já ativei — verificar agora'}
        </button>
        <button onClick={signOut}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Sair da conta
        </button>
      </div>
    </div>
  )
}
