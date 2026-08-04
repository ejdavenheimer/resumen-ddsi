/* ============================================================
   Integración — Sincronismo vs Asincronismo
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "sincronismo",
    title: "Sincronismo vs Asincronismo",
    tag: "⏱️",
    group: "Integración y comunicación",
    resumen: "Cuándo bloquear y cuándo encolar",
    keywords: ["sincronismo", "asincronismo", "async", "sync", "cola", "bloqueante", "timeout", "polling", "webhook", "cron", "202"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Sincronismo vs Asincronismo</h1>
          <p class="lead">Los dos modelos de comunicación entre componentes, y cómo darse cuenta de cuál pide el enunciado.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔌 Antes: interfaces entrantes y salientes</div>
          <p>Todo sistema se comunica con otros a través de <b>interfaces</b>. Según la dirección:</p>
          <ul>
            <li><b>Interfaz entrante</b> (inbound): algo <b>nos llama a nosotros</b>. Ej.: el endpoint REST que expone HIDRA,
            o el <b>webhook</b> que la pasarela de pago invoca para avisarnos.</li>
            <li><b>Interfaz saliente</b> (outbound): <b>nosotros llamamos a otro</b>. Ej.: HIDRA le pega a la API del ente
            regulador o a la pasarela de pago. Estas se resuelven con un <a class="inline" data-go="adapter">Adapter</a>.</li>
          </ul>
          <p>Cada interfaz (entrante o saliente) puede ser <b>sincrónica o asincrónica</b> — que es de lo que trata esta página.</p>
        </div>

        <div class="analogia">
          <div class="emo">📞</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p><b>Sincrónico es llamar por teléfono:</b> marcás, esperás que atiendan, hablás. Mientras estás en la
            llamada no podés hacer otra cosa, y si el otro no atiende, te quedás colgado.</p>
            <p><b>Asincrónico es mandar un mail:</b> lo mandás y seguís con tu vida. El otro lo lee cuando puede y te
            responde cuando puede. No necesitan estar disponibles al mismo tiempo.</p>
          </div>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Por qué este tema define el punto de arquitectura</div>
          <p>Casi todos los finales recientes tienen un punto que dice, con distintas palabras: “<i>este servicio externo
          puede demorar varios minutos</i>” o “<i>se esperan picos de tráfico</i>”. Ese punto vale entre 12 y 15 puntos
          y se responde siempre con lo mismo: <b>sacar el proceso lento del camino sincrónico</b>.</p>
        </div>

        <h2>Sincrónico</h2>
        <div class="grid-2">
          <div class="card">
            <h4 style="margin-top:0;color:var(--ok)">✅ A favor</h4>
            <ul>
              <li>Simple de escribir, leer y debuggear.</li>
              <li>Resultado inmediato: el usuario ve la respuesta al toque.</li>
              <li>Manejo de errores directo: si falla, te enterás ahí.</li>
              <li>Consistencia fuerte: podés usar transacciones.</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="margin-top:0;color:var(--bad)">❌ En contra</h4>
            <ul>
              <li><b>Acoplamiento temporal:</b> los dos tienen que estar vivos al mismo tiempo.</li>
              <li>Si el servidor está lento, el cliente se cuelga (y consume un hilo y una conexión).</li>
              <li>Un pico de tráfico se transmite tal cual al servicio de atrás.</li>
              <li>Fallas en cascada: si el servicio C se cae, se caen B y A.</li>
            </ul>
          </div>
        </div>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant C as Cliente
    participant S as Servidor
    Note over C,S: SINCRÓNICO
    C->>S: POST /contrataciones
    Note right of S: procesa…
    Note over C: 🔒 bloqueado esperando
    S-->>C: 201 Created + resultado`, "Sincrónico: el cliente espera")}

        <h2>Asincrónico</h2>
        <div class="grid-2">
          <div class="card">
            <h4 style="margin-top:0;color:var(--ok)">✅ A favor</h4>
            <ul>
              <li><b>Desacoplamiento temporal:</b> el consumidor puede estar caído y el mensaje espera.</li>
              <li>La cola <b>amortigua los picos</b>: aceptás rápido y procesás al ritmo posible.</li>
              <li>Tolerancia a fallos: reintentos automáticos, <i>dead letter queue</i>.</li>
              <li>Escalás sumando consumidores.</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="margin-top:0;color:var(--bad)">❌ En contra</h4>
            <ul>
              <li>Más complejo: hay que resolver cómo vuelve el resultado.</li>
              <li><b>Consistencia eventual:</b> el dato tarda en reflejarse.</li>
              <li>Debugging más difícil (hace falta tracing distribuido).</li>
              <li>El consumidor debe ser <b>idempotente</b>: los mensajes pueden reentregarse.</li>
              <li>Infraestructura extra que hay que operar y monitorear.</li>
            </ul>
          </div>
        </div>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant C as Cliente
    participant S as Servicio
    participant Q as Cola
    participant W as Worker
    Note over C,W: ASINCRÓNICO
    C->>S: POST /contrataciones
    S->>Q: publica ValidacionSolicitada
    S-->>C: 202 Accepted + id de seguimiento
    Note over C: ✅ sigue trabajando
    Q-->>W: entrega el mensaje
    Note right of W: procesa cuando puede<br/>(puede tardar minutos)
    W->>Q: publica ValidacionResuelta
    Q-->>S: entrega el resultado`, "Asincrónico: la cola desacopla")}

        <h2>Cómo vuelve el resultado</h2>
        <p>La pregunta que sigue siempre a “lo hago asincrónico” es: <b>¿y cómo se entera el usuario?</b>
        Hay cuatro respuestas válidas y conviene nombrar la que elegís <b>con su trade-off</b>.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Mecanismo</th><th>Cómo funciona</th><th>Cuándo conviene</th></tr></thead>
          <tbody>
            <tr><td><b>Polling</b></td><td>El cliente consulta cada N segundos <code>GET /contrataciones/{id}</code> hasta que el estado cambia</td><td>Lo más simple. Sirve si la espera es de segundos y hay pocos clientes.</td></tr>
            <tr><td><b>Webhook / callback</b></td><td>El servidor le pega a una URL que el cliente registró cuando termina</td><td>Integraciones entre sistemas. El cliente tiene que ser accesible.</td></tr>
            <tr><td><b>WebSocket / SSE</b></td><td>Canal abierto: el servidor empuja el resultado al navegador</td><td>Cuando querés feedback en vivo en la UI.</td></tr>
            <tr><td><b>Notificación</b></td><td>Mail o push cuando termina</td><td>Procesos largos donde el usuario no se queda esperando.</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <div class="callout-title">✅ Impacto en la usabilidad (esto lo preguntan textualmente)</div>
          <p>ProtegePro y La Scalo preguntan: <i>“¿Cómo impacta en la usabilidad?”</i>. La respuesta que puntúa:</p>
          <p>“El usuario <b>no queda bloqueado</b>: recibe una confirmación inmediata (<code>202 Accepted</code>) con un
          identificador de seguimiento y un estado <b>‘en validación’</b> visible en la interfaz. La UI muestra el
          progreso y le avisa cuando el resultado está listo. El costo es que la confirmación definitiva no es
          instantánea, por lo que hay que <b>comunicar claramente el estado intermedio</b> para que no parezca que el
          sistema no hizo nada. Sin esto, el usuario esperaría más de un minuto frente a una pantalla congelada, con
          riesgo de timeout del navegador y de que reintente la operación duplicándola.”</p>
        </div>

        <h2>Cómo detectarlo en el enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase del enunciado</th><th>Respuesta</th><th>Por qué</th></tr></thead>
          <tbody>
            <tr><td>“puede tardar más de un minuto en responder”</td><td><b>Asincrónico</b></td><td>Ningún request HTTP debería durar eso. Timeout garantizado.</td></tr>
            <tr><td>“se esperan picos de tráfico”</td><td><b>Asincrónico</b></td><td>La cola amortigua: aceptás todo y procesás al ritmo posible.</td></tr>
            <tr><td>“el motor puede demorar varios minutos”</td><td><b>Asincrónico</b></td><td>TurnoÁgil, textual.</td></tr>
            <tr><td>“el usuario necesita ver el resultado al instante”</td><td><b>Sincrónico</b></td><td>Hay un requerimiento explícito de inmediatez.</td></tr>
            <tr><td>“consultar disponibilidad” / “obtener los datos por código QR”</td><td><b>Sincrónico</b></td><td>Es una lectura rápida que alimenta la pantalla actual.</td></tr>
            <tr><td>“periódicamente / quincenalmente”</td><td><b>Cron task</b></td><td>Tarea programada, no disparada por el usuario.</td></tr>
            <tr><td>“notificar a varios servicios cuando ocurre X”</td><td><b>Async pub/sub</b></td><td>Ver <a class="inline" data-go="broker">Broker</a>.</td></tr>
            <tr><td>“anular automáticamente al vencer”</td><td><b>Cron task</b></td><td>El vencimiento de formularios de GTV.</td></tr>
          </tbody>
        </table></div>

        <h2>Cron tasks (tareas programadas)</h2>
        <p>El tercer modo, además de sync y async: el proceso <b>no lo dispara nadie</b>, corre solo cada tanto.</p>
        ${APP.code(`@Component
class VencimientoDeFormularios {

    // Todos los días a las 3 AM
    @Scheduled(cron = "0 0 3 * * *")
    public void anularVencidos() {
        formularioRepo.vencidosAlDia(LocalDate.now())
            .forEach(f -> {
                f.anularPorVencimiento();                 // el dominio decide
                eventos.publicar(new FormularioAnulado(f)); // los observers notifican
            });
    }
}`, { label: "Cron task en Spring (@Scheduled)" })}
        <div class="callout warn">
          <div class="callout-title">⚠️ El detalle que casi nadie menciona y suma</div>
          <p>Si el servicio corre en <b>varias instancias</b>, el cron se dispara en todas y el proceso se ejecuta N veces.
          Hay que garantizar ejecución única: un <b>lock distribuido</b> (ShedLock, Redis), un scheduler externo que
          invoque un endpoint, o marcar los registros como “en proceso” de forma atómica.</p>
          <p>El otro detalle: si el proceso es pesado, el cron no debería hacer el trabajo sino <b>publicar los mensajes
          en una cola</b> para que los workers los procesen en paralelo.</p>
        </div>

        <h2>🎮 ¿Sincrónico o asincrónico?</h2>
        <div id="syncQuiz"></div>
      `;

      APP.quiz(el.querySelector("#syncQuiz"), [
        { n: 1, topic: "Detectar", type: "mc", q: "“El modelo de IA puede tardar más de un minuto en validar la imagen y contrastarla contra la descripción.” (ProtegePro)", options: [
          { t: "Asincrónico: publicar en una cola, responder 202 y devolver el resultado por notificación o polling", ok: true },
          { t: "Sincrónico con un timeout de 2 minutos", ok: false },
          { t: "Sincrónico, pero mostrando un spinner", ok: false },
        ], explain: "Un request HTTP de más de un minuto es inaceptable: se comen hilos del servidor, los balanceadores y proxies lo cortan, y el usuario cree que se colgó. La cola además amortigua los picos de eventos masivos que menciona el mismo enunciado." },
        { n: 2, topic: "Detectar", type: "mc", q: "“Debe exponer un endpoint para consultar disponibilidad por profesional y especialidad.” (TurnoÁgil)", options: [
          { t: "Sincrónico: es una lectura rápida que alimenta la pantalla que el usuario está mirando", ok: true },
          { t: "Asincrónico con cola", ok: false },
          { t: "Cron task cada 5 minutos", ok: false },
        ], explain: "No todo va a una cola. Meter asincronismo en una consulta rápida sólo agrega complejidad y empeora la experiencia. Acá lo que puede ayudar es <b>caché</b>, no una cola." },
        { n: 3, topic: "Detectar", type: "mc", q: "“Cada formulario tiene una fecha de vencimiento. El Sistema utilizará esta fecha para anular ese formulario de forma automática.” (GTV)", options: [
          { t: "Cron task diaria que busca los vencidos y los anula, publicando un evento por cada uno", ok: true },
          { t: "Sincrónico: validar el vencimiento cada vez que alguien consulta el formulario", ok: false },
          { t: "Asincrónico: encolar un mensaje al crear el formulario", ok: false },
        ], explain: "El enunciado dice “de forma automática”: no hay usuario que dispare la acción. La segunda opción no cumple porque no manda el mail de aviso si nadie consulta; la tercera (mensaje con delay de hasta 45 días) es frágil y difícil de reprogramar cuando el formulario se renueva." },
        { n: 4, topic: "Trade-offs", type: "multi", q: "¿Qué costos trae hacer una integración asincrónica? (marcá todos)", options: [
          { t: "Consistencia eventual: el resultado no está disponible inmediatamente", ok: true },
          { t: "El consumidor debe ser idempotente por las reentregas", ok: true },
          { t: "Hay que resolver cómo vuelve el resultado al cliente", ok: true },
          { t: "Se pierde la capacidad de escalar horizontalmente", ok: false },
        ], explain: "Al contrario: el asincronismo <i>facilita</i> el escalado, porque sumás consumidores sin tocar al productor. Los otros tres son los costos reales que conviene nombrar al justificar." },
        { n: 5, topic: "Mecanismos", type: "mc", q: "Elegiste asincrónico. ¿Qué le devolvés al cliente HTTP?", options: [
          { t: "<code>202 Accepted</code> con un identificador de seguimiento y la URL donde consultar el estado", ok: true },
          { t: "<code>200 OK</code> con el resultado en null", ok: false },
          { t: "<code>204 No Content</code>", ok: false },
        ], explain: "El 202 significa exactamente “acepté tu pedido, todavía no lo terminé”. Devolver 200 con datos vacíos miente sobre lo que pasó y deja al cliente sin forma de hacer seguimiento." },
        { n: 6, topic: "Cron", type: "mc", q: "Tu cron task corre en 3 instancias del servicio. ¿Qué problema tenés?", options: [
          { t: "Se ejecuta 3 veces: hace falta un lock distribuido o un scheduler externo que garantice ejecución única", ok: true },
          { t: "Ninguno: Spring lo detecta automáticamente", ok: false },
          { t: "Se ejecuta 1 vez porque comparten la base", ok: false },
        ], explain: "<code>@Scheduled</code> es local a cada JVM: las tres instancias disparan a la misma hora. Es un detalle que casi nadie menciona y que demuestra que pensaste el despliegue real." },
      ]);
    },
  });
})();
