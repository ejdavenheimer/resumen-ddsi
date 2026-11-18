/* ============================================================
   P2 · Resumen imprimible — hojas A4 para llevar al parcial
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-imprimible",
    title: "🖨️ Resumen imprimible P2",
    tag: "🖨️",
    group: "Parcial 2 (práctica)",
    resumen: "Todo el 2º parcial en hojas A4 para llevar en papel",
    keywords: ["imprimible", "resumen", "p2", "segundo parcial", "pdf", "a4", "chuleta", "papel"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · 2º Parcial</div>
          <h1>Resumen imprimible — 2º Parcial (A4)</h1>
          <p class="lead">Modelado de datos, persistencia y arquitectura, condensados. Descargalo en PDF y llevalo impreso.</p>
        </div>
        <div class="callout key resumen-print-btn">
          <div class="callout-title">📥 Cómo guardarlo como PDF (paso a paso)</div>
          <ol style="margin:.3rem 0 .6rem">
            <li>Tocá <b>“Guardar como PDF (A4)”</b>. Se abre el diálogo de impresión — <b>es el camino normal para
            generar un PDF</b>, no vas a imprimir en papel todavía.</li>
            <li>En <b>Destino</b> (arriba a la derecha) elegí <b>“Guardar como PDF”</b>.
            <span class="mini">En Safari no hay “Destino”: usá el menú <b>PDF</b> de abajo a la izquierda →
            <b>“Guardar como PDF”</b>.</span></li>
            <li>Tamaño <b>A4</b>.</li>
            <li>Abrí <b>“Más configuraciones”</b> y activá <b>“Gráficos de fondo”</b>, si no salen los recuadros en blanco.</li>
            <li><b>Guardar.</b> Ya tenés el archivo.</li>
          </ol>
          <p><a class="btn" href="pdf/DDSI-2P-Resumen-imprimible.pdf" download>⬇️ Descargar el PDF ya armado</a></p>
          <p class="mini">Ese enlace <b>baja el archivo directo</b>, sin pasar por el diálogo de impresión. Si querés
          regenerarlo con cambios recientes, usá el botón de abajo.</p>
          <button class="btn ghost" id="p2rpPrint" type="button">🖨️ Regenerar desde el navegador (A4)</button>
          <p class="mini" style="margin-top:.6rem"><b>Ojo:</b> este botón <b>abre todos los bloques plegados</b> antes
          de generar el PDF, así que las resoluciones salen completas.</p>
        </div>

        <div class="callout tip resumen-print-btn">
          <div class="callout-title">📄 Los modelos de parcial también se descargan</div>
          <p>Cada uno tiene <b>su propio botón</b> adentro, con las <b>soluciones desplegadas</b> y los diagramas
          grandes. Abrí el que quieras y bajalo igual que este:</p>
          <p><b>Descarga directa:</b>
             <a class="btn sm" href="pdf/DDSI-2P-Modelo-1-PaqueRed.pdf" download>⬇️ Modelo 1 · PaqueRed</a>
             <a class="btn sm" href="pdf/DDSI-2P-Modelo-2-PaqueRed.pdf" download>⬇️ Modelo 2 · PaqueRed</a>
             <a class="btn sm" href="pdf/DDSI-2P-Modelo-3-VoltaRed.pdf" download>⬇️ Modelo 3 · VoltaRed</a></p>
          <p>O abrilos en el sitio: <a class="inline" data-go="p2-m1-paquered"><b>Modelo 1</b></a> ·
             <a class="inline" data-go="p2-m2-paquered-b"><b>Modelo 2</b></a> ·
             <a class="inline" data-go="p2-m2-voltared"><b>Modelo 3</b></a></p>
        </div>

        <!-- ===================== SECCIÓN 0 · ÍNDICE ===================== -->
        <section class="hoja hoja-indice">
          <span class="hoja-num">SECCIÓN 0 · ÍNDICE — ¿DÓNDE ESTÁ CADA COSA?</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:52%">Si te preguntan…</th><th>Andá a</th></tr></thead>
            <tbody>
              <tr><td><b>Cómo encarar el parcial, cómo repartir el tiempo</b></td><td><b>SECCIÓN 0 BIS</b></td></tr>
              <tr><td><b>Preguntas de parciales viejos, ya respondidas</b> (18 por tema)</td><td><b>SECCIÓN 0 TER</b></td></tr>
              <tr><td><b>Más preguntas reales con su origen</b> · tiempo real · cron · <b>especificar una API REST</b> · diagnóstico</td><td><b>SECCIÓN 0 QUATER</b></td></tr>
              <tr><td>Qué es persistencia · las 6 estrategias · Repositorio y DAO</td><td>SECCIÓN 1</td></tr>
              <tr><td>Relación, tupla, grado · PK, FK, índices · <b>cardinalidad y modalidad</b> · N:M</td><td>SECCIÓN 1</td></tr>
              <tr><td><b>¿Cumple las 3 formas normales?</b> · qué problema hay · <b>frases para responder</b></td><td><b>SECCIÓN 2</b></td></tr>
              <tr><td><b>Desnormalización:</b> por consistencia o por performance · técnicas · costos</td><td><b>SECCIÓN 3</b></td></tr>
              <tr><td>ORM · <b>impedance mismatch</b> · hidratación · lazy/eager · cascada · caché del ORM</td><td>SECCIÓN 4</td></tr>
              <tr><td>Hibernate: annotations · <b>las 4 estrategias de herencia</b></td><td>SECCIÓN 5</td></tr>
              <tr><td><b>¿Qué base NoSQL propone?</b> · los 6 tipos · persistencia políglota</td><td>SECCIÓN 6</td></tr>
              <tr><td><b>Armar el DER paso a paso</b> · disparadores · tipos de dato · siglas · justificación</td><td><b>SECCIÓN 7</b></td></tr>
              <tr><td>Las 6 decisiones de un DER · <b>los 7 errores</b> · checklist</td><td>SECCIÓN 7 BIS</td></tr>
              <tr><td><b>Qué servicio me tocó</b> (gestión / transaccional / auditoría) y qué entidades buscar</td><td>SECCIÓN 7 TER</td></tr>
              <tr><td>Sesiones y cookies · <b>stateless vs stateful con diagramas</b> · JWT · 401 vs 403</td><td>SECCIÓN 8</td></tr>
              <tr><td>Cliente liviano vs pesado · SPA · SEO · escalabilidad · balanceador · caché · CDN</td><td>SECCIÓN 8</td></tr>
              <tr><td><b>Cómo se dibuja el diagrama</b> · dónde va cada componente · cómo justificarlo</td><td><b>SECCIÓN 8 BIS</b></td></tr>
              <tr><td>Monolito vs SOA vs microservicios · falacias · Saga · Outbox · <b>nube vs on-premise</b></td><td>SECCIÓN 9</td></tr>
              <tr><td>Integración: API / cola / BD compartida / Kafka · REST, SOAP, gRPC, GraphQL · resiliencia</td><td>SECCIÓN 10</td></tr>
              <tr><td>Observabilidad · métricas · logs · trazas · alertas · SLI/SLO · despliegue · DR</td><td>SECCIÓN 11</td></tr>
              <tr><td><b>“El enunciado dice X, ¿qué respondo?”</b> · frases de justificación · checklist final</td><td><b>SECCIÓN 12</b></td></tr>
              <tr><td>Glosario de 45 términos · fórmulas · números para recordar</td><td>SECCIÓN 13</td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">LAS 4 SECCIONES QUE MÁS VAS A USAR</div>
            <p><b>SECCIÓN 12</b> (el enunciado dice X → respondé Y) · <b>SECCIÓN 7</b> (armar el DER) ·
            <b>SECCIÓN 2</b> (formas normales) · <b>SECCIÓN 8 BIS</b> (cómo dibujar la arquitectura).
            <b>Marcalas con un doblez en la esquina antes de entrar.</b></p>
          </div>
        </section>

        <!-- ===================== SECCIÓN 0 BIS ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 0 BIS · CÓMO RESPONDER EL PARCIAL</span>

          <h3>Lo primero, apenas te lo dan</h3>
          <ol>
            <li><b>Leé el enunciado entero sin escribir nada.</b></li>
            <li><b>Mirá el puntaje de cada punto y repartí el tiempo.</b> Si Datos vale 40 y Arquitectura 50, no puede pasar que llegues con 10 minutos a arquitectura.</li>
            <li><b>Se exige no menos del 50% en CADA sección.</b> Una sección en blanco desaprueba el parcial entero, aunque las otras estén perfectas. <b>Mejor tres respuestas buenas que una excelente y dos vacías.</b></li>
            <li>En la segunda lectura, <b>subrayá las frases que disparan decisiones</b> (sección 7 y sección 12).</li>
          </ol>

          <h3>El molde que sirve para CUALQUIER punto de arquitectura</h3>
          <ol>
            <li><b>Qué propongo</b> — el componente o patrón, con su nombre.</li>
            <li><b>Por qué</b> — citando <b>la frase del enunciado</b> que lo justifica.</li>
            <li><b>Cómo funciona</b> — dos o tres renglones.</li>
            <li><b>Qué atributos de calidad mejora</b> — y <b>definilos</b>, porque la consigna lo pide textualmente.</li>
            <li><b>Qué costo asumo</b> y <b>cómo lo mitigo</b>.</li>
          </ol>
          <p><b>El punto 5 es el que separa un 6 de un 9:</b> demuestra que no estás repitiendo una receta.</p>

          <h3>Atributos de calidad: definilos así</h3>
          <div class="table-wrap"><table class="data">
            <tbody>
              <tr><td><b>Performance</b></td><td>Capacidad de responder en el tiempo esperado bajo una carga dada</td></tr>
              <tr><td><b>Escalabilidad</b></td><td>Capacidad de sostener más carga agregando recursos</td></tr>
              <tr><td><b>Disponibilidad</b></td><td>Proporción del tiempo en que el sistema está operativo y responde</td></tr>
              <tr><td><b>Mantenibilidad</b></td><td>Facilidad para modificar el sistema con bajo riesgo y costo</td></tr>
              <tr><td><b>Usabilidad</b></td><td>Facilidad con la que el usuario logra su objetivo</td></tr>
              <tr><td><b>Seguridad</b></td><td>Protección de la confidencialidad, integridad y disponibilidad de la información</td></tr>
              <tr><td><b>Interoperabilidad</b></td><td>Capacidad de intercambiar información con otros sistemas</td></tr>
              <tr><td><b>Tolerancia a fallos</b></td><td>Capacidad de seguir operando ante la falla de un componente</td></tr>
            </tbody>
          </table></div>

          <h3>Reglas que valen puntos</h3>
          <ul>
            <li><b>Escribí los supuestos.</b> Un supuesto explícito convierte una ambigüedad en una decisión defendible.</li>
            <li><b>Justificá todo, aunque parezca obvio.</b> “Usé una cola” no vale; “usé una cola porque el emisor no necesita la respuesta y hay picos de carga, lo que mejora disponibilidad y escalabilidad” sí.</li>
            <li><b>Dibujá.</b> Los enunciados dicen literalmente “un diagrama es mucho mejor que texto”. Rotulá <b>todas</b> las flechas con su protocolo y marcá lo externo.</li>
            <li><b>Si no te acordás un nombre propio, describí el mecanismo.</b> “Un componente que corta las llamadas cuando el servicio falla repetidamente y responde una alternativa degradada” suma casi lo mismo que escribir “circuit breaker”.</li>
            <li><b>Un “Falso” sin justificar vale cero.</b> Y un “Sí, cumple” sin fundamentar, también.</li>
            <li><b>No metas componentes de más:</b> la sobreingeniería resta. Si no podés señalar la frase del enunciado que lo justifica, sacalo.</li>
            <li><b>Dejá 5 minutos</b> para releer el enunciado buscando requerimientos que no aparezcan en tu solución.</li>
          </ul>
        </section>

        <!-- ===================== SECCIÓN 0 TER ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 0 TER · PREGUNTAS DE PARCIALES, YA RESPONDIDAS</span>
          <p>Preguntas textuales de los parciales y finales de la cátedra, con la respuesta armada. <b>Buscá la que se
          parezca a la tuya y adaptá.</b></p>

          <h3>Integración y asincronismo</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:38%">Pregunta</th><th>Respuesta</th></tr></thead>
            <tbody>
              <tr><td><b>“¿Cómo integraría cientos de sensores/dispositivos que envían datos periódicamente?”</b></td><td><b>Asincrónica por mensajería: MQTT</b> (liviano, pub/sub, con QoS y tolerante a conectividad intermitente) contra un <b>broker</b>, con un <b>Edge Gateway</b> en el lugar que agrupa, bufferea y reintenta. Un servicio de <b>ingesta</b> valida y publica en un topic; los consumidores persisten en una <b>base de series temporales</b>. <b>Por qué no REST:</b> el dispositivo no necesita respuesta para continuar y una llamada sincrónica acoplaría la disponibilidad del sistema a la de cientos de dispositivos. <b>Consumidores idempotentes</b> (entrega at-least-once), reintentos limitados y <b>DLQ</b>.</td></tr>
              <tr><td><b>“¿Cómo enviaría notificaciones / resúmenes por mail al final del día?”</b></td><td>Un <b>cron/scheduler</b> dispara y <b>publica un mensaje por destinatario en una cola</b>; un consumidor de Notificaciones envía. Desacopla en el tiempo (si el proveedor está caído, esperan), absorbe el pico y permite <b>escalar consumidores</b>. <b>Idempotencia</b> para no mandar dos veces, <b>backoff</b> y <b>DLQ</b>. Para no perder el evento por doble escritura, <b>Transactional Outbox</b>.</td></tr>
              <tr><td><b>“Un servicio externo se cae seguido y responde lento. ¿Qué hace?”</b></td><td><b>Timeout</b> siempre definido · <b>reintentos limitados con backoff</b> (sólo si es idempotente) · <b>circuit breaker</b> que abre tras N fallos y <b>falla rápido</b> con un <b>fallback</b> · <b>clave de idempotencia</b> para no duplicar si hubo timeout · y <b>Adapter</b> contra una interfaz propia, para que cambiar de proveedor sea otro adapter. Si no necesito la respuesta ya, lo paso a <b>cola</b>.</td></tr>
              <tr><td><b>“Timeout, pero el otro sistema igual procesó. ¿Qué hace?”</b></td><td><b>Clave de idempotencia.</b> Tras el timeout <b>consulto</b> el estado de esa clave, o <b>reintento con la misma clave</b>: el otro sistema reconoce la operación y devuelve el mismo resultado <b>sin volver a procesarla</b>. Nunca se genera una clave nueva para un reintento, y se guarda el id externo con <b>UNIQUE</b> para que la base impida el duplicado.</td></tr>
              <tr><td><b>“Terceros quieren consultar datos con flexibilidad y minimizando llamadas”</b></td><td><b>GraphQL:</b> un único endpoint, el cliente <b>pide exactamente lo que necesita</b>, esquema tipado y autodocumentado; evita el over-fetching y no acopla los contratos internos a cada tercero. <b>Mitigaciones:</b> límites de profundidad y complejidad, paginación, rate limiting y caché del lado del servidor.</td></tr>
            </tbody>
          </table></div>

          <h3>Escalabilidad, caché y contenido</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:38%">Pregunta</th><th>Respuesta</th></tr></thead>
            <tbody>
              <tr><td><b>“Picos de tráfico / se multiplica por 10 / miles de acciones al mismo horario”</b></td><td><b>Escalado horizontal</b>: N instancias <b>stateless</b> detrás de un <b>balanceador L7 con health checks</b> y autoescalado, más una <b>cola</b> que amortigua el pico y permite escalar consumidores, y <b>caché</b> para las consultas repetidas. <b>Atributos:</b> escalabilidad, disponibilidad, performance y tolerancia a fallos — y decí <b>cómo</b> se garantiza cada uno.</td></tr>
              <tr><td><b>“Las imágenes/videos tardan y consumen mucho ancho de banda”</b></td><td><b>Object storage + CDN.</b> El backend <b>deja de transferir bytes</b>: sólo entrega la <b>URL</b>, y la CDN sirve desde el nodo más cercano. Mejora tiempos de carga, <b>reduce el costo de ancho de banda</b>, agrega redundancia y <b>mitiga DDoS</b>. <b>Nunca</b> guardar binarios en la base.</td></tr>
              <tr><td><b>“Se repiten las mismas consultas y saturan la base”</b></td><td><b>Caché</b> (Redis, o caché HTTP) <b>con TTL</b> + <b>réplicas de lectura</b>. Justificá el TTL por <b>cuánta desactualización tolera el negocio</b>, y combinalo con <b>invalidación por evento</b> cuando el dato cambia. Si es analítica, <b>read model</b> o almacén <b>columnar</b>.</td></tr>
              <tr><td><b>“Los componentes escalan bien pero igual hay latencia”</b></td><td>Buscar el <b>cuello de botella compartido</b>: casi siempre la <b>base de datos</b> (índices, réplicas de lectura, caché, particionamiento) o un <b>servicio externo lento</b>. Escalar más instancias no arregla un cuello de botella aguas abajo.</td></tr>
              <tr><td><b>“Un proceso batch tarda horas y a veces no termina en el día”</b></td><td><b>Paralelizar</b>: partir el trabajo en unidades, publicarlas en una <b>cola</b> y procesarlas con <b>N workers</b> que escalan horizontalmente. Es más barato que comprar una máquina más grande (que además tiene <b>techo físico</b>).</td></tr>
            </tbody>
          </table></div>

          <h3>Seguridad, clientes y arquitectura</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:38%">Pregunta</th><th>Respuesta</th></tr></thead>
            <tbody>
              <tr><td><b>“¿Cómo aplicaría JWT y qué ventajas tiene frente a la sesión?”</b></td><td>El usuario se autentica una vez contra el <b>IdM</b>, que devuelve un <b>JWT firmado</b> con id, roles y expiración; el cliente lo manda en <code>Authorization: Bearer</code> en cada request y el <b>API Gateway</b> valida la firma y propaga la identidad. <b>Ventajas:</b> escalado horizontal <b>sin sticky sessions</b>, sirve para web/mobile/terceros, autocontenido (sin viaje a la base), desacopla la autenticación y usa menos memoria. <b>Desventajas:</b> no se revoca fácil (expiración corta + refresh token), viaja en cada request y el payload <b>es legible</b>. <b>Ver sección 8.</b></td></tr>
              <tr><td><b>“¿Qué componente propone para el inicio de sesión?”</b></td><td><b>IdM / IdP con SSO</b> (Keycloak, Auth0, Entra ID), con <b>MFA</b> para usuarios internos y <b>login federado por OpenID Connect</b> si los usuarios entran sólo para eso. Se delega la custodia de credenciales, se gana usabilidad y el backend queda <b>stateless</b> validando el token. <b>El IdP es crítico:</b> necesita alta disponibilidad.</td></tr>
              <tr><td><b>“¿Qué mecanismos garantizan la confidencialidad de datos sensibles?”</b></td><td><b>TLS</b> en tránsito (también interno) · <b>cifrado en reposo</b> y por columna para los campos sensibles, con claves en una <b>bóveda</b> y rotación · contraseñas <b>hasheadas con salt</b> · <b>control de acceso por roles y permisos con alcance</b>, validado en el backend · <b>minimización</b> y enmascaramiento · <b>anonimizar</b> antes de copiar a testing (Ley 25.326) · <b>auditoría</b> de accesos.</td></tr>
              <tr><td><b>“¿Y la integridad?”</b></td><td><b>Hash/checksum</b> del contenido · <b>firma digital o HMAC</b> del documento generado · constraints e <b>integridad referencial</b> en la base · transacciones · y un <b>log de auditoría append-only</b>.</td></tr>
              <tr><td><b>“¿App nativa o híbrida?”</b></td><td><b>Híbrida</b> si el caso es consulta y configuración: una sola base de código → <b>mantenibilidad</b> y <b>time-to-market</b>. <b>Nativa</b> si hay <b>acceso intensivo al hardware</b> (cámara en vivo, BLE, GPS en background, push de baja latencia) o <b>performance de UI exigente</b>. <b>Definí cada atributo que nombres.</b></td></tr>
              <tr><td><b>“¿Conviene pasar a cliente pesado / SPA?”</b></td><td><b>Depende del caso de uso.</b> Si hay <b>alta interactividad</b> o <b>varios clientes sobre la misma API</b>, sí. Si es sólo visualización y no se prevén otros clientes, <b>no</b>: agrega costo de construir y versionar una app aparte, primera carga más lenta y <b>SEO más difícil</b>. Camino intermedio: <b>cliente liviano desacoplado</b>, que deja el contrato estable para cambiar la vista después.</td></tr>
              <tr><td><b>“Equipo chico y plazo corto, pero un servicio recibe mucho más tráfico: ¿monolito o microservicios?”</b></td><td><b>Monolito modular</b>, con el módulo de alta demanda <b>identificado como candidato a extracción</b> (Strangler). Razones: equipo chico, plazo corto, <b>límites todavía inciertos</b>, consistencia transaccional simple y <b>menor costo operativo</b> (“Monolith First”). <b>Y el tráfico se resuelve igual:</b> un monolito <b>stateless escala horizontalmente</b> con N réplicas detrás de un balanceador; lo que <b>no</b> puede es escalar partes por separado, y ese costo es menor que la complejidad de distribuir todo. <b>Decí qué evidencia cambiaría la decisión.</b></td></tr>
              <tr><td><b>“Hay que cambiar el esquema sin downtime”</b></td><td><b>Expand and Contract:</b> ① <b>agregar</b> lo nuevo manteniendo lo viejo · ② desplegar la versión que <b>escribe en ambos</b> y migrar en segundo plano · ③ <b>eliminar</b> lo viejo cuando nadie lo consulta. Despliegue <b>rolling</b> (conviven dos versiones, por eso hacía falta el paso 1), y el release detrás de un <b>feature flag</b>.</td></tr>
            </tbody>
          </table></div>
        </section>

        <!-- ===================== SECCIÓN 0 QUATER ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 0 QUATER · MÁS PREGUNTAS REALES, CON SU ORIGEN</span>
          <p>Estas aparecieron <b>textualmente</b> en los finales y parciales de la carpeta. La columna de la derecha
          dice en cuál.</p>

          <h3>Tiempo real y procesos periódicos</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:34%">Pregunta</th><th>Respuesta</th><th style="width:12%">Visto en</th></tr></thead>
            <tbody>
              <tr>
                <td><b>“Al terminar el proceso, mostrarle al usuario una burbuja emergente <u>sólo si está navegando la plataforma</u>. Describa el proceso completo.”</b></td>
                <td>El backend <b>no puede llamar al navegador</b>, así que hace falta un canal abierto: cuando el usuario entra, el cliente abre un <b>WebSocket</b> (o un <b>SSE</b>, que alcanza si es de ida nada más) contra un <b>servicio de notificaciones</b> y se <b>suscribe a su propio canal</b> (identificado por el id de usuario del JWT). Cuando el proceso termina, el servicio que lo resolvió <b>publica un evento</b> en el broker; el servicio de notificaciones lo consume y, <b>si ese usuario tiene una conexión abierta</b>, le empuja el mensaje y aparece la burbuja. <b>Si no está conectado</b>, no se envía nada por ese canal: queda el mail/push y la notificación guardada para cuando entre. <b>Alternativa más pobre</b> (mencionala y descartala): <b>polling</b> cada N segundos, que funciona pero <b>genera carga inútil</b> y no es instantáneo.</td>
                <td>final</td>
              </tr>
              <tr>
                <td><b>“Se necesita un dashboard en tiempo real con la posición GPS de los camiones. ¿Qué patrón arquitectónico propone?”</b></td>
                <td><b>Publicación-suscripción de punta a punta.</b> El dispositivo del camión publica por <b>MQTT</b> (liviano, tolera conectividad intermitente) contra un <b>broker</b>; un servicio de <b>ingesta</b> valida y guarda en una <b>base de series temporales</b> (escritura masiva + consulta por rango de tiempo) y a la vez <b>publica en un topic</b>; el <b>dashboard</b> recibe las posiciones por <b>WebSocket</b>. <b>Por qué no REST:</b> el camión no necesita respuesta y una llamada sincrónica acoplaría el sistema a cientos de dispositivos. <b>Atributos:</b> escalabilidad (se escalan consumidores), disponibilidad (si cae la ingesta, los mensajes esperan) y performance.</td>
                <td>final 25-09-25</td>
              </tr>
              <tr>
                <td><b>“El cálculo se debe hacer de forma diaria / las publicaciones deben cambiar de estado automáticamente. ¿Qué propone?”</b></td>
                <td><b>Tarea programada (cron / scheduler)</b> que dispara el proceso. <b>Los tres detalles que piden:</b> ① con varias instancias hay que garantizar <b>ejecución única</b> (un lock distribuido o un scheduler centralizado), si no el proceso corre N veces; ② si el trabajo es pesado, el cron <b>sólo encola</b> y el procesamiento lo hacen <b>workers</b> que escalan; ③ el proceso debe ser <b>idempotente</b> y <b>reanudable</b>, para poder volver a correrlo si falló a la mitad. <b>No</b> conviene resolverlo “al consultar” (cálculo on-the-fly) si el volumen es grande.</td>
                <td>finales 22-02-25 y otros</td>
              </tr>
              <tr>
                <td><b>“El proceso nocturno tarda horas y algunos días supera las 24 h. Contratar hardware más caro es un salto de costo enorme. ¿Cómo lo resuelve? GRAFIQUE.”</b></td>
                <td><b>Paralelizar en vez de agrandar la máquina.</b> El escalado <b>vertical</b> tiene <b>techo físico</b> y precio no lineal; el <b>horizontal</b> no. Se <b>parte el trabajo</b> en unidades independientes (por cliente, por sucursal, por rango de fechas), se publican en una <b>cola</b> y las procesan <b>N workers</b> en paralelo, que se escalan según el <b>largo de la cola</b> y se apagan al terminar (en la nube, <b>pago por uso</b>). <b>Dibujá:</b> disparador → cola → workers xN → base. <b>Atributos:</b> performance, escalabilidad y costo.</td>
                <td>final 27-02-25</td>
              </tr>
            </tbody>
          </table></div>

          <h3>Especificar una API REST (pregunta concreta, respuesta concreta)</h3>
          <p><b>“Se requiere exponer una API REST de los Eventos. Defina: protocolo, método(s), códigos de estado,
          estructura del cuerpo de solicitud y respuesta, encabezados relevantes.”</b> <span class="mini">(final)</span></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:22%">Qué piden</th><th>Qué se responde</th></tr></thead>
            <tbody>
              <tr><td><b>Protocolo</b></td><td><b>HTTPS</b> (TLS). REST sobre HTTP, <b>stateless</b>: cada request lleva todo lo necesario.</td></tr>
              <tr><td><b>Recurso y URI</b></td><td>Sustantivo <b>en plural</b>: <code>/eventos</code>, <code>/eventos/{id}</code>. Anidado si depende de otro: <code>/dispositivos/{id}/eventos</code>. <b>Nunca verbos en la URL</b> (<code>/crearEvento</code> está mal).</td></tr>
              <tr><td><b>Métodos</b></td><td><b>GET</b> listar/obtener (seguro, idempotente) · <b>POST</b> crear (<b>no</b> idempotente) · <b>PUT</b> reemplazar (idempotente) · <b>PATCH</b> modificar parcial · <b>DELETE</b> borrar (idempotente).</td></tr>
              <tr><td><b>Códigos de estado</b></td><td><b>200</b> OK · <b>201</b> Created (+ header <code>Location</code>) · <b>202</b> Accepted (lo recibí, lo proceso después: <b>la respuesta del asincronismo</b>) · <b>204</b> No Content · <b>400</b> request mal armado · <b>401</b> no autenticado · <b>403</b> autenticado sin permiso · <b>404</b> no existe · <b>409</b> conflicto (duplicado) · <b>422</b> no pasa una regla de negocio · <b>429</b> rate limit · <b>500</b> error del servidor · <b>503</b> no disponible.</td></tr>
              <tr><td><b>Cuerpo de la solicitud</b></td><td><b>JSON</b>. Ej.: <code>{ "id_dispositivo": 7, "tipo": "APERTURA", "fecha_hora": "2026-11-18T09:12:00-03:00", "valor": 12.5 }</code>. Fechas en <b>ISO 8601 con zona</b>.</td></tr>
              <tr><td><b>Cuerpo de la respuesta</b></td><td>El recurso creado con su <b>id</b>, o la colección <b>paginada</b>: <code>{ "items": [...], "page": 1, "size": 50, "total": 1234 }</code>. En el error, un cuerpo uniforme: <code>{ "codigo": "...", "mensaje": "...", "detalles": [...] }</code>.</td></tr>
              <tr><td><b>Encabezados</b></td><td><b>Request:</b> <code>Content-Type: application/json</code> · <code>Accept</code> · <code>Authorization: Bearer &lt;JWT&gt;</code> · <code>Idempotency-Key</code> en los POST que no deben duplicarse · <code>X-Correlation-Id</code>. <b>Response:</b> <code>Location</code> en el 201 · <code>ETag</code> y <code>Cache-Control</code> · <code>Retry-After</code> en 429/503.</td></tr>
              <tr><td><b>Lo que suma</b></td><td><b>Versionado</b> (<code>/api/v1</code>) y cambios <b>aditivos</b> · <b>paginación y filtros</b> por query string (<code>?desde=&amp;hasta=&amp;page=</code>) · documentación con <b>OpenAPI</b> · <b>rate limiting</b> en el gateway.</td></tr>
            </tbody>
          </table></div>

          <h3>Diagnóstico y arquitectura distribuida</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:34%">Pregunta</th><th>Respuesta</th><th style="width:12%">Visto en</th></tr></thead>
            <tbody>
              <tr>
                <td><b>“Si el Módulo de Análisis arroja Timeout, ¿qué tipo de problema estoy teniendo? ¿Cómo lo soluciono?”</b></td>
                <td><b>Qué problema es:</b> <b>acoplamiento temporal</b> en una llamada <b>sincrónica</b> — mi servicio depende de que el otro responda <b>justo ahora</b>, y mientras espera <b>retiene hilos y conexiones</b>, con riesgo de <b>falla en cascada</b>. <b>Cómo se soluciona:</b> <b>timeout</b> definido · <b>retry con backoff</b> (sólo si es idempotente) · <b>circuit breaker</b> que abre y <b>falla rápido</b> con un <b>fallback</b> · <b>bulkhead</b> para aislar el pool de esa dependencia · y, si <b>no necesito la respuesta para continuar</b>, convertirlo en <b>asincrónico con cola</b> y devolver <b>202</b>.</td>
                <td>final</td>
              </tr>
              <tr>
                <td><b>“Los tres componentes escalan horizontalmente bien, pero la latencia sigue alta. ¿Por qué?”</b></td>
                <td><b>El cuello de botella está en un recurso compartido que NO escala con ellos:</b> casi siempre la <b>base de datos</b> (todas las instancias pegan a la misma), y a veces un <b>servicio externo</b> o el <b>broker</b>. Agregar instancias <b>no arregla</b> un cuello de botella aguas abajo — incluso lo empeora, porque aumentan las conexiones. <b>Qué hacer:</b> <b>medir primero</b> (plan de ejecución, p95 por dependencia, saturación del <b>pool de conexiones</b>), después <b>índices</b>, <b>caché</b>, <b>réplicas de lectura</b>, particionamiento, y recién al final desnormalizar.</td>
                <td>final</td>
              </tr>
              <tr>
                <td><b>“Elabore un diagrama de COMPONENTES de la arquitectura de microservicios.”</b></td>
                <td>Ojo con la diferencia: el de <b>componentes</b> muestra <b>qué piezas de software hay y cómo se conectan</b> (con <b>bolita ● provista</b> y <b>semicírculo ( requerida</b>); el de <b>despliegue</b> muestra <b>en qué nodos corren</b> (cubos, con el protocolo en cada línea). Para microservicios dibujá: <b>clientes → API Gateway → un componente por servicio</b> (cada uno con <b>su propia base</b>) <b>→ broker</b> con los consumidores, más los <b>transversales</b> (IdM/SSO, observabilidad, secretos) y los <b>externos</b> marcados como tales. <b>Ver sección 8 BIS.</b></td>
                <td>finales</td>
              </tr>
              <tr>
                <td><b>“Explique diferencias, ventajas y desventajas entre monolítica y microservicios. Elija una y justifique con atributos de calidad.”</b></td>
                <td>La tabla comparativa está en la <b>sección 9</b>. <b>Lo que se evalúa es la elección justificada</b>, no recitar: tomá los datos del enunciado (tamaño del equipo, plazo, si los límites del dominio están claros, si la carga es pareja o asimétrica, si hace falta consistencia transaccional) y <b>cerrá con qué evidencia te haría cambiar de opinión</b>. Si el equipo es chico y el plazo corto → <b>monolito modular</b> (“Monolith First”), aclarando que <b>igual escala horizontalmente</b> si es stateless.</td>
                <td>final</td>
              </tr>
              <tr>
                <td><b>“¿Qué atributos de calidad se ven vinculados en esta integración? Defina cada uno.”</b></td>
                <td><b>Ojo: pide definirlos.</b> Nombrá sólo los que aplican y definilos en una línea (están en la <b>sección 0 BIS</b>). Para una integración con un externo inestable, los tres son: <b>Disponibilidad</b> (proporción del tiempo operativo: si el externo cae, mi sistema <b>sigue</b> gracias al circuit breaker y el fallback), <b>Performance</b> (responder en el tiempo esperado: el timeout evita que su lentitud se contagie) y <b>Tolerancia a fallos</b> (seguir operando ante la falla de un componente: reintentos, degradación e idempotencia).</td>
                <td>final 15-02-25</td>
              </tr>
            </tbody>
          </table></div>
        </section>

        <!-- ===================== SECCIÓN 1 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 1 · PERSISTENCIA + MODELO RELACIONAL</span>
          <p class="mini"><b>Persistencia:</b> que el <b>estado del sistema sobreviva más allá del proceso que lo creó</b> (más allá de una única ejecución), almacenándolo en un medio persistente.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estrategia</th><th>Qué es</th><th>✅ / ⚠️</th></tr></thead>
            <tbody>
              <tr><td><b>En memoria</b></td><td>El dato sigue existiendo entre operaciones. RAM volátil (hay memorias persistentes)</td><td>✅ velocidad, <b>tests</b> · ⚠️ volátil</td></tr>
              <tr><td><b>En archivos</b></td><td>XML, CSV, ancho fijo, JSON</td><td>✅ simple, intercambio · ⚠️ sin consultas ni integridad</td></tr>
              <tr><td><b>Prevalencia</b></td><td>Estado en memoria + <b>snapshots</b> a disco; maneja transacciones (Prevayler)</td><td>✅ <b>no transforma</b> datos → performance y transparencia · ⚠️ <b>sin interoperabilidad</b>, mucha RAM</td></tr>
              <tr><td><b>Ortogonal</b></td><td><b>Propiedad intrínseca del entorno</b>: transparente (SO: hibernación; VMware)</td><td>✅ sin código · ⚠️ depende del entorno</td></tr>
              <tr><td><b>BD de objetos</b></td><td>Atada a <b>un lenguaje</b> (representación interna)</td><td>✅ no transforma → performance · ⚠️ <b>interoperabilidad</b></td></tr>
              <tr><td><b>BD relacional / NoSQL</b></td><td>Requiere <b>transformación</b> previa</td><td>✅ <b>interoperabilidad</b>, recuperación ante fallos, integridad · ⚠️ impedance mismatch</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Repositorio:</b> NO es patrón de diseño, es <b>patrón ARQUITECTÓNICO</b>; se apoya en capas, propone una capa de persistencia con objetos Repository (agregar/modificar/eliminar/buscar/buscarTodos). <b>DAO</b> = el que realmente accede a los datos (BD relacional, NoSQL, memoria, archivos). Repositorio + <b>Strategy</b> para elegir el DAO: <b>el cliente no debe enterarse cuál es el medio persistente</b>.</p>
          <h3>Modelo relacional — Codd, IBM, 1970</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Modelo</th><th>Implementación</th><th>Definición</th></tr></thead>
            <tbody>
              <tr><td>Relación</td><td>Tabla</td><td>Donde se almacenan los datos (relación base → tabla)</td></tr>
              <tr><td>Tupla</td><td>Fila</td><td>El registro</td></tr>
              <tr><td>Atributo</td><td>Columna</td><td>Campo dentro de la tupla</td></tr>
              <tr><td><b>Dominio</b></td><td>Tipo + restricciones</td><td>Conjunto de valores posibles; <b>menor unidad semántica</b></td></tr>
              <tr><td><b>Cardinalidad</b></td><td>Nº de filas</td><td><b>Número de tuplas</b></td></tr>
              <tr><td><b>Grado</b></td><td>Nº de columnas</td><td><b>Número de atributos</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>PK:</b> identifica unívocamente cada fila. 3 tipos: <b>natural</b> (campo propio: CUIT, nro. de serie), <b>subrogada</b> (ficticia/autogenerada), <b>compuesta</b> (varias columnas). · <b>FK:</b> una o más columnas que referencian la PK de otra tabla; <b>puede ser parte de una PK</b>. · <b>Integridad referencial:</b> la FK siempre debe corresponder a una <b>fila válida</b>; mantiene la relación <b>sincronizada</b> en updates y deletes. · <b>PK y FK son índices.</b></p>
          <p class="mini"><b>Tipos:</b> VARCHAR, INTEGER, DOUBLE, DATETIME (dinero → DECIMAL). <b>Constraints:</b> NOT NULL · UNIQUE · CHECK (o enum) · PRIMARY KEY · FOREIGN KEY.</p>
          <div class="callout key"><p class="mini"><b>CARDINALIDAD = cantidad MÁXIMA</b> de relaciones de un registro respecto de la otra entidad (1, N). <b>MODALIDAD = cantidad MÍNIMA</b> (0 = opcional → FK NULL; 1 = obligatoria → FK NOT NULL). “<b>puede</b>” → 0 · “<b>debe</b>” → 1.</p></div>
          <p class="mini"><b>1:1</b> → FK + UNIQUE del lado dependiente (uni o bidireccional). <b>1:N / N:1</b> → <b>FK del lado “muchos”</b>; es <b>cuestión de perspectiva</b> (si A→B es 1:N, B→A es N:1). <b>N:M</b> → <b>NO es posible en el modelo relacional</b> (harían falta múltiples FKs sin saber cuántas): <b>se parte en dos 1:N con entidad intermedia C</b>, con FK a A y FK a B (PK compuesta) y <b>puede guardar datos extra de la relación</b> (si los guarda, deja de ser “simple tabla intermedia” y pasa a ser entidad del dominio: Cursada, Inscripción).</p>
                  <div class="callout key">
            <div class="callout-title">EJEMPLO: leer cardinalidad y modalidad de una frase</div>
            <p><b>Frase:</b> “Un pedido <b>debe</b> tener un cliente y <b>puede</b> incluir un cupón de descuento.
            Un cliente <b>puede</b> tener muchos pedidos.”</p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Relación</th><th>Cardinalidad<br><span class="mini">(el máximo)</span></th><th>Modalidad<br><span class="mini">(el mínimo)</span></th><th>Cómo queda</th></tr></thead>
              <tbody>
                <tr><td>Pedido → Cliente</td><td><b>1</b> (“un cliente”)</td><td><b>1</b> — <b>“debe”</b></td><td><code>PEDIDO.id_cliente</code> FK <b>NOT NULL</b></td></tr>
                <tr><td>Cliente → Pedido</td><td><b>N</b> (“muchos”)</td><td><b>0</b> — <b>“puede”</b></td><td>Sin columna: la FK ya está del lado <b>muchos</b>. Un cliente sin pedidos es válido</td></tr>
                <tr><td>Pedido → Cupón</td><td><b>1</b></td><td><b>0</b> — <b>“puede”</b></td><td><code>PEDIDO.id_cupon</code> FK que admite <b>NULL</b></td></tr>
              </tbody>
            </table></div>
            <p><b>El atajo:</b> buscá el verbo. <b>“debe” → NOT NULL</b> · <b>“puede” → NULL</b> ·
            <b>“muchos / varios / uno o más” → la FK va de ese lado</b>.</p>
          </div>
          <div class="callout key">
            <div class="callout-title">EJEMPLO: por qué N:M necesita una tabla en el medio</div>
            <p>“Un alumno cursa <b>varias</b> materias y una materia la cursan <b>varios</b> alumnos.” Si quisieras
            resolverlo con FK, <b>¿cuántas columnas le ponés a ALUMNO?</b> ¿<code>materia_1</code>…
            <code>materia_8</code>? <b>No se puede</b>: no sabés cuántas van a ser. <b>Por eso la N:M no existe en el
            modelo relacional</b> y se parte en dos 1:N:</p>
            <p><code>ALUMNO(id_alumno PK)</code> → <code>CURSADA(id_alumno PK FK, id_materia PK FK, <b>nota_1p, nota_2p</b>)</code> ← <code>MATERIA(id_materia PK)</code></p>
            <p><b>El salto de calidad:</b> si la relación <b>tiene datos propios</b> (las notas), deja de ser una
            “simple tabla intermedia” y <b>merece nombre de dominio</b>: <code>CURSADA</code>, no
            <code>ALUMNO_MATERIA</code>. Decilo en la justificación.</p>
          </div>
</section>

        <!-- ===================== SECCIÓN 2 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 2 · LAS 3 FORMAS NORMALES, EN CRIOLLO</span>
          <p class="mini"><b>Normalizar</b> es acomodar las tablas para que <b>cada dato esté escrito en un solo lugar</b>. Si un dato está repetido en muchas filas, tarde o temprano alguien lo cambia en una y se olvida de las otras: ahí el sistema empieza a tener <b>dos verdades</b>. Las tres formas normales son <b>tres preguntas</b> que le hacés a cada tabla, en orden. <b>Sirve para escribir bien, no para leer rápido:</b> el precio de tener todo ordenado es más tablas y más JOINs.</p>

          <h3>1FN — “un solo dato por casillero”</h3>
          <p class="mini"><b>La pregunta:</b> <i>¿hay alguna celda con más de un dato adentro?</i> Si la respuesta es sí, no cumple.</p>
          <div class="grid-2">
            <div class="card">
              <p class="mini"><b>❌ MAL</b></p>
              <div class="table-wrap"><table class="data">
                <thead><tr><th>id</th><th>nombre</th><th>telefonos</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>Ana</td><td>1133-4455 <b>/</b> 1166-7788</td></tr>
                  <tr><td>2</td><td>Luis</td><td>1144-2200</td></tr>
                </tbody>
              </table></div>
              <p class="mini"><b>Por qué molesta, en concreto:</b> ¿cómo buscás quién tiene el 1166-7788? Tenés que partir el texto. ¿Cómo agregás un tercero? Reescribiendo toda la cadena. Y nada impide que mañana alguien escriba “11 66 77 88”. <b>Variante del mismo error:</b> columnas <code>tel_1, tel_2, tel_3</code> — ¿y el cuarto teléfono dónde va?</p>
            </div>
            <div class="card">
              <p class="mini"><b>✅ BIEN</b> — el dato repetido sale a su propia tabla</p>
              <div class="table-wrap"><table class="data">
                <thead><tr><th>id_tel</th><th>id_cliente</th><th>numero</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>1133-4455</td></tr>
                  <tr><td>2</td><td>1</td><td>1166-7788</td></tr>
                  <tr><td>3</td><td>2</td><td>1144-2200</td></tr>
                </tbody>
              </table></div>
              <p class="mini">Ahora cada teléfono es <b>una fila</b>. Buscar, agregar y borrar es trivial, y se puede validar el formato.</p>
            </div>
          </div>

          <div class="callout key">
            <div class="callout-title">❓ ¿Qué quiere decir “atómico”? Las 3 cosas que se confunden</div>
            <p class="mini"><b>Atómico = el valor no se puede partir en pedazos que al negocio le sirvan por separado.</b>
            La pregunta que resuelve todas las dudas es siempre la misma:
            <b>“¿el sistema necesita usar las partes por separado?”</b> Si la respuesta es sí, hay que separarlas.</p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Caso</th><th>¿Rompe 1FN?</th><th>Por qué</th><th>Cómo se arregla</th></tr></thead>
              <tbody>
                <tr><td><code>telefonos = "1133-4455 / 1166-7788"</code></td><td><b>SÍ</b>, siempre</td><td><b>Varios valores del mismo tipo</b> apilados en una celda: es una <b>lista</b></td><td><b>Tabla hija</b> <code>TELEFONO</code> (1:N)</td></tr>
                <tr><td><code>tel_1, tel_2, tel_3</code></td><td><b>SÍ</b>, siempre</td><td>La misma lista, disfrazada de columnas (<b>grupo repetitivo</b>)</td><td><b>Tabla hija</b> (1:N)</td></tr>
                <tr><td><code>nombre_completo = "Ana Pérez"</code></td><td><b>SÍ</b>, si el negocio usa las partes</td><td>Son <b>dos hechos distintos</b> (nombre y apellido) metidos en un campo. Si hay que <b>ordenar por apellido</b> o saludar por el nombre, no es atómico</td><td><b>Dos columnas</b> <code>nombre</code> y <code>apellido</code>, <b>en la misma tabla</b></td></tr>
                <tr><td><code>direccion = "Av. Mitre 742, Avellaneda"</code></td><td><b>SÍ</b>, mismo motivo</td><td>Calle, altura y localidad son <b>datos distintos</b>; si hay que filtrar por localidad, el campo no sirve</td><td><b>Columnas separadas</b> (o un Value Object embebido)</td></tr>
                <tr><td><code>latitud</code> y <code>longitud</code></td><td><b>NO</b></td><td><b>Cada una ya es un número indivisible.</b> Están bien como están</td><td>Nada que arreglar <i>por 1FN</i></td></tr>
                <tr><td><code>fecha_nacimiento</code>, <code>peso_kg</code>, <code>cuit</code></td><td><b>NO</b></td><td>Un valor único cada uno</td><td>—</td></tr>
              </tbody>
            </table></div>
            <p class="mini"><b>⚠️ El detalle que casi nadie dice:</b> la 1FN se arregla de <b>dos maneras distintas</b> según el caso.
            Si hay <b>varios valores del mismo tipo</b> (una lista) → <b>tabla hija</b>. Si hay <b>un valor con partes</b>
            (nombre completo, dirección) → <b>columnas separadas en la misma tabla</b>. Mandar “nombre y apellido” a una
            tabla hija sería un disparate; y poner los teléfonos como tres columnas, también.</p>
            <p class="mini"><b>Y la atomicidad depende del negocio.</b> Si a este sistema <b>nunca</b> le interesa el
            apellido por separado, <code>nombre_completo</code> puede quedarse como está. Por eso, si lo dejás junto,
            <b>escribilo como supuesto</b>: “<i>asumo que no se requiere ordenar ni buscar por apellido, por lo que
            guardo el nombre completo en un solo campo</i>”. Un supuesto declarado nunca se cobra como error.</p>
          </div>
          <div class="callout warn">
            <div class="callout-title">🚫 Lo que NO es 1FN (acá está la confusión más común)</div>
            <p class="mini"><b>“Que no se mezclen datos de cosas distintas en una misma tabla” NO es la primera forma
            normal.</b> Que en <code>PERSONA</code> aparezcan <code>latitud</code> y <code>longitud</code> no viola 1FN:
            cada uno es un número atómico. La pregunta correcta ahí es otra: <b>¿esos datos describen a la persona, o
            describen a un domicilio?</b></p>
            <ul class="mini">
              <li>Si describen <b>a la persona</b> (dónde está parada, su ubicación actual) → <b>está bien ahí</b>.</li>
              <li>Si describen <b>a otra entidad</b> —el domicilio, que además tiene calle, altura y localidad, y que
              podría repetirse o tener historial— y vos ya tenés un <code>id_domicilio</code> en la tabla, entonces
              <b>sí hay un problema, pero es de 3FN</b> (el dato depende de <code>id_domicilio</code>, no de la
              persona), no de 1FN.</li>
              <li>Si <b>no</b> hay otra entidad y simplemente son los datos de contacto de esa persona, embeberlos es una
              <b>decisión de modelado válida</b> (<b>Value Object</b>): se justifica diciendo que <b>no se reutilizan ni
              se consultan por sí mismos</b>.</li>
            </ul>
            <p class="mini"><b>Resumiendo las tres en una línea:</b> <b>1FN</b> mira <b>adentro de la celda</b> ·
            <b>2FN</b> mira <b>la clave compuesta</b> · <b>3FN</b> mira <b>de quién habla cada columna</b>.</p>
          </div>

          <p class="mini"><b>Dónde aparece en los parciales:</b> “alergias”, “servicios que ofrece el lugar”, “zonas que cubre”, “horarios de atención”, “archivos adjuntos”. <b>Todo lo que en el enunciado esté en plural y separado por comas es una tabla hija.</b></p>

          <h3>2FN — “si la clave son DOS columnas, todo tiene que depender de LAS DOS”</h3>
          <p class="mini"><b>Ojo:</b> esto <b>sólo puede fallar si la clave primaria es compuesta</b> (dos o más columnas). Si la PK es una sola columna y ya cumpliste 1FN, <b>la 2FN se cumple sola</b>. No pierdas tiempo buscándola.</p>
          <p class="mini"><b>La pregunta:</b> <i>¿hay algún dato que se sepa mirando sólo MEDIA clave?</i></p>
          <div class="card">
            <p class="mini"><b>❌ MAL</b> — <code>DETALLE_FACTURA</code>, con PK = <b>(nro_factura, cod_producto)</b></p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>nro_factura <span class="mini">(PK)</span></th><th>cod_producto <span class="mini">(PK)</span></th><th>cantidad</th><th>nombre_producto</th></tr></thead>
              <tbody>
                <tr><td>A-100</td><td>P7</td><td>2</td><td><b>Teclado</b></td></tr>
                <tr><td>A-101</td><td>P7</td><td>1</td><td><b>Teclado</b></td></tr>
                <tr><td>A-102</td><td>P7</td><td>5</td><td><b>Teclado</b></td></tr>
              </tbody>
            </table></div>
            <p class="mini"><b>El truco del dedo:</b> tapá <code>nro_factura</code> con el dedo. ¿Podés saber igual el <code>nombre_producto</code>? <b>Sí</b>, con sólo mirar <code>P7</code>. Entonces ese dato <b>no es del detalle: es del producto</b>, y por eso aparece repetido en las tres filas. En cambio <code>cantidad</code> <b>sí</b> necesita las dos columnas: “2 teclados <b>en la factura A-100</b>”.</p>
            <p class="mini"><b>✅ BIEN:</b> <code>DETALLE_FACTURA(nro_factura, cod_producto, cantidad)</code> y el nombre vive <b>una sola vez</b> en <code>PRODUCTO(cod_producto, nombre)</code>.</p>
            <p class="mini"><b>Qué se rompe si lo dejás:</b> si corregís el nombre a “Teclado mecánico”, tenés que tocar <b>las tres filas</b> (y todas las futuras). Si te olvidás de una, el mismo producto figura con dos nombres distintos.</p>
          </div>

          <h3>3FN — “si el dato describe a OTRA cosa, no va acá”</h3>
          <p class="mini"><b>La pregunta:</b> <i>¿este dato habla del dueño de la fila, o habla de otra cosa?</i></p>
          <div class="card">
            <p class="mini"><b>❌ MAL</b> — <code>EMPLEADO</code>, con PK = <b>legajo</b></p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>legajo <span class="mini">(PK)</span></th><th>nombre</th><th>cod_depto</th><th>nombre_depto</th><th>piso</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>Ana</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
                <tr><td>102</td><td>Luis</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
                <tr><td>103</td><td>Sol</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
              </tbody>
            </table></div>
            <p class="mini"><b>Preguntale a cada columna de quién habla:</b> <code>nombre</code> habla <b>del empleado</b> ✅. <code>piso</code>… <b>no es el piso de Ana: es el piso del departamento</b> ❌. Y se nota a simple vista: “Sistemas / 3” está copiado en todas las filas. La cadena es <code>legajo → cod_depto → piso</code>: el piso depende de <b>algo que no es la clave</b>.</p>
            <p class="mini"><b>✅ BIEN:</b> <code>EMPLEADO(legajo, nombre, cod_depto)</code> + <code>DEPARTAMENTO(cod_depto, nombre, piso)</code>. El piso queda escrito <b>una sola vez</b>.</p>
            <p class="mini"><b>El otro caso de 3FN: los datos que se pueden calcular.</b> <code>subtotal = cantidad × precio</code>, <code>total = neto + iva</code>, <code>edad</code> (sale de la fecha de nacimiento), <code>cantidad_de_items</code> (es un COUNT). <b>Si se puede calcular, no se guarda</b> — salvo que lo justifiques como desnormalización (sección 3).</p>
          </div>

          <h3>Qué pasa si lo dejás mal: las 3 anomalías</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Anomalía</th><th>En criollo</th><th>Con el ejemplo de arriba</th></tr></thead>
            <tbody>
              <tr><td><b>De inserción</b></td><td>No podés cargar una cosa sin inventar otra</td><td>No podés dar de alta el departamento “Marketing” hasta que no tengas un empleado para poner ahí</td></tr>
              <tr><td><b>De actualización</b></td><td>Tenés que cambiar lo mismo en muchos lugares</td><td>Sistemas se muda al piso 5 → hay que editar <b>las tres filas</b>; si fallás en una, quedan dos pisos distintos para el mismo depto</td></tr>
              <tr><td><b>De borrado</b></td><td>Borrás una cosa y se te va otra de regalo</td><td>Se va el último empleado de Sistemas → <b>desaparece el departamento</b> y nadie sabe más que estaba en el piso 3</td></tr>
            </tbody>
          </table></div>

          <div class="callout key">
            <div class="callout-title">CÓMO AUDITAR UN DER EN 60 SEGUNDOS (3 preguntas, en orden)</div>
            <p class="mini"><b>① ¿Hay alguna celda con varios datos adentro, o columnas numeradas (<code>tel_1, tel_2</code>), o una tabla sin PK?</b> → rompe <b>1FN</b>.<br>
            <b>② ¿Hay alguna PK compuesta?</b> Si no hay, saltealo. Si hay: tapá una mitad de la clave con el dedo; <b>si algún dato se sigue sabiendo igual</b> → rompe <b>2FN</b>.<br>
            <b>③ ¿Hay algún nombre o descripción “de otra cosa” metido en la tabla</b> (<code>nombre_depto</code>, <code>nombre_cliente</code>, <code>nombre_categoria</code>, datos del técnico)<b>, o algún campo calculable</b> (<code>total</code>, <code>subtotal</code>, <code>edad</code>, <code>cantidad_de…</code>)? → rompe <b>3FN</b>.</p>
            <p class="mini"><b>Atajo visual:</b> mirá las columnas buscando <b>valores repetidos verticalmente</b>. Si ves la misma palabra copiada en muchas filas (“Sistemas”, “Teclado”, “Palermo”), ahí está la violación: <b>eso es un dato que pertenece a otra tabla</b>.</p>
          </div>

          <div class="callout key">
            <div class="callout-title">CÓMO SE ESCRIBE LA RESPUESTA (son 2 renglones)</div>
            <p class="mini"><b>Fórmula:</b> veredicto + <b>en qué tabla y qué columna</b> + <b>de qué depende en realidad</b> + <b>qué problema causa</b> + <b>cómo se arregla</b> + qué formas <b>sí</b> cumple.</p>
            <p class="mini"><b>Si NO cumple:</b> “<b>No cumple la 3FN</b>: en <i>EMPLEADO</i>, <code>nombre_depto</code> y <code>piso</code> no describen al empleado sino al departamento, o sea que dependen de <code>cod_depto</code>, que no es clave (<b>dependencia transitiva</b>). Eso repite el mismo dato en todas las filas del departamento y genera <b>anomalías de actualización y de borrado</b>: cambiar el piso obliga a editar todas las filas y, al borrar al último empleado, se pierde el departamento. <b>Se corrige</b> sacando <i>DEPARTAMENTO(cod_depto, nombre, piso)</i> y dejando en <i>EMPLEADO</i> sólo la FK. <b>1FN y 2FN sí se cumplen:</b> los campos son atómicos y la PK es simple.”</p>
            <p class="mini"><b>Si SÍ cumple</b> (también hay que fundamentarlo): “<b>Sí, cumple las tres.</b> Cada celda tiene un solo dato y toda tabla tiene PK (1FN); donde la PK es compuesta, ningún campo se puede deducir de una sola de sus partes (2FN); y ningún campo describe a otra entidad ni es calculable: lo de cada cosa vive en su tabla y se referencia por FK (3FN).”</p>
          </div>
          <!-- banco de frases -->
          <h3>Banco de frases: qué escribir en cada caso</h3>
          <p class="mini">Dos situaciones distintas y <b>dos frases distintas</b>: cuando te <b>dan</b> un DER y tenés que decir si cumple, y cuando <b>vos</b> diseñaste y tenés que justificar qué hiciste para normalizar. Adaptá lo que está entre corchetes.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Lo que ves</th><th>❌ Si te preguntan si cumple</th><th>✅ Si lo normalizaste vos</th></tr></thead>
            <tbody>
              <tr>
                <td><b>Una celda con varios datos</b><br><span class="mini">“pollo, maní, lácteos” · “Palermo / Belgrano”</span></td>
                <td>“<b>No cumple 1FN</b>: <code>[campo]</code> guarda <b>varios valores en una sola celda</b>, así que no es atómico. No se puede buscar ni validar por uno de ellos sin partir el texto, agregar uno obliga a reescribir toda la cadena y nada impide que se carguen con formatos distintos.”</td>
                <td>“Para cumplir <b>1FN</b> saqué <code>[campo]</code> a la tabla <b><code>[HIJA]</code></b>, con <b>una fila por valor</b> y FK a <code>[PADRE]</code>. Así cada dato es <b>atómico</b>, se puede buscar, validar e indexar, y no hay límite de cuántos.”</td>
              </tr>
              <tr>
                <td><b>Columnas numeradas</b><br><span class="mini"><code>tel_1, tel_2, tel_3</code> · <code>conector_1..3</code></span></td>
                <td>“<b>No cumple 1FN</b>: <code>[campo]_1..n</code> es un <b>grupo repetitivo</b>. Limita artificialmente la cantidad —el cuarto valor <b>no entra sin modificar la tabla</b>—, deja columnas nulas cuando hay menos, y obliga a repetir la misma consulta por cada columna.”</td>
                <td>“Para cumplir <b>1FN</b> convertí el grupo repetitivo en la <b>entidad</b> <code>[HIJA]</code>, relación <b>1,N</b> con <code>[PADRE]</code>. Ahora se pueden tener <b>cuantos haga falta</b> sin tocar el esquema, y además cada uno puede tener <b>sus propios atributos</b> (estado, número, tipo).”</td>
              </tr>
              <tr>
                <td><b>Tabla sin clave primaria</b></td>
                <td>“<b>No cumple 1FN</b>: la tabla <b>no tiene PK</b>, así que nada impide <b>filas duplicadas</b> y no hay forma de referenciar una fila concreta ni de actualizarla o borrarla con seguridad.”</td>
                <td>“Le puse <b>PK</b> a cada tabla: subrogada por defecto, y <b>UNIQUE</b> sobre la clave natural del negocio (<code>[campo]</code>) para no perder esa restricción.”</td>
              </tr>
              <tr>
                <td><b>PK compuesta y un campo que depende de media clave</b><br><span class="mini"><code>nombre_producto</code> en el detalle</span></td>
                <td>“<b>No cumple 2FN</b>: la PK es <b>compuesta</b> <code>([A], [B])</code> y <code>[campo]</code> depende <b>sólo de <code>[B]</code></b>, no de la clave completa (<b>dependencia parcial</b>). Por eso el mismo valor aparece repetido en todas las filas de ese <code>[B]</code>, y corregirlo obliga a actualizarlas todas.”</td>
                <td>“Para cumplir <b>2FN</b>, <code>[campo]</code> lo dejé en <code>[TABLA_DE_B]</code>, que es de quien realmente depende, y en la intermedia quedó <b>sólo lo que necesita las dos partes de la clave</b> (<code>[cantidad]</code>). Así el dato está escrito <b>una sola vez</b>.”</td>
              </tr>
              <tr>
                <td><b>Nombre o descripción “de otra cosa”</b><br><span class="mini"><code>nombre_depto</code>, <code>nombre_categoria</code>, datos del técnico</span></td>
                <td>“<b>No cumple 3FN</b>: <code>[campo]</code> <b>no describe a <code>[la entidad]</code> sino a <code>[la otra]</code></b>, o sea que depende de <code>[fk]</code>, que <b>no es clave</b> (<b>dependencia transitiva</b>). Genera <b>redundancia</b> y <b>anomalías de actualización y borrado</b>: cambiar <code>[el dato]</code> obliga a editar N filas, y al borrar la última se pierde la información de <code>[la otra entidad]</code>.”</td>
                <td>“Para cumplir <b>3FN</b> extraje la entidad <code>[OTRA]</code> con sus propios atributos y dejé en <code>[ESTA]</code> <b>sólo la FK</b>. El dato queda en <b>un único lugar</b>, se actualiza una sola vez y <code>[OTRA]</code> puede existir aunque no tenga ninguna <code>[ESTA]</code> asociada.”</td>
              </tr>
              <tr>
                <td><b>Campo que se puede calcular</b><br><span class="mini"><code>total</code>, <code>subtotal</code>, <code>edad</code>, <code>cantidad_de…</code></span></td>
                <td>“<b>No cumple 3FN</b>: <code>[campo]</code> es un <b>dato derivado</b> —se obtiene con <code>[SUM/COUNT/resta de fechas]</code>—, así que <b>no aporta información nueva</b> y <b>se desincroniza</b> en cuanto cambia el origen, dejando dos valores que no coinciden.”</td>
                <td>“No almaceno <code>[campo]</code>: lo <b>calculo</b> con <code>[la consulta]</code>. <i>(Y si decidís guardarlo igual:)</i> lo guardo como <b>desnormalización por performance</b> porque <code>[la consulta]</code> se ejecuta <code>[N]</code> veces; declaro <code>[TABLA]</code> como <b>fuente de verdad</b>, encapsulo la actualización en un único punto y dejo un <b>proceso de recálculo</b>.”</td>
              </tr>
              <tr>
                <td><b>Un dato repetido que SÍ tiene que estar</b><br><span class="mini"><code>precio_aplicado</code> en la factura</span></td>
                <td>“<b>Esto NO es una violación:</b> <code>[campo]</code> es el valor <b>al momento del hecho</b>, no una copia del maestro. Si se referenciara el vigente, un cambio posterior <b>reescribiría el pasado</b> y el comprobante dejaría de ser reimprimible. Es <b>desnormalización por consistencia</b>, y lo correcto es <b>conservar también la FK</b>.”</td>
                <td>“Congelé <code>[campo]</code> en <code>[TABLA]</code> porque el documento es <b>inmutable</b>: necesita el valor <b>de ese momento</b>, no el vigente. Conservo la FK para navegar al maestro actual y <b>declaro la decisión</b> para que no se lea como un error de normalización.”</td>
              </tr>
              <tr>
                <td><b>Está todo bien</b></td>
                <td colspan="2">“<b>Sí, cumple las tres.</b> Cada celda tiene <b>un solo dato</b> y toda tabla tiene <b>PK</b> (1FN). Donde la PK es <b>compuesta</b>, ningún campo se puede deducir mirando una sola de sus partes (2FN). Y <b>ningún campo describe a otra entidad ni es calculable</b>: lo de cada cosa vive en su tabla y se referencia por <b>FK</b> (3FN). <i>[Si hay algo replicado:]</i> El único dato repetido es <code>[campo]</code>, y <b>es deliberado</b>: es una desnormalización por <code>[consistencia/performance]</code>, declarada y con la FK conservada.”</td>
              </tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">SI TE PIDEN “¿QUÉ HIZO PARA NORMALIZAR?” — el proceso en 3 movimientos</div>
            <p class="mini"><b>①</b> “Saqué los <b>datos multivaluados</b> (<code>[campo]</code>) a <b>tablas hijas</b> con FK, para que cada celda tenga un solo valor → <b>1FN</b>.”<br>
            <b>②</b> “Revisé las <b>claves compuestas</b> y moví a su tabla todo lo que dependía de <b>una sola parte</b> de la clave (<code>[campo]</code> → <code>[TABLA]</code>) → <b>2FN</b>.”<br>
            <b>③</b> “Extraje como <b>entidades propias</b> los conjuntos de datos que describían <b>a otra cosa</b> (<code>[OTRA]</code>) y dejé sólo la <b>FK</b>; y <b>eliminé los campos calculables</b> → <b>3FN</b>.”<br>
            <b>Y el cierre:</b> “Con eso el modelo queda en <b>3FN</b>: cada hecho está escrito <b>una sola vez</b>, lo que evita las anomalías de <b>inserción, actualización y borrado</b>. Las únicas redundancias que dejé son <b>deliberadas y declaradas</b>: <code>[las que sean]</code>.”</p>
          </div>
          <p class="mini"><b>Dos reglas de oro al redactar:</b> ① <b>nunca digas sólo “no cumple”</b> — siempre <b>qué tabla, qué columna, de qué depende en realidad y qué problema causa</b>; ② <b>si decís que sí cumple, fundamentalo igual</b> recorriendo las tres: un “sí” sin argumento vale lo mismo que no contestar.</p>

          <p class="mini"><b>BCNF</b>, por si la nombran: es un ajuste fino de la 3FN para tablas con <b>varias claves candidatas superpuestas</b> — pide que <b>todo lo que determina a otro dato sea una clave</b>. Prácticamente no cae en el parcial: si llegaste a 3FN limpia, decí que también cumple BCNF.</p>
        </section>

        <!-- ===================== SECCIÓN 3 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 3 · DESNORMALIZACIÓN</span>
          <p class="mini"><b>Definición:</b> decisión de diseño <b>consciente</b> de introducir <b>redundancia controlada</b> en un modelo <b>previamente normalizado</b> —replicando o derivando atributos— para satisfacer un requerimiento que el modelo normalizado no puede cumplir: <b>preservar la consistencia histórica</b> o <b>alcanzar la performance</b> que el negocio exige. <b>No es un error ni un atajo:</b> se toma después de normalizar, se documenta y se justifica. <b>“Desnormalizar sin haber normalizado antes no es desnormalizar: es modelar mal.”</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Criterio</th><th>Normalizado</th><th>Desnormalizado</th></tr></thead>
            <tbody>
              <tr><td>Redundancia</td><td>Mínima o nula</td><td>Controlada y deliberada</td></tr>
              <tr><td>Integridad</td><td>La garantiza el modelo</td><td><b>Responsabilidad de la aplicación</b></td></tr>
              <tr><td>Costo de lectura</td><td>Alto (JOINs, agregaciones)</td><td>Bajo</td></tr>
              <tr><td>Costo de escritura</td><td>Bajo (un solo lugar)</td><td>Alto (propagar cada copia)</td></tr>
              <tr><td><b>Riesgo principal</b></td><td>Degradación de performance</td><td><b>Inconsistencia entre copias</b></td></tr>
              <tr><td>Ámbito</td><td>OLTP / transaccional</td><td>Reporting, OLAP, alta frecuencia de lectura</td></tr>
            </tbody>
          </table></div>
          <div class="grid-2">
            <div class="card">
              <h3>① Forzada por CONSISTENCIA</h3>
              <p class="mini">Datos que <b>deben quedar congelados en el instante del hecho</b>. Si sólo hay FK al dato vigente, <b>cualquier cambio posterior reescribe el pasado</b>. La FK dice “el valor <b>actual</b>”; el negocio necesita “el valor <b>al momento del hecho</b>”. <b>No es performance: el modelo normalizado devuelve un resultado INCORRECTO para el negocio.</b> Aplica a <b>comprobantes, contratos, liquidaciones y auditoría</b> (documentos <b>inmutables</b>).</p>
              <p class="mini"><b>Ej.:</b> <code>precio_unitario_aplicado</code> y <code>descripcion_producto</code> en DETALLE_FACTURA (si el producto pasa de $1.000 a $1.200, todas las facturas emitidas cambiarían de importe). <code>razon_social_emision, cuit_emision, domicilio_emision, cond_iva_emision</code> en FACTURA (el cliente se muda y la factura de hace 6 meses exhibe un domicilio que nunca figuró).</p>
            </div>
            <div class="card">
              <h3>② Forzada por PERFORMANCE</h3>
              <p class="mini">El modelo <b>es correcto pero no responde en los tiempos</b> que el negocio exige. <b>El resultado es el mismo; cambia el costo de obtenerlo.</b> El costo está en los <b>JOINs sobre grandes volúmenes</b> y las <b>agregaciones repetidas</b> (SUM, COUNT, GROUP BY). Se justifica si la relación <b>lectura/escritura es muy asimétrica</b>. <b>Es de ÚLTIMA instancia:</b> antes van <b>índices, reescritura de consultas, caché, particionamiento y réplicas de lectura</b>. <b>Exige MEDICIÓN previa</b> (plan de ejecución, tiempos, volumen), nunca intuición.</p>
              <p class="mini"><b>Ej.:</b> <code>nombre_categoria</code> en PUBLICACION (40.000 consultas/min) — <b>conservando la FK</b>; <code>FACTURA.importe_total</code>; <code>VENTA_DIARIA_POR_SUCURSAL</code> por batch nocturno (base del <b>esquema estrella</b>).</p>
            </div>
          </div>
          <p class="mini"><b>CRITERIO:</b> si el dato <b>integra un documento con valor probatorio → SE COPIA</b>; si sólo sirve para <b>navegar → SE REFERENCIA</b>. · <b>Copiar:</b> domicilio de entrega de un pedido despachado, precio y alícuota de IVA facturados, usuario que aprobó un movimiento, cotización aplicada. · <b>Referenciar:</b> domicilio de contacto, categoría del producto.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Técnica</th><th>En qué consiste</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>Atributo replicado</td><td>Copiar en la hija un atributo del maestro</td><td><code>nombre_categoria</code></td></tr>
              <tr><td>Dato de contexto congelado</td><td>Guardar el valor vigente al momento del hecho</td><td><code>precio_unitario_aplicado</code></td></tr>
              <tr><td>Campo derivado</td><td>Almacenar el resultado de un cálculo</td><td><code>importe_total</code></td></tr>
              <tr><td>Tabla de resumen</td><td>Preagregar por período/dimensión (batch)</td><td><code>VENTA_DIARIA</code></td></tr>
              <tr><td>Vista materializada</td><td>Persistir una consulta, refrescada por el motor</td><td>Ranking de más vendidos</td></tr>
              <tr><td>Fusión 1:1</td><td>Unificar entidades que siempre se leen juntas</td><td>USUARIO + PERFIL</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>EL PRECIO:</b> ① reaparecen las <b>anomalías de actualización</b>; ② la escritura se encarece (UPDATE puntual → propagación con bloqueos); ③ la integridad <b>pasa al software</b> (triggers, servicios, batch); ④ la transacción se amplía (deadlocks) o aparece la <b>ventana de inconsistencia</b>; ⑤ más volumen, índices y backups.</p>
          <p class="mini"><b>Lectura sucia (dirty read):</b> leer datos de una transacción <b>no confirmada</b> que puede hacer rollback (depende del <b>nivel de aislamiento</b>). <b>Distinto:</b> al desnormalizar se lee una <b>copia desactualizada</b> — el dato está confirmado, pero <b>es viejo</b>. <b>Ventana de inconsistencia</b> = tiempo entre el cambio en la fuente de verdad y la actualización de la copia (si es asincrónica → <b>consistencia eventual</b>). <b>La pregunta no es “¿puede haber inconsistencia?” sino “¿CUÁNTA y POR CUÁNTO TIEMPO la tolera el negocio?”</b></p>
          <p class="mini"><b>BUENAS PRÁCTICAS:</b> documentar la decisión y declarar la <b>fuente de verdad</b> · <b>conservar la FK</b> original · prever un <b>proceso de recálculo</b> y reconciliación (<b>todo dato derivado debe ser reconstruible</b>) · <b>monitorear la divergencia</b> · acotar y hacer explícita la ventana · <b>encapsular la actualización en un único punto</b> del código.</p>
        </section>

        <!-- ===================== SECCIÓN 4 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 4 · ORM E IMPEDANCE MISMATCH</span>

          <div class="callout key">
            <div class="callout-title">PRIMERO: ¿cuál es el problema? (sin palabras raras)</div>
            <p class="mini"><b>Tu programa guarda la información de una forma y la base de datos la guarda de otra, y
            no encajan.</b> Eso es todo. El resto son nombres.</p>
            <p class="mini"><b>En el programa</b> tenés <b>objetos</b>, y un objeto puede <b>tener cosas adentro</b>:
            otro objeto, una lista, un conjunto.</p>
            <p class="mini"><b>En la base</b> tenés <b>filas y columnas</b>, y una celda <b>no puede tener cosas
            adentro</b>: sólo un valor simple (un número, un texto, una fecha).</p>
            <div class="grid-2">
              <div class="card">
                <p class="mini"><b>Un objeto Mascota</b></p>
                <p class="mini" style="font-family:monospace;font-size:7.4pt">nombre = "Pepa"<br>
                dueño = <b>→ otro objeto Usuario</b><br>
                historial = <b>[ evento, evento, evento ]</b><br>
                alergias = <b>{ "pollo", "maní" }</b></p>
                <p class="mini">Tiene <b>un objeto adentro</b> y <b>dos listas adentro</b>.</p>
              </div>
              <div class="card">
                <p class="mini"><b>La tabla mascota</b></p>
                <div class="table-wrap"><table class="data">
                  <thead><tr><th>id</th><th>nombre</th><th>id_usuario</th></tr></thead>
                  <tbody><tr><td>7</td><td>Pepa</td><td>3</td></tr></tbody>
                </table></div>
                <p class="mini"><b>Plana.</b> El dueño se volvió <b>un número</b> (una FK) y las listas <b>tuvieron que
                irse a otras tablas</b>.</p>
              </div>
            </div>
            <p class="mini"><b>ORM = el traductor</b> (<i>Object-Relational Mapping</i>, mapeo objeto-relacional). Es la
            técnica de convertir objetos en filas y filas en objetos — y también se les dice ORM a los
            <b>frameworks que lo hacen</b> por vos, como <b>Hibernate</b>, para no escribir el SQL a mano.</p>
            <p class="mini"><b>IMPEDANCE MISMATCH = el nombre del desencaje.</b> Son <b>las cosas que el mundo de los
            objetos tiene y el mundo de las tablas no</b>, y que el traductor tiene que resolver como pueda. El término
            viene de la electrónica (dos circuitos que no acoplan y pierden energía); acá significa simplemente
            <b>“esto no entra tal cual, hay que decidir cómo lo meto”</b>.</p>
            <p class="mini"><b>Son cuatro desencajes, y son cuatro decisiones que vas a tener que justificar en el
            parcial:</b></p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Desencaje</th><th>En el programa…</th><th>En la tabla…</th><th>La decisión que tomás</th></tr></thead>
              <tbody>
                <tr><td><b>1 · Identidad</b><br><span class="mini">¿quién es quién?</span></td><td>Dos objetos son “el mismo” si <b>ocupan el mismo lugar en memoria</b></td><td>Dos filas son la misma si tienen <b>la misma clave primaria</b></td><td><b>¿Qué uso de PK?</b> Un dato real del negocio (<b>clave natural</b>: CUIT, nro. de serie) o <b>un número inventado</b> que no significa nada (<b>clave subrogada</b>: el <code>id</code> autoincremental). <b>Por defecto, subrogada</b> + <code>UNIQUE</code> en el dato real, así no se pierde la restricción</td></tr>
                <tr><td><b>2 · Tipos de dato</b><br><span class="mini">¿cómo lo escribo?</span></td><td><code>String nombre</code>, sin decir cuánto mide. Fechas, booleanos y <b>enums</b> que el lenguaje entiende solo</td><td>Hay que declarar <code>VARCHAR(80)</code>, elegir <code>DATE</code> o <code>DATETIME</code>, y el enum <b>no existe</b></td><td><b>Poner longitudes y precisión</b>, usar <b>DECIMAL</b> para plata (DOUBLE redondea mal) y guardar los enums <b>como texto</b> con un <code>CHECK</code> — nunca como número de posición</td></tr>
                <tr><td><b>3 · Cardinalidad</b><br><span class="mini">¿para qué lado apunta?</span></td><td>Desde la Mascota llegás al Dueño <b>y desde el Dueño volvés a sus Mascotas</b>: se navega <b>en los dos sentidos</b></td><td>Hay <b>una sola FK</b>, y apunta <b>para un solo lado</b>. Las tablas no se navegan “de vuelta”</td><td><b>La FK va del lado “muchos”</b> y el ORM <b>simula</b> la vuelta (en Hibernate, <code>mappedBy</code>). Y las <b>N:M no existen</b>: se parten en dos 1:N con una <b>tabla intermedia</b></td></tr>
                <tr><td><b>4 · Herencia</b><br><span class="mini">el más preguntado</span></td><td>Sensor y Actuador <b>heredan</b> de Dispositivo y comparten sus atributos</td><td><b>La herencia directamente NO EXISTE.</b> Una tabla no puede “heredar” de otra</td><td><b>Hay que aplastarla</b> y elegir cómo: <b>una sola tabla</b> con todo (SINGLE_TABLE), <b>una por clase</b> (JOINED / TABLE_PER_CLASS) o <b>ninguna para el padre</b> (MappedSuperclass). <b>Se elige Y se justifica</b></td></tr>
              </tbody>
            </table></div>
            <p class="mini"><b>Cómo lo decís en el parcial:</b> “Resolví los <b>impedance mismatches</b> así:
            <b>identidad</b> con PK subrogada y UNIQUE en la clave natural; <b>tipos</b> con longitudes declaradas y
            DECIMAL para los importes; <b>cardinalidad</b> con una sola FK del lado muchos y tabla intermedia para las
            N:M; y la <b>herencia</b> con [estrategia] porque [razón].” <b>Esa frase sola ya es medio punto de
            justificación.</b></p>
          </div>
          <p class="mini"><b>Y la definición textual, por si la piden:</b> <b>ORM</b> es la “técnica usada para convertir los tipos de datos con los que trabaja un lenguaje orientado a objetos a tipos de dato con los que trabaja un sistema de base de datos relacional”; al buscar la correspondencia entre ambos mundos aparecen <b>características difíciles de imitar</b>, y a ese <b>desajuste</b> se lo llama <b>impedance mismatch</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>#</th><th>Desajuste</th><th>Problema</th><th>Solución</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><b>Identidad</b></td><td>El objeto cumple <b>unicidad</b>; el registro necesita identificación <b>unívoca</b></td><td>Clave <b>natural</b> (CUIT, nro. serie) o <b>subrogada</b> (autogenerada). Subrogada + UNIQUE en la natural</td></tr>
              <tr><td>2</td><td><b>Conversión de tipos</b></td><td>String sin límite vs <b>VARCHAR(n)</b>; precisión de decimales; <b>LocalDate</b> vs Date/Datetime/Time; booleanos; <b>enumerados</b></td><td>length/precision/scale; DECIMAL para dinero; <b>converters</b> para enums</td></tr>
              <tr><td>3</td><td><b>Cardinalidad</b></td><td>En POO hay <b>navegabilidad bidireccional</b>; en relacional <b>las relaciones NO son bidireccionales</b></td><td>Una sola FK del lado “muchos” + <code>mappedBy</code>; N:M → tabla intermedia</td></tr>
              <tr><td>4</td><td><b>Herencia</b></td><td><b>No existe en el mundo relacional.</b> ¿Cuántas tablas? ¿cómo sabe el ORM qué clase instanciar?</td><td>SINGLE_TABLE · JOINED · TABLE_PER_CLASS · MAPPED_SUPERCLASS</td></tr>
            </tbody>
          </table></div>
          <div class="grid-2">
            <div class="card">
              <h3>Active Record</h3>
              <p class="mini">El ORM <b>decora las entidades de dominio</b> con responsabilidades de persistencia: <code>save</code>, <code>delete</code>, <code>update</code>, <code>find/findBy/findAll</code>. <b>El objeto se persiste a sí mismo.</b> Rails, Eloquent, Django. ⚠️ Rompe <b>Responsabilidad Única</b> y acopla el dominio a la infraestructura.</p>
            </div>
            <div class="card">
              <h3>Data Mapper</h3>
              <p class="mini">Agrega un <b>componente intermedio</b> entre la base y las entidades: el <b>“entity manager”</b>, responsable de buscar, agregar, modificar y eliminar. <b>La entidad no sabe que se persiste.</b> <b>Hibernate/JPA</b>, Doctrine. ✅ Dominio limpio y testeable.</p>
            </div>
          </div>
          <p class="mini"><b>HIDRATACIÓN, en criollo:</b> la base te devuelve <b>una fila</b> (números y textos sueltos); el ORM tiene que <b>armar el objeto</b> con eso. “Hidratar” es <b>rellenar el objeto vacío con los datos de la fila</b>, como quien infla un globo desvinflado. Son <b>dos pasos</b>: ① <b>crear</b> el objeto vacío (después de hacer el SELECT) y ② <b>llenarle los atributos</b> con los valores que vinieron.</p>
          <p class="mini"><b>LAZY vs EAGER, en criollo:</b> cuando traés una Mascota, <b>¿le traés también sus 200 eventos médicos?</b> <b>EAGER</b> = sí, los traigo <b>por las dudas</b> (y si no los usás, trajiste 200 filas al pedo). <b>LAZY</b> = no, los dejo para después; <b>recién voy a buscarlos a la base si alguien los pide</b>. Por eso las <b>listas</b> son lazy por defecto y las referencias de a uno (<code>@ManyToOne</code>) son eager. <b>El riesgo del lazy</b> es el <b>N+1</b>: si listás 100 mascotas y dentro de un <code>for</code> le pedís el dueño a cada una, el ORM hace <b>1 consulta + 100 consultas</b> sin que lo veas. Se cura pidiendo las dos cosas juntas <b>en esa consulta puntual</b> (<code>JOIN FETCH</code>), no cambiando todo a eager.</p>
          <p class="mini"><b>Y la definición de la cátedra — HIDRATACIÓN</b> (“¿cómo recupera un ORM un objeto?”): <b>1)</b> <b>instanciar</b> la clase (previo SELECT de los datos mínimos); <b>2)</b> <b>popular</b> el objeto asignando a cada atributo <b>no marcado como lazy</b> los valores recuperados. Si está <b>lazy</b>, el ORM <b>no lo setea</b>: lo popula de forma transparente <b>cuando se lo llama explícitamente</b>.</p>
          <p class="mini"><b>LAZY</b> = carga en memoria <b>sólo al momento de su utilización</b> (default de <code>@OneToMany</code>/<code>@ManyToMany</code>); ⚠️ <b>N+1 queries</b> (1 + N consultas) → se resuelve con <b>JOIN FETCH</b> puntual, no cambiando el mapeo global; y <code>LazyInitializationException</code> si la sesión se cerró. <b>EAGER</b> = carga <b>independientemente de si van a ser utilizados</b> (default de <code>@ManyToOne</code>/<code>@OneToOne</code>); ⚠️ trae datos de más.</p>
          <p class="mini"><b>CASCADA:</b> “cuando realicemos una acción en la entidad objetivo, <b>la misma acción se aplicará a la asociada</b>”. <b>ALL</b> (todas) · <b>PERSIST</b> (guardar) · <b>MERGE</b> (actualizar) · <b>REMOVE</b> (eliminar) · <b>REFRESH</b> (re-popular) · <b>DETACH</b> (quitar del contexto persistente). Ejemplo de la cátedra: Persona–Dirección, la dirección no tiene significado sin la persona → al eliminar Persona se elimina Dirección. <b>Regla:</b> cascade ALL donde hay <b>composición ◆</b>; sin REMOVE donde hay <b>agregación ◇</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Caché</th><th>Alcance</th><th>Detalle</th></tr></thead>
            <tbody>
              <tr><td><b>1er nivel</b></td><td><b>Sesión</b></td><td>Cada instancia <b>se carga sólo una vez</b> en el contexto persistente; <b>termina al cerrar la sesión</b>; aísla sesiones concurrentes. <b>Siempre activa.</b></td></tr>
              <tr><td><b>2do nivel</b></td><td><b>SessionFactory</b></td><td><b>Compartida por todas las sesiones</b> de la misma factory; <b>no todos los ORM la tienen</b>. Al buscar por id: 1er nivel → 2do nivel (se obtiene el estado, <b>se hidrata</b>) → búsqueda normal.</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Estrategias de concurrencia (2do nivel):</b> <b>READ_ONLY</b> (entidades que nunca cambian; muy adecuada) · <b>NONSTRICT_READ_WRITE</b> (se actualiza <b>después</b> del commit; <b>pequeña ventana de datos obsoletos</b>; tolera inconsistencia mínima) · <b>READ_WRITE</b> (<b>consistencia fuerte</b> con <b>bloqueos “suaves”</b>; las transacciones concurrentes sobre registros bloqueados <b>van al medio persistente</b>). <b>Representación interna:</b> no se guardan objetos sino <b>su estado</b>; <b>no</b> se guardan atributos transitorios; <b>no</b> se guardan colecciones (salvo que se explicite); en relaciones <b>xToOne sólo el id</b>.</p>
        </section>

        <!-- ===================== SECCIÓN 5 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 5 · HIBERNATE Y MAPEO DE HERENCIA</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Annotation</th><th>Equivale a</th></tr></thead>
            <tbody>
              <tr><td><code>@Entity</code> / <code>@Table(name)</code></td><td>Una tabla</td></tr>
              <tr><td><code>@Id</code> + <code>@GeneratedValue(IDENTITY|SEQUENCE|TABLE|AUTO)</code></td><td>PK (<b>subrogada</b>). Clave <b>natural</b> → <code>@Id</code> <b>sin</b> GeneratedValue</td></tr>
              <tr><td><code>@Column(nullable=false, unique=true, length, precision, scale)</code></td><td>NOT NULL · UNIQUE · VARCHAR(n) · DECIMAL(p,s)</td></tr>
              <tr><td><code>@Transient</code></td><td><b>No se persiste</b> (calculado)</td></tr>
              <tr><td><code>@OneToOne</code> + <code>@JoinColumn(unique=true)</code></td><td>FK + UNIQUE del lado dependiente</td></tr>
              <tr><td><code>@ManyToOne(optional=false)</code> + <code>@JoinColumn(nullable=false)</code></td><td><b>FK del lado “muchos”</b> (dueño), NOT NULL</td></tr>
              <tr><td><code>@OneToMany(mappedBy="…", cascade, orphanRemoval)</code></td><td>Lado <b>inverso</b> (no crea columna)</td></tr>
              <tr><td><code>@ManyToMany</code> + <code>@JoinTable(joinColumns, inverseJoinColumns)</code></td><td><b>Tabla intermedia</b></td></tr>
              <tr><td><code>@ElementCollection</code> + <code>@CollectionTable</code></td><td><b>Tabla hija</b> para colección de <b>tipos simples</b> (resuelve 1FN)</td></tr>
              <tr><td><code>@Embeddable</code> / <code>@Embedded</code></td><td><b>Value Object</b>: sus columnas viven <b>en la tabla del dueño</b> (sin identidad propia)</td></tr>
              <tr><td><code>@Enumerated(EnumType.STRING)</code></td><td>VARCHAR + CHECK. <b>NUNCA ORDINAL</b> (guarda 0,1,2: si se reordena el enum, los históricos quedan mal)</td></tr>
              <tr><td><code>@Converter</code> / <code>AttributeConverter</code></td><td>Control del valor almacenado (enum con código propio)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Defaults de fetch:</b> <code>@ManyToOne</code> y <code>@OneToOne</code> = <b>EAGER</b>; <code>@OneToMany</code> y <code>@ManyToMany</code> = <b>LAZY</b>. · <b>Si la N:M tiene datos propios</b> (nota, fecha, cantidad): <b>NO uses @ManyToMany</b>, creá la <b>entidad intermedia</b> con dos <code>@ManyToOne</code>. · <b>Catálogo administrable → TABLA maestra</b> (“los configura un administrador”); <b>conjunto cerrado → enum con CHECK</b>.</p>
          <h3>⭐ Las 4 estrategias de herencia</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estrategia</th><th>Tablas</th><th>Polimórfica</th><th>✅</th><th>⚠️</th><th>Elegila cuando</th></tr></thead>
            <tbody>
              <tr><td><b>SINGLE_TABLE</b></td><td><b>1</b> (columna por atributo de <b>todas</b> las clases + <b>discriminador</b>)</td><td>Directa</td><td>Mejor performance (una sola tabla)</td><td>Columnas <b>NULL</b>; sin NOT NULL por subtipo</td><td>Pocos atributos propios y mucha lectura polimórfica</td></tr>
              <tr><td><b>JOINED</b></td><td><b>1 + N</b>; la <b>PK de cada hija es FK</b> a la super</td><td>Con <b>JOIN</b></td><td>Normalizada, sin nulos</td><td>JOINs en cada lectura</td><td>Subtipos con muchos atributos propios y obligatorios</td></tr>
              <tr><td><b>TABLE_PER_CLASS</b></td><td><b>N</b> (sólo concretas); los atributos de la super <b>se repiten</b> en cada una</td><td>Con <b>UNION</b></td><td>Subtipos independientes</td><td>Duplica atributos comunes; UNIONs</td><td>Casi nunca se consulta polimórficamente</td></tr>
              <tr><td><b>MAPPED_SUPERCLASS</b></td><td><b>N</b>; la super <b>NO es entidad</b> (no tiene tabla)</td><td><b>No existe</b></td><td>Simple, reutiliza código</td><td>Sin polimorfismo ni relaciones a la super</td><td>La super sólo aporta <b>comportamiento</b> o 1-2 atributos (id, activo)</td></tr>
            </tbody>
          </table></div>
          <div class="callout key"><p class="mini"><b>FRASE PARA JUSTIFICAR:</b> “Mapeo la jerarquía con <b>SINGLE_TABLE</b> y discriminador porque los subtipos agregan <b>pocos atributos propios</b> y <b>todas las consultas son polimórficas</b> (‘los dispositivos del domicilio’): evito JOINs y UNIONs, asumiendo columnas nulables. Si los subtipos tuvieran muchos atributos obligatorios propios, elegiría <b>JOINED</b> para no perder las restricciones NOT NULL.”</p></div>
                  <div class="callout key">
            <div class="callout-title">EJEMPLO: la MISMA jerarquía con las 3 estrategias</div>
            <p><b>El modelo de objetos:</b> <code>Dispositivo(nro_serie, modelo)</code> y de él heredan
            <code>Sensor(frecuencia_seg)</code> y <code>Actuador(tipo_accion)</code>.</p>
            <div class="table-wrap"><table class="data">
              <thead><tr><th style="width:18%">Estrategia</th><th>Tablas que genera</th><th>“Traeme todos los dispositivos del domicilio”</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>SINGLE_TABLE</b></td>
                  <td><b>1 tabla:</b><br><code>dispositivo(nro_serie, <b>tipo</b>, modelo, frecuencia_seg, tipo_accion)</code><br><span class="mini">En un Sensor, <code>tipo_accion</code> queda <b>NULL</b>; en un Actuador, <code>frecuencia_seg</code> queda <b>NULL</b></span></td>
                  <td><b>Un SELECT directo</b>, sin joins. <b>La más rápida.</b></td>
                </tr>
                <tr>
                  <td><b>JOINED</b></td>
                  <td><b>3 tablas:</b><br><code>dispositivo(nro_serie PK, modelo)</code><br><code>sensor(nro_serie PK <b>y FK</b>, frecuencia_seg)</code><br><code>actuador(nro_serie PK <b>y FK</b>, tipo_accion)</code></td>
                  <td>Con <b>JOIN</b> a las hijas. <b>Sin columnas nulas</b>: se puede exigir NOT NULL por subtipo.</td>
                </tr>
                <tr>
                  <td><b>TABLE_PER_CLASS</b></td>
                  <td><b>2 tablas</b> (sólo las concretas):<br><code>sensor(nro_serie, <b>modelo</b>, frecuencia_seg)</code><br><code>actuador(nro_serie, <b>modelo</b>, tipo_accion)</code><br><span class="mini"><code>modelo</code> <b>se repite</b> en las dos</span></td>
                  <td>Con <b>UNION</b> entre las dos tablas.</td>
                </tr>
                <tr>
                  <td><b>MAPPED<br>SUPERCLASS</b></td>
                  <td><b>2 tablas</b>, y <b>la superclase NO es entidad</b> (no tiene tabla ni se puede consultar)</td>
                  <td><b>No se puede.</b> No existe la consulta polimórfica.</td>
                </tr>
              </tbody>
            </table></div>
            <p><b>Cómo se elige, en una pregunta:</b> <b>¿los subtipos agregan muchos atributos propios y
            obligatorios?</b> Si <b>no</b> (uno o dos cada uno) y además siempre se consultan juntos →
            <b>SINGLE_TABLE</b>, aceptando columnas nulas. Si <b>sí</b> → <b>JOINED</b>, para no perder los NOT NULL.
            Si la superclase <b>sólo aporta comportamiento o un id y un “activo”</b> → <b>MappedSuperclass</b>.</p>
          </div>
</section>

        <!-- ===================== SECCIÓN 6 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 6 · NOSQL Y PERSISTENCIA POLÍGLOTA</span>
          <h3>SQL vs NoSQL: la comparación que puede caer como pregunta</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:19%"></th><th>RELACIONAL (SQL)</th><th>NO RELACIONAL (NoSQL)</th></tr></thead>
            <tbody>
              <tr><td><b>Cómo guarda</b></td><td><b>Tablas</b>: filas y columnas, con esquema <b>fijo</b> definido de antemano</td><td>Documentos, clave-valor, grafos, columnas… con <b>esquema dinámico</b></td></tr>
              <tr><td><b>Esquema</b></td><td><b>Rígido:</b> cambiarlo exige <code>ALTER TABLE</code> y migración</td><td><b>Flexible:</b> se agregan campos sin migrar. <b>Menos necesidad de planificar de antemano</b></td></tr>
              <tr><td><b>Relaciones</b></td><td><b>FK e integridad referencial garantizadas por el motor</b>; JOINs</td><td>Casi no hay: se <b>anida</b> o se guarda el id y se resuelve <b>en la aplicación</b></td></tr>
              <tr><td><b>Transacciones</b></td><td><b>ACID completo</b></td><td>Habitualmente <b>limitadas</b>; muchas priorizan disponibilidad sobre consistencia inmediata</td></tr>
              <tr><td><b>Consistencia</b></td><td><b>Fuerte:</b> leés lo último confirmado</td><td>Frecuentemente <b>eventual</b>: tarda en propagarse entre réplicas</td></tr>
              <tr><td><b>Escalado</b></td><td>Naturalmente <b>vertical</b>; el horizontal exige sharding y es costoso</td><td><b>Horizontal nativo:</b> es <b>distribuida por diseño</b></td></tr>
              <tr><td><b>Consultas</b></td><td><b>SQL</b>: potente y estándar, agregaciones y cruces arbitrarios</td><td>Lenguaje propio, <b>limitado al patrón de acceso</b> para el que fue diseñada</td></tr>
              <tr><td><b>Modelado</b></td><td>Se <b>normaliza</b>: un dato, un solo lugar</td><td>Se <b>desnormaliza a propósito</b>: el modelo se diseña <b>para la consulta</b></td></tr>
              <tr><td><b>Madurez</b></td><td>Ecosistema y perfiles muy maduros</td><td>Herramientas y gente capacitada <b>menos maduras</b></td></tr>
              <tr><td><b>✅ Conviene si…</b></td><td>Hay <b>relaciones e integridad</b> que cuidar, se necesita <b>consistencia fuerte</b> y <b>transacciones</b>, y las consultas son variadas. <b>El dominio transaccional del parcial va acá</b></td><td>El <b>volumen es enorme</b>, el <b>esquema varía</b>, el <b>patrón de acceso es conocido y acotado</b>, y hace falta <b>escalar horizontalmente</b> y alta disponibilidad</td></tr>
              <tr><td><b>⚠️ Su debilidad</b></td><td>Escalar horizontalmente y los esquemas muy variables</td><td><b>Pierde integridad referencial y ACID</b>, y <b>duplica datos</b>: las copias se mantienen a mano</td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">LA FRASE QUE HAY QUE DECIR SIEMPRE</div>
            <p>“<b>La decisión entre relacional y no relacional es en gran medida CONTEXTUAL y varía según el CASO DE
            USO.</b>” <b>Nunca es “NoSQL es mejor”.</b> Y lo que más suma: proponer <b>persistencia políglota</b> — el
            dominio transaccional en relacional y <b>sólo el servicio que lo necesita</b> en NoSQL — nombrando el costo
            de operar dos motores.</p>
          </div>

          <h3>Qué es NoSQL</h3>
          <p>Enfoque que permite <b>almacenar y consultar datos fuera de las estructuras tabulares</b> tradicionales,
          con <b>esquema dinámico</b> para datos no estructurados. Es además una <b>base distribuida</b>: la información
          <b>se copia en varios servidores</b>, lo que garantiza disponibilidad y fiabilidad — si algunos datos se
          desconectan, <b>el resto sigue funcionando</b>.</p>

          <div class="table-wrap"><table class="data">
            <thead><tr><th>Tipo</th><th>Cómo guarda</th><th>Producto</th><th>Cuándo proponerla</th><th>⚠️ Límite</th></tr></thead>
            <tbody>
              <tr><td><b>Documentos</b></td><td>JSON/BSON; <b>estructura distinta por documento</b></td><td><b>MongoDB</b></td><td>Catálogo de productos, CMS, perfiles enriquecidos, datos variables</td><td>Duplicación por anidamiento; <b>ACID limitado</b></td></tr>
              <tr><td><b>Clave-Valor</b></td><td>Clave única → valor</td><td><b>Redis</b>, DynamoDB</td><td><b>Sesiones, tokens, CACHÉ</b>, carritos, preferencias</td><td><b>No busca por contenido</b>; sin relaciones; consistencia eventual</td></tr>
              <tr><td><b>Grafos</b></td><td><b>Nodos + arcos</b>, con propiedades en <b>ambos</b></td><td><b>Neo4j</b></td><td>Redes sociales, <b>recomendación</b>, <b>detección de fraude</b>, dependencias de TI</td><td>Escalabilidad horizontal; <b>análisis agregados masivos</b></td></tr>
              <tr><td><b>Familia de Columnas</b></td><td>Filas por clave con <b>columnas dinámicas</b> (column families)</td><td><b>Cassandra</b>, HBase</td><td><b>Escritura masiva</b> + lectura por clave: historiales, feeds, <b>IoT</b>, multi-región</td><td><b>Sin consultas complejas ni cruces</b>; compactaciones; diseño orientado a la consulta</td></tr>
              <tr><td><b>Orientada a Columnas</b></td><td>Columnar: valores de cada columna <b>contiguos</b></td><td><b>BigQuery</b>, Redshift</td><td><b>OLAP</b>: BI, data warehouse, reportes y <b>agregaciones</b> históricas</td><td><b>Escrituras lentas</b>; latencia al traer registros completos</td></tr>
              <tr><td><b>Series Temporales</b></td><td>Datos en orden <b>cronológico</b></td><td><b>InfluxDB</b>, Timescale, Prometheus</td><td><b>Sensores/lecturas</b>, métricas y monitoreo, cotizaciones</td><td>Almacenamiento sin <b>retención</b>; poco flexible para lo no temporal</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>⚠️ Familia de Columnas vs. Orientada a Columnas:</b> <b>Familia</b> (Cassandra/HBase) = modelo NoSQL <b>de agregados</b>, filas con columnas dinámicas, <b>OLTP distribuido de alto volumen</b> (acceso <b>por clave</b>). <b>Orientada</b> (BigQuery/Redshift) = <b>estrategia de almacenamiento físico columnar</b>, esquema fijo, <b>OLAP</b> analítico. Las orientadas a columnas se parecen al relacional (tablas, SQL) pero priorizan <b>velocidad de lectura y agregación</b> sobre la integridad transaccional: <b>no ACID completo</b>.</p>
          <p class="mini"><b>PERSISTENCIA POLÍGLOTA:</b> usar <b>diferentes tipos de bases en una misma aplicación o ecosistema</b>, eligiendo la tecnología que mejor se adapte a cada necesidad. ✅ la base adecuada para cada caso; mejor rendimiento y escalabilidad; flexibilidad de tipos de datos. ⚠️ más complejidad y costo de administración; hay que <b>integrar y sincronizar</b> para evitar inconsistencias y duplicados; desarrollo y pruebas más difíciles.</p>
          <div class="callout key"><p class="mini"><b>RESPUESTAS LISTAS:</b> lecturas de sensores → <b>TSDB</b> · estadísticas/reportes históricos → <b>columnar (OLAP)</b> · sesiones, tokens, caché de consultas repetidas → <b>clave-valor (Redis)</b> · catálogo con atributos variables / contenido → <b>documentos (MongoDB)</b> · recomendación, fraude, redes → <b>grafos (Neo4j)</b> · historial de mensajes/feeds a gran escala, IoT multi-región → <b>familia de columnas (Cassandra)</b>. Y agregá: “la decisión es contextual según el caso de uso; el resto del dominio transaccional sigue en relacional” → <b>persistencia políglota</b>.</p></div>
                  <div class="callout key">
            <div class="callout-title">EJEMPLO TRABAJADO: cómo se responde “¿qué base NoSQL propone?”</div>
            <p><b>Enunciado:</b> “El Servicio de Recepción recibe lecturas de cientos de sensores de forma
            <b>periódica y masiva</b>, que luego se consultan para graficar la evolución y calcular promedios por
            franja horaria.”</p>
            <p><b>Respuesta modelo:</b> “Propongo una <b>base de series temporales</b> (InfluxDB, TimescaleDB).
            <b>Por qué:</b> el patrón de acceso es <b>escritura masiva append-only</b> con marca de tiempo y
            <b>consulta por rango de fechas</b> con agregaciones, que es exactamente para lo que están optimizadas;
            además ofrecen <b>retención y downsampling</b> (alta resolución poco tiempo, baja resolución mucho tiempo),
            que resuelve el volumen. <b>Por qué no relacional:</b> millones de filas por día harían las agregaciones
            cada vez más lentas, y el esquema fijo no aporta nada porque <b>acá no hay relaciones que cuidar</b>.
            <b>Costo que asumo:</b> es poco flexible para consultas no temporales y suma un motor para operar, así que
            el <b>resto del dominio sigue en relacional</b> — <b>persistencia políglota</b>.”</p>
            <p><b>La plantilla, en 5 pasos:</b> ① el <b>tipo</b> (no la marca) · ② <b>el patrón de acceso</b> que lo
            justifica · ③ <b>por qué no el relacional</b> · ④ el <b>costo</b> que asumís · ⑤ <b>qué queda</b> en
            relacional.</p>
          </div>
</section>

        <!-- ===================== SECCIÓN 7 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 7 · CÓMO ARMAR EL MODELO DE DATOS (40 pts)</span>

          <p><b>Lo que piden, textual, todos los años:</b> “indicando las entidades con sus respectivos campos,
          <b>claves primarias</b>, <b>foráneas</b>, <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b> según
          corresponda”. Y además: <b>enumerar las entidades</b>, <b>indicar los supuestos</b> y <b>justificar</b>.
          Son <b>tres entregables</b>, no uno: la lista, el dibujo y el texto. <b>El texto vale casi tanto como el
          dibujo.</b></p>

          <h3>PASO 1 · Leé entero sin escribir. En la segunda pasada, subrayá</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:38%">Si el enunciado dice…</th><th>Poné en el modelo…</th></tr></thead>
            <tbody>
              <tr><td>Un sustantivo con datos propios (Mascota, Zona, Técnico)</td><td><b>Entidad</b> → una tabla con PK</td></tr>
              <tr><td>“De cada X se conoce…”</td><td><b>Atributos</b> de X</td></tr>
              <tr><td>“tiene varios”, “uno o más”, “puede incluir”</td><td><b>1:N</b> → la FK va del lado <b>N</b></td></tr>
              <tr><td>“múltiples… y a su vez…”</td><td><b>N:M</b> → tabla <b>intermedia</b> con PK compuesta</td></tr>
              <tr><td>“al menos uno”</td><td>Modalidad <b>obligatoria</b> → FK <b>NOT NULL</b></td></tr>
              <tr><td>“puede tener”, “opcional”</td><td>Modalidad <b>opcional</b> → FK admite <b>NULL</b></td></tr>
              <tr><td>“único”, “identificatorio”, “código”, “nro. de serie”</td><td><b>UNIQUE</b> (la PK puede seguir siendo subrogada)</td></tr>
              <tr><td>“<b>historial</b>”, “bitácora”, “trazabilidad”, “qué pasó y cuándo”</td><td><b>Tabla de eventos</b> con <code>fecha_hora</code>, una fila por hecho. <b>Está en 23 de 24 enunciados</b></td></tr>
              <tr><td>“<b>estadísticas</b>”, “el más…”, “top 10”, “promedio”</td><td>La estadística <b>no es una tabla</b>: modelá el <b>hecho</b>. Si no podés escribir el COUNT/SUM, <b>falta una tabla</b></td></tr>
              <tr><td>“<b>predefinido</b>”, “catálogo”, “lo configura un administrador”</td><td><b>Tabla catálogo</b> + <b>intermedia</b> con lo elegido (no un enum)</td></tr>
              <tr><td>“<b>puede ajustar los parámetros</b>”, “configurable”</td><td>El valor va <b>en la intermedia</b>, <b>nunca en el catálogo</b></td></tr>
              <tr><td>“estado”, “pasa por…”, “acepta o rechaza”</td><td><code>estado VARCHAR</code> + <b>CHECK</b>. <b>Nunca BOOLEAN</b> si hay más de dos valores</td></tr>
              <tr><td>“vigente desde”, “cambia en el tiempo”, “histórico de precios”</td><td><code>vigente_desde</code> <b>dentro de la PK</b> + <code>vigente_hasta</code> NULL en la fila actual</td></tr>
              <tr><td>“adjuntos”, “fotos”, “documentos”</td><td>Tabla hija con la <b>URL</b> (object storage). <b>Nunca un BLOB</b></td></tr>
              <tr><td>“al momento de”, “el precio aplicado”, “comprobante”</td><td><b>Dato congelado</b> (desnormalización por consistencia), <b>conservando la FK</b></td></tr>
            </tbody>
          </table></div>

          <h3>PASO 2 · Dibujá el esqueleto ANTES que los atributos</h3>
          <p>Sólo las <b>cajas con su nombre, la PK y las FK</b>, y las <b>líneas</b> entre ellas. Nada más.</p>
          <p><b>Por qué:</b> si empezás escribiendo los atributos de la primera entidad, llegás a la mitad de la hoja y
          descubrís que falta una tabla en el medio. Con el esqueleto, <b>mover una caja todavía cuesta cero</b>. Es el
          paso que más tiempo ahorra y el que casi nadie hace.</p>

          <h3>PASO 3 · Recién ahora completá atributos, tipos y restricciones</h3>
          <div class="grid-2">
            <div class="card">
              <p><b>Tipos de dato</b></p>
              <div class="table-wrap"><table class="data">
                <tbody>
                  <tr><td><code>INT</code> / <code>BIGINT</code></td><td>ids, cantidades</td></tr>
                  <tr><td><b><code>DECIMAL(p,s)</code></b></td><td><b>dinero y medidas exactas</b></td></tr>
                  <tr><td><code>FLOAT</code> / <code>DOUBLE</code></td><td>medidas aproximadas (lat/long, temperatura)</td></tr>
                  <tr><td><code>VARCHAR(n)</code></td><td>texto corto o mediano</td></tr>
                  <tr><td><code>CHAR(n)</code></td><td>largo fijo (país, moneda)</td></tr>
                  <tr><td><code>TEXT</code></td><td>texto largo (descripción)</td></tr>
                  <tr><td><code>BOOLEAN</code></td><td>sí/no <b>real</b>, sólo dos valores</td></tr>
                  <tr><td><code>DATE</code> · <code>TIME</code> · <code>DATETIME</code></td><td>fecha · hora · ambas</td></tr>
                  <tr><td><code>BLOB</code></td><td><b>evitalo: guardá la URL</b></td></tr>
                </tbody>
              </table></div>
              <p><b>DNI, CUIT, teléfono y CP → <code>VARCHAR</code></b> (no se hacen cuentas y pueden tener ceros a la
              izquierda o guiones). <b>Dinero nunca en <code>DOUBLE</code></b>.</p>
            </div>
            <div class="card">
              <p><b>Claves y restricciones</b></p>
              <div class="table-wrap"><table class="data">
                <tbody>
                  <tr><td><b>PK</b></td><td>único por fila, <b>no puede ser NULL</b></td></tr>
                  <tr><td><b>FK</b></td><td>referencia a la PK de otra tabla</td></tr>
                  <tr><td><b>PK FK</b></td><td>parte de la PK <b>y</b> FK: lo típico de la <b>intermedia</b></td></tr>
                  <tr><td><b>UNIQUE</b></td><td>no se repite, pero no es la PK</td></tr>
                  <tr><td><b>NOT NULL</b></td><td>obligatorio ↔ <b>modalidad 1</b></td></tr>
                  <tr><td><b>NULL</b></td><td>opcional ↔ <b>modalidad 0</b></td></tr>
                  <tr><td><b>CHECK</b></td><td><code>(estado IN (…))</code>, <code>(peso &gt; 0)</code></td></tr>
                  <tr><td><b>DEFAULT</b></td><td><code>activo DEFAULT true</code></td></tr>
                  <tr><td><b>AI</b></td><td>el id se genera solo → clave <b>subrogada</b></td></tr>
                  <tr><td><b>PK compuesta</b></td><td><code>(id_locker, nro_casillero)</code></td></tr>
                  <tr><td><b>UK compuesta</b></td><td><code>UNIQUE (id_rutina, nombre)</code></td></tr>
                </tbody>
              </table></div>
            </div>
          </div>

          <h3>PASO 4 · Revisá línea por línea</h3>
          <ul>
            <li>La <b>pata de gallo</b> va del lado donde está la <b>FK</b> (el lado “muchos”).</li>
            <li>Si la entidad <b>puede existir sin</b> la otra → <code>o</code> (opcional). Si <b>no puede</b> → <code>|</code> (obligatoria).</li>
            <li><b>Ninguna tabla queda suelta</b> sin relaciones.</li>
            <li>Escribí la lectura <b>en palabras</b> al lado: “un Locker tiene <b>uno o muchos</b> Casilleros / un Casillero pertenece a <b>exactamente un</b> Locker”.</li>
          </ul>
          <p><b>Notación:</b> <code>1,1</code> exactamente uno · <code>0,1</code> cero o uno · <code>1,N</code> uno o
          muchos · <code>0,N</code> cero o muchos.</p>

          <h3>PASO 5 · Escribí 3 a 5 supuestos</h3>
          <p>Un supuesto convierte una ambigüedad en una <b>decisión defendible</b>. Ejemplos de arranque:
          “<i>asumo que una mascota tiene un solo dueño</i>”, “<i>asumo que no existe locker sin casilleros, por eso la
          modalidad es 1</i>”, “<i>asumo que los tipos de evento los administra la plataforma, por eso van como tabla y
          no como enum</i>”.</p>

          <h3>PASO 6 · Escribí la justificación: son 3 párrafos y son siempre los mismos</h3>
          <p><b>a) Qué elementos es necesario persistir</b></p>
          <p>“Persisto las entidades con <b>identidad y ciclo de vida propio</b> que el sistema debe recuperar entre
          ejecuciones. <b>No persisto</b>: los objetos de cálculo ni los resultados derivables, los DTOs de la capa de
          presentación, las clases que sólo son comportamiento (State, Strategy) ni los archivos binarios — van a
          <b>object storage</b> y la base guarda la <b>URL</b>. Los <b>Value Objects</b> sin identidad propia se
          persisten <b>embebidos</b> en la tabla de su dueño.”</p>
          <p><b>b) Cómo resolví los impedance mismatches</b></p>
          <p>“<b>Identidad:</b> PK <b>subrogada</b> en todas, salvo donde hay clave natural clara (nro. de serie), y
          <b>UNIQUE</b> sobre las claves naturales del negocio. <b>Tipos:</b> VARCHAR con longitud, DATE/DATETIME y
          <b>DECIMAL</b> para importes (no DOUBLE). <b>Cardinalidad:</b> las relaciones bidireccionales se implementan
          con <b>una sola FK</b> del lado muchos; las N:M se parten en dos 1:N con tabla intermedia. <b>Herencia:</b>
          [estrategia] porque [razón]. <b>Enums:</b> STRING con CHECK; los catálogos administrables, como tabla maestra.
          <b>Colecciones simples:</b> tabla hija, porque un atributo multivaluado rompe 1FN.”</p>
          <p><b>c) Qué estructuras desnormalizo</b></p>
          <p>“Por <b>consistencia</b>: [dato] queda congelado en [entidad] porque es un registro inmutable con valor
          probatorio. Por <b>performance</b>: [nada por ahora / replicaría [atributo] <b>conservando la FK</b>,
          declarando [tabla] como <b>fuente de verdad</b>, con la propagación encapsulada en un único punto y un
          <b>proceso de recálculo</b>].”</p>

          <h3>PASO 7 · Pasalo en limpio</h3>
          <p>Nada tachado, ninguna nota suelta al margen. <b>El corrector corrige lo que ve.</b></p>
        </section>

        <!-- ===================== SECCIÓN 7 BIS ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 7 BIS · LAS 6 DECISIONES Y LOS 7 ERRORES</span>

          <h3>Las 6 decisiones de un DER de gestión (es el que más se toma)</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:26%">Decisión</th><th>Qué hacer</th></tr></thead>
            <tbody>
              <tr><td><b>1 · Jerarquía anidada</b></td><td>Si el dominio tiene <b>contenedor → equipo → unidad</b> (punto → locker → casillero · estación → cargador → conector) son <b>tres tablas</b>, cada una con FK al padre. <b>El error grave es colapsarla</b> o poner las unidades como columnas. La PK de la unidad suele ser <b>compuesta</b> (<code>nro_serie + nro_unidad</code>) — <b>y la FK hacia ella también</b>.</td></tr>
              <tr><td><b>2 · Dirección o dato estructurado</b></td><td>¿<b>entidad</b> o <b>embebida</b>? <b>Embebida</b> si es un Value Object sin identidad que no se reutiliza ni se consulta solo. <b>Entidad</b> si se comparte, se valida contra un catálogo o necesita <b>historial</b>. <b>Lo que puntúa es que lo discutas</b>, no cuál elijas.</td></tr>
              <tr><td><b>3 · N:M vs 1:N</b></td><td>“Servicios complementarios” (un servicio está en muchos lugares) → <b>catálogo + intermedia</b>. “Horarios de atención” (cada franja es de un solo lugar) → <b>tabla hija 1:N</b>. <b>Confundirlos es el error más común.</b></td></tr>
              <tr><td><b>4 · Atributos del tipo</b></td><td>Medidas del tamaño, potencia del tipo de conector → <b>catálogo aparte</b>. Si quedan como columnas de la unidad, <b>dependen del tipo y no de la unidad</b> → 2FN/3FN.</td></tr>
              <tr><td><b>5 · Historial + estado actual</b></td><td>Tabla <code>HISTORIAL(…, desde, hasta, motivo)</code> para la trazabilidad <b>más</b> <code>estado_actual</code> en la unidad, <b>declarado como desnormalización por performance</b>, con el historial como <b>fuente de verdad</b>. Sin declararlo, es violación de 3FN.</td></tr>
              <tr><td><b>6 · Precio o tarifa con vigencia</b></td><td>Si piden <b>conservar el histórico</b>, <code>vigente_desde</code> <b>es parte de la PK</b>: cada cambio es una fila nueva, no un UPDATE. Si varía por franja, la franja va <b>a su tabla</b>. <b>Definí el grano:</b> la tarifa es por <b>tipo</b>, no por unidad física.</td></tr>
            </tbody>
          </table></div>

          <h3>Los 7 errores que más se cobran</h3>
          <ol>
            <li><b>El parámetro configurable puesto en el catálogo</b> en vez de en la tabla intermedia. El catálogo lo comparten todos; el valor que ajustó <b>este</b> usuario es de <b>esa</b> configuración.</li>
            <li><b>Olvidar la tabla de historial</b> — y después no poder calcular ninguna de las estadísticas que pide el enunciado.</li>
            <li><b>Usar BOOLEAN para un estado</b> de más de dos valores. Casi siempre aparece un tercero (cancelado, vencido, en revisión).</li>
            <li><b>FK del lado equivocado</b> (va del lado “muchos”), <b>FK redundante</b> (la misma relación por dos caminos) o <b>cardinalidades invertidas</b>.</li>
            <li><b>Olvidar atributos que el enunciado nombra</b>, y las restricciones: UNIQUE del “código único”, NOT NULL de lo obligatorio, CHECK del “puede ser A, B o C”.</li>
            <li><b>No escribir los supuestos ni la justificación.</b> Es puntaje regalado.</li>
            <li><b>Dejar una tabla suelta</b>, sin ninguna relación con el resto.</li>
          </ol>

          <h3>Checklist antes de entregar</h3>
          <ul>
            <li>☐ <b>PK</b> en cada tabla, y dije si es natural, subrogada o compuesta.</li>
            <li>☐ Cada relación con <b>FK + cardinalidad + modalidad</b>.</li>
            <li>☐ Todas las <b>N:M</b> resueltas con tabla intermedia (y las que tienen datos propios, con nombre de dominio).</li>
            <li>☐ Ningún atributo <b>multivaluado</b>.</li>
            <li>☐ <b>NOT NULL / UNIQUE / CHECK</b> donde el enunciado los exige.</li>
            <li>☐ <b>Herencia</b> elegida <b>y justificada</b>, si la hay.</li>
            <li>☐ Lista de <b>supuestos</b> escrita.</li>
            <li>☐ Los <b>3 párrafos</b> de justificación escritos.</li>
            <li>☐ Si pidieron <b>un diagrama por servicio</b>: uno por servicio, con <b>IDs lógicos</b> entre servicios y la aclaración de que <b>no hay integridad referencial entre bases</b>.</li>
          </ul>
        </section>

        <!-- ===================== SECCIÓN 7 TER ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 7 TER · LOS 3 TIPOS DE SERVICIO (te toca uno de estos)</span>
          <p class="mini">Los enunciados describen <b>tres servicios con su propia base</b> y te piden el DER de <b>uno</b>. Siempre son las mismas tres familias. <b>Identificá cuál te tocó y ya sabés qué entidades buscar.</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>① GESTIÓN / RED<br><span class="mini">infraestructura, maestros</span></th><th>② TRANSACCIONAL<br><span class="mini">la operación del negocio</span></th><th>③ OPERACIÓN / AUDITORÍA<br><span class="mini">eventos y métricas</span></th></tr></thead>
            <tbody>
              <tr><td><b>Cómo lo reconocés</b></td><td>“administra la infraestructura”, “de cada X se conoce”, “se registran las intervenciones”</td><td>“el usuario hace / reserva / deposita / retira”, “historial de estados”, “comprobante”</td><td>“recibe eventos de forma periódica y masiva”, “genera métricas agregadas”, “tablero”</td></tr>
              <tr><td><b>Columna vertebral</b></td><td><b>Jerarquía anidada de 3 niveles:</b> contenedor → equipo → unidad (punto→locker→casillero · estación→cargador→conector)</td><td><b>La transacción y su bitácora:</b> operación → ítems → eventos de estado</td><td><b>Hechos con marca de tiempo</b> + tablas de resumen. Casi no hay entidades de negocio</td></tr>
              <tr><td><b>Entidades que casi siempre están</b></td><td>Zona/Responsable · <b>Catálogo de tipos</b> con sus medidas · <b>Horarios</b> (1:N) · <b>Servicios complementarios</b> (N:M) · <b>Mantenimiento</b> + <b>Técnico</b> · <b>Tarifa con vigencia</b> · <b>Historial de disponibilidad</b></td><td>Cliente · Operación (con <b>nro. único</b>) · <b>Ítems/bultos</b> (1,N) · <b>Evento de estado</b> (1,N) · <b>Código/credencial</b> con vencimiento · <b>Pago</b> · <b>Adjuntos</b> (URL) · <b>Devolución/cancelación</b> (0,1)</td><td><b>Evento</b> + <b>catálogo de tipo de evento</b> · <b>Lectura/medición</b> + tipo · <b>Heartbeat</b> · <b>Tabla de resumen</b> (PK fecha+entidad+franja) · <b>DIM_*</b> réplicas · <b>Incidente</b> (con estado) · <b>Liquidación</b></td></tr>
              <tr><td><b>Dónde está el punto fino</b></td><td><b>PK compuesta</b> en la unidad <code>(nro_serie, nro_unidad)</code> — y la FK hacia ella <b>también compuesta</b>. <b>Dirección embebida o entidad:</b> discutilo. <b>Horarios NO son N:M.</b></td><td><b>Congelar</b> los datos del comprobante (consistencia). <b>Estado actual</b> + bitácora. <b>Credencial hasheada</b>, nunca en claro. <b>Varias</b> credenciales si “se regenera”</td><td><b>Las métricas NO son tablas: son consultas.</b> Por cada una escribí el COUNT/SUM. <b>DIM_* = réplica local</b> (read model, consistencia eventual). <b>Congelar</b> el % de comisión en la liquidación</td></tr>
              <tr><td><b>Desnormalización típica</b></td><td><b>Performance:</b> <code>estado_actual</code> derivado del historial</td><td><b>Consistencia:</b> datos del comprobante congelados. <b>Performance:</b> <code>estado</code> derivado del último evento</td><td><b>Performance:</b> tabla de resumen por batch (esquema estrella) + DIM replicadas. <b>Consistencia:</b> todo lo de la liquidación</td></tr>
              <tr><td><b>Qué NO va acá</b></td><td>Las operaciones del negocio (son del ②) ni la telemetría (③)</td><td>La infraestructura (①) ni las métricas (③)</td><td>Los maestros (①): sólo <b>réplicas</b>. Y la telemetría cruda, en rigor, va a <b>TSDB</b>, no a relacional: <b>decilo</b></td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">EL CUARTO PATRÓN, QUE PUEDE APARECER EN CUALQUIERA: catálogo + configuración</div>
            <p class="mini">Disparador: “<b>a partir de un catálogo de X predefinidas</b>” + “<b>el usuario puede ajustar los parámetros</b>”. Solución: <code>CATALOGO(id PK, codigo UNIQUE, descripcion, activo)</code> + <code>CONFIG(id PK, id_usuario FK, …, activa)</code> + <b>intermedia</b> <code>CONFIG_ITEM(id_config PK FK, id_catalogo PK FK, <b>parámetro1, parámetro2</b>)</code> + <code>HISTORIAL_DISPARO</code>.</p>
            <p class="mini"><b>⚠️ EL ERROR QUE MÁS SE COBRA:</b> poner el parámetro ajustable <b>en el catálogo</b>. El catálogo lo <b>comparten todos los usuarios</b>; el valor que <b>este</b> usuario eligió va <b>en la intermedia</b>. En el catálogo sólo va lo que describe al tipo en sí (si admite parámetro, su unidad). Modalidad <b>1,N</b>: no hay configuración sin al menos una condición. Y la <b>PK compuesta</b> de la intermedia ya impide elegir dos veces lo mismo.</p>
          </div>
          <p class="mini"><b>Si el enunciado pide UN DIAGRAMA POR SERVICIO:</b> hacelos <b>separados</b> y marcá las referencias cruzadas como <b>ID lógico</b>, no como FK. Escribilo: “<i>no hay integridad referencial entre servicios; la validación es responsabilidad de la aplicación</i>”. Es una línea y vale puntos.</p>
        </section>

        <!-- ===================== SECCIÓN 8 ===================== -->
        <section class="hoja hoja-diag">
          <span class="hoja-num">SECCIÓN 8 · ARQUITECTURA WEB II: SESIONES, CLIENTES, ESCALAR</span>
          <p class="mini"><b>Cookie:</b> archivo de datos <b>creado por el servidor</b> pero <b>almacenado en el cliente</b>; <b>viaja al servidor que la creó en cada request</b>; sirve para <b>identificar y reconocer</b> al usuario. (HttpOnly, Secure, SameSite.)</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>STATELESS</th><th>STATEFUL</th></tr></thead>
            <tbody>
              <tr><td>Concepto</td><td>Componentes <b>aislados</b>: no se almacena ni se referencia info de operaciones anteriores. <b>Cada operación desde cero</b></td><td>“Recuerdan quiénes somos y qué hicimos”; la operación actual <b>puede verse afectada</b> por lo previo</td></tr>
              <tr><td>Sesión</td><td><b>No</b> se almacena en el servidor</td><td><b>Sí</b>, en el servidor (memoria/archivos)</td></tr>
              <tr><td>Identificación</td><td><b>En cada solicitud</b>, con un <b>token</b> que el servidor <b>decodifica</b></td><td><b>Una sola vez</b>; el servidor crea un espacio con un <b>id</b> y lo setea en la <b>cookie</b>; luego recupera la sesión por ese id</td></tr>
            </tbody>
          </table></div>
          <h3>Cómo funciona cada uno, paso a paso</h3>
          ${APP.uml(`sequenceDiagram
    autonumber
    participant C as Cliente
    participant S as Servidor
    Note over C,S: ① STATEFUL · la sesión vive en el SERVIDOR
    C->>S: POST /login (usuario + contraseña)
    Note right of S: valida, CREA un espacio en memoria<br/>y le asigna un id de sesión
    S-->>C: 200 + Set-Cookie: JSESSIONID=abc123
    Note left of C: el cliente sólo guarda el ID
    C->>S: GET /pedidos · Cookie: JSESSIONID=abc123
    Note right of S: busca la sesión por ese id<br/>y así sabe quién es
    S-->>C: 200 OK (sus pedidos)`, "STATEFUL: viaja un ID; el estado queda en el servidor")}
          ${APP.uml(`sequenceDiagram
    autonumber
    participant C as Cliente
    participant S as Servidor
    Note over C,S: ② STATELESS · el servidor NO guarda nada
    C->>S: POST /login (usuario + contraseña)
    Note right of S: valida y FIRMA un JWT<br/>con id, roles y expiración
    S-->>C: 200 { token: eyJhbGciOi... }
    Note left of C: el cliente guarda el TOKEN entero
    C->>S: GET /pedidos · Authorization Bearer eyJ...
    Note right of S: verifica la FIRMA y lee los claims<br/>sin consultar ninguna base
    S-->>C: 200 OK (sus pedidos)`, "STATELESS: viaja la identidad firmada; el servidor no recuerda nada")}
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>STATEFUL</th><th>STATELESS</th></tr></thead>
            <tbody>
              <tr><td><b>Qué guarda el servidor</b></td><td>Un <b>espacio de sesión</b> por usuario conectado</td><td><b>Nada</b></td></tr>
              <tr><td><b>Qué guarda el cliente</b></td><td>Una <b>cookie</b> con el id de sesión</td><td>El <b>token</b> completo</td></tr>
              <tr><td><b>Qué viaja en cada request</b></td><td><code>Cookie: JSESSIONID=abc123</code> — <b>sólo un id</b></td><td><code>Authorization: Bearer eyJ...</code> — <b>id + roles + expiración, firmados</b></td></tr>
              <tr><td><b>Cómo sabe quién sos</b></td><td><b>Busca</b> la sesión por el id</td><td><b>Verifica la firma</b> y lee los claims</td></tr>
              <tr><td><b>Si agregás un segundo servidor</b></td><td>❌ El nuevo <b>no tiene esa sesión</b> → sticky sessions o Redis</td><td>✅ <b>Cualquiera puede atender</b>: el token se valida solo</td></tr>
              <tr><td><b>Si el servidor se cae</b></td><td>❌ Se <b>pierden las sesiones</b> en memoria</td><td>✅ No se pierde nada</td></tr>
            </tbody>
          </table></div>
          <p><b>La frase que resume todo:</b> en stateful <b>viaja un ID y el estado está en el servidor</b>; en
          stateless <b>viaja el estado (firmado) y el servidor no recuerda nada</b>. Por eso stateless es lo que
          <b>habilita el escalado horizontal</b>.</p>

          <h3>JWT (JSON Web Token)</h3>
          <p><b>Qué es:</b> <code>header . payload . firma</code>. En el payload van los <i>claims</i>:
          <code>sub</code> (quién), <code>roles</code>, <code>iat</code> (emitido) y <code>exp</code> (expira).
          Viaja en el header <code>Authorization: Bearer &lt;token&gt;</code> en <b>cada</b> request.</p>
          <p><b>✅ Ventajas frente a la sesión de servidor</b></p>
          <ol>
            <li><b>Escalabilidad horizontal real:</b> el servidor queda <b>stateless</b>, así que cualquier instancia atiende cualquier request → <b>no hacen falta sticky sessions</b> ni un almacén de sesiones compartido.</li>
            <li><b>Sirve igual para todos los clientes:</b> web, mobile y terceros. Las apps mobile no manejan cookies de forma natural; un token sí.</li>
            <li><b>Es autocontenido:</b> lleva identidad y roles, así que <b>no hay un viaje extra a la base</b> en cada request.</li>
            <li><b>Desacopla la autenticación</b> del negocio: encaja con <b>SSO / IDM</b> y con microservicios.</li>
            <li><b>Menos memoria en el servidor:</b> no se reserva un espacio por usuario conectado.</li>
          </ol>
          <p><b>⚠️ Desventajas (nombralas: demuestra criterio)</b></p>
          <ol>
            <li><b>No se puede revocar fácil:</b> vale hasta que expira. Se mitiga con <b>expiración corta + refresh token</b> y una lista de revocación para casos críticos.</li>
            <li><b>Viaja en cada request</b> → más bytes; y si se guarda mal en el cliente, queda expuesto a XSS.</li>
            <li><b>El payload es legible:</b> está <b>firmado, no cifrado</b>. Nunca pongas datos sensibles.</li>
            <li><b>Si cambian los permisos</b>, el token viejo sigue diciendo lo anterior hasta que expire.</li>
          </ol>
          <p class="mini"><b>Sesiones mixtas:</b> <b>cookies</b> del usuario al <b>servidor frontend</b> + <b>tokens</b> del frontend al <b>servidor de aplicación</b> (cliente liviano desacoplado).</p>
          <p class="mini"><b>Recursos:</b> entidad que puede ser <b>manipulada</b> (alta, modificación, baja, listado); se identifican <b>desde los casos de uso</b>. <b>Autónomos</b> (sentido de existencia propio) vs. <b>dependientes/anidados</b> (<code>/mascotas/{id}/historial</code>: no tiene sentido listarlos sin su contenedor → <b>composición</b>). <b>Protección:</b> ① <b>autenticación</b> (visual → login; REST → <b>401</b>) ② <b>roles</b> (<b>403</b>) ③ <b>roles + permisos</b> (distintos usuarios del mismo rol acceden a distintos recursos; distintos roles pueden tener el mismo permiso) + <b>ALCANCES: propio / propios / todos</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>Cliente LIVIANO (SSR)</th><th>Cliente PESADO (CSR)</th></tr></thead>
            <tbody>
              <tr><td>Genera la vista</td><td><b>Servidor</b> · viaja <b>HTML</b></td><td><b>Cliente</b> · viaja <b>JSON</b></td></tr>
              <tr><td>Procesamiento y memoria</td><td>Mayor en servidor</td><td>Mayor en cliente</td></tr>
              <tr><td>Usabilidad / Escalabilidad / Mantenibilidad</td><td><b>− − −</b></td><td><b>+ + +</b></td></tr>
              <tr><td>Conviene</td><td><b>SEO</b>, equipos chicos/full-stack, dispositivos o conectividad limitados</td><td><b>Alta interactividad</b>, múltiples clientes sobre la misma API, equipos front/back separados</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Por qué el liviano puntúa “−”:</b> usabilidad (cada acción = nuevo request y recarga), escalabilidad (el servidor concentra negocio <b>+</b> armado de la vista), mantenibilidad (presentación y negocio entremezcladas). <b>Son relativas:</b> con <b>renderizado híbrido</b> se mitigan.</p>
          <h3>Las 4 variantes de cliente pesado</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Variante</th><th>✅ A favor</th><th>⚠️ Costo</th></tr></thead>
            <tbody>
              <tr><td><b>Web (SPA)</b></td><td>Se instala solo, sin tienda; alcance multiplataforma inmediato</td><td>Acceso <b>limitado al hardware</b>, salvo con <b>PWA</b> (Service Workers → offline y push)</td></tr>
              <tr><td><b>Mobile nativo</b></td><td><b>Acceso total al hardware</b> y a las APIs del SO; mejor performance</td><td><b>Una base de código por sistema operativo</b></td></tr>
              <tr><td><b>Mobile híbrido</b></td><td><b>Una sola base</b> para todas (React Native, Flutter); menor costo y time-to-market</td><td>APIs nativas vía <b>plugins</b>; algo menos de performance</td></tr>
              <tr><td><b>Desktop</b></td><td>Experiencia de escritorio (Electron, Tauri)</td><td>Distribución y actualización fuera del navegador</td></tr>
            </tbody>
          </table></div>
          <h3>SPA, SEO y renderizado</h3>
          <ul>
            <li><b>SPA:</b> un único punto de entrada; las pantallas se intercambian <b>sin recargar</b> la página.</li>
            <li><b>Toda SPA es cliente pesado, pero no todo cliente pesado es una SPA</b> (una app nativa también es pesada).</li>
            <li><b>SEO:</b> se indexa mejor el <b>HTML ya servido</b>. Los buscadores ejecutan JavaScript, pero <b>más lento, más caro y sin garantía</b> (crawl budget).</li>
            <li><b>SSR:</b> la primera respuesta la arma el servidor y después el navegador <b>hidrata</b> la página.</li>
            <li><b>SSG:</b> el HTML se genera <b>en el build</b> → ideal para combinar con caché y CDN.</li>
          </ul>
          <p class="mini"><b>Versionado de clientes instalables:</b> conviven <b>múltiples versiones</b> en producción → <b>versionar la API</b> (/v1,/v2), cambios <b>backward-compatible</b> (campos <b>opcionales</b>), <b>hard update</b>, actualizaciones automáticas.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Escalabilidad</th><th>VERTICAL</th><th>HORIZONTAL</th></tr></thead>
            <tbody>
              <tr><td>Qué hace</td><td>Más recursos a <b>la misma</b> máquina</td><td>Más <b>equipos</b> + distribuir la carga</td></tr>
              <tr><td>Límite</td><td><b>Físico</b></td><td>Sin límite físico</td></tr>
              <tr><td>Resuelve</td><td>Performance, <b>NO disponibilidad</b> (punto único de falla)</td><td><b>Performance Y disponibilidad</b> (requiere <b>balanceador</b> y servicios <b>stateless</b>)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Balanceador:</b> reparte solicitudes (performance), <b>redirige si un servidor falla</b> (disponibilidad), permite sumar/quitar nodos (escalabilidad). <b>Algoritmos:</b> Round Robin · Least Connections · Weighted · <b>Sticky Sessions</b> (no es algoritmo: <b>política</b> que fuerza el mismo servidor; <b>atenta contra escalabilidad y disponibilidad</b> → mejor <b>stateless + sesión externalizada</b>). <b>L4</b> = IP y puerto, no mira el contenido; <b>L7</b> = entiende HTTP, decide por <b>URL/headers/cookies</b>. <b>Health checks:</b> <b>activo</b> (GET /health periódico, saca de rotación) y <b>pasivo</b> (observa timeouts y 5xx reales).</p>
          <h3>Caché: qué es y cómo funciona</h3>
          <p><b>Una caché es una copia guardada de algo que ya se calculó o ya se pidió, para no volver a hacerlo.</b>
          Nada más que eso.</p>
          <p><b>La analogía:</b> si te preguntan cinco veces el mismo dato, la primera vez vas a buscarlo al archivo y
          las otras cuatro lo contestás de memoria. La caché es esa memoria: la primera consulta es cara, las
          siguientes son gratis <b>hasta que el dato se pone viejo</b>.</p>

          <p><b>El mecanismo, paso a paso (HIT y MISS)</b></p>
          <ol>
            <li>Llega una petición y <b>primero se mira la caché</b>.</li>
            <li><b>HIT:</b> hay una copia y <b>todavía es válida</b> (no venció su TTL) → <b>se responde con esa copia</b>. El servidor de origen <b>ni se entera</b>.</li>
            <li><b>MISS:</b> no está o ya venció → se va al <b>origen</b> (la base, el servicio), <b>se guarda una copia</b> y se responde.</li>
            <li>El <b>siguiente</b> que pida lo mismo ya tiene un HIT.</li>
          </ol>
          ${APP.uml(`graph LR
    U["👤 Petición"] --> C{"¿Está en la caché<br/>y sigue válida?"}
    C -->|"HIT · sí"| R1["Responde la copia<br/>⚡ el origen ni se entera"]
    C -->|"MISS · no o venció"| O["Va al ORIGEN<br/>(base / servicio)"]
    O --> G["Guarda la copia<br/>con su TTL"]
    G --> R2["Responde"]
    style C fill:#fffbeb,stroke:#b45309,color:#0f172a
    style R1 fill:#ecfdf5,stroke:#059669,color:#0f172a`, "HIT y MISS: el origen sólo trabaja cuando hay MISS")}
          <p><b>Por qué baja tanto la carga:</b> en un HIT el origen <b>no parsea, no enruta, no consulta la base y no
          renderiza nada</b>. No es que trabaje menos: <b>no trabaja</b>.</p>
          <p><b>El indicador:</b> <b>Cache Hit Ratio = HITs / (HITs + MISSes) × 100</b>. Cuanto más alto, menos carga
          en el origen.</p>

          <div class="callout key">
            <div class="callout-title">EJEMPLO CON NÚMEROS (usalo en el parcial)</div>
            <p>El listado de lockers disponibles se consulta <b>10.000 veces por minuto</b>. Sin caché, son
            <b>10.000 consultas por minuto a la base</b>.</p>
            <p>Con una caché de <b>TTL = 30 segundos</b>: en cada ventana de 30 s hay <b>1 MISS</b> (que va a la base) y
            <b>4.999 HITs</b>. Es decir, la base pasa a recibir <b>2 consultas por minuto</b> en vez de 10.000 —
            una reducción del <b>99,98%</b>— y el <b>hit ratio es del 99,98%</b>.</p>
            <p><b>El costo:</b> durante esos 30 segundos alguien puede ver un casillero como “libre” cuando ya se
            ocupó. <b>La pregunta de diseño no es “¿puede estar desactualizado?” sino “¿cuánto tiempo lo tolera el
            negocio?”</b></p>
          </div>

          <p><b>TTL (Time To Live) = cuánto tiempo la copia se considera fresca.</b> Es <b>la</b> decisión de la caché:</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Qué dato</th><th>TTL</th><th>Por qué</th></tr></thead>
            <tbody>
              <tr><td>Fotos, CSS, JS, logos</td><td><b>Días o meses</b> + versión en el nombre del archivo</td><td>Casi nunca cambian; y cuando cambian, <b>cambia el nombre</b> y no hay que invalidar nada</td></tr>
              <tr><td>Listado de puntos / catálogo</td><td><b>Minutos</b></td><td>Cambia poco y lo consultan muchos</td></tr>
              <tr><td>Disponibilidad en tiempo real</td><td><b>10–30 segundos</b> + invalidación por evento</td><td>Cambia todo el tiempo, pero sin caché la base no aguanta</td></tr>
              <tr><td>El estado de <b>mi</b> pedido, mi saldo</td><td><b>Sin caché</b> o muy corto</td><td>Es lo que el usuario está mirando: una respuesta vieja genera un reclamo</td></tr>
              <tr><td>Credenciales, códigos de retiro</td><td><b>Nunca se cachean</b></td><td>Son secretos, no datos</td></tr>
            </tbody>
          </table></div>
          <p><b>El trade-off del TTL:</b> largo → más HITs y menos carga, pero <b>más riesgo de contenido viejo</b>.
          Corto → siempre fresco, pero <b>más MISS</b> y más carga.</p>

          <p><b>Dónde vive cada caché</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Tipo</th><th>Dónde está</th><th>Para qué sirve</th></tr></thead>
            <tbody>
              <tr><td><b>Privada</b></td><td>En el <b>navegador</b> del usuario</td><td>La más rápida: <b>ni sale a la red</b>. Sólo para ese usuario</td></tr>
              <tr><td><b>Compartida</b></td><td>Un <b>proxy</b> de la empresa o del ISP</td><td>Compartida entre varios usuarios de esa red</td></tr>
              <tr><td><b>Compartida administrada</b></td><td>Los nodos de una <b>CDN</b></td><td>Sirve a millones de usuarios en todo el mundo</td></tr>
              <tr><td><b>De aplicación</b></td><td><b>Redis / Memcached</b>, al lado del servicio</td><td>Evita <b>recalcular o reconsultar la base</b>; compartida por todas las instancias</td></tr>
              <tr><td><b>Del ORM</b></td><td>Dentro de Hibernate</td><td>1er nivel = la <b>sesión</b> · 2do nivel = la <b>SessionFactory</b> (ver sección 4)</td></tr>
            </tbody>
          </table></div>
          <p><b>Cabeceras HTTP (si piden la especificación):</b> <code>Cache-Control: max-age=N</code> (TTL para
          cualquiera) · <code>s-maxage=N</code> (TTL <b>sólo para cachés compartidas</b>) · <code>public</code> /
          <code>private</code> (<b>private</b> = sólo el navegador del usuario, para datos personales) ·
          <code>no-cache</code> (se guarda pero <b>hay que revalidar</b>) · <code>no-store</code> (<b>no se guarda en
          ninguna</b>) · <code>ETag</code> + <code>If-None-Match</code> → <b>304 Not Modified</b> sin cuerpo ·
          <code>Vary</code> (una copia por cabecera, ej. por idioma).</p>

          <h3>CDN: qué es y por qué se usa</h3>
          <p><b>Una CDN es una red de servidores repartidos por el mundo (nodos de borde) que guardan copias de tus
          archivos y se los entregan al usuario desde el más cercano.</b></p>
          <p><b>La analogía:</b> en vez de que todos los clientes del país vayan a tu depósito central, ponés una
          sucursal en cada ciudad con la mercadería más pedida. <b>El viaje es más corto y el depósito deja de
          atender.</b></p>
          <p><b>El orden de una petición en el borde:</b> Usuario → <b>DNS</b> (lo manda al nodo más cercano) →
          <b>CDN + WAF</b> (sirve los estáticos desde su caché y filtra ataques) → <b>sólo si hay MISS o es tráfico
          dinámico</b> → Balanceador → API Gateway → servicios → base.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Qué gana</th><th>Por qué</th></tr></thead>
            <tbody>
              <tr><td><b>Performance</b></td><td>El contenido viaja <b>desde el nodo más cercano</b>: menos latencia y mejor tiempo de carga</td></tr>
              <tr><td><b>Costo de ancho de banda</b></td><td>Los bytes <b>los pone la CDN, no tu servidor</b>. Es el argumento más fuerte cuando el enunciado habla de “ancho de banda consumido”</td></tr>
              <tr><td><b>Escalabilidad</b></td><td>Absorbe picos globales <b>sin tocar el origen</b></td></tr>
              <tr><td><b>Disponibilidad</b></td><td>Nodos distribuidos y redundancia: puede seguir sirviendo contenido <b>aunque el origen se degrade</b></td></tr>
              <tr><td><b>Seguridad</b></td><td><b>Mitiga DDoS</b> absorbiendo el ataque en el borde, y oculta la IP del origen</td></tr>
            </tbody>
          </table></div>
          <p><b>Variantes:</b> <b>Pull CDN</b> (trae del origen en el primer pedido; es lo habitual) ·
          <b>Push CDN</b> (se sube de antemano) · <b>origin shield</b> (una capa intermedia que junta los MISS de varios
          nodos para que al origen le llegue uno solo).</p>

          <h3>API Gateway y BFF</h3>
          <ul>
            <li><b>API Gateway:</b> <b>único punto de entrada</b>; enruta a cada servicio y centraliza <b>autenticación, rate limiting y logging</b>. Puede hacer de LB L7. <b>Sin él, cada cliente se acopla a la topología interna</b> del backend.</li>
            <li><b>BFF:</b> un backend <b>por tipo de cliente</b> (web, mobile), que agrega y adapta las respuestas <b>sin tocar los contratos internos</b> de los servicios.</li>
          </ul>
          <p class="mini"><b>Cabeceras de caché (por si piden la especificación):</b> <code>Cache-Control: max-age=N</code> TTL para cualquier caché · <code>s-maxage=N</code> TTL <b>sólo para cachés compartidas</b> (CDN/proxy), pisa a max-age · <code>public</code> la puede guardar cualquier caché / <code>private</code> <b>sólo el navegador del usuario</b> · <code>no-cache</code> se guarda pero <b>hay que revalidar</b> antes de usarla · <code>no-store</code> <b>no se guarda en ninguna</b> (datos sensibles) · <code>ETag</code> + <code>If-None-Match</code> → <b>304 Not Modified</b> sin cuerpo · <code>Vary</code> guarda una versión por cabecera (ej. <code>Accept-Language</code>). <b>HIT</b> = estaba válido en caché; <b>MISS</b> = no estaba o expiró y se va al <b>origin server</b>. <b>Hit ratio = HITs / (HITs + MISSes)</b>.</p>
          <div class="grid-2">
            <div class="card">
              <p><b>✅ Qué SÍ va a la CDN</b></p>
              <ul>
                <li>HTML estático, CSS, JS, imágenes, fuentes, video</li>
                <li>Bundles de la SPA y sitios SSG</li>
                <li>Vistas públicas <b>no personalizadas</b></li>
              </ul>
            </div>
            <div class="card">
              <p><b>❌ Qué NO</b></p>
              <ul>
                <li>Respuestas JSON <b>personalizadas por usuario</b> (carrito, perfil, saldo)</li>
                <li>Operaciones que <b>modifican estado</b> (POST, PUT, DELETE)</li>
                <li>Contenido sensible sin <code>Cache-Control: private</code></li>
              </ul>
            </div>
          </div>
          <p><b>Invalidación — dos técnicas:</b></p>
          <ol>
            <li><b>Purge:</b> invalidación explícita en la CDN.</li>
            <li><b>Cache busting:</b> nombre de archivo con hash (<code>app.3f9a1c.js</code>) + TTL larguísimo. Al desplegar cambia el nombre, así que <b>no hay que invalidar nada</b>.</li>
          </ol>
          <p><b>El compromiso del TTL:</b> largo → más HITs y menos carga, pero riesgo de contenido viejo. Corto →
          contenido fresco, pero más MISS.</p>
          <p><b>Variantes:</b> <b>Pull CDN</b> (trae del origen en el primer pedido; es lo habitual) ·
          <b>Push CDN</b> (se sube de antemano) · <b>origin shield</b> (capa intermedia que consolida los MISS de varios
          nodos antes de llegar al origen).</p>
          <p class="mini"><b>Algoritmos de balanceo (lista completa):</b> <b>Round Robin</b> (uno por uno; servidores iguales) · <b>Weighted Round Robin</b> (los más potentes reciben más) · <b>Least Connections</b> (menos conexiones activas; requests de duración variable) · <b>Least Response Time</b> (al más rápido; optimizar latencia) · <b>IP Hash</b> (hash de la IP → siempre el mismo servidor; afinidad) · <b>Sticky sessions</b> (política, no algoritmo). <b>⚠️ Si hay un solo balanceador, él mismo es el punto único de falla: hay que redundarlo.</b></p>
        </section>

        <!-- ===================== SECCIÓN 8 BIS ===================== -->
        <section class="hoja hoja-diag">
          <span class="hoja-num">SECCIÓN 8 BIS · EL DIAGRAMA DE ARQUITECTURA: CÓMO SE DIBUJA</span>

          <h3>Las 3 reglas que el corrector busca en el dibujo</h3>
          <ol>
            <li><b>Cada línea rotulada con su protocolo</b> — HTTPS, MQTT, AMQP, JDBC, SOAP. Una flecha sin etiqueta es media respuesta.</li>
            <li><b>Lo externo marcado como externo</b> — pasarela de pago, ARCA, proveedor de mail, IdP. Y todo lo externo entra al dominio por un <b>Adapter</b>.</li>
            <li><b>Título y leyenda:</b> el diagrama tiene que <b>poder leerse solo</b>, sin que vos lo expliques al lado.</li>
          </ol>

          <h3>Los símbolos, dibujados</h3>
          <p><b>Nodo de despliegue = cubo 3D</b>, con el estereotipo arriba y el artefacto adentro. Es lo que va en el
          <b>diagrama de despliegue</b>:</p>
          ${APP.svgNodo("server", "Servidor de aplicación", "paquered.jar")}
          <p><b>Componente = rectángulo con las dos pestañas</b>. Es lo que va en el <b>diagrama de componentes</b>:</p>
          ${APP.svgComponente("Servicio de Envíos")}
          <p><b>Ensamble bola-socket:</b> así se dibuja quién <b>consume</b> y quién <b>provee</b> una interfaz. <b>El
          semicírculo del que consume abraza la bolita del que provee</b>:</p>
          ${APP.svgBallSocket("Servicio Envíos", "Servicio Red", "IConsultaCasilleros")}
          <p class="mini"><b>Regla para no equivocarte:</b> si el enunciado pide <b>despliegue</b>, dibujá
          <b>cubos</b> (dónde corre cada cosa) con el <b>protocolo</b> en cada línea. Si pide <b>componentes</b>,
          dibujá <b>cajas con pestañas</b> unidas por <b>bola y socket</b> (quién usa a quién). <b>No son
          intercambiables</b> y es un descuento clásico.</p>

          <h3>Diagrama de componentes de microservicios (el otro que piden)</h3>
          ${APP.uml(`graph LR
    W["«component»<br/>SPA Web"] --> GW["«component»<br/>API Gateway"]
    M["«component»<br/>App Mobile"] --> GW
    GW -->|IEnvios| S1["«component»<br/>Servicio Envíos"]
    GW -->|IRed| S2["«component»<br/>Servicio Red y Lockers"]
    GW -->|IAuditoria| S3["«component»<br/>Servicio Auditoría"]
    S1 --> D1[("BD Envíos")]
    S2 --> D2[("BD Red")]
    S3 --> D3[("TSDB")]
    S1 -->|publica| BK[("Broker")]
    BK --> N["«component»<br/>Notificaciones"]
    N -->|ISmtp| EXT["Proveedor mail<br/>«externo»"]
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BK fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Componentes: qué piezas hay y qué interfaz usa cada una")}

          <h3>Cómo se dibuja cada cosa (notación)</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Elemento</th><th>Se dibuja</th><th>Cuándo lo usás</th></tr></thead>
            <tbody>
              <tr><td><b>Nodo</b> (despliegue)</td><td><b>Cubo 3D</b> con el estereotipo arriba: <code>«device»</code>, <code>«server»</code>, <code>«container»</code></td><td>Una máquina, un celular, un contenedor, un locker</td></tr>
              <tr><td><b>Componente</b></td><td>Caja con el ícono de componente, o con <b>bolita ● (interfaz provista)</b> y <b>semicírculo ( (interfaz requerida)</b>. <b>El semicírculo del que consume abraza la bolita del que provee.</b></td><td>Un servicio, un módulo dentro de un nodo</td></tr>
              <tr><td><b>Base de datos</b></td><td><b>Cilindro</b>, con el tipo adentro (“BD Envíos · relacional”, “TSDB”)</td><td>Una base por servicio: <b>dibujá una por cada uno</b></td></tr>
              <tr><td><b>Cola / broker</b></td><td>Caja alargada o cilindro acostado, con el <b>nombre del topic o de la cola</b></td><td>Siempre que haya asincronismo</td></tr>
              <tr><td><b>Actor / usuario</b></td><td>Monigote o caja <code>«device»</code> con el tipo de cliente</td><td>Para mostrar <b>quién</b> entra y por dónde</td></tr>
              <tr><td><b>Protocolo</b></td><td><b>Sobre la flecha</b>, siempre</td><td>HTTPS · MQTT/TLS · AMQP · JDBC · SOAP/WSDL</td></tr>
              <tr><td><b>Réplicas</b></td><td><b>Cajas apiladas</b> o “xN” en la esquina</td><td>Donde haya escalado horizontal</td></tr>
            </tbody>
          </table></div>

          <h3>El orden en que se dibuja (de afuera hacia adentro)</h3>
          <p><b>Usuarios → Borde (CDN · WAF) → Balanceador → API Gateway → Servicios (xN) → Bases.</b> Y aparte,
          colgando del costado: <b>broker con sus workers</b>, los <b>sistemas externos</b>, y abajo como banda
          transversal <b>IAM/SSO, observabilidad y secretos</b>. Si seguís ese orden no te olvidás ninguna pieza.</p>

          <h3>Diagrama de despliegue de referencia</h3>
          ${APP.uml(`graph LR
    U["👤 Usuarios<br/>«device» web · mobile"] -->|HTTPS| CDN["CDN<br/>estáticos e imágenes"]
    U -->|HTTPS| WAF["WAF<br/>OWASP Top 10"]
    WAF --> LB["⚖️ Load Balancer L7<br/>health checks · TLS"]
    LB --> GW["API Gateway<br/>authN JWT · rate limiting"]
    GW --> S1["Servicio A «container» xN"]
    GW --> S2["Servicio B «container» xN"]
    S1 --> DB1[("BD A<br/>relacional")]
    S2 --> DB2[("BD B<br/>relacional")]
    DB1 -.->|réplica| RR[("Réplica<br/>de lectura")]
    S1 --> CA[("Redis<br/>caché TTL")]
    S1 -->|publica evento| BK[("Broker · cola/topic")]
    BK --> W["Workers xN<br/>notificaciones · batch"]
    W -->|HTTPS + circuit breaker| EXT["Servicio externo<br/>«externo»"]
    S1 -.-> OBS["Observabilidad<br/>métricas · logs · trazas"]
    S1 -.-> IDP["IdM / SSO<br/>«externo»"]
    style WAF fill:#fee2e2,stroke:#b91c1c,color:#0f172a
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BK fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Despliegue de referencia: copiá esta estructura y sacá lo que no aplique")}

          <h3>Cómo se dibuja una cola y un broker (RabbitMQ)</h3>
          <p>Es lo que más se pide después del balanceador, y donde más se equivocan.</p>
          ${APP.svgCola("facturas", "Tienda", "Facturación")}
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:26%">Qué dibujar</th><th>Cómo</th></tr></thead>
            <tbody>
              <tr><td><b>El broker</b></td><td>Un <b>nodo</b> aparte con su estereotipo: <code>«broker» RabbitMQ</code>. <b>No es parte de tu servicio:</b> es infraestructura, va en su propia caja (y en el despliegue, en su propio cubo).</td></tr>
              <tr><td><b>La cola</b></td><td>Un <b>rectángulo dividido en celdas</b> (los mensajes) <b>adentro</b> del broker, <b>con su nombre</b>: <code>facturas</code>, <code>comando.actuador</code>. <b>El nombre importa:</b> una cola sin nombre no dice nada.</td></tr>
              <tr><td><b>Las dos flechas</b></td><td><b>Productor → cola</b> rotulada <b>“publica”</b> y <b>cola → consumidor</b> rotulada <b>“consume”</b>. <b>⚠️ Nunca una flecha bidireccional al broker:</b> son dos relaciones distintas, en un solo sentido cada una.</td></tr>
              <tr><td><b>El ACK</b></td><td>Flecha <b>punteada de vuelta</b> del consumidor a la cola. Dibujarlo demuestra que sabés que <b>el mensaje se borra al confirmar, no al entregarse</b>.</td></tr>
              <tr><td><b>El protocolo</b></td><td>Sobre la línea: <b>AMQP</b> (RabbitMQ, puerto 5672) · <b>MQTT</b> si son dispositivos IoT · <b>JMS</b> en entornos Java clásicos.</td></tr>
              <tr><td><b>La DLQ</b></td><td>Una <b>segunda cola</b> colgando de la principal, rotulada <code>facturas.dlq</code>, con la flecha <b>“tras N reintentos”</b>.</td></tr>
            </tbody>
          </table></div>

          <p><b>Los tres escenarios que te pueden pedir dibujar</b></p>
          ${APP.uml(`graph LR
    subgraph A["① COLA · punto a punto — una ORDEN la hace UNO solo"]
      P1["Tienda"] -->|"publica · AMQP"| Q1[("cola: facturas")]
      Q1 -->|consume| C1["Facturación #1"]
      Q1 -->|consume| C2["Facturación #2"]
      Q1 -->|"tras 3 reintentos"| DLQ[("facturas.dlq")]
      DLQ -.->|revisa| OP["Soporte"]
    end`, "Cola: competing consumers (cada mensaje lo toma UNO) + DLQ")}
          ${APP.uml(`graph LR
    subgraph B["② TOPIC · publicación-suscripción — un EVENTO le interesa a VARIOS"]
      P2["Pedidos"] -->|"publica evento<br/>PedidoCreado"| T[("topic: pedido-creado")]
      T -->|copia| S1["Facturación"]
      T -->|copia| S2["Stock"]
      T -->|copia| S3["Notificaciones"]
    end`, "Topic: cada suscriptor recibe SU COPIA del mismo evento")}
          ${APP.uml(`graph LR
    subgraph C["③ EN EL DIAGRAMA DE DESPLIEGUE · el broker es su propio nodo"]
      N1["«container»<br/>Servicio Envíos xN"] -->|"AMQP 5672"| N2["«broker»<br/>RabbitMQ<br/>(replicado)"]
      N2 -->|"AMQP 5672"| N3["«container»<br/>Workers xN"]
      N3 -->|"HTTPS"| N4["Proveedor de mail<br/>«externo»"]
    end`, "Despliegue: cubo propio para el broker y el protocolo en cada línea")}

          <div class="callout key">
            <div class="callout-title">CÓMO SE JUSTIFICA LA COLA (una línea, al lado del dibujo)</div>
            <p>“Uso una cola porque <b>quien publica no necesita la respuesta para continuar</b>: desacopla en el
            tiempo —si el consumidor está caído los mensajes esperan—, <b>amortigua los picos</b> y permite
            <b>escalar consumidores</b> de forma independiente. <b>Costo:</b> consistencia eventual y entrega
            <b>at-least-once</b>, por eso el consumidor es <b>idempotente</b> y los mensajes irreprocesables van a una
            <b>DLQ</b>.”</p>
            <p><b>Y la regla para elegir entre las dos:</b> <b>ORDEN</b> (“emitir la factura”) la tiene que hacer
            <b>alguien, una vez</b> → <b>cola</b>. <b>EVENTO</b> (“pedido creado”) le interesa a <b>varios</b> →
            <b>topic</b>.</p>
          </div>
          <p class="mini"><b>⚠️ Los 4 errores típicos al dibujarlo:</b> ① flecha <b>bidireccional</b> al broker
          (van dos, una por sentido) · ② la cola <b>sin nombre</b> · ③ el broker dibujado <b>adentro</b> de tu servicio
          (es infraestructura aparte) · ④ <b>no rotular el protocolo</b>.</p>

          <h3>Cómo se mete un balanceador (el antes y el después)</h3>
          ${APP.uml(`graph LR
    subgraph ANTES["❌ ANTES · un solo servidor = punto único de falla"]
      U1["👤"] -->|HTTPS| S["Servidor único"]
      S --> D1[("BD")]
    end
    subgraph DESPUES["✅ DESPUÉS · escalado horizontal"]
      U2["👤"] -->|HTTPS| L["⚖️ Load Balancer<br/>health checks"]
      L --> A["Instancia 1"]
      L --> B["Instancia 2"]
      L --> C["Instancia 3"]
      A --> R[("Redis · sesión<br/>externalizada")]
      B --> R
      A --> D2[("BD")]
      B --> D2
    end`, "Meter un balanceador: tres cambios, no uno")}
          <p><b>Fijate que no alcanza con dibujar la caja del balanceador.</b> Meterlo implica <b>tres</b> cambios, y
          hay que decirlos:</p>
          <ol>
            <li><b>Replicar el servicio</b> (xN instancias): si hay una sola, el balanceador no sirve para nada.</li>
            <li><b>Sacar la sesión del servidor</b> (a Redis o a JWT): si queda en memoria local, hacen falta
            <b>sticky sessions</b>, que atentan contra la escalabilidad y la disponibilidad.</li>
            <li><b>Health checks</b>: para que saque de rotación al nodo caído. Sin eso, el balanceador sigue mandando
            tráfico a un servidor muerto.</li>
          </ol>

          <h3>Qué componente meter, dónde, y cómo justificarlo</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Componente</th><th>Dónde va en el dibujo</th><th>Frase de justificación</th><th>Atributos</th></tr></thead>
            <tbody>
              <tr><td><b>Balanceador</b></td><td>Entre el usuario y las instancias</td><td>“Reparte la carga entre N instancias y, con <b>health checks</b>, saca de rotación al nodo caído: elimina el <b>punto único de falla</b>.”</td><td>Disponibilidad · Escalabilidad · Performance</td></tr>
              <tr><td><b>CDN</b></td><td>Antes de todo, colgando del usuario</td><td>“Sirve los estáticos desde el <b>nodo más cercano</b>; el backend sólo entrega la URL. Baja los tiempos de carga y el <b>costo de ancho de banda</b>, y mitiga DDoS.”</td><td>Performance · Escalabilidad · Costo</td></tr>
              <tr><td><b>Caché (Redis)</b></td><td>Al costado del servicio, antes de la base</td><td>“Las consultas repetidas no llegan al origen: con TTL de [N] s absorbo [X] consultas/min sin tocar la base.”</td><td>Performance · Disponibilidad</td></tr>
              <tr><td><b>Broker / cola</b></td><td>Entre el servicio que publica y los workers</td><td>“Quien llama <b>no necesita la respuesta</b> para continuar: desacopla en el tiempo, <b>amortigua los picos</b> y permite escalar consumidores.”</td><td>Escalabilidad · Disponibilidad</td></tr>
              <tr><td><b>API Gateway</b></td><td>Entre el LB y los servicios</td><td>“Punto único de entrada: centraliza autenticación, rate limiting y logging, y evita que cada cliente se acople a la <b>topología interna</b>.”</td><td>Seguridad · Mantenibilidad</td></tr>
              <tr><td><b>WAF</b></td><td>En el borde, antes del LB</td><td>“Filtra el OWASP Top 10 antes de consumir recursos del backend.”</td><td>Seguridad · Disponibilidad</td></tr>
              <tr><td><b>Réplica de lectura</b></td><td>Colgando de la base, con línea punteada</td><td>“Las consultas pesadas no compiten con las transacciones; la base primaria deja de ser el cuello de botella.”</td><td>Performance · Escalabilidad</td></tr>
              <tr><td><b>Object storage</b></td><td>Al costado, conectado a la CDN</td><td>“Los binarios <b>no van en la base</b>: va la URL. La base no crece ni se usa para transferir archivos.”</td><td>Performance · Costo</td></tr>
              <tr><td><b>IdM / SSO</b></td><td>Banda transversal abajo, marcado externo</td><td>“Identidades, roles y permisos centralizados; el backend valida el <b>JWT</b> y queda <b>stateless</b>.”</td><td>Seguridad · Mantenibilidad</td></tr>
              <tr><td><b>Observabilidad</b></td><td>Banda transversal abajo, punteada</td><td>“Con <b>correlation ID</b> y trazas se reconstruye una operación que cruzó varios servicios.”</td><td>Mantenibilidad · Disponibilidad</td></tr>
              <tr><td><b>Edge Gateway</b></td><td>Junto a los dispositivos IoT</td><td>“Agrupa las lecturas del lugar, <b>bufferea y reintenta</b> si se corta el enlace.”</td><td>Disponibilidad · Tolerancia a fallos</td></tr>
            </tbody>
          </table></div>
          <p><b>Regla de oro al justificar:</b> por cada componente que dibujes, escribí al lado <b>una línea</b> con
          <b>qué problema del enunciado resuelve</b> y <b>qué atributo de calidad mejora</b>. Un componente dibujado y
          no justificado <b>no suma</b>; y uno de más, <b>resta</b> (sobreingeniería).</p>
        </section>

        <!-- ===================== SECCIÓN 9 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 9 · MONOLITO · SOA · MICROSERVICIOS · NUBE</span>
          <p class="mini"><b>Monolito:</b> todas las responsabilidades se <b>construyen, versionan y despliegan como una única unidad</b>; módulos en <b>memoria</b>, una sola base. <b>Lo que lo define no es el tamaño, es que TODO SE DESPLIEGA JUNTO.</b> Pregunta guía: ¿puedo desplegar un cambio en Facturación sin desplegar Ventas? <b>Separar el frontend NO lo convierte en distribuido:</b> la pregunta es cuántas <b>unidades de despliegue</b> tiene el <b>backend</b>. <b>Capas ≠ despliegue:</b> las capas mejoran mantenibilidad y testeabilidad pero <b>no cambian cómo se escala ni se despliega</b>.</p>
          <div class="grid-2">
            <div class="card">
              <p><b>✅ Ventajas del monolito</b></p>
              <ul>
                <li><b>Simplicidad:</b> un repo, un build, un entorno local.</li>
                <li><b>Transacciones ACID locales:</b> una sola base, un commit o rollback atómico.</li>
                <li><b>Performance interna:</b> llamadas en memoria (<b>nanosegundos</b>) en vez de por red (<b>milisegundos</b>).</li>
                <li><b>Testing y debugging:</b> un test end-to-end levanta todo; el stack trace recorre el flujo completo.</li>
                <li><b>Despliegue simple:</b> un artefacto, un pipeline, una versión.</li>
                <li><b>Menor costo operativo:</b> menos infraestructura, monitoreo y perfiles especializados.</li>
              </ul>
            </div>
            <div class="card">
              <p><b>⚠️ Desventajas</b></p>
              <ul>
                <li><b>Despliegue “todo o nada”:</b> una línea implica desplegar y re-testear todo.</li>
                <li><b>Escalado en bloque:</b> si sólo un módulo necesita recursos, <b>replicás el sistema entero</b>.</li>
                <li><b>Falla propagada:</b> un memory leak en un módulo <b>tira abajo todo el proceso</b>.</li>
                <li><b>Lock-in tecnológico:</b> un solo lenguaje y framework para todo.</li>
                <li><b>Coordinación de equipos:</b> conflictos de merge y releases coordinados.</li>
                <li><b>Builds y arranques lentos</b> a medida que crece.</li>
              </ul>
            </div>
          </div>
          <div class="callout key">
            <div class="callout-title">MITO: “un monolito no escala” → FALSO</div>
            <p><b>Sí escala horizontalmente</b> con N réplicas detrás de un balanceador. <b>Requisito:</b> ser
            <b>stateless</b> (sesión externalizada), si no volvés a las sticky sessions. <b>Lo que NO puede</b> es
            escalar <b>partes de forma independiente</b>: para dar más capacidad a un módulo replicás también los
            otros. Y <b>la base compartida suele ser el verdadero cuello de botella</b>.</p>
          </div>
          <h3>Las 8 falacias de la computación distribuida</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:40%">La falacia</th><th>Lo que hay que diseñar</th></tr></thead>
            <tbody>
              <tr><td>1 · La red es confiable</td><td><b>Timeouts, reintentos</b> y manejo de fallas parciales, desde el inicio</td></tr>
              <tr><td>2 · La latencia es cero</td><td><b>Evitar diálogos “chatty”</b>: cada llamada remota cuesta milisegundos</td></tr>
              <tr><td>3 · El ancho de banda es infinito</td><td><b>Paginar, comprimir, filtrar</b></td></tr>
              <tr><td>4 · La red es segura</td><td><b>TLS y autenticación también en el tráfico interno</b></td></tr>
              <tr><td>5 · La topología no cambia</td><td><b>Descubrimiento de servicios</b>: las instancias aparecen y desaparecen</td></tr>
              <tr><td>6 · Hay un solo administrador</td><td>Distintos equipos y proveedores, con configuraciones distintas</td></tr>
              <tr><td>7 · El transporte no tiene costo</td><td>Serializar y transferir consume CPU… y dinero (<b>egress</b>)</td></tr>
              <tr><td>8 · La red es homogénea</td><td>Conviven protocolos, formatos y versiones diferentes</td></tr>
            </tbody>
          </table></div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Criterio</th><th>MONOLITO</th><th>SOA</th><th>MICROSERVICIOS</th></tr></thead>
            <tbody>
              <tr><td>Alcance</td><td>Una aplicación</td><td><b>La organización</b> (integrar y reutilizar)</td><td>Una <b>aplicación</b> (construir un producto)</td></tr>
              <tr><td>Granularidad</td><td>—</td><td>Servicios de negocio <b>grandes</b></td><td>Servicios <b>pequeños</b></td></tr>
              <tr><td>Comunicación</td><td>En memoria</td><td><b>ESB inteligente</b> (smart pipes)</td><td><b>Endpoints inteligentes, canales simples</b></td></tr>
              <tr><td>Datos</td><td>Una base</td><td>Frecuentemente <b>compartidas</b></td><td><b>Una base por servicio</b></td></tr>
              <tr><td>Gobierno</td><td>—</td><td><b>Centralizado</b> (estándares, registro)</td><td><b>Descentralizado</b></td></tr>
              <tr><td>Consistencia</td><td>ACID</td><td>Compensaciones</td><td><b>Saga</b> / eventual</td></tr>
              <tr><td>Contratos</td><td>—</td><td><b>SOAP/WSDL, WS-*</b> (UDDI)</td><td><b>REST, gRPC, eventos</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>SOA:</b> descompone <b>capacidades del negocio</b> en servicios <b>autónomos</b> con <b>contratos estandarizados</b>; resuelve la <b>integración punto a punto</b> (n·(n−1)/2: 6 sistemas → 15 integraciones → 6 contra contratos comunes). Servicio = unidad con <b>significado de negocio</b>, accedida <b>sólo por su contrato</b>, implementación <b>encapsulada</b>, <b>granularidad gruesa</b>. Actores: <b>consumidor / proveedor / registro</b> (publica–descubre–invoca). Principios (Erl): contrato estandarizado, bajo acoplamiento, abstracción, <b>reutilización</b>, autonomía, <b>sin estado</b>, descubrimiento, composición. <b>Tipos de servicio:</b> de <b>proceso/tarea</b> (orquestan, poco reutilizables), de <b>entidad</b> (agnósticos del proceso, <b>muy reutilizables</b>), <b>utilitarios</b> (transversales: notificaciones, auditoría). <b>ESB:</b> enrutamiento, transformación, mediación de protocolos, virtualización, orquestación, seguridad/monitoreo; ⚠️ <b>punto único de falla</b>, <b>smart pipes</b>, cuello de botella <b>organizacional</b>, licencias.</p>
          <h3>Microservicios</h3>
          <p><b>Qué son:</b> servicios <b>pequeños y autónomos</b>, cada uno en <b>su propio proceso</b>, construidos
          alrededor de una <b>capacidad de negocio</b>, con <b>despliegue independiente</b>, <b>gestión
          descentralizada</b>, <b>datos propios</b> y <b>APIs bien definidas</b>.</p>
          <p><b>Dónde se corta:</b> por <b>BOUNDED CONTEXT</b> (DDD). Un único modelo para todo el dominio genera
          contradicciones: <b>el mismo concepto tiene modelos distintos en cada contexto</b>.</p>
          <p><b>Base de datos por servicio — los 6 principios</b></p>
          <ul>
            <li><b>Autoridad:</b> cada servicio es dueño de sus datos y sus reglas.</li>
            <li><b>Encapsulamiento:</b> no se tocan las tablas internas de otro servicio.</li>
            <li><b>IDs independientes</b> por servicio.</li>
            <li><b>Referencias externas</b> guardadas como <b>IDs lógicos</b>.</li>
            <li><b>No hay integridad referencial entre servicios:</b> se valida en la aplicación.</li>
            <li><b>ACID sólo dentro</b> de cada servicio; lo que cruza varios, con <b>Saga</b>.</li>
          </ul>
          <p><b>Cómo acceder a datos de otro servicio — 3 opciones</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Opción</th><th>Cómo</th><th>Trade-off</th></tr></thead>
            <tbody>
              <tr><td><b>A · Referencia + API</b><br><span class="mini">(API Composition)</span></td><td>Guardo el ID externo y le pregunto al dueño</td><td>Datos frescos, pero <b>latencia y dependencia de disponibilidad</b></td></tr>
              <tr><td><b>B · Réplica local</b><br><span class="mini">(read model)</span></td><td>Replico sólo los atributos que necesito, sincronizando por eventos</td><td>Más autonomía, pero <b>consistencia eventual</b> y hay que sincronizar</td></tr>
              <tr><td><b>C · Base compartida</b></td><td>Excepción: vistas y permisos de lectura</td><td><b>Acoplamiento al esquema</b> y menos independencia</td></tr>
            </tbody>
          </table></div>
          <p><b>⚠️ Los desafíos:</b> más complejidad operativa · pruebas difíciles · gobernanza · <b>latencia por cada
          salto</b> · integridad de datos · requiere cultura DevOps · versionado entre servicios · experiencia del
          equipo.</p>
          <p><b>El número que hay que citar:</b> si cada servicio funciona el 99% del tiempo, una operación que pasa por
          tres funciona el <b>0,99³ ≈ 97%</b>. <b>Cada salto resta.</b></p>
          <p><b>Antipatrones:</b> <b>nanoservicios</b> (un servicio por tabla: la red y la operación cuestan más que el
          beneficio) y <b>teraservicios</b> (tan grandes que son casi un monolito).</p>
          <p><b>Migración:</b> <b>Strangler</b> (una fachada va derivando funcionalidad al servicio nuevo, sin big bang)
          y <b>Adaptador</b> (envolver un SOAP legado y exponerlo como REST).</p>
          <h3>SAGA, Outbox y coordinación</h3>
          <p><b>SAGA.</b> Como no hay una transacción que abarque varios servicios, el flujo se hace con una
          <b>secuencia de transacciones locales</b>; si una falla, <b>se compensan las anteriores en orden inverso</b>
          con operaciones de negocio inversas (cancelar el pedido, liberar el stock). Se puede coordinar por
          <b>coreografía</b> (cada servicio reacciona al evento del anterior) o por <b>orquestación</b> (un orquestador
          indica cada paso y cada compensación).</p>
          <p><b>Outbox / Inbox.</b> Resuelve el <b>problema de la doble escritura</b>: guardar el cambio y publicar el
          evento son <b>dos operaciones</b> y si una falla quedan inconsistentes.</p>
          <ul>
            <li><b>Outbox (emisor):</b> el evento se guarda <b>en la misma transacción</b> que el cambio, en una tabla; un proceso aparte (relay o CDC) lo publica. Garantía <b>at-least-once</b>.</li>
            <li><b>Inbox (receptor):</b> registra el id del mensaje ya procesado en su propia transacción y <b>descarta los duplicados</b>.</li>
          </ul>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>Orquestación</th><th>Coreografía</th></tr></thead>
            <tbody>
              <tr><td>Control</td><td><b>Centralizado</b> (un orquestador)</td><td><b>Distribuido</b>: reaccionan a eventos</td></tr>
              <tr><td>Comunicación</td><td>Predominantemente sincrónica</td><td>Predominantemente asincrónica</td></tr>
              <tr><td>Acoplamiento</td><td>Mayor</td><td><b>Bajo</b></td></tr>
              <tr><td>Trazabilidad</td><td><b>Alta:</b> el flujo se ve</td><td><b>Baja:</b> difícil de depurar</td></tr>
              <tr><td>Típica de</td><td><b>SOA</b> (BPM, BPEL)</td><td><b>Microservicios</b> y eventos</td></tr>
            </tbody>
          </table></div>
          <p><b>Ley de Conway:</b> “las organizaciones producen diseños que <b>copian sus estructuras de
          comunicación</b>”. Equipos por capa técnica → arquitectura por capas; equipos por capacidad de negocio →
          servicios de negocio.</p>
          <h3>Nube vs. On-Premise</h3>
          <p><b>Modelos de despliegue (es un espectro, no binario):</b> <b>On-Premise</b> (todo propio) ·
          <b>Housing/Colocation</b> (servidores propios en datacenter de terceros) · <b>Nube pública</b> ·
          <b>Nube privada</b> · <b>Híbrida</b> · <b>Multicloud</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Modelo</th><th>Vos gestionás</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td><b>On-Premise</b></td><td><b>Todo</b></td><td>Datacenter propio</td></tr>
              <tr><td><b>IaaS</b></td><td>Desde el <b>sistema operativo</b> para arriba</td><td>EC2, Azure VMs</td></tr>
              <tr><td><b>PaaS</b></td><td><b>La aplicación y los datos</b></td><td>App Service, Heroku</td></tr>
              <tr><td><b>FaaS</b> (serverless)</td><td><b>La función</b> y los datos</td><td>AWS Lambda</td></tr>
              <tr><td><b>SaaS</b></td><td><b>Sólo tus datos</b> y su configuración</td><td>Microsoft 365, Gmail</td></tr>
            </tbody>
          </table></div>
          <p><i>La analogía de la pizza:</i> hecha en casa = On-Premise · para hornear = IaaS · delivery = PaaS · en el
          restaurante = SaaS.</p>
          <p><b>Responsabilidad compartida.</b> El proveedor protege la <b>infraestructura</b> (“seguridad <b>DE</b> la
          nube”: datacenters, hardware, hipervisor). El cliente protege <b>lo que construye encima</b> (“seguridad
          <b>EN</b> la nube”: datos, IAM, configuración, cifrado y —en IaaS— el SO). <b>Contratar nube no transfiere la
          responsabilidad sobre los datos</b>, y <b>la mayoría de los incidentes son configuraciones incorrectas del
          cliente</b>.</p>
          <div class="grid-2">
            <div class="card">
              <p><b>✅ Nube</b></p>
              <ul>
                <li><b>Elasticidad:</b> escalar arriba y abajo en minutos</li>
                <li><b>Pago por uso (OPEX)</b>, sin inversión inicial</li>
                <li><b>Alcance global</b> y alta disponibilidad nativa</li>
                <li><b>Servicios administrados</b> y mejor <b>time-to-market</b></li>
              </ul>
              <p><b>⚠️</b> costos variables (<b>FinOps</b>) · <b>egress</b> · <b>vendor lock-in</b> · ubicación de los datos · depende de la conectividad</p>
            </div>
            <div class="card">
              <p><b>✅ On-Premise</b></p>
              <ul>
                <li><b>Control total</b> del hardware y las ventanas de mantenimiento</li>
                <li><b>Soberanía y regulación</b> (Ley 25.326, BCRA)</li>
                <li><b>Latencia local</b> e <b>independencia de Internet</b> (SCADA, planta)</li>
                <li><b>Costo predecible</b> con carga alta y estable</li>
              </ul>
              <p><b>⚠️</b> sala, energía (UPS, grupo electrógeno), clima, seguridad física, personal 24×7, renovación de hardware cada 3-5 años</p>
            </div>
          </div>
          <p><b>Región y zonas:</b> una <b>región</b> agrupa varias <b>zonas de disponibilidad (AZ)</b>, que son
          datacenters con energía, red y clima <b>independientes</b>. <b>2 o más AZ</b> protegen de la caída de un
          datacenter; <b>multi-región</b>, de un desastre regional.</p>
          <p><b>Tiers:</b> I 99,671% · II 99,741% · <b>III mantenible concurrentemente 99,982%</b> ·
          <b>IV tolerante a fallas 99,995%</b>.</p>
          <p><b>CAPEX vs OPEX:</b> carga <b>variable o incierta</b> → gana la nube. Carga <b>alta, estable y
          predecible</b> → on-premise puede ganar. <b>Siempre comparando TCO</b> (personal, energía, clima, renovación,
          licencias), no el precio del servidor.</p>
        </section>

        <!-- ===================== SECCIÓN 10 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 10 · INTEGRACIÓN DE SISTEMAS</span>
          <p class="mini"><b>Integrar</b> = que dos sistemas se hablen: compartir datos y funcionalidades <b>sin copiar todo</b>. <b>Hay que acordar un CONTRATO</b>: qué se pide, en qué formato, qué se responde y cómo viaja. <b>Por qué:</b> no reescribir lo resuelto, <b>consultar no copiar</b>, necesidades del negocio y <b>marco legal</b> (ARCA). <b>Sincrónica</b> = llamada telefónica (A espera; ambos disponibles a la vez; si B no atiende, A falla). <b>Asincrónica</b> = WhatsApp (A deja el mensaje y sigue; B procesa cuando puede). <b>Pregunta clave: ¿quien llama NECESITA la respuesta para continuar? Si no → asincrónico.</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>REST</th><th>SOAP</th><th>GraphQL</th><th>gRPC</th></tr></thead>
            <tbody>
              <tr><td>Idea</td><td>Recursos + verbos HTTP, <b>stateless</b></td><td><b>Envelope XML</b> (Header opc. + <b>Body oblig.</b> + Fault)</td><td><b>Un endpoint</b>; el cliente pide <b>exactamente</b> lo que necesita</td><td><b>RPC</b>: se ve como llamar una función local</td></tr>
              <tr><td>Contrato</td><td><b>OpenAPI</b></td><td><b>WSDL + XSD</b> (<code>?wsdl</code>)</td><td><b>Esquema tipado (SDL)</b></td><td><b>.proto</b> (Protobuf)</td></tr>
              <tr><td>Formato / transporte</td><td>JSON / HTTP</td><td>XML / HTTP, FTP, SMTP, colas</td><td>JSON / HTTP</td><td><b>Binario</b> / <b>HTTP/2</b></td></tr>
              <tr><td>Acopl. / Seguridad</td><td>Bajo / HTTPS, OAuth2-JWT</td><td><b>Alto</b> / <b>WS-Security</b></td><td>Medio / HTTPS</td><td>Medio / TLS</td></tr>
              <tr><td>Usar para</td><td><b>APIs públicas</b>, web y mobile</td><td><b>Empresarial</b> con contratos formales (banca, ARCA)</td><td><b>Flexibilidad del consumidor</b>, menos llamadas</td><td><b>Interno entre servicios</b>, alto rendimiento</td></tr>
            </tbody>
          </table></div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Problema (sincrónico)</th><th>Patrón</th><th>Qué hace</th></tr></thead>
            <tbody>
              <tr><td>B no responde nunca</td><td><b>Timeout</b></td><td>Cuánto esperamos; <b>evita agotar hilos y conexiones</b></td></tr>
              <tr><td>Falla transitoria</td><td><b>Retry con backoff</b></td><td>Reintentos <b>limitados</b>, espaciados (+ jitter). <b>Sólo si es idempotente</b></td></tr>
              <tr><td>B sigue caída</td><td><b>Circuit breaker</b></td><td>Tras N fallos <b>abre</b>: deja de llamar y <b>falla rápido</b>; luego <b>semiabierto</b> prueba</td></tr>
              <tr><td>¿Doble cobro?</td><td><b>Idempotencia</b></td><td><b>Clave por operación</b>: repetirla da el mismo resultado una sola vez</td></tr>
              <tr><td>Igual hay que responder</td><td><b>Fallback</b></td><td>Degradar: “pendiente de pago”, datos en caché</td></tr>
            </tbody>
          </table></div>
          <h3>Colas de mensajes</h3>
          <p><b>Las 5 piezas:</b> <b>mensaje</b> · <b>productor</b> (lo deja) · <b>cola</b> (FIFO; <b>cada mensaje lo
          procesa UN solo consumidor</b>) · <b>consumidor</b> (lo toma) · <b>broker</b> (el software que aloja las
          colas: RabbitMQ, SQS).</p>
          <p><b>Los 4 casos borde — es lo que preguntan</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:22%">Escenario</th><th>Qué pasa</th><th>Qué hay que decir</th></tr></thead>
            <tbody>
              <tr><td><b>1 · B está caído</b></td><td>La cola <b>acepta igual</b>; los mensajes se acumulan y A ni se entera. Cuando B vuelve, <b>drena en orden</b></td><td><b>No se pierde nada:</b> sale más tarde, pero sale. Es <b>consistencia eventual</b></td></tr>
              <tr><td><b>2 · B lento o pico</b></td><td>La cola <b>amortigua</b> (crece el backlog) y A no se frena. Se <b>escalan consumidores</b></td><td>⚠️ Con varios consumidores <b>el orden ya no es estricto</b></td></tr>
              <tr><td><b>3 · B cae antes del ACK</b></td><td>El mensaje <b>se borra al recibir el ACK, no al entregarlo</b>: se <b>reentrega</b></td><td>Puede llegar <b>dos veces</b> → el consumidor <b>debe ser IDEMPOTENTE</b></td></tr>
              <tr><td><b>4 · Mensaje venenoso</b></td><td>Falla siempre (un CUIT inválido). Tras N reintentos va a la <b>DLQ</b></td><td>La DLQ lo <b>aparta sin perderlo</b> para no frenar a los demás; se alerta y se reprocesa</td></tr>
            </tbody>
          </table></div>
          <p><b>Garantías de entrega:</b> <b>at-most-once</b> (puede perderse, nunca duplica) · <b>at-least-once</b>
          (<b>el habitual</b>: no se pierde, puede duplicar ⇒ <b>idempotencia</b>) · <b>exactly-once</b> (ideal pero
          caro; en la práctica at-least-once + deduplicación).</p>
          <p><b>Cola o topic:</b> una <b>ORDEN</b> la hace alguien <b>una vez</b> → <b>cola</b>. Un <b>EVENTO</b> le
          interesa a varios → <b>topic</b>.</p>
          <p><b>Qué monitorear:</b> tamaño de la cola · <b>antigüedad del mensaje más viejo</b> · mensajes en DLQ.</p>
          <p class="mini"><b>BD COMPARTIDA:</b> no se llaman, <b>se comunican por los datos</b>; el <b>contrato es el esquema</b>. ✅ simple, consistencia fuerte, <b>JOINs</b> para reportes cruzados. ⚠️ <b>acoplamiento fuerte al esquema</b>, <b>punto único de falla y contención</b> (si cae, <b>caen los dos</b>; un reporte pesado de B <b>bloquea</b> a A), <b>cada cambio de tabla rompe al otro</b> (renombrar una columna rompe a B <b>sin que B haya cambiado nada</b>), B se entera por <b>polling</b>. <b>“Menor esfuerzo inicial, mayor costo de evolución.”</b> Aceptable sólo con mismo equipo y despliegue, legado sin otra interfaz, o consistencia fuerte con carga baja.</p>
          <h3>Apache Kafka</h3>
          <p><b>La idea clave:</b> el evento <b>NO se borra al leerlo</b>; se conserva y <b>cada consumidor recuerda
          hasta dónde leyó</b> (su <i>offset</i>). Es un <b>diario</b>, no una cola.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th style="width:22%">Concepto</th><th>Qué es</th></tr></thead>
            <tbody>
              <tr><td><b>Tópico</b></td><td>La categoría de eventos, como una carpeta</td></tr>
              <tr><td><b>Partición</b></td><td>Un tramo ordenado del tópico; reparte la carga</td></tr>
              <tr><td><b>Offset</b></td><td>La posición de cada evento dentro de su partición</td></tr>
              <tr><td><b>Clave</b></td><td><code>partición = hash(clave) % N</code>. <b>Misma clave → misma partición → orden garantizado.</b> Entre particiones <b>no hay orden global</b>: por eso la clave es la entidad que necesita orden</td></tr>
              <tr><td><b>Grupo de consumidores</b></td><td><b>Dentro</b> del grupo cada partición la lee <b>una sola</b> instancia (reparte); <b>cada grupo recibe todo</b> (duplica). Más instancias que particiones no sirve</td></tr>
              <tr><td><b>Retención y replay</b></td><td>Conserva los eventos N días aunque ya se hayan leído: el consumidor caído <b>retoma desde su offset</b> y un servicio nuevo <b>lee todo el historial</b></td></tr>
              <tr><td><b>Broker y réplicas</b></td><td>Cada partición tiene un <b>líder</b> y <b>seguidoras</b>. Si cae un broker, una seguidora <b>pasa a líder</b></td></tr>
              <tr><td><b>acks</b></td><td><b>0</b> no espera (puede perder) · <b>1</b> espera al líder · <b>all</b> líder + réplicas (el más seguro)</td></tr>
            </tbody>
          </table></div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>API</th><th>COLA</th><th>BD COMPARTIDA</th><th>KAFKA</th></tr></thead>
            <tbody>
              <tr><td>Comunicación</td><td>Sincrónica</td><td>Asincrónica</td><td>Indirecta por datos</td><td>Asincrónica por eventos</td></tr>
              <tr><td>Acoplamiento</td><td>Medio (contrato)</td><td><b>Bajo</b></td><td><b>Muy alto</b> (esquema)</td><td><b>Bajo</b></td></tr>
              <tr><td>Si B cae</td><td>A falla o resiste</td><td>Se acumulan mensajes</td><td><b>Caen ambos</b></td><td>Retoma del offset</td></tr>
              <tr><td>Si B es lento</td><td>A espera o corta</td><td>Se absorbe</td><td><b>Contención</b> de bloqueos</td><td>Atrasa su lectura</td></tr>
              <tr><td>Respuesta inmediata</td><td><b>Sí</b></td><td>No</td><td>Sí (consulta)</td><td>No</td></tr>
              <tr><td>Complejidad</td><td>Media</td><td>Media (idempotencia, DLQ)</td><td>Baja al inicio</td><td><b>Alta</b> (clúster)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cómo elegir:</b> ¿necesito la respuesta <b>ya</b>? → <b>API</b> (+ timeout, retry, circuit breaker). ¿Puede esperar y <b>no debe perderse</b>? → <b>cola</b>. ¿<b>Muchos lectores</b> o <b>historial/replay</b>? → <b>Kafka</b>. ¿Mismo equipo y legado? → recién ahí BD compartida. <b>Una solución suele COMBINAR:</b> API para cobrar, cola para facturar. <b>IoT/sensores:</b> <b>MQTT</b> (liviano, pub/sub, QoS, tolera conectividad intermitente) + broker + <b>Edge Gateway</b> que bufferea y reintenta → ingesta → <b>TSDB</b>.</p>
          <h3>El circuit breaker, estado por estado</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estado</th><th>Qué hace</th><th>Cuándo cambia</th></tr></thead>
            <tbody>
              <tr><td><b>CERRADO</b></td><td>Pasa el tráfico normal y <b>mide la tasa de fallas</b></td><td>Supera el <b>umbral</b> (ej. 50%) → <b>ABIERTO</b></td></tr>
              <tr><td><b>ABIERTO</b></td><td><b>Intercepta sin tocar al destino</b> y responde el <b>fallback</b></td><td>Vence la <b>sleep window</b> → <b>SEMIABIERTO</b></td></tr>
              <tr><td><b>SEMIABIERTO</b></td><td>Deja pasar unas pocas llamadas de prueba (<b>probes</b>)</td><td>Funcionan → CERRADO · fallan → ABIERTO</td></tr>
            </tbody>
          </table></div>
          <p><b>Para qué sirve:</b> evita la <b>falla en cascada</b>, <b>libera hilos</b>, le da tiempo de recuperación
          al servicio dañado y permite <b>degradar con gracia</b>.</p>
          <p><b>Bulkhead (mamparo):</b> <b>aislar los pools de recursos por dependencia</b>, para que una dependencia
          lenta <b>no consuma todos los hilos</b>. Es el complemento del timeout.</p>
          <h3>Otros patrones que pueden pedir</h3>
          <ul>
            <li><b>CQRS:</b> separar el modelo de <b>escritura</b> del de <b>lectura</b>. Con <b>API Composition</b>, es cómo se resuelven consultas que cruzan servicios <b>sin joins entre bases</b>.</li>
            <li><b>CDC (Change Data Capture):</b> <b>Debezium</b> lee el <b>log de transacciones</b> de la base y publica los cambios como eventos. Alternativa al relay por polling del <b>Outbox</b>.</li>
            <li><b>2PC (commit de dos fases):</b> coordina entre sistemas pero es <b>lento, bloqueante y poco disponible</b> → <b>por eso se usa SAGA</b>.</li>
            <li><b>Consumer lag:</b> atraso del consumidor Kafka respecto del último mensaje. Es <b>la métrica de saturación</b> a monitorear.</li>
          </ul>
        </section>

        <!-- ===================== SECCIÓN 11 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 11 · OBSERVABILIDAD · INFRA · DESPLIEGUE · COMPONENTES</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>MONITOREO</th><th>OBSERVABILIDAD</th></tr></thead>
            <tbody>
              <tr><td>Responde</td><td><b>¿Qué pasa y cuándo?</b></td><td><b>¿Por qué pasa y cómo se origina?</b></td></tr>
              <tr><td>Problemas</td><td><b>Conocidos</b> (anticipados)</td><td>Conocidos <b>y nuevos, no anticipados</b></td></tr>
              <tr><td>Enfoque</td><td>Métricas definidas <b>de antemano</b> vs. <b>umbrales</b></td><td><b>Explorar</b> los datos, preguntas libres</td></tr>
              <tr><td>Datos</td><td>Principalmente <b>métricas</b></td><td><b>Logs + métricas + trazas correlacionados</b></td></tr>
              <tr><td>Resultado</td><td><b>Síntomas y alertas</b></td><td><b>Causa raíz</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>“El monitoreo busca ALERTAR; la observabilidad busca ENTENDER” — y el monitoreo es una PARTE de ser observable.</b> <b>Trazabilidad</b> = seguir <b>una operación de punta a punta</b> (trace_id): responde <b>¿DÓNDE pasó y cuánto tardó cada parte?</b>; es <b>uno de los 3 pilares</b>. <b>Observabilidad</b> (Kálmán, teoría de control): inferir los <b>estados internos</b> a partir de las <b>salidas externas</b> (telemetría). <i>Monitoreo = tablero del auto; observabilidad = scanner del mecánico.</i> <b>3 niveles:</b> lo conocido (dashboards/health checks) · sabemos que puede fallar (alertas con umbrales) · <b>lo que nunca imaginamos</b> (sólo observabilidad).</p>
          <p class="mini"><b>LOS 3 PILARES:</b> <b>MÉTRICAS</b> = ¿qué y cuánto? (signos vitales; agregadas; costo bajo; <b>alertas y tendencias</b>) · <b>LOGS</b> = ¿por qué y qué exactamente? (diario detallado; muy verbosos; <b>diagnóstico profundo</b>) · <b>TRAZAS</b> = ¿dónde? (seguimiento de un envío; árbol de spans; se <b>muestrean</b>; <b>latencia entre servicios</b>). <b>Las métricas AVISAN, las trazas UBICAN, los logs EXPLICAN.</b> (4ª pata: <b>perfiles</b>/flame graph: en qué <b>función</b> se gasta el recurso.)</p>
          <p class="mini"><b>Logs — niveles:</b> TRACE · DEBUG · <b>INFO</b> (hitos normales) · <b>WARN</b> (algo raro, sigue funcionando) · <b>ERROR</b> (falló una operación) · <b>FATAL</b> (el proceso no puede continuar). En producción <b>INFO o superior</b>; DEBUG se activa <b>temporalmente sin redeploy</b>. <b>Estructurados (JSON)</b>: filtrar por campo, agrupar y contar, <b>unir con trazas por trace_id</b>, sin regex frágiles. <b>Evitar:</b> datos sensibles (<b>Ley 25.326</b>), payloads enteros, logs en ciclos calientes, mensajes sin contexto, usarlos como <b>única fuente de métricas</b>. <b>Pipeline:</b> app → agente (Fluent Bit/OTel) → almacenamiento (Elastic/Loki) → visualizador (Kibana/Grafana), con <b>retención y rotación</b>.</p>
          <h3>Métricas</h3>
          <p>Una métrica es <b>un número con contexto</b>: <code>nombre + etiquetas + valor + timestamp</code>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Tipo</th><th>Qué mide</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td><b>Counter</b></td><td><b>Sólo crece.</b> Se grafica su <b>rate</b>, no el crudo</td><td><code>pedidos_creados_total</code></td></tr>
              <tr><td><b>UpDownCounter</b></td><td>Sube y baja: lo que entra y sale</td><td><code>pedidos_en_preparacion</code></td></tr>
              <tr><td><b>Gauge</b></td><td>Valor <b>instantáneo</b></td><td><code>memoria_usada_mb</code></td></tr>
              <tr><td><b>Histogram</b></td><td><b>Distribución</b> en rangos</td><td><code>duracion_pedido_ms</code></td></tr>
            </tbody>
          </table></div>
          <p><b>⚠️ El promedio miente.</b> Promedio ~250 ms, mediana 105 ms, <b>p95</b> 1,1 s, <b>p99</b> 2,8 s.
          <b>Siempre percentiles:</b> muestran lo que viven los usuarios con peor experiencia.</p>
          <p><b>⚠️ Cardinalidad.</b> Cada combinación de etiquetas es <b>una serie</b>. <b>Buenas:</b> service, method,
          status, region. <b>Malas:</b> <code>user_id</code>, <code>pedido_id</code>, <code>trace_id</code>, URL
          completa → esos van en <b>logs o trazas</b>. <b>Es lo que más encarece una TSDB.</b></p>
          <p class="mini"><b>Trazas:</b> <b>trace</b> (recorrido completo) · <b>span</b> (unidad de trabajo con inicio/fin; <b>parent_span_id</b> arma el árbol) · <b>attributes</b> (clave-valor de contexto) · <b>events</b> (marca puntual) · kind SERVER/CLIENT, status OK/ERROR. El <b>trace_id nace en el gateway</b> y <b>se propaga en cada llamada</b>. <b>Cascada:</b> ancho = duración, sangría = padre-hijo, huecos = espera. <b>Muestreo:</b> <b>head-based</b> (al inicio, simple y barato; ⚠️ descarta justo los errores) vs. <b>tail-based</b> (al final, <b>conserva errores y lentas</b>; ⚠️ buffer y recursos). <b>Regla: muestrear mucho lo normal y conservar SIEMPRE errores y latencia alta.</b></p>
          <h3>Alertas</h3>
          <p><b>Los 5 tipos:</b> umbral estático · tendencia/anomalía · basada en <b>SLO</b> · <b>ausencia de datos</b>
          (silencio) · compuesta.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>❌ Por CAUSA (frágil)</th><th>✅ Por SÍNTOMA (lo que sufre el usuario)</th></tr></thead>
            <tbody>
              <tr><td>CPU &gt; 80% en una instancia</td><td>p95 de “crear pedido” &gt; 2 s durante 5 min</td></tr>
              <tr><td>Un contenedor se reinició</td><td>% de pedidos fallidos &gt; 1%</td></tr>
              <tr><td>La cola tiene 500 mensajes</td><td>La factura tarda más de 2 min</td></tr>
              <tr><td>El disco está al 70%</td><td>El disco se llena en menos de 4 horas</td></tr>
            </tbody>
          </table></div>
          <p><b>Una buena alerta:</b> accionable · urgente · con <b>dueño y runbook</b> · con severidad.
          <b>Alert fatigue:</b> si todo alerta, nada se atiende. <b>Parámetros:</b> umbral + <b>duración (for)</b> —sin
          ella, un pico de un segundo despierta a alguien a las 3 AM— + agregación + umbral de recuperación.</p>
          <p><b>SLI / SLO / SLA</b> = la medición · el objetivo interno · el contrato con penalidad.
          <b>Error budget</b> = 100% − SLO (99,5% → <b>216 min/mes</b>). Al <b>80%</b> se frenan cambios riesgosos; al
          <b>100%</b> se congelan los lanzamientos.</p>
          <h3>Infraestructura</h3>
          <p><b>La escalera (de más control a más abstracción):</b> <b>bare metal</b> → <b>VM</b> (SO completo, GBs,
          minutos, aislamiento fuerte) → <b>contenedor</b> (<b>comparte el kernel</b>, MBs, segundos; fin del “en mi
          máquina funciona”) → <b>Kubernetes</b> → <b>serverless</b>.</p>
          <p><b>Kubernetes:</b> declarás el <b>estado deseado</b> y él lo mantiene · decide en qué nodo corre cada
          contenedor · <b>self-healing</b> · autoescalado · <b>rolling updates</b> y rollback.</p>
          <p><b>Ambientes:</b> Dev (ficticios) · QA (de prueba) · <b>Staging</b> (réplica fiel, datos
          <b>anonimizados</b>) · Producción. <b>Paridad = menos sorpresas</b>; <b>nunca copiar datos reales sin
          anonimizar</b> (Ley 25.326).</p>
          <p><b>Mutable vs inmutable:</b> “<b>mascotas</b>” (se parchean en vivo → <i>drift</i>, servidores copo de
          nieve) vs “<b>ganado</b>” (<b>se reemplaza la imagen</b>; rollback = redesplegar la anterior). Se apoya en
          <b>IaC</b>: infraestructura versionada y auditable.</p>
          <p><b>CI/CD:</b> el <b>artefacto se construye una sola vez</b> y recorre todos los ambientes.
          <b>Delivery</b> = con aprobación manual · <b>Deployment</b> = sin intervención. Es una <b>decisión de
          negocio</b>.</p>
          <p><b>RPO / RTO</b> = cuántos <b>datos</b> tolero perder / cuánto <b>tiempo</b> sin servicio. <b>DR:</b>
          Backup &amp; Restore (horas/días) → <b>Pilot Light</b> → <b>Warm Standby</b> → <b>Activo-Activo</b> (≈0/≈0).</p>
          <h3>Estrategias de despliegue</h3>
          <p><b>DEPLOY ≠ RELEASE.</b> Deploy = decisión <b>técnica</b> (puede no notarlo nadie). Release = decisión de
          <b>negocio</b>. Toda estrategia balancea <b>4 dimensiones</b>: downtime · <b>radio de impacto</b> · costo de
          infra · velocidad de rollback.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estrategia</th><th>Cómo</th><th>Downtime</th><th>Rollback</th><th>Costo</th></tr></thead>
            <tbody>
              <tr><td><b>Recreate</b></td><td>Se baja todo y se sube lo nuevo</td><td><b>SÍ</b> (el único)</td><td>Lento</td><td>Bajo</td></tr>
              <tr><td><b>Rolling</b></td><td>De a una instancia. <b>Conviven v1 y v2</b>: API y base compatibles con ambas. Default de K8s</td><td>No</td><td>Lento</td><td>Bajo</td></tr>
              <tr><td><b>Blue/Green</b></td><td>Dos entornos idénticos, se conmuta el tráfico</td><td>No</td><td><b>Inmediato</b></td><td><b>2× (el único)</b></td></tr>
              <tr><td><b>Canary</b></td><td>1% → 5% → 25% → 50% → 100% <b>según métricas</b></td><td>No</td><td>Rápido</td><td>Medio</td></tr>
            </tbody>
          </table></div>
          <p><b>No confundir:</b> <b>Canary</b> = técnico (¿es estable?) · <b>A/B testing</b> = de negocio (¿cuál
          convierte más?) · <b>Shadow</b> = copia el tráfico y <b>descarta la respuesta</b> (⚠️ no cobrar ni mailear dos
          veces).</p>
          <p><b>Feature flags:</b> separan deploy de release, activación gradual, <b>kill switch</b>. ⚠️ Deuda técnica
          si no se eliminan.</p>
          <div class="callout key">
            <div class="callout-title">⭐ EXPAND AND CONTRACT — cambiar el esquema sin downtime</div>
            <p class="mini">Es la respuesta a “<b>durante un rolling update conviven v1 y v2, así que la base tiene que ser compatible con ambas</b>”. Tres fases:</p>
            <p class="mini"><b>① EXPAND:</b> se <b>agrega</b> la columna/tabla nueva <b>manteniendo activa la anterior</b> → compatibilidad hacia atrás, la v1 sigue funcionando. <b>② MIGRATE / DUAL WRITE:</b> se despliega la versión nueva, que <b>escribe en ambas</b> estructuras, y se migran los datos históricos <b>en segundo plano</b>. <b>③ CONTRACT:</b> cuando se verifica que <b>ningún servicio consulta la estructura vieja</b>, se elimina.</p>
            <p class="mini"><b>Regla general:</b> los cambios de esquema y de contrato de API deben ser <b>aditivos</b> (agregar campos opcionales), nunca renombrar o borrar de una. <b>Rollback vs roll-forward:</b> <b>rollback</b> = volver a la versión anterior (rápido, pero <b>falla si hubo cambios de datos incompatibles</b> — justamente por eso Expand &amp; Contract); <b>roll-forward</b> = arreglar y desplegar una versión nueva, que se elige cuando volver atrás no es posible o es más riesgoso.</p>
          </div>
          <p class="mini"><b>MELT:</b> la cátedra enseña <b>3 pilares</b> (logs, métricas, trazas) <b>+ profiling</b> como cuarta pata. En la industria se usa el acrónimo <b>MELT = Metrics, Events, Logs, Traces</b>; todos se vinculan por el <b>Correlation ID / Trace ID</b>. Si lo nombrás, aclaralo así.</p>
          <p class="mini"><b>Componentes:</b> <b>DNS</b> (nombre→IP, cacheado por <b>TTL</b>; failover, geo-routing, ponderado; TTL alto = mejor performance pero <b>conmutación más lenta</b>) · <b>Proxy directo</b> (en nombre de los <b>clientes</b>; filtrado corporativo) vs. <b>Proxy reverso</b> (en nombre de los <b>servidores</b>; terminación TLS, caché, oculta la topología; <b>base del LB, el API Gateway y el WAF</b>) · <b>IAM/IDM</b> (identidades, roles y permisos centralizados: <b>altas y bajas en un lugar</b>) · <b>SSO</b> (autenticarse <b>una vez</b> para varias apps; OAuth2/OIDC/SAML; <b>el IdP es crítico</b>) · <b>MFA</b> · <b>WAF</b> (bloquea <b>OWASP Top 10</b>, rate limiting, <b>parches virtuales</b>) · <b>Secretos</b> (<b>nunca en el repo</b>: queda en el historial; bóveda con acceso, auditoría y <b>rotación</b>; inyectados por variables de entorno).</p>
        </section>

        <!-- ===================== SECCIÓN 12 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 12 · SÍNTOMA → RESPUESTA + FRASES + CHECKLIST</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Si el enunciado dice…</th><th>Respondé</th><th>Atributos</th></tr></thead>
            <tbody>
              <tr><td>“puede tardar”, “proceso pesado”, “no hace falta la respuesta ya”</td><td><b>Cola/broker</b> + responder <b>202</b>; consumidores escalables e <b>idempotentes</b>, reintentos y <b>DLQ</b></td><td>Escalabilidad, Disponibilidad, Performance</td></tr>
              <tr><td>“picos de tráfico”, “x10 en 3 días”, “miles al mismo horario”</td><td><b>Escalado horizontal</b> + LB + autoescalado + <b>cola que amortigua</b></td><td>Escalabilidad, Disponibilidad</td></tr>
              <tr><td>“varios servicios deben enterarse”</td><td><b>Topic</b> (pub/sub); el productor no conoce a los consumidores</td><td>Mantenibilidad, Escalabilidad</td></tr>
              <tr><td>“hay que hacerlo una sola vez” (una orden)</td><td><b>Cola</b> punto a punto</td><td>Confiabilidad</td></tr>
              <tr><td>“servicio externo con caídas y lentitud”</td><td><b>Timeout + retry con backoff + circuit breaker + fallback</b> (+ caché del último valor) y <b>Adapter</b> en el dominio</td><td>Disponibilidad, Tolerancia a fallos</td></tr>
              <tr><td>“tarea diaria/mensual/periódica”</td><td><b>Cron / scheduler</b> (cuidar <b>ejecución única</b> con varias instancias) + cola para el fan-out</td><td>Confiabilidad</td></tr>
              <tr><td>“tarda horas y algunos días no termina; no quiero hardware más caro”</td><td><b>Paralelizar con cola + N workers</b> (escalado horizontal del procesamiento), particionando el trabajo</td><td>Performance, Escalabilidad, Costo</td></tr>
              <tr><td>“imágenes/videos lentos y mucho ancho de banda”</td><td><b>Object storage + CDN</b>; el backend sólo entrega la <b>URL</b> (nunca binarios en la base)</td><td>Performance, Escalabilidad, Costo</td></tr>
              <tr><td>“se consulta mucho lo mismo, accesos concurrentes a la base”</td><td><b>Caché</b> (Redis/HTTP con TTL) + <b>réplicas de lectura</b>; si es analítica, <b>read model/columnar</b></td><td>Performance, Disponibilidad</td></tr>
              <tr><td>“terceros quieren flexibilidad y menos llamadas”</td><td><b>GraphQL</b> (+ límites de complejidad, paginación, rate limiting, caché)</td><td>Mantenibilidad, Performance</td></tr>
              <tr><td>“web + mobile + terceros”</td><td><b>API REST versionada</b> + <b>API Gateway</b> (o <b>BFF</b> por cliente) + <b>JWT</b></td><td>Mantenibilidad, Escalabilidad</td></tr>
              <tr><td>“cientos de sensores enviando lecturas”</td><td><b>MQTT</b> + broker (+ <b>Edge Gateway</b>) → ingesta → <b>TSDB</b>; consumidores idempotentes</td><td>Escalabilidad, Disponibilidad</td></tr>
              <tr><td>“login de usuarios que entran sólo para eso”</td><td><b>IDM/IdP externo con SSO</b> (OIDC: Google/Microsoft) → JWT; no custodiar credenciales propias</td><td>Seguridad, Usabilidad, Mantenibilidad</td></tr>
              <tr><td>“datos sensibles / confidencialidad”</td><td><b>TLS</b> en tránsito (también interno), <b>cifrado en reposo</b> y por columna, claves en bóveda, <b>hash+salt</b> de passwords, RBAC con <b>alcance</b>, minimización, <b>anonimizar</b> en testing, auditoría</td><td>Seguridad</td></tr>
              <tr><td>“integridad de los datos/documentos”</td><td><b>Hash/checksum</b>, <b>firma digital o HMAC</b>, constraints e integridad referencial, transacciones, <b>log append-only</b></td><td>Seguridad</td></tr>
              <tr><td>“burbuja/notificación en tiempo real si está conectado”</td><td><b>WebSocket</b> (o SSE) desde el servicio de notificaciones, alimentado por el <b>evento</b> del broker; fallback a <b>polling</b></td><td>Usabilidad, Performance</td></tr>
              <tr><td>“dashboard en tiempo real con datos de GPS”</td><td>Dispositivo → <b>MQTT/broker</b> → ingesta → <b>TSDB</b> + <b>WebSocket</b> al tablero (pub/sub de punta a punta)</td><td>Performance, Escalabilidad</td></tr>
              <tr><td>“un paso del flujo distribuido falla”</td><td><b>SAGA</b> con compensaciones (+ <b>Outbox/Inbox</b> para no perder eventos); <b>degradar antes que romper</b></td><td>Consistencia, Disponibilidad</td></tr>
              <tr><td>“¿por qué tardó?” / “no sabemos qué pasó”</td><td><b>Correlation ID</b> + log aggregator + <b>trazas</b> + <b>Golden Signals</b> y alertas por síntoma</td><td>Observabilidad, Mantenibilidad</td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">FRASES PARA JUSTIFICAR (adaptá los corchetes)</div>
            <p class="mini"><b>Asincronismo:</b> “Uso una cola porque <b>quien llama no necesita la respuesta para continuar</b>: desacopla en el tiempo (si [B] está caído los mensajes esperan), <b>amortigua los picos</b> y permite escalar consumidores. Costo: <b>consistencia eventual</b> y consumidores <b>idempotentes</b> porque la entrega es <b>at-least-once</b>; los mensajes irreprocesables van a una <b>DLQ</b>.”</p>
            <p class="mini"><b>Escalado:</b> “Escalado <b>horizontal</b> detrás de un balanceador: mejora <b>performance</b> y <b>disponibilidad</b> (elimina el punto único de falla), a diferencia del vertical que sólo mejora performance y <b>tiene techo físico</b>. Requiere servicios <b>stateless</b> con la sesión externalizada, para no depender de <b>sticky sessions</b>.”</p>
            <p class="mini"><b>Desnormalización:</b> “Es desnormalización por <b>consistencia</b>: el dato debe quedar <b>congelado al momento del hecho</b> porque el comprobante es inmutable; no es redundancia, es un dato propio de la operación.” / “Por <b>performance</b>, justificada por [N lecturas/min] contra escrituras infrecuentes, <b>conservando la FK</b>, con [tabla] como <b>fuente de verdad</b>, propagación encapsulada y <b>proceso de recálculo</b>.”</p>
            <p class="mini"><b>Herencia:</b> “<b>SINGLE_TABLE</b> con discriminador porque los subtipos agregan pocos atributos y las consultas son polimórficas; asumo columnas nulables. Con muchos atributos obligatorios propios iría <b>JOINED</b>.”</p>
            <p class="mini"><b>NoSQL:</b> “Propongo [tipo] porque el patrón de acceso es [escritura masiva por clave / consulta por rango de tiempo / agregaciones sobre históricos / documentos variables / relaciones], que es exactamente para lo que está optimizada; el resto del dominio transaccional sigue en relacional (<b>persistencia políglota</b>).”</p>
            <p class="mini"><b>Microservicios:</b> “Corto por <b>bounded context</b>, cada servicio con <b>su propia base</b> y comunicación por API/eventos. Costo: <b>no hay integridad referencial entre servicios</b> (IDs lógicos validados por la aplicación), <b>consistencia eventual</b> y <b>Saga</b> con compensaciones para los flujos que cruzan servicios; además cada salto <b>resta disponibilidad</b> (0,99³≈97%).”</p>
            <p class="mini"><b>Cierre (el que distingue):</b> “El costo que asumo es [consistencia eventual / complejidad operativa / ventana de inconsistencia], y lo mitigo con [idempotencia / DLQ y monitoreo del backlog / proceso de recálculo / circuit breaker y degradación].”</p>
          </div>
          <p class="mini"><b>CHECKLIST FINAL:</b> ☐ Repartí el tiempo <b>por puntaje</b> y <b>ninguna sección quedó en blanco</b> (se exige ≥50% en cada una) ☐ Escribí <b>supuestos</b> ☐ Todo decidido está <b>justificado por escrito</b> ☐ Nombré <b>y definí</b> los atributos de calidad ☐ Los diagramas tienen <b>título, leyenda y todas las flechas rotuladas con su protocolo</b> (HTTPS, AMQP, MQTT, JDBC) y lo <b>externo</b> marcado ☐ En el modelo de datos: <b>PK, FK, cardinalidad, modalidad, restricciones</b> ☐ N:M con <b>tabla intermedia</b> ☐ Ningún atributo <b>multivaluado</b> ☐ Herencia <b>elegida y justificada</b> ☐ Los <b>3 párrafos</b> (persistir / impedance / desnormalizar) ☐ Releí el enunciado buscando requerimientos que no aparezcan en mi solución.</p>
        </section>

        <!-- ===================== SECCIÓN 13 ===================== -->
        <section class="hoja">
          <span class="hoja-num">SECCIÓN 13 · GLOSARIO EXPRESS · FÓRMULAS · NÚMEROS</span>
          <div class="grid-2">
            <div class="card">
              <p class="mini"><b>ACID</b> — Atomicidad, Consistencia, Aislamiento, Durabilidad: garantías de una transacción <b>local</b>.<br>
              <b>ADR</b> — Architecture Decision Record: registro de una decisión arquitectónica <b>y su porqué</b>.<br>
              <b>API Composition</b> — resolver una consulta pidiendo a cada servicio dueño y uniendo en memoria (no hay join entre bases).<br>
              <b>at-least-once</b> — no se pierde, puede duplicarse ⇒ <b>consumidor idempotente</b>.<br>
              <b>Bounded Context</b> — límite de un modelo de dominio coherente (DDD); guía para cortar microservicios.<br>
              <b>Bulkhead</b> — pools de recursos aislados por dependencia; evita que una lenta consuma todos los hilos.<br>
              <b>CAPEX / OPEX</b> — inversión inicial amortizable / gasto recurrente por uso.<br>
              <b>CDC</b> — Change Data Capture: lee el log de transacciones de la base y publica los cambios (Debezium).<br>
              <b>Consumer lag</b> — atraso del consumidor Kafka respecto del último mensaje: métrica de saturación.<br>
              <b>Correlation ID / Trace ID</b> — identificador que une logs, métricas y trazas de una misma solicitud.<br>
              <b>CQRS</b> — separar el modelo de escritura del de lectura.<br>
              <b>CSR / SSR / SSG</b> — renderizado en cliente / en servidor por request / en build.<br>
              <b>Dirty read</b> — leer datos de una transacción no confirmada que puede hacer rollback.<br>
              <b>DLQ</b> — cola de mensajes que no se pudieron procesar.<br>
              <b>DIP</b> — el dominio define las interfaces; la infraestructura las implementa.<br>
              <b>Error budget</b> — 100% − SLO: margen de falla permitido.<br>
              <b>Expand &amp; Contract</b> — evolución de esquema en 3 fases sin downtime.<br>
              <b>Golden Signals</b> — latencia, tráfico, errores, saturación.<br>
              <b>Grado / Cardinalidad</b> — nº de atributos / nº de tuplas (en teoría relacional).<br>
              <b>HIT / MISS</b> — el recurso estaba válido en caché / hubo que ir al origen.<br>
              <b>Hidratación</b> — instanciar la clase y popular sus atributos no-lazy desde la base.</p>
            </div>
            <div class="card">
              <p class="mini"><b>Idempotencia</b> — repetir la operación no cambia el resultado (clave de idempotencia).<br>
              <b>Impedance mismatch</b> — desajuste objeto↔relacional: identidad, tipos, cardinalidad, herencia.<br>
              <b>MELT</b> — Metrics, Events, Logs, Traces (la cátedra: 3 pilares + profiling).<br>
              <b>Modalidad</b> — cantidad <b>mínima</b> de la relación (0 opcional / 1 obligatoria).<br>
              <b>Monolith First</b> — empezar monolito y dividir cuando se entienda el dominio (Fowler).<br>
              <b>N+1 queries</b> — 1 consulta + N por el lazy dentro de un ciclo; se cura con <code>JOIN FETCH</code>.<br>
              <b>Nano / Teraservicio</b> — demasiado chico (la red y la operación superan el beneficio) / casi un monolito.<br>
              <b>OpenAPI</b> — contrato de una API REST (Swagger). <b>WSDL</b> — el de SOAP.<br>
              <b>Origin server</b> — servidor al que recurre la CDN ante un MISS.<br>
              <b>Outbox</b> — el evento se guarda en la misma transacción que la entidad; un relay lo publica.<br>
              <b>Políglota</b> — distintos tipos de base en un mismo ecosistema, uno por necesidad.<br>
              <b>Puerto / Adaptador</b> — interfaz que define el dominio / implementación concreta (hexagonal).<br>
              <b>RPO / RTO</b> — datos que tolero perder / tiempo que tolero sin servicio.<br>
              <b>Saga</b> — transacciones locales + <b>compensaciones</b> en orden inverso.<br>
              <b>SLI / SLO / SLA</b> — medición / objetivo interno / contrato con penalidad.<br>
              <b>Span</b> — bloque de trabajo con inicio, fin y metadatos dentro de una traza.<br>
              <b>Stateless</b> — sin estado de sesión en el servidor; habilita el escalado horizontal.<br>
              <b>Sticky session</b> — el LB manda siempre al mismo usuario al mismo nodo (limita la flexibilidad).<br>
              <b>Strangler Fig</b> — reemplazar el monolito de a poco, ruta por ruta.<br>
              <b>TTL</b> — tiempo de validez de un recurso en caché.<br>
              <b>2PC</b> — commit de dos fases: coordina entre sistemas, pero es lento y poco disponible ⇒ Saga.<br>
              <b>WAF</b> — firewall de aplicación: bloquea el OWASP Top 10.</p>
            </div>
          </div>
          <div class="callout key">
            <div class="callout-title">FÓRMULAS</div>
            <p class="mini"><b>SLI</b> = peticiones buenas / peticiones totales × 100 &nbsp;·&nbsp; <b>Error budget</b> = 100% − SLO<br>
            <b>Disponibilidad en SERIE</b> (dependencias encadenadas) = a₁ × a₂ × … × aₙ → <b>cada dependencia RESTA</b> (0,999 × 0,999 ≈ 0,998; 0,99³ ≈ 97%)<br>
            <b>Disponibilidad en PARALELO</b> (redundancia) = 1 − (1 − a)ⁿ → <b>cada réplica SUMA</b> (dos nodos de 0,99 → 1 − 0,01² = 99,99%)<br>
            <b>Cache hit ratio</b> = HITs / (HITs + MISSes) × 100 &nbsp;·&nbsp; <b>Muestras/día</b> = series × (86.400 ÷ intervalo)<br>
            <b>Integraciones punto a punto</b> = n·(n−1)/2 → 6 sistemas = <b>15</b> integraciones (SOA las baja a 6)</p>
          </div>
          <div class="callout key">
            <div class="callout-title">NÚMEROS PARA RECORDAR</div>
            <p class="mini"><b>99% </b> = 3,65 días/año · <b>99,9%</b> = 8,76 h/año = <b>43,8 min/mes</b> · <b>99,95%</b> = 4,38 h/año · <b>99,99%</b> = 52,6 min/año · <b>99,999%</b> = 5,26 min/año.<br>
            <b>Tiers:</b> I 99,671% (28,8 h) · II 99,741% (22 h) · <b>III mantenible concurrentemente 99,982%</b> (1,6 h) · <b>IV tolerante a fallas 99,995%</b> (26,3 min).<br>
            <b>Canary típico:</b> 5% del tráfico a la v2 → 25 → 50 → 100. <b>Recreate</b> es el <b>único con downtime</b>; <b>Blue/Green</b> es el <b>único con costo 2×</b>.<br>
            <b>Amazon Prime Video (2023):</b> migró de serverless/microservicios <b>a un monolito</b> y bajó <b>90%</b> el costo de infraestructura. <b>PedidosYa Plus:</b> 16 servicios en el MVP → <b>12</b> hoy.<br>
            <b>Retención de métricas:</b> 15 s los primeros 15 días · 5 min hasta 90 días · 1 h hasta 2 años.<br>
            <b>Modelo relacional:</b> Codd, IBM, <b>1970</b>. <b>MVC:</b> Reenskaug, Smalltalk-80, <b>1979</b>. <b>Falacias distribuidas:</b> Deutsch, Sun, <b>1994-97</b>. <b>Ley de Conway:</b> <b>1968</b>.</p>
          </div>
        </section>
      `;

      el.querySelector("#p2rpPrint").addEventListener("click", function () { window.print(); });
      APP.rerenderMermaid(el);
    },
  });
})();
