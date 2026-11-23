
import { useEffect, useRef, useState } from "react";
import { communicationStyles } from "../data/communicationStyles";
import "../styles/ColorWheelSide.css";

/*
  Ângulos necessários para colocar
  a cor selecionada virada para a direita.
*/
const ROTATIONS = {
  red: 135,
  green: 45,
  yellow: -45,
  blue: -135
};

function ColorWheelSide({ onStartQuiz }) {
  const [activeStyle, setActiveStyle] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const lastButton = useRef(null);

  function selectColor(style, event) {
    lastButton.current = event.currentTarget;

    // Clicar na mesma cor fecha a descrição.
    if (isOpen && activeStyle?.id === style.id) {
      closeDetails();
      return;
    }

    // Escolhe o caminho de rotação mais curto.
    const target = ROTATIONS[style.id];
    const difference =
      ((target - rotation + 540) % 360) - 180;

    setRotation(rotation + difference);
    setActiveStyle(style);
    setIsOpen(true);
  }

  function closeDetails() {
    setIsOpen(false);

    // Regressar suavemente à posição inicial.
    const difference =
      ((0 - rotation + 540) % 360) - 180;

    setRotation(rotation + difference);

    lastButton.current?.focus({
      preventScroll: true
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeDetails();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, rotation]);

  return (
    <div
      className={`sw-stage ${
        isOpen ? "sw-stage--open" : ""
      }`}
    >

      {/* RODA E BOTÃO DE TESTE */}
      <div className="sw-visual">

        <div
          className="sw-wheel"
          style={{
            "--rotation": `${rotation}deg`,
            "--counter-rotation": `${-rotation}deg`
          }}
        >

          {communicationStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`
                sw-wheel__segment
                sw-wheel__segment--${style.id}
                ${
                  isOpen && activeStyle?.id === style.id
                    ? "sw-wheel__segment--active"
                    : ""
                }
              `}
              onClick={(event) => selectColor(style, event)}
              aria-label={`Conhecer o estilo ${style.name}`}
              aria-pressed={
                isOpen && activeStyle?.id === style.id
              }
              title={style.name}
            />
          ))}

          <div className="sw-wheel__center">
            <strong>CHROMA</strong>
          </div>

        </div>

        <button
          type="button"
          className="sw-start-button"
          onClick={onStartQuiz}
          disabled={!onStartQuiz}
        >
          Começar teste
          <span aria-hidden="true"> ↗</span>
        </button>

      </div>

      {/* DESCRIÇÃO DA COR */}
      <aside
        className={`sw-info ${
          activeStyle
            ? `sw-info--${activeStyle.id}`
            : ""
        }`}
        aria-hidden={!isOpen}
      >

        {activeStyle && (
          <>
            <button
              type="button"
              className="sw-info__close"
              onClick={closeDetails}
              tabIndex={isOpen ? 0 : -1}
              aria-label="Fechar descrição"
            >
              ×
            </button>

            <div className="sw-info__header">
              <span className="sw-info__dot" />
              <span className="sw-info__eyebrow">
                {activeStyle.name}
              </span>
            </div>

            <h2>{activeStyle.title}</h2>

            <p>{activeStyle.description}</p>

            <div className="sw-info__line" />
          </>
        )}

      </aside>

    </div>
  );
}

export default ColorWheelSide;
