const fs = require('fs');

const cbFile = '/tmp/cb.js';
let challengeBank = fs.readFileSync(cbFile, 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BugBlaster 🐛 | Bug Hunter 🎮</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        /* CSS Confetti */
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        }
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: var(--primary-green);
            opacity: 0;
        }
        @keyframes fall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .code-line { cursor: pointer; }
        .code-line:hover { background-color: rgba(255, 255, 255, 0.1); }
        .code-line.correct { background-color: rgba(88, 204, 2, 0.3) !important; }
        .code-line.wrong { background-color: rgba(255, 75, 75, 0.3) !important; }
        
        /* Ensure interactive elements sit above the rest */
        .interactive-element {
            position: relative;
            z-index: 10;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">BugBlaster 🐛</div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="practice.html">Practice</a></li>
            <li><a href="game.html" class="active">Bug Hunter 🎮</a></li>
            <li><a href="leaderboard.html">Leaderboard</a></li>
        </ul>
        <div class="gamification-nav">
            <span id="nav-streak" class="nav-stat">🔥 0</span>
            <span id="nav-xp" class="nav-stat">⚡ 0</span>
            <span id="nav-level-badge" class="level-badge">Lvl 1: 🐛</span>
        </div>
    </nav>

    <div id="fire-banner" class="banner hidden">You're on fire! 🔥</div>
    
    <div style="position: relative; z-index: 50;">
        <main class="game-main fade-in">
            <header class="game-header">
                <h2>Bug Hunter 🎮</h2>
                <p class="subheading">Can you spot the bug before the timer runs out?</p>
                <div class="game-stats">
                    <div class="stat-pill">Score: <span id="current-score">0</span></div>
                    <div class="stat-pill">High Score: <span id="high-score">0</span></div>
                    <div class="stat-pill">🔥 <span id="game-streak">0</span></div>
                </div>
            </header>

            <div id="start-screen" class="game-center-screen">
                <div class="language-selector">
                    <h3>Choose Your Language 🎯</h3>
                    <div class="lang-btns interactive-element" id="language-selector-btns">
                        <button class="lang-btn selected interactive-element" data-lang="Python" onclick="selectLanguage('Python', this)">🐍 Python</button>
                        <button class="lang-btn interactive-element" data-lang="Java" onclick="selectLanguage('Java', this)">☕ Java</button>
                        <button class="lang-btn interactive-element" data-lang="C" onclick="selectLanguage('C', this)">⚡ C</button>
                        <button class="lang-btn interactive-element" data-lang="C++" onclick="selectLanguage('C++', this)">🔷 C++</button>
                        <button class="lang-btn interactive-element" data-lang="JavaScript" onclick="selectLanguage('JavaScript', this)">🌐 JavaScript</button>
                        <button class="lang-btn interactive-element" data-lang="Random" onclick="selectLanguage('Random', this)">🎲 Random</button>
                    </div>
                </div>
                <button class="cta-button big-play-btn interactive-element" id="start-hunt-btn" onclick="startGame()">Start Hunt 🎯</button>
            </div>

            <div id="loading-spinner" class="loading-container hidden">
                <div class="spinner">🤖</div>
                <p>Generating a tricky bug... 💥</p>
            </div>

            <div id="game-arena" class="game-arena hidden">
                <div class="timer-container">
                    <div class="timer-bar" id="timer-bar"></div>
                </div>
                
                <div class="hint-container">
                    <button id="hint-btn" class="hint-btn interactive-element" onclick="useHint()">💡 Use Hint (-5 XP)</button>
                    <div id="hint-text" class="hint-text hidden"></div>
                </div>
                
                <div class="code-challenge-box interactive-element" id="code-box">
                    <!-- Lines will be injected here via JS -->
                </div>
                
                <div id="result-message" class="result-message hidden">
                    <!-- Success or failure message will appear here -->
                </div>
                
                <div id="explanation-card" class="results-card result-section green-border hidden" style="margin-top: 2rem;">
                    <h3>📝 Explanation</h3>
                    <p id="bug-explanation" style="margin-bottom: 1rem;"></p>
                    <h4>✅ Fixed Code</h4>
                    <pre><code id="bug-fixed-code"></code></pre>
                    <button class="cta-button interactive-element" id="next-challenge-btn" style="margin-top: 2rem; width: 100%;" onclick="startGame()">Next Challenge 🎯</button>
                </div>
            </div>
        </main>
    </div>

    <footer>
        <p>Built for beginner coders 💚</p>
    </footer>
    
    <script src="gamification.js"></script>
    <script>
        ${challengeBank}
        
        let score = parseInt(localStorage.getItem('bugblaster_score')) || 0;
        let highScore = parseInt(localStorage.getItem('bugblaster_highscore')) || 0;
        let streak = parseInt(localStorage.getItem('bugblaster_streak')) || 0;
        
        document.getElementById('current-score').innerText = score;
        document.getElementById('high-score').innerText = highScore;
        document.getElementById('game-streak').innerText = streak;
        
        let selectedLanguage = localStorage.getItem('bugblaster_lang_pref') || 'Python';
        
        function selectLanguage(lang, el) {
            const btns = document.querySelectorAll('.lang-btn');
            for(let i = 0; i < btns.length; i++) {
                btns[i].classList.remove('selected');
            }
            if (el) el.classList.add('selected');
            
            if (selectedLanguage !== lang) {
                selectedLanguage = lang;
                localStorage.setItem('bugblaster_lang_pref', selectedLanguage);
                score = 0;
                localStorage.setItem('bugblaster_score', 0);
                document.getElementById('current-score').innerText = score;
            }
        }
        
        // Initialize active button based on selectedLanguage
        const btns = document.querySelectorAll('.lang-btn');
        for(let i = 0; i < btns.length; i++) {
            if (btns[i].getAttribute('data-lang') === selectedLanguage) {
                btns[i].classList.add('selected');
            } else {
                btns[i].classList.remove('selected');
            }
        }
        
        let timerInterval = null;
        let timeLeft = 30;
        let currentChallenge = null;
        let gameActive = false;
        let hintUsed = false;
        
        async function startGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('explanation-card').classList.add('hidden');
            document.getElementById('result-message').classList.add('hidden');
            document.getElementById('game-arena').classList.add('hidden');
            document.getElementById('loading-spinner').classList.remove('hidden');
            
            clearInterval(timerInterval);
            
            try {
                currentChallenge = await fetchChallenge();
                setupGameUI();
            } catch(e) {
                console.error(e);
                currentChallenge = CHALLENGE_BANK[0];
                setupGameUI();
            }
        }
        
        async function fetchChallenge() {
            let usedIds = JSON.parse(localStorage.getItem('bugblaster_used_ids')) || [];
            
            let activeLang = selectedLanguage;
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
                challenge = JSON.parse(jsonMatch[1]);
            } else {
                challenge = JSON.parse(content);
            }
            return challenge;
        }
        
        function setupGameUI() {
            document.getElementById('loading-spinner').classList.add('hidden');
            document.getElementById('game-arena').classList.remove('hidden');
            
            const hintBtn = document.getElementById('hint-btn');
            const hintText = document.getElementById('hint-text');
            hintBtn.classList.remove('hidden');
            hintText.classList.add('hidden');
            hintText.innerText = 'Hint: ' + currentChallenge.hint;
            hintUsed = false;
            
            const codeBox = document.getElementById('code-box');
            codeBox.innerHTML = '';
            
            const lines = currentChallenge.buggy_code.split('\\n');
            for(let i = 0; i < lines.length; i++) {
                const lineContent = lines[i].trim() === '' ? '&nbsp;' : lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const lineHtml = \`<div class="code-line interactive-element" id="line-\${i+1}" onclick="checkAnswer(\${i+1})"><span class="line-number">\${i + 1}</span> <span class="line-content">\${lineContent}</span></div>\`;
                codeBox.innerHTML += lineHtml;
            }
            
            timeLeft = 30;
            gameActive = true;
            updateTimerBar();
            
            timerInterval = setInterval(() => {
                timeLeft -= 1;
                updateTimerBar();
                if (timeLeft <= 0) endGame(false);
            }, 1000);
        }
        
        function updateTimerBar() {
            const timerBar = document.getElementById('timer-bar');
            const percentage = (timeLeft / 30) * 100;
            timerBar.style.width = percentage + '%';
            if (timeLeft <= 5) timerBar.style.backgroundColor = '#FF4B4B';
            else if (timeLeft <= 15) timerBar.style.backgroundColor = '#FFD700';
            else timerBar.style.backgroundColor = '#58CC02';
        }
        
        function checkAnswer(lineNumber) {
            if (!gameActive) return;
            const lineEl = document.getElementById('line-' + lineNumber);
            
            if (lineNumber === currentChallenge.correct_line) {
                lineEl.classList.add('correct');
                endGame(true);
            } else {
                lineEl.classList.add('wrong', 'shake');
                setTimeout(() => {
                    lineEl.classList.remove('wrong', 'shake');
                }, 500);
                timeLeft = Math.max(0, timeLeft - 5);
                updateTimerBar();
                
                const resultMessage = document.getElementById('result-message');
                resultMessage.innerHTML = '<h3>❌ Wrong line! -5s penalty</h3>';
                resultMessage.className = 'result-message error';
                resultMessage.classList.remove('hidden');
                setTimeout(() => { if (gameActive) resultMessage.classList.add('hidden'); }, 1500);
                
                if (timeLeft <= 0) endGame(false);
            }
        }
        
        function useHint() {
            if (hintUsed || !gameActive) return;
            let xp = parseInt(localStorage.getItem('bugblaster_xp')) || 0;
            if (xp >= 5) {
                if (window.gamification) window.gamification.awardXP(-5);
                hintUsed = true;
                document.getElementById('hint-btn').classList.add('hidden');
                document.getElementById('hint-text').classList.remove('hidden');
            } else {
                alert("Not enough XP for a hint!");
            }
        }
        
        function endGame(success) {
            gameActive = false;
            clearInterval(timerInterval);
            
            const resultMessage = document.getElementById('result-message');
            resultMessage.classList.remove('hidden');
            
            if (success) {
                fireConfetti();
                resultMessage.innerHTML = '<h2>🎉 Correct! +20 XP</h2>';
                resultMessage.className = 'result-message success';
                score += 1;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('bugblaster_highscore', highScore);
                    document.getElementById('high-score').innerText = highScore;
                }
                localStorage.setItem('bugblaster_score', score);
                document.getElementById('current-score').innerText = score;
                
                if (window.gamification) window.gamification.awardXP(20);
            } else {
                resultMessage.innerHTML = '<h2>⏰ Time\\'s Up!</h2>';
                resultMessage.className = 'result-message error';
                score = 0;
                localStorage.setItem('bugblaster_score', score);
                document.getElementById('current-score').innerText = score;
                
                const correctLine = document.getElementById('line-' + currentChallenge.correct_line);
                if (correctLine) correctLine.classList.add('missed');
            }
            
            document.getElementById('bug-explanation').innerText = currentChallenge.explanation;
            document.getElementById('bug-fixed-code').innerText = currentChallenge.fixed_code;
            document.getElementById('explanation-card').classList.remove('hidden');
        }
        
        function fireConfetti() {
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
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('/Users/manavparihar/error-explainer/game.html', htmlContent);
console.log("Rewrote game.html");
