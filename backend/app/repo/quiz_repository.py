"""Consultas SQL do quiz (leitura e escrita)."""

from sqlalchemy import text
from sqlalchemy.orm import Session


def list_categories(db: Session):
    return db.execute(
        text("""
            SELECT id, name
            FROM quiz_categories
            ORDER BY id
        """)
    ).mappings().all()


def find_category(db: Session, category_id: int):
    return db.execute(
        text("""
            SELECT id
            FROM quiz_categories
            WHERE id = :category_id
        """),
        {"category_id": category_id}
    ).first()


def list_question_options(
    db: Session, category_id: int | None, total_questions: int
):
    return db.execute(
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
            "total_questions": total_questions,
        }
    ).mappings().all()


def find_attempt(db: Session, attempt_id, user_id):
    return db.execute(
        text("""
            SELECT id, user_id, completed_at
            FROM quiz_attempts
            WHERE id = :attempt_id
            AND user_id = :user_id
        """),
        {"attempt_id": attempt_id, "user_id": user_id}
    )


def list_profiles_by_type(db: Session, profile_type):
    return db.execute(
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
    )


def count_questions(db: Session):
    return db.execute(text("SELECT COUNT(*) FROM quiz_questions"))


def create_attempt(db: Session, user_id, started_at):
    return db.execute(
        text("""
            INSERT INTO quiz_attempts (user_id, started_at)
            VALUES (:user_id, :started_at)
        """),
        {"user_id": user_id, "started_at": started_at}
    )


def find_option_for_question(db: Session, option_id, question_id):
    return db.execute(
        text("""
            SELECT id
            FROM quiz_options
            WHERE id = :option_id
            AND question_id = :question_id
        """),
        {"option_id": option_id, "question_id": question_id}
    )


def find_existing_answer(db: Session, attempt_id, question_id):
    return db.execute(
        text("""
            SELECT id
            FROM user_answers
            WHERE attempt_id = :attempt_id
            AND question_id = :question_id
        """),
        {"attempt_id": attempt_id, "question_id": question_id}
    )


def update_answer(db: Session, option_id, answer_id):
    return db.execute(
        text("""
            UPDATE user_answers
            SET option_id = :option_id
            WHERE id = :answer_id
        """),
        {"option_id": option_id, "answer_id": answer_id}
    )


def create_answer(db: Session, attempt_id, question_id, option_id):
    return db.execute(
        text("""
            INSERT INTO user_answers
            (attempt_id, question_id, option_id)
            VALUES
            (:attempt_id, :question_id, :option_id)
        """),
        {"attempt_id": attempt_id, "question_id": question_id, "option_id": option_id}
    )


def list_attempt_answers(db: Session, attempt_id):
    return db.execute(
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
    )


def create_result(db: Session, attempt_id, red_score, yellow_score, green_score, blue_score, red_percent, yellow_percent, green_percent, blue_percent, profile_id):
    return db.execute(
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
        {"attempt_id": attempt_id, "red_score": red_score, "yellow_score": yellow_score, "green_score": green_score, "blue_score": blue_score, "red_percent": red_percent, "yellow_percent": yellow_percent, "green_percent": green_percent, "blue_percent": blue_percent, "profile_id": profile_id}
    )


def complete_attempt(db: Session, completed_at, attempt_id):
    return db.execute(
        text("""
            UPDATE quiz_attempts
            SET completed_at = :completed_at
            WHERE id = :attempt_id
        """),
        {"completed_at": completed_at, "attempt_id": attempt_id}
    )


def list_profile_content(db: Session, profile_id):
    return db.execute(
        text("""
            SELECT section_name, content
            FROM profile_content
            WHERE profile_id = :profile_id
            ORDER BY id
        """),
        {"profile_id": profile_id}
    )


def list_user_history(db: Session, user_id):
    return db.execute(
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
        {"user_id": user_id}
    )
