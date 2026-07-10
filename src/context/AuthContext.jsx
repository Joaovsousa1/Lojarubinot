import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId, userEmail) => {
    setProfileLoading(true)
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!data) {
      const { data: created } = await supabase
        .from('profiles')
        .insert({ id: userId, email: userEmail ?? '', plan_active: true })
        .select()
        .single()
      data = created
    }

    setProfile(data ?? null)
    setProfileLoading(false)
  }

  useEffect(() => {
    let sub

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('[auth] getSession error:', error.message)
          try { Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-')) localStorage.removeItem(k) }) } catch {}
          setLoading(false)
          return
        }
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id, session.user.email)
      } catch (e) {
        console.error('[auth] init exception:', e.message)
        try { Object.keys(localStorage).forEach(k => { if (k.startsWith('sb-')) localStorage.removeItem(k) }) } catch {}
      } finally {
        setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(prev => {
        const next = session?.user ?? null
        if (prev?.id && next?.id && prev.id === next.id) return prev
        return next
      })
      if (session?.user) fetchProfile(session.user.id, session.user.email)
      else setProfile(null)
    })
    sub = subscription

    return () => sub?.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = () => user && fetchProfile(user.id, user.email)

  const OWNER_ACCESS = user?.email === 'regeditelite@gmail.com'

  const isAdmin   = OWNER_ACCESS || profile?.is_admin === true
  const planActive = OWNER_ACCESS || isAdmin || (
    profile?.plan_active === true &&
    (!profile?.plan_expires_at || new Date(profile.plan_expires_at) > new Date())
  )

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, planActive, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
