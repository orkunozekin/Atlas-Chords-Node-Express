const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Chords Endpoints', function () { //happy paths only
    let db

    const {
        testUsers,
        testChords,
        testNotes,
        testFavorites
    } = helpers.makeChordsFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

//     describe(`Protected endpoints`, () => {
//         beforeEach('insert chords', () => 
//         helpers.seedChordsTables(
//             db,
//             testUsers,
//             testChords,
//             testNotes,
//             testFavorites
//         )
      
//         )
        
//         const protectedEndpoints = [
//             {
//                 name: 'GET /api/chords/chord_id',
//                 path: '/api/chords/1'
//             },
//             {
//                 name: 'GET /api/'
//             }
//         ]
// })
    
    //Endpoints : /api/chords        /api/chords/chord_id(for a viewing a single chord)

    describe('GET /api/chords', () => {
        context(`Given chords`, () => {
            beforeEach('insert chord', () => 
                helpers.seedChordsTables(
                    db, testUsers, testChords, testNotes, testFavorites
                )
            )
            it.only(`responds with 200 and all of the chords`, () => {
                const expectedChords = testChords.map(chord => 
                    helpers.makeExpectedChord(testUsers, chord, testNotes)
                )
                return supertest(app)
                    .get('/api/chords')
                    .expect(200, expectedChords)

           })
        })
   }) 


})
