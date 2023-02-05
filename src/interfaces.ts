import { QueryResult } from "pg";

interface iMovies {
  name: string;
  description: string;
  duration: number;
  price: number;
}

type iMoviesResult = QueryResult<iMovies>

export {iMovies, iMoviesResult}