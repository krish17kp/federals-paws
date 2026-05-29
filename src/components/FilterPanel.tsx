import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Agency, NoticeFilters } from "../types";

type FilterPanelProps = {
  agencies: Agency[];
  currentFilters: NoticeFilters;
  onApplyFilters: (filters: NoticeFilters) => void;
};

type LocalFilters = {
  agency_slug: string;
  document_type: string;
  actionability: string;
  deadline_status: string;
};

const EMPTY_FILTERS: LocalFilters = {
  agency_slug: "",
  document_type: "",
  actionability: "",
  deadline_status: "",
};

const ACTIONABILITY_OPTIONS = [
  { label: "All Actionability", value: "" },
  { label: "Public Comment Open", value: "public_comment_open" },
  { label: "Urgent / Deadline Sensitive", value: "deadline_sensitive" },
  { label: "Monitoring Only", value: "monitoring_only" },
  { label: "Action Available", value: "action_available" },
];

function normalizeFilters(filters: NoticeFilters): LocalFilters {
  return {
    agency_slug: filters?.agency_slug || "",

    document_type: filters?.document_type || "",

    actionability: filters?.actionability || "",

    deadline_status: filters?.deadline_status || "",
  };
}

function buildApiFilters(localFilters: LocalFilters): NoticeFilters {
  return {
    agency_slug: localFilters.agency_slug || "",
    document_type: localFilters.document_type || "",
    actionability: localFilters.actionability || "",
    deadline_status: localFilters.deadline_status || "",
  };
}

export function FilterPanel({
  agencies,
  currentFilters,
  onApplyFilters,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<LocalFilters>(() => {
    return {
      ...EMPTY_FILTERS,
      ...normalizeFilters(currentFilters),
    };
  });

  useEffect(() => {
    const normalized = normalizeFilters(currentFilters);
    const id = window.setTimeout(() => {
      setLocalFilters({
        ...EMPTY_FILTERS,
        ...normalized,
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [currentFilters]);

  const handleChange = <Key extends keyof LocalFilters>(
    key: Key,
    value: LocalFilters[Key],
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const apiFilters = buildApiFilters(localFilters);
    onApplyFilters(apiFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters(EMPTY_FILTERS);
    onApplyFilters({
      agency_slug: "",
      document_type: "",
      actionability: "",
      deadline_status: "",
    });
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
      <h3 className="text-2xl font-serif text-primary mb-5 border-b border-outline-variant pb-3 flex items-center gap-2.5 font-semibold">
        <Filter size={24} />
        Filter Notices
      </h3>

      <div className="space-y-7">
        <div className="space-y-6">
          <AgencySelect
            label="AGENCY"
            agencies={agencies}
            value={localFilters.agency_slug}
            onChange={(val) => handleChange("agency_slug", val)}
          />

          <FilterSelect
            label="DOCUMENT TYPE"
            value={localFilters.document_type}
            onChange={(val) => handleChange("document_type", val)}
            options={[
              { label: "All Types", value: "" },
              { label: "Notice", value: "notice" },
              { label: "Proposed Rule", value: "proposed rule" },
              { label: "Rule", value: "rule" },
              {
                label: "Presidential Document",
                value: "presidential document",
              },
            ]}
          />

          <FilterSelect
            label="ACTIONABILITY STATUS"
            value={localFilters.actionability}
            onChange={(val) => handleChange("actionability", val)}
            options={ACTIONABILITY_OPTIONS}
          />

          <FilterSelect
            label="DEADLINE STATUS"
            value={localFilters.deadline_status}
            onChange={(val) => handleChange("deadline_status", val)}
            options={[
              { label: "All Deadlines", value: "" },
              { label: "Urgent Deadlines", value: "approaching" },
              { label: "Open Deadlines", value: "open" },
              { label: "Closed Deadlines", value: "closed" },
              { label: "No Deadline", value: "none" },
            ]}
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-surface-container text-on-surface px-4 py-3 rounded font-semibold border border-outline-variant hover:bg-surface-container-high transition-colors shadow-sm tracking-wide"
          >
            Apply Filters
          </button>

          <button
            onClick={handleResetFilters}
            className="w-full bg-transparent text-on-surface-variant px-4 py-2 rounded font-medium border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;

function AgencySelect({
  label,
  agencies,
  value,
  onChange,
}: {
  label: string;
  agencies: Agency[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={agencies.length === 0}
          className="w-full appearance-none border border-outline-variant rounded bg-surface p-3 pr-10 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
        >
          <option value="">
            {agencies.length === 0 ? "Agency filter unavailable" : "All Agencies"}
          </option>

          {agencies.map((agency, index) => (
            <option key={`${agency.slug}-${index}`} value={agency.slug}>
              {agency.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline"
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-on-surface-variant mb-2 tracking-widest uppercase">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-outline-variant rounded bg-surface p-3 pr-10 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
        >
          {options.map((opt, index) => (
            <option key={`${opt.value}-${index}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={20}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline"
        />
      </div>
    </div>
  );
}
