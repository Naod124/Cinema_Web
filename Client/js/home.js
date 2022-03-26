function home() {
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



console.log(myCarousel);
  $(document.getElementsByClassName("home-h1")).html('INTERSTELLAR');
  $(document.getElementsByClassName("home-h2")).html('ADVENTURE | SCI-FI');

  $("#movie-carousel").on('slide.bs.carousel', function (event) {
    if ($(event.from)[0] === undefined) {
      $(document.getElementsByClassName("home-h1")).html('INTERSTELLAR');
      $(document.getElementsByClassName("home-h2")).html('ADVENTURE | SCI-FI');
    }

    if ($(event.from)[0] === 1) {
      $(document.getElementsByClassName("home-h1")).html('1917');
      $(document.getElementsByClassName("home-h2")).html('WAR | DRAMA');
    }

    if ($(event.from)[0] === 2) {
      $(document.getElementsByClassName("home-h1")).html('THE REVENANT');
      $(document.getElementsByClassName("home-h2")).html('WESTERN | DRAMA');
    }
  });
}
