/* ============================================================
   P2 · Arquitecturas Distribuidas y SOA
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-soa",
    title: "Distribuidas y SOA (ESB)",
    tag: "🏛️",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Falacias de la computación distribuida, SOA, ESB, orquestación vs coreografía",
    keywords: ["soa", "arquitectura orientada a servicios", "esb", "enterprise service bus", "falacias", "computacion distribuida", "wsdl", "uddi", "soap", "orquestacion", "coreografia", "conway", "servicios de entidad", "utilitarios", "compensacion"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Arquitecturas Distribuidas y SOA</h1>
          <p class="lead">SOA es “ante todo una <b>estrategia de integración y reutilización a nivel empresa</b>, no una forma de dividir una aplicación”. Esa frase es la diferencia con microservicios.</p>
        </div>

        <h2>¿Qué es una arquitectura distribuida?</h2>
        <p>“Se compone de <b>múltiples componentes de software o servicios que se ejecutan en diferentes nodos</b> y se
        comunican <b>a través de la red</b>, cooperando para ofrecer una funcionalidad unificada.”</p>
        <div class="grid-2">
          <div class="card">
            <h3>Drivers de calidad (por qué distribuir)</h3>
            <ul>
              <li><b>Escalabilidad:</b> agregar nodos para soportar mayor carga, incluso <b>selectivamente por componente</b>.</li>
              <li><b>Disponibilidad:</b> tolerar <b>fallas parciales</b> sin interrumpir el servicio completo.</li>
              <li><b>Flexibilidad / Mantenibilidad:</b> actualizar y desplegar partes de forma independiente.</li>
              <li><b>Interoperabilidad:</b> integrar sistemas construidos con tecnologías distintas.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Desafíos</h3>
            <ul>
              <li><b>Comunicación y sincronización:</b> la red falla, tarda y se satura.</li>
              <li><b>Consistencia de datos:</b> ya no hay una única transacción ACID que lo abarque todo.</li>
              <li><b>Seguridad:</b> autenticación y autorización <b>entre componentes</b>, no sólo en el borde.</li>
              <li><b>Operación:</b> más piezas para desplegar, monitorear y diagnosticar.</li>
            </ul>
          </div>
        </div>

        <h2>Las 8 falacias de la computación distribuida</h2>
        <p class="mini">Formuladas por L. Peter Deutsch y colegas en Sun Microsystems (1994-1997). “Todo sistema distribuido
        paga, tarde o temprano, el costo de ignorarlas.”</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Falacia</th><th>La realidad / qué hay que diseñar</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>La red es confiable</td><td><b>Timeouts, reintentos y fallas parciales</b> deben diseñarse desde el inicio</td></tr>
            <tr><td>2</td><td>La latencia es cero</td><td>Cada llamada remota cuesta milisegundos: <b>evitar diálogos “chatty”</b></td></tr>
            <tr><td>3</td><td>El ancho de banda es infinito</td><td>Respuestas grandes saturan la red: <b>paginar, comprimir, filtrar</b></td></tr>
            <tr><td>4</td><td>La red es segura</td><td><b>Cifrar (TLS) y autenticar también el tráfico interno</b></td></tr>
            <tr><td>5</td><td>La topología no cambia</td><td>Las instancias aparecen y desaparecen: se necesita <b>descubrimiento</b></td></tr>
            <tr><td>6</td><td>Hay un solo administrador</td><td>Distintos equipos y proveedores, con configuraciones distintas</td></tr>
            <tr><td>7</td><td>El transporte no tiene costo</td><td>Serializar, cifrar y transferir consume CPU… y dinero (<b>egress</b>)</td></tr>
            <tr><td>8</td><td>La red es homogénea</td><td>Conviven protocolos, formatos y versiones diferentes</td></tr>
          </tbody>
        </table></div>

        <h2>SOA: Arquitectura Orientada a Servicios</h2>
        <div class="callout key">
          <ul>
            <li>Estilo de arquitectura que <b>descompone las capacidades del negocio en unidades autónomas —servicios—</b>
            expuestas mediante <b>contratos estandarizados</b> y consumibles a través de la red.</li>
            <li><b>¿Para qué?</b> Para <b>integrar sistemas heterogéneos</b> (mainframes, ERP, CRM, desarrollos propios) y
            <b>reutilizar</b> esas capacidades desde múltiples aplicaciones y canales.</li>
            <li>Surge a fines de los ’90 y se consolida en los 2000 en organizaciones grandes: bancos, telcos,
            aseguradoras, organismos públicos.</li>
          </ul>
        </div>
        <h3>El problema que resuelve: integración punto a punto</h3>
        <p>Con N sistemas integrados de a pares hay hasta <b>n·(n−1)/2</b> integraciones (6 sistemas → <b>15</b>). Cada
        sistema nuevo <b>multiplica</b> las integraciones y cada cambio puede romper a todos los que lo consumen. SOA
        reemplaza la “telaraña” por <b>contratos compartidos</b>: cada sistema se integra <b>una vez</b>, contra servicios
        estables (6 sistemas → <b>6</b> conexiones).</p>
        ${APP.uml(`graph TB
    subgraph CANALES
    HB["Home Banking"]
    AM["App Mobile"]
    SU["Sucursal"]
    PA["Partners"]
    end
    HB --> ESB; AM --> ESB; SU --> ESB; PA --> ESB
    ESB[["Capa de Servicios + ESB<br/>(contratos)"]]
    ESB --> C["Servicio Clientes"]
    ESB --> U["Servicio Cuentas"]
    ESB --> P["Servicio Pagos"]
    C --> MF["Mainframe COBOL"]
    U --> ERP["ERP"]
    P --> CRM["CRM"]
    style ESB fill:#fffbeb,stroke:#b45309,color:#0f172a`, "SOA: canales → servicios → sistemas existentes")}

        <h3>¿Qué es un servicio?</h3>
        <ul>
          <li>Una unidad de funcionalidad con <b>significado de negocio (no técnico)</b>: “Consultar Saldo”, “Emitir Póliza”.</li>
          <li>Se accede <b>únicamente a través de su contrato</b>: operaciones, mensajes de entrada/salida y <b>políticas</b> (seguridad, SLA).</li>
          <li>Su <b>implementación queda encapsulada</b>: detrás puede haber un programa COBOL en un mainframe o una aplicación moderna.</li>
          <li>Es <b>autónomo</b> y de <b>granularidad gruesa</b>: una invocación resuelve <b>una operación de negocio completa</b>.</li>
        </ul>

        <h3>Los 8 principios de diseño de servicios (Thomas Erl, 2007)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Principio</th><th>Qué dice</th></tr></thead>
          <tbody>
            <tr><td>1 · <b>Contrato estandarizado</b></td><td>Todos los servicios siguen las mismas convenciones de contrato</td></tr>
            <tr><td>2 · <b>Bajo acoplamiento</b></td><td>El contrato no depende de la implementación ni del consumidor</td></tr>
            <tr><td>3 · <b>Abstracción</b></td><td>Se expone sólo lo esencial; se oculta tecnología y lógica interna</td></tr>
            <tr><td>4 · <b>Reutilización</b></td><td>La lógica se diseña <b>agnóstica de un proceso puntual</b></td></tr>
            <tr><td>5 · <b>Autonomía</b></td><td>El servicio controla su entorno de ejecución y sus recursos</td></tr>
            <tr><td>6 · <b>Sin estado</b></td><td>Minimiza el estado retenido entre invocaciones (escalabilidad)</td></tr>
            <tr><td>7 · <b>Descubrimiento</b></td><td>Se describe con metadatos para poder ser encontrado y entendido</td></tr>
            <tr><td>8 · <b>Composición</b></td><td>Puede combinarse con otros para resolver procesos complejos</td></tr>
          </tbody>
        </table></div>
        <p class="mini">Notar la relación directa con los atributos de calidad: <b>mantenibilidad, escalabilidad,
        interoperabilidad</b>.</p>

        <h3>Actores: publicar, descubrir, invocar</h3>
        <ul>
          <li><b>Consumidor:</b> aplicación, módulo u otro servicio que demanda la funcionalidad.</li>
          <li><b>Proveedor:</b> entidad accesible por red que <b>publica su contrato</b>, acepta solicitudes y las ejecuta.</li>
          <li><b>Registro:</b> repositorio de servicios disponibles; permite <b>descubrir</b> contratos y ubicaciones (históricamente <b>UDDI</b>; hoy catálogos o portales de APIs).</li>
        </ul>
        <p>Flujo: el proveedor <b>1) publica</b> su contrato (WSDL) en el registro; el consumidor <b>2) descubre</b> y
        <b>3) invoca</b>.</p>

        <h3>Contratos y tecnologías</h3>
        <div class="grid-2">
          <div class="card">
            <h3>SOAP / WS-*</h3>
            <ul>
              <li>Mensajes <b>XML</b> dentro de un sobre (<i>envelope</i>) SOAP.</li>
              <li>Contrato <b>formal y tipado</b>: <b>WSDL + XSD</b>.</li>
              <li>Estándares: <b>WS-Security</b>, WS-ReliableMessaging, WS-AtomicTransaction.</li>
              <li>Registro: <b>UDDI</b>.</li>
              <li>Aún muy presente en <b>banca, seguros y organismos públicos</b> (ej. ARCA/AFIP).</li>
            </ul>
          </div>
          <div class="card">
            <h3>REST / HTTP</h3>
            <ul>
              <li><b>Recursos</b> sobre HTTP, típicamente con <b>JSON</b>.</li>
              <li>Contrato descripto con <b>OpenAPI (Swagger)</b>.</li>
              <li>Más liviano y simple de consumir desde web y mobile.</li>
              <li>Seguridad con <b>OAuth 2.0 / JWT sobre TLS</b>.</li>
              <li>Registro: catálogos y portales de APIs (API Management).</li>
            </ul>
          </div>
        </div>
        <p class="mini"><b>SOA es un estilo de arquitectura, no una tecnología:</b> puede implementarse con SOAP, con REST
        o con mensajería asincrónica.</p>

        <h2>ESB (Enterprise Service Bus)</h2>
        <p>Componente que <b>gestiona la comunicación</b> entre múltiples servicios y sistemas. Los servicios
        <b>no interactúan directamente</b>: se conectan al bus, que resuelve <b>la ruta, el formato y el protocolo</b> de
        cada mensaje.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Responsabilidad</th><th>Qué hace</th></tr></thead>
          <tbody>
            <tr><td><b>Enrutamiento</b></td><td>Decide a qué servicio enviar cada mensaje, incluso según su contenido</td></tr>
            <tr><td><b>Transformación</b></td><td>Traduce formatos y estructuras: XML ↔ JSON, mapeo entre modelos de datos</td></tr>
            <tr><td><b>Mediación de protocolos</b></td><td>Conecta servicios que hablan HTTP, JMS, MQ, FTP o SMTP sin que se enteren</td></tr>
            <tr><td><b>Virtualización</b></td><td>Ubicación e identidad: los servicios no necesitan conocer dónde está ni quién es el otro</td></tr>
            <tr><td><b>Orquestación</b></td><td>Coordina procesos que combinan varias invocaciones</td></tr>
            <tr><td><b>Seguridad y monitoreo</b></td><td>Centraliza autenticación, auditoría y trazabilidad de los mensajes</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <div class="callout-title">⚠️ Riesgos del ESB</div>
          <ul>
            <li><b>Punto único de falla</b> y potencial <b>cuello de botella</b> de performance.</li>
            <li><b>“Smart pipes”:</b> reglas de negocio que terminan programadas <b>dentro del bus</b>, difíciles de testear y versionar.</li>
            <li><b>Cuello de botella organizacional:</b> un único equipo de integración por el que pasan todos los cambios.</li>
            <li><b>Costo de licencias</b> y alta complejidad de configuración.</li>
          </ul>
          <p class="mini">Implementaciones: MuleSoft, WSO2, Apache Camel/ServiceMix, Spring Integration, IBM App Connect,
          Oracle SOA Suite; en la nube Azure Logic Apps + Service Bus, AWS Step Functions + EventBridge.</p>
        </div>

        <h2>Tipos de servicios en SOA</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Qué hace</th><th>Reutilización</th><th>Ejemplos</th></tr></thead>
          <tbody>
            <tr><td><b>De Tarea / Proceso</b></td><td><b>Orquestan otros servicios</b> para resolver un proceso de negocio concreto</td><td><b>Poco</b> reutilizables, muy específicos</td><td>Alta de Cliente, Otorgar Préstamo, Emitir Póliza</td></tr>
            <tr><td><b>De Entidad</b></td><td>Operaciones sobre una <b>entidad de negocio</b>; <b>agnósticos del proceso</b></td><td><b>Altamente</b> reutilizables</td><td>Cliente, Cuenta, Producto, Póliza</td></tr>
            <tr><td><b>Utilitarios</b></td><td>Capacidades <b>transversales</b>, no ligadas a un dominio específico</td><td>Reutilizables</td><td>Notificaciones, Auditoría, Conversión de Moneda</td></tr>
          </tbody>
        </table></div>
        <p class="mini">Tipos de aplicaciones en SOA: <b>SOA</b> (construida desde el inicio exponiendo sus capacidades como
        servicios), <b>legada</b> (sistema existente que se “envuelve” con un <b>adaptador</b> para exponer un contrato —
        patrón <b>Adapter</b>) y <b>mixta</b>.</p>

        <h2>Orquestación vs. Coreografía ⭐</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Orquestación</th><th>Coreografía</th></tr></thead>
          <tbody>
            <tr><td>Idea</td><td>Un <b>coordinador central</b> invoca a cada servicio en el orden definido</td><td>Cada servicio <b>reacciona a eventos</b> publicados por otros (“ClienteCreado”)</td></tr>
            <tr><td>Control del flujo</td><td><b>Centralizado</b> (orquestador)</td><td><b>Distribuido</b> entre servicios</td></tr>
            <tr><td>Comunicación</td><td>Predominantemente <b>sincrónica</b></td><td>Predominantemente <b>asincrónica</b></td></tr>
            <tr><td>Acoplamiento</td><td><b>Mayor</b> (los servicios quedan acoplados al orquestador)</td><td><b>Bajo</b></td></tr>
            <tr><td>Escalabilidad</td><td>Limitada por el orquestador</td><td><b>Alta</b></td></tr>
            <tr><td>Trazabilidad</td><td><b>Alta:</b> flujo claro, control y manejo de errores centralizados</td><td><b>Baja:</b> flujo distribuido y más difícil de depurar</td></tr>
            <tr><td>Manejo de errores</td><td>Centralizado y predecible</td><td>Distribuido, más complejo</td></tr>
            <tr><td>Típico de</td><td><b>SOA</b> (BPEL, motores BPM, ESB) · Camunda, Airflow</td><td><b>Microservicios</b> y arquitecturas orientadas a eventos · Kafka, RabbitMQ, EventBridge</td></tr>
            <tr><td>Casos de uso</td><td>Flujos de negocio complejos, críticos, regulatorios</td><td>Sistemas altamente distribuidos y dinámicos</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 El detalle de la consistencia</div>
          <p>Caso “Alta de Cliente en una aseguradora”: Validar Identidad → Crear Cliente → Evaluar Riesgo → Emitir Póliza
          → Facturar → Notificar. <b>Si “Emitir Póliza” falla, NO hay rollback automático:</b> se ejecutan <b>acciones
          compensatorias</b> (dar de baja el cliente creado). <b>No existe una transacción ACID que abarque varios
          sistemas.</b> Comparar con el monolito, donde bastaba un commit/rollback en una sola base. Ese es el germen del
          patrón <a class="inline" data-go="p2-microservicios">SAGA</a>.</p>
        </div>

        <h2>Monolito vs SOA vs Microservicios</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Criterio</th><th>Monolito</th><th>SOA</th><th>Microservicios</th></tr></thead>
          <tbody>
            <tr><td>Alcance</td><td>Una aplicación</td><td><b>La organización</b> (múltiples aplicaciones)</td><td>Una <b>aplicación</b> (construir un producto)</td></tr>
            <tr><td>Granularidad</td><td>—</td><td>Servicios de negocio <b>“grandes”</b></td><td>Servicios <b>pequeños y acotados</b></td></tr>
            <tr><td>Unidades de despliegue</td><td>Una</td><td>Muchas: servicios y sistemas existentes</td><td>Muchas, <b>independientes y automatizadas</b></td></tr>
            <tr><td>Comunicación</td><td>Llamadas en memoria</td><td>Mensajes por red vía <b>ESB inteligente</b> (“smart pipes”)</td><td><b>Endpoints inteligentes, canales simples</b> (HTTP, colas)</td></tr>
            <tr><td>Datos</td><td>Una base</td><td>Frecuentemente <b>bases compartidas</b></td><td><b>Una base por servicio</b></td></tr>
            <tr><td>Gobierno</td><td>—</td><td><b>Centralizado:</b> estándares y registro</td><td><b>Descentralizado:</b> cada equipo decide</td></tr>
            <tr><td>Consistencia</td><td><b>ACID local</b></td><td>Compensaciones / consistencia eventual</td><td>Saga / consistencia eventual</td></tr>
            <tr><td>Escalabilidad</td><td>En bloque</td><td>Por servicio</td><td>Por servicio</td></tr>
            <tr><td>Contratos</td><td>—</td><td><b>SOAP/WSDL, WS-*</b></td><td><b>REST, gRPC, eventos</b></td></tr>
            <tr><td>Complejidad operativa</td><td>Baja</td><td>Alta (ESB, contratos, gobierno)</td><td>Alta (muchos servicios)</td></tr>
            <tr><td>Conviene cuando…</td><td>Producto acotado, equipo chico</td><td>Hay que <b>integrar y reutilizar a nivel empresa</b></td><td>Publicación frecuente, escala alta, varios equipos</td></tr>
          </tbody>
        </table></div>
        <p class="mini">“Microservicios toma muchas ideas de SOA (contratos, autonomía, composición) y las <b>lleva al
        interior de una aplicación</b>.”</p>

        <h2>Ley de Conway</h2>
        <div class="callout key">
          <p>“<b>Las organizaciones que diseñan sistemas están condenadas a producir diseños que copian sus propias
          estructuras de comunicación.</b>” — Melvin Conway (1968)</p>
          <p><b>Equipos por capa técnica</b> (UI / middleware / DBA): cada cambio funcional requiere <b>coordinar a los
          tres equipos</b>. <b>Equipos por capacidad de negocio</b> (Catálogo, Inventario, Facturación): cada equipo es
          <b>dueño de punta a punta</b> de una capacidad, con su servicio y su base.</p>
          <p class="mini">De ahí la “<b>maniobra de Conway inversa</b>”: si querés una arquitectura de microservicios,
          organizá primero los equipos por dominio.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2soaQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2soaQuiz"), [
        { n: 1, topic: "SOA", type: "mc", q: "La diferencia de ALCANCE entre SOA y microservicios es…", options: [
          { t: "SOA integra y reutiliza a nivel EMPRESA (varios sistemas); microservicios divide UNA aplicación", ok: true },
          { t: "Ninguna: son sinónimos", ok: false },
          { t: "SOA es más nuevo que microservicios", ok: false },
        ], explain: "SOA es ante todo una estrategia de integración y reutilización a nivel empresa, no una forma de dividir una aplicación." },
        { n: 2, topic: "ESB", type: "multi", q: "Riesgos del ESB (marcá todos)", options: [
          { t: "Punto único de falla y cuello de botella de performance", ok: true },
          { t: "“Smart pipes”: reglas de negocio dentro del bus", ok: true },
          { t: "Cuello de botella organizacional: un único equipo de integración", ok: true },
          { t: "No puede transformar formatos", ok: false },
        ], explain: "Transformar formatos es justamente una de sus responsabilidades (XML ↔ JSON). Los otros tres son los riesgos que marca la cátedra." },
        { n: 3, topic: "Falacias", type: "mc", q: "Diseñar timeouts, reintentos y manejo de fallas parciales desde el inicio responde a qué falacia?", options: [
          { t: "“La red es confiable”", ok: true },
          { t: "“La latencia es cero”", ok: false },
          { t: "“La red es homogénea”", ok: false },
        ], explain: "“La latencia es cero” se combate evitando diálogos chatty; “el ancho de banda es infinito”, paginando y comprimiendo." },
        { n: 4, topic: "Coordinación", type: "mc", q: "Flujo regulatorio crítico donde se necesita visibilidad total y manejo de errores centralizado:", options: [
          { t: "Orquestación: un coordinador central con control y trazabilidad alta", ok: true },
          { t: "Coreografía: cada servicio reacciona a eventos", ok: false },
          { t: "Base de datos compartida", ok: false },
        ], explain: "Orquestación = flujo visible, control centralizado, ideal para flujos complejos y críticos, al costo de mayor acoplamiento y un posible cuello de botella." },
        { n: 5, topic: "SOA", type: "open", q: "¿Qué tipo de servicio SOA es “Notificaciones” y por qué es importante la distinción?", answer: "Es un servicio UTILITARIO: una capacidad transversal, no ligada a un dominio de negocio específico, y por eso altamente reutilizable (lo usan Siniestros, Cobranzas y la app de autogestión). La distinción importa porque define la reutilización esperada: los servicios de ENTIDAD (Cliente, Cuenta, Póliza) son agnósticos del proceso y también muy reutilizables; los de TAREA/PROCESO (Alta de Cliente, Otorgar Préstamo) orquestan a los otros y son poco reutilizables porque resuelven un proceso concreto. Diseñar un servicio de proceso como si fuera de entidad lo vuelve inútil para otros flujos." },
      ]);
    },
  });
})();
