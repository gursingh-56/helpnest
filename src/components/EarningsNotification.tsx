import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign } from "lucide-react";

const notifications = [
  { name: "Lucas M.", amount: "$12.50", activity: "testing apps" },
  { name: "Sarah K.", amount: "$8.75", activity: "completing surveys" },
  { name: "Mike R.", amount: "$15.20", activity: "playing games" },
  { name: "Emma L.", amount: "$10.00", activity: "testing apps" },
];

const EarningsNotification = () => {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after 2 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 2000);

    // Cycle through notifications
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  const notification = notifications[currentNotification];

  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <Card className="p-4 bg-card border-border shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-primary/20">
            <AvatarFallback className="bg-primary/20 text-primary">
              {notification.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {notification.name} just earned{" "}
              <span className="text-primary font-bold">{notification.amount}</span>{" "}
              {notification.activity}
            </p>
            <p className="text-xs text-muted-foreground">3 minutes ago</p>
          </div>
          <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
        </div>
      </Card>
    </div>
  );
};

export default EarningsNotification;
