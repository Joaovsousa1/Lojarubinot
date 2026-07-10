import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function PlanExpiredPage() {
  const { profile, user, signOut, refreshProfile } = useAuth()
  const [activating, setActivating] = useState(false)
  const [activated,  setActivated]  = useState(false)
  const [error,      setError]      = useState('')

  const expired = profile?.plan_expires_at
    ? new Date(profile.plan_expires_at).toLocaleDateString('pt-BR')
    : null

  const handleActivate = async () => {
    if (!user?.id) return
    setActivating(true)
    setError('')
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ plan_active: true, plan_expires_at: null })
        .eq('id', user.id)

      if (err) throw err
      await refreshProfile()
      setActivated(true)
    } catch (e) {
      setError('Não foi possível ativar. Entre em contato com o suporte.')
      console.error('[PlanExpired] activate:', e?.message)
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#1a1025' }}>
      <div className="w-full max-w-sm text-center space-y-5">
        <div className="text-5xl">{activated ? '✅' : '🔒'}</div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {activated ? 'Plano ativado!' : 'Acesso pendente'}
          </h1>
          {expired && !activated && (
            <p className="text-sm text-gray-500 mt-1">Venceu em {expired}</p>
          )}
          {activated && (
            <p className="text-sm mt-1" style={{ color: '#4ade80' }}>
              Recarregando o dashboard...
            </p>
          )}
        </div>

        {!activated && (
          <>
            <div className="rounded-xl p-5 text-sm text-gray-400 space-y-2"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
              <p>Seu plano está inativo. Clique abaixo para ativar automaticamente.</p>
              <p className="text-xs text-gray-600">Seus dados ficam salvos e protegidos.</p>
            </div>

            {error && (
              <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: '#7f1d1d33', border: '1px solid #dc2626', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button onClick={handleActivate} disabled={activating}
              className="w-full py-3 rounded-xl text-sm font-bold transition-colors"
              style={{
                backgroundColor: activating ? '#3a3050' : '#7c3aed',
                color: activating ? '#9ca3af' : '#fff',
                opacity: activating ? 0.7 : 1,
                cursor: activating ? 'not-allowed' : 'pointer',
              }}>
              {activating ? 'Ativando...' : '⚡ Ativar acesso agora'}
            </button>

            <button onClick={signOut}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Sair da conta
            </button>
          </>
        )}
      </div>
    </div>
  )
}
