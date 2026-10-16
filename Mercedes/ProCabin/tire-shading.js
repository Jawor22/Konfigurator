// A masked texture correction; wheel rims, paint and vehicle geometry stay untouched.
let tireShadingTicket = 0;
let tireShadingMask = null;
const tireShadingCache = new Map();

function getTireShadingMask() {
  if (tireShadingMask) return tireShadingMask;
  const canvas = document.createElement("canvas");
  canvas.width = 1584; canvas.height = 993;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const mask = new Path2D();
  for (const wheel of [
    { x: 962, y: 789, rx: 78, ry: 119, innerX: 52, innerY: 82, innerYShift: 0, angle: -.12 },
    { x: 1303, y: 779, rx: 44, ry: 99, innerX: 31, innerY: 70, innerYShift: 8, angle: .08 }
  ]) {
    const ring = new Path2D();
    ring.ellipse(wheel.x, wheel.y, wheel.rx, wheel.ry, wheel.angle, 0, Math.PI * 2);
    ring.moveTo(wheel.x + wheel.innerX * Math.cos(wheel.angle), wheel.y + wheel.innerYShift + wheel.innerX * Math.sin(wheel.angle));
    ring.ellipse(wheel.x, wheel.y + wheel.innerYShift, wheel.innerX, wheel.innerY, wheel.angle, 0, Math.PI * 2, true);
    mask.addPath(ring);
  }
  const hiddenWheel = [[456, 831], [466, 861], [490, 889], [517, 902], [550, 907], [578, 896], [603, 875], [610, 850], [594, 846], [587, 865], [568, 881], [547, 885], [522, 879], [502, 861], [493, 839]];
  hiddenWheel.forEach(([x, y], index) => index ? mask.lineTo(x, y) : mask.moveTo(x, y));
  mask.closePath();
  context.filter = "blur(1px)";
  context.fill(mask, "evenodd");
  tireShadingMask = context.getImageData(0, 0, 1584, 993).data;
  return tireShadingMask;
}

async function updateTireShading() {
  const ticket = ++tireShadingTicket;
  const truck = document.getElementById("truck");
  let canvas = document.getElementById("tireShading");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "tireShading";
    canvas.width = 1584; canvas.height = 993;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1";
    truck.after(canvas);
  }
  // Reset the bitmap: clearRect cannot recover a previously tainted canvas.
  canvas.width = 1584;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.clearRect(0, 0, canvas.width, canvas.height);
  const src = truck.getAttribute("src");
  try {
    const image = await imgLoad(src);
    if (ticket !== tireShadingTicket) return;
    let pixels = tireShadingCache.get(src);
    if (!pixels) {
      context.drawImage(image, 0, 0, 1584, 993);
      pixels = context.getImageData(0, 0, 1584, 993);
      const mask = getTireShadingMask();
      for (let i = 0; i < pixels.data.length; i += 4) {
        const lightness = .2126 * pixels.data[i] + .7152 * pixels.data[i + 1] + .0722 * pixels.data[i + 2];
        const pixel = i / 4, x = pixel % 1584, y = Math.floor(pixel / 1584);
        // The step sits immediately beside the front tire; protect it separately from rubber highlights.
        const step = x < 900 && y > 710 && y < 828 && lightness > 170;
        const shade = 92 * (1 - Math.exp(-lightness / 110));
        for (let channel = 0; channel < 3; channel++) {
          pixels.data[i + channel] = shade;
        }
        pixels.data[i + 3] = step ? 0 : mask[i + 3];
      }
      if (tireShadingCache.size >= 2) tireShadingCache.delete(tireShadingCache.keys().next().value);
      tireShadingCache.set(src, pixels);
    }
    context.putImageData(pixels, 0, 0);
    setImageError("tires");
  } catch {
    if (ticket === tireShadingTicket) setImageError("tires", "Nie udało się wczytać wykończenia opon.");
  }
}
