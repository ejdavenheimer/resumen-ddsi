/* ============================================================
   Fundamentos — Biblioteca vs Framework
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "biblioteca-framework",
    title: "Biblioteca vs Framework",
    tag: "📚",
    group: "Fundamentos",
    resumen: "Inversión de control",
    keywords: ["biblioteca", "libreria", "framework", "inversion de control", "hollywood", "spring", "control directo"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Biblioteca vs Framework</h1>
          <p class="lead">La diferencia se resume en una idea: <b>quién tiene el control</b>.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Esto entró como V/F en el parcial 2023</div>
          <p>“Cuando nos referimos a un framework entendemos que se maneja el concepto de <b>control directo</b>”
          → <b>FALSO</b>. En un framework hay <b>inversión de control</b>, no control directo. Si entendés por qué,
          tenés el punto asegurado.</p>
        </div>

        <div class="analogia">
          <div class="emo">🧰</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Una <b>biblioteca</b> es una caja de herramientas: agarrás el martillo <b>cuando vos querés</b> clavar.
            Vos manejás el flujo.</p>
            <p>Un <b>framework</b> es trabajar en una fábrica con cinta transportadora: la cinta trae las piezas y vos
            hacés tu parte <b>cuando te toca</b>. Vos no controlás la cinta; la cinta te controla a vos.</p>
          </div>
        </div>

        <h2>La diferencia clave: inversión de control</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Biblioteca (library)</h4>
            <p><b>Vos la llamás</b> cuando la necesitás. <b>Vos tenés el control.</b></p>
            <p>Ejemplo: <code>Math.sqrt(9)</code> — vos decidís cuándo invocarla.</p>
            <p><b>Control directo:</b> tu código decide el flujo y usa la biblioteca como herramienta.</p>
          </div>
          <div class="vs-b">
            <h4>Framework</h4>
            <p><b>El framework te llama a vos.</b> <b>El framework tiene el control.</b></p>
            <p>Ejemplo: Spring llama a tu <code>@Controller</code> cuando llega una request.</p>
            <p><b>Inversión de control:</b> vos escribís las piezas y el framework decide cuándo invocarlas.</p>
          </div>
        </div>

        <div class="callout tip">
          <div class="callout-title">🎬 El Principio de Hollywood</div>
          <p><b>“No nos llames, nosotros te llamamos.”</b> Es la frase con la que se resume la inversión de control:
          vos entregás tu código y el framework lo invoca en el momento que corresponde.</p>
        </div>

        ${APP.uml(`graph LR
    subgraph "Biblioteca — vos tenés el control"
      TU1["Tu código"] -->|"llama a"| LIB["Biblioteca<br/>(Math, Gson)"]
    end
    subgraph "Framework — el framework tiene el control"
      FW["Framework<br/>(Spring)"] -->|"llama a"| TU2["Tu código<br/>(@Controller)"]
    end
    style FW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style LIB fill:#e0f2fe,stroke:#0284c7,color:#0f172a`, "¿Quién llama a quién?")}

        <h2>Ejemplos concretos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Bibliotecas</th><th>Frameworks</th></tr></thead>
          <tbody>
            <tr><td>Apache Commons</td><td>Spring Boot</td></tr>
            <tr><td>Lodash</td><td>Angular</td></tr>
            <tr><td>jQuery</td><td>Django</td></tr>
            <tr><td>Gson / Jackson</td><td>Ruby on Rails</td></tr>
          </tbody>
        </table></div>

        <div class="callout info">
          <p><b>La frontera no siempre es nítida.</b> jQuery se usa como biblioteca, pero algo como React está en el
          medio. Lo que define la categoría es la <b>inversión de control</b>: si el flujo lo maneja tu código, es
          biblioteca; si lo maneja el otro y vos completás huecos, es framework.</p>
          <p>Relación con <a class="inline" data-go="template-method">Template Method</a>: un framework es, en el fondo,
          un Template Method a gran escala — define el esqueleto y vos implementás los pasos.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="bfQuiz"></div>
      `;

      APP.quiz(el.querySelector("#bfQuiz"), [
        { n: 1, topic: "Biblioteca vs Framework", type: "vf", q: "En un framework se maneja el concepto de control directo.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "En un framework hay <b>inversión de control</b> (el framework llama a tu código). El control directo es de las bibliotecas." },
        { n: 2, topic: "Biblioteca vs Framework", type: "mc", q: "Usás <code>Math.sqrt(9)</code>. Eso es…", options: [
          { t: "Una biblioteca: vos la llamás cuando querés", ok: true },
          { t: "Un framework: te llama a vos", ok: false },
          { t: "Inversión de control", ok: false },
        ], explain: "Vos decidís cuándo invocarla: control directo, biblioteca." },
        { n: 3, topic: "Biblioteca vs Framework", type: "mc", q: "Spring invoca tu método anotado con <code>@Scheduled</code> a la hora programada. Eso es…", options: [
          { t: "Inversión de control (framework)", ok: true },
          { t: "Control directo (biblioteca)", ok: false },
          { t: "Polimorfismo", ok: false },
        ], explain: "Vos escribís el método, el framework decide cuándo llamarlo: Principio de Hollywood." },
      ]);
    },
  });
})();
