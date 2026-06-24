const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { findUserUnsafe, loginUnsafe } = require('./db');
const { jwtSecret } = require('./config');
const { parsePluginManifest, unsafeMerge } = require('./zeroDaySim');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.disable('x-powered-by');

app.get('/health', (req, res) => res.send('ok'));

app.get('/search', (req, res) => {
  findUserUnsafe(req.query.q || '', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post('/login', (req, res) => {
  loginUnsafe(req.body.username, req.body.password, (err, user) => {
    if (err || !user) return res.status(401).send('bad login');
    const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { algorithm: 'HS256' });
    res.cookie('session', token, { httpOnly: false, secure: false, sameSite: 'none' });
    res.json({ token });
  });
});

app.get('/ping', (req, res) => {
  // SAST: command injection
  const host = req.query.host || '127.0.0.1';
  childProcess.exec('ping -c 1 ' + host, (err, stdout, stderr) => {
    res.type('text/plain').send(stdout || stderr || String(err));
  });
});

app.get('/fetch', async (req, res) => {
  // SAST: SSRF
  const target = req.query.url;
  const response = await fetch(target);
  res.send(await response.text());
});

app.get('/download', (req, res) => {
  // SAST: path traversal
  const file = req.query.file;
  const content = fs.readFileSync(path.join(__dirname, '../../uploads', file), 'utf8');
  res.type('text/plain').send(content);
});

app.post('/render', (req, res) => {
  // SAST: reflected/stored XSS style behavior
  res.send(`<html><body><h1>${req.body.title}</h1><div>${req.body.html}</div></body></html>`);
});

app.post('/hash', (req, res) => {
  // SAST: weak cryptographic hash
  const digest = crypto.createHash('md5').update(req.body.value || '').digest('hex');
  res.json({ digest });
});

app.post('/plugin', (req, res) => {
  const result = parsePluginManifest(req.body);
  res.json({ result });
});

app.post('/merge-profile', (req, res) => {
  const profile = unsafeMerge({}, req.body);
  res.json(profile);
});

app.listen(3000, '0.0.0.0', () => console.log('vulnerable backend on 3000'));
