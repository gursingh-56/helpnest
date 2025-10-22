import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-50" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Badge */}
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4 mr-2" />
          Earn Money Testing Apps & Surveys on Freecash
        </Badge>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-primary">Get Paid</span>
            <br />
            <span className="text-secondary">Testing Apps & Games</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete surveys, test mobile apps and games on Freecash and earn real money. 
            Simple tasks, instant rewards, and turn your free time into cash.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4">
          <Button 
            variant="hero" 
            size="xl"
            asChild
          >
            <a href="https://glitchy.go2cloud.org/aff_c?offer_id=3261&aff_id=146262">
              Start Earning Now
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Join 54M+ users earning on Freecash • No experience required
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
