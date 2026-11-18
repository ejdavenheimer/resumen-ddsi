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
          tercero adherido), tiene <b>dirección</b> y coordenadas, ofrece <b>servicios complementarios</b> en el lugar
          (baño, wifi, cafetería, estacionamiento techado) y tiene <b>horarios de atención</b> que varían por día de la
          semana. Cada estación tiene varios <b>cargadores</b>, de los que se conoce su <b>número de serie</b>, la
          <b>potencia máxima</b> en kW, el <b>tipo de corriente</b> (alterna o continua) y su <b>estado operativo</b>; y
          <b>cada cargador tiene uno o varios conectores</b>. Cada conector es de un <b>tipo</b> (Tipo 2, CCS, CHAdeMO)
          con una <b>potencia nominal</b>, y tiene una <b>disponibilidad actual</b> (libre, ocupado, fuera de servicio)
          de la que además interesa el <b>historial</b>. La <b>tarifa por kWh</b> se define por estación y tipo de
          conector, <b>varía según la franja horaria</b> (pico, valle, nocturna) y <b>cambia en el tiempo</b>: hay que
          conservar las <b>tarifas históricas</b>. Se registran las <b>intervenciones de mantenimiento</b>, con su fecha,
          tipo y el <b>técnico</b> interviniente.</p>

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

        <div class="callout key">
          <div class="callout-title">🎧 Calibrado con lo que contó tu compañero</div>
          <p>Según el relato de cómo resolvió su parcial, el DER que tomaron fue el del <b>servicio de gestión de la
          red</b> (no el transaccional), y lo que lo hacía “grande” era esto: una <b>jerarquía anidada de tres
          niveles</b> (estación → <b>cargadores</b> → conectores), <b>dos relaciones N:M</b> resueltas con tablas
          intermedias (servicios complementarios y horarios), <b>historiales</b> (de mantenimiento y de disponibilidad
          del conector), un <b>técnico</b> sacado a su propia tabla, y la <b>tarifa con su franja horaria</b> en otra
          tabla. Además tuvo que decidir si la <b>dirección</b> era una entidad aparte o iba dentro de la estación —y
          lo justificó por <b>reutilización</b>—.</p>
          <p>Por eso agregué este punto: <b>el DER del Servicio I resuelto</b>. Es el escenario más probable. El del
          Servicio II queda abajo por si te toca el transaccional.</p>
        </div>

        <h2>Punto 1 — DER del Servicio I (Red y Estaciones)</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio I</b>, indicando entidades, campos, <b>PK</b>, <b>FK</b>,
          <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b>. Indique los <b>supuestos</b> y <b>justifique</b>
          las decisiones de diseño.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — DER del Servicio I</summary>
          ${APP.uml(`erDiagram
    OPERADOR ||--o{ ESTACION : "opera (1,N)"
    ESTACION ||--|{ CARGADOR : "tiene (1,N)"
    CARGADOR ||--|{ CONECTOR : "tiene (1,N)"
    TIPO_CONECTOR ||--o{ CONECTOR : clasifica
    CONECTOR ||--o{ HISTORIAL_CONECTOR : registra
    ESTACION ||--o{ HORARIO_ATENCION : "abre (1,N)"
    ESTACION ||--o{ ESTACION_SERVICIO : ofrece
    SERVICIO_COMPLEMENTARIO ||--o{ ESTACION_SERVICIO : "se ofrece en"
    CARGADOR ||--o{ MANTENIMIENTO : recibe
    TECNICO ||--o{ MANTENIMIENTO : realiza
    ESTACION ||--o{ TARIFA : define
    TIPO_CONECTOR ||--o{ TARIFA : "se tarifa por"
    FRANJA_HORARIA ||--o{ TARIFA : aplica
    OPERADOR {
      int id_operador PK
      string razon_social "NOT NULL"
      string cuit "UNIQUE NOT NULL"
      decimal pct_comision "DECIMAL(5,2)"
    }
    ESTACION {
      int id_estacion PK
      int id_operador FK "NOT NULL"
      string nombre "NOT NULL"
      string calle "NOT NULL - direccion EMBEBIDA"
      string altura
      string localidad "NOT NULL"
      string provincia
      string codigo_postal
      decimal latitud "DECIMAL(9,6)"
      decimal longitud "DECIMAL(9,6)"
      string estado "CHECK (ACTIVA, INACTIVA, EN_OBRA)"
    }
    SERVICIO_COMPLEMENTARIO {
      int id_servicio PK
      string nombre "UNIQUE NOT NULL - bano, wifi, cafeteria"
    }
    ESTACION_SERVICIO {
      int id_estacion PK "y FK"
      int id_servicio PK "y FK"
    }
    HORARIO_ATENCION {
      int id_horario PK
      int id_estacion FK "NOT NULL"
      int dia_semana "CHECK (1..7) NOT NULL"
      time hora_desde "NOT NULL"
      time hora_hasta "NOT NULL"
    }
    CARGADOR {
      string nro_serie PK "clave natural"
      int id_estacion FK "NOT NULL"
      decimal potencia_max_kw "DECIMAL(8,2) NOT NULL"
      string tipo_corriente "CHECK (AC, DC) NOT NULL"
      string estado_operativo "CHECK (OPERATIVO, EN_REPARACION, BAJA)"
      date fecha_instalacion
    }
    TIPO_CONECTOR {
      int id_tipo_conector PK
      string nombre "UNIQUE NOT NULL - TIPO2, CCS, CHADEMO"
      decimal potencia_nominal_kw "DECIMAL(8,2) NOT NULL"
      string descripcion
    }
    CONECTOR {
      string nro_serie PK "y FK al cargador"
      int nro_conector PK "numero dentro del cargador"
      int id_tipo_conector FK "NOT NULL"
      string disponibilidad_actual "CHECK (LIBRE, OCUPADO, FUERA_SERVICIO)"
    }
    HISTORIAL_CONECTOR {
      int id_historial PK
      string nro_serie FK "NOT NULL"
      int nro_conector FK "NOT NULL"
      string disponibilidad "NOT NULL"
      datetime desde "NOT NULL"
      datetime hasta "NULL si es el estado vigente"
      string motivo
    }
    TECNICO {
      int id_tecnico PK
      string legajo "UNIQUE NOT NULL"
      string nombre "NOT NULL"
      string especialidad
    }
    MANTENIMIENTO {
      int id_mantenimiento PK
      string nro_serie FK "NOT NULL - cargador"
      int id_tecnico FK "NOT NULL"
      datetime fecha "NOT NULL"
      string tipo "CHECK (PREVENTIVO, CORRECTIVO)"
      string observaciones
      decimal costo "DECIMAL(10,2)"
    }
    FRANJA_HORARIA {
      int id_franja PK
      string nombre "UNIQUE NOT NULL - PICO, VALLE, NOCTURNA"
      time hora_desde "NOT NULL"
      time hora_hasta "NOT NULL"
    }
    TARIFA {
      int id_estacion PK "y FK"
      int id_tipo_conector PK "y FK"
      int id_franja PK "y FK"
      date vigente_desde PK "parte de la clave: conserva el historico"
      decimal precio_kwh "DECIMAL(10,4) NOT NULL CHECK > 0"
      date vigente_hasta "NULL si es la vigente"
    }`, "Servicio I — Red y Estaciones")}

          <h3>Las 6 decisiones que se evalúan acá</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Decisión</th><th>Qué hice y por qué</th></tr></thead>
            <tbody>
              <tr><td><b>1 · Jerarquía de 3 niveles</b></td><td><b>Estación → Cargador → Conector</b>, cada nivel con su propia tabla y FK al padre. <b>El error grave sería colapsarla</b> (poner los conectores como columnas del cargador, o colgar el conector directo de la estación perdiendo el cargador). La relación es <b>1,N obligatoria</b> en ambos saltos: no hay estación sin cargadores ni cargador sin conectores (<code>||--|{</code>).</td></tr>
              <tr><td><b>2 · Dirección: ¿entidad o embebida?</b></td><td>La <b>embebo</b> en ESTACION (calle, altura, localidad, provincia, CP, lat/long). <b>Justificación:</b> es un <b>Value Object sin identidad propia</b> —no se consulta ni se referencia por sí misma, no se comparte entre estaciones y no tiene ciclo de vida independiente—, así que sacarla a una tabla sólo agrega un JOIN sin ganar nada. <b>Cuándo sí sería entidad:</b> si se reutilizara (un operador con varias estaciones en el mismo predio), si hubiera que normalizar localidad/provincia contra un catálogo oficial, o si se necesitara el <b>historial</b> de mudanzas. <b>Lo que puntúa no es cuál elegís: es que lo discutas.</b></td></tr>
              <tr><td><b>3 · Las dos N:M</b></td><td><b>Servicios complementarios</b> → catálogo <code>SERVICIO_COMPLEMENTARIO</code> + intermedia <code>ESTACION_SERVICIO</code> con <b>PK compuesta</b>. Un campo <code>servicios VARCHAR</code> rompería <b>1FN</b>, y un CHECK con valores fijos impediría agregar servicios nuevos sin tocar el esquema. Los <b>horarios</b> en cambio <b>no son N:M</b>: son <b>1,N</b> (una estación tiene muchas franjas de atención, cada franja es de una sola estación), así que van en una tabla hija, no en una intermedia. <b>Ojo con esto: es un error común resolverlo como N:M.</b></td></tr>
              <tr><td><b>4 · Tipo de conector como catálogo</b></td><td><code>TIPO_CONECTOR(nombre, potencia_nominal_kw)</code>. Si el tipo y su potencia quedaran como columnas del conector, <b>la potencia dependería del tipo y no del conector</b> → <b>dependencia transitiva, 3FN</b>. Es exactamente el error que el punto siguiente te pide detectar.</td></tr>
              <tr><td><b>5 · Historial + estado actual</b></td><td><code>HISTORIAL_CONECTOR</code> con <code>desde/hasta</code> da la <b>trazabilidad</b>; <code>CONECTOR.disponibilidad_actual</code> es un <b>campo derivado</b> del último registro abierto. <b>Lo declaro como desnormalización por performance</b> (la búsqueda de conectores libres es la consulta más frecuente de toda la app), con el historial como <b>fuente de verdad</b> y un proceso de recálculo. <b>Sin declararlo, es una violación de 3FN.</b></td></tr>
              <tr><td><b>6 · Tarifa con franja y vigencia</b></td><td>PK compuesta <code>(id_estacion, id_tipo_conector, id_franja, vigente_desde)</code>. <b>El enunciado pide conservar las tarifas históricas</b>, así que la fecha <b>es parte de la clave</b>: cada cambio es una fila nueva, no un UPDATE. La franja sale a su propia tabla porque <code>tarifa_pico</code>, <code>tarifa_valle</code> y <code>tarifa_nocturna</code> como columnas serían un <b>grupo repetitivo</b> (1FN) y agregar una franja exigiría alterar la tabla. <b>El grano es el tipo de conector, no el conector físico:</b> si la FK fuera al conector individual, habría que cargar la misma tarifa por cada enchufe de la estación.</td></tr>
            </tbody>
          </table></div>
          <h3>Supuestos</h3>
          <ul>
            <li>Una estación pertenece a <b>un</b> operador; un operador puede tener <b>muchas</b> estaciones.</li>
            <li><b>No existe estación sin cargadores ni cargador sin conectores</b> (modalidad 1): si el negocio admitiera dar de alta una estación “en obra” sin equipamiento, la modalidad pasaría a 0 y la relación sería <code>||--o{</code>.</li>
            <li>El <b>número de serie</b> del cargador es una <b>clave natural</b> única en toda la red; el <b>número de conector</b> sólo identifica <b>dentro de su cargador</b>, por eso la PK del conector es <b>compuesta</b> y la FK hacia él también.</li>
            <li>El <b>mantenimiento es sobre el cargador</b>. Si el enunciado dijera que se interviene un conector puntual, la FK sería la <b>compuesta</b> <code>(nro_serie, nro_conector)</code> — es el detalle que más se pasa por alto.</li>
            <li>Las <b>sesiones de carga, reservas y conductores</b> son del Servicio II: no se modelan acá. Las referencias entre servicios serían <b>IDs lógicos</b>, no FK.</li>
            <li>La <b>telemetría</b> de los conectores es del Servicio III y va a una <b>base de series temporales</b>.</li>
          </ul>
          <h3>Justificación (los 3 párrafos)</h3>
          <p><b>a) Qué persistir.</b> Las entidades con identidad y ciclo de vida propio: Operador, Estación, Cargador,
          Conector, Tipo de conector, Servicio complementario, Horario, Técnico, Mantenimiento, Franja y Tarifa.
          <b>No persisto</b> lo derivable: la <b>potencia total</b> de una estación (es la suma de sus cargadores), la
          <b>cantidad de conectores libres</b> (es un COUNT) ni la <b>tarifa vigente</b> (es la fila con
          <code>vigente_hasta IS NULL</code>). Tampoco los DTOs ni las clases de comportamiento; la <b>dirección</b> se
          persiste <b>embebida</b> por ser un Value Object, y las fotos de la estación van a <b>object storage</b>
          guardando sólo la URL.</p>
          <p><b>b) Impedance mismatches.</b> <b>Identidad:</b> PK subrogada salvo en Cargador, donde uso la <b>clave
          natural</b> (nro. de serie), y PK <b>compuesta</b> en Conector, en la intermedia y en Tarifa; UNIQUE en las
          claves naturales (<code>cuit</code>, <code>legajo</code>, nombres de catálogo). <b>Tipos:</b> VARCHAR con
          longitud; <b>DECIMAL</b> para potencias y precios (no DOUBLE); TIME para las franjas horarias. <b>Cardinalidad:</b>
          una sola FK del lado “muchos”; la única N:M (servicios) se parte en dos 1:N con tabla intermedia, porque
          <b>el modelo relacional no admite N:M directa</b>. <b>Herencia:</b> si se modelara una jerarquía de cargadores
          (AC / DC) con atributos propios, elegiría <b>SINGLE_TABLE con discriminador</b> por ser pocos atributos y
          consultarse siempre juntos; con muchos atributos obligatorios por subtipo, <b>JOINED</b>. <b>Enums:</b>
          conjuntos cerrados (estado, tipo de corriente) como <b>STRING con CHECK</b>; lo <b>administrable</b> por el
          negocio (servicios, tipos de conector, franjas) como <b>tabla maestra</b> — ésa es la diferencia que hay que
          justificar.</p>
          <p><b>c) Qué desnormalizo.</b> Por <b>performance</b>: <code>CONECTOR.disponibilidad_actual</code>, derivado
          del historial, porque buscar conectores libres es la consulta dominante; conservo el historial como fuente de
          verdad y un proceso de recálculo. Por <b>consistencia</b>: en <b>este</b> servicio no hace falta congelar nada
          —la tarifa histórica ya está resuelta <b>estructuralmente</b> con <code>vigente_desde</code> en la clave, que
          es mejor que una copia—; <b>el congelamiento aparece en el Servicio II</b>, donde la sesión guarda el
          <code>precio_kwh_aplicado</code>, porque el comprobante es inmutable.</p>
        </details>

        <h2>Punto 1 bis — DER del Servicio II (por si te toca el transaccional)</h2>
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

        <h2>Punto 1 ter — DER del Servicio III (Operación y Auditoría)</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio III</b>: telemetría de los conectores, métricas de la red y
          <b>liquidación mensual a los operadores adheridos</b>. Indique PK, FK, cardinalidad, modalidad y
          restricciones, con supuestos y justificación.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — DER del Servicio III</summary>
          ${APP.uml(`erDiagram
    DIM_ESTACION ||--o{ MEDICION_CONECTOR : reporta
    TIPO_MEDICION ||--o{ MEDICION_CONECTOR : clasifica
    DIM_ESTACION ||--o{ HEARTBEAT_CONECTOR : emite
    DIM_ESTACION ||--o{ ENERGIA_DIARIA : resume
    DIM_FECHA ||--o{ ENERGIA_DIARIA : fecha
    DIM_ESTACION ||--o{ INCIDENTE : afecta
    DIM_OPERADOR ||--o{ LIQUIDACION : "se liquida a"
    LIQUIDACION ||--|{ DETALLE_LIQUIDACION : "se compone de (1,N)"
    DIM_ESTACION ||--o{ DETALLE_LIQUIDACION : aporta
    DIM_OPERADOR {
      int id_operador PK "ID LOGICO del Servicio I - replica local"
      string razon_social "replicado"
      string cuit "replicado"
      decimal pct_comision_vigente "replicado - solo referencia"
      datetime sincronizado_en "NOT NULL"
    }
    DIM_ESTACION {
      int id_estacion PK "ID LOGICO - replica local"
      int id_operador FK "NOT NULL"
      string nombre "replicado"
      string localidad "replicado"
      datetime sincronizado_en "NOT NULL"
    }
    TIPO_MEDICION {
      int id_tipo PK
      string codigo "UNIQUE NOT NULL - POTENCIA, TEMPERATURA, ESTADO_CONEXION"
      string unidad "NOT NULL - kW, C, booleano"
    }
    MEDICION_CONECTOR {
      bigint id_medicion PK
      int id_estacion FK "NOT NULL"
      int nro_conector "NOT NULL - ID logico"
      int id_tipo FK "NOT NULL"
      datetime fecha_hora "NOT NULL - particionado por fecha"
      decimal valor "DECIMAL(12,3) NOT NULL"
      string id_sesion "ID logico - NULL si no hay sesion"
    }
    HEARTBEAT_CONECTOR {
      bigint id_heartbeat PK
      int id_estacion FK "NOT NULL"
      int nro_conector "NOT NULL"
      datetime fecha_hora "NOT NULL"
      boolean online "NOT NULL"
      string estado_reportado
    }
    ENERGIA_DIARIA {
      date fecha PK "y FK a DIM_FECHA"
      int id_estacion PK "y FK"
      int franja_horaria PK "CHECK (0..23)"
      decimal kwh_despachados "DECIMAL(12,3) NOT NULL"
      int sesiones "NOT NULL"
      int sesiones_interrumpidas "NOT NULL"
      int minutos_ocupado "NOT NULL"
      int minutos_disponibles "NOT NULL"
      datetime calculado_en "NOT NULL"
    }
    DIM_FECHA {
      date fecha PK
      int anio
      int mes
      int dia_semana
      boolean es_feriado
    }
    INCIDENTE {
      int id_incidente PK
      int id_estacion FK "NOT NULL"
      int nro_conector "NULL"
      datetime detectado_en "NOT NULL"
      datetime resuelto_en "NULL"
      string tipo "CHECK (SESION_INTERRUMPIDA, SIN_CONEXION, SOBRETEMPERATURA)"
      string estado "CHECK (ABIERTO, EN_CURSO, RESUELTO, DESCARTADO)"
    }
    LIQUIDACION {
      int id_liquidacion PK
      int id_operador FK "NOT NULL"
      int anio PK "parte de la clave de negocio"
      int mes PK
      decimal energia_total_kwh "DECIMAL(14,3) NOT NULL"
      decimal importe_bruto "DECIMAL(14,2) NOT NULL"
      decimal pct_comision_aplicado "CONGELADO al liquidar"
      decimal comision "DECIMAL(14,2) NOT NULL"
      decimal importe_neto "DECIMAL(14,2) NOT NULL"
      string razon_social_emision "congelado"
      string cuit_emision "congelado"
      string estado "CHECK (BORRADOR, EMITIDA, PAGADA, OBSERVADA)"
      datetime emitida_en
    }
    DETALLE_LIQUIDACION {
      int id_liquidacion PK "y FK"
      int id_estacion PK "y FK"
      decimal kwh "DECIMAL(14,3) NOT NULL"
      decimal importe "DECIMAL(14,2) NOT NULL"
    }`, "Servicio III — Operación, Auditoría y Liquidación")}
          <h3>Las 5 decisiones propias de este servicio</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Decisión</th><th>Qué hice y por qué</th></tr></thead>
            <tbody>
              <tr><td><b>1 · Hechos, no entidades</b></td><td>Es un servicio de <b>hechos</b> (<code>MEDICION_CONECTOR</code>, <code>HEARTBEAT</code>) con su marca de tiempo, más catálogos que los clasifican. <b>Append-only:</b> no se actualizan ni se borran.</td></tr>
              <tr><td><b>2 · Las métricas no se modelan: se modela el hecho</b></td><td>“Energía por estación y mes”, “factor de utilización”, “top 10” <b>son consultas</b>. Por cada una, escribí el <code>SUM</code>/<code>COUNT</code> + <code>GROUP BY</code>: el <b>factor de utilización</b> sale de <code>minutos_ocupado / minutos_disponibles</code>, por eso <b>ambos están en la tabla de resumen</b> — si guardara sólo el porcentaje, no podría reagregar por mes.</td></tr>
              <tr><td><b>3 · Esquema estrella</b></td><td><code>ENERGIA_DIARIA</code> con PK compuesta <code>(fecha, id_estacion, franja)</code>, por <b>batch nocturno</b>: tabla de <b>hechos</b> + <b>dimensiones</b> (<code>DIM_ESTACION</code>, <code>DIM_OPERADOR</code>, <code>DIM_FECHA</code>) deliberadamente desnormalizadas. Es <b>desnormalización por performance</b>, con <code>calculado_en</code> y proceso de recálculo.</td></tr>
              <tr><td><b>4 · ⭐ La liquidación: congelar o quedar mal</b></td><td>Es <b>el punto de este servicio</b>. <code>pct_comision_aplicado</code>, <code>razon_social_emision</code> y <code>cuit_emision</code> quedan <b>congelados al emitir</b>: si el porcentaje de comisión cambia el mes que viene, <b>una liquidación recalculada no puede dar otro importe</b>. <b>Desnormalización por consistencia</b> — es un documento con valor probatorio. Por eso <code>DIM_OPERADOR.pct_comision_vigente</code> está marcado como <b>“sólo referencia”</b>: nunca se usa para recalcular el pasado.</td></tr>
              <tr><td><b>5 · Volumen y políglota</b></td><td>La telemetría llega <b>periódica y masiva</b>: en una arquitectura real va a una <b>base de series temporales</b> (append-only, consulta por rango, <b>retención y downsampling</b>) y la analítica de meses a un almacén <b>columnar</b>. Si piden el modelo <b>relacional</b>, lo entrego con <b>particionado por fecha</b> y <code>BIGINT</code> en los hechos, <b>aclarando el criterio</b>.</td></tr>
            </tbody>
          </table></div>
          <h3>Supuestos</h3>
          <ul>
            <li>Estación, conector, operador y sesión son de <b>otros servicios</b>: referencias por <b>ID lógico</b>, sin FK entre bases. <code>DIM_*</code> son <b>réplicas locales</b> (read model) sincronizadas por <b>eventos</b> → <b>consistencia eventual</b> declarada.</li>
            <li>Hay <b>una liquidación por operador y período</b>: PK compuesta o UNIQUE sobre <code>(id_operador, anio, mes)</code>.</li>
            <li>El <b>detalle por estación</b> es <b>1,N</b>: no existe liquidación sin al menos una estación con consumo.</li>
            <li>Una liquidación <b>sí tiene ciclo de vida</b> (borrador → emitida → pagada / observada): es la única entidad del servicio con <b>estado</b>, junto con el incidente.</li>
            <li>La <b>retención</b> de la telemetría es una decisión de negocio; los resúmenes y las liquidaciones se conservan por obligación <b>fiscal</b>.</li>
          </ul>
        </details>

        <h2>Punto 2 — Auditar un DER contra las 3 formas normales</h2>
        <div class="card">
          <p>Se le presenta el modelo ya construido del <b>Servicio I (Red y Estaciones)</b>. <b>¿Cumple con las tres
          primeras formas normales?</b> Indique <b>sí o no</b> y explique <b>en dos renglones</b> qué problema existe.</p>
          <p class="mini"><b>Nota:</b> en el parcial te van a dar el DER de <b>otro</b> servicio, distinto del que
          modelaste. Acá es a propósito el mismo: primero lo diseñaste bien en el Punto 1 y ahora tenés que
          <b>detectar los errores</b> de una versión defectuosa del mismo dominio. Es el ejercicio más directo para
          entrenar el ojo.</p>
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

        <h2>⚠️ Punto extra — el patrón que estos modelos no ejercitan</h2>
        <div class="callout warn">
          <p>“Catálogo predefinido + parámetros que el usuario ajusta” aparece en <b>8 de 24</b> enunciados de la
          carpeta y es donde está <b>el error que más se cobra</b>: poner el parámetro <b>en el catálogo</b> en lugar de
          en la tabla intermedia. <b>10 minutos.</b></p>
        </div>
        <div class="card">
          <p><b>Agregado al Servicio II.</b> Los conductores configuran <b>alertas</b>. No las crean libremente: las
          arman eligiendo de un <b>catálogo de condiciones predefinidas</b> (batería del vehículo por debajo de un
          umbral, precio del kWh por debajo de un valor, estación favorita con conector libre, sesión finalizada) y de
          un <b>catálogo de canales</b> (push, mail, SMS). Una alerta <b>combina una o varias condiciones</b> con un
          canal, y para cada condición el conductor <b>ajusta sus parámetros</b> (el umbral, la estación de
          referencia). Se registra el <b>historial de disparos</b>.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — catálogo + configuración</summary>
          ${APP.uml(`erDiagram
    CONDUCTOR ||--o{ ALERTA : configura
    CANAL ||--o{ ALERTA : "se notifica por"
    ALERTA ||--|{ ALERTA_CONDICION : "combina (1,N)"
    TIPO_CONDICION ||--o{ ALERTA_CONDICION : "se elige en"
    ALERTA ||--o{ DISPARO_ALERTA : registra
    TIPO_CONDICION {
      int id_tipo_condicion PK
      string codigo "UNIQUE NOT NULL - BATERIA_BAJA, PRECIO_BAJO, CONECTOR_LIBRE"
      string descripcion "NOT NULL"
      string tipo_parametro "CHECK (NUMERICO, ID_ESTACION, NINGUNO) - describe al TIPO"
      string unidad "pct, ARS/kWh"
      boolean activo "NOT NULL DEFAULT true"
    }
    CANAL {
      int id_canal PK
      string nombre "UNIQUE NOT NULL - PUSH, MAIL, SMS"
    }
    ALERTA {
      int id_alerta PK
      int id_conductor FK "NOT NULL"
      int id_canal FK "NOT NULL"
      string nombre "NOT NULL"
      boolean activa "NOT NULL DEFAULT true"
      datetime fecha_creacion "NOT NULL"
    }
    ALERTA_CONDICION {
      int id_alerta PK "y FK"
      int id_tipo_condicion PK "y FK"
      decimal valor_umbral "PARAMETRO AJUSTABLE - NULL si no aplica"
      int id_estacion_referencia "PARAMETRO AJUSTABLE - ID logico, NULL si no aplica"
    }
    DISPARO_ALERTA {
      int id_disparo PK
      int id_alerta FK "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string resultado "CHECK (ENVIADO, FALLIDO)"
      decimal valor_detectado "congelado - que valor la disparo"
      string detalle_error
    }`, "Catálogo predefinido + configuración con parámetros")}
          <div class="callout key">
            <div class="callout-title">🎯 Las 4 cosas que se evalúan</div>
            <ol>
              <li><b>El parámetro ajustable va en la INTERMEDIA.</b> <code>valor_umbral</code> es “el 20% <b>que eligió
              este conductor</b>”, no una propiedad del tipo de condición, que es <b>compartido por todos</b>. En el
              catálogo va sólo lo que describe al tipo (<code>tipo_parametro</code>, <code>unidad</code>). <b>Es el
              error que más se cobra.</b></li>
              <li><b>Catálogo, no enum:</b> el enunciado dice <b>“predefinidas”</b>; agregar una condición no puede
              exigir un deploy. <code>activo</code> permite darla de baja <b>sin romper el histórico</b>.</li>
              <li><b>“Combina una o varias condiciones”</b> → <b>1,N</b> (<code>||--|{</code>), y la <b>PK compuesta</b>
              <code>(id_alerta, id_tipo_condicion)</code> impide elegir dos veces la misma condición <b>por
              diseño</b>.</li>
              <li><b>Historial de disparos</b> con <code>valor_detectado</code> <b>congelado</b>: si después el
              conductor cambia el umbral, el registro debe seguir explicando <b>por qué se disparó</b> en ese momento.</li>
            </ol>
          </div>
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
        { t: "Servicio III: modelé HECHOS con fecha_hora y dije que las métricas son consultas, no tablas", p: 5 },
        { t: "Servicio III: congelé el % de comisión y los datos del operador en la liquidación", p: 6 },
        { t: "Servicio III: declaré las DIM_* como réplica local (read model) con consistencia eventual", p: 4 },
        { t: "Patrón catálogo: los parámetros ajustables quedaron en la INTERMEDIA, no en el catálogo", p: 6 },
      ]);
    },
  });
})();
