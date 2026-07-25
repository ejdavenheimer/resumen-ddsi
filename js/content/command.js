/* ============================================================
   Patrón Command
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "command",
    title: "Command",
    tag: "📝",
    group: "Patrones de Diseño",
    resumen: "Comportamiento · la acción como objeto",
    keywords: ["command", "comando", "deshacer", "undo", "encolar", "acciones configurables", "macro", "invoker", "receiver"],
    render(el) {
      APP.patternPage(el, {
        categoria: "De comportamiento",
        titulo: "Command",
        intencion: "Encapsular una petición como un objeto, permitiendo parametrizar acciones, encolarlas, guardarlas y deshacerlas.",

        analogia: {
          emoji: "🧾",
          html: `<p>Un pedido en un restaurante. Vos le decís al mozo “milanesa con puré”. El mozo <b>escribe la orden
            en una comanda</b>.</p>
            <p>Ese papel es el <b>command</b>: tiene toda la información del pedido, y como es un objeto físico se puede
            pasar a la cocina, ponerlo en una cola con otros, cancelarlo, o guardarlo para armar el ticket final.
            Vos no cocinás; sólo pedís. La cocina no te conoce; sólo ejecuta órdenes. <b>El papel desacopla a los dos.</b></p>`,
        },

        problema: `
          <p>Querés desacoplar <b>quién pide</b> algo (el <i>invoker</i>) de <b>quién lo hace</b> (el <i>receiver</i>),
          y además necesitás tratar la petición como un dato: guardarla, encolarla, ejecutarla más tarde, deshacerla,
          loguearla o <b>dejar que el usuario la configure</b>.</p>
          <p>Con una llamada directa a un método nada de eso es posible: la acción “ocurre y se va”, no queda nada que
          se pueda almacenar ni revertir.</p>
          <div class="callout key" style="margin-top:1rem">
            <b>El caso estrella en esta cátedra</b> es el punto de <i>acciones configurables</i> del parcial de GTV:
            “las entidades <b>podrán configurar distintas acciones</b> para que se ejecuten cada vez que una solicitud
            entra en un estado: enviar un mail con <b>mensaje configurable</b>, mostrar una alerta, o llamar a una API
            externa especificando <b>método, URI y body</b>”. Una acción que el usuario configura, que se persiste y que
            se ejecuta después: eso <i>es</i> Command.
          </div>`,

        mal: {
          intro: "<p>El intento con un enum, que es adonde va todo el mundo primero:</p>",
          code: `enum TipoDeAccion { MAIL, ALERTA, API_EXTERNA }

class ConfiguracionDeEstado {
    private EstadoSolicitud estado;
    private List<TipoDeAccion> acciones;

    // ¿Y dónde guardo el mensaje del mail? ¿Y la URI de la API? ¿Y el body?
    private String mensajeMail;      // sólo sirve si la acción es MAIL
    private String uri;              // sólo sirve si la acción es API_EXTERNA
    private String metodoHttp;       // idem
    private String bodyTemplate;     // idem
}

class Ejecutor {
    public void ejecutar(ConfiguracionDeEstado config, Solicitud s) {
        for (TipoDeAccion a : config.getAcciones()) {
            switch (a) {                                  // ← OCP violado
                case MAIL:        mailer.enviar(s.getSolicitante(), config.getMensajeMail()); break;
                case ALERTA:      tablero.alertar(s, config.getMensajeMail()); break;   // 😬 reusa el campo
                case API_EXTERNA: http.call(config.getMetodoHttp(), config.getUri(), config.getBodyTemplate()); break;
            }
        }
    }
}`,
          nota: `El enum <b>no puede llevar la configuración de cada acción</b>, así que los parámetros de todas las
            acciones terminan aplanados en la misma clase, la mayoría en <code>null</code>. Y agregar “mandar un
            WhatsApp” toca el enum, la clase de configuración y el <code>switch</code>.`,
        },

        bien: {
          intro: "<p>Cada acción se cosifica: es un objeto con <b>su propia configuración adentro</b>.</p>",
          code: `interface Accion {
    void ejecutar(ContextoDeSolicitud ctx);
    String descripcion();          // para mostrarla en la UI de configuración
}

class EnviarMail implements Accion {
    private final PlantillaDeMensaje plantilla;   // ← su configuración, sólo suya
    private final MedioDeContacto medio;          // ← el RECEIVER

    public EnviarMail(PlantillaDeMensaje plantilla, MedioDeContacto medio) {
        this.plantilla = plantilla;
        this.medio = medio;
    }

    @Override public void ejecutar(ContextoDeSolicitud ctx) {
        medio.enviar(ctx.getSolicitante(), plantilla.renderizar(ctx));
    }
    @Override public String descripcion() { return "Enviar mail al solicitante"; }
}

class LlamarApiExterna implements Accion {
    private final MetodoHttp metodo;              // GET o POST
    private final String uri;
    private final Map<String, String> mapeoDeCampos;   // clave JSON → campo del formulario
    private final ClienteHttp cliente;                 // el RECEIVER

    @Override public void ejecutar(ContextoDeSolicitud ctx) {
        cliente.invocar(metodo, uri, construirBody(ctx));
    }

    private JsonBody construirBody(ContextoDeSolicitud ctx) {
        JsonBody body = new JsonBody();
        mapeoDeCampos.forEach((clave, campo) -> body.put(clave, ctx.valorDe(campo)));
        return body;
    }
    @Override public String descripcion() { return metodo + " " + uri; }
}

// El INVOKER: dispara las acciones sin conocer ninguna clase concreta
class ConfiguracionDeEstado {
    private final EstadoSolicitud estado;
    private final List<Accion> acciones;

    public void disparar(ContextoDeSolicitud ctx) {
        acciones.forEach(a -> a.ejecutar(ctx));
    }
}

// Agregar "Enviar WhatsApp" = UNA clase nueva. Nada existente se modifica.`,
          nota: `Fijate que la configuración que antes estaba aplanada (<code>uri</code>, <code>metodoHttp</code>,
            <code>bodyTemplate</code>) ahora vive <b>dentro de la acción que la usa</b>, y ninguna acción tiene campos
            que no le sirvan. Eso es alta cohesión, y encima el diseño quedó cerrado a modificación.`,
        },

        extra:
          "<h3>La variante con undo</h3>" +
          "<p>Cuando el requerimiento es <b>deshacer</b>, el comando guarda lo necesario para revertirse y el invoker " +
          "mantiene un historial:</p>" +
          APP.code(`interface Command {
    void ejecutar();
    void deshacer();
}

class EncenderLuz implements Command {
    private final Luz luz;                      // el RECEIVER
    public EncenderLuz(Luz luz) { this.luz = luz; }

    @Override public void ejecutar() { luz.encender(); }
    @Override public void deshacer() { luz.apagar(); }
}

class ControlRemoto {                            // el INVOKER
    private final Deque<Command> historial = new ArrayDeque<>();

    public void presionar(Command c) {
        c.ejecutar();
        historial.push(c);
    }

    public void deshacerUltimo() {
        if (!historial.isEmpty()) historial.pop().deshacer();
    }
}`, { variant: "good", label: "✅ Command con undo" }) +
          '<div class="callout info"><p>Para que <code>deshacer()</code> funcione de verdad, el comando suele tener que ' +
          "guardar el <b>estado anterior</b> (no siempre la inversa es obvia: deshacer un “aplicar 30% de descuento” " +
          "no es “subir 30%”). Ese estado guardado es, técnicamente, un <b>Memento</b>.</p></div>",

        uml: `classDiagram
    class Accion {
        <<interface>>
        +ejecutar(ContextoDeSolicitud) void
        +descripcion() String
    }
    class EnviarMail {
        -plantilla: PlantillaDeMensaje
        -medio: MedioDeContacto
    }
    class MostrarAlerta {
        -mensaje: String
    }
    class LlamarApiExterna {
        -metodo: MetodoHttp
        -uri: String
        -mapeoDeCampos: Map
    }
    class ConfiguracionDeEstado {
        -estado: EstadoSolicitud
        -acciones: List~Accion~
        +disparar(ContextoDeSolicitud) void
    }
    class Entidad {
        -configuraciones: List~ConfiguracionDeEstado~
    }
    class MedioDeContacto { <<interface>> }
    class ClienteHttp { <<interface>> }
    Accion <|.. EnviarMail
    Accion <|.. MostrarAlerta
    Accion <|.. LlamarApiExterna
    ConfiguracionDeEstado o-- "*" Accion
    Entidad *-- "*" ConfiguracionDeEstado
    EnviarMail --> MedioDeContacto : receiver
    LlamarApiExterna --> ClienteHttp : receiver`,

        roles: [
          { n: "Accion", d: "el <b>Command</b>: la interfaz con la operación (<code>ejecutar</code>, y si hace falta <code>deshacer</code>). Es lo que hace que una petición sea un objeto." },
          { n: "EnviarMail · LlamarApiExterna", d: "los <b>ConcreteCommand</b>: cada uno guarda <b>su propia configuración</b> y sabe a qué receiver llamar. Se persisten, se listan y se ejecutan cuando corresponda." },
          { n: "ConfiguracionDeEstado", d: "el <b>Invoker</b>: dispara las acciones sin conocer ninguna clase concreta. Sólo sabe que son <code>Accion</code>. En la variante con undo, es quien mantiene el historial." },
          { n: "MedioDeContacto · ClienteHttp", d: "los <b>Receiver</b>: los que hacen el trabajo real. Separar command de receiver es lo que permite reutilizar el receiver desde otros lados y testear el command con un doble." },
          { n: "Entidad", d: "el <b>Client</b>: quien arma y configura los comandos. Es el usuario de GTV eligiendo qué acciones se ejecutan en cada estado." },
        ],

        mano: [
          "Arriba, la <b>interfaz Command</b> (<code>&lt;&lt;interface&gt;&gt;</code> + <code>ejecutar()</code>, y <code>deshacer()</code> si hace falta undo).",
          "Debajo, en fila, los <b>comandos concretos</b> (<code>EnviarMail</code>, <code>LlamarApiExterna</code>), cada uno con flecha punteada de punta hueca a la interfaz y con <b>su propia configuración</b> como atributos.",
          "A la izquierda, el <b>Invoker</b> (<code>ConfiguracionDeEstado</code> / control remoto) con una lista de Commands (agregación <code>*</code> a la interfaz).",
          "A la derecha, el <b>Receiver</b> (el servicio que hace el trabajo real): cada comando concreto tiene una flecha llena al receiver que usa.",
          "<b>Tip:</b> lo que hay que mostrar es que la acción es un <b>objeto con datos adentro</b> (por eso no es un enum) y que el invoker le habla a la <i>interfaz</i>, no a los comandos concretos.",
        ],

        keywords: [
          { k: "configurar acciones para que se ejecuten cuando…", ej: "“las entidades podrán configurar distintas acciones” (GTV) — <b>la señal más clara del temario</b>" },
          { k: "el mensaje / la URI / el body debe ser configurable", ej: "cada acción lleva sus parámetros adentro" },
          { k: "deshacer / undo / redo", ej: "un editor que revierte las últimas operaciones" },
          { k: "encolar acciones", ej: "poner los pedidos en una cola para procesarlos al ritmo posible" },
          { k: "programar tareas / ejecutar en diferido", ej: "armar la tarea hoy y ejecutarla el martes" },
          { k: "log de operaciones", ej: "auditoría de qué se ejecutó, cuándo y con qué parámetros" },
          { k: "macros", ej: "agrupar varias acciones en una sola (Command + Composite)" },
          { k: "el usuario define qué se ejecuta", ej: "si el <b>usuario final</b> arma la acción, casi seguro es Command" },
        ],

        noUsar: `
          <p>Cuando no necesitás <b>ninguna</b> de las cosas que Command habilita: ni desacoplar invoker de receiver,
          ni encolar, ni deshacer, ni loguear, ni configurar. Si la acción está fija en el código y se ejecuta ahí
          mismo, <b>una llamada a un método alcanza</b>.</p>
          <p><b>Señal de que sobra:</b> tenés una clase <code>GuardarPedidoCommand</code> con un solo método
          <code>ejecutar()</code> que llama a <code>repo.guardar(pedido)</code>, se instancia en un solo lugar y se
          ejecuta inmediatamente. Eso es una capa de indirección sin beneficio.</p>
          <p><b>Cuidado con confundirlo con Strategy:</b> si lo que varía es <i>cómo</i> se hace un cálculo que el
          sistema ya decidió hacer, es Strategy. Command aparece cuando la acción misma es un <b>dato configurable,
          almacenable o diferible</b>.</p>`,

        justificar: [
          `“Usé <b>Command</b> para cosificar las <b>[acciones configurables por la entidad]</b> como objetos. Cada acción
           encapsula <b>su propia configuración</b> (<b>[el mensaje del mail, el método y la URI de la API, el mapeo de
           campos]</b>), lo cual sería imposible con un enum o una constante, y expone una única operación
           <code>ejecutar(contexto)</code>.”`,
          `“Esto desacopla al <b>invoker</b> (<b>[la configuración de estado]</b>) del <b>receiver</b>
           (<b>[el servicio de mail, el cliente HTTP]</b>): el que dispara no sabe qué se va a hacer ni quién lo va a
           hacer. Agregar un tipo de acción nuevo es agregar una clase, sin modificar el código existente
           (<b>Open/Closed</b>).”`,
          `“Como las acciones son objetos, además se pueden <b>persistir</b> (la entidad las configura y quedan
           guardadas), <b>listar</b> en la interfaz de administración y <b>ejecutar en diferido</b> o encolar si el
           volumen lo requiere.”`,
        ],

        confusiones: [
          {
            titulo: "Command vs Strategy",
            a: { t: "Command", html: `<p>Encapsula <b>una acción completa con sus parámetros</b>.</p>
              <p>Se puede guardar, encolar, deshacer y configurar por el usuario.</p>
              <p>Suele tener <b>estado propio</b> (la configuración).</p>
              <p>Pregunta que responde: <b>“¿qué hago y cuándo?”</b></p>` },
            b: { t: "Strategy", html: `<p>Encapsula <b>un algoritmo</b> para una tarea que el sistema ya decidió hacer.</p>
              <p>Se ejecuta ahora; no se almacena como pedido pendiente.</p>
              <p>Suele ser <b>sin estado</b> y reutilizable.</p>
              <p>Pregunta que responde: <b>“¿cómo lo hago?”</b></p>` },
            regla: "Si el <b>usuario final configura</b> la acción, o si hace falta <b>guardarla / encolarla / deshacerla</b>, es Command. Si sólo hay varias formas de calcular lo mismo, es Strategy.",
          },
          {
            titulo: "Command vs Observer",
            a: { t: "Command", html: `<p>Responde <b>“¿qué se hace?”</b></p><p>La acción es configurable y explícita.</p>` },
            b: { t: "Observer", html: `<p>Responde <b>“¿quién se entera?”</b></p><p>La difusión es automática a N interesados.</p>` },
            regla: "En GTV <b>conviven los tres</b>: <a class='inline' data-go='state'>State</a> maneja el ciclo de vida, <a class='inline' data-go='observer'>Observer</a> difunde el cambio, y cada acción configurada es un Command. Explicar cómo se complementan es exactamente lo que separa un buen parcial de uno excelente.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Command", type: "mc",
            q: "“Las entidades podrán configurar acciones para cada estado: enviar un mail con mensaje configurable, mostrar una alerta, o llamar a una API externa especificando método, URI y body.” (GTV)",
            options: [
              { t: "Command: cada acción es un objeto con su propia configuración y un método <code>ejecutar(contexto)</code>", ok: true },
              { t: "Un enum <code>TipoDeAccion</code> y un switch en el ejecutor", ok: false },
              { t: "Strategy: distintas formas de notificar", ok: false },
              { t: "Template Method", ok: false },
            ],
            explain: "El enum no puede llevar la configuración de cada acción (mensaje, URI, body), así que todos los parámetros terminarían aplanados en una sola clase con la mayoría en null. Strategy no alcanza porque acá la acción se <b>configura, se persiste y se ejecuta después</b>." },
          { n: 2, topic: "Command", type: "mc",
            q: "En <code>class EnviarMail implements Accion</code>, ¿quién es el <i>receiver</i>?",
            options: [
              { t: "El <code>MedioDeContacto</code> (el servicio que efectivamente manda el mail)", ok: true },
              { t: "<code>EnviarMail</code> mismo", ok: false },
              { t: "La <code>ConfiguracionDeEstado</code>", ok: false },
            ],
            explain: "El command <b>sabe qué pedir y con qué parámetros</b>; el receiver <b>sabe hacerlo</b>. Separarlos permite reutilizar el servicio de mail desde otros lados y testear el command inyectando un doble. La configuración de estado es el <i>invoker</i>." },
          { n: 3, topic: "Command", type: "mc",
            q: "Necesitás agrupar varias acciones para que se ejecuten como una sola (un “macro”). ¿Cómo lo hacés?",
            options: [
              { t: "Un <code>MacroAccion implements Accion</code> que contiene una lista de acciones y las ejecuta en orden (Command + Composite)", ok: true },
              { t: "Un array de acciones en el invoker, con un for", ok: false },
              { t: "Herencia múltiple entre las acciones", ok: false },
            ],
            explain: "Al implementar la misma interfaz, el macro <b>es</b> una acción: se puede configurar, anidar y deshacer como cualquier otra, y el invoker ni se entera de la diferencia. Es Composite aplicado sobre Command." },
          { n: 4, topic: "Command", type: "vf",
            q: "Para implementar <code>deshacer()</code> suele hacer falta que el comando guarde el estado anterior.",
            options: [{ t: "Verdadero", ok: true }, { t: "Falso", ok: false }],
            explain: "La operación inversa no siempre es obvia ni suficiente: deshacer “aplicar 30% de descuento” no es “subir 30%” (no da el mismo número). Ese estado guardado antes de ejecutar es, formalmente, un <b>Memento</b>." },
        ],
      });
    },
  });
})();
