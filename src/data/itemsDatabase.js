const W = 'https://tibia.fandom.com/wiki/Special:FilePath/'

const item = (name, imageFile, classification, category, set = '') => ({
  name,
  imageUrl: W + imageFile + '.gif',
  classification,
  maxTier: classification,
  category,
  set,
})

export const ITEMS_DATABASE = [
  // ── SANGUINE SET (Class 4) ─────────────────────────────────────────────
  item('Sanguine Armor',     'Sanguine_Armor',     4, 'armadura', 'Sanguine'),
  item('Sanguine Legs',      'Sanguine_Legs',      4, 'armadura', 'Sanguine'),
  item('Sanguine Greaves',   'Sanguine_Greaves',   4, 'armadura', 'Sanguine'),
  item('Sanguine Galoshes',  'Sanguine_Galoshes',  4, 'armadura', 'Sanguine'),
  item('Sanguine Boots',     'Sanguine_Boots',     4, 'armadura', 'Sanguine'),
  item('Sanguine Trousers',  'Sanguine_Trousers',  4, 'armadura', 'Sanguine'),
  item('Sanguine Coil',      'Sanguine_Coil',      4, 'arma',     'Sanguine'),
  item('Sanguine Rod',       'Sanguine_Rod',       4, 'arma',     'Sanguine'),
  item('Sanguine Bludgeon',  'Sanguine_Bludgeon',  4, 'arma',     'Sanguine'),
  item('Sanguine Cudgel',    'Sanguine_Cudgel',    4, 'arma',     'Sanguine'),
  item('Sanguine Battleaxe', 'Sanguine_Battleaxe', 4, 'arma',     'Sanguine'),
  item('Sanguine Hatchet',   'Sanguine_Hatchet',   4, 'arma',     'Sanguine'),
  item('Sanguine Razor',     'Sanguine_Razor',     4, 'arma',     'Sanguine'),
  item('Sanguine Blade',     'Sanguine_Blade',     4, 'arma',     'Sanguine'),
  item('Sanguine Bow',       'Sanguine_Bow',       4, 'arma',     'Sanguine'),
  item('Sanguine Crossbow',  'Sanguine_Crossbow',  4, 'arma',     'Sanguine'),
  item('Sanguine Claws',     'Sanguine_Claws',     4, 'arma',     'Sanguine'),

  // ── GRAND SANGUINE SET (Class 4) ──────────────────────────────────────
  item('Grand Sanguine Coil',       'Grand_Sanguine_Coil',       4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Rod',        'Grand_Sanguine_Rod',        4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Bludgeon',   'Grand_Sanguine_Bludgeon',   4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Cudgel',     'Grand_Sanguine_Cudgel',     4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Battleaxe',  'Grand_Sanguine_Battleaxe',  4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Hatchet',    'Grand_Sanguine_Hatchet',    4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Razor',      'Grand_Sanguine_Razor',      4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Blade',      'Grand_Sanguine_Blade',      4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Bow',        'Grand_Sanguine_Bow',        4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Crossbow',   'Grand_Sanguine_Crossbow',   4, 'arma', 'Grand Sanguine'),
  item('Grand Sanguine Claws',      'Grand_Sanguine_Claws',      4, 'arma', 'Grand Sanguine'),

  // ── FALCON SET (Class 4) ───────────────────────────────────────────────
  item('Falcon Coif',       'Falcon_Coif',       4, 'armadura', 'Falcon'),
  item('Falcon Circlet',    'Falcon_Circlet',    4, 'armadura', 'Falcon'),
  item('Falcon Plate',      'Falcon_Plate',      4, 'armadura', 'Falcon'),
  item('Falcon Greaves',    'Falcon_Greaves',    4, 'armadura', 'Falcon'),
  item('Falcon Boots',      'Falcon_Boots',      4, 'armadura', 'Falcon'),
  item('Falcon Shield',     'Falcon_Shield',     4, 'armadura', 'Falcon'),
  item('Falcon Escutcheon', 'Falcon_Escutcheon', 4, 'armadura', 'Falcon'),
  item('Falcon Rod',        'Falcon_Rod',        4, 'arma',     'Falcon'),
  item('Falcon Wand',       'Falcon_Wand',       4, 'arma',     'Falcon'),
  item('Falcon Longsword',  'Falcon_Longsword',  4, 'arma',     'Falcon'),
  item('Falcon Mace',       'Falcon_Mace',       4, 'arma',     'Falcon'),
  item('Falcon Battleaxe',  'Falcon_Battleaxe',  4, 'arma',     'Falcon'),
  item('Falcon Bow',        'Falcon_Bow',        4, 'arma',     'Falcon'),
  item('Falcon Sai',        'Falcon_Sai',        4, 'arma',     'Falcon'),

  // ── COBRA SET (Class 4) ────────────────────────────────────────────────
  item('Cobra Amulet',   'Cobra_Amulet',   4, 'acessório', 'Cobra'),
  item('Cobra Hood',     'Cobra_Hood',     4, 'armadura', 'Cobra'),
  item('Cobra Boots',    'Cobra_Boots',    4, 'armadura', 'Cobra'),
  item('Cobra Axe',      'Cobra_Axe',      4, 'arma',     'Cobra'),
  item('Cobra Club',     'Cobra_Club',     4, 'arma',     'Cobra'),
  item('Cobra Crossbow', 'Cobra_Crossbow', 4, 'arma',     'Cobra'),
  item('Cobra Rod',      'Cobra_Rod',      4, 'arma',     'Cobra'),
  item('Cobra Sword',    'Cobra_Sword',    4, 'arma',     'Cobra'),
  item('Cobra Wand',     'Cobra_Wand',     4, 'arma',     'Cobra'),
  item('Cobra Bo',       'Cobra_Bo',       4, 'arma',     'Cobra'),

  // ── SOUL SET (Class 4) ─────────────────────────────────────────────────
  item('Soulbastion',          'Soulbastion',          4, 'armadura', 'Soul'),
  item('Soulshell',            'Soulshell',            4, 'armadura', 'Soul'),
  item('Soulmantle',           'Soulmantle',           4, 'armadura', 'Soul'),
  item('Soulshroud',           'Soulshroud',           4, 'armadura', 'Soul'),
  item('Soulgarb',             'Soulgarb',             4, 'armadura', 'Soul'),
  item('Pair of Soulwalkers',  'Pair_of_Soulwalkers',  4, 'armadura', 'Soul'),
  item('Pair of Soulstalkers', 'Pair_of_Soulstalkers', 4, 'armadura', 'Soul'),
  item('Soulshanks',           'Soulshanks',           4, 'armadura', 'Soul'),
  item('Soulstrider',          'Soulstrider',          4, 'armadura', 'Soul'),
  item('Soulsoles',            'Soulsoles',            4, 'armadura', 'Soul'),
  item('Soulshredder',         'Soulshredder',         4, 'arma',     'Soul'),
  item('Soulcrusher',          'Soulcrusher',          4, 'arma',     'Soul'),
  item('Soulbiter',            'Soulbiter',            4, 'arma',     'Soul'),
  item('Soulcutter',           'Soulcutter',           4, 'arma',     'Soul'),
  item('Soulmaimer',           'Soulmaimer',           4, 'arma',     'Soul'),
  item('Souleater (Axe)',      'Souleater_(Axe)',       4, 'arma',     'Soul'),
  item('Soulbleeder',          'Soulbleeder',          4, 'arma',     'Soul'),
  item('Soulpiercer',          'Soulpiercer',          4, 'arma',     'Soul'),
  item('Soulhexer',            'Soulhexer',            4, 'arma',     'Soul'),
  item('Soultainter',          'Soultainter',          4, 'arma',     'Soul'),
  item('Soulkamas',            'Soulkamas',            4, 'arma',     'Soul'),
  item('Soul Reaper',          'Soul_Reaper',          4, 'arma',     'Soul'),

  // ── LION SET (Class 4) ─────────────────────────────────────────────────
  item('Lion Helmet',      'Lion_Helmet',      4, 'armadura', 'Lion'),
  item('Lion Plate',       'Lion_Plate',       4, 'armadura', 'Lion'),
  item('Lion Legs',        'Lion_Legs',        4, 'armadura', 'Lion'),
  item('Lion Boots',       'Lion_Boots',       4, 'armadura', 'Lion'),
  item('Lion Shield',      'Lion_Shield',      4, 'armadura', 'Lion'),
  item('Lion Spangenhelm', 'Lion_Spangenhelm', 4, 'armadura', 'Lion'),
  item('Lion Amulet',      'Lion_Amulet',      4, 'acessório','Lion'),
  item('Lion Longsword',   'Lion_Longsword',   4, 'arma',     'Lion'),
  item('Lion Axe',         'Lion_Axe',         4, 'arma',     'Lion'),
  item('Lion Hammer',      'Lion_Hammer',      4, 'arma',     'Lion'),
  item('Lion Mace',        'Lion_Mace',        4, 'arma',     'Lion'),
  item('Lion Longbow',     'Lion_Longbow',     4, 'arma',     'Lion'),
  item('Lion Bow',         'Lion_Bow',         4, 'arma',     'Lion'),
  item('Lion Spellbook',   'Lion_Spellbook',   4, 'misc',     'Lion'),
  item('Lion Rod',         'Lion_Rod',         4, 'arma',     'Lion'),
  item('Lion Wand',        'Lion_Wand',        4, 'arma',     'Lion'),
  item('Lion Claws',       'Lion_Claws',       4, 'arma',     'Lion'),

  // ── GNOME SET (Class 3) ──────────────────────────────────────────────
  item('Gnome Helmet',      'Gnome_Helmet',      3, 'armadura', 'Gnome'),
  item('Gnome Armor',       'Gnome_Armor',       3, 'armadura', 'Gnome'),
  item('Gnome Legs',        'Gnome_Legs',        3, 'armadura', 'Gnome'),
  item('Gnome Boots',       'Gnome_Boots',       3, 'armadura', 'Gnome'),
  item('Gnome Shield',      'Gnome_Shield',      3, 'armadura', 'Gnome'),
  item('Gnomish Footwraps', 'Gnomish_Footwraps', 3, 'armadura', 'Gnome'),
  item('Gnomish Cuirass',   'Gnomish_Cuirass',   3, 'armadura', 'Gnome'),
  item('Gnome Sword',       'Gnome_Sword',       3, 'arma',     'Gnome'),

  // ── ELDRITCH SET (Class 3) ─────────────────────────────────────────────
  item('Eldritch Cowl',     'Eldritch_Cowl',     3, 'armadura', 'Eldritch'),
  item('Eldritch Hood',     'Eldritch_Hood',     3, 'armadura', 'Eldritch'),
  item('Eldritch Cuirass',  'Eldritch_Cuirass',  3, 'armadura', 'Eldritch'),
  item('Eldritch Breeches', 'Eldritch_Breeches', 3, 'armadura', 'Eldritch'),
  item('Eldritch Shield',   'Eldritch_Shield',   3, 'armadura', 'Eldritch'),
  item('Eldritch Monk Boots','Eldritch_Monk_Boots',3,'armadura','Eldritch'),
  item('Eldritch Bow',      'Eldritch_Bow',      3, 'arma',     'Eldritch'),
  item('Eldritch Quiver',   'Eldritch_Quiver',   3, 'misc',     'Eldritch'),
  item('Eldritch Rod',      'Eldritch_Rod',      3, 'arma',     'Eldritch'),
  item('Eldritch Wand',     'Eldritch_Wand',     3, 'arma',     'Eldritch'),
  item('Eldritch Claymore', 'Eldritch_Claymore', 3, 'arma',     'Eldritch'),
  item('Eldritch Warmace',  'Eldritch_Warmace',  3, 'arma',     'Eldritch'),
  item('Eldritch Greataxe', 'Eldritch_Greataxe', 3, 'arma',     'Eldritch'),
  item('Eldritch Crescent Moon Spade', 'Eldritch_Crescent_Moon_Spade', 3, 'arma', 'Eldritch'),
  item('Eldritch Folio',    'Eldritch_Folio',    3, 'misc',     'Eldritch'),
  item('Eldritch Tome',     'Eldritch_Tome',     3, 'misc',     'Eldritch'),
  item('Gilded Eldritch Bow',                 'Gilded_Eldritch_Bow',                 3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Claymore',            'Gilded_Eldritch_Claymore',            3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Warmace',             'Gilded_Eldritch_Warmace',             3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Greataxe',            'Gilded_Eldritch_Greataxe',            3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Rod',                 'Gilded_Eldritch_Rod',                 3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Wand',                'Gilded_Eldritch_Wand',                3, 'arma', 'Eldritch'),
  item('Gilded Eldritch Crescent Moon Spade', 'Gilded_Eldritch_Crescent_Moon_Spade', 3, 'arma', 'Eldritch'),

  // ── FERUMBRAS (Class 3) ────────────────────────────────────────────────
  item("Ferumbras' Hat",     "Ferumbras'_Hat",   3, 'armadura', 'Ferumbras'),
  item("Ferumbras' Essence", 'Ferumbras_Essence',3, 'misc',     'Ferumbras'),
  item('Ferumbras Statue',   'Ferumbras_Statue', 3, 'misc',     'Ferumbras'),

  // ── MAGICIAN SET (Class 3) ─────────────────────────────────────────────
  item('Magician Hat',    'Magician_Hat',    3, 'armadura', 'Magician'),
  item("Magician's Robe", "Magician's_Robe", 3, 'armadura', 'Magician'),

  // ── OUTROS CLASSE 3 ────────────────────────────────────────────────────
  item('Royal Crossbow',   'Royal_Crossbow',   3, 'arma',     'Outros'),
  item('Bear Skin',        'Bear_Skin',        3, 'misc',     'Outros'),
  item('Ghost Chestplate', 'Ghost_Chestplate', 3, 'armadura', 'Outros'),
  item('Emerald Sword',    'Emerald_Sword',    3, 'arma',     'Outros'),
  item('Rift Bow',         'Rift_Bow',         3, 'arma',     'Outros'),
  item('Rift Crossbow',    'Rift_Crossbow',    3, 'arma',     'Outros'),
  item('Warsinger Bow',    'Warsinger_Bow',    3, 'arma',     'Outros'),
  item('The Devileye',     'The_Devileye',     3, 'acessório','Outros'),
  item('Deepling Staff',   'Deepling_Staff',   3, 'arma',     'Outros'),

  // ── STAG SET (Class 4) ────────────────────────────────────────────────────
  item('Stag Helmet',       'Stag_Helmet',       4, 'armadura', 'Stag'),
  item('Stag Robe',         'Stag_Robe',         4, 'armadura', 'Stag'),
  item('Stag Plate',        'Stag_Plate',        4, 'armadura', 'Stag'),
  item('Stag Legs',         'Stag_Legs',         4, 'armadura', 'Stag'),
  item('Stag Shinguards',   'Stag_Shinguards',   4, 'armadura', 'Stag'),
  item('Stag Boots',        'Stag_Boots',        4, 'armadura', 'Stag'),
  item('Stag Footwraps',    'Stag_Footwraps',    4, 'armadura', 'Stag'),
  item('Stag Shield',       'Stag_Shield',       4, 'armadura', 'Stag'),
  item('Refined Stag Shield','Refined_Stag_Shield',4,'armadura','Stag'),
  item('Stag Scrolls',      'Stag_Scrolls',      4, 'misc',     'Stag'),
  item('Stag Spellbook',    'Stag_Spellbook',    4, 'misc',     'Stag'),

  // ── PRIMAL SET / ALICORN (Class 4) ────────────────────────────────────────
  item('Alicorn Headguard',                'Alicorn_Headguard',                4, 'armadura', 'Primal'),
  item('Primal Robe of the Vizier',        'Primal_Robe_of_the_Vizier',        4, 'armadura', 'Primal'),
  item('Primal Plate of the Stalwart',     'Primal_Plate_of_the_Stalwart',     4, 'armadura', 'Primal'),
  item('Primal Surcoat of the Swiftstrike','Primal_Surcoat_of_the_Swiftstrike',4, 'armadura', 'Primal'),
  item('Alicorn Quiver',                   'Alicorn_Quiver',                   4, 'misc',     'Primal'),
  item('Alicorn Twigs',                    'Alicorn_Twigs',                    4, 'arma',     'Primal'),
  item('Alicorn Wand',                     'Alicorn_Wand',                     4, 'arma',     'Primal'),
  item('Alicorn Blade',                    'Alicorn_Blade',                    4, 'arma',     'Primal'),
  item('Alicorn Mace',                     'Alicorn_Mace',                     4, 'arma',     'Primal'),
  item('Alicorn Battleaxe',                'Alicorn_Battleaxe',                4, 'arma',     'Primal'),
  item('Alicorn Bow',                      'Alicorn_Bow',                      4, 'arma',     'Primal'),
  item('Alicorn Spellbook',                'Alicorn_Spellbook',                4, 'misc',     'Primal'),
]

export const getItemByName = (name) =>
  ITEMS_DATABASE.find(i => i.name.toLowerCase() === name.toLowerCase())

export const searchItems = (query) => {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return ITEMS_DATABASE.filter(i => i.name.toLowerCase().includes(q)).slice(0, 12)
}
