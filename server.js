const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'out');
const port = 3000;
const mime = {
  '.html':'text/html;charset=utf-8',
  '.css':'text/css',
  '.js':'application/javascript',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon',
  '.woff2':'font/woff2',
  '.woff':'font/woff',
  '.json':'application/json'
};
const s = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let fp = path.join(dir, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime[ext]||'application/octet-stream'});
    res.end(data);
  });
});
s.listen(port, '0.0.0.0', () => console.log('Server running on port ' + port));
