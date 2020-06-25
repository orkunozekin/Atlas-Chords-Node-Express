const express = require('express');
const chordsRouter = express.Router();
const ChordsService = require('./ChordsService');
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const path = require('path')

chordsRouter 
    .route('/')
    .get((req, res, next) => {
        ChordsService.getAllChords(req.app.get('db'))
            .then(chords => {
                res.json(chords)
            })    
        .catch(next)
    })

    .post(requireAuth, jsonBodyParser, (req, res, next) => { // get notes from the body
        const { key, type, user_id } = req.body
        const newChord = { key, type, user_id }

        for (const [key, value] of Object.entries(newChord))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        
        ChordsService.insertChord(req.app.get('db'), newChord)
            .then(chord => {
                //before sending response, insert all 6 notes. 
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${chord.id}`))
                    .json(ChordsService.serializeChord(chord))
            })
            .catch(next)
    })
    
chordsRouter
    .route('/:chord_id')
    .all(requireAuth)
    .all(checkChordExists)
    .get((req, res) => {
        res.json(ChordsService.serializeChord(res.chord))
    })

async function checkChordExists(req, res, next) {
    try {
        const chord = await ChordsService.getById(
            req.app.get('db'),
            req.params.chord_id
        )
        if (!chord)
            return res.status(404).json({
                error: `Chord doesn't exist`
            })
        res.chord = chord
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = chordsRouter    