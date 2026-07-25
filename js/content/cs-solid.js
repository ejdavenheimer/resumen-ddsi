/* ============================================================
   Cheatsheet — SOLID en 1 hoja (imprimible)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  const LETRAS = [
    { l: "S", n: "Single Responsibility", def: "Una clase, una sola razón para cambiar.", smell: "God class que guarda en BD + genera PDF + manda mail; entidad que sabe SQL.", detect: "La descripción de la clase necesita un “y”. Nombres tipo Manager/Helper/Utils." },
    { l: "O", n: "Open/Closed", def: "Abierto a extensión, cerrado a modificación.", smell: "switch/if por tipo que crece; cadena de instanceof con casts.", detect: "Para agregar algo tenés que EDITAR un archivo en vez de CREAR uno nuevo." },
    { l: "L", n: "Liskov Substitution", def: "El subtipo reemplaza al padre sin romper nada.", smell: "Método heredado que tira UnsupportedOperationException; el pingüino que no vuela; cuadrado/rectángulo.", detect: "El cliente necesita instanceof; la subclase endurece precondiciones." },
    { l: "I", n: "Interface Segregation", def: "Muchas interfaces chicas mejor que una gigante.", smell: "Clase que implementa la mitad de los métodos vacíos o con excepción.", detect: "Cambiar la interfaz rompe clases a las que ese cambio no les incumbe." },
    { l: "D", n: "Dependency Inversion", def: "Depender de abstracciones, no de detalles.", smell: "new de infraestructura dentro del dominio; interfaz que devuelve ResultSet o el DTO del proveedor.", detect: "No podés testear sin BD/red; el dominio importa un SDK." },
  ];

  APP.register({
    id: "cs-solid",
    title: "Cheatsheet: SOLID",
    tag: "🃏",
    group: "Cheatsheets",
    resumen: "Las 5 letras en una hoja",
    keywords: ["cheatsheet", "solid", "imprimible", "srp", "ocp", "lsp", "isp", "dip", "resumen"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Cheatsheet imprimible</div>
          <h1>SOLID en 1 hoja</h1>
          <p class="lead">Las cinco letras con su definición, el smell típico y cómo detectar la violación.</p>
        </div>

        <div class="controls no-print">
          <button class="btn" id="csPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
        </div>

        <div class="cs-grid">
          ${LETRAS.map(function (x) {
            return '<div class="cs-tile">' +
              '<div class="letra">' + x.l + "</div>" +
              "<h3>" + x.n + "</h3>" +
              "<p>" + x.def + "</p>" +
              '<p class="smell"><b>Smell:</b> ' + x.smell + "</p>" +
              '<p class="detect"><b>Detectar:</b> ' + x.detect + "</p>" +
              "</div>";
          }).join("")}
        </div>

        <h2>Qué patrón suele resolver cada violación</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Letra</th><th>Se resuelve típicamente con…</th></tr></thead>
          <tbody>
            <tr><td>S</td><td>Extraer clase · Facade · separación en capas</td></tr>
            <tr><td>O</td><td>Strategy · State · Command (polimorfismo en vez de switch)</td></tr>
            <tr><td>L</td><td>Rediseñar la jerarquía · preferir composición · segregar interfaces</td></tr>
            <tr><td>I</td><td>Segregar en interfaces chicas y cohesivas</td></tr>
            <tr><td>D</td><td>Interfaz en el dominio + Adapter + inyección de dependencias</td></tr>
          </tbody>
        </table></div>

        <div class="callout key no-print">
          <div class="callout-title">🔑 Cómo se usa en el parcial</div>
          <p>SOLID casi nunca se pregunta suelto: aparece en el punto de justificación. La fórmula que puntúa es
          <b>patrón → principio que cumple → beneficio concreto</b>. Ejemplo: “apliqué Strategy (patrón) para cumplir
          Open/Closed (principio), de modo que agregar una regla no modifica el motor (beneficio)”.</p>
        </div>
      `;
      el.querySelector("#csPrint").addEventListener("click", function () { window.print(); });
    },
  });
})();
