import React, { useState, useRef, useEffect } from 'react'
import { searchItems, getItemByName } from '../../data/itemsDatabase'
import { buildImageUrl, CATEGORY_FALLBACK, formatRC, formatCurrency } from '../../utils/helpers'
import { useApp } from '../../context/AppContext'
import ItemImage from '../UI/ItemImage'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

const EMPTY = {
  name: '', imageUrl: '', classification: 4, tier: 0, maxTier: 4,
  server: '', quantity: 1,
  buyPriceRC: '', buyPricePIX: '',
  sellPriceRC: '', sellPricePIX: '',
  category: 'arma', observation: '',
}

const DRAFT_KEY = 'items_form_draft'
const saveDraft = (data) => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)) } catch {} }
const loadDraft = () => { try { const s = sessionStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null } catch { return null } }
const clearDraft = () => sessionStorage.removeItem(DRAFT_KEY)

function PriceCard({ type, rcValue, pixValue, onRcChange, onPixChange }) {
  const isBuy  = type === 'buy'
  const color  = isBuy ? '#f87171' : '#4ade80'
  const label  = isBuy ? 'Compra'  : 'Venda'
  const icon   = isBuy ? '💸'      : '💰'
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#130e1e', border: `1px solid ${color}33` }}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
      </div>
      {/* RC */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Rubini Coins (RC)</span>
        </div>
        <div className="relative">
          <input type="number" min="0" step="1"
            className={INPUT + ' pr-10'} style={INPUT_STYLE}
            value={rcValue} onChange={e => onRcChange(e.target.value)} placeholder="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black pointer-events-none"
            style={{ color: '#f59e0b' }}>RC</span>
        </div>
      </div>
      {/* PIX */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>PIX (R$)</span>
        </div>
        <div className="relative">
          <input type="number" min="0" step="0.01"
            className={INPUT + ' pr-12'} style={INPUT_STYLE}
            value={pixValue} onChange={e => onPixChange(e.target.value)} placeholder="0,00"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black pointer-events-none"
            style={{ color: '#4ade80' }}>PIX</span>
        </div>
      </div>
    </div>
  )
}

export default function ItemForm({ initial, servers, onSubmit, onClose }) {
  const { settings } = useApp()
  const rcRate = settings?.rcRate || 0
  const [form, setFormRaw] = useState(() => {
    if (initial) return { ...initial }
    const draft = loadDraft()
    return draft ?? { ...EMPTY, server: servers[0] ?? '' }
  })
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef(null)

  const set = (k, v) => setFormRaw(f => {
    const next = { ...f, [k]: v }
    if (!initial) saveDraft(next)
    return next
  })

  const handleNameChange = (val) => {
    set('name', val)
    const sug = searchItems(val)
    setSuggestions(sug)
    setShowSug(sug.length > 0)
  }

  const selectItem = (item) => {
    setFormRaw(f => {
      const next = {
        ...f,
        name: item.name, imageUrl: item.imageUrl,
        classification: item.classification, maxTier: item.maxTier,
        category: item.category, set: item.set ?? '',
        tier: Math.min(f.tier, item.maxTier),
      }
      if (!initial) saveDraft(next)
      return next
    })
    setShowSug(false)
  }

  useEffect(() => {
    const handler = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNameBlur = () => {
    setTimeout(() => setShowSug(false), 150)
    if (!form.imageUrl && form.name) {
      const dbItem = getItemByName(form.name)
      if (dbItem) selectItem(dbItem)
      else set('imageUrl', buildImageUrl(form.name))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    clearDraft()
    onSubmit({
      ...form,
      quantity:     parseInt(form.quantity)       || 1,
      buyPriceRC:   parseFloat(form.buyPriceRC)   || 0,
      buyPricePIX:  parseFloat(form.buyPricePIX)  || 0,
      sellPriceRC:  parseFloat(form.sellPriceRC)  || 0,
      sellPricePIX: parseFloat(form.sellPricePIX) || 0,
      tier:           parseInt(form.tier),
      classification: parseInt(form.classification),
      maxTier:        parseInt(form.maxTier),
      dateEntry: initial?.dateEntry ?? new Date().toISOString(),
    })
  }

  const bRC  = parseFloat(form.buyPriceRC)   || 0
  const bPIX = parseFloat(form.buyPricePIX)  || 0
  const sRC  = parseFloat(form.sellPriceRC)  || 0
  const sPIX = parseFloat(form.sellPricePIX) || 0
  const hasAny = bRC || bPIX || sRC || sPIX

  // Lucro calculado
  let profitDisplay = null
  if (hasAny) {
    if (rcRate > 0) {
      // Taxa configurada → converte tudo para R$
      const profit = (sPIX + sRC * rcRate) - (bPIX + bRC * rcRate)
      profitDisplay = (
        <span className="font-bold" style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }}>
          {formatCurrency(profit)}
        </span>
      )
    } else {
      // RC só mostra se AMBOS compra e venda forem em RC
      const rcProfit  = sRC  - bRC
      const pixProfit = sPIX - bPIX
      const parts = []
      if (bRC > 0 && sRC > 0)
        parts.push(<span key="rc" className="font-bold" style={{ color: rcProfit >= 0 ? '#fbbf24' : '#f87171' }}>{formatRC(rcProfit)}</span>)
      if (bPIX > 0 || sPIX > 0)
        parts.push(<span key="pix" className="font-bold" style={{ color: pixProfit >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(pixProfit)}</span>)
      if (parts.length) profitDisplay = <>{parts}</>
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Nome */}
      <div className="relative" ref={sugRef}>
        <label className={LABEL}>Nome do item</label>
        <div className="flex items-center gap-2">
          <ItemImage src={form.imageUrl} category={form.category} size={32} />
          <input type="text" required
            className={INPUT + ' flex-1'} style={INPUT_STYLE}
            value={form.name}
            onChange={e => handleNameChange(e.target.value)}
            onFocus={() => form.name.length >= 2 && setShowSug(suggestions.length > 0)}
            onBlur={handleNameBlur}
            placeholder="Ex: Sanguine Armor"
          />
        </div>
        {showSug && (
          <ul className="absolute z-10 w-full mt-1 rounded-lg shadow-xl overflow-y-auto"
            style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', maxHeight: 200 }}>
            {suggestions.map(it => (
              <li key={it.name}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 text-sm text-gray-200"
                onMouseDown={() => selectItem(it)}>
                <ItemImage src={it.imageUrl} category={it.category} size={24} />
                <span>{it.name}</span>
                <span className="ml-auto text-xs text-gray-500">C{it.classification}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Classificação</label>
          <select className={INPUT} style={INPUT_STYLE} value={form.classification}
            onChange={e => { const c = parseInt(e.target.value); setForm(f => ({ ...f, classification: c, maxTier: c, tier: Math.min(f.tier, c) })) }}>
            <option value={3}>Classe 3</option>
            <option value={4}>Classe 4</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Tier</label>
          <select className={INPUT} style={INPUT_STYLE} value={form.tier} onChange={e => set('tier', parseInt(e.target.value))}>
            {Array.from({ length: 11 }, (_, i) => i).map(t =>
              <option key={t} value={t}>T{t}{t === 0 ? ' (Sem forge)' : ''}</option>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Categoria</label>
          <select className={INPUT} style={INPUT_STYLE} value={form.category} onChange={e => set('category', e.target.value)}>
            {Object.keys(CATEGORY_FALLBACK).map(c => (
              <option key={c} value={c}>{CATEGORY_FALLBACK[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Servidor</label>
          <select className={INPUT} style={INPUT_STYLE} value={form.server} onChange={e => set('server', e.target.value)}>
            {servers.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Quantidade</label>
        <input type="number" min="0" required className={INPUT} style={{ ...INPUT_STYLE, maxWidth: 120 }}
          value={form.quantity} onChange={e => set('quantity', e.target.value)} />
      </div>

      {/* Preços */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <PriceCard type="buy"
            rcValue={form.buyPriceRC}   onRcChange={v => set('buyPriceRC', v)}
            pixValue={form.buyPricePIX} onPixChange={v => set('buyPricePIX', v)}
          />
          <PriceCard type="sell"
            rcValue={form.sellPriceRC}   onRcChange={v => set('sellPriceRC', v)}
            pixValue={form.sellPricePIX} onPixChange={v => set('sellPricePIX', v)}
          />
        </div>
        {profitDisplay && (
          <div className="flex justify-between items-center px-1 text-xs">
            <span className="text-gray-400">Lucro estimado</span>
            <div className="flex gap-3">{profitDisplay}</div>
          </div>
        )}
      </div>

      <div>
        <label className={LABEL}>Observação</label>
        <input type="text" className={INPUT} style={INPUT_STYLE}
          value={form.observation} onChange={e => set('observation', e.target.value)} placeholder="Opcional" />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={() => { if (!initial) clearDraft(); onClose() }}
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
