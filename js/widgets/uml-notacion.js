/* =====================================================================
   SVGs de notación UML real que Mermaid no sabe dibujar:
   - símbolo de componente (rectángulo con las dos "pestañas")
   - interfaz provista (bolita / lollipop) y requerida (semicírculo / socket)
   - ensamble bola-socket (quién consume a quién)
   - nodo de despliegue (cubo 3D) con artefacto adentro
   Todos usan currentColor y variables de tema → se ven en claro y oscuro.
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;

  /* Símbolo de componente suelto */
  APP.svgComponente = function (nombre) {
    nombre = nombre || "Servicio";
    return (
      '<svg class="uml-svg" viewBox="0 0 220 100" role="img" aria-label="Símbolo de componente ' + nombre + '">' +
        '<rect x="45" y="18" width="150" height="64" rx="3" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="30" y="32" width="26" height="15" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="30" y="53" width="26" height="15" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="122" y="44" text-anchor="middle" fill="currentColor" font-size="11" font-style="italic">«component»</text>' +
        '<text x="122" y="64" text-anchor="middle" fill="currentColor" font-size="14" font-weight="700">' + APP.esc(nombre) + '</text>' +
      '</svg>'
    );
  };

  /* Ensamble bola-socket: A CONSUME (socket) ─ PROVEE (bola) B */
  APP.svgBallSocket = function (consumidor, proveedor, interfaz) {
    consumidor = consumidor || "Consumidor";
    proveedor = proveedor || "Proveedor";
    interfaz = interfaz || "IPago";
    return (
      '<svg class="uml-svg" viewBox="0 0 560 150" role="img" aria-label="Interfaz provista y requerida">' +
        // consumidor (izquierda)
        '<rect x="15" y="45" width="180" height="60" rx="3" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="4" y="58" width="22" height="13" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="4" y="79" width="22" height="13" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="105" y="72" text-anchor="middle" fill="currentColor" font-size="10" font-style="italic">«component»</text>' +
        '<text x="105" y="90" text-anchor="middle" fill="currentColor" font-size="12" font-weight="700">' + APP.esc(consumidor) + '</text>' +
        // stick del consumidor
        '<line x1="195" y1="75" x2="250" y2="75" stroke="currentColor" stroke-width="2"/>' +
        // socket (semicírculo abierto hacia la derecha) = interfaz REQUERIDA
        '<path d="M250 55 A20 20 0 0 0 250 95" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
        // bola (lollipop) = interfaz PROVISTA
        '<line x1="315" y1="75" x2="365" y2="75" stroke="currentColor" stroke-width="2"/>' +
        '<circle cx="268" cy="75" r="9" fill="var(--brand)" stroke="var(--brand)"/>' +
        '<line x1="277" y1="75" x2="315" y2="75" stroke="currentColor" stroke-width="2"/>' +
        // etiqueta interfaz
        '<text x="292" y="45" text-anchor="middle" fill="currentColor" font-size="11" font-style="italic">' + APP.esc(interfaz) + '</text>' +
        // proveedor (derecha)
        '<rect x="365" y="45" width="180" height="60" rx="3" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="354" y="58" width="22" height="13" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="354" y="79" width="22" height="13" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="455" y="72" text-anchor="middle" fill="currentColor" font-size="10" font-style="italic">«component»</text>' +
        '<text x="455" y="90" text-anchor="middle" fill="currentColor" font-size="12" font-weight="700">' + APP.esc(proveedor) + '</text>' +
        // leyendas
        '<text x="230" y="130" text-anchor="middle" fill="var(--ink-soft)" font-size="10.5">semicírculo = REQUERIDA (consume)</text>' +
        '<text x="345" y="130" text-anchor="middle" fill="var(--ink-soft)" font-size="10.5">bolita = PROVISTA (dispone)</text>' +
      '</svg>'
    );
  };

  /* Nodo de despliegue = cubo 3D con un artefacto adentro */
  APP.svgNodo = function (tipo, nombre, artefacto) {
    tipo = tipo || "device";
    nombre = nombre || "Servidor";
    artefacto = artefacto || "app.jar";
    return (
      '<svg class="uml-svg" viewBox="0 0 240 150" role="img" aria-label="Nodo de despliegue ' + nombre + '">' +
        // cara superior (paralelogramo)
        '<polygon points="30,40 60,15 220,15 190,40" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        // cara derecha
        '<polygon points="190,40 220,15 220,110 190,135" fill="var(--panel-soft)" stroke="currentColor" stroke-width="2"/>' +
        // cara frontal
        '<rect x="30" y="40" width="160" height="95" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="110" y="60" text-anchor="middle" fill="currentColor" font-size="10.5" font-style="italic">«' + APP.esc(tipo) + '»</text>' +
        '<text x="110" y="76" text-anchor="middle" fill="currentColor" font-size="12.5" font-weight="700">' + APP.esc(nombre) + '</text>' +
        // artefacto adentro (rectángulo con las pestañitas)
        '<rect x="55" y="90" width="110" height="34" rx="2" fill="var(--panel-2)" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="48" y="96" width="14" height="9" fill="var(--panel)" stroke="currentColor" stroke-width="1.5"/>' +
        '<rect x="48" y="109" width="14" height="9" fill="var(--panel)" stroke="currentColor" stroke-width="1.5"/>' +
        '<text x="112" y="103" text-anchor="middle" fill="currentColor" font-size="9" font-style="italic">«artifact»</text>' +
        '<text x="112" y="117" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">' + APP.esc(artefacto) + '</text>' +
      '</svg>'
    );
  };
})();
