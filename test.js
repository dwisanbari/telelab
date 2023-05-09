const express = require('express');
const mariadb = require('mariadb');

const app = express();
const port = 3000;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'telelab',
  connectionLimit: 5
});

app.get('/', (req, res) => {
  pool.getConnection()
    .then(conn => {
      conn.query("SELECT * FROM user")
        .then(rows => {
          res.send(rows);
          conn.release();
        })
        .catch(err => {
          console.log(err);
          conn.release();
        });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});