
import { Eyebrow, PageHead } from "@/components/chroma/ui";
import { STYLES, STYLE_ORDER } from "@/lib/chroma";
import { useUser } from "@/lib/session";

function Evolution() {
    const user = useUser();

    const history = user.history ?? [];

    const scoredHistory = history.filter(
        (h) =>
            typeof h.score === "number" &&
            Number.isFinite(h.score) &&
            h.score >= 0 &&
            h.score <= 100
    );

    function average(items) {
        if (items.length === 0)
            return 0;

        return Math.round(
            items.reduce((sum, h) => sum + h.score, 0)
            / items.length
        );
    }

    const today = new Date();

    const currentWeek = new Date(today);
    currentWeek.setHours(0, 0, 0, 0);

    const day = (currentWeek.getDay() + 6) % 7;

    currentWeek.setDate(currentWeek.getDate() - day);

    const evolution = Array.from({ length: 8 }, (_, i) => {

        const start = new Date(currentWeek);

        start.setDate(
            start.getDate() - (7 - i) * 7
        );

        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        const weeklyHistory = scoredHistory.filter((h) => {

            const date = new Date(h.createdAt ?? h.date);

            return date >= start && date < end;

        });

        return {
            week: start.toLocaleDateString("pt-PT", {
                day: "2-digit",
                month: "2-digit"
            }),
            value: average(weeklyHistory),
            count: weeklyHistory.length
        };

    });

    const hasEvolution = evolution.some(
        (e) => e.count > 0
    );

    return (
        <div>

            <PageHead
                eyebrow="Evolução"
                title="O teu progresso"
                text="Pontuação média dos treinos nas últimas oito semanas."
            />

            <div className="rounded-3xl bg-card p-8 shadow-soft">

                {!hasEvolution && (
                    <div className="mb-6 text-center">

                        <h2 className="text-xl">
                            A tua evolução começa aqui
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Realiza treinos de comunicação para
                            acompanhares o teu progresso ao longo do tempo.
                        </p>

                    </div>
                )}

                <div className="flex h-64 items-end gap-3 md:gap-6">

                    {evolution.map((e, i) => (

                        <div
                            key={e.week}
                            className="group flex flex-1 flex-col items-center gap-2"
                        >

                            <span className="text-xs opacity-0 transition group-hover:opacity-100">
                                {e.count > 0 ? e.value : "—"}
                            </span>

                            <div
                                className={`w-full origin-bottom animate-rise rounded-t-xl transition ${
                                    e.count > 0
                                        ? "bg-primary/85 group-hover:bg-primary"
                                        : "bg-muted"
                                }`}
                                style={{
                                    height: `${Math.max(
                                        (e.value / 100) * 200,
                                        4
                                    )}px`,
                                    animationDelay: `${i * 60}ms`
                                }}
                            />

                            <span className="text-xs text-muted-foreground">
                                {e.week}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

            <div className="mt-12 grid gap-12 md:grid-cols-2">

                <dl className="grid grid-cols-2 gap-8">

                    {[
                        ["Treinos este mês", user.trainings ?? 0],
                        ["Conversas", user.conversations ?? 0],
                        ["Minutos de prática", user.minutes ?? 0],
                        ["Melhoria", `${user.growth ?? 0}%`]
                    ].map(([l, v]) => (

                        <div key={l}>

                            <dd className="font-display text-4xl">
                                {v}
                            </dd>

                            <dt className="mt-1 text-sm text-muted-foreground">
                                {l}
                            </dt>

                        </div>

                    ))}

                </dl>

                <div>

                    <Eyebrow>
                        Desempenho por interlocutor
                    </Eyebrow>

                    <div className="mt-5 space-y-4">

                        {STYLE_ORDER.map((k) => {

                            const styleHistory = scoredHistory.filter(
                                (h) => h.style === k
                            );

                            const value = average(styleHistory);

                            return (

                                <div key={k}>

                                    <div className="flex justify-between text-sm">

                                        <span>
                                            {STYLES[k].name}
                                        </span>

                                        <span className="font-semibold">
                                            {value}
                                        </span>

                                    </div>

                                    <div className="mt-1.5 h-1.5 rounded-full bg-muted">

                                        <div
                                            className={`h-full rounded-full ${STYLES[k].bg}`}
                                            style={{
                                                width: `${value}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Evolution;
