import { Eyebrow, PageHead } from "@/components/chroma/ui";
import { EVOLUTION, HISTORY, MONTH, STYLES, STYLE_ORDER } from "@/lib/chroma";
function Evolution() {
    const max = Math.max(...EVOLUTION.map((e) => e.value));
    return (<div>
      <PageHead eyebrow="Evolução" title="O teu progresso" text="Pontuação média dos treinos nas últimas oito semanas."/>
      <div className="rounded-3xl bg-card p-8 shadow-soft">
        <div className="flex h-64 items-end gap-3 md:gap-6">
          {EVOLUTION.map((e, i) => (<div key={e.week} className="group flex flex-1 flex-col items-center gap-2">
              <span className="text-xs opacity-0 transition group-hover:opacity-100">{e.value}</span>
              <div className="w-full origin-bottom animate-rise rounded-t-xl bg-primary/85 transition group-hover:bg-primary" style={{ height: `${(e.value / max) * 200}px`, animationDelay: `${i * 60}ms` }}/>
              <span className="text-xs text-muted-foreground">{e.week}</span>
            </div>))}
        </div>
      </div>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <dl className="grid grid-cols-2 gap-8">
          {[["Treinos este mês", MONTH.trainings], ["Conversas", MONTH.conversations], ["Minutos de prática", MONTH.minutes], ["Melhoria", `+${MONTH.growth}%`]].map(([l, v]) => (<div key={l}><dd className="font-display text-4xl">{v}</dd><dt className="mt-1 text-sm text-muted-foreground">{l}</dt></div>))}
        </dl>
        <div><Eyebrow>Desempenho por interlocutor</Eyebrow><div className="mt-5 space-y-4">
          {STYLE_ORDER.map((k) => {
            const v = HISTORY.find((h) => h.style === k)?.score ?? 0;
            return (<div key={k}><div className="flex justify-between text-sm"><span>{STYLES[k].name}</span><span className="font-semibold">{v}</span></div>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${STYLES[k].bg}`} style={{ width: `${v}%` }}/></div></div>);
        })}
        </div></div>
      </div>
    </div>);
}
export default Evolution;
