const express = require("express");
const app = express();
const path = require("path");
const expressHandlebars = require("express-handlebars");
const _handlebars = require("handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { select } = require("./helpers/handlebars-helpers");
var methodOverride = require("method-override");

app.use(methodOverride("_method"));

mongoose
	.connect("mongodb://localhost:27017/cms", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((db) => {
		console.log("Mongoose Connected");
	})
	.catch((error) => {
		console.log("Error");
	});

app.use(express.static(path.join(__dirname, "public")));
//for converting request into json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine(
	"handlebars",
	expressHandlebars({
		defaultLayout: "home",
		helpers: { select: select },
		handlebars: allowInsecurePrototypeAccess(_handlebars),
	})
);
app.set("view engine", "handlebars");

const homeRoutes = require("./routes/home/index");
const adminRoutes = require("./routes/admin/index");
const adminPostRoutes = require("./routes/admin/posts");

app.use("/", homeRoutes);

app.use("/admin", adminRoutes);
app.use("/admin/posts", adminPostRoutes);

app.listen(8080, () => {
	console.log("Listening...");
});
