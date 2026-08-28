const fs = require('fs');

const confettiFn = `
function showConfetti() {
  const colors = ['#58CC02','#FFD700','#FF4B4B','#1CB0F6','#FF9600'];
  for(let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = \`position:fixed; width:10px; height:10px; background:\${colors[Math.floor(Math.random()*5)]}; left:\${Math.random()*100}vw; top:-10px; border-radius:50%; z-index:9999; pointer-events:none; animation:fall \${1+Math.random()*2}s linear forwards\`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 3000);
  }
}
`;

// Add function to gamification.js since it's everywhere
let gamification = fs.readFileSync('gamification.js', 'utf8');
gamification = gamification.replace(/if \(typeof confetti === 'function'\) confetti\(\{.*?\}\);/g, 'showConfetti();');
if (!gamification.includes('function showConfetti()')) {
    gamification += '\n' + confettiFn;
}
fs.writeFileSync('gamification.js', gamification);

// Also replace in script.js
let scriptjs = fs.readFileSync('script.js', 'utf8');
scriptjs = scriptjs.replace(/if \(typeof confetti === 'function'\) \{[\s\S]*?confetti\(\{.*?\}\);[\s\S]*?\}/g, 'showConfetti();');
fs.writeFileSync('script.js', scriptjs);

// Also replace in game.js just in case
let gamejs = fs.readFileSync('game.js', 'utf8');
gamejs = gamejs.replace(/if \(typeof confetti === 'function'\) confetti\(\{.*?\}\);/g, 'showConfetti();');
fs.writeFileSync('game.js', gamejs);

// Replace in game.html inline script (which has its own fireConfetti)
let gamehtml = fs.readFileSync('game.html', 'utf8');
gamehtml = gamehtml.replace(/window\.fireConfetti\(\);/g, 'showConfetti();');
gamehtml = gamehtml.replace(/fireConfetti\(\);/g, 'showConfetti();');
// We don't need to delete fireConfetti definition, but we shouldn't have duplicate showConfetti if gamification defines it.
// Oh wait, game.html doesn't load script.js, but it loads gamification.js.
// So gamification.js having showConfetti() is enough for game.html!
// But just in case, let's remove canvas-confetti script from all HTML files:
const htmlFiles = ['index.html', 'practice.html', 'game.html', 'leaderboard.html'];
for (let file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/canvas-confetti@1\.6\.0\/dist\/confetti\.browser\.min\.js"><\/script>\n?/g, '');
    fs.writeFileSync(file, content);
}

// Ensure game.html script order: gamification.js then inline script (already verified earlier, gamification.js is above inline script)
// Add CSS to style.css
let stylecss = fs.readFileSync('style.css', 'utf8');
if (!stylecss.includes('@keyframes fall')) {
    stylecss += '\n@keyframes fall {\n  to { transform: translateY(105vh) rotate(360deg); opacity: 0; }\n}\n';
}
fs.writeFileSync('style.css', stylecss);

console.log("Processed all files for Fix 1, 2, and 3");
