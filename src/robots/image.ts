import { google } from 'googleapis';
import { State } from '../interfaces';
import stateRobot from './state';

const customSearch = google.customsearch('v1');
const googleSearchCredentials = {
  auth: process.env.CUSTOM_SEARCH_API_KEY || '',
  cx: process.env.SEARCH_ENGINE_ID || '',
}

async function imageRobot() {
  const state = stateRobot.load();

  await fetchImagesOfAllSentences(state);

  stateRobot.save(state);

  async function fetchImagesOfAllSentences(state: State) {
    for (let sentence of state.sentences) {
      const query = `${state.searchTerm} ${sentence.keywords[0]}`;
      sentence.images = await fetchGoogleAndReturnImageLinks(query);

      sentence.googleSearchQuery = query;
    }
  }

  async function fetchGoogleAndReturnImageLinks(query: string) {
    const response = await customSearch.cse.list({
      ...googleSearchCredentials,
      q: query,
      searchType: 'image',
      imgSize: 'huge',
      num: 2
    });

    if (!response.data.items) {
      return [];
    }

    const imagesURL = response.data.items.map(item => {
      return item.link ? item.link : '';
    });

    return imagesURL;
  }
}

export default imageRobot;