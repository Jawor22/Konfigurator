// Paint is rendered from the original photo, without moving or regenerating any vehicle pixels.
const TRUCK_PAINTS = Object.freeze({
  zolty: { name: "Delikatny żółty", rgb: [243, 229, 172] },
  rozowy: { name: "Pudrowy róż", rgb: [231, 194, 204] },
  grafitowy: { name: "Ciemny szary", rgb: [69, 73, 79] },
  pomaranczowy: { name: "Pomarańczowy", rgb: [245, 135, 49] }
});
const truckPaintCache = new Map();
let truckPaintSource = null;
let truckPaintTicket = 0;

function updateTruckColorName() {
  const selected = document.querySelector(".color-btn.active");
  const label = document.getElementById("truckColorName");
  if (label) label.textContent = TRUCK_PAINTS[selected?.dataset.color]?.name || selected?.getAttribute("aria-label") || "Srebrny";
}

function loadTruckPaintSource() {
  if (!truckPaintSource) {
    truckPaintSource = Promise.all([imgLoad(FILES.truck.srebrny), imgLoad(FILES.truck.zielony)]).then(([silver, green]) => {
      if (silver.naturalWidth !== green.naturalWidth || silver.naturalHeight !== green.naturalHeight) throw new Error("Niezgodny rozmiar wzorca lakieru.");
      const canvas = document.createElement("canvas");
      canvas.width = silver.naturalWidth; canvas.height = silver.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(silver, 0, 0);
      const original = context.getImageData(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Recover soft lighting and local reflections from the same photograph.
      context.filter = `blur(${silver.naturalWidth / 220}px)`;
      context.drawImage(silver, 0, 0);
      const soft = context.getImageData(0, 0, canvas.width, canvas.height).data;
      context.filter = "none";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(green, 0, 0);
      const reference = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const mask = new Float32Array(canvas.width * canvas.height);
      const surfaceLight = new Float32Array(mask.length);
      for (let pixel = 0; pixel < mask.length; pixel++) {
        const i = pixel * 4;
        const dominance = reference[i + 1] - Math.max(reference[i], reference[i + 2]);
        const brightness = (original.data[i] + original.data[i + 1] + original.data[i + 2]) / 3;
        const chroma = Math.max(original.data[i], original.data[i + 1], original.data[i + 2]) - Math.min(original.data[i], original.data[i + 1], original.data[i + 2]);
        // Saturated green identifies painted panels; the original photo protects dark trim and colored badges.
        if (dominance > 5 && brightness > 48 && chroma < 42) mask[pixel] = Math.min(1, (dominance - 5) / 18);
        const originalLight = .2126 * original.data[i] + .7152 * original.data[i + 1] + .0722 * original.data[i + 2];
        const softLight = .2126 * soft[i] + .7152 * soft[i + 1] + .0722 * soft[i + 2];
        surfaceLight[pixel] = Math.max(-12, Math.min(24, originalLight - softLight));
      }
      return { original, mask, surfaceLight, width: canvas.width, height: canvas.height };
    }).catch(error => { truckPaintSource = null; throw error; });
  }
  return truckPaintSource;
}

async function renderTruckPaint(color) {
  const source = await loadTruckPaintSource();
  const { original, mask, surfaceLight, width, height } = source;
  const output = new ImageData(new Uint8ClampedArray(original.data), width, height);
  const rgb = TRUCK_PAINTS[color].rgb;
  for (let pixel = 0; pixel < mask.length; pixel++) {
    let alpha = mask[pixel];
    if (!alpha) continue;
    const i = pixel * 4;
    const target = rgb;
    const brightness = .2126 * original.data[i] + .7152 * original.data[i + 1] + .0722 * original.data[i + 2];
    const diffuse = Math.pow(brightness / 220, 1.16);
    const paintLightness = .2126 * target[0] + .7152 * target[1] + .0722 * target[2];
    const clearcoat = .4 + (1 - paintLightness / 255) * .6;
    const reflection = Math.pow(Math.max(0, (brightness - 176) / 79), 3) * 90 * clearcoat;
    const detail = surfaceLight[pixel] * (surfaceLight[pixel] > 0 ? .65 : .28);
    for (let channel = 0; channel < 3; channel++) {
      const painted = Math.max(0, Math.min(255, target[channel] * diffuse + reflection + detail));
      output.data[i + channel] = original.data[i + channel] * (1 - alpha) + painted * alpha;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  canvas.getContext("2d").putImageData(output, 0, 0);
  return canvas.toDataURL("image/png");
}

async function updateTruckPaint(color) {
  const ticket = ++truckPaintTicket;
  updateTruckColorName();
  setImageError("truckPaint");
  if (!Object.hasOwn(TRUCK_PAINTS, color)) {
    document.querySelector(".colors-panel").removeAttribute("aria-busy");
    document.getElementById("truck").src = FILES.truck[color] || FILES.truck.srebrny;
    return;
  }
  const panel = document.querySelector(".colors-panel");
  panel.setAttribute("aria-busy", "true");
  try {
    if (!truckPaintCache.has(color)) truckPaintCache.set(color, renderTruckPaint(color).catch(error => { truckPaintCache.delete(color); throw error; }));
    const src = await truckPaintCache.get(color);
    await imgLoad(src);
    if (ticket !== truckPaintTicket) return;
    document.getElementById("truck").src = src;
    updateWheelcaps();
  } catch (error) {
    if (ticket === truckPaintTicket) setImageError("truckPaint", "Nie udało się przygotować lakieru. Wybierz kolor ponownie.");
  } finally {
    if (ticket === truckPaintTicket) panel.removeAttribute("aria-busy");
  }
}
