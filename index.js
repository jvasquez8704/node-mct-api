const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

//added to https and certificate support
const fs = require('fs');
const https = require('https');
 
const app = express();

app.use(cors());
app.unsubscribe(dotenv);
app.use(express.static('public'));

//Lectura y parseo de boby
app.use(express.json());

//Routes
//TODO : AUTH: 
//app.use('/api/auth', require('./routes/auth'));

//TODO : CRUD: Documents
app.use('/api/document', require('./routes/docs'));

//configuramos
https.createServer({
    key: fs.readFileSync('certs/privkey1.pem'),
    cert: fs.readFileSync('certs/cert1.pem')
}, app).listen( process.env.PORT, () => {
    console.log( `Server started in port ${ process.env.PORT } ` );
})
