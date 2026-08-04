/* ============================================================
   Patrón Singleton
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "singleton",
    title: "Singleton",
    tag: "1️⃣",
    group: "Patrones de Diseño",
    resumen: "Creacional · una única instancia",
    keywords: ["singleton", "unica instancia", "instancia unica", "getinstance", "global", "configuracion", "pool", "logger", "antipatron"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Creacional",
        titulo: "Singleton",
        intencion: "Garantizar que una clase tenga una única instancia y dar un punto de acceso global a ella.",

        analogia: {
          emoji: "🏛️",
          html: `<p>El presidente de un país. Puede haber muchos ciudadanos, pero en un momento dado hay
            <b>un solo presidente</b>, y todos saben cómo llegar a él (“el que está en la Casa Rosada”). No tiene sentido
            que cada oficina cree su propio presidente: es <b>uno solo, compartido por todos</b>.</p>`,
        },

        problema: `
          <p>Hay recursos de los que debe existir <b>exactamente una instancia</b> en todo el sistema, compartida por
          todos: la <b>configuración global</b>, un <b>pool de conexiones</b> a la base, un <b>logger</b> central, una
          caché en memoria. Si cada parte del código crea su propia instancia, se rompe la coherencia (dos configuraciones
          distintas, dos pools compitiendo por las conexiones) o se desperdician recursos.</p>
          <p>Singleton resuelve dos cosas a la vez: <b>que haya una sola instancia</b> y <b>que sea fácil de alcanzar</b>
          desde cualquier lado.</p>`,

        uml: `classDiagram
    class Singleton {
        -instancia: Singleton$
        -Singleton()
        +getInstance() Singleton$
        +operacion()
    }
    Singleton --> Singleton : instancia única`,

        roles: [
          { n: "Singleton", d: "la clase misma: tiene el <b>constructor privado</b> (para que nadie la instancie con <code>new</code> desde afuera), un atributo <b>estático</b> que guarda la única instancia, y un método estático <code>getInstance()</code> que la crea la primera vez y la devuelve siempre." },
        ],

        mano: [
          "Un solo rectángulo (no hay jerarquía).",
          "En atributos: <code>-instancia: Singleton</code> <b>subrayado</b> (subrayado = miembro estático/de clase).",
          "En métodos: el <b>constructor privado</b> (<code>-Singleton()</code>) y <code>+getInstance(): Singleton</code> <b>subrayado</b> (estático).",
          "Opcional: una flecha de asociación de la clase a sí misma, etiquetada “instancia única”.",
          "<b>Tip:</b> lo que tiene que quedar claro es el constructor <b>privado</b> (el ‘−’) y el <code>getInstance</code> <b>estático</b> (subrayado). Eso es todo el patrón.",
        ],

        mal: {
          intro: "<p>Sin Singleton, cada quien crea su propia configuración y terminan descoordinadas:</p>",
          code: `class ConfiguracionApp {
    private String urlBase;
    private int timeout;
    public ConfiguracionApp() { /* lee el archivo de config del disco... */ }
}

// En cada rincón del código:
class ServicioA {
    ConfiguracionApp config = new ConfiguracionApp();  // ❌ una instancia
}
class ServicioB {
    ConfiguracionApp config = new ConfiguracionApp();  // ❌ otra instancia distinta
}
// Se lee el archivo N veces; si cambia en runtime, cada uno ve algo distinto.`,
          nota: "Además de desperdiciar recursos (leer el archivo muchas veces), no hay una <b>única fuente de verdad</b>: dos servicios pueden tener configuraciones distintas.",
        },

        bien: {
          code: `class ConfiguracionApp {
    // la única instancia, estática y privada
    private static ConfiguracionApp instancia;

    private String urlBase;
    private int timeout;

    // constructor privado: nadie puede hacer new ConfiguracionApp() desde afuera
    private ConfiguracionApp() {
        // lee el archivo de config una sola vez
    }

    // punto de acceso global
    public static ConfiguracionApp getInstance() {
        if (instancia == null) {
            instancia = new ConfiguracionApp();
        }
        return instancia;
    }

    public String getUrlBase() { return urlBase; }
}

// En todo el código, siempre la MISMA instancia:
ConfiguracionApp.getInstance().getUrlBase();`,
          nota: "Constructor <b>privado</b> + instancia <b>estática</b> + <code>getInstance()</code>: los tres ingredientes. La primera llamada la crea; las siguientes devuelven la misma.",
        },

        extra:
          '<div class="callout warn"><div class="callout-title">⚠️ Ojo: en sistemas con hilos</div>' +
          "<p>El <code>getInstance()</code> de arriba es la versión simple (didáctica). En un servidor con muchos hilos, " +
          "dos hilos podrían entrar al <code>if</code> al mismo tiempo y crear <b>dos</b> instancias. Se resuelve con " +
          "inicialización temprana (crear la instancia al declarar el atributo) o con <i>double-checked locking</i>. " +
          "Para el parcial alcanza con <b>mencionar</b> que hay que contemplar la concurrencia.</p></div>",

        keywords: [
          { k: "una única instancia", ej: "“debe existir una sola configuración en todo el sistema”" },
          { k: "punto de acceso global", ej: "que cualquier componente pueda alcanzarla" },
          { k: "configuración global", ej: "los parámetros de la aplicación" },
          { k: "pool de conexiones", ej: "un único pool compartido a la base de datos" },
          { k: "logger / registro central", ej: "un solo componente que escribe el log" },
          { k: "caché en memoria compartida", ej: "una única caché para toda la app" },
        ],

        noUsar: `
          <p><b>Singleton es el patrón más criticado del catálogo</b>, y con razón. Antes de usarlo, pensá dos veces:</p>
          <ul>
            <li><b>Introduce estado global:</b> cualquiera puede tocar la instancia desde cualquier lado, y eso hace el
            sistema difícil de razonar (como una variable global disfrazada de patrón).</li>
            <li><b>Acopla y dificulta el testing:</b> como se accede con <code>getInstance()</code> en vez de recibirla
            inyectada, no la podés <b>mockear</b> en los tests. Va en contra de la
            <a class="inline" data-go="inyeccion-dependencias">inyección de dependencias</a>.</li>
            <li><b>Esconde dependencias:</b> una clase que usa <code>Config.getInstance()</code> no declara que depende de
            la config; queda oculto.</li>
          </ul>
          <div class="callout tip" style="margin-top:.6rem"><p><b>Alternativa moderna preferida:</b> en vez de un Singleton
          “clásico”, tener <b>una sola instancia</b> creada en el arranque y <b>inyectarla</b> donde haga falta (es lo que
          hace Spring con los <i>beans</i> <code>@Component</code>/<code>@Service</code>, que por defecto son únicos pero
          <b>inyectados</b>, no accedidos globalmente). Así tenés “una sola instancia” <b>sin</b> los problemas del estado
          global.</p></div>`,

        justificar: [
          `“Usé <b>Singleton</b> para <b>[la configuración / el pool de conexiones]</b> porque el enunciado requiere que
           exista <b>una única instancia compartida</b> en todo el sistema, con un punto de acceso común. El constructor
           privado impide crear otras instancias y <code>getInstance()</code> garantiza que siempre se use la misma.”`,
          `“Contemplé que, en un entorno con múltiples hilos, la creación debe ser <b>segura ante concurrencia</b> (con
           inicialización temprana o bloqueo), para no crear más de una instancia por una condición de carrera.”`,
          `“Como alternativa —y para no introducir estado global ni perder testeabilidad— podría lograr la misma unicidad
           con <b>una instancia inyectada</b> por el contenedor de dependencias, lo cual respeta mejor la
           <b>Inversión de Dependencias</b>.”`,
        ],

        confusiones: [
          {
            titulo: "Singleton vs clase con métodos estáticos (utility class)",
            a: { t: "Singleton", html: `<p>Es un <b>objeto</b> (una instancia): tiene estado, puede implementar interfaces
              y —si lo inyectás— reemplazarse en tests.</p><p>Se puede pasar como parámetro.</p>` },
            b: { t: "Clase de utilidades", html: `<p>Son sólo <b>funciones estáticas</b> sin estado (<code>Math.max</code>).</p>
              <p>No es una instancia, no se puede mockear ni sustituir.</p>` },
            regla: "Si necesitás <b>estado compartido</b> y poder sustituirlo, Singleton (mejor aún, inyectado). Si son sólo funciones puras, una clase de utilidades.",
          },
          {
            titulo: "Singleton vs Inyección de Dependencias",
            a: { t: "Singleton clásico", html: `<p>La clase se accede con <code>getInstance()</code>.</p>
              <p>Estado global, difícil de testear.</p>` },
            b: { t: "Instancia única inyectada", html: `<p>Se crea una sola vez y se <b>pasa</b> a quien la necesita.</p>
              <p>Testeable (mockeable), dependencias explícitas. Es lo que hace Spring.</p>` },
            regla: "Las dos dan “una sola instancia”. La inyectada es la preferida hoy: misma unicidad, sin los problemas del estado global.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Singleton", type: "mc",
            q: "“El sistema debe tener un único pool de conexiones a la base de datos, compartido por todos los servicios.” ¿Qué patrón?",
            options: [
              { t: "Singleton (o una instancia única inyectada)", ok: true },
              { t: "Factory Method", ok: false },
              { t: "Strategy", ok: false },
              { t: "Adapter", ok: false },
            ],
            explain: "“Un único … compartido por todos” = una sola instancia con acceso común: Singleton. Idealmente, esa instancia única se inyecta en vez de accederse globalmente." },
          { n: 2, topic: "Singleton", type: "mc",
            q: "¿Cuáles son los tres ingredientes del Singleton?",
            options: [
              { t: "Constructor privado + atributo estático con la instancia + método estático getInstance()", ok: true },
              { t: "Interfaz + varias implementaciones + contexto", ok: false },
              { t: "Clase abstracta + método plantilla + subclases", ok: false },
            ],
            explain: "El constructor privado impide el <code>new</code> externo; la instancia estática la guarda; <code>getInstance()</code> la crea una vez y la devuelve." },
          { n: 3, topic: "Singleton", type: "vf",
            q: "Singleton facilita el testing porque se puede reemplazar fácilmente por un mock.",
            options: [{ t: "Falso", ok: true }, { t: "Verdadero", ok: false }],
            explain: "Al revés: como se accede con <code>getInstance()</code> y no se inyecta, es difícil de mockear. Es una de sus principales críticas; por eso se prefiere una instancia única <b>inyectada</b>." },
          { n: 4, topic: "Singleton", type: "mc",
            q: "¿Qué riesgo hay que contemplar al implementar <code>getInstance()</code> en un servidor con muchos hilos?",
            options: [
              { t: "Que dos hilos entren a la vez y creen dos instancias (condición de carrera)", ok: true },
              { t: "Que la instancia consuma poca memoria", ok: false },
              { t: "Que el constructor sea público", ok: false },
            ],
            explain: "Sin control de concurrencia, dos hilos pueden pasar el <code>if (instancia == null)</code> simultáneamente. Se resuelve con inicialización temprana o double-checked locking." },
        ],
      });
    },
  });
})();
