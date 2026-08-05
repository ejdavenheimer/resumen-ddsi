/* ============================================================
   Resumen imprimible — hojas A4 para llevar al parcial (papel)
   Autocontenido: ejemplos propios, sin remitir a enunciados.
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  // mini-diagrama de patrón con flechas etiquetadas
  function pd(nombre, def) {
    return '<div class="pd"><b>' + nombre + "</b>" + APP.uml(def) + "</div>";
  }

  APP.register({
    id: "resumen-imprimible",
    title: "🖨️ Resumen imprimible",
    tag: "🖨️",
    group: "Resumen imprimible",
    resumen: "Todo lo esencial para llevar en papel (A4)",
    keywords: ["resumen", "imprimible", "hoja", "chuleta", "cheatsheet", "papel", "parcial", "llevar", "pdf"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · el parcial permite apuntes en papel</div>
          <h1>Resumen imprimible (A4)</h1>
          <p class="lead">Todo lo esencial condensado, con ejemplos propios. Descargalo en PDF y llevalo impreso.</p>
        </div>
        <div class="callout key resumen-print-btn">
          <div class="callout-title">📥 Cómo bajarlo en PDF</div>
          <ol style="margin:.3rem 0 .6rem">
            <li>Tocá <b>“Descargar PDF (A4)”</b>.</li>
            <li>Destino <b>“Guardar como PDF”</b>, tamaño <b>A4</b>.</li>
            <li>Activá <b>“Gráficos de fondo”</b> para que se vean los recuadros de color.</li>
          </ol>
          <button class="btn" id="rpPrint" type="button">📥 Descargar PDF (A4)</button>
        </div>

        <!-- ===== HOJA 1: PATRONES — cuándo + justificar ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 1 · PATRONES: cuándo y cómo justificar</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Patrón</th><th>Cuándo (palabras del enunciado)</th><th>Frase para justificar</th></tr></thead>
            <tbody>
              <tr><td><b>Strategy</b><br>(Estrategia)</td><td>“distintas formas de calcular/procesar”, “pueden agregarse más”, “se elige en ejecución”</td><td>“Usé Strategy: hay algoritmos alternativos y pueden sumarse más → cada uno una clase, agregar no toca lo existente (Abierto/Cerrado), bajo acoplamiento.”</td></tr>
              <tr><td><b>State</b><br>(Estado)</td><td>“ciclo de vida”, “estados”, “según el estado se puede/no”, “trazabilidad”</td><td>“Usé State: el objeto pasa por estados y responde distinto en cada uno; cada estado encapsula sus transiciones, sin if por estado.”</td></tr>
              <tr><td><b>Template Method</b><br>(Método plantilla)</td><td>“mismo proceso con variantes”, “esqueleto fijo, algunos pasos cambian”</td><td>“Usé Template Method: el esqueleto es fijo y sólo varían pasos; la clase base define el orden y las subclases los pasos, sin duplicar.”</td></tr>
              <tr><td><b>Adapter</b><br>(Adaptador)</td><td>“integrar servicio externo”, “API de un tercero”, “no es nuestro”, “pasarela de pago”</td><td>“Usé Adapter: integro algo externo que no controlo; el dominio depende de mi interfaz y cambiar de proveedor es otro adapter (Inversión de Dependencias).”</td></tr>
              <tr><td><b>Facade</b><br>(Fachada)</td><td>“punto de entrada único”, “coordinar varios servicios”, “gestiona el caso de uso”</td><td>“Usé Facade: el cliente conoce sólo la fachada, que coordina el subsistema; baja el acoplamiento y reutiliza el caso de uso.”</td></tr>
              <tr><td><b>Builder</b><br>(Constructor)</td><td>“muchos atributos opcionales”, “se arma paso a paso”, “el usuario elige qué incluir”</td><td>“Usé Builder: el objeto tiene muchos atributos opcionales; lo construyo paso a paso y valido antes de crearlo.”</td></tr>
              <tr><td><b>Singleton</b><br>(Instancia única)</td><td>“una única instancia”, “compartida por todos”, “configuración global”, “un único pool/logger”</td><td>“Usé Singleton: debe haber una única instancia compartida (constructor privado + getInstance). Mejor aún, inyectada, sin estado global.”</td></tr>
              <tr><td><b>Simple Factory</b><br>(Fábrica simple)</td><td>“según el tipo se crea”, “instanciar según”, “centralizar la creación”</td><td>“Usé una Fábrica: centralizo la decisión de qué crear según el tipo; el resto depende de la abstracción, no de clases concretas.”</td></tr>
              <tr><td><b>Factory Method</b><br>(Método fábrica)</td><td>“cada variante del creador produce su propio producto”</td><td>“Usé Factory Method: la clase base define el algoritmo y cada subclase decide qué producto crear, sin duplicar el flujo común.”</td></tr>
              <tr><td><b>Command</b><br>(Comando)</td><td>“configurar acciones”, “encolar”, “programar”, “deshacer”, “auditar”</td><td>“Usé Command: la acción es un objeto con su configuración; se puede encolar, programar y auditar, desacoplando quien la pide de quien la ejecuta.”</td></tr>
              <tr><td><b>Observer</b><br>(Observador)</td><td>“notificar automáticamente”, “varios deben enterarse” (misma app)</td><td>“Usé Observer: al cambiar X varios componentes reaccionan; el sujeto no conoce a los observadores concretos y se agregan sin modificarlo.”</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Regla de oro:</b> si no podés señalar la frase del enunciado que justifica el patrón, sacalo (uno de más = sobreingeniería = resta).</p>
          <p class="mini"><b>Desempates:</b> Strategy vs State → ¿quién decide el cambio? (el cliente / el objeto solo). Adapter vs Facade → traducir / simplificar. Command vs Strategy → ¿se configura/guarda/deshace? Observer (misma app) vs Publicación-Suscripción (servicios separados, con broker). Builder (opciones/pasos) vs Fábrica (tipos/variantes).</p>
        </section>

        <!-- ===== HOJA 2: PATRONES — ventajas y desventajas ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 2 · PATRONES: ventajas y desventajas</span>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Patrón</th><th>✅ Ventajas</th><th>⚠️ Desventajas</th></tr></thead>
            <tbody>
              <tr><td><b>Strategy</b></td><td>Agrega variantes sin tocar lo demás (Abierto/Cerrado); elimina el <i>if</i> por tipo; testeable por separado.</td><td>Más clases; el cliente debe saber qué estrategia elegir.</td></tr>
              <tr><td><b>State</b></td><td>Elimina el <i>if</i> por estado; cada estado aislado con sus reglas; fácil sumar estados.</td><td>Muchas clases; es excesivo si el estado es sólo un dato (ahí basta un enum).</td></tr>
              <tr><td><b>Template Method</b></td><td>Reutiliza el esqueleto, evita duplicar; garantiza el orden de los pasos.</td><td>Usa herencia (rígida, una sola por clase); malo si varían muchos pasos.</td></tr>
              <tr><td><b>Adapter</b></td><td>Integra lo externo sin tocar el dominio; cambiar de proveedor es otro adapter; testeable con dobles.</td><td>Una capa más de indirección.</td></tr>
              <tr><td><b>Facade</b></td><td>Baja el acoplamiento; da un punto de entrada simple; reutiliza el caso de uso.</td><td>Puede volverse una “clase Dios” si concentra la lógica en vez de delegar.</td></tr>
              <tr><td><b>Builder</b></td><td>Construcción legible paso a paso; valida antes de crear; evita constructores enormes.</td><td>Más código; innecesario con pocos atributos.</td></tr>
              <tr><td><b>Singleton</b></td><td>Una sola instancia compartida; acceso global cómodo.</td><td>Estado global, difícil de testear (se considera anti-patrón); mejor inyectar la instancia única.</td></tr>
              <tr><td><b>Simple Factory</b></td><td>Centraliza la creación; el cliente no conoce clases concretas.</td><td>Sigue habiendo un <i>switch</i> en un punto que hay que tocar al agregar tipos.</td></tr>
              <tr><td><b>Factory Method</b></td><td>La creación varía por subclase sin duplicar el algoritmo (Abierto/Cerrado).</td><td>Más subclases y complejidad.</td></tr>
              <tr><td><b>Command</b></td><td>Acciones configurables, encolables, deshacer/rehacer, auditar; desacopla emisor de ejecutor.</td><td>Muchas clases pequeñas.</td></tr>
              <tr><td><b>Observer</b></td><td>El sujeto no conoce a los observadores; se suman/quitan sin tocarlo.</td><td>Cascadas difíciles de seguir; fugas de memoria si no se desuscriben.</td></tr>
            </tbody>
          </table></div>
        </section>

        <!-- ===== HOJA 3: PATRONES DIBUJADOS ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 3 · CÓMO SE DIBUJA CADA PATRÓN (mirá la palabra sobre cada flecha)</span>
          <div class="patrones-marco"><div class="patrones-grid">
            ${pd("Strategy", `classDiagram
    class Contexto
    class Estrategia { <<interface>> }
    class ConcretaA
    class ConcretaB
    Contexto --> Estrategia : tiene
    Estrategia <|.. ConcretaA : implementa
    Estrategia <|.. ConcretaB : implementa`)}
            ${pd("State", `classDiagram
    class Contexto
    class Estado { <<interface>> }
    class EstadoA
    class EstadoB
    Contexto --> Estado : tiene (actual)
    Estado <|.. EstadoA : implementa
    Estado <|.. EstadoB : implementa
    EstadoA ..> EstadoB : transiciona a`)}
            ${pd("Template Method", `classDiagram
    class Base { <<abstract>> }
    class ConcretaA
    class ConcretaB
    Base <|-- ConcretaA : hereda de
    Base <|-- ConcretaB : hereda de`)}
            ${pd("Adapter", `classDiagram
    class Cliente
    class Objetivo { <<interface>> }
    class Adapter
    class Externo
    Cliente --> Objetivo : usa
    Objetivo <|.. Adapter : implementa
    Adapter --> Externo : envuelve`)}
            ${pd("Facade", `classDiagram
    class Cliente
    class Fachada
    class SubA
    class SubB
    Cliente --> Fachada : usa
    Fachada --> SubA : coordina
    Fachada --> SubB : coordina`)}
            ${pd("Builder", `classDiagram
    class Cliente
    class Builder
    class Producto
    Cliente --> Builder : usa
    Builder ..> Producto : construye`)}
            ${pd("Singleton", `classDiagram
    class Singleton {
      -instancia$
      -constructor()
      +getInstance()$
    }
    Singleton --> Singleton : instancia única`)}
            ${pd("Simple Factory", `classDiagram
    class Cliente
    class Fabrica
    class Producto { <<interface>> }
    class ProductoA
    Cliente --> Fabrica : usa
    Fabrica ..> Producto : crea
    Producto <|.. ProductoA : implementa`)}
            ${pd("Factory Method", `classDiagram
    class Creador { <<abstract>> }
    class CreadorConc
    class Producto
    Creador <|-- CreadorConc : hereda de
    CreadorConc ..> Producto : crea`)}
            ${pd("Command", `classDiagram
    class Invocador
    class Comando { <<interface>> }
    class ComandoConc
    class Receptor
    Invocador --> Comando : tiene
    Comando <|.. ComandoConc : implementa
    ComandoConc --> Receptor : llama a`)}
            ${pd("Observer", `classDiagram
    class Sujeto
    class Observador { <<interface>> }
    class ObsA
    class ObsB
    Sujeto o-- Observador : notifica a
    Observador <|.. ObsA : implementa
    Observador <|.. ObsB : implementa`)}
          </div></div>
          <p class="mini"><b>Referencia de flechas:</b> triángulo vacío línea llena = <b>hereda de</b> · triángulo vacío línea punteada = <b>implementa</b> · flecha simple = <b>tiene / usa</b> · rombo = <b>compuesto por</b> · punteada = <b>usa/crea</b>. La palabra sobre cada flecha aclara la relación.</p>
        </section>

        <!-- ===== HOJA 4: SOLID + cualidades + smells ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 4 · SOLID + CUALIDADES + SMELLS</span>
          <h2>Principios SOLID (nombre completo)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Letra</th><th>Nombre completo</th><th>Qué dice</th><th>Se huele cuando…</th></tr></thead>
            <tbody>
              <tr><td><b>S</b></td><td>Responsabilidad Única</td><td>Una clase, una sola razón para cambiar</td><td>Una clase guarda en la base + arma PDF + manda mail</td></tr>
              <tr><td><b>O</b></td><td>Abierto/Cerrado</td><td>Abierto a extensión, cerrado a modificación</td><td>Cadena de if/switch por tipo que crece</td></tr>
              <tr><td><b>L</b></td><td>Sustitución de Liskov</td><td>El subtipo reemplaza al padre sin romper</td><td>Un método heredado tira “no soportado”</td></tr>
              <tr><td><b>I</b></td><td>Segregación de Interfaces</td><td>Muchas interfaces chicas mejor que una gigante</td><td>Media clase implementa métodos vacíos</td></tr>
              <tr><td><b>D</b></td><td>Inversión de Dependencias</td><td>Depender de abstracciones, no de detalles</td><td>El dominio hace <i>new</i> de infraestructura</td></tr>
            </tbody>
          </table></div>
          <h2>Cualidades de diseño</h2>
          <ul class="mini">
            <li><b>Bajo acoplamiento:</b> cada clase depende de lo mínimo, y de abstracciones.</li>
            <li><b>Alta cohesión:</b> lo que hace una clase tiene todo que ver entre sí.</li>
            <li>Encapsulamiento · Abstracción · Sin redundancia (no repetir) · Extensibilidad · Reutilización.</li>
            <li>Frase de oro para justificar: <i>“busqué bajo acoplamiento y alta cohesión”.</i></li>
          </ul>
          <h2>Code smells frecuentes</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Smell</th><th>Qué es</th><th>Se arregla con</th></tr></thead>
            <tbody>
              <tr><td>Clase Dios</td><td>Hace demasiadas cosas</td><td>Extraer clases (Responsabilidad Única)</td></tr>
              <tr><td>Switch por tipo</td><td>if/else sobre tipos que crece</td><td>Polimorfismo (Strategy/State/Fábrica) — Abierto/Cerrado</td></tr>
              <tr><td>Objeto anémico</td><td>Sólo getters/setters, sin comportamiento</td><td>Mover comportamiento a la entidad</td></tr>
              <tr><td>Envidia de atributos</td><td>Un método usa más datos de otra clase</td><td>Mover el método a esa clase</td></tr>
              <tr><td>Obsesión por primitivos</td><td>String/int para todo (dni, dinero)</td><td>Objetos de Valor (inmutables)</td></tr>
              <tr><td>Lista larga de parámetros</td><td>Constructor con muchos parámetros</td><td>Builder</td></tr>
            </tbody>
          </table></div>
        </section>

        <!-- ===== HOJA 5: Calidad + HTTP ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 5 · ATRIBUTOS DE CALIDAD + HTTP</span>
          <h2>Atributos de calidad (requerimientos NO funcionales)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Atributo</th><th>Suena como…</th><th>Se logra con</th></tr></thead>
            <tbody>
              <tr><td>Disponibilidad</td><td>“no puede caerse”, “SLA 99,9%”</td><td>Redundancia, réplicas, balanceo, respaldos</td></tr>
              <tr><td>Performance</td><td>“responder en &lt; 2 s”</td><td>Caché, índices, asíncrono</td></tr>
              <tr><td>Escalabilidad</td><td>“picos de tráfico”, “miles de usuarios”</td><td>Sin estado + escalar horizontal + colas</td></tr>
              <tr><td>Mantenibilidad</td><td>“agregar función con facilidad”</td><td>SOLID, patrones, bajo acoplamiento</td></tr>
              <tr><td>Seguridad</td><td>“hashear”, “datos confidenciales”</td><td>Cifrado, autenticación, control de acceso</td></tr>
              <tr><td>Usabilidad</td><td>“el usuario no debe esperar”</td><td>Asíncrono con aviso de progreso</td></tr>
              <tr><td>Interoperabilidad</td><td>“integrarse con el sistema X”</td><td>APIs REST, adapters, formatos estándar</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cualidad de diseño ≠ atributo de calidad.</b> La cualidad es del diseño (acoplamiento, cohesión); el atributo es del sistema en ejecución (disponibilidad, performance). <b>Trade-offs:</b> más seguridad ↓ performance; más disponibilidad ↑ costo; más consistencia ↓ disponibilidad.</p>
          <h2>HTTP — verbos</h2>
          <div class="table-wrap"><table class="data center">
            <thead><tr><th>Verbo</th><th>Hace</th><th>Idempotente</th><th>Éxito</th></tr></thead>
            <tbody>
              <tr><td>GET</td><td>Leer</td><td>Sí</td><td>200</td></tr>
              <tr><td>POST</td><td>Crear</td><td>No</td><td>201</td></tr>
              <tr><td>PUT</td><td>Reemplazar</td><td>Sí</td><td>200/204</td></tr>
              <tr><td>PATCH</td><td>Actualizar parcial</td><td>Depende</td><td>200</td></tr>
              <tr><td>DELETE</td><td>Eliminar</td><td>Sí</td><td>204</td></tr>
            </tbody>
          </table></div>
          <h2>HTTP — códigos que más se preguntan</h2>
          <ul class="mini">
            <li><b>200</b> OK · <b>201</b> Creado (+ Location) · <b>202</b> Aceptado = “lo proceso después” (el código del asincronismo) · <b>204</b> sin contenido</li>
            <li><b>400</b> request mal formado · <b>401</b> no sé quién sos (autenticación) · <b>403</b> te conozco y no podés (autorización) · <b>404</b> no existe</li>
            <li><b>409</b> conflicto con el estado actual · <b>422</b> bien formado pero viola una regla · <b>500</b> error nuestro · <b>503</b> caído/saturado</li>
          </ul>
          <p class="mini"><b>REST:</b> recursos = sustantivos en plural (<code>/facturas/12</code>); la acción la da el verbo; filtros en la query (<code>?estado=IMPAGA</code>). Idempotencia = reintentar sin duplicar (clave con colas y pagos).</p>
        </section>

        <!-- ===== HOJA 6: Arquitectura ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 6 · ARQUITECTURA</span>
          <h2>Qué es y sus entradas</h2>
          <p class="mini"><b>Arquitectura</b> = decisiones estructurales importantes y caras de cambiar (qué componentes hay, cómo se relacionan). <b>Entradas del diseño:</b> requerimientos <b>funcionales</b> (qué hace), <b>no funcionales</b> (cómo se comporta = atributos de calidad) y <b>restricciones técnicas y de negocio</b> (límites impuestos: presupuesto, normativa, “la API externa ya existe”).</p>
          <h2>Componentes y cuándo usarlos</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Necesidad</th><th>Respuesta</th></tr></thead>
            <tbody>
              <tr><td>“puede tardar” / “picos de tráfico”</td><td><b>Asíncrono con cola/broker</b> (amortigua) + responder <b>202</b> + escalar consumidores</td></tr>
              <tr><td>“varios servicios deben enterarse” (separados)</td><td><b>Publicación-Suscripción</b> sobre broker</td></tr>
              <tr><td>“varios componentes reaccionan” (misma app)</td><td><b>Observer</b></td></tr>
              <tr><td>“integrar servicio externo que no controlo”</td><td><b>Adapter</b> + interfaz propia del dominio</td></tr>
              <tr><td>“tarea periódica / automática / al vencer”</td><td><b>Cron / tarea programada</b> (cuidar ejecución única si hay varias instancias)</td></tr>
              <tr><td>“servir <b>imágenes o videos</b>, bajar transferencia del servidor”</td><td><b>Object storage + CDN</b> (el backend sólo entrega la URL, nunca el archivo)</td></tr>
              <tr><td>“se consulta mucho lo mismo, sin cambios”</td><td><b>Caché</b> (guardar el resultado un tiempo para no recalcular)</td></tr>
              <tr><td>“muchos usuarios a la vez, repartir la carga”</td><td><b>Balanceador de carga</b> + varias instancias del servicio</td></tr>
              <tr><td>“si el servicio externo se cae, arrastra todo”</td><td><b>Circuit breaker</b> (corta las llamadas y falla rápido, evita la caída en cascada)</td></tr>
              <tr><td>“web + mobile” (multi-canal)</td><td>Varios <b>clientes sobre la misma API REST</b> (Cliente-Servidor)</td></tr>
              <tr><td>“gestión de usuarios / roles”</td><td>Control de acceso por <b>rol</b> (RBAC) en el backend</td></tr>
            </tbody>
          </table></div>
          <h2>Qué es cada componente (en criollo)</h2>
          <ul class="mini">
            <li><b>CDN</b> (red de distribución de contenido): red de servidores repartidos por el mundo que guardan copias de archivos estáticos (imágenes, videos, JS) y se los sirven al usuario desde el <b>más cercano</b> → más rápido y descarga al servidor principal.</li>
            <li><b>Object storage</b>: almacén de archivos (fotos, videos, PDFs) <b>fuera</b> de la base de datos. La base guarda sólo la <b>URL</b> del archivo, no el archivo. (Nunca metas videos/imágenes dentro de la base.)</li>
            <li><b>Caché</b>: memoria rápida que guarda un resultado ya calculado por un tiempo, para no volver a calcularlo/consultarlo. Baja latencia y descarga la base. El costo: puede quedar algo desactualizado.</li>
            <li><b>Balanceador de carga</b>: reparte las peticiones entre varias copias del servicio, para aguantar más usuarios y no depender de una sola máquina.</li>
            <li><b>Broker / cola de mensajes</b>: intermediario que recibe mensajes y los entrega a quien corresponda; desacopla, aguanta picos y reintenta. (RabbitMQ, Kafka.)</li>
            <li><b>Circuit breaker</b> (“cortacircuitos”): cuando un servicio externo falla repetido, deja de llamarlo un rato (falla rápido) para no arrastrar todo el sistema; después reintenta.</li>
            <li><b>Punto único de falla</b>: un componente que, si se cae, tira todo. Se elimina <b>duplicándolo</b> (redundancia) con reemplazo automático (failover).</li>
          </ul>
          <h2>Cómo se dibuja un Broker / Publicación-Suscripción</h2>
          <p class="mini">El <b>publicador</b> emite un evento; el <b>broker</b> lo entrega a todos los <b>suscriptores</b>. El publicador NO conoce a los suscriptores (por eso desacopla y se pueden sumar más sin tocarlo). Se usa entre <b>servicios separados</b>.</p>
          <div class="grid-2">
            <div class="uml">${APP.uml(`graph LR
    P["Publicador"] -->|publica evento| B[("Broker")]
    B -->|entrega| S1["Suscriptor 1"]
    B -->|entrega| S2["Suscriptor 2"]
    B -->|entrega| S3["Suscriptor 3"]
    style B fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Broker / Pub-Sub (entre servicios)")}</div>
            <div class="uml">${APP.uml(`classDiagram
    class Sujeto
    class Observador { <<interface>> }
    class ObsA
    class ObsB
    Sujeto o-- Observador : notifica a
    Observador <|.. ObsA : implementa
    Observador <|.. ObsB : implementa`, "Observer (misma app)")}</div>
          </div>
          <p class="mini"><b>Diferencia:</b> <b>Observer</b> = misma aplicación, el sujeto tiene la lista de observadores (en memoria). <b>Publicación-Suscripción (broker)</b> = servicios separados, con un broker en el medio, asincrónico, con reintentos. Misma idea (avisar a varios), distinta escala.</p>

          <h2>Sincronismo vs Asincronismo</h2>
          <ul class="mini">
            <li><b>Sincrónico</b> (HTTP directo): simple e inmediato, pero acopla en el tiempo (si el otro está lento/caído, te arrastra). Para lecturas rápidas.</li>
            <li><b>Asincrónico</b> (cola/broker): desacopla, amortigua picos, tolera fallos; a cambio, consistencia eventual y el resultado vuelve por webhook / consulta / notificación.</li>
            <li>Los brokers entregan <b>al menos una vez</b> → el consumidor debe ser <b>idempotente</b> (deduplicar).</li>
            <li><b>Interfaz entrante</b> = algo nos llama (nuestro endpoint, un webhook). <b>Interfaz saliente</b> = nosotros llamamos a otro (con Adapter).</li>
          </ul>
          <h2>Capas (dependen hacia adentro)</h2>
          <p class="mini"><b>Presentación (Controller)</b> → <b>Aplicación (Service)</b> → <b>Dominio (reglas)</b> → <b>Infraestructura (Repository/Adapter)</b>. El dominio no conoce HTTP ni SQL. La interfaz del repositorio la define el dominio; la implementación, infraestructura (Inversión de Dependencias + inyección).</p>
          <h2>Siglas</h2>
          <p class="mini"><b>REST</b> = API sobre HTTP con recursos · <b>IDM</b> = gestor de identidades · <b>SSO</b> = inicio de sesión único · <b>RBAC</b> = acceso por rol · <b>ABAC</b> = acceso por atributos/contexto · <b>WAF</b> = firewall de aplicaciones web · <b>CIA</b> = Confidencialidad·Integridad·Disponibilidad · <b>DER</b> = diagrama entidad-relación · <b>MQTT/AMQP</b> = protocolos de mensajería.</p>
        </section>

        <!-- ===== HOJA 7: Flujo completo en pseudocódigo ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 7 · FLUJO COMPLETO (pseudocódigo): controller → service → dominio → repo</span>
          <p class="mini">Ejemplo autocontenido: <b>registrar el pago de una factura</b>. Muestra las capas, la devolución de status y el manejo de errores. (Es pseudocódigo, no compila; en el parcial escribís algo así.)</p>
          ${APP.code(`// ── CAPA PRESENTACIÓN (Controller): traduce HTTP ↔ objetos ──
POST /facturas/{id}/pagos   recibe (id, datosDelPago)

controller.pagar(id, datos):
    // 1) validar el FORMATO de la entrada (no reglas de negocio)
    si datos.monto es vacío o no es número:
        responder 400 (Bad Request)   // el request está mal armado

    intentar:
        resultado = servicioDePagos.pagar(id, datos)   // llama al service
        responder 201 (Created) con resultado           // salió bien
    capturar FacturaNoEncontrada:
        responder 404 (Not Found)
    capturar FacturaYaPagada  o  MontoNoCoincide:
        responder 409 (Conflict)     // choca con el estado/regla
    capturar cualquierOtroError:
        loguear el error
        responder 500 (Internal Server Error)


// ── CAPA APLICACIÓN (Service): orquesta el caso de uso ──
servicioDePagos.pagar(id, datos):
    // 2) traer lo que hace falta desde el repositorio
    factura = facturaRepositorio.buscarPorId(id)
    si factura es nula:
        lanzar FacturaNoEncontrada

    // 3) las REGLAS las decide el DOMINIO, no el service
    factura.registrarPago(datos.monto)   // puede lanzar reglas de dominio

    // 4) cobrar por la pasarela externa (interfaz saliente = Adapter)
    resultado = pasarelaDePagos.cobrar(factura.total, datos.medio)

    // 5) persistir el nuevo estado y devolver
    facturaRepositorio.guardar(factura)
    devolver { codigo: factura.codigo, estado: factura.estado }


// ── CAPA DOMINIO (la entidad protege sus reglas) ──
factura.registrarPago(monto):
    si this.estado == PAGADA:
        lanzar FacturaYaPagada          // regla de negocio
    si monto != this.total:
        lanzar MontoNoCoincide          // regla de negocio
    this.estado = PAGADA


// ── CAPA INFRAESTRUCTURA (Repository): sólo persiste ──
interface FacturaRepositorio:
    buscarPorId(id) -> Factura
    guardar(factura)`, { lang: "text", label: "Flujo completo con status y errores", collapse: false })}
          <p class="mini"><b>Idea clave:</b> el <b>controller</b> traduce a HTTP y mapea errores a <b>códigos</b> (400 formato, 404 no existe, 409 regla, 201 ok, 500 inesperado). El <b>service</b> orquesta. El <b>dominio</b> valida las reglas (y lanza errores propios). El <b>repositorio</b> sólo guarda/trae. El dominio nunca conoce HTTP.</p>
        </section>

        <!-- ===== HOJA 8: Seguridad (definiciones de la cátedra) ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 8 · SEGURIDAD DE LA INFORMACIÓN (definiciones de la cátedra)</span>
          <p class="mini"><b>Seguridad de la información:</b> conjunto de procesos, políticas, prácticas y tecnologías para proteger la <b>confidencialidad, integridad y disponibilidad</b> de la información (digital o física) frente a accesos no autorizados, alteraciones, pérdidas o destrucción.</p>
          <h2>Tríada de la seguridad</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Principio</th><th>Qué asegura</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td><b>Confidencialidad</b></td><td>Proteger la información de accesos no autorizados</td><td>Encriptación de emails</td></tr>
              <tr><td><b>Integridad</b></td><td>Que la información no sea modificada</td><td>Control de versiones y hash</td></tr>
              <tr><td><b>Disponibilidad</b></td><td>Que esté accesible cuando se necesite</td><td>Backups y redundancia</td></tr>
            </tbody>
          </table></div>
          <h2>Autenticación vs Autorización</h2>
          <p class="mini"><b>Autenticación:</b> confirma que el usuario es quien dice ser (valida la identidad) — <i>“¿quién sos?”</i>. Ocurre <b>antes</b>. Ej: contraseña, biometría, token. → <b>Autorización:</b> a un usuario ya autenticado, le otorga permiso para acceder a un recurso — <i>“¿qué podés hacer?”</i>. Ej: roles, permisos, políticas.</p>
          <p class="mini"><b>Autenticación Multifactor (MFA):</b> dos o más factores independientes. <b>Conocimiento</b> (algo que sabés: contraseña) · <b>Posesión</b> (algo que tenés: token, app) · <b>Inherencia</b> (algo que sos: biometría).</p>
          <h2>Mecanismos de seguridad</h2>
          <p class="mini">Técnica o herramienta para fortalecer confidencialidad, integridad y/o disponibilidad. Se clasifican en <b>Preventivos</b> (actúan antes, detienen), <b>Detectivos</b> (revelan la presencia de agentes no deseados, avisan y registran) y <b>Correctivos</b> (actúan luego del hecho, corrigen consecuencias).</p>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Característica</th><th>Hashing</th><th>Cifrado</th></tr></thead>
            <tbody>
              <tr><td>Propósito</td><td>Verificar <b>integridad</b> (y guardar contraseñas)</td><td>Proteger la <b>confidencialidad</b></td></tr>
              <tr><td>Direccionalidad</td><td><b>Unidireccional</b> (no reversible)</td><td><b>Bidireccional</b> (cifrar y descifrar)</td></tr>
              <tr><td>Claves</td><td>No usa (se le suma <i>salt</i>)</td><td>Usa clave para cifrar/descifrar</td></tr>
              <tr><td>Ejemplos</td><td>SHA-256, SHA-3, MD5 (obsoleto)</td><td>AES (simétrico), RSA (asimétrico)</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Cifrado:</b> transforma texto plano en texto cifrado con algoritmos; sólo con la clave se accede. Aplica a datos <b>en reposo</b> (archivos, base) y <b>en tránsito</b> (redes). <b>Simétrico</b> = misma clave (AES); <b>Asimétrico</b> = par pública/privada (RSA).</p>
          <h2>Modelos de control de acceso</h2>
          <p class="mini"><b>RBAC (por roles):</b> las políticas se basan en roles (colecciones de permisos); a los usuarios se les asignan roles. Más simple, para permisos bien definidos. <b>ABAC (por atributos):</b> se basa en atributos del usuario, recurso, acción y entorno. Más flexible y consciente del contexto (ej: “puede acceder si pertenece al departamento de sistemas”).</p>
          <h2>JWT · Componentes · OWASP · Normas</h2>
          <ul class="mini">
            <li><b>JWT (JSON Web Token, RFC 7519):</b> transmite información segura entre dos partes como JSON. 3 partes: <b>Header</b> (algoritmo), <b>Payload</b> (claims: id, rol, expiración) y <b>Firma</b> (verifica que no fue alterado). Ventaja: autocontenido (no consulta la base en cada request). <b>Precaución: no va cifrado, sólo Base64 → no metas datos sensibles; usá HTTPS; controlá la expiración.</b></li>
            <li><b>SSO (Single Sign-On):</b> acceder a múltiples sistemas con una sola credencial. <b>IDM (Identity Management):</b> políticas y tecnologías para gestionar identidades digitales y su acceso. <b>WAF (Web Application Firewall):</b> firewall que filtra/bloquea tráfico HTTP malicioso (SQLi, XSS, CSRF) sin tocar el código.</li>
            <li><b>OWASP Top 10</b> (riesgos en apps web): 1) pérdida de control de acceso · 2) fallos criptográficos · 3) inyección · 4) diseño inseguro · 5) mala configuración · 6) componentes vulnerables/obsoletos · 7) fallos de autenticación · 8) fallos de integridad · 9) fallos de registro/monitoreo · 10) falsificación de solicitudes del servidor (SSRF).</li>
            <li><b>Desarrollo seguro:</b> diseñar/codificar/probar minimizando vulnerabilidades desde el inicio. Principios: <i>seguridad desde el diseño</i>, validar entradas y salidas, manejo seguro de errores, criptografía bien usada, dependencias controladas, autenticación/autorización robusta, auditoría y trazabilidad, <b>menor privilegio</b>. <b>Seguridad en dependencias:</b> el código de terceros vulnerable compromete toda la app.</li>
            <li><b>Normas:</b> ISO/IEC 27001 (gestión de seguridad de la información), PCI DSS (datos de tarjetas), OWASP.</li>
          </ul>
        </section>

        <!-- ===== HOJA 9: Notación de diagramas + Modelo de datos ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 9 · NOTACIÓN DE DIAGRAMAS + MODELO DE DATOS</span>
          <h2>Qué es cada flecha (diagrama de clases)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Relación</th><th>Se dibuja</th><th>Significa</th></tr></thead>
            <tbody>
              <tr><td>Herencia</td><td>Línea llena + triángulo <b>vacío</b> ◁</td><td>“es un/a” / hereda de</td></tr>
              <tr><td>Realización</td><td>Línea <b>punteada</b> + triángulo vacío ◁</td><td>implementa una interfaz</td></tr>
              <tr><td>Composición</td><td>Rombo <b>lleno</b> ◆</td><td>parte-todo; la parte no vive sin el todo</td></tr>
              <tr><td>Agregación</td><td>Rombo <b>vacío</b> ◇</td><td>“tiene”, pero la parte vive por su cuenta</td></tr>
              <tr><td>Asociación</td><td>Línea (con flecha si es dirigida) →</td><td>“conoce a / tiene” (de atributo)</td></tr>
              <tr><td>Dependencia</td><td>Línea punteada + flecha abierta ⇢</td><td>“usa” (parámetro/variable local)</td></tr>
            </tbody>
          </table></div>
          <p class="mini">Multiplicidad: <code>1</code>, <code>0..1</code>, <code>*</code>, <code>1..*</code>. Nombrá las asociaciones si hay dos entre las mismas clases.</p>
          <h2>Componente (bola-socket) y Nodo (cubo)</h2>
          <div class="uml-svg-wrap">${APP.svgBallSocket("Consume", "Provee", "IServicio")}</div>
          <p class="mini"><b>Bolita ●</b> = interfaz <b>PROVISTA</b> (ofrece el servicio). <b>Semicírculo (</b> = interfaz <b>REQUERIDA</b> (lo consume). El semicírculo del consumidor abraza la bolita del proveedor. El <b>nodo de despliegue</b> es un <b>cubo 3D</b> (no una caja), con los artefactos adentro y el <b>protocolo</b> sobre cada línea.</p>
          <div class="callout warn" style="margin-top:.4rem">
            <div class="callout-title">⚠️ Modelo de datos — verificá si entra</div>
            <p class="mini">En el <b>listado de contenidos</b> del parcial <b>no figuran bases de datos</b>, pero la convocatoria del examen lista “Modelo de datos” como una de las 4 secciones. <b>Confirmá con la cátedra.</b> Si entra, y como aún no vieron bases de datos, seguramente sea un <b>DER básico</b> (entidad-relación), no algo avanzado.</p>
          </div>
          <h2>Modelo de datos — lo básico</h2>
          <ul class="mini">
            <li><b>Entidad</b> = tabla (un rectángulo). Sus <b>atributos</b> = columnas. La <b>clave primaria (PK)</b> identifica cada fila.</li>
            <li><b>Relación</b> entre entidades con una <b>clave foránea (FK)</b>. Indicá <b>cardinalidad</b> (1 a 1, 1 a N, N a M) y <b>modalidad</b> (opcional / obligatorio).</li>
            <li>Una relación <b>N a M</b> se resuelve con una <b>tabla intermedia</b> (ej: Usuario–Rol → tabla Usuario_Rol).</li>
            <li>Del diagrama de clases al DER: cada clase → una tabla; una colección (1 a N) → tabla hija con FK al padre.</li>
            <li>Restricciones útiles: <b>UNIQUE</b> (un código único), <b>NOT NULL</b> (obligatorio).</li>
          </ul>
        </section>

        <!-- ===== HOJA 10: Checklist final ===== -->
        <section class="hoja">
          <span class="hoja-num">HOJA 10 · CHECKLIST FINAL (revisá al terminar)</span>
          <h3>🧩 Modelado de Dominio</h3>
          <ul class="mini">
            <li>☐ Están <b>todas las clases</b> del enunciado (y ninguna inventada de más).</li>
            <li>☐ Las clases <b>saben hacer cosas</b> (no son sólo getters/setters — nada anémico).</li>
            <li>☐ Cada <b>patrón</b> tiene una <b>frase del enunciado</b> que lo justifica escrita al lado.</li>
            <li>☐ No metí patrones “por las dudas” (sobreingeniería resta).</li>
            <li>☐ Las <b>flechas</b> correctas (hereda ◁ / tiene → / compuesto ◆) y con <b>multiplicidad</b>.</li>
            <li>☐ Ciclo de vida → <b>State</b> · varias reglas ampliables → <b>Strategy</b> · externo → <b>Adapter</b>.</li>
            <li>☐ Justifiqué con los <b>4 elementos</b>: patrón + enunciado + principio SOLID + cualidad.</li>
          </ul>
          <h3>🏗️ Arquitectura I y II</h3>
          <ul class="mini">
            <li>☐ Están <b>todos los servicios</b> y los <b>externos</b> marcados como tales.</li>
            <li>☐ Cada conexión tiene su <b>protocolo</b> (HTTPS, AMQP, MQTT).</li>
            <li>☐ Si algo tarda o hay picos → <b>cola/broker</b> y expliqué que amortigua.</li>
            <li>☐ Nodos como <b>cubos</b>; componentes con <b>bola-socket</b> (quién consume a quién).</li>
            <li>☐ Componente de <b>seguridad</b> si hay usuarios/roles.</li>
            <li>☐ Respondí sync/async <b>con el porqué</b>; integraciones externas por <b>Adapter</b>; consumidores <b>idempotentes</b>.</li>
          </ul>
          <h3>🗄️ Modelo de Datos (si entra)</h3>
          <ul class="mini">
            <li>☐ Cada entidad con <b>PK</b>; relaciones con <b>FK</b>, <b>cardinalidad</b> y <b>modalidad</b>.</li>
            <li>☐ N a M resuelto con <b>tabla intermedia</b>.</li>
            <li>☐ Restricciones (<b>UNIQUE</b>, <b>NOT NULL</b>) donde corresponde.</li>
          </ul>
          <h3>🔐 Seguridad (si la piden)</h3>
          <ul class="mini">
            <li>☐ Autenticación (quién sos) vs Autorización (qué podés) bien separadas; roles (RBAC).</li>
            <li>☐ Contraseñas <b>hasheadas</b> (con salt), datos sensibles <b>cifrados</b>; HTTPS.</li>
            <li>☐ Auditoría/trazabilidad y menor privilegio.</li>
          </ul>
          <h3>✍️ General</h3>
          <ul class="mini">
            <li>☐ Repartí el tiempo: <b>60% en CADA sección</b> (ninguna en blanco).</li>
            <li>☐ Toda decisión <b>justificada por escrito</b> (el examen es escrito).</li>
            <li>☐ Releí el enunciado buscando requerimientos que no aparezcan en mi solución.</li>
          </ul>
        </section>
      `;

      el.querySelector("#rpPrint").addEventListener("click", function () { window.print(); });
      APP.rerenderMermaid(el);
    },
  });
})();
