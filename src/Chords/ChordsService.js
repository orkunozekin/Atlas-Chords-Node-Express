const ChordsService = {
    getAllChords(db) {
        return db  
            .from('chords')
            .select('*')    
    },

    getById(db, id) {
        return db
            .from('chords')
            .select(
                'chords.id',
                'chords.key',
                'chords.type',
                'chords.user_id',
                db.raw(
                    `row_to_json(
                        (SELECT tmp FROM (
                            SELECT 
                                usr.id,
                                usr.username,
                                usr.password,
                                usr.first_name,
                                usr.last_name,
                                usr.email
                        ) tmp)
                    ) AS "user"`
                )
            )
            .leftJoin(
                `users AS usr`,
                'chords.user_id',
                'usr.id',
            )
            .where('chords.id', id)
            .first()
    },

    insertChord(db, newChord) {
        return db
            .into('chords')
            .insert(newChord)
            .returning('*')
            .then(([chord]) => chord)
            .then(chord => 
                ChordsService.getById(db, chord.id)
                )
    },

    serializeChord(chord) {
        return {
            id: chord.id,
            key: chord.key,
            type: chord.type,
            user_id: chord.user_id,
            // user: chord.user || {}
        }
    }
}






module.exports = ChordsService