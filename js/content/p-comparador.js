/* ============================================================
   Práctica — Comparador de diagramas
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p-comparador",
    title: "Comparador de diagramas",
    tag: "⚖️",
    group: "Práctica interactiva",
    resumen: "6 comparaciones lado a lado",
    keywords: ["comparador", "diagramas", "sobreingenieria", "comparar", "practica"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Práctica interactiva</div>
          <h1>Comparador de diagramas</h1>
          <p class="lead">Dos soluciones al mismo enunciado. Una está bien; la otra tiene un problema real. ¿Cuál es cuál?</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 El criterio que se entrena acá</div>
          <p>La mitad de los errores en el punto de modelado no son “me faltó un patrón”: son <b>“metí uno de más”</b>.
          Este ejercicio entrena el juicio para distinguir un diseño que resuelve el problema de uno que sólo se ve
          sofisticado.</p>
          <p>Prestá atención a los casos con la nota ⚖️: son los que <b>dependen del enunciado</b>. La misma solución puede
          ser correcta o sobreingeniería según lo que el enunciado pida — y eso es exactamente lo que hay que justificar.</p>
        </div>

        <div class="widget" id="cmpBox"></div>

        <h2>Checklist antes de entregar un diagrama</h2>
        <ul class="rubrica" id="cmpCheck">
          <li><input type="checkbox" id="ck1"><label for="ck1">Cada patrón que usé tiene una <b>frase del enunciado</b> que lo justifica.</label></li>
          <li><input type="checkbox" id="ck2"><label for="ck2">No hay ninguna clase cuya única razón de existir sea “quedaba lindo”.</label></li>
          <li><input type="checkbox" id="ck3"><label for="ck3">Todas las entidades que menciona el enunciado están en el diagrama.</label></li>
          <li><input type="checkbox" id="ck4"><label for="ck4">Las clases <b>saben hacer cosas</b>: no son bolsas de getters y setters.</label></li>
          <li><input type="checkbox" id="ck5"><label for="ck5">No hay nombres vacíos (<code>Manager</code>, <code>Helper</code>, <code>Utils</code>, <code>Data</code>).</label></li>
          <li><input type="checkbox" id="ck6"><label for="ck6">Las asociaciones están <b>nombradas</b> cuando hay más de una entre las mismas clases.</label></li>
          <li><input type="checkbox" id="ck7"><label for="ck7">Las multiplicidades están puestas donde importan (<code>1</code>, <code>*</code>, <code>0..1</code>).</label></li>
          <li><input type="checkbox" id="ck8"><label for="ck8">Si el punto pide “capa de dominio”, no hay controllers, DTOs ni implementaciones de repositorio.</label></li>
          <li><input type="checkbox" id="ck9"><label for="ck9">Toda integración externa entra por una <b>interfaz del dominio</b> + adapter.</label></li>
          <li><input type="checkbox" id="ck10"><label for="ck10">No quedó ningún <code>String tipo</code> o enum del que dependan <code>if</code> de comportamiento.</label></li>
        </ul>
      `;

      APP.comparador(el.querySelector("#cmpBox"), APP.DATA.comparaciones);

      el.querySelectorAll("#cmpCheck input").forEach(function (c) {
        c.addEventListener("change", function () {
          c.closest("li").classList.toggle("done", c.checked);
        });
      });
    },
  });
})();
