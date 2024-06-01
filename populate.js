const mongoose = require("mongoose");

// Require the models
const Category = require("./Schema/Category");
const Item = require("./Schema/Item");
const User = require("./Schema/User");

// Replace with your MongoDB connection string
const connectionString =
	"mongodb+srv://admin:admin@map.t0qvaey.mongodb.net/?retryWrites=true&w=majority&appName=map";

(async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect(connectionString);
		console.log("Connected to MongoDB");

		// Clear existing data (optional - useful for testing with fresh data)
		await Promise.all([
			Category.deleteMany({}),
			Item.deleteMany({}),
			User.deleteMany({}),
		]);

		// Create some dummy categories
		const categories = await Category.create([
			{ name: "Western Sweets", image_url: "https://placehold.co/" },
			{ name: "Eastern Sweets", image_url: "https://placehold.co/" },
		]);

		// Create some dummy users (replace with secure password hashing)
		const users = await User.create([
			{
				name: "Admin Al-Adminy",
				email: "admin@gmail.com",
				phone_number: "0900000000",
				password: "admin",
				role: "admin",
			},
			{
				name: "Dana Alkhawaldeh",
				email: "dana@gmail.com",
				phone_number: "0948375472",
				password: "dana",
				role: "user",
			},
		]);

		// Create some dummy items with category references
		const items = await Item.create([
			{
				category_id: categories[0]._id,
				name: "Brownies",
				image_url: "https://placehold.co/",
				price: 5.99,
				additional_info: "A rich and chocolaty dessert square.",
			},
			{
				category_id: categories[0]._id,
				name: "Cheesecake",
				image_url: "https://placehold.co/",
				price: 7.99,
				additional_info:
					"A creamy and indulgent dessert made with cream cheese.",
			},
			{
				category_id: categories[0]._id,
				name: "Tiramisu",
				image_url: "https://placehold.co/",
				price: 6.99,
				additional_info:
					"An Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream.",
			},
			{
				category_id: categories[0]._id,
				name: "Chocolate Cake",
				image_url: "https://placehold.co/",
				price: 8.99,
				additional_info:
					"A moist and decadent cake made with chocolate.",
			},
			{
				category_id: categories[0]._id,
				name: "Cookies",
				image_url: "https://placehold.co/",
				price: 3.99,
				additional_info:
					"Delicious baked treats available in various flavors.",
			},
			{
				category_id: categories[0]._id,
				name: "Gingerbread",
				image_url: "https://placehold.co/",
				price: 4.99,
				additional_info:
					"Spiced cookies or cake often associated with the holiday season.",
			},
			{
				category_id: categories[0]._id,
				name: "Chocolate Mousse",
				image_url: "https://placehold.co/",
				price: 6.99,
				additional_info:
					"A light and airy dessert made with whipped chocolate and cream.",
			},
			{
				category_id: categories[0]._id,
				name: "Gelato",
				image_url: "https://placehold.co/",
				price: 4.99,
				additional_info:
					"Italian-style ice cream available in a variety of flavors.",
			},
			{
				category_id: categories[1]._id,
				name: "Baklava",
				image_url: "https://placehold.co/",
				price: 8.99,
				additional_info:
					"A sweet pastry made with layers of filo dough, nuts, and syrup.",
			},
			{
				category_id: categories[1]._id,
				name: "Kunafa",
				image_url:
					"https://www.newarab.com/sites/default/files/media/images/45F513CA-7B96-4AA5-BF1D-72234F18FFCF.jpg",
				price: 10.99,
				additional_info:
					"A Middle Eastern dessert made with shredded phyllo dough, cheese, and syrup.",
			},
			{
				category_id: categories[1]._id,
				name: "Qatayef",
				image_url: "https://placehold.co/",
				price: 7.99,
				additional_info:
					"A popular Arabic dessert similar to pancakes, often filled with nuts or cheese.",
			},
			{
				category_id: categories[1]._id,
				name: "Maamoul",
				image_url: "https://placehold.co/",
				price: 4.99,
				additional_info:
					"A Middle Eastern cookie filled with dates or nuts, often enjoyed during festive occasions.",
			},
			{
				category_id: categories[1]._id,
				name: "Basbousa",
				image_url: "https://placehold.co/",
				price: 3.99,
				additional_info:
					"A sweet semolina cake soaked in syrup, popular in the Middle East.",
			},
			{
				category_id: categories[1]._id,
				name: "Barazek",
				image_url: "https://placehold.co/",
				price: 2.99,
				additional_info:
					"A crispy sesame and pistachio cookie, commonly found in Syrian and Lebanese cuisine.",
			},
		]);

		console.log("Dummy data inserted successfully!");
		process.exit(0); // Exit the process after insertion
	} catch (err) {
		console.error(err);
		process.exit(1); // Exit with error code on failure
	}
})();

mongoose.connection.on("close", () => {
	console.log("Connection to MongoDB closed");
});
