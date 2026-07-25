/* ============================================================
   Patrones Simple Factory y Factory Method
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "factory",
    title: "Simple Factory y Factory Method",
    tag: "🏭",
    group: "Patrones de Diseño",
    resumen: "Creacional · encapsular la creación",
    keywords: ["factory", "fabrica", "simple factory", "factory method", "creacional", "instanciar", "builder"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Creacional",
        titulo: "Simple Factory y Factory Method",
        intencion: "Centralizar y encapsular la creación de objetos cuando hay varias variantes posibles.",

        analogia: {
          emoji: "🍕",
          html: `<p>Una pizzería. Vos pedís “quiero una muzzarella” y te la traen hecha. No te importa qué horno usan,
            qué masa, en qué orden ponen los ingredientes. Ese “detrás de escena” es la <b>fábrica</b>: sabe cómo se
            hace cada tipo y te lo entrega listo.</p>
            <p>Y si la pizzería abre una sucursal en Nápoles, la <b>misma consigna</b> (“muzzarella”) produce un producto
            distinto, porque cada sucursal decide cómo la hace. Esa segunda parte es <b>Factory Method</b>.</p>`,
        },

        problema: `
          <p>Tu código necesita crear objetos, pero <b>qué clase concreta instanciar depende de algo</b>: un parámetro,
          una configuración, el país, el tipo de mensaje que llegó.</p>
          <p>Si esa decisión se resuelve con un <code>switch</code> escrito directamente donde se necesita el objeto,
          pasan dos cosas malas: (1) el <code>switch</code> se <b>duplica</b> en todos los lugares que crean ese objeto,
          y (2) cada clase concreta nueva obliga a buscar y modificar todas esas copias.</p>
          <p>Un beneficio menos obvio pero importante: la factory es el único lugar donde el cliente <b>toca clases
          concretas</b>. Todo el resto del código puede trabajar sólo con la abstracción, que es lo que hace posible
          cumplir <b>DIP</b>.</p>`,

        mal: {
          intro: "<p>El mismo <code>switch</code>, tres veces, en tres archivos distintos:</p>",
          code: `class ConsumidorDeCola {
    public void procesar(Mensaje m) {
        Procesador p;
        switch (m.getTipo()) {                      // ← copia 1
            case "ALTA":         p = new ProcesadorAlta(); break;
            case "BAJA":         p = new ProcesadorBaja(); break;
            case "MODIFICACION": p = new ProcesadorModificacion(); break;
            default: throw new IllegalArgumentException();
        }
        p.procesar(m);
    }
}

class ReprocesadorNocturno {
    public void reprocesar(Mensaje m) {
        Procesador p;
        switch (m.getTipo()) {                      // ← copia 2 (¿está sincronizada?)
            case "ALTA": p = new ProcesadorAlta(); break;
            case "BAJA": p = new ProcesadorBaja(); break;
            // 😱 se olvidaron de MODIFICACION
        }
        p.procesar(m);
    }
}`,
          nota: `Cuando se agregue <code>ProcesadorSuspension</code> hay que acordarse de <b>todos</b> los lugares.
            El bug de la segunda copia (falta un caso) es exactamente el tipo de error que produce esta duplicación.`,
        },

        bien: {
          intro: "<h3 style='margin-top:0'>Simple Factory</h3><p>Un solo punto concentra la decisión:</p>",
          code: `class ProcesadorFactory {

    public static Procesador para(TipoDeMensaje tipo) {
        return switch (tipo) {
            case ALTA         -> new ProcesadorAlta();
            case BAJA         -> new ProcesadorBaja();
            case MODIFICACION -> new ProcesadorModificacion();
        };
    }
}

// Los clientes quedan así, y ninguno conoce clases concretas:
class ConsumidorDeCola {
    public void procesar(Mensaje m) {
        ProcesadorFactory.para(m.getTipo()).procesar(m);
    }
}`,
          nota: `<b>Simple Factory no es un patrón GoF oficial</b> (es un <i>idiom</i>), pero se usa muchísimo y la
            cátedra lo acepta perfectamente. Sigue habiendo un <code>switch</code>, sí — pero ahora está en
            <b>un solo lugar</b>, que es el punto. Si querés eliminarlo del todo, se registran las implementaciones
            en un <code>Map&lt;TipoDeMensaje, Supplier&lt;Procesador&gt;&gt;</code> (o se inyectan por el contenedor).`,
        },

        extra:
          "<h3>Factory Method (el patrón GoF)</h3>" +
          "<p>Acá la decisión ya no depende de un parámetro sino de <b>quién es el creador</b>. La clase base define el " +
          "algoritmo completo y declara <b>abstracta</b> la operación de creación; cada subclase decide qué producto " +
          "concreto instanciar, sin duplicar el algoritmo.</p>" +
          APP.code(`abstract class Pizzeria {

    // El algoritmo general: idéntico para todas las sucursales
    public final Pizza pedirPizza(String tipo) {
        Pizza p = crearPizza(tipo);      // ← el Factory Method
        p.preparar();
        p.hornear();
        p.cortar();
        p.entregar();
        return p;
    }

    // Cada sucursal decide QUÉ instanciar
    protected abstract Pizza crearPizza(String tipo);
}

class PizzeriaBuenosAires extends Pizzeria {
    @Override
    protected Pizza crearPizza(String tipo) {
        return switch (tipo) {
            case "muzzarella" -> new PizzaMuzzarellaBA();     // media masa, mucho queso
            case "fugazzeta"  -> new PizzaFugazzetaBA();
            default -> throw new SaborNoDisponible(tipo);
        };
    }
}

class PizzeriaNapoli extends Pizzeria {
    @Override
    protected Pizza crearPizza(String tipo) {
        return switch (tipo) {
            case "muzzarella" -> new PizzaMuzzarellaNapoli(); // masa fina, horno a leña
            case "marinara"   -> new PizzaMarinara();
            default -> throw new SaborNoDisponible(tipo);
        };
    }
}

// Sumar una sucursal = una subclase nueva. pedirPizza() NUNCA se toca.`, { variant: "good", label: "✅ Factory Method" }) +
          '<div class="callout info"><p>Fijate que <code>pedirPizza()</code> es <code>final</code> y define el orden ' +
          "de los pasos: <b>Factory Method casi siempre viene acompañado de " +
          '<a class="inline" data-go="template-method">Template Method</a></b>. El primero resuelve <i>qué se crea</i>; ' +
          "el segundo, <i>qué pasos se ejecutan y en qué orden</i>.</p></div>",

        uml: `classDiagram
    class Pizzeria {
        <<abstract>>
        +pedirPizza(String) Pizza
        #crearPizza(String)* Pizza
    }
    class PizzeriaBuenosAires {
        #crearPizza(String) Pizza
    }
    class PizzeriaNapoli {
        #crearPizza(String) Pizza
    }
    class Pizza {
        <<interface>>
        +preparar() void
        +hornear() void
    }
    class PizzaMuzzarellaBA
    class PizzaMuzzarellaNapoli
    Pizzeria <|-- PizzeriaBuenosAires
    Pizzeria <|-- PizzeriaNapoli
    Pizza <|.. PizzaMuzzarellaBA
    Pizza <|.. PizzaMuzzarellaNapoli
    PizzeriaBuenosAires ..> PizzaMuzzarellaBA : crea
    PizzeriaNapoli ..> PizzaMuzzarellaNapoli : crea
    Pizzeria ..> Pizza : usa
    note for Pizzeria "pedirPizza() es el algoritmo comun.<br/>crearPizza() lo decide cada subclase."`,

        roles: [
          { n: "Pizzeria", d: "el <b>Creator</b>: define el algoritmo general (<code>pedirPizza</code>) y declara la operación de creación como abstracta. Fijate que es también un Template Method." },
          { n: "PizzeriaBuenosAires / PizzeriaNapoli", d: "los <b>ConcreteCreator</b>: cada uno decide qué producto concreto instanciar. Sumar una sucursal es agregar una subclase." },
          { n: "Pizza", d: "el <b>Product</b>: la abstracción que el creador devuelve y que el algoritmo general usa. El Creator nunca menciona clases concretas." },
          { n: "PizzaMuzzarellaBA", d: "el <b>ConcreteProduct</b>: la variante real que produce cada creador." },
        ],

        mano: [
          "<b>Simple Factory:</b> un solo rectángulo <code>XFactory</code> con el método <code>crear(tipo)</code>. Flecha punteada de dependencia a cada producto concreto que puede instanciar.",
          "<b>Factory Method:</b> arriba, la clase creadora <b>abstracta</b> (nombre en cursiva) con el método plantilla y el <code>crearProducto()</code> abstracto.",
          "Debajo, las <b>subclases creadoras</b> (una por país/sucursal), con flecha de herencia (punta triangular hueca, línea llena) a la abstracta.",
          "A un costado, la interfaz <b>Product</b> y sus productos concretos; cada subclase creadora tiene una dependencia punteada al producto que fabrica.",
          "<b>Tip:</b> lo que distingue Factory Method en el dibujo es la <b>herencia entre creadores</b>. Si no hay jerarquía de creadores, es Simple Factory.",
        ],

        keywords: [
          { k: "según el tipo, se crea", ej: "“según el tipo de cuenta se crea un perfil distinto”" },
          { k: "instanciar según", ej: "elegir el procesador según el campo <code>tipo</code> del mensaje" },
          { k: "diferentes categorías de objetos", ej: "distintos tipos de comprobante fiscal por país" },
          { k: "cada [sucursal/país/marca] genera su propio…", ej: "Argentina emite Factura AFIP, Chile emite Boleta SII → <b>Factory Method</b>" },
          { k: "la creación es compleja o tiene varios pasos", ej: "armar el objeto requiere consultar configuración → factory (o Builder)" },
          { k: "en el futuro pueden agregarse más tipos", ej: "ojo con el matiz: si lo que varía es el <b>algoritmo</b>, es Strategy; si lo que varía es <b>qué se crea</b>, es factory. Muchas veces conviven." },
        ],

        noUsar: `
          <p><b>1) Cuando hay un solo tipo de objeto para crear.</b> Si no hay decisión que tomar,
          <code>new MiClase()</code> está perfecto. Una factory con un solo <code>return new X()</code> no aporta nada.</p>
          <p><b>2) Cuando la creación es trivial y local.</b> No hace falta una factory para crear un value object
          en el único lugar donde se usa.</p>
          <p><b>3) Cuando lo que necesitás es Builder.</b> Si el problema no es <i>elegir qué crear</i> sino
          <i>armar un objeto complejo paso a paso</i> (muchos parámetros, varios opcionales), lo que buscás es Builder.</p>
          <div class="callout bad" style="margin-top:.8rem">
            <b>Anti-patrón frecuente en los parciales:</b> poner una factory <i>además</i> de un Strategy cuando el
            enunciado no menciona ninguna decisión de creación. Si las estrategias se inyectan por configuración,
            la factory sobra.
          </div>`,

        justificar: [
          `“Usé una <b>Simple Factory</b> para centralizar la creación de <b>[los procesadores de mensaje]</b>. Como hay
           varias variantes que se eligen según <b>[el tipo del mensaje]</b>, concentrar esa lógica en un único punto
           evita que la decisión se disperse y se desincronice, y permite que el resto del código dependa sólo de la
           abstracción <b>[Procesador]</b>.”`,
          `“Usé <b>Factory Method</b> porque <b>[cada sucursal]</b> debe instanciar su propio tipo de
           <b>[comprobante]</b>, pero el algoritmo general (<b>[calcular, aplicar impuestos, emitir]</b>) es idéntico.
           La clase base define el flujo y declara abstracta la operación de creación; cada subclase decide qué producto
           concreto devolver, sin duplicar el algoritmo.”`,
          `“Esto cumple <b>Open/Closed</b>: agregar <b>[un país / un tipo]</b> nuevo consiste en crear una subclase o
           registrar una implementación, sin modificar el código existente ni los clientes.”`,
        ],

        confusiones: [
          {
            titulo: "Simple Factory vs Factory Method",
            a: { t: "Simple Factory", html: `<p><b>Una</b> clase con un método (a menudo estático) que devuelve la
              instancia según un <b>parámetro</b>.</p>
              <p>La decisión está en un <code>switch</code> centralizado.</p>
              <p>No es GoF, pero es lo que usás el 90% de las veces.</p>
              <p><code>ProcesadorFactory.para(tipo)</code></p>` },
            b: { t: "Factory Method", html: `<p><b>Varias</b> subclases del creador; cada una decide qué producto
              instanciar.</p>
              <p>La decisión está en el <b>polimorfismo</b>: no hay switch.</p>
              <p>Sí es GoF. Va de la mano de Template Method.</p>
              <p><code>pizzeriaNapoli.crearPizza(tipo)</code></p>` },
            regla: "¿La decisión depende de un <b>parámetro</b> o de <b>quién es el creador</b>? Parámetro → Simple Factory. Quién crea → Factory Method.",
          },
          {
            titulo: "Factory vs Builder",
            a: { t: "Factory", html: `<p>Resuelve <b>“¿qué objeto creo?”</b></p>
              <p>Una sola llamada devuelve el objeto terminado.</p>
              <p>Hay varias clases concretas posibles.</p>` },
            b: { t: "Builder", html: `<p>Resuelve <b>“¿cómo lo armo?”</b></p>
              <p>Varias llamadas encadenadas y un <code>build()</code> final.</p>
              <p>Suele haber una sola clase, con muchos parámetros opcionales.</p>
              <p><code>Pizza.builder().masa(FINA).con(MUZZARELLA).build()</code></p>` },
            regla: "Factory <b>elige</b>; Builder <b>construye</b>. Builder no está en el temario de este parcial, pero sí se menciona en la cursada (clase 8).",
          },
          {
            titulo: "Factory vs Strategy",
            a: { t: "Factory", html: `<p>Categoría: <b>creacional</b>.</p><p>Responde: qué objeto instancio.</p>
              <p>Se usa una vez, al principio.</p>` },
            b: { t: "Strategy", html: `<p>Categoría: <b>de comportamiento</b>.</p><p>Responde: cómo se ejecuta la operación.</p>
              <p>Se usa cada vez que hay que hacer el trabajo.</p>` },
            regla: "Se complementan: la factory instancia la estrategia. Si el enunciado dice “se decide en tiempo de ejecución según lo que solicite el usuario”, nombrá los dos.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Factory", type: "mc",
            q: "“La plataforma opera en varios países. El proceso de facturación es siempre el mismo (calcular, aplicar impuestos, emitir), pero Argentina crea <code>FacturaAFIP</code> y Chile crea <code>BoletaSII</code>. Se sumarán más países.”",
            options: [
              { t: "Factory Method: el algoritmo en la clase base y la creación delegada a cada subclase de creador", ok: true },
              { t: "Simple Factory con un switch por país", ok: false },
              { t: "Strategy", ok: false },
              { t: "Adapter", ok: false },
            ],
            explain: "La decisión depende de <b>quién es el creador</b> (el facturador de cada país), no de un parámetro suelto. Con Simple Factory tendrías el algoritmo duplicado o un switch que crece; con Factory Method, sumar un país es agregar una subclase." },
          { n: 2, topic: "Factory", type: "mc",
            q: "“Al dar de alta un usuario, según el tipo de cuenta (Free, Pro, Enterprise) se crea una clase de perfil distinta con configuraciones iniciales distintas.”",
            options: [
              { t: "Simple Factory: <code>PerfilFactory.crear(tipoDeCuenta)</code>", ok: true },
              { t: "Factory Method", ok: false },
              { t: "Composite", ok: false },
            ],
            explain: "La decisión depende de un <b>parámetro</b> (el tipo de cuenta) y hay un único punto lógico de creación. Factory Method sería necesario si hubiera distintos “creadores” con productos propios." },
          { n: 3, topic: "Factory", type: "mc",
            q: "“El sistema debe crear una <code>Contratacion</code> a partir de los datos del formulario. Sólo existe una clase <code>Contratacion</code>.”",
            options: [
              { t: "Ningún patrón: <code>new Contratacion(datos)</code> o un constructor/named constructor del dominio", ok: true },
              { t: "Simple Factory", ok: false },
              { t: "Factory Method", ok: false },
            ],
            explain: "No hay ninguna decisión de qué clase instanciar, así que no hay problema que resolver. Un método estático de creación (<code>Contratacion.nueva(...)</code>) puede mejorar la legibilidad, pero eso no es el patrón Factory." },
          { n: 4, topic: "Factory", type: "vf",
            q: "Simple Factory es uno de los 23 patrones del catálogo GoF.",
            options: [{ t: "Falso", ok: true }, { t: "Verdadero", ok: false }],
            explain: "No lo es: es un idiom muy difundido, a veces llamado “Static Factory”. Los creacionales de GoF son Abstract Factory, Builder, Factory Method, Prototype y Singleton. Aclararlo en el parcial demuestra precisión." },
        ],
      });
    },
  });
})();
