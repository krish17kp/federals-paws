import { useState, useEffect, useCallback } from "react";
import { HeroSection } from "./HeroSection";
import { PolicyCalendar } from "./PolicyCalendar";
import { NoticeList } from "./NoticeList";
import FilterPanel from "./FilterPanel";
import { SubscribePanel } from "./SubscribePanel";
import { Footer } from "./Footer";
import { fetchCalendarNotices, fetchAgencies } from "../api";
import { Notice, Agency, NoticeFilters } from "../types";

const EMPTY_FILTERS: NoticeFilters = {
  agency_slug: "",
  document_type: "",
  actionability: "",
  deadline_status: "",
};

function getTodayForInput(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeDateForApi(date: string): string {
  if (!date) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date: string): string {
  const normalizedDate = normalizeDateForApi(date);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return date;
  }

  const [year, month, day] = normalizedDate.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function matchesSearch(notice: Notice, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    notice.title,
    notice.agency,
    notice.agency_slug,
    notice.document_number,
    notice.abstract,
    notice.summary_plain_language,
    notice.why_it_matters,
  ].some((value) => String(value || "").toLowerCase().includes(normalizedQuery));
}

export function Dashboard({ searchQuery }: { searchQuery: string }) {
  const [selectedDate, setSelectedDate] = useState(getTodayForInput);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filters, setFilters] = useState<NoticeFilters>(EMPTY_FILTERS);

  useEffect(() => {
    fetchAgencies()
      .then((data) => {
        setAgencies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Unable to load agencies:", err);
        setAgencies([]);
      });
  }, []);

  const loadNotices = useCallback(
    async (dateToLoad: string, filtersToUse: NoticeFilters) => {
      try {
        const apiDate = normalizeDateForApi(dateToLoad);

        setLoading(true);
        setError("");

        const result = await fetchCalendarNotices({
          date: apiDate,
          agency_slug: filtersToUse.agency_slug,
          document_type: filtersToUse.document_type,
          actionability: filtersToUse.actionability,
          deadline_status: filtersToUse.deadline_status,
        });

        setNotices(Array.isArray(result) ? result : []);
      } catch (err: unknown) {
        console.error("Failed to load notices:", err);
        setError(err instanceof Error ? err.message : "Failed to load notices.");
        setNotices([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadNotices(selectedDate, filters);
    }, 0);

    return () => window.clearTimeout(id);
  }, [selectedDate, filters, loadNotices]);

  const handleDateSelect = (date: string) => {
    const apiDate = normalizeDateForApi(date);

    setSelectedDate(apiDate);
  };

  const handleApplyFilters = (newFilters: NoticeFilters) => {
    setFilters({
      agency_slug: newFilters.agency_slug || "",
      document_type: newFilters.document_type || "",
      actionability: newFilters.actionability || "",
      deadline_status: newFilters.deadline_status || "",
    });
  };

  const visibleNotices = notices.filter((notice) =>
    matchesSearch(notice, searchQuery),
  );

  return (
    <div
      id="dashboard-top"
      className="p-4 sm:p-6 xl:p-10 max-w-[1280px] mx-auto space-y-8 scroll-mt-28"
    >
      <HeroSection />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-8">
          <section id="calendar-section" className="scroll-mt-24">
            <PolicyCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </section>

          <section id="notices-section" className="scroll-mt-24">
            <NoticeList
              notices={visibleNotices}
              loading={loading}
              error={error}
              date={formatDateForDisplay(selectedDate)}
            />
          </section>
        </div>

        <div
          id="filters-section"
          className="xl:col-span-4 xl:sticky xl:top-24 scroll-mt-24"
        >
          <FilterPanel
            agencies={agencies}
            currentFilters={filters}
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>

      <section id="subscribe-section" className="scroll-mt-24">
        <SubscribePanel availableAgencies={agencies} />
      </section>

      <Footer />
    </div>
  );
}
