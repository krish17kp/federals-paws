import { AlertTriangle, CalendarRange, Loader2 } from "lucide-react";
import { Notice } from "../types";
import { NoticeDisclaimer } from "./NoticeDisclaimer";
import { NoticeMetadata } from "./NoticeMetadata";
import { NoticeStatusBadge } from "./NoticeStatusBadge";
import { SourceVerification } from "./SourceVerification";

export function NoticeList({
  notices,
  loading,
  error,
  date,
}: {
  notices: Notice[];
  loading: boolean;
  error: string;
  date: string;
}) {
  const safeNotices = Array.isArray(notices) ? notices : [];

  return (
    <div>
      <h3 className="text-2xl font-serif text-primary mb-6 flex items-center gap-2.5">
        <CalendarRange size={24} className="text-primary" />
        Animal-related notices for {date}
      </h3>

      {loading ? (
        <div className="flex justify-center p-12 text-on-surface-variant">
          <Loader2 className="animate-spin" size={32} aria-label="Loading notices" />
        </div>
      ) : error ? (
        <div className="bg-surface-container-lowest border border-error rounded-lg p-8 text-error shadow-sm">
          <p className="font-semibold">Unable to load Federal Register notices.</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : safeNotices.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 text-on-surface-variant shadow-sm">
          No animal-related notices were returned for this date and filter set.
        </div>
      ) : (
        <div className="space-y-4">
          {safeNotices.map((notice, idx) => (
            <NoticeCard
              key={notice.id || notice.document_number || `${notice.title}-${idx}`}
              notice={notice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-sm space-y-5">
      <div className="space-y-3">
        <NoticeMetadata notice={notice} />
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <h4 className="text-[22px] leading-tight font-serif text-primary font-semibold">
            {notice.title || "Untitled notice"}
          </h4>
          <NoticeStatusBadge
            actionability={notice.actionability}
            urgency={notice.urgency}
          />
        </div>
      </div>

      <section>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Plain-language summary
        </h5>
        <p className="mt-2 leading-relaxed text-on-surface">
          {notice.summary_plain_language}
        </p>
      </section>

      <section>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Why this matters to animal advocates
        </h5>
        <p className="mt-2 leading-relaxed text-on-surface">
          {notice.why_it_matters}
        </p>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded border border-outline-variant p-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Actionability
          </h5>
          <p className="mt-2 text-on-surface">
            Status: {notice.actionability || "informational"}
          </p>
        </div>

        <div className="rounded border border-outline-variant p-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Deadline
          </h5>
          {notice.comment_deadline ? (
            <p className="mt-2 flex items-center gap-1.5 font-semibold text-error">
              <AlertTriangle size={18} /> {notice.comment_deadline}
            </p>
          ) : (
            <p className="mt-2 text-on-surface-variant">
              No comment deadline returned by the backend.
            </p>
          )}
          {notice.deadline_sensitivity && (
            <p className="mt-2 text-sm text-on-surface-variant">
              Sensitivity: {notice.deadline_sensitivity}
            </p>
          )}
        </div>
      </section>

      {notice.suggested_talking_points ? (
        <section className="rounded border border-outline-variant p-4">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Suggested advocacy talking points
          </h5>
          {Array.isArray(notice.suggested_talking_points) ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-on-surface">
              {notice.suggested_talking_points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-on-surface">{notice.suggested_talking_points}</p>
          )}
        </section>
      ) : null}

      <SourceVerification notice={notice} />
      <NoticeDisclaimer disclaimer={notice.disclaimer} />
    </article>
  );
}
