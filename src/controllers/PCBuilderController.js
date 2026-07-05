const ProductModel = require("../models/ProductModel");
const PCBuilderModel = require("../models/PCBuilderModel");

async function show(req, res) {
  const selected = {
    cpuId: Number(req.query.cpuId) || null,
    mainboardId: Number(req.query.mainboardId) || null,
    ramId: Number(req.query.ramId) || null,
  };
  res.render("client/pc-builder", {
    title: "PC Builder",
    products: await ProductModel.getAll(),
    selected,
    builder: await PCBuilderModel.buildCompatibility(selected),
  });
}

async function compatible(req, res) {
  res.json({
    mainboards: await PCBuilderModel.getOptions("Mainboard", { cpuId: Number(req.query.cpuId) }),
    rams: await PCBuilderModel.getOptions("RAM", { mainboardId: Number(req.query.mainboardId) }),
  });
}

module.exports = { show, compatible };
