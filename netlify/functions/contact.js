const { Resend } = require("resend");

// Keep these maps in sync with your Contact.jsx
const SHOOT_TYPE_LABELS = {
  wedding: "Wedding",
  events: "Event",
  family: "Family",
  portraits: "Portraits",
};

const PACKAGE_LABELS = {
  wedding: {
    "full-day": "Full Day (8–10h)",
    "half-day": "Half Day (4–6h)",
    elopement: "Elopement (2–3h)",
  },
  events: {
    "event-4": "Half Day (4h)",
    "event-8": "Full Day (8h)",
  },
  family: {
    "mini-30": "Mini (30 min)",
    "standard-60": "Standard (60 min)",
  },
  portraits: {
    headshot: "Headshot",
    creative: "Creative Portrait",
    lifestyle: "Lifestyle",
  },
};

function labelForShootType(value) {
  const v = (value || "").trim();
  return SHOOT_TYPE_LABELS[v] || v || "Session";
}

function labelForPackage(type, pkgValue) {
  const t = (type || "").trim();
  const p = (pkgValue || "").trim();
  return (PACKAGE_LABELS[t] && PACKAGE_LABELS[t][p]) || p || "";
}

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

    // Wedding fields kept (only the ones you still use)
    const weddingDate = (data.weddingDate || "").trim();
    const ceremonyLocation = (data.ceremonyLocation || "").trim();

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

    // ✅ Human-friendly labels
    const shootTypeLabel = labelForShootType(shootType);
    const packageLabel = labelForPackage(shootType, pkg);

    // ✅ Subject uses dropdown label (and package label if available)
    const subject = `📸 New Booking Inquiry — ${shootTypeLabel}${
      packageLabel ? ` (${packageLabel})` : ""
    }`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Shoot Type: ${shootTypeLabel}`,
      packageLabel ? `Package: ${packageLabel}` : null,
      heardFrom ? `Heard From: ${heardFrom}` : null,
      "",
      shootType === "wedding"
        ? [
            "Wedding Details:",
            weddingDate ? `Wedding Date: ${weddingDate}` : null,
            ceremonyLocation ? `Ceremony Location: ${ceremonyLocation}` : null,
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