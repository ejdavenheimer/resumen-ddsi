/* ============================================================
   Patrón Adapter
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "adapter",
    title: "Adapter",
    tag: "🔌",
    group: "Patrones de Diseño",
    resumen: "Estructural · traducir interfaces",
    keywords: ["adapter", "adaptador", "integrar", "servicio externo", "legacy", "wrapper", "envolver", "sdk"],
    render(el) {
      APP.patternPage(el, {
        categoria: "Estructural",
        titulo: "Adapter",
        intencion: "Hacer que dos interfaces incompatibles trabajen juntas, sin modificar el código de ninguna de las dos.",

        analogia: {
          emoji: "🔌",
          html: `<p>Un enchufe adaptador de viaje. Tenés tu cargador con ficha argentina y en Europa los enchufes son
            distintos. No tirás el cargador ni rompés la pared: usás un adaptador. Tiene una parte que entra “a lo europeo”
            y otra que recibe la ficha argentina. <b>Traduce entre dos formas incompatibles</b> sin cambiar ninguna de las dos.</p>`,
        },

        problema: `
          <p>Tenés una interfaz que tu sistema usa y necesitás integrar una librería o un servicio externo que tiene
          otra interfaz completamente distinta. El problema es que <b>no podés modificar ninguna de las dos</b>:
          el servicio externo no es tuyo, y modificar todo tu sistema para adaptarse a él sería absurdo (y habría que
          volver a hacerlo cuando cambie el proveedor).</p>
          <p>Este es, sin exagerar, <b>el patrón que más aparece en los finales de la cátedra</b>. Todos los enunciados
          recientes tienen al menos una integración externa: el RENAPER y BookIA en Libros Circulares, la API de Clima
          y la de Seguridad en ProtegePro, el motor de validación médica en TurnoÁgil, LinkedIn y Glassdoor en Talentia,
          el agente de IA en La Scalo.</p>
          <p>Si el enunciado dice “<i>este servicio no puede ser modificado pues no es de nuestra propiedad</i>”
          (TurnoÁgil, textual), te está pidiendo Adapter con nombre y apellido.</p>`,

        mal: {
          intro: "<p>Lo natural cuando uno tiene apuro: llamar directamente al SDK del proveedor desde el código de negocio.</p>",
          code: `class Notificador {

    public void enviar(String telefono, String mensaje) {
        // Código pegoteado directo a la librería de Twilio
        Twilio.init("AC123abc", "mi-token-secreto");
        Message.creator(
            new PhoneNumber(telefono),
            new PhoneNumber("+541100000000"),
            mensaje
        ).create();
    }
}

class ContratacionService {
    private Notificador notificador = new Notificador();
    // ...y 14 clases más que hacen lo mismo
}`,
          nota: `<b>Tres problemas concretos:</b> (1) si mañana se cambia Twilio por otro proveedor hay que modificar
            <code>Notificador</code> y todo lo que dependa de su forma particular (viola <b>OCP</b>); (2) el dominio
            depende de una clase concreta de un tercero (viola <b>DIP</b>); (3) no podés testear nada sin mandar
            SMS reales o sin levantar la red.`,
        },

        bien: {
          intro: `<p>La clave: <b>la interfaz la define tu dominio</b>, con su propio vocabulario. El adapter es
            el único lugar de todo el sistema que sabe que existe Twilio.</p>`,
          code: `// 1) La interfaz que define TU dominio, con TU vocabulario
interface MedioDeContacto {
    void enviar(Destinatario destinatario, String mensaje);
}

// 2) El adapter: traduce tu interfaz a la del proveedor
class TwilioAdapter implements MedioDeContacto {
    private final TwilioClient client;

    public TwilioAdapter(TwilioClient client) {
        this.client = client;
    }

    @Override
    public void enviar(Destinatario destinatario, String mensaje) {
        // acá vive TODO lo que sabe de Twilio: formatos, códigos de error, reintentos
        client.createMessage(destinatario.getTelefono(), mensaje).send();
    }
}

// 3) Otro proveedor = otro adapter. Nada más cambia.
class InfobipAdapter implements MedioDeContacto {
    private final InfobipApi api;

    @Override
    public void enviar(Destinatario destinatario, String mensaje) {
        api.sendSms(new SmsRequest(destinatario.getTelefono(), mensaje));
    }
}

// 4) El dominio depende SÓLO de la abstracción
class ContratacionService {
    private final MedioDeContacto contacto;

    public ContratacionService(MedioDeContacto contacto) {   // se inyecta
        this.contacto = contacto;
    }

    public void confirmar(Contratacion c) {
        contacto.enviar(c.getTitular(), "Contratación " + c.getCodigo() + " confirmada");
    }
}`,
          nota: `Fijate que <code>MedioDeContacto</code> habla de <code>Destinatario</code> y <code>mensaje</code>,
            no de <code>PhoneNumber</code> ni de <code>Message</code>. <b>Si la interfaz usara los tipos del proveedor,
            el detalle se filtraría</b> y el patrón no serviría de nada. Ese es el error más común al aplicarlo.`,
        },

        uml: `classDiagram
    class MedioDeContacto {
        <<interface>>
        +enviar(Destinatario, String) void
    }
    class TwilioAdapter {
        -client: TwilioClient
        +enviar(Destinatario, String) void
    }
    class InfobipAdapter {
        -api: InfobipApi
        +enviar(Destinatario, String) void
    }
    class TwilioClient {
        +createMessage(String, String) Message
    }
    class ContratacionService {
        -contacto: MedioDeContacto
        +confirmar(Contratacion) void
    }
    MedioDeContacto <|.. TwilioAdapter
    MedioDeContacto <|.. InfobipAdapter
    TwilioAdapter --> TwilioClient : envuelve
    ContratacionService --> MedioDeContacto`,

        roles: [
          { n: "MedioDeContacto", d: "el <b>Target</b>: la interfaz que tu sistema espera, escrita en el vocabulario de tu dominio. Es tuya y no la negociás con nadie." },
          { n: "TwilioAdapter", d: "el <b>Adapter</b>: implementa el Target y traduce cada llamada al lenguaje del Adaptee. Es el único punto del sistema que conoce al proveedor." },
          { n: "TwilioClient", d: "el <b>Adaptee</b>: la clase externa que ya existe y que no podés modificar (SDK, cliente HTTP, sistema legacy)." },
          { n: "ContratacionService", d: "el <b>Cliente</b>: usa el Target y nunca sabe qué proveedor hay del otro lado. Por eso se puede testear con un doble." },
        ],

        mano: [
          "Arriba, tu <b>interfaz de dominio</b> (Target): rectángulo con <code>&lt;&lt;interface&gt;&gt;</code> sobre el nombre (ej. <code>MedioDeContacto</code>).",
          "Debajo, el <b>Adapter</b> (<code>TwilioAdapter</code>), conectado a la interfaz con flecha <b>punteada de punta hueca</b> (realización).",
          "Al costado del adapter, el <b>Adaptee</b>: la clase externa que no podés tocar (<code>TwilioClient</code>). Marcala como externa (borde punteado o etiqueta “EXTERNO”).",
          "Del adapter al adaptee, flecha <b>llena</b> (asociación): el adapter lo envuelve.",
          "A la izquierda, el <b>Cliente</b> (el service), con flecha llena a la <i>interfaz</i>, nunca al adapter concreto.",
          "<b>Tip:</b> lo único que tiene que quedar clarísimo es que el cliente apunta a la interfaz y el adapter la implementa. Ese triángulo es el patrón.",
        ],

        keywords: [
          { k: "integrarse con un servicio externo", ej: "“deberá integrarse con un servicio externo provisto por el RENAPER” (Libros Circulares)" },
          { k: "consultar / consumir una API externa", ej: "“consulta a un agente de inteligencia artificial” (La Scalo)" },
          { k: "no puede ser modificado, no es de nuestra propiedad", ej: "“este servicio no puede ser modificado pues no es de nuestra propiedad” (TurnoÁgil)" },
          { k: "librería de terceros / SDK", ej: "usar el SDK de Twilio, Stripe o Mercado Pago" },
          { k: "sistema legacy", ej: "un sistema viejo en COBOL que expone archivos de texto" },
          { k: "expone un endpoint REST propio", ej: "“expone un endpoint REST para dicho propósito” (TurnoÁgil)" },
          { k: "retorna en formato JSON", ej: "“devolviendo un resultado de análisis en formato JSON” (La Scalo) → adaptar ese JSON a objetos del dominio" },
          { k: "el cobro/pago lo realiza otro sistema", ej: "“El cobro se realiza por otro sistema” (ProtegePro)" },
        ],

        noUsar: `
          <p>Si <b>vos sos dueño de las dos interfaces</b> y podés modificar cualquiera de ellas, no metas un adapter:
          cambiá directamente la que corresponda. Adapter tiene sentido justamente cuando <b>una de las dos no la podés tocar</b>.</p>
          <p>Tampoco lo uses como excusa para envolver <i>todo</i>. Si estás envolviendo una clase tuya que ya tiene la
          interfaz que necesitás, sólo estás agregando una capa de indirección sin beneficio.</p>
          <p><b>Señal de que lo estás usando mal:</b> el adapter no traduce nada, sólo reenvía las llamadas tal cual
          (<code>public void enviar(x) { otro.enviar(x); }</code>). Ahí no hay incompatibilidad que resolver.</p>`,

        justificar: [
          `“Usé <b>Adapter</b> porque el sistema debe integrarse con <b>[RENAPER / BookIA / la API de clima]</b>, que expone su
           propia interfaz y <b>no está bajo nuestro control</b>. Al envolver esa integración en un adapter, el resto de la
           aplicación depende sólo de la abstracción <b>[ValidadorDeIdentidad]</b>, definida en el lenguaje del dominio.”`,
          `“Esta decisión cumple <b>Dependency Inversion</b>: el módulo de alto nivel (el servicio de registro) y el de bajo
           nivel (el cliente HTTP del organismo) dependen ambos de la abstracción. Y cumple <b>Open/Closed</b>: si mañana
           se cambia de proveedor, se agrega un adapter nuevo <b>sin modificar</b> ninguna clase existente.”`,
          `“Un beneficio adicional concreto es la <b>testeabilidad</b>: en los tests inyectamos una implementación falsa de
           <b>[ValidadorDeIdentidad]</b>, con lo cual las reglas de negocio se prueban sin depender de la disponibilidad
           del servicio externo.”`,
        ],

        confusiones: [
          {
            titulo: "Adapter vs Facade",
            a: { t: "Adapter", html: `<p>Cambia el <b>aspecto (la interfaz)</b> de algo que <b>ya existe</b>.</p>
              <p>Hay una interfaz ajena y una interfaz propia, y el adapter traduce entre las dos.</p>
              <p>Suele envolver <b>una</b> cosa.</p>` },
            b: { t: "Facade", html: `<p>Crea una interfaz <b>nueva y más simple</b> sobre un conjunto de cosas complejas.</p>
              <p>No hay una interfaz “destino” preexistente: la inventás vos para simplificar.</p>
              <p>Suele coordinar <b>varias</b> clases.</p>` },
            regla: "<b>Adapter traduce; Facade simplifica.</b> Y no son excluyentes: un facade puede usar adapters adentro (es exactamente lo que pasa en el Servicio IV de ProtegePro).",
          },
          {
            titulo: "Adapter vs Decorator",
            a: { t: "Adapter", html: `<p><b>Cambia</b> la interfaz.</p><p>No agrega comportamiento nuevo: sólo traduce.</p>
              <p>Se usa una vez, en el borde del sistema.</p>` },
            b: { t: "Decorator", html: `<p><b>Mantiene</b> la misma interfaz.</p><p>Agrega comportamiento (logging, caché, reintentos).</p>
              <p>Se pueden apilar varios: <code>new Cache(new Retry(new TwilioAdapter(...)))</code>.</p>` },
            regla: "Si después de envolver la interfaz es <b>la misma</b>, es Decorator. Si es <b>otra</b>, es Adapter.",
          },
        ],

        ejercicio: [
          { n: 1, topic: "Adapter", type: "mc",
            q: "“El sistema debe integrarse con la API de un servicio de facturación externo llamado FacturApp, que no podemos modificar.” ¿Qué patrón usarías?",
            options: [
              { t: "Adapter: una interfaz <code>ServicioDeFacturacion</code> en el dominio y un <code>FacturAppAdapter</code> que la implementa", ok: true },
              { t: "Facade: una clase que simplifique el uso de FacturApp", ok: false },
              { t: "Strategy: distintas formas de facturar", ok: false },
              { t: "Ninguno: llamo a FacturApp directamente desde el service", ok: false },
            ],
            explain: "Hay una interfaz ajena que no podés tocar y una interfaz propia que querés preservar: Adapter. Facade sería la respuesta si estuvieras simplificando un subsistema <i>propio</i> con varias clases. Strategy aparecería si hubiera <i>varios</i> proveedores intercambiables — y ahí cada proveedor sería un adapter que además funciona como estrategia." },
          { n: 2, topic: "Adapter", type: "mc",
            q: "Al escribir la interfaz del dominio, ¿cuál de estas firmas está bien?",
            options: [
              { t: "<code>boolean validar(Persona p)</code>", ok: true },
              { t: "<code>JsonNode consultarRenaper(String dni, String nombre)</code>", ok: false },
              { t: "<code>ResponseEntity&lt;RenaperDTO&gt; validar(RenaperRequest r)</code>", ok: false },
            ],
            explain: "La abstracción pertenece al <b>dominio</b> y debe estar escrita en su vocabulario. Si devuelve un <code>JsonNode</code> o un DTO del proveedor, el detalle se filtró hacia arriba y no hay inversión de dependencias real: cambiar de proveedor volvería a romper el dominio." },
          { n: 3, topic: "Adapter", type: "vf",
            q: "Si tenemos dos proveedores de SMS intercambiables y el usuario puede elegir cuál usar, cada adapter cumple además el rol de Strategy.",
            options: [{ t: "Verdadero", ok: true }, { t: "Falso", ok: false }],
            explain: "Sí, y es una combinación muy común. Los patrones describen <i>intenciones</i>, no clases exclusivas: la misma clase puede cumplir el rol de Adapter (traduce hacia el proveedor) y de ConcreteStrategy (es una de varias alternativas intercambiables)." },
        ],
      });
    },
  });
})();
