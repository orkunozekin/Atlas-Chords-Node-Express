const ChordsService = {
    getAllChords(db) {
        return db  
            .from('chords')
            .select('*')    
    }
}






module.exports = ChordsService