import gm from 'gm';
// @ts-ignore
import videoshow from 'videoshow';
import ffmpeg from 'fluent-ffmpeg';
// @ts-ignore
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
// @ts-ignore
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import path from 'path';

import { State } from '../interfaces';
import stateRobot from './state';

async function videoRobot() {
  const imageMagick = gm.subClass({ imageMagick: true });

  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);

  const state = stateRobot.load();

  await convertAllImages(state);
  await createYoutubeThumbnail();
  createFfmpegScript(state);
  await renderVideoWithFfmpeg(state);

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

  function createFfmpegScript(state: State) {
    stateRobot.saveScript(state);
  }

  async function renderVideoWithFfmpeg(state: State) {
    console.log(`> [video-robot] Rendering video with FFmpeg...`);

    return new Promise<void>((resolve, reject) => {
      let images = [];

      const audio = path.join(__dirname, '../../templates/1/newsroom.mp3');
      const video = path.join(__dirname, '../../images/video-maker.mp4');

      for (let sentenceIndex = 0; sentenceIndex < state.sentences.length; sentenceIndex++) {
        images.push({
          path: `./images/${sentenceIndex}-converted.png`,
          caption: state.sentences[sentenceIndex].text,
        });
      }

      const audioParams = {
        fade: true,
        delay: 1,
      };

      const videoOptions = {
        fps: 30,
        loop: 5, // seconds
        transition: true,
        transitionDuration: 1, // seconds
        videoBitrate: 1024,
        videoCodec: 'libx264',
        size: '640x?',
        audioBitrate: '128k',
        audioChannels: 2,
        format: 'mp4',
        pixelFormat: 'yuv420p',
        useSubRipSubtitles: false, // Use ASS/SSA subtitles instead
        subtitleStyle: {
          Fontname: 'Arial',
          Fontsize: '45',
          PrimaryColour: '11861244',
          SecondaryColour: '11861244',
          TertiaryColour: '11861244',
          BackColour: '-2147483640',
          Bold: '3',
          Italic: '0',
          BorderStyle: '2',
          Outline: '2',
          Shadow: '3',
          Alignment: '1', // left, middle, right
          MarginL: '100',
          MarginR: '60',
          MarginV: '200',
        },
      }

      videoshow(images, videoOptions)
        .audio(audio, audioParams)
        .save(video)
        .on('start', (command: any) => {
          console.log('\n\n [ FFmpeg still working in ]:\n\n', command, '\n\n[ Please wait... ]');
        })
        .on('error', (err: any, stdout: any, stderr: any) => {
          return reject(err);
        })
        .on('end', (output: any) => {
          console.log(
            '\n\n[video-robot] Finished processing. Video created:\n\n',
            output,
            '\n\n',
          );
          resolve();
        })
    });
  }
}

export default videoRobot;