/* =====================================================================
   DDSI — núcleo
   Registro global de secciones + helpers de DOM + estado persistido.
   Sin módulos ES ni fetch: funciona abriendo index.html con doble clic.
   ===================================================================== */
(function () {
  "use strict";

  const APP = (window.APP = window.APP || {});
  APP.title = "DDSI · UTN.BA";
  APP.sections = APP.sections || [];   // [{id, title, tag, group, keywords, render(el)}]

  /* ---------- Registro de secciones ---------- */
  APP.register = function (section) {
    APP.sections.push(section);
  };
  APP.find = function (id) {
    return APP.sections.find((s) => s.id === id);
  };

  /* ---------- h('div.clase#id', {attr:val}, [hijos | string]) ---------- */
  function h(tag, attrs, children) {
    let id = null;
    const classes = [];
    const parts = tag.match(/[.#][\w-]+/g) || [];
    const name = (tag.match(/^[a-zA-Z0-9]+/) || ["div"])[0];
    parts.forEach((p) => {
      if (p[0] === ".") classes.push(p.slice(1));
      else id = p.slice(1);
    });
    const el = document.createElement(name);
    if (id) el.id = id;
    if (classes.length) el.className = classes.join(" ");
    if (attrs && typeof attrs === "object" && !Array.isArray(attrs) && !(attrs instanceof Node)) {
      Object.keys(attrs).forEach((k) => {
        if (k === "html") el.innerHTML = attrs[k];
        else if (k === "text") el.textContent = attrs[k];
        else if (k.startsWith("on") && typeof attrs[k] === "function") el.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
      });
    } else {
      children = attrs;
    }
    appendChildren(el, children);
    return el;
  }
  function appendChildren(el, children) {
    if (children == null) return;
    if (!Array.isArray(children)) children = [children];
    children.forEach((c) => {
      if (c == null || c === false) return;
      if (typeof c === "string" || typeof c === "number") el.appendChild(document.createTextNode(String(c)));
      else el.appendChild(c);
    });
  }
  APP.h = h;

  /* ---------- Escapes ---------- */
  APP.esc = function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };
  APP.escAttr = function (s) {
    return APP.esc(s).replace(/"/g, "&quot;");
  };

  /* =====================================================================
     ESTADO PERSISTIDO (localStorage)
     ===================================================================== */
  const KEY = "ddsi.estado.v1";
  const DEFAULT_STATE = {
    temasVisitados: [],
    ejercicios: {},        // { detector: {"3": true}, "solid-smell": {...} }
    flashcards: {},        // { "adapter": "sabida" | "aprendiendo" | "nueva" }
    simulacros: [],        // [{fecha, final, score}]
    preferencias: { tema: "auto" },
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  const state = load();
  const listeners = [];

  const store = {
    get: function () { return state; },
    save: function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado */ }
      listeners.forEach((fn) => { try { fn(state); } catch (e) { console.error(e); } });
    },
    onChange: function (fn) { listeners.push(fn); },

    visitar: function (id) {
      if (state.temasVisitados.indexOf(id) === -1) {
        state.temasVisitados.push(id);
        store.save();
      }
    },
    visitado: function (id) { return state.temasVisitados.indexOf(id) !== -1; },

    marcarEjercicio: function (set, id, ok) {
      state.ejercicios[set] = state.ejercicios[set] || {};
      state.ejercicios[set][String(id)] = !!ok;
      store.save();
    },
    ejercicio: function (set, id) {
      return state.ejercicios[set] && state.ejercicios[set][String(id)];
    },
    ejerciciosDe: function (set) { return state.ejercicios[set] || {}; },

    flashcard: function (id, caja) {
      if (caja === undefined) return state.flashcards[id] || "nueva";
      state.flashcards[id] = caja;
      store.save();
    },

    guardarSimulacro: function (reg) {
      state.simulacros.push(reg);
      store.save();
    },

    reset: function () {
      const pref = state.preferencias;
      Object.assign(state, JSON.parse(JSON.stringify(DEFAULT_STATE)));
      state.preferencias = pref;
      store.save();
    },
  };
  APP.store = store;

  /* Temas que cuentan para la barra de progreso (se completa desde app.js) */
  APP.temasContables = function () {
    return APP.sections.filter((s) => s.cuenta !== false && s.id !== "inicio").map((s) => s.id);
  };
  APP.progreso = function () {
    const total = APP.temasContables();
    const hechos = total.filter((id) => store.visitado(id));
    return { total: total.length, hechos: hechos.length, pct: total.length ? Math.round((hechos.length / total.length) * 100) : 0 };
  };

  /* =====================================================================
     TEMA CLARO / OSCURO
     ===================================================================== */
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function temaEfectivo() {
    const pref = state.preferencias.tema || "auto";
    if (pref === "auto") return media && media.matches ? "dark" : "light";
    return pref;
  }
  function aplicarTema() {
    const t = temaEfectivo();
    document.documentElement.setAttribute("data-theme", t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#0b1220" : "#a4133c");
    if (window.mermaid) configurarMermaid();
    APP.rerenderMermaid();
  }
  APP.temaEfectivo = temaEfectivo;
  APP.aplicarTema = aplicarTema;
  APP.ciclarTema = function () {
    const orden = ["auto", "light", "dark"];
    const i = orden.indexOf(state.preferencias.tema || "auto");
    state.preferencias.tema = orden[(i + 1) % orden.length];
    store.save();
    aplicarTema();
    return state.preferencias.tema;
  };
  if (media && media.addEventListener) {
    media.addEventListener("change", function () {
      if ((state.preferencias.tema || "auto") === "auto") aplicarTema();
    });
  }
  document.documentElement.setAttribute("data-theme", temaEfectivo());

  /* =====================================================================
     BLOQUES DE CÓDIGO
     APP.code(fuente, {lang, label, variant:'bad'|'good'|'', collapse, summary})
     El parcial es ESCRITO: los bloques Java se colapsan por defecto en un
     <details>, con una aclaración. Pasá collapse:false para dejarlo abierto
     (pseudocódigo de respuesta modelo, etc.). Los lang no-java no colapsan.
     ===================================================================== */
  APP.code = function (src, opts) {
    opts = opts || {};
    const lang = opts.lang || "java";
    const variant = opts.variant || "";
    const label = opts.label || (variant === "bad" ? "❌ Sin el patrón" : variant === "good" ? "✅ Con el patrón" : "");
    const clean = String(src).replace(/^\n/, "").replace(/\s+$/, "");
    const bloque =
      '<div class="code-block ' + variant + '">' +
      '<div class="code-head"><span class="code-label">' + label + "</span>" +
      '<button class="code-copy" type="button" aria-label="Copiar código">Copiar</button></div>' +
      '<pre class="code-pre"><code class="language-' + lang + '">' + APP.esc(clean) + "</code></pre>" +
      "</div>";

    const collapse = opts.collapse !== undefined ? opts.collapse : lang === "java";
    if (!collapse) return bloque;
    return (
      '<details class="code-details">' +
      "<summary>💻 " + (opts.summary || (label ? label + " — ver implementación en Java (opcional)" : "Ver implementación en Java (opcional)")) + "</summary>" +
      '<p class="code-aviso">✍️ El parcial es <b>escrito</b>: no vas a tener que tipear esto. Está acá para que entiendas cómo funciona el patrón por dentro.</p>' +
      bloque +
      "</details>"
    );
  };

  document.addEventListener("click", function (e) {
    const btn = e.target.closest && e.target.closest(".code-copy");
    if (!btn) return;
    const block = btn.closest(".code-block");
    const code = block && block.querySelector("code");
    if (!code) return;
    const txt = code.textContent;
    const done = function () {
      const prev = btn.textContent;
      btn.textContent = "¡Copiado!";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = prev; btn.classList.remove("ok"); }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (err) {}
      document.body.removeChild(ta);
    }
  });

  /* =====================================================================
     MERMAID
     APP.uml(definicion, titulo?) → HTML de un diagrama
     ===================================================================== */
  function configurarMermaid() {
    if (!window.mermaid) return;
    const dark = temaEfectivo() === "dark";
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
      themeVariables: dark
        ? {
            background: "#111a2e", primaryColor: "#1e293b", primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#f472b6", lineColor: "#94a3b8", secondaryColor: "#243044",
            tertiaryColor: "#1b2438", textColor: "#e2e8f0",
            classText: "#e2e8f0", nodeTextColor: "#e2e8f0",
            actorBkg: "#243044", actorTextColor: "#e2e8f0", actorBorder: "#f472b6",
            signalColor: "#cbd5e1", signalTextColor: "#e2e8f0",
            noteBkgColor: "#3f2c1d", noteTextColor: "#fde68a", noteBorderColor: "#b45309",
            labelBoxBkgColor: "#243044", labelTextColor: "#e2e8f0",
            sequenceNumberColor: "#0f172a",
          }
        : {
            background: "#ffffff", primaryColor: "#ffe4e9", primaryTextColor: "#0f172a",
            primaryBorderColor: "#a4133c", lineColor: "#64748b", secondaryColor: "#f1f5f9",
            tertiaryColor: "#f8fafc", textColor: "#0f172a",
            actorBkg: "#ffe4e9", actorTextColor: "#0f172a", actorBorder: "#a4133c",
            noteBkgColor: "#fffbeb", noteTextColor: "#78350f", noteBorderColor: "#f59e0b",
          },
    });
  }
  APP.configurarMermaid = configurarMermaid;

  APP.uml = function (def, titulo) {
    const clean = String(def).replace(/^\n/, "").replace(/\s+$/, "");
    return (
      '<figure class="uml">' +
      (titulo ? '<figcaption class="uml-cap">' + titulo + "</figcaption>" : "") +
      '<pre class="mermaid" data-graph="' + APP.escAttr(clean) + '">' + APP.esc(clean) + "</pre>" +
      '<button class="uml-copy" type="button">Copiar código Mermaid</button>' +
      "</figure>"
    );
  };

  APP.rerenderMermaid = function (root) {
    if (!window.mermaid) return;
    const scope = root || document;
    const nodes = Array.prototype.slice.call(scope.querySelectorAll("pre.mermaid"));
    if (!nodes.length) return;
    nodes.forEach(function (n, i) {
      const g = n.getAttribute("data-graph");
      if (g != null) { n.textContent = g; n.removeAttribute("data-processed"); }
      n.id = n.id || "mmd-" + Date.now() + "-" + i;
    });
    try {
      const r = window.mermaid.run({ nodes: nodes, suppressErrors: true });
      if (r && r.catch) r.catch(function () {});
    } catch (e) { console.warn("Mermaid:", e); }
  };

  document.addEventListener("click", function (e) {
    const btn = e.target.closest && e.target.closest(".uml-copy");
    if (!btn) return;
    const fig = btn.closest(".uml");
    const pre = fig && fig.querySelector("pre.mermaid");
    if (!pre) return;
    const txt = pre.getAttribute("data-graph") || pre.textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(txt);
    const prev = btn.textContent;
    btn.textContent = "¡Copiado!";
    setTimeout(function () { btn.textContent = prev; }, 1400);
  });

  /* ---------- Prism ---------- */
  APP.highlight = function (root) {
    if (window.Prism && window.Prism.highlightAllUnder) {
      try { window.Prism.highlightAllUnder(root || document); } catch (e) {}
    }
  };

  /* ---------- Utilidades varias ---------- */
  APP.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  APP.hoy = function () { return new Date().toISOString().slice(0, 10); };
})();
