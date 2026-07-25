/* =====================================================================
   Interactivos de práctica ESCRITA (el parcial no se codea).

   APP.escribirJustificacion(container, casos, set)
     Escribís la justificación; se evalúa por palabras clave en categorías.

   APP.vfJustificado(container, casos, set)
     Elegís V/F, escribís la justificación, comparás con la modelo.

   APP.pseudocodigo(container, casos, set)
     Escribís pseudocódigo; comparás con la modelo y autocorregís por checklist.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  function normalizar(s) {
    return (s || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "");   // saca tildes
  }

  /* ---------------- Escribí la justificación ---------------- */
  APP.escribirJustificacion = function (container, casos, set) {
    set = set || "just";
    let i = 0;
    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const hecho = APP.store.ejercicio(set, c.id);
      root.innerHTML =
        '<div class="det-bar"><span class="det-count">Caso ' + (i + 1) + " de " + casos.length + "</span>" +
          (c.tema ? '<span class="pill gray">' + c.tema + "</span>" : "") +
          (hecho !== undefined ? '<span class="pill ' + (hecho ? "green" : "amber") + '">' + (hecho ? "✔️ logrado" : "↻ reintentar") + "</span>" : "") +
        "</div>" +
        '<div class="det-enunciado">' + c.enunciado + "</div>" +
        '<p style="margin-top:.8rem"><b>Decisión de diseño:</b> ' + c.decision + "</p>" +
        '<p style="font-weight:600">Escribí tu justificación (3-5 líneas):</p>' +
        '<textarea class="esc-area" id="ejArea" placeholder="Apliqué el patrón X porque el enunciado dice..."></textarea>' +
        '<div class="controls"><button class="btn" id="ejCheck" type="button">Corregir</button>' +
          '<span style="margin-left:auto"></span>' +
          '<button class="btn sm neutral" id="ejPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">←</button>" +
          '<button class="btn sm neutral" id="ejNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">→</button></div>" +
        '<div id="ejFb"></div>';

      root.querySelector("#ejCheck").addEventListener("click", corregir);
      root.querySelector("#ejPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#ejNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }

    function corregir() {
      const c = casos[i];
      const txt = normalizar(root.querySelector("#ejArea").value);
      let puntos = 0;
      const detalle = c.criterios.map(function (cr) {
        const hit = cr.keywords.some(function (k) { return txt.indexOf(normalizar(k)) !== -1; });
        if (hit) puntos += cr.peso;
        return { cr: cr, hit: hit };
      });
      const logrado = puntos >= 75;
      APP.store.marcarEjercicio(set, c.id, logrado);

      root.querySelector("#ejFb").innerHTML =
        '<div class="det-fb ' + (logrado ? "ok" : "no") + '">' +
        "<h4>" + puntos + " / 100 — " + (logrado ? "✅ Buena justificación" : "Te faltan elementos") + "</h4>" +
        '<p style="margin:.3rem 0">Una justificación completa tiene los <b>4 elementos</b> que busca el corrector:</p>' +
        '<ul class="esc-crit">' +
        detalle.map(function (d) {
          return '<li class="' + (d.hit ? "hit" : "miss") + '">' + (d.hit ? "✅ " : "❌ ") +
            "<b>" + d.cr.categoria + "</b> " + (d.hit ? "" : "— faltó") + "</li>";
        }).join("") +
        "</ul>" +
        '<p style="margin-top:.6rem"><b>📝 Justificación modelo:</b></p>' +
        '<blockquote class="just-modelo">' + c.modelo + "</blockquote>" +
        "</div>";
    }
    render();
  };

  /* ---------------- Verdadero o Falso con justificación ---------------- */
  APP.vfJustificado = function (container, casos, set) {
    set = set || "vf";
    let i = 0;
    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const hecho = APP.store.ejercicio(set, c.id);
      root.innerHTML =
        '<div class="det-bar"><span class="det-count">Afirmación ' + (i + 1) + " de " + casos.length + "</span>" +
          (c.tema ? '<span class="pill gray">' + c.tema + "</span>" : "") +
          (hecho !== undefined ? '<span class="pill ' + (hecho ? "green" : "amber") + '">' + (hecho ? "✔️" : "↻") + "</span>" : "") +
        "</div>" +
        '<div class="det-enunciado">' + c.afirmacion + "</div>" +
        '<div class="esc-vf">' +
          '<button class="det-opt" type="button" data-v="V">Verdadero</button>' +
          '<button class="det-opt" type="button" data-v="F">Falso</button>' +
        "</div>" +
        '<p style="font-weight:600">Justificá tu respuesta:</p>' +
        '<textarea class="esc-area" id="vfArea" placeholder="Es [V/F] porque..."></textarea>' +
        '<div class="controls"><button class="btn" id="vfCheck" type="button">Ver respuesta modelo</button>' +
          '<span style="margin-left:auto"></span>' +
          '<button class="btn sm neutral" id="vfPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">←</button>" +
          '<button class="btn sm neutral" id="vfNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">→</button></div>" +
        '<div id="vfFb"></div>';

      let elegida = null;
      root.querySelectorAll(".esc-vf .det-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          elegida = b.dataset.v;
          root.querySelectorAll(".esc-vf .det-opt").forEach(function (x) { x.style.borderColor = ""; x.style.background = ""; });
          b.style.borderColor = "var(--brand)"; b.style.background = "var(--brand-soft)";
        });
      });
      root.querySelector("#vfCheck").addEventListener("click", function () { corregir(elegida); });
      root.querySelector("#vfPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#vfNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }

    function corregir(elegida) {
      const c = casos[i];
      const acierto = elegida === c.respuesta;
      if (elegida) APP.store.marcarEjercicio(set, c.id, acierto);
      root.querySelector("#vfFb").innerHTML =
        '<div class="det-fb ' + (elegida ? (acierto ? "ok" : "no") : "ok") + '">' +
        "<h4>Respuesta: <b>" + (c.respuesta === "V" ? "VERDADERO" : "FALSO") + "</b>" +
        (elegida ? (acierto ? " · ✅ acertaste" : " · ❌ elegiste " + (elegida === "V" ? "Verdadero" : "Falso")) : "") + "</h4>" +
        '<p><b>Justificación modelo:</b> ' + c.modelo + "</p>" +
        '<p style="font-size:.85rem;color:inherit;opacity:.85;margin-top:.5rem">Compará con lo que escribiste: ¿mencionaste lo mismo? En el parcial, la justificación vale tanto como el V/F.</p>' +
        "</div>";
    }
    render();
  };

  /* ---------------- Pseudocódigo breve ---------------- */
  APP.pseudocodigo = function (container, casos, set) {
    set = set || "pseudo";
    let i = 0;
    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      root.innerHTML =
        '<div class="det-bar"><span class="det-count">Requerimiento ' + (i + 1) + " de " + casos.length + "</span>" +
          (c.tema ? '<span class="pill gray">' + c.tema + "</span>" : "") +
        "</div>" +
        '<div class="det-enunciado">' + c.requerimiento + "</div>" +
        '<p style="font-weight:600">Escribí tu pseudocódigo (5-15 líneas):</p>' +
        '<textarea class="esc-area mono" id="psArea" placeholder="class ... {\\n    metodo(...) {\\n        ...\\n    }\\n}"></textarea>' +
        '<div class="controls"><button class="btn" id="psCheck" type="button">Ver solución modelo</button>' +
          '<span style="margin-left:auto"></span>' +
          '<button class="btn sm neutral" id="psPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">←</button>" +
          '<button class="btn sm neutral" id="psNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">→</button></div>" +
        '<div id="psFb"></div>';

      root.querySelector("#psCheck").addEventListener("click", corregir);
      root.querySelector("#psPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#psNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }

    function corregir() {
      const c = casos[i];
      const fb = root.querySelector("#psFb");
      fb.innerHTML =
        '<div class="det-fb ok"><h4>Solución modelo</h4>' +
        APP.code(c.modelo, { lang: "text", label: "Pseudocódigo modelo", collapse: false }) +
        '<p style="font-weight:600;margin-top:.6rem">Autocorregite: ¿tu pseudocódigo tiene estos elementos?</p>' +
        '<div id="psChk"></div></div>';
      APP.rubrica(fb.querySelector("#psChk"), set + "-" + c.id, c.checklist.map(function (t) {
        return { t: t, p: Math.round(100 / c.checklist.length) };
      }));
    }
    render();
  };
})();
