TRUNCATE musical_notes RESTART IDENTITY CASCADE;

INSERT INTO musical_notes (string, fret, finger, strummed, chord_id) VALUES
    (1, 0, null, true, 1),
    (2, 2, 4, true, 1),
    (3, 2, 3, true, 1),
    (4, 2, 2, true, 1),
    (5, 0, null, true, 1),
    (6, null, null, false, 1);
 

