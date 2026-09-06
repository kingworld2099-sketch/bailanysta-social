"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LIMITS, PHOTO_EXPIRY_HOURS } from "@/lib/config";
import { placeSearchUrl } from "@/lib/place";
import PhotoPicker from "./PhotoPicker";
import MentionTextarea from "./MentionTextarea";
import MentionText from "./MentionText";

export default function EditablePostText({
  postId,
  initialText,
  initialPlace,
  initialPlannedAt,
  hasHiddenMeetInfo,
  visiblePhotoUrl,
  hasExpiredPhoto,
  hasHiddenPhoto,
  isOwn,
  visibleMentions,
}: {
  postId: string;
  initialText: string;
  initialPlace: string | null;
  initialPlannedAt: string | null;
  hasHiddenMeetInfo: boolean;
  visiblePhotoUrl: string | null;
  hasExpiredPhoto: boolean;
  hasHiddenPhoto: boolean;
  isOwn: boolean;
  visibleMentions?: string[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [place, setPlace] = useState(initialPlace ?? "");
  const [plannedAt, setPlannedAt] = useState(initialPlannedAt ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(visiblePhotoUrl);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > LIMITS.postText.max) return;

    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, place, plannedAt, photoUrl }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось сохранить");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    const meetLine = [place, plannedAt].filter(Boolean).join(" · ");
    return (
      <div className="mb-3">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          <MentionText text={text} visibleMentions={visibleMentions} revealAll={isOwn} />
        </p>
        {visiblePhotoUrl && (
          <img
            src={visiblePhotoUrl}
            alt=""
            className="mt-2 max-h-72 w-full rounded-2xl border object-cover"
            style={{ borderColor: "var(--border)" }}
          />
        )}
        {!visiblePhotoUrl && hasExpiredPhoto && (
          <p className="mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
            Фото было доступно {PHOTO_EXPIRY_HOURS} часов и уже исчезло
          </p>
        )}
        {!visiblePhotoUrl && !hasExpiredPhoto && hasHiddenPhoto && (
          <p className="mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
            🔒 Фото скрыто — автор откроет его, когда решит вам довериться в чате
          </p>
        )}
        {meetLine && (
          <p className="mt-1 text-sm" style={{ color: "var(--fg-muted)" }}>
            📍{" "}
            {place ? (
              <a
                href={placeSearchUrl(place)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {place}
              </a>
            ) : null}
            {place && plannedAt ? " · " : null}
            {plannedAt}
          </p>
        )}
        {hasHiddenMeetInfo && (
          <p className="mt-1 text-sm" style={{ color: "var(--fg-muted)" }}>
            📍 Место и время скрыты — автор откроет их, когда решит вам довериться в чате
          </p>
        )}
        {isOwn && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-1 text-sm"
            style={{ color: "var(--fg-muted)" }}
          >
            Редактировать
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      <MentionTextarea
        value={text}
        onChange={setText}
        rows={3}
        maxLength={LIMITS.postText.max}
        className="text-[15px]"
      />
      <div className="mb-1 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Где будешь? (необязательно)"
          maxLength={LIMITS.place.max}
          className="text-sm"
        />
        <input
          value={plannedAt}
          onChange={(e) => setPlannedAt(e.target.value)}
          placeholder="Когда? (необязательно)"
          maxLength={LIMITS.plannedAt.max}
          className="text-sm"
        />
      </div>

      <div className="mb-1 mt-2">
        <PhotoPicker value={photoUrl} onChange={setPhotoUrl} onUploadingChange={setIsPhotoUploading} />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {text.length} / {LIMITS.postText.max}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setText(initialText);
              setPlace(initialPlace ?? "");
              setPlannedAt(initialPlannedAt ?? "");
              setPhotoUrl(visiblePhotoUrl);
              setEditing(false);
              setError(null);
            }}
            className="btn btn-ghost !px-3 !py-1.5 text-sm"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isSubmitting || isPhotoUploading || text.trim().length === 0}
            className="btn btn-primary !px-3 !py-1.5 text-sm"
          >
            {isSubmitting ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
