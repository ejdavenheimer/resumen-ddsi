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
        <p>El chupetín de uno encaja en el enchufe de otro: así se lee que un componente <b>provee</b> lo que otro
        <b>requiere</b>.</p>

        ${APP.uml(`graph LR
    FE["&lt;&lt;component&gt;&gt;<br/>Frontend Web"] --> GW["&lt;&lt;component&gt;&gt;<br/>API Gateway"]
    GW --> S1["&lt;&lt;component&gt;&gt;<br/>Servicio Ejemplares"]
    GW --> S2["&lt;&lt;component&gt;&gt;<br/>Servicio Operaciones"]
    GW --> S3["&lt;&lt;component&gt;&gt;<br/>Servicio Personas"]
    S2 -.->|requiere| S1
    S2 -.->|requiere| S3
    S3 -.->|requiere| REN["&lt;&lt;component&gt;&gt;<br/>RENAPER (externo)"]
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style REN fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Componentes de Libros Circulares")}

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
