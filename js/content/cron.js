/* ============================================================
   Integración — Cron Task y ejecución programada
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cron",
    title: "Cron Task",
    tag: "🔗",
    group: "Integración y comunicación",
    resumen: "Tareas programadas",
    keywords: ["cron", "scheduled", "tarea programada", "batch", "periodico", "vencimiento", "lote", "spring scheduling"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Cron Task y ejecución programada</h1>
          <p class="lead">Tareas que se ejecutan solas, en momentos programados, sin que nadie las dispare.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 El tercer modo de ejecución</div>
          <p>Además de <a class="inline" data-go="sincronismo">sincrónico y asincrónico</a>, está el <b>programado</b>:
          el proceso no lo dispara ningún usuario ni ningún mensaje, corre solo cada tanto. Aparece en GTV (vencimiento
          de formularios) y en Libros Circulares (recomendaciones periódicas).</p>
        </div>

        <h2>Qué es y cuándo se usa</h2>
        <p>Una tarea que se ejecuta automáticamente en momentos programados. Se usa para:</p>
        <ul>
          <li>Procesos <b>batch nocturnos</b> (cuando hay poco tráfico).</li>
          <li>Reportes periódicos.</li>
          <li>Limpieza de datos viejos.</li>
          <li>Verificaciones periódicas: “detectar usuarios inactivos hace más de 20 días”, “anular formularios vencidos”.</li>
          <li>Cálculos costosos que no necesitan ser en tiempo real: ranking mensual.</li>
        </ul>

        <h2>Cómo detectarlo en un enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th></tr></thead>
          <tbody>
            <tr><td>“al cierre de cada mes”</td></tr>
            <tr><td>“diariamente” / “periódicamente”</td></tr>
            <tr><td>“en horarios de poco tránsito”</td></tr>
            <tr><td>“un proceso programado”</td></tr>
            <tr><td>“de forma automática” (GTV: anular formularios al vencer)</td></tr>
            <tr><td>“cuando lleva más de N días sin…”</td></tr>
          </tbody>
        </table></div>

        <h2>Sintaxis cron (6 campos en Spring)</h2>
        ${APP.code(` ┌───────────── segundo (0-59)
 │ ┌───────────── minuto (0-59)
 │ │ ┌───────────── hora (0-23)
 │ │ │ ┌───────────── día del mes (1-31)
 │ │ │ │ ┌───────────── mes (1-12)
 │ │ │ │ │ ┌───────────── día de la semana (0-7)
 │ │ │ │ │ │
 * * * * * *

 0 0 3 * * *     → todos los días a las 3:00 AM
 0 0 0 1 * *     → el día 1 de cada mes a medianoche
 0 */15 * * * *  → cada 15 minutos`, { lang: "text", label: "Sintaxis cron", collapse: false })}

        ${APP.code(`@Component
public class RevisorInactividad {

    @Scheduled(cron = "0 0 9 * * *")   // todos los días a las 9 AM
    public void revisarInactivos() {
        // lógica
    }
}
// Necesita @EnableScheduling en la clase principal de la app`, { label: "Cron en Spring Boot" })}

        <div class="callout warn">
          <div class="callout-title">⚠️ Los dos detalles que casi nadie menciona (y suman)</div>
          <p><b>1) Múltiples instancias.</b> Si el servicio corre en varias instancias, <code>@Scheduled</code> se dispara
          en <b>todas</b> y el proceso se ejecuta N veces. Hay que garantizar <b>ejecución única</b>: un lock distribuido
          (ShedLock, Redis) o un scheduler externo que invoque un endpoint.</p>
          <p><b>2) Procesos pesados.</b> Si el proceso corre para muchos registros, conviene ejecutarlo en <b>horario de
          bajo tráfico</b> y procesar <b>de a lotes</b> (batches) para no saturar. Mejor aún: que el cron no haga el
          trabajo sino que <b>publique mensajes en una cola</b> para que los workers los procesen en paralelo.</p>
        </div>

        <div class="callout tip">
          <div class="callout-title">✅ Ejemplo de parcial: vencimiento de formularios (GTV)</div>
          <p>“Cada formulario tiene una fecha de vencimiento y el sistema lo anula <b>de forma automática</b>.” →
          Un cron diario busca los vencidos, llama a <code>formulario.anularPorVencimiento()</code> (la lógica vive en el
          dominio, con su <a class="inline" data-go="state">State</a>) y publica un evento que un
          <a class="inline" data-go="observer">Observer</a> usa para mandar el mail. El detalle fino: garantizar que el
          cron corra una sola vez aunque haya varias instancias.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="cronQuiz"></div>
      `;

      APP.quiz(el.querySelector("#cronQuiz"), [
        { n: 1, topic: "Cron", type: "mc", q: "“El sistema anula automáticamente los formularios cuya fecha de vencimiento se cumplió.” ¿Cómo lo resolvés?", options: [
          { t: "Un cron diario que busca los vencidos y los anula, publicando un evento por cada uno", ok: true },
          { t: "Validar el vencimiento cada vez que alguien consulta el formulario", ok: false },
          { t: "Un mensaje con delay de hasta 45 días al crear el formulario", ok: false },
        ], explain: "“Automáticamente” = nadie lo dispara. La segunda opción no manda el mail si nadie consulta; la tercera es frágil y difícil de reprogramar al renovar." },
        { n: 2, topic: "Cron", type: "mc", q: "Tu cron corre en 3 instancias del servicio. ¿Qué problema tenés?", options: [
          { t: "Se ejecuta 3 veces: hace falta un lock distribuido o un scheduler externo", ok: true },
          { t: "Ninguno: Spring lo coordina solo", ok: false },
          { t: "Se ejecuta 1 vez porque comparten la base", ok: false },
        ], explain: "<code>@Scheduled</code> es local a cada JVM: las tres disparan a la misma hora. Es un detalle que demuestra que pensaste el despliegue real." },
        { n: 3, topic: "Cron", type: "mc", q: "El proceso programado tiene que procesar 2 millones de registros. ¿Qué conviene?", options: [
          { t: "Horario de bajo tráfico + procesar de a lotes (o publicar en cola para procesar en paralelo)", ok: true },
          { t: "Ejecutarlo en horario pico para aprovechar los recursos", ok: false },
          { t: "Procesarlo todo de una en memoria", ok: false },
        ], explain: "Batches en horario tranquilo evitan saturar el sistema; delegar a una cola permite escalar el procesamiento." },
      ]);
    },
  });
})();
