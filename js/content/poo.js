/* ============================================================
   Fundamentos — Paradigma Orientado a Objetos
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "poo",
    title: "Paradigma OO",
    tag: "📚",
    group: "Fundamentos",
    resumen: "Clases, objetos, herencia, polimorfismo",
    keywords: ["poo", "objetos", "herencia", "polimorfismo", "encapsulamiento", "composicion", "interfaz", "clase abstracta"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Paradigma Orientado a Objetos</h1>
          <p class="lead">Modelar el mundo como objetos que colaboran, con datos y comportamiento juntos.</p>
        </div>

        <div class="analogia">
          <div class="emo">🏢</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Pensá en una empresa. No es “una lista de empleados y una lista de tareas”: es <b>gente que hace cosas</b>.
            Cada empleado sabe qué puede hacer (comportamiento) y tiene sus propios datos (nombre, sueldo, cargo).
            Los empleados colaboran mandándose mensajes: “¿me pasás ese archivo?”, “aprobame estas horas”.</p>
            <p>Eso es POO: <b>objetos que tienen datos y saben hacer cosas, y que colaboran mandándose mensajes</b>.</p>
          </div>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Por qué importa en esta materia</div>
          <p>Todos los puntos de “Modelado de Dominio” de los finales se resuelven con objetos. Y casi todos los errores
          que se cobran caro vienen del mismo lugar: <b>modelos anémicos</b>, donde las clases son bolsas de getters y setters
          y toda la lógica vive en un <code>Service</code> gigante. Si tus clases no <i>saben hacer</i> nada, no estás
          diseñando con objetos.</p>
        </div>

        <h2>Clase vs Instancia</h2>
        <p>La <b>clase</b> es el molde; la <b>instancia</b> (u objeto) es la cosa concreta.</p>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Clase</h4>
            <p>“Auto”. Define que todo auto tiene patente, modelo y combustible, y que sabe arrancar y avanzar.</p>
            <p><i>La receta de milanesas.</i></p>
          </div>
          <div class="vs-b">
            <h4>Instancia</h4>
            <p>“El Fiat 147 patente ABC123, con 12 litros de nafta”. Existe, ocupa memoria, tiene valores propios.</p>
            <p><i>Cada milanesa que hacés.</i></p>
          </div>
        </div>

        <h2>Atributos y métodos</h2>
        <p>Los <b>atributos</b> son los datos que guarda un objeto; los <b>métodos</b>, las cosas que sabe hacer.</p>
        ${APP.code(`class Auto {
    // atributos: lo que el objeto SABE
    private String patente;
    private String modelo;
    private double combustibleActual;

    // métodos: lo que el objeto HACE
    public void cargarNafta(double litros) {
        this.combustibleActual += litros;
    }

    public void avanzar(double km) {
        double consumo = km * 0.08;
        if (consumo > combustibleActual) throw new SinCombustible();
        this.combustibleActual -= consumo;
    }
}`)}
        <div class="callout tip">
          <p>Fijate que <code>avanzar()</code> <b>valida sola</b> que haya combustible. Si esa validación viviera afuera
          (en un <code>AutoService</code>), cualquiera podría dejar el combustible en negativo. El objeto es el guardián
          de su propia consistencia.</p>
        </div>

        <h2>Encapsulamiento</h2>
        <p>Ocultar los detalles internos: el objeto expone sólo lo que otros necesitan usar.</p>
        <div class="analogia">
          <div class="emo">🚗</div>
          <div class="txt">
            <strong class="lbl">Analogía</strong>
            <p>Cuando manejás un auto no necesitás saber cómo funciona el motor por dentro. Apretás el acelerador
            y listo. El pedal es la <i>interfaz pública</i>; la inyección de combustible es el <i>detalle privado</i>.</p>
          </div>
        </div>
        ${APP.code(`// ❌ Sin encapsulamiento: cualquiera rompe la consistencia
class CuentaMal {
    public double saldo;         // público: nadie controla nada
}
cuenta.saldo = -999999;          // 😱 válido para el compilador

// ✅ Con encapsulamiento: el objeto protege su estado
class Cuenta {
    private double saldo;

    public void extraer(double monto) {
        if (monto <= 0)      throw new MontoInvalido();
        if (monto > saldo)   throw new SaldoInsuficiente();
        this.saldo -= monto;
    }

    public double getSaldo() { return saldo; }   // lectura sí, escritura no
}`, { label: "Encapsulamiento" })}
        <div class="callout warn">
          <p><b>Ojo con el reflejo automático de generar getters y setters de todo.</b> Un <code>setSaldo()</code> público
          anula el encapsulamiento: volvés a poder dejar la cuenta en un estado imposible. Exponé <b>operaciones de negocio</b>
          (<code>extraer</code>, <code>depositar</code>), no acceso crudo a los atributos.</p>
        </div>

        <h2>Herencia</h2>
        <p>Una clase puede <b>heredar</b> de otra: recibe sus atributos y métodos, y agrega o modifica los suyos.</p>
        ${APP.code(`class Auto {
    protected double combustibleActual;
    public void avanzar(double km) { /* consume nafta */ }
    public String patente() { return patente; }
}

class AutoElectrico extends Auto {          // "un auto eléctrico ES UN auto"
    private double bateria;

    @Override
    public void avanzar(double km) {        // cambia CÓMO avanza
        this.bateria -= km * 0.15;
    }
}`)}
        <div class="callout warn">
          <div class="callout-title">⚠️ La herencia se justifica sólo si…</div>
          <p>…hay una relación real de <b>“es un/a”</b> <i>y</i> el subtipo es <b>sustituible</b> por el padre en cualquier
          lugar sin romper nada (eso es el principio de Liskov, la L de SOLID). Si tenés que tirar
          <code>UnsupportedOperationException</code> en algún método heredado, la herencia está mal planteada.</p>
        </div>

        <h2>Polimorfismo</h2>
        <p>Distintas clases responden al <b>mismo mensaje</b> de forma distinta. El que llama no necesita saber cuál es.</p>
        ${APP.code(`abstract class Animal {
    public abstract String hacerSonido();
}

class Perro extends Animal { public String hacerSonido() { return "Guau"; } }
class Gato  extends Animal { public String hacerSonido() { return "Miau"; } }
class Vaca  extends Animal { public String hacerSonido() { return "Muuu"; } }

// El cliente NO pregunta de qué tipo es:
for (Animal a : animales) {
    System.out.println(a.hacerSonido());   // cada uno responde a su manera
}`)}
        <div class="callout key">
          <div class="callout-title">🔑 Esto es lo más importante de toda la materia</div>
          <p><b>El polimorfismo es la herramienta con la que se eliminan los <code>if</code> por tipo.</b>
          Cada vez que veas una cadena de <code>if (tipo.equals("X"))</code> o de <code>instanceof</code>, hay un
          polimorfismo esperando a nacer. Casi todos los patrones del temario (Strategy, State, Composite,
          Template Method, Command, Observer) son formas distintas de aplicar esta misma idea.</p>
        </div>

        <h2>Composición</h2>
        <p>Un objeto contiene a otros como partes. Un <code>Auto</code> <b>tiene un</b> <code>Motor</code> y cuatro <code>Rueda</code>s.</p>
        ${APP.code(`class Auto {
    private Motor motor;                // composición: el auto TIENE un motor
    private List<Rueda> ruedas;

    public void arrancar() {
        motor.encender();               // le delega a su parte
    }
}`)}
        <div class="callout tip">
          <div class="callout-title">✅ Frase clásica: “preferí composición sobre herencia”</div>
          <p>La composición es más flexible: se puede <b>cambiar en tiempo de ejecución</b> (le cambiás el motor al auto)
          y no gasta la única bala de herencia que da Java. Además evita jerarquías profundas y frágiles.
          Strategy, State y Composite son, todos, composición.</p>
        </div>

        <h2>Interfaz</h2>
        <p>Un <b>contrato</b> de “qué puede hacer” algo, sin decir cómo.</p>
        ${APP.code(`interface Volador {
    void volar();
}

class Golondrina implements Volador { public void volar() { /* aletea */ } }
class Avion      implements Volador { public void volar() { /* turbinas */ } }
class Superman   implements Volador { public void volar() { /* magia */ } }

// Una clase puede implementar VARIAS interfaces
class Pato implements Volador, Nadador { /* ... */ }`)}

        <h2>Clase abstracta</h2>
        <p>Una clase parcial que <b>no se puede instanciar</b> y que sirve para que otras hereden de ella. A diferencia
        de la interfaz, puede traer <b>código y estado compartido</b>.</p>
        ${APP.code(`abstract class Vehiculo {
    protected String patente;               // estado compartido

    public String identificacion() {        // comportamiento compartido, ya implementado
        return getClass().getSimpleName() + " " + patente;
    }

    public abstract int cantidadDeRuedas(); // cada subclase lo resuelve
}

class Auto extends Vehiculo { public int cantidadDeRuedas() { return 4; } }
class Moto extends Vehiculo { public int cantidadDeRuedas() { return 2; } }

// new Vehiculo();   ❌ no compila: es abstracta`)}

        <h2>Confusiones típicas</h2>

        <h3>Herencia vs Composición</h3>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Herencia — “es un/a”</h4>
            <p>Un <code>AutoElectrico</code> <b>es un</b> <code>Auto</code>.<br>
               Un <code>Perro</code> <b>es un</b> <code>Animal</code>.</p>
            <p>Se hereda estructura y comportamiento. Es rígida: se define en tiempo de compilación y no se puede cambiar.</p>
          </div>
          <div class="vs-b">
            <h4>Composición — “tiene un/a”</h4>
            <p>Un <code>Auto</code> <b>tiene un</b> <code>Motor</code>.<br>
               Una <code>Casa</code> <b>tiene</b> <code>Habitacion</code>es.</p>
            <p>Se delega comportamiento. Es flexible: la parte se puede reemplazar en runtime.</p>
          </div>
        </div>

        <h3>Interfaz vs Clase abstracta</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Interfaz</th><th>Clase abstracta</th></tr></thead>
          <tbody>
            <tr><td>Define</td><td>Sólo el QUÉ (métodos sin cuerpo*)</td><td>El QUÉ y parte del CÓMO</td></tr>
            <tr><td>Estado</td><td>No puede tener atributos de instancia</td><td>Sí puede</td></tr>
            <tr><td>¿Cuántas?</td><td>Una clase puede implementar varias</td><td>Sólo se hereda de una</td></tr>
            <tr><td>Cuándo usarla</td><td>Para definir una capacidad o un contrato: <code>Volador</code>, <code>EstrategiaDeCosto</code></td><td>Cuando hay <b>comportamiento común real</b> que compartir: base de Template Method</td></tr>
            <tr><td>Patrones que la usan</td><td>Strategy, State, Command, Observer, Composite, Adapter</td><td>Template Method, Factory Method</td></tr>
          </tbody>
        </table></div>
        <p style="font-size:.85rem;color:var(--ink-soft)">* Desde Java 8 las interfaces admiten métodos <code>default</code>,
        pero seguí razonando con la distinción conceptual: si necesitás <b>estado</b> compartido, es clase abstracta.</p>

        <h2>Cualidades de diseño (lo que buscan en el punto de justificación)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Cualidad</th><th>Qué significa</th><th>Cómo la conseguís</th></tr></thead>
          <tbody>
            <tr><td>Bajo acoplamiento</td><td>Cada clase depende de lo mínimo posible, y de abstracciones</td><td>Interfaces, inyección de dependencias, Facade, Adapter</td></tr>
            <tr><td>Alta cohesión</td><td>Todo lo que hace una clase tiene que ver entre sí</td><td>SRP: una razón para cambiar</td></tr>
            <tr><td>Extensibilidad</td><td>Agregar comportamiento sin tocar lo existente</td><td>OCP + polimorfismo (Strategy, State)</td></tr>
            <tr><td>Reutilización</td><td>No duplicar lógica</td><td>Composición, Template Method</td></tr>
            <tr><td>Testeabilidad</td><td>Poder probar sin BD ni red</td><td>DIP: dependencias inyectadas y mockeables</td></tr>
            <tr><td>Mantenibilidad</td><td>Que un cambio impacte en un solo lugar</td><td>Todo lo anterior junto</td></tr>
          </tbody>
        </table></div>

        <h2>Code smells que se cobran en el parcial</h2>
        <ul>
          <li><b>Modelo anémico:</b> entidades con sólo getters/setters y toda la lógica en un service.</li>
          <li><b>God class / God service:</b> una clase que sabe y hace todo.</li>
          <li><b>Switch / if por tipo:</b> pide polimorfismo a gritos.</li>
          <li><b>Type code:</b> un <code>String tipo</code> o un enum del que dependen los <code>if</code>.</li>
          <li><b>Código duplicado:</b> el mismo algoritmo copiado en varias clases (candidato a Template Method).</li>
          <li><b>Nombres vacíos:</b> <code>Manager</code>, <code>Helper</code>, <code>Utils</code>, <code>Data</code>: si no podés nombrar la responsabilidad, probablemente no la tenga.</li>
          <li><b>Feature envy:</b> un método que usa más los datos de otra clase que los propios → mové el método a esa clase.</li>
        </ul>

        <h2>Ejercicio: ¿herencia o composición?</h2>
        <div id="pooQuiz"></div>
      `;

      APP.quiz(el.querySelector("#pooQuiz"), [
        { n: 1, topic: "Herencia vs Composición", type: "mc", q: "Perro → Animal", options: [
          { t: "Herencia (“es un/a”)", ok: true }, { t: "Composición (“tiene un/a”)", ok: false },
        ], explain: "Un perro <b>es un</b> animal, y es sustituible en cualquier lugar donde se espere un Animal." },
        { n: 2, topic: "Herencia vs Composición", type: "mc", q: "Casa → Habitaciones", options: [
          { t: "Composición (“tiene un/a”)", ok: true }, { t: "Herencia (“es un/a”)", ok: false },
        ], explain: "Una casa <b>tiene</b> habitaciones. Una casa no es una habitación." },
        { n: 3, topic: "Herencia vs Composición", type: "mc", q: "Pedido → EstrategiaDeDescuento", options: [
          { t: "Composición (“tiene un/a”)", ok: true }, { t: "Herencia (“es un/a”)", ok: false },
        ], explain: "El pedido <b>tiene</b> una estrategia, y además puede cambiarla en runtime. Ese es exactamente el patrón Strategy." },
        { n: 4, topic: "Herencia vs Composición", type: "mc", q: "CuentaCorriente → CuentaBancaria", options: [
          { t: "Herencia (“es un/a”)", ok: true }, { t: "Composición (“tiene un/a”)", ok: false },
        ], explain: "Una cuenta corriente <b>es una</b> cuenta bancaria… <i>siempre que</i> respete el contrato de la clase base (Liskov). Si le agrega restricciones que la base no tenía, revisá el diseño." },
        { n: 5, topic: "Herencia vs Composición", type: "mc", q: "Auto → Motor", options: [
          { t: "Composición (“tiene un/a”)", ok: true }, { t: "Herencia (“es un/a”)", ok: false },
        ], explain: "Clásico error de principiante: <code>class Auto extends Motor</code>. Un auto <b>tiene</b> un motor, no <b>es</b> un motor." },
        { n: 6, topic: "Herencia vs Composición", type: "mc", q: "Cuadrado → Rectángulo", options: [
          { t: "Ninguna de las dos: conviene una interfaz/abstracción común (<code>Forma</code>)", ok: true },
          { t: "Herencia (“es un/a”)", ok: false },
          { t: "Composición (“tiene un/a”)", ok: false },
        ], explain: "El caso más famoso de violación de Liskov: en matemática un cuadrado es un rectángulo, pero en objetos <code>setAncho(5); setAlto(4)</code> deja de funcionar. Lo que importa no es la taxonomía, es la <b>sustituibilidad del comportamiento</b>." },
        { n: 7, topic: "Interfaz vs Abstracta", type: "mc", q: "Cinco tipos de elemento de perfil comparten un atributo <code>nivelDeValidación</code> y el método <code>adjuntarEvidencia()</code>, que hace exactamente lo mismo en todos. ¿Interfaz o clase abstracta?", options: [
          { t: "Clase abstracta", ok: true },
          { t: "Interfaz", ok: false },
          { t: "Las dos dan lo mismo", ok: false },
        ], explain: "Hay <b>estado y comportamiento compartido real</b>. Con una interfaz tendrías que duplicar ese código cinco veces. (Es el caso del final de Talentia.)" },
        { n: 8, topic: "Code smells", type: "multi", q: "¿Cuáles de estos son code smells que conviene señalar en el punto de justificación?", options: [
          { t: "Una clase <code>PedidoManager</code> con 900 líneas que valida, calcula, persiste y notifica", ok: true },
          { t: "Un <code>switch (tipoDeEnvio)</code> repetido en tres métodos distintos", ok: true },
          { t: "Entidades con sólo getters y setters y toda la lógica en el service", ok: true },
          { t: "Una interfaz con un solo método implementada por tres clases", ok: false },
        ], explain: "Los tres primeros son God class, switch por tipo y modelo anémico. La cuarta opción no es un smell: es exactamente cómo se ve un Strategy bien aplicado." },
      ]);
    },
  });
})();
