// Common English stop words to filter out
const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
  ]);
  
  export const processText = (text) => {
    // Tokenize text into words
    const tokens = text.toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    // Remove stop words and short words
    const keywords = tokens.filter(word => 
      !STOP_WORDS.has(word) && 
      word.length > 3
    );
  
    // Count word frequencies
    const wordFreq = {};
    keywords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  
    // Get top keywords
    const topKeywords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  
    return {
      fullText: text,
      keywords: topKeywords,
      tokenCount: tokens.length,
      summary: text.length > 100 ? text.slice(0, 100) + '...' : text
    };
  };
  
  export const findSimilarities = (nodeA, nodeB) => {
    const setA = new Set(nodeA.keywords);
    const setB = new Set(nodeB.keywords);
    
    // Calculate Jaccard similarity
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    
    return intersection.size / union.size;
  };
  
  export const calculateSentiment = (text) => {
    // Simple sentiment analysis based on positive/negative word counts
    const positiveWords = new Set([
      'good', 'great', 'awesome', 'excellent', 'happy', 'positive', 'wonderful',
      'amazing', 'fantastic', 'brilliant', 'beautiful', 'love', 'perfect'
    ]);
  
    const negativeWords = new Set([
      'bad', 'poor', 'terrible', 'awful', 'horrible', 'negative', 'sad',
      'worst', 'hate', 'difficult', 'wrong', 'fail', 'failed'
    ]);
  
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.has(word)).length;
    const negativeCount = words.filter(word => negativeWords.has(word)).length;
  
    return (positiveCount - negativeCount) / (words.length || 1);
  };