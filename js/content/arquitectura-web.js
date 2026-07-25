/* ============================================================
   Fundamentos — Arquitectura Web
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "arquitectura-web",
    title: "Arquitectura Web",
    tag: "🏗️",
    group: "Fundamentos",
    resumen: "Monolito, microservicios, gateway, caché, CDN",
    keywords: ["arquitectura", "microservicios", "monolito", "gateway", "bff", "balanceador", "cache", "cdn", "despliegue", "componentes", "escalabilidad"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Arquitectura Web</h1>
          <p class="lead">Cómo se organiza y se despliega un sistema al que se accede por la web.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Por qué este tema vale tantos puntos</div>
          <p>En todos los finales recientes de la cátedra el <b>Punto 1 es Arquitectura</b> y vale entre 35 y 45 puntos.
          Siempre pide lo mismo: un <b>diagrama de despliegue/componentes</b> y una justificación sobre cómo manejás
          demoras, picos de tráfico o múltiples canales de acceso. Si dominás esta página, tenés casi la mitad del final.</p>
        </div>

        <h2>Los tres bloques clásicos</h2>
        ${APP.uml(`graph LR
    U["👤 Usuario"] --> F["Frontend<br/>(SPA / server-rendered)"]
    F --> B["Backend<br/>(API REST)"]
    B --> D[("Base de datos")]
    style F fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style B fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style D fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Frontend · Backend · Base de datos")}

        <h2>Monolito vs Microservicios</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>🧱 Monolito</h4>
            <p>Un solo artefacto desplegable con todo adentro.</p>
            <p><b>✅ A favor:</b> simple de desarrollar y desplegar; transacciones ACID entre módulos; una sola base;
            debugging directo; menos infraestructura.</p>
            <p><b>❌ En contra:</b> escala en bloque (aunque sólo un módulo esté saturado); un deploy afecta todo;
            el código tiende a acoplarse con el tiempo.</p>
            <p><i>Plan 08 lo modela así.</i></p>
          </div>
          <div class="vs-b">
            <h4>🧩 Microservicios</h4>
            <p>Varios servicios chicos, autónomos, cada uno con su base de datos y su despliegue.</p>
            <p><b>✅ A favor:</b> escalado y despliegue independientes; equipos autónomos; una falla se puede aislar;
            libertad de stack por servicio.</p>
            <p><b>❌ En contra:</b> complejidad operativa (observabilidad, tracing); consistencia eventual; latencia de red;
            transacciones distribuidas.</p>
            <p><i>Plan 23 lo modela así: un diagrama por servicio.</i></p>
          </div>
        </div>
        <div class="callout warn">
          <p><b>Regla de oro para justificar:</b> nunca digas “microservicios porque es lo moderno”. Justificá con lo que
          dice el enunciado: “el Servicio II tiene picos de carga muy superiores al resto y necesita escalar por separado”,
          “el motor de IA tiene un ciclo de vida y un stack distinto”, “el enunciado plantea equipos separados por servicio”.</p>
        </div>

        <h2>Componentes de infraestructura que tenés que saber nombrar</h2>

        <h3>API Gateway</h3>
        <p>Puerta de entrada <b>única</b> a un sistema de microservicios. Rutea al servicio que corresponde y centraliza
        preocupaciones transversales: autenticación, rate limiting, logging, versionado, CORS.</p>
        <p>Conceptualmente es un <a class="inline" data-go="facade">Facade</a> a nivel arquitectura: un punto de entrada
        simple que esconde la complejidad de adentro.</p>

        <h3>BFF — Backend For Frontend</h3>
        <p>Un backend por <b>canal</b> (uno para web, otro para mobile) que compone las respuestas que ese canal necesita.</p>
        <div class="callout tip">
          <div class="callout-title">✅ Frase de final</div>
          <p>Cuando el enunciado dice <i>“se prevé incorporar una aplicación mobile […] y los contratos de los microservicios
          no deben cambiar por necesidades de las interfaces gráficas”</i> (TurnoÁgil, La Scalo), la respuesta esperada es
          <b>API Gateway + BFF por canal</b>, con la lógica de negocio quedándose en los servicios y sólo la
          <b>composición y adaptación de la respuesta</b> en el BFF.</p>
        </div>

        <h3>Balanceador de carga</h3>
        <p>Distribuye las peticiones entre varias instancias del mismo servicio. Habilita el <b>escalado horizontal</b>
        (agregar máquinas) frente al <b>vertical</b> (una máquina más grande). Requiere servicios <b>stateless</b>.</p>

        <h3>Caché</h3>
        <p>Guardar resultados para no recalcularlos. Baja la latencia y descarga la base de datos.</p>
        <ul>
          <li><b>Dónde:</b> en el cliente (headers <code>Cache-Control</code>), en el gateway, o compartida entre instancias (Redis).</li>
          <li><b>El costo real es la invalidación:</b> ¿cuánto tiempo tolerás datos viejos? Definí un TTL o invalidá por evento.</li>
          <li><b>Cuándo aparece en los finales:</b> “el motor de recomendaciones puede recalcularse muchas veces con poco tiempo
          de diferencia y sin impacto sustantivo en los resultados” (Libros Circulares) → cachear el resultado con un TTL
          y/o <i>debounce</i> por usuario.</li>
        </ul>

        <h3>CDN</h3>
        <p>Red de servidores distribuidos geográficamente que sirve contenido estático (imágenes, videos, JS, CSS)
        desde el nodo más cercano al usuario.</p>
        <div class="callout tip">
          <p><b>Pregunta textual de La Scalo App:</b> <i>“¿qué componente arquitectónico propone para reducir el uso de recursos
          y transferencia del servidor de aplicación (almacenamiento y disponibilización) de videos?”</i> → <b>Object storage
          (S3 o similar) + CDN</b>. El servidor de aplicación nunca sirve el video: sólo entrega una URL firmada.</p>
        </div>

        <h3>Message Broker</h3>
        <p>Intermediario para comunicación asincrónica entre servicios. Ver <a class="inline" data-go="broker">Patrones de comunicación y Broker</a>.</p>

        <h3>Object storage</h3>
        <p>Almacenamiento de archivos (fotos, videos, PDFs) fuera de la base de datos. <b>Nunca guardes binarios grandes
        en una tabla relacional:</b> guardá la URL o la clave del objeto.</p>

        <h2>Diagrama de despliegue típico — 3 capas</h2>
        ${APP.uml(`graph TB
    subgraph Cliente
      NAV["🌐 Navegador"]
    end
    subgraph "Nodo: Servidor Web"
      LB["⚖️ Balanceador"]
      APP1["App instancia 1"]
      APP2["App instancia 2"]
    end
    subgraph "Nodo: Datos"
      DB[("PostgreSQL")]
      CACHE[("Redis · caché")]
    end
    NAV -->|HTTPS| LB
    LB --> APP1
    LB --> APP2
    APP1 --> DB
    APP2 --> DB
    APP1 --> CACHE
    APP2 --> CACHE`, "Despliegue de 3 capas con escalado horizontal")}

        <h2>Diagrama típico — microservicios con gateway y broker</h2>
        <p>Este es, con distintos nombres, el diagrama que piden los finales de ProtegePro, TurnoÁgil, Talentia y La Scalo:</p>
        ${APP.uml(`graph TB
    WEB["🌐 Web"] --> GW
    MOB["📱 Mobile"] --> GW
    GW["🚪 API Gateway<br/>autenticación · ruteo · rate limit"]
    GW --> S1["Servicio I<br/>Gestión"]
    GW --> S4["Servicio IV<br/>Orquestador del caso de uso"]
    S4 --> S2["Servicio II<br/>Motor de cálculo"]
    S4 -->|publica| BRK["📨 Message Broker<br/>(RabbitMQ)"]
    BRK -->|consume| S3["Servicio III<br/>Validación con IA"]
    S3 -->|HTTPS| EXT["🤖 API externa de IA<br/>(puede tardar minutos)"]
    S3 -->|publica resultado| BRK
    BRK -->|consume| S4
    S1 --> DB1[("DB I")]
    S2 --> DB2[("DB II")]
    S3 --> DB3[("DB III")]
    S4 --> DB4[("DB IV")]
    IDM["🔐 IDM / Keycloak"] -.-> GW
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style BRK fill:#fffbeb,stroke:#b45309,color:#0f172a
    style EXT fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Microservicios: gateway, broker e integración lenta")}

        <div class="callout key">
          <div class="callout-title">🔑 Los tres movimientos que resuelven casi cualquier punto de arquitectura</div>
          <ol>
            <li><b>¿Hay un servicio externo lento?</b> → sacalo del camino sincrónico: el usuario recibe <code>202 Accepted</code>
            con un identificador, el trabajo se encola y el resultado llega por notificación, webhook o polling.</li>
            <li><b>¿Hay picos de tráfico?</b> → cola que amortigua + escalado horizontal de los consumidores + balanceador
            adelante + caché de lecturas.</li>
            <li><b>¿Hay múltiples canales (web + mobile)?</b> → API Gateway + BFF, sin tocar los contratos de los servicios.</li>
          </ol>
        </div>

        <h2>Cómo se dibuja en UML</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Diagrama</th><th>Qué muestra</th><th>Elementos</th></tr></thead>
          <tbody>
            <tr><td>De componentes</td><td>Las piezas lógicas del software y sus interfaces</td><td>Componentes, interfaces provistas/requeridas, dependencias</td></tr>
            <tr><td>De despliegue</td><td>En qué <b>nodos</b> físicos/virtuales corre cada componente</td><td>Nodos (servidores, contenedores), artefactos, protocolos en las conexiones</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <div class="callout-title">⚠️ Errores que se cobran</div>
          <ul>
            <li>Dibujar cajas sin <b>etiquetar el protocolo</b> de cada flecha (HTTPS, AMQP, JDBC).</li>
            <li>No mostrar los <b>sistemas externos</b> que menciona el enunciado (RENAPER, BookIA, la API de clima).</li>
            <li>Poner una sola base compartida entre microservicios (mata la autonomía; si lo hacés, justificá por qué).</li>
            <li>Olvidarse del componente de <b>seguridad</b> (IDM/gateway) cuando el enunciado habla de usuarios y roles.</li>
            <li>No indicar <b>qué es sincrónico y qué es asincrónico</b>: es justo lo que suelen preguntar en el punto B o C.</li>
          </ul>
        </div>

        <h2>Atributos de calidad (ISO 25010)</h2>
        <p>Son los requerimientos <b>no funcionales</b> y son la entrada principal de la arquitectura.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Atributo</th><th>Cómo suena en un enunciado</th><th>Con qué se resuelve</th></tr></thead>
          <tbody>
            <tr><td>Disponibilidad</td><td>“como máximo 10 horas caído al año”, “SLA”</td><td>Redundancia, balanceador, health checks, réplicas</td></tr>
            <tr><td>Performance / eficiencia</td><td>“responder en menos de 2 segundos”</td><td>Caché, índices, async, CDN</td></tr>
            <tr><td>Escalabilidad</td><td>“picos masivos de tráfico”, “miles de usuarios simultáneos”</td><td>Stateless + escalado horizontal + colas</td></tr>
            <tr><td>Mantenibilidad</td><td>“agregar funcionalidad en menos de 20 horas”</td><td>SOLID, patrones, bajo acoplamiento</td></tr>
            <tr><td>Seguridad</td><td>“hashear contraseñas con SHA-2”, “datos confidenciales”</td><td>Ver <a class="inline" data-go="seguridad">Seguridad</a></td></tr>
            <tr><td>Usabilidad</td><td>“el usuario no debe quedar esperando”</td><td>Async con feedback de progreso</td></tr>
            <tr><td>Interoperabilidad</td><td>“integrarse con el sistema X”</td><td>APIs REST, adapters, formatos estándar</td></tr>
          </tbody>
        </table></div>
        <div class="callout info">
          <p><b>Todo atributo de calidad tiene un <i>trade-off</i>.</b> Más disponibilidad cuesta plata (redundancia).
          Más consistencia cuesta disponibilidad (teorema CAP). Más seguridad cuesta usabilidad. En el parcial, nombrar
          el trade-off suma: “elijo consistencia eventual porque priorizo disponibilidad ante picos”.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="awQuiz"></div>
      `;

      APP.quiz(el.querySelector("#awQuiz"), [
        { n: 1, topic: "Componentes", type: "mc", q: "“Se desea agregar un servicio de videos de entrenamientos. ¿Qué componente propone para reducir el uso de recursos y transferencia del servidor de aplicación?”", options: [
          { t: "Object storage (S3) + CDN: el servidor sólo entrega URLs, nunca el binario", ok: true },
          { t: "Guardar los videos como BLOB en la base relacional", ok: false },
          { t: "Un balanceador de carga adicional", ok: false },
          { t: "Un message broker", ok: false },
        ], explain: "Los binarios grandes nunca van en la base relacional (infla backups, mata la performance). El CDN además sirve el contenido desde el nodo más cercano al usuario." },
        { n: 2, topic: "Escalabilidad", type: "mc", q: "El enunciado dice que se esperan picos de tráfico porque los seguros se contratan en eventos masivos. ¿Cuál es la respuesta más completa?", options: [
          { t: "Cola de mensajes para amortiguar + servicios stateless detrás de un balanceador + escalado horizontal de los consumidores", ok: true },
          { t: "Un servidor más grande (escalado vertical)", ok: false },
          { t: "Aumentar el timeout de las peticiones HTTP", ok: false },
        ], explain: "El escalado vertical tiene techo y no ayuda ante un pico repentino. La cola desacopla la recepción del procesamiento: aceptás rápido y procesás al ritmo que puedas." },
        { n: 3, topic: "Frontend", type: "mc", q: "“Se prevé sumar una app mobile, no hay equipo mobile, y los contratos de los microservicios no deben cambiar por necesidades de la UI.” ¿Qué proponés?", options: [
          { t: "API Gateway + un BFF por canal, que sólo compone y adapta respuestas", ok: true },
          { t: "Que cada microservicio agregue endpoints específicos para mobile", ok: false },
          { t: "Que la app mobile llame directo a cada microservicio", ok: false },
        ], explain: "La segunda opción es justo lo que el enunciado prohíbe (cambiar contratos por la UI). La tercera acopla el cliente a la topología interna y multiplica las llamadas de red." },
        { n: 4, topic: "Diagramas", type: "mc", q: "¿Cuál es la diferencia entre un diagrama de componentes y uno de despliegue?", options: [
          { t: "Componentes muestra las piezas lógicas y sus interfaces; despliegue muestra en qué nodos físicos corre cada una", ok: true },
          { t: "Son sinónimos", ok: false },
          { t: "Componentes es de UML y despliegue no", ok: false },
        ], explain: "Cuando el final pide “despliegue + componentes”, dibujá los nodos (servidores/contenedores) y adentro los componentes que corren en cada uno, etiquetando los protocolos." },
        { n: 5, topic: "Atributos de calidad", type: "match", q: "Uní cada requerimiento con su atributo de calidad (pregunta textual del parcial 2023):", pairs: [
          { l: "“El SLA permite que el sistema esté caído como máximo 10 horas al año”", r: "<b>Disponibilidad</b> (99,89% de uptime)" },
          { l: "“Las contraseñas deben hashearse mediante SHA-2”", r: "<b>Seguridad</b> (confidencialidad)" },
          { l: "“Se debe agregar funcionalidad con facilidad en menos de 20 horas”", r: "<b>Mantenibilidad / Modificabilidad</b>" },
          { l: "“El sistema debe soportar 10.000 usuarios simultáneos”", r: "<b>Escalabilidad</b> (y performance)" },
        ] },
        { n: 6, topic: "Microservicios", type: "multi", q: "¿Qué costos reales trae adoptar microservicios? (marcá todos los que correspondan)", options: [
          { t: "Consistencia eventual: se pierden las transacciones ACID entre servicios", ok: true },
          { t: "Complejidad operativa: hay que resolver observabilidad, tracing y despliegues", ok: true },
          { t: "Latencia de red entre servicios que antes era una llamada en memoria", ok: true },
          { t: "Imposibilidad de escalar horizontalmente", ok: false },
        ], explain: "El escalado horizontal es justamente una <i>ventaja</i> de los microservicios. Los otros tres son los costos que hay que nombrar cuando justificás la decisión." },
      ]);
    },
  });
})();
