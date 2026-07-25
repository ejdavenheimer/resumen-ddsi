/* =====================================================================
   Comparador de diagramas — APP.comparador(container, casos)
   Dos soluciones al mismo enunciado: elegí cuál está bien y por qué.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  APP.comparador = function (container, casos) {
    let i = 0;

    const root = document.createElement("div");
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const hecho = APP.store.ejercicio("comparador", c.id);

      root.innerHTML =
        '<div class="det-bar">' +
          '<span class="det-count">Comparación ' + (i + 1) + " de " + casos.length + "</span>" +
          (hecho !== undefined ? '<span class="pill ' + (hecho ? "green" : "amber") + '">' + (hecho ? "✔️ acertada" : "↻ para repasar") + "</span>" : "") +
        "</div>" +

        "<h3 style='margin-top:.8rem'>" + c.titulo + "</h3>" +
        '<div class="det-enunciado">' + c.enunciado + "</div>" +
        '<p style="margin-top:1rem;font-weight:600">¿Cuál de las dos soluciones es la correcta?</p>' +

        '<div class="cmp-grid" id="cmpGrid">' +
          ["a", "b"].map(function (k) {
            return '<div class="cmp-op" data-k="' + k + '" role="button" tabindex="0">' +
              '<div class="cmp-lbl">' + c[k].etiqueta + "</div>" +
              APP.uml(c[k].uml) +
            "</div>";
          }).join("") +
        "</div>" +

        '<div id="cmpFb"></div>' +

        '<div class="det-nav">' +
          '<button class="btn sm neutral" id="cmpPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">← Anterior</button>" +
          '<button class="btn sm" id="cmpNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">Siguiente →</button>" +
        "</div>";

      APP.rerenderMermaid(root);

      root.querySelectorAll(".cmp-op").forEach(function (op) {
        const elegir = function () { responder(c, op.dataset.k); };
        op.addEventListener("click", function (e) {
          if (e.target.closest(".uml-copy")) return;   // el botón copiar no cuenta como elección
          elegir();
        });
        op.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(); }
        });
      });
      root.querySelector("#cmpPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#cmpNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }

    function responder(c, elegida) {
      const ok = elegida === c.correcta;
      APP.store.marcarEjercicio("comparador", c.id, ok);

      root.querySelectorAll(".cmp-op").forEach(function (op) {
        op.classList.add("locked");
        op.classList.add(op.dataset.k === c.correcta ? "correct" : "wrong");
        op.setAttribute("tabindex", "-1");
      });

      const mala = c.correcta === "a" ? "b" : "a";
      root.querySelector("#cmpFb").innerHTML =
        '<div class="det-fb ' + (ok ? "ok" : "no") + '">' +
          "<h4>" + (ok ? "✅ Correcto: " : "❌ No. La correcta es ") + "<b>" + c[c.correcta].etiqueta + "</b></h4>" +
          "<p><b>Por qué está bien:</b> " + c.porque + "</p>" +
          "<p><b>Qué problema tiene " + c[mala].etiqueta + ":</b> " + c.problema + "</p>" +
          (c.matiz ? '<p style="margin-top:.5rem">⚖️ ' + c.matiz + "</p>" : "") +
        "</div>";
    }

    render();
  };
})();
