/* ============================================================
   Modelos HIDRA para imprimir — respuestas directas (máx 2 hojas c/u)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "hidra-imprimible",
    title: "⬇️ 3 modelos HIDRA para imprimir",
    tag: "⬇️",
    group: "Parcial HIDRA (práctica)",
    resumen: "Respuestas directas · descargable",
    keywords: ["hidra", "imprimir", "descargar", "modelos", "respuestas", "resolucion", "parcial"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · respuestas directas</div>
          <h1>Los 3 modelos HIDRA — resueltos, para imprimir</h1>
          <p class="lead">Mini enunciado + solución de cada sección + verdadero/falso justificados. Máximo 2 hojas por modelo.</p>
        </div>
        <div class="callout key resumen-print-btn">
          <div class="callout-title">📥 Descargar</div>
          <p style="margin:.2rem 0 .5rem">Tocá el botón → destino <b>“Guardar como PDF”</b>, tamaño <b>A4</b>, activá <b>“Gráficos de fondo”</b>.</p>
          <button class="btn js-print" type="button">📥 Descargar los 3 modelos (PDF)</button>
        </div>

        <!-- ===================== MODELO 1 ===================== -->
        <section class="hoja">
          <span class="hoja-num">MODELO 1 · MEDICIÓN Y FACTURACIÓN</span>
          <h2>Mini enunciado</h2>
          <p class="mini"><b>HIDRA</b>: red de agua con <b>caudalímetros inteligentes</b>. <b>Servicio I</b> — Suministros (cada uno con <b>categoría</b>: residencial/comercial/industrial/social, y <b>estado</b>: activo/cortado/limitado/baja; según el estado se puede o no operar) y sus medidores. <b>Servicio II</b> — Ingesta de lecturas (cientos de miles de medidores, con <b>picos</b>; llegan <b>duplicadas y fuera de orden</b>). <b>Servicio III</b> — Facturación por <b>esquema tarifario</b> según la categoría (residencial por tramos, comercial, social; <b>pueden agregarse más</b>; guardar el <b>detalle</b> del cálculo). <b>Servicio IV</b> — Cobros vía <b>pasarela de pago externa</b> que confirma por <b>webhook</b> (el dinero real está fuera de alcance). Se pide: dominio (I y III), Arquitectura I (ingesta), Arquitectura II (pasarela), Modelo de datos.</p>

          <h2>Solución</h2>
          <p class="mini"><b>① Modelado de Dominio.</b> <b>State (Estado)</b> para el suministro: activo/cortado/limitado/baja; cada estado sabe qué operaciones acepta (no se factura uno de baja) → evita <i>if</i> por estado. <b>Strategy (Estrategia)</b> para el esquema tarifario: cada tarifa es una clase (residencial por tramos, comercial, social); “pueden agregarse más” = <b>Abierto/Cerrado</b>. La <b>Factura</b> guarda una <b>lista de ítems</b> (el detalle: cada tramo, cargo fijo, impuesto), no un número suelto.</p>
          <div class="uml">${APP.uml(`classDiagram
    class Suministro
    class EstadoSuministro { <<interface>> }
    class Activo
    class Cortado
    class EsquemaTarifario { <<interface>> }
    class Residencial
    class Comercial
    class Factura
    class ItemFactura
    Suministro --> EstadoSuministro : estado
    EstadoSuministro <|.. Activo : implementa
    EstadoSuministro <|.. Cortado : implementa
    Suministro ..> EsquemaTarifario : usa
    EsquemaTarifario <|.. Residencial : implementa
    EsquemaTarifario <|.. Comercial : implementa
    Factura o-- ItemFactura : detalle`)}</div>
          <p class="mini"><b>② Arquitectura I (ingesta).</b> Los medidores publican por <b>MQTT</b> en un <b>broker/cola</b> que <b>amortigua los picos</b>. <b>Workers</b> consumen en paralelo (escalan sumando workers). El consumidor es <b>idempotente</b>: deduplica por (medidor + fecha/hora), y como cada lectura trae el <b>consumo acumulado</b>, no importa el orden de llegada. Las lecturas se guardan en una base de <b>series temporales</b> (mucho volumen por tiempo).</p>
          <p class="mini"><b>③ Arquitectura II (pasarela de pago).</b> <b>Adapter (Adaptador)</b>: defino mi interfaz <code>PasarelaDePagos</code> y un adapter por proveedor → cambiar de proveedor es otro adapter. Flujo <b>asincrónico</b>: creo la orden de pago, respondo “pendiente” (202) y me entero del resultado por <b>webhook</b> (la pasarela me llama cuando se acredita). El webhook es <b>idempotente</b> (puede llegar repetido → no acreditar dos veces). El movimiento bancario real queda <b>fuera de alcance</b>: sólo guardo estado (pendiente/aprobado/rechazado) + id.</p>
          <p class="mini"><b>④ Modelo de datos</b> <span class="pill gray">confirmá si entra</span><b>.</b> Cuenta <b>1—N</b> Suministro · Suministro <b>0..1</b> Caudalímetro · Suministro <b>1—N</b> Factura · Factura <b>1—N</b> ItemFactura. Cada entidad con PK; relaciones con FK, cardinalidad y modalidad. (Las lecturas, si va, en series temporales aparte.)</p>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“El esquema tarifario conviene con Strategy.” → <b>V</b>: hay algoritmos alternativos y pueden agregarse más; cada uno una clase (Abierto/Cerrado), bajo acoplamiento.</li>
            <li>“El estado del suministro alcanza con un atributo texto.” → <b>F</b>: como las operaciones válidas cambian según el estado, es <b>State</b> (encapsula transiciones, sin <i>if</i>).</li>
            <li>“La ingesta de lecturas debe ser sincrónica para no perder datos.” → <b>F</b>: con picos y volumen va <b>asincrónica con cola</b> que amortigua; sincrónica colapsaría.</li>
            <li>“El consumidor de lecturas debe ser idempotente.” → <b>V</b>: llegan duplicadas y por reintentos; deduplica por medidor + timestamp.</li>
            <li>“El sistema espera bloqueado la confirmación del pago.” → <b>F</b>: es <b>asincrónica por webhook</b>; responde ‘pendiente’ y sigue.</li>
          </ol>
        </section>

        <!-- ===================== MODELO 2 ===================== -->
        <section class="hoja">
          <span class="hoja-num">MODELO 2 · FUGAS Y ANOMALÍAS</span>
          <h2>Mini enunciado</h2>
          <p class="mini"><b>HIDRA</b> detecta pérdidas de agua. <b>Servicio I</b> — Monitoreo: aplica <b>reglas de detección</b> (consumo anómalo, fuga = caudal bajo pero <b>constante de madrugada</b>, rotura = caída brusca de presión, conexión clandestina); se aplican <b>combinadas</b> y <b>pueden agregarse más</b>; cada una genera una alerta con severidad. <b>Servicio II</b> — Órdenes de trabajo con <b>ciclo de vida</b>: Detectada→Asignada→En inspección→Confirmada/Descartada→Resuelta (no se resuelve sin inspeccionar); <b>trazabilidad</b> completa. <b>Servicio III</b> — Notificaciones a usuario/cuadrilla/ente (<b>servicios separados</b>, pueden sumarse más). <b>Servicio IV</b> — Acción remota: cortar/limitar (se <b>encolan</b> y <b>auditan</b>). Se pide: dominio (I y II), Arq I (pipeline de detección), Arq II (notificaciones + acción remota), datos.</p>

          <h2>Solución</h2>
          <p class="mini"><b>① Modelado de Dominio.</b> <b>Strategy en colección</b> (motor de reglas): interfaz <code>ReglaDeDeteccion</code>, cada regla decide sola si se cumple (<code>evaluar</code>); el motor guarda una <b>lista</b> y la recorre → agregar una regla es una clase nueva, sin <i>if</i> por tipo. <b>State (Estado)</b> para la Orden de Trabajo: según el estado cambian las acciones válidas (“no se resuelve sin inspeccionar”). <b>Trazabilidad</b> = bitácora de transiciones (actor, fecha, observación).</p>
          <div class="uml">${APP.uml(`classDiagram
    class MotorDeDeteccion
    class ReglaDeDeteccion { <<interface>> }
    class ConsumoAnomalo
    class Fuga
    class OrdenDeTrabajo
    class EstadoOrden { <<interface>> }
    class Transicion
    MotorDeDeteccion o-- ReglaDeDeteccion : tiene muchas
    ReglaDeDeteccion <|.. ConsumoAnomalo : implementa
    ReglaDeDeteccion <|.. Fuga : implementa
    OrdenDeTrabajo --> EstadoOrden : estado
    OrdenDeTrabajo o-- Transicion : trazabilidad`)}</div>
          <p class="mini"><b>② Arquitectura I (pipeline de detección).</b> Las lecturas llegan por el <b>broker</b> (asincrónico, amortigua). El <b>motor de detección</b> consume el flujo y evalúa las reglas sobre una <b>ventana de tiempo</b> (la fuga “caudal constante de madrugada” necesita ver varias horas, no una sola lectura). Cuando una regla se cumple, publica el evento <code>AlertaDetectada</code>.</p>
          <p class="mini"><b>③ Arquitectura II (notificaciones + acción remota).</b> Notificaciones = <b>Publicación-Suscripción</b> con broker: los notificadores están <b>desplegados por separado</b>, el que publica no los conoce y sumar un destinatario no lo modifica. Acción remota (cortar/limitar) = <b>Command (Comando)</b>: se <b>encola</b>, se ejecuta sobre el medidor y queda <b>auditada</b>; desacopla al operador (quien ordena) del medidor (quien ejecuta).</p>
          <p class="mini"><b>④ Modelo de datos</b> <span class="pill gray">confirmá si entra</span><b>.</b> Regla · Alerta (FK regla, severidad) · OrdenTrabajo (FK alerta, estado) <b>1—N</b> Transicion (actor, fecha) · Comando (acción, ordenado_por). PK/FK/cardinalidad en cada relación.</p>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“Las reglas de detección conviene con Strategy en colección.” → <b>V</b>: se aplican combinadas y pueden sumarse; el motor guarda una lista y las recorre.</li>
            <li>“Las notificaciones entre servicios separados se hacen con Observer.” → <b>F</b>: Observer es <b>in-process</b>; entre servicios separados va <b>Publicación-Suscripción</b> con broker.</li>
            <li>“El ciclo de vida de la orden de trabajo se modela con State.” → <b>V</b>: según el estado cambian las acciones válidas.</li>
            <li>“La fuga ‘caudal constante de madrugada’ se detecta con una sola lectura.” → <b>F</b>: necesita una <b>ventana de tiempo</b> (varias lecturas).</li>
            <li>“La acción remota de corte conviene con Command.” → <b>V</b>: se encola, se audita y desacopla al que ordena del que ejecuta.</li>
          </ol>
        </section>

        <!-- ===================== MODELO 3 ===================== -->
        <section class="hoja">
          <span class="hoja-num">MODELO 3 · SUMINISTRO REMOTO Y ENTE REGULADOR</span>
          <h2>Mini enunciado</h2>
          <p class="mini"><b>HIDRA</b>: gestión remota del suministro y rendición al <b>ente regulador</b>. <b>Servicio I</b> — Usuarios con <b>roles</b> (ciudadano, operador, inspector, ente); <b>datos personales sensibles</b>. <b>Servicio II</b> — Gestión remota: cortar/reponer/limitar; el suministro tiene <b>ciclo de vida</b> (no cortar si ya está cortado); las órdenes se pueden <b>programar</b>, se <b>encolan</b> y se <b>auditan</b>. <b>Servicio III</b> — Reportería: indicadores <b>periódicos</b> al ente, cuya <b>API es externa (no nuestra)</b>. <b>Servicio IV</b> — Canales: portal web del ciudadano + app del inspector (a veces <b>sin conexión</b>). Se pide: dominio (I y II), Arq I (canales + seguridad), Arq II (reportería + confidencialidad), datos.</p>

          <h2>Solución</h2>
          <p class="mini"><b>① Modelado de Dominio.</b> <b>State (Estado)</b> del suministro: activo/cortado/limitado/baja; cada estado sabe qué acepta (no cortar uno ya cortado). <b>Command (Comando)</b> para las acciones remotas: cada acción es un objeto con su configuración → se puede <b>programar</b> (corte por deuda a futuro), <b>encolar</b> y <b>auditar</b>; desacopla al operador del medidor. Guardo el <b>historial</b> de acciones. Usuarios con <b>roles (RBAC)</b>.</p>
          <div class="uml">${APP.uml(`classDiagram
    class Suministro
    class EstadoSuministro { <<interface>> }
    class Comando { <<interface>> }
    class Cortar
    class Limitar
    class AccionEjecutada
    Suministro --> EstadoSuministro : estado
    Suministro o-- AccionEjecutada : historial
    Comando <|.. Cortar : implementa
    Comando <|.. Limitar : implementa
    Comando ..> Suministro : opera`)}</div>
          <p class="mini"><b>② Arquitectura I (canales + seguridad).</b> Web y mobile son <b>dos clientes de la misma API REST</b> (multi-canal con lo del temario; el gateway/BFF sería un plus, y no está en el temario). El inspector <b>offline</b>: guarda local y <b>sincroniza</b> al recuperar conexión (operaciones idempotentes para no duplicar). Seguridad por <b>roles (RBAC)</b> en el backend; contraseñas <b>hasheadas</b>.</p>
          <p class="mini"><b>③ Arquitectura II (reportería + confidencialidad).</b> Reportería = <b>Cron (tarea programada)</b> periódica + <b>Adapter</b> a la API del ente (externa, no nuestra); si hay varias instancias, garantizar <b>ejecución única</b>. Confidencialidad de los datos personales = <b>cifrado en reposo</b> (AES a nivel columna) para los campos sensibles + <b>TLS</b> en tránsito + control de acceso. El <b>hash no sirve</b> acá (los datos hay que poder leerlos; el hash es sólo para contraseñas).</p>
          <p class="mini"><b>④ Modelo de datos</b> <span class="pill gray">confirmá si entra</span><b>.</b> Usuario <b>N—M</b> Rol (tabla intermedia Usuario_Rol) · Suministro <b>1—N</b> AccionEjecutada (acción, ordenado_por, fecha, resultado). PK/FK/cardinalidad.</p>

          <h2>Verdadero / Falso justificados</h2>
          <ol class="mini">
            <li>“Las acciones de corte programables conviene con Command.” → <b>V</b>: objeto con configuración, encolable, programable y auditable.</li>
            <li>“La confidencialidad de datos personales se logra con HTTPS.” → <b>F</b>: HTTPS protege el <b>tránsito</b>; los datos <b>almacenados</b> van con <b>cifrado en reposo</b>.</li>
            <li>“La reportería periódica al ente se hace con Cron + Adapter.” → <b>V</b>: periódica (cron) hacia una API externa que no controlamos (adapter).</li>
            <li>“Para multi-canal (web + mobile) hace falta sí o sí un API Gateway.” → <b>F</b>: alcanza con varios <b>clientes sobre la misma API REST</b>; el gateway/BFF es un plus (no está en el temario).</li>
            <li>“Las contraseñas se guardan cifradas para poder recuperarlas.” → <b>F</b>: se guardan <b>hasheadas</b> (con salt); el hash es irreversible (por eso ‘olvidé mi contraseña’ crea una nueva).</li>
          </ol>
        </section>
      `;
      el.querySelector(".js-print"); // el handler global se encarga del click
      APP.rerenderMermaid(el);
    },
  });
})();
