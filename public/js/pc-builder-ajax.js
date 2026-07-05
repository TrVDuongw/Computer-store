const cpuSelect = document.getElementById("cpuSelect");
const mainboardSelect = document.getElementById("mainboardSelect");
const ramSelect = document.getElementById("ramSelect");

function fillSelect(select, products, placeholder, labelBuilder) {
  const currentValue = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = labelBuilder(product);
    select.appendChild(option);
  });
  select.value = currentValue;
}

async function refreshCompatibility() {
  const params = new URLSearchParams({
    cpuId: cpuSelect.value,
    mainboardId: mainboardSelect.value,
  });
  const response = await fetch(`/api/pc-builder/compatible?${params}`);
  const data = await response.json();
  fillSelect(mainboardSelect, data.mainboards, "Chon mainboard", (product) => `${product.name} - ${product.specs.socket}`);
  fillSelect(ramSelect, data.rams, "Chon RAM", (product) => `${product.name} - ${product.specs.type}`);
}

if (cpuSelect && mainboardSelect && ramSelect) {
  cpuSelect.addEventListener("change", refreshCompatibility);
  mainboardSelect.addEventListener("change", refreshCompatibility);
}
