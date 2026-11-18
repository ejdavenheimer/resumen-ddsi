/* ============================================================
   P2 · Simulacro: parcial 2025 (PetGuardian) + parcial 17/11/2026
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-simulacro",
    title: "Simulacro: parciales reales resueltos",
    tag: "📝",
    group: "Parcial 2 (práctica)",
    resumen: "PetGuardian 2025 completo + el parcial del 17/11/2026",
    keywords: ["simulacro", "parcial", "petguardian", "resuelto", "modelo de respuesta", "bicicletero", "2025", "practica"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Parcial 2 · Práctica</div>
          <h1>Parciales reales, resueltos</h1>
          <p class="lead">Primero <b>resolvelo en papel</b>. Recién después abrí la respuesta. Leer una solución sin haberla intentado no entrena nada.</p>
        </div>

        <div class="callout warn">
          <div class="callout-title">⚠️ Estructura y condiciones (del parcial 2025)</div>
          <p><b>Punto 1 — Modelo de Datos: 40 puntos · Punto 2 — Arquitectura: 50 puntos · Punto 3 — Persistencia: 10 puntos.</b></p>
          <p>“Para aprobar debe sumar como mínimo <b>60 puntos</b> y <b>no menos del 50% en cada sección</b>. Se puede
          recuperar por partes (persistencia, modelado de datos, arquitectura), pero no para la aprobación directa.”</p>
          <p><b>Conclusión táctica:</b> ninguna sección puede quedar a medias. Mejor tres respuestas buenas que una
          excelente y dos vacías.</p>
        </div>

        <h2>Parcial del 17/11/2026 (lo que tomaron hoy a la mañana)</h2>
        <div class="card">
          <ol>
            <li><b>Armar el DER de un servicio, con justificación.</b></li>
            <li><b>Te daban un DER ya hecho de otro servicio</b> y había que decir <b>si cumple las 3 formas normales</b>,
            <b>qué problema hay</b> y demás. Era responder <b>sí o no y explicar en 2 renglones</b>.</li>
            <li><b>Algo sobre desnormalización.</b></li>
          </ol>
        </div>
        <details class="qa">
          <summary>🎯 Cómo contestar los tres puntos (plantillas listas)</summary>
          <p><b>1) DER con justificación.</b> Seguí el orden de
          <a class="inline" data-go="p2-der">DER paso a paso</a>: entidades → atributos → PK → relaciones con
          cardinalidad y modalidad → restricciones → <b>supuestos</b> → los <b>tres párrafos</b> de justificación
          (qué persistir / impedance mismatches / qué desnormalizar). <b>No entregues el diagrama solo:</b> la mitad del
          puntaje de ese punto está en el texto.</p>
          <p><b>2) ¿Cumple las 3 formas normales?</b> Auditá en este orden y en 60 segundos:</p>
          <ul>
            <li><b>1FN</b> — ¿hay celdas con listas, columnas numeradas (<code>tel_1, tel_2</code>) o tablas sin PK?</li>
            <li><b>2FN</b> — ¿hay PK <b>compuestas</b>? ¿algún atributo depende de <b>una sola</b> parte de la clave?</li>
            <li><b>3FN</b> — ¿hay un <b>nombre/descripción de otra entidad</b> metido en la tabla
            (<code>nombre_depto</code>, <code>nombre_categoria</code>) o un <b>campo calculable</b>
            (<code>total</code>, <code>subtotal</code>, <code>edad</code>)?</li>
          </ul>
          <p>Y escribí la respuesta con esta forma: <b>veredicto + dónde + por qué (el nombre de la dependencia) + qué
          anomalía produce + cómo se corrige</b>. Ejemplo de dos renglones:</p>
          <p class="mini" style="padding:.6rem;border-left:3px solid var(--brand)">“<b>No cumple 3FN:</b> en
          <i>TURNO</i>, <code>especialidad_profesional</code> depende de <code>id_profesional</code> —un atributo no
          clave— y no de la PK (<b>dependencia transitiva</b>). Genera <b>redundancia</b> y <b>anomalías de actualización
          y borrado</b>: cambiar la especialidad obliga a tocar todas las filas del profesional. <b>Se corrige</b>
          dejando sólo la FK y leyendo el dato de <i>PROFESIONAL</i>. 1FN y 2FN sí se cumplen.”</p>
          <p><b>Si cumple</b>, también hay que fundamentarlo: “Sí: atributos atómicos y PK en cada tabla (1FN); en las
          tablas intermedias ningún atributo depende de una sola parte de la PK compuesta (2FN); y ningún atributo no
          clave depende de otro atributo no clave — los datos de cada entidad viven en su tabla y se referencian por FK
          (3FN).”</p>
          <p><b>3) Desnormalización.</b> La respuesta siempre empieza por <b>distinguir las dos razones</b>: por
          <b>consistencia</b> (el dato debe quedar <b>congelado</b> al momento del hecho porque el modelo normalizado
          devuelve un resultado <b>incorrecto para el negocio</b>: comprobantes, contratos, liquidaciones, auditoría) o
          por <b>performance</b> (el modelo es correcto pero lento; <b>exige medición previa</b> y es de <b>última
          instancia</b>, después de índices, caché, particionamiento y réplicas). Después: la <b>técnica</b> (atributo
          replicado / dato congelado / campo derivado / tabla de resumen / vista materializada / fusión 1:1), el
          <b>costo</b> (anomalías de actualización, escritura más cara, integridad a cargo de la app, ventana de
          inconsistencia) y las <b>salvaguardas</b> (conservar la FK, declarar la fuente de verdad, proceso de recálculo,
          encapsular la propagación en un único punto). Y la frase que nunca falla: <b>“desnormalizar sin haber
          normalizado antes no es desnormalizar: es modelar mal”.</b></p>
        </details>

        <h2>Parcial 2025 · PetGuardian</h2>
        <details class="qa">
          <summary>📄 Enunciado (resumen fiel)</summary>
          <p><b>Contexto:</b> PetGuardian desarrolla soluciones inteligentes para el cuidado de mascotas en el hogar.
          Permite monitorear, asistir y cuidar animales de forma remota combinando <b>sensores, cámaras y actuadores</b>
          instalados en los domicilios con un <b>módulo de IA</b> que detecta comportamientos inusuales o incidentes. Es
          una <b>plataforma compuesta por distintos servicios</b>.</p>
          <p><b>Servicio de Gestión de Mascotas.</b> Registrar y administrar mascotas, asociarlas a los dispositivos
          instalados en sus hogares y mantener historial médico y preferencias. Cada mascota: nombre, especie, raza, fecha
          de nacimiento, sexo, peso, domicilio asociado y dueño; <b>opcionales</b>: fotografía, color, microchip, notas.
          <b>Historial médico:</b> cada entrada registra fecha, tipo de evento (vacunación, control rutinario, cirugía,
          diagnóstico), descripción, el veterinario o institución interviniente y los signos vitales del momento
          (temperatura, frecuencia cardíaca); puede incluir <b>archivos adjuntos</b> (recetas, estudios, imágenes); lo
          consultan el dueño y profesionales <b>con acceso autorizado</b>. <b>Preferencias de alimentación:</b> tipo de
          dieta (balanceado, húmedo, mixta, casera), marca, cantidad por ración, frecuencia diaria, horarios
          recomendados, <b>restricciones o alergias</b>. <b>Preferencias de actividad:</b> nivel esperado (muy activo,
          activo, tranquilo, perezoso), horas recomendadas de paseo o juego y sensibilidad a estímulos (altamente
          sensible, muy sensible, levemente sensible, no le interesa). <b>Domicilios:</b> uno o varios por cuenta, con
          dirección, coordenadas, zona horaria y descripción; además hay que saber <b>con qué dispositivos se cuenta por
          vivienda</b>.</p>
          <p><b>Servicio de Recepción y Procesamiento de Datos.</b> Recibir, validar y almacenar las <b>lecturas</b> de
          sensores y actuadores, asociadas al dispositivo, el domicilio y las mascotas vinculadas. <b>Sensores:</b>
          movimiento, sonido, temperatura, cámaras, sensores de peso en comederos/bebederos. <b>Actuadores:</b> comederos
          automáticos, bebederos inteligentes, emisor sonoro. <b>Mixtos:</b> collares inteligentes (sensores +
          actuadores). Cada dispositivo: <b>número de serie único</b>, tipo, modelo, versión de firmware, estado
          operativo y fecha de última comunicación; reporta periódicamente estado de conexión y batería.</p>
          <p><b>Servicio de IA y Alertas.</b> Analiza continuamente los datos para detectar comportamientos inusuales. Al
          detectar un evento relevante genera una <b>alerta</b> asociada al domicilio y a la/s mascota/s, con <b>tipo</b>
          (accionables o “de aviso”) y <b>nivel de severidad</b>. Las de aviso se ven en la app; las accionables se
          derivan a otros servicios. <b>Los eventos relevantes los configura previamente un administrador</b> y todos los
          posibles eventos ya son conocidos.</p>
          <p><b>Servicio de Rutinas y Automatizaciones.</b> Ejecuta acciones automáticas. Las rutinas <b>no se crean
          libremente</b>: se generan desde un <b>catálogo de condiciones y acciones predefinidas</b> — eventos de tiempo
          (“cada 8 horas”, “a las 7:00 y 19:00”), lecturas de sensores y <b>alertas accionables tipificadas</b>. Cada
          rutina <b>combina una o varias condiciones</b> con una acción (dispensar alimento, activar cámara, emitir
          sonido, notificar). El usuario puede activar/desactivar, ajustar parámetros y consultar el <b>historial de
          ejecuciones</b>.</p>
          <p><b>Servicio de Estadísticas.</b> Transforma datos operativos en métricas agregadas: mascota más activa del
          mes, mascota con más alertas por comportamiento anómalo, tipo de actuador más usado, top 10 usuarios con más
          rutinas activas.</p>
        </details>

        <h3>Punto 1 — Modelo de Datos (40 pts)</h3>
        <div class="card">
          <p><b>1)</b> (5 pts) Enumere las entidades identificadas y mencione, de forma concisa, qué representa cada una.</p>
          <p><b>2)</b> (30 pts) Realice el modelo de datos de: <b>Gestión de Mascotas</b>, <b>IA y Alertas</b> y
          <b>Rutinas y Automatizaciones</b>. Indique todos los supuestos. Justifique todas las decisiones de diseño.</p>
          <p><b>3)</b> (5 pts) El sistema recopila datos sensibles de los dueños: ¿qué mecanismos de seguridad
          implementaría para garantizar <b>confidencialidad</b>?</p>
        </div>
        <details class="qa">
          <summary>✅ Respuesta modelo — Punto 1</summary>
          <p><b>1) Entidades</b></p>
          <ul>
            <li><b>Usuario:</b> el dueño que tiene cuenta en la plataforma.</li>
            <li><b>Domicilio:</b> una vivienda del usuario donde hay dispositivos instalados.</li>
            <li><b>Mascota:</b> el animal monitoreado, con sus datos básicos y su dueño.</li>
            <li><b>EventoMédico:</b> una entrada del historial de salud de una mascota.</li>
            <li><b>TipoEvento:</b> catálogo de tipos de evento médico (vacunación, control, cirugía, diagnóstico).</li>
            <li><b>Adjunto:</b> un archivo asociado a un evento médico (se guarda la URL).</li>
            <li><b>PreferenciaAlimentacion / PreferenciaActividad:</b> parámetros de rutina y comportamiento de la mascota.</li>
            <li><b>RestriccionAlimentaria:</b> una alergia o restricción de la mascota (multivaluado).</li>
            <li><b>Dispositivo</b> (y sus subtipos Sensor / Actuador / Mixto): el equipo instalado en un domicilio.</li>
            <li><b>TipoDispositivo:</b> catálogo de tipos (sensor de movimiento, cámara, comedero…).</li>
            <li><b>Lectura:</b> un dato capturado por un dispositivo en un instante.</li>
            <li><b>TipoEventoRelevante:</b> catálogo de eventos que la IA puede detectar, configurado por el administrador.</li>
            <li><b>Alerta:</b> la detección concreta, asociada al domicilio y a la/s mascota/s, con tipo y severidad.</li>
            <li><b>Rutina:</b> la automatización configurada por el usuario (activa o no).</li>
            <li><b>Condicion / Accion:</b> catálogos predefinidos que el usuario combina.</li>
            <li><b>EjecucionRutina:</b> el registro histórico de cuándo y por qué se ejecutó una rutina.</li>
          </ul>
          <p><b>2) Modelo</b> — Gestión de Mascotas está dibujado y justificado en
          <a class="inline" data-go="p2-der">DER paso a paso</a>. Los otros dos servicios:</p>
          ${APP.uml(`erDiagram
    TIPO_EVENTO_RELEVANTE ||--o{ ALERTA : tipifica
    DOMICILIO_REF ||--o{ ALERTA : "ocurre en"
    ALERTA ||--o{ ALERTA_MASCOTA : involucra
    ALERTA {
      int id_alerta PK
      int id_tipo_evento FK "NOT NULL"
      int id_domicilio "ID logico - otro servicio"
      datetime fecha_hora "NOT NULL"
      string tipo "CHECK (ACCIONABLE, AVISO)"
      string severidad "CHECK (BAJA, MEDIA, ALTA, CRITICA)"
      string estado "NUEVA, VISTA, DERIVADA"
      string descripcion
    }
    TIPO_EVENTO_RELEVANTE {
      int id_tipo_evento PK
      string codigo "UNIQUE - ej: LADRIDO_EXCESIVO"
      string nombre "NOT NULL"
      string severidad_default
      boolean accionable "NOT NULL"
      boolean activo "NOT NULL"
    }
    ALERTA_MASCOTA {
      int id_alerta PK "y FK"
      int id_mascota PK "ID logico de otro servicio"
    }
    DOMICILIO_REF {
      int id_domicilio PK "referencia logica"
    }`, "Servicio de IA y Alertas")}
          ${APP.uml(`erDiagram
    RUTINA ||--|{ RUTINA_CONDICION : combina
    CONDICION ||--o{ RUTINA_CONDICION : "se usa en"
    ACCION ||--o{ RUTINA : ejecuta
    RUTINA ||--o{ EJECUCION_RUTINA : registra
    RUTINA {
      int id_rutina PK
      int id_usuario "ID logico - otro servicio"
      int id_accion FK "NOT NULL"
      string nombre "NOT NULL"
      boolean activa "NOT NULL default true"
      json parametros "valores ajustados por el usuario"
      datetime fecha_creacion
    }
    CONDICION {
      int id_condicion PK
      string tipo "CHECK (TIEMPO, LECTURA_SENSOR, ALERTA_ACCIONABLE)"
      string descripcion "NOT NULL"
      json parametros_esperados
    }
    RUTINA_CONDICION {
      int id_rutina PK "y FK"
      int id_condicion PK "y FK"
      json valores "ej: cada 8 horas / 7:00 y 19:00"
    }
    ACCION {
      int id_accion PK
      string descripcion "NOT NULL"
      int id_tipo_dispositivo "ID logico - actuador requerido"
    }
    EJECUCION_RUTINA {
      int id_ejecucion PK
      int id_rutina FK "NOT NULL"
      datetime fecha_hora "NOT NULL"
      string motivo "por que se disparo - congelado"
      string resultado "CHECK (OK, ERROR)"
      string detalle_error
    }`, "Servicio de Rutinas y Automatizaciones")}
          <p><b>Supuestos clave de estos dos servicios:</b></p>
          <ul>
            <li>Una alerta puede involucrar <b>varias mascotas</b> (“la/s mascota/s involucrada/s”) → tabla intermedia
            <code>ALERTA_MASCOTA</code>, no una FK simple.</li>
            <li>Los <b>tipos de evento relevante</b> son una <b>tabla maestra</b>, no un enum: el enunciado dice que “los
            configura previamente un administrador”. En cambio <b>tipo</b> (accionable/aviso) y <b>severidad</b> sí son
            conjuntos cerrados → enum con CHECK.</li>
            <li>Una rutina <b>combina una o varias condiciones</b> (modalidad <b>1,N</b>: al menos una) con <b>una</b>
            acción → <code>RUTINA_CONDICION</code> con los valores concretos de cada condición.</li>
            <li><b>Condiciones y acciones son catálogos</b>: el usuario no los crea, los selecciona. Por eso están como
            entidades maestras con FK, y los valores que el usuario ajusta van en la relación.</li>
            <li>El <b>motivo</b> de cada ejecución se guarda <b>congelado</b> en <code>EJECUCION_RUTINA</code>: si la
            rutina se modifica después, el historial debe seguir explicando por qué se ejecutó en ese momento
            (<b>desnormalización por consistencia</b>).</li>
            <li>Como cada servicio tiene su propia base, las referencias a Mascota, Domicilio y Usuario son
            <b>IDs lógicos</b>, <b>no FK</b>: no hay integridad referencial entre servicios y la validación es
            responsabilidad de la aplicación.</li>
            <li>Las <b>lecturas</b> (servicio de Recepción) no se modelan acá; por volumen y patrón de acceso van a una
            <b>base de series temporales</b>, no a la relacional.</li>
          </ul>
          <p><b>3) Confidencialidad de datos sensibles</b></p>
          <ul>
            <li><b>Cifrado en tránsito:</b> TLS/HTTPS en todas las comunicaciones, incluido el tráfico <b>interno</b>
            entre servicios (“la red es segura” es una falacia).</li>
            <li><b>Cifrado en reposo:</b> cifrado de la base y del object storage; <b>cifrado a nivel de columna</b> para
            los campos más sensibles (documento, dirección, datos de salud), con claves en una <b>bóveda de secretos</b>
            (Vault/KMS) y <b>rotación</b> periódica.</li>
            <li><b>Contraseñas:</b> nunca cifradas, <b>hasheadas con salt</b> y una función lenta (bcrypt/Argon2).</li>
            <li><b>Control de acceso:</b> autenticación (JWT) + <b>autorización por roles y permisos con alcance</b>: el
            veterinario sólo accede al historial de las mascotas que tiene <b>autorizadas</b>, no a todas. Validación
            siempre en el backend. <b>Menor privilegio.</b></li>
            <li><b>Minimización y enmascaramiento:</b> no recolectar lo que no se usa; devolver datos
            <b>enmascarados</b> en listados; <b>anonimizar</b> antes de copiar datos a ambientes de testing
            (<b>Ley 25.326</b>).</li>
            <li><b>Auditoría:</b> registrar quién accedió a qué dato sensible y cuándo (trazabilidad), sin loguear nunca
            el dato sensible en sí.</li>
            <li><b>Datos para terceros</b> (colegios de veterinarios, centros de investigación): entregarlos
            <b>agregados y anonimizados</b>, con consentimiento.</li>
          </ul>
          <p class="mini">Y si piden <b>integridad</b> en lugar de confidencialidad: <b>hash/checksum</b> del contenido,
          <b>firma digital o HMAC</b> del documento generado, constraints e integridad referencial en la base,
          transacciones y un <b>log de auditoría append-only</b>.</p>
        </details>

        <h3>Punto 2 — Arquitectura (50 pts)</h3>
        <div class="card">
          <p><b>1)</b> (10) Cientos de sensores y actuadores conectados simultáneamente enviando lecturas periódicas:
          (a) ¿cómo realizaría la integración? (b) genere el diagrama de despliegue y componentes.</p>
          <p><b>2)</b> (10) Acceso desde navegadores y apps mobile: (a) ¿cómo aplicaría <b>JWT</b> y qué ventajas tiene
          frente a sesiones tradicionales? (b) ¿app <b>nativa o híbrida</b>, y qué atributos de calidad sustentan la
          decisión? Defina cada atributo.</p>
          <p><b>3)</b> (10) Terceros (colegios de veterinarios, centros de investigación) piden acceso con <b>gran
          flexibilidad</b> para definir qué datos consultar y combinarlos, minimizando llamadas y carga: (a) ¿qué tipo de
          API propone? (b) muchos repiten las mismas consultas en períodos cortos: ¿qué mecanismos incorpora?</p>
          <p><b>4)</b> (10) Resúmenes semanales por email: (a) ¿cómo lo implementaría en microservicios y con qué
          mecanismos de comunicación? (b) ¿qué mecanismo de seguridad garantiza la <b>integridad</b> de los resúmenes?</p>
          <p><b>5)</b> (10) Picos cuando miles de comederos se activan en el mismo horario, con demoras y carga alta:
          (a) ¿qué estrategia de escalamiento y qué componentes? (b) ¿qué atributos se favorecen y cómo se garantizan?</p>
        </div>
        <details class="qa">
          <summary>✅ Respuesta modelo — Punto 2</summary>
          <p><b>1a) Integración con los dispositivos.</b> Asincrónica orientada a mensajes con <b>MQTT</b> (liviano,
          publicación/suscripción, QoS configurable y tolerante a conectividad intermitente) contra un <b>broker</b>; un
          <b>Edge Gateway</b> por domicilio agrupa las lecturas de los dispositivos de esa casa, las bufferea y reintenta
          si se corta el enlace. Un <b>servicio de ingesta</b> valida y publica en un <b>topic</b>; los consumidores
          persisten en una <b>base de series temporales</b>, y los servicios de IA y Estadísticas se suscriben por
          separado sin que el productor los conozca. Los consumidores son <b>idempotentes</b> (dedup por
          dispositivo+timestamp) porque la entrega es <b>at-least-once</b>, con reintentos limitados y <b>DLQ</b>. Para
          los <b>comandos</b> hacia los actuadores, <b>cola por dispositivo</b> (es una orden: la ejecuta uno, una sola
          vez). <b>Por qué no REST sincrónico:</b> el dispositivo no necesita respuesta para continuar, y una llamada
          sincrónica acoplaría la disponibilidad del sistema a la de cientos de dispositivos.</p>
          <p><b>1b) Diagrama.</b> Nodos (cubos): Dispositivos «device» → Edge Gateway «device» → Broker MQTT →
          Servicio de Ingesta «container» → TSDB; y en paralelo API Gateway → servicios de Mascotas / IA / Rutinas /
          Estadísticas, cada uno con su base. Rotulá <b>cada línea con su protocolo</b> (MQTT, AMQP, HTTPS, JDBC) y marcá
          lo externo (pasarela de mail, IdP).</p>
          ${APP.uml(`graph LR
    D["🔌 Sensores y actuadores<br/>«device»"] -->|MQTT| EG["Edge Gateway<br/>«device»"]
    EG -->|MQTT/TLS| B[("Broker MQTT")]
    B -->|AMQP| ING["Servicio de Ingesta"]
    ING --> TS[("TSDB<br/>lecturas")]
    ING -->|topic lectura.nueva| IA["Servicio IA y Alertas"]
    IA -->|alerta accionable| RU["Servicio Rutinas"]
    RU -->|cola comando.actuador| B
    W["🌐 SPA"] -->|HTTPS| GW["API Gateway"]
    M["📱 App Mobile"] -->|HTTPS| GW
    GW --> MS["Servicio Mascotas"]
    GW --> IA
    GW --> RU
    GW --> ES["Servicio Estadísticas"]
    MS --> DB1[("BD Mascotas")]
    ES --> COL[("BD columnar")]
    style B fill:#fffbeb,stroke:#b45309,color:#0f172a
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a`, "Despliegue / componentes de PetGuardian")}
          <p><b>2a) JWT:</b> ver la respuesta completa en <a class="inline" data-go="p2-sesiones">Sesiones y JWT</a>
          (cómo se aplica + 5 ventajas + las desventajas que conviene nombrar).</p>
          <p><b>2b) Nativa o híbrida:</b> acá el enunciado inclina la balanza hacia <b>nativa</b>, porque hay
          <b>video en tiempo real</b> de las cámaras, <b>notificaciones push</b> de alertas críticas y posible
          <b>Bluetooth/BLE</b> con el collar: eso exige <b>acceso completo al hardware y a las APIs del SO</b> y
          <b>performance</b> en la reproducción. Si en cambio la app fuera sólo de consulta y configuración,
          <b>híbrida</b> gana por <b>mantenibilidad</b> y costo. <b>Definí los atributos</b> (la consigna lo pide):
          <b>Performance</b> = capacidad de responder en el tiempo esperado bajo una carga dada; <b>Mantenibilidad</b> =
          facilidad para modificar el sistema con bajo riesgo y costo; <b>Usabilidad</b> = facilidad con que el usuario
          logra su objetivo; <b>Portabilidad</b> = capacidad de funcionar en distintos entornos; <b>Funcionalidad /
          compatibilidad</b> = acceso a las capacidades del dispositivo.</p>
          <p><b>3a)</b> <b>GraphQL</b> (ver la respuesta modelo en
          <a class="inline" data-go="p2-integracion">Integración</a>): un único endpoint, el consumidor pide exactamente
          lo que necesita, esquema tipado y autodocumentado, menos llamadas y sin acoplar los contratos internos a cada
          tercero. Mitigaciones: límites de profundidad/complejidad, paginación, rate limiting y caché.</p>
          <p><b>3b)</b> <b>Caché</b> (Redis / caché de consultas con TTL) delante de la API de terceros +
          <b>réplicas de lectura</b> para no tocar la base transaccional, y para la analítica, un <b>read model</b> o un
          almacén <b>columnar</b> alimentado por eventos. Sumar <b>rate limiting</b> por consumidor en el gateway.
          Atributos: <b>performance</b>, <b>escalabilidad</b> y <b>disponibilidad</b> (se protege la base principal).</p>
          <p><b>4a)</b> Un <b>scheduler/cron</b> semanal dispara en Estadísticas, que arma el resumen y <b>publica</b> un
          mensaje por usuario en una <b>cola</b> (o un evento en un topic); <b>Notificaciones</b> lo consume y envía el
          mail. Asincrónico porque el emisor no necesita la respuesta, absorbe el pico de miles de envíos escalando
          consumidores, y tolera la caída del proveedor de mail. <b>Idempotencia</b> (dedup por id de mensaje) para no
          mandar el resumen dos veces, <b>reintentos con backoff</b> y <b>DLQ</b>. Para no perder el evento por
          <b>doble escritura</b>, <b>Transactional Outbox</b>.</p>
          <p><b>4b) Integridad del resumen:</b> <b>firma digital o HMAC</b> del contenido generado (y publicar el hash),
          envío por canal cifrado (TLS), y si se almacena, guardar el <b>hash</b> para detectar alteraciones. Agregar
          <b>log de auditoría</b> de qué resumen se envió a quién y cuándo.</p>
          <p><b>5)</b> Ver la respuesta completa en el ejercicio final de
          <a class="inline" data-go="p2-escalabilidad">Escalabilidad</a>: horizontal + balanceador con health checks +
          autoescalado + <b>cola</b> para amortiguar el pico + caché + estado externalizado; atributos:
          <b>escalabilidad, disponibilidad, performance y tolerancia a fallos</b>, cada uno con el mecanismo que lo
          garantiza.</p>
        </details>

        <h3>Punto 3 — Persistencia (10 pts)</h3>
        <div class="card">
          <p>Sistema de Gestión de Bicicleteros Públicos. De cada <b>Bicicletero</b> se conoce su ubicación (dirección) y
          su <b>capacidad máxima</b> de bicicletas. Cada <b>Bicicleta</b> tiene un <b>código único</b>, un color y un
          <b>estado actual</b>, que puede ser: <b>Disponible, Ocupada o En Mantenimiento</b>. Cada bicicletero puede
          almacenar varias bicicletas, pero una bicicleta sólo puede estar asociada a un único bicicletero al mismo
          tiempo.</p>
          <p>Se pide un modelo de datos que persista el modelo indicando: qué elementos es necesario persistir; las
          <b>claves primarias, foráneas y restricciones</b> según corresponda; y, <b>si fueran necesarias, las estrategias
          de mapeo de herencia utilizadas</b>.</p>
        </div>
        <details class="qa">
          <summary>✅ Respuesta modelo — Punto 3</summary>
          ${APP.uml(`erDiagram
    BICICLETERO ||--o{ BICICLETA : "almacena (0,N)"
    BICICLETERO {
      int id_bicicletero PK
      string direccion "NOT NULL"
      int capacidad_maxima "NOT NULL CHECK (> 0)"
    }
    BICICLETA {
      int id_bicicleta PK
      string codigo "UNIQUE NOT NULL - clave natural"
      string color
      string estado "NOT NULL CHECK (DISPONIBLE, OCUPADA, EN_MANTENIMIENTO)"
      int id_bicicletero FK "NULL - puede estar en circulacion"
    }`, "Bicicleteros — modelo de datos")}
          <p><b>Qué se persiste y qué no.</b> Se persisten <b>Bicicletero</b> y <b>Bicicleta</b>: tienen identidad y
          ciclo de vida propios. <b>El estado NO se persiste como una entidad</b>: si en el diagrama de clases se modeló
          con el <b>patrón State</b> (una clase por estado), <b>esas clases son comportamiento, no datos</b>. Lo único
          que hay que persistir es <b>cuál es el estado actual</b>, como un atributo. Es el caso clásico de
          “<i>qué elementos del modelo es necesario persistir</i>”.</p>
          <p><b>Claves y restricciones.</b> PK <b>subrogada</b> (<code>id_bicicleta</code>) y además <b>UNIQUE</b> sobre
          <code>codigo</code>, que es la <b>clave natural</b> del negocio — así no pierdo la restricción “código único”
          sin acoplar las FK a un dato que podría cambiar. <code>capacidad_maxima</code> con <b>CHECK &gt; 0</b>.
          <code>estado</code> con <b>CHECK</b> sobre los tres valores (o FK a una tabla <code>ESTADO</code> si el negocio
          pudiera agregar estados). <code>id_bicicletero</code> es <b>FK</b> y admite <b>NULL</b>: la cardinalidad es 1 a
          N y la modalidad del lado de la bicicleta es <b>opcional</b>, porque “ocupada” significa que está en uso y no
          en un bicicletero. La FK del lado “muchos” garantiza por diseño que una bicicleta esté <b>en un único
          bicicletero a la vez</b>.</p>
          <p><b>Estrategia de herencia.</b> Si el diagrama de clases modela los estados con <b>State</b>
          (<i>Disponible</i>, <i>Ocupada</i>, <i>EnMantenimiento</i> como subclases de <i>EstadoBicicleta</i>), la
          respuesta correcta es <b>no mapear esa jerarquía</b>: son objetos sin estado propio que sólo encapsulan
          comportamiento, así que se persiste el <b>discriminador</b> (el enum) y el ORM reconstruye la instancia del
          estado al hidratar. Si en cambio <b>cada estado tuviera atributos propios</b> (por ejemplo,
          <i>EnMantenimiento</i> con motivo y fecha estimada de alta; <i>Ocupada</i> con el usuario y la hora de retiro),
          entonces sí hay datos que persistir y elegiría <b>SINGLE_TABLE con discriminador</b> por ser pocos atributos y
          siempre consultados junto con la bicicleta — asumiendo columnas nulables; con muchos atributos obligatorios por
          subtipo iría <b>JOINED</b>. <b>La mejora que habilita el enunciado</b> (“puede considerar realizar algún
          cambio que no afecte significativamente el diseño”): agregar una tabla
          <code>HISTORIAL_ESTADO(id, id_bicicleta FK, estado, desde, hasta, motivo)</code> para tener
          <b>trazabilidad</b> de los cambios de estado, que el atributo simple no permite.</p>
        </details>

        <h2>Autoevaluación</h2>
        <p>Resolvé en papel y después marcá honestamente qué cumpliste:</p>
        <div id="p2rub"></div>
      `;

      APP.rubrica(el.querySelector("#p2rub"), "p2-petguardian", [
        { t: "Enumeré todas las entidades con una descripción concisa de cada una", p: 5 },
        { t: "El DER tiene PK en todas las tablas (y aclaré natural / subrogada / compuesta)", p: 5 },
        { t: "Todas las relaciones tienen FK, cardinalidad Y modalidad indicadas", p: 6 },
        { t: "Resolví las N:M con tabla intermedia (y las que tienen datos propios tienen nombre de dominio)", p: 4 },
        { t: "No quedó ningún atributo multivaluado (alergias, horarios, adjuntos salieron a tablas hijas)", p: 4 },
        { t: "Puse restricciones: NOT NULL, UNIQUE, CHECK donde el enunciado las exige", p: 3 },
        { t: "Distinguí catálogo administrable (tabla) de enum cerrado (CHECK) y lo justifiqué", p: 3 },
        { t: "Elegí y justifiqué la estrategia de mapeo de herencia de Dispositivo", p: 4 },
        { t: "Escribí la lista de supuestos", p: 3 },
        { t: "Escribí los 3 párrafos de justificación: qué persistir / impedance mismatches / qué desnormalizar", p: 8 },
        { t: "Respondí confidencialidad con cifrado en tránsito y reposo, hash de passwords y control de acceso por rol con alcance", p: 5 },
        { t: "Arquitectura: propuse integración asincrónica (MQTT/broker) y expliqué POR QUÉ no sincrónica", p: 6 },
        { t: "Hice el diagrama de despliegue con nodos, componentes y PROTOCOLO en cada línea", p: 6 },
        { t: "JWT: expliqué cómo se aplica y al menos 3 ventajas frente a la sesión de servidor", p: 5 },
        { t: "Nativa vs híbrida: elegí una y DEFINÍ cada atributo de calidad que nombré", p: 5 },
        { t: "Propuse GraphQL para terceros y caché/réplicas para las consultas repetidas", p: 6 },
        { t: "Resúmenes por email: cola/evento + idempotencia + integridad con firma o hash", p: 6 },
        { t: "Picos de tráfico: escalado horizontal + LB + cola, con atributos y cómo se garantizan", p: 6 },
        { t: "Persistencia (bicicleteros): PK, UNIQUE del código, CHECK del estado y FK nullable", p: 5 },
        { t: "Persistencia: dije que las clases de State NO se persisten, sólo el estado actual", p: 5 },
      ]);
    },
  });
})();
