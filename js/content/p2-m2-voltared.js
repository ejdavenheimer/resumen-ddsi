/* ============================================================
   P2 · Modelo 2 — VoltaRed (contexto del turno del compañero)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-m2-voltared",
    title: "Modelo 2 · VoltaRed (carga eléctrica)",
    tag: "⚡",
    group: "Parcial 2 (práctica)",
    resumen: "Mismo formato, otro dominio: DER + 3FN + desnormalización + arquitectura",
    keywords: ["voltared", "estacion de carga", "conector", "vehiculo electrico", "reserva", "sesion de carga", "modelo", "simulacro", "der", "formas normales", "desnormalizacion"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Modelo 2 · el contexto del otro turno</div>
          <h1>VoltaRed — red de estaciones de carga</h1>
          <p class="lead">El contexto que le tomaron a tu compañero, con <b>la misma estructura de puntos</b>. Hacelo <b>después</b> de PaqueRed: el valor está en repetir el método sobre un dominio distinto, porque el enunciado de mañana no va a ser ninguno de los dos.</p>
        </div>

        <h2>Enunciado</h2>
        <div class="enunciado">
          <h3>Contexto general</h3>
          <p><b>VoltaRed</b> opera una red de <b>estaciones de carga para vehículos eléctricos</b>. Los conductores
          <b>buscan estaciones</b>, <b>reservan un conector</b>, <b>cargan</b> y <b>pagan por la energía consumida</b>; la
          empresa <b>opera y audita</b> la red. El Sistema se compone de <b>tres servicios, cada uno con su propia base de
          datos</b>.</p>

          <h3>Servicio I — Red y Estaciones</h3>
          <p>Administra la infraestructura. Cada <b>estación</b> pertenece a un <b>operador</b> (puede ser propia o de un
          tercero adherido), tiene dirección, coordenadas, <b>servicios disponibles</b> en el lugar (baño, wifi,
          cafetería) y <b>horarios de apertura</b> que varían por día. Cada estación tiene varios <b>conectores</b>, y
          cada conector es de un <b>tipo</b> (Tipo 2, CCS, CHAdeMO) con una <b>potencia</b> en kW, y tiene un
          <b>estado</b> (libre, ocupado, fuera de servicio). La <b>tarifa por kWh</b> se define por estación y tipo de
          conector, y <b>cambia en el tiempo</b> (hay que conservar las tarifas históricas). Se registran las
          <b>intervenciones de mantenimiento</b> sobre los conectores.</p>

          <h3>Servicio II — Reservas y Sesiones de Carga</h3>
          <p>Es el servicio transaccional. Los <b>conductores</b> se registran con uno o varios <b>vehículos</b> (patente,
          marca, modelo, capacidad de batería y tipo de conector compatible). Un conductor <b>reserva</b> un conector de
          una estación para una franja horaria; la reserva <b>vence</b> si no se presenta. Cuando enchufa, se abre una
          <b>sesión de carga</b>, de la que se conocen inicio, fin, <b>energía entregada (kWh)</b>, potencia máxima
          alcanzada y el <b>importe cobrado</b>, que se calcula con la <b>tarifa vigente al momento de la carga</b>. El
          <b>pago</b> se procesa contra una <b>pasarela externa</b> y puede quedar pendiente, aprobado o rechazado. De
          cada sesión hay que poder reconstruir <b>todo su historial de estados</b> y el <b>comprobante debe poder
          reimprimirse tal como se emitió</b>.</p>

          <h3>Servicio III — Operación y Auditoría</h3>
          <p>Recibe de cada conector <b>telemetría periódica y masiva</b> (potencia instantánea, temperatura, estado de
          la conexión). Audita la red y genera <b>métricas</b>: energía total despachada por estación y por mes, factor
          de utilización por franja horaria, sesiones interrumpidas por falla, top 10 de estaciones más usadas y
          <b>liquidación a los operadores adheridos</b>. Todo se consulta desde un tablero.</p>

          <h3>Alcance y requerimientos</h3>
          <ol>
            <li>Que el conductor busque estaciones con conectores disponibles y compatibles con su vehículo.</li>
            <li>Que reserve un conector para una franja horaria.</li>
            <li>Que se registre la sesión de carga con la energía entregada.</li>
            <li>Que se cobre la energía consumida contra una pasarela de pagos.</li>
            <li>Que se audite la telemetría y se liquide a los operadores.</li>
            <li>El envío de notificaciones en todos los casos planteados.</li>
          </ol>
        </div>

        <h2>Punto 1 — Modelo de Datos: DER con justificación</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio II (Reservas y Sesiones de Carga)</b>, indicando entidades,
          campos, <b>PK</b>, <b>FK</b>, <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b>. Indique los
          <b>supuestos</b> y <b>justifique</b> las decisiones de diseño.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 1</summary>
          ${APP.uml(`erDiagram
    CONDUCTOR ||--|{ VEHICULO : "registra (1,N)"
    CONDUCTOR ||--o{ RESERVA : realiza
    VEHICULO ||--o{ RESERVA : "se usa en"
    RESERVA ||--o| SESION_CARGA : "da lugar a (0,1)"
    SESION_CARGA ||--o| PAGO : "genera (0,1)"
    SESION_CARGA ||--|{ EVENTO_SESION : "registra (1,N)"
    MEDIO_PAGO ||--o{ PAGO : "se cobra con"
    CONDUCTOR ||--o{ MEDIO_PAGO : "tiene (0,N)"
    CONDUCTOR {
      int id_conductor PK
      string email "UNIQUE NOT NULL"
      string documento "UNIQUE"
      string nombre "NOT NULL"
      string telefono
      boolean activo "NOT NULL"
    }
    VEHICULO {
      int id_vehiculo PK
      int id_conductor FK "NOT NULL"
      string patente "UNIQUE NOT NULL"
      string marca
      string modelo
      decimal capacidad_bateria_kwh "DECIMAL(6,2)"
      string tipo_conector_compatible "CHECK (TIPO2, CCS, CHADEMO) NOT NULL"
    }
    RESERVA {
      int id_reserva PK
      int id_conductor FK "NOT NULL"
      int id_vehiculo FK "NOT NULL"
      int id_estacion "ID LOGICO - Servicio I - NOT NULL"
      int id_conector "ID LOGICO - Servicio I - NOT NULL"
      datetime desde "NOT NULL"
      datetime hasta "NOT NULL"
      datetime vence_en "NOT NULL - si no se presenta"
      string estado "CHECK (VIGENTE, CUMPLIDA, VENCIDA, CANCELADA)"
      datetime fecha_creacion "NOT NULL"
    }
    SESION_CARGA {
      int id_sesion PK
      int id_reserva FK "UNIQUE NULL - puede cargar sin reserva"
      int id_conductor FK "NOT NULL"
      int id_vehiculo FK "NOT NULL"
      int id_estacion "ID LOGICO NOT NULL"
      int id_conector "ID LOGICO NOT NULL"
      datetime inicio "NOT NULL"
      datetime fin "NULL mientras carga"
      decimal energia_kwh "DECIMAL(10,3)"
      decimal potencia_max_kw "DECIMAL(8,2)"
      string estado "CHECK (EN_CURSO, FINALIZADA, INTERRUMPIDA)"
      decimal precio_kwh_aplicado "congelado - tarifa vigente al cargar"
      decimal importe "DECIMAL(12,2) - energia x precio aplicado"
      string direccion_estacion_emision "congelado"
      string tipo_conector_emision "congelado"
    }
    EVENTO_SESION {
      int id_evento PK
      int id_sesion FK "NOT NULL"
      string estado_resultante "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string origen "CHECK (CONDUCTOR, CONECTOR, SISTEMA, OPERADOR)"
      string motivo "congelado"
    }
    MEDIO_PAGO {
      int id_medio PK
      int id_conductor FK "NOT NULL"
      string tipo "CHECK (TARJETA, BILLETERA)"
      string ultimos_4 "nunca el numero completo"
      string token_pasarela "token, NO datos de tarjeta"
      boolean predeterminado
    }
    PAGO {
      int id_pago PK
      int id_sesion FK "UNIQUE NOT NULL"
      int id_medio FK "NOT NULL"
      decimal monto "DECIMAL(12,2) NOT NULL"
      string estado "CHECK (PENDIENTE, APROBADO, RECHAZADO, REINTEGRADO)"
      string id_externo_pasarela "UNIQUE - clave de idempotencia"
      datetime fecha "NOT NULL"
      string motivo_rechazo
    }`, "Servicio II — Reservas y Sesiones de Carga")}
          <h3>Supuestos</h3>
          <ul>
            <li>Un conductor registra <b>uno o varios</b> vehículos (<code>1,N</code>: no hay conductor sin vehículo).</li>
            <li><b>Estación y conector pertenecen al Servicio I</b> → <b>IDs lógicos, no FK</b>: cada servicio tiene su
            propia base, no hay integridad referencial entre servicios y la validación es de la aplicación.</li>
            <li><code>SESION_CARGA.id_reserva</code> es <b>NULL</b>: el enunciado permite buscar y cargar, así que
            modelo la posibilidad de <b>cargar sin reserva previa</b>. El <b>UNIQUE</b> impide dos sesiones para la misma
            reserva.</li>
            <li>El <b>pago</b> es <b>0,1</b> respecto de la sesión: una sesión en curso todavía no tiene pago, y una
            interrumpida sin energía entregada puede no generarlo. <code>id_externo_pasarela</code> con <b>UNIQUE</b>
            funciona como <b>clave de idempotencia</b>: si hay timeout contra la pasarela, reintentar <b>no cobra dos
            veces</b>.</li>
            <li><b>Nunca</b> se guardan datos completos de tarjeta: sólo un <b>token</b> de la pasarela y los últimos 4
            dígitos (PCI; y la Ley 25.326 para los datos personales).</li>
            <li>El <b>historial de estados</b> de la sesión es una entidad (<code>EVENTO_SESION</code>,
            <code>1,N</code>), porque el enunciado pide poder reconstruirlo; el campo <code>estado</code> de la sesión es
            el <b>estado actual</b> (derivado del último evento).</li>
            <li>Si los estados se modelaron con el patrón <b>State</b>, esas clases <b>no se persisten</b>: son
            comportamiento. Se persiste el estado actual + el historial.</li>
            <li>La <b>telemetría</b> del conector <b>no se modela acá</b>: por volumen y patrón de acceso (escritura
            masiva, consulta por rango de tiempo) va al Servicio III sobre una <b>base de series temporales</b>.</li>
          </ul>
          <h3>Justificación (los 3 párrafos)</h3>
          <p><b>a) Qué persistir.</b> Las entidades con identidad y ciclo de vida propio: Conductor, Vehículo, Medio de
          pago, Reserva, Sesión, Evento y Pago. <b>No persisto</b> lo derivable (el <b>costo</b> es
          <code>energia_kwh × precio_kwh_aplicado</code>; el <b>porcentaje de batería cargado</b> se calcula con la
          capacidad del vehículo), ni los DTOs, ni las clases de comportamiento (State de la sesión, Strategy de
          tarifación), ni los binarios (el comprobante PDF va a <b>object storage</b> y la base guarda la <b>URL</b>).
          Los Value Objects sin identidad (período desde/hasta, dinero) van <b>embebidos</b>.</p>
          <p><b>b) Impedance mismatches.</b> <b>Identidad:</b> PK subrogada, con <b>UNIQUE</b> en las claves naturales
          (<code>patente</code>, <code>email</code>, <code>documento</code>, <code>id_externo_pasarela</code>).
          <b>Tipos:</b> VARCHAR con longitud; <b>DECIMAL</b> para energía e importes (<b>no DOUBLE</b>: el redondeo en un
          importe cobrado es un error de negocio); DATETIME para las marcas de tiempo. <b>Cardinalidad:</b> una sola FK
          del lado “muchos” y navegación inversa por el ORM; no hay N:M en este servicio (si hubiera “conductores que
          comparten un vehículo de flota”, sería tabla intermedia). <b>Herencia:</b> si Medio de Pago se modelara como
          jerarquía (Tarjeta / Billetera) con atributos propios, usaría <b>SINGLE_TABLE con discriminador</b> —pocos
          atributos propios y siempre se listan juntos—, asumiendo columnas nulables; con muchos atributos obligatorios
          por subtipo, <b>JOINED</b>. <b>Enums:</b> estados y tipos de conector son conjuntos cerrados → enum
          <b>STRING</b> + <b>CHECK</b> (nunca ORDINAL). Si los tipos de conector se administraran desde la plataforma,
          <b>tabla maestra</b> con FK.</p>
          <p><b>c) Qué desnormalizo.</b> Por <b>consistencia</b>: <code>precio_kwh_aplicado</code>,
          <code>importe</code>, <code>direccion_estacion_emision</code> y <code>tipo_conector_emision</code> quedan
          <b>congelados en la sesión</b>. <b>Es el caso más claro de todo el enunciado:</b> la tarifa <b>cambia en el
          tiempo</b>, y si el importe se recalculara con la tarifa vigente, <b>todas las sesiones pasadas cambiarían de
          precio</b> — el modelo normalizado devolvería un resultado <b>incorrecto para el negocio</b> y el comprobante
          no se podría reimprimir igual. <b>Conservo las FK/IDs</b> para navegar al maestro actual. Por
          <b>performance</b>: nada todavía; si el listado de sesiones del conductor se vuelve crítico, replicaría
          <code>nombre_estacion</code> declarando el Servicio I como <b>fuente de verdad</b>, con propagación por
          <b>evento</b>, encapsulada en un único punto, y un <b>proceso de recálculo</b>.</p>
        </details>

        <h2>Punto 2 — Auditar un DER contra las 3 formas normales</h2>
        <div class="card">
          <p>Se le presenta el modelo ya construido del <b>Servicio I (Red y Estaciones)</b>. <b>¿Cumple con las tres
          primeras formas normales?</b> Indique <b>sí o no</b> y explique <b>en dos renglones</b> qué problema existe.</p>
          ${APP.code(`ESTACION (
   id_estacion            INTEGER      PK,
   nombre                 VARCHAR(60),
   direccion              VARCHAR(120),
   latitud                DECIMAL(9,6),
   longitud               DECIMAL(9,6),
   servicios              VARCHAR(200),   -- "baño, wifi, cafetería"
   conector_1_tipo        VARCHAR(20),
   conector_2_tipo        VARCHAR(20),
   conector_3_tipo        VARCHAR(20),
   potencia_total_kw      DECIMAL(8,2),
   id_operador            INTEGER,
   razon_social_operador  VARCHAR(80),
   cuit_operador          VARCHAR(13)
)

TARIFA (
   id_estacion                INTEGER  PK,  FK -> ESTACION,
   id_tipo_conector           INTEGER  PK,
   vigente_desde              DATE     PK,
   precio_kwh                 DECIMAL(10,4),
   nombre_estacion            VARCHAR(60),
   descripcion_tipo_conector  VARCHAR(40),
   potencia_kw_tipo           DECIMAL(8,2)
)

MANTENIMIENTO_CONECTOR (
   id_mantenimiento INTEGER  PK,
   id_estacion      INTEGER  FK,
   nro_conector     INTEGER,
   fecha            DATETIME,
   tipo             VARCHAR(40),
   costo            DECIMAL(10,2),
   iva              DECIMAL(10,2),
   total            DECIMAL(10,2)
)`, { lang: "sql", collapse: false, label: "Modelo dado del Servicio I" })}
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 2</summary>
          <div class="callout key">
            <div class="callout-title">La respuesta de dos renglones</div>
            <p><b>No, no cumple ninguna de las tres.</b> <b>1FN:</b> <code>servicios</code> es un atributo
            <b>multivaluado</b> (una lista en una celda) y <code>conector_1_tipo..conector_3_tipo</code> es un
            <b>grupo repetitivo</b> que además limita artificialmente a tres conectores. <b>2FN:</b> en
            <code>TARIFA</code>, con PK compuesta <code>(id_estacion, id_tipo_conector, vigente_desde)</code>,
            <code>nombre_estacion</code> depende sólo de <code>id_estacion</code> y la descripción y la potencia del tipo
            dependen sólo de <code>id_tipo_conector</code> → <b>dependencias parciales</b>. <b>3FN:</b>
            <code>razon_social_operador</code> y <code>cuit_operador</code> dependen de <code>id_operador</code>,
            atributo <b>no clave</b> → <b>dependencia transitiva</b>; y <code>potencia_total_kw</code> y
            <code>total</code> son <b>datos derivados</b> (la suma de las potencias de sus conectores y
            <code>costo + iva</code>). Produce <b>redundancia</b> y <b>anomalías de actualización y borrado</b>: cambiar
            la razón social de un operador obliga a actualizar todas sus estaciones, y agregar un cuarto conector a una
            estación <b>no se puede sin modificar la tabla</b>.</p>
          </div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>FN</th><th>Dónde</th><th>Por qué</th><th>Anomalía concreta</th></tr></thead>
            <tbody>
              <tr><td><b>1FN</b></td><td><code>ESTACION.servicios</code></td><td>Atributo <b>no atómico</b></td><td>No se puede filtrar “estaciones con wifi” sin parsear texto, ni validar los valores</td></tr>
              <tr><td><b>1FN</b></td><td><code>conector_1_tipo..3</code></td><td><b>Grupo repetitivo</b>: el conector es una <b>entidad</b>, no tres columnas</td><td><b>Inserción:</b> una estación con 6 conectores no entra sin <b>alterar la tabla</b>; una con 1 deja dos columnas nulas; y no se puede guardar el <b>estado</b> ni el número de cada conector</td></tr>
              <tr><td><b>2FN</b></td><td><code>TARIFA.nombre_estacion</code></td><td>Depende sólo de <code>id_estacion</code>, parte de la PK compuesta → <b>parcial</b></td><td>Renombrar una estación obliga a actualizar todas sus filas de tarifa, de todos los períodos</td></tr>
              <tr><td><b>2FN</b></td><td><code>descripcion_tipo_conector</code>, <code>potencia_kw_tipo</code></td><td>Dependen sólo de <code>id_tipo_conector</code> → <b>parcial</b></td><td>Corregir la potencia del tipo CCS implica recorrer todas las tarifas de todas las estaciones</td></tr>
              <tr><td><b>3FN</b></td><td><code>razon_social_operador</code>, <code>cuit_operador</code></td><td>Dependen de <code>id_operador</code>, no clave → <b>transitiva</b></td><td><b>Actualización:</b> N filas por operador. <b>Borrado:</b> si se da de baja su última estación, se pierden razón social y CUIT. <b>Inserción:</b> no se puede registrar un operador sin estación</td></tr>
              <tr><td><b>3FN</b></td><td><code>potencia_total_kw</code></td><td><b>Derivado</b>: <code>SUM</code> de la potencia de sus conectores</td><td>Se desincroniza al agregar o quitar un conector</td></tr>
              <tr><td><b>3FN</b></td><td><code>MANTENIMIENTO.total</code></td><td><b>Derivado</b>: <code>costo + iva</code></td><td>Puede quedar un total que no coincide con sus componentes</td></tr>
            </tbody>
          </table></div>
          <div class="callout tip">
            <p><b>El matiz:</b> hay <b>una cosa que el modelo dado hace BIEN</b> y conviene reconocerla, porque demuestra
            criterio: <code>vigente_desde</code> dentro de la PK de <code>TARIFA</code> permite <b>conservar las tarifas
            históricas</b>, que es un requerimiento explícito del enunciado. Y <code>precio_kwh</code> en la tabla de
            tarifas <b>no es redundante</b>: es el dato maestro. Lo que <b>sí</b> hay que copiar es el precio
            <b>aplicado</b> en la <b>sesión de carga</b> (Servicio II), y eso es <b>desnormalización por consistencia</b>,
            no un error.</p>
          </div>
          <h3>Modelo corregido</h3>
          ${APP.code(`OPERADOR        (id_operador PK, razon_social NOT NULL, cuit UNIQUE NOT NULL, email)
ESTACION        (id_estacion PK, nombre NOT NULL, direccion NOT NULL,
                 latitud, longitud, id_operador FK NOT NULL, estado NOT NULL)
SERVICIO        (id_servicio PK, nombre UNIQUE NOT NULL)            -- catálogo
ESTACION_SERVICIO (id_estacion PK FK, id_servicio PK FK)            -- N:M, resuelve 1FN
HORARIO_ESTACION  (id_horario PK, id_estacion FK NOT NULL, dia_semana NOT NULL,
                   hora_desde NOT NULL, hora_hasta NOT NULL)
TIPO_CONECTOR   (id_tipo_conector PK, nombre UNIQUE NOT NULL,
                 descripcion, potencia_kw NOT NULL)                 -- resuelve 2FN
CONECTOR        (id_estacion PK FK, nro_conector PK,
                 id_tipo_conector FK NOT NULL,
                 estado NOT NULL CHECK (estado IN ('LIBRE','OCUPADO','FUERA_SERVICIO')))
TARIFA          (id_estacion PK FK, id_tipo_conector PK FK, vigente_desde PK,
                 precio_kwh NOT NULL CHECK (precio_kwh > 0), vigente_hasta NULL)
TECNICO         (id_tecnico PK, legajo UNIQUE NOT NULL, nombre NOT NULL)
MANTENIMIENTO_CONECTOR (id_mantenimiento PK, id_estacion FK NOT NULL,
                 nro_conector NOT NULL, id_tecnico FK NOT NULL,
                 fecha NOT NULL, tipo NOT NULL, costo, iva,
                 FOREIGN KEY (id_estacion, nro_conector) REFERENCES CONECTOR)

-- potencia_total_kw y total se CALCULAN (SUM / costo+iva), no se almacenan.
-- El conector pasa a ser entidad: ahora tiene número, tipo y estado propios,
-- y una estación puede tener N conectores sin alterar el esquema.`, { lang: "sql", collapse: false, label: "En 3FN" })}
          <p class="mini"><b>Igual que en PaqueRed:</b> <code>nro_conector</code> en MANTENIMIENTO debe ser parte de una
          <b>FK compuesta</b> <code>(id_estacion, nro_conector)</code>, porque el número sólo identifica dentro de su
          estación. En el modelo dado está suelto y sin FK: se puede registrar mantenimiento de un conector que no
          existe. Es un problema de <b>integridad referencial</b>, no de normalización, y conviene señalarlo aparte.</p>
        </details>

        <h2>Punto 3 — Desnormalización</h2>
        <div class="card">
          <p>El tablero del <b>Servicio III</b> debe mostrar la <b>energía despachada por estación y por mes</b>, el
          <b>factor de utilización por franja horaria</b> y la <b>liquidación mensual a los operadores adheridos</b>;
          hoy se calcula sobre millones de filas de telemetría y demora minutos. Además, los operadores reclaman que
          <b>una liquidación recalculada da un importe distinto</b> al que se les pagó.</p>
          <p>¿Qué estructuras <b>desnormalizaría</b>? ¿De qué <b>tipo</b> es cada caso y qué <b>costos</b> asume?</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 3</summary>
          <h3>① Por CONSISTENCIA — la liquidación y el comprobante</h3>
          <p>Que una liquidación recalculada dé otro importe <b>no es un problema de performance: es un resultado
          incorrecto para el negocio</b>. Pasa porque el cálculo usa la <b>tarifa y la comisión vigentes</b> (la FK dice
          “el valor <b>actual</b>”) en lugar de las que estaban <b>al momento del hecho</b>. Cualquier cambio de tarifa
          o de porcentaje de comisión <b>reescribe el pasado</b>. Son documentos <b>inmutables con valor probatorio</b>,
          así que los datos <b>se copian</b>:</p>
          ${APP.code(`SESION_CARGA ( ..., precio_kwh_aplicado, importe,
               direccion_estacion_emision, tipo_conector_emision )
LIQUIDACION  ( id_liquidacion PK, id_operador, periodo,
               porcentaje_comision_aplicado,   -- congelado
               razon_social_operador_emision,  -- congelado
               cuit_operador_emision,          -- congelado
               energia_total_kwh, importe_bruto, comision, importe_neto )
-- Técnica: dato de contexto congelado. Se CONSERVAN las FK para navegar al maestro vigente.`, { lang: "sql", collapse: false, label: "Datos congelados" })}
          <p><b>Criterio:</b> si el dato <b>integra un documento con valor probatorio, se copia</b>; si sólo sirve para
          <b>navegar, se referencia</b>. Por eso el <b>teléfono de contacto</b> del operador <b>no</b> se congela:
          ahí interesa el valor vigente.</p>
          <h3>② Por PERFORMANCE — el tablero</h3>
          <p>Acá el modelo <b>es correcto pero lento</b>: el costo está en las <b>agregaciones repetidas</b> (SUM, COUNT,
          GROUP BY) sobre millones de filas de telemetría. Es una decisión de <b>última instancia</b> y <b>exige
          medición previa</b>: primero plan de ejecución, índices, reescritura de consultas, <b>particionamiento por
          fecha</b>, réplicas de lectura y caché. Si no alcanza:</p>
          ${APP.code(`-- a) TABLA DE RESUMEN (preagregación) por proceso batch nocturno
ENERGIA_DIARIA_ESTACION (fecha, id_estacion, franja_horaria,
                         kwh_despachados, sesiones, minutos_ocupado,
                         minutos_disponibles, sesiones_interrumpidas)
   -- factor_utilizacion = minutos_ocupado / minutos_disponibles
   -- Base del modelo dimensional: tabla de hechos + dimensiones
   -- deliberadamente desnormalizadas (esquema estrella).

-- b) CAMPOS DERIVADOS precalculados
SESION_CARGA.duracion_minutos        -- en lugar de (fin - inicio) en cada consulta
ESTACION_RESUMEN.kwh_mes             -- en lugar de SUM sobre la telemetría

-- c) VISTA MATERIALIZADA refrescada por el motor
TOP_ESTACIONES_MES                   -- ranking de las 10 más usadas

-- d) ATRIBUTO REPLICADO para evitar el JOIN en los listados
SESION_CARGA.nombre_estacion         -- conservando id_estacion (fuente de verdad)`, { lang: "sql", collapse: false, label: "Desnormalización por performance" })}
          <p><b>Y la telemetría misma no va en la relacional:</b> escritura masiva <i>append-only</i> y consulta por
          <b>rango de tiempo</b> es el caso de uso canónico de una <b>base de series temporales</b> (InfluxDB,
          TimescaleDB), con <b>políticas de retención y downsampling</b> — alta resolución poco tiempo, baja resolución
          mucho tiempo. Para la analítica de meses, un almacén <b>columnar</b> (BigQuery/Redshift), que es muy eficiente
          en consultas que tocan <b>pocas columnas y muchas filas</b>. Eso es <b>persistencia políglota</b>.</p>
          <h3>Costos que asumo</h3>
          <ul>
            <li>Reaparecen las <b>anomalías de actualización</b>; la <b>escritura se encarece</b> (propagación con
            bloqueos); la <b>integridad pasa al software</b> (triggers, servicios de dominio, batch).</li>
            <li><b>Ventana de inconsistencia</b>: el tablero puede estar hasta <b>24 h</b> desactualizado (métricas de
            gestión: aceptable). En el <b>importe cobrado o la liquidación</b>, la tolerancia es <b>cero</b>: esos van
            congelados y no por batch.</li>
            <li>Más volumen, índices y backups; y dos consultas equivalentes pueden dar resultados distintos → hay que
            <b>declarar la fuente de verdad</b> y <b>monitorear la divergencia</b>.</li>
            <li><b>Condición innegociable:</b> todo dato derivado debe ser <b>reconstruible</b> por un proceso de
            recálculo.</li>
          </ul>
        </details>

        <h2>Punto 4 — Arquitectura</h2>
        <div class="card">
          <p><b>a)</b> ¿Qué <b>métricas</b> y qué estrategia de <b>logs</b> propone para saber qué pasa en producción?
          ¿Cómo reconstruye una operación que atravesó los tres servicios?</p>
          <p><b>b)</b> El cobro se hace contra una <b>pasarela de pagos externa</b> con caídas frecuentes, costo por
          solicitud y tiempos de respuesta elevados. ¿Qué patrones aplica? ¿Qué pasa si hay <b>timeout pero la pasarela
          igual cobró</b>?</p>
          <p><b>c)</b> La app muestra un <b>mapa con las estaciones y sus fotos</b> y el <b>listado de conectores
          disponibles</b>, que se consulta permanentemente. ¿Qué componentes incorpora y qué <b>TTL</b> define?</p>
          <p><b>d)</b> <b>Diagrama de despliegue</b>.</p>
          <p><b>e)</b> <b>6 programadores</b>, <b>4 meses</b> para lanzar y <b>un servicio con 8× más requests</b>:
          ¿monolito o servicios? Justifique y <b>grafique</b>.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 4 (a, c, d, e remiten al Modelo 1; acá va lo propio de VoltaRed)</summary>
          <p>La estructura de la respuesta es <b>idéntica</b> a la de PaqueRed —por eso conviene hacer los dos—, así que
          acá va sólo lo que cambia. Para el desarrollo completo mirá
          <a class="inline" data-go="p2-m1-paquered">Modelo 1 · PaqueRed</a>.</p>
          <h3>a) Observabilidad — lo específico</h3>
          <ul>
            <li><b>Golden Signals:</b> <b>latencia</b> p95/p99 de “iniciar sesión de carga” y de “cobrar”, <b>separando
            la latencia de la pasarela</b> (es la dependencia sospechosa); <b>tráfico</b> en sesiones iniciadas por
            minuto y <b>kWh despachados</b> (métrica de negocio: una caída es el mejor detector de incidentes);
            <b>errores</b> en % de 5xx y <b>pagos rechazados</b> (ojo: el rechazo es un <b>error de negocio</b>, no una
            falla del sistema — hay que medirlos por separado); <b>saturación</b> en pool de BD y
            <b>lag del consumidor de telemetría</b>.</li>
            <li><b>Nunca</b> loguear datos de tarjeta, el token de la pasarela ni el documento del conductor.</li>
            <li><b>Correlation ID</b> desde el gateway y propagado también en los <b>mensajes de la cola</b>, para poder
            seguir “sesión → cobro → notificación → liquidación” en un solo filtro.</li>
          </ul>
          <h3>b) El cobro: el caso donde la idempotencia es obligatoria</h3>
          <p>El cobro es <b>sincrónico</b> (el conductor espera saber si se aprobó), así que va blindado:
          <b>timeout</b> siempre definido, <b>reintentos limitados con backoff</b>, <b>circuit breaker</b> que abre tras
          N fallos y <b>falla rápido</b> con un <b>fallback</b> (“pago pendiente”, la sesión se cierra y se reintenta por
          un proceso diferido), y <b>Adapter</b> contra una interfaz propia del dominio, para que cambiar de pasarela sea
          otro adapter.</p>
          <div class="callout key">
            <div class="callout-title">⚠️ “Timeout pero la pasarela igual cobró” — la respuesta exacta</div>
            <p>Con timeout, <b>A queda en incertidumbre</b>: la pasarela pudo haber procesado el cobro. <b>Reintentar a
            ciegas cobra dos veces.</b> La salida es la <b>clave de idempotencia</b>: cada intento de cobro lleva una
            clave única por operación (<code>id_externo_pasarela</code>, con UNIQUE en la base). Tras el timeout,
            <b>consulto</b> el estado de esa clave contra la pasarela, o <b>reintento con la misma clave</b>: la pasarela
            reconoce la operación y <b>devuelve el mismo resultado sin volver a cobrar</b>. Nunca se genera una clave
            nueva para un reintento. Y como el proveedor <b>cobra por solicitud</b>, conviene además <b>cachear</b>
            resultados consultables y no reintentar lo que ya se sabe rechazado.</p>
            <p>El mismo razonamiento vale para la cola: la entrega es <b>at-least-once</b>, así que el consumidor que
            emite el comprobante o la notificación debe ser <b>idempotente</b> (guardando el id del mensaje procesado) y
            los mensajes irreprocesables van a una <b>DLQ</b>.</p>
          </div>
          <h3>c) CDN y TTL — lo específico</h3>
          <ul>
            <li><b>Fotos de estaciones y estáticos de la app</b> → <b>object storage + CDN</b>, <b>TTL largo</b> con
            <b>versión en el nombre del archivo</b>. El backend sólo entrega la <b>URL</b>.</li>
            <li><b>Mapa / listado de estaciones</b> (datos casi estáticos: nombre, dirección, tipos de conector) →
            caché con <b>TTL de minutos</b>.</li>
            <li><b>Disponibilidad de conectores</b> (libre/ocupado) → <b>TTL de 5 a 15 segundos</b> <b>más invalidación
            por evento</b> cuando se reserva o se inicia una carga. Justificación: es el dato que <b>cambia todo el
            tiempo</b> y mostrar “libre” cuando ya está ocupado genera un viaje en falso del conductor, así que la
            tolerancia es <b>mucho menor</b> que en un listado común — pero sin caché la base no soporta la consulta
            permanente del mapa.</li>
            <li><b>Tarifa vigente</b> → TTL de minutos; <b>el importe de una sesión en curso</b> → <b>sin caché</b>.</li>
          </ul>
          <h3>d) Diagrama de despliegue</h3>
          ${APP.uml(`graph LR
    C["🧍 Conductor<br/>«device» app mobile"] -->|HTTPS| CDN["CDN · fotos y estáticos"]
    C -->|HTTPS| WAF["WAF"]
    O["🏢 Operador adherido<br/>«browser» SPA"] -->|HTTPS| WAF
    CN["⚡ Conector<br/>«device» módulo OCPP/IoT"] -->|MQTT/TLS| BK[("Broker<br/>colas y topics")]
    WAF --> LB["⚖️ Load Balancer L7"]
    LB --> GW["API Gateway<br/>JWT · rate limiting"]
    GW --> S1["Servicio I · Red y Estaciones<br/>«container» xN"]
    GW --> S2["Servicio II · Reservas y Sesiones<br/>«container» xN"]
    GW --> S3["Servicio III · Operación y Auditoría<br/>«container» xN"]
    S1 --> DB1[("BD Red")]
    S2 --> DB2[("BD Sesiones + réplica")]
    S3 --> TS[("TSDB · telemetría")]
    S3 --> OL[("BD columnar · resúmenes")]
    S1 --> CA[("Redis · caché TTL")]
    S2 --> CA
    S2 -->|HTTPS + circuit breaker<br/>+ clave de idempotencia| PG["Pasarela de pagos<br/>«externo»"]
    S2 -->|publica evento| BK
    BK --> W["Workers · notificaciones<br/>liquidación batch"]
    BK --> ING["Ingesta de telemetría<br/>«container» xN"]
    ING --> TS
    S1 --> OBJ[("Object Storage · fotos")]
    style WAF fill:#fee2e2,stroke:#b91c1c,color:#0f172a
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style BK fill:#fffbeb,stroke:#b45309,color:#0f172a`, "VoltaRed — diagrama de despliegue")}
          <h3>e) Monolito vs. servicios</h3>
          <p>La decisión y su justificación son <b>las mismas</b> que en el Modelo 1 (equipo de 6, plazo de 4 meses,
          límites inciertos, costo operativo, Monolith First, y que el monolito <b>stateless escala
          horizontalmente</b> aunque no pueda escalar partes de forma independiente) →
          <a class="inline" data-go="p2-m1-paquered">ver la respuesta completa</a>.</p>
          <p><b>El matiz propio de VoltaRed:</b> acá el servicio con 8× más tráfico es casi con certeza el de
          <b>telemetría/ingesta</b>, no el transaccional — miles de conectores reportando cada pocos segundos contra
          cientos de conductores iniciando cargas. Y eso <b>refuerza</b> la recomendación: la ingesta tiene un
          <b>patrón de carga, un tipo de base (TSDB) y un ciclo de despliegue claramente distintos</b> del resto, así que
          es el <b>candidato natural a ser el único servicio extraído</b>. La arquitectura que propongo es
          <b>monolito modular para el dominio transaccional + un servicio de ingesta separado detrás del broker</b>:
          atiende el 8× sin pagar la complejidad de distribuir todo, y es exactamente lo que el patrón
          <b>Strangler</b> haría primero. <b>Además, el broker ya desacopla la ingesta del resto</b>: si la ingesta se
          satura, los mensajes esperan en la cola y <b>las cargas siguen funcionando</b>.</p>
        </details>

        <h2>Autoevaluación</h2>
        <div id="p2m2rub"></div>
      `;

      APP.rubrica(el.querySelector("#p2m2rub"), "p2-m2-voltared", [
        { t: "DER: entidades con PK, FK, cardinalidad y modalidad", p: 8 },
        { t: "DER: IDs lógicos (no FK) hacia el Servicio I, explicado", p: 5 },
        { t: "DER: sesión sin reserva posible (FK nullable) y UNIQUE donde corresponde", p: 4 },
        { t: "DER: historial de estados como entidad; el estado actual como atributo", p: 4 },
        { t: "DER: medio de pago con token, nunca datos completos de tarjeta", p: 4 },
        { t: "DER: supuestos escritos", p: 4 },
        { t: "DER: los 3 párrafos de justificación", p: 8 },
        { t: "3FN: dije NO y nombré las violaciones por su nombre (multivaluado, grupo repetitivo, parcial, transitiva, derivado)", p: 8 },
        { t: "3FN: señalé que el conector debe ser una ENTIDAD, no tres columnas", p: 4 },
        { t: "3FN: reconocí lo que el modelo hace bien (vigente_desde en la PK conserva el histórico de tarifas)", p: 3 },
        { t: "3FN: modelo corregido", p: 4 },
        { t: "Desnormalización: separé consistencia (tarifa aplicada congelada, liquidación) de performance (tabla de resumen)", p: 7 },
        { t: "Desnormalización: dije que la telemetría va a TSDB y la analítica a columnar (persistencia políglota)", p: 4 },
        { t: "Desnormalización: costos + fuente de verdad + proceso de recálculo", p: 5 },
        { t: "Arquitectura: métricas, logs estructurados y correlation ID / trazas", p: 6 },
        { t: "Arquitectura: timeout + retry + circuit breaker + fallback, y Adapter para la pasarela", p: 6 },
        { t: "Arquitectura: resolví el “timeout pero igual cobró” con CLAVE DE IDEMPOTENCIA (consultar o reintentar con la misma clave)", p: 7 },
        { t: "Arquitectura: CDN para fotos y caché con TTL corto + invalidación por evento para la disponibilidad", p: 6 },
        { t: "Arquitectura: diagrama de despliegue con protocolos, externos y las 3 bases", p: 7 },
        { t: "Decisión monolito/servicios: elegí una, con las restricciones del enunciado, y la grafiqué", p: 8 },
      ]);
    },
  });
})();
