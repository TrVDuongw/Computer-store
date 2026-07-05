const express = require("express");
const HomeController = require("../controllers/HomeController");
const AuthController = require("../controllers/AuthController");
const ProductController = require("../controllers/ProductController");
const CartController = require("../controllers/CartController");
const PCBuilderController = require("../controllers/PCBuilderController");
const { requireLogin } = require("../config/AuthFilter");

const router = express.Router();

router.get("/", HomeController.index);
router.get("/products", ProductController.list);
router.get("/products/:id", ProductController.detail);
router.get("/pc-builder", PCBuilderController.show);
router.get("/api/pc-builder/compatible", PCBuilderController.compatible);

router.get("/cart", CartController.show);
router.post("/cart/add/:id", requireLogin, CartController.add);
router.post("/cart/update/:id", requireLogin, CartController.update);
router.post("/cart/remove/:id", requireLogin, CartController.remove);
router.post("/checkout", requireLogin, CartController.checkout);

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
router.get("/register", AuthController.showRegister);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);

module.exports = router;
