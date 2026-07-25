/* ============================================================
   Práctica — Spot the SOLID smell
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-solid",
    title: "Spot the SOLID smell",
    tag: "🔍",
    group: "Práctica interactiva",
    resumen: "15 casos, 3 por letra",
    keywords: ["solid", "smell", "refactor", "practica", "codigo"],
    render(el) {
      const casos = APP.DATA.solid;
      const hechos = APP.store.ejerciciosDe("solid-smell");
      const resueltos = Object.keys(hechos).length;
      const aciertos = Object.keys(hechos).filter(function (k) { return hechos[k]; }).length;

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Spot the SOLID smell</h1>
          <p class="lead">${casos.length} fragmentos de código Java con una violación cada uno. Identificá el principio, elegí la refactorización.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Por qué las opciones incorrectas importan más</div>
          <p>Las tres refactorizaciones de cada caso están pensadas para que las dos incorrectas sean <b>tentadoras</b>:
          son las salidas que uno toma cuando entendió el síntoma pero no la causa (renombrar la interfaz, poner
          métodos <code>default</code> vacíos, mover el <code>new</code> a otro método). Leé siempre las tres
          explicaciones, no sólo la correcta.</p>
        </div>

        <div class="big-progress">
          <div class="bp-head">
            <b>Tu progreso</b>
            <span>${resueltos} de ${casos.length} respondidos · ${aciertos} completos (principio + refactor)</span>
          </div>
          <div class="bp-bar"><i style="width:${Math.round((resueltos / casos.length) * 100)}%"></i></div>
        </div>

        <div class="controls">
          <button class="btn neutral sm" id="ssReset" type="button">Reiniciar progreso</button>
          <a class="btn ghost sm" data-go="solid" style="text-decoration:none;display:inline-block">📖 Repasar la teoría de SOLID</a>
        </div>

        <div id="solidBox"></div>

        <h2>Los casos, por letra</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Principio</th><th>Caso</th></tr></thead>
          <tbody>
            ${casos.map(function (c, i) {
              return "<tr><td>" + (i + 1) + "</td><td><b>" + c.letra + "</b> · " + c.principio + "</td><td>" + c.titulo + "</td></tr>";
            }).join("")}
          </tbody>
        </table></div>
      `;

      APP.solidSmell(el.querySelector("#solidBox"), casos, { set: "solid-smell" });

      el.querySelector("#ssReset").addEventListener("click", function () {
        if (!confirm("¿Reiniciar el progreso de Spot the smell?")) return;
        const st = APP.store.get();
        delete st.ejercicios["solid-smell"];
        APP.store.save();
        APP.go("p-solid");
      });
    },
  });
})();
