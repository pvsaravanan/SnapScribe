
import { useState, useEffect } from 'react';
import { Rocket, Star, Moon, Smile, Heart, Flower, Eye, Zap, FileText, MessageSquare, Briefcase, HelpCircle, Film, Clock, HeartHandshake, BookOpen, PartyPopper, ArrowRight, Frown, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarField from '@/components/StarField';
import ImageUploader from '@/components/ImageUploader';
import CaptionDisplay from '@/components/CaptionDisplay';
import ModelLoadingFallback from '@/components/ModelLoadingFallback';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { generateCaptionKeywords } from '@/services/captionService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CAPTION_STYLES = [
  { label: "Funny / Witty", value: "funny", icon: <Smile className="h-4 w-4 text-yellow-400 inline mr-1" /> },
  { label: "Inspirational / Motivational", value: "inspirational", icon: <Heart className="h-4 w-4 text-pink-500 inline mr-1" /> },
  { label: "Poetic / Aesthetic", value: "poetic", icon: <Flower className="h-4 w-4 text-purple-400 inline mr-1" /> },
  { label: "Minimal / Mysterious", value: "minimal", icon: <Eye className="h-4 w-4 text-gray-400 inline mr-1" /> },
  { label: "Trendy / Gen Z / Internet Slang", value: "trendy", icon: <Zap className="h-4 w-4 text-blue-400 inline mr-1" /> },
  { label: "Romantic / Soft", value: "romantic", icon: <Heart className="h-4 w-4 text-rose-300 inline mr-1" /> },
  { label: "Descriptive / Informative", value: "descriptive", icon: <FileText className="h-4 w-4 text-indigo-400 inline mr-1" /> },
  { label: "Sarcastic", value: "sarcastic", icon: <MessageSquare className="h-4 w-4 text-yellow-600 inline mr-1" /> },
  { label: "Professional / Brand Voice", value: "professional", icon: <Briefcase className="h-4 w-4 text-violet-700 inline mr-1" /> },
  { label: "Question / Engaging", value: "question", icon: <HelpCircle className="h-4 w-4 text-green-600 inline mr-1" /> },
  { label: "Dramatic / Cinematic", value: "dramatic", icon: <Film className="h-4 w-4 text-gray-700 inline mr-1" /> },
  { label: "Nostalgic", value: "nostalgic", icon: <Clock className="h-4 w-4 text-orange-600 inline mr-1" /> },
  { label: "Empowering / Bold", value: "empowering", icon: <HeartHandshake className="h-4 w-4 text-fuchsia-500 inline mr-1" /> },
  { label: "Casual / Conversational", value: "casual", icon: <MessageSquare className="h-4 w-4 text-teal-400 inline mr-1" /> },
  { label: "Artsy / Abstract", value: "artsy", icon: <Palette className="h-4 w-4 text-indigo-600 inline mr-1" /> },
  { label: "Emo / Moody", value: "emo", icon: <Frown className="h-4 w-4 text-gray-800 inline mr-1" /> },
  { label: "Storytelling", value: "storytelling", icon: <BookOpen className="h-4 w-4 text-lime-700 inline mr-1" /> },
  { label: "Humblebrag", value: "humblebrag", icon: <Briefcase className="h-4 w-4 text-yellow-700 inline mr-1" /> },
  { label: "Celebratory", value: "celebratory", icon: <PartyPopper className="h-4 w-4 text-amber-600 inline mr-1" /> },
  { label: "Call-to-Action", value: "cta", icon: <ArrowRight className="h-4 w-4 text-cyan-600 inline mr-1" /> },
];

// New: Social media platforms
const SOCIAL_PLATFORMS = [
  { label: "Instagram", value: "instagram" },
  { label: "Twitter/X", value: "twitter" },
  { label: "Facebook", value: "facebook" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "TikTok", value: "tiktok" },
  { label: "Pinterest", value: "pinterest" },
  { label: "Snapchat", value: "snapchat" },
  { label: "Threads", value: "threads" },
  { label: "Other", value: "other" },
];

function recommendCaptionStyle(selectedImage: File | null): string {
  if (!selectedImage) return CAPTION_STYLES[0].value;
  const sizeKB = selectedImage.size / 1024;

  if (sizeKB < 100) return "minimal";
  if (sizeKB < 300) return "casual";
  if (sizeKB < 1000) return "descriptive";
  if (sizeKB >= 1000) return "poetic";

  const idx = Math.floor(Math.random() * CAPTION_STYLES.length);
  return CAPTION_STYLES[idx].value;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [captionStyle, setCaptionStyle] = useState(CAPTION_STYLES[0].value);
  const [recommendedStyle, setRecommendedStyle] = useState(CAPTION_STYLES[0].value);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0].value);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedImage) {
      const rec = recommendCaptionStyle(selectedImage);
      setRecommendedStyle(rec);
      setCaptionStyle(rec);
      console.log("New image selected, recommended style:", rec);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (caption && captionStyle) {
      setCaption('');
      setKeywords([]);
    }
  }, [captionStyle]);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setCaption('');
    setModelError(null);
    setKeywords([]);
    console.log("New image selected:", file.name, "size:", Math.round(file.size / 1024), "KB");
  };

  // Pass platform to suggestion generation
  const handleGenerateCaption = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image to generate a caption.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setModelError(null);

      if (!caption) {
        setIsModelLoading(true);
      }

      console.log(
        "Starting caption & keyword generation for image:",
        selectedImage.name,
        "with style:",
        captionStyle,
        "emojis:",
        includeEmojis,
        "platform:",
        platform
      );

      // Await both caption & keywords from Gemini, now with platform
      const { caption: generatedCaption, keywords: generatedKeywords } =
        await generateCaptionKeywords(selectedImage, captionStyle, includeEmojis, platform);

      setCaption(generatedCaption);
      setKeywords(generatedKeywords);

      toast({
        title: "Caption generated!",
        description: "Your cosmic caption and keyword boost are ready.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate caption";
      console.error("Caption/keyword generation error:", error);

      if (
        errorMessage.includes("model") ||
        errorMessage.includes("memory") ||
        errorMessage.includes("load") ||
        errorMessage.includes("browser")
      ) {
        setModelError(errorMessage);
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsModelLoading(false);
    }
  };

  const styleDetails = CAPTION_STYLES.find((s) => s.value === captionStyle);
  const recommendedDetails = CAPTION_STYLES.find((s) => s.value === recommendedStyle);
  const platformDetails = SOCIAL_PLATFORMS.find((p) => p.value === platform);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField starCount={150} />
      <div className="container max-w-4xl mx-auto px-4 py-10 relative z-10">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Moon className="h-8 w-8 text-primary animate-float" />
            <Star className="h-6 w-6 text-primary animate-twinkle" />
            <Rocket className="h-10 w-10 text-primary animate-float" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold cosmic-gradient bg-clip-text text-transparent mb-3">
            SnapScribe
          </h1>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto">
            Upload your image and let our AI generate a stellar caption for your social media posts.
          </p>
        </header>
        <main className="space-y-8 max-w-2xl mx-auto">
          <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />

          {/* Caption style selection */}
          <div className="mt-4">
            <label className="font-medium block mb-2 text-primary text-base">
              Select Caption Style:
            </label>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <select
                className="w-full md:w-auto px-4 py-2 border rounded-lg bg-card/80 border-primary/20 focus:border-primary transition-all"
                value={captionStyle}
                onChange={(e) => setCaptionStyle(e.target.value)}
                disabled={isLoading || isModelLoading}
                aria-label="Select Caption Style"
              >
                {CAPTION_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              <div className="md:ml-4 py-1 px-2 bg-primary/10 rounded-md flex items-center text-sm text-primary gap-1">
                <span>
                  {recommendedDetails?.icon}
                  Recommended: <b>{recommendedDetails?.label}</b>
                </span>
              </div>
            </div>
          </div>

          {/* Social platform selection (NEW) */}
          <div className="mt-4">
            <label className="font-medium block mb-2 text-primary text-base">
              Select Social Media Platform:
            </label>
            <Select
              value={platform}
              onValueChange={setPlatform}
              disabled={isLoading || isModelLoading}
            >
              <SelectTrigger className="w-full md:w-auto px-4">
                <SelectValue>
                  {platformDetails ? platformDetails.label : "Select platform"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">This will help the AI generate platform-optimized captions and hashtags.</p>
          </div>

          {/* Emoji toggle */}
          <div className="flex items-center mt-2 gap-3">
            <Switch
              id="emoji-toggle"
              checked={includeEmojis}
              onCheckedChange={setIncludeEmojis}
              disabled={isLoading || isModelLoading}
            />
            <label htmlFor="emoji-toggle" className="text-sm text-primary font-medium cursor-pointer">
              Include emojis in generated captions
            </label>
          </div>

          {modelError ? (
            <ModelLoadingFallback onRetry={handleGenerateCaption} error={modelError} />
          ) : isModelLoading ? (
            <div className="space-card p-12 text-center">
              <LoadingIndicator text="Loading AI model" showProgress={true} className="py-6" />
              <p className="text-sm text-muted-foreground mt-4">
                This may take a moment on the first run. The model needs to download (~150MB).
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <Button
                  onClick={handleGenerateCaption}
                  disabled={!selectedImage || isLoading}
                  className="cosmic-gradient hover:opacity-90 transition-opacity text-white font-semibold px-8 py-6 rounded-full text-lg group cosmic-glow"
                  size="lg"
                >
                  <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  {isLoading ? "Generating..." : "Blast Off!"}
                </Button>
              </div>

              {(caption || isLoading) && (
                <CaptionDisplay caption={caption} isLoading={isLoading} />
              )}

              {/* Suggested Boost Keywords & Hashtags Section */}
              {!!keywords.length && (
                <section className="mt-8 space-card p-6 bg-card border rounded-xl shadow-lg">
                  <h4 className="font-bold text-primary mb-2 text-lg">
                    Suggested Boost Keywords &amp; Hashtags
                  </h4>
                  <ul className="flex flex-wrap gap-2">
                    {keywords.map((keyword, idx) => (
                      <li
                        key={keyword + idx}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium shadow-sm"
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground text-xs mt-2">
                    Use these {platformDetails?.label ?? 'social'} keywords and hashtags to maximize reach on public posts!
                  </p>
                </section>
              )}
            </>
          )}
        </main>
        <footer className="mt-16 text-center text-sm text-foreground/60">
          <p>Powered by AI and cosmic inspiration ✨</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
