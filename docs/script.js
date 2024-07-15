const drawer = document.getElementById("drawer");
const drawerBtn = document.getElementById("drawer-btn");
const moviesContainer = document.querySelector(".moviesContainer");
const homeBackground = document.querySelector(".bg-home");
const cards = document.querySelectorAll(".card");
const tabs = document.querySelectorAll("#menu li");

drawerBtn.addEventListener("click", () => {
  drawer.classList.toggle("md:left-0");
  drawer.classList.toggle("left-0");
  if (drawer.classList.contains("left-0")) {
    drawerBtn.classList.add("text-secondary");
  } else {
    drawerBtn.classList.remove("text-secondary");
  }
});

const API_key = "444649e48a1ca7f83d87af64e74be009";

const baseUrl = "https://api.themoviedb.org/3";
const nowPlayingMoviesEndpoint = `${baseUrl}/movie/now_playing?api_key=${API_key}`;
const popularMoviesEndpoint = `${baseUrl}/movie/popular?api_key=${API_key}`;
const trendingMoviesEndpoint = `${baseUrl}/trending/movie/day?api_key=${API_key}`;
const upcomingMoviesEndpoint = `${baseUrl}/movie/upcoming?api_key=${API_key}`;
const topRatedMoviesEndpoint = `${baseUrl}/movie/top_rated?api_key=${API_key}`;
const searchMovieEndpoint = `${baseUrl}/search/movie?api_key=${API_key}&query=`;

//dynamic
const movieDetailsEndpoint = (id) =>
  `${baseUrl}/movie/${id}?api_key=${API_key}`;
const movieCreditsEndpoint = (id) =>
  `${baseUrl}/movie/${id}/credits?api_key=${API_key}`;
const similarMoviesEndpoint = (id) =>
  `${baseUrl}/movie/${id}/similar?api_key=${API_key}`;

const IMG500 = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;

const IMG342 = (path) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : null;

const IMG185 = (path) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : null;

fetchMovieDetails = async (movieId) => {
  const res = await fetch(movieDetailsEndpoint(movieId || 389));
  const movie = await res.json();
  const poster = document.querySelector(".details img");
  const title = document.querySelector(".details h2");
  const overview = document.querySelector(".details p");
  const homepage = document.querySelector(".details a");
  const info = document.querySelector(".details .info");
  poster.src = IMG500(movie.poster_path);
  title.textContent = movie.title;
  overview.textContent = movie.overview;
  homepage.href = movie.homepage;
  info.innerHTML = `
    <div class="genres flex gap-3 md:text-base">
    </div>
    `;
  movie.genres.map((genre) => {
    const genr = document.createElement("div");
    genr.innerHTML = `
    <div class="flex  items-center gap-1 text-white/60 md:text-sm">
      <div class="md:h-1 md:w-1 h-[2px] w-[2px] rounded-full bg-secondary"></div>
      <div>${genre.name}</div>
      </div> `;
    const genres = document.querySelector(".genres");
    genres.appendChild(genr);
  });
};

fetchMovies = async (endpoint) => {
  const res = await fetch(endpoint);
  const data = await res.json();

  data.results.map((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("card", "cursor-pointer");
    movieCard.innerHTML = `
 
      <img  src="${IMG500(movie.poster_path)}"><img/>
   

<div class="bg-white/10 p-2 md:text-[10px] text-[6px] flex flex-col justify-between md:h-20 h-14">
  <div class="flex justify-between items-start">
    <h3 class="md:text-xs text-[8px]">${movie.title}</h3>
    <p class="text-secondary mt-[2px]">${new Date(
      movie.release_date
    ).getFullYear()}</p>
  </div>
  <div class="flex justify-between items-center">
    <p class="border-[1px] px-1 rounded-sm">${movie.original_language}</p>
    <div class="flex gap-1 justify-center items-center">
    <i class="fa-solid fa-star text-secondary"></i>
      <p>${movie.vote_average}</p>
    </div>
  </div>
</div>
  `;

    moviesContainer.appendChild(movieCard);
    movieCard.addEventListener("click", () => {
      localStorage.setItem("lastMovie", JSON.stringify(movie));
      homeBackground.src = IMG500(movie.backdrop_path);
      fetchMovieDetails(movie.id || 389);
    });
  });
};

fetchMovies(nowPlayingMoviesEndpoint);
const lastMovie = JSON.parse(localStorage.getItem("lastMovie"));
homeBackground.src = IMG500(lastMovie.backdrop_path);

const menuFunctions = [
  {
    title: "now",
    function: () => fetchMovies(nowPlayingMoviesEndpoint),
  },
  {
    title: "popular",
    function: () => fetchMovies(popularMoviesEndpoint),
  },
  {
    title: "top rated",
    function: () => fetchMovies(topRatedMoviesEndpoint),
  },
  {
    title: "upcoming",
    function: () => fetchMovies(upcomingMoviesEndpoint),
  },
  {
    title: "trending",
    function: () => fetchMovies(trendingMoviesEndpoint),
  },
];

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    menuFunctions.map((menuFunction) => {
      drawer.classList.remove("md:left-0", "left-0");
      if (drawer.classList.contains("left-0")) {
        drawerBtn.classList.add("text-secondary");
      } else {
        drawerBtn.classList.remove("text-secondary");
      }
      if (
        tab.innerHTML.toLocaleLowerCase() ===
        menuFunction.title.toLocaleLowerCase()
      ) {
        moviesContainer.innerHTML = "";
        menuFunction.function();
      }
    });
  });
});

searchMovies = async (title) => {
  const res = await fetch(
    `${baseUrl}/search/movie?api_key=${API_key}&query=${title}`
  );
  const data = await res.json();
  data.results.map((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("card");
    movieCard.innerHTML = `
  <img src="${IMG185(movie.poster_path)}"><img/>
<div class="bg-white/10 p-2 md:text-[10px] text-[6px] flex flex-col justify-between md:h-20 h-14">
  <div class="flex justify-between items-start">
    <h3 class="md:text-xs text-[8px]">${movie.title}</h3>
    <p class="text-secondary mt-[2px]">${new Date(
      movie.release_date
    ).getFullYear()}</p>
  </div>
  <div class="flex justify-between items-center">
    <p class="border-[1px] px-1 rounded-sm">${movie.original_language}</p>
    <div class="flex gap-1 justify-center items-center">
    <i class="fa-solid fa-star text-secondary"></i>
      <p>${movie.vote_average}</p>
    </div>
  </div>
</div>
  `;

    moviesContainer.appendChild(movieCard);
    movieCard.addEventListener("click", () => {
      localStorage.setItem("lastMovie", JSON.stringify(movie));
      homeBackground.src = IMG500(movie.backdrop_path);
      fetchMovieDetails(movie.id);
    });
  });
};

const searchInput = document.querySelector(".search");

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.trim();
  if (searchText.length >= 3) {
    moviesContainer.innerHTML = "";
    searchMovies(searchText)
      ? searchMovies(searchText)
      : fetchMovies(nowPlayingMoviesEndpoint);
  }
});

lastMovie ? fetchMovieDetails(lastMovie.id) : fetchMovieDetails(389);

//form validation

document.querySelector("form").addEventListener("submit", function (event) {
  let isValid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const age = document.getElementById("age");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const nameMsg = document.getElementById("nameMsg");
  const emailMsg = document.getElementById("emailMsg");
  const phoneMsg = document.getElementById("phoneMsg");
  const ageMsg = document.getElementById("ageMsg");
  const passwordMsg = document.getElementById("passwordMsg");
  const confirmPasswordMsg = document.getElementById("confirmPasswordMsg");

  if (name.value.trim() === "") {
    nameMsg.innerHTML = "Name is required";
    isValid = false;
  } else {
    nameMsg.innerHTML = "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    emailMsg.innerHTML = "Ivalide email";
    isValid = false;
  } else {
    emailMsg.innerHTML = "";
  }

  const phonePattern = /^\+?(\d.*){3,}$/;
  if (phone.value.trim() === "") {
    phoneMsg.innerHTML = "Phone number is required";
    isValid = false;
  } else if (!phonePattern.test(phone.value)) {
    phoneMsg.innerHTML = "Invalide phone number";
    isValid = false;
  } else {
    phoneMsg.innerHTML = "";
  }

  if (age.value.trim() === "") {
    ageMsg.innerHTML = "Age is required";
    isValid = false;
  } else {
    ageMsg.innerHTML = "";
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
  if (!passwordPattern.test(password.value)) {
    passwordMsg.innerHTML = "Invalide password";
    isValid = false;
  } else {
    passwordMsg.innerHTML = "";
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordMsg.innerHTML = "Passwords do not match";
    isValid = false;
  } else {
    confirmPasswordMsg.innerHTML = "";
  }

  if (!isValid) {
    event.preventDefault();
  } else {
    alert("Thank you for your registration!");
  }
});

const passwordbtn = document.getElementById("passwordbtn");

passwordbtn.addEventListener("click", () => {
  const PasswordField = document.getElementById("password");

  if (PasswordField.type === "password") {
    PasswordField.type = "text";
    passwordbtn.classList.add("text-secondary");
  } else {
    PasswordField.type = "password";
    passwordbtn.classList.remove("text-secondary");
  }
});

const confirmbtn = document.getElementById("confirmbtn");

confirmbtn.addEventListener("click", () => {
  const confirmPasswordField = document.getElementById("confirmPassword");

  if (confirmPasswordField.type === "password") {
    confirmPasswordField.type = "text";
    confirmbtn.classList.add("text-secondary");
  } else {
    confirmPasswordField.type = "password";
    confirmbtn.classList.remove("text-secondary");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector("nav");

  window.addEventListener("scroll", () => {
    console.log("Scroll detected:", window.scrollY);
    if (window.scrollY > 50) {
      navbar.classList.add("bg-black");
    } else {
      navbar.classList.remove("bg-black");
    }
  });
});
