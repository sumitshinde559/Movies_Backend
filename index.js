const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Movie = require("./models/movie.models");
const { error } = require("console");
initializeDatabase();

app.get("/", (req, res) => {
  res.send("This is Express Server.");
});

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    console.log("New Movie data:", saveMovie);
    return saveMovie;
  } catch (error) {
    throw error;
  }
}

app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie." });
  }
});

//find a movie with a particular title
async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    console.log(movie);
    return movie;
  } catch (error) {
    throw error;
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// to get all movies from the database

async function readAllMovies() {
  try {
    const allMovies = await Movie.find();
    console.log(allMovies);
    return allMovies;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await readAllMovies();
    if (allMovies.length != 0) {
      res.json(allMovies);
    } else {
      res.status(404).json({ error: "No Movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

//get movie by director name

async function readByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    console.log(movieByDirector);
    return movieByDirector;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

async function readByGenre(genreName) {
  try {
    const moviesByGenre = await Movie.find({ genre: genreName });
    console.log(moviesByGenre);
    return moviesByGenre;
  } catch (error) {
    console.log(error);
  }
}

app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const moviesByGenre = await readByGenre(req.params.genreName);
    if (moviesByGenre.length != 0) {
      res.json(moviesByGenre);
    } else {
      res.status(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

//Delete function and api route
async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res
        .status(200)
        .json({ message: "Movie deleted successfully.", movie: deletedMovie });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });

    console.log(updatedMovie);
    return updatedMovie;
  } catch (error) {
    console.log("Error in updating Movie rating", error);
  }
}

// updateMovie("66162fdc7f2872494a4ea9b2", { releaseYear: 2002 })

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updateMovie) {
      res.status(200).json({
        message: "Movie updated successfully.",
        updatedMovie: updatedMovie,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie." });
  }
});
//PORT Assignment

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
