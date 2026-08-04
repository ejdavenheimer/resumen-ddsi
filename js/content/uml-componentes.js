/* ============================================================
   Diagramas UML — Diagrama de Componentes
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "uml-componentes",
    title: "Diagrama de Componentes",
    tag: "📐",
    group: "Diagramas UML",
    resumen: "Las piezas de software y sus interfaces",
    keywords: ["diagrama de componentes", "componente", "interfaz provista", "requerida", "dependencia", "chupetin", "enchufe"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Diagramas UML</div>
          <h1>Diagrama de Componentes</h1>
          <p class="lead">Las piezas de software del sistema y cómo se conectan lógicamente.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Cuándo lo piden</div>
          <p>Cuando el enunciado dice “<i>elabore un diagrama de componentes</i>” (Libros Circulares, Plan 23), o cuando
          querés mostrar la <b>estructura lógica</b> de servicios y sus dependencias, sin importar dónde corren.</p>
        </div>

        <h2>Para qué sirve</h2>
        <p>Mostrar las <b>piezas de software</b> del sistema (servicios, módulos, subsistemas) y cómo dependen unas de
        otras. Es una vista <b>lógica</b>: no dice en qué máquina corre cada cosa (eso es el
        <a class="inline" data-go="uml-despliegue">diagrama de despliegue</a>).</p>

        <h2>Elementos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Cómo se dibuja</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Componente</b></td><td>Rectángulo con el ícono de componente o <code>&lt;&lt;component&gt;&gt;</code></td><td>Una pieza reemplazable. Ej: “Servicio de Reservas”, “Frontend Web”.</td></tr>
            <tr><td><b>Interfaz provista</b></td><td>El “chupetín” 🍭 (círculo con línea)</td><td>Lo que el componente <b>ofrece</b> a los demás.</td></tr>
            <tr><td><b>Interfaz requerida</b></td><td>El “enchufe” 🔌 (semicírculo)</td><td>Lo que el componente <b>necesita</b> de otro.</td></tr>
            <tr><td><b>Dependencia</b></td><td>Flecha punteada</td><td>Un componente usa a otro.</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <div class="callout-title">⚠️ La notación real (así se dibuja en el parcial)</div>
          <p>Un componente <b>no es un rectángulo común</b>: es un rectángulo con el <b>ícono de componente</b> (dos
          “pestañas” a la izquierda). Y las conexiones no son flechas cualquiera: se usa <b>bola-y-socket</b>.
          Mermaid no sabe dibujar esto, así que acá va la notación de verdad:</p>
        </div>

        <div class="uml-svg-wrap">
          <span class="cap">Símbolo de componente</span>
          ${APP.svgComponente("Facturación")}
        </div>

        <h3>Interfaz provista vs requerida (el círculo y el semicírculo)</h3>
        <p>Esta es la parte que más se olvida y que el enunciado necesita para mostrar <b>quién consume a quién</b>:</p>
        <div class="uml-svg-wrap">
          <span class="cap">El que <b>consume</b> el servicio ── el que lo <b>provee</b></span>
          ${APP.svgBallSocket("Facturación", "Pasarela de Pago", "IPago")}
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Símbolo</th><th>Se llama</th><th>Quién es</th></tr></thead>
          <tbody>
            <tr><td><b>Bolita ●──</b> (lollipop)</td><td>Interfaz <b>provista</b></td><td>El componente que <b>ofrece / dispone</b> el servicio o endpoint. Ej: la Pasarela de Pago provee <code>IPago</code>.</td></tr>
            <tr><td><b>Semicírculo ─( </b> (socket)</td><td>Interfaz <b>requerida</b></td><td>El componente que <b>consume / necesita</b> el servicio. Ej: Facturación requiere <code>IPago</code>.</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Cómo se lee:</b> el <b>semicírculo del que consume</b> abraza la <b>bolita del que provee</b>. Se lee
          “Facturación <b>requiere</b> IPago, que <b>provee</b> la Pasarela de Pago”. La bolita apunta al dueño del
          servicio/endpoint; el socket, al que lo usa.</p>
        </div>

        <p style="margin-top:1.4rem">Para ver la <b>topología</b> del sistema (qué componente depende de cuál) sirve un esquema
        como este —pero recordá que en papel cada caja lleva el ícono de componente y las conexiones son bola-socket:</p>
        ${APP.uml(`graph LR
    FE["Frontend Web"] --> GW["API Gateway"]
    GW --> S1["Servicio Ejemplares"]
    GW --> S2["Servicio Operaciones"]
    GW --> S3["Servicio Personas"]
    S2 -.->|requiere| S1
    S2 -.->|requiere| S3
    S3 -.->|requiere| REN["RENAPER (externo)"]
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style REN fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Topología (esquema, no la notación final)")}

        <div class="callout key">
          <div class="callout-title">✏️ Cómo dibujarlo rápido a mano</div>
          <ol>
            <li>Dibujá cada componente como un rectángulo con el estereotipo <code>&lt;&lt;component&gt;&gt;</code> arriba.</li>
            <li>Ordenálos por capas: frontend → gateway → servicios → externos.</li>
            <li>Conectá con flechas punteadas de dependencia (o chupetín/enchufe si tenés tiempo).</li>
            <li>Marcá los componentes <b>externos</b> (RENAPER, BookIA) con borde punteado o etiqueta.</li>
            <li><b>Tip:</b> asegurate de que estén <b>todos los servicios del enunciado</b> y todas las integraciones externas.</li>
          </ol>
        </div>

        <div class="callout info">
          <p><b>Componentes vs Despliegue:</b> el de componentes muestra <i>qué piezas hay y cómo se relacionan</i>;
          el de <a class="inline" data-go="uml-despliegue">despliegue</a> muestra <i>en qué nodos físicos corren</i>.
          Cuando el final pide “despliegue + componentes”, dibujás los nodos y adentro los componentes.</p>
        </div>
      `;
    },
  });
})();
