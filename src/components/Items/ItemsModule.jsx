import React, { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, ShoppingCart, History, LayoutGrid, List, Copy, ChevronUp, ChevronDown, ClipboardList } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate, formatRC, CATEGORY_FALLBACK, SET_COLORS, TIER_COLORS } from '../../utils/helpers'
import Modal from '../UI/Modal'
import TierBadge from '../UI/TierBadge'
import ItemImage from '../UI/ItemImage'
import ItemForm from './ItemForm'
import ItemSaleModal from './ItemSaleModal'
import { getItemByName, ITEM_VOCATIONS } from '../../data/itemsDatabase'

function PriceCell({ rc, pix }) {
  if (!rc && !pix) return <span className="text-gray-600">—</span>
  return (
    <div className="space-y-0.5">
      {rc  > 0 && <div className="text-xs font-medium" style={{ color: '#f59e0b' }}>{formatRC(rc)}</div>}
      {pix > 0 && <div className="text-xs font-medium" style={{ color: '#4ade80' }}>{formatCurrency(pix)}</div>}
    </div>
  )
}

function ProfitCell({ buyPriceRC, buyPricePIX, sellPriceRC, sellPricePIX, rcRate, sales = [] }) {
  const hasBuy  = (buyPriceRC  || 0) > 0 || (buyPricePIX  || 0) > 0
  const hasSell = (sellPriceRC || 0) > 0 || (sellPricePIX || 0) > 0
  const rate    = rcRate || 0.087

  // Item já vendido (sem preço listado): usa lucro real das vendas registradas
  if (!hasSell && sales.length > 0) {
    const realized = sales.reduce((sum, s) =>
      sum + (s.profitPIX || 0) + (s.profitRC || 0) * rate, 0)
    return (
      <div style={{ lineHeight: 1.3 }}>
        <div className="text-xs font-medium" style={{ color: realized >= 0 ? '#4ade80' : '#f87171' }}>
          {formatCurrency(realized)}
        </div>
        <div style={{ fontSize: 10, color: '#6b7280' }}>realizado</div>
      </div>
    )
  }

  // Item listado com preço de compra e venda: estimativa
  if (!hasBuy || !hasSell) return <span className="text-gray-600">—</span>

  const buyTotal  = (buyPricePIX  || 0) + (buyPriceRC  || 0) * rate
  const sellTotal = (sellPricePIX || 0) + (sellPriceRC || 0) * rate
  const profit    = sellTotal - buyTotal

  return (
    <div className="text-xs font-medium" style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }}>
      {formatCurrency(profit)}
    </div>
  )
}

function SortableHeader({ label, sk, sortKey, sortDir, onClick, className = '' }) {
  const active = sortKey === sk
  return (
    <th onClick={() => onClick(sk)}
      className={`px-4 py-3 text-left text-xs font-medium cursor-pointer select-none whitespace-nowrap ${className}`}
      style={{ color: active ? '#c084fc' : '#6b7280' }}>
      <span className="flex items-center gap-1">
        {label}
        {active
          ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
          : <ChevronDown size={11} className="opacity-20" />
        }
      </span>
    </th>
  )
}

function ItemCard({ it, onEdit, onDelete, onSell, onHistory, onClone }) {
  const sc = SET_COLORS[it.set] ?? SET_COLORS['Outros']
  const tc = TIER_COLORS[it.tier ?? 0]
  const outOfStock = it.quantity === 0

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:scale-[1.025]"
      style={{
        backgroundColor: '#2a2035',
        border: `1px solid ${sc.primary}55`,
        opacity: outOfStock ? 0.6 : 1,
        boxShadow: (it.tier ?? 0) >= 3 ? `0 4px 20px ${sc.glow}` : 'none',
      }}
    >
      <div className="h-[3px] shrink-0" style={{ background: `linear-gradient(90deg, ${sc.primary}, ${sc.accent}55)` }} />

      <div className="p-3 flex flex-col items-center gap-2 flex-1">
        <div className="relative mt-1">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${sc.secondary}dd, ${sc.secondary}44)`,
              boxShadow: (it.tier ?? 0) >= 2 ? `0 0 16px ${tc.text}44, inset 0 0 10px ${sc.primary}22` : 'none',
              border: `1px solid ${sc.primary}44`,
            }}>
            <ItemImage src={it.imageUrl} category={it.category} size={40} alt={it.name} />
          </div>
          <div className="absolute -top-2 -right-2"><TierBadge tier={it.tier} /></div>
          {outOfStock && (
            <div className="absolute inset-0 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', fontSize: 8, color: '#ef4444', fontWeight: 800, letterSpacing: 0.5 }}>
              SEM ESTOQUE
            </div>
          )}
        </div>

        <div className="text-center space-y-0.5">
          <div className="text-white font-semibold text-xs leading-tight">{it.name}</div>
          <div className="text-[10px] font-medium" style={{ color: sc.accent }}>{it.set || it.category}</div>
          <div className="text-[10px] text-gray-600">C{it.classification} · {it.server}</div>
        </div>

        <div className="text-xs flex items-center gap-1">
          <span className="text-gray-500">Qtd:</span>
          <span className={`font-bold ${outOfStock ? 'text-red-400' : 'text-white'}`}>{it.quantity}</span>
        </div>

        <div className="w-full rounded-lg py-1.5 px-2 text-center" style={{ backgroundColor: '#1a1025' }}>
          {it.sellPriceRC  > 0 && <div className="text-[11px] font-bold leading-tight" style={{ color: '#fbbf24' }}>{formatRC(it.sellPriceRC)}</div>}
          {it.sellPricePIX > 0 && <div className="text-[11px] font-bold leading-tight" style={{ color: '#4ade80' }}>{formatCurrency(it.sellPricePIX)}</div>}
          {!it.sellPriceRC && !it.sellPricePIX && <div className="text-[11px] text-gray-600">—</div>}
        </div>
      </div>

      <div className="flex items-center justify-center gap-0.5 px-2 pb-2.5 border-t" style={{ borderColor: '#3a3050' }}>
        {it.quantity > 0 ? (
          <button onClick={() => onSell(it)} title="Registrar venda"
            className="p-1.5 rounded-lg hover:bg-green-900/40 text-gray-500 hover:text-green-400 transition-colors">
            <ShoppingCart size={13} />
          </button>
        ) : (
          <button onClick={() => onSell(it)} title="Registrar troca / venda retroativa"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9333ea' }}>
            <ClipboardList size={13} />
          </button>
        )}
        {(it.sales?.length > 0 || it.priceHistory?.length > 0) && (
          <button onClick={() => onHistory(it)} title="Histórico"
            className="p-1.5 rounded-lg hover:bg-blue-900/40 text-gray-500 hover:text-blue-400 transition-colors">
            <History size={13} />
          </button>
        )}
        <button onClick={() => onClone(it)} title="Duplicar"
          className="p-1.5 rounded-lg hover:bg-indigo-900/40 text-gray-500 hover:text-indigo-400 transition-colors">
          <Copy size={13} />
        </button>
        <button onClick={() => onEdit(it)} title="Editar"
          className="p-1.5 rounded-lg hover:bg-purple-900/40 text-gray-500 hover:text-purple-400 transition-colors">
          <Pencil size={13} />
        </button>
        <button onClick={() => { if (confirm(`Excluir ${it.name}?`)) onDelete(it.id) }} title="Excluir"
          className="p-1.5 rounded-lg hover:bg-red-900/40 text-gray-500 hover:text-red-400 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function ItemsModule() {
  const { items, settings, addItem, updateItem, deleteItem, sellItem, addCoinTransaction } = useApp()
  const [showForm,    _setShowForm]   = useState(() => sessionStorage.getItem('items_modal') === '1')
  const setShowForm = (v) => { v ? sessionStorage.setItem('items_modal','1') : sessionStorage.removeItem('items_modal'); _setShowForm(v) }
  const [editing,     setEditing]     = useState(null)
  const [listCopied,    setListCopied]    = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [copyServers,   setCopyServers]   = useState([])
  const [selling,     setSelling]     = useState(null)
  const [showHistory, setShowHistory] = useState(null)
  const [filters, setFilters] = useState({ server: '', category: '', tier: '', classification: '', search: '' })
  const [viewMode,  setViewMode]  = useState('table')
  const [sortKey,   setSortKey]   = useState('dateEntry')
  const [sortDir,   setSortDir]   = useState('desc')

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return items.filter(it => {
      if (filters.search && !it.name.toLowerCase().includes(q) && !(it.set ?? '').toLowerCase().includes(q)) return false
      if (filters.server && it.server !== filters.server) return false
      if (filters.category && it.category !== filters.category) return false
      if (filters.tier !== '' && it.tier !== parseInt(filters.tier)) return false
      if (filters.classification && it.classification !== parseInt(filters.classification)) return false
      return true
    })
  }, [items, filters])

  const sorted = useMemo(() => {
    const cmp = (a, b) => {
      let va, vb
      switch (sortKey) {
        case 'name':      va = a.name;    vb = b.name;    break
        case 'server':    va = a.server;  vb = b.server;  break
        case 'quantity':  va = a.quantity; vb = b.quantity; break
        case 'buyRC':     va = a.buyPriceRC  || 0; vb = b.buyPriceRC  || 0; break
        case 'buyPIX':    va = a.buyPricePIX || 0; vb = b.buyPricePIX || 0; break
        case 'sellRC':    va = a.sellPriceRC  || 0; vb = b.sellPriceRC  || 0; break
        case 'sellPIX':   va = a.sellPricePIX || 0; vb = b.sellPricePIX || 0; break
        case 'profitRC':  va = ((a.sellPriceRC  || 0) - (a.buyPriceRC  || 0)) * a.quantity; vb = ((b.sellPriceRC  || 0) - (b.buyPriceRC  || 0)) * b.quantity; break
        case 'profitPIX': va = ((a.sellPricePIX || 0) - (a.buyPricePIX || 0)) * a.quantity; vb = ((b.sellPricePIX || 0) - (b.buyPricePIX || 0)) * b.quantity; break
        default:          va = a.dateEntry || ''; vb = b.dateEntry || ''
      }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      return sortDir === 'asc' ? va - vb : vb - va
    }

    // Quando ordena por quantidade, não força separação (faz sentido ver tudo junto)
    if (sortKey === 'quantity') return [...filtered].sort(cmp)

    // Sempre: em estoque no topo, sem estoque embaixo — cada grupo ordenado pelo critério do usuário
    const inStock    = filtered.filter(it => it.quantity > 0).sort(cmp)
    const outOfStock = filtered.filter(it => it.quantity === 0).sort(cmp)
    return [...inStock, ...outOfStock]
  }, [filtered, sortKey, sortDir])

  const soldSeparatorIdx = useMemo(() => {
    if (sortKey === 'quantity') return -1
    return sorted.findIndex(it => it.quantity === 0)
  }, [sorted, sortKey])

  const totals = useMemo(() => {
    const inStock = filtered.filter(i => i.quantity > 0)
    const rate = settings.rcRate || 0
    if (rate > 0) {
      const profitPIX = inStock.reduce((s, i) => {
        const buy  = (i.buyPricePIX  || 0) + (i.buyPriceRC  || 0) * rate
        const sell = (i.sellPricePIX || 0) + (i.sellPriceRC || 0) * rate
        return s + (sell - buy) * i.quantity
      }, 0)
      return { profitRC: 0, profitPIX, count: inStock.length }
    }
    return {
      profitRC:  inStock.reduce((s, i) => s + ((i.sellPriceRC  || 0) - (i.buyPriceRC  || 0)) * i.quantity, 0),
      profitPIX: inStock.reduce((s, i) => s + ((i.sellPricePIX || 0) - (i.buyPricePIX || 0)) * i.quantity, 0),
      count: inStock.length,
    }
  }, [filtered, settings.rcRate])

  const handleClone = (it) => {
    addItem({ ...it, quantity: 1, sales: [], priceHistory: [], dateEntry: new Date().toISOString() })
  }

  const VOC_ORDER = [
    { key: 'RP',   label: '🏹 *RP:*' },
    { key: 'ED',   label: '🧊 *ED:*' },
    { key: 'MS',   label: '🔥 *MS:*' },
    { key: 'EK',   label: '⚔️ *EK:*' },
    { key: 'MONK', label: '🥋 *MONK:*' },
    { key: 'ALL',  label: '📿 *Outros:*' },
  ]

  const handleCopyList = () => { setCopyServers([]); setShowCopyModal(true) }

  const toggleCopyServer = (s) =>
    setCopyServers(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const executeCopy = () => {
    const rate = settings.rcRate || 0.087
    const pool = items.filter(it =>
      it.quantity > 0 && (copyServers.length === 0 || copyServers.includes(it.server))
    )
    const getPrice = (it) => (it.sellPricePIX || 0) + (it.sellPriceRC || 0) * rate

    const getVoc = (it) => {
      if (ITEM_VOCATIONS[it.name]) return ITEM_VOCATIONS[it.name]
      const v = it.vocation ?? 'ALL'
      if (v !== 'ALL') return v
      return getItemByName(it.name)?.vocation ?? 'ALL'
    }

    const sections = VOC_ORDER
      .map(({ key, label }) => {
        const sorted = pool
          .filter(it => getVoc(it) === key)
          .sort((a, b) => getPrice(b) - getPrice(a))
        const deduped = [...new Map(sorted.map(it => [it.name, it])).values()]
        return deduped.length > 0 ? `${label} ${deduped.map(it => `${it.name} (TIER ${it.tier ?? 0})`).join(' • ')}` : null
      })
      .filter(Boolean)

    if (!sections.length) { setShowCopyModal(false); return }

    const text = sections.join('\n\n')

    navigator.clipboard.writeText(text).then(() => {
      setListCopied(true)
      setShowCopyModal(false)
      setTimeout(() => setListCopied(false), 2500)
    })
  }

  const SELECT = 'px-3 py-2 rounded-lg text-sm text-white'
  const SELECT_STYLE = { backgroundColor: '#2a2035', border: '1px solid #3a3050' }

  const SH = { sortKey, sortDir, onClick: toggleSort }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Itens</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {totals.count} em estoque &nbsp;·&nbsp;lucro potencial:&nbsp;
            {totals.profitRC  !== 0 && <span style={{ color: '#fbbf24' }}>{formatRC(totals.profitRC)}</span>}
            {totals.profitRC !== 0 && totals.profitPIX !== 0 && <span className="text-gray-600"> + </span>}
            {totals.profitPIX !== 0 && <span style={{ color: '#4ade80' }}>{formatCurrency(totals.profitPIX)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <button onClick={() => setViewMode('table')} title="Tabela"
              className="px-2.5 py-1.5 transition-colors"
              style={{ backgroundColor: viewMode === 'table' ? '#7c3aed' : '#2a2035', color: viewMode === 'table' ? '#fff' : '#6b7280' }}>
              <List size={15} />
            </button>
            <button onClick={() => setViewMode('cards')} title="Cards"
              className="px-2.5 py-1.5 transition-colors"
              style={{ backgroundColor: viewMode === 'cards' ? '#7c3aed' : '#2a2035', color: viewMode === 'cards' ? '#fff' : '#6b7280' }}>
              <LayoutGrid size={15} />
            </button>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleCopyList}
              title="Copiar todos os itens (nome + servidor)"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: listCopied ? '#14532d' : '#0c4a6e',
                color: listCopied ? '#4ade80' : '#7dd3fc',
                border: `1px solid ${listCopied ? '#16a34a' : '#0284c7'}`,
              }}
            >
              <Copy size={14} />
              {listCopied ? '✓ Copiado!' : '📋 Copiar lista'}
            </button>
          )}
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#7c3aed' }}
          ><Plus size={16} /> Novo item</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text"
          className="px-3 py-2 rounded-lg text-sm text-white outline-none"
          style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', minWidth: 180 }}
          placeholder="Buscar item ou set…"
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
        />
        <select className={SELECT} style={SELECT_STYLE} value={filters.server} onChange={e => setFilter('server', e.target.value)}>
          <option value="">Todos servidores</option>
          {settings.servers.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
          <option value="">Todas categorias</option>
          {Object.keys(CATEGORY_FALLBACK).map(c => (
            <option key={c} value={c}>{CATEGORY_FALLBACK[c]} {c}</option>
          ))}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={filters.tier} onChange={e => setFilter('tier', e.target.value)}>
          <option value="">Todos tiers</option>
          {Array.from({ length: 11 }, (_, i) => i).map(t => <option key={t} value={t}>T{t}</option>)}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={filters.classification} onChange={e => setFilter('classification', e.target.value)}>
          <option value="">Classe 3 e 4</option>
          <option value="3">Classe 3</option>
          <option value="4">Classe 4</option>
        </select>
      </div>

      {/* Cards view */}
      {viewMode === 'cards' && (
        <div>
          {sorted.length === 0 && <p className="text-gray-500 text-sm py-8 text-center">Nenhum item encontrado.</p>}
          {/* In-stock group */}
          {(soldSeparatorIdx === -1 || soldSeparatorIdx > 0) && sorted.length > 0 && (
            <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
              {(soldSeparatorIdx === -1 ? sorted : sorted.slice(0, soldSeparatorIdx)).map(it => (
                <ItemCard key={it.id} it={it}
                  onEdit={setEditing} onDelete={deleteItem}
                  onSell={setSelling} onHistory={setShowHistory} onClone={handleClone} />
              ))}
            </div>
          )}
          {/* Separator */}
          {soldSeparatorIdx >= 0 && (
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 border-t border-dashed" style={{ borderColor: '#4b2d6e' }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#ef4444', backgroundColor: '#3b0a0a', border: '1px solid #7f1d1d', borderRadius: 999, padding: '2px 10px' }}>
                Sem estoque · {sorted.length - soldSeparatorIdx}
              </span>
              <div className="flex-1 border-t border-dashed" style={{ borderColor: '#4b2d6e' }} />
            </div>
          )}
          {/* Out-of-stock group */}
          {soldSeparatorIdx >= 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))' }}>
              {sorted.slice(soldSeparatorIdx).map(it => (
                <ItemCard key={it.id} it={it}
                  onEdit={setEditing} onDelete={deleteItem}
                  onSell={setSelling} onHistory={setShowHistory} onClone={handleClone} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="rounded-xl overflow-auto" style={{ border: '1px solid #3a3050' }}>
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1a1025' }}>
                <SortableHeader label="Item"     sk="name"      {...SH} />
                <SortableHeader label="Servidor" sk="server"    {...SH} />
                <SortableHeader label="Qtd"      sk="quantity"  {...SH} />
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium whitespace-nowrap">
                  Compra
                  <div className="flex gap-1 mt-0.5">
                    <button onClick={() => toggleSort('buyRC')}  className="text-[10px] transition-colors" style={{ color: sortKey==='buyRC'  ? '#fbbf24':'#f59e0b' }}>RC</button>
                    <span className="text-gray-600 text-[10px]">/</span>
                    <button onClick={() => toggleSort('buyPIX')} className="text-[10px] transition-colors" style={{ color: sortKey==='buyPIX' ? '#4ade80':'#4ade80' }}>PIX</button>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium whitespace-nowrap">
                  Venda
                  <div className="flex gap-1 mt-0.5">
                    <button onClick={() => toggleSort('sellRC')}  className="text-[10px] transition-colors" style={{ color: sortKey==='sellRC'  ? '#fbbf24':'#f59e0b' }}>RC</button>
                    <span className="text-gray-600 text-[10px]">/</span>
                    <button onClick={() => toggleSort('sellPIX')} className="text-[10px] transition-colors" style={{ color: sortKey==='sellPIX' ? '#4ade80':'#4ade80' }}>PIX</button>
                  </div>
                </th>
                <SortableHeader label="Lucro est." sk="profitPIX" {...SH} />
                <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Nenhum item encontrado.</td></tr>
              )}
              {sorted.map((it, idx) => {
                const sc = SET_COLORS[it.set] ?? SET_COLORS['Outros']
                return (
                  <React.Fragment key={it.id}>
                  {idx === soldSeparatorIdx && soldSeparatorIdx > 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '4px 16px', backgroundColor: '#110816' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ flex: 1, borderTop: '1px solid #3a2040' }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444', backgroundColor: '#3b0a0a', border: '1px solid #7f1d1d', borderRadius: 999, padding: '2px 10px' }}>
                            Sem estoque · {sorted.length - soldSeparatorIdx}
                          </span>
                          <div style={{ flex: 1, borderTop: '1px solid #3a2040' }} />
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr className="border-t" style={{ borderColor: '#3a3050', opacity: it.quantity === 0 ? 0.55 : 1 }}>
                    <td className="px-4 py-3" style={{ borderLeft: `3px solid ${sc.primary}` }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `radial-gradient(circle, ${sc.secondary}cc, ${sc.secondary}44)`, border: `1px solid ${sc.primary}44` }}>
                          <ItemImage src={it.imageUrl} category={it.category} size={28} alt={it.name} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-medium">{it.name}</span>
                            <TierBadge tier={it.tier} />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="text-xs text-gray-500">{it.category} · C{it.classification}</div>
                            {it.set && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: sc.primary + '22', color: sc.accent }}>{it.set}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{it.server}</td>
                    <td className="px-4 py-3">
                      <span className={it.quantity === 0 ? 'text-red-400' : 'text-white'}>{it.quantity}</span>
                    </td>
                    <td className="px-4 py-3"><PriceCell rc={it.buyPriceRC  || 0} pix={it.buyPricePIX  || 0} /></td>
                    <td className="px-4 py-3"><PriceCell rc={it.sellPriceRC || 0} pix={it.sellPricePIX || 0} /></td>
                    <td className="px-4 py-3">
                      <ProfitCell
                        buyPriceRC={it.buyPriceRC   || 0} buyPricePIX={it.buyPricePIX   || 0}
                        sellPriceRC={it.sellPriceRC || 0} sellPricePIX={it.sellPricePIX || 0}
                        rcRate={settings.rcRate || 0}
                        sales={it.sales || []}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {it.quantity > 0 ? (
                          <button onClick={() => setSelling(it)} title="Registrar venda"
                            className="p-1.5 rounded hover:bg-green-900/40 text-gray-400 hover:text-green-400 transition-colors">
                            <ShoppingCart size={14} />
                          </button>
                        ) : (
                          <button onClick={() => setSelling(it)} title="Registrar troca / venda retroativa"
                            className="p-1.5 rounded transition-colors"
                            style={{ color: '#9333ea' }}>
                            <ClipboardList size={14} />
                          </button>
                        )}
                        {(it.sales?.length > 0 || it.priceHistory?.length > 0) && (
                          <button onClick={() => setShowHistory(it)} title="Histórico"
                            className="p-1.5 rounded hover:bg-blue-900/40 text-gray-400 hover:text-blue-400 transition-colors">
                            <History size={14} />
                          </button>
                        )}
                        <button onClick={() => handleClone(it)} title="Duplicar"
                          className="p-1.5 rounded hover:bg-indigo-900/40 text-gray-400 hover:text-indigo-400 transition-colors">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => setEditing(it)} title="Editar"
                          className="p-1.5 rounded hover:bg-purple-900/40 text-gray-400 hover:text-purple-400 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => { if (confirm(`Excluir ${it.name}?`)) deleteItem(it.id) }} title="Excluir"
                          className="p-1.5 rounded hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <Modal title="Adicionar item" onClose={() => setShowForm(false)} wide>
          <ItemForm servers={settings.servers}
            onSubmit={(data) => {
              addItem(data)
              if (data.syncCoins && (data.buyPriceRC || 0) > 0) {
                addCoinTransaction({
                  type: 'saida',
                  date: new Date().toISOString(),
                  quantity: data.buyPriceRC * (data.quantity || 1),
                  server: data.server,
                  observation: `Compra: ${data.name}`,
                  pricePerK: 0, totalReceived: 0, profit: 0,
                })
              }
              setShowForm(false)
            }}
            onClose={() => setShowForm(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title={`Editar — ${editing.name}`} onClose={() => setEditing(null)} wide>
          <ItemForm initial={editing} servers={settings.servers}
            onSubmit={async (data) => { await updateItem(editing.id, data); setEditing(null) }}
            onClose={() => setEditing(null)} />
        </Modal>
      )}
      {selling && (
        <ItemSaleModal item={selling}
          onConfirm={async (sale) => {
            const scrollY = window.scrollY
            await sellItem(selling.id, sale)
            if (sale.syncCoins && (sale.soldForRC || 0) > 0) {
              addCoinTransaction({
                type: 'entrada',
                date: new Date().toISOString(),
                quantity: sale.soldForRC,
                server: selling.server,
                observation: `Venda: ${selling.name}${sale.quantity > 1 ? ` (x${sale.quantity})` : ''}`,
                pricePerK: 0, totalPaid: 0,
              })
            }
            if (sale.tradeItemData) {
              await addItem({
                ...sale.tradeItemData,
                server: selling.server,
                observation: `Recebido em troca de ${selling.name}`,
                dateEntry: new Date().toISOString(),
              })
            }
            setSelling(null)
            requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }))
          }}
          onClose={() => setSelling(null)} />
      )}
      {showCopyModal && (
        <Modal title="Copiar lista" onClose={() => setShowCopyModal(false)}>
          <div className="space-y-3 pt-1">
            <p className="text-xs text-gray-500">Selecione os servidores (vários ao mesmo tempo):</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCopyServers([])}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: copyServers.length === 0 ? '#3730a3' : '#2a2035',
                  border: `1px solid ${copyServers.length === 0 ? '#6366f1' : '#3a3050'}`,
                  color: copyServers.length === 0 ? '#fff' : '#6b7280',
                }}>
                🌐 Todos
              </button>
              {settings.servers.map(s => (
                <button key={s}
                  onClick={() => toggleCopyServer(s)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: copyServers.includes(s) ? '#5b21b6' : '#2a2035',
                    border: `1px solid ${copyServers.includes(s) ? '#7c3aed' : '#3a3050'}`,
                    color: copyServers.includes(s) ? '#fff' : '#6b7280',
                  }}>
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={executeCopy}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#7c3aed' }}>
              📋 Copiar{copyServers.length > 0 ? ` (${copyServers.join(', ')})` : ' (todos os servidores)'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Agrupado por vocação · do mais caro ao mais barato · sem duplicatas
          </p>
        </Modal>
      )}
      {showHistory && (
        <Modal title={`Histórico — ${showHistory.name}`} onClose={() => setShowHistory(null)}>
          <div className="space-y-5">
            {/* Sales */}
            {showHistory.sales?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendas</div>
                <div className="space-y-2">
                  {showHistory.sales.map(s => (
                    <div key={s.id} className="rounded-lg p-3 text-sm space-y-1.5"
                      style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{formatDate(s.date)}</span>
                        <span className="text-gray-400">Qtd: {s.quantity}</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        {s.soldForRC > 0 && (
                          <span>Vendido: <span style={{ color: '#f59e0b' }}>{formatRC(s.soldForRC)}</span>
                            &nbsp;·&nbsp;Lucro: <span style={{ color: s.profitRC >= 0 ? '#fbbf24' : '#f87171' }}>{formatRC(s.profitRC)}</span>
                          </span>
                        )}
                        {s.soldForPIX > 0 && (
                          <span>Vendido: <span style={{ color: '#4ade80' }}>{formatCurrency(s.soldForPIX)}</span>
                            &nbsp;·&nbsp;Lucro: <span style={{ color: s.profitPIX >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(s.profitPIX)}</span>
                          </span>
                        )}
                      </div>
                      {s.observation && <div className="text-gray-500">{s.observation}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price history */}
            {showHistory.priceHistory?.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Histórico de Preço</div>
                <div className="space-y-2">
                  {[...showHistory.priceHistory].reverse().map((p, i) => (
                    <div key={i} className="rounded-lg p-3 text-xs space-y-1"
                      style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                      <div className="text-gray-500">{formatDate(p.date)}</div>
                      <div className="flex flex-wrap gap-3">
                        {p.buyRC  > 0 && <span className="text-gray-400">Compra: <span style={{ color: '#f59e0b' }}>{formatRC(p.buyRC)}</span></span>}
                        {p.buyPIX > 0 && <span className="text-gray-400">Compra: <span style={{ color: '#4ade80' }}>{formatCurrency(p.buyPIX)}</span></span>}
                        {p.sellRC  > 0 && <span className="text-gray-400">Venda: <span style={{ color: '#f59e0b' }}>{formatRC(p.sellRC)}</span></span>}
                        {p.sellPIX > 0 && <span className="text-gray-400">Venda: <span style={{ color: '#4ade80' }}>{formatCurrency(p.sellPIX)}</span></span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showHistory.sales?.length && !showHistory.priceHistory?.length && (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum histórico ainda.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
