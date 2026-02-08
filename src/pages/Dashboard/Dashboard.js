// src/pages/Dashboard/Dashboard.js
import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.scss";

/**
 * ✅ KSnapStudio page groups (always shown, even if 0 views)
 * Keep these in sync with your routes.
 */
const CORE_PAGES = ["/", "/homepage"];
const DISCOVERY_PAGES = ["/gallery", "/packages", "/about"];
const CONTACT_PAGES = ["/contact"];

// Optional: show admin traffic
const ADMIN_PAGES = ["/dashboard"];

/** ✅ Normalize GA4 paths so grouping works */
function normalizePath(rawPath = "") {
  const v = String(rawPath || "");
  const noQuery = v.split("?")[0] || "";
  if (!noQuery) return "";
  if (noQuery.length > 1 && noQuery.endsWith("/")) return noQuery.slice(0, -1);
  return noQuery;
}

function formatPathForClient(path) {
  const p = normalizePath(path);
  if (!p || p === "/") return "/homepage";
  return p;
}

/** ✅ Convert GA4 "source / medium" into client-friendly labels */
function formatSourceLabel(sourceMedium = "") {
  const s = String(sourceMedium).toLowerCase().trim();

  if (s === "(not set)" || s === "") return "Direct / Untracked visits";
  if (s.includes("google") && s.includes("organic")) return "Google Search";
  if (s.includes("(direct)") || s.includes("direct")) return "Direct visits";
  if (s.includes("instagram")) return "Instagram";
  if (s.includes("facebook")) return "Facebook";
  if (s.includes("bing") && s.includes("organic")) return "Bing Search";
  if (s.includes("t.co") || s.includes("twitter")) return "X (Twitter)";

  return sourceMedium;
}

/** ✅ Small explanation under each label (optional) */
function formatSourceHint(sourceMedium = "") {
  const s = String(sourceMedium).toLowerCase().trim();

  if (s === "(not set)" || s === "") {
    return "Typed the website, bookmark, or apps that don’t pass tracking info";
  }
  if (s.includes("google") && s.includes("organic")) {
    return "Found you through Google search";
  }
  if (s.includes("(direct)") || s.includes("direct")) {
    return "Typed the website directly or used a saved link";
  }
  if (s.includes("instagram")) {
    return "Clicked from Instagram bio, story, or message link";
  }
  if (s.includes("facebook")) {
    return "Clicked from Facebook (post, message, or ad)";
  }
  return "";
}

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

        // ✅ Nicer error (don’t show raw JSON blob)
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          const msg = payload?.error || (await res.text());
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

  /**
   * ✅ StepByStep concept: ALWAYS show your key pages,
   * even if GA4 hasn't collected them yet (0 views).
   */
  const { corePages, discoveryPages, contactPages, adminPages, otherPages } =
    useMemo(() => {
      const pages = Array.isArray(safe.topPages) ? safe.topPages : [];

      // Map GA4 topPages into lookup map by normalized path
      const byPath = new Map(
        pages.map((p) => [normalizePath(p.path), Number(p.views) || 0])
      );

      const core = CORE_PAGES.map(normalizePath).map((path) => ({
        path,
        views: byPath.get(path) ?? 0,
      }));

      const discovery = DISCOVERY_PAGES.map(normalizePath).map((path) => ({
        path,
        views: byPath.get(path) ?? 0,
      }));

      const contact = CONTACT_PAGES.map(normalizePath).map((path) => ({
        path,
        views: byPath.get(path) ?? 0,
      }));

      const admin = ADMIN_PAGES.map(normalizePath).map((path) => ({
        path,
        views: byPath.get(path) ?? 0,
      }));

      const groupedSet = new Set([
        ...CORE_PAGES.map(normalizePath),
        ...DISCOVERY_PAGES.map(normalizePath),
        ...CONTACT_PAGES.map(normalizePath),
        ...ADMIN_PAGES.map(normalizePath),
      ]);

      const other = pages
        .map((p) => ({
          path: normalizePath(p.path),
          views: Number(p.views) || 0,
        }))
        .filter((p) => p.path && !groupedSet.has(p.path));

      return {
        corePages: core,
        discoveryPages: discovery,
        contactPages: contact,
        adminPages: admin,
        otherPages: other,
      };
    }, [safe.topPages]);

  const topSourcesSafe = useMemo(() => {
    const list = Array.isArray(safe.topSources) ? safe.topSources : [];
    return list.map((s) => ({
      source: String(s.source || "(not set)"),
      sessions: Number(s.sessions) || 0,
      label: formatSourceLabel(s.source),
      hint: formatSourceHint(s.source),
    }));
  }, [safe.topSources]);

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <p className="dashboard__eyebrow">DASHBOARD</p>
        <h1 className="dashboard__title">KSnap Studio Analytics</h1>

        {status.loading ? (
          <p className="dashboard__sub">Loading data…</p>
        ) : status.error ? (
          <p className="dashboard__sub dashboard__sub--error">
            Couldn’t load dashboard: {status.error}
          </p>
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
          <p className="dashboard__value">{formatSourceLabel(safe.topTrafficSource)}</p>

          {topSourcesSafe.length ? (
            <>
              <p className="dashboard__groupTitle">Top sources (sessions)</p>
              <ul className="dashboard__list">
                {topSourcesSafe.map((s, idx) => (
                  <li key={`${s.source}-${idx}`} className="dashboard__listItem">
                    <span className="dashboard__mono">
                      {s.label}
                      {s.hint ? <span className="dashboard__hint">{s.hint}</span> : null}
                    </span>
                    <span className="dashboard__badge">{s.sessions}</span>
                  </li>
                ))}
              </ul>
            </>
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

          <Group title="Core (Homepage)" items={corePages} />
          <Group title="Discovery (Gallery / Packages / About)" items={discoveryPages} />
          <Group title="Contact / Booking" items={contactPages} />

          {/* Optional: only show if there are views */}
          {adminPages.some((p) => p.views > 0) ? (
            <Group title="Admin" items={adminPages} />
          ) : null}

          {otherPages.length ? <Group title="Other" items={otherPages} /> : null}
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

function Group({ title, items }) {
  return (
    <div className="dashboard__group">
      <p className="dashboard__groupTitle">{title}</p>
      <ul className="dashboard__list">
        {items.map((p) => (
          <li key={p.path} className="dashboard__listItem">
            <span className="dashboard__mono">{formatPathForClient(p.path)}</span>
            <span className="dashboard__badge">{p.views}</span>
          </li>
        ))}
      </ul>
    </div>
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