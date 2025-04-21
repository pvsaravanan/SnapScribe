
import { useState, useEffect } from 'react';
import { Clipboard, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LoadingIndicator from '@/components/LoadingIndicator';

interface CaptionDisplayProps {
  caption: string;
  isLoading: boolean;
}

const CaptionDisplay = ({ caption, isLoading }: CaptionDisplayProps) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');

  // Reset display text when a new caption comes in
  useEffect(() => {
    if (caption && !isLoading) {
      setEditedCaption(caption);
      setIndex(0);
      setDisplayText('');
    }
  }, [caption, isLoading]);

  // Typewriter effect
  useEffect(() => {
    if (caption && !isLoading && index < caption.length) {
      const interval = setInterval(() => {
        setIndex((prev) => {
          if (prev >= caption.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
        
        setDisplayText((prev) => prev + caption[index]);
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [caption, isLoading, index]);

  // Update edited caption when display text changes
  useEffect(() => {
    if (displayText) {
      setEditedCaption(displayText);
    }
  }, [displayText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedCaption);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div 
      className={cn(
        "w-full space-card p-6 transition-all duration-300",
        caption ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        isLoading && "animate-pulse"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-primary">Your Cosmic Caption</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            disabled={!editedCaption || isLoading}
            className="h-8 w-8 rounded-full hover:bg-primary/10"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <span className="sr-only">Copy caption</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="h-32 w-full flex items-center justify-center">
            <LoadingIndicator text="Generating your cosmic caption" />
          </div>
        ) : (
          <Textarea 
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            placeholder="Your caption will appear here..."
            // Show all text with as many rows as needed
            rows={Math.max(4, editedCaption.split('\n').length + Math.ceil(editedCaption.length / 75))}
            className="w-full border-primary/20 bg-card/50 focus:border-primary/50 text-foreground/90 resize-y overflow-auto"
            style={{
              // Make the textarea expand naturally, allow vertical resizing, show scroll when needed
              minHeight: '80px',
              maxHeight: '360px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          />
        )}
        
        <div className="flex justify-end">
          <Button
            onClick={handleCopy}
            disabled={!editedCaption || isLoading}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {copied ? "Copied!" : "Copy Caption"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CaptionDisplay;
