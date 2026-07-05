const ProductModel = require("./ProductModel");

const slots = ["CPU", "Mainboard", "RAM", "GPU", "SSD", "PSU"];

function getSlots() {
  return slots;
}

async function getOptions(slot, selected = {}) {
  const products = await ProductModel.getAll({ category: slot });
  if (slot === "Mainboard" && selected.cpuId) {
    const cpu = await ProductModel.getById(selected.cpuId);
    return products.filter((item) => item.specs.socket === cpu?.specs.socket);
  }
  if (slot === "RAM" && selected.mainboardId) {
    const mainboard = await ProductModel.getById(selected.mainboardId);
    return products.filter((item) => item.specs.type === mainboard?.specs.ram);
  }
  return products;
}

async function buildCompatibility(selected = {}) {
  const cpu = await ProductModel.getById(selected.cpuId);
  const mainboard = await ProductModel.getById(selected.mainboardId);
  const ram = await ProductModel.getById(selected.ramId);
  const warnings = [];

  if (cpu && mainboard && cpu.specs.socket !== mainboard.specs.socket) {
    warnings.push("CPU va mainboard khong cung socket.");
  }
  if (ram && mainboard && ram.specs.type !== mainboard.specs.ram) {
    warnings.push("RAM khong dung chuan ho tro cua mainboard.");
  }

  return {
    slots,
    selectedProducts: { cpu, mainboard, ram },
    compatibleMainboards: cpu ? await getOptions("Mainboard", { cpuId: cpu.id }) : await ProductModel.getAll({ category: "Mainboard" }),
    compatibleRams: mainboard ? await getOptions("RAM", { mainboardId: mainboard.id }) : await ProductModel.getAll({ category: "RAM" }),
    warnings,
  };
}

module.exports = { getSlots, getOptions, buildCompatibility };
