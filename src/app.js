require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router')
const chordsRouter = require('./Chords/ChordsRouter')

const app = express();



app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))
app.use(cors());
app.use(helmet());

app.use('/api/auth/', authRouter)
app.use('/api/chords', chordsRouter)

app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' })
});

function errorHandler(error, req, res, next) {
    if (NODE_ENV === 'production') {
        response = { message: 'Internal server error occured.' }
    } else {
        console.log(error);
        response = { error: error.message, object: error }
    }

    res.status(500).json(response);
}

app.use(errorHandler);

module.exports = app;