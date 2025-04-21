
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  className?: string;
  text?: string;
  showProgress?: boolean;
}

const LoadingIndicator = ({ 
  className, 
  text = 'Loading', 
  showProgress = true 
}: LoadingIndicatorProps) => {
  const [dots, setDots] = useState('.');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Dot animation
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 500);
    
    // Fake progress animation
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 95);
        });
      }, 800);
      
      return () => {
        clearInterval(dotInterval);
        clearInterval(progressInterval);
      };
    }
    
    return () => clearInterval(dotInterval);
  }, [showProgress]);
  
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <div className="text-center">
        <p className="text-sm text-foreground/80">
          {text}{dots}
        </p>
        {showProgress && (
          <div className="w-full mt-2 bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
