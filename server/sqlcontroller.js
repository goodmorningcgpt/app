// WORKSPACE FOR SQL QUERY WRITING

app.post('/sqltest', (req, res) => {
  const { phoneNumber } = req.body;
  pool.query(`SELECT * FROM users WHERE phone_number = $1`, [phoneNumber])
    .then(results => {
      console.log(results);
      if (results.rows.length > 1) isUser = true;
    })
    .catch(err => console.log(err));
  res.status(200).send();
})


pool.query(`SELECT * FROM users WHERE phone_number = $1`, values)
.then(results => {
  if (results.rows.length > 0) isUser = true;
})
.catch(err => console.log(err));

