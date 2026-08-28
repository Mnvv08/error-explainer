const fs = require('fs');
let content = fs.readFileSync('/Users/manavparihar/error-explainer/gamification.js', 'utf8');

// Wrap JSON.parse in try catch
content = content.replace(
    /let activity = JSON\.parse\(localStorage\.getItem\('bugblaster_activity'\)\) \|\| \[\];/,
    `let activity = [];
        try {
            let activityRaw = localStorage.getItem('bugblaster_activity') || '[]';
            activity = JSON.parse(activityRaw);
            if (!Array.isArray(activity)) activity = [];
        } catch(e) {
            console.error('BugBlaster Gamification Error:', e);
            activity = [];
        }`
);

// Fallbacks for localStorage
content = content.replace(
    /this\.xp = parseInt\(localStorage\.getItem\('bugblaster_xp'\)\) \|\| 0;/,
    "this.xp = parseInt(localStorage.getItem('bugblaster_xp') || '0') || 0;"
);

content = content.replace(
    /this\.streak = parseInt\(localStorage\.getItem\('bugblaster_streak'\)\) \|\| 0;/,
    "this.streak = parseInt(localStorage.getItem('bugblaster_streak') || '0') || 0;"
);

// Wrap the entire constructor logic if needed, but it's safe.
// Wrap the whole class and initialization in try catch just to be extremely safe, as requested by user.

const scriptContent = `try {
${content}
} catch (e) {
    console.error('BugBlaster Error (gamification.js):', e);
}
`;

fs.writeFileSync('/Users/manavparihar/error-explainer/gamification.js', scriptContent);
console.log("Fixed gamification.js");
