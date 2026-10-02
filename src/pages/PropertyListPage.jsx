import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'
import { useAuth } from '../hooks/useAuth'
import { PropertyForm } from '../components/PropertyForm'

// 家賃を「¥128,000」形式に整形する
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')}`

// 物件一覧画面（ログイン必須）
export function PropertyListPage() {
  const { user } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 新規登録フォームの表示状態
  const [showCreateForm, setShowCreateForm] = useState(false)
  // 編集中の物件 ID（編集していないときは null）
  const [editingId, setEditingId] = useState(null)

  // 初回表示時に Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError(`物件の取得に失敗しました：${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録：登録した物件を一覧の先頭に追加する
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
    setShowCreateForm(false)
  }

  // 更新：一覧の該当物件を更新後の内容に置き換える
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除：確認ダイアログで OK のときのみ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setError('')
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError(`削除に失敗しました：${err.message}`)
    }
  }

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
          <button type="button" className="secondary" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      {/* 新規登録 */}
      <section className="create-section">
        {showCreateForm ? (
          <div className="panel">
            <h2>物件を登録</h2>
            <PropertyForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setShowCreateForm(true)}>
            ＋ 物件を登録
          </button>
        )}
      </section>

      {error && <p className="message error">{error}</p>}

      {/* 一覧 */}
      {loading ? (
        <p className="empty">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty">登録されている物件はありません。</p>
      ) : (
        <main className="property-grid">
          {properties.map((property) =>
            editingId === property.id ? (
              // 編集中の物件はカードの代わりに編集フォームを表示する
              <article key={property.id} className="property-card">
                <PropertyForm
                  initialValues={property}
                  onSubmit={(values) => handleUpdate(property.id, values)}
                  onCancel={() => setEditingId(null)}
                />
              </article>
            ) : (
              <article key={property.id} className="property-card">
                <h2>{property.name}</h2>
                <p className="rent">
                  {formatRent(property.rent)}
                  <span> / 月</span>
                </p>
                <p className="area">
                  {property.area}
                  <span className="layout">{property.layout}</span>
                </p>
                <div className="card-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setEditingId(property.id)}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(property)}
                  >
                    削除
                  </button>
                </div>
              </article>
            ),
          )}
        </main>
      )}
    </div>
  )
}
