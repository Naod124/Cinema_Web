function tickets() {
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
    // console.log(selectedSeats);
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


  function saveTicketToDb() {
    const url = "http://localhost:7777/api/tickets";

    today = new Date();
    const seatsIndex = [...selectedSeats].map(function (seat) {
      return [...seats].indexOf(seat);
    });

    let total = totalPrice.innerText;
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let seatNum = seatsIndex.join("-");
    let customerId = "wael-natafji@hotmail.com";

    let jsonData = JSON.stringify({
      'date': date, 'seatNum': seatNum, 'totalPrice': total, 'customerId': customerId
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
          }

          totalPrice.innerText = 0;
          selectedSeats.length = 0;
          localStorage.clear();
        }
      }
    });
  }

  function retrieveTakenSeats() {
    const url = "http://localhost:7777/api/takenSeats";

    today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    let jsonData = JSON.stringify({
      'date': date
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
        else if (data.length > 0) {
          updateTakenSeats(data);
        }
      }
    });
  }

  function updateTakenSeats(data) {
    let number = '';
    const takenSeats = [];
    data.forEach((element, index) => {

      for(let i = 0; i <= element.seatNum.length - 1; i++){

        if (element.seatNum[i] === '-'){
          takenSeats[number] = number;
          number = '';
        } else {
          number += element.seatNum[i];
          console.log(number);
        }

        if ((i + 1) === element.seatNum.length) {
          takenSeats[number] = number;
          number = '';
        }
      }

      console.log(takenSeats);
    });

    seats.forEach((seat, index) => {
      if (takenSeats[index] > 0) {
        seat.classList.add("taken");
        seat.classList.remove("selected");
      }
    });

  }

  populateUIFromLocalStorage();
  updateSelectedSeat();
  retrieveTakenSeats();

}