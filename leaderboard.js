document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Dashboard Stats
    if (!window.gamification) return;

    const g = window.gamification;
    
    document.getElementById('dash-big-badge').innerText = g.level.name;
    document.getElementById('dash-total-xp').innerText = `${g.xp} XP`;
    document.getElementById('dash-streak').innerText = g.streak;
    
    const bugsBlasted = parseInt(localStorage.getItem('bugblaster_bugs_count')) || 0;
    const gamesPlayed = parseInt(localStorage.getItem('bugblaster_games_played')) || 0;
    const gameCorrect = parseInt(localStorage.getItem('bugblaster_correct')) || 0;
    
    document.getElementById('dash-bugs').innerText = bugsBlasted;
    document.getElementById('dash-games').innerText = gamesPlayed;
    document.getElementById('dash-correct').innerText = gameCorrect;

    // 2. Activity Chart (Last 7 Days)
    const activityDaysEl = document.getElementById('activity-days');
    const activityData = JSON.parse(localStorage.getItem('bugblaster_activity')) || [];
    
    activityDaysEl.innerHTML = '';
    
    // Generate the last 7 dates
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toDateString();
        
        const dayBox = document.createElement('div');
        dayBox.className = 'activity-box';
        
        if (activityData.includes(dateString)) {
            dayBox.classList.add('active');
        }
        
        // Add a tooltip so users know which day it is
        dayBox.title = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        activityDaysEl.appendChild(dayBox);
    }

    // 3. Achievements
    if (bugsBlasted >= 1) {
        const badge = document.getElementById('badge-first-bug');
        badge.classList.remove('locked');
        badge.querySelector('.lock-overlay').remove();
        badge.title = "Blast your first bug";
    }
    if (g.streak >= 3) {
        const badge = document.getElementById('badge-on-fire');
        badge.classList.remove('locked');
        badge.querySelector('.lock-overlay').remove();
        badge.title = "3 day streak";
    }
    if (gamesPlayed >= 5) {
        const badge = document.getElementById('badge-game-on');
        badge.classList.remove('locked');
        badge.querySelector('.lock-overlay').remove();
        badge.title = "Play 5 Bug Hunter games";
    }

    // 4. Leaderboard Logic
    const fakePlayers = [
        { name: "CodeNinja99", level: "Level 4 Bug Master", xp: 480, bugs: 48 },
        { name: "PyQueen", level: "Level 3 Debug Ninja", xp: 320, bugs: 32 },
        { name: "JavaJoe", level: "Level 3 Debug Ninja", xp: 280, bugs: 28 },
        { name: "BugHunterX", level: "Level 2 Code Detective", xp: 140, bugs: 14 }
    ];

    const currentUser = {
        name: "You",
        level: `Level ${g.level.levelNum} ${g.level.name.split(' ').slice(1).join(' ')}`,
        xp: g.xp,
        bugs: bugsBlasted,
        isCurrentUser: true
    };

    const allPlayers = [...fakePlayers, currentUser];
    
    // Sort descending by XP
    allPlayers.sort((a, b) => b.xp - a.xp);

    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    allPlayers.slice(0, 5).forEach((player, index) => {
        const tr = document.createElement('tr');
        if (player.isCurrentUser) {
            tr.classList.add('current-user-row');
        }

        let rankDisplay = index + 1;
        if (index === 0) rankDisplay = '🥇';
        if (index === 1) rankDisplay = '🥈';
        if (index === 2) rankDisplay = '🥉';

        tr.innerHTML = `
            <td>${rankDisplay}</td>
            <td><strong>${player.name}</strong></td>
            <td>${player.level}</td>
            <td>${player.xp}</td>
            <td>${player.bugs}</td>
        `;
        tbody.appendChild(tr);
    });
});
