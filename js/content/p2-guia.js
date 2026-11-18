/* ============================================================
   P2 · Guía de estudio: cómo aprender esto en un día
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-guia",
    title: "⏱️ Cómo estudiar esto en un día",
    tag: "⏱️",
    group: "Parcial 2 (práctica)",
    resumen: "Plan por bloques, qué memorizar y qué entender",
    cuenta: false,
    keywords: ["guia", "estudiar", "plan", "repaso", "tecnica", "recall", "memorizar", "prioridades", "estrategia", "examen"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial 2 · Estrategia</div>
          <h1>Cómo estudiar esto en un día</h1>
          <p class="lead">Rendís mañana. No alcanza para leer todo dos veces, así que el plan no es “leer más”: es <b>producir respuestas</b>. Lo que se evalúa es <b>escribir una justificación</b>, no reconocer una opción.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 La regla que ordena todo</div>
          <p>Este parcial <b>no se aprueba sabiendo definiciones: se aprueba eligiendo y justificando</b>. Por cada tema,
          lo único que tenés que poder hacer es:</p>
          <ol>
            <li>Dar la <b>definición en una oración</b> (con las palabras de la cátedra).</li>
            <li>Decir <b>cuándo lo usarías</b> (qué frase del enunciado lo dispara).</li>
            <li>Nombrar <b>su ventaja y su costo</b>.</li>
            <li>Conectarlo con un <b>atributo de calidad</b>.</li>
          </ol>
          <p>Si podés hacer esas 4 cosas sin mirar, el tema está listo. Si no, <b>no lo leas otra vez</b>: escribí la
          respuesta en papel y después comparala.</p>
        </div>

        <h2>El plan por bloques (ajustá las horas a cuando empieces)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Bloque</th><th>Qué hacer</th><th>Páginas</th></tr></thead>
          <tbody>
            <tr>
              <td><b>1 · 45 min<br>Datos: el núcleo</b></td>
              <td>Es el tema con más puntos y el que tomaron hoy. Leé y, sin mirar, <b>escribí</b>: (a) las 3 formas normales en una línea cada una; (b) las 3 anomalías; (c) la diferencia entre desnormalizar <b>por consistencia</b> y <b>por performance</b>.</td>
              <td><a class="inline" data-go="p2-normalizacion">Formas Normales</a> · <a class="inline" data-go="p2-desnormalizacion">Desnormalización</a></td>
            </tr>
            <tr>
              <td><b>2 · 45 min<br>Hacer un DER</b></td>
              <td><b>Con lápiz y papel</b>, modelá el “Servicio de Gestión de Mascotas” del parcial 2025 <b>antes</b> de mirar la solución. Después compará. Repetí con el punto de Persistencia (bicicleteros).</td>
              <td><a class="inline" data-go="p2-der">DER paso a paso</a> · <a class="inline" data-go="p2-simulacro">Simulacro</a></td>
            </tr>
            <tr>
              <td><b>3 · 40 min<br>ORM e Hibernate</b></td>
              <td>Memorizá los <b>4 impedance mismatches</b> y la <b>tabla de las 4 estrategias de herencia</b> (cuántas tablas genera cada una + cuándo). Es la pregunta de justificación más previsible.</td>
              <td><a class="inline" data-go="p2-orm">ORM</a> · <a class="inline" data-go="p2-hibernate">Hibernate</a></td>
            </tr>
            <tr>
              <td><b>4 · 25 min<br>Persistencia y NoSQL</b></td>
              <td>Las 6 estrategias de persistencia (una línea cada una) y el <b>árbol de decisión NoSQL</b>: sensores→TSDB, estadísticas→columnar, sesiones/caché→clave-valor, catálogo→documentos, relaciones→grafos, feeds/IoT masivo→familia de columnas.</td>
              <td><a class="inline" data-go="p2-persistencia">Persistencia</a> · <a class="inline" data-go="p2-nosql">NoSQL</a></td>
            </tr>
            <tr>
              <td><b>5 · 40 min<br>Arquitectura web II</b></td>
              <td>Stateless vs stateful + <b>JWT vs sesión</b> (5 ventajas y 2 desventajas); cliente <b>liviano vs pesado</b> (la tabla con los “−” y por qué); <b>nativo vs híbrido</b> con atributos definidos.</td>
              <td><a class="inline" data-go="p2-sesiones">Sesiones/JWT</a> · <a class="inline" data-go="p2-clientes">Clientes/SPA</a></td>
            </tr>
            <tr>
              <td><b>6 · 40 min<br>Escalar e integrar</b></td>
              <td>Estudiá las <b>dos tablas de diagnóstico</b>: “síntoma → componente” y “comparativa de integraciones”. Y la de <b>resiliencia</b>: timeout, retry+backoff, circuit breaker, idempotencia, fallback.</td>
              <td><a class="inline" data-go="p2-escalabilidad">Escalabilidad</a> · <a class="inline" data-go="p2-integracion">Integración</a></td>
            </tr>
            <tr>
              <td><b>7 · 35 min<br>Distribuidas</b></td>
              <td>Monolito vs SOA vs microservicios (la tabla de 3 columnas). <b>Saga</b> y <b>bounded context</b>. Nube: <b>IaaS/PaaS/FaaS/SaaS</b> y <b>responsabilidad compartida</b>.</td>
              <td><a class="inline" data-go="p2-monolito">Monolito</a> · <a class="inline" data-go="p2-soa">SOA</a> · <a class="inline" data-go="p2-microservicios">Microservicios</a> · <a class="inline" data-go="p2-nube">Nube</a></td>
            </tr>
            <tr>
              <td><b>8 · 25 min<br>Observabilidad y deploy</b></td>
              <td>Sólo tres cosas: <b>monitoreo vs trazabilidad vs observabilidad</b>, los <b>3 pilares</b> (métricas avisan, trazas ubican, logs explican) y las <b>4 Golden Signals</b>. De deploy: las 4 estrategias en una línea cada una.</td>
              <td><a class="inline" data-go="p2-observabilidad">Observabilidad</a> · <a class="inline" data-go="p2-infraestructura">Infraestructura</a></td>
            </tr>
            <tr>
              <td><b>9 · 30 min<br>Cierre activo</b></td>
              <td>Hacé el <a class="inline" data-go="p2-preguntas">banco de preguntas</a> completo. Lo que falles, anotalo <b>a mano</b> en una hoja: esa hoja es tu repaso de mañana a la mañana (no vuelvas al sitio).</td>
              <td><a class="inline" data-go="p2-preguntas">Preguntas</a></td>
            </tr>
            <tr>
              <td><b>10 · 10 min<br>Imprimir</b></td>
              <td>Bajá el <a class="inline" data-go="p2-imprimible">resumen imprimible</a> en PDF y <b>dejalo impreso antes de dormir</b> (no a la mañana, cuando la impresora falla).</td>
              <td><a class="inline" data-go="p2-imprimible">Imprimible</a></td>
            </tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Si sólo te quedan 3 horas:</b> bloques 1, 2, 3 y 6, y el imprimible. Son el 70% del puntaje
          (modelo de datos + persistencia + las preguntas de arquitectura que caen siempre).</p>
        </div>

        <h2>La técnica (esto es lo que realmente mueve la aguja)</h2>
        <div class="grid-2">
          <div class="card">
            <h3>✅ Hacé esto</h3>
            <ul>
              <li><b>Recuperación activa:</b> cerrá la pantalla y escribí la respuesta. Leer da sensación de saber;
              escribir muestra si sabés.</li>
              <li><b>Resolvé en papel</b>, con el reloj corriendo. El parcial es escrito y a mano: si nunca dibujaste un
              DER a mano, mañana vas a perder 10 minutos sólo en acomodar los rectángulos.</li>
              <li><b>Decilo en voz alta</b> como si le explicaras a alguien. Si te trabás, ahí está el agujero.</li>
              <li><b>Trabajá con las tablas comparativas.</b> Casi todas las preguntas de teoría de este parcial son
              “A vs B”: normalizado/desnormalizado, liviano/pesado, sync/async, monolito/micro, nube/on-premise,
              orquestación/coreografía, monitoreo/observabilidad.</li>
              <li><b>Cerrá cada tema con una frase de justificación</b> (ya están escritas en cada página, en los bloques
              🎯). Memorizá <b>esas frases</b>, no los párrafos.</li>
            </ul>
          </div>
          <div class="card">
            <h3>❌ Evitá esto</h3>
            <ul>
              <li><b>Releer</b> el material tres veces subrayando. Es la técnica que mejor se siente y peor funciona.</li>
              <li><b>Memorizar listas largas</b> sin entender el criterio. Si entendés que “lazy = traer cuando se usa”,
              no necesitás memorizar nada más de lazy.</li>
              <li><b>Empezar por lo que más te gusta.</b> Empezá por <b>datos</b>: tiene más puntos y es donde se
              desaprueba.</li>
              <li><b>Trasnochar.</b> Dormir consolida justamente lo que estudiaste hoy; sin eso, el repaso de la mañana
              no tiene de dónde agarrarse.</li>
            </ul>
          </div>
        </div>

        <h2>Lo que hay que saber de memoria, sí o sí</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tema</th><th>Lo mínimo indispensable</th></tr></thead>
          <tbody>
            <tr><td>Persistencia</td><td>Definición en una oración + las 6 estrategias + qué es el <b>impedance mismatch</b></td></tr>
            <tr><td>Modelo relacional</td><td>Relación/tupla/atributo/dominio/<b>grado</b> · PK natural/subrogada/compuesta · <b>cardinalidad = máxima, modalidad = mínima</b> · N:M <b>no existe</b> → tabla intermedia</td></tr>
            <tr><td>Formas normales</td><td>1FN atómico · 2FN sin dependencias <b>parciales</b> (sólo con PK compuesta) · 3FN sin dependencias <b>transitivas</b> · las <b>3 anomalías</b></td></tr>
            <tr><td>Desnormalización</td><td>Las <b>dos</b> razones (consistencia / performance) y la regla: “si integra un documento probatorio <b>se copia</b>; si sólo sirve para navegar, <b>se referencia</b>”</td></tr>
            <tr><td>ORM</td><td>Los <b>4</b> impedance mismatches · <b>Data Mapper vs Active Record</b> · los <b>2 pasos</b> de la hidratación · lazy vs eager · caché 1º nivel = <b>sesión</b>, 2º = <b>SessionFactory</b></td></tr>
            <tr><td>Herencia</td><td><b>Cuántas tablas</b> genera cada estrategia y <b>JOIN vs UNION vs discriminador</b></td></tr>
            <tr><td>NoSQL</td><td>Los <b>6 tipos</b> con <b>un</b> caso de uso cada uno + <b>persistencia políglota</b></td></tr>
            <tr><td>Sesiones</td><td>Stateless vs stateful · <b>JWT: 5 ventajas</b> · <b>401 vs 403</b> · los 3 niveles de protección + <b>alcances</b></td></tr>
            <tr><td>Clientes</td><td>Liviano = HTML/servidor, pesado = JSON/cliente · <b>toda SPA es cliente pesado, no al revés</b> · nativo vs híbrido con atributos</td></tr>
            <tr><td>Escalabilidad</td><td>Vertical = performance y <b>tiene techo</b>; horizontal = performance <b>+ disponibilidad</b> y <b>exige stateless</b> · <b>sticky sessions es un parche</b></td></tr>
            <tr><td>Integración</td><td>La tabla comparativa (API/cola/BD compartida/Kafka) · <b>orden→cola, evento→topic</b> · <b>at-least-once ⇒ idempotencia</b> · DLQ</td></tr>
            <tr><td>Distribuidas</td><td>Monolito = <b>una unidad de despliegue</b> · SOA = <b>empresa</b>, micro = <b>aplicación</b> · <b>Saga</b> = transacciones locales + compensaciones</td></tr>
            <tr><td>Nube</td><td>IaaS/PaaS/FaaS/SaaS (quién gestiona qué) · <b>responsabilidad compartida</b> · CAPEX vs OPEX</td></tr>
            <tr><td>Observabilidad</td><td><b>Monitoreo alerta, observabilidad entiende</b> · métricas avisan / trazas ubican / logs explican · las <b>4 Golden Signals</b></td></tr>
          </tbody>
        </table></div>

        <h2>Mañana, en el parcial</h2>
        <div class="card">
          <ol>
            <li><b>Leé el enunciado completo antes de escribir nada</b> y marcá con lápiz las frases que disparan
            decisiones (“puede tardar”, “picos”, “al momento de la venta”, “datos sensibles”, “cientos de sensores”,
            “terceros quieren flexibilidad”).</li>
            <li><b>Repartí el tiempo por puntaje.</b> Si Modelo de Datos vale 40 y Arquitectura 50, no puede pasar que
            llegues con 10 minutos a arquitectura. <b>La condición de aprobación suele exigir no menos del 50% en cada
            sección: una sección en blanco desaprueba el parcial entero.</b></li>
            <li><b>Escribí los supuestos.</b> Un supuesto explícito convierte una ambigüedad en una decisión defendible.</li>
            <li><b>Justificá todo por escrito</b>, aunque te parezca obvio. “Usé una cola” no vale; “usé una cola porque
            el emisor no necesita la respuesta y hay picos de carga, lo que mejora disponibilidad y escalabilidad” vale.</li>
            <li><b>Nombrá el atributo de calidad y definilo</b> cuando lo uses: la consigna lo pide textualmente en varios
            puntos.</li>
            <li><b>Dibujá.</b> “Un diagrama es mucho mejor que texto” aparece literalmente como tip en los enunciados.
            Rotulá <b>todas</b> las flechas con su protocolo (HTTPS, AMQP, MQTT, JDBC) y aclaró qué es externo.</li>
            <li><b>Si no te acordás un nombre propio, describí el mecanismo.</b> “Un componente que corta las llamadas
            cuando el servicio falla repetidamente y responde una alternativa degradada” suma casi lo mismo que escribir
            “circuit breaker”.</li>
            <li><b>Dejá 5 minutos para releer</b> buscando requerimientos del enunciado que no aparezcan en tu solución.</li>
          </ol>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 El molde de respuesta que sirve para cualquier punto de arquitectura</div>
          <p><b>1)</b> Qué propongo (el componente o patrón, con su nombre). <b>2)</b> Por qué, citando <b>la frase del
          enunciado</b> que lo justifica. <b>3)</b> Cómo funciona, en 2 o 3 renglones. <b>4)</b> Qué <b>atributos de
          calidad</b> mejora y cómo se garantizan. <b>5)</b> Qué <b>costo</b> asumo (consistencia eventual, complejidad
          operativa, inconsistencia tolerada) y <b>cómo lo mitigo</b>.</p>
          <p>El punto 5 es el que separa un 6 de un 9: demuestra que no estás repitiendo una receta.</p>
        </div>
      `;
    },
  });
})();
