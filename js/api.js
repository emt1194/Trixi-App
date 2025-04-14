const BASE_URL = 'https://brain.trixiai.net/api/social';

document.getElementById('command').addEventListener('change', () => {
  const isAsk = window.getResolvedCommand() === '/ask';
});

document.getElementById('runBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim().replace(/^@/, '');
  const rawInput = document.getElementById('command').value.trim();
  const command = rawInput.startsWith('/ask') ? '/ask' : rawInput;
  const question = rawInput.startsWith('/ask') ? rawInput.replace('/ask', '').trim() : '';
  const output = document.getElementById('output');

  let url = BASE_URL;
  let method = 'GET';
  let body = null;

  // Show loader animation
  output.innerHTML = '<div class="loader"></div>';

  // ASK handler – no username required
  if (command === '/ask') {
    if (!question) {
      return output.innerHTML = '<p class="text-red-600">Please enter a question after /ask.</p>';
    }
    url += `/ai`;
    method = 'POST';
    body = JSON.stringify({ question });
  }
  // Trends and Usage (no username)
  else if (command === '/usage' || command === '/trends') {
    url += `${command}?limit=10`;
  }
  // All other commands require username
  else {
    if (!username) {
      return output.innerHTML = '<p class="text-red-600">Username required.</p>';
    }
    const needsLimit = ['/followers', '/following', '/posts'].includes(command);
    url += `${command}/${username}${needsLimit ? '?limit=10' : ''}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(method === 'POST' ? { body } : {})
    });

    const data = await res.json();

    // Check if the response is not an array where expected
    if (['/followers', '/following', '/posts'].includes(command) && !Array.isArray(data)) {

      output.innerHTML = '<p class="text-red-600">No profile found with that name.</p>';
      return;
    }

    // Render as usual
    output.innerHTML = formatOutput(data, command);

  } catch (err) {
    output.innerHTML = `<p class="text-red-600">Error: ${err.message}</p>`;
  }
});

// Enable hitting Enter anywhere inside the command input to trigger run
document.getElementById('command').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    document.getElementById('runBtn')?.click();

    // Optional visual confirmation (flash effect)
    const runBtn = document.getElementById('runBtn');
    runBtn.classList.add('ring', 'ring-green-400');
    setTimeout(() => runBtn.classList.remove('ring', 'ring-green-400'), 300);
  }
});
