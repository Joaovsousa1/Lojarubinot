const W = 'https://tibia.fandom.com/wiki/Special:FilePath/'
const m = (name, file) => ({ name, imageUrl: W + 'Mount_' + file + '.gif' })
// Algumas montarias reaproveitam o sprite da criatura e nao tem um arquivo "Mount_*" proprio na wiki
const m0 = (name, file) => ({ name, imageUrl: W + file + '.gif' })

const BASE_MOUNTS = [
  // ── Store Mounts ──────────────────────────────────────────────────────────
  m('Blazebringer',         'Blazebringer'),
  m('Blazewing',            'Blazewing'),
  m('Floating Operator',    'Floating_Operator'),
  m('Stone Rhino',          'Stone_Rhino'),
  m('Tiger Slug',           'Tiger_Slug'),
  m('Shadow Draptor',       'Shadow_Draptor'),
  m('Bright Draptor',       'Bright_Draptor'),
  m('Golden Dragonfly',     'Golden_Dragonfly'),
  m('Skeleton Horse',       'Skeleton_Horse'),
  m('Twilight Wanderer',    'Twilight_Wanderer'),
  m('Crystal Wolf',         'Crystal_Wolf'),
  m('Neon Sparkid',         'Neon_Sparkid'),
  m('Lancer Beetle',        'Lancer_Beetle'),
  m('Rusty Iron Golem',     'Rusty_Iron_Golem'),
  m('Phantasmal Jade',      'Phantasmal_Jade'),
  m('Dark Warlord',         'Dark_Warlord'),
  m('Verdant Warlord',      'Verdant_Warlord'),

  // ── Quest / Event Mounts ─────────────────────────────────────────────────
  m('Dragonling',           'Dragonling'),
  m('Draptor',              'Draptor'),
  m('Ivory Fang',           'Ivory_Fang'),
  m('Jade Fang',            'Jade_Fang'),
  m('Midnight Panther',     'Midnight_Panther'),
  m('Sanguine Frog',        'Sanguine_Frog'),
  m('Wolpertinger',         'Wolpertinger'),
  m('Gnarlhound',           'Gnarlhound'),
  m('Titanica',             'Titanica'),
  m('Rift Runner',          'Rift_Runner'),
  m('Crimson Ray',          'Crimson_Ray'),
  m('Battle Badger',        'Battle_Badger'),
  m('Festive Mammoth',      'Festive_Mammoth'),
  m('Netherwing',           'Netherwing'),
  m('Neon Jellyfish',       'Neon_Jellyfish'),
  m('Gloom Widow',          'Gloom_Widow'),
  m('Armoured War Horse',   'Armoured_War_Horse'),
  m('Doombringer',          'Doombringer'),
  m('Raging Bull',          'Raging_Bull'),
  m('Snow Pelt',            'Snow_Pelt'),
  m('Sea Devil',            'Sea_Devil'),
  m('Stampor',              'Stampor'),
  m('Undead Warhorse',      'Undead_Warhorse'),
  m('Vortex Spider',        'Vortex_Spider'),
  m('Emerald Raven',        'Emerald_Raven'),
  m('Demon Backpack',       'Demon_Backpack'),
  m('Scorpion King',        'Scorpion_King'),
  m('Shadow Draptor',       'Shadow_Draptor'),
  m('Azure Frog',           'Azure_Frog'),
  m('Flying Divan',         'Flying_Divan'),
  m('Plumfish',             'Plumfish'),
  m('Wobbly Merchant',      'Wobbly_Merchant'),
  m('Manta Ray',            'Manta_Ray'),
  m('Jungle Tiger',         'Jungle_Tiger'),
  m('Sandstone Scorpion',   'Sandstone_Scorpion'),
  m('Deepling Tyrant',      'Deepling_Tyrant'),
  m('Gnarlhound',           'Gnarlhound'),
  m('Electric Surge',       'Electric_Surge'),
  m('Tamed Panda',          'Tamed_Panda'),
  m('Void Watcher',         'Void_Watcher'),
  m('Ironblight',           'Ironblight'),
  m('Cinderhoof',           'Cinderhoof'),
  m('Boar',                 'Boar'),
  m('Dawnfire Asura',       'Dawnfire_Asura'),
  m('Terror Bird',          'Terror_Bird'),
  m('Phantasmal Fiend',     'Phantasmal_Fiend'),
  m('Cerberus',             'Cerberus'),
  m('Carpacosaurus',        'Carpacosaurus'),
  m('Steelbeak',            'Steelbeak'),
  m('Mireweed',             'Mireweed'),
  m('Bright Goldhound',     'Bright_Goldhound'),
  m('Dark Goldhound',       'Dark_Goldhound'),
  m('Chained Fury',         'Chained_Fury'),
  m('Rampaging Seacrest',   'Rampaging_Seacrest'),
  m('Coral Seahorse',       'Coral_Seahorse'),
  m('Cold Star',            'Cold_Star'),
  m('Frost Flower Asura',   'Frost_Flower_Asura'),
  m('Magma Crawler',        'Magma_Crawler'),
  m('Ancient Scarab',       'Ancient_Scarab'),
  m('Sparkling Seahorse',   'Sparkling_Seahorse'),
  m('Nether Hound',         'Nether_Hound'),
  m('Flaming Wrath',        'Flaming_Wrath'),
  m('Ice Witch',            'Ice_Witch'),
  m('Dawnfire Asura',       'Dawnfire_Asura'),
  m0('Mutated Abomination', 'Mutated_Abomination'),
  m0('Soul Phoenix',        'Soul_Phoenix'),
  m0('Krakoloss',           'Krakoloss'),
  m0('Widow Queen',         'Widow_Queen'),
]

// Exclusivas do RubinOT (não existem no Tibia base) — usadas pra destacar
// montarias raras/de passe/evento na hora de anunciar uma conta.
const CUSTOM_MOUNTS = [
  { name: 'Alba Vulpes',          imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/alba-vulpes.gif' },
  { name: 'Arcane Stonehorn',     imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/arcane-stonehorn.gif' },
  { name: 'Astral Stonehorn',     imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/astral-stonehorn.gif' },
  { name: 'Celestial Panther',    imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/celestial-panther.apng' },
  { name: 'Chaotic Skull',        imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/chaotic-skull.gif' },
  { name: 'Crimson Stonehorn',    imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/crimson-stonehorn.gif' },
  { name: 'Dark Horse',           imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/dark-horse.gif' },
  { name: 'Emberwyrm',            imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/emberwyrm.gif' },
  { name: 'Frostlight Sleight',   imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/frostlight-sleight.gif' },
  { name: 'Frozen Vulpes',        imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/frozen-vulpes.apng' },
  { name: 'Grimfeather',          imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/grimfeather.gif' },
  { name: 'Infernal Frostscale',  imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/infernal-frostscale.apng' },
  { name: 'Infernal Stonehorn',   imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/infernal-stonehorn.gif' },
  { name: 'Light Horse',          imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/light-horse.gif' },
  { name: 'Midnight Cosmostag',   imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/midnight-cosmostag.apng' },
  { name: 'Moonrocket',           imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/moonrocket.png' },
  { name: 'Mystic Stonehorn',     imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/mystic-stonehorn.gif' },
  { name: 'Radiant Bell',         imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/radiant-bell.gif' },
  { name: 'Radiant Stonehorn',    imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/radiant-stonehorn.gif' },
  { name: 'Rubini Skull',         imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/rubini-skull.gif' },
  { name: 'Rudolph',              imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/rudolph.gif' },
  { name: 'Starlight Cosmostag',  imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/starlight-cosmostag.apng' },
  { name: 'Tenebris Vulpes',      imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/tenebris-vulpes.gif' },
  { name: 'Tombmarch',            imageUrl: 'https://wiki.rubinot.com/mounts/rubinot/tombmarch.gif' },
]

export const MOUNTS_DATABASE = [...BASE_MOUNTS, ...CUSTOM_MOUNTS]
export const CUSTOM_MOUNT_NAMES = new Set(CUSTOM_MOUNTS.map(m => m.name))

export const searchMounts = (query) => {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const seen = new Set()
  return MOUNTS_DATABASE.filter(m => {
    if (seen.has(m.name)) return false
    seen.add(m.name)
    return m.name.toLowerCase().includes(q)
  }).slice(0, 15)
}
