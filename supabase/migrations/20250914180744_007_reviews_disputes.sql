create table if not exists ride_reviews (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id) on delete cascade,
  reviewer_id uuid references users(id),
  reviewee_id uuid references users(id),
  rating int check (rating >=1 and rating <=5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists disputes (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id) on delete cascade,
  raised_by uuid references users(id),
  description text,
  status text default 'pending',
  resolution text,
  created_at timestamptz default now()
);