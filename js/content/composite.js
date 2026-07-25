/* ============================================================
   Patrón Composite
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "composite",
    title: "Composite",
    tag: "🌳",
    group: "Patrones de Diseño",
    resumen: "Estructural · parte-todo uniforme",
    keywords: ["composite", "arbol", "jerarquia", "compuesto", "categorias", "submenu", "organigrama", "recursivo"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Estructural",
        titulo: "Composite",
        intencion: "Tratar objetos individuales y composiciones de objetos exactamente de la misma manera.",

        analogia: {
          emoji: "📁",
          html: `<p>Una carpeta de tu computadora. Una carpeta puede contener archivos, o puede contener otras carpetas
            (que a su vez contienen archivos o más carpetas, sin límite de profundidad).</p>
            <p>Cuando calculás el tamaño total, <b>no te importa si lo que estás mirando es un archivo o una carpeta</b>:
            le pedís “dame tu tamaño” y cada uno responde a su manera. El archivo devuelve el suyo; la carpeta suma el de
            todos sus hijos, que a su vez hacen lo mismo. La recursión sale sola.</p>`,
        },

        problema: `
          <p>Tenés una estructura de <b>árbol</b> —una jerarquía donde un elemento puede contener otros elementos del
          mismo tipo— y querés operar sobre ella sin andar preguntando en cada paso si estás frente a una “hoja”
          o a un “nodo con hijos”.</p>
          <p>Sin el patrón, cada recorrido termina lleno de <code>instanceof</code> y de colecciones separadas
          (una lista de hijos y otra de contenidos), y agregar un tipo nuevo de elemento obliga a tocar todos los métodos
          que recorren la estructura.</p>`,

        mal: {
          intro: "<p>El intento intuitivo: la categoría mantiene dos colecciones separadas y el cliente las trata distinto.</p>",
          code: `class Categoria {
    private String nombre;
    private List<Categoria> subcategorias = new ArrayList<>();
    private List<Producto>  productos     = new ArrayList<>();

    public double precioTotal() {
        double total = 0;
        for (Producto p : productos)      total += p.getPrecio();       // un caso
        for (Categoria c : subcategorias) total += c.precioTotal();     // otro caso
        return total;
    }

    public int contarElementos() {
        int n = productos.size();                                       // otra vez
        for (Categoria c : subcategorias) n += c.contarElementos();     // lo mismo duplicado
        return n;
    }
    // Cada operación nueva repite la doble iteración.
    // Y si mañana una categoría puede contener también "Bundles"... tercera lista y tercer for.
}`,
          nota: `Cada operación duplica el recorrido y el cliente tiene que saber que hay dos tipos distintos de
            contenido. Un tercer tipo de elemento obliga a modificar <b>todos</b> los métodos: viola <b>OCP</b>.`,
        },

        bien: {
          intro: `<p>El truco del patrón: la hoja y el compuesto <b>implementan la misma interfaz</b>, y el compuesto
            guarda una colección de <i>la abstracción</i>, no de un tipo concreto.</p>`,
          code: `interface ElementoDeCatalogo {
    double precio();
    String nombre();
}

// Hoja: sabe su propio precio
class Producto implements ElementoDeCatalogo {
    private final String nombre;
    private final double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    @Override public double precio()  { return precio; }
    @Override public String nombre()  { return nombre; }
}

// Compuesto: delega recursivamente en sus hijos
class Categoria implements ElementoDeCatalogo {
    private final String nombre;
    private final List<ElementoDeCatalogo> hijos = new ArrayList<>();   // ← la ABSTRACCIÓN

    public Categoria(String nombre) { this.nombre = nombre; }

    public void agregar(ElementoDeCatalogo hijo) { hijos.add(hijo); }
    public void quitar(ElementoDeCatalogo hijo)  { hijos.remove(hijo); }

    @Override
    public double precio() {
        return hijos.stream().mapToDouble(ElementoDeCatalogo::precio).sum();
    }

    @Override public String nombre() { return nombre; }
}

// El cliente no distingue: le habla igual a los dos
ElementoDeCatalogo raiz = armarCatalogo();
System.out.println(raiz.precio());     // funciona sea un producto suelto o el catálogo entero`,
          nota: `La línea que hace todo el trabajo es <code>List&lt;ElementoDeCatalogo&gt; hijos</code>. Al guardar la
            <b>abstracción</b> y no <code>List&lt;Producto&gt;</code>, una categoría puede contener productos y categorías
            indistintamente, con profundidad arbitraria. Agregar un tipo nuevo de elemento es agregar una clase.`,
        },

        uml: `classDiagram
    class ElementoDeCatalogo {
        <<interface>>
        +precio() double
        +nombre() String
    }
    class Producto {
        -nombre: String
        -precio: double
        +precio() double
    }
    class Categoria {
        -nombre: String
        -hijos: List~ElementoDeCatalogo~
        +agregar(ElementoDeCatalogo) void
        +quitar(ElementoDeCatalogo) void
        +precio() double
    }
    ElementoDeCatalogo <|.. Producto
    ElementoDeCatalogo <|.. Categoria
    Categoria o-- "*" ElementoDeCatalogo : contiene`,

        roles: [
          { n: "ElementoDeCatalogo", d: "el <b>Component</b>: la interfaz común. Declara las operaciones que valen tanto para la parte como para el todo. Es el corazón del patrón." },
          { n: "Producto", d: "la <b>Leaf</b> (hoja): no tiene hijos y resuelve la operación con sus propios datos. Es el caso base de la recursión." },
          { n: "Categoria", d: "el <b>Composite</b>: contiene una colección de Components y resuelve la operación <b>delegando</b> en sus hijos y combinando los resultados." },
        ],

        mano: [
          "Arriba del todo, la <b>interfaz común</b> (Component): <code>&lt;&lt;interface&gt;&gt;</code> + el método compartido (<code>precio()</code>).",
          "Debajo, en fila, las dos clases que la implementan: la <b>hoja</b> (<code>Producto</code>) y el <b>compuesto</b> (<code>Categoria</code>). Las dos con flecha punteada de punta hueca a la interfaz.",
          "La clave que no podés olvidar: del <b>compuesto</b> sale una flecha (rombo de agregación) que <b>vuelve a la interfaz</b>, con multiplicidad <code>*</code>. Esa flecha recursiva ES el patrón.",
          "Etiquetá esa relación “contiene” y ponele el <code>*</code>: es lo que permite el anidamiento de profundidad arbitraria.",
          "<b>Tip:</b> si dibujás la flecha del compuesto a <i>sí mismo</i> o a la <i>hoja</i>, está mal. Siempre va a la <b>abstracción</b>.",
        ],

        keywords: [
          { k: "estructura jerárquica", ej: "un organigrama de empleados y áreas" },
          { k: "categorías y subcategorías", ej: "el catálogo de una tienda con niveles anidados" },
          { k: "puede contener otros del mismo tipo", ej: "“grupos que pueden contener otros grupos”" },
          { k: "menú con submenús", ej: "el menú de navegación de una app" },
          { k: "árbol", ej: "un árbol de comentarios con respuestas anidadas" },
          { k: "compuesto de / se compone de", ej: "“cada rutina se compone de un conjunto de ejercicios” (La Scalo — ojo, ver abajo)" },
          { k: "sumatoria de las partes", ej: "“el costo final será la sumatoria de cada uno de ellos” (GTV)" },
          { k: "recorrer toda la estructura", ej: "calcular el total, listar todo, aplicar un permiso" },
        ],

        noUsar: `
          <p><b>1) Cuando no hay un árbol de verdad.</b> Composite exige <b>anidamiento recursivo</b>: un nodo que puede
          contener nodos del mismo tipo, con profundidad arbitraria. Si tenés una <b>lista plana</b>
          (“una rutina tiene ejercicios”, “un pedido tiene ítems”), alcanza con una colección y un
          <code>stream().sum()</code>. Meter Composite ahí es sobreingeniería.</p>
          <p><b>2) Cuando cada tipo tiene comportamiento muy distinto</b> y forzar la misma interfaz obliga a que la hoja
          implemente <code>agregar()</code> tirando <code>UnsupportedOperationException</code>. Eso rompe Liskov: si te
          pasa, evaluá dejar los métodos de gestión de hijos <b>sólo en el compuesto</b>.</p>
          <div class="callout bad" style="margin-top:.8rem">
            <b>Confusión que se cobra caro:</b> Composite <b>no</b> es “una clase que apunta a la siguiente”
            (eso es una lista enlazada), ni “una clase que tiene una lista de otra clase” (eso es simple composición).
            Composite requiere que el <b>compuesto y la hoja compartan interfaz</b>.
          </div>`,

        justificar: [
          `“Usé <b>Composite</b> porque el enunciado describe una estructura jerárquica de <b>[categorías]</b> que puede
           contener <b>[productos]</b> o <b>subestructuras del mismo tipo</b>. Con este patrón, las operaciones
           (<b>[calcular el precio total, listar el contenido]</b>) funcionan igual sobre elementos simples y sobre
           composiciones, sin que el cliente necesite distinguirlos.”`,
          `“La clave del diseño es que <b>[Categoria]</b> mantiene una colección de la abstracción
           <b>[ElementoDeCatalogo]</b> y no de un tipo concreto: eso es lo que permite el anidamiento de profundidad
           arbitraria y hace que agregar un tipo nuevo de elemento no requiera modificar los recorridos existentes
           (<b>Open/Closed</b>).”`,
          `“Descarté resolverlo con dos colecciones separadas (una de hijos y otra de hojas) porque obligaría a duplicar
           la iteración en cada operación y a que el cliente conozca los tipos concretos, aumentando el acoplamiento.”`,
        ],

        confusiones: [
          {
            titulo: "Composite vs simple composición",
            a: { t: "Composite (el patrón)", html: `<p>El contenedor y el contenido <b>comparten interfaz</b>.</p>
              <p>El contenedor puede contener contenedores: <b>anidamiento recursivo</b>.</p>
              <p><code>Categoria implements ElementoDeCatalogo</code> y guarda <code>List&lt;ElementoDeCatalogo&gt;</code>.</p>` },
            b: { t: "Composición (la relación OO)", html: `<p>Un objeto simplemente <b>tiene</b> otros como partes.</p>
              <p>No hay interfaz común ni anidamiento: es una relación “tiene un/a”.</p>
              <p><code>Auto</code> tiene un <code>Motor</code>. <code>Rutina</code> tiene <code>Ejercicio</code>s.</p>` },
            regla: "Preguntate: <b>¿el contenedor podría ser hijo de otro contenedor?</b> Si la respuesta es no, no es Composite.",
          },
          {
            titulo: "Composite vs Decorator",
            a: { t: "Composite", html: `<p>Relación <b>uno-a-muchos</b>: un nodo con N hijos.</p>
              <p>Objetivo: representar una jerarquía parte-todo.</p>` },
            b: { t: "Decorator", html: `<p>Relación <b>uno-a-uno</b>: cada decorador envuelve exactamente un componente.</p>
              <p>Objetivo: agregar responsabilidades en capas.</p>` },
            regla: "Los dos comparten interfaz con lo que envuelven; la diferencia está en la <b>cardinalidad</b> y en la intención.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Composite", type: "mc",
            q: "“Cada rutina de entrenamiento se compone de un conjunto de ejercicios; de cada ejercicio se conoce nombre, músculo, repeticiones y series.” (La Scalo, Servicio IV) ¿Aplica Composite?",
            options: [
              { t: "No: es una lista plana de ejercicios, sin anidamiento. Alcanza con una colección.", ok: true },
              { t: "Sí: hay un todo (rutina) compuesto de partes (ejercicios)", ok: false },
              { t: "Sí, pero sólo si los ejercicios tuvieran un precio", ok: false },
            ],
            explain: "Trampa clásica: “se compone de” <b>no</b> es sinónimo de Composite. Un ejercicio no puede contener otros ejercicios, así que no hay árbol. Aplicar el patrón acá sería sobreingeniería y en el parcial se descuenta." },
          { n: 2, topic: "Composite", type: "mc",
            q: "“El sistema de permisos tiene grupos que pueden contener usuarios y otros grupos. Para saber si alguien tiene un permiso hay que recorrer toda la jerarquía.” ¿Aplica?",
            options: [
              { t: "Sí: un grupo puede contener grupos, hay anidamiento recursivo y una operación uniforme", ok: true },
              { t: "No: los usuarios y los grupos son cosas muy distintas", ok: false },
              { t: "No: alcanza con una tabla de permisos en la base", ok: false },
            ],
            explain: "“Grupos que pueden contener grupos” es la frase que define el patrón. <code>SujetoDeSeguridad.tienePermiso(p)</code>: el usuario responde directo, el grupo delega en sus hijos." },
          { n: 3, topic: "Composite", type: "mc",
            q: "En el diagrama, ¿de qué tipo debe ser la colección de hijos del compuesto?",
            options: [
              { t: "<code>List&lt;ElementoDeCatalogo&gt;</code> — la abstracción", ok: true },
              { t: "<code>List&lt;Producto&gt;</code> — el tipo concreto de la hoja", ok: false },
              { t: "<code>List&lt;Categoria&gt;</code> — el tipo del compuesto", ok: false },
              { t: "Dos listas separadas, una de cada tipo", ok: false },
            ],
            explain: "Si guardás el tipo concreto, perdés exactamente lo que el patrón aporta: la uniformidad y el anidamiento arbitrario. Es <b>la</b> línea que hay que tener bien en el diagrama del parcial." },
        ],
      });
    },
  });
})();
