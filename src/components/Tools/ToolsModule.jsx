import React, { useState } from 'react'
import { Hammer, RotateCcw, ChevronDown, ChevronUp, AlertTriangle, Layers } from 'lucide-react'
import { formatRC, formatNumber, TIER_COLORS } from '../../utils/helpers'

// ─── config global (edite aqui quando o servidor mudar valores) ───
const TIER_COST = {
  1:  55,
  2: 110,
  3: 170,
  4: 300,
  5: 875,
  // 6: ???  ← adicione aqui quando confirmado
}

const FIXED_FEE = {
  4:  80,
  5: 400,
  // 6: ???  ← adicione aqui quando confirmado
}

const MULT_A = 1.5   // taxa da forja (50%)
const MULT_B = 1.35  // markup final (35%)

// ─── lógica de cálculo ───────────────────────────────────────────
function calcularCustoTier(tierAlvo) {
  let soma = 0
  const detalhamentoTiers = []
  for (let t = 1; t <= tierAlvo; t++) {
    if (TIER_COST[t] == null) throw new Error(`Custo do tier ${t} não cadastrado.`)
    soma += TIER_COST[t]
    detalhamentoTiers.push({ tier: t, custo: TIER_COST[t] })
  }
  const passo2 = soma * MULT_A
  const taxaFixa = FIXED_FEE[tierAlvo]
  const taxaConfirmada = taxaFixa != null
  const passo3 = passo2 + (taxaFixa ?? 0)
  const final = passo3 * MULT_B
  return {
    tierAlvo, detalhamentoTiers, soma,
    passo2, taxaFixa: taxaFixa ?? 0, taxaConfirmada,
    passo3, custoFinalKk: final,
    custoFinalGold: final * 1_000_000,
  }
}

// ─── helpers de formatação ───────────────────────────────────────
const fmt    = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 3 })
const fmtGold = (n) => Math.round(n).toLocaleString('pt-BR')

const S    = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const CARD = { backgroundColor: '#1e1630', border: '1px solid #2d2248' }

// ─── Calculadora de Custo de Tier ───────────────────────────────
function TierCostCalculator() {
  const [targetTier,  setTargetTier]  = useState(4)
  const [showSteps,   setShowSteps]   = useState(false)

  const maxTier   = Math.max(...Object.keys(TIER_COST).map(Number))
  const allTiers  = Array.from({ length: maxTier }, (_, i) => i + 1)

  let result = null
  try { result = calcularCustoTier(targetTier) } catch {}

  return (
    <div className="rounded-2xl p-5 space-y-5" style={CARD}>

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl" style={{ backgroundColor: '#1a0f2e', border: '1px solid #3d2570' }}>
          <Layers size={16} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <div className="text-sm font-bold text-white">Calculadora de Custo de Tier</div>
          <div className="text-[11px] text-gray-500">Custo em gold para atingir um tier (T0 → Tn)</div>
        </div>
      </div>

      {/* Seletor de tier */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Selecione o tier alvo</div>
        <div className="flex gap-2">
          {allTiers.map(t => {
            const hasData  = TIER_COST[t] != null
            const tc       = TIER_COLORS[t] ?? TIER_COLORS[0]
            const active   = t === targetTier
            return (
              <button
                key={t}
                onClick={() => hasData && setTargetTier(t)}
                disabled={!hasData}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  backgroundColor: !hasData ? '#0e0a18' : active ? tc.bg : '#130e1e',
                  color: !hasData ? '#2d2248' : active ? tc.text : '#4b5563',
                  border: `1px solid ${!hasData ? '#1a1430' : active ? tc.bg : '#2d2248'}`,
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                  cursor: hasData ? 'pointer' : 'not-allowed',
                }}
              >
                T{t}
              </button>
            )
          })}
        </div>
      </div>

      {result && (
        <>
          {/* Aviso de taxa não confirmada */}
          {!result.taxaConfirmada && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: '#451a0322', border: '1px solid #d9770633' }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b' }} className="shrink-0" />
              <span className="text-xs" style={{ color: '#fbbf24' }}>
                Taxa fixa para T{targetTier} não confirmada — o resultado pode estar impreciso.
              </span>
            </div>
          )}

          {/* Resultado principal */}
          <div className="rounded-2xl p-5 text-center space-y-2"
            style={{ backgroundColor: '#1a0f2e', border: '1px solid #6d28d955' }}>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Custo estimado T0 → T{targetTier}</div>
            <div className="text-4xl font-black" style={{ color: '#c084fc', letterSpacing: '-1px' }}>
              {fmt(result.custoFinalKk)}
              <span className="text-xl ml-1.5 font-bold" style={{ color: '#7c3aed' }}>kk</span>
            </div>
            <div className="text-sm font-semibold" style={{ color: '#6b4fa0' }}>
              {fmtGold(result.custoFinalGold)} gold
            </div>
            {(() => {
              const tc = TIER_COLORS[targetTier] ?? TIER_COLORS[0]
              return (
                <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mt-1"
                  style={{ backgroundColor: tc.bg, color: tc.text }}>
                  T0 → T{targetTier}
                </div>
              )
            })()}
          </div>

          {/* Passo a passo (recolhível) */}
          <div>
            <button
              onClick={() => setShowSteps(s => !s)}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              style={{ backgroundColor: '#130e1e', border: '1px solid #2d2248', color: '#6b7280' }}
            >
              {showSteps ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showSteps ? 'Ocultar passo a passo' : 'Ver passo a passo do cálculo'}
            </button>

            {showSteps && (
              <div className="mt-2 space-y-2">

                {/* Etapa 1 — soma dos tiers */}
                <div className="rounded-xl p-3" style={{ backgroundColor: '#130e1e', border: '1px solid #2d2248' }}>
                  <div className="text-[11px] text-gray-600 mb-2 font-semibold uppercase tracking-wide">
                    Etapa 1 — soma cumulativa dos tiers
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {result.detalhamentoTiers.map(({ tier, custo }, i) => {
                      const tc = TIER_COLORS[tier] ?? TIER_COLORS[0]
                      return (
                        <React.Fragment key={tier}>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                              style={{ backgroundColor: tc.bg, color: tc.text }}>T{tier}</span>
                            <span className="text-xs font-semibold text-gray-300">{custo}kk</span>
                          </div>
                          {i < result.detalhamentoTiers.length - 1 && (
                            <span className="text-gray-700 text-xs">+</span>
                          )}
                        </React.Fragment>
                      )
                    })}
                    <span className="text-gray-600 mx-1 text-xs">=</span>
                    <span className="text-white font-bold text-sm">{fmt(result.soma)}kk</span>
                  </div>
                </div>

                {/* Etapa 2 */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: '#130e1e', border: '1px solid #2d2248' }}>
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-600 font-semibold uppercase tracking-wide">
                      Etapa 2 — taxa da forja (×{MULT_A})
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {fmt(result.soma)}kk × {MULT_A}
                    </div>
                  </div>
                  <span className="text-gray-700 text-xs">→</span>
                  <div className="text-white font-bold">{fmt(result.passo2)}kk</div>
                </div>

                {/* Etapa 3 */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: '#130e1e', border: '1px solid #2d2248' }}>
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-600 font-semibold uppercase tracking-wide">
                      Etapa 3 — taxa fixa do tier {!result.taxaConfirmada && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: '#451a0333', color: '#f59e0b' }}>não confirmada</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {fmt(result.passo2)}kk + {fmt(result.taxaFixa)}kk
                    </div>
                  </div>
                  <span className="text-gray-700 text-xs">→</span>
                  <div className="text-white font-bold">{fmt(result.passo3)}kk</div>
                </div>

                {/* Etapa 4 */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: '#130e1e', border: '1px solid #2d2248' }}>
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-600 font-semibold uppercase tracking-wide">
                      Etapa 4 — markup de mercado (×{MULT_B})
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {fmt(result.passo3)}kk × {MULT_B}
                    </div>
                  </div>
                  <span className="text-gray-700 text-xs">→</span>
                  <div className="font-bold" style={{ color: '#c084fc' }}>{fmt(result.custoFinalKk)}kk</div>
                </div>

              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="px-3 py-2.5 rounded-xl text-xs leading-relaxed"
            style={{ backgroundColor: '#0f0a1a', border: '1px solid #2d1b5e', color: '#6b5fa0' }}>
            Estimativa baseada em fórmula da comunidade. Os multiplicadores (1,5 e 1,35) e as taxas fixas
            podem variar conforme atualizações do servidor RubinOT. Confira os valores atuais no jogo antes
            de tomar decisões.
          </div>
        </>
      )}
    </div>
  )
}

// ─── Calculadora de Forge (probabilística) ──────────────────────
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
          <h2 className="text-base font-bold text-white">Calculadora de Forge (Cores)</h2>
        </div>
        <button onClick={() => setRates(DEFAULT_RATES.map(r => ({ ...r })))}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
        ><RotateCcw size={12} /> Resetar taxas</button>
      </div>

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

// ─── Módulo principal ────────────────────────────────────────────
export default function ToolsModule() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Ferramentas</h1>
        <p className="text-xs text-gray-500 mt-1">Calculadoras e utilitários</p>
      </div>
      <TierCostCalculator />
      <ForgeCalculator />
    </div>
  )
}
