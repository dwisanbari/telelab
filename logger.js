const mariadb = require('mariadb');
const mqtt = require('mqtt');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'telelab',
    connectionLimit: 5
});

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect',function(){
    client.subscribe('data');
});

client.on('message',function(topic,message){
    const data = JSON.parse(message.toString());

    if(topic==='data'){
        const query = `
            INSERT INTO data(data1, data2, data3)
            VALUES(?,?,?)
        `;
        
        const values = [data.data1, data.data2, data.data3];

        pool.getConnection()
          .then(conn => {
            conn.query(query, values)
              .then(result => {
                console.log(`inserted data:${data.data1} ${data.data2} ${data.data3}`);
                conn.release();
              })
              .catch(err => {
                console.error(err.message);
                conn.release();
              });
          })
          .catch(err => {
            console.error(err.message);
          });
    } 
});