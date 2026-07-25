/* ============================================================
   Integración — Publicación-Suscripción
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "pubsub",
    title: "Publicación-Suscripción",
    tag: "🔗",
    group: "Integración y comunicación",
    resumen: "Eventos entre sistemas distribuidos",
    keywords: ["publicacion suscripcion", "pub sub", "publish subscribe", "evento", "publisher", "subscriber", "topic", "kafka", "observer distribuido"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Integración y comunicación</div>
          <h1>Publicación-Suscripción</h1>
          <p class="lead">Desacoplar productores de eventos de sus consumidores: el que publica no sabe quién recibe.</p>
        </div>

        <div class="analogia">
          <div class="emo">📰</div>
          <div class="txt">
            <strong class="lbl">La analogía</strong>
            <p>Un diario. Publica noticias <b>sin saber quiénes son sus lectores</b>. Los lectores se suscriben a las
            secciones que les interesan (deportes, política, espectáculos). El diario no le manda la noticia a cada uno
            personalmente: la <b>publica</b>, y quien esté suscripto la recibe.</p>
          </div>
        </div>

        <h2>Intención</h2>
        <p>Desacoplar <b>publicadores</b> de <b>suscriptores</b>. Los publicadores emiten eventos sin saber quién los va a
        recibir; los suscriptores se anotan a los tipos de evento que les interesan. En el medio hay un
        <a class="inline" data-go="broker">broker</a> que recibe y distribuye.</p>

        <h2>Conceptos</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Concepto</th><th>Qué es</th></tr></thead>
          <tbody>
            <tr><td><b>Evento</b></td><td>Algo que <b>pasó</b> y que puede interesarle a alguien. Se nombra en <b>pasado</b>: <code>PedidoCreado</code>, <code>PagoAprobado</code>, <code>UsuarioRegistrado</code>.</td></tr>
            <tr><td><b>Publicador</b> (publisher)</td><td>El que emite el evento.</td></tr>
            <tr><td><b>Suscriptor</b> (subscriber)</td><td>El que recibe y reacciona.</td></tr>
            <tr><td><b>Topic / Canal</b></td><td>La “categoría” de evento a la que uno se suscribe.</td></tr>
            <tr><td><b>Broker</b></td><td>La infraestructura que recibe, guarda y distribuye los eventos (RabbitMQ, Kafka).</td></tr>
          </tbody>
        </table></div>

        ${APP.uml(`graph LR
    P1["Servicio Pedidos"] -->|publica PedidoCreado| B[("Broker / Topic")]
    B -->|entrega| S1["Servicio Facturación"]
    B -->|entrega| S2["Servicio Notificaciones"]
    B -->|entrega| S3["Servicio Stock"]
    style B fill:#fffbeb,stroke:#b45309,color:#0f172a`, "Un evento, varios suscriptores")}

        <h2>La diferencia clave con Observer (esto se pregunta)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Aspecto</th><th>Observer</th><th>Publicación-Suscripción</th></tr></thead>
          <tbody>
            <tr><td>Alcance</td><td>Dentro del mismo proceso/aplicación</td><td>Entre sistemas distribuidos</td></tr>
            <tr><td>Acoplamiento</td><td>El subject tiene la lista de observers (los conoce)</td><td>El publicador <b>no conoce</b> a los suscriptores</td></tr>
            <tr><td>Intermediario</td><td>No hay</td><td>Sí, un broker/canal en el medio</td></tr>
            <tr><td>Sincronía</td><td>Generalmente sincrónico</td><td>Generalmente asincrónico</td></tr>
            <tr><td>Persistencia</td><td>Si se cae el proceso, se pierde</td><td>El broker persiste el mensaje y reintenta</td></tr>
            <tr><td>Ejemplo</td><td>Un botón que notifica a sus listeners</td><td>Un microservicio que publica <code>PedidoCreado</code> en Kafka</td></tr>
          </tbody>
        </table></div>
        <div class="callout key">
          <div class="callout-title">🔑 Cómo elegir en el parcial</div>
          <p>Misma <b>intención</b> (avisar a N interesados de un cambio), distinta <b>escala</b>. Si los interesados están
          <b>en la misma app</b> → <a class="inline" data-go="observer">Observer</a>. Si están en
          <b>servicios desplegados aparte</b> → Publicación-Suscripción sobre un broker. La frase disparadora del enunciado
          es “los servicios están desplegados por separado” o “varios servicios deben enterarse”.</p>
        </div>

        <h2>Palabras clave</h2>
        <ul>
          <li>“cuando ocurre X, varios servicios deben enterarse”</li>
          <li>“eventos”</li>
          <li>“desacoplar productores de consumidores”</li>
          <li>“notificar a múltiples sistemas”</li>
          <li>“el servicio no debe conocer a quienes consumen”</li>
        </ul>

        <h2>Cómo justificarlo (escrito)</h2>
        <blockquote class="just-modelo">“Usé <b>Publicación-Suscripción</b> porque el evento <b>[PedidoCreado]</b> debe ser
        consumido por múltiples servicios (<b>[Facturación, Notificaciones, Stock]</b>) y el servicio que lo produce
        <b>no debe conocerlos ni depender de ellos</b>. Al publicar el evento en un topic del broker, se pueden sumar o
        quitar consumidores <b>sin modificar al publicador</b> (favorece la extensibilidad y el bajo acoplamiento).”</blockquote>

        <h2>Ejercicio</h2>
        <div id="psQuiz"></div>
      `;

      APP.quiz(el.querySelector("#psQuiz"), [
        { n: 1, topic: "Pub/Sub", type: "mc", q: "El Servicio de Lesiones publica <code>LesionActualizada</code> y tres servicios distintos, desplegados por separado, deben reaccionar. ¿Observer o Pub/Sub?", options: [
          { t: "Pub/Sub sobre un broker: los servicios no comparten memoria", ok: true },
          { t: "Observer: funciona igual entre servicios", ok: false },
          { t: "Tres llamadas HTTP desde Lesiones", ok: false },
        ], explain: "Observer se apoya en referencias en memoria: no cruza el proceso. Las 3 llamadas HTTP acoplan al productor con los consumidores." },
        { n: 2, topic: "Pub/Sub", type: "mc", q: "¿Cómo se nombra un evento?", options: [
          { t: "En pasado: <code>PagoAprobado</code> (algo que ya pasó)", ok: true },
          { t: "En imperativo: <code>AprobarPago</code>", ok: false },
          { t: "Con el nombre del consumidor", ok: false },
        ], explain: "El evento describe un hecho consumado. El imperativo (<code>AprobarPago</code>) sería un comando, no un evento." },
        { n: 3, topic: "Pub/Sub", type: "vf", q: "En Pub/Sub, el publicador conoce la lista de suscriptores.", options: [
          { t: "Falso", ok: true }, { t: "Verdadero", ok: false },
        ], explain: "Justamente NO los conoce: le habla al broker. Esa es la diferencia con Observer, donde el subject sí tiene la lista." },
      ]);
    },
  });
})();
