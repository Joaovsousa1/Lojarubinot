import React, { useState } from 'react'
import { Hammer, RotateCcw } from 'lucide-react'
import { formatRC, formatNumber, TIER_COLORS } from '../../utils/helpers'

const DEFAULT_RATES = [
  { success: 100, cores: 1 },
  { success: 70,  cores: 2 },
  { success: 50,  cores: 3 },
  { success: 30,  cores: 4 },
  { success: 20,  cores: 5 },
  { success: 15,  cores: 6 },
  { success: 10,  cores: 7 },
  { success: 8,   cores: 8 },
  { success: 6,   cores: 9 },
  { success: 5,   cores: 10 },
]

function calcExpected(fromTier, toTier, rates, regression) {
  if (fromTier >= toTier) return []
  const E = new Array(toTier).fill(0)
  for (let n = 0; n < toTier; n++) {
    const p = Math.min((rates[n]?.success || 1) / 100, 0.9999)
    const c = rates[n]?.cores || 1
    E[n] = (n === 0 || !regression) ? c / p : (c + (1 - p) * E[n - 1]) / p
  }
  return Array.from({ length: toTier - fromTier }, (_, i) => {
    const n = fromTier + i
    return { from: n, to: n + 1, successRate: rates[n]?.success || 0, coresPerAttempt: rates[n]?.cores || 1, expectedCores: E[n] }
  })
}

const p95Attempts = (rate) => {
  const p = Math.min((rate || 1) / 100, 0.9999)
  if (p >= 0.9999) return 1
  return Math.ceil(Math.log(0.05) / Math.log(1 - p))
}

const S = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const INPUT = 'px-2 py-1.5 rounded-lg text-sm text-white outline-none w-full text-center'
const LABEL = 'block text-xs text-gray-400 mb-1'

function ForgeCalculator() {
  const [fromTier,   setFromTier]   = useState(0)
  const [toTier,     setToTier]     = useState(4)
  const [rcPerCore,  setRcPerCore]  = useState(10000)
  const [regression, setRegression] = useState(false)
  const [rates,      setRates]      = useState(DEFAULT_RATES.map(r => ({ ...r })))

  const steps      = calcExpected(fromTier, toTier, rates, regression)
  const totalCores = steps.reduce((s, st) => s + st.expectedCores, 0)
  const worstCores = steps.reduce((s, st) => s + p95Attempts(st.successRate) * st.coresPerAttempt, 0)
  const bestCores  = steps.reduce((s, st) => s + st.coresPerAttempt, 0)

  const setRate = (idx, key, val) =>
    setRates(prev => prev.map((r, i) => i === idx ? { ...r, [key]: parseFloat(val) || 0 } : r))

  return (
    <div className="rounded-xl p-5 space-y-5" style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hammer size={18} style={{ color: '#fbbf24' }} />
          <h2 className="text-base font-bold text-white">Calculadora de Forge</h2>
        </div>
        <button onClick={() => setRates(DEFAULT_RATES.map(r => ({ ...r })))}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
        ><RotateCcw size={12} /> Resetar taxas</button>
      </div>

      {/* Config */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className={LABEL}>Tier inicial</label>
          <select className={INPUT} style={S} value={fromTier}
            onChange={e => { const v = parseInt(e.target.value); setFromTier(v); if (toTier <= v) setToTier(v + 1) }}>
            {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>T{i}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Tier alvo</label>
          <select className={INPUT} style={S} value={toTier}
            onChange={e => { const v = parseInt(e.target.value); setToTier(v); if (fromTier >= v) setFromTier(v - 1) }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(i => <option key={i} value={i}>T{i}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>RC por Exalted Core</label>
          <input type="number" min="0" className={INPUT} style={S}
            value={rcPerCore} onChange={e => setRcPerCore(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="flex flex-col">
          <label className={LABEL}>Falha</label>
          <button onClick={() => setRegression(!regression)}
            className="flex-1 rounded-lg text-xs font-medium px-2"
            style={{
              backgroundColor: regression ? '#7c2d12' : '#14532d',
              border: '1px solid ' + (regression ? '#dc2626' : '#16a34a'),
              color: regression ? '#f87171' : '#4ade80',
            }}
          >{regression ? '⬇ Cai um tier' : '↺ Fica no tier'}</button>
        </div>
      </div>

      {steps.length > 0 ? (
        <>
          {/* Steps table */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #3a3050' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#1a1025' }}>
                  {['Transição', 'Sucesso %', 'Cores/tent.', 'Cores esp.', 'Tent. esp.', 'Custo RC esp.'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map(step => {
                  const tc  = TIER_COLORS[step.to]   ?? TIER_COLORS[0]
                  const tc0 = TIER_COLORS[step.from] ?? TIER_COLORS[0]
                  return (
                    <tr key={step.from} className="border-t" style={{ borderColor: '#3a3050' }}>
                      <td className="px-3 py-2">
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded mr-1" style={{ backgroundColor: tc0.bg, color: tc0.text }}>T{step.from}</span>
                        <span className="text-gray-600 text-xs">→</span>
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded ml-1" style={{ backgroundColor: tc.bg, color: tc.text }}>T{step.to}</span>
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="1" max="100"
                          className="w-14 px-1.5 py-1 rounded text-xs text-white text-center outline-none"
                          style={S}
                          value={rates[step.from].success}
                          onChange={e => setRate(step.from, 'success', e.target.value)}
                        />
                        <span className="text-gray-600 text-xs ml-1">%</span>
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="1"
                          className="w-14 px-1.5 py-1 rounded text-xs text-white text-center outline-none"
                          style={S}
                          value={rates[step.from].cores}
                          onChange={e => setRate(step.from, 'cores', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 font-bold text-yellow-400">{step.expectedCores.toFixed(1)}</td>
                      <td className="px-3 py-2 text-gray-400">{(step.expectedCores / step.coresPerAttempt).toFixed(1)}</td>
                      <td className="px-3 py-2 font-bold" style={{ color: '#f59e0b' }}>{formatRC(step.expectedCores * rcPerCore)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#14532d', border: '1px solid #16a34a' }}>
              <div className="text-xs text-green-400 mb-1">Melhor caso</div>
              <div className="text-lg font-bold text-green-300">{formatNumber(bestCores)} cores</div>
              <div className="text-xs text-green-600 mt-0.5">{formatRC(bestCores * rcPerCore)}</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#1e3a5f', border: '1px solid #2563eb' }}>
              <div className="text-xs text-blue-400 mb-1">Esperado (média)</div>
              <div className="text-lg font-bold text-blue-300">{formatNumber(Math.round(totalCores))} cores</div>
              <div className="text-xs text-blue-600 mt-0.5">{formatRC(totalCores * rcPerCore)}</div>
            </div>
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#7c2d12', border: '1px solid #dc2626' }}>
              <div className="text-xs text-red-400 mb-1">Pior caso (95%)</div>
              <div className="text-lg font-bold text-red-300">{formatNumber(worstCores)} cores</div>
              <div className="text-xs text-red-600 mt-0.5">{formatRC(worstCores * rcPerCore)}</div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Selecione um tier alvo maior que o inicial.</p>
      )}
    </div>
  )
}

export default function ToolsModule() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Ferramentas</h1>
        <p className="text-xs text-gray-500 mt-1">Calculadoras e utilitários</p>
      </div>
      <ForgeCalculator />
    </div>
  )
}
