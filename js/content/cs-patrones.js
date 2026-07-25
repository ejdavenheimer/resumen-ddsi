/* ============================================================
   Cheatsheet — Palabras clave por patrón (imprimible)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  const FILAS = [
    { p: "Adapter", kw: "integrarse con un servicio externo · consumir una API externa · librería de terceros · sistema legacy · “no puede ser modificado, no es de nuestra propiedad” · retorna JSON de un tercero", j: "“Usé Adapter porque el sistema debe integrarse con [X], que expone su interfaz y no está bajo nuestro control. El dominio depende de la abstracción [I] y cambiar de proveedor sólo agrega otro adapter (OCP + DIP).”" },
    { p: "Builder", kw: "objeto con muchos atributos opcionales · se va configurando paso a paso · el usuario elige qué incluir · distintas combinaciones · personalizable", j: "“Usé Builder porque [X] tiene múltiples atributos, varios opcionales, y las combinaciones harían inmanejable la cantidad de constructores. Lo construyo paso a paso y valido antes de instanciar.”" },
    { p: "Composite", kw: "estructura jerárquica · árbol · categorías y subcategorías · menú con submenús · grupos que contienen grupos · sumatoria de las partes · organigrama", j: "“Usé Composite porque hay una jerarquía de [X] que puede contener [Y] o subestructuras del mismo tipo. La operación [calcular/recorrer] funciona igual sobre hojas y compuestos.”" },
    { p: "Facade", kw: "punto de entrada único · simplificar el uso de · coordinar varios servicios · gestiona el ciclo de vida · toma como entrada… y devuelve · esconder la complejidad", j: "“Usé Facade para simplificar el subsistema [X]: el cliente conoce sólo [FacadeX], que coordina [a, b, c]. Baja el acoplamiento y hace el caso de uso reutilizable desde cualquier canal.”" },
    { p: "Strategy", kw: "distintas formas de calcular/procesar/validar · algoritmos intercambiables · reglas configurables · pueden agregarse más · sin alterar el resto · se decide en tiempo de ejecución · método de pago/envío", j: "“Usé Strategy porque hay varias formas alternativas de [X] y pueden agregarse más. Encapsular cada una cumple OCP: sumar una es una clase nueva. Si aplican varias, el contexto guarda una colección.”" },
    { p: "Simple Factory", kw: "según el tipo se crea · instanciar según · centralizar la creación · diferentes categorías de objetos", j: "“Usé una Simple Factory para centralizar la creación de [X] según [criterio], evitando que la decisión se disperse y que el resto conozca clases concretas.”" },
    { p: "Factory Method", kw: "cada [sucursal/país/marca] genera su propio producto · el algoritmo es común pero la creación varía por subclase", j: "“Usé Factory Method: la clase base define el algoritmo y cada subclase decide qué producto concreto instanciar, sin duplicar el flujo común.”" },
    { p: "Observer", kw: "notificar automáticamente · varios componentes deben enterarse · cuando cambia X se avisa a Y · sistema de eventos · podrían sumarse más acciones · publicador/suscriptor (in-process)", j: "“Usé Observer porque al cambiar [X] varios componentes deben reaccionar y pueden sumarse más. El subject no conoce a los observers concretos; se agregan y quitan dinámicamente.”" },
    { p: "State", kw: "ciclo de vida · el sistema pasa por estados · estado inicial/estados finales · según el estado se puede/no se puede · una vez X no se puede operar · trazabilidad de la evolución", j: "“Usé State porque [X] atraviesa un ciclo de vida y responde distinto a las mismas acciones según su estado. Cada estado encapsula sus transiciones y validaciones, evitando if/else.”" },
    { p: "Template Method", kw: "todos siguen el mismo proceso con variantes · algoritmo con pasos comunes · el esqueleto se mantiene · sólo cambia cómo se [paso] · sub-tipos con lógica específica", j: "“Usé Template Method porque las [X] siguen el mismo esqueleto y sólo varían algunos pasos. La clase abstracta define el orden (método final) y las subclases implementan los pasos específicos.”" },
    { p: "Command", kw: "configurar acciones · el mensaje/la URI/el body configurable · deshacer/undo · encolar acciones · programar tareas · log de operaciones · el usuario define qué se ejecuta · macros", j: "“Usé Command para cosificar las acciones [X] como objetos con su propia configuración. Esto permite configurarlas, guardarlas, encolarlas o deshacerlas, y desacopla al invoker del receiver.”" },
  ];

  APP.register({
    id: "cs-patrones",
    title: "Cheatsheet: Patrones",
    tag: "🃏",
    group: "Cheatsheets",
    resumen: "Palabras clave y frases para justificar",
    keywords: ["cheatsheet", "patrones", "imprimible", "palabras clave", "justificar", "resumen"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Cheatsheet imprimible</div>
          <h1>Palabras clave por patrón</h1>
          <p class="lead">Una hoja: la frase del enunciado que dispara cada patrón, y la frase modelo para justificarlo.</p>
        </div>

        <div class="controls no-print">
          <button class="btn" id="csPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
          <span style="color:var(--ink-soft);font-size:.88rem">Se imprime sin el menú ni los botones.</span>
        </div>

        <div class="table-wrap"><table class="data">
          <thead><tr><th>Patrón</th><th>Palabras clave del enunciado</th><th>Frase para justificar</th></tr></thead>
          <tbody>
            ${FILAS.map(function (f) {
              return "<tr><td><b>" + f.p + "</b></td><td>" + f.kw + "</td><td>" + f.j + "</td></tr>";
            }).join("")}
          </tbody>
        </table></div>

        <h2 class="no-print">Reglas rápidas para desempatar</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Duda</th><th>Cómo desempatar</th></tr></thead>
          <tbody>
            <tr><td>Strategy vs State</td><td>¿Quién decide el cambio? Cliente → Strategy · el objeto solo → State</td></tr>
            <tr><td>Strategy vs Template Method</td><td>¿Varía todo el algoritmo o algunos pasos? Todo → Strategy · pasos → Template Method</td></tr>
            <tr><td>Adapter vs Facade</td><td>¿Traduce una interfaz existente o crea una nueva simple? Traduce → Adapter · simplifica → Facade</td></tr>
            <tr><td>Command vs Strategy</td><td>¿El usuario configura/guarda/deshace la acción? Sí → Command · sólo varía el cálculo → Strategy</td></tr>
            <tr><td>Observer vs Broker</td><td>¿Los interesados están en el mismo proceso? Sí → Observer · en otros servicios → Broker (Pub/Sub)</td></tr>
            <tr><td>Simple vs Factory Method</td><td>¿La decisión viene de un parámetro o de quién crea? Parámetro → Simple · quién crea → Factory Method</td></tr>
            <tr><td>Composite vs composición</td><td>¿El contenedor puede ser hijo de otro contenedor? Sí → Composite · no → composición común</td></tr>
            <tr><td>Builder vs Factory</td><td>¿Opciones/pasos o tipos/variantes? Opciones → Builder · variantes → Factory</td></tr>
          </tbody>
        </table></div>

        <div class="callout warn no-print">
          <div class="callout-title">⚠️ Antes de escribir un patrón</div>
          <p>Preguntate: <b>¿puedo señalar la frase del enunciado que lo justifica?</b> Si no podés, probablemente sea
          sobreingeniería y reste puntos.</p>
        </div>
      `;
      el.querySelector("#csPrint").addEventListener("click", function () { window.print(); });
    },
  });
})();
