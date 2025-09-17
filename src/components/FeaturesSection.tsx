import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Search, 
  MessageCircle, 
  Award, 
  Calendar, 
  Shield,
  Target,
  TrendingUp,
  Video 
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Matching",
      description: "AI-powered algorithm matches you with the perfect skill partners based on your interests and availability.",
      color: "bg-blue-500"
    },
    {
      icon: Video,
      title: "Interactive Sessions",
      description: "Engage in real-time video calls with screen sharing, file exchange, and collaborative tools.",
      color: "bg-purple-500"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning milestones, track progress, and celebrate achievements with structured task management.",
      color: "bg-green-500"
    },
    {
      icon: Award,
      title: "Skill Verification",
      description: "Earn verified badges and certificates through peer endorsements and skill assessments.",
      color: "bg-orange-500"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Seamless calendar integration to find the perfect time for your skill exchange sessions.",
      color: "bg-indigo-500"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Comprehensive rating system and verification process ensures a safe learning environment.",
      color: "bg-red-500"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need to Learn and Teach
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need for successful peer-to-peer skill exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 border-border/50">
              <CardContent className="p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;