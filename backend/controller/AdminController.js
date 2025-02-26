require('dotenv').config()
const { Admin } = require("../model/AdminModel");
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { scheduleWelcomeEmail } = require('../utils/scheduleEmail');

// const {z}= require('zod');
// const {update_schema, add_schema}=require('../validation/validation')

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validAdmin = await Admin.findOne({
            where: { email, password }
        });

        if (!validAdmin) return res.status(401).json({ message: "Invalid credentials." });

        if (!validAdmin.isVerified) return res.status(401).json({ message: "Please verify your email first" });

        const token = jwt.sign({ email: email }, process.env.JWT_PASS, { expiresIn: "1h" });

        return res.status(201).json({ message: "Login successful", token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const adminExists = await Admin.findOne({ where: { email } });
    
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }
    
        const verificationToken = jwt.sign({ email }, process.env.JWT_PASS, { expiresIn: "1h" });
    
        await Admin.create({
            email,
            password,
            verificationToken,
            tokenExpires: Date.now() + 3600000
        });
    
        const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    
        await sendEmail(
            email,
            "Verify Your Email",
            `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; 
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); margin: auto;">
                    <h2 style="color: #333;">Welcome to Our Platform! 🎉</h2>
                    <p style="color: #555;">Please verify your email to activate your account.</p>
                    <a href="${verificationLink}" 
                       style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; 
                              text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">
                        Verify Email
                    </a>
                    <p style="color: #777; font-size: 14px; margin-top: 20px;">
                        This link expires in <strong>60 minutes</strong>. If you did not request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Need help? Contact our support team.</p>
                </div>
            </div>`
        );

        // Schedule Welcome Email after 24 hours (for testing every minute)
        scheduleWelcomeEmail(email);
    
        return res.status(201).json({ message: "Verification email sent. Check your inbox." });
    
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }    
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_PASS);
        const admin = await Admin.findOne({ where: { email: decoded.email, verificationToken: token } });

        if (!admin || admin.tokenExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Mark admin as verified
        admin.isVerified = true;
        admin.verificationToken = null;
        admin.tokenExpires = null;
        await admin.save();

        res.json({ message: "Email verified successfully. You can now log in." });

    } catch (error) {
        res.status(500).json({ message: error.message });
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



module.exports = { signin, signup, changePassword, verifyEmail };