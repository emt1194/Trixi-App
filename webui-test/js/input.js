const COMMANDS = [
  '/profile',
  '/followers',
  '/following',
  '/posts',
  '/analyze',
  '/trends',
  '/ask'
];

const commandInput = document.getElementById('command');
const dropdown = document.getElementById('commandDropdown');
let tabIndex = 0;
let currentSuggestions = [];

function updateDropdown() {
  const value = commandInput.value.trim();
  const showCommands = value.startsWith('/');
  const filter = value.toLowerCase();
  dropdown.innerHTML = '';

  if (!showCommands) {
    dropdown.classList.add('hidden');
    return;
  }

  const filtered = COMMANDS.filter(cmd => cmd.includes(filter));
  currentSuggestions = filtered;
  tabIndex = -1;

  if (filtered.length === 0) {
    dropdown.classList.add('hidden');
    return;
  }

  filtered.forEach(cmd => {
    const item = document.createElement('div');
    item.className = 'px-3 py-2 hover:bg-[#2f2f36] cursor-pointer text-sm border-b border-[#3a3a40] last:border-b-0';
    item.textContent = cmd;
    item.onclick = () => {
      commandInput.value = cmd;
      dropdown.classList.add('hidden');
      updateUIState();
    };
    dropdown.appendChild(item);
  });

  dropdown.classList.remove('hidden');
  updateUIState();
}

function updateUIState() {
  const value = commandInput.value.trim();
  const isValidCommand = COMMANDS.includes(value);
  const isFilled = value.length > 0;

  document.getElementById('clearBtn')?.classList.toggle('hidden', !isFilled);
  document.getElementById('enterBtn')?.classList.toggle('hidden', !isValidCommand);
}

['focus', 'click'].forEach(evt => {
  commandInput.addEventListener(evt, () => {
    const value = commandInput.value.trim();

    if (!value.startsWith('/')) {
      dropdown.innerHTML = '';
      currentSuggestions = COMMANDS;
      tabIndex = -1;

      COMMANDS.forEach(cmd => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 hover:bg-[#2f2f36] cursor-pointer text-sm border-b border-[#3a3a40] last:border-b-0';
        item.textContent = cmd;
        item.onclick = () => {
          commandInput.value = cmd;
          dropdown.classList.add('hidden');
          updateUIState();
        };
        dropdown.appendChild(item);
      });

      dropdown.classList.remove('hidden');
      requestAnimationFrame(() => {
        dropdown.classList.add('scale-y-100', 'opacity-100');
        dropdown.classList.remove('scale-y-0', 'opacity-0');
      });

    } else {
      updateDropdown();
    }

    updateUIState();
  });
});

commandInput.addEventListener('input', () => {
  updateDropdown();
  updateUIState();
});

document.addEventListener('click', e => {
  if (!dropdown.contains(e.target) && e.target !== commandInput) {
    dropdown.classList.remove('scale-y-100', 'opacity-100');
    dropdown.classList.add('scale-y-0', 'opacity-0');
    setTimeout(() => dropdown.classList.add('hidden'), 300);
  }
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
  commandInput.value = '';
  updateDropdown();
  updateUIState();
});

commandInput.addEventListener('keydown', e => {
  const value = commandInput.value.trim();
  const isCommand = COMMANDS.includes(value);
  const isAskCommand = value.startsWith('/ask ') && value.length > 5;

  if (e.key === 'Enter') {
    if (isCommand || isAskCommand) {
      document.getElementById('runBtn')?.click();
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    if (currentSuggestions.length > 0) {
      tabIndex = (tabIndex + 1) % currentSuggestions.length;
      commandInput.value = currentSuggestions[tabIndex];
      updateDropdown();
      updateUIState();
    }
  }
});


// Resolves input to a valid command
window.getResolvedCommand = function () {
  const raw = commandInput.value.trim();
  return raw.startsWith('/') ? raw : '/ask';
};

// Returns text only if not a command
window.getFreeformText = function () {
  const raw = commandInput.value.trim();
  return raw.startsWith('/') ? '' : raw;
};

// Reset username input on load
window.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  if (usernameInput) usernameInput.value = '';
});
