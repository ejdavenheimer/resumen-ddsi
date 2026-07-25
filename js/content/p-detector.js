/* ============================================================
   Práctica — Detector de patrones
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-detector",
    title: "Detector de patrones",
    tag: "🎮",
    group: "Práctica interactiva",
    resumen: "43 enunciados reales",
    keywords: ["detector", "practica", "juego", "enunciados", "reconocer patrones"],
    render(el) {
      const casos = APP.DATA.detector;
      const hechos = APP.store.ejerciciosDe("detector");
      const resueltos = Object.keys(hechos).length;
      const aciertos = Object.keys(hechos).filter(function (k) { return hechos[k]; }).length;

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Detector de patrones</h1>
          <p class="lead">${casos.length} enunciados —muchos sacados de finales reales de la cátedra— para entrenar lo único que importa en el parcial: <b>leer y reconocer</b>.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Cómo aprovecharlo</div>
          <p>Leé el enunciado <b>sin ver las palabras clave</b> y decidí. Recién después tocá “Ver palabras clave” para
          comparar con lo que vos habías subrayado. El objetivo no es acertar: es <b>entrenar el ojo</b> para las frases
          que disparan cada patrón.</p>
          <p>Y leé siempre los descartes. Saber por qué <i>no</i> es State es tan valioso como saber que es Strategy —
          de hecho, es lo que se escribe en el punto de justificación.</p>
        </div>

        <div class="big-progress">
          <div class="bp-head">
            <b>Tu progreso</b>
            <span>${resueltos} de ${casos.length} respondidos · ${aciertos} aciertos</span>
          </div>
          <div class="bp-bar"><i style="width:${Math.round((resueltos / casos.length) * 100)}%"></i></div>
        </div>

        <div class="controls">
          <button class="btn ghost sm" id="dtMezclar" type="button">🔀 Mezclar el orden</button>
          <button class="btn ghost sm" id="dtCrono" type="button">⏱ Modo cronometrado (10 min)</button>
          <button class="btn neutral sm" id="dtReset" type="button">Reiniciar progreso</button>
        </div>

        <div id="detectorBox"></div>

        <h2>Distribución de los casos</h2>
        <div class="idx-grid" id="dtTemas"></div>
      `;

      APP.detector(el.querySelector("#detectorBox"), casos, { set: "detector" });

      el.querySelector("#dtMezclar").addEventListener("click", function () { APP.detectorMezclar(); });
      el.querySelector("#dtCrono").addEventListener("click", function () {
        if (confirm("Modo cronometrado: 10 minutos, orden aleatorio. ¿Arrancamos?")) APP.detectorCrono(10);
      });
      el.querySelector("#dtReset").addEventListener("click", function () {
        if (!confirm("¿Reiniciar el progreso del detector?")) return;
        const st = APP.store.get();
        delete st.ejercicios.detector;
        APP.store.save();
        APP.go("p-detector");
      });

      /* Índice por tema */
      const porTema = {};
      casos.forEach(function (c, i) {
        (porTema[c.tema] = porTema[c.tema] || []).push(i);
      });
      const cont = el.querySelector("#dtTemas");
      Object.keys(porTema).sort().forEach(function (t) {
        const d = document.createElement("div");
        d.className = "idx-card";
        d.innerHTML = "<b>" + t + "</b><small>" + porTema[t].length + " caso" + (porTema[t].length > 1 ? "s" : "") + "</small>";
        d.addEventListener("click", function () {
          APP.detectorIr(porTema[t][0]);
          el.querySelector("#detectorBox").scrollIntoView({ behavior: "smooth", block: "start" });
        });
        cont.appendChild(d);
      });
    },
  });
})();
