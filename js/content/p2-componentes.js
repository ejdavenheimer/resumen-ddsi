/* ============================================================
   P2 · Componentes de una arquitectura distribuida
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "p2-componentes",
    title: "Componentes de una Arq. Distribuida",
    tag: "🧰",
    group: "Arquitecturas Distribuidas (P2)",
    resumen: "DNS, proxies, LB, caché, CDN, gateway, IAM/SSO, WAF, broker, secretos",
    keywords: ["dns", "ttl", "failover", "geo routing", "proxy directo", "proxy reverso", "forward proxy", "reverse proxy", "nginx", "iam", "sso", "idm", "mfa", "waf", "owasp", "secretos", "vault", "mapa de referencia", "atributos de calidad"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Arquitecturas Distribuidas · 2º Parcial</div>
          <h1>Componentes de una Arquitectura Distribuida</h1>
          <p class="lead">El “mapa de referencia” completo. Cuando el enunciado pide un <b>diagrama de despliegue o de componentes</b>, esta es la lista de piezas de la que elegís — <b>cada una con su justificación</b>.</p>
        </div>

        <h2>Mapa de referencia</h2>
        ${APP.uml(`graph LR
    U["👤 Usuario"] --> DNS["DNS"]
    U --> CDN["CDN"]
    U --> WAF["WAF"]
    WAF --> LB["⚖️ Load Balancer"]
    LB --> GW["API Gateway / BFF"]
    GW --> I1["Instancia 1"]
    GW --> I2["Instancia 2"]
    GW --> I3["Instancia 3"]
    I1 --> CA[("Caché<br/>Redis")]
    I1 --> DBP[("BD primaria")]
    DBP -.->|replica| DBR[("BD réplica")]
    I2 --> BK[("Broker / Colas")]
    BK --> W["Workers"]
    style WAF fill:#fee2e2,stroke:#b91c1c,color:#0f172a
    style LB fill:#fffbeb,stroke:#b45309,color:#0f172a
    style GW fill:#e0f2fe,stroke:#0284c7,color:#0f172a`, "Camino de una solicitud")}
        <p class="mini">Y <b>transversales a toda la arquitectura</b>: <b>Identidad</b> (IAM / SSO),
        <b>Observabilidad</b> (logs · métricas · trazas) y <b>Gestión de Secretos</b>.</p>

        <h2>DNS: el primer componente de toda solicitud</h2>
        <ul>
          <li><b>Traduce nombres de dominio en direcciones IP.</b> Las respuestas se <b>cachean según su TTL</b>.</li>
          <li>Flujo: Navegador → <b>Resolver</b> (ISP / 8.8.8.8) → Servidor <b>Raíz</b> → <b>TLD</b> (.ar) → <b>Autoritativo</b> → IP + TTL.</li>
        </ul>
        <p><b>Usos arquitectónicos:</b></p>
        <ul>
          <li><b>Failover:</b> si una región cae, responder con la IP de otra.</li>
          <li><b>Geo-routing:</b> dirigir a cada usuario a la <b>región más cercana</b>.</li>
          <li><b>Ponderado:</b> enviar un <b>% del tráfico</b> a una nueva versión.</li>
        </ul>
        <div class="callout warn">
          <p><b>El trade-off del TTL:</b> un TTL alto <b>mejora la performance</b> pero <b>demora la conmutación ante una
          falla</b>. Ej.: Route 53, Azure DNS, Cloud DNS, Cloudflare.</p>
        </div>

        <h2>Proxy Directo vs. Proxy Reverso ⭐</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Proxy Directo (Forward Proxy)</h3>
            <ul>
              <li>Actúa <b>en nombre de los CLIENTES</b>: el servidor de destino <b>ve al proxy, no al cliente</b>.</li>
              <li><b>Control y filtrado de navegación</b>, auditoría y caché de salida.</li>
              <li>Típico de <b>redes corporativas y universitarias</b>.</li>
              <li>Ej.: Squid, proxies corporativos.</li>
            </ul>
          </div>
          <div class="card">
            <h3>Proxy Reverso (Reverse Proxy)</h3>
            <ul>
              <li>Actúa <b>en nombre de los SERVIDORES</b>: el cliente <b>no sabe qué servidor lo atiende</b>.</li>
              <li><b>Terminación TLS</b>, caché, compresión y <b>ocultamiento de la topología interna</b>.</li>
              <li><b>Es la base sobre la que se construyen el Load Balancer, el API Gateway y el WAF.</b></li>
              <li>Ej.: NGINX, HAProxy, Envoy, Traefik.</li>
            </ul>
          </div>
        </div>

        <h2>Message Broker y Colas</h2>
        <div class="grid-2">
          <div class="card">
            <h3>Cola (punto a punto)</h3>
            <p>Cada mensaje lo procesa <b>UN</b> consumidor.</p>
            <ul>
              <li><b>Desacople temporal:</b> el productor no espera al consumidor; si está caído, los mensajes <b>esperan en la cola</b>.</li>
              <li><b>Absorbe picos:</b> la cola actúa como <b>amortiguador</b>; se escalan consumidores según su largo.</li>
              <li><b>Reintentos</b> y <b>DLQ</b> (Dead Letter Queue).</li>
            </ul>
            <p class="mini">Ej.: al confirmar una compra, la respuesta al usuario es inmediata; <b>la factura y el mail se
            generan después</b>.</p>
          </div>
          <div class="card">
            <h3>Publicación / Suscripción (topic)</h3>
            <p>Cada suscriptor recibe una <b>COPIA</b> del evento.</p>
            <p>Ej.: <code>PedidoConfirmado</code> → Facturación, Envíos y Notificaciones reaccionan de forma
            independiente.</p>
            <p class="mini">RabbitMQ, Apache Kafka, Amazon SQS/SNS, Azure Service Bus, Google Pub/Sub. Detalle completo en
            <a class="inline" data-go="p2-integracion">integración</a>.</p>
          </div>
        </div>

        <h2>Identidad: IAM / IDM / SSO</h2>
        <div class="callout key">
          <ul>
            <li><b>IDM / IAM</b> (Identity Management / Identity and Access Management): el componente que <b>administra
            identidades, credenciales, roles y permisos</b> de forma centralizada. <b>Altas y bajas en un solo lugar.</b></li>
            <li><b>SSO</b> (Single Sign-On): el usuario <b>se autentica una vez</b> y accede a <b>múltiples
            aplicaciones</b> sin volver a loguearse. <b>Evita re-autenticaciones.</b></li>
            <li><b>MFA</b>: segundo factor. <b>El IdP es crítico:</b> si cae, nadie entra (hay que darle alta disponibilidad).</li>
          </ul>
          <p class="mini">Keycloak, Okta, Auth0; AWS IAM / Cognito, Microsoft Entra ID, Cloud IAM. Protocolos: <b>OAuth
          2.0</b> (autorización), <b>OpenID Connect</b> (autenticación sobre OAuth), <b>SAML</b> (clásico empresarial).</p>
        </div>
        <div class="callout tip">
          <p><b>Respuesta a “¿qué componente propone para permitir el inicio de sesión…, teniendo en cuenta que sólo van a
          ingresar con ese fin?”</b> → Un <b>IDM/IdP externo con SSO e inicio de sesión federado</b> (login con Google /
          Microsoft, vía <b>OpenID Connect</b>). Justificación: no tiene sentido construir y custodiar un módulo de
          usuarios y contraseñas para un uso tan acotado; se <b>delega la gestión de credenciales</b> (y el riesgo) a un
          proveedor, se gana <b>MFA y usabilidad</b> (el usuario no crea otra cuenta) y el backend recibe un
          <a class="inline" data-go="p2-sesiones">JWT</a> con la identidad, manteniéndose <b>stateless</b>.</p>
        </div>

        <h2>WAF (Web Application Firewall)</h2>
        <p>Filtra el tráfico HTTP antes de que llegue a la aplicación: <b>bloquea los ataques del OWASP Top 10</b>
        (inyección SQL, XSS, etc.), aplica <b>rate limiting</b> y da <b>“parches virtuales”</b> mientras el equipo corrige
        el código. <b>Evita caídas por ataques</b> con latencia mínima.</p>
        <p class="mini">ModSecurity, Imperva; AWS WAF, Azure WAF, Cloud Armor.</p>

        <h2>Gestión de secretos</h2>
        <ul>
          <li><b>Secretos:</b> contraseñas de bases de datos, <b>API keys</b>, certificados, claves de cifrado.</li>
          <li><b>Nunca en el código fuente ni en el repositorio:</b> una vez commiteado, <b>queda en el historial</b>.</li>
          <li>Se guardan en una <b>bóveda centralizada</b> con <b>control de acceso, auditoría y rotación periódica</b>.</li>
          <li>La aplicación los obtiene <b>en tiempo de ejecución</b> (variables de entorno inyectadas o consulta a la bóveda).</li>
        </ul>
        ${APP.code(`# ✕ MAL — application.properties commiteado en el repo
spring.datasource.url=jdbc:postgresql://db/ventas
spring.datasource.password=Sup3rS3cret!

# ✓ BIEN — valores inyectados desde la bóveda
spring.datasource.url=\${DB_URL}
spring.datasource.password=\${DB_PASSWORD}`, { lang: "properties", collapse: false, label: "Secretos fuera del código" })}
        <p class="mini">HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager.</p>

        <h2>Componentes por proveedor (por si piden tecnología concreta)</h2>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Componente</th><th>Open Source</th><th>AWS</th><th>Azure</th><th>GCP</th></tr></thead>
          <tbody>
            <tr><td>Load Balancer</td><td>NGINX, HAProxy, Traefik</td><td>ELB (ALB / NLB)</td><td>Load Balancer / App Gateway</td><td>Cloud Load Balancing</td></tr>
            <tr><td>Caché</td><td>Redis, Memcached, Varnish</td><td>ElastiCache</td><td>Azure Cache for Redis</td><td>Memorystore</td></tr>
            <tr><td>CDN</td><td>Cloudflare, Akamai, Fastly</td><td>CloudFront</td><td>Front Door</td><td>Cloud CDN</td></tr>
            <tr><td>DNS</td><td>BIND, CoreDNS</td><td>Route 53</td><td>Azure DNS</td><td>Cloud DNS</td></tr>
            <tr><td>API Gateway</td><td>Kong, KrakenD</td><td>API Gateway</td><td>API Management</td><td>Apigee</td></tr>
            <tr><td>IAM / SSO</td><td>Keycloak, Okta, Auth0</td><td>IAM, Cognito</td><td>Entra ID</td><td>Cloud IAM</td></tr>
            <tr><td>WAF</td><td>ModSecurity, Imperva</td><td>AWS WAF</td><td>Azure WAF</td><td>Cloud Armor</td></tr>
            <tr><td>Broker / Colas</td><td>RabbitMQ, Kafka</td><td>SQS, SNS, MSK</td><td>Service Bus, Event Hubs</td><td>Pub/Sub</td></tr>
            <tr><td>Observabilidad</td><td>Prometheus, Grafana, ELK, OpenTelemetry</td><td>CloudWatch, X-Ray</td><td>Azure Monitor, App Insights</td><td>Cloud Monitoring/Trace</td></tr>
            <tr><td>Secretos</td><td>HashiCorp Vault</td><td>Secrets Manager</td><td>Key Vault</td><td>Secret Manager</td></tr>
          </tbody>
        </table></div>

        <h2>⭐ Componentes y atributos de calidad (la tabla de oro)</h2>
        <p>Esta tabla es la respuesta a <b>“¿qué atributos de calidad se ven favorecidos con su propuesta?”</b>:</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Componente</th><th>Disponibilidad</th><th>Escalabilidad</th><th>Performance</th><th>Seguridad</th><th>Mantenibilidad</th></tr></thead>
          <tbody>
            <tr><td><b>Load Balancer</b></td><td>Elimina el punto único de falla</td><td>Agrega o quita nodos</td><td>Reparte la carga</td><td>Termina TLS</td><td>—</td></tr>
            <tr><td><b>Caché</b></td><td>Sirve ante fallas breves del origen</td><td>Descarga al origen</td><td>Reduce la latencia</td><td>Cuidar datos sensibles cacheados</td><td>—</td></tr>
            <tr><td><b>CDN</b></td><td>Nodos distribuidos</td><td>Absorbe picos globales</td><td>Contenido cerca del usuario</td><td>Mitiga DDoS</td><td>—</td></tr>
            <tr><td><b>API Gateway</b></td><td>—</td><td>Enruta a servicios escalables</td><td>Agregación y caché</td><td>Autenticación, rate limiting</td><td>Punto único de entrada</td></tr>
            <tr><td><b>IAM / SSO</b></td><td>El IdP es crítico</td><td>—</td><td>Evita re-autenticaciones</td><td>Identidad central, MFA</td><td>Altas y bajas en un lugar</td></tr>
            <tr><td><b>WAF</b></td><td>Evita caídas por ataques</td><td>—</td><td>Latencia mínima</td><td>Bloquea OWASP Top 10</td><td>Parches virtuales</td></tr>
            <tr><td><b>Broker / Colas</b></td><td>Tolera caídas del consumidor</td><td>Escala consumidores</td><td>Respuesta inmediata</td><td>—</td><td>Desacopla servicios</td></tr>
            <tr><td><b>Observabilidad</b></td><td>Detecta fallas temprano</td><td>Datos para dimensionar</td><td>Encuentra cuellos de botella</td><td>Auditoría</td><td>Diagnóstico más rápido</td></tr>
          </tbody>
        </table></div>

        <h2>Ejercicio</h2>
        <div id="p2compQuiz"></div>
      `;

      APP.quiz(el.querySelector("#p2compQuiz"), [
        { n: 1, topic: "Proxies", type: "mc", q: "Un <b>proxy reverso</b>…", options: [
          { t: "Actúa en nombre de los servidores: el cliente no sabe qué servidor lo atiende", ok: true },
          { t: "Actúa en nombre de los clientes: el servidor ve al proxy", ok: false },
          { t: "Es lo mismo que un balanceador L4", ok: false },
        ], explain: "Es la base sobre la que se construyen el Load Balancer, el API Gateway y el WAF. El forward proxy es el de las redes corporativas." },
        { n: 2, topic: "DNS", type: "mc", q: "¿Cuál es el trade-off del TTL en DNS?", options: [
          { t: "Un TTL alto mejora la performance pero demora la conmutación ante una falla", ok: true },
          { t: "Un TTL alto mejora la seguridad", ok: false },
          { t: "No tiene impacto arquitectónico", ok: false },
        ], explain: "Por eso en escenarios de failover por DNS se usan TTL bajos." },
        { n: 3, topic: "Secretos", type: "vf", q: "Alcanza con borrar la contraseña del archivo y hacer un commit nuevo.", options: [
          { t: "Verdadero", ok: false }, { t: "Falso", ok: true },
        ], explain: "Una vez commiteado, el secreto queda en el HISTORIAL del repositorio. Hay que rotarlo y moverlo a una bóveda con control de acceso, auditoría y rotación." },
        { n: 4, topic: "Atributos", type: "mc", q: "¿Qué atributos favorece principalmente un broker de mensajes?", options: [
          { t: "Disponibilidad (tolera caídas del consumidor), escalabilidad (escala consumidores), performance (respuesta inmediata) y mantenibilidad (desacopla)", ok: true },
          { t: "Seguridad y confidencialidad", ok: false },
          { t: "Sólo performance", ok: false },
        ], explain: "Es la fila del broker en la tabla de componentes vs. atributos de calidad." },
        { n: 5, topic: "Identidad", type: "open", q: "Diferencia entre IDM/IAM, SSO y MFA.", answer: "IDM/IAM es el componente que administra de forma centralizada identidades, credenciales, roles y permisos: permite dar de alta y de baja a una persona en un solo lugar y auditar accesos. SSO (Single Sign-On) es la capacidad de que el usuario se autentique UNA vez y acceda a múltiples aplicaciones sin volver a loguearse: mejora usabilidad y performance (evita re-autenticaciones) y centraliza la identidad. MFA (multifactor) es un refuerzo de la autenticación: exige un segundo factor además de la contraseña (algo que sabés, algo que tenés, algo que sos). Los tres se apoyan en un IdP, que al centralizar la identidad se vuelve crítico y necesita alta disponibilidad." },
      ]);
    },
  });
})();
