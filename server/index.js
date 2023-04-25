const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const ngrok = require('ngrok');
import timezonelist from "./timezonetasks";

const app = express();
const port = 3000;

// Twilio account credentials
const accountSid = 'AC5e57136a0b63339682fb1c5bdb550652';
const authToken = '24cecbc1d4f6d03cd84f94aa8bf0a093';
const client = twilio(accountSid, authToken);

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