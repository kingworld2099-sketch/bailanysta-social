import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireUser } from "@/lib/session";
import { apiError } from "@/lib/api";
import { ValidationError } from "@/lib/errors";
import { PHOTO_MAX_BYTES, PHOTO_ALLOWED_TYPES } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    await requireUser();

    const formData = await req.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      throw new ValidationError("Файл не найден");
    }
    if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError("Можно загружать только изображения: JPEG, PNG, WEBP или GIF");
    }
    if (file.size > PHOTO_MAX_BYTES) {
      throw new ValidationError("Файл слишком большой — до 5 МБ");
    }

    const ext = file.type.split("/")[1] ?? "jpg";
    const blob = await put(`posts/${crypto.randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return apiError(e);
  }
}
