/* ============================================================
   Patrones — Introducción + decision tree
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  /* Árbol de decisión: cada nodo es una pregunta o un resultado */
  const ARBOL = {
    inicio: {
      q: "¿De qué se trata el problema que tenés que resolver?",
      ops: [
        { t: "🏭 De <b>crear</b> objetos: hay varias clases posibles y hay que decidir cuál instanciar", go: "creacional" },
        { t: "🧱 De <b>estructurar</b>: cómo se componen o se conectan las clases entre sí", go: "estructural" },
        { t: "🎭 De <b>comportamiento</b>: cómo colaboran los objetos y qué hace cada uno", go: "comportamiento" },
      ],
    },
    creacional: {
      q: "¿Qué necesitás al crear?",
      ops: [
        { t: "Elegir la clase concreta según un parámetro (“según el tipo, se crea…”)", go: "r-simple-factory" },
        { t: "Que cada variante del creador produzca su propio producto (sucursales, países)", go: "r-factory-method" },
        { t: "Armar un objeto complejo paso a paso, con muchas opciones opcionales", go: "r-builder" },
        { t: "Que exista una única instancia compartida en todo el sistema", go: "r-singleton" },
        { t: "Hay un solo tipo de objeto y ninguna decisión que tomar", go: "r-nada-creacional" },
      ],
    },
    estructural: {
      q: "¿Qué necesitás lograr?",
      ops: [
        { t: "Integrar algo externo cuya interfaz <b>no puedo modificar</b>", go: "r-adapter" },
        { t: "Simplificar el uso de un subsistema con varias clases que hay que coordinar", go: "r-facade" },
        { t: "Tratar igual a un elemento simple y a un grupo que puede contener más grupos (árbol)", go: "r-composite" },
      ],
    },
    comportamiento: {
      q: "¿Cuál de estas frases se parece más al enunciado?",
      ops: [
        { t: "“Hay varias formas de calcular / procesar lo mismo, y pueden agregarse más”", go: "q-strategy-state" },
        { t: "“Cuando pasa X, hay que avisarle a varios interesados”", go: "r-observer" },
        { t: "“Todos siguen el mismo proceso, pero algunos pasos cambian”", go: "r-template" },
        { t: "“Hay que configurar, encolar, deshacer o programar acciones”", go: "r-command" },
      ],
    },
    "q-strategy-state": {
      q: "¿Quién decide cuál se usa en cada momento?",
      ops: [
        { t: "El cliente la elige activamente (elige el medio de pago, el tipo de envío, el algoritmo)", go: "r-strategy" },
        { t: "El objeto avanza solo, siguiendo su ciclo de vida (pendiente → pagado → enviado)", go: "r-state" },
      ],
    },

    /* -------- resultados -------- */
    "r-strategy": { r: "Strategy", id: "strategy", txt: "Familia de algoritmos intercambiables, elegidos por el cliente. Si además pueden aplicarse <b>varios a la vez</b>, el contexto guarda una <i>lista</i> de estrategias (es el caso de los motores de reglas de ProtegePro y TurnoÁgil).", alt: "Si la decisión de <i>cuál</i> instanciar se repite en varios lugares, sumá una <b>Simple Factory</b>." },
    "r-state": { r: "State", id: "state", txt: "Ciclo de vida con transiciones. Cada estado es una clase que sabe qué operaciones acepta y a qué estado pasa.", alt: "Si además hay que avisar a otros cuando cambia el estado, combinalo con <b>Observer</b>; si las acciones al entrar en un estado son configurables, con <b>Command</b>." },
    "r-observer": { r: "Observer", id: "observer", txt: "Dependencia uno-a-muchos con notificación automática, dentro de un mismo proceso.", alt: "Si los interesados son <b>otros servicios desplegados aparte</b>, no alcanza Observer: necesitás un <b>Broker</b> con publish/subscribe." },
    "r-template": { r: "Template Method", id: "template-method", txt: "Esqueleto fijo en una clase abstracta, pasos variables en las subclases.", alt: "Si lo que varía es el algoritmo <i>completo</i> y no algunos pasos, usá <b>Strategy</b>." },
    "r-command": { r: "Command", id: "command", txt: "La acción se cosifica como objeto: se puede configurar, guardar, encolar, deshacer y loguear.", alt: "Si además hay que agrupar varios comandos en uno (macros), se combina con <b>Composite</b>." },
    "r-adapter": { r: "Adapter", id: "adapter", txt: "Tu interfaz de dominio + una implementación que traduce hacia el servicio externo.", alt: "Si hay <i>varios</i> proveedores intercambiables, cada adapter funciona además como una <b>Strategy</b>." },
    "r-facade": { r: "Facade", id: "facade", txt: "Una interfaz simple y única sobre un subsistema complejo.", alt: "A nivel arquitectura, el mismo concepto se llama <b>API Gateway</b> o <b>BFF</b>." },
    "r-composite": { r: "Composite", id: "composite", txt: "Hoja y compuesto comparten interfaz; el compuesto delega recursivamente en sus hijos.", alt: "Verificá que sea un <b>árbol</b> de verdad. Si es una lista plana sin anidamiento, no hace falta." },
    "r-simple-factory": { r: "Simple Factory", id: "factory", txt: "Un punto único que concentra la decisión de qué instanciar.", alt: "No es un patrón GoF, pero se usa muchísimo y se acepta perfectamente en el parcial." },
    "r-factory-method": { r: "Factory Method", id: "factory", txt: "El creador declara la operación de creación y cada subclase decide qué producto concreto devolver.", alt: "Suele ir de la mano de <b>Template Method</b>: el algoritmo general en la base, la creación delegada a la subclase." },
    "r-builder": { r: "Builder", id: "builder", txt: "Construís el objeto paso a paso, eligiendo qué incluir, y validás antes de crearlo.", alt: "Sólo vale la pena con muchos atributos opcionales. Para 2-3 obligatorios, un constructor normal alcanza." },
    "r-singleton": { r: "Singleton", id: "singleton", txt: "Constructor privado + instancia estática + <code>getInstance()</code>: una sola instancia compartida.", alt: "Es el patrón más criticado (estado global, difícil de testear). Preferí una instancia única <b>inyectada</b>." },
    "r-nada-creacional": { r: "Ningún patrón", id: "patrones-intro", txt: "Si hay un solo tipo de objeto y ninguna decisión que tomar, <code>new MiClase()</code> está perfecto.", alt: "Meter una factory “por las dudas” es sobreingeniería y resta puntos." },
  };

  function arbol(cont) {
    const historial = [];
    let actual = "inicio";

    function render() {
      const n = ARBOL[actual];
      if (n.r) {
        cont.innerHTML =
          '<div class="det-fb ok"><h4>🎯 Patrón candidato: <b>' + n.r + "</b></h4>" +
          "<p>" + n.txt + "</p>" +
          '<p style="margin-top:.6rem">💡 ' + n.alt + "</p>" +
          (n.id !== "patrones-intro" ? '<p style="margin-top:.6rem"><a class="inline" data-go="' + n.id + '">→ Ir al tema completo</a></p>' : "") +
          "</div>" +
          '<div class="controls"><button class="btn" id="atReset" type="button">Empezar de nuevo</button>' +
          (historial.length ? '<button class="btn ghost sm" id="atBack" type="button">← Volver</button>' : "") +
          "</div>";
      } else {
        cont.innerHTML =
          '<p style="font-weight:600;font-size:1.02rem">' + n.q + "</p>" +
          '<div class="q-opts">' +
            n.ops.map(function (o, k) {
              return '<button class="q-opt" type="button" data-k="' + k + '"><span class="mk">→</span><span>' + o.t + "</span></button>";
            }).join("") +
          "</div>" +
          (historial.length ? '<div class="controls"><button class="btn ghost sm" id="atBack" type="button">← Volver</button></div>' : "");
        cont.querySelectorAll(".q-opt").forEach(function (b) {
          b.addEventListener("click", function () {
            historial.push(actual);
            actual = n.ops[+b.dataset.k].go;
            render();
          });
        });
      }
      const back = cont.querySelector("#atBack");
      if (back) back.addEventListener("click", function () { actual = historial.pop(); render(); });
      const reset = cont.querySelector("#atReset");
      if (reset) reset.addEventListener("click", function () { historial.length = 0; actual = "inicio"; render(); });
      cont.querySelectorAll("[data-go]").forEach(function (c) {
        c.style.cursor = "pointer";
        c.addEventListener("click", function () { APP.go(c.dataset.go); });
      });
    }
    render();
  }

  APP.register({
    id: "patrones-intro",
    title: "¿Cómo elegir un patrón?",
    tag: "🎨",
    group: "Patrones de Diseño",
    resumen: "Qué son, categorías y árbol de decisión",
    keywords: ["patrones", "gof", "creacional", "estructural", "comportamiento", "elegir patron", "decision tree"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Patrones de Diseño</div>
          <h1>¿Qué es un patrón y cómo elijo cuál usar?</h1>
          <p class="lead">Una solución probada y reutilizable a un problema recurrente de diseño de software.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Definición</div>
          <p>Un patrón de diseño no es código: es una <b>descripción de un problema recurrente y de la estructura de una
          solución</b>, expresada en términos de clases y objetos que colaboran. Es vocabulario compartido: decir
          “acá va un Strategy” transmite en dos palabras un diseño entero.</p>
        </div>

        <h2>Los patrones NO son…</h2>
        <div class="grid-3">
          <div class="card"><h3 style="margin-top:0">📋 …código para copiar y pegar</h3>
            <p>Cada aplicación del patrón usa los nombres del dominio. No existe una clase que se llame <code>ConcreteStrategy</code> en un sistema real: se llama <code>CostoExpress</code>.</p></div>
          <div class="card"><h3 style="margin-top:0">⛓️ …una obligación</h3>
            <p>No hay que meter patrones siempre. Un diseño simple que resuelve el problema es mejor que uno lleno de indirecciones.</p></div>
          <div class="card"><h3 style="margin-top:0">🪄 …la solución a todo</h3>
            <p>Un patrón mal aplicado es peor que ninguno: agrega complejidad sin resolver nada, y en el parcial se descuenta.</p></div>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Regla de oro</div>
          <p><b>No metas un patrón porque queda lindo. Metelo cuando resuelve un problema real que tenés ahora.</b>
          Y como corolario para el parcial: si no podés señalar la <b>frase del enunciado</b> que lo justifica, sacalo.</p>
        </div>

        <h2>Las tres categorías (GoF)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Categoría</th><th>De qué se ocupa</th><th>Del temario</th></tr></thead>
          <tbody>
            <tr><td><b>Creacionales</b></td><td>Cómo se <b>crean</b> los objetos, desacoplando al cliente de las clases concretas</td><td>Simple Factory, Factory Method <span class="pill gray">(+ Builder, Singleton)</span></td></tr>
            <tr><td><b>Estructurales</b></td><td>Cómo se <b>componen</b> clases y objetos para formar estructuras más grandes</td><td>Adapter, Composite, Facade <span class="pill gray">(+ Decorator, Proxy)</span></td></tr>
            <tr><td><b>De comportamiento</b></td><td>Cómo <b>interactúan</b> los objetos y cómo se reparten las responsabilidades</td><td>Strategy, Observer, State, Template Method, Command</td></tr>
          </tbody>
        </table></div>

        <h2>🎮 Decision tree: ¿qué patrón uso?</h2>
        <p>Respondé 2 o 3 preguntas sobre tu problema y te sugiero uno o dos candidatos.</p>
        <div class="widget" id="patArbol"></div>

        <h2>Los patrones del temario, de un vistazo</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Patrón</th><th>Intención en una línea</th><th>Frase que lo dispara</th></tr></thead>
          <tbody>
            <tr><td><a class="inline" data-go="adapter">Adapter</a></td><td>Traducir entre dos interfaces incompatibles</td><td>“integrarse con un servicio externo”</td></tr>
            <tr><td><a class="inline" data-go="composite">Composite</a></td><td>Tratar igual a la parte y al todo</td><td>“categorías que contienen subcategorías”</td></tr>
            <tr><td><a class="inline" data-go="facade">Facade</a></td><td>Interfaz simple sobre un subsistema complejo</td><td>“punto de entrada único”</td></tr>
            <tr><td><a class="inline" data-go="strategy">Strategy</a></td><td>Algoritmos intercambiables</td><td>“distintas formas de calcular… pueden agregarse más”</td></tr>
            <tr><td><a class="inline" data-go="factory">Simple Factory</a></td><td>Centralizar la decisión de qué instanciar</td><td>“según el tipo, se crea”</td></tr>
            <tr><td><a class="inline" data-go="factory">Factory Method</a></td><td>La subclase decide qué producto crear</td><td>“cada sucursal genera su propio comprobante”</td></tr>
            <tr><td><a class="inline" data-go="builder">Builder</a></td><td>Construir un objeto complejo paso a paso</td><td>“muchos atributos opcionales”, “se arma de a poco”</td></tr>
            <tr><td><a class="inline" data-go="singleton">Singleton</a></td><td>Una única instancia con acceso global</td><td>“una sola instancia compartida”, “config global”</td></tr>
            <tr><td><a class="inline" data-go="observer">Observer</a></td><td>Notificación automática uno-a-muchos</td><td>“varios componentes deben enterarse”</td></tr>
            <tr><td><a class="inline" data-go="state">State</a></td><td>El comportamiento cambia con el estado</td><td>“ciclo de vida”, “según el estado se puede o no”</td></tr>
            <tr><td><a class="inline" data-go="template-method">Template Method</a></td><td>Esqueleto fijo, pasos variables</td><td>“todos siguen el mismo proceso con variantes”</td></tr>
            <tr><td><a class="inline" data-go="command">Command</a></td><td>La acción como objeto configurable</td><td>“configurar acciones”, “deshacer”, “encolar”</td></tr>
          </tbody>
        </table></div>

        <h2>Cómo se combinan (esto es lo que separa un 60 de un 90)</h2>
        <p>En los finales los patrones casi nunca aparecen solos. Las combinaciones que más se repiten:</p>
        <ul>
          <li><b>State + Observer:</b> el objeto cambia de estado y notifica a los interesados. (GTV, Talentia, La Scalo)</li>
          <li><b>State + Command:</b> al entrar en un estado se ejecutan acciones configurables. (GTV)</li>
          <li><b>Strategy + Simple Factory:</b> la factory elige qué estrategia instanciar según el pedido del usuario. (La Scalo)</li>
          <li><b>Strategy en colección:</b> un motor con una <i>lista</i> de reglas que se aplican en cadena. (ProtegePro, TurnoÁgil)</li>
          <li><b>Adapter + DIP:</b> toda integración externa entra por una interfaz del dominio. (todos los finales)</li>
          <li><b>Facade + Adapter:</b> el service coordina el subsistema, y los adapters lo conectan con lo externo.</li>
          <li><b>Template Method + Factory Method:</b> el esqueleto en la base, la creación en la subclase.</li>
        </ul>

        <div class="callout tip">
          <div class="callout-title">✅ Próximo paso</div>
          <p>Recorré los patrones en orden desde <a class="inline" data-go="adapter">Adapter</a>, o probá directamente
          el <a class="inline" data-go="p-detector">Detector de patrones</a> con 34 enunciados reales para ver cuánto
          reconocés antes de leerlos.</p>
        </div>
      `;
      arbol(el.querySelector("#patArbol"));
    },
  });
})();
