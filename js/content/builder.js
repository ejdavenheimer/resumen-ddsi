/* ============================================================
   Patrón Builder
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "builder",
    title: "Builder",
    tag: "🏗️",
    group: "Patrones de Diseño",
    resumen: "Creacional · construir paso a paso",
    keywords: ["builder", "constructor", "paso a paso", "atributos opcionales", "telescoping", "fluent", "personalizable"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Creacional",
        titulo: "Builder",
        intencion: "Separar la construcción de un objeto complejo de su representación, para armarlo paso a paso y con distintas combinaciones.",

        analogia: {
          emoji: "🍔",
          html: `<p>Armar una hamburguesa en un local de comida rápida. Vas eligiendo paso a paso: el pan, la carne,
            el queso, los agregados, la salsa. Al final decís “listo” y te la arman.</p>
            <p>No tenés que pasarle los 12 ingredientes de una en un solo pedido gigante (¿el cuarto era con o sin
            cebolla?), y podés <b>omitir</b> tranquilamente los que no querés. Cada paso es opcional y se entiende solo.</p>`,
        },

        problema: `
          <p>Tenés un objeto con <b>muchos atributos, varios de ellos opcionales</b>. Ahí aparecen dos malas salidas:</p>
          <p>Un <b>constructor con 10 parámetros</b> es ilegible —<code>new Pizza("grande", true, false, true, ...)</code>,
          ¿qué era cada <code>boolean</code>?— y frágil, porque es fácil intercambiar dos parámetros del mismo tipo sin que
          el compilador lo note.</p>
          <p>La otra salida, armar <b>15 constructores distintos</b> para cada combinación de campos presentes, es
          inmantenible. A esto se lo llama el <b>anti-patrón del constructor telescópico</b> (<i>telescoping constructor</i>).</p>
          <p>Builder resuelve las dos cosas: construís el objeto <b>declarando sólo lo que querés</b>, en cualquier orden,
          de forma legible, y podés validar la consistencia justo antes de instanciarlo.</p>`,

        uml: `classDiagram
    class Pizza {
        -tamanio: String
        -extraQueso: boolean
        -sinTacc: boolean
        -ingredientes: List~String~
    }
    class PizzaBuilder {
        -pizza: Pizza
        +tamanio(String) PizzaBuilder
        +conExtraQueso() PizzaBuilder
        +sinTacc() PizzaBuilder
        +agregarIngrediente(String) PizzaBuilder
        +construir() Pizza
    }
    PizzaBuilder ..> Pizza : construye`,

        roles: [
          { n: "Pizza", d: "el <b>Product</b>: el objeto complejo que se quiere construir. Suele tener el constructor privado, para obligar a pasar por el builder." },
          { n: "PizzaBuilder", d: "el <b>Builder</b>: acumula la configuración paso a paso. Cada método <b>devuelve <code>this</code></b> (interfaz fluida) y <code>construir()</code> valida y entrega el producto terminado." },
        ],

        mano: [
          "Dibujá dos rectángulos: a la izquierda el <b>Producto</b> (Pizza) con sus atributos; a la derecha el <b>Builder</b> (PizzaBuilder).",
          "En el Builder listá los métodos de configuración, uno por atributo/opción: <code>tamanio()</code>, <code>conExtraQueso()</code>, etc. <b>Todos devuelven el Builder</b> (por eso son encadenables).",
          "Agregá el método <code>construir()</code> (o <code>build()</code>) que devuelve el Producto.",
          "Conectá el Builder al Producto con una flecha <b>punteada de dependencia</b> (<code>..&gt;</code>), etiquetada “construye”. No es composición: el Builder no <i>tiene</i> la Pizza como parte permanente, la fabrica.",
          "<b>Tip de tiempo:</b> no hace falta escribir el tipo de retorno de cada método del Builder; con poner el nombre del método alcanza para que se entienda el patrón.",
        ],

        mal: {
          intro: "<p>El constructor telescópico: imposible de leer sin ir a mirar la firma de la clase.</p>",
          code: `// ❌ ¿qué significa cada boolean? Ni idea sin abrir la clase.
Pizza p = new Pizza("grande", true, false, true, true, false, "napolitana");

// Y la "solución" de un constructor por combinación no escala:
Pizza(String tam) { ... }
Pizza(String tam, boolean extraQueso) { ... }
Pizza(String tam, boolean extraQueso, boolean sinTacc) { ... }
// ...y así hasta el infinito`,
          nota: "Además de ilegible, es <b>propenso a errores</b>: intercambiar dos <code>boolean</code> compila igual y rompe en runtime. Es el <i>Long Parameter List</i> como code smell.",
        },

        bien: {
          code: `class Pizza {
    private String tamanio;
    private boolean extraQueso;
    private boolean sinTacc;
    private List<String> ingredientes = new ArrayList<>();

    private Pizza() {}                       // constructor privado

    static class Builder {
        private final Pizza pizza = new Pizza();

        public Builder tamanio(String t)            { pizza.tamanio = t; return this; }
        public Builder conExtraQueso()              { pizza.extraQueso = true; return this; }
        public Builder sinTacc()                    { pizza.sinTacc = true; return this; }
        public Builder agregarIngrediente(String i) { pizza.ingredientes.add(i); return this; }

        public Pizza construir() {
            if (pizza.tamanio == null) throw new PizzaInvalida("falta el tamaño");
            return pizza;                    // acá se pueden validar reglas antes de devolver
        }
    }
}

// Uso: se lee solo, y omitís lo que no querés
Pizza p = new Pizza.Builder()
    .tamanio("grande")
    .conExtraQueso()
    .agregarIngrediente("jamón")
    .agregarIngrediente("morrón")
    .construir();`,
          nota: "Cada método <b>devuelve <code>this</code></b>: eso es lo que permite encadenar. Y <code>construir()</code> es el único punto de creación, ideal para <b>validar invariantes</b> (que no quede una pizza sin tamaño) antes de que el objeto exista.",
        },

        keywords: [
          { k: "objeto con muchos atributos opcionales", ej: "una configuración con 8 campos, 5 de ellos opcionales" },
          { k: "se va configurando paso a paso", ej: "el usuario arma su pedido eligiendo agregados de a uno" },
          { k: "el usuario elige qué incluir", ej: "personalizar un producto: colores, extras, tamaño" },
          { k: "distintas combinaciones de", ej: "distintas combinaciones de ingredientes / opciones" },
          { k: "armar / configurar / componer antes de crear", ej: "preparar la orden y recién al final confirmarla" },
          { k: "personalizable", ej: "un reporte configurable con secciones opcionales" },
        ],

        noUsar: `
          <p>Si el objeto tiene <b>2 o 3 atributos, todos obligatorios</b>, un constructor normal alcanza y se lee mejor.
          Builder para algo simple es <b>sobreingeniería clásica de parcial</b>: agrega una clase entera para no ganar nada.</p>
          <p>Regla práctica: Builder empieza a valer la pena cuando hay <b>4+ atributos</b> y <b>varios opcionales</b>,
          o cuando la construcción necesita <b>validar reglas</b> antes de crear el objeto.</p>`,

        justificar: [
          `“Apliqué <b>Builder</b> porque <b>[Pizza / el reporte / la configuración]</b> tiene múltiples atributos, varios de
           ellos <b>opcionales</b>, y el enunciado plantea que <b>[el usuario arma distintas combinaciones]</b>. Las
           distintas combinaciones posibles harían inmanejable la cantidad de constructores (constructor telescópico).”`,
          `“El Builder permite construirlo <b>paso a paso de forma legible</b> y <b>validar la consistencia</b> antes de
           instanciarlo, lo que mejora la <b>mantenibilidad</b> y evita el code smell de <i>Long Parameter List</i>.”`,
        ],

        confusiones: [
          {
            titulo: "Builder vs Factory",
            a: { t: "Builder", html: `<p>Decide <b>cómo armar</b> el objeto: paso a paso, con opciones.</p>
              <p>Suele haber <b>una sola clase</b> de producto, con muchos parámetros.</p>
              <p>Varias llamadas encadenadas + <code>construir()</code>.</p>
              <p><i>“el objeto se va configurando con distintas opciones”</i></p>` },
            b: { t: "Factory", html: `<p>Decide <b>qué objeto</b> crear: elige entre variantes.</p>
              <p>Hay <b>varias clases concretas</b> posibles.</p>
              <p>Una sola llamada devuelve el objeto terminado.</p>
              <p><i>“según el tipo se crea X o Y”</i></p>` },
            regla: "Builder = <b>cómo</b> lo armo. Factory = <b>qué</b> creo. Si el enunciado habla de opciones/pasos → Builder; si habla de tipos/variantes → Factory.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Builder", type: "mc",
            q: "“El sistema permite generar un reporte configurable: el usuario elige qué secciones incluir (resumen, gráficos, detalle, anexos), el formato y el rango de fechas. Muchas de esas opciones son opcionales.”",
            options: [
              { t: "Builder: se arma el reporte paso a paso, eligiendo qué incluir", ok: true },
              { t: "Factory Method: cada tipo de reporte es una subclase", ok: false },
              { t: "Strategy", ok: false },
              { t: "Composite", ok: false },
            ],
            explain: "Muchos atributos, varios opcionales, “el usuario elige qué incluir”: es Builder. No es Factory porque no se decide <i>qué clase</i> crear sino <i>cómo configurar</i> una misma." },
          { n: 2, topic: "Builder", type: "mc",
            q: "“Una clase <code>Punto</code> tiene <code>x</code> e <code>y</code>, ambos obligatorios.” ¿Builder?",
            options: [
              { t: "No: dos atributos obligatorios, un constructor normal alcanza. Builder sería sobreingeniería.", ok: true },
              { t: "Sí: siempre conviene un Builder", ok: false },
              { t: "Sí, para poder validar", ok: false },
            ],
            explain: "Builder se justifica con muchos atributos y opciones opcionales. Para 2 campos obligatorios agrega una clase sin ningún beneficio." },
          { n: 3, topic: "Builder", type: "mc",
            q: "En el diagrama, ¿qué relación conecta el Builder con el Producto?",
            options: [
              { t: "Dependencia (flecha punteada): el Builder construye el producto pero no lo contiene permanentemente", ok: true },
              { t: "Composición (rombo lleno)", ok: false },
              { t: "Herencia", ok: false },
            ],
            explain: "El Builder <i>fabrica</i> y devuelve el producto; no es una parte permanente suya. Se dibuja con dependencia <code>..&gt;</code>." },
        ],
      });
    },
  });
})();
