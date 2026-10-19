-- Add required 1–10 ratings for each of the five interview answers.
alter table public.interviews
  add column if not exists q1_score integer check (q1_score between 1 and 10),
  add column if not exists q2_score integer check (q2_score between 1 and 10),
  add column if not exists q3_score integer check (q3_score between 1 and 10),
  add column if not exists q4_score integer check (q4_score between 1 and 10),
  add column if not exists q5_score integer check (q5_score between 1 and 10);
