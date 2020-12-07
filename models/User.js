const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let userSchema = new Schema({
	name: {
		type: String,
		required: [true, "El nombre del usuario es obligatorio"]
    },
    lastname: {
		type: String,
		required: [true, "El apellido del usuario es obligatorio"]
	},
	email: {
		type: String,
		unique: true,
		required: [true, "El correo es obligatorio"]
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"]
	}
})

userSchema.methods.toJSON = function(){
	let user = this;
	let userObject = user.toObject();
    delete userObject.password;
    
	return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} ya está siendo utilizado'});
module.exports = mongoose.model( "Usuario", userSchema)