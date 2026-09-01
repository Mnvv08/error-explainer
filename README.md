# BugBlaster 🐛
> **The Duolingo for Debugging** — Learn to fix code errors, play games, earn XP, and build daily habits.

![BugBlaster](bug_illustration.jpg)

## 🚀 Live Demo
Coming soon...

## 📖 About
BugBlaster is an AI-powered web app designed for beginner programmers to learn debugging in a fun, gamified way. Instead of boring error messages, BugBlaster explains code errors in plain English, lets you play debugging games, and rewards you with XP for every bug you fix.

## ✨ Features

### 🤖 AI Error Explainer
- Paste broken code in Python, C, or Java
- Claude AI explains the error in beginner-friendly language
- Shows the fixed code with one click
- Generates similar practice questions

### 🎮 Bug Hunter Game
- Spot the bug in code snippets before the timer runs out
- Choose your language: Python, Java, C, C++, JavaScript
- Two modes: Bug Hunt and Guess the Language
- Earn +20 XP for every correct answer
- Hint system (-5 XP per hint)

### 📅 Daily Challenge
- One special 3-question challenge every day
- Same challenge for all users worldwide
- Earn +50 XP on completion
- Build your daily streak

### 🏆 XP & Level System
- Earn XP for every activity
- 5 levels: Buggy Beginner → Code Detective → Debug Ninja → Bug Master → Code Legend
- Visual progress bar and level badges
- Daily streak tracking

### 📊 Leaderboard & Dashboard
- Track your progress: XP, bugs blasted, games played
- Weekly activity chart
- Achievement badges
- Global leaderboard with rankings

### 🔗 Share Your Score
- Share your Bug Hunter score with friends
- Native share sheet on mobile
- Copy to clipboard on desktop

## 🛠️ Tech Stack
| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling |
| Vanilla JavaScript | Logic & interactivity |
| Claude AI API | Error explanation & challenge generation |
| Firebase Auth | Google + Email login |
| Firebase Firestore | User data & progress sync |
| localStorage | Guest mode data storage |

## 📁 Project Structure
```text
error-explainer/
├── index.html           # Landing page
├── practice.html        # AI Error Explainer
├── game.html            # Bug Hunter game
├── daily.html           # Daily Challenge
├── leaderboard.html     # Leaderboard & Dashboard
├── login.html           # Login & Signup
├── gamification.js      # XP, streak & level system
├── script.js            # Practice page logic
├── leaderboard.js       # Leaderboard logic
├── style.css            # Global styles
└── bug_illustration.jpg # Mascot image
```

## 🚀 Getting Started

### Run Locally
```bash
# Clone the repo
git clone https://github.com/Mnvv08/error-explainer.git

# Navigate to folder
cd error-explainer

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/index.html
```

### Add Your API Key
- Get your Claude API key from [console.anthropic.com](https://console.anthropic.com)
- Open `script.js` and replace `YOUR_API_KEY` with your key
- Open `game.html` and replace `YOUR_API_KEY` with your key

## 🎯 How to Use
- **Practice Page** — Paste your broken code, select language, click "Blast the Bug"
- **Bug Hunter** — Select language, click Start Hunt, click the buggy line
- **Daily Challenge** — Complete 3 questions every day to build your streak
- **Leaderboard** — Track your progress and compare with others

## 🗺️ Roadmap
- [ ] Deploy to Vercel
- [ ] Add more languages (Rust, Go, Swift)
- [ ] Multiplayer bug hunt mode
- [ ] Teacher/classroom mode
- [ ] Mobile app (React Native)

## 👨‍💻 Author
**Manav Parihar**
- GitHub: [@Mnvv08](https://github.com/Mnvv08)

## 📄 License
MIT License — feel free to use and modify!

⭐ If you found this useful, please star the repo!
