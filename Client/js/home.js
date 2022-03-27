function home() {
  const buttonTrailer = document.getElementById("trailer");
  const buttonTrailerPlay = document.getElementById("icon");

  //home page watch trailer button animation
  buttonTrailer.addEventListener('mouseover', () => {
    buttonTrailer.classList.add('button-darken');
    buttonTrailerPlay.classList.add('button-darken');
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
async function renderHomeMovies(){
  let results = {}
  try{
    results = await (await fetch("/api/movies")).json();

  }
  catch(ignore){

  }
  console.log(results);
  let html='';
  html += '<div class="container-flex">';
  for (const iterator of results) {
     html += '<div class="row">';
    html+='<div class="col-lg-6 col-sm-12 ">'
     html += '<div class="justify-content-center">';
     html += '<img src= "';
     html += iterator.images;
     html += '" width="100%" height="auto">';
     html += '<p>Title: ';
     html += iterator.title;
     html+= '</p>'
     html += '<p>Director: ';
     html += iterator.director;
     html+= '</p>'
     html += '<p>Rating: ';
     html += iterator.rating;
     html+= '</p>'
     html += '<p>Description: ';
     html += iterator.desc;
     html+= '</p>'
     html += '<p>Duration: ';
     html += iterator.duration;
     html+= '</p>'
     html+='<button type="button" class="btn customButton href="';
     html+=iterator.trailer;
     html+= '">Show trailer</button>'
     html+='</div></div>'
  }
  html+='</div>';
  document.querySelector('.movie-list').innerHTML=html;
  
}

renderHomeMovies();
