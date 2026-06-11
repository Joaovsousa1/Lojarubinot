import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, Coins, Package, Users, ArrowRight, CalendarDays } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  formatCurrency, formatRC, formatNumber, getCurrentMonth, getLastNMonths,
  SET_COLORS, VOCATION_OUTFIT, VOCATION_COLORS, realSaleProfit,
} from '../../utils/helpers'
import ItemImage from '../UI/ItemImage'
import TierBadge from '../UI/TierBadge'

// ── helpers ──────────────────────────────────────────────────────────────────
function getProfitForRange(days, { coins, items, accounts, loyaltyAccounts, rate }) {
  const now = new Date()
  const cutoff = days === 0
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  const pad = (n) => String(n).padStart(2, '0')
  const cutoffStr = `${cutoff.getFullYear()}-${pad(cutoff.getMonth()+1)}-${pad(cutoff.getDate())}`
  const inRange = (d) => {
    if (!d) return false
    const dateStr = d.substring(0, 10) // "YYYY-MM-DD"
    return dateStr >= cutoffStr
  }
  const soldDate = (a) => a.dateSold ?? null

  const coinsProfit = coins
    .filter(c => !c.autoSync && c.type !== 'entrada' && inRange(c.date))
    .reduce((s, c) => s + (c.profit ?? 0), 0)

  const itemsProfit = items
    .flatMap(i => i.sales ?? [])
    .filter(s => inRange(s.date))
    .reduce((s, x) => s + realSaleProfit(x, rate), 0)

  const soldInRange = (a) => { const sd = soldDate(a); return sd && inRange(sd) }
  const accProfit =
    accounts.filter(a => a.status === 'vendida' && soldInRange(a))
      .reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0) +
    loyaltyAccounts.filter(a => a.status === 'vendida' && soldInRange(a))
      .reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0)

  return { coinsProfit, itemsProfit, accProfit, total: coinsProfit + itemsProfit + accProfit }
}

const PERIODS = [
  { label: 'Hoje',   days: 0  },
  { label: '7 dias', days: 7  },
  { label: '15 dias', days: 15 },
  { label: '30 dias', days: 30 },
]

function ProfitPeriodSection({ coins, items, accounts, loyaltyAccounts, rate }) {
  const [active, setActive] = useState(1)
  const data = PERIODS.map(p => ({
    ...p,
    ...getProfitForRange(p.days, { coins, items, accounts, loyaltyAccounts, rate }),
  }))
  const sel = data[active]

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden"
      style={{ backgroundColor: '#1e1330', border: '1px solid rgba(124,58,237,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>

      {/* header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <CalendarDays size={16} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Lucro por período</h2>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Selecione o intervalo de tempo</p>
          </div>
        </div>

        {/* period pills */}
        <div className="flex gap-1.5 flex-wrap">
          {PERIODS.map((p, i) => (
            <button key={p.label} onClick={() => setActive(i)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{
                backgroundColor: active === i ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.08)',
                border: active === i ? '1px solid rgba(167,85,247,0.6)' : '1px solid rgba(124,58,237,0.2)',
                color: active === i ? '#c084fc' : '#64748b',
                cursor: 'pointer',
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* main content */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* total */}
        <div>
          <div className="text-xs font-semibold mb-1" style={{ color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Total — {sel.label}
          </div>
          <div className="text-4xl font-black" style={{
            letterSpacing: '-1px',
            color: sel.total >= 0 ? '#f1f5f9' : '#f87171',
          }}>
            {formatCurrency(sel.total)}
          </div>
        </div>

        {/* breakdown */}
        <div className="flex gap-5 flex-wrap">
          {[
            { label: 'Coins',  value: sel.coinsProfit,  color: '#fbbf24', icon: '💰' },
            { label: 'Itens',  value: sel.itemsProfit,  color: '#c084fc', icon: '📦' },
            { label: 'Contas', value: sel.accProfit,    color: '#4ade80', icon: '👤' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 min-w-[80px]">
              <div className="text-xl">{s.icon}</div>
              <div className="text-sm font-black" style={{ color: s.color }}>{formatCurrency(s.value)}</div>
              <div className="text-[10px] font-semibold" style={{ color: '#475569' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* mini-bar visual */}
      {sel.total > 0 && (
        <div className="mt-5">
          <div className="flex rounded-full overflow-hidden h-2" style={{ gap: 2 }}>
            {[
              { value: sel.coinsProfit,  color: '#fbbf24' },
              { value: sel.itemsProfit,  color: '#a855f7' },
              { value: sel.accProfit,    color: '#22c55e' },
            ].filter(s => s.value > 0).map((s, i) => (
              <div key={i} style={{
                width: `${(s.value / sel.total) * 100}%`,
                backgroundColor: s.color,
                borderRadius: 4,
                minWidth: 4,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* all-period mini cards */}
      <div className="grid grid-cols-4 gap-2 mt-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {data.map((p, i) => (
          <button key={p.label} onClick={() => setActive(i)}
            className="rounded-xl p-3 text-left transition-all"
            style={{
              backgroundColor: active === i ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
              border: active === i ? '1px solid rgba(167,85,247,0.4)' : '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
            }}>
            <div className="text-[10px] font-bold mb-1" style={{ color: active === i ? '#a78bfa' : '#4b5563' }}>
              {p.label}
            </div>
            <div className="text-sm font-black" style={{ color: p.total >= 0 ? (active === i ? '#f1f5f9' : '#6b7280') : '#f87171' }}>
              {formatCurrency(p.total)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-sm shadow-2xl" style={{ backgroundColor: '#1e1330', border: '1px solid rgba(124,58,237,0.3)' }}>
      <div className="font-bold text-white mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.stroke || p.fill }} />
          <span style={{ color: '#94a3b8' }}>{p.name}:</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, color, title, main, sub, note, trend }) {
  return (
    <div className="rounded-2xl p-5 relative overflow-hidden transition-transform"
      style={{
        backgroundColor: '#1e1330',
        border: `1px solid ${color}28`,
        boxShadow: `0 4px 24px ${color}10`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${color}22` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 24px ${color}10` }}
    >
      {/* background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + '1e', border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: trend >= 0 ? '#14532d33' : '#7f1d1d33',
              color: trend >= 0 ? '#4ade80' : '#f87171',
            }}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend).toFixed(0)}%
          </div>
        )}
      </div>

      <div className="text-xs font-semibold mb-1.5" style={{ color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div className="text-2xl font-black mb-1" style={{ color: '#f1f5f9', letterSpacing: '-0.5px' }}>{main}</div>
      {sub && <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>}
      {note && (
        <div className="mt-2 text-xs font-semibold px-2 py-1 rounded-lg inline-block"
          style={{ backgroundColor: color + '14', color }}>
          {note}
        </div>
      )}
    </div>
  )
}

// ── Quick item row ─────────────────────────────────────────────────────────────
function ItemRow({ item }) {
  const sc = SET_COLORS[item.set] ?? SET_COLORS['Outros']
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl transition-colors cursor-default"
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${sc.secondary}ee, ${sc.secondary}88)`,
          border: `1px solid ${sc.primary}44`,
          boxShadow: `0 2px 10px ${sc.primary}22`,
        }}>
        <ItemImage src={item.imageUrl} category={item.category} size={26} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold truncate" style={{ color: '#e2e8f0' }}>{item.name}</span>
          <TierBadge tier={item.tier} />
        </div>
        <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{item.server || '—'}</div>
      </div>
      <div className="text-xs font-black shrink-0 px-2 py-1 rounded-lg"
        style={{ backgroundColor: sc.primary + '22', color: sc.accent, border: `1px solid ${sc.primary}33` }}>
        ×{item.quantity}
      </div>
    </div>
  )
}

// ── Account row ────────────────────────────────────────────────────────────────
function AccountRow({ account: a }) {
  const outfitUrl = VOCATION_OUTFIT[a.vocation]
  const vColor = VOCATION_COLORS[a.vocation] ?? '#6b7280'
  const STATUS_LABEL = {
    'disponível': { label: 'Disponível', color: '#4ade80', bg: '#14532d33' },
    'reservada': { label: 'Reservada', color: '#fbbf24', bg: '#78350f33' },
    'em negociação': { label: 'Negociando', color: '#60a5fa', bg: '#1e3a5f33' },
  }
  const st = STATUS_LABEL[a.status] || STATUS_LABEL['disponível']

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl transition-colors cursor-default"
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: vColor + '1e', border: `1px solid ${vColor}33`, boxShadow: `0 2px 8px ${vColor}18` }}>
        {outfitUrl
          ? <img src={outfitUrl} alt={a.vocation} className="h-8 w-8" style={{ imageRendering: 'pixelated' }}
              onError={e => { e.currentTarget.style.display = 'none' }} />
          : <span className="text-sm font-black" style={{ color: vColor }}>{a.vocation?.[0]}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
          {a.charName || `${a.vocation} Lv${a.level}`}
        </div>
        <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{a.server} · Lv {a.level}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="text-xs font-bold" style={{ color: '#94a3b8' }}>{formatCurrency(a.sellPrice)}</div>
        <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { coins, items, accounts, settings, setActiveModule, loadError } = useApp()
  const loyaltyAccounts = settings.loyaltyAccounts ?? []
  const { profile, isAdmin } = useAuth()
  const [diagResult, setDiagResult] = React.useState(null)
  const [diagLoading, setDiagLoading] = React.useState(false)

  const runDiag = async () => {
    setDiagLoading(true); setDiagResult(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) { setDiagResult({ error: 'Sem sessão ativa' }); return }
      const r = await fetch('/api/diagnose', { headers: { Authorization: `Bearer ${token}` } })
      if (!r.ok) { setDiagResult({ error: `HTTP ${r.status}` }); return }
      setDiagResult(await r.json())
    } catch (e) { setDiagResult({ error: e.message }) }
    finally { setDiagLoading(false) }
  }

  const cur = getCurrentMonth()

  const userName = profile?.name || profile?.email?.split('@')[0] || 'usuário'

  // Coins — exclui transações de auto-sync (compra/venda de item) dos contadores manuais
  const manualCoins     = coins.filter(c => !c.autoSync)
  const coinsBought     = manualCoins.filter(c => c.type === 'entrada' && c.date?.startsWith(cur)).reduce((s, c) => s + c.quantity, 0)
  const coinsSold       = manualCoins.filter(c => c.type !== 'entrada' && c.date?.startsWith(cur)).reduce((s, c) => s + c.quantity, 0)
  const coinsProfitPIX  = manualCoins.filter(c => c.type !== 'entrada' && c.date?.startsWith(cur)).reduce((s, c) => s + (c.profit ?? 0), 0)
  const totalCoinsStock = coins.reduce((s, c) => c.type === 'entrada' ? s + c.quantity : s - c.quantity, 0)

  // Items
  const allSales      = items.flatMap(i => i.sales ?? [])
  const monthSales    = allSales.filter(s => s.date?.startsWith(cur))
  const itemsInStock  = items.reduce((s, i) => s + i.quantity, 0)
  const itemsSoldQty  = monthSales.reduce((s, x) => s + x.quantity, 0)
  const rate           = settings.rcRate || 0.087
  const itemsProfitRC  = monthSales.reduce((s, x) => s + (x.profitRC ?? 0), 0)
  const itemsProfitPIX = monthSales.reduce((s, x) => s + realSaleProfit(x, rate), 0)

  // Accounts (regular + loyalty) — usa apenas dateSold; sem data de venda, exclui do mês
  const soldDate = (a) => a.dateSold ?? null
  const accAvailable     = accounts.filter(a => a.status === 'disponível').length
                         + loyaltyAccounts.filter(a => a.status === 'disponível').length
  const accSoldMonth     = accounts.filter(a => a.status === 'vendida' && (() => { const sd = soldDate(a); return sd && sd.startsWith(cur) })())
  const loyaltySoldMonth = loyaltyAccounts.filter(a => a.status === 'vendida' && (() => { const sd = soldDate(a); return sd && sd.startsWith(cur) })())
  const accProfitPIX     = accSoldMonth.reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0)
                         + loyaltySoldMonth.reduce((s, a) => s + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0)

  // Totals
  const totalPIX = coinsProfitPIX + itemsProfitPIX + accProfitPIX
  const totalRC  = itemsProfitRC

  // Chart: last 6 months area chart
  const months = getLastNMonths(6)
  const chartData = months.map(({ key, label }) => {
    const cp   = coins.filter(c => !c.autoSync && c.type !== 'entrada' && c.date?.startsWith(key)).reduce((s, c) => s + (c.profit ?? 0), 0)
    const sale = items.flatMap(i => i.sales ?? []).filter(s => s.date?.startsWith(key))
    const ip   = sale.reduce((s, x) => s + realSaleProfit(x, rate), 0)
    const ap   = accounts.filter(a => a.status === 'vendida' && (() => { const sd = soldDate(a); return sd && sd.startsWith(key) })()).reduce((s, a) => s + ((a.sellPrice||0)-(a.buyPrice||0)), 0)
               + loyaltyAccounts.filter(a => a.status === 'vendida' && (() => { const sd = soldDate(a); return sd && sd.startsWith(key) })()).reduce((s, a) => s + ((a.sellPrice||0)-(a.buyPrice||0)), 0)
    return { label, Coins: +cp.toFixed(2), Itens: +ip.toFixed(2), Contas: +ap.toFixed(2), Total: +(cp+ip+ap).toFixed(2) }
  })

  const hasAnyData = chartData.some(d => d.Total !== 0)
  const curMonthLabel = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#7c3aed' }}>
            {greeting()}, {userName} 👋
          </p>
          <h1 className="font-black text-white" style={{ fontSize: 28, letterSpacing: '-0.5px' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1 capitalize" style={{ color: '#475569' }}>{curMonthLabel}</p>
        </div>
        <button
          onClick={() => setActiveModule('reports')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#c084fc', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.15)' }}
        >
          📋 Ver relatório mensal
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ── Diagnóstico (só para admin/owner) ── */}
      {isAdmin && (loadError || diagResult) && (
        <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: '#0f172a', border: '1px solid #1d4ed8' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: '#60a5fa' }}>🔧 Diagnóstico de Carregamento</span>
            <button onClick={runDiag} disabled={diagLoading}
              className="text-xs px-3 py-1 rounded font-bold"
              style={{ backgroundColor: '#1e3a5f', color: '#93c5fd', border: '1px solid #2563eb' }}>
              {diagLoading ? 'Testando...' : '▶ Testar conexão'}
            </button>
          </div>
          {loadError && (
            <div className="text-xs font-mono p-2 rounded" style={{ backgroundColor: '#1e293b', color: '#fca5a5' }}>
              Erro nas queries: {loadError.code} — {loadError.message}
            </div>
          )}
          {diagResult && (
            <pre className="text-xs font-mono p-2 rounded overflow-auto max-h-48"
              style={{ backgroundColor: '#1e293b', color: '#7dd3fc' }}>
              {JSON.stringify(diagResult, null, 2)}
            </pre>
          )}
        </div>
      )}
      {isAdmin && !loadError && !diagResult && (
        <div className="flex justify-end">
          <button onClick={runDiag} disabled={diagLoading}
            className="text-xs px-2 py-1 rounded opacity-30 hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#1e3a5f', color: '#93c5fd', border: '1px solid #2563eb' }}>
            {diagLoading ? 'Testando...' : '🔧 Testar conexão Supabase'}
          </button>
        </div>
      )}

      {/* ── Hero profit card ── */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2d1b5e 0%, #3b1a7a 40%, #4c1d95 100%)',
          border: '1px solid rgba(167,85,247,0.4)',
          boxShadow: '0 8px 40px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>

        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,85,247,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <TrendingUp size={18} style={{ color: '#fde68a' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>Lucro Total do Mês</span>
            </div>
            <div className="text-5xl font-black text-white mb-1" style={{ letterSpacing: '-1.5px' }}>
              {formatCurrency(totalPIX)}
            </div>
            {totalRC > 0 && (
              <div className="text-xl font-bold" style={{ color: '#fde68a' }}>
                + {formatRC(totalRC)}
              </div>
            )}
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: 'em Coins', value: formatCurrency(coinsProfitPIX), color: '#fbbf24', icon: '💰' },
              { label: 'em Itens', value: formatCurrency(itemsProfitPIX), color: '#c084fc', icon: '📦' },
              { label: 'em Contas', value: formatCurrency(accProfitPIX), color: '#4ade80', icon: '👤' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#a78bfa' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profit by period ── */}
      <ProfitPeriodSection
        coins={coins}
        items={items}
        accounts={accounts}
        loyaltyAccounts={loyaltyAccounts}
        rate={rate}
      />

      {/* ── Stat cards ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard
          icon={Coins} color="#f59e0b" title="Coins — lucro do mês"
          main={formatCurrency(coinsProfitPIX)}
          sub={`${formatNumber(coinsBought)} comprados · ${formatNumber(coinsSold)} vendidos`}
          note={totalCoinsStock > 0 ? `${formatNumber(totalCoinsStock)} em estoque` : null}
        />
        <StatCard
          icon={Package} color="#a855f7" title="Itens — lucro do mês"
          main={itemsProfitPIX > 0 ? formatCurrency(itemsProfitPIX) : itemsProfitRC > 0 ? formatRC(itemsProfitRC) : 'R$ 0,00'}
          sub={`${itemsInStock} em estoque · ${itemsSoldQty} vendidos`}
          note={itemsProfitRC > 0 && itemsProfitPIX > 0 ? `+ ${formatRC(itemsProfitRC)}` : null}
        />
        <StatCard
          icon={Users} color="#22c55e" title="Contas — lucro do mês"
          main={formatCurrency(accProfitPIX)}
          sub={`${accAvailable} disponíveis · ${accSoldMonth.length + loyaltySoldMonth.length} vendidas`}
        />
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{ backgroundColor: '#1e1330', border: '1px solid rgba(124,58,237,0.18)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Lucro — últimos 6 meses</h2>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Evolução mensal em PIX (R$)</p>
          </div>
          {/* legend */}
          <div className="flex gap-4 flex-wrap">
            {[['#f59e0b','Coins'],['#a855f7','Itens'],['#22c55e','Contas']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {!hasAnyData ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div style={{ fontSize: 40 }}>📊</div>
            <div className="text-sm font-semibold" style={{ color: '#374151' }}>Sem dados ainda</div>
            <div className="text-xs" style={{ color: '#1f2937' }}>Registre coins, itens e contas para ver o gráfico</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData}>
              <defs>
                {[['coins','#f59e0b'],['itens','#a855f7'],['contas','#22c55e']].map(([k,c]) => (
                  <linearGradient key={k} id={`grad_${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Coins"  stroke="#f59e0b" fill="url(#grad_coins)"  strokeWidth={2} dot={false} name="Coins" />
              <Area type="monotone" dataKey="Itens"  stroke="#a855f7" fill="url(#grad_itens)"  strokeWidth={2} dot={false} name="Itens" />
              <Area type="monotone" dataKey="Contas" stroke="#22c55e" fill="url(#grad_contas)" strokeWidth={2} dot={false} name="Contas" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Quick lists ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Items */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#1e1330', border: '1px solid rgba(124,58,237,0.18)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📦</span> Itens em estoque
              {itemsInStock > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                  {itemsInStock}
                </span>
              )}
            </h3>
            <button className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setActiveModule('items')}
              onMouseEnter={e => e.currentTarget.style.color = '#c084fc'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
              Ver tudo <ArrowRight size={11} />
            </button>
          </div>
          {items.filter(i => i.quantity > 0).length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span style={{ fontSize: 32 }}>📦</span>
              <span className="text-sm" style={{ color: '#374151' }}>Sem itens em estoque</span>
            </div>
          ) : (
            <div>
              {items.filter(i => i.quantity > 0).slice(0, 5).map(it => (
                <ItemRow key={it.id} item={it} />
              ))}
              {items.filter(i => i.quantity > 0).length > 5 && (
                <div className="text-xs text-center mt-2" style={{ color: '#4b5563' }}>
                  + {items.filter(i => i.quantity > 0).length - 5} mais
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: '#1e1330', border: '1px solid rgba(124,58,237,0.18)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👤</span> Contas ativas
              {accAvailable > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                  {accAvailable} dispon.
                </span>
              )}
            </h3>
            <button className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setActiveModule('accounts')}
              onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
              Ver tudo <ArrowRight size={11} />
            </button>
          </div>
          {accounts.filter(a => a.status !== 'vendida').length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span style={{ fontSize: 32 }}>👤</span>
              <span className="text-sm" style={{ color: '#374151' }}>Sem contas ativas</span>
            </div>
          ) : (
            <div>
              {accounts.filter(a => a.status !== 'vendida').slice(0, 5).map(a => (
                <AccountRow key={a.id} account={a} />
              ))}
              {accounts.filter(a => a.status !== 'vendida').length > 5 && (
                <div className="text-xs text-center mt-2" style={{ color: '#4b5563' }}>
                  + {accounts.filter(a => a.status !== 'vendida').length - 5} mais
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
