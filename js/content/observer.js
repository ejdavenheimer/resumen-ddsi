/* ============================================================
   Patrón Observer
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "observer",
    title: "Observer",
    tag: "📢",
    group: "Patrones de Diseño",
    resumen: "Comportamiento · notificación uno-a-muchos",
    keywords: ["observer", "observador", "notificar", "suscriptor", "eventos", "publisher", "subject", "listener"],
    render(el) {
      APP.patternPage(el, {
        categoria: "De comportamiento",
        titulo: "Observer",
        intencion: "Definir una dependencia uno-a-muchos: cuando un objeto cambia de estado, todos los que dependen de él son notificados automáticamente.",

        analogia: {
          emoji: "📺",
          html: `<p>Te suscribís a un canal de YouTube. Cuando el youtuber sube un video, YouTube te avisa —a vos y a
            todos los demás suscriptores— sin que tengas que estar chequeando manualmente cada diez minutos.</p>
            <p>Vos sos el <b>observer</b>; el canal es el <b>subject</b>. Lo importante: el youtuber <b>no sabe quiénes
            somos</b> ni cuántos somos. Sólo dice “subí un video” y la notificación llega a quien esté suscripto.
            Podés suscribirte y desuscribirte cuando quieras, y a él no le cambia nada.</p>`,
        },

        problema: `
          <p>Hay un objeto cuyo estado cambia, y <b>varios otros objetos necesitan enterarse</b> cuando eso pasa.</p>
          <p>La solución ingenua —que el objeto llame directamente a cada interesado— genera dos problemas:
          el emisor termina <b>conociendo a todos los interesados concretos</b> (acoplamiento alto), y cada interesado
          nuevo obliga a <b>modificar</b> el emisor, violando OCP.</p>
          <p>Peor todavía: si un interesado sólo debe activarse en ciertas configuraciones, aparecen <code>if</code>
          dentro del emisor sobre cosas que no le incumben.</p>`,

        mal: {
          code: `class Solicitud {
    private EstadoSolicitud estado;

    // El emisor conoce a TODOS los interesados concretos
    private MailService mailService;
    private BitacoraService bitacora;
    private TableroService tablero;
    private ApiExternaClient apiExterna;

    public void cambiarEstado(EstadoSolicitud nuevo, String motivo) {
        this.estado = nuevo;

        mailService.notificarSolicitante(this, motivo);
        mailService.notificarEntidad(this, motivo);
        bitacora.registrar(this, nuevo, motivo);
        tablero.actualizar(this);
        if (entidad.tieneIntegracionExterna()) {        // 😬 lógica ajena adentro
            apiExterna.postear(this);
        }
        // Cada interesado nuevo MODIFICA esta clase.
    }
}`,
          nota: `<code>Solicitud</code> es una clase de <b>dominio</b> y terminó dependiendo de mails, tableros y clientes
            HTTP. Además de violar <b>OCP</b> y <b>SRP</b>, es imposible testear el cambio de estado sin levantar
            media aplicación.`,
        },

        bien: {
          intro: "<p>El subject sólo sabe que hay “interesados” y les avisa. Quiénes son y qué hacen no es asunto suyo.</p>",
          code: `interface ObserverDeSolicitud {
    void alCambiarEstado(EventoDeCambio evento);
}

// El subject: mantiene la lista y notifica, sin conocer implementaciones
abstract class SujetoObservable {
    private final List<ObserverDeSolicitud> observers = new ArrayList<>();

    public void suscribir(ObserverDeSolicitud o)   { observers.add(o); }
    public void desuscribir(ObserverDeSolicitud o) { observers.remove(o); }

    protected void notificar(EventoDeCambio evento) {
        observers.forEach(o -> o.alCambiarEstado(evento));
    }
}

class Solicitud extends SujetoObservable {
    private EstadoSolicitud estado;

    public void cambiarEstado(EstadoSolicitud nuevo, String motivo) {
        EstadoSolicitud anterior = this.estado;
        this.estado = nuevo;
        notificar(new EventoDeCambio(this, anterior, nuevo, motivo, LocalDateTime.now()));
    }
}

// Los observers: cada uno con UNA responsabilidad, testeable por separado
class NotificadorPorMail implements ObserverDeSolicitud {
    private final MedioDeContacto contacto;

    @Override
    public void alCambiarEstado(EventoDeCambio e) {
        contacto.enviar(e.getSolicitante(), "Su trámite pasó a " + e.getNuevo());
    }
}

class RegistradorDeBitacora implements ObserverDeSolicitud {
    @Override
    public void alCambiarEstado(EventoDeCambio e) {
        bitacora.agregar(new EntradaDeBitacora(e.getFecha(), e.getAnterior(), e.getNuevo(), e.getMotivo()));
    }
}

// Al armar el caso de uso:
solicitud.suscribir(new NotificadorPorMail(contacto));
solicitud.suscribir(new RegistradorDeBitacora(bitacora));
// Sumar un observer no toca NADA de lo existente.`,
          nota: `Fijate que la notificación viaja en un <b>objeto evento</b> (<code>EventoDeCambio</code>) con toda la
            información relevante. Es mucho mejor que pasar el subject entero: los observers no quedan acoplados a la
            estructura interna de <code>Solicitud</code> y el evento se puede serializar y mandar a una cola sin cambios.`,
        },

        uml: `classDiagram
    class ObserverDeSolicitud {
        <<interface>>
        +alCambiarEstado(EventoDeCambio) void
    }
    class SujetoObservable {
        <<abstract>>
        -observers: List~ObserverDeSolicitud~
        +suscribir(ObserverDeSolicitud) void
        +desuscribir(ObserverDeSolicitud) void
        #notificar(EventoDeCambio) void
    }
    class Solicitud {
        -estado: EstadoSolicitud
        +cambiarEstado(EstadoSolicitud, String) void
    }
    class NotificadorPorMail
    class RegistradorDeBitacora
    class TableroEnVivo
    class EventoDeCambio {
        -anterior: EstadoSolicitud
        -nuevo: EstadoSolicitud
        -motivo: String
        -fecha: LocalDateTime
    }
    SujetoObservable <|-- Solicitud
    SujetoObservable o-- "*" ObserverDeSolicitud
    ObserverDeSolicitud <|.. NotificadorPorMail
    ObserverDeSolicitud <|.. RegistradorDeBitacora
    ObserverDeSolicitud <|.. TableroEnVivo
    SujetoObservable ..> EventoDeCambio : emite`,

        roles: [
          { n: "SujetoObservable", d: "el <b>Subject</b>: mantiene la lista de observers y ofrece <code>suscribir</code> / <code>desuscribir</code>. Nunca conoce clases concretas de observer." },
          { n: "Solicitud", d: "el <b>ConcreteSubject</b>: el objeto de negocio cuyo cambio de estado interesa. Cuando cambia, llama a <code>notificar()</code>." },
          { n: "ObserverDeSolicitud", d: "el <b>Observer</b>: la interfaz que implementan todos los interesados. Un solo método, para que sea barato implementarla (ISP)." },
          { n: "NotificadorPorMail · RegistradorDeBitacora · TableroEnVivo", d: "los <b>ConcreteObserver</b>: cada uno reacciona a su manera. Se agregan y quitan sin tocar al subject." },
          { n: "EventoDeCambio", d: "el mensaje que viaja: lleva toda la información necesaria para que el observer reaccione sin tener que preguntarle nada al subject." },
        ],

        mano: [
          "A la izquierda, el <b>Subject</b> (<code>&lt;&lt;abstract&gt;&gt;</code> o la entidad de negocio) con la lista de observers y los métodos <code>suscribir()</code> / <code>notificar()</code>.",
          "Arriba a la derecha, la <b>interfaz Observer</b> con su único método (<code>alCambiar()</code> / <code>actualizar()</code>).",
          "Debajo de la interfaz, en fila, los <b>observers concretos</b> (mailer, bitácora, tablero), cada uno con flecha punteada de punta hueca a la interfaz.",
          "Del Subject a la <b>interfaz</b> Observer: flecha de agregación (rombo) con multiplicidad <code>*</code>. El subject tiene N observers, pero conoce sólo la abstracción.",
          "<b>Tip:</b> la relación clave es Subject → interfaz Observer con <code>*</code>. Nunca dibujes al subject apuntando a los observers concretos: eso rompe el desacoplamiento que da el patrón.",
        ],

        keywords: [
          { k: "notificar automáticamente", ej: "“el Sistema deberá enviarle una notificación por email a los responsables” (GTV)" },
          { k: "cuando cambia X, se avisa a Y", ej: "“cuando una solicitud es dada de alta, deberá enviar un email tanto a la persona como a la entidad” (GTV)" },
          { k: "múltiples componentes deben enterarse", ej: "contabilidad, fidelización y reportes reaccionan a un pago" },
          { k: "todos los suscriptores", ej: "“envío de notificaciones” a los medios de contacto de la persona (Libros Circulares)" },
          { k: "sistema de eventos", ej: "“registrar eventos relevantes de interacción” (Talentia)" },
          { k: "publicador / suscriptor", ej: "si es <b>entre servicios</b>, no alcanza Observer: ver <a class='inline' data-go='broker'>Broker</a>" },
          { k: "podrían sumarse más acciones", ej: "la señal de que el emisor no debe conocer a los receptores" },
        ],

        noUsar: `
          <p><b>1) Si hay un solo observer, siempre el mismo y para siempre.</b> Alcanza con una referencia directa
          o una llamada explícita. Observer se justifica cuando hay <b>N</b> interesados o cuando la cantidad
          puede variar en runtime.</p>
          <p><b>2) Si los interesados están en otro proceso.</b> Observer es <b>in-process</b>: se apoya en referencias
          en memoria. Entre microservicios necesitás un <a class="inline" data-go="broker">broker con pub/sub</a>,
          que además te da persistencia del mensaje y reintentos.</p>
          <p><b>3) Si el orden de las reacciones importa mucho o una puede cancelar a las otras.</b> Observer no garantiza
          orden ni permite “abortar” la notificación de forma limpia. Ahí conviene una orquestación explícita.</p>
          <div class="callout bad" style="margin-top:.8rem">
            <b>Riesgos a mencionar si querés lucirte:</b> (a) <b>cascadas</b> de notificaciones difíciles de seguir al
            debuggear; (b) si un observer lanza una excepción puede impedir que los demás se enteren —conviene aislar
            cada notificación; (c) <b>memory leaks</b> por observers que nunca se desuscriben.
          </div>`,

        justificar: [
          `“Usé <b>Observer</b> porque cuando <b>[la solicitud cambia de estado]</b>, múltiples componentes
           (<b>[el notificador por mail, la bitácora, el tablero]</b>) necesitan reaccionar, y el enunciado indica que
           <b>pueden sumarse más</b>. Al aplicar este patrón, el subject no conoce a los observers concretos y se pueden
           agregar o quitar dinámicamente, cumpliendo <b>Open/Closed</b> y bajando el acoplamiento.”`,
          `“La notificación viaja en un objeto <b>[EventoDeCambio]</b> con la información completa del cambio
           (estado anterior, nuevo, motivo, fecha y actor). Esto evita que los observers dependan de la estructura
           interna de <b>[Solicitud]</b> y deja el evento listo para publicarse en un broker si en el futuro los
           interesados pasan a estar en otro servicio.”`,
          `“Combinado con <b>State</b>: la transición de estado es la que dispara la notificación, de modo que cada estado
           sigue encapsulando sus reglas y la difusión del cambio queda resuelta en un solo lugar.”`,
        ],

        confusiones: [
          {
            titulo: "Observer vs Pub/Sub con Broker",
            a: { t: "Observer", html: `<p><b>In-process:</b> todo dentro de la misma aplicación, con referencias en memoria.</p>
              <p>El subject <b>conoce la lista</b> de observers (aunque no sus tipos concretos).</p>
              <p>Notificación sincrónica: si un observer tarda, el subject espera.</p>
              <p>Si se cae el proceso, la notificación se pierde.</p>` },
            b: { t: "Pub/Sub con Broker", html: `<p><b>Entre sistemas:</b> productor y consumidores en procesos distintos.</p>
              <p>El publicador <b>no conoce a nadie</b>: le habla al broker (desacoplamiento total).</p>
              <p>Asincrónico: el publicador sigue trabajando.</p>
              <p>El broker <b>persiste</b> el mensaje, reintenta y amortigua picos.</p>` },
            regla: "Misma intención, escalas distintas. Si el enunciado dice “los servicios están desplegados por separado”, la respuesta es <b>broker</b>, no Observer.",
          },
          {
            titulo: "Observer vs Command",
            a: { t: "Observer", html: `<p>Responde a <b>“¿quién se entera?”</b></p>
              <p>La relación es 1 → N.</p>
              <p>Los observers se suscriben en tiempo de ejecución.</p>` },
            b: { t: "Command", html: `<p>Responde a <b>“¿qué se hace?”</b></p>
              <p>La acción se cosifica para poder configurarla, guardarla o deshacerla.</p>` },
            regla: "En GTV conviven: el cambio de estado <b>notifica</b> (Observer) y cada <b>acción configurada</b> por la entidad es un Command. No son alternativas.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Observer", type: "mc",
            q: "“Cuando una solicitud cambia de estado hay que mandar mails, registrar en la bitácora y actualizar el tablero. Podrían sumarse más acciones.” ¿Qué usás?",
            options: [
              { t: "Observer: la solicitud notifica y cada interesado reacciona sin que ella los conozca", ok: true },
              { t: "Un método <code>notificarTodos()</code> en Solicitud que llame a los tres servicios", ok: false },
              { t: "Facade", ok: false },
              { t: "Composite", ok: false },
            ],
            explain: "La segunda opción es exactamente el antipatrón: la entidad de dominio termina dependiendo de mails y tableros, y cada interesado nuevo la modifica." },
          { n: 2, topic: "Observer", type: "mc",
            q: "El Servicio III (Lesiones) actualiza el estado y el Servicio I (Jugadores) debe reflejar la nueva disponibilidad. Están desplegados por separado. ¿Observer?",
            options: [
              { t: "No: entre procesos hace falta un broker con pub/sub (Observer distribuido)", ok: true },
              { t: "Sí: Observer funciona igual entre servicios", ok: false },
              { t: "No: hay que hacer una llamada HTTP sincrónica del III al I", ok: false },
            ],
            explain: "Observer se apoya en referencias en memoria: no cruza el límite del proceso. Una llamada HTTP sincrónica funcionaría, pero acopla temporalmente los servicios (si el I está caído, el III falla) y no da reintentos." },
          { n: 3, topic: "Observer", type: "mc",
            q: "¿Qué conviene pasarle al observer en la notificación?",
            options: [
              { t: "Un objeto evento con los datos del cambio (anterior, nuevo, motivo, fecha, actor)", ok: true },
              { t: "El subject completo, así el observer se fija lo que necesita", ok: false },
              { t: "Nada: que el observer consulte la base", ok: false },
            ],
            explain: "Pasar el subject entero acopla al observer con su estructura interna. Que consulte la base es peor: además de lento, puede leer un estado ya cambiado por otra operación. El objeto evento es autocontenido, inmutable y serializable." },
          { n: 4, topic: "Observer", type: "multi",
            q: "¿Qué riesgos de Observer conviene mencionar en la justificación?",
            options: [
              { t: "Si un observer lanza una excepción puede impedir que los demás se notifiquen", ok: true },
              { t: "Cascadas de notificaciones difíciles de seguir al debuggear", ok: true },
              { t: "Memory leaks si nadie se desuscribe", ok: true },
              { t: "Obliga a modificar el subject cada vez que se agrega un observer", ok: false },
            ],
            explain: "La última es justamente lo contrario: evitar esa modificación es el objetivo del patrón. Nombrar los tres riesgos reales muestra que entendés los trade-offs, que es lo que se pide en el punto de justificación." },
        ],
      });
    },
  });
})();
