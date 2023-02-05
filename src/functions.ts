import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { iMovies, iMoviesResult } from "./interfaces";

const readMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT
        *
    FROM 
        movies
    `;
  const queryResult: iMoviesResult = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const insertMovie = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const newMovie: iMovies = request.body;

    const queryString: string = `
          INSERT INTO 
            movies (name, description, duration, price)
          VALUES 
            ($1, $2, $3, $4)
          RETURNING 
            *;
          `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [
        newMovie.name,
        newMovie.description,
        newMovie.duration,
        newMovie.price,
      ],
    };

    const queryResult: iMoviesResult = await client.query(queryConfig);

    return response.status(201).json(queryResult.rows[0]);
  } catch (error) {
    return response.status(409).json({ message: "Movie already exists" });
  }
};

const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const newMovieInfo: iMovies = request.body;

    const id: number = parseInt(request.params.id);

    const movieNewValues = Object.values(newMovieInfo);

    const queryString: string = `
      UPDATE 
          movies
      SET
          name = $1,
          description = $2,
          duration = $3,
          price = $4
      WHERE
          id = $5
      RETURNING
          *
      `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [...movieNewValues, id],
    };

    const queryResult: iMoviesResult = await client.query(queryConfig);

    return response.status(200).json(queryResult.rows[0]);
  } catch (error) {
    return response.status(409).json({ message: "Movie already exists" });
  }
};

const deleteMovie = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    DELETE FROM
        movies
    WHERE
        id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig)
  return response.status(204).send();
};

export { readMovies, insertMovie, updateMovie, deleteMovie };
