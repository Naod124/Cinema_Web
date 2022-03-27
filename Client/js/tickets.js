
function tickets() {
  const price = document.getElementById("price"),
    seatContainer = document.querySelector(".seat-container"),
    seats = document.querySelectorAll(".row .seat:not(.taken)"),
    cart = document.querySelector(".fa-shopping-cart"),
    seatCount = document.getElementById("seat-count"),
    totalPrice = document.getElementById("total-price"),
    shoppingCart = document.getElementById("shopping-cart"),
    closeBtn = document.querySelector(".close-btn"),
    buyBtn = document.querySelector(".buy-btn"),
    theatre = document.getElementById("theatre");;

  let ticketPrice = +price.value;
  let selectedSeats = [];
  let cinemaId = 1;
  let saloonId = undefined;
  // movie id needs to be fetched from movies/home page
  // for now it is not changing
  let movieId=1 ;
  let check = false;

  function updateSelectedSeat() {
    selectedSeats = document.querySelectorAll(".row .seat.selected");
    const seatsIndex = [...selectedSeats].map(function (seat) {
      return [...seats].indexOf(seat);
    });

    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

    const numberOfSelectedSeats = selectedSeats.length;
    seatCount.innerText = numberOfSelectedSeats;
    totalPrice.innerText = numberOfSelectedSeats * ticketPrice;

    setTicketData(price.selectedIndex, price.value);
  }

  seatContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("seat") &&
      !e.target.classList.contains("taken")
    ) {
      e.target.classList.toggle("selected");

      updateSelectedSeat();
    }
  });

  cart.addEventListener("click", () => {
    shoppingCart.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    shoppingCart.classList.remove("show");
  });

  buyBtn.addEventListener("click", () => {
    shoppingCart.classList.remove("show");
    if (totalPrice.innerText > 0) {
      if (check != false) {
        saveTicketToDb();
      } else {
        alert("Screening not available for this movie!");
      }
    } else {
      alert("No seats selected!");
    }
  });

  price.addEventListener("change", (e) => {
    ticketPrice = +e.target.value;
    setTicketData(e.target.selectedIndex, e.target.value, undefined);
    updateSelectedSeat();
  });

  function setTicketData(ticketTypeIndex, ticketCost, reserved) {
    localStorage.setItem("selectedTicketTypeIndex", ticketTypeIndex);
    localStorage.setItem("selectedTicketPrice", ticketCost);
    localStorage.setItem("reservedPlace", reserved);
  }

  function populateUIFromLocalStorage() {
    selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
    if (selectedSeats !== null && selectedSeats.length > 0) {
      seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1) {
          seat.classList.add("selected");
        }
      });
    }
    const selectedTicketTypeIndex = localStorage.getItem(
      "selectedTicketTypeIndex"
    );

    if (selectedTicketTypeIndex !== null) {
      price.selectedIndex = selectedTicketTypeIndex;
    }

    const selectedTicketPrice = localStorage.getItem("selectedTicketPrice");

    if (selectedTicketPrice !== null) {
      price.value = selectedTicketPrice;
    }
  }



  // save ticket to the db
  function saveTicketToDb() {
    const url = "http://localhost:7777/api/tickets";

    const seatsIndex = [...selectedSeats].map(function (seat) {
      return [...seats].indexOf(seat);
    });
    let total = totalPrice.innerText;
    let date = dateControl.value.toString().slice(0, 5) + dateControl.value.toString().slice(6);
    let seatNum = seatsIndex.join("-");
    let cinemaId = theatre.value;
    let select1 = document.getElementById("selectMovie");
    let value1 = select1.options[select1.selectedIndex].value;
    movieId = value1;
    let jsonData = JSON.stringify({
      'date': date, 'seatNum': seatNum, 'totalPrice': total,
      'movieId': movieId, 'saloonId': saloonId, 'cinemaId': cinemaId
    });

    $.ajax({
      type: 'POST',
      contentType: "application/json; charset=utf-8",
      url: url,
      data: jsonData,
      cache: false,
      dataType: "json",
      jsonp: false,
      success: function (data, textStatus, jqXHR) {
        if (data == 0) {
          alert("You need to login to buy tickets!");
          window.location.href = "/signin";
        }
        else if (data == 1) {
          alert("Ticket bought successfully!");
          for (i = 0; i < selectedSeats.length; i++) {
            selectedSeats[i].classList.add('taken');
            selectedSeats[i].classList.remove('selected');
          }

          totalPrice.innerText = 0;
          selectedSeats.length = 0;
          localStorage.clear();
        }
      }
    });
  }

  // update the taken seats for particular screening
  function retrieveTakenSeats(date) {
    const url = "http://localhost:7777/api/takenSeats";

    cinemaId = theatre.value;

    let jsonData = JSON.stringify({
      'date': date, 'movieId': movieId, 'saloonId': saloonId, 'cinemaId': cinemaId
    });

    $.ajax({

      type: 'POST',
      contentType: "application/json; charset=utf-8",
      url: url,
      data: jsonData,
      cache: false,
      dataType: "json",
      jsonp: false,
      success: function (data, textStatus, jqXHR) {
        if (data == 0) {
          updateTakenSeats(data);
        }
        else if (data.length > 0) {
          updateTakenSeats(data);
        }
      }
    });
  }

  // check if the screening of the movie exists in the db
  function checkScreening() {
    const url = "http://localhost:7777/api/checkScreening";
    let theatreId = theatre.value;
    let date = dateControl.value.toString().slice(0, 5) + dateControl.value.toString().slice(6);
    let select1 = document.getElementById("selectMovie");
    let value1 = select1.options[select1.selectedIndex].value;
    console.log(movieId)
    movieId = value1;
    let jsonData = JSON.stringify({
      'date': date, 'theatreId': theatreId, 'movieId': movieId
    });

    $.ajax({

      type: 'POST',
      contentType: "application/json; charset=utf-8",
      url: url,
      data: jsonData,
      cache: false,
      dataType: "json",
      jsonp: false,
      success: function (data, textStatus, jqXHR) {
        if (data == 0) {
          alert("Screening NOT found for this date and theatre!");
          check = false;
        }
        else if (data.length > 0) {
          // check if the movie screening time has passed
          let movieTime = data[0].time;
          let movieDate = data[0].date;
          let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

          if (movieDate == currentDate && currentTime > movieTime) {

            alert("Movie screening has passed!");

          } else {

            check = true;
            saloonId = data[0].saloonId;
            alert("Screening found for this date and theatre! Time:" + data[0].time + " Saloon:" + data[0].saloonId);

          }
        }
      }
    });
  }

  // update the seats with "taken" seats retrieved from the db
  function updateTakenSeats(data) {
    let number = '';
    const takenSeats = [];
    seats.forEach((seat, index) => {
      seat.classList.remove("taken");
      // seat.classList.remove("selected");
    });

    if (data != 0) {
      data.forEach((element, index) => {

        for (let i = 0; i <= element.seatNum.length - 1; i++) {

          if (element.seatNum[i] === '-') {
            takenSeats[number] = number;
            number = '';
          } else {
            number += element.seatNum[i];
          }

          if ((i + 1) === element.seatNum.length) {
            takenSeats[number] = number;
            number = '';
          }
        }
      });

      // make the reserved seats "taken"
      seats.forEach((seat, index) => {
        if (takenSeats[index] > 0) {
          seat.classList.add("taken");
          seat.classList.remove("selected");
        }
      });
    }
  }

  today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var dateControl = document.querySelector('input[type="date"]');
  dateControl.value = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();;

  // event listener for date picker
  dateControl.addEventListener("change", () => {
    checkScreening();
    retrieveTakenSeats(dateControl.value.toString().slice(0, 5) + dateControl.value.toString().slice(6));
  })

  // event listener for theatre picker
  theatre.addEventListener("change", () => {
    checkScreening();
    retrieveTakenSeats(dateControl.value.toString().slice(0, 5) + dateControl.value.toString().slice(6));
  })

  // run as soon as the page loads
  checkScreening();
  populateUIFromLocalStorage();
  updateSelectedSeat();
  setTimeout(function () {
    retrieveTakenSeats(date);
  }, 90);
}
async function renderMovies(){
  let movies;
  try {
    movies = await (await fetch('/api/movies')).json();
  }
  catch (ignore) { }
  console.log(movies);
  var select1 = document.getElementById("selectMovie");
  for (index of movies){
   var opt = index.id;
   var opt1 = index.title;
   var el = document.createElement("option");
   el.value = opt;
   el.text = opt1;
   select1.appendChild(el);
  }
  select1.addEventListener('change',()=>{
    let value1 = select1.options[select1.selectedIndex].text;
    console.log(value1);
    document.getElementById('ticketImage').src=value1+".jpg";

  })
 
}

