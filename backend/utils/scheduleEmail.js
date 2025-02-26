require('dotenv').config()
const cron = require("node-cron");
const sendEmail = require("./sendEmail");
const { Admin } = require("../model/AdminModel");

// Function to schedule a Welcome Email after 1 minute (for testing)
const scheduleWelcomeEmail = (email) => {
    cron.schedule("* * * * *", async () => { // Runs every minute
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) return; // If user doesn't exist, return

        const dashboardLink = `${process.env.FRONTEND_URL}/`;
        const timeElapsed = (Date.now() - admin.createdAt) / (1000 * 60); // Convert to minutes
        if (timeElapsed >= 1) { // Check if 1 minute has passed
            await sendEmail(
                email,
                "Welcome to Our Platform!",
                `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
                   <div style="max-width: 500px; background: white; padding: 20px; border-radius: 10px; 
                               box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); margin: auto;">
                       <h2 style="color: #333;">🎉 Welcome to Our Platform! 🎉</h2>
                       <p style="color: #555; font-size: 16px;">
                           Thank you for signing up! We're thrilled to have you onboard.
                         </p>
                         <p style="color: #777; font-size: 14px;">
                             If you have any questions, feel free to reach out. We're here to help!
                       </p>
                       <a href=${dashboardLink} 
                       style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; 
                               text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 10px;">
                           Visit Dashboard
                       </a>
                       <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                       <p style="color: #999; font-size: 12px;">Need help? Contact our support team.</p>
                   </div>                   
                </div>`
            );
            console.log(`Welcome email sent to ${email}`);
        }
    });
};

module.exports={scheduleWelcomeEmail}