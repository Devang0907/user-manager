require('dotenv').config()
const { Admin } = require("../model/AdminModel");
const jwt = require('jsonwebtoken');

// const {z}= require('zod');
// const {update_schema, add_schema}=require('../validation/validation')

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validAdmin = await Admin.findOne({
            where: { email, password }
        });

        if (!validAdmin) {
            return res.status(401).json({ msg: "Invalid credentials." });
        }

        const token = jwt.sign({ email: email }, process.env.JWT_PASS, { expiresIn: "1h" });

        return res
            .cookie("token", token, {
                httpOnly: true,  // Prevents XSS attacks (cannot be accessed via JavaScript)
                sameSite: "None", // Required for cross-origin requests
                secure: true,
                maxAge: 1 * 60 * 60 * 1000, // 1 hours
            })
            .json({ message: "Login successful", token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminExists = await Admin.findOne({ where: { email: email } });

        if (adminExists) {
            return res.status(400).json({ msg: "Admin already exists" });
        }

        await Admin.create({ email, password });
        return res.status(201).json({ msg: "You are registered as an admin." });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const admin = await Admin.findOne({ where: { email: email } });
        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        if (!(oldPassword === admin.password)) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        admin.password = newPassword;
        await admin.save();
        res.json({ message: "Password changed successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



module.exports = { signin, signup, changePassword };