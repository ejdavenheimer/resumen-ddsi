/* ============================================================
   Práctica — Banco de preguntas de teoría
   Tipos del widget: vf, mc, multi, open, match.
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "preguntas",
    title: "Preguntas de teoría",
    tag: "📝",
    group: "Práctica interactiva",
    resumen: "Banco de preguntas de final",
    keywords: ["preguntas", "teoria", "verdadero falso", "quiz", "final"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Preguntas de teoría</h1>
          <p class="lead">Banco de preguntas del estilo de las que aparecen en la sección de teoría de los parciales y finales.</p>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Ojo con los Verdadero/Falso</div>
          <p>En esta materia el V/F <b>siempre pide justificación</b>. Un “Falso” sin justificar vale cero, y un
          “Verdadero” con una justificación equivocada también. Después de responder cada una, leé la explicación
          y practicá reformularla con tus palabras: eso es lo que vas a escribir en la hoja.</p>
        </div>

        <div id="quizBox"></div>
      `;

      APP.quiz(el.querySelector("#quizBox"), [
        /* ---------------- Diseño y cualidades ---------------- */
        { n: 1, topic: "Diseño", type: "vf", q: "El Diseño de Software incluye al Diseño de Sistemas. <i>(parcial 2023)</i>", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Es al revés: el <b>Diseño de Sistemas de Información</b> es lo más abarcativo — incluye hardware, personas, procesos, datos y software. El Diseño de Software es una parte de ese todo. La relación de inclusión está invertida." },

        { n: 2, topic: "Diseño", type: "vf", q: "El atributo de calidad “disponibilidad” no se encuentra categorizado en la norma ISO 25000. <i>(parcial 2023)</i>", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "La disponibilidad <b>sí</b> está en ISO/IEC 25010, como subcaracterística de <i>Fiabilidad</i> (junto con madurez, tolerancia a fallos y capacidad de recuperación)." },

        { n: 3, topic: "Diseño", type: "vf", q: "Los requerimientos funcionales hacen referencia a atributos de calidad. <i>(parcial 2023)</i>", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Los atributos de calidad son los requerimientos <b>NO funcionales</b>: disponibilidad, performance, seguridad, mantenibilidad. Los funcionales describen <i>qué hace</i> el sistema; los no funcionales, <i>cómo se comporta</i> al hacerlo." },

        { n: 4, topic: "Diseño", type: "vf", q: "Cuando nos referimos a un <i>framework</i> entendemos que se maneja el concepto de control directo. <i>(parcial 2023)</i>", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Un framework aplica <b>inversión de control</b> (“no me llames, yo te llamo”): vos escribís las piezas y el framework decide cuándo invocarlas. El control directo es lo propio de una <b>biblioteca</b>, donde vos llamás a sus funciones." },

        { n: 5, topic: "Diseño", type: "vf", q: "La ejecución de un testing que encuentra fallas es producto de que su diseño fue el correcto. <i>(parcial 2023)</i>", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Un test bien diseñado es justamente el que <b>tiene capacidad de encontrar defectos</b>. Un test que nunca falla puede no estar ejercitando nada relevante. Como decía Dijkstra: el testing muestra la presencia de errores, nunca su ausencia." },

        { n: 6, topic: "Diseño", type: "vf", q: "El patrón Composite visto en la cursada se puede implementar en un lenguaje funcional como Haskell. <i>(parcial 2023)</i>", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Sí: la <b>intención</b> (tratar de forma uniforme la parte y el todo en una estructura recursiva) se expresa con un tipo algebraico recursivo (<code>data Elem = Hoja Int | Nodo [Elem]</code>) y pattern matching. Cambia el <i>mecanismo</i> (tipos suma en vez de interfaces y polimorfismo de subtipo), no la idea." },

        { n: 7, topic: "Diseño", type: "multi", q: "¿Cuáles de estas son cualidades de un buen diseño?", options: [
          { t: "Bajo acoplamiento", ok: true },
          { t: "Alta cohesión", ok: true },
          { t: "Extensibilidad", ok: true },
          { t: "Alto acoplamiento, para que todo esté bien conectado", ok: false },
        ], explain: "Bajo acoplamiento + alta cohesión es la fórmula clásica: cada módulo hace una cosa bien y depende de lo mínimo posible del resto." },

        /* ---------------- Patrones ---------------- */
        { n: 8, topic: "Patrones", type: "vf", q: "Simple Factory es uno de los patrones del catálogo GoF.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "No lo es: es un <i>idiom</i> muy difundido, a veces llamado Static Factory. Los creacionales de GoF son Abstract Factory, Builder, Factory Method, Prototype y Singleton." },

        { n: 9, topic: "Patrones", type: "mc", q: "¿Cuál es la diferencia esencial entre Strategy y State?", options: [
          { t: "Quién decide el cambio: en Strategy lo elige el cliente; en State el objeto avanza solo según su ciclo de vida", ok: true },
          { t: "Strategy usa herencia y State composición", ok: false },
          { t: "State es creacional y Strategy de comportamiento", ok: false },
        ], explain: "Estructuralmente los diagramas son casi idénticos. Lo que los distingue es la <b>intención</b> y quién provoca la transición. Además, en State los estados se conocen entre sí; en Strategy, no." },

        { n: 10, topic: "Patrones", type: "mc", q: "Un patrón innecesario en un diagrama de parcial…", options: [
          { t: "Resta: es sobreingeniería, y toda decisión debe justificarse con el enunciado", ok: true },
          { t: "Suma, porque demuestra que sabés el patrón", ok: false },
          { t: "Es indiferente", ok: false },
        ], explain: "El criterio de la cátedra es explícito: cada decisión de diseño se justifica con el requerimiento que la motiva. Un patrón sin requerimiento que lo respalde muestra falta de criterio, no conocimiento." },

        { n: 11, topic: "Patrones", type: "match", q: "Uní cada patrón con la frase que lo dispara:", pairs: [
          { l: "“Distintas formas de calcular, y pueden agregarse más”", r: "<b>Strategy</b>" },
          { l: "“Ciclo de vida con estados y transiciones”", r: "<b>State</b>" },
          { l: "“Integrarse con un servicio externo que no controlamos”", r: "<b>Adapter</b>" },
          { l: "“Categorías que pueden contener subcategorías”", r: "<b>Composite</b>" },
          { l: "“Varios componentes deben enterarse cuando cambia X”", r: "<b>Observer</b>" },
          { l: "“Configurar acciones parametrizables que se ejecutan después”", r: "<b>Command</b>" },
          { l: "“Mismo proceso con algunos pasos distintos”", r: "<b>Template Method</b>" },
          { l: "“Punto de entrada único que coordina varios servicios”", r: "<b>Facade</b>" },
        ] },

        /* ---------------- SOLID ---------------- */
        { n: 12, topic: "SOLID", type: "mc", q: "Una clase implementa una interfaz y la mitad de sus métodos lanzan <code>UnsupportedOperationException</code>. ¿Qué principio se viola?", options: [
          { t: "ISP (y de paso LSP)", ok: true },
          { t: "Sólo SRP", ok: false },
          { t: "Sólo OCP", ok: false },
        ], explain: "ISP porque la interfaz obliga a depender de métodos que no se usan. Y LSP porque esa clase no es sustituible: quien reciba la interfaz no puede confiar en que los métodos funcionen." },

        { n: 13, topic: "SOLID", type: "vf", q: "Poner una interfaz delante de una clase de infraestructura ya garantiza cumplir DIP.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Sólo si la abstracción está expresada en el <b>vocabulario del dominio</b> y la define el módulo de alto nivel. Si la interfaz devuelve un <code>ResultSet</code> o el DTO del proveedor, el detalle se filtró y el acoplamiento sigue ahí, con una capa de más." },

        { n: 14, topic: "SOLID", type: "mc", q: "“Cada tipo de envío nuevo obliga a modificar <code>CalculadoraDeEnvio</code>.” ¿Qué principio se viola y cómo se resuelve?", options: [
          { t: "OCP, con polimorfismo (Strategy)", ok: true },
          { t: "LSP, revisando la jerarquía", ok: false },
          { t: "ISP, partiendo la interfaz", ok: false },
        ], explain: "Abierto a extensión, cerrado a modificación: si agregar funcionalidad implica <b>editar</b> un archivo existente en vez de <b>crear</b> uno nuevo, hay un OCP violado." },

        /* ---------------- HTTP / REST ---------------- */
        { n: 15, topic: "HTTP", type: "vf", q: "PUT y DELETE son idempotentes; POST no.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "PUT reemplaza el recurso con un contenido fijo y DELETE lo elimina: repetirlos deja el mismo estado final. POST crea un recurso nuevo en cada llamada, salvo que agregues una clave de idempotencia." },

        { n: 16, topic: "HTTP", type: "mc", q: "El servicio acepta el pedido pero lo va a procesar de forma asincrónica. ¿Qué código devuelve?", options: [
          { t: "<code>202 Accepted</code>", ok: true },
          { t: "<code>200 OK</code>", ok: false },
          { t: "<code>201 Created</code>", ok: false },
          { t: "<code>204 No Content</code>", ok: false },
        ], explain: "El 202 significa literalmente “acepté tu pedido, todavía no lo terminé”. Es <i>el</i> código del asincronismo y la respuesta esperada en los puntos de manejo de demoras." },

        { n: 17, topic: "REST", type: "vf", q: "REST obliga a usar JSON.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "REST exige interfaz uniforme, recursos identificados por URI, stateless y representaciones — pero no impone el formato. JSON es lo habitual; también podés servir XML o CSV negociando con el header <code>Accept</code>." },

        { n: 18, topic: "REST", type: "mc", q: "¿Cuál de estos endpoints está bien diseñado?", options: [
          { t: "<code>GET /pacientes/42/turnos?estado=CONFIRMADO</code>", ok: true },
          { t: "<code>POST /obtenerTurnosDelPaciente</code>", ok: false },
          { t: "<code>GET /turnos/borrar/99213</code>", ok: false },
          { t: "<code>GET /paciente/42/turno</code>", ok: false },
        ], explain: "Sustantivos en plural, jerarquía para la pertenencia, filtros en la query string y el verbo HTTP dando la acción." },

        /* ---------------- Arquitectura ---------------- */
        { n: 19, topic: "Arquitectura", type: "mc", q: "“Se esperan picos masivos de tráfico y el proceso puede tardar minutos.” ¿Qué proponés?", options: [
          { t: "Comunicación asincrónica con broker + escalado horizontal de los consumidores", ok: true },
          { t: "Un servidor más potente (escalado vertical)", ok: false },
          { t: "Aumentar el timeout de las peticiones", ok: false },
        ], explain: "La cola amortigua el pico y desacopla temporalmente los servicios. El escalado vertical tiene techo y no ayuda ante ráfagas; aumentar el timeout empeora todo, porque deja más hilos bloqueados." },

        { n: 20, topic: "Arquitectura", type: "mc", q: "“Se prevé sumar una app mobile y los contratos de los microservicios no deben cambiar por necesidades de la UI.”", options: [
          { t: "API Gateway + un BFF por canal", ok: true },
          { t: "Endpoints específicos para mobile en cada microservicio", ok: false },
          { t: "Que la app mobile llame directo a cada microservicio", ok: false },
        ], explain: "El BFF compone y adapta lo que cada canal necesita, dejando intactos los contratos de los servicios. Las otras dos opciones son justamente lo que el enunciado quiere evitar." },

        { n: 21, topic: "Arquitectura", type: "multi", q: "¿Qué costos reales trae adoptar microservicios?", options: [
          { t: "Consistencia eventual: se pierden las transacciones ACID entre servicios", ok: true },
          { t: "Complejidad operativa (observabilidad, tracing, despliegues)", ok: true },
          { t: "Latencia de red donde antes había una llamada en memoria", ok: true },
          { t: "Imposibilidad de desplegar de forma independiente", ok: false },
        ], explain: "El despliegue independiente es una de las principales <i>ventajas</i>. Nombrar los tres costos reales al justificar demuestra que entendés el trade-off." },

        { n: 22, topic: "Arquitectura", type: "mc", q: "¿Qué componente propondrías para servir videos sin cargar el servidor de aplicación?", options: [
          { t: "Object storage (S3) + CDN; el backend sólo entrega URLs firmadas", ok: true },
          { t: "Guardarlos como BLOB en la base relacional", ok: false },
          { t: "Un balanceador de carga adicional", ok: false },
        ], explain: "Los binarios grandes nunca van en la base (infla backups y mata la performance). El CDN además los sirve desde el nodo más cercano al usuario, bajando latencia y transferencia del origen." },

        /* ---------------- Integración ---------------- */
        { n: 23, topic: "Integración", type: "mc", q: "¿Cuál es la diferencia entre orquestación y coreografía?", options: [
          { t: "En orquestación un componente central dirige el flujo; en coreografía cada servicio reacciona a eventos sin director", ok: true },
          { t: "La orquestación es sincrónica y la coreografía asincrónica, siempre", ok: false },
          { t: "Son sinónimos", ok: false },
        ], explain: "Aunque la coreografía suele apoyarse en eventos asincrónicos, la distinción es de <b>quién controla el flujo</b>, no del sincronismo: se puede orquestar de forma asincrónica." },

        { n: 24, topic: "Integración", type: "vf", q: "Un consumidor de mensajes debe ser idempotente.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Los brokers garantizan <b>at-least-once</b>: si el consumidor procesa y muere antes del ACK, el mensaje se reentrega. Sin idempotencia se duplican cobros, reservas o notificaciones." },

        { n: 25, topic: "Integración", type: "mc", q: "Cinco workers escuchan la misma cola de trabajo. Llega un mensaje: ¿cuántos lo procesan?", options: [
          { t: "Uno solo (point-to-point)", ok: true },
          { t: "Los cinco (pub/sub)", ok: false },
          { t: "Depende del tamaño del mensaje", ok: false },
        ], explain: "En una cola de trabajo cada mensaje va a un único consumidor: eso es lo que permite repartir carga. Para que todos reciban copia hace falta pub/sub." },

        /* ---------------- Seguridad ---------------- */
        { n: 26, topic: "Seguridad", type: "mc", q: "Un usuario autenticado intenta acceder a un recurso que no le corresponde. ¿Qué código HTTP?", options: [
          { t: "<code>403 Forbidden</code>", ok: true },
          { t: "<code>401 Unauthorized</code>", ok: false },
          { t: "<code>400 Bad Request</code>", ok: false },
        ], explain: "401 = no sé quién sos (autenticación). 403 = sé quién sos y no podés (autorización)." },

        { n: 27, topic: "Seguridad", type: "vf", q: "Un JWT viaja cifrado, así que se pueden poner datos sensibles en el payload.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "El JWT está <b>firmado, no cifrado</b>. El payload es Base64 y cualquiera que lo intercepte lo lee. La firma garantiza integridad, no confidencialidad." },

        { n: 28, topic: "Seguridad", type: "mc", q: "“¿Qué mecanismo brinda confidencialidad en los datos <b>almacenados</b>?”", options: [
          { t: "Cifrado en reposo (AES a nivel columna para campos sensibles) con las claves en un KMS externo", ok: true },
          { t: "HTTPS/TLS en todas las conexiones", ok: false },
          { t: "Hashear todos los campos", ok: false },
        ], explain: "TLS protege los datos <b>en tránsito</b>. Hashear no sirve para datos que después hay que leer (es irreversible). Para confidencialidad en reposo se cifra, y hay que decir dónde viven las claves." },

        { n: 29, topic: "Seguridad", type: "match", q: "Uní cada mecanismo con el pilar de la tríada CIA que fortalece:", pairs: [
          { l: "bcrypt con salt para las contraseñas", r: "<b>Confidencialidad</b>" },
          { l: "Bitácora de auditoría append-only", r: "<b>Integridad</b>" },
          { l: "Réplicas y balanceo de carga", r: "<b>Disponibilidad</b>" },
          { l: "Firma digital de un documento", r: "<b>Integridad</b> (y no repudio)" },
          { l: "Rate limiting y WAF", r: "<b>Disponibilidad</b> (contra DoS)" },
        ] },

        { n: 30, topic: "Seguridad", type: "mc", q: "“¿Qué componente arquitectónico propone para delegar la gestión de usuarios?”", options: [
          { t: "Un IDM (Keycloak, Auth0) con SSO, validando el token en el API Gateway", ok: true },
          { t: "Una tabla de usuarios replicada en cada microservicio", ok: false },
          { t: "Un archivo de configuración con usuarios y roles", ok: false },
        ], explain: "El IDM centraliza identidades, credenciales, MFA, recuperación de contraseña y ciclo de vida de las cuentas. Duplicar usuarios por servicio es exactamente lo que hay que evitar." },

        /* ---------------- Persistencia ---------------- */
        { n: 31, topic: "Persistencia", type: "mc", q: "¿Qué es un <i>impedance mismatch</i>?", options: [
          { t: "El desajuste entre el modelo de objetos y el relacional (herencia, colecciones, identidad, navegación)", ok: true },
          { t: "Una diferencia de performance entre dos bases de datos", ok: false },
          { t: "Un error de tipos en tiempo de compilación", ok: false },
        ], explain: "Los objetos tienen herencia, polimorfismo, colecciones anidadas e identidad por referencia; las tablas tienen filas, columnas y claves. Resolverlo implica decidir cómo mapear herencia, colecciones y value objects: es un punto explícito de casi todos los finales." },

        { n: 32, topic: "Persistencia", type: "multi", q: "¿Cómo se puede mapear una jerarquía de herencia a tablas?", options: [
          { t: "Single Table: una tabla con todas las columnas y un discriminador", ok: true },
          { t: "Joined: una tabla por clase, unidas por la PK", ok: true },
          { t: "Table per Class: una tabla completa por clase concreta", ok: true },
          { t: "No se puede: hay que eliminar la herencia del modelo", ok: false },
        ], explain: "Las tres son válidas, con trade-offs distintos: Single Table es rápida pero llena de nulls; Joined normaliza pero exige joins; Table per Class duplica columnas comunes. Lo que puntúa es nombrar la elegida <b>y por qué</b>." },

        { n: 33, topic: "Persistencia", type: "mc", q: "El Servicio de Análisis del Rival recibe JSON de estructura variable de un agente de IA. ¿Qué persistencia proponés?", options: [
          { t: "Base documental (MongoDB): esquema flexible para documentos heterogéneos", ok: true },
          { t: "Relacional con una columna por cada campo posible", ok: false },
          { t: "Base de grafos", ok: false },
        ], explain: "Cuando la estructura varía entre documentos y no hay relaciones complejas que recorrer, una documental encaja naturalmente. La relacional con columnas “por las dudas” termina llena de nulls y hay que migrarla cada vez que la IA agrega un campo." },

        { n: 34, topic: "Persistencia", type: "mc", q: "¿Cuándo conviene desnormalizar?", options: [
          { t: "Cuando hay muchas más lecturas que escrituras y los joins son un cuello de botella medido", ok: true },
          { t: "Siempre: menos tablas es más simple", ok: false },
          { t: "Nunca: rompe la integridad", ok: false },
        ], explain: "Desnormalizar cambia consistencia por performance de lectura. Se justifica con datos concretos, no por defecto — y hay que decir cómo mantenés la coherencia del dato duplicado." },
      ]);
    },
  });
})();
