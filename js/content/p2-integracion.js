/* ============================================================
   P2 · Integración de Sistemas: APIs, colas, BD compartida, Kafka
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-integracion",
    title: "Integración de Sistemas",
    tag: "🔌",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "REST/SOAP/gRPC/GraphQL, colas, BD compartida, Kafka y resiliencia",
    keywords: ["integracion", "api", "rest", "soap", "wsdl", "grpc", "protobuf", "graphql", "hasura", "cola de mensajes", "rabbitmq", "sqs", "dlq", "ack", "idempotencia", "at least once", "kafka", "topico", "particion", "offset", "consumer group", "replay", "base de datos compartida", "timeout", "retry", "circuit breaker", "fallback"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Integración de Sistemas</h1>
          <p class="lead">Las 4 estrategias (API, cola, BD compartida, Kafka) y —lo que realmente evalúan— qué pasa en los <b>casos borde</b>: <b>B caído</b>, <b>B lento</b>, <b>mensajes duplicados</b>.</p>
        </div>

        <h2>¿Qué es integrar y por qué?</h2>
        <div class="callout key">
          <p><b>Integrar es lograr que dos sistemas se hablen</b>: establecer una comunicación y <b>compartir datos y
          funcionalidades</b> entre dos o más sistemas, <b>sin copiar todo de uno al otro</b>. Abre el universo “cerrado”
          con el que se pensó cada sistema y <b>evita duplicar lógica</b>.</p>
          <p><b>Para integrar hay que acordar un CONTRATO:</b> qué se pide, en qué formato y qué se responde, además de
          cómo viaja el mensaje.</p>
          <p><b>Por qué:</b> los sistemas no viven aislados · ya existen lógicas resueltas (no reescribir lo que otro hace
          bien) · <b>consultar, no copiar</b> (los datos se consultan en su origen) · necesidades del negocio (cobrar,
          enviar, notificar, medir) · <b>marco legal</b> (ej. factura electrónica contra <b>ARCA/AFIP</b>).</p>
        </div>

        <h2>Sincrónica o asincrónica</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Sincrónica — “llamada telefónica”</h3>
            <ul>
              <li>A <b>espera la respuesta</b> de B antes de seguir.</li>
              <li><b>Ambos deben estar disponibles al mismo tiempo</b> (acoplamiento temporal).</li>
              <li><b>Si B no atiende, A falla.</b></li>
            </ul>
          </div>
          <div class="card">
            <h3>Asincrónica — “mensaje de WhatsApp”</h3>
            <ul>
              <li>A <b>deja el mensaje y sigue</b> con su trabajo.</li>
              <li>B lo procesa cuando puede; <b>no hace falta que estén al mismo tiempo</b>.</li>
              <li>La respuesta, si la hay, <b>llega después</b> (webhook, consulta, notificación).</li>
            </ul>
          </div>
        </div>
        <p class="mini">“La decisión depende <b>exclusivamente de las necesidades del negocio y de las restricciones
        técnicas</b>: <b>no hay una opción mejor en general</b>.”</p>

        <h2>1 · APIs</h2>
        <p><b>Web Service vs API:</b> un web service es “un componente de software <b>interoperable de máquina a
        máquina</b>, alojado en una ubicación direccionable de red”, con una interfaz que <b>oculta los detalles de
        implementación</b>. Una API es “un conjunto de herramientas, definiciones y protocolos para diseñar e integrar
        aplicaciones”. <b>Un web service es una API que se ofrece a través de la red.</b></p>
        <p><b>Tipos de API:</b> por <b>arquitectura</b> (local, web, programa/RPC) · por <b>alcance</b> (<b>pública</b>
        abierta a cualquier desarrollador, <b>partner</b> para terceros con acuerdo, <b>privada</b> de uso interno) ·
        por <b>tecnología</b> (REST, SOAP, gRPC, GraphQL).</p>

        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>REST</th><th>SOAP</th><th>GraphQL</th><th>gRPC</th></tr></thead>
          <tbody>
            <tr><td><b>Idea</b></td><td>Recursos con URI + verbos HTTP (GET/POST/PUT/DELETE); <b>stateless</b></td><td>Protocolo de mensajes <b>XML</b> en un <i>envelope</i> (Header opcional + <b>Body obligatorio</b> + Fault)</td><td>Un <b>único endpoint</b>; el cliente <b>pide exactamente lo que necesita</b></td><td><b>RPC</b>: llamar a otro servicio se ve como <b>invocar una función local</b></td></tr>
            <tr><td><b>Modo</b></td><td>Sincrónico, HTTP</td><td>Sinc./asinc.; HTTP, <b>FTP, SMTP</b>, TCP, colas</td><td>Sinc./asinc.; HTTP, AMQP, MQTT</td><td>Sinc./asinc.; <b>HTTP/2</b></td></tr>
            <tr><td><b>Contrato</b></td><td><b>OpenAPI</b> (Swagger), RAML</td><td><b>WSDL + XSD</b> (URL que termina en <code>?wsdl</code>)</td><td><b>Esquema tipado</b> (SDL), autodocumentado</td><td>Archivo <b>.proto</b> (Protocol Buffers)</td></tr>
            <tr><td><b>Formato</b></td><td>JSON (o XML)</td><td><b>XML</b></td><td>JSON</td><td><b>Binario compacto</b></td></tr>
            <tr><td><b>Acoplamiento</b></td><td>Bajo</td><td><b>Alto</b></td><td>Medio</td><td>Medio</td></tr>
            <tr><td><b>Seguridad</b></td><td>HTTPS (+ OAuth2/JWT)</td><td><b>WS-Security</b></td><td>HTTPS</td><td>TLS</td></tr>
            <tr><td><b>Usar para…</b></td><td><b>APIs públicas simples</b>, web y mobile</td><td><b>Entornos empresariales</b> con contratos formales (banca, seguros, organismos: ARCA)</td><td>Cuando <b>los clientes necesitan flexibilidad</b></td><td><b>Comunicación interna entre servicios</b>, alto rendimiento</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🎯 Respuesta modelo: “terceros necesitan flexibilidad para definir qué datos consultar y combinarlos, minimizando llamadas”</div>
          <p>→ <b>GraphQL</b>. Con REST, cada necesidad distinta implica varias peticiones (<code>/mascotas</code>,
          <code>/historial</code>, <code>/lecturas</code>) o endpoints a medida por consumidor; con GraphQL hay
          <b>un único endpoint</b> y el cliente <b>pide exactamente lo que necesita y nada más</b>, con un
          <b>esquema tipado y autodocumentado</b>. Eso <b>minimiza la cantidad de llamadas</b> (una sola consulta trae el
          grafo completo), <b>reduce el over-fetching</b> y evita acoplar los contratos internos a cada tercero.
          <b>Riesgos a mencionar</b> (demuestra criterio): consultas muy costosas o anidadas → se mitiga con
          <b>límites de profundidad/complejidad, paginación, rate limiting y caché</b>; y como el caché HTTP por URL no
          aplica igual, la caché va del lado del servidor.</p>
          <p><b>Y la segunda parte —“repiten las mismas consultas en períodos cortos, alto volumen concurrente contra la
          base principal”</b> → <b>caché</b> (Redis / caché de consultas con TTL) + <b>réplicas de lectura</b>, y para
          analítica, mover esos datos a un <b>almacén analítico</b> (columnar) o un <b>read model</b> desnormalizado
          alimentado por eventos. Atributos: <b>performance</b>, <b>escalabilidad</b> y <b>disponibilidad</b> (se protege
          la base transaccional).</p>
        </div>

        <h3>Los 3 escenarios de una integración por API (caso Tienda ↔ Pasarela)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Escenario</th><th>Qué se observa</th><th>Patrones</th></tr></thead>
          <tbody>
            <tr><td><b>1 · Happy path</b></td><td>A pide y espera; la respuesta llega <b>por el mismo canal</b> y A decide en el momento. Flujo simple de entender y depurar. <b>Costo oculto:</b> A depende de que B esté disponible <b>justo ahora</b> → <b>acoplamiento temporal</b>.</td><td>—</td></tr>
            <tr><td><b>2 · B no disponible</b></td><td>La venta depende de B: <b>el cliente ve el error en el momento</b>. <b>Reintentar sin control empeora el problema</b> (multiplica la carga sobre B). Hace falta <b>cortar rápido (fail fast)</b> y <b>degradar con elegancia</b>.</td><td><b>Reintentos con backoff</b>, <b>circuit breaker</b> (dejar de llamar un rato) y <b>fallback</b> (dejar el pedido “pendiente de pago”)</td></tr>
            <tr><td><b>3 · B muy lenta</b></td><td><b>Sin timeout, A espera indefinidamente:</b> se agotan hilos y conexiones, y <b>la lentitud se contagia</b>. <b>Con timeout, A queda en incertidumbre:</b> B puede haber procesado igual (¡y cobrado!).</td><td><b>Timeout siempre definido</b> + <b>clave de idempotencia</b> para consultar o reintentar sin duplicar</td></tr>
          </tbody>
        </table></div>

        <h3>⭐ Resiliencia en integraciones sincrónicas (tabla para memorizar)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Problema</th><th>Patrón</th><th>Qué hace</th></tr></thead>
          <tbody>
            <tr><td>B no responde nunca</td><td><b>Timeout</b></td><td>Define cuánto estamos dispuestos a esperar; <b>evita agotar hilos y conexiones</b></td></tr>
            <tr><td>Falla transitoria</td><td><b>Reintentos con backoff</b></td><td>Reintenta <b>espaciando</b> cada vez más los intentos (con algo de azar) para <b>no saturar</b> a B</td></tr>
            <tr><td>B sigue caída</td><td><b>Circuit breaker</b></td><td>Tras varios fallos <b>“abre el circuito”</b>: deja de llamar un tiempo y <b>falla rápido</b></td></tr>
            <tr><td>Reintento = ¿doble cobro?</td><td><b>Idempotencia</b></td><td><b>Una clave por operación:</b> repetirla produce el mismo resultado <b>una sola vez</b></td></tr>
            <tr><td>Aun así hay que responder</td><td><b>Fallback</b></td><td>Alternativa <b>degradada</b>: dejar el pedido “pendiente de pago”, usar datos en caché</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Colas de mensajes</h2>
        <p>“Una cola de mensajes <b>desacopla a A y B en el tiempo</b>: ya no necesitan estar disponibles al mismo
        momento.” A deja el pedido en la cola y <b>sigue vendiendo</b>; B lo toma cuando puede.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Pieza</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Mensaje</b></td><td>Un dato pequeño: una solicitud, un aviso o un pedido a procesar</td></tr>
            <tr><td><b>Productor</b></td><td>El componente que <b>agrega</b> un mensaje a la cola</td></tr>
            <tr><td><b>Cola</b></td><td>La estructura donde <b>esperan</b> los mensajes, <b>en orden (FIFO)</b>, hasta que alguien los procesa. <b>Cada mensaje lo procesa un solo consumidor</b></td></tr>
            <tr><td><b>Consumidor</b></td><td>El componente que <b>toma</b> el mensaje y hace algo con él</td></tr>
            <tr><td><b>Broker</b></td><td>El software que <b>aloja y administra</b> las colas (RabbitMQ, SQS). <b>La cola es la estructura; el broker es quien la hace funcionar</b></td></tr>
          </tbody>
        </table></div>

        <h3>Los 4 casos borde (así se explican en el parcial)</h3>
        <div class="grid-2">
          <div class="card">
            <h3>1 · B no está disponible</h3>
            <p>B está caída y A <b>publica igual</b>: la cola <b>acepta</b> el mensaje y el cliente ve “compra
            confirmada”. Los mensajes <b>se acumulan</b> y A <b>no se entera</b> de la caída. Cuando B vuelve, toma el más
            antiguo y <b>drena la cola en orden</b>. <b>No se perdió nada:</b> la factura sale más tarde, pero sale — es
            <b>consistencia eventual</b>.</p>
          </div>
          <div class="card">
            <h3>2 · B es lenta o hay un pico</h3>
            <p>A publica 10 msg/s, B procesa 2/s: la cola crece (<b>backlog</b>) y <b>amortigua el pico</b>. A no se
            frena. Se <b>escalan consumidores</b> (<i>competing consumers</i>): cada mensaje lo toma <b>sólo una</b>
            instancia. <b>⚠️ Con varios consumidores el orden ya no es estricto.</b></p>
          </div>
          <div class="card">
            <h3>3 · B se cae a mitad de camino</h3>
            <p>El mensaje <b>no se borra al entregarlo, sino al recibir el ACK</b>. Si B cae antes de confirmar, pasado el
            <b>visibility timeout</b> la cola <b>reentrega</b>: no se pierde ningún pedido. <b>Pero B pudo haber facturado
            antes de caerse</b> → el mensaje puede llegar <b>dos veces</b>. <b>Consecuencia: el consumidor debe ser
            IDEMPOTENTE.</b></p>
          </div>
          <div class="card">
            <h3>4 · El mensaje que nunca se puede procesar</h3>
            <p><b>Mensaje venenoso:</b> el pedido tiene un CUIT inválido y falla siempre. <b>Reintentos limitados</b> y
            luego se deriva a una <b>DLQ (Dead Letter Queue)</b>: una cola común configurada como destino de los mensajes
            que no se pudieron procesar. <b>Aparta el mensaje roto para que no frene a los demás</b> ni se reintente para
            siempre, <b>y no se pierde</b>. Se alerta al equipo, se inspecciona la causa y se <b>reprocesa o descarta</b>.</p>
            <p class="mini">Un mensaje llega a la DLQ si: superó el máximo de reintentos, tiene formato inválido, venció su
            <b>TTL</b> o fue rechazado por el consumidor.</p>
          </div>
        </div>

        <h3>Garantías de entrega e idempotencia ⭐</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Garantía</th><th>Qué significa</th><th>Cuándo</th></tr></thead>
          <tbody>
            <tr><td><b>At-most-once</b> (a lo sumo una vez)</td><td><b>Puede perderse</b>, nunca se duplica</td><td>Métricas poco críticas</td></tr>
            <tr><td><b>At-least-once</b> (al menos una vez)</td><td><b>No se pierde, pero puede llegar duplicado</b></td><td><b>Lo más habitual:</b> exige consumidores <b>idempotentes</b></td></tr>
            <tr><td><b>Exactly-once</b> (exactamente una vez)</td><td>Ideal, pero <b>difícil y costoso</b> de lograr</td><td>En la práctica: <b>at-least-once + deduplicación</b></td></tr>
          </tbody>
        </table></div>
        <p><b>Idempotencia en acción:</b> B <b>guarda el ID de cada mensaje procesado</b>. Si vuelve a llegar, lo reconoce,
        <b>no repite el efecto</b> y <b>confirma igual</b>.</p>

        <h3>Cola o topic</h3>
        <div class="callout key">
          <p><b>Cola (punto a punto):</b> un mensaje lo recibe <b>un solo consumidor</b>. Ej.: “emitir factura” es una
          <b>orden</b>: la tiene que hacer alguien, <b>una vez</b>.</p>
          <p><b>Topic (pub/sub):</b> un mensaje lo reciben <b>todos los suscriptores</b>. Ej.: “pedido creado” es un
          <b>evento</b>: varios sistemas reaccionan de forma independiente.</p>
          <p><b>Regla práctica: ORDEN → cola (una sola vez); EVENTO → topic (varios interesados).</b></p>
        </div>
        <p><b>Qué hay que decidir y monitorear al usar colas:</b> <b>disponibilidad del broker</b> (si la cola cae, caen
        las integraciones → mensajes <b>persistentes</b> y broker <b>replicado</b>); <b>velocidad de procesamiento</b>
        (vigilar el <b>backlog</b> y escalar consumidores); <b>confirmación</b> (ACK, reintentos limitados, DLQ);
        el mensaje <b>es un contrato</b> (hay que diseñarlo y <b>versionarlo</b>); <b>orden e idempotencia</b>.
        <b>Qué monitorear:</b> <b>tamaño de la cola</b>, <b>antigüedad del mensaje más viejo</b> y <b>cantidad de mensajes
        en la DLQ</b>.</p>
        <div class="callout tip">
          <p><b>Cuándo cola y cuándo API:</b> usá <b>cola</b> cuando <b>no necesitás la respuesta ya</b>, hay picos, B
          puede estar caída o el trabajo es pesado. Usá <b>API</b> cuando <b>necesitás la respuesta inmediata para
          seguir</b> (ej.: validar la tarjeta antes de confirmar).</p>
        </div>

        <h2>3 · Base de datos compartida</h2>
        <p>Dos sistemas, una misma base: <b>no se llaman entre sí, se comunican a través de los datos</b> que leen y
        escriben. <b>El “contrato” entre A y B es el esquema de las tablas.</b></p>
        <div class="grid-2">
          <div class="card">
            <h3>✅ A favor</h3>
            <ul>
              <li><b>Simple:</b> no hay que construir ni mantener una API.</li>
              <li>Los datos están <b>siempre consistentes</b> (una sola fuente).</li>
              <li><b>Consultas y reportes cruzados con un simple JOIN.</b></li>
            </ul>
          </div>
          <div class="card">
            <h3>⚠️ En contra</h3>
            <ul>
              <li><b>Acoplamiento fuerte:</b> ambos dependen del mismo esquema.</li>
              <li><b>Un solo punto de falla y de contención</b> (bloqueos).</li>
              <li><b>Cada cambio de tabla puede romper al otro sistema.</b></li>
            </ul>
          </div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Escenario</th><th>Qué pasa</th></tr></thead>
          <tbody>
            <tr><td><b>Happy path</b></td><td>A escribe y B lee la misma tabla: <b>no hay mensajes ni endpoints</b>. B se entera <b>consultando (polling)</b>: <b>no hay aviso inmediato</b>. La transacción de la base garantiza consistencia.</td></tr>
            <tr><td><b>La BD no está disponible</b></td><td><b>Un único punto de falla para ambos:</b> A no puede vender y B tampoco puede preparar envíos. <b>No hay amortiguación</b> (nadie guarda el trabajo pendiente). A diferencia de la cola, <b>no se desacoplan en disponibilidad</b>.</td></tr>
            <tr><td><b>B muy lento (bloqueos)</b></td><td>Un reporte pesado de B <b>toma bloqueos</b> y compite por los mismos recursos: <b>la latencia de B se convierte en latencia de A</b> (lock wait timeout en la venta). <b>Contención.</b> Se mitiga con réplicas de lectura, pero <b>el acoplamiento sigue</b>.</td></tr>
            <tr><td><b>Cambio de esquema</b></td><td>Tienda renombra <code>stock.cantidad</code> → <code>stock.unidades</code> y <b>B se rompe en producción sin haber cambiado nada</b>. El esquema es un <b>contrato implícito</b> que nadie versionó. Con una API, B seguiría usando la versión anterior del contrato.</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Criterio profesional:</b> “es la estrategia de <b>menor esfuerzo inicial y mayor costo de evolución</b>”.
          <b>Puede ser razonable</b> si los sistemas son del mismo equipo y se despliegan juntos, si es un <b>legado</b> y
          no se puede construir otra interfaz, si se necesita <b>consistencia fuerte</b> y reportes cruzados simples, o si
          la carga es baja. <b>Evitala</b> con equipos distintos y ciclos de vida diferentes, si querés escalar/desplegar
          por separado, si hace falta <b>tolerancia a fallas</b> entre sistemas o si se busca una arquitectura de
          <b>servicios autónomos</b>.</p>
          <p class="mini"><b>Moraleja de la cátedra:</b> “la BD compartida <b>expone detalles internos (tablas) como si
          fueran una interfaz pública</b>”.</p>
        </div>

        <h2>4 · Apache Kafka</h2>
        <div class="callout key">
          <p><b>Idea clave:</b> “en Kafka <b>el mensaje no se borra al leerlo</b>. Muchos consumidores pueden leer los
          mismos eventos, <b>a su ritmo y cuantas veces quieran</b>.” En una cola tradicional, cuando alguien consume el
          mensaje, <b>desaparece</b>; en Kafka los eventos <b>se conservan</b> y <b>cada consumidor recuerda hasta dónde
          leyó</b> (su <b>offset</b>).</p>
          <p>Nació en <b>LinkedIn (2011)</b>, proyecto Apache en 2012. Es una <b>plataforma distribuida de streaming de
          eventos</b>: guarda, ordena y distribuye eventos. “En lugar de decir <b>‘hacé X’ (comando)</b>, el sistema dice
          <b>‘pasó X’ (evento)</b>: quien necesite saberlo, lo lee.”</p>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Tópico</b></td><td>La <b>categoría</b> de eventos (como una carpeta): <code>pedido_creado</code></td></tr>
            <tr><td><b>Partición</b></td><td>Un <b>tramo ordenado</b> del tópico; permite <b>repartir la carga</b></td></tr>
            <tr><td><b>Offset</b></td><td>El <b>número de posición</b> de cada evento dentro de su partición</td></tr>
            <tr><td><b>Clave</b></td><td><code>partición = hash(clave) % N</code>. Los eventos con <b>la misma clave caen siempre en la misma partición</b>. <b>Dentro de una partición el orden está garantizado; entre particiones NO hay orden global.</b> Por eso se elige como clave <b>la entidad que necesita orden</b> (el cliente, el pedido)</td></tr>
            <tr><td><b>Grupo de consumidores</b></td><td><b>Dentro de un grupo</b>, cada partición la lee <b>una sola instancia</b> (se <b>reparte</b> el trabajo). <b>Cada grupo recibe todos los eventos</b> (se <b>duplica</b>). Más instancias = más velocidad, <b>pero no más que particiones</b></td></tr>
            <tr><td><b>Retención y replay</b></td><td>Kafka conserva los eventos por un <b>tiempo o tamaño configurable</b> (ej. 7 días), <b>sin importar si fueron leídos</b>. Un consumidor que estuvo caído <b>retoma desde su offset</b>; un servicio nuevo puede <b>leer todo el historial</b> o reprocesar si hubo un error</td></tr>
            <tr><td><b>Broker y replicación</b></td><td><b>Broker</b> = cada servidor Kafka. Cada partición tiene un <b>líder</b> (atiende lecturas y escrituras) y <b>seguidoras</b> que lo copian. <b>Factor de replicación 3</b> = 1 líder + 2 seguidoras; <b>si un broker cae, una seguidora pasa a ser líder</b>. Coordinación: antes ZooKeeper, hoy <b>KRaft</b></td></tr>
            <tr><td><b>acks del productor</b></td><td><b>0</b>: no espera confirmación (puede perder eventos, latencia mínima) · <b>1</b>: espera al líder (se pierde si el líder cae antes de replicar) · <b>all</b>: espera al líder <b>y a las réplicas sincronizadas</b> (el más seguro, mayor latencia). <i>More safety, more latency</i>: un pedido requiere <code>acks=all</code>; un clic de navegación, quizá <code>acks=0</code></td></tr>
          </tbody>
        </table></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Cola de mensajes</th><th>Kafka</th></tr></thead>
          <tbody>
            <tr><td>Al consumir</td><td>El mensaje <b>se elimina</b></td><td>El evento <b>se conserva</b> (retención)</td></tr>
            <tr><td>Consumidores</td><td><b>Compiten</b> por cada mensaje</td><td><b>Cada grupo recibe todo</b></td></tr>
            <tr><td>Reprocesar</td><td><b>No es posible</b></td><td><b>Sí</b>, retrocediendo el offset</td></tr>
            <tr><td>Foco</td><td>Tareas y trabajo pendiente</td><td><b>Flujo de eventos y volumen alto</b></td></tr>
          </tbody>
        </table></div>
        <p class="mini"><b>Usos habituales:</b> eventos de negocio entre microservicios, analítica en tiempo real y
        monitoreo, registro de actividad (logs, clics), sincronizar datos entre sistemas (<b>CDC</b>), IoT y telemetría.
        <b>No reemplaza a toda cola:</b> para tareas simples un broker tradicional suele ser más sencillo; <b>Kafka brilla
        con volumen alto y múltiples lectores</b>.</p>

        <h2>⭐ Comparativa de estrategias de integración</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>API</th><th>Cola de mensajes</th><th>BD compartida</th><th>Kafka</th></tr></thead>
          <tbody>
            <tr><td><b>Comunicación</b></td><td>Sincrónica (pedido-respuesta)</td><td>Asincrónica</td><td>Indirecta por datos</td><td>Asincrónica por eventos</td></tr>
            <tr><td><b>Acoplamiento</b></td><td>Medio (contrato de API)</td><td><b>Bajo</b></td><td><b>Muy alto</b> (esquema)</td><td><b>Bajo</b></td></tr>
            <tr><td><b>Si B cae</b></td><td>A falla o debe resistir</td><td>Se acumulan mensajes</td><td><b>Caen ambos</b></td><td>Retoma del offset</td></tr>
            <tr><td><b>Si B es lento</b></td><td>A espera o corta (timeout)</td><td>Se absorbe en la cola</td><td>Contención de bloqueos</td><td>Atrasa su lectura</td></tr>
            <tr><td><b>Respuesta inmediata</b></td><td><b>Sí</b></td><td>No</td><td>Sí (consulta)</td><td>No</td></tr>
            <tr><td><b>Complejidad</b></td><td>Media</td><td>Media (idempotencia, DLQ)</td><td>Baja al inicio</td><td><b>Alta</b> (operar el clúster)</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🎯 Cómo elegir — preguntas guía</div>
          <ul>
            <li><b>¿Necesito la respuesta ya?</b> Si el usuario espera un resultado → <b>API</b> (con timeout, retry y circuit breaker).</li>
            <li><b>¿Puede esperar y no debe perderse?</b> Trabajo diferido y tolerante a caídas → <b>cola de mensajes</b>.</li>
            <li><b>¿Muchos lectores o historial?</b> Varios consumidores y volumen alto → <b>Kafka</b> (eventos).</li>
            <li><b>¿Es un mismo equipo y sistema legado?</b> Sólo entonces considerar <b>BD compartida</b>, sabiendo su costo.</li>
          </ul>
          <p><b>Una misma solución suele combinar estrategias:</b> por ejemplo, <b>API para cobrar</b> (necesito la
          respuesta) y <b>cola para facturar</b> (puede esperar).</p>
        </div>
        <div class="callout tip">
          <p><b>Para dispositivos IoT / sensores</b> (pregunta del parcial 2025): la integración no va por REST plano.
          Se usa un protocolo liviano de mensajería — <b>MQTT</b> (o AMQP) — contra un <b>broker</b>, por ser
          <b>publicación/suscripción</b>, de <b>bajo overhead</b>, tolerante a conectividad intermitente y con
          <b>QoS</b> configurable; detrás, un <b>gateway de ingesta</b> valida y publica en una cola/topic, y los
          consumidores escriben en una <b>base de series temporales</b>. Un <b>Edge Gateway</b> en el domicilio puede
          agrupar las lecturas de varios dispositivos y reintentar si se cae el enlace.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2intQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2intQuiz"), [
        { n: 1, topic: "Elección", type: "mc", q: "“La venta no debería frenarse si el servicio de facturación está caído”. ¿Qué estrategia?", options: [
          { t: "Cola de mensajes: desacopla en el tiempo y los mensajes esperan en la cola", ok: true },
          { t: "API REST sincrónica con reintentos", ok: false },
          { t: "Base de datos compartida", ok: false },
        ], explain: "Quien llama no necesita la respuesta para continuar. Con la cola, A publica, el cliente ve la compra confirmada y B drena cuando vuelve (consistencia eventual)." },
        { n: 2, topic: "Colas", type: "mc", q: "El consumidor procesa el mensaje y se cae ANTES de confirmar (ACK). ¿Qué pasa?", options: [
          { t: "La cola lo reentrega al vencer el visibility timeout → puede procesarse dos veces, por eso el consumidor debe ser idempotente", ok: true },
          { t: "El mensaje se pierde", ok: false },
          { t: "Va directo a la DLQ", ok: false },
        ], explain: "El mensaje se borra al recibir el ACK, no al entregarlo. De ahí la garantía at-least-once y la necesidad de deduplicar." },
        { n: 3, topic: "Colas", type: "mc", q: "Un pedido con CUIT inválido falla siempre, en todos los reintentos. ¿Qué corresponde?", options: [
          { t: "Reintentos limitados y derivarlo a una DLQ, alertando al equipo", ok: true },
          { t: "Reintentar indefinidamente hasta que funcione", ok: false },
          { t: "Descartarlo silenciosamente", ok: false },
        ], explain: "Es un 'mensaje venenoso'. La DLQ lo aparta para que no frene a los demás, sin perderlo, para inspeccionar y reprocesar o descartar." },
        { n: 4, topic: "BD compartida", type: "mc", q: "Tienda renombra una columna y Depósito se rompe en producción sin haber cambiado nada. ¿Qué muestra esto?", options: [
          { t: "Que el esquema es un contrato implícito que nadie versionó: la BD compartida expone detalles internos como interfaz pública", ok: true },
          { t: "Que falta un índice", ok: false },
          { t: "Que hay que usar más JOINs", ok: false },
        ], explain: "Con una API, B seguiría usando la versión anterior del contrato. Es el mayor costo de evolución de la BD compartida." },
        { n: 5, topic: "Kafka", type: "mc", q: "¿Qué garantiza el orden en Kafka?", options: [
          { t: "El orden está garantizado dentro de una partición; se elige como clave la entidad que necesita orden", ok: true },
          { t: "El orden es global en todo el tópico", ok: false },
          { t: "Kafka no garantiza ningún orden", ok: false },
        ], explain: "partición = hash(clave) % N. Misma clave → misma partición → orden garantizado. Entre particiones no hay orden global." },
        { n: 6, topic: "Kafka", type: "vf", q: "En Kafka, cuando un consumidor lee un evento, el evento se elimina del tópico.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Esa es la cola tradicional. En Kafka los eventos se conservan según la retención y cada consumidor lleva su propio offset, lo que habilita el replay." },
        { n: 7, topic: "APIs", type: "mc", q: "Contrato formal y tipado, XML, WS-Security, usado en banca y organismos públicos:", options: [
          { t: "SOAP (WSDL + XSD)", ok: true },
          { t: "REST (OpenAPI)", ok: false },
          { t: "gRPC (.proto)", ok: false },
        ], explain: "SOAP: envelope XML con Header opcional y Body obligatorio, contrato WSDL accesible en una URL que termina en ?wsdl. ARCA/AFIP es el ejemplo local." },
        { n: 8, topic: "Integrador", type: "open", q: "“¿Cómo integraría cientos de sensores y actuadores domésticos que envían lecturas periódicas simultáneamente?”", answer: "Integración ASINCRÓNICA orientada a mensajes: los dispositivos publican por MQTT (liviano, pub/sub, con QoS y tolerante a conectividad intermitente) contra un broker; opcionalmente un Edge Gateway en el domicilio agrupa las lecturas de varios dispositivos, las bufferea y reintenta si se corta el enlace. Detrás, un servicio de ingesta valida y publica en una cola/topic, y consumidores escalables (competing consumers) persisten en una base de series temporales; los módulos de IA y Estadísticas se suscriben al topic por separado, sin que el productor los conozca. Elijo asincrónico porque el dispositivo no necesita respuesta para continuar, porque la cola amortigua los picos (miles de rutinas en el mismo horario) y porque si un consumidor se cae no se pierde ninguna lectura. Los consumidores deben ser idempotentes (deduplicando por id de lectura o por dispositivo+timestamp) porque la entrega es at-least-once, con reintentos limitados y DLQ para las lecturas malformadas. Para los comandos hacia los actuadores uso una COLA por dispositivo (es una orden: la ejecuta uno, una sola vez) y para los eventos, un TOPIC. Monitoreo: tamaño de la cola, antigüedad del mensaje más viejo y mensajes en la DLQ. Si el volumen es muy alto y hay varios lectores que además necesitan reprocesar el historial, Kafka con clave = id de dispositivo (para preservar el orden por dispositivo) y retención de N días." },
      ]);
    },
  });
})();
