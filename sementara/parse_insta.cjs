const fs = require('fs');
const html = fs.readFileSync('insta.html', 'utf8');

// Search for JPG urls or display_url
console.log('Searching for images...');
const urls = [];
const regex = /https:\/\/[^"'\s\\]+?\.jpg[^"'\s\\]*/g;
let match;
while ((match = regex.exec(html)) !== null) {
  urls.push(match[0]);
}

console.log('Found JPG URLs:', [...new Set(urls)].slice(0, 5));

// Check if there are any meta tags or inline scripts containing "display_url" or "display_resources"
const results = html.match(/"display_url"\s*:\s*"([^"]+)"/g);
if (results) {
  console.log('Found display_urls:', results.slice(0, 5));
} else {
  console.log('No display_url found.');
}
