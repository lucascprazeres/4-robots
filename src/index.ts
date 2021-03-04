import readline from 'readline-sync';

interface Query {
  searchTerm: string;
  prefix: string;
}

function start() {
  const query = {} as Query;

  query.searchTerm = askAndReturnSearchTerm();
  query.prefix = askAndReturnPrefix();

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