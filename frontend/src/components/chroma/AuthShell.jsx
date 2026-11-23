import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
export function AuthShell({ title, text, children }) {
    return (<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="animate-rise w-full max-w-md rounded-3xl bg-card p-8 shadow-soft md:p-10">
        <Logo />
        <h1 className="mt-8 text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        <div className="mt-8">{children}</div>
      </div>
      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">← Voltar à página inicial</Link>
    </div>);
}
