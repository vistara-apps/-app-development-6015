import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-test-key', // Replace with your OpenAI API key
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

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

// Mock function to extract paper content from URL/DOI
export const extractPaperContent = async (url) => {
  // In a real implementation, this would:
  // 1. Fetch the paper from the URL
  // 2. Extract text content (PDF parsing, HTML scraping, etc.)
  // 3. Return the extracted text
  
  // For demo purposes, return mock content
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  
  return `
    Title: Advanced Machine Learning Techniques for Natural Language Processing

    Abstract: This paper presents novel approaches to natural language processing using transformer architectures. We demonstrate significant improvements in text classification and sentiment analysis tasks through the application of attention mechanisms and transfer learning.

    Introduction: Natural language processing (NLP) has seen remarkable advances with the introduction of transformer models. This work builds upon previous research to develop more efficient and accurate text processing methods.

    Methodology: We employed a multi-layer transformer architecture with self-attention mechanisms. The model was trained on a large corpus of text data using transfer learning techniques.

    Results: Our approach achieved state-of-the-art performance on several benchmark datasets, showing 15% improvement in accuracy compared to previous methods.

    Conclusion: The proposed methodology demonstrates the effectiveness of advanced transformer architectures in NLP tasks, with potential applications in various domains.
  `
}