const express = require("express");
const mongoose = require("mongoose");

// Models
const User = require("./Schema/User");
const Category = require("./Schema/Category");
const Item = require("./Schema/Item");

const app = express();
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("Hello from Express with Mongoose models!");
});

// Get all users
app.get("/users", async (req, res) => {
	try {
		const users = await User.find();
		if (users.length === 0) {
			return res.status(404).json({ message: "No users found" });
		}
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve users" });
	}
});

// Create a new user
app.post("/signup", async (req, res) => {
	try {
		const newUser = new User(req.body);
		const savedUser = await newUser.save();
		res.status(201).json(savedUser); // 201 Created status code
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create user" });
	}
});

app.post("/login", async (req, res) => {
	console.log("/LOGIN");
	console.log(req.body);
	try {
		const { email, password } = req.body;

		// Check for missing credentials
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: "Please provide email and password" });
		}

		// Find user by email
		const user = await User.findOne({ email });

		// User not found
		if (!user)
			return res.status(401).json({ error: "Invalid email or password" });

		if (user.password === password) res.status(201).send(user);
		else
			return res.status(401).json({ error: "Invalid email or password" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error during login" });
	}
});

// Get all categories
app.get("/categories", async (req, res) => {
	try {
		const categories = await Category.find();
		if (categories.length === 0) {
			return res.status(404).json({ message: "No categories found" });
		}
		res.json(categories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve categories" });
	}
});

// Create a new category
app.post("/categories", async (req, res) => {
	try {
		const newCategory = new Category(req.body);
		const savedCategory = await newCategory.save();
		res.status(201).json(savedCategory); // 201 Created status code
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: "Failed to create category" });
	}
});

// Update a category
app.put("/categories/:id", async (req, res) => {
	try {
		const categoryId = req.params.id;
		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			req.body,
			{ new: true }
		); // Return updated document

		if (!updatedCategory) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.json(updatedCategory);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update category" });
	}
});

// Get all items in a certain category
app.get("/categories/:categoryId", async (req, res) => {
	try {
		const categoryId = req.params.categoryId;
		const items = await Item.find({ category_id: categoryId });

		if (items.length === 0) {
			return res
				.status(404)
				.json({ message: "No items found for this category" });
		}

		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve items" });
	}
});

app.get("/categories/:id/data", async (req, res) => {
	try {
		const categoryId = req.params.id;
		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.json(category);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve category" });
	}
});

// Get all items with populated category details
app.get("/items", async (req, res) => {
	try {
		const items = await Item.find().populate("category_id");
		if (items.length === 0) {
			return res.status(404).json({ message: "No items found" });
		}
		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve items" });
	}
});

app.post("/items", async (req, res) => {
	try {
		const newItem = new Item(req.body);
		const savedItem = await newItem.save();
		res.status(201).json(savedItem); // 201 Created status code
	} catch (err) {
		console.error(err);
		// Handle specific validation errors or send a generic error message
		if (err.name === "ValidationError") {
			const validationErrors = Object.values(err.errors).map(
				(error) => error.message
			);
			res.status(400).json({ error: validationErrors });
		} else {
			res.status(500).json({ error: "Failed to create item" });
		}
	}
});

// Update an item
app.put("/items/:id", async (req, res) => {
	try {
		const itemId = req.params.id;
		const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, {
			new: true,
		}); // Return updated document

		if (!updatedItem) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.json(updatedItem);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update item" });
	}
});

app.get("/items/:id", async (req, res) => {
	try {
		const itemId = req.params.id;
		const item = await Item.findById(itemId).populate("category_id");

		if (!item) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.json(item);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to retrieve item" });
	}
});

// Search Functionality

// Search categories by name (regular expression)
app.get("/search/categories", async (req, res) => {
	try {
		const searchTerm = req.query.name;
		let categories;

		if (searchTerm) {
			categories = await Category.find({
				name: { $regex: searchTerm, $options: "i" },
			});
		} else {
			categories = await Category.find({});
		}

		res.json(categories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to search categories" });
	}
});

// Search items by name (regular expression)
app.get("/search/items", async (req, res) => {
	try {
		const searchTerm = req.query.name;
		let items;

		if (searchTerm) {
			items = await Item.find({
				name: { $regex: searchTerm, $options: "i" },
			});
		} else {
			items = await Item.find({});
		}

		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to search categories" });
	}
});

const port = process.env.PORT || 3000;
const connectionString =
	"mongodb+srv://admin:admin@map.t0qvaey.mongodb.net/?retryWrites=true&w=majority&appName=map";
async function start() {
	try {
		// Connect to MongoDB
		await mongoose.connect(connectionString);
		console.log("Connected to MongoDB");

		// Start the server
		app.listen(port, () => console.log(`Server listening on port ${port}`));
	} catch (err) {
		console.error(err);
		process.exit(1); // Exit the process on error
	}
}

// Call the start function
start();
