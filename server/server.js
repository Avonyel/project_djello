const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const { User, Board, List, Card } = require("./models");

const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// Session

app.use(
	session({
		secret: "ia ia cthulhu fhtagn",
		resave: false,
		saveUninitialized: false
	})
);

// Body parser

app.use(bodyParser.json());

// Passport authentication

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy({ usernameField: "email" }, function(
		email,
		password,
		done
	) {
		User.find({
			where: {
				email: email
			}
		}).then(user => {
			if (!user || !user.validatePassword(password)) {
				return done(null, false);
			}
			return done(null, user);
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id).then(user => {
		done(null, user);
	});
});

app.post("/login", passport.authenticate("local"), (req, res) => {
	console.log("Hit the server");
	res.json(req.user);
});

app.get("/api/:id/boards", async (req, res) => {
	const boards = await Board.findAll({
		where: { userId: req.params.id },
		include: [{ model: List, include: [{ model: Card }] }]
	});

	console.log("This users boards are: ", boards);
	res.json(boards);
});

app.listen(3001, () => {
	console.log("Now listening...");
});