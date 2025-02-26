require('dotenv').config()
const { Admin } = require("../model/AdminModel");
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { scheduleWelcomeEmail } = require('../utils/scheduleEmail');
const i18next = require("../utils/i18n");

// const {z}= require('zod');
// const {update_schema, add_schema}=require('../validation/validation')

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const lang = req.headers["accept-language"] || "en";

        const validAdmin = await Admin.findOne({
            where: { email, password }
        });

        if (!validAdmin) return res.status(401).json({ message: i18next.t("INVALID_CREDENTIALS", { lng: lang }) });

        if (!validAdmin.isVerified) return res.status(401).json({ message: i18next.t("VERIFY_EMAIL_FIRST", { lng: lang }) });

        const token = jwt.sign({ email: email }, process.env.JWT_PASS, { expiresIn: "1h" });

        return res.status(201).json({ message: i18next.t("LOGIN_SUCCESSFUL", { lng: lang }), token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const signup = async (req, res) => {
    try {
        const lang = req.headers["accept-language"] || "en";
        const { email, password } = req.body;

        const adminExists = await Admin.findOne({ where: { email } });

        if (adminExists) {
            return res.status(400).json({ message: i18next.t("ADMIN_EXISTS", { lng: lang }) });
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

        return res.status(201).json({ message: i18next.t("VERIFICATION_EMAIL_SENT", { lng: lang }) });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: i18next.t("INTERNAL_SERVER_ERROR", { lng: lang }) });
    }
};

const verifyEmail = async (req, res) => {
    const lang = req.headers["accept-language"] || "en";
    try {
        const { token } = req.params;

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_PASS);
        const admin = await Admin.findOne({ where: { email: decoded.email, verificationToken: token } });

        if (!admin || admin.tokenExpires < Date.now()) {
            return res.status(400).json({ message: i18next.t("INVALID_OR_EXPIRED_TOKEN", { lng: lang }) });
        }

        // Mark admin as verified
        admin.isVerified = true;
        admin.verificationToken = null;
        admin.tokenExpires = null;
        await admin.save();

        return res.status(200).json({ message: i18next.t("EMAIL_VERIFIED", { lng: lang }) });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const lang = req.headers["accept-language"] || "en";
        const { email, oldPassword, newPassword } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(400).json({ message: i18next.t("ADMIN_NOT_FOUND", { lng: lang }) });
        }

        // Verify old password
        if (!(oldPassword === admin.password)) {
            return res.status(400).json({ message: i18next.t("INCORRECT_OLD_PASSWORD", { lng: lang }) });
        }

        // Check if new password exists in the last 3 passwords
        const passwordHistory = admin.password_history || [];
        for (const oldPass of passwordHistory) {
            if (newPassword ===  oldPass) {
                return res.status(400).json({ message: i18next.t("PASSWORD_ALREADY_USED", { lng: lang }) });
            }
        }

        // Update password and maintain only last 3 passwords in history
        const updatedHistory = [admin.password, ...passwordHistory].slice(0, 3);

        admin.password = newPassword;
        admin.password_history = updatedHistory;

        await admin.save();

        return res.json({ message: i18next.t("PASSWORD_CHANGED", { lng: lang }) });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



module.exports = { signin, signup, changePassword, verifyEmail };