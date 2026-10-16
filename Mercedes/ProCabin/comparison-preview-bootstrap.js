// Explicit local export reads only configurator mounting settings from this document's origin.
if (location.hash === "#capture-mounting") {
  const storage = {};
  for (let i=0;i<localStorage.length;i++) {
    const key=localStorage.key(i);
    if (key && /^actros-(air-horn|rectangular-horn|roof-beacons|roof-light-pose|kangur|bumper-in-light-pose)/.test(key)) storage[key]=localStorage.getItem(key);
  }
  document.addEventListener("DOMContentLoaded", () => {
    const dialog=document.createElement("dialog");
    dialog.style.cssText="max-width:520px;padding:28px;background:#20231d;color:#eee9df;border:1px solid #c3ab7b;border-radius:10px";
    dialog.innerHTML='<h2>Ustawienia montażu</h2><p>Zapisz pozycje z działającego konfiguratora i przekaż plik do przeniesienia na stronę.</p><button type="button" style="padding:14px;background:#c3ab7b;border:0;border-radius:6px;cursor:pointer">Pobierz ustawienia montażu</button>';
    dialog.querySelector("button").onclick=()=>{
      const blob=new Blob([JSON.stringify({storage},null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob),link=document.createElement("a");
      link.href=url;link.download="ustawienia-montazu.json";link.click();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
    };
    document.body.append(dialog);dialog.showModal();
  });
}
// Comparison uses the real configurator in an isolated frame with memory-only storage.
// This runs before any renderer reads or freezes its saved mounting coordinates.
(() => {
  if (new URLSearchParams(location.search).get("compare-preview") !== "1") return;
  let payload;
  try {
    // Browsers can clear window.name on navigation between local file documents.
    payload = JSON.parse(location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : window.name);
    if (!payload || typeof payload.token !== "string" || !payload.state || typeof payload.state !== "object") throw new Error("Niepoprawny projekt.");
    const original = window.localStorage, data = new Map();
    const keys = ["actros-air-horn-pose-v1", "actros-air-horn-frozen-pose-v1", "actros-air-horn-solid-rotation-v1",
      "actros-air-horn-frozen-solid-rotation-v1", "actros-rectangular-horn-pose-v1", "actros-rectangular-horn-frozen-pose-v1",
      "actros-roof-light-pose-v1:frozen", "actros-kangur-light-pose-v1:frozen", "actros-kangur-pose-v1:frozen",
      "actros-bumper-in-light-pose-v1:frozen", "actros-kangur-lamp-size-v1:frozen"];
    for (const key of keys) {
      try { const value = original.getItem(key); if (value !== null) data.set(key, value); } catch {}
    }
    const seed = (key, value) => { if (value !== undefined) data.set(key, JSON.stringify(value)); };
    const s = payload.state;
    seed("actros-air-horn-frozen-pose-v1", s.airHornPose);
    seed("actros-air-horn-frozen-solid-rotation-v1", s.airHornRotation);
    seed("actros-rectangular-horn-frozen-pose-v1", s.rectangularHornPose);
    seed("actros-roof-light-pose-v1:frozen", s.roofLightPose);
      seed("actros-roof-light-pose-v1:six", s.roofLightPoseSix || s.roofLightPose);
    seed("actros-kangur-light-pose-v1:frozen", s.kangurLightPose);
    seed("actros-kangur-pose-v1:frozen", s.kangurPose);
    seed("actros-bumper-in-light-pose-v1:frozen", s.bumperInLightPose);
    seed("actros-kangur-lamp-size-v1:frozen", s.kangurLampSize);
    seed("actros-roof-beacons-v1", s.roofBeacons);
    data.set("actros-air-horn-shape-v1", s.airHornShape === "rectangular" ? "rectangular" : "round");
    data.set("actros-air-horn-finish-v1", s.airHornFinish === "black" ? "black" : "chrome");
    const memory = {
      getItem: key => data.has(String(key)) ? data.get(String(key)) : null,
      setItem: (key, value) => data.set(String(key), String(value)),
      removeItem: key => data.delete(String(key)), clear: () => data.clear(),
      key: index => [...data.keys()][index] ?? null,
      get length() { return data.size; }
    };
    Object.defineProperty(window, "localStorage", { value: memory, configurable: false });
    if (window.localStorage !== memory) throw new Error("Nie udało się odizolować podglądu.");
    window.configurationPreview = payload;
    document.documentElement.classList.add("comparison-preview");
    window.name = "";
  } catch (error) {
    parent.postMessage({ type: "project-preview-error", token: payload?.token, message: error.message }, "*");
    window.stop();
  }
})();
