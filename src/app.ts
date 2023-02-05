import express, { Application, json } from "express";
import { startDatabase } from "./database";
import { deleteMovie, insertMovie, readMovies, updateMovie } from "./functions";
import { ensureMovieExist } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.get("/movies", readMovies)
app.post("/movies", insertMovie)
app.patch("/movies/:id", ensureMovieExist, updateMovie)
app.delete("/movies/:id", ensureMovieExist, deleteMovie)

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is Running");
});
