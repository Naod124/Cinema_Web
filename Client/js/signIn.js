function submitClick() {
  let username = $('#username').val();
  let password = $('#password').val();
  let jsonData = JSON.stringify({
    'username': username, 'password': password
  });
  const url = "http://localhost:7777/api/login";

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
        alert("Invalid log in information. Try again")
        $('#username').val('');
        $('#password').val('');

      }
      else if (data == 1) {
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
        $("#myForm1").show();
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
        alert('Password updated')
      }
    }
  });
}
