let link = 'https://www.youtube.com/watch?v=2LqzF5WauAw';
function home() {
  const buttonTrailer = document.getElementById("trailer");
  const buttonTrailerPlay = document.getElementById("icon");

  //home page watch trailer button animation
  buttonTrailer.addEventListener('mouseover', () => {
    buttonTrailer.classList.add('button-darken');
    buttonTrailerPlay.classList.add('button-darken');
  })
  buttonTrailer.addEventListener('click', () => {
    window.open(link, '_blank');
  })

  buttonTrailer.addEventListener('mouseout', () => {
    buttonTrailer.classList.remove('button-darken');
    buttonTrailerPlay.classList.remove('button-darken');
  })


  $(document.getElementsByClassName("home-h1")).html('INTERSTELLAR');
  $(document.getElementsByClassName("home-h2")).html('ADVENTURE | SCI-FI');

  $("#movie-carousel").on('slide.bs.carousel', function (event) {
    if ($(event.from)[0] === undefined) {
      $(document.getElementsByClassName("home-h1")).html('INTERSTELLAR');
      $(document.getElementsByClassName("home-h2")).html('ADVENTURE | SCI-FI');
      link = 'https://www.youtube.com/watch?v=2LqzF5WauAw';

    }

    if ($(event.from)[0] === 1) {
      $(document.getElementsByClassName("home-h1")).html('1917');
      $(document.getElementsByClassName("home-h2")).html('WAR | DRAMA');
      link = 'https://www.youtube.com/watch?v=YqNYrYUiMfg';
    }

    if ($(event.from)[0] === 2) {
      $(document.getElementsByClassName("home-h1")).html('THE REVENANT');
      $(document.getElementsByClassName("home-h2")).html('WESTERN | DRAMA');
      link = 'https://www.youtube.com/watch?v=LoebZZ8K5N0';
    }
  });
}
async function renderHomeMovies(){
  let results = {}
  try{
    results = await (await fetch("/api/movies")).json();

  }
  catch(ignore){

  }
  console.log(results);
  let html='';
 
   
  for (const iterator of results) {
    html+='<div class="col-lg-6 col-md-6 col-sm-12">'
     html += '<img src= "';
     html += iterator.images;
     html += '" width="100%" height="auto">';
     html += '<h4 id="yellow">Title: </h4><p>';
     html += iterator.title;
     html+= '</p>'
     html += '<h4 id="yellow">Director:</h4><p>';
     html += iterator.director;
     html+= '</p>'
     html += '<h4 id="yellow">Rating: </h4><p>';
     html += iterator.rating;
     html+= '</p>'
     html += '<h4 id="yellow">Description: </h4><p>';
     html += iterator.desc;
     html+= '</p>'
     html += '<h4 id="yellow">Duration: </h4><p>';
     html += iterator.duration;
     html+= '</p>'
     html += '<h4 id="yellow">Trailer link: </h4><p>';
     html+= '<a href="';
     html+= iterator.trailer;
     html+='">Trailer</a></p></div>';
  }
 
  document.querySelector('.movie-list').innerHTML=html;

}

renderHomeMovies();
