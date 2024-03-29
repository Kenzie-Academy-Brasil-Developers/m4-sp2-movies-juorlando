import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "./database";
import { iMovies, iMoviesResult, Pagination } from "./interfaces";

const readMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let page = Number(request.query.page) || 1;
  let perPage = Number(request.query.perPage) || 5;

  const queryString: string = `
    SELECT
        *
    FROM 
        movies
    LIMIT $1 OFFSET $2
    `;

  const queryCount: string = `
    SELECT 
        COUNT(*)
    FROM
        movies
    WHERE
        id > 0
    `;

  const queryCountResult: any = await client.query(queryCount);

  const countResult = queryCountResult.rows[0].count;

  const baseUrl: string = `http://localhost:3000/movies`;
  let prevPage: string | null = `${baseUrl}?page=${
    page - 1
  }&perPage=${perPage}`;
  let nextPage: string | null = `${baseUrl}?page=${
    page + 1
  }&perPage=${perPage}`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage, perPage * (page - 1)],
  };

  const queryResult: iMoviesResult = await client.query(queryConfig);

  perPage * page >= countResult
    ? (nextPage = null)
    : (nextPage = `${baseUrl}?page=${page - 1}&perPage=${perPage}`);

  page === 1
    ? (prevPage = null)
    : (prevPage = `${baseUrl}?page=${page - 1}&perPage=${perPage}`);

  const pagenation: Pagination = {
    prevPage,
    nextPage,
    count: queryResult.rowCount,
    data: queryResult.rows,
  };

  if (pagenation.count === 0) {
    return response.status(404).json({ message: "Page not found!" });
  }

  return response.status(200).json(pagenation);
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
  } catch (error: any) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return response.status(409).json({
        message: "Movie already exists!",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
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
  } catch (error: any) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return response.status(409).json({
        message: "Movie already exists!",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateMoviePartial = async (
  request: Request,
  response: Response
): Promise<Response | void> => {
  try {
    const id: number = parseInt(request.params.id);
    const movieData = Object.values(request.body);
    const movieKeys = Object.keys(request.body);

    const queryString: string = format(
      `
              UPDATE 
                  movies
              SET (%I) = ROW (%L)
              WHERE
                  id = $1
              RETURNING 
                  *;
              `,
      movieKeys,
      movieData
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: iMoviesResult = await client.query(queryConfig);

    return response.status(200).json(queryResult.rows[0]);
  } catch (error: any) {
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return response.status(409).json({
        message: "Movie already exists!",
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
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
  await client.query(queryConfig);
  return response.status(204).send();
};

export {
  readMovies,
  insertMovie,
  updateMovie,
  updateMoviePartial,
  deleteMovie,
};
