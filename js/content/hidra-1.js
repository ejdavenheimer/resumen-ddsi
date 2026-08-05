/* ============================================================
   Parcial HIDRA — Modelo 1: Medición y Facturación
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p><b>HIDRA</b> (Red Hídrica Distribuida Inteligente) digitaliza la medición del consumo de agua mediante
    <b>caudalímetros inteligentes</b> instalados en cada domicilio o comercio, para <b>automatizar la facturación</b>.
    Este modelo se concentra en la <b>medición y la facturación</b>.</p>

    <h4>Servicio I — Gestión de Medidores y Suministros</h4>
    <p>Administra los <b>suministros</b> (el punto de servicio de agua de un domicilio) y los <b>caudalímetros</b>
    instalados. De cada suministro se conoce: domicilio, la <b>cuenta</b> del titular y su <b>categoría</b> (residencial,
    comercial, industrial o social). Cada suministro atraviesa un <b>ciclo de vida</b>: <i>activo</i>, <i>cortado</i>
    (por falta de pago o por orden), <i>limitado</i> (caudal reducido) y <i>dado de baja</i>. Según el estado, se permiten
    o no ciertas operaciones (no se puede facturar consumo de un suministro dado de baja; un suministro cortado no acumula
    consumo). De cada caudalímetro se conoce número de serie, modelo y estado. Un caudalímetro mide un único suministro a
    la vez.</p>

    <h4>Servicio II — Ingesta de Lecturas</h4>
    <p>Los caudalímetros <b>envían lecturas periódicamente</b> (cada lectura trae fecha/hora y el consumo acumulado en m³).
    Son <b>cientos de miles de medidores</b> reportando, con <b>picos</b> (por ejemplo, todos reportan al inicio de cada
    hora). Las lecturas pueden llegar <b>fuera de orden</b> o <b>duplicadas</b> por reintentos de la red.</p>

    <h4>Servicio III — Facturación</h4>
    <p>Al cierre de cada período, calcula la factura de cada suministro según el <b>esquema tarifario</b> correspondiente a
    su categoría. Actualmente existen tres esquemas, pero <b>pueden agregarse más en el futuro</b>:</p>
    <ul>
      <li><b>Residencial:</b> por <b>tramos de consumo</b> (los primeros 10 m³ a un valor, el excedente a otro).</li>
      <li><b>Comercial:</b> un cargo fijo mensual más un valor por m³.</li>
      <li><b>Social:</b> tarifa subsidiada (un porcentaje de la residencial).</li>
    </ul>
    <p>A todo esto se le suman <b>cargos fijos</b> (mantenimiento de red) e <b>impuestos</b>. La factura debe guardar el
    <b>detalle</b> de cómo se compuso el total (qué tramos, qué cargos), y el esquema tarifario aplicado.</p>

    <h4>Servicio IV — Cobros</h4>
    <p>Genera una <b>orden de pago</b> por cada factura y la envía a una <b>pasarela de pago externa</b>. La pasarela
    procesa el cobro y confirma el resultado <b>por webhook</b> (aprobado / rechazado). El movimiento bancario real está
    <b>fuera del alcance</b>: HIDRA sólo registra el estado del pago con el identificador que provee la pasarela.</p>

    <h4>Se pide</h4>
    <p><b>1) Modelado de Dominio</b> — Documentar la capa de dominio de los <b>Servicios I y III</b> (diagrama de clases).
    <b>2) Arquitectura I</b> — Diagrama de despliegue + componentes de la <b>ingesta de lecturas</b> (Servicio II),
    contemplando el alto volumen, los picos y las lecturas fuera de orden/duplicadas.
    <b>3) Arquitectura II</b> — Diseñe la integración con la <b>pasarela de pago</b>: describa si es sincrónica o
    asincrónica y por qué, el flujo completo (incluido el webhook) y cómo evita cobros duplicados.
    <b>4) Modelo de Datos</b> — DER del núcleo de facturación. Indique qué elementos convienen en persistencia
    <b>no relacional</b> y justifique.</p>`;

  const RUBRICA = [
    { t: "Dominio: usé <b>State (Estado)</b> para el ciclo de vida del suministro (activo/cortado/limitado/baja)", p: 8 },
    { t: "Las reglas “no facturar si está de baja / cortado no acumula” viven en el estado, no en un service", p: 5 },
    { t: "Dominio: usé <b>Strategy (Estrategia)</b> para el esquema tarifario, con una interfaz común", p: 8 },
    { t: "El residencial por tramos, el comercial fijo+variable y el social están como estrategias separadas", p: 5 },
    { t: "La factura guarda el <b>detalle</b> de la composición y el esquema aplicado", p: 5 },
    { t: "Justifiqué Strategy con “pueden agregarse más” (Open/Closed) y State con “según el estado se puede/no”", p: 6 },
    { t: "Arq I: <b>broker/cola</b> para amortiguar los picos de ingesta + workers que consumen", p: 8 },
    { t: "Arq I: consumidor <b>idempotente</b> (deduplica por medidor+timestamp) y maneja fuera de orden", p: 6 },
    { t: "Arq I: lecturas en base de <b>series temporales</b> / no relacional", p: 5 },
    { t: "Arq I: diagrama con protocolos etiquetados (MQTT/AMQP/HTTP)", p: 4 },
    { t: "Arq II: pasarela de pago vía <b>Adapter</b> (interfaz propia, cambiar de proveedor = otro adapter)", p: 6 },
    { t: "Arq II: flujo <b>asincrónico</b> con confirmación por <b>webhook</b>, no esperando bloqueado", p: 6 },
    { t: "Arq II: el webhook es <b>idempotente</b> (no acredita dos veces) y el dinero real queda fuera de alcance", p: 6 },
    { t: "Datos: DER con suministro, cuenta, medidor, factura e ítems de factura (PK/FK/cardinalidad/modalidad)", p: 8 },
    { t: "Datos: las <b>lecturas</b> van en no-relacional (time-series) con justificación", p: 5 },
    { t: "Justifiqué cada decisión citando la frase del enunciado (los 4 elementos)", p: 5 },
  ];

  D.finales.push({ id: "hidra-1", nombre: "HIDRA · Modelo 1 (Medición y Facturación)", fecha: "práctica", duracion: 150, enunciado: ENUNCIADO, rubrica: RUBRICA });

  APP.register({
    id: "hidra-1",
    title: "Modelo 1 · Medición y Facturación",
    tag: "📋",
    group: "Parcial HIDRA (práctica)",
    resumen: "Strategy tarifario · State suministro · pasarela",
    keywords: ["hidra", "facturacion", "tarifa", "medidor", "lecturas", "pasarela", "strategy", "state"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial HIDRA · Modelo de práctica 1</div>
          <h1>Medición y Facturación</h1>
          <p class="lead">Los patrones estrella acá: <b>Strategy</b> (tarifas), <b>State</b> (suministro) y <b>Adapter</b> (pasarela de pago).</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <div class="callout tip"><p>💡 <b>Resolvelo en papel primero</b> (podés usar el <a class="inline" data-go="p-simulacro">simulacro</a>).
        Recién después mirá la resolución.</p></div>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“esquema tarifario… <b>pueden agregarse más</b>”</td><td><b>Strategy</b> (Estrategia) + Open/Closed</td></tr>
            <tr><td>“ciclo de vida: activo, cortado, limitado, baja” + “según el estado se puede/no”</td><td><b>State</b> (Estado)</td></tr>
            <tr><td>“residencial <b>por tramos</b>”, “comercial fijo + variable”</td><td>Cada tarifa es una estrategia con su propia lógica</td></tr>
            <tr><td>“guardar el <b>detalle</b> de cómo se compuso el total”</td><td>Ítems de factura (entidad aparte), no un número suelto</td></tr>
            <tr><td>“cientos de miles… <b>picos</b>… fuera de orden… duplicadas”</td><td><b>Broker</b> + consumidor <b>idempotente</b> + async</td></tr>
            <tr><td>“<b>pasarela de pago externa</b>… confirma por <b>webhook</b>”</td><td><b>Adapter</b> + asincronismo + idempotencia</td></tr>
            <tr><td>“el movimiento bancario real está <b>fuera del alcance</b>”</td><td>No modelar dinero; sólo estado del pago + id de la pasarela</td></tr>
            <tr><td>“lecturas… fecha/hora y consumo”</td><td>Persistencia de <b>series temporales</b> (no relacional)</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1 — Modelado de dominio</h2>
        ${APP.uml(`classDiagram
    class Suministro {
        -domicilio: Domicilio
        -categoria: Categoria
        -estado: EstadoSuministro
        +facturar(Periodo) Factura
        +cortar()
        +limitar()
        +reactivar()
    }
    class EstadoSuministro {
        <<interface>>
        +facturar(Suministro, Periodo) Factura
        +cortar(Suministro)
        +nombre() String
    }
    class Activo
    class Cortado
    class Limitado
    class DadoDeBaja
    class Cuenta {
        -titular: Titular
        -saldo: Monto
    }
    class Caudalimetro {
        -numeroSerie: String
        -modelo: String
        -estado: EstadoMedidor
    }
    class EsquemaTarifario {
        <<interface>>
        +calcular(ConsumoDelPeriodo) DetalleTarifa
    }
    class TarifaResidencial {
        -tramos: List~Tramo~
    }
    class TarifaComercial {
        -cargoFijo: Monto
        -valorM3: Monto
    }
    class TarifaSocial {
        -porcentaje: double
    }
    class Factura {
        -periodo: Periodo
        -total: Monto
        -esquemaAplicado: String
        -items: List~ItemFactura~
    }
    class ItemFactura {
        -concepto: String
        -monto: Monto
    }
    EstadoSuministro <|.. Activo
    EstadoSuministro <|.. Cortado
    EstadoSuministro <|.. Limitado
    EstadoSuministro <|.. DadoDeBaja
    Suministro --> EstadoSuministro
    Suministro --> Cuenta
    Suministro --> "0..1" Caudalimetro
    EsquemaTarifario <|.. TarifaResidencial
    EsquemaTarifario <|.. TarifaComercial
    EsquemaTarifario <|.. TarifaSocial
    Suministro ..> EsquemaTarifario : usa según categoría
    Factura "1" *-- "*" ItemFactura`, "Servicios I y III · State + Strategy")}
        <div class="callout key">
          <div class="callout-title">🔑 Las 3 decisiones que dan los puntos</div>
          <ul>
            <li><b>Strategy (Estrategia) para la tarifa:</b> “pueden agregarse más esquemas” = Open/Closed. Cada tarifa es
            una clase; agregar una nueva no toca las demás. La factura guarda <b>qué esquema se aplicó</b> y el <b>detalle</b>
            (ítems), no sólo el total.</li>
            <li><b>State (Estado) para el suministro:</b> las operaciones válidas dependen del estado (un suministro
            <i>dado de baja</i> no se factura; uno <i>cortado</i> no acumula). Cada estado encapsula sus reglas.</li>
            <li><b>Factura con ItemFactura:</b> el “detalle de composición” exige una colección de ítems (cargo por tramo 1,
            tramo 2, cargo fijo, impuestos), no un campo numérico.</li>
          </ul>
        </div>
        <div class="callout tip">
          <div class="callout-title">📝 Justificación modelo (para escribir)</div>
          <blockquote class="just-modelo">“Apliqué <b>Strategy</b> para el esquema tarifario porque el enunciado indica que
          <b>pueden agregarse más</b>: cada esquema (residencial por tramos, comercial, social) es una implementación de
          <code>EsquemaTarifario</code>, y sumar uno nuevo no modifica el código existente (<b>Open/Closed</b>), con bajo
          acoplamiento. Modelé el ciclo de vida del suministro con <b>State</b> porque según el estado se habilitan o no
          las operaciones (no se factura un suministro de baja); cada estado encapsula sus transiciones, evitando
          <code>if</code> por estado.”</blockquote>
        </div>

        <h2>3 · Punto 2 — Arquitectura I (ingesta de lecturas)</h2>
        <p>El desafío: <b>muchísimos medidores, picos, lecturas fuera de orden y duplicadas</b>. La lectura no puede ir
        directo a la base de forma sincrónica.</p>
        ${APP.uml(`graph LR
    M1["🔧 Caudalímetros<br/>(cientos de miles)"] -->|"MQTT"| BR["📨 Broker de mensajes<br/>(cola, amortigua picos)"]
    BR -->|"AMQP"| W1["Worker de ingesta 1"]
    BR -->|"AMQP"| W2["Worker de ingesta 2"]
    BR -->|"AMQP"| W3["Worker de ingesta N"]
    W1 --> TS[("🗄️ Base time-series<br/>lecturas")]
    W2 --> TS
    W3 --> TS
    W1 -.->|"consumo del período"| SVC["Servicio de Facturación"]
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style TS fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Ingesta de alto volumen")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <ul>
            <li><b>Cola/broker que amortigua los picos:</b> los medidores publican sus lecturas (MQTT es el protocolo típico
            de IoT) en un broker. La ingesta se hace <b>asincrónica</b>: se acepta todo y se procesa al ritmo posible, sin
            perder lecturas ni tirar el servicio abajo en el pico.</li>
            <li><b>Workers escalables horizontalmente:</b> varios consumidores procesan en paralelo. Escalás sumando
            workers, no agrandando un servidor.</li>
            <li><b>Idempotencia + orden:</b> como las lecturas llegan <b>duplicadas y fuera de orden</b>, el worker
            deduplica por <code>(medidorId, timestamp)</code> y, como cada lectura trae el <b>consumo acumulado</b>, el
            orden de llegada no importa (el consumo del período se calcula por diferencia entre extremos).</li>
            <li><b>Time-series:</b> las lecturas se guardan en una base de <b>series temporales</b> (InfluxDB / Timescale),
            optimizada para escritura masiva y consultas por rango de fechas.</li>
          </ul>
        </div>

        <h2>4 · Punto 3 — Arquitectura II (pasarela de pago)</h2>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant F as Servicio de Cobros
    participant PP as Pasarela de Pago (externa)
    participant U as Usuario
    F->>PP: crear orden de pago (vía Adapter) [HTTPS]
    PP-->>F: id de pago + link de pago
    F-->>U: 202 · "pago pendiente" + link
    U->>PP: paga en la pasarela
    Note over F: NO se queda esperando bloqueado
    PP->>F: webhook: pago APROBADO (id) [HTTPS]
    F->>F: ¿ya procesé este id? (idempotencia)
    F->>F: marcar factura PAGADA
    F-->>PP: 200 OK`, "Integración asincrónica con la pasarela")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <ul>
            <li><b>Adapter (Adaptador):</b> defino <code>PasarelaDePagos</code> en mi dominio y un <code>MercadoPagoAdapter</code>
            (o el proveedor que sea). Cambiar de pasarela = otro adapter, sin tocar el dominio.</li>
            <li><b>Asincrónico, no sincrónico:</b> el pago lo hace el usuario en la pasarela y puede tardar. HIDRA crea la
            orden, responde “pendiente” y <b>se entera del resultado por webhook</b> (una llamada HTTP que la pasarela le
            hace cuando el pago se acredita). Nunca se queda bloqueado esperando.</li>
            <li><b>Idempotencia:</b> el webhook puede llegar <b>repetido</b>. El handler registra el <code>idPago</code>
            procesado y descarta duplicados, para no acreditar dos veces.</li>
            <li><b>Fuera de alcance:</b> el movimiento bancario real lo hace la pasarela. HIDRA sólo guarda el estado
            (pendiente/aprobado/rechazado) y el id.</li>
          </ul>
        </div>

        <h2>5 · Punto 4 — Modelo de datos</h2>
        <div class="callout bad"><p><b>❓ Ojo:</b> bases de datos <b>no está en el listado de contenidos</b> que viste. Si esta sección entra, será un <b>DER básico</b>. El de abajo es completo por si acaso; en el parcial hacé la versión simple (entidades, PK, FK, cardinalidad).</p></div>
        ${APP.uml(`erDiagram
    CUENTA {
        bigint  id_cuenta    PK
        varchar titular      "NOT NULL"
        varchar documento    "NOT NULL"
    }
    SUMINISTRO {
        bigint  id_suministro PK
        bigint  id_cuenta     FK "NOT NULL"
        varchar domicilio     "NOT NULL"
        varchar categoria     "NOT NULL CHECK(RESIDENCIAL,COMERCIAL,INDUSTRIAL,SOCIAL)"
        varchar estado        "NOT NULL CHECK(ACTIVO,CORTADO,LIMITADO,BAJA)"
    }
    CAUDALIMETRO {
        bigint  id_medidor    PK
        bigint  id_suministro FK "UK - mide uno a la vez"
        varchar numero_serie  "UK NOT NULL"
        varchar modelo
        varchar estado
    }
    FACTURA {
        bigint  id_factura    PK
        bigint  id_suministro FK "NOT NULL"
        date    periodo       "NOT NULL"
        decimal total         "NOT NULL"
        varchar esquema_aplicado "NOT NULL"
        varchar estado_pago   "PENDIENTE|APROBADO|RECHAZADO"
        varchar id_pago_pasarela
    }
    ITEM_FACTURA {
        bigint  id_item       PK
        bigint  id_factura    FK "NOT NULL"
        varchar concepto      "NOT NULL"
        decimal monto         "NOT NULL"
    }
    CUENTA      ||--|{ SUMINISTRO   : "1..N"
    SUMINISTRO  ||--o| CAUDALIMETRO : "0..1"
    SUMINISTRO  ||--o{ FACTURA      : "0..N"
    FACTURA     ||--|{ ITEM_FACTURA : "1..N detalle"`, "DER del núcleo de facturación")}
        <div class="callout tip">
          <p><b>No relacional (justificar):</b> las <b>lecturas</b> de los caudalímetros van en una base de <b>series
          temporales</b>, no en el DER relacional. Motivo: son un volumen enorme (cientos de miles de medidores × muchas
          lecturas por día), se escriben de forma masiva y se consultan por <b>rango de tiempo</b>; una tabla relacional
          se volvería impracticable. La factura sólo guarda el consumo <b>ya calculado</b> del período.</p>
        </div>

        <h2>6 · Trampas</h2>
        <div class="trampa"><b>“Guardar el detalle de cómo se compuso el total.”</b> Si ponés <code>total</code> como un
        número suelto, perdés puntos. Necesitás <code>ItemFactura</code> (una fila por tramo/cargo/impuesto).</div>
        <div class="trampa"><b>“El movimiento bancario real está fuera del alcance.”</b> No modeles cuentas bancarias ni
        transferencias: sólo el estado del pago y el id que da la pasarela.</div>
        <div class="trampa"><b>Lecturas “fuera de orden y duplicadas”.</b> No alcanza con “uso una cola”: hay que decir que
        el consumidor <b>deduplica</b> y que, al traer el acumulado, el orden no afecta el cálculo.</div>
        <div class="trampa"><b>Tarifa por tramos.</b> El residencial no es un valor por m³: es <b>escalonado</b>. Modelá los
        tramos como una colección dentro de la estrategia residencial.</div>

        <h2>7 · Rúbrica</h2>
        <div id="rubHidra1"></div>
      `;
      APP.rubrica(el.querySelector("#rubHidra1"), "hidra-1", RUBRICA);
    },
  });
})();
