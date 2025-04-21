
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ModelLoadingFallbackProps {
  onRetry: () => void;
  error?: string;
}

const ModelLoadingFallback = ({ onRetry, error }: ModelLoadingFallbackProps) => {
  return (
    <Alert className="space-card border-primary/20 bg-destructive/10">
      <AlertTitle className="text-destructive">Model Loading Issue</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>
          {error || 
            "We're having trouble loading the AI model in your browser. This could be due to limited memory or browser compatibility."}
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="border-destructive/30 hover:border-destructive/60"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <p className="text-sm text-muted-foreground">
            Try refreshing the page or using a different browser.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ModelLoadingFallback;
