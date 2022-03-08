function validate() {
let url = "http://localhost:8080/login"; 

  function submitClick(){
    let username = $('#username').val();
    let password = $('#password').val();
    let jsonData = JSON.stringify({
        'username':username, 'password':password
    }); 
    const url =  "http://localhost:7777/login"; 

    $.ajax({
        
        type: 'POST',
        contentType: "application/json; charset=utf-8", 
        url: url,
        data: jsonData,
        cache: false, 
        dataType: "json",
        jsonp: false,
        success: function (data, textStatus, jqXHR) {
            var a = JSON.stringify(data);
            if(data==0){
                alert("Invalid log in information. Try again")
                $('#username').val('');
                $('#password').val('');

            }
            else if(data==1) {
                alert('Logged in')
            }
        }
    });
    
  
  }
  function openForm() {
    $("#myForm").show();
  }
  
  function closeForm() {
$("#myForm").hide(); 
$("#myForm1").hide();
$("#myForm2").hide();


 }

 function secondForm() {
    $("#myForm").hide(); 
    $("#myForm1").show();
 }

 function thirdForm() {
    $("#myForm1").hide(); 
    $("#myForm2").show();
 }
