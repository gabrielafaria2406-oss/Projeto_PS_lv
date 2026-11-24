
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Btn, Eyebrow, Field, PageHead } from "@/components/chroma/ui";
import { STYLES, dominant, ZERO_SCORES } from "@/lib/chroma";
import { setUser, useUser } from "@/lib/session";

function Profile() {
    const user = useUser();
    const nav = useNavigate();

    const [name, setName] = useState(user.name);
    const [saved, setSaved] = useState(false);

    const [prefs, setPrefs] = useState(
        user.prefs ?? {
            lembretes: true,
            dicas: true,
            newsletter: false
        }
    );

    const scores = user.scores ?? ZERO_SCORES;
    const dom = dominant(scores);
    const style = dom ? STYLES[dom] : null;

    function saveProfile(e) {
        e.preventDefault();

        if (!name.trim())
            return;

        setUser({
            ...user,
            name: name.trim(),
            prefs
        });

        setSaved(true);

        setTimeout(() => setSaved(false), 2000);
    }

    function togglePreference(key) {
        const updatedPrefs = {
            ...prefs,
            [key]: !prefs[key]
        };

        setPrefs(updatedPrefs);

        setUser({
            ...user,
            prefs: updatedPrefs
        });
    }

    function logout() {
        setUser(null);
        nav({ to: "/" });
    }

    return (
        <div className="max-w-3xl">

            <PageHead
                eyebrow="Perfil"
                title="Perfil e definições"
            />

            <div className="flex items-center gap-5">

                <div
                    className="grid size-20 place-items-center rounded-full font-display text-3xl text-primary-foreground"
                    style={{
                        background: style?.color ?? "var(--ink, #291F1F)"
                    }}
                >
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <p className="font-display text-2xl">
                        {user.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {style
                            ? `Estilo ${style.name}`
                            : "Perfil por descobrir"
                        }
                    </p>
                </div>

            </div>

            <form
                className="mt-10 grid gap-5 sm:grid-cols-2"
                onSubmit={saveProfile}
            >

                <Field
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Field
                    label="Email"
                    type="email"
                    value={user.email}
                    readOnly
                />

                <div className="sm:col-span-2">

                    <Btn type="submit" disabled={!name.trim()}>
                        {saved
                            ? "Guardado ✓"
                            : "Guardar alterações"
                        }
                    </Btn>

                </div>

            </form>

            <div className="mt-14">

                <Eyebrow>Preferências</Eyebrow>

                <div className="mt-4 divide-y divide-border/70 border-y border-border/70">

                    {[
                        ["lembretes", "Lembretes de treino semanais"],
                        ["dicas", "Dicas durante os treinos"],
                        ["newsletter", "Novidades por email"]
                    ].map(([k, l]) => (

                        <label
                            key={k}
                            className="flex cursor-pointer items-center justify-between py-4"
                        >

                            <span>{l}</span>

                            <button
                                type="button"
                                role="switch"
                                aria-label={l}
                                aria-checked={prefs[k]}
                                onClick={() => togglePreference(k)}
                                className={`relative h-6 w-11 rounded-full transition ${
                                    prefs[k]
                                        ? "bg-primary"
                                        : "bg-muted"
                                }`}
                            >

                                <span
                                    className={`absolute top-0.5 size-5 rounded-full bg-card shadow-soft transition-all ${
                                        prefs[k]
                                            ? "left-[22px]"
                                            : "left-0.5"
                                    }`}
                                />

                            </button>

                        </label>

                    ))}

                </div>

            </div>

            <Btn
                variant="ghost"
                className="mt-12"
                onClick={logout}
            >
                Terminar sessão
            </Btn>

        </div>
    );
}

export default Profile;
