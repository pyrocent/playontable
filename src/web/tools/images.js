const fs = require('fs');
const axios = require('axios');

async function urlToBase64(url) {
    const res = await axios.get(url, {responseType: 'arraybuffer'});
    const mime = res.headers['content-type'];
    const base64 = Buffer.from(res.data).toString('base64');
    return `data:${mime};base64,${base64}`;
}

(async () => {
    const html = fs.readFileSync('public/index.html', 'UTF-8');
    const urls = html.matchAll(/https:\/\/[^\s"']+\.(png|jpg)/gi);

    for (const url of urls) html = html.replace(url, await urlToBase64(url));

    fs.writeFileSync("demo.html", html);
})();