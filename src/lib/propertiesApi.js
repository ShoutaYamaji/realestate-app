import { supabase } from './supabaseClient'

// 物件テーブルへの CRUD 操作をまとめたモジュール
// 表示・編集・削除できる範囲は Supabase 側の RLS で「自分の物件のみ」に制限されている

const TABLE = 'properties'

// 画面で使う列のみ取得する
const COLUMNS = 'id, name, rent, area, layout, created_at'

// 一覧取得（SELECT）。新しく登録した順に並べる
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 新規登録（INSERT）。user_id は DB 側の既定値（auth.uid()）で自動設定される
export async function createProperty(property) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(property)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 更新（UPDATE）
export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(property)
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) throw error
}
