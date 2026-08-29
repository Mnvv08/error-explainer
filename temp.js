
    
    // ══════════════════════════════════════════════════════
    // DAILY CHALLENGE ENGINE
    // ══════════════════════════════════════════════════════

                var DAILY_CHALLENGES = [
        { type:'bug',   lang:'Python',     code:['def multiply(a, b):','    return a + b','print(multiply(3,4))'], bug:2, hint:'operator', explanation:'Should be * not + to multiply numbers.', fix:'    return a * b', points:50 },
        { type:'bug',   lang:'Java',       code:['int[] nums = {1,2,3,4,5};','System.out.println(nums[5]);'], bug:2, hint:'array index', explanation:'Array index 5 is out of bounds. Max index is 4.', fix:'System.out.println(nums[4]);', points:50 },
        { type:'guess', code:'fmt.Println("Hello World")', answer:'Go', options:['Go','Python','Java','C++'], hint:'fmt package', funFact:'Go was created by Google in 2009!', points:50 },
        { type:'bug',   lang:'JavaScript', code:['let nums = [1,2,3];','nums.push(4)','console.log(nums.length);'], bug:3, hint:'spelling', explanation:'"length" is spelled correctly now.', fix:'console.log(nums.length);', points:50 },
        { type:'bug',   lang:'Python',     code:['for i in range(10)','    print(i)'], bug:1, hint:'colon', explanation:'Missing colon at the end of the for statement.', fix:'for i in range(10):', points:50 },
        { type:'guess', code:'SELECT * FROM users WHERE id = 1;', answer:'SQL', options:['SQL','Python','Java','C'], hint:'database query', funFact:'SQL was developed at IBM in the 1970s!', points:50 },
        { type:'bug',   lang:'C',          code:['int x = 10;','int y = 0;','printf("%d", x/y);'], bug:3, hint:'division by zero', explanation:'Division by zero causes a crash!', fix:'if(y != 0) printf("%d", x/y);', points:50 },
        { type:'bug',   lang:'Python',     code:['name = "BugBlaster"','print(name[20])'], bug:2, hint:'index out of range', explanation:'String only has 10 chars. Index 20 is out of range.', fix:'print(name[0])', points:50 },
        { type:'guess', code:'let mut x = 5;\nx += 1;', answer:'Rust', options:['Rust','C++','Go','Swift'], hint:'mut keyword', funFact:'Rust has been the most loved language 8 years in a row!', points:50 },
        { type:'bug',   lang:'Java',       code:['String name = null;','System.out.println(name.length());'], bug:2, hint:'null reference', explanation:'Cannot call methods on null — NullPointerException!', fix:'if(name != null) System.out.println(name.length());', points:50 },
        { type:'bug',   lang:'C++',        code:['int* p = nullptr;','cout << *p;'], bug:2, hint:'null pointer', explanation:'Dereferencing a null pointer causes undefined behaviour!', fix:'if(p) cout << *p;', points:50 },
        { type:'guess', code:'<h1>Hello World</h1>', answer:'HTML', options:['HTML','CSS','JavaScript','XML'], hint:'angle bracket tags', funFact:'HTML was invented by Tim Berners-Lee in 1991!', points:50 },
        { type:'bug',   lang:'Python',     code:['x = 5','y = "hello"','print(x + y)'], bug:3, hint:'type error', explanation:'Cannot add int and string in Python without conversion.', fix:'print(str(x) + y)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['function greet() {','    return','    "Hello World"','}'], bug:2, hint:'return semicolon', explanation:'JavaScript inserts a semicolon after return — use parentheses.', fix:'    return "Hello World"', points:50 },
        { type:'guess', code:'body {\n  background-color: red;\n  font-size: 16px;\n}', answer:'CSS', options:['CSS','HTML','JavaScript','Sass'], hint:'curly brace styling', funFact:'CSS was first proposed by Håkon Wium Lie in 1994!', points:50 },
        { type:'bug',   lang:'Java',       code:['int x = 5;','if(x = 10) {','    System.out.println("Ten!");','}'], bug:2, hint:'assignment vs comparison', explanation:'= assigns a value; == compares. Use ==.', fix:'if(x == 10) {', points:50 },
        { type:'bug',   lang:'C',          code:['char name[5];','strcpy(name, "BugBlaster");','printf("%s", name);'], bug:2, hint:'buffer overflow', explanation:'Array only holds 5 chars but "BugBlaster" needs 11!', fix:'char name[12];', points:50 },
        { type:'guess', code:'def greet():\n    print("Hello")\ngreet()', answer:'Python', options:['Python','Ruby','JavaScript','Go'], hint:'def keyword', funFact:'Python was named after Monty Python, not the snake!', points:50 },
        { type:'bug',   lang:'Python',     code:['def factorial(n):','    if n == 0:','        return 1','    return n * factorial(n)'], bug:4, hint:'infinite recursion', explanation:'Should call factorial(n-1) not factorial(n)!', fix:'    return n * factorial(n-1)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['const PI = 3.14159;','PI = 3;'], bug:2, hint:'const', explanation:'const variables cannot be reassigned. Use let instead.', fix:'let PI = 3.14159;', points:50 },
        { type:'guess', code:'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Go!")\n}', answer:'Go', options:['Go','Java','C','Rust'], hint:'package main', funFact:'Go compiles faster than almost any other language!', points:50 },
        { type:'bug',   lang:'C++',        code:['vector<int> v;','cout << v[0];'], bug:2, hint:'empty vector', explanation:'Accessing index 0 of an empty vector is undefined behaviour!', fix:'if(!v.empty()) cout << v[0];', points:50 },
        { type:'guess', code:'fn main() {\n    println!("Hello, Rust!");\n}', answer:'Rust', options:['Rust','C','Go','Swift'], hint:'println! macro', funFact:'Rust was originally designed by Graydon Hoare at Mozilla!', points:50 },
        { type:'bug',   lang:'Python',     code:['nums = [1, 2, 3]','for i in range(4):','    print(nums[i])'], bug:2, hint:'range too large', explanation:'List has 3 items (index 0-2). range(4) goes to index 3 which is out of range.', fix:'for i in range(3):', points:50 },
        { type:'bug',   lang:'Java',       code:['int result = 7 / 2;','System.out.println(result);'], bug:1, hint:'integer division', explanation:'7/2 in Java gives 3 (integer). Use 7.0/2 for 3.5.', fix:'double result = 7.0 / 2;', points:50 },
        { type:'guess', code:'SELECT name, age FROM students ORDER BY age DESC;', answer:'SQL', options:['SQL','MongoDB','Python','PHP'], hint:'SELECT keyword', funFact:'SQL stands for Structured Query Language!', points:50 },
        { type:'bug',   lang:'JavaScript', code:['let x = 10;','let y = "5";','console.log(x - y);','console.log(x + y);'], bug:4, hint:'type coercion', explanation:'+ concatenates strings in JS. x+"5" is "105", not 15.', fix:'console.log(x + parseInt(y));', points:50 },
        { type:'guess', code:'#[derive(Debug)]\nstruct Point { x: i32, y: i32 }', answer:'Rust', options:['Rust','C++','Go','Java'], hint:'derive attribute', funFact:'Rust structs can derive common traits automatically!', points:50 },
        { type:'bug',   lang:'Python',     code:['import math','result = math.sqrt(-1)','print(result)'], bug:2, hint:'domain error', explanation:'Square root of negative numbers requires the cmath module!', fix:'import cmath\nresult = cmath.sqrt(-1)', points:50 },
        { type:'bug',   lang:'C',          code:['int main() {','    printf("Hello");','    return 1;','}'], bug:3, hint:'missing return value', explanation:'main() should return 0 to indicate success, not 1.', fix:'    return 0;', points:50 },
    ];','nums.push(4)','console.log(nums.length);'], bug:3, hint:'spelling', explanation:'"length" is spelled correctly now.', fix:'console.log(nums.length);', points:50 },
        { type:'bug',   lang:'Python',     code:['for i in range(10)','    print(i)'], bug:1, hint:'colon', explanation:'Missing colon at the end of the for statement.', fix:'for i in range(10):', points:50 },
        { type:'guess', code:'SELECT * FROM users WHERE id = 1;', answer:'SQL', options:['SQL','Python','Java','C'], hint:'database query', funFact:'SQL was developed at IBM in the 1970s!', points:50 },
        { type:'bug',   lang:'C',          code:['int x = 10;','int y = 0;','printf("%d", x/y);'], bug:3, hint:'division by zero', explanation:'Division by zero causes a crash!', fix:'if(y != 0) printf("%d", x/y);', points:50 },
        { type:'bug',   lang:'Python',     code:['name = "BugBlaster"','print(name[20])'], bug:2, hint:'index out of range', explanation:'String only has 10 chars. Index 20 is out of range.', fix:'print(name[0])', points:50 },
        { type:'guess', code:'let mut x = 5;
x += 1;', answer:'Rust', options:['Rust','C++','Go','Swift'], hint:'mut keyword', funFact:'Rust has been the most loved language 8 years in a row!', points:50 },
        { type:'bug',   lang:'Java',       code:['String name = null;','System.out.println(name.length());'], bug:2, hint:'null reference', explanation:'Cannot call methods on null — NullPointerException!', fix:'if(name != null) System.out.println(name.length());', points:50 },
        { type:'bug',   lang:'C++',        code:['int* p = nullptr;','cout << *p;'], bug:2, hint:'null pointer', explanation:'Dereferencing a null pointer causes undefined behaviour!', fix:'if(p) cout << *p;', points:50 },
        { type:'guess', code:'<h1>Hello World</h1>', answer:'HTML', options:['HTML','CSS','JavaScript','XML'], hint:'angle bracket tags', funFact:'HTML was invented by Tim Berners-Lee in 1991!', points:50 },
        { type:'bug',   lang:'Python',     code:['x = 5','y = "hello"','print(x + y)'], bug:3, hint:'type error', explanation:'Cannot add int and string in Python without conversion.', fix:'print(str(x) + y)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['function greet() {','    return','    "Hello World"','}'], bug:2, hint:'return semicolon', explanation:'JavaScript inserts a semicolon after return — use parentheses.', fix:'    return "Hello World"', points:50 },
        { type:'guess', code:'body {
  background-color: red;
  font-size: 16px;
}', answer:'CSS', options:['CSS','HTML','JavaScript','Sass'], hint:'curly brace styling', funFact:'CSS was first proposed by Håkon Wium Lie in 1994!', points:50 },
        { type:'bug',   lang:'Java',       code:['int x = 5;','if(x = 10) {','    System.out.println("Ten!");','}'], bug:2, hint:'assignment vs comparison', explanation:'= assigns a value; == compares. Use ==.', fix:'if(x == 10) {', points:50 },
        { type:'bug',   lang:'C',          code:['char name[5];','strcpy(name, "BugBlaster");','printf("%s", name);'], bug:2, hint:'buffer overflow', explanation:'Array only holds 5 chars but "BugBlaster" needs 11!', fix:'char name[12];', points:50 },
        { type:'guess', code:'def greet():
    print("Hello")
greet()', answer:'Python', options:['Python','Ruby','JavaScript','Go'], hint:'def keyword', funFact:'Python was named after Monty Python, not the snake!', points:50 },
        { type:'bug',   lang:'Python',     code:['def factorial(n):','    if n == 0:','        return 1','    return n * factorial(n)'], bug:4, hint:'infinite recursion', explanation:'Should call factorial(n-1) not factorial(n)!', fix:'    return n * factorial(n-1)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['const PI = 3.14159;','PI = 3;'], bug:2, hint:'const', explanation:'const variables cannot be reassigned. Use let instead.', fix:'let PI = 3.14159;', points:50 },
        { type:'guess', code:'package main
import "fmt"
func main() {
    fmt.Println("Go!")
}', answer:'Go', options:['Go','Java','C','Rust'], hint:'package main', funFact:'Go compiles faster than almost any other language!', points:50 },
        { type:'bug',   lang:'C++',        code:['vector<int> v;','cout << v[0];'], bug:2, hint:'empty vector', explanation:'Accessing index 0 of an empty vector is undefined behaviour!', fix:'if(!v.empty()) cout << v[0];', points:50 },
        { type:'guess', code:'fn main() {
    println!("Hello, Rust!");
}', answer:'Rust', options:['Rust','C','Go','Swift'], hint:'println! macro', funFact:'Rust was originally designed by Graydon Hoare at Mozilla!', points:50 },
        { type:'bug',   lang:'Python',     code:['nums = [1, 2, 3]','for i in range(4):','    print(nums[i])'], bug:2, hint:'range too large', explanation:'List has 3 items (index 0-2). range(4) goes to index 3 which is out of range.', fix:'for i in range(3):', points:50 },
        { type:'bug',   lang:'Java',       code:['int result = 7 / 2;','System.out.println(result);'], bug:1, hint:'integer division', explanation:'7/2 in Java gives 3 (integer). Use 7.0/2 for 3.5.', fix:'double result = 7.0 / 2;', points:50 },
        { type:'guess', code:'SELECT name, age FROM students ORDER BY age DESC;', answer:'SQL', options:['SQL','MongoDB','Python','PHP'], hint:'SELECT keyword', funFact:'SQL stands for Structured Query Language!', points:50 },
        { type:'bug',   lang:'JavaScript', code:['let x = 10;','let y = "5";','console.log(x - y);','console.log(x + y);'], bug:4, hint:'type coercion', explanation:'+ concatenates strings in JS. x+"5" is "105", not 15.', fix:'console.log(x + parseInt(y));', points:50 },
        { type:'guess', code:'#[derive(Debug)]
struct Point { x: i32, y: i32 }', answer:'Rust', options:['Rust','C++','Go','Java'], hint:'derive attribute', funFact:'Rust structs can derive common traits automatically!', points:50 },
        { type:'bug',   lang:'Python',     code:['import math','result = math.sqrt(-1)','print(result)'], bug:2, hint:'domain error', explanation:'Square root of negative numbers requires the cmath module!', fix:'import cmath
result = cmath.sqrt(-1)', points:50 },
        { type:'bug',   lang:'C',          code:['int main() {','    printf("Hello");','    return 1;','}'], bug:3, hint:'missing return value', explanation:'main() should return 0 to indicate success, not 1.', fix:'    return 0;', points:50 },
    ];','nums.push(4)','console.log(nums.length);'], bug:3, hint:'spelling', explanation:'"length" is spelled correctly now.', fix:'console.log(nums.length);', points:50 },
        { type:'bug',   lang:'Python',     code:['for i in range(10)','    print(i)'], bug:1, hint:'colon', explanation:'Missing colon at the end of the for statement.', fix:'for i in range(10):', points:50 },
        { type:'guess', code:'SELECT * FROM users WHERE id = 1;', answer:'SQL', options:['SQL','Python','Java','C'], hint:'database query', funFact:'SQL was developed at IBM in the 1970s!', points:50 },
        { type:'bug',   lang:'C',          code:['int x = 10;','int y = 0;','printf("%d", x/y);'], bug:3, hint:'division by zero', explanation:'Division by zero causes a crash!', fix:'if(y != 0) printf("%d", x/y);', points:50 },
        { type:'bug',   lang:'Python',     code:['name = "BugBlaster"','print(name[20])'], bug:2, hint:'index out of range', explanation:'String only has 10 chars. Index 20 is out of range.', fix:'print(name[0])', points:50 },
        { type:'guess', code:'let mut x = 5;
x += 1;', answer:'Rust', options:['Rust','C++','Go','Swift'], hint:'mut keyword', funFact:'Rust has been the most loved language 8 years in a row!', points:50 },
        { type:'bug',   lang:'Java',       code:['String name = null;','System.out.println(name.length());'], bug:2, hint:'null reference', explanation:'Cannot call methods on null — NullPointerException!', fix:'if(name != null) System.out.println(name.length());', points:50 },
        { type:'bug',   lang:'C++',        code:['int* p = nullptr;','cout << *p;'], bug:2, hint:'null pointer', explanation:'Dereferencing a null pointer causes undefined behaviour!', fix:'if(p) cout << *p;', points:50 },
        { type:'guess', code:'<h1>Hello World</h1>', answer:'HTML', options:['HTML','CSS','JavaScript','XML'], hint:'angle bracket tags', funFact:'HTML was invented by Tim Berners-Lee in 1991!', points:50 },
        { type:'bug',   lang:'Python',     code:['x = 5','y = "hello"','print(x + y)'], bug:3, hint:'type error', explanation:'Cannot add int and string in Python without conversion.', fix:'print(str(x) + y)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['function greet() {','    return','    "Hello World"','}'], bug:2, hint:'return semicolon', explanation:'JavaScript inserts a semicolon after return — use parentheses.', fix:'    return "Hello World"', points:50 },
        { type:'guess', code:'body {
  background-color: red;
  font-size: 16px;
}', answer:'CSS', options:['CSS','HTML','JavaScript','Sass'], hint:'curly brace styling', funFact:'CSS was first proposed by Håkon Wium Lie in 1994!', points:50 },
        { type:'bug',   lang:'Java',       code:['int x = 5;','if(x = 10) {','    System.out.println("Ten!");','}'], bug:2, hint:'assignment vs comparison', explanation:'= assigns a value; == compares. Use ==.', fix:'if(x == 10) {', points:50 },
        { type:'bug',   lang:'C',          code:['char name[5];','strcpy(name, "BugBlaster");','printf("%s", name);'], bug:2, hint:'buffer overflow', explanation:'Array only holds 5 chars but "BugBlaster" needs 11!', fix:'char name[12];', points:50 },
        { type:'guess', code:'def greet():
    print("Hello")
greet()', answer:'Python', options:['Python','Ruby','JavaScript','Go'], hint:'def keyword', funFact:'Python was named after Monty Python, not the snake!', points:50 },
        { type:'bug',   lang:'Python',     code:['def factorial(n):','    if n == 0:','        return 1','    return n * factorial(n)'], bug:4, hint:'infinite recursion', explanation:'Should call factorial(n-1) not factorial(n)!', fix:'    return n * factorial(n-1)', points:50 },
        { type:'bug',   lang:'JavaScript', code:['const PI = 3.14159;','PI = 3;'], bug:2, hint:'const', explanation:'const variables cannot be reassigned. Use let instead.', fix:'let PI = 3.14159;', points:50 },
        { type:'guess', code:'package main
import "fmt"
func main() {
    fmt.Println("Go!")
}', answer:'Go', options:['Go','Java','C','Rust'], hint:'package main', funFact:'Go compiles faster than almost any other language!', points:50 },
        { type:'bug',   lang:'C++',        code:['vector<int> v;','cout << v[0];'], bug:2, hint:'empty vector', explanation:'Accessing index 0 of an empty vector is undefined behaviour!', fix:'if(!v.empty()) cout << v[0];', points:50 },
        { type:'guess', code:'fn main() {
    println!("Hello, Rust!");
}', answer:'Rust', options:['Rust','C','Go','Swift'], hint:'println! macro', funFact:'Rust was originally designed by Graydon Hoare at Mozilla!', points:50 },
        { type:'bug',   lang:'Python',     code:['nums = [1, 2, 3]','for i in range(4):','    print(nums[i])'], bug:2, hint:'range too large', explanation:'List has 3 items (index 0-2). range(4) goes to index 3 which is out of range.', fix:'for i in range(3):', points:50 },
        { type:'bug',   lang:'Java',       code:['int result = 7 / 2;','System.out.println(result);'], bug:1, hint:'integer division', explanation:'7/2 in Java gives 3 (integer). Use 7.0/2 for 3.5.', fix:'double result = 7.0 / 2;', points:50 },
        { type:'guess', code:'SELECT name, age FROM students ORDER BY age DESC;', answer:'SQL', options:['SQL','MongoDB','Python','PHP'], hint:'SELECT keyword', funFact:'SQL stands for Structured Query Language!', points:50 },
        { type:'bug',   lang:'JavaScript', code:['let x = 10;','let y = "5";','console.log(x - y);','console.log(x + y);'], bug:4, hint:'type coercion', explanation:'+ concatenates strings in JS. x+"5" is "105", not 15.', fix:'console.log(x + parseInt(y));', points:50 },
        { type:'guess', code:'#[derive(Debug)]
struct Point { x: i32, y: i32 }', answer:'Rust', options:['Rust','C++','Go','Java'], hint:'derive attribute', funFact:'Rust structs can derive common traits automatically!', points:50 },
        { type:'bug',   lang:'Python',     code:['import math','result = math.sqrt(-1)','print(result)'], bug:2, hint:'domain error', explanation:'Square root of negative numbers requires the cmath module!', fix:'import cmath
result = cmath.sqrt(-1)', points:50 },
        { type:'bug',   lang:'C',          code:['int main() {','    printf("Hello");','    return 1;','}'], bug:3, hint:'missing return value', explanation:'main() should return 0 to indicate success, not 1.', fix:'    return 0;', points:50 },
    ];

    var LANG_EMOJIS = { Python:'🐍', Java:'☕', JavaScript:'🌐', C:'⚡', 'C++':'🔷', Go:'🐹', Rust:'🦀', SQL:'🗄️', HTML:'🌐', CSS:'🎨', Ruby:'💎' };

    // ===== DAILY CHALLENGE STATE =====
    var TOTAL_QUESTIONS = 3;
    var currentQuestionNum = 0;
    var questionsForToday = [];
    var todayKey = new Date().toDateString();
    var dcAnswered = false;
    var currentChallenge = null;

    // ===== ON PAGE LOAD =====
    window.onload = function() {
        // Optional: clear local storage if requested via console
        // localStorage.removeItem('bugblaster_last_daily');
        // localStorage.removeItem('bugblaster_last_daily_prev');

        var lastCompleted = localStorage.getItem('bugblaster_last_daily');
        
        if(lastCompleted === todayKey) {
            // Already done today — show completed card
            showCompletedCard();
        } else {
            // Not done today — clear any old state and show intro
            currentQuestionNum = 0;
            prepareQuestionsForToday();
            showIntroCard();
        }
    }

    // ===== PREPARE 3 QUESTIONS FOR TODAY =====
    function prepareQuestionsForToday() {
        var seed = new Date().getFullYear() * 10000 + 
                   (new Date().getMonth()+1) * 100 + 
                   new Date().getDate();
        questionsForToday = [];
        for(var i = 0; i < TOTAL_QUESTIONS; i++) {
            var idx = (seed + i * 7) % DAILY_CHALLENGES.length;
            questionsForToday.push(DAILY_CHALLENGES[idx]);
        }
    }

    // ===== SHOW INTRO CARD =====
    function showIntroCard() {
        document.getElementById('intro-card').style.display = 'block';
        document.getElementById('challenge-area').style.display = 'none';
        document.getElementById('completed-card').style.display = 'none';
        
        // Populate intro details based on first question
        var firstQ = questionsForToday[0];
        if (document.getElementById('intro-type')) {
            var tBadge = firstQ.type === 'bug' 
                ? '<span class="challenge-type-pill type-bug">🐛 Bug Hunt</span>' 
                : '<span class="challenge-type-pill type-guess">🌐 Guess the Language</span>';
            var lBadge = firstQ.lang ? ('<span class="lang-badge-dc">' + (LANG_EMOJIS[firstQ.lang]||'') + ' ' + firstQ.lang + '</span>') : '';
            document.getElementById('intro-type').innerHTML = tBadge + ' ' + lBadge;
        }
        
        var dailyStreak = parseInt(localStorage.getItem('bugblaster_daily_streak') || '0');
        if(document.getElementById('intro-streak-badge')) {
            document.getElementById('intro-streak-badge').textContent = '🔥 Daily Streak: ' + dailyStreak + ' day' + (dailyStreak !== 1 ? 's' : '');
        }
    }

    // ===== START BUTTON CLICKED =====
    function startDailyChallenge() {
        document.getElementById('intro-card').style.display = 'none';
        document.getElementById('challenge-area').style.display = 'block';
        currentQuestionNum = 0;
        loadQuestion(currentQuestionNum);
    }

    // ===== LOAD QUESTION =====
    function loadQuestion(num) {
        currentChallenge = questionsForToday[num];
        dcAnswered = false;
        
        // Update progress bar
        var progressEl = document.getElementById('progress-text');
        if (progressEl) {
            progressEl.textContent = 'Question ' + (num+1) + ' of ' + TOTAL_QUESTIONS;
        }
        
        // Reset result card
        var resCard = document.getElementById('result-card');
        if (resCard) resCard.style.display = 'none';
        
        var nextBtn = document.getElementById('next-question-btn');
        if (nextBtn) nextBtn.style.display = 'none';
        
        var explEl = document.getElementById('dc-explanation');
        if (explEl) explEl.style.display = 'none';

        // Load the challenge
        if(currentChallenge.type === 'bug') {
            loadBugChallenge(currentChallenge);
        } else {
            loadGuessChallenge(currentChallenge);
        }
    }

    // ===== RENDER BUG CHALLENGE =====
    function loadBugChallenge(ch) {
        var card = document.getElementById('challenge-card');
        var emoji = LANG_EMOJIS[ch.lang] || '💻';
        var linesHTML = ch.code.map(function(line, i) {
            return '<div class="dc-code-line" id="dc-line-'+(i+1)+'" onclick="checkDCAnswer('+(i+1)+')">' +
                '<span class="dc-line-num">'+(i+1)+'</span>' +
                '<span>' + line.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span>' +
                '</div>';
        }).join('');

        card.innerHTML =
            '<div>' +
            '<span class="challenge-type-pill type-bug">🐛 Bug Hunt</span>' +
            '<span class="lang-badge-dc">'+emoji+' '+ch.lang+'</span>' +
            '<span class="points-badge">⭐ '+ch.points+' XP</span>' +
            '</div>' +
            '<p style="font-weight:700;color:#555;margin:0.8rem 0 0.3rem;">Click the line with the bug:</p>' +
            '<div class="dc-code-box">'+linesHTML+'</div>' +
            '<div class="hint-row">💡 Hint: <span>'+ch.hint+'</span></div>' +
            '<div class="dc-explanation" id="dc-explanation" style="display:none;">' +
            '<strong>📝 Explanation:</strong> '+ch.explanation +
            '<div class="dc-fix">✅ Fix: '+ch.fix+'</div>' +
            '</div>';
    }

    // ===== RENDER GUESS CHALLENGE =====
    function loadGuessChallenge(ch) {
        var card = document.getElementById('challenge-card');
        var codeDisplay = ch.code.replace(/\n/g, '
');
        var optsHTML = ch.options.map(function(lang) {
            var e = LANG_EMOJIS[lang] || '💻';
            return '<button class="dc-opt-btn" onclick="checkDCGuess(\''+lang+'\', this)">'+e+' '+lang+'</button>';
        }).join('');

        card.innerHTML =
            '<div>' +
            '<span class="challenge-type-pill type-guess">🌐 Guess the Language</span>' +
            '<span class="points-badge">⭐ '+ch.points+' XP</span>' +
            '</div>' +
            '<p style="font-weight:700;color:#555;margin:0.8rem 0 0.3rem;">What language is this code written in?</p>' +
            '<div class="dc-code-box" style="font-family:\'Courier New\',monospace;color:#f8f8f2;white-space:pre;line-height:1.7;">'+codeDisplay+'</div>' +
            '<div class="hint-row">💡 Hint: <span>'+ch.hint+'</span></div>' +
            '<div class="dc-options">'+optsHTML+'</div>' +
            '<div class="dc-explanation" id="dc-explanation" style="display:none;">' +
            '<div class="dc-funfact">💡 '+ch.funFact+'</div>' +
            '</div>';
    }

    // ===== ANSWER CHECKERS =====
    function checkDCAnswer(lineNum) {
        if (dcAnswered) return;
        var ch = currentChallenge;
        var lineEl = document.getElementById('dc-line-' + lineNum);
        if (lineNum === ch.bug) {
            lineEl.classList.add('correct');
            dcAnswered = true;
            onAnswerCorrect();
        } else {
            lineEl.classList.add('wrong');
            setTimeout(function() { lineEl.classList.remove('wrong'); }, 800);
        }
    }

    function checkDCGuess(chosen, btn) {
        if (dcAnswered) return;
        var ch = currentChallenge;
        if (chosen === ch.answer) {
            dcAnswered = true;
            document.querySelectorAll('.dc-opt-btn').forEach(function(b) {
                b.disabled = true;
                var bLang = b.textContent.split(' ').slice(1).join(' ').trim();
                if (bLang === ch.answer) b.classList.add('correct');
            });
            onAnswerCorrect();
        } else {
            btn.classList.add('wrong');
            setTimeout(function() { btn.classList.remove('wrong'); }, 800);
        }
    }

    // ===== ON CORRECT ANSWER =====
    function onAnswerCorrect() {
        var resCard = document.getElementById('result-card');
        if (resCard) {
            resCard.style.display = 'block';
            resCard.className = 'dc-result success';
            resCard.textContent = 'Correct! ✅';
        }
        
        var explEl = document.getElementById('dc-explanation');
        if (explEl) explEl.style.display = 'block';
        
        var nextBtn = document.getElementById('next-question-btn');
        
        if(currentQuestionNum + 1 < TOTAL_QUESTIONS) {
            // More questions remaining
            if (nextBtn) {
                nextBtn.style.display = 'block';
                nextBtn.textContent = 'Next Question → (' + (currentQuestionNum+2) + '/' + TOTAL_QUESTIONS + ')';
                nextBtn.onclick = nextQuestion;
            }
        } else {
            // All questions done!
            setTimeout(function() {
                completeDailyChallenge();
            }, 1500);
        }
    }

    // ===== NEXT QUESTION BUTTON =====
    function nextQuestion() {
        currentQuestionNum++;
        loadQuestion(currentQuestionNum);
    }

    // ===== COMPLETE DAILY CHALLENGE =====
    function completeDailyChallenge() {
        // Save completion
        localStorage.setItem('bugblaster_last_daily', todayKey);
        // Update streak
        var yesterday = new Date(Date.now()-86400000).toDateString();
        var lastDaily = localStorage.getItem('bugblaster_last_daily_prev');
        var dailyStreak = parseInt(localStorage.getItem('bugblaster_daily_streak')||'0');
        dailyStreak = (lastDaily === yesterday) ? dailyStreak + 1 : (lastDaily === todayKey ? dailyStreak : 1);
        localStorage.setItem('bugblaster_daily_streak', dailyStreak);
        localStorage.setItem('bugblaster_last_daily_prev', todayKey);
        // Add XP
        var xp = parseInt(localStorage.getItem('bugblaster_xp')||'0');
        xp += 50 * TOTAL_QUESTIONS;
        localStorage.setItem('bugblaster_xp', xp);
        // Show completion screen
        showCompletedCard();
    }

    // ===== SHOW COMPLETED CARD =====
    function showCompletedCard() {
        document.getElementById('intro-card').style.display = 'none';
        document.getElementById('challenge-area').style.display = 'none';
        document.getElementById('completed-card').style.display = 'block';
        
        var streak = localStorage.getItem('bugblaster_daily_streak') || '1';
        
        // Update any streak UI element on the completed card if needed
        // Assuming we update the streak display somewhere
        if (document.getElementById('completed-msg')) {
             document.getElementById('completed-msg').textContent = "✅ You crushed today's challenge!";
        }
        
        // We will also update the global streak UI
        var dailyStreakBadge = document.getElementById('daily-streak-badge');
        if (dailyStreakBadge) {
            dailyStreakBadge.textContent = '🔥 Daily Streak: ' + streak + ' day' + (streak !== '1' ? 's' : '');
        }
    }
    
    // Share result function (keeping this as it's outside the core loop but needed)
    function shareDailyResult() {
        var msg = 'I completed today\'s BugBlaster Daily Challenge! 🐛 Can you solve it? #BugBlaster';
        if (navigator.share) {
            navigator.share({ title: 'BugBlaster Daily', text: msg, url: window.location.href })
                .catch(function() { dcFallbackCopy(msg); });
        } else {
            dcFallbackCopy(msg);
        }
    }

    function dcFallbackCopy(text) {
        navigator.clipboard.writeText(text).then(function() {
            var btn = document.querySelector('.share-daily-btn');
            if (btn) {
                var o = btn.textContent;
                btn.textContent = 'Copied! ✅';
                btn.style.background = '#58CC02'; btn.style.color = 'white';
                setTimeout(function() { btn.textContent = o; btn.style.background = 'white'; btn.style.color = '#58CC02'; }, 2000);
            }
        });
    }

    