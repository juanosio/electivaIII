const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    id_category: {
        type: Schema.Types.ObjectId, ref: "Category",
        required: true
    },
    img: {
        type: String,
        default: "Empty"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;