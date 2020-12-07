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
//        VENCIMIENTO DEL TOKEN
//60 segundos
//60 minutos
//24 horas
//30 dias
//--------------------------------------
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

//--------------------------------------
//         SEED de Autenticacion
//--------------------------------------
process.env.SEED_TOKEN = process.env.SEED_TOKEN || "this-is-a-seed-development";

//--------------------------------------
//           SEED de Sesion
//--------------------------------------
process.env.SEED_SESION =
	process.env.SEED_SESION || "this-is-a-seed-development";
