// @ts-ignore
import Algorithmia from 'algorithmia';
// @ts-ignore
import SentenceBoundaryDetection from 'sbd';
import { Query, Sentence } from '../interfaces';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

import stateRobot from './state';

async function textRobot() {
  const watsonStringifyiedCredentials = process.env.IBM_WATSON_CREDENTIALS || '{}';
  const watsonCredentials = JSON.parse(watsonStringifyiedCredentials);
  const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: watsonCredentials.apikey }),
    version: '2018-04-05',
    serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com'
  });

  const query = stateRobot.load();

  await fetchContentFromWikipedia(query);
  sanitizeContent(query);
  breakContentIntoSentences(query);
  limitMaximumSenteces(query);
  await fetchKeywordsOfAllSenteces(query);

  stateRobot.save(query);

  async function fetchContentFromWikipedia(query: Query) {
    const algotihmiaAuthenticated = Algorithmia.client(process.env.ALGORITHMIA_KEY);
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
      return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
    }
  }

  function breakContentIntoSentences(query: Query) {
    query.sentences = [] as Sentence[];

    const sentences = SentenceBoundaryDetection.sentences(query.sourceContentSanitized);

    sentences.forEach((sentence: string) => {
      query.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }

  function limitMaximumSenteces(query: Query) {
    query.sentences = query.sentences.slice(0, query.maximumSentences);
  }

  async function fetchKeywordsOfAllSenteces(query: Query) {
    for (let sentence of query.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
    }
  }

  async function fetchWatsonAndReturnKeywords(sentence: string) {
    const { result } = await nlu.analyze({
      text: sentence,
      features: {
        keywords: {},
      }
    });

    if (!result.keywords) {
      throw new Error(`Watson couldn't interpretate the sentence "${sentence}".`);
    }

    return result.keywords.map(keyword => {
      return keyword.text ? keyword.text : '';
    });
  }
}

export default textRobot;