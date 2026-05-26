"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@/shared/hooks/useTheme";
import ChangelogModal from "../ChangelogModal";
import NineRemotePromoModal from "../NineRemotePromoModal";
import { ConfirmModal } from "../Modal";

function MenuItem({ icon, label, onClick, trailing, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
        danger
          ? "text-danger hover:bg-danger/10"
          : "text-text-main hover:bg-surface-2"
      }`}
    >
      <span className={`material-symbols-outlined text-[18px] ${danger ? "text-danger" : "text-text-muted"}`}>
        {icon}
      </span>
      <span className="flex-1 text-left font-medium">{label}</span>
      {trailing && <span className="text-xs text-text-subtle">{trailing}</span>}
    </button>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  trailing: PropTypes.node,
  danger: PropTypes.bool,
};

export default function HeaderMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [remoteOpen, setRemoteOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const handleShutdown = async () => {
    setShuttingDown(true);
    try {
      await fetch("/api/version/shutdown", { method: "POST" });
    } catch {}
    setShuttingDown(false);
    setShutdownOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-muted shadow-[var(--shadow-soft)] transition-colors hover:text-text-main"
          title="Menu"
        >
          <span className="material-symbols-outlined text-[19px]">more_horiz</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border-subtle bg-surface p-2 shadow-[var(--shadow-elev)] animate-in fade-in zoom-in-95 duration-150">
            <div className="mb-1 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-subtle">Zero Agent</p>
              <p className="text-sm font-semibold text-text-main">Control menu</p>
            </div>
            <MenuItem icon="history" label="Changelog" onClick={() => { close(); setChangelogOpen(true); }} />
            <MenuItem icon={isDark ? "light_mode" : "dark_mode"} label={isDark ? "Light mode" : "Dark mode"} onClick={() => { toggleTheme(); close(); }} />
            <MenuItem icon="computer" label="Remote" onClick={() => { close(); setRemoteOpen(true); }} />
            <div className="my-2 h-px bg-border-subtle" />
            <MenuItem icon="power_settings_new" label="Shutdown" danger onClick={() => { close(); setShutdownOpen(true); }} />
            <MenuItem icon="logout" label="Logout" danger onClick={() => { close(); onLogout(); }} />
          </div>
        )}
      </div>

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
      <NineRemotePromoModal isOpen={remoteOpen} onClose={() => setRemoteOpen(false)} />
      <ConfirmModal
        isOpen={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
        onConfirm={handleShutdown}
        title="Shutdown Zero Agent"
        message="Stop the local Zero Agent server now?"
        confirmText="Shutdown"
        cancelText="Cancel"
        variant="danger"
        loading={shuttingDown}
      />
    </>
  );
}

HeaderMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

