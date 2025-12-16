const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
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

    if (!name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: "Name and email are required.",
        }),
      };
    }

    if (!process.env.RESEND_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Missing RESEND_API_KEY in Netlify env vars.",
        }),
      };
    }

    if (!process.env.TO_EMAIL) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Missing TO_EMAIL in Netlify env vars.",
        }),
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

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

    const fromAddress = "K.Snap Studio <hello@ksnapstudio.ca>"; // MUST match verified domain

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: process.env.TO_EMAIL,
      reply_to: email,
      subject,
      text,
    });

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: error.message || "Failed to send email.",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error("❌ Resend failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: err.message || "Failed to send inquiry email.",
      }),
    };
  }
};