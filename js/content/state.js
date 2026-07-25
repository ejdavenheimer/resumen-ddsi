/* ============================================================
   Patrón State
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "state",
    title: "State",
    tag: "🚦",
    group: "Patrones de Diseño",
    resumen: "Comportamiento · ciclo de vida",
    keywords: ["state", "estado", "ciclo de vida", "transiciones", "maquina de estados", "flujo"],
    render(el) {
      APP.patternPage(el, {
        categoria: "De comportamiento",
        titulo: "State",
        intencion: "Permitir que un objeto altere su comportamiento cuando cambia su estado interno. El objeto parece cambiar de clase.",

        analogia: {
          emoji: "🚦",
          html: `<p>Un semáforo. En verde deja pasar; en rojo no deja pasar; en amarillo la respuesta es
            “depende de qué tan cerca estés”.</p>
            <p>El semáforo <b>es el mismo objeto</b>, pero su comportamiento cambia por completo según su estado.
            Y además hay un <b>orden</b>: del verde se pasa al amarillo, del amarillo al rojo, del rojo al verde.
            Nunca del verde directo al rojo. <b>Cada estado sabe cuál es el siguiente.</b></p>`,
        },

        problema: `
          <p>Un objeto tiene un <b>ciclo de vida</b> con varios estados, y su comportamiento cambia según en cuál esté:
          las mismas operaciones a veces son válidas y a veces no.</p>
          <p>Resuelto con un atributo <code>String estado</code> o un enum y cadenas de <code>if</code>, el código se pudre
          rápido: cada operación tiene su propio <code>if/else</code> sobre todos los estados, la lógica de un mismo
          estado queda <b>desparramada</b> por toda la clase, y un estado nuevo obliga a revisar todos los métodos
          (y siempre te olvidás de uno).</p>
          <div class="callout key" style="margin-top:1rem">
            <b>Este patrón aparece en absolutamente todos los finales recientes</b>, porque casi todo enunciado tiene una
            entidad con ciclo de vida: la solicitud de GTV, la contratación de ProtegePro, la reserva de TurnoÁgil,
            la postulación de Talentia, la lesión de La Scalo, el ejemplar de Libros Circulares.
          </div>`,

        mal: {
          code: `class Pedido {
    private String estado = "PENDIENTE";   // type code

    public void pagar() {
        if (estado.equals("PENDIENTE")) {
            estado = "PAGADO";
        } else {
            throw new IllegalStateException("no se puede pagar en estado " + estado);
        }
    }

    public void enviar() {
        if (estado.equals("PAGADO")) {
            estado = "ENVIADO";
        } else {
            throw new IllegalStateException("no se puede enviar en estado " + estado);
        }
    }

    public void cancelar() {
        if (estado.equals("PENDIENTE") || estado.equals("PAGADO")) {
            estado = "CANCELADO";
        } else if (estado.equals("ENTREGADO")) {
            throw new IllegalStateException("un pedido entregado no se cancela");
        } else if (estado.equals("ENVIADO")) {
            // ...¿se puede? ¿con qué condiciones? nadie se acuerda
        }
    }
    // Un método por acción, con un if por estado adentro. Explota.
}`,
          nota: `El problema no es el largo: es que <b>la lógica del estado “PAGADO” está repartida en tres métodos</b>.
            Para responder “¿qué puedo hacer si está pagado?” hay que leer la clase entera. Y agregar “DEVUELTO”
            obliga a tocar los cuatro métodos, violando <b>OCP</b>.`,
        },

        bien: {
          intro: "<p>Cada estado pasa a ser una clase que concentra <b>todo</b> lo que se puede y no se puede hacer en él:</p>",
          code: `interface EstadoPedido {
    void pagar(Pedido p);
    void enviar(Pedido p);
    void entregar(Pedido p);
    void cancelar(Pedido p);
    String nombre();
}

// Comportamiento por defecto: no se puede. Cada estado habilita lo suyo.
abstract class EstadoBase implements EstadoPedido {
    @Override public void pagar(Pedido p)    { rechazar("pagar"); }
    @Override public void enviar(Pedido p)   { rechazar("enviar"); }
    @Override public void entregar(Pedido p) { rechazar("entregar"); }
    @Override public void cancelar(Pedido p) { rechazar("cancelar"); }

    private void rechazar(String accion) {
        throw new TransicionInvalida("No se puede " + accion + " un pedido " + nombre());
    }
}

class Pendiente extends EstadoBase {
    @Override public void pagar(Pedido p)    { p.transicionarA(new Pagado()); }
    @Override public void cancelar(Pedido p) { p.transicionarA(new Cancelado()); }
    @Override public String nombre()         { return "PENDIENTE"; }
}

class Pagado extends EstadoBase {
    @Override public void enviar(Pedido p)   { p.transicionarA(new Enviado()); }
    @Override public void cancelar(Pedido p) { p.transicionarA(new Cancelado()); }
    @Override public String nombre()         { return "PAGADO"; }
}

class Enviado extends EstadoBase {
    @Override public void entregar(Pedido p) { p.transicionarA(new Entregado()); }
    @Override public String nombre()         { return "ENVIADO"; }
}

class Entregado extends EstadoBase { @Override public String nombre() { return "ENTREGADO"; } }
class Cancelado extends EstadoBase { @Override public String nombre() { return "CANCELADO"; } }

// El contexto: sin un solo if
class Pedido {
    private EstadoPedido estado = new Pendiente();
    private final List<EntradaDeBitacora> bitacora = new ArrayList<>();

    public void pagar()    { estado.pagar(this); }
    public void enviar()   { estado.enviar(this); }
    public void entregar() { estado.entregar(this); }
    public void cancelar() { estado.cancelar(this); }

    // Un único punto de transición: ideal para la trazabilidad
    void transicionarA(EstadoPedido nuevo) {
        bitacora.add(new EntradaDeBitacora(LocalDateTime.now(), estado.nombre(), nuevo.nombre()));
        this.estado = nuevo;
    }
}`,
          nota: `Dos detalles que suman mucho: (1) la <b>clase base abstracta</b> con el comportamiento por defecto
            “no se puede” hace que cada estado escriba <b>sólo lo que habilita</b>, y que agregar una operación nueva
            no rompa los estados existentes; (2) <code>transicionarA()</code> es el <b>único punto</b> donde cambia el
            estado, así que ahí se registra la bitácora y se disparan las notificaciones. La trazabilidad sale gratis.`,
        },

        uml: `classDiagram
    class Pedido {
        -estado: EstadoPedido
        -bitacora: List~EntradaDeBitacora~
        +pagar() void
        +enviar() void
        +cancelar() void
        ~transicionarA(EstadoPedido) void
    }
    class EstadoPedido {
        <<interface>>
        +pagar(Pedido) void
        +enviar(Pedido) void
        +entregar(Pedido) void
        +cancelar(Pedido) void
        +nombre() String
    }
    class EstadoBase {
        <<abstract>>
        -rechazar(String) void
    }
    class Pendiente
    class Pagado
    class Enviado
    class Entregado
    class Cancelado
    EstadoPedido <|.. EstadoBase
    EstadoBase <|-- Pendiente
    EstadoBase <|-- Pagado
    EstadoBase <|-- Enviado
    EstadoBase <|-- Entregado
    EstadoBase <|-- Cancelado
    Pedido --> EstadoPedido : estado actual
    Pendiente ..> Pagado : pagar()
    Pagado ..> Enviado : enviar()
    Enviado ..> Entregado : entregar()`,

        roles: [
          { n: "Pedido", d: "el <b>Context</b>: mantiene la referencia al estado actual y delega en él todas las operaciones. No tiene ni un <code>if</code> sobre el estado." },
          { n: "EstadoPedido", d: "la interfaz <b>State</b>: declara todas las operaciones del ciclo de vida. Es la misma para todos los estados, lo que garantiza que ninguno se olvide de contemplar una operación." },
          { n: "EstadoBase", d: "clase abstracta opcional pero muy recomendable: implementa todas las operaciones rechazándolas. Cada estado concreto sobrescribe sólo las que habilita." },
          { n: "Pendiente · Pagado · Enviado…", d: "los <b>ConcreteState</b>: cada uno concentra qué operaciones acepta y a qué estado transiciona. Toda la información de un estado vive en un solo archivo." },
        ],

        mano: [
          "Arriba, la <b>interfaz Estado</b> (<code>&lt;&lt;interface&gt;&gt;</code> + las operaciones del ciclo de vida: <code>pagar()</code>, <code>enviar()</code>…).",
          "Debajo, en fila, cada <b>estado concreto</b> (<code>Pendiente</code>, <code>Pagado</code>, <code>Enviado</code>…), con flecha punteada de punta hueca a la interfaz.",
          "A un costado, el <b>contexto</b> (<code>Pedido</code>) con la flecha llena a la <i>interfaz</i> Estado, etiquetada “estado actual”.",
          "<b>El detalle que distingue State de Strategy:</b> dibujá flechas punteadas <b>entre los estados</b> (<code>Pendiente ..&gt; Pagado</code>) mostrando las transiciones válidas. Los estados se conocen entre sí.",
          "<b>Tip:</b> el contexto NO tiene ningún <code>if</code>: sólo delega. Si en tu dibujo el contexto decide las transiciones, es un enum disfrazado, no State.",
        ],

        keywords: [
          { k: "ciclo de vida", ej: "“Gestiona el ciclo de vida de la lesión a través de sus estados” (La Scalo)" },
          { k: "el sistema pasa por los estados…", ej: "“Pendiente de revisión, En revisión, Diferido, Aceptado, Rechazado” (GTV)" },
          { k: "estado inicial / estados finales", ej: "“El estado inicial es Postulado o Contactado […] los estados finales pueden ser Aceptado o Rechazado” (Talentia)" },
          { k: "según el estado actual se puede / no se puede", ej: "“sólo puede realizar el préstamo si lo tiene actualmente en su poder” (Libros Circulares)" },
          { k: "una vez X, no se podrá realizar ninguna operación", ej: "“la baja implica que sobre él no se podrá realizar ninguna operación” (Libros Circulares) → estado terminal" },
          { k: "bitácora / trazabilidad de la evolución", ej: "“Se requiere trazabilidad completa de la evolución de cada lesión” (La Scalo) → State + bitácora en la transición" },
          { k: "el ciclo avanza a…", ej: "“avanza a En Proceso, a Entrevista Pactada y a Oferta” (Talentia)" },
        ],

        noUsar: `
          <p><b>La regla más importante de esta página:</b> usá State cuando <b>el comportamiento</b> depende del estado.
          Si el estado es <b>sólo un dato</b> que se guarda y se muestra, y el objeto se comporta igual sea cual sea,
          State es sobreingeniería: alcanza con un <code>enum</code> y un atributo.</p>
          <p>Preguntas para decidir:</p>
          <ul>
            <li>¿Hay <b>operaciones que son válidas en unos estados y en otros no</b>? → State.</li>
            <li>¿Hay <b>transiciones permitidas y prohibidas</b> entre estados? → State.</li>
            <li>¿El único uso del estado es filtrar listados y mostrarlo en pantalla? → <b>enum</b>.</li>
          </ul>
          <p>Otro caso donde conviene frenar: si hay <b>dos estados</b> y las reglas caben en tres líneas, un enum con
          una validación puede ser más legible que cinco clases.</p>`,

        justificar: [
          `“Usé <b>State</b> porque <b>[la solicitud]</b> atraviesa un ciclo de vida con varios estados
           (<b>[Pendiente de revisión, En revisión, Diferido, Aceptado, Rechazado]</b>) y en cada uno responde distinto a
           las mismas acciones. Encapsular cada estado en su propia clase permite que cada uno maneje sus propias
           transiciones y validaciones, evitando cadenas de <code>if/else</code> repartidas por toda la entidad.”`,
          `“Agregar un estado nuevo consiste en crear una clase, sin modificar el contexto ni los demás estados
           (<b>Open/Closed</b>), y cada estado tiene una única razón para cambiar (<b>SRP</b>). Además, toda la
           información sobre qué se puede hacer en un estado queda en un solo lugar, lo que mejora la mantenibilidad.”`,
          `“Como el enunciado exige <b>trazabilidad</b>, concentré el cambio en un único método
           <code>transicionarA()</code>, que registra en la <b>bitácora</b> el estado anterior, el nuevo, la fecha y el
           actor responsable, y dispara la notificación a los observers. De esta forma es imposible cambiar de estado
           sin dejar registro.”`,
        ],

        confusiones: [
          {
            titulo: "State vs Strategy",
            a: { t: "State", html: `<p>El objeto <b>cambia solo</b> siguiendo su ciclo de vida.</p>
              <p>Cada estado <b>conoce a sus sucesores</b> y provoca la transición.</p>
              <p>Hay un flujo con transiciones válidas e inválidas.</p>
              <p>Intención: modelar un <b>ciclo de vida</b>.</p>` },
            b: { t: "Strategy", html: `<p><b>El cliente elige</b> cuál usar y se la inyecta.</p>
              <p>Las estrategias <b>no se conocen entre sí</b>.</p>
              <p>Cualquiera puede usarse en cualquier momento.</p>
              <p>Intención: variar un <b>algoritmo</b>.</p>` },
            regla: "Los diagramas son casi idénticos: interfaz + implementaciones + contexto que delega. Lo que los distingue es <b>quién decide el cambio</b> y si los objetos concretos se conocen entre sí.",
          },
          {
            titulo: "State vs un simple enum",
            a: { t: "Usá State si…", html: `<p>Las operaciones válidas <b>cambian</b> según el estado.</p>
              <p>Hay transiciones permitidas y prohibidas.</p>
              <p>Cada estado tiene sus propias reglas y validaciones.</p>
              <p><i>“No se puede enviar sin pagar.”</i></p>` },
            b: { t: "Usá un enum si…", html: `<p>El estado es <b>sólo un dato</b> descriptivo.</p>
              <p>El objeto se comporta igual en todos los estados.</p>
              <p>Se usa para filtrar, mostrar o reportar.</p>
              <p><i>“El nivel de validación es declarado, verificado o certificado.”</i></p>` },
            regla: "Preguntate: <b>¿cambia el comportamiento o sólo el dato?</b> Si sólo cambia el dato, un enum y listo — y decirlo explícitamente en el parcial demuestra criterio, no ignorancia.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "State", type: "mc",
            q: "“Una solicitud queda Pendiente de revisión y luego puede pasar a En revisión, Diferido, Aceptado o Rechazado. Es de vital importancia guardar trazabilidad.” (GTV)",
            options: [
              { t: "State, con la bitácora registrada en el único método de transición", ok: true },
              { t: "Un enum con el estado y validaciones en el service", ok: false },
              { t: "Strategy", ok: false },
              { t: "Template Method", ok: false },
            ],
            explain: "Hay ciclo de vida con transiciones válidas e inválidas → State. Y como la trazabilidad es obligatoria, concentrar el cambio en <code>transicionarA()</code> hace imposible cambiar de estado sin dejar registro." },
          { n: 2, topic: "State", type: "mc",
            q: "“Cada elemento del perfil tiene un nivel de validación: declarado, verificado o certificado. Al subir documentación pasa de declarado a verificado.” (Talentia) ¿State?",
            options: [
              { t: "Depende: si el nivel <b>cambia el comportamiento</b> del elemento, State; si es sólo un dato, alcanza un enum + un método de transición en la entidad", ok: true },
              { t: "Sí, siempre: hay estados y transiciones", ok: false },
              { t: "No, nunca: sólo son tres valores", ok: false },
            ],
            explain: "Es el caso de frontera perfecto. En Talentia el nivel condiciona qué se puede hacer (sólo lo certificable admite certificación por una entidad emisora), así que State es defendible — pero un enum con la regla de transición encapsulada en la entidad también lo es. <b>Lo que puntúa es que justifiques la elección</b>, no cuál elegiste." },
          { n: 3, topic: "State", type: "mc",
            q: "¿Por qué conviene una clase abstracta <code>EstadoBase</code> que rechaza todo por defecto?",
            options: [
              { t: "Para que cada estado escriba sólo lo que habilita, y agregar una operación nueva no rompa los estados existentes", ok: true },
              { t: "Para poder instanciar el estado base directamente", ok: false },
              { t: "Porque Java no permite interfaces con muchos métodos", ok: false },
            ],
            explain: "Sin ella, cada estado concreto tiene que implementar las 5 operaciones aunque habilite una sola: mucho ruido y muchas chances de olvido. Con ella, <code>Enviado</code> son tres líneas." },
          { n: 4, topic: "State", type: "mc",
            q: "¿Quién decide a qué estado se pasa?",
            options: [
              { t: "El propio estado actual, que instancia el siguiente y llama a <code>transicionarA()</code>", ok: true },
              { t: "El contexto, con un switch sobre el estado actual", ok: false },
              { t: "El service que recibe el request", ok: false },
            ],
            explain: "Si el contexto o el service deciden, volvés a tener la máquina de estados desparramada afuera y con <code>if</code>. Que cada estado conozca a sus sucesores es lo que hace que agregar un estado sea agregar una clase." },
        ],
      });
    },
  });
})();
