'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronDown, ClipboardList, LoaderCircle, Sparkles } from 'lucide-react';
import { getRoleDetails, QUESTIONS, ROLES } from '@/lib/constants';
import { supabase, supabaseSetupMessage } from '@/lib/supabase';

type FormData = {
  interviewer_name: string; candidate_name: string; role_applied_for: string;
  q1_vision: string; q2_leading_people: string; q3_handling_pressure: string;
  q4_disagreement: string; q5_role_specific: string;
  q1_score: string; q2_score: string; q3_score: string; q4_score: string; q5_score: string;
  skill_score: string; heart_score: string; overall_notes: string;
};
const blankForm: FormData = {
  interviewer_name: '', candidate_name: '', role_applied_for: '', q1_vision: '', q2_leading_people: '',
  q3_handling_pressure: '', q4_disagreement: '', q5_role_specific: '', q1_score: '', q2_score: '', q3_score: '', q4_score: '', q5_score: '', skill_score: '', heart_score: '', overall_notes: '',
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return <span className="mb-2 block text-sm font-semibold text-ink">{children}{required && <span className="ml-1 text-rose-500">*</span>}</span>;
}

export default function Home() {
  const [form, setForm] = useState<FormData>(blankForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const update = (key: keyof FormData, value: string) => setForm(current => ({ ...current, [key]: value }));
  const roleDetails = getRoleDetails(form.role_applied_for);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!supabase) { setNotice({ type: 'error', message: supabaseSetupMessage }); return; }
    setSaving(true);
    const result = await supabase.from('interviews').insert({
      interviewer_name: form.interviewer_name.trim(), candidate_name: form.candidate_name.trim(),
      role_applied_for: form.role_applied_for, q1_vision: form.q1_vision.trim() || null,
      q2_leading_people: form.q2_leading_people.trim() || null, q3_handling_pressure: form.q3_handling_pressure.trim() || null,
      q4_disagreement: form.q4_disagreement.trim() || null, q5_role_specific: form.q5_role_specific.trim() || null,
      q1_score: Number(form.q1_score), q2_score: Number(form.q2_score), q3_score: Number(form.q3_score),
      q4_score: Number(form.q4_score), q5_score: Number(form.q5_score),
      skill_score: Number(form.skill_score), heart_score: Number(form.heart_score), overall_notes: form.overall_notes.trim() || null,
    });
    setSaving(false);
    if (result.error) { setNotice({ type: 'error', message: `Could not save interview: ${result.error.message}` }); return; }
    setForm(blankForm);
    setNotice({ type: 'success', message: 'Interview saved. You’re ready for the next candidate.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const inputClass = 'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-forest focus:ring-4 focus:ring-forest/10';
  const sectionClass = 'rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft sm:p-7';

  return <main className="min-h-screen pb-16">
    <header className="border-b border-stone-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="COB Interview Tracker home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime"><span className="text-lg font-black tracking-tight">C.</span></span>
          <span><span className="block text-sm font-extrabold tracking-wide text-ink">CREATE ON BASE</span><span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-stone-500">Executive interviews</span></span>
        </Link>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-paper hover:text-forest"><ClipboardList size={16}/> Dashboard <ArrowRight size={14}/></Link>
      </div>
    </header>

    <div className="mx-auto max-w-4xl px-4 pt-9 sm:px-8 sm:pt-14">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-lime/45 px-3 py-1.5 text-xs font-bold text-forest"><Sparkles size={13}/> PEOPLE & CULTURE</div><h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Executive interview</h1><p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">A space to listen well, capture what matters, and build a home for the next generation of builders.</p></div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-500"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Responses save securely to the COB tracker</div>
      </div>

      {notice && <div role="status" className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{notice.type === 'success' && <Check size={17} className="mt-0.5 shrink-0"/>}<span>{notice.message}</span></div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-forest text-xs font-bold text-lime">01</span><div><h2 className="font-bold">Interviewer</h2><p className="text-xs text-stone-500">Who is having this conversation?</p></div></div>
          <label className="block"><FieldLabel required>Interviewer name</FieldLabel><input className={inputClass} required maxLength={120} autoComplete="name" placeholder="e.g., Teddy, Slindo, Neo" value={form.interviewer_name} onChange={e => update('interviewer_name', e.target.value)}/></label>
        </section>

        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-forest text-xs font-bold text-lime">02</span><div><h2 className="font-bold">Candidate details</h2><p className="text-xs text-stone-500">A little context before you begin.</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><FieldLabel required>Candidate name</FieldLabel><input className={inputClass} required maxLength={160} autoComplete="off" placeholder="Full name" value={form.candidate_name} onChange={e => update('candidate_name', e.target.value)}/></label>
            <label className="block"><FieldLabel required>Role applied for</FieldLabel><span className="relative block"><select className={`${inputClass} appearance-none pr-10`} required value={form.role_applied_for} onChange={e => update('role_applied_for', e.target.value)}><option value="" disabled>Select a role</option>{ROLES.map(role => <option key={role} value={role}>{role}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"/></span></label>
          </div>
          {roleDetails && <div className="mt-4 rounded-xl border border-forest/10 bg-paper px-4 py-3"><p className="text-xs font-bold uppercase tracking-wider text-moss">Role focus</p><p className="mt-1 text-sm leading-6 text-stone-600">{roleDetails.description}</p></div>}
        </section>

        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-forest text-xs font-bold text-lime">03</span><div><h2 className="font-bold">The conversation</h2><p className="text-xs text-stone-500">Capture the candidate’s answers in their own words.</p></div></div>
          <div className="space-y-7">{QUESTIONS.map((question, index) => <div key={question.key} className="block"><FieldLabel><span className="mr-1.5 text-xs font-bold text-moss">Q{index + 1}</span>{question.title}</FieldLabel><p className="mb-2.5 text-sm leading-6 text-stone-500">{question.prompt}</p><textarea aria-label={`Answer to question ${index + 1}: ${question.title}`} className={`${inputClass} min-h-[112px] resize-y leading-6`} maxLength={6000} placeholder="Note the key points, examples, and moments that stood out…" value={form[question.key]} onChange={e => update(question.key, e.target.value)}/><QuestionRating name={question.scoreKey} value={form[question.scoreKey]} onChange={value => update(question.scoreKey, value)}/></div>)}
            {roleDetails && <div className="block"><FieldLabel><span className="mr-1.5 text-xs font-bold text-moss">Q5</span>Role-specific question</FieldLabel><p className="mb-2.5 text-sm leading-6 text-stone-500">{roleDetails.finalQuestion}</p><textarea aria-label={`Answer to role-specific question for ${form.role_applied_for}`} className={`${inputClass} min-h-[112px] resize-y leading-6`} maxLength={6000} placeholder="Note the key points, examples, and moments that stood out…" value={form.q5_role_specific} onChange={e => update('q5_role_specific', e.target.value)}/><QuestionRating name="q5_score" value={form.q5_score} onChange={value => update('q5_score', value)}/></div>}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-forest text-xs font-bold text-lime">04</span><div><h2 className="font-bold">Your assessment</h2><p className="text-xs text-stone-500">Score each quality from 1 (developing) to 5 (exceptional).</p></div></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><FieldLabel required>Skill / Competence score</FieldLabel><span className="relative block"><select className={`${inputClass} appearance-none pr-10`} required value={form.skill_score} onChange={e => update('skill_score', e.target.value)}><option value="" disabled>Choose a score</option>{[1,2,3,4,5].map(score => <option key={score} value={score}>{score} — {['Developing','Emerging','Solid','Strong','Exceptional'][score - 1]}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"/></span></label>
            <label className="block"><FieldLabel required>Heart / Culture score</FieldLabel><span className="relative block"><select className={`${inputClass} appearance-none pr-10`} required value={form.heart_score} onChange={e => update('heart_score', e.target.value)}><option value="" disabled>Choose a score</option>{[1,2,3,4,5].map(score => <option key={score} value={score}>{score} — {['Developing','Emerging','Solid','Strong','Exceptional'][score - 1]}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"/></span></label>
          </div>
          <label className="mt-5 block"><FieldLabel>Overall notes <span className="font-normal text-stone-400">(optional)</span></FieldLabel><textarea className={`${inputClass} min-h-[100px] resize-y`} maxLength={6000} placeholder="Anything else the review team should know?" value={form.overall_notes} onChange={e => update('overall_notes', e.target.value)}/></label>
        </section>

        <div className="flex flex-col-reverse items-stretch justify-between gap-4 pt-1 sm:flex-row sm:items-center"><p className="text-xs leading-5 text-stone-500">Please make sure your notes reflect the conversation accurately.</p><button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#205340] focus:outline-none focus:ring-4 focus:ring-forest/20 disabled:cursor-wait disabled:opacity-70">{saving ? <><LoaderCircle size={17} className="animate-spin"/> Saving interview…</> : <>Save interview <ArrowRight size={16}/></>}</button></div>
      </form>
      <footer className="mt-10 border-t border-stone-200 pt-5 text-center text-xs text-stone-400">Create On Base · Building a home for builders</footer>
    </div>
  </main>;
}

function QuestionRating({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) {
  return <fieldset className="mt-3"><legend className="mb-2 text-xs font-semibold text-stone-600">Rate this answer <span className="text-rose-500">*</span> <span className="font-normal text-stone-400">(1 = needs development · 10 = exceptional)</span></legend><div className="grid max-w-lg grid-cols-5 gap-2 sm:grid-cols-10">{Array.from({ length: 10 }, (_, scoreIndex) => scoreIndex + 1).map(score => <label key={score} className="cursor-pointer"><input className="peer sr-only" type="radio" name={name} required value={score} checked={value === String(score)} onChange={event => onChange(event.target.value)}/><span className="grid h-10 place-items-center rounded-lg border border-stone-200 bg-white text-sm font-semibold text-stone-600 transition hover:border-moss peer-checked:border-forest peer-checked:bg-forest peer-checked:text-lime peer-focus-visible:ring-4 peer-focus-visible:ring-forest/20">{score}</span></label>)}</div></fieldset>;
}
