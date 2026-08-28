document.addEventListener('DOMContentLoaded', () => {
    const startHuntBtn = document.getElementById('start-hunt-btn');
    const startScreen = document.getElementById('start-screen');
    const gameArena = document.getElementById('game-arena');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    const codeBox = document.getElementById('code-box');
    const hintBtn = document.getElementById('hint-btn');
    const hintText = document.getElementById('hint-text');
    const timerBar = document.getElementById('timer-bar');
    const resultMessage = document.getElementById('result-message');
    const explanationCard = document.getElementById('explanation-card');
    const nextChallengeBtn = document.getElementById('next-challenge-btn');
    
    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const gameStreakEl = document.getElementById('game-streak');

    let score = parseInt(localStorage.getItem('bugblaster_score')) || 0;
    let highScore = parseInt(localStorage.getItem('bugblaster_highscore')) || 0;
    
    currentScoreEl.innerText = score;
    highScoreEl.innerText = highScore;

    if (window.gamification) {
        gameStreakEl.innerText = window.gamification.streak;
    }

    let currentChallenge = null;
    let timerInterval = null;
    let timeLeft = 30;
    let gameActive = false;
    let hintUsed = false;

    if (startHuntBtn) startHuntBtn.addEventListener('click', startNewChallenge);
    if (nextChallengeBtn) nextChallengeBtn.addEventListener('click', startNewChallenge);
    if (hintBtn) hintBtn.addEventListener('click', useHint);

    async function startNewChallenge() {
        startScreen.classList.add('hidden');
        explanationCard.classList.add('hidden');
        resultMessage.classList.add('hidden');
        gameArena.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
        
        clearInterval(timerInterval);
        
        try {
            currentChallenge = await fetchChallengeFromClaude();
            setupGameUI();
        } catch(e) {
            console.error(e);
            currentChallenge = getFallbackChallenge();
            setupGameUI();
        }
    }

    function setupGameUI() {
        loadingSpinner.classList.add('hidden');
        gameArena.classList.remove('hidden');
        
        hintBtn.classList.remove('hidden');
        hintText.classList.add('hidden');
        hintText.innerText = `Hint: ${currentChallenge.hint}`;
        hintUsed = false;
        
        renderCodeLines(currentChallenge.buggy_code);
        
        timeLeft = 30;
        gameActive = true;
        updateTimerBar();
        
        timerInterval = setInterval(() => {
            timeLeft -= 1;
            updateTimerBar();
            
            if (timeLeft <= 0) {
                endGame(false, "time");
            }
        }, 1000);
    }

    function renderCodeLines(code) {
        codeBox.innerHTML = '';
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'code-line';
            // ensure empty lines have a non-breaking space so they render properly
            const lineContent = line.trim() === '' ? '&nbsp;' : line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            lineEl.innerHTML = `<span class="line-number">${index + 1}</span> <span class="line-content">${lineContent}</span>`;
            
            lineEl.addEventListener('click', () => {
                if (!gameActive) return;
                
                // Assuming Claude's line numbers might be 1-indexed
                if ((index + 1) === currentChallenge.correct_line) {
                    lineEl.classList.add('correct');
                    endGame(true);
                } else {
                    lineEl.classList.add('wrong');
                    setTimeout(() => lineEl.classList.remove('wrong'), 500);
                    timeLeft = Math.max(0, timeLeft - 5);
                    showTempMessage("❌ Wrong line! -5s penalty", "error");
                    updateTimerBar();
                    if (timeLeft <= 0) endGame(false, "time");
                }
            });
            codeBox.appendChild(lineEl);
        });
    }

    function updateTimerBar() {
        const percentage = (timeLeft / 30) * 100;
        timerBar.style.width = `${percentage}%`;
        
        if (timeLeft <= 5) {
            timerBar.style.backgroundColor = '#FF4B4B';
        } else if (timeLeft <= 15) {
            timerBar.style.backgroundColor = '#FFD700';
        } else {
            timerBar.style.backgroundColor = '#58CC02';
        }
    }

    function useHint() {
        if (hintUsed || !gameActive) return;
        
        if (window.gamification && window.gamification.xp >= 5) {
            window.gamification.awardXP(-5); // Will just deduct XP
            hintUsed = true;
            hintBtn.classList.add('hidden');
            hintText.classList.remove('hidden');
        } else {
            alert("Not enough XP for a hint!");
        }
    }

    function endGame(success, reason = "") {
        gameActive = false;
        clearInterval(timerInterval);
        
        resultMessage.classList.remove('hidden');
        
        if (success) {
            resultMessage.innerHTML = '<h2>🎉 Correct! +20 XP</h2>';
            resultMessage.className = 'result-message success';
            score += 1;
            if (score > highScore) highScore = score;
            
            localStorage.setItem('bugblaster_score', score);
            localStorage.setItem('bugblaster_highscore', highScore);
            
            currentScoreEl.innerText = score;
            highScoreEl.innerText = highScore;
            
            if (window.gamification) {
                window.gamification.awardXP(20);
            }
        } else {
            resultMessage.innerHTML = '<h2>⏰ Time\'s Up!</h2>';
            resultMessage.className = 'result-message error';
            score = 0;
            localStorage.setItem('bugblaster_score', score);
            currentScoreEl.innerText = score;
            
            // Highlight the correct line
            const lines = codeBox.querySelectorAll('.code-line');
            if (lines[currentChallenge.correct_line - 1]) {
                lines[currentChallenge.correct_line - 1].classList.add('missed');
            }
        }
        
        document.getElementById('bug-explanation').innerText = currentChallenge.explanation;
        document.getElementById('bug-fixed-code').innerText = currentChallenge.fixed_code;
        explanationCard.classList.remove('hidden');
    }

    function showTempMessage(msg, type) {
        resultMessage.innerHTML = `<h3>${msg}</h3>`;
        resultMessage.className = `result-message ${type}`;
        resultMessage.classList.remove('hidden');
        setTimeout(() => {
            if (gameActive) resultMessage.classList.add('hidden');
        }, 1500);
    }

    async function fetchChallengeFromClaude() {
        const API_KEY = "YOUR_CLAUDE_API_KEY_HERE";
        if (API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
            return new Promise((resolve) => setTimeout(() => resolve(getFallbackChallenge()), 1000));
        }

        const prompt = "Generate a beginner-level buggy Python/C/Java code snippet (max 10 lines) with exactly ONE bug. Return ONLY JSON: { 'language': 'Python', 'buggy_code': '...', 'hint': 'one word hint', 'correct_line': 3, 'explanation': 'simple explanation', 'fixed_code': '...' }";

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
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
        
        // Extract JSON if wrapped in markdown block
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        return JSON.parse(content);
    }

    function getFallbackChallenge() {
        return {
            language: 'Python',
            buggy_code: 'def greet(name):\n    print("Hello " + name)\n    \ngreet("Alice", "Bob")',
            hint: 'Arguments',
            correct_line: 4,
            explanation: 'The function `greet` only accepts one argument `name`, but two arguments were provided when calling it.',
            fixed_code: 'def greet(name):\n    print("Hello " + name)\n    \ngreet("Alice")'
        };
    }
});
