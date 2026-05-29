import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Star, Shield, Zap, Crown, Copy, Search, Megaphone, Check, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatNumber, formatDate, VOCATION_COLORS, VOCATION_OUTFIT, VOCATION_BG, STATUS_COLORS } from '../../utils/helpers'
import { OUTFITS_DATABASE } from '../../data/outfitsDatabase'
import { MOUNTS_DATABASE } from '../../data/mountsDatabase'
import Modal from '../UI/Modal'
import AccountForm from './AccountForm'

const OUTFIT_URL = Object.fromEntries(OUTFITS_DATABASE.map(o => [o.name, o.imageUrl]))
const MOUNT_URL  = Object.fromEntries(
  MOUNTS_DATABASE.filter((m, i, a) => a.findIndex(x => x.name === m.name) === i).map(m => [m.name, m.imageUrl])
)

const VOCATIONS = ['Knight', 'Paladin', 'Sorcerer', 'Monk']
const STATUSES  = ['disponível', 'reservada', 'em negociação', 'vendida']

function VocBadge({ vocation }) {
  const color = VOCATION_COLORS[vocation] ?? '#6b7280'
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: color + '22', color }}>
      {vocation}
    </span>
  )
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] ?? { bg: '#374151', text: '#9ca3af' }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  )
}

function StatChip({ label, value, color }) {
  if (!value) return null
  return (
    <div className="flex flex-col items-center px-2 py-1.5 rounded-lg"
      style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', minWidth: 52 }}>
      <span className="text-[10px] text-gray-500 leading-none mb-0.5">{label}</span>
      <span className="text-xs font-bold leading-none" style={{ color: color ?? '#fff' }}>{formatNumber(value)}</span>
    </div>
  )
}

function SkillRow({ skills = {} }) {
  const voc = [
    { key: 'ml',        label: 'ML',    color: '#a855f7' },
    { key: 'sword',     label: 'Spd',   color: '#60a5fa' },
    { key: 'axe',       label: 'Axe',   color: '#60a5fa' },
    { key: 'dist',      label: 'Dist',  color: '#34d399' },
    { key: 'fist',      label: 'Fist',  color: '#34d399' },
    { key: 'club',      label: 'Club',  color: '#60a5fa' },
    { key: 'shielding', label: 'Shld',  color: '#fbbf24' },
  ].filter(s => skills[s.key] > 0)

  if (voc.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {voc.map(({ key, label, color }) => (
        <div key={key} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
          <span className="text-gray-500">{label}</span>
          <span className="font-bold" style={{ color }}>{skills[key]}</span>
        </div>
      ))}
    </div>
  )
}

function generateSalesText(acc) {
  const lines = []

  lines.push('🔥 CONTA À VENDA 🔥')
  lines.push('')

  if (acc.charName) lines.push(`👤 Personagem: ${acc.charName}`)
  lines.push(`⚔️  Vocação: ${acc.vocation}`)
  lines.push(`📊 Level: ${acc.level}`)
  if (acc.server) lines.push(`🌍 Servidor: ${acc.server}`)
  lines.push('')

  lines.push(`💰 Preço de venda: R$ ${acc.sellPrice?.toFixed(2).replace('.', ',')}`)
  lines.push('')

  const skills = acc.skills ?? {}
  const skillEntries = [
    skills.ml        > 0 && `ML ${skills.ml}`,
    skills.sword     > 0 && `Sword ${skills.sword}`,
    skills.axe       > 0 && `Axe ${skills.axe}`,
    skills.club      > 0 && `Club ${skills.club}`,
    skills.dist      > 0 && `Dist ${skills.dist}`,
    skills.shielding > 0 && `Shield ${skills.shielding}`,
    skills.fist      > 0 && `Fist ${skills.fist}`,
  ].filter(Boolean)
  if (skillEntries.length) {
    lines.push(`🎯 Skills: ${skillEntries.join(' | ')}`)
  }

  const prog = []
  if (acc.charmPoints       > 0) prog.push(`Charm ${acc.charmPoints.toLocaleString('pt-BR')}`)
  if (acc.bosstiaryPoints   > 0) prog.push(`Bosstiary ${acc.bosstiaryPoints.toLocaleString('pt-BR')}`)
  if (acc.huntingTaskPoints > 0) prog.push(`Tasks ${acc.huntingTaskPoints.toLocaleString('pt-BR')}`)
  if (acc.vipDays           > 0) prog.push(`VIP ${acc.vipDays} dias`)
  if (acc.loyaltySkill      > 0) prog.push(`Loyalty ${acc.loyaltySkill}`)
  if (prog.length) lines.push(`✨ Progresso: ${prog.join(' | ')}`)

  if (skillEntries.length || prog.length) lines.push('')

  if (acc.outfits?.length) {
    lines.push(`👘 Outfits (${acc.outfits.length}): ${acc.outfits.join(', ')}`)
  }
  if (acc.mounts?.length) {
    lines.push(`🐴 Montarias (${acc.mounts.length}): ${acc.mounts.join(', ')}`)
  }
  if (acc.notableItems?.length) {
    lines.push(`🗡️  Itens notáveis: ${acc.notableItems.join(', ')}`)
  }
  if (acc.outfits?.length || acc.mounts?.length || acc.notableItems?.length) lines.push('')

  if (acc.notes) {
    lines.push(`📝 Obs: ${acc.notes}`)
    lines.push('')
  }

  lines.push('📩 Entre em contato para mais informações!')
  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━')
  lines.push('🌐 MinhaLojaRubinot')
  lines.push('minhalojarubinot.vercel.app')

  return lines.join('\n')
}

function SalesTextModal({ acc, onClose }) {
  const [copied, setCopied] = useState(false)
  const text = useMemo(() => generateSalesText(acc), [acc])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, backgroundColor: 'rgba(0,0,0,0.75)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 520, maxHeight: '90vh',
        backgroundColor: '#1c1530',
        border: '1px solid #7c3aed',
        borderRadius: 20,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 60px #3b076488',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #3a3050' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#c084fc' }}>
            📣 Texto de Anúncio — {acc.charName || `${acc.vocation} Lv${acc.level}`}
          </span>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, lineHeight: 1 }}
          ><X size={18} /></button>
        </div>

        {/* Text area */}
        <textarea
          readOnly
          value={text}
          style={{
            flex: 1, resize: 'none', padding: '16px 20px',
            backgroundColor: '#0e0919', color: '#e5e7eb',
            fontSize: 13, lineHeight: 1.7, fontFamily: 'monospace',
            border: 'none', outline: 'none', overflowY: 'auto',
            minHeight: 200,
          }}
        />

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #3a3050', display: 'flex', gap: 10 }}>
          <button onClick={handleCopy}
            style={{
              flex: 1, padding: '9px 0', borderRadius: 10, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', border: 'none', transition: 'background 0.2s',
              backgroundColor: copied ? '#14532d' : '#7c3aed',
              color: copied ? '#4ade80' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar texto</>}
          </button>
          <button onClick={onClose}
            style={{
              padding: '9px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
              backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af',
            }}
          >Fechar</button>
        </div>
      </div>
    </div>
  )
}

function AccountCard({ acc, onEdit, onDelete, onClone, onAnnounce }) {
  const [outfitIdx, setOutfitIdx] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)
  const profit = acc.sellPrice - acc.buyPrice
  const bg = VOCATION_BG[acc.vocation] ?? 'linear-gradient(135deg, #1a1025 0%, #3b0764 100%)'
  const vColor = VOCATION_COLORS[acc.vocation] ?? '#6b7280'

  const hasSkills = acc.skills && Object.values(acc.skills).some(v => v > 0)
  const hasProgress = acc.charmPoints || acc.bosstiaryPoints || acc.huntingTaskPoints || acc.vipDays || acc.loyaltySkill

  // Outfits com imagem disponível
  const outfitNames = acc.outfits ?? []
  const outfitsWithUrl = outfitNames
    .map(name => ({ name, url: OUTFIT_URL[name] }))
    .filter(o => o.url)

  const selected = outfitsWithUrl[outfitIdx] ?? null
  const displayUrl = selected?.url ?? VOCATION_OUTFIT[acc.vocation]
  const displayName = selected?.name ?? acc.vocation

  return (
    <div className="rounded-xl overflow-hidden flex flex-col transition-shadow duration-200"
      style={{
        backgroundColor: '#2a2035',
        border: `1px solid ${vColor}44`,
        boxShadow: `0 4px 24px ${vColor}11`,
      }}>

      {/* Header */}
      {acc.screenshot
        ? <img src={acc.screenshot} alt="char" className="w-full h-36 object-cover" />
        : (
          <div className="relative">
            {/* Outfit display */}
            <div
              className="h-36 flex items-center justify-center relative overflow-hidden"
              style={{ background: bg, cursor: outfitsWithUrl.length > 0 ? 'pointer' : 'default' }}
              onClick={() => outfitsWithUrl.length > 0 && setPickerOpen(o => !o)}
              title={outfitsWithUrl.length > 0 ? 'Clique para selecionar outfit' : undefined}
            >
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, #ffffff 0%, transparent 60%)' }} />
              {displayUrl && (
                <img src={displayUrl} alt={displayName}
                  className="h-28 w-auto relative z-10"
                  style={{ imageRendering: 'pixelated' }}
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              )}
              <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#00000066', color: vColor }}>
                Lv {acc.level}
              </span>
              {outfitsWithUrl.length > 0 && (
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#00000066', color: '#ffffff99' }}>
                  {displayName}
                </span>
              )}
              {outfitsWithUrl.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  {outfitsWithUrl.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{ backgroundColor: i === outfitIdx ? '#fff' : '#ffffff44' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Outfit picker panel */}
            {pickerOpen && outfitsWithUrl.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 p-2 shadow-2xl"
                style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', borderTop: 'none' }}>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 px-1">Selecionar outfit</div>
                <div className="flex flex-wrap gap-1.5">
                  {outfitsWithUrl.map((o, i) => (
                    <button
                      key={o.name} type="button"
                      onClick={() => { setOutfitIdx(i); setPickerOpen(false) }}
                      className="flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all"
                      style={{
                        backgroundColor: i === outfitIdx ? '#7c3aed33' : '#2a2035',
                        border: `1px solid ${i === outfitIdx ? '#7c3aed' : '#3a3050'}`,
                        minWidth: 52,
                      }}
                      title={o.name}
                    >
                      <img src={o.url} alt={o.name}
                        className="w-10 h-10"
                        style={{ imageRendering: 'pixelated' }}
                        onError={e => { e.currentTarget.style.display = 'none' }} />
                      <span className="text-[9px] text-gray-400 leading-tight text-center max-w-[52px] truncate">
                        {o.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }

      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Name + server + badges */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              {acc.charName && (
                <div className="text-white font-bold text-sm leading-tight">{acc.charName}</div>
              )}
              <div className="text-gray-500 text-xs">{acc.server}</div>
            </div>
            <StatusBadge status={acc.status} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <VocBadge vocation={acc.vocation} />
            {!acc.charName && (
              <span className="text-gray-400 text-xs font-semibold">Lv {acc.level}</span>
            )}
          </div>
        </div>

        {/* Skills */}
        {hasSkills && <SkillRow skills={acc.skills} />}

        {/* Progression */}
        {hasProgress && (
          <div className="flex flex-wrap gap-1.5">
            {acc.charmPoints       > 0 && <StatChip label="Charm"    value={acc.charmPoints}       color="#f472b6" />}
            {acc.bosstiaryPoints   > 0 && <StatChip label="Boss"     value={acc.bosstiaryPoints}   color="#fb923c" />}
            {acc.huntingTaskPoints > 0 && <StatChip label="Tasks"    value={acc.huntingTaskPoints} color="#34d399" />}
            {acc.vipDays           > 0 && <StatChip label="VIP dias" value={acc.vipDays}           color="#fbbf24" />}
            {acc.loyaltySkill      > 0 && <StatChip label="Loyalty"  value={acc.loyaltySkill}      color="#c084fc" />}
          </div>
        )}

        {/* Outfits */}
        {acc.outfits?.length > 0 && (
          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Outfits</div>
            <div className="flex flex-wrap gap-1">
              {acc.outfits.slice(0, 6).map((name, i) => {
                const url = OUTFIT_URL[name]
                return (
                  <div key={i} title={name}
                    className="relative w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                    {url
                      ? <img src={url} alt={name} className="w-9 h-9"
                          style={{ imageRendering: 'pixelated' }}
                          onError={e => { e.currentTarget.style.display = 'none' }} />
                      : <span className="text-[10px] text-gray-600 text-center leading-tight px-0.5">{name.split(' ')[0]}</span>
                    }
                  </div>
                )
              })}
              {acc.outfits.length > 6 && (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs text-gray-500"
                  style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                  +{acc.outfits.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mounts */}
        {acc.mounts?.length > 0 && (
          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Montarias</div>
            <div className="flex flex-wrap gap-1">
              {acc.mounts.slice(0, 6).map((name, i) => {
                const url = MOUNT_URL[name]
                return (
                  <div key={i} title={name}
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                    {url
                      ? <img src={url} alt={name} className="w-9 h-9"
                          style={{ imageRendering: 'pixelated' }}
                          onError={e => { e.currentTarget.style.display = 'none' }} />
                      : <span className="text-[10px] text-gray-600 text-center leading-tight px-0.5">{name.split(' ')[0]}</span>
                    }
                  </div>
                )
              })}
              {acc.mounts.length > 6 && (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs text-gray-500"
                  style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                  +{acc.mounts.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notable items */}
        {acc.notableItems?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {acc.notableItems.slice(0, 5).map((it, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded text-[11px]"
                style={{ backgroundColor: '#1a1025', color: '#9ca3af', border: '1px solid #3a3050' }}>{it}</span>
            ))}
            {acc.notableItems.length > 5 && (
              <span className="text-xs text-gray-600">+{acc.notableItems.length - 5}</span>
            )}
          </div>
        )}

        {acc.notes && (
          <div className="text-xs text-gray-500 italic">{acc.notes}</div>
        )}

        {/* Price section */}
        <div className="rounded-lg px-3 py-2 mt-auto" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-0.5">
              <div className="text-gray-500 text-[10px]">Compra</div>
              <div className="text-gray-300 font-medium">{formatCurrency(acc.buyPrice)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Lucro</div>
              <div className="font-bold text-sm" style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }}>
                {formatCurrency(profit)}
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <div className="text-gray-500 text-[10px]">Venda</div>
              <div className="font-bold text-white">{formatCurrency(acc.sellPrice)}</div>
            </div>
          </div>
          {acc.dateSold && (
            <div className="text-[10px] text-gray-600 text-center mt-1">Vendida em {formatDate(acc.dateSold)}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: '#3b0764', border: '1px solid #6d28d9', color: '#c084fc' }}
          ><Pencil size={12} /> Editar</button>
          <button onClick={onAnnounce} title="Gerar texto de anúncio"
            className="py-1.5 px-3 rounded-lg text-xs transition-colors"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#f59e0b' }}
          ><Megaphone size={12} /></button>
          <button onClick={onClone} title="Duplicar conta"
            className="py-1.5 px-3 rounded-lg text-xs transition-colors"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#60a5fa' }}
          ><Copy size={12} /></button>
          <button onClick={onDelete}
            className="py-1.5 px-3 rounded-lg text-xs transition-colors"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#ef4444' }}
          ><Trash2 size={12} /></button>
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { value: 'level-desc',  label: 'Level ↓' },
  { value: 'level-asc',  label: 'Level ↑' },
  { value: 'sell-desc',  label: 'Venda ↓' },
  { value: 'sell-asc',   label: 'Venda ↑' },
  { value: 'profit-desc', label: 'Lucro ↓' },
  { value: 'profit-asc', label: 'Lucro ↑' },
]

export default function AccountsModule() {
  const { accounts, settings, addAccount, updateAccount, deleteAccount } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [announcing, setAnnouncing] = useState(null)
  const [filters, setFilters] = useState({ vocation: '', server: '', status: '' })
  const [search, setSearch] = useState('')
  const [sortVal, setSortVal] = useState('level-desc')

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const handleClone = (acc) => {
    addAccount({
      ...acc,
      charName: acc.charName ? acc.charName + ' (cópia)' : '',
      status: 'disponível',
      dateSold: null,
      dateEntry: new Date().toISOString(),
    })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return accounts
      .filter(a => {
        if (filters.vocation && a.vocation !== filters.vocation) return false
        if (filters.server && a.server !== filters.server) return false
        if (filters.status && a.status !== filters.status) return false
        if (q) {
          const haystack = [
            a.charName, a.vocation, a.server,
            ...(a.notableItems ?? []),
          ].join(' ').toLowerCase()
          if (!haystack.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => {
        const [key, dir] = sortVal.split('-')
        const mul = dir === 'asc' ? 1 : -1
        if (key === 'level')  return mul * (a.level - b.level)
        if (key === 'sell')   return mul * (a.sellPrice - b.sellPrice)
        if (key === 'profit') return mul * ((a.sellPrice - a.buyPrice) - (b.sellPrice - b.buyPrice))
        return 0
      })
  }, [accounts, filters, search, sortVal])

  const SELECT = 'px-3 py-2 rounded-lg text-sm text-white'
  const SELECT_STYLE = { backgroundColor: '#2a2035', border: '1px solid #3a3050' }

  const stats = {
    available:   accounts.filter(a => a.status === 'disponível').length,
    negotiating: accounts.filter(a => a.status === 'em negociação').length,
    sold:        accounts.filter(a => a.status === 'vendida').length,
    totalProfit: accounts.filter(a => a.status === 'vendida')
      .reduce((s, a) => s + (a.sellPrice - a.buyPrice), 0),
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.available} disponíveis · {stats.negotiating} em negociação · {stats.sold} vendidas · lucro total {formatCurrency(stats.totalProfit)}
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#7c3aed' }}
        ><Plus size={16} /> Nova conta</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text" value={search} placeholder="Buscar por nome, vocação, item..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm text-white outline-none"
            style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050' }}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={SELECT} style={SELECT_STYLE} value={filters.vocation} onChange={e => setFilter('vocation', e.target.value)}>
          <option value="">Todas vocações</option>
          {VOCATIONS.map(v => <option key={v}>{v}</option>)}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={filters.server} onChange={e => setFilter('server', e.target.value)}>
          <option value="">Todos servidores</option>
          {settings.servers.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={filters.status} onChange={e => setFilter('status', e.target.value)}>
          <option value="">Todos status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className={SELECT} style={SELECT_STYLE} value={sortVal} onChange={e => setSortVal(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">Nenhuma conta encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(acc => (
            <AccountCard
              key={acc.id}
              acc={acc}
              onEdit={() => setEditing(acc)}
              onClone={() => handleClone(acc)}
              onAnnounce={() => setAnnouncing(acc)}
              onDelete={() => { if (confirm(`Excluir conta ${acc.charName || acc.vocation + ' Lv' + acc.level}?`)) deleteAccount(acc.id) }}
            />
          ))}
        </div>
      )}

      {showForm && (
        <Modal title="Adicionar conta" onClose={() => setShowForm(false)} wide>
          <AccountForm
            servers={settings.servers}
            onSubmit={(data) => { addAccount(data); setShowForm(false) }}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title={`Editar — ${editing.charName || editing.vocation + ' Lv' + editing.level}`} onClose={() => setEditing(null)} wide>
          <AccountForm
            initial={editing}
            servers={settings.servers}
            onSubmit={(data) => { updateAccount(editing.id, data); setEditing(null) }}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}

      {announcing && (
        <SalesTextModal acc={announcing} onClose={() => setAnnouncing(null)} />
      )}
    </div>
  )
}
