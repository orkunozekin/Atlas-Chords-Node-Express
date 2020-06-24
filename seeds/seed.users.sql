TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, first_name, last_name, email) VALUES
    ('best-ever', 'purplehaze', 'Jimi', 'Hendrix', 'jhendrix@gmail.com'),
    ('slow-hand', 'layla', 'Eric', 'Clapton', 'eclapton@gmail.com'),
    ('king-of-blues', 'thrillisgone', 'B.B', 'King', 'bbking@gmail.com'),
    ('jmayer', 'gravity', 'John', 'Mayer', 'jmayer@gmail.com');

