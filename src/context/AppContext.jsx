import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { generateId } from '../utils/helpers'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  servers: [
    'Auroria','Belaria','Bellum','Divinian','Elysian','Etherian',
    'Grimoria I','Grimoria II','Grimoria III','Grimoria IV',
    'Halorian','Lunarian','Mystian','Serenian','Solarian',
    'Spectrum','Tenebrium','Vesperia',
  ],
  coinPrices: { buy1k: 87, buy10k: 87, sell: 92 },
  minCoinBalance: 10000,
}

export function AppProvider({ children }) {
  const { user } = useAuth()

  const [coins, setCoins]       = useState([])
  const [items, setItems]       = useState([])
  const [accounts, setAccounts] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [activeModule, setActiveModule] = useState('dashboard')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [toasts, setToasts]     = useState([])
  const loadIdRef   = useRef(0)   // race condition guard
  const loadedForId = useRef(null) // skip reload when same user (token refresh)

  // ── Toast system ───────────────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'error') => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Load all data from Supabase ────────────────────────────────────────────
  const loadData = useCallback(async (userId) => {
    if (!userId) return
    const myLoad = ++loadIdRef.current
    setDataLoaded(false)

    const [
      { data: c, error: ce },
      { data: it, error: ie },
      { data: ac, error: ae },
      { data: st },
    ] = await Promise.all([
      supabase.from('coins').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('items').select('*').eq('user_id', userId).order('date_entry', { ascending: false }),
      supabase.from('accounts').select('*').eq('user_id', userId).order('date_entry', { ascending: false }),
      supabase.from('settings').select('*').eq('user_id', userId).single(),
    ])

    // Descarta resultado se uma carga mais recente já começou
    if (myLoad !== loadIdRef.current) return

    // Só atualiza o estado se não houve erro — evita apagar dados ao falhar
    if (ce) { addToast('Erro ao carregar coins. Tente recarregar.'); console.error('[loadData] coins:', ce.message) }
    else setCoins(c ?? [])

    if (ie) { addToast('Erro ao carregar itens. Tente recarregar.'); console.error('[loadData] items:', ie.message) }
    else setItems((it ?? []).map(dbToItem))

    if (ae) { addToast('Erro ao carregar contas. Tente recarregar.'); console.error('[loadData] accounts:', ae.message) }
    else setAccounts((ac ?? []).map(dbToAccount))

    let saved = st ? { ...DEFAULT_SETTINGS, ...st.data } : DEFAULT_SETTINGS
    if (saved.coinPrices.buy10k < 5) {
      saved = { ...saved, coinPrices: DEFAULT_SETTINGS.coinPrices }
    }
    setSettings(saved)
    setDataLoaded(true)
  }, [addToast])

  // Só recarrega quando o ID do usuário muda — ignora refresh de token
  useEffect(() => {
    const uid = user?.id ?? null
    if (uid === loadedForId.current) return
    loadedForId.current = uid
    if (uid) loadData(uid)
    else { setCoins([]); setItems([]); setAccounts([]); setDataLoaded(false) }
  }, [user?.id, loadData])

  // ── DB shape converters ────────────────────────────────────────────────────
  function dbToItem(row) {
    return {
      id: row.id, name: row.name, set: row.set, imageUrl: row.image_url,
      classification: row.classification, tier: row.tier, maxTier: row.max_tier,
      server: row.server, category: row.category, quantity: row.quantity,
      buyPriceRC: row.buy_price_rc, buyPricePIX: row.buy_price_pix,
      sellPriceRC: row.sell_price_rc, sellPricePIX: row.sell_price_pix,
      observation: row.observation, dateEntry: row.date_entry,
      sales: row.sales ?? [], priceHistory: row.price_history ?? [],
    }
  }

  function itemToDb(item) {
    return {
      user_id: user.id, name: item.name, set: item.set, image_url: item.imageUrl,
      classification: item.classification, tier: item.tier, max_tier: item.maxTier,
      server: item.server, category: item.category, quantity: item.quantity,
      buy_price_rc: item.buyPriceRC, buy_price_pix: item.buyPricePIX,
      sell_price_rc: item.sellPriceRC, sell_price_pix: item.sellPricePIX,
      observation: item.observation, date_entry: item.dateEntry,
      sales: item.sales ?? [], price_history: item.priceHistory ?? [],
    }
  }

  function dbToAccount(row) {
    return {
      id: row.id, server: row.server, vocation: row.vocation, level: row.level,
      charName: row.char_name, buyPrice: row.buy_price, sellPrice: row.sell_price,
      status: row.status, dateEntry: row.date_entry, dateSold: row.date_sold,
      skills: row.skills ?? {}, charmPoints: row.charm_points,
      bosstiaryPoints: row.bosstiary_points, huntingTaskPoints: row.hunting_task_points,
      vipDays: row.vip_days, loyaltySkill: row.loyalty_skill,
      outfits: row.outfits ?? [], addons: row.addons ?? [],
      mounts: row.mounts ?? [], notableItems: row.notable_items ?? [],
      notes: row.notes, screenshot: row.screenshot,
    }
  }

  function accountToDb(acc) {
    return {
      user_id: user.id, server: acc.server, vocation: acc.vocation, level: acc.level,
      char_name: acc.charName, buy_price: acc.buyPrice, sell_price: acc.sellPrice,
      status: acc.status, date_entry: acc.dateEntry, date_sold: acc.dateSold,
      skills: acc.skills ?? {}, charm_points: acc.charmPoints,
      bosstiary_points: acc.bosstiaryPoints, hunting_task_points: acc.huntingTaskPoints,
      vip_days: acc.vipDays, loyalty_skill: acc.loyaltySkill,
      outfits: acc.outfits ?? [], addons: acc.addons ?? [],
      mounts: acc.mounts ?? [], notable_items: acc.notableItems ?? [],
      notes: acc.notes, screenshot: acc.screenshot,
    }
  }

  // ── Coins ──────────────────────────────────────────────────────────────────
  const addCoinTransaction = async (tx) => {
    const row = { ...tx, id: generateId(), user_id: user.id }
    setCoins(prev => [row, ...prev])
    const { error } = await supabase.from('coins').insert(row)
    if (error) {
      setCoins(prev => prev.filter(c => c.id !== row.id))
      addToast(`Erro ao salvar transação: ${error.message}`)
      console.error('[addCoinTransaction]', error)
    }
  }

  const deleteCoinTransaction = async (id) => {
    const backup = coins.find(c => c.id === id)
    setCoins(prev => prev.filter(c => c.id !== id))
    const { error } = await supabase.from('coins').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
      if (backup) setCoins(prev => [backup, ...prev])
      addToast(`Erro ao excluir transação: ${error.message}`)
      console.error('[deleteCoinTransaction]', error)
    }
  }

  // ── Items ──────────────────────────────────────────────────────────────────
  const addItem = async (item) => {
    const newItem = {
      ...item,
      id: generateId(),
      sales: [],
      priceHistory: [],
      dateEntry: item.dateEntry ?? new Date().toISOString(),
    }
    setItems(prev => [newItem, ...prev])
    const { error } = await supabase.from('items').insert(itemToDb(newItem))
    if (error) {
      setItems(prev => prev.filter(it => it.id !== newItem.id))
      addToast(`Erro ao salvar item "${newItem.name}": ${error.message}`)
      console.error('[addItem]', error)
    } else {
      addToast(`"${newItem.name}" salvo com sucesso!`, 'success')
    }
  }

  const updateItem = async (id, updates) => {
    const prev = items.find(it => it.id === id)
    if (!prev) return

    const priceFields = ['buyPriceRC', 'buyPricePIX', 'sellPriceRC', 'sellPricePIX']
    const priceChanged = priceFields.some(k => updates[k] !== undefined && Number(updates[k]) !== Number(prev[k]))
    const newEntry = priceChanged ? [{
      date: new Date().toISOString(),
      buyRC:  Number(updates.buyPriceRC  ?? prev.buyPriceRC),
      buyPIX: Number(updates.buyPricePIX ?? prev.buyPricePIX),
      sellRC: Number(updates.sellPriceRC ?? prev.sellPriceRC),
      sellPIX:Number(updates.sellPricePIX?? prev.sellPricePIX),
    }] : []
    const updated = { ...prev, ...updates, priceHistory: [...(prev.priceHistory ?? []), ...newEntry].slice(-8) }

    setItems(list => list.map(it => it.id === id ? updated : it))
    const { error } = await supabase.from('items').update(itemToDb(updated)).eq('id', id).eq('user_id', user.id)
    if (error) {
      setItems(list => list.map(it => it.id === id ? prev : it))
      addToast(`Erro ao atualizar item: ${error.message}`)
      console.error('[updateItem]', error)
    }
  }

  const deleteItem = async (id) => {
    const backup = items.find(it => it.id === id)
    setItems(prev => prev.filter(it => it.id !== id))
    const { error } = await supabase.from('items').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
      if (backup) setItems(prev => [backup, ...prev])
      addToast(`Erro ao excluir item: ${error.message}`)
      console.error('[deleteItem]', error)
    }
  }

  const sellItem = async (itemId, sale) => {
    const prev = items.find(it => it.id === itemId)
    if (!prev) return

    const profitRC  = (sale.soldForRC  || 0) - (prev.buyPriceRC  || 0) * sale.quantity
    const profitPIX = (sale.soldForPIX || 0) - (prev.buyPricePIX || 0) * sale.quantity
    const updated = {
      ...prev,
      quantity: Math.max(0, prev.quantity - sale.quantity),
      sales: [...(prev.sales || []), { ...sale, id: generateId(), profitRC, profitPIX }],
    }

    setItems(list => list.map(it => it.id === itemId ? updated : it))
    const { error } = await supabase.from('items').update(itemToDb(updated)).eq('id', itemId).eq('user_id', user.id)
    if (error) {
      setItems(list => list.map(it => it.id === itemId ? prev : it))
      addToast(`Erro ao registrar venda: ${error.message}`)
      console.error('[sellItem]', error)
    }
  }

  // ── Accounts ───────────────────────────────────────────────────────────────
  const addAccount = async (acc) => {
    const newAcc = { ...acc, id: generateId(), dateEntry: acc.dateEntry ?? new Date().toISOString() }
    setAccounts(prev => [newAcc, ...prev])
    const { error } = await supabase.from('accounts').insert(accountToDb(newAcc))
    if (error) {
      setAccounts(prev => prev.filter(a => a.id !== newAcc.id))
      addToast(`Erro ao salvar conta: ${error.message}`)
      console.error('[addAccount]', error)
    } else {
      addToast('Conta salva com sucesso!', 'success')
    }
  }

  const updateAccount = async (id, updates) => {
    const prev = accounts.find(a => a.id === id)
    if (!prev) return
    const updated = { ...prev, ...updates }
    setAccounts(list => list.map(a => a.id === id ? updated : a))
    const { error } = await supabase.from('accounts').update(accountToDb(updated)).eq('id', id).eq('user_id', user.id)
    if (error) {
      setAccounts(list => list.map(a => a.id === id ? prev : a))
      addToast(`Erro ao atualizar conta: ${error.message}`)
      console.error('[updateAccount]', error)
    }
  }

  const deleteAccount = async (id) => {
    const backup = accounts.find(a => a.id === id)
    setAccounts(prev => prev.filter(a => a.id !== id))
    const { error } = await supabase.from('accounts').delete().eq('id', id).eq('user_id', user.id)
    if (error) {
      if (backup) setAccounts(prev => [backup, ...prev])
      addToast(`Erro ao excluir conta: ${error.message}`)
      console.error('[deleteAccount]', error)
    }
  }

  // ── Settings ───────────────────────────────────────────────────────────────
  const updateSettings = async (updates) => {
    const backup = settings
    const updated = { ...settings, ...updates }
    setSettings(updated)
    const { error } = await supabase.from('settings').upsert({ user_id: user.id, data: updated })
    if (error) {
      setSettings(backup)
      addToast(`Erro ao salvar configurações: ${error.message}`)
      console.error('[updateSettings]', error)
    }
  }

  const addServer = (srv) => {
    if (!srv || settings.servers.includes(srv)) return
    updateSettings({ servers: [...settings.servers, srv] })
  }

  const removeServer = (srv) => {
    updateSettings({ servers: settings.servers.filter(s => s !== srv) })
  }

  // ── Export / Import ────────────────────────────────────────────────────────
  const exportData = () => {
    const data = { coins, items, accounts, settings, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rubin-estoque-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (json) => {
    try {
      const d = JSON.parse(json)
      if (!d || typeof d !== 'object') throw new Error('JSON inválido')

      // Valida estrutura antes de apagar qualquer coisa
      if (d.coins    && !Array.isArray(d.coins))    throw new Error('Campo coins inválido')
      if (d.items    && !Array.isArray(d.items))    throw new Error('Campo items inválido')
      if (d.accounts && !Array.isArray(d.accounts)) throw new Error('Campo accounts inválido')

      // Só deleta e insere após validação bem-sucedida
      if (d.coins !== undefined) {
        const { error } = await supabase.from('coins').delete().eq('user_id', user.id)
        if (error) throw new Error(`Erro ao limpar coins: ${error.message}`)
        if (d.coins.length) await supabase.from('coins').insert(d.coins.map(c => ({ ...c, user_id: user.id })))
        setCoins(d.coins)
      }
      if (d.items !== undefined) {
        const { error } = await supabase.from('items').delete().eq('user_id', user.id)
        if (error) throw new Error(`Erro ao limpar itens: ${error.message}`)
        if (d.items.length) await supabase.from('items').insert(d.items.map(it => itemToDb(it)))
        setItems(d.items)
      }
      if (d.accounts !== undefined) {
        const { error } = await supabase.from('accounts').delete().eq('user_id', user.id)
        if (error) throw new Error(`Erro ao limpar contas: ${error.message}`)
        if (d.accounts.length) await supabase.from('accounts').insert(d.accounts.map(a => accountToDb(a)))
        setAccounts(d.accounts)
      }
      if (d.settings) await updateSettings(d.settings)
      return true
    } catch (err) {
      addToast(`Erro ao importar dados: ${err.message}`)
      return false
    }
  }

  return (
    <AppContext.Provider value={{
      coins, items, accounts, settings, activeModule, setActiveModule, dataLoaded,
      toasts, removeToast,
      addCoinTransaction, deleteCoinTransaction,
      addItem, updateItem, deleteItem, sellItem,
      addAccount, updateAccount, deleteAccount,
      updateSettings, addServer, removeServer,
      exportData, importData,
      setCoins, setItems, setAccounts,
      loadData: () => user?.id && loadData(user.id),
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
