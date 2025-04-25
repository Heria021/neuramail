# AI Integration Library

This library provides AI-powered functionality for the Neuramail application, including email reply generation and email-related queries.

## Setup

1. Install the required dependencies:
```bash
npm install openai
```

2. Set up your environment variables:
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

## Features

### Email Reply Generation
```typescript
import { generateEmailReply } from '@/lib/ai';

const response = await generateEmailReply({
  subject: "Product Inquiry",
  previousMessages: ["Previous message content..."],
  tone: "professional"
});
```

### Email Query Handling
```typescript
import { handleEmailQuery } from '@/lib/ai';

const response = await handleEmailQuery("When is my next meeting?", {
  emails: [{
    subject: "Meeting Invitation",
    content: "Meeting content...",
    date: "2024-03-20"
  }]
});
```

## Configuration

The library can be configured through the `AI_CONFIG` object in `config.ts`:

- `model`: The OpenAI model to use (default: 'gpt-3.5-turbo')
- `temperature`: Controls randomness in responses (default: 0.7)
- `maxTokens`: Maximum length of generated responses (default: 500)
- `defaultTone`: Default tone for generated responses (default: 'professional')
- `maxContextLength`: Maximum length of input context (default: 2000)

## Error Handling

The library includes built-in error handling and validation:

- API key validation
- Input validation
- Error messages for common failure cases

## Best Practices

1. Always validate the API key before making requests
2. Sanitize and truncate input text when necessary
3. Handle errors gracefully in your application
4. Consider rate limiting and caching for production use

## Security Considerations

- Never expose your OpenAI API key in client-side code
- Use environment variables for sensitive configuration
- Implement proper error handling to prevent information leakage 