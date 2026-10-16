/* Procedural solid geometry with a generated front-plate material, projected and lit in 3D. */
const HADLEY_FACE_TEXTURE_URL = new URL("hadley-front-material.png", document.currentScript.src).href;
class AirHornModel3D {
  constructor(shape = 'round') {
    this.shape = shape;
    this.faces = [];
    this.texture = new Image();
    this.texture.onload = () => {
      if (typeof applyAirHornPose === "function") applyAirHornPose();
    };
    this.texture.src = HADLEY_FACE_TEXTURE_URL;
    if (shape === 'round') {
    // A hollow flared bell with a rolled rim, a separate tube and rear air chamber.
    this.lathe([[-42, 14.8], [-41.5, 15.7], [-40.5, 15.8], [-39.5, 15],
      [-34, 11.3], [-27, 7.4], [-18, 4.6], [-8, 2.8], [0, 2.5]], "shell");
    this.lathe([[-41.8, 14.7], [-38, 12.7], [-32, 9.2], [-24, 5.8],
      [-15, 3.2], [-7, 1.5], [-6, 0]], "inside");
    this.lathe([[-1, 2.5], [0, 3.5], [3, 3.5], [4, 2.4], [85, 2.4],
      [86, 5.5], [89, 6.8], [96, 6.8], [99, 5.5], [100, 3.5], [100, 0]], "shell");
    } else {
    // Same attachment centers, length and scene pose; rectangular Hadley-style bell and rear chamber.
    this.rectangularBody([[-42, 12, 20], [-40, 12, 20], [-37, 10.5, 18], [-15, 2.6, 2.6]]);
    this.faces.push({ vertices: [[-42.1, -12, -20], [-42.1, -12, 20], [-42.1, 12, 20], [-42.1, 12, -20]], material: "plate", texture: true });
    this.lathe([[-15, 2.6], [0, 2.5], [85, 2.5], [92, 3.1]], "shell");
    this.rectangularBody([[91, 3.5, 4], [94, 7, 9], [99, 7, 9], [100, 6.5, 8.5]]);
    this.faces.push({ vertices: [[100, -6.5, -8.5], [100, 6.5, -8.5], [100, 6.5, 8.5], [100, -6.5, 8.5]], material: "shell" });
    }
    for (const x of shape === "round" ? [2, 85] : []) {
      this.lathe([[x - 1.5, 2.5], [x - 1.5, 4], [x + 1.5, 4], [x + 1.5, 2.5]], "shell");
      this.rod([x, 0, -2.5], [x + 17, -8, -13], 1.4);
    }
  }
  rectangularBody(sections) {
    const corners = ([x, h, w]) => [[x, -h, -w], [x, h, -w], [x, h, w], [x, -h, w]];
    for (let row = 0; row < sections.length - 1; row++) {
      const a = corners(sections[row]), b = corners(sections[row + 1]);
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        this.faces.push({ vertices: [a[i], b[i], b[next], a[next]].reverse(), material: "shell" });
      }
    }
  }
  lathe(profile, material) {
    const sides = 64;
    const point = (section, angle) => [section[0], Math.cos(angle) * section[1], Math.sin(angle) * section[1]];
    for (let row = 0; row < profile.length - 1; row++) {
      for (let i = 0; i < sides; i++) {
        const a = i * Math.PI * 2 / sides, b = (i + 1) * Math.PI * 2 / sides;
        const vertices = [point(profile[row], a), point(profile[row + 1], a),
          point(profile[row + 1], b), point(profile[row], b)];
        this.faces.push({ vertices: material === "inside" ? vertices : vertices.reverse(), material });
      }
    }
  }
  rod(start, end, radius) {
    const axis = end.map((n, i) => n - start[i]);
    const length = Math.hypot(...axis), u = axis.map(n => n / length);
    const vLength = Math.hypot(u[0], u[1]);
    const v = [-u[1] / vLength, u[0] / vLength, 0];
    const w = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const ring = (center, a) => center.map((n, i) => n + radius * (v[i] * Math.cos(a) + w[i] * Math.sin(a)));
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8, b = (i + 1) * Math.PI / 8;
      this.faces.push({ vertices: [ring(start, a), ring(end, a), ring(end, b), ring(start, b)], material: "mount" });
    }
  }
  draw(canvas, pose, rotation, finish) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(rect.width * ratio), height = Math.round(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(width / 1584, 0, 0, height / 993, 0, 0);
    ctx.clearRect(0, 0, 1584, 993);
    const rad = Math.PI / 180;
    const yaw = (24 + pose.yaw + rotation.yaw) * rad;
    const pitch = (pose.pitch + rotation.pitch) * rad;
    const roll = (pose.angle + rotation.roll) * rad;
    const scale = pose.scale / 100;
    const transform = point => {
      let [x, y, z] = point;
      x *= scale * pose.width / 100; y *= scale * pose.height / 100; z *= scale * pose.height / 100;
      const py = y * Math.cos(pitch) - z * Math.sin(pitch);
      z = y * Math.sin(pitch) + z * Math.cos(pitch); y = py;
      const px = x * Math.cos(yaw) + z * Math.sin(yaw);
      z = -x * Math.sin(yaw) + z * Math.cos(yaw); x = px;
      return [x * Math.cos(roll) - y * Math.sin(roll), x * Math.sin(roll) + y * Math.cos(roll), z];
    };
    const project = ([x, y, z]) => {
      const factor = pose.depth / Math.max(60, pose.depth - z);
      return [920 + pose.x + x * factor, 100 + pose.y + y * factor];
    };
    const faces = this.faces.map(face => {
      const vertices = face.vertices.map(transform);
      return { ...face, vertices, depth: vertices.reduce((sum, p) => sum + p[2], 0) / vertices.length };
    }).sort((a, b) => a.depth - b.depth);
    const path = points => {
      ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    };
    for (const face of faces) {
      const [a, b, c] = face.vertices;
      const u = b.map((n, i) => n - a[i]), v = c.map((n, i) => n - a[i]);
      let normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const length = Math.hypot(...normal) || 1; normal = normal.map(n => n / length);
      if (face.material !== "mount" && normal[2] <= 0) continue;
      if (normal[2] < 0) normal = normal.map(n => -n);
      const light = Math.max(0, -.3 * normal[0] - .65 * normal[1] + .7 * normal[2]);
      // Reflected studio strips follow surface normals as the actual geometry rotates.
      const reflectedY = 2 * normal[2] * (.55 * normal[0] + .83 * normal[1]);
      const strip = Math.exp(-Math.pow((reflectedY + .52) / .16, 2));
      const darkStrip = Math.exp(-Math.pow((reflectedY - .12) / .19, 2));
      let value = 90 + 115 * light + 82 * strip - 95 * darkStrip;
      if (face.material === "inside") value = 8 + 25 * light + 10 * strip;
      else if (finish === "black" && face.material !== "mount") value = 13 + 22 * light + 32 * strip;
      value = Math.max(8, Math.min(250, value));
      const color = `rgb(${Math.round(value * .96)},${Math.round(value * .985)},${Math.round(Math.min(255, value * 1.025))})`;
      path(face.vertices.map(project)); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = .22;
      ctx.fill(); ctx.stroke();
      if (face.texture && this.texture.complete && this.texture.naturalWidth) {
        const points = face.vertices.map(project);
        for (const indices of [[0, 1, 2], [0, 2, 3]]) {
          const [p0, p1, p2] = indices.map(index => points[index]);
          ctx.save(); path([p0, p1, p2]); ctx.clip();
          const axisX = indices[1] === 1 ? [p1[0] - p0[0], p1[1] - p0[1]] : [p1[0] - p2[0], p1[1] - p2[1]];
          const axisY = indices[1] === 1 ? [p2[0] - p1[0], p2[1] - p1[1]] : [p2[0] - p0[0], p2[1] - p0[1]];
          ctx.transform(axisX[0], axisX[1], axisY[0], axisY[1], p0[0], p0[1]);
          if (finish === "black") ctx.filter = "grayscale(1) brightness(.38)";
          ctx.drawImage(this.texture, 0, 0, 1, 1); ctx.restore();
        }
      }
    }
    // Keep the original antenna in front of the accessory without modifying its photo.
    ctx.save(); ctx.globalCompositeOperation = "destination-out";
    path([[895.7, 80], [899.1, 80], [903, 143], [898.2, 143]]); ctx.fill(); ctx.restore();
    canvas.dataset.faces = this.faces.length;
    canvas.dataset.rotation = JSON.stringify(rotation);
    canvas.dataset.finish = finish;
    canvas.dataset.model = this.shape;
    canvas.dataset.textureReady = String(this.texture.complete && this.texture.naturalWidth > 0);
  }
}
