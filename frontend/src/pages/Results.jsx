import { Link } from "@tanstack/react-router";
import { ColorWheel } from "@/components/chroma/ColorWheel";
import { btnClass, Eyebrow } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER, dominant } from "@/lib/chroma";
import { useUser } from "@/lib/session";
function Results() {
    const user = useUser();
    const dom = dominant(user.scores);
    return (<div className="grid items-center gap-14 md:grid-cols-2">
      <div className="animate-rise">
        <Eyebrow>O teu resultado</Eyebrow>
        <h1 className="mt-3 text-5xl md:text-6xl">És predominantemente <span className={STYLES[dom].text}>{STYLES[dom].name}</span>.</h1>
        <p className="mt-5 text-lg text-muted-foreground">{STYLES[dom].summary}</p>
        <div className="mt-10 space-y-4">
          {[...STYLE_ORDER].sort((a, b) => user.scores[b] - user.scores[a]).map((k) => (<div key={k}>
              <div className="flex justify-between text-sm"><span>{STYLES[k].name}</span><span className="font-semibold">{user.scores[k]}%</span></div>
              <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${STYLES[k].bg}`} style={{ width: `${user.scores[k]}%` }}/></div>
            </div>))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/meu-estilo" className={btnClass("dark")}>Explorar o meu estilo</Link>
          <Link to="/quiz" className={btnClass("ghost")}>Repetir quiz</Link>
        </div>
      </div>
      <ColorWheel scores={user.scores} highlight={dom} className="mx-auto w-full max-w-md" center={<p className="font-display text-4xl">{user.scores[dom]}%</p>}/>
    </div>);
}
export default Results;
