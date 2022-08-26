import CronStrue from 'cronstrue';

export const DEFAULT_RRM_CRON = '*/10 * * * *';

export type RrmParts = {
  vendorShortName?: string;
  algorithmShortName?: string;
  schedule?: string;
  parameters?: string;
};

export const parseRrmToParts = (rrm: string) => {
  if (rrm === 'no' || rrm === 'inherit') {
    return undefined;
  }
  const [vendorShortName, algorithmShortName, schedule, parameters] = rrm.split(':');

  const splitSchedule = schedule ? schedule.split(' ') : undefined;
  const fullSchedule = splitSchedule ? splitSchedule.splice(1, 5).join(' ') : undefined;

  return {
    vendorShortName,
    algorithmShortName,
    schedule: fullSchedule,
    parameters,
  } as RrmParts;
};

export type RrmErrors = {
  vendorShortName?: boolean;
  algorithmShortName?: string;
  schedule?: string;
  parameters?: string;
};

export const areRrmParamsValid = (parameters?: string, regex?: string) => {
  if (!parameters || parameters.length === 0) return true;
  if (!regex || regex.length === 0) return true;
  const finalRegex = `^${regex}$`;
  const re = new RegExp(finalRegex);
  return re.test(parameters);
};

export const isScheduleValid = (schedule?: string) => {
  if (!schedule) return false;

  const split = schedule.split(' ');
  if (split.length !== 5 || split.findIndex((x) => x.trim().length === 0) !== -1) return false;

  try {
    const interval = CronStrue.toString(schedule);
    return interval !== undefined;
  } catch (err) {
    return false;
  }
};

export const getCronSchedulerLabel = (schedule?: string) => {
  if (!schedule) return undefined;

  const split = schedule.split(' ');
  if (split.length !== 5 || split.findIndex((x) => x.trim().length === 0) !== -1) return undefined;

  try {
    const interval = CronStrue.toString(schedule);
    return interval;
  } catch (err) {
    return undefined;
  }
};

export const isValidRrm = (rrm: string, regex?: string) => {
  try {
    const parts = parseRrmToParts(rrm);

    if (parts !== undefined) {
      if (parts.vendorShortName === undefined) return false;
      if (parts.algorithmShortName === undefined) return false;
      if (parts.schedule === undefined) return false;
      if (parts.parameters === undefined) return false;
      if (!areRrmParamsValid(parts.parameters, regex)) return false;
      if (!isScheduleValid(parts.schedule)) return false;
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
