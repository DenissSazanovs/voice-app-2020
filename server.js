const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const Client = require('twilio');

const AccessToken = Client.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT, 10) || 3030;
const webDir = process.argv[2] || path.join(__dirname, 'public');

const authToken = process.env.AUTH_TOKEN;
const twilioAccountSid = process.env.ACCOUNT_SID;
const twilioApiKey = process.env.API_KEY;
const twilioApiSecret = process.env.API_SECRET;

if (!twilioAccountSid || !twilioApiKey || !twilioApiSecret || !authToken) {
  console.log('Missing environment variables. Please check readme.\n');
  process.exit();
}

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Received request for: ' + req.url);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/', express.static(webDir));

app.get('/device', (req, res) => {
  res.sendFile(webDir + '/device.html');
});

app.get('/diagnostics', (req, res) => {
  res.sendFile(webDir + '/diagnostics.html');
});

app.get('/iceservers', (req, res) => {
  const client = Client(twilioAccountSid, authToken);
  client.tokens.create({ttl: 120})
    .then(token => res.send(token));
});

app.get('/token', (req, res) => {
  const identity = req.query.identity;
  const twimlAppSid = req.query.twimlAppSid;

  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: twimlAppSid,
    incomingAllow: !!identity,
  });

  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
  token.addGrant(voiceGrant);
  token.identity = identity;

  res.send({
    identity,
    token: token.toJwt()
  });
});

app.route('/*').get((req, res) => {
  res.sendFile(webDir + '/index.html');
});

server.listen(port, () => {
  console.log(`Serving ${webDir} at port ${port}`);
});
