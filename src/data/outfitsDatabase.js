const W = 'https://tibia.fandom.com/wiki/Special:FilePath/'
const S = 'https://mineirocoins.shop/images/gallery/skins/'
// O bazar do RubinOT mostra o nome sem o sufixo "Outfit" (ex: "Warrior", nao "Warrior Outfit")
const clean = (name) => name.replace(/\s*Outfit$/, '')
const o  = (name, file) => ({ name: clean(name), imageUrl: W + file + '_Male_Addon_3.gif' })
const o0 = (name, file) => ({ name: clean(name), imageUrl: W + file + '_Male.gif' })
const of = (name, file) => ({ name: clean(name), imageUrl: W + file + '_Female_Addon_3.gif' })
const r  = (name, file) => ({ name, imageUrl: S + file })
// Proxy de sprites da wiki oficial do RubinOT (usado quando nao ha imagem no wiki do Tibia)
// Cores default sao so um "boneco" generico de demonstracao (nao tem a ver com a cor real de nenhuma conta)
const wp = (name, type, colors) => {
  const { head = 78, body = 106, legs = 79, feet = 0, direction = 5 } = colors ?? {}
  return { name, imageUrl: `https://wiki.rubinot.com/api/outfit-proxy?type=${type}&head=${head}&body=${body}&legs=${legs}&feet=${feet}&addons=3&direction=${direction}&animated=0&walk=0&size=0` }
}
const DARKLIGHT_COLORS = { head: 95, body: 113, legs: 39, feet: 115, direction: 3 }

const BASE_OUTFITS = [
  // ── Vocação base (própria, automática ao promover) ──────────────────────
  o('Knight Outfit',        'Outfit_Knight'),
  o('Paladin Outfit',       'Outfit_Paladin'),
  o('Sorcerer Outfit',      'Outfit_Sorcerer'),
  o('Druid Outfit',         'Outfit_Druid'),
  o('Elder Druid Outfit',   'Outfit_Elder_Druid'),
  o('Master Sorcerer Outfit','Outfit_Master_Sorcerer'),
  o('Elite Knight Outfit',  'Outfit_Elite_Knight'),
  o('Royal Paladin Outfit', 'Outfit_Royal_Paladin'),

  // ── Grátis / Premium automático (sem quest, sempre aparecem como "Base") ─
  o('Citizen Outfit',       'Outfit_Citizen'),
  o('Hunter Outfit',        'Outfit_Hunter'),
  o('Mage Outfit',          'Outfit_Mage'),
  o('Monk Outfit',          'Outfit_Monk'),
  o('Warrior Outfit',       'Outfit_Warrior'),
  o('Barbarian Outfit',     'Outfit_Barbarian'),
  o('Nobleman Outfit',      'Outfit_Nobleman'),
  of('Noblewoman Outfit',   'Outfit_Nobleman'),
  o('Oriental Outfit',      'Outfit_Oriental'),
  o('Summoner Outfit',      'Outfit_Summoner'),
  o('Wizard Outfit',        'Outfit_Wizard'),

  // ── Quest / Evento ────────────────────────────────────────────────────
  o('Dream Warden Outfit',  'Outfit_Dream_Warden'),
  o('Warmaster Outfit',     'Outfit_Warmaster'),
  o('Rift Outfit',          'Outfit_Rift'),
  o('Falcon Outfit',        'Outfit_Falcon'),
  o('Lion Warden Outfit',   'Outfit_Lion_Warden'),
  o('Gnome Outfit',         'Outfit_Gnome'),
  o('Void Outfit',          'Outfit_Void'),
  o('Glooth Engineer Outfit','Outfit_Glooth_Engineer'),
  // "Demon Outfit" e o nome real no bazar (confirmado via API), diferente da maioria dos outfits
  // que o bazar mostra sem o sufixo "Outfit" -- por isso nao passa pelo clean() aqui.
  { name: 'Demon Outfit', imageUrl: W + 'Outfit_Demon_Male_Addon_3.gif' },
  o('Pirate Outfit',        'Outfit_Pirate'),
  o('Norseman Outfit',      'Outfit_Norseman'),
  of('Norsewoman Outfit',   'Outfit_Norseman'),
  o('Shaman Outfit',        'Outfit_Shaman'),
  o('Jumpsuit Outfit',      'Outfit_Jumpsuit'),
  o('Assassin Outfit',      'Outfit_Assassin'),
  o('Beggar Outfit',        'Outfit_Beggar'),
  o('Necromancer Outfit',   'Outfit_Necromancer'),
  o('Jester Outfit',        'Outfit_Jester'),
  o('Yalaharian Outfit',    'Outfit_Yalaharian'),
  o('Nightmare Outfit',     'Outfit_Nightmare'),
  o('Chaos Acolyte Outfit', 'Outfit_Chaos_Acolyte'),
  o('Dawnport Outfit',      'Outfit_Dawnport'),
  o('Soldier Outfit',       'Outfit_Soldier'),
  o('Elf Outfit',           'Outfit_Elf'),
  o('Dwarf Outfit',         'Outfit_Dwarf'),
  o('Cave Explorer Outfit', 'Outfit_Cave_Explorer'),
  o('Makeshift Warrior Outfit','Outfit_Makeshift_Warrior'),
  o('Sinister Archer Outfit','Outfit_Sinister_Archer'),
  o('Thunder Mage Outfit',  'Outfit_Thunder_Mage'),
  o('Deepling Outfit',      'Outfit_Deepling'),
  o('Dragonling Outfit',    'Outfit_Dragonling'),
  o('Evoker Outfit',        'Outfit_Evoker'),
  o('Battle Mage Outfit',   'Outfit_Battle_Mage'),
  o('Crystalcrusher Outfit','Outfit_Crystalcrusher'),
  o('Hero Outfit',          'Outfit_Hero'),
  o('Afflicted Outfit',     'Outfit_Afflicted'),
  o('Ancient Archer Outfit','Outfit_Ancient_Archer'),
  o('Conjurer Outfit',      'Outfit_Conjurer'),
  o('Royal Bounty Hunter Outfit','Outfit_Royal_Bounty_Hunter'),
  o('Champion Outfit',      'Outfit_Champion'),
  o('Elementalist Outfit',  'Outfit_Elementalist'),
  o('Festive Outfit',       'Outfit_Festive'),
  o('Retro Warrior Outfit', 'Outfit_Retro_Warrior'),
  o('Retro Hunter Outfit',  'Outfit_Retro_Hunter'),
  o('Retro Mage Outfit',    'Outfit_Retro_Mage'),
  o('Retro Druid Outfit',   'Outfit_Retro_Druid'),

  // ── Tibia Store ───────────────────────────────────────────────────────
  o('Shadow Outfit',        'Outfit_Shadow'),
  o('Golden Outfit',        'Outfit_Golden'),
  o('Stampede Outfit',      'Outfit_Stampede'),
  o('Blacksmith Outfit',    'Outfit_Blacksmith'),
  o('Viking Outfit',        'Outfit_Viking'),
  o('Parcel Outfit',        'Outfit_Parcel'),

  // ── Confirmados faltando via API ao vivo (bazar #278787, Anacoins Ekprecin) em 05/09/2026 ──
  o('Jersey Outfit',        'Outfit_Jersey'),
  o('Revenant Outfit',      'Outfit_Revenant'),
  o('Orcsoberfest Garb',    'Outfit_Orcsoberfest_Garb'),
  o('Fiend Slayer Outfit',  'Outfit_Fiend_Slayer'),
  o('Percht Raider Outfit', 'Outfit_Percht_Raider'),
  o('Illuminator Outfit',   'Outfit_Illuminator'),
]

// Exclusivos do RubinOT (não existem no Tibia base) — usados pra destacar
// outfits raros/de passe/evento na hora de anunciar uma conta.
const CUSTOM_OUTFITS = [
  wp('Demonic Kid',                        2502),
  wp('Angelical Kid',                      2501),
  // Confirmado via API ao vivo do RubinOT (bazar #278787, personagem Anacoins Ekprecin) em 05/09/2026 --
  // essas 3 variantes por arma vieram com o nome "Angelic Champion" na API, NAO "Twilight Guardian" como
  // a wiki/base antiga tinha registrado nesses mesmos looktypes (2525-2527). Ver linhas do Twilight abaixo.
  wp('Angelic Champion (Axe)',             2525),
  wp('Angelic Champion (Club)',            2526),
  wp('Angelic Champion (Sword)',           2527),
  // Bazar as vezes mostra sem o sufixo da arma -- assume Sword (variante mais comum vista ate agora)
  wp('Angelic Champion',                   2527),
  r('Gladiator',                           'Gladiator%20Male.gif'),
  r('King',                                'royal_king.gif'),
  r('Queen',                               'royal_queen.gif'),
  wp("Dukoth's Physique",                  2512),
  wp('Abyssal Archmage',                   2516),
  wp('Illuminated Witch',                  2524),
  wp('Nightshade Shaman',                  2517),
  wp('Divine Dawn',                        2522),
  wp('Darkness Sentinel',                  2518),
  wp('Celestial Protector',                2523),
  // Cores reais confirmadas numa conta de verdade (Jeff Bro, bazar #238816) -- muito
  // melhor que a cor generica de demonstracao da wiki, que fica com cara errada
  wp('Darklight Guardian (Axe)',           2519, DARKLIGHT_COLORS),
  wp('Darklight Guardian (Club)',          2520, DARKLIGHT_COLORS),
  wp('Darklight Guardian (Sword)',         2521, DARKLIGHT_COLORS),
  // Bazar as vezes mostra sem o sufixo da arma -- assume Sword (skill mais comum de Knight/masculino)
  wp('Darklight Guardian',                 2521, DARKLIGHT_COLORS),
  // "Twilight Guardian" (contraparte feminina do Darklight) removido em 05/09/2026: os looktypes
  // 2525-2527 que estavam aqui na verdade sao "Angelic Champion" (confirmado via API ao vivo, ver
  // acima) -- provavelmente Twilight Guardian nunca existiu com esses IDs ou foi remapeado pelo
  // RubinOT. Sem uma conta real confirmando o looktype certo, ficou de fora ate confirmar.
  wp('Buozzi',                             2536),
  wp('Nordic Santa',                       2555),
  wp("Brino's Magician",                   2557),
  r('Flame Reaper',                        'flame_reaper_male.gif'),
  r('Special Citizen',                     'special_citizen_male.gif'),
  r('Death Citizen',                       'special_citizen_death_male.gif'),
  r('Energy Citizen',                      'special_citizen_energy_male.gif'),
  r('Holy Citizen',                        'special_citizen_holy_male.gif'),
  r('Ice Citizen',                         'special_citizen_ice_male.gif'),
  r('Earth Citizen',                       'special_citizen_earth_male.gif'),
  r('Fire Citizen',                        'special_citizen_fire_male.gif'),
  r('Special Warrior',                     'special_warrior_male.gif'),
  r('Death Warrior',                       'special_warrior_death_male.gif'),
  r('Energy Warrior',                      'special_warrior_energy_male.gif'),
  r('Holy Warrior',                        'special_warrior_holy_male.gif'),
  r('Ice Warrior',                         'special_warrior_ice_male.gif'),
  r('Earth Warrior',                       'special_warrior_earth_male.gif'),
  r('Fire Warrior',                        'special_warrior_fire_male.gif'),
  r('Draconic',                            'draconic_male.gif'),
  r('Special Wizard',                      'special_wizard_male.gif'),
  r('Death Wizard',                        'special_wizard_death_male.gif'),
  r('Energy Wizard',                       'special_wizard_energy_male.gif'),
  r('Holy Wizard',                         'special_wizard_holy_male.gif'),
  r('Ice Wizard',                          'special_wizard_ice_male.gif'),
  r('Earth Wizard',                        'special_wizard_earth_male.gif'),
  r('Fire Wizard',                         'special_wizard_fire_male.gif'),
  r('Special Hunter',                      'special_hunter_male.gif'),
  r('Death Hunter',                        'special_hunter_death_male.gif'),
  r('Energy Hunter',                       'special_hunter_energy_male.gif'),
  r('Holy Hunter',                         'special_hunter_holy_male.gif'),
  r('Ice Hunter',                          'special_hunter_ice_male.gif'),
  r('Earth Hunter',                        'special_hunter_earth_male.gif'),
  r('Fire Hunter',                         'special_hunter_fire_male.gif'),
  wp('Bloodbreaker',                       2638),
  r('Saintblade',                          'saintblade_male.gif'),
  wp('Saintbloom',                         2666),
  r('Royal Vanguard',                      'royal_vanguard_male.png'),
  r('King Highlord',                       'king_highlord.gif'),
  wp('Queen Highlady',                     2676),
  r('Special Assassin',                    'special_assassin_male.gif'),
  r('Death Assassin',                      'special_assassin_death_male.gif'),
  r('Energy Assassin',                     'special_assassin_energy_male.gif'),
  r('Holy Assassin',                       'special_assassin_holy_male.gif'),
  r('Ice Assassin',                        'special_assassin_ice_male.gif'),
  r('Earth Assassin',                      'special_assassin_earth_male.gif'),
  r('Fire Assassin',                       'special_assassin_fire_male.gif'),
  r('Special Barbarian',                   'special_barbarian_male.gif'),
  r('Death Barbarian',                     'special_barbarian_death_male.gif'),
  r('Energy Barbarian',                    'special_barbarian_energy_male.gif'),
  r('Holy Barbarian',                      'special_barbarian_holy_male.gif'),
  r('Ice Barbarian',                       'special_barbarian_ice_male.gif'),
  r('Earth Barbarian',                     'special_barbarian_earth_male.gif'),
  r('Fire Barbarian',                      'special_barbarian_fire_male.gif'),
  wp('Eclipse Priest (Paladin)',           2718),
  wp('Eclipse Priestess (Paladin)',        2719),
  wp('Eclipse Priest (Sorcerer/Druid)',    2720),
  wp('Eclipse Priestess (Sorcerer/Druid)', 2721),
  wp('Eclipse Priest (Knight)',            2722),
  wp('Eclipse Warden',                     2722), // nome real in-game do Outfit 2722 (confirmado no bazar #258727)
  wp('Eclipse Priestess (Knight)',         2723),
  wp('Eclipse Priest (Monk)',              2724),
  wp('Eclipse Priestess (Monk)',           2725),
  wp('Special Knight',                     2738),
  r('Death Knight',                        'special_knight_death_male.gif'),
  wp('Energy Knight',                      2742),
  r('Holy Knight',                         'special_knight_holy_male.gif'),
  r('Ice Knight',                          'special_knight_ice_male.gif'),
  r('Earth Knight',                        'special_knight_earth_male.gif'),
  r('Fire Knight',                         'special_knight_fire_male.gif'),
  wp('Special Oriental',                   2752),
  r('Death Oriental',                      'special_oriental_death_male.gif'),
  wp('Energy Oriental',                    2756),
  r('Holy Oriental',                       'special_oriental_holy_male.gif'),
  r('Ice Oriental',                        'special_oriental_ice_male.gif'),
  r('Earth Oriental',                      'special_oriental_earth_male.gif'),
  r('Fire Oriental',                       'special_oriental_fire_male.gif'),
  wp('Frostbringer',                       2605),
  wp('Flamebringer',                       2607),
  wp('Hand of the Inquisition',            1244),
  wp('Ancient Aucar',                      1598),
  wp('Fire-Fighter',                       1569),
  wp('Draccoon Herald',                    1723),
  o('Decaying Defender',                   'Outfit_Decaying_Defender'),
  o('Rascoohan',                           'Outfit_Rascoohan'),
  o('Demon Hunter',                        'Outfit_Demon_Hunter'),
  o('Rift Warrior',                        'Outfit_Rift_Warrior'),
  wp('Poltergeist',                        1271),
  wp('Merry Garb',                         1383),
]

export const OUTFITS_DATABASE = [...BASE_OUTFITS, ...CUSTOM_OUTFITS]
export const CUSTOM_OUTFIT_NAMES = new Set(CUSTOM_OUTFITS.map(o => o.name))

export const searchOutfits = (query) => {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return OUTFITS_DATABASE.filter(o => o.name.toLowerCase().includes(q)).slice(0, 15)
}
