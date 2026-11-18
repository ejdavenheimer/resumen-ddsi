/* ============================================================
   P2 · Bases de datos NoSQL + persistencia políglota
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-nosql",
    title: "Bases NoSQL y persistencia políglota",
    tag: "🍃",
    group: "Persistencia (P2)",
    resumen: "Los 6 tipos, cuándo proponer cada uno y cómo justificarlo",
    keywords: ["nosql", "no relacional", "mongodb", "documentos", "grafos", "neo4j", "cassandra", "familia de columnas", "columnar", "bigquery", "redshift", "key value", "redis", "dynamodb", "series temporales", "influxdb", "prometheus", "poliglota", "cap", "olap", "oltp"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Bases de Datos NoSQL</h1>
          <p class="lead">Pregunta recurrente en finales y parciales: “<i>considerando la responsabilidad y el funcionamiento del Servicio X, ¿qué tipo de base de datos no relacional propone?</i>”. Se contesta eligiendo el <b>tipo</b> (no el producto) y justificando con el <b>patrón de acceso</b>.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Definición</div>
          <p>Enfoque de diseño de bases de datos que permite el <b>almacenamiento y consulta de datos fuera de las
          estructuras tabulares tradicionales</b>. En lugar de tablas, alojan los datos dentro de una estructura como un
          <b>documento JSON</b>. Admiten un <b>esquema dinámico</b> para datos no estructurados: hay <b>menos necesidad de
          planificar y organizar previamente</b> la información, y es más sencillo modificarla (agregar atributos y campos
          nuevos).</p>
          <p>Además, <b>NoSQL es un tipo de base de datos distribuida</b>: la información se <b>copia y almacena en varios
          servidores</b>, lo que garantiza disponibilidad y fiabilidad — si algunos datos se desconectan, el resto de la
          base puede seguir funcionando.</p>
          <p><b>La frase que hay que decir siempre:</b> “la decisión de usar una base relacional frente a una no relacional
          es <b>en gran medida contextual</b> y varía según el <b>caso de uso</b>”.</p>
        </div>

        <h2>Los 6 tipos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Tipo</th><th>Cómo guarda</th><th>Productos</th><th>Casos de uso típicos</th></tr></thead>
          <tbody>
            <tr><td><b>Orientada a Documentos</b></td><td>Documentos JSON/BSON; cada documento puede tener <b>estructura diferente</b> en la misma colección</td><td><b>MongoDB</b> (MQL), RavenDB, Cosmos DB, Couchbase</td><td>CMS/blogs, <b>catálogos de productos</b>, perfiles enriquecidos, datos de app variables, registro de actividad</td></tr>
            <tr><td><b>Clave-Valor</b></td><td>Pares clave única → valor; sin esquema ni relaciones</td><td><b>Redis</b>, DynamoDB, Memcached, Aerospike, Riak</td><td><b>Sesiones de usuario y tokens</b>, <b>caché</b>, perfiles/preferencias, carritos de compra</td></tr>
            <tr><td><b>Orientada a Grafos</b></td><td><b>Nodos</b> (entidades) y <b>arcos</b> (relaciones); <b>ambos con propiedades</b></td><td><b>Neo4j</b> (Cypher), OrientDB, JanusGraph, Dgraph</td><td><b>Redes sociales</b>, motores de <b>recomendación</b>, <b>detección de fraude</b> (circuitos de lavado), gestión de dependencias de TI, bioinformática</td></tr>
            <tr><td><b>Familia de Columnas</b></td><td>Filas identificadas por clave; cada fila puede tener <b>distinto conjunto de columnas</b>, agrupadas en <i>column families</i></td><td><b>Cassandra</b> (CQL), HBase</td><td><b>Mensajería e historiales/feeds</b>, <b>IoT y telemetría</b>, catálogos a gran escala, sistemas multi-región de alta disponibilidad</td></tr>
            <tr><td><b>Orientada a Columnas</b></td><td>Almacenamiento <b>columnar</b>: los valores de cada columna se guardan de forma contigua</td><td><b>BigQuery</b>, Amazon Redshift</td><td><b>OLAP</b>: BI y analytics, <b>data warehousing</b>, reportes y dashboards históricos, detección de fraude por patrones</td></tr>
            <tr><td><b>Series Temporales (TSDB)</b></td><td>Datos que <b>cambian con el tiempo</b>, optimizados para registros en orden cronológico</td><td><b>InfluxDB</b> (InfluxQL), TimescaleDB, <b>Prometheus</b>, OpenTSDB</td><td><b>Monitoreo de infraestructura y métricas</b>, IoT (sensores), cotizaciones/trading, performance de aplicaciones</td></tr>
          </tbody>
        </table></div>

        <h2>Ventajas y desventajas por tipo (lo que hay que saber justificar)</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Documentos</h3>
            <p><b>✅</b> Estructuras distintas en una misma colección → cambios de modelo <b>sin migraciones complejas</b>;
            consultas potentes sobre datos <b>anidados</b>; escala en múltiples servidores; acelera el desarrollo (el
            formato se parece al del código).</p>
            <p><b>⚠️</b> Favorece datos anidados y desnormalizados → <b>duplicación</b> y actualizaciones difíciles; más
            espacio/procesamiento al indexar campos anidados; <b>garantías ACID limitadas</b>; ecosistema menos maduro que
            el relacional.</p>
          </div>
          <div class="card">
            <h3>Clave-Valor</h3>
            <p><b>✅</b> Acceso <b>extremadamente rápido</b>; escalabilidad horizontal nativa; simplicidad; flexibilidad de
            esquema; tiempo de respuesta <b>predecible</b>; alta disponibilidad; <b>ideal para cachés</b>.</p>
            <p><b>⚠️</b> <b>No soporta consultas por el contenido del valor</b>; sin relaciones; sin transacciones
            complejas entre claves; <b>consistencia eventual</b>; la lógica de datos queda en la aplicación; difícil para
            agregaciones.</p>
          </div>
          <div class="card">
            <h3>Grafos</h3>
            <p><b>✅</b> Consultas de <b>relaciones complejas ultra-eficientes</b>, con performance consistente al crecer;
            flexibilidad de esquema sin penalización; reduce la complejidad de modelar relaciones.</p>
            <p><b>⚠️</b> Desafíos de <b>escalabilidad horizontal</b> con volúmenes distribuidos grandes; limitado para
            <b>análisis agregados masivos</b>; complejidad operacional; tooling menos maduro.</p>
          </div>
          <div class="card">
            <h3>Familia de Columnas</h3>
            <p><b>✅</b> Muy rápida para buscar <b>por clave</b> (dato puntual o rango); optimizada para <b>escrituras
            masivas</b>; <b>escala horizontalmente de forma nativa</b> sin nodo coordinador; alta disponibilidad por
            replicación, <b>sin punto único de falla</b>; columnas nuevas dinámicas.</p>
            <p><b>⚠️</b> <b>No permite consultas complejas ni combinar información de distintas tablas</b>; requiere
            compactaciones periódicas; administración compleja; hay que ajustar el <b>nivel de consistencia</b>; el diseño
            se orienta a <b>las consultas</b> (desnormalización), no a un modelo normalizado.</p>
          </div>
          <div class="card">
            <h3>Orientada a Columnas (OLAP)</h3>
            <p><b>✅</b> Muy eficiente en consultas que acceden a <b>pocas columnas y muchas filas</b>; <b>alta
            compresión</b> (valores similares juntos); optimizada para <b>agregaciones</b> (SUM, AVG, COUNT) y cargas
            masivas en batch.</p>
            <p><b>⚠️</b> <b>Mayor latencia al recuperar registros completos</b> (hay que reconstruirlos desde varias
            ubicaciones); <b>escrituras y actualizaciones lentas</b>; integridad referencial compleja; difícil migrar de
            proveedor.</p>
            <p class="mini"><b>Similitudes con el relacional:</b> organiza en tablas con filas y columnas y usa SQL (o un
            dialecto). A diferencia del OLTP relacional, prioriza la <b>velocidad de lectura y agregación</b> por sobre la
            integridad transaccional estricta: muchas garantizan consistencia sólo a nivel de consulta o batch de carga,
            <b>no ACID completo</b>.</p>
          </div>
          <div class="card">
            <h3>Series Temporales</h3>
            <p><b>✅</b> Optimizada para <b>escrituras masivas en tiempo real</b>; compresión eficiente de históricos;
            consultas rápidas <b>por rangos de tiempo</b> con funciones específicas (agregaciones, <i>downsampling</i>);
            crece horizontalmente; se integra con monitoreo y visualización.</p>
            <p><b>⚠️</b> Alto consumo de almacenamiento sin <b>políticas de retención</b>; menos flexible que una SQL
            general; limitada para consultas <b>no temporales</b>; ecosistema más reducido.</p>
          </div>
        </div>

        <div class="callout key">
          <div class="callout-title">⚠️ Diferencia que preguntan: Familia de Columnas vs. Orientada a Columnas</div>
          <p>Ambos agrupan datos por columna en algún nivel, <b>pero con propósitos distintos</b>:</p>
          <ul>
            <li><b>Familia de Columnas</b> (Cassandra, HBase) es un <b>modelo NoSQL de agregados</b>: cada fila es un
            registro con <b>columnas dinámicas</b>, pensado para <b>OLTP distribuido de alto volumen</b>
            (lecturas/escrituras <b>por clave</b>).</li>
            <li><b>Orientada a Columnas</b> (BigQuery, Redshift) es una <b>estrategia de almacenamiento físico
            columnar</b>, en general sobre <b>esquema fijo</b>, pensada para <b>OLAP</b> y consultas analíticas sobre
            grandes volúmenes.</li>
          </ul>
        </div>

        <h2>Cómo elegir (árbol de decisión para el parcial)</h2>
        ${APP.uml(`graph TD
    Q0{"¿Qué hace el servicio<br/>con los datos?"}
    Q0 -->|"Guardar y leer por una clave:<br/>sesiones, tokens, caché"| KV["Clave-Valor<br/>Redis"]
    Q0 -->|"Lecturas de sensores / métricas<br/>con marca de tiempo"| TS["Series Temporales<br/>InfluxDB · Prometheus"]
    Q0 -->|"Documentos variables / anidados:<br/>catálogo, contenido, perfiles"| DOC["Documentos<br/>MongoDB"]
    Q0 -->|"Escritura masiva + lectura por clave,<br/>multi-región: historiales, feeds, IoT"| CF["Familia de Columnas<br/>Cassandra"]
    Q0 -->|"Reportes y agregaciones<br/>sobre históricos (OLAP)"| COL["Orientada a Columnas<br/>BigQuery · Redshift"]
    Q0 -->|"La pregunta es sobre RELACIONES:<br/>recomendación, fraude, redes"| GR["Grafos<br/>Neo4j"]
    style Q0 fill:#ffe4e9,stroke:#a4133c,color:#0f172a`, "Elegir el tipo de base NoSQL")}

        <div class="callout key">
          <div class="callout-title">🎯 Respuestas modelo (casos reales de los finales)</div>
          <ul>
            <li><b>“Servicio de Recepción y Procesamiento de lecturas de sensores”</b> → <b>Series Temporales</b>
            (InfluxDB/Timescale): las lecturas llegan de forma periódica y masiva, se consultan por <b>rango de tiempo</b>
            y se agregan (promedios, downsampling); el patrón es <b>escritura intensiva append-only</b> y las políticas de
            retención resuelven el volumen. <i>Alternativa válida: Familia de Columnas (Cassandra) si además hay
            multi-región y acceso por clave de dispositivo.</i></li>
            <li><b>“Servicio de Estadísticas / reportes históricos”</b> → <b>Orientada a Columnas</b> (BigQuery/Redshift):
            las consultas tocan <b>pocas columnas y muchas filas</b> con agregaciones (top 10, promedios, distribuciones),
            se alimenta por batch y tolera no tener ACID completo.</li>
            <li><b>“Sesiones de usuario / tokens / caché de consultas repetidas”</b> → <b>Clave-Valor</b> (Redis):
            acceso por clave, ultra rápido, con TTL; externalizar la sesión es lo que permite servicios
            <a class="inline" data-go="p2-sesiones">stateless</a> y escalado horizontal sin sticky sessions.</li>
            <li><b>“Catálogo de productos / publicaciones con atributos distintos según el tipo”</b> →
            <b>Documentos</b> (MongoDB): esquema dinámico, cada documento con su estructura, y los datos anidados se leen
            de una sola vez sin JOINs.</li>
            <li><b>“Recomendaciones, amistades, detección de circuitos de fraude”</b> → <b>Grafos</b> (Neo4j): la
            información valiosa está en las <b>relaciones</b>, y recorrerlas en SQL exigiría JOINs recursivos costosos.</li>
            <li><b>“Historial de mensajes / feed de actividad a gran escala”</b> → <b>Familia de Columnas</b> (Cassandra):
            escritura masiva, lectura por clave y rango, alta disponibilidad sin punto único de falla.</li>
          </ul>
        </div>

        <h2>Persistencia políglota</h2>
        <div class="callout key">
          <p>“Consiste en <b>usar diferentes tipos de bases de datos dentro de una misma aplicación o ecosistema</b>,
          eligiendo la tecnología que mejor se adapte a cada tipo de necesidad.” Las aplicaciones actuales son más
          complejas y manejan datos distintos: gestionar todo con una única base puede comprometer el <b>rendimiento</b> y
          la <b>escalabilidad</b>.</p>
        </div>
        <div class="grid-2">
          <div class="card">
            <h3>✅ Ventajas</h3>
            <ul>
              <li>Se elige la base <b>más adecuada para cada caso</b>.</li>
              <li>Mejor rendimiento y escalabilidad: se distribuyen los datos en sistemas especializados en vez de forzar a una sola base.</li>
              <li>Mayor flexibilidad para manejar distintos tipos de datos (estructurados, no estructurados, grafos).</li>
            </ul>
          </div>
          <div class="card">
            <h3>⚠️ Desventajas</h3>
            <ul>
              <li>Aumento de la <b>complejidad y el costo</b> de administrar múltiples bases.</li>
              <li>Necesidad de <b>integrar y sincronizar</b> tecnologías distintas para evitar inconsistencias y duplicados.</li>
              <li>Mayor dificultad de <b>desarrollo y pruebas</b>.</li>
            </ul>
          </div>
        </div>
        <div class="callout tip">
          <p><b>Encaja perfecto con microservicios:</b> “cada servicio puede usar el tipo de base que mejor se ajusta a sus
          necesidades”. En el parcial, proponer políglota es una respuesta de alto nivel: relacional para el dominio
          transaccional (mascotas, usuarios), TSDB para lecturas de sensores, columnar para estadísticas y Redis para
          sesiones/caché — y aclarar que el costo es operar 4 motores.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2nsQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2nsQuiz"), [
        { n: 1, topic: "Elección", type: "mc", q: "Cientos de sensores domésticos envían lecturas cada pocos segundos y después se consultan por rango de tiempo. ¿Qué tipo propones?", options: [
          { t: "Series temporales (InfluxDB / TimescaleDB)", ok: true },
          { t: "Grafos (Neo4j)", ok: false },
          { t: "Clave-valor (Redis)", ok: false },
        ], explain: "Escritura masiva append-only + consulta por rangos de tiempo + downsampling y retención: es el caso de uso canónico de una TSDB." },
        { n: 2, topic: "Elección", type: "mc", q: "El servicio de Estadísticas calcula top 10, promedios y distribuciones sobre todo el histórico. ¿Qué tipo?", options: [
          { t: "Orientada a columnas (BigQuery / Redshift): OLAP", ok: true },
          { t: "Familia de columnas (Cassandra)", ok: false },
          { t: "Documentos (MongoDB)", ok: false },
        ], explain: "Pocas columnas, muchas filas y agregaciones: almacenamiento columnar con alta compresión. Cassandra es OLTP por clave, no analítica." },
        { n: 3, topic: "Diferencias", type: "mc", q: "Cassandra es…", options: [
          { t: "Familia de columnas: modelo de agregados para OLTP distribuido de alto volumen", ok: true },
          { t: "Orientada a columnas: almacenamiento columnar para OLAP", ok: false },
          { t: "Orientada a documentos", ok: false },
        ], explain: "La diferencia es el propósito: Cassandra/HBase = OLTP por clave a gran escala; BigQuery/Redshift = OLAP analítico." },
        { n: 4, topic: "Clave-valor", type: "vf", q: "Una base clave-valor permite buscar por el contenido del valor.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Es su limitación principal: no soporta consultas complejas ni búsquedas por el contenido del valor, sólo acceso por clave." },
        { n: 5, topic: "Políglota", type: "open", q: "Definí persistencia políglota y nombrá una ventaja y una desventaja.", answer: "Usar diferentes tipos de bases de datos dentro de una misma aplicación o ecosistema, eligiendo la tecnología que mejor se adapte a cada necesidad. Ventaja: mejor rendimiento y escalabilidad, porque cada dato vive en un motor especializado en vez de forzar a una sola base a manejar todo. Desventaja: aumenta la complejidad y el costo de administración, y obliga a integrar y sincronizar tecnologías distintas para evitar inconsistencias y datos duplicados." },
      ]);
    },
  });
})();
