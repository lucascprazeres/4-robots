import fs from 'fs';
import { State } from '../interfaces';

const contentFilePath = './state.json';
const scriptFilePath = `./images/ffmpeg-script.js`;

function save(state: State) {
  const stringifyiedState = JSON.stringify(state);
  return fs.writeFileSync(contentFilePath, stringifyiedState);
}

function saveScript(state: State) {
  const stringifyiedState = JSON.stringify(state);
  const stringifyiedScript = `var content = ${stringifyiedState}`;
  return fs.writeFileSync(scriptFilePath, stringifyiedScript);
}

function load(): State {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
  const state = JSON.parse(fileBuffer);
  return state;
}

export default { save, saveScript, load };
