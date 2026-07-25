/* ============================================================
   Final resuelto — Talentia (20/05/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p><b>Talentia</b> es una plataforma orientada a acompañar a las personas en el desarrollo de su recorrido vocacional,
    académico y profesional, consolidando toda su información en un <b>perfil dinámico y evolutivo</b>. Permite gestionar
    intereses, estudios, experiencias y competencias con diferentes niveles de validación y, en función de ello, ofrecer
    recomendaciones. Asimismo, posibilita la postulación a búsquedas laborales, asegurando la trazabilidad de cada proceso.</p>

    <h4>Servicio I — Servicio de Perfiles</h4>
    <p>Administra la información que compone la trayectoria del usuario a lo largo del tiempo. El perfil <b>no es estático,
    evoluciona</b> a medida que el usuario incorpora o valida información. Además de datos personales, se compone de
    <b>cinco tipos de elementos</b>: formación académica, experiencia laboral, habilidades, intereses y preferencias de
    carrera. Cada tipo posee atributos propios según su naturaleza, pero <b>todos comparten un nivel de validación</b>
    (declarado, verificado, certificado) que evoluciona a medida que el usuario aporta evidencia documental. Al subir
    documentación se pasa automáticamente de “Declarado” a “Verificado”. El nivel “Certificado” aplica únicamente a
    elementos que puedan ser corroborados por una <b>entidad externa</b> (títulos, cursos, experiencias) y requiere la
    confirmación de un representante de dicha entidad emisora.</p>
    <p>El servicio mantiene un <b>historial de cambios significativos</b> (altas, cambios de nivel de validación,
    modificaciones sustanciales), lo que permite reconstruir la evolución del perfil. Expone consultas sobre el estado
    actual completo o parcial del perfil, y sobre el historial de un elemento particular.</p>

    <h4>Servicio II — Servicio de Recomendaciones</h4>
    <p>Genera recomendaciones personalizadas de formación, empleo y mejoras del perfil, en base a la compatibilidad con
    el perfil, las preferencias y datos del mercado laboral, incorporando indicadores de empleabilidad y tendencias
    obtenidas de plataformas como <b>Glassdoor u OpenQube</b>.</p>

    <h4>Servicio III — Postulaciones</h4>
    <p>Administra la interacción entre usuarios y empresas en torno a oportunidades laborales. Las oportunidades pueden
    originarse de dos fuentes: <b>integración con plataformas externas</b> como LinkedIn o Sherlock, o <b>carga directa</b>
    por parte de una empresa. Para evitar duplicados, cada oportunidad registra su origen y un identificador externo.</p>
    <p>La postulación puede iniciarla el usuario (estado inicial “Postulado”) o la empresa (estado inicial “Contactado”).
    <b>El ciclo de vida avanza</b> a “En Proceso”, “Entrevista Pactada” y “Oferta”. Los estados finales pueden ser
    “Aceptado” o “Rechazado”. Para postularse, el usuario utiliza <b>su perfil del momento</b>, por lo que la postulación
    <b>no debe verse afectada por cambios posteriores en el perfil</b>. Cada postulación tiene una <b>bitácora de entradas</b>
    que registra cambios de estado y notas internas, con fecha y actor responsable.</p>

    <h4>Punto 1 — Arquitectura (40 pts)</h4>
    <p><b>A (15)</b> — El Servicio II presenta tiempos de respuesta elevados, generando <b>timeouts</b> al ser invocado por
    otros servicios. Analice causas y proponga una solución arquitectónica: qué cambios haría en la interacción, qué
    componentes agregaría, cómo impacta.</p>
    <p><b>B (15)</b> — Diagrama de despliegue con la interacción entre los Servicios I, II y III, los externos y los
    componentes intermedios del punto anterior.</p>
    <p><b>C (10)</b> — Plan 23: ¿qué mecanismo de seguridad implementaría para brindar <b>confidencialidad en los datos
    almacenados</b>? ¿Dónde y cómo?</p>

    <h4>Punto 2 — Modelado de Dominio (30 pts)</h4>
    <p><b>A (20)</b> — Documentar, <b>únicamente de la capa de dominio</b>, los Servicios I y III, un diagrama por servicio.
    <b>B (10)</b> — Justificar las decisiones de diseño.</p>

    <h4>Punto 3 — Persistencia (30 pts)</h4>
    <p><b>A (10)</b> — En qué servicios propone persistencia no relacional, con el tipo y su justificación.
    <b>B (15)</b> — Modelo de datos relacional del <b>Servicio I</b>. <b>C (5)</b> — Qué persistir, impedance mismatches,
    desnormalizaciones.</p>`;

  const RUBRICA = [
    { t: "Punto 1.A: identifiqué que la causa es la <b>invocación sincrónica</b> a un servicio lento", p: 5 },
    { t: "Propuse desacoplar: cálculo <b>asincrónico + caché/precálculo</b> de recomendaciones", p: 6 },
    { t: "Expliqué el impacto (los otros servicios dejan de bloquearse; frescura vs latencia)", p: 4 },
    { t: "Diagrama de despliegue con Servicios I, II, III, externos y componentes intermedios", p: 8 },
    { t: "Punto 1.C: <b>cifrado en reposo</b> (AES a nivel columna) con claves en KMS, dije dónde y cómo", p: 8 },
    { t: "Servicio I: <b>clase abstracta</b> ElementoDePerfil con 5 subtipos", p: 8 },
    { t: "El nivel de validación y el <b>historial</b> están en la clase abstracta (compartidos)", p: 6 },
    { t: "Modelé la regla del nivel Certificado (sólo para elementos corroborables por entidad externa)", p: 5 },
    { t: "Servicio III: <b>State</b> para el ciclo de vida de la postulación con 2 estados iniciales", p: 8 },
    { t: "Resolví el <b>snapshot del perfil</b> al postularse (no se afecta por cambios posteriores)", p: 8 },
    { t: "Modelé Oportunidad con origen + id externo para evitar duplicados", p: 5 },
    { t: "Bitácora de postulación con fecha y actor responsable", p: 5 },
    { t: "No dibujé controllers/DTOs (el punto pide sólo dominio)", p: 3 },
    { t: "Punto 3.A: no relacional donde corresponde, con tipo y justificación", p: 6 },
    { t: "DER del Servicio I con la herencia mapeada y justificada, PK/FK/cardinalidad/modalidad", p: 8 },
    { t: "Justifiqué el uso de <b>clase abstracta y no interfaz</b> (estado + comportamiento compartido)", p: 5 },
  ];

  D.finales.push({
    id: "f-talentia", nombre: "Talentia", fecha: "20/05/2026", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-talentia",
    title: "Talentia",
    tag: "📄",
    group: "Finales resueltos",
    resumen: "20/05/2026 · trayectoria profesional",
    keywords: ["talentia", "final", "perfil", "postulacion", "recomendaciones", "snapshot", "herencia"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Final resuelto · 20/05/2026</div>
          <h1>Talentia</h1>
          <p class="lead">Plataforma de trayectoria profesional. Arquitectura 40 · Dominio 30 · Persistencia 30.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“cinco tipos de elementos… <b>todos comparten un nivel de validación</b>”</td><td><b>Clase abstracta</b> (estado + comportamiento compartido), no interfaz</td></tr>
            <tr><td>“cada tipo posee <b>atributos propios</b>”</td><td>Herencia: cada subtipo agrega sus atributos</td></tr>
            <tr><td>“al subir documentación pasa de Declarado a Verificado”</td><td>Comportamiento compartido: <code>adjuntarEvidencia()</code> en la abstracta</td></tr>
            <tr><td>“Certificado <b>sólo</b> para elementos corroborables por entidad externa”</td><td>Regla que no vale para todos los subtipos → método sobrescribible</td></tr>
            <tr><td>“historial de cambios significativos”</td><td>Colección de <code>EntradaDeHistorial</code> por elemento</td></tr>
            <tr><td>“estado inicial Postulado <b>o</b> Contactado”, “el ciclo de vida avanza”</td><td><b>State</b> con dos entradas al ciclo</td></tr>
            <tr><td>“utiliza <b>su perfil del momento</b>… no se ve afectada por cambios posteriores”</td><td><b>Snapshot</b> del perfil (copia inmutable), no una referencia viva</td></tr>
            <tr><td>“origen y un <b>identificador externo</b>… para evitar duplicados”</td><td>Restricción de unicidad por (origen, idExterno)</td></tr>
            <tr><td>“LinkedIn o Sherlock”, “Glassdoor u OpenQube”</td><td><b>Adapter</b> por integración externa</td></tr>
            <tr><td>“tiempos de respuesta elevados… <b>timeouts</b>”</td><td>Desacoplar la invocación sincrónica (async + caché)</td></tr>
            <tr><td>“confidencialidad en los datos <b>almacenados</b>”</td><td><b>Cifrado en reposo</b>, no TLS</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1.A y B — El Servicio II lento</h2>
        ${APP.uml(`graph TB
    S1["Servicio I<br/>Perfiles"] -->|evento PerfilActualizado| BR["📨 Broker"]
    S3["Servicio III<br/>Postulaciones"] -.->|"ya NO invoca sync"| S2
    BR -->|"recalcular async"| S2["Servicio II<br/>Recomendaciones"]
    S2 --> CACHE[("⚡ Recomendaciones<br/>precalculadas (TTL)")]
    CONSUMER["Otros servicios / UI"] -->|"lee del caché (rápido)"| CACHE
    S2 -->|HTTPS| GD["🌐 Glassdoor"]
    S2 -->|HTTPS| OQ["🌐 OpenQube"]
    style S2 fill:#fffbeb,stroke:#b45309,color:#0f172a
    style CACHE fill:#ecfdf5,stroke:#059669,color:#0f172a`, "Desacoplar el servicio lento")}
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo del punto A</div>
          <p>“<b>Causa:</b> el Servicio II se invoca de forma <b>sincrónica</b> y su procesamiento es intrínsecamente lento
          (integra datos de mercado de Glassdoor/OpenQube y cruza todo el perfil). Cualquier servicio que lo llame en
          línea queda bloqueado y termina en timeout; además, un pico en las recomendaciones afecta a los que las piden.”</p>
          <p>“<b>Solución:</b> desacoplar. Las recomendaciones se <b>precalculan de forma asincrónica</b> y se sirven desde
          una <b>caché/vista materializada</b>. En lugar de invocar al Servicio II en el momento, los consumidores leen el
          resultado ya calculado (respuesta en milisegundos). El recálculo se dispara por <b>evento</b> —cuando el perfil
          cambia significativamente (<code>PerfilActualizado</code>)— y/o por un <b>cron</b> que refresca los datos de
          mercado. Se agrega un <b>broker</b> para los eventos y un <b>almacén de recomendaciones</b> con TTL.”</p>
          <p>“<b>Impacto:</b> los servicios que consumen recomendaciones dejan de bloquearse y de sufrir timeouts; el
          Servicio II escala por su cuenta sin arrastrar al resto. El trade-off es la <b>frescura</b>: las recomendaciones
          pueden estar levemente desactualizadas, lo cual es aceptable en este dominio (una recomendación de empleo no
          necesita reflejar un cambio de perfil al segundo).”</p>
        </div>

        <h2>3 · Punto 1.C — Confidencialidad en reposo</h2>
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <p>“La pregunta es sobre datos <b>almacenados</b>, así que TLS/HTTPS no alcanza (eso protege el tránsito).
          Propongo <b>cifrado en reposo</b>:</p>
          <ul>
            <li><b>Qué:</b> los campos sensibles del perfil —documentos de identidad, evidencia documental subida,
            eventualmente datos de contacto y salariales.</li>
            <li><b>Cómo:</b> cifrado <b>a nivel de columna</b> con AES-256 para esos campos, y cifrado de disco (TDE)
            para el resto de la base como defensa en profundidad.</li>
            <li><b>Dónde viven las claves:</b> en un <b>KMS / Vault externo</b>, nunca en el mismo motor que los datos ni
            en el código. Con rotación periódica de claves.</li>
            <li><b>Complementos:</b> control de acceso por rol al esquema, <b>enmascaramiento</b> de datos en ambientes de
            prueba, y los documentos subidos en un <b>object storage cifrado</b> con URLs firmadas y de expiración corta.</li>
          </ul>
          <p>“Los hashes <b>no</b> aplican acá porque los datos hay que poder <i>leerlos</i>; el hash es irreversible y
          sólo sirve para contraseñas o verificación de integridad.”</p>
        </div>

        <h2>4 · Punto 2 — Servicio I (herencia + historial)</h2>
        ${APP.uml(`classDiagram
    class Usuario {
        -datosPersonales: DatosPersonales
        -perfil: Perfil
    }
    class Perfil {
        -elementos: List~ElementoDePerfil~
        +agregar(ElementoDePerfil) void
        +estadoActual() List~ElementoDePerfil~
        +estadoParcial(TipoDeElemento) List~ElementoDePerfil~
    }
    class ElementoDePerfil {
        <<abstract>>
        -nivel: NivelDeValidacion
        -historial: List~EntradaDeHistorial~
        -creadoEn: LocalDateTime
        +adjuntarEvidencia(Documento) void
        +certificar(RepresentanteDeEntidad) void
        +esCertificable()* boolean
        +registrarCambio(TipoDeCambio, String) void
    }
    class FormacionAcademica {
        -institucion: String
        -titulo: String
        -anio: int
    }
    class ExperienciaLaboral {
        -empresa: String
        -puesto: String
        -desde: YearMonth
        -hasta: YearMonth
    }
    class Habilidad { -nombre: String; -nivelAutopercibido: int }
    class Interes { -tema: String }
    class PreferenciaDeCarrera { -descripcion: String; -prioridad: int }
    class NivelDeValidacion {
        <<enumeration>>
        DECLARADO
        VERIFICADO
        CERTIFICADO
    }
    class EntradaDeHistorial {
        -fecha: LocalDateTime
        -tipo: TipoDeCambio
        -detalle: String
    }
    class Documento { -url: String; -tipo: String }
    Usuario "1" *-- "1" Perfil
    Perfil "1" *-- "*" ElementoDePerfil
    ElementoDePerfil <|-- FormacionAcademica
    ElementoDePerfil <|-- ExperienciaLaboral
    ElementoDePerfil <|-- Habilidad
    ElementoDePerfil <|-- Interes
    ElementoDePerfil <|-- PreferenciaDeCarrera
    ElementoDePerfil --> NivelDeValidacion
    ElementoDePerfil "1" *-- "*" EntradaDeHistorial`, "Servicio I")}
        <div class="callout key">
          <div class="callout-title">🔑 Clase abstracta y no interfaz — el punto de justificación</div>
          <p>“Modelé <code>ElementoDePerfil</code> como <b>clase abstracta</b> porque los cinco tipos comparten
          <b>estado</b> (el nivel de validación, el historial, la fecha de alta) <b>y comportamiento</b>
          (<code>adjuntarEvidencia()</code> lleva de Declarado a Verificado exactamente igual para todos). Con una interfaz
          habría que <b>duplicar</b> ese código y ese estado en cinco clases.”</p>
          <p>“La regla del nivel <b>Certificado</b> —que sólo aplica a elementos corroborables por una entidad externa— se
          resuelve con un método <code>esCertificable()</code> que la abstracta declara y cada subtipo define: devuelve
          <code>true</code> en <code>FormacionAcademica</code> y <code>ExperienciaLaboral</code>, y <code>false</code> en
          <code>Habilidad</code>, <code>Interes</code> y <code>PreferenciaDeCarrera</code>. Así <code>certificar()</code>
          valida esa condición sin un <code>instanceof</code>.”</p>
        </div>
        ${APP.code(`abstract class ElementoDePerfil {
    protected NivelDeValidacion nivel = NivelDeValidacion.DECLARADO;
    protected final List<EntradaDeHistorial> historial = new ArrayList<>();

    // Comportamiento compartido: igual para los 5 tipos
    public void adjuntarEvidencia(Documento doc) {
        if (nivel == NivelDeValidacion.DECLARADO) {
            nivel = NivelDeValidacion.VERIFICADO;
            registrarCambio(TipoDeCambio.CAMBIO_DE_NIVEL, "Declarado → Verificado");
        }
    }

    public void certificar(RepresentanteDeEntidad rep) {
        if (!esCertificable())
            throw new NoEsCertificable(getClass().getSimpleName());
        if (nivel != NivelDeValidacion.VERIFICADO)
            throw new RequiereVerificacionPrevia();
        nivel = NivelDeValidacion.CERTIFICADO;
        registrarCambio(TipoDeCambio.CAMBIO_DE_NIVEL, "Certificado por " + rep.getEntidad());
    }

    protected abstract boolean esCertificable();   // cada subtipo lo define
}

class FormacionAcademica extends ElementoDePerfil {
    protected boolean esCertificable() { return true; }   // un título se certifica
}
class Interes extends ElementoDePerfil {
    protected boolean esCertificable() { return false; }  // un interés no
}`, { variant: "good", label: "✅ Estado y comportamiento compartido en la abstracta" })}

        <h2>5 · Punto 2 — Servicio III (State + snapshot)</h2>
        ${APP.uml(`classDiagram
    class Postulacion {
        -perfilSnapshot: PerfilSnapshot
        -estado: EstadoPostulacion
        -bitacora: List~EntradaDeBitacora~
        +avanzar(Actor, String) void
        +rechazar(Actor, String) void
        +aceptar(Actor, String) void
        ~transicionarA(EstadoPostulacion, Actor, String) void
    }
    class EstadoPostulacion {
        <<interface>>
        +avanzar(Postulacion, Actor, String) void
        +rechazar(Postulacion, Actor, String) void
        +aceptar(Postulacion, Actor, String) void
        +nombre() String
    }
    class Postulado
    class Contactado
    class EnProceso
    class EntrevistaPactada
    class Oferta
    class Aceptado
    class Rechazado
    class PerfilSnapshot {
        <<value object · inmutable>>
        -tomadoEn: LocalDateTime
        -elementos: List~ElementoSnapshot~
    }
    class Oportunidad {
        -titulo: String
        -origen: OrigenOportunidad
        -idExterno: String
    }
    class Empresa
    class Usuario
    class EntradaDeBitacora {
        -fecha: LocalDateTime
        -tipo: TipoEntrada
        -nota: String
        -actor: Actor
    }
    class OrigenOportunidad {
        <<enumeration>>
        CARGA_DIRECTA
        LINKEDIN
        SHERLOCK
    }
    EstadoPostulacion <|.. Postulado
    EstadoPostulacion <|.. Contactado
    EstadoPostulacion <|.. EnProceso
    EstadoPostulacion <|.. EntrevistaPactada
    EstadoPostulacion <|.. Oferta
    EstadoPostulacion <|.. Aceptado
    EstadoPostulacion <|.. Rechazado
    Postulacion --> EstadoPostulacion
    Postulacion "1" *-- "1" PerfilSnapshot
    Postulacion "1" *-- "*" EntradaDeBitacora
    Postulacion --> "1" Oportunidad
    Postulacion --> "1" Usuario
    Oportunidad --> OrigenOportunidad
    Oportunidad --> "0..1" Empresa : cargada por`, "Servicio III")}
        <div class="callout key">
          <div class="callout-title">🔑 El snapshot — el detalle que define este servicio</div>
          <p>“El enunciado dice que la postulación usa <b>el perfil del momento</b> y <b>no debe verse afectada por cambios
          posteriores</b>. Eso descarta modelar una referencia viva al perfil (<code>Postulacion --> Perfil</code>): si el
          usuario después edita su perfil, la postulación cambiaría retroactivamente.”</p>
          <p>“La solución es un <b>snapshot inmutable</b>: al postularse se copia el estado relevante del perfil en un
          <code>PerfilSnapshot</code> (value object) que queda congelado dentro de la postulación. Es la misma idea que el
          precio de un pedido: se guarda el valor al momento de la operación, no una referencia al catálogo que puede
          cambiar.”</p>
        </div>
        <p>Los <b>dos estados iniciales</b> (<code>Postulado</code> si la inicia el usuario, <code>Contactado</code> si la
        inicia la empresa) confluyen en el mismo ciclo: ambos pueden avanzar a <code>EnProceso</code>. Modelar las dos
        entradas al ciclo demuestra que leíste esa distinción.</p>

        <h2>6 · Punto 3 — Persistencia</h2>
        <h3>A · No relacional</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Tipo</th><th>Justificación</th></tr></thead>
          <tbody>
            <tr><td>Recomendaciones (Servicio II)</td><td><b>Documental</b> + caché <b>clave-valor</b> (Redis) con TTL</td><td>Documento por usuario, estructura variable, se lee completo y con vencimiento (lo del punto 1.A)</td></tr>
            <tr><td>Datos de mercado de Glassdoor/OpenQube</td><td><b>Documental</b></td><td>JSON heterogéneo de terceros que cambia de forma; no hay relaciones que recorrer</td></tr>
            <tr><td>Snapshots de perfil (Servicio III)</td><td><b>Documental</b></td><td>Es una foto autocontenida e inmutable: encaja perfecto como documento embebido y no requiere joins</td></tr>
            <tr><td>Historial / bitácoras</td><td><b>Documental</b> o motor de búsqueda</td><td>Append-only, alto volumen, consultas por rango y texto</td></tr>
          </tbody>
        </table></div>
        <p><b>Lo que queda en relacional:</b> el perfil actual (Servicio I) y las postulaciones/oportunidades (Servicio III),
        porque tienen integridad referencial, reglas transaccionales y se consultan de forma estructurada.</p>

        <h3>B · DER — Servicio I (mapeo de la herencia)</h3>
        ${APP.uml(`erDiagram
    USUARIO {
        bigint  id_usuario  PK
        varchar nombre      "NOT NULL"
        varchar apellido    "NOT NULL"
        varchar email       "UK"
    }
    ELEMENTO_PERFIL {
        bigint  id_elemento PK
        bigint  id_usuario  FK "NOT NULL"
        varchar tipo        "NOT NULL CHECK IN (FORMACION, EXPERIENCIA, HABILIDAD, INTERES, PREFERENCIA)"
        varchar nivel_validacion "NOT NULL DEFAULT 'DECLARADO'"
        timestamp creado_en "NOT NULL"
    }
    FORMACION_ACADEMICA {
        bigint  id_elemento PK,FK
        varchar institucion "NOT NULL"
        varchar titulo      "NOT NULL"
        int     anio
    }
    EXPERIENCIA_LABORAL {
        bigint  id_elemento PK,FK
        varchar empresa     "NOT NULL"
        varchar puesto      "NOT NULL"
        date    desde
        date    hasta
    }
    HABILIDAD {
        bigint  id_elemento PK,FK
        varchar nombre      "NOT NULL"
        int     nivel_autopercibido
    }
    INTERES {
        bigint  id_elemento PK,FK
        varchar tema        "NOT NULL"
    }
    PREFERENCIA_CARRERA {
        bigint  id_elemento PK,FK
        varchar descripcion "NOT NULL"
        int     prioridad
    }
    ENTRADA_HISTORIAL {
        bigint  id_entrada  PK
        bigint  id_elemento FK "NOT NULL"
        timestamp fecha     "NOT NULL"
        varchar tipo_cambio "NOT NULL"
        varchar detalle
    }
    DOCUMENTO_EVIDENCIA {
        bigint  id_documento PK
        bigint  id_elemento  FK "NOT NULL"
        varchar url          "NOT NULL - object storage cifrado"
        varchar tipo
        timestamp subido_en
    }
    USUARIO ||--o{ ELEMENTO_PERFIL : tiene
    ELEMENTO_PERFIL ||--o| FORMACION_ACADEMICA : ""
    ELEMENTO_PERFIL ||--o| EXPERIENCIA_LABORAL : ""
    ELEMENTO_PERFIL ||--o| HABILIDAD : ""
    ELEMENTO_PERFIL ||--o| INTERES : ""
    ELEMENTO_PERFIL ||--o| PREFERENCIA_CARRERA : ""
    ELEMENTO_PERFIL ||--|{ ENTRADA_HISTORIAL : "1..N"
    ELEMENTO_PERFIL ||--o{ DOCUMENTO_EVIDENCIA : "0..N"`, "DER · Servicio I (estrategia Joined)")}
        <div class="callout tip">
          <div class="callout-title">✅ Por qué elegí <i>Joined</i> (tabla por clase)</div>
          <p>“Mapeé la jerarquía con <b>Joined</b>: una tabla <code>ELEMENTO_PERFIL</code> con los atributos comunes
          (nivel de validación, fecha, historial) y una tabla por subtipo con sus atributos propios, unidas por la PK.
          Lo elegí porque los cinco subtipos tienen atributos <b>muy distintos entre sí</b>: con <i>Single Table</i>
          quedarían muchísimas columnas en <code>NULL</code> (institución, empresa, tema… todas conviviendo). El costo
          es un join al leer el detalle de un elemento, aceptable porque el nivel de validación y el historial —lo que más
          se consulta— viven en la tabla padre y no requieren el join.”</p>
        </div>

        <h3>C · Impedance mismatches</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Mismatch</th><th>Resolución</th></tr></thead>
          <tbody>
            <tr><td>Herencia de <code>ElementoDePerfil</code></td><td><b>Joined</b> (justificado arriba)</td></tr>
            <tr><td>Colecciones (historial, documentos)</td><td>Tablas hijas con FK</td></tr>
            <tr><td>Enum <code>NivelDeValidacion</code></td><td>Columna <code>varchar</code> con <code>CHECK</code></td></tr>
            <tr><td>Snapshot de perfil (Servicio III)</td><td>No relacional: documento embebido inmutable, evita reconstruir el perfil histórico con joins</td></tr>
            <tr><td>Identidad</td><td>PK sustituta; referencias entre servicios como referencias lógicas sin FK</td></tr>
          </tbody>
        </table></div>
        <p><b>Desnormalización:</b> se puede mantener en <code>USUARIO</code> un contador o un <i>flag</i> de
        “perfil certificado” derivado de sus elementos, si se consulta con mucha frecuencia para el ranking del Servicio II;
        se actualiza por evento al cambiar el nivel de un elemento.</p>

        <h2>7 · Errores comunes</h2>
        <ul>
          <li><b>Interfaz en vez de clase abstracta</b> para <code>ElementoDePerfil</code>, duplicando el nivel y el historial.</li>
          <li><b>Referencia viva al perfil</b> desde la postulación, ignorando “no debe verse afectada por cambios posteriores”.</li>
          <li><b>Un solo estado inicial</b> para la postulación, cuando hay dos (Postulado / Contactado).</li>
          <li><b>Single Table</b> para los 5 elementos sin justificar el mar de nulls.</li>
          <li><b>Responder confidencialidad con HTTPS</b>, cuando la pregunta es sobre datos <i>almacenados</i>.</li>
          <li><b>No modelar <code>esCertificable()</code></b> y resolver la regla con <code>instanceof</code>.</li>
          <li><b>Dibujar controllers/DTOs</b> en un punto que pide sólo dominio.</li>
        </ul>

        <h2>8 · Trampas del enunciado</h2>
        <div class="trampa"><b>“Para postularse, el usuario utiliza su perfil del momento… no debe verse afectada por
        cambios posteriores.”</b> La palabra “momento” es la pista del <b>snapshot</b>. Si tu postulación referencia al
        perfil, el modelo está mal.</div>
        <div class="trampa"><b>“El nivel Certificado aplica únicamente a elementos que puedan ser corroborados por una
        entidad externa.”</b> La regla <b>no vale para los cinco subtipos</b>: hay que distinguir cuáles son certificables.
        Un método que tira excepción para intereses y habilidades.</div>
        <div class="trampa"><b>“Todos comparten un nivel de validación… cada tipo posee atributos propios.”</b> Es la
        definición exacta de cuándo usar herencia con clase abstracta: estado común arriba, atributos específicos abajo.</div>
        <div class="trampa"><b>“Origen y un identificador externo cuando corresponde.”</b> El “cuando corresponde” implica
        que las oportunidades de <b>carga directa</b> no tienen id externo: la unicidad por (origen, idExterno) sólo aplica
        a las importadas.</div>
        <div class="trampa"><b>“Confidencialidad en los datos <u>almacenados</u>.”</b> Subrayado en el enunciado real.
        Es cifrado en reposo, no en tránsito.</div>

        <h2>9 · Rúbrica autoadministrada</h2>
        <div id="rubTalentia"></div>
      `;

      APP.rubrica(el.querySelector("#rubTalentia"), "talentia", RUBRICA);
    },
  });
})();
