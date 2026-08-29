const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// The user is demanding exactly this:
css = css.replace(/\.fade-in\s*\{[\s\S]*?\}/, `.fade-in {
    opacity: 1;
    animation: fadeIn 0.8s ease-out forwards;
}`);

// The user demanded we make sure @keyframes fadeIn ends with opacity: 1
css = css.replace(/@keyframes fadeIn\s*\{[\s\S]*?to\s*\{[\s\S]*?\}[\s\S]*?\}/, `@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`);

// The user demanded we remove any position: fixed overlay covering the page
// .modal is position: fixed covering the page.
css = css.replace(/\.modal\s*\{[\s\S]*?\}/, `.modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: none; /* Make sure it doesn't block by default */
    justify-content: center;
    align-items: center;
    z-index: 2000;
}`);

// Also fix .hidden just in case
css = css.replace(/\.hidden\s*\{[\s\S]*?\}/g, `.hidden {
    display: none !important;
    pointer-events: none !important;
}`);

// Remove pointer-events: none from .marquee-container because the user said "pointer-events: none on any main content element"
// Actually, earlier they told me to ADD pointer-events: none to marquee. Now they said "Remove ANY of these: pointer-events: none on any main content element".
// The marquee is a main content element!
css = css.replace(/pointer-events:\s*none;?/g, '');
css = css.replace(/pointer-events:\s*none\s*!important;?/g, '');

fs.writeFileSync('style.css', css);

// Also remove from game.html just in case
let game = fs.readFileSync('game.html', 'utf8');
game = game.replace(/pointer-events:\s*none;?/g, '');
fs.writeFileSync('game.html', game);

console.log("Nuked all blockers");
