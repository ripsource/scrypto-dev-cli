import { getCurrentNetwork } from '../utils/environment';

export function showEnv() {
  const network = getCurrentNetwork();
  
  if (network) {
    console.log(`Current environment: ${network}`);
  } else {
    console.log('No environment set. Use "scrypto-dev set-env <network>" to set one.');
  }
}