const db = require("../config/DBConnection");

function normalizeProduct(row) {
    if (!row) return null;
    return {
        ...row,
        price: Number(row.price),
        stock: Number(row.stock),
        featured: Boolean(row.featured),
        performance: Number(row.performance),
        specs: typeof row.specs === "string" ? JSON.parse(row.specs || "{}") : row.specs || {},
    };
}

async function getAll(filters = {}) {
    const where = [];
    const params = [];

    if (filters.keyword) {
        where.push("(name LIKE ? OR brand LIKE ?)");
        params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
    }

    if (filters.category) {
        where.push("category = ?");
        params.push(filters.category);
    }

    if (filters.minPerformance) {
        where.push("performance >= ?");
        params.push(Number(filters.minPerformance));
    }

    const sql = `
    SELECT * FROM products
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY id DESC
  `;
    const [rows] = await db.execute(sql, params);
    return rows.map(normalizeProduct);
}

async function getFeatured() {
    const [rows] = await db.execute("SELECT * FROM products WHERE featured = 1 ORDER BY id DESC LIMIT 8");
    return rows.map(normalizeProduct);
}

async function getById(id) {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ? LIMIT 1", [Number(id)]);
    return normalizeProduct(rows[0]);
}

async function getCategories() {
    const [rows] = await db.execute("SELECT DISTINCT category FROM products ORDER BY category");
    return rows.map((row) => row.category);
}

async function create(product) {
    const [result] = await db.execute(
        `INSERT INTO products (name, category, brand, price, stock, image, featured, performance, specs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            product.name,
            product.category,
            product.brand,
            Number(product.price) || 0,
            Number(product.stock) || 0,
            product.image || "/uploads/component.svg",
            product.featured ? 1 : 0,
            Number(product.performance) || 70,
            JSON.stringify(product.specs || {}),
        ]
    );
    return getById(result.insertId);
}

async function update(id, data) {
    await db.execute(
        `UPDATE products
     SET name = ?, brand = ?, category = ?, price = ?, stock = ?, performance = ?
     WHERE id = ?`,
        [
            data.name,
            data.brand,
            data.category,
            Number(data.price) || 0,
            Number(data.stock) || 0,
            Number(data.performance) || 70,
            Number(id),
        ]
    );
    return getById(id);
}

async function remove(id) {
    const [result] = await db.execute("DELETE FROM products WHERE id = ?", [Number(id)]);
    return result.affectedRows > 0;
}

async function updateStock(productId, amount, connection = db) {
    await connection.execute(
        "UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?",
        [Number(amount), Number(productId)]
    );
}

module.exports = { getAll, getFeatured, getById, getCategories, create, update, remove, updateStock };
