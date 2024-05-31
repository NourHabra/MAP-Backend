const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
	category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image_url: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	additional_info: {
		type: String,
	},
});

module.exports = mongoose.model("Item", itemSchema);
