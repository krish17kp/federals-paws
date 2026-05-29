export function Footer() {
  return (
    <footer className="mt-8 border-t border-outline-variant pt-8 pb-4 text-center flex flex-col md:flex-row justify-between items-center bg-transparent">
      <p className="text-sm text-on-surface-variant mb-4 md:mb-0">
        Disclaimer: This tool is not affiliated with the U.S. Government. Data is sourced from the official Federal Register API.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {["Terms of Service", "Privacy Policy", "Preference Management", "API Credits"].map((link) => (
          <a key={link} href="#" className="text-xs font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
