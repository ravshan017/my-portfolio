/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";

type Content = any;

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState("site");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const me = await fetch("/api/admin/me").then((r) => r.json());
    setAuthed(!!me.authed);
    if (me.authed) {
      const data = await fetch("/api/admin/content").then((r) => r.json());
      setContent(data);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      setPw("");
      load();
    } else {
      setMsg("Неверный пароль");
    }
  };

  const save = async (section: string, data: any, extra?: any) => {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, data: extra ? { ...extra, ...data } : data }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Сохранено ✓");
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      setMsg("Ошибка: " + (j.error || res.status));
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setContent(null);
  };

  if (authed === null) {
    return <Shell><p className="text-muted">Загрузка…</p></Shell>;
  }

  if (!authed) {
    return (
      <Shell>
        <form onSubmit={login} className="mx-auto w-full max-w-sm border border-line bg-panel p-6">
          <h1 className="font-display text-xl font-bold text-mist">Админ-панель</h1>
          <p className="mt-1 text-sm text-muted">Введите пароль для доступа к редактированию сайта.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Пароль"
            className={inputCls}
          />
          {msg && <p className="mt-3 font-mono text-xs text-sakura-bright">{msg}</p>}
          <button type="submit" disabled={busy} className={btnCls}>
            {busy ? "…" : "Войти"}
          </button>
        </form>
      </Shell>
    );
  }

  if (!content) {
    return <Shell><p className="text-muted">Загрузка контента…</p></Shell>;
  }

  const tabs: Record<string, string> = {
    site: "Профиль",
    projects: "Проекты",
    experience: "Опыт и отзывы",
    blog: "Блог",
    locales: "Переводы",
  };

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-mist">Админ-панель</h1>
        <div className="flex items-center gap-3">
          <a href="/" className={linkCls}>Открыть сайт ↗</a>
          <button onClick={logout} className={btnGhost}>Выйти</button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(tabs).map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setTab(k); setMsg(""); }}
            className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === k ? "border-sora bg-sora text-white" : "border-line text-muted hover:text-mist"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {msg && <p className="mb-4 font-mono text-xs text-sakura-bright">{msg}</p>}

      {tab === "site" && (
        <SiteEditor content={content} setContent={setContent} save={save} busy={busy} />
      )}
      {tab === "projects" && (
        <ProjectsEditor content={content} setContent={setContent} save={save} busy={busy} />
      )}
      {tab === "experience" && (
        <ExperienceEditor content={content} setContent={setContent} save={save} busy={busy} />
      )}
      {tab === "blog" && (
        <BlogEditor content={content} setContent={setContent} save={save} busy={busy} />
      )}
      {tab === "locales" && (
        <LocalesEditor content={content} setContent={setContent} save={save} busy={busy} />
      )}
    </Shell>
  );
}

/* ---------------- Editors ---------------- */

function SiteEditor({ content, setContent, save, busy }: EditorProps) {
  const s = content.site;
  const set = (patch: any) => setContent({ ...content, site: { ...s, ...patch } });
  return (
    <div className="space-y-6">
      <Card title="Основная информация">
        <Field label="Имя (RU)"><input className={inputCls} value={s.nameRu} onChange={(e) => set({ nameRu: e.target.value })} /></Field>
        <Field label="Имя (LAT)"><input className={inputCls} value={s.nameLat} onChange={(e) => set({ nameLat: e.target.value })} /></Field>
        <Field label="Инициалы"><input className={inputCls} value={s.initials} onChange={(e) => set({ initials: e.target.value })} /></Field>
        <Field label="Email"><input className={inputCls} value={s.email} onChange={(e) => set({ email: e.target.value })} /></Field>
        <Field label="URL сайта"><input className={inputCls} value={s.url} onChange={(e) => set({ url: e.target.value })} /></Field>
      </Card>

      <Card title="Навыки">
        <StringList
          items={s.skills}
          onChange={(skills) => set({ skills })}
          placeholder="Новый навык"
        />
      </Card>

      <Card title="Соцсети">
        {s.socials.map((soc: any, i: number) => (
          <div key={soc.id} className="mb-3 rounded border border-line bg-panel-2 p-3">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-sora-bright">{soc.id}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={inputCls} value={soc.label} onChange={(e) => updateArr(setContent, content, "socials", i, { label: e.target.value })} />
              <input className={inputCls} value={soc.handle} onChange={(e) => updateArr(setContent, content, "socials", i, { handle: e.target.value })} />
              <input className={inputCls} value={soc.url} onChange={(e) => updateArr(setContent, content, "socials", i, { url: e.target.value })} />
              <select className={inputCls} value={soc.kind} onChange={(e) => updateArr(setContent, content, "socials", i, { kind: e.target.value })}>
                <option value="pro">pro</option>
                <option value="creative">creative</option>
              </select>
            </div>
          </div>
        ))}
      </Card>

      <button disabled={busy} onClick={() => save("site", s)} className={btnCls}>Сохранить профиль</button>
    </div>
  );
}

function ProjectsEditor({ content, setContent, save, busy }: EditorProps) {
  const list = content.projects as any[];
  const set = (projects: any[]) => setContent({ ...content, projects });

  const update = (i: number, patch: any) =>
    set(list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const remove = (i: number) => set(list.filter((_, idx) => idx !== i));
  const add = () =>
    set([
      {
        id: "p-" + Date.now(),
        category: "site",
        title: "",
        description: "",
        stack: [],
        image: null,
        demoUrl: "#",
        codeUrl: "#",
        year: String(new Date().getFullYear()),
      },
      ...list,
    ]);

  return (
    <div className="space-y-4">
      <button onClick={add} className={btnGhost}>+ Добавить проект</button>
      {list.map((p, i) => (
        <div key={p.id} className="rounded border border-line bg-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-sora-bright">{p.category}</span>
            <button onClick={() => remove(i)} className="font-mono text-xs text-sakura-bright">Удалить</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Название"><input className={inputCls} value={p.title} onChange={(e) => update(i, { title: e.target.value })} /></Field>
            <Field label="Категория">
              <select className={inputCls} value={p.category} onChange={(e) => update(i, { category: e.target.value })}>
                <option value="site">site</option>
                <option value="app">app</option>
                <option value="study">study</option>
              </select>
            </Field>
            <Field label="Год"><input className={inputCls} value={p.year} onChange={(e) => update(i, { year: e.target.value })} /></Field>
            <Field label="Картинка (путь /public/images или URL)"><input className={inputCls} value={p.image ?? ""} onChange={(e) => update(i, { image: e.target.value || null })} /></Field>
            <Field label="Demo URL"><input className={inputCls} value={p.demoUrl} onChange={(e) => update(i, { demoUrl: e.target.value })} /></Field>
            <Field label="Code URL"><input className={inputCls} value={p.codeUrl} onChange={(e) => update(i, { codeUrl: e.target.value })} /></Field>
          </div>
          <Field label="Описание"><textarea className={inputCls + " resize-y"} rows={2} value={p.description} onChange={(e) => update(i, { description: e.target.value })} /></Field>
          <Field label="Стек (через запятую)">
            <input
              className={inputCls}
              value={(p.stack || []).join(", ")}
              onChange={(e) => update(i, { stack: e.target.value.split(",").map((x: string) => x.trim()).filter(Boolean) })}
            />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={!!p.placeholder} onChange={(e) => update(i, { placeholder: e.target.checked })} />
            Заглушка (проект ещё не готов)
          </label>
        </div>
      ))}
      <button disabled={busy} onClick={() => save("projects", list)} className={btnCls}>Сохранить проекты</button>
    </div>
  );
}

function ExperienceEditor({ content, setContent, save, busy }: EditorProps) {
  const exp = content.experience;
  const set = (patch: any) => setContent({ ...content, experience: { ...exp, ...patch } });
  const tl = exp.timeline as any[];
  const rv = exp.reviews as any[];

  const updTl = (i: number, patch: any) => set({ timeline: tl.map((x, idx) => (idx === i ? mergeLocalized(x, patch) : x)) });
  const updRv = (i: number, patch: any) => set({ reviews: rv.map((x, idx) => (idx === i ? mergeLocalized(x, patch) : x)) });
  const removeTl = (i: number) => set({ timeline: tl.filter((_, idx) => idx !== i) });
  const removeRv = (i: number) => set({ reviews: rv.filter((_, idx) => idx !== i) });
  const addTl = () => set({ timeline: [{ id: "t-" + Date.now(), year: "2026", title: { ru: "", uz: "" }, org: { ru: "", uz: "" }, desc: { ru: "", uz: "" } }, ...tl] });
  const addRv = () => set({ reviews: [{ id: "r-" + Date.now(), name: "", role: { ru: "", uz: "" }, text: { ru: "", uz: "" } }, ...rv] });

  return (
    <div className="space-y-6">
      <Card title="Таймлайн (опыт)">
        <button onClick={addTl} className={btnGhost}>+ Добавить этап</button>
        {tl.map((it, i) => (
          <div key={it.id} className="mb-3 rounded border border-line bg-panel-2 p-3">
            <div className="mb-2 flex items-center justify-between">
              <input className={inputCls + " w-28"} value={it.year} onChange={(e) => set({ timeline: tl.map((x, idx) => idx === i ? { ...x, year: e.target.value } : x) })} />
              <button onClick={() => removeTl(i)} className="font-mono text-xs text-sakura-bright">Удалить</button>
            </div>
            <LocalizedInputs label="Заголовок" value={it.title} onChange={(v) => updTl(i, { title: v })} />
            <LocalizedInputs label="Организация" value={it.org} onChange={(v) => updTl(i, { org: v })} />
            <LocalizedInputs label="Описание" value={it.desc} textarea onChange={(v) => updTl(i, { desc: v })} />
          </div>
        ))}
      </Card>

      <Card title="Отзывы">
        <button onClick={addRv} className={btnGhost}>+ Добавить отзыв</button>
        {rv.map((it, i) => (
          <div key={it.id} className="mb-3 rounded border border-line bg-panel-2 p-3">
            <div className="mb-2 flex items-center justify-between">
              <input className={inputCls} value={it.name} onChange={(e) => set({ reviews: rv.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) })} />
              <button onClick={() => removeRv(i)} className="font-mono text-xs text-sakura-bright">Удалить</button>
            </div>
            <LocalizedInputs label="Роль" value={it.role} onChange={(v) => updRv(i, { role: v })} />
            <LocalizedInputs label="Текст" value={it.text} textarea onChange={(v) => updRv(i, { text: v })} />
          </div>
        ))}
      </Card>

      <button disabled={busy} onClick={() => save("experience", exp)} className={btnCls}>Сохранить опыт и отзывы</button>
    </div>
  );
}

function BlogEditor({ content, setContent, save, busy }: EditorProps) {
  const list = content.blog as any[];
  const [open, setOpen] = useState<number | null>(list.length ? 0 : null);

  const update = (i: number, patch: any) => {
    const next = list.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setContent({ ...content, blog: next });
  };
  const remove = async (slug: string) => {
    if (!confirm("Удалить пост «" + slug + "»?")) return;
    await save("blog", { action: "delete", slug });
  };
  const add = () => {
    const slug = "post-" + Date.now();
    const next = [{ slug, title: "Новый пост", date: new Date().toISOString().slice(0, 10), excerpt: "", readingTime: "1", cover: null, body: "## Заголовок\n\nТекст поста (Markdown)." }, ...list];
    setContent({ ...content, blog: next });
    setOpen(0);
  };

  return (
    <div className="space-y-4">
      <button onClick={add} className={btnGhost}>+ Добавить пост</button>
      {list.map((p, i) => (
        <div key={p.slug} className="rounded border border-line bg-panel p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <button onClick={() => setOpen(open === i ? null : i)} className="font-display text-base font-semibold text-mist">
              {p.title || "(без названия)"}
            </button>
            <div className="flex items-center gap-3">
              <button disabled={busy} onClick={() => save("blog", { action: "save", post: p })} className={btnCls}>Сохранить</button>
              <button onClick={() => remove(p.slug)} className="font-mono text-xs text-sakura-bright">Удалить</button>
            </div>
          </div>
          {open === i && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Slug (URL)"><input className={inputCls} value={p.slug} onChange={(e) => update(i, { slug: e.target.value })} /></Field>
              <Field label="Дата (YYYY-MM-DD)"><input className={inputCls} value={p.date} onChange={(e) => update(i, { date: e.target.value })} /></Field>
              <Field label="Заголовок"><input className={inputCls} value={p.title} onChange={(e) => update(i, { title: e.target.value })} /></Field>
              <Field label="Время чтения (мин)"><input className={inputCls} value={p.readingTime} onChange={(e) => update(i, { readingTime: e.target.value })} /></Field>
              <Field label="Картинка (cover)"><input className={inputCls} value={p.cover ?? ""} onChange={(e) => update(i, { cover: e.target.value || null })} /></Field>
              <Field label="Excerpt"><textarea className={inputCls + " resize-y"} rows={2} value={p.excerpt} onChange={(e) => update(i, { excerpt: e.target.value })} /></Field>
            </div>
          )}
          {open === i && (
            <Field label="Текст (Markdown)">
              <textarea className={inputCls + " resize-y font-mono text-xs"} rows={10} value={p.body} onChange={(e) => update(i, { body: e.target.value })} />
            </Field>
          )}
        </div>
      ))}
    </div>
  );
}

function LocalesEditor({ content, save, busy }: EditorProps) {
  const [ru, setRu] = useState(JSON.stringify(content.locales.ru, null, 2));
  const [uz, setUz] = useState(JSON.stringify(content.locales.uz, null, 2));
  const [err, setErr] = useState("");

  const saveLocales = async () => {
    setErr("");
    let ruObj: any, uzObj: any;
    try {
      ruObj = JSON.parse(ru);
      uzObj = JSON.parse(uz);
    } catch (e) {
      setErr("Невалидный JSON: " + String(e));
      return;
    }
    await save("locales", { ru: ruObj, uz: uzObj });
  };

  return (
    <div className="space-y-4">
      {err && <p className="font-mono text-xs text-sakura-bright">{err}</p>}
      <Field label="Русский (ru.json)">
        <textarea className={inputCls + " resize-y font-mono text-xs"} rows={14} value={ru} onChange={(e) => setRu(e.target.value)} />
      </Field>
      <Field label="Узбекский (uz.json)">
        <textarea className={inputCls + " resize-y font-mono text-xs"} rows={14} value={uz} onChange={(e) => setUz(e.target.value)} />
      </Field>
      <button disabled={busy} onClick={saveLocales} className={btnCls}>Сохранить переводы</button>
    </div>
  );
}

/* ---------------- helpers ---------------- */

interface EditorProps {
  content: any;
  setContent: (c: any) => void;
  save: (section: string, data: any, extra?: any) => Promise<void>;
  busy: boolean;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-[100svh] w-full max-w-4xl px-5 py-10">
      {children}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-line bg-panel/60 p-4">
      <h2 className="mb-3 font-display text-sm font-semibold text-sora-bright">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  );
}

function LocalizedInputs({ label, value, onChange, textarea }: { label: string; value: { ru: string; uz: string }; onChange: (v: { ru: string; uz: string }) => void; textarea?: boolean }) {
  const Comp: any = textarea ? "textarea" : "input";
  return (
    <div className="mt-2">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Comp className={inputCls + (textarea ? " resize-y" : "")} rows={textarea ? 2 : undefined} value={value.ru} placeholder="RU" onChange={(e: any) => onChange({ ru: e.target.value, uz: value.uz })} />
        <Comp className={inputCls + (textarea ? " resize-y" : "")} rows={textarea ? 2 : undefined} value={value.uz} placeholder="UZ" onChange={(e: any) => onChange({ ru: value.ru, uz: e.target.value })} />
      </div>
    </div>
  );
}

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            value={it}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))}
          />
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="font-mono text-xs text-sakura-bright">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className={btnGhost}>+ Добавить</button>
    </div>
  );
}

function mergeLocalized(obj: any, patch: any) {
  const next = { ...obj };
  for (const k of ["title", "org", "desc", "role", "text"]) {
    if (patch[k]) next[k] = { ...(next[k] || { ru: "", uz: "" }), ...patch[k] };
  }
  return next;
}

function updateArr(setContent: (c: any) => void, content: any, key: string, i: number, patch: any) {
  const arr = content.site[key].map((x: any, idx: number) => (idx === i ? { ...x, ...patch } : x));
  setContent({ ...content, site: { ...content.site, [key]: arr } });
}

const inputCls =
  "w-full border border-line bg-panel-2 px-3 py-2 text-sm text-mist placeholder:text-muted/60 transition-colors focus:border-sora focus:outline-none";

const btnCls =
  "inline-flex items-center justify-center bg-sora px-5 py-2 font-mono text-xs tracking-[0.15em] uppercase text-white transition-colors hover:bg-sora-bright disabled:opacity-50";

const btnGhost =
  "inline-flex items-center border border-dashed border-sora/60 px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase text-sora-bright transition-colors hover:border-sakura hover:text-sakura-bright";

const linkCls =
  "font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-sakura-bright";
