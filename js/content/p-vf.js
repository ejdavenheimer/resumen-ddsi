/* ============================================================
   Práctica — Verdadero o Falso con justificación
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-vf",
    title: "Verdadero o Falso",
    tag: "✍️",
    group: "Práctica interactiva",
    resumen: "26 afirmaciones para justificar",
    keywords: ["verdadero falso", "vf", "teoria", "justificar", "parcial escrito"],
    render(el) {
      const casos = APP.DATA.vf;
      const hechos = APP.store.ejerciciosDe("vf");
      const ok = Object.keys(hechos).filter(function (k) { return hechos[k]; }).length;

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Verdadero o Falso</h1>
          <p class="lead">${casos.length} afirmaciones en el formato exacto de la teoría del parcial. Elegí y <b>justificá</b>.</p>
        </div>

        <div class="aviso-escrito">
          <div class="emo">⚠️</div>
          <div><p><b>Un “Falso” sin justificar vale cero</b>, y un “Verdadero” con la justificación equivocada también.
          Por eso acá escribís tu justificación <b>antes</b> de ver la modelo, y las comparás. Sé honesto: la que corrige
          de verdad sos vos.</p></div>
        </div>

        <div class="big-progress">
          <div class="bp-head"><b>Tu progreso</b><span>${ok} de ${casos.length} con el V/F acertado</span></div>
          <div class="bp-bar"><i style="width:${Math.round((ok / casos.length) * 100)}%"></i></div>
        </div>

        <div id="vfBox"></div>
      `;
      APP.vfJustificado(el.querySelector("#vfBox"), casos, "vf");
    },
  });
})();
