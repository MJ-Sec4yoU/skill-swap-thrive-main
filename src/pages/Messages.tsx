import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Clock,
  Bell,
  Zap,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Messages - Coming Soon! 💬
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We're working hard to bring you an amazing messaging experience. Soon you'll be able to chat directly with your skill exchange partners, share resources, and coordinate your learning sessions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Chat</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Instant messaging with your learning partners
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Session Scheduling</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Schedule and manage your learning sessions
                  </p>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Resource Sharing</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Share files, links, and learning materials
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/schedule')} className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a Session Instead
                </Button>
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-center mb-2">
                  <Bell className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">Stay Tuned!</span>
                </div>
                <p className="text-sm text-blue-700">
                  We'll notify you as soon as the messaging feature is ready. In the meantime, you can continue discovering skills and connecting with fellow learners.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Messages;