const fs = require('fs');
const html = fs.readFileSync('insta.html', 'utf8');

// Print any line containing og:image or twitter:image or display_url
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('meta') && (line.includes('image') || line.includes('img') || line.includes('og:'))) {
    console.log(`Line ${i}:`, line.trim().substring(0, 500));
  }
}
