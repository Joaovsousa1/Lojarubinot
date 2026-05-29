import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import { ADMIN_SLUG } from './lib/supabase'

import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import CoinsModule from './components/Coins/CoinsModule'
import ItemsModule from './components/Items/ItemsModule'
import AccountsModule from './components/Accounts/AccountsModule'
import Settings from './components/Settings/Settings'
import ToolsModule from './components/Tools/ToolsModule'

import LoginPage from './pages/LoginPage'
import PlanExpiredPage from './pages/PlanExpiredPage'
import AdminPanel from './pages/AdminPanel'
import MonthlyReport from './components/Reports/MonthlyReport'

// ── Toast notifications ────────────────────────────────────────────────────
function ToastContainer() {
  const { toasts, removeToast } = useApp()
  if (!toasts.length) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
      {toasts.map(t => (
        <div key={t.id}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '13px 16px', borderRadius: 14,
            backgroundColor: t.type === 'success' ? '#14532d' : '#1c1020',
            border: `1px solid ${t.type === 'success' ? '#16a34a' : '#ef4444'}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${t.type === 'success' ? '#16a34a33' : '#ef444433'}`,
            color: t.type === 'success' ? '#4ade80' : '#fca5a5',
            fontSize: 13, fontWeight: 500, lineHeight: 1.45,
            animation: 'slideIn 0.25s ease',
          }}>
          <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>
            {t.type === 'success' ? '✅' : '⚠️'}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button onClick={() => removeToast(t.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6, fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }}>
            ×
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  )
}

// ── Main app shell ─────────────────────────────────────────────────────────
function AppShell() {
  const { activeModule } = useApp()
  const map = {
    dashboard: <Dashboard />,
    coins:     <CoinsModule />,
    items:     <ItemsModule />,
    accounts:  <AccountsModule />,
    tools:     <ToolsModule />,
    reports:   <MonthlyReport />,
    settings:  <Settings />,
  }
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0e0919' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          {map[activeModule] ?? <Dashboard />}
        </main>
        <footer className="text-center py-3 px-4 text-xs" style={{ color: '#4b4560', borderTop: '1px solid #2a2035' }}>
          Site desenvolvido por <span style={{ color: '#7c3aed' }}>Kiara Store</span>
          {' · '}
          <a
            href="https://wa.me/553484144427?text=Ol%C3%A1%2C%20tenho%20uma%20sugest%C3%A3o%20para%20o%20site!"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#9461f7', textDecoration: 'underline' }}>
            Sugestões ou melhorias? Clique aqui
          </a>
        </footer>
      </div>
      <ToastContainer />
    </div>
  )
}

// ── Plan expiry banner (injected into app when close to expiry) ────────────
function ExpiryBanner() {
  const { profile } = useAuth()
  if (!profile?.plan_expires_at) return null
  const expiry = new Date(profile.plan_expires_at)
  if (isNaN(expiry)) return null
  const daysLeft = Math.ceil((expiry - new Date()) / 86400000)
  if (daysLeft > 7) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl text-sm shadow-2xl"
      style={{
        backgroundColor: daysLeft <= 3 ? '#7f1d1d' : '#78350f',
        border: `1px solid ${daysLeft <= 3 ? '#dc2626' : '#d97706'}`,
        color: daysLeft <= 3 ? '#fca5a5' : '#fde68a',
      }}>
      ⚠ Seu plano vence em <strong>{daysLeft} dia{daysLeft !== 1 ? 's' : ''}</strong>
    </div>
  )
}

// ── Route guards ───────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user, loading, planActive, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (isAdmin) return children            // admin never gets blocked
  if (!planActive) return <PlanExpiredPage />
  return (
    <>
      {children}
      <ExpiryBanner />
    </>
  )
}

function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user || !isAdmin) return <Navigate to="/login" replace />
  return children
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1025' }}>
      <div className="text-center space-y-3">
        <div className="text-4xl">💎</div>
        <div className="text-sm text-gray-500">Carregando...</div>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path={`/${ADMIN_SLUG}`} element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          } />

          <Route path="/*" element={
            <RequireAuth>
              <AppProvider>
                <AppShell />
              </AppProvider>
            </RequireAuth>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
