module.exports = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DB_URL || 'postgresql://postgres@localhost/atlas_chords',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/atlas_chords_test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
}