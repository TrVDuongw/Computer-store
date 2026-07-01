const UserModel = require("../models/UserModel");

function showLogin(req, res) {
    res.render("client/login", { title: "Dang nhap" });
}

async function login(req, res) {
    const user = await UserModel.verify(req.body.email, req.body.password);
    if (!user) {
        req.session.flash = { type: "error", message: "Email hoac mat khau chua dung." };
        return res.redirect("/login");
    }
    req.session.user = user;
    req.session.flash = { type: "success", message: `Xin chao ${user.name}.` };
    res.redirect(user.role === "admin" ? "/admin" : "/");
}

function showRegister(req, res) {
    res.render("client/register", { title: "Dang ky" });
}

async function register(req, res) {
    if (await UserModel.findByEmail(req.body.email)) {
        req.session.flash = { type: "error", message: "Email da duoc su dung." };
        return res.redirect("/register");
    }
    const user = await UserModel.create(req.body);
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.session.flash = { type: "success", message: "Tao tai khoan thanh cong." };
    res.redirect("/");
}

function logout(req, res) {
    req.session.destroy(() => res.redirect("/"));
}

module.exports = { showLogin, login, showRegister, register, logout };
