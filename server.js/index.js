const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

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

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});