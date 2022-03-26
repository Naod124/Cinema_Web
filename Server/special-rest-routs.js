const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var store = require('store');
var path = require('path');
// var jwt = require('jsonwebtoken'); 
require('dotenv').config({ path: "Server/process.env" });
var userAuth = 'username';
console.log(process.env.HOST);

module.exports = function specialrouts(app, db) {
  // Code from APP.js is here //

  // create application/json parser
  var jsonParser = bodyParser.json();

  // create application/x-www-form-urlencoded parser
  var urlencodedParser = bodyParser.urlencoded({ extended: false })
  var username = "Naoderi36@gmail.com";
  let firstName = db.prepare("SELECT firstName FROM customers WHERE username= '" + username + "'").get();
  console.log(JSON.stringify(firstName.firstName));
  app.post('/api/login', jsonParser, function (request, response) {
    //console.log(db.getUser('Naoderi36@gmail.com', '12345'));
    response.type('application/json');

    var username = request.body.username;
    var password = request.body.password;

    let stmt = db.prepare("SELECT * FROM customers WHERE username= '" + username + "' AND password= '" + password + "'").all();
    let firstName = db.prepare("SELECT firstName FROM customers WHERE username= '" + username + "'").get();



    const user = { name: username };

    if (stmt.length == 1) {
      // response.json({a:'1'});
      request.session.user = username;
      request.session.admin = true;
      response.send(firstName.firstName);
      // jwt.sign(user, process.env.TOKEN, { expiresIn: '1800s' }); 

      store.set('username', username);

      console.log(store.get('username'));


    }
    else if (stmt.length == 0) {
      //response.json({a:'0'})
      response.send('0');
    }

    //console.log(response.headersSent); 
  });
  var auth = function (req, res, next) {
    var verifyUser = store.get('username');
    if (req.session && req.session.user === verifyUser && req.session.admin)
      return next;
    else
      return res.sendStatus(401);
  };

  app.get("/api/posts", function (req, res) {
    var hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour);
    if (req.session.user) {
      res.send(req.session.user);
    }
  });


  /*
  function verifyToken (req,res,next) { 
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader && bearerHeader.split(' ')[1]
      if (token == null) return res.sendStatus(401)
      req.token = token; 
      next(); 
     }
  
   }*/

  app.post('/forgetPass', jsonParser, function (request, response) {
    var username = request.body.email;
    // console.log(username);  
    var resetNum = Math.floor(Math.random() * 100000) + 1;

    store.set('random', resetNum);

    store.set('username', username);
    let stmt = db.prepare("SELECT * FROM Customers WHERE username= '" + username + "'").all();

    if (stmt.length == 1) {
      response.send('1');

      var transporter = nodemailer.createTransport(smtpTransport({
        host: process.env.HOST,
        port: 465,
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
    email = store.get('username');
    var resetNum = store.get('random');
    var resCode = request.body.resetCode;
    if (resCode == resetNum) {
      response.send('1');
    } else if (!(resCode == resetNum)) {
      console.log('reset code was invalid');
      response.send('0');
    }
    store.remove('random')
  });

  app.post('/newPass', function (request, response) {

    var oldPassword = request.body.oldPassword;
    var newPassword = request.body.newPassword;
    var email = store.get('username');

    if (oldPassword == newPassword) {
      db.prepare("UPDATE Customers SET password= '" + newPassword + "' where username='" + email + "'").run();
      response.send("1");

    }
    else {
      response.send("0");
    }
  });

  app.post('/api/tickets', function (request, response) {

    var total = request.body.totalPrice;
    var date = request.body.date;
    var seatNumber = request.body.seatNum;
    var customerId = request.body.customerId;
    var movieId = request.body.movieId;
    var saloonId = request.body.saloonId;

    if (total > 0) {

      db.prepare("INSERT INTO tickets (date, seatNum, totalPrice, customerId, movieId, saloonId) VALUES (" + "'" + date + "'" + ", '" + seatNumber + "', " + total + ", '" + customerId + "', " + movieId + ", " + saloonId + ")").run();
      response.send("1");
    } else {
      response.send("0");
    }
  });

  app.post('/api/takenSeats', jsonParser, function (request, response) {

    var date = request.body.date;
    var movieId = request.body.movieId;
    var saloonId = request.body.saloonId;

    let stmt = db.prepare("SELECT * FROM tickets WHERE date like  '%" + date + "%' AND movieId like '%" + movieId + "%' AND saloonId like '%" + saloonId + "%'").all();

    if (stmt.length > 0) {
      response.send(stmt);
    }
    else if (stmt.length == 0) {
      response.send('0')
    }
  });

  app.post('/api/checkScreening', jsonParser, function (request, response) {

    var date = request.body.date;
    var movieId = request.body.movieId;
    var theatreId = request.body.theatreId;

    let stmt = db.prepare("SELECT * FROM screening WHERE date like  '%" + date + "%' AND movieId like '%" + movieId + "%' AND cinemaId like '%" + theatreId + "%'").all();

    if (stmt.length > 0) {
      response.send(stmt);
    }
    else if (stmt.length == 0) {
      response.send('0')
    }
  });

  /* app.post('/customers' , function (request, response) {
      var firstName = request.body.firstName;
      var lastName = request.body.lastName;
      var username = request.body.username;
      // encrypt the field whose name is stored in passwordField
      var password =   passwordEncryptor(request.body[passwordField]);
      var userRole =request.body[userRoleField] = 'user';
      sqlQuerie.prepare("INSERT INTO customers( firstName,lastName,username,password,userRole) VALUES (" + "'" + firstName + "'" + ", '" + lastName + "'" + ", '" + username + "'" + ", '" + password+ "'" + ", '" +userRole + "') ").run();
      response.send("DONE");
    }); */
}