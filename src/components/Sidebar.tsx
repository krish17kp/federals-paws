import { 
  Building2, 
  CalendarDays, 
  FileText, 
  LayoutDashboard, 
  Mail, 
  PawPrint
} from "lucide-react";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Sidebar() {
  const navItems = [
    { icon: CalendarDays, label: "Publication Date", target: "calendar-section" },
    { icon: FileText, label: "Animal Notices", target: "notices-section" },
    { icon: Building2, label: "Filters", target: "filters-section" },
    { icon: Mail, label: "Subscribe", target: "subscribe-section" },
  ];

  return (
    <nav className="hidden md:flex bg-surface border-r border-outline-variant w-[260px] xl:w-[280px] shrink-0 h-full flex-col py-6 xl:py-8 z-20">
      <div className="px-5 xl:px-6 mb-6 xl:mb-8 flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <PawPrint size={20} className="fill-current" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-serif font-extrabold text-primary leading-none truncate">Federal Paws</h1>
          <p className="text-xs font-bold tracking-wider text-on-surface-variant mt-1">FEDERAL REGISTER ALERTS</p>
        </div>
      </div>
      
      <div className="px-5 xl:px-6 mb-6 xl:mb-8">
        <div className="w-full bg-primary text-on-primary font-semibold py-3 rounded text-center text-[15px]">
          Daily animal policy monitoring
        </div>
      </div>

      <ul className="flex-1 px-4 space-y-1">
        <li>
          <button
            type="button"
            onClick={() => scrollToSection("dashboard-top")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-primary font-bold border-l-4 border-primary bg-secondary-container/20 transition-opacity text-left"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
        </li>
        {navItems.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => scrollToSection(item.target)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors font-semibold border-l-4 border-transparent hover:text-primary text-left"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
