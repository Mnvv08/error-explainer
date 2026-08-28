const fs = require('fs');

// 1. Update style.css
let stylePath = '/Users/manavparihar/error-explainer/style.css';
let styleContent = fs.readFileSync(stylePath, 'utf8');

styleContent = styleContent.replace(
/canvas \{[\s\S]*?\}/g,
`canvas {
    pointer-events: none !important;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
}`
);

// Add z-index to all game UI elements generically
styleContent += `
.game-ui-element {
    position: relative;
    z-index: 10;
}
.start-hunt-btn {
    position: relative;
    z-index: 100;
}
`;

// Replace .active with .selected for language buttons
styleContent = styleContent.replace(/\.lang-btn\.active/g, '.lang-btn.selected');

fs.writeFileSync(stylePath, styleContent);

// 2. Update game.html
let htmlPath = '/Users/manavparihar/error-explainer/game.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Wrap main content
htmlContent = htmlContent.replace(/<main class="game-main fade-in">/, '<div style="position: relative; z-index: 50;">\n    <main class="game-main fade-in">');
htmlContent = htmlContent.replace(/<\/main>\n    <footer>/, '</main>\n    </div>\n    <footer>');

// Update buttons with IDs and change active to selected
htmlContent = htmlContent.replace('<button class="lang-btn active" data-lang="Python">🐍 Python</button>', '<button id="btn-python" class="lang-btn selected" data-lang="Python">🐍 Python</button>');
htmlContent = htmlContent.replace('<button class="lang-btn" data-lang="Java">☕ Java</button>', '<button id="btn-java" class="lang-btn" data-lang="Java">☕ Java</button>');
htmlContent = htmlContent.replace('<button class="lang-btn" data-lang="C">⚡ C</button>', '<button id="btn-c" class="lang-btn" data-lang="C">⚡ C</button>');
htmlContent = htmlContent.replace('<button class="lang-btn" data-lang="C++">🔷 C++</button>', '<button id="btn-cpp" class="lang-btn" data-lang="C++">🔷 C++</button>');
htmlContent = htmlContent.replace('<button class="lang-btn" data-lang="JavaScript">🌐 JavaScript</button>', '<button id="btn-javascript" class="lang-btn" data-lang="JavaScript">🌐 JavaScript</button>');
htmlContent = htmlContent.replace('<button class="lang-btn" data-lang="Random">🎲 Random</button>', '<button id="btn-random" class="lang-btn" data-lang="Random">🎲 Random</button>');

// Make sure start hunt button has the class
htmlContent = htmlContent.replace('id="start-hunt-btn"', 'id="start-hunt-btn" style="position: relative; z-index: 100;"');

fs.writeFileSync(htmlPath, htmlContent);

// 3. Update game.js
let jsPath = '/Users/manavparihar/error-explainer/game.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Remove old language logic
const oldLangLogicStart = jsContent.indexOf('// Language Preference');
const oldLangLogicEnd = jsContent.indexOf('const topics = [');
if (oldLangLogicStart !== -1 && oldLangLogicEnd !== -1) {
    jsContent = jsContent.substring(0, oldLangLogicStart) + jsContent.substring(oldLangLogicEnd);
}

// Insert new language logic
const newLangLogic = `
    // Language Preference
    let selectedLang = localStorage.getItem('bugblaster_lang_pref') || 'Python';
    
    function selectLanguage(lang, el) {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
        if (el) el.classList.add('selected');
        
        if (newLang !== selectedLang) {
            selectedLang = lang;
            localStorage.setItem('bugblaster_lang_pref', selectedLang);
            
            // Reset score and used ids
            score = 0;
            localStorage.setItem('bugblaster_score', 0);
            document.getElementById('current-score').innerText = score;
            localStorage.removeItem('bugblaster_used_ids');
        }
    }
    
    const btnPython = document.getElementById('btn-python');
    if (btnPython) btnPython.addEventListener('click', function() { selectLanguage('Python', this); });
    
    const btnJava = document.getElementById('btn-java');
    if (btnJava) btnJava.addEventListener('click', function() { selectLanguage('Java', this); });
    
    const btnC = document.getElementById('btn-c');
    if (btnC) btnC.addEventListener('click', function() { selectLanguage('C', this); });
    
    const btnCpp = document.getElementById('btn-cpp');
    if (btnCpp) btnCpp.addEventListener('click', function() { selectLanguage('C++', this); });
    
    const btnJs = document.getElementById('btn-javascript');
    if (btnJs) btnJs.addEventListener('click', function() { selectLanguage('JavaScript', this); });
    
    const btnRandom = document.getElementById('btn-random');
    if (btnRandom) btnRandom.addEventListener('click', function() { selectLanguage('Random', this); });

`;

jsContent = jsContent.replace('const topics = [', newLangLogic + '\n    const topics = [');
jsContent = jsContent.replace('if (newLang !== selectedLang)', 'const newLang = lang;\n        if (newLang !== selectedLang)');

fs.writeFileSync(jsPath, jsContent);
console.log("Done");
