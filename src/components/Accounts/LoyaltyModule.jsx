import React, { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Star, DollarSign, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatNumber, formatDate, STATUS_COLORS } from '../../utils/helpers'
import Modal from '../UI/Modal'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

const STATUSES = ['disponível', 'reservada', 'em negociação', 'vendida']

const LOYALTY_TIERS = [
  { pts: 70, bonus: 10, title: 'Enlightened of RubinOT' },
  { pts: 56, bonus: 9,  title: 'Savant of RubinOT' },
  { pts: 42, bonus: 8,  title: 'Sage of RubinOT' },
  { pts: 30, bonus: 7,  title: 'Guardian of RubinOT' },
  { pts: 21, bonus: 6,  title: 'Keeper of RubinOT' },
  { pts: 15, bonus: 5,  title: 'Warrior of RubinOT' },
  { pts:  9, bonus: 4,  title: 'Squire of RubinOT' },
  { pts:  6, bonus: 3,  title: 'Warden of RubinOT' },
  { pts:  3, bonus: 2,  title: 'Steward of RubinOT' },
  { pts:  1, bonus: 1,  title: 'Sentinel of RubinOT' },
]

function getLoyaltyInfo(pts) {
  const p = pts ?? 0
  for (const tier of LOYALTY_TIERS) {
    if (p >= tier.pts) return tier
  }
  return { pts: 0, bonus: 0, title: 'Scout of RubinOT' }
}

const EMPTY = {
  email: '', server: 'Todos', vipDays: '', loyaltyPoints: '',
  buyPrice: '', sellPrice: '', status: 'disponível', notes: '',
}

function toDateInput(iso) {
  if (!iso) return new Date().toISOString().split('T')[0]
  try { return new Date(iso).toISOString().split('T')[0] } catch { return new Date().toISOString().split('T')[0] }
}

function toISO(dateStr) {
  if (!dateStr) return new Date().toISOString()
  try { return new Date(dateStr + 'T12:00:00.000Z').toISOString() } catch { return new Date().toISOString() }
}

function curMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] ?? { bg: '#374151', text: '#9ca3af' }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}>{status}</span>
  )
}


function LoyaltyForm({ initial, servers, onSubmit, onClose }) {
  const [form, setForm] = useState(initial
    ? { ...EMPTY, ...initial }
    : { ...EMPTY, server: servers[0] ?? '' }
  )
  const [dateSoldStr, setDateSoldStr] = useState(() => toDateInput(initial?.dateSold))

  const set = (k, v) => setForm(f => {
    const upd = { ...f, [k]: v }
    if (!initial && k === 'sellPrice' && parseFloat(v) > 0 && upd.status === 'disponível') {
      return { ...upd, status: 'vendida' }
    }
    return upd
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      vipDays:       parseInt(form.vipDays)       || 0,
      loyaltyPoints: parseInt(form.loyaltyPoints) || 0,
      buyPrice:      parseFloat(form.buyPrice)    || 0,
      sellPrice:     parseFloat(form.sellPrice)   || 0,
      dateSold: form.status === 'vendida' ? toISO(dateSoldStr) : null,
    })
  }

  const profit = (parseFloat(form.sellPrice) || 0) - (parseFloat(form.buyPrice) || 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className={LABEL}>E-mail da conta <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="text" required className={INPUT} style={INPUT_STYLE}
          value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="exemplo@email.com" />
      </div>

      <div>
        <label className={LABEL}>Servidor <span style={{ color: '#4b5563', fontWeight: 400 }}>— opcional</span></label>
        <select className={INPUT} style={INPUT_STYLE} value={form.server} onChange={e => set('server', e.target.value)}>
          <option value="Todos">Todos os servidores</option>
          {servers.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Dias de VIP</label>
          <input type="number" min="0" className={INPUT} style={INPUT_STYLE}
            value={form.vipDays} onChange={e => set('vipDays', e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className={LABEL}>Pontos de Loyalty</label>
          <input type="number" min="0" className={INPUT} style={INPUT_STYLE}
            value={form.loyaltyPoints} onChange={e => set('loyaltyPoints', e.target.value)} placeholder="0" />
          {parseInt(form.loyaltyPoints) > 0 && (() => {
            const info = getLoyaltyInfo(parseInt(form.loyaltyPoints))
            return (
              <div className="mt-1 px-2 py-1 rounded text-xs"
                style={{ backgroundColor: '#1a1025', border: '1px solid #7c3aed44', color: '#a78bfa' }}>
                {info.title} · <span style={{ color: '#c084fc' }}>+{info.bonus} skill</span>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#130e1e', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Compra (R$)</label>
            <input type="number" step="0.01" min="0" required className={INPUT} style={INPUT_STYLE}
              value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>
              Venda (R$)
              {!initial && <span className="text-[10px] ml-1" style={{ color: '#7c3aed' }}>→ marca como vendida</span>}
            </label>
            <input type="number" step="0.01" min="0" className={INPUT} style={INPUT_STYLE}
              value={form.sellPrice} onChange={e => set('sellPrice', e.target.value)} placeholder="0,00" />
          </div>
        </div>
        {form.buyPrice && form.sellPrice && (
          <div className="flex justify-between text-sm px-1">
            <span className="text-gray-400">Lucro estimado</span>
            <span style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }} className="font-semibold">
              {formatCurrency(profit)}
            </span>
          </div>
        )}
      </div>

      <div>
        <label className={LABEL}>Status</label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button type="button" key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: form.status === s ? (s === 'vendida' ? '#16a34a' : '#7c3aed') : '#1a1025',
                border: '1px solid ' + (form.status === s ? (s === 'vendida' ? '#16a34a' : '#7c3aed') : '#3a3050'),
                color: form.status === s ? '#fff' : '#9ca3af',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {form.status === 'vendida' && (
        <div>
          <label className={LABEL}>
            Data de venda <span style={{ color: '#ef4444' }}>*</span>
            <span className="text-[10px] ml-1" style={{ color: '#4b5563' }}>— define em qual mês aparece no dashboard</span>
          </label>
          <input type="date" required className={INPUT} style={INPUT_STYLE}
            value={dateSoldStr} onChange={e => setDateSoldStr(e.target.value)} />
        </div>
      )}

      <div>
        <label className={LABEL}>Observações</label>
        <textarea rows={3} className={INPUT} style={{ ...INPUT_STYLE, resize: 'vertical' }}
          value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Ex: senha original, dados extras..." />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}>
          Cancelar
        </button>
        <button type="submit"
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: form.status === 'vendida' ? '#16a34a' : '#7c3aed' }}>
          {initial ? 'Salvar' : (form.status === 'vendida' ? '✓ Registrar venda' : 'Adicionar')}
        </button>
      </div>
    </form>
  )
}

function SellModal({ acc, onClose, onConfirm }) {
  const [price, setPrice]     = useState(acc.sellPrice > 0 ? String(acc.sellPrice) : '')
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0])
  const profit = (parseFloat(price) || 0) - (acc.buyPrice || 0)

  return (
    <Modal title={`Vender — ${acc.email}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className={LABEL}>Preço de venda (R$) <span style={{ color: '#ef4444' }}>*</span></label>
          <input type="number" step="0.01" min="0" autoFocus className={INPUT} style={INPUT_STYLE}
            value={price} onChange={e => setPrice(e.target.value)} placeholder="0,00" />
        </div>
        <div>
          <label className={LABEL}>
            Data de venda
            <span className="text-[10px] ml-1" style={{ color: '#4b5563' }}>— define em qual mês aparece no dashboard</span>
          </label>
          <input type="date" className={INPUT} style={INPUT_STYLE}
            value={dateStr} onChange={e => setDateStr(e.target.value)} />
        </div>
        {price && (
          <div className="flex justify-between text-sm px-3 py-2 rounded-lg"
            style={{ backgroundColor: '#130e1e', border: '1px solid #3a3050' }}>
            <span className="text-gray-400">Lucro</span>
            <span style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }} className="font-semibold">
              {formatCurrency(profit)}
            </span>
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}>
            Cancelar
          </button>
          <button type="button"
            onClick={() => { if (!price) return; onConfirm(parseFloat(price), toISO(dateStr)) }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#16a34a', opacity: price ? 1 : 0.5 }}>
            Marcar como vendida
          </button>
        </div>
      </div>
    </Modal>
  )
}

function LoyaltyCard({ acc, onEdit, onDelete, onSell }) {
  const isSold = acc.status === 'vendida'
  const profit = (acc.sellPrice || 0) - (acc.buyPrice || 0)
  const info   = getLoyaltyInfo(acc.loyaltyPoints ?? 0)

  return (
    <div className="rounded-xl px-4 py-3 flex items-center gap-4"
      style={{
        backgroundColor: '#1e1630',
        border: `1px solid ${isSold ? '#16a34a22' : '#7c3aed22'}`,
        opacity: isSold ? 0.7 : 1,
      }}>

      {/* Loyalty badge */}
      <div className="shrink-0 w-14 text-center">
        {info.bonus > 0 ? (
          <>
            <div className="text-xl font-black leading-none" style={{ color: '#c084fc' }}>+{info.bonus}</div>
            <div className="text-[10px] font-semibold" style={{ color: '#6d4aab' }}>skill</div>
          </>
        ) : (
          <div className="text-[11px] text-gray-600">— pts</div>
        )}
        {acc.loyaltyPoints > 0 && (
          <div className="text-[9px] mt-0.5" style={{ color: '#4b3a70' }}>{formatNumber(acc.loyaltyPoints)} pts</div>
        )}
      </div>

      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{acc.email || '—'}</span>
          <StatusBadge status={acc.status} />
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {acc.server && acc.server !== 'Todos' && (
            <span className="text-xs text-gray-600">{acc.server}</span>
          )}
          {acc.vipDays > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: '#78350f22', color: '#fbbf24', border: '1px solid #78350f33' }}>
              {formatNumber(acc.vipDays)}d VIP
            </span>
          )}
          {acc.notes && (
            <span className="text-[11px] text-gray-600 italic truncate max-w-[140px]">{acc.notes}</span>
          )}
        </div>
      </div>

      {/* Preços */}
      <div className="shrink-0 text-right">
        <div className="text-xs font-bold text-white">
          {acc.sellPrice > 0 ? formatCurrency(acc.sellPrice) : <span className="text-gray-600">—</span>}
        </div>
        {isSold && (
          <div className="text-[11px] font-semibold mt-0.5"
            style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }}>
            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
          </div>
        )}
        {!isSold && acc.buyPrice > 0 && (
          <div className="text-[10px] text-gray-600">{formatCurrency(acc.buyPrice)} compra</div>
        )}
      </div>

      {/* Ações */}
      <div className="shrink-0 flex items-center gap-1">
        {!isSold && (
          <button onClick={onSell} title="Marcar como vendida"
            className="p-1.5 rounded-lg transition-colors hover:bg-green-900/40"
            style={{ color: '#4ade80' }}>
            <DollarSign size={14} />
          </button>
        )}
        <button onClick={onEdit} title="Editar"
          className="p-1.5 rounded-lg transition-colors hover:bg-purple-900/40"
          style={{ color: '#a78bfa' }}>
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} title="Excluir"
          className="p-1.5 rounded-lg transition-colors hover:bg-red-900/40"
          style={{ color: '#6b7280' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function LoyaltyModule() {
  const { settings, addLoyaltyAccount, updateLoyaltyAccount, deleteLoyaltyAccount } = useApp()
  const loyaltyAccounts = settings.loyaltyAccounts ?? []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [selling, setSelling]   = useState(null)
  const [search, setSearch]     = useState('')
  const [filterServer, setFilterServer] = useState('Todos')

  const servers = settings.servers ?? []

  const cur = curMonth()
  const stats = useMemo(() => ({
    available:   loyaltyAccounts.filter(a => a.status !== 'vendida').length,
    sold:        loyaltyAccounts.filter(a => a.status === 'vendida').length,
    thisMonth:   loyaltyAccounts.filter(a => a.status === 'vendida' && (a.dateSold ?? a.dateEntry)?.startsWith(cur)).length,
    monthProfit: loyaltyAccounts
      .filter(a => a.status === 'vendida' && (a.dateSold ?? a.dateEntry)?.startsWith(cur))
      .reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0),
    totalProfit: loyaltyAccounts
      .filter(a => a.status === 'vendida')
      .reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0),
  }), [loyaltyAccounts, cur])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return loyaltyAccounts.filter(a => {
      const matchSearch = !q ||
        (a.email ?? '').toLowerCase().includes(q) ||
        (a.notes ?? '').toLowerCase().includes(q)
      const matchServer = filterServer === 'Todos' || a.server === filterServer || (!a.server && filterServer === 'Todos')
      return matchSearch && matchServer
    })
  }, [loyaltyAccounts, search, filterServer])

  const byLoyalty = (a, b) => (b.loyaltyPoints ?? 0) - (a.loyaltyPoints ?? 0)
  const available = filtered.filter(a => a.status !== 'vendida').sort(byLoyalty)
  const sold      = filtered.filter(a => a.status === 'vendida').sort(byLoyalty)

  const renderCard = (acc) => (
    <LoyaltyCard
      key={acc.id}
      acc={acc}
      onEdit={() => setEditing(acc)}
      onSell={() => setSelling(acc)}
      onDelete={() => { if (confirm(`Excluir conta ${acc.email}?`)) deleteLoyaltyAccount(acc.id) }}
    />
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Star size={16} style={{ color: '#a78bfa' }} />
          <span className="text-sm font-semibold text-white">Contas Fidelidade</span>
          <span className="text-xs" style={{ color: '#4b5563' }}>
            {stats.available} disponíveis · {stats.sold} vendidas
            {stats.monthProfit > 0 && (
              <span style={{ color: '#4ade80' }}> · +{formatCurrency(stats.monthProfit)} este mês</span>
            )}
          </span>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
          style={{ backgroundColor: '#7c3aed' }}>
          <Plus size={14} /> Nova conta
        </button>
      </div>

      {/* Barra de busca e filtros */}
      {loyaltyAccounts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4b5563' }} />
            <input
              type="text"
              placeholder="Buscar por email ou observação…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}
            />
          </div>
          {servers.length > 0 && (
            <select
              value={filterServer}
              onChange={e => setFilterServer(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
              <option value="Todos">Todos os servidores</option>
              {servers.map(s => <option key={s}>{s}</option>)}
            </select>
          )}
        </div>
      )}

      {/* Lista */}
      {loyaltyAccounts.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <Star size={36} className="mx-auto mb-3 opacity-20" />
          <div className="text-sm">Nenhuma conta Loyalty cadastrada.</div>
          <div className="text-xs mt-1 text-gray-700">Clique em "Nova conta" para adicionar.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <Search size={28} className="mx-auto mb-3 opacity-20" />
          <div className="text-sm">Nenhuma conta encontrada para "{search}".</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {available.map(renderCard)}
        </div>

        {sold.length > 0 && (
          <div>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{ backgroundColor: '#1f2937' }} />
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#14532d22', color: '#4ade80', border: '1px solid #16a34a33' }}>
                Vendidas · {sold.length}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#1f2937' }} />
            </div>
            <div className="space-y-1.5 opacity-70">
              {sold.map(renderCard)}
            </div>
          </div>
        )}
      )}

      {showForm && (
        <Modal title="Adicionar conta Loyalty" onClose={() => setShowForm(false)}>
          <LoyaltyForm
            servers={servers}
            onSubmit={(data) => { addLoyaltyAccount(data); setShowForm(false) }}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Editar — ${editing.email}`} onClose={() => setEditing(null)}>
          <LoyaltyForm
            initial={editing}
            servers={servers}
            onSubmit={(data) => { updateLoyaltyAccount(editing.id, data); setEditing(null) }}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}

      {selling && (
        <SellModal
          acc={selling}
          onClose={() => setSelling(null)}
          onConfirm={(price, dateSold) => {
            updateLoyaltyAccount(selling.id, { status: 'vendida', sellPrice: price, dateSold })
            setSelling(null)
          }}
        />
      )}
    </div>
  )
}
