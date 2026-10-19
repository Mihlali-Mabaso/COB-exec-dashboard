# COB Executive Interview Tracker

A no-login interview form and read-only dashboard built with Next.js App Router, React, Tailwind CSS, and Supabase.

## Run locally

1. Install Node.js 18.17+ and dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase project URL and anon key.
3. Run `npm run dev`, then open `http://localhost:3000`.

The app inserts and reads `public.interviews`, using the exact column names in the supplied SQL. It does not require a Supabase service role key.

### Add question ratings to an existing table

The interview form now requires a 1–10 rating for each answer. Run [`supabase/migrations/20261019_add_question_scores.sql`](supabase/migrations/20261019_add_question_scores.sql) in the Supabase SQL editor before using the updated form. It adds `q1_score` through `q5_score`, each checked to be between 1 and 10. The dashboard shows each question rating and the average of the five ratings, and includes them in CSV exports. Existing interviews will have no question ratings until they are filled in.

The fifth question is tailored to the selected role. Run [`supabase/migrations/20261019_add_role_specific_final_question.sql`](supabase/migrations/20261019_add_role_specific_final_question.sql) to add `q5_role_specific` for those answers. The old `q5_active_initiative` column is retained for earlier records.

## Supabase setup

Run the provided table and RLS SQL in the Supabase SQL editor. The app needs public insert and select access through the anon key. For Supabase policies, inserts are validated by `WITH CHECK`; ensure the policy grants both read and insert if your editor or policy setup requires separate commands, for example:

```sql
create policy "Allow public insert" on public.interviews for insert with check (true);
create policy "Allow public read" on public.interviews for select using (true);
```

The supplied `FOR ALL USING (true)` policy enables read access; depending on PostgreSQL/Supabase policy semantics, its `WITH CHECK` also permits inserted rows. Because this app has no login, anyone with its public URL can read and submit records. Restrict access before using sensitive candidate information in production.

## Deploy to Vercel

Import the repository into Vercel and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables for the deployment environments you use. Redeploy after setting them.
