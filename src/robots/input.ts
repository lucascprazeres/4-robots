import readline from 'readline-sync';
import { State } from '../interfaces';
import stateRobot from './state';

export default function inputRobot() {
  const state = {
    maximumSentences: 7,
  } as State;

  state.searchTerm = askAndReturnSearchTerm();
  state.prefix = askAndReturnPrefix();
  stateRobot.save(state);

  function askAndReturnSearchTerm() {
    return readline.question('Type a Wikipedia search term: ');
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes);
    const selectedPrefix = prefixes[selectedPrefixIndex];

    return selectedPrefix;
  }
}