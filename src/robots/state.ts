import fs from 'fs';
import { Query } from '../interfaces';

const contentFilePath = './state.json';

function save(state: Query) {
  const stringifyiedState = JSON.stringify(state);
  return fs.writeFileSync(contentFilePath, stringifyiedState);
}

function load() {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
  const state = JSON.parse(fileBuffer);
  return state;
}

export default { save, load };
