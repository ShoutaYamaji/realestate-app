import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'

// ログイン状態を取得するフック（AuthProvider の内側で使用する）
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}
