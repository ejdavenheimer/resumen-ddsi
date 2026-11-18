/* ============================================================
   P2 · Mapeo con Hibernate: annotations, relaciones, herencia
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-hibernate",
    title: "Hibernate: annotations y herencia",
    tag: "🧷",
    group: "Persistencia (P2)",
    resumen: "@Entity, relaciones, enums, Embeddable, ElementCollection y las 4 estrategias de herencia",
    keywords: ["hibernate", "jpa", "entity", "id", "generatedvalue", "column", "onetoone", "onetomany", "manytoone", "manytomany", "joincolumn", "mappedby", "element collection", "embeddable", "embedded", "mappedsuperclass", "single_table", "joined", "table_per_class", "discriminator", "enumerated", "converter", "herencia"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Mapeo con Hibernate</h1>
          <p class="lead">El parcial es <b>escrito</b>: no vas a compilar. Lo que se evalúa es que sepas <b>qué annotation corresponde a cada relación</b> y, sobre todo, que <b>elijas y justifiques</b> la estrategia de herencia. Dejé el código visible porque acá sí conviene reconocerlo de memoria.</p>
        </div>

        <h2>Entidad básica</h2>
        ${APP.code(`@Entity                                   // esta clase se persiste como tabla
@Table(name = "mascota")                  // nombre de la tabla (opcional)
public class Mascota {

    @Id                                   // clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // subrogada autoincremental
    private Long id;

    @Column(name = "nombre", nullable = false, length = 80)   // NOT NULL + VARCHAR(80)
    private String nombre;

    @Column(unique = true, length = 20)   // UNIQUE  (clave natural: microchip)
    private String microchip;

    @Column(precision = 6, scale = 2)     // DECIMAL(6,2) — para peso/dinero, NO double
    private BigDecimal pesoKg;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Transient                            // NO se persiste: es calculado
    private int edadEnAnios;
}`, { label: "@Entity · @Id · @GeneratedValue · @Column", collapse: false })}
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Annotation</th><th>Qué hace</th><th>Equivalente en el modelo de datos</th></tr></thead>
          <tbody>
            <tr><td><code>@Entity</code></td><td>Declara que la clase es persistente</td><td>Una tabla</td></tr>
            <tr><td><code>@Id</code></td><td>Marca la clave primaria</td><td>PRIMARY KEY</td></tr>
            <tr><td><code>@GeneratedValue</code></td><td>El valor lo genera la base/el ORM → <b>clave subrogada</b></td><td>AUTO_INCREMENT / SEQUENCE</td></tr>
            <tr><td><code>@Column</code></td><td>Nombre, <code>nullable</code>, <code>unique</code>, <code>length</code>, <code>precision/scale</code></td><td>NOT NULL, UNIQUE, VARCHAR(n), DECIMAL(p,s)</td></tr>
            <tr><td><code>@Transient</code></td><td>El atributo <b>no</b> se persiste</td><td>No existe la columna</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Estrategias de <code>@GeneratedValue</code>:</b> <code>IDENTITY</code> (autoincremental del motor),
          <code>SEQUENCE</code> (secuencia, típica en Postgres/Oracle), <code>TABLE</code> (tabla de contadores),
          <code>AUTO</code> (que elija el proveedor). Si usás una <b>clave natural</b> (nro. de serie), va
          <code>@Id</code> <b>sin</b> <code>@GeneratedValue</code>.</p>
        </div>

        <h2>Relaciones</h2>
        ${APP.code(`// ── ONE TO ONE: la FK (con UNIQUE) va del lado dependiente
@Entity
public class Mascota {
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "id_pref_alimentacion", unique = true)   // ← acá vive la FK
    private PreferenciaAlimentacion preferencia;
}

// ── MANY TO ONE / ONE TO MANY: la FK va SIEMPRE del lado "muchos"
@Entity
public class EventoMedico {                       // lado MUCHOS (dueño de la relación)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)   // optional=false → FK NOT NULL
    @JoinColumn(name = "id_mascota", nullable = false)
    private Mascota mascota;
}

@Entity
public class Mascota {                            // lado UNO (inverso)
    @OneToMany(mappedBy = "mascota",              // mappedBy = el atributo del otro lado
               cascade = CascadeType.ALL,         // composición: el historial no vive sin la mascota
               orphanRemoval = true)
    private List<EventoMedico> historial = new ArrayList<>();
}

// ── MANY TO MANY: tabla intermedia
@Entity
public class Mascota {
    @ManyToMany
    @JoinTable(name = "mascota_dispositivo",                       // ← la tabla intermedia
        joinColumns        = @JoinColumn(name = "id_mascota"),     // FK a esta entidad
        inverseJoinColumns = @JoinColumn(name = "nro_serie"))      // FK a la otra
    private Set<Dispositivo> dispositivos = new HashSet<>();
}`, { label: "@OneToOne · @ManyToOne · @OneToMany · @ManyToMany", collapse: false })}
        <div class="callout key">
          <div class="callout-title">🔑 Las 3 reglas que se cobran</div>
          <ol>
            <li><b>La FK va del lado “muchos”.</b> El lado “muchos” es el <b>dueño</b> de la relación
            (<code>@JoinColumn</code>); el lado “uno” es el <b>inverso</b> (<code>mappedBy</code>).</li>
            <li><b>Defaults de fetch:</b> <code>@ManyToOne</code> y <code>@OneToOne</code> son <b>EAGER</b>;
            <code>@OneToMany</code> y <code>@ManyToMany</code> son <b>LAZY</b>.</li>
            <li><b>Si la relación N:M tiene datos propios</b> (una nota, una fecha de vinculación, una cantidad),
            <b>no uses @ManyToMany</b>: creá la entidad intermedia explícita con dos <code>@ManyToOne</code>.
            Es exactamente el caso <code>alumno_materia</code> con las notas.</li>
          </ol>
        </div>

        <h2>Element Collection (colecciones de tipos simples)</h2>
        ${APP.code(`@Entity
public class Mascota {
    // Una lista de valores simples NO es una entidad: no tiene identidad propia.
    // Hibernate crea una TABLA HIJA con FK a mascota. Resuelve la 1FN.
    @ElementCollection
    @CollectionTable(name = "mascota_alergia",
                     joinColumns = @JoinColumn(name = "id_mascota"))
    @Column(name = "alergia")
    private Set<String> alergias = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "mascota_horario_paseo",
                     joinColumns = @JoinColumn(name = "id_mascota"))
    @Column(name = "hora")
    private List<LocalTime> horariosRecomendados = new ArrayList<>();
}
// Tabla generada: mascota_alergia(id_mascota FK, alergia)  → PK compuesta`, { label: "@ElementCollection", collapse: false })}
        <div class="callout tip">
          <p><b>Cuándo ElementCollection y cuándo entidad:</b> si los elementos <b>no tienen identidad ni ciclo de vida
          propio</b> y nunca se consultan por sí solos → <code>@ElementCollection</code>. Si hay que buscarlos,
          referenciarlos desde otro lado o tienen atributos propios → <b>entidad</b> con <code>@OneToMany</code>.</p>
        </div>

        <h2>Embedded &amp; Embeddable (Value Objects)</h2>
        ${APP.code(`@Embeddable                      // NO es una entidad: no tiene @Id
public class Coordenadas {
    private BigDecimal latitud;
    private BigDecimal longitud;
}

@Embeddable
public class Dinero {
    @Column(precision = 12, scale = 2) private BigDecimal monto;
    @Column(length = 3)                private String moneda;   // ISO: ARS, USD
}

@Entity
public class Domicilio {
    @Id @GeneratedValue private Long id;
    private String direccion;

    @Embedded                    // ← las columnas de Coordenadas viven EN LA TABLA domicilio
    private Coordenadas coordenadas;
}
// Tabla: domicilio(id PK, direccion, latitud, longitud)  → una sola tabla`, { label: "@Embeddable / @Embedded", collapse: false })}
        <div class="callout key">
          <p><b>Para qué sirve en el parcial:</b> es la respuesta a “cómo persistís un <b>Value Object</b>”. El VO no tiene
          identidad, así que no merece tabla propia: se <b>embebe</b> en la tabla del dueño. Mantiene el modelo de objetos
          rico (Dinero, Dirección, Periodo) <b>sin ensuciar</b> el modelo de datos.</p>
        </div>

        <h2>Mapeo de ENUMs</h2>
        ${APP.code(`// ── SIMPLE
public enum EstadoBicicleta { DISPONIBLE, OCUPADA, EN_MANTENIMIENTO }

@Entity
public class Bicicleta {
    @Enumerated(EnumType.STRING)     // ✅ guarda "DISPONIBLE" (legible y estable)
    @Column(length = 20, nullable = false)
    private EstadoBicicleta estado;
}
// ❌ EnumType.ORDINAL guarda 0,1,2 → si mañana alguien reordena el enum,
//    TODOS los datos históricos quedan mal. Nunca uses ORDINAL.

// ── CON CONVERTER (cuando querés controlar el valor que va a la base)
public enum NivelActividad {
    MUY_ACTIVO("MA"), ACTIVO("A"), TRANQUILO("T"), PEREZOSO("P");
    private final String codigo;
    NivelActividad(String c) { this.codigo = c; }
    public String getCodigo() { return codigo; }
    public static NivelActividad desde(String c) { /* ... */ }
}

@Converter(autoApply = true)
public class NivelActividadConverter
        implements AttributeConverter<NivelActividad, String> {
    @Override public String convertToDatabaseColumn(NivelActividad n) {
        return n == null ? null : n.getCodigo();
    }
    @Override public NivelActividad convertToEntityAttribute(String c) {
        return c == null ? null : NivelActividad.desde(c);
    }
}`, { label: "@Enumerated y AttributeConverter", collapse: false })}
        <div class="callout tip">
          <p><b>En el modelo de datos</b>, un enum se traduce a una columna <code>VARCHAR</code> con un
          <b>CHECK</b> que limita los valores. <b>Pero:</b> si el enunciado dice que los valores los
          <b>configura un administrador</b> o que “pueden agregarse más”, <b>no es un enum</b>: es una <b>tabla maestra</b>
          con FK (si no, agregar un valor exige un deploy).</p>
        </div>

        <h2>Las 4 estrategias de mapeo de herencia ⭐</h2>
        <p>Es el impedance mismatch más preguntado. Hay que saber <b>cuántas tablas genera cada una</b> y
        <b>cuándo conviene</b>.</p>

        <h3>MappedSuperclass</h3>
        ${APP.code(`@MappedSuperclass                 // ← NO es una entidad: no hay tabla para ella
public abstract class EntidadBase {
    @Id @GeneratedValue protected Long id;
    protected Boolean activo = true;
}

@Entity public class Mascota     extends EntidadBase { private String nombre; }
@Entity public class Dispositivo extends EntidadBase { private String modelo; }

// TABLAS: mascota(id, activo, nombre) · dispositivo(id, activo, modelo)
// NO existe la tabla entidad_base. No hay consultas polimórficas.`, { label: "MAPPED SUPERCLASS", collapse: false })}
        <p><b>La cátedra:</b> “los atributos de la superclase son persistidos en las tablas de las clases hijas; y <b>la
        superclase no es considerada una Entidad</b>”. Se usa cuando la superclase exhibe <b>únicamente comportamiento</b>
        y/o <b>uno o pocos atributos en común</b>. El uso más común: todas las clases persistentes tienen una
        <b>PK subrogada</b> y/o un campo <b>“activo”</b> (booleano), pero <b>entre ellas no hay nada más en común</b>.</p>

        <h3>SINGLE_TABLE (una única tabla)</h3>
        ${APP.code(`@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_dispositivo",        // ← campo discriminador
                     discriminatorType = DiscriminatorType.STRING)
public abstract class Dispositivo {
    @Id private String nroSerie;                        // clave natural
    private String modelo;
    private Integer bateriaPct;
}

@Entity @DiscriminatorValue("SENSOR")
public class Sensor extends Dispositivo { private Integer frecuenciaMuestreoSeg; }

@Entity @DiscriminatorValue("ACTUADOR")
public class Actuador extends Dispositivo { private String tipoAccion; }

// TABLA ÚNICA:
// dispositivo(nro_serie PK, tipo_dispositivo, modelo, bateria_pct,
//             frecuencia_muestreo_seg,  ← NULL si es Actuador
//             tipo_accion)              ← NULL si es Sensor`, { label: "SINGLE TABLE", collapse: false })}
        <p><b>La cátedra:</b> genera <b>una única tabla</b> con una columna por cada atributo persistente de la superclase
        <b>+ una por cada atributo de cada clase hija</b>, más una columna que actúa de <b>campo discriminador</b>, que
        indica a qué clase pertenece la instancia/fila. Si se persiste una instancia de A, quedan nulas las P columnas de
        B, y viceversa.</p>
        <p><b>✅</b> Buena <b>performance</b>: se consulta una única tabla (sin JOINs ni UNIONs).
        <b>⚠️</b> Varias columnas <b>podrían ser nulas</b> → no se pueden declarar NOT NULL las obligatorias de los
        subtipos, y la tabla se ensancha.</p>

        <h3>JOINED (una tabla por clase, con JOIN)</h3>
        ${APP.code(`@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Dispositivo {
    @Id private String nroSerie;
    private String modelo;
}
@Entity public class Sensor   extends Dispositivo { private Integer frecuenciaMuestreoSeg; }
@Entity public class Actuador extends Dispositivo { private String tipoAccion; }

// TABLAS: dispositivo(nro_serie PK, modelo)
//         sensor  (nro_serie PK  → FK a dispositivo, frecuencia_muestreo_seg)
//         actuador(nro_serie PK  → FK a dispositivo, tipo_accion)
// Recuperar un Sensor completo exige un JOIN entre sensor y dispositivo.`, { label: "JOINED", collapse: false })}
        <p><b>La cátedra:</b> genera <b>una tabla por la superclase y N tablas más, una por cada clase hija</b>. La tabla
        de la superclase contiene sólo sus atributos (y <b>opcionalmente el discriminador</b>); cada tabla hija, los
        propios. <b>Cada PK de las tablas hijas es a su vez una FK a la tabla de la superclase.</b> Para recuperar un
        objeto con todos sus atributos, <b>el ORM debe joinear</b>.</p>
        <p><b>✅</b> Es la más <b>normalizada</b>: sin columnas nulas, permite NOT NULL por subtipo.
        <b>⚠️</b> Cada lectura paga <b>JOINs</b>.</p>

        <h3>TABLE_PER_CLASS (una tabla por clase concreta)</h3>
        ${APP.code(`@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Dispositivo {
    @Id private String nroSerie;
    private String modelo;
}
@Entity public class Sensor   extends Dispositivo { private Integer frecuenciaMuestreoSeg; }
@Entity public class Actuador extends Dispositivo { private String tipoAccion; }

// TABLAS: sensor  (nro_serie PK, modelo, frecuencia_muestreo_seg)
//         actuador(nro_serie PK, modelo, tipo_accion)
// NO hay tabla para Dispositivo. "modelo" se repite en cada tabla.
// Para recuperar polimórficamente TODOS los dispositivos, el ORM hace UNION.`, { label: "TABLE PER CLASS", collapse: false })}
        <p><b>La cátedra:</b> genera <b>N tablas: una por cada clase hija concreta</b>. <b>Todos los atributos de la
        superclase se persisten en cada una</b> de esas tablas. Para recuperar <b>polimórficamente</b> todos los objetos,
        el ORM debe realizar <b>UNIONs</b> entre todas las tablas de las clases hijas.</p>
        <p><b>✅</b> Cada subtipo es autosuficiente. <b>⚠️</b> Atributos comunes <b>duplicados</b> en el esquema y
        <b>UNIONs</b> en las consultas polimórficas; además la PK debe ser única entre tablas (no sirve IDENTITY).</p>

        <h3>Tabla comparativa (la que hay que escribir en el parcial)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia</th><th>Tablas (1 super + N hijas)</th><th>Consulta polimórfica</th><th>✅ Pro</th><th>⚠️ Contra</th><th>Elegila cuando…</th></tr></thead>
          <tbody>
            <tr><td><b>SINGLE_TABLE</b></td><td><b>1</b> (con discriminador)</td><td>Directa, sin joins</td><td>Mejor performance</td><td>Muchas columnas NULL; sin NOT NULL por subtipo</td><td>Pocos atributos propios por subtipo y mucha lectura polimórfica</td></tr>
            <tr><td><b>JOINED</b></td><td><b>1 + N</b> (PK hija = FK a la super)</td><td>Con <b>JOIN</b></td><td>Normalizada, sin nulos</td><td>JOINs en cada lectura</td><td>Cada subtipo tiene muchos atributos propios y obligatorios</td></tr>
            <tr><td><b>TABLE_PER_CLASS</b></td><td><b>N</b> (sólo las concretas)</td><td>Con <b>UNION</b></td><td>Subtipos independientes</td><td>Duplica los atributos comunes; UNIONs</td><td>Casi nunca se consulta polimórficamente y los subtipos son muy distintos</td></tr>
            <tr><td><b>MAPPED_SUPERCLASS</b></td><td><b>N</b> (la super <b>no es entidad</b>)</td><td><b>No existe</b></td><td>Simple; reutiliza código</td><td>No hay polimorfismo en consultas ni relaciones a la super</td><td>La super sólo aporta comportamiento o 1-2 atributos técnicos (id, activo)</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🎯 Frase para justificar</div>
          <p>“Mapeo la jerarquía Dispositivo → Sensor/Actuador con <b>SINGLE_TABLE</b> y campo discriminador, porque los
          subtipos agregan pocos atributos propios y <b>todas las consultas son polimórficas</b> (‘los dispositivos del
          domicilio’): me ahorro JOINs y UNIONs. Asumo el costo de columnas nulables, que es bajo en este caso. Si los
          subtipos tuvieran muchos atributos obligatorios propios, elegiría <b>JOINED</b> para no perder las restricciones
          NOT NULL.”</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2hQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2hQuiz"), [
        { n: 1, topic: "Herencia", type: "mc", q: "Una superclase y 3 hijas con <b>JOINED</b>. ¿Cuántas tablas genera?", options: [
          { t: "4: una por la superclase y una por cada hija", ok: true },
          { t: "1 con discriminador", ok: false },
          { t: "3, una por cada clase concreta", ok: false },
        ], explain: "JOINED = 1 + N. La PK de cada tabla hija es a su vez FK a la tabla de la superclase; recuperar el objeto completo exige JOIN." },
        { n: 2, topic: "Herencia", type: "mc", q: "¿Cuál estrategia requiere <b>UNION</b> para recuperar polimórficamente?", options: [
          { t: "TABLE_PER_CLASS", ok: true },
          { t: "SINGLE_TABLE", ok: false },
          { t: "JOINED", ok: false },
        ], explain: "TABLE_PER_CLASS genera una tabla por clase concreta sin tabla padre: traer 'todos' exige unir todas las tablas con UNION." },
        { n: 3, topic: "Herencia", type: "vf", q: "Con MappedSuperclass la superclase es una entidad y tiene su propia tabla.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "La superclase NO es considerada una entidad: sus atributos se persisten en las tablas de las hijas y no hay tabla para ella." },
        { n: 4, topic: "Relaciones", type: "mc", q: "En un <code>@OneToMany</code> bidireccional, ¿dónde vive la FK?", options: [
          { t: "En la tabla del lado “muchos”, que es el dueño con @JoinColumn; el lado “uno” usa mappedBy", ok: true },
          { t: "En la tabla del lado “uno”", ok: false },
          { t: "En una tabla intermedia", ok: false },
        ], explain: "La FK siempre va del lado muchos. mappedBy indica que ese lado es el inverso y no crea columna." },
        { n: 5, topic: "Enums", type: "mc", q: "¿Por qué <code>EnumType.ORDINAL</code> es peligroso?", options: [
          { t: "Guarda la posición (0,1,2): si se reordena el enum, los datos históricos quedan mal", ok: true },
          { t: "Ocupa más espacio que STRING", ok: false },
          { t: "No funciona con converters", ok: false },
        ], explain: "Usá siempre EnumType.STRING (o un converter si querés controlar el código almacenado)." },
        { n: 6, topic: "VO", type: "mc", q: "Un Value Object “Dinero (monto + moneda)” se persiste…", options: [
          { t: "Como @Embeddable, embebido en la tabla del dueño (no tiene identidad propia)", ok: true },
          { t: "Como @Entity con su propia tabla y PK", ok: false },
          { t: "Como @ElementCollection", ok: false },
        ], explain: "Sin identidad propia → @Embeddable/@Embedded: sus columnas viven en la tabla de la entidad dueña." },
        { n: 7, topic: "Catálogos", type: "open", q: "El enunciado dice: “los tipos de evento relevante son configurados previamente en la plataforma por un administrador”. ¿Enum o tabla? Justificá.", answer: "Tabla maestra con FK (TIPO_EVENTO(id PK, nombre, severidad, accionable)). Un enum está fijo en el código: agregar un tipo exigiría modificar la clase y hacer un deploy, lo que contradice el requerimiento de que el administrador los configure desde la plataforma. Con tabla maestra, dar de alta un tipo es un INSERT. Si además el enunciado dijera “todos los posibles eventos ya son conocidos” para los valores que el modelo de IA emite, esos sí pueden ser un enum con CHECK, porque son un conjunto cerrado definido por el modelo, no por el usuario." },
      ]);
    },
  });
})();
