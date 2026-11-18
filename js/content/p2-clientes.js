/* ============================================================
   P2 · Tipos de cliente, patrones de interacción, SPA/SEO
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-clientes",
    title: "Cliente Liviano vs Pesado · SPA · MVC",
    tag: "🖥️",
    group: "Arquitectura Web II (P2)",
    resumen: "MVC/MVVM/MVP, liviano vs pesado, SPA, SEO, nativo vs híbrido, versionado",
    keywords: ["cliente liviano", "cliente pesado", "server side render", "client side render", "spa", "single page application", "seo", "ssr", "ssg", "renderizado hibrido", "mvc", "mvvm", "mvp", "data binding", "nativo", "hibrido", "pwa", "versionado", "bff", "desacoplado"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitectura Web II · 2º Parcial</div>
          <h1>Tipos de Cliente, SPA y Patrones de Interacción</h1>
          <p class="lead">De acá sale la pregunta “<i>¿nativa o híbrida, y qué atributos de calidad sustentan su decisión?</i>” y la de “<i>¿conviene pasar a cliente pesado / SPA?</i>”. Siempre se responde con <b>atributos de calidad</b>, nunca con gustos.</p>
        </div>

        <h2>Patrones de Interacción: ¿quién coordina qué se muestra?</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Patrón</th><th>Piezas</th><th>Idea central</th><th>Frameworks</th></tr></thead>
          <tbody>
            <tr><td><b>MVC</b><br>Modelo-Vista-Controlador</td><td>Modelo (datos + reglas), Vista (cómo se muestran), Controlador (coordina la interacción entre usuario, modelo y vista)</td><td>Flujo <b>unidireccional coordinado por el Controlador</b>: Usuario → Controlador → Modelo → Vista → Usuario. La vista <b>puede</b> consultar al modelo.</td><td>Rails, Django, ASP.NET MVC, Spring MVC, Laravel</td></tr>
            <tr><td><b>MVVM</b><br>Modelo-Vista-VistaModelo</td><td>ViewModel intermedio que <b>expone el estado de la vista</b></td><td><b>Data Binding</b> bidireccional: enlace automático entre una propiedad del ViewModel y un elemento de la vista; cuando uno cambia, el otro se actualiza solo. <b>Elimina el código “pegamento”</b> manual.</td><td>Angular, Vue, WPF/.NET, Knockout</td></tr>
            <tr><td><b>MVP</b><br>Modelo-Vista-Presentador</td><td>Vista <b>pasiva</b> + Presenter</td><td>La vista <b>no decide nada</b>: delega cada acción al Presenter, que orquesta el modelo y le indica <b>exactamente qué mostrar</b>. <b>La vista nunca toca al modelo.</b> Relación típica <b>1 a 1</b> vista↔presenter.</td><td>Android clásico (pre-MVVM), GWT</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Las diferencias que preguntan</div>
          <ul>
            <li><b>MVC vs MVP:</b> en MVC el controlador recibe la acción y decide, pero la <b>vista puede consultar al
            modelo directamente</b>; en MVP <b>todo pasa por el Presenter</b>, incluso la actualización final de la
            pantalla. Además, en MVC suele haber <b>un controlador para varias vistas</b>; en MVP la relación es <b>uno a
            uno</b>, lo que facilita testear cada pantalla aislada.</li>
            <li><b>MVVM vs MVP:</b> en MVVM el <b>data binding es automático</b>; en MVP el Presenter actualiza la vista
            <b>de forma explícita</b>.</li>
            <li><b>Contrapartida de MVVM:</b> el data binding <b>puede ocultar complejidad y dificultar el debugging</b>
            si se abusa.</li>
            <li><b>Ventaja principal de MVC:</b> separar responsabilidades permite <b>testear el Modelo de forma
            aislada</b>.</li>
            <li>“La elección no pasa por cuál es mejor, sino por <b>cuánto se quiere desacoplar la vista</b> de la lógica
            de presentación y <b>qué tan testeable</b> necesitamos que sea.”</li>
          </ul>
        </div>
        <div class="callout tip">
          <p><b>MVC centralizado vs distribuido:</b> el MVC original (1979, Trygve Reenskaug, Smalltalk-80) nació para
          <b>escritorio</b>: los tres componentes vivían en un único proceso, en la misma memoria, llamándose como objetos
          locales — <b>no había cliente ni servidor</b>. En la web, los frameworks lo <b>reinterpretaron</b>: la red
          <b>obliga</b> a separar responsabilidades entre dos procesos (frontend y backend) comunicados por HTTP. Por eso
          “MVC web” es una <b>adaptación</b>, no el patrón literal.</p>
          <p>¿Dónde vive la vista? (a) <b>También en el servidor</b> → el navegador sólo interpreta el HTML ya armado: es el
          esquema del <b>Cliente Liviano</b>. (b) <b>Trasladada al cliente</b> → modelo y controlador quedan en el backend
          expuestos como API, y el backend <b>no sabe ni le importa</b> qué tipo de cliente la consume. Ese desacople es lo
          que habilita al <b>Cliente Liviano Desacoplado</b>.</p>
        </div>

        <h2>¿Quién genera la Vista? Liviano vs. Pesado</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Cliente Liviano (Server-Side Render)</h3>
            <ul>
              <li>Las vistas se generan <b>del lado del servidor</b>; las respuestas son <b>—casi— siempre HTML</b>.</li>
              <li>El navegador se limita a <b>interpretar y mostrar</b> ese HTML (puede haber algo de JS de apoyo, pero <b>no gobierna la vista</b>).</li>
              <li>Toda la lógica de interacción vive en el servidor: <b>cada acción suele implicar un nuevo request</b>.</li>
            </ul>
            <p class="mini">Rails, Django templates, Laravel Blade, ASP.NET Razor, WordPress/PHP clásico.</p>
          </div>
          <div class="card">
            <h3>Cliente Pesado (Client-Side Render)</h3>
            <ul>
              <li>Las vistas se generan <b>del lado del cliente</b>; las respuestas del servidor son <b>datos (JSON)</b>, no HTML.</li>
              <li>El cliente tiene <b>la lógica para transformar esos datos en interfaz</b>.</li>
              <li><b>No es una única forma de implementarse:</b> Web (SPA), Mobile Nativo, Mobile Híbrido y Desktop.</li>
            </ul>
          </div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Cliente Liviano</th><th>Cliente Pesado</th></tr></thead>
          <tbody>
            <tr><td>Generación de la vista</td><td>Servidor</td><td>Cliente</td></tr>
            <tr><td>Dato que se transmite</td><td><b>HTML</b></td><td><b>JSON</b></td></tr>
            <tr><td>Procesamiento</td><td>Mayor en servidor</td><td>Mayor en cliente</td></tr>
            <tr><td>Uso de memoria</td><td>Mayor en servidor</td><td>Mayor en cliente</td></tr>
            <tr><td>Lógica de interacción</td><td>Servidor</td><td>Cliente</td></tr>
            <tr><td><b>Usabilidad</b></td><td>−</td><td><b>+</b></td></tr>
            <tr><td><b>Escalabilidad</b></td><td>−</td><td><b>+</b></td></tr>
            <tr><td><b>Mantenibilidad</b></td><td>−</td><td><b>+</b></td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 ¿Por qué el liviano puntúa “menos”? (hay que saber explicarlo)</div>
          <ul>
            <li><b>Usabilidad (−):</b> cada acción implica un nuevo request y una recarga completa o parcial de la página; la experiencia es <b>menos fluida</b> que una app que ya tiene el código corriendo localmente.</li>
            <li><b>Escalabilidad (−):</b> el servidor concentra la lógica de negocio <b>y</b> el armado de la vista; a más usuarios, más cómputo recae exclusivamente sobre el servidor — <b>más costoso de escalar que sumar clientes</b>.</li>
            <li><b>Mantenibilidad (−):</b> la lógica de presentación y la de negocio <b>conviven entremezcladas</b> en la capa servidor, lo que dificulta modificar una sin afectar a la otra.</li>
          </ul>
          <p class="mini">Son comparaciones <b>relativas, no absolutas</b>: un cliente liviano bien diseñado —por ejemplo
          con <b>renderizado híbrido</b>— mitiga buena parte de estas desventajas.</p>
        </div>

        <h3>¿Cuándo usar cada uno?</h3>
        <div class="grid-2">
          <div class="card">
            <h3>Cliente Liviano</h3>
            <ul>
              <li><b>SEO:</b> el contenido ya llega renderizado en HTML (blogs, e-commerce, sitios institucionales).</li>
              <li><b>Equipos chicos o full-stack:</b> una sola base de código, un solo despliegue.</li>
              <li><b>Dispositivos o conectividad limitados:</b> menos JavaScript para descargar y ejecutar.</li>
              <li>Se prioriza <b>mantenibilidad simple</b> por sobre interactividad rica.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Cliente Pesado</h3>
            <ul>
              <li><b>Alta interactividad:</b> dashboards, editores, herramientas colaborativas.</li>
              <li><b>Múltiples clientes</b> (web, mobile, desktop) sobre la <b>misma API</b>, sin duplicar reglas de negocio.</li>
              <li>Equipos de frontend y backend <b>separados</b>, en paralelo sobre un contrato estable.</li>
              <li>Se prioriza <b>escalabilidad horizontal del cómputo de UI</b> (lo paga el cliente) y <b>usabilidad</b>.</li>
            </ul>
          </div>
        </div>

        <h2>Variantes de Cliente Pesado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Variante</th><th>Características</th><th>Limitación / costo</th></tr></thead>
          <tbody>
            <tr><td><b>Web (SPA)</b></td><td>Corre en el navegador; <b>se instala solo</b>, sin tienda de apps; alcance inmediato multiplataforma</td><td>Acceso <b>restringido</b> a hardware/APIs nativas (cámara, sensores, push), salvo con una <b>PWA</b></td></tr>
            <tr><td><b>Mobile Nativo</b></td><td>SDK propio de cada plataforma (Kotlin/Java, Swift); <b>acceso total</b> al hardware y a las APIs del SO; <b>mejor performance</b> y experiencia 100% acorde a la plataforma</td><td>Hay que programar y mantener <b>una base de código por sistema operativo</b> (dos equipos o el doble de trabajo)</td></tr>
            <tr><td><b>Mobile Híbrido</b></td><td><b>Una única base de código</b> empaquetada para varias plataformas (React Native, Flutter, Ionic/Cordova); <b>menor costo y time-to-market</b></td><td>Acceso a APIs nativas vía <b>plugins/puentes</b> (puede demorar en soportar features nuevas del SO); puede resignar performance o “look and feel”</td></tr>
            <tr><td><b>Desktop</b></td><td>Instalables en el SO (Electron, Tauri, .NET MAUI); en el fondo son clientes pesados que conversan con un backend en la nube (Teams, Slack, Spotify, VS Code)</td><td>Distribución y actualización por fuera del navegador</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🎯 Respuesta modelo: “¿nativa o híbrida?”</div>
          <p><b>Plantilla:</b> “Propongo <b>híbrida</b> (React Native/Flutter) porque el caso de uso es
          <b>consulta y configuración</b> —no hay animaciones exigentes ni cómputo intensivo— y los atributos que
          priorizo son <b>mantenibilidad</b> (una sola base de código para Android e iOS, por lo tanto un solo equipo y
          una sola corrección por bug) y <b>time-to-market / costo</b>. Resigno algo de <b>performance</b> y de acceso
          inmediato a APIs nuevas del SO, que acá no son críticos.”</p>
          <p><b>Cuándo cambia la respuesta a nativa:</b> si el enunciado exige <b>acceso intensivo al hardware</b>
          (streaming de video en vivo desde la cámara, BLE con un collar, geolocalización en background, notificaciones
          push de baja latencia) o <b>performance de UI exigente</b>. Ahí priorizás <b>performance</b> y
          <b>funcionalidad/compatibilidad</b>, y asumís el costo de dos bases de código.</p>
          <p><b>Y siempre definí los atributos</b>, porque la consigna lo pide textualmente: <i>Performance</i> =
          capacidad de responder en el tiempo esperado bajo una carga dada. <i>Mantenibilidad</i> = facilidad para
          modificar el sistema con bajo riesgo y costo. <i>Usabilidad</i> = facilidad con la que el usuario logra su
          objetivo. <i>Portabilidad</i> = capacidad de funcionar en distintos entornos. <i>Time-to-market</i> (de negocio)
          = tiempo hasta tener la funcionalidad en producción.</p>
        </div>

        <h2>PWA (Progressive Web Apps)</h2>
        <ul>
          <li>Sitios web construidos para <b>comportarse como una aplicación instalable</b>, sin pasar por ninguna tienda.</li>
          <li>Usan <b>Service Workers</b>: un script que corre en segundo plano y permite <b>cachear recursos</b> para funcionar <b>offline</b> o con conectividad inestable.</li>
          <li>Pueden agregarse a la pantalla de inicio y <b>enviar notificaciones push</b>.</li>
          <li>Corren sobre el mismo motor que una SPA: son la <b>evolución natural</b> del cliente pesado web que busca acercarse a la experiencia nativa.</li>
        </ul>

        <h2>Versionado de clientes (el problema que nadie ve venir)</h2>
        <div class="callout warn">
          <p>Un cliente pesado <b>instalable</b> (desktop o mobile) <b>no se actualiza solo</b>: el usuario tiene que
          descargar e instalar, y puede tardar o no hacerlo nunca. Mientras tanto, <b>en producción conviven múltiples
          versiones</b> del mismo cliente. Si backend actualiza la API sin contemplar esa convivencia, <b>rompe todo</b>
          para los clientes viejos.</p>
          <p>Un <b>cliente liviano</b> (o una SPA sin cachear, servida en cada visita) no sufre esto del mismo modo: al
          regenerarse en cada request, corre siempre contra la última versión.</p>
        </div>
        <div class="grid-2">
          <div class="card">
            <h3>¿Qué se puede romper?</h3>
            <ul>
              <li>Cambios <b>breaking</b> en el contrato: renombrar o eliminar un campo que el cliente viejo espera.</li>
              <li>Cambios de <b>formato o reglas de negocio</b> que el cliente viejo interpreta distinto (ej. nuevos valores de un enum).</li>
              <li>Funcionalidades nuevas que el cliente viejo no sabe que existen, y funcionalidades viejas que el backend dejó de soportar.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Estrategias</h3>
            <ul>
              <li><b>Versionar la API</b> explícitamente (<code>/api/v1</code>, <code>/api/v2</code>) y mantener las versiones anteriores activas mientras haya clientes.</li>
              <li>Diseñar cambios <b>backward-compatible</b>: <b>agregar campos opcionales</b> en vez de modificar o eliminar.</li>
              <li><b>Hard update:</b> bloquear el uso de una versión demasiado vieja o insegura.</li>
              <li><b>Actualizaciones automáticas en segundo plano</b> (Chrome, Electron) para reducir la ventana de versiones desactualizadas.</li>
            </ul>
          </div>
        </div>

        <h2>SPA, SEO y Renderizado</h2>
        <div class="callout key">
          <p><b>SPA (Single Page Application):</b> toda la aplicación se sirve desde un <b>único punto de entrada</b>
          (típicamente <code>index.html</code>); no hay otros HTML a los que navegar. Las “pantallas” se resuelven
          <b>intercambiando vistas dentro de esa misma página, sin recargarla</b>. El efecto percibido es de app fluida,
          porque no hay ida y vuelta completa al servidor.</p>
          <p><b>⚠️ SPA ≠ Cliente Pesado:</b> “Cliente Pesado” es la <b>categoría arquitectónica</b> (dónde se genera la
          vista); “SPA” es una <b>técnica concreta, específica del cliente pesado web</b>: evitar recargas completas de
          página. <b>Toda SPA es un cliente pesado, pero no todo cliente pesado es una SPA</b> (una app mobile nativa es
          cliente pesado y el concepto de “página única” no aplica).</p>
        </div>
        <div class="grid-2">
          <div class="card">
            <h3>SEO</h3>
            <p><b>Search Engine Optimization:</b> técnicas para que un sitio aparezca mejor posicionado en los buscadores.
            Los motores <b>recorren (“crawlean”) e indexan</b> el contenido. Importa al negocio: mejor posicionamiento =
            más visitas orgánicas sin pagar publicidad.</p>
            <p><b>Relación con la arquitectura:</b> un buscador indexa <b>más fácil y de forma más confiable el contenido
            que ya llega como HTML</b> (cliente liviano / SSR) que el que se arma al ejecutar JavaScript (SPA pura). Los
            buscadores modernos <b>sí</b> ejecutan JS, pero de forma <b>más lenta, costosa y no siempre garantizada</b>
            (<i>crawl budget</i> limitado).</p>
          </div>
          <div class="card">
            <h3>Renderizado híbrido: SSR y SSG</h3>
            <p>Una SPA pura tiene una desventaja: la <b>primera carga es lenta</b> (hay que bajar y ejecutar todo el JS
            antes de ver contenido) y el <b>SEO es más difícil</b>.</p>
            <ul>
              <li><b>SSR:</b> la <b>primera respuesta se genera en el servidor</b> —igual que un cliente liviano— y luego el navegador <b>“hidrata”</b> esa página convirtiéndola en SPA para la navegación posterior.</li>
              <li><b>SSG</b> (Server-Side Generation): el HTML se genera <b>una única vez, en tiempo de build</b>, y se sirve como contenido estático — <b>ideal para combinar con caché y CDN</b>.</li>
            </ul>
            <p class="mini">Next.js, Remix, Nuxt, Astro, SvelteKit. <b>Atributos:</b> mejora <b>Performance</b> (carga
            inicial) y <b>SEO</b> sin resignar usabilidad ni la escalabilidad del cómputo en el cliente.</p>
          </div>
        </div>

        <h2>Cliente Liviano Desacoplado y BFF</h2>
        <div class="callout key">
          <ul>
            <li>Es un <b>cliente liviano (SSR)</b> que <b>no acopla su lógica de presentación</b> al modelo/controlador del
            servidor, sino que <b>consume una API con un contrato estable</b> — el mismo que consumiría un cliente pesado.</li>
            <li>“Los contratos de los servicios <b>no deben cambiar por necesidades de la interfaz gráfica</b>”.</li>
            <li><b>Consecuencia:</b> a futuro se puede <b>reemplazar ese cliente liviano por un cliente pesado</b> —o
            hacer convivir varios— <b>sin modificar el backend</b>, siempre que la API se mantenga versionada y estable.</li>
            <li>En el mercado, esta idea también se conoce como <b>BFF (Backend For Frontend)</b>.</li>
          </ul>
          <p>Es la aplicación práctica del <b>MVC distribuido</b>: modelo + controlador fijos en el servidor,
          <b>vista intercambiable</b>.</p>
        </div>
        ${APP.uml(`graph TB
    W["SPA Web<br/>(cliente pesado)"] --> GW["API Gateway / BFF"]
    M["App Mobile<br/>(nativa o híbrida)"] --> GW
    L["Servidor Frontend SSR<br/>(cliente liviano desacoplado)"] --> GW
    GW --> S1["Servicio Mascotas"]
    GW --> S2["Servicio Alertas"]
    GW --> S3["Servicio Estadísticas"]
    style GW fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Varios clientes, un contrato estable")}

        <h2>Ejercicio</h2>
        <div id="p2cQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2cQuiz"), [
        { n: 1, topic: "Clientes", type: "mc", q: "En un cliente liviano, ¿qué viaja por la red?", options: [
          { t: "HTML ya renderizado por el servidor", ok: true },
          { t: "JSON que el cliente transforma en interfaz", ok: false },
          { t: "Protobuf binario", ok: false },
        ], explain: "Liviano = server-side render = HTML. Pesado = client-side render = JSON." },
        { n: 2, topic: "SPA", type: "vf", q: "Toda SPA es un cliente pesado, pero no todo cliente pesado es una SPA.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "SPA es una técnica del cliente pesado WEB. Una app mobile nativa es cliente pesado y no es una SPA." },
        { n: 3, topic: "SEO", type: "mc", q: "El sitio necesita posicionar bien en Google. ¿Qué conviene?", options: [
          { t: "Cliente liviano / SSR o renderizado híbrido: el contenido llega como HTML", ok: true },
          { t: "SPA pura: Google ejecuta JavaScript igual", ok: false },
          { t: "Es indistinto para el SEO", ok: false },
        ], explain: "Los buscadores sí ejecutan JS, pero de forma más lenta, costosa y no garantizada (crawl budget). HTML servido se indexa mejor." },
        { n: 4, topic: "Versionado", type: "mc", q: "¿Por qué el versionado de API es más crítico con clientes instalables?", options: [
          { t: "Porque conviven múltiples versiones del cliente: el usuario puede no actualizar nunca", ok: true },
          { t: "Porque las apps mobile no soportan HTTPS", ok: false },
          { t: "Porque no se pueden usar tokens", ok: false },
        ], explain: "Estrategias: versionar la API (/v1, /v2), cambios backward-compatible (campos opcionales), hard update y actualizaciones automáticas." },
        { n: 5, topic: "Patrones", type: "mc", q: "¿Cuál es la diferencia clave entre MVC y MVP?", options: [
          { t: "En MVP la vista nunca toca al modelo: todo pasa por el Presenter, incluso la actualización de la pantalla", ok: true },
          { t: "MVP no tiene modelo", ok: false },
          { t: "MVC usa data binding bidireccional", ok: false },
        ], explain: "El data binding bidireccional es de MVVM. En MVC la vista puede consultar al modelo; en MVP, no." },
        { n: 6, topic: "Decisión", type: "open", q: "Un equipo quiere pasar su frontend a cliente pesado con una SPA, pero “no se prevén otros casos de uso más que los actuales” (visualización de resultados). ¿Es el camino indicado?", answer: "No necesariamente. La SPA se justifica cuando hay alta interactividad, múltiples clientes sobre la misma API o equipos de front y back separados trabajando en paralelo. Si el único caso de uso es la visualización de resultados y no se prevén otros clientes, el cliente pesado agrega costos sin beneficio claro: hay que construir y versionar una aplicación aparte, la primera carga es más lenta y el SEO se complica, mientras que el beneficio de escalar el cómputo de UI en el cliente es marginal con pocos usuarios. Recomendaría mantener el cliente liviano y, si la fluidez es el problema, aplicar renderizado híbrido (SSR + hidratación). Si en cambio se planea sumar una app mobile o un panel interactivo, el cliente liviano DESACOPLADO es el paso intermedio correcto: deja el contrato de la API estable y permite reemplazar la vista más adelante sin tocar el backend." },
      ]);
    },
  });
})();
