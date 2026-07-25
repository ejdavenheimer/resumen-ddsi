/* =====================================================================
   Casos de "Spot the SOLID smell" — 3 por letra.
   Cada caso: código con UNA violación dominante → elegir principio →
   elegir la refactorización correcta → explicación.
   ===================================================================== */
(function () {
  "use strict";
  const D = window.APP.DATA = window.APP.DATA || {};

  D.solid = [
    /* ============================== SRP ============================== */
    {
      id: 1, letra: "S", principio: "SRP",
      titulo: "El service que hace de todo",
      codigo: `class ReporteDeVentas {

    public void generar(LocalDate desde, LocalDate hasta) {
        // 1) traigo los datos
        Connection c = DriverManager.getConnection("jdbc:mysql://...");
        ResultSet rs = c.createStatement()
            .executeQuery("SELECT * FROM ventas WHERE fecha BETWEEN ...");

        // 2) armo el PDF
        PdfDocument pdf = new PdfDocument();
        while (rs.next()) pdf.addRow(rs.getString("cliente"), rs.getDouble("monto"));
        pdf.save("/tmp/reporte.pdf");

        // 3) lo mando por mail
        SmtpClient smtp = new SmtpClient("smtp.empresa.com", 587);
        smtp.send("gerencia@empresa.com", "Reporte", new File("/tmp/reporte.pdf"));
    }
}`,
      porque: "Esta clase tiene <b>tres razones para cambiar</b>: si cambia la base de datos, si cambia el formato del reporte, o si cambia el proveedor de mail. Cada una de esas áreas es de un equipo distinto y evoluciona por su cuenta.",
      refactors: [
        { t: "Separar en <code>VentaRepository</code> (datos), <code>ReportePdfBuilder</code> (formato) y <code>Notificador</code> (envío); <code>ReporteDeVentas</code> queda como coordinador que los usa.", ok: true, why: "Cada clase pasa a tener una sola razón para cambiar. El coordinador orquesta pero no conoce ni SQL, ni PDF, ni SMTP." },
        { t: "Partir el método <code>generar</code> en tres métodos privados dentro de la misma clase.", ok: false, why: "Mejora la legibilidad pero la clase sigue teniendo tres razones para cambiar. SRP habla de responsabilidades de la <i>clase</i>, no del largo del método." },
        { t: "Hacer que <code>ReporteDeVentas</code> herede de <code>ReporteBase</code> y sobrescriba <code>generar</code>.", ok: false, why: "La herencia no separa responsabilidades: simplemente mueve el problema a la clase padre." },
      ],
    },
    {
      id: 2, letra: "S", principio: "SRP",
      titulo: "La entidad que se persiste sola",
      codigo: `class Pedido {
    private List<Item> items;
    private EstadoPedido estado;

    public double total() {
        return items.stream().mapToDouble(Item::subtotal).sum();
    }

    // La entidad sabe cómo guardarse a sí misma
    public void guardar() {
        String sql = "INSERT INTO pedidos (total, estado) VALUES (?, ?)";
        try (PreparedStatement ps = Db.conn().prepareStatement(sql)) {
            ps.setDouble(1, total());
            ps.setString(2, estado.name());
            ps.executeUpdate();
        }
    }

    // ...y cómo mostrarse en pantalla
    public String toHtml() {
        return "<table>" + items.stream().map(Item::toHtml).collect(joining()) + "</table>";
    }
}`,
      porque: "<code>Pedido</code> mezcla <b>lógica de negocio</b> (calcular el total), <b>persistencia</b> (SQL) y <b>presentación</b> (HTML). Cambiar el motor de base de datos o el diseño de la vista te obliga a tocar una clase de dominio.",
      refactors: [
        { t: "Dejar en <code>Pedido</code> sólo el comportamiento de negocio y mover la persistencia a <code>PedidoRepository</code> y el render a una vista/serializador.", ok: true, why: "Es el esquema de capas clásico: dominio puro adentro, infraestructura afuera. El dominio no depende de la base ni de la vista." },
        { t: "Marcar <code>guardar()</code> y <code>toHtml()</code> como <code>protected</code>.", ok: false, why: "La visibilidad no cambia las responsabilidades: la clase sigue conociendo SQL y HTML." },
        { t: "Extraer una interfaz <code>Persistible</code> que <code>Pedido</code> implemente.", ok: false, why: "El SQL sigue viviendo dentro de la entidad. Una interfaz no mueve el código, sólo le pone nombre al problema." },
      ],
    },
    {
      id: 3, letra: "S", principio: "SRP",
      titulo: "El controller con lógica de negocio",
      codigo: `@RestController
class ReservaController {

    @PostMapping("/reservas")
    public ResponseEntity<?> crear(@RequestBody ReservaDTO dto) {
        // validación de negocio
        if (dto.getFecha().isBefore(LocalDate.now())) return badRequest().build();

        // cálculo de copago (regla de negocio)
        double copago = dto.getPlan().equals("PREMIUM") ? 0
                      : dto.getValorBase() * 0.30;
        if (Duration.between(now(), dto.getFecha()).toHours() < 2)
            copago += dto.getValorBase() * 0.20;

        // persistencia
        jdbc.update("INSERT INTO reservas ...", dto.getPaciente(), copago);

        return ok(copago);
    }
}`,
      porque: "El controller debería <b>traducir HTTP a llamadas del dominio</b> y nada más. Acá también calcula reglas de negocio y escribe en la base: si mañana la misma regla se necesita desde un job o desde una cola, hay que duplicarla.",
      refactors: [
        { t: "Mover el cálculo a un <code>MotorDeCopagos</code> del dominio y la escritura a un repositorio; el controller sólo valida el formato del request y delega.", ok: true, why: "El dominio queda reutilizable desde cualquier canal (HTTP, cron, consumidor de cola) y testeable sin levantar el servidor." },
        { t: "Mover el cálculo a un método estático <code>Utils.calcularCopago()</code>.", ok: false, why: "Sigue siendo lógica de negocio fuera del dominio, ahora en una clase de utilidades que tiende a convertirse en un cajón de sastre (y no es polimórfica: agregar reglas rompe OCP)." },
        { t: "Anotar el método con <code>@Transactional</code>.", ok: false, why: "Resuelve otra cosa (atomicidad). No toca la distribución de responsabilidades." },
      ],
    },

    /* ============================== OCP ============================== */
    {
      id: 4, letra: "O", principio: "OCP",
      titulo: "El switch que crece con cada tipo nuevo",
      codigo: `class CalculadoraDeEnvio {

    public double calcular(String tipo, Pedido p) {
        if (tipo.equals("ESTANDAR")) {
            return p.getPeso() * 100;
        } else if (tipo.equals("EXPRESS")) {
            return p.getPeso() * 200 + 500;
        } else if (tipo.equals("RETIRO_EN_SUCURSAL")) {
            return 0;
        } else if (tipo.equals("INTERNACIONAL")) {   // agregado el mes pasado
            return p.getPeso() * 900 + p.getValorDeclarado() * 0.05;
        }
        throw new IllegalArgumentException("tipo desconocido");
    }
}`,
      porque: "Cada tipo de envío nuevo <b>obliga a modificar</b> una clase que ya funcionaba y estaba testeada. Debería estar <i>cerrada a modificación</i> y <i>abierta a extensión</i>.",
      refactors: [
        { t: "Definir <code>interface EstrategiaDeEnvio { double calcular(Pedido p); }</code> con una implementación por tipo, e inyectar la que corresponda (Strategy).", ok: true, why: "Agregar un tipo nuevo = agregar una clase. Nunca más se toca el código existente. Es la aplicación canónica de OCP vía polimorfismo." },
        { t: "Reemplazar los <code>if</code> por un <code>switch</code> sobre un <code>enum TipoEnvio</code>.", ok: false, why: "Es más prolijo, pero seguís modificando la misma clase cada vez que aparece un tipo. El smell es el mismo." },
        { t: "Extraer cada rama a un método privado <code>calcularExpress()</code>, <code>calcularRetiro()</code>…", ok: false, why: "Mejora la legibilidad; no la extensibilidad. Sigue habiendo que editar la clase." },
      ],
    },
    {
      id: 5, letra: "O", principio: "OCP",
      titulo: "El reporte que conoce todos los formatos",
      codigo: `class Exportador {

    public byte[] exportar(Reporte r, String formato) {
        switch (formato) {
            case "PDF":  return new PdfWriter().write(r);
            case "XLSX": return new ExcelWriter().write(r);
            case "CSV":  return new CsvWriter().write(r);
            // el cliente ahora pide JSON... y la semana que viene XML
        }
        throw new UnsupportedOperationException(formato);
    }
}`,
      porque: "El requerimiento explícito es que van a aparecer formatos nuevos. Con este diseño, cada formato nuevo modifica <code>Exportador</code> y obliga a re-testear todo.",
      refactors: [
        { t: "Definir <code>interface FormatoDeExportacion { byte[] escribir(Reporte r); }</code> y registrar las implementaciones en un mapa/inyección; el exportador sólo delega.", ok: true, why: "Sumar JSON es agregar una clase y registrarla. <code>Exportador</code> queda cerrado a modificación." },
        { t: "Agregar un parámetro booleano <code>esJson</code> al método.", ok: false, why: "Los flags booleanos son un code smell aparte y no escalan: con 5 formatos tendrías 5 booleanos y combinaciones imposibles." },
        { t: "Hacer que <code>Exportador</code> sea abstracta y crear <code>ExportadorPdf</code>, <code>ExportadorExcel</code>… por herencia.", ok: false, why: "Va en la dirección correcta pero la resuelve con herencia donde alcanza composición; además el <code>switch</code> tendría que seguir existiendo en algún lado para elegir la subclase (eso es una factory, no la solución al smell)." },
      ],
    },
    {
      id: 6, letra: "O", principio: "OCP",
      titulo: "El instanceof que delata el problema",
      codigo: `class ProcesadorDeNotificaciones {

    public void enviar(Notificacion n) {
        if (n instanceof NotificacionEmail) {
            smtp.send(((NotificacionEmail) n).getDestinatario(), n.getCuerpo());
        } else if (n instanceof NotificacionSms) {
            twilio.sms(((NotificacionSms) n).getTelefono(), n.getCuerpo());
        } else if (n instanceof NotificacionPush) {
            firebase.push(((NotificacionPush) n).getDeviceId(), n.getCuerpo());
        }
    }
}`,
      porque: "Una cadena de <code>instanceof</code> con casts es el síntoma clásico de OCP violado: hay polimorfismo disponible y no se está usando. Cada canal nuevo edita esta clase.",
      refactors: [
        { t: "Declarar <code>enviar()</code> en la clase/interfaz <code>Notificacion</code> y que cada subtipo sepa enviarse (o delegue en su canal), eliminando el <code>instanceof</code>.", ok: true, why: "El polimorfismo reemplaza al condicional. Agregar un canal = agregar una clase que implementa la interfaz." },
        { t: "Reemplazar los <code>instanceof</code> por <code>n.getClass().getSimpleName()</code> y un <code>switch</code> sobre el string.", ok: false, why: "Peor: además de seguir violando OCP, ahora dependés del nombre de la clase (se rompe con cualquier renombre)." },
        { t: "Ordenar los <code>if</code> del caso más frecuente al menos frecuente.", ok: false, why: "Es una micro-optimización irrelevante que no toca el diseño." },
      ],
    },

    /* ============================== LSP ============================== */
    {
      id: 7, letra: "L", principio: "LSP",
      titulo: "El cuadrado que hereda del rectángulo",
      codigo: `class Rectangulo {
    protected int ancho, alto;
    public void setAncho(int a) { this.ancho = a; }
    public void setAlto(int a)  { this.alto = a; }
    public int area() { return ancho * alto; }
}

class Cuadrado extends Rectangulo {
    @Override public void setAncho(int a) { this.ancho = a; this.alto = a; }
    @Override public void setAlto(int a)  { this.ancho = a; this.alto = a; }
}

// Código cliente que funcionaba con Rectangulo:
void test(Rectangulo r) {
    r.setAncho(5);
    r.setAlto(4);
    assert r.area() == 20;   // ✅ con Rectangulo · ❌ con Cuadrado (da 16)
}`,
      porque: "El cliente que funcionaba con <code>Rectangulo</code> <b>se rompe</b> al recibir un <code>Cuadrado</code>: la subclase cambió el contrato (setear el ancho ya no deja el alto intacto). Eso es exactamente violar la sustitución de Liskov.",
      refactors: [
        { t: "No usar herencia: modelar <code>Forma</code> con <code>area()</code> y que <code>Rectangulo</code> y <code>Cuadrado</code> sean implementaciones independientes e inmutables.", ok: true, why: "Que en matemática “un cuadrado sea un rectángulo” no implica que en objetos la herencia sea válida: lo que importa es que el <b>comportamiento</b> sea sustituible." },
        { t: "En <code>Cuadrado</code>, lanzar <code>UnsupportedOperationException</code> desde <code>setAlto()</code>.", ok: false, why: "Empeora: ahora el cliente directamente explota. Tirar excepciones en métodos heredados es otra forma (más ruidosa) de violar LSP." },
        { t: "Agregar en <code>Rectangulo</code> un método <code>esCuadrado()</code> para que el cliente pregunte antes.", ok: false, why: "Obliga a todos los clientes a conocer los subtipos: se pierde el polimorfismo y aparece un <code>if</code> por cada uso." },
      ],
    },
    {
      id: 8, letra: "L", principio: "LSP",
      titulo: "La subclase que endurece la precondición",
      codigo: `class CuentaBancaria {
    protected double saldo;
    /** Contrato: acepta cualquier monto > 0 */
    public void extraer(double monto) {
        if (monto > saldo) throw new SaldoInsuficiente();
        saldo -= monto;
    }
}

class CajaDeAhorro extends CuentaBancaria {
    @Override public void extraer(double monto) {
        // agrega una restricción que la clase base no tenía
        if (monto > 10_000) throw new IllegalArgumentException("máximo 10.000 por extracción");
        if (monto > saldo)  throw new SaldoInsuficiente();
        saldo -= monto;
    }
}`,
      porque: "La subclase <b>exige más</b> que la base (precondición más fuerte). Un método que recibe <code>CuentaBancaria</code> y extrae 15.000 funciona con la base y falla con la subclase: no son sustituibles.",
      refactors: [
        { t: "Subir el límite al contrato de la base como parte del modelo (<code>limitePorExtraccion</code>, con valor infinito por defecto), de modo que el comportamiento esté declarado en la abstracción.", ok: true, why: "Si el límite es parte del dominio, tiene que estar en el contrato que los clientes conocen; así ninguna subclase sorprende." },
        { t: "Documentar en el Javadoc de <code>CajaDeAhorro</code> que tiene un límite.", ok: false, why: "LSP es una restricción de comportamiento, no de documentación. El código cliente sigue rompiéndose en runtime." },
        { t: "Hacer que <code>extraer</code> sea <code>final</code> en la clase base y que la caja de ahorro valide el límite antes de llamarla.", ok: false, why: "Va mejor encaminado, pero mueve la validación fuera del objeto: cualquiera que llame directo a <code>extraer</code> se saltea el límite." },
      ],
    },
    {
      id: 9, letra: "L", principio: "LSP",
      titulo: "El pingüino que no vuela",
      codigo: `abstract class Ave {
    public abstract void volar();
}

class Golondrina extends Ave {
    @Override public void volar() { /* vuela */ }
}

class Pinguino extends Ave {
    @Override public void volar() {
        throw new UnsupportedOperationException("los pingüinos no vuelan");
    }
}

void migrar(List<Ave> bandada) {
    bandada.forEach(Ave::volar);   // 💥 revienta si hay un pingüino
}`,
      porque: "<code>Pinguino</code> hereda un contrato que no puede cumplir. El cliente que trabaja con <code>Ave</code> no puede confiar en que <code>volar()</code> funcione: se rompió la sustitución.",
      refactors: [
        { t: "Sacar <code>volar()</code> de <code>Ave</code> y ponerlo en una interfaz <code>Volador</code> que implementen sólo las aves que vuelan; <code>migrar()</code> recibe <code>List&lt;Volador&gt;</code>.", ok: true, why: "La jerarquía pasa a reflejar capacidades reales. De paso se respeta ISP: nadie implementa métodos que no puede cumplir." },
        { t: "Que <code>Pinguino.volar()</code> no haga nada (método vacío) en vez de lanzar excepción.", ok: false, why: "Falla silenciosamente, que es peor: el sistema sigue creyendo que la bandada migró." },
        { t: "Agregar <code>boolean puedeVolar()</code> y chequearlo antes de llamar a <code>volar()</code>.", ok: false, why: "Reintroduce condicionales por tipo en todos los clientes y anula el beneficio del polimorfismo." },
      ],
    },

    /* ============================== ISP ============================== */
    {
      id: 10, letra: "I", principio: "ISP",
      titulo: "La interfaz gorda",
      codigo: `interface Empleado {
    void trabajar();
    void cobrarSueldo();
    void aprobarVacaciones(Solicitud s);
    void firmarBalance();
    void asignarPresupuesto(Area a, double monto);
}

class Cadete implements Empleado {
    public void trabajar()      { /* ok */ }
    public void cobrarSueldo()  { /* ok */ }
    public void aprobarVacaciones(Solicitud s) { throw new UnsupportedOperationException(); }
    public void firmarBalance()                { throw new UnsupportedOperationException(); }
    public void asignarPresupuesto(Area a, double m) { throw new UnsupportedOperationException(); }
}`,
      porque: "El síntoma es inequívoco: una clase implementa la interfaz y la mayoría de sus métodos <b>tiran <code>UnsupportedOperationException</code></b>. La interfaz obliga a depender de métodos que no se usan.",
      refactors: [
        { t: "Partirla en interfaces chicas y cohesivas: <code>Trabajador</code>, <code>Asalariado</code>, <code>ApruebaLicencias</code>, <code>Directivo</code>; cada clase implementa sólo las que le corresponden.", ok: true, why: "Muchas interfaces específicas mejor que una gigante: cada cliente depende sólo de lo que necesita." },
        { t: "Crear una clase abstracta <code>EmpleadoBase</code> con implementaciones vacías de todos los métodos, y que las clases hereden de ella.", ok: false, why: "Es el “adapter de interfaz” clásico: esconde el problema, no lo resuelve. El cadete sigue exponiendo <code>firmarBalance()</code>, y ahora en silencio (rompe LSP)." },
        { t: "Marcar los métodos de más como <code>default</code> en la interfaz, con cuerpo vacío.", ok: false, why: "Mismo problema que arriba con azúcar sintáctica de Java 8: la interfaz sigue siendo gorda y mentirosa." },
      ],
    },
    {
      id: 11, letra: "I", principio: "ISP",
      titulo: "El repositorio que no todos necesitan",
      codigo: `interface Repositorio<T> {
    T buscarPorId(Long id);
    List<T> buscarTodos();
    void guardar(T t);
    void eliminar(Long id);
    void eliminarTodos();
    List<T> buscarPaginado(int pagina, int tam);
    void ejecutarSqlNativo(String sql);
}

class BitacoraRepository implements Repositorio<Entrada> {
    // La bitácora es append-only: NUNCA se borra ni se modifica
    public void eliminar(Long id)      { throw new UnsupportedOperationException(); }
    public void eliminarTodos()        { throw new UnsupportedOperationException(); }
    public void ejecutarSqlNativo(String sql) { throw new UnsupportedOperationException(); }
    // ...
}`,
      porque: "La bitácora es <b>append-only</b> por regla de negocio, pero la interfaz la obliga a exponer operaciones de borrado. Cualquier cliente que reciba un <code>Repositorio</code> cree que puede borrar entradas de auditoría.",
      refactors: [
        { t: "Segregar en <code>RepositorioDeLectura&lt;T&gt;</code>, <code>RepositorioDeEscritura&lt;T&gt;</code> y <code>RepositorioBorrable&lt;T&gt;</code>; la bitácora implementa sólo las dos primeras.", ok: true, why: "El tipo pasa a expresar la regla de negocio: es imposible <i>compilar</i> un borrado de bitácora." },
        { t: "Dejar la interfaz como está y validar en runtime con un flag <code>esBorrable()</code>.", ok: false, why: "La restricción vuelve a ser un chequeo en tiempo de ejecución que hay que recordar hacer en cada llamada." },
        { t: "Documentar en el README que la bitácora no se borra.", ok: false, why: "No es una solución de diseño." },
      ],
    },
    {
      id: 12, letra: "I", principio: "ISP",
      titulo: "El listener que obliga a implementar todo",
      codigo: `interface EventosDeReserva {
    void alCrear(Reserva r);
    void alValidar(Reserva r);
    void alCalcularCopago(Reserva r);
    void alCancelar(Reserva r);
    void alMarcarAusente(Reserva r);
}

// A contabilidad sólo le importa el copago
class ListenerContable implements EventosDeReserva {
    public void alCrear(Reserva r) {}
    public void alValidar(Reserva r) {}
    public void alCalcularCopago(Reserva r) { libroDiario.registrar(r.getCopago()); }
    public void alCancelar(Reserva r) {}
    public void alMarcarAusente(Reserva r) {}
}`,
      porque: "Cuatro de los cinco métodos son ruido. Además, cuando se agregue un evento nuevo a la interfaz, <b>todos</b> los listeners existentes dejan de compilar aunque no les interese.",
      refactors: [
        { t: "Una interfaz por evento (o un único <code>Observer</code> con un objeto <code>Evento</code> tipado) y suscripción selectiva por tipo de evento.", ok: true, why: "Cada listener declara exactamente a qué se suscribe. Agregar un evento no impacta a nadie que no lo escuche." },
        { t: "Convertir todos los métodos en <code>default</code> vacíos.", ok: false, why: "Es el atajo habitual y saca el ruido de compilación, pero el listener sigue dependiendo de una interfaz que le sobra en un 80%." },
        { t: "Hacer que <code>ListenerContable</code> extienda una clase <code>AdaptadorDeEventos</code>.", ok: false, why: "Mismo caso: gasta la única bala de herencia de Java para tapar un problema de interfaz." },
      ],
    },

    /* ============================== DIP ============================== */
    {
      id: 13, letra: "D", principio: "DIP",
      titulo: "El service que instancia su infraestructura",
      codigo: `class ContratacionService {

    // depende de clases CONCRETAS de infraestructura, y encima las crea él
    private MySqlContratacionRepository repo = new MySqlContratacionRepository();
    private TwilioSmsSender sms = new TwilioSmsSender("AC123", "token");

    public void contratar(DatosContratacion datos) {
        Contratacion c = new Contratacion(datos);
        repo.insertar(c);
        sms.enviar(datos.getTelefono(), "Contratación " + c.getCodigo() + " confirmada");
    }
}`,
      porque: "Un módulo de alto nivel (la lógica de contratación) depende de detalles de bajo nivel (MySQL, Twilio) <b>y además los instancia</b>. No se puede testear sin base ni sin mandar SMS reales, y cambiar de proveedor obliga a tocar el dominio.",
      refactors: [
        { t: "Que el service dependa de las interfaces <code>ContratacionRepository</code> y <code>Notificador</code>, y que las implementaciones concretas se inyecten por constructor.", ok: true, why: "Ambos (alto y bajo nivel) pasan a depender de abstracciones. En test inyectás dobles; en producción, MySQL y Twilio. Es DIP + inyección de dependencias." },
        { t: "Mover el <code>new</code> a un método <code>init()</code> que se llama desde el constructor.", ok: false, why: "El acoplamiento a la clase concreta sigue intacto: sólo cambió el renglón donde ocurre." },
        { t: "Usar un singleton <code>MySqlContratacionRepository.getInstance()</code> en lugar de <code>new</code>.", ok: false, why: "Peor para testear: la dependencia concreta queda escondida y global. El service sigue sin poder existir sin MySQL." },
      ],
    },
    {
      id: 14, letra: "D", principio: "DIP",
      titulo: "La abstracción que filtra el detalle",
      codigo: `// La interfaz "abstracta" del dominio...
interface RepositorioDePedidos {
    ResultSet ejecutarQuery(String sql);        // 😬 JDBC en la interfaz
    void abrirTransaccionJdbc(Connection conn); // 😬 Connection en la interfaz
}

class PedidoService {
    private RepositorioDePedidos repo;

    public List<Pedido> pendientes() {
        ResultSet rs = repo.ejecutarQuery("SELECT * FROM pedidos WHERE estado='PENDIENTE'");
        // el service parsea el ResultSet a mano...
    }
}`,
      porque: "Hay una interfaz, sí, pero <b>habla el lenguaje de la infraestructura</b>: <code>ResultSet</code>, <code>Connection</code>, SQL crudo. El dominio sigue acoplado a JDBC. Poner una interfaz no alcanza si la abstracción filtra los detalles que quería ocultar.",
      refactors: [
        { t: "Redefinir la interfaz en términos del dominio: <code>List&lt;Pedido&gt; pendientes()</code>, <code>void guardar(Pedido p)</code>; el SQL vive sólo dentro de la implementación.", ok: true, why: "La abstracción pertenece al módulo de alto nivel y se expresa en su vocabulario. La implementación puede ser JDBC, JPA o un archivo, y el dominio ni se entera." },
        { t: "Renombrar la interfaz a <code>IPedidoDAO</code> y dejar los métodos igual.", ok: false, why: "El nombre no cambia el contrato. Sigue devolviendo <code>ResultSet</code>." },
        { t: "Agregar una segunda interfaz que envuelva a la primera.", ok: false, why: "Sumás una capa de indirección sin sacar JDBC del contrato: el detalle se sigue filtrando hacia arriba." },
      ],
    },
    {
      id: 15, letra: "D", principio: "DIP",
      titulo: "El dominio que importa el SDK",
      codigo: `import com.stripe.model.Charge;      // SDK de terceros dentro del dominio
import com.stripe.Stripe;

class Contratacion {
    private double prima;

    public void cobrar(String tarjeta) {
        Stripe.apiKey = "sk_live_...";
        Charge.create(Map.of(
            "amount",   (int)(prima * 100),
            "currency", "ars",
            "source",   tarjeta
        ));
    }
}`,
      porque: "Una <b>entidad del dominio</b> importa el SDK de un proveedor de pagos. El corazón del sistema queda atado a Stripe: no se puede testear sin red, no se puede cambiar de proveedor y la entidad conoce detalles (centavos, API key) que no son de su incumbencia.",
      refactors: [
        { t: "Definir en el dominio <code>interface PasarelaDePagos { Comprobante cobrar(Monto m, MedioDePago mp); }</code>, implementarla en infraestructura con <code>StripeAdapter</code> e inyectarla desde el caso de uso.", ok: true, why: "DIP + Adapter juntos: el dominio define el contrato en su propio lenguaje y la infraestructura lo cumple. Cambiar a Mercado Pago es escribir otro adapter." },
        { t: "Envolver la llamada a Stripe en un <code>try/catch</code> y loguear el error.", ok: false, why: "Manejar el error no reduce el acoplamiento." },
        { t: "Mover la API key a un archivo de configuración.", ok: false, why: "Es buena práctica de seguridad, pero el <code>import com.stripe</code> sigue en el dominio." },
      ],
    },
  ];
})();
