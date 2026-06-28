const db = require("../config/DBConnection");
const ProductModel = require("./ProductModel");

function normalizeOrder(row) {
    return {
        id: row.id,
        customer: row.customer_name,
        total: Number(row.total),
        status: row.status,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString().slice(0, 10) : String(row.created_at).slice(0, 10),
    };
}

async function getAll() {
    const [rows] = await db.execute("SELECT * FROM orders ORDER BY id DESC");
    return rows.map(normalizeOrder);
}

async function create({ user, cart }) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const [orderResult] = await connection.execute(
            "INSERT INTO orders (user_id, customer_name, total, status) VALUES (?, ?, ?, 'Chờ duyệt')",
            [user?.id || null, user?.name || "Khach vang lai", total]
        );

        for (const item of cart) {
            await connection.execute(
                "INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)",
                [orderResult.insertId, item.product.id, item.product.name, item.product.price, item.quantity]
            );
            await ProductModel.updateStock(item.product.id, item.quantity, connection);
        }

        await connection.commit();
        return orderResult.insertId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updateStatus(id, status) {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, Number(id)]);
}

async function getRevenueSummary() {
    const [rows] = await db.execute(
        `SELECT
      COALESCE(SUM(total), 0) AS revenue,
      COUNT(*) AS orders,
      SUM(CASE WHEN status = 'Chờ duyệt' THEN 1 ELSE 0 END) AS pending
     FROM orders`
    );
    return {
        revenue: Number(rows[0].revenue),
        orders: Number(rows[0].orders),
        pending: Number(rows[0].pending),
    };
}

module.exports = { getAll, create, updateStatus, getRevenueSummary };
