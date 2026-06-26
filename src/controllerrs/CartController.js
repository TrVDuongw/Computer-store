const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");

function getCart(req) {
    req.session.cart = req.session.cart || [];
    return req.session.cart;
}

function show(req, res) {
    const cart = getCart(req);
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    res.render("client/cart", { title: "Gio hang", cart, total });
}

async function add(req, res) {
    const product = await ProductModel.getById(req.params.id);
    if (!product) return res.redirect("/products");

    const cart = getCart(req);
    const item = cart.find((entry) => entry.product.id === product.id);
    if (item) item.quantity += 1;
    else cart.push({ product, quantity: 1 });

    req.session.flash = { type: "success", message: "Da them san pham vao gio hang." };
    res.redirect(req.get("Referrer") || "/cart");
}

function update(req, res) {
    const cart = getCart(req);
    const item = cart.find((entry) => entry.product.id === Number(req.params.id));
    if (item) item.quantity = Math.max(Number(req.body.quantity), 1);
    res.redirect("/cart");
}

function remove(req, res) {
    req.session.cart = getCart(req).filter((entry) => entry.product.id !== Number(req.params.id));
    res.redirect("/cart");
}

async function checkout(req, res) {
    const cart = getCart(req);
    if (!cart.length) return res.redirect("/cart");
    await OrderModel.create({ user: req.session.user, cart });
    req.session.cart = [];
    req.session.flash = { type: "success", message: "Dat hang thanh cong. Admin se duyet don som." };
    res.redirect("/cart");
}

module.exports = { show, add, update, remove, checkout };
