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

let currentChallenge = null;
    let timerInterval = null;
    let timeLeft = 30;
    let gameActive = false;
    let hintUsed = false;
    
    const topics = [
        "variables", "loops", "functions", "conditionals", "arrays", 
        "strings", "math", "recursion", "input/output", "type conversion"
    ];
    const languages = ["Python", "Java", "C", "C++", "JavaScript"];
    const twists = [
        "wrong variable name", "missing bracket", "wrong operator", 
        "off-by-one error", "wrong function call", "missing return"
    ];

    // Web Audio API Context
    let audioCtx = null;
    let soundEnabled = false;
    const soundToggle = document.getElementById('sound-toggle');
    
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.innerText = soundEnabled ? '🔊' : '🔇';
            
            if (soundEnabled && !audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        });
    }

    function playSound(type) {
        if (!soundEnabled || !audioCtx) return;
        
        // Resume context if suspended
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
    }

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
        
        let gamesPlayed = parseInt(localStorage.getItem('bugblaster_games_played')) || 0;
        localStorage.setItem('bugblaster_games_played', gamesPlayed + 1);
        
        try {
            currentChallenge = await fetchChallenge();
            setupGameUI();
        } catch(e) {
            console.error(e);
            currentChallenge = CHALLENGE_BANK[0];
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
                    playSound('wrong');
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
            let correctGames = parseInt(localStorage.getItem('bugblaster_correct')) || 0;
            localStorage.setItem('bugblaster_correct', correctGames + 1);
            
            playSound('correct');
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            
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

    
    const CHALLENGE_BANK = [
    {
        id: 1, language: 'Python', hint: 'Accumulation', correct_line: 4,
        buggy_code: 'def calculate_total(prices):\n    total = 0\n    for p in prices:\n        total = p\n    return total',
        explanation: 'The loop overwrites the total instead of adding to it. It should be total += p.',
        fixed_code: 'def calculate_total(prices):\n    total = 0\n    for p in prices:\n        total += p\n    return total'
    },
    {
        id: 2, language: 'Java', hint: 'Bounds', correct_line: 2,
        buggy_code: 'int[] numbers = {1, 2, 3};\nfor(int i = 0; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}',
        explanation: 'Arrays are 0-indexed. The condition should be i < numbers.length to prevent OutOfBounds exception.',
        fixed_code: 'int[] numbers = {1, 2, 3};\nfor(int i = 0; i < numbers.length; i++) {\n    System.out.println(numbers[i]);\n}'
    },
    {
        id: 3, language: 'C', hint: 'Semicolon', correct_line: 2,
        buggy_code: 'int main() {\n    int x = 5\n    printf("%d", x);\n    return 0;\n}',
        explanation: 'Missing semicolon at the end of the variable declaration statement.',
        fixed_code: 'int main() {\n    int x = 5;\n    printf("%d", x);\n    return 0;\n}'
    },
    {
        id: 4, language: 'Python', hint: 'Syntax', correct_line: 2,
        buggy_code: 'def check_positive(num):\n    if num > 0\n        return True\n    return False',
        explanation: 'Missing colon at the end of the if statement.',
        fixed_code: 'def check_positive(num):\n    if num > 0:\n        return True\n    return False'
    },
    {
        id: 5, language: 'Java', hint: 'Equality', correct_line: 3,
        buggy_code: 'public boolean checkName(String name) {\n    String expected = "Admin";\n    if (name == expected) {\n        return true;\n    }\n    return false;\n}',
        explanation: 'In Java, use .equals() to compare String values, not == which compares object references.',
        fixed_code: 'public boolean checkName(String name) {\n    String expected = "Admin";\n    if (name.equals(expected)) {\n        return true;\n    }\n    return false;\n}'
    },
    {
        id: 6, language: 'C', hint: 'Address', correct_line: 3,
        buggy_code: 'int main() {\n    int age;\n    scanf("%d", age);\n    return 0;\n}',
        explanation: 'scanf needs the memory address of the variable, so it should be &age.',
        fixed_code: 'int main() {\n    int age;\n    scanf("%d", &age);\n    return 0;\n}'
    },
    {
        id: 7, language: 'Python', hint: 'Return', correct_line: 3,
        buggy_code: 'def add_item(my_list, item):\n    my_list.append(item)\n    my_list = my_list.append(item)\n    return my_list',
        explanation: 'list.append() modifies the list in place and returns None, so assigning it overwrites the list.',
        fixed_code: 'def add_item(my_list, item):\n    my_list.append(item)\n    return my_list'
    },
    {
        id: 8, language: 'Java', hint: 'Return', correct_line: 2,
        buggy_code: 'public int getDouble(int x) {\n    int result = x * 2;\n}',
        explanation: 'The method declares an int return type but does not return anything.',
        fixed_code: 'public int getDouble(int x) {\n    int result = x * 2;\n    return result;\n}'
    },
    {
        id: 9, language: 'C', hint: 'Comparison', correct_line: 3,
        buggy_code: 'int main() {\n    int x = 10;\n    if (x = 5) {\n        printf("X is 5");\n    }\n    return 0;\n}',
        explanation: 'Used assignment (=) instead of comparison (==) in the if statement.',
        fixed_code: 'int main() {\n    int x = 10;\n    if (x == 5) {\n        printf("X is 5");\n    }\n    return 0;\n}'
    },
    {
        id: 10, language: 'Python', hint: 'Indentation', correct_line: 3,
        buggy_code: 'def say_hello():\n    print("Hello")\n   print("World")',
        explanation: 'Python relies on strict indentation. The second print statement has incorrect spacing.',
        fixed_code: 'def say_hello():\n    print("Hello")\n    print("World")'
    },
    {
        id: 11, language: 'Java', hint: 'Increment', correct_line: 2,
        buggy_code: 'public void count() {\n    for (int i = 0; i < 5; ) {\n        System.out.println(i);\n    }\n}',
        explanation: 'Missing increment statement (i++) in the for loop, creating an infinite loop.',
        fixed_code: 'public void count() {\n    for (int i = 0; i < 5; i++) {\n        System.out.println(i);\n    }\n}'
    },
    {
        id: 12, language: 'C', hint: 'Format', correct_line: 3,
        buggy_code: 'int main() {\n    float pi = 3.14;\n    printf("Pi is %d", pi);\n    return 0;\n}',
        explanation: 'Used %d (integer format) instead of %f (float format) for a float variable.',
        fixed_code: 'int main() {\n    float pi = 3.14;\n    printf("Pi is %f", pi);\n    return 0;\n}'
    },
    {
        id: 13, language: 'Python', hint: 'Infinite', correct_line: 3,
        buggy_code: 'def count_down(n):\n    while n > 0:\n        print(n)\n    print("Done!")',
        explanation: 'The variable n is never decremented inside the loop, creating an infinite loop.',
        fixed_code: 'def count_down(n):\n    while n > 0:\n        print(n)\n        n -= 1\n    print("Done!")'
    },
    {
        id: 14, language: 'Java', hint: 'Unreachable', correct_line: 4,
        buggy_code: 'public int multiply(int a, int b) {\n    return a * b;\n    System.out.println("Done");\n}',
        explanation: 'Code after a return statement is unreachable and causes a compilation error.',
        fixed_code: 'public int multiply(int a, int b) {\n    System.out.println("Done");\n    return a * b;\n}'
    },
    {
        id: 15, language: 'C', hint: 'Brackets', correct_line: 2,
        buggy_code: 'int main() {\n    int arr(5);\n    arr[0] = 10;\n    return 0;\n}',
        explanation: 'Array declaration in C uses square brackets [], not parentheses ().',
        fixed_code: 'int main() {\n    int arr[5];\n    arr[0] = 10;\n    return 0;\n}'
    },
    {
        id: 16, language: 'Python', hint: 'Quotes', correct_line: 2,
        buggy_code: 'user = {"name": "Alice", "age": 25}\nprint(user[name])',
        explanation: 'Dictionary keys need to be strings. It should be user["name"].',
        fixed_code: 'user = {"name": "Alice", "age": 25}\nprint(user["name"])'
    },
    {
        id: 17, language: 'Java', hint: 'Initialize', correct_line: 3,
        buggy_code: 'public void printScore() {\n    int score;\n    System.out.println(score);\n}',
        explanation: 'Local variables must be initialized before they can be used.',
        fixed_code: 'public void printScore() {\n    int score = 0;\n    System.out.println(score);\n}'
    },
    {
        id: 18, language: 'C', hint: 'Quotes', correct_line: 2,
        buggy_code: 'int main() {\n    printf(Hello World);\n    return 0;\n}',
        explanation: 'Strings in C must be enclosed in double quotes.',
        fixed_code: 'int main() {\n    printf("Hello World");\n    return 0;\n}'
    },
    {
        id: 19, language: 'Python', hint: 'Types', correct_line: 2,
        buggy_code: 'def show_age(age):\n    print("Age is: " + age)',
        explanation: 'Cannot concatenate string and integer directly. Must convert age to string using str(age).',
        fixed_code: 'def show_age(age):\n    print("Age is: " + str(age))'
    },
    {
        id: 20, language: 'Java', hint: 'Signature', correct_line: 1,
        buggy_code: 'public void main(String[] args) {\n    System.out.println("Started");\n}',
        explanation: 'The main method must be static to serve as the entry point of a Java application.',
        fixed_code: 'public static void main(String[] args) {\n    System.out.println("Started");\n}'

    ,
    {
        id: 21, language: 'C++', hint: 'Namespace', correct_line: 2,
        buggy_code: '#include <iostream>\nint main() {\n    cout << "Hello World";\n    return 0;\n}',
        explanation: 'In C++, standard library functions like cout are in the std namespace. You must use std::cout or declare using namespace std.',
        fixed_code: '#include <iostream>\nint main() {\n    std::cout << "Hello World";\n    return 0;\n}'
    },
    {
        id: 22, language: 'C++', hint: 'Semicolon', correct_line: 2,
        buggy_code: 'class Car {\n    int speed\n};',
        explanation: 'Missing a semicolon after the member variable declaration inside a class.',
        fixed_code: 'class Car {\n    int speed;\n};'
    },
    {
        id: 23, language: 'JavaScript', hint: 'Equality', correct_line: 2,
        buggy_code: 'function checkZero(num) {\n    if (num = 0) {\n        return true;\n    }\n    return false;\n}',
        explanation: 'Using a single equals sign (=) assigns the value instead of comparing it. You should use === for comparison.',
        fixed_code: 'function checkZero(num) {\n    if (num === 0) {\n        return true;\n    }\n    return false;\n}'
    },
    {
        id: 24, language: 'JavaScript', hint: 'Const', correct_line: 3,
        buggy_code: 'const count = 1;\nfunction increment() {\n    count++;\n    return count;\n}',
        explanation: 'Variables declared with const cannot be reassigned or incremented. Use let instead.',
        fixed_code: 'let count = 1;\nfunction increment() {\n    count++;\n    return count;\n}'
    }
    }
];


    async function fetchChallenge() {
        let usedIds = JSON.parse(localStorage.getItem('bugblaster_used_ids')) || [];
        
        
        const activeLang = selectedLang === 'Random' 
            ? languages[Math.floor(Math.random() * languages.length)] 
            : selectedLang;
        
        const unusedBank = CHALLENGE_BANK.filter(c => !usedIds.includes(c.id) && c.language === activeLang);

        
        if (unusedBank.length > 0) {
            const challenge = unusedBank[Math.floor(Math.random() * unusedBank.length)];
            usedIds.push(challenge.id);
            localStorage.setItem('bugblaster_used_ids', JSON.stringify(usedIds));
            // Simulate network delay
            return new Promise(resolve => setTimeout(() => resolve(challenge), 500));
        }

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomLanguage = selectedLang === 'Random' ? languages[Math.floor(Math.random() * languages.length)] : selectedLang;
        const randomTwist = twists[Math.floor(Math.random() * twists.length)];

        const API_KEY = "YOUR_CLAUDE_API_KEY_HERE";
        if (API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
            const challenge = CHALLENGE_BANK[Math.floor(Math.random() * CHALLENGE_BANK.length)];
            return new Promise((resolve) => setTimeout(() => resolve(challenge), 1000));
        }

        const prompt = `Timestamp: ${Date.now()}. Random seed: ${Math.random()}. Generate a UNIQUE buggy code challenge ONLY in ${randomLanguage}. Do not use any other language. Topic: ${randomTopic}. Bug type: ${randomTwist}. This must be completely different from any standard textbook example. Return ONLY JSON: { 'language': '${randomLanguage}', 'buggy_code': '...', 'hint': 'one word hint', 'correct_line': 3, 'explanation': 'simple explanation', 'fixed_code': '...' }`;

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
        
        let challenge;
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            challenge = JSON.parse(jsonMatch[1]);
        } else {
            challenge = JSON.parse(content);
        }

        return challenge;
    }
});
