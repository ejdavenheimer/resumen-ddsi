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

        <h2>El método, en 7 pasos</h2>
        <div class="card">
          <ol>
            <li><b>Leé el enunciado entero una vez SIN escribir.</b> En la segunda lectura, subrayá con la tabla de disparadores de abajo.</li>
            <li><b>Hacé el esqueleto primero:</b> sólo las cajas con nombre, <b>PK y FK</b>, y las líneas. <b>Ves la estructura antes de perderte en los detalles</b> — y si te queda mal, todavía estás a tiempo de rehacerla.</li>
            <li><b>Recién ahí completá</b> atributos, tipos de dato y restricciones.</li>
            <li><b>Revisá línea por línea:</b> la <b>pata de gallo va del lado donde está la FK</b>; si la entidad <b>puede existir sin</b> la otra va <code>o</code> (opcional), si <b>no puede</b> va <code>|</code> (obligatoria); <b>ninguna tabla queda suelta</b> sin relaciones.</li>
            <li><b>Checklist:</b> releé el enunciado <b>oración por oración</b> tachando cada dato que ya esté en el DER; por cada <b>estadística</b> pedida preguntate <b>“¿con qué tabla y qué COUNT o SUM la saco?”</b>; y verificá que no haya <b>FK redundantes</b> ni dos FK que se excluyan entre sí.</li>
            <li><b>Escribí 3 a 5 supuestos y justificaciones</b> al lado del diagrama.</li>
            <li><b>Pasalo en limpio:</b> nada tachado, ninguna nota suelta. <b>El corrector lee lo que ve.</b></li>
          </ol>
        </div>
        <div class="callout tip">
          <p><b>El paso 2 es el que más tiempo ahorra</b> y el que casi nadie hace: si empezás escribiendo los atributos de
          la primera entidad, llegás a la mitad de la hoja y descubrís que te falta una tabla en el medio. Con el
          esqueleto primero, mover una caja cuesta cero.</p>
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

        <h3>⭐ Tabla de disparadores: si el enunciado dice… entonces…</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Si dice…</th><th>Significa…</th></tr></thead>
          <tbody>
            <tr><td>Un sustantivo con datos propios (Mascota, Zona, Técnico)</td><td><b>Entidad</b> (tabla con PK)</td></tr>
            <tr><td>“De cada X se conoce…”</td><td><b>Atributos</b> de X</td></tr>
            <tr><td>“Tiene varios”, “uno o más”, “puede incluir”</td><td><b>1:N</b> — la FK va del lado <b>N</b></td></tr>
            <tr><td>“Múltiples… y a su vez…”</td><td><b>N:M</b>, con <b>tabla intermedia</b></td></tr>
            <tr><td>“Al menos uno”</td><td><b>Modalidad obligatoria</b> (<code>|{</code>), FK NOT NULL</td></tr>
            <tr><td>“Puede tener”, “opcional”</td><td><b>Modalidad opcional</b> (<code>o{</code>), FK admite NULL</td></tr>
            <tr><td>“Único”, “identificatorio”, “código”, “número de serie”</td><td><b>UNIQUE</b> (clave natural); la PK puede seguir siendo subrogada</td></tr>
            <tr><td><b>“Historial”, “bitácora”, “registro”, “trazabilidad”, “se puede consultar qué pasó”</b></td><td><b>Tabla de eventos</b> con <code>fecha_hora</code> (una fila por hecho), <b>no</b> un campo en la entidad</td></tr>
            <tr><td><b>“Estadísticas”, “el más…”, “top 10”, “promedio”, “cantidad de…”</b></td><td><b>Tiene que existir una tabla que permita contarlo o sumarlo.</b> Si no podés escribir el COUNT o el SUM, te falta una entidad</td></tr>
            <tr><td><b>“Predefinido”, “catálogo”, “tipos posibles”, “lo configura un administrador”</b></td><td><b>Tabla catálogo</b> + <b>intermedia</b> con los valores elegidos (no un enum: agregar un valor no puede exigir un deploy)</td></tr>
            <tr><td><b>“Puede ajustar los parámetros”, “configurable”</b></td><td>El valor <b>va en la tabla intermedia</b> (es de <i>esa</i> configuración), <b>NO en el catálogo</b> (que es compartido por todos)</td></tr>
            <tr><td>“Estado”, “pasa por…”, “acepta o rechaza”, “ciclo de vida”</td><td>Campo <code>estado</code> con <b>CHECK</b> / enum STRING — <b>nunca un BOOLEAN</b> si hay más de dos valores (y casi siempre hay un tercero)</td></tr>
            <tr><td>“Vigente desde”, “cambia en el tiempo”, “histórico de precios”</td><td><code>vigente_desde</code> <b>dentro de la PK</b> + <code>vigente_hasta</code> NULL en la fila actual</td></tr>
            <tr><td>“Adjuntos”, “fotos”, “documentos”</td><td>Tabla hija 1:N guardando la <b>URL</b> (object storage) — <b>nunca el binario en la base</b></td></tr>
            <tr><td>“Al momento de”, “el precio aplicado”, “comprobante”</td><td><b>Dato congelado</b> (desnormalización por consistencia), conservando la FK</td></tr>
          </tbody>
        </table></div>

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

        <h3>Tipos de dato (para no dudar en el momento)</h3>
        <div class="grid-2">
          <div class="card">
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Tipo</th><th>Para qué</th></tr></thead>
              <tbody>
                <tr><td><code>INT</code> / <code>BIGINT</code></td><td>Ids, cantidades</td></tr>
                <tr><td><code>SMALLINT</code></td><td>Números chicos (edad, nivel)</td></tr>
                <tr><td><b><code>DECIMAL(p,s)</code></b></td><td><b>Dinero y medidas exactas</b> — <code>importe DECIMAL(12,2)</code></td></tr>
                <tr><td><code>FLOAT</code> / <code>DOUBLE</code></td><td>Medidas <b>aproximadas</b>: latitud, temperatura</td></tr>
                <tr><td><code>VARCHAR(n)</code></td><td>Texto corto o mediano: <code>nombre VARCHAR(100)</code>, <code>url VARCHAR(255)</code></td></tr>
                <tr><td><code>CHAR(n)</code></td><td>Largo fijo: país <code>CHAR(2)</code>, moneda <code>CHAR(3)</code></td></tr>
              </tbody>
            </table></div>
          </div>
          <div class="card">
            <div class="table-wrap"><table class="data">
              <thead><tr><th>Tipo</th><th>Para qué</th></tr></thead>
              <tbody>
                <tr><td><code>TEXT</code></td><td>Texto largo: descripción, observaciones</td></tr>
                <tr><td><code>BOOLEAN</code></td><td>Sí/no <b>real</b>, sólo dos valores: <code>activo</code></td></tr>
                <tr><td><code>DATE</code> · <code>TIME</code></td><td>Sólo fecha · sólo hora (<code>hora_desde</code>)</td></tr>
                <tr><td><code>DATETIME</code> / <code>TIMESTAMP</code></td><td>Fecha + hora de un evento</td></tr>
                <tr><td><code>ENUM(...)</code></td><td>Lista fija (MySQL); en el parcial, <code>VARCHAR</code> + <b>CHECK</b></td></tr>
                <tr><td><code>BLOB</code></td><td>Binario — <b>evitalo: guardá la URL</b></td></tr>
              </tbody>
            </table></div>
          </div>
        </div>
        <div class="callout tip">
          <p><b>Tip:</b> <b>DNI, CUIT, teléfono y código postal van como <code>VARCHAR</code></b>, no como número: no se
          hacen cuentas con ellos y pueden tener <b>ceros a la izquierda</b>, guiones o letras. Y <b>dinero nunca en
          <code>DOUBLE</code></b>: el redondeo binario te arruina un importe cobrado.</p>
        </div>

        <h3>Claves y restricciones: qué significa cada sigla</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Sigla</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>PK</b></td><td>Identificador único de cada fila. <b>No puede ser NULL.</b></td></tr>
            <tr><td><b>FK</b></td><td>Referencia a la PK de otra tabla.</td></tr>
            <tr><td><b>PK FK</b></td><td>Columna que es <b>parte de la PK y a la vez FK</b>. Es lo típico en las <b>tablas intermedias</b>.</td></tr>
            <tr><td><b>UK / UNIQUE</b></td><td>No se repite, pero no es la PK: DNI, email, código, nro. de serie.</td></tr>
            <tr><td><b>NN / NOT NULL</b></td><td>Obligatorio ↔ <b>modalidad 1</b>.</td></tr>
            <tr><td><b>NULL</b></td><td>Opcional ↔ <b>modalidad 0</b>.</td></tr>
            <tr><td><b>CHECK</b></td><td>Regla de validación: <code>CHECK (estado IN ('A','B'))</code>, <code>CHECK (hora_fin &gt; hora_inicio)</code>, <code>CHECK (peso &gt; 0)</code>.</td></tr>
            <tr><td><b>DEFAULT</b></td><td>Valor por defecto: <code>activo DEFAULT true</code>, <code>fecha_alta DEFAULT NOW()</code>.</td></tr>
            <tr><td><b>AI / AUTO_INCREMENT</b></td><td>El id se genera solo → es la <b>clave subrogada</b>.</td></tr>
            <tr><td><b>PK compuesta</b></td><td>Formada por varias columnas: <code>(id_locker, nro_casillero)</code>.</td></tr>
            <tr><td><b>UK compuesta</b></td><td>La <b>combinación</b> no se repite: <code>UNIQUE (id_rutina, nombre)</code>.</td></tr>
            <tr><td><b>IDX</b> (índice)</td><td>Acelera las búsquedas por esa columna. <b>Opcional en el parcial</b> (PK y FK ya son índices).</td></tr>
          </tbody>
        </table></div>

        <h2>⭐ Los 5 patrones que se repiten en todos los parciales</h2>
        <p>Revisé los 17 finales y los 2 parciales de la carpeta. <b>Esto es lo que aparece una y otra vez</b>, con la
        solución típica. Si reconocés el patrón, ya tenés media tabla escrita:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Patrón</th><th>Frase que lo dispara</th><th>Solución típica</th><th>Aparece en…</th></tr></thead>
          <tbody>
            <tr>
              <td><b>1 · Historial / bitácora</b></td>
              <td>“mantener el historial”, “trazabilidad”, “consultar qué pasó y cuándo”, “historial de ejecuciones”</td>
              <td><code>EVENTO(id PK, id_entidad FK NOT NULL, fecha_hora NOT NULL, estado/tipo, origen, motivo)</code> — <b>una fila por hecho</b>, <b>1,N</b> desde la entidad. Si además interesa “desde/hasta”, usá <code>desde NOT NULL</code> + <code>hasta NULL</code> para el vigente. El <b>estado actual</b> en la entidad es un campo derivado: <b>declaralo como desnormalización</b>.</td>
              <td><b>23 de 24</b> enunciados</td>
            </tr>
            <tr>
              <td><b>2 · Estados y ciclo de vida</b></td>
              <td>“pasa por los estados…”, “acepta o rechaza”, “pendiente / aprobado”, “se puede cancelar”</td>
              <td>Campo <code>estado VARCHAR</code> con <b>CHECK</b> (nunca BOOLEAN) <b>+ la tabla de eventos</b> del patrón 1. Si el diagrama de clases usa <b>State</b>, <b>esas clases no se persisten</b>: son comportamiento.</td>
              <td><b>17 de 24</b></td>
            </tr>
            <tr>
              <td><b>3 · Catálogo + configuración</b></td>
              <td>“a partir de un catálogo de condiciones y acciones <b>predefinidas</b>”, “el usuario <b>puede ajustar los parámetros</b>”, “los configura un administrador”</td>
              <td><code>CATALOGO(id PK, nombre UNIQUE, descripcion)</code> + <code>CONFIGURACION(id PK, id_usuario, …)</code> + <b>intermedia</b> <code>CONFIG_ITEM(id_config PK FK, id_catalogo PK FK, <b>valores/parametros</b>)</code>. <b>⚠️ El error que más se cobra:</b> poner el parámetro ajustable <b>en el catálogo</b> — el catálogo es <b>compartido por todos</b>, así que el valor que el usuario ajusta va <b>en la intermedia</b>.</td>
              <td><b>8 de 24</b></td>
            </tr>
            <tr>
              <td><b>4 · Estadísticas</b></td>
              <td>“mascota más activa del mes”, “top 10 usuarios”, “promedio de…”, “porcentaje de…”</td>
              <td><b>No se modela la estadística: se modela el hecho que permite calcularla.</b> Por cada métrica pedida, escribí mentalmente el <code>COUNT</code>/<code>SUM</code> + <code>GROUP BY</code>: si no sale, <b>te falta una tabla</b>. Si el volumen es alto, mencionás la <b>tabla de resumen</b> preagregada por batch (desnormalización por performance).</td>
              <td><b>6 de 24</b></td>
            </tr>
            <tr>
              <td><b>5 · Adjuntos y multimedia</b></td>
              <td>“puede incluir archivos adjuntos”, “fotos de la entrega”, “recetas y estudios”</td>
              <td>Tabla hija <code>ADJUNTO(id PK, id_padre FK NOT NULL, url NOT NULL, tipo, fecha)</code> con la <b>URL</b> del object storage. <b>Nunca un BLOB.</b> Es además 1FN: un campo con varias rutas sería multivaluado.</td>
              <td><b>13 de 24</b></td>
            </tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <p><b>Bonus — los que acompañan siempre:</b> <b>N:M</b> (“puede estar en varios / varios pueden tener”) →
          tabla intermedia con PK compuesta, y si tiene datos propios, <b>nombre de dominio</b>; <b>jerarquía anidada</b>
          (contenedor → equipo → unidad) → tres tablas, PK compuesta en la unidad; <b>precios/tarifas con vigencia</b> →
          <code>vigente_desde</code> en la PK; <b>multi-servicio</b> → referencias entre servicios como <b>ID lógico</b>,
          nunca FK.</p>
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

        <h2>⚠️ Los 7 errores que más se cobran</h2>
        <div class="card">
          <ol>
            <li><b>Poner el parámetro configurable en el catálogo</b> en vez de en la tabla intermedia. El catálogo lo comparten todos los usuarios; el valor ajustado es de <b>esa</b> configuración.</li>
            <li><b>Olvidar la tabla de eventos/historial</b> — y después no poder calcular ninguna de las estadísticas que pide el enunciado.</li>
            <li><b>Usar BOOLEAN para un estado de más de dos valores.</b> Casi siempre aparece un tercer estado (cancelado, en revisión, vencido) y el modelo no lo soporta.</li>
            <li><b>FK del lado equivocado</b> (va siempre del lado “muchos”), <b>FK redundante</b> (la misma relación por dos caminos) o <b>cardinalidades invertidas</b>.</li>
            <li><b>Olvidar atributos que el enunciado nombra explícitamente</b>, y las restricciones (UNIQUE del “código único”, NOT NULL de lo obligatorio, CHECK del “puede ser A, B o C”).</li>
            <li><b>No escribir los supuestos ni la justificación.</b> Es puntaje regalado: son los párrafos más previsibles del parcial.</li>
            <li><b>Dejar una tabla suelta</b>, sin ninguna relación con el resto del modelo.</li>
          </ol>
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
