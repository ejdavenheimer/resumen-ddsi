/* =====================================================================
   Casos de los interactivos de práctica escrita.
   ===================================================================== */
(function () {
  "use strict";
  const D = window.APP.DATA = window.APP.DATA || {};

  /* ---- criterios reutilizables para "Escribí la justificación" ---- */
  const C_ENUNCIADO = { categoria: "Cita el enunciado", keywords: ["enunciado", "menciona", "indica", "requiere", "futuro", "agregarse", "dice", "aclara", "pide"], peso: 25 };
  function nombra(kw) { return { categoria: "Nombra el patrón/decisión", keywords: kw, peso: 25 }; }
  function principio(kw) { return { categoria: "Menciona un principio (SOLID)", keywords: kw, peso: 25 }; }
  const C_CUALIDAD = { categoria: "Menciona una cualidad de diseño", keywords: ["acoplamiento", "cohesion", "extensib", "mantenib", "reutiliz", "testeab"], peso: 25 };

  D.justificaciones = [
    { id: 1, tema: "Strategy",
      enunciado: "“El sistema debe aplicar distintos tipos de descuentos según el cliente, y se espera que en el futuro se agreguen más sin modificar la lógica existente.”",
      decision: "Usaste Strategy para el cálculo de descuentos.",
      criterios: [nombra(["strategy", "estrategia"]), C_ENUNCIADO, principio(["open/closed", "open closed", "ocp", "abierto", "cerrado", "solid"]), C_CUALIDAD],
      modelo: "Apliqué el patrón <b>Strategy</b> para el cálculo de descuentos. El <b>enunciado</b> menciona que existen varias formas de calcularlo y que en el <b>futuro</b> podrían agregarse más. Al encapsular cada algoritmo en una clase que implementa la interfaz <code>EstrategiaDeDescuento</code>, se cumple <b>Open/Closed</b>: agregar una variante no requiere modificar el código existente, sólo sumar una clase. Además favorece el <b>bajo acoplamiento</b>, ya que el contexto sólo conoce la abstracción, no las implementaciones concretas." },
    { id: 2, tema: "State",
      enunciado: "“Una solicitud pasa por los estados Pendiente, En revisión, Aceptado y Rechazado; según el estado se habilitan distintas transiciones. Es vital guardar trazabilidad.”",
      decision: "Usaste State para el ciclo de vida de la solicitud.",
      criterios: [nombra(["state", "estado"]), C_ENUNCIADO, principio(["open/closed", "ocp", "srp", "responsabilidad"]), C_CUALIDAD],
      modelo: "Apliqué <b>State</b> porque el <b>enunciado</b> describe un ciclo de vida con estados y transiciones válidas distintas según el estado actual. Cada estado se encapsula en su propia clase con sus transiciones, evitando cadenas de if/else (elimina el smell de <i>Switch Statements</i>). Cumple <b>SRP</b> (cada estado una responsabilidad) y <b>Open/Closed</b> (agregar un estado es una clase nueva), y mejora la <b>mantenibilidad</b> al concentrar la lógica de cada estado en un solo lugar. La trazabilidad se resuelve registrando cada transición en una bitácora." },
    { id: 3, tema: "Adapter",
      enunciado: "“El sistema debe integrarse con el servicio del RENAPER, que no es de nuestra propiedad y expone su propia interfaz.”",
      decision: "Usaste Adapter para integrar el RENAPER.",
      criterios: [nombra(["adapter", "adaptador"]), C_ENUNCIADO, principio(["dip", "inversion", "open/closed", "ocp"]), C_CUALIDAD],
      modelo: "Apliqué <b>Adapter</b> porque el <b>enunciado</b> indica que hay que integrarse con el RENAPER, que no está bajo nuestro control. Defino la interfaz <code>ValidadorDeIdentidad</code> en el dominio y un <code>RenaperAdapter</code> que la implementa y traduce las llamadas. Cumple <b>DIP</b> (el dominio depende de la abstracción) y <b>Open/Closed</b> (cambiar de proveedor es otro adapter). Reduce el <b>acoplamiento</b> con el servicio externo y mejora la <b>testeabilidad</b>, porque puedo inyectar un doble en los tests." },
    { id: 4, tema: "Observer",
      enunciado: "“Cuando una solicitud cambia de estado, hay que enviar mails, registrar en bitácora y actualizar un tablero. Podrían sumarse más acciones.”",
      decision: "Usaste Observer para reaccionar al cambio de estado.",
      criterios: [nombra(["observer", "observador"]), C_ENUNCIADO, principio(["open/closed", "ocp", "abierto"]), C_CUALIDAD],
      modelo: "Apliqué <b>Observer</b> porque el <b>enunciado</b> indica que varios componentes deben reaccionar al cambio de estado y que podrían sumarse más. El subject notifica sin conocer a los observers concretos, así que agregar una reacción no lo modifica (<b>Open/Closed</b>). Favorece el <b>bajo acoplamiento</b> entre el que emite el cambio y los que reaccionan." },
    { id: 5, tema: "Composite",
      enunciado: "“El catálogo tiene categorías que pueden contener subcategorías o productos, y hay que calcular el precio total de cualquier nodo.”",
      decision: "Usaste Composite para la estructura del catálogo.",
      criterios: [nombra(["composite", "compuesto"]), C_ENUNCIADO, principio(["open/closed", "ocp", "uniforme", "polimorf"]), C_CUALIDAD],
      modelo: "Apliqué <b>Composite</b> porque el <b>enunciado</b> describe una jerarquía en árbol donde una categoría puede contener otras categorías o productos. Hoja y compuesto implementan la misma interfaz <code>ElementoDeCatalogo</code>, y el compuesto delega recursivamente en sus hijos, de modo que <code>precio()</code> funciona igual sobre cualquier nodo. Mejora la <b>extensibilidad</b> (un tipo nuevo no toca los recorridos) y baja el <b>acoplamiento</b> del cliente, que no distingue tipos." },
    { id: 6, tema: "Facade",
      enunciado: "“Confirmar una reserva implica coordinar la agenda, el cálculo de copago, la validación clínica y la bitácora.”",
      decision: "Usaste Facade (un ReservaService) para el caso de uso.",
      criterios: [nombra(["facade", "fachada", "service"]), C_ENUNCIADO, principio(["srp", "responsabilidad", "dip"]), C_CUALIDAD],
      modelo: "Apliqué <b>Facade</b> mediante un <code>ReservaService</code> porque el <b>enunciado</b> describe un caso de uso que coordina varios componentes. El cliente conoce sólo el facade, que orquesta el subsistema por dentro. Esto respeta <b>SRP</b> (el controller sólo traduce HTTP), baja el <b>acoplamiento</b> y hace el caso de uso <b>reutilizable</b> desde otros canales." },
    { id: 7, tema: "Command",
      enunciado: "“Las entidades configuran acciones (mail, alerta, llamar API con método/URI/body) que se ejecutan al entrar en un estado.”",
      decision: "Usaste Command para las acciones configurables.",
      criterios: [nombra(["command", "comando"]), C_ENUNCIADO, principio(["open/closed", "ocp"]), C_CUALIDAD],
      modelo: "Apliqué <b>Command</b> porque el <b>enunciado</b> pide acciones configurables por el usuario, cada una con su propia parametrización (mensaje, URI, body). Cosificar cada acción como objeto con <code>ejecutar()</code> permite persistirlas, encolarlas y ejecutarlas después; un enum no podría llevar esa configuración. Cumple <b>Open/Closed</b> (una acción nueva es una clase) y desacopla el invoker del receiver, bajando el <b>acoplamiento</b>." },
    { id: 8, tema: "Template Method",
      enunciado: "“Todos los reportes validan, consultan datos, arman el archivo y lo envían; sólo cambia la consulta y el armado.”",
      decision: "Usaste Template Method para los reportes.",
      criterios: [nombra(["template", "plantilla", "esqueleto"]), C_ENUNCIADO, principio(["dry", "duplicad", "open/closed", "ocp"]), C_CUALIDAD],
      modelo: "Apliqué <b>Template Method</b> porque el <b>enunciado</b> indica que los reportes comparten el mismo esqueleto de pasos y sólo varían algunos. La clase abstracta define el algoritmo (método final) y los pasos comunes; cada subclase implementa sólo los específicos. Evita la duplicación (<b>DRY</b>) y mejora la <b>mantenibilidad</b>, porque un cambio en un paso común se hace en un solo lugar." },
    { id: 9, tema: "Simple Factory",
      enunciado: "“Según el tipo de mensaje que llega, hay que instanciar el procesador correspondiente, y ese switch está repetido en tres lugares.”",
      decision: "Usaste una Simple Factory para crear los procesadores.",
      criterios: [nombra(["factory", "fabrica"]), C_ENUNCIADO, principio(["open/closed", "ocp", "dry", "duplicad"]), C_CUALIDAD],
      modelo: "Apliqué una <b>Simple Factory</b> porque el <b>enunciado</b> muestra que la decisión de qué procesador crear está duplicada. Concentrarla en <code>ProcesadorFactory.para(tipo)</code> elimina la duplicación (<b>DRY</b>) y hace que el resto del código dependa sólo de la abstracción <code>Procesador</code>, bajando el <b>acoplamiento</b>. Agregar un tipo se hace en un único punto." },
    { id: 10, tema: "Builder",
      enunciado: "“El usuario arma un reporte configurable eligiendo qué secciones incluir; muchas opciones son opcionales.”",
      decision: "Usaste Builder para construir el reporte.",
      criterios: [nombra(["builder", "constructor"]), C_ENUNCIADO, principio(["long parameter", "parametros", "telescop"]), C_CUALIDAD],
      modelo: "Apliqué <b>Builder</b> porque el <b>enunciado</b> plantea un objeto con muchos atributos opcionales que el usuario arma por partes. El Builder lo construye paso a paso de forma legible y valida la consistencia antes de instanciarlo, evitando el constructor telescópico (<i>Long Parameter List</i>). Mejora la <b>mantenibilidad</b> y la legibilidad." },
    { id: 11, tema: "Arquitectura",
      enunciado: "“El servicio de IA puede tardar más de un minuto y se esperan picos de tráfico en eventos masivos.”",
      decision: "Propusiste comunicación asincrónica con un broker.",
      criterios: [nombra(["async", "asincron", "cola", "broker", "202"]), C_ENUNCIADO, principio(["acoplamiento temporal", "timeout", "cascada", "usabilidad"]), { categoria: "Menciona el beneficio (picos/desacople)", keywords: ["pico", "amortigua", "desacopl", "escala", "buffer"], peso: 25 }],
      modelo: "Propuse comunicación <b>asincrónica</b> mediante una <b>cola/broker</b> porque el <b>enunciado</b> indica que el servicio de IA puede demorar más de un minuto y que hay picos de tráfico. Una llamada sincrónica generaría <b>timeouts</b> y <b>acoplamiento temporal</b>. El servicio responde 202 y publica el mensaje; la cola <b>amortigua los picos</b> y permite escalar los consumidores, mejorando la <b>disponibilidad</b> y la usabilidad (el usuario no queda bloqueado)." },
    { id: 12, tema: "Arquitectura",
      enunciado: "“Se prevé sumar una app mobile y los contratos de los microservicios no deben cambiar por necesidades de la UI.”",
      decision: "Propusiste API Gateway + BFF por canal.",
      criterios: [nombra(["bff", "backend for frontend", "gateway"]), C_ENUNCIADO, principio(["contrato", "desacopl", "reutiliz"]), C_CUALIDAD],
      modelo: "Propuse un <b>API Gateway + un BFF por canal</b> porque el <b>enunciado</b> pide sumar mobile sin cambiar los contratos de los microservicios por necesidades de la UI. El BFF compone y adapta las respuestas de cada canal, dejando los contratos intactos. Esto desacopla el frontend del backend y favorece la <b>reutilización</b> de la lógica de negocio, que queda en los servicios." },
    { id: 13, tema: "Persistencia",
      enunciado: "“El servicio recibe de una IA documentos JSON de estructura variable, que se consultan completos por rival.”",
      decision: "Elegiste persistencia documental (no relacional).",
      criterios: [nombra(["documental", "mongo", "no relacional", "nosql"]), C_ENUNCIADO, principio(["esquema", "flexible", "estructura variable", "sin relacion"]), { categoria: "Contrasta con relacional", keywords: ["relacional", "columna", "null", "join"], peso: 25 }],
      modelo: "Elegí persistencia <b>documental</b> (no relacional) porque el <b>enunciado</b> indica que la IA devuelve documentos JSON de <b>estructura variable</b> que se consultan completos por rival y no tienen relaciones que recorrer. Una base <b>relacional</b> obligaría a una columna por campo posible (mar de nulls) y a migrar el esquema cada vez que la IA cambia su salida. La documental da esquema flexible y encaja con el patrón de acceso." },
    { id: 14, tema: "Seguridad",
      enunciado: "“¿Qué mecanismo de seguridad brinda confidencialidad en los datos almacenados?”",
      decision: "Propusiste cifrado en reposo con claves en un KMS.",
      criterios: [nombra(["cifrado en reposo", "encryption at rest", "aes", "cifrado"]), C_ENUNCIADO, principio(["confidencialidad", "columna", "kms", "vault"]), { categoria: "Descarta TLS/hash", keywords: ["transito", "tls", "https", "hash"], peso: 25 }],
      modelo: "Propuse <b>cifrado en reposo</b> (AES a nivel columna) para los campos sensibles, con las claves en un <b>KMS</b> externo. El <b>enunciado</b> habla de datos <b>almacenados</b>, así que TLS/HTTPS no alcanza (protege el tránsito) y el hash tampoco sirve porque los datos hay que poder leerlos. Esto brinda <b>confidencialidad</b> en reposo sin acoplar la solución al motor de base." },
    { id: 15, tema: "No sobreingeniería",
      enunciado: "“El sistema calcula el IVA, que es siempre 21%. No se prevén otras alícuotas.”",
      decision: "Decidiste NO aplicar Strategy.",
      criterios: [nombra(["no", "evite", "sin patron", "sobreingenieria", "constructor", "constante"]), C_ENUNCIADO, principio(["una variante", "un tipo", "simple", "innecesar"]), { categoria: "Justifica la simplicidad", keywords: ["sobreingenieria", "simple", "beneficio", "extension", "innecesar"], peso: 25 }],
      modelo: "Decidí <b>no aplicar Strategy</b> porque el <b>enunciado</b> plantea una sola forma de calcular el IVA y no menciona necesidad de extensión. Agregar esa abstracción sería <b>sobreingeniería</b> sin beneficio. Preferí una solución más <b>simple</b> (una constante o un cálculo directo); si en el futuro aparecen variantes, ahí sí introduciría el patrón." },
  ];

  /* -------------------- Verdadero o Falso -------------------- */
  D.vf = [
    { id: 1, tema: "Diseño", afirmacion: "El Diseño de Software incluye al Diseño de Sistemas.", respuesta: "F",
      modelo: "Es al revés: el <b>Diseño de Sistemas de Información</b> es más abarcativo — incluye al diseño de software, pero también hardware, procesos, personas, datos e infraestructura." },
    { id: 2, tema: "Diseño", afirmacion: "El atributo de calidad “disponibilidad” no se encuentra categorizado en la norma ISO 25000.", respuesta: "F",
      modelo: "La disponibilidad <b>sí</b> está en ISO/IEC 25010 (familia 25000), como subcaracterística de <b>Fiabilidad</b>." },
    { id: 3, tema: "Patrones", afirmacion: "El patrón Composite es posible implementarlo en un lenguaje funcional como Haskell.", respuesta: "V",
      modelo: "Los patrones son soluciones conceptuales, no atadas a un paradigma. En Haskell se modela con tipos algebraicos recursivos (sum types) y funciones que operan uniformemente sobre hojas y nodos." },
    { id: 4, tema: "Testing", afirmacion: "La ejecución de un testing que encuentra fallas es producto de que su diseño fue el correcto.", respuesta: "V",
      modelo: "Un test que encuentra una falla cumplió su objetivo. Un test bien diseñado es el que tiene alta probabilidad de revelar defectos, no el que siempre pasa (Dijkstra: muestra la presencia de errores, no su ausencia)." },
    { id: 5, tema: "Fundamentos", afirmacion: "Cuando nos referimos a un framework entendemos que se maneja el concepto de control directo.", respuesta: "F",
      modelo: "En un framework hay <b>inversión de control</b>: el framework llama a nuestro código (“no me llames, yo te llamo”). El control directo corresponde a las bibliotecas." },
    { id: 6, tema: "Diseño", afirmacion: "Los requerimientos funcionales hacen referencia a atributos de calidad.", respuesta: "F",
      modelo: "Los atributos de calidad se corresponden con los requerimientos <b>no funcionales</b>. Los funcionales describen qué debe hacer el sistema." },
    { id: 7, tema: "Patrones", afirmacion: "Simple Factory es uno de los patrones del catálogo GoF.", respuesta: "F",
      modelo: "No lo es: es un idiom muy difundido (Static Factory). Los creacionales de GoF son Abstract Factory, Builder, Factory Method, Prototype y Singleton." },
    { id: 8, tema: "Patrones", afirmacion: "Strategy y State tienen diagramas de clases casi idénticos; lo que los distingue es la intención.", respuesta: "V",
      modelo: "Ambos usan una interfaz con implementaciones y un contexto que delega. Lo que cambia es quién provoca el cambio (el cliente en Strategy, el propio objeto en State) y si los estados se conocen entre sí." },
    { id: 9, tema: "Patrones", afirmacion: "Meter un patrón innecesario en un diagrama de parcial suma puntos porque demuestra conocimiento.", respuesta: "F",
      modelo: "Resta: es sobreingeniería. Toda decisión de diseño debe justificarse con un requerimiento del enunciado. Un patrón sin necesidad muestra falta de criterio." },
    { id: 10, tema: "SOLID", afirmacion: "Poner una interfaz delante de una clase de infraestructura garantiza cumplir DIP.", respuesta: "F",
      modelo: "Sólo si la abstracción está en el vocabulario del dominio y la define el módulo de alto nivel. Si la interfaz devuelve un ResultSet o el DTO del proveedor, el detalle se filtró y el acoplamiento sigue." },
    { id: 11, tema: "SOLID", afirmacion: "Una clase que implementa una interfaz y tiene la mitad de los métodos con UnsupportedOperationException viola ISP.", respuesta: "V",
      modelo: "Viola ISP (depende de métodos que no usa) y de paso LSP (no es sustituible). Se resuelve segregando la interfaz en interfaces más chicas." },
    { id: 12, tema: "HTTP", afirmacion: "PUT y DELETE son idempotentes; POST no lo es.", respuesta: "V",
      modelo: "PUT reemplaza con un contenido fijo y DELETE elimina: repetirlos deja el mismo estado. POST crea un recurso nuevo en cada llamada, salvo clave de idempotencia." },
    { id: 13, tema: "HTTP", afirmacion: "El código 202 significa que la operación se completó con éxito y devuelve el recurso.", respuesta: "F",
      modelo: "202 Accepted significa “acepté el pedido, lo proceso después” (asincronismo). El que devuelve el recurso creado es 201; el éxito con body es 200." },
    { id: 14, tema: "HTTP", afirmacion: "Un usuario autenticado sin permisos sobre un recurso debe recibir 403, no 401.", respuesta: "V",
      modelo: "401 = no sé quién sos (autenticación). 403 = sé quién sos y no podés (autorización). El usuario ya está autenticado, así que es 403." },
    { id: 15, tema: "REST", afirmacion: "REST obliga a usar JSON como formato de las representaciones.", respuesta: "F",
      modelo: "REST no impone formato: JSON es lo habitual, pero se puede servir XML, CSV, etc., negociando con el header Accept. Lo que exige es interfaz uniforme, recursos y stateless." },
    { id: 16, tema: "REST", afirmacion: "En REST, la URL <code>POST /crearUsuario</code> está bien diseñada.", respuesta: "F",
      modelo: "La acción la da el verbo HTTP; la URL nombra el recurso (sustantivo). Lo correcto es <code>POST /usuarios</code>." },
    { id: 17, tema: "Arquitectura", afirmacion: "El escalado horizontal requiere que los servicios sean stateless (o compartan la sesión).", respuesta: "V",
      modelo: "Si el servicio guarda estado en memoria, el balanceador puede mandar la request a otra instancia que no lo tiene. Stateless + token permite que cualquier instancia atienda cualquier request." },
    { id: 18, tema: "Arquitectura", afirmacion: "Adoptar microservicios elimina la complejidad, porque cada servicio es más simple.", respuesta: "F",
      modelo: "Cada servicio es más simple, pero aparece complejidad operativa (observabilidad, tracing, despliegues), consistencia eventual y latencia de red. Es un trade-off, no una eliminación de complejidad." },
    { id: 19, tema: "Arquitectura", afirmacion: "Guardar los videos como BLOB en la base relacional es una buena práctica para reducir la carga del servidor.", respuesta: "F",
      modelo: "Los binarios grandes no van en la base (infla backups, mata performance). Se usan object storage + CDN, entregando URLs firmadas." },
    { id: 20, tema: "Integración", afirmacion: "Un consumidor de mensajes debe ser idempotente porque los brokers pueden reentregar un mensaje.", respuesta: "V",
      modelo: "Los brokers garantizan at-least-once: si el consumidor procesa y muere antes del ACK, el mensaje se reentrega. Sin idempotencia se duplican cobros o reservas." },
    { id: 21, tema: "Integración", afirmacion: "En una cola de trabajo (point-to-point) con 5 consumidores, cada mensaje lo procesan los 5.", respuesta: "F",
      modelo: "En point-to-point cada mensaje va a UN solo consumidor (reparto de carga). Para que todos reciban copia hace falta pub/sub." },
    { id: 22, tema: "Integración", afirmacion: "Observer y Publicación-Suscripción son lo mismo, sin diferencias.", respuesta: "F",
      modelo: "Misma intención, distinta escala. Observer es in-process (el subject conoce la lista); Pub/Sub es entre sistemas, con broker, asincrónico, y el publicador no conoce a los suscriptores." },
    { id: 23, tema: "Seguridad", afirmacion: "El payload de un JWT viaja cifrado, así que se pueden guardar datos sensibles en él.", respuesta: "F",
      modelo: "El JWT está firmado, no cifrado. El payload es Base64 y cualquiera que lo intercepte lo lee. La firma da integridad, no confidencialidad." },
    { id: 24, tema: "Seguridad", afirmacion: "Las contraseñas se deben guardar cifradas para poder recuperarlas si el usuario las olvida.", respuesta: "F",
      modelo: "Se guardan <b>hasheadas</b> (con salt, bcrypt/Argon2), no cifradas. El hash es irreversible: por eso “olvidé mi contraseña” manda un link para crear una nueva, no la actual." },
    { id: 25, tema: "Seguridad", afirmacion: "Ocultar un botón en el frontend es un control de seguridad suficiente para la autorización.", respuesta: "F",
      modelo: "El frontend puede ocultar el botón por usabilidad, pero cualquiera puede llamar al endpoint directamente. La autorización se valida SIEMPRE en el servidor." },
    { id: 26, tema: "Testing", afirmacion: "“Verificación” responde a la pregunta “¿estamos construyendo el producto correcto (lo que el usuario necesita)?”.", respuesta: "F",
      modelo: "Esa es la <b>validación</b>. La verificación responde “¿lo estamos construyendo bien (según la especificación)?”." },
  ];

  /* -------------------- Pseudocódigo breve -------------------- */
  D.pseudocodigos = [
    { id: 1, tema: "State + Command", requerimiento: "“Permitir que las entidades configuren las acciones a ejecutar cada vez que una solicitud entra en un estado.” (GTV)",
      modelo:
`class Solicitud {
    estado: EstadoSolicitud
    bitacora: List<Entrada>

    cambiarEstado(nuevoEstado, actor, motivo) {
        estado.validarTransicionA(nuevoEstado)
        bitacora.agregar(new Entrada(estado, nuevoEstado, motivo, actor, hoy()))
        this.estado = nuevoEstado
        // dispara las acciones configuradas por la entidad para ese estado
        para cada accion en entidad.accionesDe(nuevoEstado):
            accion.ejecutar(new Contexto(this))
    }
}

interface Accion { ejecutar(contexto) }
class EnviarMail implements Accion { ... }
class LlamarApiExterna implements Accion { metodo; uri; mapeoCampos; ... }`,
      checklist: [
        "Modelé el estado como objeto (State), no como String",
        "Registré la trazabilidad en la bitácora al cambiar de estado",
        "Las acciones son objetos que implementan una interfaz común (Command)",
        "El disparo recorre las acciones configuradas sin conocer las clases concretas",
        "La acción de API externa lleva su configuración (método, URI, mapeo)",
      ] },
    { id: 2, tema: "Strategy", requerimiento: "“Calcular el costo de envío, que puede ser estándar, express o retiro, y podrían agregarse más.”",
      modelo:
`interface EstrategiaDeCosto { calcular(pedido): Monto }

class CostoEstandar implements EstrategiaDeCosto { calcular(p) { return p.peso * 100 } }
class CostoExpress  implements EstrategiaDeCosto { calcular(p) { return p.peso * 200 + 500 } }
class CostoRetiro   implements EstrategiaDeCosto { calcular(p) { return 0 } }

class Envio {
    estrategia: EstrategiaDeCosto     // se inyecta
    calcularCosto(pedido) { return estrategia.calcular(pedido) }
}`,
      checklist: [
        "Definí una interfaz común para las estrategias",
        "Una clase por variante de cálculo",
        "El contexto (Envio) tiene la estrategia como atributo",
        "El contexto delega en la abstracción, sin if por tipo",
        "La estrategia se inyecta (no se crea con new adentro)",
      ] },
    { id: 3, tema: "Motor de reglas", requerimiento: "“Calcular el copago aplicando varias reglas que pueden combinarse, y podrían agregarse nuevas.” (TurnoÁgil)",
      modelo:
`interface ReglaDeCopago { aplica(turno): boolean; aplicar(turno, monto): Monto }

class MotorDeCopagos {
    reglas: List<ReglaDeCopago>       // se inyecta la colección

    calcular(turno) {
        copago = 0
        para cada regla en reglas:
            si regla.aplica(turno):
                copago = regla.aplicar(turno, copago)
        return copago
    }
}`,
      checklist: [
        "Cada regla es una estrategia con su propia clase",
        "El motor tiene una COLECCIÓN de reglas (no una sola)",
        "Cada regla decide sola si aplica (método aplica)",
        "El motor no tiene ningún if por tipo de regla",
        "Se pueden aplicar varias reglas en cadena",
      ] },
    { id: 4, tema: "Adapter", requerimiento: "“Validar la identidad de una persona contra el RENAPER, que no podemos modificar.”",
      modelo:
`interface ValidadorDeIdentidad { validar(persona): boolean }

class RenaperAdapter implements ValidadorDeIdentidad {
    client: RenaperHttpClient
    validar(persona) {
        respuesta = client.consultarDni(persona.tipoDoc, persona.nroDoc, persona.nombre)
        return respuesta.coincide
    }
}

class RegistroService {
    validador: ValidadorDeIdentidad   // se inyecta la abstracción
    registrar(persona) {
        si no validador.validar(persona): throw IdentidadInvalida
        repo.guardar(persona)
    }
}`,
      checklist: [
        "La interfaz está en el vocabulario del dominio (validar(persona))",
        "El adapter implementa la interfaz y envuelve al cliente externo",
        "El service depende de la abstracción, no del adapter concreto",
        "El adapter traduce entre el dominio y la API externa",
      ] },
    { id: 5, tema: "State (préstamo)", requerimiento: "“Prestar un ejemplar sólo si quien lo presta lo tiene en su poder y ambos comparten comunidad.” (Libros)",
      modelo:
`class Ejemplar {
    estado: EstadoEjemplar
    prestar(de, a, vencimiento) { estado.prestar(this, de, a, vencimiento) }
}

class EnPoderDe implements EstadoEjemplar {
    prestar(ejemplar, de, a, vencimiento) {
        si no ejemplar.estaEnPoderDe(de): throw NoLoTiene
        si no de.comparteComunidadActivaCon(a): throw SinComunidad
        ejemplar.registrar(new Prestamo(de, a, vencimiento))
        ejemplar.cambiarTenedor(a)
    }
}
class DadoDeBaja implements EstadoEjemplar { /* rechaza todo */ }`,
      checklist: [
        "El estado es un objeto (State), con las validaciones adentro",
        "Las reglas viven en el dominio, no en un service",
        "El estado dado de baja rechaza todas las operaciones",
        "Se distingue tenedor de propietario",
      ] },
    { id: 6, tema: "Observer", requerimiento: "“Al aprobar un pago, notificar a contabilidad, fidelización y reportes, y poder sumar más interesados.”",
      modelo:
`class Pago {
    observers: List<Observer>
    suscribir(o) { observers.agregar(o) }

    aprobar() {
        this.estado = APROBADO
        notificar(new EventoPagoAprobado(this))
    }
    notificar(evento) { para cada o en observers: o.alAprobar(evento) }
}

interface Observer { alAprobar(evento) }
class Contabilidad implements Observer { ... }
class Fidelizacion implements Observer { ... }`,
      checklist: [
        "El subject mantiene una lista de observers",
        "Notifica sin conocer las clases concretas",
        "Cada interesado implementa la interfaz Observer",
        "Se pueden agregar/quitar observers sin tocar el subject",
        "La notificación viaja en un objeto evento",
      ] },
    { id: 7, tema: "Template Method", requerimiento: "“Todos los reportes validan, consultan, arman y envían; sólo cambian la consulta y el armado.”",
      modelo:
`abstract class Reporte {
    final generar(params) {          // template method: orden fijo
        validar(params)
        datos = consultarDatos(params)   // varía
        archivo = armarArchivo(datos)    // varía
        enviar(archivo)
    }
    abstract consultarDatos(params)
    abstract armarArchivo(datos)
    validar(p) { ... }               // común
    enviar(a) { ... }                // común
}
class ReporteVentas extends Reporte { consultarDatos(p){...} armarArchivo(d){...} }`,
      checklist: [
        "La clase abstracta define el método plantilla con el orden fijo",
        "El método plantilla es final",
        "Los pasos que varían son abstractos",
        "Los pasos comunes están implementados una sola vez",
        "Cada subclase implementa sólo lo específico",
      ] },
    { id: 8, tema: "Simple Factory", requerimiento: "“Según el tipo de mensaje, instanciar el procesador correspondiente, centralizando la decisión.”",
      modelo:
`class ProcesadorFactory {
    static para(tipo): Procesador {
        segun tipo:
            ALTA -> return new ProcesadorAlta()
            BAJA -> return new ProcesadorBaja()
            MODIFICACION -> return new ProcesadorModificacion()
    }
}

class Consumidor {
    procesar(mensaje) {
        ProcesadorFactory.para(mensaje.tipo).procesar(mensaje)
    }
}`,
      checklist: [
        "La decisión de creación está en un solo lugar (la factory)",
        "Devuelve la abstracción Procesador",
        "Los clientes no conocen las clases concretas",
        "Agregar un tipo se hace en un único punto",
      ] },
    { id: 9, tema: "Cron", requerimiento: "“Anular automáticamente los formularios vencidos y avisar por mail a la entidad.” (GTV)",
      modelo:
`class VencimientoDeFormularios {
    @Scheduled(diario a las 3 AM)
    anularVencidos() {
        para cada f en formularioRepo.vencidosAl(hoy()):
            f.anularPorVencimiento()          // la lógica vive en el dominio
            eventos.publicar(new FormularioAnulado(f))   // Observer manda el mail
    }
}`,
      checklist: [
        "Es un proceso programado (cron / @Scheduled), no disparado por el usuario",
        "La lógica de anulación vive en el dominio (formulario)",
        "Se publica un evento para notificar (desacoplado del envío)",
        "Considera ejecución única / lotes si hay volumen (mencionar)",
      ] },
    { id: 10, tema: "Facade", requerimiento: "“Confirmar una contratación coordinando cotización, validación, persistencia y notificación.” (ProtegePro)",
      modelo:
`class ContratacionService {          // Facade del caso de uso
    contratar(datos): Codigo {
        equipo = inventario.porQr(datos.qr)
        cotizacion = motorRiesgo.cotizar(equipo, datos.contexto)
        c = Contratacion.nueva(equipo, cotizacion)
        validacion.solicitar(c, datos.fotos)   // async
        repo.guardar(c)
        notificador.enviar(datos.usuario, c.codigo)
        return c.codigo
    }
}`,
      checklist: [
        "Un único punto de entrada coordina el subsistema",
        "El cliente (controller) sólo conoce el facade",
        "Las reglas de negocio quedan en el dominio, no en el facade",
        "La validación lenta se dispara de forma asincrónica",
      ] },
  ];
})();
