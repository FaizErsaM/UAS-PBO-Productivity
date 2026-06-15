const fs = require('fs');
const html = fs.readFileSync('insta.html', 'utf8');

// Let's find any matches for "https" that contain ".fbcdn.net" or ".cdninstagram.com"
const matches = [];
const regex = /https:\\\/\\\/[^"'\s]+?\.cdninstagram\.com[^"'\s]+/g;
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[0]);
}

console.log('Matches with cdninstagram:', [...new Set(matches)].slice(0, 5));

const matches2 = [];
const regex2 = /https:\/\/([^"'\s\\\/]+?)\.cdninstagram\.com([^"'\s\\]+)/g;
while ((match = regex2.exec(html)) !== null) {
  matches2.push(match[0]);
}
console.log('Matches2 with cdninstagram:', [...new Set(matches2)].slice(0, 5));
