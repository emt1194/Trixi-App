let walletAddress = null;
let trixiBalance = 0;
const MIN_REQUIRED = 500000;

function updateUIAccess(isUnlocked) {
    const primaryPanel = document.getElementById("primary-panel");
    const panelContent = document.getElementById("panel-content");
    const parent = primaryPanel?.parentElement;
    let messageBox = document.getElementById("wallet-message");
  
    if (isUnlocked) {
      primaryPanel?.classList.remove("blur-sm", "relative", "panel-inactive");
      messageBox?.remove();
  
      // ✨ Show Trixi avatar preview
      const storedTrixi = localStorage.getItem("selectedTrixi") || 1;
      window.updateTrixiPreview?.(storedTrixi);
  
      setTimeout(() => {
        panelContent?.classList.remove("opacity-0");
      }, 250);
  
      document.querySelectorAll("button, input, textarea").forEach(el => el.classList.remove("inactive-button"));
      showWalletBar();
    } else {
      primaryPanel?.classList.add("blur-sm", "relative", "panel-inactive");
      panelContent?.classList.add("opacity-0");
  
      // ❌ Hide Trixi avatar preview
      window.hideTrixiPreview?.();
  
      if (!messageBox && parent) {
        messageBox = document.createElement("div");
        messageBox.id = "wallet-message";
  
        const panelRect = primaryPanel.getBoundingClientRect();
        const topOffset = primaryPanel.offsetTop;
        messageBox.style.position = "absolute";
        messageBox.style.top = `${topOffset + panelRect.height / 2}px`;
        messageBox.style.left = "50%";
        messageBox.style.transform = "translate(-50%, -50%)";
        messageBox.style.zIndex = "150";
        messageBox.style.pointerEvents = "none";
        messageBox.style.textAlign = "center";
  
        messageBox.innerHTML = `
          <div class="text-white text-2xl font-bold">Please connect wallet</div>
          <div class="text-white wallet-gate-text text-sm text-opacity-70">
            <span>Balance of 500,000 $TRIXIVERSE or</span>
            <span>more is required to use the Web UI</span>
          </div>
        `;
  
        parent.appendChild(messageBox);
      }
  
      document.querySelectorAll("button, input, textarea").forEach(el => {
        if (el.id !== "connect-wallet") {
          el.classList.add("inactive-button");
        }
      });
    }
  }
  
  function showFloatingTooltip(event) {
    const tooltip = document.getElementById('floating-tooltip');
    tooltip.textContent = 'Coming soon';
  
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
  
    // Position tooltip vertically centered with button
    const top = rect.top + scrollY + rect.height / 2 - tooltip.offsetHeight / 2;
  
    // Position left so that it overlaps the button by 50% of the tooltip width
    const left = rect.left + scrollX - tooltip.offsetWidth / 2;
  
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  
    tooltip.classList.add('opacity-100');
  
    setTimeout(() => {
      tooltip.classList.remove('opacity-100');
    }, 2000);
  }
  
  
  
  function showWalletBar() {
    const main = document.querySelector("main");
    if (!main || document.getElementById("wallet-panel-wrapper")) return;
  
    const wrapper = document.createElement("div");
    wrapper.id = "wallet-panel-wrapper";
    wrapper.style.overflow = "hidden";
    wrapper.style.height = "0px";
    wrapper.style.opacity = "0";
    wrapper.style.transition = "height 0.4s ease, opacity 0.3s ease";
    wrapper.className = "bg-[#1C1E26] text-white flex justify-between items-center rounded-2xl px-4";
  
    wrapper.innerHTML = `
      <div><span class="wallet-bar-green">Wallet</span>: <span class="wallet-bar-white">${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}</span></div>
      <div class="wallet-bar-spacer"></div>
      <div><span class="wallet-bar-pink">TRIXI</span>: <span class="wallet-bar-white">${trixiBalance.toLocaleString()}</span></div>
    `;
  
    main.prepend(wrapper);
  

    requestAnimationFrame(() => {
      const fullHeight = wrapper.scrollHeight;
      wrapper.style.height = "50px";
      wrapper.style.opacity = "1";
    });
  }
  
  
  

  async function connectSolanaWallet() {
    const warning = document.getElementById("phantom-warning");
  
    if (window.solana?.isPhantom) {
      try {
        // ⏳ Show loader inside wallet message
        const msgBox = document.getElementById("wallet-message");
        if (msgBox) {
          msgBox.innerHTML = `
            <div id="loader-wrapper" class="flex justify-center items-center w-full py-8">
              <div class="loader"></div>
            </div>
          `;
        }
  
        const resp = await window.solana.connect();
        walletAddress = resp.publicKey.toString();
        warning?.classList.add("hidden");
  
        // Wait 0.5s before continuing
        setTimeout(async () => {
            document.getElementById("wallet-message")?.remove(); // Remove message box completely
          
            // ✅ Update button text
            const connectBtn = document.getElementById("connect-wallet");
            if (connectBtn) {
              connectBtn.textContent = "Connected";
            }
          
            await checkTrixiBalance();
          }, 500);
          
          
      } catch (err) {
        console.error("Phantom connection error:", err);
        showPhantomWarning();

      }
    } else {
      showPhantomWarning();

    }

    function showPhantomWarning() {
      const warning = document.getElementById("phantom-warning");
      if (!warning) return;
    
      warning.classList.remove("hidden");
    
      // Clear any existing timer
      clearTimeout(warning.dataset.timer);
    
      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        warning.classList.add("hidden");
      }, 3000);
      warning.dataset.timer = timeout;
    
      // Hide if user clicks anywhere else
      const handler = (e) => {
        if (!warning.contains(e.target)) {
          warning.classList.add("hidden");
          document.removeEventListener("click", handler);
        }
      };
    
      // Defer attaching handler to avoid catching the click that triggered it
      setTimeout(() => {
        document.addEventListener("click", handler);
      }, 0);
    }
    

  }
  
  
  
  
  
  async function checkTrixiBalance() {
    try {
      const conn = new solanaWeb3.Connection(
        "https://rpc.helius.xyz/?api-key=acad15a6-4a95-47f6-b6f5-b5922e99413a",
        "confirmed"
      );
  
      const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
        new solanaWeb3.PublicKey(walletAddress),
        {
          programId: new solanaWeb3.PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }
      );
  
      for (let acc of tokenAccounts.value) {
        const tokenInfo = acc.account.data.parsed.info;
        const mint = tokenInfo.mint;
        const balance = parseFloat(tokenInfo.tokenAmount.uiAmount);
  
        if (mint === "BE7o6vC8c7yXbXYodksospGs6g58SFa68ziUHoMg733v") {
          trixiBalance = balance;
          break;
        }
      }
  
      updateUIAccess(trixiBalance >= MIN_REQUIRED);
    } catch (e) {
      console.error("Balance fetch error:", e);
    }

    const settingsBtn = document.getElementById("settings-btn");
const dropdown = document.getElementById("settings-dropdown");

if (settingsBtn && dropdown) {
  settingsBtn.onclick = () => {
    dropdown.classList.toggle("hidden");
  };
}

document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("settings-dropdown");
    const btn = document.getElementById("settings-btn");
  
    if (!dropdown || !btn) return;
  
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
  
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("settings-dropdown");
    const btn = document.getElementById("settings-btn");
  
    if (!dropdown || !btn) return;
  
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
    

}
  
document.getElementById("disconnect-wallet")?.addEventListener("click", () => {
  window.solana?.disconnect();
  walletAddress = null;
  trixiBalance = 0;
  updateUIAccess(false);

  const bar = document.getElementById("wallet-panel-wrapper");
  if (bar) bar.remove();

  // ✅ Hide the dropdown
  const dropdown = document.getElementById("settings-dropdown");
  dropdown?.classList.add("hidden");
});

  

// Initial gate
window.addEventListener("DOMContentLoaded", () => updateUIAccess(false));
