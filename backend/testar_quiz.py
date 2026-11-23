
import requests

BASE_URL = "http://127.0.0.1:8000"
TOKEN = "COLA_AQUI_O_TOKEN"
ATTEMPT_ID = 9

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# 1. Obter as 35 perguntas
response = requests.get(
    f"{BASE_URL}/api/quiz/questions",
    params={"question_limit": 35},
    headers=headers
)

response.raise_for_status()
questions = response.json()["questions"]

print(f"Perguntas encontradas: {len(questions)}")

if len(questions) != 35:
    raise Exception("O quiz não contém exatamente 35 perguntas.")

# 2. Responder automaticamente
# Neste teste será escolhida a primeira opção de cada pergunta.

for index, question in enumerate(questions, 1):

    if not question["options"]:
        raise Exception(f"Pergunta {question['id']} sem opções.")

    option = question["options"][0]

    data = {
        "attempt_id": ATTEMPT_ID,
        "question_id": question["id"],
        "option_id": option["id"]
    }

    result = requests.post(
        f"{BASE_URL}/api/quiz/answer",
        headers=headers,
        json=data
    )

    if result.status_code in (200, 201):
        print(f"Pergunta {index}/35: OK")
    else:
        print(f"Erro na pergunta {index}:")
        print(result.status_code, result.text)
        break

else:
    print("\n35 respostas enviadas com sucesso!")
    print(f"Tentativa utilizada: {ATTEMPT_ID}")
