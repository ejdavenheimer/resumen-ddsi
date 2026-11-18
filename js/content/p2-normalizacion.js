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

        <h2>Primero: dependencia funcional</h2>
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

        <h2>1FN — Primera Forma Normal</h2>
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

        <h2>2FN — Segunda Forma Normal</h2>
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

        <h2>3FN — Tercera Forma Normal</h2>
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

        <h2>BCNF (Boyce-Codd), por si la nombran</h2>
        <p>Refuerzo de la 3FN: <b>todo determinante debe ser una clave candidata</b>. Se rompe en tablas con varias claves
        candidatas superpuestas (caso raro en el parcial). Si llegás a 3FN y además no hay atributos no clave determinando
        parte de una clave, estás en BCNF.</p>

        <h2>Las 3 anomalías (el “qué problema hay” de la pregunta)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Anomalía</th><th>Qué pasa</th><th>Ejemplo sobre el modelo mal normalizado</th></tr></thead>
          <tbody>
            <tr><td><b>De inserción</b></td><td>No se puede dar de alta un hecho sin inventar otro</td><td>No puedo crear un Departamento nuevo hasta que tenga un empleado asignado</td></tr>
            <tr><td><b>De actualización</b></td><td>El mismo dato está en N filas: hay que actualizarlo en todas o queda inconsistente</td><td>El depto cambia de piso → hay que tocar todas las filas de empleados; si fallo en una, hay dos verdades</td></tr>
            <tr><td><b>De borrado</b></td><td>Al borrar un registro se pierde información de otra entidad</td><td>Borro al último empleado del depto y pierdo el nombre y el piso del departamento</td></tr>
          </tbody>
        </table></div>

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
