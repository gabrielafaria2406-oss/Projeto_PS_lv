import { Link } from "@tanstack/react-router";
import { PageHead } from "@/components/chroma/ui";
import { HISTORY, STYLES } from "@/lib/chroma";
function History() {
    return (<div>
      <PageHead eyebrow="Histórico" title="As tuas conversas" text="Revê os treinos anteriores e a pontuação obtida."/>
      <div className="divide-y divide-border/70 border-y border-border/70">
        {HISTORY.map((h) => (<Link key={h.id} to="/treinar" className="group grid items-center gap-2 py-6 sm:grid-cols-[1fr_auto_auto] sm:gap-10">
            <div className="flex items-center gap-4">
              <span className={`size-10 shrink-0 rounded-full ${STYLES[h.style].bg} transition group-hover:scale-110`}/>
              <div><h3 className="text-xl">{h.title}</h3><p className="text-sm text-muted-foreground">Interlocutor {STYLES[h.style].name} · {h.messages} mensagens</p></div>
            </div>
            <span className="text-sm text-muted-foreground">{h.date}</span>
            <span className="font-display text-2xl">{h.score}<span className="text-sm text-muted-foreground">/100</span></span>
          </Link>))}
      </div>
    </div>);
}
export default History;
