import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/chroma/AuthShell";
import { Btn, Field } from "@/components/chroma/ui";
import { login } from "@/lib/api";
import { signIn } from "@/lib/session";
function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("sofia@chroma.pt");
    const [password, setPassword] = useState("demo1234");
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    async function submit(e) {
        e.preventDefault();
        const er = {};
        if (!/^\S+@\S+\.\S+$/.test(email))
            er.email = "Introduz um email válido.";
        if (password.length < 6)
            er.password = "A palavra-passe tem de ter pelo menos 6 caracteres.";
        setErrors(er);
        if (Object.keys(er).length)
            return;
        setBusy(true);
        const u = await login(email, password);
        signIn(u.name, u.email);
        nav({ to: "/inicio" });
    }
    return (<AuthShell title="Bem-vinda de volta" text="Usa os dados de demonstração já preenchidos para entrar.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email}/>
        <Field label="Palavra-passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password}/>
        <Btn type="submit" disabled={busy} className="w-full">{busy ? "A entrar…" : "Entrar"}</Btn>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Ainda não tens conta? <Link to="/registo" className="font-semibold text-foreground underline-offset-4 hover:underline">Criar conta</Link></p>
    </AuthShell>);
}
export default Login;
