const { Router } = require("express");
const router = Router();
const moment = require("moment");

const Article = require("../models/Article");
const Supplier = require("../models/Supplier");
const Revenue = require("../models/Revenue");

//Inventory
async function updateStock(article, quantity) {
	const newStock = [];

	// Update Stock
	for (let i = 0; i < article.length; i++) {
		console.log(article[i]);

		const articleDB = await Article.findOne({ name: article[i] });

		console.log(articleDB);

		newStock.push(Number(articleDB.stock) + Number(quantity[i]));
	}

	// Save update stock
	for (let i = 0; i < article.length; i++) {
		Article.updateOne(
			{ name: article[i] },
			{ stock: newStock[i] },
			(err, docs) => {
				if (err) {
					return res.status(400).redirect("/ingresos");
				} else {
					console.log("Updated Stock : ", article[i]);
				}
			}
		);
	}
}

router.get("/ingresos", (_, res) => {
	Revenue.find()
		.sort({ createdAt: "desc" })
		.populate("supplier", "name")
		.then((revenues) => {
			Revenue.countDocuments((err, conteo) => {
				res.render("./admin/revenues/index", {
					ok: true,
					length: conteo,
					ventas: revenues,
					moment: moment,
				});
			});
		})
		.catch((error) => {
			res.render("./admin/revenues/index", { ok: false, error });
		});
});

router.get("/ingresos/crear", async (_, res) => {
	const articles = await Article.find({}).sort({ createdAt: "desc" });
	const suppliers = await Supplier.find({}).sort({ name: "asc" });
	res.render("./admin/revenues/create", {
		articulos: articles,
		proveedores: suppliers,
	});
});

router.get("/verificarStock/:article/:quantity", async (req, res) => {
	let { article, quantity } = req.params;
	const articleDB = await Article.findOne({ name: article }).sort({
		createdAt: "desc",
	});

	if (Number(quantity) > Number(articleDB.stock)) {
		return res.json({ ok: false });
	}

	return res.json({ ok: true });
});

router.post("/ingresos", async (req, res) => {
	//Haciendo el listado de los articulos comprados

	let listArticle = [];
	let total = 0;
	let totalSinImpuesto = 0;
	let article = req.body.article;
	let quantity = req.body.quantity;
	let priceBuy = req.body.priceBuy;
	let priceSale = req.body.priceSale;
	let subtotal = req.body.subtotal;
	let articleToSendAListArticle = {};

	for (let i = 0; i < article.length; i++) {
		articleToSendAListArticle = {
			name: article[i],
			quantity: Number(quantity[i]),
			priceBuy: Number(priceBuy[i]),
			priceSale: Number(priceSale[i]),
			subtotal: Number(subtotal[i]),
		};

		totalSinImpuesto += Number(subtotal[i]);

		listArticle.push(articleToSendAListArticle);
	}

	total = totalSinImpuesto * 0.18 + totalSinImpuesto;

	//Guardando la venta
	const revenue = new Revenue({
		supplier: req.body.supplier,
		comprobanteType: req.body.comprobanteType,
		comprobanteSerie: req.body.comprobanteSerie,
		comprobanteNro: req.body.comprobanteNro,
		articles: listArticle,
		total: total,
	});

	//Actualizar Stock del inventario
	updateStock(article, quantity);

	revenue.save((error, supplier) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al realizar la compra ${error}`});
			return res.status(400).redirect("/ingresos");
		}

		req.flash("info", {ok: true, msg: `Compra realizada exitosamente`});
		return res.redirect("/ingresos");
	});
});

//Watch
router.get("/ingresos/ver/:id", (req, res) => {
	const id = req.params.id;

	Revenue.findById(id)
		.then((revenue) => {
			res.render("./admin/revenues/show", {
				ok: true,
				venta: revenue,
				moment,
			});
		})
		.catch((error) => {
			res.status(400).render("./admin/revenues/index", {
				ok: false,
				error,
			});
		});
});

module.exports = router;
