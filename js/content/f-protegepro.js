/* ============================================================
   Final resuelto — ProtegePro (11/02/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p>El auge de la economía de servicios y el trabajo independiente ha llevado a que miles de profesionales
    (fotógrafos, operadores de drones, ingenieros de campo y especialistas médicos) operen con equipamiento de altísimo
    valor económico en locaciones variables.</p>
    <p>El mercado asegurador tradicional ofrece pólizas anuales con costos fijos elevados, que muchas veces no cubren los
    riesgos específicos de la actividad en terreno o que resultan innecesarias para quienes utilizan su equipo de forma
    esporádica. Ante esta problemática surge <b>ProtegePro</b>, una plataforma de <b>seguros on-demand</b>. La propuesta de
    valor radica en la flexibilidad: el profesional sólo paga por la cobertura durante las horas exactas de su jornada
    laboral y dentro de un área geográfica delimitada.</p>

    <h4>Servicio I — Gestión de Usuarios e Inventario</h4>
    <p>Administra el registro de profesionales y sus equipos. Se toman los datos personales de la persona, su dirección y
    profesión. De los equipos se toma tipo de equipo, el valor de referencia, el peso, las dimensiones, si es frágil,
    descripción del estado y se le asigna un <b>código QR único (en todo el sistema)</b>, que el usuario debe imprimir y
    pegar sobre el equipo en un lugar visible. <b>Expone un endpoint para obtener los datos por dicho código QR.</b></p>

    <h4>Servicio II — Motor de Riesgo y Geofencing</h4>
    <p>Calcula el costo de la prima en tiempo real basándose en el contexto. <b>Actualmente se cuenta con 3 reglas, pero a
    futuro pueden agregarse más. Pueden aplicarse más de una y todas lo hacen sobre el valor de referencia.</b></p>
    <ul>
      <li><b>Zona de Riesgo:</b> si el perímetro de trabajo está en una zona catalogada como “Alta Peligrosidad” por la
      API de Seguridad local, se aplica un recargo del 40%.</li>
      <li><b>Descuento por Profesionalismo:</b> si el usuario completó 10 sesiones previas sin incidentes ni alertas de
      GPS, se aplica un descuento automático del 10% (“Bonus de Confianza”).</li>
      <li><b>Regla de Clima:</b> si la API de Clima predice ráfagas de viento &gt; 25 km/h, el sistema agrega un 20% de
      costo para equipos de tipo “Vuelo” (drones).</li>
    </ul>

    <h4>Servicio III — Validación Inteligente</h4>
    <p>Antes de iniciar una cobertura, el usuario debe tomar una foto del equipo. El sistema envía la imagen a una
    <b>IA de reconocimiento de imágenes</b>. Si la IA detecta una coincidencia de daño (ej.: un lente astillado) con una
    confianza mayor al 85%, y la misma no se encuentra en la descripción, la solicitud se marca como <b>“Sospechosa”</b>.</p>

    <h4>Servicio IV — Contrataciones</h4>
    <p>Gestiona el alta de un seguro para un equipo. Toma como entrada una fecha, un rango horario, un lugar, un código de
    equipamiento y una o más fotos del equipo. Realiza todos los cálculos relevantes, que luego el usuario acepta o
    rechaza. <b>El cobro se realiza por otro sistema</b>, que sólo requiere el código de la contratación (único para todo
    el sistema). Se debe también tener una <b>bitácora completa</b> de cómo evolucionó el seguro y explicación del costo
    final (ej.: debe quedar registrado que se descontó 10% por profesionalismo, que fue marcado como sospechosa y que el
    operador X dio fe de que era un error de la IA). El cumplimiento o no del contrato y el pago en caso de siniestro
    están también delegados en otro sistema, aunque necesitan los datos detallados de la contratación.</p>

    <h4>Punto 1 — Arquitectura (45 pts)</h4>
    <p><b>A (25)</b> — Realice un diagrama de arquitectura (despliegue + componentes) de la solución completa. Tenga en
    cuenta que el modelo de IA puede tardar más de un minuto en validar la imagen y contrastar contra la descripción y,
    por otro lado, se esperan picos de tráfico, ya que en general estos seguros se dan en eventos masivos.</p>
    <p><b>B (10)</b> — Explique cómo en el diagrama anterior maneja las posibles altas demoras del servicio de IA.
    ¿Cómo impacta en la usabilidad?</p>
    <p><b>C (10)</b> — Elija 2 interacciones entre los servicios internos y describa si son sync/async, formato y dé un
    ejemplo de los mensajes utilizados para comunicarse entre servicios.</p>

    <h4>Punto 2 — Modelado de Dominio (30 pts)</h4>
    <p>Documentar la solución de los Servicios II, III y IV con diagramas UML (diagrama de clases obligatorio).
    Plan 23: un diagrama por servicio. Explique mediante diagramas de secuencia cómo se realiza una reserva, suponiendo
    que todo salga bien.</p>

    <h4>Punto 3 — Datos (25 pts)</h4>
    <p>Armar la especificación del Servicio IV usando un DER físico, indicando entidades, campos, claves primarias,
    foráneas, cardinalidad, modalidad y restricciones según corresponda.</p>`;

  const RUBRICA = [
    { t: "Mi diagrama muestra los 4 servicios con <b>base de datos propia</b> cada uno", p: 5 },
    { t: "Incluí el <b>API Gateway</b> y el componente de identidad/autenticación", p: 4 },
    { t: "Incluí un <b>message broker</b> y expliqué que amortigua los picos", p: 6 },
    { t: "La validación con IA está <b>fuera del camino sincrónico</b> del usuario", p: 6 },
    { t: "Etiqueté el <b>protocolo</b> de cada flecha (HTTPS, AMQP, JDBC)", p: 3 },
    { t: "Aparecen los <b>sistemas externos</b>: IA, API de Clima, API de Seguridad, cobros, siniestros", p: 4 },
    { t: "Expliqué el manejo de la demora con <code>202 Accepted</code> + estado “en validación” + notificación", p: 5 },
    { t: "Respondí el impacto en <b>usabilidad</b> (el usuario no queda bloqueado, ve estado intermedio)", p: 5 },
    { t: "Describí 2 interacciones con las <b>4 partes</b>: quién→quién, sync/async + por qué, formato, mensaje de ejemplo", p: 10 },
    { t: "Servicio II modelado con <b>Strategy en colección</b> de reglas (no un if/else)", p: 8 },
    { t: "Cada regla decide sola si aplica (<code>aplica()</code>), el motor no tiene ifs", p: 4 },
    { t: "Servicio III usa <b>Adapter</b> para la API de IA y modela el umbral de confianza", p: 6 },
    { t: "Servicio IV tiene <b>State</b> para el ciclo de vida de la contratación", p: 6 },
    { t: "Servicio IV tiene <b>bitácora</b> con entradas que explican el costo final", p: 6 },
    { t: "Modelé el <b>código único</b> de contratación (para el sistema de cobros)", p: 3 },
    { t: "Hice el <b>diagrama de secuencia</b> del camino feliz de la contratación", p: 5 },
    { t: "El DER del Servicio IV tiene PK, FK, cardinalidad y modalidad en cada relación", p: 8 },
    { t: "La bitácora está como <b>tabla aparte</b> (1:N con contratación), no como campo de texto", p: 4 },
    { t: "Justifiqué cada patrón citando la <b>frase del enunciado</b> que lo motiva", p: 8 },
  ];

  D.finales.push({
    id: "f-protegepro", nombre: "ProtegePro", fecha: "11/02/2026", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-protegepro",
    title: "ProtegePro",
    tag: "📄",
    group: "Finales resueltos",
    resumen: "11/02/2026 · seguros on-demand",
    keywords: ["protegepro", "final", "seguros", "ia", "riesgo", "geofencing", "bitacora"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Final resuelto · 11/02/2026</div>
          <h1>ProtegePro</h1>
          <p class="lead">Seguros on-demand para profesionales. Arquitectura 45 · Dominio 30 · Persistencia 25.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <p>Antes de dibujar nada: subrayar. Estas son las frases que deciden todo el examen.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase del enunciado</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“un código QR <b>único en todo el sistema</b>”</td><td>Restricción <code>UNIQUE</code> en el DER; el código es identificador de negocio</td></tr>
            <tr><td>“3 reglas, pero <b>a futuro pueden agregarse más</b>”</td><td><b>Strategy</b> + OCP</td></tr>
            <tr><td>“<b>pueden aplicarse más de una</b> y todas sobre el valor de referencia”</td><td>El motor guarda una <b>colección</b> de estrategias y las encadena</td></tr>
            <tr><td>“la <b>API de Seguridad local</b>”, “la <b>API de Clima</b>”</td><td><b>Adapter</b> (dos integraciones externas)</td></tr>
            <tr><td>“envía la imagen a una <b>IA de reconocimiento</b>”</td><td><b>Adapter</b> + integración lenta</td></tr>
            <tr><td>“confianza <b>mayor al 85%</b>” y “no se encuentra en la descripción”</td><td>Dos condiciones combinadas: hay una regla de dominio, no un simple flag</td></tr>
            <tr><td>“el usuario <b>acepta o rechaza</b>”, “se marca como Sospechosa”</td><td><b>State</b>: ciclo de vida de la contratación</td></tr>
            <tr><td>“<b>bitácora completa</b> de cómo evolucionó… y explicación del costo final”</td><td>Entidad <code>EntradaDeBitacora</code> + registrar cada regla aplicada</td></tr>
            <tr><td>“el operador X <b>dio fe</b> de que era un error de la IA”</td><td>Intervención manual → hay un estado “En revisión” y un actor responsable en la bitácora</td></tr>
            <tr><td>“el <b>cobro se realiza por otro sistema</b>”, “sólo requiere el código”</td><td>Fuera de alcance: exponer el código único, no modelar el pago</td></tr>
            <tr><td>“puede tardar <b>más de un minuto</b>”</td><td><b>Asincronismo</b> obligatorio</td></tr>
            <tr><td>“se esperan <b>picos de tráfico</b>… eventos masivos”</td><td><b>Broker</b> que amortigua + escalado horizontal</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1.A — Diagrama de arquitectura</h2>
        ${APP.uml(`graph TB
    subgraph Clientes
      WEB["🌐 Web"]
      MOB["📱 Mobile"]
    end
    GW["🚪 API Gateway<br/>ruteo · authN/Z · rate limit"]
    IDM["🔐 IDM / Keycloak"]
    WEB -->|HTTPS| GW
    MOB -->|HTTPS| GW
    IDM -.valida token.-> GW

    GW -->|HTTPS| S1["Servicio I<br/>Usuarios e Inventario"]
    GW -->|HTTPS| S4["Servicio IV<br/>Contrataciones<br/>(orquestador)"]

    S4 -->|"HTTPS sync<br/>POST /riesgo/cotizaciones"| S2["Servicio II<br/>Motor de Riesgo"]
    S4 -->|"HTTPS sync<br/>GET /equipos/{qr}"| S1
    S4 -->|"AMQP publica<br/>validacion.solicitada"| BR
    BR["📨 RabbitMQ<br/>colas + DLQ"] -->|consume| S3["Servicio III<br/>Validación Inteligente"]
    S3 -->|"AMQP publica<br/>validacion.resuelta"| BR
    BR -->|consume| S4
    BR -->|consume| NOT["Servicio de<br/>Notificaciones"]

    S2 -->|HTTPS| APIS["🌍 API de Seguridad"]
    S2 -->|HTTPS| APIC["🌤️ API de Clima"]
    S3 -->|"HTTPS · &gt; 1 min"| IA["🤖 API de IA<br/>reconocimiento de imágenes"]
    S3 --> OBJ["🗂️ Object Storage<br/>fotos de equipos"]

    S1 --> DB1[("DB I<br/>usuarios, equipos")]
    S2 --> DB2[("DB II<br/>reglas, cotizaciones")]
    S3 --> DB3[("DB III<br/>validaciones")]
    S4 --> DB4[("DB IV<br/>contrataciones, bitácora")]

    S4 -->|"expone código único"| COB["💳 Sistema de Cobros<br/>(externo)"]
    S4 -->|"datos de la contratación"| SIN["📋 Sistema de Siniestros<br/>(externo)"]

    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style IA fill:#f1f5f9,stroke:#64748b,color:#0f172a
    style COB fill:#f1f5f9,stroke:#64748b,color:#0f172a
    style SIN fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Despliegue + componentes")}

        <div class="callout tip">
          <div class="callout-title">✅ Decisiones a justificar en la hoja</div>
          <ul>
            <li><b>Un servicio, una base.</b> Cada servicio es autónomo; compartir base mataría la independencia de despliegue.</li>
            <li><b>API Gateway + IDM.</b> Punto de entrada único, autenticación en el borde y rate limiting (importante con picos).</li>
            <li><b>Broker entre IV y III.</b> Porque la IA puede tardar más de un minuto y porque hay picos: la cola desacopla y amortigua.</li>
            <li><b>Object storage para las fotos.</b> Nunca binarios en la base ni dentro de los mensajes: viaja la URL.</li>
            <li><b>Cobros y siniestros afuera.</b> El enunciado los deja explícitamente fuera de alcance: se los muestra como sistemas externos.</li>
            <li><b>Escalado horizontal de los consumidores del Servicio III</b>, que es el cuello de botella real.</li>
          </ul>
        </div>

        <h2>3 · Punto 1.B — Manejo de la demora y usabilidad</h2>
        ${APP.uml(`sequenceDiagram
    autonumber
    actor U as Usuario
    participant S4 as Servicio IV
    participant S2 as Servicio II
    participant BR as Broker
    participant S3 as Servicio III
    participant IA as API de IA
    U->>S4: POST /contrataciones (fecha, rango, lugar, QR, fotos)
    S4->>S2: POST /riesgo/cotizaciones (sync, rápido)
    S2-->>S4: prima + reglas aplicadas
    S4->>BR: publica validacion.solicitada
    S4-->>U: 202 Accepted · {codigo, estado: EN_VALIDACION, prima}
    Note over U: ✅ NO queda bloqueado:<br/>ve la prima y el estado
    BR-->>S3: entrega mensaje
    S3->>IA: analizar imagen (puede tardar > 1 min)
    IA-->>S3: {daño: true, confianza: 0.91}
    S3->>BR: publica validacion.resuelta
    BR-->>S4: entrega resultado
    S4->>S4: transiciona a SOSPECHOSA o PENDIENTE_ACEPTACION
    BR-->>U: push / mail "tu cobertura está lista"`, "Manejo asincrónico de la demora")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo del punto B</div>
          <p>“La validación con IA se saca del camino sincrónico: el Servicio IV publica el mensaje
          <code>validacion.solicitada</code> en el broker y responde inmediatamente <code>202 Accepted</code> con el
          código de contratación, la prima ya calculada y el estado <code>EN_VALIDACION</code>. El Servicio III consume
          el mensaje, llama a la IA (que puede tardar más de un minuto) y publica <code>validacion.resuelta</code>, que
          el Servicio IV consume para transicionar el estado. El usuario se entera por push/mail, o por polling sobre
          <code>GET /contrataciones/{codigo}</code>.”</p>
          <p>“<b>Impacto en usabilidad:</b> el usuario recibe confirmación inmediata y ve un estado intermedio explícito,
          en lugar de esperar más de un minuto frente a una pantalla congelada —con riesgo de timeout del navegador y de
          que reintente y duplique la contratación. El costo es que la confirmación definitiva no es instantánea, así que
          la interfaz debe comunicar claramente el estado ‘en validación’ y el tiempo estimado. Además, la cola amortigua
          los picos de eventos masivos: se aceptan todas las solicitudes y se procesan al ritmo que permita la IA, en vez
          de rechazarlas por saturación.”</p>
        </div>

        <h2>4 · Punto 1.C — Dos interacciones entre servicios</h2>
        <p>El punto pide <b>cuatro cosas por interacción</b>: quién con quién, sync/async con su porqué, formato y un mensaje de ejemplo.</p>
        <h3>Interacción 1 — Servicio IV → Servicio II (sincrónica)</h3>
        <p><b>Sincrónica</b> porque es un cálculo rápido y el usuario necesita ver la prima para aceptar o rechazar.
        <b>Formato:</b> JSON sobre HTTPS (REST).</p>
        ${APP.code(`POST /v1/riesgo/cotizaciones HTTP/1.1
Host: motor-riesgo.protegepro.internal
Content-Type: application/json

{
  "codigoQr": "QR-9F3A21",
  "tipoEquipo": "VUELO",
  "valorReferencia": 320000.00,
  "usuarioId": 4821,
  "sesionesPreviasSinIncidentes": 12,
  "perimetro": { "lat": -34.6037, "lng": -58.3816, "radioMts": 500 },
  "rango": { "desde": "2026-08-03T08:00:00-03:00", "hasta": "2026-08-03T18:00:00-03:00" }
}

--- 200 OK ---
{
  "prima": 371200.00,
  "reglasAplicadas": [
    { "regla": "ZONA_DE_RIESGO",   "efecto": "+40%", "detalle": "Zona catalogada Alta Peligrosidad" },
    { "regla": "PROFESIONALISMO",  "efecto": "-10%", "detalle": "12 sesiones sin incidentes" },
    { "regla": "CLIMA",            "efecto": "+20%", "detalle": "Ráfagas 31 km/h · equipo de Vuelo" }
  ]
}`, { lang: "http", label: "Interacción sincrónica" })}
        <h3>Interacción 2 — Servicio IV → Servicio III (asincrónica)</h3>
        <p><b>Asincrónica</b> porque la IA puede tardar más de un minuto y porque hay picos de tráfico: la cola desacopla
        temporalmente y amortigua. <b>Formato:</b> JSON sobre AMQP (RabbitMQ).</p>
        ${APP.code(`// Exchange: protegepro.eventos   ·   Routing key: validacion.solicitada
{
  "eventId": "8f3c1e22-7b4a-4c11-9f10-2d5e6a7b8c90",
  "ocurridoEn": "2026-08-03T09:12:44-03:00",
  "contratacionId": "CTR-88421",
  "codigoQr": "QR-9F3A21",
  "descripcionDeclarada": "Dron DJI Mavic 3. Carcasa con roce menor en el lateral derecho.",
  "fotos": [
    "https://storage.protegepro.com/eq/QR-9F3A21/2026-08-03/f1.jpg",
    "https://storage.protegepro.com/eq/QR-9F3A21/2026-08-03/f2.jpg"
  ]
}

// Routing key: validacion.resuelta
{
  "eventId": "c1b2a3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
  "ocurridoEn": "2026-08-03T09:14:07-03:00",
  "contratacionId": "CTR-88421",
  "sospechosa": true,
  "confianza": 0.91,
  "hallazgo": "Lente frontal astillado, no declarado en la descripción"
}`, { lang: "json", label: "Interacción asincrónica" })}
        <div class="callout info">
          <p><b>Detalle que suma:</b> las fotos viajan como <b>URL</b> al object storage, no en base64. Y cada mensaje
          lleva <code>eventId</code> para que el consumidor pueda deduplicar (los brokers entregan at-least-once).</p>
        </div>

        <h2>5 · Punto 2 — Modelado de dominio</h2>

        <h3>Servicio II — Motor de Riesgo (Strategy en colección)</h3>
        ${APP.uml(`classDiagram
    class ReglaDeRiesgo {
        <<interface>>
        +aplica(ContextoDeCotizacion) boolean
        +aplicar(ContextoDeCotizacion, Monto) ResultadoDeRegla
        +nombre() String
    }
    class ZonaDeRiesgo {
        -recargo: Porcentaje
        -servicioSeguridad: ServicioDeSeguridad
    }
    class DescuentoPorProfesionalismo {
        -descuento: Porcentaje
        -sesionesRequeridas: int
    }
    class ReglaDeClima {
        -recargo: Porcentaje
        -umbralRafagas: double
        -servicioClima: ServicioDeClima
    }
    class MotorDeRiesgo {
        -reglas: List~ReglaDeRiesgo~
        +cotizar(ContextoDeCotizacion) Cotizacion
    }
    class Cotizacion {
        -primaFinal: Monto
        -aplicadas: List~ResultadoDeRegla~
    }
    class ResultadoDeRegla {
        -regla: String
        -efecto: String
        -detalle: String
    }
    class ContextoDeCotizacion {
        -valorReferencia: Monto
        -tipoEquipo: TipoDeEquipo
        -perimetro: Perimetro
        -rango: RangoHorario
        -sesionesSinIncidentes: int
    }
    class ServicioDeSeguridad { <<interface>> }
    class ServicioDeClima { <<interface>> }
    class ApiSeguridadAdapter
    class ApiClimaAdapter
    ReglaDeRiesgo <|.. ZonaDeRiesgo
    ReglaDeRiesgo <|.. DescuentoPorProfesionalismo
    ReglaDeRiesgo <|.. ReglaDeClima
    MotorDeRiesgo o-- "*" ReglaDeRiesgo
    MotorDeRiesgo ..> Cotizacion
    Cotizacion *-- "*" ResultadoDeRegla
    ReglaDeRiesgo ..> ContextoDeCotizacion
    ZonaDeRiesgo --> ServicioDeSeguridad
    ReglaDeClima --> ServicioDeClima
    ServicioDeSeguridad <|.. ApiSeguridadAdapter
    ServicioDeClima <|.. ApiClimaAdapter`, "Servicio II · Strategy + Adapter")}
        <div class="callout tip">
          <p><b>Lo que hace ganar puntos acá:</b> (1) la multiplicidad <code>*</code> entre el motor y las reglas —el
          enunciado dice “pueden aplicarse más de una”—; (2) que cada regla devuelva un <code>ResultadoDeRegla</code>,
          porque el Servicio IV necesita la <b>explicación del costo final</b> para la bitácora; (3) los dos adapters
          hacia las APIs externas, que son las que consultan las reglas.</p>
        </div>

        <h3>Servicio III — Validación Inteligente</h3>
        ${APP.uml(`classDiagram
    class SolicitudDeValidacion {
        -contratacionId: String
        -descripcionDeclarada: String
        -fotos: List~UrlFoto~
        -estado: EstadoValidacion
        +resolverCon(AnalisisDeImagen) ResultadoDeValidacion
    }
    class ResultadoDeValidacion {
        -sospechosa: boolean
        -confianza: double
        -hallazgo: String
    }
    class AnalisisDeImagen {
        -danios: List~DanioDetectado~
    }
    class DanioDetectado {
        -descripcion: String
        -confianza: double
    }
    class CriterioDeSospecha {
        -umbralConfianza: double
        +esSospechoso(DanioDetectado, String) boolean
    }
    class MotorDeReconocimiento {
        <<interface>>
        +analizar(List~UrlFoto~) AnalisisDeImagen
    }
    class IaVisionAdapter {
        -client: IaHttpClient
        +analizar(List~UrlFoto~) AnalisisDeImagen
    }
    SolicitudDeValidacion --> MotorDeReconocimiento
    SolicitudDeValidacion --> CriterioDeSospecha
    SolicitudDeValidacion ..> ResultadoDeValidacion
    MotorDeReconocimiento <|.. IaVisionAdapter
    MotorDeReconocimiento ..> AnalisisDeImagen
    AnalisisDeImagen *-- "*" DanioDetectado
    CriterioDeSospecha ..> DanioDetectado`, "Servicio III · Adapter + regla de sospecha")}
        <p>El <b>umbral del 85%</b> se modela como atributo de <code>CriterioDeSospecha</code>, no como constante
        pegada en un <code>if</code>: el enunciado sugiere que es un parámetro de negocio. Y la condición es doble
        (confianza &gt; umbral <b>y</b> el daño no está en la descripción declarada).</p>

        <h3>Servicio IV — Contrataciones (State + bitácora)</h3>
        ${APP.uml(`classDiagram
    class Contratacion {
        -codigo: CodigoContratacion
        -codigoQrEquipo: String
        -rango: RangoHorario
        -lugar: Ubicacion
        -prima: Monto
        -estado: EstadoContratacion
        -bitacora: List~EntradaDeBitacora~
        +cotizar(Cotizacion) void
        +marcarSospechosa(ResultadoDeValidacion) void
        +revisarManualmente(Operador, String) void
        +aceptar() void
        +rechazar() void
        ~transicionarA(EstadoContratacion, Actor, String) void
    }
    class EstadoContratacion {
        <<interface>>
        +aceptar(Contratacion) void
        +rechazar(Contratacion) void
        +marcarSospechosa(Contratacion) void
        +nombre() String
    }
    class EnValidacion
    class Sospechosa
    class PendienteDeAceptacion
    class Activa
    class Rechazada
    class Vencida
    class EntradaDeBitacora {
        -fecha: LocalDateTime
        -tipo: TipoDeEvento
        -detalle: String
        -actor: Actor
    }
    class CodigoContratacion {
        <<value object>>
        -valor: String
    }
    class Foto {
        -url: String
    }
    EstadoContratacion <|.. EnValidacion
    EstadoContratacion <|.. Sospechosa
    EstadoContratacion <|.. PendienteDeAceptacion
    EstadoContratacion <|.. Activa
    EstadoContratacion <|.. Rechazada
    EstadoContratacion <|.. Vencida
    Contratacion --> EstadoContratacion
    Contratacion *-- "*" EntradaDeBitacora
    Contratacion *-- "1..*" Foto
    Contratacion --> CodigoContratacion`, "Servicio IV · State + bitácora")}
        <div class="callout key">
          <div class="callout-title">🔑 Lo que casi nadie resuelve bien</div>
          <p>La <b>bitácora tiene que explicar el costo final</b>, no sólo los cambios de estado. Cuando llega la
          cotización del Servicio II, cada <code>ResultadoDeRegla</code> genera una entrada:</p>
          ${APP.code(`void cotizar(Cotizacion cotizacion) {
    this.prima = cotizacion.getPrimaFinal();
    cotizacion.getAplicadas().forEach(r ->
        bitacora.add(EntradaDeBitacora.deCosto(r.getRegla(), r.getEfecto(), r.getDetalle()))
    );
}

// La bitácora resultante dice exactamente lo que pide el enunciado:
// 09:12:44  COTIZACION      Regla ZONA_DE_RIESGO +40%  (Zona Alta Peligrosidad)
// 09:12:44  COTIZACION      Regla PROFESIONALISMO -10% (12 sesiones sin incidentes)
// 09:12:44  COTIZACION      Regla CLIMA +20%           (ráfagas 31 km/h, equipo de Vuelo)
// 09:14:07  VALIDACION      Marcada SOSPECHOSA         (IA, confianza 0.91)
// 09:31:02  REVISION_MANUAL Operador mpereyra dio fe   ("falso positivo, es un reflejo")
// 09:31:02  TRANSICION      SOSPECHOSA → PENDIENTE_DE_ACEPTACION`, { label: "Bitácora que explica el costo" })}
        </div>

        <h3>Diagrama de secuencia — camino feliz</h3>
        ${APP.uml(`sequenceDiagram
    autonumber
    actor U as Usuario
    participant S4 as Contratacion (S4)
    participant S1 as Inventario (S1)
    participant S2 as MotorDeRiesgo (S2)
    participant BR as Broker
    participant S3 as Validacion (S3)
    U->>S4: contratar(fecha, rango, lugar, QR, fotos)
    S4->>S1: GET /equipos/{qr}
    S1-->>S4: datos del equipo
    S4->>S2: cotizar(contexto)
    S2->>S2: aplicar reglas en cadena
    S2-->>S4: Cotizacion (prima + reglas aplicadas)
    S4->>S4: registrar cada regla en la bitácora
    S4->>BR: publicar validacion.solicitada
    S4-->>U: 202 · codigo + prima + EN_VALIDACION
    BR-->>S3: validacion.solicitada
    S3->>S3: analizar(fotos) vía adapter de IA
    S3->>BR: publicar validacion.resuelta (sospechosa=false)
    BR-->>S4: validacion.resuelta
    S4->>S4: transicionarA(PENDIENTE_DE_ACEPTACION)
    U->>S4: aceptar(codigo)
    S4->>S4: transicionarA(ACTIVA)
    S4-->>U: contratación activa · código para el sistema de cobros`, "Contratación exitosa")}

        <h2>6 · Punto 3 — DER físico del Servicio IV</h2>
        ${APP.uml(`erDiagram
    CONTRATACION {
        bigint  id_contratacion    PK
        varchar codigo             UK "único en todo el sistema"
        varchar codigo_qr_equipo        "ref lógica al Servicio I"
        bigint  usuario_id              "ref lógica al Servicio I"
        timestamp vigencia_desde   "NOT NULL"
        timestamp vigencia_hasta   "NOT NULL"
        decimal lat                "NOT NULL"
        decimal lng                "NOT NULL"
        int     radio_mts          "NOT NULL"
        decimal valor_referencia   "NOT NULL"
        decimal prima_final        "NOT NULL"
        varchar estado             "NOT NULL, CHECK IN (...)"
        timestamp creada_en        "NOT NULL"
    }
    FOTO_EQUIPO {
        bigint  id_foto            PK
        bigint  id_contratacion    FK "NOT NULL"
        varchar url                "NOT NULL"
        timestamp tomada_en
    }
    ENTRADA_BITACORA {
        bigint  id_entrada         PK
        bigint  id_contratacion    FK "NOT NULL"
        timestamp fecha            "NOT NULL"
        varchar tipo_evento        "NOT NULL"
        varchar detalle
        varchar actor_tipo              "USUARIO | SISTEMA | OPERADOR"
        varchar actor_id
    }
    REGLA_APLICADA {
        bigint  id_regla_aplicada  PK
        bigint  id_contratacion    FK "NOT NULL"
        varchar nombre_regla       "NOT NULL"
        decimal porcentaje         "NOT NULL"
        varchar detalle
        int     orden              "NOT NULL"
    }
    RESULTADO_VALIDACION {
        bigint  id_validacion      PK
        bigint  id_contratacion    FK "UK, NOT NULL"
        boolean sospechosa         "NOT NULL"
        decimal confianza
        varchar hallazgo
        timestamp resuelta_en
    }
    CONTRATACION ||--|{ FOTO_EQUIPO       : "1..N tiene"
    CONTRATACION ||--|{ ENTRADA_BITACORA  : "1..N registra"
    CONTRATACION ||--o{ REGLA_APLICADA    : "0..N aplicó"
    CONTRATACION ||--o| RESULTADO_VALIDACION : "0..1 se validó con"`, "DER físico · Servicio IV")}
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Decisión</th><th>Justificación</th></tr></thead>
          <tbody>
            <tr><td><code>codigo</code> con <code>UNIQUE</code></td><td>El enunciado dice “único para todo el sistema”; es la clave que consume el sistema de cobros</td></tr>
            <tr><td><code>REGLA_APLICADA</code> como tabla aparte</td><td>Hay N reglas por contratación y hay que poder <b>explicar el costo final</b>. Guardarlas como texto plano impediría consultarlas.</td></tr>
            <tr><td><code>ENTRADA_BITACORA</code> 1:N, <b>append-only</b></td><td>Trazabilidad: nunca se actualiza ni se borra. Incluye el <code>actor</code> para registrar “el operador X dio fe”.</td></tr>
            <tr><td>Fotos por URL, no BLOB</td><td>Los binarios van al object storage; la base guarda la referencia</td></tr>
            <tr><td><code>usuario_id</code> y <code>codigo_qr_equipo</code> sin FK real</td><td>Viven en la base del Servicio I: son <b>referencias lógicas</b>, no foráneas. Es el costo de la autonomía de microservicios y hay que decirlo.</td></tr>
            <tr><td>Denormalización de <code>valor_referencia</code></td><td>Se copia el valor <b>al momento de contratar</b>: si el equipo se revalúa después, la contratación no debe cambiar (snapshot histórico)</td></tr>
            <tr><td><code>RESULTADO_VALIDACION</code> 0..1</td><td>Modalidad opcional: la contratación existe antes de que la validación resuelva</td></tr>
          </tbody>
        </table></div>

        <h2>7 · Errores comunes en este final</h2>
        <ul>
          <li><b>Resolver el motor de riesgo con <code>if/else</code>.</b> El enunciado dice literalmente “a futuro pueden agregarse más”: es OCP explícito.</li>
          <li><b>Poner una sola estrategia</b> en vez de una colección, ignorando “pueden aplicarse más de una”.</li>
          <li><b>Hacer la validación de IA sincrónica.</b> Es el error más caro: se lleva los 10 puntos del punto B.</li>
          <li><b>Bitácora como un campo <code>TEXT</code></b> en la contratación. No permite consultar ni explicar el costo.</li>
          <li><b>Modelar el cobro y los siniestros.</b> El enunciado los excluye; modelarlos gasta tiempo y no suma.</li>
          <li><b>Olvidar el object storage</b> y meter las fotos en la base o en los mensajes.</li>
          <li><b>Diagramas sin protocolos</b> en las flechas.</li>
          <li><b>Responder el punto C incompleto:</b> decir “sync” sin el formato ni el mensaje de ejemplo.</li>
        </ul>

        <h2>8 · Trampas del enunciado</h2>
        <div class="trampa"><b>“El cobro se realiza por otro sistema, que sólo requiere el código de la contratación.”</b>
        Parece un detalle menor pero define dos cosas: que <b>no</b> modelás pagos, y que el código debe ser
        <code>UNIQUE</code> a nivel sistema. Es un punto del DER regalado si lo leíste.</div>
        <div class="trampa"><b>“Si la IA detecta un daño con confianza mayor al 85% <u>y la misma no se encuentra en la
        descripción</u>.”</b> Son <b>dos</b> condiciones. Muchos modelan sólo el umbral de confianza y pierden la mitad
        de la regla: hay que comparar contra la <code>descripcionDeclarada</code>.</div>
        <div class="trampa"><b>“El operador X dio fe de que era un error de la IA.”</b> Está escondido en el ejemplo de
        bitácora, pero implica que existe un <b>estado de revisión manual</b> y un <b>actor</b> responsable. Si tu State
        no contempla la intervención humana, el modelo no cubre el enunciado.</div>
        <div class="trampa"><b>“Todas lo hacen sobre el valor de referencia.”</b> Define cómo se componen las reglas:
        todos los porcentajes se aplican sobre la <b>misma base</b>, no en cascada sobre el resultado anterior.
        Es una decisión de diseño que conviene explicitar.</div>
        <div class="trampa"><b>“Se esperan picos de tráfico… eventos masivos.”</b> No alcanza con decir “uso una cola”:
        hay que explicar que la cola <b>amortigua</b> y que los consumidores escalan horizontalmente.</div>

        <h2>9 · Rúbrica autoadministrada</h2>
        <p>Resolvelo primero sin mirar, y después tildá lo que hayas cubierto.</p>
        <div id="rubProtege"></div>
      `;

      APP.rubrica(el.querySelector("#rubProtege"), "protegepro", RUBRICA);
    },
  });
})();
