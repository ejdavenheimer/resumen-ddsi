/* ============================================================
   P2 · Resumen imprimible — hojas A4 para llevar al parcial
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-imprimible",
    title: "🖨️ Resumen imprimible P2",
    tag: "🖨️",
    group: "Parcial 2 (práctica)",
    resumen: "Todo el 2º parcial en hojas A4 para llevar en papel",
    keywords: ["imprimible", "resumen", "p2", "segundo parcial", "pdf", "a4", "chuleta", "papel"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · 2º Parcial</div>
          <h1>Resumen imprimible — 2º Parcial (A4)</h1>
          <p class="lead">Modelado de datos, persistencia y arquitectura, condensados. Descargalo en PDF y llevalo impreso.</p>
        </div>
        <div class="callout key resumen-print-btn">
          <div class="callout-title">📥 Cómo bajarlo en PDF</div>
          <ol style="margin:.3rem 0 .6rem">
            <li>Tocá <b>“Descargar PDF (A4)”</b>.</li>
            <li>Destino <b>“Guardar como PDF”</b>, tamaño <b>A4</b>.</li>
            <li>Activá <b>“Gráficos de fondo”</b> para que se vean los recuadros de color.</li>
          </ol>
          <button class="btn" id="p2rpPrint" type="button">📥 Descargar PDF (A4)</button>
        </div>

        <!-- ===================== HOJA 1 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 1 · PERSISTENCIA + MODELO RELACIONAL</span>
          <p class="mini"><b>Persistencia:</b> que el <b>estado del sistema sobreviva más allá del proceso que lo creó</b> (más allá de una única ejecución), almacenándolo en un medio persistente.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estrategia</th><th>Qué es</th><th>✅ / ⚠️</th></tr></thead>
            <tbody>
              <tr><td><b>En memoria</b></td><td>El dato sigue existiendo entre operaciones. RAM volátil (hay memorias persistentes)</td><td>✅ velocidad, <b>tests</b> · ⚠️ volátil</td></tr>
              <tr><td><b>En archivos</b></td><td>XML, CSV, ancho fijo, JSON</td><td>✅ simple, intercambio · ⚠️ sin consultas ni integridad</td></tr>
              <tr><td><b>Prevalencia</b></td><td>Estado en memoria + <b>snapshots</b> a disco; maneja transacciones (Prevayler)</td><td>✅ <b>no transforma</b> datos → performance y transparencia · ⚠️ <b>sin interoperabilidad</b>, mucha RAM</td></tr>
              <tr><td><b>Ortogonal</b></td><td><b>Propiedad intrínseca del entorno</b>: transparente (SO: hibernación; VMware)</td><td>✅ sin código · ⚠️ depende del entorno</td></tr>
              <tr><td><b>BD de objetos</b></td><td>Atada a <b>un lenguaje</b> (representación interna)</td><td>✅ no transforma → performance · ⚠️ <b>interoperabilidad</b></td></tr>
              <tr><td><b>BD relacional / NoSQL</b></td><td>Requiere <b>transformación</b> previa</td><td>✅ <b>interoperabilidad</b>, recuperación ante fallos, integridad · ⚠️ impedance mismatch</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Repositorio:</b> NO es patrón de diseño, es <b>patrón ARQUITECTÓNICO</b>; se apoya en capas, propone una capa de persistencia con objetos Repository (agregar/modificar/eliminar/buscar/buscarTodos). <b>DAO</b> = el que realmente accede a los datos (BD relacional, NoSQL, memoria, archivos). Repositorio + <b>Strategy</b> para elegir el DAO: <b>el cliente no debe enterarse cuál es el medio persistente</b>.</p>
          <h3>Modelo relacional — Codd, IBM, 1970</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Modelo</th><th>Implementación</th><th>Definición</th></tr></thead>
            <tbody>
              <tr><td>Relación</td><td>Tabla</td><td>Donde se almacenan los datos (relación base → tabla)</td></tr>
              <tr><td>Tupla</td><td>Fila</td><td>El registro</td></tr>
              <tr><td>Atributo</td><td>Columna</td><td>Campo dentro de la tupla</td></tr>
              <tr><td><b>Dominio</b></td><td>Tipo + restricciones</td><td>Conjunto de valores posibles; <b>menor unidad semántica</b></td></tr>
              <tr><td><b>Cardinalidad</b></td><td>Nº de filas</td><td><b>Número de tuplas</b></td></tr>
              <tr><td><b>Grado</b></td><td>Nº de columnas</td><td><b>Número de atributos</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>PK:</b> identifica unívocamente cada fila. 3 tipos: <b>natural</b> (campo propio: CUIT, nro. de serie), <b>subrogada</b> (ficticia/autogenerada), <b>compuesta</b> (varias columnas). · <b>FK:</b> una o más columnas que referencian la PK de otra tabla; <b>puede ser parte de una PK</b>. · <b>Integridad referencial:</b> la FK siempre debe corresponder a una <b>fila válida</b>; mantiene la relación <b>sincronizada</b> en updates y deletes. · <b>PK y FK son índices.</b></p>
          <p class="mini"><b>Tipos:</b> VARCHAR, INTEGER, DOUBLE, DATETIME (dinero → DECIMAL). <b>Constraints:</b> NOT NULL · UNIQUE · CHECK (o enum) · PRIMARY KEY · FOREIGN KEY.</p>
          <div class="callout key"><p class="mini"><b>CARDINALIDAD = cantidad MÁXIMA</b> de relaciones de un registro respecto de la otra entidad (1, N). <b>MODALIDAD = cantidad MÍNIMA</b> (0 = opcional → FK NULL; 1 = obligatoria → FK NOT NULL). “<b>puede</b>” → 0 · “<b>debe</b>” → 1.</p></div>
          <p class="mini"><b>1:1</b> → FK + UNIQUE del lado dependiente (uni o bidireccional). <b>1:N / N:1</b> → <b>FK del lado “muchos”</b>; es <b>cuestión de perspectiva</b> (si A→B es 1:N, B→A es N:1). <b>N:M</b> → <b>NO es posible en el modelo relacional</b> (harían falta múltiples FKs sin saber cuántas): <b>se parte en dos 1:N con entidad intermedia C</b>, con FK a A y FK a B (PK compuesta) y <b>puede guardar datos extra de la relación</b> (si los guarda, deja de ser “simple tabla intermedia” y pasa a ser entidad del dominio: Cursada, Inscripción).</p>
        </section>

        <!-- ===================== HOJA 2 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 2 · FORMAS NORMALES (lo que tomaron el 17/11)</span>
          <p class="mini"><b>Normalización:</b> proceso de estructurar un modelo relacional <b>eliminando redundancia y dependencias mal ubicadas</b> mediante la aplicación sucesiva de las formas normales (1FN, 2FN, 3FN, BCNF). <b>Regla de oro: un dato, un solo lugar.</b> <b>Beneficio:</b> evita anomalías de inserción, actualización y borrado; la integridad la garantiza el modelo. <b>Costo:</b> más tablas, más JOINs. <b>Conclusión: optimiza la ESCRITURA y la INTEGRIDAD, no la lectura.</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>FN</th><th>Exige</th><th>Se rompe cuando…</th><th>Se corrige</th></tr></thead>
            <tbody>
              <tr><td><b>1FN</b></td><td>Atributos <b>atómicos</b>, sin grupos repetitivos, con PK, un dominio por columna</td><td>Celda con lista (“pollo, maní”), columnas <code>tel_1, tel_2</code>, tabla sin PK</td><td>El multivaluado sale a una <b>tabla hija</b> con FK (1:N)</td></tr>
              <tr><td><b>2FN</b></td><td>1FN + todo atributo no clave depende de la <b>PK COMPLETA</b></td><td><b>Dependencia parcial:</b> con PK compuesta, un atributo depende de <b>una sola parte</b> (<code>nombre_producto</code> en DETALLE)</td><td>Cada atributo con la clave de la que depende</td></tr>
              <tr><td><b>3FN</b></td><td>2FN + ningún atributo no clave depende de <b>otro no clave</b></td><td><b>Dependencia transitiva:</b> PK→A→B (<code>nombre_depto</code> en EMPLEADO) o campo <b>calculable</b> (<code>subtotal</code>)</td><td>Extraer la entidad y dejar sólo la <b>FK</b></td></tr>
              <tr><td><b>BCNF</b></td><td>3FN + <b>todo determinante es clave candidata</b></td><td>Un atributo no clave determina parte de una clave</td><td>Descomponer</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Atajo:</b> si la PK es de <b>una sola columna</b> y está en 1FN, <b>la 2FN se cumple sola</b> (las dependencias parciales sólo existen con PK compuesta).</p>
          <h3>Las 3 anomalías (el “qué problema hay”)</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Anomalía</th><th>Qué pasa</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td><b>Inserción</b></td><td>No se puede dar de alta un hecho sin inventar otro</td><td>No puedo crear un Departamento sin un empleado</td></tr>
              <tr><td><b>Actualización</b></td><td>El dato vive en N filas: o lo actualizo en todas o queda inconsistente</td><td>Cambia el piso del depto → tocar todas las filas</td></tr>
              <tr><td><b>Borrado</b></td><td>Al borrar un registro pierdo info de otra entidad</td><td>Borro al último empleado y pierdo el departamento</td></tr>
            </tbody>
          </table></div>
          <h3>Auditar un DER en 60 segundos</h3>
          <p class="mini"><b>1)</b> ¿Celdas con listas o columnas numeradas? → 1FN. <b>2)</b> ¿PK compuestas? ¿algún atributo depende de una sola parte? → 2FN. <b>3)</b> ¿Hay un nombre/descripción “de otra entidad” metido (nombre_depto, nombre_cliente, nombre_categoria)? → 3FN. <b>4)</b> ¿Campo calculable (total, subtotal, edad, cantidad_de_X)? → 3FN. <b>5)</b> ¿El mismo dato en dos tablas? → ¿error o <b>desnormalización deliberada</b>?</p>
          <div class="callout key">
            <div class="callout-title">PLANTILLA DE RESPUESTA (2 renglones)</div>
            <p class="mini"><b>Si NO cumple:</b> “<b>No cumple la 3FN</b>: en <i>TABLA</i>, <code>campo</code> no depende de la PK sino de <code>otro_campo</code>, que es atributo no clave (<b>dependencia transitiva</b>). Genera <b>redundancia</b> y <b>anomalías de actualización y borrado</b>: [ejemplo concreto]. <b>Se corrige</b> extrayendo <i>ENTIDAD(PK, …)</i> y dejando sólo la FK. <b>1FN y 2FN sí se cumplen</b> (atributos atómicos y PK simple).”</p>
            <p class="mini"><b>Si cumple:</b> “<b>Sí, cumple las tres:</b> atributos atómicos y PK en cada tabla (1FN); en las PK compuestas ningún atributo depende de una sola de sus partes (2FN); ningún atributo no clave depende de otro no clave — cada entidad en su tabla, referenciada por FK (3FN).”</p>
          </div>
        </section>

        <!-- ===================== HOJA 3 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 3 · DESNORMALIZACIÓN</span>
          <p class="mini"><b>Definición:</b> decisión de diseño <b>consciente</b> de introducir <b>redundancia controlada</b> en un modelo <b>previamente normalizado</b> —replicando o derivando atributos— para satisfacer un requerimiento que el modelo normalizado no puede cumplir: <b>preservar la consistencia histórica</b> o <b>alcanzar la performance</b> que el negocio exige. <b>No es un error ni un atajo:</b> se toma después de normalizar, se documenta y se justifica. <b>“Desnormalizar sin haber normalizado antes no es desnormalizar: es modelar mal.”</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Criterio</th><th>Normalizado</th><th>Desnormalizado</th></tr></thead>
            <tbody>
              <tr><td>Redundancia</td><td>Mínima o nula</td><td>Controlada y deliberada</td></tr>
              <tr><td>Integridad</td><td>La garantiza el modelo</td><td><b>Responsabilidad de la aplicación</b></td></tr>
              <tr><td>Costo de lectura</td><td>Alto (JOINs, agregaciones)</td><td>Bajo</td></tr>
              <tr><td>Costo de escritura</td><td>Bajo (un solo lugar)</td><td>Alto (propagar cada copia)</td></tr>
              <tr><td><b>Riesgo principal</b></td><td>Degradación de performance</td><td><b>Inconsistencia entre copias</b></td></tr>
              <tr><td>Ámbito</td><td>OLTP / transaccional</td><td>Reporting, OLAP, alta frecuencia de lectura</td></tr>
            </tbody>
          </table></div>
          <div class="grid-2">
            <div class="card">
              <h3>① Forzada por CONSISTENCIA</h3>
              <p class="mini">Datos que <b>deben quedar congelados en el instante del hecho</b>. Si sólo hay FK al dato vigente, <b>cualquier cambio posterior reescribe el pasado</b>. La FK dice “el valor <b>actual</b>”; el negocio necesita “el valor <b>al momento del hecho</b>”. <b>No es performance: el modelo normalizado devuelve un resultado INCORRECTO para el negocio.</b> Aplica a <b>comprobantes, contratos, liquidaciones y auditoría</b> (documentos <b>inmutables</b>).</p>
              <p class="mini"><b>Ej.:</b> <code>precio_unitario_aplicado</code> y <code>descripcion_producto</code> en DETALLE_FACTURA (si el producto pasa de $1.000 a $1.200, todas las facturas emitidas cambiarían de importe). <code>razon_social_emision, cuit_emision, domicilio_emision, cond_iva_emision</code> en FACTURA (el cliente se muda y la factura de hace 6 meses exhibe un domicilio que nunca figuró).</p>
            </div>
            <div class="card">
              <h3>② Forzada por PERFORMANCE</h3>
              <p class="mini">El modelo <b>es correcto pero no responde en los tiempos</b> que el negocio exige. <b>El resultado es el mismo; cambia el costo de obtenerlo.</b> El costo está en los <b>JOINs sobre grandes volúmenes</b> y las <b>agregaciones repetidas</b> (SUM, COUNT, GROUP BY). Se justifica si la relación <b>lectura/escritura es muy asimétrica</b>. <b>Es de ÚLTIMA instancia:</b> antes van <b>índices, reescritura de consultas, caché, particionamiento y réplicas de lectura</b>. <b>Exige MEDICIÓN previa</b> (plan de ejecución, tiempos, volumen), nunca intuición.</p>
              <p class="mini"><b>Ej.:</b> <code>nombre_categoria</code> en PUBLICACION (40.000 consultas/min) — <b>conservando la FK</b>; <code>FACTURA.importe_total</code>; <code>VENTA_DIARIA_POR_SUCURSAL</code> por batch nocturno (base del <b>esquema estrella</b>).</p>
            </div>
          </div>
          <p class="mini"><b>CRITERIO:</b> si el dato <b>integra un documento con valor probatorio → SE COPIA</b>; si sólo sirve para <b>navegar → SE REFERENCIA</b>. · <b>Copiar:</b> domicilio de entrega de un pedido despachado, precio y alícuota de IVA facturados, usuario que aprobó un movimiento, cotización aplicada. · <b>Referenciar:</b> domicilio de contacto, categoría del producto.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Técnica</th><th>En qué consiste</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>Atributo replicado</td><td>Copiar en la hija un atributo del maestro</td><td><code>nombre_categoria</code></td></tr>
              <tr><td>Dato de contexto congelado</td><td>Guardar el valor vigente al momento del hecho</td><td><code>precio_unitario_aplicado</code></td></tr>
              <tr><td>Campo derivado</td><td>Almacenar el resultado de un cálculo</td><td><code>importe_total</code></td></tr>
              <tr><td>Tabla de resumen</td><td>Preagregar por período/dimensión (batch)</td><td><code>VENTA_DIARIA</code></td></tr>
              <tr><td>Vista materializada</td><td>Persistir una consulta, refrescada por el motor</td><td>Ranking de más vendidos</td></tr>
              <tr><td>Fusión 1:1</td><td>Unificar entidades que siempre se leen juntas</td><td>USUARIO + PERFIL</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>EL PRECIO:</b> ① reaparecen las <b>anomalías de actualización</b>; ② la escritura se encarece (UPDATE puntual → propagación con bloqueos); ③ la integridad <b>pasa al software</b> (triggers, servicios, batch); ④ la transacción se amplía (deadlocks) o aparece la <b>ventana de inconsistencia</b>; ⑤ más volumen, índices y backups.</p>
          <p class="mini"><b>Lectura sucia (dirty read):</b> leer datos de una transacción <b>no confirmada</b> que puede hacer rollback (depende del <b>nivel de aislamiento</b>). <b>Distinto:</b> al desnormalizar se lee una <b>copia desactualizada</b> — el dato está confirmado, pero <b>es viejo</b>. <b>Ventana de inconsistencia</b> = tiempo entre el cambio en la fuente de verdad y la actualización de la copia (si es asincrónica → <b>consistencia eventual</b>). <b>La pregunta no es “¿puede haber inconsistencia?” sino “¿CUÁNTA y POR CUÁNTO TIEMPO la tolera el negocio?”</b></p>
          <p class="mini"><b>BUENAS PRÁCTICAS:</b> documentar la decisión y declarar la <b>fuente de verdad</b> · <b>conservar la FK</b> original · prever un <b>proceso de recálculo</b> y reconciliación (<b>todo dato derivado debe ser reconstruible</b>) · <b>monitorear la divergencia</b> · acotar y hacer explícita la ventana · <b>encapsular la actualización en un único punto</b> del código.</p>
        </section>

        <!-- ===================== HOJA 4 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 4 · ORM E IMPEDANCE MISMATCH</span>
          <p class="mini"><b>ORM (técnica):</b> convertir los tipos de datos de un lenguaje OO a los de una BD relacional. <b>ORM (framework):</b> introduce una <b>capa de abstracción</b> y evita escribir consultas a mano. <b>Impedance mismatch:</b> el <b>desajuste</b> entre los dos mundos — características difíciles de imitar.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>#</th><th>Desajuste</th><th>Problema</th><th>Solución</th></tr></thead>
            <tbody>
              <tr><td>1</td><td><b>Identidad</b></td><td>El objeto cumple <b>unicidad</b>; el registro necesita identificación <b>unívoca</b></td><td>Clave <b>natural</b> (CUIT, nro. serie) o <b>subrogada</b> (autogenerada). Subrogada + UNIQUE en la natural</td></tr>
              <tr><td>2</td><td><b>Conversión de tipos</b></td><td>String sin límite vs <b>VARCHAR(n)</b>; precisión de decimales; <b>LocalDate</b> vs Date/Datetime/Time; booleanos; <b>enumerados</b></td><td>length/precision/scale; DECIMAL para dinero; <b>converters</b> para enums</td></tr>
              <tr><td>3</td><td><b>Cardinalidad</b></td><td>En POO hay <b>navegabilidad bidireccional</b>; en relacional <b>las relaciones NO son bidireccionales</b></td><td>Una sola FK del lado “muchos” + <code>mappedBy</code>; N:M → tabla intermedia</td></tr>
              <tr><td>4</td><td><b>Herencia</b></td><td><b>No existe en el mundo relacional.</b> ¿Cuántas tablas? ¿cómo sabe el ORM qué clase instanciar?</td><td>SINGLE_TABLE · JOINED · TABLE_PER_CLASS · MAPPED_SUPERCLASS</td></tr>
            </tbody>
          </table></div>
          <div class="grid-2">
            <div class="card">
              <h3>Active Record</h3>
              <p class="mini">El ORM <b>decora las entidades de dominio</b> con responsabilidades de persistencia: <code>save</code>, <code>delete</code>, <code>update</code>, <code>find/findBy/findAll</code>. <b>El objeto se persiste a sí mismo.</b> Rails, Eloquent, Django. ⚠️ Rompe <b>Responsabilidad Única</b> y acopla el dominio a la infraestructura.</p>
            </div>
            <div class="card">
              <h3>Data Mapper</h3>
              <p class="mini">Agrega un <b>componente intermedio</b> entre la base y las entidades: el <b>“entity manager”</b>, responsable de buscar, agregar, modificar y eliminar. <b>La entidad no sabe que se persiste.</b> <b>Hibernate/JPA</b>, Doctrine. ✅ Dominio limpio y testeable.</p>
            </div>
          </div>
          <p class="mini"><b>HIDRATACIÓN</b> (“¿cómo recupera un ORM un objeto?”): <b>1)</b> <b>instanciar</b> la clase (previo SELECT de los datos mínimos); <b>2)</b> <b>popular</b> el objeto asignando a cada atributo <b>no marcado como lazy</b> los valores recuperados. Si está <b>lazy</b>, el ORM <b>no lo setea</b>: lo popula de forma transparente <b>cuando se lo llama explícitamente</b>.</p>
          <p class="mini"><b>LAZY</b> = carga en memoria <b>sólo al momento de su utilización</b> (default de <code>@OneToMany</code>/<code>@ManyToMany</code>); ⚠️ <b>N+1 queries</b> (1 + N consultas) → se resuelve con <b>JOIN FETCH</b> puntual, no cambiando el mapeo global; y <code>LazyInitializationException</code> si la sesión se cerró. <b>EAGER</b> = carga <b>independientemente de si van a ser utilizados</b> (default de <code>@ManyToOne</code>/<code>@OneToOne</code>); ⚠️ trae datos de más.</p>
          <p class="mini"><b>CASCADA:</b> “cuando realicemos una acción en la entidad objetivo, <b>la misma acción se aplicará a la asociada</b>”. <b>ALL</b> (todas) · <b>PERSIST</b> (guardar) · <b>MERGE</b> (actualizar) · <b>REMOVE</b> (eliminar) · <b>REFRESH</b> (re-popular) · <b>DETACH</b> (quitar del contexto persistente). Ejemplo de la cátedra: Persona–Dirección, la dirección no tiene significado sin la persona → al eliminar Persona se elimina Dirección. <b>Regla:</b> cascade ALL donde hay <b>composición ◆</b>; sin REMOVE donde hay <b>agregación ◇</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Caché</th><th>Alcance</th><th>Detalle</th></tr></thead>
            <tbody>
              <tr><td><b>1er nivel</b></td><td><b>Sesión</b></td><td>Cada instancia <b>se carga sólo una vez</b> en el contexto persistente; <b>termina al cerrar la sesión</b>; aísla sesiones concurrentes. <b>Siempre activa.</b></td></tr>
              <tr><td><b>2do nivel</b></td><td><b>SessionFactory</b></td><td><b>Compartida por todas las sesiones</b> de la misma factory; <b>no todos los ORM la tienen</b>. Al buscar por id: 1er nivel → 2do nivel (se obtiene el estado, <b>se hidrata</b>) → búsqueda normal.</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Estrategias de concurrencia (2do nivel):</b> <b>READ_ONLY</b> (entidades que nunca cambian; muy adecuada) · <b>NONSTRICT_READ_WRITE</b> (se actualiza <b>después</b> del commit; <b>pequeña ventana de datos obsoletos</b>; tolera inconsistencia mínima) · <b>READ_WRITE</b> (<b>consistencia fuerte</b> con <b>bloqueos “suaves”</b>; las transacciones concurrentes sobre registros bloqueados <b>van al medio persistente</b>). <b>Representación interna:</b> no se guardan objetos sino <b>su estado</b>; <b>no</b> se guardan atributos transitorios; <b>no</b> se guardan colecciones (salvo que se explicite); en relaciones <b>xToOne sólo el id</b>.</p>
        </section>

        <!-- ===================== HOJA 5 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 5 · HIBERNATE Y MAPEO DE HERENCIA</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Annotation</th><th>Equivale a</th></tr></thead>
            <tbody>
              <tr><td><code>@Entity</code> / <code>@Table(name)</code></td><td>Una tabla</td></tr>
              <tr><td><code>@Id</code> + <code>@GeneratedValue(IDENTITY|SEQUENCE|TABLE|AUTO)</code></td><td>PK (<b>subrogada</b>). Clave <b>natural</b> → <code>@Id</code> <b>sin</b> GeneratedValue</td></tr>
              <tr><td><code>@Column(nullable=false, unique=true, length, precision, scale)</code></td><td>NOT NULL · UNIQUE · VARCHAR(n) · DECIMAL(p,s)</td></tr>
              <tr><td><code>@Transient</code></td><td><b>No se persiste</b> (calculado)</td></tr>
              <tr><td><code>@OneToOne</code> + <code>@JoinColumn(unique=true)</code></td><td>FK + UNIQUE del lado dependiente</td></tr>
              <tr><td><code>@ManyToOne(optional=false)</code> + <code>@JoinColumn(nullable=false)</code></td><td><b>FK del lado “muchos”</b> (dueño), NOT NULL</td></tr>
              <tr><td><code>@OneToMany(mappedBy="…", cascade, orphanRemoval)</code></td><td>Lado <b>inverso</b> (no crea columna)</td></tr>
              <tr><td><code>@ManyToMany</code> + <code>@JoinTable(joinColumns, inverseJoinColumns)</code></td><td><b>Tabla intermedia</b></td></tr>
              <tr><td><code>@ElementCollection</code> + <code>@CollectionTable</code></td><td><b>Tabla hija</b> para colección de <b>tipos simples</b> (resuelve 1FN)</td></tr>
              <tr><td><code>@Embeddable</code> / <code>@Embedded</code></td><td><b>Value Object</b>: sus columnas viven <b>en la tabla del dueño</b> (sin identidad propia)</td></tr>
              <tr><td><code>@Enumerated(EnumType.STRING)</code></td><td>VARCHAR + CHECK. <b>NUNCA ORDINAL</b> (guarda 0,1,2: si se reordena el enum, los históricos quedan mal)</td></tr>
              <tr><td><code>@Converter</code> / <code>AttributeConverter</code></td><td>Control del valor almacenado (enum con código propio)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Defaults de fetch:</b> <code>@ManyToOne</code> y <code>@OneToOne</code> = <b>EAGER</b>; <code>@OneToMany</code> y <code>@ManyToMany</code> = <b>LAZY</b>. · <b>Si la N:M tiene datos propios</b> (nota, fecha, cantidad): <b>NO uses @ManyToMany</b>, creá la <b>entidad intermedia</b> con dos <code>@ManyToOne</code>. · <b>Catálogo administrable → TABLA maestra</b> (“los configura un administrador”); <b>conjunto cerrado → enum con CHECK</b>.</p>
          <h3>⭐ Las 4 estrategias de herencia</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Estrategia</th><th>Tablas</th><th>Polimórfica</th><th>✅</th><th>⚠️</th><th>Elegila cuando</th></tr></thead>
            <tbody>
              <tr><td><b>SINGLE_TABLE</b></td><td><b>1</b> (columna por atributo de <b>todas</b> las clases + <b>discriminador</b>)</td><td>Directa</td><td>Mejor performance (una sola tabla)</td><td>Columnas <b>NULL</b>; sin NOT NULL por subtipo</td><td>Pocos atributos propios y mucha lectura polimórfica</td></tr>
              <tr><td><b>JOINED</b></td><td><b>1 + N</b>; la <b>PK de cada hija es FK</b> a la super</td><td>Con <b>JOIN</b></td><td>Normalizada, sin nulos</td><td>JOINs en cada lectura</td><td>Subtipos con muchos atributos propios y obligatorios</td></tr>
              <tr><td><b>TABLE_PER_CLASS</b></td><td><b>N</b> (sólo concretas); los atributos de la super <b>se repiten</b> en cada una</td><td>Con <b>UNION</b></td><td>Subtipos independientes</td><td>Duplica atributos comunes; UNIONs</td><td>Casi nunca se consulta polimórficamente</td></tr>
              <tr><td><b>MAPPED_SUPERCLASS</b></td><td><b>N</b>; la super <b>NO es entidad</b> (no tiene tabla)</td><td><b>No existe</b></td><td>Simple, reutiliza código</td><td>Sin polimorfismo ni relaciones a la super</td><td>La super sólo aporta <b>comportamiento</b> o 1-2 atributos (id, activo)</td></tr>
            </tbody>
          </table></div>
          <div class="callout key"><p class="mini"><b>FRASE PARA JUSTIFICAR:</b> “Mapeo la jerarquía con <b>SINGLE_TABLE</b> y discriminador porque los subtipos agregan <b>pocos atributos propios</b> y <b>todas las consultas son polimórficas</b> (‘los dispositivos del domicilio’): evito JOINs y UNIONs, asumiendo columnas nulables. Si los subtipos tuvieran muchos atributos obligatorios propios, elegiría <b>JOINED</b> para no perder las restricciones NOT NULL.”</p></div>
        </section>

        <!-- ===================== HOJA 6 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 6 · NOSQL Y PERSISTENCIA POLÍGLOTA</span>
          <p class="mini"><b>NoSQL:</b> almacenamiento y consulta <b>fuera de las estructuras tabulares</b>; esquema <b>dinámico</b> para datos no estructurados (menos necesidad de planificar; más fácil modificar). <b>Es además DISTRIBUIDA:</b> la información se <b>copia en varios servidores</b>, lo que garantiza disponibilidad y fiabilidad. <b>“La decisión relacional vs. no relacional es en gran medida CONTEXTUAL y varía según el CASO DE USO.”</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Tipo</th><th>Cómo guarda</th><th>Producto</th><th>Cuándo proponerla</th><th>⚠️ Límite</th></tr></thead>
            <tbody>
              <tr><td><b>Documentos</b></td><td>JSON/BSON; <b>estructura distinta por documento</b></td><td><b>MongoDB</b></td><td>Catálogo de productos, CMS, perfiles enriquecidos, datos variables</td><td>Duplicación por anidamiento; <b>ACID limitado</b></td></tr>
              <tr><td><b>Clave-Valor</b></td><td>Clave única → valor</td><td><b>Redis</b>, DynamoDB</td><td><b>Sesiones, tokens, CACHÉ</b>, carritos, preferencias</td><td><b>No busca por contenido</b>; sin relaciones; consistencia eventual</td></tr>
              <tr><td><b>Grafos</b></td><td><b>Nodos + arcos</b>, con propiedades en <b>ambos</b></td><td><b>Neo4j</b></td><td>Redes sociales, <b>recomendación</b>, <b>detección de fraude</b>, dependencias de TI</td><td>Escalabilidad horizontal; <b>análisis agregados masivos</b></td></tr>
              <tr><td><b>Familia de Columnas</b></td><td>Filas por clave con <b>columnas dinámicas</b> (column families)</td><td><b>Cassandra</b>, HBase</td><td><b>Escritura masiva</b> + lectura por clave: historiales, feeds, <b>IoT</b>, multi-región</td><td><b>Sin consultas complejas ni cruces</b>; compactaciones; diseño orientado a la consulta</td></tr>
              <tr><td><b>Orientada a Columnas</b></td><td>Columnar: valores de cada columna <b>contiguos</b></td><td><b>BigQuery</b>, Redshift</td><td><b>OLAP</b>: BI, data warehouse, reportes y <b>agregaciones</b> históricas</td><td><b>Escrituras lentas</b>; latencia al traer registros completos</td></tr>
              <tr><td><b>Series Temporales</b></td><td>Datos en orden <b>cronológico</b></td><td><b>InfluxDB</b>, Timescale, Prometheus</td><td><b>Sensores/lecturas</b>, métricas y monitoreo, cotizaciones</td><td>Almacenamiento sin <b>retención</b>; poco flexible para lo no temporal</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>⚠️ Familia de Columnas vs. Orientada a Columnas:</b> <b>Familia</b> (Cassandra/HBase) = modelo NoSQL <b>de agregados</b>, filas con columnas dinámicas, <b>OLTP distribuido de alto volumen</b> (acceso <b>por clave</b>). <b>Orientada</b> (BigQuery/Redshift) = <b>estrategia de almacenamiento físico columnar</b>, esquema fijo, <b>OLAP</b> analítico. Las orientadas a columnas se parecen al relacional (tablas, SQL) pero priorizan <b>velocidad de lectura y agregación</b> sobre la integridad transaccional: <b>no ACID completo</b>.</p>
          <p class="mini"><b>PERSISTENCIA POLÍGLOTA:</b> usar <b>diferentes tipos de bases en una misma aplicación o ecosistema</b>, eligiendo la tecnología que mejor se adapte a cada necesidad. ✅ la base adecuada para cada caso; mejor rendimiento y escalabilidad; flexibilidad de tipos de datos. ⚠️ más complejidad y costo de administración; hay que <b>integrar y sincronizar</b> para evitar inconsistencias y duplicados; desarrollo y pruebas más difíciles.</p>
          <div class="callout key"><p class="mini"><b>RESPUESTAS LISTAS:</b> lecturas de sensores → <b>TSDB</b> · estadísticas/reportes históricos → <b>columnar (OLAP)</b> · sesiones, tokens, caché de consultas repetidas → <b>clave-valor (Redis)</b> · catálogo con atributos variables / contenido → <b>documentos (MongoDB)</b> · recomendación, fraude, redes → <b>grafos (Neo4j)</b> · historial de mensajes/feeds a gran escala, IoT multi-región → <b>familia de columnas (Cassandra)</b>. Y agregá: “la decisión es contextual según el caso de uso; el resto del dominio transaccional sigue en relacional” → <b>persistencia políglota</b>.</p></div>
        </section>

        <!-- ===================== HOJA 7 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 7 · ARMAR EL MODELO DE DATOS (40 pts)</span>
          <p class="mini"><b>Consigna de todos los años:</b> “indicando las entidades con sus respectivos campos, <b>claves primarias</b>, <b>foráneas</b>, <b>cardinalidad</b>, <b>modalidad</b> y <b>restricciones</b> según corresponda”. Y además: <b>enumerar las entidades</b>, <b>indicar supuestos</b> y <b>justificar</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>En el enunciado</th><th>En el modelo</th></tr></thead>
            <tbody>
              <tr><td>Sustantivo que el sistema “registra/administra”</td><td><b>Entidad</b> (tabla con PK)</td></tr>
              <tr><td>“de cada X se conoce A, B, C”</td><td>Atributos de X</td></tr>
              <tr><td>“datos <b>opcionales</b> como…”</td><td>Columna <b>NULL</b> (modalidad 0)</td></tr>
              <tr><td>“(por ejemplo A, B, C o D)” — conjunto cerrado</td><td><b>Enum</b> con CHECK</td></tr>
              <tr><td>“los configura un <b>administrador</b>” / “pueden agregarse”</td><td><b>Tabla maestra</b> + FK</td></tr>
              <tr><td>“<b>historial</b> de…”</td><td>Entidad propia, 1 fila por evento (+ datos congelados)</td></tr>
              <tr><td>“puede incluir <b>archivos adjuntos</b>”</td><td>Tabla hija 1:N con la <b>URL</b> (object storage, nunca el binario)</td></tr>
              <tr><td>Lista de valores simples (alergias, horarios)</td><td><b>Tabla hija</b> / <code>@ElementCollection</code> (1FN)</td></tr>
              <tr><td>Value Object (dirección, dinero, coordenadas)</td><td>Columnas <b>embebidas</b> en la tabla del dueño</td></tr>
              <tr><td>Composición ◆ (la parte no vive sin el todo)</td><td>FK <b>NOT NULL</b> + <b>cascada de borrado</b></td></tr>
              <tr><td>Agregación ◇ (la parte vive por su cuenta)</td><td>FK que puede ser <b>NULL</b>, sin cascada</td></tr>
              <tr><td>Herencia</td><td>Elegir <b>y justificar</b> SINGLE_TABLE / JOINED / TABLE_PER_CLASS / MappedSuperclass</td></tr>
              <tr><td>Método o cálculo</td><td><b>No se persiste</b> (salvo desnormalización justificada)</td></tr>
              <tr><td>Patrón <b>State</b> en el diagrama de clases</td><td><b>No se persisten las clases de estado</b>: sólo <b>el estado actual</b> como atributo</td></tr>
              <tr><td>“<b>historial</b>”, “bitácora”, “trazabilidad”, “qué pasó y cuándo”</td><td><b>Tabla de eventos</b> con <code>fecha_hora</code>, <b>una fila por hecho</b> (1,N). <b>Aparece en 23 de 24 enunciados</b></td></tr>
              <tr><td>“<b>estadísticas</b>”, “el más…”, “top 10”, “promedio”</td><td><b>No se modela la estadística: el HECHO que permite calcularla.</b> Si no podés escribir el COUNT/SUM + GROUP BY, <b>te falta una tabla</b></td></tr>
              <tr><td>“<b>predefinido</b>”, “catálogo”, “tipos posibles”</td><td><b>Tabla catálogo</b> + <b>intermedia</b> con lo elegido</td></tr>
              <tr><td>“<b>puede ajustar los parámetros</b>”, “configurable”</td><td>El valor va <b>en la INTERMEDIA</b>, <b>no en el catálogo</b> (el catálogo lo comparten todos)</td></tr>
              <tr><td>“estado”, “pasa por…”, “acepta o rechaza”</td><td><code>estado VARCHAR</code> + <b>CHECK</b> — <b>NUNCA BOOLEAN</b> si hay más de dos valores</td></tr>
              <tr><td>“vigente desde”, “cambia en el tiempo”, “histórico de precios”</td><td><code>vigente_desde</code> <b>DENTRO de la PK</b> + <code>vigente_hasta</code> NULL en la fila actual</td></tr>
              <tr><td>“único”, “identificatorio”, “código”, “nro. de serie”</td><td><b>UNIQUE</b> (clave natural); la PK puede seguir siendo subrogada</td></tr>
              <tr><td>Microservicios (base por servicio)</td><td>Referencias entre servicios = <b>ID lógico, NO FK</b> (sin integridad referencial; se valida en la app)</td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">LAS 6 DECISIONES DE UN DER DE GESTIÓN (es el que más se toma)</div>
            <p class="mini"><b>① Jerarquía anidada:</b> si el dominio tiene <b>contenedor → equipo → unidad</b>
            (punto → locker → casillero · estación → cargador → conector), son <b>tres tablas</b>, cada una con FK al
            padre. <b>El error grave es colapsarla</b> o poner las unidades como columnas. La PK de la unidad suele ser
            <b>compuesta</b> (<code>nro_serie_equipo + nro_unidad</code>), porque el número sólo identifica dentro de su
            equipo — <b>y la FK hacia ella también debe ser compuesta</b>.
            <b>② Dirección / dato estructurado:</b> ¿entidad o <b>embebida</b>? Embebida si es un <b>Value Object sin
            identidad</b> que no se reutiliza ni se consulta solo; entidad si se comparte, se valida contra un catálogo
            o necesita <b>historial</b>. <b>Lo que puntúa es que lo discutas, no cuál elijas.</b>
            <b>③ N:M vs 1:N:</b> “servicios complementarios” (un servicio está en muchos lugares) → <b>catálogo +
            tabla intermedia</b>; “horarios de atención” (cada franja es de un solo lugar) → <b>tabla hija 1:N</b>.
            <b>Confundirlos es el error más común.</b>
            <b>④ Atributos del tipo → catálogo:</b> medidas del tamaño, potencia del tipo de conector. Si quedan como
            columnas de la unidad, <b>dependen del tipo y no de la unidad</b> → 2FN/3FN.
            <b>⑤ Historial + estado actual:</b> tabla <code>HISTORIAL(…, desde, hasta, motivo)</code> para la
            trazabilidad <b>más</b> el campo <code>estado_actual</code> en la unidad, <b>declarado como desnormalización
            por performance</b>, con el historial como <b>fuente de verdad</b> y proceso de recálculo. Sin declararlo,
            es violación de 3FN.
            <b>⑥ Tarifa / precio con vigencia:</b> si piden <b>conservar el histórico</b>, <code>vigente_desde</code>
            <b>es parte de la PK</b> (cada cambio es una fila, no un UPDATE) y <code>vigente_hasta</code> queda NULL en
            la vigente. Si varía por franja, la <b>franja va a su tabla</b> (columnas <code>precio_pico</code>,
            <code>precio_valle</code> serían grupo repetitivo). <b>Definí el grano:</b> la tarifa es por
            <b>tipo</b>, no por unidad física.</p>
          </div>
          <p class="mini"><b>Notación:</b> <code>1,1</code> exactamente uno · <code>0,1</code> cero o uno · <code>1,N</code> uno o muchos · <code>0,N</code> cero o muchos. Y <b>escribí la lectura en palabras</b> al lado: “un Domicilio tiene <b>cero o muchos</b> Dispositivos / un Dispositivo pertenece a <b>exactamente un</b> Domicilio”.</p>
          <div class="callout key">
            <div class="callout-title">LOS 3 PÁRRAFOS DE JUSTIFICACIÓN (vale 5-10 pts y es siempre igual)</div>
            <p class="mini"><b>a) Qué persistir:</b> “Persisto las <b>entidades con identidad y ciclo de vida propio</b> que el sistema debe recuperar entre ejecuciones. <b>No persisto</b>: objetos de cálculo ni resultados derivables, DTOs de presentación, las clases de comportamiento (State/Strategy) ni los archivos binarios (van a object storage; la base guarda la URL). Los <b>Value Objects</b> sin identidad se persisten <b>embebidos</b>.”</p>
            <p class="mini"><b>b) Impedance mismatches:</b> “<b>Identidad:</b> PK subrogada en todas, salvo donde hay clave natural clara (nro. de serie); UNIQUE en las claves naturales (email, microchip, código). <b>Tipos:</b> VARCHAR con longitud, DATE/DATETIME, <b>DECIMAL</b> para importes (no DOUBLE). <b>Cardinalidad:</b> las relaciones bidireccionales se implementan con <b>una sola FK</b> del lado muchos; las N:M se parten en dos 1:N con tabla intermedia. <b>Herencia:</b> [estrategia] porque [razón]. <b>Enums:</b> STRING con CHECK; catálogos administrables como tabla maestra. <b>Colecciones simples:</b> tabla hija, porque un atributo multivaluado rompe 1FN.”</p>
            <p class="mini"><b>c) Qué desnormalizar:</b> “Por <b>consistencia</b>: [dato] queda congelado en [entidad] porque es un registro histórico inmutable. Por <b>performance</b>: nada por ahora; si [consulta] se vuelve crítica, replicaría [atributo] <b>conservando la FK</b>, declarando [tabla] como <b>fuente de verdad</b>, con la propagación encapsulada y un <b>proceso de recálculo</b>.”</p>
          </div>
          <p class="mini"><b>MÉTODO EN 7 PASOS:</b> ① leé el enunciado entero <b>sin escribir</b>; ② <b>esqueleto primero</b>: sólo cajas con nombre, PK y FK, y las líneas (mover una caja todavía cuesta cero); ③ recién ahí atributos, tipos y restricciones; ④ revisá <b>línea por línea</b>: la <b>pata de gallo va del lado de la FK</b>, <code>o</code> si puede existir sin la otra / <code>|</code> si no puede, y <b>ninguna tabla suelta</b>; ⑤ releé el enunciado <b>oración por oración tachando</b> lo que ya está, y por cada estadística preguntate <b>“¿con qué COUNT o SUM la saco?”</b>; ⑥ escribí <b>3 a 5 supuestos</b>; ⑦ <b>pasalo en limpio</b>: nada tachado, ninguna nota suelta.</p>
          <p class="mini"><b>TIPOS:</b> <code>INT/BIGINT</code> ids y cantidades · <code>DECIMAL(p,s)</code> <b>dinero y medidas exactas</b> · <code>FLOAT/DOUBLE</code> medidas aproximadas (lat/long, temperatura) · <code>VARCHAR(n)</code> texto · <code>CHAR(n)</code> largo fijo (país, moneda) · <code>TEXT</code> texto largo · <code>BOOLEAN</code> sí/no <b>real</b> · <code>DATE</code> / <code>TIME</code> / <code>DATETIME</code> · <code>BLOB</code> <b>evitalo, guardá la URL</b>. <b>DNI, CUIT, teléfono y CP van como VARCHAR</b> (no se hacen cuentas, pueden tener ceros a la izquierda o guiones). <b>Dinero NUNCA en DOUBLE.</b></p>
          <p class="mini"><b>SIGLAS:</b> <b>PK</b> único y NOT NULL · <b>FK</b> referencia a la PK de otra · <b>PK FK</b> parte de la PK y a la vez FK (lo típico de la <b>intermedia</b>) · <b>UK/UNIQUE</b> no se repite pero no es la PK · <b>NN</b> obligatorio (modalidad 1) · <b>NULL</b> opcional (modalidad 0) · <b>CHECK</b> <code>(estado IN (…))</code>, <code>(hora_fin &gt; hora_inicio)</code>, <code>(peso &gt; 0)</code> · <b>DEFAULT</b> <code>activo DEFAULT true</code> · <b>AI</b> el id se genera solo (clave subrogada) · <b>PK compuesta</b> <code>(id_locker, nro_casillero)</code> · <b>UK compuesta</b> <code>UNIQUE (id_rutina, nombre)</code> · <b>IDX</b> opcional (PK y FK ya son índices).</p>
          <p class="mini"><b>⚠️ LOS 7 ERRORES QUE MÁS SE COBRAN:</b> ① el <b>parámetro configurable en el catálogo</b> en vez de en la intermedia ② <b>olvidar la tabla de historial</b> y después no poder calcular ninguna estadística ③ <b>BOOLEAN para un estado</b> de más de dos valores ④ <b>FK del lado equivocado</b>, redundante, o cardinalidades invertidas ⑤ olvidar <b>atributos que el enunciado nombra</b> y las restricciones (UNIQUE del “código único”, NOT NULL de lo obligatorio, CHECK del “puede ser A, B o C”) ⑥ <b>no escribir supuestos ni justificación</b> (es puntaje regalado) ⑦ dejar una <b>tabla suelta</b> sin relaciones.</p>
          <p class="mini"><b>CHECKLIST:</b> ☐ PK en cada tabla (y dije de qué tipo) ☐ FK + cardinalidad + <b>modalidad</b> en cada relación ☐ N:M con tabla intermedia ☐ ningún atributo multivaluado ☐ NOT NULL / UNIQUE / CHECK donde el enunciado los exige ☐ herencia elegida <b>y justificada</b> ☐ <b>lista de supuestos</b> ☐ <b>3 párrafos de justificación</b> ☐ un diagrama <b>por servicio</b> si lo piden, con IDs lógicos entre servicios.</p>
        </section>

        <!-- ===================== HOJA 7 BIS ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 7 BIS · LOS 3 TIPOS DE SERVICIO (te toca uno de estos)</span>
          <p class="mini">Los enunciados describen <b>tres servicios con su propia base</b> y te piden el DER de <b>uno</b>. Siempre son las mismas tres familias. <b>Identificá cuál te tocó y ya sabés qué entidades buscar.</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>① GESTIÓN / RED<br><span class="mini">infraestructura, maestros</span></th><th>② TRANSACCIONAL<br><span class="mini">la operación del negocio</span></th><th>③ OPERACIÓN / AUDITORÍA<br><span class="mini">eventos y métricas</span></th></tr></thead>
            <tbody>
              <tr><td><b>Cómo lo reconocés</b></td><td>“administra la infraestructura”, “de cada X se conoce”, “se registran las intervenciones”</td><td>“el usuario hace / reserva / deposita / retira”, “historial de estados”, “comprobante”</td><td>“recibe eventos de forma periódica y masiva”, “genera métricas agregadas”, “tablero”</td></tr>
              <tr><td><b>Columna vertebral</b></td><td><b>Jerarquía anidada de 3 niveles:</b> contenedor → equipo → unidad (punto→locker→casillero · estación→cargador→conector)</td><td><b>La transacción y su bitácora:</b> operación → ítems → eventos de estado</td><td><b>Hechos con marca de tiempo</b> + tablas de resumen. Casi no hay entidades de negocio</td></tr>
              <tr><td><b>Entidades que casi siempre están</b></td><td>Zona/Responsable · <b>Catálogo de tipos</b> con sus medidas · <b>Horarios</b> (1:N) · <b>Servicios complementarios</b> (N:M) · <b>Mantenimiento</b> + <b>Técnico</b> · <b>Tarifa con vigencia</b> · <b>Historial de disponibilidad</b></td><td>Cliente · Operación (con <b>nro. único</b>) · <b>Ítems/bultos</b> (1,N) · <b>Evento de estado</b> (1,N) · <b>Código/credencial</b> con vencimiento · <b>Pago</b> · <b>Adjuntos</b> (URL) · <b>Devolución/cancelación</b> (0,1)</td><td><b>Evento</b> + <b>catálogo de tipo de evento</b> · <b>Lectura/medición</b> + tipo · <b>Heartbeat</b> · <b>Tabla de resumen</b> (PK fecha+entidad+franja) · <b>DIM_*</b> réplicas · <b>Incidente</b> (con estado) · <b>Liquidación</b></td></tr>
              <tr><td><b>Dónde está el punto fino</b></td><td><b>PK compuesta</b> en la unidad <code>(nro_serie, nro_unidad)</code> — y la FK hacia ella <b>también compuesta</b>. <b>Dirección embebida o entidad:</b> discutilo. <b>Horarios NO son N:M.</b></td><td><b>Congelar</b> los datos del comprobante (consistencia). <b>Estado actual</b> + bitácora. <b>Credencial hasheada</b>, nunca en claro. <b>Varias</b> credenciales si “se regenera”</td><td><b>Las métricas NO son tablas: son consultas.</b> Por cada una escribí el COUNT/SUM. <b>DIM_* = réplica local</b> (read model, consistencia eventual). <b>Congelar</b> el % de comisión en la liquidación</td></tr>
              <tr><td><b>Desnormalización típica</b></td><td><b>Performance:</b> <code>estado_actual</code> derivado del historial</td><td><b>Consistencia:</b> datos del comprobante congelados. <b>Performance:</b> <code>estado</code> derivado del último evento</td><td><b>Performance:</b> tabla de resumen por batch (esquema estrella) + DIM replicadas. <b>Consistencia:</b> todo lo de la liquidación</td></tr>
              <tr><td><b>Qué NO va acá</b></td><td>Las operaciones del negocio (son del ②) ni la telemetría (③)</td><td>La infraestructura (①) ni las métricas (③)</td><td>Los maestros (①): sólo <b>réplicas</b>. Y la telemetría cruda, en rigor, va a <b>TSDB</b>, no a relacional: <b>decilo</b></td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">EL CUARTO PATRÓN, QUE PUEDE APARECER EN CUALQUIERA: catálogo + configuración</div>
            <p class="mini">Disparador: “<b>a partir de un catálogo de X predefinidas</b>” + “<b>el usuario puede ajustar los parámetros</b>”. Solución: <code>CATALOGO(id PK, codigo UNIQUE, descripcion, activo)</code> + <code>CONFIG(id PK, id_usuario FK, …, activa)</code> + <b>intermedia</b> <code>CONFIG_ITEM(id_config PK FK, id_catalogo PK FK, <b>parámetro1, parámetro2</b>)</code> + <code>HISTORIAL_DISPARO</code>.</p>
            <p class="mini"><b>⚠️ EL ERROR QUE MÁS SE COBRA:</b> poner el parámetro ajustable <b>en el catálogo</b>. El catálogo lo <b>comparten todos los usuarios</b>; el valor que <b>este</b> usuario eligió va <b>en la intermedia</b>. En el catálogo sólo va lo que describe al tipo en sí (si admite parámetro, su unidad). Modalidad <b>1,N</b>: no hay configuración sin al menos una condición. Y la <b>PK compuesta</b> de la intermedia ya impide elegir dos veces lo mismo.</p>
          </div>
          <p class="mini"><b>Si el enunciado pide UN DIAGRAMA POR SERVICIO:</b> hacelos <b>separados</b> y marcá las referencias cruzadas como <b>ID lógico</b>, no como FK. Escribilo: “<i>no hay integridad referencial entre servicios; la validación es responsabilidad de la aplicación</i>”. Es una línea y vale puntos.</p>
        </section>

        <!-- ===================== HOJA 8 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 8 · ARQUITECTURA WEB II: SESIONES, CLIENTES, ESCALAR</span>
          <p class="mini"><b>Cookie:</b> archivo de datos <b>creado por el servidor</b> pero <b>almacenado en el cliente</b>; <b>viaja al servidor que la creó en cada request</b>; sirve para <b>identificar y reconocer</b> al usuario. (HttpOnly, Secure, SameSite.)</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>STATELESS</th><th>STATEFUL</th></tr></thead>
            <tbody>
              <tr><td>Concepto</td><td>Componentes <b>aislados</b>: no se almacena ni se referencia info de operaciones anteriores. <b>Cada operación desde cero</b></td><td>“Recuerdan quiénes somos y qué hicimos”; la operación actual <b>puede verse afectada</b> por lo previo</td></tr>
              <tr><td>Sesión</td><td><b>No</b> se almacena en el servidor</td><td><b>Sí</b>, en el servidor (memoria/archivos)</td></tr>
              <tr><td>Identificación</td><td><b>En cada solicitud</b>, con un <b>token</b> que el servidor <b>decodifica</b></td><td><b>Una sola vez</b>; el servidor crea un espacio con un <b>id</b> y lo setea en la <b>cookie</b>; luego recupera la sesión por ese id</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>JWT</b> = header.payload.<b>firma</b> (claims: sub, roles, iat, <b>exp</b>). Viaja en <code>Authorization: Bearer</code>. <b>Ventajas vs. sesión:</b> ① <b>escalabilidad horizontal</b> real (servidor stateless → <b>sin sticky sessions</b> ni almacén compartido) ② sirve igual para <b>web, mobile y terceros</b> ③ <b>autocontenido</b>: sin viaje extra a la base ④ <b>desacopla la autenticación</b> (SSO/IDM, microservicios) ⑤ menos memoria en el servidor. <b>Desventajas:</b> <b>no se revoca fácil</b> (vale hasta expirar → expiración corta + <b>refresh token</b> + lista de revocación), viaja en cada request, el <b>payload es legible</b> (firmado, no cifrado: sin datos sensibles), permisos viejos hasta que expire.</p>
          <p class="mini"><b>Sesiones mixtas:</b> <b>cookies</b> del usuario al <b>servidor frontend</b> + <b>tokens</b> del frontend al <b>servidor de aplicación</b> (cliente liviano desacoplado).</p>
          <p class="mini"><b>Recursos:</b> entidad que puede ser <b>manipulada</b> (alta, modificación, baja, listado); se identifican <b>desde los casos de uso</b>. <b>Autónomos</b> (sentido de existencia propio) vs. <b>dependientes/anidados</b> (<code>/mascotas/{id}/historial</code>: no tiene sentido listarlos sin su contenedor → <b>composición</b>). <b>Protección:</b> ① <b>autenticación</b> (visual → login; REST → <b>401</b>) ② <b>roles</b> (<b>403</b>) ③ <b>roles + permisos</b> (distintos usuarios del mismo rol acceden a distintos recursos; distintos roles pueden tener el mismo permiso) + <b>ALCANCES: propio / propios / todos</b>.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>Cliente LIVIANO (SSR)</th><th>Cliente PESADO (CSR)</th></tr></thead>
            <tbody>
              <tr><td>Genera la vista</td><td><b>Servidor</b> · viaja <b>HTML</b></td><td><b>Cliente</b> · viaja <b>JSON</b></td></tr>
              <tr><td>Procesamiento y memoria</td><td>Mayor en servidor</td><td>Mayor en cliente</td></tr>
              <tr><td>Usabilidad / Escalabilidad / Mantenibilidad</td><td><b>− − −</b></td><td><b>+ + +</b></td></tr>
              <tr><td>Conviene</td><td><b>SEO</b>, equipos chicos/full-stack, dispositivos o conectividad limitados</td><td><b>Alta interactividad</b>, múltiples clientes sobre la misma API, equipos front/back separados</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Por qué el liviano puntúa “−”:</b> usabilidad (cada acción = nuevo request y recarga), escalabilidad (el servidor concentra negocio <b>+</b> armado de la vista), mantenibilidad (presentación y negocio entremezcladas). <b>Son relativas:</b> con <b>renderizado híbrido</b> se mitigan.</p>
          <p class="mini"><b>Variantes de pesado:</b> <b>Web (SPA)</b> (sin tienda, multiplataforma; ⚠️ acceso limitado al hardware salvo <b>PWA</b> con <b>Service Workers</b>) · <b>Mobile nativo</b> (SDK propio; <b>acceso total al hardware</b>, mejor performance; ⚠️ una base de código por SO) · <b>Mobile híbrido</b> (una base para todas: React Native, Flutter; ⚠️ APIs nativas vía <b>plugins</b>, algo menos de performance) · <b>Desktop</b> (Electron, Tauri). <b>SPA:</b> un único punto de entrada; las pantallas se intercambian <b>sin recargar</b>. <b>Toda SPA es cliente pesado, no al revés.</b> <b>SEO:</b> se indexa mejor HTML servido (los buscadores ejecutan JS pero <b>más lento y no garantizado</b>). <b>SSR</b> = primera respuesta del servidor + <b>hidratación</b>; <b>SSG</b> = HTML generado en <b>build</b> (ideal con caché y CDN).</p>
          <p class="mini"><b>Versionado de clientes instalables:</b> conviven <b>múltiples versiones</b> en producción → <b>versionar la API</b> (/v1,/v2), cambios <b>backward-compatible</b> (campos <b>opcionales</b>), <b>hard update</b>, actualizaciones automáticas.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Escalabilidad</th><th>VERTICAL</th><th>HORIZONTAL</th></tr></thead>
            <tbody>
              <tr><td>Qué hace</td><td>Más recursos a <b>la misma</b> máquina</td><td>Más <b>equipos</b> + distribuir la carga</td></tr>
              <tr><td>Límite</td><td><b>Físico</b></td><td>Sin límite físico</td></tr>
              <tr><td>Resuelve</td><td>Performance, <b>NO disponibilidad</b> (punto único de falla)</td><td><b>Performance Y disponibilidad</b> (requiere <b>balanceador</b> y servicios <b>stateless</b>)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Balanceador:</b> reparte solicitudes (performance), <b>redirige si un servidor falla</b> (disponibilidad), permite sumar/quitar nodos (escalabilidad). <b>Algoritmos:</b> Round Robin · Least Connections · Weighted · <b>Sticky Sessions</b> (no es algoritmo: <b>política</b> que fuerza el mismo servidor; <b>atenta contra escalabilidad y disponibilidad</b> → mejor <b>stateless + sesión externalizada</b>). <b>L4</b> = IP y puerto, no mira el contenido; <b>L7</b> = entiende HTTP, decide por <b>URL/headers/cookies</b>. <b>Health checks:</b> <b>activo</b> (GET /health periódico, saca de rotación) y <b>pasivo</b> (observa timeouts y 5xx reales).</p>
          <p class="mini"><b>Caché:</b> de <b>aplicación</b> (datos calculados → performance), de <b>contenido</b> (estáticos → uso de recursos), de <b>navegador</b> (→ tiempo de respuesta). Vive <b>privada</b> (navegador), <b>compartida</b> (proxy) o <b>compartida y administrada</b> (<b>CDN</b>), <b>siempre con expiración</b>. <b>Caché HTTP:</b> reutiliza la respuesta y <b>el origen no procesa la solicitud</b> (no parsea, no enruta, no consulta la base, no renderiza). <code>Cache-Control</code>, <code>ETag</code>→<b>304</b>, <code>Vary</code>. <b>CDN:</b> servidores distribuidos geográficamente; entrega HTML/JS/CSS/imágenes/video desde el nodo más cercano; <b>mitiga DDoS</b>; ✅ tiempos de carga, <b>costos de ancho de banda</b>, disponibilidad y redundancia, seguridad. <b>API Gateway:</b> <b>único punto de entrada</b>, enruta, centraliza <b>autenticación, rate limiting, logging</b>, puede ser LB L7 (sin él, cada cliente se acopla a la <b>topología interna</b>). <b>BFF:</b> un backend <b>por tipo de cliente</b>, que agrega y adapta sin tocar los contratos internos.</p>
          <p class="mini"><b>Cabeceras de caché (por si piden la especificación):</b> <code>Cache-Control: max-age=N</code> TTL para cualquier caché · <code>s-maxage=N</code> TTL <b>sólo para cachés compartidas</b> (CDN/proxy), pisa a max-age · <code>public</code> la puede guardar cualquier caché / <code>private</code> <b>sólo el navegador del usuario</b> · <code>no-cache</code> se guarda pero <b>hay que revalidar</b> antes de usarla · <code>no-store</code> <b>no se guarda en ninguna</b> (datos sensibles) · <code>ETag</code> + <code>If-None-Match</code> → <b>304 Not Modified</b> sin cuerpo · <code>Vary</code> guarda una versión por cabecera (ej. <code>Accept-Language</code>). <b>HIT</b> = estaba válido en caché; <b>MISS</b> = no estaba o expiró y se va al <b>origin server</b>. <b>Hit ratio = HITs / (HITs + MISSes)</b>.</p>
          <p class="mini"><b>Qué SÍ va a la CDN:</b> HTML estático, CSS, JS, imágenes, fuentes, video, bundles de la SPA, sitios SSG, vistas públicas no personalizadas. <b>Qué NO:</b> respuestas <b>JSON personalizadas por usuario</b> (carrito, perfil, saldo), <b>operaciones que modifican estado</b> (POST/PUT/DELETE) y contenido sensible sin <code>private</code>. <b>Invalidación:</b> ① <b>purge</b> explícito en la CDN; ② <b>cache busting</b> (nombre con hash, <code>app.3f9a1c.js</code>, + TTL larguísimo: al desplegar cambia el nombre y no hay que invalidar nada). <b>Compromiso del TTL:</b> largo = más HITs y menos carga pero riesgo de contenido viejo; corto = fresco pero más MISS. <b>Pull CDN</b> (trae del origen en el primer pedido, lo habitual) vs <b>Push CDN</b> (se sube de antemano); <b>origin shield</b> = capa intermedia que consolida los MISS de varios nodos antes de llegar al origen.</p>
          <p class="mini"><b>Algoritmos de balanceo (lista completa):</b> <b>Round Robin</b> (uno por uno; servidores iguales) · <b>Weighted Round Robin</b> (los más potentes reciben más) · <b>Least Connections</b> (menos conexiones activas; requests de duración variable) · <b>Least Response Time</b> (al más rápido; optimizar latencia) · <b>IP Hash</b> (hash de la IP → siempre el mismo servidor; afinidad) · <b>Sticky sessions</b> (política, no algoritmo). <b>⚠️ Si hay un solo balanceador, él mismo es el punto único de falla: hay que redundarlo.</b></p>
        </section>

        <!-- ===================== HOJA 9 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 9 · MONOLITO · SOA · MICROSERVICIOS · NUBE</span>
          <p class="mini"><b>Monolito:</b> todas las responsabilidades se <b>construyen, versionan y despliegan como una única unidad</b>; módulos en <b>memoria</b>, una sola base. <b>Lo que lo define no es el tamaño, es que TODO SE DESPLIEGA JUNTO.</b> Pregunta guía: ¿puedo desplegar un cambio en Facturación sin desplegar Ventas? <b>Separar el frontend NO lo convierte en distribuido:</b> la pregunta es cuántas <b>unidades de despliegue</b> tiene el <b>backend</b>. <b>Capas ≠ despliegue:</b> las capas mejoran mantenibilidad y testeabilidad pero <b>no cambian cómo se escala ni se despliega</b>.</p>
          <p class="mini"><b>✅ Monolito:</b> simplicidad (un repo, un build), <b>ACID local</b>, performance interna (<b>nanosegundos</b> vs milisegundos), testing/debugging, despliegue simple, menor costo operativo. <b>⚠️:</b> despliegue “todo o nada”, <b>escalado en bloque</b>, <b>falla propagada</b>, lock-in tecnológico, coordinación de equipos, builds lentos. <b>Mito:</b> “no escala” es <b>falso</b> — escala horizontalmente con N réplicas <b>si es stateless</b>; lo que <b>no</b> puede es escalar partes <b>independientemente</b>, y la <b>base compartida</b> suele ser el cuello de botella real. <b>Monolith First (Fowler):</b> casi todos los microservicios exitosos <b>empezaron como monolito</b>. <b>Big Ball of Mud</b> (cualquier clase llama a cualquier otra, todos leen todas las tablas) vs. <b>Monolito Modular</b> (módulos por capacidad de negocio, <b>interfaz pública explícita</b>, <b>cada módulo dueño de sus tablas</b>).</p>
          <p class="mini"><b>8 falacias de la computación distribuida:</b> ① la red es confiable (→ timeouts, reintentos, fallas parciales) ② la latencia es cero (→ evitar diálogos <b>chatty</b>) ③ el ancho de banda es infinito (→ paginar, comprimir, filtrar) ④ la red es segura (→ <b>TLS y autenticación también interna</b>) ⑤ la topología no cambia (→ <b>descubrimiento</b>) ⑥ hay un solo administrador ⑦ el transporte no tiene costo (CPU y <b>egress</b>) ⑧ la red es homogénea.</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Criterio</th><th>MONOLITO</th><th>SOA</th><th>MICROSERVICIOS</th></tr></thead>
            <tbody>
              <tr><td>Alcance</td><td>Una aplicación</td><td><b>La organización</b> (integrar y reutilizar)</td><td>Una <b>aplicación</b> (construir un producto)</td></tr>
              <tr><td>Granularidad</td><td>—</td><td>Servicios de negocio <b>grandes</b></td><td>Servicios <b>pequeños</b></td></tr>
              <tr><td>Comunicación</td><td>En memoria</td><td><b>ESB inteligente</b> (smart pipes)</td><td><b>Endpoints inteligentes, canales simples</b></td></tr>
              <tr><td>Datos</td><td>Una base</td><td>Frecuentemente <b>compartidas</b></td><td><b>Una base por servicio</b></td></tr>
              <tr><td>Gobierno</td><td>—</td><td><b>Centralizado</b> (estándares, registro)</td><td><b>Descentralizado</b></td></tr>
              <tr><td>Consistencia</td><td>ACID</td><td>Compensaciones</td><td><b>Saga</b> / eventual</td></tr>
              <tr><td>Contratos</td><td>—</td><td><b>SOAP/WSDL, WS-*</b> (UDDI)</td><td><b>REST, gRPC, eventos</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>SOA:</b> descompone <b>capacidades del negocio</b> en servicios <b>autónomos</b> con <b>contratos estandarizados</b>; resuelve la <b>integración punto a punto</b> (n·(n−1)/2: 6 sistemas → 15 integraciones → 6 contra contratos comunes). Servicio = unidad con <b>significado de negocio</b>, accedida <b>sólo por su contrato</b>, implementación <b>encapsulada</b>, <b>granularidad gruesa</b>. Actores: <b>consumidor / proveedor / registro</b> (publica–descubre–invoca). Principios (Erl): contrato estandarizado, bajo acoplamiento, abstracción, <b>reutilización</b>, autonomía, <b>sin estado</b>, descubrimiento, composición. <b>Tipos de servicio:</b> de <b>proceso/tarea</b> (orquestan, poco reutilizables), de <b>entidad</b> (agnósticos del proceso, <b>muy reutilizables</b>), <b>utilitarios</b> (transversales: notificaciones, auditoría). <b>ESB:</b> enrutamiento, transformación, mediación de protocolos, virtualización, orquestación, seguridad/monitoreo; ⚠️ <b>punto único de falla</b>, <b>smart pipes</b>, cuello de botella <b>organizacional</b>, licencias.</p>
          <p class="mini"><b>Microservicios:</b> servicios <b>pequeños y autónomos</b>, cada uno en su <b>proceso</b>, por <b>capacidad de negocio</b>, <b>despliegue independiente</b>, <b>gestión descentralizada</b>, <b>datos propios</b>, <b>APIs bien definidas</b>. Corte por <b>BOUNDED CONTEXT</b> (DDD): un único modelo para todo el dominio genera contradicciones; <b>el mismo concepto tiene modelos distintos en cada contexto</b>. <b>BD por servicio:</b> autoridad, encapsulamiento, IDs independientes, <b>referencias lógicas</b>, <b>sin integridad referencial entre servicios</b>, ACID sólo interno. Acceso a datos ajenos: <b>A)</b> referencia + API (<i>API Composition</i>; ⚠️ latencia y dependencia) <b>B)</b> réplica local / read model por eventos (⚠️ consistencia eventual) <b>C)</b> base compartida controlada (⚠️ acoplamiento al esquema). <b>Infra:</b> API Gateway (Facade), <b>Service Registry/Discovery</b> (Eureka, Consul), orquestador de contenedores, <b>Circuit Breaker</b>, <b>Correlation ID + Log Aggregator</b>. <b>⚠️ Desafíos:</b> complejidad, pruebas, gobernanza, <b>red y latencia</b>, integridad de datos, administración (DevOps), versionado, experiencia del equipo. <b>El dato:</b> 0,99³ ≈ <b>97%</b> — <b>cada salto entre servicios resta</b>. <b>Antipatrones:</b> <b>nanoservicios</b> (un servicio por tabla) y <b>teraservicios</b>. <b>Migración:</b> <b>Strangler</b> (gradual, por partes) y <b>Adaptador</b> (SOAP legado → REST).</p>
          <p class="mini"><b>SAGA:</b> sin transacción que abarque varios servicios → <b>secuencia de transacciones locales</b>; si una falla, <b>se compensan las anteriores en orden inverso</b> (por <b>coreografía</b> o por <b>orquestación</b>). <b>Outbox/Inbox:</b> resuelve la <b>doble escritura</b> — el evento se guarda <b>en la misma transacción</b> que el cambio y un <b>relay</b> lo publica (<b>at-least-once</b>); el receptor registra el id del mensaje en su transacción y <b>descarta duplicados</b> (idempotente). <b>Orquestación</b> (coordinador central: control, visibilidad y errores centralizados; ⚠️ acoplamiento y cuello de botella; típica de SOA/BPM) vs. <b>Coreografía</b> (reaccionan a eventos: desacople y escalabilidad; ⚠️ flujo <b>poco visible</b> y difícil de depurar; típica de microservicios). <b>Ley de Conway:</b> las organizaciones producen diseños que <b>copian sus estructuras de comunicación</b>.</p>
          <p class="mini"><b>NUBE — despliegue:</b> On-Premise · <b>Housing/Colocation</b> (servidores propios en datacenter de terceros) · Nube pública · privada · <b>híbrida</b> · <b>multicloud</b>. <b>Servicio:</b> <b>IaaS</b> (gestionás desde el SO: EC2) · <b>PaaS</b> (app y datos: App Service, Heroku) · <b>FaaS</b> (la función: Lambda) · <b>SaaS</b> (sólo tus datos: M365). <i>Pizza: casa / para hornear / delivery / restaurante.</i> <b>Responsabilidad compartida:</b> el proveedor protege la nube (datacenter, hardware, hipervisor), el cliente protege lo que construye <b>EN</b> la nube (datos, IAM, configuración, app, cifrado y —en IaaS— el SO). <b>Contratar nube no transfiere la responsabilidad sobre los datos</b>; la mayoría de los incidentes son <b>malas configuraciones del cliente</b>. <b>Región</b> = área con varias <b>AZ</b> (datacenters con energía, red y clima <b>independientes</b>): 2 AZ protegen de la caída de un datacenter; multi-región, de un desastre regional. <b>Tiers:</b> I 99,671% · II (N+1) 99,741% · <b>III mantenible concurrentemente 99,982%</b> · <b>IV tolerante a fallas 99,995%</b>. <b>✅ nube:</b> elasticidad, <b>pago por uso (OPEX)</b>, alcance global, servicios administrados, time-to-market, alta disponibilidad. <b>⚠️:</b> costos variables (<b>FinOps</b>), <b>egress</b>, <b>vendor lock-in</b>, ubicación de los datos, dependencia de conectividad, nuevas competencias. <b>✅ on-premise:</b> control total, <b>soberanía/regulación (Ley 25.326, BCRA)</b>, <b>latencia local</b> (SCADA), costo predecible con carga estable, <b>independencia de Internet</b>, legacy. <b>CAPEX vs OPEX:</b> carga variable → nube; carga alta, estable y predecible → on-premise puede ganar. <b>Comparar TCO</b> (personal, energía, clima, renovación, licencias).</p>
        </section>

        <!-- ===================== HOJA 10 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 10 · INTEGRACIÓN DE SISTEMAS</span>
          <p class="mini"><b>Integrar</b> = que dos sistemas se hablen: compartir datos y funcionalidades <b>sin copiar todo</b>. <b>Hay que acordar un CONTRATO</b>: qué se pide, en qué formato, qué se responde y cómo viaja. <b>Por qué:</b> no reescribir lo resuelto, <b>consultar no copiar</b>, necesidades del negocio y <b>marco legal</b> (ARCA). <b>Sincrónica</b> = llamada telefónica (A espera; ambos disponibles a la vez; si B no atiende, A falla). <b>Asincrónica</b> = WhatsApp (A deja el mensaje y sigue; B procesa cuando puede). <b>Pregunta clave: ¿quien llama NECESITA la respuesta para continuar? Si no → asincrónico.</b></p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>REST</th><th>SOAP</th><th>GraphQL</th><th>gRPC</th></tr></thead>
            <tbody>
              <tr><td>Idea</td><td>Recursos + verbos HTTP, <b>stateless</b></td><td><b>Envelope XML</b> (Header opc. + <b>Body oblig.</b> + Fault)</td><td><b>Un endpoint</b>; el cliente pide <b>exactamente</b> lo que necesita</td><td><b>RPC</b>: se ve como llamar una función local</td></tr>
              <tr><td>Contrato</td><td><b>OpenAPI</b></td><td><b>WSDL + XSD</b> (<code>?wsdl</code>)</td><td><b>Esquema tipado (SDL)</b></td><td><b>.proto</b> (Protobuf)</td></tr>
              <tr><td>Formato / transporte</td><td>JSON / HTTP</td><td>XML / HTTP, FTP, SMTP, colas</td><td>JSON / HTTP</td><td><b>Binario</b> / <b>HTTP/2</b></td></tr>
              <tr><td>Acopl. / Seguridad</td><td>Bajo / HTTPS, OAuth2-JWT</td><td><b>Alto</b> / <b>WS-Security</b></td><td>Medio / HTTPS</td><td>Medio / TLS</td></tr>
              <tr><td>Usar para</td><td><b>APIs públicas</b>, web y mobile</td><td><b>Empresarial</b> con contratos formales (banca, ARCA)</td><td><b>Flexibilidad del consumidor</b>, menos llamadas</td><td><b>Interno entre servicios</b>, alto rendimiento</td></tr>
            </tbody>
          </table></div>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Problema (sincrónico)</th><th>Patrón</th><th>Qué hace</th></tr></thead>
            <tbody>
              <tr><td>B no responde nunca</td><td><b>Timeout</b></td><td>Cuánto esperamos; <b>evita agotar hilos y conexiones</b></td></tr>
              <tr><td>Falla transitoria</td><td><b>Retry con backoff</b></td><td>Reintentos <b>limitados</b>, espaciados (+ jitter). <b>Sólo si es idempotente</b></td></tr>
              <tr><td>B sigue caída</td><td><b>Circuit breaker</b></td><td>Tras N fallos <b>abre</b>: deja de llamar y <b>falla rápido</b>; luego <b>semiabierto</b> prueba</td></tr>
              <tr><td>¿Doble cobro?</td><td><b>Idempotencia</b></td><td><b>Clave por operación</b>: repetirla da el mismo resultado una sola vez</td></tr>
              <tr><td>Igual hay que responder</td><td><b>Fallback</b></td><td>Degradar: “pendiente de pago”, datos en caché</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>COLAS:</b> <b>mensaje</b> · <b>productor</b> · <b>cola</b> (FIFO; <b>un solo consumidor</b> por mensaje) · <b>consumidor</b> · <b>broker</b> (aloja y administra las colas). <b>Casos borde:</b> ① <b>B caída</b> → la cola acepta igual, los mensajes se acumulan, B drena al volver: <b>nada se pierde</b>, es <b>consistencia eventual</b> ② <b>B lenta / pico</b> → la cola <b>amortigua</b> (backlog); se escalan consumidores (<i>competing consumers</i>); ⚠️ <b>con varios consumidores el orden ya no es estricto</b> ③ <b>B cae antes del ACK</b> → el mensaje <b>se borra al recibir el ACK, no al entregarlo</b>: se <b>reentrega</b> (visibility timeout) y <b>puede llegar dos veces</b> → <b>consumidor IDEMPOTENTE</b> ④ <b>mensaje venenoso</b> (CUIT inválido) → reintentos limitados y <b>DLQ</b>: aparta el mensaje sin perderlo, no frena a los demás, se alerta y se reprocesa o descarta (llega por máximo de reintentos, formato inválido, <b>TTL</b> vencido o rechazo). <b>Garantías:</b> <b>at-most-once</b> (puede perderse) · <b>at-least-once</b> (<b>el habitual</b>: no se pierde, puede duplicarse → <b>idempotencia</b>) · <b>exactly-once</b> (ideal, difícil y costoso → en la práctica at-least-once + <b>deduplicación</b>). <b>ORDEN → cola · EVENTO → topic.</b> <b>Monitorear:</b> tamaño de la cola, <b>antigüedad del mensaje más viejo</b>, mensajes en DLQ.</p>
          <p class="mini"><b>BD COMPARTIDA:</b> no se llaman, <b>se comunican por los datos</b>; el <b>contrato es el esquema</b>. ✅ simple, consistencia fuerte, <b>JOINs</b> para reportes cruzados. ⚠️ <b>acoplamiento fuerte al esquema</b>, <b>punto único de falla y contención</b> (si cae, <b>caen los dos</b>; un reporte pesado de B <b>bloquea</b> a A), <b>cada cambio de tabla rompe al otro</b> (renombrar una columna rompe a B <b>sin que B haya cambiado nada</b>), B se entera por <b>polling</b>. <b>“Menor esfuerzo inicial, mayor costo de evolución.”</b> Aceptable sólo con mismo equipo y despliegue, legado sin otra interfaz, o consistencia fuerte con carga baja.</p>
          <p class="mini"><b>KAFKA:</b> <b>el evento NO se borra al leerlo</b>; cada consumidor <b>recuerda su offset</b>. <b>Tópico</b> (categoría) · <b>partición</b> (tramo ordenado, reparte carga) · <b>offset</b> (posición) · <b>clave</b>: <code>partición = hash(clave) % N</code> → <b>misma clave, misma partición</b>; <b>orden garantizado DENTRO de la partición, NO global</b> → clave = la entidad que necesita orden. <b>Grupo de consumidores:</b> dentro del grupo cada partición la lee <b>una sola instancia</b> (reparte); <b>cada grupo recibe todo</b> (duplica); más instancias que particiones no sirve. <b>Retención</b> (ej. 7 días) → <b>replay</b>: un consumidor caído retoma desde su offset y un servicio nuevo <b>lee todo el historial</b>. <b>Broker/replicación:</b> líder + seguidoras (factor 3); si un broker cae, una seguidora <b>pasa a líder</b> (KRaft). <b>acks:</b> 0 (puede perder, latencia mínima) · 1 (líder) · <b>all</b> (líder + réplicas, el más seguro).</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>API</th><th>COLA</th><th>BD COMPARTIDA</th><th>KAFKA</th></tr></thead>
            <tbody>
              <tr><td>Comunicación</td><td>Sincrónica</td><td>Asincrónica</td><td>Indirecta por datos</td><td>Asincrónica por eventos</td></tr>
              <tr><td>Acoplamiento</td><td>Medio (contrato)</td><td><b>Bajo</b></td><td><b>Muy alto</b> (esquema)</td><td><b>Bajo</b></td></tr>
              <tr><td>Si B cae</td><td>A falla o resiste</td><td>Se acumulan mensajes</td><td><b>Caen ambos</b></td><td>Retoma del offset</td></tr>
              <tr><td>Si B es lento</td><td>A espera o corta</td><td>Se absorbe</td><td><b>Contención</b> de bloqueos</td><td>Atrasa su lectura</td></tr>
              <tr><td>Respuesta inmediata</td><td><b>Sí</b></td><td>No</td><td>Sí (consulta)</td><td>No</td></tr>
              <tr><td>Complejidad</td><td>Media</td><td>Media (idempotencia, DLQ)</td><td>Baja al inicio</td><td><b>Alta</b> (clúster)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cómo elegir:</b> ¿necesito la respuesta <b>ya</b>? → <b>API</b> (+ timeout, retry, circuit breaker). ¿Puede esperar y <b>no debe perderse</b>? → <b>cola</b>. ¿<b>Muchos lectores</b> o <b>historial/replay</b>? → <b>Kafka</b>. ¿Mismo equipo y legado? → recién ahí BD compartida. <b>Una solución suele COMBINAR:</b> API para cobrar, cola para facturar. <b>IoT/sensores:</b> <b>MQTT</b> (liviano, pub/sub, QoS, tolera conectividad intermitente) + broker + <b>Edge Gateway</b> que bufferea y reintenta → ingesta → <b>TSDB</b>.</p>
          <p class="mini"><b>Resiliencia — lo que falta nombrar:</b> <b>Bulkhead (mamparo):</b> <b>aislar pools de recursos por dependencia</b>, para que una dependencia lenta <b>no consuma todos los hilos</b> del servicio (evita el <i>thread starvation</i>). Es el complemento del timeout. · <b>Circuit breaker en detalle:</b> <b>CLOSED</b> (tráfico normal, se mide la tasa de fallas) → supera el <b>umbral</b> (ej. 50%) → <b>OPEN</b> (intercepta sin tocar al destino y responde el <b>fallback</b> durante la <b>sleep window</b>) → <b>HALF-OPEN</b> (deja pasar unas pocas llamadas de prueba, <b>probes</b>) → vuelve a CLOSED si tienen éxito, a OPEN si fallan. <b>Beneficios:</b> evita la falla en cascada, <b>libera hilos</b>, le da tiempo de recuperación al servicio dañado y permite <b>degradar con gracia</b>.</p>
          <p class="mini"><b>Otros patrones que pueden pedir:</b> <b>CQRS</b> (separar el modelo de <b>escritura</b> del de <b>lectura</b>; junto con <b>API Composition</b> es la forma de resolver consultas que cruzan servicios <b>sin joins entre bases</b>) · <b>CDC — Change Data Capture</b> (un motor como <b>Debezium</b> lee el <b>log de transacciones</b> de la base y publica los cambios como eventos: es la alternativa al <i>relay</i> por polling del <b>Outbox</b>, y el mecanismo típico para sincronizar datos entre sistemas) · <b>2PC (commit de dos fases)</b>: coordina una transacción entre varios sistemas con un coordinador que primero pregunta “¿pueden?” y después ordena commit; <b>es lento, bloqueante y poco disponible</b> — <b>por eso en microservicios se usa SAGA</b> con compensaciones y consistencia eventual. <b>Consumer lag</b> (Kafka): atraso del consumidor respecto del último mensaje; es <b>la métrica de saturación</b> que hay que monitorear.</p>
        </section>

        <!-- ===================== HOJA 11 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 11 · OBSERVABILIDAD · INFRA · DESPLIEGUE · COMPONENTES</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th></th><th>MONITOREO</th><th>OBSERVABILIDAD</th></tr></thead>
            <tbody>
              <tr><td>Responde</td><td><b>¿Qué pasa y cuándo?</b></td><td><b>¿Por qué pasa y cómo se origina?</b></td></tr>
              <tr><td>Problemas</td><td><b>Conocidos</b> (anticipados)</td><td>Conocidos <b>y nuevos, no anticipados</b></td></tr>
              <tr><td>Enfoque</td><td>Métricas definidas <b>de antemano</b> vs. <b>umbrales</b></td><td><b>Explorar</b> los datos, preguntas libres</td></tr>
              <tr><td>Datos</td><td>Principalmente <b>métricas</b></td><td><b>Logs + métricas + trazas correlacionados</b></td></tr>
              <tr><td>Resultado</td><td><b>Síntomas y alertas</b></td><td><b>Causa raíz</b></td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>“El monitoreo busca ALERTAR; la observabilidad busca ENTENDER” — y el monitoreo es una PARTE de ser observable.</b> <b>Trazabilidad</b> = seguir <b>una operación de punta a punta</b> (trace_id): responde <b>¿DÓNDE pasó y cuánto tardó cada parte?</b>; es <b>uno de los 3 pilares</b>. <b>Observabilidad</b> (Kálmán, teoría de control): inferir los <b>estados internos</b> a partir de las <b>salidas externas</b> (telemetría). <i>Monitoreo = tablero del auto; observabilidad = scanner del mecánico.</i> <b>3 niveles:</b> lo conocido (dashboards/health checks) · sabemos que puede fallar (alertas con umbrales) · <b>lo que nunca imaginamos</b> (sólo observabilidad).</p>
          <p class="mini"><b>LOS 3 PILARES:</b> <b>MÉTRICAS</b> = ¿qué y cuánto? (signos vitales; agregadas; costo bajo; <b>alertas y tendencias</b>) · <b>LOGS</b> = ¿por qué y qué exactamente? (diario detallado; muy verbosos; <b>diagnóstico profundo</b>) · <b>TRAZAS</b> = ¿dónde? (seguimiento de un envío; árbol de spans; se <b>muestrean</b>; <b>latencia entre servicios</b>). <b>Las métricas AVISAN, las trazas UBICAN, los logs EXPLICAN.</b> (4ª pata: <b>perfiles</b>/flame graph: en qué <b>función</b> se gasta el recurso.)</p>
          <p class="mini"><b>Logs — niveles:</b> TRACE · DEBUG · <b>INFO</b> (hitos normales) · <b>WARN</b> (algo raro, sigue funcionando) · <b>ERROR</b> (falló una operación) · <b>FATAL</b> (el proceso no puede continuar). En producción <b>INFO o superior</b>; DEBUG se activa <b>temporalmente sin redeploy</b>. <b>Estructurados (JSON)</b>: filtrar por campo, agrupar y contar, <b>unir con trazas por trace_id</b>, sin regex frágiles. <b>Evitar:</b> datos sensibles (<b>Ley 25.326</b>), payloads enteros, logs en ciclos calientes, mensajes sin contexto, usarlos como <b>única fuente de métricas</b>. <b>Pipeline:</b> app → agente (Fluent Bit/OTel) → almacenamiento (Elastic/Loki) → visualizador (Kibana/Grafana), con <b>retención y rotación</b>.</p>
          <p class="mini"><b>Métricas:</b> <b>nombre + etiquetas + valor + timestamp</b>. Tipos: <b>Counter</b> (sólo crece → se grafica su <b>rate</b>) · <b>UpDownCounter</b> · <b>Gauge</b> (instantáneo) · <b>Histogram</b> (distribución en buckets). <b>El promedio miente:</b> usar <b>percentiles p95/p99</b> (la peor experiencia real). <b>Cardinalidad</b> = cada combinación de etiquetas es una serie: <b>nunca user_id/pedido_id/trace_id como etiqueta</b> (van en logs/trazas); es lo que <b>más encarece</b> la TSDB. <b>GOLDEN SIGNALS (SRE Google):</b> <b>LATENCIA</b> (p95/p99, por endpoint y por dependencia; éxitos y fallas separados) · <b>TRÁFICO</b> (RPS, pedidos/min; “sin errores y sin tráfico = <b>silencio sospechoso</b>”) · <b>ERRORES</b> (explícitos 5xx, <b>implícitos</b> 200 OK incorrecto o que incumple el SLO, de negocio) · <b>SATURACIÓN</b> (CPU, memoria, <b>pool de BD</b>, profundidad de cola — <b>la señal ADELANTADA</b>). Equivalentes: <b>RED</b> (Rate, Errors, Duration) para servicios y <b>USE</b> (Utilization, Saturation, Errors) para recursos.</p>
          <p class="mini"><b>Trazas:</b> <b>trace</b> (recorrido completo) · <b>span</b> (unidad de trabajo con inicio/fin; <b>parent_span_id</b> arma el árbol) · <b>attributes</b> (clave-valor de contexto) · <b>events</b> (marca puntual) · kind SERVER/CLIENT, status OK/ERROR. El <b>trace_id nace en el gateway</b> y <b>se propaga en cada llamada</b>. <b>Cascada:</b> ancho = duración, sangría = padre-hijo, huecos = espera. <b>Muestreo:</b> <b>head-based</b> (al inicio, simple y barato; ⚠️ descarta justo los errores) vs. <b>tail-based</b> (al final, <b>conserva errores y lentas</b>; ⚠️ buffer y recursos). <b>Regla: muestrear mucho lo normal y conservar SIEMPRE errores y latencia alta.</b></p>
          <p class="mini"><b>Alertas:</b> umbral estático · tendencia/anomalía · <b>basada en SLO</b> · <b>ausencia de datos</b> · compuesta. <b>Alertar por SÍNTOMAS, no por causas</b> (“% de pedidos fallidos &gt; 1%”, no “CPU &gt; 80%”). Accionable, urgente, con <b>dueño y runbook</b>, con <b>severidad</b>. <b>Alert fatigue:</b> si todo alerta, nada se atiende. Parámetros: <b>umbral</b>, <b>duración (for)</b>, agregación, recuperación (evita <b>flapping</b>). <b>SLI</b> (medición real) · <b>SLO</b> (meta interna) · <b>SLA</b> (contrato <b>con penalidades</b>). <b>Error budget</b> = 100% − SLO (99,5% → <b>216 min/mes</b>): con presupuesto se puede arriesgar; al <b>80%</b> se frenan cambios riesgosos; al <b>100%</b> se <b>congelan los lanzamientos</b>. <b>Disponibilidad compuesta:</b> 99,9% × 99,9% ≈ <b>99,8%</b> — <b>cada dependencia resta</b>. 99,9% = 8,76 h/año · 99,99% = 52,6 min/año.</p>
          <p class="mini"><b>Infra:</b> bare metal → <b>VM</b> (SO completo, GBs, minutos, aislamiento fuerte) → <b>contenedor</b> (<b>comparte el kernel</b>, MBs, segundos, portabilidad: “fin del <i>en mi máquina funciona</i>”) → <b>Kubernetes</b> (<b>estado deseado</b>, scheduling, <b>self-healing</b>, autoescalado, rolling updates, descubrimiento) → <b>serverless</b>. <b>Ambientes:</b> Dev (ficticios) · QA (de prueba) · <b>Staging/UAT</b> (<b>réplica fiel</b>, datos <b>anonimizados</b>) · Producción. <b>Paridad entre ambientes</b> = menos sorpresas; <b>nunca copiar datos reales sin anonimizar</b> (Ley 25.326). <b>Mutable (“mascotas”)</b> → configuration drift, servidores “copo de nieve” vs. <b>INMUTABLE (“ganado”)</b> → se <b>reemplaza</b>, no se parchea; <b>rollback = redeploy de la imagen anterior</b>; <b>IaC</b> (Terraform) versionada y auditable. <b>CI/CD:</b> el <b>artefacto se construye una sola vez</b> y recorre todos los ambientes; <b>Delivery</b> (con aprobación) vs. <b>Deployment</b> (sin intervención) = <b>decisión de negocio</b>. <b>RPO</b> (cuántos datos tolero perder: 24 h → backup diario; ≈0 → <b>replicación sincrónica</b>) · <b>RTO</b> (cuánto sin servicio). <b>DR:</b> Backup&amp;Restore (horas/días) · <b>Pilot Light</b> (min/decenas de min) · <b>Warm Standby</b> (seg-min/min) · <b>Activo-Activo</b> (≈0/≈0).</p>
          <p class="mini"><b>Despliegue — DEPLOY ≠ RELEASE</b> (técnico vs. <b>negocio</b>; dimensiones: downtime, <b>radio de impacto</b>, costo de infra, velocidad de rollback). <b>Recreate</b>: se detiene todo y se levanta la nueva (<b>downtime garantizado</b>; útil si dos versiones <b>no pueden convivir</b>). <b>Rolling update</b>: progresivo, sin downtime ni infra extra, <b>conviven v1 y v2</b> (API y base <b>compatibles con ambas</b>); rollback lento; <b>default de Kubernetes</b>. <b>Blue/Green</b>: dos ambientes idénticos, switch y <b>rollback inmediatos</b>; ⚠️ <b>duplica la infra</b>, base compartida y sesiones en curso. <b>Canary</b>: 1→5→25→50→100% <b>según métricas</b>; <b>limita el radio de impacto</b>; requiere <b>observabilidad y LB L7</b>. <b>Canary</b> (técnico: ¿es estable?) vs. <b>A/B testing</b> (negocio: ¿qué variante convierte más?) vs. <b>Shadow</b> (copia del tráfico real, <b>respuesta descartada</b>; ⚠️ no cobrar/mailear dos veces). <b>Feature flags:</b> separan deploy de release, activación gradual, <b>kill switch</b>; ⚠️ deuda técnica si no se eliminan.</p>
          <div class="callout key">
            <div class="callout-title">⭐ EXPAND AND CONTRACT — cambiar el esquema sin downtime</div>
            <p class="mini">Es la respuesta a “<b>durante un rolling update conviven v1 y v2, así que la base tiene que ser compatible con ambas</b>”. Tres fases:</p>
            <p class="mini"><b>① EXPAND:</b> se <b>agrega</b> la columna/tabla nueva <b>manteniendo activa la anterior</b> → compatibilidad hacia atrás, la v1 sigue funcionando. <b>② MIGRATE / DUAL WRITE:</b> se despliega la versión nueva, que <b>escribe en ambas</b> estructuras, y se migran los datos históricos <b>en segundo plano</b>. <b>③ CONTRACT:</b> cuando se verifica que <b>ningún servicio consulta la estructura vieja</b>, se elimina.</p>
            <p class="mini"><b>Regla general:</b> los cambios de esquema y de contrato de API deben ser <b>aditivos</b> (agregar campos opcionales), nunca renombrar o borrar de una. <b>Rollback vs roll-forward:</b> <b>rollback</b> = volver a la versión anterior (rápido, pero <b>falla si hubo cambios de datos incompatibles</b> — justamente por eso Expand &amp; Contract); <b>roll-forward</b> = arreglar y desplegar una versión nueva, que se elige cuando volver atrás no es posible o es más riesgoso.</p>
          </div>
          <p class="mini"><b>MELT:</b> la cátedra enseña <b>3 pilares</b> (logs, métricas, trazas) <b>+ profiling</b> como cuarta pata. En la industria se usa el acrónimo <b>MELT = Metrics, Events, Logs, Traces</b>; todos se vinculan por el <b>Correlation ID / Trace ID</b>. Si lo nombrás, aclaralo así.</p>
          <p class="mini"><b>Componentes:</b> <b>DNS</b> (nombre→IP, cacheado por <b>TTL</b>; failover, geo-routing, ponderado; TTL alto = mejor performance pero <b>conmutación más lenta</b>) · <b>Proxy directo</b> (en nombre de los <b>clientes</b>; filtrado corporativo) vs. <b>Proxy reverso</b> (en nombre de los <b>servidores</b>; terminación TLS, caché, oculta la topología; <b>base del LB, el API Gateway y el WAF</b>) · <b>IAM/IDM</b> (identidades, roles y permisos centralizados: <b>altas y bajas en un lugar</b>) · <b>SSO</b> (autenticarse <b>una vez</b> para varias apps; OAuth2/OIDC/SAML; <b>el IdP es crítico</b>) · <b>MFA</b> · <b>WAF</b> (bloquea <b>OWASP Top 10</b>, rate limiting, <b>parches virtuales</b>) · <b>Secretos</b> (<b>nunca en el repo</b>: queda en el historial; bóveda con acceso, auditoría y <b>rotación</b>; inyectados por variables de entorno).</p>
        </section>

        <!-- ===================== HOJA 12 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 12 · SÍNTOMA → RESPUESTA + FRASES + CHECKLIST</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Si el enunciado dice…</th><th>Respondé</th><th>Atributos</th></tr></thead>
            <tbody>
              <tr><td>“puede tardar”, “proceso pesado”, “no hace falta la respuesta ya”</td><td><b>Cola/broker</b> + responder <b>202</b>; consumidores escalables e <b>idempotentes</b>, reintentos y <b>DLQ</b></td><td>Escalabilidad, Disponibilidad, Performance</td></tr>
              <tr><td>“picos de tráfico”, “x10 en 3 días”, “miles al mismo horario”</td><td><b>Escalado horizontal</b> + LB + autoescalado + <b>cola que amortigua</b></td><td>Escalabilidad, Disponibilidad</td></tr>
              <tr><td>“varios servicios deben enterarse”</td><td><b>Topic</b> (pub/sub); el productor no conoce a los consumidores</td><td>Mantenibilidad, Escalabilidad</td></tr>
              <tr><td>“hay que hacerlo una sola vez” (una orden)</td><td><b>Cola</b> punto a punto</td><td>Confiabilidad</td></tr>
              <tr><td>“servicio externo con caídas y lentitud”</td><td><b>Timeout + retry con backoff + circuit breaker + fallback</b> (+ caché del último valor) y <b>Adapter</b> en el dominio</td><td>Disponibilidad, Tolerancia a fallos</td></tr>
              <tr><td>“tarea diaria/mensual/periódica”</td><td><b>Cron / scheduler</b> (cuidar <b>ejecución única</b> con varias instancias) + cola para el fan-out</td><td>Confiabilidad</td></tr>
              <tr><td>“tarda horas y algunos días no termina; no quiero hardware más caro”</td><td><b>Paralelizar con cola + N workers</b> (escalado horizontal del procesamiento), particionando el trabajo</td><td>Performance, Escalabilidad, Costo</td></tr>
              <tr><td>“imágenes/videos lentos y mucho ancho de banda”</td><td><b>Object storage + CDN</b>; el backend sólo entrega la <b>URL</b> (nunca binarios en la base)</td><td>Performance, Escalabilidad, Costo</td></tr>
              <tr><td>“se consulta mucho lo mismo, accesos concurrentes a la base”</td><td><b>Caché</b> (Redis/HTTP con TTL) + <b>réplicas de lectura</b>; si es analítica, <b>read model/columnar</b></td><td>Performance, Disponibilidad</td></tr>
              <tr><td>“terceros quieren flexibilidad y menos llamadas”</td><td><b>GraphQL</b> (+ límites de complejidad, paginación, rate limiting, caché)</td><td>Mantenibilidad, Performance</td></tr>
              <tr><td>“web + mobile + terceros”</td><td><b>API REST versionada</b> + <b>API Gateway</b> (o <b>BFF</b> por cliente) + <b>JWT</b></td><td>Mantenibilidad, Escalabilidad</td></tr>
              <tr><td>“cientos de sensores enviando lecturas”</td><td><b>MQTT</b> + broker (+ <b>Edge Gateway</b>) → ingesta → <b>TSDB</b>; consumidores idempotentes</td><td>Escalabilidad, Disponibilidad</td></tr>
              <tr><td>“login de usuarios que entran sólo para eso”</td><td><b>IDM/IdP externo con SSO</b> (OIDC: Google/Microsoft) → JWT; no custodiar credenciales propias</td><td>Seguridad, Usabilidad, Mantenibilidad</td></tr>
              <tr><td>“datos sensibles / confidencialidad”</td><td><b>TLS</b> en tránsito (también interno), <b>cifrado en reposo</b> y por columna, claves en bóveda, <b>hash+salt</b> de passwords, RBAC con <b>alcance</b>, minimización, <b>anonimizar</b> en testing, auditoría</td><td>Seguridad</td></tr>
              <tr><td>“integridad de los datos/documentos”</td><td><b>Hash/checksum</b>, <b>firma digital o HMAC</b>, constraints e integridad referencial, transacciones, <b>log append-only</b></td><td>Seguridad</td></tr>
              <tr><td>“burbuja/notificación en tiempo real si está conectado”</td><td><b>WebSocket</b> (o SSE) desde el servicio de notificaciones, alimentado por el <b>evento</b> del broker; fallback a <b>polling</b></td><td>Usabilidad, Performance</td></tr>
              <tr><td>“dashboard en tiempo real con datos de GPS”</td><td>Dispositivo → <b>MQTT/broker</b> → ingesta → <b>TSDB</b> + <b>WebSocket</b> al tablero (pub/sub de punta a punta)</td><td>Performance, Escalabilidad</td></tr>
              <tr><td>“un paso del flujo distribuido falla”</td><td><b>SAGA</b> con compensaciones (+ <b>Outbox/Inbox</b> para no perder eventos); <b>degradar antes que romper</b></td><td>Consistencia, Disponibilidad</td></tr>
              <tr><td>“¿por qué tardó?” / “no sabemos qué pasó”</td><td><b>Correlation ID</b> + log aggregator + <b>trazas</b> + <b>Golden Signals</b> y alertas por síntoma</td><td>Observabilidad, Mantenibilidad</td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">FRASES PARA JUSTIFICAR (adaptá los corchetes)</div>
            <p class="mini"><b>Asincronismo:</b> “Uso una cola porque <b>quien llama no necesita la respuesta para continuar</b>: desacopla en el tiempo (si [B] está caído los mensajes esperan), <b>amortigua los picos</b> y permite escalar consumidores. Costo: <b>consistencia eventual</b> y consumidores <b>idempotentes</b> porque la entrega es <b>at-least-once</b>; los mensajes irreprocesables van a una <b>DLQ</b>.”</p>
            <p class="mini"><b>Escalado:</b> “Escalado <b>horizontal</b> detrás de un balanceador: mejora <b>performance</b> y <b>disponibilidad</b> (elimina el punto único de falla), a diferencia del vertical que sólo mejora performance y <b>tiene techo físico</b>. Requiere servicios <b>stateless</b> con la sesión externalizada, para no depender de <b>sticky sessions</b>.”</p>
            <p class="mini"><b>Desnormalización:</b> “Es desnormalización por <b>consistencia</b>: el dato debe quedar <b>congelado al momento del hecho</b> porque el comprobante es inmutable; no es redundancia, es un dato propio de la operación.” / “Por <b>performance</b>, justificada por [N lecturas/min] contra escrituras infrecuentes, <b>conservando la FK</b>, con [tabla] como <b>fuente de verdad</b>, propagación encapsulada y <b>proceso de recálculo</b>.”</p>
            <p class="mini"><b>Herencia:</b> “<b>SINGLE_TABLE</b> con discriminador porque los subtipos agregan pocos atributos y las consultas son polimórficas; asumo columnas nulables. Con muchos atributos obligatorios propios iría <b>JOINED</b>.”</p>
            <p class="mini"><b>NoSQL:</b> “Propongo [tipo] porque el patrón de acceso es [escritura masiva por clave / consulta por rango de tiempo / agregaciones sobre históricos / documentos variables / relaciones], que es exactamente para lo que está optimizada; el resto del dominio transaccional sigue en relacional (<b>persistencia políglota</b>).”</p>
            <p class="mini"><b>Microservicios:</b> “Corto por <b>bounded context</b>, cada servicio con <b>su propia base</b> y comunicación por API/eventos. Costo: <b>no hay integridad referencial entre servicios</b> (IDs lógicos validados por la aplicación), <b>consistencia eventual</b> y <b>Saga</b> con compensaciones para los flujos que cruzan servicios; además cada salto <b>resta disponibilidad</b> (0,99³≈97%).”</p>
            <p class="mini"><b>Cierre (el que distingue):</b> “El costo que asumo es [consistencia eventual / complejidad operativa / ventana de inconsistencia], y lo mitigo con [idempotencia / DLQ y monitoreo del backlog / proceso de recálculo / circuit breaker y degradación].”</p>
          </div>
          <p class="mini"><b>CHECKLIST FINAL:</b> ☐ Repartí el tiempo <b>por puntaje</b> y <b>ninguna sección quedó en blanco</b> (se exige ≥50% en cada una) ☐ Escribí <b>supuestos</b> ☐ Todo decidido está <b>justificado por escrito</b> ☐ Nombré <b>y definí</b> los atributos de calidad ☐ Los diagramas tienen <b>título, leyenda y todas las flechas rotuladas con su protocolo</b> (HTTPS, AMQP, MQTT, JDBC) y lo <b>externo</b> marcado ☐ En el modelo de datos: <b>PK, FK, cardinalidad, modalidad, restricciones</b> ☐ N:M con <b>tabla intermedia</b> ☐ Ningún atributo <b>multivaluado</b> ☐ Herencia <b>elegida y justificada</b> ☐ Los <b>3 párrafos</b> (persistir / impedance / desnormalizar) ☐ Releí el enunciado buscando requerimientos que no aparezcan en mi solución.</p>
        </section>

        <!-- ===================== HOJA 13 ===================== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 13 · GLOSARIO EXPRESS · FÓRMULAS · NÚMEROS</span>
          <div class="grid-2">
            <div class="card">
              <p class="mini"><b>ACID</b> — Atomicidad, Consistencia, Aislamiento, Durabilidad: garantías de una transacción <b>local</b>.<br>
              <b>ADR</b> — Architecture Decision Record: registro de una decisión arquitectónica <b>y su porqué</b>.<br>
              <b>API Composition</b> — resolver una consulta pidiendo a cada servicio dueño y uniendo en memoria (no hay join entre bases).<br>
              <b>at-least-once</b> — no se pierde, puede duplicarse ⇒ <b>consumidor idempotente</b>.<br>
              <b>Bounded Context</b> — límite de un modelo de dominio coherente (DDD); guía para cortar microservicios.<br>
              <b>Bulkhead</b> — pools de recursos aislados por dependencia; evita que una lenta consuma todos los hilos.<br>
              <b>CAPEX / OPEX</b> — inversión inicial amortizable / gasto recurrente por uso.<br>
              <b>CDC</b> — Change Data Capture: lee el log de transacciones de la base y publica los cambios (Debezium).<br>
              <b>Consumer lag</b> — atraso del consumidor Kafka respecto del último mensaje: métrica de saturación.<br>
              <b>Correlation ID / Trace ID</b> — identificador que une logs, métricas y trazas de una misma solicitud.<br>
              <b>CQRS</b> — separar el modelo de escritura del de lectura.<br>
              <b>CSR / SSR / SSG</b> — renderizado en cliente / en servidor por request / en build.<br>
              <b>Dirty read</b> — leer datos de una transacción no confirmada que puede hacer rollback.<br>
              <b>DLQ</b> — cola de mensajes que no se pudieron procesar.<br>
              <b>DIP</b> — el dominio define las interfaces; la infraestructura las implementa.<br>
              <b>Error budget</b> — 100% − SLO: margen de falla permitido.<br>
              <b>Expand &amp; Contract</b> — evolución de esquema en 3 fases sin downtime.<br>
              <b>Golden Signals</b> — latencia, tráfico, errores, saturación.<br>
              <b>Grado / Cardinalidad</b> — nº de atributos / nº de tuplas (en teoría relacional).<br>
              <b>HIT / MISS</b> — el recurso estaba válido en caché / hubo que ir al origen.<br>
              <b>Hidratación</b> — instanciar la clase y popular sus atributos no-lazy desde la base.</p>
            </div>
            <div class="card">
              <p class="mini"><b>Idempotencia</b> — repetir la operación no cambia el resultado (clave de idempotencia).<br>
              <b>Impedance mismatch</b> — desajuste objeto↔relacional: identidad, tipos, cardinalidad, herencia.<br>
              <b>MELT</b> — Metrics, Events, Logs, Traces (la cátedra: 3 pilares + profiling).<br>
              <b>Modalidad</b> — cantidad <b>mínima</b> de la relación (0 opcional / 1 obligatoria).<br>
              <b>Monolith First</b> — empezar monolito y dividir cuando se entienda el dominio (Fowler).<br>
              <b>N+1 queries</b> — 1 consulta + N por el lazy dentro de un ciclo; se cura con <code>JOIN FETCH</code>.<br>
              <b>Nano / Teraservicio</b> — demasiado chico (la red y la operación superan el beneficio) / casi un monolito.<br>
              <b>OpenAPI</b> — contrato de una API REST (Swagger). <b>WSDL</b> — el de SOAP.<br>
              <b>Origin server</b> — servidor al que recurre la CDN ante un MISS.<br>
              <b>Outbox</b> — el evento se guarda en la misma transacción que la entidad; un relay lo publica.<br>
              <b>Políglota</b> — distintos tipos de base en un mismo ecosistema, uno por necesidad.<br>
              <b>Puerto / Adaptador</b> — interfaz que define el dominio / implementación concreta (hexagonal).<br>
              <b>RPO / RTO</b> — datos que tolero perder / tiempo que tolero sin servicio.<br>
              <b>Saga</b> — transacciones locales + <b>compensaciones</b> en orden inverso.<br>
              <b>SLI / SLO / SLA</b> — medición / objetivo interno / contrato con penalidad.<br>
              <b>Span</b> — bloque de trabajo con inicio, fin y metadatos dentro de una traza.<br>
              <b>Stateless</b> — sin estado de sesión en el servidor; habilita el escalado horizontal.<br>
              <b>Sticky session</b> — el LB manda siempre al mismo usuario al mismo nodo (limita la flexibilidad).<br>
              <b>Strangler Fig</b> — reemplazar el monolito de a poco, ruta por ruta.<br>
              <b>TTL</b> — tiempo de validez de un recurso en caché.<br>
              <b>2PC</b> — commit de dos fases: coordina entre sistemas, pero es lento y poco disponible ⇒ Saga.<br>
              <b>WAF</b> — firewall de aplicación: bloquea el OWASP Top 10.</p>
            </div>
          </div>
          <div class="callout key">
            <div class="callout-title">FÓRMULAS</div>
            <p class="mini"><b>SLI</b> = peticiones buenas / peticiones totales × 100 &nbsp;·&nbsp; <b>Error budget</b> = 100% − SLO<br>
            <b>Disponibilidad en SERIE</b> (dependencias encadenadas) = a₁ × a₂ × … × aₙ → <b>cada dependencia RESTA</b> (0,999 × 0,999 ≈ 0,998; 0,99³ ≈ 97%)<br>
            <b>Disponibilidad en PARALELO</b> (redundancia) = 1 − (1 − a)ⁿ → <b>cada réplica SUMA</b> (dos nodos de 0,99 → 1 − 0,01² = 99,99%)<br>
            <b>Cache hit ratio</b> = HITs / (HITs + MISSes) × 100 &nbsp;·&nbsp; <b>Muestras/día</b> = series × (86.400 ÷ intervalo)<br>
            <b>Integraciones punto a punto</b> = n·(n−1)/2 → 6 sistemas = <b>15</b> integraciones (SOA las baja a 6)</p>
          </div>
          <div class="callout key">
            <div class="callout-title">NÚMEROS PARA RECORDAR</div>
            <p class="mini"><b>99% </b> = 3,65 días/año · <b>99,9%</b> = 8,76 h/año = <b>43,8 min/mes</b> · <b>99,95%</b> = 4,38 h/año · <b>99,99%</b> = 52,6 min/año · <b>99,999%</b> = 5,26 min/año.<br>
            <b>Tiers:</b> I 99,671% (28,8 h) · II 99,741% (22 h) · <b>III mantenible concurrentemente 99,982%</b> (1,6 h) · <b>IV tolerante a fallas 99,995%</b> (26,3 min).<br>
            <b>Canary típico:</b> 5% del tráfico a la v2 → 25 → 50 → 100. <b>Recreate</b> es el <b>único con downtime</b>; <b>Blue/Green</b> es el <b>único con costo 2×</b>.<br>
            <b>Amazon Prime Video (2023):</b> migró de serverless/microservicios <b>a un monolito</b> y bajó <b>90%</b> el costo de infraestructura. <b>PedidosYa Plus:</b> 16 servicios en el MVP → <b>12</b> hoy.<br>
            <b>Retención de métricas:</b> 15 s los primeros 15 días · 5 min hasta 90 días · 1 h hasta 2 años.<br>
            <b>Modelo relacional:</b> Codd, IBM, <b>1970</b>. <b>MVC:</b> Reenskaug, Smalltalk-80, <b>1979</b>. <b>Falacias distribuidas:</b> Deutsch, Sun, <b>1994-97</b>. <b>Ley de Conway:</b> <b>1968</b>.</p>
          </div>
        </section>
      `;

      el.querySelector("#p2rpPrint").addEventListener("click", function () { window.print(); });
      APP.rerenderMermaid(el);
    },
  });
})();
