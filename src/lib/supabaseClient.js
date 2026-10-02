import { createClient } from '@supabase/supabase-js'

// .env から Supabase の接続情報を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase の接続情報が設定されていません。.env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください。',
  )
}

// アプリ全体で共有する Supabase クライアント
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
