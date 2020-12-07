require("./config/config.js");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const morgan = require("morgan");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
require("./authentication/local-auth");

//DB
mongoose
	.connect(process.env.URLDB, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((_) => {
		app.listen(process.env.PORT, () => {
			console.log(
				`Conexión establecida, puedes ver el proyecto en: http://localhost:${process.env.PORT}`
			);
		});
	})
	.catch((error) => {
		console.log(
			`Fallo al conectarse a la base de datos por lo tanto no se pudo arrancar el servidor ${error}`
		);
	});

//Middlewares
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
//Morgan
app.use(morgan("dev"));
//Sesiones
app.use(session({
	secret: process.env.SEED_SESION,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize())
app.use(passport.session())
//Notificaciones
app.use(flash());

//Global Variables
app.use((req, res, next) => {
	res.locals.info = req.flash("info")[0]	
	res.locals.passport_msg = req.flash("error")[0]
	res.locals.user = req.user || null;
	next()
})

//View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use(routes);

app.use((_, res) => {
	res.status(404).render("404");
});
