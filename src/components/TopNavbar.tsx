import { Search } from "lucide-react";

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TopNavbar({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <header className="bg-surface-bright flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center w-full px-4 sm:px-6 xl:px-10 py-3 sm:h-20 border-b border-outline-variant shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-6 min-w-0 h-full">
        <span className="text-xl xl:text-2xl font-serif font-semibold text-primary truncate">
          Federal Register Animal Advocacy Email Notifications
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 min-w-0 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-72 xl:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search documents, agencies, keywords..."
            className="pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed w-full placeholder:text-outline"
          />
        </div>

        <button
          onClick={() => scrollToSection("subscribe-section")}
          className="hidden sm:block bg-primary text-on-primary px-4 py-2 rounded font-semibold hover:bg-primary-container transition-colors shadow-sm whitespace-nowrap"
        >
          Create Alert
        </button>
      </div>
    </header>
  );
}
