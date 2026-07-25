/* =====================================================================
   "Armá el diagrama" — APP.diagrama(container, ejercicios)

   Editor simplificado y autocorregible (según la nota técnica del prompt):
     Paso 1: elegí qué clases van en el diagrama (hay distractores).
     Paso 2: para cada par, elegí la relación.
     Verificar → verde/rojo + solución modelo en Mermaid al lado.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  const TIPOS = [
    { v: "", t: "— elegí —" },
    { v: "herencia", t: "Herencia / implementación  (◁——)" },
    { v: "composicion", t: "Composición / agregación  (◆——)" },
    { v: "asociacion", t: "Asociación  (——>)" },
    { v: "dependencia", t: "Dependencia  (- ->)" },
    { v: "ninguna", t: "No van relacionadas" },
  ];
  const NOMBRE = {
    herencia: "herencia / implementación",
    composicion: "composición / agregación",
    asociacion: "asociación",
    dependencia: "dependencia",
    ninguna: "sin relación",
  };

  APP.diagrama = function (container, ejercicios) {
    let i = 0;
    let seleccion = new Set();
    let verificado = false;

    const root = document.createElement("div");
    container.appendChild(root);

    function ej() { return ejercicios[i]; }

    function render() {
      const e = ej();
      const hecho = APP.store.ejercicio("diagrama", e.id);

      root.innerHTML =
        '<div class="det-bar">' +
          '<span class="det-count">Ejercicio ' + (i + 1) + " de " + ejercicios.length + "</span>" +
          '<span class="pill ' + (e.nivel === "Fácil" ? "green" : e.nivel === "Medio" ? "amber" : "red") + '">' + e.nivel + "</span>" +
          (hecho ? '<span class="pill green">✔️ resuelto</span>' : "") +
        "</div>" +

        "<h3 style='margin-top:.8rem'>" + e.titulo + "</h3>" +
        '<div class="det-enunciado">' + e.enunciado + "</div>" +

        "<h4>1 · ¿Qué clases van en el diagrama?</h4>" +
        '<p style="font-size:.88rem;color:var(--ink-soft);margin-top:.2rem">Tocá para incluir o excluir. Hay clases que <b>no</b> deberían estar.</p>' +
        '<div class="dg-clases" id="dgClases">' +
          e.clases.map(function (c) {
            return '<button class="dg-clase' + (seleccion.has(c) ? " sel" : "") + '" type="button" data-c="' +
              APP.escAttr(c) + '">' + c + "</button>";
          }).join("") +
        "</div>" +

        "<h4>2 · ¿Qué relación hay entre cada par?</h4>" +
        '<div id="dgRels">' +
          e.relaciones.map(function (r, k) {
            return '<div class="dg-rel" data-k="' + k + '">' +
              "<code>" + r.a + "</code>" +
              '<select aria-label="Relación entre ' + r.a + " y " + r.b + '">' +
                TIPOS.map(function (t) { return '<option value="' + t.v + '">' + t.t + "</option>"; }).join("") +
              "</select>" +
              "<code>" + r.b + "</code>" +
              '<span class="mark"></span>' +
            "</div>";
          }).join("") +
        "</div>" +

        '<div class="controls">' +
          '<button class="btn" id="dgVerificar" type="button">Verificar</button>' +
          '<button class="btn ghost" id="dgSolucion" type="button">Ver solución modelo</button>' +
          '<button class="btn neutral sm" id="dgLimpiar" type="button">Limpiar</button>' +
          '<span style="margin-left:auto"></span>' +
          '<button class="btn neutral sm" id="dgPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">←</button>" +
          '<button class="btn neutral sm" id="dgNext" type="button" ' + (i === ejercicios.length - 1 ? "disabled" : "") + ">→</button>" +
        "</div>" +

        '<div id="dgResultado"></div>';

      root.querySelectorAll("#dgClases .dg-clase").forEach(function (b) {
        b.addEventListener("click", function () {
          if (verificado) return;
          const c = b.dataset.c;
          if (seleccion.has(c)) { seleccion.delete(c); b.classList.remove("sel"); }
          else { seleccion.add(c); b.classList.add("sel"); }
        });
      });

      root.querySelector("#dgVerificar").addEventListener("click", verificar);
      root.querySelector("#dgSolucion").addEventListener("click", function () { mostrarSolucion(true); });
      root.querySelector("#dgLimpiar").addEventListener("click", function () {
        seleccion = new Set(); verificado = false; render();
      });
      root.querySelector("#dgPrev").addEventListener("click", function () {
        if (i > 0) { i--; seleccion = new Set(); verificado = false; render(); }
      });
      root.querySelector("#dgNext").addEventListener("click", function () {
        if (i < ejercicios.length - 1) { i++; seleccion = new Set(); verificado = false; render(); }
      });
    }

    function verificar() {
      const e = ej();
      verificado = true;

      /* --- Paso 1: clases --- */
      let sobran = [], faltan = [];
      root.querySelectorAll("#dgClases .dg-clase").forEach(function (b) {
        const c = b.dataset.c;
        const debeEstar = e.correctas.indexOf(c) !== -1;
        const elegida = seleccion.has(c);
        b.classList.remove("sel");
        if (debeEstar && elegida) b.classList.add("ok");
        else if (!debeEstar && elegida) { b.classList.add("no"); sobran.push(c); }
        else if (debeEstar && !elegida) { b.classList.add("falta"); faltan.push(c); }
      });

      /* --- Paso 2: relaciones --- */
      let relOk = 0;
      const detalleRel = [];
      root.querySelectorAll("#dgRels .dg-rel").forEach(function (row) {
        const k = +row.dataset.k;
        const r = e.relaciones[k];
        const sel = row.querySelector("select");
        const marca = row.querySelector(".mark");
        const acierta = sel.value === r.ok;
        sel.disabled = true;
        if (acierta) { relOk++; marca.textContent = "✅"; marca.style.color = "var(--ok)"; }
        else { marca.textContent = "❌"; marca.style.color = "var(--bad)"; }
        detalleRel.push(
          "<li>" + (acierta ? "✅" : "❌") + " <code>" + r.a + "</code> → <code>" + r.b + "</code>: es <b>" +
          NOMBRE[r.ok] + "</b>" + (acierta ? "" : (sel.value ? " (elegiste " + NOMBRE[sel.value] + ")" : " (no la respondiste)")) +
          ". " + r.why + "</li>"
        );
      });

      const clasesOk = sobran.length === 0 && faltan.length === 0;
      const todoOk = clasesOk && relOk === e.relaciones.length;
      APP.store.marcarEjercicio("diagrama", e.id, todoOk);

      const res = root.querySelector("#dgResultado");
      res.innerHTML =
        '<div class="det-fb ' + (todoOk ? "ok" : "no") + '">' +
          "<h4>" + (todoOk ? "✅ Perfecto" : "Revisemos") + " — clases: " +
            (e.correctas.length - faltan.length) + "/" + e.correctas.length +
            " · relaciones: " + relOk + "/" + e.relaciones.length + "</h4>" +
          (faltan.length ? "<p>🟡 <b>Te faltaron:</b> " + faltan.map(function (c) { return "<code>" + c + "</code>"; }).join(", ") + "</p>" : "") +
          (sobran.length ? "<p>🔴 <b>Sobran:</b> " + sobran.map(function (c) {
              return "<code>" + c + "</code>" + (e.distractoresPorQue && e.distractoresPorQue[c] ? " — " + e.distractoresPorQue[c] : "");
            }).join("<br>") + "</p>" : "") +
          "<ul>" + detalleRel.join("") + "</ul>" +
        "</div>";

      mostrarSolucion(false);
    }

    function mostrarSolucion(scroll) {
      const e = ej();
      let cont = root.querySelector("#dgSolBox");
      if (!cont) {
        cont = document.createElement("div");
        cont.id = "dgSolBox";
        root.querySelector("#dgResultado").appendChild(cont);
      }
      cont.innerHTML =
        "<h4>Solución modelo</h4>" +
        APP.uml(e.solucion, e.titulo) +
        '<div class="callout key">' + e.explicacion + "</div>";
      APP.rerenderMermaid(cont);
      if (scroll) cont.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    render();
  };
})();
