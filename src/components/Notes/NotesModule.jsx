import React, { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, StickyNote, Clock, CircleDollarSign, Check, Undo2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatDateTime, formatRC, formatCurrency } from '../../utils/helpers'
import Modal from '../UI/Modal'

const TYPE_META = {
  fiado:    { label: 'Fiado',    color: '#fbbf24', bg: '#78350f33', border: '#d9770655' },
  lembrete: { label: 'Lembrete', color: '#60a5fa', bg: '#1e3a5f33', border: '#3b82f655' },
  geral:    { label: 'Geral',    color: '#9ca3af', bg: '#37415133', border: '#4b556355' },
}

const CARD = { backgroundColor: '#1e1630', border: '1px solid #2d2248' }
const FIELD = { backgroundColor: '#130e1e', border: '1px solid #2d2248', color: '#e5e7eb' }

function isOverdue(note) {
  return note.type === 'lembrete' && note.dueAt && !note.resolved && new Date(note.dueAt) < new Date()
}

// ─── Form (criar/editar) ─────────────────────────────────────────────────
function NoteForm({ note, accounts, loyaltyAccounts, onSave, onClose }) {
  const [type, setType]         = useState(note?.type ?? 'geral')
  const [text, setText]         = useState(note?.text ?? '')
  const [person, setPerson]     = useState(note?.person ?? '')
  const [amountRC, setAmountRC]   = useState(note?.amountRC ?? '')
  const [amountPIX, setAmountPIX] = useState(note?.amountPIX ?? '')
  const [dueAt, setDueAt]       = useState(note?.dueAt ? note.dueAt.slice(0, 16) : '')
  const [accountId, setAccountId] = useState(note?.accountId ?? '')
  const [loyaltyId, setLoyaltyId] = useState(note?.loyaltyId ?? '')
  const [email, setEmail]       = useState(note?.email ?? '')

  const availableAccounts = useMemo(() => accounts.filter(a => a.status !== 'vendida'), [accounts])
  const availableLoyalty  = useMemo(() => loyaltyAccounts.filter(a => a.status !== 'vendida'), [loyaltyAccounts])

  const canSave = text.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      type, text: text.trim(),
      person: type === 'fiado' ? person.trim() : '',
      amountRC: type === 'fiado' && amountRC !== '' ? Number(amountRC) : null,
      amountPIX: type === 'fiado' && amountPIX !== '' ? Number(amountPIX) : null,
      dueAt: type === 'lembrete' && dueAt ? new Date(dueAt).toISOString() : null,
      accountId: accountId || '',
      loyaltyId: loyaltyId || '',
      email: email.trim(),
    })
  }

  return (
    <Modal title={note ? 'Editar anotação' : 'Nova anotação'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 mb-1.5">Tipo</div>
          <div className="flex gap-2">
            {Object.entries(TYPE_META).map(([key, m]) => (
              <button key={key} onClick={() => setType(key)}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: type === key ? m.bg : '#130e1e',
                  color: type === key ? m.color : '#6b7280',
                  border: `1px solid ${type === key ? m.border : '#2d2248'}`,
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1.5">Anotação</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            placeholder={type === 'fiado' ? 'Ex: Pegou emprestado pra comprar item' : 'Ex: Leilão da conta termina hoje'}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={FIELD} />
        </div>

        {type === 'fiado' && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Pessoa</div>
              <input value={person} onChange={e => setPerson(e.target.value)} placeholder="Nome"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1.5">Valor (RC)</div>
                <input type="number" value={amountRC} onChange={e => setAmountRC(e.target.value)} placeholder="0"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5">Valor (R$)</div>
                <input type="number" value={amountPIX} onChange={e => setAmountPIX(e.target.value)} placeholder="0,00"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD} />
              </div>
            </div>
          </div>
        )}

        {type === 'lembrete' && (
          <div>
            <div className="text-xs text-gray-500 mb-1.5">Prazo</div>
            <input type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD} />
          </div>
        )}

        <div>
          <div className="text-xs text-gray-500 mb-1.5">Vincular uma conta (opcional)</div>
          <select value={accountId} onChange={e => setAccountId(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD}>
            <option value="">Nenhuma</option>
            {availableAccounts.map(a => (
              <option key={a.id} value={a.id}>{a.charName} {a.server ? `(${a.server})` : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1.5">Vincular um Loyalty (opcional)</div>
          <select value={loyaltyId} onChange={e => setLoyaltyId(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD}>
            <option value="">Nenhuma</option>
            {availableLoyalty.map(a => (
              <option key={a.id} value={a.id}>{a.email} {a.server ? `(${a.server})` : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1.5">Email (opcional)</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="conta@email.com"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={FIELD} />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#130e1e', color: '#9ca3af', border: '1px solid #2d2248' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!canSave}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold"
            style={{
              backgroundColor: canSave ? '#7c3aed' : '#2d2248',
              color: canSave ? '#fff' : '#4b5563',
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}>
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Card individual ──────────────────────────────────────────────────────
function NoteCard({ note, account, loyaltyAccount, onEdit, onDelete, onToggleResolved }) {
  const meta = TYPE_META[note.type] ?? TYPE_META.geral
  const overdue = isOverdue(note)

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{
      backgroundColor: CARD.backgroundColor,
      border: overdue ? '1px solid #dc262666' : CARD.border,
      opacity: note.resolved ? 0.55 : 1,
    }}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ backgroundColor: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
          {meta.label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onToggleResolved(note.id)} title={note.resolved ? 'Reabrir' : 'Marcar como resolvido'}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: note.resolved ? '#4ade80' : '#6b7280', backgroundColor: note.resolved ? '#14532d33' : '#130e1e' }}>
            {note.resolved ? <Undo2 size={13} /> : <Check size={13} />}
          </button>
          <button onClick={() => onEdit(note)} className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors" style={{ backgroundColor: '#130e1e' }}>
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#f87171', backgroundColor: '#130e1e' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-200 whitespace-pre-wrap" style={{ textDecoration: note.resolved ? 'line-through' : 'none' }}>
        {note.text}
      </div>

      {note.type === 'fiado' && (note.person || note.amountRC || note.amountPIX) && (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#fbbf24' }}>
          <CircleDollarSign size={13} />
          {note.person || 'Alguém'}
          {(note.amountRC || note.amountPIX) && ' — '}
          {note.amountRC ? formatRC(note.amountRC) : ''}
          {note.amountRC && note.amountPIX ? ' · ' : ''}
          {note.amountPIX ? formatCurrency(note.amountPIX) : ''}
        </div>
      )}

      {note.type === 'lembrete' && note.dueAt && (
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: overdue ? '#f87171' : '#60a5fa' }}>
          <Clock size={13} />
          {formatDateTime(note.dueAt)} {overdue && '· vencido'}
        </div>
      )}

      {account && (
        <div className="text-[11px] text-gray-500">
          🔗 {account.charName} {account.server ? `(${account.server})` : ''}
        </div>
      )}

      {loyaltyAccount && (
        <div className="text-[11px] text-gray-500">
          ⭐ {loyaltyAccount.email} {loyaltyAccount.server ? `(${loyaltyAccount.server})` : ''}
        </div>
      )}

      {note.email && (
        <div className="text-[11px] text-gray-500">
          ✉️ {note.email}
        </div>
      )}
    </div>
  )
}

// ─── Módulo principal ─────────────────────────────────────────────────────
export default function NotesModule() {
  const { notes, accounts, settings, addNote, updateNote, deleteNote, toggleNoteResolved } = useApp()
  const loyaltyAccounts = settings.loyaltyAccounts ?? []
  const [tab, setTab] = useState('todas')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const accountsById = useMemo(() => Object.fromEntries(accounts.map(a => [a.id, a])), [accounts])
  const loyaltyById  = useMemo(() => Object.fromEntries(loyaltyAccounts.map(a => [a.id, a])), [loyaltyAccounts])

  const filtered = useMemo(() => {
    let list = notes
    if (tab !== 'todas') list = list.filter(n => n.type === tab)
    return [...list].sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [notes, tab])

  const openCount = notes.filter(n => !n.resolved).length

  const handleSave = (data) => {
    if (editing) updateNote(editing.id, data)
    else addNote(data)
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (note) => { setEditing(note); setShowForm(true) }
  const handleDelete = (id) => { if (confirm('Excluir esta anotação?')) deleteNote(id) }

  const TABS = [
    { id: 'todas', label: 'Todas' },
    { id: 'fiado', label: 'Fiado' },
    { id: 'lembrete', label: 'Lembretes' },
    { id: 'geral', label: 'Geral' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <StickyNote size={22} style={{ color: '#c084fc' }} />
            Anotações
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {openCount} pendente{openCount !== 1 ? 's' : ''} · fiado, lembretes e anotações gerais
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: '#7c3aed' }}>
          <Plus size={16} /> Nova anotação
        </button>
      </div>

      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: tab === t.id ? 'rgba(124,58,237,0.22)' : '#130e1e',
              color: tab === t.id ? '#e9d5ff' : '#6b7280',
              border: `1px solid ${tab === t.id ? 'rgba(124,58,237,0.35)' : '#2d2248'}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={CARD}>
          <StickyNote size={28} className="mx-auto mb-3" style={{ color: '#3a3050' }} />
          <div className="text-sm text-gray-500">Nenhuma anotação por aqui ainda.</div>
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.map(note => (
            <NoteCard key={note.id} note={note} account={accountsById[note.accountId]} loyaltyAccount={loyaltyById[note.loyaltyId]}
              onEdit={handleEdit} onDelete={handleDelete} onToggleResolved={toggleNoteResolved} />
          ))}
        </div>
      )}

      {showForm && (
        <NoteForm note={editing} accounts={accounts} loyaltyAccounts={loyaltyAccounts}
          onClose={() => { setShowForm(false); setEditing(null) }} onSave={handleSave} />
      )}
    </div>
  )
}
