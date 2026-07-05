const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");

async function dashboard(req, res) {
  const orders = await OrderModel.getAll();
  res.render("admin/dashboard", {
    title: "Dashboard",
    summary: await OrderModel.getRevenueSummary(),
    orders: orders.slice(0, 5),
  });
}

async function products(req, res) {
  res.render("admin/manage-products", {
    title: "Quan ly linh kien",
    products: await ProductModel.getAll(),
    categories: await ProductModel.getCategories(),
  });
}

async function createProduct(req, res) {
  await ProductModel.create(req.body);
  req.session.flash = { type: "success", message: "Da them linh kien moi vao database." };
  res.redirect("/admin/products");
}

async function updateProduct(req, res) {
  await ProductModel.update(req.params.id, req.body);
  req.session.flash = { type: "success", message: "Da cap nhat linh kien trong database." };
  res.redirect("/admin/products");
}

async function deleteProduct(req, res) {
  await ProductModel.remove(req.params.id);
  req.session.flash = { type: "success", message: "Da xoa linh kien trong database." };
  res.redirect("/admin/products");
}

async function orders(req, res) {
  res.render("admin/manage-orders", {
    title: "Quan ly don hang",
    orders: await OrderModel.getAll(),
  });
}

async function updateOrder(req, res) {
  await OrderModel.updateStatus(req.params.id, req.body.status);
  res.redirect("/admin/orders");
}

module.exports = { dashboard, products, createProduct, updateProduct, deleteProduct, orders, updateOrder };
