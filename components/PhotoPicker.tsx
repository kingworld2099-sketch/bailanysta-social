"use client";

import { useRef, useState } from "react";
import { PHOTO_ALLOWED_TYPES, PHOTO_MAX_BYTES } from "@/lib/config";

export default function PhotoPicker({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
      setError("Можно загружать только изображения: JPEG, PNG, WEBP или GIF");
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setError("Файл слишком большой — до 5 МБ");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setIsUploading(true);
    onUploadingChange?.(true);

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });

    setIsUploading(false);
    onUploadingChange?.(false);
    URL.revokeObjectURL(localPreview);
    setPreview(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Не получилось загрузить фото");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  }

  const shownUrl = value ?? preview;

  if (shownUrl) {
    return (
      <div className="relative w-fit">
        <img
          src={shownUrl}
          alt=""
          className="max-h-48 rounded-2xl border object-cover"
          style={{ borderColor: "var(--border)" }}
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-sm font-medium text-white">
            Загружаю…
          </div>
        )}
        {!isUploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Удалить фото"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm font-bold text-white"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className="chip">
        📷 Добавить фото
      </button>
      {error && (
        <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
