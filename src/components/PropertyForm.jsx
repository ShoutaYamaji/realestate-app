import { useState } from 'react'

// フォームの初期値（新規登録時）
const EMPTY_FORM = { name: '', rent: '', area: '', layout: '' }

// 物件の新規登録・編集で共用するフォーム
// initialValues を渡すと編集モード、渡さないと新規登録モードになる
export function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValues)

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          name: initialValues.name,
          rent: String(initialValues.rent),
          area: initialValues.area,
          layout: initialValues.layout,
        }
      : EMPTY_FORM,
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 入力値を name 属性に対応する項目へ反映する
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit({
        name: form.name.trim(),
        rent: Number(form.rent),
        area: form.area.trim(),
        layout: form.layout.trim(),
      })
      // 新規登録後は次の入力のためにフォームを空にする
      if (!isEdit) setForm(EMPTY_FORM)
    } catch (err) {
      setError(`保存に失敗しました：${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label>
        物件名
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        家賃（円）
        <input
          name="rent"
          type="number"
          min="0"
          step="1"
          value={form.rent}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        エリア名
        <input name="area" value={form.area} onChange={handleChange} required />
      </label>

      <label>
        間取り
        <input
          name="layout"
          value={form.layout}
          onChange={handleChange}
          placeholder="例：1LDK"
          required
        />
      </label>

      {error && <p className="message error">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEdit ? '更新する' : '登録する'}
        </button>
      </div>
    </form>
  )
}
