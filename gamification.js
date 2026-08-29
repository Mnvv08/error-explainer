try {
  var xp = parseInt(localStorage.getItem('bugblaster_xp') || '0');
  var streak = parseInt(localStorage.getItem('bugblaster_streak') || '0');
  var level = 1;
  var levelName = 'Buggy Beginner';

  function getLevel(xp) {
    if(xp >= 500) return {level:5, name:'Code Legend'};
    if(xp >= 300) return {level:4, name:'Bug Master'};
    if(xp >= 150) return {level:3, name:'Debug Ninja'};
    if(xp >= 50) return {level:2, name:'Code Detective'};
    return {level:1, name:'Buggy Beginner'};
  }

  function updateNavbar() {
    var xpEl = document.getElementById('nav-xp');
    var streakEl = document.getElementById('nav-streak');
    var badgeEl = document.getElementById('nav-level-badge');
    var info = getLevel(xp);
    if(xpEl) xpEl.textContent = xp;
    if(streakEl) streakEl.textContent = streak;
    if(badgeEl) badgeEl.textContent = 'Lvl ' + info.level;
  }

  function checkStreak() {
    var today = new Date().toDateString();
    var last = localStorage.getItem('bugblaster_last_visit');
    var yesterday = new Date(Date.now() - 86400000).toDateString();
    if(last === yesterday) {
      streak++;
      localStorage.setItem('bugblaster_streak', streak);
    } else if(last !== today) {
      if(last !== yesterday) { streak = 1; localStorage.setItem('bugblaster_streak', streak); }
    }
    localStorage.setItem('bugblaster_last_visit', today);
  }

  checkStreak();
  updateNavbar();

  var btn = document.getElementById('scroll-to-top');
  if(btn) {
    document.body.appendChild(btn);
    window.addEventListener('scroll', function() {
      if(btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

} catch(e) {
  console.error('BugBlaster gamification error:', e);
}
