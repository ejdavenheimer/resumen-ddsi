/* ============================================================
   Práctica — Armá el diagrama
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-diagrama",
    title: "Armá el diagrama",
    tag: "📐",
    group: "Práctica interactiva",
    resumen: "8 ejercicios de modelado",
    keywords: ["diagrama", "uml", "clases", "relaciones", "modelado", "practica"],
    render(el) {
      const ejs = APP.DATA.diagramas;
      const hechos = APP.store.ejerciciosDe("diagrama");
      const resueltos = Object.keys(hechos).filter(function (k) { return hechos[k]; }).length;

      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Armá el diagrama</h1>
          <p class="lead">${ejs.length} ejercicios de dificultad creciente: elegí qué clases van y qué relación hay entre cada par.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Las dos cosas que se corrigen en un diagrama de clases</div>
          <p><b>1) Qué clases hay.</b> Que estén todas las que el enunciado menciona, con nombres del dominio —y que
          <b>no</b> estén las que sobran. Nombres como <code>Manager</code>, <code>Helper</code> o <code>DTO</code> en un
          punto que pide “capa de dominio” restan.</p>
          <p><b>2) Qué relación hay entre ellas.</b> Herencia, composición, asociación o dependencia no son intercambiables,
          y confundirlas cambia el significado del modelo.</p>
        </div>

        <h2>Repaso rápido de las relaciones</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Relación</th><th>Notación</th><th>Qué significa</th><th>En Java se ve como…</th></tr></thead>
          <tbody>
            <tr><td><b>Herencia</b></td><td><code>A &lt;|-- B</code></td><td>B <b>es un/a</b> A; hereda estructura y comportamiento</td><td><code>class B extends A</code></td></tr>
            <tr><td><b>Implementación</b></td><td><code>A &lt;|.. B</code></td><td>B cumple el contrato de la interfaz A</td><td><code>class B implements A</code></td></tr>
            <tr><td><b>Composición</b></td><td><code>A *-- B</code></td><td>A contiene a B y B <b>no existe sin</b> A</td><td>atributo colección, ciclo de vida atado</td></tr>
            <tr><td><b>Agregación</b></td><td><code>A o-- B</code></td><td>A contiene a B pero B <b>vive por su cuenta</b></td><td>atributo colección, ciclo de vida independiente</td></tr>
            <tr><td><b>Asociación</b></td><td><code>A --&gt; B</code></td><td>A <b>conoce</b> a B (lo tiene como atributo)</td><td><code>private B b;</code></td></tr>
            <tr><td><b>Dependencia</b></td><td><code>A ..&gt; B</code></td><td>A <b>usa</b> a B puntualmente, sin guardarlo</td><td>B como parámetro, variable local o retorno</td></tr>
          </tbody>
        </table></div>
        <div class="callout info">
          <p><b>Regla práctica para no trabarse:</b> ¿lo guarda como atributo? → asociación (o composición/agregación si
          es una colección de partes). ¿Sólo lo recibe por parámetro o lo crea y lo devuelve? → dependencia.
          ¿Es un subtipo? → herencia.</p>
          <p>Y en cuanto a composición vs agregación: si al borrar el todo desaparecen las partes, es <b>composición</b>.
          En un parcial, confundir estas dos rara vez se penaliza fuerte; confundir cualquiera de ellas con
          <b>herencia</b>, sí.</p>
        </div>

        <div class="big-progress">
          <div class="bp-head">
            <b>Tu progreso</b>
            <span>${resueltos} de ${ejs.length} resueltos completos</span>
          </div>
          <div class="bp-bar"><i style="width:${Math.round((resueltos / ejs.length) * 100)}%"></i></div>
        </div>

        <div class="widget" id="diagramaBox"></div>
      `;

      APP.diagrama(el.querySelector("#diagramaBox"), ejs);
    },
  });
})();
