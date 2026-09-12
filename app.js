```javascript
const qs = s => document.querySelector(s);

function getData() {
  return JSON.parse(localStorage.getItem("accuData") || "{}");
}

function setData(data) {
  localStorage.setItem("accuData", JSON.stringify(data));
}

function scoreData(data) {
  const age = Math.max(0, Number(data.age) || 0);
  const cycles = Math.max(0, Number(data.cycles) || 0);
  const range = Math.max(0, Number(data.range) || 0);
  const original = Math.max(1, Number(data.original) || 1);

  // 1. Actieradius — 45%
  const rangeScore = Math.max(
    0,
    Math.min(100, (range / original) * 100)
  );

  // 2. Leeftijd — 20%
  // 0 jaar = 100, 10 jaar of ouder = 0
  const ageScore = Math.max(
    0,
    Math.min(100, 100 - age * 10)
  );

  // 3. Laadcycli — 20%
  // 100 cycli = 100
  // 300 cycli = 90
  // 600 cycli = 80
  // 1200 cycli = 60
  // 1800 cycli = 40
  // 3000+ cycli = 0
  const cycleScore = Math.max(
    0,
    Math.min(100, 100 - (cycles / 30))
  );

  // 4. Algemene staat — 15%
  const stateScores = {
    "Zeer goed": 100,
    "Goed": 85,
    "Matig": 50,
    "Redelijk": 50,
    "Slecht": 20
  };

  const stateScore = stateScores[data.condition] ?? 50;

  // Gewogen totaalscore
  const score = Math.round(
    rangeScore * 0.45 +
    ageScore * 0.20 +
    cycleScore * 0.20 +
    stateScore * 0.15
  );

  return {
    score,
    range
  };
}

function getScoreMessage(score) {
  if (score >= 80) {
    return "Deze accu lijkt in goede staat.";
  }

  if (score >= 60) {
    return "Deze accu vertoont enige slijtage.";
  }

  if (score >= 40) {
    return "Deze accu vertoont duidelijke tekenen van slijtage.";
  }

  return "Deze accu is waarschijnlijk sterk versleten.";
}

function getReplacementCost(score) {
  if (score < 60) {
    return "€ 450 – € 800";
  }

  return "€ 350 – € 650";
}

function getValueImpact(score) {
  if (score >= 80) {
    return "Beperkte invloed";
  }

  if (score >= 60) {
    return "Enige invloed";
  }

  return "Kan merkbaar invloed hebben";
}

function renderResult() {
  const data = getData();
  const result = scoreData(data);

  const score = result.score;

  if (qs("#score")) {
    qs("#score").textContent = score + "/100";
  }

  if (qs("#capacity")) {
    qs("#capacity").textContent = score + "/100";
  }

  if (qs("#range")) {
    qs("#range").textContent = result.range + " km";
  }

  if (qs("#life")) {
    qs("#life").textContent = "Niet betrouwbaar te voorspellen";
  }

  if (qs("#replacement")) {
    qs("#replacement").textContent = getReplacementCost(score);
  }

  if (qs("#impact")) {
    qs("#impact").textContent = getValueImpact(score);
  }

  // Tekst onder de hoofdscore
  const message = getScoreMessage(score);

  const messageElement =
    qs("#score-message") ||
    qs(".score-message");

  if (messageElement) {
    messageElement.textContent = message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = qs("#accu-form");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      setData(data);

      window.location.href = "resultaat.html";
    });
  }

  renderResult();

  const pay = qs("#pay");

  if (pay) {
    pay.addEventListener("click", () => {
      window.location.href = "confirmation.html";
    });
  }
});
```

