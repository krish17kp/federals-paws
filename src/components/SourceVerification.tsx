import { ExternalLink } from "lucide-react";
import { Notice } from "../types";

export function SourceVerification({ notice }: { notice: Notice }) {
  return (
    <section className="rounded border border-outline-variant bg-surface-container-low p-4">
      <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
        Source Verification
      </h5>
      <p className="mt-2 text-sm leading-relaxed text-on-surface">
        {notice.verification_instructions}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {notice.html_url ? (
          <a
            href={notice.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-4"
          >
            Official Federal Register notice <ExternalLink size={15} />
          </a>
        ) : (
          <span className="text-sm text-error">Official source link missing.</span>
        )}
        {notice.pdf_url && (
          <a
            href={notice.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-4"
          >
            PDF/source file <ExternalLink size={15} />
          </a>
        )}
        {notice.comment_url && (
          <a
            href={notice.comment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-4"
          >
            Comment page <ExternalLink size={15} />
          </a>
        )}
      </div>
    </section>
  );
}
