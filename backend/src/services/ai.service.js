const Groq = require("groq-sdk");

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyze document content using Groq AI
 * @param {string} documentText - Extracted text from document
 * @returns {Promise<Object>} Analysis result with summary and policy check
 */
const analyzeDocument = async (documentText) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Limit text length to avoid token limits (Groq has context limits)
    const maxTextLength = 10000; // Adjust based on your needs
    const truncatedText =
      documentText.length > maxTextLength
        ? documentText.substring(0, maxTextLength) + "..."
        : documentText;

    const systemPrompt = `You are an AI assistant that analyzes educational documents. Your task is to:
1. Provide a concise summary of the document content (2-3 sentences)
2. Identify the main topics and subjects covered
3. Check if the document violates community policies

Community Policy Violations to check for:
- Hate speech, discrimination, or offensive content
- Illegal activities or instructions
- Copyright infringement or plagiarism
- Inappropriate or adult content
- Misinformation or false information
- Spam or promotional content unrelated to education

Respond in JSON format with the following structure:
{
  "summary": "Brief summary of the document content",
  "topics": ["topic1", "topic2", "topic3"],
  "policyViolation": {
    "hasViolation": false,
    "violationType": null,
    "reason": null
  },
  "isEducational": true,
  "recommendedCategory": "suggested category name"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Analyze this document:\n\n${truncatedText}`,
        },
      ],
      model: "llama-3.1-70b-versatile", // or "mixtral-8x7b-32768" for faster responses
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from Groq API");
    }

    // Parse JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseContent);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysisResult = {
        summary: responseContent,
        topics: [],
        policyViolation: {
          hasViolation: false,
          violationType: null,
          reason: null,
        },
        isEducational: true,
        recommendedCategory: "General",
      };
    }

    return {
      success: true,
      data: {
        aiSummary: analysisResult.summary || "No summary available",
        topics: analysisResult.topics || [],
        policyViolation: analysisResult.policyViolation || {
          hasViolation: false,
          violationType: null,
          reason: null,
        },
        isEducational: analysisResult.isEducational !== false,
        recommendedCategory: analysisResult.recommendedCategory || "General",
      },
    };
  } catch (error) {
    console.error("Groq AI Analysis Error:", error);
    return {
      success: false,
      error: error.message,
      data: {
        aiSummary: "AI analysis failed. Please review manually.",
        topics: [],
        policyViolation: {
          hasViolation: false,
          violationType: null,
          reason: null,
        },
        isEducational: true,
        recommendedCategory: "General",
      },
    };
  }
};

module.exports = {
  analyzeDocument,
};
