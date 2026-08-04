/* ============================================================
   Parcial HIDRA — Introducción y estrategia
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "hidra-intro",
    title: "El parcial HIDRA · cómo encararlo",
    tag: "📋",
    group: "Parcial HIDRA (práctica)",
    resumen: "Contexto real, formato y estrategia",
    keywords: ["hidra", "parcial", "agua", "caudalimetro", "medidor", "fuga", "facturacion", "ente regulador", "pasarela de pago", "5 de agosto"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial HIDRA · miércoles 5 de agosto, 19 hs</div>
          <h1>El parcial HIDRA: cómo encararlo</h1>
          <p class="lead">El contexto real que dio la cátedra, el formato del examen y una estrategia para las 2:30 hs.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">💧 El contexto que te dieron</div>
          <p><b>HIDRA (Red Hídrica Distribuida Inteligente)</b> es una plataforma de una prestadora de agua y saneamiento
          regional, en articulación con el <b>ente regulador</b> del servicio sanitario, para digitalizar la medición del
          consumo de agua potable en domicilios y comercios mediante <b>caudalímetros inteligentes</b> instalados en campo.
          Su propósito:</p>
          <ul>
            <li><b>Automatizar la facturación</b> (con lo cual: pasarelas de pago 👉 investigar).</li>
            <li><b>Detectar tempranamente pérdidas de agua</b>: fugas domiciliarias, roturas de cañería, consumos anómalos, conexiones clandestinas.</li>
            <li><b>Gestión remota del suministro</b>: cortar / reponer / limitar a distancia.</li>
            <li>Reducir pérdidas y la dependencia de las <b>lecturas manuales</b>.</li>
          </ul>
        </div>

        <h2>Formato del examen</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Dato</th><th>Detalle</th></tr></thead>
          <tbody>
            <tr><td>Fecha / hora</td><td>Miércoles 5 de agosto, 19 hs · Campus, aulas 102/104/110</td></tr>
            <tr><td>Duración</td><td><b>2 horas 30 minutos</b></td></tr>
            <tr><td>Apuntes</td><td>Permitidos en papel (impresos/escritos). <b>No digitales.</b> 👉 imprimí el <a class="inline" data-go="resumen-imprimible">resumen</a>.</td></tr>
            <tr><td>Secciones (temas)</td><td><b>Modelado de Dominio · Arquitectura I · Arquitectura II · Modelo de Datos</b></td></tr>
            <tr><td>Aprobar</td><td><b>60% en CADA sección</b> (se aprueban y recuperan por separado)</td></tr>
            <tr><td>Promocionar</td><td>80% en cada sección, en primera instancia</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Ojo con el 60% por sección:</b> no alcanza con un promedio alto. Si te va excelente en dominio pero
          entregás 50% en modelo de datos, <b>recuperás datos</b>. Repartí el tiempo para que ninguna sección quede floja.</p>
        </div>

        <h2>Cómo se mapea HIDRA a lo que estudiaste</h2>
        <p>El dominio es nuevo, pero los <b>disparadores son los de siempre</b>. Tenelos en la cabeza:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>En HIDRA aparece…</th><th>Y vos pensás…</th></tr></thead>
          <tbody>
            <tr><td>Caudalímetros que <b>envían lecturas periódicas</b>, alto volumen, picos</td><td><b>Asincronismo + Broker</b> (cola/MQTT); ingesta desacoplada; <a class="inline" data-go="edge">Edge computing</a></td></tr>
            <tr><td>Distintos <b>esquemas tarifarios</b> (residencial, comercial, por tramos) y "pueden agregarse más"</td><td><b>Strategy</b> (Estrategia) para el cálculo</td></tr>
            <tr><td>Varias <b>reglas de detección</b> de fugas/anomalías que se combinan y "pueden sumarse"</td><td><b>Strategy en colección</b> (motor de reglas)</td></tr>
            <tr><td><b>Ciclo de vida</b>: del suministro (activo/cortado/limitado), de una alerta u orden de trabajo</td><td><b>State</b> (Estado)</td></tr>
            <tr><td><b>Cortar/reponer</b> el suministro en forma remota, encolable y <b>auditable</b></td><td><b>Command</b> (Comando)</td></tr>
            <tr><td>Integrar con la <b>pasarela de pago</b> y con el <b>ente regulador</b> (no son nuestros)</td><td><b>Adapter</b> (Adaptador) + confirmación asincrónica (webhook)</td></tr>
            <tr><td>Avisar a <b>varios interesados</b> cuando se detecta una fuga (usuario, cuadrilla, ente)</td><td><a class="inline" data-go="observer">Observer</a> / <a class="inline" data-go="pubsub">Pub-Sub</a></td></tr>
            <tr><td><b>Reportes periódicos</b> al ente regulador</td><td><a class="inline" data-go="cron">Cron task</a> + Adapter</td></tr>
            <tr><td><b>Lecturas</b> (muchísimas, por tiempo)</td><td>Persistencia <b>no relacional</b> de series temporales (time-series)</td></tr>
            <tr><td>Portal del <b>ciudadano</b> + app del <b>inspector</b></td><td>API Gateway + <b>BFF</b> por canal</td></tr>
            <tr><td>Datos personales, <b>roles</b> (ciudadano, operador, inspector, ente)</td><td><a class="inline" data-go="seguridad">Seguridad</a>: RBAC/ABAC, IDM, cifrado</td></tr>
          </tbody>
        </table></div>

        <h2>Pasarelas de pago (te lo sugirieron investigar)</h2>
        <div class="callout key">
          <p>Una <b>pasarela de pago</b> (Mercado Pago, Stripe, etc.) es un servicio externo que procesa el cobro. Puntos clave:</p>
          <ul>
            <li>Se integra con un <b>Adapter</b>: definís tu interfaz <code>PasarelaDePagos</code> y un adapter por proveedor. Tu dominio no depende de la marca.</li>
            <li>El flujo típico es <b>asincrónico</b>: creás una <i>orden de pago</i>, redirigís/notificás al usuario, y la pasarela te confirma <b>por webhook</b> (una llamada que ella te hace cuando el pago se acredita). No te quedás esperando.</li>
            <li>El <b>dinero real</b> (acreditación bancaria) queda <b>fuera del alcance</b>: vos registrás el estado del pago (pendiente / aprobado / rechazado) con el identificador que da la pasarela.</li>
            <li>Idempotencia: el webhook puede llegar repetido → tu handler debe ser <b>idempotente</b> (no acreditar dos veces).</li>
          </ul>
        </div>

        <h2>Estrategia para las 2:30 hs</h2>
        <ol class="steps">
          <li><span class="step-title">Leé todo el enunciado primero (10 min)</span> Subrayá los disparadores con la tabla de arriba. Anotá al margen qué patrón dispara cada frase.</li>
          <li><span class="step-title">Repartí el tiempo por sección</span> Son 4 secciones y cada una necesita 60%. Aprox. 30-35 min cada una + 15 de repaso.</li>
          <li><span class="step-title">Dominio primero</span> Es la base de todo lo demás. Dibujá el diagrama de clases con los patrones y <b>justificá cada uno por escrito</b> (nombre del patrón + frase del enunciado + principio + cualidad).</li>
          <li><span class="step-title">Arquitectura I y II</span> Diagrama de despliegue (nodos-cubo) y componentes (bola-socket). Etiquetá protocolos. Resolvé demoras/picos con cola.</li>
          <li><span class="step-title">Modelo de datos</span> DER con PK/FK/cardinalidad/modalidad. Decidí qué va en no-relacional (las lecturas) y justificalo.</li>
          <li><span class="step-title">Repaso final con el checklist (15 min)</span> Item por item con la <a class="inline" data-go="resumen-imprimible">hoja de chequeo</a>: ¿justifiqué todo? ¿están todos los servicios? ¿protocolos? ¿nada de sobreingeniería?</li>
        </ol>

        <div class="callout tip">
          <div class="callout-title">✅ Practicá con los 3 modelos</div>
          <p>Armé <b>tres modelos de parcial</b> con este dominio, cada uno con las 4 secciones resueltas y su rúbrica.
          Resolvelos en papel (con el <a class="inline" data-go="p-simulacro">simulacro</a>, que ahora los incluye) y
          después compará. No son adivinación del examen real, pero cubren los ángulos más probables de HIDRA.</p>
          <div class="idx-grid" style="margin-top:.8rem">
            <div class="idx-card" data-go="hidra-1"><b>📋 Modelo 1 — Medición y Facturación</b><small>Strategy tarifario · pasarela de pago · ingesta</small></div>
            <div class="idx-card" data-go="hidra-2"><b>📋 Modelo 2 — Fugas y Anomalías</b><small>Motor de reglas · State de alertas · Command remoto</small></div>
            <div class="idx-card" data-go="hidra-3"><b>📋 Modelo 3 — Suministro remoto y Ente</b><small>Command · reportería · BFF · seguridad</small></div>
          </div>
        </div>
      `;
    },
  });
})();
