const express = require("express");
const AdminController = require("../controllers/AdminController");
const { requireAdmin } = require("../config/AuthFilter");

const router = express.Router();

router.use(requireAdmin);
router.get("/", AdminController.dashboard);
router.get("/products", AdminController.products);
router.post("/products", AdminController.createProduct);
router.post("/products/:id/update", AdminController.updateProduct);
router.post("/products/:id/delete", AdminController.deleteProduct);
router.get("/orders", AdminController.orders);
router.post("/orders/:id/status", AdminController.updateOrder);

module.exports = router;
