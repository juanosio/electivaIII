const { Router } = require("express");
const router = Router();
const Supplier = require("../models/Supplier.js");

//Index
router.get("/proveedores", (req, res) => {
	Supplier.find()
		.sort({ createdAt: "desc" })
		.then((suppliers) => {
			Supplier.countDocuments((err, conteo) => {
				res.render("./admin/supplier/index", {
					ok: true,
					length: conteo,
					proveedores: suppliers,
				});
			});
		})
		.catch((error) =>
			res.render("./admin/category/index", { ok: false, error })
		);
});

//Create
router.get("/proveedores/crear", (req, res) => {
	res.render("./admin/supplier/create");
});

//Store
router.post("/proveedores", (req, res) => {
	const { name, description } = req.body;
	const supplier = new Supplier({
		name,
		description,
	});

	supplier.save((error, supplier) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al registrar el proveedor: ${error}`});
			return res.status(400).redirect("/proveedores");
		}

		req.flash("info", {ok: true, msg: `Proveedor registrado exitosamente`});
		return res.redirect("/proveedores");
	});
});

//Edit
router.get("/proveedor/editar/:id", (req, res) => {
	const id = req.params.id;

	Supplier.findById(id)
		.then((supplier) => {
			res.render("./admin/supplier/edit", {
				ok: true,
				proveedor: supplier,
			});
		})
		.catch((error) => {
			res.status(400).render("./admin/supplier/edit", {
				ok: false,
				proveedor: supplier,
				error,
			});
		});
});

//Update
router.post("/proveedor/:id", (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const updateOptions = {
		new: true,
		runValidators: true,
		context: "query",
	};

	Supplier.findByIdAndUpdate(id, data, updateOptions, (error, supplierDB) => {
		if (error) {
			req.flash("info", {ok: false, msg: `Error al actualizar el proveedor: ${error}`});
			return res.status(400).redirect("/proveedores");
		}

		req.flash("info", {ok: true, msg: `Proveedor actualizado exitosamente`});
		return res.redirect("/proveedores");
	});
});

//Delete
router.delete("/proveedor/:id", (req, res) => {
	const id = req.params.id;
	Supplier.findByIdAndDelete(id)
		.then((result) => {
			res.json({ redirect: "/proveedores" });
		})
		.catch((err) => {
			req.flash("info", {ok: false, msg: `Error al eliminar el proveedor: ${error}`});
			res.json({ redirect: "/proveedores" });

		});
});

module.exports = router;
