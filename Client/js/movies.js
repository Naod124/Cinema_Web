const API_KEY = "api_key=220a900ff9c233e9bc7b4e8a35ed424a&page=3";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w1280";
const MOVIES_IN_THEATER =
  "/discover/movie?primary_release_date.gte=2022-01-01&primary_release_date.lte=2022-03-03&";
const DISCOVER_API = BASE_URL + MOVIES_IN_THEATER + API_KEY;

const main = document.getElementById("main");

// Get movies using The Movie Database (TMDB) API
getMovies(DISCOVER_API);

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  displayMovies(data.results);
}

function displayMovies(movies) {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path } = movie;

    const div = document.createElement("div");
    div.classList.add("movie");

    div.addEventListener("click", (e) => {
      console.log(e.target);
    });

    div.innerHTML = `
            <img src="${IMAGE_URL + poster_path}" alt="${title}">
            <div class="movie-info">
          </div>
        `;
    main.append(div);
  });
}
