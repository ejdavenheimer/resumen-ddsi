/* ============================================================
   Principios — Code Smells
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "code-smells",
    title: "Code Smells",
    tag: "🎯",
    group: "Principios",
    resumen: "Síntomas de mal diseño",
    keywords: ["code smell", "smell", "god class", "long method", "duplicated code", "switch", "feature envy", "data class", "primitive obsession", "shotgun surgery"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Principios</div>
          <h1>Code Smells</h1>
          <p class="lead">Síntomas en el código que sugieren un problema de diseño más profundo.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 El parcial 2023 lo pide explícitamente</div>
          <p>En el punto de justificación: “haga referencia a… <b>Code Smells</b>”. La forma que puntúa es nombrar el smell
          que evitaste o corregiste, <b>qué principio SOLID se relaciona</b> y <b>qué patrón</b> lo resuelve.</p>
        </div>

        <h2>¿Qué es un code smell?</h2>
        <p>Un <b>síntoma</b> que sugiere que hay un problema de diseño. <b>No es un bug</b> (el código funciona): es una
        <b>señal de alarma</b> de que algo se va a volver difícil de mantener. El nombre viene de Kent Beck y Martin Fowler.</p>

        <h2>Los smells que más se preguntan</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Smell</th><th>Qué es</th><th>Cómo se arregla</th><th>SOLID que viola</th></tr></thead>
          <tbody>
            <tr><td><b>God Class / Large Class</b></td><td>Una clase que hace demasiadas cosas</td><td>Extraer clases</td><td>SRP</td></tr>
            <tr><td><b>Long Method</b></td><td>Un método larguísimo</td><td>Extraer métodos</td><td>SRP</td></tr>
            <tr><td><b>Long Parameter List</b></td><td>Un método con muchos parámetros</td><td>Objeto parámetro, o <a class="inline" data-go="builder">Builder</a></td><td>—</td></tr>
            <tr><td><b>Duplicated Code</b></td><td>El mismo código repetido</td><td>Extraer método / clase padre / <a class="inline" data-go="template-method">Template Method</a></td><td>DRY</td></tr>
            <tr><td><b>Switch Statements</b></td><td>Cadenas de if/else o switch sobre tipos</td><td>Polimorfismo: <a class="inline" data-go="strategy">Strategy</a>, State, Factory</td><td>OCP</td></tr>
            <tr><td><b>Feature Envy</b></td><td>Un método usa más datos de otra clase que de la suya</td><td>Mover el método a la clase que “envidia”</td><td>—</td></tr>
            <tr><td><b>Data Class</b></td><td>Clase con sólo atributos y getters/setters, sin comportamiento</td><td>Mover comportamiento hacia ella (dominio anémico)</td><td>—</td></tr>
            <tr><td><b>Shotgun Surgery</b></td><td>Un cambio chico obliga a tocar muchas clases</td><td>Reagrupar responsabilidades</td><td>SRP</td></tr>
            <tr><td><b>Divergent Change</b></td><td>Una clase cambia por muchos motivos distintos</td><td>Separarla</td><td>SRP</td></tr>
            <tr><td><b>Primitive Obsession</b></td><td>Usar String/int para todo en vez de tipos propios</td><td>Crear <a class="inline" data-go="entities-vo">Value Objects</a></td><td>—</td></tr>
            <tr><td><b>Refused Bequest</b></td><td>Una subclase no usa lo que heredó</td><td>Revisar la herencia, quizá va composición</td><td>LSP</td></tr>
            <tr><td><b>Inappropriate Intimacy</b></td><td>Dos clases se meten demasiado en los datos de la otra</td><td>Reducir acoplamiento, mover métodos</td><td>—</td></tr>
          </tbody>
        </table></div>

        <div class="callout tip">
          <div class="callout-title">✅ La conexión con SOLID (marcala explícita)</div>
          <p>Casi todo smell viola algún principio. En el parcial no digas sólo “hay un God Class”: decí
          <b>“hay un God Class, que viola SRP, y lo resuelvo extrayendo clases”</b>. Ese encadenamiento
          smell → principio → solución es lo que busca el corrector.</p>
        </div>

        <h2>Practicá con código real</h2>
        <p>El interactivo <a class="inline" data-go="p-solid">Spot the SOLID smell</a> tiene 15 fragmentos de código con un
        smell cada uno, para identificar el principio y elegir la refactorización. Acá van algunas de reconocimiento rápido:</p>
        <div id="smellQuiz"></div>
      `;

      APP.quiz(el.querySelector("#smellQuiz"), [
        { n: 1, topic: "Smells", type: "mc", q: "Una clase <code>PedidoManager</code> de 900 líneas que valida, calcula, persiste y notifica. ¿Qué smell y qué principio?", options: [
          { t: "God Class, viola SRP", ok: true },
          { t: "Feature Envy, viola OCP", ok: false },
          { t: "Primitive Obsession, viola LSP", ok: false },
        ], explain: "Demasiadas responsabilidades en una clase: God Class → SRP. Se arregla extrayendo clases." },
        { n: 2, topic: "Smells", type: "mc", q: "Un <code>switch (tipoEnvio)</code> repetido en tres métodos, que crece con cada tipo nuevo. ¿Smell + solución?", options: [
          { t: "Switch Statements (viola OCP) → Strategy", ok: true },
          { t: "Long Method → extraer método", ok: false },
          { t: "Data Class → agregar comportamiento", ok: false },
        ], explain: "El switch por tipo es el disparador clásico de OCP. Se reemplaza por polimorfismo (Strategy)." },
        { n: 3, topic: "Smells", type: "mc", q: "Entidades con sólo getters y setters y toda la lógica en el service. ¿Smell?", options: [
          { t: "Data Class / dominio anémico", ok: true },
          { t: "God Class", ok: false },
          { t: "Refused Bequest", ok: false },
        ], explain: "La entidad no sabe hacer nada: Data Class. Se arregla moviendo comportamiento hacia ella." },
        { n: 4, topic: "Smells", type: "mc", q: "Un método de <code>Factura</code> que usa casi sólo datos de <code>Cliente</code> (su dirección, su categoría, sus descuentos). ¿Smell + solución?", options: [
          { t: "Feature Envy → mover el método a Cliente", ok: true },
          { t: "Long Parameter List → Builder", ok: false },
          { t: "Shotgun Surgery → reagrupar", ok: false },
        ], explain: "El método “envidia” los datos de otra clase: movelo a la clase que envidia." },
        { n: 5, topic: "Smells", type: "mc", q: "Usás <code>String dni</code>, <code>String email</code>, <code>String telefono</code> sueltos por todos lados, sin validación. ¿Smell + solución?", options: [
          { t: "Primitive Obsession → crear Value Objects (Dni, Email)", ok: true },
          { t: "Duplicated Code → Template Method", ok: false },
          { t: "God Class → extraer clases", ok: false },
        ], explain: "Usar primitivos para conceptos del dominio es Primitive Obsession. Los Value Objects encapsulan la validación y dan semántica." },
        { n: 6, topic: "Smells", type: "mc", q: "Una subclase <code>Pinguino extends Ave</code> cuyo método <code>volar()</code> tira excepción. ¿Smell + principio?", options: [
          { t: "Refused Bequest, viola LSP", ok: true },
          { t: "God Class, viola SRP", ok: false },
          { t: "Switch Statements, viola OCP", ok: false },
        ], explain: "La subclase no puede usar lo que heredó: Refused Bequest → LSP. Se revisa la jerarquía (interfaz Volador aparte)." },
      ]);
    },
  });
})();
