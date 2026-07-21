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

export async function sendApplicationConfirmation(application) {
  const html = `
    <h1>Application Received</h1>
    <p>Thank you for applying, <strong>${application.name}</strong>!</p>
    <p>We've received your application for the <strong>${application.roleTitle}</strong> role. Below is a summary of your submission:</p>
    <h2>Application Summary</h2>
    <ul>
      <li><strong>Name:</strong> ${application.name}</li>
      <li><strong>Email:</strong> ${application.email}</li>
      <li><strong>Phone:</strong> ${application.phone || 'Not provided'}</li>
      <li><strong>Role:</strong> ${application.roleTitle}</li>
      ${application.portfolioUrl ? `<li><strong>Portfolio:</strong> ${application.portfolioUrl}</li>` : ''}
      ${application.linkedinUrl ? `<li><strong>LinkedIn:</strong> ${application.linkedinUrl}</li>` : ''}
      ${application.coverNote ? `<li><strong>Note:</strong> ${application.coverNote}</li>` : ''}
    </ul>
    <h2>Next Steps</h2>
    <p>Our team reviews every application personally. If your background is a fit for what we're building, we'll reach out to schedule an intro call within 5 business days.</p>
    <p>Best regards,<br>The Infinity Pillars Team</p>
  `;

  const mailer = getTransporter();

  if (!mailer) {
    console.log('[email] SMTP not configured — skipping application confirmation for', application.email);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: application.email,
    subject: `Application Received — ${application.roleTitle}`,
    html,
  });
}

export async function sendReferralConfirmation(referral) {
  const html = `
    <h1>Referral Submitted</h1>
    <p>Thanks, <strong>${referral.referrerName}</strong> — your referral is in.</p>
    <h2>Referral Summary</h2>
    <ul>
      <li><strong>Your Name:</strong> ${referral.referrerName}</li>
      <li><strong>Your Email:</strong> ${referral.referrerEmail}</li>
      <li><strong>Referred:</strong> ${referral.friendName}</li>
      <li><strong>Company:</strong> ${referral.friendCompany}</li>
      ${referral.friendEmail ? `<li><strong>Their Email:</strong> ${referral.friendEmail}</li>` : ''}
      ${referral.note ? `<li><strong>Note:</strong> ${referral.note}</li>` : ''}
    </ul>
    <h2>What Happens Next</h2>
    <p>We'll reach out to ${referral.friendName} within 2 business days. If they engage us and become a paying client, you'll earn 10% of the engagement value — we'll be in touch to confirm payout details once the deal closes.</p>
    <p>Best regards,<br>The Infinity Pillars Team</p>
  `;

  const mailer = getTransporter();

  if (!mailer) {
    console.log('[email] SMTP not configured — skipping referral confirmation for', referral.referrerEmail);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: referral.referrerEmail,
    subject: 'Referral Submitted — Infinity Pillars',
    html,
  });
}

export async function sendContactConfirmation(message) {
  const html = `
    <h1>Message Received</h1>
    <p>Thanks for reaching out, <strong>${message.name}</strong>!</p>
    <p>We've received your message and a real person will read it shortly. Below is a copy of what you sent:</p>
    <h2>Your Message</h2>
    <ul>
      <li><strong>Name:</strong> ${message.name}</li>
      <li><strong>Email:</strong> ${message.email}</li>
      ${message.company ? `<li><strong>Company:</strong> ${message.company}</li>` : ''}
      ${message.phone ? `<li><strong>Phone:</strong> ${message.phone}</li>` : ''}
      ${message.budget ? `<li><strong>Budget:</strong> ${message.budget}</li>` : ''}
      <li><strong>Message:</strong> ${message.message}</li>
    </ul>
    <h2>Next Steps</h2>
    <p>We read every message personally and reply within one business day.</p>
    <p>Best regards,<br>The Infinity Pillars Team</p>
  `;

  const mailer = getTransporter();

  if (!mailer) {
    console.log('[email] SMTP not configured — skipping contact confirmation for', message.email);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: message.email,
    subject: 'Message Received — Infinity Pillars',
    html,
  });
}
