
const OPENAI_API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const generateResponse = async (messages: Message[]): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
