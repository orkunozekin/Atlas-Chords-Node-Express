const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'JohnFru',
            password: 'password1',
            first_name: 'John',
            last_name: 'Frusciante',
            email: 'johnfru@gmail.com'
        },
        {
            id: 2,
            username: 'JohnMay',
            password: 'password2',
            first_name: 'John',
            last_name: 'Mayer',
            email: 'johnmay@gmail.com'
        },
        {
            id: 3,
            username: 'DaveMatt',
            password: 'password3',
            first_name: 'Dave',
            last_name: 'Matthews',
            email: 'davematthews@gmail.com'
        },
        {
            id: 4,
            username: 'JohnFru',
            password: 'password1',
            first_name: 'John',
            last_name: 'Frusciante',
            email: 'johnfru@gmail.com'
        },
    ]
}

function makeChordsArray(users) {
    return [
        {
            id: 1,
            key: 'A',
            type: 'Major',
            user_id: users[0].id
        },
        {
            id: 2,
            key: 'C',
            type: 'Minor',
            user_id: users[1].id
        },
        {
            id: 3,
            key: 'D',
            type: 'Major',
            user_id: users[2].id
        },
        {
            id: 4,
            key: 'E',
            type: 'Major',
            user_id: users[3].id
        },
    ]
}

function makeNotesArray(chords) {
    return [
        {
            id: 1,
            string: 2,
            fret: 2,
            finger: 3,
            strummed: true,
            chord_id: chords[0].id
        },
        {   
            id: 2,
            string: 1,
            fret: 3,
            finger: 2,
            strummed: true,
            chord_id: chords[1].id
        },
        {   
            id: 3,
            string: 5,
            fret: null,
            finger: null,
            strummed: false,
            chord_id: chords[2].id
        },
        {   
            id: 4,
            string: 3,
            fret: 2,
            finger: 3,
            strummed: true,
            chord_id: chords[3].id
        },
    ]
}

function makeFavoritesArray(chords, user) {
    return [
        {
            id: 1,
            chord_id: chords[0].id,
            user_id: user[0].id
        },
        {
            id: 2,
            chord_id: chords[1].id,
            user_id: user[1].id
        },
        {
            id: 3,
            chord_id: chords[2].id,
            user_id: user[2].id
        },
        {
            id: 4,
            chord_id: chords[3].id,
            user_id: user[3].id
        },
    ]
}

function makeChordsFixtures() {
    const testUsers = makeUsersArray()
    const testChords = makeChordsArray(testUsers)
    const testNotes = makeNotesArray(testChords)
    const testFavorites = makeFavoritesArray(testChords, testNotes)
    return { testUsers, testChords, testNotes, testFavorites }
}



function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        users,
        chords,
        musical_notes,
        favorites
        RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() => {
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id]
            )
        })
}

function seedChordsTables(db, users, chords, notes, favorites = []) {
    return db.transaction(async trx => {
  
      await seedUsers(trx, users)
  
      await trx.into('chords').insert(chords)
      await trx.into('musical_notes').insert(notes)
      await trx.into('favorites').insert(favorites)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('chords_id_seq', ?)`,
        [chords[chords.length - 1].id],
      )
    })
  }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.username,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
}
  
function makeExpectedChord(users, chord, notes) {
    const user = users.find(user => user.id === chord.user_id)

    // const notesOfChords = notes.filter(note => note.chord_id === chord.id)

    return {
        id: chord.id,
        key: chord.key,
        type: chord.type,
        user_id: chord.user_id,
        // user: {
        //     id: user.id,
        //     username: user.username,
        //     password: user.password,
        //     first_name: user.first_name,
        //     last_name: user.last_name,
        //     email: user.email

        // },
    }
}

function makeExpectedNote(notes) {
    return {
        id: notes.id,
        string: notes.string,
        fret: notes.fret,
        finger: notes.finger,
        strummed: notes.strummed,
        chord_id: notes.chord_id
    }
}
  
module.exports = {
    cleanTables,
    seedUsers,
    makeUsersArray,
    makeChordsArray,
    makeNotesArray,
    makeChordsFixtures,
    makeAuthHeader,
    seedChordsTables,
    makeExpectedChord,
    makeExpectedNote
}