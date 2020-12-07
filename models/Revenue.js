const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const revenueSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId, ref: "Supplier",
        required: true
    },
    comprobanteType: {
        type: String,
        required: true
    },
    comprobanteSerie: {
        type: Number,
        required: true
    },
    comprobanteNro: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0.18
    },
    articles: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Revenue = mongoose.model("Revenue", revenueSchema);

module.exports = Revenue;