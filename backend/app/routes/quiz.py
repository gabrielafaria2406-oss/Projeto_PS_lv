

from datetime import datetime, timezone



from fastapi import APIRouter, Depends, HTTPException, Query

from pydantic import BaseModel, Field

from sqlalchemy import text

from sqlalchemy.orm import Session



from ..database import get_db

from ..security import get_current_user





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

    attempt = db.execute(

        text("""

            SELECT id, user_id, completed_at

            FROM quiz_attempts

            WHERE id = :attempt_id

              AND user_id = :user_id

        """),

        {

            "attempt_id": attempt_id,

            "user_id": user_id

        }

    ).mappings().first()



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



    rows = db.execute(

        text("""

            SELECT

                p.id AS profile_id,

                p.name,

                p.profile_type,

                p.visual_color,

                ps.style_id

            FROM communication_profiles p

            JOIN profile_styles ps

                ON ps.profile_id = p.id

            WHERE p.profile_type = :profile_type

            ORDER BY p.id, ps.style_id

        """),

        {"profile_type": profile_type}

    ).mappings().all()



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

    result = db.execute(

        text("""

            SELECT id, name

            FROM quiz_categories

            ORDER BY id

        """)

    ).mappings().all()



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

        category = db.execute(

            text("""

                SELECT id

                FROM quiz_categories

                WHERE id = :category_id

            """),

            {"category_id": category_id}

        ).first()



        if not category:

            raise HTTPException(

                status_code=404,

                detail="Categoria não encontrada."

            )



    result = db.execute(

        text("""

            SELECT

                q.id AS question_id,

                q.category_id,

                q.question_text,

                q.question_order,

                o.id AS option_id,

                o.option_text

            FROM (

                SELECT id, category_id, question_text, question_order

                FROM quiz_questions

                WHERE (

                    :category_id IS NULL

                    OR category_id = :category_id

                )

                ORDER BY category_id, question_order

                LIMIT :total_questions

            ) AS q

            LEFT JOIN quiz_options o

                ON o.question_id = q.id

            ORDER BY q.category_id, q.question_order, o.id

        """),

        {

            "category_id": category_id,

            "total_questions": TOTAL_QUESTIONS

        }

    ).mappings().all()



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

    total = db.execute(

        text("SELECT COUNT(*) FROM quiz_questions")

    ).scalar()



    if total != TOTAL_QUESTIONS:

        raise HTTPException(

            status_code=500,

            detail=f"O quiz deve ter exatamente {TOTAL_QUESTIONS} perguntas."

        )



    now = datetime.now(timezone.utc).replace(tzinfo=None)



    try:

        result = db.execute(

            text("""

                INSERT INTO quiz_attempts (user_id, started_at)

                VALUES (:user_id, :started_at)

            """),

            {

                "user_id": current_user["id"],

                "started_at": now

            }

        )



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



    option = db.execute(

        text("""

            SELECT id

            FROM quiz_options

            WHERE id = :option_id

              AND question_id = :question_id

        """),

        {

            "option_id": answer.option_id,

            "question_id": answer.question_id

        }

    ).first()



    if not option:

        raise HTTPException(

            status_code=400,

            detail="A opção não pertence à pergunta indicada."

        )



    existing = db.execute(

        text("""

            SELECT id

            FROM user_answers

            WHERE attempt_id = :attempt_id

              AND question_id = :question_id

        """),

        {

            "attempt_id": answer.attempt_id,

            "question_id": answer.question_id

        }

    ).first()



    try:

        if existing:

            db.execute(

                text("""

                    UPDATE user_answers

                    SET option_id = :option_id

                    WHERE id = :answer_id

                """),

                {

                    "option_id": answer.option_id,

                    "answer_id": existing.id

                }

            )

            message = "Resposta atualizada com sucesso."

        else:

            db.execute(

                text("""

                    INSERT INTO user_answers

                        (attempt_id, question_id, option_id)

                    VALUES

                        (:attempt_id, :question_id, :option_id)

                """),

                {

                    "attempt_id": answer.attempt_id,

                    "question_id": answer.question_id,

                    "option_id": answer.option_id

                }

            )

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



    answers = db.execute(

        text("""

            SELECT

                ua.question_id,

                ua.option_id,

                qo.style_id

            FROM user_answers ua

            JOIN quiz_options qo

                ON qo.id = ua.option_id

               AND qo.question_id = ua.question_id

            WHERE ua.attempt_id = :attempt_id

        """),

        {"attempt_id": attempt_id}

    ).mappings().all()



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
        db.execute(

            text("""

                INSERT INTO quiz_results (

                    attempt_id,

                    red_score,

                    yellow_score,

                    green_score,

                    blue_score,

                    red_percent,

                    yellow_percent,

                    green_percent,

                    blue_percent,

                    profile_id

                )

                VALUES (

                    :attempt_id,

                    :red_score,

                    :yellow_score,

                    :green_score,

                    :blue_score,

                    :red_percent,

                    :yellow_percent,

                    :green_percent,

                    :blue_percent,

                    :profile_id

                )

            """),

            {

                "attempt_id": attempt_id,

                "red_score": points[1],

                "yellow_score": points[2],

                "green_score": points[3],

                "blue_score": points[4],

                "red_percent": percentages[1],

                "yellow_percent": percentages[2],

                "green_percent": percentages[3],

                "blue_percent": percentages[4],

                "profile_id": profile["id"]

            }

        )



        db.execute(

            text("""

                UPDATE quiz_attempts

                SET completed_at = :completed_at

                WHERE id = :attempt_id

            """),

            {

                "completed_at": now,

                "attempt_id": attempt_id

            }

        )



        db.commit()



    except Exception:

        db.rollback()

        raise
# Obter conteúdos do perfil, quando existirem.
    content = []



    if profile:

        content_rows = db.execute(

            text("""

                SELECT section_name, content

                FROM profile_content

                WHERE profile_id = :profile_id

                ORDER BY id

            """),

            {"profile_id": profile["id"]}

        ).mappings().all()



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

    results = db.execute(

        text("""

            SELECT

                a.id AS attempt_id,

                a.started_at,

                a.completed_at,

                r.red_score,

                r.yellow_score,

                r.green_score,

                r.blue_score,

                r.red_percent,

                r.yellow_percent,

                r.green_percent,

                r.blue_percent,

                p.id AS profile_id,

                p.name AS profile_name,

                p.profile_type

            FROM quiz_attempts a

            LEFT JOIN quiz_results r

                ON r.attempt_id = a.id

            LEFT JOIN communication_profiles p

                ON p.id = r.profile_id

            WHERE a.user_id = :user_id

              AND a.completed_at IS NOT NULL

            ORDER BY a.completed_at DESC

        """),

        {"user_id": current_user["id"]}

    ).mappings().all()



    return {

        "total": len(results),

        "history": [dict(row) for row in results]

    }
