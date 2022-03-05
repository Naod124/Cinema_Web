const price = document.getElementById("price"),
  seatContainer = document.querySelector(".seat-container"),
  seats = document.querySelectorAll(".row .seat:not(.taken)"),
  cart = document.querySelector(".fa-shopping-cart"),
  seatCount = document.getElementById("seat-count"),
  totalPrice = document.getElementById("total-price"),
  shoppingCart = document.getElementById("shopping-cart"),
  closeBtn = document.querySelector(".close-btn"),
  ticketPrice = +price.value;

function updateSelectedSeat() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  const numberOfSelectedSeats = selectedSeats.length;
  seatCount.innerText = numberOfSelectedSeats;
  totalPrice.innerText = numberOfSelectedSeats * ticketPrice;
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
