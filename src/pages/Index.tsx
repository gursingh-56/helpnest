import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import GeographicEligibility from "@/components/GeographicEligibility";
import EarningsNotification from "@/components/EarningsNotification";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <GeographicEligibility />
      <EarningsNotification />
    </div>
  );
};

export default Index;
