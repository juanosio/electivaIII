const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;