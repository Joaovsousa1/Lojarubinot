import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle, Calculator, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  formatCurrency, formatNumber, formatDateTime, generateId,
} from '../../utils/helpers'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none transition-colors'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

function CoinForm({ type, onClose }) {
  const { settings, addCoinTransaction } = useApp()
  const isEntrada = type === 'entrada'
  const [form, setForm] = useState({
    quantity: '',
    packageType: '10k',
    pricePerK: isEntrada ? settings.coinPrices.buy10k : settings.coinPrices.sell,
    totalValue: '',
    server: settings.servers[0] ?? '',
    observation: '',
  })

  const qty = parseFloat(form.quantity) || 0
  const calculatedTotal = qty * form.pricePerK / 1000
  const profit = isEntrada ? null : calculatedTotal - qty * settings.coinPrices.buy10k / 1000

  const handlePackageChange = (pkg) => {
    const price = pkg === '1k' ? settings.coinPrices.buy1k : settings.coinPrices.buy10k
    setForm(f => ({ ...f, packageType: pkg, pricePerK: isEntrada ? price : f.pricePerK }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!qty) return
    const tx = {
      type,
      date: new Date().toISOString(),
      quantity: qty,
      server: form.server,
      observation: form.observation,
      pricePerK: parseFloat(form.pricePerK),
    }
    if (isEntrada) {
      tx.packageType = form.packageType
      tx.totalPaid = calculatedTotal
    } else {
      tx.totalReceived = calculatedTotal
      tx.profit = profit
    }
    addCoinTransaction(tx)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Quantidade de coins</label>
          <input
            type="number" min="1" required
            className={INPUT} style={INPUT_STYLE}
            value={form.quantity}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
            placeholder="Ex: 50000"
          />
        </div>
        {isEntrada && (
          <div>
            <label className={LABEL}>Pacote</label>
            <div className="flex gap-2 mt-1">
              {['1k', '10k'].map(p => (
                <button type="button" key={p}
                  onClick={() => handlePackageChange(p)}
                  className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: form.packageType === p ? '#7c3aed' : '#1a1025',
                    border: '1px solid ' + (form.packageType === p ? '#7c3aed' : '#3a3050'),
                    color: form.packageType === p ? '#fff' : '#9ca3af',
                  }}
                >{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Preço por 1k (R$)</label>
          <input
            type="number" step="0.01" min="0" required
            className={INPUT} style={INPUT_STYLE}
            value={form.pricePerK}
            onChange={e => setForm(f => ({ ...f, pricePerK: e.target.value }))}
          />
        </div>
        <div>
          <label className={LABEL}>Servidor</label>
          <select
            className={INPUT} style={INPUT_STYLE}
            value={form.server}
            onChange={e => setForm(f => ({ ...f, server: e.target.value }))}
          >
            {settings.servers.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Observação</label>
        <input
          type="text"
          className={INPUT} style={INPUT_STYLE}
          value={form.observation}
          onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
          placeholder="Opcional"
        />
      </div>

      {qty > 0 && (
        <div className="rounded-lg p-3 space-y-1.5" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{isEntrada ? 'Custo total' : 'Receita'}</span>
            <span className="text-white font-semibold">{formatCurrency(calculatedTotal)}</span>
          </div>
          {!isEntrada && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Lucro estimado</span>
              <span style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }} className="font-semibold">
                {formatCurrency(profit)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
        >Cancelar</button>
        <button type="submit"
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#7c3aed' }}
        >Registrar</button>
      </div>
    </form>
  )
}

function CoinCalculator() {
  const { settings } = useApp()
  const [qty, setQty] = useState('')
  const q = parseFloat(qty) || 0
  const cost1k  = q * settings.coinPrices.buy1k  / 1000
  const cost10k = q * settings.coinPrices.buy10k / 1000
  const revenue = q * settings.coinPrices.sell   / 1000
  const profit1k  = revenue - cost1k
  const profit10k = revenue - cost10k

  return (
    <div className="max-w-sm space-y-4">
      <div>
        <label className={LABEL}>Quantidade de coins</label>
        <input
          type="number" min="0"
          className={INPUT} style={INPUT_STYLE}
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="Ex: 10000"
        />
      </div>
      {q > 0 && (
        <div className="space-y-3">
          {[
            { label: 'Pacote 1k',  cost: cost1k,  profit: profit1k  },
            { label: 'Pacote 10k', cost: cost10k, profit: profit10k },
          ].map(row => (
            <div key={row.label} className="rounded-lg p-4 space-y-2" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{row.label}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500">Custo</div>
                  <div className="text-sm font-semibold text-red-400">{formatCurrency(row.cost)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Receita</div>
                  <div className="text-sm font-semibold text-blue-400">{formatCurrency(revenue)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Lucro</div>
                  <div className="text-sm font-semibold" style={{ color: '#4ade80' }}>{formatCurrency(row.profit)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CoinModal({ type, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isEntrada = type === 'entrada'
  const title = isEntrada ? '⬇ Registrar Entrada' : '⬆ Registrar Saída'
  const accent = isEntrada ? '#16a34a' : '#dc2626'
  const accentBg = isEntrada ? '#14532d' : '#7f1d1d'
  const accentText = isEntrada ? '#4ade80' : '#f87171'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: '#1c1530', border: `1px solid ${accent}`, boxShadow: `0 0 40px ${accentBg}88` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: accentText }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors text-gray-500 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <CoinForm type={type} onClose={onClose} />
      </div>
    </div>
  )
}

export default function CoinsModule() {
  const { coins, deleteCoinTransaction, settings } = useApp()
  const [tab, setTab] = useState('historico')
  const [formType, setFormType] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [filterServer, setFilterServer] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const filtered = useMemo(() => {
    return coins.filter(c => {
      if (filterServer && c.server !== filterServer) return false
      if (filterFrom && c.date < filterFrom) return false
      if (filterTo && c.date > filterTo + 'T23:59:59') return false
      return true
    }).sort((a, b) => b.date.localeCompare(a.date))
  }, [coins, filterServer, filterFrom, filterTo])

  const balances = useMemo(() => {
    const map = {}
    coins.forEach(c => {
      if (!map[c.server]) map[c.server] = 0
      if (c.type === 'entrada') map[c.server] += c.quantity
      else map[c.server] -= c.quantity
    })
    return map
  }, [coins])

  const TABS = [
    { id: 'historico',  label: 'Histórico' },
    { id: 'registrar',  label: 'Registrar' },
    { id: 'calculadora',label: 'Calculadora' },
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Coins</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalType('entrada')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#14532d', color: '#4ade80', border: '1px solid #16a34a' }}
          ><ArrowDownCircle size={15} /> Entrada</button>
          <button
            onClick={() => setModalType('saida')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#7f1d1d', color: '#f87171', border: '1px solid #dc2626' }}
          ><ArrowUpCircle size={15} /> Saída</button>
        </div>
      </div>

      {/* Balances */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(balances).map(([srv, bal]) => (
          <div key={srv} className="rounded-lg px-4 py-2 text-sm" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
            <span className="text-gray-400">{srv}: </span>
            <span className="font-bold text-white">{formatNumber(Math.max(0, bal))}</span>
            <span className="text-gray-500 ml-1">coins</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#3a3050' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: tab === t.id ? '#7c3aed' : 'transparent',
              color: tab === t.id ? '#c084fc' : '#6b7280',
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'historico' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="px-3 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}
              value={filterServer} onChange={e => setFilterServer(e.target.value)}
            >
              <option value="">Todos servidores</option>
              {settings.servers.map(s => <option key={s}>{s}</option>)}
            </select>
            <input type="date" value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}
            />
            <input type="date" value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm text-white"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}
            />
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#1a1025' }}>
                  {['Tipo', 'Data', 'Quantidade', 'Preço/k', 'Total', 'Servidor', 'Lucro', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Sem transações.</td></tr>
                )}
                {filtered.map(c => (
                  <tr key={c.id} className="border-t" style={{ borderColor: '#3a3050' }}>
                    <td className="px-4 py-3">
                      {c.type === 'entrada'
                        ? <span className="flex items-center gap-1 text-green-400"><ArrowDownCircle size={14} /> Entrada</span>
                        : <span className="flex items-center gap-1 text-red-400"><ArrowUpCircle size={14} /> Saída</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-gray-400">{formatDateTime(c.date)}</td>
                    <td className="px-4 py-3 text-white font-medium">{formatNumber(c.quantity)}</td>
                    <td className="px-4 py-3 text-gray-400">{formatCurrency(c.pricePerK)}</td>
                    <td className="px-4 py-3 text-white">
                      {c.type === 'entrada' ? formatCurrency(c.totalPaid) : formatCurrency(c.totalReceived)}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{c.server}</td>
                    <td className="px-4 py-3">
                      {c.type === 'saida'
                        ? <span style={{ color: '#4ade80' }}>{formatCurrency(c.profit)}</span>
                        : <span className="text-gray-600">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteCoinTransaction(c.id)}
                        className="p-1 rounded hover:bg-red-900/50 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'registrar' && (
        <div className="max-w-md space-y-4">
          <div className="flex gap-2">
            {['entrada', 'saida'].map(t => (
              <button key={t} onClick={() => setFormType(t)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: formType === t ? (t === 'entrada' ? '#14532d' : '#7f1d1d') : '#2a2035',
                  color: formType === t ? (t === 'entrada' ? '#4ade80' : '#f87171') : '#9ca3af',
                  border: '1px solid ' + (formType === t ? (t === 'entrada' ? '#16a34a' : '#dc2626') : '#3a3050'),
                }}
              >{t === 'entrada' ? '⬇ Entrada' : '⬆ Saída'}</button>
            ))}
          </div>
          {formType && <CoinForm key={formType} type={formType} onClose={() => setFormType(null)} />}
        </div>
      )}

      {tab === 'calculadora' && (
        <div>
          <h2 className="text-base font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Calculator size={16} /> Calculadora rápida
          </h2>
          <CoinCalculator />
        </div>
      )}

      {modalType && <CoinModal type={modalType} onClose={() => setModalType(null)} />}
    </div>
  )
}
