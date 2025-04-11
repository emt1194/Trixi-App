const VALID_COMMANDS = [
    '/profile',
    '/followers',
    '/following',
    '/posts',
    '/analyze',
    '/trends'
  ];
  
  function checkValidCommandInput() {
    const input = document.getElementById('command');
    const runBtn = document.getElementById('runBtn');
    const enterBtn = document.getElementById('enterBtn');
  
    if (!input || !runBtn || !enterBtn) return;
  
    const value = input.value.trim();
  
    if (value.length === 0) {
      runBtn.disabled = true;
      runBtn.classList.remove('gradient-border-button');
      enterBtn.classList.add('hidden');
      return;
    }
  
    const isExactMatch = VALID_COMMANDS.includes(value);
    const isAskCommand = value.startsWith('/ask ') && value.length > 5;
    const enable = isExactMatch || isAskCommand;
  
    runBtn.disabled = !enable;
    enterBtn.classList.toggle('hidden', !enable);
  
    if (enable) {
      runBtn.classList.add('gradient-border-button');
    } else {
      runBtn.classList.remove('gradient-border-button');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('command');
    const dropdown = document.getElementById('commandDropdown');
  
    if (!input) return;
  
    input.addEventListener('input', checkValidCommandInput);
    input.addEventListener('change', checkValidCommandInput);
    checkValidCommandInput(); // Initial state
  
    // When user clicks a dropdown option
    if (dropdown) {
      dropdown.addEventListener('click', () => {
        setTimeout(() => {
          checkValidCommandInput(); // Wait for input to update
        }, 10);
      });
    }
  });
  
