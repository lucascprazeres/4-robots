import 'dotenv/config';
import readline from 'readline-sync';
import { Query } from './interfaces';
import robots from './robots';

async function start() {
  const query = {} as Query;

  query.searchTerm = askAndReturnSearchTerm();
  query.prefix = askAndReturnPrefix();

  await robots.text(query);

  function askAndReturnSearchTerm() {
    return readline.question('Type a Wikipedia search term: ');
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of'];
    const selectedPrefixIndex = readline.keyInSelect(prefixes);
    const selectedPrefix = prefixes[selectedPrefixIndex];

    return selectedPrefix;
  }

  console.log(query);
}

start();