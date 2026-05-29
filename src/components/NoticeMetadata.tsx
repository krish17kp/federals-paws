import { Notice } from "../types";

function MetadataItem({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <span className="rounded bg-surface-container px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
      {label}: {value}
    </span>
  );
}

export function NoticeMetadata({ notice }: { notice: Notice }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <MetadataItem label="Agency" value={notice.agency || "Unknown"} />
      <MetadataItem label="Published" value={notice.publication_date} />
      <MetadataItem label="FR Doc" value={notice.document_number} />
      <MetadataItem label="Type" value={notice.document_type} />
      <MetadataItem label="Filing" value={notice.filing_tag} />
    </div>
  );
}
