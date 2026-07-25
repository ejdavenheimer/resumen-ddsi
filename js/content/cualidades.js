/* ============================================================
   Principios — Cualidades de Diseño y Atributos de Calidad
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cualidades",
    title: "Cualidades y Atributos de Calidad",
    tag: "🎯",
    group: "Principios",
    resumen: "Diseño vs requerimientos no funcionales",
    keywords: ["cualidades de diseno", "atributos de calidad", "acoplamiento", "cohesion", "iso 25010", "disponibilidad", "mantenibilidad", "escalabilidad", "tradeoff", "no funcionales"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Principios</div>
          <h1>Cualidades de Diseño y Atributos de Calidad</h1>
          <p class="lead">Dos conceptos que el parcial pide por nombre: propiedades del diseño y requerimientos no funcionales.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 El parcial 2023 lo pide textual</div>
          <p>“Mencione y haga referencia explícita a: <b>Cualidades de Diseño y Atributos de Calidad de Software</b>”.
          Y en teoría: clasificar requerimientos según su atributo de calidad. Este tema es puntaje casi asegurado si lo dominás.</p>
        </div>

        <h2>La diferencia entre los dos conceptos</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Cualidades de Diseño</h4>
            <p>Propiedades <b>del diseño mismo</b>: cómo están hechas las clases y sus relaciones.</p>
            <p>Ejemplos: acoplamiento, cohesión, extensibilidad.</p>
            <p>Las mirás en el <b>diagrama de clases</b>.</p>
          </div>
          <div class="vs-b">
            <h4>Atributos de Calidad</h4>
            <p>Requerimientos <b>no funcionales del sistema</b>: cómo se comporta al ejecutarse.</p>
            <p>Ejemplos: performance, disponibilidad, seguridad.</p>
            <p>Están normados por <b>ISO/IEC 25010</b>.</p>
          </div>
        </div>

        <h2>Cualidades de Diseño</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Cualidad</th><th>Qué es</th><th>Qué se busca</th></tr></thead>
          <tbody>
            <tr><td><b>Acoplamiento</b></td><td>Qué tanto una clase depende de otra</td><td><b>Bajo.</b> Si cambiar A obliga a cambiar B, están muy acoplados</td></tr>
            <tr><td><b>Cohesión</b></td><td>Qué tan relacionadas están las responsabilidades dentro de una clase</td><td><b>Alta.</b> Una clase que hace una sola cosa bien es cohesiva</td></tr>
            <tr><td><b>Encapsulamiento</b></td><td>Ocultar los detalles internos</td><td>Exponer sólo lo necesario</td></tr>
            <tr><td><b>Abstracción</b></td><td>Quedarse con lo esencial, ignorar el detalle irrelevante</td><td>Depender de abstracciones</td></tr>
            <tr><td><b>Evitar redundancia (DRY)</b></td><td>No repetir código ni conocimiento</td><td>Un solo lugar por cada regla</td></tr>
            <tr><td><b>Extensibilidad</b></td><td>Agregar funcionalidad sin romper lo existente</td><td>Vía OCP y polimorfismo</td></tr>
            <tr><td><b>Reusabilidad</b></td><td>Que las piezas sirvan en otros contextos</td><td>Bajo acoplamiento + alta cohesión</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <div class="callout-title">✅ La frase más usada en justificaciones</div>
          <p><b>“Busqué bajo acoplamiento y alta cohesión.”</b> Es la fórmula clásica y bien vista. Cada vez que aplicás
          un patrón, podés cerrar con ella: “…lo cual favorece el bajo acoplamiento, ya que X sólo conoce la abstracción Y”.</p>
        </div>

        <h2>Atributos de Calidad (ISO 25010)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Atributo</th><th>Qué es</th><th>Cómo suena en un enunciado</th></tr></thead>
          <tbody>
            <tr><td><b>Performance / Eficiencia</b></td><td>Qué tan rápido responde, cuántos recursos consume</td><td>“responder en menos de 2 segundos”</td></tr>
            <tr><td><b>Disponibilidad</b></td><td>% del tiempo operativo</td><td>“SLA 99.9%”, “máximo 10 horas caído al año”</td></tr>
            <tr><td><b>Escalabilidad</b></td><td>Soportar más carga</td><td>“picos de tráfico”, “10.000 usuarios simultáneos”</td></tr>
            <tr><td><b>Mantenibilidad</b></td><td>Qué tan fácil es modificarlo</td><td>“agregar funcionalidad en menos de 20 horas”</td></tr>
            <tr><td><b>Seguridad</b></td><td>Protección de la información</td><td>“las contraseñas deben hashearse con SHA2”</td></tr>
            <tr><td><b>Usabilidad</b></td><td>Qué tan fácil de usar es</td><td>“el usuario no debe quedar esperando”</td></tr>
            <tr><td><b>Portabilidad</b></td><td>Correr en distintos entornos</td><td>“debe funcionar en Windows y Linux”</td></tr>
            <tr><td><b>Confiabilidad / Fiabilidad</b></td><td>Que no falle, y si falla que se recupere</td><td>“tolerancia a fallos”. <b>La disponibilidad vive acá dentro.</b></td></tr>
            <tr><td><b>Testeabilidad</b></td><td>Qué tan fácil es probarlo</td><td>“cobertura de tests”</td></tr>
            <tr><td><b>Interoperabilidad</b></td><td>Comunicarse con otros sistemas</td><td>“integrarse con el sistema X”</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">⚖️ Trade-offs (se pregunta)</div>
          <p>Los atributos de calidad <b>compiten entre sí</b>. Nombrar el trade-off al justificar demuestra criterio:</p>
          <ul>
            <li>Más <b>seguridad</b> → generalmente menos performance (cifrar cuesta tiempo).</li>
            <li>Más <b>disponibilidad</b> → más costo (redundancia).</li>
            <li>Más <b>flexibilidad/extensibilidad</b> → más complejidad, menos simplicidad.</li>
            <li>Más <b>performance</b> → a veces menos mantenibilidad (optimizaciones hacen el código más críptico).</li>
            <li>Más <b>consistencia</b> → menos disponibilidad (teorema CAP).</li>
          </ul>
        </div>

        <h2>🎮 Clasificá el requerimiento</h2>
        <p>Formato exacto del parcial 2023: para cada requerimiento, ¿qué atributo de calidad corresponde?</p>
        <div id="calQuiz"></div>
      `;

      APP.quiz(el.querySelector("#calQuiz"), [
        { n: 1, topic: "Atributos", type: "mc", q: "“El SLA definido permite que el sistema esté caído como máximo 10 horas al año.”", options: [
          { t: "Disponibilidad", ok: true }, { t: "Performance", ok: false }, { t: "Seguridad", ok: false },
        ], explain: "10 h/año ≈ 99.89% de uptime. Es disponibilidad (subcaracterística de Fiabilidad en ISO 25010)." },
        { n: 2, topic: "Atributos", type: "mc", q: "“La contraseña debe hashearse mediante el algoritmo SHA2.”", options: [
          { t: "Seguridad", ok: true }, { t: "Confiabilidad", ok: false }, { t: "Mantenibilidad", ok: false },
        ], explain: "Protección de la información: seguridad (confidencialidad)." },
        { n: 3, topic: "Atributos", type: "mc", q: "“Se debe modificar y agregar funcionalidad con facilidad en menos de 20 horas.”", options: [
          { t: "Mantenibilidad", ok: true }, { t: "Usabilidad", ok: false }, { t: "Escalabilidad", ok: false },
        ], explain: "Facilidad de modificación: mantenibilidad / modificabilidad." },
        { n: 4, topic: "Atributos", type: "mc", q: "“El sistema debe soportar 10.000 usuarios concurrentes en horario pico.”", options: [
          { t: "Escalabilidad", ok: true }, { t: "Disponibilidad", ok: false }, { t: "Portabilidad", ok: false },
        ], explain: "Soportar más carga: escalabilidad (y de la mano, performance)." },
        { n: 5, topic: "Atributos", type: "mc", q: "“La respuesta de una consulta no debe superar los 300 ms.”", options: [
          { t: "Performance / Eficiencia", ok: true }, { t: "Disponibilidad", ok: false }, { t: "Testeabilidad", ok: false },
        ], explain: "Velocidad de respuesta: performance." },
        { n: 6, topic: "Atributos", type: "mc", q: "“El sistema debe poder comunicarse con el ERP de la empresa vía API.”", options: [
          { t: "Interoperabilidad", ok: true }, { t: "Portabilidad", ok: false }, { t: "Usabilidad", ok: false },
        ], explain: "Comunicarse con otros sistemas: interoperabilidad." },
        { n: 7, topic: "Cualidades", type: "mc", q: "“Cada clase debe depender lo mínimo posible de las demás.” ¿Cualidad de diseño o atributo de calidad?", options: [
          { t: "Cualidad de diseño (bajo acoplamiento)", ok: true },
          { t: "Atributo de calidad", ok: false },
        ], explain: "Es una propiedad del diseño mismo, no del comportamiento en runtime. Cualidad de diseño." },
        { n: 8, topic: "Trade-offs", type: "mc", q: "Priorizás disponibilidad ante picos con consistencia eventual. ¿Qué trade-off estás aceptando?", options: [
          { t: "Menos consistencia inmediata a cambio de más disponibilidad (teorema CAP)", ok: true },
          { t: "Menos seguridad", ok: false },
          { t: "Ninguno, se puede tener todo", ok: false },
        ], explain: "Los atributos compiten: no se puede maximizar todo a la vez. Nombrar el trade-off suma puntos." },
      ]);
    },
  });
})();
