/* ============================================================
   Landing — hero, rutas de estudio, progreso, consejo del día e índice.
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  const TIPS = [
    "Antes de dibujar una sola clase, subrayá en el enunciado las frases que “disparan” patrones. El 80% del puntaje del punto de dominio está en leer bien.",
    "Un patrón sin justificar vale casi lo mismo que no ponerlo. Escribí siempre: “usé X porque el enunciado dice Y”.",
    "Si el enunciado dice “en el futuro pueden agregarse más…”, están pidiendo Open/Closed. Casi siempre se resuelve con polimorfismo (Strategy o State).",
    "Strategy vs State: preguntate <b>quién decide el cambio</b>. Si lo elige el cliente, Strategy. Si el objeto avanza solo por su ciclo de vida, State.",
    "“Puede tardar varios minutos” + “picos de tráfico” = asincronismo con cola. Es la respuesta que la cátedra busca en casi todos los finales recientes.",
    "Meter patrones de más también resta. Si no podés señalar la frase del enunciado que lo justifica, sacalo.",
    "En los diagramas de clases, nombrá las asociaciones. <code>Ejemplar → Persona</code> no dice nada; <code>propietario</code> y <code>tenedorActual</code> sí.",
    "401 es “no sé quién sos” (autenticación). 403 es “sé quién sos y no podés” (autorización). Es de las preguntas más frecuentes de teoría.",
    "Todo servicio externo entra al sistema por un Adapter. Es gratis en puntos y te salva la justificación de DIP.",
    "Cuando el punto pide “únicamente la capa de dominio”, no dibujes controllers, DTOs ni repositorios. Se descuenta.",
    "Idempotencia importa: si el broker reentrega un mensaje, tu consumidor tiene que poder procesarlo dos veces sin duplicar nada.",
    "Antes de entregar, releé el enunciado buscando requerimientos que no aparezcan en tu diagrama. Es el error más común y el más barato de evitar.",
    "El parcial es escrito: practicá <b>dibujar los diagramas a mano</b>. Saber el patrón no alcanza si no lo podés plasmar rápido en papel. Cada patrón tiene su guía de dibujo.",
    "Una justificación completa tiene 4 elementos: nombra el patrón, cita el enunciado, menciona un principio SOLID y una cualidad de diseño. Practicalo en “Escribí la justificación”.",
    "En los V/F, un “Falso” sin justificar vale cero. Practicá redactando el <i>porqué</i>, no sólo eligiendo la opción.",
    "Cualidad de diseño ≠ atributo de calidad. La primera es del diseño (acoplamiento, cohesión); la segunda es un requerimiento no funcional (disponibilidad, performance).",
    "Framework = inversión de control (“no me llames, yo te llamo”). Biblioteca = control directo. Es un V/F recurrente del parcial.",
    "2º parcial: cardinalidad es la cantidad <b>máxima</b> de relaciones; modalidad es la <b>mínima</b>. “Puede” → 0, “debe” → 1. Lo piden textualmente en cada enunciado.",
    "Desnormalizar sin haber normalizado antes no es desnormalizar: es modelar mal. Y hay dos razones válidas: <b>consistencia histórica</b> y <b>performance medida</b>.",
    "Si el dato integra un documento con valor probatorio (una factura, una liquidación), <b>se copia</b>. Si sólo sirve para navegar, <b>se referencia</b>.",
    "La justificación del modelo de datos son siempre los mismos 3 párrafos: qué persistir, cómo resolviste los impedance mismatches y qué desnormalizaste. Es el punto más barato del parcial.",
    "Los 4 impedance mismatches: identidad, conversión de tipos, cardinalidad y herencia. Si los nombrás en orden, ya tenés media justificación escrita.",
    "Monolito no es “código desordenado” ni “grande”: es <b>una única unidad de despliegue</b>. Separar el frontend no lo convierte en distribuido.",
    "Las métricas avisan, las trazas ubican, los logs explican. Con uno solo de los tres, el diagnóstico queda a medias.",
  ];

  APP.register({
    id: "inicio",
    title: "Inicio",
    tag: "🏠",
    group: "—",
    cuenta: false,
    keywords: ["inicio", "home", "empezar", "ruta de estudio"],
    render(el) {
      const p = APP.progreso();
      const tip = TIPS[new Date().getDate() % TIPS.length];

      /* Índice por grupos, sin la propia landing */
      const grupos = [];
      const mapa = {};
      APP.sections.forEach(function (s) {
        if (s.id === "inicio") return;
        const g = s.group || "General";
        if (!mapa[g]) { mapa[g] = []; grupos.push(g); }
        mapa[g].push(s);
      });

      el.innerHTML = `
        <div class="hero">
          <div class="kick">UTN.BA · FRBA · Plan 23</div>
          <h1>Diseño de Sistemas — todo lo que necesitás para los dos parciales</h1>
          <p>Teoría explicada desde cero, los 11 patrones del temario con diagramas UML, <b>modelado de datos,
             persistencia y arquitectura distribuida</b> para el 2º parcial, práctica pensada para el
             <b>examen escrito</b> (diagramar a mano, justificar, V/F, pseudocódigo) y parciales y finales
             resueltos paso a paso.</p>
          <div class="hero-stats">
            <span>87 temas</span>
            <span>11 patrones</span>
            <span>43 casos del detector</span>
            <span>103 flashcards</span>
            <span>2 resúmenes imprimibles</span>
            <span>parciales y finales resueltos</span>
          </div>
        </div>

        <div class="aviso-escrito">
          <div class="emo">✍️</div>
          <div><p><b>El parcial es ESCRITO.</b> Los ejemplos en Java están para que entiendas los conceptos (y por eso van
          colapsados), pero la práctica del sitio apunta a lo que vas a hacer el día del examen:
          <b>diagramar a mano, justificar por escrito y responder teoría</b>. Cada patrón trae su guía de “cómo dibujarlo
          a mano” y su “justificación modelo”.</p></div>
        </div>

        <div class="big-progress">
          <div class="bp-head">
            <b>Tu progreso</b>
            <span>${p.hechos} de ${p.total} temas visitados · ${p.pct}%</span>
          </div>
          <div class="bp-bar"><i style="width:${p.pct}%"></i></div>
        </div>

        <h2>¿Por dónde arranco?</h2>
        <div class="rutas">
          <div class="ruta" data-go="p2-guia">
            <div class="emo">🗄️</div>
            <h3>Rindo el 2º parcial</h3>
            <p>Modelado de datos, persistencia y arquitectura. Arrancá por el plan de estudio, que te dice en qué orden
               ver cada tema y cuánto tiempo darle, y terminá imprimiendo el resumen.</p>
            <div class="pasos">Plan de estudio → Formas normales → Desnormalización → DER → ORM → Arquitectura → Simulacro → Imprimible P2</div>
          </div>
          <div class="ruta" data-go="poo">
            <div class="emo">🚀</div>
            <h3>Voy desde cero</h3>
            <p>No cursaste al día o querés entender de verdad. Empezá por los fundamentos y seguí el orden del menú: cada tema se apoya en el anterior.</p>
            <div class="pasos">Fundamentos → Diagramas UML → Principios → Patrones → Integración → Testing → Práctica → Finales</div>
          </div>
          <div class="ruta" data-go="cs-patrones">
            <div class="emo">🔁</div>
            <h3>Vengo a repasar</h3>
            <p>Ya viste todo y querés fijar. Pasá por los cheatsheets, después metete de lleno en el detector de patrones y las flashcards.</p>
            <div class="pasos">Cheatsheets → Detector → Flashcards</div>
          </div>
          <div class="ruta" data-go="resumen-imprimible">
            <div class="emo">💧</div>
            <h3>Parcial (5/8)</h3>
            <p>Directo a lo que sirve: el resumen imprimible con todas las definiciones y soluciones, y los 3 modelos de parcial resueltos y descargables.</p>
            <div class="pasos">Resumen imprimible → 3 modelos resueltos</div>
          </div>
        </div>

        <div class="tip-dia">
          <div class="emo">💡</div>
          <div>
            <span class="tip-lbl">Consejo del día</span>
            <p>${tip}</p>
          </div>
        </div>

        <div class="callout info">
          <div class="callout-title">🔎 Buscador</div>
          <p>Usá el buscador de la barra lateral (o apretá <kbd>/</kbd>) para saltar a cualquier tema por nombre o
             palabra clave. Por ejemplo: <i>idempotente</i>, <i>bitácora</i>, <i>broker</i>, <i>ciclo de vida</i>.</p>
        </div>

        <h2>Todo el contenido</h2>
        ${grupos.map(function (g) {
          return "<h3>" + g + "</h3><div class='idx-grid'>" +
            mapa[g].map(function (s) {
              return '<div class="idx-card" data-go="' + s.id + '">' +
                "<b>" + (s.tag ? s.tag + " " : "") + s.title + "</b>" +
                (s.resumen ? "<small>" + s.resumen + "</small>" : "") +
                "</div>";
            }).join("") +
            "</div>";
        }).join("")}

        <h2>Cómo está armada cada página de patrón</h2>
        <p>Todas siguen exactamente el mismo orden, porque es la progresión que mejor funciona para aprender patrones:</p>
        <ol class="steps">
          <li><span class="step-title">Analogía del mundo real</span> Primero que se entienda la <i>idea</i>, no la definición formal.</li>
          <li><span class="step-title">El problema</span> Un caso concreto donde duele no tener el patrón.</li>
          <li><span class="step-title">El diagrama UML</span> Lo que dibujás en el parcial, con los roles explicados al hover.</li>
          <li><span class="step-title">Cómo dibujarlo a mano</span> Instrucciones concretas de dibujo + tips de tiempo.</li>
          <li><span class="step-title">Código Java (colapsado, opcional)</span> Para entender el patrón por dentro. El examen es escrito.</li>
          <li><span class="step-title">Palabras clave del enunciado</span> Las frases exactas que lo disparan en un parcial.</li>
          <li><span class="step-title">Cuándo NO usarlo</span> Tan importante como cuándo sí: la sobreingeniería resta.</li>
          <li><span class="step-title">Justificación modelo</span> Con los 4 elementos que busca el corrector, lista para adaptar.</li>
          <li><span class="step-title">Confusión típica</span> Comparación lado a lado con el patrón parecido.</li>
          <li><span class="step-title">Mini-ejercicio</span> Un enunciado corto para aplicar lo que acabás de leer.</li>
        </ol>

        <div class="callout tip">
          <div class="callout-title">✅ Tu progreso se guarda solo</div>
          <p>Los temas visitados, las respuestas del detector, las flashcards y las rúbricas quedan guardados en este navegador
             (<code>localStorage</code>). Podés cerrar y volver cuando quieras.</p>
        </div>
      `;
    },
  });
})();
