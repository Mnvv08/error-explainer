document.addEventListener('DOMContentLoaded', () => {
    const blastBtn = document.getElementById('blast-btn');
    const codeInput = document.getElementById('code-input');
    const languageSelect = document.getElementById('language-select');
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsCard = document.getElementById('results-card');
    const resError = document.getElementById('res-error');
    const resWhy = document.getElementById('res-why');
    const resFix = document.getElementById('res-fix');
    const resQuestions = document.getElementById('res-questions');
    const copyBtn = document.getElementById('copy-btn');

    function clearResults() {
        resultsCard.classList.add('hidden');
        resError.innerText = "";
        resWhy.innerText = "";
        resFix.innerText = "";
        resQuestions.innerHTML = "";
    }

    if (codeInput) {
        codeInput.addEventListener('input', () => {
            if (!codeInput.value.trim()) {
                clearResults();
            }
        });
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', clearResults);
    }

    if (blastBtn) {
        blastBtn.addEventListener('click', async () => {
            const code = codeInput.value.trim();
            const language = languageSelect.value;
            
            if (!code) {
                alert("Please paste your broken code first!");
                return;
            }

            // Clear old results and show loading
            clearResults();
            loadingSpinner.classList.remove('hidden');

            try {
                // Call Claude API (Simulated or Real if API key is provided)
                const response = await analyzeCodeWithClaude(code, language);
                
                // Parse response (Assuming JSON format from Claude)
                let data;
                try {
                    data = JSON.parse(response);
                } catch (e) {
                    console.error("Failed to parse JSON response:", response);
                    throw new Error("Invalid response format from AI.");
                }

                // Update UI
                resError.innerText = data.error || "No error explanation provided.";
                resWhy.innerText = data.why || "No explanation provided.";
                resFix.innerText = data.fix || "No fix provided.";
                
                resQuestions.innerHTML = "";
                if (data.questions && data.questions.length > 0) {
                    data.questions.forEach(q => {
                        const li = document.createElement('li');
                        li.innerText = q;
                        resQuestions.appendChild(li);
                    });
                }

                // Show results
                loadingSpinner.classList.add('hidden');
                resultsCard.classList.remove('hidden');

                // Award XP via Gamification System
                if (window.gamification) {
                    window.gamification.awardXP(10);
                }
            } catch (error) {
                console.error(error);
                alert("Oops! Something went wrong while analyzing the code. Check the console for details.");
                loadingSpinner.classList.add('hidden');
            }
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(resFix.innerText);
            copyBtn.innerText = "Copied!";
            setTimeout(() => { copyBtn.innerText = "Copy Code"; }, 2000);
        });
    }

    async function analyzeCodeWithClaude(code, language) {
        // IMPORTANT: Replace this with your actual Claude API key
        // Note: Exposing API keys in client-side code is not recommended for production.
        const API_KEY = "YOUR_CLAUDE_API_KEY_HERE"; 

        if (API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
            // Mock response if no API key is provided
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(JSON.stringify({
                        "error": "SyntaxError: Missing parentheses in call to 'print'.",
                        "why": "In Python 3, print is a function and requires parentheses around its arguments.",
                        "fix": "print('Hello, World!')",
                        "questions": [
                            "How do you print a string in Python 3?",
                            "What is the difference between print in Python 2 and Python 3?",
                            "Can you print multiple arguments separated by commas?"
                        ]
                    }));
                }, 2000);
            });
        }

        const systemPrompt = "You are BugBlaster, a friendly coding teacher for beginners. When given broken code, respond ONLY in this JSON format: { 'error': 'one line explanation', 'why': 'beginner friendly reason', 'fix': 'corrected code', 'questions': ['q1','q2','q3'] }. Use simple language, no jargon.";
        const userPrompt = `Language: ${language}\nCode:\n${code}`;

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
                system: systemPrompt,
                messages: [
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return result.content[0].text;
    }
});
