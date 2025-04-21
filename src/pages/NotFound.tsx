import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Star } from "lucide-react";
import StarField from "@/components/StarField";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative">
      <StarField starCount={200} />
      <div className="space-card p-10 text-center max-w-md mx-auto cosmic-glow">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Star className="h-10 w-10 text-primary animate-twinkle" />
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <Star className="h-10 w-10 text-primary animate-twinkle" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Lost in Space</h2>
        <p className="text-muted-foreground mb-8">
          The cosmic coordinates you're looking for seem to be in another galaxy.
        </p>
        
        <Button 
          asChild
          className="cosmic-gradient px-6 py-6 hover:opacity-90 text-white font-medium rounded-full"
        >
          <a href="/">
            <Rocket className="mr-2 h-5 w-5" />
            Return to Mission Control
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
