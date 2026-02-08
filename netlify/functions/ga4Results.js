// netlify/functions/ga4Results.js
const { google } = require("googleapis");

function formatSecondsToMinSec(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}m ${r}s`;
}

exports.handler = async () => {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKeyRaw = process.env.GA4_PRIVATE_KEY;

    if (!propertyId || !clientEmail || !privateKeyRaw) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Missing env vars. Need GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY.",
        }),
      };
    }

    // Netlify env var keeps \n as two chars unless you convert it back
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const property = `properties/${propertyId}`;

    // 1) KPI metrics (30 days)
    const kpiRes = await analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "averageSessionDuration" },
        ],
      },
    });

    const kpiRow = kpiRes.data.rows?.[0]?.metricValues || [];
    const users30d = Number(kpiRow?.[0]?.value || 0);
    const newUsers30d = Number(kpiRow?.[1]?.value || 0);
    const avgEngagementTime = formatSecondsToMinSec(kpiRow?.[2]?.value);

    // 2) Top sources list (Source / Medium) — shows IG + Google when available
    const sourcesRes = await analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSourceMedium" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
    });

    const topSources =
      sourcesRes.data.rows?.map((r) => ({
        source: r.dimensionValues?.[0]?.value || "(untracked)",
        sessions: Number(r.metricValues?.[0]?.value || 0),
      })) || [];

    const topTrafficSource =
      topSources.find((s) => s.source && s.source !== "(untracked)")?.source ||
      "(untracked)";

    // 3) Top pages (pagePath)
    const pagesRes = await analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 50,
      },
    });

    const topPages =
      pagesRes.data.rows?.map((r) => ({
        path: r.dimensionValues?.[0]?.value || "",
        views: Number(r.metricValues?.[0]?.value || 0),
      })) || [];

    // 4) Conversions (events) — update names later if needed
    const eventsRes = await analyticsData.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: ["contact_submit", "booking_click"],
            },
          },
        },
      },
    });

    let contactSubmits = 0;
    let bookingClicks = 0;

    for (const row of eventsRes.data.rows || []) {
      const name = row.dimensionValues?.[0]?.value;
      const count = Number(row.metricValues?.[0]?.value || 0);
      if (name === "contact_submit") contactSubmits = count;
      if (name === "booking_click") bookingClicks = count;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        rangeLabel: "Last 30 days",
        users30d,
        newUsers30d,
        avgEngagementTime,
        topTrafficSource,
        topSources,
        topPages,
        contactSubmits,
        bookingClicks,
      }),
    };
  } catch (err) {
    console.error("ga4Results error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "GA4 report failed",
        details: err?.message || String(err),
      }),
    };
  }
};