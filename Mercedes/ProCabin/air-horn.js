// One solid 3D horn, retaining the frozen placement and finish choices.
let airHornEnabled = false;
const AIR_HORN_AUDIO_URL = new URL("audio/sygnal-pneumatyczny.wav", document.currentScript.src).href;
const AIR_HORN_POSE_KEY = "actros-air-horn-pose-v1";
const AIR_HORN_FROZEN_KEY = "actros-air-horn-frozen-pose-v1";
let airHornFinish = "chrome";
const AIR_HORN_CONTROLS = [
  ["x", "Pozycja lewo / prawo", -350, 350, 1, 0, " px"],
  ["y", "Pozycja góra / dół", -150, 350, 1, 0, " px"],
  ["angle", "Nachylenie — prawy koniec w dół", -45, 45, .5, 5, "°"],
  ["yaw", "Obrót w Twoją stronę / od siebie", -70, 70, .5, 0, "°"],
  ["pitch", "Perspektywa — obrót góra / dół", -70, 70, 1, 0, "°"],
  ["scale", "Rozmiar", 40, 200, 1, 100, "%"],
  ["width", "Długość trąbki", 50, 200, 1, 100, "%"],
  ["height", "Grubość / rozszerzenie trąbki", 50, 250, 1, 100, "%"],
  ["depth", "Głębia perspektywy", 200, 1600, 10, 600, " px"]
];
function normalizeAirHornPose(value = {}) {
  return Object.fromEntries(AIR_HORN_CONTROLS.map(([key, , min, max, , fallback]) => {
    const number = value && typeof value[key] === "number" ? value[key] : fallback;
    return [key, Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback];
  }));
}
let airHornPose = normalizeAirHornPose();
try {
  const frozen = localStorage.getItem(AIR_HORN_FROZEN_KEY);
  airHornPose = normalizeAirHornPose(JSON.parse(frozen || localStorage.getItem(AIR_HORN_POSE_KEY) || "{}"));
  if (!frozen) localStorage.setItem(AIR_HORN_FROZEN_KEY, JSON.stringify(airHornPose));
  airHornFinish = localStorage.getItem("actros-air-horn-finish-v1") === "black" ? "black" : "chrome";
} catch {}
airHornPose = Object.freeze(airHornPose);
const AIR_HORN_IMAGE = HADLEY_FACE_TEXTURE_URL;
const AIR_HORN_ROTATION_KEY = "actros-air-horn-solid-rotation-v1";
const AIR_HORN_FROZEN_ROTATION_KEY = "actros-air-horn-frozen-solid-rotation-v1";
const AIR_HORN_ROTATION_FIELDS = [
  ["yaw", "Obrót w Twoją stronę", -55, 55],
  ["pitch", "Pochylenie góra / dół", -40, 40],
  ["roll", "Nachylenie prawego końca", -30, 30]
];
function normalizeAirHornRotation(value = {}) {
  return Object.fromEntries(AIR_HORN_ROTATION_FIELDS.map(([key, , min, max]) => {
    const number = value && typeof value[key] === "number" && Number.isFinite(value[key]) ? value[key] : 0;
    return [key, Math.max(min, Math.min(max, number))];
  }));
}
let airHornRotation = normalizeAirHornRotation();
try {
  const frozen = localStorage.getItem(AIR_HORN_FROZEN_ROTATION_KEY);
  airHornRotation = normalizeAirHornRotation(JSON.parse(frozen || localStorage.getItem(AIR_HORN_ROTATION_KEY) || "{}"));
  if (!frozen) localStorage.setItem(AIR_HORN_FROZEN_ROTATION_KEY, JSON.stringify(airHornRotation));
} catch {}
airHornRotation = Object.freeze(airHornRotation);
let airHornShape = "round";
let rectangularHornPose = { ...airHornPose };
try {
  airHornShape = localStorage.getItem("actros-air-horn-shape-v1") === "rectangular" ? "rectangular" : "round";
  const frozen = localStorage.getItem("actros-rectangular-horn-frozen-pose-v1");
  const saved = frozen || localStorage.getItem("actros-rectangular-horn-pose-v1");
  if (saved) rectangularHornPose = normalizeAirHornPose(JSON.parse(saved));
  if (!frozen) localStorage.setItem("actros-rectangular-horn-frozen-pose-v1", JSON.stringify(rectangularHornPose));
} catch {}
rectangularHornPose = Object.freeze(rectangularHornPose);
const airHornModels = { round: new AirHornModel3D("round"), rectangular: new AirHornModel3D("rectangular") };
function applyAirHornPose() {
  const canvas = document.getElementById("airHornLayer");
  if (canvas) airHornModels[airHornShape].draw(canvas,
    airHornShape === "rectangular" ? rectangularHornPose : airHornPose,
    airHornRotation, airHornShape === "rectangular" ? "chrome" : airHornFinish);
}
function updateAirHorn() {
  let canvas = document.getElementById("airHornLayer");
  if (!airHornEnabled) { canvas?.remove(); return; }
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "airHornLayer";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3";
    document.getElementById("frame").append(canvas);
  }
  applyAirHornPose();
}
new ResizeObserver(applyAirHornPose).observe(document.getElementById("frame"));
function appendAirHornAudio(panel) {
  const section = document.createElement("section");
  section.className = "option air-horn-audio";
  section.innerHTML = `<div class="option-title">Przykładowy dźwięk trąb</div><button type="button" class="option-btn" id="airHornListen" aria-pressed="false">▶ Posłuchaj dźwięku</button><p class="note" style="margin-bottom:0;line-height:1.6">Nagranie ma charakter poglądowy. Brzmienie sygnału różni się w zależności od długości i wielkości trąby.</p><p class="note" id="airHornAudioStatus" role="status" hidden></p>`;
  const audio = document.createElement("audio");
  audio.src = AIR_HORN_AUDIO_URL;
  audio.preload = "none";
  section.append(audio); panel.append(section);
  const button = section.querySelector("button"), status = section.querySelector("[role=status]");
  const reset = () => { button.textContent = "▶ Posłuchaj dźwięku"; button.setAttribute("aria-pressed", "false"); };
  const failed = () => { status.hidden = false; status.textContent = "Nie udało się odtworzyć dźwięku. Spróbuj ponownie."; reset(); };
  audio.onended = reset; audio.onpause = reset; audio.onerror = failed;
  audio.onplay = () => { button.textContent = "■ Zatrzymaj dźwięk"; button.setAttribute("aria-pressed", "true"); };
  button.onclick = async () => {
    status.hidden = true;
    if (!audio.paused) { audio.pause(); audio.currentTime = 0; return; }
    try { audio.currentTime = 0; await audio.play(); } catch { if (section.isConnected) failed(); }
  };
  // Stop a sample when a different category, shape or finish replaces its panel.
  const observer = new MutationObserver(() => {
    if (!section.isConnected) { audio.pause(); observer.disconnect(); }
  });
  observer.observe(panel, { childList: true });
}
function renderAirHorn() {
  const panel = document.getElementById("panelContent");
  panel.innerHTML = `<div class="option ${!airHornEnabled ? 'active' : ''}"><button id="airHorn-none" type="button" class="option-btn" aria-pressed="${!airHornEnabled}">Bez sygnału</button></div><div class="option"><div class="option-title">Kształt sygnału</div><div class="grid-buttons"><button id="airHorn-round" type="button" class="${airHornEnabled && airHornShape === 'round' ? 'active' : ''}" aria-pressed="${airHornEnabled && airHornShape === 'round'}">Okrągły</button><button id="airHorn-rectangular" type="button" class="${airHornEnabled && airHornShape === 'rectangular' ? 'active' : ''}" aria-pressed="${airHornEnabled && airHornShape === 'rectangular'}">Prostokątny</button></div></div>`;
  if (airHornEnabled) {
    const choices = airHornShape === "round" ? [["chrome", "Chromowany"], ["black", "Czarny"]] : [["chrome", "Chromowane"]];
    panel.innerHTML += choices.map(([finish, label]) => {
      const active = airHornShape === "rectangular" || airHornFinish === finish;
      return `<div class="option ${active ? 'active' : ''}"><button id="airHorn-${finish}" type="button" class="option-btn air-horn-choice" aria-pressed="${active}"><span>${label}</span></button></div>`;
    }).join("");
    choices.forEach(([finish]) => {
      document.getElementById(`airHorn-${finish}`).onclick = () => {
        if (airHornShape === "round") {
          airHornFinish = finish;
          try { localStorage.setItem("actros-air-horn-finish-v1", finish); } catch {}
        }
        updateAirHorn(); renderAirHorn();
      };
    });
  }
  appendProductInfoLink(document.getElementById("airHorn-round").closest(".option"), "airHorns");
  const brands = [["Basuri", "9536/basuri"], ["Beam", "1476/beam"], ["Fiamm", "1488/fiamm"], ["Hadley", "1446/hadley"], ["Nedking", "9736/nedking"]];
  panel.insertAdjacentHTML("beforeend", `<div class="option air-horn-offer"><p class="note">W naszej ofercie znajdziesz sygnały pneumatyczne firm:</p><div class="air-horn-brands">${brands.map(([name, path]) => `<a href="https://www.enatruck.pl/kategoria/${path}/" target="_blank" rel="noopener noreferrer" title="${name} — otwórz w nowej karcie">${name}</a>`).join("")}</div><p class="note">Dostępne długości: <strong>od 48 do 95 cm</strong>.</p></div>`);
  appendAirHornAudio(panel);
  document.getElementById("airHorn-none").onclick = () => { airHornEnabled = false; updateAirHorn(); renderAirHorn(); };
  for (const shape of ["round", "rectangular"]) {
    document.getElementById(`airHorn-${shape}`).onclick = () => {
      airHornShape = shape; airHornEnabled = true;
      try { localStorage.setItem("actros-air-horn-shape-v1", shape); } catch {}
      updateAirHorn(); renderAirHorn();
    };
  }
}

updateAirHorn();
