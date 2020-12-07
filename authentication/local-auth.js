const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require('bcrypt');

passport.use("login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {

    //Confirmar si exite el correo
    const user = await User.findOne({email})

    if(!user){
        return done(null, false, {ok: false, message: "Usuario o contraseña incorrectos"})
    }

    //Validar contraseña
    if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {ok: false, message: "Usuario o contraseña incorrectos"} )
   }
   
   return done(null, user)

}))

passport.serializeUser((user, done)=> {
    done(null, user.id)   
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user)
    })
})