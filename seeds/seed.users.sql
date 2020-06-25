TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, first_name, last_name, email) VALUES
    ('best-ever', '$2a$12$CSRFy9hE8S.yMyVd.6xIGOJJjPIN3fVlPcdeOoiOIBicHsoX49yRy', 'Jimi', 'Hendrix', 'jhendrix@gmail.com'),
    ('slow-hand', '$2a$12$CSRFy9hE8S.yMyVd.6xIGOJJjPIN3fVlPcdeOoiOIBicHsoX49yRy', 'Eric', 'Clapton', 'eclapton@gmail.com'),
    ('king-of-blues', '$2a$12$CSRFy9hE8S.yMyVd.6xIGOJJjPIN3fVlPcdeOoiOIBicHsoX49yRy', 'B.B', 'King', 'bbking@gmail.com'),
    ('jmayer', '$2a$12$CSRFy9hE8S.yMyVd.6xIGOJJjPIN3fVlPcdeOoiOIBicHsoX49yRy', 'John', 'Mayer', 'jmayer@gmail.com');

