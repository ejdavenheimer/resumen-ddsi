/* ============================================================
   Fundamentos — SDK y componentes embebidos
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "sdk",
    title: "SDK y componentes embebidos",
    tag: "📚",
    group: "Fundamentos",
    resumen: "SDK vs API, software embebido",
    keywords: ["sdk", "kit", "api", "componente embebido", "h2", "sqlite", "libreria", "embebido"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>SDK y componentes embebidos</h1>
          <p class="lead">Las herramientas que un proveedor te da para integrarte, y el software que corre dentro de tu app.</p>
        </div>

        <div class="analogia">
          <div class="emo">🧰</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Comprás un mueble para armar. La <b>API</b> es el plano con las medidas y los puntos de encastre (el
            contrato). El <b>SDK</b> es la caja completa: el plano <i>más</i> el destornillador, los tornillos ya
            contados y un instructivo con dibujos. Podrías armarlo con tus propias herramientas siguiendo el plano,
            pero el kit te ahorra un montón de trabajo.</p>
          </div>
        </div>

        <h2>SDK (Software Development Kit)</h2>
        <p>Un conjunto de <b>herramientas, bibliotecas, documentación y ejemplos</b> que un proveedor te da para
        integrarte con su servicio.</p>

        <h3>Diferencia con API</h3>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>API</h4>
            <p>El <b>contrato / interfaz</b> para comunicarte.</p>
            <p>Ejemplo: los endpoints REST de Mercado Pago.</p>
            <p>Es <i>qué</i> pedir y cómo.</p>
          </div>
          <div class="vs-b">
            <h4>SDK</h4>
            <p>El <b>paquete que te facilita usar</b> esa API desde tu lenguaje.</p>
            <p>Ejemplo: la librería <code>mercadopago-sdk-java</code> que envuelve esos endpoints.</p>
            <p>Es la <i>herramienta</i> para consumir la API cómodamente.</p>
          </div>
        </div>
        <div class="callout info">
          <p>Podés consumir una API <b>sin</b> SDK (armando las llamadas HTTP vos mismo con un cliente HTTP), pero el SDK
          te ahorra el trabajo de serializar, manejar errores, reintentos, autenticación, etc.</p>
        </div>

        <h2>Componente embebido</h2>
        <p>Software de terceros que corre <b>dentro</b> de tu aplicación, no como un servicio aparte con su propio
        despliegue.</p>
        <ul>
          <li><b>Base de datos embebida:</b> H2, SQLite — la base corre en el mismo proceso de tu app (muy usada en tests).</li>
          <li><b>Motor de reglas</b> embebido.</li>
          <li><b>Widget de pago</b> que se incrusta en tu frontend.</li>
        </ul>

        <div class="callout key">
          <div class="callout-title">🔑 Relación con Adapter (esto suma en el parcial)</div>
          <p>Cuando usás un <b>SDK de terceros</b>, conviene <b>envolverlo en un <a class="inline" data-go="adapter">Adapter</a>
          propio</b>. Así tu dominio no depende del SDK directamente: si mañana cambiás de proveedor, sólo reescribís el
          adapter. Es la aplicación directa de <a class="inline" data-go="inyeccion-dependencias">DIP</a>.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="sdkQuiz"></div>
      `;

      APP.quiz(el.querySelector("#sdkQuiz"), [
        { n: 1, topic: "SDK", type: "mc", q: "¿Cuál es la diferencia entre API y SDK?", options: [
          { t: "La API es el contrato de comunicación; el SDK es el paquete de herramientas que facilita usarla desde tu lenguaje", ok: true },
          { t: "Son sinónimos", ok: false },
          { t: "El SDK es más nuevo que la API", ok: false },
        ], explain: "Podés consumir una API sin SDK haciendo las llamadas HTTP a mano; el SDK las envuelve para ahorrarte trabajo." },
        { n: 2, topic: "SDK", type: "mc", q: "Vas a integrar el SDK de un proveedor de pagos. ¿Qué conviene hacer?", options: [
          { t: "Envolverlo en un Adapter propio para no acoplar el dominio al SDK", ok: true },
          { t: "Llamarlo directo desde las entidades del dominio", ok: false },
          { t: "Copiar su código dentro del tuyo", ok: false },
        ], explain: "El Adapter aísla el SDK: cambiar de proveedor sólo toca el adapter, no el dominio (DIP)." },
        { n: 3, topic: "SDK", type: "mc", q: "Usás H2 corriendo dentro del proceso de tu app para los tests. Eso es…", options: [
          { t: "Un componente embebido (base de datos embebida)", ok: true },
          { t: "Un SDK", ok: false },
          { t: "Un microservicio", ok: false },
        ], explain: "Corre dentro de tu aplicación, no como servicio aparte: es software embebido." },
      ]);
    },
  });
})();
