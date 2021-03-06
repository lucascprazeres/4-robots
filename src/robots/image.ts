import { google } from 'googleapis';
// @ts-ignore
import download from 'image-downloader';
import gm from 'gm';
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
  await downloadAllImages(state);

  stateRobot.save(state);
  await convertAllImages(state);

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

  async function downloadAllImages(state: State) {
    state.downloadedImages = [];

    for (let sentenceIndex = 0; sentenceIndex < state.sentences.length; sentenceIndex++) {
      const images = state.sentences[sentenceIndex].images;

      for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageURL = images[imageIndex];

        try {
          if (state.downloadedImages.includes(imageURL)) {
            throw new Error('Image was already downloaded.');
          }

          await downloadAndSaveImage(imageURL, `${sentenceIndex}-original.png`);

          console.log(`> [${sentenceIndex}][${imageIndex}] Sucessfully downloaded image: ${imageURL}`);
        } catch (err) {
          console.log(`> [${sentenceIndex}][${imageIndex}] Failed to download image ${imageURL}: ${err}`)
        }
      }
    }
  }

  async function downloadAndSaveImage(url: string, filename: string) {
    return download.image({
      url,
      dest: `./images/${filename}`
    })
  }

  async function convertAllImages(state: State) {
    for (let sentenceIndex = 0; sentenceIndex < state.sentences.length; sentenceIndex++) {
      await convertImageInIndex(sentenceIndex);
    }
  }

  async function convertImageInIndex(sentenceIndex: number) {
    return new Promise<void>((resolve, reject) => {
      const inputFile = `./images/${sentenceIndex}-original.png[0]`;
      const outputFile = `./images/${sentenceIndex}-converted.png`;
      const [width, height] = [1920, 1080];

      gm
        .subClass({ imageMagick: true })(inputFile)
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-blur', '0x9')
          .out('-resize', `${width}x${height}^`)
        .out(')')
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-resize', `${width}x${height}`)
        .out(')')
        .out('-delete', '0')
        .out('-gravity', 'center')
        .out('-compose', 'over')
        .out('-composite')
        .out('-extent', `${width}x${height}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [video-robot] Image converted: ${outputFile}`)
          resolve()
        })
    })
  }
}

export default imageRobot;