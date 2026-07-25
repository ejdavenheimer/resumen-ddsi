/* ============================================================
   Práctica — Escribí la justificación
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-justificacion",
    title: "Escribí la justificación",
    tag: "✍️",
    group: "Práctica interactiva",
    resumen: "15 casos, corrección por los 4 elementos",
    keywords: ["justificacion", "escribir", "justificar", "parcial escrito", "defensa"],
    render(el) {
      const casos = APP.DATA.justificaciones;
      const hechos = APP.store.ejerciciosDe("just");
      const logrados = Object.keys(hechos).filter(function (k) { return hechos[k]; }).length;

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Escribí la justificación</h1>
          <p class="lead">${casos.length} casos para practicar lo que más puntos da (y más se olvida): justificar por escrito.</p>
        </div>

        <div class="aviso-escrito">
          <div class="emo">✍️</div>
          <div><p><b>El parcial es escrito.</b> Elegir bien el patrón es la mitad; la otra mitad es <b>justificarlo</b>.
          Acá escribís la justificación y el corrector automático chequea que tenga los <b>4 elementos</b> que busca la cátedra.</p></div>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Los 4 elementos de una buena justificación</div>
          <div class="just-req">
            <span class="pill indigo">1 · Nombra el patrón/decisión</span>
            <span class="pill blue">2 · Cita el enunciado</span>
            <span class="pill green">3 · Menciona un principio SOLID</span>
            <span class="pill amber">4 · Menciona una cualidad (acoplamiento/cohesión)</span>
          </div>
          <p>La corrección es por <b>palabras clave</b>: es una guía, no un juez perfecto. Si escribiste algo válido con
          otras palabras, fijate igual contra la justificación modelo.</p>
        </div>

        <div class="big-progress">
          <div class="bp-head"><b>Tu progreso</b><span>${logrados} de ${casos.length} logrados</span></div>
          <div class="bp-bar"><i style="width:${Math.round((logrados / casos.length) * 100)}%"></i></div>
        </div>

        <div id="justBox"></div>
      `;
      APP.escribirJustificacion(el.querySelector("#justBox"), casos, "just");
    },
  });
})();
