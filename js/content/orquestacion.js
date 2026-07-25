/* ============================================================
   Integración — Orquestación de Casos de Uso
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "orquestacion",
    title: "Orquestación (Casos de Uso)",
    tag: "🎼",
    group: "Integración y comunicación",
    resumen: "Services, capas, coreografía",
    keywords: ["orquestacion", "coreografia", "caso de uso", "service", "repositorio", "capas", "saga", "roles", "permisos"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Orquestación de Casos de Uso</h1>
          <p class="lead">Coordinar varios pasos o servicios para cumplir un requerimiento completo.</p>
        </div>

        <div class="analogia">
          <div class="emo">🎼</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p><b>Orquestación</b> es una orquesta con director: el director marca cuándo entra cada instrumento,
            sabe cómo sigue la obra y si algo sale mal, corrige.</p>
            <p><b>Coreografía</b> es un ballet aprendido: nadie da instrucciones en el momento. Cada bailarín sabe qué
            hacer y cuándo, reaccionando a lo que pasa alrededor. Más flexible, pero nadie tiene la foto completa.</p>
          </div>
        </div>

        <h2>Los dos enfoques</h2>
        <div class="vs-grid">
          <div class="vs-a">
            <h4>🎼 Orquestación</h4>
            <p>Un componente central (el <b>orquestador</b>) dirige el flujo: sabe a quién llamar, en qué orden y qué
            hacer si algo falla.</p>
            <p><b>✅</b> Visibilidad total del flujo en un solo lugar · fácil de razonar y debuggear · manejo de errores
            y compensaciones centralizado.</p>
            <p><b>❌</b> El orquestador se acopla a todos · es un punto único de falla · tiende a crecer.</p>
          </div>
          <div class="vs-b">
            <h4>💃 Coreografía</h4>
            <p>Cada componente reacciona a <b>eventos</b> y publica los suyos. No hay director.</p>
            <p><b>✅</b> Máximo desacoplamiento · agregar un participante no toca a nadie · resiste bien los cambios.</p>
            <p><b>❌</b> Nadie tiene el flujo completo: entenderlo requiere leer varios servicios · trazabilidad difícil
            (hace falta tracing distribuido) · riesgo de ciclos de eventos.</p>
          </div>
        </div>

        ${APP.uml(`sequenceDiagram
    autonumber
    participant O as Orquestador (Servicio IV)
    participant A as Servicio I
    participant B as Servicio II
    participant C as Servicio III
    Note over O,C: ORQUESTACIÓN
    O->>A: obtener equipo
    A-->>O: equipo
    O->>B: cotizar prima
    B-->>O: prima
    O->>C: solicitar validación
    C-->>O: ok
    Note over O: el orquestador conoce todo el flujo`, "Orquestación")}

        ${APP.uml(`sequenceDiagram
    autonumber
    participant A as Servicio A
    participant BR as Broker
    participant B as Servicio B
    participant C as Servicio C
    Note over A,C: COREOGRAFÍA
    A->>BR: publica ContratacionCreada
    BR-->>B: ContratacionCreada
    B->>BR: publica PrimaCalculada
    BR-->>C: PrimaCalculada
    C->>BR: publica ValidacionResuelta
    Note over A,C: nadie conoce el flujo completo`, "Coreografía")}

        <h2>Cuándo usar cada una</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Situación</th><th>Enfoque</th><th>Por qué</th></tr></thead>
          <tbody>
            <tr><td>Flujo complejo con muchas reglas de negocio y compensaciones</td><td><b>Orquestación</b></td><td>Necesitás ver y controlar el flujo completo</td></tr>
            <tr><td>Hace falta trazabilidad estricta del proceso de punta a punta</td><td><b>Orquestación</b></td><td>Un solo lugar registra el avance</td></tr>
            <tr><td>Hay un “dueño” natural del caso de uso</td><td><b>Orquestación</b></td><td>Ese servicio es el orquestador (Contrataciones, Reservas)</td></tr>
            <tr><td>Muchos interesados que van cambiando</td><td><b>Coreografía</b></td><td>Sumar un consumidor no toca a nadie</td></tr>
            <tr><td>Los servicios cambian mucho y son de equipos distintos</td><td><b>Coreografía</b></td><td>Máxima autonomía</td></tr>
            <tr><td>Reacciones secundarias a un hecho ya consumado</td><td><b>Coreografía</b></td><td>“Ya pasó esto, el que quiera que reaccione”</td></tr>
          </tbody>
        </table></div>

        <div class="callout key">
          <div class="callout-title">🔑 Respuesta modelo para Libros Circulares (punto 2.A.d)</div>
          <p>El punto pide justificar el enfoque. Lo que puntúa es reconocer que <b>no es una elección binaria</b>:</p>
          <p>“Uso un enfoque <b>híbrido</b>. El caso de uso principal —realizar una operación sobre un ejemplar— se resuelve
          por <b>orquestación</b>: el Servicio II actúa como orquestador porque el flujo tiene reglas de negocio
          estrictas (validar que el ejemplar esté en poder de quien lo presta, que ambos pertenezcan a la misma
          comunidad, que el ejemplar no esté dado de baja) y si algo falla hay que abortar la operación completa;
          necesito ver ese flujo en un solo lugar.”</p>
          <p>“En cambio, las <b>reacciones a un hecho ya consumado</b> —notificar, disparar la generación de
          recomendaciones, actualizar estadísticas— se resuelven por <b>coreografía</b>: el Servicio II publica el evento
          <code>PrestamoFinalizado</code> y quien esté interesado se suscribe. Así el orquestador no se acopla a los
          consumidores y agregar uno nuevo no lo modifica.”</p>
        </div>

        <h2>Orquestación dentro de un servicio: la capa de aplicación</h2>
        <p>En diseño OO —que es lo que más se pide en el parcial— cada caso de uso tiene un <b>service</b> que orquesta
        las clases del dominio. Es un <a class="inline" data-go="facade">Facade</a>.</p>
        ${APP.code(`class RealizarPrestamoService {

    private final EjemplarRepository ejemplares;
    private final PersonaRepository personas;
    private final PublicadorDeEventos eventos;

    @Transactional
    public Prestamo ejecutar(RealizarPrestamoCommand cmd) {
        // 1) Traer lo que hace falta (infraestructura)
        Ejemplar ejemplar = ejemplares.porId(cmd.ejemplarId())
                                      .orElseThrow(EjemplarInexistente::new);
        Persona de = personas.porId(cmd.deId()).orElseThrow();
        Persona a  = personas.porId(cmd.aId()).orElseThrow();

        // 2) Las REGLAS las decide el DOMINIO, no el service
        Prestamo prestamo = ejemplar.prestar(de, a, cmd.vencimiento());

        // 3) Persistir y publicar
        ejemplares.guardar(ejemplar);
        eventos.publicar(new PrestamoRealizado(prestamo));

        return prestamo;
    }
}`, { variant: "good", label: "✅ El service coordina; el dominio decide" })}
        <div class="callout warn">
          <div class="callout-title">⚠️ El error que más se cobra</div>
          <p>Que el service tome las decisiones de negocio:</p>
          ${APP.code(`// ❌ El service decide y el dominio queda anémico
if (!ejemplar.getTenedorActual().equals(de))  throw new NoLoTiene();
if (ejemplar.getEstado().equals("BAJA"))      throw new DadoDeBaja();
if (!compartenComunidad(de, a))               throw new SinComunidad();
ejemplar.setTenedorActual(a);
ejemplar.setEstado("PRESTADO");`, { variant: "bad", label: "❌ Dominio anémico" })}
          <p>Toda esa lógica pertenece a <code>Ejemplar.prestar(de, a)</code> y a su <a class="inline" data-go="state">estado</a>.
          El service debería poder leerse como el <b>resumen del caso de uso</b>, no como su implementación.</p>
        </div>

        <h2>Repositorios</h2>
        <p>La abstracción que separa el dominio de la persistencia. <b>La interfaz la define el dominio</b> (DIP);
        la implementación vive en infraestructura.</p>
        ${APP.code(`// En el DOMINIO: interfaz en el vocabulario del negocio
public interface EjemplarRepository {
    Optional<Ejemplar> porId(EjemplarId id);
    List<Ejemplar> disponiblesEn(Comunidad comunidad);
    void guardar(Ejemplar ejemplar);
}

// En INFRAESTRUCTURA: la implementación concreta
class EjemplarRepositoryJpa implements EjemplarRepository { /* JPA, SQL, lo que sea */ }
class EjemplarRepositoryEnMemoria implements EjemplarRepository { /* para los tests */ }`)}

        <h2>Usuarios, roles y permisos</h2>
        <p>Tema de la clase 4 y presente en varios finales. El modelo estándar es <b>RBAC</b>:</p>
        ${APP.uml(`classDiagram
    class Usuario {
        -username: String
        -credencial: Credencial
        +tienePermiso(Permiso) boolean
    }
    class Rol {
        -nombre: String
        -permisos: Set~Permiso~
        +tienePermiso(Permiso) boolean
    }
    class Permiso {
        -codigo: String
        -descripcion: String
    }
    Usuario "*" --> "*" Rol : tiene
    Rol "*" --> "*" Permiso : otorga`, "RBAC — Role Based Access Control")}
        <div class="callout tip">
          <p><b>Dónde se valida:</b> la autenticación en el borde (gateway + IDM), la autorización <b>gruesa</b> por rol
          también en el borde, y la autorización <b>fina</b> (“este médico sobre <i>este</i> paciente”) en la capa de
          aplicación, porque depende de datos del dominio. Nunca sólo en el frontend.</p>
        </div>

        <h2>Transacciones distribuidas: el patrón Saga</h2>
        <p>Cuando el caso de uso toca varios servicios, cada uno con su base, <b>no hay transacción ACID posible</b>.
        La alternativa es una <b>Saga</b>: una secuencia de pasos locales, cada uno con su <b>compensación</b>.</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Paso</th><th>Acción</th><th>Compensación si falla lo siguiente</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Reservar el turno</td><td>Liberar el turno</td></tr>
            <tr><td>2</td><td>Calcular y registrar el copago</td><td>Anular el copago</td></tr>
            <tr><td>3</td><td>Solicitar la validación clínica</td><td>Cancelar la solicitud</td></tr>
          </tbody>
        </table></div>
        <p>La saga puede ser <b>orquestada</b> (un componente dirige y dispara las compensaciones) o
        <b>coreografiada</b> (cada servicio reacciona y publica su compensación). Mencionar saga y consistencia eventual
        en el punto de arquitectura demuestra que entendés el costo real de los microservicios.</p>

        <h2>🎮 Ejercicio</h2>
        <div id="orqQuiz"></div>
      `;

      APP.quiz(el.querySelector("#orqQuiz"), [
        { n: 1, topic: "Enfoques", type: "mc", q: "El flujo de préstamo tiene validaciones estrictas y si algo falla hay que abortar todo. ¿Orquestación o coreografía?", options: [
          { t: "Orquestación: el flujo tiene reglas de negocio y necesita control y trazabilidad centralizados", ok: true },
          { t: "Coreografía: es más desacoplado", ok: false },
          { t: "Da lo mismo", ok: false },
        ], explain: "La coreografía brilla para <i>reacciones a hechos consumados</i>, no para flujos transaccionales con validaciones que pueden abortar la operación. Ahí necesitás ver y controlar todo el flujo." },
        { n: 2, topic: "Capas", type: "mc", q: "¿Dónde va la regla “sólo puede prestar quien tiene el ejemplar en su poder”?", options: [
          { t: "En el dominio: <code>Ejemplar.prestar()</code> y su estado", ok: true },
          { t: "En el service, con un <code>if</code> antes de llamar al repositorio", ok: false },
          { t: "En el controller, para fallar rápido", ok: false },
          { t: "En un trigger de la base", ok: false },
        ], explain: "Si la regla vive en el service, el objeto <code>Ejemplar</code> queda anémico y cualquier otro camino (una importación, un consumidor de cola) puede saltearse la validación. El objeto tiene que ser el guardián de su propia consistencia." },
        { n: 3, topic: "Repositorios", type: "mc", q: "¿Dónde se define la interfaz <code>EjemplarRepository</code>?", options: [
          { t: "En el dominio, escrita en su vocabulario; la implementación va en infraestructura", ok: true },
          { t: "En la capa de infraestructura, junto a la implementación", ok: false },
          { t: "No hace falta interfaz: el service usa JPA directo", ok: false },
        ], explain: "Es el corazón de DIP: la abstracción <b>pertenece</b> al módulo de alto nivel. Si la define infraestructura, el dominio vuelve a depender de ella y perdés la inversión." },
        { n: 4, topic: "Saga", type: "mc", q: "El caso de uso toca 3 microservicios con bases separadas y el paso 3 falla. ¿Qué hacés?", options: [
          { t: "Saga: ejecutar las compensaciones de los pasos 1 y 2 para volver a un estado consistente", ok: true },
          { t: "Un rollback de la transacción distribuida", ok: false },
          { t: "Nada: la consistencia eventual lo resuelve sola", ok: false },
        ], explain: "No hay transacción ACID entre bases distintas (el two-phase commit existe pero es frágil y casi nadie lo usa). La consistencia eventual no “arregla” un fallo: hay que compensar explícitamente." },
        { n: 5, topic: "Permisos", type: "multi", q: "“Un médico sólo puede ver la historia clínica del paciente que tiene asignado.” ¿Dónde y cómo validás?", options: [
          { t: "En la capa de aplicación, porque la regla depende de datos del dominio (la asignación)", ok: true },
          { t: "El rol “médico” se valida en el gateway (autorización gruesa)", ok: true },
          { t: "Sólo en el frontend, ocultando el botón", ok: false },
          { t: "En un trigger de la base de datos", ok: false },
        ], explain: "Gruesa en el borde, fina en la aplicación. El frontend puede ocultar el botón por usabilidad, pero nunca es un control de seguridad: cualquiera puede llamar al endpoint directamente." },
      ]);
    },
  });
})();
