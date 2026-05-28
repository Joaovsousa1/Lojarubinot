import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { searchOutfits, OUTFITS_DATABASE } from '../../data/outfitsDatabase'
import { searchMounts, MOUNTS_DATABASE } from '../../data/mountsDatabase'

const OUTFIT_URL = Object.fromEntries(OUTFITS_DATABASE.map(o => [o.name, o.imageUrl]))
const MOUNT_URL  = Object.fromEntries(
  MOUNTS_DATABASE.filter((m, i, a) => a.findIndex(x => x.name === m.name) === i).map(m => [m.name, m.imageUrl])
)

const INPUT = 'w-full px-3 py-2 rounded-lg text-sm text-white outline-none'
const INPUT_STYLE = { backgroundColor: '#1a1025', border: '1px solid #3a3050' }
const LABEL = 'block text-xs text-gray-400 mb-1'
const NUM_SMALL = 'w-full px-2 py-1.5 rounded-lg text-sm text-white text-center outline-none'

const VOCATIONS = ['Knight', 'Paladin', 'Sorcerer', 'Monk']
const STATUSES  = ['disponível', 'reservada', 'em negociação', 'vendida']

const EMPTY_SKILLS = { ml: '', sword: '', axe: '', dist: '', fist: '', club: '', shielding: '' }

const EMPTY = {
  charName: '',
  server: '', vocation: 'Knight', level: '',
  buyPrice: '', sellPrice: '', status: 'disponível',
  skills: { ...EMPTY_SKILLS },
  charmPoints: '', bosstiaryPoints: '', huntingTaskPoints: '', vipDays: '', loyaltySkill: '',
  outfits: [], addons: [], mounts: [], notableItems: [],
  notes: '', screenshot: null,
}

function AutocompleteTagInput({ label, items, onChange, searchFn, urlMap, chipColor, chipBorder }) {
  const [val, setVal] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const wrapRef = useRef(null)

  const handleChange = (v) => {
    setVal(v)
    if (v.length >= 2 && searchFn) {
      const res = searchFn(v).filter(r => !items.includes(r.name))
      setSuggestions(res)
      setShowSug(res.length > 0)
    } else {
      setShowSug(false)
    }
  }

  const addText = (text) => {
    const v = text.trim()
    if (v && !items.includes(v)) onChange([...items, v])
    setVal('')
    setShowSug(false)
  }

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapRef}>
      <label className={LABEL}>{label}</label>
      <div className="relative flex gap-2 mb-2">
        <input
          type="text" value={val}
          className={INPUT} style={INPUT_STYLE}
          placeholder="Buscar ou digitar..."
          onChange={e => handleChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); addText(val) }
            if (e.key === 'Escape') setShowSug(false)
          }}
          onFocus={() => val.length >= 2 && setShowSug(suggestions.length > 0)}
        />
        <button type="button" onClick={() => addText(val)}
          className="px-3 py-2 rounded-lg text-white shrink-0"
          style={{ backgroundColor: '#7c3aed' }}
        ><Plus size={14} /></button>

        {showSug && (
          <ul className="absolute top-full left-0 right-10 z-20 mt-1 rounded-lg shadow-xl overflow-y-auto"
            style={{ backgroundColor: '#2a2035', border: '1px solid #3a3050', maxHeight: 200 }}>
            {suggestions.map(item => (
              <li key={item.name}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 text-sm text-gray-200"
                onMouseDown={() => addText(item.name)}
              >
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name}
                      className="h-8 w-8 shrink-0" style={{ imageRendering: 'pixelated' }}
                      onError={e => { e.currentTarget.style.display = 'none' }} />
                  : <span className="h-8 w-8 shrink-0 rounded flex items-center justify-center text-[9px] text-gray-600 text-center leading-tight"
                      style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
                      {item.name.split(' ')[0]}
                    </span>
                }
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((name, i) => {
            const imgUrl = urlMap?.[name]
            return (
              <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: chipColor ?? '#3b0764', color: '#c084fc', border: '1px solid ' + (chipBorder ?? '#4c1d95') }}>
                {imgUrl && (
                  <img src={imgUrl} alt={name} className="h-4 w-4" style={{ imageRendering: 'pixelated' }}
                    onError={e => { e.currentTarget.style.display = 'none' }} />
                )}
                {name}
                <button type="button" onClick={() => remove(i)} className="hover:text-white ml-0.5">
                  <X size={10} />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TagInput({ label, items, onChange }) {
  const [val, setVal] = useState('')
  const add = () => {
    const v = val.trim()
    if (v && !items.includes(v)) { onChange([...items, v]); setVal('') }
  }
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text" value={val}
          className={INPUT} style={INPUT_STYLE}
          placeholder="Digitar e pressionar +"
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-lg text-white shrink-0"
          style={{ backgroundColor: '#7c3aed' }}
        ><Plus size={14} /></button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: '#1a1025', color: '#9ca3af', border: '1px solid #3a3050' }}>
              {it}
              <button type="button" onClick={() => remove(i)} className="hover:text-white">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AccountForm({ initial, servers, onSubmit, onClose }) {
  const initSkills = initial?.skills ?? {}
  const [form, setForm] = useState(initial
    ? {
        ...EMPTY, ...initial,
        charName: initial.charName ?? '',
        skills: { ...EMPTY_SKILLS, ...initSkills },
        charmPoints: initial.charmPoints ?? '',
        bosstiaryPoints: initial.bosstiaryPoints ?? '',
        huntingTaskPoints: initial.huntingTaskPoints ?? '',
        vipDays: initial.vipDays ?? '',
        loyaltySkill: initial.loyaltySkill ?? '',
        outfits: [...(initial.outfits ?? [])],
        addons: [...(initial.addons ?? [])],
        mounts: [...(initial.mounts ?? [])],
        notableItems: [...(initial.notableItems ?? [])],
      }
    : { ...EMPTY, server: servers[0] ?? '' }
  )
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setSkill = (k, v) => setForm(f => ({ ...f, skills: { ...f.skills, [k]: v } }))

  const handleScreenshot = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('screenshot', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const skills = {}
    Object.keys(EMPTY_SKILLS).forEach(k => {
      const v = parseInt(form.skills[k]) || 0
      if (v > 0) skills[k] = v
    })
    const payload = {
      ...form,
      charName: form.charName.trim(),
      level: parseInt(form.level) || 0,
      buyPrice: parseFloat(form.buyPrice) || 0,
      sellPrice: parseFloat(form.sellPrice) || 0,
      skills,
      charmPoints: parseInt(form.charmPoints) || 0,
      bosstiaryPoints: parseInt(form.bosstiaryPoints) || 0,
      huntingTaskPoints: parseInt(form.huntingTaskPoints) || 0,
      vipDays: parseInt(form.vipDays) || 0,
      loyaltySkill: parseInt(form.loyaltySkill) || 0,
      dateEntry: initial?.dateEntry ?? new Date().toISOString(),
      dateSold: form.status === 'vendida' ? (initial?.dateSold ?? new Date().toISOString()) : null,
    }
    onSubmit(payload)
  }

  const profit = (parseFloat(form.sellPrice) || 0) - (parseFloat(form.buyPrice) || 0)

  const SKILL_FIELDS = [
    { key: 'ml',        label: 'ML'       },
    { key: 'sword',     label: 'Espada'   },
    { key: 'axe',       label: 'Machado'  },
    { key: 'dist',      label: 'Distância'},
    { key: 'fist',      label: 'Fist'     },
    { key: 'club',      label: 'Clava'    },
    { key: 'shielding', label: 'Escudo'   },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Identity */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identidade</div>
        <div>
          <label className={LABEL}>Nome do personagem</label>
          <input type="text" className={INPUT} style={INPUT_STYLE}
            value={form.charName} onChange={e => set('charName', e.target.value)}
            placeholder="Ex: Lord Drakkar" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={LABEL}>Servidor</label>
            <select className={INPUT} style={INPUT_STYLE} value={form.server} onChange={e => set('server', e.target.value)}>
              {servers.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Vocação</label>
            <select className={INPUT} style={INPUT_STYLE} value={form.vocation} onChange={e => set('vocation', e.target.value)}>
              {VOCATIONS.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Level</label>
            <input type="number" min="1" required className={INPUT} style={INPUT_STYLE}
              value={form.level} onChange={e => set('level', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Preços */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preço</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Preço compra (R$)</label>
            <input type="number" step="0.01" min="0" required className={INPUT} style={INPUT_STYLE}
              value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Preço venda (R$)</label>
            <input type="number" step="0.01" min="0" required className={INPUT} style={INPUT_STYLE}
              value={form.sellPrice} onChange={e => set('sellPrice', e.target.value)} />
          </div>
        </div>
        {form.buyPrice && form.sellPrice && (
          <div className="flex justify-between text-sm px-1">
            <span className="text-gray-400">Lucro estimado</span>
            <span style={{ color: profit >= 0 ? '#4ade80' : '#f87171' }} className="font-semibold">
              R$ {profit.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className={LABEL}>Status</label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button type="button" key={s}
              onClick={() => set('status', s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: form.status === s ? '#7c3aed' : '#1a1025',
                border: '1px solid ' + (form.status === s ? '#7c3aed' : '#3a3050'),
                color: form.status === s ? '#fff' : '#9ca3af',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills</div>
        <div className="grid grid-cols-4 gap-2">
          {SKILL_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-[10px] text-gray-500 mb-1 text-center">{label}</label>
              <input
                type="number" min="0" max="200"
                className={NUM_SMALL} style={INPUT_STYLE}
                value={form.skills[key]}
                onChange={e => setSkill(key, e.target.value)}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progressão */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Progressão</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'charmPoints',       label: 'Charm Points'   },
            { key: 'bosstiaryPoints',   label: 'Bosstiary Pts'  },
            { key: 'huntingTaskPoints', label: 'Task Points'     },
            { key: 'vipDays',           label: 'VIP Days'        },
            { key: 'loyaltySkill',      label: 'Loyalty Skill'   },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={LABEL}>{label}</label>
              <input type="number" min="0" className={INPUT} style={INPUT_STYLE}
                value={form[key]} onChange={e => set(key, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>
      </div>

      {/* Cosmetics */}
      <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050' }}>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cosmético</div>
        <AutocompleteTagInput label="Outfits" items={form.outfits} onChange={v => set('outfits', v)}
          searchFn={searchOutfits} urlMap={OUTFIT_URL} chipColor="#3b0764" chipBorder="#4c1d95" />
        <TagInput label="Addons" items={form.addons} onChange={v => set('addons', v)} />
        <AutocompleteTagInput label="Montarias" items={form.mounts} onChange={v => set('mounts', v)}
          searchFn={searchMounts} urlMap={MOUNT_URL} chipColor="#1e3a5f" chipBorder="#1e40af" />
      </div>

      {/* Notable items */}
      <TagInput label="Itens notáveis" items={form.notableItems} onChange={v => set('notableItems', v)} />

      {/* Notes */}
      <div>
        <label className={LABEL}>Notas internas</label>
        <textarea rows={2} className={INPUT} style={INPUT_STYLE}
          value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Observações sobre a conta" />
      </div>

      {/* Screenshot */}
      <div>
        <label className={LABEL}>Screenshot do personagem</label>
        <input type="file" accept="image/*" ref={fileRef} onChange={handleScreenshot} className="hidden" />
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
          >Escolher imagem</button>
          {form.screenshot && (
            <div className="flex items-center gap-2">
              <img src={form.screenshot} alt="screenshot" className="h-10 w-16 object-cover rounded" />
              <button type="button" onClick={() => set('screenshot', null)} className="text-red-400 hover:text-red-300">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#1a1025', border: '1px solid #3a3050', color: '#9ca3af' }}
        >Cancelar</button>
        <button type="submit"
          className="flex-1 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: '#7c3aed' }}
        >{initial ? 'Salvar' : 'Adicionar'}</button>
      </div>
    </form>
  )
}
