/* ============================================================
   Modelos HIDRA para imprimir — resoluciones completas (~2 hojas c/u)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "hidra-imprimible",
    title: "⬇️ 3 modelos HIDRA para imprimir",
    tag: "⬇️",
    group: "Parcial HIDRA (práctica)",
    resumen: "Resoluciones completas · descargable",
    keywords: ["hidra", "imprimir", "descargar", "modelos", "respuestas", "resolucion", "parcial"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · resoluciones completas</div>
          <h1>Los 3 modelos HIDRA — resueltos, para imprimir</h1>
          <p class="lead">Mini enunciado + solución de las 4 secciones (con diagramas y frases para justificar) + verdadero/falso justificados.</p>
        </div>
        <div class="callout key resumen-print-btn">
          <div class="callout-title">📥 Descargar</div>
          <p style="margin:.2rem 0 .5rem">Botón → destino <b>“Guardar como PDF”</b>, tamaño <b>A4</b>, activá <b>“Gráficos de fondo”</b>.</p>
          <button class="btn js-print" type="button">📥 Descargar los 3 modelos (PDF)</button>
        </div>

        <!-- ===================== MODELO 1 ===================== -->
        <section class="hoja hoja-hidra">
          <span class="hoja-num">MODELO 1 · MEDICIÓN Y FACTURACIÓN</span>
          <p class="mini"><b>Enunciado (resumen).</b> HIDRA, red de agua con caudalímetros inteligentes. <b>Serv. I</b> Suministros (categoría: residencial/comercial/industrial/social; estado: activo/cortado/limitado/baja; según el estado se opera o no) + medidores. <b>Serv. II</b> Ingesta de lecturas (cientos de miles de medidores, con picos; llegan duplicadas y fuera de orden). <b>Serv. III</b> Facturación por esquema tarifario según categoría (residencial por tramos, comercial, social; pueden agregarse más; guardar el detalle). <b>Serv. IV</b> Cobros por pasarela de pago externa que confirma por webhook (dinero real fuera de alcance). <b>Se pide:</b> dominio (I y III), Arq. I (ingesta), Arq. II (pasarela), datos.</p>

          <h2>① Modelado de Dominio (Serv. I y III)</h2>
          <p class="mini"><b>Patrones:</b> <b>State</b> (suministro) + <b>Strategy</b> (esquema tarifario) + composición (Factura → Ítems).</p>
          <div class="uml">${APP.uml(`classDiagram
    class Cuenta {
      -titular
      -documento
    }
    class Suministro {
      -domicilio
      -categoria
      -estado
      +facturar(periodo) Factura
      +cortar()
      +reactivar()
    }
    class EstadoSuministro {
      <<interface>>
      +facturar(s, periodo)
      +cortar(s)
    }
    class Activo
    class Cortado
    class Limitado
    class DadoDeBaja
    class EsquemaTarifario {
      <<interface>>
      +calcular(consumo) Detalle
    }
    class Residencial {
      -tramos
    }
    class Comercial {
      -cargoFijo
      -valorM3
    }
    class Social
    class Factura {
      -periodo
      -total
      -esquemaAplicado
    }
    class ItemFactura {
      -concepto
      -monto
    }
    Cuenta "1" --> "*" Suministro : tiene
    Suministro --> EstadoSuministro : estado actual
    EstadoSuministro <|.. Activo : implementa
    EstadoSuministro <|.. Cortado : implementa
    EstadoSuministro <|.. Limitado : implementa
    EstadoSuministro <|.. DadoDeBaja : implementa
    Suministro ..> EsquemaTarifario : usa (según categoría)
    EsquemaTarifario <|.. Residencial : implementa
    EsquemaTarifario <|.. Comercial : implementa
    EsquemaTarifario <|.. Social : implementa
    Factura "1" *-- "*" ItemFactura : detalle`)}</div>
          <p class="mini"><b>Lo que da puntos:</b> (a) el residencial es <b>por tramos</b> → los tramos son una <b>colección dentro</b> de la estrategia <code>Residencial</code>, no un valor por m³. (b) La <b>Factura guarda el detalle</b> (una <code>ItemFactura</code> por tramo/cargo/impuesto) y el esquema aplicado — no un total suelto. (c) El <b>State</b> hace que “no se factura un suministro de baja / uno cortado no acumula” viva en cada estado, sin <code>if</code>.</p>
          <p class="mini"><b>Justificación (para escribir):</b> “Usé <b>Strategy</b> para el esquema tarifario porque el enunciado dice que <b>pueden agregarse más</b>: cada esquema es una clase y sumar uno no toca el resto (<b>Abierto/Cerrado</b>, bajo acoplamiento). Usé <b>State</b> para el suministro porque según su estado cambian las operaciones válidas; cada estado encapsula sus transiciones, evitando cadenas de <code>if</code>.”</p>

          <h2>② Arquitectura I — Ingesta de lecturas</h2>
          <div class="uml">${APP.uml(`graph LR
    M["Caudalímetros<br/>(cientos de miles)"] -->|MQTT| BR[("Broker / cola")]
    BR -->|AMQP| W1["Worker 1"]
    BR -->|AMQP| W2["Worker 2..N"]
    W1 --> TS[("Base series<br/>temporales")]
    W2 --> TS
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style TS fill:#ecfdf5,stroke:#059669,color:#0f172a`)}</div>
          <p class="mini">Los medidores publican por <b>MQTT</b> en un <b>broker/cola</b> que <b>amortigua los picos</b> (se acepta todo, se procesa al ritmo posible). <b>Workers</b> consumen en paralelo y <b>escalan horizontalmente</b>. El consumidor es <b>idempotente</b>: deduplica por <b>(medidor + fecha/hora)</b>; y como cada lectura trae el <b>consumo acumulado</b>, el <b>orden de llegada no importa</b> (el consumo del período = diferencia entre extremos). Las lecturas van a una base de <b>series temporales</b> (volumen enorme por tiempo). <i>Por qué NO sincrónico:</i> una lectura sincrónica a la base colapsaría en el pico y perdería datos.</p>

          <h2>③ Arquitectura II — Pasarela de pago</h2>
          <div class="uml">${APP.uml(`sequenceDiagram
    participant C as Cobros
    participant P as Pasarela (externa)
    participant U as Usuario
    C->>P: crear orden de pago (vía Adapter)
    P-->>C: id de pago + link
    C-->>U: 202 "pendiente" + link
    U->>P: paga
    P->>C: webhook: APROBADO (id)
    C->>C: ¿ya lo procesé? (idempotente)
    C->>C: marcar factura PAGADA`)}</div>
          <p class="mini"><b>Adapter</b>: defino mi interfaz <code>PasarelaDePagos</code> y un adapter por proveedor → cambiar de proveedor es otro adapter (el dominio no depende de la marca). Flujo <b>asincrónico</b>: creo la orden, respondo <b>202 “pendiente”</b> y me entero por <b>webhook</b> (la pasarela me llama al acreditarse). El webhook es <b>idempotente</b> (puede llegar repetido → no acreditar dos veces). El movimiento bancario real queda <b>fuera de alcance</b>: sólo guardo estado (pendiente/aprobado/rechazado) + id.</p>

          <h2>④ Modelo de datos <span class="pill gray">confirmá si entra</span></h2>
          <div class="uml">${APP.uml(`erDiagram
    CUENTA { bigint id_cuenta PK
      varchar titular }
    SUMINISTRO { bigint id_suministro PK
      bigint id_cuenta FK
      varchar categoria
      varchar estado }
    CAUDALIMETRO { bigint id_medidor PK
      bigint id_suministro FK
      varchar nro_serie UK }
    FACTURA { bigint id_factura PK
      bigint id_suministro FK
      date periodo
      decimal total
      varchar estado_pago }
    ITEM_FACTURA { bigint id_item PK
      bigint id_factura FK
      varchar concepto
      decimal monto }
    CUENTA ||--|{ SUMINISTRO : "1..N"
    SUMINISTRO ||--o| CAUDALIMETRO : "0..1"
    SUMINISTRO ||--o{ FACTURA : "0..N"
    FACTURA ||--|{ ITEM_FACTURA : "1..N"`)}</div>
          <p class="mini">Cada entidad con <b>PK</b>; relaciones con <b>FK</b>, cardinalidad y modalidad. Restricción: <code>nro_serie</code> UNIQUE. Las <b>lecturas</b> (si va) NO en el DER relacional: base de <b>series temporales</b>.</p>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“El esquema tarifario conviene con Strategy.” → <b>V</b>: algoritmos alternativos y ampliables; cada uno una clase (Abierto/Cerrado).</li>
            <li>“El estado del suministro alcanza con un atributo texto.” → <b>F</b>: como las operaciones válidas cambian según el estado, es <b>State</b>.</li>
            <li>“La ingesta debe ser sincrónica para no perder datos.” → <b>F</b>: con picos va <b>asincrónica con cola</b> que amortigua; sincrónica colapsaría.</li>
            <li>“El consumidor de lecturas debe ser idempotente.” → <b>V</b>: llegan duplicadas/reintentos; deduplica por medidor + timestamp.</li>
            <li>“El sistema espera bloqueado la confirmación del pago.” → <b>F</b>: es <b>asincrónica por webhook</b>; responde ‘pendiente’ y sigue.</li>
          </ol>
        </section>

        <!-- ===================== MODELO 2 ===================== -->
        <section class="hoja hoja-hidra">
          <span class="hoja-num">MODELO 2 · FUGAS Y ANOMALÍAS</span>
          <p class="mini"><b>Enunciado (resumen).</b> HIDRA detecta pérdidas. <b>Serv. I</b> Monitoreo: reglas de detección (consumo anómalo; fuga = caudal bajo pero <b>constante de madrugada</b>; rotura = caída brusca de presión; conexión clandestina); se aplican <b>combinadas</b> y <b>pueden agregarse más</b>; cada una da una alerta con severidad. <b>Serv. II</b> Órdenes de trabajo con ciclo de vida Detectada→Asignada→En inspección→Confirmada/Descartada→Resuelta (no se resuelve sin inspeccionar); <b>trazabilidad</b>. <b>Serv. III</b> Notificaciones a usuario/cuadrilla/ente (<b>servicios separados</b>, pueden sumarse). <b>Serv. IV</b> Acción remota: cortar/limitar (se encolan y auditan). <b>Se pide:</b> dominio (I y II), Arq. I (pipeline), Arq. II (notificaciones + acción), datos.</p>

          <h2>① Modelado de Dominio (Serv. I y II)</h2>
          <p class="mini"><b>Patrones:</b> <b>Strategy en colección</b> (motor de reglas) + <b>State</b> (orden de trabajo) + bitácora de trazabilidad.</p>
          <div class="uml">${APP.uml(`classDiagram
    class MotorDeDeteccion {
      -reglas
      +analizar(ventana) List
    }
    class ReglaDeDeteccion {
      <<interface>>
      +evaluar(ventana) Alerta
    }
    class ConsumoAnomalo
    class FugaDomiciliaria
    class RoturaCaneria
    class ConexionClandestina
    class Alerta {
      -severidad
      -reglaOrigen
    }
    class OrdenDeTrabajo {
      -estado
      -cuadrilla
      +asignar()
      +inspeccionar()
      +resolver()
    }
    class EstadoOrden {
      <<interface>>
    }
    class Detectada
    class Asignada
    class EnInspeccion
    class Resuelta
    class Transicion {
      -actor
      -fecha
      -observacion
    }
    MotorDeDeteccion o-- "*" ReglaDeDeteccion : tiene muchas
    ReglaDeDeteccion <|.. ConsumoAnomalo : implementa
    ReglaDeDeteccion <|.. FugaDomiciliaria : implementa
    ReglaDeDeteccion <|.. RoturaCaneria : implementa
    ReglaDeDeteccion <|.. ConexionClandestina : implementa
    OrdenDeTrabajo --> "1" Alerta : abre
    OrdenDeTrabajo --> EstadoOrden : estado
    EstadoOrden <|.. Detectada : implementa
    EstadoOrden <|.. Asignada : implementa
    EstadoOrden <|.. EnInspeccion : implementa
    EstadoOrden <|.. Resuelta : implementa
    OrdenDeTrabajo "1" *-- "*" Transicion : trazabilidad`)}</div>
          <p class="mini"><b>Lo que da puntos:</b> el motor guarda una <b>lista</b> de reglas (multiplicidad <code>*</code>) porque “se aplican combinadas”; cada regla decide sola si se cumple (<code>evaluar</code>) → el motor <b>no</b> tiene <code>if</code> por tipo, y agregar una regla es una clase nueva. La orden es <b>State</b> (según el estado cambian las acciones; “no se resuelve sin inspeccionar”). La <b>trazabilidad</b> es una colección de <code>Transicion</code> (actor, fecha, observación).</p>
          <p class="mini"><b>Justificación (para escribir):</b> “Usé un <b>motor de reglas con Strategy</b> porque las reglas se combinan y pueden agregarse más: el motor mantiene una colección y agregar una regla no modifica el resto (Abierto/Cerrado). Usé <b>State</b> para la orden de trabajo porque su ciclo de vida define qué acciones son válidas en cada estado.”</p>

          <h2>② Arquitectura I — Pipeline de detección</h2>
          <div class="uml">${APP.uml(`graph LR
    M["Caudalímetros"] -->|MQTT| BR[("Broker")]
    BR --> DET["Motor de detección<br/>(ventana de tiempo)"]
    DET -->|publica AlertaDetectada| BR2[("Broker eventos")]
    DET --> DB[("alertas / órdenes")]
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style BR2 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style DET fill:#ffe4e9,stroke:#a4133c,color:#0f172a`)}</div>
          <p class="mini">Las lecturas llegan por el <b>broker</b> (asincrónico, amortigua). El <b>motor de detección</b> consume el flujo y evalúa las reglas sobre una <b>ventana de tiempo</b> — clave: la fuga “caudal constante de madrugada” <b>no</b> se detecta con una sola lectura, hay que ver varias horas. Al cumplirse una regla, publica <code>AlertaDetectada</code> (del que se enganchan Alertas y Notificaciones).</p>

          <h2>③ Arquitectura II — Notificaciones + acción remota</h2>
          <div class="uml">${APP.uml(`graph TB
    AL["Serv. Alertas"] -->|publica| B[("Broker Pub-Sub")]
    B --> N1["Notif. Usuario"]
    B --> N2["Notif. Cuadrilla"]
    B --> N3["Notif. Ente"]
    OP["Operador"] --> CMD["Acción remota<br/>(Command)"]
    CMD -->|encola| Q[("Cola comandos")]
    Q --> MED["Caudalímetro"]
    CMD --> AUD[("auditoría")]
    style B fill:#fffbeb,stroke:#b45309,color:#0f172a
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a
    style CMD fill:#ffe4e9,stroke:#a4133c,color:#0f172a`)}</div>
          <p class="mini"><b>Notificaciones = Publicación-Suscripción</b> (no Observer): los notificadores están <b>desplegados por separado</b> → el servicio de Alertas publica el evento en un broker y cada notificador se suscribe; “pueden sumarse más” = agregar un suscriptor no toca al publicador. <b>Acción remota = Command</b>: cortar/limitar se cosifica como comando que se <b>encola</b>, se ejecuta sobre el medidor y queda <b>auditado</b> (quién lo ordenó, resultado); desacopla al operador del medidor.</p>

          <h2>④ Modelo de datos <span class="pill gray">confirmá si entra</span></h2>
          <div class="uml">${APP.uml(`erDiagram
    REGLA { bigint id_regla PK
      varchar tipo
      boolean activa }
    ALERTA { bigint id_alerta PK
      bigint id_regla FK
      varchar severidad
      timestamp detectada_en }
    ORDEN_TRABAJO { bigint id_orden PK
      bigint id_alerta FK
      varchar estado }
    TRANSICION { bigint id_transicion PK
      bigint id_orden FK
      varchar actor
      timestamp fecha
      varchar observacion }
    COMANDO { bigint id_comando PK
      varchar accion
      varchar ordenado_por
      varchar resultado }
    REGLA ||--o{ ALERTA : genera
    ALERTA ||--|| ORDEN_TRABAJO : abre
    ORDEN_TRABAJO ||--|{ TRANSICION : "1..N"`)}</div>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“Las reglas de detección conviene con Strategy en colección.” → <b>V</b>: se combinan y pueden sumarse; el motor guarda una lista.</li>
            <li>“Las notificaciones entre servicios separados se hacen con Observer.” → <b>F</b>: Observer es <b>in-process</b>; entre servicios separados va <b>Publicación-Suscripción</b> con broker.</li>
            <li>“El ciclo de vida de la orden se modela con State.” → <b>V</b>: según el estado cambian las acciones válidas.</li>
            <li>“La fuga ‘caudal constante de madrugada’ se detecta con una sola lectura.” → <b>F</b>: necesita una <b>ventana de tiempo</b>.</li>
            <li>“La acción remota de corte conviene con Command.” → <b>V</b>: se encola, se audita y desacopla al que ordena del que ejecuta.</li>
          </ol>
        </section>

        <!-- ===================== MODELO 3 ===================== -->
        <section class="hoja hoja-hidra">
          <span class="hoja-num">MODELO 3 · SUMINISTRO REMOTO Y ENTE REGULADOR</span>
          <p class="mini"><b>Enunciado (resumen).</b> HIDRA: gestión remota del suministro + rendición al <b>ente regulador</b>. <b>Serv. I</b> Usuarios con <b>roles</b> (ciudadano, operador, inspector, ente); <b>datos personales sensibles</b>. <b>Serv. II</b> Gestión remota: cortar/reponer/limitar; suministro con ciclo de vida (no cortar si ya está cortado); órdenes <b>programables</b>, se <b>encolan</b> y se <b>auditan</b>. <b>Serv. III</b> Reportería: indicadores <b>periódicos</b> al ente (API <b>externa, no nuestra</b>). <b>Serv. IV</b> Canales: portal web + app inspector (a veces <b>sin conexión</b>). <b>Se pide:</b> dominio (I y II), Arq. I (canales + seguridad), Arq. II (reportería + confidencialidad), datos.</p>

          <h2>① Modelado de Dominio (Serv. I y II)</h2>
          <p class="mini"><b>Patrones:</b> <b>State</b> (suministro) + <b>Command</b> (acciones remotas) + roles (RBAC) + historial de acciones.</p>
          <div class="uml">${APP.uml(`classDiagram
    class Usuario {
      -nombre
      +tienePermiso(p)
    }
    class Rol {
      -nombre
    }
    class Suministro {
      -estado
      +ejecutar(comando)
    }
    class EstadoSuministro {
      <<interface>>
      +cortar(s)
      +reponer(s)
    }
    class Activo
    class Cortado
    class Comando {
      <<interface>>
      +ejecutar(s)
    }
    class CortarSuministro
    class LimitarCaudal {
      -caudalMax
    }
    class AccionEjecutada {
      -accion
      -ordenadaPor
      -fecha
      -resultado
    }
    Usuario "*" --> "*" Rol : tiene
    Suministro --> EstadoSuministro : estado
    EstadoSuministro <|.. Activo : implementa
    EstadoSuministro <|.. Cortado : implementa
    Comando <|.. CortarSuministro : implementa
    Comando <|.. LimitarCaudal : implementa
    Comando ..> Suministro : opera
    Suministro "1" *-- "*" AccionEjecutada : historial`)}</div>
          <p class="mini"><b>Lo que da puntos:</b> el <b>Command</b> lleva su configuración adentro (ej. <code>caudalMax</code> de <code>LimitarCaudal</code>), por eso <b>no</b> puede ser un enum: se puede <b>programar</b> (corte por deuda a futuro), <b>encolar</b> y <b>auditar</b>. El <b>State</b> hace que “no se corta uno ya cortado / no se opera sobre uno de baja” viva en cada estado. El <b>historial</b> cumple el “debe poder consultarse el historial de acciones”.</p>
          <p class="mini"><b>Justificación (para escribir):</b> “Usé <b>Command</b> para las acciones remotas porque el enunciado pide programarlas, encolarlas y auditarlas: cada acción es un objeto con su configuración que se ejecuta después, desacoplando al operador del medidor. Usé <b>State</b> para el suministro porque según su estado se habilitan o no las operaciones.”</p>

          <h2>② Arquitectura I — Canales + seguridad</h2>
          <div class="uml">${APP.uml(`graph TB
    WEB["Portal Ciudadano (web)"] --> API["API REST del backend"]
    INS["App Inspector (offline)"] --> API
    IDM["Identidades / roles"] -.-> API
    API --> S1["Serv. Usuarios"]
    API --> S2["Serv. Suministro"]
    S2 --> Q[("Cola de comandos")]
    Q --> MED["Medidores"]
    style API fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a`)}</div>
          <p class="mini">Web y mobile son <b>dos clientes de la misma API REST</b> (multi-canal con lo del temario; el gateway/BFF sería un plus, y no está en el temario). El inspector <b>offline</b>: guarda las inspecciones localmente y <b>sincroniza</b> al recuperar conexión (operaciones <b>idempotentes</b> para no duplicar). Seguridad por <b>roles (RBAC)</b> validada en el backend; contraseñas <b>hasheadas</b>. Las acciones remotas se <b>encolan</b> hacia los medidores.</p>

          <h2>③ Arquitectura II — Reportería + confidencialidad</h2>
          <div class="uml">${APP.uml(`graph LR
    CRON["Cron mensual"] --> REP["Serv. Reportería"]
    REP --> DB[("datos HIDRA")]
    REP --> AD["EnteAdapter"]
    AD -->|HTTPS| ENTE["Ente Regulador<br/>(externo)"]
    style REP fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style ENTE fill:#f1f5f9,stroke:#64748b,color:#0f172a`)}</div>
          <p class="mini"><b>Reportería = Cron</b> (tarea programada, periódica) <b>+ Adapter</b> a la API del ente (externa, no nuestra); si el servicio corre en <b>varias instancias</b>, garantizar <b>ejecución única</b> (lock distribuido). <b>Confidencialidad</b> de los datos personales = <b>cifrado en reposo</b> (AES a nivel columna) en los campos sensibles + <b>TLS</b> en tránsito + control de acceso por rol. El <b>hash no aplica</b> (los datos hay que poder leerlos; el hash es sólo para contraseñas).</p>

          <h2>④ Modelo de datos <span class="pill gray">confirmá si entra</span></h2>
          <div class="uml">${APP.uml(`erDiagram
    USUARIO { bigint id_usuario PK
      varchar nombre
      varchar documento }
    ROL { bigint id_rol PK
      varchar nombre UK }
    USUARIO_ROL { bigint id_usuario PK
      bigint id_rol PK }
    SUMINISTRO { bigint id_suministro PK
      varchar estado }
    ACCION_EJECUTADA { bigint id_accion PK
      bigint id_suministro FK
      varchar accion
      bigint id_operador
      timestamp fecha }
    USUARIO ||--|{ USUARIO_ROL : ""
    ROL ||--|{ USUARIO_ROL : "N:M"
    SUMINISTRO ||--o{ ACCION_EJECUTADA : "1..N historial"`)}</div>
          <p class="mini">La relación <b>Usuario–Rol es N:M</b> → se resuelve con la <b>tabla intermedia</b> <code>USUARIO_ROL</code>. Datos sensibles (documento) conviene <b>cifrados</b>.</p>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“Las acciones de corte programables conviene con Command.” → <b>V</b>: objeto con configuración, encolable, programable y auditable.</li>
            <li>“La confidencialidad de datos personales se logra con HTTPS.” → <b>F</b>: HTTPS es <b>en tránsito</b>; los datos <b>almacenados</b> van con <b>cifrado en reposo</b>.</li>
            <li>“La reportería periódica al ente se hace con Cron + Adapter.” → <b>V</b>: periódica (cron) hacia una API externa que no controlamos (adapter).</li>
            <li>“Para multi-canal (web + mobile) hace falta sí o sí un API Gateway.” → <b>F</b>: alcanza con clientes sobre la misma <b>API REST</b>; gateway/BFF es un plus (fuera del temario).</li>
            <li>“Las contraseñas se guardan cifradas para poder recuperarlas.” → <b>F</b>: se guardan <b>hasheadas</b> (con salt); el hash es irreversible.</li>
          </ol>
        </section>
      `;
      APP.rerenderMermaid(el);
    },
  });
})();
