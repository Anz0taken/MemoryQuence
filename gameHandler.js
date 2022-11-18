function randNumber(min, max)
{
	var nmber;

	nmber = Math.floor(Math.random()*(max-min+1)+min);

	return nmber;
}

function resetSequence(gameObj)
{
	gameObj.arraySequence = [];
	gameObj.numberSequence = 0;
	gameObj.arraySequence[gameObj.numberSequence++] = randNumber(1,4);
}

function checkSequence(gameObj, arrayGiven)
{
	var valid = false;

	if(arrayGiven.length == gameObj.arraySequence.length)
	{
		valid = true;

		for(var i = 0; i < arrayGiven.length && valid; i++)
			if(arrayGiven[i] != gameObj.arraySequence[i])
				valid = false;
	}

	if(valid)
	{
		gameObj.arraySequence[gameObj.numberSequence++] = randNumber(1,4);
	}

	return valid;
}

exports.checkSequence = checkSequence;
exports.resetSequence = resetSequence;