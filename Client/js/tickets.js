const price = document.getElementById("price"),
  seatContainer = document.querySelector(".seat-container"),
  seats = document.querySelectorAll(".row .seat:not(.taken)"),
  cart = document.querySelector(".fa-shopping-cart"),
  seatCount = document.getElementById("seat-count"),
  totalPrice = document.getElementById("total-price"),
  shoppingCart = document.getElementById("shopping-cart"),
  closeBtn = document.querySelector(".close-btn");

let ticketPrice = +price.value;

function updateSelectedSeat() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  const seatsIndex = [...selectedSeats].map(function (seat) {
    return [...seats].indexOf(seat);
  });
  // console.log(seatsIndex);
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

price.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setTicketData(e.target.selectedIndex, e.target.value);
  updateSelectedSeat();
});

function setTicketData(ticketTypeIndex, ticketCost) {
  localStorage.setItem("selectedTicketTypeIndex", ticketTypeIndex);
  localStorage.setItem("selectedTicketPrice", ticketCost);
}

function populateUIFromLocalStorage() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));
  console.log(selectedSeats);
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

populateUIFromLocalStorage();
updateSelectedSeat();
