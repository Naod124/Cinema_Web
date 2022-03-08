const express = require("express"); 
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 
const db = require("./DB/Queries"); 
const { json } = require("body-parser");


let tempName =''; 
let tempPass =''; 
const app = express(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/login',jsonParser,function (request, response) {
    //console.log(db.getUser('Naoderi36@gmail.com', '12345'));

    var username = request.body.username; 
    var password = request.body.password; 

    console.log(username + " " + password); 

		// Execute SQL query that'll select the account from the database based on the specified username and password
        var db= new sqlite3.Database('/Users/tekie/Desktop/Cinema_Web/Filmvisarna.sqlite3',(err)=>{
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
         });

}); 

app.get('/hello',function name(req, res){
res.send('hello Cinema'); 

});

app.listen(7777); 
module.exports = app;