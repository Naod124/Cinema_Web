function validate() {
let url = "http://localhost:8080/login"; 
$('#submit').click(function (e) { 
    let username = $('#usernaame').val();
    let password = $('#password').val();

    let jsonData = JSON.stringify({
        'username':username, 'password':password
    }); 
    $.ajax({
        type: POST,
        contentType: "application/json; charset=utf-8", 
        url: url,
        data: jsonData,
        dataType: "dataType",
        success: function (response) {
            if(response.message==0){
                alert("Invalid log in information. Try again")
                $('#usernaame').val('');
                $('#password').val('');

            }
            else{

            }
        }
    });
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
