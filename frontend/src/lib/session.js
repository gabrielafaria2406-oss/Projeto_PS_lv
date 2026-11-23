import { useEffect, useState } from "react";
import { DEMO_SCORES } from "./chroma";
const KEY = "chroma_session";
const listeners = new Set();
export function getUser() {
    try {
        const r = localStorage.getItem(KEY);
        return r ? JSON.parse(r) : null;
    }
    catch {
        return null;
    }
}
export function setUser(u) {
    if (u)
        localStorage.setItem(KEY, JSON.stringify(u));
    else
        localStorage.removeItem(KEY);
    listeners.forEach((l) => l());
}
export function signIn(name, email) {
    setUser({ name, email, scores: getUser()?.scores ?? DEMO_SCORES });
}
export function useSession() {
    const [state, setState] = useState({ ready: false, user: null });
    useEffect(() => {
        const sync = () => setState({ ready: true, user: getUser() });
        sync();
        listeners.add(sync);
        return () => { listeners.delete(sync); };
    }, []);
    return state;
}
import { createContext, useContext } from "react";
export const UserContext = createContext(null);
export function useUser() {
    const u = useContext(UserContext);
    if (!u)
        throw new Error("useUser must be used inside the private layout");
    return u;
}
