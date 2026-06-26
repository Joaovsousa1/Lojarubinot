import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import Modal from '../UI/Modal'
import ItemImage from '../UI/ItemImage'
import { formatCurrency, formatRC, buildImageUrl } from '../../utils/helpers'
import { searchItems, getItemByName } from '../../data/itemsDatabase'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

const emptyTrade = () => ({
  id: Math.random().toString(36).slice(2),
  name: '', imageUrl: '', category: 'arma',
  valueRC: '', valuePIX: '', qty: 1,
  classification: 4, tier: 0, maxTier: 4, set: '',
})

function TradeItemRow({ trade, onChange, onRemove, showRemove }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNameChange = (val) => {
    onChange({ ...trade, name: val, imageUrl: '' })
    if (val.length >= 2) {
      const sug = searchItems(val)
      setSuggestions(sug)
      setShowSug(sug.length > 0)
    } else {
      setShowSug(false)
    }
  }

  const selectItem = (dbItem) => {
    onChange({
      ...trade,
      name:           dbItem.name,
      imageUrl:       dbItem.imageUrl,
      category:       dbItem.category,
      classification: dbItem.classification ?? 4,
      tier:           dbItem.tier ?? 0,
      maxTier:        dbItem.maxTier ?? 4,
      set:            dbItem.set ?? '',
    })
    setShowSug(false)
  }

  const handleNameBlur = () => {
    setTimeout(() => setShowSug(false), 150)
    if (!trade.imageUrl && trade.name) {
      const dbItem = getItemByName(trade.name)
      if (dbItem) selectItem(dbItem)
      else onChange({ ...trade, imageUrl: buildImageUrl(trade.name) })
    }
  }

  return (
    <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: '#180f27', border: '1px solid #3a3050' }}>
      <div className="flex items-start gap-2">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: '#130e1e', border: '1px solid #3a3050' }}>
          <ItemImage src={trade.imageUrl} category={trade.category} size={26} alt={trade.name} />
        </div>
        <div className="flex-1 relative" ref={sugRef}>
          <input type="text"
            className={INPUT} style={INPUT_STYLE}
            value={trade.name}
            onChange={e => handleNameChange(e.target.value)}
            onFocus={() => trade.name.length >= 2 && setShowSug(suggestions.length > 0)}
            onBlur={handleNameBlur}
            placeholder="Ex: Sanguine Razor" />
          {showSug && (
            <ul className="absolute z-20 w-full mt-1 rounded-lg shadow-xl overflow-y-auto"
              style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', maxHeight: 160, left: 0 }}>
              {suggestions.map(it => (
                <li key={it.name}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 text-sm text-gray-200"
                  onMouseDown={() => selectItem(it)}>
                  <ItemImage src={it.imageUrl} category={it.category} size={22} />
                  <span className="flex-1">{it.name}</span>
                  <span className="text-xs text-gray-500">C{it.classification}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {showRemove && (
          <button type="button" onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-900/40 text-gray-500 hover:text-red-400 transition-colors mt-0.5"
            title="Remover item">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={LABEL}>Qtd</label>
          <input type="number" min="1" step="1"
            className={INPUT} style={INPUT_STYLE}
            value={trade.qty}
            onChange={e => onChange({ ...trade, qty: e.target.value })} />
        </div>
        <div className="relative">
          <label className={LABEL}>Valor est. (RC)</label>
          <input type="number" min="0" step="1"
            className={INPUT + ' pr-8'} style={INPUT_STYLE}
            value={trade.valueRC}
            onChange={e => onChange({ ...trade, valueRC: e.target.value })}
            placeholder="0" />
          <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
            style={{ color: '#f59e0b' }}>RC</span>
        </div>
        <div className="relative">
          <label className={LABEL}>Valor est. (R$)</label>
          <input type="number" min="0" step="0.01"
            className={INPUT + ' pr-10'} style={INPUT_STYLE}
            value={trade.valuePIX}
            onChange={e => onChange({ ...trade, valuePIX: e.target.value })}
            placeholder="0,00" />
          <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
            style={{ color: '#4ade80' }}>PIX</span>
        </div>
      </div>
    </div>
  )
}

export default function ItemSaleModal({ item, onConfirm, onClose }) {
  const maxQty      = item.quantity > 0 ? item.quantity : 1
  const isZeroStock = item.quantity === 0

  const [qty,        setQty]        = useState(1)
  const [soldForRC,  setSoldForRC]  = useState(item.sellPriceRC  || '')
  const [soldForPIX, setSoldForPIX] = useState(item.sellPricePIX || '')
  const [obs,        setObs]        = useState('')
  const [syncCoins,  setSyncCoins]  = useState(true)

  const [hasTrade,   setHasTrade]   = useState(false)
  const [tradeItems, setTradeItems] = useState([emptyTrade()])

  const updateTrade = (idx, updated) =>
    setTradeItems(prev => prev.map((t, i) => i === idx ? updated : t))

  const removeTrade = (idx) =>
    setTradeItems(prev => prev.filter((_, i) => i !== idx))

  const addTrade = () =>
    setTradeItems(prev => [...prev, emptyTrade()])

  const q   = Math.max(1, parseInt(qty)  || 1)
  const rc  = parseFloat(soldForRC)      || 0
  const pix = parseFloat(soldForPIX)     || 0

  const totalTradeRC  = tradeItems.reduce((s, t) => s + (parseFloat(t.valueRC)  || 0), 0)
  const totalTradePIX = tradeItems.reduce((s, t) => s + (parseFloat(t.valuePIX) || 0), 0)

  const totalRC  = rc  + (hasTrade ? totalTradeRC  : 0)
  const totalPIX = pix + (hasTrade ? totalTradePIX : 0)

  const profitRC  = totalRC  - (item.buyPriceRC  || 0) * q
  const profitPIX = totalPIX - (item.buyPricePIX || 0) * q

  const handleSubmit = (e) => {
    e.preventDefault()
    if (q < 1) return

    const validTrades = hasTrade ? tradeItems.filter(t => t.name) : []

    let finalObs = obs
    if (validTrades.length > 0) {
      const tradeDesc = validTrades.map(t => {
        const tRC  = parseFloat(t.valueRC)  || 0
        const tPIX = parseFloat(t.valuePIX) || 0
        return [
          t.name,
          tRC  > 0 ? `${formatRC(tRC)} est.`        : null,
          tPIX > 0 ? `${formatCurrency(tPIX)} est.` : null,
        ].filter(Boolean).join(' ')
      }).join(', ')
      finalObs = obs ? `${obs} | Troca: ${tradeDesc}` : `Troca: ${tradeDesc}`
    }

    onConfirm({
      quantity:    q,
      soldForRC:   totalRC,
      soldForPIX:  totalPIX,
      observation: finalObs,
      date:        (() => { const d = new Date(), p = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}` })(),
      syncCoins,
      tradeItemsData: validTrades.map(t => ({
        name:           t.name,
        imageUrl:       t.imageUrl,
        category:       t.category,
        vocation:       item.vocation ?? 'ALL',
        quantity:       Math.max(1, parseInt(t.qty) || 1),
        buyPriceRC:     parseFloat(t.valueRC)  || 0,
        buyPricePIX:    parseFloat(t.valuePIX) || 0,
        set:            t.set,
        classification: t.classification,
        tier:           t.tier,
        maxTier:        t.maxTier,
      })),
    })
  }

  return (
    <Modal title={`Registrar venda — ${item.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {isZeroStock && (
          <div className="rounded-lg px-3 py-2 text-xs flex items-center gap-2"
            style={{ backgroundColor: '#1c0a0a', border: '1px solid #7f1d1d', color: '#fca5a5' }}>
            <span>⚠️</span>
            <span>Estoque zerado — registrando venda retroativa ou troca sem baixar estoque.</span>
          </div>
        )}

        <div>
          <label className={LABEL}>
            Quantidade {isZeroStock ? '(registro retroativo)' : `(máx. ${item.quantity})`}
          </label>
          <input type="number" min="1" max={isZeroStock ? undefined : maxQty} required
            className={INPUT} style={{ ...INPUT_STYLE, maxWidth: 120 }}
            value={qty} onChange={e => setQty(e.target.value)} />
        </div>

        {/* Valor recebido */}
        <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
          <p className="text-xs text-gray-400">Valor recebido em dinheiro — preencha o que se aplica</p>
          <div className="relative">
            <label className={LABEL}>Em RC (Rubini Coins)</label>
            <input type="number" min="0" step="1"
              className={INPUT + ' pr-8'} style={INPUT_STYLE}
              value={soldForRC} onChange={e => setSoldForRC(e.target.value)} placeholder="0" />
            <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
              style={{ color: '#f59e0b' }}>RC</span>
          </div>
          <div className="relative">
            <label className={LABEL}>Em PIX (R$)</label>
            <input type="number" min="0" step="0.01"
              className={INPUT + ' pr-12'} style={INPUT_STYLE}
              value={soldForPIX} onChange={e => setSoldForPIX(e.target.value)} placeholder="0,00" />
            <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
              style={{ color: '#4ade80' }}>PIX</span>
          </div>
        </div>

        {/* Seção de troca */}
        <div className="rounded-lg overflow-hidden" style={{ border: `2px solid ${hasTrade ? '#7c3aed' : '#3a3050'}` }}>
          <label className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            style={{ backgroundColor: hasTrade ? '#2a1a3e' : '#1a1025' }}>
            <input type="checkbox" checked={hasTrade} onChange={e => setHasTrade(e.target.checked)}
              style={{ accentColor: '#7c3aed', width: 16, height: 16, flexShrink: 0 }} />
            <span className="font-semibold text-sm" style={{ color: hasTrade ? '#c084fc' : '#9ca3af' }}>
              🔄 Recebi item(s) em troca (adicionar ao estoque)
            </span>
          </label>

          {hasTrade && (
            <div className="px-4 pb-4 pt-2 space-y-3" style={{ backgroundColor: '#1e1030' }}>
              <p className="text-[11px]" style={{ color: '#9333ea' }}>
                Informe os itens recebidos. Eles serão adicionados automaticamente ao estoque.
              </p>

              <div className="space-y-2">
                {tradeItems.map((t, idx) => (
                  <TradeItemRow
                    key={t.id}
                    trade={t}
                    onChange={updated => updateTrade(idx, updated)}
                    onRemove={() => removeTrade(idx)}
                    showRemove={tradeItems.length > 1}
                  />
                ))}
              </div>

              <button type="button" onClick={addTrade}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold w-full justify-center transition-colors"
                style={{ backgroundColor: '#2a1a3e', border: '1px dashed #7c3aed', color: '#a78bfa' }}>
                <Plus size={13} /> Adicionar outro item
              </button>

              {(totalTradeRC > 0 || totalTradePIX > 0) && (
                <div className="text-[11px] px-2 py-1.5 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: '#2a1a3e', color: '#a78bfa' }}>
                  <span>✅</span>
                  <span>
                    Valor total da troca:{' '}
                    {totalTradeRC  > 0 ? formatRC(totalTradeRC) : ''}
                    {totalTradeRC  > 0 && totalTradePIX > 0 ? ' + ' : ''}
                    {totalTradePIX > 0 ? formatCurrency(totalTradePIX) : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resumo do lucro */}
        <div className="rounded-lg p-3 space-y-2" style={{ border: '1px solid #3a3050' }}>
          {item.buyPriceRC > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Custo compra (RC)</span>
              <span style={{ color: '#f59e0b' }}>{formatRC(item.buyPriceRC * q)}</span>
            </div>
          )}
          {item.buyPricePIX > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Custo compra (PIX)</span>
              <span className="text-red-400">{formatCurrency(item.buyPricePIX * q)}</span>
            </div>
          )}
          {hasTrade && (totalTradeRC > 0 || totalTradePIX > 0) && (
            <div className="flex justify-between text-xs pt-1" style={{ color: '#a78bfa' }}>
              <span>Total recebido (incl. troca)</span>
              <span>
                {totalRC  > 0 ? formatRC(totalRC)        : ''}
                {totalRC  > 0 && totalPIX > 0 ? ' + '   : ''}
                {totalPIX > 0 ? formatCurrency(totalPIX) : ''}
              </span>
            </div>
          )}
          {totalRC > 0 && (
            <div className="flex justify-between text-sm font-semibold border-t pt-2" style={{ borderColor: '#3a3050' }}>
              <span className="text-gray-300">Lucro em RC</span>
              <span style={{ color: profitRC >= 0 ? '#fbbf24' : '#f87171' }}>{formatRC(profitRC)}</span>
            </div>
          )}
          {totalPIX > 0 && (
            <div className="flex justify-between text-sm font-semibold border-t pt-2" style={{ borderColor: '#3a3050' }}>
              <span className="text-gray-300">Lucro em PIX</span>
              <span style={{ color: profitPIX >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(profitPIX)}</span>
            </div>
          )}
        </div>

        {totalRC > 0 && (
          <label className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: 13 }}>
            <input type="checkbox" checked={syncCoins} onChange={e => setSyncCoins(e.target.checked)}
              style={{ accentColor: '#7c3aed', width: 15, height: 15 }} />
            <span style={{ color: '#c4b5fd' }}>
              📥 Adicionar <strong>{Math.round(totalRC)} RC</strong> ao estoque de coins
            </span>
          </label>
        )}

        <div>
          <label className={LABEL}>Observação</label>
          <input type="text" className={INPUT} style={INPUT_STYLE}
            value={obs} onChange={e => setObs(e.target.value)} placeholder="Opcional" />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}>
            Cancelar
          </button>
          <button type="submit"
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#7c3aed' }}>
            Confirmar venda
          </button>
        </div>
      </form>
    </Modal>
  )
}
