const fs = require('fs');
let text = fs.readFileSync('insta_embed.html', 'utf8');

// replace unicode escapes and backslashes
text = text.replace(/\\u0026/g, '&')
           .replace(/\\u003d/g, '=')
           .replace(/\\/g, '');

const regex = /https:\/\/[^"'\s<>]+?\.(?:jpg|png|webp|heic)[^"'\s<>]*/gi;
const matches = text.match(regex) || [];
console.log('Matches with backslashes removed:', [...new Set(matches)].slice(0, 10));

// Let's filter for scontent-
const scontent = matches.filter(m => m.includes('scontent'));
console.log('Scontent matches:', [...new Set(scontent)].slice(0, 10));
