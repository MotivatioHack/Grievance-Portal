import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/GlassCard";
import { 
  Search, 
  Filter, 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in-progress" | "resolved" | "escalated";
  submittedDate: string;
  submittedBy: string;
  assignedTo?: string;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data
  const complaints: Complaint[] = [
    {
      id: "GRP-ABC123",
      title: "Poor Service Quality in Cafeteria",
      category: "Service Quality",
      priority: "medium",
      status: "new",
      submittedDate: "2024-01-15",
      submittedBy: "John Doe"
    },
    {
      id: "GRP-DEF456",
      title: "Staff Behavior Issue at Reception",
      category: "Staff Behavior",
      priority: "high",
      status: "in-progress",
      submittedDate: "2024-01-14",
      submittedBy: "Anonymous",
      assignedTo: "Admin Team"
    },
    {
      id: "GRP-GHI789",
      title: "Billing Discrepancy in Monthly Statement",
      category: "Billing/Financial",
      priority: "urgent",
      status: "escalated",
      submittedDate: "2024-01-13",
      submittedBy: "Sarah Wilson",
      assignedTo: "Senior Admin"
    },
    {
      id: "GRP-JKL012",
      title: "Technical Problem with Online Portal",
      category: "Technical Problems",
      priority: "low",
      status: "resolved",
      submittedDate: "2024-01-12",
      submittedBy: "Mike Johnson",
      assignedTo: "IT Team"
    }
  ];

  const stats = [
    { title: "Total Complaints", value: "156", icon: FileText, color: "text-primary", change: "+12%" },
    { title: "Pending Review", value: "23", icon: Clock, color: "text-warning", change: "-5%" },
    { title: "In Progress", value: "45", icon: Users, color: "text-secondary", change: "+8%" },
    { title: "Resolved", value: "88", icon: CheckCircle, color: "text-accent", change: "+15%" },
  ];

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
      case "new": return "bg-primary text-primary-foreground";
      case "in-progress": return "bg-secondary text-secondary-foreground";
      case "resolved": return "bg-accent text-accent-foreground";
      case "escalated": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || complaint.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-10" />
      
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage and resolve complaints efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard 
                key={index} 
                className="text-center animate-slide-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
                hover={true}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span className="text-sm text-accent font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.title}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Filters and Search */}
        <GlassCard className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints by ID or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-2">
                {["all", "new", "in-progress", "resolved", "escalated"].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    onClick={() => setSelectedFilter(filter)}
                    className={selectedFilter === filter 
                      ? "bg-gradient-primary shadow-neon" 
                      : "border-primary text-primary hover:bg-primary/10"
                    }
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
            <GlassCard 
              key={complaint.id} 
              className="animate-slide-up" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {complaint.id}
                    </span>
                    <Badge className={getPriorityColor(complaint.priority)}>
                      {complaint.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground">
                    {complaint.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{complaint.submittedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{complaint.submittedBy}</span>
                    </div>
                    {complaint.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Assigned to: {complaint.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <GlassCard className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Complaints Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;