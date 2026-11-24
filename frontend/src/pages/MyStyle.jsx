
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eyebrow, PageHead, btnClass } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER, dominant, ZERO_SCORES } from "@/lib/chroma";
import { useUser } from "@/lib/session";

function MyStyle() {
    const user = useUser();

    const scores = user.scores ?? ZERO_SCORES;
    const dom = dominant(scores);

    const [selected, setSel] = useState(null);

    const sel = selected ?? dom;
    const s = sel ? STYLES[sel] : null;
    const myStyle = dom ? STYLES[dom] : null;

    return (
        <div>

            <PageHead
                eyebrow="O meu estilo"
                title={
                    myStyle
                        ? `${myStyle.name} — ${myStyle.tag.toLowerCase()}`
                        : "Descobre o teu estilo"
                }
                text={
                    myStyle
                        ? "Explora o teu estilo e aprende a comunicar com cada uma das outras cores."
                        : "Realiza o quiz para descobrires o teu estilo predominante ou explora as quatro cores de comunicação."
                }
            />

            {!myStyle && (
                <div className="mb-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">

                    <Eyebrow>Perfil por descobrir</Eyebrow>

                    <h2 className="mt-3 text-2xl">
                        Qual é a tua cor?
                    </h2>

                    <p className="mt-3 max-w-xl text-muted-foreground">
                        Ainda não realizaste o quiz de comunicação.
                        Responde às perguntas e descobre qual dos quatro
                        estilos melhor representa a tua forma de comunicar.
                    </p>

                    <div className="mt-6">
                        <Link
                            to="/quiz"
                            className={btnClass("dark")}
                        >
                            Realizar quiz
                        </Link>
                    </div>

                </div>
            )}

            <div className="flex flex-wrap gap-2">

                {STYLE_ORDER.map((k) => (
                    <button
                        key={k}
                        type="button"
                        onClick={() => setSel(k)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                            sel === k
                                ? "bg-card font-semibold shadow-soft"
                                : "hover:bg-accent"
                        }`}
                    >

                        <span
                            className={`size-2.5 rounded-full ${STYLES[k].bg}`}
                        />

                        {STYLES[k].name}

                        {k === dom && " · tu"}

                    </button>
                ))}

            </div>

            {s ? (
                <>
                    <div
                        key={sel}
                        className="animate-rise mt-10 rounded-3xl bg-card p-8 shadow-soft md:p-12"
                    >

                        <span
                            className={`block h-1 w-16 rounded-full ${s.bg}`}
                        />

                        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug">
                            {s.summary}
                        </p>

                        <div className="mt-10 grid gap-10 md:grid-cols-3">

                            {[
                                ["Forças", s.strengths],
                                ["Desafios", s.challenges],
                                [
                                    sel === dom
                                        ? "Para evoluíres"
                                        : "Como comunicar com este estilo",
                                    s.tips
                                ]
                            ].map(([t, l]) => (

                                <div key={t}>

                                    <Eyebrow>{t}</Eyebrow>

                                    <ul className="mt-4 space-y-3">

                                        {l.map((x) => (
                                            <li
                                                key={x}
                                                className="border-b border-border/60 pb-3"
                                            >
                                                {x}
                                            </li>
                                        ))}

                                    </ul>

                                </div>

                            ))}

                        </div>

                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">

                        <Link
                            to="/treinar"
                            className={btnClass("dark")}
                        >
                            Praticar com este estilo
                        </Link>

                        <Link
                            to="/conteudos"
                            className={btnClass("ghost")}
                        >
                            Ver conteúdos
                        </Link>

                    </div>
                </>
            ) : (
                <div className="mt-10 rounded-3xl bg-card p-8 text-center shadow-soft md:p-12">

                    <h2 className="text-2xl">
                        Explora os quatro estilos
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                        Seleciona uma das cores acima para conheceres
                        as suas características, forças e desafios.
                    </p>

                </div>
            )}

        </div>
    );
}

export default MyStyle;
