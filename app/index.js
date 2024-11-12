import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
const port = 8080; // Usaremos a porta 8080

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dudu-app/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dudu-app/dist', 'index.html'));
});

app.listen(port, '127.0.0.1', () => {
  console.log(`App executando em http://127.0.0.1:${port}`);
});