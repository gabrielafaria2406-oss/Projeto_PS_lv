# CHROMA — frontend React + JavaScript/JSX

Conversão da versão Lovable fornecida pelo utilizador para uma estrutura próxima da original.

## Executar

1. Instalar Node.js (versão compatível com Vite 8).
2. No terminal, entrar na pasta frontend.
3. Executar `npm install`.
4. Executar `npm run dev`.

## Organização

- `src/pages/*.jsx`: páginas
- `src/components/**/*.jsx`: componentes (inclui componentes UI reutilizáveis)
- `src/App.jsx`: configuração das rotas
- `src/main.jsx`: entrada React
- `src/styles.css`: estilos originais do Lovable com Tailwind CSS v4
- `src/styles/`: espaço para futuros CSS por página
- `src/lib/`: dados, sessão e serviços simulados

## Observações

- Todos os ficheiros React/TypeScript foram convertidos para JavaScript/JSX.
- Foi removida a dependência de TanStack Start (servidor); a navegação mantém TanStack Router em modo SPA para preservar o comportamento.
- A lógica demonstrativa do Lovable foi preservada. Não foi acrescentado um backend real.
- O logótipo original não estava incluído no ZIP recebido.
- Não foi possível executar npm install/build neste ambiente sem acesso ao registo npm. Testar localmente antes de integrar na branch principal.
- Os ficheiros em `src/styles/` são pontos de organização, não uma reescrita dos estilos originais; para preservar o design, o CSS efetivo permanece em `src/styles.css`.
