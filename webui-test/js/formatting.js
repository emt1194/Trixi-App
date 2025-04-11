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
  let lastUnformattedText = '';
  
  function getUnformattedBodyText() {
    const clone = outputEl.cloneNode(true);
  
    // Remove known formatting wrapper if exists
    const formatted = clone.querySelector('#formatted');
    if (formatted) formatted.remove();
  
    // Remove the static trixi header (by class or id)
    const trixi = clone.querySelector('.trixi-says, #trixi-says');
    if (trixi) trixi.remove();
  
    return clone.textContent.trim();
  }
  
  function observeOutputFormatting() {
    if (!outputEl) return;
  
    const hasFormatted = outputEl.querySelector('#formatted');
    const unformatted = getUnformattedBodyText();
  
    if (!hasFormatted && unformatted && unformatted !== lastUnformattedText) {
      lastUnformattedText = unformatted;
  
      // Preserve the static header
      const preservedHeader = outputEl.querySelector('.trixi-says, #trixi-says')?.outerHTML || '';
  
      const formattedHTML = formatMarkdownLike(unformatted);
      outputEl.innerHTML = preservedHeader + formattedHTML;
    }
  }
  
  // Run every 200ms
  setInterval(observeOutputFormatting, 200);
  