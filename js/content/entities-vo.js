/* ============================================================
   Fundamentos — Entities vs Value Objects
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "entities-vo",
    title: "Entities vs Value Objects",
    tag: "📚",
    group: "Fundamentos",
    resumen: "Identidad vs valor, mutabilidad",
    keywords: ["entity", "entidad", "value object", "objeto de valor", "identidad", "inmutable", "record", "ddd"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Entities vs Value Objects</h1>
          <p class="lead">Dos formas distintas de modelar objetos, según si te importa <b>cuál es</b> o sólo <b>cuánto vale</b>.</p>
        </div>

        <div class="analogia">
          <div class="emo">💵</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un <b>billete de $100</b> vs <b>tu cuenta bancaria</b>. Si te presto un billete de $100 y me devolvés
            <i>otro</i> billete de $100, no te reclamo: cien pesos son cien pesos, no me importa cuál. Eso es un
            <b>Value Object</b>.</p>
            <p>Pero tu cuenta bancaria es <b>una sola</b>: aunque cambie el saldo, el nombre o la dirección, <b>sigue
            siendo tu cuenta</b>. Tiene identidad. Eso es una <b>Entity</b>.</p>
          </div>
        </div>

        <h2>Los dos conceptos</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Entity (entidad)</h4>
            <ul>
              <li>Tiene <b>identidad propia</b> que persiste en el tiempo (un ID).</li>
              <li>Dos entidades con los mismos atributos <b>son distintas</b> si tienen distinto ID.</li>
              <li>Es <b>mutable</b>: sus atributos cambian pero sigue siendo la misma cosa.</li>
              <li>Ejemplo: una <code>Persona</code>. Si cambia de nombre, dirección o peso, <b>sigue siendo la misma
              persona</b> (mismo DNI).</li>
            </ul>
          </div>
          <div class="vs-b">
            <h4>Value Object (objeto de valor)</h4>
            <ul>
              <li><b>No tiene identidad</b>: se define por sus atributos.</li>
              <li>Dos value objects con los mismos atributos <b>son el mismo</b>.</li>
              <li>Es <b>inmutable</b>: si querés cambiarlo, creás uno nuevo.</li>
              <li>Ejemplo: <code>Dinero(100, "ARS")</code>. Cien pesos son cien pesos. Si querés 200, creás otro objeto.</li>
            </ul>
          </div>
        </div>

        <h2>Más ejemplos (típicos de parcial)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Tipo</th><th>Por qué</th></tr></thead>
          <tbody>
            <tr><td>Usuario</td><td>Entity</td><td>Tiene ID, persiste, cambia en el tiempo</td></tr>
            <tr><td>Pedido</td><td>Entity</td><td>Tiene número de pedido, se le sigue el estado</td></tr>
            <tr><td>Producto</td><td>Entity</td><td>Tiene código, stock que cambia</td></tr>
            <tr><td>Dirección</td><td>Value Object</td><td>Se define por calle + altura + ciudad. Dos direcciones iguales son la misma</td></tr>
            <tr><td>Dinero</td><td>Value Object</td><td>100 ARS es 100 ARS</td></tr>
            <tr><td>Coordenada GPS</td><td>Value Object</td><td>Se define por lat + long</td></tr>
            <tr><td>Rango de fechas</td><td>Value Object</td><td>Se define por desde + hasta</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">🔑 La regla para decidir</div>
          <p>Preguntate: <b>“¿me importa <i>cuál</i> de los dos es, o sólo <i>cuánto/qué</i> vale?”</b></p>
          <ul>
            <li>Si te importa <b>cuál</b> → <b>Entity</b> (necesita identidad).</li>
            <li>Si sólo te importa el <b>valor</b> → <b>Value Object</b> (inmutable, sin ID).</li>
          </ul>
        </div>

        ${APP.code(`// Value Object con record: inmutable y equals por valor, gratis
record Dinero(BigDecimal monto, String moneda) {
    Dinero sumar(Dinero otro) {
        if (!moneda.equals(otro.moneda)) throw new MonedasDistintas();
        return new Dinero(monto.add(otro.monto), moneda);   // devuelve uno NUEVO
    }
}

// Entity: identidad propia, mutable
class Persona {
    private final Long id;          // la identidad
    private String nombre;          // puede cambiar, sigue siendo la misma persona
    // equals/hashCode se basan SOLO en el id
}`, { label: "Value Object vs Entity en Java" })}
        <div class="callout info">
          <p>En Java los value objects se implementan bien con <code>record</code>: inmutables por defecto y con
          <code>equals</code>/<code>hashCode</code> por valor ya generados. Las entities comparan por <b>ID</b>, no por
          atributos.</p>
        </div>

        <h2>Cómo justificarlo (escrito)</h2>
        <blockquote class="just-modelo">“Modelé <b>[Dirección]</b> como <b>Value Object</b> porque no tiene identidad
        propia: se define completamente por sus atributos y dos instancias con los mismos valores son equivalentes.
        Además es <b>inmutable</b>, lo que evita efectos colaterales por referencias compartidas.”</blockquote>

        <div class="callout tip">
          <p>Aparece seguido en los finales: el <b>snapshot de perfil</b> de Talentia, el <b>Documento</b> de Libros
          Circulares, el <b>Monto/prima</b> de ProtegePro — todos son value objects. Reconocerlos evita, por ejemplo,
          que el snapshot de una postulación cambie cuando cambia el perfil.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="voQuiz"></div>
      `;

      APP.quiz(el.querySelector("#voQuiz"), [
        { n: 1, topic: "Entity vs VO", type: "mc", q: "Una <code>Dirección</code> (calle, altura, ciudad). ¿Entity o Value Object?", options: [
          { t: "Value Object: se define por sus atributos, dos iguales son la misma", ok: true },
          { t: "Entity: tiene identidad", ok: false },
        ], explain: "No te importa <i>cuál</i> instancia de dirección es, sólo su valor. Inmutable, sin ID." },
        { n: 2, topic: "Entity vs VO", type: "mc", q: "Un <code>Pedido</code> al que le seguís el estado. ¿Entity o Value Object?", options: [
          { t: "Entity: tiene número de pedido (identidad) y cambia en el tiempo", ok: true },
          { t: "Value Object: se define por sus ítems", ok: false },
        ], explain: "Te importa <i>cuál</i> pedido es (el 99213), y es mutable (cambia de estado). Entity." },
        { n: 3, topic: "Entity vs VO", type: "mc", q: "Al postularse en Talentia se guarda una copia congelada del perfil. ¿Cómo conviene modelarla?", options: [
          { t: "Value Object inmutable: una foto que no cambia aunque cambie el perfil original", ok: true },
          { t: "Entity con referencia al perfil vivo", ok: false },
        ], explain: "El enunciado exige que no se afecte por cambios posteriores: un value object inmutable (snapshot) lo garantiza." },
        { n: 4, topic: "Entity vs VO", type: "vf", q: "Un Value Object es inmutable: para cambiarlo se crea uno nuevo.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "La inmutabilidad es central: <code>dinero.sumar(otro)</code> devuelve un objeto nuevo, no modifica el original." },
      ]);
    },
  });
})();
