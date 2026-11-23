
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { communicationStyles } from "../data/communicationStyles";
import "../styles/ColorWheel.css";

// Desenha a roda e as quatro áreas clicáveis
function WheelFace({
  selectedStyle,
  expanded = false,
  onSelect,
  onClose,
  closeRef
}) {
  return (
    <div className={`cw-face ${expanded ? "cw-face--expanded" : ""}`}>

      {communicationStyles.map((style) => (
        <button
          key={style.id}
          type="button"
          className={`cw-slice cw-slice--${style.id} ${
            expanded && selectedStyle?.id === style.id
              ? "cw-slice--selected"
              : ""
          }`}
          aria-label={`Descobrir o estilo ${style.name}`}
          aria-pressed={
            expanded ? selectedStyle?.id === style.id : false
          }
          onClick={(event) => onSelect(style, event)}
        />
      ))}

      <div className="cw-center">

        <strong
          className={`cw-wordmark ${
            expanded ? "cw-wordmark--hidden" : ""
          }`}
        >
          CHROMA
        </strong>

        {selectedStyle && (
          <div
            className={`cw-details ${
              expanded ? "cw-details--visible" : ""
            }`}
          >
            <div className="cw-details__inner" key={selectedStyle.id}>

              <button
                ref={closeRef}
                className="cw-close"
                type="button"
                onClick={onClose}
                aria-label="Fechar descrição e voltar à roda"
              >
                ×
              </button>

              <span
                className={`cw-details__label cw-details__label--${selectedStyle.id}`}
              >
                {selectedStyle.name}
              </span>

              <h2>{selectedStyle.title}</h2>
              <p>{selectedStyle.description}</p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ColorWheel() {
  const originalWheelRef = useRef(null);
  const lastClickedRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [zoom, setZoom] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const zoomMounted = zoom !== null;

  // Mede a roda para começar o zoom no sítio certo
  function openZoom(style, event) {
    const rect = originalWheelRef.current?.getBoundingClientRect();

    if (!rect) return;

    lastClickedRef.current = event.currentTarget;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // O círculo aberto ultrapassa a altura do ecrã
    const finalSize =
      viewportWidth <= 700
        ? Math.min(viewportWidth * 1.42, viewportHeight * 1.05)
        : Math.min(
            viewportHeight * 1.56,
            viewportWidth * 1.18,
            1600
          );

    setExpanded(false);

    setZoom({
      style,
      size: finalSize,
      startScale: rect.width / finalSize,
      shiftX:
        rect.left + rect.width / 2 - viewportWidth / 2,
      shiftY:
        rect.top + rect.height / 2 - viewportHeight / 2
    });
  }

  // Fecha o zoom e regressa ao tamanho original
  function closeZoom() {
    if (!zoomMounted) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setExpanded(false);
      setZoom(null);

      requestAnimationFrame(() => {
        lastClickedRef.current?.focus();
      });

      return;
    }

    setExpanded(false);
  }

  // Preparar animação e impedir scroll durante o zoom
  useEffect(() => {
    if (!zoomMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let secondFrame = 0;

    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setExpanded(true);
      });
    });

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeZoom();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomMounted]);

  useEffect(() => {
    if (expanded) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [expanded]);

  // Só remove a camada depois de a animação terminar
  function completeClose(event) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform" || expanded) return;

    setZoom(null);

    requestAnimationFrame(() => {
      lastClickedRef.current?.focus();
    });
  }

  function changeSelectedStyle(style) {
    setZoom((current) =>
      current ? { ...current, style } : current
    );
  }

  return (
    <div className="cw-stage">

      {/* Roda original na página */}
      <div
        ref={originalWheelRef}
        className={`cw-original ${
          zoomMounted ? "cw-original--hidden" : ""
        }`}
      >
        <WheelFace onSelect={openZoom} />
      </div>

      {/* Roda ampliada por cima do ecrã */}
      {zoom &&
        createPortal(
          <div
            className={`cw-overlay ${
              expanded ? "cw-overlay--open" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={`Estilo de comunicação ${zoom.style.name}`}
          >

            <div
              className="cw-overlay__backdrop"
              onClick={closeZoom}
            />

            <div
              className="cw-zoom-wheel"
              onTransitionEnd={completeClose}
              style={{
                "--cw-size": `${zoom.size}px`,
                "--cw-start-scale": zoom.startScale,
                "--cw-shift-x": `${zoom.shiftX}px`,
                "--cw-shift-y": `${zoom.shiftY}px`
              }}
            >

              <div className="cw-camera-rotation">
                <WheelFace
                  selectedStyle={zoom.style}
                  expanded={expanded}
                  onSelect={changeSelectedStyle}
                  onClose={closeZoom}
                  closeRef={closeButtonRef}
                />
              </div>

            </div>
          </div>,
          document.body
        )}

    </div>
  );
}
