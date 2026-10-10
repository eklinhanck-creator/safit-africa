(function () {
  var form = document.getElementById("soon-form");
  var note = document.getElementById("soon-note");
  var done = document.getElementById("soon-done");
  // Lance le téléchargement automatiquement ; le lien visible reste le repli si le navigateur le bloque
  function startDownload() {
    var link = done.querySelector("a[download]");
    if (!link) return;
    var a = document.createElement("a");
    a.href = link.href;
    a.download = "";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    note.className = "note";
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = f.type === "checkbox" ? !f.checked
        : !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.className = "note bad";
      note.textContent = "Merci d'indiquer un e-mail valide et d'accepter d'être recontacté.";
      return;
    }
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    note.textContent = "Envoi en cours...";
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        form.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ block: "center" });
        startDownload();
      })
      .catch(function () {
        note.className = "note bad";
        note.textContent = "L'envoi a échoué. Réessayez, ou écrivez-nous à africasoft@cagecfi.com.";
        btn.disabled = false;
      });
  });
})();
