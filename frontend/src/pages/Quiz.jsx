import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Eyebrow } from "@/components/chroma/ui";
import { QUIZ, STYLES, STYLE_ORDER } from "@/lib/chroma";
import { getUser, setUser } from "@/lib/session";
function Quiz() {
    const nav = useNavigate();
    const [i, setI] = useState(0);
    const [answers, setAnswers] = useState([]);
    const q = QUIZ[i];
    function pick(k) {
        const next = [...answers.slice(0, i), k];
        if (i + 1 < QUIZ.length) {
            setAnswers(next);
            setI(i + 1);
            return;
        }
        const scores = Object.fromEntries(STYLE_ORDER.map((s) => [s, Math.round((next.filter((a) => a === s).length / next.length) * 100)]));
        const u = getUser();
        if (u)
            setUser({ ...u, scores });
        nav({ to: "/resultados" });
    }
    return (<div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <Eyebrow>Pergunta {i + 1} de {QUIZ.length}</Eyebrow>
        {i > 0 && <button onClick={() => setI(i - 1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4"/> Anterior</button>}
      </div>
      <div className="mt-3 h-1 rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(i / QUIZ.length) * 100}%` }}/></div>
      <h1 key={i} className="animate-rise mt-12 text-3xl leading-snug md:text-4xl">{q.q}</h1>
      <div key={"o" + i} className="animate-rise mt-10 space-y-3">
        {STYLE_ORDER.map((k, n) => (<button key={k} onClick={() => pick(k)} className={`group flex w-full items-center gap-4 rounded-2xl border bg-card px-5 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${answers[i] === k ? "border-foreground" : "border-transparent"}`}>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold transition group-hover:text-primary-foreground" style={{ ["--c"]: STYLES[k].color }}>{String.fromCharCode(65 + n)}</span>
            <span>{q.options[k]}</span>
          </button>))}
      </div>
    </div>);
}
export default Quiz;
