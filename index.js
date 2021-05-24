const express = require('express');
require('dotenv').config();
const cors = require('cors');
 
const app = express();

app.use(cors());

app.use(express.static('public'));

//Lectura y parseo de boby
app.use(express.json());

//Routes
//app.use('/api/auth', require('./routes/auth'));

app.use('/document', require('./routes/docs'));

app.use('/genes', require('./routes/genes'));

app.use('/scoring_rules', require('./routes/scoring-rules'));


//configuramos
app.listen( process.env.PORT, () => {
    console.log( `Server started in port ${ process.env.PORT } ` );
})