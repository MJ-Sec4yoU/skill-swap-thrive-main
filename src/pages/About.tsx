import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Heart, 
  Globe, 
  Users, 
  Award, 
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Linkedin,
  Twitter,
  Github
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in the power of peer-to-peer learning and building supportive communities."
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Quality education should be accessible to everyone, regardless of financial background."
    },
    {
      icon: Globe,
      title: "Global Connection",
      description: "Breaking down geographical barriers to connect learners and experts worldwide."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly improving our platform with cutting-edge technology and user feedback."
    }
  ];

  const team = [
    {
      name: "Mufiz Topinkatti",
      role: "CEO & Co-Founder",
      bio: "Former Google engineer passionate about democratizing education through technology.",
      avatar: "AC",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Dhanashree chavhan",
      role: "CTO & Co-Founder", 
      bio: "Full-stack developer and AI researcher focused on building intelligent matching systems.",
      avatar: "SR",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Vidhan Bhoir",
      role: "Head of Community",
      bio: "Community building expert with 8+ years experience in online education platforms.",
      avatar: "MJ",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Harshita Chaubey",
      role: "Head of Product",
      bio: "Product designer and educator passionate about creating intuitive learning experiences.",
      avatar: "EP",
      linkedin: "#",
      twitter: "#"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Active Users" },
    { number: "500+", label: "Skills Available" },
    { number: "25,000+", label: "Sessions Completed" },
    { number: "50+", label: "Countries" }
  ];

  const timeline = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Founded by Alex and Sarah after they successfully exchanged programming skills for design expertise."
    },
    {
      year: "2023",
      title: "Beta Launch", 
      description: "Launched beta version with 100 early users from various tech communities."
    },
    {
      year: "2024",
      title: "AI Matching",
      description: "Introduced intelligent matching algorithm to improve partnership quality."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Reached 15,000+ users across 50+ countries with mobile app launch."
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
                About SkillSwap
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're on a mission to democratize learning by connecting people who want to share knowledge and grow together.
              </p>
              <Badge className="mb-8">
                Founded in 2023 • Remote-First • Community-Driven
              </Badge>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To create a world where anyone can learn any skill by leveraging the collective knowledge of our global community. We believe that everyone has something valuable to teach and something important to learn.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  A future where traditional educational barriers no longer exist, where learning is collaborative, accessible, and tailored to individual needs. We envision communities where knowledge flows freely and everyone can reach their full potential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
              <p className="text-muted-foreground">The numbers speak for themselves</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do and shape how we build our platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-primary-foreground mx-auto mb-4">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate individuals from diverse backgrounds united by a shared vision of accessible education
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold mx-auto mb-4">
                      {member.avatar}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
              <p className="text-muted-foreground">Key milestones in our mission to democratize learning</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {timeline.map((event, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full text-primary-foreground font-bold flex-shrink-0">
                      {event.year.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.year}</p>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Get In Touch</h2>
              <p className="text-muted-foreground">
                Have questions, feedback, or want to partner with us? We'd love to hear from you!
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">Get in touch for any inquiries</p>
                  <Button variant="outline" size="sm">
                    hello@skillswap.com
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm mb-4">Our headquarters (by appointment)</p>
                  <Button variant="outline" size="sm">
                    San Francisco, CA
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Join Community</h3>
                  <p className="text-muted-foreground text-sm mb-4">Connect with other learners</p>
                  <Button variant="outline" size="sm">
                    Discord Community
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join Our Mission?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Help us build the future of collaborative learning. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/learn')}>
                  Explore Skills
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;