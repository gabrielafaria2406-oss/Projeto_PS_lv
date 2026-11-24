
import { useEffect, useState, createContext, useContext } from "react";
import { ZERO_SCORES } from "./chroma";

const KEY = "chroma_session";
const USERS_KEY = "chroma_users";
const listeners = new Set();

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
        return {};
    }
}

export function getUser() {
    try {
        const r = localStorage.getItem(KEY);
        return r ? JSON.parse(r) : null;
    } catch {
        return null;
    }
}

export function setUser(u) {
    if (u) {
        const email = u.email.trim().toLowerCase();
        const users = getUsers();

        const updatedUser = {
            ...u,
            email
        };

        users[email] = updatedUser;

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(KEY, JSON.stringify(updatedUser));
    } else {
        localStorage.removeItem(KEY);
    }

    listeners.forEach((l) => l());
}

export function signIn(name, email) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const savedUser = users[normalizedEmail];

    if (savedUser) {
        setUser({
            ...savedUser,
            history: savedUser.history ?? [],
            quizHistory: savedUser.quizHistory ?? [],
            prefs: savedUser.prefs ?? {
                lembretes: true,
                dicas: true,
                newsletter: false
            }
        });
    } else {
        setUser({
            name,
            email: normalizedEmail,
            scores: { ...ZERO_SCORES },
            progress: 0,
            trainings: 0,
            conversations: 0,
            minutes: 0,
            growth: 0,
            history: [],
            quizHistory: [],
            prefs: {
                lembretes: true,
                dicas: true,
                newsletter: false
            }
        });
    }
}

export function useSession() {
    const [state, setState] = useState({
        ready: false,
        user: null
    });

    useEffect(() => {
        const sync = () => setState({
            ready: true,
            user: getUser()
        });

        sync();
        listeners.add(sync);

        return () => {
            listeners.delete(sync);
        };
    }, []);

    return state;
}

export const UserContext = createContext(null);

export function useUser() {
    const u = useContext(UserContext);

    if (!u)
        throw new Error("useUser must be used inside the private layout");

    return u;
}
