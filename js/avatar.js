const trixiImages = {
  1: "./img/avatars/trixi-avatar-cgi.jpg",
  2: "./img/avatars/trixi-avatar-dbz.jpg",
  3: "./img/avatars/trixi-futuristic-2.jpg",
  4: "./img/avatars/trixi-avatar-pixel.jpg",
  5: "./img/avatars/trixi-avatar-ghibli.jpg",
  6: "./img/avatars/trixi-futuristic-1.jpg",
  7: "./img/avatars/trixi-pepe.jpg"
};

// Handle avatar selection
function setupAvatarSelection() {
  const avatarImages = document.querySelectorAll(".trixi-option");
  avatarImages.forEach(img => {
    img.addEventListener("click", () => {
      const selected = img.getAttribute("data-trixi");
      localStorage.setItem("selectedTrixi", selected);
      updateTrixiPreview(selected);

      avatarImages.forEach(i => i.classList.remove("ring", "ring-[#00FFA3]", "selected"));
      img.classList.add("ring", "ring-[#00FFA3]", "selected");
    });
  });
}

window.updateTrixiPreview = (id) => {
  const preview = document.getElementById("selected-trixi");
  if (!preview) return;
  preview.style.backgroundImage = `url('${trixiImages[id]}')`;
  preview.classList.remove("hidden");
  void preview.offsetWidth;
  preview.classList.add("visible");

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
  preview.style.right = `${rightOffset + 6}px`;
}

window.addEventListener("load", alignTrixiToMain);
window.addEventListener("resize", alignTrixiToMain);

setupAvatarSelection();

// Drag-to-scroll
const trixiScroll = document.getElementById("trixi-choices");
let isDown = false;
let startX;
let scrollLeft;

if (trixiScroll) {
  trixiScroll.addEventListener("mousedown", (e) => {
    isDown = true;
    trixiScroll.classList.add("cursor-grabbing");
    startX = e.pageX - trixiScroll.offsetLeft;
    scrollLeft = trixiScroll.scrollLeft;
  });
  trixiScroll.addEventListener("mouseleave", () => {
    isDown = false;
    trixiScroll.classList.remove("cursor-grabbing");
  });
  trixiScroll.addEventListener("mouseup", () => {
    isDown = false;
    trixiScroll.classList.remove("cursor-grabbing");
  });
  trixiScroll.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trixiScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    trixiScroll.scrollLeft = scrollLeft - walk;
  });

  // Scroll buttons
  const scrollLeftBtn = document.getElementById("scroll-left-btn");
  const scrollRightBtn = document.getElementById("scroll-right-btn");

  if (scrollLeftBtn) {
    scrollLeftBtn.addEventListener("click", () => {
      trixiScroll.scrollBy({ left: -80, behavior: "smooth" });
    });
  }
  if (scrollRightBtn) {
    scrollRightBtn.addEventListener("click", () => {
      trixiScroll.scrollBy({ left: 80, behavior: "smooth" });
    });
  }
}
