/* ============================================================
   Cheatsheet — Frases para justificar (imprimible)
   ============================================================ */
(function () {
  "use strict";
  const APP = window.APP;

  APP.register({
    id: "cs-frases",
    title: "Cheatsheet: Frases para justificar",
    tag: "🃏",
    group: "Cheatsheets",
    resumen: "Frases modelo listas para adaptar",
    keywords: ["cheatsheet", "frases", "justificar", "justificacion", "imprimible", "defensa", "modelo"],
    render(el) {
      el.innerHTML = `
        <div class="page-head">
          <div class="page-kicker">Cheatsheet imprimible</div>
          <h1>Frases para justificar</h1>
          <p class="lead">Frases modelo listas para adaptar en el parcial. Reemplazá lo que está entre corchetes.</p>
        </div>

        <div class="controls no-print">
          <button class="btn" id="csPrint" type="button">🖨️ Imprimir / Guardar PDF</button>
        </div>

        <div class="callout key">
          <div class="callout-title">🎯 Los 4 elementos de toda justificación</div>
          <p>Nombra el patrón/decisión · Cita el enunciado · Menciona un principio SOLID · Menciona una cualidad
          (bajo acoplamiento / alta cohesión). Practicalo en
          <a class="inline no-print" data-go="p-justificacion">Escribí la justificación</a>.</p>
        </div>

        <h2>Para justificar un patrón</h2>
        <ul class="frases">
          <li>“Apliqué <b>[patrón]</b> porque el enunciado indica que <b>[cita]</b>, lo cual requiere <b>[necesidad]</b>.”</li>
          <li>“Esto cumple el principio <b>[SOLID]</b> ya que <b>[explicación]</b>.”</li>
          <li>“Favorece el <b>bajo acoplamiento</b> porque <b>[X]</b> sólo conoce la abstracción <b>[Y]</b>.”</li>
          <li>“Agregar <b>[variante nueva]</b> no requiere modificar el código existente, sólo sumar una clase (Open/Closed).”</li>
        </ul>

        <h2>Para justificar NO usar un patrón</h2>
        <ul class="frases">
          <li>“Evité aplicar <b>[patrón]</b> porque en este caso sólo existe <b>[una variante / un tipo]</b>, y agregar esa abstracción sería sobreingeniería sin beneficio.”</li>
          <li>“Preferí una solución más simple porque el enunciado no menciona necesidad de extensión en este punto.”</li>
        </ul>

        <h2>Para arquitectura</h2>
        <ul class="frases">
          <li>“Propuse comunicación asincrónica mediante <b>[cola/broker]</b> porque el enunciado indica que <b>[el servicio puede demorar / hay picos de tráfico]</b>, y una llamada sincrónica generaría timeouts y acoplamiento temporal.”</li>
          <li>“Incorporé <b>[componente]</b> para eliminar el punto único de falla en <b>[X]</b>.”</li>
          <li>“Propuse un BFF por canal para que los contratos de los microservicios no cambien por necesidades de la interfaz.”</li>
        </ul>

        <h2>Para persistencia</h2>
        <ul class="frases">
          <li>“Elegí persistencia <b>[relacional/no relacional]</b> para <b>[X]</b> porque <b>[los datos tienen estructura fija y relaciones / el esquema es variable y se consulta por documento completo]</b>.”</li>
          <li>“Desnormalicé <b>[X]</b> porque se consulta con mucha frecuencia junto a <b>[Y]</b> y la performance de lectura es prioritaria.”</li>
          <li>“Guardé un snapshot de <b>[X]</b> como value object inmutable para que <b>[la operación]</b> no se vea afectada por cambios posteriores.”</li>
        </ul>

        <h2>Para seguridad</h2>
        <ul class="frases">
          <li>“Propuse cifrado en reposo (AES a nivel columna) con claves en un KMS externo para brindar confidencialidad en los datos almacenados; las contraseñas van hasheadas, no cifradas.”</li>
          <li>“Delegué la gestión de usuarios en un IDM con SSO, para no implementar mal el manejo de credenciales y ganar MFA, recuperación y auditoría.”</li>
        </ul>

        <style>
          .frases li { margin: .5rem 0; }
        </style>
      `;
      el.querySelector("#csPrint").addEventListener("click", function () { window.print(); });
    },
  });
})();
