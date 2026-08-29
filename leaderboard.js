// ============================================================
// BugBlaster Leaderboard Logic
// ============================================================

const VIRTUAL_PLAYERS = [
    { name: 'CodeNinja99',   avatar: '🥷', xp: 4850, bugScore: 142, streak: 45, level: 'Code Legend',    country: '🇯🇵' },
    { name: 'PyQueen',       avatar: '👑', xp: 3920, bugScore: 118, streak: 38, level: 'Code Legend',    country: '🇺🇸' },
    { name: 'DebugDragon',   avatar: '🐉', xp: 3100, bugScore: 95,  streak: 29, level: 'Bug Master',     country: '🇮🇳' },
    { name: 'JavaJedi',      avatar: '⚔️', xp: 2750, bugScore: 87,  streak: 24, level: 'Bug Master',     country: '🇬🇧' },
    { name: 'ByteWizard',    avatar: '🧙', xp: 2200, bugScore: 71,  streak: 19, level: 'Debug Ninja',    country: '🇩🇪' },
    { name: 'LoopBreaker',   avatar: '💥', xp: 1850, bugScore: 58,  streak: 15, level: 'Debug Ninja',    country: '🇧🇷' },
    { name: 'NullPointer',   avatar: '🎯', xp: 1400, bugScore: 43,  streak: 11, level: 'Code Detective', country: '🇰🇷' },
    { name: 'StackOverflow', avatar: '📚', xp: 980,  bugScore: 31,  streak: 7,  level: 'Code Detective', country: '🇨🇦' },
    { name: 'BugHunterX',   avatar: '🔍', xp: 650,  bugScore: 19,  streak: 4,  level: 'Buggy Beginner', country: '🇦🇺' },
    { name: 'HelloWorld',    avatar: '🌍', xp: 320,  bugScore: 9,   streak: 2,  level: 'Buggy Beginner', country: '🇫🇷' },
];

const TICKER_MESSAGES = [
    '🎮 CodeNinja99 just blasted a bug!',
    '🔥 PyQueen is on a 38 day streak!',
    '⚡ DebugDragon earned 20 XP!',
    '🏆 JavaJedi reached Bug Master!',
    '🐛 ByteWizard blasted 3 bugs in a row!',
    '🎯 LoopBreaker hit a new high score!',
    '🌟 NullPointer is climbing the ranks!',
    '💥 StackOverflow just logged in!',
    '🚀 BugHunterX earned their first XP!',
    '🌍 HelloWorld started their streak!',
];

var currentTab = 'xp';

// ─── Level badge class helper ────────────────────────────────
function levelClass(level) {
    if (level.includes('Legend'))   return 'legend';
    if (level.includes('Master'))   return 'master';
    if (level.includes('Ninja'))    return 'ninja';
    if (level.includes('Detective')) return 'detective';
    return '';
}

// ─── Rank medal ──────────────────────────────────────────────
function rankDisplay(i) {
    if (i === 0) return '<span title="1st Place">🥇</span>';
    if (i === 1) return '<span title="2nd Place">🥈</span>';
    if (i === 2) return '<span title="3rd Place">🥉</span>';
    return '<span class="rank-num">' + (i + 1) + '</span>';
}

// ─── Row class ───────────────────────────────────────────────
function rowClass(i, isYou) {
    if (isYou) return 'row-you';
    if (i === 0) return 'row-gold';
    if (i === 1) return 'row-silver';
    if (i === 2) return 'row-bronze';
    return '';
}

// ─── Get user data ───────────────────────────────────────────
function getUser() {
    return {
        name: 'You 👤',
        avatar: '😊',
        xp: parseInt(localStorage.getItem('bugblaster_xp') || '0'),
        bugScore: parseInt(localStorage.getItem('bugblaster_highscore') || '0'),
        streak: parseInt(localStorage.getItem('bugblaster_streak') || '0'),
        level: getUserLevel(parseInt(localStorage.getItem('bugblaster_xp') || '0')),
        country: '🏠'
    };
}

function getUserLevel(xp) {
    if (xp >= 500) return 'Code Legend';
    if (xp >= 300) return 'Bug Master';
    if (xp >= 150) return 'Debug Ninja';
    if (xp >= 50)  return 'Code Detective';
    return 'Buggy Beginner';
}

// ─── Build full list with user injected ──────────────────────
function buildList(tab) {
    var user = getUser();
    var key = tab === 'xp' ? 'xp' : tab === 'bug' ? 'bugScore' : 'streak';

    // clone and add user
    var list = VIRTUAL_PLAYERS.map(function(p) {
        return Object.assign({}, p, { isYou: false });
    });
    list.push(Object.assign({}, user, { isYou: true }));

    // sort descending
    list.sort(function(a, b) { return b[key] - a[key]; });
    return list;
}

// ─── Render Leaderboard ──────────────────────────────────────
function renderLeaderboard(tab) {
    var key = tab === 'xp' ? 'xp' : tab === 'bug' ? 'bugScore' : 'streak';
    var header = tab === 'xp' ? '⚡ XP' : tab === 'bug' ? '🎮 Bug Score' : '🔥 Streak';
    document.getElementById('score-header').textContent = header;

    var list = buildList(tab);
    var tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    list.forEach(function(player, i) {
        var row = document.createElement('tr');
        var cls = rowClass(i, player.isYou);
        if (cls) row.classList.add(cls);
        row.style.animationDelay = (i * 60) + 'ms';

        var youTag = player.isYou ? '<span class="you-tag">👤 You</span>' : '';
        var score = player[key];
        var scoreLabel = tab === 'streak' ? score + ' days' : score.toLocaleString();

        row.innerHTML =
            '<td class="rank-cell">' + rankDisplay(i) + '</td>' +
            '<td>' + player.avatar + ' <strong>' + player.name + '</strong> ' + player.country + youTag + '</td>' +
            '<td><span class="level-badge-small ' + levelClass(player.level) + '">' + player.level + '</span></td>' +
            '<td class="score-cell">' + scoreLabel + '</td>';

        tbody.appendChild(row);

        // Update Your Rank card when user row is found
        if (player.isYou) {
            updateYourRank(i + 1, list, i, key);
        }
    });
}

// ─── Update Your Rank Card ────────────────────────────────────
function updateYourRank(rank, list, userIndex, key) {
    document.getElementById('your-rank-num').textContent = '#' + rank;
    document.getElementById('your-rank-title').textContent = 'Your Current Rank — #' + rank + ' of ' + list.length;

    var userScore = list[userIndex][key];
    var msg, progress;

    if (userIndex === 0) {
        msg = "🏆 You're the champion! Keep it up!";
        progress = 100;
    } else {
        var above = list[userIndex - 1];
        var diff = above[key] - userScore;
        var label = key === 'streak' ? ' days' : ' XP';
        msg = 'You need ' + diff + label + ' more to overtake ' + above.name + '!';
        var below = list[userIndex + 1];
        if (below) {
            var range = above[key] - below[key];
            var current = userScore - below[key];
            progress = range > 0 ? Math.round((current / range) * 100) : 50;
        } else {
            progress = 10;
        }
    }

    document.getElementById('your-rank-msg').textContent = msg;
    setTimeout(function() {
        document.getElementById('your-rank-bar').style.width = Math.max(5, progress) + '%';
    }, 200);
}

// ─── Switch Tab ──────────────────────────────────────────────
function switchTab(tab, btn) {
    currentTab = tab;
    document.querySelectorAll('.lb-tab').forEach(function(t) {
        t.classList.remove('active');
    });
    btn.classList.add('active');
    renderLeaderboard(tab);
}

// ─── Ticker ──────────────────────────────────────────────────
function buildTicker() {
    var inner = document.getElementById('ticker-inner');
    if (!inner) return;
    // Duplicate for seamless loop
    var msgs = TICKER_MESSAGES.concat(TICKER_MESSAGES);
    inner.innerHTML = msgs.map(function(m) {
        return '<span class="ticker-dot">· </span>' + m;
    }).join('  ');
}

// ─── Dashboard ───────────────────────────────────────────────
function renderDashboard() {
    var xp       = parseInt(localStorage.getItem('bugblaster_xp') || '0');
    var streak   = parseInt(localStorage.getItem('bugblaster_streak') || '0');
    var bugs     = parseInt(localStorage.getItem('bugblaster_bugs_count') || '0');
    var highScore = parseInt(localStorage.getItem('bugblaster_highscore') || '0');

    var levelInfo = getUserLevel(xp);

    var badgeEl = document.getElementById('dash-big-badge');
    var xpEl    = document.getElementById('dash-total-xp');
    var sEl     = document.getElementById('dash-streak');
    var bEl     = document.getElementById('dash-bugs');
    var gEl     = document.getElementById('dash-games');
    var cEl     = document.getElementById('dash-correct');

    if (badgeEl) badgeEl.textContent = levelEmoji(levelInfo) + ' ' + levelInfo;
    if (xpEl)   xpEl.textContent   = xp.toLocaleString() + ' XP';
    if (sEl)    sEl.textContent    = streak;
    if (bEl)    bEl.textContent    = bugs;
    if (gEl)    gEl.textContent    = highScore;
    if (cEl)    cEl.textContent    = highScore;

    renderActivityChart();
    renderAchievements(xp, streak, bugs);
}

function levelEmoji(level) {
    if (level.includes('Legend'))    return '🚀';
    if (level.includes('Master'))    return '🏆';
    if (level.includes('Ninja'))     return '⚡';
    if (level.includes('Detective')) return '🔍';
    return '🐛';
}

// ─── Activity Chart ──────────────────────────────────────────
function renderActivityChart() {
    var container = document.getElementById('activity-days');
    if (!container) return;
    var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var today = new Date().getDay();
    // 0=Sun,1=Mon ... map so Mon=0
    var todayIdx = (today + 6) % 7;

    var activityRaw = '[]';
    try { activityRaw = localStorage.getItem('bugblaster_activity') || '[]'; } catch(e) {}
    var activity = [];
    try { activity = JSON.parse(activityRaw); } catch(e) {}

    container.innerHTML = '';
    days.forEach(function(d, i) {
        var dot = document.createElement('div');
        dot.className = 'day-dot' + (i <= todayIdx ? ' active' : '');
        dot.innerHTML = '<span style="font-size:0.7rem;">' + d + '</span>';
        container.appendChild(dot);
    });
}

// ─── Achievements ────────────────────────────────────────────
function renderAchievements(xp, streak, bugs) {
    var row = document.getElementById('badges-row');
    if (!row) return;

    var ACHIEVEMENTS = [
        { icon: '🐛', name: 'First Bug',     unlocked: bugs >= 1,   hint: 'Blast your first bug' },
        { icon: '🔥', name: 'On Fire',        unlocked: streak >= 3, hint: '3 day streak' },
        { icon: '🎮', name: 'Game On',        unlocked: xp >= 20,    hint: 'Earn 20 XP' },
        { icon: '⚡', name: 'XP Grinder',    unlocked: xp >= 100,   hint: 'Earn 100 XP' },
        { icon: '🏆', name: 'Bug Master',    unlocked: xp >= 300,   hint: 'Reach 300 XP' },
        { icon: '🚀', name: 'Code Legend',   unlocked: xp >= 500,   hint: 'Reach 500 XP' },
    ];

    row.innerHTML = '';
    ACHIEVEMENTS.forEach(function(a) {
        var badge = document.createElement('div');
        badge.className = 'achievement-badge' + (a.unlocked ? '' : ' locked');
        badge.title = a.unlocked ? a.name + ' — Unlocked!' : 'Keep going to unlock: ' + a.hint;
        badge.innerHTML =
            '<div class="badge-icon">' + a.icon + '</div>' +
            '<div class="badge-name">' + a.name + '</div>' +
            (a.unlocked ? '' : '<div class="lock-overlay">🔒</div>');
        row.appendChild(badge);
    });
}

// ─── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    renderDashboard();
    renderLeaderboard('xp');
    buildTicker();
});
