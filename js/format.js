// format.js

function formatOutput(data, command) {
  if (command === '/profile') {
    return `
      <div class="bg-[#1C1E26] text-white p-4 rounded-md">
        <div class="flex items-center space-x-4">
          <img src="${data.profileImageUrl}" alt="Profile Image" class="w-16 h-16 rounded-full">
          <div>
            <p class="text-lg font-semibold">@${data.username} (${data.name})</p>
            <p class="text-sm text-gray-400">Joined: ${new Date(data.joined).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="mt-4 space-y-1 text-sm">
          <p>👥 Followers: ${data.followersCount}</p>
          <p>🔗 Following: ${data.followingCount}</p>
          <p>📝 Tweets: ${data.postsCount}</p>
          <p>❤️ Likes: ${data.likesCount}</p>
          <p>✅ Verified: ${data.isVerified ? 'Yes' : 'No'}</p>
          <p>💙 Blue Verified: ${data.isBlueVerified ? 'Yes' : 'No'}</p>
        </div>
      </div>
    `;
  }

  if (command === '/analyze') {
    const profile = data.profile;
    const percent = (val, total) => ((val / total) * 100).toFixed(1);
    return `
      <div class="bg-[#1C1E26] text-white p-4 rounded-md whitespace-pre-wrap h-auto">
📈 TWITTER ANALYTICS REPORT 📈
━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐️ Account: @${profile.username}
⏰ Created: ${new Date(profile.joined).toLocaleDateString()}
🔗 Profile: twitter.com/${profile.username}

📊 ACCOUNT METRICS
━━━━━━━━━━━━━━━━
👥 Total Followers: ${profile.followersCount}
📝 Total Tweets: ${profile.postsCount}
🔥 Likes: ${profile.likesCount}

📈 FOLLOWER ANALYSIS
━━━━━━━━━━━━━━━━
✅ Verified: ${data.verifiedFollowers} (${percent(data.verifiedFollowers, data.totalFollowers)}%)
💰 Real: ${data.realFollowers} (${percent(data.realFollowers, data.totalFollowers)}%)
⚠️ Suspicious: ${data.suspiciousFollowers} (${percent(data.suspiciousFollowers, data.totalFollowers)}%)

🔥 ENGAGEMENT METRICS
━━━━━━━━━━━━━━━━
📈 Avg. Account Age: ${data.averageAccountAge.toFixed(1)} years
🚀 Engagement Rate: ${data.engagementRate.toFixed(2)}%
      </div>
    `;
  }

  if (command === '/followers' || command === '/following') {
    return `
      <div class="grid gap-4">
        ${data.map(user => `
          <div class="bg-[#1C1E26] text-white p-4 rounded-md">
            <div class="flex items-center space-x-4">
              <img src="${user.profileImageUrl}" alt="${user.username}" class="w-12 h-12 rounded-full">
              <div>
                <p class="text-sm font-semibold">@${user.username} (${user.name})</p>
                <p class="text-xs text-gray-400">Joined: ${new Date(user.joined).toLocaleDateString()}</p>
              </div>
            </div>
            <div class="mt-2 text-xs space-y-1">
              <p>👥 Followers: ${user.followersCount}</p>
              <p>🔗 Following: ${user.followingCount}</p>
              <p>📝 Tweets: ${user.postsCount}</p>
              <p>❤️ Likes: ${user.likesCount}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (command === '/posts') {
    return `
      <div class="space-y-4">
        ${data.map(post => `
          <div class="bg-[#1C1E26] text-white p-4 rounded-md">
            <p class="text-sm">${post.text}</p>
            <div class="mt-2 text-xs text-gray-400 flex justify-between">
              <span>Date: ${new Date(post.createdAt).toLocaleString()}</span>
              <span>❤️ ${post.likes} 🔁 ${post.retweets} 💬 ${post.replies}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (command === '/trends') {
    return `
      <div class="space-y-2">
        ${data.map(trend => `
          <div class="bg-[#1C1E26] text-white p-4 rounded-md">
            <a href="${trend.url}" class="text-blue-400 underline" target="_blank">#${trend.name}</a>
            <p class="text-sm text-gray-400">Tweet Volume: ${trend.tweetVolume}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (command === '/ai') {
    return `
      <div class="bg-[#1C1E26] text-white p-4 rounded-md">
        <p>${data.answer}</p>
      </div>
    `;
  }

  if (command === '/ask') {
    const selected = localStorage.getItem('selectedTrixi') || '1';
    const avatarUrl = {
      1: './img/trixi-avatar-cgi.jpg',
      2: './img/trixi-avatar-dbz.jpg',
      3: './img/trixi-avatar-cyberpunk.jpg',
      4: './img/trixi-avatar-pixel.jpg',
      5: './img/trixi-avatar-ghibli.jpg'
    }[selected];
  
    return `
      <div class="bg-[#1C1E26] text-white p-4 rounded-md">
        <h3 id="trixi-says" class="text-lg trixi-says font-semibold text-[#00FFA3] mb-2 flex items-center gap-2">
          <img src="${avatarUrl}" alt="Trixi Avatar" class="w-[30px] h-[30px] rounded-full" />
          TrixiAI says:
        </h3>
        <p class="text-sm text-white leading-relaxed">${data.answer}</p>
      </div>
    `;
  }
  

  return `<pre class="bg-[#1C1E26] text-white p-4 rounded-md whitespace-pre-wrap">${JSON.stringify(data, null, 2)}</pre>`;
}

window.formatOutput = formatOutput;
