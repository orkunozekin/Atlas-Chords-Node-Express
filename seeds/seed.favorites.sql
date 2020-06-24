TRUNCATE favorites RESTART IDENTITY CASCADE;

INSERT INTO favorites(user_id, chord_id) VALUES
    (1, 1)