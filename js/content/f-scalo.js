/* ============================================================
   Final resuelto — La Scalo App (13/07/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p>Se pide una plataforma pensada, en su primera etapa, para el cuerpo técnico de la Selección Argentina de fútbol.
    Su propósito es centralizar la gestión del plantel, el análisis táctico del rival, el seguimiento de lesiones y la
    planificación de los entrenamientos, ofreciendo recomendaciones asistidas para la toma de decisiones. Si bien nace
    para el fútbol, el sistema se concibe como <b>multideporte</b> para futuras iteraciones, y se prevé extender su uso a
    otras selecciones y clubes.</p>

    <h4>Servicio I — Gestión de Jugadores</h4>
    <p>Alta, baja y modificación de los jugadores del plantel. De cada jugador se conoce: nombre, una o más posiciones,
    altura y peso. Cada jugador posee un conjunto de <b>habilidades o características con una valoración subjetiva de 0 a
    100</b>. Este servicio expone también su <b>estado actual de lesión</b> (si está lesionado, la gravedad y el tiempo
    estimado de recuperación); el detalle y ciclo de vida de cada lesión se gestionan en otro servicio (Servicio III).</p>

    <h4>Servicio II — Análisis del Rival</h4>
    <p>A partir del nombre del rival, el servicio consulta a un <b>agente de IA especializado</b> que devuelve las
    formaciones y el estilo de juego en <b>formato JSON</b>. Sobre esa base, elabora <b>distintos tipos de recomendaciones</b>;
    el tipo <b>se decide en tiempo de ejecución según lo que solicite el usuario</b>: (a) formaciones tácticas sugeridas;
    (b) jugadas preparadas, ofensivas o defensivas; (c) los mejores jugadores del plantel para ese partido según sus
    habilidades (para ello debe contar con el plantel completo, con un máximo de 55 jugadores, <b>parametrizable</b>).
    <b>Cada tipo de recomendación es resuelto por un algoritmo distinto</b> que produce su propia descripción de texto.
    Por ahora existen las tres modalidades, pero <b>deben poder incorporarse otras sin alterar el resto del sistema</b>.</p>

    <h4>Servicio III — Gestión de Lesiones</h4>
    <p>A partir de la lesión de un jugador, determina un tratamiento y un tiempo aproximado de recuperación. Cada
    tratamiento puede incluir indicaciones de <b>medicamentos</b> (dosis y tiempo), sesiones de <b>kinesiología</b>
    (cantidad y tipo), <b>ejercicios de rehabilitación</b> (nombre, series, repeticiones y descripción) y, si se requiere,
    <b>intervención quirúrgica</b> (nombre y descripción). Gestiona el <b>ciclo de vida de la lesión</b>: inicio de
    tratamiento, evolución favorable o desfavorable, principio de recuperación y recuperación parcial o total.
    Se requiere <b>trazabilidad completa de la evolución</b>, cuyo avance determina el médico asignado a cada jugador.</p>

    <h4>Servicio IV — Gestión de Entrenamientos</h4>
    <p>A partir de un grupo de jugadores y un <b>tipo de entrenamiento</b> (ofensivo, defensivo, físico, mental o de
    habilidad específica), genera un entrenamiento con la rutina adecuada. Cada rutina se compone de ejercicios; de cada
    ejercicio se conoce: nombre, músculo, habilidad que mejora, repeticiones y series. Al finalizar, la persona a cargo
    <b>actualiza las habilidades de cada jugador</b> (0 a 100). Los entrenadores gestionan tanto las rutinas como los
    ejercicios.</p>

    <h4>Punto 1 — Arquitectura (40 pts)</h4>
    <p><b>A (15)</b> — i) Diagrama de despliegue de la solución completa (Plan 23: microservicios). El agente de IA del
    Servicio II puede <b>demorar más de un minuto</b>. ii) Cómo maneja las demoras y cómo impacta en la usabilidad.
    <b>B (15)</b> — Se prevé una app mobile y no hay equipo mobile. Proponga una arquitectura de frontend que desacople
    interfaces del backend y soporte múltiples canales. Indique si opta por cliente liviano o pesado (mantenibilidad vs
    eficiencia). <b>C (10)</b> — i) ¿Qué componente para delegar la gestión de usuarios? ¿Limitación por dominio
    institucional? ii) Para un servicio de videos de entrenamientos, ¿qué componente reduce el uso de recursos y
    transferencia del servidor de aplicación?</p>

    <h4>Punto 2 — Modelado de Dominio (30 pts)</h4>
    <p><b>A (20)</b> — Documentar, <b>únicamente de la capa de dominio</b>, los Servicios II y III, un diagrama por servicio.
    <b>B (10)</b> — Justificar.</p>

    <h4>Punto 3 — Persistencia (30 pts)</h4>
    <p><b>A (20)</b> — Modelo de datos relacional del <b>Servicio III</b>. i) Para el Servicio II, ¿qué base no relacional
    propone como alternativa? i) ¿Qué mecanismo para asegurar la confidencialidad? <b>B (10)</b> — Qué persistir,
    impedance mismatches, desnormalizaciones.</p>`;

  const RUBRICA = [
    { t: "Diagrama de despliegue microservicios con el agente de IA fuera del camino sincrónico", p: 8 },
    { t: "Expliqué el manejo de la demora (202 + async/broker) y el impacto en usabilidad", p: 6 },
    { t: "Punto B: <b>BFF + API Gateway</b>, opté por <b>cliente liviano</b> y lo justifiqué", p: 6 },
    { t: "Punto C.i: <b>IDM/SSO</b> + limitación por dominio institucional (federación con AFA)", p: 5 },
    { t: "Punto C.ii: <b>Object storage + CDN</b> para los videos", p: 5 },
    { t: "Servicio II con <b>Strategy</b> (algoritmo por tipo de recomendación) + Simple Factory", p: 8 },
    { t: "Servicio II con <b>Adapter</b> al agente de IA (traduce el JSON) y máximo parametrizable", p: 5 },
    { t: "Servicio III con <b>State</b> para el ciclo de vida de la lesión + trazabilidad", p: 8 },
    { t: "Tratamiento con sus 4 componentes (medicamentos, kinesiología, ejercicios, cirugía)", p: 6 },
    { t: "El avance de la lesión lo determina el <b>médico asignado</b> (actor en la bitácora)", p: 4 },
    { t: "No dibujé controllers/DTOs (sólo dominio)", p: 3 },
    { t: "DER Servicio III con tratamiento, componentes, estados y trazabilidad", p: 9 },
    { t: "Punto 3.A.i: base no relacional para el Servicio II con justificación (documental)", p: 5 },
    { t: "Punto 3.A.i confidencialidad: cifrado en reposo, dónde y cómo", p: 5 },
    { t: "Justifiqué impedance mismatches y desnormalizaciones", p: 5 },
    { t: "Tuve en cuenta la extensibilidad multideporte al justificar las abstracciones", p: 4 },
  ];

  D.finales.push({
    id: "f-scalo", nombre: "La Scalo App", fecha: "13/07/2026", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-scalo",
    title: "La Scalo App",
    tag: "📄",
    group: "Finales resueltos",
    resumen: "13/07/2026 · gestión deportiva",
    keywords: ["scalo", "final", "futbol", "lesiones", "entrenamientos", "rival", "ia", "recomendaciones"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Final resuelto · 13/07/2026</div>
          <h1>La Scalo App</h1>
          <p class="lead">Gestión deportiva del cuerpo técnico. Arquitectura 40 · Dominio 30 · Persistencia 30.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“se concibe como <b>multideporte</b>… otras selecciones y clubes”</td><td>Diseñar con abstracciones extensibles; buen argumento para justificar polimorfismo</td></tr>
            <tr><td>“<b>estado actual de lesión</b>” en Serv. I pero “el ciclo de vida en Serv. III”</td><td>Serv. I sólo <b>expone</b> un resumen; el detalle y State están en Serv. III</td></tr>
            <tr><td>“distintos tipos de recomendaciones… <b>algoritmo distinto</b>… <b>en tiempo de ejecución</b>… <b>sin alterar el resto</b>”</td><td><b>Strategy</b> + Simple Factory (las tres señales juntas)</td></tr>
            <tr><td>“un agente de IA… devuelve JSON”, “puede demorar más de un minuto”</td><td><b>Adapter</b> + <b>asincronismo</b></td></tr>
            <tr><td>“máximo de 55 jugadores, <b>parametrizable</b>”</td><td>No es una constante: es configuración</td></tr>
            <tr><td>“<b>ciclo de vida de la lesión</b>… inicio, evolución favorable/desfavorable…”</td><td><b>State</b></td></tr>
            <tr><td>“<b>trazabilidad completa</b>… lo determina el médico asignado”</td><td>Bitácora con actor (médico) en cada transición</td></tr>
            <tr><td>“tratamiento puede incluir medicamentos, kinesiología, ejercicios, cirugía”</td><td>Composición de componentes heterogéneos del tratamiento</td></tr>
            <tr><td>“al finalizar… <b>actualiza las habilidades</b> de cada jugador”</td><td>El entrenamiento impacta el Serv. I (evento)</td></tr>
            <tr><td>“servicio de <b>videos</b>… reducir recursos y transferencia”</td><td><b>Object storage + CDN</b></td></tr>
            <tr><td>“delegar la gestión de usuarios… <b>dominio institucional</b>”</td><td><b>IDM/SSO</b> + federación por dominio</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1.A — Despliegue y demora de la IA</h2>
        ${APP.uml(`graph TB
    WEB["🌐 Web"] --> GW["🚪 API Gateway"]
    MOB["📱 Mobile"] --> GW
    IDM["🔐 IDM/SSO<br/>federado con dominio AFA"] -.-> GW
    GW --> S1["Servicio I<br/>Jugadores"]
    GW --> S2["Servicio II<br/>Análisis del Rival"]
    GW --> S3["Servicio III<br/>Lesiones"]
    GW --> S4["Servicio IV<br/>Entrenamientos"]
    GW --> S5["Servicio de Videos"]

    S2 -->|"publica analisis.solicitado"| BR["📨 Broker"]
    BR -->|consume| WK["Worker de análisis"]
    WK -->|"HTTPS · &gt; 1 min"| IA["🤖 Agente de IA<br/>(externo)"]
    WK -->|"publica analisis.listo"| BR
    BR -->|consume| S2
    S4 -->|"HabilidadesActualizadas"| BR
    BR --> S1

    S5 --> OBJ["🗂️ Object Storage"]
    OBJ --> CDN["🌍 CDN"]
    CDN --> WEB
    CDN --> MOB

    S1 --> DB1[("DB I")]
    S2 --> DB2[("DB II<br/>documental")]
    S3 --> DB3[("DB III")]
    S4 --> DB4[("DB IV")]
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style IA fill:#f1f5f9,stroke:#64748b,color:#0f172a
    style CDN fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Despliegue microservicios")}
        <div class="callout key">
          <div class="callout-title">📝 Manejo de la demora (punto A.ii)</div>
          <p>“El análisis del rival se saca del camino sincrónico: el Servicio II publica <code>analisis.solicitado</code>
          y responde <code>202 Accepted</code> con un identificador. Un worker consume el mensaje, llama al agente de IA
          (que puede tardar más de un minuto) y publica <code>analisis.listo</code>, que el Servicio II consume para
          generar las recomendaciones.”</p>
          <p>“<b>Usabilidad:</b> el cuerpo técnico no queda bloqueado esperando frente a una pantalla congelada; ve el
          estado ‘analizando rival’ y recibe el resultado por push cuando está listo (importante en cancha, donde el
          tiempo apremia). El costo es que el resultado no es instantáneo, así que la UI debe comunicar el progreso.”</p>
        </div>

        <h2>3 · Punto 1.B y C — Frontend, usuarios y videos</h2>
        <div class="callout key">
          <div class="callout-title">📝 B — Arquitectura de frontend</div>
          <p>“<b>API Gateway + BFF por canal.</b> Opto por <b>cliente liviano</b>: la lógica de negocio queda en los
          servicios y el frontend se ocupa de presentación. Priorizo <b>mantenibilidad</b> sobre eficiencia porque no hay
          equipo mobile especializado —cuanto menos lógica haya que replicar en la app, más barato incorporarla— y porque
          evita duplicar reglas entre web y mobile, que se desincronizarían. La eficiencia se recupera con caché en el BFF
          y contenido estático por CDN.”</p>
        </div>
        <div class="callout key">
          <div class="callout-title">📝 C.i — Gestión de usuarios</div>
          <p>“Un <b>IDM con SSO</b> (Keycloak/Auth0), con el token validado en el API Gateway. <b>Sí</b> conviene limitar el
          acceso por <b>dominio institucional</b>: se federa el IDM con el directorio de la AFA/institución para que sólo
          ingresen cuentas de ese dominio, y se combina con <b>RBAC</b> para separar cuerpo técnico, médicos y
          administradores. Así el alta y baja de usuarios la gestiona la institución, no nuestro sistema.”</p>
        </div>
        <div class="callout key">
          <div class="callout-title">📝 C.ii — Videos</div>
          <p>“<b>Object storage (S3) + CDN.</b> El servidor de aplicación nunca sirve el binario del video: sólo entrega
          una <b>URL firmada</b>. El object storage almacena los archivos fuera de la base y el CDN los disponibiliza
          desde el nodo más cercano, reduciendo drásticamente el uso de recursos y la transferencia del servidor de
          aplicación —que es exactamente lo que pide el enunciado.”</p>
        </div>

        <h2>4 · Punto 2 — Servicio II (Strategy + Adapter)</h2>
        ${APP.uml(`classDiagram
    class AnalizadorDeRival {
        -maxJugadores: int
        +recomendar(Rival, TipoRecomendacion, Plantel) Recomendacion
    }
    class EstrategiaDeRecomendacion {
        <<interface>>
        +generar(AnalisisDelRival, Plantel) Recomendacion
        +tipo() TipoRecomendacion
    }
    class FormacionesSugeridas
    class JugadasPreparadas
    class MejoresJugadores {
        -maxJugadores: int
    }
    class FabricaDeEstrategias {
        +para(TipoRecomendacion) EstrategiaDeRecomendacion
    }
    class AnalisisDelRival {
        -formaciones: List~Formacion~
        -estiloDeJuego: String
    }
    class Recomendacion {
        -tipo: TipoRecomendacion
        -descripcion: String
    }
    class AgenteDeAnalisis {
        <<interface>>
        +analizar(String) AnalisisDelRival
    }
    class AgenteIaAdapter {
        -client: IaHttpClient
        +analizar(String) AnalisisDelRival
    }
    class TipoRecomendacion {
        <<enumeration>>
        FORMACION
        JUGADAS
        MEJORES_JUGADORES
    }
    EstrategiaDeRecomendacion <|.. FormacionesSugeridas
    EstrategiaDeRecomendacion <|.. JugadasPreparadas
    EstrategiaDeRecomendacion <|.. MejoresJugadores
    AnalizadorDeRival --> AgenteDeAnalisis
    AnalizadorDeRival --> FabricaDeEstrategias
    FabricaDeEstrategias ..> EstrategiaDeRecomendacion
    EstrategiaDeRecomendacion ..> AnalisisDelRival
    EstrategiaDeRecomendacion ..> Recomendacion
    AgenteDeAnalisis <|.. AgenteIaAdapter
    AgenteDeAnalisis ..> AnalisisDelRival`, "Servicio II · Strategy + Factory + Adapter")}
        <div class="callout key">
          <div class="callout-title">🔑 Los tres patrones juntos</div>
          <p><b>Strategy:</b> cada tipo de recomendación es un algoritmo distinto detrás de
          <code>EstrategiaDeRecomendacion</code>. El enunciado dice “sin alterar el resto del sistema” → OCP: sumar
          “Análisis de arqueros rivales” es una clase nueva.</p>
          <p><b>Simple Factory:</b> como el tipo “se decide en tiempo de ejecución según lo que solicite el usuario”, una
          <code>FabricaDeEstrategias</code> instancia la estrategia según el pedido. Strategy y Factory se complementan.</p>
          <p><b>Adapter:</b> <code>AgenteIaAdapter</code> traduce el <b>JSON del agente de IA</b> a un
          <code>AnalisisDelRival</code> del dominio, así las estrategias no dependen del formato del tercero.</p>
          <p>Y el <b>máximo de 55 jugadores parametrizable</b> es el atributo <code>maxJugadores</code>, no una constante.</p>
        </div>

        <h2>5 · Punto 2 — Servicio III (State + tratamiento)</h2>
        ${APP.uml(`classDiagram
    class Lesion {
        -jugadorId: JugadorRef
        -gravedad: Gravedad
        -tiempoEstimado: Duration
        -estado: EstadoLesion
        -tratamiento: Tratamiento
        -medicoAsignado: Medico
        -trazabilidad: List~EventoDeEvolucion~
        +evolucionarFavorable(Medico, String) void
        +evolucionarDesfavorable(Medico, String) void
        +recuperar(Medico, TipoRecuperacion) void
        ~transicionarA(EstadoLesion, Medico, String) void
    }
    class EstadoLesion {
        <<interface>>
        +evolucionarFavorable(Lesion, Medico, String) void
        +evolucionarDesfavorable(Lesion, Medico, String) void
        +recuperar(Lesion, Medico, TipoRecuperacion) void
        +nombre() String
    }
    class InicioDeTratamiento
    class EnEvolucion
    class PrincipioDeRecuperacion
    class RecuperadaParcial
    class RecuperadaTotal
    class Tratamiento {
        +duracionEstimada() Duration
    }
    class ComponenteDeTratamiento {
        <<abstract>>
        -descripcion: String
    }
    class Medicamento { -dosis: String; -tiempo: String }
    class SesionKinesiologia { -cantidad: int; -tipo: String }
    class EjercicioRehabilitacion { -nombre: String; -series: int; -repeticiones: int }
    class IntervencionQuirurgica { -nombre: String }
    class EventoDeEvolucion {
        -fecha: LocalDateTime
        -estadoAnterior: String
        -estadoNuevo: String
        -observacion: String
        -medico: Medico
    }
    class Medico { -nombre: String; -matricula: String }
    EstadoLesion <|.. InicioDeTratamiento
    EstadoLesion <|.. EnEvolucion
    EstadoLesion <|.. PrincipioDeRecuperacion
    EstadoLesion <|.. RecuperadaParcial
    EstadoLesion <|.. RecuperadaTotal
    Lesion --> EstadoLesion
    Lesion "1" *-- "1" Tratamiento
    Lesion "1" *-- "*" EventoDeEvolucion
    Lesion --> "1" Medico : asignado
    Tratamiento "1" *-- "*" ComponenteDeTratamiento
    ComponenteDeTratamiento <|-- Medicamento
    ComponenteDeTratamiento <|-- SesionKinesiologia
    ComponenteDeTratamiento <|-- EjercicioRehabilitacion
    ComponenteDeTratamiento <|-- IntervencionQuirurgica
    EventoDeEvolucion --> Medico`, "Servicio III · State + componentes de tratamiento")}
        <div class="callout tip">
          <p><b>Dos decisiones clave:</b> (1) el <b>ciclo de vida</b> se modela con State y las transiciones sólo las
          dispara el <code>medicoAsignado</code>, que queda registrado en cada <code>EventoDeEvolucion</code> — así se
          cumple la <b>trazabilidad completa</b>. (2) El tratamiento es una <b>composición de componentes heterogéneos</b>
          (medicamentos, kinesiología, ejercicios, cirugía) bajo una abstracción común: es la forma limpia de que
          “<i>puede incluir</i>” cualquier combinación de ellos.</p>
        </div>

        <h2>6 · Punto 3 — Persistencia</h2>
        <h3>DER — Servicio III</h3>
        ${APP.uml(`erDiagram
    LESION {
        bigint  id_lesion       PK
        bigint  id_jugador         "ref lógica a Servicio I, NOT NULL"
        bigint  id_medico       FK "NOT NULL"
        varchar gravedad        "NOT NULL"
        int     tiempo_estimado_dias
        varchar estado          "NOT NULL CHECK IN (...)"
        timestamp inicio        "NOT NULL"
    }
    MEDICO {
        bigint  id_medico       PK
        varchar nombre          "NOT NULL"
        varchar matricula       "UK NOT NULL"
    }
    TRATAMIENTO {
        bigint  id_tratamiento  PK
        bigint  id_lesion       FK "UK NOT NULL"
        int     duracion_estimada_dias
    }
    COMPONENTE_TRATAMIENTO {
        bigint  id_componente   PK
        bigint  id_tratamiento  FK "NOT NULL"
        varchar tipo            "NOT NULL CHECK IN (MEDICAMENTO, KINESIOLOGIA, EJERCICIO, CIRUGIA)"
        varchar descripcion
        varchar dosis                "sólo MEDICAMENTO"
        varchar tiempo               "sólo MEDICAMENTO"
        int     cantidad             "KINESIOLOGIA / EJERCICIO"
        varchar tipo_kinesio         "sólo KINESIOLOGIA"
        varchar nombre               "EJERCICIO / CIRUGIA"
        int     series               "sólo EJERCICIO"
        int     repeticiones         "sólo EJERCICIO"
    }
    EVENTO_EVOLUCION {
        bigint  id_evento       PK
        bigint  id_lesion       FK "NOT NULL"
        bigint  id_medico       FK "NOT NULL - quien determinó el avance"
        timestamp fecha         "NOT NULL"
        varchar estado_anterior "NOT NULL"
        varchar estado_nuevo    "NOT NULL"
        varchar observacion
    }
    MEDICO   ||--o{ LESION            : "atiende"
    LESION   ||--|| TRATAMIENTO       : "1:1 tiene"
    TRATAMIENTO ||--|{ COMPONENTE_TRATAMIENTO : "1..N"
    LESION   ||--|{ EVENTO_EVOLUCION  : "1..N trazabilidad"
    MEDICO   ||--o{ EVENTO_EVOLUCION  : "determina"`, "DER · Servicio III")}
        <div class="callout info">
          <p><b>Mapeo de la herencia de <code>ComponenteDeTratamiento</code>:</b> elegí <b>Single Table</b> con
          discriminador <code>tipo</code>. Los cuatro subtipos tienen pocos atributos y muchos se solapan
          (descripción, nombre, cantidad), así que el costo en nulls es bajo y evita cuatro joins al armar un tratamiento.
          Si los subtipos crecieran mucho, migraría a Joined. <b>Justificar la elección es lo que puntúa</b>, no cuál elegís.</p>
        </div>

        <h3>Servicio II — base no relacional y confidencialidad</h3>
        <div class="callout key">
          <p><b>i) No relacional:</b> “Para el Servicio II propongo una base <b>documental</b> (MongoDB). La respuesta del
          agente de IA es un JSON de <b>estructura variable</b> —formaciones, estilo de juego, métricas que pueden cambiar
          entre versiones del agente— que se consulta completo por rival y no tiene relaciones que recorrer. Guardarlo en
          tablas obligaría a una columna por campo posible (mar de nulls) y a migrar el esquema cada vez que la IA cambia
          su salida. También conviene una caché clave-valor por rival con TTL, dado que el análisis es costoso.”</p>
          <p><b>i) Confidencialidad:</b> “Datos médicos y de rendimiento son sensibles. <b>Cifrado en reposo</b> a nivel de
          columna (AES-256) para los campos clínicos de las lesiones, con claves en un <b>KMS externo</b> y rotación; disco
          cifrado (TDE) para el resto; control de acceso por rol (sólo el cuerpo médico ve el detalle clínico) y los videos
          en object storage cifrado con URLs firmadas.”</p>
        </div>
        <p><b>Impedance mismatches:</b> herencia de componentes → Single Table; State de la lesión → columna <code>varchar</code>
        con CHECK reconstruida al hidratar; colecciones (componentes, eventos) → tablas hijas; referencia al jugador → lógica
        sin FK (vive en el Servicio I). <b>Desnormalización:</b> el Servicio I mantiene un resumen del estado de lesión
        (lesionado sí/no, gravedad, días) actualizado por evento desde el Servicio III, para exponerlo sin llamar al III en
        cada consulta de disponibilidad.</p>

        <h2>7 · Errores comunes</h2>
        <ul>
          <li><b>Resolver el Servicio II con <code>if</code> por tipo de recomendación</b>, ignorando “sin alterar el resto”.</li>
          <li><b>No usar Adapter</b> para el agente de IA y manipular su JSON en el dominio.</li>
          <li><b>Duplicar el detalle de la lesión</b> en el Servicio I en vez de exponer sólo un resumen.</li>
          <li><b>Máximo de 55 como constante</b>, cuando dice “parametrizable”.</li>
          <li><b>Tratamiento con cuatro atributos sueltos</b> en vez de una composición de componentes.</li>
          <li><b>Guardar los videos en la base.</b></li>
          <li><b>Olvidar el actor (médico)</b> en la trazabilidad de la lesión.</li>
          <li><b>Dibujar controllers/DTOs</b> en un punto que pide sólo dominio.</li>
        </ul>

        <h2>8 · Trampas del enunciado</h2>
        <div class="trampa"><b>“El detalle y ciclo de vida de cada lesión se gestionan en otro servicio.”</b> El Servicio I
        <b>no</b> modela el State de la lesión: sólo expone un resumen (lesionado, gravedad, días). El ciclo de vida vive
        en el III. Confundir esto duplica responsabilidades entre servicios.</div>
        <div class="trampa"><b>“Se decide en tiempo de ejecución según lo que solicite el usuario.”</b> Esta frase pide
        explícitamente la <b>Factory</b> además del Strategy: no alcanza con las estrategias, hay que decir quién elige cuál.</div>
        <div class="trampa"><b>“Máximo de 55 jugadores, aunque dicho máximo es parametrizable.”</b> Si lo hardcodeás, no
        cumplís el requerimiento. Es un atributo de configuración.</div>
        <div class="trampa"><b>“Se concibe como multideporte para futuras iteraciones.”</b> No hay que modelar otros
        deportes ahora, pero sí es un <b>argumento a favor</b> de diseñar con abstracciones (posiciones, habilidades,
        tipos de entrenamiento) en vez de valores fijos de fútbol. Mencionarlo en la justificación suma.</div>
        <div class="trampa"><b>“Al finalizar cada entrenamiento… actualizar las habilidades de cada jugador.”</b> El
        Servicio IV impacta el estado del Servicio I: es una interacción entre servicios (evento
        <code>HabilidadesActualizadas</code>) que conviene mostrar.</div>

        <h2>9 · Rúbrica autoadministrada</h2>
        <div id="rubScalo"></div>
      `;

      APP.rubrica(el.querySelector("#rubScalo"), "scalo", RUBRICA);
    },
  });
})();
