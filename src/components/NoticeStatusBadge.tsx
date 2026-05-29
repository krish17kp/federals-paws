export function NoticeStatusBadge({
  actionability,
  urgency,
}: {
  actionability?: string;
  urgency?: string;
}) {
  const normalizedActionability = actionability || "informational";
  const isUrgent =
    normalizedActionability.toLowerCase().includes("urgent") ||
    urgency?.toLowerCase() === "urgent";

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
          isUrgent
            ? "bg-error-container text-on-error-container"
            : "bg-surface-container text-on-surface"
        }`}
      >
        {normalizedActionability}
      </span>
      {urgency && (
        <span className="inline-flex rounded-full border border-outline-variant px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Urgency: {urgency}
        </span>
      )}
    </div>
  );
}
