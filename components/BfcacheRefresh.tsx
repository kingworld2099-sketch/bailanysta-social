"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Mobile Safari (and some other browsers) can restore a page from the
 * back-forward cache — a frozen snapshot — instead of re-fetching it, even
 * when Cache-Control says not to. For pages showing live state (privacy
 * reveal, unread badge, connect status) that means someone can see stale
 * data after switching apps or navigating back. Force a refresh when that
 * happens.
 */
export default function BfcacheRefresh() {
  const router = useRouter();

  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) router.refresh();
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  return null;
}
