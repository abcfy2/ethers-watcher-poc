import schedule from 'node-schedule';
import {LOGGER} from '../constant';
import {scheduleJob} from './handler';
import MyNftTrasnferWatcher from './myNftTransferWatcher';

export const checkingPoint: {
  [key: string]: {
    [key: string]: {
      start?: number;
      end?: number;
    };
  };
} = {
  mainnet: {
    mynft: {
      start: 12771140,
    },
  },
  matic: {
    mynft: {
      start: 0,
    },
  },
};

export async function startWatcher() {
  const count = -60;
  const myNftTrasnferWatcher = new MyNftTrasnferWatcher('mainnet');

  // if you need fullcheck the history, you can use the following line
  // await myNftTrasnferWatcher.fullcheck();

  scheduleJob('*/2 * * * *', fireDate => {
    LOGGER.info('Schedule Job at %s', fireDate);
    myNftTrasnferWatcher.checkingLatest(count);
  });
}
