-- Store the role-specific final answer separately from the earlier shared Q5.
alter table public.interviews
  add column if not exists q5_role_specific text;
