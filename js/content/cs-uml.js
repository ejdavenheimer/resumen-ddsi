/* ============================================================
   Cheatsheet — Notación UML en 1 hoja (imprimible)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cs-uml",
    title: "Cheatsheet: Notación UML",
    tag: "🃏",
    group: "Cheatsheets",
    resumen: "Toda la notación en una hoja",
    keywords: ["cheatsheet", "uml", "notacion", "imprimible", "relaciones", "multiplicidad", "resumen"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Cheatsheet imprimible</div>
          <h1>Notación UML en 1 hoja</h1>
          <p class="lead">Todo lo que se corrige en un diagrama de clases, en una página.</p>
        </div>

        <div class="controls no-print">
          <button class="btn" id="csPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
        </div>

        <h2>Elementos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Cómo se dibuja</th><th>Cuándo se usa</th></tr></thead>
          <tbody>
            <tr><td>Clase</td><td>Rectángulo con 3 compartimentos (nombre · atributos · métodos)</td><td>Siempre</td></tr>
            <tr><td>Interfaz</td><td><code>&lt;&lt;interface&gt;&gt;</code> arriba del nombre</td><td>Contratos (Strategy, Repository)</td></tr>
            <tr><td>Clase abstracta</td><td>Nombre en <i>cursiva</i></td><td>Cuando no se instancia directo</td></tr>
            <tr><td>Método abstracto</td><td>Nombre en <i>cursiva</i></td><td>Lo implementan las subclases</td></tr>
            <tr><td>Visibilidad</td><td><code>+</code> público · <code>-</code> privado · <code>#</code> protegido</td><td>En atributos y métodos</td></tr>
            <tr><td>Estereotipo</td><td><code>&lt;&lt;record&gt;&gt;</code>, <code>&lt;&lt;enum&gt;&gt;</code>, <code>&lt;&lt;service&gt;&gt;</code></td><td>Para aclarar el tipo</td></tr>
          </tbody>
        </table></div>

        <h2>Relaciones</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Relación</th><th>Cómo se dibuja</th><th>Significa</th></tr></thead>
          <tbody>
            <tr><td>Herencia</td><td>Flecha punta triangular <b>vacía</b>, línea <b>llena</b></td><td>“es un/a”</td></tr>
            <tr><td>Realización</td><td>Flecha punta triangular vacía, línea <b>punteada</b></td><td>Implementa una interfaz</td></tr>
            <tr><td>Composición</td><td>Rombo <b>lleno</b></td><td>“compuesto por”, no existe sin el todo</td></tr>
            <tr><td>Agregación</td><td>Rombo <b>vacío</b></td><td>“tiene un/a”, pero puede existir sin él</td></tr>
            <tr><td>Asociación</td><td>Línea simple, flecha si es dirigida</td><td>“conoce a”</td></tr>
            <tr><td>Dependencia</td><td>Flecha punteada abierta</td><td>“usa” (parámetro, variable local)</td></tr>
            <tr><td>Multiplicidad</td><td><code>1</code>, <code>*</code>, <code>0..1</code>, <code>1..*</code>, <code>1..3</code></td><td>En los extremos de la relación</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">🔑 Regla para elegir la relación</div>
          <p>¿Lo guarda como atributo? → asociación (o composición/agregación si es colección de partes).
          ¿Sólo lo recibe por parámetro o lo crea y devuelve? → dependencia. ¿Es un subtipo? → herencia/realización.
          ¿Al borrar el todo desaparecen las partes? → composición; si no, agregación.</p>
        </div>

        <h2>Errores de notación que restan puntos</h2>
        <ul>
          <li>Poner flecha de <b>herencia</b> (punta triangular) donde va una <b>asociación</b> (flecha común), o al revés.</li>
          <li>Olvidar las <b>multiplicidades</b> donde importan.</li>
          <li>No <b>nombrar las asociaciones</b> cuando hay dos entre las mismas clases (propietario vs tenedor).</li>
          <li>Clases con sólo getters/setters (modelo <b>anémico</b>): les falta comportamiento.</li>
          <li>Meter clases que el enunciado no menciona, o nombres vacíos (<code>Manager</code>, <code>Helper</code>).</li>
          <li>En <code>List&lt;Tipo&gt;</code>, no usar la notación UML de genéricos.</li>
          <li>Cruzar flechas o desordenar el tiempo en un diagrama de secuencia.</li>
        </ul>
      `;
      el.querySelector("#csPrint").addEventListener("click", function () { window.print(); });
    },
  });
})();
