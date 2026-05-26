"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CallbackLoadingView, CallbackStatusView } from "./index";

/**
 * OAuth Callback Page Content
 */
function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    const callbackData = {
      code,
      state,
      error,
      errorDescription,
      fullUrl: window.location.href,
    };

    // Trusted origins that may receive this callback. The OAuth code/state
    // must only be relayed to the dashboard window we expect to be the opener
    // (same origin) or the Codex helper that listens on a fixed loopback port.
    const expectedOrigins = [
      window.location.origin, // Same origin (for most providers)
      "http://localhost:1455", // Codex specific port
    ];

    // Method 1: postMessage to opener (popup mode)
    if (window.opener) {
      for (const origin of expectedOrigins) {
        try {
          window.opener.postMessage({ type: "oauth_callback", data: callbackData }, origin);
        } catch (e) {
          console.log("postMessage failed:", e);
        }
      }
    }

    // Method 2: BroadcastChannel (same origin tabs)
    try {
      const channel = new BroadcastChannel("oauth_callback");
      channel.postMessage(callbackData);
      channel.close();
    } catch (e) {
      console.log("BroadcastChannel failed:", e);
    }

    // Method 3: localStorage event (fallback)
    try {
      localStorage.setItem("oauth_callback", JSON.stringify({ ...callbackData, timestamp: Date.now() }));
    } catch (e) {
      console.log("localStorage failed:", e);
    }

    if (!(code || error)) {
      setTimeout(() => setStatus("manual"), 0);
      return;
    }

    setStatus("success");
    setTimeout(() => {
      window.close();
      setTimeout(() => setStatus("done"), 500);
    }, 1500);
  }, [searchParams]);

  return <CallbackStatusView status={status} />;
}

/**
 * OAuth Callback Page
 * Receives callback from OAuth providers and sends data back via multiple methods
 */
export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackLoadingView />}>
      <CallbackContent />
    </Suspense>
  );
}
