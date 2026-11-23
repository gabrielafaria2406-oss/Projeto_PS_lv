# CHROMA — Estrutura original + frontend Lovable em JSX

Este pacote conserva a organização `Projeto_PS/backend` e `Projeto_PS/frontend` do projeto académico original.

## Origem dos ficheiros
- `backend/`: copiado **sem alterações** do ZIP `Projeto_PS-main.zip`.
- `frontend/src/data/`, `models/`, `assets/`, `components/ColorWheel*.jsx`, `components/SplashScreen.jsx` e CSS original: preservados do projeto original.
- `frontend/src/pages/`, `components/chroma/`, `components/ui/`, `lib/`, `App.jsx`, `main.jsx` e `styles.css`: frontend Lovable convertido para JSX na versão anterior.

## Atenção às duas implementações da roda
Os componentes `src/components/ColorWheel.jsx` e `ColorWheelSide.jsx` são os **originais**. A roda utilizada pelas páginas do Lovable está em `src/components/chroma/ColorWheel.jsx`. As duas coexistem para não perder código, mas **a roda original ainda não foi integrada visualmente nas páginas do Lovable**.

## Executar
```bash
cd Projeto_PS/frontend
npm install
npm run dev
```

## Limitações e validação
A estrutura foi reorganizada e os ficheiros originais recuperados. Não é garantida equivalência visual/funcional total: a navegação ainda utiliza TanStack Router, a interface Lovable continua a utilizar Tailwind, e as páginas ainda não importam todos os CSS e componentes originais. Não foi feita compilação de validação. O backend original não foi integrado automaticamente nos serviços simulados.

Não substituir a branch main antes de testar.
