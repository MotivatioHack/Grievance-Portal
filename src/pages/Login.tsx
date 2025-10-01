import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import GlassCard from "../components/GlassCard";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // --- THIS IS THE CORRECTED LINE ---
        // Changed from '/complaint-form' to the correct route '/complaint'
        navigate('/complaint'); 
      }

    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-30" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to access your grievance portal
          </p>
        </div>

        <GlassCard className="animate-slide-up" glow={true}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary-glow transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300 py-6 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/20">
            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary-glow transition-colors font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link to="/complaint">
              <Button 
                variant="outline" 
                className="w-full border-secondary text-secondary hover:bg-secondary/10 hover:shadow-purple transition-all duration-300"
              >
                Submit Anonymous Complaint
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;