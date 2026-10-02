import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { properties } from '../data/properties'

// 家賃を「¥128,000」形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')}`

// 物件一覧画面（ログイン必須）
export function PropertyListPage() {
  const { user } = useAuth()

  const handleLogout = async () => {
    // ログアウト後は ProtectedRoute がログイン画面へリダイレクトする
    await supabase.auth.signOut()
  }

  return (
    <div className="property-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-user">
          <span>{user?.email}</span>
          <button type="button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="property-grid">
        {properties.map((property) => (
          <article key={property.id} className="property-card">
            <h2>{property.name}</h2>
            <p className="rent">
              {formatRent(property.rent)}
              <span> / 月</span>
            </p>
            <p className="area">{property.area}</p>
          </article>
        ))}
      </main>
    </div>
  )
}
