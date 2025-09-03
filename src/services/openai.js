import OpenAI from 'openai'
import { extractPaperContent as extractContent } from './paperExtraction'

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

// Function to extract paper content from URL/DOI
export const extractPaperContent = async (url) => {
  try {
    return await extractContent(url)
  } catch (error) {
    console.error('Error in paper extraction:', error)
    throw new Error(`Failed to extract paper content: ${error.message}`)
  }
}
