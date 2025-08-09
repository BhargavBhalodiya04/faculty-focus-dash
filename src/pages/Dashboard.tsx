import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  Camera, 
  BarChart3, 
  FileSpreadsheet, 
  BookOpen,
  Plus,
  Scan
} from "lucide-react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { StudentGallery } from "@/components/Dashboard/StudentGallery";
import { AttendanceAnalytics } from "@/components/Dashboard/AttendanceAnalytics";
import { ReportsDownloads } from "@/components/Dashboard/ReportsDownloads";
import { ClassOverview } from "@/components/Dashboard/ClassOverview";

type DashboardView = 'main' | 'students' | 'analytics' | 'reports' | 'classes' | 'register' | 'attendance';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('main');

  const dashboardOptions = [
    {
      title: "Register Student",
      description: "Add new student faces to the system",
      icon: Plus,
      variant: "primary" as const,
      stats: "Active",
      view: "register" as DashboardView
    },
    {
      title: "Take Attendance", 
      description: "Capture class photo and mark attendance",
      icon: Scan,
      variant: "secondary" as const,
      stats: "Ready",
      view: "attendance" as DashboardView
    },
    {
      title: "Student Gallery",
      description: "View all registered student images",
      icon: Users,
      variant: "success" as const,
      stats: "247 Students", 
      view: "students" as DashboardView
    },
    {
      title: "Attendance Analytics",
      description: "Individual student performance graphs",
      icon: BarChart3,
      variant: "primary" as const,
      stats: "92% Avg",
      view: "analytics" as DashboardView
    },
    {
      title: "Reports & Downloads",
      description: "Download Excel files and attendance reports", 
      icon: FileSpreadsheet,
      variant: "warning" as const,
      stats: "15 Reports",
      view: "reports" as DashboardView
    },
    {
      title: "Class Overview",
      description: "Subject-wise attendance and class graphs",
      icon: BookOpen,
      variant: "secondary" as const,
      stats: "8 Subjects",
      view: "classes" as DashboardView
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'students':
        return <StudentGallery />;
      case 'analytics':
        return <AttendanceAnalytics />;
      case 'reports':
        return <ReportsDownloads />;
      case 'classes':
        return <ClassOverview />;
      case 'register':
        return (
          <div className="text-center py-20">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Register Student Feature</h3>
            <p className="text-muted-foreground mb-4">This will integrate with your existing Python Flask registration system.</p>
            <p className="text-sm text-muted-foreground">
              Connect this interface to your <code>/upload-image</code> endpoint for seamless integration.
            </p>
          </div>
        );
      case 'attendance':
        return (
          <div className="text-center py-20">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Take Attendance Feature</h3>
            <p className="text-muted-foreground mb-4">This will integrate with your existing Python Flask attendance system.</p>
            <p className="text-sm text-muted-foreground">
              Connect this interface to your <code>/take_attendance</code> endpoint for real-time functionality.
            </p>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center py-8 gradient-subtle rounded-lg">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome to Faculty Dashboard
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive attendance management powered by AWS services
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="dashboard-card text-center">
                <div className="text-2xl font-bold text-primary">247</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
              <div className="dashboard-card text-center">
                <div className="text-2xl font-bold text-success">92%</div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
              </div>
              <div className="dashboard-card text-center">
                <div className="text-2xl font-bold text-secondary">8</div>
                <p className="text-sm text-muted-foreground">Active Subjects</p>
              </div>
              <div className="dashboard-card text-center">
                <div className="text-2xl font-bold text-warning">15</div>
                <p className="text-sm text-muted-foreground">Available Reports</p>
              </div>
            </div>

            {/* Dashboard Options */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Dashboard Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardOptions.map((option, index) => (
                  <DashboardCard
                    key={index}
                    title={option.title}
                    description={option.description}
                    icon={option.icon}
                    variant={option.variant}
                    stats={option.stats}
                    onClick={() => setCurrentView(option.view)}
                  />
                ))}
              </div>
            </div>

          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <DashboardHeader />
      
      {/* Navigation breadcrumb */}
      {currentView !== 'main' && (
        <div className="px-6 py-2 border-b border-border bg-card">
          <button
            onClick={() => setCurrentView('main')}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Dashboard;