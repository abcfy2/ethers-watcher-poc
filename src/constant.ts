import {ethers} from 'ethers';
import {pino} from 'pino';
import {NFT_ABI} from './abi';
import {env} from './env';

export const LOGGER = pino({level: env.LOG_LEVEL});
export const MAX_BLOCK_COUNT: number = 3500;

export class NetworkParameters {
  private network: string;
  private p!: ethers.JsonRpcProvider;

  constructor(network: string) {
    this.network = network;
    this.initProvider();
  }

  chainId() {
    switch (this.network) {
      case 'mainnet':
        return 1;
      case 'maticmum':
        return 80001;
      case 'matic':
        return 137;
      case 'ganache':
        return 1337;
      default:
        throw new Error(`Unsupported Network: ${this.network}`);
    }
  }

  initProvider() {
    this.p = new ethers.InfuraProvider(this.network, env.INFURA_PROJECT_ID);
    this.p.pollingInterval = 12000;
  }

  myNftContract() {
    return new ethers.Contract(env.MY_NFT_CONTRACT_ADDRESS, NFT_ABI, this.p);
  }

  provider() {
    return this.p;
  }
}
