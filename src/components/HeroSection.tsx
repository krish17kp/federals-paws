import { Info } from "lucide-react";

export function HeroSection() {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif text-primary font-medium mb-3 tracking-tight">
        Federal Paws
      </h2>
      <p className="text-base text-on-surface-variant mb-6 max-w-3xl">
        Review animal-related Federal Register notices processed by the Open Paws backend, verify the official source, and decide whether follow-up is needed.
      </p>
      
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase bg-surface-container px-3 py-1.5 text-on-surface-variant">
          <Info size={14} />
          Informational guidance only. Verify official Federal Register source before taking action.
        </span>
      </div>
    </div>
  );
}
