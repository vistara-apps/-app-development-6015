// Paper extraction service
// This service handles extracting content from various paper sources

// Helper function to determine the type of paper source
const getPaperSourceType = (url) => {
  if (!url) return null
  
  // Check if it's a DOI
  if (url.startsWith('10.') || url.toLowerCase().startsWith('doi:') || url.includes('doi.org')) {
    return 'doi'
  }
  
  // Check if it's an arXiv URL
  if (url.includes('arxiv.org')) {
    return 'arxiv'
  }
  
  // Check if it's a PDF
  if (url.toLowerCase().endsWith('.pdf')) {
    return 'pdf'
  }
  
  // Default to generic URL
  return 'url'
}

// Extract DOI from various formats
const extractDoi = (doiString) => {
  // Handle "doi:10.xxxx/xxxx" format
  if (doiString.toLowerCase().startsWith('doi:')) {
    return doiString.substring(4).trim()
  }
  
  // Handle "10.xxxx/xxxx" format
  if (doiString.startsWith('10.')) {
    return doiString.trim()
  }
  
  // Handle "https://doi.org/10.xxxx/xxxx" format
  if (doiString.includes('doi.org/')) {
    const match = doiString.match(/doi\.org\/([^\/]+\/[^\/\s]+)/)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  throw new Error('Invalid DOI format')
}

// Extract arXiv ID from URL
const extractArxivId = (url) => {
  // Handle formats like https://arxiv.org/abs/2101.12345
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)/)
  if (match && match[1]) {
    return match[1].trim()
  }
  
  throw new Error('Invalid arXiv URL format')
}

// Fetch paper metadata from Crossref API using DOI
const fetchDoiMetadata = async (doi) => {
  try {
    const response = await fetch(`https://api.crossref.org/works/${doi}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch DOI metadata: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.message
  } catch (error) {
    console.error('Error fetching DOI metadata:', error)
    throw new Error('Failed to fetch paper metadata from DOI')
  }
}

// Fetch paper metadata and abstract from arXiv API
const fetchArxivMetadata = async (arxivId) => {
  try {
    const response = await fetch(`https://export.arxiv.org/api/query?id_list=${arxivId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch arXiv metadata: ${response.statusText}`)
    }
    
    const data = await response.text()
    
    // Parse XML response (simplified for demo)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data, 'text/xml')
    
    const title = xmlDoc.querySelector('entry title')?.textContent || ''
    const abstract = xmlDoc.querySelector('entry summary')?.textContent || ''
    const authors = Array.from(xmlDoc.querySelectorAll('entry author name')).map(node => node.textContent)
    
    return {
      title,
      abstract,
      authors
    }
  } catch (error) {
    console.error('Error fetching arXiv metadata:', error)
    throw new Error('Failed to fetch paper metadata from arXiv')
  }
}

// Extract text content from PDF URL (simplified mock for demo)
// In a real implementation, this would use a PDF parsing library or service
const extractPdfContent = async (pdfUrl) => {
  // This is a mock implementation
  // In a real app, you would use a PDF parsing library or service
  console.log('Extracting content from PDF:', pdfUrl)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return `
    [This is extracted PDF content from ${pdfUrl}]
    
    Title: Advanced Machine Learning Techniques for Natural Language Processing
    
    Abstract: This paper presents novel approaches to natural language processing using transformer architectures. We demonstrate significant improvements in text classification and sentiment analysis tasks through the application of attention mechanisms and transfer learning.
    
    Introduction: Natural language processing (NLP) has seen remarkable advances with the introduction of transformer models. This work builds upon previous research to develop more efficient and accurate text processing methods.
    
    Methodology: We employed a multi-layer transformer architecture with self-attention mechanisms. The model was trained on a large corpus of text data using transfer learning techniques.
    
    Results: Our approach achieved state-of-the-art performance on several benchmark datasets, showing 15% improvement in accuracy compared to previous methods.
    
    Conclusion: The proposed methodology demonstrates the effectiveness of advanced transformer architectures in NLP tasks, with potential applications in various domains.
  `
}

// Extract content from generic URL (simplified mock for demo)
// In a real implementation, this would use web scraping or a service like Diffbot
const extractUrlContent = async (url) => {
  // This is a mock implementation
  // In a real app, you would use a web scraping library or service
  console.log('Extracting content from URL:', url)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return `
    [This is extracted content from ${url}]
    
    Title: Advanced Machine Learning Techniques for Natural Language Processing
    
    Abstract: This paper presents novel approaches to natural language processing using transformer architectures. We demonstrate significant improvements in text classification and sentiment analysis tasks through the application of attention mechanisms and transfer learning.
    
    Introduction: Natural language processing (NLP) has seen remarkable advances with the introduction of transformer models. This work builds upon previous research to develop more efficient and accurate text processing methods.
    
    Methodology: We employed a multi-layer transformer architecture with self-attention mechanisms. The model was trained on a large corpus of text data using transfer learning techniques.
    
    Results: Our approach achieved state-of-the-art performance on several benchmark datasets, showing 15% improvement in accuracy compared to previous methods.
    
    Conclusion: The proposed methodology demonstrates the effectiveness of advanced transformer architectures in NLP tasks, with potential applications in various domains.
  `
}

// Main function to extract paper content from various sources
export const extractPaperContent = async (source) => {
  try {
    const sourceType = getPaperSourceType(source)
    
    switch (sourceType) {
      case 'doi': {
        const doi = extractDoi(source)
        const metadata = await fetchDoiMetadata(doi)
        
        // Format the metadata into a readable text
        const title = metadata.title?.[0] || 'Unknown Title'
        const authors = (metadata.author || []).map(a => a.given + ' ' + a.family).join(', ')
        const abstract = metadata.abstract || 'No abstract available'
        const journal = metadata['container-title']?.[0] || 'Unknown Journal'
        const year = metadata.published?.['date-parts']?.[0]?.[0] || 'Unknown Year'
        
        return `
          Title: ${title}
          
          Authors: ${authors}
          
          Journal: ${journal} (${year})
          
          DOI: ${doi}
          
          Abstract: ${abstract}
        `
      }
      
      case 'arxiv': {
        const arxivId = extractArxivId(source)
        const metadata = await fetchArxivMetadata(arxivId)
        
        return `
          Title: ${metadata.title}
          
          Authors: ${metadata.authors.join(', ')}
          
          arXiv ID: ${arxivId}
          
          Abstract: ${metadata.abstract}
        `
      }
      
      case 'pdf':
        return await extractPdfContent(source)
      
      case 'url':
        return await extractUrlContent(source)
      
      default:
        throw new Error('Unsupported paper source type')
    }
  } catch (error) {
    console.error('Error extracting paper content:', error)
    throw new Error(`Failed to extract paper content: ${error.message}`)
  }
}

