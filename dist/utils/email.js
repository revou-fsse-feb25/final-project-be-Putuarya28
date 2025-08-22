"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostCallNotesEmail = sendPostCallNotesEmail;
exports.sendConfirmationEmail = sendConfirmationEmail;
exports.sendRescheduleEmail = sendRescheduleEmail;
async function sendPostCallNotesEmail(to, booking, details) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    // Format details object into readable lines
    let detailsText = Object.entries(details)
        .map(([key, value]) => `- ${key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}: ${value}`)
        .join("\n");
    await transporter.sendMail({
        from: `"Luh Suastini Kebaya" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Meeting Summary & Confirmation",
        text: `Hi ${booking.name},\n\nThank you for joining the video call session.\n\nHere are the details and confirmation from our discussion:\n\n${detailsText}\n\nIf you have any questions or need further clarification, feel free to reply to this email or contact us at +6285923478226.\n\nBest regards,\nLuh Suastini Kebaya`,
    });
}
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendConfirmationEmail(to, booking) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Luh Suastini Kebaya" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Booking Confirmed",
        text: `Hi ${booking.name},
We're pleased to confirm your booking for ${new Date(booking.date).toLocaleDateString()} at ${booking.time}.
Your reservation has been successfully secured, and we're looking forward to welcoming you.
Booking Details:
- Name: ${booking.name}
- WhatsApp: ${booking.whatsapp}
- Date: ${new Date(booking.date).toLocaleDateString()}
- Time: ${booking.time}

We will text you 30 minutes before the video call starts.
Please ensure you have a stable internet connection for the video call.
If you have any questions, need to make changes, or require assistance before your appointment, feel free to reach out to us at +6285923478226.
Thank you for choosing us!

Best regards,  
Luh Suastini Kebaya`,
    });
}
async function sendRescheduleEmail(to, booking, prevBooking) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: `"Luh Suastini Kebaya" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Booking Rescheduled - New Details",
        text: `Dear ${booking.name},

We sincerely apologize for the change in your appointment schedule.

Your booking has been rescheduled:
- Previous Date: ${new Date(prevBooking.date).toLocaleDateString()}
- Previous Time: ${prevBooking.time}
- New Date: ${new Date(booking.date).toLocaleDateString()}
- New Time: ${booking.time}

We understand that changes can be inconvenient and appreciate your understanding.
If you have any questions or need further assistance, please reply to this email or contact us at +6285923478226.

Thank you for your flexibility and trust in us.

Best regards,
Luh Suastini Kebaya`,
    });
}
