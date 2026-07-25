/* ============================================================
   Práctica — Pseudocódigo breve
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-pseudocodigo",
    title: "Pseudocódigo breve",
    tag: "✍️",
    group: "Práctica interactiva",
    resumen: "10 requerimientos para resolver en pseudocódigo",
    keywords: ["pseudocodigo", "codigo", "escribir", "requerimiento", "parcial escrito"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Pseudocódigo breve</h1>
          <p class="lead">${APP.DATA.pseudocodigos.length} requerimientos como los del parcial: mostralos en pseudocódigo y autocorregite.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">✍️ Cómo escribir pseudocódigo en un parcial</div>
          <ul>
            <li>No hace falta que compile. No pierdas tiempo en imports, getters ni <code>public static void</code>.</li>
            <li>Sí tiene que quedar claro: <b>qué clases participan, qué métodos se llaman y en qué orden</b>.</li>
            <li>Usá nombres descriptivos.</li>
            <li>Mostrá el <b>polimorfismo</b> si el patrón lo requiere.</li>
            <li><b>10-15 líneas alcanzan.</b> Si escribís 50, perdiste tiempo.</li>
          </ul>
        </div>

        <div class="aviso-escrito">
          <div class="emo">💡</div>
          <div><p>Escribí primero tu solución, y después mirá la modelo y tildá el checklist. No es autoengaño: reconocer
          qué te faltó es exactamente lo que te hace mejorar para el examen.</p></div>
        </div>

        <div id="psBox"></div>
      `;
      APP.pseudocodigo(el.querySelector("#psBox"), APP.DATA.pseudocodigos, "pseudo");
    },
  });
})();
