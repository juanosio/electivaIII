const { Router } = require("express");
const Category = require("../models/Category.js");

const router = Router();

//Index
router.get("/categorias", (_, res) => {
	Category.find()
		.sort({ createdAt: "desc" })
		.then((categories) => {
			Category.countDocuments((err, conteo) => {
				res.render("./admin/category/index", {
					ok: true,
					length: conteo,
					categorias: categories,
				});
			});
		})
		.catch((error) =>
			res.render("./admin/category/index", { ok: false, error })
		);
});

//Create
router.get("/categorias/crear", (_, res) => {
	res.render("./admin/category/create");
});

//Store
router.post("/categorias", (req, res) => {
	const { name, description } = req.body;
	const category = new Category({
		name,
		description,
	});

	category.save((error, category) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al guardar la categoría: ${error}`});
			return res.status(400).redirect("/categorias");
		}

		req.flash("info", {ok: true, msg: `Categoría guardada exitosamente`});
		return res.redirect("/categorias");
	});
});

//Edit
router.get("/categoria/editar/:id", (req, res) => {
	const id = req.params.id;

	Category.findById(id)
		.then((category) => {
			res.render("./admin/category/edit", {
				ok: true,
				categoria: category,
			});
		})
		.catch((error) => {
			res.status(400).render("./admin/category/edit", {
				ok: false,
				categoria: category,
				error,
			});
		});
});

//Update
router.post("/categoria/:id", (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updateOptions = {
		new: true,
		runValidators: true,
		context: "query",
	};

	Category.findByIdAndUpdate(id, data, updateOptions, (error, categoryDB) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al actualizar la categoría: ${error}`});
			return res.status(400).redirect("/categorias");
		}

		req.flash("info", {ok: true, msg: `Categoría actualizada exitosamente`});
		return res.redirect("/categorias");
	});
});

router.delete("/categoria/:id", (req, res) => {
	const id = req.params.id;
	Category.findByIdAndDelete(id)
		.then((result) => {
			req.flash("info", {ok: true, msg: `Categoría eliminada exitosamente`});
			res.json({ redirect: "/categorias" });
		})
		.catch((err) => {
			req.flash("info", {ok: false, msg: `Error al eliminar la categoría: ${error}`});
			res.json({ redirect: "/categorias" });
		});
});

module.exports = router;
