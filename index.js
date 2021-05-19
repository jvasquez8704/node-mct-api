const express = require('express');
require('dotenv').config();
const cors = require('cors');
 
const app = express();

app.use(cors());

app.use(express.static('public'));

//Lectura y parseo de boby
app.use(express.json());

//Routes
//TODO : AUTH: 
//app.use('/api/auth', require('./routes/auth'));

//TODO : CRUD: Documents
app.use('/api/document', require('./routes/docs'));


//configuramos
app.listen( process.env.PORT, () => {
    console.log( `Server started in port ${ process.env.PORT } ` );
})