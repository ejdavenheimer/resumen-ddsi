/* ============================================================
   Patrón Strategy
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "strategy",
    title: "Strategy",
    tag: "♟️",
    group: "Patrones de Diseño",
    resumen: "Comportamiento · algoritmos intercambiables",
    keywords: ["strategy", "estrategia", "algoritmos intercambiables", "reglas", "descuento", "calculo", "ocp", "motor de reglas"],
    render(el) {
      APP.patternPage(el, {
        categoria: "De comportamiento",
        titulo: "Strategy",
        intencion: "Definir una familia de algoritmos, encapsular cada uno y hacerlos intercambiables.",

        analogia: {
          emoji: "🚌",
          html: `<p>Cuando viajás, elegís el medio de transporte según la situación: si tenés apuro y plata, avión;
            si querés economizar, micro; si vas cerca, bici.</p>
            <p><b>Todos te llevan de A a B</b> (misma finalidad, misma “interfaz”), pero cada uno tiene su lógica interna
            completamente distinta: costo, tiempo, requisitos. Vos <b>elegís la estrategia</b> según el contexto, y podés
            cambiar de idea sin que cambie tu objetivo.</p>`,
        },

        problema: `
          <p>Tenés varias formas alternativas de hacer <b>lo mismo</b> y necesitás poder elegir entre ellas —a veces
          dinámicamente, en tiempo de ejecución.</p>
          <p>Resuelto con <code>if/else</code>, cada alternativa nueva te obliga a modificar la misma clase, que crece
          sin control y hay que volver a testear entera. Y cuando el enunciado dice explícitamente
          “<i>a futuro pueden agregarse más</i>”, esa modificación no es hipotética: es un requerimiento.</p>
          <div class="callout key" style="margin-top:1rem">
            <b>Strategy es el patrón que más aparece en los finales de esta cátedra.</b> Los “motores de reglas”
            (ProtegePro: reglas de riesgo; TurnoÁgil: reglas de copago; La Scalo: tipos de recomendación) son todos
            Strategy, con una vuelta de tuerca: <b>se aplican varias a la vez</b>, así que el contexto guarda una
            <i>colección</i> de estrategias en vez de una sola.
          </div>`,

        mal: {
          code: `class MotorDeCopagos {

    public double calcular(String plan, Turno turno) {
        double valorBase = turno.getValorBase();
        double copago;

        if (plan.equals("PREMIUM")) {
            copago = 0;
        } else if (plan.equals("BASICO")) {
            copago = valorBase * 0.30;
        } else {
            throw new IllegalArgumentException("plan desconocido");
        }

        // ...y el recargo urgente pegado con cinta adhesiva
        if (Duration.between(LocalDateTime.now(), turno.getFechaHora()).toHours() < 2) {
            copago += valorBase * 0.20;
        }

        return copago;
        // Cada regla nueva MODIFICA esta clase (viola OCP).
        // ¿Y si mañana el orden de aplicación importa? ¿Y si una regla es excluyente?
    }
}`,
          nota: `Además de violar <b>OCP</b>, esta clase mezcla <b>tres reglas de negocio independientes</b> que pueden
            cambiar por motivos distintos (viola <b>SRP</b>), y no hay forma de testear una regla aislada
            ni de configurar cuáles se aplican.`,
        },

        bien: {
          intro: `<p>Cada regla pasa a ser una clase con dos responsabilidades: saber <b>si aplica</b> y saber
            <b>cómo aplicar</b>. El motor sólo recorre la lista.</p>`,
          code: `interface ReglaDeCopago {
    boolean aplica(Turno turno);
    double aplicar(Turno turno, double montoActual);
}

class CoberturaTotal implements ReglaDeCopago {
    @Override public boolean aplica(Turno t)  { return t.getPlan().esPremium(); }
    @Override public double aplicar(Turno t, double actual) { return 0; }
}

class PlanBasico implements ReglaDeCopago {
    @Override public boolean aplica(Turno t)  { return t.getPlan().esBasico(); }
    @Override public double aplicar(Turno t, double actual) {
        return actual + t.getValorBase() * 0.30;
    }
}

class RecargoUrgente implements ReglaDeCopago {
    @Override public boolean aplica(Turno t) {
        return Duration.between(LocalDateTime.now(), t.getFechaHora()).toHours() < 2;
    }
    @Override public double aplicar(Turno t, double actual) {
        return actual + t.getValorBase() * 0.20;
    }
}

// El contexto: guarda una COLECCIÓN de estrategias y las aplica en cadena
class MotorDeCopagos {
    private final List<ReglaDeCopago> reglas;

    public MotorDeCopagos(List<ReglaDeCopago> reglas) {   // se inyectan (configurables)
        this.reglas = reglas;
    }

    public double calcular(Turno turno) {
        double copago = 0;
        for (ReglaDeCopago regla : reglas) {
            if (regla.aplica(turno)) copago = regla.aplicar(turno, copago);
        }
        return copago;
    }
}

// Agregar "Descuento por Adherente" = UNA clase nueva. El motor no se toca.`,
          nota: `El detalle fino que suma puntos: <b>cada regla decide sola si le toca</b> (<code>aplica()</code>).
            Si esa decisión viviera en el motor con un <code>if</code>, volverías a violar OCP con cada regla nueva.`,
        },

        uml: `classDiagram
    class ReglaDeCopago {
        <<interface>>
        +aplica(Turno) boolean
        +aplicar(Turno, double) double
    }
    class CoberturaTotal {
        +aplica(Turno) boolean
        +aplicar(Turno, double) double
    }
    class PlanBasico {
        +aplica(Turno) boolean
        +aplicar(Turno, double) double
    }
    class RecargoUrgente {
        +aplica(Turno) boolean
        +aplicar(Turno, double) double
    }
    class MotorDeCopagos {
        -reglas: List~ReglaDeCopago~
        +calcular(Turno) double
    }
    class Turno {
        -valorBase: double
        -fechaHora: LocalDateTime
    }
    ReglaDeCopago <|.. CoberturaTotal
    ReglaDeCopago <|.. PlanBasico
    ReglaDeCopago <|.. RecargoUrgente
    MotorDeCopagos o-- "*" ReglaDeCopago
    ReglaDeCopago ..> Turno : evalúa`,

        roles: [
          { n: "ReglaDeCopago", d: "la <b>Strategy</b>: la interfaz común que declara la operación. Todos los algoritmos son intercambiables porque cumplen este contrato." },
          { n: "CoberturaTotal · PlanBasico · RecargoUrgente", d: "las <b>ConcreteStrategy</b>: una clase por algoritmo. Cada una encapsula una regla de negocio completa y se puede testear sola." },
          { n: "MotorDeCopagos", d: "el <b>Context</b>: mantiene la(s) estrategia(s) y les delega. Nunca conoce las clases concretas — por eso agregar una regla no lo modifica." },
          { n: "Turno", d: "el dato sobre el que operan las estrategias. Se pasa como <b>parámetro</b> (dependencia), no se guarda dentro de la estrategia: así las estrategias quedan sin estado y reutilizables." },
        ],

        mano: [
          "Arriba, la <b>interfaz</b> Strategy (<code>&lt;&lt;interface&gt;&gt;</code> + el método común, ej. <code>calcular()</code> o <code>aplicar()</code>).",
          "Debajo, en fila, las 2-3 <b>implementaciones concretas</b> (<code>CostoEstandar</code>, <code>CostoExpress</code>…). Cada una con flecha punteada de punta hueca a la interfaz.",
          "A un costado, la clase <b>contexto</b> (<code>Envio</code> / <code>Motor</code>) que tiene la estrategia como atributo.",
          "Flecha <b>llena</b> del contexto a la <i>interfaz</i> (asociación), etiquetada con el nombre del atributo. Si aplican varias a la vez, ponele multiplicidad <code>*</code>.",
          "<b>Tip de tiempo:</b> no pongas los atributos de cada estrategia concreta; con el método de la interfaz alcanza para que se entienda.",
        ],

        keywords: [
          { k: "diferentes formas de calcular / procesar / validar", ej: "“calcula el copago según reglas configurables” (TurnoÁgil)" },
          { k: "algoritmos intercambiables", ej: "“cada tipo de recomendación es resuelta por un algoritmo distinto” (La Scalo)" },
          { k: "en el futuro pueden agregarse más", ej: "“actualmente se cuenta con 3 reglas, pero a futuro pueden agregarse más” (ProtegePro)" },
          { k: "sin alterar / sin modificar el resto del sistema", ej: "“deben poder incorporarse otras sin alterar el resto del sistema” (La Scalo)" },
          { k: "se decide en tiempo de ejecución", ej: "“se decide en tiempo de ejecución según lo que solicite el usuario” (La Scalo)" },
          { k: "reglas configurables", ej: "reglas definidas a nivel plataforma que las clínicas no pueden modificar" },
          { k: "pueden aplicarse más de una", ej: "“pueden aplicarse más de una y todas lo hacen sobre el valor de referencia” (ProtegePro) → colección de estrategias" },
          { k: "método de pago / de envío / de descuento", ej: "el usuario elige cómo pagar" },
        ],

        noUsar: `
          <p><b>1) Cuando hay una sola forma de hacer algo.</b> Una interfaz con una única implementación concreta y
          sin perspectiva de crecer es una indirección sin beneficio.</p>
          <p><b>2) Cuando las variantes son dos, triviales y estables.</b> Si son dos ramas de tres líneas que nunca van
          a crecer, un <code>if</code> se lee mejor que cinco archivos. El patrón se justifica por el <b>requerimiento
          de extensibilidad</b>, no por el gusto.</p>
          <p><b>3) Cuando en realidad es State.</b> Si las “alternativas” no las elige el cliente sino que el objeto pasa
          de una a otra según su ciclo de vida, lo que necesitás es <a class="inline" data-go="state">State</a>.</p>
          <p><b>4) Cuando sólo varían algunos pasos</b> de un algoritmo cuyo esqueleto es fijo: ahí conviene
          <a class="inline" data-go="template-method">Template Method</a>.</p>`,

        justificar: [
          `“Usé <b>Strategy</b> porque el enunciado describe varias formas alternativas de <b>[calcular el copago]</b> y
           aclara explícitamente que <b>en el futuro pueden agregarse más</b>. Al encapsular cada
           <b>[regla]</b> en su propia clase, agregar una nueva no requiere modificar el código existente:
           se cumple <b>Open/Closed</b>.”`,
          `“Como el enunciado indica que <b>pueden aplicarse varias reglas simultáneamente</b>, el contexto
           <b>[MotorDeCopagos]</b> mantiene una <b>colección</b> de estrategias en lugar de una sola, y cada regla decide
           por sí misma si corresponde aplicarla (método <code>aplica()</code>). Esto evita que el motor tenga que conocer
           las condiciones de cada regla.”`,
          `“Además cada regla tiene <b>una única razón para cambiar</b> (<b>SRP</b>) y puede testearse de forma aislada.
           Descarté resolverlo con una cadena de <code>if/else</code> porque concentraría reglas independientes en una
           sola clase y obligaría a modificarla —y a re-testearla completa— con cada regla nueva.”`,
        ],

        confusiones: [
          {
            titulo: "Strategy vs State",
            a: { t: "Strategy", html: `<p><b>El cliente elige</b> activamente cuál usar: la inyecta o la selecciona.</p>
              <p>Las estrategias <b>no se conocen entre sí</b> ni saben de las demás.</p>
              <p>No hay orden ni transiciones: cualquiera puede usarse en cualquier momento.</p>
              <p><i>“El usuario elige el método de envío.”</i></p>` },
            b: { t: "State", html: `<p><b>El objeto cambia solo</b>, siguiendo su ciclo de vida.</p>
              <p>Cada estado <b>conoce a sus sucesores</b> y provoca la transición.</p>
              <p>Hay un flujo definido: no se puede pasar de cualquier estado a cualquier otro.</p>
              <p><i>“El pedido pasa de pendiente a pagado a enviado.”</i></p>` },
            regla: "Preguntate <b>quién decide el cambio</b>. Si lo decide el cliente → Strategy. Si lo decide el propio objeto según su flujo → State. Estructuralmente los diagramas son casi idénticos: lo que los distingue es la intención.",
          },
          {
            titulo: "Strategy vs Template Method",
            a: { t: "Strategy", html: `<p>Usa <b>composición</b>: el contexto <i>tiene</i> una estrategia.</p>
              <p>Reemplaza el algoritmo <b>completo</b>.</p>
              <p>Se puede cambiar en <b>tiempo de ejecución</b>.</p>` },
            b: { t: "Template Method", html: `<p>Usa <b>herencia</b>: la subclase <i>es</i> una variante.</p>
              <p>Varía sólo <b>algunos pasos</b> dentro de un esqueleto fijo.</p>
              <p>Se define en <b>tiempo de compilación</b>.</p>` },
            regla: "¿Varía todo el algoritmo o sólo unos pasos? Todo → Strategy. Algunos pasos con un orden fijo → Template Method.",
          },
          {
            titulo: "Strategy vs Simple Factory",
            a: { t: "Strategy", html: `<p>Resuelve <b>cómo se hace</b> algo.</p><p>Es de comportamiento.</p>` },
            b: { t: "Simple Factory", html: `<p>Resuelve <b>qué objeto se crea</b>.</p><p>Es creacional.</p>` },
            regla: "No compiten: se combinan. Una factory instancia la estrategia que corresponde según el pedido del usuario, y el contexto la usa. Si el enunciado dice “se decide en tiempo de ejecución según lo que solicite el usuario”, mencioná <b>los dos</b>.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Strategy", type: "mc",
            q: "“El servicio elabora distintos tipos de recomendaciones; el tipo se decide en tiempo de ejecución según lo que solicite el usuario. Cada tipo es resuelto por un algoritmo distinto y deben poder incorporarse otras sin alterar el resto.” (La Scalo)",
            options: [
              { t: "Strategy (y una Simple Factory para instanciar la estrategia según el pedido)", ok: true },
              { t: "State, porque el tipo cambia", ok: false },
              { t: "Template Method, porque todas generan una descripción de texto", ok: false },
              { t: "Observer, porque el usuario solicita y el sistema responde", ok: false },
            ],
            explain: "Las tres señales canónicas están todas: algoritmo distinto por tipo, elección en runtime, extensible sin tocar el resto. No es State porque no hay ciclo de vida; no es Template Method porque los tres algoritmos no comparten un esqueleto de pasos." },
          { n: 2, topic: "Strategy", type: "mc",
            q: "El enunciado aclara que “pueden aplicarse más de una regla y todas lo hacen sobre el valor de referencia”. ¿Cómo lo reflejás en el diagrama?",
            options: [
              { t: "El contexto tiene una colección: <code>MotorDeRiesgo o-- \"*\" ReglaDeRiesgo</code>", ok: true },
              { t: "Una sola asociación 1 a 1 hacia la interfaz", ok: false },
              { t: "Herencia múltiple entre las reglas", ok: false },
            ],
            explain: "Es la diferencia entre el Strategy “de manual” (una estrategia por vez) y el motor de reglas que piden estos finales. La multiplicidad <code>*</code> en el diagrama demuestra que leíste esa línea del enunciado." },
          { n: 3, topic: "Strategy", type: "mc",
            q: "¿Dónde debería vivir la condición “si el plan es Premium”?",
            options: [
              { t: "Dentro de la propia regla, en un método <code>aplica(Turno)</code>", ok: true },
              { t: "En el motor, con un <code>if</code> antes de llamar a la regla", ok: false },
              { t: "En el controller, que decide qué regla instanciar", ok: false },
            ],
            explain: "Si la condición vive en el motor, agregar una regla nueva obliga a modificarlo: volviste a violar OCP con un paso extra. Que cada estrategia decida sola si le toca es lo que hace que el motor quede realmente cerrado a modificación." },
          { n: 4, topic: "Strategy", type: "mc",
            q: "“El sistema calcula el IVA. Es siempre 21%.” ¿Aplicás Strategy por las dudas?",
            options: [
              { t: "No: una sola forma de calcular, sin indicios de que vaya a crecer. Sería sobreingeniería.", ok: true },
              { t: "Sí: nunca se sabe si mañana cambia la alícuota", ok: false },
              { t: "Sí, con una sola implementación concreta", ok: false },
            ],
            explain: "Que cambie el <i>valor</i> de una constante no requiere polimorfismo: requiere configuración. Strategy se justifica cuando cambia el <b>algoritmo</b> y hay varias variantes. Meterlo “por las dudas” resta puntos." },
        ],
      });
    },
  });
})();
