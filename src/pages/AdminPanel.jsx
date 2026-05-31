import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/helpers'

const STATUS = {
  active:   { label: 'Ativo',     color: '#4ade80', bg: '#14532d33' },
  expiring: { label: 'Vencendo',  color: '#fbbf24', bg: '#78350f33' },
  expired:  { label: 'Vencido',   color: '#f87171', bg: '#7f1d1d33' },
  inactive: { label: 'Inativo',   color: '#6b7280', bg: '#1f293733' },
}

function userStatus(p) {
  if (!p.plan_active) return 'inactive'
  if (!p.plan_expires_at) return 'active'
  const exp = new Date(p.plan_expires_at)
  const now = new Date()
  const days = (exp - now) / 86400000
  if (days < 0)  return 'expired'
  if (days < 7)  return 'expiring'
  return 'active'
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default function AdminPanel() {
  const { signOut, user } = useAuth()
  const [users, setUsers]   = useState([])
  const [metrics, setMetrics] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [newExpiry, setNewExpiry] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('users') // 'users' | 'metrics'
  const [paymentLog, setPaymentLog] = useState([])
  const [newPayment, setNewPayment] = useState({ userId: '', amount: '', note: '' })

  const loadData = useCallback(async () => {
    setLoading(true)

    // Load all profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    // Load usage metrics per user
    const { data: coinCounts }   = await supabase.from('coins').select('user_id')
    const { data: itemCounts }   = await supabase.from('items').select('user_id')
    const { data: accountCounts } = await supabase.from('accounts').select('user_id')
    const { data: payments }     = await supabase.from('payment_log').select('*').order('paid_at', { ascending: false })

    const m = {}
    ;(coinCounts    ?? []).forEach(r => { m[r.user_id] = m[r.user_id] ?? {}; m[r.user_id].coins    = (m[r.user_id].coins    ?? 0) + 1 })
    ;(itemCounts    ?? []).forEach(r => { m[r.user_id] = m[r.user_id] ?? {}; m[r.user_id].items    = (m[r.user_id].items    ?? 0) + 1 })
    ;(accountCounts ?? []).forEach(r => { m[r.user_id] = m[r.user_id] ?? {}; m[r.user_id].accounts = (m[r.user_id].accounts ?? 0) + 1 })

    setUsers(profiles ?? [])
    setMetrics(m)
    setPaymentLog(payments ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const togglePlan = async (p) => {
    await supabase.from('profiles').update({ plan_active: !p.plan_active }).eq('id', p.id)
    loadData()
  }

  const saveExpiry = async () => {
    if (!editingUser) return
    setSaving(true)
    await supabase.from('profiles').update({
      plan_active: true,
      plan_expires_at: newExpiry ? new Date(newExpiry).toISOString() : null,
    }).eq('id', editingUser.id)
    setSaving(false)
    setEditingUser(null)
    loadData()
  }

  const addPayment = async () => {
    if (!newPayment.userId || !newPayment.amount) return
    await supabase.from('payment_log').insert({
      user_id: newPayment.userId,
      amount: parseFloat(newPayment.amount),
      note: newPayment.note,
      paid_at: new Date().toISOString(),
    })
    setNewPayment({ userId: '', amount: '', note: '' })
    loadData()
  }

  // Summary stats
  const activeCount   = users.filter(u => userStatus(u) === 'active').length
  const expiringCount = users.filter(u => userStatus(u) === 'expiring').length
  const monthRevenue  = paymentLog
    .filter(p => p.paid_at?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, p) => s + (p.amount ?? 0), 0)

  const filtered = users.filter(u =>
    !search || (u.name ?? u.email ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const S = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
  const IN = 'px-3 py-2 rounded-lg text-sm text-white outline-none'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1025' }}>
      <div className="text-gray-500 text-sm">Carregando painel...</div>
    </div>
  )

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ backgroundColor: '#1a1025' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            💎 Admin <span className="text-xs font-normal px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#7c3aed33', color: '#c084fc' }}>RubinOT</span>
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">Painel administrativo</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Logado como</div>
          <div className="text-xs font-medium" style={{ color: '#c084fc' }}>{user?.email}</div>
          <button onClick={signOut} className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1">
            Sair
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total usuários', value: users.filter(u => !u.is_admin).length, color: '#c084fc' },
          { label: 'Planos ativos',  value: activeCount,   color: '#4ade80' },
          { label: 'Vencendo em 7d', value: expiringCount, color: '#fbbf24' },
          { label: 'Receita do mês', value: formatCurrency(monthRevenue), color: '#60a5fa' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['users','Usuários'], ['metrics','Métricas'], ['payments','Pagamentos']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: tab === id ? '#7c3aed' : '#2a2035',
              color: tab === id ? '#fff' : '#9ca3af',
              border: '1px solid ' + (tab === id ? '#7c3aed' : '#3a3050'),
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div className="space-y-3">
          <input type="text" value={search} placeholder="Buscar usuário..."
            className={`${IN} w-full max-w-xs`} style={S}
            onChange={e => setSearch(e.target.value)} />

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#2a2035' }}>
                <tr>
                  {['Usuário', 'Status', 'Vencimento', 'Desde', 'Ações'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.filter(u => !u.is_admin).map((u, i) => {
                  const st = STATUS[userStatus(u)]
                  return (
                    <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? '#1a1025' : '#1e1530', borderTop: '1px solid #3a3050' }}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{u.name ?? '—'}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                        {u.notes && <div className="text-xs text-gray-600 italic mt-0.5">{u.notes}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fmt(u.plan_expires_at)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{fmt(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePlan(u)}
                            className="text-xs px-2 py-1 rounded-lg transition-colors"
                            style={{
                              backgroundColor: u.plan_active ? '#7f1d1d33' : '#14532d33',
                              color: u.plan_active ? '#f87171' : '#4ade80',
                              border: `1px solid ${u.plan_active ? '#dc262644' : '#16a34a44'}`,
                            }}>
                            {u.plan_active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => { setEditingUser(u); setNewExpiry(u.plan_expires_at?.slice(0, 10) ?? '') }}
                            className="text-xs px-2 py-1 rounded-lg"
                            style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', color: '#9ca3af' }}>
                            Vencimento
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Expiry edit modal */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="rounded-2xl p-6 space-y-4 w-80" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
                <h3 className="text-white font-semibold">Editar vencimento</h3>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{editingUser.name ?? editingUser.email}</div>
                  <input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)}
                    className={`${IN} w-full`} style={S} />
                  <div className="text-[10px] text-gray-600 mt-1">Deixe em branco para não expirar</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingUser(null)}
                    className="flex-1 py-2 rounded-lg text-sm text-gray-400"
                    style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>Cancelar</button>
                  <button onClick={saveExpiry} disabled={saving}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: '#7c3aed', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── METRICS TAB ── */}
      {tab === 'metrics' && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3a3050' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#2a2035' }}>
              <tr>
                {['Usuário', 'Transações Coins', 'Itens', 'Contas', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.filter(u => !u.is_admin).map((u, i) => {
                const m = metrics[u.id] ?? {}
                const st = STATUS[userStatus(u)]
                return (
                  <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? '#1a1025' : '#1e1530', borderTop: '1px solid #3a3050' }}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{u.name ?? '—'}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{m.coins ?? 0}</td>
                    <td className="px-4 py-3 text-gray-300">{m.items ?? 0}</td>
                    <td className="px-4 py-3 text-gray-300">{m.accounts ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PAYMENTS TAB ── */}
      {tab === 'payments' && (
        <div className="space-y-4">
          {/* Log new payment */}
          <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
            <div className="text-sm font-semibold text-white">Registrar pagamento PIX</div>
            <div className="flex flex-wrap gap-3">
              <select value={newPayment.userId} onChange={e => setNewPayment(p => ({ ...p, userId: e.target.value }))}
                className={`${IN}`} style={S}>
                <option value="">Selecionar usuário</option>
                {users.filter(u => !u.is_admin).map(u => (
                  <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
                ))}
              </select>
              <input type="number" step="0.01" placeholder="Valor R$"
                value={newPayment.amount} onChange={e => setNewPayment(p => ({ ...p, amount: e.target.value }))}
                className={`${IN} w-28`} style={S} />
              <input type="text" placeholder="Observação (ex: jan/2025)"
                value={newPayment.note} onChange={e => setNewPayment(p => ({ ...p, note: e.target.value }))}
                className={`${IN} flex-1 min-w-32`} style={S} />
              <button onClick={addPayment}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: '#7c3aed' }}>
                Registrar
              </button>
            </div>
          </div>

          {/* Payment history */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#2a2035' }}>
                <tr>
                  {['Data', 'Usuário', 'Valor', 'Observação'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentLog.map((p, i) => {
                  const u = users.find(u => u.id === p.user_id)
                  return (
                    <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#1a1025' : '#1e1530', borderTop: '1px solid #3a3050' }}>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fmt(p.paid_at)}</td>
                      <td className="px-4 py-3 text-gray-300">{u?.name ?? u?.email ?? p.user_id.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#4ade80' }}>R$ {Number(p.amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.note ?? '—'}</td>
                    </tr>
                  )
                })}
                {paymentLog.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-600">Nenhum pagamento registrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
