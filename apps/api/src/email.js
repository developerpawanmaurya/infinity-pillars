import nodemailer from 'nodemailer';

const smtpConfigured = Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

let transporter;

function getTransporter() {
  if (!smtpConfigured) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendBookingConfirmation(booking) {
  const services = booking.selectedServices.join(', ');
  const html = `
    <h1>Request Received</h1>
    <p>Thank you for submitting your booking request, <strong>${booking.name}</strong>!</p>
    <p>We have received your request and our team will review it shortly. Below is a summary of your submission:</p>
    <h2>Request Summary</h2>
    <ul>
      <li><strong>Name:</strong> ${booking.name}</li>
      <li><strong>Company:</strong> ${booking.company}</li>
      <li><strong>Email:</strong> ${booking.email}</li>
      <li><strong>Phone:</strong> ${booking.phone || 'Not provided'}</li>
      <li><strong>Services Requested:</strong> ${services}</li>
      ${booking.bookedDateTime ? `<li><strong>Preferred Date/Time:</strong> ${booking.bookedDateTime}</li>` : ''}
      ${booking.additionalInfo ? `<li><strong>Additional Information:</strong> ${booking.additionalInfo}</li>` : ''}
    </ul>
    <h2>Next Steps</h2>
    <p>Our team will carefully review your booking request and assess availability. We will send you a confirmation email once your request has been approved and scheduled. This typically takes 1-2 business days.</p>
    <p>If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
    <p>Best regards,<br>The Team</p>
  `;

  const mailer = getTransporter();

  if (!mailer) {
    console.log('[email] SMTP not configured — skipping confirmation email for', booking.email);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: booking.email,
    subject: 'Request Received',
    html,
  });
}
