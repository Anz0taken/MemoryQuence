CREATE TABLE users
(
	iduser 		    int  not null AUTO_INCREMENT,
	username 		char(40),
	userpassword 	char(64),

    /*
	Immagine		MEDIUMBLOB,
	Copertina		MEDIUMBLOB,
    */

	unique (username),
	primary key (iduser)
);

CREATE TABLE scores
(
    idsequence              int  not null AUTO_INCREMENT,
	numbersequence 	        int not null,

    iduser int not null,
	
	unique(iduser, numbersequence),
	FOREIGN KEY (iduser) REFERENCES users(iduser),
	PRIMARY KEY (idsequence)
);