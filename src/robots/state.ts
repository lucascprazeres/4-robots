import fs from 'fs';
import { State } from '../interfaces';

const contentFilePath = './state.json';

function save(state: State) {
  const stringifyiedState = JSON.stringify(state);
  return fs.writeFileSync(contentFilePath, stringifyiedState);
}

function load() {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
  const state = JSON.parse(fileBuffer);
  return state;
}

export default { save, load };
