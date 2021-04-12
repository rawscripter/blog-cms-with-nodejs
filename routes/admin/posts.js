const express = require("express");

const router = express.Router();

const Post = require("../../models/Posts");

//middleware
router.all("/*", (req, res, next) => {
	req.app.locals.layout = "admin";
	next();
});

router.get("/", (req, res) => {
	Post.find({})
		.then((posts) => {
			res.render("admin/posts/index", { posts: posts });
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/create", (req, res) => {
	res.render("admin/posts/create");
});

router.post("/create", (req, res) => {
	let request = req.body;
	let allowComments = true;

	if (request.allowComments == undefined) {
		allowComments = false;
	} else {
		allowComments = true;
	}
	const post = new Post({
		title: request.title,
		body: request.body,
		status: request.status,
		allowComments: allowComments,
	});

	post
		.save()
		.then((postSaved) => {
			// console.log("Post Saved");
			res.redirect("/admin/posts");
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get("/:post/edit", (req, res) => {
	let postID = req.params.post;
	Post.findOne({
		_id: postID,
	}).then((post) => {
		res.render("admin/posts/edit", { post: post });
	});
});

router.put("/:post/update", (req, res) => {
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let postImageName = "";

	if (req.files?.postImage) {
		let postImage = req.files.postImage;
		postImageName = postImage.name;
		uploadPath = appRoot + "/public/uploads/" + postImage.name;
		postImage.mv(uploadPath, (err) => {
			if (err) throw err;
		});
	}

	let request = req.body;
	let allowComments = true;

	if (request.allowComments) {
		allowComments = true;
	} else {
		allowComments = false;
	}

	let postID = req.params.post;

	Post.findByIdAndUpdate(postID, {
		title: request.title,
		body: request.body,
		image: postImageName,
		status: request.status,
		allowComments: allowComments,
	})
		.then((postSaved) => {
			res.redirect("/admin/posts");
		})
		.catch((err) => {
			console.log(err);
		});
});

router.delete("/:post/delete", (req, res) => {
	let request = req.body;

	let postID = req.params.post;
	req.flash("success-message", "Post deleted successfully.");

	Post.deleteOne({
		_id: postID,
	})
		.then((deleted) => {
			res.redirect("/admin/posts");
		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router;
