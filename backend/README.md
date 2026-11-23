# Backend Chroma — etapa 1

## Requisitos
Python 3.10+ e, para a etapa da base de dados, MySQL.

## Iniciar no PowerShell
A partir da pasta `backend`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Se o PowerShell bloquear a ativação, podes executar diretamente:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Abre http://127.0.0.1:8000/docs e testa `GET /api/health`.

## Base de dados (próxima etapa)
Copia `.env.example` para `.env` e ajusta `DATABASE_URL` com as credenciais locais. Nunca envies `.env` para o GitHub. Esta primeira etapa **não cria tabelas** nem autenticação.

## Integração
Coloca a pasta `backend` na raiz do repositório `Projeto_PS`, ao lado de `frontend`. O frontend não foi modificado.
