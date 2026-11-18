/* ============================================================
   P2 · Monitoreo, Trazabilidad y Observabilidad
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-observabilidad",
    title: "Monitoreo, Trazabilidad y Observabilidad",
    tag: "🔭",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Logs, métricas y trazas; Golden Signals; alertas; SLO y error budget",
    keywords: ["observabilidad", "monitoreo", "trazabilidad", "logs", "metricas", "trazas", "spans", "trace id", "correlation id", "golden signals", "latencia", "trafico", "errores", "saturacion", "red", "use", "percentil", "p95", "p99", "cardinalidad", "alertas", "slo", "error budget", "tsdb", "prometheus", "grafana", "opentelemetry", "jaeger", "elk", "loki", "sampling", "postmortem"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Monitoreo, Trazabilidad y Observabilidad</h1>
          <p class="lead">El temario pide explícitamente las <b>diferencias entre monitoreo, trazabilidad y observabilidad</b>. Esa comparación es la pregunta más probable de este tema.</p>
        </div>

        <h2>El problema</h2>
        <p>“Ya está en producción… ¿y cómo sabemos que vamos bien?” En producción <b>no hay un tester mirando</b>: el
        sistema <b>tiene que contarnos su estado</b>. Muchos usuarios <b>no reclaman: simplemente dejan de usar</b> la
        aplicación. Y ante una falla hay que poder responder: ¿es aislada o afecta a todos? ¿qué parte está involucrada?
        ¿cuánto tiempo estuvo afectado? ¿qué impacto tuvo para el negocio? ¿qué hay que arreglar? <b>Sin datos del sistema
        en ejecución, la solución es “reiniciar y rezar”.</b></p>
        <p>Y cuanto más distribuido, más lugares donde mirar: en un monolito en 3 capas hay <b>un proceso, un log, una
        base</b>; en una arquitectura distribuida <b>un solo “pedir” del usuario atraviesa 5 o 6 piezas</b>, cada una con
        su proceso, su log y su base.</p>

        <h2>¿Qué es observabilidad?</h2>
        <div class="callout key">
          <p><b>Origen (teoría de control, Rudolf E. Kálmán, años ’60):</b> “es una medida de <b>qué tan bien pueden
          inferirse los estados internos de un sistema a partir del conocimiento de sus salidas externas</b>”.
          <b>Observable = las salidas alcanzan para reconstruir el estado interno.</b></p>
          <p><b>En software:</b> “es la capacidad de comprender el estado o la condición de un sistema complejo basándose
          <b>únicamente en sus salidas externas</b>, específicamente su <b>telemetría</b>”. No abrimos el sistema con un
          debugger en producción: <b>lo entendemos por lo que emite</b>. Cuanto más observable es un sistema, <b>más
          rápido y con mayor precisión</b> se pasa de un problema identificado a su <b>causa raíz</b>, sin pruebas ni
          codificación adicionales.</p>
        </div>

        <h2>⭐ Monitoreo vs. Observabilidad (y dónde entra la trazabilidad)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Aspecto</th><th>Monitoreo</th><th>Observabilidad</th></tr></thead>
          <tbody>
            <tr><td><b>Pregunta que responde</b></td><td><b>¿Qué pasa y cuándo?</b></td><td><b>¿Por qué pasa y cómo se origina?</b></td></tr>
            <tr><td>Tipo de problema</td><td>Problemas <b>conocidos</b> (los anticipamos)</td><td>Conocidos <b>y también nuevos, no anticipados</b></td></tr>
            <tr><td>Enfoque</td><td>Seguir <b>métricas definidas de antemano</b> y comparar con <b>umbrales</b></td><td><b>Explorar</b> los datos y hacerles <b>preguntas libres</b></td></tr>
            <tr><td>Datos que usa</td><td>Principalmente <b>métricas</b></td><td><b>Logs, métricas y trazas correlacionados</b></td></tr>
            <tr><td>Resultado</td><td><b>Síntomas y alertas</b> sobre desvíos</td><td><b>Causa raíz</b> y comprensión del sistema</td></tr>
            <tr><td>Ejemplo</td><td>“La latencia de pedidos superó 2 s” → alerta</td><td>“Los pedidos de un restaurante puntual tardan el doble desde ayer: ¿por qué?”</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>La frase para cerrar la respuesta:</b> “<b>el monitoreo busca ALERTAR; la observabilidad busca
          ENTENDER.</b> El monitoreo <b>es una parte</b> (no lo opuesto) de una práctica observable.”</p>
          <p><b>Y la trazabilidad</b> es la capacidad de <b>seguir una operación concreta de punta a punta</b> a través de
          todos los componentes que atravesó (con un <b>trace_id / ID de correlación</b>), respondiendo <b>¿DÓNDE
          pasó y cuánto tardó cada parte?</b>. Es <b>uno de los tres pilares</b> de la observabilidad, no un sinónimo:
          métricas → <i>qué y cuánto</i>; trazas → <i>dónde</i>; logs → <i>qué pasó exactamente y por qué</i>.</p>
          <p class="mini"><b>Analogía de la cátedra:</b> monitoreo = <b>el tablero del auto</b> (luces y relojes que ya
          sabíamos que había que mirar; te avisa que algo pasa, no por qué). Observabilidad = <b>el scanner del
          mecánico</b> (lee sensores internos e historial; permite <b>hacer preguntas nuevas</b>, incluso sobre fallas que
          nadie anticipó). “Un auto sin tablero es peligroso; un auto sin scanner es difícil de reparar. Un sistema
          distribuido <b>necesita ambos</b>.”</p>
        </div>
        <p><b>Los tres niveles de lo que sabemos:</b> <b>1)</b> lo conocido (“¿está arriba el servicio de Pagos?” →
        dashboards y health checks); <b>2)</b> sabemos que puede fallar, no cuándo (“la base se puede saturar en el pico de
        cena” → alertas sobre métricas y umbrales); <b>3)</b> <b>lo que nunca imaginamos</b> (“un restaurante con un menú
        de 600 ítems vuelve lenta la búsqueda para todos”) → <b>sólo la observabilidad</b>, explorando datos ricos en
        contexto. <b>Cuanto más complejo el sistema, más problemas caen en el nivel 3.</b></p>

        <h2>Los tres pilares</h2>
        <div class="grid-3">
          <div class="card">
            <h3>📊 Métricas</h3>
            <p><b>¿Qué está pasando? ¿Cuánto?</b></p>
            <p><i>Analogía:</i> los <b>signos vitales</b> (pulso, temperatura, presión).</p>
            <p class="mini">Números <b>agregados</b> en el tiempo. Volumen y costo <b>bajo y predecible</b>. Ideal para
            <b>alertas y tendencias</b>.</p>
          </div>
          <div class="card">
            <h3>📝 Logs</h3>
            <p><b>¿Por qué pasó? ¿Qué ocurrió exactamente?</b></p>
            <p><i>Analogía:</i> el <b>diario detallado</b>, cada evento con su contexto.</p>
            <p class="mini">Eventos con texto y campos. <b>Muy alto</b> nivel de detalle; <b>volumen alto</b> (son
            verbosos). Ideal para <b>diagnóstico profundo</b>.</p>
          </div>
          <div class="card">
            <h3>🔗 Trazas</h3>
            <p><b>¿Dónde está pasando?</b></p>
            <p><i>Analogía:</i> el <b>seguimiento de un envío</b>: cada escala y cuánto demoró.</p>
            <p class="mini">Árbol de <b>spans</b> por operación. Se <b>muestrean</b>. Ideal para <b>latencia entre
            servicios</b>.</p>
          </div>
        </div>
        <div class="callout key">
          <div class="callout-title">🔑 Del síntoma a la causa (el flujo que hay que contar)</div>
          <p><b>1) Detectan las MÉTRICAS:</b> “la latencia p99 de crear pedido pasó de 0,8 s a 4 s”. <b>2) Localizan las
          TRAZAS:</b> “en la traza, el span <code>cobrarPedido</code> tarda 3,6 s; el resto es normal”. <b>3) Explican los
          LOGS:</b> “los logs de Pagos muestran timeouts y reintentos contra la pasarela”. <b>4) Actúa el equipo:</b> se
          limitan los reintentos, se corta con circuit breaker y se avisa al proveedor.</p>
          <p>“Las <b>métricas avisan</b>, las <b>trazas ubican</b>, los <b>logs explican</b>. Con sólo uno de los tres, el
          diagnóstico queda a medias.”</p>
          <p class="mini"><b>¿La cuarta pata?</b> Los <b>perfiles</b> (profiling continuo): muestran <b>en qué funciones</b>
          el programa gasta CPU, memoria o tiempo; se visualizan como <b>flame graph</b> (el ancho de cada barra es el % de
          tiempo). Responden algo que las otras señales no: <b>en qué parte específica del código</b> se consume el
          recurso. Ej.: Grafana Pyroscope.</p>
        </div>

        <h2>Logs</h2>
        <p>Son <b>registros cronológicos de eventos</b> generados por aplicaciones o componentes. Permiten
        <b>reconstruir lo que ocurrió</b> y entender el contexto. Son <b>detallados pero verbosos</b>. Todo log debe decir
        <b>cuándo</b> (marca de tiempo), <b>qué</b> (mensaje y nivel) y <b>dónde</b> (servicio, instancia, hilo).</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Nivel</th><th>Cuándo usarlo</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>TRACE</b></td><td>Detalle extremo, paso a paso</td><td><code>entra a calcularEnvio(pedido=1042)</code></td></tr>
            <tr><td><b>DEBUG</b></td><td>Información para desarrollar y diagnosticar</td><td><code>Guarda en DB el pedido 1042</code></td></tr>
            <tr><td><b>INFO</b></td><td><b>Hitos normales del negocio</b></td><td><code>Pedido 1042 confirmado</code></td></tr>
            <tr><td><b>WARN</b></td><td>Algo raro, <b>pero el sistema sigue funcionando</b></td><td><code>Pasarela lenta: 2,8 s; se reintenta</code></td></tr>
            <tr><td><b>ERROR</b></td><td><b>Falló una operación</b> y requiere atención</td><td><code>No se pudo cobrar el pedido 1043: timeout</code></td></tr>
            <tr><td><b>FATAL</b></td><td><b>El proceso no puede continuar</b></td><td><code>Sin conexión a la base: el servicio se detiene</code></td></tr>
          </tbody>
        </table></div>
        <p class="mini">“En producción se deja <b>INFO o superior</b>. DEBUG se activa <b>temporalmente</b> (por servicio,
        <b>sin redeploy</b>) para investigar.”</p>
        <div class="grid-2">
          <div class="card">
            <h3>Logs estructurados (JSON)</h3>
            ${APP.code(`{
  "ts": "2026-11-01T20:31:09.440-03:00",
  "level": "ERROR",
  "service": "pedidos", "instance": "pedidos-1",
  "version": "1.9.0",
  "trace_id": "7f3a9c1e5b2d4f60a1b2c3d4e5f60718",
  "pedido_id": 1043,
  "evento": "cobro_fallido",
  "motivo": "timeout_pasarela",
  "duracion_ms": 3012
}`, { lang: "json", collapse: false, label: "El mismo evento, consultable" })}
            <p class="mini"><b>Qué ganamos:</b> filtrar por campo (<code>pedido_id = 1043</code>), agrupar y contar
            (errores por motivo), <b>unir con trazas mediante <code>trace_id</code></b> y parsear <b>sin expresiones
            regulares frágiles</b>. “El estructurado <b>se puede consultar</b>; el de texto <b>sólo se puede leer</b>.”</p>
          </div>
          <div class="card">
            <h3>Buenas prácticas</h3>
            <p><b>Conviene:</b> loguear <b>eventos de negocio relevantes</b>; incluir un <b>ID de correlación</b>
            (trace_id/request_id); usar los <b>niveles con criterio</b>; preferir <b>JSON</b>; usar <b>UTC y relojes
            sincronizados (NTP)</b>.</p>
            <p><b>Hay que evitar:</b> <b>datos sensibles</b> (contraseñas, tokens, números de tarjeta, datos personales —
            <b>Ley 25.326</b>); volcar <b>payloads enteros</b> o loguear <b>dentro de ciclos calientes</b>; mensajes vacíos
            (“error”, “falló”) <b>sin contexto</b>; repetir el mismo stack trace miles de veces; <b>usar los logs como
            única fuente de métricas</b>.</p>
            <p class="mini"><b>Regla práctica:</b> antes de escribir un log, preguntate <b>¿quién lo va a leer, cuándo y
            para qué decisión?</b></p>
          </div>
        </div>
        <p><b>Infraestructura de logs:</b> Aplicaciones (archivos / stdout) → <b>agente/colector</b> (Fluent Bit, Logstash,
        OTel Collector) → <b>almacenamiento</b> que guarda e indexa (Elasticsearch, Loki) → <b>visualizador</b> (Kibana,
        Grafana). Decisiones: <b>retención</b> (7, 30 o 90 días según criticidad y normativa), <b>rotación</b> (cortar y
        comprimir por tamaño o fecha para que el disco no se llene) y <b>almacenamiento</b> (son la señal <b>más
        voluminosa</b>: índices, compresión y capas <b>calientes/frías</b>).</p>
        <div class="callout key">
          <p><b>En sistemas distribuidos cada servicio escribe su propio log</b> y <b>cada servicio ve sólo su parte</b>.
          Hay que <b>juntar los logs en un lugar común</b> (log aggregator) y buscarlos por un <b>ID compartido</b>: un
          identificador que <b>nace en la entrada</b> (el gateway) y <b>viaja con la operación</b>. “Sin un ID común,
          reconstruir un pedido es buscar a mano en cuatro archivos; con un ID, es un solo filtro.” <b>Es el puente hacia
          las trazas.</b></p>
        </div>

        <h2>Métricas</h2>
        <p>Una métrica es <b>un número con contexto</b>:</p>
        ${APP.code(`http_server_requests_total{service="pedidos", method="POST", status="201"}  1027  @ 20:31:00
   └─ nombre                └─ etiquetas (labels/tags)                        └─ valor  └─ timestamp`, { lang: "none", collapse: false, label: "Anatomía de una muestra" })}
        <p>Se <b>muestrean periódicamente</b> (ej. cada 15 s) y se guardan en una <b>base de series de tiempo</b>. Sirven
        para ver <b>que algo falla con frecuencia; no siempre dicen por qué</b>. Se visualizan en <b>dashboards</b>.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Qué mide</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>Counter</b></td><td><b>Sólo crece.</b> Cuenta eventos acumulados; se reinicia a 0 si el proceso se reinicia</td><td><code>pedidos_creados_total</code></td></tr>
            <tr><td><b>UpDownCounter</b></td><td><b>Sube y baja</b> por eventos: lo que entra y sale de algo</td><td><code>pedidos_en_preparacion</code></td></tr>
            <tr><td><b>Gauge</b></td><td><b>Valor instantáneo</b>, se lee tal cual está en ese momento</td><td><code>memoria_usada_mb</code></td></tr>
            <tr><td><b>Histogram</b></td><td><b>Distribución en rangos</b>: cuántas mediciones caen en cada <i>bucket</i></td><td><code>duracion_pedido_ms</code></td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Un counter casi nunca se grafica “crudo”:</b> se calcula su <b>tasa de cambio (rate)</b> para ver cuántos
          eventos por unidad de tiempo ocurren.</p>
          <p><b>El promedio miente:</b> con un promedio de ≈250 ms, la mediana (p50) puede ser 105 ms, el <b>p95</b> 1,1 s
          y el <b>p99</b> 2,8 s. “<b>El promedio oculta la cola larga.</b> Por eso medimos <b>percentiles</b>: p95 y p99
          muestran <b>lo que viven los usuarios con peor experiencia</b>.”</p>
          <p><b>Cardinalidad:</b> cada combinación de etiquetas es <b>una serie</b>. service×método×status = 60 series;
          sumando endpoint = 2.400; sumando <code>user_id</code> (100.000 usuarios) = <b>240 millones</b>.
          <b>Buenas etiquetas:</b> service, method, status, region (pocos valores, conocidos y acotados).
          <b>Mala idea:</b> <code>user_id</code>, <code>pedido_id</code>, email, trace_id, URL completa → <b>van en logs o
          trazas</b>. “Cada serie ocupa memoria y disco: <b>la cardinalidad es lo que más encarece</b> una TSDB.”</p>
        </div>

        <h3>⭐ Las 4 señales de oro (Golden Signals, SRE de Google)</h3>
        <p>“Si sólo pudiéramos medir cuatro cosas de un servicio con usuarios, serían estas.”</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Señal</th><th>Pregunta</th><th>Qué se mide</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>Latencia</b></td><td>¿Cuánto tarda en responder?</td><td>Tiempo de respuesta (<b>p95, p99</b>), por endpoint y <b>por dependencia</b>; éxitos y fallas <b>por separado</b></td><td>p95 de POST /pedidos = 0,9 s</td></tr>
            <tr><td><b>Tráfico</b></td><td>¿Cuánta demanda recibe?</td><td>Peticiones por segundo (RPS), mensajes procesados/min, <b>tráfico de negocio</b></td><td>128 pedidos/min</td></tr>
            <tr><td><b>Errores</b></td><td>¿Qué proporción falla?</td><td>% de 5xx, excepciones por unidad de tiempo</td><td>0,4% de respuestas 5xx</td></tr>
            <tr><td><b>Saturación</b></td><td>¿Qué tan <b>lleno</b> está?</td><td>CPU, memoria, disco; <b>pool de conexiones a BD</b>, profundidad de cola</td><td>Pool de BD al 62%</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Tipos de errores:</b> <b>explícitos</b> (HTTP 5xx, excepciones no capturadas), <b>implícitos</b>
          (200 OK pero con contenido incorrecto, o <b>tan lento que incumple el SLO</b>) y <b>de negocio</b> (pago
          rechazado, restaurante cerrado: <b>no siempre es un fallo del sistema</b>).</p>
          <p><b>La saturación es la señal ADELANTADA:</b> el pool de BD llega al límite <b>antes</b> de que suban la
          latencia y los errores. Permite <b>actuar a tiempo</b>.</p>
          <p><b>Ojo con el tráfico:</b> “sin errores y sin tráfico = <b>silencio sospechoso</b>. Una caída de demanda puede
          ser <b>un fallo que no genera ninguna excepción</b>.”</p>
        </div>
        <p><b>Otros marcos (misma idea, otros nombres):</b> <b>RED</b> para servicios (<b>R</b>ate, <b>E</b>rrors,
        <b>D</b>uration — desde el punto de vista de quien hace la solicitud) y <b>USE</b> para recursos
        (<b>U</b>tilization, <b>S</b>aturation, <b>E</b>rrors — desde el punto de vista del recurso).</p>
        <p><b>Qué se mide, por ámbito:</b> <b>infraestructura</b> (CPU, memoria, disco, I/O, red, JVM: hilos, pool, GC) ·
        <b>aplicación</b> (RPS, errores y latencia, dependencias externas y colas) · <b>negocio</b> (pedidos confirmados
        por minuto, tiempo hasta completar el pedido, abandono, disponibilidad del checkout). “<b>Una caída de pedidos por
        minuto suele ser el mejor detector de incidentes</b>: es lo que el negocio realmente siente.”</p>

        <h2>Trazas</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Término</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Trace</b></td><td>El <b>recorrido completo</b> de una operación a lo largo del sistema; agrupa todos sus spans. Se identifica con un <b>trace_id</b></td></tr>
            <tr><td><b>Span</b></td><td>Una <b>unidad de trabajo con inicio y fin</b> dentro de una traza. Cada span (salvo el primero) tiene un <b>parent_span_id</b>: esa relación padre-hijo <b>arma el árbol</b></td></tr>
            <tr><td><b>Attribute</b></td><td>Un dato <b>clave-valor</b> que describe el span (contexto): <code>pedido.id = 1042</code>, <code>http.status_code = 504</code></td></tr>
            <tr><td><b>Event</b></td><td>Una <b>marca puntual</b>, con hora, dentro de un span: <code>reintento n=2 @ 20:31:08.1</code></td></tr>
            <tr><td><b>Kind</b></td><td>Si el span es <b>entrante (SERVER)</b>, <b>saliente (CLIENT)</b>, interno, productor o consumidor. <b>Status:</b> UNSET, OK o ERROR</td></tr>
          </tbody>
        </table></div>
        <p><b>Propagación del contexto:</b> el trace_id <b>se genera al entrar al sistema</b> (en el gateway), <b>se
        propaga en cada llamada</b> entre servicios y <b>todos los spans lo comparten</b>: así se reconstruye el
        recorrido.</p>
        <p><b>Cómo leer un diagrama de cascada (waterfall):</b> el <b>ancho</b> = duración del span; la <b>sangría</b> =
        relación padre-hijo; los <b>huecos</b> = espera o código sin instrumentar.</p>
        <div class="callout key">
          <div class="callout-title">Muestreo (sampling)</div>
          <p>No se pueden guardar todas las trazas. Con 100 req/s y muestreo del 10% se almacenan 10 trazas/s (≈864.000 por
          día).</p>
          <ul>
            <li><b>Head-based:</b> decide <b>al inicio</b> de la traza (ej. 10% al azar). Simple y barato, pero
            <b>puede descartar justo las trazas con error o lentas</b>.</li>
            <li><b>Tail-based:</b> decide <b>al terminar</b>, viéndola completa. <b>Conserva errores y trazas lentas</b>,
            pero exige buffer y más recursos en el colector.</li>
          </ul>
          <p><b>Regla práctica:</b> muestrear mucho lo normal y <b>conservar SIEMPRE las trazas con error o con latencia
          alta</b>.</p>
        </div>

        <h2>Alertas</h2>
        <p><b>Ciclo:</b> Métrica → <b>Regla</b> (“p95 &gt; 2 s durante 5 min”) → Evaluación → <b>Notificación</b> (mail,
        chat o pager a la guardia) → Respuesta (on-call investiga con tablero, trazas y logs) → <b>Postmortem</b> (se
        documenta y <b>se ajusta la alerta</b>). <b>Estados:</b> OK → Pendiente → <b>Disparada (firing)</b> → Resuelta.</p>
        <p class="mini">“Una alerta <b>sin respuesta definida es sólo ruido</b>: cada una debería tener <b>dueño,
        severidad y un runbook</b> (guía de qué hacer).”</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo de alarma</th><th>Qué detecta</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>Umbral estático</b></td><td>Una métrica supera o baja de un <b>valor fijo</b></td><td>“CPU &gt; 90% durante 5 min”</td></tr>
            <tr><td><b>Tendencia / anomalía</b></td><td>Cambios <b>inusuales respecto del comportamiento histórico</b></td><td>“La latencia aumentó 50% respecto de la media de la última hora”</td></tr>
            <tr><td><b>Basada en SLO / SLA</b></td><td>El servicio <b>no cumple su objetivo</b> de nivel de servicio</td><td>“Error budget consumido &gt; 80% este mes”</td></tr>
            <tr><td><b>Ausencia de datos</b> (silencio)</td><td>Falta de métricas o logs <b>esperados</b></td><td>“No se reciben métricas del servicio X en 10 minutos”</td></tr>
            <tr><td><b>Compuesta</b></td><td>Combina varias condiciones para <b>reducir falsos positivos</b></td><td>“Latencia anómala Y abandono de carrito alto”</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Alertar por SÍNTOMAS, no por causas</div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>❌ Alerta por causa (frágil)</th><th>✅ Alerta por síntoma (centrada en el usuario)</th></tr></thead>
            <tbody>
              <tr><td>CPU &gt; 80% en una instancia</td><td>p95 de “crear pedido” &gt; 2 s durante 5 min</td></tr>
              <tr><td>Un contenedor se reinició</td><td>% de pedidos fallidos &gt; 1%</td></tr>
              <tr><td>La cola tiene 500 mensajes</td><td>La factura tarda más de 2 min en generarse</td></tr>
              <tr><td>El disco está al 70%</td><td>El disco se llenará en menos de 4 horas (predicción)</td></tr>
            </tbody>
          </table></div>
          <p>Una buena alerta es <b>accionable</b> (alguien puede hacer algo concreto), <b>urgente</b> (no puede esperar a
          mañana), <b>con dueño y runbook</b> y <b>con severidad</b> (P1 despierta a alguien; P3 es un ticket).</p>
          <p><b>Alert fatigue:</b> “si todo alerta, nada se atiende. Una alerta que se ignora con frecuencia hay que
          ajustarla o eliminarla.”</p>
          <p><b>Parámetros:</b> <b>umbral</b> (el valor que no queremos superar), <b>duración (for)</b> (cuánto debe
          sostenerse antes de disparar), <b>agregación</b> (promedio, máximo o percentil en la ventana) y
          <b>recuperación</b> (umbral para volver a OK y evitar el <i>flapping</i>). “Sin duración mínima, <b>un pico de un
          segundo despierta a alguien a las 3 de la mañana</b>.”</p>
        </div>

        <h2>SLI, SLO, SLA y presupuesto de error</h2>
        <p>Ver también <a class="inline" data-go="p2-infraestructura">infraestructura</a>. Ejemplo de la clase:</p>
        <ul>
          <li><b>SLI:</b> % de pedidos creados en menos de 2 s y sin error.</li>
          <li><b>SLO:</b> 99,5% de los pedidos, medido en 30 días.</li>
          <li><b>SLA:</b> si baja de 99%, se compensa al restaurante.</li>
        </ul>
        <div class="callout key">
          <p><b>Presupuesto de error:</b> 100% − 99,5% = <b>0,5%</b>. De 30 días (43.200 min) → <b>216 min = 3 h 36 min</b>
          de servicio “malo” permitido. <b>Mientras quede presupuesto, se puede arriesgar</b> (lanzar cambios); <b>si se
          agota, se prioriza la confiabilidad</b>.</p>
          <p>Al <b>80%</b> → alerta por SLO, se frenan los cambios riesgosos. Al <b>100%</b> → <b>se congelan los
          lanzamientos</b>. “Alertar por consumo de presupuesto es alertar por el <b>impacto real en los usuarios</b>, no
          por una causa técnica puntual.”</p>
        </div>

        <h2>TSDB: dónde viven las métricas</h2>
        <ul>
          <li><b>Retención y downsampling:</b> 0–15 días a resolución de <b>15 s</b> (diagnóstico de incidentes); 15–90
          días cada <b>5 min</b> (tendencias); 90 días–2 años cada <b>1 h</b> (capacidad y planificación anual).
          <b>Regla: alta resolución, poco tiempo; baja resolución, mucho tiempo.</b> Se pierde el detalle fino (picos
          cortos) pero se conservan el máximo y el p95. <b>La retención es una decisión de negocio, no sólo técnica.</b></li>
          <li><b>Costo:</b> <code>muestras/día = series × (86.400 ÷ intervalo)</code>. 1.000 series cada 15 s = 5,76 M
          muestras/día ≈ 0,17–0,35 GB/mes; <b>1 millón de series</b> ≈ 170–350 GB/mes. <b>Lo que más encarece no es el
          volumen de datos sino la cantidad de series activas (cardinalidad).</b></li>
          <li><b>Cómo reducir el costo:</b> evitar etiquetas de alta cardinalidad (<code>user_id</code>), subir el
          intervalo de muestreo cuando alcance, aplicar <b>downsampling y retención por tipo de métrica</b>.</li>
        </ul>
        <p class="mini"><b>Herramientas:</b> logs → ELK (Elasticsearch, Logstash, Kibana), Grafana Loki · métricas →
        <b>Prometheus + Grafana</b>, CloudWatch · trazas → <b>OpenTelemetry</b>, Jaeger, Zipkin · perfiles → Pyroscope.</p>

        <h2>Incidente de punta a punta (el ejemplo integrador)</h2>
        <div class="callout key">
          <p><b>Viernes 21:00.</b> <b>1) Alerta:</b> p95 de “crear pedido” &gt; 2 s por 5 min; llega al celular de la
          guardia. <b>2) Golden Signals:</b> latencia ↑, tráfico normal, errores 4% → <b>no es carga, es una falla</b>.
          <b>3) Traza:</b> el 90% del tiempo está en <i>pagos → pasarela</i>; Pedidos y la BD están sanos. <b>4) Logs:</b>
          timeout de 3000 ms hacia la pasarela, con reintentos en cascada <b>desde la v1.9.0</b>. <b>5) Mitigación:</b>
          <b>rollback a v1.8.x</b> y <b>circuit breaker</b> con respuesta degradada.</p>
          <p>“Sin observabilidad: horas de hipótesis. Con ella: <b>minutos entre la alerta y la causa</b>, y un
          <b>postmortem con datos</b>.”</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2obsQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2obsQuiz"), [
        { n: 1, topic: "Conceptos", type: "mc", q: "La diferencia central entre monitoreo y observabilidad es…", options: [
          { t: "El monitoreo responde ¿qué pasa y cuándo? sobre problemas conocidos; la observabilidad, ¿por qué pasa? incluso ante problemas no anticipados", ok: true },
          { t: "Son sinónimos, cambia sólo la herramienta", ok: false },
          { t: "El monitoreo usa trazas y la observabilidad métricas", ok: false },
        ], explain: "El monitoreo busca alertar; la observabilidad busca entender. Y el monitoreo es una PARTE de una práctica observable, no su opuesto." },
        { n: 2, topic: "Pilares", type: "mc", q: "La latencia subió. ¿Con qué pilar <b>localizás</b> dónde se pierde el tiempo?", options: [
          { t: "Trazas: el árbol de spans muestra qué tramo tarda", ok: true },
          { t: "Logs", ok: false },
          { t: "Métricas", ok: false },
        ], explain: "Las métricas avisan, las trazas ubican, los logs explican." },
        { n: 3, topic: "Métricas", type: "mc", q: "¿Por qué no alcanza con el promedio de latencia?", options: [
          { t: "Porque oculta la cola larga: hay que medir percentiles (p95, p99), que reflejan la peor experiencia real", ok: true },
          { t: "Porque el promedio es difícil de calcular", ok: false },
          { t: "Porque no se puede graficar", ok: false },
        ], explain: "Con promedio ≈250 ms el p50 puede ser 105 ms y el p99, 2,8 s: 1 de cada 100 usuarios espera casi 3 segundos." },
        { n: 4, topic: "Cardinalidad", type: "mc", q: "¿Por qué <code>user_id</code> es una mala etiqueta de métrica?", options: [
          { t: "Porque cada combinación es una serie: con 100.000 usuarios explota la cardinalidad y el costo. Ese dato va en logs o trazas", ok: true },
          { t: "Porque es un dato sensible", ok: false },
          { t: "Porque Prometheus no acepta strings", ok: false },
        ], explain: "La cardinalidad (cantidad de series activas) es lo que más encarece una TSDB. Buenas etiquetas: pocos valores, conocidos y acotados." },
        { n: 5, topic: "Alertas", type: "mc", q: "¿Cuál es una alerta por <b>síntoma</b>?", options: [
          { t: "“% de pedidos fallidos > 1%”", ok: true },
          { t: "“CPU > 80% en una instancia”", ok: false },
          { t: "“Un contenedor se reinició”", ok: false },
        ], explain: "Las alertas por causa son frágiles (un contenedor que se reinicia puede no afectar a nadie). Hay que alertar por lo que el usuario sufre." },
        { n: 6, topic: "Trazas", type: "mc", q: "El muestreo <b>tail-based</b>…", options: [
          { t: "Decide al terminar la traza, viéndola completa: conserva errores y trazas lentas, a costa de buffer y recursos", ok: true },
          { t: "Decide al inicio al azar: es simple y barato", ok: false },
          { t: "Guarda el 100% de las trazas", ok: false },
        ], explain: "Head-based es el que decide al inicio y puede descartar justo las trazas interesantes." },
        { n: 7, topic: "Microservicios", type: "open", q: "¿Cómo diagnosticás “¿por qué tardó 2 segundos el pedido?” en un sistema con 5 microservicios?", answer: "Con un ID de correlación (trace_id) generado en el API Gateway al entrar la request y propagado en la cabecera de cada llamada entre servicios. Todos los logs llevan ese ID y se envían a un log aggregator central (ELK, Loki), así que reconstruir el recorrido es un solo filtro en vez de buscar a mano en cinco archivos. Con el mismo ID, la traza distribuida (OpenTelemetry + Jaeger) muestra el árbol de spans en un diagrama de cascada: el ancho de cada span indica su duración y se ve de inmediato qué tramo se comió el tiempo (por ejemplo, Pagos: 1,8 s con timeout y un reintento de 80 ms). Las métricas (Golden Signals) son las que avisaron del desvío —p95 por encima del SLO— y los logs explican el detalle exacto del fallo. El orden de trabajo es: métricas detectan, trazas localizan, logs explican, y después postmortem para ajustar la alerta." },
      ]);
    },
  });
})();
