/* ============================================================
   P2 · Modelo 2 — PaqueRed (B): otros tres servicios del mismo contexto
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-m2-paquered-b",
    title: "Modelo 2 · PaqueRed (otro turno)",
    tag: "📦",
    group: "Parcial 2 (práctica)",
    resumen: "Mismo contexto, otros 3 servicios: contratos, logística y reclamos",
    keywords: ["paquered", "modelo 2", "contratos", "planes", "facturacion", "logistica", "hoja de ruta", "reclamos", "sla", "arca", "soap", "seo", "expand and contract", "nube"],
    render(el) {
      el.classList.add("modelo-print");
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Modelo 2 · tu contexto, otro turno</div>
          <h1>PaqueRed — segundo modelo</h1>
          <p class="lead">El <b>mismo universo de lockers</b>, pero con <b>otros tres servicios</b>. El enunciado real te va a describir tres servicios y pedirte el DER de uno: la idea es que hayas modelado <b>seis dominios distintos</b> de PaqueRed antes de entrar, para que ninguno te resulte nuevo.</p>
        </div>

        <div class="callout key no-print-modelo">
          <div class="callout-title">🖨️ Llevátelo impreso</div>
          <p>Este modelo <b>se imprime con las soluciones desplegadas</b>: los diagramas salen grandes y en
          una sola página cada uno. Destino <b>“Guardar como PDF”</b>, tamaño <b>A4</b>, y activá
          <b>“Gráficos de fondo”</b> para que se vean los recuadros.</p>
          <button class="btn js-print" type="button">📥 Imprimir este modelo resuelto (A4)</button>
        </div>

        <div class="callout warn no-print-modelo">
          <div class="callout-title">⚠️ Cómo usar esta página</div>
          <p>Hacelo <b>después</b> del <a class="inline" data-go="p2-m1-paquered">Modelo 1</a>. Y <b>resolvé en papel antes de abrir cada solución.</b> Los puntos de arquitectura son <b>distintos</b> de los del Modelo 1 a propósito: acá entran <b>SEO y tipo de cliente</b>, <b>integración SOAP con un organismo</b>, <b>seguridad</b>, <b>cambio de esquema sin downtime</b> y <b>nube vs. on-premise</b>.</p>
        </div>

        <h2>Enunciado</h2>
        <div class="enunciado">
          <h3>Contexto general</h3>
          <p><b>PaqueRed</b> opera una red de <b>lockers inteligentes</b> para la entrega y el retiro de paquetes de
          comercios electrónicos. Los transportistas depositan paquetes en un casillero, los destinatarios los retiran y
          la empresa opera y audita la red. El Sistema se compone de <b>tres servicios, cada uno con su propia base de
          datos</b>.</p>

          <h3>Servicio I — Comercios, Planes y Facturación</h3>
          <p>Administra la relación comercial. Cada <b>comercio</b> tiene razón social, CUIT, condición frente al IVA,
          domicilio fiscal y uno o varios <b>contactos</b> (nombre, rol, mail, teléfono). Un comercio firma un
          <b>contrato</b> con PaqueRed, que tiene fecha de inicio, fecha de fin y está asociado a un <b>plan</b> del
          catálogo comercial (Básico, Pro, Enterprise). Cada plan define valores de referencia —abono mensual, envíos
          incluidos, precio por envío adicional y plazo de permanencia—, pero <b>en cada contrato se pueden negociar
          esos valores</b>, y además el contrato puede incluir <b>descuentos</b> sobre tamaños de casillero
          determinados. Los <b>planes y los descuentos los define un administrador</b> desde la plataforma. Los
          contratos se <b>renuevan</b>, y hay que conservar los <b>contratos anteriores</b>. Mensualmente se emite una
          <b>factura</b> por comercio, con su número, período, detalle por concepto (abono, envíos adicionales,
          descuentos), importes e IVA; la factura se envía a la <b>AFIP/ARCA</b> para obtener el <b>CAE</b> y su
          vencimiento. Una factura <b>reimpresa debe ser idéntica a la original</b>, y se registra su estado de cobro.</p>

          <h3>Servicio II — Logística y Transportistas</h3>
          <p>Coordina la distribución. Los <b>transportistas</b> pertenecen a una <b>empresa de logística</b> y tienen
          legajo, nombre, documento y licencia con su vencimiento. Cada transportista puede estar habilitado para
          <b>una o varias zonas</b>, y una zona tiene <b>varios transportistas</b> habilitados. Los <b>vehículos</b>
          tienen patente, modelo y capacidad, y pertenecen a la empresa. Cada día se arma una <b>hoja de ruta</b>:
          asigna un transportista y un vehículo, y tiene una <b>secuencia ordenada de paradas</b> en puntos de retiro.
          De cada parada se conoce el orden, la hora estimada, la hora real de arribo y su resultado (cumplida, no
          realizada, reprogramada); en una parada se depositan <b>uno o varios envíos</b>. De la hoja de ruta interesa
          el <b>historial de estados</b> (planificada, en curso, cerrada, cancelada) y quién la modificó.</p>

          <h3>Servicio III — Atención y Reclamos</h3>
          <p>Gestiona los reclamos de comercios y destinatarios. Un <b>reclamo</b> tiene número, fecha, quién lo
          origina, el envío al que refiere y un <b>motivo</b> tomado de un <b>catálogo predefinido</b> (paquete dañado,
          no retirado, casillero bloqueado, demora). Cada motivo tiene una <b>criticidad</b> y un <b>plazo máximo de
          respuesta (SLA)</b> definidos por el administrador, aunque en reclamos puntuales <b>un supervisor puede
          extender ese plazo</b> dejando el motivo de la excepción. El reclamo pasa por <b>estados</b> (abierto, en
          análisis, derivado, resuelto, cerrado sin resolución) y toda su <b>conversación</b> queda registrada: cada
          intervención con su autor, fecha, texto y eventuales <b>archivos adjuntos</b> (fotos, comprobantes). Interesa
          medir el <b>porcentaje de reclamos resueltos dentro del SLA</b> y los <b>motivos más frecuentes por zona</b>.</p>

          <h3>Alcance y requerimientos</h3>
          <ol>
            <li>Que un comercio contrate un plan y se le facture mensualmente.</li>
            <li>Que se emita la factura electrónica contra ARCA y se obtenga el CAE.</li>
            <li>Que se arme la hoja de ruta diaria y se registre el resultado de cada parada.</li>
            <li>Que comercios y destinatarios inicien reclamos y los sigan hasta su resolución.</li>
            <li>Que la empresa mida el cumplimiento del SLA de atención.</li>
            <li>El envío de notificaciones en todos los casos planteados.</li>
          </ol>
        </div>

        <h2>Punto 1 — DER del Servicio I (Comercios, Planes y Facturación)</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio I</b>, indicando entidades, campos, <b>PK</b>, <b>FK</b>,
          <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b>. Indique los <b>supuestos</b> y <b>justifique</b>
          las decisiones de diseño.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 1</summary>
          ${APP.uml(`erDiagram
    COMERCIO ||--|{ CONTACTO : "tiene (1,N)"
    COMERCIO ||--|{ CONTRATO : "firma (1,N)"
    PLAN ||--o{ CONTRATO : "se contrata en"
    CONTRATO ||--o{ CONTRATO_DESCUENTO : "negocia (0,N)"
    TAMANIO ||--o{ CONTRATO_DESCUENTO : "aplica a"
    COMERCIO ||--o{ FACTURA : "se le emite"
    CONTRATO ||--o{ FACTURA : "se factura por"
    FACTURA ||--|{ DETALLE_FACTURA : "se compone de (1,N)"
    CONCEPTO ||--o{ DETALLE_FACTURA : clasifica
    FACTURA ||--o| CAE : obtiene
    FACTURA ||--|{ EVENTO_FACTURA : registra
    COMERCIO {
      int id_comercio PK
      string razon_social "NOT NULL"
      string cuit "UNIQUE NOT NULL"
      string condicion_iva "CHECK (RI, MONOTRIBUTO, EXENTO) NOT NULL"
      string domicilio_fiscal "NOT NULL"
      boolean activo "NOT NULL DEFAULT true"
    }
    CONTACTO {
      int id_contacto PK
      int id_comercio FK "NOT NULL"
      string nombre "NOT NULL"
      string rol "CHECK (COMERCIAL, TECNICO, FACTURACION)"
      string email "NOT NULL"
      string telefono
    }
    PLAN {
      int id_plan PK
      string nombre "UNIQUE NOT NULL - BASICO, PRO, ENTERPRISE"
      decimal abono_referencia "DECIMAL(12,2) NOT NULL"
      int envios_incluidos_ref "NOT NULL"
      decimal precio_adicional_ref "DECIMAL(12,2) NOT NULL"
      int plazo_permanencia_hs_ref "NOT NULL"
      boolean activo "NOT NULL DEFAULT true"
    }
    CONTRATO {
      int id_contrato PK
      int id_comercio FK "NOT NULL"
      int id_plan FK "NOT NULL"
      date vigente_desde "NOT NULL"
      date vigente_hasta "NULL si es el vigente"
      decimal abono_negociado "VALOR NEGOCIADO - no va en PLAN"
      int envios_incluidos "VALOR NEGOCIADO"
      decimal precio_adicional "VALOR NEGOCIADO"
      int plazo_permanencia_hs "VALOR NEGOCIADO"
      string estado "CHECK (VIGENTE, VENCIDO, RESCINDIDO)"
    }
    TAMANIO {
      string codigo_tamanio PK "S, M, L, XL"
      string descripcion
    }
    CONTRATO_DESCUENTO {
      int id_contrato PK "y FK"
      string codigo_tamanio PK "y FK"
      decimal pct_descuento "DECIMAL(5,2) NOT NULL CHECK (0..100)"
    }
    FACTURA {
      int id_factura PK
      int id_comercio FK "NOT NULL"
      int id_contrato FK "NOT NULL"
      string punto_venta "NOT NULL"
      string numero "NOT NULL - UNIQUE (punto_venta, numero)"
      int anio "NOT NULL"
      int mes "NOT NULL"
      date fecha_emision "NOT NULL"
      decimal neto "DECIMAL(14,2) NOT NULL"
      decimal iva "DECIMAL(14,2) NOT NULL"
      decimal total "DECIMAL(14,2) NOT NULL"
      string estado_cobro "CHECK (PENDIENTE, PAGADA, VENCIDA, ANULADA)"
      string razon_social_emision "congelado"
      string cuit_emision "congelado"
      string condicion_iva_emision "congelado"
      string domicilio_emision "congelado"
      string plan_emision "congelado"
    }
    CONCEPTO {
      int id_concepto PK
      string nombre "UNIQUE NOT NULL - ABONO, ENVIO_ADICIONAL, DESCUENTO"
      decimal alicuota_iva_ref "DECIMAL(5,2)"
    }
    DETALLE_FACTURA {
      int id_factura PK "y FK"
      int nro_linea PK
      int id_concepto FK "NOT NULL"
      string descripcion_emision "congelada"
      decimal cantidad "DECIMAL(12,3) NOT NULL"
      decimal precio_unitario_aplicado "congelado NOT NULL"
      decimal alicuota_iva_aplicada "congelada NOT NULL"
      decimal importe "DECIMAL(14,2) NOT NULL"
    }
    CAE {
      int id_factura PK "y FK - relacion 1 a 1"
      string cae "UNIQUE NOT NULL"
      date vencimiento_cae "NOT NULL"
      datetime obtenido_en "NOT NULL"
      string id_externo_arca "UNIQUE - clave de idempotencia"
    }
    EVENTO_FACTURA {
      int id_evento PK
      int id_factura FK "NOT NULL"
      string estado_resultante "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string origen "CHECK (SISTEMA, OPERADOR, ARCA)"
      string motivo
    }`, "Servicio I — Comercios, Planes y Facturación")}
          <h3>Las 6 decisiones que se evalúan acá</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Decisión</th><th>Qué hice y por qué</th></tr></thead>
            <tbody>
              <tr><td><b>1 · ⭐ Plan = catálogo, contrato = valores negociados</b></td><td>El plan define <b>valores de REFERENCIA</b> (por eso los nombré <code>*_ref</code>), pero <b>“en cada contrato se pueden negociar”</b> → los valores efectivos van <b>en el CONTRATO</b>, no en el plan. <b>Es el error que más se cobra:</b> si el abono negociado viviera en <code>PLAN</code> —que es <b>compartido por todos los comercios</b>— bajárselo a uno se lo bajaría a todos. Misma lógica para los <b>descuentos</b>: van en la <b>intermedia</b> <code>CONTRATO_DESCUENTO</code>, porque el porcentaje es de <b>ese contrato</b> para <b>ese tamaño</b>.</td></tr>
              <tr><td><b>2 · Contratos renovables con histórico</b></td><td>Un comercio tiene <b>1,N contratos</b> (<code>||--|{</code>): el vigente y los anteriores. <code>vigente_desde</code> / <code>vigente_hasta</code> (NULL en el actual) <b>conservan el histórico</b>, que el enunciado pide explícitamente. <b>No se actualiza el contrato: se cierra y se crea otro.</b> Para garantizar que no haya dos vigentes a la vez se declara el <b>supuesto</b> y se valida en la aplicación (o con un índice parcial).</td></tr>
              <tr><td><b>3 · Todo lo de la factura, congelado</b></td><td>“Una factura reimpresa debe ser <b>idéntica a la original</b>” es el disparador más claro de <b>desnormalización por consistencia</b>. Se copian los datos fiscales del comercio, el nombre del plan, y en cada línea la <b>descripción</b>, el <b>precio unitario aplicado</b> y la <b>alícuota aplicada</b>. <b>Se conservan las FK</b> para navegar al maestro vigente.</td></tr>
              <tr><td><b>4 · CAE como entidad 1 a 1</b></td><td>El CAE no existe hasta que ARCA responde, así que la relación es <b>0,1</b> (<code>||--o|</code>): una factura emitida puede estar <b>pendiente de CAE</b>. Separarlo del cuerpo de la factura deja claro ese ciclo. <code>id_externo_arca</code> con <b>UNIQUE</b> funciona como <b>clave de idempotencia</b>: si hay timeout contra ARCA, reintentar <b>no genera un comprobante duplicado</b>.</td></tr>
              <tr><td><b>5 · Numeración fiscal</b></td><td>El número de comprobante <b>no es la PK</b>: la PK es subrogada y la clave natural es <b>UNIQUE compuesta</b> <code>(punto_venta, numero)</code>, que es como funciona la numeración fiscal real. Mezclar las dos cosas es un error clásico.</td></tr>
              <tr><td><b>6 · Bitácora de la factura</b></td><td><code>EVENTO_FACTURA</code> (1,N) registra emisión, obtención de CAE, rechazo de ARCA, cobro y anulación, con <code>origen</code> para distinguir lo que hizo el sistema de lo que hizo ARCA o un operador. El campo <code>estado_cobro</code> es el <b>estado actual</b> derivado: <b>declaralo como desnormalización por performance</b>.</td></tr>
            </tbody>
          </table></div>
          <h3>Supuestos</h3>
          <ul>
            <li>Un comercio tiene <b>al menos un contacto</b> y <b>al menos un contrato</b> (modalidad 1); si el negocio admitiera cargar un comercio “prospecto” sin contrato, pasaría a <b>0,N</b>.</li>
            <li><b>Un solo contrato vigente por comercio a la vez</b>: se valida en la aplicación (o con un índice único parcial sobre <code>vigente_hasta IS NULL</code>).</li>
            <li>Los <b>descuentos son opcionales</b> (0,N) y sólo aplican a <b>tamaños de casillero</b>, que son un <b>catálogo del Servicio de Red</b>: acá va una <b>referencia</b> (y si estuviera en otra base, un <b>ID lógico</b>, no FK).</li>
            <li>Se factura <b>una vez por comercio y período</b>: <b>UNIQUE</b> <code>(id_comercio, anio, mes)</code>, salvo notas de crédito, que serían otro tipo de comprobante.</li>
            <li>Los <b>envíos</b> que se facturan son del Servicio de Envíos: acá entra la <b>cantidad ya consolidada</b>, no cada envío (si hiciera falta el detalle, iría por <b>ID lógico</b>).</li>
            <li>El <b>IVA</b> se guarda calculado y con la <b>alícuota aplicada</b>, porque una alícuota puede cambiar por ley y el comprobante no puede cambiar con ella.</li>
          </ul>
          <h3>Justificación (los 3 párrafos)</h3>
          <p><b>a) Qué persistir.</b> Comercio, Contacto, Plan, Contrato, Descuento negociado, Factura, Detalle,
          Concepto, CAE y Eventos. <b>No persisto</b> lo derivable —el <b>total</b> de la factura es la suma del
          detalle y la <b>cantidad de envíos del período</b> se obtiene del otro servicio—, ni los DTOs, ni las clases
          de comportamiento; el <b>PDF</b> del comprobante va a <b>object storage</b> y la base guarda la <b>URL</b>.
          <i>(El total sí lo guardo igual: ver el párrafo c.)</i></p>
          <p><b>b) Impedance mismatches.</b> <b>Identidad:</b> PK subrogada, con <b>UNIQUE</b> en las claves naturales
          (<code>cuit</code>, <code>(punto_venta, numero)</code>, <code>cae</code>) y <b>PK compuesta</b> en
          <code>DETALLE_FACTURA</code> y <code>CONTRATO_DESCUENTO</code>. <b>Tipos:</b> <b>DECIMAL</b> en todo lo
          monetario y en los porcentajes (jamás DOUBLE en una factura), DATE para vigencias, VARCHAR con longitud.
          <b>Cardinalidad:</b> una sola FK del lado “muchos”; la N:M contrato↔tamaño se parte con la intermedia, que
          además <b>lleva el dato propio</b> de la relación (el porcentaje). <b>Herencia:</b> si hubiera tipos de
          comprobante (Factura / Nota de crédito / Nota de débito) con atributos propios, usaría <b>SINGLE_TABLE con
          discriminador</b> —pocos atributos distintos y siempre se listan juntos en la cuenta corriente—; con muchos
          atributos obligatorios por subtipo, <b>JOINED</b>. <b>Enums:</b> condición de IVA, estados y roles como
          <b>STRING con CHECK</b>; <b>planes y conceptos</b>, que <b>los define un administrador</b>, como <b>tabla
          maestra</b>.</p>
          <p><b>c) Qué desnormalizo.</b> Por <b>consistencia</b>: <b>todos los campos <code>*_emision</code> y
          <code>*_aplicado</code></b>, porque la factura es un <b>documento fiscal inmutable</b> y debe reimprimirse
          idéntica; también el <b>plan y los valores negociados quedan reflejados en el detalle</b>, de modo que
          renegociar el contrato no altere las facturas ya emitidas. Por <b>performance</b>: guardo <code>neto</code>,
          <code>iva</code> y <code>total</code> en la cabecera aunque sean la suma del detalle, porque el listado de
          cuenta corriente los consulta permanentemente; declaro el <b>detalle como fuente de verdad</b> y dejo un
          <b>proceso de recálculo</b>. Y <code>estado_cobro</code> es derivado de la bitácora, con el mismo criterio.</p>
        </details>

        <h2>Punto 2 — Auditar un DER contra las 3 formas normales</h2>
        <div class="card">
          <p>Se le presenta el modelo ya construido del <b>Servicio II (Logística y Transportistas)</b>.
          <b>¿Cumple con las tres primeras formas normales?</b> Indique <b>sí o no</b> y explique <b>en dos
          renglones</b> qué problema existe.</p>
          ${APP.code(`HOJA_RUTA (
   id_hoja                INTEGER   PK,
   fecha                  DATE,
   transportista_legajo   VARCHAR(10),
   transportista_nombre   VARCHAR(60),
   transportista_telefono VARCHAR(20),
   empresa_logistica      VARCHAR(60),
   vehiculo_patente       VARCHAR(10),
   vehiculo_modelo        VARCHAR(40),
   vehiculo_capacidad_m3  DECIMAL(6,2),
   zonas_cubiertas        VARCHAR(200),   -- "Palermo / Belgrano / Nuñez"
   cant_paradas           INTEGER,
   estado                 VARCHAR(20)
)

PARADA (
   id_hoja          INTEGER  PK,  FK -> HOJA_RUTA,
   nro_parada       INTEGER  PK,
   id_punto         INTEGER,
   direccion_punto  VARCHAR(120),
   localidad_punto  VARCHAR(60),
   fecha_hoja       DATE,
   hora_estimada    TIME,
   hora_real        TIME,
   resultado        VARCHAR(20)
)

ENTREGA_EN_PARADA (
   id_entrega     INTEGER  PK,
   id_hoja        INTEGER,
   nro_parada     INTEGER,
   id_envio       INTEGER,
   observaciones  VARCHAR(200)
)`, { lang: "sql", collapse: false, label: "Modelo dado del Servicio II" })}
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 2</summary>
          <div class="callout key">
            <div class="callout-title">La respuesta de dos renglones</div>
            <p><b>No, no cumple ninguna de las tres.</b> <b>1FN:</b> <code>zonas_cubiertas</code> es un atributo
            <b>multivaluado</b> (guarda una lista separada por “/” en una sola celda). <b>2FN:</b> en
            <code>PARADA</code>, con PK compuesta <code>(id_hoja, nro_parada)</code>, <code>direccion_punto</code> y
            <code>localidad_punto</code> dependen sólo de <code>id_punto</code> y <code>fecha_hoja</code> sólo de
            <code>id_hoja</code> → <b>dependencias parciales</b>. <b>3FN:</b> en <code>HOJA_RUTA</code>, los datos del
            transportista dependen de <code>transportista_legajo</code> y los del vehículo de
            <code>vehiculo_patente</code> —atributos <b>no clave</b>→ <b>dependencias transitivas</b>, y
            <code>cant_paradas</code> es un <b>dato derivado</b> (COUNT sobre PARADA). Genera <b>redundancia</b> y
            <b>anomalías de actualización y borrado</b>: cambiar el teléfono de un transportista obliga a tocar todas
            sus hojas de ruta, y al borrar la última hoja de un vehículo se pierden su modelo y su capacidad.</p>
          </div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>FN</th><th>Dónde</th><th>Por qué</th><th>Anomalía concreta</th></tr></thead>
            <tbody>
              <tr><td><b>1FN</b></td><td><code>zonas_cubiertas</code></td><td><b>Multivaluado</b>: la habilitación transportista↔zona es una <b>N:M</b> disfrazada de texto</td><td>No se puede consultar “qué transportistas cubren Belgrano” sin parsear texto; agregar una zona exige reescribir la cadena; nada impide escribirla distinto dos veces</td></tr>
              <tr><td><b>2FN</b></td><td><code>PARADA.direccion_punto</code>, <code>localidad_punto</code></td><td>PK compuesta; dependen sólo de <code>id_punto</code> → <b>parcial</b></td><td>Reubicar un punto de retiro obliga a actualizar todas las paradas históricas que lo visitaron</td></tr>
              <tr><td><b>2FN</b></td><td><code>PARADA.fecha_hoja</code></td><td>Depende sólo de <code>id_hoja</code> → <b>parcial</b> (y además ya está en HOJA_RUTA)</td><td>Reprogramar la hoja a otro día deja fechas distintas en la cabecera y en sus paradas</td></tr>
              <tr><td><b>3FN</b></td><td><code>transportista_*</code> y <code>empresa_logistica</code></td><td>Dependen de <code>transportista_legajo</code>, no clave → <b>transitiva</b></td><td><b>Actualización:</b> N filas por transportista. <b>Borrado:</b> se pierde su teléfono y su empresa. <b>Inserción:</b> no se puede dar de alta un transportista hasta que tenga una hoja de ruta</td></tr>
              <tr><td><b>3FN</b></td><td><code>vehiculo_*</code></td><td>Dependen de <code>vehiculo_patente</code> → <b>transitiva</b></td><td>El mismo vehículo puede figurar con capacidades distintas en dos hojas: no hay una única verdad</td></tr>
              <tr><td><b>3FN</b></td><td><code>cant_paradas</code></td><td><b>Derivado</b>: COUNT sobre PARADA</td><td>Se desincroniza al agregar o quitar una parada</td></tr>
            </tbody>
          </table></div>
          <div class="callout tip">
            <p><b>Dos observaciones que no son de normalización y conviene señalar aparte</b> (demuestran criterio):
            <b>①</b> en <code>ENTREGA_EN_PARADA</code>, <code>(id_hoja, nro_parada)</code> está <b>suelto, sin FK
            compuesta</b> a <code>PARADA</code>: se puede registrar una entrega en una parada que no existe — es un
            problema de <b>integridad referencial</b>. <b>②</b> <code>id_envio</code> apunta a <b>otro servicio</b>, así
            que corresponde que sea un <b>ID lógico</b> validado por la aplicación, no una FK.</p>
            <p><b>El matiz:</b> <code>direccion_punto</code> <b>no</b> se salva con el argumento de la “verdad
            histórica”. Podría discutirse si el negocio exigiera saber a qué dirección fue el transportista ese día
            —ahí sería <b>desnormalización por consistencia</b>, igual que el domicilio en una factura—, pero el
            enunciado no lo pide y <b>no está declarada</b>: tal como está, es una violación de 2FN.</p>
          </div>
          <h3>Modelo corregido</h3>
          ${APP.code(`EMPRESA_LOGISTICA (id_empresa PK, razon_social UNIQUE NOT NULL, cuit UNIQUE)
TRANSPORTISTA     (id_transportista PK, id_empresa FK NOT NULL, legajo UNIQUE NOT NULL,
                   nombre NOT NULL, documento UNIQUE, licencia_nro, licencia_vence DATE)
ZONA              (id_zona PK, nombre UNIQUE NOT NULL)
TRANSPORTISTA_ZONA(id_transportista PK FK, id_zona PK FK,          -- N:M, resuelve 1FN
                   habilitado_desde DATE NOT NULL, habilitado_hasta DATE NULL)
VEHICULO          (patente PK, id_empresa FK NOT NULL, modelo, capacidad_m3 DECIMAL(6,2))
HOJA_RUTA         (id_hoja PK, fecha DATE NOT NULL,
                   id_transportista FK NOT NULL, patente FK NOT NULL,
                   estado NOT NULL CHECK (estado IN
                     ('PLANIFICADA','EN_CURSO','CERRADA','CANCELADA')),
                   UNIQUE (id_transportista, fecha))
EVENTO_HOJA_RUTA  (id_evento PK, id_hoja FK NOT NULL, estado_resultante NOT NULL,
                   fecha_hora DATETIME NOT NULL, id_usuario, motivo)   -- quién la modificó
PARADA            (id_hoja PK FK, nro_parada PK,
                   id_punto NOT NULL,                      -- ID lógico (Servicio de Red)
                   hora_estimada TIME, hora_real TIME,
                   resultado CHECK (resultado IN ('CUMPLIDA','NO_REALIZADA','REPROGRAMADA')),
                   UNIQUE (id_hoja, id_punto))             -- no se visita dos veces el mismo punto
ENTREGA_EN_PARADA (id_entrega PK, id_hoja NOT NULL, nro_parada NOT NULL,
                   id_envio NOT NULL,                      -- ID lógico (Servicio de Envíos)
                   observaciones,
                   FOREIGN KEY (id_hoja, nro_parada) REFERENCES PARADA)  -- FK COMPUESTA

-- cant_paradas se CALCULA con COUNT. La secuencia de paradas la da nro_parada.`, { lang: "sql", collapse: false, label: "En 3FN" })}
        </details>

        <h2>Punto 1 bis — DER del Servicio III (Atención y Reclamos)</h2>
        <div class="card">
          <p>Realice el <b>modelo de datos del Servicio III</b>. Indique PK, FK, cardinalidad, modalidad y
          restricciones, con supuestos y justificación. <i>(El Servicio II quedó resuelto en el punto anterior, en su
          versión corregida.)</i></p>
        </div>
        <details class="qa">
          <summary>✅ Solución — DER del Servicio III</summary>
          ${APP.uml(`erDiagram
    MOTIVO_RECLAMO ||--o{ RECLAMO : tipifica
    RECLAMO ||--|{ INTERVENCION : "registra (1,N)"
    INTERVENCION ||--o{ ADJUNTO : "incluye (0,N)"
    RECLAMO ||--|{ EVENTO_RECLAMO : "transiciona (1,N)"
    AREA ||--o{ DERIVACION : recibe
    RECLAMO ||--o{ DERIVACION : "se deriva (0,N)"
    MOTIVO_RECLAMO {
      int id_motivo PK
      string codigo "UNIQUE NOT NULL - DANIADO, NO_RETIRADO, BLOQUEADO, DEMORA"
      string descripcion "NOT NULL"
      string criticidad "CHECK (BAJA, MEDIA, ALTA) NOT NULL"
      int sla_horas_ref "NOT NULL - valor DEL CATALOGO"
      boolean activo "NOT NULL DEFAULT true"
    }
    RECLAMO {
      int id_reclamo PK
      string numero "UNIQUE NOT NULL"
      int id_motivo FK "NOT NULL"
      datetime fecha_alta "NOT NULL"
      string origen_tipo "CHECK (COMERCIO, DESTINATARIO) NOT NULL"
      int id_origen "ID logico del Servicio de Envios"
      int id_envio "ID logico - NULL si no refiere a uno"
      int id_zona "ID logico - para el tablero por zona"
      int sla_horas_aplicado "CONGELADO al abrir - puede diferir del catalogo"
      string motivo_excepcion_sla "NULL - por que un supervisor lo extendio"
      int id_supervisor_excepcion "NULL"
      string estado "CHECK (ABIERTO, EN_ANALISIS, DERIVADO, RESUELTO, CERRADO_SIN_RESOLUCION)"
      datetime fecha_primera_respuesta "derivado"
      datetime fecha_resolucion "derivado"
      boolean cumplio_sla "derivado - contra el SLA APLICADO"
    }
    INTERVENCION {
      int id_intervencion PK
      int id_reclamo FK "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string autor_tipo "CHECK (RECLAMANTE, OPERADOR, SISTEMA) NOT NULL"
      int id_autor "ID logico"
      string autor_nombre_emision "congelado"
      string texto "TEXT NOT NULL"
      boolean visible_para_reclamante "NOT NULL DEFAULT true"
    }
    ADJUNTO {
      int id_adjunto PK
      int id_intervencion FK "NOT NULL"
      string url "NOT NULL - object storage, nunca el binario"
      string nombre_archivo "NOT NULL"
      string tipo_mime
      int tamanio_bytes
    }
    EVENTO_RECLAMO {
      int id_evento PK
      int id_reclamo FK "NOT NULL"
      string estado_resultante "NOT NULL"
      datetime fecha_hora "NOT NULL"
      int id_usuario "ID logico - quien lo cambio"
      string motivo
    }
    AREA {
      int id_area PK
      string nombre "UNIQUE NOT NULL - LOGISTICA, SOPORTE, FACTURACION"
    }
    DERIVACION {
      int id_derivacion PK
      int id_reclamo FK "NOT NULL"
      int id_area FK "NOT NULL"
      datetime derivado_en "NOT NULL"
      datetime devuelto_en "NULL mientras sigue en el area"
      string observaciones
    }`, "Servicio III — Atención y Reclamos")}
          <h3>Las 5 decisiones que se evalúan acá</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Decisión</th><th>Qué hice y por qué</th></tr></thead>
            <tbody>
              <tr><td><b>1 · ⭐ El SLA aplicado se congela en el reclamo</b></td><td>El catálogo trae <code>sla_horas_ref</code>, pero el enunciado dice que <b>“un supervisor puede extender ese plazo”</b> en reclamos puntuales. Ese valor <b>no puede vivir en <code>MOTIVO_RECLAMO</code></b>, que es <b>compartido por todos los reclamos</b>: extenderle el plazo a uno se lo extendería a todos, y además <b>cambiaría retroactivamente</b> si el administrador modifica el catálogo. Va <b>congelado en el reclamo</b> (<code>sla_horas_aplicado</code>) junto con el <b>motivo de la excepción</b> y quién la autorizó. Es <b>el punto del ejercicio</b>.</td></tr>
              <tr><td><b>2 · Conversación ≠ bitácora de estados</b></td><td>Son <b>dos cosas distintas y van en dos tablas</b>: <code>INTERVENCION</code> es <b>lo que se dijo</b> (texto, autor, adjuntos, visible o interno) y <code>EVENTO_RECLAMO</code> es <b>cómo cambió el estado</b> y quién lo cambió. Meter todo en una sola mezcla conversación con auditoría y después no se puede calcular ni la primera respuesta ni el tiempo en cada estado.</td></tr>
              <tr><td><b>3 · Adjuntos colgando de la intervención</b></td><td>Un adjunto pertenece a <b>un mensaje concreto</b>, no al reclamo en general (1,N desde <code>INTERVENCION</code>). Se guarda la <b>URL</b> del object storage: <b>nunca un BLOB</b>, y nunca una lista de rutas en un campo (sería multivaluado → 1FN).</td></tr>
              <tr><td><b>4 · Las métricas salen de los hechos</b></td><td>“% resueltos dentro del SLA” y “motivos más frecuentes por zona” <b>no son tablas</b>: con <code>RECLAMO</code> (que tiene motivo, zona y fechas) sale el <code>COUNT</code> + <code>GROUP BY</code>. Guardo <code>id_zona</code> en el reclamo <b>precisamente porque el tablero agrupa por zona</b> — sin eso habría que ir al otro servicio por cada fila. Si el volumen lo exige, sumo la <b>tabla de resumen</b> del Punto 3.</td></tr>
              <tr><td><b>5 · Derivaciones como entidad, no como estado</b></td><td>“Derivado” es un estado, pero <b>a qué área y por cuánto tiempo</b> es información propia, y un reclamo puede derivarse <b>varias veces</b>. Por eso <code>DERIVACION</code> es una tabla con <code>derivado_en</code> / <code>devuelto_en</code>, que además permite medir cuánto tiempo estuvo en cada área.</td></tr>
            </tbody>
          </table></div>
          <h3>Supuestos</h3>
          <ul>
            <li>Un reclamo tiene <b>al menos una intervención</b> (la que lo origina) y <b>al menos un evento</b> (el alta): modalidad <b>1,N</b> en ambas.</li>
            <li>El <b>origen</b> puede ser un comercio o un destinatario, que viven en <b>otros servicios</b>: lo resuelvo con <code>origen_tipo</code> + <code>id_origen</code> como <b>ID lógico</b>, no con dos FK excluyentes. Si ambos estuvieran en la misma base, lo correcto sería una jerarquía o dos FK con un CHECK que garantice que sólo una esté cargada.</li>
            <li><code>id_envio</code> e <code>id_zona</code> son <b>IDs lógicos</b> de otros servicios: sin FK, validados por la aplicación. La <b>zona</b> se copia al abrir el reclamo (es la zona <b>de ese momento</b>) y además evita un llamado por fila en el tablero.</li>
            <li><code>visible_para_reclamante</code> distingue las <b>notas internas</b> de lo que ve el cliente — si no, el operador no puede dejar observaciones.</li>
            <li>Los campos <code>fecha_primera_respuesta</code>, <code>fecha_resolucion</code> y <code>cumplio_sla</code> son <b>derivados</b>: se explican en el Punto 3 como desnormalización por performance.</li>
          </ul>
          <p class="mini"><b>Justificación comprimida:</b> <b>(a)</b> persisto reclamo, intervenciones, adjuntos (URL),
          eventos, derivaciones y los catálogos; <b>no persisto</b> las métricas (son consultas) ni los binarios.
          <b>(b)</b> identidad con PK subrogada y <b>UNIQUE</b> en <code>numero</code>; <code>TEXT</code> para el cuerpo
          y <code>DATETIME</code> para los hitos; sin N:M; estados y criticidad como <b>enum con CHECK</b>, y el
          <b>motivo como tabla maestra</b> porque lo define un administrador; si hubiera subtipos de intervención con
          atributos propios, <b>SINGLE_TABLE</b> con discriminador. <b>(c)</b> congelo el <b>SLA aplicado</b> y el
          <b>nombre del autor</b> (consistencia), y derivo las fechas y <code>cumplio_sla</code> (performance), con la
          bitácora como <b>fuente de verdad</b> y proceso de recálculo.</p>
        </details>

        <h2>Punto 3 — Desnormalización</h2>
        <div class="card">
          <p>Dos problemas sobre la mesa: <b>(a)</b> los comercios reclaman que, al <b>reimprimir una factura</b> de
          hace seis meses, el importe y el domicilio <b>no coinciden</b> con el comprobante original; <b>(b)</b> el
          tablero de atención —<b>% de reclamos resueltos dentro del SLA</b> y <b>motivos más frecuentes por zona</b>—
          se consulta permanentemente y demora, porque recorre toda la conversación de cada reclamo.</p>
          <p>Indique <b>qué estructuras desnormalizaría</b>, de qué <b>tipo</b> es cada caso y qué <b>costos</b> asume.</p>
        </div>
        <details class="qa">
          <summary>✅ Solución — Punto 3</summary>
          <h3>① Forzada por CONSISTENCIA — la factura</h3>
          <p><b>No es un problema de performance: el modelo normalizado devuelve un resultado incorrecto desde el punto
          de vista del negocio.</b> La factura sólo guarda FKs al comercio, al plan y a los conceptos, y una FK expresa
          “el valor <b>actual</b>”; el negocio necesita “el valor <b>al momento de la emisión</b>”. Si el comercio se
          muda, si se renegocia el abono o si cambia una alícuota de IVA, <b>el comprobante pasado se reescribe</b>, con
          impacto <b>impositivo y probatorio</b>. Un documento fiscal es <b>inmutable</b>, así que los datos
          <b>se copian</b>:</p>
          ${APP.code(`FACTURA         ( ..., razon_social_emision, cuit_emision,
                  condicion_iva_emision, domicilio_emision, plan_emision )
DETALLE_FACTURA ( ..., descripcion_emision,
                  precio_unitario_aplicado, alicuota_iva_aplicada )
-- Técnica: dato de contexto congelado. Se CONSERVAN las FK para navegar al maestro vigente.`, { lang: "sql", collapse: false, label: "Consistencia" })}
          <p><b>Criterio:</b> si el dato <b>integra un documento con valor probatorio, se copia</b>; si sólo sirve para
          <b>navegar, se referencia</b>. Por eso el <b>teléfono del contacto</b> no se congela: ahí interesa el actual.</p>
          <h3>② Forzada por PERFORMANCE — el tablero de SLA</h3>
          <p>Acá el modelo <b>es correcto pero lento</b>: el costo está en recorrer toda la conversación de cada reclamo
          y en las <b>agregaciones repetidas</b>. Es decisión de <b>última instancia</b> y <b>exige medición previa</b>:
          primero plan de ejecución, <b>índices</b> por <code>(estado, fecha)</code>, reescritura de consultas,
          particionamiento y caché. Si no alcanza:</p>
          ${APP.code(`-- a) CAMPOS DERIVADOS en la cabecera del reclamo
RECLAMO.fecha_primera_respuesta   -- en lugar de MIN(fecha) sobre INTERVENCION
RECLAMO.fecha_resolucion
RECLAMO.horas_resolucion          -- calculado al cerrar
RECLAMO.cumplio_sla               -- BOOLEAN calculado contra el plazo APLICADO

-- b) TABLA DE RESUMEN (preagregación) por batch nocturno
SLA_DIARIO_ZONA (fecha, id_zona, id_motivo,
                 reclamos, resueltos, dentro_sla, horas_prom, calculado_en)
   -- PK compuesta (fecha, id_zona, id_motivo) → esquema estrella

-- c) ATRIBUTO REPLICADO para evitar el JOIN en el listado
RECLAMO.nombre_comercio           -- conservando id_comercio (fuente de verdad)`, { lang: "sql", collapse: false, label: "Performance" })}
          <div class="callout warn">
            <p><b>El detalle fino que distingue una buena respuesta:</b> <code>cumplio_sla</code> <b>no</b> se puede
            calcular contra el plazo <b>vigente</b> del motivo, porque el administrador puede cambiarlo —y un supervisor
            puede haberlo extendido para ese reclamo puntual—. Hay que <b>congelar el plazo aplicado en el reclamo</b>
            (<code>plazo_sla_aplicado_hs</code> + <code>motivo_excepcion</code>): eso es <b>desnormalización por
            consistencia</b>, y es lo que permite que la métrica de performance sea <b>reconstruible</b>. Los dos tipos
            trabajando juntos.</p>
          </div>
          <h3>Costos que asumo</h3>
          <ul>
            <li>Reaparecen las <b>anomalías de actualización</b>; la <b>escritura se encarece</b>; la <b>integridad pasa
            al software</b> (triggers, servicios de dominio, batch).</li>
            <li><b>Ventana de inconsistencia:</b> el tablero puede estar <b>hasta 24 h</b> desactualizado — aceptable
            para métricas de gestión. En el <b>importe de una factura</b>, la tolerancia es <b>cero</b>: va congelado,
            no por batch.</li>
            <li>Más volumen e índices; y dos consultas equivalentes pueden diferir → <b>declarar la fuente de verdad</b>
            y <b>monitorear la divergencia</b>.</li>
            <li><b>Condición innegociable:</b> todo dato derivado debe ser <b>reconstruible</b> por un proceso de
            recálculo.</li>
          </ul>
        </details>

        <h2>Punto 4 — Arquitectura</h2>
        <div class="card">
          <p><b>a)</b> PaqueRed tiene dos frentes web: un <b>sitio público</b> donde cualquiera busca puntos de retiro
          cercanos —y que el negocio quiere que <b>aparezca primero en Google</b>— y un <b>panel de comercios</b> muy
          interactivo, con tableros y carga masiva de envíos. ¿Qué <b>tipo de cliente</b> propone para cada uno?
          Justifique con atributos de calidad.</p>
          <p><b>b)</b> La facturación electrónica se integra con <b>ARCA (ex AFIP)</b>, que expone <b>web services
          SOAP</b>, exige autenticación con certificado y <b>a veces tarda o no responde</b>. ¿Cómo diseña esa
          integración? ¿Qué pasa si hay <b>timeout pero ARCA igual otorgó el CAE</b>?</p>
          <p><b>c)</b> Al sistema acceden <b>comercios, transportistas y operadores internos</b>, y se manejan datos
          fiscales y personales. ¿Qué <b>componente</b> propone para el inicio de sesión y qué mecanismos garantizan
          <b>confidencialidad</b> e <b>integridad</b>?</p>
          <p><b>d)</b> Hay que <b>renombrar y reorganizar una tabla</b> que usan dos servicios, y el sistema <b>no puede
          tener downtime</b>. ¿Cómo lo hace? ¿Qué <b>estrategia de despliegue</b> elige y qué observa?</p>
          <p><b>e)</b> ¿<b>Nube u on-premise</b> para PaqueRed? Considere que los lockers están en la calle con
          <b>conectividad irregular</b>, que hay <b>picos</b> (Hot Sale, Navidad) y que se manejan <b>datos personales</b>.</p>
        </div>

        <details class="qa">
          <summary>✅ Solución — a) Dos frentes, dos tipos de cliente</summary>
          <p><b>Son dos respuestas distintas, y eso es exactamente lo que se evalúa:</b> el tipo de cliente se elige por
          caso de uso, no para todo el sistema.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>Sitio público de puntos de retiro</th><th>Panel de comercios</th></tr></thead>
            <tbody>
              <tr><td><b>Propuesta</b></td><td><b>Cliente liviano (SSR)</b> o <b>renderizado híbrido</b> (SSR + hidratación), con <b>SSG</b> para las páginas de punto que casi no cambian</td><td><b>Cliente pesado (SPA)</b></td></tr>
              <tr><td><b>Por qué</b></td><td><b>SEO:</b> el buscador indexa <b>más fácil y de forma más confiable el contenido que ya llega como HTML</b>. Los buscadores modernos ejecutan JS, pero de forma <b>más lenta, costosa y no garantizada</b> (<i>crawl budget</i>). Además la <b>primera carga</b> es más rápida y funciona en dispositivos y conectividad limitados</td><td><b>Alta interactividad</b> (tableros, carga masiva, filtros) y <b>múltiples clientes sobre la misma API</b> sin duplicar reglas; equipos de front y back en paralelo sobre un contrato estable</td></tr>
              <tr><td><b>Atributos</b></td><td><b>SEO</b> y <b>Performance</b> (carga inicial), sin resignar usabilidad gracias a la hidratación</td><td><b>Usabilidad</b> y <b>Escalabilidad</b>: el cómputo de la UI <b>lo paga el cliente</b>, no el servidor</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cierre:</b> ambos consumen <b>la misma API versionada</b>. El sitio público es un
          <b>cliente liviano desacoplado</b>: no acopla su presentación al modelo del servidor, así que mañana se puede
          reemplazar por otra cosa <b>sin tocar el backend</b>. Y conviene nombrar que <b>SPA ≠ cliente pesado</b>: SPA
          es una <b>técnica</b> del cliente pesado <b>web</b>. Para la app mobile de los transportistas, que necesita
          <b>cámara, GPS y trabajar con conectividad intermitente</b>, propondría <b>nativa</b> (o híbrida con plugins),
          priorizando <b>funcionalidad y performance</b> por sobre el costo de mantener dos bases de código.</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — b) Integración SOAP con ARCA</summary>
          <p><b>Primero, la caracterización:</b> es una integración <b>sincrónica</b> con un <b>sistema externo que no
          controlo</b>, con un <b>contrato formal y tipado</b> (<b>WSDL + XSD</b>, mensajes <b>XML</b> en un
          <i>envelope</i> SOAP con Header opcional y Body obligatorio), autenticación con <b>certificado</b> (en ARCA, el
          servicio <b>WSAA</b> devuelve un <i>ticket de acceso</i> que después se usa contra <b>WSFEv1</b>) y seguridad
          por <b>WS-Security</b>. Es el caso típico de <b>SOAP en organismos públicos</b>.</p>
          <p><b>Diseño:</b> la emisión <b>no se hace en el request del usuario</b>. El servicio de Facturación genera la
          factura en estado <b>“pendiente de CAE”</b> y <b>publica un mensaje en una cola</b>; un consumidor dedicado
          hace la llamada a ARCA. Así: el cierre del mes <b>no se frena</b> si ARCA está caído, el pico de fin de mes
          <b>se amortigua</b> en la cola, y se pueden <b>escalar consumidores</b>. Toda la integración entra al dominio
          por un <b>Adapter</b> contra una interfaz propia, de modo que el XML y el WSDL <b>no contaminen</b> las reglas
          de negocio (y cambiar de proveedor o de versión sea otro adapter).</p>
          <p><b>Resiliencia:</b> <b>timeout</b> siempre definido; <b>reintentos limitados con backoff</b> y jitter;
          <b>circuit breaker</b> que, tras N fallos, <b>abre</b> y <b>falla rápido</b> en lugar de acumular hilos
          bloqueados; <b>DLQ</b> para los comprobantes que ARCA <b>rechaza por datos inválidos</b> (un CUIT mal cargado
          no se arregla reintentando: es un <b>mensaje venenoso</b>, hay que apartarlo y avisarle a alguien).</p>
          <div class="callout key">
            <div class="callout-title">⚠️ “Timeout pero ARCA igual otorgó el CAE” — la respuesta exacta</div>
            <p>Con timeout <b>quedo en incertidumbre</b>: el comprobante pudo haberse autorizado. <b>Reintentar a ciegas
            genera un comprobante duplicado</b>, que en un sistema fiscal es un problema serio. La salida es la
            <b>idempotencia</b>: la numeración <code>(punto_venta, numero)</code> es la <b>clave de idempotencia
            natural</b>, y ARCA expone una operación de <b>consulta</b> del último comprobante autorizado. El flujo
            correcto es <b>consultar antes de reintentar</b>: si ya tiene CAE, lo persisto y cierro; si no, reintento
            <b>con el mismo número</b>, nunca generando uno nuevo. Guardo <code>id_externo_arca</code> con
            <b>UNIQUE</b> para que la base <b>impida por diseño</b> registrar dos veces la misma autorización.</p>
          </div>
        </details>

        <details class="qa">
          <summary>✅ Solución — c) Identidad, confidencialidad e integridad</summary>
          <p><b>Componente de login:</b> un <b>IdM / IdP con SSO</b> (Keycloak, Auth0, Entra ID), que centraliza
          identidades, credenciales, roles y permisos: <b>altas y bajas en un solo lugar</b>, <b>MFA</b> para los
          operadores internos, y el usuario <b>se autentica una vez</b> para todas las aplicaciones. El IdP emite un
          <b>JWT firmado</b> que el cliente envía en <code>Authorization: Bearer</code>; el <b>API Gateway</b> valida
          firma y expiración y propaga la identidad a los servicios, que quedan <b>stateless</b> (y por lo tanto
          escalan horizontalmente <b>sin sticky sessions</b>). Para los comercios conviene además <b>login federado</b>
          por <b>OpenID Connect</b>. <b>El IdP es crítico:</b> hay que darle alta disponibilidad.</p>
          <p><b>Autorización:</b> tres perfiles muy distintos → <b>roles y permisos con alcance</b>. Un comercio ve
          <b>sus</b> envíos y <b>sus</b> facturas (alcance “propios”); un transportista, <b>su</b> hoja de ruta del día;
          un operador, todo. El alcance depende de la <b>relación entre el sujeto y el recurso</b>, así que RBAC puro no
          alcanza y se complementa con validación por <b>contexto (ABAC)</b>. <b>Siempre en el backend:</b> ocultar un
          botón no es seguridad. <b>401</b> = no sé quién sos; <b>403</b> = sé quién sos y no podés.</p>
          <p><b>Confidencialidad:</b> <b>TLS</b> en tránsito, también en el tráfico <b>interno</b> (“la red es segura”
          es una falacia); <b>cifrado en reposo</b> de la base y del object storage, y <b>a nivel de columna</b> para
          CUIT, documento y domicilio; claves en una <b>bóveda de secretos</b> con <b>rotación</b> y <b>nunca en el
          repositorio</b>; contraseñas <b>hasheadas con salt</b> (bcrypt/Argon2), nunca cifradas; <b>minimización</b> y
          <b>enmascaramiento</b> en los listados; <b>anonimizar</b> antes de copiar datos a testing (<b>Ley
          25.326</b>); y <b>WAF</b> en el borde contra el OWASP Top 10.</p>
          <p><b>Integridad:</b> <b>firma digital o HMAC</b> del PDF de la factura y del resumen que se envía al
          comercio, publicando el <b>hash</b> para poder verificarlo; <b>constraints e integridad referencial</b> en la
          base; <b>transacciones</b>; y un <b>log de auditoría append-only</b> —quién accedió o modificó qué y cuándo—
          que, al no poder actualizarse, sirve como evidencia.</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — d) Cambiar el esquema sin downtime</summary>
          <div class="callout key">
            <div class="callout-title">La respuesta es Expand and Contract</div>
            <p><b>El problema:</b> durante el despliegue <b>conviven la versión vieja y la nueva</b> del código, así que
            la base tiene que ser <b>compatible con ambas</b>. Un <code>ALTER TABLE ... RENAME</code> rompe en el acto a
            la versión que todavía está corriendo — y a cualquier otro servicio que lea esa tabla.</p>
            <p><b>① EXPAND:</b> se <b>agrega</b> la columna/tabla nueva <b>manteniendo la anterior activa</b>. Nada se
            rompe: la v1 sigue leyendo lo viejo. <b>② MIGRATE / DUAL WRITE:</b> se despliega la versión nueva, que
            <b>escribe en ambas</b> estructuras, y se <b>migran los datos históricos en segundo plano</b>. <b>③
            CONTRACT:</b> cuando se verifica que <b>ningún servicio consulta la estructura vieja</b>, se elimina.</p>
            <p><b>Regla general:</b> los cambios de esquema y de contrato de API deben ser <b>aditivos</b> —agregar
            campos <b>opcionales</b>, nunca renombrar o borrar de una—, con <b>deprecación gradual</b>. Y si la tabla la
            usan dos servicios, esto es además la señal de que <b>la base compartida es un contrato implícito</b>: lo
            correcto a futuro es exponerla por <b>API</b> o replicarla por <b>eventos</b>.</p>
          </div>
          <p><b>Estrategia de despliegue:</b> <b>Rolling update</b> (sin downtime, sin infraestructura extra, y es el
          default de Kubernetes), que es viable <b>precisamente porque</b> Expand &amp; Contract garantizó la
          compatibilidad hacia atrás. Si el cambio fuera <b>incompatible</b> y no se pudiera hacer por fases,
          correspondería <b>Recreate</b> con ventana de mantenimiento anunciada. Si hiciera falta <b>rollback
          instantáneo</b> y se pudiera pagar el doble de infraestructura, <b>Blue/Green</b> — recordando que
          <b>la base suele ser compartida entre los dos entornos</b>, así que las migraciones <b>igual</b> tienen que
          ser compatibles. Y el <b>release</b> de la funcionalidad nueva lo separo del <b>deploy</b> con un
          <b>feature flag</b>, que además da <b>kill switch</b>.</p>
          <p><b>Qué observo durante y después:</b> las <b>4 Golden Signals</b> del servicio (latencia p95/p99, tráfico,
          % de errores, saturación del <b>pool de conexiones</b>, que es la señal adelantada), el <b>SLI</b> del caso de
          uso afectado y el consumo del <b>error budget</b>; en la base, bloqueos y duración de la migración en segundo
          plano; y un <b>chequeo de divergencia</b> entre la estructura vieja y la nueva durante el <i>dual write</i>.
          Si algo se degrada, <b>apago la flag</b> — y recién si no alcanza, <b>rollback</b>; teniendo en cuenta que con
          cambios de datos a veces el camino correcto es <b>roll-forward</b> (arreglar y desplegar otra versión) en
          lugar de volver atrás.</p>
        </details>

        <details class="qa">
          <summary>✅ Solución — e) Nube, on-premise o híbrida</summary>
          <p><b>Propuesta: nube pública para la plataforma + capacidad de borde (edge) en los lockers.</b> No es una
          elección binaria: es un <b>espectro</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Driver del enunciado</th><th>Decisión</th><th>Por qué</th></tr></thead>
            <tbody>
              <tr><td><b>Picos</b> (Hot Sale, Navidad)</td><td><b>Nube pública</b> con autoescalado</td><td><b>Elasticidad</b>: escalar hacia arriba <b>y hacia abajo</b> en minutos. Dimensionar on-premise para el pico implicaría pagar <b>todo el año</b> una capacidad que se usa unos días. <b>Pago por uso (OPEX)</b> sin inversión inicial</td></tr>
              <tr><td><b>Red de lockers distribuida</b> en todo el país</td><td><b>Nube</b> + <b>CDN</b></td><td><b>Alcance global</b> y contenido cerca del usuario; <b>alta disponibilidad</b> nativa desplegando en <b>2 o más zonas de disponibilidad</b>, que protegen ante la caída de un datacenter completo</td></tr>
              <tr><td><b>Conectividad irregular</b> en la calle</td><td><b>Edge / borde</b> en el locker</td><td>El locker <b>debe poder abrir un casillero aunque se corte el enlace</b>: valida el código localmente contra una copia firmada y con vencimiento, <b>bufferea los eventos</b> y los sincroniza al reconectar (<b>consistencia eventual</b>). Es el mismo criterio por el que un sistema que controla procesos físicos no puede depender de Internet</td></tr>
              <tr><td><b>Datos personales y fiscales</b></td><td>Nube, con <b>responsabilidad compartida</b> asumida</td><td>La <b>Ley 25.326</b> no prohíbe la nube, pero obliga a saber <b>en qué país quedan los datos</b> y a hacerse cargo de la <b>“seguridad EN la nube”</b>: datos, IAM, configuración, cifrado. <b>Contratar nube no transfiere la responsabilidad</b>, y la mayoría de los incidentes nacen de <b>configuraciones incorrectas del cliente</b>. Si una norma exigiera residencia local, se elige <b>región local</b> o un componente <b>on-premise</b> → <b>híbrida</b></td></tr>
            </tbody>
          </table></div>
          <p><b>Modelo de servicio:</b> <b>PaaS</b> / contenedores administrados para los servicios, <b>servicios
          administrados</b> para base, cola y observabilidad (menos personal de infraestructura, mejor
          <b>time-to-market</b>), reservando <b>IaaS</b> sólo donde haga falta control fino. <b>Riesgos que asumo y cómo
          los mitigo:</b> <b>costos variables</b> → disciplina <b>FinOps</b> (presupuestos, alertas, apagar lo ocioso);
          <b>egress</b> → CDN y evitar mover datos entre nubes; <b>vendor lock-in</b> → contenedores y servicios
          estándar donde se pueda; <b>dependencia de conectividad</b> → justamente el borde. <b>Cuándo cambiaría la
          decisión:</b> con carga <b>alta, estable y predecible</b> durante años, o con una exigencia regulatoria de
          custodia propia, on-premise puede ganar por <b>TCO</b> — que se compara con personal, energía, clima,
          renovación y licencias, no con el precio del servidor.</p>
        </details>

        <h2>Autoevaluación</h2>
        <p>Resolvé en papel y después marcá con honestidad. Se aprueba con <b>60</b> y <b>no menos del 50% por sección</b>.</p>
        <div id="p2m2brub"></div>
      `;

      APP.rubrica(el.querySelector("#p2m2brub"), "p2-m2-paquered-b", [
        { t: "DER: entidades con PK, FK, cardinalidad y modalidad en cada relación", p: 7 },
        { t: "DER: los valores NEGOCIADOS quedaron en el CONTRATO, no en el PLAN (y los descuentos en la intermedia)", p: 8 },
        { t: "DER: contratos renovables con vigente_desde / vigente_hasta, conservando el histórico", p: 5 },
        { t: "DER: todos los datos de la factura congelados (fiscales, plan, precio y alícuota aplicados)", p: 6 },
        { t: "DER: numeración fiscal como UNIQUE compuesto (punto_venta, numero), no como PK", p: 3 },
        { t: "DER: CAE como relación 0,1 con clave de idempotencia", p: 4 },
        { t: "DER: bitácora de la factura + estado actual declarado como derivado", p: 4 },
        { t: "DER: supuestos escritos y los 3 párrafos de justificación", p: 8 },
        { t: "3FN: dije NO y nombré las violaciones con el nombre de cada dependencia", p: 8 },
        { t: "3FN: detecté que la habilitación transportista-zona es una N:M disfrazada de texto", p: 4 },
        { t: "3FN: señalé aparte la FK compuesta faltante en ENTREGA_EN_PARADA (integridad referencial, no normalización)", p: 4 },
        { t: "Desnormalización: separé consistencia (factura) de performance (tablero), y expliqué por qué el plazo de SLA aplicado también va congelado", p: 8 },
        { t: "Arquitectura a): propuse DISTINTO tipo de cliente para cada frente y lo justifiqué con SEO / interactividad", p: 6 },
        { t: "Arquitectura b): caractericé SOAP/WSDL, propuse cola + Adapter, y resolví el timeout con CONSULTAR antes de reintentar", p: 8 },
        { t: "Arquitectura c): IdM con SSO + JWT, roles y permisos con ALCANCE, y separé confidencialidad de integridad", p: 7 },
        { t: "Arquitectura d): Expand and Contract en sus 3 fases + estrategia de despliegue + qué observar", p: 8 },
        { t: "Arquitectura e): elegí un punto del espectro con los drivers del enunciado, incluido el borde por la conectividad irregular", p: 7 },
      ]);
    },
  });
})();
