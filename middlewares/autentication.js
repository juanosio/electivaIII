const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
	let token = req.get("token");

	jwt.verify(token, process.env.SEED_TOKEN, (error, decoded) => {
		if (error) {
			return res.status(401).json({
				ok: false,
				error,
			});
		}

		app.locals.user = decoded.user;

		next();
	});
};

module.exports = authVerify;
