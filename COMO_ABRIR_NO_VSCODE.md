# CHROMA JSX — como usar no VS Code e no GitHub

## 1. Abrir localmente
1. Extrai este ZIP.
2. No VS Code, abre `Projeto_PS/frontend` (ou a raiz `Projeto_PS` se quiseres visualizar a pasta backend).
3. Abre o terminal na pasta `frontend`.
4. Executa `npm install` e `npm run dev`.

## 2. Colocar no repositório para trabalhar com a colega
O ZIP é uma cópia do projeto, **não contém a pasta `.git`**. Para manter o histórico e a colaboração, o mais seguro é:
1. Clonar o repositório GitHub que já está ligado ao Lovable numa pasta separada.
2. Criar uma branch de migração: `git switch -c migracao-jsx`.
3. Copiar o conteúdo de `Projeto_PS/frontend` deste ZIP para o diretório do repositório clonado, substituindo a estrutura Lovable antiga (mas **não apagar a pasta `.git`**).
4. Se o repositório só contiver o frontend, copiar os **ficheiros internos** da pasta `frontend`, não a pasta `Projeto_PS` toda.
5. Executar `npm install` e `npm run build`, corrigindo eventuais problemas antes do commit.
6. Fazer commit e push: `git add .`, `git commit -m "Migrar frontend Lovable para React JSX"`, `git push -u origin migracao-jsx`.
7. Abrir Pull Request e rever em conjunto. Não integrar na `main` sem testar.

## 3. Notas
- Não colocar chaves de API no frontend.
- A pasta `backend` é um marcador; o backend real da equipa não estava no ZIP enviado.
- O CSS principal continua em `src/styles.css`, para manter o visual Lovable; os ficheiros `src/styles/*.css` são espaços para futura divisão.
- As funcionalidades são as que existiam no código Lovable enviado; isto não acrescenta um backend nem funcionalidades que ainda não estivessem implementadas.
- O Lovable poderá deixar de conseguir editar/sincronizar corretamente o projeto depois de alterações profundas na estrutura do repositório. Guarda uma cópia e trabalha em branch separada.
