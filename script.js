(function () {
  // Menu mobile
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Apparition au scroll
  var targets = document.querySelectorAll(".card, .theme, .offer, .gallery figure, .facts div, .infos div, .mag, .promoter__in");
  targets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("in"); });
  }

  // Compteurs animés (chiffres 2026)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = document.querySelectorAll("[data-count]");
  function run(el) {
    var end = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = end + suffix; return; }
    var start = performance.now(), dur = 1200;
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // Formulaire : ouvre le client mail avec le message pré-rempli (pas de serveur)
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = "Merci de renseigner les champs obligatoires."; return; }
    var d = new FormData(form);
    var body = [
      "Nom : " + d.get("nom"),
      "Organisation : " + d.get("org"),
      "E-mail : " + d.get("email"),
      "Téléphone : " + (d.get("tel") || "-"),
      "Offre souhaitée : " + d.get("offre"),
      "",
      d.get("msg") || ""
    ].join("\n");
    var subject = "SAFIT 2027 : demande de partenariat (" + d.get("org") + ")";
    window.location.href = "mailto:africasoft@cagecfi.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    note.textContent = "Votre application mail va s'ouvrir. Si rien ne se passe, écrivez-nous à africasoft@cagecfi.com.";
  });
})();
