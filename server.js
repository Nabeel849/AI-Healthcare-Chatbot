const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { exec } = require('child_process');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000');

    // Start the Python backend
    exec('cd app/api/chat && python app.py', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${err}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  });
});
