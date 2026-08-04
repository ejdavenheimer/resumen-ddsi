/* ============================================================
   Resumen imprimible — 7 hojas para llevar al parcial (papel)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "resumen-imprimible",
    title: "🖨️ Resumen imprimible (7 hojas)",
    tag: "🖨️",
    group: "Resumen imprimible",
    resumen: "Todo lo esencial para llevar en papel",
    keywords: ["resumen", "imprimible", "hoja", "chuleta", "cheatsheet", "papel", "parcial", "llevar"],
    render(el) {
      el.innerHTML = `
        <div class="page-head resumen-intro">
          <div class="page-kicker">Para imprimir · el parcial permite apuntes en papel</div>
          <h1>Resumen imprimible — 7 hojas</h1>
          <p class="lead">Todo lo esencial condensado. Tocá imprimir y elegí “Guardar como PDF”. Cada hoja arranca en una página nueva.</p>
        </div>
        <div class="controls resumen-print-btn">
          <button class="btn" id="rpPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
          <span style="color:var(--ink-soft);font-size:.88rem">Se imprime sin el menú. Sugerencia: papel A4, márgenes normales.</span>
        </div>

        <!-- ================= HOJA 1 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 1 · PATRONES</span>
          <h2>Patrones de diseño — palabras clave y cómo justificar</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Patrón</th><th>Cuándo (palabras del enunciado)</th><th>Frase para justificar</th></tr></thead>
            <tbody>
              <tr><td><b>Strategy</b><br>(Estrategia)</td><td>“distintas formas de calcular/procesar”, “pueden agregarse más”, “se decide en runtime”, “reglas configurables”</td><td>“Usé Strategy: hay varios algoritmos alternativos y pueden agregarse más → cada uno una clase, agregar no modifica lo existente (Abierto/Cerrado), bajo acoplamiento.”</td></tr>
              <tr><td><b>State</b><br>(Estado)</td><td>“ciclo de vida”, “estados”, “según el estado se puede/no”, “trazabilidad de la evolución”</td><td>“Usé State: el objeto atraviesa un ciclo de vida y responde distinto según su estado; cada estado encapsula sus transiciones, evitando if por estado.”</td></tr>
              <tr><td><b>Adapter</b><br>(Adaptador)</td><td>“integrarse con servicio externo”, “API de un tercero”, “no es de nuestra propiedad”, “pasarela de pago”</td><td>“Usé Adapter: integro un servicio externo que no controlo; el dominio depende de mi interfaz y cambiar de proveedor es otro adapter (Inversión de Dependencias + Abierto/Cerrado).”</td></tr>
              <tr><td><b>Observer</b><br>(Observador)</td><td>“notificar automáticamente”, “varios deben enterarse” (misma app)</td><td>“Usé Observer: al cambiar X varios componentes deben reaccionar; el sujeto no conoce a los observadores concretos y se agregan sin modificarlo.”</td></tr>
              <tr><td><b>Publicación-Suscripción</b></td><td>“varios servicios deben enterarse”, “desplegados por separado”, “eventos”</td><td>“Usé Pub-Sub: los interesados están en servicios separados; publico el evento en un broker y cada uno se suscribe, sin que el productor los conozca.”</td></tr>
              <tr><td><b>Composite</b><br>(Compuesto)</td><td>“jerarquía”, “árbol”, “categorías con subcategorías”, “grupos que contienen grupos”</td><td>“Usé Composite: hay una jerarquía donde el nodo contiene nodos del mismo tipo; la operación funciona igual sobre hoja y compuesto.”</td></tr>
              <tr><td><b>Facade</b><br>(Fachada)</td><td>“punto de entrada único”, “coordinar varios servicios”, “gestiona el caso de uso”</td><td>“Usé Facade: el cliente conoce sólo la fachada, que coordina el subsistema; baja el acoplamiento y reutiliza el caso de uso.”</td></tr>
              <tr><td><b>Command</b><br>(Comando)</td><td>“configurar acciones”, “encolar”, “programar”, “deshacer”, “auditar”, “ejecutar después”</td><td>“Usé Command: la acción se cosifica como objeto con su configuración; se puede encolar, programar y auditar, desacoplando quien la pide de quien la ejecuta.”</td></tr>
              <tr><td><b>Template Method</b><br>(Método plantilla)</td><td>“mismo proceso con variantes”, “esqueleto fijo, algunos pasos cambian”</td><td>“Usé Template Method: el esqueleto es fijo y sólo varían algunos pasos; la clase base define el orden y las subclases los pasos, sin duplicar.”</td></tr>
              <tr><td><b>Simple Factory / Factory Method</b><br>(Fábrica)</td><td>“según el tipo se crea”, “instanciar según”, “cada sucursal crea su producto”</td><td>“Usé una Fábrica: centralizo la decisión de qué objeto crear según el tipo; el resto depende de la abstracción, no de clases concretas.”</td></tr>
              <tr><td><b>Builder</b><br>(Constructor)</td><td>“muchos atributos opcionales”, “se arma paso a paso”, “el usuario elige qué incluir”</td><td>“Usé Builder: el objeto tiene muchos atributos opcionales; lo construyo paso a paso y valido antes de crearlo, evitando el constructor telescópico.”</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Regla de oro:</b> si no podés señalar la frase del enunciado que justifica el patrón, sacalo (meter uno de más = sobreingeniería = resta).</p>
          <p class="mini"><b>Desempates:</b> Strategy vs State = ¿quién decide el cambio? (cliente / el objeto solo). Adapter vs Facade = traducir / simplificar. Command vs Strategy = ¿se configura/guarda/deshace? Observer vs Pub-Sub = misma app / servicios separados. Builder vs Fábrica = opciones-pasos / tipos-variantes.</p>
        </section>

        <!-- ================= HOJA 2 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 2 · SOLID + CUALIDADES + SMELLS</span>
          <h2>Principios SOLID (nombre completo)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Letra</th><th>Nombre completo</th><th>Qué dice</th><th>Se huele cuando…</th></tr></thead>
            <tbody>
              <tr><td><b>S</b></td><td>Responsabilidad Única <span class="mini">(Single Responsibility)</span></td><td>Una clase, una sola razón para cambiar</td><td>Una clase guarda en la base + genera PDF + manda mail</td></tr>
              <tr><td><b>O</b></td><td>Abierto/Cerrado <span class="mini">(Open/Closed)</span></td><td>Abierto a extensión, cerrado a modificación</td><td>Cadena de if/switch por tipo que crece</td></tr>
              <tr><td><b>L</b></td><td>Sustitución de Liskov <span class="mini">(Liskov Substitution)</span></td><td>El subtipo reemplaza al padre sin romper</td><td>Un método heredado tira “no soportado”</td></tr>
              <tr><td><b>I</b></td><td>Segregación de Interfaces <span class="mini">(Interface Segregation)</span></td><td>Muchas interfaces chicas mejor que una gigante</td><td>Media clase implementa métodos vacíos</td></tr>
              <tr><td><b>D</b></td><td>Inversión de Dependencias <span class="mini">(Dependency Inversion)</span></td><td>Depender de abstracciones, no de detalles</td><td>El dominio hace <i>new</i> de infraestructura</td></tr>
            </tbody>
          </table></div>
          <h2>Cualidades de diseño (del diagrama)</h2>
          <ul class="mini">
            <li><b>Bajo acoplamiento:</b> cada clase depende de lo mínimo, y de abstracciones.</li>
            <li><b>Alta cohesión:</b> lo que hace una clase tiene todo que ver entre sí.</li>
            <li><b>Encapsulamiento · Abstracción · Sin redundancia (DRY) · Extensibilidad · Reutilización.</b></li>
            <li>Frase de oro para justificar: <i>“busqué bajo acoplamiento y alta cohesión”.</i></li>
          </ul>
          <h2>Code smells frecuentes</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Smell</th><th>Qué es</th><th>Se arregla con</th></tr></thead>
            <tbody>
              <tr><td>Clase Dios <span class="mini">(God Class)</span></td><td>Hace demasiadas cosas</td><td>Extraer clases (Responsabilidad Única)</td></tr>
              <tr><td>Switch por tipo</td><td>if/else sobre tipos que crece</td><td>Polimorfismo (Strategy/State/Fábrica) — Abierto/Cerrado</td></tr>
              <tr><td>Objeto anémico <span class="mini">(Data Class)</span></td><td>Sólo getters/setters, sin comportamiento</td><td>Mover comportamiento a la entidad</td></tr>
              <tr><td>Envidia de atributos <span class="mini">(Feature Envy)</span></td><td>Un método usa más datos de otra clase</td><td>Mover el método a esa clase</td></tr>
              <tr><td>Obsesión por primitivos</td><td>String/int para todo (dni, dinero)</td><td>Objetos de Valor (Value Objects)</td></tr>
              <tr><td>Lista larga de parámetros</td><td>Constructor con muchos parámetros</td><td>Builder</td></tr>
            </tbody>
          </table></div>
        </section>

        <!-- ================= HOJA 3 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 3 · CALIDAD + HTTP</span>
          <h2>Atributos de calidad (requerimientos NO funcionales · ISO 25010)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Atributo</th><th>Suena como…</th><th>Se logra con</th></tr></thead>
            <tbody>
              <tr><td>Disponibilidad</td><td>“SLA 99,9%”, “no puede caerse”</td><td>Redundancia, réplicas, balanceo, failover</td></tr>
              <tr><td>Performance / Eficiencia</td><td>“responder en &lt; 2 s”</td><td>Caché, índices, asíncrono, CDN</td></tr>
              <tr><td>Escalabilidad</td><td>“picos de tráfico”, “miles de usuarios”</td><td>Sin estado + escalado horizontal + colas</td></tr>
              <tr><td>Mantenibilidad</td><td>“agregar función con facilidad”</td><td>SOLID, patrones, bajo acoplamiento</td></tr>
              <tr><td>Seguridad</td><td>“hashear”, “datos confidenciales”</td><td>Cifrado, autenticación, control de acceso</td></tr>
              <tr><td>Usabilidad</td><td>“el usuario no debe esperar”</td><td>Asíncrono con feedback de progreso</td></tr>
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
            <li><b>202</b> Aceptado = “lo proceso después” (¡el código del asincronismo!)</li>
            <li><b>401</b> = no sé quién sos (autenticación) · <b>403</b> = sé quién sos y no podés (autorización)</li>
            <li><b>400</b> = request mal formado · <b>422</b> = bien formado pero viola una regla · <b>409</b> = conflicto con el estado actual</li>
            <li><b>404</b> no existe · <b>500</b> error nuestro · <b>503</b> caído/saturado</li>
          </ul>
          <p class="mini"><b>REST:</b> recursos = sustantivos en plural (<code>/suministros/12</code>); la acción la da el verbo; filtros en la query (<code>?estado=CORTADO</code>). Idempotencia = poder reintentar sin duplicar (clave con colas y pasarelas de pago).</p>
        </section>

        <!-- ================= HOJA 4 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 4 · ARQUITECTURA</span>
          <h2>Componentes y cuándo usarlos</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Necesidad en el enunciado</th><th>Respuesta</th></tr></thead>
            <tbody>
              <tr><td>“puede tardar minutos” / “picos de tráfico”</td><td><b>Asíncrono con cola/broker</b> (amortigua) + responder <b>202</b> + escalar consumidores</td></tr>
              <tr><td>“varios servicios deben enterarse” (separados)</td><td><b>Publicación-Suscripción</b> sobre broker</td></tr>
              <tr><td>“web + mobile, contratos no deben cambiar por la UI”</td><td><b>API Gateway + BFF</b> (Backend for Frontend) por canal</td></tr>
              <tr><td>“gestión de usuarios / roles”</td><td><b>IDM</b> (gestor de identidades) + SSO; token validado en el gateway</td></tr>
              <tr><td>“servir imágenes/videos, bajar transferencia”</td><td><b>Object storage + CDN</b> (URLs firmadas; nunca binarios en la base)</td></tr>
              <tr><td>“se consulta mucho lo mismo, sin cambios”</td><td><b>Caché</b> (con tiempo de vida / invalidación por evento)</td></tr>
              <tr><td>“integrar servicio externo que no controlo”</td><td><b>Adapter</b> + interfaz propia del dominio</td></tr>
              <tr><td>“tarea periódica / automática / al vencer”</td><td><b>Cron / tarea programada</b> (ojo con ejecución única si hay varias instancias)</td></tr>
              <tr><td>“si el externo se cae, arrastra todo”</td><td><b>Circuit breaker</b> (corta y falla rápido) + reintentos con espera</td></tr>
              <tr><td>“un solo nodo tira todo el sistema”</td><td>Eliminar el <b>punto único de falla</b> con redundancia + failover</td></tr>
            </tbody>
          </table></div>
          <h2>Sincronismo vs Asincronismo</h2>
          <ul class="mini">
            <li><b>Sincrónico</b> (HTTP directo): simple e inmediato, pero acopla en el tiempo (si el otro está lento/caído, te arrastra). Para lecturas rápidas.</li>
            <li><b>Asincrónico</b> (cola/broker): desacopla, amortigua picos, tolera fallos; a cambio, consistencia eventual y hay que resolver cómo vuelve el resultado (webhook / polling / notificación).</li>
            <li>Los brokers entregan <b>al menos una vez</b> → el consumidor debe ser <b>idempotente</b> (deduplicar).</li>
          </ul>
          <h2>Capas (dependen hacia adentro)</h2>
          <p class="mini"><b>Presentación (Controller)</b> → <b>Aplicación (Service)</b> → <b>Dominio (reglas)</b> → <b>Infraestructura (Repository/Adapter)</b>. El dominio no conoce HTTP ni SQL. La interfaz del repositorio la define el dominio; la implementación, infraestructura (Inversión de Dependencias + inyección).</p>
          <h2>Siglas (qué significa cada una)</h2>
          <div class="table-wrap"><table class="data">
            <tbody>
              <tr><td><b>REST</b></td><td>estilo de API sobre HTTP con recursos</td><td><b>BFF</b></td><td>Backend por canal (web/mobile)</td></tr>
              <tr><td><b>IDM</b></td><td>gestor de identidades (usuarios)</td><td><b>SSO</b></td><td>inicio de sesión único</td></tr>
              <tr><td><b>RBAC</b></td><td>acceso por <b>rol</b></td><td><b>ABAC</b></td><td>acceso por <b>atributos</b>/contexto</td></tr>
              <tr><td><b>CDN</b></td><td>red que sirve contenido cercano</td><td><b>KMS</b></td><td>gestor de claves de cifrado</td></tr>
              <tr><td><b>CIA</b></td><td>Confidencialidad·Integridad·Disponibilidad</td><td><b>SLA</b></td><td>acuerdo de nivel de servicio</td></tr>
              <tr><td><b>SPOF</b></td><td>punto único de falla</td><td><b>HA</b></td><td>alta disponibilidad</td></tr>
              <tr><td><b>DER</b></td><td>diagrama entidad-relación</td><td><b>DRY</b></td><td>no repetir (no te repitas)</td></tr>
              <tr><td><b>MQTT/AMQP</b></td><td>protocolos de mensajería (IoT/colas)</td><td><b>SDK</b></td><td>kit para usar un servicio externo</td></tr>
              <tr><td><b>GoF</b></td><td>“Gang of Four”, catálogo de patrones</td><td><b>VO</b></td><td>objeto de valor (inmutable, sin id)</td></tr>
            </tbody>
          </table></div>
        </section>

        <!-- ================= HOJA 5 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 5 · CÓMO SE DIBUJA CADA COSA</span>
          <h2>Qué es cada flecha (relaciones UML)</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>Relación</th><th>Se dibuja</th><th>Significa</th></tr></thead>
            <tbody>
              <tr><td>Herencia</td><td>Línea llena + punta triangular <b>vacía</b> ◁</td><td>“es un/a” (extends)</td></tr>
              <tr><td>Realización</td><td>Línea <b>punteada</b> + punta triangular vacía ◁</td><td>implementa una interfaz</td></tr>
              <tr><td>Composición</td><td>Rombo <b>lleno</b> ◆</td><td>parte-todo; la parte no vive sin el todo</td></tr>
              <tr><td>Agregación</td><td>Rombo <b>vacío</b> ◇</td><td>“tiene”, pero la parte vive por su cuenta</td></tr>
              <tr><td>Asociación</td><td>Línea (con flecha si es dirigida) →</td><td>“conoce a” (lo tiene de atributo)</td></tr>
              <tr><td>Dependencia</td><td>Línea punteada + flecha abierta ⇢</td><td>“usa” (parámetro/variable local)</td></tr>
            </tbody>
          </table></div>
          <p class="mini">Multiplicidad en los extremos: <code>1</code>, <code>0..1</code>, <code>*</code>, <code>1..*</code>. Nombrá las asociaciones si hay dos entre las mismas clases (ej. <i>propietario</i> vs <i>tenedor</i>).</p>

          <h2>Componente e interfaces (bola-socket)</h2>
          <div class="uml-svg-wrap">${APP.svgBallSocket("Consume", "Provee", "IServicio")}</div>
          <p class="mini"><b>Bolita ●</b> = interfaz <b>PROVISTA</b> (el que ofrece/dispone el servicio). <b>Semicírculo (</b> = interfaz <b>REQUERIDA</b> (el que consume). El semicírculo del consumidor abraza la bolita del proveedor.</p>

          <h2>Nodo de despliegue (es un CUBO, no una caja)</h2>
          <div class="uml-svg-wrap">${APP.svgNodo("device", "Servidor", "app.jar")}</div>
          <p class="mini">Cada nodo = cubo 3D; adentro van los artefactos (.jar/contenedor). Entre nodos, línea con el <b>protocolo</b> (HTTPS, AMQP, MQTT, JDBC).</p>

          <h2>Forma canónica de los 4 patrones más pedidos</h2>
          <div class="grid-2">
            ${APP.uml(`classDiagram
    class Contexto
    class Estrategia { <<interface>> }
    class EstrategiaA
    class EstrategiaB
    Estrategia <|.. EstrategiaA
    Estrategia <|.. EstrategiaB
    Contexto --> Estrategia`, "Strategy / State (misma forma)")}
            ${APP.uml(`classDiagram
    class ITarget { <<interface>> }
    class Adapter
    class Externo
    ITarget <|.. Adapter
    Adapter --> Externo
    class Cliente
    Cliente --> ITarget`, "Adapter")}
          </div>
          <div class="grid-2">
            ${APP.uml(`classDiagram
    class Sujeto { +suscribir() +notificar() }
    class Observer { <<interface>> }
    class ObsA
    class ObsB
    Observer <|.. ObsA
    Observer <|.. ObsB
    Sujeto o-- "*" Observer`, "Observer")}
            ${APP.uml(`classDiagram
    class Componente { <<interface>> }
    class Hoja
    class Compuesto
    Componente <|.. Hoja
    Componente <|.. Compuesto
    Compuesto o-- "*" Componente`, "Composite")}
          </div>
        </section>

        <!-- ================= HOJA 6 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 6 · MODELO DE DATOS + HIDRA</span>
          <h2>Modelo de datos — decisiones clave</h2>
          <ul class="mini">
            <li><b>Herencia → tablas:</b> Tabla Única (una tabla + discriminador, rápida pero con nulos) · Por Clase Unida (una tabla por clase, une por PK, normalizada) · Tabla por Clase Concreta. <b>Justificá cuál y por qué.</b></li>
            <li><b>Impedance mismatch</b> = desajuste objetos↔tablas: herencia, colecciones (tabla hija con FK), objetos de valor (columnas embebidas), identidad por referencia vs clave.</li>
            <li><b>No relacional cuándo:</b> documental (JSON de estructura variable), clave-valor (caché con tiempo de vida), <b>series temporales</b> (lecturas de sensores/medidores, mucho volumen por tiempo), grafo (redes).</li>
            <li><b>Desnormalizar</b> sólo si hay muchas más lecturas que escrituras y el join es un cuello de botella; guardá cómo mantenés la coherencia.</li>
            <li><b>DER debe tener:</b> PK, FK, cardinalidad, modalidad (opcional/obligatorio), y restricciones (UNIQUE, CHECK). Entre microservicios: referencias <b>lógicas</b> (sin FK real).</li>
          </ul>
          <h2>HIDRA — diccionario dominio → decisión</h2>
          <div class="table-wrap"><table class="data">
            <thead><tr><th>En HIDRA…</th><th>Pensás…</th></tr></thead>
            <tbody>
              <tr><td>Caudalímetros que envían lecturas (volumen, picos)</td><td>Asíncrono + broker (MQTT) + series temporales + consumidor idempotente</td></tr>
              <tr><td>Esquemas tarifarios (residencial por tramos, comercial, social) “pueden agregarse”</td><td><b>Strategy</b> (Estrategia)</td></tr>
              <tr><td>Reglas de detección de fugas/anomalías combinadas y ampliables</td><td><b>Strategy en colección</b> (motor de reglas)</td></tr>
              <tr><td>Estado del suministro (activo/cortado/limitado/baja) · alerta/orden</td><td><b>State</b> (Estado) + bitácora de trazabilidad</td></tr>
              <tr><td>Cortar/reponer/limitar remoto, programable, encolable, auditable</td><td><b>Command</b> (Comando)</td></tr>
              <tr><td>Pasarela de pago · ente regulador (no son nuestros)</td><td><b>Adapter</b> + asíncrono (webhook) + idempotencia</td></tr>
              <tr><td>Avisar a usuario/cuadrilla/ente (servicios separados)</td><td><b>Publicación-Suscripción</b></td></tr>
              <tr><td>Reportes periódicos al ente</td><td><b>Cron</b> + Adapter</td></tr>
              <tr><td>Portal ciudadano + app inspector, más canales</td><td>Gateway + <b>BFF</b> por canal</td></tr>
              <tr><td>Datos personales sensibles</td><td>Cifrado en reposo (AES por columna) + claves en KMS + TLS + roles</td></tr>
            </tbody>
          </table></div>
          <p class="mini"><b>Pasarela de pago:</b> creás una orden, respondés “pendiente”, y la pasarela confirma por <b>webhook</b> (asíncrono). El dinero real está fuera de alcance: guardás estado (pendiente/aprobado/rechazado) + id. El webhook puede repetirse → idempotente.</p>
        </section>

        <!-- ================= HOJA 7 ================= -->
        <section class="hoja">
          <span class="hoja-num">HOJA 7 · CHECKLIST FINAL (revisá al terminar)</span>
          <h2>Antes de entregar, chequeá item por item</h2>
          <h3>🧩 Modelado de Dominio</h3>
          <ul class="mini">
            <li>☐ Están <b>todas las clases</b> que menciona el enunciado (y ninguna inventada de más).</li>
            <li>☐ Las clases <b>saben hacer cosas</b> (no son sólo getters/setters — nada anémico).</li>
            <li>☐ Cada <b>patrón</b> que usé tiene una <b>frase del enunciado</b> que lo justifica escrita al lado.</li>
            <li>☐ No metí ningún patrón “por las dudas” (sobreingeniería resta).</li>
            <li>☐ Las <b>flechas</b> son las correctas (herencia ◁ vs asociación → vs composición ◆).</li>
            <li>☐ Puse <b>multiplicidades</b> y nombré las asociaciones ambiguas.</li>
            <li>☐ Si hay ciclo de vida → <b>State</b>; si hay varias reglas ampliables → <b>Strategy</b>; si hay externo → <b>Adapter</b>.</li>
            <li>☐ Justifiqué con los <b>4 elementos</b>: patrón + enunciado + principio SOLID + cualidad.</li>
          </ul>
          <h3>🏗️ Arquitectura I y II</h3>
          <ul class="mini">
            <li>☐ Están <b>todos los servicios</b> y los <b>externos</b> marcados como tales.</li>
            <li>☐ Cada conexión tiene su <b>protocolo</b> (HTTPS, AMQP, MQTT, JDBC).</li>
            <li>☐ Si algo tarda o hay picos → aparece <b>cola/broker</b> y expliqué que amortigua.</li>
            <li>☐ Nodos como <b>cubos</b>; componentes con <b>bola-socket</b> (quién consume a quién).</li>
            <li>☐ Hay <b>base por servicio</b> (en microservicios) y componente de <b>seguridad</b> si hay usuarios.</li>
            <li>☐ Respondí sync/async <b>con el porqué</b>, el formato y un ejemplo de mensaje.</li>
            <li>☐ Integraciones externas por <b>Adapter</b>; webhooks/consumidores <b>idempotentes</b>.</li>
          </ul>
          <h3>🗄️ Modelo de Datos</h3>
          <ul class="mini">
            <li>☐ Cada entidad tiene <b>PK</b>; las relaciones tienen <b>FK</b>, <b>cardinalidad</b> y <b>modalidad</b>.</li>
            <li>☐ Restricciones puestas (<b>UNIQUE</b> en códigos únicos, <b>CHECK</b> en estados).</li>
            <li>☐ Mapeé la <b>herencia</b> a tablas y <b>justifiqué</b> la estrategia elegida.</li>
            <li>☐ Definí qué va en <b>no relacional</b> (lecturas → series temporales) y por qué.</li>
            <li>☐ Snapshots/valores históricos como copia inmutable (no referencia viva).</li>
            <li>☐ Expliqué impedance mismatches y cualquier desnormalización.</li>
          </ul>
          <h3>✍️ General</h3>
          <ul class="mini">
            <li>☐ Repartí el tiempo: <b>60% en CADA sección</b> (ninguna en blanco).</li>
            <li>☐ Toda decisión está <b>justificada por escrito</b> (el examen es escrito).</li>
            <li>☐ Releí el enunciado buscando requerimientos que no aparezcan en mi solución.</li>
          </ul>
        </section>
      `;

      el.querySelector("#rpPrint").addEventListener("click", function () { window.print(); });
      APP.rerenderMermaid(el);
    },
  });
})();
