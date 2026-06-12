import React, { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  formatCurrency, formatRC, formatNumber, formatDate, getLastNMonths, realSaleProfit,
} from '../../utils/helpers'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { FileDown, TrendingUp, TrendingDown, Coins, Package, Users, Calendar } from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────
const inMonth = (dateStr, key) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const [y, m] = key.split('-')
  return d.getFullYear() === +y && d.getMonth() + 1 === +m
}

const ptMonth = (key) => {
  const [y, m] = key.split('-')
  return new Date(+y, +m - 1, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
}

// ─── sub-components ────────────────────────────────────────────────────────────
function Card({ title, value, sub, color, icon: Icon, note }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: '#2a2035', border: `1px solid ${color}33` }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '22' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{title}</span>
      </div>
      <div className="text-2xl font-black" style={{ color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div className="text-sm mt-1" style={{ color: '#6b7280' }}>{sub}</div>}
      {note && <div className="text-xs mt-2 px-2 py-1 rounded-md" style={{ backgroundColor: color + '18', color }}>{note}</div>}
    </div>
  )
}

function Section({ title, icon, color, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #3a3050' }}>
      <div className="px-5 py-3 flex items-center gap-3" style={{ backgroundColor: '#2a2035', borderBottom: '1px solid #3a3050' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span className="font-bold text-white text-base">{title}</span>
      </div>
      <div style={{ backgroundColor: '#1a1025' }}>
        {children}
      </div>
    </div>
  )
}

function TableRow({ cols, head }) {
  return (
    <div className={`grid items-center px-5 py-3 ${head ? '' : 'border-t'}`}
      style={{
        gridTemplateColumns: cols.map(c => c.w || '1fr').join(' '),
        borderColor: '#2a2035',
        backgroundColor: head ? '#221530' : 'transparent',
      }}>
      {cols.map((c, i) => (
        <div key={i} style={{
          color: head ? '#6b7280' : (c.color || '#d1d5db'),
          fontSize: head ? 11 : 13,
          fontWeight: head ? 700 : (c.bold ? 700 : 400),
          letterSpacing: head ? '0.06em' : 0,
          textTransform: head ? 'uppercase' : 'none',
          textAlign: c.right ? 'right' : 'left',
        }}>
          {c.value}
        </div>
      ))}
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
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function MonthlyReport() {
  const { coins, items, accounts, settings } = useApp()
  const loyaltyAccounts = settings.loyaltyAccounts ?? []
  const rate = settings?.rcRate || 0.087
  const soldDate = (a) => a.dateSold ?? a.dateEntry
  const months = getLastNMonths(12)
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1].key)

  // ── coin stats for selected month ──
  const coinStats = useMemo(() => {
    const monthCoins = coins.filter(c => inMonth(c.date, selectedMonth))
    const entradas = monthCoins.filter(c => c.type === 'entrada')
    const saidas   = monthCoins.filter(c => c.type !== 'entrada')
    const totalPaid     = entradas.reduce((s, c) => s + (c.totalPaid     || 0), 0)
    const totalReceived = saidas.reduce((s, c) => s + (c.totalReceived   || 0), 0)
    const profitCoins   = saidas.reduce((s, c) => s + (c.profit          || 0), 0)
    const qtyIn  = entradas.reduce((s, c) => s + c.quantity, 0)
    const qtyOut = saidas.reduce((s, c) => s + c.quantity, 0)
    return { monthCoins, entradas, saidas, totalPaid, totalReceived, profitCoins, qtyIn, qtyOut }
  }, [coins, selectedMonth])

  // ── item sales for selected month ──
  const itemStats = useMemo(() => {
    const sales = []
    items.forEach(it => {
      (it.sales || []).forEach(sale => {
        if (inMonth(sale.date, selectedMonth)) {
          sales.push({ ...sale, itemName: it.name, itemSet: it.set, tier: it.tier })
        }
      })
    })
    const totalQty     = sales.reduce((s, sale) => s + (sale.quantity  || 1), 0)
    const totalRC      = sales.reduce((s, sale) => s + (sale.soldForRC  || 0), 0)
    const totalPIX     = sales.reduce((s, sale) => s + (sale.soldForPIX || 0), 0)
    const profitRC  = sales.reduce((s, sale) => s + (sale.profitRC || 0), 0)
    const profitPIX = sales.reduce((s, sale) => s + realSaleProfit(sale, rate), 0)
    // group by item name
    const byItem = {}
    sales.forEach(s => {
      const k = s.itemName
      if (!byItem[k]) byItem[k] = { name: k, set: s.itemSet, tier: s.tier, qty: 0, rcTotal: 0, pixTotal: 0, profitRC: 0, profitPIX: 0 }
      byItem[k].qty      += s.quantity || 1
      byItem[k].rcTotal  += s.soldForRC  || 0
      byItem[k].pixTotal += s.soldForPIX || 0
      byItem[k].profitPIX+= realSaleProfit(s, rate)
    })
    const topItems = Object.values(byItem).sort((a, b) => b.profitPIX - a.profitPIX).slice(0, 10)
    return { sales, totalQty, totalRC, totalPIX, profitRC, profitPIX, topItems }
  }, [items, selectedMonth, rate])

  // ── account sales for selected month (regular + loyalty) ──
  const accStats = useMemo(() => {
    const soldAccs    = accounts.filter(a => a.status === 'vendida' && inMonth(soldDate(a), selectedMonth))
    const soldLoyalty = loyaltyAccounts.filter(a => a.status === 'vendida' && inMonth(soldDate(a), selectedMonth))
    const allSold       = [...soldAccs, ...soldLoyalty]
    const totalReceived = allSold.reduce((s, a) => s + (a.sellPrice || 0), 0)
    const totalCost     = allSold.reduce((s, a) => s + (a.buyPrice  || 0), 0)
    const profit        = totalReceived - totalCost
    return { soldAccs, soldLoyalty, allSold, totalReceived, totalCost, profit }
  }, [accounts, loyaltyAccounts, selectedMonth])

  // ── totals ──
  const grandPIX = coinStats.profitCoins + itemStats.profitPIX + accStats.profit
  const grandRC  = itemStats.profitRC

  // ── chart data (last 6 months) ──
  const chartData = useMemo(() => {
    return getLastNMonths(6).map(({ key, label }) => {
      const coinP = coins.filter(c => !c.autoSync && c.type !== 'entrada' && inMonth(c.date, key)).reduce((s, c) => s + (c.profit || 0), 0)
      const itemP = items.flatMap(it => (it.sales || []).filter(s => inMonth(s.date, key))).reduce((s, sale) => s + realSaleProfit(sale, rate), 0)
      const accP  = accounts.filter(a => a.status === 'vendida' && inMonth(soldDate(a), key)).reduce((s, a) => s + ((a.sellPrice||0) - (a.buyPrice||0)), 0)
               + loyaltyAccounts.filter(a => a.status === 'vendida' && inMonth(soldDate(a), key)).reduce((s, a) => s + ((a.sellPrice||0) - (a.buyPrice||0)), 0)
      return { label, coins: +coinP.toFixed(2), itens: +itemP.toFixed(2), contas: +accP.toFixed(2) }
    })
  }, [coins, items, accounts, loyaltyAccounts])

  // ── print report ──
  const printReport = () => window.print()

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto" id="monthly-report-root">

      {/* ── print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #monthly-report-root, #monthly-report-root * { visibility: visible !important; }
          #monthly-report-root { position: absolute; top: 0; left: 0; width: 100%; background: #fff; color: #111; }
          .no-print { display: none !important; }
          .rounded-xl { border-radius: 8px; }
          [style*="background-color: #2a2035"], [style*="background-color: #1a1025"] {
            background-color: #f3f4f6 !important; color: #111 !important;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">📋 Relatório Mensal</h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Resumo completo de desempenho — {ptMonth(selectedMonth)}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          {/* Month selector */}
          <div className="flex items-center gap-2">
            <Calendar size={15} style={{ color: '#6b7280' }} />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm text-white outline-none"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', cursor: 'pointer' }}
            >
              {months.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          <button onClick={printReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            <FileDown size={15} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* ── Grand total banner ── */}
      <div className="rounded-2xl p-6 flex flex-wrap gap-6 items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.1) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}>
        <div>
          <div className="text-sm font-semibold mb-1" style={{ color: '#c084fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ✦ Lucro Total do Mês
          </div>
          <div className="text-4xl font-black text-white" style={{ letterSpacing: '-1px' }}>
            {formatCurrency(grandPIX)}
          </div>
          {grandRC > 0 && (
            <div className="text-lg font-bold mt-1" style={{ color: '#fbbf24' }}>
              + {formatRC(grandRC)} em RC
            </div>
          )}
        </div>
        <div className="flex gap-8 flex-wrap">
          {[
            { label: 'Coins', value: formatCurrency(coinStats.profitCoins), color: '#f59e0b', icon: '💰' },
            { label: 'Itens (PIX)', value: formatCurrency(itemStats.profitPIX), color: '#a855f7', icon: '📦' },
            { label: 'Contas', value: formatCurrency(accStats.profit), color: '#22c55e', icon: '👤' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div className="text-lg font-black mt-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Card title="Lucro em Coins" value={formatCurrency(coinStats.profitCoins)}
          sub={`${formatNumber(coinStats.qtyOut)} RC vendidos`}
          color="#f59e0b" icon={Coins}
          note={coinStats.qtyIn > 0 ? `${formatNumber(coinStats.qtyIn)} RC comprados` : null} />

        <Card title="Lucro em Itens (PIX)" value={formatCurrency(itemStats.profitPIX)}
          sub={`${itemStats.totalQty} unidade(s) vendida(s)`}
          color="#a855f7" icon={Package}
          note={itemStats.profitRC > 0 ? `+ ${formatRC(itemStats.profitRC)} em RC` : null} />

        <Card title="Lucro em Contas" value={formatCurrency(accStats.profit)}
          sub={`${accStats.soldAccs.length} conta(s) vendida(s)`}
          color="#22c55e" icon={Users}
          note={accStats.totalReceived > 0 ? `Receita: ${formatCurrency(accStats.totalReceived)}` : null} />

        <Card title="Custo Total (entrada)" value={formatCurrency(coinStats.totalPaid + accStats.totalCost)}
          sub={`Coins + Contas compradas`}
          color="#f87171" icon={TrendingDown} />
      </div>

      {/* ── Chart: last 6 months ── */}
      <Section title="Evolução dos últimos 6 meses (PIX)" icon="📈" color="#7c3aed">
        <div style={{ padding: '20px 16px' }}>
          {chartData.every(d => d.coins === 0 && d.itens === 0 && d.contas === 0) ? (
            <div className="text-center py-8 text-sm" style={{ color: '#4b5563' }}>Sem dados de lucro nos últimos 6 meses.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3050" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="coins"  name="Coins"  fill="#f59e0b" radius={[4,4,0,0]} />
                <Bar dataKey="itens"  name="Itens"  fill="#a855f7" radius={[4,4,0,0]} />
                <Bar dataKey="contas" name="Contas" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* legend */}
          <div className="flex gap-5 mt-2 justify-center">
            {[['#f59e0b','Coins'], ['#a855f7','Itens'], ['#22c55e','Contas']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Coins detail ── */}
      <Section title="Transações de Coins" icon="💰" color="#f59e0b">
        {coinStats.monthCoins.length === 0 ? (
          <div className="px-5 py-6 text-sm text-center" style={{ color: '#4b5563' }}>Nenhuma transação de coins neste mês.</div>
        ) : (
          <>
            <TableRow head cols={[
              { value: 'DATA', w: '110px' }, { value: 'TIPO', w: '80px' },
              { value: 'SERVIDOR', w: '1fr' }, { value: 'QTDE', w: '100px', right: true },
              { value: 'VALOR', w: '110px', right: true }, { value: 'LUCRO', w: '110px', right: true },
            ]} />
            {coinStats.monthCoins.map(c => (
              <TableRow key={c.id} cols={[
                { value: formatDate(c.date), w: '110px', color: '#6b7280' },
                { value: c.type === 'entrada' ? '⬇ Compra' : '⬆ Venda', w: '80px', color: c.type === 'entrada' ? '#f87171' : '#4ade80', bold: true },
                { value: c.server || '—', w: '1fr' },
                { value: formatNumber(c.quantity), w: '100px', right: true, color: '#94a3b8' },
                { value: c.type === 'entrada' ? formatCurrency(c.totalPaid || 0) : formatCurrency(c.totalReceived || 0), w: '110px', right: true },
                { value: c.type === 'entrada' ? '—' : formatCurrency(c.profit || 0), w: '110px', right: true, color: c.profit >= 0 ? '#4ade80' : '#f87171', bold: true },
              ]} />
            ))}
            <div className="px-5 py-3 flex justify-end gap-8 text-sm" style={{ backgroundColor: '#221530', borderTop: '1px solid #3a3050' }}>
              <span style={{ color: '#6b7280' }}>Total investido: <strong style={{ color: '#f87171' }}>{formatCurrency(coinStats.totalPaid)}</strong></span>
              <span style={{ color: '#6b7280' }}>Receita: <strong style={{ color: '#fff' }}>{formatCurrency(coinStats.totalReceived)}</strong></span>
              <span style={{ color: '#6b7280' }}>Lucro: <strong style={{ color: '#4ade80' }}>{formatCurrency(coinStats.profitCoins)}</strong></span>
            </div>
          </>
        )}
      </Section>

      {/* ── Items sold detail ── */}
      <Section title="Itens Vendidos" icon="📦" color="#a855f7">
        {itemStats.sales.length === 0 ? (
          <div className="px-5 py-6 text-sm text-center" style={{ color: '#4b5563' }}>Nenhum item vendido neste mês.</div>
        ) : (
          <>
            <TableRow head cols={[
              { value: 'ITEM', w: '1fr' }, { value: 'DATA', w: '100px' },
              { value: 'QTDE', w: '60px', right: true },
              { value: 'VENDA RC', w: '110px', right: true }, { value: 'VENDA PIX', w: '110px', right: true },
              { value: 'LUCRO PIX', w: '110px', right: true },
            ]} />
            {itemStats.sales.map((s, i) => (
              <TableRow key={i} cols={[
                { value: s.itemName, w: '1fr', bold: true, color: '#e2e8f0' },
                { value: formatDate(s.date), w: '100px', color: '#6b7280' },
                { value: s.quantity || 1, w: '60px', right: true, color: '#94a3b8' },
                { value: s.soldForRC ? formatRC(s.soldForRC) : '—', w: '110px', right: true, color: '#fbbf24' },
                { value: s.soldForPIX ? formatCurrency(s.soldForPIX) : '—', w: '110px', right: true },
                { value: s.soldForPIX ? formatCurrency(s.profitPIX || 0) : '—', w: '110px', right: true, color: (s.profitPIX || 0) >= 0 ? '#4ade80' : '#f87171', bold: true },
              ]} />
            ))}
            <div className="px-5 py-3 flex justify-end gap-8 text-sm" style={{ backgroundColor: '#221530', borderTop: '1px solid #3a3050' }}>
              {itemStats.totalRC > 0 && <span style={{ color: '#6b7280' }}>Receita RC: <strong style={{ color: '#fbbf24' }}>{formatRC(itemStats.totalRC)}</strong></span>}
              {itemStats.totalPIX > 0 && <span style={{ color: '#6b7280' }}>Receita PIX: <strong style={{ color: '#fff' }}>{formatCurrency(itemStats.totalPIX)}</strong></span>}
              <span style={{ color: '#6b7280' }}>Lucro PIX: <strong style={{ color: '#4ade80' }}>{formatCurrency(itemStats.profitPIX)}</strong></span>
            </div>
          </>
        )}
      </Section>

      {/* ── Accounts sold detail ── */}
      <Section title="Contas Vendidas" icon="👤" color="#22c55e">
        {accStats.allSold.length === 0 ? (
          <div className="px-5 py-6 text-sm text-center" style={{ color: '#4b5563' }}>Nenhuma conta vendida neste mês.</div>
        ) : (
          <>
            <TableRow head cols={[
              { value: 'PERSONAGEM / EMAIL', w: '1fr' }, { value: 'TIPO', w: '80px' },
              { value: 'SERVER', w: '100px' },
              { value: 'DATA VENDA', w: '110px' }, { value: 'COMPRA', w: '100px', right: true },
              { value: 'VENDA', w: '100px', right: true }, { value: 'LUCRO', w: '100px', right: true },
            ]} />
            {accStats.soldAccs.map(a => (
              <TableRow key={a.id} cols={[
                { value: a.charName || `${a.vocation} Lv${a.level}`, w: '1fr', bold: true, color: '#e2e8f0' },
                { value: '👤 Char', w: '80px', color: '#94a3b8' },
                { value: a.server || '—', w: '100px', color: '#94a3b8' },
                { value: formatDate(soldDate(a)), w: '110px', color: '#6b7280' },
                { value: formatCurrency(a.buyPrice || 0), w: '100px', right: true, color: '#f87171' },
                { value: formatCurrency(a.sellPrice || 0), w: '100px', right: true },
                { value: formatCurrency((a.sellPrice || 0) - (a.buyPrice || 0)), w: '100px', right: true, color: ((a.sellPrice||0)-(a.buyPrice||0)) >= 0 ? '#4ade80' : '#f87171', bold: true },
              ]} />
            ))}
            {accStats.soldLoyalty.map(a => (
              <TableRow key={a.id} cols={[
                { value: a.email || '—', w: '1fr', bold: true, color: '#c4b5fd' },
                { value: '⭐ Loyalty', w: '80px', color: '#c084fc' },
                { value: a.server !== 'Todos' ? a.server : '—', w: '100px', color: '#94a3b8' },
                { value: formatDate(soldDate(a)), w: '110px', color: '#6b7280' },
                { value: formatCurrency(a.buyPrice || 0), w: '100px', right: true, color: '#f87171' },
                { value: formatCurrency(a.sellPrice || 0), w: '100px', right: true },
                { value: formatCurrency((a.sellPrice || 0) - (a.buyPrice || 0)), w: '100px', right: true, color: ((a.sellPrice||0)-(a.buyPrice||0)) >= 0 ? '#4ade80' : '#f87171', bold: true },
              ]} />
            ))}
            <div className="px-5 py-3 flex justify-end gap-8 text-sm" style={{ backgroundColor: '#221530', borderTop: '1px solid #3a3050' }}>
              <span style={{ color: '#6b7280' }}>Custo: <strong style={{ color: '#f87171' }}>{formatCurrency(accStats.totalCost)}</strong></span>
              <span style={{ color: '#6b7280' }}>Receita: <strong style={{ color: '#fff' }}>{formatCurrency(accStats.totalReceived)}</strong></span>
              <span style={{ color: '#6b7280' }}>Lucro: <strong style={{ color: '#4ade80' }}>{formatCurrency(accStats.profit)}</strong></span>
            </div>
          </>
        )}
      </Section>

      {/* ── Top items ranking ── */}
      {itemStats.topItems.length > 0 && (
        <Section title="Ranking de Itens mais lucrativos" icon="🏆" color="#f59e0b">
          <TableRow head cols={[
            { value: '#', w: '40px' }, { value: 'ITEM', w: '1fr' },
            { value: 'QTD VENDIDA', w: '110px', right: true },
            { value: 'RECEITA RC', w: '110px', right: true },
            { value: 'RECEITA PIX', w: '110px', right: true },
            { value: 'LUCRO PIX', w: '110px', right: true },
          ]} />
          {itemStats.topItems.map((it, i) => (
            <TableRow key={it.name} cols={[
              { value: `#${i + 1}`, w: '40px', color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : '#4b5563', bold: true },
              { value: it.name, w: '1fr', bold: true, color: '#e2e8f0' },
              { value: it.qty, w: '110px', right: true, color: '#94a3b8' },
              { value: it.rcTotal ? formatRC(it.rcTotal) : '—', w: '110px', right: true, color: '#fbbf24' },
              { value: it.pixTotal ? formatCurrency(it.pixTotal) : '—', w: '110px', right: true },
              { value: it.pixTotal ? formatCurrency(it.profitPIX) : '—', w: '110px', right: true, color: it.profitPIX >= 0 ? '#4ade80' : '#f87171', bold: true },
            ]} />
          ))}
        </Section>
      )}

      {/* ── Footer ── */}
      <div className="text-center text-xs py-4" style={{ color: '#374151', borderTop: '1px solid #2a2035' }}>
        Relatório gerado em {new Date().toLocaleString('pt-BR')} · Minha Loja Rubinot
      </div>
    </div>
  )
}
