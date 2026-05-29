export function NoticeDisclaimer({ disclaimer }: { disclaimer?: string }) {
  return (
    <p className="rounded border border-outline-variant bg-surface-container-lowest p-3 text-sm font-medium text-on-surface-variant">
      {disclaimer || "This represents informational guidance only and not legal advice."}
    </p>
  );
}
