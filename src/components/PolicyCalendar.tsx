export function PolicyCalendar({
  selectedDate,
  onDateSelect,
}: {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}) {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-semibold text-primary">
          Review by publication date
        </h3>
        <p className="text-sm text-on-surface-variant">
          Select a Federal Register publication date. The frontend sends this
          date to the n8n-backed notice endpoint.
        </p>
      </div>

      <label className="block mt-5 text-[11px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">
        Publication Date
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(event) => onDateSelect(event.target.value)}
        className="w-full sm:w-64 border border-outline-variant rounded bg-surface p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </section>
  );
}
