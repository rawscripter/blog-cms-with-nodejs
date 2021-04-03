const express = require("express");

const mainRoutes = express.Router();

mainRoutes.all("/*", (req, res, next) => {
	req.app.locals.layout = "home";
	next();
});

mainRoutes.get("/", (req, res) => {
	res.render("home/index");
});

mainRoutes.get("/about", (req, res) => {
	res.render("home/about");
});

mainRoutes.get("/login", (req, res) => {
	res.render("home/login");
});

mainRoutes.get("/register", (req, res) => {
	res.render("home/register");
});

module.exports = mainRoutes;
