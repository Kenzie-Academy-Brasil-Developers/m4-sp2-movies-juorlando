import { QueryResult } from "pg";

interface iMovies {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface Pagination {
  prevPage: string | null;
  nextPage: string | null;
  count: number;
  data: iMovies[];
}

type iMoviesResult = QueryResult<iMovies>

export {iMovies, iMoviesResult, Pagination}