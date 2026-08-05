/* ============================================================
   Principios — Seguridad de la Información
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "seguridad",
    title: "Seguridad",
    tag: "🔐",
    group: "Principios",
    resumen: "Tríada CIA, autenticación, cifrado, ataques",
    keywords: ["seguridad", "cia", "confidencialidad", "integridad", "disponibilidad", "jwt", "oauth", "hash", "cifrado", "https", "rbac", "sso", "idm", "waf", "sql injection", "xss", "csrf"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Principios</div>
          <h1>Seguridad de la Información</h1>
          <p class="lead">Proteger los datos y sistemas contra accesos no autorizados y garantizar que estén disponibles cuando se necesitan.</p>
        </div>

        <div class="analogia">
          <div class="emo">🏦</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un banco. La <b>confidencialidad</b> es que sólo vos puedas ver el contenido de tu caja de seguridad.
            La <b>integridad</b> es que nadie pueda cambiar lo que hay adentro sin que se note. La <b>disponibilidad</b>
            es que puedas ir a buscarlo un martes a las 10 de la mañana y el banco esté abierto.</p>
            <p>Las tres son necesarias: un banco impenetrable pero siempre cerrado no te sirve de nada.</p>
          </div>
        </div>

        <h2>La tríada CIA</h2>
        <div class="grid-3">
          <div class="card" style="border-top:4px solid var(--info)">
            <h3 style="margin-top:0">🔒 Confidencialidad</h3>
            <p>Que la información la vean <b>sólo los autorizados</b>.</p>
            <p><b>Se logra con:</b> cifrado (en tránsito y en reposo), control de accesos, autenticación, principio de mínimo privilegio.</p>
          </div>
          <div class="card" style="border-top:4px solid var(--ok)">
            <h3 style="margin-top:0">✍️ Integridad</h3>
            <p>Que la información <b>no se modifique</b> de forma no autorizada (ni por un atacante ni por un error).</p>
            <p><b>Se logra con:</b> hashes, firmas digitales, checksums, control de versiones, bitácoras de auditoría, transacciones.</p>
          </div>
          <div class="card" style="border-top:4px solid var(--warn)">
            <h3 style="margin-top:0">⚡ Disponibilidad</h3>
            <p>Que la información esté <b>accesible cuando se la necesita</b>.</p>
            <p><b>Se logra con:</b> redundancia, backups, balanceo de carga, protección contra DoS, planes de recuperación.</p>
          </div>
        </div>

        <h2>Autenticación vs Autorización</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Autenticación — ¿quién sos?</h4>
            <p>Verificar la identidad. Se basa en factores:</p>
            <ul>
              <li><b>Algo que sabés:</b> contraseña, PIN</li>
              <li><b>Algo que tenés:</b> token, celular, tarjeta</li>
              <li><b>Algo que sos:</b> huella, cara, iris</li>
            </ul>
            <p><b>MFA</b> = combinar dos o más de esos factores.</p>
            <p>Si falla → <code>401 Unauthorized</code></p>
          </div>
          <div class="vs-b">
            <h4>Autorización — ¿qué podés hacer?</h4>
            <p>Verificar permisos <b>una vez</b> que ya sé quién sos.</p>
            <ul>
              <li><b>RBAC:</b> permisos por <b>rol</b> (médico, administrativo, paciente)</li>
              <li><b>ABAC:</b> permisos por <b>atributos</b> del sujeto, el recurso y el contexto</li>
              <li><b>ACL:</b> lista explícita por recurso</li>
            </ul>
            <p>Si falla → <code>403 Forbidden</code></p>
          </div>
        </div>
        <div class="callout info">
          <p><b>RBAC vs ABAC en un ejemplo:</b> RBAC dice “los médicos pueden ver historias clínicas”. ABAC dice
          “un médico puede ver la historia clínica <i>del paciente que tiene asignado</i>, <i>durante su turno</i>,
          <i>desde la red de la clínica</i>”. ABAC es más expresivo y más caro de implementar.</p>
        </div>

        <h2>Hashing</h2>
        <p>Función matemática de <b>un solo sentido</b>: del hash no se puede volver al original.</p>
        ${APP.code(`// ❌ NUNCA guardes contraseñas en texto plano
INSERT INTO usuarios (email, password) VALUES ('ana@x.com', 'gatito123');

// ⚠️ Mejor, pero insuficiente para contraseñas: SHA-256 es DEMASIADO RÁPIDO
//    (un atacante prueba miles de millones por segundo con una GPU)
SHA256('gatito123') = '2a1b3c...'

// ✅ Para contraseñas: función lenta y con salt único por usuario
//    bcrypt / scrypt / Argon2
bcrypt('gatito123', salt) = '$2b$12$Xy9...'`, { lang: "sql", label: "Hashing de contraseñas" })}
        <div class="callout warn">
          <p><b>El <i>salt</i> es obligatorio.</b> Es un valor aleatorio único por usuario que se concatena antes de
          hashear. Sin salt, dos usuarios con la misma contraseña tienen el mismo hash, y una <i>rainbow table</i>
          las revienta a las dos de una.</p>
          <p><b>Ni el admin debe poder ver las contraseñas.</b> Por eso el flujo de “olvidé mi contraseña” manda un link
          para crear una nueva, nunca la contraseña actual.</p>
        </div>
        <p><b>El otro uso del hash es integridad:</b> si el hash del archivo que descargaste coincide con el publicado,
        el archivo no fue alterado.</p>

        <h2>Cifrado</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>Simétrico (AES)</h4>
            <p><b>Una sola clave</b> para cifrar y descifrar.</p>
            <p>✅ Rápido, ideal para volúmenes grandes y para <b>datos en reposo</b>.</p>
            <p>❌ El problema es <b>distribuir la clave</b>: ¿cómo se la pasás al otro de forma segura?</p>
          </div>
          <div class="vs-b">
            <h4>Asimétrico (RSA)</h4>
            <p><b>Par de claves:</b> pública para cifrar, privada para descifrar.</p>
            <p>✅ Resuelve la distribución de claves. Base de HTTPS y de las firmas digitales.</p>
            <p>❌ Mucho más lento.</p>
          </div>
        </div>
        <div class="callout tip">
          <p><b>En la práctica se combinan:</b> HTTPS usa criptografía asimétrica sólo para negociar una clave simétrica
          de sesión, y después cifra todo el tráfico con esa clave simétrica (que es rápida). Lo mejor de los dos mundos.</p>
        </div>

        <h2>Modelos de control de acceso</h2>
        <p>Cómo se decide <b>quién puede acceder a qué</b>. Hay cuatro modelos, de menos a más flexible:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Modelo</th><th>Quién decide</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>DAC</b> (Discretionary)</td><td>El <b>dueño</b> del recurso decide quién accede</td><td>Permisos de archivos en Linux (<code>chmod</code>)</td></tr>
            <tr><td><b>MAC</b> (Mandatory)</td><td>El <b>sistema</b> impone las reglas según clasificaciones</td><td>Ámbito militar: confidencial / secreto / ultrasecreto</td></tr>
            <tr><td><b>RBAC</b> (Role-Based)</td><td>Permisos asignados a <b>roles</b>, y roles a usuarios</td><td>El más común en sistemas de gestión: admin, usuario, entidad</td></tr>
            <tr><td><b>ABAC</b> (Attribute-Based)</td><td>Se evalúan <b>atributos</b> del sujeto, el recurso y el contexto</td><td>“puede si es médico Y está en horario laboral Y el paciente le está asignado”</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <div class="callout-title">✅ Cuándo proponer cada uno en un parcial</div>
          <ul>
            <li>Si el enunciado menciona <b>roles claros</b> (admin, usuario, entidad) → <b>RBAC</b>.</li>
            <li>Si menciona <b>condiciones contextuales</b> (horario, ubicación, relación con el recurso) → <b>ABAC</b>.</li>
          </ul>
        </div>

        <h3>Datos en tránsito vs datos en reposo</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>En tránsito</th><th>En reposo</th></tr></thead>
          <tbody>
            <tr><td>Qué protege</td><td>Los datos viajando por la red</td><td>Los datos guardados en disco / base</td></tr>
            <tr><td>Cómo</td><td>TLS / HTTPS en todas las conexiones (también entre servicios internos)</td><td>Cifrado de disco, cifrado a nivel tablespace o <b>a nivel columna</b> para campos sensibles</td></tr>
            <tr><td>Cuándo lo preguntan</td><td>“Comunicación segura entre servicios”</td><td>“¿Qué mecanismo propone para brindar confidencialidad en los datos <b>almacenados</b>?” (Talentia, La Scalo)</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Respuesta modelo para ese punto:</b> “Cifrado a nivel de columna (AES-256) para los campos sensibles
          —documento, datos clínicos, evidencia documental—, con las claves administradas en un <b>KMS</b> externo y
          rotación periódica; el resto de la base con cifrado de disco (TDE). Las claves nunca se guardan en el mismo
          motor que los datos. Complementariamente, control de accesos por rol al esquema y <b>enmascaramiento</b> de
          datos en los ambientes de prueba.”</p>
        </div>

        <h2>Certificados y HTTPS</h2>
        <ol class="steps">
          <li><span class="step-title">El navegador se conecta</span> Pide al servidor su certificado.</li>
          <li><span class="step-title">El servidor manda el certificado</span> Contiene su clave pública y está firmado por una <b>Autoridad Certificante</b> (CA).</li>
          <li><span class="step-title">El navegador valida</span> ¿La CA está en mi lista de confianza? ¿El dominio coincide? ¿No está vencido ni revocado?</li>
          <li><span class="step-title">Handshake</span> Se negocia una clave simétrica de sesión usando criptografía asimétrica.</li>
          <li><span class="step-title">Tráfico cifrado</span> Aparece el candado 🔒. Todo lo que va y viene está cifrado con la clave de sesión.</li>
        </ol>

        <h2>JWT — JSON Web Token</h2>
        <p>Token <b>autocontenido y firmado</b>, estándar para autenticación en APIs REST.</p>
        ${APP.code(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9        ← HEADER  (algoritmo)
.eyJzdWIiOiI0ODIxIiwicm9sZXMiOlsiTUVESUNPIl0sImV4cCI6MTc1NDIzMTIwMH0
                                              ← PAYLOAD (claims: sub, roles, exp)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← FIRMA`, { label: "Estructura: header.payload.firma" })}
        <div class="callout warn">
          <div class="callout-title">⚠️ Lo que más se malinterpreta</div>
          <p>El JWT está <b>firmado, no cifrado</b>. Cualquiera que lo intercepte puede leer el payload (es Base64, no
          criptografía). La firma sólo garantiza que <b>nadie lo modificó</b>. Conclusión: <b>no metas datos sensibles
          adentro</b>, y siempre viajá por HTTPS.</p>
        </div>
        <p><b>Por qué encaja tan bien con REST:</b> el servidor valida la firma con su clave y ya sabe quién sos y qué roles
        tenés, <b>sin consultar la base ni mantener una sesión</b>. Eso mantiene los servicios stateless y permite escalar
        horizontalmente. El costo: revocar un token antes de que expire es difícil (por eso se usan expiraciones cortas
        + <i>refresh tokens</i>).</p>

        <h2>OAuth 2.0 y OpenID Connect</h2>
        <p><b>OAuth</b> resuelve la <b>delegación de acceso</b>: “esta app puede leer tu calendario, pero nada más”.
        <b>OIDC</b> agrega arriba la capa de <b>identidad</b>: es lo que hace posible el “Iniciar sesión con Google”.</p>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant U as Usuario
    participant A as Talentia (app)
    participant G as Google (proveedor)
    U->>A: "Iniciar sesión con Google"
    A->>G: redirige al login de Google
    U->>G: ingresa credenciales (la app NUNCA las ve)
    G-->>A: authorization code
    A->>G: intercambia el code por tokens
    G-->>A: id_token + access_token
    A-->>U: sesión iniciada`, "Login federado con OIDC")}

        <h2>Componentes de seguridad que hay que saber nombrar</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Componente</th><th>Qué hace</th><th>Cuándo lo pedís en un final</th></tr></thead>
          <tbody>
            <tr><td><b>IDM</b> (Identity Manager)</td><td>Centraliza identidades, credenciales, roles y el ciclo de vida de los usuarios (Keycloak, Auth0, Cognito)</td><td>“¿Qué componente propone para delegar la gestión de usuarios?” → <b>esta es la respuesta</b></td></tr>
            <tr><td><b>SSO</b></td><td>Te logueás una vez y accedés a todos los sistemas de la organización</td><td>Cuando hay varias aplicaciones o una organización con dominio propio</td></tr>
            <tr><td><b>API Gateway</b></td><td>Valida el token en el borde: los servicios internos no repiten la autenticación</td><td>Siempre que haya microservicios</td></tr>
            <tr><td><b>WAF</b></td><td>Firewall de aplicación: filtra SQLi, XSS y bots antes de llegar al backend</td><td>Cuando el enunciado menciona exposición a internet o ataques</td></tr>
            <tr><td><b>KMS / Vault</b></td><td>Custodia y rota las claves de cifrado y los secretos</td><td>Siempre que respondas “cifro los datos”: te van a preguntar dónde está la clave</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>La Scalo pregunta además:</b> <i>“¿debería contemplarse una limitación de acceso por dominio institucional?”</i>
          Sí: el IDM se configura para aceptar sólo cuentas del dominio de la institución (federación con el directorio
          de la AFA/club) y se combina con RBAC para separar cuerpo técnico, médicos y administradores. Así el alta y la baja
          de usuarios las maneja la institución, no tu sistema.</p>
        </div>

        <h2>Ataques comunes</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Ataque</th><th>Qué hace</th><th>Cómo se previene</th></tr></thead>
          <tbody>
            <tr><td><b>SQL Injection</b></td><td>Inyecta SQL en un campo de entrada: <code>' OR 1=1 --</code></td><td><b>Consultas parametrizadas</b> (PreparedStatement / ORM). Nunca concatenar strings</td></tr>
            <tr><td><b>XSS</b></td><td>Inyecta JavaScript que se ejecuta en el navegador de otros usuarios</td><td>Escapar toda la salida, Content-Security-Policy, cookies <code>HttpOnly</code></td></tr>
            <tr><td><b>CSRF</b></td><td>Te hace ejecutar una acción sin querer, aprovechando tu sesión activa</td><td>Tokens anti-CSRF, cookies <code>SameSite</code></td></tr>
            <tr><td><b>Man-in-the-middle</b></td><td>Intercepta el tráfico entre cliente y servidor</td><td>HTTPS en todos lados, HSTS, certificate pinning</td></tr>
            <tr><td><b>DoS / DDoS</b></td><td>Satura el servicio para tirarlo abajo (ataca la <b>disponibilidad</b>)</td><td>Rate limiting, WAF, CDN, autoescalado</td></tr>
            <tr><td><b>Broken access control</b></td><td>Cambiás el id en la URL y ves datos de otro (<code>/perfiles/42</code> → <code>/perfiles/43</code>)</td><td>Validar la autorización <b>en el servidor</b> en cada request, sobre cada recurso</td></tr>
          </tbody>
        </table></div>

        <h2>Clasificación de mecanismos de seguridad</h2>
        <p>Un <b>mecanismo de seguridad</b> es una técnica o herramienta para fortalecer la confidencialidad, integridad
        y/o disponibilidad. Según cuándo actúan (definición de la cátedra):</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Cuándo actúa</th><th>Ejemplos</th></tr></thead>
          <tbody>
            <tr><td><b>Preventivos</b></td><td><b>Antes</b> del hecho: detienen agentes no deseados</td><td>Cifrado, control de acceso, firewall/WAF, validación de entradas</td></tr>
            <tr><td><b>Detectivos</b></td><td>Revelan la presencia de agentes no deseados: <b>avisan y registran</b></td><td>Logs y auditoría, monitoreo, alertas, detección de intrusos</td></tr>
            <tr><td><b>Correctivos</b></td><td><b>Después</b> del hecho: corrigen las consecuencias</td><td>Backups/restauración, plan de recuperación, parches</td></tr>
          </tbody>
        </table></div>

        <h2>OWASP Top 10 (riesgos en aplicaciones web)</h2>
        <p>Lista de <b>OWASP</b> (Open Worldwide Application Security Project) con los 10 principales riesgos:</p>
        <ol style="columns:2;font-size:.9rem">
          <li>Pérdida de control de acceso</li>
          <li>Fallos criptográficos</li>
          <li>Inyección (SQL, etc.)</li>
          <li>Diseño inseguro</li>
          <li>Mala configuración de seguridad</li>
          <li>Componentes vulnerables u obsoletos</li>
          <li>Fallos de identificación y autenticación</li>
          <li>Fallos de integridad de software y datos</li>
          <li>Fallos de registro y monitoreo</li>
          <li>Falsificación de solicitudes del lado del servidor (SSRF)</li>
        </ol>

        <h2>Desarrollo seguro</h2>
        <p>Prácticas que se aplican <b>al escribir el código</b>, no sólo en la arquitectura:</p>
        <ul>
          <li><b>Validar toda entrada</b> del usuario: nunca confiar en lo que llega de afuera.</li>
          <li><b>Consultas parametrizadas</b> (prepared statements) para evitar SQL injection.</li>
          <li><b>Escapar las salidas</b> para evitar XSS.</li>
          <li><b>Principio de menor privilegio:</b> cada componente tiene sólo los permisos que necesita, ni uno más.</li>
          <li><b>Defensa en profundidad:</b> varias capas de seguridad, no una sola (si una falla, quedan las otras).</li>
          <li><b>No hardcodear secretos</b> en el código: usar variables de entorno o un vault/KMS.</li>
        </ul>

        <h2>🎮 ¿Qué principio de la tríada aplica?</h2>
        <div id="secQuiz"></div>
      `;

      APP.quiz(el.querySelector("#secQuiz"), [
        { n: 1, topic: "Tríada CIA", type: "mc", q: "“El usuario ingresa su contraseña y el sistema la guarda hasheada con bcrypt.” ¿Qué principio aplica principalmente y con qué mecanismo?", options: [
          { t: "Confidencialidad — hashing con salt (función lenta)", ok: true },
          { t: "Integridad — checksums", ok: false },
          { t: "Disponibilidad — redundancia", ok: false },
        ], explain: "Estás protegiendo que nadie —ni siquiera un DBA o alguien que robe la base— pueda leer las contraseñas: eso es confidencialidad. Ojo: para contraseñas se usa una función <b>lenta</b> (bcrypt/Argon2), no SHA-256 a secas." },
        { n: 2, topic: "Tríada CIA", type: "mc", q: "“Se requiere trazabilidad completa de la evolución de cada lesión, con el médico responsable de cada cambio.” ¿Qué principio?", options: [
          { t: "Integridad — bitácora de auditoría append-only", ok: true },
          { t: "Confidencialidad — cifrado", ok: false },
          { t: "Disponibilidad — backups", ok: false },
        ], explain: "La trazabilidad garantiza que se pueda demostrar quién cambió qué y cuándo, y que nadie altere el registro: es integridad. La bitácora debe ser <b>append-only</b> (nunca se edita ni se borra)." },
        { n: 3, topic: "Tríada CIA", type: "mc", q: "“El SLA permite que el sistema esté caído como máximo 10 horas al año.” ¿Qué principio?", options: [
          { t: "Disponibilidad — redundancia, balanceo y planes de recuperación", ok: true },
          { t: "Integridad — firmas digitales", ok: false },
          { t: "Confidencialidad — control de accesos", ok: false },
        ], explain: "10 horas al año ≈ 99,89% de uptime. Se logra con redundancia de instancias, health checks, réplicas de base y un plan de recuperación probado." },
        { n: 4, topic: "AuthN/AuthZ", type: "mc", q: "Un profesional autenticado intenta ver la historia clínica de un paciente que no tiene asignado. ¿Qué falló y qué código devolvés?", options: [
          { t: "Autorización — <code>403 Forbidden</code>", ok: true },
          { t: "Autenticación — <code>401 Unauthorized</code>", ok: false },
          { t: "Nada: si es médico puede ver todo", ok: false },
        ], explain: "Ya sabemos quién es (autenticado). El problema es de permisos sobre <i>ese</i> recurso. Fijate que RBAC solo (“es médico”) no alcanza: hace falta ABAC o una ACL por paciente." },
        { n: 5, topic: "Control de acceso", type: "match", q: "Uní cada modelo de control de acceso con su descripción:", pairs: [
          { l: "DAC", r: "El <b>dueño</b> del recurso decide (permisos de archivos en Linux)" },
          { l: "MAC", r: "El <b>sistema</b> impone reglas por clasificación (militar: secreto/ultrasecreto)" },
          { l: "RBAC", r: "Permisos por <b>rol</b> (el más común en gestión)" },
          { l: "ABAC", r: "Permisos por <b>atributos y contexto</b> (horario, relación con el recurso)" },
        ] },
        { n: 6, topic: "Control de acceso", type: "mc", q: "El enunciado dice: “el médico sólo puede ver al paciente que tiene asignado, en su horario de guardia”. ¿Qué modelo proponés?", options: [
          { t: "ABAC: la decisión depende de atributos y contexto (relación médico-paciente, horario)", ok: true },
          { t: "RBAC: alcanza con el rol médico", ok: false },
          { t: "DAC: que el paciente decida", ok: false },
        ], explain: "RBAC (“es médico”) no captura la condición contextual. Cuando el permiso depende de la relación con el recurso o del contexto, es ABAC." },
        { n: 5, topic: "Mecanismos", type: "mc", q: "“¿Qué mecanismo de seguridad implementaría para brindar confidencialidad en los datos almacenados?”", options: [
          { t: "Cifrado en reposo: a nivel columna para los campos sensibles, con las claves en un KMS externo", ok: true },
          { t: "HTTPS en todas las conexiones", ok: false },
          { t: "Hashear todos los campos de la base", ok: false },
        ], explain: "HTTPS protege los datos <b>en tránsito</b>, no los almacenados. Y hashear no sirve para datos que después hay que <i>leer</i>: el hash es irreversible. Para confidencialidad en reposo se cifra (AES) con gestión externa de claves." },
        { n: 6, topic: "JWT", type: "multi", q: "Sobre JWT, marcá lo verdadero:", options: [
          { t: "Está firmado, no cifrado: el payload se puede leer", ok: true },
          { t: "Permite validar la identidad sin consultar la base (stateless)", ok: true },
          { t: "Conviene usar expiraciones cortas + refresh token porque revocarlo es difícil", ok: true },
          { t: "Es seguro guardar la contraseña del usuario en el payload", ok: false },
        ], explain: "El payload es Base64: cualquiera lo decodifica. Nunca metas secretos adentro." },
        { n: 7, topic: "Ataques", type: "mc", q: "El campo de búsqueda permite ejecutar <code>' OR 1=1 --</code>. ¿Qué ataque es y cómo se previene?", options: [
          { t: "SQL Injection — consultas parametrizadas (PreparedStatement / ORM)", ok: true },
          { t: "XSS — escapar la salida", ok: false },
          { t: "CSRF — token anti-CSRF", ok: false },
        ], explain: "Sanitizar “a mano” con reemplazos de comillas no alcanza: la única defensa robusta es que el motor trate la entrada como <b>dato</b> y no como parte de la sentencia." },
        { n: 8, topic: "Componentes", type: "mc", q: "“¿Qué componente arquitectónico propone para delegar la gestión de usuarios?”", options: [
          { t: "Un IDM (Keycloak/Auth0) con SSO, y el gateway validando el token en el borde", ok: true },
          { t: "Una tabla <code>usuarios</code> en cada microservicio", ok: false },
          { t: "Un archivo de configuración con los usuarios y sus roles", ok: false },
        ], explain: "El IDM centraliza identidades, credenciales, MFA, recuperación de contraseña y el ciclo de vida de las cuentas. Duplicar usuarios por servicio es exactamente lo que hay que evitar." },
      ]);
    },
  });
})();
