/* ============================================================
   P2 · Persistencia: concepto, estrategias y problemas
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-persistencia",
    title: "Persistencia: concepto y tipos",
    tag: "💾",
    group: "Persistencia (P2)",
    resumen: "Qué es persistir, las 6 estrategias y sus problemas",
    keywords: ["persistencia", "memoria", "archivos", "prevalencia", "ortogonal", "base de datos", "objetos", "nosql", "relacional", "interoperabilidad", "prevayler"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Persistencia · 2º Parcial</div>
          <h1>Persistencia: concepto, tipos y problemas</h1>
          <p class="lead">Es la primera definición del temario y la base de todo lo demás. Dos o tres renglones bien dichos acá valen puntos seguros.</p>
        </div>

        <div class="callout key">
          <div class="callout-title">🔑 Definición de la cátedra (memorizala)</div>
          <p>“La <b>persistencia</b> es que el <b>estado de un sistema sobreviva más allá del proceso que lo creó</b>;
          dicho de otro modo, que sobreviva más allá de una única ejecución. En la práctica se logra almacenando ese
          estado en algún <b>medio persistente</b>: una base de datos o archivos.”</p>
        </div>

        <h2>Las estrategias de persistencia</h2>
        <p>El temario pide los <b>tipos</b>. Son seis grandes familias (las tres últimas son “en base de datos”):</p>
        ${APP.uml(`graph TB
    P["Estrategias de persistencia"]
    P --> M["1 · En Memoria"]
    P --> A["2 · En Archivos"]
    P --> V["3 · Prevalencia"]
    P --> O["4 · Ortogonal"]
    P --> B["5 · En Base de Datos"]
    B --> B1["Relacionales"]
    B --> B2["No-SQL"]
    B --> B3["De Objetos"]
    style P fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style B fill:#e0f2fe,stroke:#0284c7,color:#0f172a`, "Mapa de estrategias")}

        <div class="table-wrap"><table class="data">
          <thead><tr><th>Estrategia</th><th>En qué consiste</th><th>✅ Ventaja</th><th>⚠️ Desventaja</th></tr></thead>
          <tbody>
            <tr><td><b>En Memoria</b></td><td>El dato u objeto sigue existiendo luego de ser usado en distintas operaciones. La RAM es volátil (contradice la persistencia “pura”), pero existen memorias persistentes.</td><td>Velocidad; ideal para <b>tests</b> (y motores como SQLite en memoria)</td><td>Volátil: se pierde al apagar</td></tr>
            <tr><td><b>En Archivos</b></td><td>Se guarda el estado en uno o varios archivos para recuperarlo después y seguir “como si nada hubiera pasado”. Formatos: XML, CSV, ancho fijo, JSON.</td><td>Simple, portable, sirve para intercambio</td><td>Sin consultas, sin concurrencia, sin integridad</td></tr>
            <tr><td><b>Prevalencia</b></td><td>El estado vive en <b>memoria principal</b> y periódicamente se generan <b>snapshots</b> a disco. Maneja transacciones. Implementación: <b>Prevayler</b> (Java).</td><td><b>No hay transformación de datos</b> (se guardan en el formato que el sistema entiende) → mucha transparencia y <b>gran performance</b></td><td>Falta de <b>interoperabilidad</b>; exige memoria suficiente para alojar el aplicativo completo</td></tr>
            <tr><td><b>Ortogonal</b></td><td>La persistencia es una <b>propiedad intrínseca del entorno de ejecución</b>: no hace falta ninguna acción para guardar o recuperar, ocurre de forma transparente.</td><td>Totalmente transparente para el programador</td><td>Depende del entorno; se ve en SO (hibernación) y virtualización (VMware, VirtualBox)</td></tr>
            <tr><td><b>BD de Objetos</b></td><td>Guardan los objetos tal como los representa el lenguaje. Cada BDOO está <b>atada a un lenguaje</b>, porque la representación interna de los objetos difiere.</td><td><b>No hay transformación</b> → mayor performance; no hay impedance mismatch</td><td>Mala <b>interoperabilidad</b>; atada a un lenguaje</td></tr>
            <tr><td><b>BD Relacional / No-SQL</b></td><td>El estado se persiste en una o varias bases de datos. Según el tipo, los datos <b>necesitan una transformación</b> antes de guardarse.</td><td><b>Interoperabilidad máxima</b> (los datos son independientes del sistema que los manipula); recuperación ante fallos; reglas de integridad</td><td>Hay que transformar (de ahí el <b>impedance mismatch</b>); más infraestructura</td></tr>
          </tbody>
        </table></div>

        <div class="callout tip">
          <div class="callout-title">💡 El hilo conductor de todo el parcial</div>
          <p>Fijate en la columna de ventajas: <b>prevalencia y BD de objetos no transforman los datos</b> (ganan performance,
          pierden interoperabilidad). La <b>BD relacional sí transforma</b> (gana interoperabilidad, paga el
          <a class="inline" data-go="p2-orm">impedance mismatch</a>). Toda la unidad de ORM existe para pagar ese costo.</p>
        </div>

        <h2>Problemas de la persistencia</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Problemas técnicos</h3>
            <ul>
              <li><b>Impedance mismatch:</b> el modelo de objetos y el relacional no se corresponden (identidad, tipos, cardinalidad, herencia).</li>
              <li><b>Transformación:</b> hay que convertir en cada ida y vuelta (costo de CPU y de código).</li>
              <li><b>Concurrencia:</b> dos usuarios tocando el mismo dato (bloqueos, lecturas sucias).</li>
              <li><b>Performance:</b> el acceso a disco/red es órdenes de magnitud más lento que la memoria.</li>
              <li><b>Acoplamiento:</b> si el dominio conoce SQL, cambiar de motor obliga a reescribirlo.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Cómo los mitigamos</h3>
            <ul>
              <li><b>ORM</b> + <b>hidratación</b>: la transformación la hace el framework.</li>
              <li><b>Patrón Repositorio</b> (+ DAO): el dominio no sabe cuál es el medio persistente.</li>
              <li><b>Caché</b> de primer y segundo nivel: no volver a ir al medio.</li>
              <li><b>Lazy loading</b>: traer sólo lo que se usa.</li>
              <li><b>Transacciones</b> e <b>integridad referencial</b>: las garantiza el motor.</li>
            </ul>
          </div>
        </div>

        <h2>Patrón Repositorio (y DAO)</h2>
        <div class="callout key">
          <div class="callout-title">🔑 Dato de examen</div>
          <p>El <b>Repositorio no es un patrón de diseño: es un patrón arquitectónico</b>. Se apoya en el estilo
          <b>en capas</b> y ayuda a una buena <b>separación de concerns</b>: propone una <b>capa de persistencia</b>
          que se encarga del acceso a los datos.</p>
        </div>
        <p>Cada <b>Repository</b> debería poder: <code>agregar(obj)</code>, <code>modificar(obj)</code>,
        <code>eliminar(obj)</code>, <code>buscar(...)</code>, <code>buscarTodos()</code>.</p>
        <p>Puede implementarse con <b>DAOs</b> (<i>Data Access Object</i>): los DAO son los responsables
        <b>reales</b> de acceder a los datos, y pueden ir contra una BD relacional, una no relacional, memoria o archivos.
        El repositorio puede combinarse con <b>Strategy</b> para elegir el DAO concreto: para los clientes del
        repositorio es indistinto cuál se use — <b>no deberían enterarse cuál es el medio persistente</b>.</p>
        ${APP.uml(`classDiagram
    class ServicioDeAplicacion
    class PedidoRepository { <<interface>> }
    class PedidoRepositoryImpl
    class PedidoDAO { <<interface>> }
    class PedidoDAOHibernate
    class PedidoDAOMemoria
    class PedidoDAOMongo
    ServicioDeAplicacion --> PedidoRepository : usa
    PedidoRepository <|.. PedidoRepositoryImpl : implementa
    PedidoRepositoryImpl o--> PedidoDAO : delega (Strategy)
    PedidoDAO <|.. PedidoDAOHibernate
    PedidoDAO <|.. PedidoDAOMemoria
    PedidoDAO <|.. PedidoDAOMongo`, "Repositorio + DAO + Strategy")}

        <h2>Ejercicio</h2>
        <div id="p2pQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2pQuiz"), [
        { n: 1, topic: "Concepto", type: "mc", q: "Definición de persistencia según la cátedra:", options: [
          { t: "Que el estado del sistema sobreviva más allá del proceso que lo creó", ok: true },
          { t: "Guardar todo en una base de datos relacional", ok: false },
          { t: "Que los datos estén normalizados", ok: false },
        ], explain: "“Sobrevivir más allá de una única ejecución”, almacenando el estado en un medio persistente." },
        { n: 2, topic: "Prevalencia", type: "mc", q: "¿Cuál es la principal <b>desventaja</b> de la prevalencia?", options: [
          { t: "Falta de interoperabilidad y necesidad de mucha memoria", ok: true },
          { t: "Mala performance", ok: false },
          { t: "No soporta transacciones", ok: false },
        ], explain: "Prevalencia tiene alta performance y maneja transacciones; lo que pierde es interoperabilidad (guarda en el formato propio del aplicativo) y exige memoria para todo el sistema." },
        { n: 3, topic: "Repositorio", type: "vf", q: "El patrón Repositorio es un patrón de diseño de la GoF.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Es un patrón ARQUITECTÓNICO, no de diseño. Se apoya en el estilo en capas." },
        { n: 4, topic: "BD de objetos", type: "mc", q: "La ventaja de una base de datos orientada a objetos es…", options: [
          { t: "No transformar los datos → mayor performance", ok: true },
          { t: "Su interoperabilidad entre lenguajes", ok: false },
          { t: "Que cumple las formas normales", ok: false },
        ], explain: "Justamente su desventaja es la interoperabilidad: cada BDOO está atada a un lenguaje." },
        { n: 5, topic: "Estrategias", type: "open", q: "Te piden “qué estrategia de persistencia propone para un sistema de testing automatizado y por qué”. Respondé en 2 renglones.", answer: "Persistencia en memoria: es la estrategia que la cátedra asocia a los tests. Permite levantar el estado completo sin infraestructura, con máxima velocidad, y como el dato no debe sobrevivir al test, su volatilidad no es un problema. Implementación típica: un DAO en memoria detrás del repositorio, que se intercambia por el real en producción (Strategy + inyección de dependencias)." },
      ]);
    },
  });
})();
