// client/netlify/functions/contact.js
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "Method Not Allowed (POST only)",
      }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const shootType = (data.type || "").trim();
    const pkg = (data.pkg || "").trim();
    const heardFrom = (data.heardFrom || "").trim();

    const weddingDate = (data.weddingDate || "").trim();
    const ceremonyTime = (data.ceremonyTime || "").trim();
    const gettingReadyLocation = (data.gettingReadyLocation || "").trim();
    const ceremonyLocation = (data.ceremonyLocation || "").trim();
    const receptionLocation = (data.receptionLocation || "").trim();
    const notes = (data.notes || "").trim();

    // Basic validation
    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: "Name and email are required.",
        }),
      };
    }

    // Wedding validation (optional but recommended)
    if (shootType === "wedding" && (!weddingDate || !ceremonyTime)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: "Wedding date and ceremony time are required.",
        }),
      };
    }

    // ✅ Env vars guard (most common Netlify issue)
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: "Server email is not configured (missing env vars).",
        }),
      };
    }

    // ✅ More reliable Gmail SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER, // k.snap.photographer@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // 16-char Gmail App Password
      },
    });

    const subject = `📸 New Booking Inquiry — ${shootType || "Session"}`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      shootType ? `Shoot Type: ${shootType}` : null,
      pkg ? `Package: ${pkg}` : null,
      heardFrom ? `Heard From: ${heardFrom}` : null,
      "",
      shootType === "wedding"
        ? [
            "Wedding Details:",
            weddingDate ? `Wedding Date: ${weddingDate}` : null,
            ceremonyTime ? `Ceremony Time: ${ceremonyTime}` : null,
            gettingReadyLocation
              ? `Getting Ready Location: ${gettingReadyLocation}`
              : null,
            ceremonyLocation ? `Ceremony Location: ${ceremonyLocation}` : null,
            receptionLocation
              ? `Reception Location: ${receptionLocation}`
              : null,
          ]
            .filter(Boolean)
            .join("\n")
        : `Notes:\n${notes || "(none)"}`,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: `"K.Snap Studio Website" <${process.env.GMAIL_USER}>`,
      to: "k.snap.photographer@gmail.com", // or: process.env.GMAIL_USER
      replyTo: email,
      subject,
      text,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    // ✅ Return real Nodemailer error info (debug)
    console.error("❌ Email send failed:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: err?.message || "Failed to send inquiry email.",
        code: err?.code || null,
        response: err?.response || null,
      }),
    };
  }
};