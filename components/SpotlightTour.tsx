"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type TourStep = {
  selector: string | null;
  title: string;
  text: string;
};

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export default function SpotlightTour({
  tourName,
  initiallySeen,
  steps,
  finishHref,
  finishLabel = "Готово",
}: {
  tourName: "profile" | "feed";
  initiallySeen: boolean;
  steps: TourStep[];
  finishHref?: string;
  finishLabel?: string;
}) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const seen = initiallySeen || dismissed;
  const step = steps[index];

  const positionSpotlight = useCallback(() => {
    const node = spotlightRef.current;
    if (!node) return;

    const el = step?.selector ? document.querySelector(step.selector) : null;
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "auto" });
      const rect = el.getBoundingClientRect();
      node.style.top = `${rect.top - 6}px`;
      node.style.left = `${rect.left - 6}px`;
      node.style.width = `${rect.width + 12}px`;
      node.style.height = `${rect.height + 12}px`;
      node.style.borderRadius = "16px";
      node.style.boxShadow = "0 0 0 3px var(--accent), 0 0 0 9999px rgba(0,0,0,0.65)";
    } else {
      node.style.top = "0px";
      node.style.left = "0px";
      node.style.width = "100vw";
      node.style.height = "100vh";
      node.style.borderRadius = "0px";
      node.style.boxShadow = "0 0 0 9999px rgba(0,0,0,0.65)";
    }
  }, [step]);

  useEffect(() => {
    if (seen) return;
    positionSpotlight();
    window.addEventListener("resize", positionSpotlight);
    return () => window.removeEventListener("resize", positionSpotlight);
  }, [seen, positionSpotlight]);

  function dismiss() {
    setDismissed(true);
    fetch("/api/me/tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tour: tourName }),
    }).catch(() => {
      // best-effort — worst case the tour shows again next visit
    });
  }

  function next() {
    if (index >= steps.length - 1) {
      dismiss();
      if (finishHref) router.push(finishHref);
    } else {
      setIndex((i) => i + 1);
    }
  }

  useEffect(() => {
    if (seen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !isTypingTarget(document.activeElement)) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, index]);

  if (seen || steps.length === 0) return null;

  const isLast = index === steps.length - 1;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={dismiss} />
      <div ref={spotlightRef} className="fixed z-40 transition-all duration-200" style={{ pointerEvents: "none" }} />

      <div
        className="card fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s.title}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 20 : 6,
                background: i <= index ? "var(--accent)" : "var(--border)",
              }}
            />
          ))}
        </div>

        <h3 className="mb-1 text-base font-bold">{step.title}</h3>
        <p className="mb-4 text-sm" style={{ color: "var(--fg-muted)" }}>
          {step.text}
        </p>

        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={dismiss} className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Пропустить
          </button>
          <button type="button" onClick={next} className="btn btn-primary !px-4 !py-2 text-sm">
            {isLast ? finishLabel : "Далее →"}
          </button>
        </div>
      </div>
    </>
  );
}
