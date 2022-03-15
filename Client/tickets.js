const price = document.getElementById("price"),
  seatContainer = document.querySelector(".seat-container"),
  seats = document.querySelectorAll(".row .seat:not(.taken)"),
  cart = document.querySelector(".fa-shopping-cart"),
  seatCount = document.getElementById("seat-count"),
  totalPrice = document.getElementById("total-price"),
  shoppingCart = document.getElementById("shopping-cart"),
  closeBtn = document.querySelector(".close-btn"),
  buyBtn = document.querySelector(".buy-btn");

let ticketPrice = +price.value;
let selectedSeats = [];

function updateSelectedSeat() {
  selectedSeats = document.querySelectorAll(".row .seat.selected");
  const seatsIndex = [...selectedSeats].map(function (seat) {
    return [...seats].indexOf(seat);
  });

  console.log(seatsIndex);
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
    saveTicketToDb();
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
  console.log(selectedSeats);
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }

      // if(!selectedSeats.indexOf(index) === undefined) {
      //   seat.classList.add("taken");
      // }
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


function saveTicketToDb() {
  const url = "http://localhost:7777/tickets";

  today = new Date();
  // console.log(selectedSeats);
  const seatsIndex = [...selectedSeats].map(function (seat) {
    return [...seats].indexOf(seat);
  });

  let total = totalPrice.innerText;
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  let seatNum = seatsIndex.join("-");

  let jsonData = JSON.stringify({
    'date': date, 'seatNum': seatNum, 'totalPrice': total
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
        console.log("Failed");
      }
      else if (data == 1) {
        console.log("Success");
        alert("Ticket bought successfully!");
        for (i = 0; i < selectedSeats.length; i++) {
          selectedSeats[i].classList.add('taken');
          selectedSeats[i].classList.remove('selected');
          // setTicketData(ticketTypeIndex, ticketCost, "taken");
        }

        totalPrice.innerText = 0;
        selectedSeats.length = 0;
        localStorage.clear();
      }
    }
  });

}

populateUIFromLocalStorage();
updateSelectedSeat();
