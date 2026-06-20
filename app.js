const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = valueParts.join("=").trim();
    }
  });
}

const webRoutes = require("./src/routes/web");
const adminRoutes = require("./src/routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "computer-component-store-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cart = req.session.cart || [];
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

app.use("/", webRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).render("client/404", { title: "Khong tim thay trang" });
});

app.use((err, req, res, next) => {
  console.error(err);
  req.session.flash = {
    type: "error",
    message: "Co loi khi ket noi hoac ghi du lieu database. Kiem tra MySQL va file .env.",
  };
  res.redirect(req.get("Referrer") || "/");
});

app.listen(PORT, () => {
  console.log(`Computer Component Store dang chay tai http://localhost:${PORT}`);
});
