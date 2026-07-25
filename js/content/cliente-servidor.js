/* ============================================================
   Fundamentos — Cliente / Servidor
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cliente-servidor",
    title: "Cliente-Servidor",
    tag: "🔌",
    group: "Fundamentos",
    resumen: "Roles, protocolo, stateless, N capas",
    keywords: ["cliente", "servidor", "stateless", "stateful", "capas", "protocolo"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Cliente-Servidor</h1>
          <p class="lead">Dividir un sistema en dos roles: alguien que pide y alguien que responde.</p>
        </div>

        <div class="analogia">
          <div class="emo">🍽️</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un restaurante. Vos (cliente) le pedís al mozo (servidor). El mozo trae la comida.
            Vos no cocinás, no lavás los platos, no sabés cómo se prepara. El mozo tampoco te sigue a tu casa
            a ver si comiste. Cada uno tiene su rol claro y se comunican con un <b>protocolo</b> conocido
            (el idioma del pedido).</p>
          </div>
        </div>

        <h2>Los dos roles</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Cliente</h4>
            <p><b>Inicia</b> la petición y espera (o no) la respuesta.</p>
            <ul>
              <li>Tu navegador</li>
              <li>La app de tu teléfono</li>
              <li>Un servicio que le pega a otro servicio</li>
              <li>Postman, curl</li>
            </ul>
          </div>
          <div class="vs-b">
            <h4>Servidor</h4>
            <p><b>Escucha</b> y responde. Está siempre disponible esperando peticiones.</p>
            <ul>
              <li>El backend de Instagram</li>
              <li>Una API REST en Spring Boot</li>
              <li>Un motor de base de datos</li>
              <li>El servicio de IA de ProtegePro</li>
            </ul>
          </div>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Son roles, no máquinas</div>
          <p>El mismo componente puede ser servidor de uno y cliente de otro. En los finales de la cátedra esto pasa todo el tiempo:
          el <i>Servicio de Contrataciones</i> es servidor del frontend y a la vez cliente del <i>Motor de Riesgo</i> y de
          la <i>API de Clima</i>.</p>
        </div>

        ${APP.uml(`sequenceDiagram
    autonumber
    participant N as Navegador (cliente)
    participant B as Backend (servidor)
    participant D as Base de datos (servidor)
    N->>B: GET /turnos?especialidad=clinica
    B->>D: SELECT * FROM turnos WHERE ...
    D-->>B: filas
    B-->>N: 200 OK + JSON
    Note over B,D: El backend es servidor del navegador<br/>y cliente de la base`, "Los roles se encadenan")}

        <h2>Protocolo</h2>
        <p>Las <b>reglas para comunicarse</b>: qué formato tienen los mensajes, qué significa cada uno, quién habla primero.
        En la web el protocolo dominante es <a class="inline" data-go="http">HTTP</a>. Otros que vas a ver en la materia:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Protocolo</th><th>Uso típico</th><th>Sincronismo</th></tr></thead>
          <tbody>
            <tr><td>HTTP / HTTPS</td><td>APIs REST, web</td><td>Sincrónico (request/response)</td></tr>
            <tr><td>AMQP</td><td>RabbitMQ y colas de mensajes</td><td>Asincrónico</td></tr>
            <tr><td>WebSocket</td><td>Canal bidireccional persistente (chat, tiempo real)</td><td>Bidireccional</td></tr>
            <tr><td>gRPC</td><td>Comunicación eficiente entre microservicios</td><td>Sincrónico (también streaming)</td></tr>
            <tr><td>SMTP</td><td>Envío de mails</td><td>Asincrónico de hecho</td></tr>
          </tbody>
        </table></div>

        <h2>Stateless vs Stateful</h2>
        <p>¿El servidor <b>recuerda</b> al cliente entre una petición y otra?</p>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Stateless (sin estado)</h4>
            <p>Cada petición se basta a sí misma: trae toda la información necesaria (por ejemplo, el token en el header
            <code>Authorization</code>). El servidor no guarda nada del cliente entre requests.</p>
            <p><b>✅ Ventaja clave:</b> podés poner N instancias detrás de un balanceador y cualquiera atiende cualquier
            request. Es lo que hace posible el <b>escalado horizontal</b>.</p>
            <p><b>❌ Costo:</b> más datos viajan en cada request.</p>
          </div>
          <div class="vs-b">
            <h4>Stateful (con estado)</h4>
            <p>El servidor guarda una sesión asociada al cliente (típicamente en memoria, con un <code>JSESSIONID</code>).</p>
            <p><b>✅ Ventaja:</b> requests más livianas, conveniente para flujos largos.</p>
            <p><b>❌ Costo:</b> necesitás <i>sticky sessions</i> o una sesión compartida (Redis). Si se cae la instancia,
            se pierde la sesión. Complica el escalado.</p>
          </div>
        </div>
        <div class="callout tip">
          <div class="callout-title">✅ Para el parcial</div>
          <p><b>REST es stateless por definición.</b> Si el enunciado habla de escalar horizontalmente, de picos de tráfico
          o de múltiples instancias, la respuesta esperada es servicios stateless + token (JWT) + balanceador.</p>
        </div>

        <h2>Modelo de N capas</h2>
        <p>La organización clásica de un sistema de información. Cada capa <b>sólo conoce a la de abajo</b>.</p>
        ${APP.uml(`graph TD
    A["🖥️ Capa de Presentación<br/>controllers, vistas, DTOs"] --> B["⚙️ Capa de Lógica de Negocio<br/>services + modelo de dominio"]
    B --> C["🗄️ Capa de Acceso a Datos<br/>repositorios"]
    C --> D[("Base de datos")]
    style A fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style B fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style C fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Arquitectura en capas")}

        <div class="table-wrap"><table class="data">
          <thead><tr><th>Capa</th><th>Responsabilidad</th><th>Qué NO debe hacer</th></tr></thead>
          <tbody>
            <tr><td>Presentación</td><td>Traducir HTTP ↔ objetos, validar formato, serializar</td><td>Contener reglas de negocio</td></tr>
            <tr><td>Negocio (dominio + services)</td><td>Las reglas del problema, la orquestación del caso de uso</td><td>Conocer HTTP, SQL o el SDK de un proveedor</td></tr>
            <tr><td>Datos</td><td>Persistir y recuperar, traducir objetos ↔ tablas</td><td>Decidir reglas de negocio</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Regla que se cobra en el parcial:</b> las dependencias van <b>hacia adentro</b>. El dominio no importa
          nada de infraestructura. Cuando el punto dice “documentar <i>únicamente la capa de dominio</i>”, no dibujes
          controllers ni repositorios: sólo las clases del negocio.</p>
        </div>

        <h2>Palabras clave en el enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué te está diciendo</th></tr></thead>
          <tbody>
            <tr><td>“el usuario accede a través de…”</td><td>Hay un cliente: definí el canal (web, mobile)</td></tr>
            <tr><td>“la aplicación consulta…”</td><td>Nuestro sistema es cliente de algo</td></tr>
            <tr><td>“el sistema recibe una solicitud”</td><td>Nuestro sistema es servidor: expone un endpoint</td></tr>
            <tr><td>“expone un endpoint para…”</td><td>Hay que diseñar una API REST (mencionar verbo y ruta)</td></tr>
            <tr><td>“consume un servicio externo”</td><td>Cliente + <a class="inline" data-go="adapter">Adapter</a> + pensar qué pasa si falla</td></tr>
            <tr><td>“no es de nuestra propiedad / no puede modificarse”</td><td>Adapter obligatorio</td></tr>
          </tbody>
        </table></div>

        <h2>Ejercicio: ¿quién es cliente y quién servidor?</h2>
        <div id="csQuiz"></div>
      `;

      APP.quiz(el.querySelector("#csQuiz"), [
        { n: 1, topic: "Roles", type: "mc", q: "El navegador pide <code>GET /turnos</code> al backend de TurnoÁgil. ¿Quién es el servidor?", options: [
          { t: "El backend de TurnoÁgil", ok: true }, { t: "El navegador", ok: false }, { t: "Los dos a la vez", ok: false },
        ], explain: "El que <b>escucha y responde</b> es el servidor. El que inicia la petición es el cliente." },
        { n: 2, topic: "Roles", type: "mc", q: "El Servicio de Validación Clínica llama por REST al motor externo de validación médica. En esa interacción, el Servicio de Validación es…", options: [
          { t: "Cliente (y sigue siendo servidor de quien lo llamó a él)", ok: true },
          { t: "Sólo servidor", ok: false },
          { t: "Ni cliente ni servidor: son pares", ok: false },
        ], explain: "Son <b>roles por interacción</b>, no etiquetas fijas. Un microservicio es servidor hacia arriba y cliente hacia abajo." },
        { n: 3, topic: "Stateless", type: "mc", q: "Querés poder levantar 5 instancias del backend detrás de un balanceador sin sesiones pegajosas. ¿Qué necesitás?", options: [
          { t: "Que los servicios sean stateless y que la identidad viaje en cada request (por ejemplo, un JWT)", ok: true },
          { t: "Guardar la sesión en memoria de cada instancia", ok: false },
          { t: "Usar HTTP en vez de HTTPS", ok: false },
        ], explain: "Con sesión en memoria, si el balanceador manda la request a otra instancia, esa instancia no sabe quién sos. Stateless + token resuelve el problema." },
        { n: 4, topic: "Capas", type: "mc", q: "¿Dónde debería vivir la regla “el copago del plan Básico es el 30% del valor base”?", options: [
          { t: "En la capa de negocio (una clase del dominio, por ejemplo una regla de copago)", ok: true },
          { t: "En el controller, así se valida apenas llega el request", ok: false },
          { t: "En un trigger de la base de datos", ok: false },
        ], explain: "Es una regla de negocio: tiene que ser reutilizable desde cualquier canal (HTTP, un job, un consumidor de cola) y testeable sin levantar el servidor." },
        { n: 5, topic: "Capas", type: "multi", q: "El punto del final dice: “Documentar la solución <b>únicamente de la capa de dominio</b>”. ¿Qué NO va en ese diagrama?", options: [
          { t: "<code>TurnoController</code>", ok: true },
          { t: "<code>TurnoRepository</code> (implementación JPA)", ok: true },
          { t: "<code>TurnoDTO</code>", ok: true },
          { t: "<code>ReglaDeCopago</code> y sus implementaciones", ok: false },
        ], explain: "Controllers, DTOs e implementaciones de persistencia son infraestructura. Sí puede aparecer la <i>interfaz</i> de un repositorio si la definís desde el dominio (DIP), pero no la implementación." },
      ]);
    },
  });
})();
