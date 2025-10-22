import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

const countries = [
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "DE", name: "Germany (Deutschland)" },
  { code: "CH", name: "Switzerland (Confoederatio Helvetica)" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "IT", name: "Italy" },
  { code: "SE", name: "Sweden" },
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgium" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
];

const GeographicEligibility = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="p-8 md:p-12 bg-[var(--card-gradient)] border-border">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Geographic Eligibility</h2>
          </div>

          <p className="text-muted-foreground mb-8">
            This offer is available to residents of:
          </p>

          {/* Countries Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {countries.map((country) => (
              <div 
                key={country.code}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
              >
                <span className="font-bold text-primary text-sm">{country.code}</span>
                <span className="text-sm">– {country.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GeographicEligibility;
