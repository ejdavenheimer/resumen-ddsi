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

  /* Cola de mensajes: productor → [ msgs FIFO ] → consumidor, dentro del broker */
  APP.svgCola = function (cola, productor, consumidor) {
    cola = cola || "facturas";
    productor = productor || "Tienda";
    consumidor = consumidor || "Facturación";
    return (
      '<svg class="uml-svg" viewBox="0 0 620 190" role="img" aria-label="Cola de mensajes ' + cola + '">' +
        // marco del broker
        '<rect x="150" y="12" width="320" height="120" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4"/>' +
        '<text x="310" y="30" text-anchor="middle" fill="currentColor" font-size="11" font-style="italic">«broker» RabbitMQ</text>' +
        // productor
        '<rect x="10" y="55" width="120" height="48" rx="3" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="70" y="78" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">' + APP.esc(productor) + '</text>' +
        '<text x="70" y="93" text-anchor="middle" fill="var(--ink-soft)" font-size="9.5">productor</text>' +
        // la cola: celdas FIFO
        '<rect x="175" y="52" width="270" height="52" rx="3" fill="var(--panel-2)" stroke="currentColor" stroke-width="2"/>' +
        '<line x1="242" y1="52" x2="242" y2="104" stroke="currentColor" stroke-width="1.2"/>' +
        '<line x1="309" y1="52" x2="309" y2="104" stroke="currentColor" stroke-width="1.2"/>' +
        '<line x1="376" y1="52" x2="376" y2="104" stroke="currentColor" stroke-width="1.2"/>' +
        '<text x="208" y="83" text-anchor="middle" fill="currentColor" font-size="11">#103</text>' +
        '<text x="275" y="83" text-anchor="middle" fill="currentColor" font-size="11">#102</text>' +
        '<text x="342" y="83" text-anchor="middle" fill="currentColor" font-size="11">#101</text>' +
        '<text x="410" y="83" text-anchor="middle" fill="var(--ink-soft)" font-size="10">sale</text>' +
        '<text x="310" y="122" text-anchor="middle" fill="currentColor" font-size="10.5" font-weight="600">cola "' + APP.esc(cola) + '" · FIFO</text>' +
        // consumidor
        '<rect x="490" y="55" width="120" height="48" rx="3" fill="var(--panel)" stroke="currentColor" stroke-width="2"/>' +
        '<text x="550" y="78" text-anchor="middle" fill="currentColor" font-size="11.5" font-weight="700">' + APP.esc(consumidor) + '</text>' +
        '<text x="550" y="93" text-anchor="middle" fill="var(--ink-soft)" font-size="9.5">consumidor</text>' +
        // flechas
        '<defs><marker id="flc" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">' +
          '<polygon points="0 0, 9 3.5, 0 7" fill="currentColor"/></marker></defs>' +
        '<line x1="130" y1="79" x2="172" y2="79" stroke="currentColor" stroke-width="2" marker-end="url(#flc)"/>' +
        '<text x="151" y="70" text-anchor="middle" fill="var(--ink-soft)" font-size="9">publica</text>' +
        '<line x1="448" y1="79" x2="487" y2="79" stroke="currentColor" stroke-width="2" marker-end="url(#flc)"/>' +
        '<text x="468" y="70" text-anchor="middle" fill="var(--ink-soft)" font-size="9">consume</text>' +
        // ACK de vuelta
        '<path d="M550 105 L550 152 L310 152" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 3" marker-end="url(#flc)"/>' +
        '<text x="430" y="166" text-anchor="middle" fill="var(--ink-soft)" font-size="9.5">ACK · recién ahí el mensaje se borra</text>' +
        '<text x="310" y="182" text-anchor="middle" fill="var(--ink-soft)" font-size="9.5">protocolo: AMQP (5672)</text>' +
      '</svg>'
    );
  };
})();
