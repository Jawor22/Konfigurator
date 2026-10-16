/* Photo-space lighting: independent receivers, per-part silhouettes and contact shadows.
   All coordinates describe the existing 1584 x 993 photograph; accessory transforms stay untouched. */
(() => {
  const frame = document.getElementById("frame");
  const W = 1584, H = 993;
  const makeCanvas = () => Object.assign(document.createElement("canvas"), { width: W, height: H });
  const shadow = makeCanvas(), reflections = makeCanvas();
  for (const [canvas, id, z] of [[shadow, "accessoryCastShadows", 1], [reflections, "accessoryReflections", 8]]) {
    canvas.id = id; canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:${z}`;
    frame.append(canvas);
  }
  const silhouette = makeCanvas(), contact = makeCanvas(), tint = makeCanvas(), edge = makeCanvas();
  const silhouetteCtx = silhouette.getContext("2d", { willReadFrequently: true });
  const shadowCtx = shadow.getContext("2d"), reflectionCtx = reflections.getContext("2d");
  const boundsCache = new WeakMap();
  const polygon = points => {
    const path = new Path2D();
    points.forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y));
    path.closePath(); return path;
  };
  // Conservative receiver boundaries stay inside the truck silhouette, never on the studio background.
  const receivers = {
    roof: polygon([[452, 167], [485, 133], [607, 103], [836, 80], [1049, 75], [1082, 94], [1090, 213], [1003, 192], [846, 159], [802, 193], [505, 214]]),
    front: polygon([[477, 212], [820, 185], [852, 219], [830, 435], [858, 552], [815, 625], [449, 630], [429, 581], [443, 428]]),
    grille: polygon([[449, 577], [813, 575], [841, 621], [835, 738], [449, 746], [428, 699]]),
    bumper: polygon([[432, 708], [841, 701], [867, 750], [867, 811], [823, 840], [460, 840], [435, 809]]),
    side: polygon([[885, 232], [1085, 239], [1098, 630], [1063, 673], [976, 659], [919, 687], [878, 683], [873, 480]]),
    sill: polygon([[1029, 687], [1096, 676], [1263, 676], [1267, 727], [1268, 797], [1060, 818], [1040, 783]]),
    wheels: new Path2D()
  };
  receivers.wheels.ellipse(962, 789, 58, 86, -.12, 0, Math.PI * 2);
  receivers.wheels.ellipse(1303, 779, 32, 77, .08, 0, Math.PI * 2);
  const allReceivers = new Path2D();
  Object.values(receivers).forEach(path => allReceivers.addPath(path));
  const receiverMask = makeCanvas(), maskCtx = receiverMask.getContext("2d", { willReadFrequently: true });
  maskCtx.fill(allReceivers);
  const maskPixels = maskCtx.getImageData(0, 0, W, H);
  // Exclude partially covered boundary pixels as well, so blur cannot mark the background.
  for (let i = 3; i < maskPixels.data.length; i += 4) maskPixels.data[i] = maskPixels.data[i] === 255 ? 255 : 0;
  maskCtx.putImageData(maskPixels, 0, 0);
  const profiles = [
    { selector: "#roofBeaconLayer canvas[data-side]", zones: [["roof", 5, 8, 2.4, .23]], contact: .30, gloss: .065, lamp: true },
    { selector: "#kangur,#kangurCanvas", zones: [["front", 13, 17, 4.5, .17], ["grille", 9, 12, 3, .21], ["bumper", 5, 7, 2, .22]], contact: .21, gloss: .11 },
    { selector: "#roofImage,#roofCanvas", zones: [["roof", 6, 9, 2.5, .23]], contact: .26, gloss: .13 },
    { selector: "#sideImage,#sideCanvas", zones: [["side", 5, 8, 2.6, .19], ["sill", 4, 6, 2, .23]], contact: .26, gloss: .10 },
    { selector: "#bumperImage", zones: [["bumper", 4, 5, 1.8, .25]], contact: .29, gloss: .12 },
    { selector: "#bumperInImage,#bumperInCanvas", zones: [["grille", 4, 6, 1.8, .25], ["bumper", 3, 4, 1.5, .17]], contact: .30, gloss: .12 },
    { selector: "#skyledKangurLayer img", zones: [["front", 10, 13, 3.4, .20], ["grille", 7, 10, 2.7, .23]], contact: .29, gloss: .07, lamp: true },
    { selector: "#skyledRoofLayer img", zones: [["roof", 6, 9, 2.7, .24]], contact: .30, gloss: .07, lamp: true },
    { selector: "#skyledBumperInLayer img", zones: [["grille", 5, 7, 2.2, .25], ["bumper", 4, 5, 1.7, .18]], contact: .30, gloss: .07, lamp: true },
    { selector: "#airHornLayer", zones: [["roof", 7, 9, 2.6, .22], ["side", 5, 7, 2.2, .17]], contact: .20, gloss: 0 },
    { selector: "#windowDeflector", zones: [["side", 2, 4, 1.3, .18]], contact: .18, gloss: .035 },
    { selector: "#sunVisor", zones: [["front", 5, 9, 3.3, .18], ["roof", 3, 5, 2, .12]], contact: .20, gloss: .045 },
    { selector: "#wheelcapsCanvas", zones: [["wheels", 1.5, 2, .8, .17]], contact: .12, gloss: .065 }
  ];
  function visible(element) {
    if (element.hidden) return false;
    for (let node = element; node && node !== frame; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (node.hidden || style.display === "none" || style.visibility === "hidden") return false;
    }
    return element instanceof HTMLCanvasElement ? element.width > 0 : element.complete && element.naturalWidth > 0;
  }
  function alphaBounds(source) {
    const width = source.naturalWidth || source.width, height = source.naturalHeight || source.height;
    const key = `${source.currentSrc || "canvas"}:${width}:${height}`;
    const cached = boundsCache.get(source);
    if (cached?.key === key) return cached.bounds;
    const probe = document.createElement("canvas"), scale = Math.min(1, 360 / width);
    probe.width = Math.ceil(width * scale); probe.height = Math.ceil(height * scale);
    const ctx = probe.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(source, 0, 0, probe.width, probe.height);
    const pixels = ctx.getImageData(0, 0, probe.width, probe.height).data;
    let left = probe.width, top = probe.height, right = -1, bottom = -1;
    for (let y = 0; y < probe.height; y++) for (let x = 0; x < probe.width; x++) {
      if (pixels[(y * probe.width + x) * 4 + 3] < 8) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (right < 0) return null;
    const bounds = { x: Math.max(0, (left - 2) / scale), y: Math.max(0, (top - 2) / scale),
      right: Math.min(width, (right + 3) / scale), bottom: Math.min(height, (bottom + 3) / scale), width, height };
    boundsCache.set(source, { key, bounds }); return bounds;
  }
  function sceneMatrix(source, rect) {
    let matrix = new DOMMatrix();
    for (let node = source; node && node !== frame; node = node.parentElement) {
      const style = getComputedStyle(node), origin = style.transformOrigin.split(" ").map(parseFloat);
      const local = new DOMMatrix().translate(node.offsetLeft, node.offsetTop)
        .translate(origin[0] || 0, origin[1] || 0, origin[2] || 0)
        .multiply(new DOMMatrix(style.transform === "none" ? undefined : style.transform))
        .translate(-(origin[0] || 0), -(origin[1] || 0), -(origin[2] || 0));
      matrix = local.multiply(matrix);
    }
    return new DOMMatrix().scale(W / rect.width, H / rect.height).multiply(matrix);
  }
  function drawTriangle(ctx, source, src, dst) {
    const [a, b, c] = src, [p, q, r] = dst;
    const denominator = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    if (Math.abs(denominator) < 1e-8) return;
    const ax = ((q.x - p.x) * (c.y - a.y) - (r.x - p.x) * (b.y - a.y)) / denominator;
    const bx = ((q.y - p.y) * (c.y - a.y) - (r.y - p.y) * (b.y - a.y)) / denominator;
    const ay = ((r.x - p.x) * (b.x - a.x) - (q.x - p.x) * (c.x - a.x)) / denominator;
    const by = ((r.y - p.y) * (b.x - a.x) - (q.y - p.y) * (c.x - a.x)) / denominator;
    ctx.save(); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.lineTo(r.x, r.y); ctx.closePath(); ctx.clip();
    ctx.transform(ax, bx, ay, by, p.x - ax * a.x - ay * a.y, p.y - bx * a.x - by * a.y);
    ctx.drawImage(source, 0, 0); ctx.restore();
  }
  function projectSource(source, bounds, matrix) {
    silhouetteCtx.clearRect(0, 0, W, H);
    const points = [];
    const project = (x, y) => {
      const p = matrix.transformPoint(new DOMPoint(x / bounds.width * source.offsetWidth, y / bounds.height * source.offsetHeight));
      return { x: p.x / p.w, y: p.y / p.w };
    };
    // Subdivision retains the perspective of the saved CSS 3D adjustment.
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      const x0 = bounds.x + (bounds.right - bounds.x) * col / 3, x1 = bounds.x + (bounds.right - bounds.x) * (col + 1) / 3;
      const y0 = bounds.y + (bounds.bottom - bounds.y) * row / 3, y1 = bounds.y + (bounds.bottom - bounds.y) * (row + 1) / 3;
      const src = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
      const dst = src.map(p => project(p.x, p.y)); points.push(...dst);
      drawTriangle(silhouetteCtx, source, [src[0], src[1], src[2]], [dst[0], dst[1], dst[2]]);
      drawTriangle(silhouetteCtx, source, [src[0], src[2], src[3]], [dst[0], dst[2], dst[3]]);
    }
    return { left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)),
      top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) };
  }
  function tintSilhouette() {
    const ctx = tint.getContext("2d");
    ctx.clearRect(0, 0, W, H); ctx.drawImage(silhouette, 0, 0);
    ctx.globalCompositeOperation = "source-in"; ctx.fillStyle = "#10151d"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
  }
  function shadePart(profile, box) {
    tintSilhouette();
    const left = Math.max(0, Math.floor(box.left - 3)), top = Math.max(0, Math.floor(box.top - 3));
    const width = Math.min(W, Math.ceil(box.right + 3)) - left;
    const height = Math.min(H, Math.ceil(box.bottom + 3)) - top;
    if (width <= 0 || height <= 0) return;
    const drawPart = (ctx, source, dx = 0, dy = 0) => ctx.drawImage(source, left, top, width, height, left + dx, top + dy, width, height);
    const contactCtx = contact.getContext("2d");
    contactCtx.clearRect(0, 0, W, H); contactCtx.drawImage(tint, 0, 0);
    // Contact shading is confined to the mounting edge, not the entire object's outline.
    contactCtx.clearRect(0, 0, W, box.top + (box.bottom - box.top) * (profile.lamp ? .78 : .83));
    for (const [zone, dx, dy, blur, opacity] of profile.zones) {
      shadowCtx.save(); shadowCtx.clip(receivers[zone]);
      shadowCtx.globalAlpha = opacity; shadowCtx.filter = `blur(${blur}px)`; drawPart(shadowCtx, tint, dx, dy);
      shadowCtx.globalAlpha = profile.contact; shadowCtx.filter = "blur(.75px)"; drawPart(shadowCtx, contact, 1.1, 1.7);
      shadowCtx.restore();
    }
    if (!profile.gloss) return;
    const ctx = edge.getContext("2d");
    ctx.clearRect(0, 0, W, H); ctx.drawImage(silhouette, 0, 0);
    ctx.globalCompositeOperation = "destination-out"; ctx.drawImage(silhouette, 1, 1.25);
    ctx.globalCompositeOperation = "source-in";
    const gradient = ctx.createLinearGradient(box.left, box.top, box.right, box.bottom);
    gradient.addColorStop(0, "#fff7e5"); gradient.addColorStop(.65, "#cbd7e4"); gradient.addColorStop(1, "#8193a4");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
    reflectionCtx.save(); reflectionCtx.globalAlpha = profile.gloss; drawPart(reflectionCtx, edge); reflectionCtx.restore();
  }
  let pending = null;
  function render() {
    pending = null;
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const start = performance.now();
    shadowCtx.clearRect(0, 0, W, H); reflectionCtx.clearRect(0, 0, W, H);
    let parts = 0;
    for (const profile of profiles) for (const source of frame.querySelectorAll(profile.selector)) {
      if (!visible(source)) continue;
      try {
        const bounds = alphaBounds(source); if (!bounds) continue;
        const box = projectSource(source, bounds, sceneMatrix(source, rect));
        shadePart(profile, box); parts++;
      } catch (error) {
        console.warn("Accessory lighting unavailable for", source.id || source.parentElement.id, error);
      }
    }
    // Clip again after blur: no soft shadow or reflection may spill into the photographic background.
    shadowCtx.save(); shadowCtx.globalCompositeOperation = "destination-in";
    shadowCtx.drawImage(receiverMask, 0, 0); shadowCtx.restore();
    reflections.dataset.parts = String(parts);
    reflections.dataset.renderMs = String(Math.round(performance.now() - start));
  }
  function schedule() { if (pending === null) pending = requestAnimationFrame(render); }
  const observer = new MutationObserver(records => {
    let dirty = false;
    for (const record of records) {
      if ([shadow, reflections].includes(record.target)) continue;
      if (record.target instanceof HTMLCanvasElement) boundsCache.delete(record.target);
      dirty = true;
    }
    if (dirty) schedule();
  });
  observer.observe(frame, { subtree: true, childList: true, attributes: true,
    attributeFilter: ["class", "style", "src", "hidden", "width", "height", "data-rotation", "data-finish", "data-model"] });
  frame.addEventListener("load", schedule, true);
  new ResizeObserver(schedule).observe(frame);
  schedule();
  window.accessoryStudioLighting = { refresh: schedule, receivers, profiles,
    renderNow() { if (pending !== null) cancelAnimationFrame(pending); render(); } };
})();
