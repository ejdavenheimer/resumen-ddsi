/* =====================================================================
   DDSI — arranque, navegación y routing
   El menú lateral se arma agrupando por el campo `group` de cada sección,
   en el mismo orden en que se incluyen los <script> de js/content/.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;
  const SITE = "DDSI · UTN.BA";
  const navEl = document.getElementById("nav");
  const contentEl = document.getElementById("content");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");
  const progress = document.getElementById("progressTop");
  const searchEl = document.getElementById("navSearch");
  const themeBtn = document.getElementById("themeBtn");
  const progressChip = document.getElementById("progressChip");

  /* ===================== NAVEGACIÓN ===================== */
  function grupos() {
    const orden = [];
    const mapa = {};
    APP.sections.forEach(function (s) {
      const g = s.group || "General";
      if (!mapa[g]) { mapa[g] = []; orden.push(g); }
      mapa[g].push(s);
    });
    return orden.map(function (g) { return { nombre: g, items: mapa[g] }; });
  }

  function buildNav() {
    navEl.innerHTML = "";
    grupos().forEach(function (grupo) {
      const wrap = document.createElement("div");
      wrap.className = "nav-group";
      if (grupo.nombre !== "—") {
        const t = document.createElement("div");
        t.className = "nav-group-title";
        t.textContent = grupo.nombre;
        wrap.appendChild(t);
      }
      grupo.items.forEach(function (s) {
        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = "#" + s.id;
        a.dataset.id = s.id;
        a.dataset.search = (s.title + " " + (s.keywords || []).join(" ") + " " + grupo.nombre).toLowerCase();
        a.innerHTML =
          '<span class="nav-dot" aria-hidden="true"></span>' +
          "<span>" + s.title + "</span>" +
          (s.tag ? '<span class="tag">' + s.tag + "</span>" : "");
        wrap.appendChild(a);
      });
      navEl.appendChild(wrap);
    });
    marcarVisitados();
  }

  function marcarVisitados() {
    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("visitado", APP.store.visitado(a.dataset.id));
    });
  }

  /* ===================== BUSCADOR ===================== */
  let tSearch = null;
  if (searchEl) {
    searchEl.addEventListener("input", function () {
      clearTimeout(tSearch);
      tSearch = setTimeout(filtrar, 180);
    });
    searchEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { searchEl.value = ""; filtrar(); }
      if (e.key === "Enter") {
        const first = navEl.querySelector(".nav-link:not(.oculto)");
        if (first) { location.hash = first.getAttribute("href"); searchEl.blur(); }
      }
    });
  }
  function filtrar() {
    const q = (searchEl.value || "").trim().toLowerCase();
    navEl.querySelectorAll(".nav-group").forEach(function (g) {
      let visibles = 0;
      g.querySelectorAll(".nav-link").forEach(function (a) {
        const hit = !q || a.dataset.search.indexOf(q) !== -1;
        a.classList.toggle("oculto", !hit);
        if (hit) visibles++;
      });
      g.classList.toggle("oculto", visibles === 0);
    });
    navEl.classList.toggle("buscando", !!q);
  }

  /* ===================== RENDER DE SECCIÓN ===================== */
  function renderSection(id) {
    const section = APP.find(id) || APP.sections[0];
    if (!section) return;

    contentEl.innerHTML = "";
    const container = document.createElement("div");
    container.className = "section-body";
    try {
      section.render(container);
    } catch (e) {
      container.innerHTML =
        '<div class="callout warn"><b>Error al renderizar esta sección.</b><br>' +
        (e && e.message) + "</div>";
      console.error(e);
    }
    contentEl.appendChild(container);

    // enlaces internos declarativos
    container.querySelectorAll("[data-go]").forEach(function (c) {
      c.style.cursor = "pointer";
      c.addEventListener("click", function (ev) {
        ev.preventDefault();
        APP.go(c.dataset.go);
      });
    });

    APP.highlight(container);
    APP.rerenderMermaid(container);

    if (section.id !== "inicio" && section.cuenta !== false) APP.store.visitar(section.id);

    document.querySelectorAll(".nav-link").forEach(function (a) {
      const isActive = a.dataset.id === section.id;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    marcarVisitados();
    pintarProgreso();
    pintarNavPie(container, section);

    window.scrollTo(0, 0);
    contentEl.scrollTop = 0;
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
    document.getElementById("menuBtn").setAttribute("aria-expanded", "false");

    document.title = section.title + " · " + SITE;
  }

  /* Anterior / siguiente al pie de cada página */
  function pintarNavPie(container, section) {
    const i = APP.sections.indexOf(section);
    if (i < 0) return;
    const prev = APP.sections[i - 1];
    const next = APP.sections[i + 1];
    if (!prev && !next) return;
    const pie = document.createElement("nav");
    pie.className = "pager";
    pie.setAttribute("aria-label", "Navegación entre secciones");
    pie.innerHTML =
      (prev ? '<a class="pager-btn prev" href="#' + prev.id + '"><span>← Anterior</span><b>' + prev.title + "</b></a>" : "<span></span>") +
      (next ? '<a class="pager-btn next" href="#' + next.id + '"><span>Siguiente →</span><b>' + next.title + "</b></a>" : "<span></span>");
    container.appendChild(pie);
  }

  /* ===================== PROGRESO ===================== */
  function pintarProgreso() {
    if (!progressChip) return;
    const p = APP.progreso();
    progressChip.innerHTML =
      '<div class="pc-bar"><i style="width:' + p.pct + '%"></i></div>' +
      '<span class="pc-txt">' + p.hechos + "/" + p.total + " temas · " + p.pct + "%</span>";
  }
  APP.store.onChange(function () { marcarVisitados(); pintarProgreso(); });

  /* ===================== TEMA ===================== */
  const ICONOS = { auto: "🌗", light: "☀️", dark: "🌙" };
  const NOMBRES = { auto: "Automático", light: "Claro", dark: "Oscuro" };
  function pintarTema() {
    const pref = APP.store.get().preferencias.tema || "auto";
    if (themeBtn) {
      themeBtn.textContent = ICONOS[pref];
      themeBtn.setAttribute("data-tip", "Tema: " + NOMBRES[pref]);
      themeBtn.setAttribute("aria-label", "Cambiar tema (actual: " + NOMBRES[pref] + ")");
    }
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () { APP.ciclarTema(); pintarTema(); });
  }

  /* ===================== ROUTING ===================== */
  function route() {
    const id = location.hash.replace(/^#/, "") || (APP.sections[0] && APP.sections[0].id);
    renderSection(id);
  }
  window.addEventListener("hashchange", route);
  APP.go = function (id) {
    if (location.hash.replace(/^#/, "") === id) route();
    else location.hash = "#" + id;
  };

  /* ===================== MENÚ MOBILE ===================== */
  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", function () {
    const open = sidebar.classList.toggle("open");
    backdrop.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  backdrop.addEventListener("click", function () {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("scroll", function () {
    const d = document.documentElement;
    const scrolled = d.scrollTop / (d.scrollHeight - d.clientHeight || 1);
    progress.style.width = Math.min(100, scrolled * 100) + "%";
  });

  /* Atajo: "/" enfoca el buscador */
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchEl &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "")) {
      e.preventDefault();
      if (searchEl) searchEl.focus();
    }
  });

  /* ===================== ARRANQUE ===================== */
  APP.configurarMermaid();
  buildNav();
  pintarTema();
  pintarProgreso();
  route();
})();
