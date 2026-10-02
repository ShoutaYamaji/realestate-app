import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// ログイン済みユーザーのみ表示するルート。未ログインならログイン画面へリダイレクトする
export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return <p className="loading">読み込み中...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
