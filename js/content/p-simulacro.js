/* ============================================================
   Práctica — Simulacro de parcial (con timer)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-simulacro",
    title: "Simulacro de parcial",
    tag: "⏳",
    group: "Práctica interactiva",
    resumen: "Resolvé contra reloj y autocorregí",
    keywords: ["simulacro", "parcial", "cronometrado", "rubrica", "examen"],
    render(el) {
      const finales = (APP.DATA.finales || []);

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Simulacro de parcial</h1>
          <p class="lead">Elegí un parcial, resolvelo <b>en papel y contra reloj</b>, y después autocorregite con la rúbrica.</p>
        </div>

        <div class="aviso-escrito">
          <div class="emo">📝</div>
          <div><p><b>Resolvelo en papel, como en el parcial real.</b> Tené a mano hojas y lápiz (o pizarra).
          El objetivo es practicar el examen de verdad: diagramar a mano, justificar por escrito, administrar el tiempo.
          La solución queda <b>bloqueada</b> hasta que termines.</p></div>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Cómo funciona</div>
          <ol>
            <li>Elegí un parcial y la <b>duración</b> del cronómetro.</li>
            <li>Se muestra <b>sólo el enunciado</b>. Resolvelo en papel. <b>No abras la resolución.</b></li>
            <li>Cuando termines (o se acabe el tiempo), se <b>desbloquea la solución modelo</b> y la rúbrica.</li>
            <li>Autocorregite con honestidad; el puntaje se guarda para ver tu evolución.</li>
          </ol>
        </div>

        <div id="simSetup">
          <h2>1 · Elegí el parcial</h2>
          <div class="idx-grid" id="simList"></div>
          <h2>2 · Duración del cronómetro</h2>
          <div class="controls" id="simDur">
            <button class="chip-btn" type="button" data-min="180">3 horas (parcial completo)</button>
            <button class="chip-btn active" type="button" data-min="90">90 min</button>
            <button class="chip-btn" type="button" data-min="45">45 min (un punto)</button>
            <button class="chip-btn" type="button" data-min="0">Sin límite</button>
          </div>
          <p style="color:var(--ink-soft);font-size:.88rem">Elegí la duración y después tocá un parcial de la lista para arrancar.</p>
        </div>

        <div id="simRun" style="display:none"></div>

        <h2>Tus simulacros anteriores</h2>
        <div id="simHist"></div>
      `;

      let durMin = 90;
      const durBtns = el.querySelectorAll("#simDur .chip-btn");
      durBtns.forEach(function (b) {
        b.addEventListener("click", function () {
          durMin = +b.dataset.min;
          durBtns.forEach(function (x) { x.classList.toggle("active", x === b); });
        });
      });

      const list = el.querySelector("#simList");
      finales.forEach(function (f) {
        const d = document.createElement("div");
        d.className = "idx-card";
        d.innerHTML = "<b>📄 " + f.nombre + "</b><small>" + f.fecha + "</small>";
        d.addEventListener("click", function () { arrancar(f); });
        list.appendChild(d);
      });

      pintarHistorial();

      let timer = null;
      function arrancar(f) {
        el.querySelector("#simSetup").style.display = "none";
        const run = el.querySelector("#simRun");
        run.style.display = "block";
        const sinLimite = durMin === 0;
        let restante = durMin * 60;

        run.innerHTML = `
          <div class="controls" style="position:sticky;top:.5rem;z-index:5;background:var(--bg-app);padding:.5rem 0">
            <span class="det-timer" id="simTimer" style="font-size:1.3rem">${sinLimite ? "♾️ sin límite" : ""}</span>
            <span style="margin-left:auto"></span>
            <button class="btn sm" id="simRubrica" type="button">Terminé · ver solución y rúbrica</button>
            <button class="btn neutral sm" id="simSalir" type="button">Abandonar</button>
          </div>
          <div class="aviso-escrito"><div class="emo">✍️</div><div><p><b>Resolvé en papel.</b> La solución modelo se desbloquea cuando toques “Terminé”.</p></div></div>
          <h2>${f.nombre} <span class="pill gray">${f.fecha}</span></h2>
          <div class="enunciado">${f.enunciado}</div>
          <div id="simRubricaBox"></div>
        `;

        function pintar() {
          const h = Math.floor(restante / 3600);
          const m = Math.floor((restante % 3600) / 60);
          const s = restante % 60;
          const t = run.querySelector("#simTimer");
          t.textContent = "⏳ " + h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
          if (restante <= 300) t.style.color = "var(--bad)";
        }
        if (!sinLimite) {
          pintar();
          timer = setInterval(function () {
            restante--;
            pintar();
            if (restante <= 0) { clearInterval(timer); verRubrica(f, true); }
          }, 1000);
        }

        run.querySelector("#simRubrica").addEventListener("click", function () { verRubrica(f, false); });
        run.querySelector("#simSalir").addEventListener("click", function () {
          if (!confirm("¿Abandonar el simulacro? No se guardará puntaje.")) return;
          if (timer) clearInterval(timer);
          APP.go("p-simulacro");
        });
      }

      function verRubrica(f, seAcaboElTiempo) {
        if (timer) clearInterval(timer);
        const box = el.querySelector("#simRubricaBox");
        box.innerHTML =
          '<h2>✅ Solución desbloqueada</h2>' +
          (seAcaboElTiempo ? '<div class="callout warn"><b>⏰ Se terminó el tiempo.</b> Corregí lo que hayas alcanzado a resolver.</div>' : "") +
          '<div class="callout tip"><p>La <b>resolución completa paso a paso</b> de este parcial está en su página de finales resueltos: ' +
          '<a class="inline" data-go="' + f.id + '">📄 Abrir la solución de ' + f.nombre + '</a>. ' +
          'Compará tu resolución con la modelo mientras tildás la rúbrica.</p></div>' +
          '<h3>Autocorrección</h3>' +
          '<p>Tildá cada criterio que hayas cumplido. Sé honesto: el objetivo es saber dónde estás parado, no inflar el número.</p>' +
          '<div id="simRubricaItems"></div>' +
          '<div class="controls"><button class="btn" id="simGuardar" type="button">Guardar resultado</button></div>';
        box.querySelectorAll("[data-go]").forEach(function (c) {
          c.style.cursor = "pointer";
          c.addEventListener("click", function () { APP.go(c.dataset.go); });
        });

        // rúbrica con su propio set para no pisar el de la página del final
        APP.rubrica(box.querySelector("#simRubricaItems"), "sim-" + f.id, f.rubrica);

        box.querySelector("#simGuardar").addEventListener("click", function () {
          const hechos = APP.store.ejerciciosDe("rubrica:sim-" + f.id);
          const total = f.rubrica.reduce(function (a, i) { return a + (i.p || 0); }, 0);
          const puntos = f.rubrica.reduce(function (a, it, k) {
            return a + (hechos[String(k)] ? (it.p || 0) : 0);
          }, 0);
          const pct = total ? Math.round((puntos / total) * 100) : 0;
          APP.store.guardarSimulacro({ fecha: APP.hoy(), final: f.id, nombre: f.nombre, score: pct });
          alert("Guardado: " + puntos + "/" + total + " (" + pct + "%)" +
            (pct >= 60 ? " · ✅ aprobado" : " · ⚠️ a seguir practicando"));
          APP.go("p-simulacro");
        });
        box.scrollIntoView({ behavior: "smooth" });
      }

      function pintarHistorial() {
        const hist = APP.store.get().simulacros || [];
        const cont = el.querySelector("#simHist");
        if (!hist.length) {
          cont.innerHTML = '<div class="callout info">Todavía no hiciste ningún simulacro. Elegí uno arriba para empezar.</div>';
          return;
        }
        cont.innerHTML =
          '<div class="table-wrap"><table class="data"><thead><tr><th>Fecha</th><th>Final</th><th>Puntaje</th></tr></thead><tbody>' +
          hist.slice().reverse().map(function (r) {
            return "<tr><td>" + r.fecha + "</td><td>" + (r.nombre || r.final) + "</td><td>" + r.score + "% " +
              (r.score >= 60 ? "✅" : "⚠️") + "</td></tr>";
          }).join("") +
          "</tbody></table></div>";
      }
    },
  });
})();
