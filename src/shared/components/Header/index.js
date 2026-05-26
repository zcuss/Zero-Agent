"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import PropTypes from "prop-types";
import ProviderIcon from "@/shared/components/ProviderIcon";
import HeaderMenu from "@/shared/components/HeaderMenu";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useHeaderSearchStore } from "@/store/headerSearchStore";
import { OAUTH_PROVIDERS, APIKEY_PROVIDERS } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS, AI_PROVIDERS } from "@/shared/constants/providers";

const translate = (value) => value;

const pageMap = [
  ["/providers", { title: "Providers", description: "Provider connections and credentials", icon: "deployed_code" }],
  ["/combos", { title: "Pipelines", description: "Fallback model routing", icon: "account_tree" }],
  ["/usage", { title: "Usage", description: "Requests, tokens, and telemetry", icon: "monitoring" }],
  ["/auth-files", { title: "Auth Files", description: "Local credential mappings", icon: "vpn_key" }],
  ["/quota", { title: "Quota", description: "Provider limits and capacity", icon: "data_thresholding" }],
  ["/mitm", { title: "Intercept", description: "CLI traffic routing through Zero Agent", icon: "shield_lock" }],
  ["/cli-tools", { title: "CLI", description: "Tool bridges and model mappings", icon: "terminal" }],
  ["/proxy-pools", { title: "Proxies", description: "Proxy pool control", icon: "hub" }],
  ["/skills", { title: "Skills", description: "Agent-ready skill links", icon: "extension" }],
  ["/endpoint", { title: "Endpoint", description: "API endpoint configuration", icon: "api" }],
  ["/profile", { title: "Settings", description: "Preferences and runtime settings", icon: "settings" }],
  ["/translator", { title: "Translator", description: "Format conversion lab", icon: "conversion_path" }],
  ["/console-log", { title: "Logs", description: "Live runtime output", icon: "monitor" }],
];

const getPageInfo = (pathname) => {
  if (!pathname) return { title: "", description: "", breadcrumbs: [] };

  const mediaDetailMatch = pathname.match(/\/media-providers\/([^/]+)\/([^/]+)$/);
  if (mediaDetailMatch) {
    const kindId = mediaDetailMatch[1];
    const providerId = mediaDetailMatch[2];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    const provider = AI_PROVIDERS[providerId];
    return {
      title: provider?.name || providerId,
      description: kindConfig?.label || "Media provider",
      breadcrumbs: [
        { label: "Media", href: `/dashboard/media-providers/${kindId}` },
        { label: kindConfig?.label || kindId, href: `/dashboard/media-providers/${kindId}` },
        { label: provider?.name || providerId, image: `/providers/${providerId}.png` },
      ],
    };
  }

  const mediaKindMatch = pathname.match(/\/media-providers\/([^/]+)$/);
  if (mediaKindMatch) {
    const kindId = mediaKindMatch[1];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    return {
      title: kindConfig?.label || kindId,
      description: "Media provider routing",
      icon: kindConfig?.icon || "perm_media",
      breadcrumbs: [],
    };
  }

  const providerMatch = pathname.match(/\/providers\/([^/]+)$/);
  if (providerMatch) {
    const providerId = providerMatch[1];
    const providerInfo = OAUTH_PROVIDERS[providerId] || APIKEY_PROVIDERS[providerId];
    if (providerInfo) {
      return {
        title: providerInfo.name,
        description: "Provider detail",
        breadcrumbs: [
          { label: "Providers", href: "/dashboard/providers" },
          { label: providerInfo.name, image: `/providers/${providerInfo.id}.png` },
        ],
      };
    }
  }

  const item = pageMap.find(([key]) => pathname.includes(key));
  if (item) return { ...item[1], breadcrumbs: [] };
  if (pathname === "/dashboard") return { title: "Endpoint", description: "API endpoint configuration", icon: "api", breadcrumbs: [] };
  return { title: "Dashboard", description: "Zero Agent control plane", icon: "dashboard", breadcrumbs: [] };
};

export default function Header({ onMenuClick, showMenuButton = true }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [loginMethod, setLoginMethod] = useState("");

  const pageInfo = useMemo(() => getPageInfo(pathname), [pathname]);
  const { title, description, icon, breadcrumbs } = pageInfo;

  useEffect(() => {
    let cancelled = false;
    async function loadAuthStatus() {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setDisplayName(data?.displayName || data?.oidcName || data?.oidcEmail || "");
          setLoginMethod(data?.loginMethod || "");
        }
      } catch {
        if (!cancelled) {
          setDisplayName("");
          setLoginMethod("");
        }
      }
    }
    loadAuthStatus();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <header className="z-20 shrink-0 border-b border-border-subtle bg-bg/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-muted transition-colors hover:text-text-main lg:hidden"
              aria-label="Open navigation"
            >
              <span className="material-symbols-outlined text-[19px]">menu</span>
            </button>
          )}

          <div className="hidden size-10 items-center justify-center rounded-2xl border border-border-subtle bg-surface text-primary shadow-[var(--shadow-soft)] sm:flex">
            <span className="material-symbols-outlined text-[20px]">{icon || "dashboard"}</span>
          </div>

          <div className="min-w-0">
            {breadcrumbs.length > 0 ? (
              <div className="flex min-w-0 items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={`${crumb.label}-${crumb.href || "current"}`} className="flex min-w-0 items-center gap-2">
                    {index > 0 && <span className="text-text-subtle">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-text-muted transition-colors hover:text-primary">
                        {crumb.label}
                      </Link>
                    ) : (
                      <div className="flex min-w-0 items-center gap-2">
                        {crumb.image && (
                          <ProviderIcon
                            src={crumb.image}
                            alt={crumb.label}
                            size={24}
                            className="rounded-md object-contain"
                            fallbackText={crumb.label.slice(0, 2).toUpperCase()}
                          />
                        )}
                        <h1 className="truncate text-lg font-semibold tracking-tight text-text-main">{translate(crumb.label)}</h1>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-text-subtle sm:block">Control Plane</p>
                  <span className="hidden rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success sm:inline-flex">LOCAL</span>
                </div>
                <h1 className="truncate text-lg font-semibold tracking-tight text-text-main md:text-xl">{translate(title)}</h1>
              </>
            )}
            {description && <p className="hidden truncate text-xs text-text-muted md:block">{translate(description)}</p>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <HeaderSearch />
          {displayName && loginMethod === "OIDC" && (
            <div className="hidden max-w-[190px] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-xs text-text-muted sm:flex">
              <span className="truncate">{displayName}</span>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">OIDC</span>
            </div>
          )}
          <ThemeToggle />
          <HeaderMenu onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}

function HeaderSearch() {
  const visible = useHeaderSearchStore((s) => s.visible);
  const query = useHeaderSearchStore((s) => s.query);
  const placeholder = useHeaderSearchStore((s) => s.placeholder);
  const setQuery = useHeaderSearchStore((s) => s.setQuery);

  if (!visible) return null;

  return (
    <div className="relative hidden w-[220px] md:block">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-text-subtle">search</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-border-subtle bg-surface py-0 pl-9 pr-8 text-sm text-text-main outline-none transition-colors placeholder:text-text-subtle focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-text-subtle hover:text-text-main"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func,
  showMenuButton: PropTypes.bool,
};

