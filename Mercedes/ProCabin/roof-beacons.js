const clearRoofBeaconModel = new RoofBeaconModel3D(true);
const orangeRoofBeaconModel = new RoofBeaconModel3D(true, true);
const tallClearRoofBeaconModel = new RoofBeaconModel3D(true, false, true);
const tallOrangeRoofBeaconModel = new RoofBeaconModel3D(true, true, true);
const minorRoofBeaconModel = new RoofBeaconModel3D(true, true, false, true);
const beeRoofBeaconModel = new RoofBeaconModel3D(true, true, false, false, true);
const ROOF_BEACON_STORAGE = "actros-roof-beacons-v1";
const ROOF_BEACON_DEFAULTS = Object.freeze({
  left: Object.freeze({ x: 510, y: 125, size: 34, angle: 0, yaw: 0, pitch: 0, width: 100, height: 100, depth: 600 }),
  right: Object.freeze({ x: 874, y: 79, size: 38, angle: 0, yaw: 0, pitch: 0, width: 100, height: 100, depth: 600 })
});
const ROOF_BEACON_FIELDS = [
  ["x", "Pozycja lewo / prawo", 350, 1150, 1, " px"],
  ["y", "Pozycja góra / dół", 20, 240, 1, " px"],
  ["size", "Rozmiar koguta", 20, 70, 1, " px"],
  ["angle", "Nachylenie lewo / prawo", -45, 45, .5, "°"],
  ["yaw", "Obrót w Twoją stronę", -70, 70, .5, "°"],
  ["pitch", "Pochylenie góra / dół", -70, 70, .5, "°"],
  ["width", "Szerokość", 50, 180, 1, "%"],
  ["height", "Wysokość", 50, 180, 1, "%"],
  ["depth", "Głębia perspektywy", 200, 1200, 10, " px"]
];
function normalizeRoofBeacons(value = {}) {
  const result = { enabled: value?.enabled === true, model: ["skyled-bee", "skyled-minor", "skyled-127-clear", "skyled-127-orange"].includes(value?.model) ? value.model : ["skyled-orange", "amber"].includes(value?.model) ? "skyled-orange" : "skyled-clear", editing: value?.editing === "right" ? "right" : "left" };
  for (const side of ["left", "right"]) {
    result[side] = Object.fromEntries(ROOF_BEACON_FIELDS.map(([key, , min, max]) => {
      const number = value?.[side]?.[key];
      return [key, typeof number === "number" && Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : ROOF_BEACON_DEFAULTS[side][key]];
    }));
  }
  return result;
}
let roofBeacons = normalizeRoofBeacons();
try { roofBeacons = normalizeRoofBeacons(JSON.parse(localStorage.getItem(ROOF_BEACON_STORAGE) || "{}")); } catch {}
function saveRoofBeacons() {
  try { localStorage.setItem(ROOF_BEACON_STORAGE, JSON.stringify(roofBeacons)); } catch {}
}
function updateRoofBeacons() {
  let layer = document.getElementById("roofBeaconLayer");
  if (!roofEnabled || !roofBeacons.enabled) { if (layer) layer.hidden = true; return; }
  if (!layer) {
    layer = document.createElement("div"); layer.id = "roofBeaconLayer";
    layer.setAttribute("aria-hidden", "true");
    // Above the roof frame (2), behind the long-range lamp group (3).
    layer.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:2";
    for (const side of ["left", "right"]) {
      const image = document.createElement("canvas");
      image.dataset.side = side;
      image.style.cssText = "position:absolute;inset:0;width:100%;height:100%;user-select:none";
      layer.append(image);
      const glow = document.createElement("canvas");
      glow.dataset.glowSide = side;
      glow.className = "roof-beacon-glow";
      glow.style.cssText = image.style.cssText;
      layer.append(glow);
    }
    document.getElementById("frame").append(layer);
  }
  layer.hidden = false;
  const displayWidth = document.getElementById("frame").getBoundingClientRect().width;
  const model = ({ "skyled-bee":beeRoofBeaconModel, "skyled-minor":minorRoofBeaconModel, "skyled-clear":clearRoofBeaconModel, "skyled-orange":orangeRoofBeaconModel, "skyled-127-clear":tallClearRoofBeaconModel, "skyled-127-orange":tallOrangeRoofBeaconModel })[roofBeacons.model] || clearRoofBeaconModel;
  for (const canvas of layer.querySelectorAll("canvas[data-side]")) {
    const pose = roofBeacons[canvas.dataset.side];
    model.draw(canvas, { ...pose, y: pose.y - (canvas.dataset.side === "left" ? 2 : 0) }, displayWidth);
  }
  for (const glow of layer.querySelectorAll(".roof-beacon-glow")) {
    glow.hidden = !warningLightsEnabled;
    if (!warningLightsEnabled) continue;
    const pose = roofBeacons[glow.dataset.glowSide];
    model.draw(glow, { ...pose, y: pose.y - (glow.dataset.glowSide === "left" ? 2 : 0) }, displayWidth, true);
  }
  synchronizeWarningAnimations();
}
function renderRoofBeaconOptions(container) {
  const orange = roofBeacons.model.endsWith("orange");
  const tall = roofBeacons.model.startsWith("skyled-127-");
  const minor = roofBeacons.model === "skyled-minor";
  const bee = roofBeacons.model === "skyled-bee";
  const selectedModel = (height, isOrange = orange) => "skyled-" + (height ? "127-" : "") + (isOrange ? "orange" : "clear");
  container.innerHTML = `<div class="roof-group"><span class="roof-label">Model koguta</span><div class="grid-buttons"><button id="roofBeaconsClear" class="${roofBeacons.enabled && !tall && !minor && !bee ? 'active' : ''}" aria-pressed="${roofBeacons.enabled && !tall && !minor && !bee}">SKYLED — 89 mm</button><button id="roofBeaconsClearFeatures" type="button" aria-haspopup="dialog">Cechy</button></div><div class="grid-buttons" style="margin-top:10px"><button id="roofBeaconsTall" class="${roofBeacons.enabled && tall ? 'active' : ''}" aria-pressed="${roofBeacons.enabled && tall}">SKYLED — 127 mm</button><button id="roofBeaconsTallFeatures" type="button" aria-haspopup="dialog">Cechy</button></div><div class="grid-buttons" style="margin-top:10px"><button id="roofBeaconsMinor" class="${roofBeacons.enabled && minor ? 'active' : ''}" aria-pressed="${roofBeacons.enabled && minor}">SKYLED Minor</button><button id="roofBeaconsMinorFeatures" type="button" aria-haspopup="dialog">Cechy</button></div><div class="grid-buttons" style="margin-top:10px"><button id="roofBeaconsBee" class="${roofBeacons.enabled && bee ? 'active' : ''}" aria-pressed="${roofBeacons.enabled && bee}">SKYLED BEE</button><button id="roofBeaconsBeeFeatures" type="button" aria-haspopup="dialog">Cechy</button></div>${roofBeacons.enabled && !minor && !bee ? `<div class="roof-group"><span class="roof-label">Kolor klosza</span><div class="grid-buttons"><button id="roofBeaconLensClear" class="${!orange ? 'active' : ''}" aria-pressed="${!orange}">Jasny</button><button id="roofBeaconLensOrange" class="${orange ? 'active' : ''}" aria-pressed="${orange}">Pomarańczowy</button></div></div>` : ''}<div id="roofBeaconProductLink"></div></div>`;
  const choose = (enabled, model = roofBeacons.model) => { if (!roofEnabled && enabled) return; roofBeacons.enabled = enabled; roofBeacons.model = model; saveRoofBeacons(); applyAccessoryLighting(); renderWarningLighting(); };
  document.getElementById("roofBeaconsNone").onclick = () => choose(false);
  document.getElementById("roofBeaconsClear").onclick = () => choose(true, selectedModel(false));
  document.getElementById("roofBeaconsClearFeatures").onclick = () => openClearBeaconPreview(orange, false);
  document.getElementById("roofBeaconsTall").onclick = () => choose(true, selectedModel(true));
  document.getElementById("roofBeaconsTallFeatures").onclick = () => openClearBeaconPreview(orange, true);
  document.getElementById("roofBeaconsMinor").onclick = () => choose(true, "skyled-minor");
  document.getElementById("roofBeaconsMinorFeatures").onclick = () => openClearBeaconPreview(true, false, true);
  document.getElementById("roofBeaconsBee").onclick = () => choose(true, "skyled-bee");
  document.getElementById("roofBeaconsBeeFeatures").onclick = () => openClearBeaconPreview(true, false, false, true);
  if (roofBeacons.enabled && !minor && !bee) {
    document.getElementById("roofBeaconLensClear").onclick = () => choose(true, selectedModel(tall, false));
    document.getElementById("roofBeaconLensOrange").onclick = () => choose(true, selectedModel(tall, true));
  }
  const mountingNote = document.createElement("section");
  mountingNote.className = "roof-group";
  mountingNote.innerHTML = `<p class="note"><strong>Podstawka montażowa jest niezbędna</strong> do zamontowania koguta na ramie dachowej. Dobierz odpowiednią płytkę montażową:</p><a class="product-info-link" href="https://www.enatruck.pl/produkt/26710/plytka-montazowa-do-swiatel-ostrzegawczych-_prosta_-fi-16_5cm_-malowana-na-czarno/" target="_blank" rel="noopener noreferrer">Płytka montażowa Ø 16,5 cm — malowana na czarno ↗</a><a class="product-info-link" href="https://www.enatruck.pl/produkt/22252/plytka-montazowa-do-swiatel-ostrzegawczych-prosta-fi-16_5-cm/" target="_blank" rel="noopener noreferrer">Płytka montażowa prosta Ø 16,5 cm ↗</a>`;
  container.append(mountingNote);
  appendProductInfoLink(document.getElementById("roofBeaconProductLink"), bee ? "beeBeacon" : minor ? "minorBeacon" : tall ? (orange ? "tallOrangeBeacon" : "tallClearBeacon") : (orange ? "orangeBeacon" : "clearBeacon"));
}