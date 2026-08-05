/* ============================================================
   Parcial HIDRA — Modelo 2: Fugas y Anomalías
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p><b>HIDRA</b> usa los caudalímetros no sólo para facturar, sino para <b>detectar tempranamente pérdidas de agua</b>:
    fugas domiciliarias, roturas de cañería, consumos anómalos y conexiones clandestinas. Este modelo se concentra en la
    <b>detección y la gestión de las alertas</b>.</p>

    <h4>Servicio I — Monitoreo y Detección</h4>
    <p>Analiza el flujo de lecturas de cada suministro y aplica <b>reglas de detección</b>. Actualmente existen varias, que
    <b>se aplican de forma combinada</b> y <b>pueden agregarse más</b> en el futuro:</p>
    <ul>
      <li><b>Consumo anómalo:</b> el consumo del período supera en más del 300% el promedio histórico.</li>
      <li><b>Fuga domiciliaria:</b> caudal bajo pero <b>constante durante la madrugada</b> (nunca baja a cero).</li>
      <li><b>Rotura de cañería:</b> caída brusca de presión con caudal muy alto.</li>
      <li><b>Conexión clandestina:</b> consumo detectado aguas abajo con el medidor reportando cero.</li>
    </ul>
    <p>Cada regla, si se cumple, genera una <b>alerta</b> con un <b>nivel de severidad</b>.</p>

    <h4>Servicio II — Gestión de Alertas y Órdenes de Trabajo</h4>
    <p>Cada alerta abre una <b>orden de trabajo</b> con un <b>ciclo de vida</b>: <i>Detectada</i> → <i>Asignada</i> (a una
    cuadrilla) → <i>En inspección</i> → <i>Confirmada</i> o <i>Descartada</i> → <i>Resuelta</i>. Según el estado se
    habilitan distintas acciones (no se puede resolver una orden que no fue inspeccionada). Se exige <b>trazabilidad
    completa</b>: quién y cuándo hizo cada cambio, con observaciones.</p>

    <h4>Servicio III — Notificaciones</h4>
    <p>Cuando una alerta cambia de estado, hay que <b>avisar a los interesados</b>: al <b>usuario</b> (si es fuga
    domiciliaria), a la <b>cuadrilla</b> asignada, y al <b>ente regulador</b> (si es una pérdida en la red pública).
    <b>Pueden sumarse más</b> destinatarios o canales. Los servicios de notificación están <b>desplegados por separado</b>.</p>

    <h4>Servicio IV — Acción remota</h4>
    <p>Ante una alerta confirmada de conexión clandestina o rotura grave, un operador puede <b>cortar o limitar el
    suministro en forma remota</b>. Estas acciones se <b>encolan</b>, se ejecutan sobre el caudalímetro y quedan
    <b>auditadas</b> (qué acción, quién la ordenó, resultado).</p>

    <h4>Se pide</h4>
    <p><b>1) Modelado de Dominio</b> — Capa de dominio de los <b>Servicios I y II</b>.
    <b>2) Arquitectura I</b> — Despliegue + componentes del <b>pipeline de detección</b> (del stream de lecturas a la alerta).
    <b>3) Arquitectura II</b> — Diseñe las <b>notificaciones</b> a interesados desplegados por separado y la <b>acción remota</b>.
    <b>4) Modelo de Datos</b> — DER de reglas, alertas, órdenes de trabajo y trazabilidad.</p>`;

  const RUBRICA = [
    { t: "Dominio: <b>Strategy en colección</b> para las reglas de detección (una interfaz, muchas reglas)", p: 8 },
    { t: "Cada regla decide sola si se cumple (<code>evaluar</code>); el motor recorre la lista sin <code>if</code> por tipo", p: 6 },
    { t: "Justifiqué con “pueden agregarse más” y “se aplican combinadas” → colección + Open/Closed", p: 5 },
    { t: "Dominio: <b>State</b> para el ciclo de vida de la Orden de Trabajo (5 estados)", p: 8 },
    { t: "Las reglas “no se resuelve sin inspeccionar” viven en el estado", p: 5 },
    { t: "Modelé la <b>trazabilidad</b> (bitácora con actor, fecha y observaciones) en cada transición", p: 6 },
    { t: "La alerta tiene severidad y referencia a la regla que la disparó", p: 4 },
    { t: "Arq I: pipeline con <b>broker/stream</b> de lecturas → motor de detección → alertas", p: 8 },
    { t: "Arq I: mencioné procesamiento cerca del dato (<b>edge</b>) o ventana de tiempo para el análisis", p: 4 },
    { t: "Arq I: diagrama con protocolos etiquetados", p: 3 },
    { t: "Arq II: notificaciones vía <b>Pub-Sub / broker</b> (servicios desplegados aparte, no Observer in-process)", p: 8 },
    { t: "Arq II: “pueden sumarse más destinatarios” → sumar un suscriptor no toca al publicador", p: 5 },
    { t: "Arq II: acción remota vía <b>Command</b> (encolable, auditable, desacopla invoker de receiver)", p: 8 },
    { t: "Datos: DER de alerta, orden de trabajo, transiciones (bitácora), reglas configurables", p: 8 },
    { t: "Datos: lecturas en time-series (no relacional) con justificación", p: 4 },
    { t: "Justifiqué cada patrón con la frase del enunciado (los 4 elementos)", p: 4 },
  ];

  D.finales.push({ id: "hidra-2", nombre: "HIDRA · Modelo 2 (Fugas y Anomalías)", fecha: "práctica", duracion: 150, enunciado: ENUNCIADO, rubrica: RUBRICA });

  APP.register({
    id: "hidra-2",
    title: "Modelo 2 · Fugas y Anomalías",
    tag: "📋",
    group: "Parcial HIDRA (práctica)",
    resumen: "Motor de reglas · State de alertas · Command",
    keywords: ["hidra", "fuga", "anomalia", "deteccion", "alerta", "orden de trabajo", "clandestina", "strategy", "state", "command", "pubsub"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial HIDRA · Modelo de práctica 2</div>
          <h1>Fugas y Anomalías</h1>
          <p class="lead">Acá conviven varios patrones: <b>motor de reglas (Strategy)</b>, <b>State</b>, <b>Pub-Sub</b> y <b>Command</b>.</p>
        </div>

        <div class="controls no-print"><button class="btn js-print" type="button">📥 Descargar este modelo (PDF)</button><span style="color:var(--ink-soft);font-size:.85rem">Con la solución completa, por si el examen toma algo parecido.</span></div>



        <details class="qa">
          <summary>📄 Ver el enunciado del modelo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Solución rápida — qué problema resuelve cada parte</h2>
        <p style="color:var(--ink-soft)">No hace falta que interpretes nada: acá está, para cada requerimiento, <b>qué patrón/decisión</b> lo resuelve y por qué.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Lo que pide (el problema)</th><th>La solución (qué usar)</th></tr></thead>
          <tbody>
            <tr><td>“reglas de detección… <b>combinadas</b>… <b>pueden agregarse más</b>”</td><td><b>Strategy en colección</b> (motor de reglas)</td></tr>
            <tr><td>“ciclo de vida: Detectada → Asignada → … → Resuelta”</td><td><b>State</b> (Estado) de la orden de trabajo</td></tr>
            <tr><td>“no se puede resolver sin inspeccionar”</td><td>Regla que vive en el estado</td></tr>
            <tr><td>“<b>trazabilidad completa</b>: quién y cuándo”</td><td>Bitácora con actor en cada transición</td></tr>
            <tr><td>“avisar a interesados… <b>pueden sumarse más</b>… <b>desplegados por separado</b>”</td><td><b>Pub-Sub</b> (Publicación-Suscripción) con broker</td></tr>
            <tr><td>“cortar/limitar remotamente… <b>encolan</b>… <b>auditadas</b>”</td><td><b>Command</b> (Comando)</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1 — Modelado de dominio</h2>
        ${APP.uml(`classDiagram
    class MotorDeDeteccion {
        -reglas: List~ReglaDeDeteccion~
        +analizar(VentanaDeLecturas) List~Alerta~
    }
    class ReglaDeDeteccion {
        <<interface>>
        +evaluar(VentanaDeLecturas) Alerta
        +nombre() String
    }
    class ConsumoAnomalo
    class FugaDomiciliaria
    class RoturaDeCaneria
    class ConexionClandestina
    class Alerta {
        -severidad: Severidad
        -reglaOrigen: String
        -fecha: LocalDateTime
    }
    class OrdenDeTrabajo {
        -estado: EstadoOrden
        -cuadrilla: Cuadrilla
        -bitacora: List~Transicion~
        +asignar(Cuadrilla)
        +inspeccionar()
        +confirmar(String)
        +descartar(String)
        +resolver()
    }
    class EstadoOrden {
        <<interface>>
        +asignar(OrdenDeTrabajo, Cuadrilla)
        +resolver(OrdenDeTrabajo)
        +nombre() String
    }
    class Detectada
    class Asignada
    class EnInspeccion
    class Confirmada
    class Descartada
    class Resuelta
    class Transicion {
        -de: String
        -a: String
        -actor: Actor
        -fecha: LocalDateTime
        -observacion: String
    }
    ReglaDeDeteccion <|.. ConsumoAnomalo
    ReglaDeDeteccion <|.. FugaDomiciliaria
    ReglaDeDeteccion <|.. RoturaDeCaneria
    ReglaDeDeteccion <|.. ConexionClandestina
    MotorDeDeteccion o-- "*" ReglaDeDeteccion
    MotorDeDeteccion ..> Alerta
    OrdenDeTrabajo --> "1" Alerta
    OrdenDeTrabajo --> EstadoOrden
    EstadoOrden <|.. Detectada
    EstadoOrden <|.. Asignada
    EstadoOrden <|.. EnInspeccion
    EstadoOrden <|.. Confirmada
    EstadoOrden <|.. Descartada
    EstadoOrden <|.. Resuelta
    OrdenDeTrabajo "1" *-- "*" Transicion`, "Servicios I y II · Strategy(colección) + State")}
        <div class="callout key">
          <div class="callout-title">🔑 Lo que da los puntos</div>
          <ul>
            <li><b>Motor de reglas = Strategy en colección:</b> como “se aplican combinadas” y “pueden agregarse más”, el
            motor mantiene una <b>lista</b> de <code>ReglaDeDeteccion</code> y la recorre. Cada regla decide sola si se
            cumple (<code>evaluar</code>). Sumar una regla es una clase nueva (Open/Closed).</li>
            <li><b>Orden de trabajo = State:</b> ciclo de vida con transiciones válidas. “No se resuelve sin inspeccionar”
            vive en el estado, no en un <code>if</code>.</li>
            <li><b>Trazabilidad = bitácora de Transiciones:</b> cada cambio registra actor, fecha y observación. Es el mismo
            recurso que piden todos los finales.</li>
          </ul>
        </div>

        <h2>3 · Punto 2 — Arquitectura I (pipeline de detección)</h2>
        ${APP.uml(`graph LR
    M["🔧 Caudalímetros"] -->|MQTT| BR["📨 Stream / Broker"]
    BR --> ING["Ingesta"]
    ING --> TS[("time-series")]
    BR --> DET["⚙️ Motor de Detección<br/>(ventana de tiempo)"]
    DET -->|"publica AlertaDetectada"| BR2["📨 Broker de eventos"]
    DET --> ADB[("alertas / órdenes")]
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style BR2 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style DET fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Detección sobre el flujo de lecturas")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <ul>
            <li>Las lecturas llegan por el <b>broker</b> (asincrónico, amortigua picos). El <b>motor de detección</b>
            consume el flujo y evalúa las reglas sobre una <b>ventana de tiempo</b> (no lectura a lectura: “caudal constante
            durante la madrugada” necesita ver varias horas).</li>
            <li>Cuando una regla se cumple, publica un evento <code>AlertaDetectada</code> en un broker de eventos, del que
            se enganchan el Servicio de Alertas y el de Notificaciones.</li>
            <li>Opcional que suma: parte de la detección simple (consumo cero, caudal fuera de rango) podría hacerse en el
            <b>borde</b> (<a class="inline" data-go="edge">edge</a>), en el propio medidor, para reducir tráfico.</li>
          </ul>
        </div>

        <h2>4 · Punto 3 — Arquitectura II (notificaciones + acción remota)</h2>
        ${APP.uml(`graph TB
    AL["Servicio de Alertas"] -->|"publica AlertaConfirmada"| B["📨 Broker (Pub-Sub)"]
    B --> N1["Notif. Usuario"]
    B --> N2["Notif. Cuadrilla"]
    B --> N3["Notif. Ente Regulador"]
    OP["👤 Operador"] --> CMD["Servicio de Acción Remota<br/>(Command: cortar/limitar)"]
    CMD -->|"encola comando"| Q["📨 Cola de comandos"]
    Q --> AG["Gateway IoT"]
    AG -->|MQTT| MED["🔧 Caudalímetro"]
    CMD --> AUD[("auditoría")]
    style B fill:#fffbeb,stroke:#b45309,color:#0f172a
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a
    style CMD fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Pub-Sub + Command")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <ul>
            <li><b>Notificaciones = Pub-Sub</b> (no Observer): los servicios de notificación están <b>desplegados por
            separado</b>, así que el de Alertas publica el evento en un broker y cada notificador se suscribe. “Pueden
            sumarse más destinatarios” → agregar un suscriptor no toca al publicador.</li>
            <li><b>Acción remota = Command:</b> cortar/limitar se cosifica como un comando que se <b>encola</b>, se ejecuta
            sobre el medidor (a través del gateway IoT) y queda <b>auditado</b> (quién lo ordenó, resultado). Desacopla al
            operador (invoker) del medidor (receiver).</li>
          </ul>
        </div>

        <h2>5 · Punto 4 — Modelo de datos</h2>
        <div class="callout bad"><p><b>❓ Ojo:</b> bases de datos <b>no está en el listado de contenidos</b> que viste. Si esta sección entra, será un <b>DER básico</b>. El de abajo es completo por si acaso; en el parcial hacé la versión simple (entidades, PK, FK, cardinalidad).</p></div>
        ${APP.uml(`erDiagram
    REGLA {
        bigint  id_regla   PK
        varchar tipo       "NOT NULL"
        varchar parametros "config de la regla"
        boolean activa     "NOT NULL"
    }
    ALERTA {
        bigint  id_alerta     PK
        bigint  id_suministro     "ref lógica"
        bigint  id_regla      FK "NOT NULL"
        varchar severidad     "NOT NULL"
        timestamp detectada_en "NOT NULL"
    }
    ORDEN_TRABAJO {
        bigint  id_orden      PK
        bigint  id_alerta     FK "UK NOT NULL"
        bigint  id_cuadrilla      "ref lógica"
        varchar estado        "NOT NULL CHECK(...)"
    }
    TRANSICION {
        bigint  id_transicion PK
        bigint  id_orden      FK "NOT NULL"
        varchar estado_de     "NOT NULL"
        varchar estado_a      "NOT NULL"
        varchar actor         "NOT NULL"
        timestamp fecha       "NOT NULL"
        varchar observacion
    }
    COMANDO {
        bigint  id_comando    PK
        bigint  id_suministro     "ref lógica NOT NULL"
        varchar accion        "CORTAR|LIMITAR|REPONER"
        varchar ordenado_por  "NOT NULL"
        timestamp fecha       "NOT NULL"
        varchar resultado
    }
    REGLA        ||--o{ ALERTA        : "genera"
    ALERTA       ||--|| ORDEN_TRABAJO : "abre"
    ORDEN_TRABAJO ||--|{ TRANSICION   : "1..N trazabilidad"`, "DER de detección y órdenes")}
        <div class="callout tip">
          <p><b>No relacional:</b> las <b>lecturas</b> (el insumo de la detección) van en time-series. La <b>regla</b> se
          persiste con sus parámetros configurables (podría ser documental si la config varía mucho por tipo de regla).</p>
        </div>

        <h2>6 · Trampas</h2>
        <div class="trampa"><b>Notificaciones entre servicios desplegados aparte.</b> Es Pub-Sub con broker, <b>no</b>
        Observer in-process (Observer no cruza el proceso).</div>
        <div class="trampa"><b>“Caudal constante durante la madrugada”.</b> No se detecta con una sola lectura: necesitás
        una <b>ventana de tiempo</b>. Mencionalo en arquitectura.</div>
        <div class="trampa"><b>La acción remota “encolada y auditada”.</b> Es Command (objeto que se guarda y ejecuta
        después), no una llamada directa.</div>

        <h2>7 · Rúbrica</h2>
        <div id="rubHidra2"></div>
      `;
      APP.rubrica(el.querySelector("#rubHidra2"), "hidra-2", RUBRICA);
    },
  });
})();
