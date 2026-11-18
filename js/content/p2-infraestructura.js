/* ============================================================
   P2 · Infraestructura, ambientes, CI/CD, SLA/RPO/RTO, despliegue
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-infraestructura",
    title: "Infraestructura y Despliegue",
    tag: "🐳",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Contenedores, Kubernetes, ambientes, CI/CD, SLI/SLO/SLA, RPO/RTO y estrategias de deploy",
    keywords: ["bare metal", "maquina virtual", "contenedor", "docker", "kubernetes", "pod", "serverless", "ambientes", "staging", "iac", "terraform", "inmutable", "ci", "cd", "sli", "slo", "sla", "disponibilidad", "nueves", "rpo", "rto", "pilot light", "warm standby", "activo-activo", "recreate", "rolling update", "blue green", "canary", "feature flags", "shadow", "a/b testing"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Infraestructura y Estrategias de Despliegue</h1>
          <p class="lead">Lo que está <b>debajo</b> de la arquitectura, y cómo se lleva una versión nueva a producción sin cortar el servicio.</p>
        </div>

        <h2>De bare metal a serverless</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Nivel</th><th>Qué es</th><th>Ejemplos</th></tr></thead>
          <tbody>
            <tr><td><b>Bare Metal</b></td><td>La aplicación corre <b>directamente sobre el servidor físico</b>. Máximo control; <b>baja utilización</b> del hardware.</td><td>—</td></tr>
            <tr><td><b>Máquinas Virtuales</b></td><td>Un <b>hipervisor</b> divide el servidor en varias máquinas, <b>cada una con su SO</b>.</td><td>VMware, KVM, Hyper-V</td></tr>
            <tr><td><b>Contenedores</b></td><td><b>Empaquetan la aplicación y sus dependencias</b>; <b>comparten el kernel</b> del SO.</td><td>Docker, Podman</td></tr>
            <tr><td><b>Orquestación</b></td><td>Administra <b>cientos de contenedores</b> en un clúster: ubicación, escalado, recuperación.</td><td>Kubernetes</td></tr>
            <tr><td><b>Serverless</b></td><td><b>Sólo se escribe la función</b>; el proveedor gestiona todo y <b>cobra por ejecución</b>.</td><td>AWS Lambda, Azure Functions</td></tr>
          </tbody>
        </table></div>
        <p class="mini">← Más control y rendimiento · Más abstracción y velocidad de desarrollo →</p>

        <h3>VMs vs. Contenedores</h3>
        <div class="grid-2">
          <div class="card">
            <h3>Máquina Virtual</h3>
            <ul>
              <li>Cada una incluye un <b>sistema operativo completo</b> (SO invitado).</li>
              <li><b>Aislamiento fuerte</b>; ocupa <b>GBs</b> y arranca en <b>minutos</b>.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Contenedor</h3>
            <ul>
              <li><b>Comparte el kernel del anfitrión.</b> Liviano (<b>MBs</b>), arranca en <b>segundos</b>, <b>mayor densidad</b> por servidor.</li>
              <li><b>Portabilidad:</b> la misma imagen corre igual en la notebook, en testing y en producción — <b>fin del “en mi máquina funciona”</b>.</li>
              <li><b>No son excluyentes:</b> en la nube, los contenedores <b>suelen correr sobre máquinas virtuales</b>.</li>
            </ul>
          </div>
        </div>
        ${APP.code(`FROM eclipse-temurin:21-jre
COPY target/ventas.jar /app/ventas.jar
CMD ["java", "-jar", "/app/ventas.jar"]`, { lang: "docker", collapse: false, label: "Dockerfile mínimo" })}

        <h3>Kubernetes en 5 líneas</h3>
        <ul>
          <li>Se <b>declara el estado deseado</b> (“3 réplicas de ventas v1.4”) y Kubernetes <b>trabaja para mantenerlo</b>.</li>
          <li><b>Scheduling:</b> decide en qué nodo corre cada contenedor.</li>
          <li><b>Self-healing:</b> <b>reinicia o reemplaza</b> los que fallan.</li>
          <li><b>Autoescalado</b> según CPU, memoria o métricas propias.</li>
          <li><b>Rolling updates y rollback</b>; balanceo y <b>descubrimiento de servicios</b> internos.</li>
        </ul>
        <p class="mini">Piezas: <b>clúster</b> → <b>plano de control</b> (API Server, Scheduler, controladores, estado
        deseado) → <b>nodos</b> → <b>pods</b>.</p>

        <h2>Ambientes: el camino a producción</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Ambiente</th><th>Uso</th><th>Datos</th></tr></thead>
          <tbody>
            <tr><td><b>Desarrollo</b></td><td>Desarrolladores; cambia constantemente</td><td>Ficticios</td></tr>
            <tr><td><b>Testing / QA</b></td><td>Testers y pruebas automatizadas; valida funcionalidad</td><td>De prueba controlados</td></tr>
            <tr><td><b>Staging / UAT</b></td><td>Usuarios clave y QA final; <b>réplica fiel de producción</b></td><td><b>Anonimizados</b></td></tr>
            <tr><td><b>Producción</b></td><td>Usuarios reales; monitoreado <b>24×7</b></td><td>Reales</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Paridad entre ambientes:</b> cuanto más se parezca Staging a Producción (versiones, configuración,
          infraestructura), <b>menos sorpresas</b> en el despliegue.</p>
          <p><b>Nunca copiar datos reales de producción a ambientes inferiores sin anonimizarlos</b> (Ley 25.326 de
          Protección de Datos Personales).</p>
        </div>

        <h2>Infraestructura mutable vs. inmutable</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Mutable — “mascotas” (pets)</h3>
            <ul>
              <li>Servidores <b>únicos, con nombre propio</b>, que se actualizan “en caliente” (SSH, parches manuales).</li>
              <li>Con el tiempo cada uno difiere del resto (<b>configuration drift</b>): servidores <b>“copo de nieve”</b>.</li>
              <li>Si uno se rompe, hay que <b>“curarlo”</b>.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Inmutable — “ganado” (cattle)</h3>
            <ul>
              <li><b>Nunca se modifica un servidor:</b> se construye una <b>imagen nueva</b> y <b>se reemplaza</b>.</li>
              <li>Todas las instancias son <b>idénticas y reproducibles</b>.</li>
              <li><b>Rollback = volver a desplegar la imagen anterior.</b></li>
            </ul>
          </div>
        </div>
        <p><b>Infraestructura como Código (IaC):</b> la infraestructura se <b>describe en archivos que se versionan,
        revisan y despliegan como el software</b>. Ambientes reproducibles en minutos; cambios <b>auditables</b> en el
        repositorio. Herramientas: <b>Terraform</b>/OpenTofu, CloudFormation, Pulumi, Ansible.</p>

        <h2>CI/CD</h2>
        <p>Commit → <b>Build</b> → <b>Tests</b> → <b>Artefacto</b> → Staging → Aprobación → Producción</p>
        <ul>
          <li><b>CI (Integración Continua):</b> cada cambio se integra al repositorio principal <b>varias veces por día</b> y se valida automáticamente (build + tests).</li>
          <li><b>El artefacto</b> (ej. una imagen de contenedor) <b>se construye una sola vez</b> y es <b>el mismo que recorre todos los ambientes</b>.</li>
          <li><b>Entrega Continua</b> (Continuous Delivery): listo para producción, <b>con aprobación manual</b>.</li>
          <li><b>Despliegue Continuo</b> (Continuous Deployment): <b>sin intervención manual</b>.</li>
          <li>“La diferencia entre Delivery y Deployment es una <b>decisión de negocio</b>: ¿quién aprieta el botón de producción?”</li>
        </ul>
        <p class="mini">GitHub Actions, GitLab CI, Jenkins, Azure DevOps.</p>

        <h2>Disponibilidad: SLI, SLO y SLA ⭐</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Sigla</th><th>Qué es</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>SLI</b> — Indicador</td><td>La <b>medición real</b></td><td>% de requests exitosas en los últimos 30 días</td></tr>
            <tr><td><b>SLO</b> — Objetivo</td><td>La <b>meta interna</b></td><td>99,9% de requests exitosas con latencia &lt; 300 ms</td></tr>
            <tr><td><b>SLA</b> — Acuerdo</td><td>El <b>compromiso contractual</b> con el cliente, <b>con penalidades</b></td><td>99,5% o se bonifica el 10% del abono</td></tr>
          </tbody>
        </table></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Disponibilidad</th><th>Caída por año</th><th>Caída por mes</th></tr></thead>
          <tbody>
            <tr><td>99%</td><td>3,65 días</td><td>7,3 horas</td></tr>
            <tr><td><b>99,9% (“tres nueves”)</b></td><td>8,76 horas</td><td>43,8 minutos</td></tr>
            <tr><td>99,95%</td><td>4,38 horas</td><td>21,9 minutos</td></tr>
            <tr><td>99,99%</td><td>52,6 minutos</td><td>4,4 minutos</td></tr>
            <tr><td>99,999% (“cinco nueves”)</td><td>5,26 minutos</td><td>26,3 segundos</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Disponibilidad compuesta:</b> dos componentes <b>en serie</b> de 99,9% cada uno dan
          99,9% × 99,9% ≈ <b>99,8%</b>. <b>Cada dependencia resta</b>; cada nueve adicional <b>multiplica costo y
          complejidad</b>.</p>
          <p class="mini">Es el mismo cálculo que el de PedidosYa: 0,99³ ≈ 97%. Citarlo cuando justifiques <b>por qué
          agregar un salto de red no es gratis</b>.</p>
        </div>

        <h2>Continuidad del negocio: RPO y RTO</h2>
        <div class="grid-2">
          <div class="card">
            <h3>RPO — Recovery Point Objective</h3>
            <p><b>¿Cuántos datos (medidos en tiempo) podemos tolerar perder?</b></p>
            <p>RPO de 24 h → alcanza un <b>backup diario</b>. RPO ≈ 0 → <b>replicación sincrónica</b>.</p>
          </div>
          <div class="card">
            <h3>RTO — Recovery Time Objective</h3>
            <p><b>¿Cuánto tiempo puede estar el sistema fuera de servicio?</b></p>
            <p>RTO de 4 h → restaurar en otro sitio es viable. RTO de minutos → se necesita un <b>sitio alternativo ya
            encendido</b>.</p>
          </div>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia de DR</th><th>Qué es</th><th>RPO</th><th>RTO</th><th>Costo</th></tr></thead>
          <tbody>
            <tr><td><b>Backup &amp; Restore</b></td><td>Sólo copias de seguridad en otro sitio; ante un desastre se reconstruye todo</td><td>Horas</td><td>Horas a días</td><td>$</td></tr>
            <tr><td><b>Pilot Light</b></td><td>Datos replicados y una infraestructura mínima “encendida”; el resto se levanta al necesitarlo</td><td>Minutos</td><td>Decenas de minutos</td><td>$$</td></tr>
            <tr><td><b>Warm Standby</b></td><td>Copia <b>reducida pero funcional</b>, lista para escalar y recibir tráfico</td><td>Segundos a minutos</td><td>Minutos</td><td>$$$</td></tr>
            <tr><td><b>Activo-Activo</b></td><td>Dos o más sitios atendiendo <b>tráfico real en simultáneo</b></td><td>≈ 0</td><td>≈ 0</td><td>$$$$</td></tr>
          </tbody>
        </table></div>
        <p class="mini">“La estrategia se elige según el <b>impacto del negocio</b>: <b>no todos los sistemas necesitan
        Activo-Activo</b>.”</p>

        <h2>Estrategias de despliegue</h2>
        <div class="callout key">
          <div class="callout-title">🔑 Deploy ≠ Release</div>
          <p><b>Deploy (despliegue):</b> decisión <b>técnica</b> — instalar una nueva versión en un ambiente. <b>Puede
          ocurrir sin que ningún usuario lo note.</b></p>
          <p><b>Release (lanzamiento):</b> decisión de <b>negocio</b> — habilitar una funcionalidad para los usuarios.
          Puede ser gradual, por segmento o en una fecha de marketing.</p>
          <p>Toda estrategia balancea <b>4 dimensiones</b>: <b>downtime</b>, <b>radio de impacto</b>, <b>costo de
          infraestructura</b> y <b>velocidad de rollback</b>.</p>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia</th><th>Cómo funciona</th><th>Downtime</th><th>Rollback</th><th>Costo infra</th></tr></thead>
          <tbody>
            <tr><td><b>Recreate</b> (Big Bang)</td><td>Se <b>detienen todas</b> las instancias y luego se levanta la nueva versión. Nunca conviven dos versiones → sin problemas de compatibilidad.</td><td><b>Sí, garantizado</b></td><td>Lento (otro redeploy)</td><td>Bajo</td></tr>
            <tr><td><b>Rolling Update</b></td><td>Se reemplazan las instancias <b>progresivamente</b>, de a una o por lotes, detrás del balanceador. <b>Conviven v1 y v2</b>: API y base <b>deben ser compatibles con ambas</b>. Es la estrategia <b>por defecto de Kubernetes</b>.</td><td>No</td><td>Lento (rolling hacia atrás)</td><td>Bajo</td></tr>
            <tr><td><b>Blue / Green</b></td><td><b>Dos ambientes idénticos:</b> Blue atiende usuarios, en Green se despliega y prueba. El cambio es <b>instantáneo</b> (se redirige el tráfico en el LB o el DNS).</td><td>No</td><td><b>Inmediato</b> (volver a Blue)</td><td><b>Alto</b> (duplicar infra)</td></tr>
            <tr><td><b>Canary Release</b></td><td>La nueva versión se expone <b>gradualmente a un subconjunto real</b> de usuarios (1% → 5% → 25% → 50% → 100%), <b>avanzando según métricas</b>. <b>Limita el radio de impacto</b>.</td><td>No</td><td>Rápido (volver al 0%)</td><td>Medio</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Detalles que suman:</b> en Blue/Green <b>la base de datos suele ser compartida</b> (las migraciones deben
          ser compatibles) y <b>las sesiones en curso deben sobrevivir al switch</b>. Canary <b>requiere observabilidad y
          enrutamiento fino</b> (LB L7, service mesh o feature flags). Recreate es útil cuando <b>dos versiones no pueden
          convivir</b> (un cambio de esquema incompatible) o hay ventana de mantenimiento.</p>
          <p class="mini">El nombre “canary” viene de los canarios que los mineros llevaban como <b>alarma temprana</b> de
          gases tóxicos.</p>
        </div>

        <h3>Canary, A/B Testing y Shadow no son lo mismo</h3>
        <div class="grid-3">
          <div class="card">
            <h3>Canary</h3>
            <p><b>Objetivo técnico:</b> validar que la nueva versión es <b>estable</b>. Se mide: errores, latencia, consumo
            de recursos. Resultado: avanzar o volver atrás.</p>
          </div>
          <div class="card">
            <h3>A/B Testing</h3>
            <p><b>Objetivo de negocio:</b> ¿qué variante <b>funciona mejor</b>? Ambas versiones son <b>estables</b> y
            conviven un tiempo. Se mide: conversión, clics, ventas, con <b>significancia estadística</b>.</p>
          </div>
          <div class="card">
            <h3>Shadow (Dark Launch)</h3>
            <p>La nueva versión recibe una <b>copia del tráfico real</b>, pero <b>su respuesta se descarta</b>. Ideal para
            probar performance con carga real. <b>⚠️ Cuidado con los efectos secundarios: ¡no cobrar ni enviar mails dos
            veces!</b></p>
          </div>
        </div>

        <h3>Feature Flags (Feature Toggles)</h3>
        ${APP.code(`if (featureFlags.isEnabled("nuevo-checkout", usuario)) {
    return nuevoCheckout(carrito);
}
return checkoutActual(carrito);`, { collapse: false, label: "El código nuevo se despliega “apagado”" })}
        <ul>
          <li><b>Separan deploy de release:</b> se despliega cuando está listo; <b>se activa cuando el negocio lo decide, sin redeploy</b>.</li>
          <li>Activación gradual por <b>% de usuarios, segmento, país o tipo de cliente</b>.</li>
          <li><b>Kill switch:</b> apagar una funcionalidad problemática <b>en segundos</b>.</li>
          <li>Habilitan el trabajo sobre una <b>rama principal única</b> (trunk-based development).</li>
          <li><b>⚠️ Riesgo:</b> <b>deuda técnica</b> si los flags viejos no se eliminan.</li>
        </ul>
        <p class="mini">LaunchDarkly, Unleash, Flagsmith, AWS AppConfig.</p>

        <h2>Ejercicio</h2>
        <div id="p2infQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2infQuiz"), [
        { n: 1, topic: "Contenedores", type: "mc", q: "La diferencia esencial entre VM y contenedor es…", options: [
          { t: "La VM incluye un SO completo; el contenedor comparte el kernel del anfitrión", ok: true },
          { t: "El contenedor no se puede usar en producción", ok: false },
          { t: "Son lo mismo con distinto nombre", ok: false },
        ], explain: "De ahí que el contenedor pese MBs y arranque en segundos, con mayor densidad por servidor. En la nube suelen correr sobre VMs." },
        { n: 2, topic: "SLA", type: "mc", q: "Dos componentes en serie, cada uno con 99,9% de disponibilidad. ¿Disponibilidad del conjunto?", options: [
          { t: "≈ 99,8% — cada dependencia resta", ok: true },
          { t: "99,9% — se mantiene", ok: false },
          { t: "99,95% — mejora por redundancia", ok: false },
        ], explain: "0,999 × 0,999 ≈ 0,998. En serie se multiplican; la redundancia (en paralelo) es la que mejora." },
        { n: 3, topic: "RPO/RTO", type: "mc", q: "El negocio tolera perder como máximo 5 minutos de datos y estar 10 minutos sin servicio. ¿Qué estrategia?", options: [
          { t: "Warm Standby (RPO segundos-minutos, RTO minutos)", ok: true },
          { t: "Backup & Restore", ok: false },
          { t: "Pilot Light", ok: false },
        ], explain: "Backup & Restore da RPO de horas y RTO de horas/días; Pilot Light, RTO de decenas de minutos. Para RPO≈0 y RTO≈0 haría falta Activo-Activo." },
        { n: 4, topic: "Despliegue", type: "mc", q: "Necesitás rollback <b>inmediato</b> y podés pagar infraestructura duplicada:", options: [
          { t: "Blue / Green", ok: true },
          { t: "Rolling Update", ok: false },
          { t: "Recreate", ok: false },
        ], explain: "Blue/Green: el switch y el rollback son instantáneos (se redirige el tráfico), al costo de duplicar la infraestructura durante el despliegue." },
        { n: 5, topic: "Despliegue", type: "vf", q: "Durante un rolling update conviven dos versiones, por lo que la API y la base deben ser compatibles con ambas.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Es su principal condición. Si dos versiones no pueden convivir (cambio de esquema incompatible), corresponde Recreate con ventana de mantenimiento." },
        { n: 6, topic: "Conceptos", type: "open", q: "¿Por qué “deploy ≠ release” y qué herramienta los separa?", answer: "El deploy es una decisión técnica —instalar una versión nueva en un ambiente— y puede ocurrir sin que ningún usuario lo note. El release es una decisión de negocio: habilitar la funcionalidad para los usuarios, quizá de forma gradual o en una fecha de marketing. Los FEATURE FLAGS los separan: el código se despliega 'apagado' y se activa cuando el negocio lo decide, sin necesidad de un nuevo deploy, con activación por porcentaje de usuarios o segmento y un kill switch para apagarlo en segundos si algo sale mal. El riesgo es la deuda técnica si los flags viejos no se eliminan." },
      ]);
    },
  });
})();
