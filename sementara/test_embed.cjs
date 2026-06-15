const fs = require('fs');

async function test() {
  try {
    const urls = [
      'https://www.instagram.com/p/DYcEh5vEdqs/?__a=1&__d=dis',
      'https://www.instagram.com/p/DYcEh5vEdqs/embed/captioned/'
    ];
    
    for (const url of urls) {
      console.log('Fetching:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      fs.writeFileSync('insta_embed.html', text);
      console.log('Length:', text.length);
      
      // Look for any jpg urls in the embed
      const jpgs = text.match(/https:\/\/[^"'\s\\]+?\.jpg[^"'\s\\]*/g);
      if (jpgs) {
        console.log('Found JPGs in embed/api:', [...new Set(jpgs)].slice(0, 5));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

test();
