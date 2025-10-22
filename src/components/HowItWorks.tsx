import { Card } from "@/components/ui/card";
import { Star, Gamepad2, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Star,
    title: "Join Freecash",
    description: "Sign up for free on Freecash in seconds. No subscription fees, just instant access to earning opportunities.",
  },
  {
    number: "02",
    icon: Gamepad2,
    title: "Complete Tasks",
    description: "Test mobile apps, play games, and answer surveys. Choose from hundreds of available offers and tasks.",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Get Paid",
    description: "Earn real money for each completed task. Cash out your earnings via PayPal, gift cards, or crypto.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start earning money from testing apps, playing games, and completing surveys
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card 
              key={step.number}
              className="p-8 bg-[var(--card-gradient)] border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Number Badge */}
                <div className="text-primary font-bold text-sm">{step.number}</div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
