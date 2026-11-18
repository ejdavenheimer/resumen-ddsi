/* ============================================================
   P2 · Arquitectura Monolítica
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-monolito",
    title: "Arquitectura Monolítica",
    tag: "🧱",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Qué define a un monolito, variantes, ventajas/desventajas y Monolith First",
    keywords: ["monolito", "monolitica", "unidad de despliegue", "big ball of mud", "monolito modular", "monolith first", "fowler", "capas", "lock-in", "escalado en bloque", "acid"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Arquitectura Monolítica</h1>
          <p class="lead">Pregunta clásica de final: “<i>explique las diferencias, ventajas y desventajas entre monolítica y microservicios; elija una y justifique con atributos de calidad</i>”. Empieza por entender qué define a un monolito — no es el tamaño.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Definición</div>
          <ul>
            <li>Un sistema monolítico es aquel en el que <b>todas sus responsabilidades se construyen, versionan y despliegan como una única unidad</b>.</li>
            <li>Presentación, lógica de negocio y acceso a datos conviven en el <b>mismo artefacto</b> (un .jar/.war, un .exe, un bundle) y típicamente <b>en el mismo proceso</b>.</li>
            <li>Los módulos se comunican mediante <b>llamadas en memoria</b>, no por red.</li>
            <li>Suele trabajar sobre una <b>única base de datos</b> para todo el dominio.</li>
          </ul>
          <p><b>“Lo que define a un monolito no es su tamaño, sino que TODO SE DESPLIEGA JUNTO.”</b></p>
          <p><b>Pregunta guía:</b> <i>¿puedo poner en producción un cambio en Facturación sin volver a desplegar Ventas?</i>
          Si la respuesta es <b>no</b>, estamos ante un monolito.</p>
        </div>

        <h2>Tres conceptos que se confunden</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Qué es</th><th>Ojo</th></tr></thead>
          <tbody>
            <tr><td><b>Base de código</b></td><td>Dónde vive el código fuente</td><td>Un <b>monorepo</b> puede contener varios servicios independientes, y un monolito puede estar repartido en varios repos o bibliotecas</td></tr>
            <tr><td><b>Proceso en ejecución</b></td><td>Cuántos procesos corren en tiempo de ejecución</td><td>Un monolito <b>puede ejecutarse en N réplicas idénticas</b> detrás de un balanceador</td></tr>
            <tr><td><b>Unidad de despliegue</b></td><td>Qué se construye y se pone en producción en conjunto</td><td><b>Este es el criterio que define a un monolito:</b> un cambio en cualquier parte implica desplegar el todo</td></tr>
          </tbody>
        </table></div>

        <h2>Monolito en capas ≠ código desordenado</h2>
        <p>Un monolito bien diseñado organiza su código internamente en <b>capas</b>: Controladores, Servicios, Dominio y
        Repositorios — cada capa depende sólo de la inmediatamente inferior.</p>
        <div class="callout key">
          <p><b>Las capas son una decisión de ORGANIZACIÓN DEL CÓDIGO; monolítico es una decisión de DESPLIEGUE.</b> No son
          excluyentes: la gran mayoría de los monolitos son, además, en capas. Las capas mejoran la <b>mantenibilidad</b> y
          la <b>testeabilidad</b>, pero <b>no cambian la forma de escalar ni de desplegar</b>.</p>
        </div>

        <h2>Variantes de monolito</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Variante</th><th>Dónde corre la lógica</th><th>Ejemplo</th><th>¿Cómo se actualiza?</th></tr></thead>
          <tbody>
            <tr><td><b>1 · Desktop concentrada</b></td><td>En la PC del usuario</td><td>Facturación de un comercio con BD local (VB/Delphi sobre Access/SQLite); la planilla Excel con macros que “es el sistema”; un juego offline</td><td>Reinstalando en cada PC</td></tr>
            <tr><td><b>2 · Cliente-Servidor (2 capas)</b></td><td>Cliente de escritorio + <b>Stored Procedures</b> en la BD</td><td>Gestión de PyME en la LAN (Delphi, PowerBuilder, VB6, WinForms); primeras cajas de supermercado</td><td>Distribuyendo el ejecutable a cada puesto</td></tr>
            <tr><td><b>3 · Mobile/embebida offline</b></td><td>En el dispositivo</td><td>App sin sincronización, firmware de un POS</td><td>Nueva versión en la tienda o update de firmware</td></tr>
            <tr><td><b>4 · Web monolítica (SSR)</b></td><td>En el servidor</td><td>WordPress, Moodle, app Spring MVC + Thymeleaf, Rails, Django, Laravel</td><td>Un único deploy en el servidor</td></tr>
            <tr><td><b>5 · SPA/Mobile + Backend único</b></td><td>En un único backend</td><td>Startup con React + NestJS / Spring Boot — <b>la arquitectura más frecuente hoy</b></td><td>Un deploy del backend (+ versionado de clientes)</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Dato que se cobra:</b> “<b>separar el frontend NO convierte al sistema en un sistema de lógica de negocio
          distribuida</b>: la pregunta es <b>cuántas unidades de despliegue tiene el backend</b>”. Una SPA + un backend
          único <b>sigue siendo un monolito</b>.</p>
          <p>Todas las variantes comparten la misma característica: <b>un cambio en cualquier módulo implica construir y
          desplegar la aplicación completa</b>.</p>
        </div>

        <h2>Big Ball of Mud vs. Monolito Modular</h2>
        <div class="grid-2">
          <div class="card">
            <h3>❌ Big Ball of Mud (sin límites claros)</h3>
            <ul>
              <li><b>Cualquier clase invoca a cualquier otra.</b></li>
              <li><b>Todos los módulos leen y escriben todas las tablas.</b></li>
              <li>Un cambio en Stock rompe Facturación “sin que nadie sepa por qué”.</li>
            </ul>
          </div>
          <div class="card">
            <h3>✅ Monolito Modular</h3>
            <ul>
              <li>Módulos alineados a <b>capacidades de negocio</b>, con una <b>interfaz pública explícita</b>.</li>
              <li><b>Cada módulo es dueño de sus tablas</b>; nadie accede a datos ajenos.</li>
              <li>Ej.: Shopify organizó su monolito Rails en componentes con <b>límites verificados automáticamente</b>.</li>
            </ul>
            <p class="mini">Es el paso previo a microservicios: los <b>bounded contexts</b> ya están, pero sigue habiendo
            una sola unidad de despliegue. Características: una única aplicación desplegable, módulos alineados al dominio,
            fronteras explícitas (sólo se expone la API pública) y <b>esquema de datos propio por módulo</b>, aunque
            compartan la misma base.</p>
          </div>
        </div>

        <h2>Ventajas y desventajas</h2>
        <div class="grid-2">
          <div class="card">
            <h3>✅ Ventajas</h3>
            <ul>
              <li><b>Simplicidad de desarrollo:</b> un repositorio, un build, un entorno local. Fácil de entender y arrancar.</li>
              <li><b>Transacciones ACID locales:</b> una única BD permite confirmar o deshacer toda la operación de forma <b>atómica</b>.</li>
              <li><b>Performance interna:</b> llamadas en memoria (<b>nanosegundos</b>) en lugar de llamadas por red (<b>milisegundos</b>).</li>
              <li><b>Testing y debugging:</b> un test end-to-end levanta todo el sistema; un stack trace recorre el flujo completo.</li>
              <li><b>Despliegue simple:</b> un artefacto, un pipeline, una versión en producción.</li>
              <li><b>Menor costo operativo:</b> menos infraestructura, monitoreo y perfiles especializados.</li>
            </ul>
          </div>
          <div class="card">
            <h3>⚠️ Desventajas</h3>
            <ul>
              <li><b>Despliegue “todo o nada”:</b> cambiar una línea implica volver a desplegar —y re-testear— toda la aplicación.</li>
              <li><b>Escalado en bloque:</b> si sólo “Reportes” necesita más recursos, hay que <b>replicar el sistema entero</b>.</li>
              <li><b>Falla propagada:</b> un memory leak o un bucle infinito en un módulo puede <b>tirar abajo todo el proceso</b>.</li>
              <li><b>Lock-in tecnológico:</b> un único lenguaje, framework y versión para todo; migrar es costoso.</li>
              <li><b>Coordinación de equipos:</b> muchos equipos sobre el mismo código → conflictos de merge y releases coordinados.</li>
              <li><b>Builds y arranques lentos</b> a medida que crece.</li>
            </ul>
          </div>
        </div>

        <h2>Mito: “un monolito no escala”</h2>
        <div class="callout key">
          <p><b>Falso.</b> Un monolito <b>sí escala horizontalmente</b>, ejecutando N réplicas idénticas detrás de un
          balanceador. <b>Requisito:</b> ser <b>stateless</b> (sesión externalizada); si no, volvemos a las sticky
          sessions.</p>
          <p><b>Lo que NO puede</b> es escalar <b>partes de forma independiente</b>: para tener más capacidad en Reportes,
          hay que replicar también Ventas y Stock. Y <b>la base de datos compartida suele convertirse en el verdadero
          cuello de botella</b>.</p>
        </div>

        <h2>¿Cuándo conviene un monolito?</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Es una excelente elección cuando…</h3>
            <ul>
              <li><b>Producto nuevo o MVP:</b> el dominio todavía no está claro y los límites cambian seguido.</li>
              <li><b>Equipo chico:</b> uno o dos equipos de desarrollo.</li>
              <li>Se necesita <b>consistencia transaccional fuerte</b> entre módulos.</li>
              <li>Carga <b>predecible</b> o que crece de forma uniforme.</li>
              <li><b>Presupuesto y capacidad operativa limitados.</b></li>
            </ul>
          </div>
          <div class="card">
            <h3>Evidencia para citar</h3>
            <ul>
              <li><b>“Monolith First” (Martin Fowler):</b> casi todos los casos exitosos de microservicios <b>empezaron como un monolito</b> que creció y luego se dividió.</li>
              <li><b>Stack Overflow:</b> uno de los sitios más visitados del mundo, servido durante años por una aplicación <b>.NET monolítica</b> sobre pocos servidores.</li>
              <li><b>Amazon Prime Video (2023):</b> migró un servicio de monitoreo de video de una arquitectura distribuida (serverless) <b>a un monolito</b> y redujo un <b>90% su costo</b> de infraestructura.</li>
            </ul>
          </div>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2moQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2moQuiz"), [
        { n: 1, topic: "Definición", type: "mc", q: "¿Cuál es el criterio que define a un monolito?", options: [
          { t: "La unidad de despliegue: todo se despliega junto", ok: true },
          { t: "El tamaño del código", ok: false },
          { t: "Tener un solo repositorio", ok: false },
        ], explain: "Un monorepo puede tener varios servicios y un monolito puede estar en varios repos. Lo que define es si puedo desplegar un módulo sin desplegar el resto." },
        { n: 2, topic: "Mitos", type: "vf", q: "Separar el frontend como SPA convierte al sistema en una arquitectura distribuida.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "La pregunta es cuántas unidades de despliegue tiene el BACKEND. SPA + backend único sigue siendo monolito (la variante más común hoy)." },
        { n: 3, topic: "Escalado", type: "mc", q: "Un monolito stateless con 3 réplicas detrás de un LB…", options: [
          { t: "Escala horizontalmente, pero no puede escalar módulos de forma independiente", ok: true },
          { t: "No escala: los monolitos no escalan", ok: false },
          { t: "Escala cada módulo por separado", ok: false },
        ], explain: "Escala en bloque. Y el cuello de botella real suele ser la base de datos compartida." },
        { n: 4, topic: "Decisión", type: "mc", q: "Startup de 6 personas, dominio poco claro, salir en 3 meses. ¿Qué arquitectura?", options: [
          { t: "Monolito (modular): Monolith First. Equipo chico, límites inciertos, bajo costo operativo", ok: true },
          { t: "Microservicios desde el día 1 para no migrar después", ok: false },
          { t: "SOA con ESB", ok: false },
        ], explain: "Los límites son difíciles de acertar al inicio y refactorizar entre servicios cuesta mucho más que dentro de un monolito. Monolito modular deja la puerta abierta a dividir después." },
      ]);
    },
  });
})();
