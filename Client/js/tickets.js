const price = document.getElementById("price");
const seatContainer = document.querySelector(".seat-container");
const seats = document.querySelectorAll(".row .seat:not(.taken)");
const cart = document.querySelector(".fa-shopping-cart");

const ticketPrice = +price.value;

function updateSelectedSeat() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  const numberOfSelectedSeats = selectedSeats.length;
  // cart.innerHTML = numberOfSelectedSeats * ticketPrice;
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
