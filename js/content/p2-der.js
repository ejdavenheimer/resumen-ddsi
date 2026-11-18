/* ============================================================
   P2 · Modelo de Datos (DER) en el parcial: cómo armarlo
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-der",
    title: "Modelo de Datos / DER paso a paso",
    tag: "🗂️",
    group: "Persistencia (P2)",
    resumen: "Cómo construir y justificar el DER que piden (40 pts)",
    keywords: ["der", "modelo de datos", "diagrama entidad relacion", "entidades", "supuestos", "justificar", "de clases a tablas", "pasaje", "notacion", "chen", "crow foot", "pata de gallo"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>El Modelo de Datos del parcial, paso a paso</h1>
          <p class="lead">Es el punto de mayor peso (40 puntos en el parcial 2025, 20–35 en cada final). La consigna es casi literal todos los años: “indicando las entidades con sus respectivos campos, <b>claves primarias</b>, <b>foráneas</b>, <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b> según corresponda”.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Las 3 consignas que siempre acompañan al diagrama</div>
          <ol>
            <li><b>Enumerar las entidades</b> y decir concisamente qué representa cada una.</li>
            <li><b>El diagrama</b> (uno por servicio, si el enunciado lo pide por servicio). <b>Indicar todos los supuestos.</b></li>
            <li><b>Justificar:</b> (a) qué elementos del modelo es necesario <b>persistir</b>; (b) cómo resolviste los
            <b>impedance mismatches</b>; (c) qué estructuras deben <b>desnormalizarse</b>, si corresponde.</li>
          </ol>
          <p class="mini">Esa tríada de justificación vale 5 a 10 puntos y se contesta <b>siempre igual</b>. Tenela
          memorizada: es el punto más barato del parcial.</p>
        </div>

        <h2>Paso 1 — Leer el enunciado buscando sustantivos y verbos</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Candidatos a ENTIDAD</h3>
            <ul>
              <li><b>Sustantivos</b> que el sistema “registra”, “administra”, “mantiene actualizado”.</li>
              <li>Todo lo que tenga un <b>historial</b> → casi siempre es una entidad propia (una fila por evento).</li>
              <li>Todo lo que diga <b>“de cada X se conoce…”</b>.</li>
              <li>Catálogos (“tipos de evento conocidos”, “condiciones predefinidas”) → entidad maestra, no un enum libre.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Candidatos a ATRIBUTO</h3>
            <ul>
              <li>Listas de datos simples de un sustantivo (“nombre, especie, raza, fecha de nacimiento, sexo, peso”).</li>
              <li><b>“datos opcionales como…”</b> → atributo que admite NULL (modalidad 0).</li>
              <li><b>“(por ejemplo, A, B, C o D)”</b> → es un <b>ENUM</b> o una tabla de tipos.</li>
              <li><b>“puede incluir archivos adjuntos”</b> → tabla hija 1:N (y en la base va la <b>URL</b>, nunca el archivo).</li>
            </ul>
          </div>
        </div>

        <h2>Paso 2 — Del diagrama de clases al modelo de datos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>En objetos</th><th>En el modelo relacional</th><th>Detalle</th></tr></thead>
          <tbody>
            <tr><td>Clase (entidad)</td><td>Tabla</td><td>Una tabla con PK (subrogada, salvo que haya una clave natural clara)</td></tr>
            <tr><td>Atributo simple</td><td>Columna</td><td>Con su tipo y sus constraints</td></tr>
            <tr><td>Value Object (dirección, dinero)</td><td>Columnas embebidas en la tabla del dueño</td><td>No tiene identidad propia → <code>@Embeddable</code>. Si se comparte y necesita identidad, va a tabla aparte</td></tr>
            <tr><td>Asociación 1:1</td><td>FK con UNIQUE en la tabla dependiente</td><td>Del lado que no puede existir sin el otro</td></tr>
            <tr><td>Asociación 1:N</td><td>FK en la tabla del lado “muchos”</td><td>NOT NULL si la modalidad es obligatoria</td></tr>
            <tr><td>Asociación N:M</td><td><b>Tabla intermedia</b> con 2 FKs (PK compuesta)</td><td>Si la relación tiene datos propios, pasa a ser una entidad con nombre del dominio</td></tr>
            <tr><td>Composición (◆)</td><td>FK NOT NULL + borrado en cascada (ON DELETE CASCADE / cascade REMOVE)</td><td>La parte no vive sin el todo</td></tr>
            <tr><td>Agregación (◇)</td><td>FK que puede ser NULL; sin cascada de borrado</td><td>La parte vive por su cuenta</td></tr>
            <tr><td>Colección de tipos simples</td><td>Tabla hija (<code>@ElementCollection</code>)</td><td>Ej. lista de alergias, de horarios</td></tr>
            <tr><td>Herencia</td><td>SINGLE_TABLE / JOINED / TABLE_PER_CLASS / MappedSuperclass</td><td>Hay que <b>elegir y justificar</b> → <a class="inline" data-go="p2-hibernate">ver estrategias</a></td></tr>
            <tr><td>Enum</td><td>Columna con CHECK, o tabla de tipos si es administrable</td><td>“Los eventos son configurados por un administrador” → <b>tabla</b></td></tr>
            <tr><td>Método / cálculo</td><td><b>No se persiste</b> (salvo desnormalización justificada)</td><td>Es lógica, no dato</td></tr>
          </tbody>
        </table></div>

        <h2>Paso 3 — Dibujarlo (notación pata de gallo)</h2>
        <p>Para el papel, lo más rápido y claro es un rectángulo por entidad con sus campos y marcas <b>PK/FK</b>, y la
        cardinalidad+modalidad sobre cada línea:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Se lee</th><th>Se escribe</th><th>Pata de gallo</th></tr></thead>
          <tbody>
            <tr><td>Exactamente uno (obligatorio)</td><td><code>1,1</code></td><td>línea con dos barras <code>||</code></td></tr>
            <tr><td>Cero o uno (opcional)</td><td><code>0,1</code></td><td><code>|o</code></td></tr>
            <tr><td>Uno o muchos (obligatorio)</td><td><code>1,N</code></td><td><code>}|</code></td></tr>
            <tr><td>Cero o muchos (opcional)</td><td><code>0,N</code></td><td><code>}o</code></td></tr>
          </tbody>
        </table></div>
        <div class="callout tip">
          <p>Escribí la lectura en palabras al lado de la línea: “<b>un</b> Domicilio tiene <b>cero o muchos</b>
          Dispositivos / <b>un</b> Dispositivo pertenece a <b>exactamente un</b> Domicilio”. Eso demuestra cardinalidad
          <b>y</b> modalidad sin ambigüedad, aunque el corrector no comparta tu notación.</p>
        </div>

        <h2>Ejemplo completo resuelto (parcial 2025 · PetGuardian)</h2>
        <p>“Servicio de Gestión de Mascotas”: dueños que registran mascotas, las asocian a dispositivos de sus domicilios y
        mantienen historial médico y preferencias de alimentación/actividad.</p>
        ${APP.uml(`erDiagram
    USUARIO ||--o{ DOMICILIO : "tiene (1,N)"
    USUARIO ||--o{ MASCOTA : "es dueño de (1,N)"
    DOMICILIO ||--o{ DISPOSITIVO : "aloja (0,N)"
    DOMICILIO ||--o{ MASCOTA : "aloja (0,N)"
    MASCOTA ||--o{ EVENTO_MEDICO : "registra (0,N)"
    EVENTO_MEDICO ||--o{ ADJUNTO : "incluye (0,N)"
    MASCOTA ||--|| PREF_ALIMENTACION : "tiene (1,1)"
    MASCOTA ||--|| PREF_ACTIVIDAD : "tiene (1,1)"
    MASCOTA ||--o{ RESTRICCION_ALIMENTARIA : "tiene (0,N)"
    MASCOTA }o--o{ DISPOSITIVO : "vinculada vía MASCOTA_DISPOSITIVO"
    USUARIO {
      int id_usuario PK
      string email "UNIQUE NOT NULL"
      string nombre "NOT NULL"
      string password_hash "NOT NULL"
    }
    DOMICILIO {
      int id_domicilio PK
      int id_usuario FK "NOT NULL"
      string direccion "NOT NULL"
      decimal latitud
      decimal longitud
      string zona_horaria "NOT NULL"
      string descripcion
    }
    MASCOTA {
      int id_mascota PK
      int id_usuario FK "NOT NULL (dueño)"
      int id_domicilio FK "NULL - domicilio asociado"
      string nombre "NOT NULL"
      string especie "NOT NULL"
      string raza
      date fecha_nacimiento
      string sexo "CHECK (M,F)"
      decimal peso_kg
      string url_foto "opcional"
      string color "opcional"
      string microchip "UNIQUE - opcional"
      string notas "opcional"
    }
    EVENTO_MEDICO {
      int id_evento PK
      int id_mascota FK "NOT NULL"
      datetime fecha "NOT NULL"
      int id_tipo_evento FK "NOT NULL"
      string descripcion
      string veterinario_nombre "congelado"
      string institucion "congelado"
      decimal temperatura
      int frecuencia_cardiaca
    }
    ADJUNTO {
      int id_adjunto PK
      int id_evento FK "NOT NULL"
      string url "NOT NULL - el archivo va a object storage"
      string tipo
    }
    DISPOSITIVO {
      string nro_serie PK "clave natural"
      int id_domicilio FK "NOT NULL"
      int id_tipo_dispositivo FK "NOT NULL"
      string modelo
      string version_firmware
      string estado_operativo
      datetime ultima_comunicacion
      int bateria_pct
    }`, "Servicio de Gestión de Mascotas — modelo de datos")}

        <div class="callout key">
          <div class="callout-title">📝 Supuestos (así se escriben)</div>
          <ul>
            <li>Una mascota tiene <b>un único dueño</b>; si el enunciado admitiera co-titulares, sería N:M con tabla intermedia.</li>
            <li>Una mascota está asociada a <b>un</b> domicilio a la vez (el enunciado dice “domicilio asociado”); el histórico de mudanzas no se pide.</li>
            <li>Un dispositivo pertenece a <b>un</b> domicilio, pero puede estar <b>vinculado a varias mascotas</b> (collar compartido no, pero una cámara sí) → N:M <code>MASCOTA_DISPOSITIVO</code>.</li>
            <li>Los <b>tipos de evento médico</b> y los <b>tipos de dispositivo</b> se modelan como <b>tablas maestras</b>, no como enum fijo, porque el enunciado habla de catálogos administrables.</li>
            <li>Las <b>preferencias</b> se modelan 1:1 con la mascota (son un conjunto de atributos que siempre se leen juntos); las <b>restricciones/alergias</b> son multivaluadas → tabla hija (1FN).</li>
            <li>Los <b>archivos</b> (recetas, estudios, imágenes) <b>no se guardan en la base</b>: se guarda la URL en object storage.</li>
            <li>El <b>nombre del veterinario/institución</b> se copia en el evento: el historial médico es un registro inmutable (desnormalización por consistencia).</li>
          </ul>
        </div>

        <h2>Paso 4 — La justificación (copiá esta estructura)</h2>
        <div class="card">
          <h3>a) Qué elementos es necesario persistir</h3>
          <p>“Persisto las <b>entidades con identidad y ciclo de vida propio</b> que el sistema debe recuperar entre
          ejecuciones: Usuario, Domicilio, Mascota, Dispositivo, EventoMédico. <b>No persisto</b>: los
          <b>objetos de cálculo</b> ni los resultados derivables (el nivel de actividad acumulado del mes se calcula desde
          las lecturas), los <b>DTOs</b> de la capa de presentación, ni los <b>archivos binarios</b> (van a object storage y
          la base guarda la URL). Los <b>Value Objects</b> sin identidad (coordenadas, dinero) se persisten
          <b>embebidos</b> en la tabla de su dueño.”</p>
          <h3>b) Cómo resolví los impedance mismatches</h3>
          <ul>
            <li><b>Identidad:</b> PK <b>subrogada</b> autoincremental en todas las entidades, salvo Dispositivo, donde uso la clave <b>natural</b> (nro. de serie único). Agrego UNIQUE en las claves naturales (email, microchip) para no perder la restricción del negocio.</li>
            <li><b>Conversión de tipos:</b> String → VARCHAR con longitud definida; fechas → DATE/DATETIME; decimales de peso e importes → DECIMAL (no DOUBLE, por el redondeo); booleanos → BOOLEAN/TINYINT.</li>
            <li><b>Cardinalidad:</b> las relaciones bidireccionales del modelo de objetos se implementan con <b>una sola FK</b> del lado “muchos”; la navegación inversa la resuelve el ORM. Las N:M se parten en dos 1:N con tabla intermedia.</li>
            <li><b>Herencia:</b> Dispositivo → Sensor / Actuador / Mixto. Elijo <b>SINGLE_TABLE con discriminador</b> porque los atributos propios de cada subtipo son pocos y se consultan siempre polimórficamente (todas las lecturas del domicilio); el costo son columnas nulables. (Si cada subtipo tuviera muchos atributos propios, iría JOINED.)</li>
            <li><b>Enums:</b> los estados con valores fijos van como enum con <b>CHECK</b> (persistido como STRING, no como ordinal); los catálogos administrables van como <b>tabla maestra</b> con FK.</li>
            <li><b>Colecciones de tipos simples:</b> alergias y horarios recomendados → <code>@ElementCollection</code> (tabla hija con FK), porque un atributo multivaluado rompe 1FN.</li>
          </ul>
          <h3>c) Qué desnormalizo</h3>
          <p>“Por <b>consistencia</b>: el nombre del veterinario/institución y los signos vitales quedan congelados en el
          evento médico, porque es un registro histórico inmutable. Por <b>performance</b>: nada por ahora; si el listado
          de mascotas por domicilio se vuelve crítico, replicaría <code>nombre_mascota</code> en las alertas conservando
          la FK, declarando MASCOTA como fuente de verdad y con un proceso de recálculo.”</p>
        </div>

        <h2>Checklist antes de entregar</h2>
        <div class="card">
          <ul>
            <li>☐ Cada tabla tiene <b>PK</b> (y dije si es natural, subrogada o compuesta).</li>
            <li>☐ Cada relación tiene <b>FK</b>, con <b>cardinalidad</b> y <b>modalidad</b> marcadas.</li>
            <li>☐ Todas las <b>N:M</b> están resueltas con tabla intermedia (y las que tienen datos propios tienen nombre de dominio).</li>
            <li>☐ No quedó ningún atributo <b>multivaluado</b> (1FN).</li>
            <li>☐ Puse <b>restricciones</b>: NOT NULL, UNIQUE, CHECK donde el enunciado lo exige.</li>
            <li>☐ Elegí y <b>justifiqué</b> la estrategia de mapeo de <b>herencia</b> si hay herencia.</li>
            <li>☐ Escribí la lista de <b>supuestos</b>.</li>
            <li>☐ Escribí los tres párrafos de <b>justificación</b> (persistir / impedance / desnormalizar).</li>
            <li>☐ Si el enunciado pedía <b>un diagrama por servicio</b>, hice uno por servicio y marqué las referencias entre servicios como <b>ID lógico</b>, no como FK (no hay integridad referencial entre bases de distintos servicios).</li>
          </ul>
        </div>
        <div class="callout warn">
          <p><b>Detalle que se cobra en microservicios:</b> si cada servicio tiene su propia base, <b>no hay FK entre
          servicios</b>. La referencia se guarda como <b>ID lógico</b> y la validación es responsabilidad de la aplicación.
          Decilo explícitamente en los supuestos: suma puntos y es exactamente lo que explica la clase de microservicios.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2derQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2derQuiz"), [
        { n: 1, topic: "Pasaje", type: "mc", q: "“El historial médico puede incluir archivos adjuntos (recetas, estudios, imágenes)”. ¿Cómo lo modelás?", options: [
          { t: "Tabla ADJUNTO 1:N con el evento, guardando la URL del archivo en object storage", ok: true },
          { t: "Un campo BLOB en la tabla del evento con el archivo", ok: false },
          { t: "Un VARCHAR con las rutas separadas por coma", ok: false },
        ], explain: "Multivaluado → tabla hija (1FN). Y los binarios no van en la base: van a object storage y la base guarda la URL." },
        { n: 2, topic: "Pasaje", type: "mc", q: "Una <b>agregación</b> (rombo vacío) se traduce a…", options: [
          { t: "FK que puede ser NULL, sin cascada de borrado", ok: true },
          { t: "FK NOT NULL con ON DELETE CASCADE", ok: false },
          { t: "Tabla intermedia", ok: false },
        ], explain: "En agregación la parte vive por su cuenta. La composición sí lleva FK NOT NULL + cascada de borrado." },
        { n: 3, topic: "Microservicios", type: "vf", q: "Si cada servicio tiene su propia base de datos, las referencias entre entidades de distintos servicios se modelan con FK.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Se pierde la integridad referencial automática: se guarda el ID externo como referencia lógica y se valida a nivel de aplicación." },
        { n: 4, topic: "Justificación", type: "open", q: "Enumerá los 4 impedance mismatches que hay que mencionar en la justificación.", answer: "1) Identidad (unicidad del objeto vs. PK: natural o subrogada). 2) Conversión de tipos de datos (String sin límite vs VARCHAR con longitud, precisión de decimales, fechas, booleanos, enumerados). 3) Manejo de la cardinalidad (en POO hay navegabilidad bidireccional; en el modelo relacional las relaciones no son bidireccionales). 4) Mapeo de la herencia (no existe en el mundo relacional: SINGLE_TABLE, JOINED, TABLE_PER_CLASS, MappedSuperclass)." },
      ]);
    },
  });
})();
