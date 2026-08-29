const fs = require('fs');

// 1. Update style.css
let style = fs.readFileSync('style.css', 'utf8');

// Global
style += `
button { transition: all 0.2s; }
.navbar { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
#scroll-top {
    position: fixed; bottom: 30px; right: 30px;
    background: #58CC02; color: white; border: none;
    width: 50px; height: 50px; border-radius: 50%;
    font-size: 24px; font-weight: bold; cursor: pointer;
    display: none; align-items: center; justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 10000;
}
#scroll-top:hover { background: #46A302; transform: translateY(-3px); }
`;

// Home Page
style += `
@keyframes pulseBtn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.cta-button { animation: pulseBtn 2s infinite; }
.feature-card { transition: all 0.3s; }
.feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
`;

// Practice Page
style += `
@keyframes shakeEmpty { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-8px);} 75%{transform:translateX(8px);} }
.shake-empty { animation: shakeEmpty 0.4s; }

.result-section:nth-child(1) { animation: fadeInStagger 0.3s ease 0.1s both; }
.result-section:nth-child(2) { animation: fadeInStagger 0.3s ease 0.2s both; }
.result-section:nth-child(3) { animation: fadeInStagger 0.3s ease 0.3s both; }
.result-section:nth-child(4) { animation: fadeInStagger 0.3s ease 0.4s both; }
@keyframes fadeInStagger { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// Leaderboard Page
style += `
.badge:hover { animation: spinBadge 1s linear; }
@keyframes spinBadge { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
.leaderboard-table tr.your-row { box-shadow: 0 0 15px rgba(88,204,2,0.3); }
`;

fs.writeFileSync('style.css', style);

// 2. Update gamification.js (for scroll to top globally, except game.html)
let gamification = fs.readFileSync('gamification.js', 'utf8');
if (!gamification.includes('scroll-top')) {
    gamification = gamification.replace(/initScrollToTop\(\) \{[\s\S]*?btn\.addEventListener\('click', \(\) => \{[\s\S]*?\}\);[\s\S]*?\}/, `initScrollToTop() {
        const btn = document.createElement('button');
        btn.id = 'scroll-top';
        btn.innerHTML = '↑';
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            if(btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }`);
    fs.writeFileSync('gamification.js', gamification);
}

// 3. Update script.js (Practice page logic)
let script = fs.readFileSync('script.js', 'utf8');
script = script.replace(/const codeInput = document\.getElementById\('code-input'\)\.value;/, `const codeInput = document.getElementById('code-input').value;
    if(!codeInput.trim()) {
        const btn = document.querySelector('.cta-button');
        btn.classList.add('shake-empty');
        setTimeout(() => btn.classList.remove('shake-empty'), 400);
        return;
    }`);

script = script.replace(/function copyCode\(\) \{[\s\S]*?\}\)/, `function copyCode() {
    const code = document.getElementById('fixed-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const oldText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = oldText, 2000);
    });
}`);
fs.writeFileSync('script.js', script);

// 4. Update leaderboard.js (tooltips and your-row)
let leaderboard = fs.readFileSync('leaderboard.js', 'utf8');
leaderboard = leaderboard.replace(/const isLocked = levelNum > currentLevel;/g, `const isLocked = levelNum > currentLevel;
        const titleAttr = isLocked ? 'title="Keep going to unlock!"' : '';`);
leaderboard = leaderboard.replace(/<div class="badge \${lockedClass}">/g, `<div class="badge \${lockedClass}" \${titleAttr}>`);
fs.writeFileSync('leaderboard.js', leaderboard);

// Add your-row class in leaderboard.js logic if needed... Actually the prompt says "Your row (green highlighted) has a subtle glow". In leaderboard.js there is already a highlighting logic probably.
leaderboard = leaderboard.replace(/row\.className = 'highlight';/, `row.className = 'highlight your-row';`);
fs.writeFileSync('leaderboard.js', leaderboard);


// 5. Update game.html (self-contained)
let game = fs.readFileSync('game.html', 'utf8');

// Inject styles to game.html
game = game.replace(/<\/style>/, `
        button { transition: all 0.2s; }
        .navbar { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        button:active { transform: scale(0.97); }
        
        @keyframes greenPulse { 0%{background:#1a4a1a;} 50%{background:#2d8a2d;} 100%{background:#1a4a1a;} }
        .code-line.correct { animation: greenPulse 0.5s ease forwards; background: #1a4a1a; }
        
        #scroll-top {
            position: fixed; bottom: 30px; right: 30px;
            background: #58CC02; color: white; border: none;
            width: 50px; height: 50px; border-radius: 50%;
            font-size: 24px; font-weight: bold; cursor: pointer;
            display: none; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 10000;
        }
        #scroll-top:hover { background: #46A302; transform: translateY(-3px); }
    </style>`);

// Inject scroll to top button in game.html
game = game.replace(/<\/main>/, `</main>\n    <button id="scroll-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑</button>`);

// Inject scroll to top logic in game.html
game = game.replace(/<\/script>/, `
        window.onscroll = function() {
            var btn = document.getElementById('scroll-top');
            if(btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        };
    </script>`);

fs.writeFileSync('game.html', game);

console.log("Polish applied successfully.");
