/* ============================================================
   Testing — tipos de prueba, mocking, validación vs verificación
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "testing",
    title: "Testing",
    tag: "🧪",
    group: "Testing",
    resumen: "Pruebas, mocks, validación vs verificación",
    keywords: ["testing", "test", "mock", "stub", "dummy", "fake", "spy", "unitaria", "integracion", "regresion", "validacion", "verificacion", "junit", "mockito"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Testing</div>
          <h1>Testing</h1>
          <p class="lead">Cómo se prueba el software: tipos de prueba, dobles (mocks) y la diferencia validación vs verificación.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Qué entra del temario</div>
          <p>Se dictó en la clase 4 (junto a inyección de dependencias y mocking). El parcial 2023 lo tocó en teoría
          (“un test que encuentra fallas es producto de que su diseño fue el correcto” → V). Los conceptos de
          <b>validación vs verificación</b> y los <b>tipos de prueba</b> son los que más se preguntan.</p>
        </div>

        <h2>Tipos de prueba</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Qué prueba</th></tr></thead>
          <tbody>
            <tr><td><b>Unitaria</b></td><td>Una clase <b>aislada</b>, con mocks para sus dependencias. Rápida.</td></tr>
            <tr><td><b>De integración</b></td><td>Que varias piezas funcionen <b>juntas</b> (ej: service + repositorio real).</td></tr>
            <tr><td><b>Funcional / End-to-end</b></td><td>El sistema completo <b>desde afuera</b>, como lo usaría un usuario.</td></tr>
            <tr><td><b>De performance</b></td><td>Cuánto tarda, cuántos recursos consume.</td></tr>
            <tr><td><b>De carga</b></td><td>Comportamiento con el <b>volumen esperado</b>.</td></tr>
            <tr><td><b>De stress</b></td><td>Comportamiento <b>más allá del límite</b>, para ver dónde rompe.</td></tr>
            <tr><td><b>De regresión</b></td><td>Verifica que <b>lo que andaba siga andando</b> después de un cambio.</td></tr>
          </tbody>
        </table></div>

        <h2>Mocking y dobles de prueba</h2>
        <p>Un <b>mock</b> es un objeto falso que simula el comportamiento de una dependencia real, para testear una clase
        de forma <b>aislada</b>.</p>
        <p><b>Por qué se usa:</b></p>
        <ul>
          <li>No querés que tu test dependa de una base de datos real ni de una API externa (lento, frágil, puede estar caída).</li>
          <li>Querés controlar exactamente qué devuelve la dependencia para probar casos específicos: ¿qué pasa si el repo
          devuelve vacío? ¿si la API falla?</li>
        </ul>

        <h3>Tipos de dobles de prueba</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Doble</th><th>Qué hace</th></tr></thead>
          <tbody>
            <tr><td><b>Dummy</b></td><td>Objeto que se pasa pero no se usa (rellena un parámetro).</td></tr>
            <tr><td><b>Stub</b></td><td>Devuelve respuestas fijas preprogramadas.</td></tr>
            <tr><td><b>Mock</b></td><td>Además <b>verifica</b> que se lo haya llamado como se esperaba.</td></tr>
            <tr><td><b>Fake</b></td><td>Implementación simplificada que <b>funciona</b> (ej: repositorio in-memory).</td></tr>
            <tr><td><b>Spy</b></td><td>Envuelve al objeto real y <b>registra</b> las llamadas.</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">🔑 Relación con inyección de dependencias</div>
          <p>Sólo podés mockear una dependencia <b>si se inyecta</b>. Si la clase hace <code>new MySQLRepo()</code>
          adentro, no hay forma de reemplazarla en el test. Por eso
          <a class="inline" data-go="inyeccion-dependencias">inyección de dependencias</a> y testing van de la mano:
          la primera <b>habilita</b> al segundo.</p>
        </div>

        <h2>Validación vs Verificación (se pregunta)</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Verificación</h4>
            <p>¿Estamos construyendo el producto <b>correctamente</b>?</p>
            <p>¿Cumple la <b>especificación</b>? ¿Está bien hecho según lo que pedimos?</p>
            <p><i>“¿Lo hicimos bien?”</i></p>
          </div>
          <div class="vs-b">
            <h4>Validación</h4>
            <p>¿Estamos construyendo el producto <b>correcto</b>?</p>
            <p>¿Es lo que el <b>usuario necesita</b> de verdad?</p>
            <p><i>“¿Hicimos lo correcto?”</i></p>
          </div>
        </div>
        <div class="callout info">
          <p>Un sistema puede pasar la <b>verificación</b> (cumple perfectamente la especificación) y fallar la
          <b>validación</b> (la especificación estaba mal y no era lo que el usuario quería). Las dos son necesarias.</p>
        </div>

        <div class="callout tip">
          <div class="callout-title">✅ Sobre el V/F del parcial</div>
          <p>“La ejecución de un testing que encuentra fallas es producto de que su diseño fue el correcto” → <b>Verdadero</b>.
          Un test bien diseñado es el que <b>tiene alta probabilidad de encontrar defectos</b>, no el que siempre pasa.
          Como decía Dijkstra: el testing muestra la <i>presencia</i> de errores, nunca su ausencia.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="testQuiz"></div>
      `;

      APP.quiz(el.querySelector("#testQuiz"), [
        { n: 1, topic: "Validación/Verificación", type: "mc", q: "“¿Estamos construyendo el producto correcto (lo que el usuario necesita)?” es…", options: [
          { t: "Validación", ok: true }, { t: "Verificación", ok: false },
        ], explain: "Validación = ¿hicimos lo correcto? Verificación = ¿lo hicimos bien (según la especificación)?" },
        { n: 2, topic: "Mocks", type: "mc", q: "Querés testear un service sin depender de la base real. ¿Qué necesitás?", options: [
          { t: "Que el repositorio se inyecte, para poder pasarle un mock o un fake in-memory", ok: true },
          { t: "Que el service haga <code>new</code> del repo adentro", ok: false },
          { t: "Una base de datos de test siempre encendida", ok: false },
        ], explain: "Sin inyección no podés reemplazar la dependencia. La segunda opción impide mockear." },
        { n: 3, topic: "Dobles", type: "mc", q: "Un doble que devuelve respuestas fijas preprogramadas, sin verificar llamadas, es un…", options: [
          { t: "Stub", ok: true }, { t: "Mock", ok: false }, { t: "Spy", ok: false },
        ], explain: "El stub devuelve respuestas fijas. El mock además verifica que se lo llamó como se esperaba; el spy registra las llamadas al objeto real." },
        { n: 4, topic: "Tipos", type: "mc", q: "Después de un cambio, corrés una batería para asegurarte de que lo que andaba siga andando. Eso es…", options: [
          { t: "Prueba de regresión", ok: true }, { t: "Prueba de stress", ok: false }, { t: "Prueba unitaria", ok: false },
        ], explain: "Regresión: verifica que un cambio no rompió funcionalidad existente." },
        { n: 5, topic: "Tipos", type: "mc", q: "Probás el sistema empujándolo más allá de su límite para ver dónde rompe. Eso es…", options: [
          { t: "Prueba de stress", ok: true }, { t: "Prueba de carga", ok: false }, { t: "Prueba funcional", ok: false },
        ], explain: "Stress = más allá del límite. Carga = con el volumen esperado. Son distintas." },
      ]);
    },
  });
})();
