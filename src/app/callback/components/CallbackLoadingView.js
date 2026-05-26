"use client";

export default function CallbackLoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center p-8">
        <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        </div>
        <p className="text-text-muted">Loading...</p>
      </div>
    </div>
  );
}
