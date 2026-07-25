/* ============================================================
   Final resuelto — Libros Circulares (21/02/2026)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;
  const D = APP.DATA = APP.DATA || {};
  D.finales = D.finales || [];

  const ENUNCIADO = `
    <h4>Contexto</h4>
    <p>Una organización social destinada a impulsar la lectura ha decidido iniciar un proyecto de circulación de libros.
    Se propone el diseño de un sistema para facilitar préstamos, devoluciones y cesiones.</p>
    <p>Se promueve el préstamo de libros a otras personas, <b>incluso sin necesidad de volver a su dueño original y sin
    que ese dueño original pierda la propiedad</b>. Si una persona A presta un libro a B, B lo puede prestar a C, C a D;
    sin embargo, <b>la propiedad continúa siendo de A</b> hasta que él decida otorgársela a otro. El objeto de operaciones
    es un <b>ejemplar</b> de una <b>edición</b> de una <b>obra</b>.</p>
    <p>Las operaciones permitidas son el préstamo, la devolución, la cesión de la propiedad y la baja del ejemplar.</p>

    <h4>Servicio I — Gestión de Ejemplares</h4>
    <p>Registro de la <b>obra</b> con nombre (título), género y sus <b>autores</b> (nombre, apellido, nacionalidad y país
    de residencia). Una obra puede tener diversas <b>ediciones</b> (esa obra editada por determinada editorial en
    determinado año). El <b>ejemplar</b> es el libro físico: es el objeto de los préstamos y de la propiedad.
    Se debe registrar el <b>dueño actual</b> y <b>quién lo tiene actualmente</b>.</p>

    <h4>Servicio II — Gestión de Operaciones</h4>
    <p>El <b>préstamo</b> implica que una persona que tenía el libro en su poder lo cede temporalmente a otra.
    Sólo puede prestarlo si lo tiene actualmente en su poder; <b>incluso el propietario no podrá prestarlo si no lo tiene
    en su poder</b>. La <b>devolución</b> es el vencimiento del préstamo sin que se haya producido un nuevo préstamo, por
    lo cual el libro retorna a su propietario. La <b>cesión</b> es el cambio de propietario y sólo puede realizarla el
    propietario; no es necesario tenerlo en su poder. La <b>baja</b> implica que el ejemplar ya no está disponible y
    sobre él no se podrá realizar ninguna operación.</p>

    <h4>Servicio III — Gestión de Personas y Comunidades</h4>
    <p>Todas las operaciones sólo podrán realizarse entre personas de <b>una misma comunidad</b>. Cada persona puede estar
    asociada a diversas comunidades, pero <b>sólo puede estar activa en tres</b>; para participar en una cuarta debe ser
    inactivada en otra, y para inactivarse debe tener <b>todas las operaciones cerradas</b>. Las comunidades las crea el
    administrador directamente en la base de datos.</p>
    <p>Toda persona debe registrarse (nombre, apellido, documento). El registro incluye una <b>validación de identidad</b>
    integrándose con un servicio externo del <b>RENAPER</b>. El email <b>no</b> puede ser obligatorio ni único (pueden
    participar menores), pero toda persona debe tener un email o teléfono asociado, <b>propio o de un tercero</b>: se
    vinculan diferentes personas a otra que será el sujeto de contacto.</p>

    <h4>Servicio IV — Gestión de Recomendaciones</h4>
    <p>A partir del historial de préstamos genera recomendaciones. Se integra con un sistema externo llamado
    <b>BookIA</b>, al que se le envía el historial reciente y retorna una lista de libros recomendados. Sobre esos libros
    se verifica <b>cuáles están disponibles en la comunidad</b> y se seleccionan para recomendar.</p>

    <h4>Punto 1 — Modelado de Dominio (30 pts)</h4>
    <p><b>A (20)</b> — Documentar los Servicios I, II y III con diagramas UML separados por servicio (Plan 23).
    <b>B (10)</b> — Justificar las decisiones de diseño (principios, consecuencias de aplicar patrones).</p>

    <h4>Punto 2 — Arquitectura (40 pts)</h4>
    <p><b>A.c (10)</b> — Diagrama de componentes mostrando servicios y componentes propios y externos.
    <b>A.d (10)</b> — Integración de los servicios usando coreografía u orquestación, justificando el enfoque.
    <b>B (10)</b> — Explicar la interacción de componentes del Servicio IV.
    <b>C (10)</b> — El Servicio IV puede ejecutarse al acceder el usuario, al finalizar su último préstamo o
    periódicamente. Eso genera carga importante repitiendo el proceso con poco tiempo de diferencia y sin impacto
    sustantivo en los resultados. ¿Qué solución sugiere para reducir esta carga?</p>

    <h4>Punto 3 — Persistencia (30 pts)</h4>
    <p><b>A (10)</b> — Qué elementos usarían persistencia no relacional y de qué tipo, justificando.
    <b>B (15)</b> — Modelo de datos relacional de los Servicios I, II y III, un diagrama por servicio.
    <b>C (5)</b> — Justificar qué persistir, cómo resolvió los impedance mismatches y qué desnormalizar.</p>`;

  const RUBRICA = [
    { t: "Modelé <b>Obra → Edición → Ejemplar</b> como tres entidades distintas", p: 8 },
    { t: "El ejemplar tiene <b>dos asociaciones distintas</b> a Persona: <code>propietario</code> y <code>tenedorActual</code>", p: 8 },
    { t: "Usé <b>State</b> para el ciclo de vida del ejemplar (incluyendo el estado terminal “dado de baja”)", p: 6 },
    { t: "La regla “sólo puede prestar quien lo tiene” está <b>en el dominio</b>, no en un service", p: 5 },
    { t: "Modelé <b>Préstamo</b> como entidad propia (con fechas, de quién a quién)", p: 5 },
    { t: "La relación Persona–Comunidad está <b>cosificada</b> (Membresía) para guardar activa/inactiva", p: 6 },
    { t: "Contemplé la regla de <b>máximo 3 comunidades activas</b> y la condición para inactivarse", p: 5 },
    { t: "Modelé el contacto <b>propio o de un tercero</b> sin hacer el email único ni obligatorio", p: 6 },
    { t: "Usé <b>Adapter</b> para RENAPER y para BookIA", p: 6 },
    { t: "Diagrama de componentes con los 4 servicios + RENAPER + BookIA + broker", p: 8 },
    { t: "Justifiqué el enfoque <b>híbrido</b>: orquestación para el caso de uso, coreografía para las reacciones", p: 8 },
    { t: "Expliqué la interacción del Servicio IV paso a paso (historial → BookIA → filtro por disponibilidad)", p: 6 },
    { t: "Punto C: propuse <b>caché con TTL + debounce/idempotencia por usuario</b>, no sólo “una cola”", p: 8 },
    { t: "Punto 3.A: propuse no relacional <b>con el tipo concreto y su justificación</b>", p: 6 },
    { t: "DER por servicio con PK, FK, cardinalidad y modalidad", p: 9 },
  ];

  D.finales.push({
    id: "f-libros", nombre: "Libros Circulares", fecha: "21/02/2026", duracion: 180,
    enunciado: ENUNCIADO, rubrica: RUBRICA,
  });

  APP.register({
    id: "f-libros",
    title: "Libros Circulares",
    tag: "📄",
    group: "Finales resueltos",
    resumen: "21/02/2026 · circulación de libros",
    keywords: ["libros circulares", "final", "prestamo", "renaper", "bookia", "comunidad", "ejemplar"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Final resuelto · 21/02/2026</div>
          <h1>Libros Circulares</h1>
          <p class="lead">Circulación de libros entre comunidades. Dominio 30 · Arquitectura 40 · Persistencia 30.</p>
        </div>

        <details class="qa" open>
          <summary>📄 Enunciado completo</summary>
          <div class="enunciado">${ENUNCIADO}</div>
        </details>

        <h2>1 · Análisis del enunciado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Frase del enunciado</th><th>Qué dispara</th></tr></thead>
          <tbody>
            <tr><td>“un <b>ejemplar</b> de una <b>edición</b> de una <b>obra</b>”</td><td>Tres entidades encadenadas. Es la primera decisión del modelo.</td></tr>
            <tr><td>“la propiedad continúa siendo de A <b>hasta que él decida otorgársela</b>”</td><td><b>Dos asociaciones distintas</b> a Persona: propietario ≠ tenedor</td></tr>
            <tr><td>“sólo puede prestarlo <b>si lo tiene actualmente en su poder</b>”</td><td>Regla del dominio → <b>State</b></td></tr>
            <tr><td>“<b>incluso si es el propietario</b> no podrá prestarlo si no lo tiene”</td><td>Confirma que propiedad y tenencia son independientes</td></tr>
            <tr><td>“sobre él <b>no se podrá realizar ninguna operación</b>”</td><td>Estado <b>terminal</b> “Dado de baja”</td></tr>
            <tr><td>“sólo puede estar <b>activa en tres</b> comunidades”</td><td>La relación N:M necesita atributos → clase <b>Membresía</b></td></tr>
            <tr><td>“para inactivarse debe tener <b>todas las operaciones cerradas</b>”</td><td>Invariante que valida la Membresía consultando los préstamos</td></tr>
            <tr><td>“integrarse con un servicio externo del <b>RENAPER</b>”</td><td><b>Adapter</b></td></tr>
            <tr><td>“email <b>no conveniente como único</b>… propio o de un tercero”</td><td>Modelo de contacto separado, con posible titular tercero</td></tr>
            <tr><td>“se integra con <b>BookIA</b>… retorna una lista”</td><td><b>Adapter</b> + filtro posterior por disponibilidad</td></tr>
            <tr><td>“carga importante… <b>sin impacto sustantivo</b> en los resultados”</td><td><b>Caché con TTL</b> + deduplicación, no sólo una cola</td></tr>
            <tr><td>“las comunidades las crea el administrador <b>en la base de datos</b>”</td><td>Fuera de alcance: no hay ABM de comunidades que modelar</td></tr>
          </tbody>
        </table></div>

        <h2>2 · Punto 1.A — Modelado de dominio</h2>

        <h3>Servicio I — Gestión de Ejemplares</h3>
        ${APP.uml(`classDiagram
    class Obra {
        -titulo: String
        -genero: Genero
        +agregarEdicion(Edicion) void
    }
    class Autor {
        -nombre: String
        -apellido: String
        -nacionalidad: String
        -paisDeResidencia: String
    }
    class Edicion {
        -editorial: String
        -anio: int
    }
    class Ejemplar {
        -codigo: CodigoEjemplar
        -estado: EstadoEjemplar
        +prestar(Persona, Persona, LocalDate) Prestamo
        +devolver() void
        +ceder(Persona, Persona) void
        +darDeBaja(Persona) void
        +estaEnPoderDe(Persona) boolean
    }
    class Persona
    class Genero {
        <<enumeration>>
        CIENCIA_FICCION
        DOCUMENTAL
        NOVELA
        ENSAYO
    }
    Obra "1" *-- "*" Edicion : ediciones
    Obra "*" --> "1..*" Autor : escrita por
    Edicion "1" *-- "*" Ejemplar : ejemplares
    Ejemplar --> "1" Persona : propietario
    Ejemplar --> "1" Persona : tenedorActual
    Obra --> Genero`, "Servicio I")}
        <div class="callout key">
          <p><b>La decisión que define este final:</b> <code>propietario</code> y <code>tenedorActual</code> son
          <b>dos asociaciones distintas</b> hacia <code>Persona</code>, y hay que nombrarlas en el diagrama.
          Con un solo atributo <code>duenio</code> es imposible expresar “A presta a B, B presta a C, y A sigue siendo
          el dueño”, que es literalmente el corazón del enunciado.</p>
        </div>

        <h3>Servicio II — Gestión de Operaciones (State)</h3>
        ${APP.uml(`classDiagram
    class Ejemplar {
        -estado: EstadoEjemplar
        +prestar(Persona, Persona, LocalDate) Prestamo
        +devolver() void
        +ceder(Persona, Persona) void
        +darDeBaja(Persona) void
        ~transicionarA(EstadoEjemplar) void
    }
    class EstadoEjemplar {
        <<interface>>
        +prestar(Ejemplar, Persona, Persona, LocalDate) Prestamo
        +devolver(Ejemplar) void
        +ceder(Ejemplar, Persona, Persona) void
        +darDeBaja(Ejemplar, Persona) void
    }
    class EstadoBase {
        <<abstract>>
        #rechazar(String) void
    }
    class EnPoderDelPropietario
    class Prestado
    class DadoDeBaja
    class Prestamo {
        -desde: LocalDate
        -vencimiento: LocalDate
        -devueltoEn: LocalDate
        +estaVencido() boolean
        +estaAbierto() boolean
    }
    class Cesion {
        -fecha: LocalDate
    }
    class BajaDeEjemplar {
        -fecha: LocalDate
        -motivo: String
    }
    class Persona
    EstadoEjemplar <|.. EstadoBase
    EstadoBase <|-- EnPoderDelPropietario
    EstadoBase <|-- Prestado
    EstadoBase <|-- DadoDeBaja
    Ejemplar --> EstadoEjemplar
    Ejemplar "1" *-- "*" Prestamo : historial
    Ejemplar "1" *-- "*" Cesion : historial
    Ejemplar "1" o-- "0..1" BajaDeEjemplar
    Prestamo --> "1" Persona : de
    Prestamo --> "1" Persona : a
    Cesion --> "1" Persona : cedente
    Cesion --> "1" Persona : nuevoPropietario`, "Servicio II · State + operaciones cosificadas")}
        ${APP.code(`class Prestado extends EstadoBase {

    @Override
    public Prestamo prestar(Ejemplar e, Persona de, Persona a, LocalDate vencimiento) {
        // "Sólo puede realizar el préstamo si lo tiene actualmente en su poder"
        if (!e.estaEnPoderDe(de))         throw new NoLoTieneEnSuPoder(de);
        // "Todas las operaciones sólo dentro de personas de una comunidad"
        if (!de.comparteComunidadActivaCon(a)) throw new SinComunidadEnComun(de, a);

        Prestamo p = new Prestamo(e, de, a, LocalDate.now(), vencimiento);
        e.registrar(p);
        e.cambiarTenedor(a);
        return p;                        // sigue PRESTADO: B puede prestarlo a C
    }

    @Override
    public void devolver(Ejemplar e) {
        // "el libro es retornado a su propietario"
        e.cerrarPrestamoAbierto();
        e.cambiarTenedor(e.getPropietario());
        e.transicionarA(new EnPoderDelPropietario());
    }

    @Override
    public void ceder(Ejemplar e, Persona cedente, Persona nuevo) {
        // "sólo puede ser realizado por el propietario […] no es necesario tenerlo en su poder"
        if (!e.getPropietario().equals(cedente)) throw new NoEsElPropietario(cedente);
        e.registrar(new Cesion(cedente, nuevo, LocalDate.now()));
        e.cambiarPropietario(nuevo);     // el ESTADO no cambia: sigue prestado
    }

    @Override
    public void darDeBaja(Ejemplar e, Persona quien) {
        if (!e.getPropietario().equals(quien)) throw new NoEsElPropietario(quien);
        e.transicionarA(new DadoDeBaja());
    }
}

// El estado terminal rechaza TODO, heredando el comportamiento por defecto
class DadoDeBaja extends EstadoBase { }`, { variant: "good", label: "✅ Las reglas viven en el estado" })}
        <div class="callout tip">
          <p><b>Fijate el detalle fino:</b> la <b>cesión no cambia el estado</b> del ejemplar (puede estar prestado y
          cambiar de dueño al mismo tiempo), mientras que el <b>préstamo tampoco</b> (de PRESTADO se va a PRESTADO, con
          otro tenedor). Sólo la devolución y la baja transicionan. Modelar eso correctamente demuestra que leíste
          el enunciado con cuidado.</p>
        </div>

        <h3>Servicio III — Personas y Comunidades</h3>
        ${APP.uml(`classDiagram
    class Persona {
        -nombre: String
        -apellido: String
        -documento: Documento
        -identidadValidada: boolean
        +activarEn(Comunidad) void
        +inactivarEn(Comunidad) void
        +comparteComunidadActivaCon(Persona) boolean
        +mediosDeContacto() List~MedioDeContacto~
    }
    class Comunidad {
        -nombre: String
        -descripcion: String
    }
    class Membresia {
        -desde: LocalDate
        -activa: boolean
        -inactivadaEn: LocalDate
        +puedeInactivarse() boolean
    }
    class MedioDeContacto {
        <<abstract>>
        -titular: Persona
        +destino() String
    }
    class Email { -direccion: String }
    class Telefono { -numero: String }
    class Documento {
        <<value object>>
        -tipo: TipoDocumento
        -numero: String
    }
    class ValidadorDeIdentidad {
        <<interface>>
        +validar(Persona) ResultadoValidacion
    }
    class RenaperAdapter {
        -client: RenaperHttpClient
    }
    Persona "1" *-- "1..3" Membresia : activas
    Membresia "*" --> "1" Comunidad
    Persona "1" *-- "1..*" MedioDeContacto
    MedioDeContacto <|-- Email
    MedioDeContacto <|-- Telefono
    MedioDeContacto --> "1" Persona : titular (puede ser otra)
    Persona --> Documento
    ValidadorDeIdentidad <|.. RenaperAdapter
    Persona ..> ValidadorDeIdentidad`, "Servicio III")}
        <div class="callout key">
          <div class="callout-title">🔑 Las dos sutilezas de este servicio</div>
          <p><b>1) La relación Persona–Comunidad se cosifica.</b> Es N:M <i>con atributos</i> (activa/inactiva, desde,
          hasta), y hay una regla de negocio encima (“máximo 3 activas”, “para inactivarse todas las operaciones
          cerradas”). Una asociación simple no puede llevar eso: hace falta la clase <code>Membresia</code>.</p>
          <p><b>2) El medio de contacto tiene un <code>titular</code> que puede ser otra persona.</b> El enunciado es
          explícito: “esto no significa que las personas pueden tener email repetido, sino que pueden vincularse
          diferentes personas a otra persona que será el sujeto de contacto”. Un menor usa el mail de su madre; el mail
          <b>le pertenece a la madre</b>, no al menor.</p>
        </div>
        ${APP.code(`class Persona {
    private final List<Membresia> membresias = new ArrayList<>();

    public void activarEn(Comunidad comunidad) {
        if (membresiasActivas().size() >= 3)
            throw new MaximoDeComunidadesActivas();   // "sólo pueden estar activas en tres"
        membresias.add(new Membresia(this, comunidad));
    }

    public void inactivarEn(Comunidad comunidad) {
        Membresia m = membresiaEn(comunidad).orElseThrow(NoPerteneceALaComunidad::new);
        if (!m.puedeInactivarse())                    // "deben tener todas las operaciones cerradas"
            throw new TieneOperacionesAbiertas();
        m.inactivar();
    }

    public boolean comparteComunidadActivaCon(Persona otra) {
        return membresiasActivas().stream()
            .anyMatch(m -> otra.estaActivaEn(m.getComunidad()));
    }
}`, { variant: "good", label: "✅ Las reglas de comunidad, en la Persona" })}

        <h2>3 · Punto 2.A — Arquitectura de componentes</h2>
        ${APP.uml(`graph TB
    WEB["🌐 Web / Mobile"] -->|HTTPS| GW["🚪 API Gateway"]
    IDM["🔐 IDM"] -.-> GW
    GW --> S1["Servicio I<br/>Ejemplares"]
    GW --> S2["Servicio II<br/>Operaciones<br/>(orquestador del CU)"]
    GW --> S3["Servicio III<br/>Personas y Comunidades"]
    GW --> S4["Servicio IV<br/>Recomendaciones"]

    S2 -->|"sync · GET /ejemplares/{id}"| S1
    S2 -->|"sync · GET /personas/{id}/comunidades"| S3
    S2 -->|"publica PrestamoRealizado /<br/>PrestamoFinalizado"| BR["📨 Broker"]
    BR -->|consume| S4
    BR -->|consume| NOT["Servicio de<br/>Notificaciones"]

    S3 -->|HTTPS| REN["🏛️ RENAPER<br/>(externo)"]
    S4 -->|HTTPS| BIA["🤖 BookIA<br/>(externo)"]
    S4 -->|"sync · disponibilidad<br/>en la comunidad"| S1
    S4 --> CACHE[("⚡ Caché de<br/>recomendaciones")]
    CRON["⏰ Cron quincenal"] -->|publica| BR

    S1 --> DB1[("DB I")]
    S2 --> DB2[("DB II")]
    S3 --> DB3[("DB III")]
    S4 --> DB4[("DB IV")]
    style GW fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style BR fill:#fffbeb,stroke:#b45309,color:#0f172a
    style REN fill:#f1f5f9,stroke:#64748b,color:#0f172a
    style BIA fill:#f1f5f9,stroke:#64748b,color:#0f172a`, "Componentes + externos")}

        <h2>4 · Punto 2.A.d — ¿Orquestación o coreografía?</h2>
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo</div>
          <p>“Uso un enfoque <b>híbrido</b>, porque los dos tipos de interacción del sistema tienen necesidades distintas.”</p>
          <p>“<b>Orquestación para el caso de uso principal.</b> Realizar una operación sobre un ejemplar exige validar
          varias precondiciones antes de confirmarla: que el ejemplar esté en poder de quien lo presta, que ambas
          personas compartan una comunidad activa y que el ejemplar no esté dado de baja. Si alguna falla, hay que
          abortar la operación completa. El Servicio II actúa como <b>orquestador</b>: consulta sincrónicamente a los
          Servicios I y III y decide. Elijo orquestación porque necesito <b>visibilidad y control del flujo en un solo
          lugar</b> y porque el resultado debe ser consistente e inmediato para el usuario.”</p>
          <p>“<b>Coreografía para las reacciones posteriores.</b> Una vez confirmada la operación, el Servicio II publica
          <code>PrestamoRealizado</code> / <code>PrestamoFinalizado</code> en el broker. Quien esté interesado se
          suscribe: el Servicio IV para recalcular recomendaciones, el de Notificaciones para avisar a los medios de
          contacto de la persona, y eventualmente estadísticas. Elijo coreografía acá porque son <b>reacciones a un
          hecho ya consumado</b>, no forman parte de la transacción, y así el orquestador no se acopla a ellas:
          agregar un consumidor nuevo no lo modifica.”</p>
          <p>“El costo del híbrido es que la trazabilidad de punta a punta requiere <b>tracing distribuido</b>
          (correlation id propagado en headers y en los mensajes).”</p>
        </div>

        <h2>5 · Punto 2.B — Interacción del Servicio IV</h2>
        ${APP.uml(`sequenceDiagram
    autonumber
    participant T as Disparador<br/>(acceso · fin de préstamo · cron)
    participant S4 as Servicio IV
    participant C as Caché
    participant S2 as Servicio II
    participant BIA as BookIA (externo)
    participant S1 as Servicio I
    T->>S4: solicitar recomendaciones (personaId)
    S4->>C: ¿hay recomendación vigente? (TTL)
    alt hay caché vigente
        C-->>S4: recomendaciones
        S4-->>T: devuelve (sin llamar a BookIA)
    else no hay o venció
        S4->>S2: historial reciente de préstamos
        S2-->>S4: últimos N préstamos
        S4->>BIA: POST /recommendations (historial) · vía adapter
        BIA-->>S4: lista de libros recomendados
        S4->>S1: ¿cuáles están disponibles en la comunidad?
        S1-->>S4: subconjunto disponible
        S4->>C: guardar con TTL
        S4-->>T: recomendaciones filtradas
    end`, "Servicio IV paso a paso")}
        <p>Los pasos que hay que nombrar: <b>(1)</b> obtener el historial reciente; <b>(2)</b> enviarlo a BookIA a través
        de un <b>adapter</b> que traduce el JSON del proveedor a objetos del dominio; <b>(3)</b> cruzar la lista devuelta
        con la <b>disponibilidad en la comunidad</b> consultando al Servicio I; <b>(4)</b> persistir/cachear el resultado
        y entregarlo.</p>

        <h2>6 · Punto 2.C — Reducir la carga del Servicio IV</h2>
        <div class="callout key">
          <div class="callout-title">📝 Respuesta modelo (esto es lo que separa un 6 de un 10)</div>
          <p>“El problema no es de <i>throughput</i> sino de <b>trabajo redundante</b>: el mismo cálculo se repite con poco
          tiempo de diferencia y —según dice el propio enunciado— <b>sin impacto sustantivo en los resultados</b>.
          Responder sólo ‘lo pongo en una cola’ no lo resuelve: la cola difiere el trabajo, no lo elimina.”</p>
          <p>Propongo <b>cuatro medidas combinadas</b>:</p>
          <ol>
            <li><b>Caché con TTL por persona</b> (por ejemplo 24–48 h). Si hay una recomendación vigente, se devuelve sin
            llamar a BookIA. Es lo que ataca directamente la redundancia.</li>
            <li><b>Deduplicación / debounce de disparadores.</b> Los tres eventos (acceso, fin de préstamo, cron) publican
            en la misma cola, y el consumidor descarta la solicitud si ya hay un cálculo reciente o en curso para esa
            persona (una clave de idempotencia <code>personaId + ventana</code>).</li>
            <li><b>Invalidación por evento significativo</b> en vez de recálculo periódico ciego: la caché se invalida
            cuando el historial <b>realmente cambia</b> (se cerró un préstamo), no cada vez que el usuario entra.</li>
            <li><b>Procesamiento asincrónico y por lotes</b> para el disparo periódico: el cron no calcula, publica
            mensajes que los consumidores procesan de a tandas en horarios de baja demanda, y agrupa las llamadas a
            BookIA para reducir el costo de la integración.</li>
          </ol>
          <p>“El trade-off es la <b>frescura</b>: las recomendaciones pueden quedar hasta 48 h desactualizadas. Es
          aceptable porque el propio enunciado afirma que recalcular con poco tiempo de diferencia no cambia
          sustantivamente el resultado.”</p>
        </div>

        <h2>7 · Punto 3 — Persistencia</h2>
        <h3>A · Qué va en no relacional</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Elemento</th><th>Tipo de base</th><th>Justificación</th></tr></thead>
          <tbody>
            <tr><td>Recomendaciones generadas (Servicio IV)</td><td><b>Documental</b> (MongoDB)</td><td>La respuesta de BookIA es un documento JSON de estructura variable que puede cambiar con las versiones del proveedor; no hay relaciones que recorrer y se consulta completo por persona</td></tr>
            <tr><td>Caché de recomendaciones</td><td><b>Clave-valor</b> (Redis)</td><td>Acceso por clave (<code>reco:personaId</code>) con <b>TTL nativo</b>, que es justo lo que pide el punto 2.C</td></tr>
            <tr><td>Bitácora / log de operaciones</td><td><b>Documental</b> o motor de búsqueda</td><td>Volumen alto, append-only, consultas por rango de fechas y texto</td></tr>
            <tr><td>Grafo de circulación (quién prestó a quién)</td><td><b>Grafo</b> (Neo4j) — opcional</td><td>Si se quisiera analizar cadenas de circulación (A→B→C→D) o sugerir por cercanía en la red, un grafo lo resuelve mucho mejor que joins recursivos</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Lo que NO va en no relacional:</b> obras, ediciones, ejemplares, personas, comunidades y operaciones.
          Son datos altamente relacionales, con integridad referencial y reglas transaccionales (“sólo 3 comunidades
          activas”, “sólo presta quien lo tiene”). Decir <i>por qué el resto se queda en relacional</i> también suma.</p>
        </div>

        <h3>B · DER — Servicio I</h3>
        ${APP.uml(`erDiagram
    OBRA {
        bigint id_obra      PK
        varchar titulo      "NOT NULL"
        varchar genero      "NOT NULL"
    }
    AUTOR {
        bigint id_autor     PK
        varchar nombre      "NOT NULL"
        varchar apellido    "NOT NULL"
        varchar nacionalidad
        varchar pais_residencia
    }
    OBRA_AUTOR {
        bigint id_obra      PK,FK
        bigint id_autor     PK,FK
    }
    EDICION {
        bigint id_edicion   PK
        bigint id_obra      FK "NOT NULL"
        varchar editorial   "NOT NULL"
        int    anio         "NOT NULL"
    }
    EJEMPLAR {
        bigint id_ejemplar      PK
        bigint id_edicion       FK "NOT NULL"
        bigint id_propietario      "ref lógica a Servicio III"
        bigint id_tenedor_actual   "ref lógica a Servicio III"
        varchar estado          "NOT NULL CHECK IN (EN_PODER_PROPIETARIO, PRESTADO, DADO_DE_BAJA)"
        timestamp alta_en       "NOT NULL"
    }
    OBRA     ||--|{ EDICION    : "1..N tiene"
    EDICION  ||--o{ EJEMPLAR   : "0..N tiene"
    OBRA     ||--|{ OBRA_AUTOR : ""
    AUTOR    ||--|{ OBRA_AUTOR : "N:M escribió"`, "DER · Servicio I")}

        <h3>B · DER — Servicio II</h3>
        ${APP.uml(`erDiagram
    PRESTAMO {
        bigint id_prestamo    PK
        bigint id_ejemplar       "ref lógica a Servicio I, NOT NULL"
        bigint id_persona_de     "ref lógica a Servicio III, NOT NULL"
        bigint id_persona_a      "ref lógica a Servicio III, NOT NULL"
        date   desde          "NOT NULL"
        date   vencimiento    "NOT NULL"
        date   devuelto_en    "NULL = préstamo abierto"
    }
    CESION {
        bigint id_cesion      PK
        bigint id_ejemplar       "NOT NULL"
        bigint id_cedente        "NOT NULL"
        bigint id_nuevo_prop     "NOT NULL"
        date   fecha         "NOT NULL"
    }
    BAJA_EJEMPLAR {
        bigint id_baja        PK
        bigint id_ejemplar       "UK NOT NULL"
        bigint id_solicitante    "NOT NULL"
        date   fecha         "NOT NULL"
        varchar motivo
    }
    PRESTAMO      }o--|| EJEMPLAR_REF : "sobre"
    CESION        }o--|| EJEMPLAR_REF : "sobre"
    BAJA_EJEMPLAR |o--|| EJEMPLAR_REF : "0..1 sobre"
    EJEMPLAR_REF {
        bigint id_ejemplar PK "vive en la base del Servicio I"
    }`, "DER · Servicio II")}
        <p>Restricción importante: <b>a lo sumo un préstamo abierto por ejemplar</b>. Se implementa con un índice único
        parcial (<code>UNIQUE (id_ejemplar) WHERE devuelto_en IS NULL</code>).</p>

        <h3>B · DER — Servicio III</h3>
        ${APP.uml(`erDiagram
    PERSONA {
        bigint  id_persona     PK
        varchar tipo_documento "NOT NULL"
        varchar nro_documento  "NOT NULL"
        varchar nombre         "NOT NULL"
        varchar apellido       "NOT NULL"
        boolean identidad_validada "NOT NULL DEFAULT false"
        timestamp validada_en
    }
    COMUNIDAD {
        bigint  id_comunidad   PK
        varchar nombre         "UK NOT NULL"
        varchar descripcion
    }
    MEMBRESIA {
        bigint  id_membresia   PK
        bigint  id_persona     FK "NOT NULL"
        bigint  id_comunidad   FK "NOT NULL"
        date    desde          "NOT NULL"
        boolean activa         "NOT NULL"
        date    inactivada_en
    }
    MEDIO_CONTACTO {
        bigint  id_medio       PK
        bigint  id_titular     FK "NOT NULL - la persona DUEÑA del medio"
        varchar tipo           "NOT NULL CHECK IN (EMAIL, TELEFONO)"
        varchar valor          "NOT NULL"
    }
    CONTACTO_DE_PERSONA {
        bigint  id_persona     PK,FK "quien lo USA"
        bigint  id_medio       PK,FK "el medio, que puede ser de un tercero"
        boolean principal      "NOT NULL"
    }
    PERSONA   ||--o{ MEMBRESIA : "0..N (máx 3 activas)"
    COMUNIDAD ||--o{ MEMBRESIA : "0..N"
    PERSONA   ||--o{ MEDIO_CONTACTO : "0..N es titular de"
    PERSONA   ||--|{ CONTACTO_DE_PERSONA : "1..N usa"
    MEDIO_CONTACTO ||--|{ CONTACTO_DE_PERSONA : ""`, "DER · Servicio III")}
        <div class="callout tip">
          <p><b>Por qué <code>CONTACTO_DE_PERSONA</code> y no un campo <code>email</code> en <code>PERSONA</code>:</b>
          el enunciado exige que un mismo medio (el mail de la madre) pueda estar asociado a <b>varias personas</b>
          (ella y sus hijos), sin duplicarlo y sin que el email sea único por persona. Eso es N:M, y el titular queda
          registrado con la FK <code>id_titular</code>. La restricción “toda persona debe tener al menos un medio” es
          la modalidad <b>1..N</b> en <code>CONTACTO_DE_PERSONA</code>.</p>
        </div>

        <h3>C · Impedance mismatches y desnormalización</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Mismatch</th><th>Cómo se resolvió</th></tr></thead>
          <tbody>
            <tr><td>Jerarquía <code>MedioDeContacto → Email / Telefono</code></td><td><b>Single Table</b> con discriminador <code>tipo</code>: son dos subclases con un solo atributo cada una, así que el costo en nulls es nulo y evita joins</td></tr>
            <tr><td>Jerarquía de <code>EstadoEjemplar</code> (State)</td><td><b>No se persiste como jerarquía:</b> se guarda un <code>varchar estado</code> con <code>CHECK</code> y el repositorio reconstruye la clase de estado al hidratar. Los estados no tienen datos propios.</td></tr>
            <tr><td>Colecciones (<code>List&lt;Prestamo&gt;</code>, <code>List&lt;Membresia&gt;</code>)</td><td>Tablas hijas con FK al padre</td></tr>
            <tr><td>Value object <code>Documento</code></td><td><b>Embebido</b>: se aplana en dos columnas de <code>PERSONA</code> (tipo y número), con índice único compuesto</td></tr>
            <tr><td>Identidad por referencia vs por clave</td><td>Cada agregado tiene una PK sustituta (<code>bigint</code>); las relaciones entre servicios son <b>referencias lógicas</b> sin FK, porque cruzan bases</td></tr>
          </tbody>
        </table></div>
        <p><b>Desnormalización propuesta:</b> el campo <code>id_tenedor_actual</code> en <code>EJEMPLAR</code> es
        estrictamente derivable del último préstamo abierto, pero se mantiene desnormalizado porque se consulta en
        <b>cada operación</b> (es la validación central del sistema) y calcularlo con un join al historial en cada
        chequeo sería costoso. La consistencia se garantiza actualizándolo en la misma transacción que crea el préstamo.</p>

        <h2>8 · Errores comunes</h2>
        <ul>
          <li><b>Un solo atributo <code>duenio</code></b> en el ejemplar: rompe todo el enunciado.</li>
          <li><b>Fusionar Obra, Edición y Ejemplar</b> en una sola clase “Libro”.</li>
          <li><b>Asociación simple Persona–Comunidad</b>, sin poder guardar activa/inactiva ni las reglas.</li>
          <li><b>Poner <code>email</code> como campo único</b> de Persona, cuando el enunciado dice explícitamente por qué no.</li>
          <li><b>Validaciones en el service</b> y no en el ejemplar (dominio anémico).</li>
          <li><b>Responder el punto 2.C sólo con “uso una cola”</b>: la cola no elimina el trabajo redundante.</li>
          <li><b>Poner FK entre bases de servicios distintos.</b></li>
          <li><b>Olvidar que la cesión no requiere tener el libro</b> y que no cambia el estado.</li>
        </ul>

        <h2>9 · Trampas del enunciado</h2>
        <div class="trampa"><b>“Incluso si es el propietario no podrá prestarlo si no lo tiene en su poder.”</b>
        Está puesto para que separes propiedad de tenencia. Si tu modelo no lo permite, perdiste el punto central.</div>
        <div class="trampa"><b>“Para ser inactivada en una comunidad deben tener todas las operaciones cerradas.”</b>
        Cruza el Servicio III con el II: para validarlo, la membresía necesita saber si hay préstamos abiertos.
        Ahí aparece una dependencia entre servicios que hay que mostrar en el diagrama de componentes.</div>
        <div class="trampa"><b>“Las comunidades son creadas por el administrador directamente en la base de datos.”</b>
        Es una exclusión de alcance: no modeles ABM de comunidades ni pantallas de administración.</div>
        <div class="trampa"><b>“…sin impacto sustantivo en los resultados.”</b> Esa frase es la pista de que la respuesta
        del punto 2.C es <b>caché</b>, no encolar. El enunciado te está diciendo que el resultado <i>se puede reusar</i>.</div>
        <div class="trampa"><b>“La devolución es el vencimiento del préstamo sin que se haya producido un nuevo préstamo.”</b>
        La devolución no es un acto voluntario: es una consecuencia del vencimiento. Eso sugiere un
        <b>cron</b> que detecte préstamos vencidos, no un botón “devolver”.</div>

        <h2>10 · Rúbrica autoadministrada</h2>
        <div id="rubLibros"></div>
      `;

      APP.rubrica(el.querySelector("#rubLibros"), "libros", RUBRICA);
    },
  });
})();
