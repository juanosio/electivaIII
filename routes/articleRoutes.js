const { Router } = require("express");
const router = Router();
const isAuthenticated = require("../middlewares/authVerify")
const Article = require("../models/Article");
const Category = require("../models/Category");

//Index
router.get("/articulos", (req, res) => {
	Article.find()
		.sort({ createdAt: "desc" })
		.populate("id_category", "name")
		.then((articles) => {
			Article.countDocuments((err, conteo) => {
				info = req.flash('info')[0];
				
				res.render("./admin/articles/index", {
					ok: true,
					length: conteo,
					articulos: articles,
				});
			});
		})
		.catch((error) => {
			res.render("./admin/articles/index", { ok: false, error });
		});
});

//Create
router.get("/articulos/crear",  (_, res) => {
	Category.find()
		.then((categories) => {
			res.render("./admin/articles/create", {
				ok: true,
				categorias: categories,
			});
		})
		.catch((error) => {
			res.status(400).render("./admin/articles/create", {
				ok: false,
				error,
			});
		});
});

//Store
router.post("/articulos", (req, res) => {
	const { id_category, code, name, description, price, stock } = req.body;

	const article = new Article({
		id_category,
		code,
		name,
		description,
		price,
		stock,
	});

	article.save((error, supplier) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al guardar el artículo: ${error}`});
			return res.status(400).redirect("/articulos");
		}
		req.flash("info", {ok: true, msg: "Artículo guardado exitosamente"});
		res.redirect("/articulos");
	});
});

//Edit
router.get("/articulo/editar/:id", (req, res) => {
	const id = req.params.id;

	Article.findById(id)
		.then((article) => {
			Category.find()
				.then((category) => {
					res.render("./admin/articles/edit", {
						ok: true,
						articulo: article,
						categorias: category,
					});
				})
				.catch((error) => {
					res.status(400).render("./admin/articles/edit", {
						ok: false,
						error,
					});
				});
		})
		.catch((error) => {
			res.status(400).render("./admin/articles/edit", {
				ok: false,
				error,
			});
		});
});

//Update
router.post("/articulo/:id", (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updateOptions = {
		new: true,
		runValidators: true,
		context: "query",
	};

	Article.findByIdAndUpdate(id, data, updateOptions, (error, articleDB) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al actualizar el artículo: ${error}`});
			return res.status(400).redirect("/articulos");
		}

		req.flash("info", {ok: true, msg: "Artículo actualizado exitosamente"});
		return res.redirect("/articulos");
	});
});

//Delete
router.delete("/articulo/:id", (req, res) => {
	console.log(req.params.id);
	const id = req.params.id;
	Article.findByIdAndDelete(id)
		.then((result) => {
			req.flash("info", {ok: true, msg: "Artículo eliminado exitosamente"});
			res.json({ redirect: "/articulos" });
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
