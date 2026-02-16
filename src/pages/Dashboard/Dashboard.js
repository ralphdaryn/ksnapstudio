// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Dashboard.scss";

/**
 * ✅ KSnapStudio page groups (always shown, even if 0 views)
 * Keep these in sync with your routes.
 */
const CORE_PAGES = ["/", "/homepage"];
const DISCOVERY_PAGES = ["/gallery", "/packages", "/about"];
const CONTACT_PAGES = ["/contact"];
const ADMIN_PAGES = ["/dashboard"]; // optional

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

  if (s === "(not set)" || s === "" || s === "(untracked)")
    return "Direct / Untracked visits";
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

  if (s === "(not set)" || s === "" || s === "(untracked)") {
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

// ✅ KPI Card — MUST match your SCSS classnames
function KpiCard({ label, value }) {
  return (
    <div className="dashboard__kpi">
      <p className="dashboard__kpiLabel">{label}</p>
      <p className="dashboard__kpiValue">{value}</p>
    </div>
  );
}

// ✅ Full-page overlay loader (simple + clean)
function DashboardLoader({ label = "Loading dashboard…" }) {
  return (
    <div className="dashboard__overlay" role="status" aria-live="polite">
      <div className="dashboard__overlayCard">
        <div className="dashboard__spinner" aria-hidden="true" />
        <p className="dashboard__overlayText">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    isLoading: authLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  const [data, setData] = useState(null);

  // ✅ start loading true so overlay shows immediately
  const [status, setStatus] = useState({ loading: true, error: "" });

  // ✅ Spring Boot base URL (Render in prod via env var, localhost in dev)
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

  // ✅ KSnapStudio endpoint
  const GA4_ENDPOINT = `${API_BASE_URL}/api/dashboard/ksnapstudio/ga4Results`;

  // ✅ Load GA4 results (protected)
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setStatus({ loading: true, error: "" });

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience:
              process.env.REACT_APP_AUTH0_AUDIENCE || "https://rd-dashboard-api",
          },
        });

        const res = await fetch(GA4_ENDPOINT, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          throw new Error(
            "Access denied (403). This account is not authorized for KSnapStudio."
          );
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to load dashboard (${res.status}).`);
        }

        const json = await res.json();

        if (mounted) {
          setData(json);
          setStatus({ loading: false, error: "" });
        }
      } catch (err) {
        if (mounted) {
          setData(null);
          setStatus({
            loading: false,
            error: err?.message || "Unable to load analytics",
          });
        }
      }
    };

    if (isAuthenticated) load();
    else {
      setData(null);
      setStatus({ loading: false, error: "" });
    }

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, GA4_ENDPOINT, getAccessTokenSilently]);

  // ✅ safe defaults
  const safe = useMemo(() => {
    const fallback = {
      users30d: 0,
      newUsers30d: 0,
      avgEngagementTime: "—",

      // ✅ Conversions for KSnap
      viewPackages: 0,
      galleryVisits: 0,
      contactSubmits: 0,

      topTrafficSource: "(not set)",
      topSources: [],
      topPages: [],
      rangeLabel: "Last 30 days",
    };

    return { ...fallback, ...(data || {}) };
  }, [data]);

  // ✅ KSnap conversion = packages + gallery + contact
  const totalConversions =
    Number(safe.viewPackages || 0) +
    Number(safe.galleryVisits || 0) +
    Number(safe.contactSubmits || 0);

  const conversionRate =
    safe.users30d > 0
      ? ((totalConversions / safe.users30d) * 100).toFixed(1)
      : "0.0";

  /**
   * ✅ ALWAYS show your key pages (0 if missing)
   */
  const { corePages, discoveryPages, contactPages, adminPages, otherPages } =
    useMemo(() => {
      const pages = Array.isArray(safe.topPages) ? safe.topPages : [];
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

  const showOverlay = authLoading || status.loading;

  // ✅ Auth0 still deciding
  if (authLoading) {
    return (
      <section className="dashboard">
        <DashboardLoader label="Securing dashboard…" />
      </section>
    );
  }

  // ✅ locked until login
  if (!isAuthenticated) {
    return (
      <section className="dashboard dashboard__locked">
        <header className="dashboard__header">
          <p className="dashboard__eyebrow">DASHBOARD</p>
          <h1 className="dashboard__title">KSnap Studio Analytics</h1>
          <p className="dashboard__sub">Log in to view metrics.</p>

          <button
            className="dashboard__btn"
            onClick={() =>
              loginWithRedirect({
                // ✅ prevents redirecting to homepage after login
                appState: { returnTo: "/dashboard" },
              })
            }
            type="button"
          >
            View metrics
          </button>
        </header>
      </section>
    );
  }

  return (
    <section className="dashboard">
      {showOverlay ? <DashboardLoader label="Loading analytics…" /> : null}

      <header className="dashboard__header">
        <div className="dashboard__topRow">
          <div>
            <p className="dashboard__eyebrow">DASHBOARD</p>
            <h1 className="dashboard__title">KSnap Studio Analytics</h1>

            {status.error ? (
              <p className="dashboard__sub dashboard__sub--error">
                Couldn’t load dashboard: {status.error}
              </p>
            ) : (
              <p className="dashboard__sub">{safe.rangeLabel}</p>
            )}
          </div>

          <button
            className="dashboard__btn dashboard__btn--ghost"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            type="button"
          >
            Log out
          </button>
        </div>
      </header>

      {/* ✅ KPI cards */}
      <div className="dashboard__kpis">
        <KpiCard label="Users (30 days)" value={safe.users30d} />
        <KpiCard label="New users" value={safe.newUsers30d} />
        <KpiCard label="Packages views" value={safe.viewPackages} />
        <KpiCard label="Gallery visits" value={safe.galleryVisits} />
        <KpiCard label="Contact submits" value={safe.contactSubmits} />
        <KpiCard label="Total conversions" value={totalConversions} />
        <KpiCard label="Conversion rate" value={`${conversionRate}%`} />
      </div>

      {/* Acquisition */}
      <section className="dashboard__section">
        <h2 className="dashboard__h2">Acquisition</h2>

        <div className="dashboard__panel">
          <p className="dashboard__label">Top traffic source</p>
          <p className="dashboard__value">
            {formatSourceLabel(safe.topTrafficSource)}
          </p>

          {topSourcesSafe.length ? (
            <>
              <p className="dashboard__groupTitle">Top sources (sessions)</p>
              <ul className="dashboard__list">
                {topSourcesSafe.map((s, idx) => (
                  <li key={`${s.source}-${idx}`} className="dashboard__listItem">
                    <span className="dashboard__mono">
                      {s.label}
                      {s.hint ? (
                        <span className="dashboard__hint">{s.hint}</span>
                      ) : null}
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
          <Group
            title="Discovery (Gallery / Packages / About)"
            items={discoveryPages}
          />
          <Group title="Contact" items={contactPages} />

          {adminPages.some((p) => p.views > 0) ? (
            <Group title="Admin" items={adminPages} />
          ) : null}

          {otherPages.length ? <Group title="Other" items={otherPages} /> : null}
        </div>
      </section>

      {/* ✅ Conversion (KSnap specific) */}
      <section className="dashboard__section">
        <h2 className="dashboard__h2">Conversion</h2>

        <div className="dashboard__panel">
          <div className="dashboard__conversions">
            <KpiCard label="Packages views" value={safe.viewPackages} />
            <KpiCard label="Gallery visits" value={safe.galleryVisits} />
            <KpiCard label="Contact submits" value={safe.contactSubmits} />
            <KpiCard label="Total conversions" value={totalConversions} />
          </div>

          <div className="dashboard__row" style={{ marginTop: 14 }}>
            <p className="dashboard__label">Conversion rate</p>
            <p className="dashboard__value">{conversionRate}%</p>
          </div>

          <p className="dashboard__sub" style={{ marginTop: 8 }}>
            Conversion rate = (Packages views + Gallery visits + Contact submits)
            ÷ Users
          </p>
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