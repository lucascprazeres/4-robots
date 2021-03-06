import gm from 'gm';

import { State } from '../interfaces';
import stateRobot from './state';
import templateSettings from './settings/template';

const imageMagick = gm.subClass({ imageMagick: true });

async function videoRobot() {
  const state = stateRobot.load();

  await convertAllImages(state);
  await createAllSentenceImages(state);
  await createYoutubeThumbnail();

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

      imageMagick(inputFile)
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

  async function createAllSentenceImages(state: State) {
    for (let sentenceIndex = 0; sentenceIndex < state.sentences.length; sentenceIndex++) {
      await createSentenceImage(sentenceIndex, state.sentences[sentenceIndex].text);
    }
  }

  async function createSentenceImage(sentenceIndex: number, sentenceText: string) {
    return new Promise<void>((resolve, reject) => {
      const outputFile = `./images/${sentenceIndex}-sentence.png`;

      const { width, height, gravity } = templateSettings[sentenceIndex];
  
      imageMagick(width, height)
        .out('-gravity', gravity)
        .out('-background', 'transparent')
        .out('-fill', 'white')
        .out('-kerning', '-1')
        .out(`caption:${sentenceText}`)
        .write(outputFile, error => {
          if (error) {
            return reject(error);
          }

          console.log(`> sentence created: ${outputFile}`);
          resolve();
        });    
    });
  }

  async function createYoutubeThumbnail() {
    return new Promise<void>((resolve, reject) => {
      imageMagick('./images/0-converted.png')
      .write('./images/youtube-thumbnail.jpg', error => {
        if (error) {
          return reject(error);
        }

        console.log('> created youtube thumbnail');
        resolve();
      })
    })
  }
}

export default videoRobot;