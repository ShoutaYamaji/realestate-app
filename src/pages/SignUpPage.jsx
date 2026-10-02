import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

// 会員登録画面
export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    setSubmitting(false)
    if (error) {
      setError(`会員登録に失敗しました：${error.message}`)
      return
    }

    // Supabase でメール確認が有効な場合はセッションが返らないため、確認を促す
    if (!data.session) {
      setNotice('確認メールを送信しました。メール内のリンクをクリックしてから、ログインしてください。')
    }
    // セッションが返った場合は PublicRoute が物件一覧へ遷移させる
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          パスワード（6文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        {error && <p className="message error">{error}</p>}
        {notice && <p className="message notice">{notice}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>

        <p className="switch-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
