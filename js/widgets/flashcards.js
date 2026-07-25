/* =====================================================================
   Flashcards — APP.flashcards(container, cards)
   Leitner simplificado de 3 cajas: Nueva → Aprendiendo → Sabida.
   Las que marcás "no sabía" vuelven a Aprendiendo y salen más seguido.
   Progreso en localStorage.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  APP.flashcards = function (container, cards) {
    const cats = [];
    cards.forEach(function (c) { if (cats.indexOf(c.cat) === -1) cats.push(c.cat); });

    let filtro = "Todas";
    let mazo = [];
    let pos = 0;
    let volteada = false;

    const root = document.createElement("div");
    container.appendChild(root);

    function caja(c) { return APP.store.flashcard(c.id); }

    function conteo() {
      const base = cards.filter(enFiltro);
      return {
        nueva: base.filter(function (c) { return caja(c) === "nueva"; }).length,
        aprendiendo: base.filter(function (c) { return caja(c) === "aprendiendo"; }).length,
        sabida: base.filter(function (c) { return caja(c) === "sabida"; }).length,
        total: base.length,
      };
    }
    function enFiltro(c) { return filtro === "Todas" || c.cat === filtro; }

    /* Arma el mazo: primero las que no sabés, después las nuevas, al final las sabidas.
       Dentro de cada grupo, orden aleatorio. */
    function armarMazo() {
      const base = cards.filter(enFiltro);
      const g = { aprendiendo: [], nueva: [], sabida: [] };
      base.forEach(function (c) { g[caja(c)].push(c); });
      mazo = APP.shuffle(g.aprendiendo).concat(APP.shuffle(g.nueva), APP.shuffle(g.sabida));
      pos = 0; volteada = false;
    }

    function render() {
      if (!mazo.length) armarMazo();
      const c = mazo[pos];
      const n = conteo();

      root.innerHTML =
        '<div class="quiz-toolbar"><div class="quiz-filter" id="fcFiltro">' +
          ["Todas"].concat(cats).map(function (t) {
            return '<button class="chip-btn' + (t === filtro ? " active" : "") + '" type="button" data-c="' + APP.escAttr(t) + '">' + t + "</button>";
          }).join("") +
        "</div></div>" +

        '<div class="fc-boxes">' +
          '<div class="fb"><b>' + n.nueva + "</b>🆕 Nuevas</div>" +
          '<div class="fb"><b>' + n.aprendiendo + "</b>📖 Aprendiendo</div>" +
          '<div class="fb"><b>' + n.sabida + "</b>✅ Sabidas</div>" +
        "</div>" +

        (c ? (
          '<div class="fc-stage"><div class="fc-card' + (volteada ? " flip" : "") + '" id="fcCard" role="button" tabindex="0" aria-label="Tocá para ver la respuesta">' +
            '<div class="fc-face fc-front">' +
              '<div class="fc-tag">' + c.cat + "</div>" +
              "<h3>" + c.front + "</h3>" +
              '<div class="hint">Tocá la tarjeta (o Espacio) para ver el dorso</div>' +
            "</div>" +
            '<div class="fc-face fc-back">' +
              '<div class="fc-tag">' + c.front + "</div>" +
              "<p>" + c.back + "</p>" +
              (c.kws ? '<p class="kws">🔑 ' + c.kws + "</p>" : "") +
            "</div>" +
          "</div></div>" +

          '<div class="fc-actions">' +
            (volteada
              ? '<button class="btn ghost" id="fcNo" type="button">😕 No la sabía</button>' +
                '<button class="btn" id="fcSi" type="button">😎 La sabía</button>'
              : '<button class="btn" id="fcFlip" type="button">Ver respuesta</button>') +
          "</div>" +
          '<p style="text-align:center;color:var(--muted);font-size:.8rem;margin-top:.8rem">' +
            "Tarjeta " + (pos + 1) + " de " + mazo.length + " · " +
            '<button class="btn sm neutral" id="fcMezclar" type="button">Rearmar mazo</button> ' +
            '<button class="btn sm neutral" id="fcReset" type="button">Reiniciar progreso</button>' +
          "</p>"
        ) : '<div class="callout info">No hay tarjetas en esta categoría.</div>');

      root.querySelectorAll("#fcFiltro .chip-btn").forEach(function (b) {
        b.addEventListener("click", function () { filtro = b.dataset.c; armarMazo(); render(); });
      });

      const card = root.querySelector("#fcCard");
      if (card) {
        const flip = function () { volteada = !volteada; render(); };
        card.addEventListener("click", flip);
        card.addEventListener("keydown", function (e) {
          if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
        });
      }
      const bFlip = root.querySelector("#fcFlip");
      if (bFlip) bFlip.addEventListener("click", function () { volteada = true; render(); });

      const bSi = root.querySelector("#fcSi");
      if (bSi) bSi.addEventListener("click", function () { calificar("sabida"); });
      const bNo = root.querySelector("#fcNo");
      if (bNo) bNo.addEventListener("click", function () { calificar("aprendiendo"); });

      root.querySelector("#fcMezclar").addEventListener("click", function () { armarMazo(); render(); });
      root.querySelector("#fcReset").addEventListener("click", function () {
        if (!confirm("¿Reiniciar el progreso de todas las flashcards?")) return;
        cards.forEach(function (x) { APP.store.flashcard(x.id, "nueva"); });
        armarMazo(); render();
      });
    }

    function calificar(nuevaCaja) {
      const c = mazo[pos];
      APP.store.flashcard(c.id, nuevaCaja);
      if (nuevaCaja === "aprendiendo") {
        // vuelve a aparecer más adelante en esta misma vuelta
        const destino = Math.min(mazo.length, pos + 4);
        mazo.splice(destino, 0, c);
      }
      volteada = false;
      pos++;
      if (pos >= mazo.length) {
        const n = conteo();
        root.innerHTML =
          '<div class="callout tip"><div class="callout-title">🎉 Terminaste la vuelta</div>' +
          "<p>Sabidas: <b>" + n.sabida + "</b> · Aprendiendo: <b>" + n.aprendiendo + "</b> · Nuevas: <b>" + n.nueva + "</b> (de " + n.total + ").</p>" +
          (n.aprendiendo ? "<p>Todavía quedan tarjetas en “Aprendiendo”: dales otra vuelta, que son justo las que te van a costar en el parcial.</p>"
                         : "<p>No te quedó ninguna en “Aprendiendo”. Buen momento para pasar al Detector de patrones.</p>") +
          "</div>";
        const b = document.createElement("button");
        b.className = "btn"; b.textContent = "Otra vuelta";
        b.addEventListener("click", function () { armarMazo(); render(); });
        root.appendChild(b);
        return;
      }
      render();
    }

    armarMazo();
    render();
  };
})();
