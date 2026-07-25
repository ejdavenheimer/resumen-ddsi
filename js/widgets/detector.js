/* =====================================================================
   Detector de patrones — APP.detector(container, casos, opts)
   opts = { set: "detector", cronometrado: true }

   Un enunciado, N opciones, feedback inmediato con el porqué de la
   correcta y el porqué de cada descartada. Sin castigos: se puede
   reintentar y volver atrás cuando quieras.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  APP.detector = function (container, casos, opts) {
    opts = opts || {};
    const SET = opts.set || "detector";
    const permiteCrono = opts.cronometrado !== false;

    let orden = casos.map(function (_, i) { return i; });
    let i = 0;
    let crono = null;      // {restante, timer}
    let respondidasEnCrono = 0, correctasEnCrono = 0;

    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function resueltos() {
      const e = APP.store.ejerciciosDe(SET);
      return Object.keys(e).length;
    }
    function aciertos() {
      const e = APP.store.ejerciciosDe(SET);
      return Object.keys(e).filter(function (k) { return e[k]; }).length;
    }

    function render() {
      const caso = casos[orden[i]];
      const yaResuelto = APP.store.ejercicio(SET, caso.id);
      const opciones = APP.shuffle(caso.opciones);

      root.innerHTML =
        '<div class="det-bar">' +
          '<span class="det-count">Caso ' + (i + 1) + " de " + orden.length + "</span>" +
          (caso.tema ? '<span class="pill gray">' + caso.tema + "</span>" : "") +
          '<div class="det-right">' +
            (crono ? '<span class="det-timer" id="detTimer"></span>' : "") +
            '<button class="btn sm neutral" id="detKw" type="button">💡 Ver palabras clave</button>' +
          "</div>" +
        "</div>" +

        '<div class="det-enunciado">' + caso.enunciado + "</div>" +

        '<p style="margin-top:1.1rem;font-weight:600">¿Qué patrón aplicarías?</p>' +
        '<div class="det-opts" id="detOpts">' +
          opciones.map(function (o) {
            return '<button class="det-opt" type="button" data-o="' + APP.escAttr(o) + '">' + o + "</button>";
          }).join("") +
        "</div>" +

        '<div id="detFb"></div>' +

        '<div class="det-nav">' +
          '<button class="btn sm neutral" id="detPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">← Anterior</button>" +
          '<button class="btn sm" id="detNext" type="button" ' + (i === orden.length - 1 ? "disabled" : "") + ">Siguiente →</button>" +
          '<span class="sp"></span>' +
          '<span class="det-count">Resueltos: ' + resueltos() + "/" + casos.length +
            " · Aciertos: " + aciertos() + "</span>" +
        "</div>";

      root.classList.remove("show-kw");

      root.querySelector("#detKw").addEventListener("click", function () {
        root.classList.toggle("show-kw");
        this.textContent = root.classList.contains("show-kw") ? "🙈 Ocultar palabras clave" : "💡 Ver palabras clave";
      });
      root.querySelector("#detPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#detNext").addEventListener("click", function () { if (i < orden.length - 1) { i++; render(); } });

      root.querySelectorAll(".det-opt").forEach(function (b) {
        b.addEventListener("click", function () { responder(caso, b.dataset.o); });
      });

      if (yaResuelto !== undefined) {
        // Ya lo hiciste: te avisamos, pero podés volver a responderlo sin castigo
        root.querySelector("#detOpts").insertAdjacentHTML(
          "beforebegin",
          '<p style="font-size:.8rem;color:var(--muted);margin:.2rem 0 0">' +
          (yaResuelto ? "✔️ Ya lo resolviste bien. Probá de nuevo si querés repasarlo." :
                        "↻ La vez pasada fallaste este. Vamos otra vez.") + "</p>"
        );
      }
      if (crono) pintarCrono();
    }

    function responder(caso, elegida, silencioso) {
      const ok = elegida === caso.correcta;
      const botones = root.querySelectorAll(".det-opt");
      botones.forEach(function (b) {
        b.disabled = true;
        if (b.dataset.o === caso.correcta) b.classList.add("correct");
        else if (b.dataset.o === elegida) b.classList.add("wrong");
      });
      if (!silencioso) {
        APP.store.marcarEjercicio(SET, caso.id, ok);
        if (crono) { respondidasEnCrono++; if (ok) correctasEnCrono++; }
      }
      root.classList.add("show-kw");
      root.querySelector("#detKw").textContent = "🙈 Ocultar palabras clave";

      const otras = caso.opciones.filter(function (o) { return o !== caso.correcta; });
      const fb = root.querySelector("#detFb");
      fb.innerHTML =
        '<div class="det-fb ' + (ok ? "ok" : "no") + '">' +
          "<h4>" + (ok ? "✅ ¡Correcto! " : "❌ No es esa. La respuesta es ") + "<b>" + caso.correcta + "</b></h4>" +
          "<p>" + caso.porque + "</p>" +
          (caso.nota ? "<p>📌 " + caso.nota + "</p>" : "") +
          "<p style='margin-bottom:.2rem'><b>¿Por qué no las otras?</b></p><ul>" +
          otras.map(function (o) {
            return "<li><b>" + o + ":</b> " + (caso.descartes[o] || "no encaja con lo que pide el enunciado.") + "</li>";
          }).join("") +
          "</ul>" +
          (caso.patron ? '<p style="margin-top:.6rem"><a class="inline" data-go="' + caso.patron + '">→ Ir al tema completo</a></p>' : "") +
        "</div>";

      fb.querySelectorAll("[data-go]").forEach(function (c) {
        c.style.cursor = "pointer";
        c.addEventListener("click", function () { APP.go(c.dataset.go); });
      });

      const next = root.querySelector("#detNext");
      if (!next.disabled) next.focus();
    }

    /* ---------------- Modo cronometrado ---------------- */
    function pintarCrono() {
      const el = root.querySelector("#detTimer");
      if (!el || !crono) return;
      const m = Math.floor(crono.restante / 60);
      const s = crono.restante % 60;
      el.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
    }

    APP.detectorCrono = function (minutos) {
      if (crono) { clearInterval(crono.timer); crono = null; }
      respondidasEnCrono = 0; correctasEnCrono = 0;
      orden = APP.shuffle(casos.map(function (_, k) { return k; }));
      i = 0;
      crono = { restante: minutos * 60, timer: null };
      crono.timer = setInterval(function () {
        crono.restante--;
        pintarCrono();
        if (crono.restante <= 0) {
          clearInterval(crono.timer);
          const c = crono; crono = null;
          root.innerHTML =
            '<div class="det-fb ok"><h4>⏱ Se terminó el tiempo</h4>' +
            "<p>Respondiste <b>" + respondidasEnCrono + "</b> casos y acertaste <b>" + correctasEnCrono + "</b>" +
            (respondidasEnCrono ? " (" + Math.round((correctasEnCrono / respondidasEnCrono) * 100) + "%)" : "") + ".</p>" +
            "<p>Sin apuro y revisando los descartes se aprende más que corriendo. Volvé al modo libre para leer las explicaciones de los que fallaste.</p></div>";
          const b = document.createElement("button");
          b.className = "btn"; b.textContent = "Volver al modo libre";
          b.style.marginTop = ".8rem";
          b.addEventListener("click", function () { orden = casos.map(function (_, k) { return k; }); i = 0; render(); });
          root.appendChild(b);
        }
      }, 1000);
      render();
    };

    APP.detectorMezclar = function () {
      orden = APP.shuffle(casos.map(function (_, k) { return k; }));
      i = 0;
      render();
    };
    APP.detectorIr = function (idx) { i = idx; render(); };

    render();
  };

  /* =====================================================================
     Spot the SOLID smell — APP.solidSmell(container, casos)
     Paso 1: ¿qué principio se viola?  Paso 2: ¿cuál es la refactorización
     correcta?  Explicación de por qué las otras no.
     ===================================================================== */
  const LETRAS = [
    { p: "SRP", t: "S · Single Responsibility" },
    { p: "OCP", t: "O · Open/Closed" },
    { p: "LSP", t: "L · Liskov Substitution" },
    { p: "ISP", t: "I · Interface Segregation" },
    { p: "DIP", t: "D · Dependency Inversion" },
  ];

  APP.solidSmell = function (container, casos, opts) {
    opts = opts || {};
    const SET = opts.set || "solid-smell";
    let i = 0;
    let paso = 1;
    let aciertoPrincipio = null;

    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const hecho = APP.store.ejercicio(SET, c.id);

      root.innerHTML =
        '<div class="det-bar">' +
          '<span class="det-count">Caso ' + (i + 1) + " de " + casos.length + "</span>" +
          '<span class="pill indigo">' + c.titulo + "</span>" +
          (hecho !== undefined ? '<span class="pill ' + (hecho ? "green" : "amber") + '">' + (hecho ? "✔️" : "↻") + "</span>" : "") +
        "</div>" +
        APP.code(c.codigo, { label: "¿Qué principio se está violando?", collapse: false }) +
        '<div id="ssPaso1"></div>' +
        '<div id="ssPaso2"></div>' +
        '<div class="det-nav">' +
          '<button class="btn sm neutral" id="ssPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">← Anterior</button>" +
          '<button class="btn sm" id="ssNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">Siguiente →</button>" +
        "</div>";

      APP.highlight(root);
      pintarPaso1();

      root.querySelector("#ssPrev").addEventListener("click", function () {
        if (i > 0) { i--; paso = 1; aciertoPrincipio = null; render(); }
      });
      root.querySelector("#ssNext").addEventListener("click", function () {
        if (i < casos.length - 1) { i++; paso = 1; aciertoPrincipio = null; render(); }
      });
    }

    function pintarPaso1() {
      const c = casos[i];
      const box = root.querySelector("#ssPaso1");
      box.innerHTML =
        '<p style="font-weight:600;margin-top:1rem">1 · ¿Qué principio SOLID se viola?</p>' +
        '<div class="det-opts">' +
          LETRAS.map(function (l) {
            return '<button class="det-opt" type="button" data-p="' + l.p + '">' + l.t + "</button>";
          }).join("") +
        "</div>";

      box.querySelectorAll(".det-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          const ok = b.dataset.p === c.principio;
          aciertoPrincipio = ok;
          box.querySelectorAll(".det-opt").forEach(function (x) {
            x.disabled = true;
            if (x.dataset.p === c.principio) x.classList.add("correct");
            else if (x === b) x.classList.add("wrong");
          });
          box.insertAdjacentHTML("beforeend",
            '<div class="det-fb ' + (ok ? "ok" : "no") + '">' +
            "<h4>" + (ok ? "✅ Correcto: " : "❌ Es ") + "<b>" + c.principio + "</b></h4><p>" + c.porque + "</p></div>");
          pintarPaso2();
        });
      });
    }

    function pintarPaso2() {
      const c = casos[i];
      const box = root.querySelector("#ssPaso2");
      const opciones = APP.shuffle(c.refactors);
      box.innerHTML =
        '<p style="font-weight:600;margin-top:1.4rem">2 · ¿Cuál es la refactorización correcta?</p>' +
        '<div class="q-opts">' +
          opciones.map(function (r, k) {
            return '<button class="q-opt" type="button" data-k="' + k + '"><span class="mk">•</span><span>' + r.t + "</span></button>";
          }).join("") +
        "</div>";

      box.querySelectorAll(".q-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          const elegida = opciones[+b.dataset.k];
          box.querySelectorAll(".q-opt").forEach(function (x, k) {
            x.disabled = true;
            if (opciones[k].ok) x.classList.add("correct");
            else if (x === b) x.classList.add("wrong");
          });
          APP.store.marcarEjercicio(SET, c.id, !!(aciertoPrincipio && elegida.ok));
          box.insertAdjacentHTML("beforeend",
            '<div class="det-fb ' + (elegida.ok ? "ok" : "no") + '">' +
            "<h4>" + (elegida.ok ? "✅ Bien elegida" : "❌ Esa no") + "</h4><ul>" +
            opciones.map(function (r) {
              return "<li>" + (r.ok ? "✅" : "❌") + " <b>" + (r.ok ? "Correcta" : "Descartada") + ":</b> " + r.why + "</li>";
            }).join("") +
            "</ul></div>");
          const n = root.querySelector("#ssNext");
          if (n && !n.disabled) n.focus();
        });
      });
    }

    render();
  };
})();
