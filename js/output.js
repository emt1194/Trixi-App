// Text to be typed
const textLines = [
	"[INFO] {timestamp} - Initiating scanning process...",
	"[INFO] {timestamp} - Connecting to Solana blockchain node...",
	"[INFO] {timestamp} - Fetching latest transactions from Solana network...",
	"[SCAN] Solana Blockchain: 80% complete",
	"[SCAN] - Transaction count: 1,524,397",
	"[SCAN] - Latest block hash: 5ajdb7...93gaj3",
	"[SCAN] - Real-time data synchronization: Synced at block height 2,389,214",
	"[SCAN] - Validating accounts: 1,320 active accounts detected",
	"[SCAN] - Token transfers: 1,000+ transactions verified",
	"[INFO] {timestamp} - Scanning Twitter for related sentiment...",
	"[INFO] {timestamp} - Fetching tweets using #Solana, #Crypto, and #Blockchain...",
	"[TWITTER SCAN] - 250 tweets processed",
	"[TWITTER SCAN] - Sentiment analysis: Positive (65%), Neutral (25%), Negative (10%)",
	"[TWITTER SCAN] - Top influencers detected: @SolanaDev, @CryptoGuru, @BlockchainXpert",
	"[INFO] {timestamp} - Connecting to Telegram channels...",
	"[INFO] {timestamp} - Scanning Solana-related Telegram groups...",
	"[TELEGRAM SCAN] - 10 channels monitored",
	"[TELEGRAM SCAN] - Message activity: 3,250 messages processed",
	"[TELEGRAM SCAN] - User sentiment: Positive (70%), Neutral (20%), Negative (10%)",
	"[INFO] {timestamp} - Analyzing web data for Solana-related articles...",
	"[INFO] {timestamp} - Fetching articles from top crypto news sites and blogs...",
	"[WEB SCAN] - 15 articles analyzed",
	"[WEB SCAN] - Trending topics: 'Solana price surge', 'network scalability', 'NFT marketplace growth'",
	"[WEB SCAN] - Article sentiment: Positive (80%), Neutral (15%), Negative (5%)",
	"[INFO] {timestamp} - Data aggregation complete.",
	"[INFO] {timestamp} - Analysis summary:\n    - Solana Blockchain: Positive trend detected in token activity and transaction volume.\n    - Twitter: Strong community engagement, with influencers actively participating.\n    - Telegram: High volume of messages, with significant discussions about staking and validator performance.\n    - Web: Increased interest in Solana's scalability and ecosystem growth.",
	"[INFO] {timestamp} - Preparing real-time alerts for further developments...",
	"[INFO] {timestamp} - Scan complete. Awaiting next data retrieval.",
	"[INFO] {timestamp} - SYSTEM STATUS: READY"
  ];
  
  const consoleOutput = document.getElementById('console-output');
  let lineIndex = 0; // Current line being typed
  
  // Function to get the current timestamp in a readable format
  function getTimestamp() {
	const now = new Date();
	return now.toLocaleTimeString(); // You can customize this format as needed
  }
  
  // Replace {timestamp} with the current timestamp
  function replaceTimestamp(line) {
	return line.replace(/{timestamp}/g, getTimestamp());
  }
  
  // Function to simulate typing the text
  function typeText(text, index = 0) {
	if (index < text.length) {
	  consoleOutput.innerHTML += text.charAt(index);
	  setTimeout(() => typeText(text, index + 1), 20); // Speed increased
	} else {
	  // Move to the next line after one line is completed
	  consoleOutput.innerHTML += "<br />";
	  // When all lines are completed, restart from the first line
	  if (lineIndex < textLines.length - 1) {
		lineIndex++;
		setTimeout(() => typeNextLine(), 500);
	  } else {
		lineIndex = 0; // Reset to the first line
		setTimeout(() => typeNextLine(), 1000);
	  }
	}
  }
  
  // Function to trigger the typing effect for each line
  function typeNextLine() {
	const line = replaceTimestamp(textLines[lineIndex]);
	typeText(line);
  }
  
  // Start typing the first line after the page is loaded
  window.onload = () => {
	typeNextLine();
  };
  