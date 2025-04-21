const GEMINI_API_KEY = "AIzaSyCGS4b-BRjRXhst5Vq0lGh_VRHJjG3Od4Y";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Helper to convert file to base64 string
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Style-specific prompts
const STYLE_PROMPT_MAP: Record<string, string> = {
  funny: "Make it funny or witty.",
  inspirational: "Make it inspirational or motivational.",
  poetic: "Make it poetic or aesthetic.",
  minimal: "Make it minimal or mysterious.",
  trendy: "Use trendy, Gen Z, or internet slang.",
  romantic: "Make it romantic or soft.",
  descriptive: "Make it descriptive or informative.",
  sarcastic: "Make it sarcastic.",
  professional: "Use a professional or brand voice.",
  question: "Pose a question or engage the audience.",
  dramatic: "Make it dramatic or cinematic.",
  nostalgic: "Make it nostalgic.",
  empowering: "Make it empowering or bold.",
  casual: "Make it casual or conversational.",
  artsy: "Make it artsy or abstract.",
  emo: "Make it emo or moody.",
  storytelling: "Tell a brief story in the caption.",
  humblebrag: "Make it a humblebrag.",
  celebratory: "Make it celebratory.",
  cta: "Make it a call to action.",
};

// Style-specific fallback captions
const STYLE_FALLBACK_MAP: Record<string, string> = {
  funny: "This image is so stunning, it made my other photos delete themselves out of jealousy!",
  inspirational: "Every moment captured is a step toward creating the story you want to tell. Keep shining!",
  poetic: "Silhouettes against time, memories like whispers, frozen in a frame of endless possibilities.",
  minimal: "Less frame. More story.",
  trendy: "It's giving main character energy and I'm totally here for it. No cap.",
  romantic: "In a world of ordinary moments, this one felt like magic between heartbeats.",
  descriptive: "A perfectly composed image showcasing depth, contrast, and the artistry of visual storytelling.",
  sarcastic: "Just another day pretending this didn't take 47 attempts to get right.",
  professional: "Excellence in every detail. Quality that speaks for itself.",
  question: "What story would this image tell if it could speak? The possibilities are endless.",
  dramatic: "In that suspended moment, everything changed. Nothing would ever be the same again.",
  nostalgic: "Reminds me of simpler times when moments like these were everything.",
  empowering: "This is what owning your story looks like. Bold. Unapologetic. Real.",
  casual: "Just hanging out and caught this cool shot. Thought I'd share!",
  artsy: "Boundaries blurred between perception and reality in this visual exploration.",
  emo: "Sometimes the brightest smiles hide the deepest shadows. Feeling seen?",
  storytelling: "They said it couldn't be done, but here I am, proving that every image has a story worth telling.",
  humblebrag: "Just me doing ordinary things while accidentally looking extraordinary.",
  celebratory: "Another milestone reached! Here's to celebrating every step of this amazing journey!",
  cta: "Double tap if this made you stop scrolling! Share your thoughts below.",
};

// Default fallback for styles without specific fallbacks
const DEFAULT_FALLBACK = "A captivating moment beautifully captured in this image.";

export async function generateCaption(
  imageFile: File,
  style: string
): Promise<string> {
  try {
    console.log(`Starting caption generation with style: ${style}`);

    // Convert image to base64 string
    const imageBase64 = await fileToBase64(imageFile);

    // Build style prompt
    const styleInstruction = STYLE_PROMPT_MAP[style] || "";

    // Core prompt: handle any type of image with style-specific instructions
    const prompt = `Generate a unique, engaging caption for this image (between 60-120 characters). 
    Focus on describing what you see in the image, whether it's people, places, objects, events, etc. 
    ${styleInstruction} 
    Be creative and make it specific to what's in the image.
    Respond ONLY with the caption text itself, no explanations or metadata.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: imageFile.type || "image/jpeg",
                data: imageBase64,
              },
            },
            {
              text: prompt,
            }
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9, // Increased for more variety
        maxOutputTokens: 150,
      },
    };

    console.log("Sending request to Gemini API");

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`API error (${response.status}): ${errText}`);
      throw new Error(`API Error: ${response.status} - Please check your API key or try again later.`);
    }

    const data = await response.json();
    console.log("Received response from Gemini API");

    // Improved error handling for API response structure
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Unexpected API response format:", JSON.stringify(data, null, 2));
      throw new Error("Received an unexpected response format from the API.");
    }

    const captionText = data.candidates[0].content.parts[0].text.trim();

    // Enhanced processing to eliminate repeated character patterns
    let cleanedCaption = captionText
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/^(caption|caption:)\s*/i, '') // Remove "Caption:" prefix
      .replace(/(\*|\#|\-|\>)/g, '') // Remove markdown symbols
      .trim();

    // Check for repeated characters pattern (like "rrrrr" or "ccccc")
    const repeatedCharPattern = /(.)\1{5,}/;
    if (repeatedCharPattern.test(cleanedCaption)) {
      console.warn("Detected repeated character pattern in caption, using fallback");
      return STYLE_FALLBACK_MAP[style] || DEFAULT_FALLBACK;
    }

    // If it's still too long, truncate it
    if (cleanedCaption.length > 150) {
      cleanedCaption = cleanedCaption.substring(0, 147) + '...';
    }

    // Quality check - ensure caption is meaningful
    if (cleanedCaption.length < 10) {
      console.warn("Caption too short, using style-specific fallback");
      return STYLE_FALLBACK_MAP[style] || DEFAULT_FALLBACK;
    }

    console.log("Successfully generated caption:", cleanedCaption);
    return cleanedCaption;
  } catch (error) {
    console.error("Caption generation error:", error);

    // Return style-specific fallback caption 
    return STYLE_FALLBACK_MAP[style] || DEFAULT_FALLBACK;
  }
}

export async function generateCaptionKeywords(
  imageFile: File,
  style: string,
  includeEmojis: boolean,
  platform?: string
): Promise<{ caption: string; keywords: string[] }> {
  try {
    const imageBase64 = await fileToBase64(imageFile);
    const styleInstruction = (STYLE_PROMPT_MAP[style] || "") +
      (includeEmojis ? " Use emojis where fitting." : " Do not use any emojis.");
    // Platform context for the prompt
    const platformString = platform && platform !== "other"
      ? `Optimize your suggestions specifically for ${platform.charAt(0).toUpperCase() + platform.slice(1)}. Use the most effective strategies, keywords, and language for that platform.`
      : "Optimize your suggestions for public/social sharing to maximize reach.";

    // Prompt Gemini to generate both caption and keywords/hashtags:
    const prompt = `For the provided image, do the following:
1. Generate a unique, engaging caption (between 60-120 characters). ${styleInstruction}
   Focus on describing what you see in the image; be creative and specific.
   Tailor language and format for ${platform && platform !== "other" ? platform : "the selected social media platform"}.  
   Respond ONLY with the caption text for the first answer.
2. Then, suggest 6-10 highly relevant keywords or hashtags based on the IMAGE CONTENT and its context (not just the style).
   List keywords/hashtags likely to boost visibility for a public post on ${platform && platform !== "other" ? platform : "the chosen platform"}—prefer short, trending, or descriptive words/hashtags popular on ${platform && platform !== "other" ? platform : "social media"}.
   ${platformString}
   Respond as strict valid JSON: 
   {"caption":"...", "keywords":["#one","#two",...]}
Do not include any extra text or explanation—only the exact JSON.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: { mime_type: imageFile.type || "image/jpeg", data: imageBase64 },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 180 },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status}\n${errText}`);
    }

    const data = await response.json();

    // Parse Gemini's response for caption & keywords (strict valid JSON expected)
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let captionText = "";
    let keywords: string[] = [];

    try {
      const parsed = JSON.parse(text);
      captionText = typeof parsed.caption === "string" ? parsed.caption.trim() : "";
      keywords = Array.isArray(parsed.keywords) ? parsed.keywords.map((k) => (typeof k === "string" ? k.trim() : "")).filter(Boolean) : [];
    } catch (_err) {
      // Fallback: try to extract caption & keywords from semi-structured text
      const result = /caption"\s*:\s*"(.*?)"/i.exec(text);
      captionText = result?.[1]?.trim() || "";
      const kwMatch = /keywords"\s*:\s*\[(.*?)\]/i.exec(text);
      if (kwMatch) {
        keywords = kwMatch[1]
          .split(",")
          .map((k) => k.replace(/["'#]/g, "").trim())
          .filter(Boolean)
          .map((k) => (k.startsWith("#") ? `#${k.replace(/^#+/, "")}` : `#${k}`));
      }
    }

    // Caption fallback
    if (!captionText || captionText.length < 10) {
      captionText = STYLE_FALLBACK_MAP[style] || DEFAULT_FALLBACK;
    }
    // Keyword fallback
    if (!keywords.length) {
      keywords = [
        "#trending",
        "#viral",
        "#instagood",
        "#photooftheday",
        "#explore",
        "#new",
        "#wow",
      ];
    }

    // Truncate caption if needed
    if (captionText.length > 150) {
      captionText = captionText.substring(0, 147) + "...";
    }

    return { caption: captionText, keywords };
  } catch (error: any) {
    // Fallback to original generateCaption and generic keywords
    const fallbackCaption = await generateCaption(imageFile, style);
    return {
      caption: fallbackCaption,
      keywords: [
        "#trending",
        "#viral",
        "#instagood",
        "#photooftheday",
        "#explore",
        "#new",
        "#wow",
      ],
    };
  }
}
