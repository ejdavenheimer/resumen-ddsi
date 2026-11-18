/* ============================================================
   P2 · Nube vs On-Premise
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-nube",
    title: "Nube vs On-Premise",
    tag: "☁️",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "IaaS/PaaS/FaaS/SaaS, regiones y AZ, Tiers, CAPEX/OPEX, cloud-native",
    keywords: ["nube", "cloud", "on premise", "housing", "colocation", "nube privada", "hibrida", "multicloud", "iaas", "paas", "faas", "serverless", "saas", "responsabilidad compartida", "region", "zona de disponibilidad", "tier", "uptime", "capex", "opex", "tco", "egress", "lock-in", "cloud native", "twelve factor"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Nube vs. On-Premise</h1>
          <p class="lead">“No es una elección binaria: es un <b>espectro</b> que va de máximo control (y máxima responsabilidad) a mínima gestión.” El ejercicio típico te da 4 casos y hay que justificar con <b>atributos de calidad y restricciones</b>.</p>
        </div>

        <h2>Modelos de despliegue: ¿dónde corre el sistema?</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Modelo</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>On-Premise</b></td><td>Infraestructura propia, en instalaciones propias. La organización <b>gestiona absolutamente todo</b>.</td></tr>
            <tr><td><b>Housing / Colocation</b></td><td><b>Servidores propios alojados en un datacenter de terceros</b>, que aporta espacio, energía, clima y conectividad.</td></tr>
            <tr><td><b>Nube Pública</b></td><td>Recursos de un proveedor (AWS, Azure, GCP, OCI) <b>compartidos, bajo demanda y con pago por uso</b>.</td></tr>
            <tr><td><b>Nube Privada</b></td><td>Plataforma cloud <b>dedicada a una sola organización</b>, propia u operada por terceros (OpenStack, VMware).</td></tr>
            <tr><td><b>Nube Híbrida</b></td><td>Combina on-premise o nube privada <b>con nube pública</b>, integradas entre sí.</td></tr>
            <tr><td><b>Multicloud</b></td><td><b>Más de un proveedor</b> de nube pública, para evitar dependencia o aprovechar servicios específicos.</td></tr>
          </tbody>
        </table></div>

        <h2>Modelos de servicio: IaaS, PaaS, FaaS y SaaS</h2>
        <p>Lo que gestiona la organización se va reduciendo de izquierda a derecha (el stack es: Red, Almacenamiento,
        Servidores, Virtualización, SO, Middleware, Runtime, Escalado, Aplicación/Funciones, Datos):</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Modelo</th><th>Gestionás vos</th><th>Gestiona el proveedor</th><th>Ejemplos</th></tr></thead>
          <tbody>
            <tr><td><b>On-Premise</b></td><td><b>Todo</b></td><td>Nada</td><td>Datacenter propio</td></tr>
            <tr><td><b>IaaS</b></td><td>SO, middleware, runtime, escalado, app y datos</td><td>Red, almacenamiento, servidores, virtualización</td><td>AWS EC2, Azure VMs, GCE</td></tr>
            <tr><td><b>PaaS</b></td><td>App y datos</td><td>Hasta el runtime y el escalado</td><td>App Service, App Engine, Heroku</td></tr>
            <tr><td><b>FaaS</b> (Serverless)</td><td>La <b>función</b> y los datos</td><td>Todo lo demás; <b>cobra por ejecución</b></td><td>AWS Lambda, Azure Functions</td></tr>
            <tr><td><b>SaaS</b></td><td>Sólo tus <b>datos</b> y su configuración</td><td>Absolutamente todo lo demás</td><td>Microsoft 365, Salesforce, Gmail</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>La analogía de la pizza</b> (sirve para explicarlo en dos renglones): <b>hecha en casa</b> = On-Premise ·
          <b>para hornear</b> = IaaS · <b>delivery</b> = PaaS · <b>en el restaurante</b> = SaaS. Lo que cambia es cuánto
          pone el proveedor: mesa y bebidas, cocción, horno, gas, masa e ingredientes.</p>
        </div>

        <h2>Modelo de responsabilidad compartida</h2>
        <div class="callout key">
          <ul>
            <li>La seguridad en la nube es <b>compartida</b>: el <b>proveedor protege la infraestructura</b> (“seguridad
            <b>DE</b> la nube”: datacenters físicos, hardware y red física, hipervisor, servicios administrados); el
            <b>cliente, todo lo que construye y configura sobre ella</b> (“seguridad <b>EN</b> la nube”: datos y su
            clasificación, identidades y permisos (IAM), configuración de servicios, aplicación y dependencias, cifrado y
            claves, y el SO y la red virtual <b>en IaaS</b>).</li>
            <li><b>La frontera se mueve según el modelo:</b> en IaaS el cliente parchea el sistema operativo; en PaaS y
            SaaS, no.</li>
            <li><b>Contratar nube NO transfiere la responsabilidad</b> sobre los datos ni sobre los accesos.</li>
          </ul>
          <p><b>Dato para citar:</b> “la mayoría de los incidentes en la nube nacen de <b>configuraciones incorrectas del
          cliente</b> (ej. un bucket de almacenamiento público), <b>no de fallas del proveedor</b>”.</p>
        </div>

        <h2>Ventajas de la nube</h2>
        <div class="grid-3">
          <div class="card"><h3>Elasticidad</h3><p>Escalar hacia arriba <b>y hacia abajo</b> según la demanda, <b>en minutos</b> (ej. Hot Sale).</p></div>
          <div class="card"><h3>Pago por uso (OPEX)</h3><p><b>Sin inversión inicial</b> en hardware: se paga lo que se consume.</p></div>
          <div class="card"><h3>Alcance global</h3><p>Regiones y zonas de disponibilidad en todo el mundo, <b>cerca de los usuarios</b>.</p></div>
          <div class="card"><h3>Servicios administrados</h3><p>Bases, colas, IA y monitoreo <b>listos para usar</b>, sin operarlos.</p></div>
          <div class="card"><h3>Time-to-market</h3><p>Un ambiente nuevo <b>en minutos</b>, no en semanas de compras e instalación.</p></div>
          <div class="card"><h3>Alta disponibilidad</h3><p><b>Redundancia entre zonas y regiones</b> como capacidad nativa de la plataforma.</p></div>
        </div>

        <h3>Regiones y Zonas de Disponibilidad</h3>
        <ul>
          <li><b>Región:</b> área geográfica que agrupa <b>varias zonas</b> (ej. <code>sa-east-1</code> · San Pablo).</li>
          <li><b>Zona de Disponibilidad (AZ):</b> uno o más <b>datacenters con energía, red y refrigeración
          independientes</b>, conectados con <b>baja latencia</b>.</li>
          <li>Desplegar en <b>2 o más zonas</b> protege ante la caída de un <b>datacenter completo</b>.</li>
          <li>Desplegar en <b>más de una región</b> protege ante <b>desastres regionales</b> — a mayor costo y complejidad.</li>
        </ul>
        ${APP.uml(`graph TB
    LB["⚖️ Balanceador"] --> A1["Zona A · Instancia"]
    LB --> B1["Zona B · Instancia"]
    LB --> C1["Zona C · disponible para crecer<br/>o tolerar la caída de otra zona"]
    A1 --> DBP[("BD primaria<br/>Zona A")]
    B1 --> DBP
    DBP -.->|"réplica"| DBR[("BD réplica<br/>Zona B")]
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Región con 3 zonas de disponibilidad")}

        <h2>Ventajas del On-Premise</h2>
        <div class="grid-3">
          <div class="card"><h3>Control total</h3><p>Hardware, configuración, versiones y <b>ventanas de mantenimiento</b> bajo decisión propia.</p></div>
          <div class="card"><h3>Soberanía y regulación</h3><p>Datos <b>dentro del país</b> y bajo custodia propia (<b>Ley 25.326</b> de Protección de Datos Personales, requisitos del <b>BCRA</b>, organismos públicos).</p></div>
          <div class="card"><h3>Latencia local</h3><p>Sistemas que <b>controlan procesos físicos</b> (plantas industriales, SCADA) <b>no pueden depender de Internet</b>.</p></div>
          <div class="card"><h3>Costo predecible</h3><p>Con carga <b>alta y estable</b>, el hardware amortizado puede ser más barato que pagar por uso.</p></div>
          <div class="card"><h3>Independencia de Internet</h3><p>El sistema sigue operando <b>aunque se corte el enlace externo</b>.</p></div>
          <div class="card"><h3>Legacy y hardware específico</h3><p>Mainframes, equipamiento médico o industrial, licencias atadas a hardware.</p></div>
        </div>

        <h3>On-Premise: consideraciones físicas (el detalle que nadie menciona)</h3>
        <div class="grid-2">
          <div class="card">
            <ul>
              <li><b>Espacio físico:</b> sala dedicada, <b>racks (42U)</b>, piso técnico, <b>resistencia de la losa</b> al peso y lugar para crecer.</li>
              <li><b>Energía:</b> <b>UPS</b>, <b>grupo electrógeno</b> con combustible, doble acometida eléctrica, tableros y PDUs redundantes.</li>
              <li><b>Climatización:</b> equipos de precisión (<b>CRAC</b>), <b>pasillo frío / caliente</b>, redundancia <b>N+1</b>. El consumo del clima <b>puede igualar al de los propios servidores</b>.</li>
            </ul>
          </div>
          <div class="card">
            <ul>
              <li><b>Seguridad física:</b> acceso biométrico, CCTV, registro de visitas.</li>
              <li><b>Protección contra incendios:</b> detección temprana y extinción con <b>agente limpio o gas inerte (nunca agua)</b>.</li>
              <li><b>Conectividad redundante:</b> dos proveedores, por <b>caminos físicos distintos</b>.</li>
              <li><b>Personal 24×7</b>; <b>ciclo de vida del hardware</b> (renovación cada 3 a 5 años); <b>compras e importación</b> (puede llevar meses).</li>
              <li>Sin olvidar: <b>licenciamiento</b>, <b>backups fuera del sitio</b> y un <b>plan de recuperación ante desastres</b> con sitio alternativo.</li>
            </ul>
          </div>
        </div>

        <h3>Niveles Tier de un datacenter (Uptime Institute)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tier</th><th>Característica principal</th><th>Disponibilidad</th><th>Caída anual aprox.</th></tr></thead>
          <tbody>
            <tr><td><b>I — Básico</b></td><td>Sin redundancia: un único camino de energía y refrigeración</td><td>99,671%</td><td>28,8 horas</td></tr>
            <tr><td><b>II — Componentes redundantes</b></td><td>Componentes redundantes (N+1), un único camino de distribución</td><td>99,741%</td><td>22 horas</td></tr>
            <tr><td><b>III — Mantenible concurrentemente</b></td><td>Múltiples caminos: <b>cualquier componente puede mantenerse sin cortar el servicio</b></td><td>99,982%</td><td>1,6 horas</td></tr>
            <tr><td><b>IV — Tolerante a fallas</b></td><td><b>Todo duplicado y aislado:</b> tolera una falla sin impacto</td><td>99,995%</td><td>26,3 minutos</td></tr>
          </tbody>
        </table></div>
        <p class="mini">“Construir y operar un datacenter Tier III o IV propio es una inversión que <b>pocas organizaciones
        pueden justificar</b>: de ahí el auge del <b>housing</b> y de la <b>nube</b>.”</p>

        <h2>Nube: consideraciones y riesgos</h2>
        <div class="grid-3">
          <div class="card"><h3>Costos variables</h3><p>Sin control, la factura crece. Requiere disciplina <b>FinOps</b>: presupuestos, alertas, <b>apagar lo ocioso</b>.</p></div>
          <div class="card"><h3>Costo de egress</h3><p><b>Sacar datos</b> de la nube (tráfico saliente) <b>se cobra</b> y puede ser significativo.</p></div>
          <div class="card"><h3>Vendor lock-in</h3><p>Usar servicios <b>propietarios</b> dificulta migrar a otro proveedor.</p></div>
          <div class="card"><h3>Ubicación de los datos</h3><p>¿<b>En qué país</b> quedan almacenados? Impacto <b>regulatorio y contractual</b>.</p></div>
          <div class="card"><h3>Dependencia de conectividad</h3><p><b>Sin enlace a Internet, no hay sistema.</b></p></div>
          <div class="card"><h3>Nuevas competencias</h3><p>Seguridad, redes y costos en la nube requieren <b>perfiles específicos</b>.</p></div>
        </div>

        <h2>CAPEX vs. OPEX</h2>
        <ul>
          <li><b>CAPEX:</b> inversión de capital inicial (hardware, sala, licencias) que se <b>amortiza</b>; nueva inversión al renovar equipos.</li>
          <li><b>OPEX:</b> gasto operativo <b>recurrente</b>, proporcional al uso.</li>
          <li>Con carga <b>variable o incierta</b>, <b>la nube suele ganar</b>. Con carga <b>alta, estable y predecible</b>, on-premise <b>puede resultar más económico a largo plazo</b>.</li>
          <li><b>Comparar siempre el TCO</b> (costo total de propiedad): personal, energía, clima, renovación y licencias, <b>no sólo el precio del servidor</b>.</li>
        </ul>

        <h2>Diseño Cloud-Native: qué cambia</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Principio</th><th>Qué significa</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Servicios descompuestos</td><td>Servicios menores comunicados por APIs, eventos o mensajería asincrónica</td></tr>
            <tr><td>2</td><td>Escalado horizontal</td><td>Se agregan <b>instancias</b> según la demanda, no máquinas más grandes</td></tr>
            <tr><td>3</td><td>Estado distribuido</td><td>Sesión y datos <b>externalizados</b>: las instancias son <b>descartables</b></td></tr>
            <tr><td>4</td><td>Procesamiento asincrónico</td><td>Operaciones en paralelo mediante colas y eventos</td></tr>
            <tr><td>5</td><td><b>Diseño para la falla</b></td><td><b>Asumir que todo falla:</b> reintentos, timeouts, circuit breakers</td></tr>
            <tr><td>6</td><td>Despliegues automatizados</td><td>Pipelines repetibles y predecibles (CI/CD, IaC)</td></tr>
            <tr><td>7</td><td>Observabilidad</td><td>Logs, métricas y trazas para entender un sistema distribuido</td></tr>
            <tr><td>8</td><td>Infraestructura inmutable</td><td><b>No se “parchea” un servidor: se reemplaza</b> por uno nuevo</td></tr>
          </tbody>
        </table></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Aspecto</th><th>Tradicional (On-Premise)</th><th>Cloud-Native</th></tr></thead>
          <tbody>
            <tr><td>Arquitectura</td><td>Monolítica</td><td>Descompuesta en servicios</td></tr>
            <tr><td>Escalabilidad</td><td>Vertical, planificada para un pico previsible</td><td><b>Horizontal y elástica</b></td></tr>
            <tr><td>Persistencia</td><td>Una base relacional</td><td><b>Persistencia políglota</b> (relacional, documentos, caché, colas)</td></tr>
            <tr><td>Procesamiento</td><td>Sincrónico</td><td>Asincrónico (colas, eventos)</td></tr>
            <tr><td>Fallas</td><td>Diseñado para <b>evitarlas</b></td><td>Diseñado para <b>tolerarlas</b></td></tr>
            <tr><td>Releases</td><td>Grandes y ocasionales</td><td>Pequeños y frecuentes</td></tr>
            <tr><td>Infraestructura</td><td>Administración manual; servidores “mutables”</td><td>Automatizada (IaC); <b>inmutable</b></td></tr>
          </tbody>
        </table></div>
        <p class="mini"><b>The Twelve-Factor App:</b> doce prácticas para construir aplicaciones aptas para la nube —
        configuración en el entorno, <b>procesos stateless</b>, logs como flujo de eventos, <b>paridad entre
        ambientes</b>, entre otras.</p>

        <h2>Ejercicio resuelto (el de la clase)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Caso</th><th>Propuesta</th><th>Justificación</th></tr></thead>
          <tbody>
            <tr><td><b>Fintech que recién arranca</b> (6 personas, crecimiento incierto, salir en 3 meses)</td><td><b>Nube pública</b> (PaaS/serverless)</td><td><b>Time-to-market</b> y <b>elasticidad</b> con crecimiento incierto; sin CAPEX inicial ni capacidad operativa para un datacenter; servicios administrados suplen la falta de perfiles de infraestructura</td></tr>
            <tr><td><b>Hospital público</b> (historia clínica, datos sensibles, presupuesto fijo, conectividad irregular)</td><td><b>Híbrida</b> (core on-premise + nube para analítica/backup)</td><td><b>Soberanía y regulación</b> (Ley 25.326) y <b>disponibilidad sin depender de Internet</b> en las sedes con mala conectividad; presupuesto fijo encaja con CAPEX; la nube aporta backup fuera del sitio y analítica</td></tr>
            <tr><td><b>Planta industrial</b> (sensores en tiempo real, cortes frecuentes de Internet, se quiere analítica histórica)</td><td><b>Híbrida / Edge</b>: control on-premise, analítica en la nube</td><td>El control de procesos físicos exige <b>latencia local</b> e <b>independencia de Internet</b>; la analítica histórica no es crítica en tiempo real y gana con la <b>elasticidad</b> y el almacenamiento barato de la nube</td></tr>
            <tr><td><b>E-commerce en Hot Sale</b> (3 días x20 de tráfico, el resto estable)</td><td><b>Nube pública</b> con autoescalado (o híbrida con <i>cloud bursting</i>)</td><td><b>Elasticidad</b>: dimensionar on-premise para el pico implicaría pagar 362 días de capacidad ociosa; <b>pago por uso</b> + <b>CDN y colas</b> para absorber el pico</td></tr>
          </tbody>
        </table></div>

        <h2>Ejercicio</h2>
        <div id="p2nuQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2nuQuiz"), [
        { n: 1, topic: "Modelos", type: "mc", q: "En <b>PaaS</b>, ¿quién parchea el sistema operativo?", options: [
          { t: "El proveedor", ok: true },
          { t: "El cliente", ok: false },
          { t: "Nadie: no hay SO", ok: false },
        ], explain: "En IaaS lo parchea el cliente; en PaaS y SaaS, el proveedor. Es el ejemplo típico de cómo se mueve la frontera de responsabilidad." },
        { n: 2, topic: "Responsabilidad", type: "vf", q: "Contratar nube transfiere al proveedor la responsabilidad sobre los datos y los accesos.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Modelo de responsabilidad compartida: el proveedor protege la infraestructura (seguridad DE la nube); el cliente, los datos, identidades, configuración y aplicación (seguridad EN la nube)." },
        { n: 3, topic: "Disponibilidad", type: "mc", q: "Desplegar en 2 zonas de disponibilidad protege ante…", options: [
          { t: "La caída de un datacenter completo (energía, red y refrigeración independientes)", ok: true },
          { t: "Un desastre regional", ok: false },
          { t: "Un error de la aplicación", ok: false },
        ], explain: "Para desastres regionales hace falta multi-región, a mayor costo y complejidad." },
        { n: 4, topic: "Costos", type: "mc", q: "Carga alta, estable y predecible durante años. ¿Qué puede convenir?", options: [
          { t: "On-premise: con hardware amortizado el CAPEX puede ser más barato que el pago por uso (comparando TCO)", ok: true },
          { t: "Siempre la nube: es más barata en todos los casos", ok: false },
          { t: "Serverless", ok: false },
        ], explain: "Con carga variable o incierta gana la nube; con carga alta y estable, on-premise puede ganar a largo plazo. Siempre comparando TCO: personal, energía, clima, renovación y licencias." },
        { n: 5, topic: "Cloud-native", type: "open", q: "¿Qué significa “infraestructura inmutable” y por qué importa?", answer: "Que nunca se modifica un servidor en funcionamiento: para cambiar algo se construye una imagen nueva y se reemplaza la instancia. Importa porque evita el configuration drift (servidores 'copo de nieve' que, parcheados a mano por SSH, terminan todos distintos entre sí y son irreproducibles). Con infraestructura inmutable todas las instancias son idénticas y reproducibles, el rollback es simplemente volver a desplegar la imagen anterior, y el modelo mental pasa de 'mascotas' (servidores con nombre propio que hay que curar) a 'ganado' (instancias descartables). Se apoya en Infraestructura como Código (Terraform, CloudFormation) para que los ambientes se levanten en minutos y los cambios queden versionados y auditables." },
      ]);
    },
  });
})();
