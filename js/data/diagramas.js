/* =====================================================================
   "Armá el diagrama" — 8 ejercicios de dificultad creciente.
   Formato simplificado (y autocorregible):
     1) elegir qué clases van (hay distractores)
     2) para cada par, elegir la relación
   Tipos de relación: herencia | composicion | asociacion | dependencia | ninguna
   ===================================================================== */
(function () {
  "use strict";
  const D = window.APP.DATA = window.APP.DATA || {};

  D.diagramas = [
    {
      id: 1,
      titulo: "Costo de envío con Strategy",
      nivel: "Fácil",
      enunciado: "Un pedido puede enviarse de forma estándar, express o retirarse en sucursal. Cada modalidad calcula el costo de manera distinta y se espera sumar más modalidades en el futuro.",
      clases: ["Envio", "EstrategiaDeCosto", "CostoEstandar", "CostoExpress", "CostoRetiro", "Pedido", "EnvioManager", "TipoDeEnvioEnum"],
      correctas: ["Envio", "EstrategiaDeCosto", "CostoEstandar", "CostoExpress", "CostoRetiro", "Pedido"],
      distractoresPorQue: {
        "EnvioManager": "“Manager” es un nombre sin responsabilidad clara: es un code smell. Si necesitás coordinar, llamalo por lo que hace (<code>EnvioService</code>) — pero acá no hace falta.",
        "TipoDeEnvioEnum": "El enum es justamente lo que Strategy viene a reemplazar: si lo mantenés, vuelve el switch.",
      },
      relaciones: [
        { a: "EstrategiaDeCosto", b: "CostoEstandar", ok: "herencia", why: "<code>CostoEstandar</code> implementa la interfaz <code>EstrategiaDeCosto</code> (en UML, línea punteada con triángulo)." },
        { a: "Envio", b: "EstrategiaDeCosto", ok: "asociacion", why: "El envío <b>tiene</b> una estrategia que le inyectan; conoce la abstracción, nunca la implementación concreta." },
        { a: "Envio", b: "Pedido", ok: "asociacion", why: "El envío se hace sobre un pedido: lo conoce y se lo pasa a la estrategia." },
        { a: "EstrategiaDeCosto", b: "Pedido", ok: "dependencia", why: "La estrategia recibe el pedido como <b>parámetro</b> de <code>calcular(Pedido)</code>, no lo guarda: eso es dependencia (flecha punteada)." },
      ],
      solucion: `classDiagram
    class EstrategiaDeCosto {
        <<interface>>
        +calcular(Pedido) double
    }
    class CostoEstandar { +calcular(Pedido) double }
    class CostoExpress  { +calcular(Pedido) double }
    class CostoRetiro   { +calcular(Pedido) double }
    class Envio {
        -estrategia: EstrategiaDeCosto
        +calcularCosto(Pedido) double
    }
    class Pedido { -peso: double }
    EstrategiaDeCosto <|.. CostoEstandar
    EstrategiaDeCosto <|.. CostoExpress
    EstrategiaDeCosto <|.. CostoRetiro
    Envio --> EstrategiaDeCosto
    Envio --> Pedido
    EstrategiaDeCosto ..> Pedido : usa`,
      explicacion: "Fijate que <code>Envio</code> nunca nombra a <code>CostoExpress</code>: depende sólo de la abstracción. Ese es el punto que hace que agregar <code>CostoInternacional</code> no toque nada existente.",
    },

    {
      id: 2,
      titulo: "Catálogo jerárquico con Composite",
      nivel: "Fácil",
      enunciado: "Un catálogo se organiza en categorías que pueden contener productos u otras categorías. Se necesita calcular el precio total de cualquier nodo.",
      clases: ["ElementoDeCatalogo", "Producto", "Categoria", "Catalogo", "CalculadoraDePrecios", "NodoHoja"],
      correctas: ["ElementoDeCatalogo", "Producto", "Categoria", "Catalogo"],
      distractoresPorQue: {
        "CalculadoraDePrecios": "El precio lo sabe calcular cada elemento (eso es el patrón). Sacar el cálculo afuera te obliga a preguntar el tipo con <code>instanceof</code>.",
        "NodoHoja": "Es el nombre del rol en el libro de GoF, no una clase del dominio. En el diagrama van los nombres del negocio: <code>Producto</code>.",
      },
      relaciones: [
        { a: "ElementoDeCatalogo", b: "Producto", ok: "herencia", why: "El producto es la <b>hoja</b>: implementa la interfaz común." },
        { a: "ElementoDeCatalogo", b: "Categoria", ok: "herencia", why: "La categoría es el <b>compuesto</b>: también implementa la interfaz común. Ese es el truco del patrón." },
        { a: "Categoria", b: "ElementoDeCatalogo", ok: "composicion", why: "La categoría <b>contiene</b> una colección de elementos (agregación/composición, con multiplicidad <code>*</code>). Es la relación recursiva que forma el árbol." },
        { a: "Catalogo", b: "ElementoDeCatalogo", ok: "asociacion", why: "El catálogo conoce la raíz del árbol." },
      ],
      solucion: `classDiagram
    class ElementoDeCatalogo {
        <<interface>>
        +precio() double
        +nombre() String
    }
    class Producto {
        -nombre: String
        -precio: double
        +precio() double
    }
    class Categoria {
        -nombre: String
        -hijos: List~ElementoDeCatalogo~
        +agregar(ElementoDeCatalogo) void
        +precio() double
    }
    class Catalogo { -raiz: ElementoDeCatalogo }
    ElementoDeCatalogo <|.. Producto
    ElementoDeCatalogo <|.. Categoria
    Categoria o-- "*" ElementoDeCatalogo : contiene
    Catalogo --> ElementoDeCatalogo`,
      explicacion: "La relación clave es <code>Categoria o-- ElementoDeCatalogo</code>: el compuesto apunta a la <b>abstracción</b>, no a sí mismo. Por eso una categoría puede contener productos y categorías indistintamente.",
    },

    {
      id: 3,
      titulo: "Ciclo de vida de un pedido con State",
      nivel: "Medio",
      enunciado: "Un pedido pasa por los estados Pendiente → Pagado → Enviado → Entregado. En cada estado sólo algunas operaciones son válidas: no se puede enviar sin pagar, no se puede cancelar si ya está entregado.",
      clases: ["Pedido", "EstadoPedido", "Pendiente", "Pagado", "Enviado", "Entregado", "EstadoEnum", "PedidoValidator"],
      correctas: ["Pedido", "EstadoPedido", "Pendiente", "Pagado", "Enviado", "Entregado"],
      distractoresPorQue: {
        "EstadoEnum": "Si dejás el enum, el comportamiento vuelve a resolverse con <code>if</code> sobre su valor: es exactamente lo que State elimina.",
        "PedidoValidator": "Las validaciones de qué transición es válida son responsabilidad de <b>cada estado</b>, no de un validador externo que tenga que preguntar el estado actual.",
      },
      relaciones: [
        { a: "EstadoPedido", b: "Pendiente", ok: "herencia", why: "Cada estado concreto implementa la interfaz <code>EstadoPedido</code>." },
        { a: "Pedido", b: "EstadoPedido", ok: "asociacion", why: "El pedido tiene un estado actual y le delega las operaciones." },
        { a: "Pendiente", b: "Pedido", ok: "dependencia", why: "El estado recibe el pedido como parámetro para poder cambiarle el estado (<code>pagar(Pedido p)</code> hace <code>p.setEstado(new Pagado())</code>). No lo guarda como atributo." },
        { a: "Pendiente", b: "Pagado", ok: "dependencia", why: "<code>Pendiente</code> instancia <code>Pagado</code> en la transición: es una dependencia de creación, no una asociación permanente." },
      ],
      solucion: `classDiagram
    class Pedido {
        -estado: EstadoPedido
        +pagar() void
        +enviar() void
        +setEstado(EstadoPedido) void
    }
    class EstadoPedido {
        <<interface>>
        +pagar(Pedido) void
        +enviar(Pedido) void
        +cancelar(Pedido) void
    }
    class Pendiente
    class Pagado
    class Enviado
    class Entregado
    EstadoPedido <|.. Pendiente
    EstadoPedido <|.. Pagado
    EstadoPedido <|.. Enviado
    EstadoPedido <|.. Entregado
    Pedido --> EstadoPedido : estado actual
    Pendiente ..> Pagado : transiciona a
    Pagado ..> Enviado : transiciona a
    Enviado ..> Entregado : transiciona a`,
      explicacion: "Cada estado implementa <b>todas</b> las operaciones: las que puede, transicionando; las que no, lanzando excepción o devolviendo un error de negocio. Así ninguna clase necesita preguntar “¿en qué estado estoy?”.",
    },

    {
      id: 4,
      titulo: "Integración con un servicio externo (Adapter)",
      nivel: "Medio",
      enunciado: "El registro de personas debe validar la identidad contra el servicio del RENAPER, que expone una API REST propia. Queremos poder cambiar de proveedor o mockearlo en los tests.",
      clases: ["RegistroService", "ValidadorDeIdentidad", "RenaperAdapter", "RenaperHttpClient", "Persona", "RenaperService", "ValidadorMock"],
      correctas: ["RegistroService", "ValidadorDeIdentidad", "RenaperAdapter", "RenaperHttpClient", "Persona", "ValidadorMock"],
      distractoresPorQue: {
        "RenaperService": "Duplica al adapter con otro nombre. Un solo objeto traduce: el adapter.",
      },
      relaciones: [
        { a: "ValidadorDeIdentidad", b: "RenaperAdapter", ok: "herencia", why: "El adapter implementa la interfaz que define <b>tu</b> dominio." },
        { a: "RegistroService", b: "ValidadorDeIdentidad", ok: "asociacion", why: "El service depende de la abstracción (DIP). Nunca nombra al adapter concreto." },
        { a: "RenaperAdapter", b: "RenaperHttpClient", ok: "asociacion", why: "El adapter envuelve al cliente HTTP del proveedor: lo tiene como colaborador y traduce sus llamadas." },
        { a: "ValidadorDeIdentidad", b: "ValidadorMock", ok: "herencia", why: "El mock de test implementa la misma interfaz: por eso el service se puede testear sin red. Es el beneficio concreto de DIP." },
        { a: "RegistroService", b: "RenaperHttpClient", ok: "ninguna", why: "🚩 Si existiera esta relación, el patrón no serviría de nada: el service estaría acoplado al detalle del proveedor." },
      ],
      solucion: `classDiagram
    class ValidadorDeIdentidad {
        <<interface>>
        +validar(Persona) boolean
    }
    class RenaperAdapter {
        -client: RenaperHttpClient
        +validar(Persona) boolean
    }
    class ValidadorMock { +validar(Persona) boolean }
    class RenaperHttpClient {
        +consultarDni(String, String, String) RespuestaJson
    }
    class RegistroService {
        -validador: ValidadorDeIdentidad
        +registrar(Persona) void
    }
    class Persona { -nombre: String
        -apellido: String
        -documento: String }
    ValidadorDeIdentidad <|.. RenaperAdapter
    ValidadorDeIdentidad <|.. ValidadorMock
    RenaperAdapter --> RenaperHttpClient
    RegistroService --> ValidadorDeIdentidad
    RegistroService ..> Persona`,
      explicacion: "La interfaz <code>ValidadorDeIdentidad</code> pertenece al <b>dominio</b> y está escrita en su vocabulario (<code>validar(Persona)</code>, no <code>consultarDni(String…)</code>). Si la interfaz devolviera el JSON del RENAPER, el detalle se filtraría y no habría inversión de dependencias real.",
    },

    {
      id: 5,
      titulo: "Motor de reglas de copago (Strategy + colección)",
      nivel: "Medio",
      enunciado: "(TurnoÁgil) El motor calcula el copago aplicando reglas que pueden combinarse: Cobertura Total, Plan Básico y Recargo Urgente. Podrían agregarse nuevas reglas.",
      clases: ["MotorDeCopagos", "ReglaDeCopago", "CoberturaTotal", "PlanBasico", "RecargoUrgente", "Turno", "Plan", "ReglaFactory", "CopagoCalculator"],
      correctas: ["MotorDeCopagos", "ReglaDeCopago", "CoberturaTotal", "PlanBasico", "RecargoUrgente", "Turno", "Plan"],
      distractoresPorQue: {
        "ReglaFactory": "Las reglas se configuran a nivel plataforma: alcanza con inyectar la lista. Una factory acá sólo agrega una capa sin resolver nada.",
        "CopagoCalculator": "Duplica al motor. Elegí un nombre y quedate con una sola clase responsable.",
      },
      relaciones: [
        { a: "ReglaDeCopago", b: "CoberturaTotal", ok: "herencia", why: "Cada regla implementa la interfaz común." },
        { a: "MotorDeCopagos", b: "ReglaDeCopago", ok: "composicion", why: "El motor contiene una <b>colección</b> de reglas (multiplicidad <code>*</code>) y las recorre. Esta es la diferencia con el Strategy clásico, que tiene una sola." },
        { a: "ReglaDeCopago", b: "Turno", ok: "dependencia", why: "Cada regla recibe el turno como parámetro para decidir si aplica y cuánto." },
        { a: "Turno", b: "Plan", ok: "asociacion", why: "El turno conoce el plan del paciente, que es el dato que varias reglas consultan." },
      ],
      solucion: `classDiagram
    class ReglaDeCopago {
        <<interface>>
        +aplica(Turno) boolean
        +aplicar(Turno, double) double
    }
    class CoberturaTotal
    class PlanBasico
    class RecargoUrgente
    class MotorDeCopagos {
        -reglas: List~ReglaDeCopago~
        +calcular(Turno) double
    }
    class Turno {
        -fechaHora: LocalDateTime
        -valorBase: double
    }
    class Plan { -nombre: String }
    ReglaDeCopago <|.. CoberturaTotal
    ReglaDeCopago <|.. PlanBasico
    ReglaDeCopago <|.. RecargoUrgente
    MotorDeCopagos o-- "*" ReglaDeCopago
    ReglaDeCopago ..> Turno : evalúa
    Turno --> Plan`,
      explicacion: "El método <code>aplica(Turno)</code> hace que cada regla decida <b>sola</b> si le toca. Si esa decisión viviera en el motor con <code>if</code>, volverías a violar OCP con cada regla nueva.",
    },

    {
      id: 6,
      titulo: "Acciones configurables (Command + Observer)",
      nivel: "Difícil",
      enunciado: "(GTV) Cada vez que una solicitud cambia de estado, la entidad puede configurar acciones a ejecutar: enviar mail, mostrar alerta o llamar a una API externa con method, URI y body configurables.",
      clases: ["Solicitud", "EstadoSolicitud", "Accion", "EnviarMail", "MostrarAlerta", "LlamarApiExterna", "ConfiguracionDeEstado", "Entidad", "AccionEnum", "MailSender"],
      correctas: ["Solicitud", "EstadoSolicitud", "Accion", "EnviarMail", "MostrarAlerta", "LlamarApiExterna", "ConfiguracionDeEstado", "Entidad", "MailSender"],
      distractoresPorQue: {
        "AccionEnum": "Un enum no puede llevar la configuración de cada acción (el mensaje del mail, la URI de la API). Necesitás objetos con estado propio: eso es Command.",
      },
      relaciones: [
        { a: "Accion", b: "EnviarMail", ok: "herencia", why: "Cada acción concreta implementa <code>Accion.ejecutar(contexto)</code>." },
        { a: "ConfiguracionDeEstado", b: "Accion", ok: "composicion", why: "La configuración de un estado agrupa la lista de acciones a ejecutar cuando la solicitud entra en él." },
        { a: "Entidad", b: "ConfiguracionDeEstado", ok: "composicion", why: "Cada entidad define sus propias configuraciones por estado. Si la entidad se borra, sus configuraciones también: composición." },
        { a: "Solicitud", b: "EstadoSolicitud", ok: "asociacion", why: "La solicitud tiene su estado actual (patrón State)." },
        { a: "EnviarMail", b: "MailSender", ok: "asociacion", why: "El command concreto conoce a su <b>receiver</b>: el que efectivamente hace el trabajo. Separar command de receiver es lo que permite testear y reutilizar." },
        { a: "Solicitud", b: "EnviarMail", ok: "ninguna", why: "🚩 La solicitud nunca debe conocer acciones concretas: sólo dispara <code>Accion.ejecutar()</code> sobre las configuradas. Si las conociera, agregar una acción nueva la obligaría a cambiar." },
      ],
      solucion: `classDiagram
    class Accion {
        <<interface>>
        +ejecutar(ContextoSolicitud) void
    }
    class EnviarMail {
        -plantilla: String
        -mailSender: MailSender
    }
    class MostrarAlerta { -mensaje: String }
    class LlamarApiExterna {
        -metodo: MetodoHttp
        -uri: String
        -mapeoDeCampos: Map
    }
    class ConfiguracionDeEstado {
        -estado: EstadoSolicitud
        -acciones: List~Accion~
        +disparar(ContextoSolicitud) void
    }
    class Entidad {
        -denominacion: String
        -configuraciones: List~ConfiguracionDeEstado~
    }
    class Solicitud {
        -estado: EstadoSolicitud
        +cambiarEstado(EstadoSolicitud, String) void
    }
    class EstadoSolicitud { <<interface>> }
    class MailSender { <<interface>> }
    Accion <|.. EnviarMail
    Accion <|.. MostrarAlerta
    Accion <|.. LlamarApiExterna
    ConfiguracionDeEstado o-- "*" Accion
    Entidad *-- "*" ConfiguracionDeEstado
    Solicitud --> EstadoSolicitud
    EnviarMail --> MailSender`,
      explicacion: "Este es el ejercicio más completo del parcial 2023: <b>State</b> para el ciclo de vida, <b>Command</b> para las acciones configurables y <b>Observer</b> (implícito) para que el cambio de estado dispare las acciones sin conocerlas. Los tres conviven sin pisarse.",
    },

    {
      id: 7,
      titulo: "Perfil con niveles de validación e historial",
      nivel: "Difícil",
      enunciado: "(Talentia) El perfil se compone de cinco tipos de elementos (formación, experiencia, habilidades, intereses, preferencias). Cada tipo tiene atributos propios pero todos comparten un nivel de validación (declarado, verificado, certificado). Se mantiene un historial de cambios significativos.",
      clases: ["Perfil", "ElementoDePerfil", "FormacionAcademica", "ExperienciaLaboral", "Habilidad", "Interes", "PreferenciaDeCarrera", "NivelDeValidacion", "EntradaDeHistorial", "Usuario", "PerfilDTO", "ElementoFactory"],
      correctas: ["Perfil", "ElementoDePerfil", "FormacionAcademica", "ExperienciaLaboral", "Habilidad", "Interes", "PreferenciaDeCarrera", "NivelDeValidacion", "EntradaDeHistorial", "Usuario"],
      distractoresPorQue: {
        "PerfilDTO": "Los DTO son de la capa de API, no del modelo de dominio. El punto pide “únicamente la capa de dominio”: meter DTOs suele restar.",
        "ElementoFactory": "El enunciado no describe un problema de creación variable. Agregarla es sobreingeniería.",
      },
      relaciones: [
        { a: "ElementoDePerfil", b: "FormacionAcademica", ok: "herencia", why: "Clase abstracta con los atributos y comportamiento comunes (nivel de validación, fecha de alta); cada tipo agrega los suyos." },
        { a: "Perfil", b: "ElementoDePerfil", ok: "composicion", why: "El perfil contiene sus elementos y ellos no existen sin él: composición con multiplicidad <code>*</code>." },
        { a: "ElementoDePerfil", b: "NivelDeValidacion", ok: "asociacion", why: "Cada elemento tiene su nivel actual. Si el nivel cambiara el <b>comportamiento</b> (qué se puede hacer con el elemento), sería State; si es sólo un dato, alcanza con un enum." },
        { a: "ElementoDePerfil", b: "EntradaDeHistorial", ok: "composicion", why: "Cada elemento conserva su propio historial de cambios; el enunciado pide consultar “el historial de un elemento particular”." },
        { a: "Usuario", b: "Perfil", ok: "asociacion", why: "El usuario tiene un perfil (1 a 1)." },
      ],
      solucion: `classDiagram
    class Usuario { -nombre: String
        -email: String }
    class Perfil {
        -elementos: List~ElementoDePerfil~
        +estadoActual() List~ElementoDePerfil~
        +agregar(ElementoDePerfil) void
    }
    class ElementoDePerfil {
        <<abstract>>
        -nivel: NivelDeValidacion
        -historial: List~EntradaDeHistorial~
        +adjuntarEvidencia(Documento) void
        +certificar(Entidad) void
    }
    class FormacionAcademica { -institucion: String
        -titulo: String }
    class ExperienciaLaboral { -empresa: String
        -puesto: String }
    class Habilidad { -nombre: String }
    class Interes { -tema: String }
    class PreferenciaDeCarrera { -descripcion: String }
    class NivelDeValidacion {
        <<enumeration>>
        DECLARADO
        VERIFICADO
        CERTIFICADO
    }
    class EntradaDeHistorial {
        -fecha: LocalDateTime
        -tipo: TipoDeCambio
        -detalle: String
    }
    Usuario --> Perfil
    Perfil *-- "*" ElementoDePerfil
    ElementoDePerfil <|-- FormacionAcademica
    ElementoDePerfil <|-- ExperienciaLaboral
    ElementoDePerfil <|-- Habilidad
    ElementoDePerfil <|-- Interes
    ElementoDePerfil <|-- PreferenciaDeCarrera
    ElementoDePerfil --> NivelDeValidacion
    ElementoDePerfil *-- "*" EntradaDeHistorial`,
      explicacion: "Acá la decisión fina es <b>clase abstracta y no interfaz</b>: los cinco tipos comparten estado (nivel, historial) y comportamiento (<code>adjuntarEvidencia</code> sube a VERIFICADO para todos). Con una interfaz duplicarías ese código cinco veces.",
    },

    {
      id: 8,
      titulo: "Ejemplar en circulación (State + dominio rico)",
      nivel: "Difícil",
      enunciado: "(Libros Circulares) Una obra tiene ediciones; cada edición tiene ejemplares. El ejemplar registra su dueño y quién lo tiene. Sólo puede prestarlo quien lo tiene en su poder; ceder la propiedad sólo puede hacerlo el dueño; una vez dado de baja no admite operaciones.",
      clases: ["Obra", "Edicion", "Ejemplar", "Persona", "EstadoEjemplar", "Disponible", "Prestado", "DadoDeBaja", "Prestamo", "Comunidad", "EjemplarManager", "LibroDTO"],
      correctas: ["Obra", "Edicion", "Ejemplar", "Persona", "EstadoEjemplar", "Disponible", "Prestado", "DadoDeBaja", "Prestamo", "Comunidad"],
      distractoresPorQue: {
        "EjemplarManager": "Nombre vacío. Las reglas (“sólo puede prestarlo quien lo tiene”) son del <b>ejemplar y su estado</b>: si las sacás a un manager, el dominio queda anémico.",
        "LibroDTO": "El punto pide capa de dominio.",
      },
      relaciones: [
        { a: "Obra", b: "Edicion", ok: "composicion", why: "Una obra tiene sus ediciones; la edición no existe sin la obra." },
        { a: "Edicion", b: "Ejemplar", ok: "composicion", why: "Los ejemplares pertenecen a una edición concreta." },
        { a: "Ejemplar", b: "Persona", ok: "asociacion", why: "Dos asociaciones distintas y bien nombradas: <code>propietario</code> y <code>tenedorActual</code>. El enunciado insiste en que son personas diferentes." },
        { a: "Ejemplar", b: "EstadoEjemplar", ok: "asociacion", why: "El estado actual, que decide qué operaciones son válidas." },
        { a: "EstadoEjemplar", b: "Prestado", ok: "herencia", why: "Cada estado concreto implementa la interfaz." },
        { a: "Prestamo", b: "Ejemplar", ok: "asociacion", why: "El préstamo es una entidad propia (tiene fecha de inicio, vencimiento, de quién a quién): no es un atributo del ejemplar." },
        { a: "Persona", b: "Comunidad", ok: "asociacion", why: "Muchos a muchos con estado (activa/inactiva) y la regla de máximo 3 activas. Si necesitás guardar ese estado, la relación se cosifica en una clase <code>Membresia</code>." },
      ],
      solucion: `classDiagram
    class Obra {
        -titulo: String
        -genero: Genero
        -autores: List~Autor~
    }
    class Edicion {
        -editorial: String
        -anio: int
    }
    class Ejemplar {
        -propietario: Persona
        -tenedorActual: Persona
        -estado: EstadoEjemplar
        +prestar(Persona, Persona) void
        +devolver() void
        +ceder(Persona, Persona) void
        +darDeBaja(Persona) void
    }
    class EstadoEjemplar {
        <<interface>>
        +prestar(Ejemplar, Persona, Persona) void
        +devolver(Ejemplar) void
        +ceder(Ejemplar, Persona, Persona) void
        +darDeBaja(Ejemplar) void
    }
    class Disponible
    class Prestado
    class DadoDeBaja
    class Prestamo {
        -desde: LocalDate
        -vencimiento: LocalDate
        -de: Persona
        -a: Persona
    }
    class Persona {
        -nombre: String
        -documento: String
    }
    class Comunidad { -nombre: String }
    Obra *-- "*" Edicion
    Edicion *-- "*" Ejemplar
    Ejemplar --> Persona : propietario
    Ejemplar --> Persona : tenedorActual
    Ejemplar --> EstadoEjemplar
    Ejemplar --> "*" Prestamo : historial
    EstadoEjemplar <|.. Disponible
    EstadoEjemplar <|.. Prestado
    EstadoEjemplar <|.. DadoDeBaja
    Prestamo --> Ejemplar
    Persona --> "*" Comunidad`,
      explicacion: "La trampa de este enunciado es confundir <b>propiedad</b> con <b>tenencia</b>: son dos asociaciones distintas hacia <code>Persona</code>. Modelarlas con un solo atributo <code>duenio</code> hace imposible expresar “A presta a B, B presta a C, y A sigue siendo el dueño”.",
    },
  ];
})();
