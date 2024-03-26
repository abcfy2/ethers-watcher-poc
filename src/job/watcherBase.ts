import {EventLog} from 'ethers';
import {Logger} from 'pino';
import {MAX_BLOCK_COUNT, NetworkParameters} from '../constant';

export abstract class WatcherBase {
  protected network: string;
  protected params: NetworkParameters;
  protected logger!: Logger;
  protected details: any;

  constructor(network: string) {
    this.network = network;
    this.params = new NetworkParameters(network);
    this.details = {};
  }

  async fullcheck() {
    this.details = await this.getMyWatchingDetails();

    if (this.details.status === 'RUNNING') {
      this.logger.info('The Latest watching cycle is still running, return.');
      return;
    }

    this.details.status = 'RUNNING';
    try {
      const latest = (await this.params.provider().getBlock('latest'))!.number;
      let {start, end} = this.calcCheckingEndpoint(this.details.start, latest);

      while (start < latest) {
        await this.batchProcessing(await this.fetchLogs(start, end));
        const result = this.calcCheckingEndpoint(end, latest);
        start = result.start;
        end = result.end;
      }
    } catch (err) {
      this.logger.error(err as any);
    } finally {
      this.details.status = 'STOPPED';
    }
  }

  async checkingLatest(count: number) {
    if (this.details.status === 'RUNNING') {
      this.logger.info('The Latest watching cycle is still running, return.');
      return;
    }

    this.details.status = 'RUNNING';
    try {
      await this.batchProcessing(await this.fetchLogs(count));
    } catch (err) {
      this.logger.error(err as any);
    } finally {
      this.details.status = 'STOPPED';
    }
  }

  protected abstract fetchLogs(
    start?: number,
    end?: number
  ): Promise<Array<EventLog>>;

  protected abstract processLog(log: EventLog): Promise<void>;

  protected abstract getMyWatchingDetails(): Promise<any>;

  private calcCheckingEndpoint(start: number, latest: number) {
    let end = latest;

    if (this.network === 'mumbai' || this.network === 'matic') {
      end = start + MAX_BLOCK_COUNT - 1;
    }

    this.logger.info('checking -------------------> %d ~ %d', start, end);
    return {start, end};
  }

  private async batchProcessing(logs: Array<EventLog>, batch = 1) {
    this.logger.info('log length: %d', logs.length);

    for (let i = 0; i < logs.length; i += batch) {
      this.logger.info('batch from: =================================> %d', i);

      const promises = [];
      for (let j = 0; j < batch; j++) {
        if (i + j < logs.length) {
          promises.push(this.processLog(logs[i + j]));
        }
      }
      await Promise.allSettled(promises);
    }
  }
}
