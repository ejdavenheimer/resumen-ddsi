/* ============================================================
   P2 · Teoría del Modelo Relacional
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-relacional",
    title: "Modelo Relacional (teoría)",
    tag: "🧮",
    group: "Persistencia (P2)",
    resumen: "Codd, relación/tupla/atributo, PK, FK, constraints, cardinalidad y modalidad",
    keywords: ["modelo relacional", "codd", "relacion", "tupla", "atributo", "dominio", "grado", "cardinalidad", "modalidad", "clave primaria", "pk", "fk", "clave foranea", "indice", "integridad referencial", "constraints", "unique", "not null", "check", "one to one", "one to many", "many to many", "tabla intermedia"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Teoría del Modelo Relacional</h1>
          <p class="lead">El vocabulario exacto con el que la cátedra corrige el modelo de datos. Usar las palabras correctas (relación, tupla, grado, modalidad) es parte del puntaje.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Origen</div>
          <p>Postulado por <b>Edgar Frank Codd</b> (IBM) en <b>1970</b> como una nueva forma de organizar los datos.
          Todos los datos se almacenan en <b>relaciones</b>; cada relación es un conjunto de datos organizados llamados
          <b>tuplas</b>. Facilita organizar grandes volúmenes y <b>garantiza la integridad</b>.</p>
        </div>

        <h2>Términos: el modelo vs. la implementación</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>En el modelo relacional</th><th>En la base de datos (implementación)</th><th>Definición</th></tr></thead>
          <tbody>
            <tr><td><b>Relación</b></td><td>Tabla</td><td>La “entidad” donde se almacenan los datos. Las relaciones que almacenan datos se llaman <b>relaciones base</b>; su implementación se llama <b>tabla</b>.</td></tr>
            <tr><td><b>Tupla</b></td><td>Fila / registro</td><td>El registro.</td></tr>
            <tr><td><b>Atributo</b></td><td>Columna / campo</td><td>Un campo dentro de la tupla.</td></tr>
            <tr><td><b>Dominio</b></td><td>Tipo de dato + restricciones</td><td>El conjunto de valores posibles que puede tomar un atributo. Es la <b>menor unidad semántica</b> de información.</td></tr>
            <tr><td><b>Cardinalidad</b> (de la relación)</td><td>Cantidad de filas</td><td>Número de tuplas.</td></tr>
            <tr><td><b>Grado</b></td><td>Cantidad de columnas</td><td>Número de atributos.</td></tr>
          </tbody>
        </table></div>
        <div class="callout warn">
          <p><b>Ojo con “cardinalidad”:</b> en teoría del modelo relacional es el <b>número de tuplas</b>. En el diseño de
          relaciones entre entidades, “cardinalidad” es la <b>cantidad máxima</b> de relaciones (1, N). Las dos acepciones
          entran en el parcial; el contexto las distingue.</p>
        </div>

        <h2>Claves</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Clave Primaria (PK)</h3>
            <p>Atributo que <b>identifica de manera unívoca</b> a cada fila de la tabla. Existen de 3 tipos:</p>
            <ul>
              <li><b>Natural:</b> un campo propio de la entidad que la identifica (CUIT del cliente, nro. de teléfono del abonado, nro. de serie del dispositivo).</li>
              <li><b>Subrogada:</b> clave ficticia, generada automáticamente o al azar (el típico <code>id</code> autoincremental o un UUID).</li>
              <li><b>Compuesta:</b> formada por más de una columna (muy usada en las tablas intermedias: <code>PK(id_alumno, id_materia)</code>).</li>
            </ul>
          </div>
          <div class="card">
            <h3>Clave Foránea (FK)</h3>
            <p>Un grupo de <b>una o más columnas</b> en una tabla que <b>referencian a la clave primaria de otra tabla</b>.
            Una FK <b>puede ser parte de una PK</b> (es exactamente el caso de la tabla intermedia).</p>
            <p><b>Integridad referencial:</b> propiedad que establece que la clave externa de una tabla de referencia
            siempre debe corresponder a una <b>fila válida</b> de la tabla referenciada. Garantiza que la relación entre
            dos tablas permanezca <b>sincronizada</b> durante las actualizaciones y eliminaciones.</p>
          </div>
        </div>
        <div class="callout tip">
          <p><b>Índices:</b> estructura de datos que mejora la velocidad de las operaciones por medio de un identificador
          de cada fila, permitiendo acceso rápido a los registros. <b>Tanto las PK como las FK son índices.</b></p>
        </div>

        <h2>Tipos de datos y Constraints</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Tipos más utilizados</h3>
            <ul>
              <li><b>VARCHAR</b> — cadenas de caracteres (letras, números y especiales)</li>
              <li><b>INTEGER</b> — números enteros</li>
              <li><b>DOUBLE</b> — valores numéricos con punto flotante</li>
              <li><b>DATETIME</b> — manejo de fechas</li>
            </ul>
            <p class="mini">Para dinero, en la práctica se prefiere <code>DECIMAL</code>/<code>NUMERIC</code> (DOUBLE arrastra error de redondeo).</p>
          </div>
          <div class="card">
            <h3>Constraints (restricciones)</h3>
            <p>Restricciones al modelo que <b>limitan el tipo de dato que puede ingresarse</b> en una tabla. Se especifican
            al crear la tabla o después, actualizándola.</p>
            <ul>
              <li><b>NOT NULL</b> — no acepta valores nulos</li>
              <li><b>UNIQUE</b> — no acepta valores repetidos</li>
              <li><b>CHECK</b> (o enum) — verifica que los valores cumplan determinada condición</li>
              <li><b>PRIMARY KEY</b> — clave primaria</li>
              <li><b>FOREIGN KEY</b> — clave foránea</li>
            </ul>
          </div>
        </div>

        <h2>Relaciones: cardinalidad y modalidad</h2>
        <div class="callout key">
          <div class="callout-title">🔑 La distinción que piden en todos los finales</div>
          <p><b>Cardinalidad</b> = la cantidad <b>MÁXIMA</b> de relaciones que tiene un registro de una entidad respecto de la otra.</p>
          <p><b>Modalidad</b> = la cantidad <b>MÍNIMA</b> de relaciones que tiene un registro de una entidad respecto de la otra
          (es decir: <b>¿es obligatoria u opcional?</b>).</p>
          <p class="mini">En el enunciado: “cada pedido <b>debe</b> tener un cliente” → modalidad 1 (obligatoria).
          “un pedido <b>puede</b> tener un cupón” → modalidad 0 (opcional, la FK admite NULL).</p>
        </div>

        <h3>One to One (1:1)</h3>
        <p>Un registro de A se corresponde con un <b>único</b> registro de B. Puede ser <b>unidireccional</b> (en cualquiera
        de los dos sentidos) o <b>bidireccional</b>: existe un registro en A referenciado por un único registro de B y, a su
        vez, ese registro de B está referenciado por el de A.</p>
        <p>Implementación: la FK (con <b>UNIQUE</b>) va en una de las dos tablas — en la que no puede existir sin la otra.</p>

        <h3>One to Many (1:N) y Many to One (N:1)</h3>
        <p>Un registro de A está siendo referenciado por <b>muchos</b> registros de B: “A tiene muchos B”, porque cada
        registro de B pertenece a un registro de A. Visto del otro lado es <b>Many to One</b>: “A pertenece a un B y B tiene
        muchos A”.</p>
        <div class="callout tip">
          <p><b>Regla práctica de la cátedra:</b> si existe una relación One to Many vista de A hacia B, entonces “del otro
          lado” existe una Many to One (de B hacia A). <b>Es una cuestión de perspectiva.</b> Ejemplo: “un contacto pertenece
          a un alumno, y un alumno puede tener muchos contactos”.</p>
          <p><b>La FK va siempre del lado “muchos”</b> (en la tabla hija).</p>
        </div>
        ${APP.uml(`erDiagram
    ALUMNO ||--o{ CONTACTO : "tiene muchos"
    ALUMNO {
      int id_alumno PK
      string nombre
      string legajo "UNIQUE"
    }
    CONTACTO {
      int id_contacto PK
      int id_alumno FK
      string tipo
      string valor
    }`, "1:N — la FK va en la tabla hija (Contacto)")}

        <h3>Many to Many (N:M)</h3>
        <div class="callout warn">
          <div class="callout-title">⚠️ Frase textual de la cátedra</div>
          <p>“Esta relación <b>no es posible realizarla en el modelo relacional</b>, ya que sería necesario tener múltiples
          FKs (sin saber el número exacto) en ambas tablas involucradas.”</p>
          <p>Para implementarla hay que <b>partirla en dos relaciones One To Many</b>: A tiene 1:N contra una
          <b>entidad intermedia C</b>, y B también. La entidad C posee <b>una FK a A y una FK a B</b> (habitualmente ambas
          forman su PK compuesta), y <b>podría guardar algún dato extra necesario de la relación</b>.</p>
        </div>
        ${APP.uml(`erDiagram
    ALUMNO ||--o{ ALUMNO_MATERIA : cursa
    MATERIA ||--o{ ALUMNO_MATERIA : "es cursada en"
    ALUMNO { int id_alumno PK }
    MATERIA { int id_materia PK }
    ALUMNO_MATERIA {
      int id_alumno PK "tambien FK a Alumno"
      int id_materia PK "tambien FK a Materia"
      decimal nota_1p "dato extra de la relacion"
      decimal nota_2p
    }`, "N:M resuelta con entidad intermedia")}
        <div class="callout tip">
          <p><b>El salto de calidad:</b> si no interesa guardar ningún dato extra, <code>alumno_materia</code> es una simple
          tabla intermedia. Si el dominio amerita guardar datos (las notas del 1º y 2º parcial), <b>el diseño mejora y deja de
          ser una “simple tabla intermedia”</b>: pasa a ser una entidad del dominio con nombre propio
          (<code>Cursada</code>, <code>Inscripcion</code>). En el parcial, nombrarla así y justificarlo suma.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2relQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2relQuiz"), [
        { n: 1, topic: "Vocabulario", type: "mc", q: "El <b>grado</b> de una relación es…", options: [
          { t: "El número de atributos", ok: true },
          { t: "El número de tuplas", ok: false },
          { t: "La cantidad de FKs", ok: false },
        ], explain: "Grado = cantidad de atributos (columnas). Cardinalidad = cantidad de tuplas (filas)." },
        { n: 2, topic: "Claves", type: "mc", q: "¿Cuáles son los 3 tipos de clave primaria?", options: [
          { t: "Natural, subrogada y compuesta", ok: true },
          { t: "Simple, doble y triple", ok: false },
          { t: "Primaria, foránea y única", ok: false },
        ], explain: "Natural (un campo propio que identifica), subrogada (ficticia/autogenerada) y compuesta (varias columnas)." },
        { n: 3, topic: "Modalidad", type: "mc", q: "“Un pedido <b>puede</b> tener asociado un cupón de descuento”. Esto define…", options: [
          { t: "Modalidad 0 (opcional): la FK admite NULL", ok: true },
          { t: "Cardinalidad N", ok: false },
          { t: "Una relación N:M", ok: false },
        ], explain: "La modalidad es la cantidad MÍNIMA: 'puede' → 0, opcional. 'Debe' → 1, obligatoria (NOT NULL)." },
        { n: 4, topic: "N:M", type: "vf", q: "Una relación Many to Many se puede implementar directamente en el modelo relacional.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "No es posible: haría falta un número indeterminado de FKs en ambas tablas. Se parte en dos 1:N con una entidad intermedia." },
        { n: 5, topic: "Integridad", type: "open", q: "Definí integridad referencial en una oración.", answer: "Propiedad que establece que la clave foránea de una tabla de referencia siempre debe corresponder a una fila válida de la tabla referenciada; garantiza que la relación entre ambas tablas permanezca sincronizada durante las operaciones de actualización y eliminación." },
      ]);
    },
  });
})();
