-- Polls table
create table polls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid references auth.users,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  is_multiple_choice boolean default false,
  max_votes_per_user int default 1,
  qr_code_url text
);

-- Options table
create table options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls on delete cascade,
  text text not null,
  created_at timestamp with time zone default now()
);

-- Votes table
create table votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls on delete cascade,
  option_id uuid references options on delete cascade,
  user_id uuid references auth.users,
  created_at timestamp with time zone default now(),
  unique(poll_id, user_id, option_id)
);

-- Indexes for performance
create index if not exists idx_polls_created_by on polls(created_by);
create index if not exists idx_polls_expires_at on polls(expires_at);

create index if not exists idx_options_poll_id on options(poll_id);

create index if not exists idx_votes_poll_id on votes(poll_id);
create index if not exists idx_votes_option_id on votes(option_id);
create index if not exists idx_votes_user_id on votes(user_id);