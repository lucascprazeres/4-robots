import readline from 'readline-sync';
import { Query } from '../interfaces';
import stateRobot from './state';

export default function inputRobot() {
  const query = {
    maximumSentences: 7,
  } as Query;

  query.searchTerm = askAndReturnSearchTerm();
  query.prefix = askAndReturnPrefix();
  stateRobot.save(query);

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