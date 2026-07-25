/* ============================================================
   Patrón Facade
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "facade",
    title: "Facade",
    tag: "🏨",
    group: "Patrones de Diseño",
    resumen: "Estructural · simplificar un subsistema",
    keywords: ["facade", "fachada", "simplificar", "punto de entrada unico", "service", "orquestar", "gateway", "bff"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Estructural",
        titulo: "Facade",
        intencion: "Proveer una interfaz simple y única para un subsistema complejo.",

        analogia: {
          emoji: "🏨",
          html: `<p>La recepción de un hotel. Como huésped hablás con recepción para pedir cualquier cosa: cambiar de
            habitación, un taxi, servicio al cuarto, la cuenta. No vas directo a la cocina, ni al taller de mantenimiento,
            ni a la lavandería.</p>
            <p>La recepción es la <b>fachada</b>: por dentro coordina con todos esos servicios y conoce el orden en que
            hay que hacer las cosas; por fuera te da una interfaz simple y única. Y si el hotel cambia de proveedor de
            lavandería, vos ni te enterás.</p>`,
        },

        problema: `
          <p>Tenés un subsistema con varias clases que colaboran para lograr algo. Los clientes de ese subsistema tienen
          que <b>conocer todas esas clases</b>, saber en qué orden llamarlas y qué hacer si una falla.</p>
          <p>El resultado es acoplamiento alto: cualquier cambio en la orquestación interna obliga a modificar a todos
          los clientes. Y peor: <b>si hay dos clientes, la lógica de coordinación se duplica</b> — y tarde o temprano
          se desincronizan.</p>
          <p>En esta materia, el ejemplo canónico es el <b>Service de un caso de uso</b>: cuando el enunciado describe
          un flujo (“toma como entrada X, realiza los cálculos, valida, registra en la bitácora y devuelve un código”),
          está describiendo un facade.</p>`,

        mal: {
          intro: "<p>El controller termina siendo el que sabe todo el flujo:</p>",
          code: `@RestController
class ContratacionController {

    @PostMapping("/contrataciones")
    public ResponseEntity<?> crear(@RequestBody ContratacionDTO dto) {
        // El controller tiene que conocer y coordinar TODO el subsistema
        Equipo equipo = equipoRepo.buscarPorQr(dto.getCodigoQr());
        if (equipo == null) return notFound().build();

        Usuario usuario = usuarioRepo.buscar(dto.getUsuarioId());
        double prima = motorDeRiesgo.cotizar(equipo, usuario, dto.getUbicacion(), dto.getRango());

        ResultadoValidacion v = validacionService.validarFotos(dto.getFotos(), equipo.getDescripcion());
        Contratacion c = new Contratacion(equipo, usuario, prima, v.esSospechosa());

        contratacionRepo.guardar(c);
        bitacoraRepo.registrar(c, "CREADA", "prima=" + prima);
        notificador.enviar(usuario, "Contratación " + c.getCodigo());

        return ok(c.getCodigo());
    }
}`,
          nota: `Si mañana el mismo caso de uso hay que dispararlo desde un consumidor de cola o desde un job programado,
            <b>hay que copiar y pegar las 10 líneas</b>. Y el controller —que debería sólo traducir HTTP— quedó
            con la responsabilidad de conocer todo el subsistema (viola <b>SRP</b>).`,
        },

        bien: {
          intro: "<p>Todo el flujo se muda a un único punto de entrada, y el controller vuelve a hacer lo suyo:</p>",
          code: `class ContratacionService {          // ← el Facade

    private final EquipoRepository equipoRepo;
    private final MotorDeRiesgo motorDeRiesgo;
    private final ValidacionService validacion;
    private final ContratacionRepository contratacionRepo;
    private final Notificador notificador;

    // (constructor con las dependencias inyectadas)

    public CodigoContratacion contratar(DatosDeContratacion datos) {
        Equipo equipo   = equipoRepo.porCodigoQr(datos.codigoQr());
        Usuario usuario = datos.usuario();

        Prima prima = motorDeRiesgo.cotizar(equipo, usuario, datos.contexto());
        Contratacion c = Contratacion.nueva(equipo, usuario, prima);

        validacion.solicitar(c, datos.fotos());     // dispara la validación (asincrónica)
        contratacionRepo.guardar(c);
        notificador.enviar(usuario, MensajeDeConfirmacion.para(c));

        return c.codigo();
    }
}

// El controller vuelve a su única responsabilidad: traducir HTTP
@RestController
class ContratacionController {
    private final ContratacionService service;

    @PostMapping("/contrataciones")
    public ResponseEntity<?> crear(@RequestBody ContratacionDTO dto) {
        CodigoContratacion codigo = service.contratar(dto.aDatos());
        return created(URI.create("/contrataciones/" + codigo)).body(codigo);
    }
}`,
          nota: `Ahora el caso de uso es <b>reutilizable desde cualquier canal</b> (HTTP, un consumidor de RabbitMQ, un
            cron) y <b>testeable sin levantar el servidor</b>. Además, cambiar el orden interno de las llamadas no
            impacta en ningún cliente.`,
        },

        uml: `classDiagram
    class ContratacionController {
        +crear(dto) Response
    }
    class ContratacionService {
        +contratar(DatosDeContratacion) CodigoContratacion
    }
    class EquipoRepository { <<interface>> }
    class MotorDeRiesgo { }
    class ValidacionService { }
    class ContratacionRepository { <<interface>> }
    class Notificador { <<interface>> }
    ContratacionController --> ContratacionService
    ContratacionService --> EquipoRepository
    ContratacionService --> MotorDeRiesgo
    ContratacionService --> ValidacionService
    ContratacionService --> ContratacionRepository
    ContratacionService --> Notificador
    note for ContratacionService "El cliente conoce SOLO esta clase.<br/>Todo lo de la derecha queda escondido."`,

        roles: [
          { n: "ContratacionController", d: "el <b>Cliente</b>: conoce únicamente al facade. Si el subsistema interno cambia, este código no se toca." },
          { n: "ContratacionService", d: "el <b>Facade</b>: expone una operación simple por caso de uso y adentro coordina a todo el subsistema. No debería tener reglas de negocio propias: las delega al dominio." },
          { n: "MotorDeRiesgo · ValidacionService · repositorios", d: "el <b>Subsistema</b>: las clases que hacen el trabajo real. Siguen siendo accesibles directamente si alguien las necesita — el facade no las esconde por la fuerza, sólo ofrece un camino más simple." },
        ],

        mano: [
          "En el centro, el <b>Facade</b> (<code>ContratacionService</code>): un solo rectángulo con la operación simple que expone.",
          "A la izquierda, el <b>Cliente</b> (el controller), con una única flecha llena al Facade. Sólo lo conoce a él.",
          "A la derecha, apiladas, las clases del <b>subsistema</b> (repositorio, motor de riesgo, validación, notificador).",
          "Del Facade salen flechas llenas hacia <b>cada</b> clase del subsistema: el facade las coordina a todas.",
          "<b>Tip:</b> lo que tiene que saltar a la vista es que el cliente tiene <b>una sola</b> flecha (al facade) y el facade tiene <b>muchas</b> (al subsistema). Ese “embudo” es el patrón.",
        ],

        keywords: [
          { k: "punto de entrada único", ej: "una sola llamada que resuelve todo el caso de uso" },
          { k: "simplificar el uso de", ej: "“simplificar la interacción con el subsistema de facturación”" },
          { k: "coordinar varios servicios", ej: "“realiza todos los cálculos relevantes” (ProtegePro, Servicio IV)" },
          { k: "gestiona la creación y el ciclo de vida", ej: "“Gestiona la creación y el ciclo de vida de los turnos” (TurnoÁgil, Servicio IV)" },
          { k: "toma como entrada … y devuelve", ej: "“Toma como entrada: paciente, profesional, especialidad, fecha/hora, cobertura y cuestionario” (TurnoÁgil)" },
          { k: "esconder la complejidad", ej: "que el frontend no tenga que llamar a 4 servicios distintos" },
          { k: "múltiples canales de acceso", ej: "web + mobile → a nivel arquitectura, un BFF" },
        ],

        noUsar: `
          <p>Cuando el subsistema <b>no es realmente complejo</b>. Si son dos clases sencillas y el cliente las usa sin
          problemas, agregar un facade es una capa de indirección que no compra nada.</p>
          <p><b>Señal de que lo estás usando mal:</b> el facade tiene un solo método que hace una sola llamada
          (<code>public void x() { otro.x(); }</code>). Eso no simplifica nada.</p>
          <p><b>El otro riesgo, más grave:</b> que el facade se convierta en una <b>God class</b>. Si tu
          <code>PedidoService</code> tiene 30 métodos y 800 líneas, dejó de ser un facade y pasó a ser el problema.
          La regla: <b>un facade por caso de uso o por subsistema cohesivo</b>, y las reglas de negocio en el dominio,
          no adentro del facade.</p>`,

        justificar: [
          `“Usé <b>Facade</b> para simplificar la interacción con el subsistema de <b>[contrataciones]</b>. La aplicación
           cliente conoce sólo <b>[ContratacionService]</b>, que internamente coordina a <b>[el repositorio de equipos,
           el motor de riesgo, el servicio de validación y el notificador]</b>. Esto reduce el acoplamiento y permite
           cambiar la orquestación interna sin impactar a ningún cliente.”`,
          `“Un beneficio concreto es que el caso de uso queda <b>reutilizable desde múltiples canales</b> (API REST,
           consumidor de la cola, tarea programada) sin duplicar la lógica de coordinación, y <b>testeable</b> de forma
           aislada inyectando dobles de sus colaboradores.”`,
          `“A nivel arquitectura, aplico la misma idea con un <b>API Gateway / BFF</b>, que actúa como fachada del conjunto
           de microservicios frente a los clientes web y mobile, evitando que cada canal conozca la topología interna.”`,
        ],

        confusiones: [
          {
            titulo: "Facade vs Adapter",
            a: { t: "Facade", html: `<p>Crea una interfaz <b>nueva y más simple</b>, que vos inventás.</p>
              <p>Coordina <b>varias</b> clases del subsistema.</p>
              <p>Motivación: reducir complejidad y acoplamiento.</p>` },
            b: { t: "Adapter", html: `<p>Traduce hacia una interfaz que <b>ya existía</b> y que no controlás.</p>
              <p>Suele envolver <b>una</b> clase externa.</p>
              <p>Motivación: incompatibilidad de interfaces.</p>` },
            regla: "Facade <b>simplifica</b>; Adapter <b>traduce</b>. Y conviven: el facade coordina el subsistema y adentro usa adapters para hablar con lo externo.",
          },
          {
            titulo: "Facade vs Service (de la arquitectura en capas)",
            a: { t: "Service", html: `<p>Es el nombre que usa la arquitectura en capas para la clase que orquesta un caso de uso.</p>
              <p>Vive en la capa de negocio, entre el controller y el dominio.</p>` },
            b: { t: "Facade", html: `<p>Es el nombre del <b>patrón</b> que describe esa estructura.</p>
              <p>Se aplica también a otras escalas: un módulo, un subsistema, o un gateway a nivel arquitectura.</p>` },
            regla: "En la práctica de esta materia, <b>un Service de caso de uso ES un Facade</b>. Podés decirlo así en el parcial y suma: “el <code>ReservaService</code> actúa como facade del subsistema de reservas”.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Facade", type: "mc",
            q: "“Para confirmar una reserva hay que consultar la agenda, calcular el copago, enviar el cuestionario al validador clínico, registrar la bitácora y generar el código único.” ¿Qué proponés?",
            options: [
              { t: "Un <code>ReservaService</code> que actúa como facade del caso de uso y coordina todo el subsistema", ok: true },
              { t: "Que el controller haga las cinco llamadas en orden", ok: false },
              { t: "Un Composite que agrupe los cinco pasos", ok: false },
              { t: "Un Adapter por cada componente", ok: false },
            ],
            explain: "El controller sólo debe traducir HTTP; si conoce el flujo, la lógica no se puede reutilizar desde una cola o un cron. Composite no aplica (no hay árbol). Los adapters sí van a existir, pero para las integraciones externas, no para la coordinación." },
          { n: 2, topic: "Facade", type: "mc",
            q: "Tu <code>PedidoService</code> creció a 40 métodos y 1200 líneas. ¿Qué pasó?",
            options: [
              { t: "Dejó de ser un facade y se convirtió en una God class: hay que partirlo por caso de uso o subsistema y bajar las reglas al dominio", ok: true },
              { t: "Está bien: un facade concentra todo el subsistema", ok: false },
              { t: "Hay que convertirlo en clase abstracta y heredar", ok: false },
            ],
            explain: "Facade simplifica el <i>acceso</i> a un subsistema; no es una excusa para centralizar toda la lógica. Si el facade tiene las reglas de negocio adentro, el dominio queda anémico y volvés al problema de siempre." },
          { n: 3, topic: "Facade", type: "vf",
            q: "Un API Gateway es, conceptualmente, un Facade aplicado a nivel arquitectura.",
            options: [{ t: "Verdadero", ok: true }, { t: "Falso", ok: false }],
            explain: "Ofrece un punto de entrada único y simple que esconde la complejidad de un conjunto de componentes. Es la misma intención, a escala de componentes en vez de clases. Decirlo en el parcial demuestra que entendiste el patrón, no que lo memorizaste." },
        ],
      });
    },
  });
})();
