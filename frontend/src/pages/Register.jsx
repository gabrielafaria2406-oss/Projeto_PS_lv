import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/chroma/AuthShell";
import { Btn, Field } from "@/components/chroma/ui";
import { register } from "@/lib/api";
import { signIn } from "@/lib/session";
function Registo() {
    const nav = useNavigate();
    const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
    async function submit(e) {
        e.preventDefault();
        const er = {};
        if (f.name.trim().length < 2)
            er.name = "Indica o teu nome.";
        if (!/^\S+@\S+\.\S+$/.test(f.email))
            er.email = "Introduz um email válido.";
        if (f.password.length < 8)
            er.password = "Usa pelo menos 8 caracteres.";
        if (f.confirm !== f.password)
            er.confirm = "As palavras-passe não coincidem.";
        setErrors(er);
        if (Object.keys(er).length)
            return;
        setBusy(true);
        const u = await register(f.name.trim(), f.email, f.password);
        signIn(u.name, u.email);
        nav({ to: "/quiz" });
    }
    return (<AuthShell title="Criar conta" text="Em poucos minutos descobres a tua cor.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Nome" value={f.name} onChange={set("name")} error={errors.name}/>
        <Field label="Email" type="email" value={f.email} onChange={set("email")} error={errors.email}/>
        <Field label="Palavra-passe" type="password" value={f.password} onChange={set("password")} error={errors.password}/>
        <Field label="Confirmar palavra-passe" type="password" value={f.confirm} onChange={set("confirm")} error={errors.confirm}/>
        <Btn type="submit" disabled={busy} className="w-full">{busy ? "A criar…" : "Criar conta"}</Btn>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Já tens conta? <Link to="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">Iniciar sessão</Link></p>
    </AuthShell>);
}
export default Registo;
