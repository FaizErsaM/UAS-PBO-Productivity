const fs = require('fs');
const html = fs.readFileSync('insta.html', 'utf8');

// Let's find any matches for "scontent"
const regex = /https:\\\/\\\/scontent[^"'\s]+?\.(?:jpg|png|webp|heic)[^"'\s]*/g;
const matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[0]);
}

console.log('Matches with scontent:', [...new Set(matches)]);

const regex2 = /https:\/\/scontent[^"'\s]+?\.(?:jpg|png|webp|heic)[^"'\s]*/g;
const matches2 = [];
while ((match = regex2.exec(html)) !== null) {
  matches2.push(match[0]);
}
console.log('Matches2 with scontent:', [...new Set(matches2)]);
