import React from 'react'
import { LayoutDashboard, Coins, Package, Users, Settings, Wrench } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Sidebar() {
  const { activeModule, setActiveModule, coins, items, accounts, settings } = useApp()

  const totalCoins   = coins.reduce((s, c) => c.type === 'entrada' ? s + c.quantity : s - c.quantity, 0)
  const minBalance   = settings.minCoinBalance ?? 10000
  const lowCoins     = totalCoins < minBalance
  const itemsInStock = items.reduce((s, i) => s + i.quantity, 0)
  const accAvailable = accounts.filter(a => a.status === 'disponível').length

  const fmtCoins = totalCoins > 0
    ? (totalCoins >= 1000 ? Math.round(totalCoins / 1000) + 'k' : String(totalCoins))
    : null

  const NAV = [
    { id: 'dashboard', label: 'Dashboard',    Icon: LayoutDashboard, badge: null,         alert: false },
    { id: 'coins',     label: 'Coins',         Icon: Coins,           badge: fmtCoins,     alert: lowCoins },
    { id: 'items',     label: 'Itens',         Icon: Package,         badge: itemsInStock || null, alert: false },
    { id: 'accounts',  label: 'Contas',        Icon: Users,           badge: accAvailable || null, alert: false },
    { id: 'tools',     label: 'Ferramentas',   Icon: Wrench,          badge: null,         alert: false },
    { id: 'settings',  label: 'Configurações', Icon: Settings,        badge: null,         alert: false },
  ]

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{ width: 220, backgroundColor: '#2a2035', borderRight: '1px solid #3a3050' }}
    >
      <div className="p-5 border-b" style={{ borderColor: '#3a3050' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <div>
            <div className="font-bold text-white text-sm leading-tight">RubinOT</div>
            <div className="text-xs" style={{ color: '#9461f7' }}>Gestão de Estoque</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ id, label, Icon, badge, alert }) => {
          const active = activeModule === id
          return (
            <button
              key={id}
              onClick={() => setActiveModule(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: active ? '#7c3aed' : 'transparent',
                color: active ? '#fff' : '#9ca3af',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#3a2f50' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <Icon size={18} />
              {label}
              {badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: alert ? '#7f1d1d' : '#7c3aed44',
                    color: alert ? '#f87171' : '#c084fc',
                    border: alert ? '1px solid #dc262666' : 'none',
                  }}>
                  {badge}
                </span>
              )}
              {!badge && alert && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: '#7f1d1d', color: '#f87171', border: '1px solid #dc262666' }}>
                  !
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {lowCoins && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg text-xs"
          style={{ backgroundColor: '#7f1d1d33', border: '1px solid #dc262644', color: '#f87171' }}>
          ⚠ Coins abaixo do mínimo ({(minBalance / 1000).toFixed(0)}k)
        </div>
      )}

      <div className="p-4 text-xs text-center" style={{ color: '#4b3a6b', borderTop: '1px solid #3a3050' }}>
        v1.0 · 100% offline
      </div>
    </aside>
  )
}
