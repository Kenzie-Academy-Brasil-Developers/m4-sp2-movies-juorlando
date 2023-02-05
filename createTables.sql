CREATE DATABASE movie_db;
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL
);

INSERT INTO
movies (name, description, duration, price)
VALUES
('Exterminador do Futuro', 'Androide malvado do futuro', 120, 22);

SELECT * FROM movies;

UPDATE movies SET 
name = 'O Voo do Drgão',
description = 'Bruce lee movie',
duration = 90,
price = 8
WHERE 
id = 5
RETURNING *;

DELETE FROM movies 
WHERE id = 7;