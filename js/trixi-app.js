function truncateAddress(addr) {
  return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
}


const TRIXI_MINT = "BE7o6vC8c7yXbXYodksospGs6g58SFa68ziUHoMg733v";
const connection = new solanaWeb3.Connection("https://rpc.helius.xyz/?api-key=acad15a6-4a95-47f6-b6f5-b5922e99413a");
async function connectSolanaWallet() {
  try {
     if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        const walletAddress = resp.publicKey.toString();
        const connectButton = document.querySelector('.solana-button'); // Select the button

        if (connectButton) {
           connectButton.textContent = "Wallet Connected"; // Change button text
        }

        const addressDisplay = document.getElementById('wallet-address-display');
        addressDisplay.innerHTML = `${walletAddress} Loading balances...`;
        addressDisplay.classList.remove('hidden');

        // Get SOL balance
        const balanceLamports = await connection.getBalance(resp.publicKey);
        const solBalance = balanceLamports / solanaWeb3.LAMPORTS_PER_SOL;

        // Get $TRIXI balance (SPL token)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
           resp.publicKey, {
              mint: new solanaWeb3.PublicKey(TRIXI_MINT)
           }
        );

        let trixiBalance = 0;
        if (tokenAccounts.value.length > 0) {
           trixiBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        }

        // Display wallet info - Old, working
        addressDisplay.innerHTML = `
 <div class="wallet-info-panel">
   <div class="text-sm text-right w-full">
     <div>
       <span class="text-gray-400">Wallet Address:</span>
       <span class="text-white ml-1">${truncateAddress(walletAddress)}</span>
     </div>
     <div class="flex justify-end gap-6 mt-1 text-sm">
       <div>
         <span class="text-gray-400">$SOL:</span>
         <span class="text-[#00FFA3] ml-1">${solBalance.toFixed(4)}</span>
         <span class="text-gray-400 ml-2">$TRIXI:</span>
         <span class="text-[#00FFA3] ml-1 trixi-balance" id="trixi-balance">${trixiBalance.toFixed(2)}</span>
         <span class="text-gray-400 ml-2">$USD:</span>
         <span class="text-[#00FFA3] ml-1" id="trixi-usd"></span>
       </div>
     </div>
   </div>
 </div>
`;

        setTimeout(() => {
           const wrapper = document.getElementById("wallet-panel-wrapper");
           if (wrapper) {
              // Reset the class to force reanimation
              wrapper.classList.remove("visible");

              // Force reflow (browser flushes styles)
              void wrapper.offsetWidth;

              // Re-add class to trigger animation
              wrapper.classList.add("visible");
           }
        }, 1000);


        document.getElementById('trixi1').innerText = `${trixiBalance.toFixed(2)}`;


      } else {
         const warning = document.getElementById("phantom-warning-float");
         const btn = document.querySelector(".solana-button");
      
         if (warning && btn) {
            const rect = btn.getBoundingClientRect();
      
            // Position the floating element near the button
            warning.style.top = `${rect.bottom + window.scrollY + 8}px`;
            warning.style.left = `${rect.right - warning.offsetWidth}px`;
            warning.classList.remove("hidden");
      
            // Auto-hide after 5 seconds
            setTimeout(() => {
               warning.classList.add("hidden");
            }, 5000);
         }
      }
      
  } catch (err) {
     console.error("Wallet connection or RPC call failed:", err);
     document.getElementById('wallet-address-display').innerHTML += "<br>⚠️ Error fetching balances.";
  }
}


const settingsBtn = document.getElementById('settings-btn');
const settingsIconBtn = document.querySelector('.button-small'); // this is the cog icon
const settingsDropdown = document.getElementById('settings-dropdown');
const disconnectBtn = document.getElementById('disconnect-wallet');

// Toggle dropdown
function toggleDropdown() {
  settingsDropdown.classList.toggle('hidden');
}

settingsBtn?.addEventListener('click', toggleDropdown);
settingsIconBtn?.addEventListener('click', toggleDropdown);

// Disconnect wallet
disconnectBtn?.addEventListener('click', async () => {
  if (window.solana?.disconnect) {
     await window.solana.disconnect();
  }

  const addressDisplay = document.getElementById('wallet-address-display');
  addressDisplay.classList.add('hidden');
  addressDisplay.textContent = ''; // Clear content

  // Change the button text back to "Connect Wallet"
  const connectButton = document.querySelector('.solana-button');
  if (connectButton) {
     connectButton.textContent = "Connect Wallet"; // Revert button text
  }

  settingsDropdown.classList.add('hidden');
});


// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const isClickInside =
     settingsBtn?.contains(e.target) ||
     settingsIconBtn?.contains(e.target) ||
     settingsDropdown.contains(e.target);

  if (!isClickInside) {
     settingsDropdown.classList.add('hidden');
  }

  if (connectButton) {
     connectButton.textContent = "Connect Wallet";
  }
});

// Function to update button states based on wallet connection
function updateButtonState() {
  const settingsBtn = document.getElementById('settings-btn'); // Get the settings button

  // Check if wallet is connected
  const isWalletConnected = window.solana && window.solana.isPhantom && window.solana.isConnected;

  // If the wallet is not connected, make the button unclickable (apply inactive style)
  if (settingsBtn) {
     if (isWalletConnected) {
        settingsBtn.classList.remove('inactive-button'); // Enable the button
     } else {
        settingsBtn.classList.add('inactive-button'); // Disable the button
     }
  }
}

// Call the updateButtonState function when the page loads or when wallet state changes
document.addEventListener('DOMContentLoaded', () => {
  updateButtonState(); // Initial check when the page is loaded
});

// Listen for changes in wallet connection state (for disconnect)
window.solana?.on('disconnect', () => {
  updateButtonState(); // Update the button state when wallet is disconnected
});


// Call updateButtonState when the connect wallet button is clicked
document.querySelector('.solana-button')?.addEventListener('click', async () => {
  // Wait for wallet connection and then update button states
  await connectSolanaWallet();
  updateButtonState(); // Update the button state after connection
});

// Listen for changes in wallet connection state (for disconnect)
window.solana?.on('disconnect', () => {
  updateButtonState(); // Update the button state when wallet is disconnected
});

// Get the price from dexscreener API, divide by token balance, to get USD, and display it. Then, if it's over [$50USD], unlock the interface.

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

// Define the chainId and pairId for Solana and your specific pair
const chainId = 'solana';
const pairId = 'JA2UJrZLxwY5puk6yNAS63FEA83o7xgriEFp8yqMWeLq'; // Replace with your pair ID

// Construct the URL for the DexScreener API request
const url = `https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairId}`;

fetch(url, requestOptions)
  .then((response) => response.json()) // Parsing JSON from the response
  .then((result) => {


     // Extract the USD price from the API response
     const priceUsd = result?.pair?.priceUsd || 'N/A'; // Access priceUsd from the response

     // Get the div element where we want to display the price
     const priceDiv = document.getElementById('token-price');
     const trixi2Div = document.getElementById('trixi2');

     // Display the price in the div
     if (priceUsd !== 'N/A') {
        priceDiv.innerHTML = `${priceUsd}`;
        trixi2Div.innerHTML = priceUsd;
     } else {
        priceDiv.innerHTML = 'Price not available';
     }

  })
  .catch((error) => {
     console.error('Error fetching price:', error);

     // In case of error, display a failure message in the div
     const priceDiv = document.getElementById('token-price');
     priceDiv.innerHTML = 'Failed to load price';
  });


// Function to multiply trixi1 and trixi2, and display the result in trixi-usd
function multiplyAndDisplay() {
  // Get the numeric values from trixi1 and trixi2
  let trixiBalance = parseFloat(document.getElementById('trixi1').innerText) || 0;
  let priceUsd = parseFloat(document.getElementById('trixi2').innerText) || 0;

  // Multiply the values
  let result = trixiBalance * priceUsd;

  // Display the result USD Balance
  document.getElementById('trixi-usd').innerText = `${result.toFixed(2)}`;

  const primaryPanel = document.getElementById('primary-panel'); // Get the primary-panel element

  // If the result is less than 50, keep the panel inactive
  if (result < 50) {
     primaryPanel.classList.add('panel-inactive');
  } else {
     primaryPanel.classList.remove('panel-inactive');
  }
}

// Function to check if the wallet is connected and reapply panel-inactive if disconnected
function checkWalletConnection() {
  const primaryPanel = document.getElementById('primary-panel');
  const inactiveText = primaryPanel.querySelector('.panel-message-inactive');
  const activeText = primaryPanel.querySelector('.panel-message-active');
  const trixiUsd = document.getElementById('trixi-usd');

  const setPanelState = (isConnected) => {
     if (isConnected) {
        primaryPanel.classList.remove('panel-inactive');
        inactiveText.classList.add('hidden');
        activeText.classList.remove('hidden');
     } else {
        primaryPanel.classList.add('panel-inactive');
        trixiUsd.innerText = "Please connect wallet";
        inactiveText.classList.remove('hidden');
        activeText.classList.add('hidden');
     }
  };

  if (window.solana && window.solana.isPhantom) {
     setPanelState(window.solana.isConnected);
  } else {
     setPanelState(false);
  }
}


// Refresh the check every 500ms
setInterval(function () {
  checkWalletConnection(); // Check wallet connection and update the panel accordingly
  multiplyAndDisplay(); // Perform multiplication and display result
}, 500);


// video fix

const primaryPanel = document.getElementById("primary-panel");
const video = document.getElementById("trixi-video");

const activateVideo = () => {
  if (!primaryPanel.classList.contains("panel-inactive")) {
     video.classList.remove("hidden");
     video.muted = true;
     video.autoplay = true;
     video.play().catch(() => {}); // avoid autoplay errors
  }
};


const fingerprintText = document.getElementById("fingerprint-text");

function getRandomHash(length = 12) {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < length; i++) {
     hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function updateFingerprintHash() {
  fingerprintText.textContent = "analyzing: " + getRandomHash();
}

// Update every 200ms for a fast flicker effect
setInterval(updateFingerprintHash, 200);

// Modal js


  window.addEventListener('DOMContentLoaded', () => {
    // Only show once per session (optional)
    if (!sessionStorage.getItem('modalShown')) {
      document.getElementById('welcome-modal').style.display = 'flex';
      sessionStorage.setItem('modalShown', 'true');
    }
  });

  function closeModal() {
    document.getElementById('welcome-modal').style.display = 'none';
    if (modal) modal.style.display = 'none';
  }


  document.addEventListener("click", (e) => {
   const warning = document.getElementById("phantom-warning-float");
 
   // Skip if it's not showing
   if (warning.classList.contains("hidden")) return;
 
   // Check if the click was outside the warning and the connect button
   const connectBtn = document.querySelector(".solana-button");
   if (!warning.contains(e.target) && !connectBtn.contains(e.target)) {
     warning.classList.add("hidden");
   }
 });
 