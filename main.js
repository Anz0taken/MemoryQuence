/*============================================
    ---General info-------------
		file name: main.js

    ---Scope--------------------
		This script is used to define how each page has to behave with user interactions.

    ---Edit history-------------
		Last edit   : 09/12/2022
		Author      : Luca Gargiulo

--------------------------------------------*/
var  initializeVars = require('./initializeVars.js');
var datas = require('./data.js');
const gameHandler = require('./gameHandler.js');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name: '/'

    ---Scope--------------------
		To redirect user when no page is inserted.

____________________________________________*/
initializeVars.app.get('/', function(req, res){
    if(req.session.username)	//if user is already logged in
		res.render('pages/game', { "username" : req.session.username, "headerContainer" : datas.headerContainer });	//redirec him to game page 
    else
        res.render('pages/login', { "headerContainer" : datas.headerContainer });    //redirect him to login page
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name: '/register'

    ---Scope--------------------
		To give infos e data to register a user.

____________________________________________*/
initializeVars.app.get('/register', function(req, res){
    if(!req.session.username)	//if user is not registered
        res.render('pages/register', { "headerContainer" : datas.headerContainer });
    else
        res.render('pages/game', { "username" : req.session.username, "headerContainer" : datas.headerContainer });
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/logout'

    ---Scope--------------------
		Reset all session variables

____________________________________________*/
initializeVars.app.get('/logout', function(req, res){
    req.session.username = "";
    res.redirect('/');
    res.end();
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/adduser'

    ---Scope--------------------
		Given a username and a password (in SHA256) passed by post method, saves those data
		on db in case no user was found with the same username. Control username is 

____________________________________________*/
initializeVars.app.post('/adduser', function(req, res) {
	let username = req.body.username;	//get post username
	let password = req.body.password;	//get post password

	//ensure the input fields exists and are not empty
	if(username && password) {
		con.query('insert into users (username, userpassword) values (?,?)', [username, password], function(error, results, fields) {
            
			if(error)
                res.send(error), res.end();
            else
			{
				req.session.username = username;
				res.redirect('/');
				res.end();
			}
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/auth'

    ---Scope--------------------
		Given a username and a password (in SHA256) passed by post method, checks if
		a user with those data exists, if it does, save sessions variables and redirect to game page.

____________________________________________*/
initializeVars.app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if(username && password){
		initializeVars.con.query('select * from users WHERE username = ? AND userpassword = ?', [username, password], function(error, results, fields) {
			if (error) throw error;

			if (results.length > 0)
            {
				req.session.iduser = results[0].iduser;
				req.session.username = username;
				req.session.gameObj = {numberSequence : 0, arraySequence : new Array()};
				req.session.inGame = false;

				res.redirect('/');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/sendSequence'

    ---Scope--------------------
		Sent by post method a sequence by a user, checks its validity.
		If correct add one color and keep up with the game, otherwise stop game and inform user.

____________________________________________*/
initializeVars.app.post("/sendSequence", function(req, res){
	if(req.session.username && typeof req.session.gameObj.arraySequence !== 'undefined')	//if the user is logged in a sequence array is created
	{
		//if the user is playing annd the sequence is correct, go ahead with the game
		if(req.session.inGame && gameHandler.checkSequence(req.session.gameObj, req.body.sendedSequence))
		{
			//send a new sequence to the user
			res.send(req.session.gameObj.arraySequence);
		}
		else
		{
			req.session.inGame = false;									//user is not in game anymore
			res.send(req.session.gameObj.numberSequence.toString());	//return score
		}
	}
	else
		res.redirect("/");

	res.end();
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/startSequence'

    ---Scope--------------------
		Start a new game for applicant user.

____________________________________________*/
initializeVars.app.get("/startSequence", function(req, res) {
	if(req.session.username)
	{
		gameHandler.resetSequence(req.session.gameObj);
		req.session.inGame = true;
		res.send(req.session.gameObj.arraySequence);
	}
	else
		res.redirect("/");

	res.end();

})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/saveScore'

    ---Scope--------------------
		Save user score.
		Even status codes are for positive feedbacks.
		Odd one with negative feedbacks.

____________________________________________*/
initializeVars.app.get('/saveScore', function(req, res)
{
	//Insert user game score into database
	initializeVars.con.query('insert into scores(iduser, numbersequence) values(?,?)', [req.session.iduser, req.session.gameObj.numberSequence], function(error, results, fields)
	{
		//no same score by the same user with the same number sequence will be stored.
		if(error)
		{
			if(error.code == 'ER_DUP_ENTRY')	//if a score has been found with the same number sequence
			{
				res.status(209).send("Another score was found as same as it, score not saved.");
				res.end();
			}
			else
            {
                res.status(213).send("Unknown error...");
				res.end();
            }
		}
		else
			if(results)
			{
				res.status(210).send("Score added with success.");
				res.end();
			}
			else
			{
				res.status(211).send("Some problem was found, score not saved.");
				res.end();
			}
	});
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	page name : '/getScoreboard'

    ---Scope--------------------
		Give top 5 scores and personal user highscore to the applicant user.

____________________________________________*/
initializeVars.app.get('/getScoreboard', function(req, res)
{
    var output = '';

    initializeVars.con.query("select numbersequence, username from scores, users where users.iduser = scores.iduser order by numbersequence desc limit 5", function (err, result, fields) {
        if(err)
        {
            res.status(213).send('Unkown error...');
            res.end();
        }
        else
        {
            var positions = ['first', 'second', 'third', 'fourth', 'fifth'];

            for(var i = 0, size = Object.keys(result).length; i < size; i++)
            {
                output+='<li class="list-group-item"><strong>'+positions[i]+'</strong> '+result[i]['username']+' Score : <strong>'+ result[i]['numbersequence'] +'</strong></li>';
            }

            initializeVars.con.query("select max(numbersequence) as maxresult from scores where scores.iduser = "+req.session.iduser, function (err_, result_, fields_) {
                
                if(err_)
                {
                    res.status(213).send('Unkown error...');
                    res.end();
                }
                else
                {
                    res.status(200).send(output + result_[0]["maxresult"]);
                    res.end();
                }
            });
        }

      });
});


initializeVars.app.listen(8080);
console.log("Initialization completed. The server is up.");
