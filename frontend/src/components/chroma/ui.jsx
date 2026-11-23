import { cn } from "@/lib/utils";
export function Btn({ variant = "dark", className, ...p }) {
    return <button {...p} className={cn(btnClass(variant), className)}/>;
}
export function btnClass(variant = "dark") {
    return cn("inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0", variant === "dark" ? "bg-primary text-primary-foreground hover:shadow-soft" : "border border-foreground/20 hover:border-foreground/60");
}
export function Field({ label, error, ...p }) {
    return (<label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input {...p} className={cn("w-full rounded-xl border bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-foreground/50 focus:bg-card", error ? "border-destructive" : "border-input")}/>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>);
}
export function Eyebrow({ children, className }) {
    return <p className={cn("text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", className)}>{children}</p>;
}
export function PageHead({ eyebrow, title, text }) {
    return (<header className="animate-rise mb-12 max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{title}</h1>
      {text && <p className="mt-4 text-lg text-muted-foreground">{text}</p>}
    </header>);
}
