CREATE TABLE chords (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    key TEXT NOT NULL,
    type TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
