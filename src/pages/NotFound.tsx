import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <div className="relative max-w-md w-full text-center">
        <GlassCard className="space-y-8" glow={true}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="h-16 w-16 text-destructive animate-glow-pulse" />
              <div className="absolute inset-0 bg-destructive rounded-full blur-lg opacity-30" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/">
              <Button className="bg-gradient-primary hover:shadow-neon transition-all duration-300">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </a>
            <a href="/complaint">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 hover:shadow-neon transition-all duration-300"
              >
                Submit Complaint
              </Button>
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default NotFound;
