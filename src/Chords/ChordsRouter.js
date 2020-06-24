const express = require('express');
const chordsRouter = express.Router();
const ChordsService = require('./ChordsService');

chordsRouter 
    .route('/')
    .get((req, res, next) => {
        ChordsService.getAllChords(req.app.get('db'))
            .then(chords => {
                res.json(chords)
            })    
        .catch(next)
    })

module.exports = chordsRouter    