const express = require("express");
const { google } = require("googleapis");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const router = express.Router();

// Load credentials from environment variables (Google JWT in Cloud)
const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_CREDENTIALS_BASE64 = process.env.GOOGLE_CREDENTIALS_BASE64;

// Load SendGrid credentials
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Decode the base64 Google credentials
const decodedCredentials = JSON.parse(Buffer.from(GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf-8"));

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

async function accessSpreadsheet() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: decodedCredentials.client_email,
            private_key: decodedCredentials.private_key.replace(/\\n/g, '\n')
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return google.sheets({ version: "v4", auth });
}

// ✅ API Route to Save Booking Data & Send Email
router.post("/submit-booking", async (req, res) => {
    try {
        const sheets = await accessSpreadsheet();
        const bookingData = req.body;
        const emailToCheck = bookingData.email;

        // Fetch existing emails from Google Sheets
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: "Bookings!B:B", // Column B (Emails)
        });

        const existingEmails = response.data.values ? response.data.values.flat() : [];

        // Check if the email already exists
        if (existingEmails.includes(emailToCheck)) {
            return res.status(400).json({ error: "Email already exists. Booking not submitted." });
        }

        // If email is unique, append new booking
        const values = [[
            bookingData.name,
            bookingData.email,
            bookingData.phone,
            bookingData.requirements,
            bookingData.date
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Bookings!A:E", // Adjusted based on the number of fields
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values },
        });

        // ✅ Send Email Notification
        const adminEmailMessage = {
            to: ADMIN_EMAIL,
            from: SENDER_EMAIL,
            subject: "New Booking Submission",
            text: `
                A new booking has been submitted:
                Name: ${bookingData.name}
                Email: ${bookingData.email}
                Phone: ${bookingData.phone}
                Requirements: ${bookingData.requirements}
                Date: ${bookingData.date}
            `,
        };

        const userEmailMessage = {
            to: bookingData.email,
            from: SENDER_EMAIL,
            subject: "Booking Confirmation",
            text: `
                Thank you for your booking, ${bookingData.name}!
                We have received your request and will get back to you soon.

                Booking Details:
                - Name: ${bookingData.name}
                - Email: ${bookingData.email}
                - Phone: ${bookingData.phone}
                - Requirements: ${bookingData.requirements}
                - Date: ${bookingData.date}
            `,
        };

        await sgMail.send(adminEmailMessage);
        await sgMail.send(userEmailMessage);

        res.status(200).json({ message: "Booking data saved successfully and emails sent!" });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Failed to save booking data or send emails" });
    }
});

// Example route
router.get("/", (req, res) => {
    res.send("Google Sheets Booking API is working!");
});

module.exports = router;
