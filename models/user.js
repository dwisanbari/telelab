const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'telelab',
  connectionLimit: 5
});


class User {
    static allUsers(callback){
      pool.query('SELECT * FROM users')
        .then(rows => {
          callback(null, rows);
      })
      .catch(err => {
        callback(err, null);
      });

    }
    static allData(callback){
        pool.query('SELECT * FROM data')
          .then(rows => {
            callback(null, rows);
        })
        .catch(err => {
          callback(err, null);
        });
    }
    static create(params, callback) {
      pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [params.email, params.password])
        .then(() => {
          callback(null);
      })
      .catch(err => {
        callback(err);
      });
    }
    static login(email, password, callback) {

        pool.query('SELECT * FROM users WHERE email = ?', [email])
          .then(rows => {
            console.log("memverifikasi data pengguna")
            if (rows.length === 0) { // jika email tidak ditemukan di database
              callback("Email atau password salah", null);
            } else {
              const hashedPassword = rows[0].password;
              bcrypt.compare(password, hashedPassword, function(err, result) {
                if (result) { // jika password cocok
                  callback(null, rows[0]);
                } else { // jika password salah
                  callback("Email atau password salah", null);
                }
              });
            }
          })
          .catch(err => {
            callback(err, null);
          });
    }
    static logout(req, res) {
        req.logout();
        res.redirect('/login');
    }
    
}

module.exports = User;