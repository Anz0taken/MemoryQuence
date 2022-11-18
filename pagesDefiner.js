var  initializeVars = require('./initializeVars.js');
var datas = require('./data.js');
const gameHandler = require('./gameHandler.js');

initializeVars.app.get('/', function(req, res){
    if(req.session.username)
		res.render('pages/game', { "username" : req.session.username, "headerContainer" : datas.headerContainer });
    else
        res.render('pages/login', { "headerContainer" : datas.headerContainer });    
});

initializeVars.app.get('/register', function(req, res){
    if(!req.session.username)
        res.render('pages/register', { "headerContainer" : datas.headerContainer });
    else
        res.render('pages/game', { "username" : req.session.username, "headerContainer" : datas.headerContainer });
});

initializeVars.app.get('/logout', function(req, res){
    req.session.username = "";
    res.redirect('/');
    res.end();
});

initializeVars.app.post('/adduser', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	// Ensure the input fields exists and are not empty
	if(username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('insert into users (username, userpassword) values (?,?)', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error)
                res.send(error);
            
            req.session.username = username;
            res.redirect('/');
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

initializeVars.app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	// Ensure the input fields exists and are not empty
	if(username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
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

initializeVars.app.post("/sendSequence", function(req, res){
	if(req.session.username && typeof req.session.gameObj.arraySequence !== 'undefined')
	{
		if(req.session.inGame && gameHandler.checkSequence(req.session.gameObj, req.body.sendedSequence))
		{
			res.send(req.session.gameObj.arraySequence);
		}
		else
		{
			req.session.inGame = false;
			res.send(req.session.gameObj.numberSequence.toString());
		}
	}
	else
		res.redirect("/");

	res.end();
})

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

initializeVars.app.get('/saveScore', function(req, res)
{
	initializeVars.con.query('insert into scores(iduser, numbersequence) values(?,?)', [req.session.iduser, req.session.gameObj.numberSequence], function(error, results, fields)
	{
		if(error)
		{
			if(error.code == 'ER_DUP_ENTRY')
			{
				res.status(209).send("Another score was found as same as it, score not saved.")
				res.end();
			}
			else
				throw error;
		}
		else
			if(results)
			{
				res.status(210).send("Score added with success.");
				res.end();
			}
			else
			{
				res.status(211).send("Some problem was found, score not saved.")
				res.end();
			}
	});
});


initializeVars.app.listen(8080);
console.log("Initialization completed. The server is up.");