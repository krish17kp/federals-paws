import { useState } from "react";
import { subscribeUser } from "../api";
import { Agency } from "../types";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export function SubscribePanel({ availableAgencies }: { availableAgencies: Agency[] }) {
  const [email, setEmail] = useState("");
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>(["animal-and-plant-health-inspection-service", "fish-and-wildlife-service"]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Animal Welfare", "Wildlife"]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Enter an email address.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const response = await subscribeUser({ email, agencies: selectedAgencies, topics: selectedTopics });
      setStatus("success");
      setMessage(response.message || "Subscription saved successfully.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAgency = (slug: string) => {
    setSelectedAgencies(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const agencyOptions = availableAgencies.length > 0
    ? availableAgencies.slice(0, 3).map((agency) => ({
        label: agency.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 5).toUpperCase(),
        slug: agency.slug,
      }))
    : [
        { label: "APHIS", slug: "animal-and-plant-health-inspection-service" },
        { label: "FWS", slug: "fish-and-wildlife-service" },
        { label: "NOAA", slug: "national-oceanic-and-atmospheric-administration" },
      ];

  return (
    <div className="bg-primary text-on-primary rounded-xl p-5 sm:p-8 shadow-md flex flex-col lg:flex-row gap-8 items-stretch justify-between border border-primary mt-12 w-full">
      <div className="md:w-1/2">
        <h3 className="text-[32px] font-serif font-bold mb-3 tracking-tight">Get daily animal policy alerts</h3>
        <p className="text-primary-fixed-dim mb-8 text-[15px] leading-relaxed">
          Stay informed on federal actions impacting animals. Customize your daily digest by agency and topic.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-primary-fixed-dim mb-2">EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="w-full px-4 py-3.5 border border-primary-container rounded bg-primary-container text-on-primary focus:outline-none focus:border-secondary-fixed focus:ring-1 focus:ring-secondary-fixed placeholder:text-outline/70 shadow-sm"
            />
          </div>
          <button onClick={handleSubscribe} disabled={loading} className="disabled:opacity-50 flex justify-center items-center gap-2 bg-secondary text-on-secondary px-6 py-3.5 rounded font-semibold hover:bg-secondary-fixed hover:text-primary transition-colors w-full md:w-auto shadow-sm tracking-wide">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Subscribe to Daily Digest
          </button>
          
          {status === "success" && (
            <div className="flex items-center gap-2 text-secondary-fixed mt-2">
              <CheckCircle size={16} /> {message}
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-error-container mt-2">
              <AlertTriangle size={16} /> {message || "Something went wrong."}
            </div>
          )}
        </div>
      </div>
      
      <div className="md:w-1/2 bg-primary-container p-5 sm:p-6 rounded-lg border border-primary-fixed/10 w-full shadow-inner">
        <h4 className="text-lg font-semibold mb-5 text-primary-fixed">Quick Preferences</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-primary-fixed-dim mb-3">AGENCIES</label>
            <div className="space-y-3">
              {agencyOptions.map(opt => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={selectedAgencies.includes(opt.slug)} onChange={() => toggleAgency(opt.slug)} className="w-[18px] h-[18px] accent-secondary cursor-pointer" />
                  <span className="text-on-primary text-[15px]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-primary-fixed-dim mb-3">TOPICS</label>
            <div className="space-y-3">
              {[
                "Animal Welfare",
                "Wildlife",
                "Marine Mammals"
              ].map(topic => (
                <label key={topic} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={selectedTopics.includes(topic)} onChange={() => toggleTopic(topic)} className="w-[18px] h-[18px] accent-secondary cursor-pointer" />
                  <span className="text-on-primary text-[15px]">{topic}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
