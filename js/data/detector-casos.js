/* =====================================================================
   Casos del "Detector de patrones".
   Muchos están sacados (o adaptados) de finales reales de la cátedra.
     enunciado : texto; envolvé las frases disparadoras en <b class="kw">
     opciones  : 4-6 candidatos
     correcta  : una de las opciones
     porque    : por qué SÍ es esa
     descartes : {opcion: "por qué NO"}
     patron    : id de la sección del patrón (para el enlace "ir al tema")
   ===================================================================== */
(function () {
  "use strict";
  const APP = window.APP;
  const D = window.APP.DATA = window.APP.DATA || {};

  D.detector = [
    /* ---------------------------- STRATEGY ---------------------------- */
    {
      id: 1, tema: "Strategy",
      enunciado: 'El sistema debe permitir aplicar <b class="kw">distintos tipos de descuentos</b> según el cliente: por volumen, por temporada y por cliente VIP. Se espera que <b class="kw">en el futuro se agreguen nuevos tipos de descuento sin modificar la lógica existente</b>.',
      opciones: ["Strategy", "Factory Method", "State", "Template Method"],
      correcta: "Strategy",
      patron: "strategy",
      porque: "Hay <b>varios algoritmos alternativos</b> que hacen lo mismo (calcular un descuento) de formas distintas, y el enunciado pide poder agregar más sin tocar lo existente. Encapsulás cada cálculo en su propia clase detrás de una interfaz común y cumplís Open/Closed.",
      descartes: {
        "Factory Method": "Acá no se decide <i>qué objeto crear</i>, sino <i>cómo calcular</i>. Factory podría convivir (para instanciar la estrategia), pero el patrón que resuelve el requerimiento es Strategy.",
        "State": "No hay ciclo de vida ni transiciones automáticas: el descuento no “pasa” de VIP a temporada solo.",
        "Template Method": "No hay un esqueleto de pasos fijos con huecos: los algoritmos son completamente distintos entre sí.",
      },
    },
    {
      id: 2, tema: "Strategy",
      enunciado: '(ProtegePro) El Motor de Riesgo <b class="kw">calcula el costo de la prima</b> aplicando reglas: zona de riesgo (+40%), bonus de confianza (−10%) y clima (+20%). <b class="kw">Actualmente se cuenta con 3 reglas, pero a futuro pueden agregarse más</b>. <b class="kw">Pueden aplicarse más de una</b>.',
      opciones: ["Strategy", "Composite", "State", "Adapter", "Command"],
      correcta: "Strategy",
      patron: "strategy",
      porque: "Cada regla es un algoritmo intercambiable sobre el valor de referencia. Modelás <code>ReglaDeRiesgo</code> como interfaz y cada regla como una implementación. Como “pueden aplicarse más de una”, el motor guarda una <b>lista</b> de estrategias y las aplica en cadena.",
      descartes: {
        "Composite": "Composite serviría si las reglas se agruparan jerárquicamente (regla que contiene reglas). Con una simple lista alcanza; meter Composite acá es sobreingeniería salvo que pidan grupos anidados.",
        "State": "Las reglas no son estados de la prima: no hay transiciones ni ciclo de vida.",
        "Adapter": "No estamos traduciendo interfaces incompatibles. (Sí lo usarías para hablar con la API de Clima o la de Seguridad.)",
        "Command": "No hace falta encolar, deshacer ni loguear la ejecución de la regla como objeto-acción.",
      },
    },
    {
      id: 3, tema: "Strategy",
      enunciado: '(La Scalo App) Sobre el análisis del rival el servicio elabora <b class="kw">distintos tipos de recomendaciones</b>. El tipo <b class="kw">se decide en tiempo de ejecución según lo que solicite el usuario</b>. <b class="kw">Cada tipo es resuelto por un algoritmo distinto</b> y <b class="kw">deben poder incorporarse otras sin alterar el resto del sistema</b>.',
      opciones: ["Strategy", "Observer", "Template Method", "Simple Factory"],
      correcta: "Strategy",
      patron: "strategy",
      porque: "“Algoritmo distinto por tipo”, “elegido en tiempo de ejecución” y “ampliable sin tocar el resto” son las tres señales canónicas de Strategy. Una <code>Simple Factory</code> puede acompañarlo para instanciar la estrategia según lo que pidió el usuario, pero el patrón central es Strategy.",
      descartes: {
        "Observer": "Nadie se suscribe a nada ni hay notificaciones.",
        "Template Method": "Los tres algoritmos no comparten un esqueleto de pasos: son procedimientos distintos.",
        "Simple Factory": "Es el complemento, no la respuesta: la factory sólo elige cuál instanciar; la variabilidad del comportamiento la resuelve Strategy.",
      },
    },

    /* ----------------------------- STATE ------------------------------ */
    {
      id: 4, tema: "State",
      enunciado: '(GTV) Una solicitud de trámite queda “Pendiente de revisión” y luego puede pasar a “En revisión”, “Diferido”, “Aceptado” o “Rechazado”. <b class="kw">Según el estado actual</b> se habilitan distintas transiciones y <b class="kw">es de vital importancia guardar trazabilidad</b> de los cambios.',
      opciones: ["State", "Strategy", "Observer", "Command"],
      correcta: "State",
      patron: "state",
      porque: "La solicitud tiene un <b>ciclo de vida</b> y su comportamiento (qué transiciones acepta) depende del estado. Cada estado es una clase que sabe a cuáles puede pasar y cuáles rechaza; así te evitás la cadena de <code>if (estado.equals(...))</code>.",
      descartes: {
        "Strategy": "En Strategy el cliente elige la estrategia; acá el objeto cambia de estado solo, siguiendo su flujo.",
        "Observer": "Observer resolvería el aviso a los interesados <i>cuando</i> cambia el estado — es complementario, no sustituto.",
        "Command": "Command sirve para las acciones configurables que se disparan en cada estado, no para el ciclo de vida en sí.",
      },
    },
    {
      id: 5, tema: "State",
      enunciado: '(Libros Circulares) Un ejemplar puede prestarse, devolverse, cederse o darse de baja. <b class="kw">Sólo puede prestarlo quien lo tiene en su poder</b>; <b class="kw">una vez dado de baja no se podrá realizar ninguna operación sobre él</b>.',
      opciones: ["State", "Composite", "Template Method", "Facade"],
      correcta: "State",
      patron: "state",
      porque: "El ejemplar responde distinto a las mismas operaciones según su situación (en poder de X, prestado, dado de baja). Cada estado encapsula qué operaciones acepta y a qué estado transiciona, con validaciones propias.",
      descartes: {
        "Composite": "No hay estructura de árbol.",
        "Template Method": "No hay esqueleto de algoritmo con pasos variables.",
        "Facade": "No estamos simplificando un subsistema complejo.",
      },
    },
    {
      id: 6, tema: "State",
      enunciado: '(Talentia) El estado inicial de una postulación es “Postulado” o “Contactado”, y <b class="kw">el ciclo de vida avanza</b> a “En Proceso”, “Entrevista Pactada” y “Oferta”. <b class="kw">Los estados finales</b> pueden ser “Aceptado” o “Rechazado”.',
      opciones: ["State", "Strategy", "Factory Method", "Adapter"],
      correcta: "State",
      patron: "state",
      porque: "“Ciclo de vida”, “estado inicial” y “estados finales” son literalmente el vocabulario de State. Modelá cada estado como clase con sus transiciones válidas.",
      descartes: {
        "Strategy": "No hay algoritmos alternativos para una misma tarea.",
        "Factory Method": "Nada indica variantes de creación por subclase de creador.",
        "Adapter": "No hay interfaz externa incompatible que traducir en este punto.",
      },
      nota: "Ojo: si el enunciado sólo dijera “guardar el estado” y el objeto se comportara igual en todos, State sería sobreingeniería y bastaría un <code>enum</code>.",
    },

    /* ---------------------------- ADAPTER ----------------------------- */
    {
      id: 7, tema: "Adapter",
      enunciado: 'El sistema debe <b class="kw">integrarse con la API de un servicio de facturación externo</b> llamado FacturApp. <b class="kw">No podemos modificar ese servicio</b> y queremos que el resto de la aplicación no dependa de él.',
      opciones: ["Adapter", "Facade", "Observer", "Strategy"],
      correcta: "Adapter",
      patron: "adapter",
      porque: "Hay una interfaz externa que no controlás y una interfaz propia que querés preservar. El adapter implementa tu interfaz (<code>ServicioDeFacturacion</code>) y por dentro traduce las llamadas al SDK de FacturApp.",
      descartes: {
        "Facade": "Facade simplifica un subsistema <i>propio</i> complejo creando una interfaz nueva; acá el objetivo es traducir una interfaz ajena a la tuya.",
        "Observer": "No hay notificaciones ni suscriptores.",
        "Strategy": "Podría aparecer si hubiera <i>varios</i> proveedores intercambiables — y ahí cada proveedor sería un adapter que además funciona como estrategia.",
      },
    },
    {
      id: 8, tema: "Adapter",
      enunciado: '(Libros Circulares) El registro de personas debe <b class="kw">integrarse con un servicio externo provisto por el RENAPER</b> para verificar que documento, nombre y apellido correspondan a una persona real.',
      opciones: ["Adapter", "Composite", "Command", "Template Method"],
      correcta: "Adapter",
      patron: "adapter",
      porque: "Definís <code>ValidadorDeIdentidad</code> como interfaz del dominio y <code>RenaperAdapter</code> como su implementación, que habla HTTP/SOAP con el organismo. Si mañana cambia el proveedor (o querés mockearlo en los tests), sólo cambia el adapter.",
      descartes: {
        "Composite": "No hay jerarquía.",
        "Command": "No hace falta cosificar la validación como acción encolable… salvo que quieras reintentarla, que es otra discusión (arquitectura).",
        "Template Method": "No hay pasos comunes con variantes.",
      },
    },
    {
      id: 9, tema: "Adapter",
      enunciado: 'Necesitamos enviar notificaciones. Hoy usamos el <b class="kw">SDK de Twilio</b> para SMS, pero <b class="kw">el área de infraestructura evalúa migrar a otro proveedor</b>. El código de dominio no debería enterarse del cambio.',
      opciones: ["Adapter", "Facade", "Simple Factory", "State"],
      correcta: "Adapter",
      patron: "adapter",
      porque: "Cada proveedor se envuelve en un adapter que implementa tu interfaz <code>MedioDeContacto</code>. Migrar de proveedor = escribir otro adapter, sin tocar el dominio (Open/Closed + Dependency Inversion).",
      descartes: {
        "Facade": "No hay múltiples clases internas que coordinar detrás de una entrada única.",
        "Simple Factory": "Ayuda a elegir el adapter según configuración, pero no resuelve la incompatibilidad de interfaces.",
        "State": "No hay ciclo de vida.",
      },
    },

    /* ---------------------------- COMPOSITE --------------------------- */
    {
      id: 10, tema: "Composite",
      enunciado: 'El catálogo se organiza en <b class="kw">categorías que pueden contener subcategorías</b> o productos. Se necesita <b class="kw">calcular el precio total</b> de cualquier nodo del catálogo, sin importar si es una categoría o un producto.',
      opciones: ["Composite", "Strategy", "Facade", "Observer"],
      correcta: "Composite",
      patron: "composite",
      porque: "Estructura de árbol + una operación uniforme sobre hojas y nodos. Definís <code>ElementoDeCatalogo</code> con <code>precio()</code>: el producto devuelve el suyo y la categoría suma el de sus hijos, recursivamente.",
      descartes: {
        "Strategy": "No hay algoritmos alternativos.",
        "Facade": "No hay subsistema complejo a esconder.",
        "Observer": "Nadie se suscribe.",
      },
    },
    {
      id: 11, tema: "Composite",
      enunciado: '(GTV) Cada trámite tiene <b class="kw">uno o varios formularios</b> asociados, y cada formulario tiene un costo. <b class="kw">Si el trámite requiere varios formularios, el costo final es la sumatoria de cada uno</b> menos un 10%.',
      opciones: ["Composite", "Command", "Template Method", "Simple Factory"],
      correcta: "Composite",
      patron: "composite",
      porque: "El trámite se comporta como un compuesto cuyo costo es la agregación del costo de sus partes. La misma operación <code>costo()</code> vale para la parte y para el todo.",
      descartes: {
        "Command": "El costo no es una acción a encolar o deshacer.",
        "Template Method": "No hay esqueleto con pasos abstractos.",
        "Simple Factory": "No es un problema de creación.",
      },
      nota: "Cuidado: Composite exige <b>árbol con posibles múltiples hijos</b>. Si sólo hubiera una lista plana de formularios sin anidamiento, alcanza con una colección y un <code>stream().sum()</code>.",
    },
    {
      id: 12, tema: "Composite",
      enunciado: 'Un <b class="kw">menú de la aplicación</b> tiene ítems que pueden ser acciones directas o <b class="kw">submenús que a su vez contienen más ítems</b>. Al renderizar hay que <b class="kw">recorrer toda la estructura</b> igual, sin diferenciar el tipo.',
      opciones: ["Composite", "Observer", "State", "Adapter"],
      correcta: "Composite",
      patron: "composite",
      porque: "Menú con submenús anidados y una operación (<code>renderizar()</code>) que debe funcionar igual sobre hojas y compuestos: es el caso de manual de Composite.",
      descartes: {
        "Observer": "No hay eventos ni suscripciones.",
        "State": "El menú no cambia de comportamiento por su estado.",
        "Adapter": "No hay interfaces incompatibles.",
      },
    },

    /* ----------------------------- FACADE ----------------------------- */
    {
      id: 13, tema: "Facade",
      enunciado: 'Para confirmar un pedido hay que <b class="kw">coordinar</b> el repositorio de clientes, el servicio de stock, el de pagos, el de envíos y el de mails. Los controllers hoy <b class="kw">tienen que conocer todos esos componentes</b> y llamarlos en el orden correcto.',
      opciones: ["Facade", "Adapter", "Command", "Composite"],
      correcta: "Facade",
      patron: "facade",
      porque: "Hay un subsistema complejo y clientes que deben orquestarlo. Un <code>PedidoService</code> / <code>PedidoFacade</code> expone <code>confirmar(datos)</code> y esconde la coordinación adentro. Baja el acoplamiento y centraliza el caso de uso.",
      descartes: {
        "Adapter": "No estamos traduciendo una interfaz existente: estamos creando una interfaz nueva y más simple.",
        "Command": "Command tendría sentido si necesitáramos encolar o deshacer la confirmación.",
        "Composite": "No hay jerarquía de objetos.",
      },
    },
    {
      id: 14, tema: "Facade",
      enunciado: 'La app móvil necesita, en una sola llamada, los datos del perfil, las últimas notificaciones y el resumen de cuenta, que hoy viven en <b class="kw">tres servicios distintos</b>. Se quiere ofrecer un <b class="kw">punto de entrada único</b> que <b class="kw">esconda esa complejidad</b> al cliente.',
      opciones: ["Facade", "Observer", "Strategy", "State"],
      correcta: "Facade",
      patron: "facade",
      porque: "“Punto de entrada único” + “esconder la complejidad” = Facade. A nivel arquitectura esto mismo se llama <b>API Gateway</b> o <b>BFF</b> (Backend For Frontend): es el patrón Facade llevado a componentes.",
      descartes: {
        "Observer": "No hay notificaciones push modeladas acá.",
        "Strategy": "No hay algoritmos intercambiables.",
        "State": "No hay ciclo de vida.",
      },
    },

    /* ---------------------------- OBSERVER ---------------------------- */
    {
      id: 15, tema: "Observer",
      enunciado: 'Cuando una solicitud <b class="kw">cambia de estado</b>, el sistema debe <b class="kw">enviar un email al solicitante y a la entidad</b>, <b class="kw">registrar el evento en la bitácora</b> y actualizar el tablero. <b class="kw">Podrían sumarse más acciones en el futuro</b>.',
      opciones: ["Observer", "State", "Facade", "Template Method"],
      correcta: "Observer",
      patron: "observer",
      porque: "Un cambio en un objeto tiene que avisar a <b>varios interesados</b> que pueden crecer con el tiempo, y el emisor no debería conocer a cada uno. La solicitud notifica; los observers (mailer, auditoría, tablero) reaccionan.",
      descartes: {
        "State": "State resuelve el ciclo de vida en sí; Observer resuelve el aviso. En un parcial suelen ir <b>juntos</b>: cada transición de State dispara la notificación.",
        "Facade": "No hay subsistema a simplificar.",
        "Template Method": "No hay esqueleto de algoritmo.",
      },
    },
    {
      id: 16, tema: "Observer",
      enunciado: 'Al registrarse un nuevo pago, <b class="kw">múltiples componentes deben enterarse</b>: contabilidad, el módulo de fidelización y el de reportes. <b class="kw">La cantidad de interesados puede cambiar en runtime</b> según la configuración del cliente.',
      opciones: ["Observer", "Command", "Simple Factory", "Adapter"],
      correcta: "Observer",
      patron: "observer",
      porque: "N interesados, cantidad variable en tiempo de ejecución, emisor desacoplado: Observer. Con <code>suscribir()</code> / <code>desuscribir()</code> se agregan o quitan sin tocar al subject.",
      descartes: {
        "Command": "Podría usarse para representar cada reacción como acción encolable, pero el requerimiento central es la notificación 1→N.",
        "Simple Factory": "No es creación.",
        "Adapter": "No hay incompatibilidad de interfaces.",
      },
    },
    {
      id: 17, tema: "Observer",
      enunciado: 'Un tablero de control muestra en pantalla la cotización del dólar. <b class="kw">Cada vez que llega una nueva cotización</b>, <b class="kw">todos los gráficos abiertos deben actualizarse automáticamente</b> sin que el emisor sepa cuántos hay.',
      opciones: ["Observer", "Strategy", "Composite", "Facade"],
      correcta: "Observer",
      patron: "observer",
      porque: "Dependencia uno-a-muchos con actualización automática: la definición literal de Observer.",
      descartes: {
        "Strategy": "No hay formas alternativas de calcular.",
        "Composite": "No hay árbol.",
        "Facade": "No hay subsistema a simplificar.",
      },
    },

    /* ----------------------- FACTORY / SIMPLE FACTORY ------------------ */
    {
      id: 18, tema: "Simple Factory",
      enunciado: 'Cuando llega un mensaje del broker, <b class="kw">según el campo “tipo”</b> hay que <b class="kw">instanciar</b> el procesador correspondiente: <code>ProcesadorAlta</code>, <code>ProcesadorBaja</code> o <code>ProcesadorModificacion</code>. Hoy ese <code>switch</code> está repetido en tres lugares.',
      opciones: ["Simple Factory", "Strategy", "Builder", "Facade"],
      correcta: "Simple Factory",
      patron: "factory",
      porque: "El problema es de <b>creación</b>: elegir qué clase concreta instanciar según un dato y evitar que ese <code>switch</code> se disperse. Una Simple Factory lo concentra en un solo punto.",
      descartes: {
        "Strategy": "Strategy es el <i>resultado</i> (los procesadores probablemente sean estrategias); el requerimiento que se pide resolver es dónde vive la decisión de instanciación.",
        "Builder": "Builder arma objetos complejos paso a paso; acá no hay construcción por partes.",
        "Facade": "No hay subsistema a simplificar.",
      },
    },
    {
      id: 19, tema: "Factory Method",
      enunciado: 'La plataforma opera en varios países. El proceso de facturación es siempre el mismo (calcular, aplicar impuestos, emitir), pero <b class="kw">cada país instancia su propio tipo de comprobante</b>: Argentina crea <code>FacturaAFIP</code>, Chile crea <code>BoletaSII</code>. <b class="kw">Se sumarán más países</b>.',
      opciones: ["Factory Method", "Simple Factory", "Adapter", "Observer"],
      correcta: "Factory Method",
      patron: "factory",
      porque: "El algoritmo general vive en la clase base y <b>las subclases del creador</b> (<code>FacturadorAR</code>, <code>FacturadorCL</code>) deciden qué producto concreto instanciar. Ese es exactamente Factory Method: creación delegada a la subclase.",
      descartes: {
        "Simple Factory": "Sería válida si un único punto decidiera con un <code>switch</code>. Acá la decisión depende de <i>quién</i> es el creador, no de un parámetro suelto.",
        "Adapter": "No hay interfaz ajena que traducir (aunque los comprobantes seguramente usen adapters para hablar con AFIP/SII).",
        "Observer": "No hay notificaciones.",
      },
    },
    {
      id: 20, tema: "Simple Factory",
      enunciado: 'Al dar de alta un usuario hay que crear su perfil: <b class="kw">según el tipo de cuenta</b> (Free, Pro, Enterprise) se crea <b class="kw">una clase de perfil distinta</b> con configuraciones iniciales distintas.',
      opciones: ["Simple Factory", "Template Method", "State", "Composite"],
      correcta: "Simple Factory",
      patron: "factory",
      porque: "“Según el tipo se crea” + varias variantes concretas = fábrica. Con una Simple Factory (<code>PerfilFactory.crear(tipo)</code>) centralizás la decisión.",
      descartes: {
        "Template Method": "No se describe un esqueleto de pasos comunes.",
        "State": "El tipo de cuenta no es un estado del ciclo de vida (a menos que el enunciado diga que se cambia de plan y eso altere el comportamiento).",
        "Composite": "No hay jerarquía de partes y todos.",
      },
    },

    /* ------------------------- TEMPLATE METHOD ------------------------ */
    {
      id: 21, tema: "Template Method",
      enunciado: 'Todos los reportes se generan igual: <b class="kw">se validan los parámetros, se consultan los datos, se arma el archivo y se envía por mail</b>. Lo único que cambia entre reportes es <b class="kw">de dónde se traen los datos y cómo se arma el archivo</b>.',
      opciones: ["Template Method", "Strategy", "Facade", "Command"],
      correcta: "Template Method",
      patron: "template-method",
      porque: "Hay un <b>esqueleto fijo de pasos</b> (mismo orden siempre) y sólo algunos pasos varían. La clase abstracta define el método plantilla y declara abstractos los pasos que cambian.",
      descartes: {
        "Strategy": "Strategy reemplaza el algoritmo <i>completo</i>; acá querés conservar el orden de los pasos y variar sólo dos de ellos. (Sí es válido combinarlos: pasos implementados como estrategias inyectadas.)",
        "Facade": "No hay subsistema a simplificar.",
        "Command": "No hay necesidad de encolar ni deshacer.",
      },
    },
    {
      id: 22, tema: "Template Method",
      enunciado: 'Todas las importaciones de archivos siguen el mismo procedimiento: abrir el archivo, <b class="kw">parsear cada línea según el formato</b>, validar, persistir y cerrar. <b class="kw">Sólo el parseo cambia</b> entre CSV, XML y JSON.',
      opciones: ["Template Method", "Adapter", "Simple Factory", "State"],
      correcta: "Template Method",
      patron: "template-method",
      porque: "Un solo paso variable dentro de un esqueleto invariante. <code>ImportadorAbstracto.importar()</code> es final y llama a <code>parsear(linea)</code>, que implementa cada subclase.",
      descartes: {
        "Adapter": "No hay una librería externa cuya interfaz haya que traducir (salvo que el enunciado lo mencione).",
        "Simple Factory": "Sirve para elegir el importador según la extensión, pero no resuelve la duplicación del esqueleto.",
        "State": "No hay ciclo de vida.",
      },
    },

    /* ----------------------------- COMMAND ---------------------------- */
    {
      id: 23, tema: "Command",
      enunciado: '(GTV) Las entidades <b class="kw">podrán configurar distintas acciones para que se ejecuten</b> cada vez que una solicitud entra en un estado: enviar un mail con mensaje configurable, mandar una alerta o <b class="kw">llamar a una API externa</b> especificando método, URI y body.',
      opciones: ["Command", "Strategy", "Observer", "Template Method"],
      correcta: "Command",
      patron: "command",
      porque: "El usuario <b>configura y parametriza acciones</b> que se guardan y se ejecutan después. Cosificar cada acción como objeto <code>Accion</code> con <code>ejecutar(contexto)</code> permite persistirlas, listarlas y ejecutarlas sin que el emisor conozca el detalle.",
      descartes: {
        "Strategy": "Strategy varía <i>cómo</i> se hace una tarea que el sistema ya decidió hacer. Acá la gracia es que la acción es un objeto configurable, almacenable y diferido: eso es Command.",
        "Observer": "Observer resuelve <i>quién se entera</i> del cambio de estado; Command resuelve <i>qué se hace</i>. En este enunciado conviven: el estado notifica y cada acción configurada es un command.",
        "Template Method": "No hay esqueleto con pasos variables.",
      },
    },
    {
      id: 24, tema: "Command",
      enunciado: 'El editor debe permitir <b class="kw">deshacer y rehacer</b> las últimas operaciones del usuario y además <b class="kw">guardar un log de operaciones</b> para auditoría.',
      opciones: ["Command", "State", "Observer", "Composite"],
      correcta: "Command",
      patron: "command",
      porque: "Undo/redo + log de operaciones es la señal más inequívoca de Command: cada operación se encapsula como objeto con <code>ejecutar()</code> y <code>deshacer()</code>, y se apila en un historial.",
      descartes: {
        "State": "No hay ciclo de vida de un objeto de negocio.",
        "Observer": "No hay notificación 1→N.",
        "Composite": "Aunque un “macro-command” usa Composite para agrupar comandos, el requerimiento base es Command.",
      },
    },
    {
      id: 25, tema: "Command",
      enunciado: 'El sistema debe permitir <b class="kw">programar tareas</b> que se <b class="kw">ejecuten más tarde</b>: el usuario arma la tarea, elige la fecha y el sistema la <b class="kw">encola</b> hasta el momento de ejecutarla.',
      opciones: ["Command", "Strategy", "Facade", "Factory Method"],
      correcta: "Command",
      patron: "command",
      porque: "“Ejecutar en diferido” y “encolar” exigen que la petición sea un <b>objeto</b> que se pueda guardar y ejecutar después. Eso es Command.",
      descartes: {
        "Strategy": "Una estrategia se ejecuta ahora; no se guarda como pedido pendiente.",
        "Facade": "No hay subsistema a simplificar.",
        "Factory Method": "No es un problema de creación por subclase.",
      },
    },

    /* --------------------- ARQUITECTURA / INTEGRACIÓN ------------------ */
    {
      id: 26, tema: "Asincronismo",
      enunciado: '(ProtegePro) El modelo de IA <b class="kw">puede tardar más de un minuto</b> en validar la imagen, y además <b class="kw">se esperan picos de tráfico</b> porque estos seguros se contratan en eventos masivos.',
      opciones: ["Comunicación asincrónica con cola", "Request/Response sincrónico", "Adapter", "Composite"],
      correcta: "Comunicación asincrónica con cola",
      patron: "sincronismo",
      porque: "Un proceso que tarda más de un minuto no puede bloquear la request HTTP del usuario (timeouts, mala usabilidad). Se publica un mensaje en una cola, el worker de IA lo procesa cuando puede y el resultado se devuelve por notificación / polling / webhook. La cola además <b>amortigua</b> los picos.",
      descartes: {
        "Request/Response sincrónico": "Es lo que hay que evitar: el cliente queda bloqueado y el pico de tráfico tira el servicio abajo.",
        "Adapter": "Sí vas a necesitar un adapter para hablar con la API de IA, pero no resuelve la demora ni el pico.",
        "Composite": "No aplica.",
      },
    },
    {
      id: 27, tema: "Broker",
      enunciado: 'Varios servicios necesitan reaccionar a los <b class="kw">eventos que publica</b> el servicio de ventas. Se busca <b class="kw">desacoplar productor y consumidores</b>, tener <b class="kw">garantías de entrega y reintentos</b>, y soportar <b class="kw">múltiples suscriptores</b>.',
      opciones: ["Broker / Publish-Subscribe", "Observer in-process", "Facade", "API Gateway"],
      correcta: "Broker / Publish-Subscribe",
      patron: "broker",
      porque: "La comunicación es <b>entre sistemas</b> (no dentro de un mismo proceso) y se piden garantías de entrega y reintentos: eso lo da un message broker (RabbitMQ, Kafka) implementando publish/subscribe.",
      descartes: {
        "Observer in-process": "Observer resuelve lo mismo conceptualmente pero dentro de una sola aplicación; no da persistencia de mensajes ni reintentos entre servicios.",
        "Facade": "No aplica.",
        "API Gateway": "Un gateway es la puerta de entrada de los clientes externos, no el bus de eventos interno.",
      },
    },
    {
      id: 28, tema: "Facade",
      enunciado: '(TurnoÁgil / La Scalo) Se prevé sumar una app mobile además de la web, sin equipo mobile propio, y <b class="kw">los contratos de los microservicios no deben cambiar por necesidades de las interfaces gráficas</b>.',
      opciones: ["BFF / API Gateway (Facade a nivel arquitectura)", "Broker", "Adapter en el dominio", "Template Method"],
      correcta: "BFF / API Gateway (Facade a nivel arquitectura)",
      patron: "arquitectura-web",
      porque: "Se agrega una capa intermedia (Backend For Frontend) que compone las respuestas que cada canal necesita. Los microservicios mantienen su contrato y la lógica de presentación no se filtra hacia adentro. Conceptualmente es un Facade a escala de componentes.",
      descartes: {
        "Broker": "No se pide comunicación asincrónica entre servicios.",
        "Adapter en el dominio": "El problema es de arquitectura de frontend, no de traducir una interfaz de un tercero.",
        "Template Method": "No aplica.",
      },
    },
    {
      id: 29, tema: "Adapter",
      enunciado: '(Libros Circulares) Se integra con <b class="kw">un sistema externo denominado BookIA</b> al cual se le envía el historial reciente y <b class="kw">retorna una lista de libros recomendados</b>, que después se filtra según disponibilidad en la comunidad.',
      opciones: ["Adapter", "Observer", "Command", "Composite"],
      correcta: "Adapter",
      patron: "adapter",
      porque: "El dominio define <code>MotorDeRecomendaciones</code> y <code>BookIAAdapter</code> traduce el JSON de la API a objetos del dominio. Así el filtrado por disponibilidad no depende del formato del tercero.",
      descartes: {
        "Observer": "No hay notificaciones.",
        "Command": "No hace falta cosificar la llamada como acción (salvo que la encoles para el modo periódico).",
        "Composite": "No hay árbol.",
      },
    },
    {
      id: 30, tema: "Strategy",
      enunciado: '(TurnoÁgil) El motor calcula el copago con <b class="kw">reglas configurables</b>: Cobertura Total (Premium → 0), Plan Básico (30%) y Recargo Urgente (+20% si faltan menos de 2 h). <b class="kw">Se aplican de manera conjunta</b> y <b class="kw">podrían agregarse nuevas</b>.',
      opciones: ["Strategy (colección de reglas)", "State", "Template Method", "Facade"],
      correcta: "Strategy (colección de reglas)",
      patron: "strategy",
      porque: "Mismo esquema que ProtegePro: cada regla es una estrategia y el motor mantiene una lista que aplica en cadena sobre el valor base. Agregar una regla = agregar una clase (Open/Closed).",
      descartes: {
        "State": "El copago no atraviesa estados.",
        "Template Method": "Las reglas no comparten esqueleto de pasos.",
        "Facade": "El motor de copagos puede exponerse como facade, pero eso no resuelve la variabilidad de reglas.",
      },
    },
    {
      id: 31, tema: "Composite",
      enunciado: 'El sistema de permisos debe soportar <b class="kw">grupos que pueden contener otros grupos</b> y usuarios. Para saber si alguien tiene un permiso hay que <b class="kw">recorrer toda la jerarquía</b>.',
      opciones: ["Composite", "Strategy", "Observer", "Simple Factory"],
      correcta: "Composite",
      patron: "composite",
      porque: "Grupos que contienen grupos = árbol. <code>SujetoDeSeguridad.tienePermiso(p)</code> devuelve directamente en el usuario y delega recursivamente en el grupo.",
      descartes: {
        "Strategy": "No hay algoritmos alternativos.",
        "Observer": "No hay eventos.",
        "Simple Factory": "No es creación.",
      },
    },
    {
      id: 32, tema: "State",
      enunciado: '(La Scalo App) Se gestiona el <b class="kw">ciclo de vida de la lesión</b> a través de sus estados: inicio de tratamiento, evolución favorable o desfavorable, principio de recuperación y recuperación parcial o total. Se requiere <b class="kw">trazabilidad completa de la evolución</b>.',
      opciones: ["State (+ bitácora)", "Strategy", "Command", "Adapter"],
      correcta: "State (+ bitácora)",
      patron: "state",
      porque: "Ciclo de vida con transiciones válidas ⇒ State. La trazabilidad se resuelve con una <b>bitácora</b>: cada transición agrega una entrada con fecha, estado anterior, estado nuevo y el médico responsable.",
      descartes: {
        "Strategy": "No hay algoritmos intercambiables para una misma tarea.",
        "Command": "Podría usarse si hubiera que deshacer transiciones, pero el enunciado no lo pide.",
        "Adapter": "No hay integración externa en este servicio.",
      },
    },
    {
      id: 33, tema: "Observer",
      enunciado: '(La Scalo App) Cuando el Servicio III actualiza el estado de una lesión, <b class="kw">el Servicio I debe reflejar</b> la nueva disponibilidad del jugador. Los servicios están <b class="kw">desplegados por separado</b>.',
      opciones: ["Publicar evento en el broker (Pub/Sub)", "Observer in-process", "Facade", "Simple Factory"],
      correcta: "Publicar evento en el broker (Pub/Sub)",
      patron: "broker",
      porque: "Es la misma idea de Observer pero <b>entre procesos</b>: al no compartir memoria, el Servicio III publica <code>LesionActualizada</code> y el Servicio I se suscribe. Evita el acoplamiento temporal de una llamada HTTP directa.",
      descartes: {
        "Observer in-process": "No sirve entre servicios desplegados por separado: no comparten memoria.",
        "Facade": "No aplica.",
        "Simple Factory": "No aplica.",
      },
    },
    {
      id: 34, tema: "Template Method",
      enunciado: 'Todas las validaciones de identidad hacen lo mismo: <b class="kw">registrar el intento, llamar al organismo, interpretar la respuesta y guardar el resultado</b>. Cambia sólo <b class="kw">cómo se arma el pedido y cómo se lee la respuesta</b> según el organismo.',
      opciones: ["Template Method (+ Adapter por organismo)", "Strategy sola", "Observer", "Composite"],
      correcta: "Template Method (+ Adapter por organismo)",
      patron: "template-method",
      porque: "El esqueleto (registrar → llamar → interpretar → guardar) es fijo; los pasos de armado e interpretación varían. Cada organismo además necesita un Adapter para hablar su protocolo. Los dos patrones se complementan.",
      descartes: {
        "Strategy sola": "Con Strategy sola tendrías que duplicar el esqueleto en cada implementación (o inyectar dos estrategias). Template Method lo escribe una sola vez.",
        "Observer": "No hay notificaciones.",
        "Composite": "No hay árbol.",
      },
    },

    /* ---------------------------- BUILDER ----------------------------- */
    {
      id: 35, tema: "Builder",
      enunciado: 'El sistema genera un <b class="kw">reporte configurable</b>: el usuario <b class="kw">elige qué secciones incluir</b> (resumen, gráficos, detalle, anexos), el formato y el rango. <b class="kw">Muchas de esas opciones son opcionales</b>.',
      opciones: ["Builder", "Factory Method", "Strategy", "Composite"],
      correcta: "Builder",
      patron: "builder",
      porque: "Objeto con muchos atributos, varios opcionales, que el usuario arma por partes. El Builder lo construye paso a paso y valida antes de crear, evitando el constructor telescópico.",
      descartes: {
        "Factory Method": "No se decide <i>qué clase</i> crear (siempre es un Reporte), sino <i>cómo configurarlo</i>.",
        "Strategy": "No hay algoritmos alternativos para una misma tarea.",
        "Composite": "No hay estructura de árbol.",
      },
    },
    {
      id: 36, tema: "Builder",
      enunciado: 'Para crear una <b class="kw">orden de compra</b> hay que ir <b class="kw">agregando ítems, aplicando cupones, definiendo dirección de envío y método de pago</b>, todo <b class="kw">de a poco</b> antes de confirmarla. Algunos datos son opcionales.',
      opciones: ["Builder", "Command", "Facade", "Observer"],
      correcta: "Builder",
      patron: "builder",
      porque: "La orden se va armando por pasos, con partes opcionales, y recién al final se confirma (build). Es el caso de manual de Builder.",
      descartes: {
        "Command": "No estamos encolando ni deshaciendo acciones: estamos construyendo un objeto.",
        "Facade": "No hay un subsistema complejo que simplificar.",
        "Observer": "No hay notificaciones.",
      },
    },
    {
      id: 37, tema: "Builder vs Factory",
      enunciado: 'Un <b class="kw">Punto</b> tiene coordenadas <code>x</code> e <code>y</code>, <b class="kw">ambas obligatorias</b>, y no se prevén más atributos.',
      opciones: ["Ninguno: un constructor normal alcanza", "Builder", "Factory", "Strategy"],
      correcta: "Ninguno: un constructor normal alcanza",
      patron: "builder",
      porque: "Dos atributos obligatorios, sin opciones ni variantes. Un Builder acá sería sobreingeniería: agrega una clase entera sin ningún beneficio.",
      descartes: {
        "Builder": "Se justifica con muchos atributos y opciones opcionales, no con dos campos obligatorios.",
        "Factory": "No hay decisión de qué tipo crear.",
        "Strategy": "No hay algoritmos alternativos.",
      },
    },

    /* -------------------- PUB/SUB vs OBSERVER -------------------- */
    {
      id: 38, tema: "Observer vs Pub/Sub",
      enunciado: 'Dentro de <b class="kw">una misma aplicación</b>, cuando cambia la cotización del dólar, <b class="kw">todos los gráficos abiertos</b> en pantalla deben actualizarse automáticamente.',
      opciones: ["Observer (in-process)", "Publicación-Suscripción con broker", "Strategy", "Facade"],
      correcta: "Observer (in-process)",
      patron: "observer",
      porque: "Todo ocurre dentro del mismo proceso, con referencias en memoria: Observer. No hace falta un broker para algo in-process.",
      descartes: {
        "Publicación-Suscripción con broker": "Sería sobredimensionado: el broker sirve cuando los interesados están en otros servicios.",
        "Strategy": "No hay algoritmos intercambiables.",
        "Facade": "No hay subsistema a simplificar.",
      },
    },
    {
      id: 39, tema: "Observer vs Pub/Sub",
      enunciado: 'Cuando el Servicio de Pedidos confirma un pedido, <b class="kw">los servicios de Facturación, Stock y Notificaciones</b> —<b class="kw">desplegados por separado</b>— deben reaccionar, y <b class="kw">podrían sumarse más</b>.',
      opciones: ["Publicación-Suscripción con broker", "Observer in-process", "Command", "Template Method"],
      correcta: "Publicación-Suscripción con broker",
      patron: "pubsub",
      porque: "Los consumidores están en procesos distintos, así que no comparten memoria: el pedido publica <code>PedidoConfirmado</code> en un topic y cada servicio se suscribe. Sumar un consumidor no toca al publicador.",
      descartes: {
        "Observer in-process": "No cruza el límite del proceso: los servicios no comparten memoria.",
        "Command": "No es una acción configurable a encolar.",
        "Template Method": "No hay esqueleto de algoritmo.",
      },
    },
    {
      id: 40, tema: "Observer vs Pub/Sub",
      enunciado: 'Un <b class="kw">botón</b> de la interfaz debe <b class="kw">avisar a sus listeners</b> (dentro de la misma app de escritorio) cada vez que se lo presiona.',
      opciones: ["Observer (in-process)", "Publicación-Suscripción con broker", "State", "Adapter"],
      correcta: "Observer (in-process)",
      patron: "observer",
      porque: "Listeners dentro de la misma aplicación, con referencias directas: es el ejemplo clásico de Observer. Un broker no tiene sentido acá.",
      descartes: {
        "Publicación-Suscripción con broker": "Es para comunicación entre sistemas, no dentro de una sola app.",
        "State": "No hay ciclo de vida.",
        "Adapter": "No hay interfaces incompatibles.",
      },
    },

    /* ---------------------------- SINGLETON --------------------------- */
    {
      id: 44, tema: "Singleton",
      enunciado: 'El sistema debe tener una <b class="kw">única instancia</b> de la configuración global, <b class="kw">compartida por todos</b> los componentes, con un <b class="kw">punto de acceso común</b>.',
      opciones: ["Singleton", "Simple Factory", "Facade", "Builder"],
      correcta: "Singleton",
      patron: "singleton",
      porque: "“Una única instancia compartida” + “punto de acceso común” = Singleton: constructor privado + instancia estática + <code>getInstance()</code>. Idealmente, esa instancia única se <b>inyecta</b> en vez de accederse globalmente.",
      descartes: {
        "Simple Factory": "La fábrica decide <i>qué</i> crear; acá no hay variantes, hay <i>una sola</i> instancia.",
        "Facade": "No estamos simplificando un subsistema.",
        "Builder": "No hay un objeto complejo que armar por partes.",
      },
      nota: "Ojo: Singleton es el patrón más criticado (estado global, difícil de testear). Si podés, lográ la unicidad con una instancia inyectada.",
    },
    {
      id: 45, tema: "Singleton",
      enunciado: 'Se necesita un <b class="kw">único pool de conexiones</b> a la base de datos para toda la aplicación, y un <b class="kw">logger central</b> al que todos escriban.',
      opciones: ["Singleton (mejor si es inyectado)", "Factory Method", "Observer", "Strategy"],
      correcta: "Singleton (mejor si es inyectado)",
      patron: "singleton",
      porque: "Recursos de los que debe existir <b>uno solo</b> en todo el sistema (pool, logger): es Singleton. En un framework como Spring se logra con un bean único inyectado, que da la misma unicidad sin el estado global.",
      descartes: {
        "Factory Method": "No hay decisión de qué subclase crear.",
        "Observer": "No hay notificación uno-a-muchos.",
        "Strategy": "No hay algoritmos alternativos.",
      },
    },

    /* ------------------ NINGUNO (no sobreingeniería) ------------------ */
    {
      id: 41, tema: "Ninguno",
      enunciado: 'El sistema debe calcular el <b class="kw">IVA</b>, que es <b class="kw">siempre el 21%</b>. <b class="kw">No se prevén otras alícuotas</b>.',
      opciones: ["Ninguno: una constante o un cálculo directo", "Strategy", "Factory", "Template Method"],
      correcta: "Ninguno: una constante o un cálculo directo",
      patron: "patrones-intro",
      porque: "Una sola forma de calcular, sin variantes ni perspectiva de crecer. Meter Strategy sería sobreingeniería: agregar una interfaz y una clase para una única implementación no aporta nada y resta puntos.",
      descartes: {
        "Strategy": "Se justifica con varias alternativas y necesidad de extensión; acá no hay ninguna.",
        "Factory": "No hay decisión de qué crear.",
        "Template Method": "No hay esqueleto con pasos variables.",
      },
      nota: "Que cambie el <i>valor</i> de una constante no requiere polimorfismo: requiere configuración.",
    },
    {
      id: 42, tema: "Ninguno",
      enunciado: 'Hay que crear un objeto <b class="kw">Cliente</b> a partir de los datos del formulario. <b class="kw">Existe una sola clase Cliente</b> y no hay variantes.',
      opciones: ["Ninguno: new Cliente(datos) o un named constructor", "Simple Factory", "Builder", "Abstract Factory"],
      correcta: "Ninguno: new Cliente(datos) o un named constructor",
      patron: "patrones-intro",
      porque: "No hay ninguna decisión de qué clase instanciar, así que no hay problema que resolver. Una factory “por las dudas” es sobreingeniería.",
      descartes: {
        "Simple Factory": "Sirve cuando hay que elegir entre varias clases concretas; acá hay una sola.",
        "Builder": "Se justifica con muchos atributos opcionales, no acá.",
        "Abstract Factory": "Ni siquiera está en el temario, y menos aplica.",
      },
    },
    {
      id: 43, tema: "Ninguno",
      enunciado: 'Un servicio expone un endpoint que <b class="kw">devuelve la lista de países</b> desde una tabla fija. Es una <b class="kw">lectura simple</b>, sin reglas ni integraciones.',
      opciones: ["Ninguno: controller → service → repository directo", "Facade", "Strategy", "Observer"],
      correcta: "Ninguno: controller → service → repository directo",
      patron: "patrones-intro",
      porque: "Una lectura trivial no necesita ningún patrón. La arquitectura en capas básica alcanza. Agregar Facade, Strategy u Observer sería complejidad injustificada.",
      descartes: {
        "Facade": "No hay un subsistema complejo que coordinar.",
        "Strategy": "No hay algoritmos alternativos.",
        "Observer": "No hay nada que notificar.",
      },
    },
  ];
})();
