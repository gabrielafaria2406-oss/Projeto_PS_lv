
import { useState } from "react";
import { STYLES, STYLE_ORDER } from "@/lib/chroma";

// Calcula a geometria dos segmentos da roda
function arc(cx, cy, r1, r2, a0, a1) {
    const p = (r, a) =>
        [
            cx + r * Math.cos(a),
            cy + r * Math.sin(a)
        ]
            .map((n) => n.toFixed(2))
            .join(" ");

    const large = a1 - a0 > Math.PI ? 1 : 0;

    return `M ${p(r2, a0)}
            A ${r2} ${r2} 0 ${large} 1 ${p(r2, a1)}
            L ${p(r1, a1)}
            A ${r1} ${r1} 0 ${large} 0 ${p(r1, a0)}
            Z`;
}

// Componente reutilizável da roda de cores
export function ColorWheel({
    scores,
    highlight,
    center,
    className = ""
}) {

    // Estados de interação
    const [hover, setHover] = useState(null);
    const [selected, setSelected] = useState(null);

    const total = scores
        ? STYLE_ORDER.reduce((a, k) => a + scores[k], 0)
        : 4;

    let a = -Math.PI / 2;

    const gap = 0.035;

    const currentStyle = hover ?? selected;
    const active = currentStyle ?? highlight;

    // Seleciona ou desmarca um estilo
    function selectStyle(key) {
        setSelected((previous) =>
            previous === key ? null : key
        );
    }

    return (
        <div className={`relative aspect-square ${className}`}>

            {/* SEGMENTOS DA RODA */}
            <svg
                viewBox="0 0 200 200"
                className="animate-wheel size-full overflow-visible"
            >

                {STYLE_ORDER.map((k) => {

                    if (!total) return null;

                    const share =
                        (scores ? scores[k] : 1) / total;

                    const a0 = a + gap;
                    const a1 = a + share * Math.PI * 2 - gap;

                    const mid = (a0 + a1) / 2;

                    a += share * Math.PI * 2;

                    if (a1 <= a0) return null;

                    const on = active === k;

                    return (
                        <path
                            key={k}

                            d={arc(
                                100,
                                100,
                                58,
                                96,
                                a0,
                                a1
                            )}

                            fill={STYLES[k].color}

                            onMouseEnter={() => setHover(k)}
                            onMouseLeave={() => setHover(null)}

                            onClick={() => selectStyle(k)}

                            role="button"
                            tabIndex={0}

                            aria-label={STYLES[k].tag}
                            aria-pressed={selected === k}

                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    selectStyle(k);
                                }
                            }}

                            style={{
                                transform: on
                                    ? `translate(${Math.cos(mid) * 4}px, ${Math.sin(mid) * 4}px)`
                                    : undefined,

                                opacity:
                                    active && !on ? 0.55 : 1
                            }}

                            className="cursor-pointer transition-all duration-500 ease-out"
                        />
                    );

                })}

            </svg>

            {/* CONTEÚDO CENTRAL DA RODA */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">

                {currentStyle ? (

                    <div
                        key={currentStyle}
                        className="animate-rise w-[52%]"
                    >

                        {scores ? (

                            <>
                                <p className="font-display text-2xl">
                                    {STYLES[currentStyle].name}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    {scores[currentStyle]}%
                                </p>
                            </>

                        ) : (

                            <p className="font-display text-2xl leading-snug">
                                {STYLES[currentStyle].tag}
                            </p>

                        )}

                    </div>

                ) : center}

            </div>

        </div>
    );
}
