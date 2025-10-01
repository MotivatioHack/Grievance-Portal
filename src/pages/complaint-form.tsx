import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/GlassCard";
import { FileText, Upload, AlertCircle, Send, User, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Priority = "low" | "medium" | "high" | "urgent";
type SubmissionMode = "anonymous" | "registered";

const ComplaintForm = () => {
  const [mode, setMode] = useState<SubmissionMode>("registered");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "medium" as Priority,
    attachments: [] as File[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Administrative Issues",
    "Service Quality",
    "Staff Behavior",
    "Policy Concerns",
    "Technical Problems",
    "Billing/Financial",
    "Safety & Security",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...newFiles].slice(0, 5) // Max 5 files
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, category, description, priority } = formData;

    const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    // If the user is in 'registered' mode, get the token and add it to the request.
    if (mode === 'registered') {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to submit a registered complaint. Please log in again.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch('/api/complaints', {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ title, category, description, priority }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit complaint.');
        }

        toast({
            title: "Complaint Submitted Successfully",
            description: `Your complaint ID is: ${data.complaintId}. Save this for tracking.`,
        });

        // Reset form after successful submission
        setFormData({
            title: "",
            category: "",
            description: "",
            priority: "medium",
            attachments: []
        });

    } catch (err: any) {
        toast({
            title: "Submission Failed",
            description: err.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-10" />
      
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FileText className="h-12 w-12 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-30" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Submit Your Complaint
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Report issues, concerns, or grievances through our secure and transparent platform
          </p>
        </div>

        {/* Submission Mode Toggle */}
        <div className="mb-8">
          <GlassCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <h3 className="text-lg font-semibold text-foreground">Submission Mode:</h3>
              <div className="flex space-x-4">
                <Button
                  variant={mode === "registered" ? "default" : "outline"}
                  onClick={() => setMode("registered")}
                  className={mode === "registered" ? "bg-gradient-primary shadow-neon" : "border-primary text-primary hover:bg-primary/10"}
                >
                  <User className="mr-2 h-4 w-4" />
                  Registered User
                </Button>
                <Button
                  variant={mode === "anonymous" ? "default" : "outline"}
                  onClick={() => setMode("anonymous")}
                  className={mode === "anonymous" ? "bg-gradient-primary shadow-neon" : "border-primary text-primary hover:bg-primary/10"}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Anonymous
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="animate-slide-up" glow={true}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium text-lg">
                  Complaint Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300 text-lg py-6"
                  placeholder="Brief description of your complaint"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground font-medium text-lg">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300 text-lg py-6">
                      <SelectValue placeholder="Select complaint category" />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/30">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-foreground font-medium text-lg">
                    Priority Level *
                  </Label>
                  <Select value={formData.priority} onValueChange={(value: Priority) => handleInputChange("priority", value)}>
                    <SelectTrigger className="glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300 text-lg py-6">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/30">
                      <SelectItem value="low">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span>Low Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>Medium Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-warning" />
                          <span>High Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                          <span>Urgent</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground font-medium text-lg">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="glass border-primary/30 focus:border-primary focus:shadow-neon transition-all duration-300 min-h-[150px] text-lg"
                  placeholder="Please provide a detailed description of your complaint, including relevant dates, locations, and people involved..."
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label className="text-foreground font-medium text-lg">
                Supporting Documents (Optional)
              </Label>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Upload supporting files
                  </p>
                  <p className="text-muted-foreground">
                    Images, documents, or other relevant files (Max 5 files, 10MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* File List */}
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Attached Files:</h4>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                      <span className="text-sm text-foreground">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Mode Notice */}
            {mode === "anonymous" && (
              <div className="p-4 glass rounded-lg border border-warning/30">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-warning">Anonymous Submission</p>
                    <p className="text-sm text-muted-foreground">
                      You will receive a complaint ID to track your submission. Save this ID as it's the only way to check your complaint status.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300 py-6 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Submitting Complaint...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Submit Complaint</span>
                </div>
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ComplaintForm;