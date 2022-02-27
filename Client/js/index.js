const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];

toggleButton.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

const buttonTrailer = document.querySelector("button");
const buttonTrailerPlay = document.querySelector("i");
buttonTrailer.addEventListener('mouseover', () => {
  buttonTrailer.classList.add('button-darken')
  buttonTrailerPlay.classList.add('button-darken')
})

buttonTrailer.addEventListener('mouseout', () => {
  buttonTrailer.classList.remove('button-darken')
  buttonTrailerPlay.classList.remove('button-darken')
})
