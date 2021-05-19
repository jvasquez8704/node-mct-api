const { Pool, Client } = require('pg');

//todo => this helper has to be singleton
const dbConnection = async () => {
    try {
       const client = new Client({
            host: process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB,
            port: process.env.DB_PORT
        });
        client.connect();
        console.log('Conexión exitosa...');
        return client;
    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar con DB');
    }
}

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port: process.env.DB_PORT
});

module.exports = {
    dbConnection,
    pool
}