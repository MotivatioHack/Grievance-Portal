import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import GlassCard from "../components/GlassCard";
import { 
  Search, 
  Filter, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  Eye, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

// Define the structure of a Complaint object from the backend
interface Complaint {
  complaint_id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in-progress" | "resolved" | "escalated";
  created_at: string;
  submittedBy: string; // This will be the user's name or 'Anonymous'
}

// Define the structure for a Stat card
interface Stat {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Security Check 1: If no token, redirect to login immediately.
      if (!token) {
        navigate('/login');
        toast({ title: "Unauthorized", description: "You must be logged in to view this page.", variant: "destructive" });
        return;
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch both complaints and stats from the backend at the same time.
        const [complaintsResponse, statsResponse] = await Promise.all([
          fetch('/api/admin/complaints', { headers }),
          fetch('/api/admin/stats', { headers })
        ]);

        // Security Check 2: If the backend returns a 403 Forbidden error (non-admin user), redirect.
        if (complaintsResponse.status === 403 || statsResponse.status === 403) {
          navigate('/'); // Redirect to home page
          toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
          return;
        }

        if (!complaintsResponse.ok || !statsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const complaintsData = await complaintsResponse.json();
        const statsData = await statsResponse.json();

        // Map the stats data to include the actual icon components for display
        const iconMap: { [key: string]: React.ElementType } = { FileText, Clock, Users, CheckCircle };
        const formattedStats = statsData.map((stat: Omit<Stat, 'icon'> & { iconName: string }) => ({
          ...stat,
          icon: iconMap[stat.iconName],
          color: stat.iconName === 'FileText' ? 'text-primary' : stat.iconName === 'Clock' ? 'text-warning' : stat.iconName === 'Users' ? 'text-secondary' : 'text-accent'
        }));

        setComplaints(complaintsData);
        setStats(formattedStats);
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Could not load dashboard data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, toast]);
  
  // Helper functions for styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-accent text-accent-foreground";
      case "medium": return "bg-primary text-primary-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "urgent": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500 text-white";
      case "in-progress": return "bg-yellow-500 text-white";
      case "resolved": return "bg-green-500 text-white";
      case "escalated": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = complaint.title.toLowerCase().includes(searchLower) ||
                          complaint.complaint_id.toLowerCase().includes(searchLower) ||
                          complaint.submittedBy.toLowerCase().includes(searchLower);
    const matchesFilter = selectedFilter === "all" || complaint.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-10" />
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage and resolve complaints efficiently</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={index} className="text-left p-6 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Icon className={`h-8 w-8 ${stat.color} mb-4`} />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.title}</div>
              </GlassCard>
            );
          })}
        </div>
        
        {/* Filters and Search */}
        <GlassCard className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, or submitter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full glass border-primary/30 focus:border-primary focus:shadow-neon"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex space-x-2">
                {["all", "new", "in-progress", "resolved", "escalated"].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    onClick={() => setSelectedFilter(filter)}
                    className={selectedFilter === filter ? "bg-gradient-primary shadow-neon" : "border-primary text-primary hover:bg-primary/10"}
                    size="sm"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
        
        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map((complaint, index) => (
            <GlassCard key={complaint.complaint_id} className="p-4 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{complaint.complaint_id}</span>
                    <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace('-', ' ').toUpperCase()}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{complaint.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{complaint.submittedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    <Eye className="h-4 w-4 mr-2" /> View
                  </Button>
                  <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary/10">
                    <MessageSquare className="h-4 w-4 mr-2" /> Respond
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        
        {filteredComplaints.length === 0 && !isLoading && (
          <GlassCard className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No Complaints Found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

