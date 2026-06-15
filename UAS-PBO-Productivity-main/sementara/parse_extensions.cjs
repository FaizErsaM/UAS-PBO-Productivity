const fs = require('fs');
const html = fs.readFileSync('insta.html', 'utf8');

const ext = ['jpg', 'jpeg', 'png', 'webp'];
const found = [];

for (const e of ext) {
  let idx = 0;
  while (true) {
    const nextIdx = html.indexOf('.' + e, idx);
    if (nextIdx === -1) break;
    // Extract 200 characters around it
    const start = Math.max(0, nextIdx - 150);
    const end = Math.min(html.length, nextIdx + 50);
    found.push(html.substring(start, end).replace(/\s+/g, ' '));
    idx = nextIdx + e.length + 1;
    if (found.length > 50) break;
  }
}

console.log('Sample matches containing extensions:');
console.log(found.slice(0, 15));
