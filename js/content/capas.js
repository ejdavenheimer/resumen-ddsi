/* ============================================================
   Fundamentos — Capas, Repositorios, Usuarios/Roles/Permisos
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "capas",
    title: "Capas y Repositorios",
    tag: "📚",
    group: "Fundamentos",
    resumen: "Arquitectura en capas, Repository, RBAC",
    keywords: ["capas", "repository", "repositorio", "controller", "service", "roles", "permisos", "rbac", "usuarios", "arquitectura en capas"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Fundamentos</div>
          <h1>Capas, Repositorios y Roles</h1>
          <p class="lead">Cómo se organiza un sistema de gestión por dentro: capas, acceso a datos y control de acceso.</p>
        </div>

        <h2>Arquitectura en capas</h2>
        <p>Cada capa tiene una responsabilidad y <b>conoce sólo a la de abajo</b>.</p>
        ${APP.uml(`graph TB
    A["🖥️ Presentación (Controller)<br/>recibe requests, valida formato, devuelve responses"]
    B["⚙️ Aplicación (Service)<br/>orquesta el caso de uso"]
    C["🧠 Dominio (Modelo)<br/>reglas de negocio, entidades"]
    D["🗄️ Infraestructura (Repository)<br/>persistencia, integraciones externas"]
    A --> B --> C
    B --> D
    D -.->|implementa interfaz definida por| C
    style A fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style B fill:#ffe4e9,stroke:#a4133c,color:#0f172a
    style C fill:#ecfdf5,stroke:#059669,color:#0f172a
    style D fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Las 4 capas")}
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Capa</th><th>Responsabilidad</th></tr></thead>
          <tbody>
            <tr><td>Presentación (Controller)</td><td>Traducir HTTP ↔ objetos, validar el formato del request, serializar la respuesta</td></tr>
            <tr><td>Aplicación (Service)</td><td>Orquestar el caso de uso: llamar al dominio y al repositorio en el orden correcto</td></tr>
            <tr><td>Dominio (Modelo)</td><td>Las reglas de negocio y las entidades. El corazón del sistema.</td></tr>
            <tr><td>Infraestructura (Repository)</td><td>Persistencia e integraciones externas</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Dos reglas que se cobran en el parcial</div>
          <p><b>1) Regla de dependencia:</b> las capas de arriba conocen a las de abajo, <b>nunca al revés</b>. El dominio
          no conoce al controller ni al repositorio: depende de una <b>interfaz</b> que el repo implementa (DIP).</p>
          <p><b>2) Verticalidad:</b> controller → service → repository. El controller <b>no</b> llama directo al repositorio
          salteándose el service.</p>
        </div>

        <h2>Patrón Repository</h2>
        <p>Abstrae el acceso a datos. El dominio pide “dame el pedido 123” <b>sin saber</b> si viene de MySQL, Mongo, un
        archivo o memoria.</p>
        ${APP.code(`// La interfaz la define el DOMINIO, en su vocabulario
interface PedidoRepository {
    Optional<Pedido> buscarPorId(Long id);
    List<Pedido> buscarTodos();
    void guardar(Pedido pedido);
    void eliminar(Pedido pedido);
}

// La implementación vive en INFRAESTRUCTURA
class PedidoRepositoryJPA      implements PedidoRepository { /* MySQL */ }
class PedidoRepositoryEnMemoria implements PedidoRepository { /* para tests */ }`, { label: "Patrón Repository" })}
        <div class="callout tip">
          <p><b>Ventaja concreta:</b> podés inyectar la implementación in-memory en los tests y la de MySQL en producción,
          sin tocar el dominio. Es <a class="inline" data-go="inyeccion-dependencias">inyección de dependencias</a> + DIP
          en acción.</p>
        </div>

        <h2>Usuarios, Roles y Permisos</h2>
        <p>El modelo típico de control de acceso en sistemas de gestión (RBAC — <i>Role-Based Access Control</i>):</p>
        ${APP.uml(`classDiagram
    class Usuario {
        -email: String
        -passwordHash: String
        +tienePermiso(Permiso) boolean
    }
    class Rol {
        -nombre: String
        +tienePermiso(Permiso) boolean
    }
    class Permiso {
        -codigo: String
        -descripcion: String
    }
    Usuario "*" --> "*" Rol : tiene
    Rol "*" --> "*" Permiso : otorga`, "Usuarios · Roles · Permisos")}
        <div class="callout key">
          <div class="callout-title">🔑 Por qué el Rol va en el medio</div>
          <p>Si asignaras permisos <b>directo</b> a cada usuario, tendrías que actualizar a mano a cada uno cada vez que
          cambia una política. Con roles, cambiás <b>el rol</b> y todos los usuarios de ese rol se actualizan solos.
          Es bajo acoplamiento aplicado a la administración de permisos.</p>
          <p>Cuándo NO alcanza RBAC y necesitás <a class="inline" data-go="seguridad">ABAC</a>: cuando el permiso depende
          del <b>contexto</b> (“el médico sólo ve <i>su</i> paciente, en <i>su</i> horario”). Ver Seguridad.</p>
        </div>

        <h2>Ejercicio</h2>
        <div id="capQuiz"></div>
      `;

      APP.quiz(el.querySelector("#capQuiz"), [
        { n: 1, topic: "Capas", type: "mc", q: "¿Puede el controller llamar directo al repositorio, salteándose el service?", options: [
          { t: "No: rompe la verticalidad (controller → service → repository)", ok: true },
          { t: "Sí, si es una consulta simple", ok: false },
          { t: "Sí, siempre", ok: false },
        ], explain: "El flujo pasa por el service, que orquesta el caso de uso. Saltearlo dispersa la lógica y acopla el controller a la persistencia." },
        { n: 2, topic: "Repository", type: "mc", q: "¿Dónde se define la interfaz <code>PedidoRepository</code>?", options: [
          { t: "En el dominio; la implementación va en infraestructura", ok: true },
          { t: "En infraestructura, junto a la implementación", ok: false },
          { t: "En el controller", ok: false },
        ], explain: "La abstracción pertenece al módulo de alto nivel (DIP). Si la define infraestructura, el dominio vuelve a depender de ella." },
        { n: 3, topic: "Roles", type: "mc", q: "¿Por qué se ponen roles entre usuarios y permisos?", options: [
          { t: "Para no tener que actualizar a mano a cada usuario cuando cambia una política", ok: true },
          { t: "Por seguridad del password", ok: false },
          { t: "Es obligatorio en Java", ok: false },
        ], explain: "Cambiás el rol y todos los usuarios de ese rol se actualizan. Bajo acoplamiento en la administración." },
      ]);
    },
  });
})();
