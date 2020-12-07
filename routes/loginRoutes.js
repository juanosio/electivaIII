const { Router } = require("express");

const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/User.js");

const router = Router();

router.get("/admin", (req, res) => {
	res.render("./admin/index");
});


router.post("/login", passport.authenticate("login", {
		successRedirect: "/admin",
		failureRedirect: "/",
		failureFlash: true
}));


router.get("/registrarse", (_, res) => {
	res.render("./login/register", {errors: null, name: "", lastname: "", email: ""});
});

router.post("/registrarse", (req, res) => {
	const { name, lastname, email, password, confirm_password } = req.body;
	console.log(req.body)
	const errors = [];

	if (password != confirm_password) {
		errors.push({ msg: "Las contraseñas no coinciden" });
	}

	if (password.length < 5) {
		errors.push({
			msg: "Las contraseña debe poseer al menos 5 carácteres",
		});
	}

	//Mando los errores si exiten
	if (errors.length > 0) {
		return res.status(500).render("./login/register", {
			ok: false,
			errors,
			name,
			lastname,
			email,
		});
	}

	let user = new User({
		name,
		lastname,
		email,
		password: bcrypt.hashSync(password, 10),
	});

	user.save((error, userDB) => {
		if (error) {
			return res.status(400).render("./login/register", {
				ok: false,
				errors: [{msg: error}],
				name,
				lastname,
				email,
			});
		}

		req.flash("info", {ok: true, msg: "Usuario registrado satisfactoriamente"});
		res.render("./login/index");

	});
});

module.exports = router;
