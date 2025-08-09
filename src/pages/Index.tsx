import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, BarChart3, FileSpreadsheet, Camera, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Face Recognition",
      description: "AWS Rekognition powered attendance tracking"
    },
    {
      icon: Users,
      title: "Student Management", 
      description: "Complete student registration and gallery"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Detailed attendance analytics and insights"
    },
    {
      icon: FileSpreadsheet,
      title: "Excel Reports",
      description: "Generate and download attendance reports"
    },
    {
      icon: Shield,
      title: "AWS Integration",
      description: "Secure cloud storage with S3 and DynamoDB"
    },
    {
      icon: CheckCircle,
      title: "Real-time Tracking",
      description: "Instant attendance marking and verification"
    }
  ];

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Faculty Focus</h1>
          </div>
          <Link to="/dashboard">
            <Button className="gradient-primary">
              Access Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Smart Attendance Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced facial recognition powered by AWS services for seamless, 
            accurate, and efficient student attendance tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="gradient-primary px-8">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">247</div>
              <p className="text-sm text-muted-foreground">Students Registered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1">92%</div>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">99.8%</div>
              <p className="text-sm text-muted-foreground">Recognition Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Complete Attendance Solution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything faculty need to manage student attendance efficiently 
            with cutting-edge technology and intuitive design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="dashboard-card dashboard-card-hover border-border/50">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-6 py-16">
        <Card className="dashboard-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Powered by AWS</CardTitle>
            <CardDescription>
              Built on reliable, scalable cloud infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground">AWS S3</p>
                <p className="text-xs text-muted-foreground">Face Storage</p>
              </div>
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground">Rekognition</p>
                <p className="text-xs text-muted-foreground">Face Recognition</p>
              </div>
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground">DynamoDB</p>
                <p className="text-xs text-muted-foreground">Data Storage</p>
              </div>
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-foreground">EC2</p>
                <p className="text-xs text-muted-foreground">Hosting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Access your faculty dashboard and start managing attendance 
            with advanced facial recognition technology.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gradient-primary px-8">
              Access Faculty Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 gradient-primary rounded flex items-center justify-center">
              <Camera className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-foreground">Faculty Focus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Attendance Management • Powered by AWS Services
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
