export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

export const formatNumber = (n) =>
  new Intl.NumberFormat('pt-BR').format(n ?? 0)

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('pt-BR') : '—'

export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString('pt-BR') : '—'

export const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const getLastNMonths = (n) => {
  const result = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    result.push({
      key: `${year}-${month}`,
      label: d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '') +
        ' ' + year,
    })
  }
  return result
}

export const TIER_COLORS = {
  0:  { bg: '#374151', text: '#9ca3af', label: 'T0'  },
  1:  { bg: '#14532d', text: '#4ade80', label: 'T1'  },
  2:  { bg: '#1e3a5f', text: '#60a5fa', label: 'T2'  },
  3:  { bg: '#3b0764', text: '#c084fc', label: 'T3'  },
  4:  { bg: '#78350f', text: '#fbbf24', label: 'T4'  },
  5:  { bg: '#7c2d12', text: '#fb923c', label: 'T5'  },
  6:  { bg: '#881337', text: '#fb7185', label: 'T6'  },
  7:  { bg: '#831843', text: '#f472b6', label: 'T7'  },
  8:  { bg: '#4a1d96', text: '#a78bfa', label: 'T8'  },
  9:  { bg: '#164e63', text: '#22d3ee', label: 'T9'  },
  10: { bg: '#713f12', text: '#fef08a', label: 'T10' },
}

export const VOCATION_COLORS = {
  Knight: '#3b82f6',
  Paladin: '#f59e0b',
  Sorcerer: '#a855f7',
  Druid: '#0d9488',
  Monk: '#22c55e',
}

const W = 'https://tibia.fandom.com/wiki/Special:FilePath/'
export const VOCATION_OUTFIT = {
  Knight:   W + 'Outfit_Knight_Male_Addon_3.gif',
  Paladin:  W + 'Outfit_Paladin_Male_Addon_3.gif',
  Sorcerer: W + 'Outfit_Master_Sorcerer_Male_Addon_3.gif',
  Druid:    W + 'Outfit_Druid_Male_Addon_3.gif',
  Monk:     W + 'Outfit_Druid_Male_Addon_3.gif',
}

export const VOCATION_BG = {
  Knight:   'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
  Paladin:  'linear-gradient(135deg, #78350f 0%, #0f172a 100%)',
  Sorcerer: 'linear-gradient(135deg, #3b0764 0%, #0f172a 100%)',
  Druid:    'linear-gradient(135deg, #134e4a 0%, #0f172a 100%)',
  Monk:     'linear-gradient(135deg, #14532d 0%, #0f172a 100%)',
}

export const STATUS_COLORS = {
  disponível: { bg: '#14532d', text: '#4ade80' },
  reservada: { bg: '#713f12', text: '#fbbf24' },
  'em negociação': { bg: '#1e3a5f', text: '#60a5fa' },
  vendida: { bg: '#374151', text: '#9ca3af' },
}

export const CATEGORY_FALLBACK = {
  arma: '⚔️',
  armadura: '🛡️',
  acessório: '💍',
  montaria: '🐴',
  outfit: '👘',
  misc: '📦',
}

export const buildImageUrl = (name) => {
  const encoded = name.replace(/ /g, '_')
  return `https://tibia.fandom.com/wiki/Special:FilePath/${encoded}.gif`
}

export const formatRC = (v) =>
  `${new Intl.NumberFormat('pt-BR').format(Math.round(v ?? 0))} RC`

// Lucro real de uma venda: converte RC para R$ usando a taxa e soma ao PIX
export const realSaleProfit = (sale, rcRate = 0.087) =>
  (sale.profitPIX || 0) + (sale.profitRC || 0) * rcRate

export const LOYALTY_TIERS = [
  { pts: 70, bonus: 10, title: 'Enlightened of RubinOT' },
  { pts: 56, bonus: 9,  title: 'Savant of RubinOT' },
  { pts: 42, bonus: 8,  title: 'Sage of RubinOT' },
  { pts: 30, bonus: 7,  title: 'Guardian of RubinOT' },
  { pts: 21, bonus: 6,  title: 'Keeper of RubinOT' },
  { pts: 15, bonus: 5,  title: 'Warrior of RubinOT' },
  { pts:  9, bonus: 4,  title: 'Squire of RubinOT' },
  { pts:  6, bonus: 3,  title: 'Warden of RubinOT' },
  { pts:  3, bonus: 2,  title: 'Steward of RubinOT' },
  { pts:  1, bonus: 1,  title: 'Sentinel of RubinOT' },
]

export function getLoyaltyInfo(pts) {
  const p = pts ?? 0
  for (const tier of LOYALTY_TIERS) {
    if (p >= tier.pts) return tier
  }
  return { pts: 0, bonus: 0, title: 'Scout of RubinOT' }
}

export const SET_COLORS = {
  'Sanguine':       { primary: '#dc2626', secondary: '#7f1d1d', accent: '#fca5a5', glow: '#dc262644' },
  'Grand Sanguine': { primary: '#b91c1c', secondary: '#7f1d1d', accent: '#fca5a5', glow: '#b91c1c44' },
  'Falcon':         { primary: '#d97706', secondary: '#78350f', accent: '#fde68a', glow: '#d9770644' },
  'Cobra':          { primary: '#16a34a', secondary: '#14532d', accent: '#86efac', glow: '#16a34a44' },
  'Soul':           { primary: '#9333ea', secondary: '#3b0764', accent: '#c4b5fd', glow: '#9333ea44' },
  'Lion':           { primary: '#ea580c', secondary: '#7c2d12', accent: '#fdba74', glow: '#ea580c44' },
  'Gnome':          { primary: '#0284c7', secondary: '#0c4a6e', accent: '#7dd3fc', glow: '#0284c744' },
  'Eldritch':       { primary: '#0d9488', secondary: '#134e4a', accent: '#5eead4', glow: '#0d948844' },
  'Ferumbras':      { primary: '#7e22ce', secondary: '#3b0764', accent: '#d8b4fe', glow: '#7e22ce44' },
  'Magician':       { primary: '#6366f1', secondary: '#1e1b4b', accent: '#a5b4fc', glow: '#6366f144' },
  'Primal':         { primary: '#06b6d4', secondary: '#0c4a6e', accent: '#67e8f9', glow: '#06b6d444' },
  'Spiritthorn':    { primary: '#be123c', secondary: '#4c0519', accent: '#fda4af', glow: '#be123c44' },
  'Stag':           { primary: '#65a30d', secondary: '#1a2e05', accent: '#bef264', glow: '#65a30d44' },
  'Ethereal':       { primary: '#38bdf8', secondary: '#0c4a6e', accent: '#e0f2fe', glow: '#38bdf844' },
  'Arcanomancer':   { primary: '#818cf8', secondary: '#1e1b4b', accent: '#c7d2fe', glow: '#818cf844' },
  'Arboreal':       { primary: '#34d399', secondary: '#064e3b', accent: '#d1fae5', glow: '#34d39944' },
  'Outros':         { primary: '#6b7280', secondary: '#374151', accent: '#d1d5db', glow: '#6b728044' },
}
