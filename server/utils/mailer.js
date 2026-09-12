const nodemailer = require('nodemailer');
const path = require('path');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn(
      '[mailer] EMAIL_USER / EMAIL_PASSWORD not set. Emails will be logged, not sent.'
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transporter;
}

/**
 * Sends an email. If SMTP credentials are not configured, logs the email
 * to the console instead of throwing, so the rest of the app flow (which
 * must never fail just because email delivery failed) keeps working.
 * Returns { sent: boolean, error?: string }
 */
async function sendMail({ to, subject, html, attachments }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[mailer:DRY-RUN] To: ${to} | Subject: ${subject}`);
    return { sent: false, error: 'Email transport not configured' };
  }

  try {
    await t.sendMail({
      from: `"Civic Connect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Failed to send email:', err.message);
    return { sent: false, error: err.message };
  }
}

function imageAttachment(imagePath) {
  if (!imagePath) return [];
  return [
    {
      filename: path.basename(imagePath),
      path: path.join(__dirname, '..', imagePath),
    },
  ];
}

module.exports = { sendMail, imageAttachment };
