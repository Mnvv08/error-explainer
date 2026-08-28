try {
// Gamification System

const LEVELS = [
    { threshold: 0, name: "🐛 Buggy Beginner", max: 49 },
    { threshold: 50, name: "🔍 Code Detective", max: 149 },
    { threshold: 150, name: "⚡ Debug Ninja", max: 299 },
    { threshold: 300, name: "🏆 Bug Master", max: 499 },
    { threshold: 500, name: "🚀 Code Legend", max: Infinity }
];

class Gamification {
    constructor() {
        this.xp = parseInt(localStorage.getItem('bugblaster_xp') || '0') || 0;
        this.streak = parseInt(localStorage.getItem('bugblaster_streak') || '0') || 0;
        this.lastVisit = localStorage.getItem('bugblaster_last_visit');
        this.level = this.calculateLevel(this.xp);
        
        this.updateStreak();
        
        document.addEventListener('DOMContentLoaded', () => {
            this.initUI();
            this.updateUI();
            this.initScrollToTop();
        });
    }

    calculateLevel(xp) {
        let currentLevel = LEVELS[0];
        let levelIndex = 1;
        for (let i = 0; i < LEVELS.length; i++) {
            if (xp >= LEVELS[i].threshold) {
                currentLevel = LEVELS[i];
                levelIndex = i + 1;
            }
        }
        return { ...currentLevel, levelNum: levelIndex };
    }

    updateStreak() {
        const today = new Date().toDateString();
        let activity = [];
        try {
            let activityRaw = localStorage.getItem('bugblaster_activity') || '[]';
            activity = JSON.parse(activityRaw);
            if (!Array.isArray(activity)) activity = [];
        } catch(e) {
            console.error('BugBlaster Gamification Error:', e);
            activity = [];
        }
        
        if (!activity.includes(today)) {
            activity.push(today);
            localStorage.setItem('bugblaster_activity', JSON.stringify(activity));
        }

        if (this.lastVisit !== today) {
            if (this.lastVisit) {
                const lastDate = new Date(this.lastVisit);
                const diffTime = Math.abs(new Date(today) - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    this.streak += 1;
                } else if (diffDays > 1) {
                    this.streak = 0;
                }
            } else {
                this.streak = 1; // First visit
            }
            this.lastVisit = today;
            localStorage.setItem('bugblaster_streak', this.streak);
            localStorage.setItem('bugblaster_last_visit', this.lastVisit);
        }
    }

    initUI() {
        // Create popup container if not exists
        if (!document.getElementById('xp-popup-container')) {
            const container = document.createElement('div');
            container.id = 'xp-popup-container';
            document.body.appendChild(container);
        }

        // Create level up modal if not exists
        if (!document.getElementById('level-up-modal')) {
            const modal = document.createElement('div');
            modal.id = 'level-up-modal';
            modal.className = 'modal hidden';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="confetti">🎉</div>
                    <h2>LEVEL UP! 🎉</h2>
                    <p>You are now a <strong id="new-level-name"></strong></p>
                    <button class="cta-button" onclick="document.getElementById('level-up-modal').classList.add('hidden')">Keep Blasting!</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    updateUI() {
        // Update Navbar Elements
        const streakEl = document.getElementById('nav-streak');
        const xpEl = document.getElementById('nav-xp');
        const levelBadgeEl = document.getElementById('nav-level-badge');
        
        if (streakEl) streakEl.innerText = `🔥 ${this.streak}`;
        if (xpEl) xpEl.innerText = `⚡ ${this.xp}`;
        if (levelBadgeEl) {
            levelBadgeEl.innerText = `Lvl ${this.level.levelNum}: ${this.level.name.split(' ')[0]}`; // e.g. Lvl 1: 🐛
            levelBadgeEl.className = `level-badge level-${this.level.levelNum}`;
            levelBadgeEl.title = this.level.name;
        }

        // Update banners/progress bars if they exist on the page
        const fireBanner = document.getElementById('fire-banner');
        if (fireBanner) {
            if (this.streak >= 3) {
                fireBanner.classList.remove('hidden');
            } else {
                fireBanner.classList.add('hidden');
            }
        }

        const progressBar = document.getElementById('level-progress-fill');
        const progressText = document.getElementById('level-progress-text');
        if (progressBar && progressText) {
            progressText.innerText = `${this.level.name}`;
            
            let progressPercent = 100;
            if (this.level.max !== Infinity) {
                const levelRange = this.level.max - this.level.threshold + 1;
                const currentLevelXp = this.xp - this.level.threshold;
                progressPercent = (currentLevelXp / levelRange) * 100;
            }
            progressBar.style.width = `${progressPercent}%`;
        }
    }

    awardXP(amount) {
        const oldLevelNum = this.level.levelNum;
        this.xp += amount;
        localStorage.setItem('bugblaster_xp', this.xp);
        
        this.level = this.calculateLevel(this.xp);
        
        this.showXPPopup(amount);
        this.updateUI();

        // Trigger XP bounce animation
        const xpEl = document.getElementById('nav-xp');
        if (xpEl) {
            xpEl.classList.remove('bounce');
            void xpEl.offsetWidth; // trigger reflow
            xpEl.classList.add('bounce');
        }

        if (this.level.levelNum > oldLevelNum) {
            this.showLevelUpModal();
            showConfetti();
        }
    }

    showXPPopup(amount) {
        const container = document.getElementById('xp-popup-container');
        const popup = document.createElement('div');
        popup.className = 'xp-float-popup';
        popup.innerText = `+${amount} XP 🎉`;
        
        container.appendChild(popup);
        
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }, 1500);
    }

    showLevelUpModal() {
        const modal = document.getElementById('level-up-modal');
        const levelName = document.getElementById('new-level-name');
        if (levelName) levelName.innerText = this.level.name;
        if (modal) modal.classList.remove('hidden');
    }

    initScrollToTop() {
        const btn = document.createElement('button');
        btn.id = 'scroll-to-top';
        btn.className = 'scroll-to-top';
        btn.innerHTML = '↑';
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize and make globally available
window.gamification = new Gamification();

} catch (e) {
    console.error('BugBlaster Error (gamification.js):', e);
}


function showConfetti() {
  const colors = ['#58CC02','#FFD700','#FF4B4B','#1CB0F6','#FF9600'];
  for(let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `position:fixed; width:10px; height:10px; background:${colors[Math.floor(Math.random()*5)]}; left:${Math.random()*100}vw; top:-10px; border-radius:50%; z-index:9999; pointer-events:none; animation:fall ${1+Math.random()*2}s linear forwards`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 3000);
  }
}
