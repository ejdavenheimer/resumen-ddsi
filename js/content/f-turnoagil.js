/* ============================================================
   Final resuelto — TurnoÁgil (28/02/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p><b>TurnoÁgil</b> es una plataforma centralizada de gestión de turnos médicos bajo demanda, usada por diversas
    clínicas privadas adheridas. Funciona dentro de un modelo de cobertura unificado —una única red de salud— en el que
    los pacientes cuentan con distintos niveles de plan (por ejemplo, Básico y Premium). Su propósito es permitir la
    reserva de turnos en tiempo real, incorporando el cálculo automático de copagos según el plan del paciente, así como
    el registro de eventos clínicos relevantes.</p>

    <h4>Servicio I — Gestión de Profesionales y Agendas</h4>
    <p>Administra los profesionales y sus agendas. De cada profesional se registra: matrícula, nombre, especialidades y
    consultorios. Cada agenda define franjas horarias disponibles por día. Además, <b>cada especialidad tiene definido un
    valor base del turno administrable por clínica</b>. Debe exponer un endpoint para consultar disponibilidad por
    profesional y especialidad.</p>

    <h4>Servicio II — Motor de Cobertura y Copagos</h4>
    <p>Calcula el copago según <b>reglas configurables definidas a nivel plataforma</b> (globales para todas las clínicas).
    Las clínicas no pueden modificar estas reglas, sólo informar el plan del paciente. Actualmente existen 3 reglas que
    <b>se pueden aplicar de manera conjunta</b> (no excluyentes entre sí), pero <b>podrían agregarse nuevas</b>:</p>
    <ul>
      <li><b>Cobertura Total:</b> si el plan es “Premium”, copago = 0.</li>
      <li><b>Plan Básico:</b> copago = 30% del valor base del turno.</li>
      <li><b>Recargo Urgente:</b> si el turno se solicita con menos de 2 horas de anticipación, +20% sobre el valor base.</li>
    </ul>

    <h4>Servicio III — Validación Clínica</h4>
    <p>Antes de confirmar el turno, el paciente debe completar un breve cuestionario según la especialidad.
    <b>Las preguntas deben poder ser configurables por un administrador de la plataforma.</b> El Sistema envía las
    respuestas a un <b>motor externo de validación médica</b>, que expone un endpoint REST. Si el motor detecta un riesgo
    alto, el turno se marca como <b>“Requiere Revisión Médica”</b>: un profesional médico deberá revisar el cuestionario
    para determinar si el paciente debe atenderse con urgencias, cancelando su turno.</p>

    <h4>Servicio IV — Reservas</h4>
    <p>Gestiona la creación y el <b>ciclo de vida</b> de los turnos. Toma como entrada: paciente, profesional,
    especialidad, fecha/hora, cobertura y cuestionario. Debe registrar una <b>bitácora completa de eventos</b>
    (creación, validación, cálculo de copago, revisión médica, cancelación, asistido, ausente). El pago y la facturación
    están completamente fuera del alcance, pero el sistema expone el <b>código único de reserva</b> para sistemas externos.</p>

    <h4>Punto 1 — Arquitectura (35 pts)</h4>
    <p><b>A (12,5)</b> — El servicio externo de revisión médica expone únicamente una API REST y <b>puede demorar varios
    minutos</b> en responder. <b>No puede ser modificado pues no es de nuestra propiedad.</b> Analice el diagrama
    propuesto e indique si la arquitectura es correcta o presenta problemas; explique qué componentes o responsabilidades
    faltan o sobran y por qué.</p>
    <p><b>B (12,5)</b> — Proponga una alternativa arquitectónica <b>más simple</b> para integrar las validaciones
    pendientes, justificando sus decisiones.</p>
    <p><b>C (10)</b> — No se cuenta con equipo de desarrollo mobile, pero se prevé incorporar una app mobile para usuarios
    recurrentes; hoy los inversores aceptan el uso vía web. Proponga una arquitectura de frontend que permita desacoplar
    las interfaces del backend, facilitar la reutilización de lógica y soportar múltiples canales.
    <b>Los contratos de los microservicios no deben cambiar por necesidades de las interfaces gráficas.</b></p>

    <h4>Punto 2 — Modelado de Dominio (30 pts)</h4>
    <p><b>A (20)</b> — Documentar los Servicios II, III y IV, <b>únicamente de la capa de dominio</b>, con un diagrama por
    servicio. <b>B (10)</b> — Justificar las decisiones de diseño.</p>

    <h4>Punto 3 — Modelo de Datos (35 pts)</h4>
    <p><b>A (25)</b> — Modelo de datos relacional de los Servicios I, III y IV, un diagrama por servicio, con PK, FK,
    cardinalidad, modalidad y restricciones. <b>B (10)</b> — Qué persistir, cómo resolvió los impedance mismatches y qué
    desnormalizar.</p>`;

  const RUBRICA = [
    { t: "Detecté que el problema del diagrama es la <b>integración sincrónica</b> con un servicio de minutos", p: 6 },
    { t: "Nombré qué <b>falta</b>: cola/outbox, worker, estado intermedio, timeouts y reintentos", p: 6 },
    { t: "Propuse una alternativa <b>más simple</b> (no otra arquitectura compleja) y justifiqué por qué es suficiente", p: 8 },
    { t: "Punto C: <b>API Gateway + BFF por canal</b>, con la lógica quedándose en los servicios", p: 6 },
    { t: "Punto C: mencioné cliente liviano/pesado y reutilización de lógica (design system, SDK compartido)", p: 4 },
    { t: "Servicio II con <b>Strategy en colección</b> de reglas configurables", p: 8 },
    { t: "Cada regla decide sola si aplica; el motor no tiene <code>if</code>", p: 4 },
    { t: "Servicio III con <b>cuestionario configurable</b> (preguntas como entidad, no hardcodeadas)", p: 8 },
    { t: "Servicio III con <b>Adapter</b> al motor externo y estado “Requiere Revisión Médica”", p: 5 },
    { t: "Servicio IV con <b>State</b> para el ciclo de vida de la reserva", p: 8 },
    { t: "Servicio IV con <b>bitácora</b> de los 7 eventos que enumera el enunciado", p: 6 },
    { t: "No dibujé controllers, DTOs ni repositorios (el punto pide sólo dominio)", p: 4 },
    { t: "DER Servicio I: agenda, franjas y <b>valor base por especialidad Y clínica</b>", p: 8 },
    { t: "DER Servicio III: preguntas configurables por especialidad + respuestas del paciente", p: 8 },
    { t: "DER Servicio IV: reserva con <b>código único</b> + bitácora en tabla aparte", p: 8 },
    { t: "Justifiqué impedance mismatches (herencia, colecciones, value objects) y desnormalizaciones", p: 5 },
  ];

  D.finales.push({
    id: "f-turnoagil", nombre: "TurnoÁgil", fecha: "28/02/2026", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-turnoagil",
    title: "TurnoÁgil",
    tag: "📄",
    group: "Finales resueltos",
    resumen: "28/02/2026 · turnos médicos",
    keywords: ["turnoagil", "final", "turnos", "copago", "cuestionario", "bff", "reserva"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Final resuelto · 28/02/2026</div>
          <h1>TurnoÁgil</h1>
          <p class="lead">Turnos médicos bajo demanda. Arquitectura 35 · Dominio 30 · Datos 35.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“valor base del turno <b>administrable por clínica</b>”</td><td>El valor no es de la especialidad sola: es de la <b>tupla (clínica, especialidad)</b></td></tr>
            <tr><td>“reglas configurables… <b>podrían agregarse nuevas</b>”</td><td><b>Strategy</b> + OCP</td></tr>
            <tr><td>“se pueden aplicar de <b>manera conjunta</b> (no excluyentes)”</td><td>El motor guarda una <b>colección</b> y las encadena</td></tr>
            <tr><td>“las clínicas <b>no pueden modificar</b> estas reglas”</td><td>Las reglas son globales de plataforma: no van en el modelo de la clínica</td></tr>
            <tr><td>“las preguntas deben poder ser <b>configurables por un administrador</b>”</td><td><b>Pregunta es una entidad</b>, con ABM y asociada a especialidad. No es un formulario hardcodeado.</td></tr>
            <tr><td>“expone únicamente una API REST”, “<b>no puede ser modificado</b>”</td><td><b>Adapter</b> obligatorio + no se le puede pedir un webhook</td></tr>
            <tr><td>“puede demorar <b>varios minutos</b>”</td><td><b>Asincronismo</b> del lado nuestro</td></tr>
            <tr><td>“se marca como <b>Requiere Revisión Médica</b>… un profesional deberá revisar”</td><td>Estado + intervención humana</td></tr>
            <tr><td>“<b>ciclo de vida</b> de los turnos”, lista de 7 eventos</td><td><b>State</b> + <b>bitácora</b></td></tr>
            <tr><td>“el pago y la facturación están <b>fuera del alcance</b>”</td><td>No modelar pagos; sólo exponer el código único</td></tr>
            <tr><td>“los contratos de los microservicios <b>no deben cambiar</b> por la UI”</td><td><b>BFF</b></td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1.A — Análisis crítico de la arquitectura</h2>
        <p>El punto es de <b>análisis</b>: hay que decir qué está mal y por qué, no dibujar de cero. El problema central
        siempre es el mismo: un servicio que tarda minutos <b>colgado del camino sincrónico del usuario</b>.</p>
        ${APP.uml(`graph LR
    U["👤 Paciente"] -->|"POST /reservas"| S4["Servicio IV<br/>Reservas"]
    S4 -->|"HTTP sync ⏳"| S3["Servicio III<br/>Validación Clínica"]
    S3 -->|"HTTP sync ⏳<br/>puede tardar MINUTOS"| EXT["🏥 Motor externo<br/>de validación médica"]
    style EXT fill:#fef2f2,stroke:#dc2626,color:#0f172a
    style S3 fill:#fef2f2,stroke:#dc2626,color:#0f172a`, "❌ El problema")}
        <div class="callout bad">
          <div class="callout-title">Qué está mal</div>
          <ul>
            <li><b>Acoplamiento temporal en toda la cadena.</b> El paciente queda bloqueado esperando un proceso de minutos;
            se van a comer los timeouts del navegador, del gateway y del balanceador.</li>
            <li><b>Hilos y conexiones retenidos.</b> Cada reserva ocupa recursos del Servicio IV y del III durante minutos:
            con pocas reservas concurrentes se satura el pool.</li>
            <li><b>Falla en cascada.</b> Si el motor externo se cae o se degrada, <b>no se puede reservar ningún turno</b>,
            aunque la reserva en sí sea perfectamente válida.</li>
            <li><b>No hay estado intermedio.</b> La reserva no puede existir “esperando validación”, así que o se crea todo
            o no se crea nada. Eso contradice el enunciado, que sí define un estado “Requiere Revisión Médica”.</li>
            <li><b>Reintentos imposibles.</b> Si la llamada falla a la mitad, no queda nada persistido para reintentar.</li>
          </ul>
          <p><b>Qué falta:</b> persistir la reserva en estado <code>PENDIENTE_DE_VALIDACION</code> antes de llamar al
          externo; un mecanismo asincrónico (cola o tabla de trabajos) que desacople; un <b>worker</b> que haga el
          <i>polling</i> contra el motor externo; timeouts, reintentos con backoff y <b>circuit breaker</b>; y un canal
          para avisarle al paciente cuando se resuelva.</p>
          <p><b>Qué sobra:</b> nada estructural — sobra la <b>responsabilidad</b> de esperar que el Servicio IV le puso
          al Servicio III. La validación no debe estar en la ruta crítica de la confirmación.</p>
        </div>

        <h2>3 · Punto 1.B — Alternativa más simple</h2>
        <div class="callout warn">
          <p><b>Leé bien el enunciado:</b> pide una alternativa <b>más simple</b>. Es una trampa: mucha gente responde
          con Kafka, sagas y event sourcing, y eso va en contra de lo que se pide. La respuesta correcta es la
          <b>solución más chica que resuelve el problema</b>.</p>
        </div>
        ${APP.uml(`graph TB
    U["👤 Paciente"] -->|"POST /reservas"| S4["Servicio IV<br/>Reservas"]
    S4 -->|"201 Created<br/>estado: PENDIENTE_VALIDACION"| U
    S4 -->|"guarda la reserva +<br/>una fila en VALIDACION_PENDIENTE"| DB[("DB IV")]
    W["⏰ Worker / @Scheduled<br/>cada 30 s"] --> DB
    W -->|"HTTP · polling con timeout,<br/>reintentos y circuit breaker"| EXT["🏥 Motor externo<br/>(no modificable)"]
    W -->|"actualiza estado"| DB
    W -->|"notifica"| U
    style W fill:#ecfdf5,stroke:#059669,color:#0f172a`, "✅ Alternativa simple: tabla de pendientes + worker")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <p>“La reserva se crea y se persiste inmediatamente en estado <code>PENDIENTE_DE_VALIDACION</code>, junto con
          una fila en una tabla <code>VALIDACION_PENDIENTE</code> (patrón <b>outbox / cola en base de datos</b>).
          El paciente recibe <code>201 Created</code> al instante con el código de reserva y ese estado visible.”</p>
          <p>“Un <b>worker programado</b> (<code>@Scheduled</code> cada 30 segundos) toma los pendientes y llama al motor
          externo con <b>timeout acotado, reintentos con backoff exponencial y circuit breaker</b>. Como el servicio
          externo <b>no puede ser modificado</b>, no podemos pedirle un webhook: por eso el <i>polling</i> desde nuestro
          lado es la opción realista. Al resolverse, el worker transiciona la reserva a <code>CONFIRMADA</code> o a
          <code>REQUIERE_REVISION_MEDICA</code>, registra la bitácora y notifica al paciente.”</p>
          <p>“<b>Por qué es la alternativa <i>más simple</i>:</b> no requiere incorporar ni operar un message broker.
          Con el volumen de una plataforma de turnos, una tabla de pendientes con un worker cumple exactamente la misma
          función —desacoplar temporalmente, permitir reintentos y sobrevivir a caídas— con infraestructura que ya
          tenemos. Si más adelante el volumen lo justifica, migrar a un broker es directo porque el diseño ya está
          desacoplado.”</p>
          <p>“<b>Trade-off:</b> el <i>polling</i> agrega latencia (hasta 30 s) y algo de carga innecesaria comparado con
          un push. Es aceptable frente a un proceso que de por sí tarda minutos.”</p>
        </div>

        <h2>4 · Punto 1.C — Arquitectura de frontend</h2>
        ${APP.uml(`graph TB
    WEB["🌐 Web (SPA)"] --> BFFW["BFF Web"]
    MOB["📱 Mobile (futuro)"] --> BFFM["BFF Mobile"]
    BFFW --> GW["🚪 API Gateway"]
    BFFM --> GW
    IDM["🔐 IDM / OAuth2"] -.-> GW
    GW --> S1["Servicio I"]
    GW --> S2["Servicio II"]
    GW --> S3["Servicio III"]
    GW --> S4["Servicio IV"]
    DS["📦 Design System +<br/>SDK de cliente compartido"] -.-> WEB
    DS -.-> MOB
    style BFFW fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BFFM fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Gateway + BFF por canal")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <p>“Propongo <b>API Gateway + un BFF por canal</b>. Cada BFF compone y adapta las respuestas que ese canal
          necesita (la web puede pedir la agenda completa; mobile, una versión reducida), de modo que <b>los contratos
          de los microservicios no cambian por necesidades de la UI</b>, que es la restricción explícita del enunciado.”</p>
          <p>“Opto por un <b>cliente liviano</b>: la lógica de negocio queda en los servicios y el frontend se ocupa de
          presentación y navegación. Es lo más conveniente para la <b>mantenibilidad</b> —no hay reglas duplicadas entre
          web y mobile, que se desincronizarían— y porque <b>no hay equipo mobile especializado</b>: cuanto menos lógica
          haya que replicar en la app, más barato es incorporarla. Además, evita tener que actualizar la app en la tienda
          cada vez que cambia una regla de negocio.”</p>
          <p>“Para la <b>reutilización de lógica</b> entre canales: un <b>SDK de cliente</b> generado desde la
          especificación OpenAPI del BFF (tipos y llamadas compartidos) y un <b>design system</b> con los componentes de
          UI. Mientras tanto, arrancamos sólo con el BFF Web —el segundo se agrega cuando exista la app— para no pagar
          hoy una complejidad que todavía no se necesita.”</p>
        </div>

        <h2>5 · Punto 2 — Modelado de dominio</h2>
        <div class="callout warn">
          <p><b>El punto dice “únicamente de la capa de dominio”.</b> Nada de controllers, DTOs ni implementaciones de
          repositorio: eso descuenta.</p>
        </div>

        <h3>Servicio II — Motor de Copagos</h3>
        ${APP.uml(`classDiagram
    class ReglaDeCopago {
        <<interface>>
        +aplica(SolicitudDeCopago) boolean
        +aplicar(SolicitudDeCopago, Monto) ResultadoDeRegla
        +nombre() String
        +prioridad() int
    }
    class CoberturaTotal { -planesCubiertos: Set~NivelDePlan~ }
    class PlanBasico { -porcentaje: Porcentaje }
    class RecargoUrgente {
        -horasDeAnticipacion: int
        -porcentaje: Porcentaje
    }
    class MotorDeCopagos {
        -reglas: List~ReglaDeCopago~
        +calcular(SolicitudDeCopago) Copago
    }
    class SolicitudDeCopago {
        -valorBase: Monto
        -plan: NivelDePlan
        -fechaHoraDelTurno: LocalDateTime
        -solicitadoEn: LocalDateTime
        +horasDeAnticipacion() long
    }
    class Copago {
        -monto: Monto
        -aplicadas: List~ResultadoDeRegla~
    }
    class ResultadoDeRegla {
        -regla: String
        -efecto: String
        -detalle: String
    }
    class NivelDePlan {
        <<enumeration>>
        BASICO
        PREMIUM
    }
    ReglaDeCopago <|.. CoberturaTotal
    ReglaDeCopago <|.. PlanBasico
    ReglaDeCopago <|.. RecargoUrgente
    MotorDeCopagos o-- "*" ReglaDeCopago
    MotorDeCopagos ..> Copago
    Copago *-- "*" ResultadoDeRegla
    ReglaDeCopago ..> SolicitudDeCopago
    SolicitudDeCopago --> NivelDePlan`, "Servicio II")}
        <div class="callout info">
          <p><b>Detalle que suma:</b> <code>prioridad()</code>. “Cobertura Total” pone el copago en 0 y el
          “Recargo Urgente” suma sobre el valor base — el resultado depende del orden. Explicitar cómo se componen las
          reglas (y que Cobertura Total es absorbente) muestra que pensaste el caso Premium + urgente.</p>
        </div>

        <h3>Servicio III — Validación Clínica (cuestionario configurable)</h3>
        ${APP.uml(`classDiagram
    class Cuestionario {
        -especialidad: EspecialidadRef
        -version: int
        -vigenteDesde: LocalDate
        +preguntasVigentes() List~Pregunta~
    }
    class Pregunta {
        -texto: String
        -tipo: TipoDePregunta
        -obligatoria: boolean
        -orden: int
        +validar(Respuesta) void
    }
    class OpcionDeRespuesta {
        -texto: String
        -valor: String
    }
    class CuestionarioCompletado {
        -completadoEn: LocalDateTime
        -estado: EstadoValidacion
        +respuestasComoPayload() PayloadDeValidacion
    }
    class Respuesta {
        -valor: String
    }
    class ResultadoDeRiesgo {
        -nivel: NivelDeRiesgo
        -motivo: String
        -evaluadoEn: LocalDateTime
    }
    class RevisionMedica {
        -medico: MedicoRef
        -fecha: LocalDateTime
        -decision: DecisionMedica
        -observaciones: String
    }
    class MotorDeValidacionMedica {
        <<interface>>
        +evaluar(PayloadDeValidacion) ResultadoDeRiesgo
    }
    class MotorExternoAdapter { -client: HttpClient }
    class TipoDePregunta {
        <<enumeration>>
        SI_NO
        OPCION_MULTIPLE
        NUMERICA
        TEXTO_LIBRE
    }
    class DecisionMedica {
        <<enumeration>>
        APTO
        DERIVAR_A_URGENCIAS
    }
    Cuestionario "1" *-- "1..*" Pregunta
    Pregunta "1" o-- "*" OpcionDeRespuesta
    Pregunta --> TipoDePregunta
    CuestionarioCompletado --> "1" Cuestionario
    CuestionarioCompletado "1" *-- "1..*" Respuesta
    Respuesta --> "1" Pregunta
    CuestionarioCompletado --> "0..1" ResultadoDeRiesgo
    CuestionarioCompletado --> "0..1" RevisionMedica
    CuestionarioCompletado ..> MotorDeValidacionMedica
    MotorDeValidacionMedica <|.. MotorExternoAdapter
    RevisionMedica --> DecisionMedica`, "Servicio III")}
        <div class="callout key">
          <p><b>Lo que casi todos se pierden:</b> el enunciado dice “<b>las preguntas deben poder ser configurables por un
          administrador</b>”. Eso significa que <code>Pregunta</code> es una <b>entidad con ABM</b>, asociada a una
          especialidad, con tipo, obligatoriedad y orden. Modelarlo como un formulario fijo con campos hardcodeados
          pierde el punto entero.</p>
          <p>Y el <b>versionado</b> (<code>version</code>, <code>vigenteDesde</code>) resuelve un problema real: si el
          admin cambia las preguntas, los cuestionarios ya completados deben seguir teniendo sentido.</p>
        </div>

        <h3>Servicio IV — Reservas (State + bitácora)</h3>
        ${APP.uml(`classDiagram
    class Reserva {
        -codigo: CodigoDeReserva
        -pacienteId: PacienteRef
        -profesionalId: ProfesionalRef
        -especialidad: EspecialidadRef
        -fechaHora: LocalDateTime
        -copago: Copago
        -estado: EstadoReserva
        -bitacora: List~EventoDeReserva~
        +validar(ResultadoDeRiesgo) void
        +confirmar() void
        +requerirRevision(String) void
        +cancelar(Actor, String) void
        +marcarAsistido() void
        +marcarAusente() void
        ~transicionarA(EstadoReserva, Actor, String) void
    }
    class EstadoReserva {
        <<interface>>
        +confirmar(Reserva) void
        +cancelar(Reserva, Actor, String) void
        +marcarAsistido(Reserva) void
        +marcarAusente(Reserva) void
        +nombre() String
    }
    class EstadoBase { <<abstract>> }
    class PendienteDeValidacion
    class RequiereRevisionMedica
    class Confirmada
    class Cancelada
    class Asistida
    class Ausente
    class EventoDeReserva {
        -fecha: LocalDateTime
        -tipo: TipoDeEvento
        -detalle: String
        -actor: Actor
    }
    class TipoDeEvento {
        <<enumeration>>
        CREACION
        VALIDACION
        CALCULO_COPAGO
        REVISION_MEDICA
        CANCELACION
        ASISTIDO
        AUSENTE
    }
    class CodigoDeReserva { <<value object>> }
    EstadoReserva <|.. EstadoBase
    EstadoBase <|-- PendienteDeValidacion
    EstadoBase <|-- RequiereRevisionMedica
    EstadoBase <|-- Confirmada
    EstadoBase <|-- Cancelada
    EstadoBase <|-- Asistida
    EstadoBase <|-- Ausente
    Reserva --> EstadoReserva
    Reserva "1" *-- "*" EventoDeReserva
    EventoDeReserva --> TipoDeEvento
    Reserva --> CodigoDeReserva`, "Servicio IV")}
        <p>Los <b>7 tipos de evento</b> del enum salen literalmente del enunciado: creación, validación, cálculo de
        copago, revisión médica, cancelación, asistido y ausente. Ponerlos todos demuestra que leíste el requerimiento
        de bitácora completo.</p>

        <h2>6 · Punto 3 — Modelo de datos</h2>

        <h3>DER — Servicio I</h3>
        ${APP.uml(`erDiagram
    CLINICA {
        bigint id_clinica    PK
        varchar nombre       "NOT NULL"
    }
    PROFESIONAL {
        bigint  id_profesional PK
        varchar matricula      "UK NOT NULL"
        varchar nombre         "NOT NULL"
    }
    ESPECIALIDAD {
        bigint  id_especialidad PK
        varchar nombre          "UK NOT NULL"
    }
    PROFESIONAL_ESPECIALIDAD {
        bigint id_profesional  PK,FK
        bigint id_especialidad PK,FK
    }
    CONSULTORIO {
        bigint  id_consultorio PK
        bigint  id_clinica     FK "NOT NULL"
        varchar identificacion "NOT NULL"
    }
    VALOR_BASE_TURNO {
        bigint  id_valor       PK
        bigint  id_clinica     FK "NOT NULL"
        bigint  id_especialidad FK "NOT NULL"
        decimal valor          "NOT NULL"
        date    vigente_desde  "NOT NULL"
    }
    AGENDA {
        bigint id_agenda       PK
        bigint id_profesional  FK "NOT NULL"
        bigint id_consultorio  FK "NOT NULL"
        bigint id_especialidad FK "NOT NULL"
        date   vigente_desde   "NOT NULL"
        date   vigente_hasta
    }
    FRANJA_HORARIA {
        bigint  id_franja   PK
        bigint  id_agenda   FK "NOT NULL"
        int     dia_semana  "NOT NULL CHECK 1..7"
        time    hora_desde  "NOT NULL"
        time    hora_hasta  "NOT NULL"
        int     duracion_min "NOT NULL"
    }
    CLINICA      ||--|{ CONSULTORIO : tiene
    CLINICA      ||--o{ VALOR_BASE_TURNO : define
    ESPECIALIDAD ||--o{ VALOR_BASE_TURNO : "de"
    PROFESIONAL  ||--|{ PROFESIONAL_ESPECIALIDAD : ""
    ESPECIALIDAD ||--|{ PROFESIONAL_ESPECIALIDAD : "N:M"
    PROFESIONAL  ||--o{ AGENDA : tiene
    CONSULTORIO  ||--o{ AGENDA : "se dicta en"
    ESPECIALIDAD ||--o{ AGENDA : "de"
    AGENDA       ||--|{ FRANJA_HORARIA : "1..N define"`, "DER · Servicio I")}
        <div class="callout tip">
          <p><b>La clave de este DER:</b> <code>VALOR_BASE_TURNO</code> depende de <b>clínica + especialidad</b>, porque el
          enunciado dice “valor base del turno <b>administrable por clínica</b>”. Ponerlo como una columna de
          <code>ESPECIALIDAD</code> es el error más común y hace imposible que dos clínicas cobren distinto.
          El <code>vigente_desde</code> permite además cambiar precios sin alterar los turnos ya calculados.</p>
        </div>

        <h3>DER — Servicio III</h3>
        ${APP.uml(`erDiagram
    CUESTIONARIO {
        bigint  id_cuestionario PK
        bigint  id_especialidad    "ref lógica a Servicio I, NOT NULL"
        int     version         "NOT NULL"
        date    vigente_desde   "NOT NULL"
        boolean activo          "NOT NULL"
    }
    PREGUNTA {
        bigint  id_pregunta     PK
        bigint  id_cuestionario FK "NOT NULL"
        varchar texto           "NOT NULL"
        varchar tipo            "NOT NULL CHECK IN (SI_NO, OPCION_MULTIPLE, NUMERICA, TEXTO_LIBRE)"
        boolean obligatoria     "NOT NULL"
        int     orden           "NOT NULL"
    }
    OPCION_RESPUESTA {
        bigint  id_opcion       PK
        bigint  id_pregunta     FK "NOT NULL"
        varchar texto           "NOT NULL"
        varchar valor           "NOT NULL"
    }
    CUESTIONARIO_COMPLETADO {
        bigint  id_completado   PK
        bigint  id_cuestionario FK "NOT NULL - la VERSIÓN usada"
        varchar codigo_reserva     "ref lógica a Servicio IV, UK NOT NULL"
        bigint  id_paciente        "ref lógica"
        timestamp completado_en "NOT NULL"
        varchar estado          "NOT NULL"
    }
    RESPUESTA {
        bigint  id_respuesta    PK
        bigint  id_completado   FK "NOT NULL"
        bigint  id_pregunta     FK "NOT NULL"
        varchar valor           "NOT NULL"
    }
    RESULTADO_RIESGO {
        bigint  id_resultado    PK
        bigint  id_completado   FK "UK NOT NULL"
        varchar nivel           "NOT NULL"
        varchar motivo
        timestamp evaluado_en   "NOT NULL"
    }
    REVISION_MEDICA {
        bigint  id_revision     PK
        bigint  id_completado   FK "UK NOT NULL"
        bigint  id_medico          "ref lógica, NOT NULL"
        varchar decision        "NOT NULL CHECK IN (APTO, DERIVAR_A_URGENCIAS)"
        varchar observaciones
        timestamp fecha         "NOT NULL"
    }
    CUESTIONARIO ||--|{ PREGUNTA : "1..N"
    PREGUNTA     ||--o{ OPCION_RESPUESTA : "0..N"
    CUESTIONARIO ||--o{ CUESTIONARIO_COMPLETADO : "0..N"
    CUESTIONARIO_COMPLETADO ||--|{ RESPUESTA : "1..N"
    PREGUNTA     ||--o{ RESPUESTA : "responde a"
    CUESTIONARIO_COMPLETADO ||--o| RESULTADO_RIESGO : "0..1"
    CUESTIONARIO_COMPLETADO ||--o| REVISION_MEDICA : "0..1"`, "DER · Servicio III")}

        <h3>DER — Servicio IV</h3>
        ${APP.uml(`erDiagram
    RESERVA {
        bigint  id_reserva     PK
        varchar codigo         "UK NOT NULL - expuesto a sistemas externos"
        bigint  id_paciente       "ref lógica"
        bigint  id_profesional    "ref lógica a Servicio I"
        bigint  id_especialidad   "ref lógica a Servicio I"
        timestamp fecha_hora   "NOT NULL"
        decimal valor_base     "NOT NULL - snapshot"
        decimal copago         "NOT NULL"
        varchar plan_paciente  "NOT NULL - snapshot"
        varchar estado         "NOT NULL CHECK IN (...)"
        timestamp creada_en    "NOT NULL"
    }
    REGLA_COPAGO_APLICADA {
        bigint  id_aplicada    PK
        bigint  id_reserva     FK "NOT NULL"
        varchar nombre_regla   "NOT NULL"
        varchar efecto         "NOT NULL"
        varchar detalle
        int     orden          "NOT NULL"
    }
    EVENTO_RESERVA {
        bigint  id_evento      PK
        bigint  id_reserva     FK "NOT NULL"
        timestamp fecha        "NOT NULL"
        varchar tipo           "NOT NULL CHECK IN (CREACION, VALIDACION, CALCULO_COPAGO, REVISION_MEDICA, CANCELACION, ASISTIDO, AUSENTE)"
        varchar detalle
        varchar actor_tipo
        varchar actor_id
    }
    VALIDACION_PENDIENTE {
        bigint  id_pendiente   PK
        bigint  id_reserva     FK "UK NOT NULL"
        varchar estado         "NOT NULL: PENDIENTE | EN_PROCESO | RESUELTA | FALLIDA"
        int     intentos       "NOT NULL DEFAULT 0"
        timestamp proximo_intento
    }
    RESERVA ||--o{ REGLA_COPAGO_APLICADA : "0..N"
    RESERVA ||--|{ EVENTO_RESERVA        : "1..N bitácora"
    RESERVA ||--o| VALIDACION_PENDIENTE  : "0..1"`, "DER · Servicio IV")}

        <h3>B · Impedance mismatches y desnormalización</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tema</th><th>Decisión y justificación</th></tr></thead>
          <tbody>
            <tr><td>Jerarquía de <code>EstadoReserva</code></td><td>No se persiste como jerarquía: los estados no tienen datos propios, así que se guarda un <code>varchar</code> con <code>CHECK</code> y el repositorio reconstruye la clase al hidratar</td></tr>
            <tr><td>Jerarquía de <code>ReglaDeCopago</code></td><td>Tampoco: las reglas son <b>código</b>, no datos. Lo que se persiste es el <b>resultado</b> de aplicarlas (<code>REGLA_COPAGO_APLICADA</code>)</td></tr>
            <tr><td>Colecciones (bitácora, respuestas, franjas)</td><td>Tablas hijas con FK al padre y borrado en cascada</td></tr>
            <tr><td>Value objects (<code>CodigoDeReserva</code>, <code>Monto</code>)</td><td>Embebidos como columnas de la tabla padre</td></tr>
            <tr><td><b>Desnormalización 1:</b> <code>valor_base</code> y <code>plan_paciente</code> en <code>RESERVA</code></td><td>Son <b>snapshots históricos</b>: si la clínica cambia el precio o el paciente cambia de plan, el copago ya calculado no debe alterarse. Es duplicación <b>intencional y correcta</b>.</td></tr>
            <tr><td><b>Desnormalización 2:</b> <code>copago</code> como columna</td><td>Es derivable de <code>REGLA_COPAGO_APLICADA</code>, pero se consulta en todos los listados: recalcularlo con un join en cada lectura no se justifica</td></tr>
            <tr><td>Referencias entre servicios</td><td>Sin FK: <code>id_paciente</code>, <code>id_profesional</code> y <code>id_especialidad</code> viven en otras bases. Son <b>referencias lógicas</b>, y la integridad se valida en la aplicación.</td></tr>
          </tbody>
        </table></div>

        <h2>7 · Errores comunes</h2>
        <ul>
          <li><b>Poner el valor base en <code>ESPECIALIDAD</code></b> y no por clínica.</li>
          <li><b>Cuestionario hardcodeado</b>, ignorando “configurable por un administrador”.</li>
          <li><b>Responder el punto B con una arquitectura más compleja</b> cuando pide una <i>más simple</i>.</li>
          <li><b>Proponer un webhook desde el motor externo</b>: no se puede, el enunciado dice que no es modificable.</li>
          <li><b>Modelar el pago y la facturación</b>, que están explícitamente fuera de alcance.</li>
          <li><b>Bitácora incompleta</b>: el enunciado enumera 7 eventos, no 3.</li>
          <li><b>Dibujar controllers y DTOs</b> cuando el punto pide sólo dominio.</li>
          <li><b>No versionar el cuestionario</b>: al cambiar las preguntas, los completados viejos quedan inconsistentes.</li>
        </ul>

        <h2>8 · Trampas del enunciado</h2>
        <div class="trampa"><b>“Proponga una alternativa arquitectónica más simple.”</b> Es explícitamente un pedido de
        <b>simplicidad</b>. Contestar con broker + saga + event sourcing va en contra de lo que se pide.</div>
        <div class="trampa"><b>“Este servicio no puede ser modificado pues no es de nuestra propiedad.”</b> Descarta
        cualquier solución que requiera cambios del lado del externo (webhooks, callbacks, colas compartidas).
        Sólo queda <i>polling</i> desde nuestro lado.</div>
        <div class="trampa"><b>“Las clínicas no pueden modificar estas reglas, sólo informar el plan del paciente.”</b>
        Las reglas son <b>globales de la plataforma</b>. Si las modelás como configurables por clínica, contradecís el
        enunciado.</div>
        <div class="trampa"><b>“Recargo Urgente: si el turno se solicita con menos de 2 horas de anticipación.”</b>
        Se calcula entre el <b>momento de la solicitud</b> y la fecha del turno: necesitás <b>dos</b> timestamps en el
        modelo, no sólo la fecha del turno.</div>
        <div class="trampa"><b>“Cobertura Total: si el plan es Premium, copago = 0” + “Recargo Urgente: +20%”.</b>
        ¿Un Premium con turno urgente paga 0 o paga el recargo? El enunciado no lo aclara: <b>decidilo y explicitalo</b>
        (por ejemplo, con la prioridad de las reglas). Ese tipo de aclaración suma; ignorarla, no.</div>

        <h2>9 · Rúbrica autoadministrada</h2>
        <div id="rubTurno"></div>
      `;

      APP.rubrica(el.querySelector("#rubTurno"), "turnoagil", RUBRICA);
    },
  });
})();
