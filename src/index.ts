import 'dotenv/config';
import robots from './robots';

async function start() {
  robots.input()
  await robots.text();

  const state = robots.state.load();
  console.dir(state, { depth: null });
}

start();