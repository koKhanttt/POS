const Admin = require("../../models/Admins")
const User = require("../../models/Users")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "POS";

const getRegisterPage = (req, res) => {
    res.render("auth/register", {
        docTitle: "Register",
        pageTitle: "Register New Account",
        page: "register"
    })
}

const getLoginPage = (req, res) => {
    res.render("auth/login", {
        docTitle: "Login",
        pageTitle: "Login to Your Account",
        page: "login",
        error: req.query.error || null
    })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.redirect("/login?error=User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.redirect("/login?error=Invalid password");

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 8*60*60*1000 });
        res.redirect("/");
    } catch (error) {
        res.redirect("/login?error=Login failed");
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};

// Admin Login
const getAdminLoginPage = (req, res) => {
    res.render("auth/adminLogin", {
        layout: "./layouts/adminApp",
        docTitle: "Admin Login",
        pageTitle: "Admin Login to Your Account",
        page: "adminLogin",
        error: req.query.error || null
    })
}

const postAdminLoginPage = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.redirect("/admin/login?error=Admin not found");

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.redirect("/admin/login?error=Invalid password");

        // Create JWT token
        const token = jwt.sign(
            { id: admin._id, name: admin.name, username: admin.username, role: admin.role },
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 8*60*60*1000 });
        res.redirect("/admin/dashboard");
    } catch (error) {
        res.redirect("/admin/login?error=Login failed");
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin/login");
};

exports.getRegisterPage = getRegisterPage
exports.getLoginPage = getLoginPage
exports.loginUser = loginUser
exports.logoutUser = logoutUser

// Admin Exports
exports.getAdminLoginPage = getAdminLoginPage
exports.postAdminLoginPage = postAdminLoginPage
exports.logoutAdmin = logoutAdmin