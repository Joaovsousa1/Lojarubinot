import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const fetchProfile = async (userId) => {
    setProfileLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
    setProfileLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(prev => {
        const next = session?.user ?? null
        // Mesma ID → mantém o objeto existente para não disparar re-renders
        if (prev?.id && next?.id && prev.id === next.id) return prev
        return next
      })
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = () => user && fetchProfile(user.id)

  const isAdmin   = profile?.is_admin === true
  const planActive = isAdmin || (
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
