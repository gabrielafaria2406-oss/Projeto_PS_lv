// Camada de serviços: hoje devolve dados fictícios; trocar por fetch para a API REST Flask.
// Exemplo: fetch(`${API_URL}/auth/login`, { method: "POST", body: JSON.stringify(data) })
import { STYLES } from "./chroma";
export const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
export async function login(email, _password) {
    await wait(500); // TODO: POST /auth/login
    return { name: email.split("@")[0]?.replace(/^./, (c) => c.toUpperCase()) || "Sofia", email };
}
export async function register(name, email, _password) {
    await wait(500); // TODO: POST /auth/register
    return { name, email };
}
const REPLIES = {
    vermelho: ["Vamos direto ao assunto. O que propões exatamente?", "Certo. E qual é o resultado concreto que esperas?", "Bom argumento. Preciso de uma resposta até sexta."],
    amarelo: ["Adoro a energia! Conta-me mais sobre essa ideia.", "Isso pode ser incrível! Como imaginas o grupo a participar?", "Gosto muito! Vamos pensar em como tornar isto divertido."],
    verde: ["Obrigado por partilhares. Como te sentes em relação a isso?", "Percebo. Quero ter a certeza de que estamos os dois confortáveis.", "Faz sentido. Podemos encontrar um meio-termo juntos?"],
    azul: ["Interessante. Que dados sustentam essa proposta?", "Podes detalhar as etapas e os prazos?", "Compreendo. Quais são os riscos que identificaste?"],
};
export async function sendTrainingMessage(style, turn, _text) {
    await wait(900); // TODO: POST /training/message (Flask → OpenAI)
    const list = REPLIES[style];
    return { reply: list[turn % list.length], tip: `Dica: com um perfil ${STYLES[style].name}, ${STYLES[style].tips[turn % 3].toLowerCase()}.` };
}
