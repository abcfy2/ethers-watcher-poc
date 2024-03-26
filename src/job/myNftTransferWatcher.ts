import {EventLog} from 'ethers';
import {checkingPoint} from './watcher';
import {WatcherBase} from './watcherBase';
import {LOGGER} from '../constant';

export default class MyNftTrasnferWatcher extends WatcherBase {
  constructor(network: string) {
    super(network);
    this.logger = LOGGER.child({from: `MyNftWatcher.${network}`});
  }

  protected fetchLogs(
    start: number,
    end?: number | undefined
  ): Promise<EventLog[]> {
    const filter = this.params.myNftContract().filters.Transfer();
    if (start < 0) {
      return this.params.myNftContract().queryFilter(filter, start) as Promise<
        EventLog[]
      >;
    } else {
      return this.params
        .myNftContract()
        .queryFilter(filter, start, end) as Promise<EventLog[]>;
    }
  }
  protected processLog(log: EventLog): Promise<void> {
    const from = log.args.from;
    const to = log.args.to;
    const tokenId = log.args.tokenId.toString();
    this.logger.info(
      'Transfer event from %s to %s for token %s',
      from,
      to,
      tokenId
    );
    this.logger.info(log);
    return Promise.resolve();
  }
  protected getMyWatchingDetails(): Promise<any> {
    return Promise.resolve(checkingPoint[this.network].mynft);
  }
}
