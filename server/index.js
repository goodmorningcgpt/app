const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const SQL_URI = process.env.SQL_URI;

const pool = new Pool({
  connectionString: SQL_URI,
});

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