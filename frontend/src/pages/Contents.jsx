import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageHead } from "@/components/chroma/ui";
import { CONTENTS, STYLES, STYLE_ORDER } from "@/lib/chroma";
function Contents() {
    const [f, setF] = useState("todos");
    const list = CONTENTS.filter((c) => f === "todos" || c.style === f);
    return (<div>
      <PageHead eyebrow="Biblioteca" title="Conteúdos educativos" text="Leituras curtas e exercícios práticos para comunicar melhor."/>
      <div className="mb-10 flex flex-wrap gap-2">
        {["todos", ...STYLE_ORDER].map((k) => (<button key={k} onClick={() => setF(k)} className={`rounded-full px-4 py-2 text-sm capitalize transition ${f === k ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{k === "todos" ? "Todos" : STYLES[k].name}</button>))}
      </div>
      <div className="divide-y divide-border/70 border-y border-border/70">
        {list.map((c) => (<article key={c.id} className="group grid cursor-pointer gap-2 py-7 transition md:grid-cols-[140px_1fr_auto] md:items-center md:gap-8">
            <span className="flex items-center gap-2 text-sm text-muted-foreground"><span className={`size-2 rounded-full ${STYLES[c.style].bg}`}/>{c.kind} · {c.min} min</span>
            <div><h3 className="text-2xl transition group-hover:translate-x-1">{c.title}</h3><p className="mt-1 text-muted-foreground">{c.text}</p></div>
            <ArrowUpRight className="hidden size-5 transition group-hover:rotate-45 md:block"/>
          </article>))}
      </div>
    </div>);
}
export default Contents;
