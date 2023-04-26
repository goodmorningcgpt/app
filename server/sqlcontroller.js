// SQL QUERIES

module.exports = {
  selectUser: (phoneNumber) => {
    const text = 'SELECT * FROM users WHERE phone_number = $1';
    pool.query(text, [phoneNumber])
    .then(results => {
      if (results.rows.length > 0) isUser = true;
    })
    .catch(err => console.log(err));
  },

  deleteUser: (phoneNumber) => {
    const text = 'DELETE FROM users WHERE phone_number = $1';
    pool.query(text, [phoneNumber])
      .then(results => console.log(results))
      .catch(err => console.log(err));
  },

  addUser: (phoneNumber) => {
    const text = 'INSERT INTO users (phone_number, time_zone) VALUES ($1, $2)';
    pool.query(text, [phoneNumber, 'America/New_York'])
    .then(results => console.log(results))
    .catch(err => console.log(err));
  },

  deleteAllUsers: () => {
    const text = 'DELETE FROM users';
    pool.query(text)
      .then(results => console.log(results))
      .catch(err => console.log(err));
  },

  addMessage: (message) => {
    const text = 'INSERT INTO messages (message) VALUES ($1)';
    pool.query(text, [message])
      .then(results => console.log(results))
      .catch(err => console.log(err));
  },

  selectRandomMessage: () => {
    const text = 'SELECT * FROM messages order by random() LIMIT 1';
    pool.query(text)
      .then(results => console.log(results))
      .catch(err => console.log(err));
  },

  deleteAllMessages: () => {
    const text = 'DELETE FROM messages';
    pool.query(text)
      .then(results => console.log(results))
      .catch(err => console.log(err));
  },

}