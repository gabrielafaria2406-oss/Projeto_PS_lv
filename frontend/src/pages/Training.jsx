import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Btn, Eyebrow } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER } from "@/lib/chroma";
import { sendTrainingMessage } from "@/lib/api";
const SCENARIOS = ["Pedir um aumento", "Dar feedback a um colega", "Apresentar uma ideia", "Resolver um conflito"];
function Train() {
    const [style, setStyle] = useState("vermelho");
    const [scenario, setScenario] = useState(SCENARIOS[0]);
    const [msgs, setMsgs] = useState([]);
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const end = useRef(null);
    useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [msgs, busy]);
    useEffect(() => { setMsgs([{ from: "ia", text: `Olá. Vamos simular: «${scenario}». Eu serei um interlocutor ${STYLES[style].name}. Quando quiseres, começa.` }]); }, [style, scenario]);
    async function send(e) {
        e.preventDefault();
        if (!text.trim() || busy)
            return;
        const mine = text.trim();
        setText("");
        setMsgs((m) => [...m, { from: "eu", text: mine }]);
        setBusy(true);
        const r = await sendTrainingMessage(style, msgs.filter((m) => m.from === "eu").length, mine);
        setMsgs((m) => [...m, { from: "ia", text: r.reply }, { from: "dica", text: r.tip }]);
        setBusy(false);
    }
    return (<div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="animate-rise space-y-8">
        <div><Eyebrow>Treino com IA</Eyebrow><h1 className="mt-2 text-4xl">Treinar</h1></div>
        <div><Eyebrow>Interlocutor</Eyebrow><div className="mt-3 grid grid-cols-2 gap-2">
          {STYLE_ORDER.map((k) => <button key={k} onClick={() => setStyle(k)} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${style === k ? "bg-card font-semibold shadow-soft" : "hover:bg-accent"}`}><span className={`size-2.5 rounded-full ${STYLES[k].bg}`}/>{STYLES[k].name}</button>)}
        </div></div>
        <div><Eyebrow>Cenário</Eyebrow><div className="mt-3 space-y-1">
          {SCENARIOS.map((s) => <button key={s} onClick={() => setScenario(s)} className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${scenario === s ? "bg-card font-semibold shadow-soft" : "hover:bg-accent"}`}>{s}</button>)}
        </div></div>
      </aside>
      <section className="flex h-[70vh] flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4"><span className={`size-3 rounded-full ${STYLES[style].bg}`}/><span className="font-semibold">{scenario}</span><span className="text-sm text-muted-foreground">· {STYLES[style].tag}</span></div>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {msgs.map((m, i) => m.from === "dica"
            ? <p key={i} className="animate-rise border-l-2 pl-3 text-xs text-muted-foreground" style={{ borderColor: STYLES[style].color }}>{m.text}</p>
            : <p key={i} className={`animate-rise max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.from === "eu" ? "ml-auto rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted"}`}>{m.text}</p>)}
          {busy && <p className="w-16 animate-pulse rounded-2xl bg-muted px-4 py-3 text-sm">···</p>}
          <div ref={end}/>
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-border/60 p-4">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreve a tua resposta…" className="flex-1 rounded-full bg-muted px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"/>
          <Btn type="submit" disabled={busy || !text.trim()} aria-label="Enviar" className="px-4"><Send className="size-4"/></Btn>
        </form>
      </section>
    </div>);
}
export default Train;
