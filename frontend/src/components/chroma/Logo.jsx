import { Link } from "@tanstack/react-router";
export function Logo({ to = "/" }) {
    return (<Link to={to} className="flex items-center gap-2.5">
      <span className="grid size-6 grid-cols-2 overflow-hidden rounded-full">
        <span className="bg-chroma-red"/><span className="bg-chroma-yellow"/>
        <span className="bg-chroma-blue"/><span className="bg-chroma-green"/>
      </span>
      <span className="font-display text-xl font-semibold tracking-[0.18em]">CHROMA</span>
    </Link>);
}
