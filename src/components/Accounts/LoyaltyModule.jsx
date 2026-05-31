import React, { useState } from 'react'
import { Plus, Pencil, Trash2, X, Star, DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatNumber, formatDate, STATUS_COLORS } from '../../utils/helpers'
import Modal from '../UI/Modal'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

const STATUSES = ['disponível', 'reservada', 'em negociação', 'vendida']

const EMPTY = {
  email: '', server: 'Todos', vipDays: '', loyaltyPoints: '',
  buyPrice: '', sellPrice: '', status: 'disponível', notes: '',
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
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      vipDays:       parseInt(form.vipDays)       || 0,
      loyaltyPoints: parseInt(form.loyaltyPoints) || 0,
      buyPrice:      parseFloat(form.buyPrice)    || 0,
      sellPrice:     parseFloat(form.sellPrice)   || 0,
      dateSold: form.status === 'vendida'
        ? (initial?.dateSold ?? new Date().toISOString())
        : null,
    })
  }

  const profit = (parseFloat(form.sellPrice) || 0) - (parseFloat(form.buyPrice) || 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Email */}
      <div>
        <label className={LABEL}>E-mail da conta <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="text" required className={INPUT} style={INPUT_STYLE}
          value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="exemplo@email.com" />
      </div>

      {/* Server */}
      <div>
        <label className={LABEL}>Servidor <span style={{ color: '#4b5563', fontWeight: 400 }}>— opcional</span></label>
        <select className={INPUT} style={INPUT_STYLE} value={form.server} onChange={e => set('server', e.target.value)}>
          <option value="Todos">Todos os servidores</option>
          {servers.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* VIP + Loyalty */}
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
        </div>
      </div>

      {/* Prices */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#130e1e', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Compra (R$)</label>
            <input type="number" step="0.01" min="0" required className={INPUT} style={INPUT_STYLE}
              value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Venda (R$) <span style={{ color: '#4b5563', fontWeight: 400 }}>— opcional</span></label>
            <input type="number" step="0.01" min="0" className={INPUT} style={INPUT_STYLE}
              value={form.sellPrice} onChange={e => set('sellPrice', e.target.value)} placeholder="Definir depois" />
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

      {/* Status */}
      <div>
        <label className={LABEL}>Status</label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button type="button" key={s} onClick={() => set('status', s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: form.status === s ? '#7c3aed' : '#1a1025',
                border: '1px solid ' + (form.status === s ? '#7c3aed' : '#3a3050'),
                color: form.status === s ? '#fff' : '#9ca3af',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Notes */}
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
          style={{ backgroundColor: '#7c3aed' }}>
          {initial ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
}

function LoyaltyCard({ acc, onEdit, onDelete }) {
  const profit = (acc.sellPrice || 0) - (acc.buyPrice || 0)
  const emailMasked = acc.email
    ? acc.email.replace(/(.{2})(.+?)(@)/, (_, a, b, at) => a + '*'.repeat(Math.min(b.length, 4)) + at)
    : '—'

  return (
    <div className="rounded-xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: '#2a2035', border: '1px solid #7c3aed33' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-white font-bold text-sm truncate" title={acc.email}>{emailMasked}</div>
          {acc.server && acc.server !== 'Todos' && (
            <div className="text-gray-500 text-xs mt-0.5">{acc.server}</div>
          )}
        </div>
        <StatusBadge status={acc.status} />
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        {acc.vipDays > 0 && (
          <div className="flex flex-col items-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1a1025', border: '1px solid #78350f' }}>
            <span className="text-[10px] text-gray-500">VIP</span>
            <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>{formatNumber(acc.vipDays)}d</span>
          </div>
        )}
        {acc.loyaltyPoints > 0 && (
          <div className="flex flex-col items-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1a1025', border: '1px solid #7c3aed44' }}>
            <span className="text-[10px] text-gray-500">Loyalty</span>
            <span className="text-xs font-bold" style={{ color: '#c084fc' }}>{formatNumber(acc.loyaltyPoints)}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {acc.notes && (
        <div className="text-xs text-gray-500 italic">{acc.notes}</div>
      )}

      {/* Prices */}
      <div className="rounded-lg px-3 py-2 mt-auto" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-gray-500 text-[10px]">Compra</div>
            <div className="text-gray-300 font-medium">{formatCurrency(acc.buyPrice)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Lucro</div>
            <div className="font-bold" style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }}>
              {formatCurrency(profit)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-[10px]">Venda</div>
            <div className="font-bold text-white">{acc.sellPrice > 0 ? formatCurrency(acc.sellPrice) : '—'}</div>
          </div>
        </div>
        {acc.dateSold && (
          <div className="text-[10px] text-gray-600 text-center mt-1">Vendida em {formatDate(acc.dateSold)}</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#3b0764', border: '1px solid #6d28d9', color: '#c084fc' }}>
          <Pencil size={12} /> Editar
        </button>
        <button onClick={onDelete}
          className="py-1.5 px-3 rounded-lg text-xs"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#ef4444' }}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

export default function LoyaltyModule() {
  const { settings, addLoyaltyAccount, updateLoyaltyAccount, deleteLoyaltyAccount } = useApp()
  const loyaltyAccounts = settings.loyaltyAccounts ?? []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const servers = settings.servers ?? []

  const stats = {
    available: loyaltyAccounts.filter(a => a.status === 'disponível').length,
    sold:      loyaltyAccounts.filter(a => a.status === 'vendida').length,
    totalProfit: loyaltyAccounts.filter(a => a.status === 'vendida')
      .reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0),
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.available} disponíveis · {stats.sold} vendidas · lucro total {formatCurrency(stats.totalProfit)}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#7c3aed' }}>
          <Plus size={16} /> Nova conta Loyalty
        </button>
      </div>

      {loyaltyAccounts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Star size={32} className="mx-auto mb-3 opacity-30" />
          <div>Nenhuma conta Loyalty cadastrada.</div>
          <div className="text-xs mt-1">Clique em "Nova conta Loyalty" para adicionar.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loyaltyAccounts.map(acc => (
            <LoyaltyCard
              key={acc.id}
              acc={acc}
              onEdit={() => setEditing(acc)}
              onDelete={() => {
                if (confirm(`Excluir conta ${acc.email}?`)) deleteLoyaltyAccount(acc.id)
              }}
            />
          ))}
        </div>
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
    </div>
  )
}
