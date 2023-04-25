const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const ngrok = require('ngrok');
import timezonelist from "./timezonetasks";
const { Pool } = require('pg');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
dotenv.config();

// Twilio account credentials
const accountSid = 'AC5e57136a0b63339682fb1c5bdb550652';
const authToken = '24cecbc1d4f6d03cd84f94aa8bf0a093';
const client = twilio(accountSid, authToken);

const app = express();
// Parse incoming request body as text
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle incoming SMS messages
app.post('/sms', (req, res) => {
  const { Body, From } = req.body;

  // Send a response back to the sender
  const message = `Hey, this works! You sent:'${Body}' from ${From}`;
  client.messages.create({
    body: message,
    from: '+16319003876',
    to: From,
  }).then(() => {
    res.send('Message sent!');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending message');
  });
});

const cron = require('node-cron');

// Schedule task to run every hour
timezonelist.forEach(({ timezone, task }) => {
  cron.schedule('0 * * * *', () => {
    const now = moment().tz(timezone);
    if (now.hour() === 7) {
      sendMessages(timezone);
    }
  });
});

function sendMessages(timezone) {
  
}


// Start the server and ngrok tunnel
(async () => {
  const url = await ngrok.connect(port);
  console.log(`Server listening on ${url}`);
  console.log(`Webhook URL for Twilio: ${url}/sms`);
  app.listen(port);
})();

app.post('/sms', (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const messageBody = req.body.Body;
  const senderNumber = req.body.From;

  // Process the message and generate a response
  const response = processMessage(messageBody, senderNumber);

  twiml.message(response);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

const SQL_URI = process.env.SQL_URI;

const pool = new Pool({
  connectionString: SQL_URI,
});

// test endpoint for SQL 
app.post('/sql', (req, res) => {
  pool
    .query('SELECT * FROM users')
    .then(res => {
      console.log('response: ', res);
      res.status(200).send();
    })
    .catch(err => {
      console.log('err: ', err);
      res.status(500).send();
  });
})


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
