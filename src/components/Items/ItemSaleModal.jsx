import React, { useState, useRef, useEffect } from 'react'
import Modal from '../UI/Modal'
import ItemImage from '../UI/ItemImage'
import { formatCurrency, formatRC, buildImageUrl } from '../../utils/helpers'
import { searchItems, getItemByName } from '../../data/itemsDatabase'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

export default function ItemSaleModal({ item, onConfirm, onClose }) {
  const maxQty      = item.quantity > 0 ? item.quantity : 1
  const isZeroStock = item.quantity === 0

  const [qty,       setQty]       = useState(1)
  const [soldForRC, setSoldForRC] = useState(item.sellPriceRC  || '')
  const [soldForPIX,setSoldForPIX]= useState(item.sellPricePIX || '')
  const [obs,       setObs]       = useState('')
  const [syncCoins, setSyncCoins] = useState(true)

  // Troca
  const [hasTrade,            setHasTrade]            = useState(false)
  const [tradeItem,           setTradeItem]           = useState('')
  const [tradeImageUrl,       setTradeImageUrl]       = useState('')
  const [tradeCategory,       setTradeCategory]       = useState('arma')
  const [tradeValueRC,        setTradeValueRC]        = useState('')
  const [tradeValuePIX,       setTradeValuePIX]       = useState('')
  const [tradeQty,            setTradeQty]            = useState(1)
  const [tradeClassification, setTradeClassification] = useState(4)
  const [tradeTier,           setTradeTier]           = useState(0)
  const [tradeMaxTier,        setTradeMaxTier]        = useState(4)
  const [tradeSet,            setTradeSet]            = useState('')

  // Autocomplete da troca
  const [suggestions, setSuggestions] = useState([])
  const [showSug,     setShowSug]     = useState(false)
  const sugRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTradeNameChange = (val) => {
    setTradeItem(val)
    setTradeImageUrl('')
    if (val.length >= 2) {
      const sug = searchItems(val)
      setSuggestions(sug)
      setShowSug(sug.length > 0)
    } else {
      setShowSug(false)
    }
  }

  const selectTradeItem = (dbItem) => {
    setTradeItem(dbItem.name)
    setTradeImageUrl(dbItem.imageUrl)
    setTradeCategory(dbItem.category)
    setTradeClassification(dbItem.classification ?? 4)
    setTradeTier(dbItem.tier ?? 0)
    setTradeMaxTier(dbItem.maxTier ?? 4)
    setTradeSet(dbItem.set ?? '')
    setShowSug(false)
  }

  const handleTradeNameBlur = () => {
    setTimeout(() => setShowSug(false), 150)
    if (!tradeImageUrl && tradeItem) {
      const dbItem = getItemByName(tradeItem)
      if (dbItem) selectTradeItem(dbItem)
      else setTradeImageUrl(buildImageUrl(tradeItem))
    }
  }

  const q    = Math.max(1, parseInt(qty)   || 1)
  const rc   = parseFloat(soldForRC)       || 0
  const pix  = parseFloat(soldForPIX)      || 0
  const tRC  = parseFloat(tradeValueRC)    || 0
  const tPIX = parseFloat(tradeValuePIX)   || 0
  const tQty = Math.max(1, parseInt(tradeQty) || 1)

  const totalRC  = rc  + (hasTrade ? tRC  : 0)
  const totalPIX = pix + (hasTrade ? tPIX : 0)

  const profitRC  = totalRC  - (item.buyPriceRC  || 0) * q
  const profitPIX = totalPIX - (item.buyPricePIX || 0) * q

  const handleSubmit = (e) => {
    e.preventDefault()
    if (q < 1) return

    let finalObs = obs
    if (hasTrade && tradeItem) {
      const tradeDesc = [
        tradeItem,
        tRC  > 0 ? `${formatRC(tRC)} est.`        : null,
        tPIX > 0 ? `${formatCurrency(tPIX)} est.` : null,
      ].filter(Boolean).join(' · ')
      finalObs = obs ? `${obs} | Troca: ${tradeDesc}` : `Troca: ${tradeDesc}`
    }

    onConfirm({
      quantity:    q,
      soldForRC:   totalRC,
      soldForPIX:  totalPIX,
      observation: finalObs,
      date:        (() => { const d = new Date(), p = n => String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}` })(),
      syncCoins,
      tradeItemData: hasTrade && tradeItem ? {
        name:           tradeItem,
        imageUrl:       tradeImageUrl,
        category:       tradeCategory,
        vocation:       item.vocation ?? 'ALL',
        quantity:       tQty,
        buyPriceRC:     tRC,
        buyPricePIX:    tPIX,
        set:            tradeSet,
        classification: tradeClassification,
        tier:           tradeTier,
        maxTier:        tradeMaxTier,
      } : null,
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
              🔄 Recebi item em troca (adicionar ao estoque)
            </span>
          </label>

          {hasTrade && (
            <div className="px-4 pb-4 pt-2 space-y-3" style={{ backgroundColor: '#1e1030' }}>
              <p className="text-[11px]" style={{ color: '#9333ea' }}>
                Informe o item recebido. Ele será adicionado automaticamente ao estoque.
              </p>

              {/* Campo de nome com autocomplete + imagem */}
              <div>
                <label className={LABEL}>Item recebido</label>
                <div className="relative" ref={sugRef}>
                  <div className="flex items-center gap-2">
                    {/* Imagem do item */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#130e1e', border: '1px solid #3a3050' }}>
                      <ItemImage src={tradeImageUrl} category={tradeCategory} size={28} alt={tradeItem} />
                    </div>
                    <input type="text"
                      className={INPUT + ' flex-1'} style={INPUT_STYLE}
                      value={tradeItem}
                      onChange={e => handleTradeNameChange(e.target.value)}
                      onFocus={() => tradeItem.length >= 2 && setShowSug(suggestions.length > 0)}
                      onBlur={handleTradeNameBlur}
                      placeholder="Ex: Sanguine Razor"
                      autoFocus />
                  </div>

                  {/* Dropdown de sugestões */}
                  {showSug && (
                    <ul className="absolute z-20 w-full mt-1 rounded-lg shadow-xl overflow-y-auto"
                      style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', maxHeight: 180, left: 0 }}>
                      {suggestions.map(it => (
                        <li key={it.name}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 text-sm text-gray-200"
                          onMouseDown={() => selectTradeItem(it)}>
                          <ItemImage src={it.imageUrl} category={it.category} size={24} />
                          <span className="flex-1">{it.name}</span>
                          <span className="text-xs text-gray-500">C{it.classification}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Quantidade recebida */}
              <div>
                <label className={LABEL}>Quantidade recebida</label>
                <input type="number" min="1" step="1"
                  className={INPUT} style={{ ...INPUT_STYLE, maxWidth: 120 }}
                  value={tradeQty} onChange={e => setTradeQty(e.target.value)} />
              </div>

              {/* Valor estimado */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className={LABEL}>Valor estimado (RC)</label>
                  <input type="number" min="0" step="1"
                    className={INPUT + ' pr-8'} style={INPUT_STYLE}
                    value={tradeValueRC} onChange={e => setTradeValueRC(e.target.value)} placeholder="0" />
                  <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
                    style={{ color: '#f59e0b' }}>RC</span>
                </div>
                <div className="relative">
                  <label className={LABEL}>Valor estimado (R$)</label>
                  <input type="number" min="0" step="0.01"
                    className={INPUT + ' pr-12'} style={INPUT_STYLE}
                    value={tradeValuePIX} onChange={e => setTradeValuePIX(e.target.value)} placeholder="0,00" />
                  <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
                    style={{ color: '#4ade80' }}>PIX</span>
                </div>
              </div>

              {(tRC > 0 || tPIX > 0) && (
                <div className="text-[11px] px-2 py-1.5 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: '#2a1a3e', color: '#a78bfa' }}>
                  <span>✅</span>
                  <span>
                    Valor da troca incluído:{' '}
                    {tRC  > 0 ? formatRC(tRC) : ''}
                    {tRC  > 0 && tPIX > 0 ? ' + ' : ''}
                    {tPIX > 0 ? formatCurrency(tPIX) : ''}
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
          {hasTrade && (tRC > 0 || tPIX > 0) && (
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
