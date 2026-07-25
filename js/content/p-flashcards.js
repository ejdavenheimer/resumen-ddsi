/* ============================================================
   Práctica — Flashcards
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-flashcards",
    title: "Flashcards",
    tag: "🃏",
    group: "Práctica interactiva",
    resumen: "103 tarjetas con repaso espaciado",
    keywords: ["flashcards", "tarjetas", "repaso", "leitner", "memorizar"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Flashcards</h1>
          <p class="lead">${APP.DATA.flashcards.length} tarjetas con sistema Leitner simplificado: lo que no sabés aparece más seguido.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Cómo usarlas bien</div>
          <p><b>Intentá recordar antes de dar vuelta la tarjeta.</b> El esfuerzo de recuperación es lo que fija el
          recuerdo; leer la respuesta directamente casi no sirve. Aunque no te salga completa, formulá la respuesta
          mentalmente y recién ahí volteá.</p>
          <p>Y sé honesto al marcar: si dudaste, marcá <b>“no la sabía”</b>. El mazo se rearma priorizando esas y son
          justo las que te van a faltar en el parcial.</p>
        </div>

        <div class="widget" id="fcBox"></div>

        <div class="callout tip">
          <div class="callout-title">✅ Después de las flashcards</div>
          <p>Las flashcards fijan <b>definiciones</b>. Lo que el parcial evalúa es <b>reconocer</b> el patrón en un
          enunciado y <b>justificarlo</b>. Cuando tengas la mayoría en “sabidas”, pasá al
          <a class="inline" data-go="p-detector">Detector de patrones</a>.</p>
        </div>
      `;
      APP.flashcards(el.querySelector("#fcBox"), APP.DATA.flashcards);
    },
  });
})();
