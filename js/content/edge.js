/* ============================================================
   Integración — Edge Computing y Disponibilidad
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "edge",
    title: "Edge Computing y Disponibilidad",
    tag: "🔗",
    group: "Integración y comunicación",
    resumen: "Procesar cerca del dato, alta disponibilidad",
    keywords: ["edge computing", "disponibilidad", "sla", "spof", "failover", "circuit breaker", "alta disponibilidad", "degradacion", "redundancia"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Edge Computing y Disponibilidad</h1>
          <p class="lead">Procesar los datos cerca de donde se generan, y mantener el sistema arriba ante fallas.</p>
        </div>

        <h2>Edge Computing</h2>
        <p>Procesar datos <b>cerca de donde se generan</b>, en vez de mandarlos todos a un servidor central.</p>
        <div class="analogia">
          <div class="emo">📹</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>En vez de mandar todos los videos de las cámaras de seguridad a la nube para que analice si hay movimiento,
            cada cámara <b>detecta el movimiento localmente</b> y sólo manda el video cuando hay algo. Ahorrás ancho de
            banda y respondés más rápido.</p>
          </div>
        </div>
        <p><b>Cuándo conviene:</b></p>
        <ul>
          <li><b>Latencia crítica:</b> no podés esperar el ida y vuelta a la nube.</li>
          <li><b>Mucho volumen</b> de datos que no vale la pena transmitir entero.</li>
          <li>Necesitás que <b>funcione aunque se corte la conexión</b>.</li>
          <li><b>Privacidad:</b> los datos no salen del dispositivo.</li>
        </ul>
        <p><b>Ejemplos:</b> cámaras inteligentes, autos autónomos, IoT industrial, y el <b>CDN</b> (que es una forma de
        edge para contenido estático).</p>

        <h2>Disponibilidad (en profundidad)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Alta disponibilidad (HA)</b></td><td>El sistema sigue funcionando ante fallas. Se logra con <b>redundancia</b>.</td></tr>
            <tr><td><b>SLA</b> (Service Level Agreement)</td><td>Compromiso formal de disponibilidad. 99.9% = ~8.7 h caído al año; 99.99% = ~52 min.</td></tr>
            <tr><td><b>SPOF</b> (Single Point of Failure)</td><td>Componente cuyo fallo tira todo el sistema. Se elimina <b>duplicando</b>.</td></tr>
            <tr><td><b>Failover</b></td><td>Cuando falla un componente, otro toma su lugar <b>automáticamente</b>.</td></tr>
            <tr><td><b>Circuit Breaker</b></td><td>Patrón que <b>corta</b> las llamadas a un servicio que está fallando, para no arrastrar la caída. Después reintenta gradualmente.</td></tr>
            <tr><td><b>Degradación elegante</b></td><td>Si un servicio secundario falla, el sistema sigue funcionando con funcionalidad reducida en vez de caerse entero.</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">🔑 Circuit Breaker (el que más se usa en los finales)</div>
          <p>Cuando integrás un servicio externo que puede fallar o demorar (la IA, el motor médico), un circuit breaker
          detecta que está caído, <b>deja de llamarlo</b> por un tiempo (falla rápido en vez de esperar el timeout) y así
          <b>evita la falla en cascada</b>. Combinado con reintentos con backoff, es la respuesta completa a
          “¿qué pasa si el externo se cae?”.</p>
        </div>

        ${APP.uml(`graph LR
    S["Tu servicio"] --> CB{"Circuit<br/>Breaker"}
    CB -->|"cerrado: pasa"| EXT["Servicio externo"]
    CB -.->|"abierto: falla rápido<br/>(no llama)"| FALLBACK["Respuesta alternativa /<br/>degradación"]
    style CB fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Circuit Breaker")}

        <div class="callout tip">
          <p><b>Relación con la tríada CIA:</b> todo esto ataca la <b>Disponibilidad</b>. Cuando un enunciado menciona
          SLA, “no puede caerse”, o pregunta cómo eliminar el punto único de falla, la respuesta vive acá:
          redundancia, failover, circuit breaker y degradación elegante.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="edgeQuiz"></div>
      `;

      APP.quiz(el.querySelector("#edgeQuiz"), [
        { n: 1, topic: "Disponibilidad", type: "mc", q: "Integrás un servicio externo que a veces se cae y arrastra a tu sistema (todas las requests quedan colgadas esperando el timeout). ¿Qué usás?", options: [
          { t: "Circuit Breaker: cuando detecta que está caído, deja de llamarlo y falla rápido", ok: true },
          { t: "Aumentar el timeout", ok: false },
          { t: "Reintentar infinitamente", ok: false },
        ], explain: "El circuit breaker evita la falla en cascada: en vez de esperar el timeout en cada request, corta las llamadas y responde rápido (o con degradación)." },
        { n: 2, topic: "Disponibilidad", type: "mc", q: "Un SLA de 99.99% permite aproximadamente cuánto tiempo caído al año?", options: [
          { t: "~52 minutos", ok: true },
          { t: "~8.7 horas", ok: false },
          { t: "Cero", ok: false },
        ], explain: "99.9% ≈ 8.7 h/año; 99.99% ≈ 52 min/año. Cada “nueve” extra reduce el tiempo de caída un orden de magnitud (y sube el costo)." },
        { n: 3, topic: "Edge", type: "mc", q: "Cámaras que analizan movimiento localmente y sólo mandan el video cuando detectan algo. ¿Qué concepto es?", options: [
          { t: "Edge computing: procesar cerca de donde se generan los datos", ok: true },
          { t: "Cloud computing centralizado", ok: false },
          { t: "Circuit breaker", ok: false },
        ], explain: "Se procesa en el borde (la cámara) en vez de mandar todo a la nube: ahorra ancho de banda y baja latencia." },
        { n: 4, topic: "Disponibilidad", type: "mc", q: "Tu base de datos es el único nodo: si se cae, cae todo. ¿Cómo se llama y cómo se elimina?", options: [
          { t: "Single Point of Failure (SPOF); se elimina con redundancia (réplicas + failover)", ok: true },
          { t: "Circuit breaker; se elimina con reintentos", ok: false },
          { t: "Edge; se elimina con CDN", ok: false },
        ], explain: "Un SPOF se elimina duplicando el componente y agregando failover automático hacia la réplica." },
      ]);
    },
  });
})();
