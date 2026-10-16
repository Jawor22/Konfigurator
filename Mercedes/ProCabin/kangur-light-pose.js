const KANGUR_LIGHT_POSE_KEY = "actros-kangur-light-pose-v1";
const KANGUR_LIGHT_POSE_FIELDS = ROOF_LIGHT_POSE_FIELDS;
const normalizeKangurLightPose = normalizeRoofLightPose;
const kangurLightPose = freezeAccessoryPose(KANGUR_LIGHT_POSE_KEY, normalizeKangurLightPose);
function normalizeKangurLampSize(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(70, Math.min(180, value)) : 100;
}
const kangurLampSize = (() => {
  try {
    const frozen = localStorage.getItem("actros-kangur-lamp-size-v1:frozen");
    const size = normalizeKangurLampSize(JSON.parse(frozen || localStorage.getItem("actros-kangur-lamp-size-v1") || "100"));
    if (!frozen) localStorage.setItem("actros-kangur-lamp-size-v1:frozen", JSON.stringify(size));
    return size;
  } catch { return 100; }
})();
function applyKangurLampSize() {
  document.querySelectorAll("#skyledKangurLayer img").forEach(lamp => {
    lamp.style.width = 6.4 * kangurLampSize / 100 * longRangeLampScale("kangur") + "%";
  });
}
function applyKangurLightPose() {
  const layer = document.getElementById("skyledKangurLayer");
  let group = document.getElementById("kangurLightPoseLayer");
  if (!group) {
    group = document.createElement("div"); group.id = "kangurLightPoseLayer";
    group.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:1";
    layer.before(group); group.append(layer);
  }
  const rect = document.getElementById("frame").getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  // Preserve the original mounting transform and rotate around the center of either set.
  const matrix = new DOMMatrix(getComputedStyle(layer).transform);
  const center = matrix.transformPoint(new DOMPoint((620 / 1584 - .5) * rect.width, (486 / 993 - .5) * rect.height));
  group.style.transformOrigin = `${rect.width / 2 + center.x}px ${rect.height / 2 + center.y}px`;
  const p = kangurLightPose;
  group.style.transform = `translate(${p.x / 1584 * 100}%, ${p.y / 993 * 100}%) perspective(${600 * rect.width / 1584}px) rotateZ(${p.roll}deg) rotateY(${p.yaw}deg) rotateX(${p.pitch}deg)`;
}
