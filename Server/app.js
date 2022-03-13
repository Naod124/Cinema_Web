const express = require("express");
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
// const db = require("./DB/Queries"); 
const { json } = require("body-parser");
var store = require('store');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const Database = require('better-sqlite3');
const sqlQuerie = new Database('C:/Users/krist/Desktop/Faks/Web development/Group project/Project/Cinema_Web/Filmvisarna.sqlite3');

//console.log(process.env)


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(express.json); 
app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With, Session");
  res.header(" Access-Control-Allow-Methods: OPTIONS");
  next();

});

var resetNum = Math.floor(Math.random() * 100000) + 1;

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/login', jsonParser, function (request, response) {
  //console.log(db.getUser('Naoderi36@gmail.com', '12345'));

  var username = request.body.username;
  var password = request.body.password;

  let stmt = sqlQuerie.prepare("SELECT * FROM Customers WHERE username= '" + username + "' AND password= '" + password + "'").all();
  //let row = stmt.get(); 
  // let count = stmt.count; 
  console.log(stmt.length);
  if (stmt.length == 1) {
    response.send('1');
  }
  else if (stmt.length == 0) {
    response.send('0')
  }
  // Execute SQL query that'll select the account from the database based on the specified username and password
  /*  var db= new sqlite3.Database('/Users/tekie/Desktop/Cinema_Web/Filmvisarna.sqlite3',(err)=>{
        if(!err){
            db.all('SELECT * FROM Customers where username="'+username+'" and password="'+password+'"',(err,result)=>{
                if(result.length==1){
                     response.send('1')
                }
                else if(result.length==0) {
                    
                 response.send('0')
                }
            });
        }
     });*/

});

app.post('/forgetPass', jsonParser, function (request, response) {
  var username = request.body.email;
  // console.log(username);  

  store.set('username', username);
  let stmt = sqlQuerie.prepare("SELECT * FROM Customers WHERE username= '" + username + "'").all();

  if (stmt.length == 1) {
    response.send('1');

    var transporter = nodemailer.createTransport(smtpTransport({
      service: process.env.SERVICE,
      host: process.env.HOST,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    }));

    var mailOptions = {
      from: process.env.USER,
      to: username,
      subject: 'Reset your Password',
      text: 'This is your reset code! ' + resetNum
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
  else if (result.length == 0) {

    response.send('0')
  }
  else if (err) {
    response.send(err);
  }
});



app.post('/resetCode', jsonParser, function (request, response) {
  var email = store.get('username');

  var resCode = request.body.resetCode;
  if (resCode == resetNum) {
    response.send('1');

  } else if (!(resCode == resetNum)) {
    console.log('reset code was invalid');
    response.send('0');
  }
});

app.post('/newPass', function (request, response) {

  var oldPassword = request.body.oldPassword;
  var newPassword = request.body.newPassword;
  var email = store.get('username');

  if (oldPassword == newPassword) {
    sqlQuerie.prepare("UPDATE Customers SET password= '" + newPassword + "' where username='" + email + "'").run();
    response.send("1");

  }
  else {
    response.send("0");
  }
});


app.post('/tickets', function (request, response) {

  var total = request.body.totalPrice;
  var date = request.body.date;
  var seatNumber = request.body.seatNum;

  if (total > 0) {
    sqlQuerie.prepare("INSERT INTO tickets (date, seatNum, totalPrice) VALUES (" + "'" + date + "'" + ", '" + seatNumber + "', " + total + ")").run();
    response.send("1");
  } else {
    response.send("0");
  }
});

app.listen(7777);
console.log("Listening on port 7777");

module.exports = app;
