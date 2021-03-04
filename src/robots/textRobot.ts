// @ts-ignore
import algorithmia from 'algorithmia';
import { Query } from '../interfaces';

async function textRobot(query: Query) {
  await fetchContentFromWikipedia(query);
  sanitizeContent(query);
  // breakContentIntoSentences(query);

  async function fetchContentFromWikipedia(query: Query) {
    const algotihmiaAuthenticated = algorithmia(process.env.ALGORITHMIA_KEY);
    const wikipediaAlgorithm = algotihmiaAuthenticated.algo('web/WikipediaParser/0.1.2?timeout=300');
    const wikipediaResponse = await wikipediaAlgorithm.pipe({ articleName: query.searchTerm, lang: 'en' });
    const wikipediaContent = wikipediaResponse.get();
    
    query.sourceContentOriginal = wikipediaContent.content;
  }

  function sanitizeContent(query: Query) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(query.sourceContentOriginal);
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown);
    
    query.sourceContentSanitized = withoutDatesInParentheses;

    function removeBlankLinesAndMarkdown(text: string) {
      const allLines = text.split('\n');

      const withoutBlankLinesAndMarkdown = allLines.filter(line => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false;
        }
        return true;
      });

      return withoutBlankLinesAndMarkdown.join(' ');
    }

    function removeDatesInParentheses(text: string) {
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
    }
  }
}

export default textRobot;