
import { Link } from "@tanstack/react-router";
import logoChroma from "@/assets/chroma-logo2.png";

export function Logo({ to = "/" }) {
    return (
        <Link to={to} className="flex items-center">
            <img
                src={logoChroma}
                alt="CHROMA"
                className="w-50 h-auto object-contain -ml-4"
            />
        </Link>
    );
}
