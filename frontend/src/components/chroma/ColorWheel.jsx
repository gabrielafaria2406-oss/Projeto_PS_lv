import { useState } from "react";
import { STYLES, STYLE_ORDER } from "@/lib/chroma";
function arc(cx, cy, r1, r2, a0, a1) {
    const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)].map((n) => n.toFixed(2)).join(" ");
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${p(r2, a0)} A ${r2} ${r2} 0 ${large} 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 ${large} 0 ${p(r1, a0)} Z`;
}
export function ColorWheel({ scores, highlight, center, className = "" }) {
    const [hover, setHover] = useState(null);
    const total = scores ? STYLE_ORDER.reduce((a, k) => a + scores[k], 0) : 4;
    let a = -Math.PI / 2;
    const gap = 0.035;
    const active = hover ?? highlight;
    return (<div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 200 200" className="animate-wheel size-full overflow-visible">
        {STYLE_ORDER.map((k) => {
            const share = (scores ? scores[k] : 1) / total;
            const a0 = a + gap, a1 = a + share * Math.PI * 2 - gap;
            const mid = (a0 + a1) / 2;
            a += share * Math.PI * 2;
            const on = active === k;
            return (<path key={k} d={arc(100, 100, 58, 96, a0, a1)} fill={STYLES[k].color} onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ transform: on ? `translate(${Math.cos(mid) * 4}px, ${Math.sin(mid) * 4}px)` : undefined, opacity: active && !on ? 0.55 : 1 }} className="cursor-pointer transition-all duration-500 ease-out">
              <title>{`${STYLES[k].name}${scores ? ` · ${scores[k]}%` : ""}`}</title>
            </path>);
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
        {hover ? (<div className="animate-rise">
            <p className="font-display text-2xl">{STYLES[hover].name}</p>
            <p className="text-sm text-muted-foreground">{scores ? `${scores[hover]}%` : STYLES[hover].tag}</p>
          </div>) : center}
      </div>
    </div>);
}
