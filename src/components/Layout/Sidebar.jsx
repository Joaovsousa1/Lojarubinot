import React from 'react'
import { LayoutDashboard, Coins, Package, Users, Settings, Wrench, FileBarChart2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

// ── Gem logo (mini) ────────────────────────────────────────────────────────────
function GemIcon({ size = 28 }) {
  const id = 'sb'
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}f`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <ellipse cx="22" cy="30" rx="13" ry="7" fill="#8b5cf6" opacity="0.5" filter={`url(#${id}f)`} />
      <polygon points="22,3 38,13 38,31 22,41 6,31 6,13" fill={`url(#${id}a)`} />
      <polygon points="22,3 38,13 22,18 6,13" fill={`url(#${id}b)`} />
      <text x="14" y="31" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="18" fill="white" style={{ userSelect: 'none' }}>R</text>
    </svg>
  )
}

export default function Sidebar() {
  const { activeModule, setActiveModule, accountsTab, setAccountsTab, coins, items, accounts, settings } = useApp()
  const { profile } = useAuth()

  const totalCoins   = coins.reduce((s, c) => c.type === 'entrada' ? s + c.quantity : s - c.quantity, 0)
  const minBalance   = settings.minCoinBalance ?? 10000
  const lowCoins     = totalCoins < minBalance
  const itemsInStock = items.reduce((s, i) => s + i.quantity, 0)
  const accAvailable = accounts.filter(a => a.status === 'disponível').length

  const fmtCoins = totalCoins > 0
    ? (totalCoins >= 1000 ? Math.round(totalCoins / 1000) + 'k' : String(totalCoins))
    : null

  const NAV_GROUPS = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard',    Icon: LayoutDashboard, badge: null,            alert: false },
      ]
    },
    {
      label: 'ESTOQUE',
      items: [
        { id: 'coins',    label: 'Coins',         Icon: Coins,           badge: fmtCoins,        alert: lowCoins },
        { id: 'items',    label: 'Itens',         Icon: Package,         badge: itemsInStock || null, alert: false },
        { id: 'accounts', label: 'Contas',        Icon: Users,           badge: accAvailable || null, alert: false, subItems: [
          { id: 'loyalty', label: '⭐ Loyalty' },
        ]},
      ]
    },
    {
      label: 'ANÁLISES',
      items: [
        { id: 'reports',  label: 'Relatórios',    Icon: FileBarChart2,   badge: null,            alert: false },
      ]
    },
    {
      label: 'SISTEMA',
      items: [
        { id: 'tools',    label: 'Ferramentas',   Icon: Wrench,          badge: null,            alert: false },
        { id: 'settings', label: 'Configurações', Icon: Settings,        badge: null,            alert: false },
      ]
    },
  ]

  const userName = profile?.name || profile?.email?.split('@')[0] || 'Usuário'
  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        width: 224,
        background: 'linear-gradient(180deg, #1e1330 0%, #150e24 60%, #0e0919 100%)',
        borderRight: '1px solid rgba(124,58,237,0.18)',
      }}
    >
      {/* ── Logo ── */}
      <div className="p-5" style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
        <div className="flex items-center gap-3">
          <GemIcon size={34} />
          <div>
            <div className="font-black text-white text-base leading-tight" style={{ letterSpacing: '-0.3px' }}>Rubinot</div>
            <div className="text-xs font-semibold" style={{ color: '#7c3aed', letterSpacing: '0.04em' }}>Gestão de Estoque</div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div className="px-2 mb-1.5 text-[10px] font-bold tracking-widest" style={{ color: '#4b3a6b' }}>
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ id, label, Icon, badge, alert, subItems }) => {
                const active = activeModule === id
                return (
                  <div key={id}>
                    <button
                      onClick={() => { setActiveModule(id); if (id === 'accounts') setAccountsTab('contas') }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative overflow-hidden"
                      style={{
                        backgroundColor: active ? 'rgba(124,58,237,0.22)' : 'transparent',
                        color: active ? '#e9d5ff' : '#6b7280',
                        boxShadow: active ? 'inset 0 0 0 1px rgba(124,58,237,0.35)' : 'none',
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#d1d5db' } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280' } }}
                    >
                      {active && (
                        <div style={{
                          position: 'absolute', left: 0, top: '15%', bottom: '15%',
                          width: 3, borderRadius: '0 3px 3px 0',
                          background: 'linear-gradient(180deg, #e879f9, #7c3aed)',
                          boxShadow: '0 0 8px #7c3aed',
                        }} />
                      )}
                      <Icon size={17} style={{ color: active ? '#c084fc' : 'inherit', flexShrink: 0 }} />
                      {label}
                      {badge && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: alert ? '#7f1d1d' : 'rgba(124,58,237,0.3)',
                            color: alert ? '#f87171' : '#c084fc',
                            border: alert ? '1px solid #dc262655' : '1px solid rgba(124,58,237,0.4)',
                          }}>
                          {badge}
                        </span>
                      )}
                      {!badge && alert && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: '#7f1d1d', color: '#f87171', border: '1px solid #dc262655' }}>
                          !
                        </span>
                      )}
                    </button>

                    {/* Sub-items */}
                    {subItems && subItems.map(sub => {
                      const subActive = active && accountsTab === sub.id
                      return (
                        <button
                          key={sub.id}
                          onClick={() => { setActiveModule(id); setAccountsTab(sub.id) }}
                          className="w-full flex items-center gap-2 rounded-lg transition-all duration-150"
                          style={{
                            padding: '4px 10px 4px 36px',
                            backgroundColor: subActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                            color: subActive ? '#c084fc' : '#4b5563',
                            fontSize: 11,
                            fontWeight: subActive ? 700 : 500,
                          }}
                          onMouseEnter={e => { if (!subActive) { e.currentTarget.style.color = '#9ca3af' } }}
                          onMouseLeave={e => { if (!subActive) { e.currentTarget.style.color = '#4b5563' } }}
                        >
                          <span style={{ opacity: 0.5, fontSize: 9 }}>▸</span>
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Low coins warning ── */}
      {lowCoins && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-xl text-xs"
          style={{ backgroundColor: '#7f1d1d22', border: '1px solid #dc262633', color: '#f87171' }}>
          ⚠ Coins abaixo do mínimo ({(minBalance/1000).toFixed(0)}k)
        </div>
      )}

      {/* ── User profile ── */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{ backgroundColor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black"
            style={{ background: 'linear-gradient(135deg,#9333ea,#6d28d9)', color: '#fff', boxShadow: '0 2px 10px rgba(124,58,237,0.4)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{userName}</div>
            <div className="text-[10px] truncate" style={{ color: '#7c3aed' }}>Plano ativo</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
