import React, { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, Layers } from 'lucide-react'
import { TIER_COLORS } from '../../utils/helpers'

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

  const allTiers  = Array.from({ length: 10 }, (_, i) => i + 1)

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

// ─── Módulo principal ────────────────────────────────────────────
export default function ToolsModule() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Ferramentas</h1>
        <p className="text-xs text-gray-500 mt-1">Calculadoras e utilitários</p>
      </div>
      <TierCostCalculator />
    </div>
  )
}
