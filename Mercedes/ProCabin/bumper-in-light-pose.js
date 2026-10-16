const BUMPER_IN_LIGHT_POSE_KEY = "actros-bumper-in-light-pose-v1";
const BUMPER_IN_LIGHT_FIELDS = [
  ["x", "Pozycja lewo / prawo", -120, 120, 0, " px"],
  ["y", "Pozycja góra / dół", -100, 100, 0, " px"],
  ["scale", "Rozmiar reflektorów", 50, 180, 100, "%"]
];
function normalizeBumperInLightPose(value = {}) {
  return Object.fromEntries(BUMPER_IN_LIGHT_FIELDS.map(([key, , min, max, fallback]) => {
    const number = value && typeof value[key] === "number" && Number.isFinite(value[key]) ? value[key] : fallback;
    return [key, Math.max(min, Math.min(max, number))];
  }));
}
const bumperInLightPose = freezeAccessoryPose(BUMPER_IN_LIGHT_POSE_KEY, normalizeBumperInLightPose);
function applyBumperInLightPose() {
  document.querySelectorAll("#skyledBumperInLayer img").forEach(lamp => {
    if (lamp.hidden || !lamp.dataset.mountX) return;
    lamp.style.left = (Number(lamp.dataset.mountX) + bumperInLightPose.x) / 1584 * 100 + "%";
    lamp.style.top = (704 + bumperInLightPose.y) / 993 * 100 + "%";
    lamp.style.width = 3.12 * bumperInLightPose.scale / 100 * longRangeLampScale("bumperIn") + "%";
  });
}
