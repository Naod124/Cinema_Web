const express = require("express");
const path = require("path");
const session = require('express-session');
const betterstore = require('better-express-store');
require('dotenv').config();
const bodyParser = require('body-parser');
// const db = require("./DB/Queries"); 
//const { json } = require("body-parser");
const Database = require('better-sqlite3');
const sqlQuerie = Database('./DB/Filmvisarna.sqlite3');
const port = process.env.PORT || 7777;;
//console.log(process.env)


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(express.json()); 
  app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With, Session");
  res.header(" Access-Control-Allow-Methods: OPTIONS");
  next();
}); 

app.use(express.static(path.resolve(__dirname,"../","Client")));
app.use(express.json({ limit: '100MB' }));
app.listen(port, () =>console.log('Listening on http://localhost:' + port));
//Redirect all requests to index.html
// Import the login.js function and call it

const login = require('./login.js');
login(app, sqlQuerie);

const specialRESTAPI = require('../Server/special-rest-routs');
specialRESTAPI(app, sqlQuerie);

const setupRESTapi = require('../Server/rest_API');
setupRESTapi(app, sqlQuerie);

 app.all("/*",(req,res)=>{
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname,"../Client","index.html"));
}); 



module.exports = app;

