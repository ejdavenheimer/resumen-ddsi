/* =====================================================================
   Interactivos para la sección Diagramas UML.

   APP.ordenarSecuencia(container, casos)
     casos = [{ enunciado, mensajes:[...en orden CORRECTO...], explicacion }]
     El alumno arma la secuencia eligiendo el siguiente mensaje cada vez.

   APP.elegirComponentes(container, casos)
     casos = [{ enunciado, opciones:[{t, ok, why}], explicacion }]
     Checkboxes con distractores; verifica qué componentes van.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  APP.ordenarSecuencia = function (container, casos) {
    let i = 0;
    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const restantes = APP.shuffle(c.mensajes.map(function (m, k) { return k; }));
      let paso = 0;
      let ok = true;

      root.innerHTML =
        '<div class="det-bar"><span class="det-count">Caso ' + (i + 1) + " de " + casos.length + "</span></div>" +
        '<div class="det-enunciado">' + c.enunciado + "</div>" +
        '<p style="font-weight:600;margin-top:1rem">Armá la secuencia: tocá los mensajes en el orden correcto.</p>' +
        '<div id="osArmada" class="seq-armada"></div>' +
        '<div id="osPool" class="seq-pool"></div>' +
        '<div id="osFb"></div>' +
        '<div class="det-nav">' +
          '<button class="btn sm neutral" id="osPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">← Anterior</button>" +
          '<button class="btn sm neutral" id="osReset" type="button">Reiniciar</button>' +
          '<button class="btn sm" id="osNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">Siguiente →</button>" +
        "</div>";

      const pool = root.querySelector("#osPool");
      const armada = root.querySelector("#osArmada");
      const fb = root.querySelector("#osFb");

      function pintarPool() {
        pool.innerHTML = "";
        restantes.forEach(function (k) {
          const b = document.createElement("button");
          b.className = "seq-msg"; b.type = "button";
          b.innerHTML = c.mensajes[k];
          b.addEventListener("click", function () { elegir(k, b); });
          pool.appendChild(b);
        });
      }
      function elegir(k, btn) {
        const esperado = paso;               // el índice correcto siguiente
        const correcto = k === esperado;
        const row = document.createElement("div");
        row.className = "seq-step " + (correcto ? "ok" : "no");
        row.innerHTML = '<span class="seq-n">' + (paso + 1) + "</span>" + c.mensajes[k] +
          (correcto ? "" : ' <span class="seq-flag">← acá iba: “' + c.mensajes[esperado].replace(/<[^>]+>/g, "") + "”</span>");
        armada.appendChild(row);
        if (!correcto) ok = false;
        const idx = restantes.indexOf(k);
        if (idx > -1) restantes.splice(idx, 1);
        paso++;
        pintarPool();
        if (paso === c.mensajes.length) terminar();
      }
      function terminar() {
        fb.innerHTML = '<div class="det-fb ' + (ok ? "ok" : "no") + '">' +
          "<h4>" + (ok ? "✅ ¡Secuencia correcta!" : "Revisá el orden") + "</h4><p>" + c.explicacion + "</p></div>";
        const n = root.querySelector("#osNext");
        if (n && !n.disabled) n.focus();
      }

      pintarPool();
      root.querySelector("#osReset").addEventListener("click", render);
      root.querySelector("#osPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#osNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }
    render();
  };

  APP.elegirComponentes = function (container, casos) {
    let i = 0;
    const root = document.createElement("div");
    root.className = "det";
    container.appendChild(root);

    function render() {
      const c = casos[i];
      const ops = APP.shuffle(c.opciones);
      root.innerHTML =
        '<div class="det-bar"><span class="det-count">Caso ' + (i + 1) + " de " + casos.length + "</span></div>" +
        '<div class="det-enunciado">' + c.enunciado + "</div>" +
        '<p style="font-weight:600;margin-top:1rem">¿Qué componentes van en el diagrama? Marcá todos los que correspondan.</p>' +
        '<div class="q-opts" id="ecOpts">' +
          ops.map(function (o, k) {
            return '<button class="q-opt" type="button" data-k="' + k + '"><span class="mk">•</span><span>' + o.t + "</span></button>";
          }).join("") +
        "</div>" +
        '<div class="controls"><button class="btn sm" id="ecCheck" type="button">Verificar</button>' +
          '<span style="margin-left:auto"></span>' +
          '<button class="btn sm neutral" id="ecPrev" type="button" ' + (i === 0 ? "disabled" : "") + ">←</button>" +
          '<button class="btn sm neutral" id="ecNext" type="button" ' + (i === casos.length - 1 ? "disabled" : "") + ">→</button></div>" +
        '<div id="ecFb"></div>';

      const chosen = new Set();
      root.querySelectorAll("#ecOpts .q-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          const k = +b.dataset.k;
          if (chosen.has(k)) { chosen.delete(k); b.style.borderColor = ""; b.style.background = ""; }
          else { chosen.add(k); b.style.borderColor = "var(--brand)"; b.style.background = "var(--brand-soft)"; }
        });
      });
      root.querySelector("#ecCheck").addEventListener("click", function () {
        const botones = root.querySelectorAll("#ecOpts .q-opt");
        botones.forEach(function (b, k) {
          b.disabled = true;
          if (ops[k].ok) b.classList.add("correct");
          else if (chosen.has(k)) b.classList.add("wrong");
        });
        root.querySelector("#ecFb").innerHTML =
          '<div class="det-fb ok"><h4>Solución</h4><ul>' +
          ops.map(function (o) {
            return "<li>" + (o.ok ? "✅ <b>Va:</b> " : "❌ <b>No va:</b> ") + o.t + (o.why ? " — " + o.why : "") + "</li>";
          }).join("") +
          "</ul><p>" + c.explicacion + "</p></div>";
      });
      root.querySelector("#ecPrev").addEventListener("click", function () { if (i > 0) { i--; render(); } });
      root.querySelector("#ecNext").addEventListener("click", function () { if (i < casos.length - 1) { i++; render(); } });
    }
    render();
  };
})();
