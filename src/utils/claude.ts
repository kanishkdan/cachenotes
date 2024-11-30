import { ApiError } from './apiUtils';
import { ChatContext } from '../types/Chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function askClaude(
  apiKey: string, 
  prompt: string, 
  conversationHistory: Message[] = [],
  context?: ChatContext
): Promise<string> {
  if (!apiKey) {
    throw new ApiError('Claude API key is required');
  }

  try {
    let systemPrompt = "You are a helpful AI assistant.";
    
    if (context) {
      if (context.contentType === 'note') {
        systemPrompt += `\n\nCurrent note content:\n${context.noteContent || ''}`;
      } else if (context.contentType === 'twitter-thread') {
        systemPrompt += "\n\nCurrent Twitter thread:\n" + 
          context.threadContent?.posts
            .map((post, i) => `Tweet ${i + 1}: ${post.content}`)
            .join('\n');
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: [{ type: 'text', text: msg.content }]
          })),
          {
            role: 'user',
            content: [{ type: 'text', text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.error?.message || 'API request failed',
        response.status,
        error.error?.type
      );
    }

    const data = await response.json();
    
    if (!data.content || data.content.length === 0) {
      throw new ApiError('Empty response from Claude API');
    }

    return data.content[0].text;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.status === 401) {
      throw new ApiError('Invalid API key. Please check your Claude API key in settings.', 401);
    } else if (error.status === 429) {
      throw new ApiError('Rate limit exceeded. Please try again in a few moments.', 429);
    } else if (error.type === 'insufficient_quota') {
      throw new ApiError('API quota exceeded. Please check your Claude API usage.', undefined, 'insufficient_quota');
    } else if (error.type === 'authentication_error') {
      throw new ApiError('Authentication failed. Please check your API key.', undefined, 'authentication_error');
    } else if (error.type === 'invalid_request_error') {
      throw new ApiError('Invalid request. Please try again with different input.', undefined, 'invalid_request_error');
    }
    
    throw new ApiError(`Failed to get response from Claude: ${error.message}`);
  }
}