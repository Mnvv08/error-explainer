// ============================================================
// BugBlaster Firebase Auth + Firestore
// ============================================================
// SETUP REQUIRED:
// 1. Go to console.firebase.google.com
// 2. Create project "BugBlaster"
// 3. Enable Authentication → Google + Email/Password
// 4. Create Firestore database (start in test mode)
// 5. Replace the firebaseConfig below with your actual config
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ─── Auth State Listener ────────────────────────────────────
auth.onAuthStateChanged(function(user) {
  updateNavbarAuthUI(user);
  if (user) {
    loadUserFromFirestore(user);
  }
});

// ─── Navbar UI ──────────────────────────────────────────────
function updateNavbarAuthUI(user) {
  const authSlot = document.getElementById('nav-auth-slot');
  if (!authSlot) return;

  if (user) {
    const photoURL = user.photoURL
      ? `<img src="${user.photoURL}" style="width:28px;height:28px;border-radius:50%;vertical-align:middle;margin-right:6px;" />`
      : '👤';
    authSlot.innerHTML = `
      <span style="font-weight:700;color:#333;">${photoURL}${user.displayName || user.email}</span>
      <button onclick="logoutUser()" style="
        background:#ff4b4b;color:white;border:none;padding:6px 14px;
        border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px;font-size:0.9rem;">
        Logout
      </button>`;
  } else {
    authSlot.innerHTML = `
      <a href="login.html" style="
        background:#58CC02;color:white;border:none;padding:8px 18px;
        border-radius:10px;font-weight:900;cursor:pointer;font-size:1rem;text-decoration:none;
        box-shadow:0 3px 0 #46A302;display:inline-block;">
        Login 🔑
      </a>`;
  }

  // Show/hide guest banner
  const guestBanner = document.getElementById('guest-banner');
  if (guestBanner) {
    guestBanner.style.display = user ? 'none' : 'flex';
  }
}

// ─── Google Login ────────────────────────────────────────────
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(saveUserToFirestore)
    .catch(function(err) {
      console.error('Google login error:', err);
      alert('Google login failed: ' + err.message);
    });
}

// ─── Email Login ─────────────────────────────────────────────
function loginWithEmail(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(saveUserToFirestore)
    .catch(function(err) {
      console.error('Email login error:', err);
      showAuthError(err.message);
    });
}

// ─── Email Signup ────────────────────────────────────────────
function signupWithEmail(name, email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(result) {
      return result.user.updateProfile({ displayName: name }).then(function() {
        return saveUserToFirestore(result);
      });
    })
    .catch(function(err) {
      console.error('Signup error:', err);
      showAuthError(err.message);
    });
}

// ─── Logout ──────────────────────────────────────────────────
function logoutUser() {
  auth.signOut().then(function() {
    // Clear local state
    localStorage.removeItem('bugblaster_xp');
    localStorage.removeItem('bugblaster_streak');
    localStorage.removeItem('bugblaster_highscore');
    localStorage.removeItem('bugblaster_bugs_count');
    localStorage.removeItem('bugblaster_last_visit');
    window.location.href = 'index.html';
  });
}

// ─── Save / Load Firestore ────────────────────────────────────
function saveUserToFirestore(result) {
  const user = result.user;
  const userRef = db.collection('users').doc(user.uid);

  return userRef.get().then(function(doc) {
    if (!doc.exists) {
      // New user — migrate localStorage data to Firestore
      return userRef.set({
        name: user.displayName || 'Bug Blaster',
        email: user.email || '',
        photoURL: user.photoURL || '',
        xp: parseInt(localStorage.getItem('bugblaster_xp') || '0'),
        streak: parseInt(localStorage.getItem('bugblaster_streak') || '0'),
        highScore: parseInt(localStorage.getItem('bugblaster_highscore') || '0'),
        bugsBlasted: parseInt(localStorage.getItem('bugblaster_bugs_count') || '0'),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(function() {
        window.location.href = 'index.html';
      });
    } else {
      // Existing user — sync cloud data back to localStorage
      const data = doc.data();
      localStorage.setItem('bugblaster_xp', data.xp || 0);
      localStorage.setItem('bugblaster_streak', data.streak || 0);
      localStorage.setItem('bugblaster_highscore', data.highScore || 0);
      localStorage.setItem('bugblaster_bugs_count', data.bugsBlasted || 0);
      window.location.href = 'index.html';
    }
  });
}

function loadUserFromFirestore(user) {
  const userRef = db.collection('users').doc(user.uid);
  userRef.get().then(function(doc) {
    if (doc.exists) {
      const data = doc.data();
      // Sync cloud → localStorage
      localStorage.setItem('bugblaster_xp', data.xp || 0);
      localStorage.setItem('bugblaster_streak', data.streak || 0);
      localStorage.setItem('bugblaster_highscore', data.highScore || 0);
      // Refresh navbar XP display
      const xpEl = document.getElementById('nav-xp');
      const streakEl = document.getElementById('nav-streak');
      if (xpEl) xpEl.textContent = data.xp || 0;
      if (streakEl) streakEl.textContent = data.streak || 0;
    }
  }).catch(function(err) {
    console.error('Firestore load error:', err);
  });
}

// ─── Sync XP to Cloud ────────────────────────────────────────
function syncXPToCloud(xp, streak, highScore) {
  const user = auth.currentUser;
  if (!user) return; // guest mode — skip
  db.collection('users').doc(user.uid).update({
    xp: xp,
    streak: streak,
    highScore: highScore
  }).catch(function(err) {
    console.error('XP sync error:', err);
  });
}

// ─── Helpers ─────────────────────────────────────────────────
function showAuthError(msg) {
  const errEl = document.getElementById('auth-error');
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = 'block';
  } else {
    alert(msg);
  }
}
