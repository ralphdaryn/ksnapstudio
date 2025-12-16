// client/netlify/functions/contact.js

exports.handler = async (event) => {
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

    if (!process.env.RESEND_API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "Missing RESEND_API_KEY." }),
      };
    }

    const toEmail = process.env.TO_EMAIL || "k.snap.photographer@gmail.com";

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

    // Use a default Resend sender (works immediately). Later you can verify ksnapstudio.ca for a branded sender.
    const from = "K.Snap Studio <onboarding@resend.dev>";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: [toEmail],
        reply_to: email,
        subject,
        text,
      }),
    });

    const resendJson = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: resendJson?.message || "Resend failed to send email.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: err?.message || "Failed to send inquiry.",
      }),
    };
  }
};