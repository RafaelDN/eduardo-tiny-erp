import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
const port = 8080; // Usaremos a porta 8080

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__filename', __filename);
console.log('__dirname', __dirname);

console.log('path', path.join(__dirname, 'dudu-app/dist'));

app.use(express.static(path.join(__dirname, 'dudu-app/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dudu-app/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App executando em http://0.0.0.0:${port}`);
});