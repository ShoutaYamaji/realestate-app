import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { PropertyListPage } from './pages/PropertyListPage'

// ルーティング定義
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 未ログイン時のみ表示する画面 */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          {/* ログイン必須の画面 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/properties" element={<PropertyListPage />} />
          </Route>

          {/* それ以外のパスは物件一覧へ（未ログインならさらにログイン画面へ） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
