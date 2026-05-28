import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  generateId,
  getCurrentMonth,
  getLastNMonths,
  buildImageUrl,
  formatRC,
  TIER_COLORS,
  VOCATION_COLORS,
  STATUS_COLORS,
  CATEGORY_FALLBACK,
} from '../utils/helpers'

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/0/)
  })
  it('formats positive value', () => {
    expect(formatCurrency(1.5)).toMatch(/1[,.]50/)
  })
  it('formats large value', () => {
    expect(formatCurrency(1000)).toMatch(/1/)
  })
  it('handles null/undefined gracefully', () => {
    expect(() => formatCurrency(null)).not.toThrow()
    expect(() => formatCurrency(undefined)).not.toThrow()
  })
})

describe('formatNumber', () => {
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
  it('formats integer', () => {
    const result = formatNumber(50000)
    expect(result).toMatch(/50/)
    expect(result).toMatch(/000/)
  })
  it('handles null gracefully', () => {
    expect(() => formatNumber(null)).not.toThrow()
  })
})

describe('formatDate', () => {
  it('returns — for falsy input', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate('')).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })
  it('formats a valid ISO date', () => {
    const result = formatDate('2026-05-28T10:00:00')
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/28/)
  })
})

describe('formatDateTime', () => {
  it('returns — for falsy input', () => {
    expect(formatDateTime(null)).toBe('—')
  })
  it('formats a valid ISO datetime', () => {
    const result = formatDateTime('2026-05-28T10:30:00')
    expect(result).toMatch(/2026/)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})

describe('getCurrentMonth', () => {
  it('returns YYYY-MM format', () => {
    const result = getCurrentMonth()
    expect(result).toMatch(/^\d{4}-\d{2}$/)
  })
  it('matches current year', () => {
    const year = new Date().getFullYear().toString()
    expect(getCurrentMonth()).toContain(year)
  })
})

describe('getLastNMonths', () => {
  it('returns exactly n months', () => {
    expect(getLastNMonths(6)).toHaveLength(6)
    expect(getLastNMonths(1)).toHaveLength(1)
    expect(getLastNMonths(3)).toHaveLength(3)
  })
  it('each entry has key and label', () => {
    const months = getLastNMonths(3)
    months.forEach(m => {
      expect(m).toHaveProperty('key')
      expect(m).toHaveProperty('label')
      expect(m.key).toMatch(/^\d{4}-\d{2}$/)
      expect(typeof m.label).toBe('string')
      expect(m.label.length).toBeGreaterThan(0)
    })
  })
  it('is in chronological order (oldest first)', () => {
    const months = getLastNMonths(6)
    for (let i = 1; i < months.length; i++) {
      expect(months[i].key >= months[i - 1].key).toBe(true)
    }
  })
  it('last entry is current month', () => {
    const months = getLastNMonths(6)
    expect(months[months.length - 1].key).toBe(getCurrentMonth())
  })
})

describe('buildImageUrl', () => {
  it('replaces spaces with underscores', () => {
    expect(buildImageUrl('Falcon Plate')).toBe(
      'https://tibia.fandom.com/wiki/Special:FilePath/Falcon_Plate.gif'
    )
  })
  it('handles single word', () => {
    expect(buildImageUrl('Soulreaper')).toBe(
      'https://tibia.fandom.com/wiki/Special:FilePath/Soulreaper.gif'
    )
  })
  it('handles multiple spaces', () => {
    expect(buildImageUrl('Grand Sanguine Blade')).toBe(
      'https://tibia.fandom.com/wiki/Special:FilePath/Grand_Sanguine_Blade.gif'
    )
  })
  it('always ends with .gif', () => {
    expect(buildImageUrl('Any Item')).toMatch(/\.gif$/)
  })
  it('always starts with the tibia fandom URL', () => {
    expect(buildImageUrl('Any Item')).toMatch(/^https:\/\/tibia\.fandom\.com\/wiki\/Special:FilePath\//)
  })
})

describe('formatRC', () => {
  it('appends RC suffix', () => {
    expect(formatRC(1000)).toMatch(/RC$/)
  })
  it('formats zero', () => {
    expect(formatRC(0)).toMatch(/0/)
    expect(formatRC(0)).toMatch(/RC/)
  })
  it('formats large number with pt-BR separators', () => {
    const result = formatRC(50000)
    expect(result).toMatch(/50/)
    expect(result).toMatch(/RC/)
  })
  it('rounds fractional values', () => {
    expect(formatRC(1000.7)).toMatch(/1\.001 RC|1001 RC/)
  })
  it('handles null/undefined gracefully', () => {
    expect(() => formatRC(null)).not.toThrow()
    expect(formatRC(null)).toMatch(/RC/)
  })
})

describe('TIER_COLORS', () => {
  it('has entries for tiers 0 through 4', () => {
    for (let t = 0; t <= 4; t++) {
      expect(TIER_COLORS[t]).toBeDefined()
      expect(TIER_COLORS[t]).toHaveProperty('bg')
      expect(TIER_COLORS[t]).toHaveProperty('text')
      expect(TIER_COLORS[t]).toHaveProperty('label')
    }
  })
  it('tier 4 is golden (contains amber/yellow hue)', () => {
    expect(TIER_COLORS[4].text).toMatch(/#fbbf24|#f59e0b|gold/i)
  })
  it('tier 0 is gray', () => {
    expect(TIER_COLORS[0].text).toMatch(/#9ca3af|gray/i)
  })
})

describe('VOCATION_COLORS', () => {
  it('has all four RubinOT vocations', () => {
    expect(VOCATION_COLORS).toHaveProperty('Knight')
    expect(VOCATION_COLORS).toHaveProperty('Paladin')
    expect(VOCATION_COLORS).toHaveProperty('Sorcerer')
    expect(VOCATION_COLORS).toHaveProperty('Monk')
  })
  it('does NOT include Druid (RubinOT uses Monk)', () => {
    expect(VOCATION_COLORS).not.toHaveProperty('Druid')
  })
  it('all values are hex color strings', () => {
    Object.values(VOCATION_COLORS).forEach(c => {
      expect(c).toMatch(/^#[0-9a-fA-F]{6}$/)
    })
  })
})

describe('STATUS_COLORS', () => {
  const expectedStatuses = ['disponível', 'reservada', 'em negociação', 'vendida']
  it('covers all account statuses', () => {
    expectedStatuses.forEach(s => {
      expect(STATUS_COLORS[s]).toBeDefined()
      expect(STATUS_COLORS[s]).toHaveProperty('bg')
      expect(STATUS_COLORS[s]).toHaveProperty('text')
    })
  })
})

describe('CATEGORY_FALLBACK', () => {
  const expectedCategories = ['arma', 'armadura', 'acessório', 'montaria', 'outfit', 'misc']
  it('covers all item categories', () => {
    expectedCategories.forEach(cat => {
      expect(CATEGORY_FALLBACK[cat]).toBeDefined()
      expect(typeof CATEGORY_FALLBACK[cat]).toBe('string')
      expect(CATEGORY_FALLBACK[cat].length).toBeGreaterThan(0)
    })
  })
})
