/* ============================================================
   P2 · Normalización: 1FN, 2FN, 3FN (+BCNF)
   Tema tomado en el parcial del 17/11/2026 (evaluar un DER dado)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-normalizacion",
    title: "Formas Normales (1FN · 2FN · 3FN)",
    tag: "🧼",
    group: "Persistencia (P2)",
    resumen: "Normalizar, anomalías y cómo evaluar un DER en 2 renglones",
    keywords: ["normalizacion", "formas normales", "1fn", "2fn", "3fn", "bcnf", "primera forma normal", "segunda", "tercera", "dependencia funcional", "transitiva", "parcial", "anomalias", "redundancia", "atomico", "multivaluado"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Formas Normales</h1>
          <p class="lead">En el parcial del 17/11 te daban un DER ya hecho y había que decir <b>si cumple las 3 formas normales, qué problema hay, en 2 renglones</b>. Esta página está armada para contestar exactamente eso.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Definición de la cátedra</div>
          <p>“La <b>normalización</b> es el proceso de estructurar un modelo de datos relacional <b>eliminando la redundancia
          y las dependencias mal ubicadas</b>, mediante la aplicación sucesiva de las formas normales (1FN, 2FN, 3FN, BCNF).”</p>
          <ul>
            <li><b>Regla de oro:</b> un dato, un solo lugar. Cada hecho del negocio se almacena una única vez.</li>
            <li><b>Beneficio:</b> se evitan las anomalías de <b>inserción, actualización y borrado</b>; la integridad queda garantizada por el propio modelo.</li>
            <li><b>Costo:</b> el modelo se fragmenta en más tablas; reconstruir información exige más <b>JOINs</b>.</li>
            <li><b>Conclusión:</b> el modelo normalizado <b>optimiza la escritura y la integridad, no la lectura</b>.</li>
          </ul>
        </div>

        <h2>Primero: ¿para qué sirve esto? (en criollo)</h2>
        <div class="callout key">
          <p><b>Normalizar es acomodar las tablas para que cada dato esté escrito en un solo lugar.</b></p>
          <p>Si un dato está repetido en muchas filas, tarde o temprano alguien lo cambia en una y se olvida de las
          otras. Ahí el sistema pasa a tener <b>dos verdades</b> y ya no sabés cuál es la buena. Eso es todo. Las tres
          formas normales son <b>tres preguntas</b> que le hacés a cada tabla, en orden.</p>
          <ol>
            <li><b>1FN:</b> ¿hay alguna celda con <b>más de un dato adentro</b>?</li>
            <li><b>2FN:</b> si la clave son <b>dos columnas</b>, ¿hay algún dato que se sepa mirando <b>media clave</b>?</li>
            <li><b>3FN:</b> ¿hay algún dato que <b>describa a otra cosa</b> y no al dueño de la fila?</li>
          </ol>
          <p><b>Atajo visual que casi nunca falla:</b> mirá las columnas buscando <b>valores repetidos verticalmente</b>.
          Si ves la misma palabra copiada en muchas filas (“Sistemas”, “Teclado”, “Palermo”), ahí está el problema:
          <b>ese dato pertenece a otra tabla</b>.</p>
        </div>

        <h2>1FN — “un solo dato por casillero”</h2>
        <p><b>La pregunta:</b> <i>¿hay alguna celda con más de un dato adentro?</i> Si la respuesta es sí, no cumple.</p>
        <div class="grid-2">
          <div class="card">
            <h3>❌ Mal</h3>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>id</th><th>nombre</th><th>telefonos</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>Ana</td><td>1133-4455 <b>/</b> 1166-7788</td></tr>
                <tr><td>2</td><td>Luis</td><td>1144-2200</td></tr>
              </tbody>
            </table></div>
            <p class="mini"><b>Por qué molesta, en concreto:</b></p>
            <ul class="mini">
              <li>¿Cómo buscás quién tiene el 1166-7788? Tenés que <b>partir el texto</b>.</li>
              <li>¿Cómo agregás un tercero? <b>Reescribiendo toda la cadena.</b></li>
              <li>Nada impide que mañana alguien escriba “11 66 77 88” y ya tengas dos formatos.</li>
              <li><b>El mismo error disfrazado:</b> columnas <code>tel_1, tel_2, tel_3</code>. ¿Y el cuarto dónde va? Hay que <b>modificar la tabla</b>.</li>
            </ul>
          </div>
          <div class="card">
            <h3>✅ Bien</h3>
            <div class="table-wrap"><table class="data">
              <thead><tr><th>id_tel</th><th>id_cliente</th><th>numero</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>1</td><td>1133-4455</td></tr>
                <tr><td>2</td><td>1</td><td>1166-7788</td></tr>
                <tr><td>3</td><td>2</td><td>1144-2200</td></tr>
              </tbody>
            </table></div>
            <p class="mini">Cada teléfono es <b>una fila</b>. Buscar, agregar y borrar es trivial, se puede validar el
            formato y no hay límite de cuántos.</p>
          </div>
        </div>
        <div class="callout tip">
          <p><b>Cómo aparece en los parciales:</b> “alergias”, “servicios que ofrece el lugar”, “zonas que cubre el
          transportista”, “horarios de atención”, “archivos adjuntos”. <b>Todo lo que en el enunciado esté en plural y
          se pueda enumerar es una tabla hija.</b></p>
        </div>

        <h2>2FN — “si la clave son DOS columnas, todo tiene que depender de LAS DOS”</h2>
        <div class="callout warn">
          <p><b>Esto sólo puede fallar si la clave primaria es compuesta</b> (dos o más columnas). Si la PK es una sola
          columna y ya cumpliste 1FN, <b>la 2FN se cumple sola</b>. No pierdas tiempo buscándola.</p>
        </div>
        <p><b>La pregunta:</b> <i>¿hay algún dato que se sepa mirando sólo MEDIA clave?</i></p>
        <div class="card">
          <h3>❌ Mal — <code>DETALLE_FACTURA</code>, con PK = (nro_factura, cod_producto)</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>nro_factura <small>(PK)</small></th><th>cod_producto <small>(PK)</small></th><th>cantidad</th><th>nombre_producto</th></tr></thead>
            <tbody>
              <tr><td>A-100</td><td>P7</td><td>2</td><td><b>Teclado</b></td></tr>
              <tr><td>A-101</td><td>P7</td><td>1</td><td><b>Teclado</b></td></tr>
              <tr><td>A-102</td><td>P7</td><td>5</td><td><b>Teclado</b></td></tr>
            </tbody>
          </table></div>
          <div class="callout key">
            <div class="callout-title">🖐️ El truco del dedo</div>
            <p><b>Tapá <code>nro_factura</code> con el dedo.</b> ¿Podés saber igual cuál es el
            <code>nombre_producto</code>? <b>Sí</b>, con sólo mirar <code>P7</code>. Entonces ese dato <b>no es del
            detalle: es del producto</b> — y por eso aparece copiado en las tres filas.</p>
            <p>Ahora probá con <code>cantidad</code>: tapá <code>nro_factura</code> y preguntate cuántos teclados hay.
            <b>No se puede saber</b>: necesitás las dos columnas (“2 teclados <b>en la factura A-100</b>”).
            <code>cantidad</code> <b>sí</b> está bien ahí.</p>
          </div>
          <p><b>✅ Bien:</b> <code>DETALLE_FACTURA(nro_factura, cod_producto, cantidad)</code> y el nombre vive
          <b>una sola vez</b> en <code>PRODUCTO(cod_producto, nombre)</code>.</p>
          <p><b>Qué se rompe si lo dejás:</b> si corregís el nombre a “Teclado mecánico”, tenés que tocar <b>las tres
          filas</b> — y todas las futuras. Si te olvidás de una, el mismo producto figura con dos nombres distintos.</p>
        </div>

        <h2>3FN — “si el dato describe a OTRA cosa, no va acá”</h2>
        <p><b>La pregunta:</b> <i>¿este dato habla del dueño de la fila, o habla de otra cosa?</i></p>
        <div class="card">
          <h3>❌ Mal — <code>EMPLEADO</code>, con PK = legajo</h3>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>legajo <small>(PK)</small></th><th>nombre</th><th>cod_depto</th><th>nombre_depto</th><th>piso</th></tr></thead>
            <tbody>
              <tr><td>101</td><td>Ana</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
              <tr><td>102</td><td>Luis</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
              <tr><td>103</td><td>Sol</td><td>D3</td><td><b>Sistemas</b></td><td><b>3</b></td></tr>
            </tbody>
          </table></div>
          <p><b>Preguntale a cada columna de quién habla:</b> <code>nombre</code> habla <b>del empleado</b> ✅.
          <code>piso</code>… <b>no es el piso de Ana: es el piso del departamento</b> ❌. Y se ve a simple vista:
          “Sistemas / 3” está copiado en todas las filas.</p>
          <p>La cadena es <code>legajo → cod_depto → piso</code>: el piso depende de <b>algo que no es la clave</b>.
          Eso se llama <b>dependencia transitiva</b>, pero el nombre importa menos que la pregunta: <i>¿de quién habla
          este dato?</i></p>
          <p><b>✅ Bien:</b> <code>EMPLEADO(legajo, nombre, cod_depto)</code> +
          <code>DEPARTAMENTO(cod_depto, nombre, piso)</code>. El piso queda escrito <b>una sola vez</b>.</p>
        </div>
        <div class="callout key">
          <div class="callout-title">El otro caso de 3FN: los datos que se pueden calcular</div>
          <p><code>subtotal = cantidad × precio</code> · <code>total = neto + iva</code> · <code>edad</code> (sale de la
          fecha de nacimiento) · <code>cantidad_de_items</code> (es un COUNT) · <code>potencia_total</code> (es un SUM).</p>
          <p><b>Si se puede calcular, no se guarda</b> — porque en cuanto cambie el origen, la copia queda mintiendo.
          La única excepción es que lo declares como <a class="inline" data-go="p2-desnormalizacion">desnormalización
          justificada</a>.</p>
        </div>

        <h2>Y ahora sí, los nombres técnicos</h2>
        <p>Ya entendiste el fondo; esto es sólo el vocabulario con el que lo vas a escribir en el parcial.</p>

        <h3>Dependencia funcional</h3>
        <p>“<b>X → Y</b>” (Y depende funcionalmente de X) significa: conociendo el valor de X, queda determinado un único
        valor de Y. <code>cuit → razon_social</code>: dado un CUIT hay una sola razón social.</p>
        <p>Las formas normales se definen sobre quién determina a quién:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Problema</th><th>Qué significa</th><th>La rompe</th></tr></thead>
          <tbody>
            <tr><td>Atributo <b>no atómico</b> o repetido</td><td>Una celda con varios valores, o columnas tel_1, tel_2, tel_3</td><td><b>1FN</b></td></tr>
            <tr><td>Dependencia <b>parcial</b></td><td>Un atributo depende de <b>parte</b> de una PK compuesta, no de toda</td><td><b>2FN</b></td></tr>
            <tr><td>Dependencia <b>transitiva</b></td><td>Un atributo depende de otro atributo <b>no clave</b> (PK → A → B)</td><td><b>3FN</b></td></tr>
            <tr><td>Un atributo no clave determina parte de una clave</td><td>Existe un determinante que no es clave candidata</td><td><b>BCNF</b></td></tr>
          </tbody>
        </table></div>

        <h3>1FN — la definición formal</h3>
        <div class="grid-2">
          <div class="card">
            <h3>Qué exige</h3>
            <ul>
              <li>Todos los atributos son <b>atómicos</b> (un solo valor por celda, indivisible para el negocio).</li>
              <li><b>No hay grupos repetitivos</b> (ni <code>tel_1, tel_2, tel_3</code>, ni una columna “teléfonos” con valores separados por coma).</li>
              <li>Existe una <b>PK</b> que identifica cada fila; no hay filas duplicadas.</li>
              <li>Cada columna tiene un <b>único dominio</b> (no mezclar “fecha o texto” en el mismo campo).</li>
            </ul>
          </div>
          <div class="card">
            <h3>Cómo detectarla en un DER dado</h3>
            <p>Buscá: columnas numeradas, campos tipo <code>telefonos VARCHAR</code>, <code>items_del_pedido TEXT</code>,
            tablas sin PK, o un campo que claramente contiene una lista.</p>
            <p><b>Cómo se arregla:</b> sacar el atributo multivaluado a una <b>tabla hija</b> con FK al padre
            (relación 1:N).</p>
          </div>
        </div>
        ${APP.code(`-- ✕ NO cumple 1FN: el atributo "telefonos" no es atómico y hay grupo repetitivo
CLIENTE(id_cliente PK, nombre, telefonos)        -- telefonos = "1133445566 / 1144556677"
CLIENTE(id_cliente PK, nombre, tel_1, tel_2, tel_3)

-- ✓ 1FN: el multivaluado sale a una tabla hija
CLIENTE  (id_cliente PK, nombre)
TELEFONO (id_telefono PK, id_cliente FK NOT NULL, tipo, numero)`, { lang: "sql", collapse: false, label: "1FN" })}

        <h3>2FN — la definición formal</h3>
        <div class="callout key">
          <p>Está en <b>1FN</b> <u>y</u> además <b>todo atributo no clave depende de la clave primaria COMPLETA</b>,
          no de una parte de ella. (Es decir: <b>no hay dependencias parciales</b>.)</p>
          <p class="mini"><b>Atajo:</b> si la PK es de <b>una sola columna</b> y está en 1FN, la 2FN se cumple
          automáticamente. La 2FN sólo se puede violar con <b>PK compuesta</b> — típicamente, en las tablas intermedias.</p>
        </div>
        ${APP.code(`-- ✕ NO cumple 2FN: PK compuesta (id_factura, id_producto)
DETALLE_FACTURA(id_factura PK, id_producto PK, cantidad, descripcion_producto, nombre_cliente)
--   descripcion_producto depende SOLO de id_producto  → dependencia parcial
--   nombre_cliente       depende SOLO de id_factura   → dependencia parcial

-- ✓ 2FN: cada atributo con la clave de la que realmente depende
DETALLE_FACTURA(id_factura PK FK, id_producto PK FK, cantidad)
PRODUCTO       (id_producto PK, descripcion)
FACTURA        (id_factura PK, id_cliente FK)`, { lang: "sql", collapse: false, label: "2FN" })}

        <h3>3FN — la definición formal</h3>
        <div class="callout key">
          <p>Está en <b>2FN</b> <u>y</u> además <b>ningún atributo no clave depende de otro atributo no clave</b>
          (no hay <b>dependencias transitivas</b>: PK → A → B).</p>
          <p class="mini">Frase clásica para repetir: “cada atributo depende de la clave, de toda la clave y <b>de nada
          más que la clave</b>”.</p>
        </div>
        ${APP.code(`-- ✕ NO cumple 3FN: dependencia transitiva
EMPLEADO(id_empleado PK, nombre, id_depto, nombre_depto, piso_depto)
--   id_empleado → id_depto → nombre_depto, piso_depto
--   nombre_depto NO depende del empleado: depende del departamento

-- ✓ 3FN
EMPLEADO     (id_empleado PK, nombre, id_depto FK NOT NULL)
DEPARTAMENTO (id_depto PK, nombre, piso)

-- Otro clásico de 3FN: el dato DERIVADO
FACTURA(id_factura PK, ..., cantidad, precio_unitario, subtotal)
--   subtotal = cantidad * precio_unitario → es calculable, no debería almacenarse
--   (guardarlo es una DESNORMALIZACIÓN: válida sólo si se justifica)`, { lang: "sql", collapse: false, label: "3FN" })}

        <h3>BCNF (Boyce-Codd), por si la nombran</h3>
        <p>Refuerzo de la 3FN: <b>todo determinante debe ser una clave candidata</b>. Se rompe en tablas con varias claves
        candidatas superpuestas (caso raro en el parcial). Si llegás a 3FN y además no hay atributos no clave determinando
        parte de una clave, estás en BCNF.</p>

        <h2>Qué pasa si lo dejás mal: las 3 anomalías</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Anomalía</th><th>En criollo</th><th>Con la tabla EMPLEADO de arriba</th></tr></thead>
          <tbody>
            <tr><td><b>De inserción</b></td><td>No podés cargar una cosa sin inventar otra</td><td>No podés dar de alta el departamento “Marketing” <b>hasta que no tengas un empleado</b> para poner ahí</td></tr>
            <tr><td><b>De actualización</b></td><td>Tenés que cambiar lo mismo en muchos lugares</td><td>Sistemas se muda al piso 5 → hay que editar <b>las tres filas</b>. Si fallás en una, el mismo depto queda con <b>dos pisos distintos</b></td></tr>
            <tr><td><b>De borrado</b></td><td>Borrás una cosa y se te va otra de regalo</td><td>Se va el último empleado de Sistemas → <b>desaparece el departamento</b> y nadie sabe más que estaba en el piso 3</td></tr>
          </tbody>
        </table></div>


        <h2>Banco de frases: qué escribir en cada caso</h2>
        <p class="mini">Dos situaciones distintas y <b>dos frases distintas</b>: cuando te <b>dan</b> un DER y tenés que decir si cumple, y cuando <b>vos</b> diseñaste y tenés que justificar qué hiciste para normalizar. Adaptá lo que está entre corchetes.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Lo que ves</th><th>❌ Si te preguntan si cumple</th><th>✅ Si lo normalizaste vos</th></tr></thead>
          <tbody>
            <tr>
              <td><b>Una celda con varios datos</b><br><span class="mini">“pollo, maní, lácteos” · “Palermo / Belgrano”</span></td>
              <td>“<b>No cumple 1FN</b>: <code>[campo]</code> guarda <b>varios valores en una sola celda</b>, así que no es atómico. No se puede buscar ni validar por uno de ellos sin partir el texto, agregar uno obliga a reescribir toda la cadena y nada impide que se carguen con formatos distintos.”</td>
              <td>“Para cumplir <b>1FN</b> saqué <code>[campo]</code> a la tabla <b><code>[HIJA]</code></b>, con <b>una fila por valor</b> y FK a <code>[PADRE]</code>. Así cada dato es <b>atómico</b>, se puede buscar, validar e indexar, y no hay límite de cuántos.”</td>
            </tr>
            <tr>
              <td><b>Columnas numeradas</b><br><span class="mini"><code>tel_1, tel_2, tel_3</code> · <code>conector_1..3</code></span></td>
              <td>“<b>No cumple 1FN</b>: <code>[campo]_1..n</code> es un <b>grupo repetitivo</b>. Limita artificialmente la cantidad —el cuarto valor <b>no entra sin modificar la tabla</b>—, deja columnas nulas cuando hay menos, y obliga a repetir la misma consulta por cada columna.”</td>
              <td>“Para cumplir <b>1FN</b> convertí el grupo repetitivo en la <b>entidad</b> <code>[HIJA]</code>, relación <b>1,N</b> con <code>[PADRE]</code>. Ahora se pueden tener <b>cuantos haga falta</b> sin tocar el esquema, y además cada uno puede tener <b>sus propios atributos</b> (estado, número, tipo).”</td>
            </tr>
            <tr>
              <td><b>Tabla sin clave primaria</b></td>
              <td>“<b>No cumple 1FN</b>: la tabla <b>no tiene PK</b>, así que nada impide <b>filas duplicadas</b> y no hay forma de referenciar una fila concreta ni de actualizarla o borrarla con seguridad.”</td>
              <td>“Le puse <b>PK</b> a cada tabla: subrogada por defecto, y <b>UNIQUE</b> sobre la clave natural del negocio (<code>[campo]</code>) para no perder esa restricción.”</td>
            </tr>
            <tr>
              <td><b>PK compuesta y un campo que depende de media clave</b><br><span class="mini"><code>nombre_producto</code> en el detalle</span></td>
              <td>“<b>No cumple 2FN</b>: la PK es <b>compuesta</b> <code>([A], [B])</code> y <code>[campo]</code> depende <b>sólo de <code>[B]</code></b>, no de la clave completa (<b>dependencia parcial</b>). Por eso el mismo valor aparece repetido en todas las filas de ese <code>[B]</code>, y corregirlo obliga a actualizarlas todas.”</td>
              <td>“Para cumplir <b>2FN</b>, <code>[campo]</code> lo dejé en <code>[TABLA_DE_B]</code>, que es de quien realmente depende, y en la intermedia quedó <b>sólo lo que necesita las dos partes de la clave</b> (<code>[cantidad]</code>). Así el dato está escrito <b>una sola vez</b>.”</td>
            </tr>
            <tr>
              <td><b>Nombre o descripción “de otra cosa”</b><br><span class="mini"><code>nombre_depto</code>, <code>nombre_categoria</code>, datos del técnico</span></td>
              <td>“<b>No cumple 3FN</b>: <code>[campo]</code> <b>no describe a <code>[la entidad]</code> sino a <code>[la otra]</code></b>, o sea que depende de <code>[fk]</code>, que <b>no es clave</b> (<b>dependencia transitiva</b>). Genera <b>redundancia</b> y <b>anomalías de actualización y borrado</b>: cambiar <code>[el dato]</code> obliga a editar N filas, y al borrar la última se pierde la información de <code>[la otra entidad]</code>.”</td>
              <td>“Para cumplir <b>3FN</b> extraje la entidad <code>[OTRA]</code> con sus propios atributos y dejé en <code>[ESTA]</code> <b>sólo la FK</b>. El dato queda en <b>un único lugar</b>, se actualiza una sola vez y <code>[OTRA]</code> puede existir aunque no tenga ninguna <code>[ESTA]</code> asociada.”</td>
            </tr>
            <tr>
              <td><b>Campo que se puede calcular</b><br><span class="mini"><code>total</code>, <code>subtotal</code>, <code>edad</code>, <code>cantidad_de…</code></span></td>
              <td>“<b>No cumple 3FN</b>: <code>[campo]</code> es un <b>dato derivado</b> —se obtiene con <code>[SUM/COUNT/resta de fechas]</code>—, así que <b>no aporta información nueva</b> y <b>se desincroniza</b> en cuanto cambia el origen, dejando dos valores que no coinciden.”</td>
              <td>“No almaceno <code>[campo]</code>: lo <b>calculo</b> con <code>[la consulta]</code>. <i>(Y si decidís guardarlo igual:)</i> lo guardo como <b>desnormalización por performance</b> porque <code>[la consulta]</code> se ejecuta <code>[N]</code> veces; declaro <code>[TABLA]</code> como <b>fuente de verdad</b>, encapsulo la actualización en un único punto y dejo un <b>proceso de recálculo</b>.”</td>
            </tr>
            <tr>
              <td><b>Un dato repetido que SÍ tiene que estar</b><br><span class="mini"><code>precio_aplicado</code> en la factura</span></td>
              <td>“<b>Esto NO es una violación:</b> <code>[campo]</code> es el valor <b>al momento del hecho</b>, no una copia del maestro. Si se referenciara el vigente, un cambio posterior <b>reescribiría el pasado</b> y el comprobante dejaría de ser reimprimible. Es <b>desnormalización por consistencia</b>, y lo correcto es <b>conservar también la FK</b>.”</td>
              <td>“Congelé <code>[campo]</code> en <code>[TABLA]</code> porque el documento es <b>inmutable</b>: necesita el valor <b>de ese momento</b>, no el vigente. Conservo la FK para navegar al maestro actual y <b>declaro la decisión</b> para que no se lea como un error de normalización.”</td>
            </tr>
            <tr>
              <td><b>Está todo bien</b></td>
              <td colspan="2">“<b>Sí, cumple las tres.</b> Cada celda tiene <b>un solo dato</b> y toda tabla tiene <b>PK</b> (1FN). Donde la PK es <b>compuesta</b>, ningún campo se puede deducir mirando una sola de sus partes (2FN). Y <b>ningún campo describe a otra entidad ni es calculable</b>: lo de cada cosa vive en su tabla y se referencia por <b>FK</b> (3FN). <i>[Si hay algo replicado:]</i> El único dato repetido es <code>[campo]</code>, y <b>es deliberado</b>: es una desnormalización por <code>[consistencia/performance]</code>, declarada y con la FK conservada.”</td>
            </tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">SI TE PIDEN “¿QUÉ HIZO PARA NORMALIZAR?” — el proceso en 3 movimientos</div>
          <p class="mini"><b>①</b> “Saqué los <b>datos multivaluados</b> (<code>[campo]</code>) a <b>tablas hijas</b> con FK, para que cada celda tenga un solo valor → <b>1FN</b>.”<br>
          <b>②</b> “Revisé las <b>claves compuestas</b> y moví a su tabla todo lo que dependía de <b>una sola parte</b> de la clave (<code>[campo]</code> → <code>[TABLA]</code>) → <b>2FN</b>.”<br>
          <b>③</b> “Extraje como <b>entidades propias</b> los conjuntos de datos que describían <b>a otra cosa</b> (<code>[OTRA]</code>) y dejé sólo la <b>FK</b>; y <b>eliminé los campos calculables</b> → <b>3FN</b>.”<br>
          <b>Y el cierre:</b> “Con eso el modelo queda en <b>3FN</b>: cada hecho está escrito <b>una sola vez</b>, lo que evita las anomalías de <b>inserción, actualización y borrado</b>. Las únicas redundancias que dejé son <b>deliberadas y declaradas</b>: <code>[las que sean]</code>.”</p>
        </div>
        <p class="mini"><b>Dos reglas de oro al redactar:</b> ① <b>nunca digas sólo “no cumple”</b> — siempre <b>qué tabla, qué columna, de qué depende en realidad y qué problema causa</b>; ② <b>si decís que sí cumple, fundamentalo igual</b> recorriendo las tres: un “sí” sin argumento vale lo mismo que no contestar.</p>

        <div class="callout key">
          <div class="callout-title">🎯 Plantilla de respuesta (para los “2 renglones”)</div>
          <p><b>Si NO cumple:</b><br>
          “<b>No cumple la 3FN</b>: en la tabla <i>EMPLEADO</i>, <code>nombre_depto</code> y <code>piso_depto</code> no
          dependen de la PK <code>id_empleado</code> sino de <code>id_depto</code>, que es un atributo no clave
          (<b>dependencia transitiva</b>). Esto genera <b>redundancia</b> y <b>anomalías de actualización y borrado</b>:
          cambiar el piso obliga a actualizar todas las filas del departamento, y borrar al último empleado hace perder
          los datos del depto. <b>Se corrige</b> extrayendo <i>DEPARTAMENTO(id_depto PK, nombre, piso)</i> y dejando
          en <i>EMPLEADO</i> sólo la FK <code>id_depto</code>. 1FN y 2FN sí se cumplen (atributos atómicos y PK simple).”</p>
          <p><b>Si cumple:</b><br>
          “<b>Sí, cumple las tres</b>: todos los atributos son atómicos y cada tabla tiene PK (1FN); las PK compuestas de
          las tablas intermedias no tienen atributos que dependan de una sola de sus partes (2FN); y ningún atributo no
          clave depende de otro atributo no clave — los datos de cada entidad viven en su propia tabla y se referencian
          por FK (3FN).”</p>
        </div>

        <h2>Cómo auditar un DER en 60 segundos</h2>
        <div class="card">
          <ol>
            <li><b>¿Hay celdas con listas o columnas numeradas?</b> → rompe 1FN.</li>
            <li><b>¿Hay PK compuestas?</b> Mirá cada atributo no clave: ¿depende de las dos partes o de una sola? → rompe 2FN.</li>
            <li><b>¿Hay un nombre/descripción/dato “de otra entidad” metido en la tabla?</b> (nombre_depto, nombre_cliente, nombre_categoria) → rompe 3FN.</li>
            <li><b>¿Hay un campo calculable</b> (total, subtotal, edad, cantidad_de_X)? → rompe 3FN, salvo desnormalización justificada.</li>
            <li><b>¿El mismo dato aparece en dos tablas?</b> → redundancia: decidí si es error o <a class="inline" data-go="p2-desnormalizacion">desnormalización deliberada</a>.</li>
          </ol>
        </div>
        <div class="callout warn">
          <p><b>No confundas:</b> un dato replicado <b>no siempre</b> es un error de normalización. Si el enunciado dice
          “el precio de la factura debe ser el del momento de la venta”, ese campo <b>debe</b> estar en el detalle: es
          <b>desnormalización forzada por consistencia</b> y lo correcto es decirlo así. Lo que nunca va es desnormalizar
          <b>sin haber normalizado antes</b>: eso no es desnormalizar, es modelar mal.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2nQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2nQuiz"), [
        { n: 1, topic: "1FN", type: "mc", q: "<code>MASCOTA(id PK, nombre, alergias)</code> donde <code>alergias</code> guarda “pollo, maní, lácteos”. ¿Qué forma normal rompe?", options: [
          { t: "1FN: el atributo no es atómico (grupo repetitivo)", ok: true },
          { t: "2FN: dependencia parcial", ok: false },
          { t: "3FN: dependencia transitiva", ok: false },
        ], explain: "Se corrige con una tabla ALERGIA(id PK, id_mascota FK, descripcion) — o un @ElementCollection si lo mapeás con Hibernate." },
        { n: 2, topic: "2FN", type: "mc", q: "<code>DETALLE(id_pedido PK, id_producto PK, cantidad, nombre_producto)</code>. ¿Qué rompe?", options: [
          { t: "2FN: nombre_producto depende sólo de id_producto (dependencia parcial)", ok: true },
          { t: "1FN: hay dos PK", ok: false },
          { t: "Nada, está bien", ok: false },
        ], explain: "Con PK compuesta, todo atributo no clave debe depender de la clave COMPLETA. nombre_producto va en PRODUCTO." },
        { n: 3, topic: "3FN", type: "mc", q: "<code>TURNO(id PK, fecha, id_profesional, especialidad_profesional)</code>. ¿Qué rompe?", options: [
          { t: "3FN: especialidad_profesional depende de id_profesional, que no es clave (transitiva)", ok: true },
          { t: "2FN", ok: false },
          { t: "Nada: es desnormalización válida siempre", ok: false },
        ], explain: "Rompe 3FN. Ahora: si el negocio exige saber con qué especialidad se atendió ESE turno (dato histórico), entonces sí es desnormalización por consistencia y hay que justificarlo." },
        { n: 4, topic: "2FN", type: "vf", q: "Si una tabla está en 1FN y su PK es de una sola columna, está automáticamente en 2FN.", options: [
          { t: "Verdadero", ok: true }, { t: "Falso", ok: false },
        ], explain: "Las dependencias parciales sólo existen si hay PK compuesta." },
        { n: 5, topic: "Anomalías", type: "multi", q: "¿Cuáles son las anomalías que evita la normalización? (marcá todas)", options: [
          { t: "De inserción", ok: true },
          { t: "De actualización", ok: true },
          { t: "De borrado", ok: true },
          { t: "De lectura", ok: false },
        ], explain: "Inserción, actualización y borrado. La normalización optimiza escritura e integridad; la lectura es justamente lo que empeora (más JOINs)." },
        { n: 6, topic: "Criterio", type: "open", q: "Te dan un DER con la tabla <code>PUBLICACION(id PK, titulo, precio, id_categoria, nombre_categoria)</code>. ¿Cumple 3FN? ¿Qué problema hay?", answer: "No cumple 3FN: nombre_categoria depende de id_categoria (atributo no clave) y no de la PK → dependencia transitiva. Problema: redundancia y anomalía de actualización — renombrar una categoría obliga a actualizar todas las publicaciones y, si falla a mitad de camino, el modelo queda inconsistente. Se corrige dejando sólo la FK id_categoria y leyendo el nombre con un JOIN a CATEGORIA. Excepción válida: si el listado se consulta con muchísima frecuencia (ej. 40.000 consultas/min), replicar nombre_categoria es una desnormalización por performance aceptable, siempre que se conserve la FK, se declare CATEGORIA como fuente de verdad y exista un proceso de recálculo." },
      ]);
    },
  });
})();
