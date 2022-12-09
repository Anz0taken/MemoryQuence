/*============================================
    ---General info-------------
		file name: gameHandler.js

    ---Scope--------------------
		This script is used to create a series of function
		usefull to manage game data for each user. An object
		won't be created cause of the issues about memorizing 
		it in server sessions.

    ---Edit history-------------
		Last edit   : 09/12/2022
		Author      : Luca Gargiulo

--------------------------------------------*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	function name: randNumber

    ---Scope--------------------
		Given a range, returns a random number between
		the given range.

	---Paramiters---------------
		min -> minimum value wanted
		max -> max value wanted

    ---Return-------------------
		variable name 	: nmber
		decription  	: random number between or equal to min and max
		type 			: integer
____________________________________________*/
function randNumber(min, max)
{
	var nmber;

	nmber = Math.floor(Math.random()*(max-min+1)+min);

	return nmber;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	function name: resetSequence

    ---Scope--------------------
		Passed "gameObj", resets all the variables associated in way
		which those will be ready to be used for another game.

	---Paramiters---------------
		gameObj -> object which contains game variables

    ---Return-------------------
		none
____________________________________________*/
function resetSequence(gameObj)
{
	gameObj.arraySequence = [];	//No sequence had been inserted
	gameObj.numberSequence = 0;	//Number of correct sequence
	gameObj.arraySequence[gameObj.numberSequence++] = randNumber(1,4);	//memorize first sequence component
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ---General info-------------
    	function name: checkSequence

    ---Scope--------------------
		Given a gameObj and a sequence inserted,
		this function checks they are equal; if they are
		add a new color to the sequence.

	---Paramiters---------------
		gameObj 	-> object which contains game variables
		arrayGiven 	-> sequence given

    ---Return-------------------
		variable name 	: valid
		decription  	: contains if variables are equal
		type 			: boolean
____________________________________________*/
function checkSequence(gameObj, arrayGiven)
{
	var valid = false;

	if(arrayGiven.length == gameObj.arraySequence.length)	//if the sequences have same length
	{
		valid = true;

		//check till you find sequence's color which doesn't match
		for(var i = 0; i < arrayGiven.length && valid; i++)
			if(arrayGiven[i] != gameObj.arraySequence[i])	//if you find one
				valid = false;								//sequences are not the same
	}

	if(valid)	//if the sequences are the same
	{
		//add a new color to the sequence
		gameObj.arraySequence[gameObj.numberSequence++] = randNumber(1,4);
	}

	return valid;
}

exports.checkSequence = checkSequence;
exports.resetSequence = resetSequence;