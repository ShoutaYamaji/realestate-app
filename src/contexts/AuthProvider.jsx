import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthContext } from './authContext'

// Supabase のセッションを監視し、子コンポーネントへ提供する
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // 初回のセッション取得が終わるまでは true
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 起動時に保存済みのセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの状態変化を監視する
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // アンマウント時に監視を解除する
    return () => data.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
