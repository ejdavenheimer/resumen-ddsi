/* ============================================================
   Principios — SOLID
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "solid",
    title: "SOLID",
    tag: "🎯",
    group: "Principios",
    resumen: "Los 5 principios, con smells y refactors",
    keywords: ["solid", "srp", "ocp", "lsp", "isp", "dip", "principios", "smell", "responsabilidad unica", "open closed", "liskov", "inversion de dependencias"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Principios</div>
          <h1>SOLID</h1>
          <p class="lead">Cinco principios que hacen que el código orientado a objetos sea mantenible.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Cómo se usa SOLID en el parcial</div>
          <p>SOLID casi nunca se pregunta suelto: aparece en el punto de <b>justificación de decisiones de diseño</b>
          (“haciendo referencia a los principios que guían al diseño”). La forma que puntúa es siempre la misma:
          <i>“Apliqué Strategy para las reglas de descuento; de esta manera, agregar una regla nueva no requiere modificar
          el motor de cálculo (<b>Open/Closed</b>), y cada regla tiene una sola razón para cambiar (<b>SRP</b>)”</i>.</p>
          <p>Es decir: <b>patrón → principio que cumple → beneficio concreto</b>.</p>
        </div>

        <div class="cs-grid">
          <div class="cs-tile"><div class="letra">S</div><h3>Single Responsibility</h3><p>Una sola razón para cambiar.</p></div>
          <div class="cs-tile"><div class="letra">O</div><h3>Open/Closed</h3><p>Abierto a extensión, cerrado a modificación.</p></div>
          <div class="cs-tile"><div class="letra">L</div><h3>Liskov Substitution</h3><p>El subtipo tiene que poder reemplazar al padre.</p></div>
          <div class="cs-tile"><div class="letra">I</div><h3>Interface Segregation</h3><p>Interfaces chicas y específicas.</p></div>
          <div class="cs-tile"><div class="letra">D</div><h3>Dependency Inversion</h3><p>Depender de abstracciones, no de detalles.</p></div>
        </div>

        <!-- ============================ S ============================ -->
        <h2>S — Single Responsibility Principle (SRP)</h2>
        <p><b>Definición:</b> una clase debe tener <b>una sola razón para cambiar</b>.</p>
        <div class="analogia">
          <div class="emo">🥖</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un panadero se dedica a hacer pan. Si además atendiera la caja, hiciera la limpieza y llevara la contabilidad,
            cada vez que cambie algo en cualquiera de esas áreas (nueva ley impositiva, nuevo protocolo de limpieza,
            nuevo sistema de cobro) el panadero tendría que aprender algo nuevo y su trabajo se interrumpiría.
            Mejor: un panadero, un cajero, un encargado de limpieza y un contador.</p>
          </div>
        </div>
        <p><b>Ojo con el malentendido más común:</b> SRP <u>no</u> significa “una clase, un método”. Significa
        <b>una clase, un motivo de cambio</b> — es decir, un solo actor o área del negocio que pueda pedir que cambie.</p>

        ${APP.code(`class ReporteDeVentas {
    public void generar() {
        ResultSet rs = jdbc.query("SELECT ...");   // ← cambia si cambia la BD
        PdfDocument pdf = armarPdf(rs);            // ← cambia si cambia el formato
        smtp.enviar("gerencia@x.com", pdf);        // ← cambia si cambia el proveedor de mail
    }
}`, { variant: "bad", label: "❌ Tres razones para cambiar" })}
        ${APP.code(`class ReporteDeVentas {
    private VentaRepository repo;          // datos
    private ReporteBuilder builder;        // formato
    private Notificador notificador;       // envío

    public void generar(Periodo p) {
        List<Venta> ventas = repo.buscarPor(p);
        Archivo archivo = builder.construir(ventas);
        notificador.enviar(Destinatario.GERENCIA, archivo);
    }
}`, { variant: "good", label: "✅ Una responsabilidad por clase" })}
        <div class="callout warn">
          <div class="callout-title">🔍 Cómo detectar la violación</div>
          <ul>
            <li>La descripción de la clase necesita un “y”: “guarda en la base <b>y</b> genera el PDF <b>y</b> manda el mail”.</li>
            <li>Nombres genéricos: <code>Manager</code>, <code>Helper</code>, <code>Utils</code>, <code>Processor</code>.</li>
            <li>Métodos que no comparten ningún atributo de la clase (baja cohesión).</li>
            <li>Una entidad de dominio que sabe SQL, HTTP o HTML.</li>
          </ul>
        </div>

        <!-- ============================ O ============================ -->
        <h2>O — Open/Closed Principle (OCP)</h2>
        <p><b>Definición:</b> las entidades de software deben estar <b>abiertas a extensión</b> y <b>cerradas a modificación</b>.
        Deberías poder agregar comportamiento nuevo sin editar el código que ya funciona.</p>
        <div class="analogia">
          <div class="emo">🔌</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un enchufe. Podés enchufar cosas nuevas —una lámpara, un cargador, una aspiradora— sin abrir la pared
            y modificar el cableado. El enchufe está <b>cerrado a modificación</b> (nadie toca la instalación) y
            <b>abierto a extensión</b> (podés conectar lo que quieras que respete la ficha).</p>
          </div>
        </div>
        ${APP.code(`double calcular(String tipo, Pedido p) {
    if (tipo.equals("ESTANDAR"))      return p.getPeso() * 100;
    else if (tipo.equals("EXPRESS"))  return p.getPeso() * 200 + 500;
    else if (tipo.equals("RETIRO"))   return 0;
    // Cada tipo nuevo MODIFICA esta clase y obliga a re-testearla entera
}`, { variant: "bad", label: "❌ Cerrado a extensión, abierto a modificación" })}
        ${APP.code(`interface EstrategiaDeCosto { double calcular(Pedido p); }

class CostoEstandar implements EstrategiaDeCosto { /* ... */ }
class CostoExpress  implements EstrategiaDeCosto { /* ... */ }
class CostoRetiro   implements EstrategiaDeCosto { /* ... */ }
// ✅ Agregar CostoInternacional = una clase nueva. Nada existente se toca.`, { variant: "good", label: "✅ Extensión por polimorfismo" })}
        <div class="callout key">
          <div class="callout-title">🔑 La conexión con los patrones</div>
          <p>Cuando el enunciado dice “<b>se espera que en el futuro se agreguen más tipos sin modificar la lógica
          existente</b>”, te está pidiendo literalmente OCP. Y la herramienta para cumplirlo casi siempre es
          <a class="inline" data-go="strategy">Strategy</a> o <a class="inline" data-go="state">State</a>.</p>
        </div>
        <div class="callout warn">
          <div class="callout-title">🔍 Cómo detectar la violación</div>
          <p>Cadenas de <code>if/else</code> o <code>switch</code> sobre tipos, y cadenas de <code>instanceof</code> con casts.
          Regla práctica: si para agregar una funcionalidad tenés que <b>editar</b> un archivo existente en vez de
          <b>crear</b> uno nuevo, hay un OCP violado.</p>
        </div>

        <!-- ============================ L ============================ -->
        <h2>L — Liskov Substitution Principle (LSP)</h2>
        <p><b>Definición:</b> si una clase B hereda de A, todo lugar donde se usa A debería poder usar B
        <b>sin romperse y sin que el cliente se entere</b>.</p>
        <div class="analogia">
          <div class="emo">📺</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Si tu control remoto universal funciona para “TVs” en general, cualquier TV que compres debería
            funcionar con él. Si comprás una que exige un ritual raro para prenderse (“mantené apretado 5 segundos
            mientras tapás el sensor”), esa TV violó la sustitución: no se comporta como el contrato “TV” prometía.</p>
          </div>
        </div>
        ${APP.code(`class Rectangulo {
    public void setAncho(int a) { this.ancho = a; }
    public void setAlto(int a)  { this.alto = a; }
    public int area() { return ancho * alto; }
}

class Cuadrado extends Rectangulo {
    @Override public void setAncho(int a) { this.ancho = a; this.alto = a; }
    @Override public void setAlto(int a)  { this.ancho = a; this.alto = a; }
}

void usar(Rectangulo r) {
    r.setAncho(5);
    r.setAlto(4);
    assert r.area() == 20;   // ✅ Rectangulo · ❌ Cuadrado devuelve 16
}`, { variant: "bad", label: "❌ El caso clásico: Cuadrado extends Rectangulo" })}
        <div class="callout info">
          <p><b>La lección:</b> que en matemática “un cuadrado sea un rectángulo” no implica que la herencia sea válida
          en objetos. Lo que decide es si el <b>comportamiento observable</b> es sustituible.</p>
        </div>
        <div class="callout warn">
          <div class="callout-title">🔍 Cómo detectar la violación</div>
          <ul>
            <li>Métodos heredados que lanzan <code>UnsupportedOperationException</code> (el pingüino que no vuela).</li>
            <li>La subclase <b>endurece precondiciones</b>: acepta menos casos que el padre.</li>
            <li>La subclase <b>debilita postcondiciones</b>: garantiza menos que el padre.</li>
            <li>El cliente necesita hacer <code>instanceof</code> para saber cómo tratar al objeto.</li>
          </ul>
        </div>

        <!-- ============================ I ============================ -->
        <h2>I — Interface Segregation Principle (ISP)</h2>
        <p><b>Definición:</b> ningún cliente debería verse obligado a depender de métodos que no usa. Mejor
        <b>muchas interfaces chicas y específicas</b> que una gigante.</p>
        <div class="analogia">
          <div class="emo">📱</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Si comprás un smartphone que también es cafetera, aspiradora y despertador, terminás pagando —y cargando—
            cosas que no vas a usar. Y cuando falle el mecanismo de la cafetera, te quedás sin teléfono.
            Mejor el celu por un lado y la cafetera por el otro.</p>
          </div>
        </div>
        ${APP.code(`interface Empleado {
    void trabajar();
    void aprobarVacaciones(Solicitud s);
    void firmarBalance();
}

class Cadete implements Empleado {
    public void trabajar() { /* ok */ }
    public void aprobarVacaciones(Solicitud s) { throw new UnsupportedOperationException(); }
    public void firmarBalance()                { throw new UnsupportedOperationException(); }
}`, { variant: "bad", label: "❌ Interfaz gorda" })}
        ${APP.code(`interface Trabajador      { void trabajar(); }
interface ApruebaLicencias { void aprobarVacaciones(Solicitud s); }
interface Directivo       { void firmarBalance(); }

class Cadete  implements Trabajador { /* sólo lo que puede */ }
class Gerente implements Trabajador, ApruebaLicencias, Directivo { /* ... */ }`, { variant: "good", label: "✅ Interfaces segregadas" })}
        <div class="callout warn">
          <div class="callout-title">🔍 Cómo detectar la violación</div>
          <p>Clases que implementan una interfaz y tienen <b>muchos métodos vacíos o con excepción</b>. También:
          cambiar la interfaz rompe la compilación de clases a las que ese cambio no les incumbe.</p>
        </div>
        <div class="callout info">
          <p><b>ISP y LSP van de la mano:</b> una interfaz gorda casi siempre produce implementaciones que no cumplen el
          contrato completo, y eso es una violación de Liskov. Segregar la interfaz arregla las dos cosas.</p>
        </div>

        <!-- ============================ D ============================ -->
        <h2>D — Dependency Inversion Principle (DIP)</h2>
        <p><b>Definición:</b> los módulos de alto nivel no deben depender de los de bajo nivel; <b>ambos deben depender
        de abstracciones</b>. Y las abstracciones no deben depender de los detalles, sino al revés.</p>
        <div class="analogia">
          <div class="emo">🎛️</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Tu control remoto no depende de una marca específica de TV: depende de un <b>estándar de control remoto</b>.
            Podés cambiar la TV sin cambiar el control, siempre que las dos respeten el estándar. La abstracción
            (el estándar) es lo que está en el medio, y ninguna de las dos partes depende de la otra directamente.</p>
          </div>
        </div>
        ${APP.code(`class ContratacionService {
    private MySqlRepository repo = new MySqlRepository();   // ❌ clase concreta, creada acá
    private TwilioSmsSender sms  = new TwilioSmsSender();   // ❌ imposible de testear

    public void contratar(Datos d) { repo.insertar(...); sms.enviar(...); }
}`, { variant: "bad", label: "❌ Alto nivel depende de detalles" })}
        ${APP.code(`class ContratacionService {
    private final ContratacionRepository repo;   // interfaz definida por el DOMINIO
    private final Notificador notificador;       // interfaz definida por el DOMINIO

    public ContratacionService(ContratacionRepository repo, Notificador notificador) {
        this.repo = repo;                        // se inyectan desde afuera
        this.notificador = notificador;
    }

    public void contratar(Datos d) {
        Contratacion c = new Contratacion(d);
        repo.guardar(c);
        notificador.avisar(d.getContacto(), "Contratación " + c.getCodigo());
    }
}

// En producción:  new ContratacionService(new MySqlContratacionRepository(), new TwilioAdapter(...))
// En los tests:   new ContratacionService(new RepoEnMemoria(),               new NotificadorFalso())`,
        { variant: "good", label: "✅ Ambos dependen de abstracciones" })}
        <div class="callout key">
          <div class="callout-title">🔑 El detalle que separa una buena respuesta de una excelente</div>
          <p>La interfaz <b>pertenece al módulo de alto nivel</b> y está escrita en su vocabulario:
          <code>guardar(Contratacion)</code>, no <code>ejecutarSql(String)</code>. Si la abstracción devuelve un
          <code>ResultSet</code> o un <code>JsonNode</code> del proveedor, el detalle se filtró y no hay inversión real.</p>
        </div>
        <div class="callout tip">
          <div class="callout-title">✅ Inyección de dependencias</div>
          <p>Es la <b>técnica</b> con la que se cumple DIP: la dependencia se recibe desde afuera (por constructor,
          por setter o por un contenedor como Spring) en lugar de crearse adentro con <code>new</code>.
          El beneficio más tangible es que podés <b>mockear</b> en los tests — es exactamente lo que se ve en la
          práctica de la cursada con Mockito.</p>
        </div>

        <h2>Los cinco de un vistazo</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Letra</th><th>En una línea</th><th>Smell típico</th><th>Patrón que suele resolverlo</th></tr></thead>
          <tbody>
            <tr><td>S</td><td>Una razón para cambiar</td><td>God class, entidad que sabe SQL</td><td>Facade, capas, extraer clase</td></tr>
            <tr><td>O</td><td>Extender sin modificar</td><td><code>switch</code> por tipo que crece</td><td>Strategy, State, Command</td></tr>
            <tr><td>L</td><td>El hijo reemplaza al padre</td><td><code>UnsupportedOperationException</code></td><td>Rediseñar la jerarquía; composición</td></tr>
            <tr><td>I</td><td>Interfaces chicas</td><td>Métodos vacíos al implementar</td><td>Segregar interfaces</td></tr>
            <tr><td>D</td><td>Depender de abstracciones</td><td><code>new</code> de infraestructura en el dominio</td><td>Adapter + inyección de dependencias</td></tr>
          </tbody>
        </table></div>

        <h2>🎮 Spot the smell (5 casos)</h2>
        <p>Primero identificá el principio, después elegí la refactorización.
        Hay <a class="inline" data-go="p-solid">15 casos en total en la sección de práctica</a>.</p>
        <div id="solidMini"></div>
      `;

      APP.solidSmell(el.querySelector("#solidMini"), APP.DATA.solid.slice(0, 5), { set: "solid-smell" });
    },
  });
})();
