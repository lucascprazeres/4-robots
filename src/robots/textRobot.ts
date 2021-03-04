// @ts-ignore
import algorithmia from 'algorithmia';
import { Query } from '../interfaces';

async function textRobot(query: Query) {
  await fetchContentFromWikipedia(query);
  // sanitizeContent(query);
  // breakContentIntoSentences(query);

  async function fetchContentFromWikipedia(query: Query) {
    const algotihmiaAuthenticated = algorithmia(process.env.ALGORITHMIA_KEY);
    const wikipediaAlgorithm = algotihmiaAuthenticated.algo('web/WikipediaParser/0.1.2?timeout=300');
    const wikipediaResponse = await wikipediaAlgorithm.pipe(query.searchTerm);
    const wikipediaContent = wikipediaResponse.get();
    
    query.sourceContentOriginal = wikipediaContent.content;
  }
}

export default textRobot;