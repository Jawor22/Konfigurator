const FRONT_SNOW_CHAIN_IMAGE = new URL("front-wheel-ladder-chain-full.png", document.currentScript.src).href;
// Original photo from ENA Truck's ROTACHAIN product gallery (product 19025).
const AUTOMATIC_CHAIN_PHOTO = new URL("automatic-snow-chains.jpg", document.currentScript.src).href;

function openAutomaticChainsPreview() {
  let dialog = document.getElementById("automaticChainsDialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "automaticChainsDialog"; dialog.className = "winter-chain-preview";
    dialog.setAttribute("aria-labelledby", "automaticChainsTitle");
    dialog.innerHTML = `<div class="winter-chain-preview-heading"><div><p class="winter-chain-preview-kicker">NA ZIMĘ / ŁAŃCUCHY</p><h2 id="automaticChainsTitle">Łańcuchy automatyczne</h2></div><button type="button" class="winter-chain-preview-close" aria-label="Zamknij podgląd">×</button></div><figure class="winter-chain-preview-frame"><img width="1024" height="641" alt="Automatyczne łańcuchy zamontowane pod podwoziem ciężarówki"><figcaption>Przykładowy montaż łańcuchów automatycznych</figcaption></figure><p class="winter-chain-preview-error" role="status" hidden>Nie udało się wczytać zdjęcia. Odśwież stronę i spróbuj ponownie.</p>`;
    const image = dialog.querySelector("img"); image.decoding = "async";
    image.onerror = () => { image.hidden = true; dialog.querySelector(".winter-chain-preview-error").hidden = false; };
    image.src = AUTOMATIC_CHAIN_PHOTO;
    dialog.querySelector("button").onclick = () => dialog.close();
    dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
    document.body.append(dialog);
  }
  dialog.showModal();
}
let frontSnowChainsEnabled = false;
// Retain the existing save key; the accessory now mounts on the rear wheel.
function rearChainAssembly() {
  let pose = document.getElementById("rearSnowChainPose");
  if (pose) return pose;
  const layer = document.createElement("div"); layer.id = "rearSnowChainAssembly";
  layer.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:2";
  const outline = [[1293,685],[1311,686],[1328,710],[1340,747],[1348,808],
    [1341,853],[1326,878],[1302,885],[1268,882],[1223,879],[1188,871],
    [1180,841],[1187,820],[1249,820],[1257,805],[1258,740],[1272,704]];
  layer.style.clipPath = `polygon(${outline.map(([x,y])=>`${x/1584*100}% ${y/993*100}%`).join(",")})`;
  pose = document.createElement("div"); pose.id = "rearSnowChainPose";
  // Map the old tire's local axes (-.12 rad) onto the rear tire's axes (.08 rad),
  // using the measured radius ratios 44/78 and 99/119. Percentage translations
  // retain exact mounting coordinates at every preview size.
  const sx=44/78,sy=99/119,cf=Math.cos(.12),sf=Math.sin(.12),cr=Math.cos(.08),sr=Math.sin(.08);
  const a=cr*sx*cf-sr*sy*sf,b=sr*sx*cf+cr*sy*sf;
  const c=-cr*sx*sf-sr*sy*cf,d=-sr*sx*sf+cr*sy*cf;
  pose.style.cssText = `position:absolute;inset:0;transform-origin:0 0;transform:translate(${1303/1584*100}%,${779/993*100}%) matrix(${a},${b},${c},${d},0,0) translate(${-962/1584*100}%,${-789/993*100}%)`;
  layer.append(pose); document.getElementById("frame").append(layer);
  return pose;
}

function drawFrontChainTread(image) {
  let canvas = document.getElementById("frontSnowChainTread");
  if (!canvas) {
    canvas = document.createElement("canvas"); canvas.id = "frontSnowChainTread";
    canvas.width = 1584; canvas.height = 993;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2";
    image.before(canvas);
  }
  canvas.hidden = image.hidden;
  if (canvas.hidden) return;
  const ctx = canvas.getContext("2d"); ctx.clearRect(0,0,1584,993);
  ctx.save();
  function chain(points) {
    const segments = points.slice(1).map((p,i)=>({a:points[i],b:p,length:Math.hypot(p[0]-points[i][0],p[1]-points[i][1])}));
    const total = segments.reduce((sum,s)=>sum+s.length,0);
    for(let distance=1,index=0;distance<total;distance+=5.8,index++) {
      let remaining=distance,segment=segments[0];
      for(const part of segments){segment=part;if(remaining<=part.length)break;remaining-=part.length;}
      const t=Math.min(1,remaining/segment.length);
      const x=segment.a[0]+(segment.b[0]-segment.a[0])*t;
      const y=segment.a[1]+(segment.b[1]-segment.a[1])*t;
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(segment.b[1]-segment.a[1],segment.b[0]-segment.a[0]));
      const height=index%2?1.9:3.6;
      ctx.beginPath();ctx.roundRect(-3.8,-height/2,7.6,height,.9);
      ctx.shadowColor="rgba(0,0,0,.7)";ctx.shadowBlur=.8;ctx.shadowOffsetX=.35;ctx.shadowOffsetY=.65;
      ctx.strokeStyle="#111413";ctx.lineWidth=1.8;ctx.stroke();
      ctx.shadowColor="transparent";
      const metal=ctx.createLinearGradient(0,-height/2,0,height/2);
      metal.addColorStop(0,"#686b67");metal.addColorStop(.28,"#454844");
      metal.addColorStop(.65,"#242723");metal.addColorStop(1,"#454743");
      ctx.strokeStyle=metal;ctx.lineWidth=1.05;ctx.stroke();ctx.restore();
    }
  }
  // Rear dual-tire tread is wider than the front tread; extend the far return
  // under the side panel. The rear assembly's contour handles body occlusion.
  chain([[791,837],[798,857],[811,876],[835,893],[874,904],[917,906]]);
  chain([[792,839],[822,844],[851,848],[884,850]]);
  chain([[802,864],[835,871],[866,875],[899,878]]);
  chain([[827,886],[858,893],[888,897],[920,898]]);
  ctx.restore();
}

function updateFrontSnowChains() {
  let image = document.getElementById("frontSnowChains");
  if (!frontSnowChainsEnabled) {
    if (image) image.hidden = true;
    const tread = document.getElementById("frontSnowChainTread");
    if (tread) tread.hidden = true;
    setImageError("snowChains");
    return;
  }
  if (!image) {
    image = new Image(); image.id = "frontSnowChains";
    image.alt = "Poglądowy łańcuch drabinkowy na tylnym kole";
    image.decoding = "async";
    // Match the opaque chain bounds to the tire shoulder and road contact,
    // accounting for transparent margins in the generated accessory.
    image.style.cssText = `position:absolute;left:${857 / 1584 * 100}%;top:${668 / 993 * 100}%;width:${187 / 1584 * 100}%;height:${245 / 993 * 100}%;pointer-events:none;z-index:2`;
    image.onload = () => {
      delete image.dataset.failed;
      image.hidden = !frontSnowChainsEnabled;
      drawFrontChainTread(image);
      setImageError("snowChains");
    };
    image.onerror = () => {
      image.dataset.failed = "true";
      image.hidden = true;
      const tread = document.getElementById("frontSnowChainTread");
      if (tread) tread.hidden = true;
      if (frontSnowChainsEnabled) setImageError("snowChains", "Nie udało się wczytać wizualizacji łańcuchów.");
    };
    image.src = FRONT_SNOW_CHAIN_IMAGE;
    rearChainAssembly().append(image);
  }
  image.hidden = image.dataset.failed === "true";
  drawFrontChainTread(image);
}

function renderWinterChains() {
  const panel = document.getElementById("panelContent");
  panel.innerHTML = `<div class="option"><div class="grid-buttons" role="tablist" aria-label="Akcesoria zimowe"><button id="winterChainsTab" type="button" class="active" role="tab" aria-selected="true" aria-controls="winterChainsOptions">Łańcuchy</button></div><div id="winterChainsOptions" role="tabpanel" aria-labelledby="winterChainsTab"><div class="option-title" style="margin-top:20px">Łańcuchy śniegowe</div><label class="checkline"><input id="frontSnowChainsToggle" type="checkbox" ${frontSnowChainsEnabled ? 'checked' : ''}><span>Dodaj łańcuchy</span></label><p id="winterChainsNote" class="note">Wizualizacja jest poglądowa.</p><table class="winter-chains-table" aria-describedby="winterChainsNote"><caption>Rodzaje łańcuchów</caption><thead><tr><th scope="col">Rodzaj</th></tr></thead><tbody><tr><td>Drabinkowe</td></tr><tr><td>Na Austrię</td></tr><tr><td>Norweskie</td></tr><tr><td>Sekcyjne</td></tr><tr><td><button id="automaticChainsPreview" class="winter-chain-photo-button" type="button" aria-haspopup="dialog">Automatyczne <span aria-hidden="true">↗</span></button></td></tr></tbody></table></div></div>`;
  appendProductInfoLink(document.getElementById("winterChainsOptions"), "snowChains");
  document.getElementById("automaticChainsPreview").onclick = openAutomaticChainsPreview;
  document.getElementById("frontSnowChainsToggle").onchange = event => {
    frontSnowChainsEnabled = event.target.checked;
    if (frontSnowChainsEnabled && document.getElementById("frontSnowChains")?.dataset.failed) {
      document.getElementById("frontSnowChains").remove();
    }
    updateFrontSnowChains();
  };
}
