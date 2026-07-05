const ProductModel = require("../models/ProductModel");

async function list(req, res) {
  res.render("client/products", {
    title: "San pham",
    products: await ProductModel.getAll(req.query),
    categories: await ProductModel.getCategories(),
    filters: req.query,
  });
}

async function detail(req, res) {
  const product = await ProductModel.getById(req.params.id);
  if (!product) return res.status(404).render("client/404", { title: "Khong tim thay san pham" });
  res.render("client/product-detail", { title: product.name, product });
}

module.exports = { list, detail };
