const fs = require("fs");
const path = require("path");
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Civic Connect";
async function sendMail({ to, subject, html, attachments }) {
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    console.log(`[mailer:DRY-RUN] To: ${to} | Subject: ${subject}`);
    return {
      sent: false,
      error: "Brevo API key / sender email not configured",
    };
  }
  const body = {
    sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };
  if (attachments && attachments.length > 0) {
    try {
      body.attachment = attachments.map((a) => ({
        name: a.filename,
        content: fs.readFileSync(a.path).toString("base64"),
      }));
    } catch (err) {
      console.error("[mailer] Failed to read attachment:", err.message);
    }
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Brevo API responded ${res.status}: ${errText}`);
    }
    return { sent: true };
  } catch (err) {
    console.error("[mailer] Failed to send email:", err.message);
    return { sent: false, error: err.message };
  }
}
function imageAttachment(imagePath) {
  if (!imagePath) return [];
  return [
    {
      filename: path.basename(imagePath),
      path: path.join(__dirname, "..", imagePath),
    },
  ];
}
module.exports = { sendMail, imageAttachment };
