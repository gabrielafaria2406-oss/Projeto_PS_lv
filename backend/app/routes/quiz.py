

from datetime import datetime, timezone



from fastapi import APIRouter, Depends, HTTPException, Query

from pydantic import BaseModel, Field


from sqlalchemy.orm import Session



from ..database import get_db

from ..security import get_current_user
from ..repo import quiz_repository





router = APIRouter(

    prefix="/api/quiz",

    tags=["Quiz"]

)



TOTAL_QUESTIONS = 35

TOLERANCE_POINTS = 2



STYLES = {

    1: "Vermelho",

    2: "Amarelo",

    3: "Verde",

    4: "Azul"

}
# =====================================# MODELOS# =====================================
class AnswerRequest(BaseModel):

    attempt_id: int = Field(gt=0)

    question_id: int = Field(gt=0)

    option_id: int = Field(gt=0)
# =====================================# FUNÇÕES AUXILIARES# =====================================
def get_attempt(db, attempt_id, user_id):

    attempt = quiz_repository.find_attempt(db, attempt_id, user_id).mappings().first()



    if not attempt:

        raise HTTPException(

            status_code=404,

            detail="Tentativa não encontrada."

        )



    if attempt["completed_at"] is not None:

        raise HTTPException(

            status_code=409,

            detail="Esta tentativa já foi concluída."

        )



    return attempt





def identify_profile(db, selected_style_ids):

    if len(selected_style_ids) == 1:

        profile_type = "PREDOMINANTE"

    elif len(selected_style_ids) == 2:

        profile_type = "MISTO_2"

    elif len(selected_style_ids) == 3:

        profile_type = "MISTO_3"

    else:

        profile_type = "EQUILIBRADO"



    rows = quiz_repository.list_profiles_by_type(db, profile_type).mappings().all()



    profiles = {}



    for row in rows:

        profile_id = row["profile_id"]



        if profile_id not in profiles:

            profiles[profile_id] = {

                "id": profile_id,

                "name": row["name"],

                "profile_type": row["profile_type"],

                "visual_color": row["visual_color"],

                "styles": set()

            }



        profiles[profile_id]["styles"].add(row["style_id"])



    for profile in profiles.values():

        if profile["styles"] == set(selected_style_ids):

            return {

                "id": profile["id"],

                "name": profile["name"],

                "profile_type": profile["profile_type"]

            }
# Não atribuir um perfil incorreto se não existir# uma combinação correspondente na base de dados.
    return None
# =====================================# LISTAR CATEGORIAS# =====================================
@router.get("/categories")

def get_categories(

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    result = quiz_repository.list_categories(db)


    return {

        "total": len(result),

        "categories": [dict(row) for row in result]

    }
# =====================================# LISTAR PERGUNTAS E OPÇÕES# =====================================
@router.get("/questions")

def get_questions(

    category_id: int | None = Query(default=None, ge=1),

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    if category_id is not None:

        category = quiz_repository.find_category(db, category_id)


        if not category:

            raise HTTPException(

                status_code=404,

                detail="Categoria não encontrada."

            )



    result = quiz_repository.list_question_options(
        db, category_id, TOTAL_QUESTIONS
    )


    questions = {}



    for row in result:

        question_id = row["question_id"]



        if question_id not in questions:

            questions[question_id] = {

                "id": question_id,

                "category_id": row["category_id"],

                "question_text": row["question_text"],

                "question_order": row["question_order"],

                "options": []

            }



        if row["option_id"] is not None:

            questions[question_id]["options"].append({

                "id": row["option_id"],

                "option_text": row["option_text"]

            })



    return {

        "total": len(questions),

        "questions": list(questions.values())

    }
# =====================================# INICIAR TENTATIVA# =====================================
@router.post("/start", status_code=201)

def start_quiz(

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    total = quiz_repository.count_questions(db).scalar()



    if total != TOTAL_QUESTIONS:

        raise HTTPException(

            status_code=500,

            detail=f"O quiz deve ter exatamente {TOTAL_QUESTIONS} perguntas."

        )



    now = datetime.now(timezone.utc).replace(tzinfo=None)



    try:

        result = quiz_repository.create_attempt(db, current_user["id"], now)



        attempt_id = result.lastrowid

        db.commit()



        return {

            "message": "Quiz iniciado com sucesso.",

            "attempt_id": attempt_id,

            "total_questions": TOTAL_QUESTIONS,

            "started_at": now

        }



    except Exception:

        db.rollback()

        raise
# =====================================# GUARDAR / ATUALIZAR RESPOSTA# =====================================
@router.post("/answer")

def save_answer(

    answer: AnswerRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    get_attempt(

        db,

        answer.attempt_id,

        current_user["id"]

    )



    option = quiz_repository.find_option_for_question(db, answer.option_id, answer.question_id).first()



    if not option:

        raise HTTPException(

            status_code=400,

            detail="A opção não pertence à pergunta indicada."

        )



    existing = quiz_repository.find_existing_answer(db, answer.attempt_id, answer.question_id).first()



    try:

        if existing:

            quiz_repository.update_answer(db, answer.option_id, existing.id)

            message = "Resposta atualizada com sucesso."

        else:

            quiz_repository.create_answer(db, answer.attempt_id, answer.question_id, answer.option_id)

            message = "Resposta guardada com sucesso."



        db.commit()



        return {

            "message": message,

            "attempt_id": answer.attempt_id,

            "question_id": answer.question_id

        }



    except Exception:

        db.rollback()

        raise
# =====================================# FINALIZAR QUIZ E CALCULAR RESULTADO# =====================================
@router.post("/finish/{attempt_id}")

def finish_quiz(

    attempt_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    get_attempt(db, attempt_id, current_user["id"])



    answers = quiz_repository.list_attempt_answers(db, attempt_id).mappings().all()



    answered_questions = {row["question_id"] for row in answers}



    if len(answers) != TOTAL_QUESTIONS or len(answered_questions) != TOTAL_QUESTIONS:

        raise HTTPException(

            status_code=400,

            detail={

                "message": "Ainda não respondeste a todas as perguntas.",

                "answered": len(answered_questions),

                "required": TOTAL_QUESTIONS

            }

        )



    points = {

        style_id: 0

        for style_id in STYLES

    }



    for row in answers:

        style_id = row["style_id"]



        if style_id not in points:

            raise HTTPException(

                status_code=500,

                detail="Foi encontrada uma opção com estilo inválido."

            )



        points[style_id] += 1



    total_points = sum(points.values())



    if total_points == 0:

        raise HTTPException(

            status_code=500,

            detail="Não foi possível calcular as pontuações."

        )



    percentages = {

        style_id: round(

            (score / total_points) * 100, 2

        )

        for style_id, score in points.items()

    }



    # Selecionar todos os estilos cuja pontuação esteja a, no máximo,
    # 2 pontos da pontuação mais elevada.
    max_points = max(points.values())

    selected_styles = [
        style_id
        for style_id, score in points.items()
        if max_points - score <= TOLERANCE_POINTS
    ]

    profile = identify_profile(db, selected_styles)

    if profile is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "A combinação de estilos não está configurada "
                "na tabela profile_styles."
            )
        )

    now = datetime.now(timezone.utc).replace(tzinfo=None)



    try:
# Guardar as pontuações e o perfil.
        quiz_repository.create_result(db, attempt_id, points[1], points[2], points[3], points[4], percentages[1], percentages[2], percentages[3], percentages[4], profile["id"])



        quiz_repository.complete_attempt(db, now, attempt_id)



        db.commit()



    except Exception:

        db.rollback()

        raise
# Obter conteúdos do perfil, quando existirem.
    content = []



    if profile:

        content_rows = quiz_repository.list_profile_content(db, profile["id"]).mappings().all()



        content = [dict(row) for row in content_rows]



    return {

        "message": "Quiz concluído com sucesso.",

        "attempt_id": attempt_id,

        "total_questions": TOTAL_QUESTIONS,

        "points": {

            STYLES[style_id]: points[style_id]

            for style_id in STYLES

        },

        "percentages": {

            STYLES[style_id]: percentages[style_id]

            for style_id in STYLES

        },

        "tolerance_points": TOLERANCE_POINTS,

        "identified_styles": [

            STYLES[style_id]

            for style_id in selected_styles

        ],

        "tendency": (
            "PREDOMINANTE"
            if len(selected_styles) == 1
            else "EQUILIBRADO"
            if len(selected_styles) == 4
            else "MISTA"
        ),

        "profile": profile,

        "profile_content": content,

        "completed_at": now,

        "notice": (

            "Este resultado representa tendências de comunicação "

            "com base nas respostas e não constitui uma avaliação "

            "psicológica validada."

        )

    }
# =====================================# HISTÓRICO DE RESULTADOS# =====================================
@router.get("/history")

def quiz_history(

    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)

):

    results = quiz_repository.list_user_history(db, current_user["id"]).mappings().all()



    return {

        "total": len(results),

        "history": [dict(row) for row in results]

    }
