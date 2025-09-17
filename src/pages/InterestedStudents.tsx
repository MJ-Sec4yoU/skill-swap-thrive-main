import Header from "@/components/Header";
import { InterestedStudents as InterestedStudentsComponent } from "@/components/InterestedStudents";

const InterestedStudentsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interested Students</h1>
          <p className="text-muted-foreground">Manage students who want to learn from your skills</p>
        </div>

        <InterestedStudentsComponent />
      </main>
    </div>
  );
};

export default InterestedStudentsPage;