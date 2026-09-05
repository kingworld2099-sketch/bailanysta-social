"use client";

export default function GuestModal({
  action,
  onClose,
}: {
  action: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-base font-medium">Чтобы {action}, нужно войти</p>
        <div className="flex flex-col gap-2">
          <form action="/api/auth/demo" method="post">
            <button type="submit" className="btn btn-primary w-full">
              Войти как демо
            </button>
          </form>
          <a href="/register" className="btn btn-secondary w-full">
            Создать аккаунт
          </a>
          <button type="button" onClick={onClose} className="btn btn-ghost w-full">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
