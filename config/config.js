//--------------------------------------
//                PUERTO
//--------------------------------------

process.env.PORT = process.env.PORT || 3000;

//--------------------------------------
//              ENTORNO
//--------------------------------------
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//--------------------------------------
//            BASE DE DATOS
//--------------------------------------
let urlDB;

if (process.env.NODE_ENV === "dev") {
	urlDB = "mongodb://localhost:27017/compra-venta";
} else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//--------------------------------------
//           SEED de Sesion
//--------------------------------------
process.env.SEED_SESION =
	process.env.SEED_SESION || "this-is-a-seed-development";
