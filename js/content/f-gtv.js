/* ============================================================
   Parcial resuelto — GTV Gestor de Trámites Virtuales (23/08/2023)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p>Se desea diseñar una plataforma web concentradora de <b>trámites virtuales</b> de distintas entidades, privadas y
    estatales, que permita la presentación y seguimiento de los mismos por parte de las personas solicitantes.</p>

    <h4>Entidades</h4>
    <p>Las entidades son dadas de alta por un administrador, previo contacto telefónico. De cada entidad interesa su
    denominación legal, la demora aproximada con la que resuelve los trámites, su fecha de alta en la IGJ y su fecha de
    alta en el Sistema.</p>

    <h4>Trámites y formularios</h4>
    <p>Cada trámite tiene un nombre, un código, un tiempo estimado de resolución en días, y <b>uno o varios formularios</b>
    asociados. Cada formulario puede ser confeccionado “a gusto” por las entidades, con <b>campos</b> (nombre y apellido,
    tipo de documento, N° de documento, etc.). <b>Cada campo puede marcarse como obligatorio u opcional.</b>
    Cada formulario tiene un costo asociado. Si el trámite requiere varios formularios, <b>el costo final es la sumatoria
    de cada uno menos un 10%</b> (este valor podrá cambiar).</p>

    <h4>Vencimiento de formularios</h4>
    <p>Cada formulario tiene una fecha de vencimiento que nunca podrá superar los 45 días desde su alta. El Sistema usa
    esta fecha para <b>anular ese formulario de forma automática</b>. Al anularse por vencimiento, se envía una
    <b>notificación por email</b> a los responsables de la entidad para que puedan renovarlo a una nueva fecha o crear uno
    nuevo. <b>Un formulario puede renovarse como máximo 3 veces.</b></p>

    <h4>Alta y seguimiento de solicitudes</h4>
    <p>La persona busca el trámite por nombre o código (habiendo iniciado sesión), completa los formularios y guarda la
    solicitud; hay error si no completó algún campo obligatorio. La solicitud queda <b>“Pendiente de revisión”</b> y se
    envía email a la persona y a la entidad. Las entidades cambian el estado de cada solicitud especificando un motivo y
    pudiendo adjuntar documentos. Estados posibles: <b>En revisión, Diferido, Aceptado, Rechazado</b>. Es vital guardar
    <b>trazabilidad</b>. Las entidades pueden <b>configurar distintas acciones</b> que se ejecutan cada vez que una
    solicitud entra en un estado.</p>

    <h4>Acciones configurables</h4>
    <ul>
      <li><b>Enviar un mail</b> al solicitante y/o a la entidad: el mensaje es configurable.</li>
      <li><b>Enviar una alerta</b> en la plataforma: el mensaje es configurable.</li>
      <li><b>Llamar a una API externa:</b> se especifica el método HTTP (GET o POST), la URI y el body a enviar (JSON,
      con claves asociadas a campos de los formularios).</li>
    </ul>

    <h4>Se pide</h4>
    <p><b>1 (30)</b> — Modelar el dominio con un diagrama de clases. <b>2 (20)</b> — Detallar las decisiones de diseño,
    haciendo referencia a: cualidades de diseño y atributos de calidad; principios SOLID; code smells; utilización de
    patrones (y comparación contra otra propuesta). <b>3 (15)</b> — Código/pseudocódigo de: alta de solicitudes; cambio
    de estado; configuración de acciones por estado. <b>4 (10)</b> — Explicar el vencimiento de formularios (diseño +
    arquitectura). <b>Teoría (25)</b>.</p>`;

  const RUBRICA = [
    { t: "Formulario con <b>campos configurables</b> (campo como entidad, con obligatorio/opcional)", p: 6 },
    { t: "Costo del trámite = <b>sumatoria de formularios − 10% parametrizable</b>", p: 5 },
    { t: "Usé <b>State</b> para el ciclo de vida de la solicitud (5 estados)", p: 6 },
    { t: "Usé <b>Command</b> para las acciones configurables (cada acción es un objeto con su config)", p: 8 },
    { t: "Usé <b>Observer</b> (o el disparo desde la transición) para ejecutar las acciones al cambiar de estado", p: 6 },
    { t: "Modelé <b>trazabilidad</b> (bitácora con motivo, adjuntos y actor)", p: 5 },
    { t: "Modelé el <b>vencimiento</b> con fecha, tope de 45 días y máximo 3 renovaciones", p: 5 },
    { t: "Punto 4: expliqué que el vencimiento es un <b>cron task</b> + envío de mail + State", p: 6 },
    { t: "La acción “llamar API externa” lleva método, URI y mapeo de campos → formularios", p: 5 },
    { t: "Punto 2: nombré SOLID, code smells y cualidades <b>citando dónde</b> los apliqué", p: 8 },
    { t: "Punto 2: comparé mi propuesta con una alternativa (ej. Command vs enum)", p: 4 },
    { t: "Punto 3: pseudocódigo de alta con validación de campos obligatorios", p: 4 },
    { t: "Punto 3: pseudocódigo de cambio de estado que dispara las acciones", p: 4 },
    { t: "Teoría: respondí V/F con justificación", p: 8 },
  ];

  D.finales.push({
    id: "f-gtv", nombre: "GTV (parcial)", fecha: "23/08/2023", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-gtv",
    title: "GTV (parcial)",
    tag: "📝",
    group: "Finales resueltos",
    resumen: "23/08/2023 · trámites virtuales",
    keywords: ["gtv", "parcial", "tramites", "formularios", "acciones configurables", "command", "state", "vencimiento"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial resuelto · 23/08/2023</div>
          <h1>GTV — Gestor de Trámites Virtuales</h1>
          <p class="lead">El clásico parcial de la cátedra: modelado 30 · justificación 20 · código 15 · vencimiento 10 · teoría 25.</p>
        </div>

        <div class="callout info">
          <p>Es un <b>parcial</b> (más viejo que los finales), pero es el mejor ejemplo del temario completo aplicado:
          combina <b>State + Command + Observer</b> en un mismo enunciado, y el punto de justificación pide explícitamente
          nombrar SOLID, code smells y cualidades. Si dominás GTV, dominás el parcial.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“formulario confeccionado <b>a gusto</b> por las entidades, con campos”</td><td>Campo es una <b>entidad</b> (formulario dinámico), no atributos fijos</td></tr>
            <tr><td>“cada campo puede marcarse como <b>obligatorio u opcional</b>”</td><td>Atributo del campo; regla de validación al dar de alta la solicitud</td></tr>
            <tr><td>“el costo final es la <b>sumatoria</b>… <b>menos un 10% (podrá cambiar)</b>”</td><td>Agregación de costos + porcentaje <b>parametrizable</b></td></tr>
            <tr><td>“Pendiente de revisión → En revisión / Diferido / Aceptado / Rechazado”</td><td><b>State</b></td></tr>
            <tr><td>“es de vital importancia guardar <b>trazabilidad</b>”</td><td>Bitácora con motivo, adjuntos y actor en cada transición</td></tr>
            <tr><td>“<b>configurar distintas acciones</b> que se ejecutan cuando entra en un estado”</td><td><b>Command</b> (acciones parametrizables) + <b>Observer</b> (disparo)</td></tr>
            <tr><td>“el mensaje / la URI / el body <b>configurables</b>”</td><td>Cada acción lleva su configuración adentro → confirma Command, descarta enum</td></tr>
            <tr><td>“anular ese formulario de <b>forma automática</b>” al vencer</td><td><b>Cron task</b></td></tr>
            <tr><td>“enviar una <b>notificación por email</b>” al vencer</td><td>Observer / evento</td></tr>
            <tr><td>“máximo <b>3 renovaciones</b>”, “nunca mayor a <b>45 días</b>”</td><td>Invariantes del formulario</td></tr>
            <tr><td>“queda fuera del alcance el login de solicitantes y el pago”</td><td>No modelar autenticación ni pagos</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1 — Diagrama de dominio</h2>
        <p>Este modelo es <b>el ejemplo de manual</b> de tres patrones conviviendo. Lo dividimos en dos vistas para que se lea.</p>

        <h3>Vista A — Trámites, formularios y solicitudes (State)</h3>
        ${APP.uml(`classDiagram
    class Entidad {
        -denominacionLegal: String
        -demoraAproximada: int
        -altaIgj: LocalDate
        -altaEnSistema: LocalDate
        -configuraciones: List~ConfiguracionDeEstado~
    }
    class Tramite {
        -nombre: String
        -codigo: String
        -diasEstimados: int
        -descuentoMultiforme: Porcentaje
        +costoTotal() Monto
    }
    class Formulario {
        -costo: Monto
        -fechaAlta: LocalDate
        -vencimiento: LocalDate
        -renovaciones: int
        -estado: EstadoFormulario
        +renovar(LocalDate) void
        +anularPorVencimiento() void
        +puedeRenovar() boolean
    }
    class Campo {
        -etiqueta: String
        -tipo: TipoCampo
        -obligatorio: boolean
    }
    class Solicitud {
        -estado: EstadoSolicitud
        -bitacora: List~EntradaDeBitacora~
        +cambiarEstado(EstadoSolicitud, Actor, String) void
    }
    class RespuestaFormulario {
        +completoObligatorios() boolean
    }
    class ValorDeCampo { -valor: String }
    class EstadoSolicitud { <<interface>> }
    class PendienteDeRevision
    class EnRevision
    class Diferido
    class Aceptado
    class Rechazado
    Entidad "1" *-- "*" Tramite
    Tramite "1" *-- "1..*" Formulario
    Formulario "1" *-- "1..*" Campo
    Solicitud --> "1" Tramite
    Solicitud "1" *-- "1..*" RespuestaFormulario
    RespuestaFormulario --> "1" Formulario
    RespuestaFormulario "1" *-- "*" ValorDeCampo
    ValorDeCampo --> "1" Campo
    Solicitud --> EstadoSolicitud
    EstadoSolicitud <|.. PendienteDeRevision
    EstadoSolicitud <|.. EnRevision
    EstadoSolicitud <|.. Diferido
    EstadoSolicitud <|.. Aceptado
    EstadoSolicitud <|.. Rechazado`, "Vista A · State")}

        <h3>Vista B — Acciones configurables (Command + Observer)</h3>
        ${APP.uml(`classDiagram
    class ConfiguracionDeEstado {
        -estado: TipoEstado
        -acciones: List~Accion~
        +alEntrar(ContextoSolicitud) void
    }
    class Accion {
        <<interface>>
        +ejecutar(ContextoSolicitud) void
    }
    class EnviarMail {
        -destinatarios: Set~Destinatario~
        -mensaje: PlantillaMensaje
    }
    class EnviarAlerta {
        -destinatarios: Set~Destinatario~
        -mensaje: PlantillaMensaje
    }
    class LlamarApiExterna {
        -metodo: MetodoHttp
        -uri: String
        -mapeoDeCampos: Map~String, Campo~
    }
    class Solicitud {
        -estado: EstadoSolicitud
        +cambiarEstado(EstadoSolicitud, Actor, String) void
    }
    class ContextoSolicitud {
        +valorDeCampo(Campo) String
    }
    class EntradaDeBitacora {
        -fecha: LocalDateTime
        -estadoAnterior: String
        -estadoNuevo: String
        -motivo: String
        -adjuntos: List~Documento~
        -actor: Actor
    }
    Accion <|.. EnviarMail
    Accion <|.. EnviarAlerta
    Accion <|.. LlamarApiExterna
    ConfiguracionDeEstado "1" o-- "*" Accion
    Solicitud "1" *-- "*" EntradaDeBitacora
    Solicitud ..> ConfiguracionDeEstado : al cambiar de estado dispara
    Accion ..> ContextoSolicitud`, "Vista B · Command + Observer")}
        <div class="callout key">
          <div class="callout-title">🔑 Cómo se combinan los tres patrones</div>
          <ul>
            <li><b>State:</b> la <code>Solicitud</code> avanza por su ciclo de vida; cada estado sabe a cuáles puede pasar.</li>
            <li><b>Observer (implícito):</b> cuando la solicitud entra en un estado, notifica a la
            <code>ConfiguracionDeEstado</code> de la entidad, sin conocer las acciones concretas.</li>
            <li><b>Command:</b> cada acción configurada es un objeto con <b>su propia configuración</b> (el mensaje del
            mail, la URI y el mapeo de campos de la API). Por eso <b>no</b> puede ser un enum: un enum no lleva datos.</li>
          </ul>
        </div>

        <h2>3 · Punto 2 — Justificación de decisiones</h2>
        <p>El punto pide nombrar explícitamente cuatro cosas. Así se estructura la respuesta:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Dónde lo apliqué</th></tr></thead>
          <tbody>
            <tr><td><b>Cualidades / atributos de calidad</b></td><td>Bajo acoplamiento (la solicitud no conoce las acciones), extensibilidad (agregar una acción o un estado es una clase), mantenibilidad (cada regla en un solo lugar)</td></tr>
            <tr><td><b>SRP</b></td><td>Cada <code>Accion</code>, cada <code>EstadoSolicitud</code> y cada <code>Campo</code> tiene una sola responsabilidad</td></tr>
            <tr><td><b>OCP</b></td><td>Agregar “enviar WhatsApp” o un estado nuevo no modifica nada existente</td></tr>
            <tr><td><b>DIP</b></td><td>La solicitud depende de la abstracción <code>Accion</code>, no de <code>EnviarMail</code></td></tr>
            <tr><td><b>Code smell evitado</b></td><td>El <code>switch (tipoAccion)</code> y el <code>if (estado.equals(...))</code>, reemplazados por polimorfismo</td></tr>
            <tr><td><b>Patrones</b></td><td>State, Command, Observer (y Composite si se agrupan acciones en “macros”)</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <div class="callout-title">📝 Comparación contra otra propuesta (lo pide el enunciado)</div>
          <p>“Una alternativa era modelar las acciones con un <code>enum TipoAccion</code> y un <code>switch</code> en un
          ejecutor. La descarté porque el enum <b>no puede llevar la configuración</b> de cada acción (el mensaje del mail,
          la URI y el body de la API): todos esos parámetros terminarían aplanados en una sola clase, la mayoría en
          <code>null</code> según el tipo. Además, cada acción nueva obligaría a modificar el enum y el <code>switch</code>
          (viola OCP). Command resuelve las dos cosas: cada acción es un objeto autocontenido y extensible.”</p>
        </div>

        <h2>4 · Punto 3 — Código de los requerimientos</h2>
        <h3>a) Alta de solicitud (con validación de obligatorios)</h3>
        ${APP.code(`class AltaDeSolicitudService {

    public Solicitud dar(DatosDeSolicitud datos) {
        Tramite tramite = tramiteRepo.porCodigo(datos.codigoTramite());

        Solicitud solicitud = new Solicitud(tramite);
        for (Formulario form : tramite.getFormularios()) {
            RespuestaFormulario resp = solicitud.responder(form, datos.valoresDe(form));
            if (!resp.completoObligatorios())              // regla del enunciado
                throw new CamposObligatoriosIncompletos(form);
        }
        // arranca en "Pendiente de revisión" (el estado inicial lo pone la Solicitud)
        solicitudRepo.guardar(solicitud);
        // notifica a persona y entidad: eso lo dispara la transición inicial (Observer)
        return solicitud;
    }
}`, { variant: "good", label: "a) Alta de solicitud" })}
        <h3>b) Cambio de estado (dispara las acciones configuradas)</h3>
        ${APP.code(`class Solicitud {
    private EstadoSolicitud estado;
    private final List<EntradaDeBitacora> bitacora = new ArrayList<>();

    public void cambiarEstado(EstadoSolicitud nuevo, Actor actor, String motivo, List<Documento> adjuntos) {
        estado.validarTransicionA(nuevo);                  // cada estado sabe si puede
        EstadoSolicitud anterior = this.estado;
        this.estado = nuevo;

        // trazabilidad
        bitacora.add(new EntradaDeBitacora(now(), anterior.nombre(), nuevo.nombre(), motivo, adjuntos, actor));

        // dispara las acciones que la entidad configuró para este estado (Command)
        entidad().configuracionPara(nuevo).alEntrar(new ContextoSolicitud(this));
    }
}

class ConfiguracionDeEstado {
    private final List<Accion> acciones;
    public void alEntrar(ContextoSolicitud ctx) {
        acciones.forEach(a -> a.ejecutar(ctx));            // el invoker no conoce las clases concretas
    }
}`, { variant: "good", label: "b) Cambio de estado + disparo" })}
        <h3>c) Configuración de acciones</h3>
        ${APP.code(`// La entidad configura una acción de API externa para el estado "Aceptado"
LlamarApiExterna webhook = new LlamarApiExterna(
    MetodoHttp.POST,
    "https://sistema-legado.entidad.gob.ar/tramites",
    Map.of(                                    // clave del JSON → campo del formulario
        "dni",    campoDni,
        "nombre", campoNombre
    )
);
entidad.configurar(TipoEstado.ACEPTADO, List.of(
    new EnviarMail(Set.of(SOLICITANTE, ENTIDAD), plantillaAceptado),
    webhook
));`, { variant: "good", label: "c) Configurar acciones por estado" })}

        <h2>5 · Punto 4 — Vencimiento de formularios</h2>
        ${APP.uml(`graph LR
    CRON["⏰ Cron diario<br/>@Scheduled"] --> S["Servicio de Formularios"]
    S -->|"busca vencidos hoy"| DB[("DB")]
    S -->|"formulario.anularPorVencimiento()"| DB
    S -->|"publica FormularioAnulado"| BR["📨 eventos"]
    BR --> MAIL["Notificador<br/>(mail a la entidad)"]
    style CRON fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Vencimiento: cron + State + Observer")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <p>“El vencimiento es un proceso <b>automático, no disparado por un usuario</b>: se resuelve con un
          <b>cron task</b> (<code>@Scheduled</code>) que corre una vez al día, busca los formularios cuya fecha de
          vencimiento es hoy y llama a <code>anularPorVencimiento()</code> sobre cada uno.”</p>
          <p>“<b>A nivel diseño:</b> el formulario tiene un <b>State</b> (Vigente / Vencido / Anulado) y la lógica de
          negocio —tope de 45 días, máximo 3 renovaciones— vive en el propio formulario. Al anularse, se publica un evento
          <code>FormularioAnulado</code> y un <b>Observer</b> envía el mail a los responsables de la entidad, desacoplando
          el vencimiento del envío de la notificación.”</p>
          <p>“<b>A nivel arquitectura:</b> componentes involucrados: el <b>scheduler</b>, el servicio de formularios, la
          base y el servicio de notificaciones. <b>Detalle importante:</b> si el servicio corre en varias instancias, el
          cron se dispararía en todas; hay que garantizar <b>ejecución única</b> con un lock distribuido (ShedLock) o un
          scheduler externo que invoque un endpoint. Y si el volumen fuera alto, el cron no anula directamente sino que
          publica mensajes que los workers procesan.”</p>
        </div>

        <h2>6 · Teoría</h2>
        <p>Las preguntas de teoría de este parcial están todas resueltas y explicadas en
        <a class="inline" data-go="preguntas">Preguntas de teoría</a> (V/F sobre diseño, ISO 25000, framework vs
        biblioteca, testing y Composite en Haskell) y en el cierre de
        <a class="inline" data-go="arquitectura-web">Arquitectura Web</a> (atributos de calidad de los requerimientos).</p>

        <h2>7 · Errores comunes</h2>
        <ul>
          <li><b>Formularios con campos fijos</b> en vez de un <code>Campo</code> configurable por la entidad.</li>
          <li><b>Acciones con un enum</b>, que no puede llevar la configuración (mensaje, URI, body).</li>
          <li><b>Estado como <code>String</code></b> y validaciones con <code>if</code> repartidas por la solicitud.</li>
          <li><b>Descuento del 10% hardcodeado</b>, cuando el enunciado dice “podrá cambiar”.</li>
          <li><b>Resolver el vencimiento con un chequeo al consultar</b> en vez de un cron: así no se manda el mail si nadie consulta.</li>
          <li><b>No justificar</b> en el punto 2: nombrar SOLID/smells/cualidades <i>citando dónde</i> es la mitad de la nota de ese punto.</li>
          <li><b>Modelar el login</b> de solicitantes, que está fuera de alcance.</li>
        </ul>

        <h2>8 · Trampas del enunciado</h2>
        <div class="trampa"><b>“Configurar distintas acciones para que se ejecuten cada vez que una solicitud entra en un
        estado.”</b> La combinación de “configurar” (el usuario las arma) + “se ejecutan cuando” (disparo por evento) es
        la firma de <b>Command + Observer</b> conviviendo con el <b>State</b> del ciclo de vida. Es el enunciado que mejor
        integra tres patrones del temario.</div>
        <div class="trampa"><b>“El mensaje / la URI / el body debe ser configurable.”</b> Descarta el enum de plano: cada
        acción necesita estado propio. Es la pista más fuerte hacia Command.</div>
        <div class="trampa"><b>“El Sistema utilizará esta fecha para anular el formulario de forma automática.”</b>
        “Automática” = cron, no un botón ni una validación al consultar.</div>
        <div class="trampa"><b>“…menos un 10% (este valor podrá cambiar a lo largo del tiempo).”</b> El paréntesis te está
        diciendo que el 10% es <b>parámetro</b>, no constante.</div>
        <div class="trampa"><b>“Queda por fuera del alcance el login de las personas solicitantes.”</b> No modeles
        autenticación de solicitantes ni pantallas de login: es tiempo perdido.</div>

        <h2>9 · Rúbrica autoadministrada</h2>
        <div id="rubGtv"></div>
      `;

      APP.rubrica(el.querySelector("#rubGtv"), "gtv", RUBRICA);
    },
  });
})();
