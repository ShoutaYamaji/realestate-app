import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// ログイン画面・会員登録画面用のルート。ログイン済みなら物件一覧へリダイレクトする
export function PublicRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return <p className="loading">読み込み中...</p>
  }

  if (session) {
    return <Navigate to="/properties" replace />
  }

  return <Outlet />
}
