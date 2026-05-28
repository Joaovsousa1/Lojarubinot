import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Coins, Package, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import {
  formatCurrency, formatRC, formatNumber, getCurrentMonth, getLastNMonths, SET_COLORS, VOCATION_OUTFIT, VOCATION_COLORS,
} from '../../utils/helpers'
import ItemImage from '../UI/ItemImage'
import TierBadge from '../UI/TierBadge'

function StatCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="rounded-xl p-5 flex items-start gap-4"
      style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
      <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: iconColor + '22' }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-400 mb-1">{title}</div>
        {children}
      </div>
    </div>
  )
}

function ProfitLine({ rc, pix, label }) {
  const hasRC  = rc  !== 0
  const hasPIX = pix !== 0
  if (!hasRC && !hasPIX) return <div className="text-xl font-bold text-gray-500">R$ 0,00</div>
  return (
    <div className="space-y-0.5">
      {hasRC  && <div className="text-lg font-bold" style={{ color: '#fbbf24' }}>{formatRC(rc)}</div>}
      {hasPIX && <div className="text-lg font-bold" style={{ color: '#4ade80' }}>{formatCurrency(pix)}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg p-3 text-sm shadow-xl" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
      <div className="font-semibold text-white mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: {p.dataKey.endsWith('RC') ? formatRC(p.value) : formatCurrency(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { coins, items, accounts } = useApp()
  const cur = getCurrentMonth()

  // ── Coins ──────────────────────────────────────────────────────────────
  const coinsBought = coins.filter(c => c.type === 'entrada' && c.date.startsWith(cur)).reduce((s, c) => s + c.quantity, 0)
  const coinsSold   = coins.filter(c => c.type === 'saida'   && c.date.startsWith(cur)).reduce((s, c) => s + c.quantity, 0)
  const coinsProfitPIX = coins.filter(c => c.type === 'saida' && c.date.startsWith(cur)).reduce((s, c) => s + (c.profit ?? 0), 0)

  // ── Items ───────────────────────────────────────────────────────────────
  const allSales = items.flatMap(i => i.sales ?? [])
  const monthSales = allSales.filter(s => s.date.startsWith(cur))
  const itemsInStock  = items.reduce((s, i) => s + i.quantity, 0)
  const itemsSoldQty  = monthSales.reduce((s, x) => s + x.quantity, 0)
  const itemsProfitRC  = monthSales.reduce((s, x) => s + (x.profitRC  ?? 0), 0)
  const itemsProfitPIX = monthSales.reduce((s, x) => s + (x.profitPIX ?? 0), 0)

  // ── Accounts ───────────────────────────────────────────────────────────
  const accAvailable = accounts.filter(a => a.status === 'disponível').length
  const accSoldMonth = accounts.filter(a => a.status === 'vendida' && a.dateSold?.startsWith(cur))
  const accProfitPIX = accSoldMonth.reduce((s, a) => s + (a.sellPrice - a.buyPrice), 0)

  // ── Totals ─────────────────────────────────────────────────────────────
  const totalPIX = coinsProfitPIX + itemsProfitPIX + accProfitPIX
  const totalRC  = itemsProfitRC

  // ── Chart ──────────────────────────────────────────────────────────────
  const months = getLastNMonths(6)
  const chartData = months.map(({ key, label }) => {
    const cp = coins.filter(c => c.type === 'saida' && c.date.startsWith(key)).reduce((s, c) => s + (c.profit ?? 0), 0)
    const sales = items.flatMap(i => i.sales ?? []).filter(s => s.date.startsWith(key))
    const ipix = sales.reduce((s, x) => s + (x.profitPIX ?? 0), 0)
    const irc  = sales.reduce((s, x) => s + (x.profitRC  ?? 0), 0)
    const ap = accounts.filter(a => a.status === 'vendida' && a.dateSold?.startsWith(key)).reduce((s, a) => s + (a.sellPrice - a.buyPrice), 0)
    return {
      month: label,
      'Coins (PIX)': +cp.toFixed(2),
      'Itens (PIX)': +ipix.toFixed(2),
      'Itens (RC)':  +irc,
      'Contas (PIX)': +ap.toFixed(2),
    }
  })

  const curMonthLabel = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1 capitalize">{curMonthLabel}</p>
      </div>

      {/* Total profit highlight */}
      <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', border: '1px solid #7c3aed' }}>
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={24} className="text-yellow-300" />
          <span className="text-purple-200 text-sm font-medium">Lucro Total do Mês</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-purple-300 mb-1">Em PIX (R$)</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalPIX)}</div>
          </div>
          {totalRC !== 0 && (
            <div>
              <div className="text-xs text-purple-300 mb-1">Em RC</div>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{formatRC(totalRC)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Coins} iconColor="#f59e0b" title="Coins — lucro do mês">
          <div className="text-xl font-bold" style={{ color: '#4ade80' }}>{formatCurrency(coinsProfitPIX)}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {formatNumber(coinsBought)} comprados · {formatNumber(coinsSold)} vendidos
          </div>
        </StatCard>

        <StatCard icon={Package} iconColor="#7c3aed" title="Itens — lucro do mês">
          <ProfitLine rc={itemsProfitRC} pix={itemsProfitPIX} />
          <div className="text-xs text-gray-500 mt-1">
            {itemsInStock} em estoque · {itemsSoldQty} vendidos
          </div>
        </StatCard>

        <StatCard icon={Users} iconColor="#22c55e" title="Contas — lucro do mês">
          <div className="text-xl font-bold" style={{ color: '#4ade80' }}>{formatCurrency(accProfitPIX)}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {accAvailable} disponíveis · {accSoldMonth.length} vendidas
          </div>
        </StatCard>
      </div>

      {/* Chart */}
      <div className="rounded-xl p-5" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
        <h2 className="text-base font-semibold text-white mb-4">Lucro — últimos 6 meses</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3050" />
            <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `R$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
            <Bar dataKey="Coins (PIX)"  fill="#f59e0b" radius={[3,3,0,0]} />
            <Bar dataKey="Itens (PIX)"  fill="#7c3aed" radius={[3,3,0,0]} />
            <Bar dataKey="Itens (RC)"   fill="#fbbf24" radius={[3,3,0,0]} />
            <Bar dataKey="Contas (PIX)" fill="#22c55e" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-2">
          Barras em amarelo escuro = lucro em RC · Demais = lucro em PIX (R$)
        </p>
      </div>

      {/* Quick lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Itens em estoque</h3>
          {items.filter(i => i.quantity > 0).length === 0
            ? <p className="text-gray-500 text-sm">Sem itens em estoque.</p>
            : items.filter(i => i.quantity > 0).slice(0, 6).map(it => {
              const sc = SET_COLORS[it.set] ?? SET_COLORS['Outros']
              return (
                <div key={it.id} className="flex items-center gap-2.5 py-1.5 rounded-lg px-2 -mx-2 transition-colors"
                  style={{ borderLeft: `2px solid ${sc.primary}` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `radial-gradient(circle, ${sc.secondary}cc, ${sc.secondary}44)`,
                      border: `1px solid ${sc.primary}44`,
                    }}>
                    <ItemImage src={it.imageUrl} category={it.category} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-300 text-sm truncate">{it.name}</span>
                      <TierBadge tier={it.tier} />
                    </div>
                    <div className="text-xs text-gray-600">{it.server}</div>
                  </div>
                  <div className="text-xs font-bold shrink-0" style={{ color: sc.accent }}>×{it.quantity}</div>
                </div>
              )
            })
          }
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Contas ativas</h3>
          {accounts.filter(a => a.status !== 'vendida').length === 0
            ? <p className="text-gray-500 text-sm">Sem contas ativas.</p>
            : accounts.filter(a => a.status !== 'vendida').slice(0, 5).map(a => {
              const outfitUrl = VOCATION_OUTFIT[a.vocation]
              const vColor = VOCATION_COLORS[a.vocation] ?? '#6b7280'
              return (
                <div key={a.id} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: vColor + '22', border: `1px solid ${vColor}44` }}>
                    {outfitUrl
                      ? <img src={outfitUrl} alt={a.vocation} className="h-7 w-7"
                          style={{ imageRendering: 'pixelated' }}
                          onError={e => { e.currentTarget.style.display = 'none' }} />
                      : <span className="text-xs font-bold" style={{ color: vColor }}>{a.vocation[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-300 text-sm">{a.vocation} Lv{a.level}</div>
                    <div className="text-gray-600 text-xs">{a.server}</div>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0">{formatCurrency(a.sellPrice)}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
