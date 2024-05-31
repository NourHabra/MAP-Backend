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
			{ name: "Electronics", image_url: "https://placehold.co/" },
			{ name: "Clothing", image_url: "https://placehold.co/" },
			{ name: "Homeware", image_url: "https://placehold.co/" },
		]);

		// Create some dummy users (replace with secure password hashing)
		const users = await User.create([
			{
				name: "John Doe",
				email: "john.doe@example.com",
				phone_number: "+1234567890",
				password: "password123",
				role: "user",
			},
			{
				name: "Jane Doe",
				email: "jane.doe@example.com",
				phone_number: "+9876543210",
				password: "password456",
				role: "admin",
			},
		]);

		// Create some dummy items with category references
		const items = await Item.create([
			{
				category_id: categories[0]._id,
				name: "Laptop",
				image_url: "https://placehold.co/",
				price: 1000,
				additional_info: "16GB RAM, 512GB SSD",
			},
			{
				category_id: categories[1],
				name: "T-Shirt",
				image_url: "https://placehold.co/",
				price: 20,
				additional_info: "Cotton, size M",
			},
			{
				category_id: categories[2],
				name: "Coffee Maker",
				image_url: "https://placehold.co/",
				price: 50,
				additional_info: "Brews 12 cups",
			},
			{
				category_id: categories[0],
				name: "Headphones",
				image_url: "https://placehold.co/",
				price: 75,
				additional_info: "Wireless, noise-cancelling",
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
