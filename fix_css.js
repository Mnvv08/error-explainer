const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// The user is demanding we remove opacity: 0 from .fade-in if it exists (even though we see opacity: 1). Let's explicitly enforce opacity: 1.
css = css.replace(/\.fade-in\s*\{[\s\S]*?opacity:\s*0;?[\s\S]*?\}/g, '.fade-in {\n    opacity: 1;\n    animation: fadeIn 0.8s ease-out forwards;\n}');

// Remove any other static opacity: 0 outside keyframes just to be totally safe. 
// We will just replace opacity: 0; with opacity: 1; unless it is inside @keyframes.
// Actually, it's safer to just replace all `opacity: 0;` that are not indented inside keyframes.
// Or we can just find them specifically.
css = css.replace(/\.result-section\s*\{[^}]*opacity:\s*0;?[^}]*\}/g, '.result-section {\n    opacity: 1;\n    animation: slideUpFade 0.5s ease forwards;\n}');

// Remove canvas block
css = css.replace(/canvas\s*\{[^}]*\}/g, '');

fs.writeFileSync('style.css', css);
console.log("CSS fixed");
