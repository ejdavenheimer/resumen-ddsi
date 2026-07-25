/* =====================================================================
   Comparador de diagramas — dos soluciones al mismo enunciado.
   Una es correcta; la otra tiene un problema real (sobreingeniería,
   patrón mal aplicado, falta de abstracción, dominio anémico…).
   ===================================================================== */
(function () {
  "use strict";
  const D = window.APP.DATA = window.APP.DATA || {};

  D.comparaciones = [
    {
      id: 1,
      titulo: "Formas de pago",
      enunciado: "El sistema debe aceptar pago con tarjeta, transferencia y efectivo. Cada uno se procesa distinto y se prevé sumar billeteras virtuales.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class Pago {
        -tipo: String
        +procesar() void
    }
    note for Pago "procesar() {
      if (tipo == 'TARJETA') ...
      else if (tipo == 'TRANSF') ...
      else if (tipo == 'EFECTIVO') ...
    }"`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class MedioDePago {
        <<interface>>
        +procesar(Monto) Comprobante
    }
    class PagoConTarjeta
    class PagoPorTransferencia
    class PagoEnEfectivo
    class Cobro {
        -medio: MedioDePago
        +cobrar(Monto) Comprobante
    }
    MedioDePago <|.. PagoConTarjeta
    MedioDePago <|.. PagoPorTransferencia
    MedioDePago <|.. PagoEnEfectivo
    Cobro --> MedioDePago`,
      },
      correcta: "b",
      porque: "El enunciado avisa que <b>van a sumarse medios nuevos</b>. La opción B (Strategy) permite agregar <code>PagoConBilletera</code> sin tocar ninguna clase existente.",
      problema: "La opción A concentra todo en un <code>if/else</code> sobre un string: cada medio nuevo modifica <code>Pago</code> (viola OCP) y el campo <code>tipo</code> es un <i>type code</i>, un code smell clásico.",
    },

    {
      id: 2,
      titulo: "Un solo tipo de notificación",
      enunciado: "Cuando se aprueba una solicitud hay que enviar un email al solicitante. No se prevén otros canales.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class SolicitudService {
        -notificador: Notificador
        +aprobar(Solicitud) void
    }
    class Notificador {
        <<interface>>
        +notificar(Destinatario, Mensaje) void
    }
    class NotificadorEmail
    Notificador <|.. NotificadorEmail
    SolicitudService --> Notificador`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class SolicitudService {
        -fabrica: NotificadorFactory
        +aprobar(Solicitud) void
    }
    class NotificadorFactory {
        <<abstract>>
        +crear() Notificador
    }
    class EmailNotificadorFactory
    class NotificadorAbstracto { <<abstract>> }
    class Notificador { <<interface>> }
    class NotificadorEmail
    class EstrategiaDeFormato { <<interface>> }
    class FormatoHtml
    class FormatoTextoPlano
    NotificadorFactory <|-- EmailNotificadorFactory
    Notificador <|.. NotificadorAbstracto
    NotificadorAbstracto <|-- NotificadorEmail
    NotificadorEmail --> EstrategiaDeFormato
    EstrategiaDeFormato <|.. FormatoHtml
    EstrategiaDeFormato <|.. FormatoTextoPlano
    SolicitudService --> NotificadorFactory`,
      },
      correcta: "a",
      porque: "Con un solo canal, la interfaz <code>Notificador</code> ya alcanza: te da testabilidad (mock) e inversión de dependencias, que sí valen siempre. Es el mínimo que resuelve el problema real.",
      problema: "La opción B es <b>sobreingeniería</b>: factory abstracta, clase abstracta intermedia y strategy de formato para un requerimiento que ni los menciona. En el parcial esto resta puntos: los patrones se justifican por un requerimiento del enunciado, no por decorar el diagrama.",
    },

    {
      id: 3,
      titulo: "Estructura de categorías",
      enunciado: "Las categorías del catálogo pueden contener subcategorías o productos, con anidamiento de profundidad arbitraria. Hay que poder listar todo el contenido de cualquier nodo.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class Categoria {
        -nombre: String
        -subcategorias: List~Categoria~
        -productos: List~Producto~
        +listarTodo() List~Producto~
    }
    class Producto { -nombre: String }
    Categoria o-- "*" Categoria
    Categoria o-- "*" Producto`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class ElementoDeCatalogo {
        <<interface>>
        +listar() List~Producto~
    }
    class Producto { +listar() List~Producto~ }
    class Categoria {
        -hijos: List~ElementoDeCatalogo~
        +listar() List~Producto~
    }
    ElementoDeCatalogo <|.. Producto
    ElementoDeCatalogo <|.. Categoria
    Categoria o-- "*" ElementoDeCatalogo`,
      },
      correcta: "b",
      porque: "En B, categoría y producto comparten interfaz: <code>listar()</code> se implementa una vez en cada uno y la recursión sale sola. El cliente nunca pregunta de qué tipo es cada hijo.",
      problema: "La opción A parece razonable pero mantiene <b>dos colecciones separadas</b>: cada recorrido tiene que iterar las dos y tratar los casos distinto. Cuando aparezca un tercer tipo de contenido, hay que agregar otra lista y tocar todos los métodos. No es Composite: es la estructura que Composite viene a arreglar.",
    },

    {
      id: 4,
      titulo: "Estado de la reserva",
      enunciado: "Una reserva puede estar Pendiente, Confirmada, Cancelada o Finalizada. Sólo se puede cancelar si está Pendiente o Confirmada, y sólo se puede finalizar si estaba Confirmada.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class Reserva {
        -estado: EstadoEnum
        +cancelar() void
        +finalizar() void
    }
    class EstadoEnum {
        <<enumeration>>
        PENDIENTE
        CONFIRMADA
        CANCELADA
        FINALIZADA
    }
    class ValidadorDeTransiciones {
        +puedeCancelar(EstadoEnum) boolean
        +puedeFinalizar(EstadoEnum) boolean
    }
    Reserva --> EstadoEnum
    Reserva --> ValidadorDeTransiciones`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class Reserva {
        -estado: EstadoReserva
        +cancelar() void
        +finalizar() void
        +setEstado(EstadoReserva) void
    }
    class EstadoReserva {
        <<interface>>
        +cancelar(Reserva) void
        +finalizar(Reserva) void
    }
    class Pendiente
    class Confirmada
    class Cancelada
    class Finalizada
    EstadoReserva <|.. Pendiente
    EstadoReserva <|.. Confirmada
    EstadoReserva <|.. Cancelada
    EstadoReserva <|.. Finalizada
    Reserva --> EstadoReserva`,
      },
      correcta: "b",
      porque: "Cada estado sabe qué transiciones acepta. Sumar “Reprogramada” es agregar una clase; el resto no se entera. Además la reserva no tiene ningún <code>if</code> sobre su estado.",
      problema: "En A, el <code>ValidadorDeTransiciones</code> concentra un <code>switch</code> por cada operación: cada estado nuevo obliga a modificarlo (viola OCP) y el conocimiento del ciclo de vida vive <b>fuera</b> del objeto que lo tiene, dejando a <code>Reserva</code> anémica.",
      matiz: "Ojo: si el enunciado sólo dijera “guardar en qué estado está” y el comportamiento no cambiara, la opción A (con enum, sin validador) sería la correcta y B sería sobreingeniería. Lo que decide es si <b>el comportamiento</b> depende del estado.",
    },

    {
      id: 5,
      titulo: "Integración con la API de clima",
      enunciado: "(ProtegePro) La regla de clima consulta una API externa para saber si hay ráfagas de viento mayores a 25 km/h.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class ReglaDeClima {
        +aplicar(Contratacion, double) double
    }
    class OpenWeatherHttpClient {
        +getForecast(String) JsonNode
    }
    ReglaDeClima --> OpenWeatherHttpClient`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class ReglaDeRiesgo { <<interface>> }
    class ReglaDeClima {
        -servicio: ServicioDeClima
        +aplicar(Contratacion, double) double
    }
    class ServicioDeClima {
        <<interface>>
        +pronostico(Ubicacion, Rango) Pronostico
    }
    class OpenWeatherAdapter {
        -client: OpenWeatherHttpClient
    }
    class OpenWeatherHttpClient
    class Pronostico {
        -rafagasKmH: double
    }
    ReglaDeRiesgo <|.. ReglaDeClima
    ReglaDeClima --> ServicioDeClima
    ServicioDeClima <|.. OpenWeatherAdapter
    OpenWeatherAdapter --> OpenWeatherHttpClient
    ServicioDeClima ..> Pronostico`,
      },
      correcta: "b",
      porque: "La regla depende de <code>ServicioDeClima</code>, una abstracción del dominio que devuelve un <code>Pronostico</code> tipado. El adapter traduce el JSON del proveedor. Podés testear la regla sin red y cambiar de proveedor sin tocar el dominio (DIP + Adapter).",
      problema: "En A la regla de negocio manipula el <code>JsonNode</code> de OpenWeather: si el proveedor renombra un campo, se rompe una clase de dominio. Además es imposible testear la regla sin llamar a la API real.",
    },

    {
      id: 6,
      titulo: "Reportes con pasos comunes",
      enunciado: "Todos los reportes validan parámetros, consultan datos, arman el archivo y lo envían. Sólo cambian la consulta y el armado del archivo.",
      a: {
        etiqueta: "Opción A",
        uml: `classDiagram
    class Reporte {
        <<abstract>>
        +generar() Archivo
        #validar() void
        #enviar(Archivo) void
        #consultarDatos()* Datos
        #armarArchivo(Datos)* Archivo
    }
    class ReporteDeVentas
    class ReporteDeStock
    Reporte <|-- ReporteDeVentas
    Reporte <|-- ReporteDeStock
    note for Reporte "generar() es final:
    validar → consultarDatos →
    armarArchivo → enviar"`,
      },
      b: {
        etiqueta: "Opción B",
        uml: `classDiagram
    class GeneradorDeReportes {
        +generar(TipoReporte) Archivo
    }
    class ReporteDeVentas {
        +generar() Archivo
    }
    class ReporteDeStock {
        +generar() Archivo
    }
    note for ReporteDeVentas "valida, consulta,
    arma y envía (todo propio)"
    note for ReporteDeStock "valida, consulta,
    arma y envía (todo propio)"
    GeneradorDeReportes ..> ReporteDeVentas
    GeneradorDeReportes ..> ReporteDeStock`,
      },
      correcta: "a",
      porque: "Template Method: el esqueleto (y el <b>orden</b> de los pasos) se escribe una sola vez en la clase abstracta y las subclases sólo completan los dos pasos que varían. Un reporte nuevo implementa dos métodos, no cuatro.",
      problema: "En B cada reporte reimplementa el algoritmo completo: la validación y el envío quedan <b>duplicados</b> en cada subclase. Cuando cambie la política de envío hay que modificar todas — y seguro alguna se olvida.",
      matiz: "Si los reportes <i>no</i> compartieran el esqueleto, forzar Template Method sería peor que B. El patrón se justifica porque el enunciado dice explícitamente que los pasos comunes son los mismos.",
    },
  ];
})();
