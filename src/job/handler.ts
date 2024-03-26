import schedule, {
  JobCallback,
  RecurrenceRule,
  RecurrenceSpecDateRange,
  RecurrenceSpecObjLit,
} from 'node-schedule';
import {LOGGER} from '../constant';

export function scheduleJob(
  rule:
    | RecurrenceRule
    | RecurrenceSpecDateRange
    | RecurrenceSpecObjLit
    | Date
    | string
    | number,
  handler: JobCallback
) {
  return schedule.scheduleJob(rule, handler);
}

process.on('SIGINT', function () {
  schedule.gracefulShutdown().then(() => {
    LOGGER.info('All jobs have been stopped.');
  });
});
