(() => {
  if (window.configurationPreview) {
    const { token, state } = window.configurationPreview;
    (async () => {
      document.documentElement.dataset.previewStage = "configuration";
      const snapshot = JSON.parse(JSON.stringify(state));
      snapshot.category = snapshot.bumperInEnabled && !snapshot.activeTrux ? "ramaWZderzak" : "kangury";
      await restoreConfiguration(snapshot);
      document.documentElement.dataset.previewStage = "paint";
      // Await the same paint/finish pipeline used by the live configurator before revealing a project.
      await updateTruckPaint(selectedTruckColor());
      document.documentElement.dataset.previewStage = "finish";
      await updateWheelcaps();
      await Promise.all([updateFactoryVisorFinish(), updateTireShading()]);
      document.documentElement.dataset.previewStage = "images";
      await Promise.all([...document.querySelectorAll("#frame img")].filter(image => image.getAttribute("src")).map(image => image.decode()));
      if (snapshot.airHornEnabled && snapshot.airHornShape === "rectangular") await airHornModels.rectangular.texture.decode();
      updateAirHorn(); applyKangurPose(); applyAccessoryLighting();
      document.documentElement.dataset.previewStage = "shadows";
      // An offscreen or covered iframe may throttle requestAnimationFrame. Finish its real renderer explicitly.
      window.accessoryStudioLighting?.renderNow();
      // Both projects show the same instant of any warning-light animation.
      document.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 0; });
      document.documentElement.dataset.previewStage = "ready";
      parent.postMessage({ type: "project-preview-ready", token, width: 1584, height: 993 }, "*");
    })().catch(error => parent.postMessage({ type: "project-preview-error", token, message: error.message }, "*"));
    return;
  }

  const clone = value => JSON.parse(JSON.stringify(value));
  const selected = new Set();
  let projects = [], cards = [], returnFocus = null;
  function accessoryCount(state = {}) {
    let count = [state.activeTrux, state.sideVariant, state.bumperEnabled, state.bumperInEnabled,
      state.roofEnabled, state.windowDeflectorEnabled, state.sunVisorEnabled, state.airHornEnabled,
      state.wheelcapsFinish === "czarne", state.frontSnowChainsEnabled].filter(Boolean).length;
    for (const [mount, available] of [["kangur", state.activeTrux], ["roof", state.roofEnabled], ["bumperIn", state.bumperInEnabled]]) {
      const lighting = state.accessoryLighting?.[mount];
      if (!available || !lighting?.enabled) continue;
      if (lighting.type === "led-bar" && ["tower", "galax-bar"].includes(lighting.model)) count += lighting.barLayout === "single" ? 1 : 2;
      if (lighting.type === "dalekosiezny" && ["jumbo-stella", "jumbo-amber", "jumbo-galax", "galax-9x"].includes(lighting.model)) {
        count += mount === "roof" ? (lighting.count === 6 ? 6 : 4) : (lighting.count === 2 ? 2 : 4);
      }
    }
    if (state.roofEnabled && state.roofBeacons?.enabled) count += 2;
    count += [state.activeTrux && state.kangurLightsEnabled, state.sideVariant && state.lightsEnabled,
      state.bumperEnabled && state.bumperLightsEnabled, state.roofEnabled && state.roofLightsEnabled].filter(Boolean).length;
    return count;
  }
  function priceText(project) {
    const amount = project.totalPrice ?? project.state?.totalPrice;
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) return null;
    const currency = project.currency || project.state?.currency || "PLN";
    try { return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(amount); }
    catch { return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount); }
  }
  function countText(count) {
    const form = new Intl.PluralRules("pl").select(count);
    return `${count} ${form === "one" ? "dodatek" : form === "few" ? "dodatki" : "dodatków"}`;
  }
  const container = document.getElementById("savedConfigurations");
  const selectionBar = document.createElement("div");
  selectionBar.className = "project-selection-bar";
  selectionBar.innerHTML = `<p id="projectSelectionStatus" role="status" aria-live="polite">Zaznacz dwa projekty do porównania.</p><button id="compareProjects" type="button" disabled>Porównaj projekty <span aria-hidden="true">↔</span></button>`;
  container.after(selectionBar);
  const compareButton = selectionBar.querySelector("button"), selectionStatus = selectionBar.querySelector("p");
  const dialog = document.createElement("dialog");
  dialog.id = "projectComparison";
  dialog.setAttribute("aria-labelledby", "projectComparisonTitle");
  dialog.innerHTML = `<div class="comparison-heading"><div><p class="comparison-kicker">TWÓJ WYBÓR / DWA PROJEKTY</p><h2 id="projectComparisonTitle">Porównaj projekty</h2><p class="comparison-lead">Identyczna skala i perspektywa. Pełne wyposażenie każdego projektu.</p></div><div class="comparison-actions"><button type="button" id="comparisonSwap">Zamień strony ↔</button><button type="button" id="comparisonZoom" aria-pressed="false">Powiększ podglądy</button><button type="button" id="comparisonBack">← Wróć do zapisanych</button></div></div><div class="comparison-scroll"><div class="comparison-grid"></div></div>`;
  document.body.append(dialog);
  const grid = dialog.querySelector(".comparison-grid"), zoomButton = dialog.querySelector("#comparisonZoom");
  document.getElementById("configTitle").textContent = "Zapisane projekty";
  document.getElementById("openConfigStorage").textContent = "Zapisane projekty";
  function updateSelection() {
    compareButton.disabled = selected.size !== 2;
    selectionStatus.textContent = projects.length < 2 ? "Zapisz przynajmniej dwa projekty, aby je porównać." : `Wybrano ${selected.size} z 2 projektów.`;
    container.querySelectorAll(".saved-project-checkbox").forEach(input => {
      input.checked = selected.has(Number(input.value));
      input.disabled = selected.size === 2 && !input.checked;
      input.closest(".saved-config-item").classList.toggle("comparison-selected", input.checked);
    });
  }
  function beginSelection(configurations) {
    projects = configurations;
    selected.clear(); updateSelection();
  }
  function decorateRow(row, project, index) {
    const name = row.querySelector("span"), buttons = [...row.querySelectorAll("button")];
    name.classList.add("saved-project-name");
    const info = document.createElement("div"); info.className = "saved-project-info";
    const metadata = document.createElement("p"); metadata.className = "saved-project-meta";
    const date = new Date(project.createdAt);
    metadata.textContent = countText(accessoryCount(project.state)) + (Number.isNaN(date.valueOf()) ? "" : " · " + date.toLocaleDateString("pl-PL"));
    info.append(name, metadata);
    const actions = document.createElement("div"); actions.className = "saved-project-actions"; actions.append(...buttons);
    const label = document.createElement("label"); label.className = "saved-project-select";
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.value = String(index); checkbox.className = "saved-project-checkbox";
    checkbox.setAttribute("aria-label", `Porównaj projekt: ${project.name}`);
    checkbox.onchange = () => {
      if (checkbox.checked && selected.size < 2) selected.add(index);
      else selected.delete(index);
      updateSelection();
    };
    label.append(checkbox); row.replaceChildren(label, info, actions);
    updateSelection();
  }
  function resizePreview(card) {
    const width = card.viewport.getBoundingClientRect().width;
    card.frame.style.transform = `scale(${width / 1584})`;
  }
  function createCard(project) {
    const article = document.createElement("article"); article.className = "comparison-project";
    const heading = document.createElement("header"); heading.className = "comparison-project-heading";
    const badge = document.createElement("span"); badge.className = "comparison-project-badge";
    const title = document.createElement("h3"); title.textContent = project.name; title.title = project.name;
    heading.append(badge, title);
    const viewport = document.createElement("div"); viewport.className = "comparison-preview-window";
    const cover = document.createElement("div"); cover.className = "comparison-loading"; cover.setAttribute("role", "status"); cover.textContent = "Przygotowuję projekt…";
    const iframe = document.createElement("iframe");
    iframe.title = `Podgląd projektu: ${project.name}`; iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1; iframe.style.cssText = "width:1584px;height:993px;transform-origin:0 0;border:0";
    const token = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const card = { article, project, frame: iframe, viewport, cover, token, badge, timeout: null, observer: null };
    function start() {
      cover.replaceChildren(document.createTextNode("Przygotowuję projekt…"));
      // Keep rendering active behind the opaque loading cover; hidden frames can suspend animation frames.
      cover.hidden = false;
      iframe.name = JSON.stringify({ token, state: clone(project.state || {}) });
      const url = new URL(location.href); url.searchParams.set("compare-preview", "1");
      url.hash = encodeURIComponent(JSON.stringify({ token, state: clone(project.state || {}) }));
      iframe.src = url.href;
      clearTimeout(card.timeout);
      card.timeout = setTimeout(() => failCard(card, "Podgląd ładuje się dłużej. Możesz spróbować ponownie."), 30000);
    }
    card.retry = start;
    const statistics = document.createElement("footer"); statistics.className = "comparison-statistics";
    const count = document.createElement("strong"); count.textContent = countText(accessoryCount(project.state));
    statistics.append(count);
    const formattedPrice = priceText(project);
    if (formattedPrice !== null) {
      const price = document.createElement("span"); price.textContent = "Wartość: " + formattedPrice;
      statistics.append(price);
    }
    viewport.append(iframe, cover); article.append(heading, viewport, statistics);
    grid.append(article);
    card.observer = new ResizeObserver(() => resizePreview(card)); card.observer.observe(viewport);
    start(); return card;
  }
  function failCard(card, message) {
    card.cover.hidden = false; card.cover.textContent = message;
    const retry = document.createElement("button"); retry.type = "button"; retry.textContent = "Spróbuj ponownie";
    retry.onclick = card.retry; card.cover.append(retry);
  }
  function openComparison() {
    if (selected.size !== 2) return;
    const pair = [...selected].sort((a, b) => a - b).map(index => projects[index]);
    if (pair.some(project => !project?.state)) return;
    returnFocus = document.activeElement;
    document.getElementById("configModal").hidden = true;
    grid.replaceChildren(); dialog.showModal(); document.body.classList.add("comparing-projects");
    cards = pair.map(createCard);
    cards.forEach((card, index) => { card.badge.textContent = index === 0 ? "Projekt A" : "Projekt B"; resizePreview(card); });
    document.getElementById("comparisonBack").focus();
  }
  function closeComparison() {
    if (!dialog.open) return;
    for (const card of cards) { clearTimeout(card.timeout); card.observer.disconnect(); card.frame.remove(); }
    cards = []; grid.replaceChildren(); dialog.close(); document.body.classList.remove("comparing-projects");
    grid.classList.remove("comparison-zoomed"); zoomButton.setAttribute("aria-pressed", "false"); zoomButton.textContent = "Powiększ podglądy";
    document.getElementById("configModal").hidden = false;
    (returnFocus?.isConnected ? returnFocus : compareButton).focus();
  }
  window.addEventListener("message", event => {
    const card = cards.find(candidate => event.source === candidate.frame.contentWindow && event.data?.token === candidate.token);
    if (!card) return;
    if (event.data.type === "project-preview-ready") {
      clearTimeout(card.timeout); card.cover.hidden = true; card.frame.style.visibility = "visible";
      card.article.dataset.ready = "true";
    } else if (event.data.type === "project-preview-error") {
      clearTimeout(card.timeout); failCard(card, "Nie udało się przygotować podglądu tego projektu.");
    }
  });
  compareButton.onclick = openComparison;
  document.getElementById("comparisonBack").onclick = closeComparison;
  document.getElementById("comparisonSwap").onclick = () => {
    cards.reverse(); cards.forEach((card, index) => { grid.append(card.article); card.badge.textContent = index === 0 ? "Projekt A" : "Projekt B"; });
  };
  zoomButton.onclick = () => {
    const zoomed = grid.classList.toggle("comparison-zoomed");
    zoomButton.setAttribute("aria-pressed", String(zoomed)); zoomButton.textContent = zoomed ? "Dopasuj do ekranu" : "Powiększ podglądy";
  };
  dialog.addEventListener("cancel", event => { event.preventDefault(); closeComparison(); });
  window.projectComparison = { beginSelection, decorateRow, accessoryCount, priceText };
  updateSelection();
})();
