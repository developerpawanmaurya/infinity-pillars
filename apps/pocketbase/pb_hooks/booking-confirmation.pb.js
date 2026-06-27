/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "Request Received",
    html: `
      <h1>Request Received</h1>
      <p>Thank you for submitting your booking request, <strong>${e.record.get("name")}</strong>!</p>
      
      <p>We have received your request and our team will review it shortly. Below is a summary of your submission:</p>
      
      <h2>Request Summary</h2>
      <ul>
        <li><strong>Name:</strong> ${e.record.get("name")}</li>
        <li><strong>Company:</strong> ${e.record.get("company")}</li>
        <li><strong>Email:</strong> ${e.record.get("email")}</li>
        <li><strong>Phone:</strong> ${e.record.get("phone") || "Not provided"}</li>
        <li><strong>Services Requested:</strong> ${e.record.get("selectedServices").join(", ")}</li>
        ${e.record.get("bookedDateTime") ? `<li><strong>Preferred Date/Time:</strong> ${e.record.get("bookedDateTime")}</li>` : ""}
        ${e.record.get("additionalInfo") ? `<li><strong>Additional Information:</strong> ${e.record.get("additionalInfo")}</li>` : ""}
      </ul>
      
      <h2>Next Steps</h2>
      <p>Our team will carefully review your booking request and assess availability. We will send you a confirmation email once your request has been approved and scheduled. This typically takes 1-2 business days.</p>
      
      <p>If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
      
      <p>Best regards,<br>The Team</p>
    `
  });
  $app.newMailClient().send(message);
  e.next();
}, "bookings");