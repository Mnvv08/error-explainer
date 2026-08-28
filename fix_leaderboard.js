const fs = require('fs');
let content = fs.readFileSync('/Users/manavparihar/error-explainer/leaderboard.js', 'utf8');

content = content.replace(
    /const activityData = JSON\.parse\(localStorage\.getItem\('bugblaster_activity'\)\) \|\| \[\];/,
    `let activityData = [];
    try {
        let rawAct = localStorage.getItem('bugblaster_activity') || '[]';
        activityData = JSON.parse(rawAct);
        if (!Array.isArray(activityData)) activityData = [];
    } catch(e) {
        console.error(e);
    }`
);

fs.writeFileSync('/Users/manavparihar/error-explainer/leaderboard.js', content);
console.log("Fixed leaderboard.js");
