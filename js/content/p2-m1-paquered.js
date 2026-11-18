/* ============================================================
   P2 · Modelo 1 — PaqueRed (contexto real del parcial 18/11/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-m1-paquered",
    title: "Modelo 1 · PaqueRed (lockers)",
    tag: "📦",
    group: "Parcial 2 (práctica)",
    resumen: "Tu contexto: DER + auditar 3FN + desnormalización + arquitectura, resuelto",
    keywords: ["paquered", "locker", "casillero", "paquete", "modelo", "parcial", "simulacro", "der", "formas normales", "desnormalizacion", "monolito", "microservicios", "cdn", "ttl", "circuit breaker"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Modelo 1 · tu contexto</div>
          <h1>PaqueRed — red de lockers inteligentes</h1>
          <p class="lead">Armado sobre el <b>contexto real que te dieron</b> y la estructura que reportaron los turnos anteriores: un <b>DER con justificación</b>, un <b>DER dado para auditar contra las 3FN</b>, un punto de <b>desnormalización</b> y arquitectura con <b>métricas/logs, circuit breaker, CDN y caché con TTL, diagrama de despliegue</b> y la decisión <b>monolito vs. servicios</b>.</p>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Cómo usar esta página</div>
          <p><b>Resolvé cada punto en papel ANTES de abrir la solución.</b> Leer la respuesta sin haberla intentado no entrena nada, y mañana vas a tener que producirla de cero. Tiempo sugerido: <b>40 min</b> el modelo de datos, <b>45 min</b> arquitectura.</p>
        </div>

        <h2>Enunciado</h2>
        <div class="enunciado">
          <h3>Contexto general</h3>
          <p><b>PaqueRed</b> opera una red de <b>lockers inteligentes</b> para la entrega y el retiro de paquetes de
          comercios electrónicos. Los <b>transportistas depositan</b> paquetes en un casillero, los <b>destinatarios los
          retiran</b> y la empresa <b>opera y audita</b> la red. El Sistema se compone de <b>tres servicios, cada uno con
          su propia base de datos</b>.</p>

          <h3>Servicio I — Red y Lockers</h3>
          <p>Administra la <b>infraestructura física</b> de la red. Cada <b>locker</b> es una torre instalada en un punto
          (un local adherido, una estación de servicio, el hall de un edificio) y tiene una <b>dirección</b>, coordenadas
          geográficas, una <b>zona</b> operativa a cargo de un responsable, y <b>horarios de atención</b> que pueden
          variar por día de la semana. Cada locker está compuesto por varios <b>casilleros</b> numerados, y cada casillero
          tiene un <b>tamaño</b> (S, M, L, XL) con sus medidas, y un <b>estado operativo</b> (libre, ocupado, fuera de
          servicio). La empresa registra las <b>intervenciones de mantenimiento</b> sobre los casilleros, indicando fecha,
          tipo de intervención y el técnico interviniente. Interesa saber, por locker, su <b>capacidad por tamaño</b> y
          qué casilleros están disponibles en cada momento.</p>

          <h3>Servicio II — Envíos y Entregas</h3>
          <p>Es el servicio transaccional. Los <b>comercios</b> (clientes de PaqueRed) generan <b>envíos</b>: cada envío
          tiene un <b>número de seguimiento único</b>, un <b>destinatario</b>, el <b>locker de destino</b> elegido, el
          <b>tamaño de casillero requerido</b> y un <b>importe</b>. Un envío puede contener <b>uno o varios bultos</b>, de
          los que se conoce peso y dimensiones. Cuando el <b>transportista deposita</b> el envío, el sistema le asigna un
          <b>casillero concreto</b> y genera un <b>código de retiro</b> que se envía al destinatario por mail y SMS; el
          código <b>vence</b> y puede <b>regenerarse</b>. El destinatario <b>retira</b> el paquete ingresando el código.
          Si no lo retira dentro del <b>plazo de permanencia</b>, el envío pasa a <b>vencido</b> y se genera una
          <b>devolución</b> al comercio. De cada envío hay que poder reconstruir <b>todo su historial de estados</b> (quién
          hizo qué y cuándo), porque los comercios reclaman. El comprobante de entrega <b>debe poder reimprimirse tal
          como se emitió</b>.</p>

          <h3>Servicio III — Operación y Auditoría</h3>
          <p>Recibe de cada locker los <b>eventos de apertura y cierre</b> de casillero y el <b>estado de los sensores</b>
          (puerta, peso, conectividad, batería del módulo), que llegan de forma <b>periódica y masiva</b>. Con eso audita
          la red y genera <b>métricas agregadas</b>: ocupación promedio por locker y por franja horaria, tiempo promedio
          de permanencia de un paquete, porcentaje de envíos vencidos por zona, top 10 de lockers más usados del mes y
          casilleros con más fallas. Las métricas se consultan desde un <b>tablero</b> de la empresa.</p>

          <h3>Alcance y requerimientos</h3>
          <ol>
            <li>Que los comercios generen envíos y consulten su estado.</li>
            <li>Que el transportista deposite un paquete y el sistema le asigne un casillero disponible del tamaño requerido.</li>
            <li>Que el destinatario retire el paquete con un código de un solo uso.</li>
            <li>Que se registren y auditen todos los eventos de los lockers.</li>
            <li>Que la empresa visualice las métricas de operación.</li>
            <li>El envío de notificaciones (mail y SMS) en todos los casos planteados.</li>
          </ol>
        </div>

        <h2>Punto 1 — Modelo de Datos: DER con justificación</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio II (Envíos y Entregas)</b>, indicando las entidades con sus
          respectivos campos, <b>claves primarias</b>, <b>foráneas</b>, <b>cardinalidad</b>, <b>modalidad</b> y
          <b>restricciones</b> según corresponda. Indique todos los <b>supuestos</b> que considere necesarios y
          <b>justifique todas las decisiones de diseño</b>.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 1</summary>
          ${APP.uml(`erDiagram
    COMERCIO ||--o{ ENVIO : genera
    DESTINATARIO ||--o{ ENVIO : recibe
    ENVIO ||--|{ BULTO : "contiene (1,N)"
    ENVIO ||--o| OCUPACION_CASILLERO : "ocupa (0,1)"
    ENVIO ||--o{ CODIGO_RETIRO : "tiene (0,N)"
    ENVIO ||--|{ EVENTO_ENVIO : "registra (1,N)"
    ENVIO ||--o| DEVOLUCION : "genera (0,1)"
    TRANSPORTISTA ||--o{ EVENTO_ENVIO : realiza
    COMERCIO {
      int id_comercio PK
      string razon_social "NOT NULL"
      string cuit "UNIQUE NOT NULL"
      string email "NOT NULL"
      string plan "CHECK (BASICO, PREMIUM)"
      boolean activo "NOT NULL"
    }
    DESTINATARIO {
      int id_destinatario PK
      string documento "UNIQUE"
      string nombre "NOT NULL"
      string email
      string telefono
    }
    ENVIO {
      int id_envio PK
      string nro_seguimiento "UNIQUE NOT NULL"
      int id_comercio FK "NOT NULL"
      int id_destinatario FK "NOT NULL"
      int id_locker "ID LOGICO - Servicio I - NOT NULL"
      string tamanio_requerido "CHECK (S,M,L,XL) NOT NULL"
      string estado "CHECK (CREADO, EN_TRANSITO, DEPOSITADO, RETIRADO, VENCIDO, DEVUELTO)"
      decimal importe "DECIMAL(12,2) NOT NULL"
      datetime fecha_creacion "NOT NULL"
      datetime fecha_deposito "NULL - hasta que se deposita"
      datetime fecha_limite_retiro "NULL - se calcula al depositar"
      datetime fecha_retiro "NULL"
      string nombre_destinatario_emision "congelado"
      string documento_destinatario_emision "congelado"
      string direccion_locker_emision "congelado"
    }
    BULTO {
      int id_bulto PK
      int id_envio FK "NOT NULL"
      decimal peso_kg "DECIMAL(6,3) NOT NULL"
      int alto_cm
      int ancho_cm
      int profundidad_cm
      string descripcion
    }
    OCUPACION_CASILLERO {
      int id_ocupacion PK
      int id_envio FK "UNIQUE NOT NULL"
      int id_locker "ID LOGICO - NOT NULL"
      int nro_casillero "ID LOGICO - NOT NULL"
      datetime desde "NOT NULL"
      datetime hasta "NULL mientras esta ocupado"
    }
    CODIGO_RETIRO {
      int id_codigo PK
      int id_envio FK "NOT NULL"
      string codigo_hash "NOT NULL - hasheado, nunca en claro"
      datetime generado_en "NOT NULL"
      datetime expira_en "NOT NULL"
      datetime usado_en "NULL"
      string estado "CHECK (VIGENTE, USADO, EXPIRADO, REVOCADO)"
    }
    EVENTO_ENVIO {
      int id_evento PK
      int id_envio FK "NOT NULL"
      string estado_resultante "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string origen "CHECK (TRANSPORTISTA, DESTINATARIO, SISTEMA, OPERADOR)"
      int id_transportista FK "NULL"
      string actor_nombre_evento "congelado"
      string motivo
    }
    TRANSPORTISTA {
      int id_transportista PK
      string legajo "UNIQUE NOT NULL"
      string nombre "NOT NULL"
      string empresa
    }
    DEVOLUCION {
      int id_devolucion PK
      int id_envio FK "UNIQUE NOT NULL"
      datetime fecha "NOT NULL"
      string motivo "CHECK (VENCIDO, RECHAZADO, DANIADO)"
      string estado "CHECK (PENDIENTE, EN_TRANSITO, ENTREGADA)"
    }`, "Servicio II — Envíos y Entregas")}

          <h3>Supuestos</h3>
          <ul>
            <li>Un envío tiene <b>un</b> comercio y <b>un</b> destinatario (modalidad obligatoria, FK NOT NULL), y
            <b>uno o varios bultos</b> (<code>1,N</code>: no existe envío vacío → por eso <code>||--|{</code>).</li>
            <li>El <b>locker</b> y el <b>casillero</b> pertenecen al <b>Servicio I</b>: como cada servicio tiene su propia
            base, los guardo como <b>IDs lógicos</b>, <b>no como FK</b> — no hay integridad referencial entre servicios y
            la validación es responsabilidad de la aplicación.</li>
            <li><code>OCUPACION_CASILLERO</code> es una entidad aparte y no tres columnas del envío, porque tiene su
            propio <b>ciclo de vida</b> (desde / hasta) y permite liberar el casillero sin tocar el envío. Es
            <b>0,1</b>: un envío creado todavía no ocupa ningún casillero. El <b>UNIQUE</b> sobre
            <code>id_envio</code> garantiza una sola ocupación vigente por envío.</li>
            <li><b>Varios códigos de retiro por envío</b> (<code>0,N</code>) porque el enunciado dice que el código
            <b>vence y puede regenerarse</b>: cada regeneración es una fila nueva y la anterior queda
            <code>EXPIRADA</code>/<code>REVOCADA</code>. Con una sola columna en ENVIO perdería la trazabilidad de los
            códigos emitidos. El código se guarda <b>hasheado</b>, nunca en claro (es una credencial de un solo uso).</li>
            <li><code>EVENTO_ENVIO</code> es la <b>bitácora de estados</b> (<code>1,N</code>: al menos el evento de
            creación). El campo <code>estado</code> en ENVIO es el <b>estado actual</b> — redundante respecto del último
            evento, y lo explico abajo como desnormalización por performance.</li>
            <li><b>Los estados no se modelan como entidades</b>: si en el diagrama de clases se usó el patrón
            <b>State</b>, esas clases son <b>comportamiento</b>, no datos. Se persiste sólo el estado actual (enum con
            CHECK) más el historial de transiciones.</li>
            <li>La <b>devolución</b> es <b>0,1</b> respecto del envío: sólo existe si el envío vence o se rechaza.</li>
            <li><b>Notificaciones</b> (mail/SMS) no se modelan acá: son responsabilidad de un componente externo y su
            registro de envío es un <b>log/evento</b>, no una entidad del dominio de envíos.</li>
            <li>El <b>plazo de permanencia</b> es un parámetro del negocio (o del plan del comercio); guardo la
            <code>fecha_limite_retiro</code> <b>calculada y congelada</b> al depositar, para que un cambio posterior del
            parámetro no modifique envíos ya depositados.</li>
          </ul>

          <h3>Justificación (los 3 párrafos)</h3>
          <p><b>a) Qué elementos es necesario persistir.</b> Persisto las entidades con <b>identidad y ciclo de vida
          propio</b> que el sistema debe recuperar entre ejecuciones: Comercio, Destinatario, Transportista, Envío, Bulto,
          Ocupación, Código de retiro, Evento y Devolución. <b>No persisto</b>: los objetos de cálculo ni los resultados
          derivables (el tiempo de permanencia se calcula con <code>fecha_retiro − fecha_deposito</code>), los DTOs de la
          capa de presentación, las clases de comportamiento (State/Strategy para la máquina de estados y para la
          política de asignación de casillero) ni los archivos binarios (la foto de la entrega va a <b>object storage</b>
          y la base guarda la <b>URL</b>). Un Value Object como las dimensiones del bulto se persiste <b>embebido</b> en
          la tabla de su dueño, porque no tiene identidad propia.</p>
          <p><b>b) Cómo resolví los impedance mismatches.</b> <b>Identidad:</b> PK <b>subrogada</b> autoincremental en
          todas las entidades, y <b>UNIQUE</b> sobre las claves naturales del negocio (<code>nro_seguimiento</code>,
          <code>cuit</code>, <code>documento</code>, <code>legajo</code>) para no perder la restricción sin acoplar las
          FK a datos que podrían cambiar. <b>Conversión de tipos:</b> String → VARCHAR con longitud definida; fechas →
          DATETIME; importes y pesos → <b>DECIMAL</b> (no DOUBLE, por el error de redondeo). <b>Cardinalidad:</b> las
          relaciones bidireccionales del modelo de objetos se implementan con <b>una sola FK del lado “muchos”</b> y la
          navegación inversa la resuelve el ORM (<code>mappedBy</code>); no hay N:M en este servicio. <b>Herencia:</b> si
          se modelara una jerarquía de eventos (Depósito / Retiro / Vencimiento) con atributos propios por subtipo, usaría
          <b>SINGLE_TABLE con discriminador</b>, porque los subtipos agregan <b>pocos</b> atributos y <b>todas</b> las
          consultas son polimórficas (“el historial del envío”), aceptando columnas nulables; con muchos atributos
          obligatorios propios iría <b>JOINED</b>. <b>Enums:</b> estados, tamaños y motivos son conjuntos <b>cerrados</b>
          definidos por el negocio → enum persistido como <b>STRING</b> con <b>CHECK</b> (nunca ORDINAL, porque reordenar
          el enum corrompería los datos históricos). Si fueran administrables desde la plataforma, serían <b>tabla
          maestra</b> con FK.</p>
          <p><b>c) Qué estructuras desnormalizo.</b> Por <b>consistencia</b>: los campos <code>*_emision</code>
          (nombre y documento del destinatario, dirección del locker) quedan <b>congelados en el envío</b>, porque el
          comprobante de entrega <b>debe poder reimprimirse tal como se emitió</b> — si el destinatario corrige su
          nombre o el locker se reubica, el comprobante pasado no debe cambiar. Lo mismo con
          <code>actor_nombre_evento</code> en la bitácora: es un registro de auditoría <b>inmutable</b>. <b>No es
          redundancia: es el valor de esa operación.</b> Por <b>performance</b>: mantengo <code>ENVIO.estado</code> como
          <b>campo derivado</b> del último evento, porque el listado de envíos de un comercio es la consulta más
          frecuente y reconstruir el estado con una subconsulta sobre la bitácora en cada fila sería caro; declaro
          <code>EVENTO_ENVIO</code> como <b>fuente de verdad</b>, encapsulo la actualización en un <b>único</b> servicio
          de dominio y dejo un <b>proceso de recálculo</b> capaz de reparar el campo desde la bitácora.</p>
        </details>

        <h2>Punto 2 — Auditar un DER contra las 3 formas normales</h2>
        <div class="card">
          <p>Se le presenta el modelo de datos ya construido del <b>Servicio I (Red y Lockers)</b>.
          <b>¿Cumple con las tres primeras formas normales?</b> Indique <b>sí o no</b> y explique <b>en dos renglones</b>
          qué problema existe.</p>
          ${APP.code(`SUCURSAL_LOCKER (
   id_locker            INTEGER     PK,
   nombre_sucursal      VARCHAR(60),
   direccion            VARCHAR(120),
   localidad            VARCHAR(60),
   horarios_atencion    VARCHAR(200),   -- "Lun-Vie 8:00-20:00 / Sab 9:00-13:00"
   telefonos            VARCHAR(100),   -- "1133445566 / 1144556677"
   cantidad_casilleros  INTEGER,
   id_zona              INTEGER,
   nombre_zona          VARCHAR(60),
   responsable_zona     VARCHAR(60)
)

CASILLERO (
   id_locker        INTEGER   PK,  FK -> SUCURSAL_LOCKER,
   nro_casillero    INTEGER   PK,
   codigo_tamanio   CHAR(2),                -- S / M / L / XL
   alto_cm          INTEGER,
   ancho_cm         INTEGER,
   profundidad_cm   INTEGER,
   direccion_locker VARCHAR(120),
   estado           VARCHAR(20)
)

MANTENIMIENTO (
   id_mantenimiento INTEGER  PK,
   id_locker        INTEGER  FK,
   nro_casillero    INTEGER,
   fecha            DATETIME,
   tipo             VARCHAR(40),
   tecnico_legajo   VARCHAR(10),
   tecnico_nombre   VARCHAR(60),
   tecnico_telefono VARCHAR(20)
)`, { lang: "sql", collapse: false, label: "Modelo dado del Servicio I" })}
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 2</summary>
          <div class="callout key">
            <div class="callout-title">La respuesta de dos renglones</div>
            <p><b>No, no cumple ninguna de las tres.</b> <b>1FN:</b> <code>horarios_atencion</code> y
            <code>telefonos</code> son <b>atributos multivaluados</b> (guardan una lista en una sola celda) y
            <code>alto/ancho/profundidad</code> replican el grupo repetitivo del tamaño. <b>2FN:</b> en
            <code>CASILLERO</code>, con PK compuesta <code>(id_locker, nro_casillero)</code>, las medidas dependen sólo
            de <code>codigo_tamanio</code> y <code>direccion_locker</code> sólo de <code>id_locker</code> →
            <b>dependencias parciales</b>. <b>3FN:</b> <code>nombre_zona</code> y <code>responsable_zona</code> dependen
            de <code>id_zona</code>, y los datos del técnico de <code>tecnico_legajo</code> —atributos <b>no clave</b>→
            <b>dependencias transitivas</b>; además <code>cantidad_casilleros</code> es un <b>dato derivado</b>
            (<code>COUNT</code> sobre CASILLERO). Todo esto produce <b>redundancia</b> y <b>anomalías de actualización y
            borrado</b>: cambiar el responsable de una zona o el teléfono de un técnico obliga a actualizar N filas, y
            si falla a mitad de camino el modelo queda con <b>dos verdades</b>.</p>
          </div>
          <h3>Violación por violación (para el “qué problema hay y demás”)</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>FN</th><th>Dónde</th><th>Por qué</th><th>Anomalía concreta</th></tr></thead>
            <tbody>
              <tr><td><b>1FN</b></td><td><code>SUCURSAL_LOCKER.horarios_atencion</code></td><td>Atributo <b>no atómico</b>: guarda varios horarios en un VARCHAR</td><td>No se puede consultar “qué lockers abren sábado a las 10” sin parsear texto; tampoco se puede validar ni indexar</td></tr>
              <tr><td><b>1FN</b></td><td><code>SUCURSAL_LOCKER.telefonos</code></td><td><b>Multivaluado</b> separado por “/”</td><td>Agregar o quitar un teléfono exige reescribir toda la cadena; riesgo de duplicados y de formatos distintos</td></tr>
              <tr><td><b>1FN</b> / <b>2FN</b></td><td><code>CASILLERO.alto_cm, ancho_cm, profundidad_cm</code></td><td>Son los <b>atributos del tamaño</b>, repetidos en cada casillero (grupo repetitivo) y dependientes <b>sólo</b> de <code>codigo_tamanio</code>, que es parte no clave</td><td>Si se redefine la medida de los casilleros “M”, hay que actualizar <b>todas</b> las filas de todos los lockers</td></tr>
              <tr><td><b>2FN</b></td><td><code>CASILLERO.direccion_locker</code></td><td>La PK es <b>compuesta</b> y la dirección depende sólo de <code>id_locker</code> → <b>dependencia parcial</b></td><td>Reubicar un locker obliga a actualizar la dirección en cada uno de sus casilleros</td></tr>
              <tr><td><b>3FN</b></td><td><code>nombre_zona</code>, <code>responsable_zona</code></td><td>Dependen de <code>id_zona</code>, atributo <b>no clave</b> → <b>transitiva</b> (PK → id_zona → nombre_zona)</td><td><b>Actualización:</b> cambia el responsable y hay que tocar todos los lockers de la zona. <b>Borrado:</b> si se da de baja el último locker de una zona, se pierden el nombre y el responsable. <b>Inserción:</b> no se puede dar de alta una zona nueva sin tener un locker</td></tr>
              <tr><td><b>3FN</b></td><td><code>tecnico_nombre</code>, <code>tecnico_telefono</code></td><td>Dependen de <code>tecnico_legajo</code>, no clave → <b>transitiva</b></td><td>El mismo técnico aparece con nombre o teléfono distinto en dos intervenciones: no hay una única verdad</td></tr>
              <tr><td><b>3FN</b></td><td><code>cantidad_casilleros</code></td><td><b>Dato derivado</b>: calculable con COUNT sobre CASILLERO</td><td>Se desincroniza en cuanto se agrega o se retira un casillero</td></tr>
            </tbody>
          </table></div>
          <div class="callout tip">
            <p><b>El matiz que levanta la nota</b> (es el “y demás” de la pregunta): <b>no todo dato replicado es un error
            de normalización</b>. <code>cantidad_casilleros</code> <b>podría</b> ser una desnormalización <b>válida por
            performance</b> si el tablero de ocupación se consultara miles de veces por minuto — pero sólo si se declara
            explícitamente, se conserva CASILLERO como <b>fuente de verdad</b>, se encapsula la propagación y existe un
            <b>proceso de recálculo</b>. Tal como está, <b>no está declarada ni justificada</b>, así que es una violación
            de 3FN. Y en cambio <b>la dirección del locker en CASILLERO no se salva con ese argumento</b>: no hay ningún
            requerimiento histórico ni de performance que la justifique.</p>
          </div>
          <h3>Modelo corregido</h3>
          ${APP.code(`ZONA             (id_zona PK, nombre UNIQUE NOT NULL, id_responsable FK NOT NULL)
RESPONSABLE      (id_responsable PK, nombre NOT NULL, email)
LOCKER           (id_locker PK, nombre NOT NULL, direccion NOT NULL,
                  localidad, latitud, longitud, id_zona FK NOT NULL, estado)
HORARIO_ATENCION (id_horario PK, id_locker FK NOT NULL, dia_semana NOT NULL,
                  hora_desde NOT NULL, hora_hasta NOT NULL)      -- resuelve 1FN
TELEFONO_LOCKER  (id_telefono PK, id_locker FK NOT NULL, tipo, numero NOT NULL)
TAMANIO_CASILLERO(codigo_tamanio PK, descripcion, alto_cm NOT NULL,
                  ancho_cm NOT NULL, profundidad_cm NOT NULL)    -- resuelve 1FN y 2FN
CASILLERO        (id_locker PK FK, nro_casillero PK,
                  codigo_tamanio FK NOT NULL, estado NOT NULL
                  CHECK (estado IN ('LIBRE','OCUPADO','FUERA_SERVICIO')))
TECNICO          (id_tecnico PK, legajo UNIQUE NOT NULL, nombre NOT NULL, telefono)
MANTENIMIENTO    (id_mantenimiento PK, id_locker FK NOT NULL, nro_casillero NOT NULL,
                  id_tecnico FK NOT NULL, fecha NOT NULL, tipo NOT NULL, observaciones,
                  FOREIGN KEY (id_locker, nro_casillero) REFERENCES CASILLERO)

-- La capacidad por tamaño y los casilleros disponibles se OBTIENEN con una consulta
-- (GROUP BY codigo_tamanio / WHERE estado = 'LIBRE'), no se almacenan.`, { lang: "sql", collapse: false, label: "En 3FN" })}
          <p class="mini"><b>Ojo con un detalle fino:</b> en <code>MANTENIMIENTO</code> la referencia al casillero debe
          ser la <b>FK compuesta</b> <code>(id_locker, nro_casillero)</code>, porque el número de casillero sólo
          identifica dentro de su locker. En el modelo dado, <code>nro_casillero</code> está <b>suelto, sin FK</b>: se
          puede registrar mantenimiento de un casillero que no existe — es un problema de <b>integridad referencial</b>,
          no de normalización, y conviene nombrarlo aparte.</p>
        </details>

        <h2>Punto 3 — Desnormalización</h2>
        <div class="card">
          <p>El <b>Servicio III (Operación y Auditoría)</b> debe mostrar un tablero con la <b>ocupación promedio por
          locker y franja horaria</b>, el <b>tiempo promedio de permanencia</b> y el <b>top 10 de lockers más usados del
          mes</b>; el tablero lo consultan los operadores <b>permanentemente</b> y hoy demora varios segundos. Además,
          los comercios reclaman que el <b>comprobante de entrega</b> reimpreso no coincide con el original.</p>
          <p>Indique <b>qué estructuras desnormalizaría</b>, de qué <b>tipo</b> de desnormalización se trata en cada caso
          y <b>qué costos</b> asume.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 3</summary>
          <p><b>Son los dos tipos, y hay que separarlos explícitamente.</b></p>
          <h3>① Forzada por CONSISTENCIA (el comprobante)</h3>
          <p>El problema del comprobante <b>no es de performance: el modelo normalizado devuelve un resultado incorrecto
          desde el punto de vista del negocio.</b> El comprobante sólo guarda FKs al destinatario y al locker, y la FK
          expresa “el valor <b>actual</b>”, cuando el negocio necesita “el valor <b>al momento de la entrega</b>”:
          cualquier corrección posterior del nombre del destinatario o una reubicación del locker <b>reescribe el
          pasado</b>. Es un documento <b>inmutable con valor probatorio</b>, así que los datos <b>se copian</b>:</p>
          ${APP.code(`ENVIO ( ..., id_destinatario FK, id_locker,
        nombre_destinatario_emision,     -- congelados al emitir / entregar
        documento_destinatario_emision,
        direccion_locker_emision,
        importe_emision, plazo_dias_emision )`, { lang: "sql", collapse: false, label: "Datos de contexto congelados" })}
          <p>Técnica: <b>dato de contexto congelado</b>. <b>Se conservan las FK</b> para poder navegar al maestro vigente.
          Criterio general: <b>si el dato integra un documento con valor probatorio, se copia; si sólo sirve para
          navegar, se referencia</b> — por eso el <b>teléfono de contacto</b> del destinatario <b>no</b> se congela:
          ahí interesa el valor actual.</p>
          <h3>② Forzada por PERFORMANCE (el tablero)</h3>
          <p>Acá el modelo <b>es correcto pero no responde en los tiempos que el negocio exige</b>: el costo está en los
          <b>JOINs sobre grandes volúmenes</b> de eventos y en las <b>agregaciones repetidas</b> (AVG, COUNT, GROUP BY)
          sobre meses de aperturas de casillero. Es una decisión de <b>última instancia</b>: <b>primero mido</b> (plan de
          ejecución, tiempos, volumen real) y <b>agoto índices, reescritura de consultas, caché y particionamiento por
          fecha</b>. Si no alcanza:</p>
          ${APP.code(`-- a) TABLA DE RESUMEN (preagregación), alimentada por proceso batch nocturno
OCUPACION_DIARIA_LOCKER (fecha, id_locker, franja_horaria,
                         casilleros_totales, casilleros_ocupados_prom,
                         retiros, vencidos, permanencia_prom_horas)
  -- PK compuesta (fecha, id_locker, franja_horaria)
  -- Es la base del modelo dimensional: tabla de hechos + dimensiones
  -- deliberadamente desnormalizadas (esquema estrella).

-- b) CAMPO DERIVADO para no recalcular por fila
ENVIO.horas_permanencia         -- en lugar de (fecha_retiro - fecha_deposito) en cada consulta
LOCKER_RESUMEN.usos_mes         -- en lugar de COUNT(*) sobre los eventos

-- c) ATRIBUTO REPLICADO para evitar el JOIN en el listado
ENVIO.nombre_comercio           -- conservando id_comercio (FK y fuente de verdad)`, { lang: "sql", collapse: false, label: "Desnormalización por performance" })}
          <p><b>Condición innegociable:</b> <b>todo dato derivado debe ser reconstruible</b> — siempre tiene que existir
          un proceso de recálculo capaz de reparar la copia desde la fuente de verdad.</p>
          <h3>Costos que asumo (esto es lo que buscan)</h3>
          <ul>
            <li><b>Reaparecen las anomalías de actualización:</b> el mismo hecho vive en N lugares.</li>
            <li><b>La escritura se encarece:</b> renombrar un comercio deja de ser el UPDATE de una fila y pasa a ser una
            actualización masiva sobre envíos, con bloqueos y contención.</li>
            <li><b>La integridad se traslada al software:</b> lo que garantizaba el motor (FK, restricciones) pasa a
            depender de triggers, servicios de dominio o procesos batch.</li>
            <li><b>Ventana de inconsistencia:</b> si la propagación es asincrónica, acepto <b>consistencia eventual</b>.
            La pregunta de diseño no es “¿puede haber inconsistencia?” sino <b>“¿cuánta y por cuánto tiempo la tolera el
            negocio?”</b>: en el tablero, un desfasaje de <b>hasta 24 h</b> es aceptable (son métricas de gestión); en el
            <b>importe cobrado o en el estado del envío</b>, no.</li>
            <li><b>Más volumen</b> almacenado, índices más grandes y backups más costosos.</li>
            <li><b>Dos consultas equivalentes pueden devolver resultados distintos</b> (una lee la copia, otra resuelve el
            JOIN) → hay que <b>declarar explícitamente la fuente de verdad</b> y monitorear la divergencia.</li>
          </ul>
          <div class="callout key">
            <p><b>Cierre para escribir:</b> “Desnormalizo <b>después</b> de haber normalizado, documentando cada caso:
            los datos del comprobante por <b>consistencia histórica</b> (son parte del documento, no una copia), y el
            tablero por <b>performance medida</b>, con tabla de resumen por batch, conservando las FK, declarando la
            fuente de verdad, encapsulando la propagación en un único punto y dejando un proceso de recálculo.
            <b>Desnormalizar sin haber normalizado antes no es desnormalizar: es modelar mal.</b>”</p>
          </div>
        </details>

        <h2>Punto 4 — Arquitectura</h2>
        <div class="card">
          <p><b>a)</b> La empresa no tiene forma de saber qué pasa en producción: cuando un comercio reclama que “el
          depósito tardó”, el equipo revisa a mano los logs de cada servicio. ¿Qué <b>métricas</b> y qué estrategia de
          <b>logs</b> propone? ¿Cómo reconstruiría una operación que atravesó los tres servicios?</p>
          <p><b>b)</b> El servicio de Envíos consume una <b>API externa del transportista</b> y una <b>pasarela de
          notificaciones</b> (mail/SMS) que presenta caídas frecuentes y tiempos de respuesta elevados. ¿Qué patrones
          aplica para que no arrastre al sistema?</p>
          <p><b>c)</b> La app de los destinatarios muestra un <b>mapa con las fotos de los lockers</b> y el
          <b>listado de lockers con casilleros disponibles</b>. Las fotos saturan el ancho de banda del servidor y el
          listado se consulta miles de veces por minuto. ¿Qué componentes incorpora? ¿Qué <b>TTL</b> define para cada
          caso y por qué?</p>
          <p><b>d)</b> Elabore el <b>diagrama de despliegue</b> de la solución.</p>
          <p><b>e)</b> Se cuenta con un equipo de <b>6 programadores</b> y <b>4 meses</b> para lanzar. Se estima que
          <b>un servicio recibirá 8 veces más requests</b> que los demás. ¿Elige una <b>arquitectura monolítica</b> o
          <b>orientada a servicios</b>? Justifique y <b>grafique el diagrama de despliegue de esa decisión</b>.</p>
        </div>

        <details class="qa">
          <summary>✅ Solución — a) Métricas, logs y trazabilidad</summary>
          <p><b>Los tres pilares, y decir para qué sirve cada uno:</b> “las <b>métricas avisan</b>, las <b>trazas
          ubican</b>, los <b>logs explican</b>”.</p>
          <p><b>Métricas — las 4 señales de oro</b> (SRE de Google), por servicio y por endpoint:</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Señal</th><th>En PaqueRed</th></tr></thead>
            <tbody>
              <tr><td><b>Latencia</b></td><td><b>p95 / p99</b> de “depositar envío” y “retirar paquete”, <b>por dependencia</b> (API del transportista, notificaciones) y separando éxitos de fallas. <b>El promedio miente:</b> oculta la cola larga</td></tr>
              <tr><td><b>Tráfico</b></td><td>Requests por segundo; y <b>métrica de negocio</b>: depósitos y retiros por minuto. Una caída abrupta de retiros es el mejor detector de incidentes — “sin errores y sin tráfico = <b>silencio sospechoso</b>”</td></tr>
              <tr><td><b>Errores</b></td><td>% de 5xx; códigos de retiro rechazados; <b>errores implícitos</b> (200 OK pero tan lento que incumple el SLO) y <b>de negocio</b> (casillero no disponible, que no es falla del sistema)</td></tr>
              <tr><td><b>Saturación</b></td><td>CPU y memoria, <b>pool de conexiones a la base</b>, profundidad de la cola de notificaciones. Es la <b>señal adelantada</b>: el pool llega al límite <b>antes</b> de que suban latencia y errores</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cuidado con la cardinalidad:</b> etiquetas buenas son <code>servicio</code>,
          <code>endpoint</code>, <code>status</code>, <code>zona</code>. <b>Nunca</b> <code>id_envio</code> o
          <code>id_destinatario</code> como etiqueta: cada combinación es una serie y explota el costo de la TSDB — esos
          datos van en <b>logs o trazas</b>.</p>
          <p><b>Logs:</b> <b>estructurados en JSON</b> (no texto plano), con niveles usados con criterio (<b>INFO</b> para
          hitos de negocio, <b>WARN</b> para “la pasarela tardó 2,8 s y se reintenta”, <b>ERROR</b> para una operación
          fallida), en <b>UTC con relojes sincronizados (NTP)</b>, y <b>centralizados</b> en un <b>log aggregator</b>
          (ELK / Loki) porque cada instancia es descartable y el log local se pierde con ella. <b>Nunca</b> loguear el
          <b>código de retiro</b>, el documento del destinatario ni tokens (Ley 25.326).</p>
          <p><b>Reconstruir la operación — la respuesta concreta:</b> un <b>ID de correlación (trace_id)</b> que
          <b>nace en el API Gateway</b> al entrar la request y <b>se propaga en la cabecera de cada llamada</b> entre los
          tres servicios y en cada mensaje de la cola. Con ese ID, el log aggregator reúne en <b>un solo filtro</b> las
          líneas de los tres servicios, y la <b>traza distribuida</b> (OpenTelemetry + Jaeger) muestra el <b>árbol de
          spans</b> en un diagrama de cascada, donde el ancho de cada span dice cuánto tardó: ahí se ve de inmediato que
          el tiempo se fue en la API del transportista y no en nuestra base. <b>Sin el ID hay que revisar los logs de
          cada servicio por separado; con el ID, la respuesta está en una línea.</b></p>
          <p><b>Y para cerrar:</b> <b>alertas por síntoma, no por causa</b> (“p95 de depósito &gt; 2 s durante 5 min” o
          “% de retiros fallidos &gt; 1%”, no “CPU &gt; 80%”), con <b>umbral y duración</b> para no despertar a nadie por
          un pico de un segundo, cada alerta con <b>dueño, severidad y runbook</b>. Definir <b>SLI</b> (% de depósitos
          exitosos en menos de 2 s), <b>SLO</b> (99,5% en 30 días) y, si hay contrato con los comercios, <b>SLA</b> con
          penalidades; el <b>presupuesto de error</b> (0,5% ≈ 216 min/mes) decide cuándo se frenan los lanzamientos.
          <b>El monitoreo alerta; la observabilidad permite entender</b> incluso los problemas que nadie anticipó.</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — b) Resiliencia: circuit breaker y compañía</summary>
          <p>Son dos integraciones distintas y <b>no se resuelven igual</b>, porque la pregunta clave es
          <b>¿quien llama necesita la respuesta para poder continuar?</b></p>
          <h3>Notificaciones (mail/SMS): no la necesito ya → ASINCRÓNICO</h3>
          <p>El depósito <b>no puede fallar porque el proveedor de SMS esté caído</b>. El servicio de Envíos
          <b>publica un evento</b> (<code>EnvioDepositado</code>) en un <b>broker</b> y responde al transportista de
          inmediato; un <b>consumidor</b> de Notificaciones envía el mail y el SMS cuando puede. Esto <b>desacopla en el
          tiempo</b> (si el proveedor está caído los mensajes esperan en la cola), <b>amortigua los picos</b> y permite
          <b>escalar consumidores</b> según el largo de la cola. Costos y salvaguardas: la entrega es <b>at-least-once</b>,
          así que el consumidor debe ser <b>idempotente</b> (guardando el id del mensaje ya procesado) para <b>no mandar
          dos veces el código de retiro</b>; <b>reintentos limitados con backoff</b>; y los mensajes que fallan siempre
          (un mail inválido) van a una <b>DLQ</b>, que aparta el mensaje roto sin frenar a los demás y sin perderlo, para
          alertar al equipo y reprocesar o descartar. Para no perder el evento por <b>doble escritura</b> (guardar el
          cambio y publicar son dos operaciones), uso <b>Transactional Outbox</b>: el evento se guarda en la <b>misma
          transacción</b> que el depósito y un relay lo publica. <b>Monitoreo:</b> tamaño de la cola, antigüedad del
          mensaje más viejo y mensajes en DLQ.</p>
          <h3>API del transportista: a veces sí la necesito → SINCRÓNICO BLINDADO</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Problema</th><th>Patrón</th><th>Qué hace acá</th></tr></thead>
            <tbody>
              <tr><td>No responde nunca</td><td><b>Timeout</b></td><td>Siempre definido (ej. 2 s): <b>sin timeout se agotan hilos y conexiones y la lentitud se contagia</b> a todo el servicio</td></tr>
              <tr><td>Falla transitoria</td><td><b>Retry con backoff</b></td><td>Reintentos <b>limitados</b> y espaciados (con jitter) para <b>no saturar</b> al que ya está en problemas. <b>Sólo en operaciones idempotentes</b></td></tr>
              <tr><td>Sigue caída</td><td><b>Circuit breaker</b></td><td>Monitorea los fallos; superado el umbral <b>abre el circuito</b>: deja de llamar y <b>falla rápido</b> con un <b>fallback</b>, evitando la <b>falla en cascada</b>. Pasado un tiempo, en <b>semiabierto</b> prueba si se recuperó. Estados: <b>cerrado → abierto → semiabierto</b></td></tr>
              <tr><td>¿Se procesó o no?</td><td><b>Idempotencia</b></td><td><b>Clave de idempotencia</b> por operación: tras un timeout puedo consultar o reintentar <b>sin duplicar</b> el depósito</td></tr>
              <tr><td>Igual hay que responder</td><td><b>Fallback / degradar</b></td><td><b>Degradar antes que romper</b>: el envío queda en estado <b>“pendiente de confirmación”</b> y un proceso lo reconcilia después; el transportista <b>puede seguir trabajando</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Se complementan:</b> el <b>retry</b> insiste ante lo pasajero; si la falla <b>persiste</b>, el
          <b>circuit breaker</b> corta para no sobrecargar más al servicio. Y toda integración externa entra al dominio
          por un <b>Adapter</b> contra una interfaz propia, así cambiar de transportista o de proveedor de SMS es
          <b>otro adapter</b> y no toca las reglas de negocio (Inversión de Dependencias).</p>
          <p class="mini"><b>Atributos favorecidos:</b> <b>disponibilidad</b> y <b>tolerancia a fallos</b> (una
          dependencia caída no tumba la operación), <b>performance</b> (fail fast en lugar de esperas largas) y
          <b>mantenibilidad</b> (el proveedor queda aislado detrás del adapter).</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — c) CDN, caché y TTL</summary>
          <p>Son <b>dos problemas distintos</b> con dos soluciones distintas.</p>
          <h3>Las fotos de los lockers → object storage + CDN</h3>
          <p>Las imágenes <b>no van en la base de datos</b>: van a un <b>object storage</b> (S3) y se sirven por una
          <b>CDN</b>, una red de servidores <b>distribuidos geográficamente</b> que entrega el contenido desde el
          <b>nodo más cercano</b> al usuario. El backend <b>deja de transferir bytes</b>: sólo entrega la <b>URL</b>.
          <b>Ventajas:</b> mejores tiempos de carga, <b>reducción de los costos de ancho de banda</b>, mayor
          disponibilidad y redundancia del contenido, y de paso <b>mitiga ataques DDoS</b>. Lo mismo para los estáticos
          de la app (HTML, JS, CSS).</p>
          <p><b>TTL largo (días o meses) + versionado del nombre del archivo</b> (<code>locker-123.v4.jpg</code> o un
          hash en la URL): la foto de un locker casi nunca cambia, así que un TTL largo maximiza los aciertos de caché, y
          cuando cambia <b>no se invalida nada: se publica otra URL</b> (<i>cache busting</i>). Es la estrategia correcta
          para contenido inmutable.</p>
          <h3>El listado de casilleros disponibles → caché de aplicación con TTL corto</h3>
          <p>Acá el dato <b>cambia todo el tiempo</b> (cada depósito y cada retiro lo modifican) y se consulta miles de
          veces por minuto. Uso una <b>caché distribuida</b> (Redis) <b>compartida entre todas las instancias</b> del
          servicio, con <b>TTL de 10 a 30 segundos</b>. Con eso, el <b>servidor de origen no procesa la solicitud</b> —no
          parsea, no enruta, no consulta la base ni renderiza—, lo que <b>reduce drásticamente su carga</b> y la de la
          base.</p>
          <div class="callout key">
            <div class="callout-title">Cómo justificar el TTL (es lo que buscan)</div>
            <p>El TTL se elige por <b>cuánta desactualización tolera el negocio</b>, no por intuición:</p>
            <ul>
              <li><b>Mapa y fotos de lockers:</b> TTL <b>largo</b> (horas/días) + versión en la URL. Dato casi inmutable.</li>
              <li><b>Listado de lockers con disponibilidad:</b> TTL <b>corto, 10–30 s</b>. Mostrar “hay lugar” cuando ya
              no hay es una molestia menor y se corrige al reservar; el beneficio de absorber miles de consultas lo
              justifica. <b>Se acepta una ventana de inconsistencia acotada y explícita.</b></li>
              <li><b>Estado de UN envío puntual (“¿ya lo retiraron?”):</b> TTL <b>muy corto o sin caché</b>, o
              <b>invalidación por evento</b>: es el dato que el usuario está mirando y una respuesta vieja genera un
              reclamo.</li>
              <li><b>El código de retiro:</b> <b>nunca se cachea</b>, en ninguna caché compartida. Es una credencial.</li>
            </ul>
            <p><b>Además del TTL, invalidación activa:</b> cuando se deposita o se retira, el servicio
            <b>publica un evento</b> y el consumidor <b>invalida la clave</b> de ese locker en Redis. Así combino
            <b>TTL como red de seguridad</b> con <b>invalidación por evento</b> para precisión, que es mejor que depender
            sólo del vencimiento.</p>
          </div>
          <p class="mini"><b>Capas de caché que conviene nombrar:</b> <b>privada</b> (navegador del usuario),
          <b>compartida</b> (proxy), <b>compartida y administrada</b> (<b>CDN</b>) — <b>siempre con tiempo de expiración
          definido</b> — más la <b>caché de aplicación</b> (Redis) y la <b>caché del ORM</b> (1er nivel por sesión, 2do
          nivel por SessionFactory). <b>Headers HTTP:</b> <code>Cache-Control: max-age</code>, <code>ETag</code> +
          <code>If-None-Match</code> para revalidar con un <b>304 Not Modified</b>, y <code>Vary</code> si la respuesta
          cambia según un header. <b>Riesgos:</b> datos desactualizados (lo acota el TTL) y <b>nunca cachear datos
          sensibles</b> en cachés compartidas. <b>Atributos:</b> <b>performance</b> (menor latencia),
          <b>escalabilidad</b> (absorbe picos sin tocar el origen), <b>disponibilidad</b> (la CDN sirve ante fallas
          breves del origen) y <b>costo</b> (menos egress y menos cómputo).</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — d) Diagrama de despliegue</summary>
          ${APP.uml(`graph LR
    D["🧍 Destinatario<br/>«device» app mobile"] -->|HTTPS| CDN["CDN<br/>fotos y estáticos"]
    D -->|HTTPS| WAF["WAF"]
    T["🚚 Transportista<br/>«device» app mobile"] -->|HTTPS| WAF
    C["🏪 Comercio<br/>«browser» SPA"] -->|HTTPS| WAF
    L["🔐 Locker<br/>«device» módulo IoT"] -->|MQTT/TLS| BK[("Broker<br/>colas y topics")]
    WAF --> LB["⚖️ Load Balancer L7<br/>health checks"]
    LB --> GW["API Gateway<br/>authN JWT · rate limiting · logging"]
    GW --> S1["Servicio I · Red y Lockers<br/>«container» xN"]
    GW --> S2["Servicio II · Envíos y Entregas<br/>«container» xN"]
    GW --> S3["Servicio III · Operación y Auditoría<br/>«container» xN"]
    S1 --> DB1[("BD Red<br/>relacional")]
    S2 --> DB2[("BD Envíos<br/>relacional + réplica")]
    S3 --> TS[("TSDB<br/>eventos de locker")]
    S3 --> OL[("BD analítica<br/>columnar · resúmenes")]
    S2 --> CA[("Redis<br/>caché TTL")]
    S1 --> CA
    S2 -->|publica evento| BK
    BK --> NOT["Notificaciones<br/>«container» consumidores"]
    NOT -->|HTTPS| EXT["Pasarela mail/SMS<br/>«externo»"]
    S2 -->|HTTPS + circuit breaker| TRA["API Transportista<br/>«externo»"]
    BK --> ING["Ingesta de eventos<br/>«container» xN"]
    ING --> TS
    S1 --> OBJ[("Object Storage<br/>fotos")]
    S1 --> IDP["IdM / SSO<br/>«externo»"]
    style WAF fill:#fee2e2,stroke:#b91c1c,color:#0f172a
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BK fill:#fffbeb,stroke:#b45309,color:#0f172a`, "PaqueRed — diagrama de despliegue")}
          <p class="mini"><b>Lo que el corrector busca en el dibujo:</b> ① <b>nodos</b> (cubos: dispositivos,
          contenedores, bases) y no sólo cajas sueltas ② <b>el protocolo rotulado sobre cada línea</b> (HTTPS, MQTT/TLS,
          AMQP, JDBC) ③ <b>lo externo marcado como externo</b> (pasarela, API del transportista, IdP) ④ las <b>tres bases
          separadas</b>, una por servicio ⑤ los componentes transversales: <b>WAF, LB, API Gateway, caché, broker,
          observabilidad y secretos</b> ⑥ <b>réplicas</b> (xN) donde hay escalado horizontal. Y una <b>leyenda</b>: cada
          diagrama debe poder <b>leerse solo</b>.</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — e) ¿Monolito o servicios? (6 programadores · 4 meses · un servicio con 8× más tráfico)</summary>
          <div class="callout key">
            <div class="callout-title">🎯 La respuesta: MONOLITO MODULAR, con el módulo de alta demanda preparado para extraerse</div>
            <p>No es “monolito porque es más fácil” ni “microservicios porque escalan”: hay que <b>pesar las dos
            restricciones del enunciado</b> (equipo y plazo) contra el <b>driver técnico</b> (la asimetría de carga) y
            mostrar que el 8× <b>se puede resolver sin</b> microservicios.</p>
          </div>
          <h3>Por qué monolito (modular)</h3>
          <ul>
            <li><b>Equipo chico:</b> 6 programadores es <b>uno o dos equipos</b>. Los microservicios suponen un
            <b>costo operativo</b> que ese equipo tendría que pagar con su tiempo de desarrollo: CI/CD por servicio,
            service discovery, gateway, observabilidad distribuida, gestión de secretos, cultura DevOps. “Gestionar
            muchos servicios <b>frena</b> a los equipos, sobre todo en sistemas simples.”</li>
            <li><b>Plazo de 4 meses:</b> prioriza <b>time-to-market</b>. Un repositorio, un build, un entorno local, un
            pipeline y una versión en producción.</li>
            <li><b>Los límites todavía no están claros:</b> “los límites son difíciles de acertar al inicio y
            <b>refactorizar entre servicios cuesta mucho más que dentro de un monolito</b>”. Hoy creemos que son tres
            servicios; en producción el corte puede resultar otro.</li>
            <li><b>Consistencia transaccional:</b> depositar un paquete toca envío, ocupación de casillero y bitácora.
            En un monolito eso es <b>un commit/rollback ACID local</b>; distribuido, exige <b>Saga con compensaciones</b>
            y aceptar <b>consistencia eventual</b> — complejidad que no necesitamos el día uno.</li>
            <li><b>Cada salto de red resta disponibilidad:</b> si cada servicio funciona el 99% del tiempo, una operación
            que pasa por tres funciona el <b>0,99³ ≈ 97%</b>. Distribuir <b>no</b> es gratis.</li>
            <li><b>“Monolith First” (Fowler):</b> casi todos los casos exitosos de microservicios <b>empezaron como un
            monolito</b> que creció y luego se dividió. Y al revés: la mayoría de los que arrancaron con microservicios
            desde cero terminó con problemas serios. Evidencia para citar: <b>Stack Overflow</b> (monolito .NET sobre
            pocos servidores) y <b>Amazon Prime Video (2023)</b>, que migró un servicio distribuido <b>a un monolito</b>
            y redujo un <b>90%</b> el costo de infraestructura.</li>
          </ul>
          <h3>Y el 8× de tráfico, ¿no obliga a microservicios? No</h3>
          <p><b>“Un monolito no escala” es FALSO:</b> un monolito <b>escala horizontalmente</b> ejecutando <b>N réplicas
          idénticas detrás de un balanceador</b>. El <b>requisito</b> es que sea <b>stateless</b> (sesión externalizada en
          <b>JWT</b> o Redis), para no caer en <b>sticky sessions</b>, que atentan contra la escalabilidad y la
          disponibilidad. Con eso, el pico del módulo de alta demanda se absorbe con más réplicas, más
          <b>caché</b> para sus consultas repetidas y <b>colas</b> para todo lo diferible.</p>
          <p><b>Lo que el monolito NO puede</b> hay que decirlo igual: <b>escalar partes de forma independiente</b>. Para
          dar más capacidad a ese módulo <b>replico también</b> los otros dos, lo que desperdicia recursos; y
          <b>la base de datos compartida suele ser el verdadero cuello de botella</b>. Pero con 6 personas y 4 meses,
          <b>pagar réplicas de más es mucho más barato que pagar complejidad operativa</b>: una instancia extra cuesta
          dinero; un sistema distribuido mal operado cuesta el proyecto.</p>
          <h3>La decisión completa (así se escribe)</h3>
          <p>“Elijo una <b>arquitectura monolítica MODULAR</b>: un único artefacto desplegable, organizado internamente en
          <b>módulos alineados a las tres capacidades de negocio</b> (Red y Lockers, Envíos, Operación y Auditoría), cada
          uno con una <b>interfaz pública explícita</b> y <b>dueño exclusivo de su esquema de tablas</b> —nadie accede a
          datos ajenos— para <b>no construir un Big Ball of Mud</b>. Lo despliego <b>stateless</b> en <b>N réplicas detrás
          de un balanceador</b>, con <b>caché</b> y <b>cola</b> para el módulo de alta demanda. Dejo el <b>módulo de alto
          tráfico identificado como primer candidato a extracción</b> y, si la asimetría se confirma en producción, lo
          extraigo con el <b>patrón Strangler</b> —una fachada va derivando ese tráfico al servicio nuevo, sin big
          bang—. <b>Qué evidencia cambiaría mi decisión:</b> que la base compartida sea el cuello de botella medido, que
          ese módulo necesite otro stack o otro tipo de base, que su ritmo de releases choque con el del resto, o que el
          equipo crezca a varios equipos independientes (Ley de Conway).”</p>
          <p class="mini"><b>Si preferís defender “servicios”</b> —también es defendible, y conviene saber el
          argumento—: el driver es <b>escalar selectivamente por componente</b> y <b>desplegar de forma
          independiente</b>; el enunciado ya describe <b>tres servicios con su propia base</b>, así que los
          <b>bounded contexts están identificados</b>. Pero entonces tenés que <b>asumir explícitamente los costos</b>:
          Saga con compensaciones para los flujos que cruzan servicios, <b>sin integridad referencial</b> entre bases
          (IDs lógicos validados por la aplicación), observabilidad distribuida con correlation ID <b>desde el día
          uno</b>, API Gateway, y <b>la advertencia de PedidosYa Plus</b>: empezaron con 16 servicios y hoy tienen 12,
          porque cada caja nueva sumó latencia, puntos de falla y pruebas locales poco realistas. Con 6 personas y 4
          meses, el riesgo de no llegar es real. Si vas por esta opción, lo prudente es un <b>camino intermedio</b>:
          monolito modular <b>más</b> un único servicio extraído (el de 8×) — y <b>eso</b> es lo que conviene dibujar.</p>
          <h3>Diagrama de despliegue de la decisión</h3>
          ${APP.uml(`graph LR
    U["🧍 Destinatarios · 🚚 Transportistas · 🏪 Comercios"] -->|HTTPS| CDN["CDN · estáticos y fotos"]
    U -->|HTTPS| LB["⚖️ Load Balancer L7<br/>health checks · TLS"]
    LB --> M1["Monolito modular v1<br/>«container» réplica 1<br/>(Red · Envíos · Auditoría)"]
    LB --> M2["Monolito modular v1<br/>«container» réplica 2"]
    LB --> M3["Monolito modular v1<br/>«container» réplica N<br/>autoescalado por CPU/RPS"]
    M1 --> CA[("Redis<br/>caché + sesión externalizada")]
    M2 --> CA
    M3 --> CA
    M1 --> DB[("BD relacional primaria<br/>esquema por módulo")]
    M2 --> DB
    M3 --> DB
    DB -.->|replica| RR[("Réplica de lectura<br/>consultas del módulo 8x")]
    M1 -->|publica| BK[("Broker · colas")]
    BK --> W["Workers<br/>notificaciones · batch de métricas"]
    W -->|HTTPS| EXT["Pasarela mail/SMS «externo»"]
    LK["🔐 Lockers «device»"] -->|MQTT/TLS| BK
    M1 --> OBS["Observabilidad<br/>métricas · logs · trazas"]
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a
    style DB fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BK fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Monolito modular stateless, escalado horizontalmente")}
          <p class="mini"><b>Lo que este dibujo demuestra</b> (decilo por escrito al lado): el monolito es
          <b>una única unidad de despliegue</b> pero <b>varios procesos en ejecución</b> — son dos cosas distintas—;
          <b>es stateless</b>, así que cualquier réplica atiende cualquier request y <b>no hacen falta sticky
          sessions</b>; el <b>balanceador con health checks</b> elimina el punto único de falla; la <b>réplica de
          lectura</b> y la <b>caché</b> atacan el cuello de botella de la base, que es el límite real del escalado en
          bloque; y la <b>cola</b> saca del camino crítico todo lo que puede esperar. <b>Atributos favorecidos:</b>
          <b>escalabilidad</b> (réplicas + autoescalado + consumidores), <b>disponibilidad</b> (sin punto único de falla,
          nodos sacados de rotación por health check), <b>performance</b> (caché, réplica de lectura, CDN) y
          <b>mantenibilidad</b> (módulos con interfaz explícita, listos para extraer).</p>
        </details>

        <h2>Autoevaluación</h2>
        <p>Resolvé en papel, después marcá con honestidad. Se aprueba con <b>60</b> y <b>no menos del 50% por sección</b>.</p>
        <div id="p2m1rub"></div>
      `;

      APP.rubrica(el.querySelector("#p2m1rub"), "p2-m1-paquered", [
        { t: "DER: todas las entidades del Servicio II, cada una con PK (y dije si es natural, subrogada o compuesta)", p: 5 },
        { t: "DER: cada relación con FK, cardinalidad Y modalidad", p: 6 },
        { t: "DER: marqué las referencias al Servicio I como ID LÓGICO, no como FK, y lo expliqué", p: 5 },
        { t: "DER: el historial de estados es una entidad propia (bitácora), no un campo", p: 4 },
        { t: "DER: varios códigos de retiro por envío (vence y se regenera), hasheados", p: 4 },
        { t: "DER: restricciones NOT NULL / UNIQUE / CHECK donde el enunciado las exige", p: 4 },
        { t: "DER: escribí los supuestos", p: 4 },
        { t: "DER: los 3 párrafos de justificación (persistir / impedance mismatches / desnormalizar)", p: 8 },
        { t: "3FN: dije NO y nombré las tres violaciones con el nombre de cada dependencia (multivaluado / parcial / transitiva)", p: 8 },
        { t: "3FN: expliqué la anomalía concreta que produce cada una (inserción, actualización, borrado)", p: 5 },
        { t: "3FN: propuse el modelo corregido", p: 4 },
        { t: "Desnormalización: separé los dos tipos (consistencia vs performance) y los nombré así", p: 6 },
        { t: "Desnormalización: dije que exige medición previa y que es de última instancia (índices, caché, particionamiento antes)", p: 4 },
        { t: "Desnormalización: nombré la fuente de verdad, conservé las FK y previí el proceso de recálculo", p: 5 },
        { t: "Arquitectura: métricas (4 Golden Signals) + logs estructurados centralizados + correlation ID / trazas", p: 7 },
        { t: "Arquitectura: alertas por síntoma y SLI/SLO (no sólo nombrar herramientas)", p: 3 },
        { t: "Arquitectura: timeout + retry con backoff + circuit breaker + idempotencia + fallback, y Adapter para lo externo", p: 7 },
        { t: "Arquitectura: distinguí lo asincrónico (notificaciones por cola, con DLQ) de lo sincrónico blindado", p: 5 },
        { t: "Arquitectura: object storage + CDN para las fotos y caché con TTL para el listado, con el TTL JUSTIFICADO por tolerancia del negocio", p: 7 },
        { t: "Arquitectura: diagrama de despliegue con nodos, protocolo en cada línea, lo externo marcado y las 3 bases separadas", p: 7 },
        { t: "Decisión monolito/servicios: elegí UNA, con las restricciones del enunciado (6 personas, 4 meses) y los atributos de calidad", p: 7 },
        { t: "Decisión: expliqué que el monolito stateless SÍ escala horizontalmente y qué es lo que NO puede (escalar partes)", p: 6 },
        { t: "Decisión: dibujé el diagrama de despliegue coherente con la decisión y dije qué evidencia la cambiaría", p: 6 },
      ]);
    },
  });
})();
