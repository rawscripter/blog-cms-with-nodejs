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
const upload = require("express-fileupload");

const session = require("express-session");
const flash = require("connect-flash");

global.appRoot = path.resolve(__dirname);

// for extra form methods PUT | PATCH | DELETE
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//database connection
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
//adding session
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);
app.use(flash());

app.use((req, res, next) => {
	res.locals.success_message = req.flash("success_message");
	next();
});

// setup public path
app.use(express.static(path.join(__dirname, "public")));
// upload
app.use(upload());
//for converting request into json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//template engine
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
