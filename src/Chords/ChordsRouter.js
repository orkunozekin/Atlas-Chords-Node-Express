const express = require('express');
const chordsRouter = express.Router();
const ChordsService = require('./ChordsService');
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const path = require('path');
const { serializeChord } = require('./ChordsService');

chordsRouter 
    .route('/')
    .get((req, res, next) => {
        let chords;
        ChordsService.getAllChords(req.app.get('db'))
            .then(_chords => {
                
                chords = _chords
                // for (const value of chords) {
                //     console.log(value);
                //     chord = value
                // }
        
                const notesPromises = chords.map(chord => ChordsService.getAllNotesForChord(req.app.get('db'), chord.id))
                return Promise.all(notesPromises)
            })    
            .then((data) => {
                console.log(data[0], chords[0])
                const SerializedChordsWithNotes = chords.map((chord, index) => {
                    return ChordsService.serializeChord({
                        ...chord, notes: data[index]
                    })
                })
               
                res.json(SerializedChordsWithNotes)
            })
           
        // return ChordsService.getAllNotes(req.app.get('db'))
        //     .then(notesRes => {
        //         console.log(notesRes)
              
               
        //         console.log(chords)
        //         res.json(ChordsService.serializeChord({...chords, notes: notesWithChordId}))
            // })    
        
        .catch(next)
    })



    .post(requireAuth, jsonBodyParser, (req, res, next) => { // get notes from the body
        const { key, type, user_id, notes } = req.body
        const newChord = { key, type, user_id }

        for (const [key, value] of Object.entries(newChord))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        //to do: validate the notes
        let chord;
        ChordsService.insertChord(req.app.get('db'), newChord)
            .then(_chord => {
               
                chord = _chord
                
                const notesWithChordId = notes.map(note => {
                    return { ...note, chord_id: chord.id }
                })
                
                return ChordsService.insertNotesForChord(req.app.get('db'), notesWithChordId)
            })
            .then(notesResponse => {
                // console.log(chord)
           
                //before sending response, insert all 6 notes. 
                // console.log(notesResponse)
                res 
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${chord.id}`))
                    .json(ChordsService.serializeChord({ ...chord, notes: notesResponse }))
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