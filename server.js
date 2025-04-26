import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import querystring from 'node:querystring';

// Para poder usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Simulación de "base de datos" en memoria
const users = {};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'login.html' : req.url);
    const extname = path.extname(filePath);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Página no encontrada');
      } else {
        let contentType = 'text/html';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.method === 'POST') {
    if (req.url === '/login') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        const { username, password } = querystring.parse(body);
        if (users[username] && users[username] === password) {
          res.writeHead(302, { Location: '/success.html' });
        } else {
          res.writeHead(302, { Location: '/login.html' });
        }
        res.end();
      });
    }

    if (req.url === '/register') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        const { username, password } = querystring.parse(body);
        if (!users[username]) {
          users[username] = password;
          res.writeHead(302, { Location: '/success.html' });
        } else {
          res.writeHead(302, { Location: '/register.html' });
        }
        res.end();
      });
    }
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
