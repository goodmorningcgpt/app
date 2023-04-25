const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const ngrok = require('ngrok');
const timezonelist = require('./timezonelist.js');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
const cron = require('node-cron');
dotenv.config();

// Twilio account credentials
const accountSid = 'AC5e57136a0b63339682fb1c5bdb550652';
const authToken = '9676afa6e0b84c3bceec9dae5bc874b9';
const client = twilio(accountSid, authToken);
//SQL credentials
const SQL_URI = process.env.SQL_URI;

const pool = new Pool({
  connectionString: SQL_URI,
});

// Parse incoming request body as text
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle incoming SMS messages
app.post('/sms', (req, res) => {
  const { Body, From } = req.body;
  const isUser = false;
  // const await isUser = userExists();

  // // Test
  // const message = `Hey, this works! You sent:'${Body}' from ${From}`;
  // client.messages.create({
  //   body: message,
  //   from: '+16319003876',
  //   to: From,
  // }).then(() => {
  //   res.send('Message sent!');
  // }).catch((error) => {
  //   console.error(error);
  //   res.status(500).send('Error sending message');
  // });

  if(Body.slice(0,8).toLowerCase() === "morning") {
    //sql query to create user
    if(isUser) {
      alreadySignedUp(From);
    } else {
      signupUser(From);
    }
  } else if (Body.slice(0,4).toLowerCase() === "stop") {
    //sql query to remove user
    removeUser(From);
  } else {
    //sql query to send options to a user
    sendOptions(From);
  }
});

async function alreadySignedUp(number) {
  const response = `Hey! I see you're already signed up - glad to have you. I'll see you in the morning!`

  //sql query to add a user
  client.messages.create({
    body: response,
    from: '+16319003876',
    to: From,
  }).then(() => {
    res.send('Message sent!');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending message');
  });
}

async function signupUser(number) {
  const response = `Awesome! You'll now receive morning messages from me. As a reminder, if you ever wish to unsubscribe, just send "stop".`

  //sql query to add a user
  client.messages.create({
    body: response,
    from: '+16319003876',
    to: From,
  }).then(() => {
    res.send('Message sent!');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending message');
  });
}

async function userExists(From) {
  //sql query to see if the user exists or doesn't exist
  return false;
}

async function removeUser(From) {
  //sql query to remove a user
  const response = `You're now unsubscribed. If you change your mind, just send "morning", and I'll resume my morning messages. Goodbye!`

  //sql query to add a user
  client.messages.create({
    body: response,
    from: '+16319003876',
    to: From,
  }).then(() => {
    res.send('Message sent!');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending message');
  });

}

function sendOptions(From) {
  const response = `Hey, there! I'm GoodMorningGPT, your personal life coach to start your day. To subscribe for morning messages, just text "morning". If you no longer wish to receive messages, text "stop".`

  client.messages.create({
    body: response,
    from: '+16319003876',
    to: From,
  }).then(() => {
    res.send('Message sent!');
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error sending message');
  });
}

//Schedule task to run every hour
timezonelist.forEach(({ timezone, task }) => {
  cron.schedule('0 * * * *', () => {
    const now = moment().tz(timezone);
    if (now.hour() === 7) {
      sendMessages(timezone);
    }
  });
});

function sendMessages(timezone) {
  //query all users with the current timezone into

  //create a list of users with their phone numbers and message to send them

  //execute texts
}

// // test endpoint for SQL 
// app.post('/sql', (req, res) => {
//   pool
//     .query('SELECT * FROM users')
//     .then(res => {
//       console.log('response: ', res);
//       res.status(200).send();
//     })
//     .catch(err => {
//       console.log('err: ', err);
//       res.status(500).send();
//   });
// })

// Start the server and ngrok tunnel
(async () => {
  const url = await ngrok.connect(port);
  console.log(`Server listening on ${url}`);
  console.log(`Webhook URL for Twilio: ${url}/sms`);
  app.listen(port);
})();