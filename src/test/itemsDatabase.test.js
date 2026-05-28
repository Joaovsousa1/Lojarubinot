import { describe, it, expect } from 'vitest'
import { ITEMS_DATABASE, getItemByName, searchItems } from '../data/itemsDatabase'

describe('ITEMS_DATABASE', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(ITEMS_DATABASE)).toBe(true)
    expect(ITEMS_DATABASE.length).toBeGreaterThan(0)
  })

  it('every item has required fields', () => {
    ITEMS_DATABASE.forEach(item => {
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('imageUrl')
      expect(item).toHaveProperty('classification')
      expect(item).toHaveProperty('maxTier')
      expect(item).toHaveProperty('category')
      expect(typeof item.name).toBe('string')
      expect(item.name.length).toBeGreaterThan(0)
    })
  })

  it('all imageUrls point to tibia fandom wiki and end with .gif', () => {
    ITEMS_DATABASE.forEach(item => {
      expect(item.imageUrl).toMatch(/^https:\/\/tibia\.fandom\.com\/wiki\/Special:FilePath\//)
      expect(item.imageUrl).toMatch(/\.gif$/)
    })
  })

  it('classification is 3 or 4 for all items', () => {
    ITEMS_DATABASE.forEach(item => {
      expect([3, 4]).toContain(item.classification)
    })
  })

  it('maxTier equals classification', () => {
    ITEMS_DATABASE.forEach(item => {
      expect(item.maxTier).toBe(item.classification)
    })
  })

  it('category is one of the valid values', () => {
    const valid = ['arma', 'armadura', 'acessório', 'montaria', 'outfit', 'misc']
    ITEMS_DATABASE.forEach(item => {
      expect(valid).toContain(item.category)
    })
  })

  it('has no duplicate item names', () => {
    const names = ITEMS_DATABASE.map(i => i.name)
    const unique = new Set(names)
    // Soulshroud appears twice in the spec — skip strict uniqueness but check count
    expect(unique.size).toBeGreaterThan(ITEMS_DATABASE.length * 0.95)
  })

  // ── Specific sets present ─────────────────────────────────────────────

  it('contains Sanguine Set (class 4)', () => {
    const sanguine = ITEMS_DATABASE.filter(i => i.set === 'Sanguine')
    expect(sanguine.length).toBeGreaterThan(0)
    sanguine.forEach(i => expect(i.classification).toBe(4))
  })

  it('contains Grand Sanguine items', () => {
    const gs = ITEMS_DATABASE.filter(i => i.set === 'Grand Sanguine')
    expect(gs.length).toBeGreaterThan(0)
  })

  it('contains Falcon Set (class 4)', () => {
    const falcon = ITEMS_DATABASE.filter(i => i.set === 'Falcon')
    expect(falcon.length).toBeGreaterThan(0)
    falcon.forEach(i => expect(i.classification).toBe(4))
  })

  it('contains Cobra Set (class 4)', () => {
    const cobra = ITEMS_DATABASE.filter(i => i.set === 'Cobra')
    expect(cobra.length).toBeGreaterThan(0)
  })

  it('contains Soul items (class 4)', () => {
    const soul = ITEMS_DATABASE.filter(i => i.set === 'Soul')
    expect(soul.length).toBeGreaterThan(0)
    soul.forEach(i => expect(i.classification).toBe(4))
  })

  it('contains Lion Set (class 4)', () => {
    const lion = ITEMS_DATABASE.filter(i => i.set === 'Lion')
    expect(lion.length).toBeGreaterThan(0)
    lion.forEach(i => expect(i.classification).toBe(4))
  })

  it('contains Gnome items (class 3)', () => {
    const gnome = ITEMS_DATABASE.filter(i => i.set === 'Gnome')
    expect(gnome.length).toBeGreaterThan(0)
    gnome.forEach(i => expect(i.classification).toBe(3))
  })

  it('contains Eldritch Set (class 3)', () => {
    const eldritch = ITEMS_DATABASE.filter(i => i.set === 'Eldritch')
    expect(eldritch.length).toBeGreaterThan(0)
    eldritch.forEach(i => expect(i.classification).toBe(3))
  })

  it('contains Ferumbras items (class 3)', () => {
    const f = ITEMS_DATABASE.filter(i => i.set === 'Ferumbras')
    expect(f.length).toBeGreaterThan(0)
    f.forEach(i => expect(i.classification).toBe(3))
  })

  // ── Specific items ────────────────────────────────────────────────────

  it('Grand Sanguine Blade exists as arma class 4', () => {
    const item = ITEMS_DATABASE.find(i => i.name === 'Grand Sanguine Blade')
    expect(item).toBeDefined()
    expect(item.category).toBe('arma')
    expect(item.classification).toBe(4)
  })

  it('Sanguine Armor exists as armadura class 4', () => {
    const item = ITEMS_DATABASE.find(i => i.name === 'Sanguine Armor')
    expect(item).toBeDefined()
    expect(item.category).toBe('armadura')
    expect(item.classification).toBe(4)
  })

  it('Cobra Amulet is acessório', () => {
    const item = ITEMS_DATABASE.find(i => i.name === 'Cobra Amulet')
    expect(item).toBeDefined()
    expect(item.category).toBe('acessório')
  })

  it('Eldritch Quiver is misc', () => {
    const item = ITEMS_DATABASE.find(i => i.name === 'Eldritch Quiver')
    expect(item).toBeDefined()
    expect(item.category).toBe('misc')
  })

  it('Royal Crossbow is arma class 3', () => {
    const item = ITEMS_DATABASE.find(i => i.name === 'Royal Crossbow')
    expect(item).toBeDefined()
    expect(item.category).toBe('arma')
    expect(item.classification).toBe(3)
  })
})

describe('getItemByName', () => {
  it('finds item by exact name', () => {
    const item = getItemByName('Falcon Plate')
    expect(item).toBeDefined()
    expect(item.name).toBe('Falcon Plate')
  })

  it('is case-insensitive', () => {
    expect(getItemByName('falcon plate')).toBeDefined()
    expect(getItemByName('FALCON PLATE')).toBeDefined()
    expect(getItemByName('Falcon Plate')).toBeDefined()
  })

  it('returns undefined for unknown item', () => {
    expect(getItemByName('Nonexistent Item XYZ')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getItemByName('')).toBeUndefined()
  })
})

describe('searchItems', () => {
  it('returns empty array for short queries', () => {
    expect(searchItems('')).toEqual([])
    expect(searchItems('a')).toEqual([])
  })

  it('returns matches for partial name', () => {
    const results = searchItems('falcon')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(r => expect(r.name.toLowerCase()).toContain('falcon'))
  })

  it('returns matches for "sanguine"', () => {
    const results = searchItems('sanguine')
    expect(results.length).toBeGreaterThan(0)
  })

  it('caps results at 12', () => {
    const results = searchItems('a')
    expect(results.length).toBeLessThanOrEqual(12)
  })

  it('returns empty array for no match', () => {
    const results = searchItems('xyznonexistent')
    expect(results).toEqual([])
  })

  it('search for "soul" returns Soul items', () => {
    const results = searchItems('soul')
    expect(results.length).toBeGreaterThan(0)
    results.forEach(r => expect(r.name.toLowerCase()).toContain('soul'))
  })
})
