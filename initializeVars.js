/*============================================
    ---General info-------------
		file name: initializeVars.js

    ---Scope--------------------
		This script is used to create and store data usefull
        for sessions, to handle client connections and db connections.

    ---Edit history-------------
		Last edit   : 09/12/2022
		Author      : Luca Gargiulo

    ---More infos---------------
        For safety reasons, some real date have been replaced
        with "****".

--------------------------------------------*/
var express = require('express');
var session = require('express-session');
var mysql = require('mysql');

var app = express();

app.use(express.json());                                                        //Use json format for communications
app.use(express.urlencoded({ extended: true }));    
app.use(express.static(__dirname + '\\public'));                                //Set public directory
app.use(session({ secret: '****', resave: true, saveUninitialized: true }));    
app.set('view engine', 'ejs');

//create mysql connection and set data
var con = mysql.createConnection({
    host: "****",
    user: "****",
    password: "****",
    port: "****",
    database: "****"
});

con.connect(function(err){
    if(err) throw err;
});

module.exports = { app, con }