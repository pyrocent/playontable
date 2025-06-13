#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
const path = require('path');

const htmlPath = process.argv[2] || './index.html';
const html = fs.readFileSync(htmlPath, 'utf-8');

async function urlToBase64(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  const mime = res.headers['content-type'];
  const base64 = Buffer.from(res.data).toString('base64');
  return `data:${mime};base64,${base64}`;
}

// Trova tutte le URL nelle src di immagini o CSS inline
const urlRegex = /(["'])https?:\/\/[^"']+\.(png|jpg|jpeg|gif|svg)(\?[^"']*)?\1/g;

(async () => {
  let modifiedHtml = html;
  const matches = [...html.matchAll(urlRegex)];

  for (const match of matches) {
    const fullMatch = match[0];
    const url = fullMatch.slice(1, -1); // rimuove virgolette

    console.log(`🔄 Converting ${url} to Base64...`);
    try {
      const base64 = await urlToBase64(url);
      modifiedHtml = modifiedHtml.replace(fullMatch, `"${base64}"`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${url}: ${err.message}`);
    }
  }

  const outPath = path.join(path.dirname(htmlPath), 'index.html');
  fs.writeFileSync(outPath, modifiedHtml);
  console.log(`✅ Base64 inlining complete: ${outPath}`);
})();
