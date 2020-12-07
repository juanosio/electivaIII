const { Router } = require("express");

const bcrypt = require('bcrypt');
//const _ = require('underscore');
//const tokenVerify = require("../middlewares/autentication.js")

const router = Router()

const User = require("../models/User.js");

router.post("/registrarse", function (req, res) {
// router.post("/usuarios", tokenVerify,function (req, res) {

	const {
		name, 
		lastname, 
		email, 
		password, 
 			} = req.body;

	let user = new User({
        name,
        lastname, 
		email,
		password: bcrypt.hashSync(password, 10)
	})

	user.save((error, userDB) => {
		if(error){
			return res.status(400).render('./login/register', {
				ok: false,
				error
			})
		}

		req.flash("info", {ok: true, msg: `Usuario registrado exitosamente`});
		return res.render('./login/index')
	})
});


module.exports = router