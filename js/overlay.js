let overlayIsOpened = false;

function populateOverlay(imgIdObjIdxs) {
  const imageInfo = imageData[imgIdObjIdxs.id];
  const validObjIdxs = imgIdObjIdxs.objIdxs;

  // imagem
  const imgEl = document.getElementById("overlay--image");
  imgEl.src = `${IMAGES_URL}/${imageInfo.id}.jpg`;

  // cores
  const imgColors = imageInfo["color_palette"];
  const imgColorsEl = document.getElementById("overlay--colors");
  imgColorsEl.innerHTML = "";
  imgColors.forEach(c => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("overlay--colors-display");
    colorDiv.style.backgroundColor = `rgb(${c.join(",")})`;
    imgColorsEl.appendChild(colorDiv);
  });

  // detalhes da obra
  const infoEl = document.getElementById("overlay--info-text");
  const collectionEl = document.getElementById("overlay--collection-text");

  const title = imageInfo.title == "" ? getLabel("untitled", "pt") : `${imageInfo.title}`;
  const creator = imageInfo.creator == "" ? getLabel("unauthored", "pt") : `${imageInfo.creator}`;
  const year = imageInfo.year == 9999 ? getLabel("undated", "pt") : `${imageInfo.year}`;
  infoEl.innerHTML = `${title} (${year})<br>${creator}`;

  collectionEl.innerHTML = `${imageInfo.museum}`;

  // mais informações
  const linkEl = document.getElementById("overlay--info");
  linkEl.setAttribute("href", imageInfo.url);

  // sobrepor box container à imagem
  const boxContainerEl = document.getElementById("overlay--box-container");
  boxContainerEl.innerHTML = "";

  // mostrar nota sobre IA/CV
  const errorNoteEl = document.getElementById("overlay--error-note");
  if (validObjIdxs.length > 0) {
    errorNoteEl.classList.remove("hidden");
  } else {
    errorNoteEl.classList.add("hidden");
  }

  function matchImageSize() {
    if (!overlayIsOpened) return;
    boxContainerEl.style.width = `${imgEl.width}px`;
    boxContainerEl.style.height = `${imgEl.height}px`;

    for (const objIdx of validObjIdxs) {
      const boxEl = document.createElement("div");
      boxEl.classList.add("overlay--box");

      const objBox = imageInfo["objects"][objIdx]["box"];

      // redimensionar tamanho do retângulo
      boxEl.style.width = `${(objBox[2] - objBox[0]) * imgEl.width}px`;
      boxEl.style.height = `${(objBox[3] - objBox[1]) * imgEl.height}px`;
      boxEl.style.marginLeft = `${objBox[0] * imgEl.width}px`;
      boxEl.style.marginTop = `${objBox[1] * imgEl.height}px`;

      boxContainerEl.appendChild(boxEl);
    }
  }

  setTimeout(() => {
    if (imgEl.complete) matchImageSize();
    else imgEl.addEventListener("load", matchImageSize);
  }, window.innerWidth > 600 ? 25 : 100); // às vezes falha sem um tempo de espera

  // essa parte tenta corrigir um problema de como a imagem e o retângulo estão estruturados no HTML e CSS
  // os elementos estão separados, então, quando o tamanho da imagem muda, o box container precisa atualizar
  // no futuro a intenção é melhorar a estrutura da imagem e que esse remendo não precise existir
  const resizeBoxObserver = new ResizeObserver(matchImageSize);
  resizeBoxObserver.observe(imgEl);

  // mostrar overlay
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("overlay--hidden");
  setTimeout(() => overlayIsOpened = true, 1); // abrir depois de tentar fechar

  // fechar overlay
  function closeOverlay(evt) {
    if (!overlayIsOpened) return
    const overlayWindow = document.getElementById("overlay--window");
    const overlayClose = document.getElementById("overlay--close").children[0];

    if (!overlayWindow.contains(evt.target) || evt.target == overlayClose) {
      overlayIsOpened = false;
      overlay.classList.add("overlay--hidden");
      document.removeEventListener("click", closeOverlay);

      boxContainerEl.innerHTML = "";
      resizeBoxObserver.unobserve(imgEl);
      resizeBoxObserver.disconnect();
    }
  }
  document.addEventListener("click", closeOverlay);
}

function populateMosaicOverlay(imgUrl) {
  // imagem
  const imgEl = document.getElementById("overlay--image");
  imgEl.src = imgUrl;

  // mostrar overlay
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("overlay--hidden");
  setTimeout(() => overlayIsOpened = true, 1); // abrir depois de tentar fechar

  // apagar descrição
  ["overlay--colors", "overlay--description"].forEach(id => document.getElementById(id).classList.add("hidden"));

  // mostrar nota sobre IA/CV
  const errorNoteEl = document.getElementById("overlay--error-note");
  errorNoteEl.classList.remove("hidden");

  // fechar overlay
  function closeOverlay(evt) {
    if (!overlayIsOpened) return
    const overlayWindow = document.getElementById("overlay--window");
    const overlayClose = document.getElementById("overlay--close").children[0];

    if (!overlayWindow.contains(evt.target) || evt.target == overlayClose) {
      overlayIsOpened = false;
      overlay.classList.add("overlay--hidden");
      document.removeEventListener("click", closeOverlay);
      ["overlay--colors", "overlay--description"].forEach(id => document.getElementById(id).classList.remove("hidden"));
    }
  }
  document.addEventListener("click", closeOverlay);
}
