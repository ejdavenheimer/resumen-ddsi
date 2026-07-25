/* ============================================================
   Diagramas UML — Diagrama de Despliegue
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "uml-despliegue",
    title: "Diagrama de Despliegue",
    tag: "📐",
    group: "Diagramas UML",
    resumen: "Dónde corre físicamente cada cosa",
    keywords: ["diagrama de despliegue", "deployment", "nodo", "artefacto", "protocolo", "servidor", "contenedor", "cloud"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Diagramas UML</div>
          <h1>Diagrama de Despliegue</h1>
          <p class="lead">Dónde corre físicamente cada cosa: qué servidor, qué contenedor, qué nube.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 El más pedido en arquitectura</div>
          <p>ProtegePro: <i>“Realice un diagrama de arquitectura (despliegue + componentes)”</i>. La Scalo:
          <i>“Realice un diagrama de despliegue de la solución completa”</i>. Vale hasta 25 puntos en un solo punto.</p>
        </div>

        <h2>Para qué sirve</h2>
        <p>Mostrar en qué <b>nodos físicos</b> (servidores, contenedores, dispositivos) corre cada componente, y con qué
        protocolo se comunican. Es la vista de <b>infraestructura</b>.</p>

        <h2>Elementos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Cómo se dibuja</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Nodo</b></td><td>Cubo 3D</td><td>Hardware o entorno de ejecución: “Servidor de Aplicaciones”, “Cloud AWS”, “Dispositivo móvil”.</td></tr>
            <tr><td><b>Artefacto</b></td><td>Rectángulo dentro del nodo</td><td>Lo que se despliega: un <code>.jar</code>, un contenedor Docker, una imagen.</td></tr>
            <tr><td><b>Conexión</b></td><td>Línea entre nodos, <b>etiquetada con el protocolo</b></td><td>HTTP, TCP/IP, AMQP, JDBC.</td></tr>
          </tbody>
        </table></div>

        <h2>Ejemplo (Mermaid usa <code>graph</code> con subgrafos)</h2>
        ${APP.uml(`graph TB
    subgraph Cliente
        NAV["Navegador Web"]
        MOB["App Mobile"]
    end
    subgraph "Cloud (Kubernetes)"
        GW["API Gateway"]
        subgraph Servicios
            S1["Servicio Reservas"]
            S2["Servicio Cobertura"]
            S3["Servicio Validación"]
        end
        Q[("Message Broker")]
        DB[("Base de Datos")]
    end
    EXT["Motor Validación Médica — EXTERNO"]
    NAV -->|HTTPS| GW
    MOB -->|HTTPS| GW
    GW --> S1
    GW --> S2
    S1 -->|JDBC| DB
    S2 -->|JDBC| DB
    S1 -->|publica AMQP| Q
    Q -->|consume AMQP| S3
    S3 -->|HTTP| EXT
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a
    style EXT fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Despliegue de 3 capas + broker")}
        <div class="callout info">
          <p>Mermaid no tiene notación nativa de despliegue, así que se usa <code>graph</code> con <code>subgraph</code>
          para agrupar por nodo. En papel dibujás los cubos 3D; lo importante es que se entienda <b>qué corre dónde</b>
          y con <b>qué protocolo</b>.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">✏️ Cómo dibujarlo rápido a mano</div>
          <ol>
            <li>Dividí la hoja en zonas: <b>clientes arriba</b>, tu sistema en el medio, <b>externos abajo o al costado</b>.</li>
            <li>Dibujá cada nodo como un rectángulo (no hace falta el cubo 3D perfecto).</li>
            <li>Poné adentro qué artefacto corre ahí.</li>
            <li>Conectá con flechas <b>etiquetadas con el protocolo</b> (HTTPS, AMQP, JDBC). <b>Esto suma puntos.</b></li>
            <li>Marcá claramente qué es <b>externo</b> (borde punteado o etiqueta “EXTERNO”).</li>
          </ol>
        </div>

        <div class="callout tip">
          <div class="callout-title">✅ Lo que el corrector busca</div>
          <ul>
            <li>Que estén <b>todos los servicios</b> mencionados en el enunciado.</li>
            <li>Que los <b>externos</b> estén identificados como tales.</li>
            <li>Que las conexiones tengan <b>protocolo</b>.</li>
            <li>Que si hay <b>demora o picos de tráfico</b>, aparezca una cola o mecanismo asincrónico.</li>
            <li>Que haya <b>base de datos</b> donde corresponde (una por servicio en microservicios).</li>
            <li>Si el enunciado habla de <b>usuarios/roles</b>, que aparezca el componente de seguridad (IDM/gateway).</li>
          </ul>
        </div>

        <h2>🎮 ¿Qué componentes van en el diagrama?</h2>
        <p>Dado un enunciado, elegí qué componentes deben aparecer (hay distractores).</p>
        <div class="widget" id="depBox"></div>
      `;

      APP.elegirComponentes(el.querySelector("#depBox"), [
        {
          enunciado: "<b>ProtegePro.</b> Seguros on-demand. La IA de validación puede tardar más de un minuto y se esperan picos de tráfico en eventos masivos. El cobro lo hace otro sistema.",
          opciones: [
            { t: "API Gateway", ok: true },
            { t: "Message Broker / cola", ok: true, why: "por la demora de la IA y los picos" },
            { t: "Servicio de IA marcado como externo", ok: true },
            { t: "Object storage para las fotos", ok: true, why: "binarios fuera de la base" },
            { t: "Una base de datos por servicio", ok: true },
            { t: "Sistema de cobros propio", ok: false, why: "el enunciado dice que el cobro lo hace OTRO sistema: es externo, fuera de alcance" },
            { t: "Un único servidor monolítico sin colas", ok: false, why: "no soporta los picos ni la demora de la IA" },
          ],
          explicacion: "Lo distintivo: la cola para desacoplar la IA lenta, el object storage para las fotos, y marcar cobros e IA como externos.",
        },
        {
          enunciado: "<b>TurnoÁgil.</b> Se prevé sumar mobile sin equipo especializado; los contratos de los microservicios no deben cambiar por la UI. El motor de validación médica es externo y lento.",
          opciones: [
            { t: "API Gateway", ok: true },
            { t: "BFF (Backend For Frontend) por canal", ok: true, why: "para no cambiar los contratos por la UI" },
            { t: "IDM / proveedor de identidad", ok: true },
            { t: "Motor de validación médica (externo)", ok: true },
            { t: "Mecanismo asincrónico para la validación lenta", ok: true, why: "el motor tarda minutos" },
            { t: "Endpoints mobile específicos dentro de cada microservicio", ok: false, why: "es justo lo que el enunciado prohíbe" },
          ],
          explicacion: "El BFF resuelve los múltiples canales sin tocar los servicios, y hay que desacoplar la validación lenta.",
        },
        {
          enunciado: "<b>Consulta simple.</b> Un endpoint que devuelve el detalle de un producto por su código. Respuesta inmediata, sin integraciones externas.",
          opciones: [
            { t: "Controller + Service + Repository", ok: true },
            { t: "Una base de datos", ok: true },
            { t: "Caché (opcional, si se consulta mucho)", ok: true, why: "razonable para lecturas frecuentes" },
            { t: "Message broker", ok: false, why: "no hay nada asincrónico ni picos: sobra" },
            { t: "Object storage", ok: false, why: "no hay binarios grandes" },
            { t: "Sistema de IA", ok: false, why: "el enunciado no lo menciona" },
          ],
          explicacion: "No todo lleva broker ni componentes exóticos. Una lectura simple es controller → service → repository → base. Meter cosas de más también resta.",
        },
      ]);
    },
  });
})();
