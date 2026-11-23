export const STYLES = {
    vermelho: {
        name: "Vermelho", tag: "Direto e decidido", color: "var(--chroma-red)", bg: "bg-chroma-red", text: "text-chroma-red",
        summary: "Comunica com foco em resultados, objetividade e ação. Valoriza a eficiência e decisões rápidas.",
        strengths: ["Clareza e assertividade", "Orientação para objetivos", "Toma decisões com confiança"],
        challenges: ["Pode parecer impaciente", "Tende a ignorar emoções", "Interrompe com facilidade"],
        tips: ["Faz uma pausa antes de responder", "Pergunta como o outro se sente", "Reconhece o contributo dos outros"],
    },
    amarelo: {
        name: "Amarelo", tag: "Expressivo e entusiasta", color: "var(--chroma-yellow)", bg: "bg-chroma-yellow", text: "text-chroma-yellow",
        summary: "Comunica com energia, otimismo e criatividade. Gosta de inspirar e de criar ligação com os outros.",
        strengths: ["Entusiasmo contagiante", "Criatividade", "Facilidade em criar relações"],
        challenges: ["Pode dispersar-se", "Promete mais do que cumpre", "Evita detalhes"],
        tips: ["Estrutura as ideias antes de falar", "Confirma próximos passos", "Ouve até ao fim"],
    },
    verde: {
        name: "Verde", tag: "Empático e cooperante", color: "var(--chroma-green)", bg: "bg-chroma-green", text: "text-chroma-green",
        summary: "Comunica com calma, paciência e atenção às pessoas. Procura harmonia e consenso.",
        strengths: ["Escuta ativa", "Empatia", "Estabilidade e confiança"],
        challenges: ["Evita conflitos", "Tem dificuldade em dizer não", "Resiste à mudança"],
        tips: ["Expressa a tua opinião com clareza", "Aceita o desacordo como saudável", "Define limites"],
    },
    azul: {
        name: "Azul", tag: "Analítico e rigoroso", color: "var(--chroma-blue)", bg: "bg-chroma-blue", text: "text-chroma-blue",
        summary: "Comunica com precisão, lógica e atenção ao detalhe. Valoriza dados e qualidade.",
        strengths: ["Rigor e precisão", "Pensamento crítico", "Planeamento"],
        challenges: ["Pode parecer distante", "Excesso de análise", "Dificuldade com improviso"],
        tips: ["Partilha conclusões antes dos detalhes", "Mostra interesse pessoal", "Aceita soluções suficientes"],
    },
};
export const STYLE_ORDER = ["vermelho", "amarelo", "verde", "azul"];
export const DEMO_SCORES = { vermelho: 18, amarelo: 22, verde: 38, azul: 22 };
export function dominant(s) {
    return STYLE_ORDER.reduce((a, b) => (s[b] > s[a] ? b : a));
}
export const QUIZ = [
    { q: "Numa reunião de grupo, normalmente…", options: { vermelho: "Assumo a liderança e defino prioridades", amarelo: "Lanço ideias e animo a discussão", verde: "Garanto que todos são ouvidos", azul: "Analiso dados e coloco questões" } },
    { q: "Quando recebes uma crítica…", options: { vermelho: "Quero saber logo o que mudar", amarelo: "Fico afetado, mas procuro o lado positivo", verde: "Reflito sobre como o outro se sentiu", azul: "Avalio se a crítica é fundamentada" } },
    { q: "Preferes que te expliquem algo…", options: { vermelho: "De forma curta e direta", amarelo: "Com exemplos e histórias", verde: "Com calma e tempo para perguntas", azul: "Com detalhe e estrutura lógica" } },
    { q: "Num conflito, tendes a…", options: { vermelho: "Enfrentar o problema de imediato", amarelo: "Aliviar o ambiente com humor", verde: "Procurar um compromisso", azul: "Reunir factos antes de agir" } },
    { q: "O que mais te motiva num projeto?", options: { vermelho: "Alcançar resultados", amarelo: "Reconhecimento e novidade", verde: "Um bom ambiente de equipa", azul: "Fazer um trabalho de qualidade" } },
    { q: "Os teus amigos descrevem-te como…", options: { vermelho: "Determinado", amarelo: "Divertido", verde: "Leal", azul: "Ponderado" } },
    { q: "Ao tomar uma decisão importante…", options: { vermelho: "Decido rapidamente", amarelo: "Sigo a intuição", verde: "Peço opinião a quem confio", azul: "Comparo todas as opções" } },
    { q: "Numa conversa difícil, valorizas…", options: { vermelho: "Honestidade sem rodeios", amarelo: "Abertura e espontaneidade", verde: "Respeito e empatia", azul: "Argumentos claros" } },
];
export const CONTENTS = [
    { id: 1, style: "vermelho", title: "Assertividade sem agressividade", kind: "Artigo", min: 6, text: "Como ser direto preservando a relação com o outro." },
    { id: 2, style: "amarelo", title: "Do entusiasmo à ação", kind: "Guia", min: 8, text: "Transformar ideias em compromissos concretos." },
    { id: 3, style: "verde", title: "A arte de dizer não", kind: "Artigo", min: 5, text: "Definir limites com empatia e firmeza." },
    { id: 4, style: "azul", title: "Comunicar dados a não especialistas", kind: "Vídeo", min: 10, text: "Simplificar sem perder rigor." },
    { id: 5, style: "verde", title: "Escuta ativa em 4 passos", kind: "Exercício", min: 7, text: "Técnicas para ouvir verdadeiramente." },
    { id: 6, style: "vermelho", title: "Feedback que motiva", kind: "Guia", min: 9, text: "Estruturar feedback útil e respeitoso." },
];
export const HISTORY = [
    { id: "c1", title: "Pedir aumento à chefia", style: "vermelho", date: "20 nov 2026", messages: 14, score: 82 },
    { id: "c2", title: "Apresentar ideia ao grupo", style: "amarelo", date: "17 nov 2026", messages: 10, score: 76 },
    { id: "c3", title: "Gerir conflito com colega", style: "verde", date: "12 nov 2026", messages: 18, score: 88 },
    { id: "c4", title: "Explicar um relatório técnico", style: "azul", date: "05 nov 2026", messages: 12, score: 71 },
];
export const MONTH = { trainings: 12, conversations: 9, minutes: 214, growth: 14 };
export const EVOLUTION = [
    { week: "S1", value: 58 }, { week: "S2", value: 63 }, { week: "S3", value: 61 }, { week: "S4", value: 70 },
    { week: "S5", value: 74 }, { week: "S6", value: 79 }, { week: "S7", value: 82 }, { week: "S8", value: 86 },
];
