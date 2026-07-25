/* ============================================================
   Diagramas UML — Diagrama de Secuencia
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "uml-secuencia",
    title: "Diagrama de Secuencia",
    tag: "📐",
    group: "Diagramas UML",
    resumen: "Interacción temporal entre objetos",
    keywords: ["diagrama de secuencia", "secuencia", "lifeline", "mensaje", "activacion", "alt", "loop", "sincronico", "asincronico"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Diagramas UML</div>
          <h1>Diagrama de Secuencia</h1>
          <p class="lead">Muestra la interacción temporal entre objetos: quién le habla a quién, y en qué orden.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">📌 Los finales lo piden explícitamente</div>
          <p>ProtegePro: <i>“Explique mediante diagramas de secuencia cómo se realiza una reserva, suponiendo que todo
          salga bien”</i>. Cuando dice “suponiendo que todo salga bien” pide sólo el <b>happy path</b> (sin los <code>alt</code>
          de error).</p>
        </div>

        <h2>Para qué sirve</h2>
        <p>Responde <b>“¿quién le habla a quién, en qué orden?”</b> para cumplir un caso de uso. Es la vista <b>dinámica</b>
        (el diagrama de clases es la estática). Muestra el flujo de mensajes a lo largo del tiempo, que corre de arriba
        hacia abajo.</p>

        <h2>Elementos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Actor</b></td><td>Quien inicia (usuario, sistema externo). Se dibuja como monigote, a la izquierda.</td></tr>
            <tr><td><b>Lifeline</b> (línea de vida)</td><td>Una por objeto/componente que participa. Rectángulo arriba + línea punteada vertical hacia abajo.</td></tr>
            <tr><td><b>Mensaje</b></td><td>Flecha horizontal de una lifeline a otra, etiquetada con el método.</td></tr>
            <tr><td>Flecha <b>llena</b> →</td><td>Llamada sincrónica</td></tr>
            <tr><td>Flecha <b>abierta</b> →</td><td>Llamada asincrónica</td></tr>
            <tr><td>Flecha <b>punteada</b> ←</td><td>Respuesta / return</td></tr>
            <tr><td><b>Barra de activación</b></td><td>Rectángulo fino sobre la lifeline: ese objeto está ejecutando algo.</td></tr>
            <tr><td><b>Self-message</b></td><td>Flecha que sale y vuelve al mismo objeto.</td></tr>
          </tbody>
        </table></div>

        <h3>Fragmentos combinados</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Fragmento</th><th>Equivale a</th></tr></thead>
          <tbody>
            <tr><td><code>alt</code></td><td>Alternativa (if / else)</td></tr>
            <tr><td><code>opt</code></td><td>Opcional (if sin else)</td></tr>
            <tr><td><code>loop</code></td><td>Repetición</td></tr>
            <tr><td><code>par</code></td><td>Ejecución paralela</td></tr>
          </tbody>
        </table></div>

        <h2>Ejemplo completo (usalo de modelo)</h2>
        ${APP.uml(`sequenceDiagram
    actor Usuario
    participant C as ReservaController
    participant S as ReservaService
    participant V as ValidadorClinico
    participant R as ReservaRepository
    Usuario->>C: POST /reservas (datos)
    activate C
    C->>S: crearReserva(datos)
    activate S
    S->>V: validar(cuestionario)
    activate V
    V-->>S: resultadoValidacion
    deactivate V
    alt validación OK
        S->>R: guardar(reserva)
        R-->>S: reservaGuardada
        S-->>C: reserva
    else requiere revisión
        S->>R: guardar(reserva, estado=REQUIERE_REVISION)
        R-->>S: reservaGuardada
        S-->>C: reserva pendiente
    end
    deactivate S
    C-->>Usuario: 201 Created
    deactivate C`, "Reserva con validación (alt)")}

        <div class="callout key">
          <div class="callout-title">✏️ Cómo dibujarlo rápido a mano</div>
          <ol>
            <li>Poné el <b>actor</b> a la izquierda del todo.</li>
            <li>Ordená los participantes de izquierda a derecha siguiendo el flujo: controller → service → repository → externos.</li>
            <li>Dibujá las líneas de vida punteadas hacia abajo, bien largas.</li>
            <li>Las flechas van de arriba hacia abajo en <b>orden cronológico</b>. No cruces flechas.</li>
            <li>Etiquetá cada flecha con el <b>método y sus parámetros clave</b>.</li>
            <li>Las <b>respuestas</b> van con flecha punteada.</li>
            <li>Si hay un if, dibujá el recuadro <code>alt</code> con la condición arriba a la izquierda.</li>
            <li><b>Tip de tiempo:</b> no hace falta dibujar todas las barras de activación si vas corto; con las flechas ordenadas se entiende.</li>
          </ol>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Errores típicos</div>
          <ul>
            <li>Poner clases que no participan realmente en <i>este</i> caso de uso.</li>
            <li>Olvidar las flechas de <b>retorno</b>.</li>
            <li>Mezclar el orden temporal (las flechas de abajo pasan <i>después</i> que las de arriba).</li>
            <li>Mostrar sólo el happy path cuando el enunciado pide contemplar errores — o al revés, meter <code>alt</code>
            de error cuando dice “suponiendo que todo salga bien”.</li>
          </ul>
        </div>

        <h2>🎮 Ordená la secuencia</h2>
        <p>Tocá los mensajes en el orden cronológico correcto.</p>
        <div class="widget" id="seqBox"></div>
      `;

      APP.ordenarSecuencia(el.querySelector("#seqBox"), [
        {
          enunciado: "<b>Alta de contratación (ProtegePro).</b> El usuario contrata un seguro; el sistema cotiza y encola la validación con IA, respondiendo de inmediato.",
          mensajes: [
            "Usuario → Contratación: contratar(datos)",
            "Contratación → Inventario: GET /equipos/{qr}",
            "Inventario ⇠ Contratación: datos del equipo",
            "Contratación → MotorDeRiesgo: cotizar(contexto)",
            "MotorDeRiesgo ⇠ Contratación: prima + reglas aplicadas",
            "Contratación → Broker: publicar validacion.solicitada",
            "Contratación ⇠ Usuario: 202 Accepted (código + prima)",
          ],
          explicacion: "Primero se traen los datos del equipo, se cotiza (sincrónico y rápido), y recién ahí se publica la validación asincrónica y se responde 202 sin esperar a la IA.",
        },
        {
          enunciado: "<b>Cambio de estado de una solicitud (GTV).</b> La entidad acepta una solicitud, lo que dispara las acciones configuradas.",
          mensajes: [
            "Entidad → Solicitud: cambiarEstado(ACEPTADO, motivo)",
            "Solicitud → EstadoActual: validarTransicionA(ACEPTADO)",
            "Solicitud → Bitácora: registrar(anterior, nuevo, motivo, actor)",
            "Solicitud → ConfiguraciónDeEstado: alEntrar(contexto)",
            "ConfiguraciónDeEstado → Acción: ejecutar(contexto)",
          ],
          explicacion: "Se valida la transición, se registra la trazabilidad, y por último se disparan las acciones configuradas (Command) sin que la solicitud conozca cuáles son.",
        },
        {
          enunciado: "<b>Préstamo de un ejemplar (Libros Circulares), camino feliz.</b>",
          mensajes: [
            "Usuario → RealizarPréstamoService: ejecutar(ejemplarId, de, a, venc)",
            "Service → EjemplarRepository: porId(ejemplarId)",
            "EjemplarRepository ⇠ Service: ejemplar",
            "Service → Ejemplar: prestar(de, a, venc)",
            "Ejemplar → EstadoActual: prestar(...) [valida tenencia y comunidad]",
            "Service → EjemplarRepository: guardar(ejemplar)",
            "Service → Broker: publicar PrestamoRealizado",
          ],
          explicacion: "El service orquesta: trae el ejemplar, le delega la operación (las reglas viven en el estado del dominio), persiste y publica el evento para los interesados.",
        },
        {
          enunciado: "<b>Consulta de disponibilidad (TurnoÁgil).</b> Lectura sincrónica simple.",
          mensajes: [
            "Usuario → AgendaController: GET /profesionales/{m}/disponibilidad",
            "AgendaController → AgendaService: consultar(matricula, especialidad, fecha)",
            "AgendaService → AgendaRepository: franjasLibres(...)",
            "AgendaRepository ⇠ AgendaService: franjas",
            "AgendaService ⇠ AgendaController: disponibilidad",
            "AgendaController ⇠ Usuario: 200 OK (JSON)",
          ],
          explicacion: "Una lectura no lleva broker ni async: controller → service → repository y la respuesta vuelve por el mismo camino. Simple y sincrónico.",
        },
      ]);
    },
  });
})();
