/* ============================================================
   P2 · Escalabilidad, Balanceador, Caché, CDN, API Gateway/BFF
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-escalabilidad",
    title: "Escalabilidad, Balanceo, Caché y CDN",
    tag: "📈",
    group: "Arquitectura Web II (P2)",
    resumen: "Vertical vs horizontal, LB (L4/L7, sticky, health checks), caché, CDN, API Gateway y BFF",
    keywords: ["escalabilidad", "vertical", "horizontal", "balanceador", "load balancer", "round robin", "least connections", "weighted", "sticky sessions", "l4", "l7", "health check", "cache", "cdn", "api gateway", "bff", "rate limiting", "cuello de botella", "punto unico de falla"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitectura Web II · 2º Parcial</div>
          <h1>Escalabilidad, Balanceo, Caché y CDN</h1>
          <p class="lead">Es <b>el</b> punto de arquitectura que cae siempre: “picos de tráfico”, “demoras en la respuesta”, “mucho ancho de banda consumido”, “las mismas consultas repetidas”. Cada síntoma tiene su componente.</p>
        </div>

        <h2>El problema</h2>
        <p>¿Qué pasa si un <b>único servidor</b> tiene que atender solicitudes de un número muy elevado de clientes a la
        vez? Puede convertirse en un <b>cuello de botella</b>:</p>
        <ul>
          <li>La <b>performance</b> se degrada sustancialmente (tiempos de respuesta muy elevados).</li>
          <li>La <b>disponibilidad</b> se ve afectada: si ese servidor se cae, <b>todos</b> los clientes quedan sin servicio (es un <b>punto único de falla</b>).</li>
        </ul>

        <h2>Escalabilidad vertical vs. horizontal</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Vertical (<i>scale up</i>)</th><th>Horizontal (<i>scale out</i>)</th></tr></thead>
          <tbody>
            <tr><td>En qué consiste</td><td>Agregar <b>más recursos físicos al mismo servidor</b> (memoria, disco, procesamiento)</td><td>Agregar <b>más equipos servidores</b> y distribuir la carga entre ellos</td></tr>
            <tr><td>Límite</td><td><b>Tiene un límite físico:</b> en algún punto no se puede seguir escalando esa máquina</td><td><b>Sin límite físico:</b> se pueden seguir sumando equipos</td></tr>
            <tr><td>Qué resuelve</td><td><b>Performance</b>, pero <b>NO disponibilidad</b> (sigue siendo un único punto de falla)</td><td><b>Performance y disponibilidad</b></td></tr>
            <tr><td>Costo</td><td>Hardware grande = precio no lineal; requiere downtime para ampliar</td><td>Complejidad de <b>distribuir las solicitudes</b> → necesita un <b>balanceador de cargas</b>; exige servicios <b>stateless</b></td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>La frase que hay que escribir:</b> “propongo escalamiento <b>horizontal</b>: replicar N instancias del
          servicio detrás de un <b>balanceador de cargas</b>, lo que mejora <b>performance</b> (reparte la carga) y
          <b>disponibilidad</b> (elimina el punto único de falla), a diferencia del escalamiento vertical que sólo
          mejora performance y tiene techo físico. <b>Requisito:</b> que el servicio sea <b>stateless</b>, con la sesión
          externalizada (JWT o Redis), para no depender de sticky sessions.”</p>
        </div>

        <h2>Balanceador de Cargas</h2>
        <ul>
          <li><b>Distribuye las solicitudes</b> entrantes entre múltiples servidores o instancias para optimizar el rendimiento y evitar sobrecargas. <i>(Performance)</i></li>
          <li>Si un servidor falla, <b>redirige el tráfico automáticamente</b>. <i>(Disponibilidad)</i></li>
          <li>Permite <b>agregar o quitar nodos</b> sin afectar al usuario. <i>(Escalabilidad horizontal)</i></li>
          <li>Mantiene el <b>uso de recursos equilibrado</b> entre todos los nodos. <i>(Performance)</i></li>
        </ul>
        ${APP.uml(`graph LR
    U1["👤"] --> LB
    U2["👤"] --> LB
    U3["👤"] --> LB
    LB["⚖️ Balanceador<br/>(health checks)"] --> I1["Instancia 1"]
    LB --> I2["Instancia 2"]
    LB --> I3["Instancia 3 ❌ caída<br/>(sale de rotación)"]
    I1 --> DB[("BD")]
    I2 --> DB
    I1 -.->|"sesión externalizada"| R[("Redis")]
    I2 -.-> R
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Escalado horizontal con balanceador")}

        <h3>Algoritmos</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Algoritmo</th><th>Cómo decide</th></tr></thead>
          <tbody>
            <tr><td><b>Round Robin</b></td><td>Distribuye las solicitudes <b>secuencialmente</b> entre los servidores disponibles</td></tr>
            <tr><td><b>Least Connections</b></td><td>Prioriza al servidor con <b>menos conexiones activas</b> en ese momento</td></tr>
            <tr><td><b>Weighted Load</b></td><td>Asigna <b>proporcionalmente más</b> solicitudes al servidor con <b>mayor capacidad</b></td></tr>
            <tr><td><b>Sticky Sessions</b></td><td><b>No es un algoritmo de distribución</b>, sino una <b>política adicional</b>: fuerza que las solicitudes de un mismo cliente vayan <b>siempre al mismo servidor</b></td></tr>
          </tbody>
        </table></div>

        <h3>Niveles: L4 vs L7</h3>
        <p>El modelo OSI describe la comunicación en capas; dos son clave para un balanceador:</p>
        <ul>
          <li><b>L4 (Transporte):</b> balancea en base a <b>IP y puerto</b>, a nivel de conexión TCP/UDP. <b>No mira el contenido</b> de la solicitud → <b>más rápido pero con menos criterio</b>. Ej.: AWS Network Load Balancer.</li>
          <li><b>L7 (Aplicación):</b> <b>entiende el protocolo</b> (HTTP/HTTPS). Puede decidir según la <b>URL, los headers o las cookies</b> — por ejemplo enrutar <code>/api</code> a un grupo y <code>/admin</code> a otro. Ej.: AWS Application Load Balancer.</li>
        </ul>
        <p class="mini"><b>En la práctica:</b> L4 cuando alcanza con distribuir conexiones; <b>L7 cuando se necesita
        enrutar según el contenido</b> de la solicitud (o hacer de API Gateway, o un canary por porcentaje).</p>

        <h3>Sticky Sessions</h3>
        <div class="callout warn">
          <p>El balanceador dirige <b>siempre</b> las solicitudes de un mismo cliente al mismo servidor (por cookie o IP de
          origen). <b>¿Por qué sería necesario?</b> Si el servidor guarda el <b>estado de sesión en memoria local</b> —y no
          en un almacenamiento compartido— el usuario necesita volver siempre al mismo nodo.</p>
          <p><b>Problema:</b> <b>atenta contra la escalabilidad horizontal y la disponibilidad</b>. Si ese servidor cae,
          esos usuarios <b>pierden igual su sesión</b>; y la carga se reparte mal.</p>
          <p><b>Alternativa recomendada:</b> diseñar servicios <b>stateless</b> y <b>externalizar el estado de sesión</b>
          (Redis, base de datos, <a class="inline" data-go="p2-sesiones">JWT</a>).</p>
        </div>

        <h3>Health Checks</h3>
        <p>El balanceador debe saber en todo momento <b>qué nodos están efectivamente disponibles</b>, para no enviarles
        tráfico si están caídos o degradados.</p>
        <ul>
          <li><b>Activo:</b> consulta periódicamente un endpoint (ej. <code>GET /health</code>) y <b>saca al nodo de la rotación</b> si no responde a tiempo.</li>
          <li><b>Pasivo:</b> observa las <b>respuestas reales</b> del tráfico (timeouts, errores 5xx) y retira al nodo si supera un <b>umbral de fallos</b>.</li>
        </ul>
        <p class="mini">Sostiene la <b>disponibilidad</b> y la <b>tolerancia a fallos</b> prometidas por el escalado
        horizontal. Implementaciones: NGINX, HAProxy, Traefik; AWS ELB (ALB=L7, NLB=L4), Google/Azure LB; Cloudflare LB y
        DNS Round Robin a nivel global.</p>

        <h2>Caché</h2>
        <p>Almacena <b>resultados de operaciones o datos de uso frecuente</b> para reducir el tiempo de acceso y la carga
        sobre los servicios de origen.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Qué guarda</th><th>Atributo que mejora</th></tr></thead>
          <tbody>
            <tr><td><b>Caché de aplicación</b></td><td>Datos calculados; ej. consultas SQL costosas</td><td><b>Performance</b></td></tr>
            <tr><td><b>Caché de contenido</b></td><td>Recursos estáticos: imágenes, CSS, JS</td><td><b>Uso de recursos</b></td></tr>
            <tr><td><b>Caché de navegador</b></td><td>Recursos en el cliente final</td><td><b>Tiempo de respuesta</b></td></tr>
          </tbody>
        </table></div>
        <p><b>¿Dónde vive?</b> <b>Privada</b> (en el navegador del usuario), <b>compartida</b> (un proxy) y
        <b>compartida y administrada</b> (una <b>CDN</b>) — <b>siempre con un tiempo de expiración definido</b>.</p>
        <div class="callout key">
          <div class="callout-title">🔑 Caché HTTP</div>
          <ul>
            <li>Almacena una <b>respuesta asociada a una solicitud</b> y reutiliza esa respuesta para solicitudes posteriores.</li>
            <li><b>Cuanto más cerca</b> están el cliente y la caché, <b>más rápida</b> la respuesta (el ejemplo típico es el propio navegador).</li>
            <li>El <b>servidor de origen no necesita procesar</b> la solicitud: no parsea, no enruta, no consulta la base ni renderiza la plantilla. <b>Eso reduce su carga.</b></li>
            <li>La misma URL puede tener <b>distintas respuestas cacheadas</b> según el valor de un header como <code>Accept-Language</code> (eso es <code>Vary</code>).</li>
          </ul>
          <p class="mini">Headers a nombrar: <code>Cache-Control: max-age</code>, <code>ETag</code> /
          <code>If-None-Match</code> (revalidación → <b>304 Not Modified</b>), <code>Vary</code>.</p>
        </div>
        <p><b>Otras implementaciones:</b> <b>caché de Hibernate</b> (en la capa de persistencia: evita volver a consultar
        la base por entidades ya cargadas → ver <a class="inline" data-go="p2-orm">caché de 1º y 2º nivel</a>);
        <b>caché distribuida</b> (Redis, Memcached) compartida entre múltiples instancias del mismo servicio; caché de
        queries del ORM, de fragmentos de página y de resultados de APIs externas.</p>
        <div class="callout warn">
          <p><b>El costo de la caché:</b> datos potencialmente <b>desactualizados</b> (hay que definir TTL e invalidación)
          y cuidado con <b>cachear datos sensibles</b> en cachés compartidas.</p>
        </div>

        <h2>CDN (Content Delivery Network)</h2>
        <ul>
          <li>Red de <b>servidores distribuidos geográficamente</b> que trabajan juntos para ofrecer una <b>entrega rápida de contenido</b>.</li>
          <li>Permite la transferencia rápida de los activos necesarios para cargar contenido: <b>HTML, JS, CSS, imágenes y video</b>.</li>
          <li>Puede ayudar a <b>proteger contra ataques comunes como DDoS</b>.</li>
        </ul>
        <p><b>Ventajas:</b> mejora de los <b>tiempos de carga</b>; <b>reducción de los costos de ancho de banda</b>;
        aumento de la <b>disponibilidad</b> de contenido y <b>redundancia</b>; mayor <b>seguridad</b>.</p>
        <div class="callout key">
          <div class="callout-title">🎯 Respuesta modelo (pregunta de final, textual)</div>
          <p>“<i>Los contenidos multimedia se almacenan en el servidor del propio sistema. En alta demanda aumentan los
          tiempos de carga y se satura el ancho de banda.</i>”</p>
          <p><b>Respuesta:</b> mover los archivos a un <b>object storage</b> (S3) y servirlos a través de una <b>CDN</b>.
          El backend deja de transferir bytes: sólo entrega la <b>URL</b> del recurso, y la CDN lo sirve desde el
          <b>nodo más cercano</b> al usuario. Atributos favorecidos: <b>performance</b> (menor latencia, contenido cerca
          del usuario), <b>escalabilidad</b> (absorbe picos globales sin tocar el origen), <b>disponibilidad</b> (nodos
          distribuidos y redundancia) y de paso <b>seguridad</b> (mitiga DDoS) y <b>costo</b> (menos egress del origen).
          <b>Nunca</b> guardar imágenes o videos dentro de la base de datos.</p>
        </div>

        <h2>API Gateway y BFF</h2>
        <div class="grid-2">
          <div class="card">
            <h3>API Gateway</h3>
            <ul>
              <li><b>Único punto de entrada</b> que recibe todas las solicitudes de los clientes y las <b>enruta</b> hacia los microservicios correspondientes.</li>
              <li><b>Centraliza responsabilidades transversales:</b> autenticación, <b>rate limiting</b>, logging, terminación TLS.</li>
              <li>Puede actuar también como <b>balanceador de cargas de capa 7</b>.</li>
            </ul>
            <p class="mini">Sin gateway, <b>cada cliente debería conocer y llamar directamente a cada microservicio</b>,
            acoplándose a la <b>topología interna</b> del backend. Es, en el fondo, un <b>Facade</b>.</p>
            <p><b>⚠️</b> Es un <b>punto único de entrada</b>: hay que replicarlo para que no sea punto único de falla.</p>
          </div>
          <div class="card">
            <h3>BFF (Backend For Frontend)</h3>
            <ul>
              <li><b>Variante del API Gateway:</b> en vez de una única puerta genérica, se crea <b>una capa de backend dedicada por cada tipo de cliente</b> (BFF Web, BFF Mobile).</li>
              <li>Cada BFF <b>agrega y adapta</b> las respuestas de los microservicios <b>al formato que ese cliente necesita</b>.</li>
            </ul>
            <p class="mini"><b>Relación con el cliente liviano desacoplado:</b> permite que cada cliente tenga el contrato
            que le conviene, <b>sin obligar a cambiar los contratos internos y estables</b> de los microservicios de
            dominio.</p>
          </div>
        </div>

        <h2>Síntoma → componente (tabla de diagnóstico)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Lo que dice el enunciado</th><th>Respuesta</th><th>Atributos favorecidos</th></tr></thead>
          <tbody>
            <tr><td>“picos de tráfico”, “el tráfico se multiplica por 10 en el Hot Sale”</td><td>Escalado <b>horizontal</b> + <b>balanceador</b> (+ autoescalado) y <b>colas</b> para lo diferible</td><td>Escalabilidad, Disponibilidad, Performance</td></tr>
            <tr><td>“se cae el servidor y queda todo sin servicio”</td><td>Varias instancias + LB con <b>health checks</b>; eliminar el <b>punto único de falla</b></td><td>Disponibilidad, Tolerancia a fallos</td></tr>
            <tr><td>“se consulta mucho lo mismo”, “accesos concurrentes repetidos a la base”</td><td><b>Caché</b> (Redis / caché de aplicación o HTTP) con TTL; réplicas de lectura</td><td>Performance, Uso de recursos</td></tr>
            <tr><td>“las imágenes/videos tardan y consumen ancho de banda”</td><td><b>Object storage + CDN</b>; el backend sólo entrega la URL</td><td>Performance, Escalabilidad, Costo</td></tr>
            <tr><td>“los componentes escalan bien pero igual hay latencia”</td><td>Buscar el <b>cuello de botella compartido</b>: la <b>base de datos</b> (réplicas de lectura, índices, caché) o un servicio externo</td><td>Performance</td></tr>
            <tr><td>“cada cliente llama a cada microservicio”</td><td><b>API Gateway</b> (o <b>BFF</b> por tipo de cliente)</td><td>Mantenibilidad, Seguridad</td></tr>
            <tr><td>“hay que repartir tráfico a una versión nueva”</td><td>LB <b>L7</b> / feature flags → <b>canary</b></td><td>Confiabilidad del despliegue</td></tr>
          </tbody>
        </table></div>

        <h2>Ejercicio</h2>
        <div id="p2eQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2eQuiz"), [
        { n: 1, topic: "Escalabilidad", type: "mc", q: "¿Por qué el escalado vertical NO resuelve la disponibilidad?", options: [
          { t: "Porque sigue habiendo un único servidor: un punto único de falla", ok: true },
          { t: "Porque no mejora la performance", ok: false },
          { t: "Porque necesita un balanceador", ok: false },
        ], explain: "Vertical: mejora performance, tiene límite físico y no elimina el punto único de falla. Horizontal: mejora ambas pero exige balanceador y servicios stateless." },
        { n: 2, topic: "Balanceador", type: "mc", q: "Hay que enrutar <code>/api</code> a un grupo de servidores y <code>/admin</code> a otro. ¿Qué nivel de balanceador necesitás?", options: [
          { t: "L7 (aplicación): entiende HTTP y decide por URL, headers o cookies", ok: true },
          { t: "L4 (transporte): es más rápido", ok: false },
          { t: "Cualquiera: es indistinto", ok: false },
        ], explain: "L4 sólo ve IP y puerto. Para decidir por contenido hace falta L7 (AWS ALB, NGINX)." },
        { n: 3, topic: "Sticky", type: "vf", q: "Las sticky sessions son la mejor solución para escalar un servicio con sesión en memoria.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Son un parche: atentan contra la escalabilidad horizontal y la disponibilidad (si el nodo cae, igual se pierde la sesión). La alternativa recomendada es stateless + sesión externalizada." },
        { n: 4, topic: "CDN", type: "mc", q: "“Aumentó el ancho de banda consumido por la descarga de imágenes desde nuestros servidores”. ¿Qué propones?", options: [
          { t: "Object storage + CDN; el backend sólo entrega la URL", ok: true },
          { t: "Guardar las imágenes en la base de datos para centralizar", ok: false },
          { t: "Escalar verticalmente el servidor web", ok: false },
        ], explain: "La CDN sirve el contenido desde el nodo más cercano, mejora tiempos de carga, reduce costos de ancho de banda, agrega redundancia y mitiga DDoS." },
        { n: 5, topic: "Health checks", type: "mc", q: "La diferencia entre health check activo y pasivo es…", options: [
          { t: "El activo consulta periódicamente un endpoint; el pasivo observa las respuestas reales del tráfico", ok: true },
          { t: "El activo lo hace el servidor y el pasivo el cliente", ok: false },
          { t: "Ninguna, son sinónimos", ok: false },
        ], explain: "Activo: GET /health periódico y saca de rotación. Pasivo: detecta timeouts y 5xx reales y retira el nodo al superar un umbral." },
        { n: 6, topic: "Integrador", type: "open", q: "PetGuardian registra picos cuando miles de comederos se activan al mismo horario: demoras en el servicio de eventos y carga alta del servidor. ¿Qué estrategia y qué componentes propones? ¿Qué atributos se favorecen?", answer: "Estrategia: escalamiento HORIZONTAL del servicio de eventos (N instancias detrás de un balanceador L7 con health checks y autoescalado por métricas), junto con desacople temporal: los comandos de activación de rutinas se publican en una COLA/broker y los procesan consumidores que se escalan según el largo de la cola, amortiguando el pico en lugar de propagarlo. El servicio responde 202 Accepted de inmediato. Complemento: caché para las consultas repetidas de configuración de rutinas, y el estado de sesión externalizado (JWT/Redis) para que las instancias sean descartables y no hagan falta sticky sessions. Atributos favorecidos y cómo se garantizan: ESCALABILIDAD (se suman instancias y consumidores sin límite físico; la cola absorbe los picos), DISPONIBILIDAD (se elimina el punto único de falla; el LB saca de rotación los nodos caídos; si un consumidor muere, el mensaje se reentrega), PERFORMANCE (carga repartida, respuesta inmediata al cliente, menos accesos a la base por la caché) y TOLERANCIA A FALLOS (reintentos, DLQ e idempotencia en los consumidores, para que un mensaje duplicado no dispense alimento dos veces)." },
      ]);
    },
  });
})();
