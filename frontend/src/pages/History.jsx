
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PageHead, btnClass } from "@/components/chroma/ui";
import { STYLES } from "@/lib/chroma";
import { useUser } from "@/lib/session";

function History() {
    const user = useUser();
    const history = user.history ?? [];

    return (
        <div>

            <PageHead
                eyebrow="Histórico"
                title="As tuas conversas"
                text="Revê os treinos anteriores e a pontuação obtida."
            />

            {history.length === 0 ? (

                <div className="rounded-3xl bg-card p-10 text-center shadow-soft md:p-16">

                    <div className="mx-auto grid size-16 place-items-center rounded-full bg-muted">
                        <MessageCircle className="size-7 text-muted-foreground" />
                    </div>

                    <h2 className="mt-6 text-2xl">
                        Ainda não tens conversas
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                        As tuas conversas e os resultados dos teus
                        treinos vão aparecer aqui assim que realizares
                        o teu primeiro treino de comunicação.
                    </p>

                    <div className="mt-8">
                        <Link
                            to="/treinar"
                            className={btnClass("dark")}
                        >
                            Começar o primeiro treino
                        </Link>
                    </div>

                </div>

            ) : (

                <div className="divide-y divide-border/70 border-y border-border/70">

                    {history.map((h) => (

                        <Link
                            key={h.id}
                            to="/treinar"
                            className="group grid items-center gap-2 py-6 sm:grid-cols-[1fr_auto_auto] sm:gap-10"
                        >

                            <div className="flex items-center gap-4">

                                <span
                                    className={`size-10 shrink-0 rounded-full ${
                                        STYLES[h.style]?.bg ?? "bg-muted"
                                    } transition group-hover:scale-110`}
                                />

                                <div>

                                    <h3 className="text-xl">
                                        {h.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Interlocutor {STYLES[h.style]?.name ?? "Desconhecido"}
                                        {" · "}
                                        {h.messages ?? 0} mensagens
                                    </p>

                                </div>

                            </div>

                            <span className="text-sm text-muted-foreground">
                                {h.date}
                            </span>

                            <span className="font-display text-2xl">
                                {h.score ?? "—"}
                                <span className="text-sm text-muted-foreground">
                                    /100
                                </span>
                            </span>

                        </Link>

                    ))}

                </div>

            )}

        </div>
    );
}

export default History;
