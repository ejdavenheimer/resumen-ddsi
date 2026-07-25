/* ============================================================
   Fundamentos — HTTP
   Incluye dos interactivos propios: "unir código ↔ significado"
   y "elegí el verbo".
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  const PARES = [
    { c: "200", d: "Todo bien, acá va el recurso que pediste" },
    { c: "201", d: "Creé el recurso nuevo (mirá el header Location)" },
    { c: "202", d: "Acepté el pedido, lo voy a procesar después" },
    { c: "204", d: "Salió bien y no tengo nada que devolverte" },
    { c: "304", d: "No cambió nada: usá tu copia en caché" },
    { c: "400", d: "El request está mal formado" },
    { c: "401", d: "No sé quién sos: falta credencial o es inválida" },
    { c: "403", d: "Sé quién sos, pero no tenés permiso" },
    { c: "404", d: "El recurso no existe" },
    { c: "409", d: "Choca con el estado actual del recurso" },
    { c: "422", d: "Se entiende, pero viola una regla de negocio" },
    { c: "500", d: "Se rompió algo del lado del servidor" },
    { c: "503", d: "El servicio está caído o saturado, probá después" },
  ];

  function unir(cont) {
    let elegido = null;
    let resueltos = 0;
    const izq = APP.shuffle(PARES);
    const der = APP.shuffle(PARES);

    cont.innerHTML =
      '<div class="grid-2" style="gap:.8rem">' +
        '<div><h4 style="margin-top:0">Código</h4><div id="uCodes" class="dg-clases" style="flex-direction:column;align-items:stretch"></div></div>' +
        '<div><h4 style="margin-top:0">Significado</h4><div id="uDescs" class="dg-clases" style="flex-direction:column;align-items:stretch"></div></div>' +
      "</div>" +
      '<p id="uFb" style="min-height:1.6rem;font-size:.9rem;margin-top:.7rem"></p>';

    const codes = cont.querySelector("#uCodes");
    const descs = cont.querySelector("#uDescs");
    const fb = cont.querySelector("#uFb");

    izq.forEach(function (p) {
      const b = document.createElement("button");
      b.className = "dg-clase"; b.type = "button"; b.dataset.c = p.c;
      b.textContent = p.c; b.style.textAlign = "left";
      b.addEventListener("click", function () {
        if (b.classList.contains("ok")) return;
        codes.querySelectorAll(".dg-clase").forEach(function (x) { x.classList.remove("sel"); });
        b.classList.add("sel");
        elegido = p.c;
        fb.innerHTML = "Ahora elegí su significado a la derecha.";
      });
      codes.appendChild(b);
    });

    der.forEach(function (p) {
      const b = document.createElement("button");
      b.className = "dg-clase"; b.type = "button"; b.dataset.c = p.c;
      b.textContent = p.d;
      b.style.textAlign = "left"; b.style.fontFamily = "inherit"; b.style.whiteSpace = "normal";
      b.addEventListener("click", function () {
        if (!elegido) { fb.innerHTML = "Primero elegí un código a la izquierda."; return; }
        if (b.classList.contains("ok")) return;
        const btnCode = codes.querySelector('[data-c="' + elegido + '"]');
        if (b.dataset.c === elegido) {
          b.classList.add("ok"); b.disabled = true;
          btnCode.classList.remove("sel"); btnCode.classList.add("ok"); btnCode.disabled = true;
          resueltos++;
          fb.innerHTML = "✅ <b>" + elegido + "</b> · " + b.textContent +
            (resueltos === PARES.length ? " — 🎉 ¡Los uniste todos!" : "");
          elegido = null;
        } else {
          b.classList.add("no");
          fb.innerHTML = "❌ <b>" + elegido + "</b> no es eso. Pista: la familia " + elegido[0] +
            "xx es " + ({ "2": "éxito", "3": "redirección/caché", "4": "error del cliente", "5": "error del servidor" }[elegido[0]]) + ".";
          setTimeout(function () { b.classList.remove("no"); }, 900);
        }
      });
      descs.appendChild(b);
    });
  }

  APP.register({
    id: "http",
    title: "HTTP",
    tag: "🌐",
    group: "Fundamentos",
    resumen: "Verbos, status codes, idempotencia",
    keywords: ["http", "get", "post", "put", "patch", "delete", "idempotente", "status code", "headers", "404", "401"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>HTTP</h1>
          <p class="lead">El protocolo estándar de la web. Todo REST se apoya en él.</p>
        </div>

        <div class="analogia">
          <div class="emo">📮</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>HTTP es como el correo postal. Cada carta (request) tiene un <b>destinatario</b> (la URL), una
            <b>intención</b> escrita en el sobre (el verbo: “te mando algo nuevo”, “dame esto”), unos <b>datos del sobre</b>
            (headers) y a veces <b>contenido adentro</b> (body). La respuesta viene con un <b>sello</b> que dice cómo salió
            (status code). Y como el cartero no recuerda las cartas anteriores, cada carta debe bastarse a sí misma
            (<i>stateless</i>).</p>
          </div>
        </div>

        <h2>Anatomía de un request</h2>
        ${APP.code(`POST /v1/reservas HTTP/1.1
Host: api.turnoagil.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "pacienteId": 4821,
  "profesionalId": 77,
  "fechaHora": "2026-08-03T10:30:00-03:00"
}`, { lang: "http", label: "Request" })}
        ${APP.code(`HTTP/1.1 201 Created
Location: /v1/reservas/99213
Content-Type: application/json

{
  "codigo": "RSV-99213",
  "estado": "PENDIENTE_VALIDACION",
  "copago": 1350.00
}`, { lang: "http", label: "Response" })}

        <h2>Los verbos y su semántica</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Verbo</th><th>Qué significa</th><th>¿Seguro?</th><th>¿Idempotente?</th><th>Éxito típico</th></tr></thead>
          <tbody>
            <tr><td>GET</td><td>Leer un recurso. No modifica nada del servidor.</td><td>✅ Sí</td><td>✅ Sí</td><td><code>200 OK</code></td></tr>
            <tr><td>POST</td><td>Crear un recurso nuevo (o disparar una acción).</td><td>❌ No</td><td>❌ <b>No</b></td><td><code>201 Created</code></td></tr>
            <tr><td>PUT</td><td>Reemplazar un recurso <b>completo</b>.</td><td>❌ No</td><td>✅ Sí</td><td><code>200</code> / <code>204</code></td></tr>
            <tr><td>PATCH</td><td>Actualizar <b>parcialmente</b>.</td><td>❌ No</td><td>Depende</td><td><code>200</code> / <code>204</code></td></tr>
            <tr><td>DELETE</td><td>Eliminar un recurso.</td><td>❌ No</td><td>✅ Sí</td><td><code>204 No Content</code></td></tr>
          </tbody>
        </table></div>
        <p><b>Seguro</b> = no modifica el estado del servidor. <b>Idempotente</b> = hacerlo N veces tiene el mismo efecto
        que hacerlo una.</p>

        <h2>Idempotencia (el concepto que más se pregunta)</h2>
        <div class="callout key">
          <div class="callout-title">🔑 Por qué importa de verdad</div>
          <p>Las redes fallan. Mandás un request, no llega la respuesta y no sabés si el servidor lo procesó o no.
          Si la operación es <b>idempotente</b>, podés <b>reintentar sin miedo</b>. Si no lo es, reintentar puede
          duplicar un cobro o crear dos reservas.</p>
          <p>Es exactamente el mismo problema en las colas de mensajes: los brokers entregan <i>at-least-once</i>, así que
          <b>tu consumidor tiene que ser idempotente</b>.</p>
        </div>
        ${APP.code(`// ❌ NO idempotente: 3 reintentos = 3 reservas
POST /reservas  { "pacienteId": 42, ... }

// ✅ Idempotente: 3 reintentos = 1 reserva, el mismo recurso
PUT /reservas/RSV-99213  { "pacienteId": 42, ... }

// ✅ POST idempotente con clave de idempotencia (lo que usan Stripe y Mercado Pago)
POST /reservas
Idempotency-Key: 7f3e9c1a-...     // si repetís la clave, devuelve la MISMA reserva`, { lang: "http", label: "Idempotencia en la práctica" })}

        <h2>Códigos de estado</h2>
        <div class="grid-2">
          <div class="card">
            <h4 style="color:var(--ok)">2xx — Éxito</h4>
            <ul>
              <li><code>200 OK</code> — éxito, va el body</li>
              <li><code>201 Created</code> — creé el recurso; devolvé el header <code>Location</code></li>
              <li><code>202 Accepted</code> — <b>lo acepté, lo proceso después</b> (el código del asincronismo)</li>
              <li><code>204 No Content</code> — éxito sin body (típico de DELETE)</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="color:var(--info)">3xx — Redirección</h4>
            <ul>
              <li><code>301 Moved Permanently</code> — cambió para siempre</li>
              <li><code>302 Found</code> — redirección temporal</li>
              <li><code>304 Not Modified</code> — usá tu caché (ahorra ancho de banda)</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="color:var(--warn)">4xx — Error del cliente</h4>
            <ul>
              <li><code>400 Bad Request</code> — request mal formado</li>
              <li><code>401 Unauthorized</code> — <b>no sé quién sos</b> (autenticación)</li>
              <li><code>403 Forbidden</code> — <b>sé quién sos y no podés</b> (autorización)</li>
              <li><code>404 Not Found</code> — no existe</li>
              <li><code>409 Conflict</code> — conflicto con el estado actual</li>
              <li><code>422 Unprocessable Entity</code> — viola una regla de negocio</li>
              <li><code>429 Too Many Requests</code> — rate limiting</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="color:var(--bad)">5xx — Error del servidor</h4>
            <ul>
              <li><code>500 Internal Server Error</code> — se rompió algo nuestro</li>
              <li><code>502 Bad Gateway</code> — el de atrás respondió mal</li>
              <li><code>503 Service Unavailable</code> — caído o saturado</li>
              <li><code>504 Gateway Timeout</code> — el de atrás no respondió a tiempo</li>
            </ul>
          </div>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Las tres confusiones que más se cobran</div>
          <ul>
            <li><b>401 vs 403:</b> 401 = <i>no te conozco</i>. 403 = <i>te conozco y no podés</i>.</li>
            <li><b>400 vs 422:</b> 400 = el JSON está roto o falta un campo. 422 = el JSON está bien pero pedís un turno
            para una fecha pasada.</li>
            <li><b>500 vs 4xx:</b> si el usuario mandó algo mal, <b>no</b> es 500. El 500 es culpa tuya.</li>
          </ul>
        </div>

        <h2>Headers importantes</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Header</th><th>Para qué sirve</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td>Content-Type</td><td>Formato del body que estoy mandando</td><td><code>application/json</code></td></tr>
            <tr><td>Accept</td><td>Formato que espero recibir</td><td><code>application/json</code></td></tr>
            <tr><td>Authorization</td><td>Credencial del cliente</td><td><code>Bearer eyJhbGci...</code></td></tr>
            <tr><td>Cache-Control</td><td>Política de caché</td><td><code>max-age=3600, public</code></td></tr>
            <tr><td>Location</td><td>URI del recurso recién creado</td><td><code>/v1/reservas/99213</code></td></tr>
            <tr><td>ETag / If-None-Match</td><td>Validación de caché (habilita el 304)</td><td><code>"33a64df5"</code></td></tr>
            <tr><td>Retry-After</td><td>Cuándo reintentar (con 429 o 503)</td><td><code>120</code></td></tr>
          </tbody>
        </table></div>

        <h2>🎮 Unir código con significado</h2>
        <p>Elegí un código a la izquierda y después su significado a la derecha.</p>
        <div class="widget" id="httpUnir"></div>

        <h2>🎮 Elegí el verbo correcto</h2>
        <div id="httpQuiz"></div>
      `;

      unir(el.querySelector("#httpUnir"));

      APP.quiz(el.querySelector("#httpQuiz"), [
        { n: 1, topic: "Verbos", type: "mc", q: "Crear un usuario nuevo", options: [
          { t: "<code>POST /usuarios</code>", ok: true },
          { t: "<code>PUT /usuarios</code>", ok: false },
          { t: "<code>POST /crearUsuario</code>", ok: false },
          { t: "<code>GET /usuarios/nuevo</code>", ok: false },
        ], explain: "POST sobre la colección. La URL nombra el recurso (sustantivo), la acción la da el verbo. Se responde <code>201 Created</code> con el header <code>Location</code>." },
        { n: 2, topic: "Verbos", type: "mc", q: "Cambiar sólo el email del usuario 123, dejando el resto igual", options: [
          { t: "<code>PATCH /usuarios/123</code>", ok: true },
          { t: "<code>PUT /usuarios/123</code>", ok: false },
          { t: "<code>POST /usuarios/123/cambiarEmail</code>", ok: false },
        ], explain: "PATCH es actualización <b>parcial</b>. PUT reemplazaría el recurso completo: si mandás sólo el email, los demás campos se borrarían." },
        { n: 3, topic: "Verbos", type: "mc", q: "Consultar la disponibilidad de un profesional en una especialidad", options: [
          { t: "<code>GET /profesionales/77/disponibilidad?especialidad=clinica</code>", ok: true },
          { t: "<code>POST /consultarDisponibilidad</code>", ok: false },
          { t: "<code>GET /getDisponibilidad/77</code>", ok: false },
        ], explain: "Es una lectura, así que GET. Los filtros van en la query string. Nada de verbos en la URL." },
        { n: 4, topic: "Verbos", type: "mc", q: "El cliente reintenta 3 veces la misma operación por un timeout de red. ¿Cuál es segura de reintentar?", options: [
          { t: "<code>DELETE /reservas/99213</code>", ok: true },
          { t: "<code>POST /reservas</code> sin clave de idempotencia", ok: false },
          { t: "<code>POST /pagos</code> sin clave de idempotencia", ok: false },
        ], explain: "DELETE es idempotente: si ya no está, sigue no estando (podés devolver 204 o 404, pero no borrás dos veces). Los POST sin clave de idempotencia crearían recursos duplicados." },
        { n: 5, topic: "Status", type: "mc", q: "El usuario manda un token vencido. ¿Qué devolvés?", options: [
          { t: "<code>401 Unauthorized</code>", ok: true },
          { t: "<code>403 Forbidden</code>", ok: false },
          { t: "<code>400 Bad Request</code>", ok: false },
        ], explain: "Token vencido o inválido = no puedo <b>autenticarte</b> → 401. El 403 es cuando ya te autenticaste pero no tenés permisos para ese recurso." },
        { n: 6, topic: "Status", type: "mc", q: "Un profesional autenticado intenta ver la historia clínica de un paciente que no es suyo. ¿Qué devolvés?", options: [
          { t: "<code>403 Forbidden</code>", ok: true },
          { t: "<code>401 Unauthorized</code>", ok: false },
          { t: "<code>404 Not Found</code>", ok: false },
        ], explain: "Sabés perfectamente quién es (está autenticado): el problema es de <b>autorización</b> → 403. (Nota: algunos sistemas devuelven 404 a propósito para no revelar que el recurso existe; eso es una decisión de seguridad y hay que justificarla.)" },
        { n: 7, topic: "Status", type: "mc", q: "El usuario pide una cobertura y el motor de IA va a tardar varios minutos. Respondés al instante con…", options: [
          { t: "<code>202 Accepted</code> + un identificador para consultar después", ok: true },
          { t: "<code>200 OK</code> con el resultado, esperando a que termine la IA", ok: false },
          { t: "<code>503 Service Unavailable</code>", ok: false },
        ], explain: "El 202 es <b>el código del asincronismo</b>: “te acepté el pedido, todavía no lo terminé”. Es la respuesta que la cátedra busca en el punto de manejo de demoras de ProtegePro y La Scalo." },
        { n: 8, topic: "Status", type: "mc", q: "Intentan crear un equipo con un código QR que ya existe en el sistema (el enunciado dice que es único).", options: [
          { t: "<code>409 Conflict</code>", ok: true },
          { t: "<code>500 Internal Server Error</code>", ok: false },
          { t: "<code>404 Not Found</code>", ok: false },
        ], explain: "409 es el código de “tu pedido choca con el estado actual del recurso”. Un 500 sería decir que la culpa es del servidor, cuando en realidad el cliente mandó un dato en conflicto." },
        { n: 9, topic: "Idempotencia", type: "vf", q: "GET es seguro e idempotente.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Seguro (no modifica) e idempotente (leer N veces devuelve lo mismo y no cambia nada). Por eso se puede cachear y reintentar libremente." },
        { n: 10, topic: "Idempotencia", type: "vf", q: "PUT no es idempotente porque modifica el recurso.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Modificar no es lo mismo que no ser idempotente. PUT reemplaza el recurso con un contenido fijo: hacerlo una vez o cinco deja el mismo resultado final. Idempotente ≠ seguro." },
      ]);
    },
  });
})();
