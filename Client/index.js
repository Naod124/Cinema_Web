const toggleButton = document.getElementsByClassName("toggle-button")[0];
const navbarLinks = document.getElementsByClassName("navbar-links")[0];

toggleButton.addEventListener("click", () => {
  navbarLinks.classList.toggle("active");
});

const buttonTrailer = document.querySelector("button");
const buttonTrailerPlay = document.querySelector("i");

//home page watch trailer button animation
buttonTrailer.addEventListener('mouseover', () => {
  buttonTrailer.classList.add('button-darken');
  buttonTrailerPlay.classList.add('button-darken');
})

buttonTrailer.addEventListener('mouseout', () => {
  buttonTrailer.classList.remove('button-darken');
  buttonTrailerPlay.classList.remove('button-darken');
})

var myCarousel = document.getElementsByClassName('movie-carousel')
var carousel = new bootstrap.Carousel(myCarousel, {
  interval: 4000,
  wrap: true
})

$("h1").html('INTERSTELLAR');
$("h2").html('ADVENTURE | SCI-FI');

$("#movie-carousel").on('slide.bs.carousel', function (event) {
  if ($(event.from)[0] === undefined) {
    $("h1").html('INTERSTELLAR');
    $("h2").html('ADVENTURE | SCI-FI');
  }

  if ($(event.from)[0] === 1) {
    $("h1").html('1917');
    $("h2").html('WAR | DRAMA');
  }

  if ($(event.from)[0] === 2) {
    $("h1").html('THE REVENANT');
    $("h2").html('WESTERN | DRAMA');
  }
})