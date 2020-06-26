const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

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

    describe.only('GET /api/chords', () => {
        context(`Given chords`, () => {

            beforeEach('insert chord', () => 
                helpers.seedChordsTables(
                    db, testUsers, testChords, testNotes, testFavorites
                )
            )
            
            it(`responds with 200 and all of the chords`, () => {
                const expectedChords = testChords.map(chord => 
                    helpers.makeExpectedChord(testUsers, chord, testNotes)
                )
                return supertest(app)
                    .get('/api/chords')
                    .expect(200, expectedChords)

            })
            
           
        })
    }) 

    describe('POST /api/chords', () => {
        
        beforeEach('insert chord', () => 
        helpers.seedChordsTables(
            db, testUsers, testChords, testNotes, testFavorites
        )
    )

        it(`submits a chord, responding with 201 and the new chord`, function () {
            const testChord = testChords[0]
            const testUser = testUsers[0]
            const newChord = {
                key: testChord.key,
                type: testChord.type,
                user_id: testChord.user_id,
                notes: [
                    {
                        string: 1,
                        fret: 3,
                        finger: 4,
                        strummed: true,                       
                    },
                    {
                        string: 2,
                        fret: 3,
                        finger: 4,
                        strummed: true,                       
                    },
                    {
                        string: 3,
                        fret: 3,
                        finger: 4,
                        strummed: true,                       
                    },
                    {
                        string: 4,
                        fret: 3,
                        finger: 4,
                        strummed: true,                       
                    },
                    {
                        string: 5,
                        fret: 3,
                        finger: 4,
                        strummed: true,                       
                    },
                    {
                        string: 6,
                        fret: 3,
                        finger: 4,
                        strummed: false,                       
                    }
                ]
            }
            return supertest(app)
                .post('/api/chords')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newChord)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('key')
                    expect(res.body).to.have.property('type')
                    expect(res.body).to.have.property('user_id')
                    expect(res.body).to.have.property('notes')
                })
                .expect(res => 
                    db
                        .from('chords')
                        .select('*')
                        .where({ id: res.body.id })
                        .then(row => {
                            console.log(row)
                        })
                    )
        })
          
    })
   
    describe('GET /api/chords/chord_id', () => {
        beforeEach('insert chord', () => 
        helpers.seedChordsTables(
            db, testUsers, testChords, testNotes, testFavorites
        )
    )
        it('responds with 200 and the specified chord', () => {
            const chordId = 2
            const expectedChord = helpers.makeExpectedChord(
                testUsers,
                testChords[chordId - 1],
                testNotes
            )
            return supertest(app)
                .get(`/api/chords/${chordId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedChord)
        })
    })


})
