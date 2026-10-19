const mailer = require("../mailer");
const gala = require("./galaConfig");
const { getBooking } = require("./bookingService");

const APP_URL = (process.env.APP_URL || "https://swasthgram.org").replace(/\/$/, "");

// Sent once, right after a gala booking is confirmed paid (see paymentService.js).
async function sendTicketEmail(bookingRef) {
  const booking = await getBooking(bookingRef);
  const seatList = booking.seats.join(", ");
  const amount = `$${Number(booking.totalAmount).toLocaleString("en-US")}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0E4422,#1B6B3A);padding:32px 40px;text-align:center;">
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C8963E;margin-bottom:8px;">Your ticket is confirmed</div>
            <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">${gala.eventName}</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:20px;font-weight:700;color:#1F2937;margin:0 0 6px;">See you there, ${booking.fullName}! 🎉</p>
            <p style="font-size:14px;color:#6B7280;margin:0 0 28px;line-height:1.6;">
              Your seats are reserved and your payment has been received. Keep this email — your booking reference is your entry pass at check-in.
            </p>

            <!-- Ticket stub -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px dashed #C8963E;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:22px 24px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Booking Reference</div>
                <div style="font-size:26px;font-weight:800;color:#1B6B3A;letter-spacing:1px;margin-bottom:18px;">${booking.bookingRef}</div>

                ${[
                  ["Date", gala.eventDate],
                  ["Time", gala.eventTime],
                  ["Venue", gala.eventVenue],
                  ["Seats", seatList],
                  ["Guests", String(booking.seatCount)],
                  ["Amount paid", `<strong style="color:#1B6B3A;font-size:15px;">${amount}</strong>`],
                ].map(([label, value]) => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="font-size:12px;color:#6B7280;width:110px;vertical-align:top;">${label}</td>
                    <td style="font-size:13px;color:#1F2937;font-weight:600;">${value}</td>
                  </tr>
                </table>`).join("")}
              </td></tr>
            </table>

            <!-- Impact note -->
            <p style="font-size:13px;color:#4B5563;line-height:1.7;margin:0 0 24px;">
              Every seat funds Swasthgram's work in the field — community health camps, cancer care support, and clean-air programs for communities that need it most. Thank you for being part of the evening.
            </p>

            <p style="font-size:13px;color:#6B7280;margin:0;">We look forward to welcoming you,<br>
              <strong style="color:#1F2937;">Swasthgram Global Foundation</strong><br>
              <a href="${APP_URL}/events/gala26" style="color:#1B6B3A;">${APP_URL.replace(/^https?:\/\//, "")}/events/gala26</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F8F5EE;padding:20px 40px;text-align:center;border-top:1px solid #E8E4DC;">
            <p style="font-size:11px;color:#9CA3AF;margin:0;line-height:1.6;">
              Swasthgram Foundation · New Delhi, India<br>
              <a href="mailto:support@swasthgram.org" style="color:#1B6B3A;">support@swasthgram.org</a> · +91 87507-40000
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await mailer.sendMail({
    from: `"${process.env.ZEPTOMAIL_FROM_NAME || "Swasthgram"}" <${process.env.ZEPTOMAIL_FROM_EMAIL}>`,
    to: `"${booking.fullName}" <${booking.email}>`,
    subject: `Your ticket is confirmed — ${gala.eventName} (${booking.bookingRef})`,
    html,
  });
  console.log(`[Email] Gala ticket confirmation sent to ${booking.email} for ${booking.bookingRef}`);
}

module.exports = { sendTicketEmail };
