const express = require("express"); 
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser'); 
const db = require("./DB/Queries"); 


const app = express(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/login',function name(req, res) {
    let name = req.body.username; 
    let password = req.body.password; 
    if(db.getUser(name, password)==1){
        res.send('0'); 
    }
}); 

app.listen(8080); 