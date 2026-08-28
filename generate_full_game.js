const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BugBlaster 🐛 | Bug Hunter 🎮</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Nunito', sans-serif;
            background-color: #ffffff;
            color: #333333;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }
        
        .navbar {
            width: 100%;
            background-color: #ffffff;
            color: #58CC02;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            border-bottom: 2px solid #e5e5e5;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 900;
            color: #58CC02;
        }

        .nav-links {
            list-style: none;
            display: flex;
            gap: 1.5rem;
            margin: 0;
            padding: 0;
        }

        .nav-links a {
            color: #777;
            text-decoration: none;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .nav-links a.active {
            color: #58CC02;
        }

        .game-main {
            margin-top: 100px;
            width: 100%;
            max-width: 800px;
            padding: 2rem;
            box-sizing: border-box;
        }
        
        .game-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .game-header h2 {
            font-size: 2.5rem;
            margin: 0 0 0.5rem 0;
            color: #3c3c3c;
        }

        .game-stats {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        .stat-pill {
            background-color: #f7f7f7;
            border: 2px solid #e5e5e5;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            color: #555;
        }
        
        .stat-pill span {
            color: #58CC02;
        }

        .language-selector {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .lang-btns {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .lang-btn {
            background-color: white;
            color: #58CC02;
            border: 2px solid #58CC02;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 0 #58CC02;
            transition: all 0.1s ease;
        }

        .lang-btn.selected, .lang-btn:hover {
            background-color: #58CC02;
            color: white;
            transform: translateY(2px);
            box-shadow: 0 2px 0 #46A302;
        }

        .cta-button {
            background-color: #58CC02;
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 0 #46A302;
            display: block;
            margin: 0 auto;
            text-transform: uppercase;
        }

        .cta-button:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 #46A302;
        }

        .hidden {
            display: none !important;
        }
        
        .timer-container {
            width: 100%;
            height: 20px;
            background-color: #e5e5e5;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .timer-bar {
            height: 100%;
            background-color: #58CC02;
            width: 100%;
            transition: width 1s linear, background-color 0.3s;
        }
        
        .hint-btn {
            background-color: #FFD700;
            color: #b8860b;
            border: 2px solid #e5c100;
            padding: 8px 16px;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 20px;
        }
        
        .code-box {
            background-color: #1e1e1e;
            color: #d4d4d4;
            border-radius: 12px;
            padding: 1rem 0;
            font-family: monospace;
            font-size: 1.1rem;
            text-align: left;
            overflow-x: auto;
        }
        
        .code-line {
            padding: 5px 20px;
            cursor: pointer;
            display: flex;
        }
        
        .code-line:hover {
            background-color: rgba(255,255,255,0.1);
        }
        
        .code-line.correct {
            background-color: rgba(88, 204, 2, 0.4);
        }
        
        .code-line.wrong {
            background-color: rgba(255, 75, 75, 0.4);
        }
        
        .line-num {
            color: #858585;
            margin-right: 15px;
            user-select: none;
            width: 20px;
            text-align: right;
        }
        
        .result-banner {
            margin-top: 20px;
            padding: 15px;
            border-radius: 12px;
            font-weight: bold;
            text-align: center;
            font-size: 1.2rem;
        }
        
        .result-banner.success {
            background-color: #d7ffb8;
            color: #46A302;
            border: 2px solid #58CC02;
        }
        
        .result-banner.error {
            background-color: #ffcccc;
            color: #cc0000;
            border: 2px solid #ff4b4b;
        }
        
        .explanation-card {
            background-color: #f7f7f7;
            border: 2px solid #e5e5e5;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            text-align: left;
        }
        
        /* Shake Animation */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
        .shake {
            animation: shake 0.4s;
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
        <div></div>
    </nav>

    <main class="game-main">
        <header class="game-header">
            <h2>Bug Hunter 🎮</h2>
            <p>Can you spot the bug before the timer runs out?</p>
            <div class="game-stats">
                <div class="stat-pill">Score: <span id="current-score">0</span></div>
                <div class="stat-pill">High Score: <span id="high-score">0</span></div>
                <div class="stat-pill">🔥 Streak: <span id="game-streak">0</span></div>
            </div>
        </header>

        <div id="start-screen">
            <div class="language-selector">
                <div class="lang-btns" id="lang-btns-container">
                    <button class="lang-btn selected" onclick="selectLanguage('Python', this)">🐍 Python</button>
                    <button class="lang-btn" onclick="selectLanguage('Java', this)">☕ Java</button>
                    <button class="lang-btn" onclick="selectLanguage('C', this)">⚡ C</button>
                    <button class="lang-btn" onclick="selectLanguage('C++', this)">🔷 C++</button>
                    <button class="lang-btn" onclick="selectLanguage('JavaScript', this)">🌐 JavaScript</button>
                    <button class="lang-btn" onclick="selectLanguage('Random', this)">🎲 Random</button>
                </div>
            </div>
            <button class="cta-button" id="start-btn" onclick="startGame()">Start Hunt 🎯</button>
        </div>

        <div id="game-arena" class="hidden">
            <div class="timer-container">
                <div class="timer-bar" id="timer-bar"></div>
            </div>
            
            <button class="hint-btn" id="hint-btn" onclick="useHint()">💡 Use Hint (-5 XP)</button>
            
            <div class="code-box" id="code-box"></div>
            
            <div id="result-banner" class="result-banner hidden"></div>
            
            <div id="explanation-card" class="explanation-card hidden">
                <h3>📝 Explanation</h3>
                <p id="explanation-text"></p>
                <button class="cta-button" style="margin-top: 15px; width: 100%;" onclick="nextChallenge()">Next Challenge 🎯</button>
            </div>
        </div>
    </main>

    <script>
        // Global State
        var xp = parseInt(localStorage.getItem('bugblaster_xp') || '0');
        var streak = parseInt(localStorage.getItem('bugblaster_streak') || '0');
        var score = 0;
        var highScore = parseInt(localStorage.getItem('bugblaster_highscore') || '0');
        var selectedLang = 'Python';
        var currentChallenge = null;
        var timerInterval = null;
        var timeLeft = 30;
        var gameActive = false;
        var usedIndexes = JSON.parse(localStorage.getItem('bugblaster_used_indexes') || '[]');

        // Initialize UI
        document.getElementById('current-score').innerText = score;
        document.getElementById('high-score').innerText = highScore;
        document.getElementById('game-streak').innerText = streak;

        // Challenge Bank
        const CHALLENGE_BANK = [
            // Python
            { lang: 'Python', code: 'print "Hello"', correctLine: 1, hint: 'missing parentheses', explain: 'Python 3 requires parentheses for print().' },
            { lang: 'Python', code: 'for i in range(5):\n    print(i', correctLine: 2, hint: 'missing closing bracket', explain: 'Missing closing parenthesis on print().' },
            { lang: 'Python', code: 'name = input("Name: ")\nif name = "Bob":\n    print("Hi")', correctLine: 2, hint: 'should be ==', explain: 'Use == for comparison, not =.' },
            { lang: 'Python', code: 'def add(a,b):\n    return a - b', correctLine: 2, hint: 'should be + not -', explain: 'Function is named add, so it should use +.' },
            
            // Java
            { lang: 'Java', code: 'int x = 5;\nif(x = 5) {\n    System.out.println("Yes");\n}', correctLine: 2, hint: 'should be ==', explain: 'Use == for comparison in Java.' },
            { lang: 'Java', code: 'int[] arr = {1,2,3};\nfor(int i=0; i<=3; i++) {\n    System.out.println(arr[i]);\n}', correctLine: 2, hint: 'should be i<3', explain: 'Array bounds are 0 to length-1.' },
            { lang: 'Java', code: 'System.out.println("Hi" \nint x = 5;', correctLine: 1, hint: 'missing closing bracket', explain: 'Missing ); at end of println.' },
            { lang: 'Java', code: 'int x = "hello";\nSystem.out.println(x);', correctLine: 1, hint: 'wrong type', explain: 'Cannot assign a String to an int variable.' },
            
            // C
            { lang: 'C', code: 'int x = 5\nprintf("%d", x);', correctLine: 1, hint: 'missing semicolon', explain: 'C statements must end with a semicolon.' },
            { lang: 'C', code: 'for(int i=0; i<5; i--) {\n    printf("%d", i);\n}', correctLine: 1, hint: 'should be i++', explain: 'Decrementing i causes an infinite loop. Use i++.' },
            { lang: 'C', code: '#include stdio.h\nint main() { return 0; }', correctLine: 1, hint: 'missing angle brackets', explain: 'Include needs <stdio.h> or "stdio.h".' },
            { lang: 'C', code: 'int arr[3] = {1,2,3};\narr[3] = 5;', correctLine: 2, hint: 'index out of bounds', explain: 'Valid indices for size 3 are 0, 1, 2.' },
            
            // C++
            { lang: 'C++', code: 'cout << "Hello"\nreturn 0;', correctLine: 1, hint: 'missing semicolon', explain: 'Missing semicolon after cout statement.' },
            { lang: 'C++', code: 'int x = 5;\nwhile(x > 0) {\n    cout << x;\n}', correctLine: 2, hint: 'missing x-- causes infinite loop', explain: 'Missing decrement causes an infinite loop.' },
            { lang: 'C++', code: 'string name = \\'Bob\\';\ncout << name;', correctLine: 1, hint: 'should use double quotes', explain: 'Strings use double quotes "", chars use single \\'\\'.' },
            { lang: 'C++', code: 'int* p = null;\nreturn 0;', correctLine: 1, hint: 'should be nullptr', explain: 'In C++, use nullptr (or NULL), not null.' },
            
            // JavaScript
            { lang: 'JavaScript', code: 'let x = 5;\nif(x = 5) {\n    console.log("Yes");\n}', correctLine: 2, hint: 'should be ===', explain: 'Use === or == for comparison, not =.' },
            { lang: 'JavaScript', code: 'console.log("Hi"\nlet y = 10;', correctLine: 1, hint: 'missing closing bracket', explain: 'Missing ); at the end of console.log.' },
            { lang: 'JavaScript', code: 'for(let i=0; i<5; i--) {\n    console.log(i);\n}', correctLine: 1, hint: 'should be i++', explain: 'Decrementing causes an infinite loop.' },
            { lang: 'JavaScript', code: 'let arr = [1,2,3];\nconsole.log(arr[3]);', correctLine: 2, hint: 'index out of bounds', explain: 'Valid indices are 0, 1, 2. arr[3] is undefined.' }
        ];

        function selectLanguage(lang, btnEl) {
            selectedLang = lang;
            const btns = document.getElementById('lang-btns-container').children;
            for(let i=0; i<btns.length; i++) {
                btns[i].classList.remove('selected');
            }
            btnEl.classList.add('selected');
            score = 0;
            document.getElementById('current-score').innerText = score;
        }

        function startGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('game-arena').classList.remove('hidden');
            document.getElementById('result-banner').classList.add('hidden');
            document.getElementById('explanation-card').classList.add('hidden');
            
            let targetLang = selectedLang;
            if(targetLang === 'Random') {
                const langs = ['Python', 'Java', 'C', 'C++', 'JavaScript'];
                targetLang = langs[Math.floor(Math.random() * langs.length)];
            }

            let available = [];
            for(let i=0; i<CHALLENGE_BANK.length; i++) {
                if(CHALLENGE_BANK[i].lang === targetLang && !usedIndexes.includes(i)) {
                    available.push(i);
                }
            }

            if(available.length === 0) {
                // Reset used for this language
                for(let i=0; i<CHALLENGE_BANK.length; i++) {
                    if(CHALLENGE_BANK[i].lang === targetLang) {
                        usedIndexes = usedIndexes.filter(idx => idx !== i);
                    }
                }
                available = [];
                for(let i=0; i<CHALLENGE_BANK.length; i++) {
                    if(CHALLENGE_BANK[i].lang === targetLang) {
                        available.push(i);
                    }
                }
                localStorage.setItem('bugblaster_used_indexes', JSON.stringify(usedIndexes));
            }

            const chosenIndex = available[Math.floor(Math.random() * available.length)];
            currentChallenge = CHALLENGE_BANK[chosenIndex];
            usedIndexes.push(chosenIndex);
            localStorage.setItem('bugblaster_used_indexes', JSON.stringify(usedIndexes));

            renderCode(currentChallenge.code);
            
            timeLeft = 30;
            gameActive = true;
            updateTimerUI();
            
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                if(!gameActive) return;
                timeLeft--;
                updateTimerUI();
                if(timeLeft <= 0) {
                    endGame(false);
                }
            }, 1000);
        }

        function renderCode(codeStr) {
            const lines = codeStr.split('\\n');
            const box = document.getElementById('code-box');
            box.innerHTML = '';
            for(let i=0; i<lines.length; i++) {
                const content = lines[i].replace(/</g, "&lt;").replace(/>/g, "&gt;");
                box.innerHTML += \`<div class="code-line" id="line-\${i+1}" onclick="checkAnswer(\${i+1})">
                    <div class="line-num">\${i+1}</div>
                    <div class="line-content">\${content}</div>
                </div>\`;
            }
        }

        function updateTimerUI() {
            const bar = document.getElementById('timer-bar');
            bar.style.width = (timeLeft / 30 * 100) + '%';
            if(timeLeft <= 5) {
                bar.style.backgroundColor = '#FF4B4B'; // Red
            } else if(timeLeft <= 15) {
                bar.style.backgroundColor = '#FFD700'; // Yellow
            } else {
                bar.style.backgroundColor = '#58CC02'; // Green
            }
        }

        function useHint() {
            if(!gameActive) return;
            if(xp >= 5) {
                xp -= 5;
                localStorage.setItem('bugblaster_xp', xp.toString());
                alert("Hint: " + currentChallenge.hint);
            } else {
                alert("Not enough XP for a hint!");
            }
        }

        function checkAnswer(lineNum) {
            if(!gameActive) return;
            const lineEl = document.getElementById('line-' + lineNum);
            
            if(lineNum === currentChallenge.correctLine) {
                lineEl.classList.add('correct');
                endGame(true);
            } else {
                lineEl.classList.add('wrong');
                lineEl.classList.add('shake');
                setTimeout(() => {
                    lineEl.classList.remove('wrong');
                    lineEl.classList.remove('shake');
                }, 1000);
            }
        }

        function endGame(success) {
            gameActive = false;
            clearInterval(timerInterval);
            const banner = document.getElementById('result-banner');
            banner.classList.remove('hidden');
            
            if(success) {
                banner.className = 'result-banner success';
                banner.innerText = '🎉 Correct! +20 XP';
                xp += 20;
                localStorage.setItem('bugblaster_xp', xp.toString());
                
                score++;
                if(score > highScore) {
                    highScore = score;
                    localStorage.setItem('bugblaster_highscore', highScore.toString());
                    document.getElementById('high-score').innerText = highScore;
                }
                document.getElementById('current-score').innerText = score;
            } else {
                banner.className = 'result-banner error';
                banner.innerText = '⏰ Time\\'s Up!';
                score = 0;
                document.getElementById('current-score').innerText = score;
                const correctEl = document.getElementById('line-' + currentChallenge.correctLine);
                if(correctEl) correctEl.classList.add('correct');
            }
            
            document.getElementById('explanation-text').innerText = currentChallenge.explain;
            document.getElementById('explanation-card').classList.remove('hidden');
        }

        function nextChallenge() {
            startGame();
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('/Users/manavparihar/error-explainer/game.html', htmlContent);
console.log("Rewrote game.html with full Bug Hunter game");
