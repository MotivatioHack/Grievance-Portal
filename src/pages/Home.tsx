import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import heroImage from "@/assets/hero-portal.jpg";
import { 
  Shield, 
  FileText, 
  BarChart3, 
  UserCheck, 
  Clock, 
  TrendingUp,
  Eye,
  Lock,
  Zap
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: "Submit Complaints",
      description: "File complaints anonymously or with your identity. Attach supporting documents and track progress.",
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Real-time Tracking",
      description: "Monitor your complaint status with detailed timelines and transparent progress updates.",
      color: "text-secondary"
    },
    {
      icon: UserCheck,
      title: "Admin Dashboard",
      description: "Comprehensive management tools for administrators to handle, assign, and resolve complaints efficiently.",
      color: "text-accent"
    },
    {
      icon: Clock,
      title: "Auto Escalation",
      description: "Automatic escalation system ensures no complaint is left unresolved for too long.",
      color: "text-warning"
    },
  ];

  const stats = [
    { number: "10,000+", label: "Complaints Resolved", icon: TrendingUp },
    { number: "24/7", label: "Portal Availability", icon: Clock },
    { number: "99.9%", label: "System Uptime", icon: Zap },
    { number: "100%", label: "Transparency", icon: Eye },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Transparent</span>
                  <br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Grievance Portal
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A secure, efficient platform for submitting complaints, tracking resolutions, 
                  and ensuring accountability in institutions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/complaint">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-neon transition-all duration-300 text-lg px-8 py-6"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Submit Complaint
                  </Button>
                </Link>
                <Link to="/track">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10 hover:shadow-neon transition-all duration-300 text-lg px-8 py-6"
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Track Status
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>100% Transparent</span>
                </div>
              </div>
            </div>

            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="Futuristic Grievance Portal Interface"
                className="w-full h-auto rounded-2xl shadow-glass"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard 
                  key={index} 
                  className="text-center animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features for
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Transparency</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced platform provides all the tools needed for efficient grievance management
              and transparent resolution processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard 
                  key={index} 
                  className="space-y-4 animate-slide-up" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  hover={true}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-primary/10 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GlassCard className="space-y-8" glow={true}>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who trust our platform for transparent grievance management.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-neon transition-all duration-300 text-lg px-8 py-6"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </Link>
              <Link to="/complaint">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10 hover:shadow-neon transition-all duration-300 text-lg px-8 py-6"
                >
                  Submit Anonymous Complaint
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Home;