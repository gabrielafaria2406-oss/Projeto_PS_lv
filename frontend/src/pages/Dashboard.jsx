import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ColorWheel } from "@/components/chroma/ColorWheel";
import { Eyebrow } from "@/components/chroma/ui";
import { MONTH, STYLES, dominant } from "@/lib/chroma";
import { useUser } from "@/lib/session";
function Home() {
    const user = useUser();
    const dom = dominant(user.scores);
    const s = STYLES[dom];
    const first = user.name.split(" ")[0];
    return (<div>
      <section className="grid items-center gap-14 md:grid-cols-[1fr_1.05fr]">
        <div className="animate-rise">
          <div className="flex items-center gap-5">
            <div className="grid size-20 place-items-center rounded-full font-display text-3xl text-primary-foreground ring-8 ring-card" style={{ background: s.color }}>{first?.charAt(0)}</div>
            <div>
              <Eyebrow>Novembro 2026</Eyebrow>
              <h1 className="mt-1 text-4xl md:text-5xl">Olá, {first}!</h1>
            </div>
          </div>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Cada conversa é uma oportunidade de te conheceres melhor. Continua — estás a evoluir.</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div><Eyebrow>Estilo predominante</Eyebrow><p className="mt-1 flex items-center gap-2 font-display text-2xl"><span className={`size-3 rounded-full ${s.bg}`}/>{s.name}</p></div>
            <div className="min-w-48 flex-1">
              <div className="flex justify-between"><Eyebrow>Progresso pessoal</Eyebrow><span className="text-sm font-semibold">68%</span></div>
              <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full w-[68%] rounded-full bg-primary"/></div>
            </div>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-border/70 pt-8 sm:grid-cols-4">
            {[["Treinos", MONTH.trainings], ["Conversas", MONTH.conversations], ["Minutos", MONTH.minutes], ["Evolução", `+${MONTH.growth}%`]].map(([l, v]) => (<div key={l}><dd className="font-display text-3xl">{v}</dd><dt className="mt-1 text-sm text-muted-foreground">{l}</dt></div>))}
          </dl>
        </div>
        <ColorWheel scores={user.scores} highlight={dom} className="mx-auto w-full max-w-[460px]" center={<div><p className="font-display text-4xl">{user.scores[dom]}%</p><p className="text-sm text-muted-foreground">{s.name}</p></div>}/>
      </section>

      <section className="mt-20 grid gap-5 md:grid-cols-2">
        <Link to="/quiz" className="group relative overflow-hidden rounded-3xl bg-card p-8 shadow-soft transition duration-500 hover:-translate-y-1 md:p-10">
          <div className="absolute -right-10 -top-10 grid size-40 grid-cols-2 overflow-hidden rounded-full opacity-90 transition duration-700 group-hover:rotate-45">
            <span className="bg-chroma-red"/><span className="bg-chroma-yellow"/><span className="bg-chroma-blue"/><span className="bg-chroma-green"/>
          </div>
          <Eyebrow>Quiz · 8 perguntas</Eyebrow>
          <h2 className="mt-16 text-3xl">Qual é o teu estilo?</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">Refaz o quiz e vê como a tua forma de comunicar mudou.</p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">Começar <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span>
        </Link>
        <Link to="/treinar" className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground transition duration-500 hover:-translate-y-1 md:p-10">
          <Eyebrow className="text-primary-foreground/60">Treino com IA</Eyebrow>
          <h2 className="mt-16 text-3xl">Praticar uma conversa</h2>
          <p className="mt-2 max-w-sm opacity-70">Simula situações reais com interlocutores de cada cor.</p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">Treinar agora <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></span>
        </Link>
      </section>
      <div className="mt-8 flex flex-wrap gap-6 text-sm">
        <Link to="/conteudos" className="underline-offset-4 hover:underline">Conteúdos educativos →</Link>
        <Link to="/evolucao" className="underline-offset-4 hover:underline">Evolução e estatísticas →</Link>
      </div>
    </div>);
}
export default Home;
