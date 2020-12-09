//==========================
//    AUTENTICAR SESION
//==========================

const isAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}

	res.render('./login/index');
}

module.exports = isAuthenticated;







