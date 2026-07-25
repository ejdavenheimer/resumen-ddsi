/* =====================================================================
   Plantilla de página de patrón — APP.patternPage(el, cfg)

   Orden pedagógico adaptado al PARCIAL ESCRITO:
   analogía → problema → DIAGRAMA (lo que se dibuja en el examen) →
   cómo dibujarlo a mano → código Java (colapsado, opcional) →
   palabras clave → cuándo NO → justificación modelo → confusiones → ejercicio.

   cfg = {
     categoria, titulo, intencion,
     analogia:   {emoji, html},
     problema:   html,
     uml:        "classDiagram ...",
     roles:      [{n:"Nombre", d:"qué rol cumple"}],
     mano:       [html, ...],           // pasos para dibujarlo a mano
     mal:        {code, nota, intro},   // opcional (se colapsa)
     bien:       {code, nota, intro},   // (se colapsa)
     extra:      html,                  // opcional
     keywords:   [{k:"frase del enunciado", ej:"ejemplo concreto"}],
     noUsar:     html,
     justificar: [html, ...],
     confusiones:[{titulo, a:{t,html}, b:{t,html}, regla}],
     ejercicio:  [ {preguntas del quiz} ]
   }
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  APP.patternPage = function (el, cfg) {
    const P = [];

    /* 1 — Título + intención */
    P.push(
      '<div class="page-head">' +
      '<div class="page-kicker">Patrón ' + (cfg.categoria || "") + "</div>" +
      "<h1>" + cfg.titulo + "</h1>" +
      '<p class="lead">' + cfg.intencion + "</p>" +
      "</div>"
    );

    /* 2 — Analogía */
    P.push(
      '<div class="analogia">' +
      '<div class="emo">' + (cfg.analogia.emoji || "💡") + "</div>" +
      '<div class="txt"><strong class="lbl">La analogía</strong>' + cfg.analogia.html + "</div>" +
      "</div>"
    );

    /* 3 — El problema */
    P.push("<h2>El problema que resuelve</h2>");
    P.push(cfg.problema);

    /* 4 — Diagrama UML (lo que se dibuja en el parcial: va ANTES que el código) */
    P.push("<h2>El diagrama (esto es lo que dibujás en el parcial)</h2>");
    P.push(APP.uml(cfg.uml, cfg.titulo));
    if (cfg.roles && cfg.roles.length) {
      P.push(
        '<div class="widget"><div class="widget-title">🎭 Roles del patrón</div>' +
        '<p class="widget-sub">Pasá el mouse (o tocá) cada clase para ver qué rol cumple.</p>' +
        '<div class="roles" id="pp-roles">' +
        cfg.roles.map(function (r, i) {
          return '<button class="role-chip" type="button" data-i="' + i + '">' + r.n + "</button>";
        }).join("") +
        "</div>" +
        '<div class="role-desc" id="pp-roledesc">Elegí una clase para ver su responsabilidad.</div>' +
        "</div>"
      );
    }

    /* 5 — Cómo dibujarlo rápido a mano */
    if (cfg.mano && cfg.mano.length) {
      P.push(
        '<div class="callout key"><div class="callout-title">✏️ Cómo dibujarlo rápido a mano</div><ol>' +
        cfg.mano.map(function (m) { return "<li>" + m + "</li>"; }).join("") +
        "</ol></div>"
      );
    }

    /* 6 — Código (colapsado: el parcial es escrito) */
    if (cfg.mal || cfg.bien) {
      P.push("<h2>Cómo se ve en código (opcional)</h2>");
    }
    if (cfg.mal) {
      if (cfg.mal.intro) P.push(cfg.mal.intro);
      P.push(APP.code(cfg.mal.code, { variant: "bad", label: "❌ Sin " + cfg.titulo }));
      if (cfg.mal.nota) P.push('<div class="callout bad">' + cfg.mal.nota + "</div>");
    }
    if (cfg.bien) {
      if (cfg.bien.intro) P.push(cfg.bien.intro);
      P.push(APP.code(cfg.bien.code, { variant: "good", label: "✅ Con " + cfg.titulo }));
      if (cfg.bien.nota) P.push('<div class="callout tip">' + cfg.bien.nota + "</div>");
    }

    /* 6.b — Bloque extra opcional (variantes, segunda parte del patrón, etc.) */
    if (cfg.extra) P.push(cfg.extra);

    /* 7 — Palabras clave */
    P.push("<h2>Palabras clave para detectarlo en un enunciado</h2>");
    P.push(
      '<p>Si el enunciado del parcial dice algo parecido a esto, <b>' + cfg.titulo +
      "</b> entra en la lista de candidatos:</p>" +
      '<div class="table-wrap"><table class="data"><thead><tr>' +
      "<th>Frase del enunciado</th><th>Ejemplo concreto</th></tr></thead><tbody>" +
      cfg.keywords.map(function (k) {
        return "<tr><td>“" + k.k + "”</td><td>" + k.ej + "</td></tr>";
      }).join("") +
      "</tbody></table></div>"
    );

    /* 8 — Cuándo NO usarlo */
    P.push("<h2>Cuándo NO usarlo</h2>");
    P.push('<div class="callout warn"><div class="callout-title">⚠️ Ojo con la sobreingeniería</div>' + cfg.noUsar + "</div>");

    /* 9 — Justificación modelo escrita */
    P.push("<h2>📝 Justificación modelo (copiala y adaptala)</h2>");
    P.push(
      '<p>Así se escribe en la hoja, reemplazando lo que está entre corchetes. Una buena justificación tiene ' +
      "<b>cuatro elementos</b> — y son exactamente los que busca el corrector:</p>" +
      '<div class="just-req"><span class="pill indigo">1 · Nombra el patrón</span>' +
      '<span class="pill blue">2 · Cita el enunciado</span>' +
      '<span class="pill green">3 · Menciona un principio SOLID</span>' +
      '<span class="pill amber">4 · Menciona una cualidad (acoplamiento / cohesión)</span></div>'
    );
    P.push(
      cfg.justificar.map(function (j) {
        return '<blockquote class="just-modelo">' + j + "</blockquote>";
      }).join("")
    );
    P.push('<p style="font-size:.88rem;color:var(--ink-soft)">Practicá esto en ' +
      '<a class="inline" data-go="p-justificacion">🎮 Escribí la justificación</a>, que corrige esos cuatro elementos.</p>');

    /* 10 — Confusión típica */
    if (cfg.confusiones && cfg.confusiones.length) {
      P.push("<h2>Confusión típica con otros patrones</h2>");
      cfg.confusiones.forEach(function (c) {
        P.push("<h3>" + c.titulo + "</h3>");
        P.push(
          '<div class="vs-grid">' +
          '<div class="vs-a"><h4>' + c.a.t + "</h4>" + c.a.html + "</div>" +
          '<div class="vs-b"><h4>' + c.b.t + "</h4>" + c.b.html + "</div>" +
          "</div>"
        );
        if (c.regla) P.push('<div class="callout key"><div class="callout-title">🔑 Regla rápida</div>' + c.regla + "</div>");
      });
    }

    /* 11 — Mini-ejercicio */
    if (cfg.ejercicio && cfg.ejercicio.length) {
      P.push("<h2>Mini-ejercicio</h2>");
      P.push('<div id="pp-quiz"></div>');
    }

    el.innerHTML = P.join("\n");

    /* Interactividad de los roles */
    const roles = el.querySelector("#pp-roles");
    if (roles) {
      const desc = el.querySelector("#pp-roledesc");
      const set = function (i) {
        const r = cfg.roles[i];
        desc.innerHTML = "<b>" + r.n + "</b> — " + r.d;
      };
      roles.querySelectorAll(".role-chip").forEach(function (b) {
        b.addEventListener("mouseenter", function () { set(+b.dataset.i); });
        b.addEventListener("focus", function () { set(+b.dataset.i); });
        b.addEventListener("click", function () { set(+b.dataset.i); });
      });
    }

    /* Quiz final */
    const qz = el.querySelector("#pp-quiz");
    if (qz) APP.quiz(qz, cfg.ejercicio);
  };
})();
