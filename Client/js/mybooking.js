 async function showHistory(){
    let result = {};
    try {
        result = await (await fetch('/api/my-tickets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null
      })).json();
    }   
    catch (ignore) { }
    if(result!=null || result[0]!=null){
    console.log(result[0].totalPrice);
    console.log(JSON.stringify(result));
    let jsoonResults = JSON.stringify(result);
    console.log("JSonprice;",jsoonResults);
    let cardHtml = ''; 
    for (const iterator of result) {
        cardHtml+='<div class="card historyCard"><div class="card-body"><h1 class="card-title"><span>Ticket number</span></h1><div class="container-fluid m-5"><div class="row"><div class="col"><h3 id="yellow">Movie name</h3>';
        cardHtml += '<h2 class="MovieName">';
        console.log(iterator.totalPrice);
        cardHtml+=iterator.totalPrice;
        cardHtml+='</h2></div>';
        cardHtml+='<div class="col"><h3>Sal number</h3>'
        cardHtml += '<h2 class="SalNumber">';
        console.log(iterator.totalPrice);
        cardHtml+=iterator.totalPrice;
        cardHtml+='</h2></div>';
        cardHtml+='<div class="col"><h3>Seat number</h3>'
        cardHtml += '<h2 class="SeatNumber">';
        console.log(iterator.seatNum);
        cardHtml+=iterator.seatNum;
        cardHtml+='</h2></div>';    
        cardHtml+='<div class="col"><h3>Date</h3>';
        cardHtml += '<h2 class="Date">';
        console.log(iterator.date);
        cardHtml+=iterator.date;
        cardHtml+='</h2></div>';   
        cardHtml+='<div class="col"><h3>Total price</h3>';
        cardHtml += '<h2 class="totalPrice">';
        console.log(iterator.totalPrice);
        cardHtml+=iterator.totalPrice;
        cardHtml+='</h2></div></div></div></div></div>';
   }
   document.querySelector('.tickets').innerHTML= cardHtml;
    }
    else {
        document.querySelector('.tickets').innerHTML='<h1>NO TICKETS TO SHOW</h1>';
    }
    }
showHistory();
