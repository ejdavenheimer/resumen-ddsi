/* ============================================================
   Integración — Patrones de comunicación y Broker
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "broker",
    title: "Comunicación y Broker",
    tag: "📨",
    group: "Integración y comunicación",
    resumen: "Pub/Sub, colas, RabbitMQ, Kafka",
    keywords: ["broker", "rabbitmq", "kafka", "pub sub", "publish subscribe", "cola", "mensajeria", "fanout", "topic", "dlq", "amqp"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Patrones de comunicación y Broker</h1>
          <p class="lead">Cómo se hablan los componentes distribuidos cuando no alcanza con una llamada HTTP.</p>
        </div>

        <div class="analogia">
          <div class="emo">📮</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un <b>broker</b> es el correo postal. Vos no vas a la casa del destinatario: dejás la carta en el correo
            y te vas. El correo se encarga de que llegue, la guarda si el destinatario no está, reintenta al día
            siguiente y, si nunca llega, te la devuelve.</p>
            <p>Ni siquiera necesitás saber cuánta gente va a leerla: si mandás una carta a una lista de distribución,
            el correo la copia para todos. <b>Vos y los destinatarios nunca se conocen.</b></p>
          </div>
        </div>

        <h2>Los patrones de comunicación</h2>

        <h3>1 · Request / Response</h3>
        <p>El clásico. El cliente pide y espera la respuesta. Sincrónico, típicamente HTTP/REST o gRPC.</p>
        <p><b>Usalo cuando:</b> necesitás la respuesta ya, la operación es rápida y el flujo es simple.</p>

        <h3>2 · Point-to-point (cola de trabajo)</h3>
        <p>Un mensaje va a <b>un solo</b> consumidor, aunque haya varios escuchando. Sirve para <b>repartir trabajo</b>:
        si hay 5 workers, cada uno toma mensajes distintos y el trabajo se procesa 5 veces más rápido.</p>
        ${APP.uml(`graph LR
    P["Productor"] -->|publica| Q["📥 Cola<br/>validacion.solicitada"]
    Q -->|entrega a UNO| W1["Worker 1"]
    Q -->|entrega a UNO| W2["Worker 2"]
    Q -->|entrega a UNO| W3["Worker 3"]
    style Q fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Point-to-point: reparto de trabajo")}

        <h3>3 · Publish / Subscribe</h3>
        <p>Un mensaje llega a <b>todos</b> los suscriptores; cada uno recibe su copia. Sirve para <b>difundir eventos</b>:
        “pasó esto, el que quiera que reaccione”.</p>
        ${APP.uml(`graph LR
    P["Servicio de Lesiones"] -->|publica LesionActualizada| B["📨 Broker<br/>(topic / exchange)"]
    B -->|copia| C1["Servicio de Jugadores"]
    B -->|copia| C2["Servicio de Notificaciones"]
    B -->|copia| C3["Servicio de Estadísticas"]
    style B fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Pub/Sub: difusión de eventos")}

        <div class="callout key">
          <div class="callout-title">🔑 La diferencia que hay que tener clara</div>
          <p><b>Point-to-point:</b> el mensaje lo consume <b>uno solo</b> → reparto de carga. “Procesá esta imagen.”<br>
          <b>Pub/Sub:</b> <b>todos</b> reciben una copia → difusión. “La lesión cambió de estado.”</p>
          <p>Regla práctica: si el mensaje es un <b>comando</b> (“hacé esto”), point-to-point. Si es un <b>evento</b>
          (“pasó esto”), pub/sub.</p>
        </div>

        <h3>4 · Fanout / Broadcast</h3>
        <p>Variante de pub/sub sin filtro: el mensaje va a todas las colas conectadas al exchange, sin importar
        la clave de ruteo.</p>

        <h2>El Message Broker</h2>
        <p>El intermediario que hace todo esto posible: recibe mensajes de los emisores y los <b>enruta</b> a los
        destinatarios. Los dos que menciona la cátedra:</p>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>🐰 RabbitMQ</h4>
            <p>Broker de mensajes tradicional (protocolo AMQP). Ruteo flexible con exchanges y binding keys.
            El mensaje se <b>borra</b> cuando el consumidor lo confirma (ACK).</p>
            <p><b>Ideal para:</b> colas de trabajo, tareas asincrónicas, ruteo complejo. Es el que se usa en la
            práctica de la cursada, corriendo en Docker.</p>
          </div>
          <div class="vs-b">
            <h4>🌊 Kafka</h4>
            <p>Log distribuido y particionado. Los mensajes <b>se conservan</b> según una política de retención y cada
            consumidor lleva su propio <i>offset</i>: puede releer desde el principio.</p>
            <p><b>Ideal para:</b> streams de eventos, alto volumen, event sourcing, y cuando varios consumidores
            necesitan releer el histórico.</p>
          </div>
        </div>

        <h2>Qué te da un broker (y qué no te da HTTP)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Capacidad</th><th>Qué significa</th><th>Por qué importa en el parcial</th></tr></thead>
          <tbody>
            <tr><td><b>Desacoplamiento</b></td><td>El productor no sabe quién consume ni cuántos son</td><td>Sumar un consumidor no toca al productor (OCP a nivel arquitectura)</td></tr>
            <tr><td><b>Desacoplamiento temporal</b></td><td>El consumidor puede estar caído; el mensaje espera</td><td>Elimina las fallas en cascada</td></tr>
            <tr><td><b>Buffer ante picos</b></td><td>La cola absorbe la ráfaga y los workers procesan a su ritmo</td><td>“Se esperan picos de tráfico” → esta es la respuesta</td></tr>
            <tr><td><b>Garantías de entrega</b></td><td>El mensaje se persiste hasta que alguien lo confirma</td><td>No se pierde trabajo si un worker muere a mitad</td></tr>
            <tr><td><b>Reintentos + DLQ</b></td><td>Reintenta con backoff; si sigue fallando lo manda a una <i>dead letter queue</i></td><td>Los mensajes envenenados no bloquean la cola</td></tr>
            <tr><td><b>Escalado horizontal</b></td><td>Agregás consumidores y el throughput sube</td><td>Escalás sólo la parte lenta, no todo el sistema</td></tr>
          </tbody>
        </table></div>

        <h2>Ejemplo completo: ProtegePro</h2>
        ${APP.uml(`graph TB
    U["👤 Usuario"] -->|POST /contrataciones| S4["Servicio IV<br/>Contrataciones"]
    S4 -->|202 Accepted + id| U
    S4 -->|"HTTP sync<br/>POST /riesgo/cotizaciones"| S2["Servicio II<br/>Motor de Riesgo"]
    S4 -->|"publica<br/>validacion.solicitada"| BR["📨 RabbitMQ"]
    BR -->|consume| S3["Servicio III<br/>Validación Inteligente"]
    S3 -->|"HTTPS (lento: > 1 min)"| IA["🤖 API de IA<br/>externa"]
    S3 -->|"publica<br/>validacion.resuelta"| BR
    BR -->|consume| S4
    BR -->|consume| NOT["Servicio de<br/>Notificaciones"]
    NOT -->|push / mail| U
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style IA fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Sync donde se puede, async donde hace falta")}
        <div class="callout tip">
          <div class="callout-title">✅ Cómo se justifica esta decisión</div>
          <p>“La cotización con el Motor de Riesgo se resuelve de forma <b>sincrónica</b> (<code>POST /riesgo/cotizaciones</code>)
          porque es un cálculo rápido cuyo resultado el usuario necesita ver para aceptar o rechazar la contratación.”</p>
          <p>“La validación con IA, en cambio, es <b>asincrónica vía broker</b>, porque el enunciado indica que puede
          demorar más de un minuto y que se esperan picos de tráfico en eventos masivos. La cola desacopla temporalmente
          los servicios, amortigua los picos y permite escalar sólo los consumidores de validación. El resultado vuelve
          publicando <code>validacion.resuelta</code>, al que se suscriben tanto Contrataciones como Notificaciones.”</p>
        </div>

        <h2>Formato de los mensajes</h2>
        ${APP.code(`// Cola: validacion.solicitada    (AMQP, body JSON)
{
  "eventId": "8f3c1e22-7b4a-4c11-9f10-2d5e6a7b8c90",
  "ocurridoEn": "2026-08-03T09:12:44-03:00",
  "contratacionId": "CTR-88421",
  "codigoQr": "QR-9F3A21",
  "descripcionDeclarada": "Dron DJI Mavic 3, sin daños visibles",
  "fotos": ["https://storage/.../f1.jpg", "https://storage/.../f2.jpg"]
}

// Cola: validacion.resuelta
{
  "eventId": "c1b2a3d4-...",
  "ocurridoEn": "2026-08-03T09:14:07-03:00",
  "contratacionId": "CTR-88421",
  "sospechosa": true,
  "confianza": 0.91,
  "hallazgo": "Lente frontal astillado"
}`, { lang: "json", label: "Mensajes de ejemplo" })}
        <div class="callout info">
          <p>Buenas prácticas que conviene mostrar: un <b><code>eventId</code></b> único (para deduplicar),
          <b><code>ocurridoEn</code></b> (el momento del hecho, no el de la entrega), y <b>referencias en vez de blobs</b>
          (las fotos van como URL al object storage, nunca en base64 dentro del mensaje).</p>
        </div>

        <h2>Los tres problemas que hay que saber nombrar</h2>
        <div class="grid-3">
          <div class="card">
            <h4 style="margin-top:0">🔁 Entrega duplicada</h4>
            <p>Los brokers garantizan <b>at-least-once</b>: si el consumidor procesa y muere antes del ACK, el mensaje
            se reentrega.</p>
            <p><b>Solución:</b> consumidores <b>idempotentes</b>. Guardá los <code>eventId</code> procesados o usá
            operaciones naturalmente idempotentes (upsert por clave).</p>
          </div>
          <div class="card">
            <h4 style="margin-top:0">🔀 Orden de los mensajes</h4>
            <p>Con varios consumidores en paralelo, el orden no está garantizado: puede llegar “actualizado” antes que
            “creado”.</p>
            <p><b>Solución:</b> particionar por clave (todos los mensajes de la misma contratación a la misma partición),
            o incluir un número de versión y descartar los viejos.</p>
          </div>
          <div class="card">
            <h4 style="margin-top:0">☠️ Mensaje envenenado</h4>
            <p>Un mensaje que siempre falla puede reintentarse infinitamente y bloquear la cola.</p>
            <p><b>Solución:</b> límite de reintentos con <i>backoff exponencial</i> y <b>dead letter queue</b> para
            análisis manual.</p>
          </div>
        </div>

        <h2>Palabras clave en el enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué implica</th></tr></thead>
          <tbody>
            <tr><td>“picos de tráfico” / “picos masivos”</td><td>Cola que amortigua + escalado de consumidores</td></tr>
            <tr><td>“puede demorar varios minutos”</td><td>Sacarlo del camino sincrónico</td></tr>
            <tr><td>“múltiples suscriptores” / “varios servicios deben enterarse”</td><td>Pub/Sub</td></tr>
            <tr><td>“desacoplar productor y consumidor”</td><td>Broker</td></tr>
            <tr><td>“garantías de entrega” / “no se puede perder”</td><td>Colas persistentes + ACK + DLQ</td></tr>
            <tr><td>“eventos entre servicios”</td><td>Coreografía sobre broker</td></tr>
            <tr><td>“sistema distribuido”</td><td>Pensar en fallas parciales y consistencia eventual</td></tr>
          </tbody>
        </table></div>

        <h2>🎮 Ejercicio</h2>
        <div id="brkQuiz"></div>
      `;

      APP.quiz(el.querySelector("#brkQuiz"), [
        { n: 1, topic: "Patrones", type: "mc", q: "Hay 5 workers escuchando la cola de validación de imágenes. Llega un mensaje. ¿Cuántos lo procesan?", options: [
          { t: "Uno solo: es point-to-point, reparto de trabajo", ok: true },
          { t: "Los cinco: cada uno recibe una copia", ok: false },
          { t: "Depende del tamaño del mensaje", ok: false },
        ], explain: "En una cola de trabajo, el broker entrega cada mensaje a un único consumidor. Si querés que todos reciban copia, necesitás pub/sub (un exchange fanout o un topic con una cola por consumidor)." },
        { n: 2, topic: "Patrones", type: "mc", q: "El Servicio de Lesiones publica <code>LesionActualizada</code> y tres servicios distintos deben reaccionar. ¿Qué usás?", options: [
          { t: "Pub/Sub: cada servicio tiene su cola bindeada al mismo evento y recibe su copia", ok: true },
          { t: "Point-to-point: una sola cola compartida", ok: false },
          { t: "Tres llamadas HTTP desde el Servicio de Lesiones", ok: false },
        ], explain: "Con una sola cola compartida, sólo uno de los tres recibiría cada mensaje. Las tres llamadas HTTP funcionan pero acoplan al productor con los tres consumidores y lo obligan a cambiar cuando aparezca un cuarto." },
        { n: 3, topic: "Idempotencia", type: "mc", q: "Tu consumidor procesa un pago, y por un reinicio el broker le reentrega el mismo mensaje. ¿Qué previene el cobro doble?", options: [
          { t: "Que el consumidor sea idempotente: registrar el <code>eventId</code> procesado y descartar los repetidos", ok: true },
          { t: "Configurar el broker en exactly-once", ok: false },
          { t: "Aumentar el timeout del ACK", ok: false },
        ], explain: "El “exactly-once” de punta a punta es prácticamente imposible en sistemas distribuidos: lo que se hace es <b>at-least-once + consumidor idempotente</b>. Es la respuesta que se espera cuando preguntan por garantías de entrega." },
        { n: 4, topic: "DLQ", type: "mc", q: "Un mensaje mal formado hace fallar al consumidor una y otra vez. ¿Qué configurás?", options: [
          { t: "Límite de reintentos con backoff exponencial y una dead letter queue para análisis manual", ok: true },
          { t: "Reintentos infinitos hasta que alguien lo arregle", ok: false },
          { t: "Descartar silenciosamente los mensajes que fallan", ok: false },
        ], explain: "Los reintentos infinitos bloquean la cola y consumen recursos; descartar en silencio pierde información sin que nadie se entere. La DLQ deja el mensaje disponible para inspeccionarlo y reprocesarlo." },
        { n: 5, topic: "Diseño", type: "mc", q: "Tenés que mandar 5 fotos de 4 MB en un mensaje. ¿Qué hacés?", options: [
          { t: "Subirlas al object storage y mandar sólo las URLs en el mensaje", ok: true },
          { t: "Codificarlas en base64 dentro del JSON del mensaje", ok: false },
          { t: "Partir el mensaje en 5 mensajes de una foto cada uno", ok: false },
        ], explain: "Los brokers están pensados para mensajes chicos (KB). 20 MB en base64 (que además infla un 33%) satura la cola, la memoria del broker y la red. El patrón se llama <i>claim check</i>: el mensaje lleva la referencia, no el contenido." },
        { n: 6, topic: "Observer vs Broker", type: "mc", q: "¿Cuál es la diferencia entre Observer y Pub/Sub con broker?", options: [
          { t: "Observer es in-process con referencias en memoria; Pub/Sub cruza procesos, persiste el mensaje y da reintentos", ok: true },
          { t: "Son exactamente lo mismo con distinto nombre", ok: false },
          { t: "Observer es asincrónico y Pub/Sub sincrónico", ok: false },
        ], explain: "Misma intención (difundir un cambio a N interesados), escalas distintas. Observer no sirve entre servicios desplegados por separado porque no comparten memoria, y si el proceso muere la notificación se pierde." },
      ]);
    },
  });
})();
