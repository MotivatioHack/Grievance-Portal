import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/GlassCard";
import { 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Calendar,
  MessageSquare,
  Eye,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimelineItem {
  status: string;
  comment: string;
  timestamp: string;
  updatedBy: string;
}

interface ComplaintDetails {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in-progress" | "resolved" | "escalated" | "pending" | "in_progress";
  submittedDate: string;
  submittedBy: string;
  description: string;
  timeline: TimelineItem[];
  assignedTo?: string;
}

const TrackComplaint = () => {
  const location = useLocation();
  const [complaintId, setComplaintId] = useState(location.state?.complaintId || "");
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!complaintId.trim()) {
      toast({
        title: "Complaint ID Required",
        description: "Please enter a valid complaint ID to track your submission.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setComplaint(null);

    try {
      const response = await fetch(`/api/complaints/${complaintId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Complaint not found.');
      }

      const formattedComplaint: ComplaintDetails = {
        id: data.complaint_id,
        title: data.title,
        category: data.category,
        priority: data.priority,
        status: data.status,
        submittedDate: new Date(data.created_at).toLocaleDateString(),
        submittedBy: data.user_id ? `User ID: ${data.user_id}` : 'Anonymous',
        description: data.description,
        assignedTo: data.assigned_to || 'Not yet assigned',
        timeline: [
          {
            status: "Complaint Submitted",
            comment: data.admin_comment || "New complaint received and logged into the system.",
            timestamp: new Date(data.created_at).toLocaleString(),
            updatedBy: "System"
          }
        ]
      };

      setComplaint(formattedComplaint);
      toast({
        title: "Complaint Found",
        description: "Your complaint details have been loaded successfully.",
      });

    } catch (err: any) {
      setComplaint(null);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred. Please check the ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.complaintId) {
      handleSearch();
    }
  }, [location.state?.complaintId]);


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "text-accent";
      case "medium": return "text-primary";
      case "high": return "text-warning";
      case "urgent": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "complaint submitted":
      case "new":
      case "pending":
        return <FileText className="h-4 w-4 text-primary" />;
      case "under review":
      case "investigation started":
      case "in-progress":
      case "in_progress":
        return <Clock className="h-4 w-4 text-warning" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "escalated":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Eye className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-10" />
      
      <div className="relative max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Search className="h-12 w-12 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-30" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Track Your Complaint
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your complaint ID to view the current status and timeline
          </p>
        </div>

        <GlassCard className="animate-slide-up" glow={true}>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="complaintId" className="text-foreground font-medium text-lg">
                Complaint ID
              </Label>
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="complaintId"
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    className="pl-10 glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300 text-lg py-6"
                    placeholder="Enter your complaint ID"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-gradient-primary hover:shadow-neon transition-all duration-300 px-8 py-6"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Track</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {complaint && (
          <div className="space-y-6 animate-fade-in">
            <GlassCard>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Complaint Details
                  </h2>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Complaint ID</span>
                      <p className="font-mono text-lg text-foreground">{complaint.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Title</span>
                      <p className="text-lg text-foreground">{complaint.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Category</span>
                      <p className="text-lg text-foreground">{complaint.category}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Priority</span>
                      <p className={`text-lg font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Current Status</span>
                      <p className="text-lg font-medium text-foreground">
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Submitted Date</span>
                      <p className="text-lg text-foreground">{complaint.submittedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-foreground leading-relaxed">{complaint.description}</p>
                </div>

                {complaint.assignedTo && (
                  <div className="flex items-center space-x-2 p-3 glass rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      <strong>Assigned to:</strong> {complaint.assignedTo}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-foreground">
                  Status Timeline
                </h3>

                <div className="space-y-6">
                  {complaint.timeline.map((item, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="p-2 glass rounded-full border border-primary/30">
                          {getStatusIcon(item.status)}
                        </div>
                        {index < complaint.timeline.length - 1 && (
                          <div className="w-px h-16 bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2 pb-8">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-foreground">
                            {item.status.replace('_', ' ')}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.comment}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>Updated by: {item.updatedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;