const KANGUR_POSE_KEY = "actros-kangur-pose-v1";
const KANGUR_POSE_FIELDS = [
  ["x", "Pozycja lewo / prawo", -150, 150, 1, 0, " px"],
  ["y", "Pozycja góra / dół", -150, 150, 1, 0, " px"],
  ["yaw", "Obrót w Twoją stronę", -45, 45, .5, 0, "°"],
  ["pitch", "Pochylenie góra / dół", -40, 40, .5, 0, "°"],
  ["roll", "Nachylenie lewo / prawo", -20, 20, .5, 0, "°"],
  ["scale", "Rozmiar", 70, 140, 1, 100, "%"],
  ["width", "Szerokość", 70, 140, 1, 100, "%"],
  ["height", "Wysokość", 70, 140, 1, 100, "%"]
];
function normalizeKangurPose(value = {}) {
  return Object.fromEntries(KANGUR_POSE_FIELDS.map(([key, , min, max, , fallback]) => {
    const number = value && typeof value[key] === "number" && Number.isFinite(value[key]) ? value[key] : fallback;
    return [key, Math.max(min, Math.min(max, number))];
  }));
}
const kangurPose = freezeAccessoryPose(KANGUR_POSE_KEY, normalizeKangurPose);
const kangurPoseGroup = document.createElement("div");
kangurPoseGroup.id = "kangurPoseLayer";
kangurPoseGroup.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:2";
document.getElementById("kangur").before(kangurPoseGroup);
for (const id of ["kangur", "kangurCanvas", "kangurLightsLayer", "skyledKangurLayer"]) {
  kangurPoseGroup.append(document.getElementById(id));
}
function applyKangurPose() {
  const rect = document.getElementById("frame").getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const p = kangurPose;
  kangurPoseGroup.style.transformOrigin = `${560 / 1584 * 100}% ${660 / 993 * 100}%`;
  kangurPoseGroup.style.transform = `translate(${p.x / 1584 * 100}%, ${p.y / 993 * 100}%) perspective(${700 * rect.width / 1584}px) rotateZ(${p.roll}deg) rotateY(${p.yaw}deg) rotateX(${p.pitch}deg) scale(${p.scale / 100 * p.width / 100},${p.scale / 100 * p.height / 100})`;
}
new ResizeObserver(applyKangurPose).observe(document.getElementById("frame"));
applyKangurPose();
