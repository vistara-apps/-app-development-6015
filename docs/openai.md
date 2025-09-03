# OpenAI Integration Documentation

This document provides detailed information about the OpenAI integration in ScholarSift, including API usage, prompt engineering, and optimization strategies.

## Overview

ScholarSift uses OpenAI's API to generate summaries of research papers. The integration is designed to be efficient, cost-effective, and produce high-quality summaries that capture the key aspects of academic papers.

## API Configuration

ScholarSift uses the OpenAI Node.js client library to interact with the API. The configuration is as follows:

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // Optional: Use OpenRouter for more model options
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from the backend
})
```

## Environment Variables

The following environment variables are required for OpenAI integration:

```
VITE_OPENAI_API_KEY=your-openai-api-key
```

## Models Used

ScholarSift uses different models based on the subscription tier:

1. **Free Tier**:
   - Model: `google/gemini-2.0-flash-001`
   - Max tokens: 1000
   - Temperature: 0.3

2. **Basic Tier**:
   - Model: `google/gemini-2.0-flash-001`
   - Max tokens: 1500
   - Temperature: 0.3

3. **Premium Tier**:
   - Model: `google/gemini-2.0-pro-001`
   - Max tokens: 2000
   - Temperature: 0.2

## Prompt Engineering

The prompt used for paper summarization is carefully designed to extract the most relevant information from research papers:

```javascript
const prompt = `Please provide a comprehensive summary of this research paper. Include:

1. **Main Objective**: What problem does this paper address?
2. **Key Methodology**: How did the authors approach the problem?
3. **Major Findings**: What are the most important results?
4. **Significance**: Why is this research important?
5. **Limitations**: What are the acknowledged limitations?

Paper content:
${paperContent}

Please format the response in clear sections and keep it concise but comprehensive.`
```

### System Message

A system message is used to set the context for the AI:

```javascript
{
  role: 'system',
  content: 'You are an expert research assistant specializing in academic paper analysis. Provide clear, structured summaries that help researchers quickly understand key insights.'
}
```

## API Call Implementation

The API call to OpenAI is implemented as follows:

```javascript
export const summarizePaper = async (paperContent, paperUrl) => {
  try {
    const prompt = `Please provide a comprehensive summary of this research paper. Include:

1. **Main Objective**: What problem does this paper address?
2. **Key Methodology**: How did the authors approach the problem?
3. **Major Findings**: What are the most important results?
4. **Significance**: Why is this research important?
5. **Limitations**: What are the acknowledged limitations?

Paper content:
${paperContent}

Please format the response in clear sections and keep it concise but comprehensive.`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert research assistant specializing in academic paper analysis. Provide clear, structured summaries that help researchers quickly understand key insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    return {
      summary: response.choices[0].message.content,
      url: paperUrl,
      dateCreated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error summarizing paper:', error)
    throw new Error('Failed to generate summary. Please try again.')
  }
}
```

## Error Handling

Errors from OpenAI API calls are handled as follows:

1. **Rate Limiting**:
   - Implement exponential backoff for retries
   - Display appropriate error messages to the user

2. **Token Limits**:
   - Truncate long papers to fit within token limits
   - Split very long papers into sections and summarize each section

3. **API Errors**:
   - Log detailed error information
   - Display user-friendly error messages

## Optimization Strategies

### Token Usage Optimization

To optimize token usage and reduce costs:

1. **Text Preprocessing**:
   - Remove irrelevant sections (e.g., references, acknowledgments)
   - Extract the most important sections (abstract, introduction, methods, results, discussion)

2. **Chunking for Long Papers**:
   - Split long papers into manageable chunks
   - Summarize each chunk separately
   - Combine the summaries into a coherent whole

### Cost Management

Strategies for managing API costs:

1. **Caching**:
   - Cache summaries to avoid redundant API calls
   - Implement a TTL (time-to-live) for cached summaries

2. **Tiered Usage**:
   - Limit the number of summaries based on subscription tier
   - Use more efficient models for free tier users

## Quality Assurance

To ensure high-quality summaries:

1. **Prompt Testing**:
   - Test prompts with various paper types (e.g., different fields, lengths)
   - Refine prompts based on output quality

2. **Output Validation**:
   - Validate that summaries include all required sections
   - Check for coherence and accuracy

## Security Considerations

1. **API Key Security**:
   - Store API keys securely
   - Use environment variables for API keys
   - In production, make API calls from the backend

2. **Data Privacy**:
   - Ensure paper content is not stored unnecessarily
   - Implement data retention policies

## Fallback Mechanisms

In case of API unavailability:

1. **Alternative Models**:
   - Implement fallback to alternative models or providers
   - Use a local, lightweight model as a last resort

2. **Graceful Degradation**:
   - Provide cached summaries when available
   - Offer alternative functionality when summarization is unavailable

## Monitoring and Logging

For monitoring API usage and performance:

1. **Usage Metrics**:
   - Track token usage per user
   - Monitor API costs

2. **Performance Metrics**:
   - Track response times
   - Monitor error rates

## Future Improvements

Planned improvements for the OpenAI integration:

1. **Custom Fine-tuning**:
   - Fine-tune models specifically for academic paper summarization
   - Improve performance for specific fields (e.g., medicine, computer science)

2. **Advanced Features**:
   - Implement question-answering about papers
   - Generate literature reviews from multiple papers
   - Extract and visualize key concepts and relationships

