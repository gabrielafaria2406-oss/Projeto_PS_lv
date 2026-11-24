
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/chroma/Logo";
import { STYLES, dominant, ZERO_SCORES } from "@/lib/chroma";
import { UserContext, useSession } from "@/lib/session";

const LINKS = [
    { to: "/inicio", label: "Início" },
    { to: "/meu-estilo", label: "O meu estilo" },
    { to: "/treinar", label: "Treinar" },
    { to: "/historico", label: "Histórico" },
];

function PrivateLayout() {
    const { ready, user } = useSession();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (ready && !user)
            nav({ to: "/login" });
    }, [ready, user, nav]);

    if (!ready || !user)
        return <div className="min-h-screen" />;

    const scores = user.scores ?? ZERO_SCORES;
    const dom = dominant(scores);
    const style = dom ? STYLES[dom] : null;

    const link = "rounded-full px-4 py-2 text-sm transition hover:bg-accent";

    return (
        <div className="min-h-screen">

            <header className="sticky top-0 z-20 bg-background/85 backdrop-blur">

                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

                    <Logo to="/inicio" />

                    <nav className="hidden gap-1 md:flex">
                        {LINKS.map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={link}
                                activeProps={{
                                    className: "bg-card shadow-soft font-semibold"
                                }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">

                        <Link
                            to="/perfil"
                            aria-label="Perfil"
                            className="grid size-10 place-items-center rounded-full font-semibold text-primary-foreground transition hover:scale-105"
                            style={{
                                background: style?.color ?? "var(--ink)"
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Link>

                        <button
                            className="grid size-10 place-items-center md:hidden"
                            aria-label="Menu"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <X /> : <Menu />}
                        </button>

                    </div>
                </div>

                {open && (
                    <nav
                        className="flex flex-col gap-1 px-6 pb-4 md:hidden"
                        onClick={() => setOpen(false)}
                    >
                        {[
                            ...LINKS,
                            { to: "/conteudos", label: "Conteúdos" },
                            { to: "/evolucao", label: "Evolução" }
                        ].map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={link}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                )}

            </header>

            <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
                <UserContext.Provider value={user}>
                    <Outlet />
                </UserContext.Provider>
            </main>

        </div>
    );
}

export default PrivateLayout;
