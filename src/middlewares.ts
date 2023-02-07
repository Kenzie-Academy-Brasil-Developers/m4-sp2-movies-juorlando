import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { iMoviesResult } from "./interfaces";

const ensureMovieExist =async (request:Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const id: number = parseInt(request.params.id)

    const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE
        id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: iMoviesResult = await client.query(queryConfig)

    if(!queryResult.rowCount){
        return response.status(404).json({ message: "Movie not found."})
    }

    return next()
}

export {ensureMovieExist}