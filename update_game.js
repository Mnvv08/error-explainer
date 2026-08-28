const fs = require('fs');

const file = '/Users/manavparihar/error-explainer/game.js';
let content = fs.readFileSync(file, 'utf8');

const challengesFile = '/Users/manavparihar/.gemini/antigravity-ide/brain/c42e67d0-c7ac-497c-aab5-1b33b2187664/scratch/challenges.js';
const challengesContent = fs.readFileSync(challengesFile, 'utf8');

// Replace everything from `async function fetchChallengeFromClaude` to the end of the file
const functionStartIdx = content.indexOf('async function fetchChallengeFromClaude');
if (functionStartIdx !== -1) {
    content = content.substring(0, functionStartIdx);
}

const newLogic = `
    ${challengesContent}

    async function fetchChallenge() {
        let usedIds = JSON.parse(localStorage.getItem('bugblaster_used_ids')) || [];
        
        const unusedBank = CHALLENGE_BANK.filter(c => !usedIds.includes(c.id));
        
        if (unusedBank.length > 0) {
            const challenge = unusedBank[Math.floor(Math.random() * unusedBank.length)];
            usedIds.push(challenge.id);
            localStorage.setItem('bugblaster_used_ids', JSON.stringify(usedIds));
            // Simulate network delay
            return new Promise(resolve => setTimeout(() => resolve(challenge), 500));
        }

        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
        const randomTwist = twists[Math.floor(Math.random() * twists.length)];

        const API_KEY = "YOUR_CLAUDE_API_KEY_HERE";
        if (API_KEY === "YOUR_CLAUDE_API_KEY_HERE") {
            const challenge = CHALLENGE_BANK[Math.floor(Math.random() * CHALLENGE_BANK.length)];
            return new Promise((resolve) => setTimeout(() => resolve(challenge), 1000));
        }

        const prompt = \`Timestamp: \${Date.now()}. Random seed: \${Math.random()}. Generate a UNIQUE buggy code challenge. Topic: \${randomTopic}. Language: \${randomLanguage}. Bug type: \${randomTwist}. This must be completely different from any standard textbook example. Return ONLY JSON: { 'language': '\${randomLanguage}', 'buggy_code': '...', 'hint': 'one word hint', 'correct_line': 3, 'explanation': 'simple explanation', 'fixed_code': '...' }\`;

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
        const jsonMatch = content.match(/\`\`\`json\\n([\\s\\S]*?)\\n\`\`\`/);
        if (jsonMatch) {
            challenge = JSON.parse(jsonMatch[1]);
        } else {
            challenge = JSON.parse(content);
        }

        return challenge;
    }
});
`;

content += newLogic;

// Also update startNewChallenge to use fetchChallenge
content = content.replace(/currentChallenge = await fetchChallengeFromClaude\(.*?\);/g, 'currentChallenge = await fetchChallenge();');
content = content.replace(/currentChallenge = getFallbackChallenge\(.*?\);/g, 'currentChallenge = CHALLENGE_BANK[0];');

fs.writeFileSync(file, content);
console.log("Updated game.js");
