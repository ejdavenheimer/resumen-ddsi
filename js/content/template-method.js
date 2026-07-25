/* ============================================================
   Patrón Template Method
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "template-method",
    title: "Template Method",
    tag: "🎂",
    group: "Patrones de Diseño",
    resumen: "Comportamiento · esqueleto con pasos variables",
    keywords: ["template method", "plantilla", "esqueleto", "algoritmo", "hook", "clase abstracta", "herencia"],
    render(el) {
      APP.patternPage(el, {
        categoria: "De comportamiento",
        titulo: "Template Method",
        intencion: "Definir el esqueleto de un algoritmo en una clase abstracta, dejando algunos pasos concretos a las subclases.",

        analogia: {
          emoji: "🎂",
          html: `<p>La receta base de una torta. Todas siguen los mismos pasos y en el mismo orden: mezclás los
            ingredientes, horneás, desmoldás, decorás.</p>
            <p>Lo que cambia es <b>cómo</b> hacés cada cosa: la de chocolate lleva cacao en la mezcla y ganache en la
            decoración; la de vainilla, esencia y dulce de leche. Pero <b>el orden nunca cambia</b> —nadie decora antes
            de hornear— y el horneado y el desmolde son idénticos para todas.</p>`,
        },

        problema: `
          <p>Varios procedimientos siguen <b>la misma estructura general</b>, pero difieren en algunos pasos concretos.</p>
          <p>Si cada variante implementa el algoritmo completo, el esqueleto queda <b>duplicado</b> en todas.
          Y cuando cambie un paso común —por ejemplo, la política de envío del reporte, o agregar una auditoría después
          de persistir— hay que modificarlo en todas las subclases. Inevitablemente, alguna se olvida.</p>
          <p>Peor: nada garantiza que las variantes respeten el <b>orden</b>. Alguien puede escribir una subclase que
          valide después de persistir, y no hay nada en el código que lo impida.</p>`,

        mal: {
          intro: "<p>Cada reporte reimplementa todo el procedimiento:</p>",
          code: `class ReporteDeVentas {
    public Archivo generar(Parametros p) {
        validar(p);                                  // ← duplicado
        List<Venta> datos = ventaRepo.buscar(p);     // ← lo único propio
        Archivo a = armarPlanilla(datos);            // ← lo único propio
        auditoria.registrar("REPORTE_VENTAS", p);    // ← duplicado
        mailer.enviar(p.getDestinatario(), a);       // ← duplicado
        return a;
    }
    private void validar(Parametros p) { /* 15 líneas idénticas */ }
}

class ReporteDeStock {
    public Archivo generar(Parametros p) {
        validar(p);                                  // ← las mismas 15 líneas, copiadas
        List<Item> datos = stockRepo.buscar(p);
        Archivo a = armarPdf(datos);
        mailer.enviar(p.getDestinatario(), a);       // 😱 se olvidaron de auditar
        return a;
    }
    private void validar(Parametros p) { /* copy-paste */ }
}`,
          nota: `El bug ya está: <code>ReporteDeStock</code> no audita. Nadie lo va a notar hasta que lo pida el área
            de compliance. Ese es exactamente el costo de duplicar el esqueleto.`,
        },

        bien: {
          intro: "<p>El esqueleto se escribe <b>una sola vez</b> y las subclases completan sólo lo suyo:</p>",
          code: `abstract class Reporte {

    // EL TEMPLATE METHOD: define el algoritmo y su orden. final = nadie lo cambia.
    public final Archivo generar(Parametros p) {
        validar(p);
        Datos datos   = consultarDatos(p);      // ← varía
        Archivo salida = armarArchivo(datos);   // ← varía
        auditar(p);
        enviar(p.getDestinatario(), salida);
        return salida;
    }

    // Pasos comunes: implementados acá, una sola vez
    private void validar(Parametros p) {
        if (p.getDesde().isAfter(p.getHasta())) throw new RangoInvalido();
        if (p.getDestinatario() == null)        throw new DestinatarioRequerido();
    }
    private void auditar(Parametros p)                       { auditoria.registrar(nombre(), p); }
    private void enviar(Destinatario d, Archivo a)           { mailer.enviar(d, a); }

    // Pasos que varían: cada subclase los implementa
    protected abstract Datos   consultarDatos(Parametros p);
    protected abstract Archivo armarArchivo(Datos datos);
    protected abstract String  nombre();

    // HOOK: paso opcional. Por defecto no hace nada; la subclase puede engancharse.
    protected void alFinalizar(Archivo a) { }
}

class ReporteDeVentas extends Reporte {
    @Override protected Datos   consultarDatos(Parametros p) { return ventaRepo.buscar(p); }
    @Override protected Archivo armarArchivo(Datos d)        { return planillaBuilder.construir(d); }
    @Override protected String  nombre()                     { return "REPORTE_VENTAS"; }
}

class ReporteDeStock extends Reporte {
    @Override protected Datos   consultarDatos(Parametros p) { return stockRepo.buscar(p); }
    @Override protected Archivo armarArchivo(Datos d)        { return pdfBuilder.construir(d); }
    @Override protected String  nombre()                     { return "REPORTE_STOCK"; }
    @Override protected void    alFinalizar(Archivo a)       { cache.invalidar("stock"); }
}`,
          nota: `Tres decisiones importantes: (1) <code>generar()</code> es <b>final</b> — el orden de los pasos no es
            negociable, y eso es <i>el</i> punto del patrón; (2) los pasos variables son <code>protected abstract</code>,
            no públicos: son detalle interno del algoritmo; (3) el <b>hook</b> <code>alFinalizar()</code> tiene cuerpo
            vacío, así que es opcional: quien lo necesita lo sobrescribe y quien no, ni se entera.`,
        },

        uml: `classDiagram
    class Reporte {
        <<abstract>>
        +generar(Parametros) Archivo
        -validar(Parametros) void
        -auditar(Parametros) void
        -enviar(Destinatario, Archivo) void
        #consultarDatos(Parametros)* Datos
        #armarArchivo(Datos)* Archivo
        #alFinalizar(Archivo) void
    }
    class ReporteDeVentas {
        #consultarDatos(Parametros) Datos
        #armarArchivo(Datos) Archivo
    }
    class ReporteDeStock {
        #consultarDatos(Parametros) Datos
        #armarArchivo(Datos) Archivo
        #alFinalizar(Archivo) void
    }
    Reporte <|-- ReporteDeVentas
    Reporte <|-- ReporteDeStock
    note for Reporte "generar() es FINAL: fija el orden.<br/>validar/auditar/enviar: comunes.<br/>consultarDatos/armarArchivo: abstractos.<br/>alFinalizar: hook opcional."`,

        roles: [
          { n: "Reporte", d: "la <b>AbstractClass</b>: contiene el <i>template method</i> (el algoritmo con su orden fijo), los pasos comunes ya implementados, los pasos abstractos que declara y los hooks opcionales." },
          { n: "generar()", d: "el <b>Template Method</b> propiamente dicho. Se declara <code>final</code> para que ninguna subclase pueda alterar el orden de los pasos. Es la garantía estructural del patrón." },
          { n: "consultarDatos() / armarArchivo()", d: "los <b>primitive operations</b>: pasos abstractos que cada subclase <b>debe</b> implementar. Son el punto de variación." },
          { n: "alFinalizar()", d: "un <b>hook</b>: paso con implementación vacía por defecto. La subclase puede engancharse si quiere, sin estar obligada." },
          { n: "ReporteDeVentas / ReporteDeStock", d: "las <b>ConcreteClass</b>: sólo implementan lo que las diferencia. Una variante nueva son 3 métodos, no 40 líneas." },
        ],

        mano: [
          "Arriba, la <b>clase abstracta</b> (nombre en <i>cursiva</i>): adentro, el <b>método plantilla</b> (subrayado o con nota “final”) que fija el orden de los pasos.",
          "En la misma clase, listá los <b>pasos abstractos</b> (nombre en cursiva) que las subclases deben implementar, y los pasos comunes ya resueltos.",
          "Debajo, las <b>subclases concretas</b> (<code>ReporteDeVentas</code>, <code>ReporteDeStock</code>), con flecha de herencia (punta triangular hueca, línea llena).",
          "En cada subclase escribí <b>sólo</b> los pasos que sobrescribe. Eso muestra que el esqueleto no se duplica.",
          "<b>Tip:</b> marcá el método plantilla como <code>final</code> (una nota alcanza). Es lo que garantiza que el orden no cambie, y es la diferencia visual con Strategy (que usa composición, no herencia).",
        ],

        keywords: [
          { k: "todos siguen el mismo proceso pero con variantes", ej: "distintos tipos de importación con el mismo flujo" },
          { k: "algoritmo con pasos comunes", ej: "validar → consultar → armar → enviar" },
          { k: "el esqueleto se mantiene / el orden es siempre el mismo", ej: "preparar, hornear, decorar" },
          { k: "sub-tipos con lógica específica", ej: "cada tipo de reporte consulta su propia fuente" },
          { k: "sólo cambia cómo se…", ej: "“sólo cambia cómo se parsea cada formato de archivo”" },
          { k: "en todos los casos primero se… y luego se…", ej: "el enunciado describe una secuencia obligatoria" },
        ],

        noUsar: `
          <p><b>1) Cuando las variantes no comparten esqueleto.</b> Si los procedimientos son realmente distintos,
          forzar un template method produce una clase base con métodos abstractos que no significan nada
          (<code>paso1()</code>, <code>paso2()</code>) y subclases retorcidas para encajar.</p>
          <p><b>2) Cuando lo que varía es el algoritmo completo.</b> Ahí va <a class="inline" data-go="strategy">Strategy</a>.</p>
          <p><b>3) Cuando la herencia te sale cara.</b> Template Method usa herencia, y en Java gastás la única
          superclase disponible. Si la clase ya hereda de otra cosa, o si querés poder cambiar los pasos en tiempo de
          ejecución, resolvelo con composición (pasos como estrategias inyectadas).</p>
          <div class="callout bad" style="margin-top:.8rem">
            <b>Trampa clásica:</b> jerarquías de <b>más de dos niveles</b> de template methods, donde cada nivel
            sobrescribe pasos del anterior. Se vuelve imposible saber qué código se ejecuta realmente. Si te pasa,
            pasá a composición.
          </div>`,

        justificar: [
          `“Usé <b>Template Method</b> porque las distintas <b>[variantes de reporte]</b> siguen el mismo esqueleto de
           pasos (<b>[validar, consultar datos, armar el archivo, auditar, enviar]</b>) y sólo varían en
           <b>[la consulta y el armado]</b>. La clase abstracta <b>[Reporte]</b> define el orden y los pasos comunes,
           y cada subclase implementa únicamente los pasos específicos, <b>evitando duplicar el algoritmo</b>.”`,
          `“Declaré el método plantilla como <code>final</code> para garantizar que ninguna subclase altere el orden de
           los pasos: eso convierte la secuencia en una <b>invariante estructural</b> del diseño y no en una convención
           que hay que recordar.”`,
          `“Elegí Template Method y no Strategy porque acá no varía el algoritmo completo sino <b>algunos pasos dentro
           de un esqueleto fijo</b>. Con Strategy tendría que reimplementar el esqueleto en cada estrategia o inyectar
           varias, con más ceremonia y sin garantizar el orden.”`,
        ],

        confusiones: [
          {
            titulo: "Template Method vs Strategy",
            a: { t: "Template Method", html: `<p>Usa <b>herencia</b>: la variante <i>es</i> una subclase.</p>
              <p>Varía <b>algunos pasos</b> dentro de un esqueleto fijo.</p>
              <p>La clase base <b>controla el flujo</b> y llama a las subclases (inversión de control:
              “no me llames, yo te llamo”).</p>
              <p>Se decide en <b>tiempo de compilación</b>.</p>` },
            b: { t: "Strategy", html: `<p>Usa <b>composición</b>: el contexto <i>tiene</i> una estrategia.</p>
              <p>Varía el <b>algoritmo completo</b>.</p>
              <p>El contexto delega y la estrategia hace todo el trabajo.</p>
              <p>Se puede cambiar en <b>tiempo de ejecución</b>.</p>` },
            regla: "Preguntate: <b>¿qué parte varía?</b> Todo el algoritmo → Strategy. Algunos pasos, con orden fijo → Template Method. Y se pueden combinar: un paso del template implementado como una estrategia inyectada.",
          },
          {
            titulo: "Template Method y Factory Method",
            a: { t: "Template Method", html: `<p>La subclase decide <b>cómo se hace un paso</b>.</p>` },
            b: { t: "Factory Method", html: `<p>La subclase decide <b>qué objeto se crea</b>.</p>` },
            regla: "Factory Method es, técnicamente, un caso particular de Template Method donde el paso variable es <b>la creación</b>. Por eso en el ejemplo de la pizzería <code>pedirPizza()</code> es un template method y <code>crearPizza()</code> es el factory method.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Template Method", type: "mc",
            q: "“Todas las importaciones abren el archivo, parsean cada línea según el formato, validan, persisten y cierran. Sólo el parseo cambia entre CSV, XML y JSON.”",
            options: [
              { t: "Template Method: el esqueleto en la clase abstracta y <code>parsear(linea)</code> abstracto", ok: true },
              { t: "Strategy: una estrategia por formato", ok: false },
              { t: "Adapter: uno por formato de archivo", ok: false },
              { t: "Composite", ok: false },
            ],
            explain: "Un solo paso variable dentro de un esqueleto invariante: es el caso de manual. Con Strategy tendrías que reimplementar (o inyectar) el esqueleto; con Template Method se escribe una sola vez y el orden queda garantizado." },
          { n: 2, topic: "Template Method", type: "mc",
            q: "¿Por qué el método plantilla se declara <code>final</code>?",
            options: [
              { t: "Para que ninguna subclase pueda alterar el orden de los pasos, que es la invariante que el patrón protege", ok: true },
              { t: "Por performance", ok: false },
              { t: "Porque Java lo exige en clases abstractas", ok: false },
            ],
            explain: "Si una subclase pudiera sobrescribir <code>generar()</code>, podría saltearse la auditoría o invertir el orden — y perderías exactamente la garantía por la que aplicaste el patrón." },
          { n: 3, topic: "Template Method", type: "mc",
            q: "¿Qué es un <i>hook</i> en este patrón?",
            options: [
              { t: "Un paso con implementación vacía por defecto, que la subclase puede sobrescribir opcionalmente", ok: true },
              { t: "Un método abstracto que la subclase está obligada a implementar", ok: false },
              { t: "Un listener que se suscribe al algoritmo", ok: false },
            ],
            explain: "La diferencia con el paso abstracto es la <b>obligatoriedad</b>: el abstracto no compila si no lo implementás; el hook es un punto de extensión opcional para las subclases que lo necesitan." },
          { n: 4, topic: "Template Method", type: "mc",
            q: "La clase que necesita el template method ya hereda de otra clase del framework. ¿Qué hacés?",
            options: [
              { t: "Resolverlo con composición: el esqueleto en una clase colaboradora y los pasos como estrategias inyectadas", ok: true },
              { t: "Usar herencia múltiple", ok: false },
              { t: "Duplicar el esqueleto en cada variante", ok: false },
            ],
            explain: "Java no tiene herencia múltiple de clases, y duplicar es justo lo que se quería evitar. La salida es la de siempre: <b>preferir composición sobre herencia</b>. Es un buen argumento para el punto de justificación." },
        ],
      });
    },
  });
})();
