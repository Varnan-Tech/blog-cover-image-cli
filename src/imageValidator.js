import { GoogleGenAI } from '@google/genai';

export async function validateImage(base64Image, title, hasLogo, apiKey) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Analyze this blog cover image and verify if it meets the following requirements:
1. TEXT ACCURACY: Does the image contain the exact text: "${title}"?
2. LOGO PRESENCE: ${hasLogo ? 'The image MUST contain a company logo.' : 'No specific logo was required.'}
3. AESTHETIC: Is the background pure white? Is the typography bold, black, and minimalist?
4. QUALITY: Are there any obvious AI artifacts, garbled text, or layout issues?

Return a JSON object with:
- "isValid": boolean (true only if ALL requirements are met)
- "issues": string (empty if isValid is true, otherwise describe what is wrong)
`;

  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png',
          },
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse validation response: ${text}`);
  }
}
