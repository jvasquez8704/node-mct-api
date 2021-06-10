const express = require('express');
require('dotenv').config();
const cors = require('cors');

//added to https and certificate support
const fs = require('fs');
const https = require('https');
 
const app = express();

app.use(cors());
app.use(express.static('public'));

//Lectura y parseo de boby
app.use(express.json());

//Routes
//app.use('/api/auth', require('./routes/auth'));

app.use('/document', require('./routes/docs'));

app.use('/genes/document', require('./routes/genes'));

app.use('/scoring_rules/document', require('./routes/scoring-rules'));

//configuramos
https.createServer({
    key: fs.readFileSync('certs/privkey1.pem'),
    cert: fs.readFileSync('certs/cert1.pem')
}, app).listen( process.env.PORT, () => {
    console.log( `Server started in port ${ process.env.PORT } ` );
})
