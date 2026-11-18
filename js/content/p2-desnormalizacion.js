/* ============================================================
   P2 · Desnormalización (por consistencia y por performance)
   Tomado en el parcial del 17/11/2026
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-desnormalizacion",
    title: "Desnormalización",
    tag: "🧩",
    group: "Persistencia (P2)",
    resumen: "Por consistencia vs. por performance, técnicas y cómo justificarla",
    keywords: ["desnormalizacion", "redundancia", "consistencia", "performance", "dato congelado", "atributo replicado", "campo derivado", "tabla de resumen", "vista materializada", "ventana de inconsistencia", "lectura sucia", "dirty read", "fuente de verdad", "olap", "oltp", "esquema estrella"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Desnormalización de Datos</h1>
          <p class="lead">Fue el último punto del parcial del 17/11. Es el tema donde más fácil se nota si entendiste o si estás repitiendo: la clave es saber <b>cuál de las dos desnormalizaciones</b> estás usando.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Definición de la cátedra (textual)</div>
          <p>“La desnormalización es la <b>decisión de diseño consciente</b> de introducir <b>redundancia controlada</b> en
          un modelo <b>previamente normalizado</b> —replicando o derivando atributos— para satisfacer un requerimiento que
          el modelo normalizado no puede cumplir: <b>preservar la consistencia histórica</b> de la información o <b>alcanzar
          el nivel de performance</b> que el negocio exige.”</p>
          <p><b>No es un error de modelado ni un atajo.</b> Se toma <b>después</b> de haber normalizado, se documenta y se
          justifica. <b>Desnormalizar sin haber normalizado antes no es desnormalizar: es modelar mal.</b></p>
        </div>

        <h2>Normalizado vs. desnormalizado</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Criterio</th><th>Modelo normalizado</th><th>Modelo desnormalizado</th></tr></thead>
          <tbody>
            <tr><td>Redundancia</td><td>Mínima o nula</td><td>Controlada y deliberada</td></tr>
            <tr><td>Integridad</td><td>Garantizada por el propio modelo</td><td><b>Responsabilidad de la aplicación</b></td></tr>
            <tr><td>Costo de lectura</td><td>Alto: múltiples JOINs y agregaciones</td><td>Bajo: menos accesos por consulta</td></tr>
            <tr><td>Costo de escritura</td><td>Bajo: se actualiza un solo lugar</td><td>Alto: hay que propagar cada copia</td></tr>
            <tr><td>Riesgo principal</td><td>Degradación de performance</td><td><b>Inconsistencia entre copias</b></td></tr>
            <tr><td>Ámbito típico</td><td>OLTP / sistemas transaccionales</td><td>Reporting, OLAP y consultas de alta frecuencia</td></tr>
          </tbody>
        </table></div>

        <h2>Tipo 1 · Forzada por la CONSISTENCIA de datos</h2>
        <div class="callout key">
          <p>Hay datos que, <b>por regla de negocio, deben quedar congelados en el instante en que ocurre el hecho</b>. Si el
          modelo sólo guarda una referencia (una FK) al dato vigente, cualquier modificación posterior del dato referenciado
          <b>reescribe el pasado</b>.</p>
          <ul>
            <li>La FK expresa “<b>el valor actual</b> de X”; el negocio necesita “el valor de X <b>al momento del hecho</b>”.</li>
            <li><b>No es un problema de performance:</b> el modelo normalizado devuelve un resultado <b>incorrecto desde el punto de vista del negocio</b>.</li>
            <li>Acá la redundancia deja de ser un defecto: <b>es el mecanismo que preserva la verdad histórica</b>.</li>
            <li>Aplica sobre todo a <b>comprobantes, contratos, liquidaciones y registros de auditoría</b>: documentos que, una vez emitidos, son <b>inmutables</b>.</li>
          </ul>
        </div>

        <h3>Ejemplo I — la factura y el precio del producto</h3>
        ${APP.code(`-- Normalizado: el precio vive sólo en el maestro de productos
PRODUCTO        (id_producto, descripcion, precio_unitario)
FACTURA         (id_factura, fecha, id_cliente)
DETALLE_FACTURA (id_factura, nro_linea, id_producto, cantidad)
-- PROBLEMA: el importe se calcula con PRODUCTO.precio_unitario.
-- Si el producto pasa de $1.000 a $1.200, TODAS las facturas ya emitidas cambian de importe.

-- Desnormalizado: el precio aplicado pasa a ser un dato propio de la venta
DETALLE_FACTURA (id_factura, nro_linea, id_producto,
                 descripcion_producto, cantidad, precio_unitario_aplicado)
-- precio_unitario_aplicado NO es una copia del precio: es el precio DE ESA VENTA.
-- La redundancia es aparente.`, { lang: "sql", collapse: false, label: "Dato de contexto congelado" })}

        <h3>Ejemplo II — los datos del cliente en el comprobante</h3>
        ${APP.code(`-- Normalizado
CLIENTE (id_cliente, razon_social, cuit, domicilio_fiscal, condicion_iva)
FACTURA (id_factura, fecha, id_cliente, importe_total)
-- PROBLEMA: el cliente se muda y actualiza su domicilio fiscal. La factura emitida
-- hace seis meses pasa a exhibir un domicilio que nunca figuró en el comprobante
-- original, con impacto impositivo y probatorio.

-- Desnormalizado: se copian los datos vigentes al momento de la emisión
FACTURA (id_factura, fecha, id_cliente, importe_total,
         razon_social_emision, cuit_emision, domicilio_emision, cond_iva_emision)`, { lang: "sql", collapse: false, label: "Comprobante inmutable" })}
        <div class="callout key">
          <div class="callout-title">🎯 El criterio en una frase</div>
          <p>“Si el dato <b>integra un documento con valor probatorio, se COPIA</b>; si sólo sirve para <b>navegar</b>, se REFERENCIA.”</p>
        </div>

        <h3>¿Referenciar o copiar? Tabla de la cátedra</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Dato</th><th>Decisión</th><th>Fundamento</th></tr></thead>
          <tbody>
            <tr><td>Domicilio de entrega de un pedido ya despachado</td><td><b>Copiar</b></td><td>El envío se realizó a esa dirección</td></tr>
            <tr><td>Domicilio de contacto para llamar al cliente</td><td>Referenciar</td><td>Interesa siempre el valor vigente</td></tr>
            <tr><td>Precio y alícuota de IVA de una línea facturada</td><td><b>Copiar</b></td><td>Definen el importe legal del comprobante</td></tr>
            <tr><td>Categoría a la que pertenece un producto</td><td>Referenciar</td><td>Es un atributo actual del maestro</td></tr>
            <tr><td>Usuario que aprobó un movimiento</td><td><b>Copiar</b></td><td>Registro de auditoría inmutable</td></tr>
            <tr><td>Cotización aplicada a una operación en moneda extranjera</td><td><b>Copiar</b></td><td>El tipo de cambio varía permanentemente</td></tr>
          </tbody>
        </table></div>

        <h2>Tipo 2 · Forzada por la PERFORMANCE</h2>
        <div class="callout key">
          <p>Cuando el modelo normalizado <b>es correcto pero no responde en los tiempos que el negocio exige</b>, se
          introduce redundancia para reducir el trabajo del motor en cada lectura. <b>El resultado es el mismo; cambia el
          costo de obtenerlo.</b></p>
          <ul>
            <li>El costo se concentra en los <b>JOINs sobre grandes volúmenes</b> y en las <b>agregaciones repetidas</b> (SUM, COUNT, GROUP BY).</li>
            <li>Se justifica cuando la relación <b>lectura/escritura es muy asimétrica</b>: se lee miles de veces lo que se escribe una sola vez.</li>
            <li>Es una decisión de <b>última instancia</b>: antes van <b>índices, reescritura de consultas, caché, particionamiento y réplicas de lectura</b>.</li>
            <li>Exige <b>medición previa</b> que demuestre el problema (plan de ejecución, tiempos, volumen real), <b>nunca una intuición</b>.</li>
          </ul>
        </div>
        ${APP.code(`-- a) ATRIBUTO REPLICADO para evitar el JOIN
-- Escenario: listado de publicaciones, 40.000 consultas por minuto.
PUBLICACION (id_publicacion, titulo, precio, id_categoria)
CATEGORIA   (id_categoria, nombre)
SELECT p.titulo, p.precio, c.nombre
  FROM publicacion p JOIN categoria c ON p.id_categoria = c.id_categoria;

PUBLICACION (id_publicacion, titulo, precio, id_categoria, nombre_categoria)
-- La fuente de verdad sigue siendo CATEGORIA; nombre_categoria es una copia de
-- lectura que la aplicación debe mantener sincronizada.
-- Contrapartida: renombrar una categoría deja de ser el UPDATE de una fila y pasa
-- a ser una actualización masiva sobre publicaciones.
-- ¡Se CONSERVA la FK id_categoria!

-- b) CAMPO DERIVADO o precalculado
FACTURA.importe_total          -- en lugar de SUM(cantidad * precio) sobre DETALLE
PUBLICACION.cantidad_preguntas -- en lugar de COUNT(*) sobre PREGUNTA

-- c) TABLA DE RESUMEN (preagregación)
VENTA_DIARIA_POR_SUCURSAL (fecha, id_sucursal, cant_ventas, monto_total)
-- Se alimenta por proceso batch nocturno desde las tablas transaccionales.
-- Es la base del modelo dimensional: una tabla de hechos rodeada de dimensiones
-- deliberadamente desnormalizadas (ESQUEMA ESTRELLA).`, { lang: "sql", collapse: false, label: "Desnormalización por performance" })}
        <div class="callout warn">
          <div class="callout-title">⚠️ Condición innegociable</div>
          <p>“<b>Todo dato derivado debe ser reconstruible.</b> Siempre tiene que existir un <b>proceso de recálculo</b>
          capaz de reparar la copia a partir de la fuente de verdad.”</p>
        </div>

        <h2>Técnicas habituales (tabla para memorizar)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Técnica</th><th>En qué consiste</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td><b>Atributo replicado</b></td><td>Copiar en la tabla hija un atributo del maestro</td><td><code>nombre_categoria</code> en PUBLICACION</td></tr>
            <tr><td><b>Dato de contexto congelado</b></td><td>Guardar el valor vigente al momento del hecho</td><td><code>precio_unitario_aplicado</code> en DETALLE_FACTURA</td></tr>
            <tr><td><b>Campo derivado</b></td><td>Almacenar el resultado de un cálculo</td><td><code>importe_total</code>, <code>cantidad_preguntas</code></td></tr>
            <tr><td><b>Tabla de resumen</b></td><td>Preagregar por período o dimensión</td><td><code>VENTA_DIARIA_POR_SUCURSAL</code></td></tr>
            <tr><td><b>Vista materializada</b></td><td>Persistir el resultado de una consulta, refrescado por el motor</td><td>Ranking de productos más vendidos</td></tr>
            <tr><td><b>Fusión de tablas 1:1</b></td><td>Unificar entidades que siempre se leen juntas</td><td>USUARIO + PERFIL_USUARIO</td></tr>
          </tbody>
        </table></div>

        <h2>El precio real: impacto en las actualizaciones</h2>
        <div class="card">
          <ol>
            <li><b>Reaparecen las anomalías de actualización.</b> El mismo hecho vive en N lugares: actualizar uno y no los otros deja el modelo internamente inconsistente.</li>
            <li><b>La escritura se encarece.</b> Un UPDATE puntual se transforma en una propagación sobre miles de filas, con bloqueos y contención.</li>
            <li><b>La responsabilidad se traslada al software.</b> Lo que garantizaba el motor (FK, restricciones) pasa a depender de triggers, servicios de dominio o procesos batch.</li>
            <li><b>La transacción se amplía.</b> Si la copia se actualiza en la misma transacción, crecen la duración y la probabilidad de <i>deadlock</i>; si se hace fuera, aparece la <b>ventana de inconsistencia</b>.</li>
            <li><b>Aumenta el volumen almacenado.</b> Más espacio, índices más grandes y backups más costosos.</li>
          </ol>
        </div>

        <h2>Lecturas “sucias” e inconsistencias</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Lectura sucia (<i>dirty read</i>)</h3>
            <p>Leer datos de una transacción que <b>todavía no confirmó</b> y que puede sufrir <i>rollback</i>. Depende del
            <b>nivel de aislamiento</b> configurado en el motor.</p>
          </div>
          <div class="card">
            <h3>Lectura de una copia desactualizada</h3>
            <p>Fenómeno <b>distinto</b> pero de efecto parecido, que aparece al desnormalizar: el dato <b>está confirmado,
            pero es viejo</b>.</p>
          </div>
        </div>
        <div class="callout key">
          <p><b>Ventana de inconsistencia:</b> tiempo que transcurre entre el cambio en la fuente de verdad y la
          actualización de la copia. Si la propagación es asincrónica, se está aceptando <b>consistencia eventual</b>.</p>
          <p>“La pregunta de diseño no es <i>¿puede haber inconsistencia?</i> sino <b>¿cuánta y por cuánto tiempo la tolera
          el negocio?</b>” No es lo mismo un contador de visitas que el saldo de una cuenta.</p>
          <p><b>Efecto colateral:</b> dos consultas equivalentes pueden devolver resultados distintos (una lee la copia,
          otra resuelve el JOIN). Hay que <b>definir explícitamente cuál es la fuente de verdad</b>.</p>
        </div>

        <h2>Criterios de decisión y buenas prácticas</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Preguntas previas</h3>
            <ul>
              <li>¿El modelo normalizado es <b>incorrecto</b> para el negocio o solamente <b>lento</b>?</li>
              <li>¿Tengo una <b>medición</b> que demuestre el problema?</li>
              <li>¿Agoté <b>índices, reescritura de consultas, caché y particionamiento</b>?</li>
              <li>¿Cuál es la relación <b>lectura/escritura</b> real del caso?</li>
              <li>¿Qué grado de <b>inconsistencia tolera</b> el negocio?</li>
            </ul>
          </div>
          <div class="card">
            <h3>Buenas prácticas</h3>
            <ul>
              <li><b>Documentar</b> la decisión y declarar cuál es la <b>fuente de verdad</b>.</li>
              <li><b>Conservar la FK original</b> aunque se replique el atributo.</li>
              <li>Prever un proceso de <b>recálculo y reconciliación</b> de las copias.</li>
              <li><b>Monitorear la divergencia</b> entre copia y origen.</li>
              <li><b>Acotar y hacer explícita</b> la ventana de inconsistencia.</li>
              <li><b>Encapsular la actualización de la copia en un único punto</b> del código.</li>
            </ul>
          </div>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Frase para justificar en el parcial</div>
          <p>“Desnormalicé <code>precio_unitario_aplicado</code> en el detalle: es una <b>desnormalización forzada por
          consistencia</b>, porque el comprobante es inmutable y necesita el precio <b>al momento de la venta</b>, no el
          vigente. No es redundancia: es un dato propio de la venta.”</p>
          <p>“Desnormalicé <code>nombre_categoria</code> en PUBLICACION: es una <b>desnormalización por performance</b>,
          justificada por 40.000 lecturas/min contra una escritura muy infrecuente. <b>Conservo la FK</b>, declaro
          CATEGORIA como <b>fuente de verdad</b>, encapsulo la propagación en un único servicio y dejo un <b>proceso de
          recálculo</b>. Asumo una ventana de inconsistencia de segundos, tolerable para un listado.”</p>
          <p><b>Y si no corresponde, también se dice:</b> “No encuentro desnormalizaciones necesarias: no hay datos que
          deban congelarse ni volúmenes de lectura que lo justifiquen; el modelo queda en 3FN.”</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="p2dQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2dQuiz"), [
        { n: 1, topic: "Tipos", type: "mc", q: "Guardar <code>cotizacion_aplicada</code> en una operación en dólares es…", options: [
          { t: "Desnormalización por consistencia: el valor debe quedar congelado al momento del hecho", ok: true },
          { t: "Desnormalización por performance: evita un JOIN", ok: false },
          { t: "Un error de normalización (rompe 3FN)", ok: false },
        ], explain: "El tipo de cambio varía permanentemente; sin congelarlo, el modelo reescribe el pasado y da un resultado incorrecto para el negocio." },
        { n: 2, topic: "Criterio", type: "mc", q: "Antes de desnormalizar por performance, ¿qué hay que agotar?", options: [
          { t: "Índices, reescritura de consultas, caché, particionamiento y réplicas de lectura", ok: true },
          { t: "Nada: es la primera medida porque es la más efectiva", ok: false },
          { t: "Migrar a NoSQL", ok: false },
        ], explain: "Es una decisión de ÚLTIMA instancia y exige medición previa, nunca intuición." },
        { n: 3, topic: "Buenas prácticas", type: "vf", q: "Al replicar un atributo del maestro, conviene eliminar la FK original para no duplicar información.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Al contrario: una de las buenas prácticas explícitas es CONSERVAR la clave foránea original aunque se replique el atributo." },
        { n: 4, topic: "Riesgos", type: "mc", q: "El riesgo principal de un modelo desnormalizado es…", options: [
          { t: "Inconsistencia entre copias", ok: true },
          { t: "Degradación de performance", ok: false },
          { t: "Perder la integridad referencial del motor", ok: false },
        ], explain: "El riesgo del normalizado es la performance; el del desnormalizado, la inconsistencia. La integridad pasa a ser responsabilidad de la aplicación." },
        { n: 5, topic: "Aplicación", type: "open", q: "Actividad de la clase: sistema de turnos médicos; cada turno registra paciente, profesional, especialidad, sede y valor de la consulta. El listado del día se consulta 500 veces por minuto. ¿Qué congelás y qué referenciás?", answer: "CONGELAR en el turno (desnormalización por consistencia): el valor de la consulta al momento de darlo (si el arancel cambia, el turno pasado no debe cambiar de precio), la especialidad con la que se atendió y la sede donde se realizó, y el nombre/matrícula del profesional si el turno es un comprobante. REFERENCIAR: los datos de contacto del paciente y del profesional (interesa el valor vigente), y la categoría/obra social actual. Para la performance del listado (500/min) mediría primero: plan de ejecución, tiempo del query y volumen real; luego índices por (fecha, sede) y caché del listado. Sólo si eso no alcanza, replicaría nombre_paciente y nombre_profesional en TURNO, conservando las FK, con el maestro como fuente de verdad, propagación encapsulada en un servicio y un proceso de recálculo nocturno. Tolerancia: una ventana de inconsistencia de minutos en un nombre es aceptable; en el valor cobrado, no." },
      ]);
    },
  });
})();
