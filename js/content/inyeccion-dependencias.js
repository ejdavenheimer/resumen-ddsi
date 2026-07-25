/* ============================================================
   Principios — Inyección de Dependencias
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "inyeccion-dependencias",
    title: "Inyección de Dependencias",
    tag: "🎯",
    group: "Principios",
    resumen: "La técnica para cumplir DIP",
    keywords: ["inyeccion de dependencias", "dependency injection", "dip", "constructor", "mock", "spring", "autowired", "testeable"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Principios</div>
          <h1>Inyección de Dependencias</h1>
          <p class="lead">En vez de que una clase cree sus propias dependencias, se las pasan desde afuera.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Es la técnica que hace cumplir DIP</div>
          <p>La <a class="inline" data-go="solid">D de SOLID</a> (Dependency Inversion) es el <b>principio</b>; la inyección
          de dependencias es la <b>técnica</b> concreta con la que se logra. Van siempre juntas en las justificaciones.</p>
        </div>

        <h2>El problema</h2>
        ${APP.code(`class PedidoService {
    private PedidoRepository repo = new MySQLPedidoRepository(); // ❌ acoplado a MySQL
}`, { variant: "bad", label: "❌ Sin inyección", collapse: false })}
        <p>Esta clase <b>crea</b> su dependencia con <code>new</code>. Está atada a MySQL: no la podés testear sin base,
        ni cambiar de implementación sin editar la clase.</p>

        ${APP.code(`class PedidoService {
    private final PedidoRepository repo;

    public PedidoService(PedidoRepository repo) { // ✅ llega de afuera
        this.repo = repo;
    }
}`, { variant: "good", label: "✅ Con inyección (por constructor)", collapse: false })}
        <p>Ahora depende de la <b>abstracción</b> <code>PedidoRepository</code>, y quien crea el service decide qué
        implementación pasarle. En producción, MySQL; en los tests, un doble.</p>

        <h2>Tipos de inyección</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Cuándo</th><th>Calidad</th></tr></thead>
          <tbody>
            <tr><td><b>Por constructor</b></td><td>La dependencia es obligatoria e inmutable</td><td>✅ La mejor (recomendada)</td></tr>
            <tr><td><b>Por setter</b></td><td>La dependencia es opcional o cambia en runtime</td><td>🟡 Aceptable</td></tr>
            <tr><td><b>Por campo</b> (<code>@Autowired</code> en el atributo)</td><td>—</td><td>❌ La peor: dificulta el testing y esconde la dependencia</td></tr>
          </tbody>
        </table></div>

        <h2>Ventajas</h2>
        <ul>
          <li><b>Bajo acoplamiento:</b> dependés de la abstracción, no de la implementación.</li>
          <li><b>Testeabilidad:</b> podés inyectar un <a class="inline" data-go="testing">mock</a> en los tests.</li>
          <li><b>Flexibilidad:</b> cambiar la implementación sin tocar la clase.</li>
        </ul>

        <div class="callout tip">
          <div class="callout-title">✅ En Spring</div>
          <p>El framework tiene un <b>contenedor de inyección</b>. Cuando ponés <code>@Service</code>,
          <code>@Repository</code> o <code>@Component</code>, Spring crea la instancia y la <b>inyecta</b> donde haga falta
          —típicamente por constructor. Es el framework quien controla la creación (inversión de control).</p>
        </div>

        <h2>Cómo justificarlo (escrito)</h2>
        <blockquote class="just-modelo">“Apliqué <b>inyección de dependencias por constructor</b> para que
        <b>[PedidoService]</b> dependa de la abstracción <b>[PedidoRepository]</b> y no de una implementación concreta.
        Esto cumple el principio de <b>inversión de dependencias (DIP)</b>, reduce el <b>acoplamiento</b> y permite
        sustituir la implementación (por ejemplo, un mock en los tests) sin modificar la clase.”</blockquote>

        <div class="callout info">
          <p>Sólo podés <b>mockear</b> una dependencia si se inyecta. Si la clase hace <code>new MySQLRepo()</code>
          adentro, no hay forma de reemplazarla en el test. Por eso inyección de dependencias y
          <a class="inline" data-go="testing">testing con mocks</a> van de la mano.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="diQuiz"></div>
      `;

      APP.quiz(el.querySelector("#diQuiz"), [
        { n: 1, topic: "DI", type: "mc", q: "¿Cuál es la forma recomendada de inyección?", options: [
          { t: "Por constructor: la dependencia es obligatoria e inmutable", ok: true },
          { t: "Por campo con @Autowired", ok: false },
          { t: "Con new dentro de la clase", ok: false },
        ], explain: "Constructor injection deja la dependencia explícita, obligatoria e inmutable, y es la más fácil de testear." },
        { n: 2, topic: "DI", type: "mc", q: "¿Qué relación tiene la inyección de dependencias con DIP?", options: [
          { t: "Es la técnica que permite cumplir el principio DIP", ok: true },
          { t: "Son cosas sin relación", ok: false },
          { t: "DIP es una forma de inyección", ok: false },
        ], explain: "DIP es el principio (depender de abstracciones); la inyección es cómo se logra en la práctica." },
        { n: 3, topic: "DI", type: "vf", q: "Si una clase hace <code>new MySQLRepo()</code> adentro, igual la podés mockear en los tests.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "No: para mockear, la dependencia tiene que poder reemplazarse desde afuera. Con <code>new</code> adentro, queda fija." },
      ]);
    },
  });
})();
