import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GlassCard from "../components/GlassCard";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, Send, FileSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ComplaintSuccess = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (complaintId) {
      const textArea = document.createElement("textarea");
      textArea.value = complaintId;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied to Clipboard",
          description: `Complaint ID: ${complaintId}`,
        });
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Copy Failed",
          description: "Could not copy the ID. Please copy it manually.",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleTrackComplaint = () => {
    // Navigate to the track page and pass the ID in the state
    // so the page can auto-fetch the details.
    navigate(`/track-complaint`, { state: { complaintId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-glow opacity-10" />
      
      <div className="relative max-w-2xl w-full mx-auto text-center animate-fade-in">
        <GlassCard glow={true}>
            <div className="p-8 space-y-6">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <CheckCircle className="h-20 w-20 text-green-400 animate-glow-pulse" />
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                    Complaint Submitted Successfully!
                </h1>
                <p className="text-lg text-muted-foreground">
                    Your grievance has been recorded. Please save your Complaint ID to track its status.
                </p>

                <div className="py-4">
                    <Label className="text-sm text-muted-foreground">Your Complaint ID</Label>
                    <div className="mt-2 flex items-center justify-center space-x-2 p-4 glass rounded-lg border border-primary/30">
                        <p className="font-mono text-xl text-primary font-bold tracking-wider">
                            {complaintId}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyToClipboard}
                            aria-label="Copy Complaint ID"
                        >
                            <Copy className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleTrackComplaint}
                        className="bg-gradient-primary hover:shadow-neon transition-all duration-300 w-full sm:w-auto"
                    >
                        <FileSearch className="mr-2 h-4 w-4" />
                        Track Your Complaint
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
                    >
                        <Link to="/complaint-form">
                            <Send className="mr-2 h-4 w-4" />
                            Submit Another Complaint
                        </Link>
                    </Button>
                </div>
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ComplaintSuccess;

