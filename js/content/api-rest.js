/* ============================================================
   Fundamentos — API / API REST
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "api-rest",
    title: "API / API REST",
    tag: "🔗",
    group: "Fundamentos",
    resumen: "Recursos, naming, JSON, versionado",
    keywords: ["api", "rest", "endpoint", "json", "recurso", "versionado", "bearer", "naming"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>API / API REST</h1>
          <p class="lead">La interfaz que un sistema expone para que otros lo usen. REST es un estilo específico basado en HTTP y recursos.</p>
        </div>

        <div class="analogia">
          <div class="emo">🔌</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Una API es como el <b>tomacorriente de la pared</b>: un contrato público. Vos no sabés (ni te importa) cómo
            se genera la electricidad; sabés que si enchufás algo compatible con esa ficha, va a funcionar. Y si la
            compañía cambia de central hidroeléctrica a solar, tu heladera ni se entera — <b>porque el contrato no cambió</b>.</p>
            <p>Ese último punto es lo que hace valiosa a una API: podés cambiar todo lo de adentro sin romper a nadie,
            siempre que respetes el contrato.</p>
          </div>
        </div>

        <h2>¿Qué es una API?</h2>
        <p><b>Application Programming Interface:</b> el contrato de “qué puede hacer un sistema y cómo pedírselo”.
        Define las operaciones disponibles, qué datos hay que mandar y qué se recibe.</p>

        <h2>¿Qué es REST?</h2>
        <p>Un <b>estilo arquitectónico</b> (no un protocolo, no un estándar) definido por Roy Fielding. Sus ideas centrales:</p>
        <ol class="steps">
          <li><span class="step-title">Todo es un recurso</span> Identificado por una URL: <code>/turnos/99213</code>.</li>
          <li><span class="step-title">Los verbos HTTP dan la acción</span> No inventás verbos propios: usás GET, POST, PUT, PATCH, DELETE.</li>
          <li><span class="step-title">Representaciones</span> El recurso se transfiere en algún formato — típicamente JSON.</li>
          <li><span class="step-title">Stateless</span> Cada request se basta a sí misma; el servidor no guarda sesión.</li>
          <li><span class="step-title">Interfaz uniforme</span> Todas las APIs REST se usan igual: por eso se aprenden rápido.</li>
        </ol>

        <h2>Recursos, no acciones</h2>
        <p>La regla que más se equivoca: <b>las URLs son sustantivos</b>. La acción la da el verbo HTTP.</p>
        <div class="vs-grid">
          <div class="vs-b" style="border-top-color:var(--bad)">
            <h4>❌ Mal diseñados</h4>
            <ul style="font-family:var(--mono);font-size:.84rem">
              <li>POST /crearUsuario</li>
              <li>GET /obtenerTurnosDelPaciente?id=42</li>
              <li>POST /usuarios/42/borrar</li>
              <li>GET /usuario/42 <span style="font-family:var(--font)">(singular)</span></li>
              <li>POST /api/getReservas</li>
              <li>GET /turnos/cancelar/99213</li>
            </ul>
          </div>
          <div class="vs-a" style="border-top-color:var(--ok)">
            <h4>✅ Bien diseñados</h4>
            <ul style="font-family:var(--mono);font-size:.84rem">
              <li>POST /usuarios</li>
              <li>GET /pacientes/42/turnos</li>
              <li>DELETE /usuarios/42</li>
              <li>GET /usuarios/42</li>
              <li>GET /reservas</li>
              <li>POST /turnos/99213/cancelacion</li>
            </ul>
          </div>
        </div>
        <div class="callout info">
          <p><b>¿Y las acciones que no son CRUD?</b> Como “cancelar un turno” o “aprobar una solicitud”, hay dos caminos
          aceptados: modelarlas como un <b>sub-recurso</b> (<code>POST /turnos/99213/cancelacion</code>) o como un cambio de
          estado (<code>PATCH /turnos/99213 {"estado":"CANCELADO"}</code>). Las dos son defendibles; lo que no se acepta es
          <code>POST /cancelarTurno</code>.</p>
        </div>

        <h2>Convenciones de nombres</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Regla</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td>Plural para colecciones</td><td><code>/usuarios</code>, no <code>/usuario</code></td></tr>
            <tr><td>El id identifica un elemento</td><td><code>/usuarios/123</code></td></tr>
            <tr><td>Jerarquía para pertenencia</td><td><code>/usuarios/123/pedidos</code></td></tr>
            <tr><td>No anides más de 2 niveles</td><td><code>/pedidos/55/items</code> ✅ · <code>/usuarios/1/pedidos/55/items/3/descuentos</code> ❌</td></tr>
            <tr><td>Filtros, orden y paginado en query string</td><td><code>/turnos?especialidad=clinica&amp;page=2&amp;size=20&amp;sort=fecha</code></td></tr>
            <tr><td>minúsculas y guiones medios</td><td><code>/ordenes-de-compra</code>, no <code>/OrdenesDeCompra</code></td></tr>
            <tr><td>Sin extensión</td><td><code>/usuarios/1</code>, no <code>/usuarios/1.json</code> (usá el header <code>Accept</code>)</td></tr>
          </tbody>
        </table></div>

        <h2>JSON</h2>
        <p>El formato estándar de body en APIs REST. Liviano, legible y soportado en todos los lenguajes.</p>
        ${APP.code(`{
  "codigo": "CTR-88421",
  "estado": "ACTIVA",
  "prima": 4850.75,
  "equipo": {
    "codigoQr": "QR-9F3A21",
    "tipo": "VUELO",
    "valorReferencia": 320000
  },
  "vigencia": {
    "desde": "2026-08-03T08:00:00-03:00",
    "hasta": "2026-08-03T18:00:00-03:00"
  },
  "bitacora": [
    { "fecha": "2026-08-02T19:11:00-03:00", "evento": "DESCUENTO_APLICADO", "detalle": "Bonus de confianza -10%" },
    { "fecha": "2026-08-02T19:11:02-03:00", "evento": "MARCADA_SOSPECHOSA", "detalle": "IA detectó daño (confianza 0.91)" }
  ]
}`, { lang: "json", label: "Ejemplo de respuesta" })}

        <h2>Versionado</h2>
        <p>Una vez que publicaste una API, hay clientes que dependen de ella. Si necesitás romper el contrato, versionás:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia</th><th>Ejemplo</th><th>Comentario</th></tr></thead>
          <tbody>
            <tr><td>En la ruta</td><td><code>/v1/usuarios</code></td><td>La más usada y la más visible. Fácil de rutear en el gateway.</td></tr>
            <tr><td>Por header</td><td><code>Accept: application/vnd.api.v2+json</code></td><td>URLs más limpias, pero menos evidente al debuggear.</td></tr>
            <tr><td>Por query param</td><td><code>/usuarios?version=2</code></td><td>Desaconsejada: mezcla versión con filtros.</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Agregar</b> un campo opcional a la respuesta no rompe a nadie y no requiere versionar.
          <b>Sacar</b> un campo, renombrarlo o cambiar su tipo sí rompe: eso obliga a una versión nueva.</p>
        </div>

        <h2>Autenticación</h2>
        ${APP.code(`GET /v1/perfiles/me HTTP/1.1
Host: api.talentia.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, { lang: "http", label: "Token en el header" })}
        <p>El estándar de facto es un <b>token JWT</b> en el header <code>Authorization</code> con el esquema <code>Bearer</code>.
        Encaja perfecto con REST porque mantiene la comunicación <b>stateless</b>: el token viaja en cada request y el
        servidor lo valida sin consultar una sesión. Más detalle en <a class="inline" data-go="seguridad">Seguridad</a>.</p>

        <h2>Diseñando la API de un final</h2>
        <p>Cuando el enunciado dice “<i>expone un endpoint para obtener los datos por dicho código QR</i>” (ProtegePro) o
        “<i>debe exponer un endpoint para consultar disponibilidad por profesional y especialidad</i>” (TurnoÁgil),
        se espera que escribas el endpoint concreto:</p>
        ${APP.code(`# ProtegePro · Servicio I
GET  /v1/equipos/{codigoQr}                → 200 con los datos del equipo | 404 si no existe

# TurnoÁgil · Servicio I
GET  /v1/profesionales/{matricula}/disponibilidad?especialidad=clinica&desde=2026-08-03
                                            → 200 con las franjas libres

# ProtegePro · Servicio IV (interno, sincrónico)
POST /v1/contrataciones                     → 201 Created + Location + código único
     { "codigoQr": "...", "desde": "...", "hasta": "...", "ubicacion": {...} }

# ProtegePro · Servicio IV → Servicio II (interno, sincrónico)
POST /v1/riesgo/cotizaciones                → 200 con { "prima": 4850.75, "reglasAplicadas": [...] }

# ProtegePro · Servicio IV → Servicio III (interno, ASINCRÓNICO por la demora de la IA)
   publica en la cola  validacion.solicitada  { "contratacionId": "...", "fotos": ["url1","url2"] }
   consume de la cola  validacion.resuelta    { "contratacionId": "...", "sospechosa": true, "confianza": 0.91 }`,
        { lang: "http", label: "Endpoints concretos que suman puntos" })}
        <div class="callout key">
          <div class="callout-title">🔑 Punto que casi nadie contesta completo</div>
          <p>ProtegePro pide: <i>“Elija 2 interacciones entre los servicios internos y describa si son sync/async, formato y
          dé un ejemplo de los mensajes”</i>. La respuesta completa tiene <b>cuatro partes</b>: (1) quién llama a quién,
          (2) sincrónico o asincrónico <b>y por qué</b>, (3) el formato (JSON sobre HTTP, o JSON sobre AMQP),
          (4) el mensaje concreto. Escribí las cuatro.</p>
        </div>

        <h2>🎮 Corregí el endpoint</h2>
        <div id="apiQuiz"></div>
      `;

      APP.quiz(el.querySelector("#apiQuiz"), [
        { n: 1, topic: "Naming", type: "mc", q: "Corregí: <code>POST /crearContratacion</code>", options: [
          { t: "<code>POST /contrataciones</code>", ok: true },
          { t: "<code>PUT /contrataciones/crear</code>", ok: false },
          { t: "<code>POST /contratacion/nueva</code>", ok: false },
          { t: "<code>GET /contrataciones?accion=crear</code>", ok: false },
        ], explain: "El verbo va en HTTP, no en la URL. Colección en plural. Responde <code>201 Created</code>." },
        { n: 2, topic: "Naming", type: "mc", q: "Corregí: <code>GET /obtenerTurnos?profesional=77</code>", options: [
          { t: "<code>GET /profesionales/77/turnos</code>", ok: true },
          { t: "<code>GET /getTurnos/77</code>", ok: false },
          { t: "<code>POST /turnos/buscar</code>", ok: false },
        ], explain: "Los turnos de un profesional son un sub-recurso. También sería válido <code>GET /turnos?profesionalId=77</code>: lo inaceptable es el verbo “obtener” en la ruta." },
        { n: 3, topic: "Naming", type: "mc", q: "Corregí: <code>POST /usuarios/42/borrar</code>", options: [
          { t: "<code>DELETE /usuarios/42</code>", ok: true },
          { t: "<code>POST /borrarUsuario/42</code>", ok: false },
          { t: "<code>GET /usuarios/42/delete</code>", ok: false },
        ], explain: "Existe un verbo para esto. Además DELETE es idempotente, lo que permite reintentar sin efectos raros." },
        { n: 4, topic: "Naming", type: "mc", q: "¿Cuál es la mejor forma de paginar y filtrar?", options: [
          { t: "<code>GET /postulaciones?estado=EN_PROCESO&amp;page=2&amp;size=20</code>", ok: true },
          { t: "<code>GET /postulaciones/estado/EN_PROCESO/pagina/2</code>", ok: false },
          { t: "<code>POST /postulaciones/filtrar</code> con el filtro en el body", ok: false },
        ], explain: "Filtros, orden y paginado son <b>modificadores de una consulta</b>: van en la query string. Meterlos en la ruta multiplica las rutas posibles; usar POST para consultar rompe la cacheabilidad y la semántica de “seguro”." },
        { n: 5, topic: "REST", type: "multi", q: "¿Cuáles de estas afirmaciones sobre REST son verdaderas?", options: [
          { t: "Es un estilo arquitectónico, no un protocolo", ok: true },
          { t: "La comunicación debe ser stateless", ok: true },
          { t: "Obliga a usar JSON", ok: false },
          { t: "Los recursos se identifican por URLs", ok: true },
        ], explain: "JSON es lo habitual, pero REST no lo exige: podés servir XML, CSV o lo que negocies con el header <code>Accept</code>. Lo que sí exige es interfaz uniforme, recursos identificados y stateless." },
        { n: 6, topic: "Versionado", type: "mc", q: "Vas a sacar un campo obligatorio de la respuesta de <code>/v1/perfiles</code>. ¿Qué hacés?", options: [
          { t: "Publicar <code>/v2/perfiles</code> y mantener v1 hasta que migren los clientes", ok: true },
          { t: "Sacarlo directamente: los clientes que lo usen que se adapten", ok: false },
          { t: "Dejarlo pero devolver siempre <code>null</code>", ok: false },
        ], explain: "Sacar o renombrar un campo es un cambio <b>breaking</b>. Devolver null tampoco sirve: los clientes que lo esperan se van a romper igual, sólo que más tarde y peor." },
      ]);
    },
  });
})();
