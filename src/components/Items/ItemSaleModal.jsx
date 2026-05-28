import React, { useState } from 'react'
import Modal from '../UI/Modal'
import { formatCurrency, formatRC } from '../../utils/helpers'

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'

export default function ItemSaleModal({ item, onConfirm, onClose }) {
  const [qty, setQty] = useState(1)
  const [soldForRC,  setSoldForRC]  = useState(item.sellPriceRC  || '')
  const [soldForPIX, setSoldForPIX] = useState(item.sellPricePIX || '')
  const [obs, setObs] = useState('')

  const q = parseInt(qty) || 1
  const rc  = parseFloat(soldForRC)  || 0
  const pix = parseFloat(soldForPIX) || 0

  const profitRC  = rc  - (item.buyPriceRC  || 0) * q
  const profitPIX = pix - (item.buyPricePIX || 0) * q

  const handleSubmit = (e) => {
    e.preventDefault()
    if (q < 1 || q > item.quantity) return
    onConfirm({
      quantity: q,
      soldForRC: rc,
      soldForPIX: pix,
      observation: obs,
      date: new Date().toISOString(),
    })
  }

  return (
    <Modal title={`Registrar venda — ${item.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={LABEL}>Quantidade (máx. {item.quantity})</label>
          <input type="number" min="1" max={item.quantity} required
            className={INPUT} style={{ ...INPUT_STYLE, maxWidth: 120 }}
            value={qty} onChange={e => setQty(e.target.value)} />
        </div>

        <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
          <p className="text-xs text-gray-400">Valor recebido — preencha o que se aplica</p>

          <div className="relative">
            <label className={LABEL}>Em RC (Rubini Coins)</label>
            <input type="number" min="0" step="1"
              className={INPUT + ' pr-8'} style={INPUT_STYLE}
              value={soldForRC} onChange={e => setSoldForRC(e.target.value)}
              placeholder="0" />
            <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
              style={{ color: '#f59e0b' }}>RC</span>
          </div>

          <div className="relative">
            <label className={LABEL}>Em PIX (R$)</label>
            <input type="number" min="0" step="0.01"
              className={INPUT + ' pr-12'} style={INPUT_STYLE}
              value={soldForPIX} onChange={e => setSoldForPIX(e.target.value)}
              placeholder="0,00" />
            <span className="absolute right-2 bottom-2 text-xs font-bold pointer-events-none"
              style={{ color: '#4ade80' }}>PIX</span>
          </div>
        </div>

        {/* Profit preview */}
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
          {rc > 0 && (
            <div className="flex justify-between text-sm font-semibold border-t pt-2" style={{ borderColor: '#3a3050' }}>
              <span className="text-gray-300">Lucro em RC</span>
              <span style={{ color: profitRC >= 0 ? '#fbbf24' : '#f87171' }}>{formatRC(profitRC)}</span>
            </div>
          )}
          {pix > 0 && (
            <div className="flex justify-between text-sm font-semibold border-t pt-2" style={{ borderColor: '#3a3050' }}>
              <span className="text-gray-300">Lucro em PIX</span>
              <span style={{ color: profitPIX >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(profitPIX)}</span>
            </div>
          )}
        </div>

        <div>
          <label className={LABEL}>Observação</label>
          <input type="text" className={INPUT} style={INPUT_STYLE}
            value={obs} onChange={e => setObs(e.target.value)} placeholder="Opcional" />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
          >Cancelar</button>
          <button type="submit"
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#7c3aed' }}
          >Confirmar venda</button>
        </div>
      </form>
    </Modal>
  )
}
