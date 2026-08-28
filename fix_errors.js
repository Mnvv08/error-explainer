const fs = require('fs');
let html = fs.readFileSync('/Users/manavparihar/error-explainer/game.html', 'utf8');

// 1. gamification.js defer
html = html.replace('<script src="gamification.js"></script>', '<script src="gamification.js" defer></script>');

// We will extract CHALLENGE_BANK and then replace the rest of the script.
const bankStart = html.indexOf('const CHALLENGE_BANK = [');
const bankEnd = html.indexOf('];', bankStart) + 2;
const challengeBankCode = html.substring(bankStart, bankEnd);

const scriptStart = html.indexOf('<script>', html.indexOf('gamification.js'));
const scriptEnd = html.indexOf('</script>', scriptStart);

const newScript = `<script>
try {
    ${challengeBankCode}
    
    // Globals attached to window to satisfy "defined in the global scope" while being wrapped in try/catch
    window.score = parseInt(localStorage.getItem('bugblaster_score') || '0') || 0;
    window.highScore = parseInt(localStorage.getItem('bugblaster_highscore') || '0') || 0;
    window.streak = parseInt(localStorage.getItem('bugblaster_streak') || '0') || 0;
    
    document.getElementById('current-score').innerText = window.score;
    document.getElementById('high-score').innerText = window.highScore;
    document.getElementById('game-streak').innerText = window.streak;
    
    window.selectedLanguage = localStorage.getItem('bugblaster_lang_pref') || 'Python';
    
    window.selectLanguage = function(lang, el) {
        try {
            const btns = document.querySelectorAll('.lang-btn');
            for(let i = 0; i < btns.length; i++) {
                btns[i].classList.remove('selected');
            }
            if (el) el.classList.add('selected');
            
            if (window.selectedLanguage !== lang) {
                window.selectedLanguage = lang;
                localStorage.setItem('bugblaster_lang_pref', window.selectedLanguage);
                window.score = 0;
                localStorage.setItem('bugblaster_score', '0');
                document.getElementById('current-score').innerText = window.score;
            }
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    // Initialize active button based on selectedLanguage
    const btns = document.querySelectorAll('.lang-btn');
    for(let i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-lang') === window.selectedLanguage) {
            btns[i].classList.add('selected');
        } else {
            btns[i].classList.remove('selected');
        }
    }
    
    window.timerInterval = null;
    window.timeLeft = 30;
    window.currentChallenge = null;
    window.gameActive = false;
    window.hintUsed = false;
    
    window.startGame = async function() {
        try {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('explanation-card').classList.add('hidden');
            document.getElementById('result-message').classList.add('hidden');
            document.getElementById('game-arena').classList.add('hidden');
            document.getElementById('loading-spinner').classList.remove('hidden');
            
            clearInterval(window.timerInterval);
            
            try {
                window.currentChallenge = await window.fetchChallenge();
                window.setupGameUI();
            } catch(e) {
                console.error(e);
                window.currentChallenge = CHALLENGE_BANK[0];
                window.setupGameUI();
            }
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.fetchChallenge = async function() {
        let usedIds = [];
        try {
            let idsRaw = localStorage.getItem('bugblaster_used_ids') || '[]';
            usedIds = JSON.parse(idsRaw);
            if (!Array.isArray(usedIds)) usedIds = [];
        } catch(e) {
            console.error('BugBlaster Error:', e);
            usedIds = [];
        }
        
        let activeLang = window.selectedLanguage;
        if (activeLang === 'Random') {
            const langs = ["Python", "Java", "C", "C++", "JavaScript"];
            activeLang = langs[Math.floor(Math.random() * langs.length)];
        }
        
        const unusedBank = CHALLENGE_BANK.filter(c => !usedIds.includes(c.id) && c.language === activeLang);
        
        if (unusedBank.length > 0) {
            const challenge = unusedBank[Math.floor(Math.random() * unusedBank.length)];
            usedIds.push(challenge.id);
            localStorage.setItem('bugblaster_used_ids', JSON.stringify(usedIds));
            return new Promise(resolve => setTimeout(() => resolve(challenge), 500));
        }
        
        // API Fallback
        const topics = ["variables", "loops", "functions", "conditionals", "arrays", "strings", "math"];
        const twists = ["wrong variable name", "missing bracket", "off-by-one error", "missing return"];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomTwist = twists[Math.floor(Math.random() * twists.length)];
        
        const prompt = \`Generate a buggy code challenge ONLY in \${activeLang}. Do not use any other language. Topic: \${randomTopic}. Bug type: \${randomTwist}. Return ONLY JSON: { 'language': '\${activeLang}', 'buggy_code': '...', 'hint': 'one word hint', 'correct_line': 3, 'explanation': 'simple explanation', 'fixed_code': '...' }\`;
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "YOUR_CLAUDE_API_KEY_HERE",
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            })
        });
        
        if (!response.ok) throw new Error("API error");
        const result = await response.json();
        const content = result.content[0].text;
        let challenge;
        const jsonMatch = content.match(/\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`/);
        if (jsonMatch) {
            try { challenge = JSON.parse(jsonMatch[1]); } catch(e) { console.error('BugBlaster Error:', e); }
        } else {
            try { challenge = JSON.parse(content); } catch(e) { console.error('BugBlaster Error:', e); }
        }
        return challenge;
    };
    
    window.setupGameUI = function() {
        try {
            document.getElementById('loading-spinner').classList.add('hidden');
            document.getElementById('game-arena').classList.remove('hidden');
            
            const hintBtn = document.getElementById('hint-btn');
            const hintText = document.getElementById('hint-text');
            hintBtn.classList.remove('hidden');
            hintText.classList.add('hidden');
            hintText.innerText = 'Hint: ' + window.currentChallenge.hint;
            window.hintUsed = false;
            
            const codeBox = document.getElementById('code-box');
            codeBox.innerHTML = '';
            
            const lines = window.currentChallenge.buggy_code.split('\\n');
            for(let i = 0; i < lines.length; i++) {
                const lineContent = lines[i].trim() === '' ? '&nbsp;' : lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const lineHtml = \`<div class="code-line interactive-element" id="line-\${i+1}" onclick="checkAnswer(\${i+1})"><span class="line-number">\${i + 1}</span> <span class="line-content">\${lineContent}</span></div>\`;
                codeBox.innerHTML += lineHtml;
            }
            
            window.timeLeft = 30;
            window.gameActive = true;
            window.updateTimerBar();
            
            window.timerInterval = setInterval(() => {
                window.timeLeft -= 1;
                window.updateTimerBar();
                if (window.timeLeft <= 0) window.endGame(false);
            }, 1000);
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.updateTimerBar = function() {
        try {
            const timerBar = document.getElementById('timer-bar');
            const percentage = (window.timeLeft / 30) * 100;
            timerBar.style.width = percentage + '%';
            if (window.timeLeft <= 5) timerBar.style.backgroundColor = '#FF4B4B';
            else if (window.timeLeft <= 15) timerBar.style.backgroundColor = '#FFD700';
            else timerBar.style.backgroundColor = '#58CC02';
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.checkAnswer = function(lineNumber) {
        try {
            if (!window.gameActive) return;
            const lineEl = document.getElementById('line-' + lineNumber);
            
            if (lineNumber === window.currentChallenge.correct_line) {
                lineEl.classList.add('correct');
                window.endGame(true);
            } else {
                lineEl.classList.add('wrong', 'shake');
                setTimeout(() => {
                    lineEl.classList.remove('wrong', 'shake');
                }, 500);
                window.timeLeft = Math.max(0, window.timeLeft - 5);
                window.updateTimerBar();
                
                const resultMessage = document.getElementById('result-message');
                resultMessage.innerHTML = '<h3>❌ Wrong line! -5s penalty</h3>';
                resultMessage.className = 'result-message error';
                resultMessage.classList.remove('hidden');
                setTimeout(() => { if (window.gameActive) resultMessage.classList.add('hidden'); }, 1500);
                
                if (window.timeLeft <= 0) window.endGame(false);
            }
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.useHint = function() {
        try {
            if (window.hintUsed || !window.gameActive) return;
            let xp = parseInt(localStorage.getItem('bugblaster_xp') || '0') || 0;
            if (xp >= 5) {
                if (window.gamification) window.gamification.awardXP(-5);
                window.hintUsed = true;
                document.getElementById('hint-btn').classList.add('hidden');
                document.getElementById('hint-text').classList.remove('hidden');
            } else {
                alert("Not enough XP for a hint!");
            }
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.endGame = function(success) {
        try {
            window.gameActive = false;
            clearInterval(window.timerInterval);
            
            const resultMessage = document.getElementById('result-message');
            resultMessage.classList.remove('hidden');
            
            if (success) {
                window.fireConfetti();
                resultMessage.innerHTML = '<h2>🎉 Correct! +20 XP</h2>';
                resultMessage.className = 'result-message success';
                window.score += 1;
                if (window.score > window.highScore) {
                    window.highScore = window.score;
                    localStorage.setItem('bugblaster_highscore', window.highScore);
                    document.getElementById('high-score').innerText = window.highScore;
                }
                localStorage.setItem('bugblaster_score', window.score);
                document.getElementById('current-score').innerText = window.score;
                
                if (window.gamification) window.gamification.awardXP(20);
            } else {
                resultMessage.innerHTML = '<h2>⏰ Time\\'s Up!</h2>';
                resultMessage.className = 'result-message error';
                window.score = 0;
                localStorage.setItem('bugblaster_score', '0');
                document.getElementById('current-score').innerText = window.score;
                
                const correctLine = document.getElementById('line-' + window.currentChallenge.correct_line);
                if (correctLine) correctLine.classList.add('missed');
            }
            
            document.getElementById('bug-explanation').innerText = window.currentChallenge.explanation;
            document.getElementById('bug-fixed-code').innerText = window.currentChallenge.fixed_code;
            document.getElementById('explanation-card').classList.remove('hidden');
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };
    
    window.fireConfetti = function() {
        try {
            const container = document.createElement('div');
            container.className = 'confetti-container';
            document.body.appendChild(container);
            
            const colors = ['#58CC02', '#1CB0F6', '#FFD700', '#FF4B4B'];
            for(let i=0; i<50; i++) {
                const conf = document.createElement('div');
                conf.className = 'confetti';
                conf.style.left = Math.random() * 100 + 'vw';
                conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                conf.style.animation = \`fall \${Math.random() * 2 + 1}s linear forwards\`;
                conf.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(conf);
            }
            
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 3000);
        } catch(e) {
            console.error('BugBlaster Error:', e);
        }
    };

} catch(e) {
    console.error('BugBlaster Error:', e);
}
</script>`;

// To strictly follow "not inside another function or block", I will actually just declare them globally
// and wrap their contents in try/catch, instead of putting everything in a giant try/catch.
// Let's rewrite the string to match exactly what the user said:
// "Both functions must be defined in the global scope (not inside another function or block)"

const strictScript = `<script>
${challengeBankCode}

function selectLanguage(lang, el) {
    try {
        const btns = document.querySelectorAll('.lang-btn');
        for(let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('selected');
        }
        if (el) el.classList.add('selected');
        
        let currentLang = localStorage.getItem('bugblaster_lang_pref') || 'Python';
        if (currentLang !== lang) {
            localStorage.setItem('bugblaster_lang_pref', lang);
            localStorage.setItem('bugblaster_score', '0');
            const scoreEl = document.getElementById('current-score');
            if (scoreEl) scoreEl.innerText = '0';
        }
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

async function startGame() {
    try {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('explanation-card').classList.add('hidden');
        document.getElementById('result-message').classList.add('hidden');
        document.getElementById('game-arena').classList.add('hidden');
        document.getElementById('loading-spinner').classList.remove('hidden');
        
        if (window.timerInterval) clearInterval(window.timerInterval);
        
        try {
            window.currentChallenge = await fetchChallenge();
            setupGameUI();
        } catch(e) {
            console.error('BugBlaster Error:', e);
            window.currentChallenge = CHALLENGE_BANK[0];
            setupGameUI();
        }
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

async function fetchChallenge() {
    try {
        let usedIds = [];
        try {
            let idsRaw = localStorage.getItem('bugblaster_used_ids') || '[]';
            usedIds = JSON.parse(idsRaw);
            if (!Array.isArray(usedIds)) usedIds = [];
        } catch(e) {
            console.error('BugBlaster Error:', e);
            usedIds = [];
        }
        
        let activeLang = localStorage.getItem('bugblaster_lang_pref') || 'Python';
        if (activeLang === 'Random') {
            const langs = ["Python", "Java", "C", "C++", "JavaScript"];
            activeLang = langs[Math.floor(Math.random() * langs.length)];
        }
        
        const unusedBank = CHALLENGE_BANK.filter(c => !usedIds.includes(c.id) && c.language === activeLang);
        
        if (unusedBank.length > 0) {
            const challenge = unusedBank[Math.floor(Math.random() * unusedBank.length)];
            usedIds.push(challenge.id);
            localStorage.setItem('bugblaster_used_ids', JSON.stringify(usedIds));
            return new Promise(resolve => setTimeout(() => resolve(challenge), 500));
        }
        
        // API Fallback
        const topics = ["variables", "loops", "functions", "conditionals", "arrays", "strings", "math"];
        const twists = ["wrong variable name", "missing bracket", "off-by-one error", "missing return"];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomTwist = twists[Math.floor(Math.random() * twists.length)];
        
        const prompt = \`Generate a buggy code challenge ONLY in \${activeLang}. Do not use any other language. Topic: \${randomTopic}. Bug type: \${randomTwist}. Return ONLY JSON: { 'language': '\${activeLang}', 'buggy_code': '...', 'hint': 'one word hint', 'correct_line': 3, 'explanation': 'simple explanation', 'fixed_code': '...' }\`;
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "YOUR_CLAUDE_API_KEY_HERE",
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            })
        });
        
        if (!response.ok) throw new Error("API error");
        const result = await response.json();
        const content = result.content[0].text;
        let challenge;
        const jsonMatch = content.match(/\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`/);
        if (jsonMatch) {
            try { challenge = JSON.parse(jsonMatch[1]); } catch(e) { console.error('BugBlaster Error:', e); }
        } else {
            try { challenge = JSON.parse(content); } catch(e) { console.error('BugBlaster Error:', e); }
        }
        return challenge;
    } catch(e) {
        console.error('BugBlaster Error:', e);
        return CHALLENGE_BANK[0];
    }
}

function setupGameUI() {
    try {
        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('game-arena').classList.remove('hidden');
        
        const hintBtn = document.getElementById('hint-btn');
        const hintText = document.getElementById('hint-text');
        hintBtn.classList.remove('hidden');
        hintText.classList.add('hidden');
        hintText.innerText = 'Hint: ' + window.currentChallenge.hint;
        window.hintUsed = false;
        
        const codeBox = document.getElementById('code-box');
        codeBox.innerHTML = '';
        
        const lines = window.currentChallenge.buggy_code.split('\\n');
        for(let i = 0; i < lines.length; i++) {
            const lineContent = lines[i].trim() === '' ? '&nbsp;' : lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const lineHtml = \`<div class="code-line interactive-element" id="line-\${i+1}" onclick="checkAnswer(\${i+1})"><span class="line-number">\${i + 1}</span> <span class="line-content">\${lineContent}</span></div>\`;
            codeBox.innerHTML += lineHtml;
        }
        
        window.timeLeft = 30;
        window.gameActive = true;
        updateTimerBar();
        
        window.timerInterval = setInterval(() => {
            window.timeLeft -= 1;
            updateTimerBar();
            if (window.timeLeft <= 0) endGame(false);
        }, 1000);
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

function updateTimerBar() {
    try {
        const timerBar = document.getElementById('timer-bar');
        const percentage = (window.timeLeft / 30) * 100;
        timerBar.style.width = percentage + '%';
        if (window.timeLeft <= 5) timerBar.style.backgroundColor = '#FF4B4B';
        else if (window.timeLeft <= 15) timerBar.style.backgroundColor = '#FFD700';
        else timerBar.style.backgroundColor = '#58CC02';
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

function checkAnswer(lineNumber) {
    try {
        if (!window.gameActive) return;
        const lineEl = document.getElementById('line-' + lineNumber);
        
        if (lineNumber === window.currentChallenge.correct_line) {
            if (lineEl) lineEl.classList.add('correct');
            endGame(true);
        } else {
            if (lineEl) lineEl.classList.add('wrong', 'shake');
            setTimeout(() => {
                if (lineEl) lineEl.classList.remove('wrong', 'shake');
            }, 500);
            window.timeLeft = Math.max(0, window.timeLeft - 5);
            updateTimerBar();
            
            const resultMessage = document.getElementById('result-message');
            resultMessage.innerHTML = '<h3>❌ Wrong line! -5s penalty</h3>';
            resultMessage.className = 'result-message error';
            resultMessage.classList.remove('hidden');
            setTimeout(() => { if (window.gameActive) resultMessage.classList.add('hidden'); }, 1500);
            
            if (window.timeLeft <= 0) endGame(false);
        }
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

function useHint() {
    try {
        if (window.hintUsed || !window.gameActive) return;
        let xp = parseInt(localStorage.getItem('bugblaster_xp') || '0') || 0;
        if (xp >= 5) {
            if (window.gamification) window.gamification.awardXP(-5);
            window.hintUsed = true;
            document.getElementById('hint-btn').classList.add('hidden');
            document.getElementById('hint-text').classList.remove('hidden');
        } else {
            alert("Not enough XP for a hint!");
        }
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

function endGame(success) {
    try {
        window.gameActive = false;
        clearInterval(window.timerInterval);
        
        const resultMessage = document.getElementById('result-message');
        resultMessage.classList.remove('hidden');
        
        let score = parseInt(localStorage.getItem('bugblaster_score') || '0') || 0;
        let highScore = parseInt(localStorage.getItem('bugblaster_highscore') || '0') || 0;
        
        if (success) {
            fireConfetti();
            resultMessage.innerHTML = '<h2>🎉 Correct! +20 XP</h2>';
            resultMessage.className = 'result-message success';
            score += 1;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('bugblaster_highscore', highScore.toString());
                const highScoreEl = document.getElementById('high-score');
                if (highScoreEl) highScoreEl.innerText = highScore;
            }
            localStorage.setItem('bugblaster_score', score.toString());
            const scoreEl = document.getElementById('current-score');
            if (scoreEl) scoreEl.innerText = score;
            
            if (window.gamification) window.gamification.awardXP(20);
        } else {
            resultMessage.innerHTML = '<h2>⏰ Time\\'s Up!</h2>';
            resultMessage.className = 'result-message error';
            score = 0;
            localStorage.setItem('bugblaster_score', '0');
            const scoreEl = document.getElementById('current-score');
            if (scoreEl) scoreEl.innerText = '0';
            
            const correctLine = document.getElementById('line-' + window.currentChallenge.correct_line);
            if (correctLine) correctLine.classList.add('missed');
        }
        
        document.getElementById('bug-explanation').innerText = window.currentChallenge.explanation;
        document.getElementById('bug-fixed-code').innerText = window.currentChallenge.fixed_code;
        document.getElementById('explanation-card').classList.remove('hidden');
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

function fireConfetti() {
    try {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        const colors = ['#58CC02', '#1CB0F6', '#FFD700', '#FF4B4B'];
        for(let i=0; i<50; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animation = \`fall \${Math.random() * 2 + 1}s linear forwards\`;
            conf.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(conf);
        }
        
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 3000);
    } catch(e) {
        console.error('BugBlaster Error:', e);
    }
}

try {
    const score = parseInt(localStorage.getItem('bugblaster_score') || '0') || 0;
    const highScore = parseInt(localStorage.getItem('bugblaster_highscore') || '0') || 0;
    const streak = parseInt(localStorage.getItem('bugblaster_streak') || '0') || 0;
    
    document.getElementById('current-score').innerText = score;
    document.getElementById('high-score').innerText = highScore;
    document.getElementById('game-streak').innerText = streak;
    
    const selectedLanguage = localStorage.getItem('bugblaster_lang_pref') || 'Python';
    const btns = document.querySelectorAll('.lang-btn');
    for(let i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-lang') === selectedLanguage) {
            btns[i].classList.add('selected');
        } else {
            btns[i].classList.remove('selected');
        }
    }
} catch(e) {
    console.error('BugBlaster Error:', e);
}
</script>`;

html = html.substring(0, scriptStart) + strictScript + html.substring(scriptEnd + 9);
fs.writeFileSync('/Users/manavparihar/error-explainer/game.html', html);
console.log("Done");
