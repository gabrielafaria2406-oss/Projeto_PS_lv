import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, BookOpen, MessagesSquare } from "lucide-react";
import { Logo } from "@/components/chroma/Logo";
import { ColorWheel } from "@/components/chroma/ColorWheel";
import { btnClass, Eyebrow } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER } from "@/lib/chroma";
function Landing() {
    return (<div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden gap-8 text-sm md:flex">
          <a href="#sobre" className="hover:text-muted-foreground">Sobre</a>
          <a href="#como-funciona" className="hover:text-muted-foreground">Como funciona</a>
        </nav>
        <Link to="/login" className={btnClass("dark") + " px-5 py-2.5"}>Iniciar sessão</Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-12 md:grid-cols-[1.15fr_1fr] md:pt-20">
        <div className="animate-rise">
          <Eyebrow>Competências de comunicação</Eyebrow>
          <h1 className="mt-5 text-5xl leading-[1.05] md:text-7xl">Cada pessoa comunica numa <em className="text-chroma-red">cor</em> diferente.</h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">Descobre o teu estilo, compreende o dos outros e pratica conversas reais com um treinador de inteligência artificial.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/registo" className={btnClass("dark")}>Descobrir o meu estilo <ArrowRight className="size-4"/></Link>
            <a href="#sobre" className={btnClass("ghost")}>Saber mais</a>
          </div>
        </div>
        <ColorWheel className="mx-auto w-full max-w-md" center={<p className="font-display text-lg text-muted-foreground">quatro formas<br />de comunicar</p>}/>
      </section>

      <section id="sobre" className="border-t border-border/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
          <Eyebrow>O que é a CHROMA</Eyebrow>
          <p className="font-display text-3xl leading-snug md:text-4xl">Uma plataforma para desenvolver autoconhecimento e empatia, transformando a forma como falas, ouves e te relacionas.</p>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <Eyebrow>Como funciona</Eyebrow>
        <div className="mt-10 grid gap-12 md:grid-cols-3">
          {[
            { i: Compass, t: "Descobrir", d: "Responde a um quiz curto e identifica o teu estilo predominante." },
            { i: BookOpen, t: "Compreender", d: "Explora forças, desafios e conteúdos pensados para ti." },
            { i: MessagesSquare, t: "Praticar", d: "Treina conversas com uma IA que adapta o seu estilo ao teu objetivo." },
        ].map(({ i: Icon, t, d }, n) => (<div key={t}>
              <span className="text-sm text-muted-foreground">0{n + 1}</span>
              <Icon className="mt-4 size-6" strokeWidth={1.5}/>
              <h3 className="mt-4 text-2xl">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>))}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Eyebrow>Os quatro estilos</Eyebrow>
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STYLE_ORDER.map((k) => (<div key={k} className="group">
                <span className={`block h-1 w-10 rounded-full transition-all duration-500 group-hover:w-20 ${STYLES[k].bg}`}/>
                <h3 className="mt-5 text-2xl">{STYLES[k].name}</h3>
                <p className="text-sm font-medium">{STYLES[k].tag}</p>
                <p className="mt-3 text-sm text-muted-foreground">{STYLES[k].summary}</p>
              </div>))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <Eyebrow>Treino com IA</Eyebrow>
          <h2 className="mt-4 text-4xl">Ensaia as conversas que importam.</h2>
          <p className="mt-4 text-muted-foreground">Pedir um aumento, dar feedback, resolver um conflito. Escolhe o estilo do teu interlocutor e recebe sugestões em tempo real.</p>
        </div>
        <div className="space-y-3 rounded-3xl bg-card p-6 shadow-soft">
          <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">Vamos direto ao assunto. O que propões exatamente?</p>
          <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">Proponho reduzir o prazo em duas semanas, com mais uma pessoa na equipa.</p>
          <p className="border-l-2 border-chroma-red pl-3 text-xs text-muted-foreground">Boa resposta: objetiva e focada em resultados.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground md:py-20">
          <h2 className="text-4xl md:text-5xl">Qual é a tua cor?</h2>
          <p className="mx-auto mt-4 max-w-md opacity-75">Cria a tua conta gratuita e começa hoje a comunicar com mais clareza.</p>
          <Link to="/registo" className="mt-8 inline-flex rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5">Criar conta</Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl justify-between px-6 pb-10 text-sm text-muted-foreground"><span>© 2026 CHROMA</span><span>Projeto académico</span></footer>
    </div>);
}
export default Landing;
