import React, { useState, useRef } from 'react'
import { Plus, Trash2, Download, Upload, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatNumber, getCurrentMonth, getLastNMonths } from '../../utils/helpers'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

function Section({ title, children }) {
  return (
    <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {children}
    </div>
  )
}

export default function Settings() {
  const { settings, coins, items, accounts, addServer, removeServer, updateSettings, exportData, importData } = useApp()
  const [newServer, setNewServer] = useState('')
  const [prices, setPrices] = useState({ ...settings.coinPrices })
  const [minBalance, setMinBalance] = useState(settings.minCoinBalance ?? 10000)
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef(null)

  const handleAddServer = () => {
    const s = newServer.trim()
    if (!s) return
    addServer(s)
    setNewServer('')
  }

  const handleSavePrices = () => {
    updateSettings({
      coinPrices: {
        buy1k:  parseFloat(prices.buy1k)  || 87,
        buy10k: parseFloat(prices.buy10k) || 87,
        sell:   parseFloat(prices.sell)   || 92,
      },
      minCoinBalance: parseInt(minBalance) || 0,
    })
    alert('Configurações salvas!')
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = importData(ev.target.result)
      setImportMsg(ok ? '✓ Dados importados com sucesso!' : '✗ Erro ao importar JSON.')
      setTimeout(() => setImportMsg(''), 3000)
    }
    reader.readAsText(file)
  }

  const generateReport = () => {
    const cur = getCurrentMonth()
    const monthName = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

    const coinProfit = coins.filter(c => c.type === 'saida' && c.date.startsWith(cur))
      .reduce((s, c) => s + (c.profit ?? 0), 0)
    const coinBought = coins.filter(c => c.type === 'entrada' && c.date.startsWith(cur))
      .reduce((s, c) => s + c.quantity, 0)
    const coinSold = coins.filter(c => c.type === 'saida' && c.date.startsWith(cur))
      .reduce((s, c) => s + c.quantity, 0)

    const allSales = items.flatMap(i => i.sales ?? [])
    const monthSales = allSales.filter(s => s.date.startsWith(cur))
    const itemProfitRC  = monthSales.reduce((s, x) => s + (x.profitRC  ?? 0), 0)
    const itemProfitPIX = monthSales.reduce((s, x) => s + (x.profitPIX ?? 0), 0)
    const itemSoldQty = monthSales.reduce((s, x) => s + x.quantity, 0)

    const accSold = accounts.filter(a => a.status === 'vendida' && a.dateSold?.startsWith(cur))
    const accProfit = accSold.reduce((s, a) => s + (a.sellPrice - a.buyPrice), 0)

    const totalPIX = coinProfit + itemProfitPIX + accProfit

    const lines = [
      `╔════════════════════════════════════╗`,
      `  RELATÓRIO — ${monthName.toUpperCase()}`,
      `╚════════════════════════════════════╝`,
      ``,
      `📦 COINS`,
      `  Comprados : ${formatNumber(coinBought)} coins`,
      `  Vendidos  : ${formatNumber(coinSold)} coins`,
      `  Lucro     : R$ ${coinProfit.toFixed(2)}`,
      ``,
      `🗡️  ITENS`,
      `  Em estoque : ${items.reduce((s, i) => s + i.quantity, 0)}`,
      `  Vendidos    : ${itemSoldQty} unidades`,
      `  Lucro PIX   : R$ ${itemProfitPIX.toFixed(2)}`,
      ...(itemProfitRC !== 0 ? [`  Lucro RC    : ${Math.round(itemProfitRC)} RC`] : []),
      ``,
      `👤 CONTAS`,
      `  Disponíveis : ${accounts.filter(a => a.status === 'disponível').length}`,
      `  Vendidas    : ${accSold.length}`,
      `  Lucro       : R$ ${accProfit.toFixed(2)}`,
      ``,
      `══════════════════════════════════════`,
      `💰 LUCRO TOTAL PIX: R$ ${totalPIX.toFixed(2)}`,
      ...(itemProfitRC !== 0 ? [`⚡ LUCRO TOTAL RC : ${Math.round(itemProfitRC)} RC`] : []),
      `══════════════════════════════════════`,
      ``,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-${cur}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Configurações</h1>

      {/* Servers */}
      <Section title="Servidores">
        <div className="flex gap-2">
          <input type="text" value={newServer}
            className={INPUT} style={INPUT_STYLE}
            placeholder="Nome do servidor"
            onChange={e => setNewServer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddServer()}
          />
          <button onClick={handleAddServer}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: '#7c3aed' }}
          ><Plus size={16} /></button>
        </div>
        <div className="space-y-2">
          {settings.servers.map(s => (
            <div key={s} className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
              <span className="text-gray-300 text-sm">{s}</span>
              <button onClick={() => removeServer(s)} className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Coin prices */}
      <Section title="Preços de Coins (R$ por 1.000 coins)">
        <p className="text-xs text-gray-500 -mt-2">Ex: se 1.000 coins custa R$87, coloque 87</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'buy1k',  label: 'Compra pacote 1k' },
            { key: 'buy10k', label: 'Compra pacote 10k' },
            { key: 'sell',   label: 'Preço de venda' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={LABEL}>{label} (R$/k)</label>
              <input type="number" step="0.01" min="0"
                className={INPUT} style={INPUT_STYLE}
                value={prices[key]}
                onChange={e => setPrices(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div>
          <label className={LABEL}>Alerta de estoque mínimo (coins)</label>
          <div className="flex items-center gap-2">
            <input type="number" step="1000" min="0"
              className={INPUT} style={{ ...INPUT_STYLE, maxWidth: 180 }}
              value={minBalance}
              onChange={e => setMinBalance(e.target.value)}
            />
            <span className="text-xs text-gray-500">Alerta vermelho no sidebar quando abaixo desse valor</span>
          </div>
        </div>
        <button onClick={handleSavePrices}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#7c3aed' }}
        >Salvar configurações</button>
      </Section>

      {/* Export / Import */}
      <Section title="Dados">
        <div className="flex flex-wrap gap-3">
          <button onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#60a5fa' }}
          ><Download size={15} /> Exportar JSON</button>

          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#4ade80' }}
          ><Upload size={15} /> Importar JSON</button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

          <button onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#c084fc' }}
          ><FileText size={15} /> Relatório do mês (.txt)</button>
        </div>
        {importMsg && (
          <div className="text-sm px-3 py-2 rounded-lg"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: importMsg.startsWith('✓') ? '#4ade80' : '#f87171' }}>
            {importMsg}
          </div>
        )}
        <p className="text-xs text-gray-500">
          O JSON exportado contém todos os coins, itens e contas. Use para backup ou migrar entre dispositivos.
        </p>
      </Section>

      {/* Danger zone */}
      <Section title="Zona de risco">
        <p className="text-xs text-gray-500">Limpar todos os dados da aplicação. Esta ação não pode ser desfeita.</p>
        <button
          onClick={() => {
            if (confirm('Tem certeza que deseja apagar TODOS os dados?')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#7f1d1d', border: '1px solid #dc2626', color: '#f87171' }}
        >🗑️ Limpar todos os dados</button>
      </Section>
    </div>
  )
}
