const fs = require('fs');

async function test() {
  try {
    const res = await fetch('https://www.instagram.com/p/DYcEh5vEdqs/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    fs.writeFileSync('insta.html', html);
    console.log('Main fetch complete, length:', html.length);
    
    // Find meta og:image or any image urls
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
    if (ogImageMatch) {
      console.log('Found og:image:', ogImageMatch[1]);
    } else {
      console.log('No og:image match.');
    }
  } catch (err) {
    console.error(err);
  }
}

test();
