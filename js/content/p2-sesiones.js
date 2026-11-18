/* ============================================================
   P2 · Sesiones, Cookies, Stateless vs Stateful, Recursos
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-sesiones",
    title: "Sesiones, Cookies, JWT y Stateless",
    tag: "🍪",
    group: "Arquitectura Web II (P2)",
    resumen: "Stateful vs stateless, JWT, recursos y protección de recursos",
    keywords: ["sesion", "cookie", "stateless", "stateful", "jwt", "token", "sticky session", "recursos", "anidados", "autenticacion", "autorizacion", "roles", "permisos", "alcance", "sesiones mixtas", "401", "403"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitectura Web II · 2º Parcial</div>
          <h1>Sesiones, Cookies y Stateless vs Stateful</h1>
          <p class="lead">Tema corto, muy preguntable y con una pregunta casi fija: “<i>¿cómo aplicaría JWT y qué ventajas presenta frente a sesiones tradicionales de servidor?</i>”.</p>
        </div>

        <h2>Sesión</h2>
        <div class="callout key">
          <ul>
            <li>Las sesiones sirven para <b>identificar al usuario</b> que está intentando acceder a un recurso o ejecutar determinada funcionalidad.</li>
            <li>Una sesión puede <b>almacenar temporalmente información</b> relacionada con las actividades del usuario mientras está conectado.</li>
            <li><b>No siempre es necesario</b> contar con el concepto de sesión: depende del <b>tipo de arquitectura</b> establecida para el aplicativo.</li>
          </ul>
        </div>

        <h2>Cookies</h2>
        <div class="callout key">
          <ul>
            <li>Una cookie es un <b>pequeño archivo de datos creado por el Servidor pero almacenado en el Cliente</b>.</li>
            <li>Las cookies <b>viajan al servidor que las creó en cada request</b> que el cliente le realice.</li>
            <li>Sirven, en su sentido más amplio, para que el servidor pueda <b>identificar y reconocer al usuario</b> que está realizando la request (y también para guardar preferencias y hacer seguimiento).</li>
          </ul>
        </div>
        <p class="mini">Atributos de seguridad que conviene nombrar: <code>HttpOnly</code> (no accesible por JavaScript →
        mitiga XSS), <code>Secure</code> (sólo por HTTPS), <code>SameSite</code> (mitiga CSRF) y <code>Max-Age</code>.</p>

        <h2>Stateless vs. Stateful (Web)</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Stateless (sin estado)</h3>
            <p>Un proceso, aplicación o componente <b>sin estado</b> es aquel que está <b>aislado</b>: <b>no se almacena
            información sobre las operaciones anteriores ni se hace referencia a ellas</b>. Cada operación se lleva a cabo
            <b>desde cero</b>, como si fuera la primera vez.</p>
            <ul>
              <li><b>No se almacena sesión del lado del servidor.</b></li>
              <li>El usuario <b>se identifica en cada solicitud</b> que realiza.</li>
              <li>Para identificarse, el usuario <b>envía un token</b>; el servidor lo <b>decodifica</b> y descubre quién es.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Stateful (con estado)</h3>
            <p>Las aplicaciones o componentes <b>con estado</b> son aquellos a los que se puede volver una y otra vez y
            <b>recuerdan “quiénes somos” y “qué hicimos anteriormente”</b>. Se realizan con el <b>contexto de las
            operaciones anteriores</b>, y la operación actual puede verse afectada por lo que ocurrió previamente.</p>
            <ul>
              <li><b>Se almacena sesión en el servidor.</b></li>
              <li>El usuario se identifica <b>una sola vez</b>, no en cada solicitud.</li>
              <li>Al iniciar sesión (validadas las credenciales) el servidor <b>genera un espacio para él</b> (memoria/archivos/etc.) y le otorga un <b>id</b>, que <b>setea en la cookie</b> del usuario.</li>
              <li>En las solicitudes siguientes, el servidor <b>revisa la cookie</b> que llega en la request y <b>recupera la sesión por el id</b>.</li>
            </ul>
          </div>
        </div>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant C as Cliente
    participant S as Servidor
    Note over C,S: STATEFUL — sesión en el servidor
    C->>S: POST /login (usuario + password)
    Note right of S: crea espacio en memoria<br/>y le asigna id de sesión
    S-->>C: Set-Cookie: JSESSIONID=abc123
    C->>S: GET /pedidos (Cookie: JSESSIONID=abc123)
    Note right of S: busca la sesión por id<br/>y sabe quién es
    S-->>C: 200 OK
    Note over C,S: STATELESS — token en el cliente
    C->>S: POST /login (usuario + password)
    Note right of S: firma un JWT<br/>NO guarda nada
    S-->>C: 200 { token: eyJhbGci... }
    C->>S: GET /pedidos (Authorization: Bearer eyJ...)
    Note right of S: verifica la firma y lee<br/>los claims: id, roles, exp
    S-->>C: 200 OK`, "Las dos formas de identificar al usuario")}

        <h2>JWT (JSON Web Token) — la pregunta del parcial</h2>
        <p>Un JWT tiene tres partes separadas por punto, codificadas en Base64URL:
        <b>header</b>.<b>payload</b>.<b>firma</b>.</p>
        ${APP.code(`// HEADER            { "alg": "HS256", "typ": "JWT" }
// PAYLOAD (claims)  { "sub": "1042",            ← quién es el usuario
//                     "roles": ["DUENIO"],      ← qué puede hacer
//                     "iat": 1763380000,        ← emitido en
//                     "exp": 1763383600 }       ← expira (¡corto!)
// FIRMA             HMACSHA256(base64(header) + "." + base64(payload), SECRETO)

Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDQyIn0.K7x...`, { lang: "json", collapse: false, label: "Anatomía de un JWT" })}
        <div class="callout key">
          <div class="callout-title">🎯 Respuesta modelo: “¿cómo aplicaría JWT y qué ventajas tiene frente a sesiones?”</div>
          <p><b>Cómo:</b> el usuario se autentica una vez contra el servicio de autenticación (o el IDM/SSO), que le
          devuelve un <b>JWT firmado</b> con sus claims (id de usuario, roles, expiración). El cliente —web o mobile,
          indistintamente— lo envía en el header <code>Authorization: Bearer &lt;token&gt;</code> en <b>cada</b> request.
          El <b>API Gateway</b> valida la firma y la expiración y <b>propaga la identidad</b> a los microservicios, que
          ya no necesitan consultar a ninguna base de sesiones.</p>
          <p><b>Ventajas frente a la sesión de servidor:</b></p>
          <ul>
            <li><b>Escalabilidad horizontal real:</b> el servidor es <b>stateless</b>, así que cualquier instancia puede
            atender cualquier request → <b>no hacen falta sticky sessions</b> ni un almacén de sesiones compartido.</li>
            <li><b>Sirve para múltiples clientes</b> (web, mobile nativa, mobile híbrida, desktop, terceros): las apps
            mobile no manejan cookies de forma natural; un token sí.</li>
            <li><b>Autocontenido:</b> el token lleva la identidad y los roles, así que <b>no hay un viaje extra</b> a la
            base por cada request.</li>
            <li><b>Desacopla la autenticación</b> de los servicios de negocio: encaja con <b>SSO / IDM</b> y con
            microservicios.</li>
            <li><b>Menor consumo de memoria</b> en el servidor (no se reserva un espacio por usuario conectado).</li>
          </ul>
          <p><b>Desventajas que conviene nombrar</b> (demuestra criterio):</p>
          <ul>
            <li><b>No se puede revocar fácilmente:</b> el token es válido hasta que expira. Se mitiga con
            <b>expiraciones cortas</b> + <b>refresh token</b> y una <b>lista de revocación</b> para casos críticos.</li>
            <li><b>Viaja en cada request</b> → más bytes; y si se guarda mal en el cliente (localStorage) queda expuesto a
            XSS.</li>
            <li><b>El payload es legible</b> (está firmado, no cifrado): nunca poner datos sensibles.</li>
            <li>Si cambian los permisos de un usuario, el token viejo sigue diciendo lo anterior hasta que expire.</li>
          </ul>
        </div>
        <div class="callout warn">
          <p><b>Por qué stateful limita la escalabilidad:</b> si el servidor guarda la sesión <b>en memoria local</b>, el
          usuario necesita volver siempre al mismo nodo → <b>sticky sessions</b> en el balanceador, que “atenta contra la
          escalabilidad horizontal y la disponibilidad: si ese servidor cae, esos usuarios pierden igual su sesión”.
          La <b>alternativa recomendada</b> es diseñar servicios <b>stateless</b> y <b>externalizar el estado de
          sesión</b> (Redis, base de datos, JWT). Lo vemos en <a class="inline" data-go="p2-escalabilidad">escalabilidad</a>.</p>
        </div>

        <h2>Sesiones mixtas</h2>
        <div class="callout key">
          <p>Es la implementación que se hace cuando el frontend es un <b>Cliente Liviano Desacoplado</b>, y por lo tanto
          se manejan:</p>
          <ul>
            <li><b>Sesiones en cookies</b> desde el usuario final hacia nuestro <b>Servidor Frontend</b>, y</li>
            <li><b>Tokens de autorización</b> desde nuestro Servidor Frontend hacia el <b>Servidor de Aplicación</b>
            (donde reside la lógica de negocio).</li>
          </ul>
        </div>
        ${APP.uml(`graph LR
    U["👤 Navegador"] -->|"cookie de sesión"| F["Servidor Frontend<br/>(cliente liviano desacoplado / BFF)"]
    F -->|"Authorization: Bearer JWT"| A["Servidor de Aplicación<br/>(lógica de negocio · API)"]
    A --> DB[("BD")]
    style F fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style A fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Sesiones mixtas")}

        <h2>Recursos en Sistemas Web</h2>
        <div class="callout key">
          <p>Al diseñar un sistema con arquitectura web hay que pensar <b>qué recursos vamos a permitir manipular</b>. Un
          <b>Recurso</b> es una <b>entidad que puede ser manipulada</b>: dada de alta, modificada, eliminada o listada
          (buscada). Para identificar qué recursos debe exponer un sistema hay que <b>tener en cuenta los casos de
          uso</b>.</p>
        </div>
        <div class="grid-2">
          <div class="card">
            <h3>Independientes / autónomos</h3>
            <p>Recursos que <b>no dependen de nadie</b>, que tienen <b>sentido de existencia propio</b>.</p>
            ${APP.code(`GET    /mascotas
POST   /mascotas
GET    /mascotas/{id}
PUT    /mascotas/{id}
DELETE /mascotas/{id}`, { lang: "http", collapse: false, label: "Recurso autónomo" })}
          </div>
          <div class="card">
            <h3>Dependientes / anidados</h3>
            <p>Recursos que <b>no son autónomos</b>, que <b>dependen de la existencia de otros</b>. <b>No tiene sentido
            listar todos estos recursos sin que sean condicionados por su recurso contenedor.</b> A nivel objetos,
            podríamos pensar que están involucrados en una relación de <b>Composición</b>.</p>
            ${APP.code(`GET  /mascotas/{id}/historial
POST /mascotas/{id}/historial
GET  /mascotas/{id}/historial/{idEvento}
# "GET /historial" solo no tiene sentido:
# siempre se lista dentro de una mascota`, { lang: "http", collapse: false, label: "Recurso anidado" })}
          </div>
        </div>

        <h2>Protección de recursos</h2>
        <p>Interesa proteger los recursos que expone un sistema para que <b>no sean accedidos libremente</b> por todos los
        tipos de usuarios. Existen <b>al menos tres niveles</b>:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Nivel</th><th>Qué exige</th><th>Cómo se responde si no cumple</th></tr></thead>
          <tbody>
            <tr><td><b>1 · Autenticación</b></td><td>Que el usuario <b>se identifique</b> antes de acceder</td><td>Con presentación <b>visual</b>: redirigir al <b>login</b>. Con presentación de datos <b>REST</b>: devolver <b>401 (no autorizado)</b>.</td></tr>
            <tr><td><b>2 · Autorización por roles</b></td><td><b>Depende de la autenticación.</b> Exige que el usuario identificado cuente con <b>un rol en particular</b>. Permite que <b>no todos los usuarios manipulen los mismos recursos</b>.</td><td><b>403 Forbidden</b></td></tr>
            <tr><td><b>3 · Roles y permisos</b></td><td><b>Depende de la autenticación.</b> Exige un <b>rol</b> y además <b>uno o varios permisos</b>. Permite que <b>no todos los usuarios con el mismo rol</b> accedan a los mismos recursos, y que usuarios con <b>distintos roles</b> cuenten con el <b>mismo permiso</b>.</td><td><b>403 Forbidden</b></td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Alcances (el detalle que casi nadie pone)</div>
          <p>“A veces es necesario pensar en los diferentes <b>alcances</b> que se puede tener sobre los recursos. Por
          ejemplo: un rol ‘Encargado’ podría ver el recurso <i>empleados</i>, pero <b>solamente los que tiene a su
          cargo</b>, no todos. Los alcances podrían ser: <b>propio, propios, todos</b>.”</p>
          <p class="mini">Esto es la frontera con <b>ABAC</b>: cuando el permiso depende del <b>contexto</b> (relación con
          el recurso, horario, ubicación), RBAC puro no alcanza.</p>
        </div>
        <div class="callout warn">
          <p><b>401 vs 403</b> — error típico: <b>401 Unauthorized</b> = “no sé quién sos” (falta o es inválida la
          credencial). <b>403 Forbidden</b> = “sé quién sos, pero no podés”. La <b>validación de autorización va siempre
          en el backend</b>: ocultar un botón en el frontend no es seguridad.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2sQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2sQuiz"), [
        { n: 1, topic: "Cookies", type: "mc", q: "Una cookie es…", options: [
          { t: "Un archivo de datos creado por el servidor pero almacenado en el cliente, que viaja al servidor en cada request", ok: true },
          { t: "Un espacio de memoria en el servidor donde se guarda la sesión", ok: false },
          { t: "Un token firmado con los roles del usuario", ok: false },
        ], explain: "Creada por el servidor, guardada en el cliente, y vuelve al servidor que la creó en cada request." },
        { n: 2, topic: "Stateless", type: "mc", q: "En una arquitectura web <b>stateless</b>…", options: [
          { t: "El usuario se identifica en cada solicitud enviando un token que el servidor decodifica", ok: true },
          { t: "El usuario se identifica una sola vez y el servidor guarda su sesión", ok: false },
          { t: "No se puede autenticar al usuario", ok: false },
        ], explain: "No hay sesión del lado del servidor: cada operación se lleva a cabo desde cero y la identidad viaja en el token." },
        { n: 3, topic: "JWT", type: "multi", q: "Ventajas de JWT frente a la sesión de servidor (marcá todas)", options: [
          { t: "Permite escalar horizontalmente sin sticky sessions", ok: true },
          { t: "Funciona igual para web, mobile y terceros", ok: true },
          { t: "Es autocontenido: no hay viaje extra a la base por request", ok: true },
          { t: "Se puede revocar instantáneamente", ok: false },
        ], explain: "La revocación es justamente su debilidad: el token vale hasta que expira. Se mitiga con expiración corta + refresh token + lista de revocación." },
        { n: 4, topic: "Recursos", type: "mc", q: "<code>/mascotas/{id}/historial</code> es un recurso…", options: [
          { t: "Dependiente/anidado: no tiene sentido listarlo sin su contenedor (relación de composición)", ok: true },
          { t: "Independiente/autónomo", ok: false },
          { t: "Mal diseñado: REST no permite anidar", ok: false },
        ], explain: "Los recursos dependientes no son autónomos; a nivel objetos están en una relación de composición con su contenedor." },
        { n: 5, topic: "Protección", type: "mc", q: "El usuario está logueado pero su rol no le permite ver el recurso. ¿Qué status devolvés?", options: [
          { t: "403 Forbidden", ok: true },
          { t: "401 Unauthorized", ok: false },
          { t: "404 Not Found", ok: false },
        ], explain: "401 = no está autenticado (no sé quién sos). 403 = autenticado pero sin autorización." },
        { n: 6, topic: "Protección", type: "open", q: "El sistema tiene roles “Dueño”, “Veterinario” y “Administrador”. El veterinario sólo debe ver el historial de las mascotas que tiene autorizadas. ¿Qué nivel de protección usás?", answer: "Autorización basada en roles Y permisos, con alcance. La autenticación identifica al usuario (JWT). El rol Veterinario habilita el recurso /mascotas/{id}/historial con permiso de lectura, pero el alcance no es 'todos' sino 'los autorizados': hay que validar en el backend que exista una autorización vigente entre ese profesional y esa mascota. Eso ya es control por atributos/contexto (ABAC) complementando al RBAC, porque el permiso depende de la relación entre el sujeto y el recurso concreto, no sólo del rol. La validación va siempre del lado del servidor, nunca ocultando opciones en la UI." },
      ]);
    },
  });
})();
