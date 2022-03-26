
//alert('hello world'); 
//closeForm();

function submitClick() {
 // alert('hello')
 let username = $('#username').val();
 let password = $('#password').val();
  let jsonData = JSON.stringify({
    'username': username, 'password': password
  });
  const url = "http://localhost:7777/api/login";
  var representationOfDesiredState = "The cheese is old and moldy, where is the bathroom?";
  
  console.log(username)
  var client = new XMLHttpRequest();
  
  client.open("POST", url, false);
  client.setRequestHeader("Content-Type", "application/json");
  client.send(jsonData);
  
  if (client.status == 200){
     // alert("The request succeeded!\n\nThe response representation was:\n\n" + client.responseText)
      if(client.response==0){
        alert("Invalid log in information. Try again")
        $('#username').val('');
        $('#password').val('');
      }
      //else if (JSON.stringify(data.data) == 1) {
        else {
          localStorage.setItem("email", username); 
          localStorage.setItem("firstName", client.response)
          $('#login').text("Hi "+localStorage.getItem("firstName"));
          history.pushState({}, '', 'http://localhost:7777'); 
          $("#login").attr("disabled", true);


            }
            //window.location.href("../Client/index.html"); 
            //history.pushState({}, null,path.resolve(__dirname,"../Client","index.html"));


    }
  else{
      alert("The request did not succeed!\n\nThe response status was: " + client.status + " " + client.statusText + ".");
  }

}



function openForm() {
  $("#myForm").show();
}

function closeForm() {

  $("#myForm").hide();
  $("#myForm1").hide();
  $("#myForm2").hide();
  $("#myForm4").hide();
  $('#email').val(' ');
  $('#password').val(' ');
  $('#password1').val(' ');
  $('#resetCode').val(' ');

}



function secondForm() {
  $("#myForm").hide();

  let email = $('#email').val();


  let jsonData = JSON.stringify({
    'email': email
  });
  const url = "http://localhost:7777/forgetPass";


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
        alert("Invalid email")
        $('#email').val('');

      }
      else if (data == 1) {
        $('#email').val('');
        $("#myForm1").show();
        $("#myForm").hide();

      }
    }
  });


}

function thirdForm() {
  let resetCode = $('#resetCode').val();


  let jsonData = JSON.stringify({
    'resetCode': resetCode
  });
  const url = "http://localhost:7777/resetCode";


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
        alert("Invalid reset code")
        $('#resetCode').val('');

      }
      else if (data == 1) {
        $('#resetCode').val('');
        $("#myForm").hide();
        $("#myForm1").hide();
        $("#myForm4").show();
      }
    }
  });

}

function fourthForm() {
  let oldPassword = $('#oldPassword').val();
  let newPassword = $('#newPassword').val();


  let jsonData = JSON.stringify({
    'oldPassword': oldPassword, 'newPassword': newPassword
  });
  const url = "http://localhost:7777/newPass";


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
        alert("Invalid reset code")
        $('#password').val('');
        $('#password1').val('');

      }
      else if (data == 1) {
        $('#password').val('');
        $('#password1').val('');
        alert('Password updated')
        closeForm()
      }
    }
  });
}
