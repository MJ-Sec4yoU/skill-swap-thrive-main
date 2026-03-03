import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  UserPlus, 
  Search, 
  MessageCircle, 
  Calendar, 
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Users,
  BookOpen,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up and tell us what skills you want to learn and what you can teach others.",
      details: [
        "Upload your profile picture and bio",
        "List skills you want to learn with priority levels",
        "Add skills you can teach with proficiency levels", 
        "Set your availability and preferences"
      ]
    },
    {
      icon: Search,
      title: "Find Perfect Matches",
      description: "Browse skills or let our AI find the perfect learning partners for you.",
      details: [
        "Search by skill, category, or expertise level",
        "Get AI-powered recommendations based on your profile",
        "View detailed profiles and ratings",
        "Filter by availability, location, and more"
      ]
    },
    {
      icon: MessageCircle,
      title: "Connect & Plan",
      description: "Message your matches, discuss goals, and plan your learning sessions.",
      details: [
        "Chat in real-time with potential partners",
        "Share files and learning materials",
        "Set clear learning objectives",
        "Plan session structure and timeline"
      ]
    },
    {
      icon: Calendar,
      title: "Schedule Sessions",
      description: "Book convenient times for both parties and start your skill exchange journey.",
      details: [
        "Use integrated calendar to find mutual availability",
        "Set recurring sessions for ongoing learning",
        "Get automatic reminders and notifications",
        "Join video calls directly from the platform"
      ]
    },
    {
      icon: Award,
      title: "Learn & Get Certified",
      description: "Complete your learning milestones and earn verified certificates.",
      details: [
        "Track progress with structured milestones",
        "Submit and review project deliverables",
        "Rate and review your learning partners",
        "Earn certificates for completed skills"
      ]
    }
  ];

  const faqs = [
    {
      question: "How does the skill exchange work?",
      answer: "SkillSwap operates on a mutual learning model. You teach someone a skill you know well, and in return, you learn a skill from someone else. This creates a collaborative learning environment where everyone benefits."
    },
    {
      question: "Is SkillSwap free to use?",
      answer: "Yes! SkillSwap is free to use. We believe knowledge should be accessible to everyone. Premium features may be available in the future, but core functionality will always remain free."
    },
    {
      question: "How are matches determined?",
      answer: "Our AI matching system considers your learning goals, teaching skills, availability, experience level, and communication preferences to suggest the most compatible partners."
    },
    {
      question: "What if I'm a complete beginner?",
      answer: "Perfect! SkillSwap welcomes learners at all levels. Many of our community members love teaching beginners, and you can always offer skills you're confident in, even if you're new to other areas."
    },
    {
      question: "How do I verify someone's skills?",
      answer: "Users can verify their skills through peer endorsements, skill tests, portfolio uploads, and certificates. We also have a rating system where previous learning partners can vouch for someone's teaching ability."
    },
    {
      question: "Can I learn multiple skills at once?",
      answer: "Absolutely! You can have multiple active learning partnerships and work on different skills simultaneously. We recommend starting with 1-2 to maintain quality focus."
    },
    {
      question: "What happens if a session doesn't go well?",
      answer: "We have a feedback system and dispute resolution process. You can rate sessions, provide feedback, and if needed, contact our support team for assistance in resolving any issues."
    },
    {
      question: "How long do learning partnerships typically last?",
      answer: "It varies by skill complexity and learning goals. Some might be single sessions for quick tips, while others could span weeks or months for comprehensive skill development."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer → UX Designer", 
      content: "I taught React to a designer and learned UX principles in return. Now I'm a full-stack designer at a tech company!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Marcus Chen",
      role: "Marketing → Data Science",
      content: "The AI matching was spot-on. Found an amazing data scientist who needed help with marketing. We're still learning from each other 6 months later!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Elena Rodriguez",
      role: "Student → Full-Stack Developer",
      content: "As a computer science student, I traded my Python knowledge for front-end skills. Graduated with a job offer thanks to SkillSwap!",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-primary/3 to-background py-16">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How SkillSwap Works
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn any skill by teaching what you know. Join thousands of learners in our peer-to-peer education community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Simple 5-Step Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From profile creation to earning certificates, here's how you'll transform your learning journey
              </p>
            </div>
            
            <div className="grid gap-8 md:gap-12">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 md:flex-col md:text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <Badge className="md:hidden">{index + 1}</Badge>
                  </div>
                  
                  {/* Content */}
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <Badge className="hidden md:block">{index + 1}</Badge>
                          {step.title}
                        </CardTitle>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Growing Community</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">15K+</h3>
                <p className="text-muted-foreground">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground mx-auto mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">500+</h3>
                <p className="text-muted-foreground">Skills Available</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">25K+</h3>
                <p className="text-muted-foreground">Sessions Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">98%</h3>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real people, real skills, real career transformations
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about SkillSwap
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Learning Journey?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of learners who are already transforming their careers through skill exchange.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
                  Browse Skills First
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;