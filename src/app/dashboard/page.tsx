'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ChevronDown, ClipboardList, LoaderCircle, RefreshCw, Users } from 'lucide-react';
import { DASHBOARD_ROLES, getRoleDetails, QUESTIONS, QUESTION_SCORE_KEYS } from '@/lib/constants';
import { supabase, supabaseSetupMessage } from '@/lib/supabase';
import type { Interview } from '@/lib/types';

function csvCell(value: string | number | null | undefined) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function questionAverage(row: Interview): number | null {
  const scores = QUESTION_SCORE_KEYS.map(key => row[key]).filter((score): score is number => score !== null);
  return scores.length ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)) : null;
}

export default function Dashboard() {
  const [records, setRecords] = useState<Interview[]>([]);
  const [role, setRole] = useState('All roles');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecords = useCallback(async () => {
    if (!supabase) { setError(supabaseSetupMessage); setLoading(false); return; }
    setLoading(true); setError('');
    const { data, error: queryError } = await supabase.from('interviews').select('*').order('created_at', { ascending: false });
    if (queryError) setError(`Could not load interviews: ${queryError.message}`);
    else setRecords((data ?? []) as Interview[]);
    setLoading(false);
  }, []);

  useEffect(() => { void fetchRecords(); }, [fetchRecords]);

  const filtered = useMemo(() => role === 'All roles' ? records : records.filter(row => row.role_applied_for === role), [records, role]);

  function exportCsv() {
    const headers = [
      'Created at', 'Interviewer name', 'Candidate name', 'Role applied for',
      ...QUESTIONS.flatMap((question, index) => [`Q${index + 1}: ${question.title} answer`, `Q${index + 1} score (out of 10)`]),
      'Q5 role-specific prompt', 'Q5 role description', 'Q5 role-specific answer', 'Q5 score (out of 10)',
      'Earlier shared Q5 answer', 'Question average (out of 10)', 'Skill score', 'Heart score', 'Overall notes',
    ];
    const rows = filtered.map(row => {
      const details = getRoleDetails(row.role_applied_for);
      return [
        row.created_at, row.interviewer_name, row.candidate_name, row.role_applied_for,
        ...QUESTIONS.flatMap(question => [row[question.key], row[question.scoreKey]]),
        details?.finalQuestion, details?.description, row.q5_role_specific, row.q5_score,
        row.q5_active_initiative, questionAverage(row), row.skill_score, row.heart_score, row.overall_notes,
      ].map(csvCell).join(',');
    });
    const blob = new Blob(['\ufeff' + [headers.map(csvCell).join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `cob-interviews-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  }

  return <main className="min-h-screen pb-16">
    <header className="border-b border-stone-200/80 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime"><span className="text-lg font-black">C.</span></span><span><span className="block text-sm font-extrabold tracking-wide text-ink">CREATE ON BASE</span><span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-stone-500">Executive interviews</span></span></Link><Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-paper hover:text-forest"><ArrowLeft size={15}/> Interview form</Link></div></header>
    <div className="mx-auto max-w-6xl px-4 pt-9 sm:px-8 sm:pt-14">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-lime/45 px-3 py-1.5 text-xs font-bold text-forest"><ClipboardList size={13}/> REVIEW SPACE</div><h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Interview dashboard</h1><p className="mt-2 text-sm text-stone-500">Review candidate conversations and compare each role’s shortlist.</p></div><button onClick={exportCsv} disabled={filtered.length === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-4 text-sm font-bold text-white transition hover:bg-[#205340] disabled:cursor-not-allowed disabled:opacity-40"><ArrowDownToLine size={16}/> Export CSV</button></div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:px-6"><label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"><span className="text-sm font-semibold">Filter by role</span><span className="relative"><select value={role} onChange={e => setRole(e.target.value)} className="min-h-11 min-w-56 appearance-none rounded-xl border border-stone-200 bg-paper px-4 pr-10 text-sm font-medium outline-none focus:border-forest focus:ring-4 focus:ring-forest/10"><option>All roles</option>{DASHBOARD_ROLES.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"/></span></label><div className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-sm text-stone-500"><Users size={16}/>{filtered.length} {filtered.length === 1 ? 'interview' : 'interviews'}</span><button onClick={() => void fetchRecords()} disabled={loading} aria-label="Refresh interviews" className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 text-stone-600 transition hover:bg-paper disabled:opacity-50"><RefreshCw size={15} className={loading ? 'animate-spin' : ''}/></button></div></div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
      {loading ? <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-stone-500"><LoaderCircle className="animate-spin" size={19}/> Loading interviews…</div> : filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center"><span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-lime/40 text-forest"><ClipboardList size={21}/></span><h2 className="font-bold">No interviews here yet</h2><p className="mt-1 text-sm text-stone-500">{records.length ? 'Try another role filter.' : 'Saved interviews will appear here.'}</p>{!records.length && <Link href="/" className="mt-5 inline-flex items-center rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white">Start an interview</Link>}</div> : <div className="space-y-5">{filtered.map(row => {
        const details = getRoleDetails(row.role_applied_for);
        return <article key={row.id} className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-soft"><div className="flex flex-col gap-4 border-b border-stone-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest text-sm font-bold text-lime">{row.candidate_name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()}</span><div><h2 className="text-lg font-bold">{row.candidate_name}</h2><p className="mt-0.5 text-sm font-medium text-moss">{row.role_applied_for}</p><p className="mt-2 text-xs text-stone-500">Interviewed by: <span className="font-semibold text-ink">{row.interviewer_name}</span><span className="mx-2 text-stone-300">·</span>{new Date(row.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p></div></div><div className="flex flex-wrap gap-2 sm:pl-4"><Score label="Q average" score={questionAverage(row)} max={10}/><Score label="Skill" score={row.skill_score}/><Score label="Heart" score={row.heart_score}/></div></div><div className="grid gap-x-8 gap-y-6 px-5 py-6 sm:grid-cols-2 sm:px-7">{QUESTIONS.map((question, qIndex) => <div key={question.key}><div className="mb-1 flex items-center justify-between gap-3"><h3 className="text-xs font-bold uppercase tracking-wider text-moss">Q{qIndex + 1} · {question.title}</h3><span className="shrink-0 rounded-lg bg-lime/40 px-2.5 py-1 text-xs font-bold text-forest">{row[question.scoreKey] ?? '—'}<span className="font-medium text-forest/60"> / 10</span></span></div><p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">{row[question.key] || <span className="italic text-stone-400">No answer recorded</span>}</p></div>)}<div className="sm:col-span-2"><div className="mb-2 flex items-center justify-between gap-3"><h3 className="text-xs font-bold uppercase tracking-wider text-moss">Q5 · Role-specific question</h3><span className="shrink-0 rounded-lg bg-lime/40 px-2.5 py-1 text-xs font-bold text-forest">{row.q5_score ?? '—'}<span className="font-medium text-forest/60"> / 10</span></span></div>{details && <><p className="mb-2 text-xs leading-5 text-stone-500">{details.description}</p><p className="mb-3 text-sm font-medium leading-6 text-ink">{details.finalQuestion}</p></>}{row.q5_role_specific ? <p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">{row.q5_role_specific}</p> : row.q5_active_initiative ? <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900"><span className="font-semibold">Earlier shared Q5 answer:</span> {row.q5_active_initiative}</div> : <p className="italic text-sm text-stone-400">No answer recorded</p>}</div>{row.overall_notes && <div className="sm:col-span-2"><h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-moss">Overall notes</h3><p className="whitespace-pre-wrap text-sm leading-6 text-stone-600">{row.overall_notes}</p></div>}</div></article>;
      })}</div>}
      <footer className="mt-10 border-t border-stone-200 pt-5 text-center text-xs text-stone-400">Showing {filtered.length} of {records.length} interview{records.length === 1 ? '' : 's'}</footer>
    </div>
  </main>;
}

function Score({ label, score, max = 5 }: { label: string; score: number | null; max?: number }) {
  return <div className="min-w-[82px] rounded-xl bg-paper px-3 py-2 text-center"><span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">{label}</span><span className="text-lg font-extrabold text-forest">{score ?? '—'}<span className="ml-0.5 text-xs font-medium text-stone-400">/{max}</span></span></div>;
}
