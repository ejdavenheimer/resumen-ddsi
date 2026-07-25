/* ============================================================
   Diagramas UML — Diagrama de Clases (repaso de notación)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "uml-clases",
    title: "Diagrama de Clases",
    tag: "📐",
    group: "Diagramas UML",
    resumen: "Repaso de notación",
    keywords: ["diagrama de clases", "uml", "notacion", "asociacion", "composicion", "herencia", "multiplicidad", "visibilidad"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Diagramas UML</div>
          <h1>Diagrama de Clases</h1>
          <p class="lead">El diagrama estrella del parcial. Repaso rápido de la notación que se corrige.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Es lo que más peso tiene</div>
          <p>El punto de Modelado de Dominio vale 30 puntos en casi todos los finales, y se comunica con un diagrama de
          clases. Acá repasamos la <b>notación</b>; para practicar el armado está
          <a class="inline" data-go="p-diagrama">Armá el diagrama</a>.</p>
        </div>

        <h2>Anatomía de una clase</h2>
        ${APP.uml(`classDiagram
    class Pedido {
        -numero: String
        -estado: EstadoPedido
        +total() Monto
        +confirmar() void
        #recalcular() void
    }`, "Tres compartimentos: nombre · atributos · métodos")}
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Símbolo</th><th>Visibilidad</th></tr></thead>
          <tbody>
            <tr><td><code>+</code></td><td>Público</td></tr>
            <tr><td><code>-</code></td><td>Privado</td></tr>
            <tr><td><code>#</code></td><td>Protegido</td></tr>
          </tbody>
        </table></div>

        <h2>Tipos especiales de clase</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Cómo se dibuja</th><th>Cuándo</th></tr></thead>
          <tbody>
            <tr><td>Interfaz</td><td><code>&lt;&lt;interface&gt;&gt;</code> arriba del nombre</td><td>Contratos (Strategy, Repository)</td></tr>
            <tr><td>Clase abstracta</td><td>Nombre en <i>cursiva</i> (o <code>&lt;&lt;abstract&gt;&gt;</code>)</td><td>No se instancia directo (Template Method)</td></tr>
            <tr><td>Método abstracto</td><td>Nombre en <i>cursiva</i></td><td>Lo implementan las subclases</td></tr>
            <tr><td>Enumeración</td><td><code>&lt;&lt;enumeration&gt;&gt;</code></td><td>Conjunto fijo de valores</td></tr>
            <tr><td>Value Object</td><td><code>&lt;&lt;record&gt;&gt;</code> o nota</td><td>Objetos de valor inmutables</td></tr>
          </tbody>
        </table></div>

        <h2>Las relaciones (esto es lo que más se equivoca)</h2>
        ${APP.uml(`classDiagram
    ClaseA <|-- ClaseB : herencia (es un/a)
    IFace <|.. Impl : realización (implementa)
    Todo *-- Parte : composición (no vive sin el todo)
    Club o-- Socio : agregación (vive por su cuenta)
    Pedido --> Cliente : asociación (conoce a)
    Servicio ..> DTO : dependencia (usa)`, "Las 6 relaciones")}
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Relación</th><th>Notación</th><th>Significa</th><th>En Java</th></tr></thead>
          <tbody>
            <tr><td><b>Herencia</b></td><td><code>&lt;|--</code> (línea llena, punta triangular vacía)</td><td>“es un/a”</td><td><code>extends</code></td></tr>
            <tr><td><b>Realización</b></td><td><code>&lt;|..</code> (línea punteada, punta triangular vacía)</td><td>implementa una interfaz</td><td><code>implements</code></td></tr>
            <tr><td><b>Composición</b></td><td><code>*--</code> (rombo lleno)</td><td>“compuesto por”, no existe sin el todo</td><td>atributo, ciclo de vida atado</td></tr>
            <tr><td><b>Agregación</b></td><td><code>o--</code> (rombo vacío)</td><td>“tiene un/a”, pero vive por su cuenta</td><td>atributo, ciclo de vida independiente</td></tr>
            <tr><td><b>Asociación</b></td><td><code>--&gt;</code> (línea, flecha si es dirigida)</td><td>“conoce a”</td><td>atributo</td></tr>
            <tr><td><b>Dependencia</b></td><td><code>..&gt;</code> (punteada abierta)</td><td>“usa” (parámetro, local, retorno)</td><td>no lo guarda</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <div class="callout-title">✅ Regla práctica para no trabarte</div>
          <p>¿Lo guarda como atributo? → asociación (o composición/agregación si es una colección de partes).
          ¿Sólo lo recibe por parámetro o lo crea y lo devuelve? → dependencia. ¿Es un subtipo? → herencia/realización.</p>
          <p>Composición vs agregación: <b>si al borrar el todo desaparecen las partes, es composición.</b> Confundir
          estas dos rara vez se penaliza fuerte; confundir cualquiera con <b>herencia</b>, sí.</p>
        </div>

        <h2>Multiplicidad</h2>
        <p>Va en los extremos de la relación, e indica cuántos objetos participan.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Notación</th><th>Significa</th></tr></thead>
          <tbody>
            <tr><td><code>1</code></td><td>Exactamente uno</td></tr>
            <tr><td><code>0..1</code></td><td>Cero o uno (opcional)</td></tr>
            <tr><td><code>*</code> o <code>0..*</code></td><td>Cero o muchos</td></tr>
            <tr><td><code>1..*</code></td><td>Uno o muchos (al menos uno)</td></tr>
            <tr><td><code>1..3</code></td><td>Entre uno y tres (ej: “activa en 3 comunidades” de Libros)</td></tr>
          </tbody>
        </table></div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Errores de notación que restan puntos</div>
          <ul>
            <li>Poner flecha de herencia (punta triangular) donde va una asociación (flecha común), o viceversa.</li>
            <li>Olvidar las <b>multiplicidades</b> donde importan.</li>
            <li>No <b>nombrar las asociaciones</b> cuando hay dos entre las mismas clases (ej: <code>propietario</code> y
            <code>tenedorActual</code> en Libros Circulares).</li>
            <li>Clases con sólo getters/setters (modelo <b>anémico</b>): les falta comportamiento.</li>
            <li>Poner clases que el enunciado no menciona, o nombres vacíos (<code>Manager</code>, <code>Helper</code>).</li>
            <li>En <code>List&lt;Tipo&gt;</code> dentro del diagrama, escribirlo con <code>&lt;&gt;</code> en vez de la
            notación UML de genéricos.</li>
          </ul>
        </div>

        <h2>Cheatsheet imprimible</h2>
        <p>Toda esta notación en una hoja para llevar: <a class="inline" data-go="cs-uml">Notación UML en 1 hoja</a>.</p>
      `;
    },
  });
})();
