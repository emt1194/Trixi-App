const trixiImages = {
    1: "./img/trixi-avatar-cgi.jpg",
    2: "./img/trixi-avatar-dbz.jpg",
    3: "./img/trixi-avatar-cyberpunk.jpg",
    4: "./img/trixi-avatar-pixel.jpg",
    5: "./img/trixi-avatar-ghibli.jpg"
  };
  
  document.querySelectorAll(".trixi-option").forEach(img => {
    img.addEventListener("click", () => {
      const selected = img.getAttribute("data-trixi");
      localStorage.setItem("selectedTrixi", selected);
      updateTrixiPreview(selected);
  
      // Remove highlights from all
      document.querySelectorAll(".trixi-option").forEach(i =>
        i.classList.remove("ring", "ring-[#00FFA3]", "selected")
      );
  
      // Highlight selected
      img.classList.add("ring", "ring-[#00FFA3]", "selected");
    });
  });
  
  // 👇 These functions are now globally available
  window.updateTrixiPreview = (id) => {
    const preview = document.getElementById("selected-trixi");
    if (!preview) return;
  
    preview.style.backgroundImage = `url('${trixiImages[id]}')`;
    preview.classList.remove("hidden");
    void preview.offsetWidth; // restart animation
    preview.classList.add("visible");
  
    // Also visually highlight the matching dropdown avatar
    document.querySelectorAll(".trixi-option").forEach(i => {
      i.classList.remove("ring", "ring-[#00FFA3]", "selected");
      if (i.getAttribute("data-trixi") === id.toString()) {
        i.classList.add("ring", "ring-[#00FFA3]", "selected");
      }
    });
  };
  
  window.hideTrixiPreview = () => {
    const preview = document.getElementById("selected-trixi");
    if (!preview) return;
    preview.classList.remove("visible");
    setTimeout(() => preview.classList.add("hidden"), 400);
  };
  
  // Click-to-toggle info box
  const trixiPreview = document.getElementById("selected-trixi");
  const infoBox = document.getElementById("trixi-info-box");
  
  if (trixiPreview && infoBox) {
    trixiPreview.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = infoBox.classList.contains("show");
  
      if (!isVisible) {
        infoBox.classList.remove("hidden");
        requestAnimationFrame(() => infoBox.classList.add("show"));
      } else {
        infoBox.classList.remove("show");
        setTimeout(() => infoBox.classList.add("hidden"), 300);
      }
    });
  
    document.addEventListener("click", (e) => {
      if (!trixiPreview.contains(e.target) && !infoBox.contains(e.target)) {
        infoBox.classList.remove("show");
        setTimeout(() => infoBox.classList.add("hidden"), 300);
      }
    });
  }
  
  function positionTrixiInfoBox() {
    const preview = document.getElementById("selected-trixi");
    const infoBox = document.getElementById("trixi-info-box");
    if (!preview || !infoBox) return;
  
    const rect = preview.getBoundingClientRect();
    infoBox.style.position = "fixed";
    infoBox.style.right = `${window.innerWidth - rect.right}px`;
    infoBox.style.bottom = `${window.innerHeight - rect.top + 10}px`;
  }
  
  document.getElementById("selected-trixi")?.addEventListener("mouseenter", () => {
    positionTrixiInfoBox();
  });
  
  function alignTrixiToMain() {
    const preview = document.getElementById("selected-trixi");
    const main = document.querySelector("main");
    if (!preview || !main) return;
  
    const mainRect = main.getBoundingClientRect();
    const rightOffset = window.innerWidth - mainRect.right;
    preview.style.right = `${rightOffset + 6}px`; // same as Tailwind's right-6
  }
  
  window.addEventListener("load", alignTrixiToMain);
  window.addEventListener("resize", alignTrixiToMain);
  