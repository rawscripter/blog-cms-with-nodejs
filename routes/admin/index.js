const express = require("express");

const router = express.Router();

const Post = require("../../models/Posts");
const faker = require("faker");

//middleware
router.all("/*", (req, res, next) => {
	req.app.locals.layout = "admin";
	next();
});

router.get("/", (req, res) => {
	res.render("admin/index");
});
router.post("/generate-fake-post", (req, res) => {
	let numebrOfPosts = parseInt(req.body.postNumber);
	if (!Number.isInteger(numebrOfPosts)) res.redirect("/admin");

	for (var i = 0; i < numebrOfPosts; i++) {
		let statusArray = ["Public", "Private", "Draft"];
		var status = statusArray[Math.floor(Math.random() * statusArray.length)];
		let post = new Post();
		post.title = faker.animal.cat();
		post.status = status;
		post.allowComments = faker.random.boolean();
		post.body = faker.lorem.paragraph();
		post.save();
	}
	res.redirect("/admin/posts");
});

module.exports = router;
