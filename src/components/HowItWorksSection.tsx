import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Search, MessageSquare, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Set up your profile with skills you can teach and want to learn. Upload your portfolio and set availability.",
      details: ["Add your expertise", "Set learning goals", "Upload credentials"]
    },
    {
      icon: Search,
      title: "Find Your Match",
      description: "Browse skilled professionals or get AI-powered recommendations based on your interests and goals.",
      details: ["Smart matching algorithm", "Filter by skills & availability", "View verified profiles"]
    },
    {
      icon: MessageSquare, 
      title: "Connect & Plan",
      description: "Start conversations, schedule sessions, and create structured learning plans with milestones.",
      details: ["Real-time messaging", "Calendar integration", "Goal setting tools"]
    },
    {
      icon: CheckCircle,
      title: "Learn & Earn",
      description: "Participate in interactive sessions, track progress, and earn verified certificates upon completion.",
      details: ["Video collaboration", "Progress tracking", "Verified certificates"]
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How SkillSwap Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and begin your peer-to-peer learning journey with our simple 4-step process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  {/* Step Icon */}
                  <div className="relative mb-6">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground mb-4">
                      <step.icon className="h-10 w-10" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Details */}
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-success mr-1" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Arrow between steps - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8"
            onClick={() => navigate("/register")}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;