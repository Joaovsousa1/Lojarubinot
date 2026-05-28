import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
  coinPrices: { buy1k: 0.86, buy10k: 0.87, sell: 0.92 },
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

  // ── Load all data from Supabase ────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!user) return
    setDataLoaded(false)

    const [{ data: c }, { data: it }, { data: ac }, { data: st }] = await Promise.all([
      supabase.from('coins').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      supabase.from('items').select('*').eq('user_id', user.id).order('date_entry', { ascending: false }),
      supabase.from('accounts').select('*').eq('user_id', user.id).order('date_entry', { ascending: false }),
      supabase.from('settings').select('*').eq('user_id', user.id).single(),
    ])

    setCoins(c ?? [])
    setItems((it ?? []).map(dbToItem))
    setAccounts((ac ?? []).map(dbToAccount))
    setSettings(st ? { ...DEFAULT_SETTINGS, ...st.data } : DEFAULT_SETTINGS)
    setDataLoaded(true)
  }, [user])

  useEffect(() => { loadData() }, [loadData])

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
    await supabase.from('coins').insert(row)
  }

  const deleteCoinTransaction = async (id) => {
    setCoins(prev => prev.filter(c => c.id !== id))
    await supabase.from('coins').delete().eq('id', id).eq('user_id', user.id)
  }

  // ── Items ──────────────────────────────────────────────────────────────────
  const addItem = async (item) => {
    const newItem = { ...item, id: generateId(), sales: [], priceHistory: [], dateEntry: item.dateEntry ?? new Date().toISOString() }
    setItems(prev => [newItem, ...prev])
    await supabase.from('items').insert(itemToDb(newItem))
  }

  const updateItem = async (id, updates) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it
      const priceFields = ['buyPriceRC', 'buyPricePIX', 'sellPriceRC', 'sellPricePIX']
      const priceChanged = priceFields.some(k => updates[k] !== undefined && Number(updates[k]) !== Number(it[k]))
      const newEntry = priceChanged ? [{
        date: new Date().toISOString(),
        buyRC:  Number(updates.buyPriceRC  ?? it.buyPriceRC),
        buyPIX: Number(updates.buyPricePIX ?? it.buyPricePIX),
        sellRC: Number(updates.sellPriceRC ?? it.sellPriceRC),
        sellPIX:Number(updates.sellPricePIX?? it.sellPricePIX),
      }] : []
      const updated = { ...it, ...updates, priceHistory: [...(it.priceHistory ?? []), ...newEntry].slice(-8) }
      supabase.from('items').update(itemToDb(updated)).eq('id', id).eq('user_id', user.id)
      return updated
    }))
  }

  const deleteItem = async (id) => {
    setItems(prev => prev.filter(it => it.id !== id))
    await supabase.from('items').delete().eq('id', id).eq('user_id', user.id)
  }

  const sellItem = async (itemId, sale) => {
    setItems(prev => prev.map(it => {
      if (it.id !== itemId) return it
      const profitRC  = (sale.soldForRC  || 0) - (it.buyPriceRC  || 0) * sale.quantity
      const profitPIX = (sale.soldForPIX || 0) - (it.buyPricePIX || 0) * sale.quantity
      const updated = {
        ...it,
        quantity: Math.max(0, it.quantity - sale.quantity),
        sales: [...(it.sales || []), { ...sale, id: generateId(), profitRC, profitPIX }],
      }
      supabase.from('items').update(itemToDb(updated)).eq('id', itemId).eq('user_id', user.id)
      return updated
    }))
  }

  // ── Accounts ───────────────────────────────────────────────────────────────
  const addAccount = async (acc) => {
    const newAcc = { ...acc, id: generateId(), dateEntry: acc.dateEntry ?? new Date().toISOString() }
    setAccounts(prev => [newAcc, ...prev])
    await supabase.from('accounts').insert(accountToDb(newAcc))
  }

  const updateAccount = async (id, updates) => {
    setAccounts(prev => prev.map(a => {
      if (a.id !== id) return a
      const updated = { ...a, ...updates }
      supabase.from('accounts').update(accountToDb(updated)).eq('id', id).eq('user_id', user.id)
      return updated
    }))
  }

  const deleteAccount = async (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
    await supabase.from('accounts').delete().eq('id', id).eq('user_id', user.id)
  }

  // ── Settings ───────────────────────────────────────────────────────────────
  const updateSettings = async (updates) => {
    const updated = { ...settings, ...updates }
    setSettings(updated)
    await supabase.from('settings').upsert({ user_id: user.id, data: updated })
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
      if (d.coins)    { setCoins(d.coins);    await supabase.from('coins').delete().eq('user_id', user.id);    if (d.coins.length) await supabase.from('coins').insert(d.coins.map(c => ({ ...c, user_id: user.id }))) }
      if (d.items)    { setItems(d.items);    await supabase.from('items').delete().eq('user_id', user.id);    if (d.items.length) await supabase.from('items').insert(d.items.map(it => itemToDb(it))) }
      if (d.accounts) { setAccounts(d.accounts); await supabase.from('accounts').delete().eq('user_id', user.id); if (d.accounts.length) await supabase.from('accounts').insert(d.accounts.map(a => accountToDb(a))) }
      if (d.settings) await updateSettings(d.settings)
      return true
    } catch { return false }
  }

  return (
    <AppContext.Provider value={{
      coins, items, accounts, settings, activeModule, setActiveModule, dataLoaded,
      addCoinTransaction, deleteCoinTransaction,
      addItem, updateItem, deleteItem, sellItem,
      addAccount, updateAccount, deleteAccount,
      updateSettings, addServer, removeServer,
      exportData, importData,
      setCoins, setItems, setAccounts,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
