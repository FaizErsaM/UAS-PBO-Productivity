const fs = require('fs');
const text = fs.readFileSync('insta_embed.html', 'utf8');

// Search for any jpg or png urls in insta_embed.html
const regex = /https:\/\/[^"'\\s\\]+?\.(?:jpg|png|webp)[^"'\\s\\]*/g;
const matches = text.match(regex) || [];
console.log('Matches found in insta_embed:', [...new Set(matches)].slice(0, 5));

// Let's also check for scontent
const scontentMatches = text.match(/https:\/\/[^"'\s\\]+?scontent[^"'\s\\]+?\.(?:jpg|png|webp)[^"'\s\\]*/g) || [];
console.log('Scontent matches in insta_embed:', [...new Set(scontentMatches)].slice(0, 5));
