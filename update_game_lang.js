const fs = require('fs');
const file = '/Users/manavparihar/error-explainer/game.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add language state logic right before let currentChallenge = null;
const stateInsertionPoint = "let currentChallenge = null;";
const langStateLogic = `
    // Language Preference
    let selectedLang = localStorage.getItem('bugblaster_lang_pref') || 'Python';
    const langBtns = document.querySelectorAll('.lang-btn');
    
    function updateLangUI() {
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === selectedLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    updateLangUI();
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newLang = e.target.getAttribute('data-lang');
            if (newLang !== selectedLang) {
                selectedLang = newLang;
                localStorage.setItem('bugblaster_lang_pref', selectedLang);
                updateLangUI();
                
                // Reset score and used ids
                score = 0;
                localStorage.setItem('bugblaster_score', 0);
                currentScoreEl.innerText = score;
                localStorage.removeItem('bugblaster_used_ids');
            }
        });
    });

`;

content = content.replace(stateInsertionPoint, langStateLogic + stateInsertionPoint);

// 2. Update fetchChallenge logic to respect selectedLang
content = content.replace(/const unusedBank = CHALLENGE_BANK\.filter\(c => !usedIds\.includes\(c\.id\)\);/g, `
        const activeLang = selectedLang === 'Random' 
            ? languages[Math.floor(Math.random() * languages.length)] 
            : selectedLang;
        
        const unusedBank = CHALLENGE_BANK.filter(c => !usedIds.includes(c.id) && c.language === activeLang);
`);

// 3. Update the prompt to respect selectedLang if falling back to API
const apiPromptSearch = /const randomLanguage = languages\[Math\.floor\(Math\.random\(\) \* languages\.length\)\];/g;
content = content.replace(apiPromptSearch, `const randomLanguage = selectedLang === 'Random' ? languages[Math.floor(Math.random() * languages.length)] : selectedLang;`);

const oldPromptStr = /Generate a UNIQUE buggy code challenge\. Topic: \$\{randomTopic\}\. Language: \$\{randomLanguage\}\. Bug type: \$\{randomTwist\}\. This must be completely different from any standard textbook example\./;
content = content.replace(oldPromptStr, 'Generate a UNIQUE buggy code challenge ONLY in ${randomLanguage}. Do not use any other language. Topic: ${randomTopic}. Bug type: ${randomTwist}. This must be completely different from any standard textbook example.');

fs.writeFileSync(file, content);
console.log("Updated game.js with language state");
