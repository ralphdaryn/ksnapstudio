// src/pages/Dashboard/Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.scss";

// ✅ Update these to match your KSnap routes (these are safe defaults)
const MAIN_PAGES = ["/", "/homepage"];
const PORTFOLIO_PAGES = ["/gallery", "/portfolio", "/work"];
const CONTACT_PAGES = ["/contact", "/booking"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setStatus({ loading: true, error: "" });

        const res = await fetch("/.netlify/functions/ga4Results", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to load dashboard data");
        }

        const json = await res.json();
        if (mounted) {
          setData(json);
          setStatus({ loading: false, error: "" });
        }
      } catch (err) {
        if (mounted) {
          setStatus({
            loading: false,
            error: err?.message || "Unable to load analytics",
          });
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const safe = useMemo(() => {
    const fallback = {
      users30d: 0,
      newUsers30d: 0,
      avgEngagementTime: "—",
      contactSubmits: 0,
      bookingClicks: 0,
      topTrafficSource: "(not set)",
      topSources: [],
      topPages: [],
      rangeLabel: "Last 30 days",
    };
    return { ...fallback, ...(data || {}) };
  }, [data]);

  const totalConversions = safe.contactSubmits + safe.bookingClicks;
  const conversionRate =
    safe.users30d > 0
      ? ((totalConversions / safe.users30d) * 100).toFixed(1)
      : "0.0";

  // Normalize GA4 paths so grouping works:
  // "/contact/?x=1" -> "/contact"
  // "/contact/" -> "/contact"
  const normalizePath = (rawPath) => {
    const v = String(rawPath || "");
    const noQuery = v.split("?")[0] || "";
    if (!noQuery) return "";
    if (noQuery.length > 1 && noQuery.endsWith("/")) return noQuery.slice(0, -1);
    return noQuery;
  };

  const formatPath = (path) => {
    const p = normalizePath(path);
    if (!p || p === "/") return "/homepage";
    return p;
  };

  // Make sources client-friendly
  const labelSource = (raw) => {
    const v = String(raw || "").trim();
    const low = v.toLowerCase();

    if (!v || v === "(not set)") return "Untracked / Unknown";
    if (low.includes("google") && low.includes("organic")) return "Google Search";
    if (low.includes("(direct)") || low.includes("direct")) return "Direct";
    if (low.includes("l.instagram.com") || low.includes("instagram"))
      return "Instagram";
    if (low.includes("facebook")) return "Facebook";
    if (low.includes("bing") && low.includes("organic")) return "Bing Search";

    // default: show raw label
    return v;
  };

  const { mainPages, portfolioPages, contactPages, otherPages } = useMemo(() => {
    const pages = Array.isArray(safe.topPages) ? safe.topPages : [];

    // normalize page paths coming from GA4
    const normalized = pages
      .map((p) => ({
        path: normalizePath(p.path),
        views: Number(p.views) || 0,
      }))
      .filter((p) => p.path); // drop blanks

    const groupedSet = new Set([
      ...MAIN_PAGES.map(normalizePath),
      ...PORTFOLIO_PAGES.map(normalizePath),
      ...CONTACT_PAGES.map(normalizePath),
    ]);

    const main = normalized.filter((p) =>
      MAIN_PAGES.map(normalizePath).includes(p.path)
    );

    const portfolio = normalized.filter((p) =>
      PORTFOLIO_PAGES.map(normalizePath).includes(p.path)
    );

    const contact = normalized.filter((p) =>
      CONTACT_PAGES.map(normalizePath).includes(p.path)
    );

    const other = normalized.filter((p) => !groupedSet.has(p.path));

    return {
      mainPages: main,
      portfolioPages: portfolio,
      contactPages: contact,
      otherPages: other,
    };
  }, [safe.topPages]);

  const topSourcesSafe = useMemo(() => {
    const list = Array.isArray(safe.topSources) ? safe.topSources : [];
    return list
      .map((s) => ({
        source: String(s.source || "(not set)"),
        label: labelSource(s.source),
        sessions: Number(s.sessions) || 0,
      }))
      .filter((s) => s.sessions >= 0);
  }, [safe.topSources]);

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <p className="dashboard__eyebrow">DASHBOARD</p>
        <h1 className="dashboard__title">KSnap Studio Analytics</h1>

        {status.loading ? (
          <p className="dashboard__sub">Loading data…</p>
        ) : status.error ? (
          <p className="dashboard__sub dashboard__sub--error">{status.error}</p>
        ) : (
          <p className="dashboard__sub">{safe.rangeLabel}</p>
        )}
      </header>

      {/* KPI cards */}
      <div className="dashboard__kpis">
        <Kpi label="Users (30 days)" value={safe.users30d} />
        <Kpi label="New users" value={safe.newUsers30d} />
        <Kpi label="Avg engagement time" value={safe.avgEngagementTime} />
        <Kpi label="Conversion rate" value={`${conversionRate}%`} />
      </div>

      {/* Acquisition */}
      <section className="dashboard__section">
        <h2 className="dashboard__h2">Acquisition</h2>

        <div className="dashboard__panel">
          <p className="dashboard__label">Top traffic source</p>
          <p className="dashboard__value">{labelSource(safe.topTrafficSource)}</p>

          {topSourcesSafe.length ? (
            <ul className="dashboard__list">
              {topSourcesSafe.map((s, idx) => (
                <li key={`${s.source}-${idx}`} className="dashboard__listItem">
                  <span className="dashboard__mono">{s.label}</span>
                  <span className="dashboard__badge">{s.sessions}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dashboard__empty">No source data yet.</p>
          )}
        </div>
      </section>

      {/* Engagement */}
      <section className="dashboard__section">
        <h2 className="dashboard__h2">Engagement</h2>

        <div className="dashboard__panel">
          <p className="dashboard__label">Top pages (views)</p>

          {[
            { title: "Main", items: mainPages },
            { title: "Portfolio", items: portfolioPages },
            { title: "Contact / Booking", items: contactPages },
            { title: "Other", items: otherPages },
          ].map(({ title, items }) =>
            items.length ? (
              <div key={title} className="dashboard__group">
                <p className="dashboard__groupTitle">{title}</p>
                <ul className="dashboard__list">
                  {items.map((p) => (
                    <li key={p.path} className="dashboard__listItem">
                      <span className="dashboard__mono">{formatPath(p.path)}</span>
                      <span className="dashboard__badge">{p.views}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}

          {!mainPages.length &&
          !portfolioPages.length &&
          !contactPages.length &&
          !otherPages.length ? (
            <p className="dashboard__empty">No page data yet.</p>
          ) : null}
        </div>
      </section>

      {/* Conversions */}
      <section className="dashboard__section">
        <h2 className="dashboard__h2">Conversions</h2>

        <div className="dashboard__conversions">
          <div className="dashboard__panel">
            <p className="dashboard__label">Contact form submits</p>
            <p className="dashboard__value">{safe.contactSubmits}</p>
          </div>

          <div className="dashboard__panel">
            <p className="dashboard__label">Booking / inquiry clicks</p>
            <p className="dashboard__value">{safe.bookingClicks}</p>
          </div>
        </div>
      </section>
    </section>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="dashboard__kpi">
      <p className="dashboard__kpiLabel">{label}</p>
      <p className="dashboard__kpiValue">{value}</p>
    </div>
  );
}