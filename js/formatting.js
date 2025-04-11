function formatMarkdownLike(text) {
    if (!text) return '';
  
    // Escape HTML
    text = text.replace(/[&<>"']/g, match => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#039;'
    }[match]));
  
    // Bold and Italic
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  
    // Convert to lists and paragraphs
    const lines = text.split('\n');
    let html = '';
    let inList = false;
  
    for (const line of lines) {
      if (/^\s*-\s+/.test(line)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${line.replace(/^\s*-\s+/, '')}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (line.trim()) html += `<p>${line.trim()}</p>`;
      }
    }
  
    if (inList) html += '</ul>';
    return `<div id="formatted">${html}</div>`;
  }
  
  const outputEl = document.getElementById('output');
  const commandInput = document.getElementById('command');
  
  let lastUnformattedText = '';
  let lastCommand = '';
  
  function getUnformattedBodyText() {
    const clone = outputEl.cloneNode(true);
  
    // Remove any previously formatted content
    const formatted = clone.querySelector('#formatted');
    if (formatted) formatted.remove();
  
    // Remove the header
    const trixi = clone.querySelector('.trixi-says, #trixi-says');
    if (trixi) trixi.remove();
  
    return clone.textContent.trim();
  }
  
  function observeOutputFormatting() {
    if (!outputEl || !commandInput) return;
  
    const command = commandInput.value.trim();
    if (!command.startsWith('/ask')) return;
  
    const hasFormatted = outputEl.querySelector('#formatted');
    const unformatted = getUnformattedBodyText();
  
    if (!hasFormatted && unformatted && unformatted !== lastUnformattedText) {
      lastUnformattedText = unformatted;
      lastCommand = command;
  
      // Preserve static header
      const header = outputEl.querySelector('.trixi-says, #trixi-says')?.outerHTML || '';
      const formattedHTML = formatMarkdownLike(unformatted);
      outputEl.innerHTML = header + formattedHTML;
    }
  }
  
  setInterval(observeOutputFormatting, 200);
  