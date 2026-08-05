/* ============================================================
   Parcial HIDRA — Modelo 3: Suministro remoto y Ente Regulador
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p><b>HIDRA</b> permite la <b>gestión remota del suministro</b> y debe rendir cuentas al <b>ente regulador</b> del
    servicio sanitario. Además atiende a distintos usuarios: ciudadanos, operadores e inspectores de campo. Este modelo se
    concentra en la <b>gestión remota, la reportería regulatoria, los canales y la seguridad</b>.</p>

    <h4>Servicio I — Usuarios, Cuentas y Roles</h4>
    <p>Administra a las personas que usan el sistema con distintos <b>roles</b>: <b>ciudadano</b> (ve su consumo, paga,
    reporta problemas), <b>operador</b> (ordena cortes/reposiciones), <b>inspector</b> (releva en campo) y <b>ente
    regulador</b> (consulta indicadores). Se manejan <b>datos personales sensibles</b> (documento, domicilio, contacto)
    que requieren <b>confidencialidad</b>.</p>

    <h4>Servicio II — Gestión Remota del Suministro</h4>
    <p>Permite <b>cortar</b>, <b>reponer</b> o <b>limitar</b> el caudal de un suministro en forma remota. El suministro
    tiene un <b>ciclo de vida</b> (activo, cortado, limitado, dado de baja) y según su estado se permiten o no las
    operaciones (no se puede cortar un suministro ya cortado; no se opera sobre uno de baja). Las órdenes se pueden
    <b>programar</b> (por ejemplo, corte automático por deuda a partir de una fecha), se <b>encolan</b> para ejecutarse
    sobre el medidor, y quedan <b>auditadas</b> (qué acción, quién la ordenó, cuándo, resultado). Debe poder consultarse el
    historial de acciones de cada suministro.</p>

    <h4>Servicio III — Reportería Regulatoria</h4>
    <p>El ente regulador exige <b>indicadores periódicos</b> (agua no facturada, cantidad de fugas detectadas, tiempo
    medio de resolución, cortes efectuados). HIDRA los calcula y los <b>envía periódicamente</b> al sistema del ente, que
    expone su propia API y <b>no es de nuestra propiedad</b>.</p>

    <h4>Servicio IV — Canales de acceso</h4>
    <p>Hay un <b>portal web del ciudadano</b> y una <b>app mobile del inspector</b> (que a veces trabaja <b>sin conexión</b>
    en el campo). No hay equipo mobile propio, y se prevé sumar más canales. Los <b>contratos de los servicios no deben
    cambiar por necesidades de las interfaces</b>.</p>

    <h4>Se pide</h4>
    <p><b>1) Modelado de Dominio</b> — Capa de dominio de los <b>Servicios I y II</b>.
    <b>2) Arquitectura I</b> — Despliegue + componentes generales, contemplando los <b>canales</b> y la <b>seguridad</b>.
    <b>3) Arquitectura II</b> — Diseñe la <b>reportería al ente regulador</b> y el mecanismo de <b>confidencialidad</b> de
    los datos personales.
    <b>4) Modelo de Datos</b> — DER de usuarios/roles, suministros y el historial de acciones remotas.</p>`;

  const RUBRICA = [
    { t: "Dominio: <b>State</b> para el ciclo de vida del suministro (activo/cortado/limitado/baja)", p: 8 },
    { t: "Las reglas “no cortar si ya está cortado / no operar si es baja” viven en el estado", p: 5 },
    { t: "Dominio: <b>Command</b> para las acciones remotas (encolables, programables, auditables)", p: 8 },
    { t: "El comando desacopla al operador (invoker) del medidor (receiver) y guarda su configuración", p: 5 },
    { t: "Modelé la <b>auditoría / historial</b> de acciones por suministro", p: 5 },
    { t: "Usuarios con <b>roles</b> (RBAC): ciudadano, operador, inspector, ente", p: 6 },
    { t: "Justifiqué State y Command citando el enunciado (encolan/auditan/según estado)", p: 5 },
    { t: "Arq I: multi-canal resuelto (web y mobile sobre la misma API REST; gateway/BFF es plus fuera del temario)", p: 8 },
    { t: "Arq I: contemplé el trabajo <b>offline</b> del inspector (sincronización diferida)", p: 5 },
    { t: "Arq I: componente de identidad (<b>IDM</b>) y autenticación en el borde", p: 5 },
    { t: "Arq II: reportería con <b>Cron</b> (periódica) + <b>Adapter</b> al ente (API externa no propia)", p: 8 },
    { t: "Arq II: mencioné ejecución única del cron si hay varias instancias", p: 3 },
    { t: "Arq II: confidencialidad = <b>cifrado en reposo</b> (columna/AES) con claves en KMS; datos en tránsito con TLS", p: 8 },
    { t: "Datos: DER de usuario/rol/permiso, suministro y comando/auditoría (PK/FK/cardinalidad)", p: 8 },
    { t: "Justifiqué cada decisión con los 4 elementos", p: 4 },
  ];

  D.finales.push({ id: "hidra-3", nombre: "HIDRA · Modelo 3 (Suministro remoto y Ente)", fecha: "práctica", duracion: 150, enunciado: ENUNCIADO, rubrica: RUBRICA });

  APP.register({
    id: "hidra-3",
    title: "Modelo 3 · Suministro remoto y Ente",
    tag: "📋",
    group: "Parcial HIDRA (práctica)",
    resumen: "Command · State · cron+Adapter · BFF · seguridad",
    keywords: ["hidra", "corte", "reposicion", "suministro", "ente regulador", "reporteria", "bff", "seguridad", "command", "state", "cron"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial HIDRA · Modelo de práctica 3</div>
          <h1>Suministro remoto y Ente Regulador</h1>
          <p class="lead">El modelo más “de arquitectura”: <b>Command + State</b>, <b>BFF</b>, <b>cron + Adapter</b> y <b>seguridad</b>.</p>
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
            <tr><td>“ciclo de vida… según el estado se permite/no”</td><td><b>State</b> (Estado) del suministro</td></tr>
            <tr><td>“cortar/reponer/limitar… <b>programar</b>… <b>encolan</b>… <b>auditadas</b>”</td><td><b>Command</b> (Comando)</td></tr>
            <tr><td>“distintos <b>roles</b>: ciudadano, operador, inspector, ente”</td><td><b>RBAC</b> (roles y permisos)</td></tr>
            <tr><td>“portal web + app mobile… sin equipo mobile… <b>contratos no deben cambiar</b>”</td><td><b>BFF</b> por canal</td></tr>
            <tr><td>“inspector trabaja <b>sin conexión</b>”</td><td>Sincronización diferida / offline-first</td></tr>
            <tr><td>“indicadores <b>periódicos</b>… al ente… API <b>no es nuestra</b>”</td><td><b>Cron</b> + <b>Adapter</b></td></tr>
            <tr><td>“datos personales sensibles… <b>confidencialidad</b>”</td><td>Cifrado en reposo + TLS + control de acceso</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1 — Modelado de dominio</h2>
        ${APP.uml(`classDiagram
    class Suministro {
        -estado: EstadoSuministro
        -historial: List~AccionEjecutada~
        +ejecutar(Comando)
        +cortar()
        +reponer()
        +limitar()
    }
    class EstadoSuministro {
        <<interface>>
        +cortar(Suministro)
        +reponer(Suministro)
        +limitar(Suministro)
        +nombre() String
    }
    class Activo
    class Cortado
    class Limitado
    class DadoDeBaja
    class Comando {
        <<interface>>
        +ejecutar(Suministro)
        +descripcion() String
    }
    class CortarSuministro
    class ReponerSuministro
    class LimitarCaudal {
        -caudalMax: double
    }
    class ProgramadorDeOrdenes {
        -pendientes: List~OrdenProgramada~
        +encolar(Comando, Suministro, LocalDateTime)
    }
    class AccionEjecutada {
        -accion: String
        -ordenadaPor: Operador
        -fecha: LocalDateTime
        -resultado: String
    }
    EstadoSuministro <|.. Activo
    EstadoSuministro <|.. Cortado
    EstadoSuministro <|.. Limitado
    EstadoSuministro <|.. DadoDeBaja
    Comando <|.. CortarSuministro
    Comando <|.. ReponerSuministro
    Comando <|.. LimitarCaudal
    Suministro --> EstadoSuministro
    Suministro "1" *-- "*" AccionEjecutada
    ProgramadorDeOrdenes o-- "*" Comando
    Comando ..> Suministro`, "Servicios I y II · State + Command")}
        <div class="callout key">
          <div class="callout-title">🔑 State + Command juntos (clásico)</div>
          <ul>
            <li><b>State:</b> el suministro decide, según su estado, si acepta la operación (no se corta lo ya cortado).</li>
            <li><b>Command:</b> cada acción remota es un objeto que se puede <b>programar</b> (corte por deuda a una fecha),
            <b>encolar</b> y <b>auditar</b>. Un enum no serviría porque el comando lleva configuración (ej. el caudal máximo
            de <code>LimitarCaudal</code>) y se guarda para ejecutarse después.</li>
            <li><b>Historial (AccionEjecutada):</b> cumple el “debe poder consultarse el historial de acciones”.</li>
          </ul>
        </div>

        <h2>3 · Punto 2 — Arquitectura I (canales + seguridad)</h2>
        ${APP.uml(`graph TB
    CIU["🌐 Portal Ciudadano"] --> BFF1["BFF Ciudadano"]
    INS["📱 App Inspector<br/>(offline)"] --> BFF2["BFF Inspector"]
    BFF1 --> GW["🚪 API Gateway"]
    BFF2 --> GW
    IDM["🔐 IDM / SSO"] -.-> GW
    GW --> S1["Usuarios y Roles"]
    GW --> S2["Gestión de Suministro"]
    GW --> S3["Reportería"]
    S2 --> Q["📨 Cola de comandos"]
    Q --> AG["Gateway IoT"] -->|MQTT| MED["🔧 Medidores"]
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Gateway + BFF por canal + seguridad")}
        <div class="callout warn">
          <div class="callout-title">📋 Nota de temario</div>
          <p><b>Gateway y BFF no están en el temario de tu parcial.</b> La respuesta alineada al temario es más simple:
          <b>el portal web y la app del inspector consumen la misma API REST del backend</b> (Cliente-Servidor +
          Arquitectura Web); la seguridad se centraliza en el backend con roles. Dejamos abajo la versión “con gateway/BFF”
          como plus, pero no la necesitás para aprobar.</p>
        </div>
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo (versión completa, con el plus fuera del temario)</div>
          <ul>
            <li><b>Versión temario:</b> web y mobile son dos <b>clientes</b> que consumen la misma <b>API REST</b>; el backend
            expone los endpoints y valida la seguridad. Alcanza para el multi-canal.</li>
            <li><span class="pill gray">plus</span> <b>API Gateway + BFF por canal:</b> uno para el portal ciudadano y otro para la app del inspector. Cada BFF
            compone lo que su canal necesita, sin cambiar los contratos de los servicios. Sumar un canal nuevo = otro BFF.</li>
            <li><b>Offline del inspector:</b> la app guarda las inspecciones localmente y <b>sincroniza</b> cuando recupera
            conexión (con operaciones idempotentes para no duplicar al reintentar).</li>
            <li><b>Seguridad en el borde:</b> un <b>IDM</b> gestiona identidades y el gateway valida el token; los permisos
            por <b>rol</b> (RBAC) separan ciudadano / operador / inspector / ente.</li>
          </ul>
        </div>

        <h2>4 · Punto 3 — Arquitectura II (reportería + confidencialidad)</h2>
        ${APP.uml(`graph LR
    CRON["⏰ Cron mensual"] --> REP["Servicio de Reportería"]
    REP -->|"calcula indicadores"| DB[("datos HIDRA")]
    REP --> AD["EnteAdapter"]
    AD -->|"HTTPS · API del ente"| ENTE["🏛️ Ente Regulador<br/>(externo, no propio)"]
    style REP fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style ENTE fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Reportería regulatoria")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <ul>
            <li><b>Reportería = Cron + Adapter:</b> un proceso <b>programado</b> (mensual) calcula los indicadores y los
            envía a la API del <b>ente regulador</b>, que <b>no es nuestra</b> → se integra por <b>Adapter</b>
            (<code>ProveedorRegulatorio</code> como interfaz; <code>EnteAdapter</code> traduce). Si el servicio corre en
            varias instancias, hay que garantizar <b>ejecución única</b> (lock distribuido).</li>
            <li><b>Confidencialidad:</b> datos personales cifrados <b>en reposo</b> (AES a nivel columna para documento,
            domicilio, contacto), con las claves en un <b>KMS</b> externo; <b>TLS</b> para los datos en tránsito; y control
            de acceso por rol para que sólo quien corresponde vea los datos sensibles. El hash <b>no</b> aplica (los datos
            hay que poder leerlos); es sólo para contraseñas.</li>
          </ul>
        </div>

        <h2>5 · Punto 4 — Modelo de datos</h2>
        <div class="callout bad"><p><b>❓ Ojo:</b> bases de datos <b>no está en el listado de contenidos</b> que viste. Si esta sección entra, será un <b>DER básico</b>. El de abajo es completo por si acaso; en el parcial hacé la versión simple (entidades, PK, FK, cardinalidad).</p></div>
        ${APP.uml(`erDiagram
    USUARIO {
        bigint  id_usuario  PK
        varchar nombre      "NOT NULL"
        varchar documento   "cifrado NOT NULL"
        varchar email       "cifrado"
    }
    ROL {
        bigint  id_rol      PK
        varchar nombre      "UK NOT NULL"
    }
    USUARIO_ROL {
        bigint  id_usuario  PK,FK
        bigint  id_rol      PK,FK
    }
    SUMINISTRO {
        bigint  id_suministro PK
        varchar domicilio     "cifrado NOT NULL"
        varchar estado        "NOT NULL CHECK(ACTIVO,CORTADO,LIMITADO,BAJA)"
    }
    ACCION_EJECUTADA {
        bigint  id_accion     PK
        bigint  id_suministro FK "NOT NULL"
        varchar accion        "CORTAR|REPONER|LIMITAR"
        bigint  id_operador       "ref lógica NOT NULL"
        timestamp fecha       "NOT NULL"
        timestamp programada_para
        varchar resultado
    }
    USUARIO      ||--|{ USUARIO_ROL : ""
    ROL          ||--|{ USUARIO_ROL : "N:M"
    SUMINISTRO   ||--o{ ACCION_EJECUTADA : "1..N historial"`, "DER usuarios/roles + acciones")}

        <h2>6 · Trampas</h2>
        <div class="trampa"><b>“Contratos no deben cambiar por la UI”.</b> En el temario alcanza con que web y mobile usen la
        misma API REST. (Fuera del temario, la respuesta “fina” es BFF.) Si agregás endpoints “para mobile” en
        cada servicio, hacés justo lo que el enunciado prohíbe.</div>
        <div class="trampa"><b>Confidencialidad de datos personales.</b> Es cifrado <b>en reposo</b> (no TLS solo, no hash).
        Y decí dónde viven las claves (KMS).</div>
        <div class="trampa"><b>Reportería “periódica” a una API “que no es nuestra”.</b> Cron (periódico) + Adapter
        (externo). Y ojo con la ejecución única si hay varias instancias.</div>
        <div class="trampa"><b>Órdenes “programadas”.</b> El corte por deuda a futuro refuerza Command (se crea hoy, se
        ejecuta después), no una llamada directa.</div>

        <h2>7 · Rúbrica</h2>
        <div id="rubHidra3"></div>
      `;
      APP.rubrica(el.querySelector("#rubHidra3"), "hidra-3", RUBRICA);
    },
  });
})();
