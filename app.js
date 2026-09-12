const qs = s => document.querySelector(s);

function getData() {
  return JSON.parse(localStorage.getItem("accuData") || "{}");
}

function setData(d) {
  localStorage.setItem("accuData", JSON.stringify(d));
}

function scoreData(d) {
  const age = Math.max(0, Number(d.age) || 0);
  const cycles = Math.max(0, Number(d.cycles) || 0);
  const range = Math.max(0, Number(d.range) || 0);
  const original = Math.max(1, Number(d.original) || 1);

  // 1. Actieradius: 45%
  const rangeScore = Math.max(
    0,
    Math.min(100, (range / original) * 100)
  );

  // 2. Leeftijd: 20%
  const ageScore = Math.max(0, Math.min(100, 100 - age * 10));

  // 3. Laadcycli: 20%
  const cycleScore = Math.max(
    0,
    Math.min(100, 100 - (cycles / 300) * 10)
  );

  // 4. Algemene staat: 15%
  const stateScores = {
    "Zeer goed": 100,
    "Goed": 85,
    "Redelijk": 50,
    "Matig": 50,
    "Slecht": 20
  };

  const stateScore = stateScores[d.condition] ?? 50;

  const score = Math.round(
    rangeScore * 0.45 +
    ageScore * 0.20 +
    cycleScore * 0.20 +
    stateScore * 0.15
  );

  return {
    score,
    capacity: score,
    range,
    life: null,
    replacement: score < 60 ? "€ 450 – € 800" : "€ 350 – € 650",
    impact: score >= 80
      ? "Beperkte invloed"
      : "Kan merkbaar invloed hebben"
  };
}

function renderResult() {
  const d = getData();
  const r = scoreData(d);

  if (qs("#score")) qs("#score").textContent = r.score + "/100";

  if (qs("#capacity")) {
    qs("#capacity").textContent = r.score + "/100";
  }

  if (qs("#range")) {
    qs("#range").textContent = r.range + " km";
  }

  if (qs("#life")) {
    qs("#life").textContent =
      "Niet betrouwbaar te voorspellen";
  }

  if (qs("#replacement")) {
    qs("#replacement").textContent = r.replacement;
  }

  if (qs("#impact")) {
    qs("#impact").textContent = r.impact;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = qs("#accu-form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const fd = new FormData(form);
      const d = Object.fromEntries(fd.entries());

      setData(d);
      location.href = "resultaat.html";
    });
  }

  renderResult();

  const pay = qs("#pay");

  if (pay) {
    pay.addEventListener("click", () => {
      location.href = "confirmation.html";
    });
  }
});
