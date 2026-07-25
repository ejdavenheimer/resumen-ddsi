/* ============================================================
   Cheatsheet — HTTP en 1 hoja (imprimible)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cs-http",
    title: "Cheatsheet: HTTP",
    tag: "🃏",
    group: "Cheatsheets",
    resumen: "Verbos, status codes y headers",
    keywords: ["cheatsheet", "http", "imprimible", "verbos", "status code", "headers", "rest", "resumen"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Cheatsheet imprimible</div>
          <h1>HTTP en 1 hoja</h1>
          <p class="lead">Verbos, códigos de estado y headers, más las convenciones de REST.</p>
        </div>

        <div class="controls no-print">
          <button class="btn" id="csPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
        </div>

        <h2>Verbos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Verbo</th><th>Qué hace</th><th>Seguro</th><th>Idempotente</th><th>Éxito</th></tr></thead>
          <tbody>
            <tr><td>GET</td><td>Leer</td><td>✅</td><td>✅</td><td>200</td></tr>
            <tr><td>POST</td><td>Crear</td><td>❌</td><td>❌</td><td>201</td></tr>
            <tr><td>PUT</td><td>Reemplazar completo</td><td>❌</td><td>✅</td><td>200/204</td></tr>
            <tr><td>PATCH</td><td>Actualizar parcial</td><td>❌</td><td>Depende</td><td>200/204</td></tr>
            <tr><td>DELETE</td><td>Eliminar</td><td>❌</td><td>✅</td><td>204</td></tr>
          </tbody>
        </table></div>

        <h2>Códigos de estado</h2>
        <div class="grid-2">
          <div class="table-wrap"><table class="data">
            <thead><tr><th>2xx / 3xx</th><th>Significado</th></tr></thead>
            <tbody>
              <tr><td>200 OK</td><td>Éxito con body</td></tr>
              <tr><td>201 Created</td><td>Recurso creado (+ Location)</td></tr>
              <tr><td>202 Accepted</td><td>Aceptado, se procesa después (async)</td></tr>
              <tr><td>204 No Content</td><td>Éxito sin body</td></tr>
              <tr><td>301 / 302</td><td>Redirección permanente / temporal</td></tr>
              <tr><td>304 Not Modified</td><td>Usá tu caché</td></tr>
            </tbody>
          </table></div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>4xx / 5xx</th><th>Significado</th></tr></thead>
            <tbody>
              <tr><td>400 Bad Request</td><td>Request mal formado</td></tr>
              <tr><td>401 Unauthorized</td><td>No sé quién sos (autenticación)</td></tr>
              <tr><td>403 Forbidden</td><td>Sé quién sos y no podés (autorización)</td></tr>
              <tr><td>404 Not Found</td><td>No existe</td></tr>
              <tr><td>409 Conflict</td><td>Choca con el estado actual</td></tr>
              <tr><td>422 Unprocessable</td><td>Bien formado, viola regla de negocio</td></tr>
              <tr><td>429 Too Many Requests</td><td>Rate limiting</td></tr>
              <tr><td>500 / 502 / 503</td><td>Error del servidor / gateway / caído</td></tr>
            </tbody>
          </table></div>
        </div>

        <h2>Headers importantes</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Header</th><th>Para qué</th></tr></thead>
          <tbody>
            <tr><td>Content-Type</td><td>Formato del body que mando (application/json)</td></tr>
            <tr><td>Accept</td><td>Formato que espero recibir</td></tr>
            <tr><td>Authorization</td><td>Credencial (Bearer &lt;token&gt;)</td></tr>
            <tr><td>Cache-Control</td><td>Política de caché (max-age, no-store)</td></tr>
            <tr><td>Location</td><td>URI del recurso creado (con 201)</td></tr>
            <tr><td>ETag / If-None-Match</td><td>Validación de caché (habilita el 304)</td></tr>
            <tr><td>Retry-After</td><td>Cuándo reintentar (con 429 / 503)</td></tr>
          </tbody>
        </table></div>

        <h2>REST — reglas de oro</h2>
        <div class="grid-2">
          <div class="card">
            <h4 style="margin-top:0;color:var(--ok)">✅ Bien</h4>
            <ul style="font-family:var(--mono);font-size:.82rem">
              <li>POST /usuarios</li>
              <li>GET /usuarios/123/pedidos</li>
              <li>DELETE /usuarios/123</li>
              <li>GET /turnos?estado=CONFIRMADO&amp;page=2</li>
            </ul>
          </div>
          <div class="card">
            <h4 style="margin-top:0;color:var(--bad)">❌ Mal</h4>
            <ul style="font-family:var(--mono);font-size:.82rem">
              <li>POST /crearUsuario</li>
              <li>GET /obtenerPedidos?u=123</li>
              <li>GET /usuarios/borrar/123</li>
              <li>GET /usuario/123 (singular)</li>
            </ul>
          </div>
        </div>
        <ul>
          <li><b>Recursos = sustantivos</b> en plural; el verbo lo da HTTP.</li>
          <li><b>Filtros, orden y paginado</b> van en la query string.</li>
          <li><b>Jerarquía</b> para pertenencia; no más de 2 niveles.</li>
          <li><b>Versioná</b> antes de romper un contrato (<code>/v1/</code>).</li>
          <li><b>Idempotencia</b> = poder reintentar sin duplicar. Clave con reintentos y colas.</li>
        </ul>

        <div class="callout key no-print">
          <div class="callout-title">🔑 Las 3 confusiones que más se cobran</div>
          <p><b>401 vs 403:</b> no te conozco / te conozco y no podés. · <b>400 vs 422:</b> JSON roto / JSON válido que
          viola una regla. · <b>202:</b> el código del asincronismo (“acepté, lo proceso después”).</p>
        </div>
      `;
      el.querySelector("#csPrint").addEventListener("click", function () { window.print(); });
    },
  });
})();
