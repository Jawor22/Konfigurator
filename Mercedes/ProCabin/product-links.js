// Add or replace product URLs here. These links do not change the selected configuration.
const PRODUCT_INFO_LINKS = Object.freeze({
  galaxBar: { url:"https://www.enatruck.pl/produkt/29646/skyled-galax-22_-led-bar-_584-mm_-100w-biale-i-pomaranczowe-swiatlo-pozycyjne-r10_r148_r149/", description:"SKYLED GALAX 22″ LED BAR — 584 mm, 100 W" },
  towerMedium: { url:"https://www.enatruck.pl/produkt/28100/skyled-tower-14_6_-led-bar-_370_5-mm_-z-dynamicznym-swiatlem-pozycyjnym-_biale_pomaranczowe_/", description:"SKYLED TOWER 14,6″ — 370,5 mm" },
  towerShort: { url:"https://www.enatruck.pl/produkt/28099/skyled-tower-11_3_-led-bar-_286_5-mm_-z-dynamicznym-swiatlem-pozycyjnym-_biale_pomaranczowe_/", description:"SKYLED TOWER 11,3″ — 286,5 mm" },
  tower1041: { url:"https://www.enatruck.pl/produkt/28969/skyled-tower-40_-led-bar-_1041-mm_--z-dynamicznym-swiatlem-pozycyjnym-_biale_pomaranczowe_/", description:"SKYLED TOWER 40″ — 1041 mm" },
  tower789: { url:"https://www.enatruck.pl/produkt/27398/skyled-tower-31_2_-led-bar-_789-mm_--z-dynamicznym-swiatlem-pozycyjnym-_biale_pomaranczowe_/", description:"SKYLED TOWER 31,2″ — 789 mm" },
  towerLong: { url:"https://www.enatruck.pl/produkt/27259/skyled-tower-21_2_-led-bar-_537-mm_-z-dynamicznym-swiatlem-pozycyjnym-_biale_pomaranczowe_/", description:"SKYLED TOWER 21,2″ — 537 mm" },
  beeBeacon: {
    url: "https://www.enatruck.pl/produkt/28915/swiatlo-ostrzegawcze-_kogut_-skyled-bee-12-24v-_3-srubki_-pomaranczowy-odblysnik_-czarna-obudowa_-r65_-wys_-82_4-i-sr_-122-mm/",
    description: "SKYLED BEE — czarna obudowa, pomarańczowy odbłyśnik"
  },
  minorBeacon: {
    url: "https://www.enatruck.pl/produkt/27196/swiatlo-ostrzegawcze-_kogut_-skyled-minor-12-24v-_3-srubki_-pomaranczowy-odblysnik_-czarna-obudowa_-r65_-wys_-50_5-i-sr_-133-mm/",
    description: "SKYLED Minor — czarna obudowa, pomarańczowy odbłyśnik"
  },
  tallOrangeBeacon: {
    url: "https://www.enatruck.pl/produkt/28898/swiatlo-ostrzegawcze-_kogut_-skyled-12-24v-_3-srubki_-pomaranczowy-klosz_-r65_-wys_-127-mm-i-sr_-165-mm/",
    description: "Kogut SKYLED 127 mm — pomarańczowy klosz"
  },
  tallClearBeacon: {
    url: "https://www.enatruck.pl/produkt/28899/swiatlo-ostrzegawcze-_kogut_-skyled-12-24v-_3-srubki_-bialy-klosz_-pomaranczowy-led_-r65_-wys_-127-mm-i-sr_-165-mm/",
    description: "Kogut SKYLED 127 mm — jasny klosz, pomarańczowe LED"
  },
  orangeBeacon: {
    url: "https://www.enatruck.pl/produkt/27477/swiatlo-ostrzegawcze-_kogut_-skyled-12-24v-_3-srubki_-pomaranczowy-klosz_-r65_-wys_-89-mm-i-sr_-167-mm/",
    description: "Kogut SKYLED — pomarańczowy klosz, 89 × 167 mm"
  },
  clearBeacon: {
    url: "https://www.enatruck.pl/produkt/18812/swiatlo-ostrzegawcze-_kogut_-skyled-12-24v-_3-srubki_-bialy-klosz_-pomaranczowy-led_-r65_-wys_-89-mm-i-sr_-167-mm/",
    description: "Kogut SKYLED — jasny klosz, pomarańczowe LED, 89 × 167 mm"
  },
  galax9x: {
    url: "https://www.enatruck.pl/produkt/29645/reflektor-dalekosiezny-skyled-galax-9x-fi227-_100w_-biala-i-pomaranczowa-pozycja_-r10_r148_r149/",
    description: "SKYLED Galax 9X — 100 W"
  },
  jumboGalax: {
    url: "https://www.enatruck.pl/produkt/29643/reflektor-dalekosiezny-skyled-jumbo-galax-full-led-_60w_-biale-i-pomaranczowe-swiatlo-pozycyjne_-r149_r148_r10/",
    description: "SKYLED Jumbo Galax Full LED — 60 W"
  },
  jumboAmber: {
    url: "https://www.enatruck.pl/produkt/25499/reflektor-skyled-jumbo-amber-black---czarna-obudowa-_100w_-biale-i-pomaranczowe-swiatlo-pozycyjne_-r7_r10_r112/",
    description: "SKYLED Jumbo Amber Black — 100 W"
  },
  jumboStella: {
    url: "https://www.enatruck.pl/produkt/28330/reflektor-dalekosiezny-skyled-jumbo-stella-flash-black---czarna-obudowa-_140w_-dynamiczne-biale-i-pomaranczowe-swiatlo-pozycyjne-_-swiatlo-ostrzegawcze-_-pokrywa_-r10_r65_r148_r149/",
    description: "SKYLED Jumbo Stella Flash Black — 140 W"
  },
  solarSystem: {
    url: "https://www.enatruck.pl/produkt/26701/system-fotowoltaiczny-mercedes-actros-bigspace-2x60-wp-z-regulatorem-mppt-bluetooth/",
    description: "System fotowoltaiczny Mercedes Actros BigSpace 2×60 Wp"
  },
  integratedAirConditioning: {
    url: "https://www.enatruck.pl/produkt/26341/zintegrowana-klimatyzacja-postojowa-smart-in/",
    description: "Zintegrowana klimatyzacja postojowa SMART-IN"
  },
  roofAirConditioning: {
    url: "https://www.enatruck.pl/produkt/24979/klimatyzacja-stratos-24v_-1750-w/",
    description: "Klimatyzacja STRATOS 24 V — 1750 W"
  },
  rearAirConditioning: {
    url: "https://www.enatruck.pl/produkt/23520/klimatyzacja-postojowa-indel-b-back-plus-24v-na-tylna-sciane-1600-watt/",
    description: "Klimatyzacja postojowa INDEL B BACK PLUS 24 V — 1600 W"
  },
  snowChains: {
    url: "https://www.enatruck.pl/kategoria/171/lancuchy/",
    description: "Łańcuchy śniegowe"
  },
  airHorns: {
    url: "https://www.enatruck.pl/kategoria/1444/sygnaly-pneumatyczne/",
    description: "Sygnały pneumatyczne"
  },
  wheelcaps: {
    url: "https://www.enatruck.pl/kategoria/67/22_5-pelne/",
    description: "Kołpaki pełne 22,5 cala"
  },
  roofRail: {
    url: "https://www.enatruck.pl/produkt/17888/rama-dachowa-mp4_mp5_mp6-big-space/",
    description: "Rama dachowa MP4 / MP5 / MP6 Big Space"
  },
  sideRails: {
    url: "https://www.enatruck.pl/produkt/16684/sideliner-2500-5000-mm-air-flow-orurowanie-boczne_tylne-kpl/",
    description: "Sideliner 2500–5000 mm Air Flow — komplet orurowania bocznego / tylnego"
  },
  windowDeflectors: {
    url: "https://www.enatruck.pl/produkt/28001/owiewki-na-szyby-boczne-mb-antos_arocs_actros-mp4_mp5_procab/",
    description: "Owiewki na szyby boczne Mercedes-Benz Antos / Arocs / Actros MP4 / MP5 / ProCabin"
  },
  truxBumper: {
    url: "https://www.enatruck.pl/produkt/30925/rama-pod-zderzak-trux-do-mercedes-procabin---anodyzowana/",
    description: "Rama pod zderzak TRUX do Mercedes ProCabin — anodowana"
  },
  truxBumperIn: {
    url: "https://www.enatruck.pl/produkt/30924/rura-w-zderzak-trux-do-mercedes-procabin---anodyzowana/",
    description: "Rura w zderzak TRUX do Mercedes ProCabin — anodowana"
  },
  truxKangur: {
    url: "https://www.enatruck.pl/produkt/30999/oslona-czolowa-kangur-trux-typu-highway-do-mercedes-procabin---anodyzowana_-ryflowana/",
    description: "TRUX Highway do Mercedes ProCabin — anodowany, ryflowany"
  }
});

function appendProductInfoLink(container, productKey) {
  const product = PRODUCT_INFO_LINKS[productKey];
  if (!container || !product) return;
  const link = document.createElement("a");
  link.className = "product-info-link";
  link.href = product.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = product.description + " — otwórz w nowej karcie";
  link.setAttribute("aria-label", "Więcej informacji: " + product.description + ". Otwiera się w nowej karcie.");
  link.innerHTML = `<svg class="product-info-truck" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7M18 10v4h3M3 17H2"/><circle cx="6.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/></svg><span>Więcej informacji</span><svg class="product-info-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M6 6h8v8"/></svg>`;
  container.append(link);
}

function openTowerPreview(big = false, galax = false) {
  const id = galax ? "galaxBar" : big ? "towerLong" : "towerShort";
  let dialog = document.getElementById(id + "Dialog");
  if (!dialog) {
    const title = galax ? "SKYLED GALAX 22″ — 584 mm" : big ? "SKYLED TOWER 21,2″ — 537 mm" : "SKYLED TOWER 11,3″ — 286,5 mm";
    const specs = [
      ["Technologia / LED", galax ? "LED BAR (łuk) / 100 W" : big ? "Dwa rzędy / 36 × 5 W" : "Dwa rzędy / 18 × 5 W"],
      ["Zasilanie", galax ? "9–32 V" : "10–32 V"],
      ["Strumień rzeczywisty", galax ? "6800 lm" : big ? "13 500 lm" : "6750 lm"],
      ["Zasięg przy 1 lx", galax ? "600 m" : big ? "635 m" : "450 m"],
      ["Światło pozycyjne", "Dynamiczne, białe lub pomarańczowe"],
      ["Barwa światła", galax ? "6000 K" : "5700 K"],
      ["Wymiary (szer. × wys. × gł.)", galax ? "584 × 101 × 69 mm — wysokość ze wspornikiem" : `${big ? '537' : '286,5'} × 63,8 × 70,1 mm`],
      ["Szczelność", galax ? "IP67" : "IP67 / IP69K"],
      ["Homologacje", galax ? "ECE R10, R148, R149, CE (Ref. 50)" : big ? "ECE R10, R112, Ref. 40" : "ECE R10, R149, Ref. 50"],
      ["Materiały", "Aluminiowa obudowa, klosz z poliwęglanu"],
      ["Montaż", "Uchwyty boczne i dolna szyna w komplecie"]
    ];
    dialog = document.createElement("dialog"); dialog.id=id+"Dialog";dialog.className="winter-chain-preview";
    dialog.setAttribute("aria-labelledby",id+"Title");
    dialog.innerHTML=`<div class="winter-chain-preview-heading"><div><p class="winter-chain-preview-kicker">OŚWIETLENIE DALEKOSIĘŻNE / LED BAR</p><h2 id="${id}Title">${title}</h2></div><button type="button" class="winter-chain-preview-close" aria-label="Zamknij podgląd">×</button></div><div class="jumbo-stella-content"><figure class="winter-chain-preview-frame"><img src="${galax?'galax-led-bar-product.jpg':big?'tower-long-led-bar-product.jpg':'tower-led-bar-product.jpg'}" alt="${title} z białą i pomarańczową pozycją"><figcaption>${title}</figcaption></figure><section><h3>Podstawowe dane techniczne</h3><table class="jumbo-stella-specs"><tbody>${specs.map(([name,value])=>`<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join('')}</tbody></table><div class="product-preview-link"></div></section></div><p class="product-preview-error" role="status" hidden>Nie udało się wczytać zdjęcia. Dane i link do produktu są nadal dostępne.</p>`;
    if (!galax) {
      const variants = document.createElement("section");
      variants.className = "tower-length-options";
      variants.setAttribute("aria-label", "Długość listwy SKYLED TOWER");
      variants.innerHTML = `<p class="roof-label">Wybierz długość listwy</p><div class="tower-length-grid">${["286,5", "370,5", "537", "789", "1041"].map(length=>`<button type="button" class="tower-length-choice" data-length="${length}" aria-pressed="false">${length} <span>mm</span></button>`).join("")}</div><p class="tower-length-selected" aria-live="polite"></p>`;
      dialog.querySelector(".winter-chain-preview-heading").after(variants);
      const choose = length => {
        variants.querySelectorAll("button").forEach(button => {
          const active = button.dataset.length === length;
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        variants.querySelector(".tower-length-selected").textContent = "Wybrana długość: " + length + " mm";
        const data = {
          "286,5": { inches:"11,3", leds:18, flux:"6750", range:450, ref:50, approval:"R149", image:"tower-led-bar-product.jpg", key:"towerShort" },
          "370,5": { inches:"14,6", leds:24, flux:"9000", range:520, ref:40, approval:"R149", image:"tower-medium-led-bar-product.jpg", key:"towerMedium" },
          "537": { inches:"21,2", leds:36, flux:"13 500", range:635, ref:40, approval:"R112", image:"tower-long-led-bar-product.jpg", key:"towerLong" },
          "789": { inches:"31,2", leds:54, flux:"20 250", range:780, ref:50, approval:"R149", image:"tower-789-led-bar-product.jpg", key:"tower789", width:"789,5" },
          "1041": { inches:"40", leds:72, flux:"14 880 lm ECE / 23 560 lm OFFROAD", range:"780 m ECE / 900 m OFFROAD", ref:25, approval:"R149", image:"tower-1041-led-bar-product.jpg", key:"tower1041", dualMode:true }
        }[length];
        const content = dialog.querySelector(".jumbo-stella-content");
        content.hidden = !data;
        const heading = dialog.querySelector(".winter-chain-preview-heading h2");
        if (!data) { heading.textContent = "SKYLED TOWER — " + length + " mm"; return; }
        const variantTitle = `SKYLED TOWER ${data.inches}″ — ${length} mm`;
        heading.textContent = variantTitle;
        const image = content.querySelector("img");
        image.hidden = false;
        dialog.querySelector(".product-preview-error").hidden = true;
        image.src = data.image; image.alt = variantTitle + " z białą i pomarańczową pozycją";
        content.querySelector("figcaption").textContent = variantTitle;
        const rows = [
          ["Technologia / LED", `Dwa rzędy / ${data.leds} × 5 W`],
          ["Zasilanie", "10–32 V"],
          ["Strumień rzeczywisty", data.dualMode ? data.flux : data.flux + " lm"],
          ["Zasięg przy 1 lx", data.dualMode ? data.range : data.range + " m"],
          ["Światło pozycyjne", "Dynamiczne, białe lub pomarańczowe"],
          ["Barwa światła", "5700 K"],
          ["Wymiary (szer. × wys. × gł.)", `${data.width || length} × 63,8 × 70,1 mm`],
          ["Szczelność", "IP67 / IP69K"],
          ["Homologacje", `ECE R10, ${data.approval}, Ref. ${data.ref}`],
          ["Materiały", "Aluminiowa obudowa, klosz z poliwęglanu"],
          ["Montaż", "Uchwyty boczne i dolna szyna w komplecie"]
        ];
        content.querySelector("tbody").innerHTML = rows.map(([name,value])=>`<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("");
        const links = content.querySelector(".product-preview-link");
        links.replaceChildren(); appendProductInfoLink(links, data.key);
      };
      variants.querySelectorAll("button").forEach(button => button.onclick = () => choose(button.dataset.length));
      choose(big ? "537" : "286,5");
    }
    if (galax) appendProductInfoLink(dialog.querySelector('.product-preview-link'),id);
    dialog.querySelector('button').onclick=()=>dialog.close();
    dialog.onclick=event=>{if(event.target===dialog)dialog.close();};
    dialog.querySelector('img').onerror=event=>{event.target.hidden=true;dialog.querySelector('.product-preview-error').hidden=false;};
    document.body.append(dialog);
  }
  if(!dialog.open)dialog.showModal();
}

function openClearBeaconPreview(orange = false, tall = false, minor = false, bee = false) {
  const id = bee ? "beeBeacon" : minor ? "minorBeacon" : tall ? (orange ? "tallOrangeBeacon" : "tallClearBeacon") : (orange ? "orangeBeacon" : "clearBeacon");
  const height = bee ? "82,4" : minor ? "50,5" : tall ? 127 : 89, diameter = bee ? 122 : minor ? 133 : tall ? 165 : 167;
  const photo = bee ? "skyled-bee-beacon-product.jpg" : minor ? "skyled-minor-beacon-product.jpg" : tall ? (orange ? "skyled-127-orange-beacon-product.jpg" : "skyled-127-clear-beacon-product.jpg") : (orange ? "skyled-orange-beacon-product.jpg" : "skyled-clear-beacon-product.jpg");
  const lens = orange ? "pomarańczowy" : "jasny";
  let dialog = document.getElementById(id + "Dialog");
  if (!dialog) {
    const specs = [
      ["Zasilanie", "12 / 24 V (zakres 10–30 V)"],
      ["Klosz / światło", (orange ? "Pomarańczowy" : "Przezroczysty") + " / pomarańczowe LED"],
      ["Źródło światła", bee ? "48 LED / 42 W" : minor ? "20 × 3 W LED" : tall ? "40 × 1 W LED" : "12 × 3 W LED"],
      ["Wysokość / średnica", `${height} mm / ${diameter} mm`],
      ["Montaż", "Na 3 śruby"],
      ["Tryby produktu", bee ? "11 wzorów błyskowych / rotacyjnych" : minor ? "12 wzorów błyskowych" : tall ? "11 wzorów błyskowych" : "10 wzorów błyskowych"],
      ["Szczelność", "IP67"],
      ["Certyfikaty", bee ? "ECE R10, R65" : minor ? "ECE R10, R65 TA, CISPR25 Class 3, SAE J845 Class 1" : tall ? "R10, R65" : "R10, R65, SAE Class 1"],
      ["Temperatura pracy", bee ? "−40°C do +65°C" : "−40°C do +60°C"],
      ...(!tall && !minor && !bee ? [["Masa", "575 g"]] : [])
    ];
    dialog = document.createElement("dialog");
    dialog.id = id + "Dialog"; dialog.className = "winter-chain-preview";
    dialog.setAttribute("aria-labelledby", id + "Title");
    dialog.innerHTML = `<div class="winter-chain-preview-heading"><div><p class="winter-chain-preview-kicker">OŚWIETLENIE OSTRZEGAWCZE / KOGUTY</p><h2 id="${id}Title">${bee ? "SKYLED BEE — czarna obudowa" : minor ? "SKYLED Minor — czarna obudowa" : `SKYLED ${height} mm — ${lens} klosz`}</h2></div><button type="button" class="winter-chain-preview-close" aria-label="Zamknij podgląd">×</button></div><div class="jumbo-stella-content"><figure class="winter-chain-preview-frame"><img src="${photo}" width="3000" height="3000" alt="Kogut SKYLED ${height} mm — ${lens} klosz i czarna podstawa"><figcaption>Pomarańczowe LED · wysokość ${height} mm · średnica ${diameter} mm</figcaption></figure><section><h3>Podstawowe dane techniczne</h3><table class="jumbo-stella-specs"><tbody>${specs.map(([name,value])=>`<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}</tbody></table><div class="product-preview-link"></div></section></div><p class="product-preview-error" role="status" hidden>Nie udało się wczytać zdjęcia. Dane techniczne i odnośnik są nadal dostępne.</p>`;
    appendProductInfoLink(dialog.querySelector(".product-preview-link"), id);
    dialog.querySelector("button").onclick = () => dialog.close();
    dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
    dialog.querySelector("img").onerror = event => { event.target.hidden = true; dialog.querySelector(".product-preview-error").hidden = false; };
    document.body.append(dialog);
  }
  if (!dialog.open) dialog.showModal();
}

function openJumboStellaPreview() { openJumboLampPreview("stella"); }
function openJumboAmberPreview() { openJumboLampPreview("amber"); }
function openJumboGalaxPreview() { openJumboLampPreview("galax"); }
function openGalax9xPreview() { openJumboLampPreview("9x"); }
function openJumboLampPreview(kind) {
  const amber = kind === "amber", galax = kind === "galax", round = kind === "9x";
  const id = round ? "galax9x" : galax ? "jumboGalax" : amber ? "jumboAmber" : "jumboStella";
  const title = round ? "SKYLED Galax 9X" : galax ? "SKYLED Jumbo Galax Full LED" : amber ? "SKYLED Jumbo Amber Black" : "SKYLED Jumbo Stella Flash Black";
  const photo = round ? "galax-9x-product.jpg" : galax ? "jumbo-galax-product.jpg" : amber ? "jumbo-amber-product.jpg" : "jumbo-stella-flash-black.jpg";
  let dialog = document.getElementById(id + "Dialog");
  if (!dialog) {
    const specs = round ? [
      ["Technologia / moc", "Full LED / 100 W"],
      ["Zasilanie", "9–32 V"],
      ["Tryb światła", "Driving Beam"],
      ["Strumień rzeczywisty", "6500 lm (nominalny: 14 000 lm ECE)"],
      ["Zasięg przy 1 lx", "510 m ECE"],
      ["Barwa światła", "6000 K"],
      ["Światło pozycyjne", "Białe lub pomarańczowe"],
      ["Pobór prądu (12 / 24 V)", "8,4 A / 4,2 A ECE"],
      ["Szczelność", "IP67"],
      ["Średnica / głębokość", "227 mm / 110,2 mm"],
      ["Masa", "2 kg"],
      ["Homologacje", "ECE R10, R148, R149 (Ref. 50), CE"]
    ] : galax ? [
      ["Technologia / moc", "Full LED / 60 W"],
      ["Zasilanie", "9–32 V"],
      ["Tryb światła", "Driving Beam"],
      ["Strumień rzeczywisty", "3000 lm (nominalny: 6000 lm ECE)"],
      ["Zasięg przy 1 lx", "420 m ECE"],
      ["Barwa światła", "6000 K"],
      ["Światło pozycyjne", "Białe lub pomarańczowe"],
      ["Pobór prądu (12 / 24 V)", "5 A / 2,5 A ECE"],
      ["Szczelność", "IP67"],
      ["Wymiary (szer. × wys. × gł.)", "245 × 160 × 91 mm — wysokość ze wspornikiem"],
      ["Masa", "1,3 kg"],
      ["Homologacje", "ECE R10, R148, R149 (Ref. 40), CE"]
    ] : amber ? [
      ["Technologia / moc", "Full LED / 100 W (4 × 25 W)"],
      ["Zasilanie", "9–36 V"],
      ["Tryb światła", "Driving Beam"],
      ["Strumień rzeczywisty", "8500 lm"],
      ["Zasięg przy 1 lx", "425 m ECE"],
      ["Barwa światła", "6000 K"],
      ["Światło pozycyjne", "Białe lub pomarańczowe — zależnie od podłączenia"],
      ["Pobór prądu (12 / 24 V)", "6,5 A / 3,3 A"],
      ["Szczelność", "IP68 / IP69K"],
      ["Wymiary (szer. × wys. × gł.)", "247 × 176 × 92 mm — wysokość ze wspornikiem"],
      ["Homologacje", "ECE R7, R10, R112 (Ref. 37,5), CE, RoHS"],
      ["Obudowa", "Czarna"]
    ] : [
      ["Technologia / moc", "Full LED / 140 W"],
      ["Zasilanie", "9–36 V"],
      ["Tryby dalekosiężne", "OFFROAD / ECE"],
      ["Strumień rzeczywisty", "8500 lm OFFROAD / 4800 lm ECE"],
      ["Zasięg przy 1 lx", "556 m OFFROAD / 415 m ECE"],
      ["Barwa światła", "5000 K"],
      ["Światło pozycyjne", "Dynamiczne, białe lub pomarańczowe"],
      ["Światło ostrzegawcze", "Pomarańczowe"],
      ["Szczelność", "IP68 / IP69K"],
      ["Wymiary (szer. × wys. × gł.)", "247 × 170 × 83 mm — wysokość z uchwytem"],
      ["Homologacje", "ECE R10, R65, R148, R149 (Ref. 50)"],
      ["Wykończenie / zestaw", "Czarna obudowa, czarna matowa pokrywa w komplecie"]
    ];
    dialog = document.createElement("dialog");
    dialog.id = id + "Dialog";
    dialog.className = "winter-chain-preview jumbo-stella-preview";
    dialog.setAttribute("aria-labelledby", id + "Title");
    dialog.innerHTML = `<div class="winter-chain-preview-heading"><div><p class="winter-chain-preview-kicker">OŚWIETLENIE DALEKOSIĘŻNE</p><h2 id="${id}Title">${title}</h2></div><button type="button" class="winter-chain-preview-close" aria-label="Zamknij podgląd">×</button></div><div class="jumbo-stella-content"><figure class="winter-chain-preview-frame"><img src="${photo}" width="3000" height="3000" alt="${title} — białe i pomarańczowe światło pozycyjne" decoding="async"><figcaption>${title} · ${round ? "100" : galax ? "60" : amber ? "100" : "140"} W</figcaption></figure><section>${round ? '<p class="product-mounting-note">Dostępne w dwóch rozmiarach: <strong>9″ i 8″</strong>. Dobierz wariant do miejsca montażu i wyglądu pojazdu.</p>' : ""}<h3>${round ? "Parametry wariantu 9″" : "Podstawowe dane techniczne"}</h3><table class="jumbo-stella-specs"><tbody>${specs.map(([name,value])=>`<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}</tbody></table><div class="product-preview-link"></div></section></div><p class="product-preview-error" role="status" hidden>Nie udało się wczytać zdjęcia. Dane produktu i odnośnik są nadal dostępne.</p>`;
    appendProductInfoLink(dialog.querySelector(".product-preview-link"), id);
    dialog.querySelector("img").onerror = event => {
      event.target.hidden = true;
      dialog.querySelector(".product-preview-error").hidden = false;
    };
    dialog.querySelector("button").onclick = () => dialog.close();
    dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
    document.body.append(dialog);
  }
  if (!dialog.open) dialog.showModal();
}

function openRoofAirConditioningPreview() {
  openAirConditioningPreview("roof");
}
function openRearAirConditioningPreview() {
  openAirConditioningPreview("rear");
}
function summerProductDetails(kind) {
  return kind === "solar" ? {
    id:"solarSystem",kicker:"NA LATO / SYSTEMY FOTOWOLTAICZNE",title:"System fotowoltaiczny",
    image:"solar-system-actros.jpg",width:2048,height:1532,crop:true,
    alt:"Panele fotowoltaiczne zamontowane na dachu ciężarówki Mercedes Actros",caption:"Przykładowy montaż systemu fotowoltaicznego",product:"solarSystem",
    note:"Zestaw fotowoltaiczny dobieramy do modelu pojazdu.",
    specs: [
      ["Przeznaczenie zestawu", "Mercedes Actros BigSpace"],
      ["Liczba paneli / moc", "2 × 60 Wp"],
      ["Łączna moc szczytowa", "120 Wp"],
      ["Panele / ogniwa", "SKYLED / SUNPOWER"],
      ["Regulator ładowania", "Victron MPPT — śledzenie punktu mocy maksymalnej"],
      ["Łączność", "Bluetooth"],
      ["Podgląd parametrów", "Aplikacja na smartfonie lub tablecie"],
      ["Podłączenie", "Bezpośrednio do akumulatora pojazdu"],
      ["Zastosowanie", "Doładowywanie akumulatorów i wsparcie bilansu energii pojazdu"],
      ["Dobór zestawu", "Zależny od modelu pojazdu i kabiny"],
      ["Numer katalogowy", "22H110UO41"]
    ]
  } : kind === "integrated" ? {
    id:"integratedAirConditioning",kicker:"NA LATO / KLIMATYZACJA ZINTEGROWANA",title:"Klimatyzacja postojowa SMART-IN",
    image:"air-conditioning-smart-in.jpg",width:620,height:439,
    alt:"Schemat zintegrowanej klimatyzacji SMART-IN w czerwonej ciężarówce",caption:"Zintegrowana klimatyzacja postojowa SMART-IN",product:"integratedAirConditioning",
    note:"Do zestawu klimatyzacji należy dobrać odpowiedni zestaw montażowy, dopasowany do marki i modelu pojazdu.",
    specs: [
      ["Producent / seria", "Indel B / Sleeping Well SMART-IN"],
      ["Typ", "Klimatyzacja postojowa zintegrowana z oryginalnym układem pojazdu"],
      ["Napięcie znamionowe", "24 V"],
      ["Napięcie robocze", "20 V"],
      ["Moc chłodzenia", "Do 2800 W; dwa poziomy: 1000 W / 2800 W"],
      ["Pobór prądu", "17 A (Std)"],
      ["Temperatura pracy", "−20°C do +70°C"],
      ["Stopnie dmuchawy", "5"],
      ["Wyświetlacz", "LCD 1″"],
      ["Czynnik chłodniczy", "R134a lub R1234yf — zgodnie z układem pojazdu"],
      ["Nawiew", "Oryginalne otwory wentylacyjne pojazdu"],
      ["Umiejscowienie sprężarki", "Tylna część ramy pojazdu"],
      ["Praca postojowa", "Zasilanie z akumulatora przy wyłączonym silniku"],
      ["Zestaw montażowy", "Sprzedawany oddzielnie; dobierany do modelu pojazdu"]
    ]
  } : kind === "rear" ? {
    id:"rearAirConditioning",kicker:"NA LATO / KLIMATYZACJA TYLNA",title:"INDEL B BACK PLUS 24 V — 1600 W",
    image:"air-conditioning-back-plus.jpg",width:1200,height:1600,
    alt:"Klimatyzacja INDEL B BACK PLUS zamontowana na tylnej ścianie kabiny",caption:"Klimatyzacja tylna INDEL B BACK PLUS",product:"rearAirConditioning",
    note:"Najlepszą skuteczność chłodzenia uzyskuje się przy zamkniętej zasłonie części sypialnej.",
    specs: [
      ["Producent / seria", "Indel B / Sleeping Well BACK PLUS"],
      ["Typ", "Elektryczna klimatyzacja postojowa na tylną ścianę kabiny"],
      ["Zasilanie", "24 V — z akumulatora pojazdu"],
      ["Wydajność chłodnicza", "1600 W (5460 BTU) / 1100 W (3750 BTU)"],
      ["Pobór prądu", "11,5–21 A"],
      ["Maksymalny przepływ powietrza", "250 m³/h"],
      ["Jednostka zewnętrzna (wys. × szer. × gł.)", "702 × 466 × 187 mm"],
      ["Jednostka wewnętrzna (wys. × szer. × gł.)", "259 × 631 × 113 mm"],
      ["Montaż jednostek", "Agregat z tyłu kabiny; nawiew na wewnętrznej tylnej ścianie"],
      ["Połączenie jednostek", "Regulowana długość rury łączącej"],
      ["Sterowanie", "System sterowania w zestawie"],
      ["Funkcje", "Chłodzenie i osuszanie; praca przy włączonym lub wyłączonym silniku"]
    ]
  } : {
    id:"roofAirConditioning",kicker:"NA LATO / KLIMATYZACJA DACHOWA",title:"STRATOS 24 V — 1750 W",
    image:"air-conditioning-stratos.jpg",width:686,height:442,
    alt:"Biała klimatyzacja dachowa STRATOS z dwoma wentylatorami",caption:"Klimatyzacja dachowa STRATOS",product:"roofAirConditioning",
    note:"Zestaw montażowy jest sprzedawany oddzielnie — należy dobrać go do marki, modelu i kabiny pojazdu.",
    specs: [
      ["Producent", "Vitrifrigo"], ["Typ", "Klimatyzacja postojowa dachowa"],
      ["Wydajność chłodnicza", "1750 W"], ["Zasilanie", "24 V — z akumulatora pojazdu"],
      ["Maksymalny pobór prądu", "30 A"], ["Wymiary (szer. × gł.)", "913 × 659 mm"],
      ["Wysokość", "135 mm; całe urządzenie: 288 mm"], ["Masa", "22,5 kg"],
      ["Temperatura pracy", "+5°C do +43°C"], ["Poziom hałasu", "Poniżej 70 dB(A)"],
      ["Czynnik chłodniczy", "R134a"], ["Sprężarka", "Inwerterowa, rotacyjna 24 V"],
      ["Tryby pracy", "Auto, Eco, nocny"], ["Prędkości dmuchawy", "6 poziomów"],
      ["Sterowanie i nawiew", "Pilot, timer, 3 regulowane wyloty powietrza"],
      ["Funkcje", "Autodiagnostyka, oszczędzanie akumulatora, czujnik przechyłu"]
    ]
  };
}
function createSolarSpecialistContact() {
  const contact = document.createElement("section");
  contact.className = "solar-specialist-contact";
  contact.setAttribute("aria-label", "Kontakt do specjalisty ds. paneli fotowoltaicznych");
  contact.innerHTML = `<p class="solar-specialist-role">Specjalista ds. paneli fotowoltaicznych</p><a class="solar-specialist-name" href="mailto:mateusz.grzesinski@enaltd.com">Mateusz Grzesiński</a><address><a href="mailto:mateusz.grzesinski@enaltd.com"><span>E-mail</span>mateusz.grzesinski@enaltd.com</a><a href="tel:+48691970900"><span>Telefon</span>691 970 900</a><a href="tel:+48583009609"><span>Telefon</span>58 300 96 09</a></address>`;
  return contact;
}
function appendSummerProductCard(container, kind) {
  const config = summerProductDetails(kind);
  const card = document.createElement("section"); card.className = "option summer-product-card";
  card.innerHTML = `<button type="button" class="summer-product-image ${config.crop ? 'summer-product-image-solar' : ''}" aria-label="Powiększ zdjęcie: ${config.title}"><img src="${config.image}" alt="${config.alt}" decoding="async"></button><div class="summer-product-details"><h3>${config.title}</h3>${config.note ? `<p class="note">${config.note}</p>` : ''}<button type="button" class="option-btn summer-product-open">Szczegóły</button></div>`;
  card.querySelectorAll("button").forEach(button=>button.onclick=()=>openAirConditioningPreview(kind));
  const content = card.querySelector(".summer-product-details");
  if (kind === "solar") content.append(createSolarSpecialistContact());
  appendProductInfoLink(content, config.product);
  container.append(card);
}
function openAirConditioningPreview(kind) {
  const config = summerProductDetails(kind);
  let dialog = document.getElementById(config.id + "Dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = config.id + "Dialog"; dialog.className = "winter-chain-preview";
    if (kind === "rear") dialog.style.width = "min(620px,calc(100vw - 24px))";
    dialog.setAttribute("aria-labelledby", config.id + "Title");
    dialog.innerHTML = `<div class="winter-chain-preview-heading"><div><p class="winter-chain-preview-kicker">${config.kicker}</p><h2 id="${config.id}Title">${config.title}</h2></div><button type="button" class="winter-chain-preview-close" aria-label="Zamknij podgląd">×</button></div><figure class="winter-chain-preview-frame"><img src="${config.image}" width="${config.width}" height="${config.height}" decoding="async" alt="${config.alt}"><figcaption>${config.caption}</figcaption></figure><div class="product-preview-link"></div><p class="product-preview-error" role="status" hidden>Nie udało się wczytać zdjęcia. Odśwież stronę i spróbuj ponownie.</p>`;
    appendProductInfoLink(dialog.querySelector(".product-preview-link"), config.product);
    if (config.specs) {
      const details = document.createElement("section");
      details.className = "product-technical-details";
      details.style.marginTop = "20px";
      details.innerHTML = `<h3>Parametry techniczne</h3><table class="jumbo-stella-specs"><tbody>${config.specs.map(([name,value])=>`<tr><th scope="row">${name}</th><td>${value}</td></tr>`).join("")}</tbody></table>`;
      dialog.querySelector(".product-preview-link").before(details);
    }
    if (config.note) {
      const note = document.createElement("p");
      note.className = "product-mounting-note";
      note.textContent = config.note;
      dialog.querySelector(".product-preview-link").before(note);
    }
    if (kind === "solar") {
      dialog.querySelector(".product-preview-link").before(createSolarSpecialistContact());
    }
    const image = dialog.querySelector("img");
    if (config.crop) {
      const crop = document.createElement("div"); crop.className = "product-preview-image-crop";
      image.before(crop); crop.append(image);
    }
    image.onerror = () => { image.hidden = true; dialog.querySelector(".product-preview-error").hidden = false; };
    dialog.querySelector("button").onclick = () => dialog.close();
    dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
    document.body.append(dialog);
  }
  dialog.showModal();
}
