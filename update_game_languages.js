const fs = require('fs');
const file = '/Users/manavparihar/error-explainer/game.js';
let content = fs.readFileSync(file, 'utf8');

// Update languages array
content = content.replace(
    'const languages = ["Python", "Java", "C"];',
    'const languages = ["Python", "Java", "C", "C++", "JavaScript"];'
);

// Append new challenges to CHALLENGE_BANK
const newChallenges = `
    ,
    {
        id: 21, language: 'C++', hint: 'Namespace', correct_line: 2,
        buggy_code: '#include <iostream>\\nint main() {\\n    cout << "Hello World";\\n    return 0;\\n}',
        explanation: 'In C++, standard library functions like cout are in the std namespace. You must use std::cout or declare using namespace std.',
        fixed_code: '#include <iostream>\\nint main() {\\n    std::cout << "Hello World";\\n    return 0;\\n}'
    },
    {
        id: 22, language: 'C++', hint: 'Semicolon', correct_line: 2,
        buggy_code: 'class Car {\\n    int speed\\n};',
        explanation: 'Missing a semicolon after the member variable declaration inside a class.',
        fixed_code: 'class Car {\\n    int speed;\\n};'
    },
    {
        id: 23, language: 'JavaScript', hint: 'Equality', correct_line: 2,
        buggy_code: 'function checkZero(num) {\\n    if (num = 0) {\\n        return true;\\n    }\\n    return false;\\n}',
        explanation: 'Using a single equals sign (=) assigns the value instead of comparing it. You should use === for comparison.',
        fixed_code: 'function checkZero(num) {\\n    if (num === 0) {\\n        return true;\\n    }\\n    return false;\\n}'
    },
    {
        id: 24, language: 'JavaScript', hint: 'Const', correct_line: 3,
        buggy_code: 'const count = 1;\\nfunction increment() {\\n    count++;\\n    return count;\\n}',
        explanation: 'Variables declared with const cannot be reassigned or incremented. Use let instead.',
        fixed_code: 'let count = 1;\\nfunction increment() {\\n    count++;\\n    return count;\\n}'
    }
`;

content = content.replace(
    /    \}\n\];/,
    newChallenges + '    }\n];'
);

fs.writeFileSync(file, content);
console.log("Updated game.js with new challenges");
