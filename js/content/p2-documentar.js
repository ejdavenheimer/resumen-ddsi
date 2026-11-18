/* ============================================================
   P2 · Documentar la arquitectura: 4+1, C4, Clean y Hexagonal
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-documentar",
    title: "Documentar: 4+1, C4, Clean/Hexagonal",
    tag: "📐",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "Vistas 4+1, modelo C4 y arquitecturas Clean/Hexagonal",
    keywords: ["documentar", "sad", "4+1", "kruchten", "vista logica", "procesos", "desarrollo", "fisica", "escenarios", "c4", "contexto", "contenedores", "componentes", "codigo", "clean architecture", "hexagonal", "puertos", "adaptadores", "cockburn"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Documentar la Arquitectura</h1>
          <p class="lead">Cuando la consigna dice “<i>comunique la arquitectura con un diagrama de despliegue y todo lo que considere necesario</i>”, esto te dice <b>qué vistas elegir y para quién</b>.</p>
        </div>

        <h2>¿Por qué documentar?</h2>
        <ul>
          <li>Es el <b>“contenedor” de los atributos de calidad</b>: rendimiento, seguridad, disponibilidad y mantenibilidad <b>se deciden en la arquitectura</b>, y ahí deben quedar escritos.</li>
          <li>Permite <b>análisis tempranos</b>: detectamos riesgos y errores de diseño <b>antes de escribir código</b>, cuando corregirlos sale barato.</li>
          <li><b>Define asignaciones de trabajo:</b> divide el sistema en partes que se pueden repartir entre equipos.</li>
          <li><b>Ayuda al mantenimiento:</b> quien llega después del despliegue entiende cómo está armado el sistema <b>y por qué</b>.</li>
        </ul>
        <p class="mini">Todo esto se plasma en el <b>SAD · Software Architecture Document</b>.</p>
        <div class="callout tip">
          <p><b>La analogía de la casa:</b> plano de arquitectura (¿cómo se distribuyen los ambientes? → dueña/arquitecto),
          eléctrico (electricista), sanitario (plomero), estructural (ingeniero civil). <b>Ningún plano es “la casa”:</b>
          cada uno muestra un aspecto distinto y responde una pregunta para un interesado distinto. <b>Un único diagrama
          no alcanza</b> para comunicar una arquitectura.</p>
        </div>

        <h2>⭐ Modelo 4+1 (Kruchten, 1995)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Vista</th><th>Pregunta que responde</th><th>Interesados</th><th>UML típico</th></tr></thead>
          <tbody>
            <tr><td><b>Lógica</b></td><td><b>¿Qué hace el sistema?</b> Los requisitos <b>funcionales</b>; se enfoca en el <b>dominio</b>: las clases y objetos del “core”. <b>No habla de tecnología: habla de conceptos del negocio.</b></td><td>Analistas, usuarios finales</td><td><b>Clases</b> · Paquetes</td></tr>
            <tr><td><b>Procesos</b></td><td><b>¿Cómo fluye y qué ocurre a la vez?</b> Los flujos de negocio: qué actor hace qué, en qué orden y <b>qué ocurre en paralelo</b> (fork/join)</td><td>Integradores</td><td><b>Actividad</b> · Secuencia</td></tr>
            <tr><td><b>Desarrollo</b></td><td><b>¿Cómo está organizado el código?</b> Módulos, paquetes, librerías y ejecutables, y las <b>dependencias</b> entre ellos. Sirve para <b>repartir el trabajo</b> y <b>controlar el acoplamiento</b></td><td>Desarrolladores</td><td><b>Componentes</b> · Paquetes</td></tr>
            <tr><td><b>Física</b></td><td><b>¿Dónde corre cada parte?</b> Distribución en <b>nodos</b>: dispositivos, servidores, redes y servicios. Es la vista de la <b>infraestructura</b>: acá se ven <b>disponibilidad, escalabilidad y rendimiento</b></td><td>Ingeniería de Sistemas, DevOps</td><td><b>Despliegue</b></td></tr>
            <tr><td><b>+1 Escenarios</b></td><td><b>¿Para qué casos de uso sirve todo esto?</b> Los <b>casos de uso conectan las 4 vistas</b> y validan que juntas resuelven lo que el usuario necesita</td><td>Todos</td><td><b>Casos de uso</b></td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Trazabilidad (el valor del “+1”):</b> dado un caso de uso, sabemos <b>qué clases, flujos, módulos y nodos
          intervienen</b>. Y si algo cambia, <b>sabemos qué más se ve afectado</b>.</p>
          <p><b>Para el parcial:</b> “elegí qué vistas necesitás <b>según los interesados</b>. <b>No siempre hacen falta
          todas.</b>” Si te piden “comunicar la arquitectura”, la combinación que casi nunca falla es
          <b>Física (despliegue) + Desarrollo (componentes)</b>, y si hay un flujo con pasos y paralelismo, sumar
          <b>Procesos (secuencia o actividad)</b>. Y si cambia la infraestructura, <b>esa vista cambia; el dominio
          no</b>.</p>
        </div>

        <h2>Modelo C4 (Simon Brown)</h2>
        <p><b>C</b>ontext, <b>C</b>ontainers, <b>C</b>omponents, <b>C</b>ode. Son <b>cuatro niveles de zoom</b> que buscan
        <b>aliviar la brecha entre el modelo y el código</b>:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Nivel</th><th>Metáfora</th><th>Qué muestra</th><th>Audiencia</th></tr></thead>
          <tbody>
            <tr><td><b>1 · Contexto</b></td><td>El mapa del país</td><td>El sistema como <b>caja negra</b>, los usuarios y los <b>sistemas externos</b> con los que interactúa</td><td><b>Todos</b>, incluso perfiles no técnicos</td></tr>
            <tr><td><b>2 · Contenedores</b></td><td>El mapa de la ciudad</td><td><b>Todo lo que ejecuta código o almacena datos:</b> apps web, servicios, apps de escritorio, bases de datos, sistema de archivos. Muestra las <b>decisiones tecnológicas de alto nivel</b></td><td>Equipo técnico</td></tr>
            <tr><td><b>3 · Componentes</b></td><td>El plano del barrio</td><td>Los componentes <b>dentro de un contenedor</b>: responsabilidades y detalles de implementación</td><td>Arquitectos y desarrolladores</td></tr>
            <tr><td><b>4 · Código</b></td><td>La vista de calle</td><td>Detalle de implementación: clases, modelo de datos, secuencia. <b>Es opcional</b> (suele generarse desde el código)</td><td>Desarrolladores</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Notación C4:</b> los bloques básicos son <b>persona, sistema de software, contenedor, componente y
          relación</b>. Los cuadros llevan <b>nombre, tipo y descripción</b>. “La notación es libre; <b>lo importante es
          una leyenda clara y consistente</b>.”</p>
          <p><b>Regla de oro:</b> “cada diagrama debe poder <b>leerse solo</b>, con <b>título, leyenda y relaciones
          rotuladas</b>.” — Aplicá esto a <b>todo</b> diagrama que entregues en el parcial.</p>
          <p><b>4+1 y C4 no compiten:</b> se pueden combinar según a quién le hablamos y qué decisión necesita tomar.</p>
        </div>

        <h2>Clean y Hexagonal</h2>
        <div class="callout key">
          <p>Son <b>dos formas de organizar un sistema con el mismo objetivo</b>: que las <b>reglas del negocio (el
          dominio) NO dependan de la tecnología</b> que las rodea (framework, base de datos, interfaz).</p>
        </div>
        <h3>El problema que resuelven</h3>
        <p>Un controller que mezcla <b>cuatro motivos de cambio</b> — la interfaz (HTTP), la regla de negocio, la base de
        datos y el e-mail:</p>
        ${APP.code(`@PostMapping("/pedidos")
crear(PedidoDto dto) {
    total = dto.items.stream().mapToDouble(...).sum();      // regla
    if (total > 50000) total *= 0.90;                       // REGLA DE NEGOCIO
    jdbc.update("INSERT INTO pedidos ...", total);          // base de datos
    mailSender.send(confirmacion(dto));                     // e-mail
    return ResponseEntity.ok(total);                        // HTTP
}`, { label: "❌ La regla de negocio enterrada en el controller", variant: "bad", collapse: false })}
        <p><b>¿Qué pasa cuando cambia algo?</b> Marketing pide 15% desde $40.000 → hay que editar el controller
        <b>en medio del SQL y del e-mail</b> y volver a probar todo. Pasamos de PostgreSQL a MongoDB → <b>se reescribe el
        controller completo</b>, incluida la regla que no cambió. Se suma una app móvil o un proceso batch → <b>la regla se
        copia</b> y puede divergir. Queremos probar el descuento → <b>hay que levantar servidor, base y SMTP</b>.</p>
        <p><b>Causa raíz:</b> lo que cambia seguido <b>por tecnología</b> (UI, base, correo) y la regla que sólo debería
        cambiar <b>por negocio</b> viven en el mismo lugar. <b>Solución: que el dominio no dependa de nada y que los
        detalles dependan de él.</b></p>
        <div class="grid-2">
          <div class="card">
            <h3>Arquitectura Hexagonal (Cockburn, 2005)</h3>
            <ul>
              <li>El sistema es un <b>núcleo</b> (dominio + casos de uso).</li>
              <li>Se comunica por <b>puertos</b>: <b>interfaces que define el dominio</b>.</li>
              <li><b>Cada tecnología es un ADAPTADOR</b> que se enchufa a un puerto (REST, BD, mail).</li>
            </ul>
          </div>
          <div class="card">
            <h3>Clean Architecture (Martin, 2012)</h3>
            <ul>
              <li>El sistema son <b>capas concéntricas</b>.</li>
              <li>En el centro, las <b>entidades</b> (reglas de negocio críticas, no conocen a ninguna otra capa) y los
              <b>casos de uso</b>.</li>
              <li><b>Regla única: las dependencias apuntan hacia ADENTRO.</b></li>
            </ul>
          </div>
        </div>
        ${APP.uml(`graph TB
    REST["Adaptador REST<br/>(controller)"] --> P1(["Puerto de entrada<br/>(caso de uso)"])
    P1 --> D["DOMINIO<br/>entidades + reglas"]
    D --> P2(["Puerto de salida<br/>interfaz Repository"])
    P2 --> JPA["Adaptador JPA<br/>(PostgreSQL)"]
    D --> P3(["Puerto de salida<br/>interfaz Notificador"])
    P3 --> SMTP["Adaptador SMTP"]
    style D fill:#ecfdf5,stroke:#059669,color:#0f172a
    style P1 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style P2 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style P3 fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Hexagonal: puertos (amarillo) y adaptadores")}
        <p><b>Beneficios:</b> dominio <b>testeable sin servidor ni base</b>, tecnología <b>intercambiable</b> y cambios de
        negocio que <b>no obligan a tocar la infraestructura</b>.</p>
        <div class="callout tip">
          <p><b>Conexión con el 1er parcial:</b> esto es exactamente <b>Inversión de Dependencias (DIP)</b> + el
          <b>patrón Repositorio</b> + <b>Adapter</b> para lo externo. Las
          <a class="inline" data-go="capas">capas</a> que ya venías usando (controller → service → dominio → repository)
          <b>son la versión simple de la misma idea</b>: el dominio define la interfaz, la infraestructura la implementa.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2docQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2docQuiz"), [
        { n: 1, topic: "4+1", type: "mc", q: "¿Qué vista del 4+1 responde “¿dónde corre cada parte?”", options: [
          { t: "Física (diagrama de despliegue)", ok: true },
          { t: "Desarrollo (componentes)", ok: false },
          { t: "Lógica (clases)", ok: false },
        ], explain: "Física = infraestructura: nodos, redes, servicios. Es donde se ven disponibilidad, escalabilidad y rendimiento." },
        { n: 2, topic: "4+1", type: "mc", q: "El “+1” del modelo 4+1 son…", options: [
          { t: "Los escenarios (casos de uso), que conectan y validan las otras cuatro vistas", ok: true },
          { t: "El diagrama de clases", ok: false },
          { t: "El modelo de datos", ok: false },
        ], explain: "Dan trazabilidad: dado un caso de uso se sabe qué clases, flujos, módulos y nodos intervienen." },
        { n: 3, topic: "C4", type: "mc", q: "En C4, un “contenedor” es…", options: [
          { t: "Cualquier cosa que ejecuta código o almacena datos: una app web, un servicio, una base de datos", ok: true },
          { t: "Un contenedor Docker", ok: false },
          { t: "Un paquete de clases", ok: false },
        ], explain: "Ojo con la trampa del nombre: no tiene que ver con Docker. Nivel 2 muestra las decisiones tecnológicas de alto nivel." },
        { n: 4, topic: "Hexagonal", type: "mc", q: "En arquitectura hexagonal, ¿quién define los puertos?", options: [
          { t: "El dominio: los puertos son interfaces definidas por el núcleo, y cada tecnología es un adaptador que se enchufa", ok: true },
          { t: "La infraestructura, junto con la implementación", ok: false },
          { t: "El framework web", ok: false },
        ], explain: "Es Inversión de Dependencias: las dependencias apuntan hacia adentro, de modo que la tecnología es intercambiable y el dominio se testea sin base ni servidor." },
      ]);
    },
  });
})();
