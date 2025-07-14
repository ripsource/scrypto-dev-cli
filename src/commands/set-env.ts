import { setCurrentNetwork, isValidNetwork } from '../utils/environment';

export function setEnv(network: string) {
  if (!isValidNetwork(network)) {
    console.log('Invalid network. Please use "stokenet" or "mainnet"');
    return;
  }
  
  setCurrentNetwork(network);
  console.log(`Environment set to: ${network}`);
}