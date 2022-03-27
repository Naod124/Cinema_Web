 async function showHistory(){
     let dates = {};
    let result = {};
    let currentDate = new Date();
    try {
        result = await (await fetch('/api/my-tickets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null
      })).json();
    }   
    catch (ignore) { }
    if(Object.keys(result).length != 0){
    console.log(JSON.stringify(result));
    let jsoonResults = JSON.stringify(result);
    console.log("JSonprice;",jsoonResults);
    let cardHtml = ''; 
    let counter =  0;
    for (const iterator of result) {
        counter++;
        cardHtml+='<div class="card historyCard"><div class="card-body"><h1 class="card-title">';
        cardHtml+='<span>Ticket number</span><h2>';
        console.log(iterator.id);
        cardHtml+= iterator.id;
        cardHtml+='</h2></h1><div class="container-fluid m-5"><div class="row"><div class="col"><h3 id="yellow">Movie name</h3>';
        cardHtml += '<h2 class="MovieName">';
        console.log(iterator.title);
        cardHtml+=iterator.title;
        cardHtml+='</h2></div>';
        cardHtml+='<div class="col"><h3>City</h3>'
        cardHtml += '<h2 class="City">';
        console.log(iterator.cityName);
        cardHtml+=iterator.cityName;
        cardHtml+='</h2></div>';
        cardHtml+='<div class="col"><h3 id="yellow">Sal number</h3>'
        cardHtml += '<h2 class="SalNumber">';
        console.log(iterator.name);
        cardHtml+=iterator.name;
        cardHtml+='</h2></div>';
        cardHtml+='<div class="col"><h3>Seat number</h3>'
        cardHtml += '<h2 class="SeatNumber">';
        console.log(iterator.seatNum);
        cardHtml+=iterator.seatNum;
        cardHtml+='</h2></div>';    
        cardHtml+='<div class="col"><h3 id="yellow">Date</h3>';
        cardHtml += '<h2 class="Date">';
        console.log(iterator.date);
        cardHtml+=iterator.date;
        let ticketDate = new Date(iterator.date);
        dates[counter]=ticketDate;
        cardHtml+='</h2></div>';   
        cardHtml+='<div class="col"><h3>Total price</h3>';
        cardHtml += '<h2 class="totalPrice">';
        console.log(iterator.totalPrice);
        cardHtml+=iterator.totalPrice;
        cardHtml+='</h2></div></div></div></div>';
        cardHtml+='<button class="btn customButton" value="';
        cardHtml+= ticketDate;
        cardHtml+= '" id ="';
        cardHtml+= iterator.id;
        cardHtml+='" type="button" onclick="cancelBooking(id,value)">Cancel</button></div>';
       console.log (ticketDate>currentDate);
        document.querySelector('.tickets').innerHTML= cardHtml;
        console.log(dates);
}
for (const iterator of Object.values(dates)) {
    console.log (iterator>currentDate);
}
    }
    else {
        document.querySelector('.tickets').innerHTML='<h1>NO TICKETS TO SHOW</h1>';
    }
    }
showHistory();
async function cancelBooking(id,value){
    alert("Hello");
    let currentDate = new Date();
    let date = new Date(value);
    console.log(value);
    if(currentDate>date){
        alert("This ticket has been already used or you cannot cancel this booking.. contact support");
        return;
    }else{
        let result ={}
    const data = { id: id };
    try {
        result = await (await fetch('/api/my-tickets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })).json();
    }   
    catch (ignore) { }
    console.log(result);
    }
    
}
