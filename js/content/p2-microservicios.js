/* ============================================================
   P2 · Microservicios: bounded context, patrones, saga
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-microservicios",
    title: "Microservicios y sus patrones",
    tag: "🧩",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Bounded Context, BD por servicio, Saga, Outbox, Circuit Breaker, Strangler",
    keywords: ["microservicios", "bounded context", "ddd", "base de datos por servicio", "saga", "compensacion", "outbox", "inbox", "idempotente", "circuit breaker", "retry", "api gateway", "service registry", "eureka", "discovery", "strangler", "nanoservicios", "teraservicios", "correlation id", "log aggregator", "eventos"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Microservicios</h1>
          <p class="lead">“<i>Considerando una arquitectura de microservicios, elabore un diagrama de componentes/despliegue</i>” aparece en casi todos los finales. Y la segunda pregunta siempre es <b>cómo se comunican</b> y <b>qué pasa si uno falla</b>.</p>
        </div>

        <h2>Bounded Context (el criterio para “cortar”)</h2>
        <div class="callout key">
          <ul>
            <li>Patrón central del <b>Diseño Dirigido por el Dominio (DDD)</b>.</li>
            <li>Divide un sistema grande en <b>contextos más pequeños</b>, cada uno con un <b>modelo interno consistente</b>.</li>
            <li><b>Un único modelo para todo el dominio genera contradicciones:</b> cada área usa su propio vocabulario.</li>
            <li>Un mismo concepto (Cliente, Producto, Factura) <b>puede tener modelos distintos en cada contexto</b>.</li>
            <li>Hay que definir los <b>límites</b> y el <b>mapa de contexto</b>: cómo se relacionan y traducen los conceptos.</li>
          </ul>
          <p class="mini"><b>Ejemplo para el parcial:</b> “Mascota” para Gestión es un registro con historial médico y
          preferencias; para IA y Alertas es sólo un id con un perfil de comportamiento; para Estadísticas es una fila de
          métricas agregadas. <b>Tres modelos distintos del mismo concepto</b> → tres contextos, tres servicios.</p>
        </div>

        <h2>¿Qué son los microservicios?</h2>
        <p>Un estilo arquitectónico: el sistema se construye como un <b>conjunto de servicios pequeños y autónomos</b>,
        cada uno ejecutándose <b>en su propio proceso</b>.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Característica</th><th>Qué significa</th></tr></thead>
          <tbody>
            <tr><td><b>Procesos independientes</b></td><td>Cada servicio se ejecuta en su propio proceso y se comunica con los demás mediante <b>mecanismos livianos</b>, a menudo una API REST</td></tr>
            <tr><td><b>Capacidades de negocio</b></td><td>Cada servicio se construye <b>alrededor de una capacidad de negocio</b> y se despliega de forma independiente, con herramientas <b>totalmente automatizadas</b></td></tr>
            <tr><td><b>Gestión descentralizada</b></td><td><b>Mínimo absoluto de gestión centralizada:</b> cada servicio puede estar escrito en otro lenguaje y usar diferentes tecnologías de almacenamiento</td></tr>
            <tr><td><b>Pequeños e independientes</b></td><td>Servicios <b>débilmente acoplados</b>; cada uno lo administra un <b>equipo pequeño</b></td></tr>
            <tr><td><b>Datos propios</b></td><td>Cada servicio <b>conserva sus datos</b> o estado externo</td></tr>
            <tr><td><b>APIs bien definidas</b></td><td>Los servicios se comunican <b>sólo a través de sus APIs</b></td></tr>
          </tbody>
        </table></div>
        <p class="mini"><b>Consideraciones de desarrollo:</b> un servicio accesible en red es la unidad mínima de
        despliegue (<b>un servicio por contenedor</b>); <b>una función de negocio por servicio</b> (SRP); comunicación por
        API REST y buses de mensajes, <b>sin comunicación implícita a través de una base compartida</b>; <b>CI/CD por
        servicio</b> (en un monolito todo sale a la velocidad de la parte más lenta); decisiones de <b>alta disponibilidad
        por servicio</b> (se escalan sólo los que lo necesitan).</p>

        <h2>¿Una base de datos por servicio?</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Principio</th><th>Qué implica</th></tr></thead>
          <tbody>
            <tr><td><b>Autoridad sobre los datos</b></td><td>Cada servicio es <b>dueño</b> de sus datos, tablas y reglas de negocio</td></tr>
            <tr><td><b>Encapsulamiento</b></td><td><b>No acceder directamente a las tablas internas</b> de otro servicio</td></tr>
            <tr><td><b>IDs independientes</b></td><td>Cada servicio administra los IDs de sus entidades, evitando acoplarse a mecanismos de generación ajenos</td></tr>
            <tr><td><b>Referencias externas</b></td><td>Almacenar IDs de entidades externas como <b>referencias lógicas</b></td></tr>
            <tr><td><b>No hay integridad referencial</b></td><td>Se pierde la garantía automática de <b>FK entre servicios</b>: las referencias deben <b>validarse a nivel de aplicación</b></td></tr>
            <tr><td><b>Transacciones</b></td><td><b>ACID dentro de cada servicio</b>; los flujos que abarcan varios servicios requieren coordinación a nivel de aplicación (<b>Saga</b>), con manejo de fallos y <b>consistencia eventual</b></td></tr>
          </tbody>
        </table></div>
        <p class="mini"><b>Separación física no obligatoria:</b> puede implementarse con <b>tablas privadas</b> por
        servicio, <b>un esquema por servicio</b> o un <b>servidor de base por servicio</b>. La exclusividad se asegura con
        un <b>usuario de base y permisos</b> por servicio.</p>

        <h3>¿Cómo acceder a datos de otros servicios?</h3>
        <div class="grid-3">
          <div class="card">
            <h3>A · Referencia + API</h3>
            <p>Patrón <b>API Composition</b>: guardar el <b>ID externo</b> y consultar al servicio propietario. Datos
            autoritativos y actualizados.</p>
            <p class="mini"><b>Trade-off:</b> latencia y <b>dependencia de disponibilidad</b>.</p>
          </div>
          <div class="card">
            <h3>B · Réplica local / Read Model</h3>
            <p>Replicar <b>únicamente los atributos necesarios</b>, sincronizando por <b>eventos (push)</b> o
            <b>polling (pull)</b>. Mayor autonomía y menor dependencia en runtime.</p>
            <p class="mini"><b>Trade-off:</b> <b>consistencia eventual</b> y gestión de la sincronización.</p>
          </div>
          <div class="card">
            <h3>C · Base compartida controlada</h3>
            <p><b>Excepción:</b> rompe el acceso sólo por API. Cada servicio es dueño exclusivo de sus tablas; se exponen
            datos mediante <b>vistas y permisos de lectura</b>, evitando escrituras sobre tablas ajenas.</p>
            <p class="mini"><b>Trade-off:</b> <b>mayor acoplamiento al esquema</b> y menor independencia evolutiva.</p>
          </div>
        </div>

        <h2>Componentes de infraestructura</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Componente</th><th>Qué problema resuelve</th><th>Ejemplos</th></tr></thead>
          <tbody>
            <tr><td><b>API Gateway</b> (patrón Fachada)</td><td><b>Punto único de entrada</b> para los clientes: enruta cada llamada al servicio que corresponde, puede <b>agregar respuestas</b> y centraliza autenticación, terminación SSL y balanceo</td><td>Spring Cloud Gateway, Kong, AWS API Gateway</td></tr>
            <tr><td><b>Service Registry y Discovery</b></td><td>Las instancias <b>cambian de ubicación</b> al escalar o fallar. El registro sabe <b>qué servicios existen y dónde están</b>, sin direcciones fijas</td><td>Netflix Eureka, Consul</td></tr>
            <tr><td><b>Administración de contenedores</b></td><td><b>Ubica</b> los servicios en los nodos, <b>detecta fallas</b> y <b>reequilibra</b> las instancias</td><td>Kubernetes, Docker Swarm</td></tr>
            <tr><td><b>Circuit Breaker</b></td><td>Evita esperar a un servicio caído y frena la <b>falla en cascada</b></td><td>Resilience4j, Hystrix (histórico)</td></tr>
            <tr><td><b>Observabilidad / Log Aggregator</b></td><td>Cada servicio envía sus registros a <b>un único lugar</b> para poder reconstruir un flujo</td><td>ELK, Grafana Loki</td></tr>
          </tbody>
        </table></div>

        <h3>Correlation ID y Log Aggregator</h3>
        <div class="callout key">
          <p>El <b>API Gateway genera un ID</b> (ej. <code>7f3a-91c2</code>) que <b>viaja en la cabecera de cada
          llamada</b>. Con el mismo ID, el <b>Log Aggregator</b> reúne los registros de todos los servicios en <b>una sola
          traza</b>.</p>
          <p><b>La pregunta:</b> “¿por qué tardó 2 segundos el pedido?”. <b>Sin</b> el ID hay que revisar los logs de cada
          servicio por separado; <b>con</b> el ID, la respuesta está en una línea: <i>Pagos</i>. →
          <a class="inline" data-go="p2-observabilidad">Observabilidad</a>.</p>
        </div>

        <h2>¿Cuándo usar microservicios?</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Conviene cuando hay…</h3>
            <ul>
              <li><b>Publicación frecuente:</b> aplicaciones grandes que requieren alta velocidad de publicación.</li>
              <li><b>Gran escalabilidad:</b> aplicaciones complejas que necesitan escalar mucho.</li>
              <li><b>Escalado dinámico:</b> picos de carga difíciles de predecir.</li>
              <li><b>Crecimiento sostenido:</b> funcionalidad que crece rápido y por mucho tiempo.</li>
              <li><b>Dominios complejos</b> o con muchos subdominios.</li>
              <li><b>Varios equipos pequeños</b> de desarrollo.</li>
            </ul>
          </div>
          <div class="card">
            <h3>⚠️ Los 8 desafíos</h3>
            <ol>
              <li><b>Complejidad:</b> cada servicio es simple, pero el sistema tiene <b>más partes en movimiento</b>.</li>
              <li><b>Desarrollo y pruebas:</b> refactorizar entre servicios y probar dependencias es difícil.</li>
              <li><b>Falta de gobernanza:</b> muchos lenguajes y frameworks complican el mantenimiento.</li>
              <li><b>Red y latencia:</b> las cadenas A→B→C <b>suman latencia</b>.</li>
              <li><b>Integridad de datos:</b> cada servicio es dueño de sus datos; la coherencia es un problema.</li>
              <li><b>Administración:</b> requiere cultura <b>DevOps</b> y registro correlacionado.</li>
              <li><b>Control de versiones:</b> actualizar un servicio no debe romper a los que dependen de él.</li>
              <li><b>Conocimientos del equipo:</b> ¿tiene la experiencia?</li>
            </ol>
          </div>
        </div>
        <div class="callout warn">
          <div class="callout-title">⚠️ Monolith First (Fowler, 2015) y el caso PedidosYa Plus</div>
          <p><b>No empezar un proyecto nuevo con microservicios</b> aunque se espere que crezca: los <b>límites son
          difíciles de acertar al inicio</b> y refactorizar entre servicios cuesta mucho más que dentro de un monolito;
          además hay un <b>costo operativo</b> y al principio no se sabe si el producto sirve.</p>
          <p><b>PedidosYa Plus:</b> empezó con <b>16 servicios</b> en el MVP (2022) y hoy tiene <b>12</b>. Una plataforma
          interna permitía crear un servicio en minutos, así que cada responsabilidad nueva terminó en una caja nueva.
          Costos que aparecieron: más latencia por salto, más puntos de falla, monitoreo más difícil y pruebas locales poco
          realistas. <b>El dato para citar:</b> “si cada servicio funciona el 99% del tiempo, una operación que pasa por
          tres funciona el 0,99³ ≈ <b>97%</b>. <b>Cada salto entre servicios resta.</b>”</p>
        </div>

        <h2>Migración y antipatrones</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Patrón Strangler (estrangulador)</h3>
            <p><b>Reingeniería gradual</b> de una aplicación monolítica hacia microservicios. Organiza la refactorización y
            permite <b>avanzar por partes</b>: un proxy/fachada delante del monolito va derivando, funcionalidad por
            funcionalidad, a los nuevos servicios, hasta “estrangularlo”.</p>
            <p><b>Adaptador de Microservicios:</b> adapta entre <b>dos APIs conceptualmente distintas</b>; por ejemplo,
            una API heredada o un servicio <b>SOAP</b> tradicional expuesto como <b>API RESTful</b> o mensajería liviana.</p>
          </div>
          <div class="card">
            <h3>Antipatrones</h3>
            <ul>
              <li><b>Nanoservicios</b> (demasiado chicos): servicios <b>excesivamente granulares</b>, donde la comunicación
              y el mantenimiento <b>superan su utilidad</b>. Ej.: <b>un servicio por tabla</b> exponiendo su CRUD.</li>
              <li><b>Teraservicios</b> (demasiado grandes): lo opuesto, un servicio de tipo monolítico; requieren 2 TB de
              memoria o más (todo debe residir en memoria). Costosos en la nube y poco populares.</li>
            </ul>
          </div>
        </div>

        <h2>Comunicación entre microservicios</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Sincrónica (solicitud/respuesta)</th><th>Asincrónica (mensaje/evento)</th></tr></thead>
          <tbody>
            <tr><td>✅</td><td>Simple de implementar y de seguir; <b>respuesta inmediata</b></td><td><b>Desacopla en el tiempo</b> (B puede no estar disponible); <b>absorbe picos</b>; un servicio caído no frena al resto</td></tr>
            <tr><td>❌</td><td><b>Ambos deben estar disponibles a la vez</b>; la latencia <b>se suma en cadena</b>; una falla puede <b>propagarse en cascada</b></td><td><b>Consistencia eventual</b>; flujo <b>más difícil de rastrear</b></td></tr>
            <tr><td>Ejemplos</td><td>REST sobre HTTP, gRPC</td><td>RabbitMQ, Apache Kafka</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Pregunta clave para decidir:</b> “<b>¿quien llama necesita la respuesta para poder continuar?</b> Si la
          respuesta es <b>no</b>, conviene la comunicación asincrónica.”</p>
        </div>

        <h3>Circuit Breaker y Retry</h3>
        <div class="grid-2">
          <div class="card">
            <h3>Circuit Breaker</h3>
            <p><b>Qué es:</b> un intermediario entre quien llama y el servicio remoto que <b>monitorea los fallos</b>.</p>
            <p><b>Cómo actúa:</b> si los fallos superan un <b>umbral</b>, <b>“abre el circuito”</b>: deja de llamar y
            responde con un <b>fallback</b>. Pasado un tiempo (<b>half-open</b>), prueba si se recuperó.</p>
            <p><b>Qué resuelve:</b> evita esperar a un servicio caído y <b>frena la falla en cascada</b>. Para fallas
            <b>persistentes</b>.</p>
            <p class="mini">Estados: <b>CERRADO</b> (pasa todo) → <b>ABIERTO</b> (falla rápido) → <b>SEMIABIERTO</b>
            (prueba) → cerrado.</p>
          </div>
          <div class="card">
            <h3>Retry</h3>
            <p><b>Qué es:</b> volver a intentar automáticamente una llamada que falló.</p>
            <p><b>Cómo actúa:</b> reintenta una cantidad <b>limitada</b> de veces, con una espera que <b>crece</b> entre
            intentos (<i>backoff</i>, con algo de azar/<i>jitter</i>).</p>
            <p><b>Qué resuelve:</b> fallas <b>pasajeras</b> (un corte de red, un timeout aislado) sin que el usuario lo
            note.</p>
            <p><b>⚠️ Cuidado:</b> <b>sólo en operaciones idempotentes</b>. <b>Reintentar un cobro puede cobrar dos
            veces.</b></p>
          </div>
        </div>
        <p class="mini"><b>Se complementan:</b> Retry insiste ante lo pasajero; si la falla persiste, el Circuit Breaker
        corta para no sobrecargar más al servicio.</p>

        <h2>SAGA ⭐</h2>
        <div class="callout key">
          <p><b>Problema:</b> con una base de datos por servicio <b>no existe una transacción única que los abarque a
          todos</b>.</p>
          <p><b>SAGA:</b> una <b>secuencia de transacciones locales</b>; <b>si una falla, se compensan las anteriores</b>
          (en <b>orden inverso</b>).</p>
        </div>
        ${APP.uml(`graph LR
    T1["T1 · Pedidos<br/>Crear pedido ✓"] --> T2["T2 · Inventario<br/>Reservar stock ✓"]
    T2 --> T3["T3 · Pagos<br/>Cobrar ❌"]
    T3 -->|"falla → compensación"| C2["C2 · Liberar stock"]
    C2 --> C1["C1 · Cancelar pedido"]
    style T3 fill:#fee2e2,stroke:#b91c1c,color:#0f172a
    style C1 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style C2 fill:#fffbeb,stroke:#b45309,color:#0f172a`, "SAGA: transacciones locales + compensaciones")}
        <ul>
          <li><b>Saga por coreografía:</b> cada servicio reacciona al evento del anterior y publica el suyo.</li>
          <li><b>Saga por orquestación:</b> un <b>orquestador de la saga</b> indica cada paso y cada compensación.</li>
        </ul>

        <h2>Transactional Outbox / Inbox</h2>
        <div class="callout key">
          <p><b>Problema de la doble escritura:</b> guardar el cambio en la base y publicar el evento son <b>dos
          operaciones</b>. Si una falla, quedan inconsistentes: <b>datos sin evento</b> o <b>evento sin datos</b>.</p>
          <ul>
            <li><b>Outbox (emisor):</b> el evento se guarda <b>en la misma transacción</b> que el cambio, en una tabla
            <code>outbox</code>. Un <b>proceso aparte</b> (relay por polling o CDC) lo lee y lo publica. Garantiza que se
            publique <b>al menos una vez</b>.</li>
            <li><b>Inbox (receptor):</b> al procesar, <b>registra el ID del mensaje en la misma transacción</b>. Si llega
            duplicado, lo descarta: el consumo es <b>idempotente</b>.</li>
          </ul>
        </div>

        <h2>Arquitectura orientada a eventos</h2>
        <ul>
          <li><b>Evento:</b> un <b>hecho que ya ocurrió</b>, inmutable (<code>PedidoCreado</code>).</li>
          <li><b>Productor:</b> publica el evento <b>sin conocer a quienes lo van a consumir</b>.</li>
          <li><b>Consumidor:</b> se suscribe a los eventos que le interesan y reacciona.</li>
        </ul>
        <p><b>Ventaja:</b> sumar un consumidor <b>no requiere tocar al productor</b>. <b>Costo:</b> consistencia eventual y
        un flujo más difícil de seguir.</p>
        <div class="callout tip">
          <p><b>Comando vs. evento:</b> “emitir factura” es una <b>orden</b> → la tiene que hacer <b>alguien, una vez</b>
          → <b>cola</b>. “Pedido creado” es un <b>evento</b> → varios sistemas reaccionan de forma independiente →
          <b>topic</b>. Es la regla práctica que piden en
          <a class="inline" data-go="p2-integracion">integración</a>.</p>
        </div>

        <h2>Caso real: cómo se responde “¿y si un paso falla?”</h2>
        <div class="callout key">
          <div class="callout-title">🎯 PedidosYa Plus — tres decisiones de diseño</div>
          <p>Más de 15 flujos consultan si el usuario es Plus. ¿Qué pasa si la detección falla?</p>
          <ul>
            <li><b>Degradar antes que romper:</b> saber si alguien es Plus <b>no es imprescindible</b> para pedir. Si falla,
            la pantalla <b>pierde un detalle, no su propósito</b>.</li>
            <li><b>Consistencia eventual, a conciencia:</b> el ahorro del usuario se actualiza unos segundos después, para
            <b>no frenar el flujo</b> de la orden.</li>
            <li><b>Validarlo con caos:</b> inyectaron fallas de Plus <b>sólo para los usuarios del equipo</b> y probaron
            cada flujo uno por uno.</li>
          </ul>
          <p>“El usuario puede realizar el pedido; luego se detecta y se lo <b>compensa</b>.”</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2msQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2msQuiz"), [
        { n: 1, topic: "Bounded Context", type: "mc", q: "¿En qué se basa el corte entre microservicios?", options: [
          { t: "En bounded contexts: capacidades de negocio con un modelo interno consistente", ok: true },
          { t: "En las capas técnicas: uno de UI, uno de lógica, uno de datos", ok: false },
          { t: "En las tablas: un servicio por tabla", ok: false },
        ], explain: "Cortar por capas técnicas reproduce el problema de la Ley de Conway; un servicio por tabla es el antipatrón de nanoservicios." },
        { n: 2, topic: "Datos", type: "vf", q: "Con base de datos por servicio se mantiene la integridad referencial entre servicios mediante FK.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Se pierde la garantía automática de FK: las referencias se guardan como IDs lógicos y se validan a nivel de aplicación." },
        { n: 3, topic: "Saga", type: "mc", q: "El paso “Cobrar” falla en una saga de 3 pasos. ¿Qué ocurre?", options: [
          { t: "Se ejecutan las compensaciones en orden inverso: liberar stock y cancelar el pedido", ok: true },
          { t: "Se hace ROLLBACK de la transacción distribuida", ok: false },
          { t: "Se pierde el pedido", ok: false },
        ], explain: "No existe una transacción ACID que abarque varios servicios: se compensa con operaciones de negocio inversas." },
        { n: 4, topic: "Resiliencia", type: "mc", q: "El Módulo de Análisis de Riesgo responde Timeout. ¿Qué problema tenés y cómo lo resolvés?", options: [
          { t: "Acoplamiento temporal en una llamada sincrónica: timeout + retry con backoff + circuit breaker + fallback, y si no se necesita la respuesta ya, pasarlo a cola", ok: true },
          { t: "Un problema de base de datos: agregar un índice", ok: false },
          { t: "Reintentar infinitamente hasta que responda", ok: false },
        ], explain: "Reintentar sin control multiplica la carga sobre el servicio caído. Hace falta fail fast y degradación elegante." },
        { n: 5, topic: "Outbox", type: "mc", q: "El patrón Transactional Outbox resuelve…", options: [
          { t: "La doble escritura: guardar el cambio y publicar el evento son dos operaciones que pueden quedar inconsistentes", ok: true },
          { t: "El orden de los mensajes en Kafka", ok: false },
          { t: "La autenticación entre servicios", ok: false },
        ], explain: "El evento se guarda en la MISMA transacción que el cambio, en una tabla outbox, y un relay lo publica después. Garantía at-least-once + inbox idempotente del lado del consumidor." },
        { n: 6, topic: "Antipatrones", type: "mc", q: "Un servicio por tabla exponiendo su CRUD por REST es…", options: [
          { t: "El antipatrón de nanoservicios: la comunicación y el mantenimiento superan su utilidad", ok: true },
          { t: "La mejor práctica de microservicios", ok: false },
          { t: "Un teraservicio", ok: false },
        ], explain: "Teraservicio es el opuesto: un servicio de tipo monolítico que requiere 2 TB de memoria o más." },
        { n: 7, topic: "Aplicación", type: "open", q: "“Enviar resúmenes semanales de actividad por email a cada usuario, en una arquitectura de microservicios. ¿Qué mecanismos de comunicación propones?”", answer: "Un proceso programado (cron / scheduler) dispara semanalmente en el servicio de Estadísticas, que consulta sus propios datos agregados y, por cada usuario, PUBLICA un mensaje en una cola (o un evento 'ResumenSemanalGenerado' en un topic) con el id de usuario y el resumen. El servicio de Notificaciones lo consume y envía el mail. Elijo asincrónico porque quien dispara NO necesita la respuesta para continuar: desacopla en el tiempo (si el proveedor de mail está caído, los mensajes esperan en la cola), absorbe el pico de miles de envíos simultáneos escalando consumidores (competing consumers) y tolera fallas con reintentos limitados, backoff y DLQ para los que fallan de forma permanente. El consumidor debe ser IDEMPOTENTE —guardando el id del mensaje ya procesado (inbox)— porque la entrega es at-least-once y no queremos mandar el mismo resumen dos veces. Para no perder el evento por doble escritura, el servicio emisor usa Transactional Outbox. Integridad del resumen: firmarlo (HMAC/firma digital) o adjuntar un hash, y enviarlo por un canal cifrado (TLS); si se almacena, guardar el hash para detectar alteraciones." },
      ]);
    },
  });
})();
