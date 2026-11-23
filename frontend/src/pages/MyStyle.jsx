import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eyebrow, PageHead, btnClass } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER, dominant } from "@/lib/chroma";
import { useUser } from "@/lib/session";
function MyStyle() {
    const user = useUser();
    const dom = dominant(user.scores);
    const [sel, setSel] = useState(dom);
    const s = STYLES[sel];
    return (<div>
      <PageHead eyebrow="O meu estilo" title={`${STYLES[dom].name} — ${STYLES[dom].tag.toLowerCase()}`} text="Explora o teu estilo e aprende a comunicar com cada uma das outras cores."/>
      <div className="flex flex-wrap gap-2">
        {STYLE_ORDER.map((k) => (<button key={k} onClick={() => setSel(k)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${sel === k ? "bg-card font-semibold shadow-soft" : "hover:bg-accent"}`}>
            <span className={`size-2.5 rounded-full ${STYLES[k].bg}`}/>{STYLES[k].name}{k === dom && " · tu"}
          </button>))}
      </div>
      <div key={sel} className="animate-rise mt-10 rounded-3xl bg-card p-8 shadow-soft md:p-12">
        <span className={`block h-1 w-16 rounded-full ${s.bg}`}/>
        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug">{s.summary}</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[["Forças", s.strengths], ["Desafios", s.challenges], [sel === dom ? "Para evoluíres" : "Como comunicar com este estilo", s.tips]].map(([t, l]) => (<div key={t}><Eyebrow>{t}</Eyebrow><ul className="mt-4 space-y-3">{l.map((x) => <li key={x} className="border-b border-border/60 pb-3">{x}</li>)}</ul></div>))}
        </div>
      </div>
      <div className="mt-8 flex gap-3"><Link to="/treinar" className={btnClass("dark")}>Praticar com este estilo</Link><Link to="/conteudos" className={btnClass("ghost")}>Ver conteúdos</Link></div>
    </div>);
}
export default MyStyle;
