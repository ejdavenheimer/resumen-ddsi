/* ============================================================
   P2 · ORM: impedance mismatch, arquitecturas, hidratación, caché
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-orm",
    title: "ORM e Impedance Mismatch",
    tag: "🔄",
    group: "Persistencia (P2)",
    resumen: "Data Mapper vs Active Record, hidratación, lazy/eager, cascada, caché",
    keywords: ["orm", "impedance mismatch", "mapeo objeto relacional", "active record", "data mapper", "entity manager", "hidratacion", "lazy", "eager", "cascada", "cascade", "cache primer nivel", "segundo nivel", "sessionfactory", "read_only", "read_write", "nonstrict"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Mapeo Objeto-Relacional (ORM)</h1>
          <p class="lead">Todo este tema existe por una sola razón: “la persistencia de un sistema escrito bajo el paradigma de objetos, en una base de datos relacional, <b>no es directa</b>”.</p>
        </div>


        <div class="callout key">
          <div class="callout-title">PRIMERO: ¿cuál es el problema? (sin palabras raras)</div>
          <p class="mini"><b>Tu programa guarda la información de una forma y la base de datos la guarda de otra, y
          no encajan.</b> Eso es todo. El resto son nombres.</p>
          <p class="mini"><b>En el programa</b> tenés <b>objetos</b>, y un objeto puede <b>tener cosas adentro</b>:
          otro objeto, una lista, un conjunto.</p>
          <p class="mini"><b>En la base</b> tenés <b>filas y columnas</b>, y una celda <b>no puede tener cosas
          adentro</b>: sólo un valor simple (un número, un texto, una fecha).</p>
          <div class="grid-2">
            <div class="card">
              <p class="mini"><b>Un objeto Mascota</b></p>
              <p class="mini" style="font-family:monospace;font-size:7.4pt">nombre = "Pepa"<br>
              dueño = <b>→ otro objeto Usuario</b><br>
              historial = <b>[ evento, evento, evento ]</b><br>
              alergias = <b>{ "pollo", "maní" }</b></p>
              <p class="mini">Tiene <b>un objeto adentro</b> y <b>dos listas adentro</b>.</p>
            </div>
            <div class="card">
              <p class="mini"><b>La tabla mascota</b></p>
              <div class="table-wrap"><table class="data">
                <thead><tr><th>id</th><th>nombre</th><th>id_usuario</th></tr></thead>
                <tbody><tr><td>7</td><td>Pepa</td><td>3</td></tr></tbody>
              </table></div>
              <p class="mini"><b>Plana.</b> El dueño se volvió <b>un número</b> (una FK) y las listas <b>tuvieron que
              irse a otras tablas</b>.</p>
            </div>
          </div>
          <p class="mini"><b>ORM = el traductor</b> (<i>Object-Relational Mapping</i>, mapeo objeto-relacional). Es la
          técnica de convertir objetos en filas y filas en objetos — y también se les dice ORM a los
          <b>frameworks que lo hacen</b> por vos, como <b>Hibernate</b>, para no escribir el SQL a mano.</p>
          <p class="mini"><b>IMPEDANCE MISMATCH = el nombre del desencaje.</b> Son <b>las cosas que el mundo de los
          objetos tiene y el mundo de las tablas no</b>, y que el traductor tiene que resolver como pueda. El término
          viene de la electrónica (dos circuitos que no acoplan y pierden energía); acá significa simplemente
          <b>“esto no entra tal cual, hay que decidir cómo lo meto”</b>.</p>
          <p class="mini"><b>Son cuatro desencajes, y son cuatro decisiones que vas a tener que justificar en el
          parcial:</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Desencaje</th><th>En el programa…</th><th>En la tabla…</th><th>La decisión que tomás</th></tr></thead>
            <tbody>
              <tr><td><b>1 · Identidad</b><br><span class="mini">¿quién es quién?</span></td><td>Dos objetos son “el mismo” si <b>ocupan el mismo lugar en memoria</b></td><td>Dos filas son la misma si tienen <b>la misma clave primaria</b></td><td><b>¿Qué uso de PK?</b> Un dato real del negocio (<b>clave natural</b>: CUIT, nro. de serie) o <b>un número inventado</b> que no significa nada (<b>clave subrogada</b>: el <code>id</code> autoincremental). <b>Por defecto, subrogada</b> + <code>UNIQUE</code> en el dato real, así no se pierde la restricción</td></tr>
              <tr><td><b>2 · Tipos de dato</b><br><span class="mini">¿cómo lo escribo?</span></td><td><code>String nombre</code>, sin decir cuánto mide. Fechas, booleanos y <b>enums</b> que el lenguaje entiende solo</td><td>Hay que declarar <code>VARCHAR(80)</code>, elegir <code>DATE</code> o <code>DATETIME</code>, y el enum <b>no existe</b></td><td><b>Poner longitudes y precisión</b>, usar <b>DECIMAL</b> para plata (DOUBLE redondea mal) y guardar los enums <b>como texto</b> con un <code>CHECK</code> — nunca como número de posición</td></tr>
              <tr><td><b>3 · Cardinalidad</b><br><span class="mini">¿para qué lado apunta?</span></td><td>Desde la Mascota llegás al Dueño <b>y desde el Dueño volvés a sus Mascotas</b>: se navega <b>en los dos sentidos</b></td><td>Hay <b>una sola FK</b>, y apunta <b>para un solo lado</b>. Las tablas no se navegan “de vuelta”</td><td><b>La FK va del lado “muchos”</b> y el ORM <b>simula</b> la vuelta (en Hibernate, <code>mappedBy</code>). Y las <b>N:M no existen</b>: se parten en dos 1:N con una <b>tabla intermedia</b></td></tr>
              <tr><td><b>4 · Herencia</b><br><span class="mini">el más preguntado</span></td><td>Sensor y Actuador <b>heredan</b> de Dispositivo y comparten sus atributos</td><td><b>La herencia directamente NO EXISTE.</b> Una tabla no puede “heredar” de otra</td><td><b>Hay que aplastarla</b> y elegir cómo: <b>una sola tabla</b> con todo (SINGLE_TABLE), <b>una por clase</b> (JOINED / TABLE_PER_CLASS) o <b>ninguna para el padre</b> (MappedSuperclass). <b>Se elige Y se justifica</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cómo lo decís en el parcial:</b> “Resolví los <b>impedance mismatches</b> así:
          <b>identidad</b> con PK subrogada y UNIQUE en la clave natural; <b>tipos</b> con longitudes declaradas y
          DECIMAL para los importes; <b>cardinalidad</b> con una sola FK del lado muchos y tabla intermedia para las
          N:M; y la <b>herencia</b> con [estrategia] porque [razón].” <b>Esa frase sola ya es medio punto de
          justificación.</b></p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Las definiciones textuales (por si las piden así)</div>
          <p><b>ORM (la técnica):</b> “técnica usada para convertir los tipos de datos con los que trabaja un lenguaje
          orientado a objetos a tipos de dato con los que trabaja un sistema de base de datos relacional”.</p>
          <p><b>ORM (la herramienta):</b> también se llaman ORMs a los <b>frameworks que implementan la técnica</b>.
          Introducen una <b>capa de abstracción</b> entre la base y el desarrollador, evitando escribir consultas “a mano”
          para recuperar, insertar, actualizar o eliminar.</p>
          <p><b>Impedance mismatch:</b> al buscar la correspondencia entre estos dos “mundos”, existen características
          <b>difíciles de imitar</b>. A ese <b>desajuste</b> se lo llama impedance mismatch.</p>
        </div>

        <h2>Los 4 impedance mismatches (memorizalos en orden)</h2>
        ${APP.uml(`graph LR
    IM["Impedance Mismatch"]
    IM --> I["1 · Identidad"]
    IM --> T["2 · Conversión de tipos"]
    IM --> C["3 · Cardinalidad"]
    IM --> H["4 · Herencia"]
    style IM fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Los cuatro desajustes")}

        <div class="table-wrap"><table class="data">
          <thead><tr><th>#</th><th>Desajuste</th><th>El problema</th><th>Cómo se resuelve</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><b>Identidad</b></td><td>Un objeto cumple con la característica de <b>unicidad</b>; un registro necesita una <b>identificación unívoca</b>. No son lo mismo: dos objetos pueden ser “iguales” sin ser el mismo registro.</td><td><b>Clave natural</b> (un campo propio que identifica: CUIT, nro. de teléfono, nro. de serie) o <b>clave subrogada</b> (ficticia: autoincremental, UUID). La subrogada es el default; a la natural se le agrega UNIQUE.</td></tr>
            <tr><td>2</td><td><b>Conversión de tipos</b></td><td>No hay correlación directa: <code>String</code> sin límite vs. <code>VARCHAR(n)</code>; precisión de decimales y rangos; <code>LocalDate</code> de Java vs. Date/Datetime/Time del motor; booleanos; <b>enumerados</b>.</td><td>Declarar longitudes y precisión (<code>@Column(length, precision, scale)</code>), usar DECIMAL para dinero, y <b>converters</b> para los enums.</td></tr>
            <tr><td>3</td><td><b>Cardinalidad</b></td><td>En POO las relaciones pueden ser uni o <b>bidireccionales, con navegabilidad bidireccional</b>; las relaciones entre entidades de una BD relacional <b>no son bidireccionales</b> (salvo algunos casos).</td><td>Una sola FK del lado “muchos”; el ORM simula la navegación inversa (<code>mappedBy</code>). N:M → tabla intermedia.</td></tr>
            <tr><td>4</td><td><b>Herencia</b></td><td>En POO la herencia permite reutilizar y extender; <b>el concepto no existe en el mundo relacional</b>. ¿Cuántas tablas se generan? ¿Cómo sabe el ORM qué clase concreta instanciar e hidratar?</td><td>Las 4 estrategias: <b>SINGLE_TABLE</b>, <b>JOINED</b>, <b>TABLE PER CLASS</b>, <b>MAPPED SUPERCLASS</b> → <a class="inline" data-go="p2-hibernate">detalle acá</a>.</td></tr>
          </tbody>
        </table></div>

        <h2>Arquitecturas de ORM: Active Record vs. Data Mapper</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Active Record</h3>
            <p>El ORM <b>decora las clases de entidades del dominio</b> agregándoles funcionalidades/responsabilidades de
            persistencia: alta (<code>save</code>), baja (<code>delete</code>), modificación (<code>update</code>) y
            búsqueda (<code>find</code>, <code>findBy</code>, <code>findAll</code>).</p>
            <p><b>El objeto se persiste a sí mismo.</b></p>
            <p class="mini">Ejemplos: ActiveRecord de Rails, Eloquent (Laravel), Django ORM.</p>
            <p><b>⚠️ Costo de diseño:</b> la entidad tiene <b>dos responsabilidades</b> (reglas de negocio + persistencia) →
            rompe <b>Responsabilidad Única</b> y acopla el dominio a la infraestructura.</p>
          </div>
          <div class="card">
            <h3>Data Mapper</h3>
            <p>El ORM agrega un <b>componente intermedio</b> entre la base y las entidades de dominio: el
            <b>“entity manager”</b>, que lleva la responsabilidad de buscar, agregar, modificar y eliminar objetos de
            las entidades persistentes.</p>
            <p><b>La entidad no sabe que se persiste.</b></p>
            <p class="mini">Ejemplos: Hibernate / JPA, Doctrine, SQLAlchemy (modo clásico).</p>
            <p><b>✅ Ventaja:</b> el dominio queda limpio y testeable; se alinea con el patrón Repositorio y con
            <a class="inline" data-go="p2-documentar">Clean / Hexagonal</a>.</p>
          </div>
        </div>
        ${APP.code(`// ── ACTIVE RECORD: la entidad se persiste a sí misma
Pedido pedido = new Pedido(cliente);
pedido.agregarItem(producto, 2);
pedido.save();                          // ← responsabilidad de persistencia EN la entidad
List<Pedido> pendientes = Pedido.findBy("estado", "PENDIENTE");

// ── DATA MAPPER: un componente externo (entity manager) persiste
Pedido pedido = new Pedido(cliente);
pedido.agregarItem(producto, 2);
entityManager.persist(pedido);          // ← la entidad no sabe nada de la base
List<Pedido> pendientes = pedidoRepository.buscarPendientes();`, { label: "Las dos arquitecturas", collapse: false })}

        <h2>Proceso de hidratación</h2>
        <p class="mini"><b>HIDRATACIÓN, en criollo:</b> la base te devuelve <b>una fila</b> (números y textos sueltos); el ORM tiene que <b>armar el objeto</b> con eso. “Hidratar” es <b>rellenar el objeto vacío con los datos de la fila</b>, como quien infla un globo desvinflado. Son <b>dos pasos</b>: ① <b>crear</b> el objeto vacío (después de hacer el SELECT) y ② <b>llenarle los atributos</b> con los valores que vinieron.</p>
        <p class="mini"><b>LAZY vs EAGER, en criollo:</b> cuando traés una Mascota, <b>¿le traés también sus 200 eventos médicos?</b> <b>EAGER</b> = sí, los traigo <b>por las dudas</b> (y si no los usás, trajiste 200 filas al pedo). <b>LAZY</b> = no, los dejo para después; <b>recién voy a buscarlos a la base si alguien los pide</b>. Por eso las <b>listas</b> son lazy por defecto y las referencias de a uno (<code>@ManyToOne</code>) son eager. <b>El riesgo del lazy</b> es el <b>N+1</b>: si listás 100 mascotas y dentro de un <code>for</code> le pedís el dueño a cada una, el ORM hace <b>1 consulta + 100 consultas</b> sin que lo veas. Se cura pidiendo las dos cosas juntas <b>en esa consulta puntual</b> (<code>JOIN FETCH</code>), no cambiando todo a eager.</p>
        
        <div class="callout key">
          <div class="callout-title">🔑 Pregunta de teoría clásica: “¿cómo recupera un ORM un objeto desde la base?”</div>
          <p>Ejecuta el <b>proceso de hidratación</b>, que consiste en:</p>
          <ol>
            <li><b>Instanciar</b> la clase del objeto que se quiere recuperar (habiendo recuperado antes los datos mínimos mediante la ejecución de una sentencia SQL).</li>
            <li><b>Popular</b> el objeto: asignarle a cada uno de sus atributos (aquellos <b>no marcados como lazy</b>) los valores recuperados desde la base de datos.</li>
          </ol>
        </div>
        ${APP.uml(`sequenceDiagram
    participant S as Service
    participant EM as EntityManager (ORM)
    participant DB as Base de datos
    S->>EM: find(Pedido, 42)
    EM->>DB: SELECT * FROM pedido WHERE id = 42
    DB-->>EM: fila (datos mínimos)
    Note over EM: 1 · Instancia la clase Pedido
    Note over EM: 2 · Popula los atributos EAGER
    Note over EM: Los LAZY quedan como proxy
    EM-->>S: objeto Pedido hidratado
    S->>EM: pedido.getItems()
    EM->>DB: SELECT * FROM item WHERE id_pedido = 42
    DB-->>EM: filas
    EM-->>S: colección poblada (lazy resuelto)`, "Hidratación con lazy loading")}

        <h2>Lazy vs. Eager loading</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th></th><th>Lazy loading</th><th>Eager loading</th></tr></thead>
          <tbody>
            <tr><td>Definición</td><td>Realiza la carga en memoria de los objetos <b>sólo al momento de su utilización</b></td><td>Carga en memoria los objetos <b>independientemente de si van a ser utilizados o no</b></td></tr>
            <tr><td>Durante la hidratación</td><td>El ORM <b>no</b> setea el atributo; lo popula de forma <b>transparente</b> cuando se lo llama explícitamente</td><td>El ORM lo setea en el momento</td></tr>
            <tr><td>✅ Conviene cuando</td><td>Colecciones grandes que no siempre se usan (<code>@OneToMany</code> por defecto es LAZY)</td><td>Relaciones chicas que siempre se necesitan (<code>@ManyToOne</code> por defecto es EAGER)</td></tr>
            <tr><td>⚠️ Riesgo</td><td><b>N+1 queries</b> (1 consulta + N consultas dentro de un ciclo) y <code>LazyInitializationException</code> si la sesión ya se cerró</td><td>Traer media base en memoria sin necesidad; consultas con muchos JOINs</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>El problema N+1 y su solución</b> (muy buen detalle para mencionar): si listás 100 pedidos y para cada uno
          accedés a su cliente lazy, el ORM hace 1 + 100 consultas. Se resuelve con un <code>JOIN FETCH</code> en la
          consulta puntual (no cambiando el mapeo a EAGER globalmente).</p>
        </div>

        <h2>Métodos de cascada</h2>
        <div class="callout key">
          <p>“Las relaciones entre entidades a menudo <b>dependen de la existencia de otra entidad</b>. Por ejemplo
          Persona–Dirección: si una dirección pertenece siempre a una persona, sin la Persona la Dirección no tiene
          significado propio; al eliminar la Persona, la Dirección también debería eliminarse.”</p>
          <p>“La <b>cascada</b> implica que, cuando realicemos alguna acción en la entidad objetivo, <b>la misma acción se
          aplicará a la entidad asociada</b>.”</p>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Qué propaga</th></tr></thead>
          <tbody>
            <tr><td><b>ALL</b></td><td><b>Todas</b> las operaciones de la entidad principal a la secundaria</td></tr>
            <tr><td><b>PERSIST</b></td><td>El guardado: al guardar la principal, también se guarda la secundaria</td></tr>
            <tr><td><b>MERGE</b></td><td>La actualización: al actualizar la principal, también se actualiza la secundaria</td></tr>
            <tr><td><b>REMOVE</b></td><td>La eliminación: al eliminar la principal, también se elimina la secundaria</td></tr>
            <tr><td><b>REFRESH</b></td><td>El “refresh” (re-popular todos los atributos del objeto desde la base)</td></tr>
            <tr><td><b>DETACH</b></td><td>El “detach” (quitar la entidad del contexto persistente)</td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p><b>Regla de diseño:</b> <code>cascade = ALL</code> va donde hay <b>composición</b> (rombo lleno ◆: la parte no
          vive sin el todo). Donde hay <b>agregación</b> (◇), no se cascadea el REMOVE: borrar un pedido no debe borrar al
          cliente.</p>
        </div>

        <h2>Caché del ORM</h2>
        <p>Los ORM pueden almacenar en caché, <b>de forma transparente</b>, los datos recuperados del medio persistente,
        reduciendo el costo de acceso (tiempo y recursos) para los datos consultados con alta frecuencia.</p>
        <div class="grid-2">
          <div class="card">
            <h3>Caché de primer nivel</h3>
            <ul>
              <li>Alcance de <b>sesión</b>: garantiza que cada instancia de una entidad <b>se cargue sólo una vez</b> en el contexto persistente.</li>
              <li>Al <b>cerrarse la sesión, termina</b>.</li>
              <li>Permite que las <b>sesiones concurrentes</b> trabajen con instancias de forma <b>aislada</b>.</li>
              <li><b>Siempre está activa</b> (no se configura).</li>
            </ul>
          </div>
          <div class="card">
            <h3>Caché de segundo nivel</h3>
            <ul>
              <li>Alcance de <b>SessionFactory</b> (en Hibernate): <b>compartida por todas las sesiones</b> creadas con la misma factory.</li>
              <li><b>No todos los ORM la tienen</b>; hay que habilitarla.</li>
              <li>Al buscar por id: si está en 1er nivel, se devuelve de ahí; si no, pero su estado está en 2do nivel, se obtiene de ahí, <b>se hidrata</b> el objeto y se devuelve; si no está en ninguna, búsqueda e hidratación común.</li>
            </ul>
          </div>
        </div>
        <h3>Estrategias de concurrencia (caché de 2º nivel)</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia</th><th>Comportamiento</th></tr></thead>
          <tbody>
            <tr><td><b>READ_ONLY</b></td><td>Para entidades que <b>nunca cambian</b>. Muy adecuada (y la más rápida).</td></tr>
            <tr><td><b>NONSTRICT_READ_WRITE</b></td><td>La caché se actualiza <b>después</b> de confirmarse la transacción que cambió los datos. Existe una <b>pequeña ventana</b> en la que se pueden obtener datos obsoletos. Adecuada si se tolera una mínima <b>inconsistencia eventual</b>.</td></tr>
            <tr><td><b>READ_WRITE</b></td><td>Garantiza <b>consistencia fuerte</b> mediante <b>bloqueos “suaves”</b>: al actualizar una entidad en caché se guarda un soft lock que se libera al confirmar la transacción; las transacciones concurrentes que accedan a registros bloqueados <b>van directo al medio persistente</b>.</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Representación interna de la caché (dato fino)</div>
          <ul>
            <li>Las entidades <b>no se almacenan como objetos</b>: se guarda <b>sólo su estado</b> (los valores de los atributos).</li>
            <li>Los atributos <b>transitorios no se guardan</b>.</li>
            <li>Las <b>colecciones no se guardan</b> (a menos que se explicite lo contrario).</li>
            <li>En las relaciones <b>xToOne</b> se almacena <b>sólo el id</b> de la entidad externa.</li>
          </ul>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2ormQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2ormQuiz"), [
        { n: 1, topic: "Arquitecturas", type: "mc", q: "Hibernate es un ORM de arquitectura…", options: [
          { t: "Data Mapper: agrega un entity manager intermedio y la entidad no sabe que se persiste", ok: true },
          { t: "Active Record: decora la entidad con save/delete/find", ok: false },
          { t: "Ninguna: es un framework web", ok: false },
        ], explain: "Active Record decora la entidad de dominio con responsabilidades de persistencia (Rails, Eloquent); Data Mapper agrega el entity manager (Hibernate/JPA, Doctrine)." },
        { n: 2, topic: "Hidratación", type: "mc", q: "Los dos pasos de la hidratación son…", options: [
          { t: "Instanciar la clase y popular los atributos no marcados como lazy", ok: true },
          { t: "Abrir la transacción y hacer el commit", ok: false },
          { t: "Validar el esquema y generar el SQL", ok: false },
        ], explain: "1) Instanciar (previo SELECT de los datos mínimos). 2) Popular los atributos eager; los lazy se poblarán cuando se los llame explícitamente." },
        { n: 3, topic: "Caché", type: "mc", q: "¿Cuál es el alcance de la caché de primer nivel?", options: [
          { t: "La sesión: termina cuando la sesión se cierra", ok: true },
          { t: "La SessionFactory: compartida por todas las sesiones", ok: false },
          { t: "El clúster entero", ok: false },
        ], explain: "1er nivel = sesión (siempre activa, aísla instancias entre sesiones concurrentes). 2do nivel = SessionFactory (compartida, opcional)." },
        { n: 4, topic: "Caché", type: "vf", q: "En la caché de segundo nivel las colecciones se guardan por defecto.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "No se guardan a menos que se explicite lo contrario. Tampoco los atributos transitorios; y en las relaciones xToOne se guarda sólo el id." },
        { n: 5, topic: "Cascada", type: "mc", q: "Persona–Dirección, donde la dirección no tiene sentido sin la persona. ¿Qué cascada corresponde?", options: [
          { t: "REMOVE (o ALL): al eliminar la Persona se elimina la Dirección", ok: true },
          { t: "Ninguna: la dirección debe sobrevivir", ok: false },
          { t: "Sólo REFRESH", ok: false },
        ], explain: "Es el ejemplo textual de la cátedra y corresponde a una composición." },
        { n: 6, topic: "Lazy/Eager", type: "open", q: "¿Qué es el problema N+1 y cómo lo resolvés?", answer: "Al recuperar una lista de N entidades y acceder, dentro de un ciclo, a una relación marcada como lazy, el ORM ejecuta 1 consulta para la lista más N consultas (una por cada elemento). Degrada la performance de forma invisible. Se resuelve trayendo la relación en la misma consulta con JOIN FETCH (o un EntityGraph) sólo en ese caso de uso, en lugar de cambiar el mapeo a EAGER de forma global, que traería el problema inverso: cargar datos que no se usan." },
      ]);
    },
  });
})();
