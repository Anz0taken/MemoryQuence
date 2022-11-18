var express = require('express');
var session = require('express-session');
var mysql = require('mysql');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '\\public'));
app.use(session({ secret: '14b313746ebda0fb558e1605485ae3ca7705bb15a193c22f0cdf4d110bb9aae5', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "memoryquence"
});

con.connect(function(err){
    if(err) throw err;
});

module.exports = { app, con }