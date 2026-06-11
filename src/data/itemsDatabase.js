const W = 'https://tibia.fandom.com/wiki/Special:FilePath/'

export const ITEM_VOCATIONS = {
  // ── SANGUINE ──────────────────────────────────────────────────────────────
  'Sanguine Armor': 'EK',     'Sanguine Legs': 'EK',       'Sanguine Greaves': 'RP',
  'Sanguine Galoshes': 'ED',  'Sanguine Boots': 'MS',      'Sanguine Trousers': 'MONK',
  'Sanguine Coil': 'MS',      'Sanguine Rod': 'ED',
  'Sanguine Bludgeon': 'EK',  'Sanguine Cudgel': 'EK',
  'Sanguine Battleaxe': 'EK', 'Sanguine Hatchet': 'EK',
  'Sanguine Razor': 'EK',     'Sanguine Blade': 'EK',
  'Sanguine Bow': 'RP',       'Sanguine Crossbow': 'RP',   'Sanguine Claws': 'MONK',
  // ── GRAND SANGUINE ────────────────────────────────────────────────────────
  'Grand Sanguine Coil': 'MS',      'Grand Sanguine Rod': 'ED',
  'Grand Sanguine Bludgeon': 'EK',  'Grand Sanguine Cudgel': 'EK',
  'Grand Sanguine Battleaxe': 'EK', 'Grand Sanguine Hatchet': 'EK',
  'Grand Sanguine Razor': 'EK',     'Grand Sanguine Blade': 'EK',
  'Grand Sanguine Bow': 'RP',       'Grand Sanguine Crossbow': 'RP',
  'Grand Sanguine Claws': 'MONK',
  // ── FALCON ────────────────────────────────────────────────────────────────
  'Falcon Coif': 'EK',       'Falcon Circlet': 'MS',    'Falcon Plate': 'EK',
  'Falcon Greaves': 'EK',    'Falcon Boots': 'EK',      'Falcon Shield': 'EK',
  'Falcon Escutcheon': 'EK', 'Falcon Rod': 'ED',        'Falcon Wand': 'MS',
  'Falcon Longsword': 'EK',  'Falcon Mace': 'EK',       'Falcon Battleaxe': 'EK',
  'Falcon Bow': 'RP',        'Falcon Sai': 'MONK',
  // ── COBRA ─────────────────────────────────────────────────────────────────
  'Cobra Hood': 'EK',        'Cobra Boots': 'EK',
  'Cobra Axe': 'EK',         'Cobra Club': 'EK',        'Cobra Crossbow': 'RP',
  'Cobra Rod': 'ED',         'Cobra Sword': 'EK',       'Cobra Wand': 'MS',
  'Cobra Bo': 'MONK',
  // ── SOUL ──────────────────────────────────────────────────────────────────
  'Soulbastion': 'EK',             'Soulshell': 'RP',
  'Soulmantle': 'MS',              'Soulshroud': 'ED',
  'Soulgarb': 'MONK',              'Pair of Soulwalkers': 'EK',
  'Pair of Soulstalkers': 'RP',    'Soulshanks': 'MS',
  'Soulstrider': 'ED',             'Soulsoles': 'MONK',
  'Soulshredder': 'EK',            'Soulcrusher': 'EK',
  'Soulbiter': 'EK',               'Soulcutter': 'EK',
  'Soulmaimer': 'EK',              'Souleater (Axe)': 'EK',
  'Soulbleeder': 'RP',             'Soulpiercer': 'RP',
  'Soulhexer': 'ED',               'Soultainter': 'MS',
  'Soulkamas': 'MONK',             'Soul Reaper': 'EK',
  // ── LION ──────────────────────────────────────────────────────────────────
  'Lion Helmet': 'EK',       'Lion Plate': 'EK',        'Lion Legs': 'EK',
  'Lion Boots': 'EK',        'Lion Shield': 'EK',       'Lion Spangenhelm': 'RP',
  'Lion Longsword': 'EK',    'Lion Axe': 'EK',          'Lion Hammer': 'EK',
  'Lion Mace': 'EK',         'Lion Longbow': 'RP',      'Lion Bow': 'RP',
  'Lion Spellbook': 'MS',    'Lion Rod': 'ED',          'Lion Wand': 'MS',
  'Lion Claws': 'MONK',
  // ── GNOME ─────────────────────────────────────────────────────────────────
  'Gnome Helmet': 'MS',      'Gnome Armor': 'RP',       'Gnome Legs': 'MS',
  'Gnome Boots': 'EK',       'Gnome Shield': 'EK',
  'Gnomish Footwraps': 'MONK','Gnomish Cuirass': 'MONK', 'Gnome Sword': 'EK',
  // ── ELDRITCH ──────────────────────────────────────────────────────────────
  'Eldritch Cowl': 'MS',     'Eldritch Hood': 'ED',     'Eldritch Cuirass': 'EK',
  'Eldritch Breeches': 'RP', 'Eldritch Shield': 'EK',   'Eldritch Monk Boots': 'MONK',
  'Eldritch Bow': 'RP',      'Eldritch Quiver': 'RP',
  'Eldritch Rod': 'ED',      'Eldritch Wand': 'MS',
  'Eldritch Claymore': 'EK', 'Eldritch Warmace': 'EK',  'Eldritch Greataxe': 'EK',
  'Eldritch Crescent Moon Spade': 'MONK',
  'Eldritch Folio': 'MS',    'Eldritch Tome': 'ED',
  'Gilded Eldritch Bow': 'RP',
  'Gilded Eldritch Claymore': 'EK',  'Gilded Eldritch Warmace': 'EK',
  'Gilded Eldritch Greataxe': 'EK',  'Gilded Eldritch Rod': 'ED',
  'Gilded Eldritch Wand': 'MS',      'Gilded Eldritch Crescent Moon Spade': 'MONK',
  // ── FERUMBRAS ─────────────────────────────────────────────────────────────
  "Ferumbras' Hat": 'MS',    "Ferumbras' Essence": 'MS', 'Ferumbras Statue': 'MS',
  // ── MAGICIAN ──────────────────────────────────────────────────────────────
  'Magician Hat': 'MS',      "Magician's Robe": 'MS',
  // ── OUTROS CLASSE 3 ───────────────────────────────────────────────────────
  'Royal Crossbow': 'RP',    'Bear Skin': 'EK',
  'Emerald Sword': 'EK',     'Rift Bow': 'RP',
  'Rift Crossbow': 'RP',     'Warsinger Bow': 'RP',
  'The Devileye': 'ED',      'Deepling Staff': 'ED',
  // ── STAG ──────────────────────────────────────────────────────────────────
  'Stag Helmet': 'MS',       'Stag Robe': 'MONK',       'Stag Plate': 'RP',
  'Stag Legs': 'EK',         'Stag Shinguards': 'RP',   'Stag Boots': 'ED',
  'Stag Footwraps': 'MONK',  'Stag Shield': 'EK',
  'Refined Stag Shield': 'EK','Stag Scrolls': 'ED',      'Stag Spellbook': 'MS',
  // ── SPIRITTHORN ───────────────────────────────────────────────────────────
  'Spiritthorn Helmet': 'EK', 'Spiritthorn Armor': 'EK',
  'Spiritthorn Ring': 'EK',   'Charged Spiritthorn Ring': 'EK',
  // ── PRIMAL / ALICORN ──────────────────────────────────────────────────────
  'Alicorn Headguard': 'RP',                 'Primal Robe of the Vizier': 'MS',
  'Primal Plate of the Stalwart': 'EK',      'Primal Surcoat of the Swiftstrike': 'RP',
  'Alicorn Quiver': 'RP',                    'Alicorn Twigs': 'ED',
  'Alicorn Wand': 'MS',                      'Alicorn Blade': 'EK',
  'Alicorn Mace': 'EK',                      'Alicorn Battleaxe': 'EK',
  'Alicorn Bow': 'RP',                       'Alicorn Spellbook': 'MS',
  'Charged Alicorn Ring': 'RP',              'Alicorn Ring': 'RP',
  // ── ETHEREAL (MONK) ───────────────────────────────────────────────────────
  'Ethereal Coned Hat': 'MONK', 'Ethereal Ring': 'MONK', 'Charged Ethereal Ring': 'MONK',
  // ── ARCANOMANCER (MS) ─────────────────────────────────────────────────────
  'Arcanomancer Regalia': 'MS',      'Arcanomancer Folio': 'MS',
  'Arcanomancer Sigil': 'MS',        'Charged Arcanomancer Sigil': 'MS',
  // ── ARBOREAL (ED) ─────────────────────────────────────────────────────────
  'Arboreal Crown': 'ED',     'Arboreal Tome': 'ED',
  'Arboreal Ring': 'ED',      'Charged Arboreal Ring': 'ED',
  // ── CRYPT ─────────────────────────────────────────────────────────────────
  'Crypt Strike': 'MONK', 'Crypt Breaker': 'EK',  'Crypt Slicer': 'EK',
  'Crypt Splitter': 'EK', 'Crypt Spine': 'RP',    'Crypt Bile': 'MS',
  'Crypt Jaw': 'ED',
  // ── AMBER ─────────────────────────────────────────────────────────────────
  'Amber Axe': 'EK',         'Amber Bludgeon': 'EK',   'Amber Bow': 'RP',
  'Amber Crossbow': 'RP',    'Amber Cudgel': 'EK',     'Amber Greataxe': 'EK',
  'Amber Kusarigama': 'MONK','Amber Rod': 'ED',         'Amber Sabre': 'EK',
  'Amber Slayer': 'EK',      'Amber Wand': 'MS',        'Amber Staff': 'EK',
  // ── ACESSÓRIOS DE MONK ────────────────────────────────────────────────────
  'Merudri Brooch': 'MONK',           'Enchanted Merudri Brooch': 'MONK',
  'Enchanted Sleep Shawl': 'MONK',
}

const item = (name, imageFile, classification, category, set = '') => ({
  name,
  imageUrl: W + imageFile + '.gif',
  classification,
  maxTier: classification,
  category,
  set,
  vocation: ITEM_VOCATIONS[name] ?? 'ALL',
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

  // ── SPIRITTHORN SET (Class 4) ─────────────────────────────────────────────
  item('Spiritthorn Helmet',       'Spiritthorn_Helmet',       4, 'armadura',  'Spiritthorn'),
  item('Spiritthorn Armor',        'Spiritthorn_Armor',        4, 'armadura',  'Spiritthorn'),
  item('Spiritthorn Ring',         'Spiritthorn_Ring',         4, 'acessório', 'Spiritthorn'),
  item('Charged Spiritthorn Ring', 'Charged_Spiritthorn_Ring', 4, 'acessório', 'Spiritthorn'),

  // ── PRIMAL SET / ALICORN (Paladin, Class 4) ───────────────────────────────
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
  item('Charged Alicorn Ring',             'Charged_Alicorn_Ring',             4, 'acessório', 'Primal'),
  item('Alicorn Ring',                     'Alicorn_Ring',                     4, 'acessório', 'Primal'),

  // ── ETHEREAL SET (Monk, Class 4) ──────────────────────────────────────────
  item('Ethereal Coned Hat',    'Ethereal_Coned_Hat',    4, 'armadura',  'Ethereal'),
  item('Ethereal Ring',         'Ethereal_Ring',          4, 'acessório', 'Ethereal'),
  item('Charged Ethereal Ring', 'Charged_Ethereal_Ring',  4, 'acessório', 'Ethereal'),

  // ── ARCANOMANCER SET (Sorcerer, Class 4) ──────────────────────────────────
  item('Arcanomancer Regalia',       'Arcanomancer_Regalia',       4, 'armadura',  'Arcanomancer'),
  item('Arcanomancer Folio',         'Arcanomancer_Folio',         4, 'misc',      'Arcanomancer'),
  item('Arcanomancer Sigil',         'Arcanomancer_Sigil',         4, 'acessório', 'Arcanomancer'),
  item('Charged Arcanomancer Sigil', 'Charged_Arcanomancer_Sigil', 4, 'acessório', 'Arcanomancer'),

  // ── ARBOREAL SET (Druid, Class 4) ─────────────────────────────────────────
  item('Arboreal Crown',        'Arboreal_Crown',         4, 'armadura',  'Arboreal'),
  item('Arboreal Tome',         'Arboreal_Tome',          4, 'misc',      'Arboreal'),
  item('Arboreal Ring',         'Arboreal_Ring',          4, 'acessório', 'Arboreal'),
  item('Charged Arboreal Ring', 'Charged_Arboreal_Ring',  4, 'acessório', 'Arboreal'),

  // ── CRYPT SET (Class 4, Summer Update 2025) ───────────────────────────────
  item('Crypt Strike',  'Crypt_Strike',  4, 'arma', 'Crypt'),
  item('Crypt Breaker', 'Crypt_Breaker', 4, 'arma', 'Crypt'),
  item('Crypt Slicer',  'Crypt_Slicer',  4, 'arma', 'Crypt'),
  item('Crypt Splitter','Crypt_Splitter',4, 'arma', 'Crypt'),
  item('Crypt Spine',   'Crypt_Spine',   4, 'arma', 'Crypt'),
  item('Crypt Bile',    'Crypt_Bile',    4, 'arma', 'Crypt'),
  item('Crypt Jaw',     'Crypt_Jaw',     4, 'arma', 'Crypt'),

  // ── AMBER WEAPONS SERIES (Class 4, Summer Update 2024) ────────────────────
  item('Amber Axe',         'Amber_Axe',         4, 'arma', 'Amber'),
  item('Amber Bludgeon',    'Amber_Bludgeon',    4, 'arma', 'Amber'),
  item('Amber Bow',         'Amber_Bow',         4, 'arma', 'Amber'),
  item('Amber Crossbow',    'Amber_Crossbow',    4, 'arma', 'Amber'),
  item('Amber Cudgel',      'Amber_Cudgel',      4, 'arma', 'Amber'),
  item('Amber Greataxe',    'Amber_Greataxe',    4, 'arma', 'Amber'),
  item('Amber Kusarigama',  'Amber_Kusarigama',  4, 'arma', 'Amber'),
  item('Amber Rod',         'Amber_Rod',         4, 'arma', 'Amber'),
  item('Amber Sabre',       'Amber_Sabre',       4, 'arma', 'Amber'),
  item('Amber Slayer',      'Amber_Slayer',      4, 'arma', 'Amber'),
  item('Amber Wand',        'Amber_Wand',        4, 'arma', 'Amber'),

  // ── OUTROS (Amber Staff — item antigo, fora da série) ──────────────────────
  item('Amber Staff', 'Amber_Staff', 2, 'arma', 'Outros'),

  // ── ACESSÓRIOS PRIMAL / MONK ──────────────────────────────────────────────
  item('Merudri Brooch',              'Merudri_Brooch',              3, 'acessório', 'Outros'),
  item('Enchanted Merudri Brooch',    'Enchanted_Merudri_Brooch',    3, 'acessório', 'Outros'),
  item('Enchanted Theurgic Amulet',   'Enchanted_Theurgic_Amulet',   3, 'acessório', 'Outros'),
  item('Enchanted Sleep Shawl',       'Enchanted_Sleep_Shawl',       3, 'acessório', 'Outros'),
  item('Enchanted Pendulet',          'Enchanted_Pendulet',          3, 'acessório', 'Outros'),

  // ── AMULETOS BiS ──────────────────────────────────────────────────────────
  item('Stone Skin Amulet',    'Stone_Skin_Amulet',    0, 'acessório', 'Outros'),
  item('Bonfire Amulet',       'Bonfire_Amulet',       0, 'acessório', 'Outros'),
  item('Glacier Amulet',       'Glacier_Amulet',       0, 'acessório', 'Outros'),
  item('Sacred Tree Amulet',   'Sacred_Tree_Amulet',   0, 'acessório', 'Outros'),
  item('Shockwave Amulet',     'Shockwave_Amulet',     0, 'acessório', 'Outros'),
  item('Necklace of the Deep', 'Necklace_of_the_Deep', 0, 'acessório', 'Outros'),
  item('Amulet of Loss',       'Amulet_of_Loss',       0, 'acessório', 'Outros'),

  // ── ANÉIS BiS ─────────────────────────────────────────────────────────────
  item('Ring of Healing',    'Ring_of_Healing',    0, 'acessório', 'Outros'),
  item('Energy Ring',        'Energy_Ring',        0, 'acessório', 'Outros'),
  item('Time Ring',          'Time_Ring',          0, 'acessório', 'Outros'),
  item('Might Ring',         'Might_Ring',         0, 'acessório', 'Outros'),
  item('Stealth Ring',       'Stealth_Ring',       0, 'acessório', 'Outros'),
  item('Club Ring',          'Club_Ring',          0, 'acessório', 'Outros'),
  item('Prismatic Ring',     'Prismatic_Ring',     0, 'acessório', 'Outros'),
  item('Ring of Red Plasma', 'Ring_of_Red_Plasma', 2, 'acessório', 'Outros'),
  item('Ring of Souls',      'Ring_of_Souls',      3, 'acessório', 'Outros'),
]

export const getItemByName = (name) =>
  ITEMS_DATABASE.find(i => i.name.toLowerCase() === name.toLowerCase())

export const searchItems = (query) => {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return ITEMS_DATABASE.filter(i => i.name.toLowerCase().includes(q)).slice(0, 12)
}
