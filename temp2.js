
        var TODAYS_QUESTIONS = [
            {
                type: 'bug',
                lang: 'Python',
                code: ['def add(a, b):', '    return a - b', 'print(add(3, 4))'],
                bug: 2,
                explanation: 'Should be + not - to add numbers.'
            },
            {
                type: 'guess',
                code: 'console.log("Hello World")',
                answer: 'JavaScript',
                options: ['Python', 'JavaScript', 'Java', 'C++'],
                funFact: 'JavaScript runs in every web browser!'
            },
            {
                type: 'bug',
                lang: 'Java',
                code: ['int x = 5;', 'if(x = 5){', '    System.out.println("yes");', '}'],
                bug: 2,
                explanation: 'Use == for comparison, not = which is assignment.'
            }
        ];

        var currentQ = 0;
        var todayKey = new Date().toDateString();
        var timerInterval;
        var timeLeft = 60;
        var answered = false;

        window.onload = function() {
            document.getElementById('today-date-text').textContent = todayKey;
            var streak = localStorage.getItem('bugblaster_daily_streak') || '0';
            document.getElementById('intro-streak').textContent = '🔥 Daily Streak: ' + streak;
            
            if(localStorage.getItem('bugblaster_last_daily') === todayKey) {
                showState('completed');
            } else {
                showState('intro');
            }
        };

        function showState(state) {
            document.getElementById('intro-card').style.display = state === 'intro' ? 'block' : 'none';
            document.getElementById('challenge-card').style.display = state === 'challenge' ? 'block' : 'none';
            document.getElementById('completed-card').style.display = state === 'completed' ? 'block' : 'none';
        }

        function startDaily() {
            currentQ = 0;
            showState('challenge');
            loadQuestion();
        }
        
        function startTimer() {
            clearInterval(timerInterval);
            timeLeft = 60;
            var tDisplay = document.getElementById('timer-display');
            tDisplay.textContent = '⏱ ' + timeLeft + 's';
            tDisplay.style.color = '#58CC02';
            
            timerInterval = setInterval(function() {
                if(answered) {
                    clearInterval(timerInterval);
                    return;
                }
                timeLeft--;
                tDisplay.textContent = '⏱ ' + timeLeft + 's';
                if(timeLeft <= 20) tDisplay.style.color = '#FFD700';
                if(timeLeft <= 10) tDisplay.style.color = '#ff4444';
                
                if(timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showFeedback(false, "Time's up!");
                    disableAllInputs();
                }
            }, 1000);
        }

        function loadQuestion() {
            var q = TODAYS_QUESTIONS[currentQ];
            answered = false;
            
            var dots = Array(3).fill('○');
            for(var i=0; i<currentQ; i++) dots[i] = '●';
            document.getElementById('progress').innerHTML = 'Question ' + (currentQ+1) + ' of 3 &nbsp;<span style="color:#58CC02;">' + dots.join('') + '</span>';
            
            document.getElementById('feedback').style.display = 'none';
            document.getElementById('next-btn').style.display = 'none';

            var html = '';
            if(q.type === 'bug') {
                html += '<p style="font-weight:900;color:#555;margin-bottom:10px;">Click the buggy line:</p>';
                html += '<div style="background:#1e1e1e;border-radius:10px;padding:15px;text-align:left;">';
                for(var i=0; i<q.code.length; i++) {
                    html += '<div onclick="checkBug('+(i+1)+')" style="padding:8px;cursor:pointer;color:#d4d4d4;font-family:monospace;font-size:15px;border-radius:5px;display:flex;align-items:center;transition:background 0.2s;" id="bline'+(i+1)+'" class="code-line">';
                    html += '<span style="color:#858585;margin-right:15px;min-width:15px;">'+(i+1)+'</span>';
                    html += q.code[i].replace(/</g,'&lt;').replace(/>/g,'&gt;');
                    html += '</div>';
                }
                html += '</div>';
            } else {
                html += '<p style="font-weight:900;color:#555;margin-bottom:10px;">What language is this?</p>';
                html += '<div style="background:#1e1e1e;border-radius:10px;padding:15px;margin-bottom:15px;text-align:left;">';
                html += '<code style="color:#58CC02;font-family:monospace;font-size:15px;white-space:pre;">'+q.code+'</code>';
                html += '</div>';
                html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
                for(var j=0; j<q.options.length; j++) {
                    html += '<button onclick="checkGuess(\\\''+q.options[j]+'\\')" style="padding:15px;background:white;border:2px solid #58CC02;border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;color:#58CC02;box-shadow:none;margin-top:0;" class="guess-btn">'+q.options[j]+'</button>';
                }
                html += '</div>';
            }
            document.getElementById('question-content').innerHTML = html;
            startTimer();
        }

        function checkBug(line) {
            if(answered) return;
            var q = TODAYS_QUESTIONS[currentQ];
            if(line === q.bug) {
                document.getElementById('bline'+line).style.background = '#1a4a1a';
                showFeedback(true, q.explanation);
                disableAllInputs();
            } else {
                document.getElementById('bline'+line).style.background = '#4a1a1a';
                showFeedback(false, 'Wrong line! Try again.');
                setTimeout(function() {
                    if(document.getElementById('bline'+line)) {
                        document.getElementById('bline'+line).style.background = '';
                    }
                }, 800);
            }
        }

        function checkGuess(lang) {
            if(answered) return;
            var q = TODAYS_QUESTIONS[currentQ];
            var btn;
            var btns = document.querySelectorAll('.guess-btn');
            btns.forEach(function(b) { 
                if(b.textContent === lang) btn = b;
            });
            
            if(lang === q.answer) {
                showFeedback(true, q.funFact || 'Correct!');
                disableAllInputs();
                btn.style.background = '#58CC02';
                btn.style.color = 'white';
            } else {
                showFeedback(false, 'Wrong! It was ' + q.answer);
                btn.style.background = '#ff4444';
                btn.style.borderColor = '#cc0000';
                btn.style.color = 'white';
                setTimeout(function() {
                    if(btn) {
                        btn.style.background = 'white';
                        btn.style.borderColor = '#58CC02';
                        btn.style.color = '#58CC02';
                    }
                }, 800);
            }
        }

        function disableAllInputs() {
            answered = true;
            clearInterval(timerInterval);
            var guessBtns = document.querySelectorAll('.guess-btn');
            guessBtns.forEach(function(b) { b.disabled = true; });
        }

        function showFeedback(correct, msg) {
            var fb = document.getElementById('feedback');
            fb.style.display = 'block';
            fb.style.background = correct ? '#e8f5e9' : '#fdecea';
            fb.style.color = correct ? '#46A302' : '#ff4444';
            fb.style.border = correct ? '2px solid #58CC02' : '2px solid #ff4444';
            fb.innerHTML = (correct ? '✅ ' : '❌ ') + msg;
            
            if(correct || timeLeft <= 0) {
                answered = true;
                document.getElementById('next-btn').style.display = 'block';
                document.getElementById('next-btn').textContent = currentQ < 2 ? 'Next Question →' : 'Finish! 🎉';
            }
        }

        function nextQuestion() {
            if(currentQ < 2) {
                currentQ++;
                loadQuestion();
            } else {
                finishDaily();
            }
        }

        function finishDaily() {
            localStorage.setItem('bugblaster_last_daily', todayKey);
            var xp = parseInt(localStorage.getItem('bugblaster_xp')||'0') + 50;
            localStorage.setItem('bugblaster_xp', xp);
            var streak = parseInt(localStorage.getItem('bugblaster_daily_streak')||'0') + 1;
            localStorage.setItem('bugblaster_daily_streak', streak);
            showState('completed');
            
            // Trigger gamification update implicitly by reloading or letting user navigate away,
            // Since there's no global updateGamificationUI in gamification.js
            // The user requested to be totally self-contained, but the navbar won't live update without a refresh
            // We can just manually patch the DOM elements to look updated.
            var navXp = document.getElementById('nav-xp');
            if(navXp) navXp.textContent = xp + ' XP';
            var navStreak = document.getElementById('nav-streak');
            if(navStreak) navStreak.textContent = streak + ' days';
        }

        function shareResult() {
            var msg = 'I just completed today\\'s BugBlaster Daily Challenge! 🐛 Can you solve it too?';
            navigator.clipboard.writeText(msg).then(function() {
                var shareBtn = document.querySelector('#completed-card button');
                if(shareBtn) {
                    var original = shareBtn.textContent;
                    shareBtn.textContent = 'Copied! ✅';
                    setTimeout(function() { shareBtn.textContent = original; }, 2000);
                }
            }).catch(function() {
                alert('Copied to clipboard!');
            });
        }
    