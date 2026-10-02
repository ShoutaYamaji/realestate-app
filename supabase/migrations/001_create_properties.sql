-- =========================================================
-- 物件テーブルの作成
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する
-- =========================================================

create table public.properties (
  id         bigint generated always as identity primary key,
  -- 登録したユーザー。未指定時はログイン中のユーザー ID が自動で入る
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) > 0),        -- 物件名
  rent       integer not null check (rent >= 0),                  -- 家賃（円）
  area       text not null check (char_length(area) > 0),        -- エリア名
  layout     text not null check (char_length(layout) > 0),      -- 間取り（例：1LDK）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.properties is '不動産物件';
comment on column public.properties.user_id is '物件を登録したユーザー';
comment on column public.properties.name is '物件名';
comment on column public.properties.rent is '家賃（円）';
comment on column public.properties.area is 'エリア名';
comment on column public.properties.layout is '間取り（例：1LDK）';

-- ユーザーごとの一覧取得を高速化するインデックス
create index properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にする
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- =========================================================
-- RLS（行レベルセキュリティ）
-- 自分が登録した物件のみ表示・登録・編集・削除できる
-- =========================================================

alter table public.properties enable row level security;

-- 表示：自分の物件のみ
create policy "自分の物件のみ表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 登録：自分のユーザー ID でのみ登録できる（他人名義での登録を防ぐ）
create policy "自分の物件として登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 編集：自分の物件のみ。所有者を他人に変更することも禁止する
create policy "自分の物件のみ編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 削除：自分の物件のみ
create policy "自分の物件のみ削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
