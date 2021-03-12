import 'dotenv/config';
import robots from './robots';

async function start() {
  robots.input()
  await robots.text();
  await robots.image();
  await robots.video();
  await robots.youtube();
}

start();