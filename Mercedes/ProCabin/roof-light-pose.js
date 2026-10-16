// One shared adjustment for both the four- and six-lamp roof sets.
const ROOF_LIGHT_POSE_KEY = "actros-roof-light-pose-v1";
const ROOF_LIGHT_POSE_FIELDS = [
  ["x", "Przesunięcie lewo / prawo", -100, 100, 1, " px"],
  ["y", "Przesunięcie góra / dół", -80, 80, 1, " px"],
  ["yaw", "Obrót w Twoją stronę", -45, 45, .5, "°"],
  ["pitch", "Pochylenie góra / dół", -45, 45, .5, "°"],
  ["roll", "Nachylenie całego zestawu", -20, 20, .5, "°"]
];
function normalizeRoofLightPose(value = {}) {
  return Object.fromEntries(ROOF_LIGHT_POSE_FIELDS.map(([key, , min, max]) => {
    const number = value && typeof value[key] === "number" && Number.isFinite(value[key]) ? value[key] : 0;
    return [key, Math.max(min, Math.min(max, number))];
  }));
}
function freezeAccessoryPose(storageKey, normalize) {
  let pose = normalize();
  try {
    const frozen = localStorage.getItem(storageKey + ":frozen");
    pose = normalize(JSON.parse(frozen || localStorage.getItem(storageKey) || "{}"));
    if (!frozen) localStorage.setItem(storageKey + ":frozen", JSON.stringify(pose));
  } catch {}
  return Object.freeze(pose);
}
let roofLightPose = { ...freezeAccessoryPose(ROOF_LIGHT_POSE_KEY, normalizeRoofLightPose) };
let roofLightPoseSix = { ...roofLightPose };
try {
  const saved = localStorage.getItem(ROOF_LIGHT_POSE_KEY + ":six");
  if (saved) roofLightPoseSix = normalizeRoofLightPose(JSON.parse(saved));
  else localStorage.setItem(ROOF_LIGHT_POSE_KEY + ":six", JSON.stringify(roofLightPoseSix));
} catch {}
function ensureRoofLampDepth() {
  if (document.getElementById("roofLampDepth")) return;
  const definitions = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  definitions.setAttribute("width", "0"); definitions.setAttribute("height", "0");
  definitions.setAttribute("aria-hidden", "true");
  definitions.style.cssText = "position:absolute;pointer-events:none";
  // Extrude the actual transparent contour: the lens stays sharp and the housing gains a side wall.
  definitions.innerHTML = `<defs><filter id="roofLampDepth" x="-35%" y="-40%" width="180%" height="190%" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">
    <feFlood flood-color="#525e68" result="edgeColor"/>
    <feComposite in="edgeColor" in2="SourceAlpha" operator="in" result="edge"/>
    <feFlood flood-color="#232a31" result="caseColor"/>
    <feComposite in="caseColor" in2="SourceAlpha" operator="in" result="case"/>
    <feOffset in="edge" dx=".09" dy="-.045" result="back"/>
    <feOffset in="case" dx=".075" dy="-.0375" result="side5"/>
    <feOffset in="case" dx=".06" dy="-.03" result="side4"/>
    <feOffset in="case" dx=".045" dy="-.0225" result="side3"/>
    <feOffset in="case" dx=".03" dy="-.015" result="side2"/>
    <feOffset in="case" dx=".015" dy="-.0075" result="side1"/>
    <feMerge><feMergeNode in="back"/><feMergeNode in="side5"/><feMergeNode in="side4"/><feMergeNode in="side3"/><feMergeNode in="side2"/><feMergeNode in="side1"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter></defs>`;
  document.body.append(definitions);
}
function applyRoofLightPose() {
  ensureRoofLampDepth();
  const layer = document.getElementById("skyledRoofLayer");
  let group = document.getElementById("roofLightPoseLayer");
  if (!group) {
    group = document.createElement("div");
    group.id = "roofLightPoseLayer";
    group.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:3";
    layer.before(group); group.append(layer);
  }
  const rect = document.getElementById("frame").getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const p = accessoryLighting.roof.count === 6 ? roofLightPoseSix : roofLightPose;
  // Rotate about the middle of the lamps, not the middle of the entire vehicle photo.
  group.style.transformOrigin = `${630 / 1584 * 100}% ${105.6 / 993 * 100}%`;
  group.style.transform = `translate(${p.x / 1584 * 100}%, ${p.y / 993 * 100}%) perspective(${600 * rect.width / 1584}px) rotateZ(${p.roll}deg) rotateY(${p.yaw}deg) rotateX(${p.pitch}deg)`;
}
